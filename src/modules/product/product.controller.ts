import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import { addProductDto } from './product.model'
import { ProductService } from './product.service'

export const productController = new Hono()

productController.get('/', async (ctx) => {
	const products = await ProductService.getAllProducts()

	return ctx.json(products)
})

productController.post('/', zValidator('json', addProductDto), async (ctx) => {
	const body = ctx.req.valid('json')

	await ProductService.addProduct({
		...body,
		variants: JSON.stringify(body.variants),
	})
})
