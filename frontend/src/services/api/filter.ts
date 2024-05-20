import api from "@/services/api/index";

export const stateApi = api;

async function getFilters(): Promise<{ data: { genres: string[] } }> {
  return { data: { genres: [] } };
}
export default {
  getFilters,
};
