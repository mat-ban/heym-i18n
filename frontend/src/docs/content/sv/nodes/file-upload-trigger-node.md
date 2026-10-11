# Filuppladdnings-Trigger

Noden **Filuppladdnings-Trigger** är en ingångspunkt utan indata för workflows som behöver en **stor fil** (ljud, video, arkiv) som inte kan bäddas in som base64 i en JSON-begäran. När workflowet anropas returneras en förifylld engångslänk för `curl`-uppladdning; uppladdning av en fil till den länken startar körningen med filen bifogad.

Använd den när en anropare — inklusive en AI-agent som Claude eller ChatGPT som körs i en sandbox — måste överlämna en 20 MB röstinspelning eller en 75 MB video till ett Heym-workflow.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 0 |
| Utdata | 1 |
| Utdata | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Så fungerar det

Noden körs i två faser:

1. **Generering.** När workflowet anropas över HTTP (`POST /api/workflows/{id}/execute`), som ett MCP-verktyg eller via **Kör Workflow**-knappen på canvas, körs **inte** själva workflowkroppen. Istället genereras en engångsplats för uppladdning och följande returneras:

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

2. **Uppladdning + körning.** Anroparen kör `curl`-kommandot med sin fil. Uppladdningsendpointen validerar platsen, lagrar filen, kör workflowet **synkront** och returnerar workflowets utdata i uppladdningssvaret. Länken är **engångs** — en andra uppladdning returnerar `409`.

På canvas visar **Kör Workflow** den genererade `curl`-kommandot i debugpanelen med en kopieringsknapp.

## Parametrar

| Parameter | Typ | Standard | Beskrivning |
|-----------|-----|----------|-------------|
| `ttlMinutes` | number | `60` | Hur länge uppladdningslänken förblir giltig (1–10080 minuter / upp till 7 dagar). |
| `maxSizeMb` | number | `100` | Maximal accepterad filstorlek. Hårt tak är **100 MB**. |
| `allowedTypes` | string | (tom) | Valfri kommaseparerad tillåtelselista för MIME/ändelse, t.ex. `audio/*, .wav`. Tom tillåter alla typer. |

## Utdatafält

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.file.id` | Lagrad fil-UUID (en Drive-fil). |
| `$nodeLabel.file.name` | Ursprungligt filnamn. |
| `$nodeLabel.file.mime` | Detekterad innehållstyp. |
| `$nodeLabel.file.size` | Storlek i byte. |
| `$nodeLabel.file.download_url` | Autentiserad nedladdnings-URL för nedströmsnoder. |
| `$nodeLabel.uploaded_at` | ISO-tidsstämpel för uppladdningen. |

## Exempel

Ett transkriberings-workflow:

```
Filuppladdnings-Trigger ("audio")  →  Transkribera ($audio.file)  →  LLM-sammanfattning  →  Utdata
```

1. En agent anropar workflowets MCP-verktyg och tar emot `curl`-kommandot.
2. Agenten kör `curl`-kommandot med inspelningen från sin sandbox.
3. Uppladdningen kör workflowet och `curl`-svaret innehåller transkriberingssammanfattningen.

## Säkerhet

- Uppladdnings-URL:en innehåller en token med hög entropi — token **är** behörigheten, så en sandboxad agent behöver inga Heym-autentiseringsuppgifter för att ladda upp. Endast tokens hash lagras på servern.
- Generering kräver normal workflow-autentisering, så endast auktoriserade anropare kan skapa uppladdningslänkar.
- Varje generering och varje uppladdningsförsök (accepterat eller avvisat — utgånget, återuppspelat, för stort, otillåten typ, okänd token) skrivs till en append-only-granskningslogg.
- Uppladdningar är tvingade till engångsbruk, TTL-begränsade och storleksbegränsade; för stora uppladdningar avvisas.

## Anteckningar

- De generiska anropskanalerna HTTP, MCP och canvas förblir JSON-only; denna nod är det stödda sättet att ta emot multipart-filuppladdningar.
- Den uppladdade filen lagras som en vanlig Drive-fil, så varje nedströmsnod som accepterar en filreferens (transkribera, skicka e-postbilaga, etc.) kan konsumera `$nodeLabel.file`.
