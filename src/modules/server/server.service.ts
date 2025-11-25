import type { NewServer, Server } from '@database/types/schema'

import { db } from '@/db/client'
import { DatabaseError } from '@/utils/exceptions/errors'

const getAllServers = async () => db.selectFrom('servers').selectAll().execute()

const getServerById = (id: Server['id']) =>
	db.selectFrom('servers').where('id', '=', id).selectAll().executeTakeFirst()

const createServer = async (params: NewServer) => {
	try {
		const result = await db.insertInto('servers').values(params).executeTakeFirst()

		if (!result.insertId) {
			return { success: false, message: 'Ошибка при создании сервера' }
		}
	} catch (error: unknown) {
		console.error('MySQL: create server failed:', error)

		if (error instanceof Error && 'code' in error) {
			throw new DatabaseError('Ошибка при создании сервера', error)
		}
	}
}

const serversSync = async () => {
	const externalServers = await db.selectFrom('servers_info').selectAll().execute()

	const outdatedServers = await db.selectFrom('servers').selectAll().execute()
	const outdatedMap = new Map(outdatedServers.map((s) => [s.id, s]))

	const newServers: Server[] = externalServers.map((server) => {
		const old = outdatedMap.get(server.id)
		return {
			id: server.id,
			ip: server.ip,
			name: server.name,
			port: server.ip.split(':')[1],
			status: server.status,
			rcon_password: old?.rcon_password ?? null,
		}
	})

	try {
		await db.transaction().execute(async (trx) => {
			await trx.deleteFrom('servers').execute()
			await trx.insertInto('servers').values(newServers).execute()
		})

		return {
			success: true,
			message: 'Сервера обновлены',
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: 'При обновлении серверов произошла ошибка',
		}
	}
}

const getAllServersInfo = () => db.selectFrom('servers_info').selectAll().execute()

export const ServerService = {
	getAllServers,
	getServerById,
	getAllServersInfo,
	createServer,
	serversSync,
}
