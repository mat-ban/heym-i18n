# Discord Trigger

Le nœud **Discord Trigger** est un point d'entrée sans entrée qui reçoit les webhooks de l'API Discord Interactions et démarre automatiquement un workflow. Utilisez-le pour les slash commands, les boutons, les modales et autres interactions d'application Discord qui doivent alimenter les nœuds IA ou d'intégration en aval.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 |
| Sorties | 1 |
| Sortie | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant `discord_trigger` contenant la clé publique de l'application Discord |

## Guide de configuration

### 1. Créer un identifiant `discord_trigger`

1. Accédez à **Settings → Credentials → New Credential**
2. Sélectionnez le type **Discord Trigger (Public Key)**
3. Collez la **Application Public Key** depuis le Discord Developer Portal :
   - **Your application → General Information → Public Key**
4. Enregistrez l'identifiant

### 2. Ajouter le nœud à votre workflow

1. Glissez **Discord Trigger** sur le canvas
2. Sélectionnez le nœud pour ouvrir le panneau Properties
3. Choisissez votre identifiant `discord_trigger`
4. Copiez l'**Interactions URL** affichée dans le panneau du nœud

### 3. Enregistrer l'endpoint Interactions dans Discord

1. Ouvrez le [Discord Developer Portal](https://discord.com/developers/applications)
2. Sélectionnez votre application
3. Accédez à **General Information** ou **Interactions**
4. Collez l'**Interactions Endpoint URL** du nœud dans le champ endpoint
5. Discord envoie une requête `PING` pour valider l'endpoint et Heym répond automatiquement après vérification de la signature
6. Enregistrez vos modifications

## Champs de sortie

Une fois le nœud déclenché, les nœuds en aval peuvent accéder à :

| Expression | Description |
|------------|-------------|
| `$nodeLabel.interaction` | Payload complet de l'interaction Discord |
| `$nodeLabel.type` | Type d'interaction |
| `$nodeLabel.data` | Payload de commande, bouton ou modale |
| `$nodeLabel.data.name` | Nom de la slash command, le cas échéant |
| `$nodeLabel.data.options` | Tableau des options de la slash command |
| `$nodeLabel.headers` | En-têtes webhook assainis |
| `$nodeLabel.triggered_by` | Libellé de la source du Trigger (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID du nœud du canvas ayant reçu l'interaction Discord |
| `$nodeLabel.triggered_at` | Horodatage ISO de cette exécution de workflow |

## Exemple de workflow

**Slash command Discord → LLM → Output**

```
discordTrigger → llm → output
```

- Libellé du **Discord Trigger** : `discordEvent`
- Message utilisateur du **LLM** : `"Reply to this Discord command: $discordEvent.data.name"`
- Message de l'**Output** : `$llm.text`

## Sécurité

- Les requêtes sont vérifiées à l'aide d'**Ed25519** avec la clé publique de votre application
- Les horodatages de plus de **5 minutes** sont rejetés afin de réduire les attaques par rejeu
- Les en-têtes sensibles (`x-signature-ed25519`, `authorization`, etc.) sont supprimés avant que les données n'atteignent les nœuds en aval
- Le Trigger nécessite un identifiant `discord_trigger` valide ; les requêtes sont rejetées si l'identifiant est manquant ou invalide

## Remarques

- Heym renvoie immédiatement une réponse Discord différée, exécute le workflow en arrière-plan et publie la sortie finale du workflow en tant que follow-up Discord lorsqu'un nœud `Output` produit du contenu
- L'URL des interactions est dérivée de l'ID du nœud et reste stable même si le workflow est renommé
- Utilisez un [Discord Node](./discord-node.md) classique uniquement lorsque vous souhaitez également un post webhook distinct en plus du follow-up d'interaction
- Un seul nœud `discordTrigger` suffit généralement ; utilisez **Switch** ou **Condition** en aval pour router les différents types d'interaction

## Voir aussi

- [Discord Node](./discord-node.md) – Envoyer des messages Discord sortants
- [Triggers](../reference/triggers.md) – Aperçu de tous les points d'entrée de workflow
- [Third-Party Integrations](../reference/integrations.md) – Configuration des identifiants Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Ajouter et gérer les identifiants `discord_trigger`
