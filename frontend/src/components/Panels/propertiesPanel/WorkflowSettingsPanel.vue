<script setup lang="ts">
import { computed } from "vue";
import { AlertTriangle, Clock, RotateCcw, Settings, Sparkles } from "lucide-vue-next";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import WorkflowConcurrencySettings from "./WorkflowConcurrencySettings.vue";
import { usePropertiesPanelContext } from "./usePropertiesPanelController";

const {
  workflowStore,
  isWorkflowOwner,
  autoRecoverRuns,
  onToggleAutoRecover,
  otherWorkflows,
  errorWorkflowId,
  onChangeErrorWorkflow,
  minutesSavedPerRun,
  onChangeMinutesSaved,
  workflowTimeoutSeconds,
  onChangeWorkflowTimeout,
  showRunAnalyzer,
  openAnalyzer,
  selectedNode,
} = usePropertiesPanelContext();

const errorWorkflowOptions = computed(() =>
  otherWorkflows.value.map((workflow) => ({
    value: workflow.id,
    label: workflow.name,
  })),
);
</script>

<template>
  <div
    v-if="!selectedNode"
    class="flex-1 flex flex-col overflow-y-auto"
  >
    <div class="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
      <Settings class="w-10 h-10 mx-auto mb-3 opacity-50" />
      <p class="text-sm">
        {{ $t('propertiesPanel.selectNodePrompt') }}
      </p>
    </div>

    <div
      v-if="workflowStore.currentWorkflow"
      class="px-4 pb-6"
    >
      <div class="pb-4">
        <div class="flex items-center gap-2 mb-2">
          <AlertTriangle class="w-4 h-4 text-muted-foreground shrink-0" />
          <span class="text-sm font-medium">{{ $t('propertiesPanel.onErrorRunWorkflow') }}</span>
        </div>
        <SearchableSelect
          :model-value="errorWorkflowId"
          :options="[{ value: '', label: $t('common.none') }, ...errorWorkflowOptions]"
          :placeholder="$t('common.none')"
          :search-placeholder="$t('workflows.searchWorkflows')"
          :disabled="!isWorkflowOwner"
          @update:model-value="onChangeErrorWorkflow"
        />
        <p class="text-xs text-muted-foreground mt-2 leading-relaxed">
          {{ $t('propertiesPanel.onErrorDescription') }}
        </p>
      </div>

      <div class="border-t border-border/40 pt-4 pb-4">
        <div class="flex items-center gap-2 mb-2">
          <Clock class="w-4 h-4 text-muted-foreground shrink-0" />
          <span class="text-sm font-medium">{{ $t('propertiesPanel.timeSavedPerRun') }}</span>
        </div>
        <input
          id="workflow-minutes-saved"
          type="number"
          min="0"
          step="1"
          class="w-full text-sm rounded-md border border-border bg-background px-2 py-1.5 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
          :value="minutesSavedPerRun ?? ''"
          :disabled="!isWorkflowOwner"
          placeholder="e.g. 15"
          @change="onChangeMinutesSaved(($event.target as HTMLInputElement).value)"
        >
        <p class="text-xs text-muted-foreground mt-2 leading-relaxed">
          {{ $t('propertiesPanel.timeSavedDescription') }}
        </p>
      </div>

      <div class="border-t border-border/40 pt-4 pb-4">
        <div class="flex items-center gap-2 mb-2">
          <Clock class="w-4 h-4 text-muted-foreground shrink-0" />
          <span class="text-sm font-medium">{{ $t('propertiesPanel.workflowTimeout') }}</span>
        </div>
        <input
          type="number"
          min="0"
          step="1"
          class="w-full text-sm rounded-md border border-border bg-background px-2 py-1.5 disabled:opacity-50"
          :value="workflowTimeoutSeconds ?? ''"
          :disabled="!isWorkflowOwner"
          :placeholder="$t('propertiesPanel.workflowTimeoutPlaceholder')"
          @change="onChangeWorkflowTimeout(($event.target as HTMLInputElement).value)"
        >
        <p class="text-xs text-muted-foreground mt-2 leading-relaxed">
          {{ $t('propertiesPanel.workflowTimeoutDescription') }}
        </p>
      </div>

      <WorkflowConcurrencySettings />

      <div class="border-t border-border/40 pt-4">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2 min-w-0">
            <RotateCcw class="w-4 h-4 text-muted-foreground shrink-0" />
            <span class="text-sm font-medium">{{ $t('propertiesPanel.autoRecoverRuns') }}</span>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="autoRecoverRuns"
            :disabled="!isWorkflowOwner"
            class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="autoRecoverRuns ? 'bg-primary' : 'bg-muted-foreground/30'"
            @click="onToggleAutoRecover(!autoRecoverRuns)"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="autoRecoverRuns ? 'translate-x-4' : 'translate-x-0.5'"
            />
          </button>
        </div>
        <p class="text-xs text-muted-foreground mt-2 leading-relaxed">
          {{ $t('propertiesPanel.autoRecoverDescription') }}
        </p>
      </div>

      <div
        v-if="showRunAnalyzer"
        class="border-t border-border/40 pt-4"
      >
        <button
          type="button"
          class="w-full inline-flex items-center justify-center gap-2 text-sm font-medium rounded-md px-3 py-2 bg-primary text-primary-foreground hover:opacity-90"
          @click="openAnalyzer"
        >
          <Sparkles class="w-4 h-4" />
          {{ $t('propertiesPanel.runAnalyzer') }}
        </button>
        <p class="text-xs text-muted-foreground mt-2 leading-relaxed">
          {{ $t('propertiesPanel.runAnalyzerDescription') }}
        </p>
      </div>
    </div>
  </div>
</template>
