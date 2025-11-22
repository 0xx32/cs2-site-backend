import type { Kysely } from "kysely";

import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("products")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("categoryId", "integer", (col) =>
      col.references("categories.id").onDelete("set null"),
    )
    .addColumn("discountPercent", "integer")
    .addColumn("isActive", "boolean", (col) => col.defaultTo(true))
    .addColumn("imageUrl", "text")
    .addColumn("description", "text")
    .addColumn("advantages", "json", (col) =>
      col.defaultTo(sql`(JSON_ARRAY())`).notNull(),
    )
    .addColumn("variants", "json", (col) =>
      col.defaultTo(sql`(JSON_ARRAY())`).notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("products").execute();
}
