import type { MessageResponse } from "@/__generated__";
import api from "@/services/api/index";

export const identityApi = api;

async function login(
  username: string,
  password: string
): Promise<{ data: MessageResponse }> {
  return { data: { msg: "Login successful" } };
}

async function logout(): Promise<{ data: MessageResponse }> {
  return { data: { msg: "Logout successful" } };
}

export default {
  login,
  logout,
};
