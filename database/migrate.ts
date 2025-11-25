// database/migrate.ts

import { FileMigrationProvider, Kysely, Migrator, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import { promises as fs } from 'node:fs'
import path from 'node:path' // ←←← ВОТ ЭТО ГЛАВНОЕ! Импортируем настоящий path
import process from 'node:process'
import 'dotenv/config'
import { fileURLToPath } from 'node:url' // для ESM

// Для ESM: __dirname и __filename
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function migrateToLatest() {
	const db = new Kysely({
		dialect: new MysqlDialect({
			pool: createPool({
				uri: process.env.DATABASE_URL!,
			}),
		}),
	})

	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path, // ←←← Передаём настоящий модуль path, а не строку!
			migrationFolder: path.join(__dirname, 'migrations'), // ← полная папка
		}),
	})

	const { error, results } = await migrator.migrateToLatest()

	results?.forEach((it) => {
		if (it.status === 'Success') {
			// eslint-disable-next-line no-console
			console.log(`migration "${it.migrationName}" was executed successfully`)
		} else if (it.status === 'Error') {
			console.error(`failed to execute migration "${it.migrationName}"`)
		}
	})

	if (error) {
		console.error('failed to migrate')
		console.error(error)
		process.exit(1)
	}

	await db.destroy()
}

migrateToLatest().catch((err) => {
	console.error('Unexpected error:', err)
	process.exit(1)
})
