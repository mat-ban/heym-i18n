<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import type { PluginSummary } from "@/types/workflow";

import { clearPluginIconCache } from "@/components/Panels/PluginIcon.vue";
import Button from "@/components/ui/Button.vue";
import Label from "@/components/ui/Label.vue";
import {
  installPlugin,
  listPlugins,
  setPluginEnabled,
  uninstallPlugin,
} from "@/services/plugins";

const emit = defineEmits<{
  close: [];
}>();

const { t, locale } = useI18n();

const pluginsEnabled = ref(false);
const installedPlugins = ref<PluginSummary[]>([]);
const loadingPlugins = ref(false);
const pluginError = ref<string | null>(null);
const pluginBusy = ref(false);

async function loadPlugins(): Promise<void> {
  loadingPlugins.value = true;
  pluginError.value = null;
  clearPluginIconCache();
  try {
    installedPlugins.value = await listPlugins(locale.value);
    pluginsEnabled.value = true;
  } catch {
    // 404 => plugins disabled on this instance.
    pluginsEnabled.value = false;
    installedPlugins.value = [];
  } finally {
    loadingPlugins.value = false;
  }
}

function pluginErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const response = (err as { response?: { data?: { detail?: string } } }).response;
    if (response?.data?.detail) return response.data.detail;
  }
  return err instanceof Error ? err.message : t("settings.pluginOperationFailed");
}

async function handleInstallFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  pluginBusy.value = true;
  pluginError.value = null;
  try {
    await installPlugin(file);
    await loadPlugins();
  } catch (err) {
    pluginError.value = pluginErrorMessage(err);
  } finally {
    pluginBusy.value = false;
    input.value = "";
  }
}

async function handleTogglePlugin(plugin: PluginSummary): Promise<void> {
  pluginBusy.value = true;
  pluginError.value = null;
  try {
    await setPluginEnabled(plugin.id, !plugin.enabled);
    await loadPlugins();
  } catch (err) {
    pluginError.value = pluginErrorMessage(err);
  } finally {
    pluginBusy.value = false;
  }
}

async function handleUninstallPlugin(plugin: PluginSummary): Promise<void> {
  pluginBusy.value = true;
  pluginError.value = null;
  try {
    await uninstallPlugin(plugin.id);
    await loadPlugins();
  } catch (err) {
    pluginError.value = pluginErrorMessage(err);
  } finally {
    pluginBusy.value = false;
  }
}

onMounted(() => {
  void loadPlugins();
});

watch(
  () => locale.value,
  () => {
    void loadPlugins();
  },
);
</script>

<template>
  <div class="space-y-5">
    <p class="text-xs text-muted-foreground">
      {{ $t('settings.pluginsIntro') }}
      <code>HEYM_PLUGIN_ADMIN_EMAILS</code>.
    </p>

    <div
      v-if="loadingPlugins"
      class="text-xs text-muted-foreground"
    >
      {{ $t('settings.loadingPlugins') }}
    </div>

    <div
      v-else-if="!pluginsEnabled"
      class="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1"
    >
      <p class="font-medium text-foreground">
        {{ $t('settings.pluginsDisabledTitle') }}
      </p>
      <p>{{ $t('settings.pluginsDisabledHint') }}</p>
      <pre class="mt-1 whitespace-pre-wrap font-mono leading-relaxed">HEYM_PLUGINS_ENABLED=true
HEYM_PLUGIN_ADMIN_EMAILS=you@example.com</pre>
    </div>

    <template v-else>
      <div class="space-y-2">
        <Label for="plugin-zip">{{ $t('settings.installPluginZip') }}</Label>
        <input
          id="plugin-zip"
          type="file"
          accept=".zip"
          :disabled="pluginBusy"
          class="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
          @change="handleInstallFile"
        >
      </div>

      <p
        v-if="pluginError"
        class="text-xs text-destructive"
      >
        {{ pluginError }}
      </p>

      <div
        v-if="installedPlugins.length === 0"
        class="text-xs text-muted-foreground"
      >
        {{ $t('settings.noPluginsInstalled') }}
      </div>

      <ul
        v-else
        class="space-y-2"
      >
        <li
          v-for="plugin in installedPlugins"
          :key="plugin.id"
          class="flex items-center justify-between gap-3 rounded-lg border border-border bg-card/60 p-3"
        >
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium truncate">{{ plugin.name }}</span>
              <span class="text-xs text-muted-foreground">v{{ plugin.version }}</span>
            </div>
            <p class="text-xs text-muted-foreground line-clamp-1">
              {{ plugin.description }}
            </p>
            <div class="mt-1 flex flex-wrap gap-1">
              <span
                v-for="node in plugin.nodes"
                :key="node.key"
                class="text-[10px] rounded px-1.5 py-0.5 bg-muted text-muted-foreground"
              >
                {{ node.name }} · {{ node.kind }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              type="button"
              :disabled="pluginBusy"
              @click="handleTogglePlugin(plugin)"
            >
              {{ plugin.enabled ? $t('settings.disablePlugin') : $t('settings.enablePlugin') }}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              type="button"
              :disabled="pluginBusy"
              @click="handleUninstallPlugin(plugin)"
            >
              {{ $t('settings.uninstallPlugin') }}
            </Button>
          </div>
        </li>
      </ul>
    </template>

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
</template>
