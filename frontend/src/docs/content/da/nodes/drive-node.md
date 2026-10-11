# Drive Node

**Drive**-noden håndterer filer, der genereres af skills, direkte fra et workflow. Den kan bruges til at hente filer, downloade filer fra eksterne URL'er, slette dem, dele eller fjerne deling med teams eller opdatere deres adgangsbegrænsninger (adgangskode, udløbstidspunkt, downloadgrænse) programmatisk.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (varierer efter operation) |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `driveOperation` | string | Operation: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID for Drive-filen, der skal håndteres (alle operationer undtagen `getAll`, `downloadUrl` og `save`) |
| `driveLimit` | number | Maksimalt antal filer, der returneres (`getAll` kun; tom betyder ingen grænse) |
| `driveSourceUrl` | expression | URL, der skal hentes og gemmes i Drive (`downloadUrl` kun) |
| `driveFilename` | expression | Fuldt filnavn inklusive extension (`save` kun, f.eks. `1.mp3`) |
| `driveBase64Content` | expression | Rå base64-streng eller data-URL, der skal afkodes og gemmes (`save` kun) |
| `driveIncludeBinary` | boolean | Inkluder filindhold som base64 i output (`get` kun) |
| `drivePassword` | expression | Adgangskode, der skal sættes på adgangstoken (`setPassword` kun) |
| `driveTtlHours` | number | Timer, indtil downloadlinket udløber (`setTtl` kun) |
| `driveMaxDownloads` | number | Maksimalt tilladte downloads (`setMaxDownloads` kun) |

## Hente fil-ID

Når en skill genererer filer, indeholder outputtet en `_generated_files`-array. Hver post indeholder et `id`-felt:

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

Referer til fil-ID'et med: `$agentLabel._generated_files[0].id`

## Operationer

| Operation | Påkrævede felter | Beskrivelse |
|-----------|----------------|-------------|
| `get` | driveFileId | Hent filmetadata (og valgfrit binært indhold) fra Drive |
| `getAll` | ingen | List egnede og team-delte læsbare Drive-filer med metadata som filnavn, MIME-type, størrelse, kilde og download-URL |
| `downloadUrl` | driveSourceUrl | Hent en fil fra en ekstern URL og gem den i Drive |
| `save` | driveFilename, driveBase64Content | Afkod base64-indhold og gem det som en Drive-fil |
| `delete` | driveFileId | Slet filen og alle dens adgangstokens fra disk og database |
| `setPassword` | driveFileId, drivePassword | Erstat standard-token med et adgangskodebeskyttet token |
| `setTtl` | driveFileId, driveTtlHours | Erstat standard-token med et, der udløber efter N timer |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Erstat standard-token med et begrænset til N downloads |
| `shareWithMyTeams` | driveFileId | Del filen skrivebeskyttet med alle teams, workflow-ejeren i øjeblikket tilhører |
| `unshareWithMyTeams` | driveFileId | Fjern alle team-delinger fra filen |

> **Bemærk:** `set*`-operationerne sletter standard-tokenet (uden begrænsninger) og opretter et nyt med den angivne begrænsning. Den opdaterede `download_url` inkluderes i outputtet.
> **Team-deling:** `shareWithMyTeams` opretter eksplicitte delinger for ejerens nuværende teams. Fremtidige teams tilføjes ikke automatisk, medmindre operationen køres igen. `unshareWithMyTeams` fjerner alle team-delinger fra filen.

## Eksempel — Download fil fra URL

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

Referer til den gemte fil nedstrøms: `$fetchReport.id`, `$fetchReport.download_url`

Filnavnet hentes fra `Content-Disposition`-responsheaderen; hvis det ikke findes, afledes det fra URL-stien.

## Eksempel — Gem base64-input i Drive

Bruges, når en tekst-input-node (eller en hvilken som helst upstream-node) leverer base64-filindhold:

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

Referer til den gemte fil nedstrøms: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` accepterer en rå base64-streng eller en `data:...;base64,...` data-URL. MIME-type udledes fra filnavnets extension.

## Eksempel — Hent fil og brug binært indhold i Vision LLM

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

Referer til base64-indholdet nedstrøms: `$fetchImage.file_base64`

Billeder returneret via `file_base64` vises inline i debug-panelet, når workflowet køres.

## Eksempel — List Drive-filer

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

Referer til den første returnerede fil nedstrøms: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Eksempel — Slet fil efter behandling

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

## Eksempel — Angiv adgangskode til genereret fil

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

## Eksempel — Angiv udløbstid (TTL)

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

## Eksempel — Begræns downloads

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

## Eksempel — Del med teams

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

Team-medlemmer kan se og downloade filen fra Drive og bruge læseoperationer i workflows. De kan ikke slette, gen-dele eller ændre offentlige link-begrænsninger.

## Eksempel — Fjern deling fra teams

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

## Konvertering af fil

Filkonvertering er flyttet til [Converter](./converter-node.md)-noden. Gem eller hent filen med Drive, og overfør derefter dens id til en converter-node:

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

Den originale fil bevares, og den konverterede fil gemmes som en ny Drive-fil.

## Output-adgang

**get:**
- `$nodeLabel.id` — Filens UUID
- `$nodeLabel.filename` — Filnavn
- `$nodeLabel.mime_type` — MIME-type (f.eks. `image/png`)
- `$nodeLabel.size_bytes` — Filstørrelse i bytes
- `$nodeLabel.download_url` — Offentlig download-URL
- `$nodeLabel.file_base64` — Base64-kodet filindhold (kun når **Inkluder binært indhold** er aktiveret)

**getAll:**
- `$nodeLabel.files` — Array af filmetadata-objekter
- `$nodeLabel.count` — Antal returnerede filer
- `$nodeLabel.files[0].id` — Filens UUID
- `$nodeLabel.files[0].filename` — Filnavn
- `$nodeLabel.files[0].mime_type` — MIME-type
- `$nodeLabel.files[0].size_bytes` — Filstørrelse i bytes
- `$nodeLabel.files[0].download_url` — Offentlig download-URL når der findes et offentligt token
- `$nodeLabel.files[0].metadata` — Gemt metadata-objekt
- `$nodeLabel.files[0].created_at` — Oprettelsestidsstempel for fil

**downloadUrl:**
- `$nodeLabel.id` — UUID for den nygemte fil
- `$nodeLabel.filename` — Filnavn (fra `Content-Disposition` eller URL-sti)
- `$nodeLabel.mime_type` — MIME-type detekteret fra responsen eller filendelse
- `$nodeLabel.size_bytes` — Filstørrelse i bytes
- `$nodeLabel.download_url` — Drive download-URL for den gemte fil

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID for den slettede fil

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — Filens UUID
- `$nodeLabel.download_url` — Ny access token-URL med den anvendte begrænsning

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — Filens UUID
- `$nodeLabel.shared_team_count` — Antal team-delinger efter operationen

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — Filens UUID
- `$nodeLabel.shared_team_count` — `0` efter operationen

## Ejerskab

Ejerspecifikke operationer kræver, at filen tilhører workflow-ejeren. Læseoperationer (`get`, `getAll`) kan også tilgå filer, der er delt med workflow-ejeren via et team.

## Relateret

- [Filgenerering](../reference/file-generation.md) - Hvordan skills genererer filer og `_generated_files`-output
- [Drive-fanen](../reference/drive.md) - Visuel filhåndtering i dashboardet
- [Agent-node](./agent-node.md) - Kører skills, der genererer filer
- [Converter-node](./converter-node.md) - Konverter en gemt fil til et andet format eller OCR den til tekst
- [Expression DSL](../reference/expression-dsl.md) - Udtrykssyntaks for dynamiske værdier
