import { Hono } from "hono";

import { authController } from "@/modules/auth/auth.controller";
// import { playerController } from "@/modules/player/player.controller";
// import { serverController } from "@/modules/server/server.controller";
import { productController } from "@/modules/product";
import { shopController } from "@/modules/shop";

export const apiRoute = new Hono()
  .route("/auth", authController)
  // .route("/players", playerController)
  // .route("/servers", serverController)
  .route("/products", productController)
  .route("/shop", shopController);
