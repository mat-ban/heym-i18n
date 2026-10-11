# Expression DSL

Heym utilizează un limbaj simplu de expresii pentru a face referire la date din nodurile anterioare. Utilizați expresii în configurația nodurilor precum `userMessage` la LLM, `condition` la Condition, `message` la Output, mapările Set și valorile Variable. Utilizați [Dialogul de evaluare a expresiilor](./expression-evaluation-dialog.md) pentru un editor mai amplu, previzualizare live generată de backend și selectarea căilor de ieșire.

## Referințe de bază

### Nodul Input vs noduri cu nume

- **`$input`** – Utilizați doar când există un singur nod [Input](../nodes/input-node.md) anterior și doriți să faceți referire la ieșirea acestuia. Exemplu: `$input.text`. Aceasta este o formă prescurtată pentru „datele de la inputul conectat”.
- **`$nodeLabel.field`** – Utilizați pentru a face referire la orice nod anterior prin **eticheta** sa (`label` din datele nodului). Preferați această formă când aveți mai multe noduri sau când AI Assistant / workflow DSL așteaptă etichete explicite. Exemplu: `$userInput.body.text`, `$myLLM.text`.

**Când se utilizează fiecare:**

| Context | Preferați | Exemplu |
|--------|--------|---------|
| Un singur nod input, flux simplu | `$input.text` | Mesaj Output de la un singur Input |
| Mai multe noduri sau referințe cu nume | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Întotdeauna `$nodeLabel.field` | Constructorul de workflow așteaptă etichete, nu `$input` |

### Nodul Input

Utilizați `$input` pentru a face referire la datele nodului Input când există un singur input anterior:

```
$input.text
```

### Noduri cu nume

Faceți referire la orice nod anterior prin eticheta sa. Când un nod are [date fixate](./canvas-features.md#data-pin), completarea expresiilor utilizează acele date în locul ieșirii execuției.

```
$llm.text
$httpResponse.body
$condition
```

### Credentials

Utilizați `$credentials.CredentialName` pentru a face referire la valorile de credential (de ex. chei API, bearer tokens sau tokenuri de integrare Notion) după nume. Consultați [Partajarea credentialelor](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Numele care nu sunt identificatori simpli (conțin `-`, încep cu o cifră sau sunt cuvinte rezervate) utilizează forma cu paranteze pătrate: `$credentials["my-api-key"]`.

### Variabile globale

Utilizați `$global.variableName` pentru a face referire la [Variabile globale](./global-variables.md) – date persistente de tip cheie-valoare, specifice utilizatorului, gestionate în [fila Variables](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Câmpuri imbricate

Utilizați notația cu punct pentru obiecte imbricate:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literali

- **Șiruri de caractere**: `"hello"` sau `'hello'`
- **Numere**: `42`, `3.14`
- **Booleeni**: `true`, `false`
- **Null**: `null`

## Păstrarea tipului

Când **întreaga** valoare este o singură `$expr`, backendul păstrează tipul nativ:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Când o expresie face parte dintr-un șir mai mare, rezultatul final este întotdeauna un șir:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

Nodurile [Sticky Note](../nodes/sticky-note-node.md) reprezintă documentație pe canvas, nu câmpuri de expresie executabile. Conținutul lor `note` este redat ca markdown, deci utilizați linkuri și imagini markdown obișnuite în locul expresiilor `$...`.

Sticky notes acceptă un titlu de afișare personalizat și șase culori de fundal salvate:

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

Valorile permise pentru `stickyColor` sunt `yellow`, `sky`, `emerald`, `rose`, `violet` și `zinc`.

## Aritmetică

Operatori acceptați: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Comparații

Utilizați în nodurile [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Contextul buclei

În interiorul unui nod [Loop](../nodes/loop-node.md), utilizați `item` pentru a face referire la elementul curent al tabloului:

```
item.name
item.value
```

## Variabile speciale
- `$now` - Data și ora curentă cu metode de formatare
- `$Date()` - Creare/analizare dată (de ex. `$Date("2024-01-15")`)
- `$UUID` - Generare identificator unic de 32 de caractere (FĂRĂ paranteze; utilizați `$UUID` nu `$UUID()`)
- `$workflowName` - Numele workflow-ului curent
- `$workflowDescription` - Descrierea workflow-ului curent
- `$workflowPath` - Calea relativă a workflow-ului, de ex. `/workflows/<id>`
- `$workflowUrl` - URL-ul absolut al workflow-ului, de ex. `https://<host>/workflows/<id>`
- `$executionId` - Id-ul execuției curente (egal cu id-ul intrării din [Execution History](./execution-history.md), astfel încât `/workflows/<id>/<executionId>` deschide această rulare pe canvas). **Doar la runtime**: gol în dialogul de previzualizare a expresiilor; populat doar în timpul executării unui workflow.
- `$vars` - Variabile locale workflow-ului (accesați prin `$vars.variableName`; actualizate prin nodul `variable`)
- `$global` - Depozitul persistent de variabile globale (accesați prin `$global.variableName`)

### Utilizarea $vars
- `$vars.counter` - Accesarea unei variabile numite `counter`
- `$vars.myArray.add("item")` - Adăugarea unui element într-o variabilă de tip tablou

### Utilizarea $global
- `$global.environment` - Accesarea unei variabile globale numite `environment`
- `$global.settings.baseUrl` - Accesarea câmpurilor imbricate dintr-o variabilă globală de tip obiect
## Contextul cererii (execuție API)
Când un workflow este executat prin HTTP API, nodurile de intrare primesc metadate suplimentare ale cererii:
- `$textInputLabel.body` - obiectul corpului cererii HTTP (payload JSON brut)
- `$textInputLabel.headers` - obiectul antetelor cererii HTTP (toate cheile de antet sunt cu litere mici)
- `$textInputLabel.query` - obiectul parametrilor de interogare din URL

Accesați datele cererii astfel:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Funcții de conversie a tipurilor
- `str(value)` - Conversie la string
- `int(value)` - Conversie la întreg
- `float(value)` - Conversie la număr cu virgulă mobilă
- `bool(value)` - Conversie la boolean
- `list(value)` - Conversie la listă
- `dict(key=value, ...)` - Creare dicționar cu argumente numite (de ex. `$dict(name="Ali", age=30)`)

## Funcții matematice
- `len(value)` - Obținere lungime
- `abs(value)` - Valoare absolută
- `min(a, b)` - Valoare minimă
- `max(a, b)` - Valoare maximă
- `round(value)` - Rotunjire număr
- `sum(list)` - Suma listei
- `sorted(list)` - Sortare listă
- `randomInt(min, max)` - Număr întreg aleatoriu

## Funcții pentru array-uri
- `$array(a, b, c)` - Creare array din argumente (de ex. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Creare interval de numere întregi de la `a` la `b`, cu `b` exclus (de ex. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Eșuează când `a > b`
- `notNull(list)` - Eliminare valori null din array

## Funcție de construire a string-urilor (pentru expresii map/filter)
- `concat(a, b, c, ...)` - Concatenare a N argumente
  - Se utilizează în interiorul `.map()` ca string de expresie (fără `$` în interiorul string-ului)
  - Se utilizează ghilimele simple în interiorul string-ului concat:
    - Corect: `concat('prefix', 'item.field', 'suffix')`

## Literali de obiect / Dicționare
Creați obiecte/dicționare folosind sintaxa cu acolade și orice chei de tip string:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Chei dinamice
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Reguli pentru literalii de obiect
- Cheile pot fi orice string (inclusiv spații/caractere speciale)
- Cheile TREBUIE să fie între ghilimele duble (de ex. `"key"`)
- Valorile pot fi string-uri/numere/booleeni/expresii/obiecte imbricate

## Funcții pentru string-uri
- `upper(text)` - Litere mari
- `lower(text)` - Litere mici
- `strip(text)` - Eliminare spații albe
- `capitalize(text)` - Prima literă majusculă
- `title(text)` - Formatare cu majusculă la începutul fiecărui cuvânt
- `split(text, separator)` - Împărțire string
- `join(separator, list)` - Unire listă
- `replace(text, old, new)` - Înlocuire text
- `regexReplace(text, pattern, replacement)` - Înlocuire cu model regex
- `base64Encode(text)` - Codificare text UTF-8 ca Base64 standard
- `base64Decode(text)` - Decodificare Base64 standard în text UTF-8
- `toJson(text)` - Parsare string JSON într-un obiect, array sau valoare

## Metode pentru string-uri (pe valori de tip string)
- `.orEmpty()` - Returnează valoarea string sau `""` când valoarea este null/lipsă
- `.upper()` / `.lower()` - Conversie majuscule/minuscule
- `.strip()` - Eliminare spații albe
- `.capitalize()` / `.title()` - Prima literă majusculă
- `.length` - Lungime string
- `.toString()` - Conversie la string
- `.substring(start, end)` - Extragere substring
- `.contains(text)` - Verificare dacă conține substring
- `.startswith(prefix)` / `.endswith(suffix)` - Verificare prefix/sufix
- `.indexOf(text)` - Găsire poziție (returnează -1 dacă nu este găsit)
- `.replace(old, new)` - Înlocuire prima apariție
- `.replaceAll(old, new)` - Înlocuire toate aparițiile
- `.regexReplace(pattern, replacement)` - Înlocuire cu model regex
- `.hash()` - Hash MD5 al string-ului
- `.base64Encode()` - Codificare text UTF-8 ca Base64 standard
- `.base64Decode()` - Decodificare Base64 standard în text UTF-8
- `.urlEncode()` - Codificare URL a string-ului
- `.urlDecode()` - Decodificare URL a string-ului
- `.escape()` - Escapare JSON a string-ului (conversie caractere speciale în format JSON)
- `.unescape()` - Dezescapare JSON a string-ului (conversie format JSON în string original)
- `.toJson()` - Parsare string JSON într-un obiect, array sau valoare

### Exemple de metode pentru string-uri
- `$profile.nickname.orEmpty()` - Conversie text nullable/lipsă într-un string gol
- `$text.upper()` - Conversie la majuscule
- `$text.lower()` - Conversie la minuscule
- `$text.strip()` - Eliminare spații albe
- `$text.replace("old", "new")` - Înlocuire text
- `$text.replaceAll("a", "b")` - Înlocuire toate aparițiile
- `$text.length` - Obținere lungime string
- `$text.escape()` - Escapare caractere speciale JSON (de ex. ghilimele, linii noi)
- `$escapedText.unescape()` - Dezescapare string formatat JSON înapoi la original
- `$text.toJson()` - Parsare string obiect/array JSON (apoi `$text.toJson().repoUrl`)
- `$toJson($text)` - Aceeași parsare ca funcție
- `$base64Encode("Héym 🌍")` - Returnează `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Decodificare Base64 în text UTF-8
- `$text.urlEncode()` - Codificare URL pentru parametri API
- `$encodedText.urlDecode()` - Decodificare text codificat URL
## Metode pentru Array (pe array-uri)
- `.first()` - Obține primul element
- `.last()` - Obține ultimul element
- `.random()` - Obține un element aleatoriu
- `.reverse()` - Inversează array-ul
- `.flat()` - Aplatizează array-urile imbricate într-un singur array
- `.flat(depth)` - Aplatizează cu limită de adâncime
- `.distinct()` - Elimină duplicatele
- `.distinctBy(expr)` - Elimină duplicatele după expresie (de ex. `$array.distinctBy("item.id")`)
- `.notNull()` - Elimină valorile null
- `.add(item)` - Adaugă un element (returnează un array nou)
- `.contains(item)` - Verifică dacă array-ul conține elementul (returnează boolean)
- `.join(separator)` - Unește elementele array-ului într-un string
- `.filter(expr)` - Filtrează array-ul folosind variabila `item` (de ex. `$array.filter("item > 5")`)
- `.map(expr)` - Transformă fiecare element folosind variabila `item` (de ex. `$array.map("item.name")`)
- `.sort(expr, order)` - Sortează după expresie, order este `"asc"` (implicit) sau `"desc"`
- `.take(n)` - Ia primele N (pozitiv) sau ultimele N (negativ) elemente
- `.length` - Lungimea array-ului
- `.toString()` - Convertește într-un string JSON

### Exemple Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Metode pentru Object/Dictionary (pe obiecte)
- `.get(key)` - Obține valoarea după cheie (returnează null dacă nu este găsită)
- `.get(key, default)` - Obține valoarea după cheie cu valoare implicită de rezervă
- `.keys()` - Returnează o listă cu toate cheile
- `.values()` - Returnează o listă cu toate valorile
- `.entries()` - Returnează o listă de obiecte `{key, value}` (câte unul per proprietate)
- `.filter(expr)` - Iterează intrările `{key, value}` și returnează intrările care corespund ca listă (folosiți `item.key` / `item.value` în interiorul `expr`)
- `.map(expr)` - Iterează intrările `{key, value}` și returnează o listă de valori transformate (folosiți `item.key` / `item.value` în interiorul `expr`)
- `.toString()` - Convertește într-un string JSON

### Exemple de iterare a obiectelor
La iterarea unui obiect cu `.map()` sau `.filter()`, fiecare `item` este o pereche `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → lista numelor de proprietăți care nu sunt null

## Dată/Timp
- `$now` - Data și ora curentă
- `$now.format("YYYY-MM-DD")` - Formatează data/ora
- `$now.toISO()` / `.toDate()` / `.toTime()` - Convertește formatele
- `$now.addDays(n)` / `.addHours(n)` - Calcule cu date
- `$Date("2024-01-15")` - Analizează un string de dată

## Operații numerice
- Matematică de bază: `+`, `-`, `*`, `/`, `%`
- Comparații: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Operatori booleeni: `and`, `or`, `not`

## Condiții booleene
Pentru booleeni, scrieți expresia direct (nu forțați `== true`):
- Greșit: `$nodeName.isValid == true`
- Corect: `$nodeName.isValid`
- Negație: `not $nodeName.isValid`

## Reguli și Whitelist (Critic)
### Reguli de plasare a `$`
- O expresie de sine stătătoare începe de obicei cu un `$` la început.
- String-urile șablon pot conține mai multe `$refs`.
- Parametrii metodelor pot conține de asemenea `$refs` imbricate atunci când doriți să transmiteți rezultatul altei expresii (cheie dinamică sau rezolvare imbricată).
  - Valid: `$node.method(other.field)` — `other` este rezolvat din context ca o etichetă de nivel superior (fără `$` în interiorul argumentului).
  - Valid: `$node.method($other.field)` — `$` imbricat este acceptat în previzualizarea dialogului de evaluare și în evaluarea condițiilor.
  - Valid: `$array($a.x, $b.y)`
  - Autocomplete în interiorul `.get(` inserează căi **simple** `label.field` (fără `$` la început), la fel ca în interiorul `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Dacă întreaga valoare transmisă este o singură cale cu puncte **fără** un `$` la început (de exemplu text selectat în editor, precum `execute.outputs.output.result.today`), backend-ul o tratează la fel ca `$execute.outputs.output.result.today`. Valorile care conțin un caracter newline sau carriage return după eliminarea spațiilor albe nu sunt rescrise (pentru a evita payload-uri multi-linie ambigue). Preferați să scrieți `$` în câmpurile de workflow salvate; rescrierea este în principal pentru inspectare și instrumente.
- Rezultatul `Run` din dialogul Evaluate este sursa de adevăr pentru modul în care se rezolvă o expresie concretă.

### Citarea string-urilor în array-uri
La crearea array-urilor cu valori string, folosiți ÎNTOTDEAUNA ghilimele duble:
- Corect: `$array("hello", "world")`
- Greșit: `$array('hello', 'world')`

### FOLOSIȚI DOAR ACESTE FUNCȚII (Whitelist)
Folosiți DOAR:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- metode documentate pentru string/array/obiect

Dacă o funcție nu este listată mai sus, aceasta nu există.

### Limite ale metodelor pentru Array / Dict
- Array-urile pot folosi DOAR: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Obiectele/Dict-urile pot folosi DOAR: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Nume de etichetă rezervate pentru noduri
Nu utilizați aceste nume ca etichete pentru noduri: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Exemple

**Condiție**: `$input.text.length > 0`

**Mesaj utilizator LLM**: `$input.text`

**Mesaj de ieșire**: `$llm.text`

**Valoare variabilă**: `$input.count + 1`

### Exemplu DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Resurse conexe

- [Dialogul de evaluare a expresiilor](./expression-evaluation-dialog.md) – Editor extensibil cu previzualizare live pe backend și autocompletare
- [Funcționalități Canvas](./canvas-features.md) – Pin de date pentru testarea expresiilor fără a rula din nou nodurile
- [Tipuri de noduri](./node-types.md) – Noduri care utilizează expresii ([LLM](../nodes/llm-node.md), [Condiție](../nodes/condition-node.md), [Ieșire](../nodes/output-node.md), [Setare](../nodes/set-node.md) etc.)
- [Notă adezivă](../nodes/sticky-note-node.md) – Note markdown pe Canvas cu titlu editabil, culoare și afișare de imagini
- [Nod Agent](../nodes/agent-node.md) – Utilizarea expresiilor în prompturile agentului
- [Memorie persistentă a agentului](./agent-persistent-memory.md) – `persistentMemoryEnabled` și `memoryShares` în `data`-ul agentului (nu câmpuri de expresie)
- [Structura Workflow](./workflow-structure.md) – Câmpuri `data` ale nodurilor care acceptă expresii
- [Fila Credentials](../tabs/credentials-tab.md) – Credentials referite de noduri
- [Partajarea Credentials](./credentials-sharing.md) – Partajați Credentials și utilizați `$credentials` în expresii
- [Variabile globale](./global-variables.md) – Variabile persistente cu `$global`
