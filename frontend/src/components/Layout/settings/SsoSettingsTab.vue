<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Check, Copy, X } from "lucide-vue-next";

import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import Label from "@/components/ui/Label.vue";
import SettingsToggle from "@/components/Layout/settings/SettingsToggle.vue";
import { getAdminSsoConfig, saveAdminSsoConfig, testSsoConnection } from "@/services/sso";
import type { SsoSettings, SsoTestResult } from "@/types/sso";

const { t } = useI18n();

const config = ref<SsoSettings | null>(null);
const clientSecret = ref("");
const loading = ref(false);
const saving = ref(false);
const testing = ref(false);
const testResult = ref<SsoTestResult | null>(null);
const error = ref<string | null>(null);
const copied = ref(false);

async function load(): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    config.value = await getAdminSsoConfig();
  } catch {
    error.value = t("settings.ssoSection.loadError");
  } finally {
    loading.value = false;
  }
}

async function handleSave(): Promise<void> {
  if (!config.value) return;
  saving.value = true;
  error.value = null;
  try {
    config.value = await saveAdminSsoConfig({
      enabled: config.value.enabled,
      issuer: config.value.issuer,
      client_id: config.value.client_id,
      client_secret: clientSecret.value,
      scopes: config.value.scopes,
      button_label: config.value.button_label,
      auto_provision_users: config.value.auto_provision_users,
      allowed_email_domains: config.value.allowed_email_domains,
      password_login_disabled: config.value.password_login_disabled,
    });
    clientSecret.value = "";
    testResult.value = null;
  } catch {
    error.value = t("settings.ssoSection.saveError");
  } finally {
    saving.value = false;
  }
}

async function handleTest(): Promise<void> {
  testing.value = true;
  error.value = null;
  try {
    testResult.value = await testSsoConnection(config.value?.issuer);
    if (config.value) config.value.last_test_ok = testResult.value.ok;
  } catch {
    error.value = t("settings.ssoSection.testError");
  } finally {
    testing.value = false;
  }
}

async function copyRedirectUri(): Promise<void> {
  if (!config.value) return;
  await navigator.clipboard.writeText(config.value.redirect_uri);
  copied.value = true;
  window.setTimeout(() => {
    copied.value = false;
  }, 1500);
}

onMounted(load);
</script>

<template>
  <div class="space-y-5">
    <p
      v-if="error"
      class="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
    >
      {{ error }}
    </p>

    <p
      v-if="loading"
      class="text-sm text-muted-foreground"
    >
      {{ $t('common.loading') }}
    </p>

    <template v-if="config">
      <SettingsToggle
        id="sso-enabled"
        v-model="config.enabled"
        :label="$t('settings.ssoSection.enable')"
      />

      <div class="space-y-2">
        <Label for="sso-issuer">{{ $t('settings.ssoSection.issuerUrl') }}</Label>
        <p class="text-xs text-muted-foreground">
          {{ $t('settings.ssoSection.issuerDescription') }}
        </p>
        <Input
          id="sso-issuer"
          v-model="config.issuer"
          placeholder="https://idp.example.com/realms/your-realm"
        />
      </div>

      <div class="space-y-2">
        <Label for="sso-client-id">{{ $t('settings.ssoSection.clientId') }}</Label>
        <Input
          id="sso-client-id"
          v-model="config.client_id"
        />
      </div>

      <div class="space-y-2">
        <Label for="sso-client-secret">{{ $t('settings.ssoSection.clientSecret') }}</Label>
        <p class="text-xs text-muted-foreground">
          {{ $t('settings.ssoSection.clientSecretDescription') }}
        </p>
        <Input
          id="sso-client-secret"
          v-model="clientSecret"
          type="password"
          :placeholder="config.client_secret_set ? '••••••••' : $t('settings.ssoSection.clientSecretNotConfigured')"
        />
      </div>

      <div class="space-y-2">
        <Label for="sso-redirect-uri">{{ $t('settings.ssoSection.redirectUri') }}</Label>
        <p class="text-xs text-muted-foreground">
          {{ $t('settings.ssoSection.redirectUriDescription') }}
        </p>
        <div class="flex gap-2">
          <Input
            id="sso-redirect-uri"
            :model-value="config.redirect_uri"
            readonly
          />
          <Button
            variant="outline"
            type="button"
            @click="copyRedirectUri"
          >
            <Check
              v-if="copied"
              class="w-4 h-4"
            />
            <Copy
              v-else
              class="w-4 h-4"
            />
          </Button>
        </div>
      </div>

      <div class="space-y-2">
        <Label for="sso-scopes">{{ $t('settings.ssoSection.scopes') }}</Label>
        <Input
          id="sso-scopes"
          v-model="config.scopes"
        />
      </div>

      <div class="space-y-2">
        <Label for="sso-button-label">{{ $t('settings.ssoSection.buttonLabel') }}</Label>
        <Input
          id="sso-button-label"
          v-model="config.button_label"
        />
      </div>

      <SettingsToggle
        id="sso-auto-provision"
        v-model="config.auto_provision_users"
        :label="$t('settings.ssoSection.autoProvision')"
      />

      <div class="space-y-2">
        <Label for="sso-domains">{{ $t('settings.ssoSection.allowedDomains') }}</Label>
        <p class="text-xs text-muted-foreground">
          {{ $t('settings.ssoSection.allowedDomainsDescription') }}
        </p>
        <Input
          id="sso-domains"
          v-model="config.allowed_email_domains"
          placeholder="example.com, example.org"
        />
      </div>

      <div class="space-y-2 pt-2">
        <Button
          variant="outline"
          type="button"
          :loading="testing"
          @click="handleTest"
        >
          {{ $t('settings.ssoSection.testConnection') }}
        </Button>
        <div
          v-if="testResult"
          class="flex items-start gap-1.5 text-sm min-w-0"
          :class="testResult.ok ? 'text-primary' : 'text-destructive'"
        >
          <Check
            v-if="testResult.ok"
            class="w-4 h-4 mt-0.5 shrink-0"
          />
          <X
            v-else
            class="w-4 h-4 mt-0.5 shrink-0"
          />
          <span class="min-w-0 break-all">
            {{ testResult.ok ? testResult.token_endpoint : testResult.error }}
          </span>
        </div>
      </div>

      <div class="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-2">
        <SettingsToggle
          id="sso-disable-password"
          v-model="config.password_login_disabled"
          :label="$t('settings.ssoSection.disablePassword')"
          :disabled="!config.enabled || !config.last_test_ok || !config.break_glass_ready"
        />
        <p class="text-xs text-muted-foreground">
          <span v-if="!config.enabled || !config.last_test_ok">
            {{ $t('settings.ssoSection.disablePasswordNotice') }}
          </span>
          <span v-else-if="!config.break_glass_ready">
            {{ $t('settings.ssoSection.breakGlassNotReady') }}
          </span>
          <span v-else>
            {{ $t('settings.ssoSection.breakGlassReady') }}
          </span>
        </p>
      </div>

      <div class="flex justify-end pt-2">
        <Button
          variant="gradient"
          type="button"
          :loading="saving"
          @click="handleSave"
        >
          {{ $t('common.save') }}
        </Button>
      </div>
    </template>
  </div>
</template>
