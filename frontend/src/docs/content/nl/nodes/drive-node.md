# Drive-node

De **Drive**-node beheert bestanden die door skills zijn gegenereerd, rechtstreeks vanuit een workflow. Gebruik deze om bestanden op te halen, bestanden van externe URL's te downloaden, ze te verwijderen, ze te delen of het delen ongedaan te maken met uw teams, of om hun toegangsbeperkingen (wachtwoord, vervaldatum, downloadlimiet) programmatisch bij te werken.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (varieert per bewerking) |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `driveOperation` | string | Bewerking: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID van het Drive-bestand dat moet worden beheerd (alle bewerkingen behalve `getAll`, `downloadUrl` en `save`) |
| `driveLimit` | number | Maximaal aantal bestanden dat moet worden geretourneerd (alleen `getAll`; leeg betekent geen limiet) |
| `driveSourceUrl` | expression | URL om op te halen en op te slaan in Drive (alleen `downloadUrl`) |
| `driveFilename` | expression | Volledige bestandsnaam inclusief extensie (alleen `save`, bijv. `1.mp3`) |
| `driveBase64Content` | expression | Onbewerkte base64-string of data-URL om te decoderen en op te slaan (alleen `save`) |
| `driveIncludeBinary` | boolean | Bestandsinhoud als base64 opnemen in de uitvoer (alleen `get`) |
| `drivePassword` | expression | Wachtwoord om in te stellen op het toegangstoken (alleen `setPassword`) |
| `driveTtlHours` | number | Uren totdat de downloadlink verloopt (alleen `setTtl`) |
| `driveMaxDownloads` | number | Maximaal toegestane downloads (alleen `setMaxDownloads`) |

## Het bestands-ID ophalen

Wanneer een skill bestanden genereert, bevat de uitvoer een `_generated_files`-array. Elke vermelding bevat een `id`-veld:

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

Verwijs naar het bestands-ID met: `$agentLabel._generated_files[0].id`

## Bewerkingen

| Bewerking | Vereiste velden | Beschrijving |
|-----------|----------------|-------------|
| `get` | driveFileId | Haal bestandsmetadata (en optioneel binaire inhoud) op uit Drive |
| `getAll` | geen | Geef een lijst weer van eigen en met teams gedeelde leesbare Drive-bestanden met metadata zoals bestandsnaam, MIME-type, grootte, bron en download-URL |
| `downloadUrl` | driveSourceUrl | Haal een bestand op van een externe URL en sla het op in Drive |
| `save` | driveFilename, driveBase64Content | Decodeer base64-inhoud en sla het op als een Drive-bestand |
| `delete` | driveFileId | Verwijder het bestand en al zijn toegangstokens van schijf en uit de database |
| `setPassword` | driveFileId, drivePassword | Vervang het standaard openbare token door een met wachtwoord beveiligd token |
| `setTtl` | driveFileId, driveTtlHours | Vervang het standaard openbare token door een token dat na N uur verloopt |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Vervang het standaard openbare token door een token dat is beperkt tot N downloads |
| `shareWithMyTeams` | driveFileId | Deel het bestand alleen-lezen met alle teams waartoe de workflow-eigenaar momenteel behoort |
| `unshareWithMyTeams` | driveFileId | Verwijder alle team-shares van het bestand |

> **Opmerking:** De `set*`-bewerkingen verwijderen het standaard (ongelimiteerde) openbare token en maken een nieuw token met de opgegeven beperking. De bijgewerkte `download_url` is opgenomen in de uitvoer.
> **Team-deling:** `shareWithMyTeams` maakt expliciete shares aan voor de huidige teams van de eigenaar. Toekomstige teams worden niet automatisch toegevoegd, tenzij de bewerking opnieuw wordt uitgevoerd. `unshareWithMyTeams` verwijdert alle team-shares van het bestand.

## Voorbeeld — Bestand downloaden van URL

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

Verwijs stroomafwaarts naar het opgeslagen bestand: `$fetchReport.id`, `$fetchReport.download_url`

De bestandsnaam wordt overgenomen uit de `Content-Disposition`-responsheader; indien deze ontbreekt, wordt deze afgeleid van het URL-pad.

## Voorbeeld — Base64-invoer opslaan in Drive

Gebruik dit wanneer een tekstinvoer-node (of een andere stroomopwaartse node) base64-bestandsinhoud levert:

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

Verwijs stroomafwaarts naar het opgeslagen bestand: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` accepteert een onbewerkte base64-string of een `data:...;base64,...` data-URL. Het MIME-type wordt afgeleid van de bestandsextensie.

## Voorbeeld — Bestand ophalen en binaire inhoud gebruiken in Vision LLM

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

Verwijs stroomafwaarts naar de base64-inhoud: `$fetchImage.file_base64`

Afbeeldingen die via `file_base64` worden geretourneerd, worden inline weergegeven in het debug-paneel wanneer u de workflow uitvoert.

## Voorbeeld — Drive-bestanden weergeven

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

Verwijs stroomafwaarts naar het eerste geretourneerde bestand: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Voorbeeld — Bestand verwijderen na verwerking

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

## Voorbeeld — Wachtwoord instellen op gegenereerd bestand

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

## Voorbeeld — Vervaldatum instellen (TTL)

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

## Voorbeeld — Downloads beperken

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

## Voorbeeld — Delen met mijn teams

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

Teamleden kunnen het bestand bekijken en downloaden vanuit Drive en leesbewerkingen gebruiken in workflows. Zij kunnen het bestand niet verwijderen, opnieuw delen of de beperkingen van de openbare link wijzigen.

## Voorbeeld — Delen met mijn teams ongedaan maken

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

## Een bestand converteren

Formaatconversie is verplaatst naar de [Converter](./converter-node.md)-node. Sla het bestand op met Drive of haal het op, en geef vervolgens de id door aan een converter-node:

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

Het oorspronkelijke bestand blijft behouden en het geconverteerde bestand wordt opgeslagen als een nieuw Drive-bestand.

## Uitvoer-toegang

**get:**
- `$nodeLabel.id` — UUID van het bestand
- `$nodeLabel.filename` — bestandsnaam
- `$nodeLabel.mime_type` — MIME-type (bijv. `image/png`)
- `$nodeLabel.size_bytes` — bestandsgrootte in bytes
- `$nodeLabel.download_url` — openbare download-URL
- `$nodeLabel.file_base64` — base64-gecodeerde bestandsinhoud (alleen wanneer **Include binary content** is ingeschakeld)

**getAll:**
- `$nodeLabel.files` — Array van metadata-objecten van bestanden
- `$nodeLabel.count` — Aantal geretourneerde bestanden
- `$nodeLabel.files[0].id` — UUID van het bestand
- `$nodeLabel.files[0].filename` — Bestandsnaam
- `$nodeLabel.files[0].mime_type` — MIME-type
- `$nodeLabel.files[0].size_bytes` — Bestandsgrootte in bytes
- `$nodeLabel.files[0].download_url` — Openbare download-URL wanneer een openbaar token bestaat
- `$nodeLabel.files[0].metadata` — Opgeslagen metadata-object
- `$nodeLabel.files[0].created_at` — Tijdstempel van bestandsaanmaak

**downloadUrl:**
- `$nodeLabel.id` — UUID van het nieuw opgeslagen bestand
- `$nodeLabel.filename` — bestandsnaam (uit `Content-Disposition` of URL-pad)
- `$nodeLabel.mime_type` — MIME-type gedetecteerd uit het antwoord of de bestandsextensie
- `$nodeLabel.size_bytes` — bestandsgrootte in bytes
- `$nodeLabel.download_url` — Drive download-URL voor het opgeslagen bestand

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID van het verwijderde bestand

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID van het bestand
- `$nodeLabel.download_url` — Nieuwe toegangstoken-URL met de toegepaste beperking

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID van het bestand
- `$nodeLabel.shared_team_count` — Aantal team-shares na de bewerking

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID van het bestand
- `$nodeLabel.shared_team_count` — `0` na de bewerking

## Eigendom

Bewerkingen die alleen voor de eigenaar zijn, vereisen dat het bestand toebehoort aan de workflow-eigenaar. Leesbewerkingen (`get`, `getAll`) kunnen ook bestanden benaderen die met de workflow-eigenaar zijn gedeeld via een team.

## Gerelateerd

- [Bestandsgeneratie](../reference/file-generation.md) - Hoe skills bestanden genereren en de `_generated_files`-uitvoer
- [Drive-tab](../reference/drive.md) - Visueel bestandsbeheer in het dashboard
- [Agent-node](./agent-node.md) - Voert skills uit die bestanden genereren
- [Converter-node](./converter-node.md) - Converteer een opgeslagen bestand naar een ander formaat, of OCR het naar tekst
- [Expression DSL](../reference/expression-dsl.md) - Expressiesyntaxis voor dynamische waarden
