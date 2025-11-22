import type { ContentfulStatusCode } from 'hono/utils/http-status'

export class ApiError extends Error {
	status: ContentfulStatusCode

	constructor(message = 'Unexpected error', status: ContentfulStatusCode = 500) {
		super(message)
		this.name = 'ApiError'
		this.status = status
	}

	toJSON() {
		return {
			success: false,
			message: this.message,
		}
	}
}
type ApiErrorInstance = InstanceType<typeof ApiError>

interface ApiErrorFactoryMethods {
	BadRequest: (message?: string) => ApiErrorInstance
	Unauthorized: (message?: string) => ApiErrorInstance
	Forbidden: (message?: string) => ApiErrorInstance
	NotFound: (message?: string) => ApiErrorInstance
	InternalServerError: (message?: string) => ApiErrorInstance
	create: (message: string, status: ContentfulStatusCode) => ApiErrorInstance
}
export const ApiErrorFactory = {
	BadRequest(message = 'Bad Request') {
		return new ApiError(message, 400)
	},
	Unauthorized(message = 'Unauthorized') {
		return new ApiError(message, 401)
	},
	Forbidden(message = 'Forbidden') {
		return new ApiError(message, 403)
	},
	NotFound(message = 'Not Found') {
		return new ApiError(message, 404)
	},
	InternalServerError(message = 'Internal Server Error') {
		return new ApiError(message, 500)
	},
	create(message: string, status: ContentfulStatusCode) {
		return new ApiError(message, status)
	},
} satisfies ApiErrorFactoryMethods
