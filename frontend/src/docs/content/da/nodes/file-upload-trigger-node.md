# Filupload Trigger

**File Upload Trigger**-noden er en nul-input-startpunkt for workflows, der kræver en **stor fil** (lyd, video, arkiver), som ikke kan indlejres som base64 i en JSON-forespørgsel. Når workflowet aktiveres, returneres en forududfyldt, engangsbrugs-`curl`-uploadlink; ved upload af en fil til denne link startes kørslen med filen vedhæftet.

Anvend denne node, når en aktør – inklusive en AI-agent som Claude eller ChatGPT kørende i en sandkasse – skal overlevere en 20 MB lydoptagelse eller en 75 MB video til et Heym-workflow.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Funktionsmåde

Noden fungerer i to faser:

1. **Generering.** Når workflowet aktiveres via HTTP (`POST /api/workflows/{id}/execute`), som et MCP-værktøj eller via canvas-knappen **Kør Workflow**, udføres workflow-kroppen **ikke**. I stedet genereres en engangsbrugs-uploadplads og der returneres:

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/sti/til/fil' 'https://vært/api/file-intake/u/<token>'",
     "upload_url": "https://vært/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **Upload + kørsel.** Aktøren kører `curl` med deres fil. Upload-endpointet validerer pladsen, lagrer filen, kører workflowet **synkront** og returnerer workflow-outputtet i upload-svaret. Linket er **engangsbrug** – en anden upload returnerer `409`.

På canvas viser **Kør Workflow** det genererede `curl`-kommando i debug-panelet med en kopieringsknap.

## Kørsel fra Heym

To steder kører et sådant Workflow direkte på en fil via den samme oprettelses- og uploadproces:

- [Quick Drawer](../reference/quick-drawer.md) viser en slipzone til filen. Disse kørsler markeres med `Quick Drawer` i historikken.
- En [kørselswidget](../tabs/dashboard-tab.md#run-widgets) på et dashboard kører Workflowet på hver fil, der slippes. Disse kørsler markeres med `dashboard`.

## Parametre

| Parameter | Type | Standard | Beskrivelse |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Hvor længe upload-linket forbliver gyldigt (1–10080 minutter / op til 7 dage). |
| `maxSizeMb` | number | `100` | Maksimal accepteret filstørrelse. Hård grænse er **100 MB**. |
| `allowedTypes` | string | (tom) | Valgfri kommasepareret MIME/extension tilladelsesliste, f.eks. `audio/*, .wav`. Tom tillader alle typer. |

## Output-felter

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.file.id` | Lagret fil-UUID (en Drive-fil). |
| `$nodeLabel.file.name` | Originalt filnavn. |
| `$nodeLabel.file.mime` | Detekteret indholdstype. |
| `$nodeLabel.file.size` | Størrelse i bytes. |
| `$nodeLabel.file.download_url` | Autentificeret download-URL til brug i efterfølgende noder. |
| `$nodeLabel.uploaded_at` | ISO-tidsstempel for upload. |

## Eksempel

Et transskriptionsworkflow:

```
File Upload Trigger ("lyd")  →  Transkriber ($lyd.file)  →  LLM-sammendrag  →  Output
```

1. En agent kalder workflowets MCP-værktøj og modtager `curl`-kommandoen.
2. Agenten kører `curl` med optagelsen fra sin sandkasse.
3. Uploaden kører workflowet, og `curl`-svaret indeholder transskriptionssammendraget.

## Sikkerhed

- Upload-URL'en indeholder et højentropi-token – tokenet **er** selv tilladelsen, så en sandkasset agent ikke behøver Heym-legitimationsoplysninger for at uploade. Kun tokenets hash gemmes serverside.
- Generering kræver normal workflow-autentificering, så kun autoriserede aktører kan oprette upload-links.
- Hver generering og hver uploadforsøg (accepteret eller afvist – udløbet, genbrugt, over størrelse, uautoriseret type, ukendt token) logføres i en append-only-revisionslog.
- Uploads er engangsbrug, TTL-begrænset og størrelsesbegrænset; overskridende uploads afvises.

## Bemærkninger

- De generelle HTTP-, MCP- og canvas-aktiveringskanaler forbliver JSON-baserede; denne node er den understøttede måde at acceptere multipart-filuploads på.
- Den uploadede fil lagres som en normal Drive-fil, så enhver efterfølgende node, der accepterer en filreference (transskription, send email-vedhæftning osv.), kan anvende `$nodeLabel.file`.
