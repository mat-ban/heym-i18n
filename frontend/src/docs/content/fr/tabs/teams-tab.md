# Onglet Teams

L'onglet **Teams** permet de créer et de gérer des équipes afin de partager des workflows, des identifiants, des variables, des bases vectorielles et des fichiers Drive avec des groupes d'utilisateurs.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Regarder la démo Teams</a></p>

## Création d'une équipe

1. Cliquez sur **New Team**
2. Saisissez un nom et une description facultative
3. Cliquez sur **Create**

Vous devenez automatiquement le créateur de l'équipe et son premier membre.

## Gestion des membres

- **Ajouter un membre** – Saisissez l'adresse e-mail d'un utilisateur dans la boîte de dialogue de détail de l'équipe, puis cliquez sur **Add**
- **Supprimer un membre** – Cliquez sur le X en regard d'un membre (le créateur ne peut pas être supprimé)
- **Modifier l'équipe** – Les créateurs peuvent modifier le nom et la description
- **Supprimer l'équipe** – Les créateurs peuvent supprimer l'équipe ; tous les partages associés à l'équipe sont supprimés
- **Ressources partagées** – La boîte de dialogue de détail de l'équipe affiche les workflows, identifiants, variables, bases vectorielles, fichiers Drive, modèles de workflow et modèles de nœud partagés avec l'équipe. Cliquez sur un workflow pour l'ouvrir dans l'éditeur ; basculez vers l'onglet correspondant pour les autres ressources.

## Partage avec les équipes

Partagez des ressources avec des équipes depuis :

- **Workflows** – Boîte de dialogue de partage dans l'éditeur de workflow
- **Modèles de workflow** – Boîte de dialogue de partage lors de la création ou de la modification d'un modèle de workflow (visibilité : Specific users)
- **Modèles de nœud** – Boîte de dialogue de partage lors de la création ou de la modification d'un modèle de nœud (visibilité : Specific users)
- **Identifiants** – Boîte de dialogue de partage dans l'onglet Credentials
- **Variables** – Boîte de dialogue de partage dans l'onglet Variables
- **Bases vectorielles** – Boîte de dialogue de partage dans l'onglet Vectors
- **Dashboards** – Paramètres du dashboard dans l'onglet Dashboard (lecture ou écriture)
- **Fichiers Drive** – Boîte de dialogue de partage dans l'onglet Drive ou opérations `shareWithMyTeams` / `unshareWithMyTeams` du nœud Drive

Lorsque vous partagez une ressource avec une équipe, tous les membres de l'équipe y accèdent. Consultez [Teams](../reference/teams.md) pour plus de détails.

Lorsque vous partagez un workflow avec une équipe, partagez également avec la même équipe les identifiants et les sous-workflows dont ce workflow dépend. L'accès au workflow seul ne confère pas l'accès aux identifiants ni aux workflows enfants.

## Intégration au Chat

L'assistant IA de l'[onglet Chat](./chat-tab.md) peut lister vos équipes. Demandez « my teams » pour voir les équipes auxquelles vous appartenez.

## Voir aussi

- [Teams](../reference/teams.md) – Référence Teams et modèle de partage
- [Credentials Sharing](../reference/credentials-sharing.md) – Partager des identifiants avec des utilisateurs et des équipes
- [Workflow Organization](../reference/workflow-organization.md) – Dossiers et partage
- [Contextual Showcase](../reference/contextual-showcase.md) – Guide de page compact pour les surfaces du dashboard
