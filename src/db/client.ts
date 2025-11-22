import type { Database } from "@database/types/schema";

import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";

import { DB_CONFIG } from "@/configs/db.config";

export const db = new Kysely<Database>({
  dialect: new MysqlDialect({
    pool: createPool({
      uri: DB_CONFIG.MYSQL_DATABASE_URL,
      typeCast(field, next) {
        if (field.type === "LONGLONG" && field.length <= 15) {
          const value = field.string();
          return value ? Number(value) : null;
        }
        return next();
      },
    }),
  }),
  // log: ["query", "error"], // ← ВОТ ЭТО!
});
