<script setup lang="ts">
import { Play, Square } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { i18n } from "@/i18n";

import type { QuickDrawerFileInput, QuickDrawerInputField } from "@/types/quickDrawer";
import Button from "@/components/ui/Button.vue";
import FileDropInput from "@/components/ui/FileDropInput.vue";
import Input from "@/components/ui/Input.vue";

withDefaults(
  defineProps<{
    fields: QuickDrawerInputField[];
    values: Record<string, string>;
    running: boolean;
    /** Set for a workflow with a File Upload trigger: the run needs a file. */
    fileInput?: QuickDrawerFileInput | null;
    file?: File | null;
  }>(),
  { fileInput: null, file: null },
);

const emit = defineEmits<{
  updateInput: [key: string, value: string];
  selectFile: [file: File | null];
  run: [];
  stop: [];
}>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let t: (key: string, values?: any) => string;
try {
  const comp = useI18n();
  t = comp.t;
} catch {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = i18n.global as any;
  t = g?.t ? g.t.bind(g) : ((key: string) => {
    if (key === "quickDrawer.inputs") return "Inputs";
    if (key === "quickDrawer.noInputsRequired") return "This workflow does not require any input fields.";
    if (key === "propertiesPanel.runWorkflow") return "Run Workflow";
    if (key === "quickDrawer.stopWorkflow") return "Stop Workflow";
    return key;
  });
}
</script>

<template>
  <section class="rounded-3xl border border-border/60 bg-background/80 p-4">
    <div class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {{ t("quickDrawer.inputs") }}
    </div>

    <div class="mt-4 space-y-3">
      <FileDropInput
        v-if="fileInput"
        :label="fileInput.label"
        :file="file"
        :allowed-types="fileInput.allowedTypes"
        :max-size-mb="fileInput.maxSizeMb"
        :disabled="running"
        @select="(selected) => emit('selectFile', selected)"
      />
      <template v-if="fields.length > 0">
        <div
          v-for="field in fields"
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
            :model-value="values[field.key] ?? ''"
            :placeholder="field.defaultValue || `Enter ${field.key}`"
            @update:model-value="(value) => emit('updateInput', field.key, value)"
          />
        </div>
      </template>
      <div
        v-else-if="!fileInput"
        class="rounded-2xl border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground"
      >
        {{ t("quickDrawer.noInputsRequired") }}
      </div>
    </div>

    <div class="mt-4 flex items-center gap-3">
      <Button
        v-if="!running"
        variant="gradient"
        class="flex-1"
        data-testid="quick-workflow-run-start"
        :disabled="Boolean(fileInput) && !file"
        @click="emit('run')"
      >
        <Play class="h-4 w-4" />
        <span>{{ t("propertiesPanel.runWorkflow") }}</span>
      </Button>
      <Button
        v-else
        variant="destructive"
        class="flex-1"
        data-testid="quick-workflow-run-stop"
        @click="emit('stop')"
      >
        <Square class="h-4 w-4" />
        <span>{{ t("quickDrawer.stopWorkflow") }}</span>
      </Button>
    </div>
  </section>
</template>
