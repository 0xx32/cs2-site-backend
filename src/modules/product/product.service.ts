import type { Product, ProductVariant } from '@database/types/schema'

import { sql } from 'kysely'

import { db } from '@/db/client'
import { ApiErrorFactory } from '@/utils/exceptions/api-error'
import { DatabaseError } from '@/utils/exceptions/errors'

import type { AddProductParams, UpdateProductParams } from './product.model'

const getProductById = (id: Product['id']) =>
	db.selectFrom('products').where('id', '=', id).selectAll().executeTakeFirst()

const getAllProducts = () => db.selectFrom('products').selectAll().execute()

const addProduct = async (params: AddProductParams) => {
	try {
		const productId = await db.transaction().execute(async (trx) => {
			const [result] = await trx
				.insertInto('products')
				.values({
					name: params.name,
					description: params.description,
					type: params.type,
					advantages: sql`${JSON.stringify(params.advantages ?? [])}`,
					discount_percent: params.discountPercent,
					character_model_id: params.characterModelId,
					privilege_name: params.privilegeName,
				})
				.execute()

			if (!result.insertId) throw new DatabaseError('Ошибка вставки продукта')

			const productId = Number(result.insertId)

			if (params.variants?.length) {
				await trx
					.insertInto('product_variants')
					.values(
						params.variants.map((variant) => ({
							product_id: productId,
							price: variant.price,
							duration_days: variant.durationDays,
							duration_label: variant.durationLabel,
						}))
					)
					.execute()
			}

			return productId
		})

		return productId
	} catch (error) {
		console.error(error)
		throw ApiErrorFactory.BadRequest('Ошибка при создании продукта')
	}
}

const updateProduct = async (id: Product['id'], params: UpdateProductParams) => {
	try {
		await db
			.updateTable('products')
			.set({
				name: params.name,
				description: params.description,
				type: params.type,
				advantages: sql`${JSON.stringify(params.advantages ?? [])}`,
				discount_percent: params.discountPercent,
			})
			.where('id', '=', id)
			.execute()
	} catch (error) {
		console.error(error)
		throw ApiErrorFactory.BadRequest('Ошибка при обновлении продукта')
	}
}

const deleteProduct = async (id: Product['id']) => {
	try {
		await db.deleteFrom('products').where('id', '=', id).execute()
	} catch (error) {
		console.error(error)
		throw ApiErrorFactory.BadRequest(`Ошибка при удалении продукта c id ${id}`)
	}
}

const getProductVariants = (id: Product['id']) =>
	db.selectFrom('product_variants').where('product_id', '=', id).selectAll().execute()

const getProductVariantById = (id: ProductVariant['id']) =>
	db.selectFrom('product_variants').where('id', '=', id).selectAll().executeTakeFirst()

export const ProductService = {
	getAllProducts,
	getProductById,
	addProduct,
	updateProduct,
	deleteProduct,
	getProductVariants,
	getProductVariantById,
}
