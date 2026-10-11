# Google Drive

Il nodo **Google Drive** elenca, scarica, aggiorna ed elimina file e cartelle in Google Drive tramite OAuth2. Può inoltre copiare un file di Drive direttamente in [Heym Drive](./drive-node.md) con una singola operazione.

> **Questo non è il nodo [Drive](./drive-node.md).** Quel nodo è *Heym Drive* — l'archivio file interno di Heym. Questo nodo comunica con Google Drive. L'operazione `syncToHeymDrive` costituisce il ponte tra i due.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credenziale | Google Drive (OAuth2) |
| Output | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale Google Drive da [Credenziali](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operazione: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID della cartella o URL completo della cartella Drive. Utilizzato da `listFolderFiles` e `removeFolder`. Se vuoto, indica la radice di Drive. |
| `gdFileId` | expression | ID del file o URL completo di Drive/Docs. Utilizzato da `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Per `listFolderFiles`: numero massimo di file da restituire (predefinito 100). Se vuoto o `0`, carica l'intera cartella tramite paginazione. Ogni file elencato include `size_bytes` quando Drive ne riporta la dimensione. |
| `gdQuery` | expression | Per `listFolderFiles`: query Drive aggiuntiva combinata in AND con il filtro della cartella, ad es. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Per `listFolderFiles`: include i file nel cestino. Predefinito false. |
| `gdExportFormat` | string | Per `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Se vuoto, la scelta è automatica. Ignorato per i file regolari. |
| `gdFilename` | expression | Per `syncToHeymDrive`: sovrascrive il nome del file memorizzato in Heym Drive. |
| `gdBase64Content` | expression | Per `updateFile`: stringa base64 o URL `data:` che sostituisce il contenuto del file. |
| `gdNewName` | expression | Per `updateFile`: nuovo nome del file (rinomina). |
| `gdNewParentId` | expression | Per `updateFile`: ID o URL della cartella di destinazione (spostamento). |
| `gdPermanentDelete` | boolean | Per `removeFile` / `removeFolder`: se false (predefinito), l'elemento viene spostato nel cestino ed è recuperabile; se true, viene distrutto. |

## ID di file e cartelle

`gdFileId`, `gdFolderId` e `gdNewParentId` accettano sia l'**ID semplice** sia un **URL completo** — Heym estrae automaticamente l'ID. Tutti i seguenti formati sono validi:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets e Slides

I documenti nativi di Google **non dispongono di byte scaricabili**. Sono record sui server di Google, non file — l'API di Drive restituisce `403 Only files with binary content can be downloaded` se si richiede il loro contenuto grezzo.

`downloadFile` e `syncToHeymDrive` li rilevano automaticamente ed effettuano un'**esportazione** in loro vece, così nessuna operazione fallisce semplicemente perché la destinazione è un Google Doc:

| Origine | Esportazione predefinita |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Qualsiasi altro tipo nativo di Google | PDF |

Impostare **Export Format** per sovrascrivere la destinazione. L'impostazione viene ignorata per i file caricati regolari, che vengono sempre scaricati così come sono.

## Operazioni

| Operazione | Obbligatorio | Descrizione |
|-----------|----------|-------------|
| `listFolderFiles` | — (cartella vuota = radice) | Elenca i file in una cartella, con un filtro di query opzionale |
| `downloadFile` | `gdFileId` | Scarica i byte del file come base64, esportando automaticamente i documenti nativi |
| `syncToHeymDrive` | `gdFileId` | Scarica da Google Drive e memorizza il risultato in Heym Drive |
| `updateFile` | `gdFileId` + almeno uno tra contenuto / nome / cartella padre | Sostituisce il contenuto, rinomina e/o sposta |
| `removeFile` | `gdFileId` | Sposta nel cestino (predefinito) o elimina definitivamente un file |
| `removeFolder` | `gdFolderId` | Sposta nel cestino (predefinito) o elimina definitivamente una cartella e il suo contenuto |

### L'eliminazione è recuperabile per impostazione predefinita

`removeFile` e `removeFolder` spostano l'elemento nel **cestino di Google Drive**, dove può essere ripristinato. Questa è l'impostazione predefinita sicura per qualcosa che potrebbe essere eseguito secondo una pianificazione o all'interno di un [Loop](./loop-node.md).

Abilitando **Delete permanently** l'elemento viene distrutto senza possibilità di recupero. Per `removeFolder`, ciò distrugge anche tutto ciò che è contenuto nella cartella.

Il nodo verifica inoltre il tipo di destinazione: `removeFile` rifiuta una cartella e `removeFolder` rifiuta un file, così un ID digitato in modo errato non può eliminare silenziosamente l'elemento sbagliato.

### updateFile lascia invariati i campi vuoti

`updateFile` è un aggiornamento, non una sostituzione. Compilare qualsiasi combinazione di contenuto, nuovo nome e nuova cartella — tutto ciò che viene lasciato vuoto non viene toccato. È richiesto almeno uno dei tre.
## Configurazione delle Credenziali

Google Drive utilizza un modello **OAuth2 "Bring Your Own App"**. È necessario fornire le proprie credenziali OAuth2 di Google Cloud.

> **Questa credenziale concede l'accesso completo a Drive.** Heym richiede lo scope `https://www.googleapis.com/auth/drive` poiché il nodo opera su file già di proprietà dell'utente. Lo scope più restrittivo `drive.file` vede esclusivamente i file creati dall'app stessa, rendendo impossibili le operazioni di elenco, aggiornamento ed eliminazione dei file esistenti. Consultare [Credential Sharing](../reference/credentials-sharing.md) prima di condividere questa credenziale con un team.

**Configurazione del backend:** Impostare **`FRONTEND_URL`** sul backend di Heym all'URL pubblico dell'applicazione. L'URI di reindirizzamento OAuth è sempre `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — esso deriva unicamente da questa impostazione, non dagli header della richiesta.

1. Accedere a [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → abilitare **Google Drive API**.
2. Accedere a **Credentials** → **Create Credentials** → **OAuth client ID** → selezionare **Web application**.
3. Alla voce **Authorized redirect URIs**, aggiungere esattamente `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Copiare il **Client ID** e il **Client Secret**.
5. In Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, incollare entrambi i valori, quindi fare clic su **Connect** e approvare l'accesso nella finestra popup.

## Output

### listFolderFiles

```json
{
  "status": "success",
  "operation": "listFolderFiles",
  "folder_id": "1FolderXyz",
  "count": 2,
  "files": [
    {
      "id": "1AbC",
      "name": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 20481,
      "modified_time": "2026-07-01T10:00:00.000Z",
      "web_view_link": "https://drive.google.com/file/d/1AbC/view",
      "is_folder": false
    }
  ]
}
```

`size_bytes` è `null` per le cartelle e per i file nativi di Google, che non riportano una dimensione.

### downloadFile

```json
{
  "status": "success",
  "operation": "downloadFile",
  "id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "export_format": "pdf",
  "content_base64": "JVBERi0xLjQ..."
}
```

Per un file regolare, `exported` è `false` e `export_format` è `null`.

### syncToHeymDrive

```json
{
  "status": "success",
  "operation": "syncToHeymDrive",
  "id": "9f1c2b3d-0000-4000-8000-000000000001",
  "google_file_id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "download_url": "https://your-heym-domain/api/files/dl/TOKEN"
}
```

`id` è il nuovo ID file di **Heym Drive**, distinto da `google_file_id`.

### updateFile

```json
{
  "status": "success",
  "operation": "updateFile",
  "id": "1AbC",
  "name": "renamed.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "modified_time": "2026-07-27T10:00:00.000Z",
  "updated": ["content", "name"]
}
```

### removeFile / removeFolder

```json
{
  "status": "success",
  "operation": "removeFile",
  "id": "1AbC",
  "name": "report.pdf",
  "deleted": "trashed"
}
```

`deleted` può essere `"trashed"` o `"permanent"`.

## Esempio: eseguire il backup di una cartella Drive in Heym Drive

1. **[Cron](./cron-node.md)** — esecuzione giornaliera.
2. **Google Drive** — `listFolderFiles` sulla cartella di origine, con `gdQuery` impostato a `mimeType='application/pdf'` se si desiderano solo i PDF.
3. **[Loop](./loop-node.md)** — iterare su `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` con `gdFileId` impostato a `$BackupLoop.item.id` e `gdFilename` impostato a `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — pubblicare un riepilogo di quanto sottoposto a backup.

## Note

- Ogni campo di testo accetta espressioni `$`, pertanto ID e nomi file possono provenire da nodi precedenti.
- Le unità condivise sono supportate — il nodo imposta `supportsAllDrives` su ogni richiesta.
- I download vengono verificati in termini di dimensione rispetto all'impostazione `FILE_MAX_SIZE_MB` del backend.
- Collegare questo nodo all'input degli strumenti di un nodo [Agent](./agent-node.md) e utilizzare l'icona del bot su qualsiasi campo per consentire all'agente di compilarlo in fase di esecuzione.

## Voci correlate

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
