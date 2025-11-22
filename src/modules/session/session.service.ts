import crypto from 'node:crypto'

import { redisClient } from '@/utils/redis'

const PREFIX = 'session'

const generateSessionId = (): string => {
	return crypto.randomBytes(32).toString('hex')
}

const createSession = async (
	userId: string,
	options?: {
		customSessionId?: string
		ttl?: number
	}
): Promise<string> => {
	const sessionId = options?.customSessionId ?? generateSessionId()
	const key = `${PREFIX}:${sessionId}`

	await redisClient.hset(key, {
		userId: String(userId),
		createdAt: Date.now().toString(),
	})

	if (options?.ttl) {
		await redisClient.expire(key, options.ttl)
	}

	return sessionId
}

const getSession = async (sessionId: string) => {
	const key = `${PREFIX}:${sessionId}`
	const data = await redisClient.hgetall(key)

	if (!data.userId) return null

	return {
		userId: data.userId as string, // или UUID, если у тебя есть тип
		createdAt: Number.parseInt(data.createdAt, 10),
	}
}

const deleteSession = async (sessionId: string): Promise<boolean> => {
	const key = `${PREFIX}:${sessionId}`
	const deleted = await redisClient.del(key)
	return deleted > 0
}

const getSessionTTL = async (sessionId: string): Promise<number> => {
	const key = `${PREFIX}:${sessionId}`
	return await redisClient.ttl(key)
}

export const SessionService = {
	generateSessionId,
	createSession,
	getSession,
	deleteSession,
	getSessionTTL,
}
