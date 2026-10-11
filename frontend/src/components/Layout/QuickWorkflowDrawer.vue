<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import {
  Loader2,
  Pin,
  Search,
  Sparkles,
  Workflow,
  X,
} from "lucide-vue-next";

import QuickWorkflowRunPanel from "@/components/Layout/QuickWorkflowRunPanel.vue";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import { cn } from "@/lib/utils";
import { useQuickDrawerStore } from "@/stores/quickDrawer";
import type { QuickDrawerWorkflowViewModel } from "@/types/quickDrawer";

interface Props {
  open: boolean;
}

defineProps<Props>();

const quickDrawerStore = useQuickDrawerStore();
const router = useRouter();
const { t } = useI18n();

const {
  filterText,
  filteredOtherWorkflows,
  filteredPinnedWorkflows,
  isDetailPanelOpen,
  isLoadingWorkflows,
  selectedWorkflow,
  workflowLoadError,
} = storeToRefs(quickDrawerStore);

const hasAnyWorkflowMatch = computed(() => {
  return filteredPinnedWorkflows.value.length > 0 || filteredOtherWorkflows.value.length > 0;
});

function isSelectedWorkflow(workflowId: string): boolean {
  return selectedWorkflow.value?.id === workflowId;
}

function workflowSubtitle(workflow: QuickDrawerWorkflowViewModel): string {
  if (workflow.outputNode?.label) {
    return t("quickDrawer.outputLabel", { label: workflow.outputNode.label });
  }
  if (workflow.description) {
    return workflow.description;
  }
  return t("quickDrawer.quickRun");
}

function goToSelectedWorkflow(_event: MouseEvent): void {
  if (!selectedWorkflow.value) return;
  quickDrawerStore.closeDrawer();
  router.push({
    name: "editor",
    params: { id: selectedWorkflow.value.id },
  });
}
</script>

<template>
  <aside
    :class="cn(
      'quick-workflow-drawer fixed right-0 top-0 z-40 h-screen border-l border-border/60 bg-card/96 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out',
      open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
    )"
    :style="{ width: 'var(--quick-drawer-width)' }"
    :aria-label="$t('quickDrawer.title')"
  >
    <div class="relative flex h-full flex-col overflow-hidden">
      <div class="border-b border-border/60 px-5 py-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles class="h-3.5 w-3.5" />
              Quick Drawer
            </div>
            <h2 class="mt-3 text-xl font-semibold text-foreground">
              {{ $t("quickDrawer.workflows") }}
            </h2>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ $t("quickDrawer.subtitle") }}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            class="h-10 w-10 shrink-0"
            :aria-label="$t('quickDrawer.closeDrawer')"
            @click="quickDrawerStore.closeDrawer()"
          >
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div class="border-b border-border/60 px-5 py-4">
        <div class="relative">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            :model-value="filterText"
            :placeholder="$t('quickDrawer.filterPlaceholder')"
            class="pl-10"
            @update:model-value="quickDrawerStore.updateFilter"
          />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4">
        <div
          v-if="isLoadingWorkflows"
          class="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Loader2 class="h-4 w-4 animate-spin" />
          {{ $t("quickDrawer.loading") }}
        </div>

        <div
          v-else-if="workflowLoadError"
          class="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {{ workflowLoadError }}
        </div>

        <template v-else>
          <div
            v-if="filteredPinnedWorkflows.length > 0"
            class="space-y-2"
          >
            <div class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Pin class="h-3.5 w-3.5" />
              {{ $t("quickDrawer.pinned") }}
            </div>
            <div
              v-for="workflow in filteredPinnedWorkflows"
              :key="workflow.id"
              role="button"
              tabindex="0"
              :class="cn(
                'group flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition-all',
                isSelectedWorkflow(workflow.id)
                  ? 'border-primary/40 bg-primary/10 shadow-sm'
                  : 'border-border/60 bg-background/70 hover:border-primary/30 hover:bg-accent/50'
              )"
              @click="quickDrawerStore.selectWorkflow(workflow.id)"
              @keydown.enter.prevent="quickDrawerStore.selectWorkflow(workflow.id)"
              @keydown.space.prevent="quickDrawerStore.selectWorkflow(workflow.id)"
            >
              <div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Workflow class="h-4 w-4" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-semibold text-foreground">
                  {{ workflow.name }}
                </div>
                <div class="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {{ workflowSubtitle(workflow) }}
                </div>
              </div>
              <button
                type="button"
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
                :aria-label="t('quickDrawer.unpin', { name: workflow.name })"
                @click.stop="quickDrawerStore.togglePin(workflow.id)"
              >
                <Pin class="h-4 w-4 fill-current" />
              </button>
            </div>
          </div>

          <div
            class="space-y-2"
            :class="filteredPinnedWorkflows.length > 0 ? 'mt-5' : ''"
          >
            <div class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Workflow class="h-3.5 w-3.5" />
              {{ $t("quickDrawer.allWorkflows") }}
            </div>

            <div
              v-for="workflow in filteredOtherWorkflows"
              :key="workflow.id"
              role="button"
              tabindex="0"
              :class="cn(
                'group flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition-all',
                isSelectedWorkflow(workflow.id)
                  ? 'border-primary/40 bg-primary/10 shadow-sm'
                  : 'border-border/60 bg-background/70 hover:border-primary/30 hover:bg-accent/50'
              )"
              @click="quickDrawerStore.selectWorkflow(workflow.id)"
              @keydown.enter.prevent="quickDrawerStore.selectWorkflow(workflow.id)"
              @keydown.space.prevent="quickDrawerStore.selectWorkflow(workflow.id)"
            >
              <div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <Workflow class="h-4 w-4" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-semibold text-foreground">
                  {{ workflow.name }}
                </div>
                <div class="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {{ workflowSubtitle(workflow) }}
                </div>
              </div>
              <button
                type="button"
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                :aria-label="t('quickDrawer.pin', { name: workflow.name })"
                @click.stop="quickDrawerStore.togglePin(workflow.id)"
              >
                <Pin class="h-4 w-4" />
              </button>
            </div>

            <div
              v-if="!hasAnyWorkflowMatch"
              class="rounded-2xl border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground"
            >
              {{ $t("quickDrawer.noMatch") }}
            </div>
          </div>
        </template>
      </div>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-full opacity-0"
      >
        <QuickWorkflowRunPanel
          v-if="selectedWorkflow && isDetailPanelOpen"
          class="absolute inset-0 z-20"
          @back="quickDrawerStore.closeDetailPanel()"
          @close="quickDrawerStore.closeDrawer()"
          @go-to-workflow="goToSelectedWorkflow"
        />
      </Transition>
    </div>
  </aside>
</template>
