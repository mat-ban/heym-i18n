<script setup lang="ts">
import { Play, LayoutTemplate } from "lucide-vue-next";

defineEmits<{
  (e: "runRunbook"): void;
  (e: "browseTemplates"): void;
}>();
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
    <div class="pointer-events-auto flex flex-col items-center gap-3 text-center">
      <div class="flex items-stretch gap-4">
        <button
          type="button"
          class="group flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-background px-2 text-center transition-colors duration-200 hover:border-muted-foreground/55 hover:bg-muted"
          @click="$emit('runRunbook')"
        >
          <Play class="h-6 w-6 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
          <span class="text-[11px] font-medium leading-tight text-foreground">
            {{ $t("canvas.runRunbook") }}
          </span>
        </button>
        <button
          type="button"
          class="group flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-background px-2 text-center transition-colors duration-200 hover:border-muted-foreground/55 hover:bg-muted"
          @click="$emit('browseTemplates')"
        >
          <LayoutTemplate class="h-6 w-6 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
          <span class="text-[11px] font-medium leading-tight text-foreground">
            {{ $t("canvas.browseTemplates") }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
