import type { Server } from '@database/types/schema'

import { db } from '@/db/client'

const getAllServers = () => db.selectFrom('servers_info').selectAll().execute()
const getServerById = (id: Server['id']) =>
	db.selectFrom('servers').where('id', '=', id).selectAll().executeTakeFirst()

const getAllServersIds = () => db.selectFrom('servers').select('id').execute()

export const ServerService = {
	getAllServers,
	getServerById,
	getAllServersIds,
}
