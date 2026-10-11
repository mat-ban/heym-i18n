# Google Sheets

Il nodo **Google Sheets** legge, scrive e gestisce dati nei fogli di calcolo Google Sheets tramite OAuth2. Utilizzarlo per automatizzare i workflow dei fogli di calcolo — lettura di report, registrazione di risultati, aggiornamento di tracker e altro ancora.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credenziale | Google Sheets (OAuth2) |
| Output | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale Google Sheets da [Credenziali](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operazione: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID del foglio di calcolo o URL completo di Google Sheets |
| `gsSheetName` | expression | Nome della scheda del foglio (es. `Sheet1`). Non richiesto per `getSheetInfo`. |
| `gsStartRow` | expression | Per `readRange`: prima riga di dati con numerazione a partire da 1 (con `gsHasHeader`, la riga 1 è l'intestazione). |
| `gsMaxRows` | expression | Per `readRange`: numero massimo di righe di dati (0 = tutte). |
| `gsHasHeader` | boolean | Per `readRange`: trattare la riga 1 come nomi delle colonne quando true. |
| `gsUpdateRow` | expression | Solo per `updateRange`: numero di riga del foglio con numerazione a partire da 1 da aggiornare (colonne A–Z); se non impostato, viene utilizzato `gsStartRow`. Non è batchUpdate — una singola PUT dell'API values. |
| `gsRange` | expression | Intervallo in notazione A1 (es. `A1:D100`). Esempi legacy; l'editor utilizza i campi riga per lettura/aggiornamento. |
| `gsKeepHeader` | boolean | Solo per `clearRange`: quando true, la riga 1 viene mantenuta e le righe di dati sottostanti vengono cancellate (colonne A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Solo per `appendRows`: **Bottom** aggiunge dopo l'ultima riga con dati; **Top** inserisce nuove righe direttamente sotto la riga 1 (spostando i dati verso il basso). |
| `gsValuesInputMode` | `raw` \| `selective` | Per `appendRows` / `updateRange`: **Raw** = array JSON completo; **Selective** = una riga del foglio, solo campi colonna (senza etichette A1). |
| `gsValuesSelectiveCols` | string | Modalità Selective: numero di colonne (A–Z). |
| `gsValues` | expression | Array JSON bidimensionale di valori (es. `[["Name","Age"],["Alice",30]]`). Richiesto per `appendRows`, `updateRange`. |

## ID del foglio di calcolo

Il campo `gsSpreadsheetId` accetta sia l'**ID nudo** (la lunga stringa alfanumerica compresa tra `/d/` e `/edit` in un URL di Google Sheets) sia l'**URL completo** — Heym estrae automaticamente l'ID.

## Configurazione delle credenziali

Google Sheets utilizza un modello **OAuth2 "Bring Your Own App"**. È necessario fornire le proprie credenziali OAuth2 di Google Cloud.

**Configurazione del backend:** impostare **`FRONTEND_URL`** sul backend di Heym all'URL pubblico dell'applicazione (l'indirizzo che gli utenti digitano nel browser), ad esempio `https://your-heym-domain`. L'URI di reindirizzamento OAuth è sempre `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — deriva esclusivamente da questa impostazione, non dagli header della richiesta.

1. Accedere a [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → abilitare **Google Sheets API**.
2. Accedere a **Credentials** → **Create Credentials** → **OAuth client ID** → selezionare **Web application**.
3. Alla voce **Authorized redirect URIs**, aggiungere esattamente: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (ad esempio `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Copiare il **Client ID** e il **Client Secret**.
5. In Heym Dashboard → **Credenziali** → **Nuova** → selezionare **Google Sheets (OAuth2)**.
6. Inserire il Client ID, il Client Secret e un nome, quindi fare clic su **Connect** per completare il consenso OAuth2 in una finestra popup del browser.

I Token si aggiornano automaticamente in background — non è richiesta alcuna gestione manuale dei Token.

## Operazioni

| Operazione | Campi richiesti | Descrizione |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Legge i valori delle celle (A–Z); `gsRange` opzionale nei flussi legacy |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Aggiunge righe in fondo (`gsAppendPlacement` append) o sotto la riga 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Sovrascrive la/le riga/e a partire da `gsUpdateRow` (A–Z); un JSON multi-riga scrive righe consecutive |
| `clearRange` | gsSpreadsheetId, gsSheetName | Cancella tutti i valori nelle colonne A–Z per la scheda; `gsKeepHeader` opzionale mantiene la prima riga |
| `getSheetInfo` | gsSpreadsheetId | Ottiene il titolo del foglio di calcolo e l'elenco delle schede |
## Riferimento Output

| Operazione | Campo di output | Tipo | Descrizione |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Oggetti riga: chiavi di colonna (nomi di intestazione o A, B, …) più **`rowIndex`** (riga del foglio con indice 1-based) |
| `readRange` | `.total` | number | Numero di righe di dati restituite |
| `appendRows` | `.updatedRange` | string | Intervallo scritto |
| `appendRows` | `.updates` | number | Numero di righe aggiunte |
| `updateRange` | `.updatedRange` | string | Intervallo scritto |
| `updateRange` | `.updatedCells` | number | Numero di celle aggiornate |
| `clearRange` | `.clearedRange` | string | Intervallo che è stato cancellato |
| `getSheetInfo` | `.title` | string | Titolo del foglio di calcolo |
| `getSheetInfo` | `.sheets` | array | Elenco di oggetti `{sheetId, title}` |

Tutte le operazioni includono `success: true` e `operation: "<name>"` nell'output.

## Esempio – Lettura di un intervallo

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

Accesso all'output: `$readReport.rows[0]` (oggetto della prima riga di dati), `$readReport.rows[0].Name` (colonna per intestazione), `$readReport.rows[0].rowIndex` (riga del foglio con indice 1-based).

## Esempio – Aggiunta di una riga dall'input

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

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiunta della credenziale Google Sheets OAuth2
- [Integrazioni di terze parti](../reference/integrations.md#google-sheets-oauth2) – Configurazione della credenziale Google Sheets
