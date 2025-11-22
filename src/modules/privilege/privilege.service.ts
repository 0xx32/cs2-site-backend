import { db } from "@/db/client";
import { ApiErrorFactory } from "@/utils/exceptions/api-error";
import { parseSteamId } from "@/utils/helpers/steam-id";

interface GivePrivilageParams {
  serverId: number;
  steamId: string;
  group: string;
  durationDays: number;
  playerName: string;
}

const givePrivilege = async ({
  serverId,
  steamId,
  playerName,
  group,
  durationDays,
}: GivePrivilageParams) => {
  const { accountId } = parseSteamId(steamId);

  const duration = durationDays * 24 * 60 * 60;

  try {
    const [result] = await db
      .insertInto("vip_users")
      .values({
        account_id: accountId,
        expires: Math.floor(Date.now() / 1000) + duration,
        group,
        name: playerName,
        sid: serverId,
        lastvisit: 0,
      })
      .onDuplicateKeyUpdate((eb) => ({
        expires: eb("expires", "+", duration),
        name: eb.val(playerName),
      }))
      .execute();

    if (result.numInsertedOrUpdatedRows === 1n) {
      return { success: true, message: "Привилегия создана" };
    } else if (result.numInsertedOrUpdatedRows === 2n) {
      return { success: true, message: "Привилегия продлена" };
    } else {
      return { success: false, message: "Привилегия не изменена" };
    }
  } catch (error) {
    console.error(error);
    throw ApiErrorFactory.InternalServerError(
      "Ошибка при выдаче или обновлении привилегии",
    );
  }
};

export const PrivilegeService = {
  givePrivilege,
};
