<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Link, Users } from "lucide-vue-next";

import type { CreateShareRequest } from "@/types/file";

import Button from "@/components/ui/Button.vue";
import Dialog from "@/components/ui/Dialog.vue";
import Input from "@/components/ui/Input.vue";
import Label from "@/components/ui/Label.vue";
import { filesApi } from "@/services/api";
import { onDismissOverlays, pushOverlayState } from "@/composables/useOverlayBackHandler";

const props = defineProps<{
  open: boolean;
  fileIds: string[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "updated"): void;
}>();

const error = ref("");
const { t } = useI18n();
const result = ref<{ succeeded: number; failed: number } | null>(null);
const expiresHours = ref<string>("");
const basicAuthPassword = ref("");
const maxDownloads = ref<string>("");
const busy = ref(false);
// Snapshot ids on open: the selection in the parent clears after the first action.
const targetIds = ref<string[]>([]);

let unsubDismiss: (() => void) | null = null;

watch(
  () => props.open,
  (open) => {
    if (open) {
      targetIds.value = [...props.fileIds];
      error.value = "";
      result.value = null;
      expiresHours.value = "";
      basicAuthPassword.value = "";
      maxDownloads.value = "";
      pushOverlayState();
      unsubDismiss = onDismissOverlays(() => emit("close"));
    } else {
      unsubDismiss?.();
      unsubDismiss = null;
    }
  },
);

onUnmounted(() => {
  unsubDismiss?.();
});

async function setTeamSharing(enabled: boolean): Promise<void> {
  busy.value = true;
  error.value = "";
  result.value = null;
  try {
    const res = await filesApi.bulkSetTeamSharing(targetIds.value, enabled);
    result.value = { succeeded: res.succeeded.length, failed: res.failed.length };
    emit("updated");
  } catch {
    error.value = t("drive.failedToUpdateTeamSharing");
  } finally {
    busy.value = false;
  }
}

async function createShareLinks(): Promise<void> {
  busy.value = true;
  error.value = "";
  result.value = null;
  try {
    const data: CreateShareRequest = {};
    if (expiresHours.value) data.expires_hours = parseInt(expiresHours.value);
    if (basicAuthPassword.value) data.basic_auth_password = basicAuthPassword.value;
    if (maxDownloads.value) data.max_downloads = parseInt(maxDownloads.value);

    const res = await filesApi.bulkCreateShare(targetIds.value, data);
    result.value = { succeeded: res.succeeded.length, failed: res.failed.length };
    expiresHours.value = "";
    basicAuthPassword.value = "";
    maxDownloads.value = "";
    emit("updated");
  } catch {
    error.value = t("drive.failedToCreateShareLinks");
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <Dialog
    :open="open"
    :title="$t('drive.bulkActions', { count: targetIds.length })"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <!-- Team sharing -->
      <div class="space-y-2 p-3 rounded-lg border border-border bg-muted/30">
        <p class="text-sm font-medium flex items-center gap-2">
          <Users class="w-3.5 h-3.5" />
          {{ $t("drive.teamSharing") }}
        </p>
        <p class="text-xs text-muted-foreground">
          {{ $t("drive.teamSharingHelp") }}
        </p>
        <div class="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            :disabled="busy"
            @click="setTeamSharing(true)"
          >
            {{ $t("drive.shareAllWithMyTeams") }}
          </Button>
          <Button
            size="sm"
            variant="outline"
            :disabled="busy"
            @click="setTeamSharing(false)"
          >
            {{ $t("drive.removeTeamSharing") }}
          </Button>
        </div>
      </div>

      <!-- Create share links -->
      <div class="space-y-3 p-3 rounded-lg border border-border bg-muted/30">
        <p class="text-sm font-medium">
          {{ $t("drive.createShareLinkForEach") }}
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
          :disabled="busy"
          @click="createShareLinks"
        >
          <Link class="w-3.5 h-3.5 mr-1" />
          {{ busy ? $t("drive.applying") : $t("drive.createLinks") }}
        </Button>
      </div>

      <!-- Result -->
      <p
        v-if="result"
        class="text-xs"
        :class="result.failed > 0 ? 'text-amber-500' : 'text-green-500'"
      >
        {{ $t("drive.bulkResult", { succeeded: result.succeeded, total: result.succeeded + result.failed }) }}
        <span v-if="result.failed > 0">{{ $t("drive.bulkSkipped", { failed: result.failed }) }}</span>
      </p>

      <p
        v-if="error"
        class="text-xs text-destructive"
      >
        {{ error }}
      </p>
    </div>
  </Dialog>
</template>
