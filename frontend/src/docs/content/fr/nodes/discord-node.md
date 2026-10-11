# Discord

Le nœud **Discord** envoie un message vers un canal Discord via un Incoming Webhook. Utilisez-le pour les alertes, les notifications de workflow, les réponses de type bot et le signalement d'erreurs.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant `discord` contenant l'URL du webhook entrant |
| `message` | expression | Texte du message sortant. Prend en charge les [expressions](../reference/expression-dsl.md). |
| `username` | expression | Nom d'affichage facultatif à substituer pour ce message |
| `avatarUrl` | expression | URL d'avatar facultative à substituer pour ce message |

## Configuration

1. Créez un [identifiant Discord Webhook](../reference/integrations.md#discord)
2. Ajoutez le nœud **Discord** à votre workflow
3. Sélectionnez l'identifiant
4. Définissez `message` sur le texte sortant ou sur un modèle construit à partir des données en amont
5. Substituez éventuellement le `username` d'affichage et l'`avatarUrl`

## Exemple

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Champs de sortie

| Expression | Description |
|------------|-------------|
| `$nodeLabel.status` | Code de statut HTTP renvoyé par Discord, généralement `204` en cas de succès |
| `$nodeLabel.response` | Corps de réponse brut renvoyé par le webhook Discord |
| `$nodeLabel.message` | Texte du message envoyé par Heym |
| `$nodeLabel.username` | Nom d'utilisateur envoyé avec le webhook, s'il est fourni |
| `$nodeLabel.avatar_url` | URL d'avatar envoyée avec le webhook, si elle est fournie |

## Schémas courants

- Utilisez-le conjointement avec le [Discord Trigger](./discord-trigger-node.md) lorsque vous souhaitez publier un message supplémentaire dans le canal au-delà de la réponse à l'interaction
- Envoyez des notifications d'échec depuis le [Error Handler](./error-handler-node.md)
- Publiez des résumés générés par [LLM](./llm-node.md) ou [Agent](./agent-node.md)

## Sécurité de sortie

- L'URL du webhook stockée dans l'identifiant doit utiliser `http://` ou `https://` et ne résoudre que vers des adresses publiques. Les destinations loopback, privées, link-local, multicast et de métadonnées cloud sont bloquées.
- Heym valide les adresses résolues et fixe la cible de connexion avant l'envoi, de sorte qu'une réponse DNS ne puisse pas rediriger la requête vers une adresse interne après la vérification. Les proxys d'environnement sont désactivés tant que la protection est active, et les redirections ne sont pas suivies.
- Les déploiements qui publient vers un récepteur de webhook interne peuvent définir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` sur une instance auto-hébergée de confiance. Conservez la valeur par défaut sur les déploiements hébergés ou multi-tenant.

**Note de mise à niveau pour la v0.0.109 :** cette vérification est nouvelle pour Discord. Un identifiant dont l'URL de webhook pointe vers une adresse loopback ou privée est refusé, sauf si le paramètre ci-dessus est activé.

## Voir aussi

- [Discord Trigger](./discord-trigger-node.md) – Démarrer un workflow à partir d'interactions Discord entrantes
- [Third-Party Integrations](../reference/integrations.md) – Configuration de l'identifiant Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Ajouter et gérer les identifiants `discord`
- [Node Types](../reference/node-types.md) – Aperçu de tous les types de nœuds
