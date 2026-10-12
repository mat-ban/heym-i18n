<script setup lang="ts">
import { ChevronLeft, MoveRight, Pin, X } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { i18n } from "@/i18n";

import type { QuickDrawerWorkflowViewModel } from "@/types/quickDrawer";
import Button from "@/components/ui/Button.vue";

defineProps<{
  workflow: QuickDrawerWorkflowViewModel;
  showClose: boolean;
  showPin: boolean;
  showEyebrow: boolean;
  compact: boolean;
  backLabel: string;
}>();

const emit = defineEmits<{
  back: [];
  close: [];
  goToWorkflow: [event: MouseEvent];
  togglePin: [];
}>();

let t: (key: string, values?: Record<string, unknown>) => string;
try {
  const comp = useI18n();
  t = comp.t;
} catch {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = i18n.global as any;
  t = g?.t ? g.t.bind(g) : ((key: string, values?: Record<string, unknown>) => {
    if (key === "quickDrawer.unpin" && values?.name) return `Unpin ${values.name}`;
    if (key === "quickDrawer.pin" && values?.name) return `Pin ${values.name}`;
    if (key === "quickDrawer.selectedWorkflow") return "Selected Workflow";
    if (key === "quickDrawer.goToWorkflow") return "Go to workflow";
    if (key === "quickDrawer.closeDrawer") return "Close quick workflows drawer";
    return key;
  });
}
</script>

<template>
  <div
    class="border-b border-border/60"
    :class="compact ? 'pb-1.5 pl-2 pr-12 pt-0' : 'px-5 py-4'"
  >
    <div class="flex items-center justify-between gap-3">
      <div
        class="flex min-w-0 items-center"
        :class="compact ? 'gap-1' : 'gap-3'"
      >
        <button
          v-if="compact"
          type="button"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
          :aria-label="backLabel"
          data-testid="quick-workflow-run-back"
          @click="emit('back')"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <Button
          v-else
          variant="ghost"
          size="icon"
          class="h-10 w-10 shrink-0"
          :aria-label="backLabel"
          data-testid="quick-workflow-run-back"
          @click="emit('back')"
        >
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <div class="min-w-0">
          <div
            v-if="showEyebrow"
            class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            {{ t("quickDrawer.selectedWorkflow") }}
          </div>
          <div
            class="truncate font-semibold text-foreground"
            :class="compact ? 'text-base leading-tight' : 'text-lg'"
          >
            {{ workflow.name }}
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80 dark:text-brand-primary-soft dark:hover:text-brand-primary-strong"
            :class="compact ? 'mt-0.5' : 'mt-1'"
            @click="emit('goToWorkflow', $event)"
          >
            <span>{{ t("quickDrawer.goToWorkflow") }}</span>
            <MoveRight class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="showPin"
          type="button"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          :aria-label="workflow.pinned ? t('quickDrawer.unpin', { name: workflow.name }) : t('quickDrawer.pin', { name: workflow.name })"
          @click="emit('togglePin')"
        >
          <Pin
            class="h-4 w-4"
            :class="workflow.pinned ? 'fill-current text-primary' : ''"
          />
        </button>
        <Button
          v-if="showClose"
          variant="ghost"
          size="icon"
          class="h-10 w-10 shrink-0"
          :aria-label="t('quickDrawer.closeDrawer')"
          @click="emit('close')"
        >
          <X class="h-4 w-4" />
        </Button>
      </div>
    </div>
    <p
      v-if="workflow.description"
      class="text-sm text-muted-foreground"
      :class="compact ? 'mt-1.5' : 'mt-3'"
    >
      {{ workflow.description }}
    </p>
  </div>
</template>
