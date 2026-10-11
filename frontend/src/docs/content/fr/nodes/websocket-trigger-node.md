# Trigger WebSocket

Le nœud **Trigger WebSocket** ouvre une connexion client sortante vers un serveur WebSocket externe et démarre le workflow lorsque les événements de socket sélectionnés se produisent. Utilisez-le pour des flux d'événements tels que les flux de marché, la télémétrie ou les backplanes de chat. La connexion à des systèmes temps réel internes nécessite la désactivation de la restriction sur les URL privées décrite ci-dessous.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 |
| Sorties | 1 |
| Sortie | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Comportement important

- Ce nœud se connecte **depuis Heym vers un autre serveur WebSocket**.
- Il n'expose **pas** d'endpoint WebSocket sur Heym.
- Aucun [identifiant](../reference/credentials.md) n'est requis. Configurez l'URL, les en-têtes et les sous-protocoles directement sur le nœud.
- Le worker leader maintient la connexion ouverte en arrière-plan et se reconnecte lorsqu'il est activé.

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `websocketUrl` | string | URL externe `ws://` ou `wss://` |
| `websocketHeaders` | chaîne d'objet JSON | En-têtes de handshake facultatifs |
| `websocketSubprotocols` | string | Liste facultative de sous-protocoles séparés par des virgules |
| `websocketTriggerEvents` | array | Parmi `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Reconnexion après une déconnexion |
| `retryWaitSeconds` | integer | Délai avant reconnexion |

## Événements émis

### `onMessage`

Se déclenche lorsqu'une trame arrive depuis le socket distant.

Champs utiles :

| Expression | Description |
|------------|-------------|
| `$nodeLabel.message.data` | Payload JSON analysé ou valeur brute du message |
| `$nodeLabel.message.text` | Texte décodé en UTF-8 lorsqu'il est disponible |
| `$nodeLabel.message.base64` | Payload binaire encodé en base64 |
| `$nodeLabel.message.sizeBytes` | Taille du payload |
| `$nodeLabel.message.isJson` | Indique si le message a été analysé comme JSON |

### `onConnected`

Se déclenche après l'ouverture réussie du socket.

Champs utiles :

| Expression | Description |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` à la première connexion, `true` lors des reconnexions ultérieures |
| `$nodeLabel.connection.subprotocol` | Sous-protocole négocié |

### `onClosed`

Se déclenche lorsqu'une connexion établie se ferme.

Champs utiles :

| Expression | Description |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` ou `unknown` |
| `$nodeLabel.close.code` | Code de fermeture WebSocket |
| `$nodeLabel.close.reason` | Raison de la fermeture |
| `$nodeLabel.close.wasClean` | `true` pour une fermeture normale `1000` |
| `$nodeLabel.close.reconnecting` | Indique si le nœud tentera de se reconnecter |

## Sémantique du Trigger

- Un nœud actif maintient une seule connexion socket sortante de longue durée.
- La connexion s'exécute uniquement sur le worker leader, comme pour le [Trigger IMAP](./imap-trigger-node.md) et le mode réception [RabbitMQ](./rabbitmq-node.md).
- Si la reconnexion est activée, Heym attend `retryWaitSeconds` puis rouvre le socket après une coupure.
- Chaque événement émis crée une exécution de workflow distincte avec `trigger_source = "websocket"`.

## Sécurité de sortie

- Par défaut, l'URL doit utiliser `ws://` ou `wss://` et se résoudre uniquement vers des adresses publiques. Les destinations loopback, privées, link-local, multicast et de métadonnées cloud sont bloquées.
- Heym revalide le DNS à chaque reconnexion, valide chaque adresse résolue et se connecte directement à l'une de ces adresses. Les proxys d'environnement et les redirections WebSocket sont désactivés tant que la protection est active.
- Les violations permanentes de la politique arrêtent le trigger au lieu de réessayer indéfiniment. Les échecs DNS ou réseau temporaires suivent toujours les paramètres de reconnexion du nœud.
- Les en-têtes `Authorization`, `Origin`, `User-Agent` et les en-têtes de données personnalisés sont pris en charge. `Origin` est transmis via l'option dédiée du client WebSocket. Les en-têtes `Host`, `Connection`, `Upgrade` et `Sec-WebSocket-*` ne peuvent pas être remplacés.
- Les déploiements auto-hébergés de confiance qui se connectent intentionnellement à des services internes peuvent définir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Conservez la valeur par défaut sur les déploiements hébergés ou multi-tenant.

**Note de mise à niveau pour la v0.0.105 :** cette politique à l'échelle de l'instance protège désormais également les destinations dérivées des identifiants utilisées par Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, l'exécution de LLM personnalisés et la découverte de modèles, l'assistant IA, les guardrails et les embeddings RAG. Les identifiants existants qui pointent vers des adresses loopback, privées ou link-local sont refusés, sauf si `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` est activé sur une instance auto-hébergée de confiance. Tant que la protection est active, les clients HTTP protégés ignorent `HTTP_PROXY` et `HTTPS_PROXY` ; l'activation de la dérogation les rétablit. Les bundles de CA opérateur configurés via `SSL_CERT_FILE` ou `SSL_CERT_DIR` restent pris en charge. ClickHouse est vérifié avant l'ouverture de la connexion mais n'est pas épinglé au moment du dial, car clickhouse-connect apporte son propre transport urllib3.
## Exemple de Workflow

**Flux d'événements externe → filtre → notification**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** label : `streamEvent`
- **Condition** : `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** message : `"Realtime alert: $streamEvent.message.data.title"`

## Exemple de JSON de Nœud

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## Voir aussi

- [Triggers](../reference/triggers.md) – Architecture des Triggers en arrière-plan et `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Envoyer des données vers un socket externe depuis une étape de Workflow
- [Node Types](../reference/node-types.md) – Vue d'ensemble de tous les nœuds
- [Third-Party Integrations](../reference/integrations.md) – Quels nœuds utilisent des Identifiants et lesquels n'en utilisent pas
