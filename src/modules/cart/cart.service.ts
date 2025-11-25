import type { CartItem, User } from '@database/types/schema'

import { db } from '@/db/client'
import { ProductService } from '@/modules/product'
import { ServerService } from '@/modules/server'
import { ApiErrorFactory } from '@/utils/exceptions/api-error'
import { DatabaseError } from '@/utils/exceptions/errors'

const getUserCartItemsInfo = async (userId: User['id']) => {
	const items = await db
		.selectFrom('user_cart_items as ci')
		.innerJoin('servers as s', 's.id', 'ci.server_id')
		.innerJoin('product_variants as pv', 'pv.id', 'ci.product_variant_id')
		.innerJoin('products as p', 'p.id', 'pv.product_id')
		.select([
			'ci.id as itemId',
			'ci.server_id as serverId',
			's.name as serverName',

			'p.id as productId',
			'p.name as productName',

			'pv.id as productVariantId',
			'pv.duration_label as productVariantLabel',
			'pv.price as productVariantPrice',
		])
		.where('ci.user_id', '=', userId)
		.execute()

	return items
}

const getUserCartItems = (userId: User['id']) =>
	db.selectFrom('user_cart_items').where('user_id', '=', userId).selectAll().execute()

const getUserCartItem = (userId: User['id'], cartItemId: CartItem['id']) =>
	db
		.selectFrom('user_cart_items')
		.selectAll()
		.where('user_id', '=', userId)
		.where('id', '=', cartItemId)
		.executeTakeFirst()

const clearUserCart = (userId: User['id']) =>
	db.deleteFrom('user_cart_items').where('user_id', '=', userId).execute()

const addToCart = async (userId: User['id'], productVariantId: number, serverId: number) => {
	const productVariant = await ProductService.getProductVariantById(productVariantId)
	if (!productVariant) {
		throw ApiErrorFactory.BadRequest('Такого productVariantId не существует')
	}

	const server = await ServerService.getServerById(serverId)
	if (!server) {
		throw ApiErrorFactory.BadRequest('Такого serverId не существует')
	}

	try {
		return await db
			.insertInto('user_cart_items')
			.values({
				user_id: userId,
				product_variant_id: productVariantId,
				server_id: serverId,
			})
			.executeTakeFirst()
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ER_DUP_ENTRY') {
			throw new DatabaseError('Этот товар уже есть в корзине')
		}

		throw new Error('Ошибка при добавлении товара в корзину')
	}
}

const removeItem = (userId: User['id'], cartItemId: CartItem['id']) =>
	db
		.deleteFrom('user_cart_items')
		.where('user_id', '=', userId)
		.where('id', '=', cartItemId)
		.execute()

export const CartService = {
	getUserCartItems,
	getUserCartItem,
	getUserCartItemsInfo,
	clearUserCart,
	addToCart,
	removeItem,
}
