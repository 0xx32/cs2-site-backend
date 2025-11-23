import type { Context } from 'hono'

import { ApiError, ApiErrorFactory } from '@/utils/exceptions/api-error'
import { DatabaseError } from '@/utils/exceptions/errors'

export function errorMiddleware(error: unknown, c: Context) {
	if (error instanceof ApiError) return c.json(error.toJSON(), error.status)

	if (error instanceof DatabaseError) {
		const err = ApiErrorFactory.InternalServerError(error.message)

		return c.json(err.toJSON(), err.status)
	}

	console.error('Unhandled error:', error)

	const fallbackError = ApiErrorFactory.InternalServerError('Internal Server Error')

	return c.json(fallbackError.toJSON(), fallbackError.status)
}
