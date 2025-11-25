import { Hono } from 'hono'

import { authMiddleware } from '@/middlewares'

import { UserService } from './user.service'

export const userController = new Hono()

userController.get('/privileges', authMiddleware, async (ctx) => {
	const user = ctx.get('user')
	const res = await UserService.getActivePrivileges(user)

	return ctx.json(res)
})
