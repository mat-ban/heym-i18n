# Google Drive

**Google Drive**-noden lister, downloader, opdaterer og sletter filer og mapper i Google Drive via OAuth2. Den kan også kopiere en Drive-fil direkte ind i [Heym Drive](./drive-node.md) med en enkelt operation.

> **Dette er ikke [Drive](./drive-node.md)-noden.** Den node refererer til *Heym Drive* – Heyms interne filopbevaring. Denne node kommunikerer med Google Drive. Operationen `syncToHeymDrive` er broen mellem de to.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Legitimationsoplysninger | Google Drive (OAuth2) |
| Output | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | Google Drive-legitimationsoplysninger fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operation: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | Mappe-ID eller fuld Drive-mappe-URL. Anvendes af `listFolderFiles` og `removeFolder`. Tom betyder Drive-roden. |
| `gdFileId` | expression | Fil-ID eller fuld Drive/Docs-URL. Anvendes af `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | For `listFolderFiles`: maksimalt antal filer der returneres (standard 100). Tom eller `0` indlæser hele mappen via paginering. Hver listet fil inkluderer `size_bytes` når Drive rapporterer en størrelse. |
| `gdQuery` | expression | For `listFolderFiles`: ekstra Drive-forespørgsel ANDet med mappefilteret, f.eks. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | For `listFolderFiles`: inkluder slettede filer. Standard falsk. |
| `gdExportFormat` | string | For `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Tom betyder automatisk. Ignoreres for almindelige filer. |
| `gdFilename` | expression | For `syncToHeymDrive`: overskriv filnavnet gemt i Heym Drive. |
| `gdBase64Content` | expression | For `updateFile`: base64-streng eller `data:`-URL der erstatter filindholdet. |
| `gdNewName` | expression | For `updateFile`: nyt filnavn (omdøb). |
| `gdNewParentId` | expression | For `updateFile`: destinationsmappe-ID eller URL (flyt). |
| `gdPermanentDelete` | boolean | For `removeFile` / `removeFolder`: når falsk (standard) flyttes elementet til papirkurven og kan gendannes; når sandt slettes det permanent. |

## Fil- og mappe-ID'er

`gdFileId`, `gdFolderId` og `gdNewParentId` accepterer enten **bare ID** eller en **fuld URL** – Heym udtrækker ID'et automatisk. Alle disse virker:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets og Slides

Googles native dokumenter har **ingen downloadbare bytes**. De er poster på Googles servere, ikke filer – Drive-API'en returnerer `403 Only files with binary content can be downloaded` hvis der anmodes om deres rå indhold.

`downloadFile` og `syncToHeymDrive` registrerer disse automatisk og **eksporterer** i stedet, så ingen operation fejler blot fordi målet er en Google Doc:

| Kilde | Standardeksport |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Enhver anden Google-native type | PDF |

Indstil **Export Format** for at tilsidesætte målet. Indstillingen ignoreres for almindelige uploadede filer, som altid downloades som de er.

## Operationer

| Operation | Påkrævet | Beskrivelse |
|-----------|----------|-------------|
| `listFolderFiles` | – (tom mappe = rod) | Lister filer i en mappe, med et valgfrit forespørgselsfilter |
| `downloadFile` | `gdFileId` | Downloader filbytes som base64, eksporterer native docs automatisk |
| `syncToHeymDrive` | `gdFileId` | Downloader fra Google Drive og gemmer resultatet i Heym Drive |
| `updateFile` | `gdFileId` + mindst én af indhold / navn / overordnet | Erstatter indhold, omdøber og/eller flytter |
| `removeFile` | `gdFileId` | Flytter til papirkurven (standard) eller sletter permanent en fil |
| `removeFolder` | `gdFolderId` | Flytter til papirkurven (standard) eller sletter permanent en mappe og dens indhold |

### Sletning er gendannelsesvenlig som standard

`removeFile` og `removeFolder` flytter elementet til **Google Drive-papirkurven**, hvor det kan gendannes. Dette er den sikre standard for noget der kan køre på en tidsplan eller inde i en [Loop](./loop-node.md).

Aktivering af **Delete permanently** ødelægger elementet uden mulighed for gendannelse. For `removeFolder` ødelægges også alt indhold i mappen.

Noden kontrollerer også måltypen: `removeFile` afviser en mappe og `removeFolder` afviser en fil, så et forkert ID ikke kan slette den forkerte ting i stilhed.

### updateFile efterlader tomme felter uændrede

`updateFile` er en opdatering, ikke en erstatning. Udfyld enhver kombination af indhold, nyt navn og ny mappe – hvad der efterlades tomt berøres ikke. Mindst én af de tre er påkrævet.
## Opsætning af legitimationsoplysninger

Google Drive bruger en **OAuth2 "Bring Your Own App"** model. Det er nødvendigt at angive egne Google Cloud OAuth2-legitimationsoplysninger.

> **Disse legitimationsoplysninger giver fuld adgang til Drive.** Heym anmoder om `https://www.googleapis.com/auth/drive`-scope, fordi noden arbejder med filer, der allerede ejes. Det smallere `drive.file`-scope ville kun give adgang til filer, som appen selv har oprettet, hvilket ville gøre det umuligt at liste, opdatere og slette eksisterende filer. Se [Credential Sharing](../reference/credentials-sharing.md) før disse legitimationsoplysninger deles med et team.

**Backend-konfiguration:** Angiv **`FRONTEND_URL`** på Heym-backenden til appens offentlige URL. OAuth-omdirigerings-URI'en er altid `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — den afledes kun fra denne indstilling, ikke fra request-headers.

1. Gå til [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktiver **Google Drive API**.
2. Gå til **Credentials** → **Create Credentials** → **OAuth client ID** → vælg **Web application**.
3. Under **Authorized redirect URIs** tilføjes nøjagtigt `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Kopier **Client ID** og **Client Secret**.
5. I Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, indsæt begge værdier, klik på **Connect** og godkend adgang i popup-vinduet.

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

`size_bytes` er `null` for mapper og Google-native filer, som ikke rapporterer en størrelse.

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

For en almindelig fil er `exported` `false` og `export_format` `null`.

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

`id` er den nye **Heym Drive**-fil-ID, adskilt fra `google_file_id`.

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

`deleted` er enten `"trashed"` eller `"permanent"`.

## Eksempel: sikkerhedskopiering af en Drive-mappe til Heym Drive

1. **[Cron](./cron-node.md)** — kør dagligt.
2. **Google Drive** — `listFolderFiles` på kildefolderen, med `gdQuery` sat til `mimeType='application/pdf'` hvis kun PDF-filer ønskes.
3. **[Loop](./loop-node.md)** — iterer over `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` med `gdFileId` sat til `$BackupLoop.item.id` og `gdFilename` sat til `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — send en oversigt over, hvad der er blevet sikkerhedskopieret.

## Bemærkninger

- Alle tekstfelter accepterer `$`-udtryk, så ID'er og filnavne kan komme fra tidligere noder.
- Delte drev understøttes — noden sætter `supportsAllDrives` på hver anmodning.
- Downloads kontrolleres i forhold til backendens `FILE_MAX_SIZE_MB`-indstilling.
- Tilknyt denne node til et [Agent](./agent-node.md)-node's værktøjsinput og brug bot-ikonet på ethvert felt for at lade agenten udfylde det under kørsel.

## Se også

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
