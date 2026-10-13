<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { BadgeCheck, Check, Loader2 } from "lucide-vue-next";

import { useCycleStep } from "@/features/release-tour/useCycleStep";

const { t } = useI18n();
// Mock UI only. 0: a request in Heym Work · 1: Heym builds and tests it · 2: Verified · 3: Heym runs it.
const step = useCycleStep(4, 1500);

const caption = computed<string>(() => {
  if (step.value === 0) return t("releaseTour.heymWork.step0");
  if (step.value === 1) return t("releaseTour.heymWork.step1");
  if (step.value === 2) return t("releaseTour.heymWork.step2");
  return t("releaseTour.heymWork.step3");
});
</script>

<template>
  <div class="flex h-full w-full flex-col justify-between gap-1.5 rounded-lg bg-card p-3">
    <div class="flex items-center gap-1.5 text-[10px] font-semibold">
      <span>Heym</span>
      <span class="text-primary">Work</span>
      <span class="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
        #legal
      </span>
    </div>
    <p class="ml-auto max-w-[85%] rounded-md bg-primary/10 px-2 py-1 text-[10px] leading-snug">
      {{ $t('releaseTour.heymWork.prompt') }}
    </p>
    <div
      class="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-[10px] text-muted-foreground transition-opacity duration-500"
      :class="step >= 1 ? 'opacity-100' : 'opacity-0'"
    >
      <Loader2
        v-if="step === 1"
        class="h-3 w-3 animate-spin text-primary"
      />
      <Check
        v-else
        class="h-3 w-3 text-primary"
      />
      {{ $t('releaseTour.heymWork.testing') }}
    </div>
    <div
      class="rounded-md border px-2 py-1 text-[10px] transition-colors duration-500"
      :class="step >= 2 ? 'border-primary/60 bg-primary/10 text-foreground' : 'border-border text-muted-foreground'"
    >
      <span class="flex items-center gap-1 font-semibold uppercase tracking-wider text-primary">
        <BadgeCheck class="h-3 w-3" />
        {{ $t('releaseTour.heymWork.verified') }}
      </span>
    </div>
    <div class="flex items-center justify-between text-[10px]">
      <span class="text-muted-foreground">{{ caption }}</span>
      <span
        class="rounded-md px-2 py-0.5 transition-colors duration-500"
        :class="step === 3 ? 'bg-primary/15 text-primary' : 'text-muted-foreground'"
      >
        Heym
      </span>
    </div>
  </div>
</template>
