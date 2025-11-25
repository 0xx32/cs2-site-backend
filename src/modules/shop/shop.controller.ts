import { Hono } from 'hono'

import { authMiddleware } from '@/middlewares/auth'

import { getShopProducts, purchaseItems } from './shop.service'

export const shopController = new Hono()

shopController.get('/products', async (ctx) => {
	const result = await getShopProducts()
	return ctx.json(result)
})

shopController.post('/purchase', authMiddleware, async (ctx) => {
	const user = ctx.get('user')

	const result = await purchaseItems(user)

	return ctx.json({ result })
})
