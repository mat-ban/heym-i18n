export interface ReadonlyPreviewDisplayField {
  key: string;
  label: string;
  value: string;
  kind: "textarea" | "select" | "input" | "boolean";
  isTrue?: boolean;
}

const SKIP_FIELDS = new Set([
  "nodeId",
  "nodeType",
  "label",
  "active",
  "status",
  "isOrchestrator",
  "isSubAgent",
  "previewAttachments",
  "subWorkflowNames",
  "playwrightSteps",
  "playwrightAuthFallbackSteps",
  "cases",
  "executeTargets",
  "outputSchema",
  "guardrails",
  "crawlerSelectors",
  "hitlEnabled",
  "hitlSummary",
  "allowDownstream",
  "jsonOutputEnabled",
  "extraBodyEnabled",
]);

const TEXTAREA_FIELDS = new Set([
  "systemInstruction",
  "userMessage",
  "extraBody",
  "curl",
  "websocketHeaders",
  "websocketMessage",
  "cronExpression",
  "variableValue",
  "executeInput",
  "logMessage",
  "errorMessage",
  "playwrightCode",
  "rabbitmqMessageBody",
  "arrayExpression",
  "mappings",
  "inputFields",
]);

const SELECT_FIELDS = new Set([
  "model",
  "credentialId",
  "variableType",
  "ragOperation",
  "gristOperation",
  "githubOperation",
  "redisOperation",
  "rabbitmqOperation",
  "websocketTriggerEvents",
  "dataTableOperation",
  "driveOperation",
  "executeWorkflowId",
  "vectorStoreId",
  "bqOperation",
  "gsOperation",
  "playwrightMode",
]);

const FIELD_LABELS: Record<string, string> = {
  model: "Model",
  credentialId: "Credential",
  temperature: "Temperature",
  systemInstruction: "System Instruction",
  userMessage: "User Message",
  condition: "Condition",
  expression: "Expression",
  curl: "cURL",
  websocketUrl: "WebSocket URL",
  websocketHeaders: "WebSocket Headers",
  websocketSubprotocols: "WebSocket Subprotocols",
  websocketMessage: "WebSocket Message",
  websocketTriggerEvents: "WebSocket Trigger Events",
  cronExpression: "Cron Expression",
  pollIntervalMinutes: "Poll Interval (Minutes)",
  variableName: "Variable Name",
  variableValue: "Variable Value",
  variableType: "Variable Type",
  executeInput: "Execute Input",
  executeWorkflowId: "Target Workflow",
  logMessage: "Log Message",
  errorMessage: "Error Message",
  httpStatusCode: "HTTP Status Code",
  toolTimeoutSeconds: "Tool Timeout (s)",
  requestTimeoutSeconds: "Request Timeout (s)",
  maxToolIterations: "Max Iterations",
  state: "State",
  questions: "Questions",
  customBody: "Request Body",
  duration: "Duration (ms)",
  ragOperation: "RAG Operation",
  documentIdField: "Document ID Field",
  documentId: "Document ID",
  gristOperation: "Grist Operation",
  githubOperation: "GitHub Operation",
  redisOperation: "Redis Operation",
  rabbitmqOperation: "RabbitMQ Operation",
  rabbitmqMessageBody: "Message Body",
  dataTableOperation: "Operation",
  driveOperation: "Drive Operation",
  vectorStoreId: "Vector Store",
  arrayExpression: "Array Expression",
  playwrightMode: "Mode",
  playwrightCode: "Code",
  playwrightHeadless: "Headless",
  playwrightStealth: "Reduced flags",
  playwrightTimeout: "Timeout (ms)",
  playwrightCaptureNetwork: "Capture Network",
  playwrightAuthEnabled: "Auth Enabled",
  jsonOutputSchema: "JSON Schema",
  extraBody: "Extra Body",
  value: "Value",
  bqOperation: "BigQuery Operation",
  gsOperation: "Google Sheets Operation",
  mappings: "Mappings",
  inputFields: "Input Fields",
  skills: "Skills",
  tools: "Tools",
  mcpConnections: "MCP Connections",
  subAgentLabels: "Sub-Agents",
  subWorkflowIds: "Sub-Workflows",
};

const AGENT_ATTACHMENT_FIELDS = [
  "skills",
  "tools",
  "subAgentLabels",
  "mcpConnections",
  "subWorkflowIds",
] as const;

interface MappingPreviewRow {
  key?: unknown;
  value?: unknown;
}

interface InputFieldPreviewRow {
  key?: unknown;
  defaultValue?: unknown;
}

function isAgentAttachmentField(key: string): boolean {
  return (AGENT_ATTACHMENT_FIELDS as readonly string[]).includes(key);
}

function attachmentNames(
  key: string,
  value: unknown,
  data: Record<string, unknown>,
): string[] {
  if (!Array.isArray(value)) return [];
  if (key === "subWorkflowIds") {
    const names = data.subWorkflowNames;
    const lookup = names && typeof names === "object" && !Array.isArray(names)
      ? names as Record<string, unknown>
      : {};
    return value.flatMap((id) => {
      const raw = lookup[String(id)];
      const name = typeof raw === "string" && raw.trim() ? raw.trim() : String(id).trim();
      return name ? [name] : [];
    });
  }
  return value.flatMap((item) => {
    if (typeof item === "string") {
      const name = item.trim();
      return name ? [name] : [];
    }
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    for (const nameKey of ["name", "label", "url", "command"]) {
      const name = record[nameKey];
      if (typeof name === "string" && name.trim()) return [name.trim()];
    }
    return [];
  });
}

export function getReadonlyPreviewFields(
  data: Record<string, unknown>,
): ReadonlyPreviewDisplayField[] {
  return Object.entries(data)
    .filter(([key, value]) => {
      if (SKIP_FIELDS.has(key)) return false;
      if (value === null || value === undefined || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === "object" && !Array.isArray(value)) return false;
      return true;
    })
    .flatMap(([key, value]): ReadonlyPreviewDisplayField[] => {
      if (isAgentAttachmentField(key)) {
        const names = attachmentNames(key, value, data);
        if (names.length === 0) return [];
        const textValue = names.join("\n");
        return [{
          key,
          label: FIELD_LABELS[key] ?? formatKey(key),
          value: textValue,
          kind: names.length > 1 || textValue.length > 80 ? "textarea" : "input",
        }];
      }
      const textValue = formatPreviewValue(key, value);
      const label = FIELD_LABELS[key] ?? formatKey(key);
      if (typeof value === "boolean") {
        return [{ key, label, value: textValue, kind: "boolean", isTrue: value }];
      }
      if (TEXTAREA_FIELDS.has(key) || textValue.length > 80) {
        return [{ key, label, value: textValue, kind: "textarea" }];
      }
      if (SELECT_FIELDS.has(key)) {
        return [{ key, label, value: textValue, kind: "select" }];
      }
      return [{ key, label, value: textValue, kind: "input" }];
    });
}

/** Names of an agent's skills, tools, sub-agents, MCP servers, and sub-workflows. */
export function summarizeReadonlyAgentAttachments(data: object): string {
  const byKey = new Map(
    getReadonlyPreviewFields(data as Record<string, unknown>).map((field) => [
      field.key,
      field.value.replace(/\n/g, ", "),
    ]),
  );
  return AGENT_ATTACHMENT_FIELDS
    .map((key) => byKey.get(key))
    .filter((value): value is string => !!value)
    .join(" · ");
}

function formatPreviewValue(key: string, value: unknown): string {
  if (key === "mappings" && Array.isArray(value)) {
    return value
      .map((entry, index) => {
        const mapping = entry as MappingPreviewRow;
        const mappingKey = String(mapping.key || `field_${index + 1}`);
        const mappingValue = mapping.value === undefined ? "" : String(mapping.value);
        return `${mappingKey}: ${mappingValue}`;
      })
      .join("\n");
  }
  if (key === "inputFields" && Array.isArray(value)) {
    return value
      .map((entry, index) => {
        const inputField = entry as InputFieldPreviewRow;
        const fieldKey = String(inputField.key || `field_${index + 1}`);
        if (inputField.defaultValue === undefined || inputField.defaultValue === "") {
          return fieldKey;
        }
        return `${fieldKey}: ${String(inputField.defaultValue)}`;
      })
      .join("\n");
  }
  return Array.isArray(value) ? JSON.stringify(value) : String(value);
}

function formatKey(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase()).trim();
}
