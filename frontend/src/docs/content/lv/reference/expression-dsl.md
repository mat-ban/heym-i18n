# Izteiksmju DSL

Heym izmanto vienkāršu izteiksmju valodu, lai atsauktos uz datiem no iepriekšējiem mezgliem. Izmantojiet izteiksmes mezglu konfigurācijā, piemēram, LLM `userMessage`, Condition `condition`, Output `message`, Set mappings un Variable vērtībās. Izmantojiet [Expression Evaluation Dialog](./expression-evaluation-dialog.md), lai iegūtu lielāku redaktoru, backend darbinātu tiešraides priekšskatījumu un izvades ceļa izvēli.

## Pamata atsauces

### Ievades mezgls pret nosauktajiem mezgliem

- **`$input`** – Izmantojiet tikai tad, ja ir viens iepriekšējais [Input](../nodes/input-node.md) mezgls un vēlaties atsaukties uz tā izvadi. Piemērs: `$input.text`. Šis ir saīsinājums frāzei "dati no pievienotā input".
- **`$nodeLabel.field`** – Izmantojiet, lai atsauktos uz jebkuru iepriekšējo mezglu pēc tā **label** (mezgla datos esošais `label`). Dodiet priekšroku šim variantam, ja ir vairāki mezgli vai ja AI Assistant / workflow DSL sagaida skaidras labels. Piemērs: `$userInput.body.text`, `$myLLM.text`.

**Kad ko izmantot:**

| Konteksts | Priekšroka | Piemērs |
|--------|--------|---------|
| Viens input mezgls, vienkārša plūsma | `$input.text` | Output message no viena Input |
| Vairāki mezgli vai nosauktas atsauces | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Vienmēr `$nodeLabel.field` | Workflow builder sagaida labels, nevis `$input` |

### Ievades mezgls

Izmantojiet `$input`, lai atsauktos uz Input mezgla datiem, ja ir viens iepriekšējais input:

```
$input.text
```

### Nosauktie mezgli

Atsaucieties uz jebkuru iepriekšējo mezglu pēc tā label. Ja mezglam ir [pinned data](./canvas-features.md#data-pin), izteiksmes papildināšana izmanto to, nevis izpildes izvadi.

```
$llm.text
$httpResponse.body
$condition
```

### Akreditācijas dati

Izmantojiet `$credentials.CredentialName`, lai pēc nosaukuma atsauktos uz akreditācijas datu vērtībām (piemēram, API keys, bearer tokens vai Notion integrācijas tokens). Skatiet [Credentials Sharing](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Nosaukumiem, kas nav vienkārši identifikatori (tie satur `-`, sākas ar ciparu vai ir rezervēti vārdi), izmanto kvadrātiekavu formu: `$credentials["my-api-key"]`.

### Globālie mainīgie

Izmantojiet `$global.variableName`, lai atsauktos uz [Global Variables](./global-variables.md) – noturīgiem, lietotāja līmeņa atslēgu-vērtību datiem, kas pārvaldīti [Variables tab](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Iekļautie lauki

Izmantojiet punktu pierakstu ligzdotiem objektiem:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literāļi

- **Strings**: `"hello"` vai `'hello'`
- **Numbers**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`

## Tipa saglabāšana

Ja **viss** value ir viens `$expr`, backend saglabā sākotnējo tipu:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Ja izteiksme ir daļa no lielāka string, gala rezultāts vienmēr ir string:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

[Sticky Note](../nodes/sticky-note-node.md) mezgli ir kanvas dokumentācija, nevis izpildāmi izteiksmju lauki. To `note` saturs tiek renderēts kā markdown, tāpēc izmantojiet parastas markdown saites un attēlus, nevis `$...` izteiksmes.

Sticky notes atbalsta pielāgotu displeja virsrakstu un sešas saglabātas fona krāsas:

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

Atļautās `stickyColor` vērtības ir `yellow`, `sky`, `emerald`, `rose`, `violet` un `zinc`.

## Aritmētika

Atbalstītie operatori: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Salīdzinājumi

Izmantojiet [Condition](../nodes/condition-node.md) mezglos: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Loop konteksts

[Loop](../nodes/loop-node.md) mezgla iekšienē izmantojiet `item`, lai atsauktos uz pašreizējo masīva elementu:

```
item.name
item.value
```

## Īpašie mainīgie
- `$now` - Pašreizējais datetime ar formatēšanas metodēm
- `$Date()` - Izveidot/parsēt date (piem., `$Date("2024-01-15")`)
- `$UUID` - Ģenerēt 32 rakstzīmju unikālu identifikatoru (NAV iekavu; izmantojiet `$UUID`, nevis `$UUID()`)
- `$workflowName` - Pašreizējā workflow nosaukums
- `$workflowDescription` - Pašreizējā workflow apraksts
- `$workflowPath` - Workflow relatīvais ceļš, piem., `/workflows/<id>`
- `$workflowUrl` - Workflow absolūtais URL, piem., `https://<host>/workflows/<id>`
- `$executionId` - Pašreizējās izpildes id (vienāds ar [Execution History](./execution-history.md) ieraksta id, tāpēc `/workflows/<id>/<executionId>` atver šo palaišanu kanvā). **Tikai izpildlaikā**: tukšs izteiksmes priekšskatījuma dialogā; aizpildīts tikai tad, kamēr workflow tiek izpildīts.
- `$vars` - Workflow-lokālie mainīgie (piekļuve caur `$vars.variableName`; atjaunināti caur `variable` mezglu)
- `$global` - Noturīgā globālo mainīgo krātuve (piekļuve caur `$global.variableName`)
- `$page.record` - Tikai informācijas paneļa logrīku workflow: tās detalizētās lapas ieraksts, kurā atrodas logrīks, no informācijas paneļa parametra `?record=`. Ir `null` informācijas panelī, kas atvērts bez šī parametra, kā arī izteiksmju priekšskatījuma dialoglodziņā. Mezglam ar etiķeti `page` ir prioritāte. Skatiet [Detalizētās lapas](../tabs/dashboard-tab.md#detail-pages).

### $vars lietojums
- `$vars.counter` - Piekļūt mainīgajam ar nosaukumu `counter`
- `$vars.myArray.add("item")` - Pievienot elementu masīva mainīgajam

### $global lietojums
- `$global.environment` - Piekļūt globālajam mainīgajam ar nosaukumu `environment`
- `$global.settings.baseUrl` - Piekļūt ligzdotiem laukiem objekta tipa globālajā mainīgajā
## Pieprasījuma konteksts (API izpilde)
Kad workflow tiek izpildīts, izmantojot HTTP API, ievades mezgli saņem papildu pieprasījuma metadatus:
- `$textInputLabel.body` - HTTP pieprasījuma body objekts (neapstrādāts JSON payload)
- `$textInputLabel.headers` - HTTP pieprasījuma headers objekts (visas header atslēgas ir ar mazajiem burtiem)
- `$textInputLabel.query` - URL vaicājuma parametru objekts

Piekļūstiet pieprasījuma datiem šādi:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Tipu konvertēšanas funkcijas
- `str(value)` - Konvertēt uz string
- `int(value)` - Konvertēt uz integer
- `float(value)` - Konvertēt uz float
- `bool(value)` - Konvertēt uz boolean
- `list(value)` - Konvertēt uz list
- `dict(key=value, ...)` - Izveidot dictionary ar atslēgvārdu argumentiem (piem., `$dict(name="Ali", age=30)`)

## Matemātiskās funkcijas
- `len(value)` - Iegūt garumu
- `abs(value)` - Absolūtā vērtība
- `min(a, b)` - Minimālā vērtība
- `max(a, b)` - Maksimālā vērtība
- `round(value)` - Noapaļot skaitli
- `sum(list)` - List elementu summa
- `sorted(list)` - Kārtot list
- `randomInt(min, max)` - Nejaušs integer

## Masīvu funkcijas
- `$array(a, b, c)` - Izveidot masīvu no argumentiem (piem., `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Izveidot integer intervālu no `a` līdz `b`, izslēdzot `b` (piem., `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Neizdodas, ja `a > b`
- `notNull(list)` - Noņemt null vērtības no masīva

## String veidošanas funkcija (map/filter izteiksmēm)
- `concat(a, b, c, ...)` - Savienot N argumentus
  - Izmantojiet `.map()` iekšienē kā izteiksmes string (bez `$` string iekšienē)
  - Izmantojiet vienpēdiņas concat string iekšienē:
    - Pareizi: `concat('prefix', 'item.field', 'suffix')`

## Objektu literāļi / Dictionaries
Izveidojiet objektus/dictionaries, izmantojot krokainās iekavas sintaksi ar jebkurām string atslēgām:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dinamiskās atslēgas
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Objektu literāļu noteikumi
- Atslēgas var būt jebkurš string (ieskaitot atstarpes/īpašās rakstzīmes)
- Atslēgas OBLIGĀTI jāiekļauj dubultpēdiņās (piem., `"key"`)
- Vērtības var būt string/integer/boolean/izteiksmes/ligzdoti objekti

## String funkcijas
- `upper(text)` - Uz lielajiem burtiem
- `lower(text)` - Uz mazajiem burtiem
- `strip(text)` - Noņemt atstarpes
- `capitalize(text)` - Pirmais burts uz lielo
- `title(text)` - Virsraksta reģistrs
- `split(text, separator)` - Sadalīt string
- `join(separator, list)` - Savienot list
- `replace(text, old, new)` - Aizstāt tekstu
- `regexReplace(text, pattern, replacement)` - Aizstāt ar regex pattern
- `base64Encode(text)` - Kodēt UTF-8 tekstu kā standarta Base64
- `base64Decode(text)` - Dekodēt standarta Base64 UTF-8 tekstā
- `toJson(text)` - Parsēt JSON string objektā, masīvā vai vērtībā

## String metodes (string vērtībām)
- `.orEmpty()` - Atgriezt string vērtību vai `""`, ja vērtība ir null/trūkst
- `.upper()` / `.lower()` - Reģistra konvertēšana
- `.strip()` - Noņemt atstarpes
- `.capitalize()` / `.title()` - Pirmais burts uz lielo
- `.length` - String garums
- `.toString()` - Konvertēt uz string
- `.substring(start, end)` - Izgūt apakšstring
- `.contains(text)` - Pārbaudīt, vai satur apakšstring
- `.startswith(prefix)` / `.endswith(suffix)` - Pārbaudīt prefiksu/sufiksu
- `.indexOf(text)` - Atrast pozīciju (atgriež -1, ja nav atrasts)
- `.replace(old, new)` - Aizstāt pirmo gadījumu
- `.replaceAll(old, new)` - Aizstāt visus gadījumus
- `.regexReplace(pattern, replacement)` - Aizstāt ar regex pattern
- `.hash()` - String MD5 hash
- `.base64Encode()` - Kodēt UTF-8 tekstu kā standarta Base64
- `.base64Decode()` - Dekodēt standarta Base64 UTF-8 tekstā
- `.urlEncode()` - URL kodēt string
- `.urlDecode()` - URL dekodēt string
- `.escape()` - JSON escape string (konvertēt īpašās rakstzīmes JSON formātā)
- `.unescape()` - JSON unescape string (konvertēt JSON formātu atpakaļ oriģinālajā string)
- `.toJson()` - Parsēt JSON string objektā, masīvā vai vērtībā

### String metožu piemēri
- `$profile.nickname.orEmpty()` - Konvertēt nullable/trūkstošu tekstu uz tukšu string
- `$text.upper()` - Konvertēt uz lielajiem burtiem
- `$text.lower()` - Konvertēt uz mazajiem burtiem
- `$text.strip()` - Noņemt atstarpes
- `$text.replace("old", "new")` - Aizstāt tekstu
- `$text.replaceAll("a", "b")` - Aizstāt visus gadījumus
- `$text.length` - Iegūt string garumu
- `$text.escape()` - Escape īpašās JSON rakstzīmes (piem., pēdiņas, jaunas rindas)
- `$escapedText.unescape()` - Unescape JSON formatētu string atpakaļ oriģinālajā
- `$text.toJson()` - Parsēt JSON objekta/masīva string (tad `$text.toJson().repoUrl`)
- `$toJson($text)` - Tas pats parsēšana kā funkcija
- `$base64Encode("Héym 🌍")` - Atgriezt `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Dekodēt Base64 UTF-8 tekstā
- `$text.urlEncode()` - URL kodēt API parametriem
- `$encodedText.urlDecode()` - Dekodēt URL kodētu tekstu
## Masīvu metodes (masīviem)
- `.first()` - Iegūt pirmo elementu
- `.last()` - Iegūt pēdējo elementu
- `.random()` - Iegūt nejaušu elementu
- `.reverse()` - Apgriezt masīvu
- `.flat()` - Saplacināt ligzdotos masīvus vienā masīvā
- `.flat(depth)` - Saplacināt ar dziļuma ierobežojumu
- `.distinct()` - Noņemt dublikātus
- `.distinctBy(expr)` - Noņemt dublikātus pēc izteiksmes (piem., `$array.distinctBy("item.id")`)
- `.notNull()` - Noņemt null vērtības
- `.add(item)` - Pievienot elementu (atgriež jaunu masīvu)
- `.contains(item)` - Pārbaudīt, vai masīvs satur elementu (atgriež boolean)
- `.join(separator)` - Apvienot masīva elementus virknē
- `.filter(expr)` - Filtrēt masīvu, izmantojot `item` mainīgo (piem., `$array.filter("item > 5")`)
- `.map(expr)` - Pārveidot katru elementu, izmantojot `item` mainīgo (piem., `$array.map("item.name")`)
- `.sort(expr, order)` - Kārtot pēc izteiksmes, order ir `"asc"` (pēc noklusējuma) vai `"desc"`
- `.take(n)` - Ņemt pirmos N (pozitīvs) vai pēdējos N (negatīvs) elementus
- `.length` - Masīva garums
- `.toString()` - Pārvērst par JSON virkni

### Filter / Map / Sort piemēri
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Objektu/Vārdnīcu metodes (objektiem)
- `.get(key)` - Iegūt vērtību pēc atslēgas (atgriež null, ja nav atrasta)
- `.get(key, default)` - Iegūt vērtību pēc atslēgas ar noklusējuma rezervi
- `.keys()` - Atgriezt visu atslēgu sarakstu
- `.values()` - Atgriezt visu vērtību sarakstu
- `.entries()` - Atgriezt `{key, value}` objektu sarakstu (viens uz katru rekvizītu)
- `.filter(expr)` - Iterēt `{key, value}` ierakstus un atgriezt atbilstošos ierakstus kā sarakstu (izmantojiet `item.key` / `item.value` izteiksmē `expr`)
- `.map(expr)` - Iterēt `{key, value}` ierakstus un atgriezt pārveidoto vērtību sarakstu (izmantojiet `item.key` / `item.value` izteiksmē `expr`)
- `.toString()` - Pārvērst par JSON virkni

### Objektu iterācijas piemēri
Iterējot objektu ar `.map()` vai `.filter()`, katrs `item` ir `{key, value}` pāris:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → to rekvizītu nosaukumu saraksts, kas nav null

## Datums/Laiks
- `$now` - Pašreizējais datums un laiks
- `$now.format("YYYY-MM-DD")` - Formatēt datumu/laiku
- `$now.toISO()` / `.toDate()` / `.toTime()` - Pārvērst formātus
- `$now.addDays(n)` / `.addHours(n)` - Datuma matemātika
- `$Date("2024-01-15")` - Parsēt datuma virkni

## Skaitliskās operācijas
- Pamata matemātika: `+`, `-`, `*`, `/`, `%`
- Salīdzinājumi: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Būla operatori: `and`, `or`, `not`

## Būla nosacījumi
Būla vērtībām rakstiet izteiksmi tieši (nepiespiediet `== true`):
- Nepareizi: `$nodeName.isValid == true`
- Pareizi: `$nodeName.isValid`
- Noliegums: `not $nodeName.isValid`

## Noteikumi un atļauto saraksts (kritiski svarīgi)
### `$` izvietošanas noteikumi
- Patstāvīga izteiksme parasti sākas ar sākuma `$`.
- Veidnes virknes var saturēt vairākus `$refs`.
- Metodes parametri var arī saturēt ligzdotus `$refs`, ja vēlaties nodot citas izteiksmes rezultātu (dinamisku atslēgu vai ligzdotu izšķiršanu).
  - Derīgi: `$node.method(other.field)` — `other` tiek izšķirts no konteksta kā augšlīmeņa label (bez `$` argumenta iekšienē).
  - Derīgi: `$node.method($other.field)` — ligzdots `$` tiek atbalstīts evaluate dialoga priekšskatījumā un nosacījumu novērtēšanā.
  - Derīgi: `$array($a.x, $b.y)`
  - Automātiskā pabeigšana `.get(` iekšienē ievieto **tukšus** `label.field` ceļus (bez sākuma `$`), tāpat kā `$array(...)` / `$notNull(...)` iekšienē.
- **Evaluate API (Run):** Ja visa iesniegtā vērtība ir viens punkta ceļš **bez** sākuma `$` (piemēram, redaktorā atlasīts teksts, kā `execute.outputs.output.result.today`), backend to apstrādā tāpat kā `$execute.outputs.output.result.today`. Vērtības, kas pēc apstrādes satur jaunas rindas rakstzīmi vai carriage return, netiek pārrakstītas (lai izvairītos no neviennozīmīgiem daudzrindu payload). Saglabātajos workflow laukos priekšroku dodiet `$` rakstīšanai; pārrakstīšana galvenokārt paredzēta pārbaudei un rīkiem.
- Evaluate dialoga `Run` rezultāts ir patiesības avots tam, kā konkrēta izteiksme tiek izšķirta.

### Masīvu virkņu pēdiņas
Veidojot masīvus ar virkņu vērtībām, VIENMĒR izmantojiet dubultās pēdiņas:
- Pareizi: `$array("hello", "world")`
- Nepareizi: `$array('hello', 'world')`

### IZMANTOJIET TIKAI ŠĪS FUNKCIJAS (atļauto saraksts)
Izmantojiet TIKAI:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumentētās virkņu/masīvu/objektu metodes

Ja funkcija nav uzskaitīta iepriekš, tā neeksistē.

### Masīvu / Vārdnīcu metožu ierobežojumi
- Masīvi VAR izmantot TIKAI: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objekti/Vārdnīcas VAR izmantot TIKAI: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Rezervētie mezglu nosaukumi
Neizmantojiet šos nosaukumus kā mezglu nosaukumus: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Piemēri

**Condition**: `$input.text.length > 0`

**LLM user message**: `$input.text`

**Output message**: `$llm.text`

**Variable value**: `$input.count + 1`

### DSL piemērs

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Saistītie

- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – Paplašināms redaktors ar backend tiešsaistes priekšskatījumu un automātisko pabeigšanu
- [Canvas Features](./canvas-features.md) – Datu pin izteiksmju testēšanai bez mezglu atkārtotas palaišanas
- [Node Types](./node-types.md) – Mezgli, kas izmanto izteiksmes ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md) u.c.)
- [Sticky Note](../nodes/sticky-note-node.md) – Kanvas markdown piezīmes ar rediģējamu virsrakstu, krāsu un attēlu attēlošanu
- [Agent Node](../nodes/agent-node.md) – Izteiksmju izmantošana aģentu promptos
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled` un `memoryShares` aģenta `data` (nevis izteiksmju laukos)
- [Workflow Structure](./workflow-structure.md) – Mezglu `data` lauki, kas pieņem izteiksmes
- [Credentials Tab](../tabs/credentials-tab.md) – Akreditācijas dati, uz kuriem atsaucas mezgli
- [Credentials Sharing](./credentials-sharing.md) – Akreditācijas datu koplietošana un `$credentials` izmantošana izteiksmēs
- [Global Variables](./global-variables.md) – Pastāvīgie mainīgie ar `$global`
