<script setup lang="ts">
import { AlertTriangle } from "lucide-vue-next";
import ExpressionInput from "@/components/ui/ExpressionInput.vue";
import Label from "@/components/ui/Label.vue";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import Select from "@/components/ui/Select.vue";
import { usePropertiesPanelContext } from "../usePropertiesPanelController";

const {
  workflowStore,
  isWorkflowOwner,
  googleDriveFolderIdExpressionInputRef,
  googleDriveFileIdExpressionInputRef,
  googleDriveMaxResultsExpressionInputRef,
  googleDriveQueryExpressionInputRef,
  googleDriveFilenameExpressionInputRef,
  googleDriveContentExpressionInputRef,
  googleDriveNewNameExpressionInputRef,
  googleDriveNewParentExpressionInputRef,
  selectedNode,
  selectedNodeEvaluateDialogLabel,
  googleDriveExpressionFieldCount,
  handleGoogleDriveExpressionFieldNavigate,
  onGoogleDriveRegisterExpressionFieldIndex,
  googleDriveCredentialOptions,
  googleDriveOperationOptions,
  googleDriveExportFormatOptions,
  updateNodeData,
} = usePropertiesPanelContext();
</script>

<template>
  <template v-if="selectedNode">
    <div class="space-y-2">
      <Label>{{ $t("drive.googleDrive.credential") }}</Label>
      <Select
        :model-value="selectedNode.data.credentialId || ''"
        :options="googleDriveCredentialOptions"
        :disabled="!isWorkflowOwner"
        @update:model-value="updateNodeData('credentialId', $event)"
      />
      <div v-if="!selectedNode.data.credentialId">
        <p class="text-xs text-amber-500 flex items-center gap-1">
          <AlertTriangle class="h-3 w-3" />
          {{ $t("drive.googleDrive.credentialRequired") }}
        </p>
        <p class="text-xs text-muted-foreground mt-1">
          <a
            href="/?tab=credentials"
            class="text-primary hover:underline"
            @click.prevent="$router.push('/?tab=credentials')"
          >Add credentials</a> in Dashboard
        </p>
      </div>
    </div>

    <div class="space-y-2">
      <Label>{{ $t("drive.googleDrive.operation") }}</Label>
      <SearchableSelect
        :model-value="selectedNode.data.gdOperation || ''"
        :options="googleDriveOperationOptions"
        :search-placeholder="$t('drive.googleDrive.searchOperations')"
        @update:model-value="updateNodeData('gdOperation', $event)"
      />
    </div>

    <template v-if="selectedNode.data.gdOperation">
      <!-- Folder-targeted operations -->
      <div
        v-if="['listFolderFiles', 'removeFolder'].includes(selectedNode.data.gdOperation)"
        class="space-y-2"
      >
        <Label>{{ $t("drive.googleDrive.folderIdOrUrl") }}</Label>
        <ExpressionInput
          ref="googleDriveFolderIdExpressionInputRef"
          :model-value="selectedNode.data.gdFolderId || ''"
          placeholder="1FolderXyz or https://drive.google.com/drive/folders/..."
          :nodes="workflowStore.nodes"
          :node-results="workflowStore.nodeResults"
          :edges="workflowStore.edges"
          :current-node-id="selectedNode.id"
          :navigation-enabled="googleDriveExpressionFieldCount > 1"
          :navigation-index="0"
          :navigation-total="googleDriveExpressionFieldCount"
          :dialog-node-label="selectedNodeEvaluateDialogLabel"
          dialog-key-label="Folder ID or URL"
          field-key="gdFolderId"
          @navigate="handleGoogleDriveExpressionFieldNavigate"
          @register-field-index="onGoogleDriveRegisterExpressionFieldIndex"
          @update:model-value="updateNodeData('gdFolderId', $event)"
        />
        <p
          v-if="selectedNode.data.gdOperation === 'listFolderFiles'"
          class="text-xs text-muted-foreground"
        >
          {{ $t("drive.googleDrive.folderRootHint") }}
        </p>
      </div>

      <!-- File-targeted operations -->
      <div
        v-if="
          ['downloadFile', 'syncToHeymDrive', 'updateFile', 'removeFile'].includes(
            selectedNode.data.gdOperation,
          )
        "
        class="space-y-2"
      >
        <Label>{{ $t("drive.googleDrive.fileIdOrUrl") }}</Label>
        <ExpressionInput
          ref="googleDriveFileIdExpressionInputRef"
          :model-value="selectedNode.data.gdFileId || ''"
          placeholder="1AbCdEf or https://drive.google.com/file/d/.../view"
          :nodes="workflowStore.nodes"
          :node-results="workflowStore.nodeResults"
          :edges="workflowStore.edges"
          :current-node-id="selectedNode.id"
          :navigation-enabled="googleDriveExpressionFieldCount > 1"
          :navigation-index="0"
          :navigation-total="googleDriveExpressionFieldCount"
          :dialog-node-label="selectedNodeEvaluateDialogLabel"
          dialog-key-label="File ID or URL"
          field-key="gdFileId"
          @navigate="handleGoogleDriveExpressionFieldNavigate"
          @register-field-index="onGoogleDriveRegisterExpressionFieldIndex"
          @update:model-value="updateNodeData('gdFileId', $event)"
        />
        <p class="text-xs text-muted-foreground">
          {{ $t("drive.googleDrive.fileIdOrUrlHint") }}
        </p>
      </div>

      <!-- listFolderFiles extras -->
      <template v-if="selectedNode.data.gdOperation === 'listFolderFiles'">
        <div class="space-y-2">
          <Label>{{ $t("drive.googleDrive.maxResults") }}</Label>
          <ExpressionInput
            ref="googleDriveMaxResultsExpressionInputRef"
            :model-value="selectedNode.data.gdMaxResults ?? '100'"
            placeholder="100 — leave empty or 0 for all"
            :nodes="workflowStore.nodes"
            :node-results="workflowStore.nodeResults"
            :edges="workflowStore.edges"
            :current-node-id="selectedNode.id"
            :navigation-enabled="googleDriveExpressionFieldCount > 1"
            :navigation-index="1"
            :navigation-total="googleDriveExpressionFieldCount"
            :dialog-node-label="selectedNodeEvaluateDialogLabel"
            dialog-key-label="Max results"
            field-key="gdMaxResults"
            @navigate="handleGoogleDriveExpressionFieldNavigate"
            @register-field-index="onGoogleDriveRegisterExpressionFieldIndex"
            @update:model-value="updateNodeData('gdMaxResults', $event)"
          />
          <p class="text-xs text-muted-foreground">
            Caps how many files are returned. Empty or <code>0</code> loads the whole folder
            (paged). Each file includes <code>size_bytes</code> when Drive reports a size.
          </p>
        </div>

        <div class="space-y-2">
          <Label>{{ $t("drive.googleDrive.filterQuery") }}</Label>
          <ExpressionInput
            ref="googleDriveQueryExpressionInputRef"
            :model-value="selectedNode.data.gdQuery || ''"
            placeholder="mimeType='application/pdf'"
            :nodes="workflowStore.nodes"
            :node-results="workflowStore.nodeResults"
            :edges="workflowStore.edges"
            :current-node-id="selectedNode.id"
            :navigation-enabled="googleDriveExpressionFieldCount > 1"
            :navigation-index="2"
            :navigation-total="googleDriveExpressionFieldCount"
            :dialog-node-label="selectedNodeEvaluateDialogLabel"
            dialog-key-label="Filter query"
            field-key="gdQuery"
            @navigate="handleGoogleDriveExpressionFieldNavigate"
            @register-field-index="onGoogleDriveRegisterExpressionFieldIndex"
            @update:model-value="updateNodeData('gdQuery', $event)"
          />
          <p class="text-xs text-muted-foreground">
            Google Drive query syntax, combined with the folder filter.
          </p>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <input
            id="gd-include-trashed"
            type="checkbox"
            :checked="selectedNode.data.gdIncludeTrashed === true"
            class="rounded border-border"
            @change="updateNodeData('gdIncludeTrashed', ($event.target as HTMLInputElement).checked)"
          >
          <label
            for="gd-include-trashed"
            class="text-xs cursor-pointer select-none"
          >Include trashed files</label>
        </div>
      </template>

      <!-- Export format for download-shaped operations -->
      <div
        v-if="['downloadFile', 'syncToHeymDrive'].includes(selectedNode.data.gdOperation)"
        class="space-y-2"
      >
        <Label>{{ $t("drive.googleDrive.exportFormat") }}</Label>
        <Select
          :model-value="selectedNode.data.gdExportFormat || ''"
          :options="googleDriveExportFormatOptions"
          @update:model-value="updateNodeData('gdExportFormat', $event)"
        />
        <p class="text-xs text-muted-foreground">
          Applies to Google Docs, Sheets, and Slides, which have no downloadable bytes and must be
          exported. Ignored for regular files.
        </p>
      </div>

      <!-- syncToHeymDrive extras -->
      <div
        v-if="selectedNode.data.gdOperation === 'syncToHeymDrive'"
        class="space-y-2"
      >
        <Label>{{ $t("drive.googleDrive.heymDriveFilename") }}</Label>
        <ExpressionInput
          ref="googleDriveFilenameExpressionInputRef"
          :model-value="selectedNode.data.gdFilename || ''"
          :placeholder="$t('drive.googleDrive.keepGoogleDriveName')"
          :nodes="workflowStore.nodes"
          :node-results="workflowStore.nodeResults"
          :edges="workflowStore.edges"
          :current-node-id="selectedNode.id"
          :navigation-enabled="googleDriveExpressionFieldCount > 1"
          :navigation-index="1"
          :navigation-total="googleDriveExpressionFieldCount"
          :dialog-node-label="selectedNodeEvaluateDialogLabel"
          :dialog-key-label="$t('drive.googleDrive.dialogKeyHeymDriveFilename')"
          field-key="gdFilename"
          @navigate="handleGoogleDriveExpressionFieldNavigate"
          @register-field-index="onGoogleDriveRegisterExpressionFieldIndex"
          @update:model-value="updateNodeData('gdFilename', $event)"
        />
      </div>

      <!-- updateFile extras -->
      <template v-if="selectedNode.data.gdOperation === 'updateFile'">
        <div class="space-y-2">
          <Label>{{ $t("drive.googleDrive.newContent") }}</Label>
          <ExpressionInput
            ref="googleDriveContentExpressionInputRef"
            :model-value="selectedNode.data.gdBase64Content || ''"
            placeholder="$PreviousNode.content_base64"
            :nodes="workflowStore.nodes"
            :node-results="workflowStore.nodeResults"
            :edges="workflowStore.edges"
            :current-node-id="selectedNode.id"
            :navigation-enabled="googleDriveExpressionFieldCount > 1"
            :navigation-index="1"
            :navigation-total="googleDriveExpressionFieldCount"
            :dialog-node-label="selectedNodeEvaluateDialogLabel"
            :dialog-key-label="$t('drive.googleDrive.dialogKeyNewContent')"
            field-key="gdBase64Content"
            @navigate="handleGoogleDriveExpressionFieldNavigate"
            @register-field-index="onGoogleDriveRegisterExpressionFieldIndex"
            @update:model-value="updateNodeData('gdBase64Content', $event)"
          />
        </div>

        <div class="space-y-2">
          <Label>{{ $t("drive.googleDrive.newName") }}</Label>
          <ExpressionInput
            ref="googleDriveNewNameExpressionInputRef"
            :model-value="selectedNode.data.gdNewName || ''"
            placeholder="renamed.pdf"
            :nodes="workflowStore.nodes"
            :node-results="workflowStore.nodeResults"
            :edges="workflowStore.edges"
            :current-node-id="selectedNode.id"
            :navigation-enabled="googleDriveExpressionFieldCount > 1"
            :navigation-index="2"
            :navigation-total="googleDriveExpressionFieldCount"
            :dialog-node-label="selectedNodeEvaluateDialogLabel"
            :dialog-key-label="$t('drive.googleDrive.dialogKeyNewName')"
            field-key="gdNewName"
            @navigate="handleGoogleDriveExpressionFieldNavigate"
            @register-field-index="onGoogleDriveRegisterExpressionFieldIndex"
            @update:model-value="updateNodeData('gdNewName', $event)"
          />
        </div>

        <div class="space-y-2">
          <Label>{{ $t("drive.googleDrive.moveToFolder") }}</Label>
          <ExpressionInput
            ref="googleDriveNewParentExpressionInputRef"
            :model-value="selectedNode.data.gdNewParentId || ''"
            placeholder="1DestinationFolderId or folder URL"
            :nodes="workflowStore.nodes"
            :node-results="workflowStore.nodeResults"
            :edges="workflowStore.edges"
            :current-node-id="selectedNode.id"
            :navigation-enabled="googleDriveExpressionFieldCount > 1"
            :navigation-index="3"
            :navigation-total="googleDriveExpressionFieldCount"
            :dialog-node-label="selectedNodeEvaluateDialogLabel"
            :dialog-key-label="$t('drive.googleDrive.dialogKeyMoveToFolder')"
            field-key="gdNewParentId"
            @navigate="handleGoogleDriveExpressionFieldNavigate"
            @register-field-index="onGoogleDriveRegisterExpressionFieldIndex"
            @update:model-value="updateNodeData('gdNewParentId', $event)"
          />
        </div>

        <p class="text-xs text-muted-foreground">
          {{ $t("drive.googleDrive.fillAtLeastOne") }}
        </p>
      </template>

      <!-- Delete safety -->
      <template v-if="['removeFile', 'removeFolder'].includes(selectedNode.data.gdOperation)">
        <div class="flex items-center gap-2 pt-1">
          <input
            id="gd-permanent-delete"
            type="checkbox"
            :checked="selectedNode.data.gdPermanentDelete === true"
            class="rounded border-border"
            @change="updateNodeData('gdPermanentDelete', ($event.target as HTMLInputElement).checked)"
          >
          <label
            for="gd-permanent-delete"
            class="text-xs cursor-pointer select-none"
          >{{ $t("drive.googleDrive.deletePermanently") }}</label>
        </div>
        <p
          v-if="selectedNode.data.gdPermanentDelete"
          class="text-xs text-amber-500 flex items-start gap-1"
        >
          <AlertTriangle class="h-3 w-3 mt-0.5 shrink-0" />
          <span v-if="selectedNode.data.gdOperation === 'removeFolder'">
            {{ $t("drive.googleDrive.permanentDeleteFolderWarning") }}
          </span>
          <span v-else>{{ $t("drive.googleDrive.permanentDeleteFileWarning") }}</span>
        </p>
        <p
          v-else
          class="text-xs text-muted-foreground"
        >
          {{ $t("drive.googleDrive.trashNotice") }}
        </p>
      </template>
    </template>
  </template>
</template>
