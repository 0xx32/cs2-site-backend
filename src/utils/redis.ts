import Redis from "ioredis";

import { APP_CONFIG } from "@/configs/app.config";

export const redisClient = new Redis(APP_CONFIG.REDIS_URL, {});
