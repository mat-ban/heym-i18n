# Teams

Les Teams vous permettent de partager des workflows, des identifiants, des variables globales, des bases vectorielles et des fichiers Drive avec un groupe d'utilisateurs en une seule fois.

## Aperçu

- **Team** – Un groupe nommé avec un créateur et des membres
- **Créateur** – Toujours membre ; peut modifier la team, supprimer la team, ajouter des membres
- **Membre** – Peut ajouter et retirer d'autres membres (sauf le créateur) ; a accès aux ressources partagées avec la team

## Création et gestion des Teams

Créez des teams depuis l'[onglet Teams](../tabs/teams-tab.md). Ajoutez des membres par email ; ils doivent disposer d'un compte. Le créateur ne peut pas être retiré. La suppression d'une team supprime tous les partages de la team.

## Modèle de partage

Les ressources peuvent être partagées avec :

1. **Des utilisateurs individuels** – Par email (partage utilisateur à utilisateur)
2. **Des Teams** – En sélectionnant une team (partage de team)

Les deux modèles sont cumulatifs. Un utilisateur obtient l'accès s'il est soit :

- Directement destinataire d'un partage (partage utilisateur), soit
- Membre d'une team bénéficiant d'un partage de team

## Ce qui peut être partagé avec les Teams

| Ressource | Emplacement du partage |
|----------|----------------|
| Workflows | Boîte de dialogue de partage dans l'éditeur de workflow |
| Modèles de workflow | Boîte de dialogue de partage lors de la création/modification d'un modèle de workflow |
| Modèles de nœud | Boîte de dialogue de partage lors de la création/modification d'un modèle de nœud |
| Identifiants | Boîte de dialogue de partage dans l'onglet Identifiants |
| Variables globales | Boîte de dialogue de partage dans l'onglet Variables |
| Bases vectorielles | Boîte de dialogue de partage dans l'onglet Vectors |
| Fichiers Drive | Boîte de dialogue de partage dans l'onglet Drive ou opérations `shareWithMyTeams` / `unshareWithMyTeams` du Nœud Drive |

Pour les modèles, lorsque la visibilité est **Specific users**, vous pouvez également sélectionner des teams. Tous les membres des teams sélectionnées obtiennent l'accès au modèle.
Les partages de fichiers Drive avec une team sont en lecture seule pour les membres de la team ; le propriétaire du fichier conserve les permissions de gestion.

## Endpoints API

- `GET /api/teams` – Liste les teams auxquelles l'utilisateur appartient
- `GET /api/teams/{id}` – Récupère les détails d'une team avec ses membres
- `GET /api/teams/{id}/shared-entities` – Renvoie les entités partagées avec la team (workflows, identifiants, variables globales, bases vectorielles, fichiers, modèles de workflow, modèles de nœud)
- `POST /api/teams` – Crée une team
- `PATCH /api/teams/{id}` – Met à jour une team
- `DELETE /api/teams/{id}` – Supprime une team (créateur uniquement)
- `POST /api/teams/{id}/members` – Ajoute un membre (body : `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Retire un membre

Partages de team par ressource :

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – le body du POST accepte `permission` (`read` ou `write`, par défaut `write`) ; publier à nouveau une team existante met à jour sa permission
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Voir aussi

- [Onglet Teams](../tabs/teams-tab.md) – Créer et gérer des teams
- [Onglet Modèles](../tabs/templates-tab.md) – Partager des modèles de workflow et de nœud avec des teams
- [Partage d'identifiants](./credentials-sharing.md) – Partager des identifiants avec des utilisateurs et des teams
- [Organisation des workflows](./workflow-organization.md) – Dossiers et partage de workflows
