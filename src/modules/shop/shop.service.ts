import type { User } from "@database/types/schema";

import { sql } from "kysely";

import { db } from "@/db/client";
import { PrivilegeService } from "@/modules/privilege";
import { ProductService } from "@/modules/product";
import { ApiErrorFactory } from "@/utils/exceptions/api-error";

import type { CheckoutDto } from "./shop.model";

export const getShopItems = async () => {
  const products = await ProductService.getAllProducts();
  const productCategories = await ProductService.getProductCategories();

  return {
    products,
    categories: productCategories,
  };
};

export const checkout = async (dto: CheckoutDto, user: User) => {
  const [product] = await ProductService.getProductById(dto.productId);
  const [serverResult] = await db
    .selectFrom("servers")
    .select("id")
    .where("id", "=", dto.serverId)
    .execute();

  const productVariant = product.variants.find(
    (v) => v.id === dto.productVariantId,
  );

  if (!product || !serverResult.id || !productVariant) {
    throw ApiErrorFactory.BadRequest("Не верные данные");
  }

  const result = await db
    .updateTable("users")
    .set({
      balance: sql`balance - 100`,
    })
    .where("id", "=", user.id)
    .where("balance", ">=", 100)
    .executeTakeFirst();

  if (result.numUpdatedRows === 0n) {
    throw ApiErrorFactory.create("Недостаточно средств", 409);
  }

  const resultGivePrivilege = await PrivilegeService.givePrivilege({
    serverId: serverResult.id,
    steamId: user.steamId.toString(),
    durationDays: productVariant.days,
    group: product.name,
    playerName: "LOX",
  });

  return resultGivePrivilege;
};

export const ShopService = {
  getShopItems,
  checkout,
};
