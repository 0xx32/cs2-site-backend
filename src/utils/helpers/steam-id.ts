// Константа смещения — фиксированная для всех SteamID64
const STEAMID64_BASE = BigInt('76561197960265728')

/**
 * Steam2 -> базовый X (auth server) и Y (account id parts)
 */
export function steam2ToParts(steam2: string) {
	// Формат: STEAM_0:X:Y
	const match = steam2.match(/^STEAM_[0-5]:(\d):(\d+)$/)
	if (!match) throw new Error('Invalid Steam2 format')

	const X = BigInt(match[1]) // 0 или 1
	const Y = BigInt(match[2])

	// account_id = Y*2 + X
	return { accountId: Y * 2n + X }
}

/**
 * SteamID3 -> parts
 * Формат: [U:1:Z]
 */
export function steam3ToParts(steam3: string) {
	const match = steam3.match(/^\[U:1:(\d+)\]$/)
	if (!match) throw new Error('Invalid Steam3 format')

	const accountId = BigInt(match[1])
	return { accountId }
}

/**
 * SteamID64 -> parts
 */
export function steam64ToParts(steam64: string) {
	const id64 = BigInt(steam64)
	const accountId = id64 - STEAMID64_BASE
	if (accountId < 0) throw new Error('Invalid SteamID64')

	return { accountId }
}

/**
 * Части -> Steam2 format
 */
export function partsToSteam2(accountId: bigint) {
	const X = accountId % 2n
	const Y = (accountId - X) / 2n

	return `STEAM_0:${X}:${Y}`
}

/**
 * Части -> Steam3 format
 */
export function partsToSteam3(accountId: bigint) {
	return `[U:1:${accountId}]`
}

/**
 * Части -> Steam64 format
 */
export function partsToSteam64(accountId: bigint) {
	return (STEAMID64_BASE + accountId).toString()
}

/**
 * Универсальный парсер SteamID любого типа
 */
export function parseSteamId(input: string) {
	input = input.trim()

	if (input.startsWith('STEAM_')) return steam2ToParts(input)
	if (input.startsWith('[U:')) return steam3ToParts(input)
	if (/^\d{17}$/.test(input)) return steam64ToParts(input)

	throw new Error('Unknown SteamID format')
}

/**
 * Полная конвертация: вход → все форматы
 */
export function convertSteamId(input: string) {
	const { accountId } = parseSteamId(input)

	return {
		steam2: partsToSteam2(accountId),
		steam3: partsToSteam3(accountId),
		steam64: partsToSteam64(accountId),
		accountId: accountId.toString(),
	}
}
