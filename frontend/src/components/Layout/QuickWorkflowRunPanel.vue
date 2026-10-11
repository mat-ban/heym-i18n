<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Copy,
  Image as ImageIcon,
  Loader2,
  MoveRight,
  Pin,
  Play,
  Square,
  Workflow,
  X,
} from "lucide-vue-next";

import type { NodeResult } from "@/types/workflow";
import ImageLightbox from "@/components/ui/ImageLightbox.vue";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import { useToast } from "@/composables/useToast";
import { useQuickDrawerStore } from "@/stores/quickDrawer";
import { useI18n } from "vue-i18n";

interface Props {
  showClose?: boolean;
  showPin?: boolean;
  showEyebrow?: boolean;
  /** Tighter header for the preview bottom sheet. */
  compact?: boolean;
  backLabel?: string;
}

withDefaults(defineProps<Props>(), {
  showClose: true,
  showPin: true,
  showEyebrow: true,
  compact: false,
  backLabel: "Back to workflow list",
});

const emit = defineEmits<{
  back: [];
  close: [];
  goToWorkflow: [event: MouseEvent];
}>();

const quickDrawerStore = useQuickDrawerStore();
const { showToast } = useToast();
const { t } = useI18n();
const selectedImageSrc = ref<string | null>(null);

const { currentInputValues, runState, selectedWorkflow } = storeToRefs(quickDrawerStore);

const isRunning = computed(() => runState.value.status === "running");

const resultTone = computed(() => {
  if (runState.value.status === "success") {
    return "border-success/30 bg-success/10 text-success";
  }
  if (runState.value.status === "pending") {
    return "border-warning/30 bg-warning/10 text-foreground";
  }
  if (runState.value.status === "error") {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  return "border-border/60 bg-muted/30 text-muted-foreground";
});

const outputImages = computed(() => {
  return extractImages(runState.value.outputs, runState.value.nodeResults);
});

const visibleNodeResults = computed<NodeResult[]>(() => {
  const dedupedResults: NodeResult[] = [];
  const seenNodeIds = new Set<string>();

  for (let index = runState.value.nodeResults.length - 1; index >= 0; index -= 1) {
    const nodeResult = runState.value.nodeResults[index];
    if (nodeResult.status === "skipped") {
      continue;
    }
    if (seenNodeIds.has(nodeResult.node_id)) {
      continue;
    }
    seenNodeIds.add(nodeResult.node_id);
    dedupedResults.unshift(nodeResult);
  }

  return dedupedResults;
});

function formatExecutionTime(executionTimeMs: number | null): string {
  if (executionTimeMs === null) return "Pending";
  if (executionTimeMs < 1000) return `${executionTimeMs.toFixed(0)} ms`;
  return `${(executionTimeMs / 1000).toFixed(2)} s`;
}

function formatJson(value: unknown): string {
  return JSON.stringify(value ?? {}, null, 2);
}

function normalizeImage(value: string): string | null {
  if (value.startsWith("data:image/") || value.startsWith("http")) {
    return value;
  }
  if (value.length > 100 && /^[A-Za-z0-9+/=]+$/.test(value)) {
    return `data:image/png;base64,${value}`;
  }
  return null;
}

function extractImagesFromObject(obj: Record<string, unknown>): string[] {
  const images: string[] = [];

  const directImage = typeof obj.image === "string" ? normalizeImage(obj.image) : null;
  if (directImage) {
    images.push(directImage);
  }

  const screenshot =
    typeof obj.screenshot === "string" ? normalizeImage(obj.screenshot) : null;
  if (screenshot) {
    images.push(screenshot);
  }

  if (obj.results && typeof obj.results === "object") {
    for (const value of Object.values(obj.results as Record<string, unknown>)) {
      if (typeof value !== "string") continue;
      const image = normalizeImage(value);
      if (image) {
        images.push(image);
      }
    }
  }

  return images;
}

function extractImages(
  outputs: Record<string, unknown> | null,
  nodeResults: NodeResult[],
): string[] {
  const seen = new Set<string>();
  const images: string[] = [];

  if (outputs) {
    for (const value of Object.values(outputs)) {
      if (typeof value !== "object" || value === null) continue;
      for (const image of extractImagesFromObject(value as Record<string, unknown>)) {
        if (seen.has(image)) continue;
        seen.add(image);
        images.push(image);
      }
    }
  }

  for (const nodeResult of nodeResults) {
    if (typeof nodeResult.output !== "object" || nodeResult.output === null) continue;
    for (const image of extractImagesFromObject(nodeResult.output as Record<string, unknown>)) {
      if (seen.has(image)) continue;
      seen.add(image);
      images.push(image);
    }
  }

  return images;
}

async function copyFinalOutput(): Promise<void> {
  if (!runState.value.outputs) return;

  try {
    await navigator.clipboard.writeText(formatJson(runState.value.outputs));
    showToast(t("quickDrawer.outputCopied"), "success");
  } catch {
    showToast(t("quickDrawer.outputCopyFailed"), "error");
  }
}
</script>

<template>
  <div
    v-if="selectedWorkflow"
    class="flex h-full min-h-0 flex-1 flex-col bg-card"
    data-testid="quick-workflow-run-panel"
  >
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
              {{ $t("quickDrawer.selectedWorkflow") }}
            </div>
            <div
              class="truncate font-semibold text-foreground"
              :class="compact ? 'text-base leading-tight' : 'text-lg'"
            >
              {{ selectedWorkflow.name }}
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80 dark:text-brand-primary-soft dark:hover:text-brand-primary-strong"
              :class="compact ? 'mt-0.5' : 'mt-1'"
              @click="emit('goToWorkflow', $event)"
            >
              <span>{{ $t("quickDrawer.goToWorkflow") }}</span>
              <MoveRight class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="showPin"
            type="button"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            :aria-label="selectedWorkflow.pinned ? t('quickDrawer.unpin', { name: selectedWorkflow.name }) : t('quickDrawer.pin', { name: selectedWorkflow.name })"
            @click="quickDrawerStore.togglePin(selectedWorkflow.id)"
          >
            <Pin
              class="h-4 w-4"
              :class="selectedWorkflow.pinned ? 'fill-current text-primary' : ''"
            />
          </button>
          <Button
            v-if="showClose"
            variant="ghost"
            size="icon"
            class="h-10 w-10 shrink-0"
            :aria-label="$t('quickDrawer.closeDrawer')"
            @click="emit('close')"
          >
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p
        v-if="selectedWorkflow.description"
        class="text-sm text-muted-foreground"
        :class="compact ? 'mt-1.5' : 'mt-3'"
      >
        {{ selectedWorkflow.description }}
      </p>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
      <div class="space-y-5">
        <section class="rounded-3xl border border-border/60 bg-background/80 p-4">
          <div class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {{ $t("quickDrawer.inputs") }}
          </div>

          <div class="mt-4 space-y-3">
            <template v-if="selectedWorkflow.inputFields.length > 0">
              <div
                v-for="field in selectedWorkflow.inputFields"
                :key="field.key"
                class="space-y-1.5"
              >
                <label
                  :for="`quick-drawer-input-${field.key}`"
                  class="block text-sm font-medium text-foreground"
                >
                  {{ field.key }}
                </label>
                <Input
                  :id="`quick-drawer-input-${field.key}`"
                  :model-value="currentInputValues[field.key] ?? ''"
                  :placeholder="field.defaultValue || `Enter ${field.key}`"
                  @update:model-value="(value) => quickDrawerStore.updateInputValue(field.key, value)"
                />
              </div>
            </template>
            <div
              v-else
              class="rounded-2xl border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground"
            >
              {{ $t("quickDrawer.noInputsRequired") }}
            </div>
          </div>

          <div class="mt-4 flex items-center gap-3">
            <Button
              v-if="!isRunning"
              variant="gradient"
              class="flex-1"
              data-testid="quick-workflow-run-start"
              @click="quickDrawerStore.runSelectedWorkflow()"
            >
              <Play class="h-4 w-4" />
              <span>{{ $t("propertiesPanel.runWorkflow") }}</span>
            </Button>
            <Button
              v-else
              variant="destructive"
              class="flex-1"
              data-testid="quick-workflow-run-stop"
              @click="quickDrawerStore.stopSelectedWorkflowExecution()"
            >
              <Square class="h-4 w-4" />
              <span>{{ $t("quickDrawer.stopWorkflow") }}</span>
            </Button>
          </div>
        </section>

        <section class="rounded-3xl border border-border/60 bg-background/80 p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {{ $t("quickDrawer.progressAndResult") }}
              </div>
              <div
                class="mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
                :class="resultTone"
              >
                <Loader2
                  v-if="runState.status === 'running'"
                  class="h-3.5 w-3.5 animate-spin"
                />
                <CheckCircle2
                  v-else-if="runState.status === 'success'"
                  class="h-3.5 w-3.5"
                />
                <Clock3
                  v-else-if="runState.status === 'pending'"
                  class="h-3.5 w-3.5"
                />
                <AlertTriangle
                  v-else-if="runState.status === 'error'"
                  class="h-3.5 w-3.5"
                />
                <Workflow
                  v-else
                  class="h-3.5 w-3.5"
                />
                <span class="capitalize">{{ runState.status }}</span>
              </div>
            </div>

            <div
              v-if="runState.executionTimeMs !== null || runState.status === 'pending'"
              class="text-right text-xs text-muted-foreground"
            >
              <div class="font-medium text-foreground">
                {{ formatExecutionTime(runState.executionTimeMs) }}
              </div>
              <div v-if="runState.executionHistoryId">
                {{ $t("quickDrawer.historyId", { id: runState.executionHistoryId }) }}
              </div>
            </div>
          </div>

          <div
            v-if="runState.status === 'idle'"
            class="mt-4 rounded-2xl border border-dashed border-border/60 px-4 py-6 text-sm text-muted-foreground"
          >
            {{ $t("quickDrawer.chooseWorkflowPrompt") }}
          </div>

          <div
            v-else
            class="mt-4 space-y-4"
          >
            <div
              v-if="runState.errorMessage"
              class="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {{ runState.errorMessage }}
            </div>

            <div
              v-if="visibleNodeResults.length > 0"
              class="space-y-2"
            >
              <div class="text-sm font-medium text-foreground">
                {{ $t("quickDrawer.stepProgress") }}
              </div>
              <div class="space-y-2">
                <div
                  v-for="nodeResult in visibleNodeResults"
                  :key="`${nodeResult.node_id}-${nodeResult.status}`"
                  class="rounded-2xl border border-border/60 bg-card/70 px-3 py-3"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <div class="truncate text-sm font-medium text-foreground">
                        {{ nodeResult.node_label }}
                      </div>
                      <div class="mt-0.5 text-xs text-muted-foreground">
                        {{ nodeResult.node_type }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div
                        class="text-xs font-medium capitalize"
                        :class="{
                          'text-success': nodeResult.status === 'success',
                          'text-destructive': nodeResult.status === 'error',
                          'text-warning': nodeResult.status === 'pending',
                          'text-primary': nodeResult.status === 'running',
                          'text-muted-foreground': nodeResult.status === 'skipped',
                        }"
                      >
                        {{ nodeResult.status }}
                      </div>
                      <div class="text-[11px] text-muted-foreground">
                        {{ formatExecutionTime(nodeResult.execution_time_ms) }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="nodeResult.error"
                    class="mt-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive"
                  >
                    {{ nodeResult.error }}
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="outputImages.length > 0"
              class="space-y-2"
            >
              <div class="flex items-center gap-2 text-sm font-medium text-foreground">
                <ImageIcon class="h-4 w-4 text-primary" />
                {{ $t("quickDrawer.images") }}
              </div>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="imageSrc in outputImages"
                  :key="imageSrc"
                  type="button"
                  class="overflow-hidden rounded-2xl border border-border/60 bg-muted/20 transition-colors hover:border-primary/40"
                  @click="selectedImageSrc = imageSrc"
                >
                  <img
                    :src="imageSrc"
                    alt="Workflow output image"
                    class="h-32 w-full object-cover"
                  >
                </button>
              </div>
            </div>

            <div
              v-if="runState.outputs"
              class="space-y-2"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="text-sm font-medium text-foreground">
                  {{ $t("quickDrawer.finalOutput") }}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  @click="copyFinalOutput"
                >
                  <Copy class="h-4 w-4" />
                  {{ $t("common.copy") }}
                </Button>
              </div>
              <pre class="max-h-64 overflow-auto rounded-2xl border border-border/60 bg-slate-950 px-4 py-3 text-xs text-slate-100">{{ formatJson(runState.outputs) }}</pre>
            </div>
          </div>
        </section>
      </div>
    </div>

    <ImageLightbox
      :src="selectedImageSrc"
      alt="Quick drawer output image"
      @close="selectedImageSrc = null"
    />
  </div>
</template>
