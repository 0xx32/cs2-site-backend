import type {
  NewProduct,
  Product,
  ProductCategory,
} from "@database/types/schema";

import { sql } from "kysely";

import { db } from "@/db/client";
import { ApiErrorFactory } from "@/utils/exceptions/api-error";

export const getProductById = (id: Product["id"]) =>
  db.selectFrom("products").where("id", "=", id).selectAll().execute();

export const getAllProducts = () =>
  db.selectFrom("products").selectAll().execute();

export const getProductsByCategory = (categoryId: ProductCategory["id"]) =>
  db
    .selectFrom("products")
    .where("categoryId", "=", categoryId)
    .selectAll()
    .execute();

export const addProduct = async (dto: NewProduct) => {
  try {
    await db
      .insertInto("products")
      .values({
        ...dto,
        advantages: sql`${JSON.stringify(dto.advantages ?? [])}`,
        discountPercent: dto.discountPercent ?? 0,
      })
      .execute();
  } catch (error) {
    console.error(error);
    throw ApiErrorFactory.BadRequest("Ошибка при добавлении привилегии");
  }
};

export const getProductCategories = () =>
  db.selectFrom("product_categories").selectAll().execute();

export const ProductService = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  addProduct,
  getProductCategories,
};
