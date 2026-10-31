# Sortie de graphique

Le nœud **Sortie de graphique** est le nœud terminal d'un workflow de [widget de tableau de bord](../tabs/dashboard-tab.md). Il prend les lignes produites par les nœuds en amont et les transforme en un payload de graphique standardisé que le tableau de bord affiche.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 0 (terminal) |
| Sortie | Payload de graphique standardisé |

Placez ce nœud **en dernier** dans un workflow de widget de tableau de bord. Pour les relations d'entités, le nœud précédent produit un objet graphe (voir [Entity relationships](#entity-relationships-db)). Les autres graphiques pilotés par les données utilisent un tableau d'objets ligne, par exemple :

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Lorsque vous ne disposez que de données d'exemple (sans source réelle), produisez ces lignes avec un nœud **Set** en utilisant `$array(dict(...), dict(...))` — par exemple `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. N'utilisez **pas** `${...}` ni de littéraux d'objet `{...}` bruts ; Heym construit les objets uniquement avec `dict(key=value)`.

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `gantt`, `erDiagram`, `text` ou `hitl` |
| `orientation` | string | `vertical` ou `horizontal` (graphiques à barres uniquement) |
| `dataPath` | string | Chemin pointé vers le tableau de lignes (ou objet graphe pour `erDiagram`) dans la sortie en amont (par ex. `data` ou `result.items`). Laissez vide pour une détection automatique. |
| `labelField` | string | Clé de ligne utilisée comme libellé de catégorie (pie/bar/line) |
| `valueField` | string | Clé de ligne utilisée comme valeur numérique (pie/bar/line/numeric/gauge) |
| `series` | array | Définition optionnelle multi-séries `[{ "name": "Sent", "field": "sent" }]` pour bar/line (remplace `valueField`) |
| `columns` | array | Liste optionnelle de colonnes pour `table` (par défaut, les clés de la première ligne) |
| `statusColumn` | string | Colonne facultative de `table` affichée sous forme de [puces de statut](#status-chips) colorées. Elle doit faire partie des colonnes affichées. |, et avec `linkColumn` elle contient la colonne de lien et le texte du bouton.
| `statusTones` | object | Correspondance facultative entre une valeur de statut et une teinte (`success`, `attention`, `failure`, `waiting`, `neutral`) pour les valeurs non couvertes par défaut |
| `linkColumn` | string | Colonne `table` facultative dont les cellules contiennent une URL, affichée sous forme de [bouton de lien](#link-buttons) qui l'ouvre dans un nouvel onglet. Elle doit faire partie des colonnes affichées. |
| `linkLabel` | string | Texte facultatif du bouton de lien. S'il est vide, le bouton n'affiche qu'une icône de lien. |
| `xField` / `yField` | string | Clés de ligne pour les axes numériques X et Y (scatter) |
| `min` / `max` | number | Plage numérique pour `gauge` (par défaut `0` / `100`) |
| `unit` | string | Unité optionnelle affichée à côté d'une valeur `numeric` ou `gauge` |
| `text` | string | Message Markdown pour le type de graphique `text`. Laissez vide et définissez `valueField` pour afficher un message dynamique issu des données en amont. |
| `title` | string | Titre de graphique optionnel |
| `hitlWorkflowId` | string | `hitl` uniquement. Affiche uniquement les revues de ce workflow. Si le champ est vide, le widget affiche toutes les revues. |
| `hitlNodeId` | string | `hitl` uniquement. Restreint `hitlWorkflowId` à une étape : un Agent avec revue humaine, ou une étape Slack d'approbation, de boutons ou de formulaire. |

## Types de graphiques

- **bar / line / area / pie** — graphiques catégoriels pilotés par `labelField` + `valueField` (ou `series` pour les bar/line/area multi-séries). `area` est un graphique de tendance rempli.
- **table** — lignes brutes affichées sous forme de tableau défilable à l'aide de `columns`. Une colonne peut être affichée sous forme de [puces de statut](#status-chips) et les lignes peuvent ouvrir une [page de détail](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — une valeur KPI unique issue de la première ligne, avec une `unit` optionnelle.
- **gauge** — une valeur unique affichée sur une plage `min`–`max` (par ex. un pourcentage). Utilise `valueField`.
- **scatter** — points X/Y issus de `xField` et `yField` pour des graphiques de corrélation.
- **proportion** — une barre horizontale unique divisée en parts avec une légende en pourcentage (par ex. une répartition linguistique). Utilise `labelField` + `valueField`.
- **barGauge** — une jauge horizontale par ligne avec un dégradé rouge→vert et une valeur (par ex. l'espace disque libre). Utilise `labelField` + `valueField`, avec `unit` et `max` optionnels (par défaut, la valeur de ligne la plus élevée).
- **gantt** — plannings de tâches avec dates, progression et dépendances ; voir [Plannings Gantt](#gantt-schedules).
- **erDiagram** — entités de base de données, champs, clés et relations ; voir [Entity relationships](#entity-relationships-db).
- **text** — un message markdown (par ex. une note de statut comme « Dernière exécution à 19:47 »). Placez le markdown dans `text` pour un message statique, ou laissez `text` vide et définissez `valueField` pour afficher une chaîne produite en amont. Prend en charge les titres, le gras/l'italique, les [listes](../nodes/chart-output-node.md#interactive-task-lists), les liens et le code en ligne.
- **hitl** — un carrousel de vos revues humaines en attente. L'en-tête affiche `1/n pending` ; la flèche gauche est désactivée sur la première carte et la flèche droite sur la dernière. Le nom du workflow ouvre cette exécution sur le canvas. **Approve**, **Request changes** et **Reject** la résolvent, et l'icône d'historique à côté du titre du widget ouvre cette exécution dans la boîte de dialogue d'historique sur la même page. Ce type de graphique ignore les lignes en amont, de sorte que le workflow du widget se compose uniquement du nœud Sortie de graphique. Chaque personne connectée voit les revues des workflows dont elle est propriétaire. Choisissez un **Workflow** (et **Select agent** lorsqu'il comporte plusieurs étapes de revue) dans les propriétés du nœud ou dans les paramètres du widget pour afficher à la place les revues de ce workflow, pour toutes les personnes qui peuvent l'ouvrir ; voir [widgets HITL](../tabs/dashboard-tab.md#hitl-widgets).
### Plannings Gantt

Choisissez **Gantt** (`gantt`) pour les plannings de projets et les chronologies de tâches. Définissez `dataPath` sur le tableau de tâches, par exemple `tasks`. Les lignes utilisent des noms de champs fixes :

```json
{
  "tasks": [
    { "id": "design", "label": "Design", "start": "2026-10-01", "end": "2026-10-05", "progress": 100 },
    { "id": "build", "label": "Build", "start": "2026-10-05", "end": "2026-10-14", "progress": 40, "dependencies": ["design"] }
  ]
}
```

`start` et `end` acceptent des dates ou des horodatages ISO. Les valeurs sans fuseau horaire utilisent UTC ; les décalages horaires sont convertis en UTC. `end` doit être supérieur ou égal à `start`. `progress` est optionnel (0–100, valeur par défaut 0) ; `dependencies` contient les identifiants de tâches existantes. Les identifiants doivent être uniques. Survolez une tâche pour lire ses dates complètes, sa progression et ses dépendances. Les graphiques volumineux défilent dans le widget. 500 tâches au maximum sont acceptées.

Pour des données d'exemple, un mappage Set nommé `tasks` peut utiliser `$array(dict(id="design", label="Design", start="2026-10-01", end="2026-10-05", progress=60))`. Connectez-le à Chart Output avec `chartType: "gantt"` et `dataPath: "tasks"`. Mappez les colonnes sources dans ces noms fixes à l'aide d'un nœud Set ; `labelField` et `valueField` ne sont pas utilisés.

### Entity relationships (DB)

Choisissez **Entity relationships (DB)** (`erDiagram`) pour les schémas de base de données et les liaisons d'entités. Définissez `dataPath` sur un **objet** graphe, tel que `graph`, contenant les deux tableaux :

```json
{
  "graph": {
    "entities": [
      { "id": "customers", "label": "Customers", "fields": [{ "name": "id", "type": "uuid", "key": "PK" }] },
      { "id": "orders", "label": "Orders", "fields": [{ "name": "customer_id", "type": "uuid", "key": "FK" }] }
    ],
    "relations": [
      { "source": "customers", "target": "orders", "sourceField": "id", "targetField": "customer_id", "cardinality": "one-to-many", "label": "places" }
    ]
  }
}
```

Les champs comportent un `name`, un `type` optionnel et une `key` optionnelle (`PK`, `FK`, `PK/FK` ou vide). Les relations référencent des identifiants d'entités existants ; les champs optionnels `sourceField` et `targetField` ancrent la liaison aux champs nommés. `cardinality` accepte `one-to-one`, `one-to-many` (par défaut), `many-to-one` ou `many-to-many`. Les identifiants d'entités et les noms de champs dans chaque entité doivent être uniques. 100 entités, 100 champs par entité et 500 relations au maximum sont acceptés.

Avec un nœud Set, construisez `graph` à l'aide de `$dict(entities=array(dict(...)), relations=array(dict(...)))` ; utilisez `chartType: "erDiagram"` et `dataPath: "graph"`. Il s'agit d'une visualisation du schéma fourni ; elle n'inspecte pas automatiquement une base de données active.

Les deux types apparaissent dans **Ajouter un widget** avec un aperçu et dans le sélecteur de type de graphique du nœud sur le canevas. Heym Work peut proposer ces types lorsque vous décrivez un planning ou un schéma de base de données, en esquissant des aperçus des tâches ou entités proposées avant de construire la page.

### Listes de tâches interactives

Utilisez la syntaxe de liste de tâches Markdown de type GitHub dans le champ statique `text` :

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

Sur le [Dashboard](../tabs/dashboard-tab.md), les cases à cocher s'affichent sous forme de contrôles cliquables (compatibles mode sombre et mode clair). Le fait de cocher une case met à jour le champ `text` du workflow du widget et persiste après actualisation.

**Édition en ligne :** double-cliquez sur le libellé d'une tâche pour le modifier sur place. Appuyez sur Entrée ou cliquez ailleurs pour enregistrer ; appuyez sur Échap pour annuler. Effacez complètement le libellé pour supprimer cet élément de la liste.

**Liens dans les éléments de tâche :** lorsqu'un libellé contient un lien Markdown (`[titre](url)`), cliquer sur le lien ouvre l'URL sans cocher la case. Cliquez ailleurs sur la ligne pour basculer l'état.

**Texte statique uniquement :** l'interactivité nécessite la syntaxe de liste de tâches GFM (`- [ ]` / `- [x]`). Les messages de statut dynamiques simples, sans éléments de tâche, restent en lecture seule. Lorsque le Markdown provient de `valueField`, le premier basculement le copie dans le champ statique `text` afin que les modifications persistent.

### Listes numérotées

Les widgets de texte affichent le Markdown en **préservant les numéros de ligne explicites**. Préfixez chaque ligne avec le numéro que vous souhaitez afficher (par ex. `9.`, `8.`, `7.`). Heym ne renumérote pas les lignes à votre place.

**Pourquoi des numéros explicites ?** Les listes ordonnées Markdown standard (`1.`, `2.`, `3.`) deviennent des listes HTML `<ol>`, qui ne comptent que **vers le haut** à partir du premier numéro. Une liste écrite sous la forme `9.` / `8.` / `7.` s'afficherait comme `9`, `10`, `11` dans un rendu Markdown classique. Préfixer chaque ligne avec le numéro souhaité évite ce problème.

**Listes décroissantes (par ex. du plus récent au plus ancien) :** construisez le Markdown dans une boucle de workflow et calculez le numéro d'affichage pour chaque élément :

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Schéma type :

1. Récupérez ou construisez un tableau d'éléments (par ex. HTTP → `body.videos`).
2. Effectuez une [Boucle](./loop-node.md) sur le tableau ; à l'intérieur du corps, utilisez une [Variable](./variable-node.md) avec `.add()` pour ajouter une ligne numérotée par itération.
3. Après la branche **done** de la boucle, utilisez [Set](./set-node.md) avec `join("\n")` sur le tableau accumulé (ou équivalent) pour produire une seule chaîne Markdown.
4. Pointez le `valueField` de **Chart Output** vers cette chaîne (ou définissez le `text` statique).

Exemple d'expression de ligne à l'intérieur de la boucle (libellé `processVideos`, éléments avec `title` et `id`) :

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Markdown résultant :

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Pour une liste croissante simple commençant à 1, préfixez chaque ligne (`1.`, `2.`, `3.`) ou utilisez une boucle avec `$loop.index + 1`. Utilisez des [listes à puces](#interactive-task-lists) (`- item`) lorsque vous n'avez pas besoin de numéros.

## Puces de statut

Une `table` peut afficher une colonne sous forme de puces colorées. Définissez **Status column** dans les propriétés du nœud (ou `statusColumn` dans le DSL) sur le nom d'une colonne. Chaque valeur reçoit l'une des cinq teintes, et les termes courants en reçoivent une sans configuration :

| Teinte | Mots par défaut |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | tout le reste |

La correspondance ignore la casse, `_` et `-`, de sorte que `IN_PROGRESS` et `in-progress` donnent tous deux `waiting`. Ajoutez **Status tones** pour d'autres valeurs ; une entrée remplace la valeur par défaut pour ce statut :

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

Le serveur résout chaque valeur vers sa teinte, de sorte que Heym et Heym Work affichent les mêmes couleurs.

## Pages de détail : `$page.record`

Un tableau de bord ouvert avec `?record=<value>` exécute chaque Workflow de widget avec cette valeur dans `$page.record`. Un lien de ligne de tableau ouvre une telle page ; voir [Pages de détail](../tabs/dashboard-tab.md#detail-pages). Sur un tableau de bord ouvert sans enregistrement, ainsi que dans la boîte de dialogue d'expression, `$page.record` vaut `null`. Un nœud nommé `page` a priorité sur cette valeur.

Utilisez-la pour récupérer l'enregistrement précis concerné par la page, par exemple dans un nœud [HTTP](./http-node.md) :

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` est la valeur même de la ligne cliquée, telle que `V-1002`, et non un objet contenant des champs. Pour trouver cet enregistrement dans une [DataTable](./datatable-node.md), filtrez sa colonne d'enregistrement par cette valeur : opération `find` avec le filtre `{"vendor_id": "$page.record"}`. Un chemin tel que `$page.record.id` ne résout rien ; un widget généré ou affiné par l'IA supprime donc ces sous-champs et lit directement `$page.record`.

La valeur provient d'une URL que n'importe qui peut modifier. Le tableau de bord n'accepte que les valeurs conformes au format d'enregistrement (lettres, chiffres, `-`, `_` et `.` par défaut), mais traitez-la néanmoins comme une entrée non fiable : passez-la là où le nœud échappe les valeurs, comme un paramètre de requête HTTP ou une valeur de filtre [DataTable](./datatable-node.md) ou ClickHouse, et ne construisez jamais de texte de requête par concaténation de chaînes. Les widgets s'exécutent toujours au nom du propriétaire du tableau de bord, quelle que soit la personne qui ouvre la page.

## Comment les données sont résolues

1. Si `dataPath` est défini, le nœud suit ce chemin pointé dans la sortie en amont.
2. Sinon, il recherche un tableau : une liste de premier niveau, un tableau `data`, ou le premier champ de type liste.
3. Les lignes provenant directement d'un nœud [Data Table](./datatable-node.md) (`{id, data, created_at}`) sont lues avec leurs colonnes au premier niveau à côté de `id`, de sorte que `labelField`, `valueField` et `columns` désignent directement les colonnes de la table.
4. Pour `table`, chaque ligne devient une ligne de tableau en utilisant `columns` (ou les clés de la première ligne). Avec `statusColumn`, le Payload transporte également la teinte associée à chaque valeur de cette colonne.
5. Pour `numeric` et `gauge`, la valeur provient de `valueField` sur la première ligne (ou du premier champ numérique).
6. Pour `scatter`, chaque ligne devient un point `[xField, yField]`.
7. Pour `text`, le message est extrait de `valueField` sur la première ligne lorsqu'il est défini, sinon de la configuration statique `text` (ou, à défaut, du premier champ de type chaîne de la première ligne).
## Exemple

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge (valeur unique vs. une plage) :

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter (points X/Y) :

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion (une barre segmentée par part + légende en pourcentage) :

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area (tendance multi-séries remplie) :

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge (jauge à dégradé par ligne avec valeurs) :

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text (un message markdown statique — aucune ligne en amont requise) :

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text (dynamique — la chaîne du message est produite en amont et récupérée via `valueField`) :

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```

## Exemples de prompts IA

Lors de la génération d'un widget avec l'**IA**, des prompts comme ceux-ci correspondent directement à chaque type :

- **Bar** — « Affichez le chiffre d'affaires mensuel des 6 derniers mois sous forme de graphique à barres verticales avec des données d'exemple. »
- **Line** — « Tracez les utilisateurs actifs quotidiens sur les 14 derniers jours sous forme de graphique en courbes. »
- **Area** — « Affichez l'utilisation de la mémoire et du CPU sur les dernières 24 heures sous forme de graphique en aires avec deux séries. Utilisez des données d'exemple. »
- **Pie** — « Décomposez le statut d'exécution (succès, erreur, annulé) sous forme de graphique circulaire. »
- **Table** — « Affichez les 10 principaux workflows par nombre d'exécutions sous forme de tableau défilable avec les colonnes nom et exécutions. Utilisez des données d'exemple. »
- **Numeric** — « Affichez le total des exécutions de workflows du jour sous forme d'un KPI unique avec l'unité 'runs'. Utilisez des données d'exemple. »
- **Gauge** — « Affichez l'utilisation actuelle du CPU sous forme de jauge de 0 à 100 pour cent. »
- **Scatter** — « Tracez la latence des requêtes en fonction de la taille du payload sous forme de graphique en nuage de points avec des données d'exemple. »
- **Proportion** — « Affichez mes langages les plus utilisés sous forme de barre de proportion : Kotlin 49,64 %, JavaScript 23,73 %, TypeScript 11,64 %, Java 8,92 %, Python 6,06 %. Utilisez des données d'exemple. »
- **Bar gauge** — « Affichez l'espace disque libre par volume (sda1 à sda7) sous forme de bar gauge en GB. Utilisez des données d'exemple. »
- **Text** — « Ajoutez un widget texte avec une liste de contrôle markdown (un élément coché, deux non cochés), ou listez les 5 dernières vidéos de tutoriel par ordre décroissant (de 5. à 1.) avec des liens YouTube — préfixez chaque ligne par un numéro explicite (`5. Titre`, `4. Titre`, …). »

## Voir aussi

- [Onglet Dashboard](../tabs/dashboard-tab.md) — construire et organiser les widgets
- [Nœud Output](output-node.md) — nœud terminal pour les workflows classiques


## Boutons de lien

Une `table` peut transformer une colonne en boutons qui ouvrent un lien. Définissez **Link column** dans les propriétés du nœud (ou `linkColumn` dans le DSL) sur une colonne dont les cellules contiennent une URL, et éventuellement **Link button text** (`linkLabel`). Chaque cellule devient un bouton qui ouvre son URL dans un nouvel onglet. Sans texte de bouton, celui-ci n'affiche qu'une icône de lien :

| Valeur de la cellule | Ouvre |
| -------------------- | ----- |
| `https://jira.example.com/browse/T-1` | Un autre site, dans un nouvel onglet |
| `/dashboards` | Une page de Heym, dans un nouvel onglet |

Seules les adresses `http://` et `https://` ainsi que les chemins commençant par un seul `/` deviennent des boutons. Toute autre valeur, comme `javascript:` ou `//host`, reste du texte brut, et une cellule vide n'affiche rien.

Le bouton fonctionne à côté d'un [lien de ligne](../tabs/dashboard-tab.md#detail-pages) : un clic sur le bouton ouvre son lien dans un nouvel onglet, et un clic ailleurs sur la ligne ouvre toujours la page de détail.
