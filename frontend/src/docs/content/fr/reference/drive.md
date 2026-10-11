# Drive

L'onglet Drive offre un emplacement central pour consulter, gérer et partager tous les fichiers générés par les skills.

## Accéder au Drive

Rendez-vous dans l'onglet **Drive** du tableau de bord. Tous les fichiers générés par les skills de votre workflow y apparaissent, triés par date de création.

## Liste des fichiers

La liste des fichiers affiche :

- **Nom** - Nom de fichier d'origine avec une icône spécifique au type
- **Type** - Type MIME du fichier (par ex. pdf, csv, docx)
- **Taille** - Taille du fichier lisible par un humain
- **Source** - Le libellé du nœud ayant généré le fichier
- **Date** - Date de création du fichier
- **Actions** - Boutons de téléchargement, de partage et de suppression

## Actions groupées

Chaque fichier que vous possédez dispose d'une case à cocher au début de sa ligne. Les fichiers partagés avec vous via une équipe sont en lecture seule et ne peuvent pas être sélectionnés. Sélectionnez plusieurs fichiers (Shift-clic sélectionne une plage contiguë ; la case d'en-tête sélectionne toute la page) pour faire apparaître la barre d'actions groupées au-dessus de la liste, puis cliquez sur **Actions groupées** pour ouvrir une boîte de dialogue unique qui applique le même paramètre à chaque fichier sélectionné :

- **Partager tous avec mes équipes** / **Supprimer le partage d'équipe** — active ou désactive le partage d'équipe pour tous les fichiers sélectionnés en une seule fois
- **Créer un lien de partage pour chaque fichier** — crée un lien de partage sur chaque fichier sélectionné en utilisant les mêmes valeurs d'expiration, de mot de passe et de téléchargements maximum

La boîte de dialogue indique le nombre de fichiers auxquels elle a appliqué les paramètres ; les fichiers que vous ne possédez pas sont ignorés. Le sélecteur de lignes par page (25 / 50 / 100 / **Tout**) en bas de la liste vous permet de charger davantage de fichiers sur une seule page afin de pouvoir sélectionner sur l'ensemble de votre Drive.

## Partager des fichiers

Cliquez sur l'icône **Partager** pour ouvrir la boîte de dialogue de partage. Vous pouvez créer plusieurs liens de partage par fichier avec différentes configurations et, en option, partager le fichier avec vos équipes actuelles.

### Lien public (basé sur un Token)

Créez un lien de partage sans mot de passe. Toute personne disposant du lien peut télécharger le fichier.

### Lien protégé par mot de passe (Basic Auth)

Définissez un mot de passe lors de la création du partage. L'URL de téléchargement utilise l'authentification HTTP Basic - les navigateurs demanderont un nom d'utilisateur (`file`) et un mot de passe à l'ouverture du lien.

### Options de lien

- **Expiration (heures)** - Définir éventuellement une durée d'expiration
- **Téléchargements maximum** - Limiter éventuellement le nombre de téléchargements
- Les deux peuvent être combinés pour un contrôle maximal

### Partager avec mes équipes

Activez **Partager avec mes équipes** pour accorder un accès en lecture seule à toutes les équipes auxquelles vous appartenez actuellement. Les membres de l'équipe peuvent voir et télécharger le fichier depuis le Drive et utiliser les opérations de lecture du nœud Drive, mais seul le propriétaire du fichier peut supprimer le fichier, créer ou révoquer des liens publics, ou modifier le mot de passe, le TTL et les limites de téléchargement.

Le paramètre est propre à chaque fichier. Si vous rejoignez ou créez une autre équipe ultérieurement, réactivez le partage ou exécutez l'opération `shareWithMyTeams` du nœud Drive pour ajouter cette équipe. Utilisez `unshareWithMyTeams` pour retirer les partages d'équipe du fichier dans un workflow.

### Gérer les partages

La boîte de dialogue de partage affiche tous les liens de partage existants avec :
- Le nombre de téléchargements actuel
- Le statut d'expiration
- L'activation ou non de Basic Auth
- Les boutons de copie et de révocation

## Liens de fichiers dans le Chat et le Portail

Lorsqu'un skill génère des fichiers pendant une exécution de workflow via le chat du Portail ou le Quick Drawer, les liens de téléchargement apparaissent automatiquement dans la réponse. Les utilisateurs peuvent cliquer pour télécharger directement.

## Stockage

Les fichiers générés sont stockés sur le système de fichiers du serveur sous `data/files/`. Dans les déploiements Docker, ce répertoire est monté en tant que volume pour assurer la persistance.

## Gérer les fichiers depuis les Workflows

Le [nœud Drive](../nodes/drive-node.md) vous permet de gérer les fichiers du Drive par programmation depuis un workflow. Utilisez-le pour :

- **Lister** vos fichiers et renvoyer des métadonnées telles que le nom de fichier, le type MIME, la taille, la source et l'URL de téléchargement
- **Supprimer** un fichier après qu'il a été livré à l'utilisateur
- **Partager ou annuler le partage avec vos équipes** afin que les membres de l'équipe puissent le lire et le télécharger uniquement tant que le partage d'équipe existe
- **Définir un mot de passe** sur le lien de téléchargement
- **Définir un TTL** afin que le lien expire après N heures
- **Définir une limite de téléchargements maximum**

La conversion d'un fichier vers un autre format relève du [nœud Converter](../nodes/converter-node.md), avec `conversion: "fileConvert"`. Il lit un fichier du Drive et stocke le résultat converti en tant que nouveau fichier.

Référencez le fichier par son ID issu de la sortie du skill : `$agentLabel._generated_files[0].id`

Consultez la [documentation du nœud Drive](../nodes/drive-node.md) pour les détails de configuration.

## Lire les fichiers du Drive depuis les Skills

Les skills d'agent peuvent activer la lecture du Drive via le paramètre **Enable Drive files** de la carte du skill. Lorsqu'il est activé, le runtime du skill inclut un helper généré `heym_drive.py`. Le code du skill peut importer des helpers tels que `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` et `list_drive_files`.

Les lectures du Drive sont limitées aux fichiers accessibles à l'acteur du workflow : les fichiers possédés et les fichiers partagés avec l'acteur via des équipes. Utilisez un ID de fichier pour une recherche exacte, ou un nom de fichier exact lorsque l'utilisateur fait référence à un fichier par son nom. La recherche par nom de fichier renvoie le fichier accessible le plus récent portant ce nom ; `list_drive_files(filename="...")` renvoie toutes les correspondances.
## Related

- [Nœud Drive](../nodes/drive-node.md) - Opérations Workflow (list, get, delete, password, TTL, max downloads, team sharing)
- [Onglet Drive](../tabs/drive-tab.md) - Parcourir les fichiers dans le dashboard
- [File Generation](./file-generation.md) - Comment `_generated_files` et les URLs de téléchargement sont générés

## Nettoyage
Les tokens de partage expirés sont automatiquement nettoyés quotidiennement. Les fichiers eux-mêmes persistent jusqu'à leur suppression manuelle via l'onglet Drive. Utilisez **Clear All** pour supprimer tous les fichiers et leurs liens de partage en une seule action.
