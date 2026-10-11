# Google Drive

**Google Drive** mezgls uzskaita, lejupielādē, atjaunina un dzēš failus un mapes Google Drive, izmantojot OAuth2. Tas var arī vienā darbībā nokopēt Drive failu tieši uz [Heym Drive](./drive-node.md).

> **Šis nav [Drive](./drive-node.md) mezgls.** Tas mezgls ir *Heym Drive* — Heym iekšējā failu krātuve. Šis mezgls sazinās ar Google Drive. Operācija `syncToHeymDrive` ir tilts starp abiem.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Akreditācijas dati | Google Drive (OAuth2) |
| Izvade | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | Google Drive akreditācijas dati no [Akreditācijas dati](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operācija: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | Mapes ID vai pilns Drive mapes URL. Izmanto `listFolderFiles` un `removeFolder`. Tukšs nozīmē Drive sakni. |
| `gdFileId` | expression | Faila ID vai pilns Drive/Docs URL. Izmanto `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Operācijai `listFolderFiles`: maksimālais atgriežamo failu skaits (pēc noklusējuma 100). Tukšs vai `0` ielādē visu mapi, izmantojot lappušu pārlūkošanu. Katrs uzskaitītais fails ietver `size_bytes`, ja Drive norāda izmēru. |
| `gdQuery` | expression | Operācijai `listFolderFiles`: papildu Drive vaicājums, kas tiek apvienots ar mapes filtru, piem., `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Operācijai `listFolderFiles`: iekļaut miskastē esošos failus. Pēc noklusējuma false. |
| `gdExportFormat` | string | Operācijām `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Tukšs nozīmē automātisku. Tiek ignorēts parastiem failiem. |
| `gdFilename` | expression | Operācijai `syncToHeymDrive`: aizstāt Heym Drive saglabāto faila nosaukumu. |
| `gdBase64Content` | expression | Operācijai `updateFile`: base64 virkne vai `data:` URL, kas aizstāj faila saturu. |
| `gdNewName` | expression | Operācijai `updateFile`: jauns faila nosaukums (pārdēvēšana). |
| `gdNewParentId` | expression | Operācijai `updateFile`: mērķa mapes ID vai URL (pārvietošana). |
| `gdPermanentDelete` | boolean | Operācijām `removeFile` / `removeFolder`: ja false (pēc noklusējuma), vienums tiek ievietots miskastē un ir atjaunojams; ja true, tas tiek iznīcināts. |

## Failu un mapju ID

`gdFileId`, `gdFolderId` un `gdNewParentId` pieņem gan **tīro ID**, gan **pilnu URL** — Heym automātiski izgūst ID. Visi šie darbojas:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets un Slides

Google native dokumentiem **nav lejupielādējamu baitu**. Tie ir ieraksti Google serveros, nevis faili — Drive API atgriež `403 Only files with binary content can be downloaded`, ja pieprasāt to neapstrādāto saturu.

`downloadFile` un `syncToHeymDrive` tos nosaka automātiski un tā vietā veic **eksportēšanu**, tāpēc neviena operācija neizdodas tikai tāpēc, ka mērķis ir Google Doc:

| Avots | Noklusējuma eksports |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Jebkurš cits Google native tips | PDF |

Iestatiet **Export Format**, lai aizstātu mērķi. Iestatījums tiek ignorēts parastiem augšupielādētiem failiem, kas vienmēr tiek lejupielādēti tādi, kādi tie ir.

## Operācijas

| Operācija | Nepieciešams | Apraksts |
|-----------|----------|-------------|
| `listFolderFiles` | — (tukša mape = sakne) | Uzskaitīt failus mapē ar izvēles vaicājuma filtru |
| `downloadFile` | `gdFileId` | Lejupielādēt faila baitus kā base64, automātiski eksportējot native dokumentus |
| `syncToHeymDrive` | `gdFileId` | Lejupielādēt no Google Drive un saglabāt rezultātu Heym Drive |
| `updateFile` | `gdFileId` + vismaz viens no satura / nosaukuma / vecāka | Aizstāt saturu, pārdēvēt un/vai pārvietot |
| `removeFile` | `gdFileId` | Ievietot miskastē (pēc noklusējuma) vai neatgriezeniski dzēst failu |
| `removeFolder` | `gdFolderId` | Ievietot miskastē (pēc noklusējuma) vai neatgriezeniski dzēst mapi un tās saturu |

### Dzēšana pēc noklusējuma ir atjaunojama

`removeFile` un `removeFolder` pārvieto vienumu uz **Google Drive miskasti**, kur to var atjaunot. Tas ir drošais noklusējums kaut kam, kas var darboties pēc grafika vai [Loop](./loop-node.md) ietvaros.

Iespējojot **Delete permanently**, vienums tiek iznīcināts bez atjaunošanas iespējas. Operācijai `removeFolder` tas iznīcina arī visu mapes saturu.

Mezgls arī pārbauda mērķa tipu: `removeFile` atsakās no mapes un `removeFolder` atsakās no faila, tāpēc kļūdaini ievadīts ID nevar klusi izdzēst nepareizo vienumu.

### updateFile atstāj tukšos laukus neskartus

`updateFile` ir atjaunināšana, nevis aizstāšana. Aizpildiet jebkuru kombināciju no satura, jauna nosaukuma un jaunas mapes — viss, ko atstājat tukšu, netiek aiztikts. Nepieciešams vismaz viens no trim.
## Akreditācijas datu iestatīšana

Google Drive izmanto **OAuth2 "Bring Your Own App"** modeli. Jūs norādāt savus Google Cloud OAuth2 akreditācijas datus.

> **Šie akreditācijas dati piešķir pilnu piekļuvi Drive.** Heym pieprasa `https://www.googleapis.com/auth/drive` scope, jo mezgls darbojas ar failiem, kas jau pieder Jums. Šaurākais `drive.file` scope redz tikai failus, ko izveidojusi pati lietotne, tādēļ esošo failu uzskaitīšana, atjaunināšana un dzēšana kļūtu neiespējama. Pirms šo akreditācijas datu koplietošanas ar komandu skatiet [Akreditācijas datu koplietošana](../reference/credentials-sharing.md).

**Backend konfigurācija:** Iestatiet **`FRONTEND_URL`** Heym backendā uz lietotnes publisko URL. OAuth novirzīšanas URI vienmēr ir `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — tas tiek atvasināts tikai no šī iestatījuma, nevis no pieprasījuma galvenēm.

1. Dodieties uz [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → iespējojiet **Google Drive API**.
2. Dodieties uz **Credentials** → **Create Credentials** → **OAuth client ID** → izvēlieties **Web application**.
3. Sadaļā **Authorized redirect URIs** pievienojiet precīzi `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Nokopējiet **Client ID** un **Client Secret**.
5. Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, ielīmējiet abas vērtības, pēc tam noklikšķiniet uz **Connect** un apstipriniet piekļuvi uznirstošajā logā.

## Izvade

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

`size_bytes` ir `null` mapēm un Google native failiem, kuri nenorāda izmēru.

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

Parastam failam `exported` ir `false` un `export_format` ir `null`.

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

`id` ir jaunais **Heym Drive** faila ID, kas atšķiras no `google_file_id`.

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

`deleted` ir `"trashed"` vai `"permanent"`.

## Piemērs: Drive mapes dublēšana Heym Drive

1. **[Cron](./cron-node.md)** — palaidiet katru dienu.
2. **Google Drive** — `listFolderFiles` avota mapē, ar `gdQuery` iestatītu uz `mimeType='application/pdf'`, ja vēlaties tikai PDF failus.
3. **[Loop](./loop-node.md)** — iterējiet `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` ar `gdFileId` iestatītu uz `$BackupLoop.item.id` un `gdFilename` iestatītu uz `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — publicējiet kopsavilkumu par to, kas tika dublēts.

## Piezīmes

- Katrs teksta lauks pieņem `$` izteiksmes, tādēļ ID un failu nosaukumi var nākt no iepriekšējiem mezgliem.
- Koplietotie diski tiek atbalstīti — mezgls iestata `supportsAllDrives` katrā pieprasījumā.
- Lejupielādes tiek pārbaudītas pēc izmēra pret backend iestatījumu `FILE_MAX_SIZE_MB`.
- Pievienojiet šo mezglu [Agent](./agent-node.md) mezgla rīka ievadei un izmantojiet bota ikonu jebkurā laukā, lai ļautu aģentam to aizpildīt izpildes laikā.

## Skatiet arī

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Akreditācijas dati](../reference/credentials.md)
- [Akreditācijas datu koplietošana](../reference/credentials-sharing.md)
