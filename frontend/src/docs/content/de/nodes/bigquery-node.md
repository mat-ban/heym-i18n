# BigQuery

Der **BigQuery**-Knoten führt SQL-Abfragen aus und fügt Zeilen in Google BigQuery-Datasets über die BigQuery REST API v2 ein. Verwende ihn, um große analytische Datasets abzufragen oder Zeilen aus Workflow-Daten in Tabellen zu streamen.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Anmeldedaten | BigQuery (OAuth2) |
| Ausgabe | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | BigQuery-Anmeldedaten aus [Anmeldedaten](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operation: `query` oder `insertRows` |
| `bqProjectId` | expression | Google Cloud Projekt-ID (z. B. `my-gcp-project`) |
| `bqQuery` | expression | SQL-Abfrage-String. Erforderlich für `query`. |
| `bqMaxResults` | string | Maximale Anzahl von Zeilen, die von `query` zurückgegeben werden (Standard `1000`). |
| `bqDatasetId` | expression | Dataset-ID (z. B. `my_dataset`). Erforderlich für `insertRows`. |
| `bqTableId` | expression | Tabellen-ID (z. B. `my_table`). Erforderlich für `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Für `insertRows`: **Raw** = vollständiges JSON-Array; **Selective** = einzelne Zeile als Key-Value-Feldpaare. |
| `bqRows` | expression | JSON-Array von Zeilenobjekten für den Raw-Modus (z. B. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Key-Value-Paare für den Selective-Modus. Jeder Key ist ein Spaltenname; jeder Value ist ein Ausdruck. |

## Anmeldedaten einrichten

BigQuery verwendet ein **OAuth2 "Bring Your Own App"**-Modell. Du stellst deine eigenen Google Cloud OAuth2-Anmeldedaten bereit.

**Backend-Konfiguration:** Setze **`FRONTEND_URL`** im Heym-Backend auf die öffentliche URL der App (die Adresse, die Benutzer im Browser eingeben), z. B. `https://your-heym-domain`. Die OAuth-Redirect-URI ist immer `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Gehe zur [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktiviere die **BigQuery API**.
2. Gehe zu **Credentials** → **Create Credentials** → **OAuth client ID** → wähle **Web application**.
3. Füge unter **Authorized redirect URIs** exakt Folgendes hinzu: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Kopiere die **Client ID** und das **Client Secret**.
5. Im Heym Dashboard → **Anmeldedaten** → **Neu** → wähle **BigQuery (OAuth2)**.
6. Gib die Client ID, das Client Secret und einen Namen ein und klicke dann auf **Verbinden**, um die OAuth2-Zustimmung in einem Browser-Popup abzuschließen.

Tokens werden automatisch im Hintergrund aktualisiert — keine manuelle Token-Verwaltung erforderlich.

## Operationen

| Operation | Erforderliche Felder | Beschreibung |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Führt eine SQL-Abfrage aus und gibt Zeilen zurück |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows oder bqMappings | Fügt eine oder mehrere Zeilen über die Streaming-insertAll-API ein |

## Ausgabe-Referenz

| Operation | Ausgabefeld | Typ | Beschreibung |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Array von Zeilenobjekten (Spaltenname → Wert) |
| `query` | `.total` | number | Anzahl der zurückgegebenen Zeilen |
| `query` | `.schema` | array | Schemafelder der Tabelle |
| `insertRows` | `.insertedCount` | number | Anzahl der erfolgreich eingefügten Zeilen |
| `insertRows` | `.errors` | array | Einfügefehler pro Zeile (leer bei vollständigem Erfolg) |

## Beispiel – Eine Abfrage ausführen

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Auf die Ausgabe zugreifen: `$getUsers.rows` (Array von Zeilenobjekten), `$getUsers.rows[0].email`, `$getUsers.total`.

## Beispiel – Eine Zeile einfügen

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – BigQuery OAuth2-Anmeldedaten hinzufügen
- [Google Sheets](./google-sheets-node.md) – Ähnliches OAuth2-Muster für Tabellenkalkulationsdaten
- [Drittanbieter-Integrationen](../reference/integrations.md) – Einrichtung von Integrations-Anmeldedaten
