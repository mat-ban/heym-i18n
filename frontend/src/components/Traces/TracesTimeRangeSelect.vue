<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import type { TraceTimeRange } from "@/types/trace";

import Select from "@/components/ui/Select.vue";

interface Props {
  modelValue: TraceTimeRange;
}
interface Emits {
  (e: "update:modelValue", value: TraceTimeRange): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();

const options = computed<Array<{ value: TraceTimeRange; label: string }>>(() => [
  { value: "1h", label: t("traces.timeRange1h") },
  { value: "24h", label: t("traces.timeRange24h") },
  { value: "7d", label: t("traces.timeRange7d") },
  { value: "30d", label: t("traces.timeRange30d") },
  { value: "all", label: t("traces.timeRangeAll") },
]);

const internal = computed({
  get: () => props.modelValue,
  set: (value: TraceTimeRange) => emit("update:modelValue", value),
});
</script>

<template>
  <Select
    v-model="internal"
    :options="options"
  />
</template>
