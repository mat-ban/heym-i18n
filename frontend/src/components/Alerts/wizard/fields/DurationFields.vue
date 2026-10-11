<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import Input from "@/components/ui/Input.vue";
import Label from "@/components/ui/Label.vue";
import Select from "@/components/ui/Select.vue";
import type { DurationAggregation, WorkflowDurationConfig } from "@/types/alerts";

interface Props {
  modelValue: WorkflowDurationConfig;
}

const props = defineProps<Props>();
const emit = defineEmits<{ "update:modelValue": [value: WorkflowDurationConfig] }>();

const { t } = useI18n();

const AGGREGATION_OPTIONS = computed(() => [
  { value: "max", label: t("alerts.wizard.slowestRun") },
  { value: "avg", label: t("alerts.wizard.averageRun") },
  { value: "p95", label: t("alerts.wizard.p95Run") },
]);

const thresholdSeconds = computed({
  get: (): number => Math.round(props.modelValue.threshold_ms / 1000),
  set: (value: number): void => {
    emit("update:modelValue", {
      ...props.modelValue,
      threshold_ms: Math.max(1, Number(value) || 1) * 1000,
    });
  },
});

const aggregation = computed({
  get: (): string => props.modelValue.aggregation,
  set: (value: string | undefined): void => {
    emit("update:modelValue", {
      ...props.modelValue,
      aggregation: (value ?? "max") as DurationAggregation,
    });
  },
});

const minSamples = computed({
  get: (): number => props.modelValue.min_samples,
  set: (value: number): void => {
    emit("update:modelValue", { ...props.modelValue, min_samples: Number(value) || 1 });
  },
});
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <Label for="alert-duration-aggregation">{{ $t('alerts.wizard.measure') }}</Label>
      <Select
        id="alert-duration-aggregation"
        v-model="aggregation"
        :options="AGGREGATION_OPTIONS"
      />
    </div>

    <div class="space-y-2">
      <Label for="alert-duration-threshold">{{ $t('alerts.wizard.slowerThan') }}</Label>
      <Input
        id="alert-duration-threshold"
        v-model="thresholdSeconds"
        type="number"
        min="1"
      />
    </div>

    <div class="space-y-2">
      <Label for="alert-duration-min-samples">{{ $t('alerts.wizard.minRuns') }}</Label>
      <Input
        id="alert-duration-min-samples"
        v-model="minSamples"
        type="number"
        min="1"
      />
      <p class="text-xs text-muted-foreground">
        {{ $t('alerts.wizard.minRunsDesc') }}
      </p>
    </div>
  </div>
</template>
