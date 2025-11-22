import 'dotenv/config'
import env from 'env-var'

export const DB_CONFIG = {
	MYSQL_DATABASE_URL: env.get('DATABASE_URL').required().asString(),
	MYSQL_DATABASE: env.get('MYSQL_DATABASE').required().asString(),
	MYSQL_USER: env.get('MYSQL_USER').required().asString(),
	MYSQL_PASSWORD: env.get('MYSQL_PASSWORD').required().asString(),
} as const
