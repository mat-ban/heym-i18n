# Streaming SSE

Les Workflows peuvent diffuser les événements d'exécution en temps réel via Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Cet endpoint utilise les mêmes règles d'authentification au niveau du workflow, de limitation de débit et de mise en cache des réponses que l'endpoint d'exécution standard documenté dans [Webhooks](./webhooks.md).

## Activation du SSE dans la boîte de dialogue cURL

Ouvrez la boîte de dialogue **Run with cURL** dans l'éditeur et activez **SSE Streaming**.

Une fois activé, Heym :

- bascule la commande générée de `/execute` vers `/execute/stream`
- ajoute `--no-buffer` afin que les événements diffusés apparaissent immédiatement dans la sortie du terminal
- ajoute `Accept: text/event-stream`
- vous permet de configurer les messages `node_start` par nœud directement dans la boîte de dialogue

## Protocole d'événements

Chaque trame SSE est un JSON délimité par des retours à la ligne et préfixé par `data: `.

| Type d'événement | Moment d'émission | Champs clés |
|------------|--------------------|------------|
| `queued` | Le workflow a atteint sa [limite de simultanéité](./webhooks.md#concurrency-limit-and-queued-runs) ; renvoyé chaque fois que la position de l'exécution change | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Immédiatement après l'acceptation de la requête, ou lorsqu'une exécution en file d'attente démarre | `execution_id`, `server_now_ms` |
| `node_start` | Juste avant qu'un nœud ne commence son exécution | `node_id`, `node_label`, `started_at_ms`, `message` facultatif |
| `node_retry` | Lorsqu'un nœud effectue une nouvelle tentative | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Après qu'un nœud a terminé | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Lorsqu'un Nœud Output retourne de manière anticipée | `node_label`, `output` |
| `execution_complete` | Après la fin du workflow | `status`, `outputs`, `execution_time_ms` |

### Exécutions en file d'attente

Lorsque le workflow a atteint sa limite de simultanéité, le flux reste ouvert et envoie des événements `queued` pendant que l'exécution attend. Une exécution en file d'attente s'exécute dans le worker d'arrière-plan, éventuellement dans un autre processus, de sorte que son flux transporte `execution_started` lorsque l'exécution commence et `execution_complete` lorsqu'elle se termine, mais aucun événement `node_start`, `node_complete` ou d'événements de token entre les deux. Son `execution_complete` contient un `node_results` vide ; ouvrez l'exécution dans l'[Historique d'exécution](./execution-history.md) pour obtenir les détails du nœud. La fermeture de la connexion n'annule pas une exécution en file d'attente. Lorsque la file est pleine, la requête reçoit la réponse `429` avant que le flux ne s'ouvre.

## Messages de démarrage par nœud

La boîte de dialogue cURL stocke les paramètres SSE sur le workflow lui-même :

- **Send start** contrôle si un événement `node_start` inclut un `message`
- **Start message** utilise par défaut `[START] {nodeLabel}`
- l'effacement d'un message personnalisé rétablit le texte par défaut
- `node_complete` est toujours émis et inclut toujours la sortie du nœud

Exemple de configuration stockée :

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

## Exemple cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Exemple de flux d'événements :

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Notes de sécurité

- les workflows `anonymous`, `jwt` et `header_auth` se comportent de la même manière que l'endpoint webhook standard
- la mise en cache des réponses s'applique toujours lorsque `cache_ttl_seconds` est configuré
- les limites de débit du workflow s'appliquent toujours lorsque `rate_limit_requests` et `rate_limit_window_seconds` sont configurés
- `test_run` contourne à la fois le cache et la limitation de débit, comme il le fait pour `/execute`

## Voir aussi

- [Webhooks](./webhooks.md) – Endpoint d'exécution standard et boîte de dialogue cURL
- [Exécution parallèle](./parallel-execution.md) – Comment le streaming s'intègre au planificateur DAG de Heym
- [Fonctionnalités du Canvas](./canvas-features.md) – Contrôles de l'éditeur, y compris Run with cURL
- [Sécurité](./security.md) – Authentification et gestion des secrets
