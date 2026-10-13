# Expression DSL

Heym utilitza un llenguatge d'expressions simple per referenciar dades de nodes upstream. Utilitzeu expressions a la configuració dels nodes, com ara `userMessage` d'LLM, `condition` de Condition, `message` d'Output, mapejos de Set i valors de Variable. Utilitzeu el [Diàleg d'avaluació d'expressions](./expression-evaluation-dialog.md) per disposar d'un editor més gran, una previsualització en directe impulsada pel backend i la selecció de camins de sortida.

## Referències bàsiques

### Node d'entrada vs Nodes amb nom

- **`$input`** – Utilitzeu-lo només quan hi hagi un únic node [Input](../nodes/input-node.md) upstream i vulgueu referenciar-ne la sortida. Exemple: `$input.text`. És una forma abreujada de "les dades de l'entrada connectada".
- **`$nodeLabel.field`** – Utilitzeu-lo per referenciar qualsevol node upstream pel seu **label** (el `label` a les dades del node). Preferiu aquesta forma quan tingueu múltiples nodes o quan l'Assistent d'IA / el DSL de workflow esperi labels explícits. Exemple: `$userInput.body.text`, `$myLLM.text`.

**Quan utilitzar cadascun:**

| Context | Preferiu | Exemple |
|--------|--------|---------|
| Un sol node d'entrada, flux simple | `$input.text` | Missatge de sortida d'un sol Input |
| Múltiples nodes o referències amb nom | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [Assistent d'IA](./ai-assistant.md) / JSON de workflow | Sempre `$nodeLabel.field` | El constructor de workflows espera labels, no `$input` |

### Node d'entrada

Utilitzeu `$input` per referenciar les dades del node Input quan hi hagi una única entrada upstream:

```
$input.text
```

### Nodes amb nom

Referencieu qualsevol node upstream pel seu label. Quan un node té [dades fixades](./canvas-features.md#data-pin), l'autocompletat d'expressions utilitza aquestes dades en lloc de la sortida de l'execució.

```
$llm.text
$httpResponse.body
$condition
```

### Credencials

Utilitzeu `$credentials.CredentialName` per referenciar valors de credencials (per exemple, claus API, bearer tokens o tokens d'integració de Notion) pel seu nom. Vegeu [Compartició de credencials](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Els noms que no són identificadors simples (contenen `-`, comencen per un dígit o són paraules reservades) utilitzen la forma amb claudàtors: `$credentials["my-api-key"]`.

### Variables globals

Utilitzeu `$global.variableName` per referenciar les [Variables globals](./global-variables.md): dades clau-valor persistents i d'abast d'usuari gestionades a la [Pestanya de variables](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Camps niats

Utilitzeu la notació de punts per a objectes niats:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literals

- **Strings**: `"hello"` o `'hello'`
- **Nombres**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`

## Preservació de tipus

Quan el valor **sencer** és una única `$expr`, el backend preserva el tipus natiu:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Quan una expressió forma part d'una cadena més gran, el resultat final sempre és una cadena:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Notes adhesives

Els nodes [Sticky Note](../nodes/sticky-note-node.md) són documentació del canvas, no camps d'expressió executables. El seu contingut `note` es renderitza com a markdown, així que utilitzeu enllaços i imatges markdown normals en lloc d'expressions `$...`.

Les notes adhesives admeten un títol de visualització personalitzat i sis colors de fons desats:

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

Els valors permesos de `stickyColor` són `yellow`, `sky`, `emerald`, `rose`, `violet` i `zinc`.

## Aritmètica

Operadors admesos: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Comparacions

Utilitzeu-les als nodes [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Context de bucle

Dins d'un node [Loop](../nodes/loop-node.md), utilitzeu `item` per referenciar l'element actual de l'array:

```
item.name
item.value
```

## Variables especials
- `$now` - Data i hora actual amb mètodes de formatació
- `$Date()` - Crea/analitza una data (per exemple, `$Date("2024-01-15")`)
- `$UUID` - Genera un identificador únic de 32 caràcters (SENSE parèntesis; utilitzeu `$UUID`, no `$UUID()`)
- `$workflowName` - Nom del workflow actual
- `$workflowDescription` - Descripció del workflow actual
- `$workflowPath` - Camí relatiu del workflow, per exemple `/workflows/<id>`
- `$workflowUrl` - URL absolut del workflow, per exemple `https://<host>/workflows/<id>`
- `$executionId` - Id de l'execució actual (coincideix amb l'id de l'entrada de [Historial d'execucions](./execution-history.md), de manera que `/workflows/<id>/<executionId>` obre aquesta execució al canvas). **Només en temps d'execució**: buit al diàleg de previsualització d'expressions; es completa només mentre s'executa un workflow.
- `$vars` - Variables locals del workflow (accediu-hi via `$vars.variableName`; s'actualitzen mitjançant el node `variable`)
- `$global` - Magatzem persistent de variables globals (accediu-hi via `$global.variableName`)
- `$page.record` - Només per a workflows de ginys del tauler: el registre de la pàgina de detall on es troba el giny, obtingut del paràmetre `?record=` del tauler. És nul en un tauler obert sense aquest paràmetre i al diàleg de previsualització d'expressions. Un node etiquetat com a `page` té prioritat. Vegeu [Pàgines de detall](../tabs/dashboard-tab.md#detail-pages).

### Ús de $vars
- `$vars.counter` - Accedeix a una variable anomenada `counter`
- `$vars.myArray.add("item")` - Afegeix un element a una variable d'array

### Ús de $global
- `$global.environment` - Accedeix a una variable global anomenada `environment`
- `$global.settings.baseUrl` - Accedeix a camps niats en una variable global de tipus objecte
## Context de la sol·licitud (execució de l'API)
Quan un Workflow s'executa mitjançant l'API HTTP, els Nodes d'entrada reben metadades addicionals de la sol·licitud:
- `$textInputLabel.body` - Objecte del cos de la sol·licitud HTTP (Payload JSON en cru)
- `$textInputLabel.headers` - Objecte de les capçaleres de la sol·licitud HTTP (totes les claus de les capçaleres en minúscules)
- `$textInputLabel.query` - Objecte dels paràmetres de consulta de l'URL

Accediu a les dades de la sol·licitud de la manera següent:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Funcions de conversió de tipus
- `str(value)` - Converteix a cadena de text
- `int(value)` - Converteix a enter
- `float(value)` - Converteix a coma flotant
- `bool(value)` - Converteix a booleà
- `list(value)` - Converteix a llista
- `dict(key=value, ...)` - Crea un diccionari amb arguments de paraula clau (p. ex. `$dict(name="Ali", age=30)`)

## Funcions matemàtiques
- `len(value)` - Obté la longitud
- `abs(value)` - Valor absolut
- `min(a, b)` - Valor mínim
- `max(a, b)` - Valor màxim
- `round(value)` - Arrodoneix el nombre
- `sum(list)` - Suma de la llista
- `sorted(list)` - Ordena la llista
- `randomInt(min, max)` - Enter aleatori

## Funcions de matriu
- `$array(a, b, c)` - Crea una matriu a partir dels arguments (p. ex. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Crea un interval d'enters de `a` a `b` amb `b` exclòs (p. ex. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Fallarà quan `a > b`
- `notNull(list)` - Elimina els valors nuls de la matriu

## Funció de construcció de cadenes (per a expressions map/filter)
- `concat(a, b, c, ...)` - Concatena N arguments
  - Utilitzeu-la dins de `.map()` com a cadena d'expressió (sense `$` dins de la cadena)
  - Utilitzeu cometes simples dins de la cadena concat:
    - Correcte: `concat('prefix', 'item.field', 'suffix')`

## Literals d'objecte / diccionaris
Creeu objectes/diccionaris mitjançant la sintaxi de claus amb qualsevol clau de cadena:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Claus dinàmiques
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Regles dels literals d'objecte
- Les claus poden ser qualsevol cadena (incloent-hi espais/caràcters especials)
- Les claus HAN d'anar entre cometes dobles (p. ex. `"key"`)
- Els valors poden ser cadenes/nombres/booleans/expressions/objectes imbricats

## Funcions de cadena
- `upper(text)` - Majúscules
- `lower(text)` - Minúscules
- `strip(text)` - Elimina els espais en blanc
- `capitalize(text)` - Posa en majúscula la primera lletra
- `title(text)` - Format de títol
- `split(text, separator)` - Divideix la cadena
- `join(separator, list)` - Uneix la llista
- `replace(text, old, new)` - Substitueix text
- `regexReplace(text, pattern, replacement)` - Substitueix amb un patró regex
- `base64Encode(text)` - Codifica text UTF-8 com a Base64 estàndard
- `base64Decode(text)` - Descodifica Base64 estàndard a text UTF-8
- `toJson(text)` - Analitza una cadena JSON en un objecte, matriu o valor

## Mètodes de cadena (sobre valors de cadena)
- `.orEmpty()` - Retorna el valor de la cadena, o `""` quan el valor és nul/absent
- `.upper()` / `.lower()` - Conversió de majúscules/minúscules
- `.strip()` - Elimina els espais en blanc
- `.capitalize()` / `.title()` - Posa en majúscula
- `.length` - Longitud de la cadena
- `.toString()` - Converteix a cadena
- `.substring(start, end)` - Extreu una subcadena
- `.contains(text)` - Comprova si conté la subcadena
- `.startswith(prefix)` / `.endswith(suffix)` - Comprova el prefix/sufix
- `.indexOf(text)` - Troba la posició (retorna -1 si no es troba)
- `.replace(old, new)` - Substitueix la primera ocurrència
- `.replaceAll(old, new)` - Substitueix totes les ocurrències
- `.regexReplace(pattern, replacement)` - Substitueix amb un patró regex
- `.hash()` - Hash MD5 de la cadena
- `.base64Encode()` - Codifica text UTF-8 com a Base64 estàndard
- `.base64Decode()` - Descodifica Base64 estàndard a text UTF-8
- `.urlEncode()` - Codifica la cadena per a URL
- `.urlDecode()` - Descodifica la cadena d'URL
- `.escape()` - Escapa la cadena per a JSON (converteix caràcters especials al format JSON)
- `.unescape()` - Desescapa la cadena JSON (converteix el format JSON a la cadena original)
- `.toJson()` - Analitza una cadena JSON en un objecte, matriu o valor

### Exemples de mètodes de cadena
- `$profile.nickname.orEmpty()` - Converteix text nul/absent en una cadena buida
- `$text.upper()` - Converteix a majúscules
- `$text.lower()` - Converteix a minúscules
- `$text.strip()` - Elimina els espais en blanc
- `$text.replace("old", "new")` - Substitueix text
- `$text.replaceAll("a", "b")` - Substitueix totes les ocurrències
- `$text.length` - Obté la longitud de la cadena
- `$text.escape()` - Escapa caràcters JSON especials (p. ex., cometes, salts de línia)
- `$escapedText.unescape()` - Desescapa una cadena amb format JSON i la retorna a l'original
- `$text.toJson()` - Analitza una cadena d'objecte/matriu JSON (després `$text.toJson().repoUrl`)
- `$toJson($text)` - Mateixa anàlisi com a funció
- `$base64Encode("Héym 🌍")` - Retorna `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Descodifica Base64 a text UTF-8
- `$text.urlEncode()` - Codifica per a URL per a paràmetres d'API
- `$encodedText.urlDecode()` - Descodifica text codificat per a URL
## Mètodes d'Array (sobre arrays)
- `.first()` - Obté el primer element
- `.last()` - Obté l'últim element
- `.random()` - Obté un element aleatori
- `.reverse()` - Inverteix l'array
- `.flat()` - Aplana arrays imbricats en un únic array
- `.flat(depth)` - Aplana amb límit de profunditat
- `.distinct()` - Elimina duplicats
- `.distinctBy(expr)` - Elimina duplicats per expressió (p. ex. `$array.distinctBy("item.id")`)
- `.notNull()` - Elimina valors null
- `.add(item)` - Afegeix un element (retorna un array nou)
- `.contains(item)` - Comprova si l'array conté l'element (retorna un booleà)
- `.join(separator)` - Uneix els elements de l'array en una cadena
- `.filter(expr)` - Filtra l'array utilitzant la variable `item` (p. ex. `$array.filter("item > 5")`)
- `.map(expr)` - Transforma cada element utilitzant la variable `item` (p. ex. `$array.map("item.name")`)
- `.sort(expr, order)` - Ordena per expressió; l'ordre és `"asc"` (per defecte) o `"desc"`
- `.take(n)` - Pren els primers N elements (positiu) o els últims N (negatiu)
- `.length` - Longitud de l'array
- `.toString()` - Converteix a cadena JSON

### Exemples de Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Mètodes d'Object/Dictionary (sobre objectes)
- `.get(key)` - Obté el valor per clau (retorna null si no es troba)
- `.get(key, default)` - Obté el valor per clau amb un valor per defecte de reserva
- `.keys()` - Retorna una llista de totes les claus
- `.values()` - Retorna una llista de tots els valors
- `.entries()` - Retorna una llista d'objectes `{key, value}` (un per propietat)
- `.filter(expr)` - Itera les entrades `{key, value}` i retorna les entrades coincidents com a llista (utilitzeu `item.key` / `item.value` dins d'`expr`)
- `.map(expr)` - Itera les entrades `{key, value}` i retorna una llista de valors transformats (utilitzeu `item.key` / `item.value` dins d'`expr`)
- `.toString()` - Converteix a cadena JSON

### Exemples d'iteració d'objectes
En iterar un objecte amb `.map()` o `.filter()`, cada `item` és un parell `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → llista de noms de propietats que no són null

## Data/Hora
- `$now` - Data i hora actuals
- `$now.format("YYYY-MM-DD")` - Formata la data/hora
- `$now.toISO()` / `.toDate()` / `.toTime()` - Converteix formats
- `$now.addDays(n)` / `.addHours(n)` - Aritmètica de dates
- `$Date("2024-01-15")` - Analitza una cadena de data

## Operacions numèriques
- Matemàtiques bàsiques: `+`, `-`, `*`, `/`, `%`
- Comparacions: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Operadors booleans: `and`, `or`, `not`

## Condicions booleanes
Per a booleans, escriviu l'expressió directament (no forceu `== true`):
- Incorrecte: `$nodeName.isValid == true`
- Correcte: `$nodeName.isValid`
- Negació: `not $nodeName.isValid`

## Regles i Whitelist (crític)
### Regles de col·locació de `$`
- Una expressió independent normalment comença amb un `$` inicial.
- Les cadenes de plantilla poden contenir múltiples `$refs`.
- Els paràmetres de mètode també poden contenir `$refs` imbricats quan voleu passar el resultat d'una altra expressió (clau dinàmica o resolució imbricada).
  - Vàlid: `$node.method(other.field)` — `other` es resol des del context com una etiqueta de nivell superior (sense `$` dins de l'argument).
  - Vàlid: `$node.method($other.field)` — el `$` imbricat és compatible amb la previsualització del diàleg d'avaluació i l'avaluació de condicions.
  - Vàlid: `$array($a.x, $b.y)`
  - L'autocompletat dins de `.get(` insereix camins **sense** `$` com `label.field`, igual que dins de `$array(...)` / `$notNull(...)`.
- **API d'avaluació (Run):** Si el valor enviat sencer és un únic camí de punts **sense** un `$` inicial (per exemple, text seleccionat a l'editor, com `execute.outputs.output.result.today`), el backend el tracta igual que `$execute.outputs.output.result.today`. Els valors que contenen un salt de línia o retorn de carro després de retallar no es reescriuen (evita payloads multilínia ambigus). Preferiu escriure `$` als camps desats del Workflow; la reescriptura és principalment per a inspecció i eines.
- El resultat de `Run` del diàleg d'avaluació és la font de veritat de com es resol una expressió concreta.

### Citació de cadenes en arrays
En crear arrays amb valors de cadena, utilitzeu SEMPRE cometes dobles:
- Correcte: `$array("hello", "world")`
- Incorrecte: `$array('hello', 'world')`

### UTILITZEU NOMÉS AQUESTES FUNCIONS (Whitelist)
Utilitzeu NOMÉS:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- mètodes documentats de cadena/array/objecte

Si una funció no apareix a la llista anterior, no existeix.

### Límits de mètodes d'arrays / dicts
- Els arrays NOMÉS poden utilitzar: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Els objectes/dicts NOMÉS poden utilitzar: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Noms d'etiqueta de Node reservats
No utilitzeu aquests noms com a etiquetes de node: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Exemples

**Condition**: `$input.text.length > 0`

**LLM user message**: `$input.text`

**Output message**: `$llm.text`

**Variable value**: `$input.count + 1`

### Exemple de DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Relacionat

- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – Editor ampliable amb previsualització en directe del backend i autocompletat
- [Canvas Features](./canvas-features.md) – Data pin per provar expressions sense tornar a executar nodes
- [Node Types](./node-types.md) – Nodes que utilitzen expressions ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md), etc.)
- [Sticky Note](../nodes/sticky-note-node.md) – Notes markdown al canvas amb títol editable, color i visualització d'imatges
- [Agent Node](../nodes/agent-node.md) – Ús d'expressions en prompts d'agent
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled` i `memoryShares` a `data` de l'agent (no són camps d'expressió)
- [Workflow Structure](./workflow-structure.md) – Camps `data` dels nodes que accepten expressions
- [Credentials Tab](../tabs/credentials-tab.md) – Credencials referenciades pels nodes
- [Credentials Sharing](./credentials-sharing.md) – Compartiu credencials i utilitzeu `$credentials` en expressions
- [Global Variables](./global-variables.md) – Variables persistents amb `$global`
