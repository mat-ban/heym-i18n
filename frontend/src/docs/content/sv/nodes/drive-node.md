# Drive-nod

**Drive**-noden hanterar filer som genereras av skills direkt inifrån en workflow. Den används för att hämta filer, ladda ner filer från externa URL:er, ta bort dem, dela eller sluta dela dem med team, eller uppdatera deras åtkomstbegränsningar (lösenord, utgång, nedladdningsgräns) programmatiskt.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (varierar beroende på operation) |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `driveOperation` | string | Operation: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID för Drive-filen som ska hanteras (alla operationer utom `getAll`, `downloadUrl` och `save`) |
| `driveLimit` | number | Maximalt antal filer att returnera (endast `getAll`; tomt innebär ingen gräns) |
| `driveSourceUrl` | expression | URL att hämta och lagra i Drive (endast `downloadUrl`) |
| `driveFilename` | expression | Fullständigt filnamn inklusive filändelse (endast `save`, t.ex. `1.mp3`) |
| `driveBase64Content` | expression | Rå base64-sträng eller data-URL att avkoda och lagra (endast `save`) |
| `driveIncludeBinary` | boolean | Inkludera filinnehåll som base64 i utdata (endast `get`) |
| `drivePassword` | expression | Lösenord att ange på åtkomsttoken (endast `setPassword`) |
| `driveTtlHours` | number | Antal timmar tills nedladdningslänken upphör (endast `setTtl`) |
| `driveMaxDownloads` | number | Maximalt tillåtna nedladdningar (endast `setMaxDownloads`) |

## Hämta fil-ID

När en skill genererar filer innehåller utdata en `_generated_files`-array. Varje post innehåller ett `id`-fält:

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

Referera till fil-ID:t med: `$agentLabel._generated_files[0].id`

## Operationer

| Operation | Obligatoriska fält | Beskrivning |
|-----------|----------------|-------------|
| `get` | driveFileId | Hämta filmetadata (och eventuellt binärt innehåll) från Drive |
| `getAll` | inga | Lista ägda och teamdelade läsbara Drive-filer med metadata såsom filnamn, MIME-typ, storlek, källa och nedladdnings-URL |
| `downloadUrl` | driveSourceUrl | Hämta en fil från en extern URL och lagra den i Drive |
| `save` | driveFilename, driveBase64Content | Avkoda base64-innehåll och lagra det som en Drive-fil |
| `delete` | driveFileId | Ta bort filen och alla dess åtkomsttoken från disk och databas |
| `setPassword` | driveFileId, drivePassword | Ersätt standardtoken för offentlig åtkomst med en lösenordsskyddad |
| `setTtl` | driveFileId, driveTtlHours | Ersätt standardtoken för offentlig åtkomst med en som upphör efter N timmar |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Ersätt standardtoken för offentlig åtkomst med en som är begränsad till N nedladdningar |
| `shareWithMyTeams` | driveFileId | Dela filen skrivskyddat med alla team som workflow-ägaren för närvarande tillhör |
| `unshareWithMyTeams` | driveFileId | Ta bort alla teamdelningar från filen |

> **Obs:** `set*`-operationerna tar bort standardtoken för offentlig åtkomst (utan begränsning) och skapar en ny med den angivna begränsningen. Den uppdaterade `download_url` inkluderas i utdata.
> **Teamdelning:** `shareWithMyTeams` skapar explicita delningar för ägarens nuvarande team. Framtida team läggs inte till automatiskt om inte operationen körs igen. `unshareWithMyTeams` tar bort alla teamdelningar från filen.

## Exempel — Ladda ner fil från URL

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

Referera till den lagrade filen nedströms: `$fetchReport.id`, `$fetchReport.download_url`

Filnamnet hämtas från svarshuvudet `Content-Disposition`; om det saknas härleds det från URL-sökvägen.

## Exempel — Spara base64-indata till Drive

Använd detta när en textinmatningsnod (eller någon uppströmsnod) tillhandahåller base64-filinnehåll:

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

Referera till den lagrade filen nedströms: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` accepterar en rå base64-sträng eller en `data:...;base64,...`-data-URL. MIME-typ härleds från filnamnets ändelse.

## Exempel — Hämta fil och använd binärt innehåll i Vision LLM

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

Referera till base64-innehållet nedströms: `$fetchImage.file_base64`

Bilder som returneras via `file_base64` visas inline i felsökningspanelen när workflowet körs.

## Exempel — Lista Drive-filer

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

Referera till den första returnerade filen nedströms: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Exempel — Ta bort fil efter bearbetning

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

## Exempel — Ange lösenord för genererad fil

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

## Exempel — Ange utgångstid (TTL)

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

## Exempel — Begränsa antalet nedladdningar

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

## Exempel — Dela med Mina team

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

Teammedlemmar kan visa och ladda ned filen från Drive samt använda läsoperationer i workflows. De kan inte ta bort, dela vidare eller ändra begränsningar för den publika länken.

## Exempel — Sluta dela med Mina team

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

## Konvertera en fil

Formatkonvertering har flyttats till noden [Converter](./converter-node.md). Lagra eller hämta filen med Drive och skicka sedan dess id till en converter-nod:

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

Originalfilen bevaras och den konverterade filen lagras som en ny Drive-fil.

## Åtkomst till utdata

**get:**
- `$nodeLabel.id` — filens UUID
- `$nodeLabel.filename` — filnamn
- `$nodeLabel.mime_type` — MIME-typ (t.ex. `image/png`)
- `$nodeLabel.size_bytes` — filstorlek i byte
- `$nodeLabel.download_url` — publik nedladdnings-URL
- `$nodeLabel.file_base64` — base64-kodat filinnehåll (endast när **Include binary content** är aktiverat)

**getAll:**
- `$nodeLabel.files` — Array med objekt för filmetadata
- `$nodeLabel.count` — Antal returnerade filer
- `$nodeLabel.files[0].id` — filens UUID
- `$nodeLabel.files[0].filename` — Filnamn
- `$nodeLabel.files[0].mime_type` — MIME-typ
- `$nodeLabel.files[0].size_bytes` — Filstorlek i byte
- `$nodeLabel.files[0].download_url` — Publik nedladdnings-URL när en publik token finns
- `$nodeLabel.files[0].metadata` — Lagrat metadataobjekt
- `$nodeLabel.files[0].created_at` — Tidsstämpel för filens skapande

**downloadUrl:**
- `$nodeLabel.id` — UUID för den nyligen lagrade filen
- `$nodeLabel.filename` — filnamn (från `Content-Disposition` eller URL-sökväg)
- `$nodeLabel.mime_type` — MIME-typ som identifierats från svaret eller filändelsen
- `$nodeLabel.size_bytes` — filstorlek i byte
- `$nodeLabel.download_url` — Drive-nedladdnings-URL för den lagrade filen

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID för den borttagna filen

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — filens UUID
- `$nodeLabel.download_url` — Ny åtkomsttoken-URL med begränsningen tillämpad

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — filens UUID
- `$nodeLabel.shared_team_count` — Antal teamdelningar efter operationen

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — filens UUID
- `$nodeLabel.shared_team_count` — `0` efter operationen

## Ägarskap

Operationer som endast är tillgängliga för ägaren kräver att filen tillhör workflowets ägare. Läsoperationer (`get`, `getAll`) kan även komma åt filer som delats med workflowets ägare via ett team.

## Relaterat

- [File Generation](../reference/file-generation.md) - Hur skills genererar filer och utdata `_generated_files`
- [Drive Tab](../reference/drive.md) - Visuell filhantering i instrumentpanelen
- [Agent Node](./agent-node.md) - Kör skills som genererar filer
- [Converter Node](./converter-node.md) - Konvertera en lagrad fil till ett annat format, eller OCR:a den till text
- [Expression DSL](../reference/expression-dsl.md) - Uttryckssyntax för dynamiska värden
