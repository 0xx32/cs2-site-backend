import type { NewUser, User } from "@database/types/schema";

import { randomUUID } from "node:crypto";

import { db } from "@/db/client";

const getById = async (id: User["id"]): Promise<User | null> => {
  const result = await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  return result ?? null;
};

const getBySteamId = async (steamId: User["steamId"]): Promise<User | null> => {
  const result = await db
    .selectFrom("users")
    .selectAll()
    .where("steamId", "=", steamId)
    .executeTakeFirst();

  return result ?? null;
};

const createUser = async (
  userDto: Pick<NewUser, "steamId" | "role">,
): Promise<User | null> => {
  try {
    const userId = randomUUID();

    await db
      .insertInto("users")
      .values({
        id: userId,
        steamId: userDto.steamId,
        role: userDto.role,
        balance: 0,
      })
      .executeTakeFirst();

    const user = await getById(userId);
    return user ?? null;
  } catch (error) {
    console.error("UserService.createUser error:", error);
    return null;
  }
};

export const UserService = {
  createUser,
  getById,
  getBySteamId,
};
