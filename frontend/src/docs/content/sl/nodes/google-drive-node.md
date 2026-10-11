# Google Drive

Vozlišče **Google Drive** navaja, prenaša, posodablja in briše datoteke ter mape v Google Drive prek OAuth2. Prav tako lahko kopira datoteko iz Drive neposredno v [Heym Drive](./drive-node.md) z enim samim dejanjem.

> **To ni vozlišče [Drive](./drive-node.md).** To vozlišče se pogovarja z Google Drive. Operacija `syncToHeymDrive` je most med obema.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Poverilnica | Google Drive (OAuth2) |
| Izhod | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Poverilnica Google Drive iz [Poverilnic](../tabs/credentials-tab.md) |
| `gdOperation` | niz | Operacija: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | izraz | ID mape ali celoten URL mape Drive. Uporablja se pri `listFolderFiles` in `removeFolder`. Prazno pomeni koren Drive. |
| `gdFileId` | izraz | ID datoteke ali celoten URL Drive/Docs. Uporablja se pri `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | izraz | Pri `listFolderFiles`: največje število datotek za vrnitev (privzeto 100). Prazno ali `0` naloži celo mapo prek paginacije. Vsaka navedena datoteka vključuje `size_bytes`, ko Drive poroča o velikosti. |
| `gdQuery` | izraz | Pri `listFolderFiles`: dodatno poizvedbo Drive, ki je ANDana z filtrom mape, npr. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Pri `listFolderFiles`: vključuje izbrisane datoteke. Privzeto false. |
| `gdExportFormat` | niz | Pri `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Prazno pomeni samodejno. Ignorirano za navadne datoteke. |
| `gdFilename` | izraz | Pri `syncToHeymDrive`: nadomesti ime datoteke, shranjeno v Heym Drive. |
| `gdBase64Content` | izraz | Pri `updateFile`: base64 niz ali `data:` URL, ki nadomesti vsebino datoteke. |
| `gdNewName` | izraz | Pri `updateFile`: novo ime datoteke (preimenovanje). |
| `gdNewParentId` | izraz | Pri `updateFile`: ID ciljne mape ali URL (premik). |
| `gdPermanentDelete` | boolean | Pri `removeFile` / `removeFolder`: ko je false (privzeto) se predmet premakne v smeti in je obnovljiv; ko je true, je uničen. |

## ID-ji datotek in map

`gdFileId`, `gdFolderId` in `gdNewParentId` sprejemajo bodisi **goli ID** bodisi **celoten URL** — Heym samodejno izlušči ID. Vse to deluje:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets in Slides

Google-nativne dokumente **ni mogoče prenesti**. So zapisi na Googleovih strežnikih, ne datoteke — Drive API vrne `403 Only files with binary content can be downloaded`, če zahtevate njihovo surovo vsebino.

`downloadFile` in `syncToHeymDrive` to samodejno zaznata in **izvozita** namesto tega, tako da nobena operacija ne neha delovati le zato, ker je cilj Google Doc:

| Vir | Privzeti izvoz |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Vsaka druga Google-nativna vrsta | PDF |

Nastavite **Izvozni format** za nadomestitev cilja. Nastavitev se ignorira za navadne naložene datoteke, ki se vedno prenašajo takšne, kot so.

## Operacije

| Operacija | Zahtevano | Opis |
|-----------|----------|-------------|
| `listFolderFiles` | — (prazna mapa = koren) | Našteje datoteke v mapi, z opcijskim filtrom poizvedbe |
| `downloadFile` | `gdFileId` | Prenese bajte datoteke kot base64, samodejno izvozi nativne dokumente |
| `syncToHeymDrive` | `gdFileId` | Prenese iz Google Drive in shrani rezultat v Heym Drive |
| `updateFile` | `gdFileId` + vsaj ena od vsebine / imena / starša | Zamenja vsebino, preimenuje in/ali premakne |
| `removeFile` | `gdFileId` | Premakne v smeti (privzeto) ali trajno izbriše datoteko |
| `removeFolder` | `gdFolderId` | Premakne v smeti (privzeto) ali trajno izbriše mapo in njeno vsebino |

### Brisanje je privzeto obnovljivo

`removeFile` in `removeFolder` premaknejo predmet v **smeti Google Drive**, kjer ga je mogoče obnoviti. To je varna privzeta nastavitev za nekaj, kar se lahko izvaja na urniku ali znotraj [Loop](./loop-node.md).

Omogočanje **Trajno izbrisi** uniči predmet brez možnosti obnove. Pri `removeFolder` to tudi uniči vse znotraj mape.

Vozlišče prav tako preverja vrsto cilja: `removeFile` zavrne mapo in `removeFolder` zavrne datoteko, tako da napačno vnesen ID ne more tiho izbrisati napačne stvari.

### updateFile pusti prazna polja nedotaknjena

`updateFile` je posodobitev, ne zamenjava. Izpolnite katero koli kombinacijo vsebine, novega imena in nove mape — karkoli pustite prazno, ostane nedotaknjeno. Potrebna je vsaj ena od treh.
## Nastavitev poverilnic

Google Drive uporablja model **OAuth2 "Bring Your Own App"**. Vi zagotovite svoje lastne poverilnice Google Cloud OAuth2.

> **Te poverilnice omogočajo popoln dostop do Drive-a.** Heym zahteva obseg `https://www.googleapis.com/auth/drive`, ker vozlišče deluje na datotekah, ki jih že imate. Ožji obseg `drive.file` vidi le datoteke, ki jih je aplikacija sama ustvarila, kar bi onemogočilo seznam, posodabljanje in brisanje vaših obstoječih datotek. Pred deljenjem teh poverilnic s skupino si oglejte [Deljenje poverilnic](../reference/credentials-sharing.md).

**Konfiguracija strežnika:** Nastavite **`FRONTEND_URL`** na Heym strežniku na javni URL aplikacije. URI za preusmeritev OAuth je vedno `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — izpelje se le iz te nastavitve, ne iz glave zahtevka.

1. Pojdite na [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → omogočite **Google Drive API**.
2. Pojdite na **Credentials** → **Create Credentials** → **OAuth client ID** → izberite **Web application**.
3. Pod **Authorized redirect URIs** dodajte natančno `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Kopirajte **Client ID** in **Client Secret**.
5. V Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, prilepite obe vrednosti, nato kliknite **Connect** in odobrite dostop v pojavnem oknu.

## Izhod

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

`size_bytes` je `null` za mape in datoteke, ki so nativne za Google, ki ne poročajo o velikosti.

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

Za navadno datoteko je `exported` `false` in `export_format` je `null`.

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

`id` je nova **Heym Drive** ID datoteke, ki se razlikuje od `google_file_id`.

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

`deleted` je `"trashed"` ali `"permanent"`.

## Primer: varnostna kopija mape Drive v Heym Drive

1. **[Cron](./cron-node.md)** — izvajajte dnevno.
2. **Google Drive** — `listFolderFiles` na izvorni mapi, z `gdQuery` nastavljenim na `mimeType='application/pdf'`, če želite le PDF datoteke.
3. **[Loop](./loop-node.md)** — ponavljajte `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` z `gdFileId` nastavljenim na `$BackupLoop.item.id` in `gdFilename` nastavljenim na `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — objavite povzetek tega, kar je bilo varnostno kopirano.

## Opombe

- Vsako besedilno polje sprejema `$` izraze, tako da lahko ID-ji in imena datotek prihajajo iz prejšnjih vozlišč.
- Deljeni pogoni so podprti — vozlišče nastavi `supportsAllDrives` pri vsakem zahtevku.
- Prenosi so preverjeni glede na nastavitev `FILE_MAX_SIZE_MB` na strežniku.
- Pripnite to vozlišče na vhod orodja vozlišča [Agent](./agent-node.md) in uporabite ikono bota na katerem koli polju, da agent to izpolni med izvajanjem.

## Oglejte si tudi

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
