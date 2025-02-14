<script setup lang="ts">
import { ref, inject, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

import AdminMenu from "@/components/Game/AdminMenu/Base.vue";
import romApi from "@/services/api/rom";
import storeAuth from "@/stores/auth";
import storeDownload from "@/stores/download";
import storeRoms from "@/stores/roms";
import type { Events } from "@/types/emitter";
import type { Emitter } from "mitt";
import {
  formatBytes,
  languageToEmoji,
  isEmulationSupported,
  regionToEmoji,
} from "@/utils";
import { useTheme } from "vuetify";
const theme = useTheme();

const HEADERS = [
  {
    title: "",
    align: "start",
    sortable: false,
    key: "path_cover_s",
  },
  {
    title: "Name",
    align: "start",
    sortable: true,
    key: "name",
  },
  {
    title: "File",
    align: "start",
    sortable: true,
    key: "file_name",
  },
  {
    title: "Size",
    align: "start",
    sortable: true,
    key: "file_size_bytes",
  },
  {
    title: "Reg",
    align: "start",
    sortable: true,
    key: "regions",
  },
  {
    title: "Lang",
    align: "start",
    sortable: true,
    key: "languages",
  },
  {
    title: "Rev",
    align: "start",
    sortable: true,
    key: "revision",
  },
  { title: "", align: "end", key: "actions", sortable: false },
] as const;

const PER_PAGE_OPTIONS = [10, 25, 50, 100];
const emitter = inject<Emitter<Events>>("emitter");
emitter?.on("updateDataTablePages", updateDataTablePages);

// Props
const router = useRouter();
const downloadStore = storeDownload();
const romsStore = storeRoms();
const auth = storeAuth();
const page = ref(1);
const storedRomsPerPage = parseInt(localStorage.getItem("romsPerPage") ?? "");
const romsPerPage = ref(isNaN(storedRomsPerPage) ? 25 : storedRomsPerPage);
const pageCount = ref(0);

// Functions
function rowClick(_: Event, row: any) {
  router.push({ name: "rom", params: { rom: row.item.id } });
}

function updateDataTablePages() {
  pageCount.value = Math.ceil(
    romsStore.filteredRoms.length / romsPerPage.value
  );
}

watch(romsPerPage, async () => {
  localStorage.setItem("romsPerPage", romsPerPage.value.toString());
  updateDataTablePages();
});

onMounted(() => {
  updateDataTablePages();
});
</script>

<template>
  <v-data-table
    :items-per-page="romsPerPage"
    :items-per-page-options="PER_PAGE_OPTIONS"
    items-per-page-text=""
    :fixed-footer="false"
    :headers="HEADERS"
    :item-value="(item) => item.id"
    :items="romsStore.filteredRoms"
    @click:row="rowClick"
    show-select
    v-model="romsStore._selectedIDs"
    v-model:page="page"
  >
    <template v-slot:item.path_cover_s="{ item }">
      <v-avatar :rounded="0">
        <v-progress-linear
          color="romm-accent-1"
          :active="downloadStore.value.includes(item.id)"
          :indeterminate="true"
          absolute
        />
        <v-img
          :src="
            !item.igdb_id && !item.moby_id
              ? `/assets/default/cover/big_${theme.global.name.value}_unmatched.png`
              : `/assets/romm/resources/${item.path_cover_l}`
          "
          :lazy-src="
            !item.igdb_id && !item.moby_id
              ? `/assets/default/cover/big_${theme.global.name.value}_unmatched.png`
              : `/assets/romm/resources/${item.path_cover_s}`
          "
        >
          <template v-slot:error>
            <v-img
              :src="`/assets/default/cover/big_${theme.global.name.value}_missing_cover.png`"
            ></v-img>
          </template>
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                :width="2"
                :size="20"
                color="romm-accent-1"
                indeterminate
              />
            </div>
          </template>
        </v-img>
      </v-avatar>
    </template>
    <template v-slot:item.name="{ item }">
      <span>
        {{ item.name }}
      </span>
    </template>
    <template v-slot:item.file_name="{ item }">
      <span>
        {{ item.file_name }}
      </span>
    </template>
    <template v-slot:item.file_size_bytes="{ item }">
      <span>
        {{ formatBytes(item.file_size_bytes) }}
      </span>
    </template>
    <template v-slot:item.regions="{ item }">
      <span class="px-1" v-for="region in item.regions">
        {{ regionToEmoji(region) }}
      </span>
    </template>
    <template v-slot:item.languages="{ item }">
      <span class="px-1" v-for="language in item.languages">
        {{ languageToEmoji(language) }}
      </span>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        class="ma-1 bg-terciary"
        rounded="0"
        @click.stop="romApi.downloadRom({ rom: item })"
        :disabled="downloadStore.value.includes(item.id)"
        download
        size="small"
        variant="text"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
      <v-btn
        v-if="isEmulationSupported(item.platform_slug)"
        size="small"
        variant="text"
        :href="`/play/${item.id}`"
        class="my-1 bg-terciary"
        rounded="0"
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>
      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            rounded="0"
            :disabled="!auth.scopes.includes('roms.write')"
            v-bind="props"
            size="small"
            variant="text"
            class="ma-1 bg-terciary"
            ><v-icon>mdi-dots-vertical</v-icon></v-btn
          >
        </template>
        <admin-menu :rom="item" />
      </v-menu>
    </template>

    <template v-slot:bottom>
      <v-divider class="border-opacity-25" />
      <v-row no-gutters class="pt-2 align-center">
        <v-col cols="11" class="px-6">
          <v-pagination
            rounded="0"
            :show-first-last-page="true"
            active-color="romm-accent-1"
            v-model="page"
            :length="pageCount"
          ></v-pagination>
        </v-col>
        <v-col cols="5" sm="2" xl="1">
          <v-select
            class="pa-2"
            label="Roms per page"
            density="compact"
            variant="outlined"
            :items="PER_PAGE_OPTIONS"
            v-model="romsPerPage"
            hide-details
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>
