<script setup lang="ts">
import AgentFieldToggle from "@/components/ui/AgentFieldToggle.vue";
import ExpressionInput from "@/components/ui/ExpressionInput.vue";
import Input from "@/components/ui/Input.vue";
import Label from "@/components/ui/Label.vue";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import { usePropertiesPanelContext } from "../usePropertiesPanelController";

const {
  workflowStore,
  driveFileOptions,
  driveFileIdExpressionInputRef,
  drivePasswordExpressionInputRef,
  driveFilenameExpressionInputRef,
  driveBase64ContentExpressionInputRef,
  selectedNode,
  selectedNodeEvaluateDialogLabel,
  driveExpressionFieldCount,
  isDriveFileIdAgentProvided,
  handleDriveExpressionFieldNavigate,
  onDriveRegisterExpressionFieldIndex,
  driveOperationOptions,
  updateNodeData,
} = usePropertiesPanelContext();
</script>

<template>
  <template v-if="selectedNode">
    <div class="space-y-2">
      <Label>{{ $t("drive.nodeProperties.operation") }}</Label>
      <SearchableSelect
        :model-value="selectedNode.data.driveOperation || ''"
        :options="driveOperationOptions"
        :search-placeholder="$t('drive.nodeProperties.searchOperations')"
        @update:model-value="updateNodeData('driveOperation', $event || undefined)"
      />
      <p class="text-xs text-muted-foreground">
        {{ $t("drive.nodeProperties.operationDescription") }}
      </p>
    </div>

    <div
      v-if="selectedNode.data.driveOperation === 'downloadUrl'"
      class="space-y-2"
    >
      <Label>{{ $t("drive.nodeProperties.sourceUrl") }}</Label>
      <ExpressionInput
        :model-value="selectedNode.data.driveSourceUrl || ''"
        placeholder="https://example.com/file.pdf"
        :rows="1"
        :nodes="workflowStore.nodes"
        :node-results="workflowStore.nodeResults"
        :edges="workflowStore.edges"
        :current-node-id="selectedNode.id"
        expandable
        :dialog-node-label="selectedNodeEvaluateDialogLabel"
        dialog-key-label="Source URL"
        @update:model-value="updateNodeData('driveSourceUrl', $event)"
      />
      <p class="text-xs text-muted-foreground">
        {{ $t("drive.nodeProperties.sourceUrlDescription") }}
      </p>
    </div>

    <div
      v-if="selectedNode.data.driveOperation === 'save'"
      class="space-y-4"
    >
      <div class="space-y-2">
        <Label>{{ $t("drive.nodeProperties.filename") }}</Label>
        <ExpressionInput
          ref="driveFilenameExpressionInputRef"
          :model-value="selectedNode.data.driveFilename || ''"
          placeholder="1.mp3"
          :rows="1"
          :nodes="workflowStore.nodes"
          :node-results="workflowStore.nodeResults"
          :edges="workflowStore.edges"
          :current-node-id="selectedNode.id"
          expandable
          :dialog-node-label="selectedNodeEvaluateDialogLabel"
          dialog-key-label="Drive save · Filename"
          field-key="driveFilename"
          :navigation-enabled="true"
          :navigation-index="0"
          :navigation-total="driveExpressionFieldCount"
          @navigate="handleDriveExpressionFieldNavigate"
          @register-field-index="onDriveRegisterExpressionFieldIndex"
          @update:model-value="updateNodeData('driveFilename', $event)"
        />
        <p class="text-xs text-muted-foreground">
          {{ $t("drive.nodeProperties.filenameDescription") }}
        </p>
      </div>
      <div class="space-y-2">
        <Label>{{ $t("drive.nodeProperties.base64Content") }}</Label>
        <ExpressionInput
          ref="driveBase64ContentExpressionInputRef"
          :model-value="selectedNode.data.driveBase64Content || ''"
          placeholder="$userInput.body.base64"
          :rows="3"
          :nodes="workflowStore.nodes"
          :node-results="workflowStore.nodeResults"
          :edges="workflowStore.edges"
          :current-node-id="selectedNode.id"
          expandable
          :dialog-node-label="selectedNodeEvaluateDialogLabel"
          dialog-key-label="Drive save · Base64 Content"
          field-key="driveBase64Content"
          :navigation-enabled="true"
          :navigation-index="1"
          :navigation-total="driveExpressionFieldCount"
          @navigate="handleDriveExpressionFieldNavigate"
          @register-field-index="onDriveRegisterExpressionFieldIndex"
          @update:model-value="updateNodeData('driveBase64Content', $event)"
        />
        <p class="text-xs text-muted-foreground">
          {{ $t("drive.nodeProperties.base64ContentDescription") }}
        </p>
      </div>
    </div>

    <div
      v-if="selectedNode.data.driveOperation && !['downloadUrl', 'getAll', 'save'].includes(selectedNode.data.driveOperation)"
      class="space-y-2"
    >
      <div class="flex items-center justify-between gap-2">
        <Label>{{ $t("drive.nodeProperties.fileId") }}</Label>
        <AgentFieldToggle
          :node-id="selectedNode.id"
          field-key="driveFileId"
        />
      </div>
      <template v-if="selectedNode.data.driveOperation === 'get'">
        <SearchableSelect
          :model-value="selectedNode.data.driveFileId || ''"
          :options="driveFileOptions"
          :placeholder="$t('drive.nodeProperties.selectFile')"
          :search-placeholder="$t('drive.nodeProperties.searchFilesByName')"
          :empty-text="$t('drive.nodeProperties.noFilesFound')"
          :disabled="isDriveFileIdAgentProvided"
          @update:model-value="updateNodeData('driveFileId', $event || undefined)"
        />
        <div
          v-if="isDriveFileIdAgentProvided"
          class="rounded-md border border-violet-800/30 bg-violet-950/20 px-3 py-2 text-xs italic text-violet-400"
        >
          Agent will provide this at runtime.
        </div>
        <ExpressionInput
          v-else
          ref="driveFileIdExpressionInputRef"
          :model-value="selectedNode.data.driveFileId || ''"
          placeholder="$skill._generated_files[0].id"
          :rows="1"
          :nodes="workflowStore.nodes"
          :node-results="workflowStore.nodeResults"
          :edges="workflowStore.edges"
          :current-node-id="selectedNode.id"
          expandable
          :dialog-node-label="selectedNodeEvaluateDialogLabel"
          dialog-key-label="File ID"
          @update:model-value="updateNodeData('driveFileId', $event)"
        />
      </template>
      <template v-else>
        <div
          v-if="isDriveFileIdAgentProvided"
          class="rounded-md border border-violet-800/30 bg-violet-950/20 px-3 py-2 text-xs italic text-violet-400"
        >
          Agent will provide this at runtime.
        </div>
        <ExpressionInput
          v-else
          ref="driveFileIdExpressionInputRef"
          :model-value="selectedNode.data.driveFileId || ''"
          placeholder="$skill._generated_files[0].id"
          :rows="1"
          :nodes="workflowStore.nodes"
          :node-results="workflowStore.nodeResults"
          :edges="workflowStore.edges"
          :current-node-id="selectedNode.id"
          expandable
          :dialog-node-label="selectedNodeEvaluateDialogLabel"
          :dialog-key-label="
            selectedNode.data.driveOperation === 'setPassword'
              ? 'Drive set password · File ID'
              : 'File ID'
          "
          :navigation-enabled="selectedNode.data.driveOperation === 'setPassword'"
          :navigation-index="0"
          :navigation-total="driveExpressionFieldCount"
          @navigate="handleDriveExpressionFieldNavigate"
          @register-field-index="onDriveRegisterExpressionFieldIndex"
          @update:model-value="updateNodeData('driveFileId', $event)"
        />
      </template>
      <p class="text-xs text-muted-foreground">
        {{ $t("drive.nodeProperties.fileIdDescription") }}
      </p>
    </div>

    <div
      v-if="selectedNode.data.driveOperation === 'getAll'"
      class="space-y-2"
    >
      <Label>{{ $t("drive.nodeProperties.limit") }}</Label>
      <Input
        type="number"
        :model-value="selectedNode.data.driveLimit ?? ''"
        min="0"
        placeholder="No limit"
        @update:model-value="updateNodeData('driveLimit', $event !== '' ? Number($event) : undefined)"
      />
      <p class="text-xs text-muted-foreground">
        {{ $t("drive.nodeProperties.limitDescription") }}
      </p>
    </div>

    <div
      v-if="selectedNode.data.driveOperation === 'get'"
      class="space-y-2"
    >
      <Label>{{ $t("drive.nodeProperties.options") }}</Label>
      <div class="flex items-center gap-2">
        <input
          id="drive-include-binary"
          type="checkbox"
          class="h-4 w-4 rounded border-input bg-background"
          :checked="!!selectedNode.data.driveIncludeBinary"
          @change="updateNodeData('driveIncludeBinary', ($event.target as HTMLInputElement).checked)"
        >
        <Label
          for="drive-include-binary"
          class="font-normal text-sm"
        >
          Include binary content
        </Label>
      </div>
      <p class="text-xs text-muted-foreground">
        When enabled, the file content is returned as base64 in <code>file_base64</code>
      </p>
    </div>

    <div
      v-if="selectedNode.data.driveOperation === 'setPassword'"
      class="space-y-2"
    >
      <Label>{{ $t("drive.nodeProperties.password") }}</Label>
      <ExpressionInput
        ref="drivePasswordExpressionInputRef"
        :model-value="selectedNode.data.drivePassword || ''"
        :placeholder="$t('drive.nodeProperties.passwordPlaceholder')"
        :rows="1"
        :nodes="workflowStore.nodes"
        :node-results="workflowStore.nodeResults"
        :edges="workflowStore.edges"
        :current-node-id="selectedNode.id"
        field-key="drivePassword"
        expandable
        :dialog-node-label="selectedNodeEvaluateDialogLabel"
        dialog-key-label="Drive set password · Password"
        navigation-enabled
        :navigation-index="1"
        :navigation-total="driveExpressionFieldCount"
        @navigate="handleDriveExpressionFieldNavigate"
        @register-field-index="onDriveRegisterExpressionFieldIndex"
        @update:model-value="updateNodeData('drivePassword', $event)"
      />
      <p class="text-xs text-muted-foreground">
        {{ $t("drive.nodeProperties.passwordDescription") }}
      </p>
    </div>

    <div
      v-if="selectedNode.data.driveOperation === 'setTtl'"
      class="space-y-2"
    >
      <Label>{{ $t("drive.nodeProperties.ttlHours") }}</Label>
      <Input
        type="number"
        :model-value="selectedNode.data.driveTtlHours ?? ''"
        min="1"
        placeholder="e.g. 24"
        @update:model-value="updateNodeData('driveTtlHours', $event !== '' ? Number($event) : undefined)"
      />
      <p class="text-xs text-muted-foreground">
        {{ $t("drive.nodeProperties.ttlHoursDescription") }}
      </p>
    </div>

    <div
      v-if="selectedNode.data.driveOperation === 'setMaxDownloads'"
      class="space-y-2"
    >
      <Label>{{ $t("drive.nodeProperties.maxDownloads") }}</Label>
      <Input
        type="number"
        :model-value="selectedNode.data.driveMaxDownloads ?? ''"
        min="1"
        placeholder="e.g. 5"
        @update:model-value="updateNodeData('driveMaxDownloads', $event !== '' ? Number($event) : undefined)"
      />
      <p class="text-xs text-muted-foreground">
        {{ $t("drive.nodeProperties.maxDownloadsDescription") }}
      </p>
    </div>

    <div class="rounded-lg bg-muted/50 p-3 space-y-1">
      <p class="text-xs font-medium text-foreground">
        {{ $t("drive.nodeProperties.output") }}
      </p>
      <div class="text-xs text-muted-foreground space-y-0.5 font-mono">
        <template v-if="selectedNode.data.driveOperation === 'get'">
          <div>${{ selectedNode.data.label }}.id - {{ $t("drive.nodeProperties.outputFileUuid") }}</div>
          <div>${{ selectedNode.data.label }}.filename - {{ $t("drive.nodeProperties.outputFilename") }}</div>
          <div>${{ selectedNode.data.label }}.mime_type - {{ $t("drive.nodeProperties.outputMimeType") }}</div>
          <div>${{ selectedNode.data.label }}.size_bytes - {{ $t("drive.nodeProperties.outputFileSize") }}</div>
          <div>${{ selectedNode.data.label }}.download_url - {{ $t("drive.nodeProperties.outputDownloadUrl") }}</div>
          <div>${{ selectedNode.data.label }}.file_base64 - {{ $t("drive.nodeProperties.outputFileBase64") }}</div>
        </template>
        <template v-else-if="selectedNode.data.driveOperation === 'getAll'">
          <div>${{ selectedNode.data.label }}.files - {{ $t("drive.nodeProperties.outputFilesArray") }}</div>
          <div>${{ selectedNode.data.label }}.count - {{ $t("drive.nodeProperties.outputFilesCount") }}</div>
          <div>${{ selectedNode.data.label }}.files[0].filename - {{ $t("drive.nodeProperties.outputFilename") }}</div>
          <div>${{ selectedNode.data.label }}.files[0].size_bytes - {{ $t("drive.nodeProperties.outputFileSize") }}</div>
          <div>${{ selectedNode.data.label }}.files[0].download_url - {{ $t("drive.nodeProperties.outputDownloadUrl") }}</div>
        </template>
        <template v-else-if="selectedNode.data.driveOperation === 'downloadUrl'">
          <div>${{ selectedNode.data.label }}.id - {{ $t("drive.nodeProperties.outputFileUuid") }}</div>
          <div>${{ selectedNode.data.label }}.filename - {{ $t("drive.nodeProperties.outputFilename") }}</div>
          <div>${{ selectedNode.data.label }}.mime_type - {{ $t("drive.nodeProperties.outputMimeType") }}</div>
          <div>${{ selectedNode.data.label }}.size_bytes - {{ $t("drive.nodeProperties.outputFileSize") }}</div>
          <div>${{ selectedNode.data.label }}.download_url - {{ $t("drive.nodeProperties.outputDriveDownloadUrl") }}</div>
        </template>
        <template v-else-if="selectedNode.data.driveOperation === 'save'">
          <div>${{ selectedNode.data.label }}.id - {{ $t("drive.nodeProperties.outputFileUuid") }}</div>
          <div>${{ selectedNode.data.label }}.filename - {{ $t("drive.nodeProperties.outputFilename") }}</div>
          <div>${{ selectedNode.data.label }}.mime_type - {{ $t("drive.nodeProperties.outputMimeType") }}</div>
          <div>${{ selectedNode.data.label }}.size_bytes - {{ $t("drive.nodeProperties.outputFileSize") }}</div>
          <div>${{ selectedNode.data.label }}.download_url - {{ $t("drive.nodeProperties.outputDriveDownloadUrl") }}</div>
        </template>
        <template v-else-if="selectedNode.data.driveOperation === 'delete'">
          <div>${{ selectedNode.data.label }}.status - "deleted"</div>
          <div>${{ selectedNode.data.label }}.file_id - {{ $t("drive.nodeProperties.outputDeletedFileId") }}</div>
        </template>
        <template v-else-if="selectedNode.data.driveOperation === 'shareWithMyTeams'">
          <div>${{ selectedNode.data.label }}.status - "success"</div>
          <div>${{ selectedNode.data.label }}.file_id - {{ $t("drive.nodeProperties.fileId") }}</div>
          <div>${{ selectedNode.data.label }}.shared_team_count - {{ $t("drive.nodeProperties.outputSharedTeamCount") }}</div>
        </template>
        <template v-else-if="selectedNode.data.driveOperation === 'unshareWithMyTeams'">
          <div>${{ selectedNode.data.label }}.status - "success"</div>
          <div>${{ selectedNode.data.label }}.file_id - {{ $t("drive.nodeProperties.fileId") }}</div>
          <div>${{ selectedNode.data.label }}.shared_team_count - {{ $t("drive.nodeProperties.outputUnsharedCount") }}</div>
        </template>
        <template v-else-if="selectedNode.data.driveOperation === 'setPassword' || selectedNode.data.driveOperation === 'setTtl' || selectedNode.data.driveOperation === 'setMaxDownloads'">
          <div>${{ selectedNode.data.label }}.status - "updated"</div>
          <div>${{ selectedNode.data.label }}.file_id - {{ $t("drive.nodeProperties.fileId") }}</div>
          <div>${{ selectedNode.data.label }}.download_url - {{ $t("drive.nodeProperties.outputNewAccessUrl") }}</div>
        </template>
        <template v-else>
          <div>{{ $t("drive.nodeProperties.selectOperationToSeeOutput") }}</div>
        </template>
      </div>
    </div>
  </template>
</template>
