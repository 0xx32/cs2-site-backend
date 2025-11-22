import type { User } from "@database/types/schema";
import type { Context, Next } from "hono";
import type { UUID } from "node:crypto";

import { getCookie, setCookie } from "hono/cookie";

import { SessionService } from "@/modules/session/session.service";
import { UserService } from "@/modules/user/user.service";
import { ApiErrorFactory } from "@/utils/exceptions/api-error";

export interface AuthVariables {
  user: User;
  sessionId: string;
}

export const authMiddleware = async (
  ctx: Context<{ Variables: AuthVariables }>,
  next: Next,
) => {
  const sessionId = getCookie(ctx, "session");

  if (!sessionId) {
    return ctx.json(ApiErrorFactory.Unauthorized().toJSON());
  }

  const session = await SessionService.getSession(sessionId);

  if (!session || !session.userId) {
    setCookie(ctx, "session", "");
    return ctx.json(ApiErrorFactory.Unauthorized("Invalid session").toJSON());
  }

  const user = await UserService.getById(session.userId as UUID);

  if (!user) {
    return ctx.json(ApiErrorFactory.Unauthorized("Invalid session").toJSON());
  }

  ctx.set("user", user);
  ctx.set("sessionId", sessionId);

  await next();
};
