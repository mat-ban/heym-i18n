# Streaming SSE

Els Workflows poden transmetre esdeveniments d'execució en temps real amb Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Aquest endpoint utilitza les mateixes regles d'autenticació a nivell de workflow, limitació de velocitat i memòria cau de respostes que l'endpoint d'execució estàndard documentat a [Webhooks](./webhooks.md).

## Habilitar SSE al diàleg de cURL

Obriu el diàleg **Run with cURL** a l'editor i activeu **SSE Streaming**.

Quan està habilitat, Heym:

- canvia l'ordre generada de `/execute` a `/execute/stream`
- afegeix `--no-buffer` perquè els esdeveniments transmesos apareguin immediatament a la sortida del terminal
- afegeix `Accept: text/event-stream`
- us permet configurar missatges `node_start` per node directament al diàleg

## Protocol d'esdeveniments

Cada trama SSE és JSON delimitat per salts de línia amb el prefix `data: `.

| Tipus d'esdeveniment | Quan s'emet | Camps clau |
|------------|--------------------|------------|
| `queued` | El workflow ha assolit el seu [límit de concurrència](./webhooks.md#concurrency-limit-and-queued-runs); s'envia de nou cada vegada que canvia la posició de l'execució | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Immediatament després que s'accepti la sol·licitud, o quan comença una execució a la cua | `execution_id`, `server_now_ms` |
| `node_start` | Just abans que un node comenci l'execució | `node_id`, `node_label`, `started_at_ms`, `message` opcional |
| `node_retry` | Quan un node reintenta | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Després que un node finalitzi | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Quan un node Output retorna anticipadament | `node_label`, `output` |
| `execution_complete` | Després que el workflow finalitzi | `status`, `outputs`, `execution_time_ms` |

### Execucions a la cua

Quan el workflow arriba al seu límit de concurrència, el flux es manté obert i envia esdeveniments `queued` mentre l'execució espera. Una execució a la cua s'executa al worker en segon pla, possiblement en un altre procés, de manera que el seu flux porta `execution_started` quan s'inicia l'execució i `execution_complete` quan acaba, però cap esdeveniment `node_start`, `node_complete` o de tokens entremig. El seu `execution_complete` té un `node_results` buit; obriu l'execució a l'[Historial d'execució](./execution-history.md) per veure els detalls dels nodes. Tancar la connexió no cancel·la una execució a la cua. Quan la cua és plena, la sol·licitud rep una resposta `429` abans que s'obri el flux.

## Missatges d'inici per node

El diàleg de cURL emmagatzema la configuració SSE al mateix workflow:

- **Send start** controla si un esdeveniment `node_start` inclou un `message`
- **Start message** per defecte és `[START] {nodeLabel}`
- esborrar un missatge personalitzat torna al text per defecte
- `node_complete` sempre s'emet i sempre inclou la sortida del node

Exemple de configuració emmagatzemada:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## Exemple de cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Mostra de flux d'esdeveniments:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Notes de seguretat

- els workflows `anonymous`, `jwt` i `header_auth` es comporten igual que l'endpoint de webhook habitual
- la memòria cau de respostes encara s'aplica quan `cache_ttl_seconds` està configurat
- els límits de velocitat del workflow encara s'apliquen quan `rate_limit_requests` i `rate_limit_window_seconds` estan configurats
- `test_run` omet tant la memòria cau com la limitació de velocitat, de la mateixa manera que ho fa per a `/execute`

## Relacionat

- [Webhooks](./webhooks.md) – Endpoint d'execució estàndard i diàleg de cURL
- [Parallel Execution](./parallel-execution.md) – Com s'integra el streaming al planificador DAG de Heym
- [Canvas Features](./canvas-features.md) – Controls de l'editor, inclòs Run with cURL
- [Security](./security.md) – Autenticació i gestió de secrets