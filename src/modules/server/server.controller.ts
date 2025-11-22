import { Hono } from "hono";

import { ServerService } from "./server.service";

export const serverController = new Hono();

serverController.get("/", async (ctx) => {
  const servers = await ServerService.getAllServers();
  return ctx.json(servers);
});
