import type { PlayersRanksTable } from '../types/external-plugins-schema'

import { seedDBClient } from './client'

// Генерация 30 игроков
const generatePlayers = (): PlayersRanksTable[] => {
	const players: PlayersRanksTable[] = []
	const now = Math.floor(Date.now() / 1000)

	for (let i = 1; i <= 30; i++) {
		const kills = Math.floor(Math.random() * 5000) + 100
		const deaths = Math.floor(kills * (0.5 + Math.random() * 0.7))
		const headshots = Math.floor(kills * (0.2 + Math.random() * 0.3))
		const hits = Math.floor(kills * (2 + Math.random() * 3))
		const shoots = Math.floor(hits * (3 + Math.random() * 2))
		const assists = Math.floor(kills * 0.3)
		const playtime = Math.floor(3600 * (10 + Math.random() * 500)) // 10–500 часов
		const round_win = Math.floor(Math.random() * 2000)
		const round_lose = Math.floor(round_win * (0.6 + Math.random() * 0.8))
		const value = Math.floor(kills * 1.5 + assists * 0.8 - deaths * 0.3 + playtime / 3600)
		const lastconnect = now - Math.floor(Math.random() * 86400 * 7) // за неделю

		players.push({
			name: `Player${i}`,
			steam: `STEAM_1:${i % 2}:12345${String(i).padStart(2, '0')}`,
			kills,
			deaths,
			headshots,
			hits,
			shoots,
			assists,
			playtime,
			round_win,
			round_lose,
			value,
			rank: 0, // будет пересчитан триггером или вручную
			lastconnect,
		})
	}

	return players
}

// Выполнение вставки
export async function seedPlayers(serverId: number = 1) {
	const tableName = `ranks_server-${serverId}` as const
	const players = generatePlayers()

	try {
		await seedDBClient.insertInto(tableName).values(players).execute()

		console.log(`Успешно вставлено 30 игроков в ${tableName}`)
	} catch (error) {
		console.error('Ошибка при вставке:', error)
		throw error
	}
}
