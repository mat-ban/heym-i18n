<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ChevronDown, Trash2, Users } from "lucide-vue-next";

import type {
  DashboardShare,
  DashboardSharePermission,
  DashboardTeamShare,
} from "@/types/dashboard";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import UserAvatar from "@/components/ui/UserAvatar.vue";
import { dashboardApi, teamsApi } from "@/services/api";

const props = defineProps<{ dashboardId: string }>();
const { t } = useI18n();

const email = ref("");
const permission = ref<DashboardSharePermission>("read");
const shares = ref<DashboardShare[]>([]);
const teamShares = ref<DashboardTeamShare[]>([]);
const teams = ref<{ id: string; name: string }[]>([]);
const selectedTeamId = ref("");
const teamPermission = ref<DashboardSharePermission>("read");
const error = ref("");

async function load(): Promise<void> {
  try {
    const [users, teamList, allTeams] = await Promise.all([
      dashboardApi.listShares(props.dashboardId),
      dashboardApi.listTeamShares(props.dashboardId),
      teamsApi.list(),
    ]);
    shares.value = users;
    teamShares.value = teamList;
    teams.value = allTeams.map((team) => ({ id: team.id, name: team.name }));
    error.value = "";
  } catch {
    error.value = t("dashboards.failedToLoadShares");
  }
}

async function addShare(): Promise<void> {
  const target = email.value.trim();
  if (!target) return;
  try {
    await dashboardApi.addShare(props.dashboardId, target, permission.value);
    email.value = "";
    await load();
  } catch {
    error.value = t("dashboards.failedToShareEmail");
  }
}

async function removeShare(userId: string): Promise<void> {
  await dashboardApi.removeShare(props.dashboardId, userId);
  await load();
}

async function addTeamShare(): Promise<void> {
  if (!selectedTeamId.value) return;
  try {
    await dashboardApi.addTeamShare(props.dashboardId, selectedTeamId.value, teamPermission.value);
    selectedTeamId.value = "";
    await load();
  } catch {
    error.value = t("dashboards.failedToShareTeam");
  }
}

async function removeTeamShare(teamId: string): Promise<void> {
  await dashboardApi.removeTeamShare(props.dashboardId, teamId);
  await load();
}

onMounted(load);
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-xs font-semibold uppercase text-muted-foreground"> {{ $t("board.share") }} </span>
    <p class="text-xs text-muted-foreground">
      {{ $t("dashboards.shareCredentialsNotice") }}
    </p>
    <p
      v-if="error"
      class="text-xs text-red-500"
    >
      {{ error }}
    </p>

    <div class="flex items-center gap-2">
      <Input
        v-model="email"
        placeholder="user@example.com"
        class="h-9 flex-1"
        data-testid="dashboard-share-email"
        @keydown.enter="addShare"
      />
      <div class="relative flex items-center">
        <select
          v-model="permission"
          class="h-9 appearance-none rounded-md border bg-background pl-3 pr-7 text-sm"
          :aria-label="$t('board.userPermission')"
        >
          <option value="read">
            {{ $t("board.read") }}
          </option>
          <option value="write">
            {{ $t("board.write") }}
          </option>
        </select>
        <ChevronDown
          class="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      <Button
        size="sm"
        class="h-9 shrink-0 px-4"
        data-testid="dashboard-share-add"
        @click="addShare"
      >
        {{ $t("board.share") }}
      </Button>
    </div>

    <div
      v-for="share in shares"
      :key="share.id"
      class="flex items-center justify-between rounded-md border border-border/60 px-2 py-1.5 text-sm"
      :data-testid="`dashboard-share-${share.email}`"
    >
      <div class="flex min-w-0 items-center gap-2">
        <UserAvatar
          :user-id="share.user_id"
          :name="share.name"
          :email="share.email"
          class="h-6 w-6 bg-primary/10 text-[11px] font-semibold text-primary dark:bg-primary/20 dark:text-accent-foreground"
        />
        <span class="min-w-0 truncate font-medium">{{ share.name || share.email }}</span>
        <span class="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs">{{ share.permission === 'write' ? $t('board.write') : $t('board.read') }}</span>
      </div>
      <button
        class="rounded p-1 hover:bg-destructive/10"
        :aria-label="$t('common.remove') + ' ' + share.email"
        @click="removeShare(share.user_id)"
      >
        <Trash2 class="h-3.5 w-3.5 text-destructive" />
      </button>
    </div>

    <div
      v-if="teams.length"
      class="flex items-center gap-2"
    >
      <div class="relative flex flex-1 items-center">
        <select
          v-model="selectedTeamId"
          class="h-9 w-full appearance-none rounded-md border bg-background pl-3 pr-7 text-sm"
          :aria-label="$t('board.selectTeam')"
        >
          <option value="">
            {{ $t("board.selectTeam") }}
          </option>
          <option
            v-for="team in teams"
            :key="team.id"
            :value="team.id"
          >
            {{ team.name }}
          </option>
        </select>
        <ChevronDown
          class="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      <div class="relative flex items-center">
        <select
          v-model="teamPermission"
          class="h-9 appearance-none rounded-md border bg-background pl-3 pr-7 text-sm"
          :aria-label="$t('board.teamPermission')"
        >
          <option value="read">
            {{ $t("board.read") }}
          </option>
          <option value="write">
            {{ $t("board.write") }}
          </option>
        </select>
        <ChevronDown
          class="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      <Button
        size="sm"
        class="h-9 shrink-0 px-4"
        data-testid="dashboard-team-share-add"
        @click="addTeamShare"
      >
        {{ $t("board.share") }}
      </Button>
    </div>

    <div
      v-for="share in teamShares"
      :key="share.id"
      class="flex items-center justify-between rounded-md border border-border/60 px-2 py-1.5 text-sm"
    >
      <div class="min-w-0 truncate">
        <Users class="mr-1 inline h-3.5 w-3.5" />
        <span class="font-medium">{{ share.team_name }}</span>
        <span class="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs">{{ share.permission === 'write' ? $t('board.write') : $t('board.read') }}</span>
      </div>
      <button
        class="rounded p-1 hover:bg-destructive/10"
        :aria-label="$t('common.remove') + ' ' + share.team_name"
        @click="removeTeamShare(share.team_id)"
      >
        <Trash2 class="h-3.5 w-3.5 text-destructive" />
      </button>
    </div>
  </div>
</template>
