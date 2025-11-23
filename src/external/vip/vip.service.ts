import { db } from '@/db/client'
import { parseSteamId } from '@/utils/helpers/steam-id'

interface GiveVipParams {
	serverId: number
	steamId: string
	group: string
	durationDays: number
	playerName: string
}

const giveVip = async ({ serverId, steamId, playerName, group, durationDays }: GiveVipParams) => {
	const { accountId } = parseSteamId(steamId)

	const duration = durationDays * 24 * 60 * 60

	try {
		await db
			.insertInto('vip_users')
			.values({
				account_id: accountId,
				expires: Math.floor(Date.now() / 1000) + duration,
				group,
				name: playerName,
				sid: serverId,
				lastvisit: 0,
			})
			.onDuplicateKeyUpdate((eb) => ({
				expires: eb('expires', '+', duration),
				name: eb.val(playerName),
			}))
			.execute()
	} catch (error) {
		console.error(error)
		throw new Error(`Ошибка при выдаче или обновлении vip группы у игрока STEAM ID ${steamId}`, {
			cause: error,
		})
	}
}

const removeVip = async (steamId: string, serverId: number) => {
	const { accountId } = parseSteamId(steamId)

	try {
		await db
			.deleteFrom('vip_users')
			.where('account_id', '=', accountId)
			.where('sid', '=', serverId)
			.execute()
	} catch (error) {
		console.error(error)
		throw new Error(`Ошибка при удалении vip группы у игрока STEAM ID ${steamId}`, {
			cause: error,
		})
	}
}

export const VipService = {
	giveVip,
	removeVip,
}
