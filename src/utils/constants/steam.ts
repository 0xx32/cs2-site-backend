export const STEAM_OPEN_ID = {
	NS: 'http://specs.openid.net/auth/2.0',
	ID_SELECT: 'http://specs.openid.net/auth/2.0/identifier_select',
	URL: 'https://steamcommunity.com/openid/login',
	STEAM_ID_REGEX: /https:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/,
} as const
