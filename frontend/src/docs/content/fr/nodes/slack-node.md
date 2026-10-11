# Slack

Le nœud **Slack** envoie un message vers un canal Slack via un Incoming Webhook. Utilisez-le pour les notifications, les alertes et le signalement d'erreurs.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | Transmet l'entrée |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant Slack (URL du webhook) issu de l'onglet [Identifiants](../tabs/credentials-tab.md) |
| `message` | expression | Texte du message. Prend en charge les [expressions](../reference/expression-dsl.md). |

## Configuration

1. Créez un Incoming Webhook dans votre espace de travail Slack
2. Ajoutez un identifiant Slack dans l'onglet Identifiants avec l'URL du webhook
3. Référencez l'identifiant dans le nœud

## Exemple

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

À utiliser avec le [Error Handler](./error-handler-node.md) pour les notifications d'échec :
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Sécurité des sorties

- L'URL du webhook stockée dans l'identifiant doit utiliser `http://` ou `https://` et ne résoudre que vers des adresses publiques. Les destinations loopback, privées, link-local, multicast et de métadonnées cloud sont bloquées.
- Heym valide les adresses résolues et fixe la cible de connexion avant l'envoi, de sorte qu'une réponse DNS ne puisse pas rediriger la requête vers une adresse interne après la vérification. Les proxys d'environnement sont désactivés tant que la protection est active, et les redirections ne sont pas suivies.
- Les déploiements qui envoient vers un récepteur de webhook interne peuvent définir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` sur une instance auto-hébergée de confiance. Conservez la valeur par défaut sur les déploiements hébergés ou multi-tenant.

**Note de mise à niveau pour la v0.0.109 :** cette vérification est nouvelle pour Slack. Un identifiant dont l'URL de webhook pointe vers une adresse loopback ou privée est refusé, sauf si le paramètre ci-dessus est activé.

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Error Handler](./error-handler-node.md) – Envoyer un message Slack en cas d'échec du workflow
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter un webhook Slack
