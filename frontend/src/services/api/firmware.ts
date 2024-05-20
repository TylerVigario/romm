import type { FirmwareSchema, AddFirmwareResponse } from "@/__generated__";
import api from "@/services/api/index";

export const firmwareApi = api;

async function getFirmware({
  platformId = null,
}: {
  platformId?: number | null;
}): Promise<{ data: FirmwareSchema[] }> {
  return { data: [] }
}

async function uploadFirmware({
  platformId,
  files,
}: {
  platformId: number;
  files: File[];
}): Promise<{ data: AddFirmwareResponse }> {
  return { data: { uploaded: 0, firmware: [] } };
}

async function deleteFirmware({
  firmware,
  deleteFromFs,
}: {
  firmware: FirmwareSchema[];
  deleteFromFs: boolean;
}) {
  return { data: { deleted: 0 } };
}

export default {
  getFirmware,
  uploadFirmware,
  deleteFirmware,
};
