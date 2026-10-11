# Telegram

Le nœud **Telegram** envoie un message via l'API Telegram Bot. Utilisez-le pour les réponses de chat, les alertes opérationnelles, les mises à jour de statut de Workflow ou toute étape en aval devant envoyer un message à un utilisateur, un groupe ou un canal Telegram.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant `telegram` contenant le token du bot |
| `chatId` | expression | ID du chat, du groupe ou du canal de destination |
| `message` | expression | Texte du message sortant. Prend en charge les [expressions](../reference/expression-dsl.md). |

## Configuration

1. Créez un [Identifiant Telegram Bot](../reference/integrations.md#telegram)
2. Ajoutez le nœud **Telegram** à votre Workflow
3. Sélectionnez l'Identifiant
4. Définissez `chatId` sur un ID de chat statique ou une expression telle que `$telegramEvent.message.chat.id`
5. Définissez `message` sur le texte sortant ou un modèle construit à partir des données en amont

## Exemple

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Champs de sortie

| Expression | Description |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` en cas de succès |
| `$nodeLabel.ok` | Indicateur de succès de l'API Telegram |
| `$nodeLabel.result` | Objet de résultat brut `sendMessage` renvoyé par Telegram |
| `$nodeLabel.result.message_id` | ID du message Telegram |
| `$nodeLabel.result.chat.id` | ID du chat de destination renvoyé par Telegram |

## Cas d'usage courants

- Associez-le au [Telegram Trigger](./telegram-trigger-node.md) pour des bots conversationnels
- Envoyez des notifications d'erreur depuis le [Error Handler](./error-handler-node.md)
- Publiez des résumés générés par [LLM](./llm-node.md) ou [Agent](./agent-node.md)

## Voir aussi

- [Telegram Trigger](./telegram-trigger-node.md) – Démarrer un Workflow à partir des messages entrants du bot
- [Third-Party Integrations](../reference/integrations.md) – Configuration de l'Identifiant Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Ajouter et gérer les Identifiants `telegram`
- [Node Types](../reference/node-types.md) – Aperçu de tous les types de nœuds
