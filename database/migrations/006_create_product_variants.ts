import type { Kysely } from 'kysely'

import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('product_variants')
		.addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
		.addColumn('product_id', 'integer', (col) =>
			col.notNull().references('products.id').onDelete('cascade')
		)
		.addColumn('price', 'integer', (col) => col.notNull())
		.addColumn('duration_label', 'varchar(255)', (col) => col.notNull())
		.addColumn('duration_days', 'integer', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn('updated_at', 'timestamp', (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`)
		)
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('product_variants').execute()
}
