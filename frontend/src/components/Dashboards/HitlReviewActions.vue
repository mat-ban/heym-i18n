<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { i18n } from "@/i18n";

defineProps<{
  editing: boolean;
  submitting: boolean;
  preview: boolean;
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "save"): void;
  (e: "edit"): void;
  (e: "accept"): void;
  (e: "refuse"): void;
}>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let t: (key: string, values?: any) => string;
try {
  const comp = useI18n();
  t = comp.t;
} catch {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = i18n.global as any;
  t = g?.t ? g.t.bind(g) : ((key: string) => key);
}

const actionClass =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-full px-3.5 text-xs font-medium leading-none whitespace-nowrap disabled:pointer-events-none disabled:opacity-50";
// Work's dark `primary` is violet text, and its page background sits below the card.
const filledClass = [
  "bg-primary text-primary-foreground hover:bg-primary/90",
  "dark:bg-primary-solid dark:text-primary-solid-foreground dark:hover:bg-primary-solid/90",
].join(" ");
const outlineClass = "border border-border bg-card text-foreground hover:bg-accent";
const dangerClass =
  "border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15";
</script>

<template>
  <div class="mt-2 flex w-full min-w-0 shrink-0 flex-nowrap items-center gap-2">
    <template v-if="editing">
      <button
        type="button"
        :class="[actionClass, outlineClass]"
        :disabled="submitting || preview"
        @click="emit('cancel')"
      >
        {{ t("common.cancel") }}
      </button>
      <button
        type="button"
        :class="[actionClass, filledClass]"
        :disabled="submitting || preview"
        @click="emit('save')"
      >
        <Loader2
          v-if="submitting"
          class="mr-1 h-3 w-3 animate-spin"
        />
        {{ t("common.save") }}
      </button>
    </template>
    <template v-else>
      <button
        type="button"
        :class="[actionClass, filledClass]"
        :disabled="submitting || preview"
        @click="emit('accept')"
      >
        <Loader2
          v-if="submitting"
          class="mr-1 h-3 w-3 animate-spin"
        />
        {{ t("dashboards.hitl.approve") }}
      </button>
      <button
        type="button"
        :class="[actionClass, outlineClass]"
        :disabled="submitting || preview"
        @click="emit('edit')"
      >
        {{ t("dashboards.hitl.requestChanges") }}
      </button>
      <button
        type="button"
        :class="[actionClass, dangerClass]"
        :disabled="submitting || preview"
        @click="emit('refuse')"
      >
        {{ t("dashboards.hitl.reject") }}
      </button>
    </template>
  </div>
</template>
