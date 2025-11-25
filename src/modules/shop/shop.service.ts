import type { Database, User } from '@database/types/schema'
import type { Transaction } from 'kysely'

import { sql } from 'kysely'

import { db } from '@/db/client'
import { VipService } from '@/external/vip/vip.service'
import { ApiErrorFactory } from '@/utils/exceptions/api-error'

import { CartService } from '../cart/cart.service'
import { ProductService } from '../product'
import { PurchaseError } from './helpers'

type Trx = Transaction<Database>

interface PurchaseItem {
	productVariantId: number
	serverId: number
}

export interface PurchaseResult {
	success: boolean
	item: PurchaseItem
	purchaseId?: number
	error?: string
}

export const getShopProducts = async () => {
	const products = await db
		.selectFrom('products')
		.select(['id', 'name', 'description', 'type', 'advantages', 'discount_percent', 'enabled'])
		.where('enabled', '=', true)
		.execute()

	const variants = await db
		.selectFrom('product_variants')
		.select(['id', 'product_id', 'price', 'duration_label', 'duration_days'])
		.where(
			'product_id',
			'in',
			products.map((p) => p.id)
		)
		.execute()

	const result = products.map((p) => ({
		...p,
		variants: variants.filter((v) => v.product_id === p.id),
	}))

	return result
}

const chargeUser = async (trx: Trx, userId: User['id'], amount: number) => {
	await trx
		.updateTable('users')
		.set({ balance: sql`balance - ${amount}` })
		.where('id', '=', userId)
		.execute()
}

const createPurchase = async (trx: Trx, userId: User['id'], item: PurchaseItem, amount: number) => {
	const [res] = await trx
		.insertInto('user_purchases')
		.values({
			user_id: userId,
			product_variant_id: item.productVariantId,
			server_id: item.serverId,
			amount,
		})
		.execute()

	return Number(res.insertId)
}

export const removeDuplicateItems = (items: PurchaseItem[]) => {
	const seen = new Set<string>()
	const result: PurchaseItem[] = []

	for (const item of items) {
		const key = `${item.productVariantId}-${item.serverId}`

		if (!seen.has(key)) {
			seen.add(key)
			result.push(item)
		}
	}

	return result
}

interface ProductVariantInfo {
	id: number
	productId: number
	price: number
	enabled: boolean
	durationDays: number
}

const getProductVariantsInfo = async (variantIds: number[]) => {
	const map = new Map<number, ProductVariantInfo>()

	if (!variantIds.length) return map

	const variants = await db
		.selectFrom('product_variants as pv')
		.innerJoin('products as p', 'pv.product_id', 'p.id')
		.select([
			'pv.id as id',
			'pv.price as price',
			'p.id as productId',
			'p.enabled as enabled',
			'duration_days as durationDays',
		])
		.where('pv.id', 'in', variantIds)
		.execute()

	for (const v of variants) map.set(v.id, v)

	return map
}

export const purchaseItems = async (user: User) => {
	const results: PurchaseResult[] = []

	const userCartItems = await CartService.getUserCartItems(user.id)
	if (userCartItems.length === 0) throw ApiErrorFactory.BadRequest('Корзина пуста')

	let currentUserBalance = user.balance
	let totalAmount: number = 0

	const itemsInfo = await getProductVariantsInfo(userCartItems.map((i) => i.product_variant_id))

	userCartItems.forEach((item) => {
		totalAmount += itemsInfo.get(item.product_variant_id)?.price ?? 0
	})

	try {
		if (currentUserBalance < totalAmount) {
			throw new PurchaseError(`Недостаточно средств`)
		}
	} catch (error) {
		console.error(error)
		throw ApiErrorFactory.create('Недостаточно средств', 402)
	}

	for (const item of userCartItems) {
		try {
			const variant = itemsInfo.get(item.product_variant_id)!
			if (!variant) {
				throw new Error(`Вариант товара с ID ${item.product_variant_id} не найден`)
			}
			if (!variant.enabled) throw new PurchaseError(`Продукт отключён`)

			const currentItem = {
				productVariantId: item.product_variant_id,
				serverId: item.server_id,
			}

			const purchaseId = await db.transaction().execute(async (trx) => {
				await chargeUser(trx, user.id, variant.price)
				const purchaseId = await createPurchase(trx, user.id, currentItem, variant.price)

				await CartService.removeItem(user.id, item.id)

				currentUserBalance -= variant.price

				const product = await ProductService.getProductById(variant.productId)

				if (!product) {
					throw new Error(`Продукт с ID ${variant.productId} не найден`)
				}

				if (product.type === 'privilege') {
					await VipService.giveVip({
						serverId: item.server_id,
						steamId: user.steamId.toString(),
						playerName: 'NADAWDA',
						group: product?.privilege_name ?? 'vip',
						durationDays: variant.durationDays,
					})
				} else {
					throw new PurchaseError(`Тип продукта ${product.type} не поддерживается`)
				}

				return purchaseId
			})

			results.push({ success: true, item: currentItem, purchaseId })
		} catch (error: unknown) {
			console.error(error)

			let message = 'Unknown error'

			if (error instanceof PurchaseError) {
				message = error.message
			}

			results.push({
				success: false,
				item: { productVariantId: item.product_variant_id, serverId: item.server_id },
				error: message,
			})
		}
	}

	return results
}
