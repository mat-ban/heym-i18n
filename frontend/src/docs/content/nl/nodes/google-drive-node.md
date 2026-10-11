# Google Drive

De **Google Drive**-node geeft een overzicht van, downloadt, werkt bij en verwijdert bestanden en mappen in Google Drive via OAuth2. De node kan ook een Drive-bestand met één enkele bewerking rechtstreeks naar [Heym Drive](./drive-node.md) kopiëren.

> **Dit is niet de [Drive](./drive-node.md)-node.** Die node is *Heym Drive* — Heyms eigen interne bestandsopslag. Deze node communiceert met Google Drive. De bewerking `syncToHeymDrive` vormt de brug tussen beide.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Referentie | Google Drive (OAuth2) |
| Uitvoer | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | Google Drive-referentie uit [Referenties](../tabs/credentials-tab.md) |
| `gdOperation` | string | Bewerking: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | Map-ID of volledige Drive-map-URL. Wordt gebruikt door `listFolderFiles` en `removeFolder`. Leeg betekent de Drive-root. |
| `gdFileId` | expression | Bestands-ID of volledige Drive/Docs-URL. Wordt gebruikt door `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Voor `listFolderFiles`: maximaal aantal bestanden om te retourneren (standaard 100). Leeg of `0` laadt de volledige map via paging. Elk vermeld bestand bevat `size_bytes` wanneer Drive een grootte rapporteert. |
| `gdQuery` | expression | Voor `listFolderFiles`: extra Drive-query die met AND wordt gecombineerd met het mapfilter, bijvoorbeeld `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Voor `listFolderFiles`: neem bestanden in de prullenbak op. Standaard false. |
| `gdExportFormat` | string | Voor `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Leeg betekent automatisch. Wordt genegeerd voor reguliere bestanden. |
| `gdFilename` | expression | Voor `syncToHeymDrive`: overschrijf de bestandsnaam die in Heym Drive wordt opgeslagen. |
| `gdBase64Content` | expression | Voor `updateFile`: base64-string of `data:`-URL die de bestandsinhoud vervangt. |
| `gdNewName` | expression | Voor `updateFile`: nieuwe bestandsnaam (hernoemen). |
| `gdNewParentId` | expression | Voor `updateFile`: doelmap-ID of URL (verplaatsen). |
| `gdPermanentDelete` | boolean | Voor `removeFile` / `removeFolder`: wanneer false (standaard) wordt het item naar de prullenbak verplaatst en kan het worden hersteld; wanneer true wordt het definitief verwijderd. |

## Bestands- en map-ID's

`gdFileId`, `gdFolderId` en `gdNewParentId` accepteren zowel de **bare ID** als een **volledige URL** — Heym extraheert de ID automatisch. Al deze vormen werken:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets en Slides

Google-native documenten hebben **geen downloadbare bytes**. Het zijn records op de servers van Google, geen bestanden — de Drive API retourneert `403 Only files with binary content can be downloaded` wanneer de onbewerkte inhoud wordt opgevraagd.

`downloadFile` en `syncToHeymDrive` detecteren dit automatisch en **exporteren** in plaats daarvan, zodat geen enkele bewerking mislukt enkel omdat het doel een Google Doc is:

| Bron | Standaard export |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Elk ander Google-native type | PDF |

Stel **Export Format** in om het doelformaat te overschrijven. De instelling wordt genegeerd voor reguliere geüploade bestanden, die altijd ongewijzigd worden gedownload.

## Bewerkingen

| Bewerking | Vereist | Beschrijving |
|-----------|----------|-------------|
| `listFolderFiles` | — (lege map = root) | Bestanden in een map weergeven, met een optioneel queryfilter |
| `downloadFile` | `gdFileId` | Bestandsbytes downloaden als base64, waarbij native documenten automatisch worden geëxporteerd |
| `syncToHeymDrive` | `gdFileId` | Downloaden vanuit Google Drive en het resultaat opslaan in Heym Drive |
| `updateFile` | `gdFileId` + ten minste één van inhoud / naam / bovenliggende map | Inhoud vervangen, hernoemen en/of verplaatsen |
| `removeFile` | `gdFileId` | Bestand naar de prullenbak verplaatsen (standaard) of definitief verwijderen |
| `removeFolder` | `gdFolderId` | Map en inhoud naar de prullenbak verplaatsen (standaard) of definitief verwijderen |

### Verwijderen is standaard herstelbaar

`removeFile` en `removeFolder` verplaatsen het item naar de **prullenbak van Google Drive**, waar het kan worden hersteld. Dit is de veilige standaard voor iets dat volgens een tijdschema of binnen een [Loop](./loop-node.md) kan worden uitgevoerd.

Het inschakelen van **Delete permanently** vernietigt het item zonder mogelijkheid tot herstel. Voor `removeFolder` worden daarbij ook alle items in de map vernietigd.

De node controleert ook het doeltype: `removeFile` weigert een map en `removeFolder` weigert een bestand, zodat een verkeerd getypte ID niet stilzwijgend het verkeerde item kan verwijderen.

### updateFile laat lege velden ongemoeid

`updateFile` is een update, geen vervanging. Vul een willekeurige combinatie van inhoud, nieuwe naam en nieuwe map in — wat leeg blijft, wordt niet aangepast. Ten minste één van de drie is vereist.
## Referentie-instelling

Google Drive gebruikt een **OAuth2 "Bring Your Own App"**-model. U levert uw eigen Google Cloud OAuth2-referenties aan.

> **Deze referentie verleent volledige Drive-toegang.** Heym vraagt de scope `https://www.googleapis.com/auth/drive` aan, omdat de node werkt met bestanden die u al bezit. De beperktere scope `drive.file` ziet alleen bestanden die de app zelf heeft aangemaakt, waardoor het weergeven, bijwerken en verwijderen van uw bestaande bestanden onmogelijk zou zijn. Zie [Referenties delen](../reference/credentials-sharing.md) voordat u deze referentie met een team deelt.

**Backend-configuratie:** Stel **`FRONTEND_URL`** op de Heym-backend in op de openbare URL van de app. De OAuth-redirect-URI is altijd `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — deze wordt uitsluitend afgeleid van deze instelling, niet van request-headers.

1. Ga naar [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → schakel **Google Drive API** in.
2. Ga naar **Credentials** → **Create Credentials** → **OAuth client ID** → selecteer **Web application**.
3. Voeg onder **Authorized redirect URIs** exact `{uw FRONTEND_URL}/api/credentials/google-drive/oauth/callback` toe.
4. Kopieer het **Client ID** en **Client Secret**.
5. In Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, plak beide waarden en klik vervolgens op **Connect** en keur de toegang goed in het pop-upvenster.

## Uitvoer

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

`size_bytes` is `null` voor mappen en Google-native bestanden, die geen grootte rapporteren.

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

Voor een regulier bestand is `exported` `false` en is `export_format` `null`.

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

`id` is het nieuwe **Heym Drive**-bestands-ID, dat verschilt van `google_file_id`.

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

`deleted` is `"trashed"` of `"permanent"`.

## Voorbeeld: een Drive-map back-uppen naar Heym Drive

1. **[Cron](./cron-node.md)** — dagelijks uitvoeren.
2. **Google Drive** — `listFolderFiles` op de bronmap, met `gdQuery` ingesteld op `mimeType='application/pdf'` als u alleen PDF's wilt.
3. **[Loop](./loop-node.md)** — itereer over `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` met `gdFileId` ingesteld op `$BackupLoop.item.id` en `gdFilename` ingesteld op `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — plaats een samenvatting van wat er is geback-upt.

## Opmerkingen

- Elk tekstveld accepteert `$`-expressies, zodat ID's en bestandsnamen afkomstig kunnen zijn van eerdere nodes.
- Gedeelde drives worden ondersteund — de node stelt `supportsAllDrives` in bij elk request.
- Downloads worden op grootte gecontroleerd aan de hand van de `FILE_MAX_SIZE_MB`-instelling van de backend.
- Koppel deze node aan de tool-invoer van een [Agent](./agent-node.md)-node en gebruik het bot-pictogram op elk veld om de agent dit tijdens runtime te laten invullen.

## Zie ook

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Referenties](../reference/credentials.md)
- [Referenties delen](../reference/credentials-sharing.md)
