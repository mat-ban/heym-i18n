# Drive Node

**Drive** node haldab skillide poolt genereeritud faile otse workflow'st. Kasutage seda failide toomiseks, välistelt URL-idelt allalaadimiseks, kustutamiseks, meeskondadega jagamiseks või jagamise lõpetamiseks ning nende juurdepääsupiirangute (parool, aegumine, allalaadimislimiit) programmiliseks uuendamiseks.

## Ülevaade

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (varies by operation) |

## Parameetrid

| Parameter | Type | Description |
|-----------|------|-------------|
| `driveOperation` | string | Operation: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID of the Drive file to manage (all operations except `getAll`, `downloadUrl`, and `save`) |
| `driveLimit` | number | Maximum files to return (`getAll` only; empty means no limit) |
| `driveSourceUrl` | expression | URL to fetch and store in Drive (`downloadUrl` only) |
| `driveFilename` | expression | Full filename including extension (`save` only, e.g. `1.mp3`) |
| `driveBase64Content` | expression | Raw base64 string or data URL to decode and store (`save` only) |
| `driveIncludeBinary` | boolean | Include file content as base64 in output (`get` only) |
| `drivePassword` | expression | Password to set on the access token (`setPassword` only) |
| `driveTtlHours` | number | Hours until the download link expires (`setTtl` only) |
| `driveMaxDownloads` | number | Maximum allowed downloads (`setMaxDownloads` only) |

## Faili ID hankimine

Kui skill genereerib faile, sisaldab väljund `_generated_files` massiivi. Iga kirje sisaldab välja `id`:

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

Viidake faili ID-le järgmiselt: `$agentLabel._generated_files[0].id`

## Operatsioonid

| Operation | Required Fields | Description |
|-----------|----------------|-------------|
| `get` | driveFileId | Retrieve file metadata (and optionally binary content) from Drive |
| `getAll` | none | List owned and team-shared readable Drive files with metadata such as filename, MIME type, size, source, and download URL |
| `downloadUrl` | driveSourceUrl | Fetch a file from an external URL and store it in Drive |
| `save` | driveFilename, driveBase64Content | Decode base64 content and store it as a Drive file |
| `delete` | driveFileId | Delete the file and all its access tokens from disk and database |
| `setPassword` | driveFileId, drivePassword | Replace the default public token with a password-protected one |
| `setTtl` | driveFileId, driveTtlHours | Replace the default public token with one that expires after N hours |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Replace the default public token with one limited to N downloads |
| `shareWithMyTeams` | driveFileId | Share the file read-only with all teams the workflow owner currently belongs to |
| `unshareWithMyTeams` | driveFileId | Remove all team shares from the file |

> **Märkus:** operatsioonid `set*` kustutavad vaikimisi (piiranguteta) avaliku tokeni ja loovad uue määratud piiranguga. Uuendatud `download_url` sisaldub väljundis.
> **Meeskonnaga jagamine:** `shareWithMyTeams` loob otsesed jagamised omaniku praegustele meeskondadele. Tulevasi meeskondi ei lisata automaatselt, välja arvatud juhul, kui operatsioon käivitatakse uuesti. `unshareWithMyTeams` eemaldab faililt kõik meeskondadega jagamised.

## Näide — faili allalaadimine URL-ilt

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

Viidake salvestatud failile allavoolu: `$fetchReport.id`, `$fetchReport.download_url`

Failinimi võetakse `Content-Disposition` vastuse päisest; kui see puudub, tuletatakse see URL-i teest.

## Näide — base64-sisendi salvestamine Drive'i

Kasutage seda, kui tekstisisendi node (või mõni ülesvoolu node) pakub base64-faili sisu:

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

Viidake salvestatud failile allavoolu: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` aktsepteerib töötlemata base64-stringi või `data:...;base64,...` data URL-i. MIME-tüüp tuletatakse failinime laiendist.

## Näide — faili toomine ja binaarse sisu kasutamine Vision LLM-is

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

Viidake base64-sisule allavoolu: `$fetchImage.file_base64`

Pildid, mis tagastatakse `file_base64` kaudu, kuvatakse silumispaneelis reasiseselt, kui workflow käivitate.

## Näide — Drive'i failide loetlemine

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

Viidake esimesele tagastatud failile allavoolu: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Näide — Faili kustutamine pärast töötlemist

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

## Näide — Parooli seadmine loodud failile

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

## Näide — Aegumise seadmine (TTL)

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

## Näide — Allalaadimiste piiramine

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

## Näide — Jagamine minu tiimidega

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

Tiimiliikmed saavad faili Drive'ist vaadata ja alla laadida ning kasutada workflow'des lugemisoperatsioone. Nad ei saa faili kustutada, uuesti jagada ega muuta avaliku lingi piiranguid.

## Näide — Jagamise lõpetamine minu tiimidega

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

## Faili teisendamine

Vormingu teisendamine kolis [Converter](./converter-node.md) sõlme. Salvestage või hankige fail Drive'iga ning andke seejärel selle id converter-sõlmele:

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

Originaalfail säilitatakse ja teisendatud fail salvestatakse uue Drive-failina.

## Väljundi juurdepääs

**get:**
- `$nodeLabel.id` — faili UUID
- `$nodeLabel.filename` — faili nimi
- `$nodeLabel.mime_type` — MIME-tüüp (nt `image/png`)
- `$nodeLabel.size_bytes` — faili suurus baitides
- `$nodeLabel.download_url` — avalik allalaadimise URL
- `$nodeLabel.file_base64` — base64-kodeeritud faili sisu (ainult siis, kui **Include binary content** on lubatud)

**getAll:**
- `$nodeLabel.files` — faili metaandmete objektide massiiv
- `$nodeLabel.count` — tagastatud failide arv
- `$nodeLabel.files[0].id` — faili UUID
- `$nodeLabel.files[0].filename` — faili nimi
- `$nodeLabel.files[0].mime_type` — MIME-tüüp
- `$nodeLabel.files[0].size_bytes` — faili suurus baitides
- `$nodeLabel.files[0].download_url` — avalik allalaadimise URL, kui avalik token on olemas
- `$nodeLabel.files[0].metadata` — salvestatud metaandmete objekt
- `$nodeLabel.files[0].created_at` — faili loomise ajatempel

**downloadUrl:**
- `$nodeLabel.id` — äsja salvestatud faili UUID
- `$nodeLabel.filename` — faili nimi (pärit `Content-Disposition`-ist või URL-i teest)
- `$nodeLabel.mime_type` — MIME-tüüp, tuvastatud vastusest või faililaiendist
- `$nodeLabel.size_bytes` — faili suurus baitides
- `$nodeLabel.download_url` — salvestatud faili Drive'i allalaadimise URL

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — kustutatud faili UUID

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — faili UUID
- `$nodeLabel.download_url` — uus juurdepääsu tokeni URL koos rakendatud piiranguga

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — faili UUID
- `$nodeLabel.shared_team_count` — tiimijagamiste arv pärast operatsiooni

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — faili UUID
- `$nodeLabel.shared_team_count` — `0` pärast operatsiooni

## Omandiõigus

Ainult omanikule mõeldud operatsioonid nõuavad, et fail kuuluks workflow omanikule. Lugemisoperatsioonid (`get`, `getAll`) pääsevad juurde ka failidele, mis on workflow omanikuga tiimi kaudu jagatud.

## Seotud

- [Faili genereerimine](../reference/file-generation.md) – Kuidas skillid faile genereerivad ja `_generated_files` väljund
- [Drive'i vahekaart](../reference/drive.md) – Visuaalne failihaldus juhtpaneelil
- [Agent Node](./agent-node.md) – Käivitab skille, mis genereerivad faile
- [Converter Node](./converter-node.md) – Salvestatud faili teisendamine teise vormingusse või OCR-iga tekstiks
- [Expression DSL](../reference/expression-dsl.md) – Avaldise süntaks dünaamiliste väärtuste jaoks
