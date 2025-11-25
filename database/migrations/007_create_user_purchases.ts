import type { Kysely } from 'kysely'

import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('user_purchases')
		.addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
		.addColumn('user_id', 'char(36)', (col) => col.notNull())
		.addColumn('product_variant_id', 'integer', (col) =>
			col.notNull().references('product_variants.id').onDelete('cascade')
		)
		.addColumn('server_id', 'integer', (col) => col.notNull())
		.addColumn('amount', 'integer', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('user_purchases').execute()
}
