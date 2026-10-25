# Tableau de bord

L'onglet **Tableau de bord** est un espace de type Grafana dans lequel vous construisez des grilles de widgets graphiques. Chaque widget est généré à partir de la sortie de son propre workflow Heym masqué : ainsi, toute donnée que vous pouvez produire dans un workflow — requêtes de base de données, appels API, recherches RAG, sortie LLM — peut devenir un graphique. Vous pouvez conserver plusieurs tableaux de bord et partager chacun d'eux avec des personnes ou des équipes.

## Tableaux de bord

Chaque utilisateur commence avec un tableau de bord, créé lors de sa première ouverture de l'onglet. Utilisez le sélecteur de tableaux de bord en haut de l'onglet pour passer d'un tableau de bord à l'autre, et le bouton **+** adjacent pour en créer un nouveau. Le sélecteur liste d'abord vos propres tableaux de bord, puis ceux partagés avec vous, accompagnés du nom de la personne qui les a partagés.

L'onglet rouvre le dernier tableau de bord utilisé, et la barre d'adresse contient le tableau de bord ouvert (`?tab=dashboard&dashboard=<id>`), de sorte qu'un lien ouvre ce tableau de bord précis pour toute personne y ayant accès.

Le bouton de paramètres (réservé aux propriétaires) permet de renommer le tableau de bord, de définir quels enregistrements il accepte en tant que [page de détail](#detail-pages), de gérer son partage et de le supprimer. La suppression d'un tableau de bord supprime ses widgets et leurs workflows. Vous conservez toujours au moins un tableau de bord vous appartenant, le dernier ne peut donc pas être supprimé.

## Widgets

Un widget est un graphique unique sur la grille. Types de graphiques pris en charge :

- **Barres** (verticales ou horizontales)
- **Lignes**
- **Aires** (tendance remplie, prend en charge plusieurs séries)
- **Camembert**
- **Tableau** (défilable ; cliquez sur un en-tête de colonne pour trier par ordre croissant, puis cliquez de nouveau pour trier par ordre décroissant. Une colonne peut s'afficher sous forme de [puces d'état](../nodes/chart-output-node.md#status-chips), une colonne peut contenir des [boutons de lien](../nodes/chart-output-node.md#link-buttons) qui ouvrent une URL dans un nouvel onglet, et les lignes peuvent ouvrir une [page de détail](#pages-de-detail))
- **Numérique** (une valeur KPI unique avec unité facultative)
- **Jauge** (une valeur unique sur une plage min–max, par exemple un pourcentage)
- **Nuage de points** (points X/Y pour les graphiques de corrélation)
- **Proportion** (une barre divisée en parts avec une légende en pourcentage, par exemple une répartition par langue)
- **Jauge à barres** (une jauge horizontale par ligne avec un dégradé rouge→vert et une valeur, par exemple l'espace disque libre)
- **Texte** (un message markdown, par exemple une note de statut telle que « Dernière exécution à 19:47 » ; prend en charge les [cases à cocher interactives](../nodes/chart-output-node.md#interactive-task-lists) lorsque le markdown est statique, ainsi que les [listes numérotées explicites](../nodes/chart-output-node.md#numbered-lists) pour une numérotation personnalisée ou décroissante)
- **HITL** (vos revues humaines en attente. L'en-tête affiche `1/n pending`. Le nom du workflow ouvre cette exécution sur le canvas. **Approve**, **Request changes** et **Reject** permettent de la résoudre. L'icône d'historique à côté du titre du widget ouvre cette exécution dans la boîte de dialogue d'historique de cette page. Le widget n'utilise pas les lignes en amont, et chaque personne voit sa propre file d'attente. Il peut afficher à la place les validations d'un seul Workflow, pour toutes les personnes pouvant ouvrir ce Workflow ; voir [Widgets HITL](#widgets-hitl))

Outre les graphiques, un widget **Run a workflow** exécute l'un de vos workflows depuis le tableau de bord : sur un fichier déposé, avec ses champs de saisie ou avec un bouton Run ; voir [Widgets d'exécution](#run-widgets).

Chaque widget charge ses données de manière asynchrone à l'ouverture de l'onglet, ce qui maintient la réactivité de la page pendant le remplissage des graphiques.

## Ajout d'un widget

1. Cliquez sur **Add widget**, donnez-lui un titre et choisissez un type de graphique. Sous le sélecteur, la boîte de dialogue affiche un exemple de ce type de graphique avec des données d'exemple et nomme les lignes attendues, ce qui vous permet de comparer les types avant de construire quoi que ce soit.
2. Le widget s'ouvre dans l'éditeur de workflow avec un graphe de départ : un nœud [Set](../nodes/set-node.md) qui produit les lignes, connecté à un nœud [Chart Output](../nodes/chart-output-node.md). Remplacez le nœud Set par n'importe quelle source de données. Un widget **HITL** n'est constitué que du nœud Chart Output ; il lit vos revues en attente et ne nécessite aucune source de données.
3. Construisez le workflow de sorte que le nœud alimentant **Chart Output** produise un tableau de lignes, puis configurez le mappage des champs du nœud Chart Output (champ de libellé, champ de valeur, etc.).
4. Enregistrez, revenez à l'onglet Tableau de bord, et le widget s'affiche.

Pour un widget **Run a workflow**, choisissez plutôt le workflow qu'il exécute ; le sélecteur indique comment le widget exécutera chacun d'eux. Le widget est ajouté directement à la grille ; il n'y a pas de nouveau workflow à construire.

Double-cliquez sur un widget (ou utilisez son bouton d'édition) pour rouvrir son workflow à tout moment. Utilisez **Clone widget** dans l'en-tête du widget pour dupliquer à la fois le widget et l'intégralité de son workflow. La copie est placée sous l'original et étiquetée **(Copy)** afin que vous puissiez la modifier indépendamment.

## Widgets HITL

Un nouveau widget HITL affiche toutes les validations en attente dans votre propre file. Pour n'afficher que celles d'un Workflow, ouvrez les **Paramètres** du widget :

1. Sous **Workflow**, choisissez le Workflow. La liste contient les Workflows que vous pouvez ouvrir, les vôtres ou ceux partagés avec vous ou votre équipe, qui comportent une étape en attente d'une personne : un Agent avec validation humaine, ou une étape Slack d'approbation, de boutons ou de formulaire. L'icône à côté ouvre ce Workflow dans un nouvel onglet.
2. Si le Workflow comporte une seule étape de ce type, elle est sélectionnée automatiquement. S'il en comporte plusieurs, **Select agent** les liste par nom de nœud, avec **All agents** en premier ; les étapes Slack sont signalées par **(Slack)**.
3. Enregistrez. Le `1/n pending` de l'en-tête ne compte que ces validations. Choisissez **Tous les workflows** pour afficher de nouveau votre propre file.

Le même choix existe sur le canevas, dans les propriétés du nœud Chart Output. **Affiner avec l'IA** peut le faire (« afficher uniquement les approbations de factures »), tout comme la description d'un nouveau widget qui nomme le Workflow. Chaque modification est une modification du Workflow ; elle apparaît donc dans l'Edit History.

- **Qui voit les validations.** Un widget filtré sur un Workflow affiche les validations de ce Workflow à toutes les personnes pouvant ouvrir le Workflow, qui peuvent approuver, demander des modifications ou rejeter depuis le widget, comme elles pourraient exécuter le Workflow. Un widget non filtré affiche à chacun sa propre file.
- **Qui voit le widget.** Une personne qui ne peut pas ouvrir le Workflow choisi ne voit pas du tout le widget, même sur un tableau de bord partagé avec elle. Lorsque le propriétaire du tableau de bord perd l'accès au Workflow, ou que celui-ci est supprimé, le propriétaire voit « You no longer have access to the workflow this widget shows » et peut en choisir un autre dans les **Paramètres**.
- **Uniquement des choix accessibles.** Un Workflow que vous ne pouvez pas ouvrir est refusé lors de l'enregistrement du widget, que ce soit depuis les paramètres, le canevas ou l'IA.

## Pages de détail

Un widget de tableau peut lier ses lignes à un autre tableau de bord, qui fonctionne alors comme une page de détail : un seul tableau de bord qui sert chaque client, facture ou ticket.

1. Ouvrez les **Settings** du widget de tableau et choisissez le tableau de bord sous **Row link**.
2. Saisissez la **Record column**, la colonne dont la valeur identifie la ligne (par exemple `id`), et éventuellement une **Label column** qui la nomme (par exemple `name`).
3. Enregistrez. Cliquer sur une ligne (ou la cibler et appuyer sur Entrée) ouvre le tableau de bord lié avec `?record=<value>&label=<name>`.

Sur le tableau de bord de détail, chaque workflow de widget lit la valeur sous la forme `$page.record` (voir [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), et la page affiche `Dashboard / <label>` au-dessus de la grille avec un bouton pour effacer l'enregistrement. Le bouton Retour ramène au tableau d'origine.

- **Qui peut l'ouvrir.** Les lignes ne sont cliquables que pour les spectateurs pouvant ouvrir le tableau de bord lié. Les autres voient le même tableau sans liens.
- **Format de l'enregistrement.** L'enregistrement provient de l'URL ; le tableau de bord de détail décide donc de ce qu'il accepte. Dans ses paramètres, **Detail page records** correspond à l'un des formats suivants : ID (lettres, chiffres, `-`, `_` et `.`, jusqu'à 128 caractères ; valeur par défaut), nombres, UUID ou adresses e-mail. Toute autre valeur est refusée avant l'exécution d'un widget, et les widgets affichent « This page does not accept that record ».
- **Toujours exécuté en tant que propriétaire.** Les widgets s'exécutent également en tant que propriétaire du tableau de bord sur une page de détail. Les concepteurs ne doivent transmettre `$page.record` que là où un nœud l'échappe, jamais directement dans le texte d'une requête.
- **Mise en cache.** Chaque widget met en cache son graphique par enregistrement, pour la même durée de vie (TTL) que le widget, et conserve les 50 enregistrements les plus récemment utilisés.

## Widgets d'exécution

Un widget **Run a workflow** exécute l'un de vos workflows et affiche le résultat : statut, durée d'exécution et sorties. Ce qu'il affiche dépend de ce que le workflow accepte :

- **Un fichier.** Pour un workflow qui commence par un [File Upload Trigger](../nodes/file-upload-trigger-node.md), déposez un fichier dessus (ou cliquez pour en choisir un) et le widget le téléverse via le lien de téléversement à usage unique du trigger. Le widget indique les types et la taille de fichier acceptés par le trigger et refuse les autres avant le téléversement. Lorsque le workflow commence également par un nœud Text Input, le widget affiche ses champs à côté de la zone de dépôt : choisissez un fichier, remplissez les champs, et **Run** envoie les deux. Les valeurs voyagent avec le lien de téléversement généré par le widget, de sorte qu'un lien de téléversement partagé ne peut pas les définir.
- **Champs de saisie.** Pour un workflow qui commence par un nœud Text Input, le widget affiche ses champs avec leurs valeurs par défaut ; **Run** exécute le workflow avec vos valeurs. Les valeurs correspondant à des champs absents du workflow sont ignorées.
- **Rien.** Un workflow sans entrées obtient un bouton **Run**.

Le bouton **Wrap** du résultat renvoie à la ligne les longues lignes de sortie à l'intérieur du cadre ; désactivez-le pour lire la mise en page JSON de la sortie.

- Toute personne pouvant ouvrir le tableau de bord peut exécuter le widget, tout comme n'importe qui peut actualiser un graphique. L'accès au workflow est celui du propriétaire du tableau de bord : l'ajout du widget nécessite un workflow que vous et le propriétaire pouvez tous deux exécuter, et l'exécution elle-même utilise les identifiants du propriétaire du workflow, comme tout lien de téléversement.
- Le résultat reste affiché sur votre écran jusqu'à ce que vous quittiez la page ; les autres spectateurs ne voient ni vos fichiers, ni vos valeurs, ni vos résultats. L'exécution apparaît dans l'historique des exécutions avec le trigger `dashboard`.
- Un partage de tableau de bord n'accorde jamais l'accès au workflow lui-même. **Edit workflow** l'ouvre pour les personnes qui y ont déjà accès, et **Fine-tune with AI** n'est pas proposé.
- Les exécutions avec fichier s'exécutent sur l'instance principale, où les fichiers téléversés sont stockés, comme toute exécution de File Upload Trigger.

## Génération d'un widget avec l'IA

Cliquez sur **AI**, décrivez la métrique souhaitée (par exemple, « taux de réussite des workflows sur les 30 derniers jours sous forme de graphique à barres »), puis choisissez un identifiant LLM et un modèle. Heym génère un workflow de widget complet se terminant par un nœud Chart Output et l'ajoute à la grille. Consultez [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) pour des exemples de prompts par type de graphique.

Le widget reçoit un titre court d'un ou deux mots dans la langue de votre demande, par exemple « Dossiers ouverts ». Un titre ne contient jamais l'identifiant d'une table de données ; lorsque le modèle nomme le widget par une phrase, Heym en conserve les premiers mots.

L'API des widgets peut aussi créer une **carte de comptage** sans IA : un widget `text` sur une table de données (`data_table_id`) avec `count_column` et `count_value` affiche le nombre de lignes ayant cette valeur ; le titre du widget indique la valeur. Heym Work place en tête des pages créées à partir d'une table de données une carte de comptage par statut.

Utilisez le bouton **Fine-tune with AI** d'un widget pour réviser un widget existant avec une nouvelle instruction. Chaque ajustement par IA enregistre un instantané du workflow précédent dans l'**Edit History** du widget, ce qui vous permet de consulter ou d'annuler les modifications depuis l'éditeur de workflow.

## Modification de la disposition

Activez **Edit** pour passer en mode édition, dans lequel vous pouvez faire glisser les widgets et les redimensionner sur une grille de 12 colonnes. Les modifications de disposition sont enregistrées automatiquement. Les titres des widgets sont modifiables en ligne depuis l'en-tête du widget.

## Mise en cache et actualisation

Chaque widget met en cache ses dernières données calculées sur le serveur pendant une durée de vie (TTL) configurable. Tant que le cache est frais, la réouverture du tableau de bord sert le résultat stocké au lieu de réexécuter le workflow. Le cache est remplacé sur place à chaque recalcul des données (un cache par widget, plus un par enregistrement sur une [page de détail](#detail-pages)), et il est automatiquement invalidé lorsque vous modifiez le workflow du widget.

Utilisez le bouton **Refresh** d'un widget (ou **Refresh** dans la barre d'outils) pour contourner le cache et recalculer immédiatement.

## Partage

Les propriétaires partagent un tableau de bord depuis ses paramètres, avec des utilisateurs individuels (par e-mail) ou avec n'importe quelle [équipe](teams-tab.md) à laquelle ils appartiennent. Chaque partage est en **Lecture** ou en **Écriture** ; lorsqu'une personne dispose à la fois d'un partage personnel et d'un partage d'équipe, le plus permissif s'applique.

| Action | Propriétaire | Écriture | Lecture |
|--------|:-----:|:-----:|:----:|
| Consulter les widgets, les actualiser, utiliser l'actualisation automatique | ✓ | ✓ | ✓ |
| Ouvrir les pages de détail, exécuter les widgets d'exécution | ✓ | ✓ | ✓ |
| Ajouter, cloner, supprimer, renommer et redimensionner des widgets ; générer et affiner par IA ; cocher les éléments de la liste de contrôle | ✓ | ✓ | |
| Ouvrir le workflow d'un widget dans l'éditeur | ✓ | ✓ | |
| Renommer ou supprimer le tableau de bord, définir son format d'enregistrement, gérer le partage | ✓ | | |

**Les widgets s'exécutent toujours en tant que propriétaire du tableau de bord.** Quel que soit le spectateur, un widget utilise les identifiants et les variables globales du propriétaire, et ses exécutions apparaissent dans l'historique des exécutions et les traces du propriétaire. Les membres de l'équipe voient donc les mêmes données sans accéder aux comptes qui les sous-tendent, et chaque spectateur partage le même résultat mis en cache par widget. Les widgets qu'un collaborateur en écriture ajoute ou clone appartiennent également au propriétaire.

Pour cette raison, le partage en **Écriture** porte la même confiance que le partage d'un workflow en édition : un collaborateur disposant de l'accès en écriture peut modifier ce qui s'exécute avec vos identifiants. Ne l'accordez qu'aux personnes que vous autoriseriez à modifier vos workflows. Une exécution de test lancée par un collaborateur depuis l'éditeur de workflow utilise ses propres identifiants, comme pour tout workflow partagé ; seul le tableau de bord lui-même s'exécute en tant que propriétaire. Le partage en **Lecture** n'accorde aucun accès aux workflows des widgets, et les spectateurs en lecture seule reçoivent le graphique lui-même mais pas les détails d'exécution par nœud qui le sous-tendent.

La suppression d'un partage, ou son abaissement d'écriture à lecture, prend effet immédiatement.

## Associé

- [Nœud Chart Output](../nodes/chart-output-node.md)
- [Onglet Analytique](analytics-tab.md) — métriques d'exécution intégrées (distinctes des tableaux de bord créés par les utilisateurs)