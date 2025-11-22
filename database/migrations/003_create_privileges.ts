import type { Kysely } from "kysely";

import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("privileges")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("variants", "json", (col) =>
      col.defaultTo(sql`(JSON_ARRAY())`).notNull(),
    )
    .addColumn("advantages", "json", (col) =>
      col.defaultTo(sql`(JSON_ARRAY())`).notNull(),
    )
    .addColumn("badge", "varchar(255)")
    .addColumn("imageUrl", "varchar(255)")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("privileges").execute();
}
