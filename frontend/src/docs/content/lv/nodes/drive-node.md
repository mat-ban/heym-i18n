# Drive mezgls

**Drive** mezgls pārvalda failus, ko ģenerējušas prasmes, tieši workflow ietvaros. Izmantojiet to, lai programmatiski iegūtu failus, lejupielādētu failus no ārējiem URL, dzēstu tos, kopīgotu vai pārtrauktu kopīgošanu ar Jūsu komandām vai atjauninātu to piekļuves ierobežojumus (parole, derīguma termiņš, lejupielādes limits).

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (atkarīgs no operācijas) |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `driveOperation` | string | Operācija: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | Pārvaldāmā Drive faila UUID (visām operācijām, izņemot `getAll`, `downloadUrl` un `save`) |
| `driveLimit` | number | Maksimālais atgriežamo failu skaits (tikai `getAll`; tukšs nozīmē bez ierobežojuma) |
| `driveSourceUrl` | expression | URL, ko iegūt un saglabāt Drive (tikai `downloadUrl`) |
| `driveFilename` | expression | Pilns faila nosaukums ar paplašinājumu (tikai `save`, piem., `1.mp3`) |
| `driveBase64Content` | expression | Neapstrādāta base64 virkne vai data URL, ko dekodēt un saglabāt (tikai `save`) |
| `driveIncludeBinary` | boolean | Iekļaut faila saturu kā base64 izvadē (tikai `get`) |
| `drivePassword` | expression | Parole, ko iestatīt piekļuves token (tikai `setPassword`) |
| `driveTtlHours` | number | Stundas līdz lejupielādes saites derīguma termiņa beigām (tikai `setTtl`) |
| `driveMaxDownloads` | number | Maksimālais atļautais lejupielāžu skaits (tikai `setMaxDownloads`) |

## Faila ID iegūšana

Kad prasme ģenerē failus, izvade ietver `_generated_files` masīvu. Katrs ieraksts satur `id` lauku:

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

Atsaucieties uz faila ID šādi: `$agentLabel._generated_files[0].id`

## Operācijas

| Operācija | Nepieciešamie lauki | Apraksts |
|-----------|----------------|-------------|
| `get` | driveFileId | Iegūt faila metadatus (un pēc izvēles bināro saturu) no Drive |
| `getAll` | nav | Uzskaitīt īpašumā esošos un ar komandu kopīgotos lasāmos Drive failus ar metadatiem, piemēram, faila nosaukumu, MIME tipu, izmēru, avotu un lejupielādes URL |
| `downloadUrl` | driveSourceUrl | Iegūt failu no ārēja URL un saglabāt to Drive |
| `save` | driveFilename, driveBase64Content | Dekodēt base64 saturu un saglabāt to kā Drive failu |
| `delete` | driveFileId | Dzēst failu un visus tā piekļuves token no diska un datubāzes |
| `setPassword` | driveFileId, drivePassword | Aizstāt noklusējuma publisko token ar paroli aizsargātu token |
| `setTtl` | driveFileId, driveTtlHours | Aizstāt noklusējuma publisko token ar tādu, kura derīguma termiņš beidzas pēc N stundām |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Aizstāt noklusējuma publisko token ar tādu, kas ierobežots līdz N lejupielādēm |
| `shareWithMyTeams` | driveFileId | Kopīgot failu tikai lasīšanas režīmā ar visām komandām, kurās workflow īpašnieks pašlaik darbojas |
| `unshareWithMyTeams` | driveFileId | Noņemt visas komandas kopīgošanas no faila |

> **Piezīme:** Operācijas `set*` dzēš noklusējuma (bez ierobežojumiem) publisko token un izveido jaunu ar norādīto ierobežojumu. Atjauninātais `download_url` tiek iekļauts izvadē.
> **Komandas kopīgošana:** `shareWithMyTeams` izveido skaidras kopīgošanas īpašnieka pašreizējām komandām. Nākotnes komandas netiek pievienotas automātiski, ja vien operācija netiek palaista vēlreiz. `unshareWithMyTeams` noņem visas komandas kopīgošanas no faila.

## Piemērs — faila lejupielāde no URL

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

Atsaucieties uz saglabāto failu tālāk plūsmā: `$fetchReport.id`, `$fetchReport.download_url`

Faila nosaukums tiek ņemts no `Content-Disposition` atbildes galvenes; ja tā nav, tas tiek atvasināts no URL ceļa.

## Piemērs — base64 ievades saglabāšana Drive

Izmantojiet šo, ja teksta ievades mezgls (vai jebkurš augšupējais mezgls) nodrošina base64 faila saturu:

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

Atsaucieties uz saglabāto failu tālāk plūsmā: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` pieņem neapstrādātu base64 virkni vai `data:...;base64,...` data URL. MIME tips tiek noteikts no faila nosaukuma paplašinājuma.

## Piemērs — faila iegūšana un binārā satura izmantošana Vision LLM

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

Atsaucieties uz base64 saturu tālāk plūsmā: `$fetchImage.file_base64`

Attēli, kas atgriezti, izmantojot `file_base64`, tiek parādīti iekļauti atkļūdošanas panelī, kad Jūs palaižat workflow.

## Piemērs — Drive failu uzskaitīšana

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

Atsaucieties uz pirmo atgriezto failu tālāk plūsmā: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Piemērs — Dzēst failu pēc apstrādes

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

## Piemērs — Iestatīt paroli ģenerētajam failam

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

## Piemērs — Iestatīt derīguma termiņu (TTL)

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

## Piemērs — Ierobežot lejupielādes

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

## Piemērs — Kopīgot ar manām komandām

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

Komandas dalībnieki var skatīt un lejupielādēt failu no Drive un izmantot lasīšanas darbības workflow. Viņi nevar dzēst, atkārtoti kopīgot vai mainīt publiskās saites ierobežojumus.

## Piemērs — Atcelt kopīgošanu ar manām komandām

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

## Faila konvertēšana

Formāta konvertēšana ir pārvietota uz [Converter](./converter-node.md) mezglu. Saglabājiet vai iegūstiet failu ar Drive, pēc tam nododiet tā id converter mezglam:

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

Oriģinālais fails tiek saglabāts, un konvertētais fails tiek saglabāts kā jauns Drive fails.

## Izvades piekļuve

**get:**
- `$nodeLabel.id` — faila UUID
- `$nodeLabel.filename` — faila nosaukums
- `$nodeLabel.mime_type` — MIME tips (piem., `image/png`)
- `$nodeLabel.size_bytes` — faila izmērs baitos
- `$nodeLabel.download_url` — publiskā lejupielādes URL
- `$nodeLabel.file_base64` — base64 kodēts faila saturs (tikai tad, ja ir iespējota opcija **Include binary content**)

**getAll:**
- `$nodeLabel.files` — faila metadatu objektu masīvs
- `$nodeLabel.count` — atgriezto failu skaits
- `$nodeLabel.files[0].id` — faila UUID
- `$nodeLabel.files[0].filename` — faila nosaukums
- `$nodeLabel.files[0].mime_type` — MIME tips
- `$nodeLabel.files[0].size_bytes` — faila izmērs baitos
- `$nodeLabel.files[0].download_url` — publiskā lejupielādes URL, ja pastāv publiskais token
- `$nodeLabel.files[0].metadata` — saglabātais metadatu objekts
- `$nodeLabel.files[0].created_at` — faila izveides laika zīmogs

**downloadUrl:**
- `$nodeLabel.id` — jaunizveidotā faila UUID
- `$nodeLabel.filename` — faila nosaukums (no `Content-Disposition` vai URL ceļa)
- `$nodeLabel.mime_type` — MIME tips, kas noteikts no atbildes vai faila paplašinājuma
- `$nodeLabel.size_bytes` — faila izmērs baitos
- `$nodeLabel.download_url` — Drive lejupielādes URL saglabātajam failam

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — izdzēstā faila UUID

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — faila UUID
- `$nodeLabel.download_url` — jauns piekļuves token URL ar piemēroto ierobežojumu

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — faila UUID
- `$nodeLabel.shared_team_count` — komandu kopīgojumu skaits pēc darbības

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — faila UUID
- `$nodeLabel.shared_team_count` — `0` pēc darbības

## Īpašumtiesības

Darbības, kas pieejamas tikai īpašniekam, prasa, lai fails piederētu workflow īpašniekam. Lasīšanas darbības (`get`, `getAll`) var arī piekļūt failiem, kas kopīgoti ar workflow īpašnieku komandas ietvaros.

## Saistītie resursi

- [File Generation](../reference/file-generation.md) - Kā skills ģenerē failus un `_generated_files` izvade
- [Drive Tab](../reference/drive.md) - Vizuāla failu pārvaldība dashboard
- [Agent Node](./agent-node.md) - Palaidž skills, kas ģenerē failus
- [Converter Node](./converter-node.md) - Konvertējiet saglabāto failu citā formātā vai veiciet OCR uz tekstu
- [Expression DSL](../reference/expression-dsl.md) - Izteiksmju sintakse dinamiskām vērtībām
