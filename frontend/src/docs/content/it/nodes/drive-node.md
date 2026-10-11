# Nodo Drive

Il nodo **Drive** gestisce i file generati dalle skill direttamente all'interno di un workflow. Utilizzarlo per recuperare file, scaricare file da URL esterni, eliminarli, condividerli o annullarne la condivisione con i propri team, oppure aggiornarne i vincoli di accesso (password, scadenza, limite di download) in modo programmatico.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (varia in base all'operazione) |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `driveOperation` | string | Operazione: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID del file Drive da gestire (tutte le operazioni tranne `getAll`, `downloadUrl` e `save`) |
| `driveLimit` | number | Numero massimo di file da restituire (solo `getAll`; se vuoto, nessun limite) |
| `driveSourceUrl` | expression | URL da recuperare e archiviare in Drive (solo `downloadUrl`) |
| `driveFilename` | expression | Nome file completo con estensione (solo `save`, ad es. `1.mp3`) |
| `driveBase64Content` | expression | Stringa base64 grezza o data URL da decodificare e archiviare (solo `save`) |
| `driveIncludeBinary` | boolean | Includere il contenuto del file come base64 nell'output (solo `get`) |
| `drivePassword` | expression | Password da impostare sul token di accesso (solo `setPassword`) |
| `driveTtlHours` | number | Ore prima della scadenza del link di download (solo `setTtl`) |
| `driveMaxDownloads` | number | Numero massimo di download consentiti (solo `setMaxDownloads`) |

## Ottenere il File ID

Quando una skill genera file, l'output include un array `_generated_files`. Ogni voce contiene un campo `id`:

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 45231,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

Fare riferimento al file ID con: `$agentLabel._generated_files[0].id`

## Operazioni

| Operazione | Campi obbligatori | Descrizione |
|-----------|----------------|-------------|
| `get` | driveFileId | Recupera i metadati del file (e facoltativamente il contenuto binario) da Drive |
| `getAll` | nessuno | Elenca i file Drive leggibili di proprietà e condivisi con i team, con metadati quali nome file, tipo MIME, dimensione, origine e URL di download |
| `downloadUrl` | driveSourceUrl | Recupera un file da un URL esterno e lo archivia in Drive |
| `save` | driveFilename, driveBase64Content | Decodifica il contenuto base64 e lo archivia come file Drive |
| `delete` | driveFileId | Elimina il file e tutti i relativi token di accesso dal disco e dal database |
| `setPassword` | driveFileId, drivePassword | Sostituisce il token pubblico predefinito con uno protetto da password |
| `setTtl` | driveFileId, driveTtlHours | Sostituisce il token pubblico predefinito con uno che scade dopo N ore |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Sostituisce il token pubblico predefinito con uno limitato a N download |
| `shareWithMyTeams` | driveFileId | Condivide il file in sola lettura con tutti i team a cui appartiene attualmente il proprietario del workflow |
| `unshareWithMyTeams` | driveFileId | Rimuove tutte le condivisioni con i team dal file |

> **Nota:** Le operazioni `set*` eliminano il token pubblico predefinito (senza vincoli) e ne creano uno nuovo con il vincolo specificato. Il `download_url` aggiornato è incluso nell'output.
> **Condivisione con i team:** `shareWithMyTeams` crea condivisioni esplicite per i team attuali del proprietario. I team futuri non vengono aggiunti automaticamente, a meno che l'operazione non venga eseguita nuovamente. `unshareWithMyTeams` rimuove tutte le condivisioni con i team dal file.

## Esempio — Scaricare un file da URL

```json
{
  "type": "drive",
  "data": {
    "label": "fetchReport",
    "driveOperation": "downloadUrl",
    "driveSourceUrl": "https://example.com/reports/q1.pdf"
  }
}
```

Fare riferimento al file archiviato a valle: `$fetchReport.id`, `$fetchReport.download_url`

Il nome file viene ricavato dall'header di risposta `Content-Disposition`; se assente, viene derivato dal percorso dell'URL.

## Esempio — Salvare un input Base64 in Drive

Utilizzare questa operazione quando un nodo di input testuale (o qualsiasi nodo a monte) fornisce il contenuto di un file in base64:

```json
{
  "type": "drive",
  "data": {
    "label": "saveAudio",
    "driveOperation": "save",
    "driveFilename": "$userInput.body.filename",
    "driveBase64Content": "$userInput.body.base64"
  }
}
```

Fare riferimento al file archiviato a valle: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` accetta una stringa base64 grezza o un data URL `data:...;base64,...`. Il tipo MIME viene dedotto dall'estensione del nome file.
## Esempio — Ottenere un file e utilizzare il contenuto binario in un Vision LLM

```json
{
  "type": "drive",
  "data": {
    "label": "fetchImage",
    "driveOperation": "get",
    "driveFileId": "550e8400-e29b-41d4-a716-446655440000",
    "driveIncludeBinary": true
  }
}
```

Fare riferimento al contenuto base64 a valle: `$fetchImage.file_base64`

Le immagini restituite tramite `file_base64` vengono visualizzate inline nel pannello di debug durante l'esecuzione del workflow.

## Esempio — Elencare i file di Drive

```json
{
  "type": "drive",
  "data": {
    "label": "listFiles",
    "driveOperation": "getAll",
    "driveLimit": 50
  }
}
```

Fare riferimento al primo file restituito a valle: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`

## Esempio — Eliminare un file dopo l'elaborazione

```json
{
  "type": "drive",
  "data": {
    "label": "cleanup",
    "driveOperation": "delete",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Esempio — Impostare una password su un file generato

```json
{
  "type": "drive",
  "data": {
    "label": "protectFile",
    "driveOperation": "setPassword",
    "driveFileId": "$generateReport._generated_files[0].id",
    "drivePassword": "$input.password"
  }
}
```

## Esempio — Impostare la scadenza (TTL)

```json
{
  "type": "drive",
  "data": {
    "label": "expireFile",
    "driveOperation": "setTtl",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveTtlHours": 24
  }
}
```

## Esempio — Limitare i download

```json
{
  "type": "drive",
  "data": {
    "label": "limitDownloads",
    "driveOperation": "setMaxDownloads",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveMaxDownloads": 3
  }
}
```

## Esempio — Condividere con i propri team

```json
{
  "type": "drive",
  "data": {
    "label": "shareReport",
    "driveOperation": "shareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

I membri del team possono visualizzare e scaricare il file da Drive e utilizzare le operazioni di lettura nei workflow. Non possono eliminarlo, ricondividerlo né modificare i vincoli del link pubblico.

## Esempio — Annullare la condivisione con i propri team

```json
{
  "type": "drive",
  "data": {
    "label": "unshareReport",
    "driveOperation": "unshareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Conversione di un file

La conversione di formato è stata spostata nel nodo [Converter](./converter-node.md). Archiviare o recuperare il file con Drive, quindi passare il suo id a un nodo converter:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

Il file originale viene preservato e il file convertito viene archiviato come nuovo file di Drive.

## Accesso all'output

**get:**
- `$nodeLabel.id` — UUID del file
- `$nodeLabel.filename` — nome del file
- `$nodeLabel.mime_type` — tipo MIME (es. `image/png`)
- `$nodeLabel.size_bytes` — dimensione del file in byte
- `$nodeLabel.download_url` — URL pubblico di download
- `$nodeLabel.file_base64` — contenuto del file codificato in base64 (solo quando **Include binary content** è abilitato)

**getAll:**
- `$nodeLabel.files` — Array di oggetti di metadati dei file
- `$nodeLabel.count` — Numero di file restituiti
- `$nodeLabel.files[0].id` — UUID del file
- `$nodeLabel.files[0].filename` — Nome del file
- `$nodeLabel.files[0].mime_type` — Tipo MIME
- `$nodeLabel.files[0].size_bytes` — Dimensione del file in byte
- `$nodeLabel.files[0].download_url` — URL pubblico di download quando esiste un token pubblico
- `$nodeLabel.files[0].metadata` — Oggetto di metadati archiviati
- `$nodeLabel.files[0].created_at` — Timestamp di creazione del file

**downloadUrl:**
- `$nodeLabel.id` — UUID del file appena archiviato
- `$nodeLabel.filename` — nome del file (da `Content-Disposition` o dal percorso dell'URL)
- `$nodeLabel.mime_type` — tipo MIME rilevato dalla risposta o dall'estensione del file
- `$nodeLabel.size_bytes` — dimensione del file in byte
- `$nodeLabel.download_url` — URL di download di Drive per il file archiviato

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID del file eliminato

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID del file
- `$nodeLabel.download_url` — Nuovo URL con token di accesso e vincolo applicato

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID del file
- `$nodeLabel.shared_team_count` — Numero di condivisioni con team dopo l'operazione

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID del file
- `$nodeLabel.shared_team_count` — `0` dopo l'operazione

## Proprietà

Le operazioni riservate al proprietario richiedono che il file appartenga al proprietario del workflow. Le operazioni di lettura (`get`, `getAll`) possono accedere anche ai file condivisi con il proprietario del workflow tramite un team.
## Correlati

- [Generazione di file](../reference/file-generation.md) - Come le skill generano file e l'output `_generated_files`
- [Scheda Drive](../reference/drive.md) - Gestione visiva dei file nella dashboard
- [Nodo Agent](./agent-node.md) - Esegue skill che generano file
- [Nodo Converter](./converter-node.md) - Converte un file archiviato in un altro formato oppure lo elabora tramite OCR in testo
- [Expression DSL](../reference/expression-dsl.md) - Sintassi delle espressioni per valori dinamici
