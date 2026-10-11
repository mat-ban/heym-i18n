# Grist

Der **Grist**-Knoten liest, schreibt und verwaltet Daten in Grist-Tabellen. Verwende ihn für CRUD-Operationen, Batch-Aktualisierungen und Tabellenkalkulations-Automatisierung.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | Grist-Anmeldedaten aus [Anmeldedaten](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operation: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | Dokument-ID (aus der Grist-URL) |
| `gristTableId` | expression | Tabellen-ID |
| `gristRecordId` | expression | Datensatz-ID (Operationen für einzelne Datensätze) |
| `gristRecordData` | JSON string | Feldwerte für Erstellen/Aktualisieren. Verwende **Spalten-IDs** (z. B. `User_Name`), nicht Beschriftungen. |
| `gristRecordsData` | JSON string | Array von Datensätzen für Batch-Operationen |
| `gristFilter` | JSON string | Filter: `{"Column_ID": [values]}` |
| `gristSort` | string | Sortierung: `Column_ID` oder `-Column_ID` (absteigend) |
| `gristLimit` | number | Maximale Anzahl Datensätze (Standard: 100) |

## Spalten-IDs vs. Beschriftungen

Verwende **Spalten-IDs** (Unterstriche, z. B. `User_Name`) in `gristRecordData` und Filtern, nicht die Anzeigebeschriftungen. Verwende `listColumns`, um Spalten-IDs zu ermitteln.

## Beispiel – Datensätze abrufen

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

## Beispiel – Datensatz erstellen

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

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – Grist-API-Schlüssel hinzufügen
- [Drittanbieter-Integrationen](../reference/integrations.md#grist) – Einrichtung der Grist-Anmeldedaten
