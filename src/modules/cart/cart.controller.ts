import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import type { AuthVariables } from '@/middlewares'

import { authMiddleware } from '@/middlewares'
import { responseJsonWrapper } from '@/utils/helpers'

import { addToCartBodySchema, cartParamsSchema } from './cart.model'
import { CartService } from './cart.service'

export const cartController = new Hono<{ Variables: AuthVariables }>().use(authMiddleware)

cartController.get('/items', async (ctx) => {
	const user = ctx.get('user')

	const cartItems = await CartService.getUserCartItemsInfo(user.id)

	return ctx.json(
		responseJsonWrapper('Корзина получена', { items: cartItems, total: cartItems.length })
	)
})

cartController.post('/items', zValidator('json', addToCartBodySchema), async (ctx) => {
	const user = ctx.get('user')
	const body = ctx.req.valid('json')

	const result = await CartService.addToCart(user.id, body.productVariantId, body.serverId)

	return ctx.json(
		responseJsonWrapper('Товар добавлен в корзину', {
			itemId: result.insertId,
		}),
		201
	)
})

cartController.delete('/items/:id', zValidator('param', cartParamsSchema), async (ctx) => {
	const user = ctx.get('user')
	const { id } = ctx.req.valid('param')

	await CartService.removeItem(user.id, id)

	return ctx.json(responseJsonWrapper('Товар удален из корзины'))
})

cartController.delete('/', async (ctx) => {
	const user = ctx.get('user')

	await CartService.clearUserCart(user.id)

	return ctx.json(responseJsonWrapper('Корзина очищена'))
})
