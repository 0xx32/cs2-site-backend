import { z } from 'zod'

export type GetPlayersSortBy = 'rank' | 'kills' | 'points' | 'deaths' | 'times'

const playersStatisticsSortBy = ['rank', 'kills', 'points', 'deaths', 'times'] as const

export const getPlayersStatisticsQuery = z.object({
	serverId: z.string(),
	sortBy: z.optional(z.enum(playersStatisticsSortBy)),
	limit: z.optional(z.string()),
	offset: z.optional(z.string()),
	sortOrder: z.optional(z.literal(['ask', 'desc'])),
})

export type GetServerPlayersQuery = z.infer<typeof getPlayersStatisticsQuery>

export const playersSortByFields = {
	rank: 'rank',
	kills: 'kills',
	points: 'value',
	deaths: 'deaths',
	times: 'playtime',
} as const

export interface GetServerPlayersStaticsParams
	extends Omit<GetServerPlayersQuery, 'serverId' | 'limit' | 'offset'> {
	limit?: number
	offset?: number
}
