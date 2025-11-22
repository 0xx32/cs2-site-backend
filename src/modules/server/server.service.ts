import { db } from "@/db/client";

const getAllServers = () => db.selectFrom("servers_info").selectAll().execute();

export const ServerService = {
  getAllServers,
};
