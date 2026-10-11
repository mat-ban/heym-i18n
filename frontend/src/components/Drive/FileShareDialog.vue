<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Check, Copy, Link, Trash2, Users } from "lucide-vue-next";

import type { FileAccessToken, CreateShareRequest } from "@/types/file";

import Button from "@/components/ui/Button.vue";
import Dialog from "@/components/ui/Dialog.vue";
import Input from "@/components/ui/Input.vue";
import Label from "@/components/ui/Label.vue";
import { filesApi } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { onDismissOverlays, pushOverlayState } from "@/composables/useOverlayBackHandler";

const props = defineProps<{
  open: boolean;
  fileId: string;
  filename: string;
  sharedWithMyTeams: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "updated"): void;
}>();

const shares = ref<FileAccessToken[]>([]);
const loading = ref(false);
const error = ref("");
const { t } = useI18n();
const copied = ref(false);

const expiresHours = ref<string>("");
const basicAuthPassword = ref("");
const maxDownloads = ref<string>("");
const creating = ref(false);
const teamSharingEnabled = ref(false);
const updatingTeamSharing = ref(false);

let unsubDismiss: (() => void) | null = null;

watch(
  () => props.open,
  async (open) => {
    if (open) {
      teamSharingEnabled.value = props.sharedWithMyTeams;
      pushOverlayState();
      unsubDismiss = onDismissOverlays(() => emit("close"));
      await loadShares();
    } else {
      unsubDismiss?.();
      unsubDismiss = null;
    }
  },
);

onUnmounted(() => {
  unsubDismiss?.();
});

async function loadShares() {
  loading.value = true;
  error.value = "";
  try {
    shares.value = await filesApi.listShares(props.fileId);
  } catch {
    error.value = t("drive.failedToLoadShares");
  } finally {
    loading.value = false;
  }
}

async function createShare() {
  creating.value = true;
  error.value = "";
  try {
    const data: CreateShareRequest = {};
    if (expiresHours.value) data.expires_hours = parseInt(expiresHours.value);
    if (basicAuthPassword.value) data.basic_auth_password = basicAuthPassword.value;
    if (maxDownloads.value) data.max_downloads = parseInt(maxDownloads.value);

    await filesApi.createShare(props.fileId, data);
    expiresHours.value = "";
    basicAuthPassword.value = "";
    maxDownloads.value = "";
    await loadShares();
  } catch {
    error.value = t("drive.failedToCreateShare");
  } finally {
    creating.value = false;
  }
}

async function revokeShare(tokenId: string) {
  try {
    await filesApi.revokeShare(props.fileId, tokenId);
    await loadShares();
  } catch {
    error.value = t("drive.failedToRevokeShare");
  }
}

async function updateTeamSharing(event: Event): Promise<void> {
  const enabled = (event.target as HTMLInputElement).checked;
  updatingTeamSharing.value = true;
  error.value = "";
  try {
    const result = await filesApi.setTeamSharing(props.fileId, enabled);
    teamSharingEnabled.value = result.enabled;
    emit("updated");
  } catch {
    teamSharingEnabled.value = !enabled;
    error.value = t("drive.failedToUpdateTeamSharing");
  } finally {
    updatingTeamSharing.value = false;
  }
}

async function copyLink(url: string) {
  await navigator.clipboard.writeText(url);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
</script>

<template>
  <Dialog
    :open="open"
    :title="$t('drive.shareFileTitle', { filename })"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <!-- Team sharing -->
      <div class="space-y-2 p-3 rounded-lg border border-border bg-muted/30">
        <p class="text-sm font-medium flex items-center gap-2">
          <Users class="w-3.5 h-3.5" />
          {{ $t("drive.teamSharing") }}
        </p>
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            class="h-4 w-4 rounded border-input bg-background"
            :checked="teamSharingEnabled"
            :disabled="updatingTeamSharing"
            @change="updateTeamSharing"
          >
          {{ $t("drive.shareWithMyTeams") }}
        </label>
        <p class="text-xs text-muted-foreground">
          {{ $t("drive.teamSharingHelp") }}
        </p>
      </div>

      <!-- Create new share -->
      <div class="space-y-3 p-3 rounded-lg border border-border bg-muted/30">
        <p class="text-sm font-medium">
          {{ $t("drive.createNewShareLink") }}
        </p>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <Label class="text-xs">{{ $t("drive.expiresHours") }}</Label>
            <Input
              v-model="expiresHours"
              type="number"
              :placeholder="$t('drive.noExpiry')"
              class="text-xs"
            />
          </div>
          <div>
            <Label class="text-xs">{{ $t("drive.password") }}</Label>
            <Input
              v-model="basicAuthPassword"
              type="password"
              :placeholder="$t('drive.noPassword')"
              class="text-xs"
            />
          </div>
          <div>
            <Label class="text-xs">{{ $t("drive.maxDownloads") }}</Label>
            <Input
              v-model="maxDownloads"
              type="number"
              :placeholder="$t('drive.unlimited')"
              class="text-xs"
            />
          </div>
        </div>
        <Button
          size="sm"
          :disabled="creating"
          @click="createShare"
        >
          <Link class="w-3.5 h-3.5 mr-1" />
          {{ creating ? $t("drive.creating") : $t("drive.createLink") }}
        </Button>
      </div>

      <!-- Existing shares -->
      <div
        v-if="loading"
        class="text-sm text-muted-foreground text-center py-4"
      >
        {{ $t("common.loading") }}
      </div>

      <div
        v-else-if="shares.length === 0"
        class="text-sm text-muted-foreground text-center py-4"
      >
        {{ $t("drive.noShareLinksYet") }}
      </div>

      <div
        v-else
        class="space-y-2 max-h-60 overflow-y-auto"
      >
        <div
          v-for="share in shares"
          :key="share.id"
          class="flex items-center gap-2 p-2 rounded-lg border border-border bg-card text-xs"
        >
          <div class="flex-1 min-w-0">
            <div class="truncate font-mono text-[11px] text-muted-foreground">
              {{ share.download_url }}
            </div>
            <div class="flex flex-wrap gap-2 mt-0.5 text-muted-foreground">
              <span
                v-if="share.basic_auth_enabled"
                class="text-amber-500"
              >{{ $t("drive.username") }} <span class="font-mono">file</span></span>
              <span v-if="share.expires_at">{{ $t("drive.expiresAt", { date: formatDate(share.expires_at) }) }}</span>
              <span>{{ $t("drive.downloadsCount", { count: share.download_count }) }}</span>
              <span v-if="share.max_downloads">{{ $t("drive.maxDownloadsCount", { max: share.max_downloads }) }}</span>
            </div>
          </div>
          <button
            class="p-1 rounded hover:bg-muted"
            :title="$t('drive.copyLink')"
            @click="copyLink(share.download_url)"
          >
            <Check
              v-if="copied"
              class="w-3.5 h-3.5 text-green-500"
            />
            <Copy
              v-else
              class="w-3.5 h-3.5"
            />
          </button>
          <button
            class="p-1 rounded hover:bg-destructive/10 text-destructive"
            :title="$t('drive.revoke')"
            @click="revokeShare(share.id)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p
        v-if="error"
        class="text-xs text-destructive"
      >
        {{ error }}
      </p>
    </div>
  </Dialog>
</template>
