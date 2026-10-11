<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { X } from "lucide-vue-next";

import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import type { DashboardWidget, WidgetUpdateRequest } from "@/types/dashboard";

const props = defineProps<{
  widget: DashboardWidget;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", payload: WidgetUpdateRequest): void;
}>();

function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    event.stopPropagation();
    emit("close");
  }
}

// Capture phase so Escape reaches us before any ancestor keydown handler can
// stopPropagation (several exist in the dashboard view) and swallow the event.
onMounted(() => window.addEventListener("keydown", onKeydown, true));
onUnmounted(() => window.removeEventListener("keydown", onKeydown, true));

const title = ref(props.widget.title);
const description = ref(props.widget.description ?? "");
const cacheTtlSeconds = ref(props.widget.cache_ttl_seconds);

function save(): void {
  emit("save", {
    title: title.value.trim() || "Untitled",
    description: description.value.trim() ? description.value.trim() : null,
    cache_ttl_seconds: Number(cacheTtlSeconds.value) || 0,
  });
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-md rounded-lg border bg-card p-5 shadow-lg">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold">
            {{ $t("dashboards.widgetSettings") }}
          </h2>
          <button
            class="rounded p-1 text-muted-foreground hover:bg-accent"
            @click="emit('close')"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="space-y-3">
          <div class="space-y-1">
            <label class="text-sm font-medium">{{ $t("dashboards.title") }}</label>
            <Input v-model="title" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium">{{ $t("dashboards.description") }}</label>
            <textarea
              v-model="description"
              rows="2"
              class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
              :placeholder="$t('dashboards.canvasDescriptionPlaceholder')"
            />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium">{{ $t("dashboards.cacheDuration") }}</label>
            <Input
              v-model.number="cacheTtlSeconds"
              type="number"
              min="0"
            />
            <p class="text-xs text-muted-foreground">
              {{ $t("dashboards.cacheDurationHelp") }}
            </p>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <Button
            variant="ghost"
            @click="emit('close')"
          >
            {{ $t("common.cancel") }}
          </Button>
          <Button @click="save">
            {{ $t("common.save") }}
          </Button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
