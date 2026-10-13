import { ref, watch, type Ref } from "vue";

import type { DocCategory } from "@/docs/manifest";
import type { PluginSummary } from "@/types/workflow";

import { i18n } from "@/i18n";
import { listPlugins } from "@/services/plugins";

export interface PluginDocCategoriesState {
  pluginDocCategories: Ref<Record<string, DocCategory>>;
  loadPluginDocCategories: () => Promise<void>;
}

const pluginDocCategories = ref<Record<string, DocCategory>>({});
let pendingLoad: Promise<void> | null = null;
let hasLoadedOnce = false;

export function buildPluginDocCategories(
  plugins: PluginSummary[],
): Record<string, DocCategory> {
  if (plugins.length === 0) return {};

  return {
    plugins: {
      id: "plugins",
      label: "Plugins",
      items: plugins.map((plugin) => ({
        slug: plugin.id,
        title: plugin.name,
      })),
    },
  };
}

async function fetchPluginDocCategories(): Promise<void> {
  try {
    pluginDocCategories.value = buildPluginDocCategories(await listPlugins());
  } catch {
    pluginDocCategories.value = {};
  }
}

function loadPluginDocCategories(): Promise<void> {
  hasLoadedOnce = true;
  if (!pendingLoad) {
    pendingLoad = fetchPluginDocCategories().finally(() => {
      pendingLoad = null;
    });
  }
  return pendingLoad;
}

watch(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  () => (i18n.global.locale as any).value,
  () => {
    if (hasLoadedOnce) {
      pendingLoad = null;
      void loadPluginDocCategories();
    }
  },
);

export function usePluginDocCategories(): PluginDocCategoriesState {
  return {
    pluginDocCategories,
    loadPluginDocCategories,
  };
}
