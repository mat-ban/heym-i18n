# Google Drive

**Google Drive** node loetleb, laadib alla, uuendab ja kustutab faile ning kaustu Google Drive'is OAuth2 kaudu. Samuti saab see ühe toiminguga kopeerida Drive'i faili otse [Heym Drive'i](./drive-node.md).

> **See ei ole [Drive](./drive-node.md) node.** Too node on *Heym Drive* — Heymi enda sisemine failihoidla. See node suhtleb Google Drive'iga. Toiming `syncToHeymDrive` on kahe vaheline sild.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Mandaat | Google Drive (OAuth2) |
| Väljund | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | Google Drive'i mandaat jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `gdOperation` | string | Toiming: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | Kausta ID või täielik Drive'i kausta URL. Kasutatakse toimingutes `listFolderFiles` ja `removeFolder`. Tühi tähendab Drive'i juurkausta. |
| `gdFileId` | expression | Faili ID või täielik Drive'i/Docs'i URL. Kasutatakse toimingutes `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Toimingu `listFolderFiles` jaoks: maksimaalne tagastatavate failide arv (vaikimisi 100). Tühi või `0` laadib kogu kausta lehekülgede kaupa. Iga loetletud fail sisaldab `size_bytes`, kui Drive teatab suuruse. |
| `gdQuery` | expression | Toimingu `listFolderFiles` jaoks: täiendav Drive'i päring, mis ühendatakse kausta filtriga operaatoriga AND, nt `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Toimingu `listFolderFiles` jaoks: kaasa prügikasti visatud failid. Vaikimisi false. |
| `gdExportFormat` | string | Toimingute `downloadFile` / `syncToHeymDrive` jaoks: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Tühi tähendab automaatset. Tavaliste failide puhul eiratakse. |
| `gdFilename` | expression | Toimingu `syncToHeymDrive` jaoks: alista Heym Drive'i salvestatav failinimi. |
| `gdBase64Content` | expression | Toimingu `updateFile` jaoks: base64 string või `data:` URL, mis asendab faili sisu. |
| `gdNewName` | expression | Toimingu `updateFile` jaoks: uus failinimi (ümbernimetamine). |
| `gdNewParentId` | expression | Toimingu `updateFile` jaoks: sihtkausta ID või URL (teisaldamine). |
| `gdPermanentDelete` | boolean | Toimingute `removeFile` / `removeFolder` jaoks: kui false (vaikimisi), visatakse üksus prügikasti ja on taastatav; kui true, hävitatakse see jäädavalt. |

## Faili- ja kausta ID-d

`gdFileId`, `gdFolderId` ja `gdNewParentId` aktsepteerivad kas **paljast ID-d** või **täielikku URL-i** — Heym eraldab ID automaatselt. Kõik järgnevad töötavad:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets ja Slides

Google'i natiivsetel dokumentidel **puuduvad allalaaditavad baidid**. Need on Google'i serverites olevad kirjed, mitte failid — Drive API tagastab `403 Only files with binary content can be downloaded`, kui küsida nende töötlemata sisu.

`downloadFile` ja `syncToHeymDrive` tuvastavad need automaatselt ja teevad selle asemel **ekspordi**, nii et ükski toiming ei ebaõnnestu pelgalt seetõttu, et sihtmärgiks on Google Doc:

| Allikas | Vaikimisi eksport |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Mis tahes muu Google'i natiivne tüüp | PDF |

Sihtmärgi alistamiseks määrake **Export Format**. See säte eiratakse tavaliste üleslaaditud failide puhul, mis laaditakse alati alla muutmata kujul.

## Toimingud

| Toiming | Nõutav | Kirjeldus |
|-----------|----------|-------------|
| `listFolderFiles` | — (tühi kaust = juurkaust) | Loetleb failid kaustas, valikulise päringufiltriga |
| `downloadFile` | `gdFileId` | Laadib faili baidid alla base64 kujul, eksportides natiivsed dokumendid automaatselt |
| `syncToHeymDrive` | `gdFileId` | Laadib Google Drive'ist alla ja salvestab tulemuse Heym Drive'i |
| `updateFile` | `gdFileId` + vähemalt üks järgnevatest: sisu / nimi / ülemkaust | Asendab sisu, nimetab ümber ja/või teisaldab |
| `removeFile` | `gdFileId` | Viskab prügikasti (vaikimisi) või kustutab faili jäädavalt |
| `removeFolder` | `gdFolderId` | Viskab prügikasti (vaikimisi) või kustutab kausta ja selle sisu jäädavalt |

### Kustutamine on vaikimisi taastatav

`removeFile` ja `removeFolder` viivad üksuse **Google Drive'i prügikasti**, kust seda saab taastada. See on turvaline vaikeväärtus millegi jaoks, mis võib käivituda ajakava alusel või [Loop](./loop-node.md) node'i sees.

**Delete permanently** lubamine hävitab üksuse ilma taastamisvõimaluseta. Toimingu `removeFolder` puhul hävitab see ka kõik kausta sees oleva.

Node kontrollib ka sihtmärgi tüüpi: `removeFile` keeldub kaustast ja `removeFolder` keeldub failist, nii et valesti sisestatud ID ei saa vaikselt valet asja kustutada.

### updateFile jätab tühjad väljad puutumata

`updateFile` on uuendamine, mitte asendamine. Täitke mis tahes kombinatsioon sisust, uuest nimest ja uuest kaustast — kõike, mille tühjaks jätate, ei puudutata. Nõutav on vähemalt üks neist kolmest.
## Mandaadi seadistamine

Google Drive kasutab **OAuth2 "Bring Your Own App"** mudelit. Te esitate oma Google Cloud OAuth2 mandaadid.

> **See mandaat annab täieliku Drive'i juurdepääsu.** Heym taotleb skoopi `https://www.googleapis.com/auth/drive`, kuna node töötab failidega, mis on juba teie omanduses. Kitsam skoop `drive.file` näeb ainult faile, mille rakendus ise on loonud, mis muudaks teie olemasolevate failide loetlemise, uuendamise ja kustutamise võimatuks. Enne selle mandaadi jagamist meeskonnaga tutvuge jaotisega [Mandaatide jagamine](../reference/credentials-sharing.md).

**Backendi konfiguratsioon:** Määrake Heymi backendsättele **`FRONTEND_URL`** rakenduse avalikuks URL-iks. OAuthi ümbersuunamise URI on alati `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — see tuletatakse ainult sellest sättest, mitte päringu päistest.

1. Minge [Google Cloud Console'i](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → lubage **Google Drive API**.
2. Minge **Credentials** → **Create Credentials** → **OAuth client ID** → valige **Web application**.
3. Jaotises **Authorized redirect URIs** lisage täpselt `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Kopeerige **Client ID** ja **Client Secret**.
5. Heymis: **Dashboard → Credentials → New → Google Drive (OAuth2)**, kleepige mõlemad väärtused, seejärel klõpsake **Connect** ja kinnitage juurdepääs hüpikaknas.

## Väljund

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

`size_bytes` on `null` kaustade ja Google'i natiivsete failide puhul, mis ei teata suurust.

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

Tavalise faili puhul on `exported` väärtusega `false` ja `export_format` väärtusega `null`.

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

`id` on uue **Heym Drive** faili ID, mis erineb väljast `google_file_id`.

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

`deleted` on kas `"trashed"` või `"permanent"`.

## Näide: Drive'i kausta varundamine Heym Drive'i

1. **[Cron](./cron-node.md)** — käivitage iga päev.
2. **Google Drive** — `listFolderFiles` lähtekaustal, kus `gdQuery` on seatud väärtusele `mimeType='application/pdf'`, kui soovite ainult PDF-e.
3. **[Loop](./loop-node.md)** — itereerige üle `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive`, kus `gdFileId` on seatud väärtusele `$BackupLoop.item.id` ja `gdFilename` väärtusele `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — postitage kokkuvõte varundatud failidest.

## Märkused

- Iga tekstiväli aktsepteerib `$` avaldisi, seega ID-d ja failinimed võivad pärineda varasematest node'idest.
- Jagatud draivid on toetatud — node määrab igal päringul `supportsAllDrives`.
- Allalaadimiste suurust kontrollitakse backendi sätte `FILE_MAX_SIZE_MB` vastu.
- Kinnitage see node [Agendi](./agent-node.md) node'i tööriista sisendile ja kasutage boti ikooni mis tahes väljal, et agent saaks selle käitusajal täita.

## Vaata ka

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Mandaadid](../reference/credentials.md)
- [Mandaatide jagamine](../reference/credentials-sharing.md)
