import type { Context } from "hono";

import { ApiError, ApiErrorFactory } from "@/utils/exceptions/api-error";

export function errorMiddleware(error: unknown, c: Context) {
  if (error instanceof ApiError) return c.json(error.toJSON(), error.status);

  console.error("Unhandled error:", error);

  const fallbackError = ApiErrorFactory.InternalServerError(
    "Internal Server Error",
  );

  return c.json(fallbackError.toJSON(), fallbackError.status);
}
