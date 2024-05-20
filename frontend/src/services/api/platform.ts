import type { MessageResponse, PlatformSchema } from "@/__generated__";
import api from "@/services/api/index";

export const platformApi = api;

async function uploadPlatform({
  fsSlug,
}: {
  fsSlug: string;
}): Promise<{ data: PlatformSchema }> {
  return {
    data: {
      id: 0,
      slug: fsSlug,
      fs_slug: fsSlug,
      name: fsSlug.toUpperCase(),
      rom_count: 0,
    },
  };
}

const PLATFORMS = [
  {
    id: 35,
    slug: "2600",
    fs_slug: "2600",
    igdb_id: 35,
    moby_id: 35,
    name: "Atari 2600",
    rom_count: 34,
    firmware_files: [],
  },
  {
    id: 2,
    slug: "7800",
    fs_slug: "7800",
    igdb_id: 2,
    moby_id: 2,
    name: "Atari 7800",
    rom_count: 1,
    firmware_files: [],
  },
  {
    id: 3,
    slug: "c64",
    fs_slug: "c64",
    igdb_id: 3,
    moby_id: 3,
    name: "Commodore 64",
    rom_count: 1,
    firmware_files: [],
  },
  {
    id: 4,
    slug: "gb",
    fs_slug: "gb",
    igdb_id: 4,
    moby_id: 4,
    name: "Gameboy",
    rom_count: 1,
    firmware_files: [],
  },
  {
    id: 5,
    slug: "gba",
    fs_slug: "gba",
    igdb_id: 5,
    moby_id: 5,
    name: "Gameboy Advance",
    rom_count: 1,
    firmware_files: [],
  },
  {
    id: 6,
    slug: "gbc",
    fs_slug: "gbc",
    igdb_id: 6,
    moby_id: 6,
    name: "Gameboy Color",
    rom_count: 1,
    firmware_files: [],
  },
  {
    id: 7,
    slug: "genesis",
    fs_slug: "genesis",
    igdb_id: 7,
    moby_id: 7,
    name: "Sega Mega Drive/Genesis",
    rom_count: 1,
    firmware_files: [],
  },
  {
    id: 8,
    slug: "gg",
    fs_slug: "gg",
    igdb_id: 8,
    moby_id: 8,
    name: "Game Gear",
    rom_count: 1,
    firmware_files: [],
  },
  {
    id: 9,
    slug: "nes",
    fs_slug: "nes",
    igdb_id: 9,
    moby_id: 9,
    name: "NES",
    rom_count: 1,
    firmware_files: [],
  },
  {
    id: 11,
    slug: "sms",
    fs_slug: "sms",
    igdb_id: 11,
    moby_id: 11,
    name: "Sega Master System/Mark III",
    rom_count: 1,
    firmware_files: [],
  },
  {
    id: 12,
    slug: "snes",
    fs_slug: "snes",
    igdb_id: 12,
    moby_id: 12,
    name: "SNES",
    rom_count: 1,
    firmware_files: [],
  },
];

async function getPlatforms(): Promise<{ data: PlatformSchema[] }> {
  return {  data: PLATFORMS };
}

async function getPlatform(
  id: number | undefined
): Promise<{ data: PlatformSchema }> {
  return { data: PLATFORMS.find((p) => p.id === id) as PlatformSchema}
}

async function getSupportedPlatforms(): Promise<{ data: PlatformSchema[] }> {
  return { data: PLATFORMS };
}

async function deletePlatform({
  platform,
}: {
  platform: PlatformSchema;
}): Promise<{ data: MessageResponse }> {
  return { data: { msg: "Platform deleted" } };
}

export default {
  uploadPlatform,
  getPlatforms,
  getPlatform,
  getSupportedPlatforms,
  deletePlatform,
};
