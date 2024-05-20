import type { ScreenshotSchema, UploadedScreenshotsResponse } from "@/__generated__";
import api from "@/services/api/index";
import type { Rom } from "@/stores/roms";

export const screenshotApi = api;

async function uploadScreenshots({
  rom,
  screenshots,
}: {
  rom: Rom;
  screenshots: File[];
}): Promise<{ data: UploadedScreenshotsResponse }> {
  return { data: { uploaded: 0, screenshots: [], url_screenshots: [], merged_screenshots: [] } };
}

async function updateScreenshot({
  screenshot,
  file,
}: {
  screenshot: ScreenshotSchema;
  file: File;
}): Promise<{ data: ScreenshotSchema }> {
  return { data: screenshot };
}

export default {
  uploadScreenshots,
  updateScreenshot,
};
