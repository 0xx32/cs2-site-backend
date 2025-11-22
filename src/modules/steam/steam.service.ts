import fetches from "@siberiacancode/fetches";

import { APP_CONFIG } from "@/configs/app.config";
import { SessionService } from "@/modules/session/session.service";
import { UserService } from "@/modules/user/user.service";
import { STEAM_OPEN_ID } from "@/utils/constants/steam";
import { buildRedirectUrl } from "@/utils/helpers/url";

import type { SteamProfile, SteamProfileResponse } from "./steam.types";

const REALM = APP_CONFIG.APP_URL;
const REDIRECT_PATH = "/api/auth/steam";

const createLoginUrl = (redirectUrl?: string): string => {
  const params = new URLSearchParams({
    "openid.ns": STEAM_OPEN_ID.NS,
    "openid.mode": "checkid_setup",
    "openid.return_to": `${
      REALM + REDIRECT_PATH
    }?return_to=${encodeURIComponent(redirectUrl ?? "/")}`,
    "openid.realm": REALM,
    "openid.identity": STEAM_OPEN_ID.ID_SELECT,
    "openid.claimed_id": STEAM_OPEN_ID.ID_SELECT,
  });

  return `${STEAM_OPEN_ID.URL}?${params.toString()}`;
};

const handleSteamCallback = async (query: Record<string, string>) => {
  const claimedId = query["openid.claimed_id"];
  if (!claimedId) throw new Error("missing_claimed_id");

  const match = claimedId.match(STEAM_OPEN_ID.STEAM_ID_REGEX);
  if (!match) throw new Error("invalid_claimed_id");

  const steamId = BigInt(match[1].toString());

  let user = await UserService.getBySteamId(steamId);

  if (!user) {
    user = await UserService.createUser({ role: "USER", steamId });
  }

  if (!user) throw new Error("create_user_failed");

  const sessionId = await SessionService.createSession(user.id, {
    ttl: APP_CONFIG.AUTH_SESSION_DURATION,
  });

  return { sessionId, user };
};

const buildSafeRedirect = (baseUrl: string, returnTo: string): string => {
  return buildRedirectUrl(baseUrl, returnTo);
};

const getProfileInfo = async (
  steamId: string,
): Promise<SteamProfile | undefined> => {
  const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${APP_CONFIG.STEAM_API_KEY}&steamids=${steamId}&format=json`;

  try {
    const response = await fetches.get<SteamProfileResponse>(url);
    return response.data.response.players[0];
  } catch (error) {
    console.error("Ошибка запроса к steam api", error);
    throw error;
  }
};

export const SteamService = {
  createLoginUrl,
  handleSteamCallback,
  buildSafeRedirect,
  getProfileInfo,
};
