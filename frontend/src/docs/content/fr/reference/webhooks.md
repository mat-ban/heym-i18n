# Webhooks

Les Workflows peuvent être déclenchés via des Webhooks HTTP. L'endpoint d'exécution standard renvoie du JSON, et la variante en streaming renvoie des Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Remplacez `{workflow_id}` par l'UUID du workflow. L'URL de base correspond à votre instance Heym (par exemple `https://app.heym.ai`).

## Méthode de requête

Chaque workflow accepte un seul verbe HTTP, choisi dans la boîte de dialogue cURL de l'éditeur : `GET`, `POST`, `PUT` ou `DELETE`. **`POST` est la valeur par défaut**, et tous les workflows créés avant l'existence de ce paramètre la conservent, de sorte que rien de ce qui fonctionne aujourd'hui ne change.

Appeler un workflow avec un verbe différent renvoie `405 Method Not Allowed` avec un en-tête `Allow` indiquant celui qui est configuré :

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Une exception : les requêtes portant `?test_run=true` ignorent cette vérification. C'est ce qu'envoient le bouton **Run** de l'éditeur et le panneau de débogage, de sorte qu'un workflow configuré sur `GET` reste testable depuis l'intérieur du produit.

### Méthodes sans corps

`GET` et `DELETE` ne transportent pas de corps de requête. Les entrées proviennent alors de la chaîne de requête et sont lues avec `$input.query.<name>` :

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

La boîte de dialogue cURL masque l'éditeur de corps de requête et supprime l'en-tête `Content-Type` pour ces deux méthodes.

Associez `GET` à un [HTML output mapper](../nodes/html-output-mapper-node.md) pour servir une page qu'un navigateur peut ouvrir directement.

## Endpoint de streaming

`POST /api/workflows/{workflow_id}/execute/stream`

Utilisez l'endpoint de streaming lorsque vous souhaitez des événements d'exécution incrémentiels plutôt qu'une réponse JSON unique. Consultez [SSE Streaming](./sse-streaming.md) pour le protocole d'événements et la configuration du message de démarrage par nœud.

## Format de requête

Le corps de la requête est transmis en tant que `body` aux nœuds [Input](../nodes/input-node.md). Heym accepte les deux formes de requête :

- **JSON brut** – par exemple `{"userId": "123", "action": "create"}`
- **Format encapsulé** – `{"inputs": {...}, "test_run": false}`

Lors de l'utilisation du format encapsulé, `inputs` est extrait et transmis en tant que `body`. `test_run` contourne la limitation de débit et la mise en cache des réponses. Vous pouvez également envoyer `?test_run=true` en tant que paramètre de requête lors de l'envoi de JSON brut.

## Modes de corps de requête

Chaque workflow dispose d'un paramètre `webhook_body_mode` qui contrôle la manière dont l'éditeur construit les requêtes d'exemple :

| Mode | Comportement |
|------|----------|
| **defined** | L'éditeur et la boîte de dialogue cURL façonnent le corps d'exemple à partir des champs du nœud Input du workflow et conservent les clés vides dans le payload JSON. Les payloads cURL existants de style defined continuent de fonctionner. |
| **generic** | L'éditeur et la boîte de dialogue cURL utilisent un corps JSON libre. Le corps de la requête est transmis tel quel afin que les applications externes puissent envoyer leur propre structure de payload fixe. |

L'API d'exécution reste rétrocompatible dans les deux modes. Les requêtes JSON brut et encapsulées `{ "inputs": ... }` sont toujours acceptées dans les deux cas.

Les en-têtes et les paramètres de requête sont disponibles dans les expressions via `$input.headers` et `$input.query`. Les clés d'en-tête sont mises en minuscules.

## Authentification

Se configure par workflow dans l'éditeur (paramètres du workflow). L'authentification est vérifiée avant l'exécution.

| auth_type | Comportement |
|-----------|----------|
| **anonymous** | Aucune authentification requise. Tout le monde peut appeler l'endpoint. |
| **jwt** | Token Bearer requis. Accepte soit un token de session utilisateur (l'utilisateur doit avoir accès au workflow), soit un [Execution Token](./execution-tokens.md) à portée limitée créé pour ce workflow. |
| **header_auth** | Un en-tête personnalisé doit correspondre. Définissez `auth_header_key` (par exemple `X-API-Key`) et `auth_header_value`. |

Pour `header_auth`, la valeur de l'en-tête de requête doit correspondre exactement à la valeur configurée. Les utilisateurs JWT disposant d'un accès au workflow peuvent également appeler sans l'en-tête personnalisé.

Pour `jwt`, les [Execution Tokens](./execution-tokens.md) constituent la méthode recommandée pour appeler des workflows depuis des systèmes externes — ils sont limités à un seul workflow et peuvent être révoqués indépendamment.

## Mise en cache des réponses

Configurez `cache_ttl_seconds` par workflow. Lorsque ce paramètre est défini et supérieur à 0 :

- **Clé de cache** : hash SHA256 de `workflow_id` + `body` + `query`
- **Cache hit** : renvoie immédiatement avec `status: "cached"` et les sorties mises en cache
- **Cache set** : uniquement après une exécution réussie (`status: "success"`)
- **Stockage** : adossé à Postgres et partagé entre les workers backend

| Paramètre | Effet |
|---------|--------|
| `cache_ttl_seconds` = 0 ou null | Mise en cache désactivée |
| `cache_ttl_seconds` > 0 | Réponses mises en cache pendant ce nombre de secondes |

Les requêtes `test_run` contournent le cache (ni lecture, ni écriture).

Lorsque la mise en cache des réponses est activée dans la boîte de dialogue cURL, **Clear cache** évince immédiatement les réponses mises en cache du workflow courant.

## Limitation de débit

Se configure par workflow : `rate_limit_requests` et `rate_limit_window_seconds`.

- **Portée** : par `workflow_id` + IP client (fenêtre glissante)
- **Dépassement** : HTTP 429 avec en-tête `Retry-After`
- **En-têtes** : `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Paramètre | Description |
|---------|-------------|
| `rate_limit_requests` | Nombre maximal de requêtes autorisées dans la fenêtre |
| `rate_limit_window_seconds` | Durée de la fenêtre en secondes |

Les requêtes `test_run` contournent la limitation de débit.

<a id="concurrency-limit-and-queued-runs"></a>

## Limite de simultanéité et exécutions en file d'attente

Un workflow peut plafonner le nombre d'exécutions de production simultanées. Activez **Limite de simultanéité** dans le panneau **Properties** au niveau du workflow et définissez **Exécutions simultanées max**. Les propriétaires et collaborateurs disposant d'un accès en édition peuvent le modifier. La limite est désactivée par défaut.

Lorsque la limite est atteinte, les nouvelles exécutions attendent dans une file d'attente premier entré, premier sorti (FIFO). Cela couvre chaque point d'entrée de production : cet endpoint, l'[endpoint de streaming](./sse-streaming.md), le [Portal](./portal.md), le [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) et chaque [trigger](./triggers.md). Les exécutions de test de l'éditeur démarrent toujours immédiatement et ne consomment pas de slot. Envoyer `test_run=true` sans session connectée autorisée à ouvrir le workflow n'évite pas la file d'attente.

| Paramètre | Description |
|---|---|
| `concurrency_limit` | Exécutions de production autorisées simultanément. `0` désactive la limite |
| `concurrency_max_queue` | Facultatif. Nombre d'exécutions autorisées à attendre simultanément. Vide signifie aucune limite |
| `concurrency_max_wait_seconds` | Facultatif. Une exécution qui attend plus longtemps est enregistrée comme `expired`. Vide signifie qu'elle attend aussi longtemps que nécessaire |

### 202 Accepted

Un appel qui démarre immédiatement se comporte exactement comme décrit dans Format de la réponse. Un appel devant attendre reçoit immédiatement `202 Accepted`, indépendamment de `X-Simple-Response`, avec un en-tête `Location` pointant vers son URL de statut :

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Champ | Description |
|---|---|
| `queue.position` | Place de cette exécution dans la file, commençant à 1 |
| `queue.size` | Exécutions actuellement en attente |
| `queue.running` | Exécutions occupant actuellement un emplacement |
| `queue.limit` | Limite de simultanéité du workflow |
| `status_token` | Workflows anonymes uniquement. Renvoyé une seule fois, dans cette réponse |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` répond avec l'état de l'exécution. Appelez-le avec les mêmes identifiants que ceux ayant démarré l'exécution : une session ou un JWT, un [jeton d'exécution](./execution-tokens.md) ou l'en-tête personnalisé du workflow. Un workflow anonyme n'ayant aucun identifiant à vérifier, envoyez le `status_token` reçu du 202 dans l'en-tête `X-Heym-Run-Token`. Le jeton n'est jamais lu depuis la query string. Un jeton erroné ou manquant reçoit `404`, tout comme une exécution inconnue.

```json
{
  "execution_id": "...",
  "workflow_id": "...",
  "status": "success",
  "queue": null,
  "outputs": { "done": { "result": "ok" } },
  "error": null,
  "execution_time_ms": 5120
}
```

| `status` | Signification (une exécution devant attendre un créneau de simultanéité reçoit la [réponse 202](#202-accepted) à la place) |
|---|---|
| `queued` | En attente d'un emplacement ; `queue` indique son avancement |
| `running` | Dispose d'un emplacement et est en cours d'exécution |
| `success` / `error` | Terminé ; `outputs` et `error` sont renseignés |
| `pending` | En pause pour [révision humaine](./human-in-the-loop.md) |
| `cancelled` | Annulé depuis l'[Historique des exécutions](./execution-history.md) |
| `expired` | A attendu plus longtemps que `concurrency_max_wait_seconds` et n'a jamais été exécuté |

Interrogez toutes les quelques secondes jusqu'à ce que le statut ne soit plus `queued` ni `running`. Une exécution en file d'attente s'exécute même si personne ne l'interroge.

### File d'attente pleine

Lorsque `concurrency_max_queue` est défini et que ce nombre d'exécutions est déjà atteint dans la file d'attente, l'appel est rejeté avec `429 Concurrency queue is full` et une entrée `queue_full` dans l'historique des exécutions. Rien n'est mis en file d'attente.

## Format de la réponse

L'endpoint renvoie du JSON :

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Champ | Description |
|-------|-------------|
| `workflow_id` | UUID du Workflow |
| `status` | `success`, `error`, `cached` ou `rate_limited` |
| `outputs` | Sorties des nœuds terminaux. Lorsqu'un unique [mappeur de sortie JSON](../nodes/json-output-mapper-node.md) constitue le seul terminal, le corps de la réponse correspond à cet objet mappé au premier niveau (réponses JSON simples par défaut). Sinon, inclut le nœud [Output](../nodes/output-node.md) et les autres terminaux indexés par label. |
| `execution_time_ms` | Temps d'exécution en millisecondes (0 pour cached/rate_limited) |

En cas d'erreur, `outputs` peut contenir les détails de l'erreur. Un nœud [Throw Error](../nodes/throw-error-node.md) permet de définir un code de statut HTTP personnalisé (4xx/5xx).

## Boîte de dialogue Run with cURL

Le bouton **Run with cURL** de la barre d'outils (en haut à droite de l'éditeur, icône `cURL`) ouvre une boîte de dialogue qui génère et copie une commande cURL prête à l'emploi pour le workflow en cours.

### Fonctionnement

| Champ | Description |
|-------|-------------|
| **Request Body Mode** | Choisissez **Defined** ou **Generic**. Le mode Generic conserve le corps en JSON brut au lieu de le structurer à partir des champs Input. |
| **Authentication** | Choisissez Anonymous, JWT Token ou Header Auth. Définit l'en-tête d'authentification approprié dans la commande. Lorsque JWT Token est sélectionné, la boîte de dialogue affiche un gestionnaire d'[Execution Tokens](./execution-tokens.md) — créez ou sélectionnez un token pour l'intégrer directement dans la commande. |
| **Header Key / Value** | Visible lorsque Header Auth est sélectionné. Pré-rempli à partir des paramètres d'authentification du workflow. |
| **Response Cache** | Durée en minutes de mise en cache des réponses identiques (0 = désactivé). Les modifications sont enregistrées dans le workflow. Lorsque cette option est activée, **Clear cache** supprime immédiatement les réponses mises en cache. |
| **Rate Limit** | Nombre maximal de requêtes par fenêtre temporelle. Les modifications sont enregistrées dans le workflow. |
| **SSE Streaming** | Bascule la commande vers `/execute/stream`, ajoute `--no-buffer` et expose les paramètres du message `node_start` par nœud. |
| **Body** | Corps de la requête JSON. En mode Defined, il est pré-rempli à partir des champs [Input](../nodes/input-node.md) et conserve les clés vides. En mode Generic, il s'agit d'un éditeur JSON brut. |
| **Command** | Aperçu en lecture seule de la commande cURL complète. |

Cliquez sur **Copy cURL** pour copier la commande dans le presse-papiers.

### Exemple

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

En mode Generic, les payloads imbriqués restent intacts, par exemple :

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

La boîte de dialogue reflète les paramètres d'authentification, de mode de corps, de mise en cache et de rate-limit stockés sur le workflow — toute modification effectuée ici met immédiatement à jour le workflow.

### SSE Streaming dans la boîte de dialogue

Activez **SSE Streaming** pour que la commande générée suive l'exécution en temps réel depuis votre terminal.

- L'endpoint passe de `/execute` à `/execute/stream`
- La commande ajoute `--no-buffer` et `Accept: text/event-stream`
- Chaque nœud non-sticky apparaît dans une liste où vous pouvez :
  - activer ou désactiver le message `node_start`
  - personnaliser le texte du message de démarrage
- Les événements `node_complete` sont toujours émis et incluent la sortie complète du nœud

Exemple :

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Pour le protocole d'événements complet et des exemples, consultez [SSE Streaming](./sse-streaming.md).

## Marquage de la source du Trigger

Chaque exécution stocke un label `trigger_source` visible dans l'[Historique des exécutions](./execution-history.md). Définissez-le en envoyant l'en-tête `X-Trigger-Source` avec la valeur de votre choix :

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Le bouton **Copy cURL** de la boîte de dialogue de l'éditeur inclut automatiquement `X-Trigger-Source: API`. Vous pouvez remplacer `API` par toute valeur pertinente — `scheduler`, `rabbitmq`, `github-actions`, etc.

Si l'en-tête n'est pas envoyé, `trigger_source` prend la valeur par défaut `"API"` et l'exécution est étiquetée **API** dans l'historique. Remplacez-la par toute valeur pertinente pour votre système — `scheduler`, `github-actions`, `rabbitmq`, etc.

## Voir aussi

- [Execution Tokens](./execution-tokens.md) – JWT à portée limitée pour appeler des workflows depuis des systèmes externes
- [SSE Streaming](./sse-streaming.md) – Diffuser les événements des nœuds en temps réel via Server-Sent Events
- [Triggers](./triggers.md) – Tous les points d'entrée des workflows, y compris le webhook
- [Workflow Structure](./workflow-structure.md) – Nœuds et arêtes
- [Expression DSL](./expression-dsl.md) – Accéder à `$input.body`, `$input.headers`, `$input.query`
