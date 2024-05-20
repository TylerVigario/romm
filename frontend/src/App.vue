<script setup lang="ts">
import Notification from "@/components/Notification.vue";
import api from "@/services/api/index";
import socket from "@/services/socket";
import storeConfig from "@/stores/config";
import storeGalleryFilter from "@/stores/galleryFilter";
import storeHeartbeat from "@/stores/heartbeat";
import storeRoms, { type Rom } from "@/stores/roms";
import storeScanning from "@/stores/scanning";
import type { Events } from "@/types/emitter";
import { normalizeString } from "@/utils";
import type { Emitter } from "mitt";
import { storeToRefs } from "pinia";
import { inject, onBeforeMount, onBeforeUnmount } from "vue";

// Props
const scanningStore = storeScanning();
const { scanningPlatforms } = storeToRefs(scanningStore);
const romsStore = storeRoms();
const galleryFilter = storeGalleryFilter();
const isFiltered = normalizeString(galleryFilter.filterSearch).trim() != "";
const emitter = inject<Emitter<Events>>("emitter");

// Props
const heartbeat = storeHeartbeat();
const configStore = storeConfig();

socket.on(
  "scan:scanning_platform",
  ({ name, slug, id }: { name: string; slug: string; id: number }) => {
    scanningStore.set(true);
    scanningPlatforms.value = scanningPlatforms.value.filter(
      (platform) => platform.name !== name
    );
    scanningPlatforms.value.push({ name, slug, id, roms: [] });
  }
);

socket.on("scan:scanning_rom", (rom: Rom) => {
  scanningStore.set(true);
  if (romsStore.platform.name === rom.platform_name) {
    romsStore.add([rom]);
    romsStore.setFiltered(
      isFiltered ? romsStore.filteredRoms : romsStore.allRoms,
      galleryFilter
    );
  }

  let scannedPlatform = scanningPlatforms.value.find(
    (p) => p.slug === rom.platform_slug
  );

  // Add the platform if the socket dropped and it's missing
  if (!scannedPlatform) {
    scanningPlatforms.value.push({
      name: rom.platform_name,
      slug: rom.platform_slug,
      id: rom.platform_id,
      roms: [],
    });
    scannedPlatform = scanningPlatforms.value[0];
  }

  scannedPlatform?.roms.push(rom);
});

socket.on("scan:done", () => {
  scanningStore.set(false);
  socket.disconnect();

  emitter?.emit("refreshDrawer", null);
  emitter?.emit("snackbarShow", {
    msg: "Scan completed successfully!",
    icon: "mdi-check-bold",
    color: "green",
    timeout: 4000,
  });
});

socket.on("scan:done_ko", (msg) => {
  scanningStore.set(false);

  emitter?.emit("snackbarShow", {
    msg: `Scan failed: ${msg}`,
    icon: "mdi-close-circle",
    color: "red",
  });
  socket.disconnect();
});

onBeforeUnmount(() => {
  socket.off("scan:scanning_platform");
  socket.off("scan:scanning_rom");
  socket.off("scan:done");
  socket.off("scan:done_ko");
});

onBeforeMount(() => {
  heartbeat.set({
    VERSION: "3.1.0",
    NEW_VERSION: "3.1.0",
    WATCHER: {
      ENABLED: false,
      TITLE: "Rescan on filesystem change",
      MESSAGE:
        "Runs a scan when a change is detected in the library path, with a 5 minute delay",
    },
    SCHEDULER: {
      RESCAN: {
        ENABLED: false,
        TITLE: "Scheduled rescan",
        MESSAGE: "Rescans the entire library",
        CRON: "0 3 * * *",
      },
      SWITCH_TITLEDB: {
        ENABLED: false,
        TITLE: "Scheduled Switch TitleDB update",
        MESSAGE: "Updates the Nintendo Switch TitleDB file",
        CRON: "0 4 * * *",
      },
    },
    ANY_SOURCE_ENABLED: false,
    METADATA_SOURCES: {
      IGDB_API_ENABLED: false,
      MOBY_API_ENABLED: false,
    },
  });

  configStore.set({
    EXCLUDED_PLATFORMS: [],
    EXCLUDED_SINGLE_EXT: [],
    EXCLUDED_SINGLE_FILES: ["._*"],
    EXCLUDED_MULTI_FILES: ["_*"],
    EXCLUDED_MULTI_PARTS_EXT: [],
    EXCLUDED_MULTI_PARTS_FILES: ["._*"],
    PLATFORMS_BINDING: {},
    PLATFORMS_VERSIONS: {},
    ROMS_FOLDER_NAME: "roms",
    FIRMWARE_FOLDER_NAME: "bios",
    HIGH_PRIO_STRUCTURE_PATH: "/romm/library/roms",
  });
});
</script>

<template>
  <v-app>
    <v-main>
      <notification class="mt-6" />
      <router-view />
    </v-main>
  </v-app>
</template>
<style>
body {
  background-color: rgba(var(--v-theme-background));
}
</style>
