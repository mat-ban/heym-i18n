<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import Input from "@/components/ui/Input.vue";
import Label from "@/components/ui/Label.vue";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import { cn } from "@/lib/utils";
import type { NotifyWorkflowMode, RenotifyMode } from "@/types/alerts";

interface WorkflowOption {
  value: string;
  label: string;
}

interface Props {
  notifyWorkflowId: string | null;
  notifyMode: NotifyWorkflowMode;
  renotifyMode: RenotifyMode;
  cooldownMinutes: number | null;
  workflows: WorkflowOption[];
  ownWorkflowId: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:notifyWorkflowId": [value: string | null];
  "update:notifyMode": [value: NotifyWorkflowMode];
  "update:renotifyMode": [value: RenotifyMode];
  "update:cooldownMinutes": [value: number | null];
}>();

const { t } = useI18n();

/** The alert's own workflow is excluded: notifying it would feed its own metric. */
const notifyOptions = computed((): WorkflowOption[] =>
  props.workflows.filter((option) => option.value !== props.ownWorkflowId),
);

const selectedNotify = computed({
  get: (): string | undefined => props.notifyWorkflowId ?? undefined,
  set: (value: string | undefined): void => emit("update:notifyWorkflowId", value ?? null),
});

const NOTIFY_MODES = computed((): { value: NotifyWorkflowMode; title: string; description: string }[] => [
  {
    value: "create",
    title: t("alerts.wizard.createWorkflowTitle", "Create and assign a new workflow"),
    description: t(
      "alerts.wizard.createWorkflowDesc",
      "Makes an empty workflow named after this alert and links it. Open it afterwards to add the Slack, email, or Telegram nodes you want.",
    ),
  },
  {
    value: "existing",
    title: t("alerts.wizard.pickExistingTitle", "Pick an existing workflow"),
    description: t("alerts.wizard.pickExistingDesc", "Run a workflow you have already built."),
  },
  {
    value: "none",
    title: t("alerts.wizard.doNothingTitle", "Do nothing"),
    description: t("alerts.wizard.doNothingDesc", "The firing is still recorded here, it just does not run anything."),
  },
]);

function selectNotifyMode(mode: NotifyWorkflowMode): void {
  emit("update:notifyMode", mode);
  if (mode !== "existing") {
    emit("update:notifyWorkflowId", null);
  }
}

const cooldown = computed({
  get: (): number => props.cooldownMinutes ?? 60,
  set: (value: number): void => emit("update:cooldownMinutes", Number(value) || 60),
});

function selectMode(mode: RenotifyMode): void {
  emit("update:renotifyMode", mode);
  emit("update:cooldownMinutes", mode === "cooldown" ? (props.cooldownMinutes ?? 60) : null);
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-3">
      <Label>{{ $t('alerts.wizard.runWorkflowOnFire') }}</Label>

      <button
        v-for="mode in NOTIFY_MODES"
        :key="mode.value"
        type="button"
        :class="
          cn(
            'w-full rounded-lg border p-4 text-left transition-colors',
            notifyMode === mode.value
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50',
          )
        "
        @click="selectNotifyMode(mode.value)"
      >
        <div class="font-medium">
          {{ mode.title }}
        </div>
        <div class="mt-1 text-xs text-muted-foreground">
          {{ mode.description }}
        </div>
      </button>

      <div
        v-if="notifyMode === 'existing'"
        class="space-y-2 pl-1"
      >
        <Label for="alert-notify-workflow">{{ $t('common.workflow') }}</Label>
        <SearchableSelect
          id="alert-notify-workflow"
          v-model="selectedNotify"
          :options="notifyOptions"
          :placeholder="$t('alerts.wizard.chooseWorkflow')"
          clearable
        />
      </div>

      <p class="text-xs text-muted-foreground">
        The alert payload arrives as the workflow's input body, so you can route it to Slack,
        email, Telegram, or anywhere else with the nodes you already have.
      </p>
    </div>

    <div class="space-y-3">
      <Label>{{ $t('alerts.wizard.whileProblemContinues') }}</Label>

      <button
        type="button"
        :class="
          cn(
            'w-full rounded-lg border p-4 text-left transition-colors',
            renotifyMode === 'on_recovery'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50',
          )
        "
        @click="selectMode('on_recovery')"
      >
        <div class="font-medium">
          {{ $t('alerts.wizard.notifyOnce') }}
        </div>
        <div class="mt-1 text-xs text-muted-foreground">
          {{ $t('alerts.wizard.notifyOnceDesc') }}
        </div>
      </button>

      <button
        type="button"
        :class="
          cn(
            'w-full rounded-lg border p-4 text-left transition-colors',
            renotifyMode === 'cooldown'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50',
          )
        "
        @click="selectMode('cooldown')"
      >
        <div class="font-medium">
          {{ $t('alerts.wizard.keepNotifying') }}
        </div>
        <div class="mt-1 text-xs text-muted-foreground">
          {{ $t('alerts.wizard.keepNotifyingDesc') }}
        </div>
      </button>

      <div
        v-if="renotifyMode === 'cooldown'"
        class="space-y-2 pl-1"
      >
        <Label for="alert-cooldown">{{ $t('alerts.wizard.repeatEvery') }}</Label>
        <Input
          id="alert-cooldown"
          v-model="cooldown"
          type="number"
          min="1"
        />
      </div>
    </div>
  </div>
</template>
