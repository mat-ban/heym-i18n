<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Trash2 } from "lucide-vue-next";

import Dialog from "@/components/ui/Dialog.vue";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import Select from "@/components/ui/Select.vue";
import { useDashboardStore } from "@/stores/dashboard";
import type { RecordFormat } from "@/types/dashboard";
import DashboardShareSection from "./DashboardShareSection.vue";

const { t } = useI18n();

const recordFormatOptions = computed<{ value: RecordFormat; label: string }[]>(() => [
  { value: "id", label: t("dashboards.recordFormats.id") },
  { value: "number", label: t("dashboards.recordFormats.number") },
  { value: "uuid", label: t("dashboards.recordFormats.uuid") },
  { value: "email", label: t("dashboards.recordFormats.email") },
]);

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "deleted"): void;
}>();

const dashboardStore = useDashboardStore();
const name = ref("");
const recordFormat = ref<RecordFormat>("id");
const saving = ref(false);

watch(
  () => [props.open, dashboardStore.activeDashboard?.id] as const,
  ([open]) => {
    if (open && dashboardStore.activeDashboard) {
      name.value = dashboardStore.activeDashboard.name;
      recordFormat.value = dashboardStore.activeDashboard.record_format;
    }
  },
  { immediate: true },
);

const canSave = computed<boolean>(() => Boolean(name.value.trim()) && !saving.value);
// The API refuses to delete someone's only dashboard, so the button says so up front.
const canDelete = computed<boolean>(() => dashboardStore.ownedCount > 1);

async function submit(): Promise<void> {
  const dashboard = dashboardStore.activeDashboard;
  if (!canSave.value || !dashboard) return;
  saving.value = true;
  try {
    await dashboardStore.renameDashboard(dashboard.id, name.value.trim());
    if (recordFormat.value !== dashboard.record_format) {
      await dashboardStore.setRecordFormat(dashboard.id, recordFormat.value);
    }
    emit("close");
  } finally {
    saving.value = false;
  }
}

async function remove(): Promise<void> {
  const dashboard = dashboardStore.activeDashboard;
  if (!dashboard || !canDelete.value) return;
  if (!window.confirm(t("dashboards.deleteDashboardConfirm", { name: dashboard.name }))) return;
  await dashboardStore.deleteDashboard(dashboard.id);
  emit("deleted");
  emit("close");
}
</script>

<template>
  <Dialog
    :open="open"
    :title="$t('dashboards.dashboardSettings')"
    @close="emit('close')"
  >
    <div class="flex flex-col gap-4 p-1">
      <Input
        v-model="name"
        :placeholder="$t('dashboards.dashboardName')"
        data-testid="dashboard-settings-name"
        @keydown.enter="submit"
      />

      <div class="space-y-1">
        <label class="text-sm font-medium">{{ $t("dashboards.detailPageRecords") }}</label>
        <Select
          :model-value="recordFormat"
          :options="recordFormatOptions"
          data-testid="dashboard-settings-record-format"
          @update:model-value="recordFormat = ($event as RecordFormat | undefined) ?? 'id'"
        />
        <p class="text-xs text-muted-foreground">
          {{ $t("dashboards.detailPageRecordsHelp") }}
        </p>
      </div>

      <DashboardShareSection
        v-if="dashboardStore.activeDashboard"
        :key="dashboardStore.activeDashboard.id"
        :dashboard-id="dashboardStore.activeDashboard.id"
      />

      <div class="flex items-center justify-between gap-2 border-t border-border/60 pt-4">
        <Button
          variant="ghost"
          class="text-destructive hover:bg-destructive/10 hover:text-destructive"
          :disabled="!canDelete"
          :title="canDelete ? $t('dashboards.deleteDashboard') : $t('dashboards.atLeastOneDashboardRequired')"
          data-testid="dashboard-settings-delete"
          @click="remove"
        >
          <Trash2 class="mr-1 h-4 w-4" />
          {{ $t("common.delete") }}
        </Button>
        <div class="flex gap-2">
          <Button
            variant="ghost"
            @click="emit('close')"
          >
            {{ $t("common.cancel") }}
          </Button>
          <Button
            :disabled="!canSave"
            data-testid="dashboard-settings-save"
            @click="submit"
          >
            {{ $t("common.save") }}
          </Button>
        </div>
      </div>
    </div>
  </Dialog>
</template>
