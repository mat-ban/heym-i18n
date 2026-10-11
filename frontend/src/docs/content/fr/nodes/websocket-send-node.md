# WebSocket Send

Le nœud **WebSocket Send** ouvre une connexion client sortante vers un serveur WebSocket externe, envoie un message, puis ferme la connexion. Utilisez-le lorsqu'un workflow doit transmettre des événements à un système temps réel sans exposer un endpoint socket détenu par Heym.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `websocketUrl` | string / expression | URL externe `ws://` ou `wss://` |
| `websocketHeaders` | chaîne d'objet JSON / expression | En-têtes de handshake facultatifs |
| `websocketSubprotocols` | string | Liste facultative de sous-protocoles séparés par des virgules |
| `websocketMessage` | expression | Payload à envoyer |

## Règles de sérialisation des messages

- Si `websocketMessage` se résout en une **chaîne**, Heym envoie une trame texte.
- S'il se résout en un **objet**, un **tableau**, un **nombre**, un **booléen** ou `null`, Heym le sérialise en texte JSON.
- S'il se résout en **octets**, Heym envoie une trame binaire.
- Les expressions complètes telles que `$input` préservent les types natifs avant sérialisation.

## Champs de sortie

| Expression | Description |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` en cas de succès |
| `$nodeLabel.url` | URL de destination résolue |
| `$nodeLabel.message_type` | `text`, `json` ou `binary` |
| `$nodeLabel.size_bytes` | Taille du payload en octets |
| `$nodeLabel.subprotocol` | Sous-protocole négocié lorsqu'il est présent |
| `$nodeLabel.sent_at` | Horodatage ISO |

## Exemple de workflow

**Requête HTTP → transformation → publication via WebSocket**

```
input → set → websocketSend → output
```

- **Set** crée un objet payload tel que `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** utilise `$payloadNode` comme `websocketMessage`
- **Output** peut renvoyer `$socketSend.status`

## Exemple de JSON de nœud

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Remarques

- Aucun [identifiant](../reference/credentials.md) n'est requis pour ce nœud.
- Si le serveur distant attend une authentification ou des en-têtes de tenant, transmettez-les via `websocketHeaders`.
- Utilisez [HTTP](./http-node.md) lorsque le système distant est basé sur un modèle requête/réponse plutôt que sur un socket.

## Sécurité de sortie

- Par défaut, l'URL doit utiliser `ws://` ou `wss://` et se résoudre uniquement vers des adresses publiques. Les destinations loopback, privées, link-local, multicast et de métadonnées cloud sont bloquées.
- Heym valide chaque adresse résolue et se connecte directement à l'une de ces adresses. Les proxys d'environnement et les redirections WebSocket sont désactivés tant que la protection est active.
- Les en-têtes `Authorization`, `Origin`, `User-Agent` et les en-têtes de données personnalisés sont pris en charge. `Origin` est transmis via l'option dédiée du client WebSocket. Les en-têtes `Host`, `Connection`, `Upgrade` et `Sec-WebSocket-*` ne peuvent pas être remplacés.
- Les déploiements auto-hébergés de confiance qui se connectent intentionnellement à des services internes peuvent définir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Conservez la valeur par défaut sur les déploiements hébergés ou multi-tenant.

**Note de mise à niveau pour la v0.0.105 :** cette politique à l'échelle de l'instance protège désormais également les destinations dérivées d'identifiants utilisées par Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, l'exécution personnalisée de LLM et la découverte de modèles, l'assistant IA, les guardrails et les embeddings RAG. Les identifiants existants qui pointent vers des adresses loopback, privées ou link-local sont refusés, sauf si `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` est activé sur une instance auto-hébergée de confiance. Tant que la protection est active, les clients HTTP protégés ignorent `HTTP_PROXY` et `HTTPS_PROXY` ; l'activation de l'option de désactivation les rétablit. Les bundles de CA opérateur configurés via `SSL_CERT_FILE` ou `SSL_CERT_DIR` restent pris en charge. ClickHouse est vérifié avant l'ouverture de la connexion mais n'est pas épinglé au moment du dial, car clickhouse-connect embarque son propre transport urllib3.

## Voir aussi

- [WebSocket Trigger](./websocket-trigger-node.md) – Écouter un socket externe et déclencher des workflows sur événements
- [Types de nœuds](../reference/node-types.md) – Aperçu des nœuds d'intégration
- [Expression DSL](../reference/expression-dsl.md) – Construire des payloads JSON dynamiques
- [Intégrations tierces](../reference/integrations.md) – Intégrations basées sur identifiants vs configuration directe
