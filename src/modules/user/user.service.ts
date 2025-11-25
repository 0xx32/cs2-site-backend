import type { NewUser, User } from '@database/types/schema'

import { randomUUID } from 'node:crypto'

import { db } from '@/db/client'
import { steam64ToParts } from '@/utils/helpers/steam-id'

const getById = async (id: User['id']): Promise<User | null> => {
	const result = await db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst()

	return result ?? null
}

const getBySteamId = async (steamId: User['steamId']): Promise<User | null> => {
	const result = await db
		.selectFrom('users')
		.selectAll()
		.where('steamId', '=', steamId)
		.executeTakeFirst()

	return result ?? null
}

const createUser = async (userDto: Pick<NewUser, 'steamId' | 'role'>): Promise<User | null> => {
	try {
		const userId = randomUUID()

		await db
			.insertInto('users')
			.values({
				id: userId,
				steamId: userDto.steamId,
				role: userDto.role,
				balance: 0,
			})
			.executeTakeFirst()

		const user = await getById(userId)
		return user ?? null
	} catch (error) {
		console.error('UserService.createUser error:', error)
		return null
	}
}

const getActivePrivileges = async (user: User) => {
	const accountId = steam64ToParts(user.steamId.toString()).accountId

	const vip = await db
		.selectFrom('vip_users')
		.select('group')
		.where('account_id', '=', accountId)
		.executeTakeFirst()

	const admin = await db
		.selectFrom('iks_admins')
		.select('id')
		.where('steam_id', '=', user.steamId.toString())
		.executeTakeFirst()

	return {
		vip: {
			group: vip?.group,
		},
		admin,
	}
}

export const UserService = {
	createUser,
	getById,
	getBySteamId,
	getActivePrivileges,
}
