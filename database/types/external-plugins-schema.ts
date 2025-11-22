import type { Insertable } from 'kysely'

export interface PluginsTables {
	servers_info: ServerInfoTable
	[key: `ranks_server-${number}`]: PlayersRanksTable
	iks_admin_to_server: IksAdminToServerTable
	iks_admins: IksAdminsTable
	iks_admins_warns: IksAdminsWarnsTable
	iks_bans: IksBans
	iks_comms: IksCommsTable
	iks_groups: IksGroupsTable
	iks_groups_limitations: IksGroupsLimitationsTable
	iks_servers: IksServersTable
	vip_servers: VipServersTable
	vip_users: VipUsersTable
	wp_player_agents: WpPlayerAgentsTable
	wp_player_gloves: WpPlayerGlovesTable
	wp_player_knife: WpPlayerKnifeTable
	wp_player_music: WpPlayerMusicTable
	wp_player_pins: WpPlayerPinsTable
	wp_player_skins: WpPlayerSkinsTable
}

export interface PlayersRanksTable {
	assists: number
	deaths: number
	headshots: number
	hits: number
	kills: number
	lastconnect: number
	name: string
	playtime: number
	rank: number
	round_lose: number
	round_win: number
	shoots: number
	steam: string
	value: number
}
export type PlayerRank = Insertable<PlayersRanksTable>

export interface ServerInfoTable {
	id: number
	ip: string
	name: string
	map_name: string
	active_players: number
	max_players: number
	status: boolean
	last_update: Date
}

//Admin
export interface IksAdminsTable {
	id: number
	created_at: number
	deleted_at: number | null
	discord: string | null
	end_at: number | null
	flags: string | null
	group_id: number | null
	immunity: number | null
	is_disabled: boolean
	name: string
	steam_id: string
	updated_at: number
	vk: string | null
}

export interface IksAdminsWarnsTable {
	id: number
	admin_id: number
	created_at: number
	deleted_at: number | null
	deleted_by: number | null
	duration: number
	end_at: number
	reason: string
	target_id: number
	updated_at: number
}

export interface IksAdminToServerTable {
	admin_id: number
	id: number
	server_id: number | null
}

export interface IksBans {
	id: number
	admin_id: number
	/**
	 * 0 - SteamId, 1 - Ip, 2 - Both
	 */
	ban_type: 0 | 1 | 2
	created_at: number
	deleted_at: number | null
	duration: number
	end_at: number
	ip: string | null
	name: string | null
	reason: string
	server_id: number | null
	steam_id: number | null
	unban_reason: string | null
	unbanned_by: number | null
	updated_at: number
}

export interface IksCommsTable {
	id: number
	admin_id: number
	created_at: number
	deleted_at: number | null
	duration: number
	end_at: number
	ip: string | null
	/**
	 * 0 - voice(mute), 1 - chat(gag), 2 - both(silence)
	 */
	mute_type: 0 | 1 | 2
	name: string | null
	reason: string
	server_id: number | null
	steam_id: number
	unban_reason: string | null
	unbanned_by: number | null
	updated_at: number
}

export interface IksGroupsTable {
	id: number
	comment: string | null
	flags: string
	immunity: number
	name: string
}

export interface IksGroupsLimitationsTable {
	id: number
	group_id: number
	limitation_key: string
	limitation_value: string
}

export interface IksServersTable {
	id: number
	created_at: number
	deleted_at: number | null
	/**
	 * ip:port
	 */
	ip: string
	name: string
	rcon: string | null
	updated_at: number
}

//Vip
export interface VipServersTable {
	port: number
	serverId: number
	serverIp: string
	updated_at: Date | null
	created_at: Date | null
}

export interface VipUsersTable {
	account_id: bigint
	expires: number
	group: string
	lastvisit: number
	name: string
	sid: number
}

//Skins
export interface WpPlayerAgentsTable {
	agent_ct: string | null
	agent_t: string | null
	steamid: string
}

export interface WpPlayerGlovesTable {
	steamid: string
	weapon_defindex: number
	weapon_team: number
}

export interface WpPlayerKnifeTable {
	knife: string
	steamid: string
	weapon_team: number
}

export interface WpPlayerMusicTable {
	music_id: number
	steamid: string
	weapon_team: number
}

export interface WpPlayerPinsTable {
	id: number
	steamid: string
	weapon_team: number
}
export interface WpPlayerSkinsTable {
	steamid: string
	weapon_defindex: number
	/**
	 * id;x;y;z;seed
	 */
	weapon_keychain: string
	weapon_nametag: string | null
	weapon_paint_id: number
	weapon_seed: number
	weapon_stattrak: number
	weapon_stattrak_count: number
	/**
	 * id;schema;x;y;wear;scale;rotation
	 */
	weapon_sticker_0: string
	/**
	 * id;schema;x;y;wear;scale;rotation
	 */
	weapon_sticker_1: string
	/**
	 * id;schema;x;y;wear;scale;rotation
	 */
	weapon_sticker_2: string
	/**
	 * id;schema;x;y;wear;scale;rotation
	 */
	weapon_sticker_3: string
	/**
	 * id;schema;x;y;wear;scale;rotation
	 */
	weapon_sticker_4: string
	weapon_team: number
	weapon_wear: number
}
