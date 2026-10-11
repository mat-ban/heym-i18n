<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import type { ScheduleEvent } from "@/types/schedule";

defineOptions({ inheritAttrs: false });

defineProps<{
  events: ScheduleEvent[];
}>();

const { t } = useI18n();
const triggerRef = ref<HTMLButtonElement | null>(null);
const showTooltip = ref(false);
const tooltipPosition = ref({ left: 0, top: 0, showAbove: false });

const tooltipStyle = computed(() => ({
  left: `${tooltipPosition.value.left}px`,
  top: `${tooltipPosition.value.top}px`,
  transform: tooltipPosition.value.showAbove ? "translateY(-100%)" : "none",
}));

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function showOverflowTooltip(): void {
  const trigger = triggerRef.value;
  if (!trigger) return;

  const rect = trigger.getBoundingClientRect();
  const showAbove = rect.bottom > window.innerHeight - 160;
  tooltipPosition.value = {
    left: Math.max(8, Math.min(rect.left, window.innerWidth - 264)),
    top: showAbove ? rect.top - 6 : rect.bottom + 6,
    showAbove,
  };
  showTooltip.value = true;
}

function hideOverflowTooltip(): void {
  showTooltip.value = false;
}
</script>

<template>
  <button
    ref="triggerRef"
    v-bind="$attrs"
    type="button"
    class="w-fit text-[10px] text-muted-foreground hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
    :aria-label="t('schedules.calendar.showMoreAria', { count: events.length })"
    @mouseenter="showOverflowTooltip"
    @mouseleave="hideOverflowTooltip"
    @focus="showOverflowTooltip"
    @blur="hideOverflowTooltip"
  >
    +{{ events.length }} {{ $t('schedules.calendar.more') }}
  </button>

  <Teleport to="body">
    <div
      v-if="showTooltip"
      class="fixed z-[9999] pointer-events-none"
      :style="tooltipStyle"
      role="tooltip"
    >
      <div class="w-64 rounded border border-border bg-popover px-2 py-1.5 text-xs shadow-lg">
        <p class="mb-1 font-semibold text-foreground">
          {{ $t('schedules.calendar.additionalSchedules') }}
        </p>
        <div
          v-for="event in events"
          :key="event.workflow_id + event.scheduled_at"
          class="flex items-center justify-between gap-3 py-0.5"
        >
          <span class="truncate text-foreground">{{ event.workflow_name }}</span>
          <span class="shrink-0 font-mono text-muted-foreground">
            {{ formatTime(event.scheduled_at) }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
