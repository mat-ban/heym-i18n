# Tableau de bord

L'onglet **Tableau de bord** est un espace de type Grafana dans lequel vous construisez des grilles de widgets graphiques. Chaque widget est généré à partir de la sortie de son propre workflow Heym masqué : ainsi, toute donnée que vous pouvez produire dans un workflow — requêtes de base de données, appels API, recherches RAG, sortie LLM — peut devenir un graphique. Vous pouvez conserver plusieurs tableaux de bord et partager chacun d'eux avec des personnes ou des équipes.

## Tableaux de bord

Chaque utilisateur commence avec un tableau de bord, créé lors de sa première ouverture de l'onglet. Utilisez le sélecteur de tableaux de bord en haut de l'onglet pour passer d'un tableau de bord à l'autre, et le bouton **+** adjacent pour en créer un nouveau. Le sélecteur liste d'abord vos propres tableaux de bord, puis ceux partagés avec vous, accompagnés du nom de la personne qui les a partagés.

L'onglet rouvre le dernier tableau de bord utilisé, et la barre d'adresse contient le tableau de bord ouvert (`?tab=dashboard&dashboard=<id>`), de sorte qu'un lien ouvre ce tableau de bord précis pour toute personne y ayant accès.

Le bouton de paramètres (réservé aux propriétaires) permet de renommer le tableau de bord, de gérer son partage et de le supprimer. La suppression d'un tableau de bord supprime ses widgets et leurs workflows. Vous conservez toujours au moins un tableau de bord vous appartenant, le dernier ne peut donc pas être supprimé.

## Widgets

Un widget est un graphique unique sur la grille. Types de graphiques pris en charge :

- **Barres** (verticales ou horizontales)
- **Lignes**
- **Aires** (tendance remplie, prend en charge plusieurs séries)
- **Camembert**
- **Tableau** (défilable)
- **Numérique** (une valeur KPI unique avec unité facultative)
- **Jauge** (une valeur unique sur une plage min–max, par exemple un pourcentage)
- **Nuage de points** (points X/Y pour les graphiques de corrélation)
- **Proportion** (une barre divisée en parts avec une légende en pourcentage, par exemple une répartition par langue)
- **Jauge à barres** (une jauge horizontale par ligne avec un dégradé rouge→vert et une valeur, par exemple l'espace disque libre)
- **Texte** (un message markdown, par exemple une note de statut telle que « Dernière exécution à 19:47 » ; prend en charge les [cases à cocher interactives](../nodes/chart-output-node.md#interactive-task-lists) lorsque le markdown est statique, ainsi que les [listes numérotées explicites](../nodes/chart-output-node.md#numbered-lists) pour une numérotation personnalisée ou décroissante)
- **HITL** (vos revues humaines en attente. L'en-tête affiche `1/n pending`. Le nom du workflow ouvre cette exécution sur le canvas. **Approve**, **Request changes** et **Reject** permettent de la résoudre. L'icône d'historique à côté du titre du widget ouvre cette exécution dans la boîte de dialogue d'historique de cette page. Le widget n'utilise pas les lignes en amont, et chaque personne voit sa propre file d'attente)

Chaque widget charge ses données de manière asynchrone à l'ouverture de l'onglet, ce qui maintient la réactivité de la page pendant le remplissage des graphiques.

## Ajout d'un widget

1. Cliquez sur **Add widget**, donnez-lui un titre et choisissez un type de graphique. Sous le sélecteur, la boîte de dialogue affiche un exemple de ce type de graphique avec des données d'exemple et nomme les lignes attendues, ce qui vous permet de comparer les types avant de construire quoi que ce soit.
2. Le widget s'ouvre dans l'éditeur de workflow avec un graphe de départ : un nœud [Set](../nodes/set-node.md) qui produit les lignes, connecté à un nœud [Chart Output](../nodes/chart-output-node.md). Remplacez le nœud Set par n'importe quelle source de données. Un widget **HITL** n'est constitué que du nœud Chart Output ; il lit vos revues en attente et ne nécessite aucune source de données.
3. Construisez le workflow de sorte que le nœud alimentant **Chart Output** produise un tableau de lignes, puis configurez le mappage des champs du nœud Chart Output (champ de libellé, champ de valeur, etc.).
4. Enregistrez, revenez à l'onglet Tableau de bord, et le widget s'affiche.

Double-cliquez sur un widget (ou utilisez son bouton d'édition) pour rouvrir son workflow à tout moment. Utilisez **Clone widget** dans l'en-tête du widget pour dupliquer à la fois le widget et l'intégralité de son workflow. La copie est placée sous l'original et étiquetée **(Copy)** afin que vous puissiez la modifier indépendamment.

## Génération d'un widget avec l'IA

Cliquez sur **AI**, décrivez la métrique souhaitée (par exemple, « taux de réussite des workflows sur les 30 derniers jours sous forme de graphique à barres »), puis choisissez un identifiant LLM et un modèle. Heym génère un workflow de widget complet se terminant par un nœud Chart Output et l'ajoute à la grille. Consultez [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) pour des exemples de prompts par type de graphique.

Utilisez le bouton **Fine-tune with AI** d'un widget pour réviser un widget existant avec une nouvelle instruction. Chaque ajustement par IA enregistre un instantané du workflow précédent dans l'**Edit History** du widget, ce qui vous permet de consulter ou d'annuler les modifications depuis l'éditeur de workflow.

## Modification de la disposition

Activez **Edit** pour passer en mode édition, dans lequel vous pouvez faire glisser les widgets et les redimensionner sur une grille de 12 colonnes. Les modifications de disposition sont enregistrées automatiquement. Les titres des widgets sont modifiables en ligne depuis l'en-tête du widget.

## Mise en cache et actualisation

Chaque widget met en cache ses dernières données calculées sur le serveur pendant une durée de vie (TTL) configurable. Tant que le cache est frais, la réouverture du tableau de bord sert le résultat stocké au lieu de réexécuter le workflow. Le cache est remplacé sur place à chaque recalcul des données (un cache par widget), et il est automatiquement invalidé lorsque vous modifiez le workflow du widget.

Utilisez le bouton **Refresh** d'un widget (ou **Refresh** dans la barre d'outils) pour contourner le cache et recalculer immédiatement.

## Partage

Les propriétaires partagent un tableau de bord depuis ses paramètres, avec des utilisateurs individuels (par e-mail) ou avec n'importe quelle [équipe](teams-tab.md) à laquelle ils appartiennent. Chaque partage est en **Lecture** ou en **Écriture** ; lorsqu'une personne dispose à la fois d'un partage personnel et d'un partage d'équipe, le plus permissif s'applique.

| Action | Propriétaire | Écriture | Lecture |
|--------|:-----:|:-----:|:----:|
| Consulter les widgets, les actualiser, utiliser l'actualisation automatique | ✓ | ✓ | ✓ |
| Ajouter, cloner, supprimer, renommer et redimensionner des widgets ; générer et affiner par IA ; cocher les éléments de la liste de contrôle | ✓ | ✓ | |
| Ouvrir le workflow d'un widget dans l'éditeur | ✓ | ✓ | |
| Renommer ou supprimer le tableau de bord, gérer le partage | ✓ | | |

**Les widgets s'exécutent toujours en tant que propriétaire du tableau de bord.** Quel que soit le spectateur, un widget utilise les identifiants et les variables globales du propriétaire, et ses exécutions apparaissent dans l'historique des exécutions et les traces du propriétaire. Les membres de l'équipe voient donc les mêmes données sans accéder aux comptes qui les sous-tendent, et chaque spectateur partage le même résultat mis en cache par widget. Les widgets qu'un collaborateur en écriture ajoute ou clone appartiennent également au propriétaire.

Pour cette raison, le partage en **Écriture** porte la même confiance que le partage d'un workflow en édition : un collaborateur disposant de l'accès en écriture peut modifier ce qui s'exécute avec vos identifiants. Ne l'accordez qu'aux personnes que vous autoriseriez à modifier vos workflows. Une exécution de test lancée par un collaborateur depuis l'éditeur de workflow utilise ses propres identifiants, comme pour tout workflow partagé ; seul le tableau de bord lui-même s'exécute en tant que propriétaire. Le partage en **Lecture** n'accorde aucun accès aux workflows des widgets, et les spectateurs en lecture seule reçoivent le graphique lui-même mais pas les détails d'exécution par nœud qui le sous-tendent.

La suppression d'un partage, ou son abaissement d'écriture à lecture, prend effet immédiatement.

## Associé

- [Nœud Chart Output](../nodes/chart-output-node.md)
- [Onglet Analytique](analytics-tab.md) — métriques d'exécution intégrées (distinctes des tableaux de bord créés par les utilisateurs)
