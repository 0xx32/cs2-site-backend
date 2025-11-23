export class CustomError extends Error {
	constructor(
		message: string,
		public code: string
	) {
		super(message)
		this.name = this.constructor.name
	}
}

export class DatabaseError extends CustomError {
	constructor(
		message: string,
		public originalError?: unknown
	) {
		super(message, 'DATABASE_ERROR')
	}
}
