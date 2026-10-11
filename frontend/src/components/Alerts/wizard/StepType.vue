<script setup lang="ts">
import { cn } from "@/lib/utils";
import { ALERT_TYPE_META, type AlertType } from "@/types/alerts";

interface Props {
  alertType: AlertType | null;
}

defineProps<Props>();
const emit = defineEmits<{ "update:alertType": [value: AlertType] }>();
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2">
    <button
      v-for="meta in ALERT_TYPE_META"
      :key="meta.type"
      type="button"
      :class="
        cn(
          'rounded-lg border p-4 text-left transition-colors',
          alertType === meta.type
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50',
        )
      "
      @click="emit('update:alertType', meta.type)"
    >
      <div class="font-medium">
        {{ $te('alerts.types.' + meta.type) ? $t('alerts.types.' + meta.type) : meta.label }}
      </div>
      <div class="mt-1 text-xs text-muted-foreground">
        {{ $te('alerts.types.' + meta.type + '_question') ? $t('alerts.types.' + meta.type + '_question') : meta.question }}
      </div>
    </button>
  </div>
</template>
