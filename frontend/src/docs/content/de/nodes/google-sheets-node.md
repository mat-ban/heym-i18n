# Google Sheets

Der **Google Sheets**-Knoten liest, schreibt und verwaltet Daten in Google-Sheets-Tabellen über OAuth2. Verwende ihn, um Tabellenkalkulations-Workflows zu automatisieren — Berichte lesen, Ergebnisse protokollieren, Tracker aktualisieren und mehr.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Anmeldedaten | Google Sheets (OAuth2) |
| Ausgabe | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | Google-Sheets-Anmeldedaten aus [Anmeldedaten](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operation: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | Tabellen-ID oder vollständige Google-Sheets-URL |
| `gsSheetName` | expression | Name des Tabellenblatts (z. B. `Sheet1`). Nicht erforderlich für `getSheetInfo`. |
| `gsStartRow` | expression | Für `readRange`: 1-basierte erste Datenzeile (mit `gsHasHeader` ist Zeile 1 die Kopfzeile). |
| `gsMaxRows` | expression | Für `readRange`: maximale Anzahl Datenzeilen (0 = alle). |
| `gsHasHeader` | boolean | Für `readRange`: Zeile 1 als Spaltennamen behandeln, wenn true. |
| `gsUpdateRow` | expression | Nur für `updateRange`: 1-basierte Tabellenzeilennummer zum Aktualisieren (Spalten A–Z); wenn nicht gesetzt, wird `gsStartRow` verwendet. Kein batchUpdate — ein values-API-PUT. |
| `gsRange` | expression | Bereich in A1-Notation (z. B. `A1:D100`). Legacy-Beispiele; der Editor verwendet Zeilenfelder für Lesen/Aktualisieren. |
| `gsKeepHeader` | boolean | Nur für `clearRange`: wenn true, wird Zeile 1 beibehalten und die Datenzeilen darunter werden geleert (Spalten A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Nur für `appendRows`: **Bottom** fügt nach der letzten Zeile mit Daten hinzu; **Top** fügt neue Zeilen direkt unter Zeile 1 ein (verschiebt Daten nach unten). |
| `gsValuesInputMode` | `raw` \| `selective` | Für `appendRows` / `updateRange`: **Raw** = vollständiges JSON-Array; **Selective** = eine Tabellenzeile, nur Spaltenfelder (keine A1-Beschriftungen). |
| `gsValuesSelectiveCols` | string | Selective-Modus: Anzahl der Spalten (A–Z). |
| `gsValues` | expression | JSON-2D-Array von Werten (z. B. `[["Name","Age"],["Alice",30]]`). Erforderlich für `appendRows`, `updateRange`. |

## Tabellen-ID

Das Feld `gsSpreadsheetId` akzeptiert entweder die **reine ID** (die lange alphanumerische Zeichenfolge zwischen `/d/` und `/edit` in einer Google-Sheets-URL) oder die **vollständige URL** — Heym extrahiert die ID automatisch.

## Einrichtung der Anmeldedaten

Google Sheets verwendet ein **OAuth2-"Bring Your Own App"**-Modell. Du stellst deine eigenen Google-Cloud-OAuth2-Anmeldedaten bereit.

**Backend-Konfiguration:** Setze **`FRONTEND_URL`** im Heym-Backend auf die öffentliche URL der App (die Adresse, die Benutzer im Browser eingeben), z. B. `https://your-heym-domain`. Die OAuth-Redirect-URI ist immer `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — sie wird ausschließlich aus dieser Einstellung abgeleitet, nicht aus Request-Headern.

1. Gehe zur [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktiviere die **Google Sheets API**.
2. Gehe zu **Credentials** → **Create Credentials** → **OAuth client ID** → wähle **Web application**.
3. Füge unter **Authorized redirect URIs** exakt hinzu: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (zum Beispiel `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Kopiere die **Client ID** und das **Client Secret**.
5. Im Heym Dashboard → **Anmeldedaten** → **Neu** → wähle **Google Sheets (OAuth2)**.
6. Gib die Client ID, das Client Secret und einen Namen ein und klicke dann auf **Verbinden**, um die OAuth2-Zustimmung in einem Browser-Popup abzuschließen.

Tokens werden im Hintergrund automatisch aktualisiert — keine manuelle Token-Verwaltung erforderlich.

## Operationen

| Operation | Erforderliche Felder | Beschreibung |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Zellwerte lesen (A–Z); optional `gsRange` in Legacy-Flows |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Zeilen unten hinzufügen (`gsAppendPlacement` append) oder unter Zeile 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Zeile(n) ab `gsUpdateRow` überschreiben (A–Z); mehrzeiliges JSON schreibt aufeinanderfolgende Zeilen |
| `clearRange` | gsSpreadsheetId, gsSheetName | Alle Werte in den Spalten A–Z für das Tabellenblatt leeren; optional behält `gsKeepHeader` die erste Zeile bei |
| `getSheetInfo` | gsSpreadsheetId | Tabellentitel und Liste der Tabellenblätter abrufen |

## Ausgabe-Referenz

| Operation | Ausgabefeld | Typ | Beschreibung |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Zeilenobjekte: Spaltenschlüssel (Kopfzeilennamen oder A, B, …) plus **`rowIndex`** (1-basierte Tabellenzeile) |
| `readRange` | `.total` | number | Anzahl der zurückgegebenen Datenzeilen |
| `appendRows` | `.updatedRange` | string | Geschriebener Bereich |
| `appendRows` | `.updates` | number | Anzahl der angehängten Zeilen |
| `updateRange` | `.updatedRange` | string | Geschriebener Bereich |
| `updateRange` | `.updatedCells` | number | Anzahl der aktualisierten Zellen |
| `clearRange` | `.clearedRange` | string | Bereich, der geleert wurde |
| `getSheetInfo` | `.title` | string | Tabellentitel |
| `getSheetInfo` | `.sheets` | array | Liste von `{sheetId, title}`-Objekten |

Alle Operationen enthalten `success: true` und `operation: "<name>"` in der Ausgabe.

## Beispiel – Einen Bereich lesen

```json
{
  "type": "googleSheets",
  "data": {
    "label": "readReport",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "readRange",
    "gsSpreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "gsSheetName": "Sheet1",
    "gsRange": "A1:D100"
  }
}
```

Auf die Ausgabe zugreifen: `$readReport.rows[0]` (erstes Datenzeilenobjekt), `$readReport.rows[0].Name` (Spalte nach Kopfzeile), `$readReport.rows[0].rowIndex` (1-basierte Tabellenzeile).
## Beispiel – Eine Zeile aus der Eingabe anhängen

```json
{
  "type": "googleSheets",
  "data": {
    "label": "logEntry",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "appendRows",
    "gsSpreadsheetId": "$input.spreadsheetUrl",
    "gsSheetName": "Log",
    "gsValues": "[[\"$input.name\", \"$input.email\", \"$input.timestamp\"]]"
  }
}
```

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Überblick über alle Knotentypen
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – Google Sheets OAuth2-Anmeldedaten hinzufügen
- [Drittanbieter-Integrationen](../reference/integrations.md#google-sheets-oauth2) – Einrichtung der Google Sheets-Anmeldedaten
