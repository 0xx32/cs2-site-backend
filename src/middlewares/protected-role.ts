import type { User } from '@database/types/schema'
import type { Context, Next } from 'hono'

import { ApiErrorFactory } from '@/utils/exceptions/api-error'

import type { AuthVariables } from './auth'

type Role = User['role'] // перечисли свои роли

export const protectedRoleMiddleware =
	(allowedRoles: Role[]) => async (ctx: Context<{ Variables: AuthVariables }>, next: Next) => {
		const user = ctx.get('user')

		if (!user) {
			console.error(
				'requireRoles middleware требует предварительной авторизации. Добавьте authMiddleware перед ним.'
			)
			throw ApiErrorFactory.InternalServerError()
		}

		if (!allowedRoles.includes(user.role as Role)) {
			throw ApiErrorFactory.Forbidden('Доступ запрещен')
		}

		await next()
	}
