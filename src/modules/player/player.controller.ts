import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import * as PlayerModel from "./player.model";
import { PlayerService } from "./player.service";

export const playerController = new Hono();

playerController.get(
  "/",
  zValidator("query", PlayerModel.getPlayersStatisticsQuery),
  async (ctx) => {
    const { serverId, ...queries } = ctx.req.valid("query");

    const players = await PlayerService.getServerPlayersStatistics(+serverId, {
      ...queries,
      limit: queries.limit ? +queries.limit : undefined,
      offset: queries.offset ? +queries.offset : undefined,
    });

    return ctx.json(players);
  },
);
