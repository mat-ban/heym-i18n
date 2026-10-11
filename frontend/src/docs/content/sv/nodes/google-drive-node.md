# Google Drive

Noden **Google Drive** listar, laddar ner, uppdaterar och tar bort filer och mappar i Google Drive via OAuth2. Den kan även kopiera en Drive-fil direkt till [Heym Drive](./drive-node.md) med en enda operation.

> **Detta är inte noden [Drive](./drive-node.md).** Den noden är *Heym Drive* — Heyms egen interna fillagring. Den här noden kommunicerar med Google Drive. Operationen `syncToHeymDrive` är bryggan mellan de två.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Autentiseringsuppgift | Google Drive (OAuth2) |
| Utdata | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `credentialId` | UUID | Google Drive-autentiseringsuppgift från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operation: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | Mapp-ID eller fullständig URL till Drive-mapp. Används av `listFolderFiles` och `removeFolder`. Tomt innebär Drive-roten. |
| `gdFileId` | expression | Fil-ID eller fullständig URL till Drive/Docs. Används av `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | För `listFolderFiles`: maximalt antal filer att returnera (standard 100). Tomt eller `0` läser in hela mappen via sidindelning. Varje listad fil innehåller `size_bytes` när Drive rapporterar en storlek. |
| `gdQuery` | expression | För `listFolderFiles`: extra Drive-fråga som kombineras med mappfiltret via AND, t.ex. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | För `listFolderFiles`: inkludera filer i papperskorgen. Standard false. |
| `gdExportFormat` | string | För `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Tomt innebär automatiskt. Ignoreras för vanliga filer. |
| `gdFilename` | expression | För `syncToHeymDrive`: åsidosätt filnamnet som lagras i Heym Drive. |
| `gdBase64Content` | expression | För `updateFile`: base64-sträng eller `data:`-URL som ersätter filinnehållet. |
| `gdNewName` | expression | För `updateFile`: nytt filnamn (byt namn). |
| `gdNewParentId` | expression | För `updateFile`: målmappens ID eller URL (flytta). |
| `gdPermanentDelete` | boolean | För `removeFile` / `removeFolder`: när false (standard) flyttas objektet till papperskorgen och kan återställas; när true förstörs det. |

## Fil- och mapp-ID:n

`gdFileId`, `gdFolderId` och `gdNewParentId` accepterar antingen **enbart ID:t** eller en **fullständig URL** — Heym extraherar ID:t automatiskt. Alla följande fungerar:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets och Slides

Google-native dokument har **inga nedladdningsbara byte**. De är poster på Googles servrar, inte filer — Drive-API:et returnerar `403 Only files with binary content can be downloaded` om råinnehållet efterfrågas.

`downloadFile` och `syncToHeymDrive` identifierar dessa automatiskt och **exporterar** i stället, så ingen operation misslyckas enbart för att målet är ett Google-dokument:

| Källa | Standardexport |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Annan Google-native typ | PDF |

Ange **Export Format** för att åsidosätta målet. Inställningen ignoreras för vanliga uppladdade filer, som alltid laddas ner i befintligt skick.

## Operationer

| Operation | Krävs | Beskrivning |
|-----------|----------|-------------|
| `listFolderFiles` | — (tom mapp = rot) | Lista filer i en mapp, med ett valfritt frågefilter |
| `downloadFile` | `gdFileId` | Ladda ner filens byte som base64, exporterar native-dokument automatiskt |
| `syncToHeymDrive` | `gdFileId` | Ladda ner från Google Drive och lagra resultatet i Heym Drive |
| `updateFile` | `gdFileId` + minst ett av innehåll / namn / förälder | Ersätt innehåll, byt namn och/eller flytta |
| `removeFile` | `gdFileId` | Flytta till papperskorgen (standard) eller ta bort en fil permanent |
| `removeFolder` | `gdFolderId` | Flytta till papperskorgen (standard) eller ta bort en mapp och dess innehåll permanent |

### Borttagning kan återställas som standard

`removeFile` och `removeFolder` flyttar objektet till **Google Drive papperskorg**, där det kan återställas. Detta är den säkra standarden för något som kan köras enligt ett schema eller inuti en [Loop](./loop-node.md).

Aktivering av **Delete permanently** förstör objektet utan möjlighet till återställning. För `removeFolder` förstörs även allt innehåll i mappen.

Noden kontrollerar även måltypen: `removeFile` vägrar en mapp och `removeFolder` vägrar en fil, så ett felstavat ID kan inte tyst ta bort fel objekt.

### updateFile lämnar tomma fält orörda

`updateFile` är en uppdatering, inte en ersättning. Fyll i valfri kombination av innehåll, nytt namn och ny mapp — allt som lämnas tomt påverkas inte. Minst ett av de tre krävs.
## Konfiguration av autentiseringsuppgifter

Google Drive använder modellen **OAuth2 "Bring Your Own App"**. Användaren tillhandahåller sina egna OAuth2-uppgifter från Google Cloud.

> **Dessa autentiseringsuppgifter ger fullständig åtkomst till Drive.** Heym begär scopet `https://www.googleapis.com/auth/drive` eftersom noden arbetar med filer som användaren redan äger. Det snävare scopet `drive.file` ser endast filer som appen själv har skapat, vilket skulle göra det omöjligt att lista, uppdatera och ta bort befintliga filer. Se [Delning av autentiseringsuppgifter](../reference/credentials-sharing.md) innan dessa autentiseringsuppgifter delas med ett team.

**Backend-konfiguration:** Ange **`FRONTEND_URL`** på Heym-backenden till appens publika URL. OAuth-omdirigerings-URI:n är alltid `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — den härleds endast från denna inställning, inte från förfrågningshuvuden.

1. Gå till [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktivera **Google Drive API**.
2. Gå till **Credentials** → **Create Credentials** → **OAuth client ID** → välj **Web application**.
3. Under **Authorized redirect URIs**, lägg till exakt `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Kopiera **Client ID** och **Client Secret**.
5. I Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, klistra in båda värdena och klicka sedan på **Connect** och godkänn åtkomsten i popup-fönstret.

## Utdata

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

`size_bytes` är `null` för mappar och Google-native filer, som inte rapporterar någon storlek.

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

För en vanlig fil är `exported` `false` och `export_format` är `null`.

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

`id` är det nya fil-ID:t i **Heym Drive**, skilt från `google_file_id`.

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

`deleted` är antingen `"trashed"` eller `"permanent"`.

## Exempel: säkerhetskopiera en Drive-mapp till Heym Drive

1. **[Cron](./cron-node.md)** — kör dagligen.
2. **Google Drive** — `listFolderFiles` på källmappen, med `gdQuery` satt till `mimeType='application/pdf'` om endast PDF-filer önskas.
3. **[Loop](./loop-node.md)** — iterera över `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` med `gdFileId` satt till `$BackupLoop.item.id` och `gdFilename` satt till `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — publicera en sammanfattning av vad som säkerhetskopierades.

## Anteckningar

- Alla textfält accepterar `$`-uttryck, så ID:n och filnamn kan komma från tidigare noder.
- Delade enheter stöds — noden anger `supportsAllDrives` i varje förfrågan.
- Nedladdningar storlekskontrolleras mot backendens inställning `FILE_MAX_SIZE_MB`.
- Koppla denna nod till en [Agent](./agent-node.md)-nods verktygsinmatning och använd botikonen på valfritt fält för att låta agenten fylla i det vid körning.

## Se även

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Autentiseringsuppgifter](../reference/credentials.md)
- [Delning av autentiseringsuppgifter](../reference/credentials-sharing.md)
