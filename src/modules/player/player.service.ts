import { sql } from "kysely";

import { db } from "@/db/client";

import type { GetServerPlayersStaticsParams } from "./player.model";

import { playersSortByFields } from "./player.model";

const getTotal = async (serverId: number): Promise<number> => {
  const totalResult = await db
    .selectFrom(`ranks_server-${serverId}`)
    .select(sql<number>`COUNT(*)`.as("total"))
    .executeTakeFirst();

  return totalResult?.total ?? 0;
};

const getServerPlayersStatistics = async (
  serverId: number,
  params?: GetServerPlayersStaticsParams,
) => {
  const options = { ...params };

  const limit = options.limit ? Math.max(1, Math.min(options.limit, 100)) : 20;
  const offset = options.offset ? Math.max(0, options.offset) : 0;

  let query = db
    .selectFrom(`ranks_server-${serverId} as ps`)
    .leftJoin(
      (eb) =>
        eb
          .selectFrom("iks_bans as bans")
          .select(["steam_id"])
          .where("steam_id", "is not", null)
          .where("deleted_at", "is", null)
          .where((eb) =>
            eb.parens(sql`end_at = 0 OR end_at > UNIX_TIMESTAMP()`),
          )
          .as("bans"),
      (join) =>
        join.on(
          sql`
            76561197960265728 +
            CAST(SUBSTRING_INDEX(ps.steam, ':', -1) AS UNSIGNED) * 2 +
            CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(ps.steam, ':', 2), ':', -1) AS UNSIGNED)
          `,
          "=",
          sql`bans.steam_id`,
        ),
    )
    .select([
      "ps.name",
      "ps.steam as steamId",
      "ps.value as gamePoints",
      "ps.kills",
      "ps.deaths",
      "ps.headshots",
      "ps.playtime",
      "ps.lastconnect",
      sql<boolean>`bans.steam_id IS NOT NULL`.as("banned"),
    ]);

  if (options.sortBy) {
    const field = playersSortByFields[options.sortBy];
    const order = options.sortOrder === "desc" ? "desc" : "asc";
    query = query.orderBy(field, order);
  }

  const result = await query.offset(offset).limit(limit).execute();
  const total = await getTotal(serverId);

  return {
    players: result,
    total,
    page: Math.floor(offset / limit) + 1,
    pageCount: Math.ceil(total / limit),
    itemsCount: result.length,
  };
};

export const PlayerService = {
  getServerPlayersStatistics,
  getTotal,
};
