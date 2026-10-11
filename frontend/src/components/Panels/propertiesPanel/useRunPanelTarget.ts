import { computed, nextTick, ref, watch, type ComputedRef, type Ref } from "vue";
import { useI18n } from "vue-i18n";

import { useWorkflowStore } from "@/stores/workflow";

interface RunPanelTarget {
  runPanel: Ref<HTMLElement | null>;
  runLabel: ComputedRef<string>;
}

export function useRunPanelTarget(): RunPanelTarget {
  const workflowStore = useWorkflowStore();
  const { t } = useI18n();
  const runPanel = ref<HTMLElement | null>(null);
  const runLabel = computed(() => workflowStore.runUntilNode
    ? t("propertiesPanel.runToNode", { node: workflowStore.runUntilNode.data.label })
    : t("propertiesPanel.runWorkflow"));
  watch(
    () => workflowStore.runInputFocusRequest,
    async (request) => {
      if (!request || !workflowStore.runUntilNodeId) return;
      await nextTick();
      runPanel.value?.querySelector<HTMLTextAreaElement>("textarea:not(:disabled)")?.focus();
    },
    { immediate: true, flush: "post" },
  );
  return { runPanel, runLabel };
}
