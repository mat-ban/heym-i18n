# Trigger Telegram

Le nœud **Trigger Telegram** est un point d'entrée sans entrée qui démarre un workflow lorsque votre bot Telegram reçoit une mise à jour via webhook. Utilisez-le pour les chatbots, le triage du support, les commandes de type slash ou les callbacks de boutons inline qui doivent alimenter les nœuds IA et d'intégration en aval.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 |
| Sorties | 1 |
| Sortie | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant `telegram` contenant le token du bot et, en option, le token secret du webhook |

## Guide de configuration

### 1. Créer un identifiant `telegram`

1. Accédez à **Settings → Credentials → New Credential**
2. Sélectionnez le type **Telegram Bot**
3. Collez le **Bot Token** fourni par BotFather
4. Définissez éventuellement un **Webhook Secret Token** si vous souhaitez que Telegram envoie un en-tête de vérification correspondant
5. Enregistrez l'identifiant

### 2. Ajouter le nœud à votre workflow

1. Glissez **Telegram Trigger** sur le canvas
2. Sélectionnez le nœud pour ouvrir le panneau Properties
3. Choisissez votre identifiant `telegram`
4. Copiez l'**URL du Webhook** affichée dans le panneau du nœud

### 3. Enregistrer le webhook auprès de Telegram

Utilisez la méthode `setWebhook` de la Bot API avec l'URL du nœud :

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Si vous avez configuré un token secret dans Heym, envoyez la même valeur lors de la configuration du webhook :

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Champs de sortie

Une fois le nœud déclenché, les nœuds en aval peuvent accéder à :

| Expression | Description |
|------------|-------------|
| `$nodeLabel.update` | Payload complet de la mise à jour Telegram |
| `$nodeLabel.message` | Objet principal de type message issu de la mise à jour |
| `$nodeLabel.message.text` | Texte du message entrant |
| `$nodeLabel.message.chat.id` | ID du chat pour répondre en aval |
| `$nodeLabel.message.from.id` | ID utilisateur Telegram |
| `$nodeLabel.callback_query` | Payload de callback lorsque la mise à jour provient d'un clavier inline |
| `$nodeLabel.headers` | En-têtes du webhook assainis |
| `$nodeLabel.triggered_by` | Libellé de la source du Trigger (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID du nœud du canvas ayant reçu la mise à jour Telegram |
| `$nodeLabel.triggered_at` | Horodatage ISO de cette exécution du workflow |

## Exemple de workflow

**Message Telegram → LLM → Réponse Telegram**

```
telegramTrigger → llm → telegram
```

- Libellé du **Trigger Telegram** : `telegramEvent`
- Message utilisateur du **LLM** : `"Reply briefly to this user message: $telegramEvent.message.text"`
- chatId du nœud **Telegram** : `$telegramEvent.message.chat.id`

## Sécurité

- Si votre identifiant possède un `secret_token`, Heym vérifie `x-telegram-bot-api-secret-token` avant d'exécuter le workflow.
- Les en-têtes de requête sensibles sont supprimés avant que le payload n'atteigne les nœuds en aval.
- L'URL du webhook est statique pour l'ID du nœud ; vous ne devez donc la réenregistrer que lorsque le nœud lui-même change.

## Voir aussi

- [Nœud Telegram](./telegram-node.md) – Envoyer une réponse ou une notification sortante
- [Triggers](../reference/triggers.md) – Aperçu de tous les points d'entrée de workflow
- [Intégrations tierces](../reference/integrations.md) – Configuration de l'identifiant Telegram
- [Onglet Credentials](../tabs/credentials-tab.md) – Ajouter et gérer les identifiants `telegram`
