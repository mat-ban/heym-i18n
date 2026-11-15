<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import type { User } from "@/types/auth";
import type { CredentialListItem } from "@/types/credential";

import Button from "@/components/ui/Button.vue";
import Dialog from "@/components/ui/Dialog.vue";
import Input from "@/components/ui/Input.vue";
import Label from "@/components/ui/Label.vue";
import Select from "@/components/ui/Select.vue";
import Textarea from "@/components/ui/Textarea.vue";
import UserAvatar from "@/components/ui/UserAvatar.vue";
import {
  authApi,
  credentialsApi,
  observabilityApi,
  voiceApi,
  type ObservabilityStatus,
  type VoiceInfo,
} from "@/services/api";
import ClusterSettingsTab from "@/components/Layout/settings/ClusterSettingsTab.vue";
import KeyRotationTab from "@/components/Layout/settings/KeyRotationTab.vue";
import KubernetesCredentialsTab from "@/components/Layout/settings/KubernetesCredentialsTab.vue";
import MfaSettingsSection from "@/components/Layout/settings/MfaSettingsSection.vue";
import SessionsSettingsSection from "@/components/Layout/settings/SessionsSettingsSection.vue";
import SettingsPluginsSection from "@/components/Layout/settings/SettingsPluginsSection.vue";
import SettingsTabNav from "@/components/Layout/settings/SettingsTabNav.vue";
import SsoSettingsTab from "@/components/Layout/settings/SsoSettingsTab.vue";
import UsersSettingsTab from "@/components/Layout/settings/UsersSettingsTab.vue";
import WorkIntegrationSettingsTab from "@/components/Layout/settings/WorkIntegrationSettingsTab.vue";
import { k8sCredentialsEnabled } from "@/services/k8sCredentials";
import { useAuthStore } from "@/stores/auth";

import AiDefaultsTab from "@/components/Layout/aiDefaults/AiDefaultsTab.vue";
import { mergeFreshProfile } from "@/components/Layout/userSettingsProfile";
import { getCurrentLocale, setLocale, isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/i18n";

type SettingsTab =
  | "profile"
  | "security"
  | "voice"
  | "ai-defaults"
  | "observability"
  | "plugins"
  | "sso"
  | "users"
  | "instances"
  | "kubernetes"
  | "encryption"
  | "work";

const props = defineProps<{
  open: boolean;
  initialTab?: SettingsTab;
}>();

const emit = defineEmits<{
  close: [];
}>();

const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();

const activeTab = ref<SettingsTab>("profile");
const selectedLocale = ref<SupportedLocale>(getCurrentLocale());
const languageOptions = SUPPORTED_LOCALES;

async function handleLocaleChange(val: string | undefined): Promise<void> {
  if (val && isSupportedLocale(val)) {
    selectedLocale.value = val;
    await setLocale(val);
  }
}

// Off on Docker installs, so the tab stays hidden until the backend says otherwise.
const kubernetesTabVisible = ref(false);

interface SettingsTabEntry {
  id: SettingsTab;
  label: string;
  adminOnly?: boolean;
  testId?: string;
}

const SETTINGS_TABS = computed<SettingsTabEntry[]>(() => [
  { id: "profile", label: t("settings.profile") },
  { id: "security", label: t("settings.security") },
  { id: "voice", label: t("settings.voice") },
  { id: "ai-defaults", label: t("settings.aiDefaults") },
  { id: "observability", label: t("settings.observability") },
  { id: "plugins", label: t("settings.plugins") },
  { id: "users", label: t("settings.users"), adminOnly: true, testId: "settings-tab-users" },
  { id: "sso", label: t("settings.sso"), adminOnly: true },
  { id: "work", label: "Heym Work", adminOnly: true },
  { id: "instances", label: t("settings.instances"), adminOnly: true },
  { id: "kubernetes", label: "Kubernetes", adminOnly: true, testId: "settings-tab-kubernetes" },
  { id: "encryption", label: t("settings.encryption"), adminOnly: true, testId: "settings-tab-encryption" },
]);

const visibleTabs = computed<SettingsTabEntry[]>(() =>
  SETTINGS_TABS.value.filter((tab) => {
    if (tab.adminOnly && !authStore.user?.is_admin) return false;
    if (tab.id === "kubernetes" && !kubernetesTabVisible.value) return false;
    return true;
  }),
);

const observabilityStatus = ref<ObservabilityStatus | null>(null);
const loadingObservability = ref(false);

async function loadObservabilityStatus(): Promise<void> {
  loadingObservability.value = true;
  try {
    observabilityStatus.value = await observabilityApi.getStatus();
  } catch {
    observabilityStatus.value = null;
  } finally {
    loadingObservability.value = false;
  }
}

const name = ref("");
const userRules = ref("");
const savingProfile = ref(false);

const currentPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const passwordError = ref<string | null>(null);
const passwordSuccess = ref<string | null>(null);
const savingPassword = ref(false);

const elevenLabsCredentials = ref<CredentialListItem[]>([]);
const selectedTtsCredentialId = ref<string>("");
const loadingElevenLabs = ref(false);

const availableVoices = ref<VoiceInfo[]>([]);
const selectedVoiceId = ref<string>("");
const loadingVoices = ref(false);
const savingVoice = ref(false);
const voiceSaved = ref(false);

async function loadElevenLabsCredentials(): Promise<void> {
  loadingElevenLabs.value = true;
  try {
    const creds = await credentialsApi.list();
    elevenLabsCredentials.value = creds.filter((c) => c.type === "elevenlabs");
  } catch {
    elevenLabsCredentials.value = [];
  } finally {
    loadingElevenLabs.value = false;
  }
}

async function loadVoices(): Promise<void> {
  if (!selectedTtsCredentialId.value) {
    availableVoices.value = [];
    selectedVoiceId.value = "";
    return;
  }
  loadingVoices.value = true;
  try {
    const res = await voiceApi.listVoices(selectedTtsCredentialId.value);
    availableVoices.value = res;
  } catch {
    availableVoices.value = [];
  } finally {
    loadingVoices.value = false;
  }
}

function handleTtsCredentialChange(val: string | undefined): void {
  selectedTtsCredentialId.value = val ?? "";
  selectedVoiceId.value = "";
  void loadVoices();
}

function handleVoiceChange(val: string | undefined): void {
  selectedVoiceId.value = val ?? "";
}

function handleGoToCredentials(): void {
  emit("close");
  void router.push({ name: "credentials" });
}

async function handleSaveVoice(): Promise<void> {
  savingVoice.value = true;
  voiceSaved.value = false;
  try {
    await authStore.updateUser({
      tts_credential_id: selectedTtsCredentialId.value || null,
      tts_voice_id: selectedVoiceId.value || null,
    });
    voiceSaved.value = true;
    setTimeout(() => {
      voiceSaved.value = false;
    }, 2500);
  } finally {
    savingVoice.value = false;
  }
}

function populateFromUser(user: User): void {
  name.value = user.name;
  userRules.value = user.user_rules || "";
  selectedTtsCredentialId.value = user.tts_credential_id ?? "";
  selectedVoiceId.value = user.tts_voice_id ?? "";
}

async function refreshProfile(cached: User): Promise<void> {
  try {
    const fresh = await authApi.getMe();
    if (!props.open) return;
    const merged = mergeFreshProfile(
      { name: name.value, userRules: userRules.value },
      cached,
      fresh,
    );
    name.value = merged.name;
    userRules.value = merged.userRules;
    authStore.user = fresh;
  } catch {
    // The cached profile stays in the form; saving still works.
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && authStore.user) {
      populateFromUser(authStore.user);
      void refreshProfile(authStore.user);
      activeTab.value = props.initialTab ?? "profile";
      selectedLocale.value = getCurrentLocale();
      currentPassword.value = "";
      newPassword.value = "";
      confirmNewPassword.value = "";
      passwordError.value = null;
      passwordSuccess.value = null;
      void loadElevenLabsCredentials().then(loadVoices);
      void k8sCredentialsEnabled().then((enabled) => {
        kubernetesTabVisible.value = enabled;
      });
      if (activeTab.value === "observability") {
        void loadObservabilityStatus();
      }
    }
  },
  { immediate: true },
);

watch(activeTab, (tab) => {
  if (tab === "observability" && observabilityStatus.value === null) {
    void loadObservabilityStatus();
  }
});

async function handleSaveProfile(): Promise<void> {
  if (!name.value.trim()) return;

  savingProfile.value = true;
  try {
    await authStore.updateUser({
      name: name.value.trim(),
      user_rules: userRules.value.trim() || undefined,
    });
    emit("close");
  } finally {
    savingProfile.value = false;
  }
}

async function handleChangePassword(): Promise<void> {
  passwordError.value = null;
  passwordSuccess.value = null;

  const trimmedCurrent = currentPassword.value.trim();
  const trimmedNew = newPassword.value.trim();
  const trimmedConfirm = confirmNewPassword.value.trim();

  if (!trimmedCurrent || !trimmedNew || !trimmedConfirm) {
    passwordError.value = "All password fields are required.";
    return;
  }

  if (trimmedNew.length < 8) {
    passwordError.value = "New password must be at least 8 characters.";
    return;
  }

  if (!/[A-Z]/.test(trimmedNew)) {
    passwordError.value = "New password must contain at least one uppercase letter.";
    return;
  }

  if (!/[a-z]/.test(trimmedNew)) {
    passwordError.value = "New password must contain at least one lowercase letter.";
    return;
  }

  if (!/[0-9]/.test(trimmedNew)) {
    passwordError.value = "New password must contain at least one digit.";
    return;
  }

  if (trimmedNew !== trimmedConfirm) {
    passwordError.value = "New password and confirmation do not match.";
    return;
  }

  if (trimmedNew === trimmedCurrent) {
    passwordError.value = "New password must be different from current password.";
    return;
  }

  savingPassword.value = true;
  try {
    await authStore.changePassword({
      currentPassword: trimmedCurrent,
      newPassword: trimmedNew,
    });
    currentPassword.value = "";
    newPassword.value = "";
    confirmNewPassword.value = "";
    passwordSuccess.value = "Password updated. Your other sessions were signed out.";
  } catch {
    passwordError.value = authStore.error || "Failed to change password. Please try again.";
  } finally {
    savingPassword.value = false;
  }
}
</script>

<template>
  <Dialog
    :open="props.open"
    :title="$t('settings.title')"
    content-class="!max-w-[760px] h-[min(90vh,calc(100dvh-2rem))] sm:h-[min(640px,calc(100dvh-3rem))]"
    @close="emit('close')"
  >
    <div class="-mt-3 flex flex-col gap-5 sm:mt-0 sm:min-h-[26rem] sm:flex-row sm:gap-6">
      <SettingsTabNav
        v-model="activeTab"
        :tabs="visibleTabs"
      />

      <div class="min-w-0 flex-1 space-y-5">
        <form
          v-if="activeTab === 'profile'"
          class="space-y-5"
          @submit.prevent="handleSaveProfile"
        >
          <div
            v-if="authStore.user"
            class="flex items-center gap-3"
          >
            <UserAvatar
              :user-id="authStore.user.id"
              :name="name || authStore.user.name"
              :email="authStore.user.email"
              class="h-12 w-12 bg-primary/15 text-lg font-semibold text-primary dark:bg-primary/25 dark:text-accent-foreground"
            />
            <p class="min-w-0 text-xs text-muted-foreground">
              {{ $t('settings.pictureFrom') }}
              <a
                href="https://gravatar.com"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-primary hover:underline dark:text-accent-foreground"
              >Gravatar</a>
              {{ $t('settings.gravatarNotice') }} <span class="break-all font-medium text-foreground">{{ authStore.user.email }}</span>.
            </p>
          </div>

          <div class="space-y-2">
            <Label for="user-name">{{ $t('settings.name') }}</Label>
            <Input
              id="user-name"
              v-model="name"
              :placeholder="$t('settings.namePlaceholder')"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="user-language">{{ $t('settings.language') }}</Label>
            <Select
              id="user-language"
              :model-value="selectedLocale"
              :options="languageOptions"
              @update:model-value="handleLocaleChange"
            />
          </div>

          <div class="space-y-2">
            <Label for="user-rules">{{ $t('settings.userRules') }}</Label>
            <p class="text-xs text-muted-foreground">
              {{ $t('settings.userRulesDescription') }}
            </p>
            <Textarea
              id="user-rules"
              v-model="userRules"
              :placeholder="$t('settings.userRulesPlaceholder')"
              :rows="4"
              class="resize-y text-xs font-mono"
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
              type="submit"
              :loading="savingProfile"
            >
              {{ $t('common.saveChanges') }}
            </Button>
          </div>
        </form>

        <div
          v-else-if="activeTab === 'security'"
          class="space-y-6"
        >
          <form
            class="space-y-5"
            @submit.prevent="handleChangePassword"
          >
            <div class="space-y-2">
              <Label for="current-password">{{ $t('settings.currentPassword') }}</Label>
              <Input
                id="current-password"
                v-model="currentPassword"
                type="password"
                autocomplete="current-password"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="new-password">{{ $t('settings.newPassword') }}</Label>
              <Input
                id="new-password"
                v-model="newPassword"
                type="password"
                autocomplete="new-password"
                required
              />
              <p class="text-xs text-muted-foreground">
                {{ $t('settings.passwordRequirements') }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="confirm-new-password">{{ $t('settings.confirmNewPassword') }}</Label>
              <Input
                id="confirm-new-password"
                v-model="confirmNewPassword"
                type="password"
                autocomplete="new-password"
                required
              />
            </div>

            <div
              v-if="passwordError"
              class="text-xs text-destructive"
            >
              {{ passwordError }}
            </div>
            <div
              v-if="passwordSuccess"
              class="text-xs text-emerald-500"
            >
              {{ passwordSuccess }}
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                @click="emit('close')"
              >
                {{ $t('common.close') }}
              </Button>
              <Button
                type="submit"
                :loading="savingPassword"
              >
                {{ $t('settings.changePassword') }}
              </Button>
            </div>
          </form>
          <MfaSettingsSection />
          <SessionsSettingsSection />
        </div>

        <div
          v-else-if="activeTab === 'voice'"
          class="space-y-5"
        >
          <p class="text-xs text-muted-foreground">
            {{ $t('settings.voiceCredentialDescription') }}
          </p>

          <div class="space-y-2">
            <Label for="tts-credential">{{ $t('settings.voiceCredential') }}</Label>
            <div class="flex items-center gap-2">
              <Select
                id="tts-credential"
                :model-value="selectedTtsCredentialId"
                :options="[
                  { value: '', label: $t('common.disabled') },
                  ...elevenLabsCredentials.map((c) => ({
                    value: c.id,
                    label: c.name,
                  })),
                ]"
                :disabled="loadingElevenLabs"
                class="flex-1"
                @update:model-value="handleTtsCredentialChange"
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                @click="handleGoToCredentials"
              >
                {{ $t('settings.addCredential') }}
              </Button>
            </div>
          </div>

          <div
            v-if="selectedTtsCredentialId"
            class="space-y-2"
          >
            <Label for="tts-voice">{{ $t('settings.voiceSelect') }}</Label>
            <div
              v-if="loadingVoices"
              class="text-xs text-muted-foreground"
            >
              {{ $t('common.loading') }}
            </div>
            <Select
              v-else
              id="tts-voice"
              :model-value="selectedVoiceId"
              :options="[
                { value: '', label: $t('settings.sdkDefault') },
                ...availableVoices.map((v) => ({
                  value: v.voice_id,
                  label: v.name,
                })),
              ]"
              @update:model-value="handleVoiceChange"
            />
          </div>

          <div class="flex items-center justify-between pt-2">
            <span
              v-if="voiceSaved"
              class="text-xs text-emerald-500"
            >
              {{ $t('settings.saveVoiceSettings') }}
            </span>
            <span v-else />
            <div class="flex gap-3">
              <Button
                variant="outline"
                type="button"
                @click="emit('close')"
              >
                {{ $t('common.close') }}
              </Button>
              <Button
                type="button"
                :loading="savingVoice"
                @click="handleSaveVoice"
              >
                {{ $t('common.saveChanges') }}
              </Button>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'ai-defaults'">
          <AiDefaultsTab @close="emit('close')" />
        </div>

        <div
          v-else-if="activeTab === 'observability'"
          class="space-y-4"
        >
          <p class="text-xs text-muted-foreground leading-relaxed">
            {{ $t('settings.observabilityDescription') }}
          </p>

          <div
            v-if="loadingObservability"
            class="text-xs text-muted-foreground"
          >
            {{ $t('common.loading') }}
          </div>

          <div
            v-else-if="observabilityStatus"
            class="space-y-3"
          >
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">{{ $t('common.status') }}</span>
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                :class="
                  observabilityStatus.enabled
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-muted text-muted-foreground'
                "
              >
                {{ observabilityStatus.enabled ? $t('common.enabled') : $t('common.disabled') }}
              </span>
            </div>

            <div
              v-if="observabilityStatus.enabled"
              class="space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-xs"
            >
              <div class="flex justify-between">
                <span class="text-muted-foreground">{{ $t('settings.serviceName') }}</span>
                <span class="font-mono">{{ observabilityStatus.service_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">{{ $t('settings.otlpEndpoint') }}</span>
                <span class="font-mono">{{ observabilityStatus.endpoint || 'http://localhost:4318' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">{{ $t('settings.samplerRatio') }}</span>
                <span class="font-mono">{{ observabilityStatus.sampler_ratio }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">{{ $t('settings.captureNodeIo') }}</span>
                <span>{{ observabilityStatus.capture_node_io ? $t('common.on') : $t('common.off') }}</span>
              </div>
            </div>

            <div
              v-else
              class="rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground space-y-1.5"
            >
              <p class="font-medium text-foreground">
                {{ $t('settings.enableTracing') }}
              </p>
              <p>{{ $t('settings.enableTracingHint') }}</p>
              <pre class="mt-1 whitespace-pre-wrap font-mono leading-relaxed">HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://collector:4318
HEYM_OTEL_EXPORTER_OTLP_HEADERS=authorization=Bearer &lt;token&gt;</pre>
            </div>
          </div>

          <div
            v-else
            class="text-xs text-destructive"
          >
            {{ $t('settings.observabilityLoadError') }}
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              @click="emit('close')"
            >
              {{ $t('common.close') }}
            </Button>
          </div>
        </div>

        <div v-else-if="activeTab === 'plugins'">
          <SettingsPluginsSection @close="emit('close')" />
        </div>

        <div v-else-if="activeTab === 'instances' && authStore.user?.is_admin">
          <ClusterSettingsTab @close="emit('close')" />
        </div>

        <div v-else-if="activeTab === 'kubernetes' && authStore.user?.is_admin && kubernetesTabVisible">
          <KubernetesCredentialsTab @close="emit('close')" />
        </div>

        <div v-else-if="activeTab === 'encryption' && authStore.user?.is_admin">
          <KeyRotationTab @close="emit('close')" />
        </div>

        <div v-else-if="activeTab === 'users' && authStore.user?.is_admin">
          <UsersSettingsTab @close="emit('close')" />
        </div>

        <div v-else-if="activeTab === 'sso' && authStore.user?.is_admin">
          <SsoSettingsTab @close="emit('close')" />
        </div>

        <div v-else-if="activeTab === 'work' && authStore.user?.is_admin">
          <WorkIntegrationSettingsTab @close="emit('close')" />
        </div>
      </div>
    </div>
  </Dialog>
</template>
