import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import process from 'node:process'

import type { Database } from '../types/schema'

import 'dotenv/config'

export const seedDBClient = new Kysely<Database>({
	dialect: new MysqlDialect({
		pool: createPool({
			uri: process.env.DATABASE_URL,
			typeCast(field, next) {
				if (field.type === 'LONGLONG' && field.length <= 15) {
					const value = field.string()
					return value ? Number(value) : null
				}
				return next()
			},
		}),
	}),
	// log: ["query", "error"], // ← ВОТ ЭТО!
})
