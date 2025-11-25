import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import { authMiddleware, protectedRoleMiddleware } from '@/middlewares'

import { addProductBodySchema, productParamsSchema, updateProductBodySchema } from './product.model'
import { ProductService } from './product.service'

export const productController = new Hono()
	.use(authMiddleware)
	.use(protectedRoleMiddleware(['ROOT']))

productController.get('/', async (ctx) => {
	const products = await ProductService.getAllProducts()

	return ctx.json(products)
})

productController.get('/:id', zValidator('param', productParamsSchema), async (ctx) => {
	const { id } = ctx.req.valid('param')

	const product = await ProductService.getProductById(id)

	return ctx.json(product)
})

productController.post('/', zValidator('json', addProductBodySchema), async (ctx) => {
	const body = ctx.req.valid('json')

	const newProductId = await ProductService.addProduct(body)

	return ctx.json({ success: true, message: `Продукт с id ${newProductId} создан` })
})

productController.patch(
	'/:id',
	zValidator('param', productParamsSchema),
	zValidator('json', updateProductBodySchema),
	async (ctx) => {
		const { id } = ctx.req.valid('param')
		const body = ctx.req.valid('json')

		await ProductService.updateProduct(id, body)

		return ctx.json({ success: true, message: `Продукт с id ${id} обновлен` })
	}
)

productController.delete('/:id', zValidator('param', productParamsSchema), async (ctx) => {
	const { id } = ctx.req.valid('param')

	await ProductService.deleteProduct(id)

	return ctx.json({ success: true, message: `Продукт с id ${id} удален` })
})
