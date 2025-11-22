import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'

import { APP_CONFIG } from '@/configs/app.config'
import { authMiddleware } from '@/middlewares/auth'
import { SteamService } from '@/modules/steam/steam.service'

import { AuthService } from './auth.service'

export const authController = new Hono()

authController.get('/steam', async (ctx) => {
	const mode = ctx.req.query('openid.mode')
	const rawReturnTo = ctx.req.query('return_to') ?? '/'

	const isSafe = (url: string) => url.startsWith('/') && !url.startsWith('//')
	const returnTo = isSafe(rawReturnTo) ? rawReturnTo : '/'

	if (mode === 'id_res') {
		const result = await SteamService.handleSteamCallback(ctx.req.query())

		setCookie(ctx, 'session', result.sessionId, {
			expires: new Date(Date.now() + APP_CONFIG.AUTH_SESSION_DURATION * 1000),
			httpOnly: !APP_CONFIG.DEV,
			secure: !APP_CONFIG.DEV,
			maxAge: APP_CONFIG.AUTH_SESSION_DURATION,
			sameSite: 'lax',
			path: '/',
		})

		return ctx.redirect(SteamService.buildSafeRedirect(APP_CONFIG.FRONTEND_URL, returnTo))
	}

	const loginUrl = SteamService.createLoginUrl(returnTo)
	return ctx.redirect(loginUrl)
})

authController.get('/me', authMiddleware, async (ctx) => {
	const user = ctx.get('user')

	return ctx.json({ user })
})

authController.post('/logout', authMiddleware, async (ctx) => {
	const sessionId = ctx.get('sessionId')

	const result = await AuthService.logout(sessionId)

	if (!result) {
		console.error('Error deleting the session')
		return ctx.json({ error: 'Error when logging out' })
	}

	setCookie(ctx, 'session', '')

	return ctx.json({ message: 'Вы вышли из системы' })
})
