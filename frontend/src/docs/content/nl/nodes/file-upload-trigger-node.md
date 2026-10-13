# File Upload Trigger

De **File Upload Trigger**-node is een zero-input entry point voor workflows die een **groot bestand** (audio, video, archieven) nodig hebben dat niet als base64 in een JSON-request kan worden ingebed. Het aanroepen van de workflow retourneert een vooraf ingevulde, eenmalig bruikbare `curl`-uploadlink; het uploaden van een bestand naar die link start de uitvoering met het bestand als bijlage.

Gebruik deze wanneer een aanroeper — inclusief een AI-agent zoals Claude of ChatGPT die in een sandbox draait — een spraakopname van 20 MB of een video van 75 MB aan een Heym-workflow moet overdragen.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Hoe het werkt

De node werkt in twee fasen:

1. **Aanmaken.** Wanneer de workflow via HTTP (`POST /api/workflows/{id}/execute`), als MCP-tool of via de canvas-knop **Run Workflow** wordt aangeroepen, voert de uitvoering **niet** de body uit. In plaats daarvan wordt een eenmalig bruikbare uploadslot aangemaakt en geretourneerd:

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **Uploaden + uitvoeren.** De aanroeper voert de `curl` uit met het bestand. Het upload-endpoint valideert de slot, slaat het bestand op, voert de workflow **synchroon** uit en retourneert de workflow-uitvoer in de uploadrespons. De link is **eenmalig bruikbaar** — een tweede upload retourneert `409`.

Op de canvas toont **Run Workflow** de aangemaakte `curl` in het debug-paneel met een kopieerknop.

## Uitvoeren vanuit Heym

Op twee plekken kun je zo'n Workflow rechtstreeks op een bestand uitvoeren, via hetzelfde aanmaak- en uploadproces:

- De [Quick Drawer](../reference/quick-drawer.md) toont een dropzone voor het bestand. Deze uitvoeringen krijgen in de geschiedenis het label `Quick Drawer`.
- Een [Run-widget](../tabs/dashboard-tab.md#run-widgets) op een dashboard voert de Workflow uit voor elk gesleept bestand. Deze uitvoeringen krijgen het label `dashboard`.

## Parameters

| Parameter | Type | Standaard | Beschrijving |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Hoe lang de uploadlink geldig blijft (1–10080 minuten / tot 7 dagen). |
| `maxSizeMb` | number | `100` | Maximaal geaccepteerde bestandsgrootte. Harde limiet is **100 MB**. |
| `allowedTypes` | string | (leeg) | Optionele kommagescheiden MIME-/extensie-allowlist, bijv. `audio/*, .wav`. Leeg staat elk type toe. |

## Uitvoervelden

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.file.id` | Opgeslagen bestand-UUID (een Drive-bestand). |
| `$nodeLabel.file.name` | Oorspronkelijke bestandsnaam. |
| `$nodeLabel.file.mime` | Gedetecteerd contenttype. |
| `$nodeLabel.file.size` | Grootte in bytes. |
| `$nodeLabel.file.download_url` | Geauthenticeerde download-URL voor downstream-nodes. |
| `$nodeLabel.uploaded_at` | ISO-tijdstempel van de upload. |

## Voorbeeld

Een transcriptie-workflow:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Een agent roept de MCP-tool van de workflow aan en ontvangt de `curl`.
2. De agent voert de `curl` uit met de opname uit zijn sandbox.
3. De upload voert de workflow uit en de `curl`-respons bevat de transcriptiesamenvatting.

## Beveiliging

- De upload-URL bevat een token met hoge entropie — het token **is** de capability, dus een sandboxed agent heeft geen Heym-referenties nodig om te uploaden. Alleen de hash van het token wordt server-side opgeslagen.
- Het aanmaken vereist normale workflow-authenticatie, dus alleen geautoriseerde aanroepers kunnen uploadlinks creëren.
- Elke aanmaak en elke uploadpoging (geaccepteerd of afgewezen — verlopen, herhaald, te groot, niet-toegestaan type, onbekend token) wordt vastgelegd in een append-only audittrail.
- Uploads zijn eenmalig bruikbaar, TTL-gebonden en groottebeperkt; te grote uploads worden afgewezen.

## Opmerkingen

- De generieke HTTP-, MCP- en canvas-aanroepkanalen blijven JSON-only; deze node is de ondersteunde manier om multipart-bestandsuploads te accepteren.
- Het geüploade bestand wordt opgeslagen als een normaal Drive-bestand, zodat elke downstream-node die een bestandsreferentie accepteert (transcriberen, e-mailbijlage verzenden, enz.) `$nodeLabel.file` kan gebruiken.
