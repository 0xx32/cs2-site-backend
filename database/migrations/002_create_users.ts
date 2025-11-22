import type { Kysely } from 'kysely'

import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('users')
		.addColumn('id', 'char(36)', (col) => col.primaryKey().defaultTo(sql`(UUID())`))
		.addColumn('steamId', 'bigint', (col) => col.notNull().unique())
		.addColumn('role', sql`ENUM('USER', 'ADMIN', 'MODERATOR', 'ROOT')`, (col) =>
			col.notNull().defaultTo('USER')
		)
		.addColumn('balance', 'integer', (col) => col.notNull().defaultTo(0))
		.addColumn('created_at', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('users').execute()
}
