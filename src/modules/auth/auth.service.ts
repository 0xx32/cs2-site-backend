import { SessionService } from "@/modules/session/session.service";

export const logout = (sessionId: string) =>
  SessionService.deleteSession(sessionId);

export const AuthService = {
  logout,
};
