# Onglet Drive

L'onglet Drive affiche tous les fichiers générés par les skills dans l'ensemble de vos workflows.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Regarder la démo Drive</a></p>

## Présentation

Les fichiers générés par les skills (PDF, DOCX, CSV, images, etc.) sont automatiquement stockés et répertoriés dans l'onglet Drive. Chaque fichier affiche son nom, son type, sa taille, son nœud source, sa date de création et son état de partage avec les équipes.

## Fonctionnalités

- **Recherche** - Filtrez les fichiers par nom, type ou nœud source
- **Copier l'ID du fichier** - Copiez l'UUID du fichier dans le presse-papiers, prêt à être collé dans un nœud [Drive](../nodes/drive-node.md) ou [Converter](../nodes/converter-node.md)
- **Téléchargement** - Téléchargement authentifié de vos fichiers et des fichiers partagés avec vous via les équipes
- **Partage** - Créez des liens de téléchargement partageables avec protection par mot de passe et expiration facultatives, ou partagez un fichier en lecture seule avec vos équipes actuelles
- **Suppression** - Supprimez des fichiers et leurs liens de partage
- **Tout effacer** - Supprimez tous les fichiers et leurs liens de partage après confirmation
- **Actions groupées** - Sélectionnez plusieurs fichiers à l'aide des cases à cocher (Shift-clic pour une plage) et appliquez la même action à l'ensemble en une seule fois
- **Pagination** - Parcourez de grandes collections de fichiers, avec un sélecteur de lignes par page (25 / 50 / 100 / Toutes)

## Actions groupées

Les fichiers dont vous êtes propriétaire affichent une case à cocher au début de leur ligne (les fichiers partagés avec vous via une équipe sont en lecture seule et ne sont pas sélectionnables). Sélectionnez plusieurs lignes — ou utilisez la case à cocher d'en-tête pour sélectionner toute la page, et **Shift-clic** pour sélectionner une plage — puis utilisez la barre d'actions groupées qui apparaît au-dessus de la liste :

- **Télécharger le ZIP** regroupe chaque fichier sélectionné dans une seule archive ZIP et la télécharge
- **Actions groupées** ouvre une boîte de dialogue unique permettant d'appliquer un paramètre à chaque fichier sélectionné :
  - **Partager tout avec mes équipes** / **Supprimer le partage avec les équipes** en un clic
  - **Créer un lien de partage pour chaque fichier** en utilisant les mêmes paramètres de mot de passe, d'expiration et de nombre maximal de téléchargements
- **Supprimer** supprime chaque fichier sélectionné et ses liens de partage après confirmation
- **Effacer la sélection** désélectionne tout

La boîte de dialogue indique le nombre de fichiers auxquels elle a appliqué l'action (les fichiers dont vous n'êtes pas propriétaire sont ignorés). Utilisez l'option **Toutes** du sélecteur de lignes par page pour charger tous les fichiers sur une seule page et sélectionner dans l'ensemble de votre Drive. La saisie dans le champ de recherche bascule automatiquement le sélecteur de lignes par page sur **Toutes** afin que la recherche couvre tous les fichiers, et pas seulement la page courante ; effacer la recherche restaure votre sélection précédente.

## Partage

Créez des liens de partage avec :
- **Aucune authentification** - URL de téléchargement publique basée sur un token
- **Basic Auth** - Lien protégé par mot de passe (nom d'utilisateur : `file`)
- **Expiration** - Expiration facultative basée sur le temps
- **Limites de téléchargement** - Nombre maximal de téléchargements facultatif

Activez **Partager avec mes équipes** sur un fichier pour le rendre visible à toutes les équipes auxquelles vous appartenez actuellement. Les membres des équipes partagées obtiennent un accès en lecture seule ; les actions de gestion restent réservées au propriétaire.

## Accès des skills d'Agent

Les skills du nœud Agent peuvent choisir de lire les fichiers du Drive. Lorsque **Activer les fichiers Drive** est activé pour un skill, son code Python peut lire les fichiers Drive accessibles par identifiant de fichier ou par nom de fichier exact via l'assistant `heym_drive.py` généré. Ce paramètre est désactivé par défaut.

Consultez la [référence Drive](../reference/drive.md) pour tous les détails.

## Voir aussi

- [Nœud Drive](../nodes/drive-node.md) - Répertoriez les fichiers, récupérez les métadonnées, partagez avec les équipes ou modifiez les contraintes de partage depuis un workflow
- [Génération de fichiers](../reference/file-generation.md) - Comment les skills génèrent des fichiers
- [Référence Drive](../reference/drive.md) - Liens de partage, tokens et nettoyage
- [Portail](../reference/portal.md) - Liens de fichiers dans les réponses du chat du portail
