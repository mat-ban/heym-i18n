# A2A

Heym dessert le **Heym Agent** via le protocole Agent2Agent (A2A 1.0, liaison JSON-RPC). Le Heym Agent est le moteur au cœur de l'[Onglet Chat](../tabs/chat-tab.md) ; les clients MCP accèdent au même agent en tant qu'outil `heym_chat` (voir l'[Onglet MCP / A2A](../tabs/mcp-tab.md)). Lorsque A2A est activé, un autre agent peut lui transmettre une Task en langage naturel et recevoir la réponse, avec l'ensemble des capacités du Chat.

## Activer A2A

1. Ouvrez l'onglet **MCP / A2A**.
2. Activez le **Heym Agent** sur le serveur par défaut ou sur un serveur nommé, puis choisissez son identifiant et son modèle.
3. Cochez **Activer A2A**. La carte affiche l'URL de l'**Agent Card** ainsi que l'**Endpoint JSON-RPC**.

A2A repose directement sur le Heym Agent : désactiver l'agent désactive également A2A.

## Endpoints

| | Serveur par défaut | Serveur nommé |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

L'Agent Card ne requiert aucun identifiant et ne mentionne aucun utilisateur, serveur ou Workflow. Elle n'existe que tant qu'A2A est actif : la carte de domaine tant qu'au moins un utilisateur a activé A2A pour le serveur par défaut, la carte d'un serveur nommé tant qu'A2A est activé pour ce serveur. Dans le cas contraire, l'adresse renvoie une erreur 404.

## Authentification

Transmettez les mêmes identifiants que pour MCP, uniquement dans les en-têtes :

- `X-MCP-Key: <key>` : la clé du serveur par défaut ou la clé du serveur nommé
- `Authorization: Bearer <token>` : un Token OAuth émis par le serveur OAuth de Heym

Les identifiants dans l'URL sont rejetés. L'Agent Card déclare les deux méthodes, permettant à un client A2A de les lire depuis la carte.

## Méthodes

| Méthode | Description |
|---|---|
| `SendMessage` | Démarre une Task ou en poursuit une en attente d'entrée. Attend la réponse à moins que `configuration.returnImmediately` ne vaille `true`. |
| `SendStreamingMessage` | Identique, sous forme de flux Server-Sent Events restituant la progression et le résultat de la Task. |
| `GetTask` | État, réponse et historique d'une Task (`historyLength` limite la taille de l'historique). |
| `ListTasks` | Vos Tasks sur ce serveur, de la plus récente à la plus ancienne, filtrées par `contextId` ou `status`, avec `pageSize` et `pageToken`. |
| `CancelTask` | Interrompt une Task en cours d'exécution ou en attente. |
| `SubscribeToTask` | Suit une Task en cours d'exécution. |
| `GetExtendedAgentCard` | La carte complétée avec le nom du serveur et ses Workflows attribués comme compétences. |

Les notifications push ne sont pas proposées : la carte indique `pushNotifications: false`, et les méthodes push renvoient `PushNotificationNotSupportedError`. Les requêtes utilisent A2A 1.0 ; transmettez `A2A-Version: 1.0`. Les noms de méthodes d'A2A 0.3 tels que `message/send` répondent par `VersionNotSupportedError`.

## Tasks et conversations

Chaque Task constitue une conversation dans l'onglet Chat, signalée par une icône réseau. Le `contextId` de la Task correspond à cette conversation : envoyez un nouveau message avec le même `contextId` et sans `taskId` pour la poursuivre.

| Action de l'agent | État de la Task |
|---|---|
| A répondu | `TASK_STATE_COMPLETED`, avec la réponse au format texte et, le cas échéant, les liens vers les Workflows et suites d'évaluation en tant que données |
| A posé une question de clarification | `TASK_STATE_INPUT_REQUIRED` : répondez avec le même `taskId` |
| Requiert un identifiant | `TASK_STATE_AUTH_REQUIRED` : le message de statut contient un lien vers la page des identifiants de Heym. L'utilisateur l'ouvre dans un navigateur connecté à Heym ; la valeur ne transite jamais par l'autre agent. Envoyez ensuite un message sur la même Task pour continuer. |
| A échoué | `TASK_STATE_FAILED`, avec le motif de l'échec |
| A été annulée | `TASK_STATE_CANCELED` |

Un message adressé à une Task terminée ou encore en cours de traitement est rejeté avec `UnsupportedOperationError`. Les messages acceptent des parties `text` et `data`, jusqu'à un total de 20 000 caractères combinés ; les fichiers sont refusés, transmettez les fichiers sous forme de liens.

## Progression

Pendant l'exécution d'une Task, le flux transmet une mise à jour d'état pour chaque étape, reprenant les termes affichés par l'onglet Chat, par exemple `Running workflow "Invoice Parser"` ou `Testing the workflow · attempt 2/5`. Les clients MCP reçoivent ces mêmes étapes sous forme de `notifications/progress` via `heym_chat`.

## Exemple

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## Limites

- `CancelTask` interrompt immédiatement un tour en cours sur l'instance Heym qui l'exécute, tout comme le bouton Stop de l'onglet Chat. Ailleurs, la Task est marquée comme annulée et le résultat tardif du tour n'est pas enregistré.
- Aucune notification push, aucune liaison REST ou gRPC, aucune Agent Card signée.

## Voir aussi

- [Onglet MCP / A2A](../tabs/mcp-tab.md) : activer le Heym Agent et A2A
- [Onglet Chat](../tabs/chat-tab.md) : le moteur sous-jacent de l'agent
- [Sécurité](./security.md) : mode de stockage des clés
