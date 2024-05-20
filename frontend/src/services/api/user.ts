import type { MessageResponse, UserSchema } from "@/__generated__";
import api from "@/services/api/index";
import type { User } from "@/stores/users";

export const userApi = api;

const USER: UserSchema = {
  id: 0,
  username: "demouser",
  role: "viewer",
  enabled: true,
  oauth_scopes: [
    "me.read",
    "me.write",
    "roms.read",
    "platforms.read",
    "assets.read",
    "assets.write",
    "firmware.read",
    "notes.read",
    "notes.write",
  ],
  avatar_path: "",
  last_active: new Date().toISOString(),
  last_login: new Date().toISOString(),
}

async function createUser({
  username,
  password,
  role,
}: {
  username: string;
  password: string;
  role: string;
}): Promise<{ data: UserSchema }> {
  return { data: USER };
}

async function fetchUsers(): Promise<{ data: UserSchema[] }> {
  return { data: [USER] }
}

async function fetchUser(user: User): Promise<{ data: UserSchema }> {
  return { data: USER }
}

async function fetchCurrentUser(): Promise<{ data: UserSchema | null }> {
  return { data: USER }
}

async function updateUser({
  id,
  avatar,
  ...attrs
}: UserSchema & {
  avatar?: File[];
  password?: string;
}): Promise<{ data: UserSchema }> {
  return { data: USER };
}

async function deleteUser(user: User): Promise<{ data: MessageResponse }> {
  return { data: { msg: "User deleted" } };
}

export default {
  createUser,
  fetchUsers,
  fetchUser,
  fetchCurrentUser,
  updateUser,
  deleteUser,
};
