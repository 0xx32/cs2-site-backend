import "dotenv/config";
import env from "env-var";

export const APP_CONFIG = {
  DEV: env.get("DEV").required().asBool(),
  PORT: env.get("APP_PORT").required().asIntPositive(),
  APP_URL: env.get("APP_URL").required().asString(),
  FRONTEND_URL: env.get("FRONTEND_URL").required().asString(),
  AUTH_SESSION_DURATION: env
    .get("AUTH_SESSION_DURATION")
    .required()
    .asIntPositive(),
  REDIS_URL: env.get("REDIS_URL").required().asString(),
  REDIS_PASSWORD: env.get("REDIS_URL").required().asString(),
  STEAM_API_KEY: env.get("STEAM_API_KEY").required().asString(),
};
