import { sql } from 'kysely'

import { db } from '@/db/client'
import { DatabaseError } from '@/utils/exceptions/errors'

interface CreatePrivilegeDto {
	name: string
	advantages: string[]
}

const createPrivilege = async (dto: CreatePrivilegeDto) => {
	try {
		await db
			.insertInto('privileges')
			.values({
				name: dto.name,
				advantages: sql`${JSON.stringify(dto.advantages)}`,
			})
			.execute()
	} catch (error) {
		console.error(error)

		throw new DatabaseError('Ошибка при создании привилегии')
	}
}
const removePrivilege = async (id: number) => {
	try {
		await db.deleteFrom('privileges').where('id', '=', id).execute()
	} catch {
		throw new DatabaseError('Ошибка при удалении привилегии')
	}
}

export const PrivilegeService = {
	createPrivilege,
	removePrivilege,
}
