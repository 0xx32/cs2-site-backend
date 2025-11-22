import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { showRoutes } from 'hono/dev'

import '../lib/fix-bigint'
import { APP_CONFIG } from '@/configs/app.config'
import { errorMiddleware } from '@/middlewares/error'

import { apiRoute } from './routes'

export const setup = () => {
	const app = new Hono()

	app.onError(errorMiddleware)

	app.use('*', cors({ origin: [APP_CONFIG.FRONTEND_URL], credentials: true }))

	app.route('/api', apiRoute)

	const server = serve(
		{
			fetch: app.fetch,
			port: APP_CONFIG.PORT,
		},
		async (info) => {
			console.log(`Server is running on http://localhost:${info.port}`)
		}
	)

	showRoutes(app, {
		verbose: true,
	})

	return server
}
