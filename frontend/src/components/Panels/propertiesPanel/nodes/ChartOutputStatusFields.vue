<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Plus, Trash2 } from "lucide-vue-next";

import type { StatusTone } from "@/types/dashboard";
import Button from "@/components/ui/Button.vue";
import ExpressionInput from "@/components/ui/ExpressionInput.vue";
import Input from "@/components/ui/Input.vue";
import Label from "@/components/ui/Label.vue";
import Select from "@/components/ui/Select.vue";
import { usePropertiesPanelContext } from "../usePropertiesPanelController";

const { t } = useI18n();

const toneOptions = computed<{ value: StatusTone; label: string }[]>(() => [
  { value: "success", label: t("propertiesPanel.chartOutput.tones.success") },
  { value: "attention", label: t("propertiesPanel.chartOutput.tones.attention") },
  { value: "failure", label: t("propertiesPanel.chartOutput.tones.failure") },
  { value: "waiting", label: t("propertiesPanel.chartOutput.tones.waiting") },
  { value: "neutral", label: t("propertiesPanel.chartOutput.tones.neutral") },
]);

const {
  workflowStore,
  selectedNode,
  selectedNodeEvaluateDialogLabel,
  chartOutputExpressionFieldCount,
  chartOutputExpressionFieldIndex,
  setChartOutputExpressionInputRef,
  handleChartOutputExpressionFieldNavigate,
  onChartOutputRegisterExpressionFieldIndex,
  updateNodeData,
} = usePropertiesPanelContext();

const toneRows = computed<[string, StatusTone][]>(() =>
  Object.entries(selectedNode.value?.data.statusTones ?? {}),
);

function saveTones(rows: [string, StatusTone][]): void {
  updateNodeData("statusTones", Object.fromEntries(rows));
}

function updateRow(index: number, value: string, tone: StatusTone): void {
  saveTones(toneRows.value.map((row, i) => (i === index ? [value, tone] : row)));
}

function addRow(): void {
  saveTones([...toneRows.value, ["", "success"]]);
}

function removeRow(index: number): void {
  saveTones(toneRows.value.filter((_row, i) => i !== index));
}
</script>

<template>
  <template v-if="selectedNode">
    <div class="space-y-2">
      <Label>{{ $t("propertiesPanel.chartOutput.statusColumnOptional") }}</Label>
      <ExpressionInput
        :ref="(el: unknown) => setChartOutputExpressionInputRef('statusColumn', el)"
        :model-value="selectedNode.data.statusColumn || ''"
        :placeholder="$t('propertiesPanel.chartOutput.statusColumnPlaceholder')"
        single-line
        :nodes="workflowStore.nodes"
        :node-results="workflowStore.nodeResults"
        :edges="workflowStore.edges"
        :current-node-id="selectedNode.id"
        :dialog-node-label="selectedNodeEvaluateDialogLabel"
        :dialog-key-label="$t('propertiesPanel.chartOutput.statusColumnDialogLabel')"
        field-key="statusColumn"
        :navigation-enabled="chartOutputExpressionFieldCount > 1"
        :navigation-index="chartOutputExpressionFieldIndex('statusColumn')"
        :navigation-total="chartOutputExpressionFieldCount"
        @navigate="handleChartOutputExpressionFieldNavigate"
        @register-field-index="onChartOutputRegisterExpressionFieldIndex"
        @update:model-value="updateNodeData('statusColumn', $event)"
      />
      <p class="text-xs text-muted-foreground">
        {{ $t("propertiesPanel.chartOutput.statusColumnHelp") }}
      </p>
    </div>

    <div
      v-if="selectedNode.data.statusColumn"
      class="space-y-2"
      data-testid="chart-output-status-tones"
    >
      <Label>{{ $t("propertiesPanel.chartOutput.statusTones") }}</Label>
      <div
        v-for="([value, tone], index) in toneRows"
        :key="index"
        class="flex items-center gap-2"
      >
        <Input
          :model-value="value"
          class="flex-1"
          :placeholder="$t('propertiesPanel.chartOutput.statusValuePlaceholder')"
          :aria-label="$t('propertiesPanel.chartOutput.statusValueAriaLabel')"
          @update:model-value="updateRow(index, String($event), tone)"
        />
        <Select
          :model-value="tone"
          :options="toneOptions"
          class="w-36"
          @update:model-value="updateRow(index, value, ($event as StatusTone | undefined) ?? 'neutral')"
        />
        <button
          class="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          :aria-label="$t('propertiesPanel.chartOutput.removeTone')"
          @click="removeRow(index)"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        :disabled="toneRows.some(([value]) => !value)"
        @click="addRow"
      >
        <Plus class="mr-1 h-4 w-4" /> {{ $t("propertiesPanel.chartOutput.addTone") }}
      </Button>
    </div>
  </template>
</template>
