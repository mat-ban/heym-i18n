# Onglet Workflows

L'onglet **Workflows** est la vue par défaut du tableau de bord. Il affiche votre liste de workflows, l'arborescence des dossiers et vous permet de créer, modifier et organiser vos workflows.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Regarder la démo Workflows</a></p>

## Démarrer un Chat

Au-dessus de la liste des workflows se trouve une zone de chat qui vous salue par votre nom et vous demande ce que vous souhaitez automatiser. Saisissez un prompt, joignez éventuellement un fichier, puis sélectionnez l'identifiant et le modèle souhaités. Les deux listes déroulantes sont dotées d'une recherche et reprennent par défaut vos [paramètres IA](../reference/user-settings.md).

L'envoi crée une nouvelle conversation et l'ouvre dans l'[onglet Chat](./chat-tab.md), où la réponse s'affiche en streaming. Les pièces jointes prises en charge sont les fichiers texte, les images et les PDF, à raison d'une par message, comme dans le composeur du Chat.

Si vous ne disposez pas encore d'un identifiant LLM, la zone affiche un lien vers l'[onglet Identifiants](./credentials-tab.md) et l'envoi reste désactivé.

Cliquez sur le **x** pour masquer la zone. Un bouton **Ask AI** apparaît alors à côté du titre Workflows et permet de la rouvrir. Ce choix est mémorisé dans votre navigateur.

## Liste des Workflows

La liste se présente en deux volets : les workflows et les dossiers à gauche, un aperçu du workflow sélectionné à droite.

- Chaque ligne affiche l'icône du workflow, son nom, sa description, sa date de dernière modification et une [pastille de statut](#workflow-status)
- Les workflows peuvent se trouver à la racine ou dans des dossiers, et les workflows épinglés apparaissent dans leur propre groupe **Pinned** en haut de la liste
- **Cliquez** sur une ligne pour la sélectionner et charger son aperçu à droite
- **Double-cliquez** sur une ligne, ou appuyez sur **Entrée** lorsqu'elle a le focus, pour l'ouvrir dans l'[éditeur](../getting-started/quick-start.md)
- Utilisez **Ctrl+clic** (ou **Cmd+clic**) pour l'ouvrir dans un nouvel onglet
- Chaque ligne dispose de ses actions de modification, copie, épinglage et suppression sur la droite. Sur téléphone, elles sont masquées afin que le nom conserve toute la largeur ; effectuez un **appui long** sur une ligne pour ouvrir la feuille d'actions
- Épinglez les workflows fréquemment utilisés dans le [Quick Drawer](../reference/quick-drawer.md) afin de pouvoir les exécuter rapidement depuis l'onglet Workflows et d'autres pages internes

## Aperçu du Workflow

La sélection d'un workflow remplit le panneau d'aperçu situé à côté de la liste. Sur les écrans d'une largeur inférieure à 1280px, ce même panneau s'ouvre sous forme de feuille depuis le bas de l'écran.

Le panneau affiche :

- Le nom du workflow, son créateur et la date de création, ainsi que la date de dernière modification
- **Open Workflow** – ouvre le workflow dans l'éditeur
- **Run Now** – ouvre le workflow dans le [Quick Drawer](../reference/quick-drawer.md), où vous renseignez ses entrées et lancez l'exécution sans quitter la liste
- **Description** – la description du workflow
- **Trigger Configuration** – la planification pour un workflow cron, ou le Trigger d'écoute pour un workflow événementiel. Les workflows invoqués via HTTP affichent un bouton **Copy cURL** à la place de l'endpoint brut et du texte d'authentification : il copie une requête complète avec l'URL appropriée, les en-têtes, un espace réservé pour l'authentification et un corps construit à partir des champs d'entrée du workflow. Lorsque le workflow publie un [portail](../reference/portal.md), son lien de chat public apparaît également ici
- **Last Run Details** – le résultat et la durée de l'exécution la plus récente, ou une mention indiquant que le workflow n'a jamais été exécuté
- **Workflow Steps & Sub-agents** – les nœuds dans l'ordre d'exécution, chacun avec son modèle, son opération ou sa planification et un point indiquant s'il est actif. La sélection d'une étape ouvre ce nœud dans l'éditeur avec son panneau de propriétés déjà ouvert

Le panneau reste épinglé à côté de la liste pendant le défilement, ce qui le rend lisible même dans une longue liste de workflows.

## Administration de l'instance

Les comptes répertoriés dans `HEYM_ADMIN_EMAILS` peuvent lister, ouvrir, modifier, inspecter l'historique d'exécution et supprimer n'importe quel workflow de l'instance sans partage ni transfert de propriété. Ce paramètre est une liste d'adresses e-mail séparées par des virgules, comparées sans tenir compte de la casse. Une liste vide ne confère cet accès à personne. Redémarrez le backend après toute modification.

Les administrateurs voient l'adresse e-mail du propriétaire dans la liste des workflows et peuvent effectuer une recherche par cette adresse. Sélectionnez un workflow pour ouvrir **Administration de l'instance** dans son aperçu :

1. **Suspendre les triggers** n'apparaît que pour les workflows contenant un Nœud Cron. Cette action désactive le Cron du workflow et les autres nœuds trigger automatiques via une sauvegarde versionnée normale. Les exécutions en cours peuvent se terminer. Les appels manuels, API, portail et sous-workflow restent disponibles ; cette action n'est pas un verrou d'exécution à l'échelle du workflow.
2. Le bouton devient **Reprendre les triggers** pendant la suspension, y compris après un rechargement de la page. La reprise réactive les triggers suspendus par l'administrateur et laisse inchangés les triggers déjà désactivés. Pour les workflows suspendus plus anciens sans état de suspension administrateur enregistré, la reprise active leurs triggers automatiques.
3. Utilisez l'action **Supprimer le workflow** de la ligne du workflow une fois les exécutions stabilisées. La suppression renvoie un conflit tant qu'il reste des travaux en cours, en file d'attente ou en attente de validation. La suppression planifiée applique le même contrôle.

Suspendez les triggers et laissez les exécutions en cours se terminer avant de supprimer. Un trigger déjà déclenché au moment de la suspension peut encore se terminer. Utilisez la suppression lorsque le workflow ne doit plus être appelable.

Les secrets de webhook et les paramètres d'authentification réservés au propriétaire conservent leurs protections existantes. L'administration ne transfère pas la propriété et ne partage pas les enregistrements d'identifiants du propriétaire. Les actions administratives de suspension, reprise, suppression et planification apparaissent dans la [piste d'audit](../reference/audit.md) avec l'administrateur agissant et le propriétaire du workflow.

## Statut du workflow

Chaque ligne porte une pastille de statut dérivée des nœuds trigger du workflow, de son état d'exécution en direct et — pour les workflows sans nœud trigger — de la manière dont sa dernière exécution a été lancée :

| Statut | Signification |
| --- | --- |
| **Running** | Le workflow a une exécution en cours en ce moment |
| **Scheduled** | Il dispose d'un trigger [cron](../nodes/cron-node.md) actif |
| **Listening** | Il dispose d'un trigger événementiel actif, tel qu'un trigger Slack, Telegram, IMAP ou WebSocket |
| **Paused** | Il dispose de nœuds trigger, mais tous sont désactivés |
| **API** | Il n'a aucun nœud trigger et a été lancé pour la dernière fois par un appel HTTP à son endpoint d'exécution |
| **SubWorker** | Il n'a aucun nœud trigger et a été lancé pour la dernière fois en tant que sous-workflow par un workflow parent |
| **Portal** | Il n'a aucun nœud trigger et a été lancé pour la dernière fois depuis son [portail](../reference/portal.md) |
| **WEB** | Il n'a aucun nœud trigger et son seul terminal est un [mappeur de sortie HTML](../nodes/html-output-mapper-node.md), de sorte que son appel renvoie une page web rendue |
| **Manual** | Il n'a aucun nœud trigger et ne s'est jamais exécuté, ou sa dernière exécution provient d'ailleurs |
| **Remove Scheduled** | Il est [planifié pour suppression](../reference/workflow-organization.md) |

Les pastilles API, SubWorker et Portal lisent la seule entrée la plus récente de l'[historique d'exécution](./logs-tab.md) du workflow, de sorte qu'un workflow appelé de deux manières affiche la dernière en date. **WEB** est déterminé à partir du graphe, ce qui lui confère la priorité sur ces trois statuts : un workflow servant des pages affiche WEB même après avoir été appelé via HTTP. Les nœuds trigger l'emportent toujours sur tous les autres : un workflow cron que quelqu'un appelle également via HTTP reste **Scheduled**.

Utilisez la liste déroulante **Statut** à côté du champ de recherche pour n'afficher qu'un seul statut. La liste déroulante indique combien de workflows correspondent actuellement à chacun. Un filtre de statut atteint également l'intérieur des dossiers : les dossiers contenant une correspondance sont développés automatiquement, et ceux sans correspondance sont masqués jusqu'à ce que le filtre soit effacé.

## Workflows actifs

Sur ordinateur, le badge circulaire de la barre d'outils supérieure indique combien de workflows sont actuellement en cours d'exécution et s'actualise automatiquement toutes les 10 secondes. Cliquez sur un badge non nul pour ouvrir la liste des workflows actifs, qui affiche jusqu'à quatre lignes avant défilement. Sélectionnez le nom d'un workflow pour rattacher l'éditeur à la vue en direct de cette exécution. Le badge zéro est informatif et ne peut pas être ouvert, et le badge est masqué sur les écrans mobiles.

## Recherche

Utilisez le champ de recherche de workflows à côté de **Statut**, ou appuyez sur **Ctrl+F** (ou **Cmd+F**), pour filtrer les workflows par titre ou description. Les workflows correspondants à l'intérieur des dossiers sont affichés avec leurs branches de dossiers développées. Appuyez sur **Échap** pour effacer la recherche.

## Dossiers

- Organisez les workflows dans des [dossiers et sous-dossiers](../reference/workflow-organization.md)
- Créez des dossiers avec le bouton **New Folder**, en donnant à chacun un nom et une description facultative affichée sous son nom dans la liste
- Chaque ligne de dossier indique le nombre de workflows qu'il contient, sous-dossiers compris, ainsi que ses actions de création de sous-dossier, renommage, changement d'icône, téléchargement au format ZIP et suppression. Sur téléphone, la ligne affiche un unique bouton de menu à la place
- Faites glisser un workflow sur un dossier ou un sous-dossier pour afficher un aperçu de destination au format carte. L'aperçu
  mis en surbrillance affiche le chemin complet du dossier avant le dépôt, et le survol d'un dossier
  réduit le développe brièvement afin de pouvoir atteindre les dossiers imbriqués.
- Faites glisser les workflows entre les dossiers ou vers la racine. La carte déplacée reste visible sous forme de fantôme,
  et la destination active reste mise en surbrillance pendant le défilement.
- Le dépôt d'un workflow dans son dossier actuel est désactivé et marqué **Already in Folder**.
- Renommez un dossier, ou modifiez sa description, depuis son action de renommage ou le menu contextuel accessible par clic droit

## Création de workflows

1. Cliquez sur **New Workflow**
2. Saisissez un nom et une description facultative
3. Le workflow s'ouvre dans l'éditeur

## Import

Faites glisser et déposez un fichier de workflow JSON sur la zone des workflows pour créer un nouveau workflow. Les nœuds et les arêtes importés servent à créer le workflow ; le nom provient du champ `name` du JSON ou du nom de fichier. Consultez [Download & Import](../reference/download-import.md) pour le format JSON et les options d'import.

## Partage

Ouvrez un workflow dans l'éditeur et cliquez sur **Share** pour inviter des utilisateurs par e-mail ou partager avec une [équipe](./teams-tab.md). Choisissez **Read** (consultation et exécution) ou **Write** (modification également) pour chaque utilisateur ou équipe, et modifiez ce choix ultérieurement depuis la liste déroulante située à côté de l'entrée. Les Identifiants et les sous-workflows ne sont pas partagés automatiquement ; partagez-les séparément avec les mêmes utilisateurs ou équipes. Consultez [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) et [Credentials Sharing](../reference/credentials-sharing.md).

## Modification et suppression

- **Edit** – Modifiez le nom et la description du workflow depuis l'action d'édition de la ligne
- **Delete** – Les workflows sont [programmés pour suppression](../reference/workflow-organization.md) ; ils sont déplacés vers une zone de corbeille avant leur suppression définitive

## Modifications concurrentes

L'enregistrement transmet la révision sur laquelle vos modifications sont basées, et le serveur rejette l'écriture si le workflow a changé entre-temps — par exemple parce qu'un collègue l'a enregistré, ou parce que vous avez laissé le même workflow ouvert dans un second onglet. Heym affiche alors une boîte de dialogue **Stale Workflow Detected** proposant deux choix :

- **Cancel** – Conserve vos modifications non enregistrées dans l'éditeur afin de pouvoir recharger dans un autre onglet et les réconcilier
- **Override** – Enregistre malgré tout, en remplaçant la version de l'autre personne

L'**exécution** d'un workflow l'enregistre d'abord, et passe donc par le même contrôle. Si le workflow a changé entre-temps, l'exécution s'interrompt sur la boîte de dialogue plutôt que d'écraser silencieusement : **Override and Run** enregistre votre version et démarre l'exécution, **Cancel Run** abandonne les deux et laisse vos modifications intactes.

Le contrôle fait partie de la requête d'enregistrement elle-même : il ne coûte donc aucun aller-retour supplémentaire et aucune fenêtre ne permet à un enregistrement de passer outre. Vos propres modifications effectuées ailleurs dans l'application — un renommage, une modification de paramètres, une bascule dans le panneau de propriétés — ne sont jamais considérées comme un conflit.

## Palette de commandes

Appuyez sur **Ctrl+K** (ou **Cmd+K**) pour ouvrir la palette de commandes. Vous pouvez :
- Rechercher des workflows par nom
- Accéder à n'importe quel [onglet du tableau de bord](./credentials-tab.md)
- Ouvrir les workflows récents

## Voir aussi

- [Quick Start](../getting-started/quick-start.md) – Créez votre premier workflow
- [Workflow Organization](../reference/workflow-organization.md) – Dossiers, sous-dossiers et suppression programmée
- [Workflow Structure](../reference/workflow-structure.md) – Format JSON des workflows
- [Download & Import](../reference/download-import.md) – Exporter et importer des workflows au format JSON
- [Portal](../reference/portal.md) – Exposez des workflows sous forme d'interfaces de chat publiques
- [Board](./board-tab.md) – Exécutez des workflows depuis des cartes kanban via des chaînes de colonnes
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, nœuds et exécution
- [Execution History](../reference/execution-history.md) – Consultez les exécutions passées et Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Épinglez et exécutez des workflows depuis le tableau de bord, la documentation et les autres pages hors éditeur
- [Contextual Showcase](../reference/contextual-showcase.md) – Guide de page court pour les surfaces du tableau de bord
