import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import type { UUID } from 'node:crypto'

import type { PluginsTables } from './external-plugins-schema'

export type Database = {
	servers: ServersTable
	users: UserTable
	products: ProductsTable
	product_variants: ProductVariantsTable
	user_purchases: UserPurchaseTable
	user_cart_items: UserCartItemsTable
} & PluginsTables

export interface ServersTable {
	id: number
	ip: string
	port: string
	name: string
	status: boolean
	rcon_password: string | null
}

export type Server = Selectable<ServersTable>
export type NewServer = Insertable<ServersTable>
export type ServerUpdate = Updateable<ServersTable>

export interface UserTable {
	id: UUID
	steamId: bigint
	role: UserRoles
	balance: number
	created_at: ColumnType<Date, string | undefined, never>
}
export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>
export type UserRoles = 'USER' | 'ADMIN' | 'MODERATOR' | 'ROOT'

export interface ProductsTable {
	id: Generated<number>
	name: string
	description: string | null
	type: 'privilege' | 'character_model'
	advantages: string[]
	discount_percent: number | null
	privilege_name: string | null
	character_model_id: number | null
	enabled: Generated<boolean>
	created_at: Generated<Date>
	updated_at: Generated<Date | null>
}
export type Product = Selectable<ProductsTable>
export type NewProduct = Insertable<ProductsTable>
export type UpdatedProduct = Updateable<ProductsTable>

export interface ProductVariantsTable {
	id: Generated<number>
	product_id: Product['id']
	price: number
	duration_label: string
	duration_days: number
	created_at: Generated<Date>
	updated_at: Generated<Date | null>
}
export type ProductVariant = Selectable<ProductVariantsTable>

export interface UserPurchaseTable {
	id: Generated<number>
	user_id: UserTable['id']
	product_variant_id: ProductVariantsTable['id']
	server_id: number
	amount: number
	createdAt: Generated<Date>
}

export interface UserCartItemsTable {
	id: Generated<number>
	user_id: UserTable['id']
	server_id: ServersTable['id']
	product_variant_id: ProductVariantsTable['id']
	createdAt: Generated<Date>
}
export type CartItem = Selectable<UserCartItemsTable>
