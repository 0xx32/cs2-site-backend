import { Hono } from "hono";

import type * as ServerModel from "./server.model";

import { ServerService } from "./server.service";

export const serverController = new Hono();

//Синхронизация серверов
serverController.post("/update", async (ctx) => {
  const result = await ServerService.updateServers();

  if (!result.success) {
    return ctx.json(result, 500);
  }

  return ctx.json(result, 200);
});

serverController.get("/", async (ctx) => {
  const severs = await ServerService.getAllServers();
  return ctx.json(severs);
});

serverController.post("/", async (ctx) => {
  const body = await ctx.req.json<ServerModel.CreateServerDto>();

  const result = await ServerService.createServer(body);

  if (!result.success) {
    return ctx.json(result, 400);
  }

  return ctx.json(result, 201);
});
