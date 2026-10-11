# Tokens d'exécution

Les tokens d'exécution sont des JWT à portée limitée qui accordent l'accès aux endpoints d'exécution et de streaming d'un seul workflow. Ils vous permettent d'appeler un workflow depuis des systèmes externes sans exposer votre token de session utilisateur de longue durée.

## Pourquoi utiliser des tokens d'exécution

Lorsque l'authentification d'un workflow est définie sur **JWT**, l'endpoint requiert normalement une session utilisateur valide. Les tokens d'exécution vous permettent de :

- Partager un token appelable avec des scripts externes, des pipelines CI ou des intégrations sans partager les identifiants de votre compte.
- Limiter l'exposition — un token n'est valide que pour un workflow spécifique.
- Révoquer l'accès instantanément sans modifier votre mot de passe ni renouveler les tokens de session.
- Choisir entre des tokens à courte durée de vie (minutes ou heures) et des tokens à longue durée de vie (jusqu'à 10 ans).

## Créer un token

Ouvrez la boîte de dialogue **Run with cURL** dans l'éditeur (barre d'outils en haut à droite). Lorsque l'authentification du workflow est définie sur **JWT Token**, la boîte de dialogue affiche un gestionnaire de tokens :

1. Choisissez **Short-lived** ou **Long-lived (10yr)**.
2. Pour les tokens à courte durée de vie, saisissez la durée en secondes (minimum 60).
3. Cliquez sur **+ New Token**.

Le token est créé immédiatement, ajouté à la liste et sélectionné automatiquement afin que la commande cURL soit mise à jour pour l'inclure.

## Liste des tokens

Chaque ligne de token affiche :

| Colonne | Description |
|--------|-------------|
| Created | Horodatage de création |
| Status | **Expires:** date, **Expired** ou **Revoked** |
| Eye icon | Afficher/masquer la valeur du token |
| Revoke button | Marquer le token comme révoqué (irréversible) |

Cliquez sur n'importe quelle ligne active (non expirée, non révoquée) pour la sélectionner. Le token sélectionné est intégré à l'aperçu de la commande cURL.

Les tokens expirés et révoqués restent visibles dans la liste mais ne peuvent pas être sélectionnés.

## Utiliser un token

Copiez la valeur du token depuis la liste (cliquez sur l'icône en forme d'œil pour la révéler) et incluez-la en tant que token `Bearer` :

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Lorsque vous utilisez **Copy cURL** dans la boîte de dialogue avec un token sélectionné, le token est déjà intégré à la commande — aucune substitution manuelle n'est nécessaire.

## Portée du token

Chaque token porte les claims JWT suivants :

| Claim | Valeur |
|-------|--------|
| `sub` | ID utilisateur du créateur du token |
| `wid` | UUID du workflow — le token est rejeté pour tout autre workflow |
| `scope` | `workflow:execute` — le distingue d'un token de session utilisateur |
| `jti` | ID unique du token utilisé pour les recherches de révocation |
| `exp` | Horodatage d'expiration |

Le backend vérifie l'ensemble de ces éléments à chaque requête : validité de la signature, expiration, correspondance du `wid` et absence de révocation du `jti`.

## Révocation

Cliquez sur le bouton de révocation (cercle barré) à côté d'un token pour le révoquer. La révocation prend effet immédiatement — les requêtes suivantes utilisant ce token renvoient `401`. La ligne du token reste visible dans la liste avec le libellé **Revoked**.

Il n'existe pas d'annulation de révocation. Créez un nouveau token si vous devez restaurer l'accès.

## API

Les endpoints de gestion des tokens sont authentifiés avec votre session habituelle.

| Méthode | Chemin | Description |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Créer un token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Lister vos tokens pour ce workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Révoquer un token |

**Corps de la requête de création :**

```json
{ "ttl_seconds": 900 }
```

**Réponse de création :**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Le champ `token` n'est renvoyé qu'une seule fois, à la création. Stockez-le immédiatement ; les requêtes `GET` suivantes renvoient la même ligne, mais vous pouvez également le révéler dans la boîte de dialogue cURL à tout moment.

## Portée de visibilité

Chaque utilisateur ne voit que les tokens qu'il a créés. Les membres de l'équipe ayant accès à un workflow partagé ne peuvent pas voir les tokens des autres.

## Voir aussi

- [Webhooks](./webhooks.md) — endpoints de Trigger HTTP et boîte de dialogue cURL
- [Security](./security.md) — gestion des sessions et vue d'ensemble de l'authentification
- [SSE Streaming](./sse-streaming.md) — utiliser les tokens d'exécution avec l'endpoint de streaming
