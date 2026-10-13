# Triggers

Les Workflows sont démarrés par des **nœuds trigger** ou des **points d'entrée**. Chaque type de trigger dispose de son propre endpoint ou processus en arrière-plan.

## Nœuds Trigger

Nœuds de départ (sans arêtes entrantes) qui initient l'exécution :

| Type de nœud | Description |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | Point d'entrée HTTP. Reçoit `body`, `headers`, `query` depuis les requêtes. |
| [Cron](../nodes/cron-node.md) | S'exécute selon une planification (expression cron, par ex. `0 * * * *` pour une exécution horaire). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Démarre lorsque Telegram envoie une mise à jour de webhook de bot vers l'URL de webhook propre au nœud. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Démarre lorsque Discord envoie un webhook de l'API Interactions vers l'endpoint propre au nœud. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Interroge une boîte aux lettres IMAP et démarre une fois pour chaque nouvel e-mail détecté. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Démarre lorsque Heym publie un événement de plateforme. Les événements d'une même fenêtre de dispatch arrivent ensemble sous forme de tableau. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Ouvre une connexion client sortante vers un socket externe et démarre sur les événements de socket sélectionnés. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Génère une URL d'upload à usage unique et démarre lorsqu'un appelant envoie un fichier multipart volumineux. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Démarre lorsqu'un message est consommé depuis une file RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Démarre lorsque Slack envoie un événement via le webhook de l'API Events. |

## Points d'entrée

| Trigger | Endpoint / Source | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | En-tête `X-MCP-Key` ou `Authorization: Bearer` (en-têtes uniquement) |
| **Portal** | `POST /api/portal/{slug}/execute` | Token de session Portal |
| **Board** | [Board](../tabs/board-tab.md) déplacement de carte / exécution de suivi dans une colonne avec une chaîne de workflows (`trigger_source="board"`) | JWT (propriétaire du board) |
| **Cron** | Planificateur Cron (s'exécute toutes les 60 s, évalue les expressions cron) | N/A |
| **IMAP** | Gestionnaire de trigger IMAP (worker leader, intervalle d'interrogation par nœud) | Nom d'utilisateur/mot de passe IMAP |
| **WebSocket** | Gestionnaire de trigger WebSocket sortant (worker leader, connexions client persistantes) | En-têtes optionnels par nœud |
| **File Upload** | `POST /api/file-intake/u/{token}` après création d'un slot | Token de capacité à usage unique |
| **RabbitMQ** | Consommateur RabbitMQ (worker leader) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | Secret de signature HMAC-SHA256 |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Clé publique d'application Ed25519 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | `x-telegram-bot-api-secret-token` optionnel |
| **Editor** | Identique à Webhook, via `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint** : `POST /api/workflows/{workflow_id}/execute`
- **Entrée** : Le corps de la requête est transmis en tant que `body` aux nœuds textInput
- **Mode du corps** : Les workflows peuvent utiliser des exemples structurés avec le champ `defined` ou des exemples JSON bruts `generic` dans l'éditeur et la boîte de dialogue cURL
- **Auth** : Configurée par workflow (`auth_type`, `allow_anonymous`)

Consultez [Webhooks](./webhooks.md) pour plus de détails sur le TTL, le cache, la limitation de débit et l'authentification.

### MCP

Les workflows avec `mcp_enabled=true` apparaissent comme des outils pour les clients MCP. Le nom de l'outil est dérivé du nom du workflow. Consultez [MCP Tab](../tabs/mcp-tab.md).

### Portal

Interface de chat publique à l'adresse `/chat/{slug}`. Consultez [Portal](./portal.md) pour plus de détails.

### Cron

Le planificateur cron s'exécute toutes les 60 secondes, identifie les workflows comportant des nœuds `cron` actifs, évalue les expressions cron et exécute les workflows correspondants. L'entrée inclut `{"triggered_by": "cron"}`.

### IMAP

Le gestionnaire de trigger IMAP s'exécute dans le worker leader et vérifie les nœuds `imapTrigger` actifs selon leur `pollIntervalMinutes` configuré. Chaque nœud stocke un curseur IMAP (`UIDVALIDITY` + dernier UID vu). L'entrée inclut `email`, `triggered_by: "imap"`, `trigger_node_id` et `triggered_at`.

### Événements de la plateforme Heym

Le dispatcher d'événements Heym interroge le journal `heym_events` toutes les 5 secondes et distribue les événements correspondants aux nœuds `heymTrigger` actifs. La distribution est revendiquée par (événement, workflow, nœud) via une contrainte d'unicité, de sorte qu'un événement se déclenche exactement une fois par nœud abonné, sur l'ensemble des workers, conteneurs et machines. Tous les événements revendiqués lors d'une même passe sont distribués en une seule exécution : l'entrée inclut `events` (toujours un tableau, du plus ancien au plus récent), `count`, `triggered_by: "heym_event"`, `trigger_node_id` et `triggered_at`. Seuls les événements publiés au cours des 5 dernières minutes sont distribués, ce qui évite qu'une panne ne rejoue un arriéré ; les événements sont conservés pendant 7 jours.

### WebSocket

Le gestionnaire de trigger WebSocket s'exécute dans le worker leader et maintient une connexion client sortante par nœud [WebSocket Trigger](../nodes/websocket-trigger-node.md) actif. Il peut émettre des exécutions pour `onMessage`, `onConnected` et `onClosed`. L'entrée inclut `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` et l'un des éléments suivants : `message`, `connection` ou `close`.

### File Upload

Le [File Upload Trigger](../nodes/file-upload-trigger-node.md) génère un slot d'upload à usage unique et à durée de vie limitée (TTL) lorsque le workflow est invoqué via l'API, MCP ou le canvas. L'envoi de données de formulaire multipart vers `POST /api/file-intake/u/{token}` consomme le slot, stocke le fichier en tant que fichier Drive et démarre le workflow de manière synchrone. L'entrée inclut `file`, `uploaded_at`, `triggered_by: "file_upload"` et les métadonnées d'upload.

### Telegram

Telegram envoie les mises à jour de webhook du bot vers `POST /api/telegram/webhook/{node_id}`. Le payload est transmis au workflow sous forme de `update`, `message`, `callback_query` optionnel, `headers` assainis, `triggered_by`, `trigger_node_id` et `triggered_at`. Si l'identifiant sélectionné dispose d'un token secret, Heym vérifie `x-telegram-bot-api-secret-token` avant l'exécution.

### Discord

Discord envoie les webhooks d'interaction vers `POST /api/discord/webhook/{node_id}`. Le payload est transmis au workflow sous forme de `interaction`, `type`, `data`, `headers` assainis, `triggered_by`, `trigger_node_id` et `triggered_at`. Heym vérifie la requête à l'aide d'Ed25519 et de la clé publique d'application de l'identifiant `discord_trigger` sélectionné avant l'exécution.

### RabbitMQ

Le consommateur RabbitMQ démarre lors de l'initialisation du worker leader. Les workflows comportant des nœuds `rabbitmq` où `rabbitmqOperation === "receive"` obtiennent un consommateur. L'entrée inclut `message_data` (body, headers, routing_key, etc.) et `triggered_by: "rabbitmq"`.

## trigger_source

L'historique des exécutions enregistre `trigger_source` pour chaque point d'entrée :

| Valeur | Cas |
|-------|------|
| `"API"` | Appel Webhook / API sans en-tête explicite (par défaut) |
| `"Canvas"` | Exécution depuis le canvas de l'éditeur de workflow |
| `"Quick Drawer"` | Exécution depuis le panneau quick-drawer de l'éditeur, y compris les exécutions de fichiers téléversés depuis sa zone de dépôt |
| `"cron"` | Planificateur Cron |
| `"imap"` | Gestionnaire de trigger IMAP |
| `"websocket"` | Gestionnaire de trigger WebSocket sortant |
| `"file_upload"` | Endpoint d'upload du File Upload Trigger (liens générés via HTTP, MCP ou le canevas) |
| `"dashboard"` | Exécutions de widgets du tableau de bord et téléversements depuis un widget de dépôt de fichier |
| `"telegram"` | Webhook du bot Telegram |
| `"Discord"` | Webhook d'interactions Discord |
| `"MCP"` | Appel d'outil MCP |
| `"portal"` | Exécution via le portail |
| `"dashboard_chat"` | Chat de l'assistant IA |
| `"AI Agents"` | Sous-workflow invoqué par un nœud Agent IA |
| `"SUB_WORKFLOW"` | Sous-workflow invoqué par un nœud Execute Workflow |
| personnalisé | Toute valeur transmise dans l'en-tête `X-Trigger-Source` ou le paramètre `trigger_source` en query/body |
| (non défini) | Consommateur RabbitMQ |

## Entrées par Trigger

- **HTTP/Webhook** : `body`, `headers`, `query` issus de la requête
- **Cron** : `{"triggered_by": "cron"}`
- **Telegram** : `update` + `message` + `callback_query` optionnel + `headers` assainis + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord** : `interaction` + `type` + `data` + `headers` assainis + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP** : `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket** : `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload** : `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ** : `message_data` + `triggered_by: "rabbitmq"`
- **Slack** : `event` (objet événement Slack complet) + `headers` (assainis) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal** : `body.inputs` + `conversation_history` optionnel

## Voir aussi

- [Webhooks](./webhooks.md) – TTL des Webhooks, cache, rate limit, authentification
- [Workflow Structure](./workflow-structure.md) – Nœuds et arêtes
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Trigger de webhook d'interactions Discord
- [Quick Start](../getting-started/quick-start.md) – Construire un workflow avec Input
- [Portal](./portal.md) – Trigger Portal et interface de chat
- [Execution History](./execution-history.md) – Consulter les exécutions passées et le trigger_source
