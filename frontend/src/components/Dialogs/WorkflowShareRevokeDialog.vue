<script setup lang="ts">
import { ref, watch } from "vue";

import Button from "@/components/ui/Button.vue";
import Dialog from "@/components/ui/Dialog.vue";

interface Props {
  open: boolean;
  subject: string;
  kind: "user" | "team";
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), { loading: false });
const emit = defineEmits<{
  (e: "confirm", stopAlerts: boolean): void;
  (e: "cancel"): void;
}>();

const stopAlerts = ref(true);

watch(
  () => props.open,
  (open) => {
    if (open) stopAlerts.value = true;
  },
);
</script>

<template>
  <Dialog
    :open="open"
    :title="$t('workflows.revokeAccessTitle')"
    size="sm"
    @close="emit('cancel')"
  >
    <div
      class="space-y-4"
      data-testid="workflow-share-revoke-dialog"
    >
      <p class="text-sm text-muted-foreground">
        {{
          kind === "team"
            ? $t("workflows.revokeAccessSubjectTeam", { subject })
            : $t("workflows.revokeAccessSubjectUser", { subject })
        }}
      </p>
      <label class="flex items-start gap-2 text-sm">
        <input
          v-model="stopAlerts"
          type="checkbox"
          class="mt-0.5 rounded"
          data-testid="workflow-share-revoke-stop-alerts"
        >
        <span>
          {{ $t("workflows.stopAlerts") }}
          <span class="block text-xs text-muted-foreground">
            {{ $t("workflows.stopAlertsHint") }}
          </span>
        </span>
      </label>
      <div class="flex justify-end gap-2">
        <Button
          variant="outline"
          @click="emit('cancel')"
        >
          {{ $t("common.cancel") }}
        </Button>
        <Button
          variant="destructive"
          :loading="loading"
          data-testid="workflow-share-revoke-confirm"
          @click="emit('confirm', stopAlerts)"
        >
          {{ $t("common.remove") }}
        </Button>
      </div>
    </div>
  </Dialog>
</template>
