import type {
  AddRomsResponse,
  CursorPage_RomSchema_,
  MessageResponse,
  RomSchema,
  SearchRomSchema,
} from "@/__generated__";
import api from "@/services/api/index";
import storeDownload from "@/stores/download";
import type { Rom } from "@/stores/roms";
import { getDownloadLink } from "@/utils";

import ATARI2600 from "./fixtures/atari2600";

export const ROMS: Record<number, CursorPage_RomSchema_> = {
  1: ATARI2600,
};

export const romApi = api;

async function uploadRoms({
  platformId,
  romsToUpload,
}: {
  platformId: number;
  romsToUpload: File[];
}): Promise<{ data: AddRomsResponse }> {
  return { data: { uploaded_roms: [], skipped_roms: [] } };
}

async function getRoms({
  platformId = null,
  size = 60,
  cursor = "",
  searchTerm = "",
  orderBy = "name",
  orderDir = "asc",
}: {
  platformId?: number | null;
  size?: number | null;
  cursor?: string | null;
  searchTerm?: string | null;
  orderBy?: string | null;
  orderDir?: string | null;
}): Promise<{ data: CursorPage_RomSchema_ }> {
  if (platformId) {
    return { data: ROMS[platformId] };
  }

  if (searchTerm) {
    // Find matching roms across all platforms
    const roms = Object.values(ROMS)
      .map((r) => r.items)
      .flat();
    
      return {
      data: {
        items: roms.filter((rom) =>
          rom.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      },
    };
  }
  return { data: { items: [] } };
}

async function getRecentRoms(): Promise<{ data: CursorPage_RomSchema_ }> {
  return { data: ATARI2600 };
}

async function getRom({ romId }: { romId: number }): Promise<{ data: Rom }> {
  for (let platform of Object.values(ROMS)) {
    const rom = platform.items.find((rom) => rom.id === romId);
    if (rom) return { data: rom };
  }

  return { data: {} as Rom };
}

function clearRomFromDownloads({ id }: { id: number }) {
  const downloadStore = storeDownload();
  downloadStore.remove(id);
}

async function searchRom({
  romId,
  searchTerm,
  searchBy,
  searchExtended: searchExtended,
}: {
  romId: number;
  searchTerm: string;
  searchBy: string;
  searchExtended: boolean;
}): Promise<{ data: SearchRomSchema[] }> {
  return { data: [] };
}

// Used only for multi-file downloads
async function downloadRom({
  rom,
  files = [],
}: {
  rom: Rom;
  files?: string[];
}) {
  const a = document.createElement("a");
  a.href = getDownloadLink({ rom, files });
  a.click();

  // Only connect socket if multi-file download
  if (rom.multi && files.length > 1) {
    storeDownload().add(rom.id);

    // Clear download state after 60 seconds in case error/timeout
    setTimeout(() => {
      clearRomFromDownloads(rom);
    }, 60 * 1000);
  }
}

export type UpdateRom = Rom & {
  artwork?: File[];
};

async function updateRom({
  rom,
  renameAsIGDB = false,
  removeCover = false,
}: {
  rom: UpdateRom;
  renameAsIGDB?: boolean;
  removeCover?: boolean;
}): Promise<{ data: RomSchema }> {
  return { data: rom };
}

async function deleteRoms({
  roms,
  deleteFromFs = false,
}: {
  roms: Rom[];
  deleteFromFs: boolean;
}): Promise<{ data: MessageResponse }> {
  return { data: { msg: "Deleted successfully" } };
}

async function updateRomNote({
  romId,
  rawMarkdown,
  isPublic,
}: {
  romId: number;
  rawMarkdown: string;
  isPublic: boolean;
}): Promise<{ data: RomSchema }> {
  return { data: {} as RomSchema };
}

export default {
  uploadRoms,
  getRoms,
  getRecentRoms,
  getRom,
  downloadRom,
  searchRom,
  updateRom,
  deleteRoms,
  updateRomNote,
};
