import type {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";
import type { UUID } from "node:crypto";

import type { PluginsTables } from "./external-plugins-schema";

export type Database = {
  servers: ServersTable;
  users: UserTable;
  products: ProductsTable;
  product_categories: ProductCategoriesTable;
} & PluginsTables;

export interface ServersTable {
  id: number;
  ip: string;
  port: string;
  name: string;
  status: boolean;
  rcon_password: string | null;
}

export type Server = Selectable<ServersTable>;
export type NewServer = Insertable<ServersTable>;
export type ServerUpdate = Updateable<ServersTable>;

export interface UserTable {
  id: UUID;
  steamId: bigint;
  role: UserRoles;
  balance: number;
  created_at: ColumnType<Date, string | undefined, never>;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
export type UserRoles = "USER" | "ADMIN" | "MODERATOR" | "ROOT";

export interface ProductCategoriesTable {
  id: Generated<number>;
  name: string;
}
export type ProductCategory = Selectable<ProductCategoriesTable>;
export type NewProductCategory = Insertable<ProductCategoriesTable>;

export interface ProductsTable {
  id: Generated<number>;
  name: string;
  categoryId: number;
  discountPercent?: number;
  imageUrl?: string;
  description?: string;
  advantages: string[];
  isActive: boolean;
  variants: JSONColumnType<
    {
      id: number;
      label: string;
      price: number;
      days: number;
    }[]
  >;
  created_at: Generated<Date>;
}
export type Product = Selectable<ProductsTable>;
export type NewProduct = Insertable<ProductsTable>;
export type UpdatedProduct = Updateable<ProductsTable>;

export interface PrivilegesTable {
  id: Generated<number>;
  name: string;
  advantages: string[];
}
