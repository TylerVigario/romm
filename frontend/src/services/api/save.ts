import type { SaveSchema, UploadedSavesResponse } from "@/__generated__";
import api from "@/services/api/index";
import type { Rom } from "@/stores/roms";

export const saveApi = api;

async function uploadSaves({
  rom,
  saves,
  emulator,
}: {
  rom: Rom;
  saves: File[];
  emulator?: string;
}): Promise<{ data: UploadedSavesResponse }> {
  return { data: { uploaded: 0, saves: [] } };
}

async function updateSave({
  save,
  file,
}: {
  save: SaveSchema;
  file: File;
}): Promise<{ data: SaveSchema }> {
  return { data: save };
}

async function deleteSaves({
  saves,
  deleteFromFs,
}: {
  saves: SaveSchema[];
  deleteFromFs: boolean;
}) {
  return { data: { deleted: 0 } };
}

export default {
  deleteSaves,
  updateSave,
  uploadSaves,
};
