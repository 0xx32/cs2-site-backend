import type { Server } from '@database/types/schema'

import { db } from '@/db/client'

import type * as ServerModel from './server.model'

const getAllServers = async (): Promise<Server[]> => {
	return await db.selectFrom('servers').selectAll().execute()
}

const createServer = async (dto: ServerModel.CreateServerDto) => {
	try {
		const result = await db.insertInto('servers').values(dto).executeTakeFirst()

		if (!result.insertId) {
			return { success: false, message: 'Ошибка при создании сервера' }
		}

		return { success: true, message: 'Сервер создан' }
	} catch (error: unknown) {
		console.error('MySQL: create server failed:', error)

		if (error instanceof Error && 'code' in error) {
			const mysqlError = error as { code: string; message: string }

			if (mysqlError.code === 'ER_DUP_ENTRY') {
				const match = mysqlError.message.match(/for key '([^']+)'/)
				const keyName = match ? match[1] : 'уникальное поле'

				if (dto.ip && mysqlError.message.includes(dto.ip)) {
					return {
						success: false,
						message: `Сервер с IP ${dto.ip} уже существует`,
					}
				}

				return {
					success: false,
					message: `Сервер с таким ${keyName} уже существует`,
				}
			}
		}

		return { success: false, message: 'Ошибка при создании сервера' }
	}
}

const updateServers = async () => {
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

export const ServerService = {
	getAllServers,
	createServer,
	updateServers,
}
