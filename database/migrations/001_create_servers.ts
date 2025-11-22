import type { Kysely } from 'kysely'

import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('servers')
		.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
		.addColumn('ip', 'varchar(45)', (col) => col.notNull().unique())
		.addColumn('port', 'smallint', (col) => col.notNull().check(sql`port BETWEEN 0 AND 65535`))
		.addColumn('name', 'varchar(64)', (col) => col.notNull())
		.addColumn('status', 'boolean', (col) => col.notNull().defaultTo(true))
		.addColumn('rcon_password', 'varchar(64)')
		.addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.execute()

	await db.schema.createIndex('idx_servers_id').on('servers').column('id').execute()
	await db.schema.createIndex('idx_servers_status').on('servers').column('status').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('servers').execute()
}
