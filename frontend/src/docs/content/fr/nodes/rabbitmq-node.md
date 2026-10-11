# RabbitMQ

Le nœud **RabbitMQ** envoie ou reçoit des messages depuis des files et des exchanges RabbitMQ. Utilisez-le pour les Workflows pilotés par les messages et le traitement d'événements.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (réception) |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant RabbitMQ depuis [Identifiants](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Type d'opération |
| `rabbitmqExchange` | string | Nom de l'exchange (facultatif pour l'envoi) |
| `rabbitmqRoutingKey` | string | Routing key (pour l'envoi) |
| `rabbitmqQueueName` | string | Nom de la file (requis pour la réception, facultatif pour l'envoi) |
| `rabbitmqMessageBody` | expression | Corps du message pour l'envoi (prend en charge les expressions) |
| `rabbitmqDelayMs` | number | En-tête x-delay en ms (plugin de messages différés) |

## Opérations

### Envoi

Publie un message vers une file ou un exchange.

| Champ | Requis | Description |
|-------|----------|-------------|
| `rabbitmqMessageBody` | oui | Corps JSON ou chaîne |
| `rabbitmqQueueName` | facultatif | Cible directe de la file |
| `rabbitmqExchange` | facultatif | Nom de l'exchange |
| `rabbitmqRoutingKey` | facultatif | Routing key |
| `rabbitmqDelayMs` | facultatif | Délai en millisecondes |

**Sortie :** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Réception

Mode Trigger : le Workflow démarre lorsqu'un message arrive. Aucune arête entrante n'est nécessaire lorsqu'il est utilisé comme Trigger.

**Sortie :** `$nodeLabel.body` (payload du message), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Exemple – Envoi

```json
{
  "type": "rabbitmq",
  "data": {
    "label": "publishMessage",
    "credentialId": "rabbitmq-credential-uuid",
    "rabbitmqOperation": "send",
    "rabbitmqQueueName": "tasks",
    "rabbitmqMessageBody": "$userInput.body"
  }
}
```

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Triggers](../reference/triggers.md) – RabbitMQ comme Trigger de Workflow
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter des Identifiants RabbitMQ
- [Intégrations tierces](../reference/integrations.md#rabbitmq) – Configuration des Identifiants RabbitMQ et détails du plugin de délai
