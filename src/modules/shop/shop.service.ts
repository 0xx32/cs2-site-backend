import type { Server, User } from '@database/types/schema'

import { sql } from 'kysely'

import { db } from '@/db/client'
import { VipService } from '@/external/vip/vip.service'
import { ProductService } from '@/modules/product'
import { ApiErrorFactory } from '@/utils/exceptions/api-error'

import type { CheckoutDto } from './shop.model'

import { getProductById } from '../product/product.service'
import { ServerService } from '../server'

interface Item {
	serverId: number
	productId: number
	productVariantId: number
}

export const getShopItems = async () => {
	const products = await ProductService.getAllProducts()
	const productCategories = await ProductService.getProductCategories()

	return {
		products,
		categories: productCategories,
	}
}

const validateCheckoutItem = async (item: Item, serversIds: Server['id'][]) => {
	const errors: string[] = []

	const serverIndex = serversIds.findIndex((id) => id === item.serverId)
	if (serverIndex === -1) {
		errors.push(`Сервер с id ${item.serverId} не найден`)
	}

	const product = await getProductById(item.productId)
	if (!product) {
		errors.push(`Продукт с id ${item.productId} не найден`)
	}

	const variant = product?.variants.find((v) => v.id === item.productVariantId)
	if (!variant) {
		errors.push(`Вариант продукта с id ${item.productVariantId} не найден`)
	}

	const returnData = {
		serverId: item.serverId,
		product: product!,
		productVariant: variant!,
	}

	return {
		isValid: !!errors.length,
		errors,
		data: errors.length === 0 ? undefined : returnData,
	}
}

export const proccesCheckout = async ({ items }: { items: CheckoutDto }, user: User) => {
	const errors: string[][] = []

	const serversIds = await ServerService.getAllServersIds()
	const productsCategories = await db.selectFrom('product_categories').selectAll().execute()

	let totalAmount: number = 0
	const promises: any[] = []

	items.forEach(async (item) => {
		const validateResult = await validateCheckoutItem(
			item,
			serversIds.map((s) => s.id)
		)

		if (!validateResult.isValid || !validateResult.data) {
			errors.push(validateResult.errors)
			return
		}

		const serverId = validateResult.data.serverId
		const currentProduct = validateResult.data.product
		const productVariant = validateResult.data.productVariant

		const productCategory = productsCategories.find((c) => c.id === currentProduct.categoryId)

		totalAmount += productVariant.price

		if (productCategory?.name === 'VIP') {
			const promise = VipService.giveVip({
				serverId,
				steamId: user.steamId.toString(),
				durationDays: productVariant?.days,
				group: currentProduct.name,
				playerName: 'LOX',
			})

			promises.push(promise)
		}
	})

	const resultUpdateUserBalance = await db
		.updateTable('users')
		.set({
			balance: sql`balance - ${totalAmount}`,
		})
		.where('id', '=', user.id)
		.where('balance', '>=', 100)
		.executeTakeFirst()

	if (resultUpdateUserBalance.numUpdatedRows === 0n) {
		throw ApiErrorFactory.create('Недостаточно средств', 409)
	}

	Promise.all(promises)
}

export const ShopService = {
	getShopItems,
	proccesCheckout,
}
