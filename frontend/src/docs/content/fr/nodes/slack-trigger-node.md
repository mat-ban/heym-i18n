# Slack Trigger

Le nœud **Slack Trigger** est un point d'entrée sans entrée qui reçoit les webhooks de l'API Slack Events et démarre automatiquement un workflow. Il gère le challenge de vérification d'URL de Slack et vérifie les signatures des requêtes à l'aide d'un signing secret.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 |
| Sorties | 1 |
| Sortie | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant `slack_trigger` contenant le signing secret |

## Guide de configuration

### 1. Créer un identifiant `slack_trigger`

1. Accédez à **Settings → Credentials → New Credential**
2. Sélectionnez le type **Slack Trigger (Signing Secret)**
3. Collez le **Signing Secret** de votre application Slack :
   - Dans Slack : **App settings → Basic Information → App Credentials → Signing Secret**
4. Enregistrez l'identifiant

### 2. Ajouter le nœud à votre workflow

1. Ouvrez le canvas du workflow
2. Faites glisser **Slack Trigger** depuis le panneau des nœuds vers le canvas
3. Cliquez sur le nœud pour ouvrir le panneau Properties
4. Sélectionnez votre identifiant `slack_trigger`
5. Copiez l'**URL du Webhook** affichée dans le panneau

### 3. Configurer votre application Slack

1. Dans les paramètres de votre application Slack, accédez à **Event Subscriptions**
2. Activez **Enable Events**
3. Collez l'URL du Webhook dans le champ **Request URL**
4. Slack envoie un challenge de vérification d'URL — Heym y répond automatiquement en quelques millisecondes
5. Le champ devient vert : ✓ Verified
6. Abonnez-vous aux **Bot Events** dont vous avez besoin (par ex. `message.channels`, `reaction_added`)
7. Enregistrez vos modifications et réinstallez l'application sur votre espace de travail si cela vous est demandé

## Champs de sortie

Une fois le nœud déclenché, les nœuds en aval peuvent accéder à :

| Expression | Description |
|------------|-------------|
| `$nodeLabel.event` | Objet d'événement Slack complet |
| `$nodeLabel.event.type` | Type d'événement (par ex. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Texte du message (le cas échéant) |
| `$nodeLabel.event.user` | ID de l'utilisateur Slack ayant déclenché l'événement |
| `$nodeLabel.event.channel` | ID du canal |
| `$nodeLabel.event.ts` | Horodatage de l'événement |
| `$nodeLabel.headers` | En-têtes HTTP nettoyés provenant de Slack |
| `$nodeLabel.triggered_by` | Libellé de la source du Trigger (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID du nœud du canvas ayant reçu l'événement Slack |

## Exemple de workflow

**Message Slack → Réponse LLM → Envoi Slack :**

```
slackTrigger → llm → slack
```

- Libellé **slackTrigger** : `slackEvent`
- Message utilisateur **LLM** : `"Reply to this Slack message: $slackEvent.event.text"`
- Message **Slack** : `$llm.text`

## Sécurité

- Les requêtes sont vérifiées à l'aide de **HMAC-SHA256** avec votre signing secret
- Les horodatages datant de plus de **5 minutes** sont rejetés (prévention des attaques par rejeu)
- Les en-têtes sensibles (`x-slack-signature`, `authorization`, etc.) sont supprimés avant d'atteindre les nœuds en aval
- Si aucun identifiant n'est défini, le nœud s'exécute sans vérification — recommandé uniquement pour les tests locaux

## Remarques

- Heym répond immédiatement avec `200 OK` et exécute le workflow en arrière-plan — cela satisfait l'exigence de réponse en 3 secondes de Slack
- L'URL du Webhook est dérivée de l'ID du nœud et ne change jamais, même après un renommage du workflow
- Un seul nœud `slackTrigger` par workflow est nécessaire ; utilisez des nœuds **Switch** ou **Condition** en aval pour router les différents types d'événements
