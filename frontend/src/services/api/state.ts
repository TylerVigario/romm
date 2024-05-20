import type { StateSchema, UploadedStatesResponse } from "@/__generated__";
import api from "@/services/api/index";
import type { Rom } from "@/stores/roms";

export const stateApi = api;

async function uploadStates({
  rom,
  states,
  emulator,
}: {
  rom: Rom;
  states: File[];
  emulator?: string;
}): Promise<{ data: UploadedStatesResponse }> {
  return { data: { uploaded: 0, states: [] } };
}

async function updateState({
  state,
  file,
}: {
  state: StateSchema;
  file: File;
}): Promise<{ data: StateSchema }> {
  return { data: state };
}

async function deleteStates({
  states,
  deleteFromFs,
}: {
  states: StateSchema[];
  deleteFromFs: boolean;
}) {
  return { data: { deleted: 0 } };
}

export default {
  uploadStates,
  updateState,
  deleteStates,
};
