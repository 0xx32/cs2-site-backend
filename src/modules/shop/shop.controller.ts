import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import { authMiddleware } from '@/middlewares/auth'

import { shopCheckoutBodySchema } from './shop.model'
import { getShopItems, ShopService } from './shop.service'

export const shopController = new Hono()

shopController.get('/items', async (ctx) => {
	const result = await getShopItems()

	return ctx.json(result)
})

shopController.post(
	'/checkout',
	authMiddleware,
	zValidator('json', shopCheckoutBodySchema),
	async (ctx) => {
		const body = ctx.req.valid('json')
		const user = ctx.get('user')

		const result = await ShopService.checkout(body, user)

		return ctx.json(result)
	}
)
