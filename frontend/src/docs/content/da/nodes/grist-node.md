# Grist

**Grist**-noden læser, skriver og administrerer data i Grist-regneark. Den kan anvendes til CRUD-operationer, batchopdateringer og automatisering af regneark.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | Grist-legitimationsoplysninger fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operation: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | Dokument-ID (fra Grist-URL) |
| `gristTableId` | expression | Tabel-ID |
| `gristRecordId` | expression | Post-ID (enkeltpost-operationer) |
| `gristRecordData` | JSON-streng | Feltværdier til oprettelse/opdatering. Anvend **kolonne-ID'er** (f.eks. `User_Name`), ikke visningsetiketter. |
| `gristRecordsData` | JSON-streng | Array af poster til batch-operationer |
| `gristFilter` | JSON-streng | Filter: `{"Column_ID": [values]}` |
| `gristSort` | string | Sortering: `Column_ID` eller `-Column_ID` (faldende) |
| `gristLimit` | number | Maksimalt antal poster (standard: 100) |

## Kolonne-ID'er vs. etiketter

Anvend **kolonne-ID'er** (med understregninger, f.eks. `User_Name`) i `gristRecordData` og filtre, ikke visningsetiketter. Brug `listColumns` til at finde kolonne-ID'er.

## Eksempel – Hent poster

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## Eksempel – Opret post

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## Relateret

- [Nodetyper](../reference/node-types.md) – Oversigt over alle nodetyper
- [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) – Tilføj Grist API-nøgle
- [Tredjepartsintegrationer](../reference/integrations.md#grist) – Opsætning af Grist-legitimationsoplysninger
