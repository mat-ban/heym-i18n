<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import type {
  CodexUsage,
  CredentialListItem,
  LLMModel,
  OpenCodeUsage,
} from "@/types/credential";

import CodexUsageCard from "@/components/Layout/aiDefaults/CodexUsageCard.vue";
import OpenCodeUsageCard from "@/components/Layout/aiDefaults/OpenCodeUsageCard.vue";
import Button from "@/components/ui/Button.vue";
import Label from "@/components/ui/Label.vue";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import { useAiDefaults } from "@/composables/useAiDefaults";
import { credentialsApi } from "@/services/api";
import { useAuthStore } from "@/stores/auth";

const emit = defineEmits<{ close: [] }>();

const { t } = useI18n();
const authStore = useAuthStore();
const aiDefaults = useAiDefaults();

const credentials = ref<CredentialListItem[]>([]);
const models = ref<LLMModel[]>([]);
const selectedCredentialId = ref<string>("");
const selectedModel = ref<string>("");
const loadingModels = ref(false);
const saving = ref(false);

const credentialOptions = computed(() => [
  { value: "", label: t("settings.noPreference") },
  ...credentials.value.map((c) => ({ value: c.id, label: c.name })),
]);
const modelOptions = computed(() => [
  { value: "", label: t("settings.selectModel") },
  ...models.value.map((m) => ({ value: m.id, label: m.name })),
]);

const preferredInvalid = computed(() => aiDefaults.preferredStatus(credentials.value) === "invalid");

const codexCreds = ref<CredentialListItem[]>([]);
const openCodeCreds = ref<CredentialListItem[]>([]);
const usageByCred = ref<Record<string, CodexUsage | null>>({});
const openCodeUsageByCred = ref<Record<string, OpenCodeUsage | null>>({});
const usageLoading = ref<Record<string, boolean>>({});

async function loadCodingUsage(): Promise<void> {
  codexCreds.value = await credentialsApi.listByType("codex");
  openCodeCreds.value = await credentialsApi.listByType("opencode");
  await Promise.all([
    ...codexCreds.value.map(async (c) => {
      usageLoading.value = { ...usageLoading.value, [c.id]: true };
      try {
        usageByCred.value = {
          ...usageByCred.value,
          [c.id]: await credentialsApi.getCodexUsage(c.id),
        };
      } catch {
        usageByCred.value = { ...usageByCred.value, [c.id]: null };
      } finally {
        usageLoading.value = { ...usageLoading.value, [c.id]: false };
      }
    }),
    ...openCodeCreds.value.map(async (c) => {
      usageLoading.value = { ...usageLoading.value, [c.id]: true };
      try {
        openCodeUsageByCred.value = {
          ...openCodeUsageByCred.value,
          [c.id]: await credentialsApi.getOpenCodeUsage(c.id),
        };
      } catch {
        openCodeUsageByCred.value = { ...openCodeUsageByCred.value, [c.id]: null };
      } finally {
        usageLoading.value = { ...usageLoading.value, [c.id]: false };
      }
    }),
  ]);
}

async function loadModels(credId: string): Promise<void> {
  models.value = [];
  if (!credId) return;
  loadingModels.value = true;
  try {
    models.value = await credentialsApi.getModels(credId);
  } catch {
    models.value = [];
  } finally {
    loadingModels.value = false;
  }
}

async function onCredentialChange(value: string | undefined): Promise<void> {
  selectedCredentialId.value = value ?? "";
  selectedModel.value = "";
  await loadModels(selectedCredentialId.value);
}

async function handleSave(): Promise<void> {
  saving.value = true;
  try {
    await authStore.updateUser({
      preferred_credential_id: selectedCredentialId.value || null,
      preferred_model: selectedCredentialId.value ? selectedModel.value || null : null,
    });
    emit("close");
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  credentials.value = await credentialsApi.listLLM();
  selectedCredentialId.value = authStore.user?.preferred_credential_id ?? "";
  if (selectedCredentialId.value) {
    await loadModels(selectedCredentialId.value);
    selectedModel.value = authStore.user?.preferred_model ?? "";
  }
  void loadCodingUsage();
});
</script>

<template>
  <div class="space-y-5">
    <div class="space-y-2">
      <Label>{{ $t('settings.preferredLlmCredential') }}</Label>
      <p class="text-xs text-muted-foreground">
        {{ $t('settings.preferredLlmDescription') }}
      </p>
      <SearchableSelect
        :model-value="selectedCredentialId"
        :options="credentialOptions"
        :placeholder="$t('settings.noPreference')"
        :search-placeholder="$t('credentials.searchPlaceholder')"
        @update:model-value="onCredentialChange"
      />
    </div>

    <div
      v-if="selectedCredentialId"
      class="space-y-2"
    >
      <Label>{{ $t('settings.preferredModel') }}</Label>
      <SearchableSelect
        v-model="selectedModel"
        :options="modelOptions"
        :placeholder="$t('settings.selectModel')"
        :search-placeholder="$t('chat.searchModels')"
        :disabled="loadingModels"
      />
    </div>

    <p
      v-if="preferredInvalid"
      class="text-xs text-amber-500"
    >
      {{ $t('settings.preferredInvalidNotice') }}
    </p>

    <div
      v-if="codexCreds.length || openCodeCreds.length"
      class="space-y-2 pt-2 border-t border-border"
    >
      <div class="flex items-center justify-between">
        <Label>{{ $t('settings.codingPackageUsage') }}</Label>
        <Button
          variant="outline"
          size="sm"
          type="button"
          @click="loadCodingUsage"
        >
          {{ $t('common.refresh') }}
        </Button>
      </div>
      <CodexUsageCard
        v-for="c in codexCreds"
        :key="c.id"
        :name="c.name"
        :usage="usageByCred[c.id] ?? null"
        :loading="usageLoading[c.id] ?? false"
      />
      <OpenCodeUsageCard
        v-for="c in openCodeCreds"
        :key="c.id"
        :name="c.name"
        :usage="openCodeUsageByCred[c.id] ?? null"
        :loading="usageLoading[c.id] ?? false"
      />
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <Button
        variant="outline"
        type="button"
        @click="emit('close')"
      >
        {{ $t('common.cancel') }}
      </Button>
      <Button
        type="button"
        :loading="saving"
        @click="handleSave"
      >
        {{ $t('settings.saveAiDefaults') }}
      </Button>
    </div>
  </div>
</template>
