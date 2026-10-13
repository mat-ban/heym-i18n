# Trigger de File Upload

El node **File Upload Trigger** és un punt d'entrada sense entrades per a workflows que necessiten un **fitxer gran** (àudio, vídeo, arxius) que no es pot incrustar com a base64 dins d'una petició JSON. En invocar el workflow, es retorna un enllaç de càrrega `curl` precarregat i d'un sol ús; carregar un fitxer en aquest enllaç inicia l'execució amb el fitxer adjunt.

Utilitzeu-lo quan un emissor —incloent-hi un agent d'IA com Claude o ChatGPT executant-se en un sandbox— hagi de lliurar una gravació de veu de 20 MB o un vídeo de 75 MB a un workflow de Heym.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 |
| Sortides | 1 |
| Sortida | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Com funciona

El node s'executa en dues fases:

1. **Emissió.** Quan el workflow s'invoca per HTTP (`POST /api/workflows/{id}/execute`), com a eina MCP o mitjançant el botó **Run Workflow** del canvas, l'execució **no** executa el cos. En el seu lloc, s'emet una ranura de càrrega d'un sol ús i es retorna:

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

2. **Càrrega + execució.** L'emissor executa el `curl` amb el seu fitxer. L'endpoint de càrrega valida la ranura, emmagatzema el fitxer, executa el workflow **de manera síncrona** i retorna la sortida del workflow a la resposta de càrrega. L'enllaç és **d'un sol ús** — una segona càrrega retorna `409`.

Al canvas, **Run Workflow** mostra el `curl` emès al panell de depuració amb un botó de còpia.

## Execució des de Heym

Dos llocs executen aquest Workflow directament sobre un fitxer, mitjançant el mateix procés de generació i pujada:

- El [Quick Drawer](../reference/quick-drawer.md) mostra una zona per deixar-hi anar el fitxer. Aquestes execucions s'etiqueten com a `Quick Drawer` a l'historial.
- Un [giny d'execució](../tabs/dashboard-tab.md#run-widgets) en un tauler executa el Workflow sobre cada fitxer que s'hi deixi anar. Aquestes execucions s'etiqueten com a `dashboard`.

## Paràmetres

| Paràmetre | Tipus | Per defecte | Descripció |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Quant de temps roman vàlid l'enllaç de càrrega (1–10080 minuts / fins a 7 dies). |
| `maxSizeMb` | number | `100` | Mida màxima de fitxer acceptada. El límit absolut és de **100 MB**. |
| `allowedTypes` | string | (buit) | Llista d'autorització opcional de MIME/extensions separades per comes, p. ex. `audio/*, .wav`. Buit permet qualsevol tipus. |

## Camps de sortida

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.file.id` | UUID del fitxer emmagatzemat (un fitxer de Drive). |
| `$nodeLabel.file.name` | Nom original del fitxer. |
| `$nodeLabel.file.mime` | Tipus de contingut detectat. |
| `$nodeLabel.file.size` | Mida en bytes. |
| `$nodeLabel.file.download_url` | URL de descàrrega autenticada per als nodes posteriors. |
| `$nodeLabel.uploaded_at` | Marca de temps ISO de la càrrega. |

## Exemple

Un workflow de transcripció:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Un agent crida l'eina MCP del workflow i rep el `curl`.
2. L'agent executa el `curl` amb la gravació des del seu sandbox.
3. La càrrega executa el workflow i la resposta del `curl` conté el resum de la transcripció.

## Seguretat

- L'URL de càrrega incrusta un token d'alta entropia — el token **és** la capacitat, de manera que un agent en sandbox no necessita credencials de Heym per carregar. Només s'emmagatzema el hash del token al servidor.
- L'emissió requereix l'autenticació normal del workflow, de manera que només els emissors autoritzats poden crear enllaços de càrrega.
- Cada emissió i cada intent de càrrega (acceptat o rebutjat — expirat, reproduït, mida excessiva, tipus no permès, token desconegut) s'escriu en un registre d'auditoria d'afegit únic.
- Les càrregues s'apliquen com d'un sol ús, limitades per TTL i amb límit de mida; les càrregues de mida excessiva es rebutgen.

## Notes

- Els canals genèrics d'invocació HTTP, MCP i canvas romanen exclusivament en JSON; aquest node és la manera admesa d'acceptar càrregues de fitxers multipart.
- El fitxer carregat s'emmagatzema com un fitxer de Drive normal, de manera que qualsevol node posterior que accepti una referència de fitxer (transcripció, enviament d'adjunt de correu electrònic, etc.) pot consumir `$nodeLabel.file`.
