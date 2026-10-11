# Trigger Caricamento File

Il nodo **Trigger Caricamento File** è un punto di ingresso a zero input per i workflow che necessitano di un **file di grandi dimensioni** (audio, video, archivi) che non può essere incorporato come base64 all'interno di una richiesta JSON. L'invocazione del workflow restituisce un link di caricamento `curl` precompilato e monouso; caricando un file su tale link si avvia l'esecuzione con il file allegato.

Utilizzarlo quando un chiamante — incluso un agente IA come Claude o ChatGPT in esecuzione in una sandbox — deve consegnare una registrazione vocale da 20 MB o un video da 75 MB a un workflow Heym.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Come funziona

Il nodo opera in due fasi:

1. **Generazione.** Quando il workflow viene invocato via HTTP (`POST /api/workflows/{id}/execute`), come strumento MCP, o tramite il pulsante **Esegui workflow** del canvas, l'esecuzione **non** esegue il corpo. Al suo posto genera uno slot di caricamento monouso e restituisce:

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

2. **Caricamento + esecuzione.** Il chiamante esegue il comando `curl` con il proprio file. L'endpoint di caricamento convalida lo slot, memorizza il file, esegue il workflow **in modo sincrono** e restituisce l'output del workflow nella risposta di caricamento. Il link è **monouso** — un secondo caricamento restituisce `409`.

Sul canvas, **Esegui workflow** mostra il `curl` generato nel pannello di debug con un pulsante di copia.

## Parametri

| Parametro | Tipo | Predefinito | Descrizione |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Per quanto tempo il link di caricamento rimane valido (1–10080 minuti / fino a 7 giorni). |
| `maxSizeMb` | number | `100` | Dimensione massima accettata del file. Il limite massimo assoluto è **100 MB**. |
| `allowedTypes` | string | (vuoto) | Allowlist opzionale di MIME/estensioni separate da virgola, ad es. `audio/*, .wav`. Se vuoto, consente qualsiasi tipo. |

## Campi di output

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.file.id` | UUID del file memorizzato (un file Drive). |
| `$nodeLabel.file.name` | Nome file originale. |
| `$nodeLabel.file.mime` | Tipo di contenuto rilevato. |
| `$nodeLabel.file.size` | Dimensione in byte. |
| `$nodeLabel.file.download_url` | URL di download autenticato per i nodi a valle. |
| `$nodeLabel.uploaded_at` | Timestamp ISO del caricamento. |

## Esempio

Un workflow di trascrizione:

```
Trigger Caricamento File ("audio")  →  Transcribe ($audio.file)  →  Riepilogo LLM  →  Output
```

1. Un agente chiama lo strumento MCP del workflow e riceve il `curl`.
2. L'agente esegue il `curl` con la registrazione dalla propria sandbox.
3. Il caricamento esegue il workflow e la risposta del `curl` contiene il riepilogo della trascrizione.

## Sicurezza

- L'URL di caricamento incorpora un token ad alta entropia — il token **è** la capability, quindi un agente in sandbox non necessita di credenziali Heym per caricare. Solo l'hash del token viene memorizzato lato server.
- La generazione richiede la normale autenticazione del workflow, quindi solo i chiamanti autorizzati possono creare link di caricamento.
- Ogni generazione e ogni tentativo di caricamento (accettato o rifiutato — scaduto, riprodotto, di dimensioni eccessive, di tipo non consentito, token sconosciuto) viene registrato in un audit trail di sola aggiunta.
- I caricamenti sono vincolati al monouso, limitati dal TTL e con dimensione massima; i caricamenti di dimensioni eccessive vengono rifiutati.

## Note

- I canali di invocazione generici HTTP, MCP e canvas rimangono solo JSON; questo nodo è il modo supportato per accettare caricamenti di file multipart.
- Il file caricato viene memorizzato come un normale file Drive, quindi qualsiasi nodo a valle che accetta un riferimento a un file (trascrizione, invio di allegati email, ecc.) può utilizzare `$nodeLabel.file`.