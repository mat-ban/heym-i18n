# Expression DSL

Heym utilise un langage d'expression simple pour référencer les données des nœuds en amont. Utilisez les expressions dans la configuration des nœuds, notamment le `userMessage` du Nœud LLM, la `condition` du Nœud Condition, le `message` du Nœud Output, les mappings du Nœud Set et les valeurs des Variables. Utilisez la [Boîte de dialogue d'évaluation d'expression](./expression-evaluation-dialog.md) pour disposer d'un éditeur plus grand, d'un aperçu en direct propulsé par le backend et d'une sélection des chemins de sortie.

## Références de base

### Nœud Input vs Nœuds nommés

- **`$input`** – À utiliser uniquement lorsqu'il existe un seul nœud [Input](../nodes/input-node.md) en amont et que vous souhaitez référencer sa sortie. Exemple : `$input.text`. Il s'agit d'un raccourci pour « les données provenant de l'entrée connectée ».
- **`$nodeLabel.field`** – À utiliser pour référencer n'importe quel nœud en amont par son **label** (le `label` dans les données du nœud). Privilégiez cette syntaxe lorsque vous avez plusieurs nœuds ou lorsque l'AI Assistant / le DSL de workflow attend des labels explicites. Exemple : `$userInput.body.text`, `$myLLM.text`.

**Quand utiliser l'un ou l'autre :**

| Contexte | À privilégier | Exemple |
|--------|--------|---------|
| Nœud d'entrée unique, flux simple | `$input.text` | Message de sortie d'un seul Input |
| Plusieurs nœuds ou références nommées | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / JSON de workflow | Toujours `$nodeLabel.field` | Le constructeur de workflow attend des labels, pas `$input` |

### Nœud Input

Utilisez `$input` pour référencer les données du Nœud Input lorsqu'il existe une seule entrée en amont :

```
$input.text
```

### Nœuds nommés

Référencez n'importe quel nœud en amont par son label. Lorsqu'un nœud dispose de [données épinglées](./canvas-features.md#data-pin), l'autocomplétion des expressions utilise celles-ci plutôt que la sortie d'exécution.

```
$llm.text
$httpResponse.body
$condition
```

### Identifiants

Utilisez `$credentials.CredentialName` pour référencer les valeurs d'un Identifiant (par exemple des clés API, des bearer tokens ou des tokens d'intégration Notion) par leur nom. Consultez [Partage d'Identifiants](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Les noms qui ne sont pas des identifiants simples (ils contiennent `-`, commencent par un chiffre ou sont des mots réservés) utilisent la forme entre crochets : `$credentials["my-api-key"]`.

### Variables globales

Utilisez `$global.variableName` pour référencer les [Variables globales](./global-variables.md) – des données clé-valeur persistantes, propres à l'utilisateur, gérées dans l'[onglet Variables](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Champs imbriqués

Utilisez la notation point pour les objets imbriqués :

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Littéraux

- **Chaînes** : `"hello"` ou `'hello'`
- **Nombres** : `42`, `3.14`
- **Booléens** : `true`, `false`
- **Null** : `null`

## Préservation du type

Lorsque la valeur **entière** est une seule `$expr`, le backend préserve le type natif :

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Lorsqu'une expression fait partie d'une chaîne plus longue, le résultat final est toujours une chaîne :

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

Les nœuds [Sticky Note](../nodes/sticky-note-node.md) sont des éléments de documentation du canvas, et non des champs d'expression exécutables. Leur contenu `note` est rendu en markdown ; utilisez donc des liens et images markdown classiques plutôt que des expressions `$...`.

Les sticky notes prennent en charge un titre d'affichage personnalisé et six couleurs d'arrière-plan enregistrées :

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

Les valeurs autorisées pour `stickyColor` sont `yellow`, `sky`, `emerald`, `rose`, `violet` et `zinc`.

## Arithmétique

Opérateurs pris en charge : `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Comparaisons

À utiliser dans les nœuds [Condition](../nodes/condition-node.md) : `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Contexte de boucle

À l'intérieur d'un nœud [Loop](../nodes/loop-node.md), utilisez `item` pour référencer l'élément courant du tableau :

```
item.name
item.value
```

## Variables spéciales
- `$now` - Date et heure actuelles avec méthodes de formatage
- `$Date()` - Créer/analyser une date (par ex. `$Date("2024-01-15")`)
- `$UUID` - Générer un identifiant unique de 32 caractères (PAS de parenthèses ; utilisez `$UUID` et non `$UUID()`)
- `$workflowName` - Nom du workflow actuel
- `$workflowDescription` - Description du workflow actuel
- `$workflowPath` - Chemin relatif du workflow, par ex. `/workflows/<id>`
- `$workflowUrl` - URL absolue du workflow, par ex. `https://<host>/workflows/<id>`
- `$executionId` - Identifiant de l'exécution actuelle (correspond à l'identifiant de l'entrée de l'[Historique des exécutions](./execution-history.md), de sorte que `/workflows/<id>/<executionId>` ouvre cette exécution sur le canvas). **Uniquement à l'exécution** : vide dans la boîte de dialogue d'aperçu des expressions ; renseigné uniquement pendant l'exécution d'un workflow.
- `$vars` - Variables locales au workflow (accès via `$vars.variableName` ; mises à jour via le nœud `variable`)
- `$global` - Stockage persistant des variables globales (accès via `$global.variableName`)
- `$page.record` - Workflows de widgets de tableau de bord uniquement : l'enregistrement de la page de détail sur laquelle se trouve le widget, issu du paramètre `?record=` du tableau de bord. Vaut `null` sur un tableau de bord ouvert sans ce paramètre ainsi que dans la boîte de dialogue d'aperçu d'expression. Un nœud nommé `page` est prioritaire. Voir [Pages de détail](../tabs/dashboard-tab.md#detail-pages).

### Utilisation de $vars
- `$vars.counter` - Accéder à une variable nommée `counter`
- `$vars.myArray.add("item")` - Ajouter un élément à une variable de type tableau

### Utilisation de $global
- `$global.environment` - Accéder à une variable globale nommée `environment`
- `$global.settings.baseUrl` - Accéder aux champs imbriqués d'une variable globale de type objet

## Contexte de la requête (exécution via API)
Lorsqu'un workflow est exécuté via une API HTTP, les nœuds d'entrée reçoivent des métadonnées de requête supplémentaires :
- `$textInputLabel.body` - Objet du corps de la requête HTTP (payload JSON brut)
- `$textInputLabel.headers` - Objet des en-têtes de la requête HTTP (toutes les clés d'en-tête sont en minuscules)
- `$textInputLabel.query` - Objet des paramètres de requête d'URL

Accédez aux données de la requête comme suit :
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Fonctions de conversion de type
- `str(value)` - Convertit en chaîne de caractères
- `int(value)` - Convertit en entier
- `float(value)` - Convertit en nombre à virgule flottante
- `bool(value)` - Convertit en booléen
- `list(value)` - Convertit en liste
- `dict(key=value, ...)` - Crée un dictionnaire avec des arguments nommés (ex. `$dict(name="Ali", age=30)`)

## Fonctions mathématiques
- `len(value)` - Renvoie la longueur
- `abs(value)` - Valeur absolue
- `min(a, b)` - Valeur minimale
- `max(a, b)` - Valeur maximale
- `round(value)` - Arrondit un nombre
- `sum(list)` - Somme d'une liste
- `sorted(list)` - Trie une liste
- `randomInt(min, max)` - Entier aléatoire

## Fonctions de tableau
- `$array(a, b, c)` - Crée un tableau à partir des arguments (ex. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Crée une plage d'entiers de `a` à `b`, `b` exclu (ex. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Échoue lorsque `a > b`
- `notNull(list)` - Supprime les valeurs nulles d'un tableau

## Fonction de construction de chaînes (pour les expressions map/filter)
- `concat(a, b, c, ...)` - Concatène N arguments
  - À utiliser dans `.map()` sous forme de chaîne d'expression (sans `$` à l'intérieur de la chaîne)
  - Utilisez des guillemets simples à l'intérieur de la chaîne concat :
    - Correct : `concat('prefix', 'item.field', 'suffix')`

## Objets littéraux / Dictionnaires
Créez des objets/dictionnaires à l'aide de la syntaxe à accolades avec n'importe quelles clés de type chaîne :
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Clés dynamiques
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Règles des objets littéraux
- Les clés peuvent être n'importe quelle chaîne (y compris des espaces/caractères spéciaux)
- Les clés DOIVENT être entourées de guillemets doubles (ex. `"key"`)
- Les valeurs peuvent être des chaînes/nombres/booléens/expressions/objets imbriqués

## Fonctions de chaîne
- `upper(text)` - Convertit en majuscules
- `lower(text)` - Convertit en minuscules
- `strip(text)` - Supprime les espaces en début et fin
- `capitalize(text)` - Met en majuscule la première lettre
- `title(text)` - Met en majuscule la première lettre de chaque mot
- `split(text, separator)` - Divise une chaîne
- `join(separator, list)` - Joint une liste
- `replace(text, old, new)` - Remplace du texte
- `regexReplace(text, pattern, replacement)` - Remplace à l'aide d'un motif regex
- `base64Encode(text)` - Encode un texte UTF-8 en Base64 standard
- `base64Decode(text)` - Décode du Base64 standard en texte UTF-8
- `toJson(text)` - Analyse une chaîne JSON en objet, tableau ou valeur

## Méthodes de chaîne (sur les valeurs de type chaîne)
- `.orEmpty()` - Renvoie la valeur de la chaîne, ou `""` lorsque la valeur est nulle/absente
- `.upper()` / `.lower()` - Conversion de casse
- `.strip()` - Supprime les espaces en début et fin
- `.capitalize()` / `.title()` - Met en majuscule
- `.length` - Longueur de la chaîne
- `.toString()` - Convertit en chaîne
- `.substring(start, end)` - Extrait une sous-chaîne
- `.contains(text)` - Vérifie si la sous-chaîne est présente
- `.startswith(prefix)` / `.endswith(suffix)` - Vérifie le préfixe/suffixe
- `.indexOf(text)` - Recherche la position (renvoie -1 si introuvable)
- `.replace(old, new)` - Remplace la première occurrence
- `.replaceAll(old, new)` - Remplace toutes les occurrences
- `.regexReplace(pattern, replacement)` - Remplace à l'aide d'un motif regex
- `.hash()` - Hachage MD5 de la chaîne
- `.base64Encode()` - Encode un texte UTF-8 en Base64 standard
- `.base64Decode()` - Décode du Base64 standard en texte UTF-8
- `.urlEncode()` - Encode une chaîne au format URL
- `.urlDecode()` - Décode une chaîne encodée au format URL
- `.escape()` - Échappe une chaîne au format JSON (convertit les caractères spéciaux au format JSON)
- `.unescape()` - Déséchappe une chaîne au format JSON (convertit le format JSON en chaîne d'origine)
- `.toJson()` - Analyse une chaîne JSON en objet, tableau ou valeur

### Exemples de méthodes de chaîne
- `$profile.nickname.orEmpty()` - Convertit un texte nullable/absent en chaîne vide
- `$text.upper()` - Convertit en majuscules
- `$text.lower()` - Convertit en minuscules
- `$text.strip()` - Supprime les espaces
- `$text.replace("old", "new")` - Remplace du texte
- `$text.replaceAll("a", "b")` - Remplace toutes les occurrences
- `$text.length` - Renvoie la longueur de la chaîne
- `$text.escape()` - Échappe les caractères JSON spéciaux (ex. guillemets, sauts de ligne)
- `$escapedText.unescape()` - Déséchappe une chaîne au format JSON pour revenir à l'original
- `$text.toJson()` - Analyse une chaîne d'objet/tableau JSON (puis `$text.toJson().repoUrl`)
- `$toJson($text)` - Même analyse en tant que fonction
- `$base64Encode("Héym 🌍")` - Renvoie `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Décode du Base64 en texte UTF-8
- `$text.urlEncode()` - Encode au format URL pour les paramètres d'API
- `$encodedText.urlDecode()` - Décode un texte encodé au format URL

## Méthodes de tableau (sur les tableaux)
- `.first()` - Récupère le premier élément
- `.last()` - Récupère le dernier élément
- `.random()` - Récupère un élément aléatoire
- `.reverse()` - Inverse le tableau
- `.flat()` - Aplatit les tableaux imbriqués en un seul tableau
- `.flat(depth)` - Aplatit avec une limite de profondeur
- `.distinct()` - Supprime les doublons
- `.distinctBy(expr)` - Supprime les doublons selon une expression (ex. `$array.distinctBy("item.id")`)
- `.notNull()` - Supprime les valeurs nulles
- `.add(item)` - Ajoute un élément (renvoie un nouveau tableau)
- `.contains(item)` - Vérifie si le tableau contient un élément (renvoie un booléen)
- `.join(separator)` - Concatène les éléments du tableau en une chaîne
- `.filter(expr)` - Filtre le tableau à l'aide de la variable `item` (ex. `$array.filter("item > 5")`)
- `.map(expr)` - Transforme chaque élément à l'aide de la variable `item` (ex. `$array.map("item.name")`)
- `.sort(expr, order)` - Trie selon une expression, l'ordre est `"asc"` (par défaut) ou `"desc"`
- `.take(n)` - Prend les N premiers éléments (n positif) ou les N derniers (n négatif)
- `.length` - Longueur du tableau
- `.toString()` - Convertit en chaîne JSON

### Exemples de Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Méthodes d'objet/dictionnaire (sur les objets)
- `.get(key)` - Récupère la valeur associée à une clé (renvoie null si introuvable)
- `.get(key, default)` - Récupère la valeur associée à une clé avec une valeur de repli par défaut
- `.keys()` - Renvoie une liste de toutes les clés
- `.values()` - Renvoie une liste de toutes les valeurs
- `.entries()` - Renvoie une liste d'objets `{key, value}` (un par propriété)
- `.filter(expr)` - Parcourt les entrées `{key, value}` et renvoie les entrées correspondantes sous forme de liste (utilisez `item.key` / `item.value` dans `expr`)
- `.map(expr)` - Parcourt les entrées `{key, value}` et renvoie une liste de valeurs transformées (utilisez `item.key` / `item.value` dans `expr`)
- `.toString()` - Convertit en chaîne JSON

### Exemples d'itération sur un objet
Lors de l'itération d'un objet avec `.map()` ou `.filter()`, chaque `item` est une paire `{key, value}` :

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → liste des noms de propriétés qui ne sont pas nulles

## Date/Heure
- `$now` - Date et heure actuelles
- `$now.format("YYYY-MM-DD")` - Formate la date/l'heure
- `$now.toISO()` / `.toDate()` / `.toTime()` - Convertit les formats
- `$now.addDays(n)` / `.addHours(n)` - Calculs sur les dates
- `$Date("2024-01-15")` - Analyse une chaîne de date

## Opérations numériques
- Mathématiques de base : `+`, `-`, `*`, `/`, `%`
- Comparaisons : `>`, `<`, `>=`, `<=`, `==`, `!=`
- Opérateurs booléens : `and`, `or`, `not`

## Conditions booléennes
Pour les booléens, écrivez l'expression directement (ne forcez pas `== true`) :
- Incorrect : `$nodeName.isValid == true`
- Correct : `$nodeName.isValid`
- Négation : `not $nodeName.isValid`

## Règles et liste blanche (critique)
### Règles de placement du `$`
- Une expression autonome commence généralement par un `$` initial.
- Les chaînes de modèle peuvent contenir plusieurs `$refs`.
- Les paramètres de méthode peuvent également contenir des `$refs` imbriqués lorsque vous souhaitez transmettre le résultat d'une autre expression (clé dynamique ou résolution imbriquée).
  - Valide : `$node.method(other.field)` — `other` est résolu depuis le contexte comme un label de premier niveau (pas de `$` dans l'argument).
  - Valide : `$node.method($other.field)` — le `$` imbriqué est pris en charge dans l'aperçu de la boîte de dialogue d'évaluation et dans l'évaluation des conditions.
  - Valide : `$array($a.x, $b.y)`
  - L'autocomplétion dans `.get(` insère des chemins **bruts** `label.field` (sans `$` initial), comme dans `$array(...)` / `$notNull(...)`.
- **API Evaluate (Run) :** Si la valeur soumise dans son intégralité est un simple chemin pointé **sans** `$` initial (par exemple du texte sélectionné dans l'éditeur, comme `execute.outputs.output.result.today`), le backend le traite de la même manière que `$execute.outputs.output.result.today`. Les valeurs contenant un saut de ligne ou un retour chariot après nettoyage ne sont pas réécrites (afin d'éviter les payloads multilignes ambigus). Privilégiez l'écriture du `$` dans les champs de workflow enregistrés ; la réécriture est principalement destinée à l'inspection et aux outils.
- Le résultat de `Run` dans la boîte de dialogue d'évaluation fait foi pour la manière dont une expression concrète est résolue.

### Guillemets pour les chaînes dans les tableaux
Lors de la création de tableaux contenant des chaînes, utilisez TOUJOURS des guillemets doubles :
- Correct : `$array("hello", "world")`
- Incorrect : `$array('hello', 'world')`

### UTILISEZ UNIQUEMENT CES FONCTIONS (liste blanche)
Utilisez uniquement :
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- les méthodes documentées sur les chaînes/tableaux/objets

Si une fonction n'est pas listée ci-dessus, elle n'existe pas.

### Limites des méthodes sur les tableaux / dictionnaires
- Les tableaux peuvent UNIQUEMENT utiliser : `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Les objets/dictionnaires peuvent UNIQUEMENT utiliser : `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`

### Noms d'étiquettes de nœud réservés
N'utilisez pas ces noms comme étiquettes de nœud : `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Exemples

**Condition** : `$input.text.length > 0`

**Message utilisateur du Nœud LLM** : `$input.text`

**Message de sortie** : `$llm.text`

**Valeur de variable** : `$input.count + 1`

### Exemple DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Voir aussi

- [Boîte de dialogue d'évaluation d'expression](./expression-evaluation-dialog.md) – Éditeur extensible avec aperçu en direct côté backend et autocomplétion
- [Fonctionnalités du Canvas](./canvas-features.md) – Data pin pour tester les expressions sans réexécuter les nœuds
- [Types de nœuds](./node-types.md) – Nœuds qui utilisent les expressions ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md), etc.)
- [Sticky Note](../nodes/sticky-note-node.md) – Notes markdown du Canvas avec titre modifiable, couleur et affichage d'images
- [Nœud Agent](../nodes/agent-node.md) – Utilisation des expressions dans les prompts d'agent
- [Mémoire persistante de l'agent](./agent-persistent-memory.md) – `persistentMemoryEnabled` et `memoryShares` dans les `data` de l'agent (et non les champs d'expression)
- [Structure de workflow](./workflow-structure.md) – Champs `data` des nœuds qui acceptent les expressions
- [Onglet Identifiants](../tabs/credentials-tab.md) – Identifiants référencés par les nœuds
- [Partage d'identifiants](./credentials-sharing.md) – Partager des identifiants et utiliser `$credentials` dans les expressions
- [Variables globales](./global-variables.md) – Variables persistantes avec `$global`
