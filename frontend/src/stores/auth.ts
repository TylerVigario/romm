import type { User } from "@/stores/users";
import { defineStore } from "pinia";

const FULL_SCOPES_LIST = [
  "me.read",
  "me.write",
  "roms.read",
  "roms.write",
  "platforms.read",
  "platforms.write",
  "users.read",
  "users.write",
  "tasks.run",
] as const;

export default defineStore("auth", {
  state: () => ({
    enabled: true,
    user: null as User | null,
    oauth_scopes: [] as string[],
  }),

  getters: {
    scopes: (state) => {
      if (!state.enabled) return FULL_SCOPES_LIST;
      return state.user?.oauth_scopes ?? [];
    },
  },

  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
  },
});
