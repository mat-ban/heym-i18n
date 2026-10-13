# Expression DSL

Heym anvender et simpelt expressionssprog til at referere til data fra opstrømsnoder. Expressions kan bruges i nodekonfigurationer såsom LLM `userMessage`, Condition `condition`, Output `message`, Set-mapping og Variable-værdier. Brug [Expression Evaluation Dialog](./expression-evaluation-dialog.md) til en større editor, backend-drevet live forhåndsvisning og outputsti-valg.

## Grundlæggende referencer

### Input Node vs navngivne noder

- **`$input`** – Anvendes kun, når der er en enkelt opstrøms [Input](../nodes/input-node.md)-node, og der ønskes at referere til dens output. Eksempel: `$input.text`. Dette er en genvej for "data fra den tilsluttede input."
- **`$nodeLabel.felt`** – Anvendes til at referere til enhver opstrømsnode via dens **label** (den `label` i nodens data). Foretrækkes, når der er flere noder, eller når AI Assistant / workflow DSL forventer eksplicitte labels. Eksempel: `$userInput.body.text`, `$myLLM.text`.

**Hvornår man bruger hvad:**

| Kontekst | Foretrukket | Eksempel |
|--------|--------|---------|
| Enkelt input-node, simpel flow | `$input.text` | Outputbesked fra én Input |
| Flere noder eller navngivne referencer | `$nodeLabel.felt` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Altid `$nodeLabel.felt` | Workflow-builder forventer labels, ikke `$input` |

### Input Node

Brug `$input` til at referere til Input-nodens data, når der er en enkelt opstrøms input:

```
$input.text
```

### Navngivne noder

Referer til enhver opstrømsnode via dens label. Når en node har [fastgjorte data](./canvas-features.md#data-pin), bruges disse i stedet for eksekveringsoutput i expression completion.

```
$llm.text
$httpResponse.body
$condition
```

### Legitimationsoplysninger

Brug `$credentials.CredentialName` til at referere til credential-værdier (f.eks. API-nøgler, bearer tokens eller Notion-integrationstokens) ved navn. Se [Credentials Sharing](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Navne, der ikke er almindelige identifikatorer (indeholder `-`, starter med et tal eller er reserverede ord), bruger bracket-formen: `$credentials["my-api-key"]`.

### Globale variabler

Brug `$global.variabelNavn` til at referere til [Global Variables](./global-variables.md) – persistente, brugerdefinerede nøgle-værdi-data administreret i [Variables-tabben](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Indlejrede felter

Brug punktnotation til indlejrede objekter:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literaler

- **Strings**: `"hello"` eller `'hello'`
- **Tal**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`

## Typebevarelse

Når **hele** værdien er et enkelt `$expr`, bevarer backenden den native type:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Når et expression er en del af en større streng, er det endelige resultat altid en streng:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

[Sticky Note](../nodes/sticky-note-node.md)-noder er canvas-dokumentation, ikke eksekverbare expression-felter. Deres `note`-indhold gengives som markdown, så brug almindelige markdown-links og billeder i stedet for `$...`-expressions.

Sticky notes understøtter en brugerdefineret visningstitel og seks gemte baggrundsfarver:

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

Tilladte `stickyColor`-værdier er `yellow`, `sky`, `emerald`, `rose`, `violet` og `zinc`.

## Aritmetik

Understøttede operatorer: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Sammenligninger

Brug i [Condition](../nodes/condition-node.md)-noder: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Loop-kontekst

I en [Loop](../nodes/loop-node.md)-node bruges `item` til at referere til det aktuelle array-element:

```
item.name
item.value
```

## Specielle variabler
- `$now` - Aktuel dato og tid med formateringsmetoder
- `$Date()` - Opret/parse dato (f.eks. `$Date("2024-01-15")`)
- `$UUID` - Generer 32-tegn unik identifikator (INGEN parenteser; brug `$UUID` ikke `$UUID()`)
- `$workflowName` - Aktuelt workflows navn
- `$workflowDescription` - Aktuelt workflows beskrivelse
- `$workflowPath` - Relativ sti til workflowet, f.eks. `/workflows/<id>`
- `$workflowUrl` - Absolut URL til workflowet, f.eks. `https://<host>/workflows/<id>`
- `$executionId` - Aktuel eksekverings id (svarer til [Execution History](./execution-history.md)-postens id, så `/workflows/<id>/<executionId>` åbner denne kørsel på canvas). **Kun under kørsel**: tom i expression preview dialog; udfyldes kun mens et workflow eksekveres.
- `$vars` - Workflow-lokale variabler (adgang via `$vars.variabelNavn`; opdateres via `variable`-node)
- `$global` - Persistente globale variabler (adgang via `$global.variabelNavn`)
- `$page.record` - Kun for workflows i dashboard-widgets: posten for den detaljeside, som widgetten befinder sig på, fra dashboardets `?record=`-parameter. Er `null` på et dashboard åbnet uden en sådan parameter samt i dialogboksen til forhåndsvisning af udtryk. En node med etiketten `page` har forrang. Se [Detaljesider](../tabs/dashboard-tab.md#detail-pages).

### $vars brug
- `$vars.counter` - Adgang til en variabel ved navn `counter`
- `$vars.myArray.add("item")` - Tilføj element til en array-variabel

### $global brug
- `$global.environment` - Adgang til en global variabel ved navn `environment`
- `$global.settings.baseUrl` - Adgang til indlejrede felter i en objekt-type global variabel
## Request Context (API Execution)
Når et workflow udføres via HTTP API, modtager input-noder yderligere metadata om anmodningen:
- `$textInputLabel.body` - HTTP-anmodningens body-objekt (rå JSON payload)
- `$textInputLabel.headers` - HTTP-anmodningens headers-objekt (alle header-nøgler er lowercase)
- `$textInputLabel.query` - URL-queryparametre som objekt

Adgang til anmodningsdata sker via:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Typekonverteringsfunktioner
- `str(value)` - Konverter til streng
- `int(value)` - Konverter til heltal
- `float(value)` - Konverter til decimaltal
- `bool(value)` - Konverter til boolsk værdi
- `list(value)` - Konverter til liste
- `dict(key=value, ...)` - Opret dictionary med nøgleordsparametre (f.eks. `$dict(name="Ali", age=30)`)

## Matematiske funktioner
- `len(value)` - Hent længde
- `abs(value)` - Absolut værdi
- `min(a, b)` - Minimumsværdi
- `max(a, b)` - Maksimumsværdi
- `round(value)` - Afrund tal
- `sum(list)` - Sum af liste
- `sorted(list)` - Sorter liste
- `randomInt(min, max)` - Tilfældigt heltal

## Array-funktioner
- `$array(a, b, c)` - Opret array fra argumenter (f.eks. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Opret heltalsinterval fra `a` til `b` hvor `b` er ekskluderet (f.eks. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Fejler hvis `a > b`
- `notNull(list)` - Fjern null-værdier fra array

## Strengbyggningsfunktion (til map/filter-udtryk)
- `concat(a, b, c, ...)` - Sammenkæd N argumenter
  - Anvendes inden for `.map()` som et strengudtryk (uden `$` i strengen)
  - Brug enkeltanførselstegn i concat-strengen:
    - Korrekt: `concat('prefix', 'item.field', 'suffix')`

## Objektliteraler / Dictionaries
Opret objekter/dictionaries ved hjælp af krøllede parenteser med vilkårlige strengnøgler:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dynamiske nøgler
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Regler for objektliteraler
- Nøgler kan være vilkårlige strenge (inklusive mellemrum/specialtegn)
- Nøgler SKAL anføres med dobbeltanførselstegn (f.eks. `"key"`)
- Værdier kan være strenge/tal/booleanske værdier/udtryk/nestede objekter

## Strengfunktioner
- `upper(text)` - Store bogstaver
- `lower(text)` - Små bogstaver
- `strip(text)` - Fjern whitespace
- `capitalize(text)` - Stort begyndelsesbogstav
- `title(text)` - Titelcase
- `split(text, separator)` - Opdel streng
- `join(separator, list)` - Sammenføj liste
- `replace(text, old, new)` - Erstat tekst
- `regexReplace(text, pattern, replacement)` - Erstat med regex-mønster
- `base64Encode(text)` - Enkod UTF-8 tekst som standard Base64
- `base64Decode(text)` - Dekod standard Base64 til UTF-8 tekst
- `toJson(text)` - Parse en JSON-streng til et objekt, array eller værdi

## Strengmetoder (på strengværdier)
- `.orEmpty()` - Returner strengværdien, eller `""` hvis værdien er null/mangler
- `.upper()` / `.lower()` - Case-konvertering
- `.strip()` - Fjern whitespace
- `.capitalize()` / `.title()` - Stort begyndelsesbogstav
- `.length` - Strenglængde
- `.toString()` - Konverter til streng
- `.substring(start, end)` - Ekstraher delstreng
- `.contains(text)` - Tjek for delstreng
- `.startswith(prefix)` / `.endswith(suffix)` - Tjek præfiks/suffiks
- `.indexOf(text)` - Find position (returnerer -1 hvis ikke fundet)
- `.replace(old, new)` - Erstat første forekomst
- `.replaceAll(old, new)` - Erstat alle forekomster
- `.regexReplace(pattern, replacement)` - Erstat med regex-mønster
- `.hash()` - MD5-hash af strengen
- `.base64Encode()` - Enkod UTF-8 tekst som standard Base64
- `.base64Decode()` - Dekod standard Base64 til UTF-8 tekst
- `.urlEncode()` - URL-enkod streng
- `.urlDecode()` - URL-dekod streng
- `.escape()` - JSON-escape streng (konverter specialtegn til JSON-format)
- `.unescape()` - JSON-unescape streng (konverter JSON-format til original streng)
- `.toJson()` - Parse en JSON-streng til et objekt, array eller værdi

### Eksempler på strengmetoder
- `$profile.nickname.orEmpty()` - Konverter nullable/manglende tekst til tom streng
- `$text.upper()` - Konverter til store bogstaver
- `$text.lower()` - Konverter til små bogstaver
- `$text.strip()` - Fjern whitespace
- `$text.replace("old", "new")` - Erstat tekst
- `$text.replaceAll("a", "b")` - Erstat alle forekomster
- `$text.length` - Hent strenglængde
- `$text.escape()` - Escape specialtegn i JSON (f.eks. anførselstegn, linjeskift)
- `$escapedText.unescape()` - Unescape JSON-formateret streng tilbage til original
- `$text.toJson()` - Parse en JSON-objekt/array-streng (derefter `$text.toJson().repoUrl`)
- `$toJson($text)` - Samme parse som funktion
- `$base64Encode("Héym 🌍")` - Returner `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Dekod Base64 til UTF-8 tekst
- `$text.urlEncode()` - URL-enkod til API-parametre
- `$encodedText.urlDecode()` - Dekod URL-enkodet tekst
## Array-metoder (på arrays)
- `.first()` - Henter første element
- `.last()` - Henter sidste element
- `.random()` - Henter tilfældigt element
- `.reverse()` - Vender arrayet
- `.flat()` - Flader nestede arrays ud til et enkelt array
- `.flat(depth)` - Flader ud med dybdebegrænsning
- `.distinct()` - Fjerner dubletter
- `.distinctBy(expr)` - Fjerner dubletter baseret på udtryk (f.eks. `$array.distinctBy("item.id")`)
- `.notNull()` - Fjerner null-værdier
- `.add(item)` - Tilføjer element (returnerer nyt array)
- `.contains(item)` - Tjekker om arrayet indeholder element (returnerer boolean)
- `.join(separator)` - Sammenføjer array-elementer til en streng
- `.filter(expr)` - Filtrerer array ved brug af `item`-variabel (f.eks. `$array.filter("item > 5")`)
- `.map(expr)` - Transformerer hvert element ved brug af `item`-variabel (f.eks. `$array.map("item.name")`)
- `.sort(expr, order)` - Sorterer efter udtryk, rækkefølge er `"asc"` (standard) eller `"desc"`
- `.take(n)` - Tager første N (positiv) eller sidste N (negativ) elementer
- `.length` - Array-længde
- `.toString()` - Konverterer til JSON-streng

### Filter / Map / Sort eksempler
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Objekt/ordbogsmetoder (på objekter)
- `.get(key)` - Henter værdi via nøgle (returnerer null hvis ikke fundet)
- `.get(key, default)` - Henter værdi via nøgle med standardfaldback
- `.keys()` - Returnerer liste med alle nøgler
- `.values()` - Returnerer liste med alle værdier
- `.entries()` - Returnerer liste med `{key, value}`-objekter (én per egenskab)
- `.filter(expr)` - Itererer `{key, value}`-poster og returnerer matchende poster som liste (brug `item.key` / `item.value` i `expr`)
- `.map(expr)` - Itererer `{key, value}`-poster og returnerer liste med transformerede værdier (brug `item.key` / `item.value` i `expr`)
- `.toString()` - Konverterer til JSON-streng

### Objektiterationseksempler
Ved iteration af et objekt med `.map()` eller `.filter()`, er hvert `item` et `{key, value}`-par:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → liste over egenskabsnavne, der ikke er null

## Dato/klokkeslæt
- `$now` - Nuværende dato og tid
- `$now.format("YYYY-MM-DD")` - Formaterer dato/klokkeslæt
- `$now.toISO()` / `.toDate()` / `.toTime()` - Konverterer formater
- `$now.addDays(n)` / `.addHours(n)` - Datoberegninger
- `$Date("2024-01-15")` - Fortolker datostreng

## Numeriske operationer
- Grundlæggende matematik: `+`, `-`, `*`, `/`, `%`
- Sammenligninger: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Booleske operatorer: `and`, `or`, `not`

## Booleske betingelser
For booleske værdier skrives udtrykket direkte (brug ikke `== true`):
- Forkert: `$nodeName.isValid == true`
- Korrekt: `$nodeName.isValid`
- Negation: `not $nodeName.isValid`

## Regler & Whitelist (kritisk)
### $-placering
- Et selvstændigt udtryk starter normalt med et ledende `$`.
- Skabelonstrenge kan indeholde flere `$refs`.
- Metodeparametre kan også indeholde nestede `$refs`, når der ønskes at videregive resultatet af et andet udtryk (dynamisk nøgle eller nested resolution).
  - Gyldigt: `$node.method(other.field)` — `other` resolves fra kontekst som en top-level label (ingen `$` i argumentet).
  - Gyldigt: `$node.method($other.field)` — nested `$` understøttes i evalueringsdialogen og betingelsesevaluering.
  - Gyldigt: `$array($a.x, $b.y)`
  - Autocomplete indenfor `.get(` indsætter **bare** `label.field`-stier (uden ledende `$`), samme som indenfor `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Hvis hele den indsendte værdi er en enkelt punktstier **uden** ledende `$` (f.eks. tekst valgt i editoren, som `execute.outputs.output.result.today`), behandler backenden det samme som `$execute.outputs.output.result.today`. Værdier, der indeholder linjeskift eller retur efter trimming, omskrives ikke (undgår tvetydige multi-line payloads). Foretræk at skrive `$` i gemte workflow-felter; omskrivningen er primært til inspektion og værktøjer.
- Evaluate-dialogens `Run`-resultat er sandhedskilden for, hvordan et konkret udtryk resolves.

### Array-strengcitater
Ved oprettelse af arrays med strengværdier skal der ALTID anvendes dobbeltcitationstegn:
- Korrekt: `$array("hello", "world")`
- Forkert: `$array('hello', 'world')`

### KUN DISSE FUNKTIONER (Whitelist)
Brug KUN:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumenterede streng/array/objekt-metoder

Hvis en funktion ikke er listet ovenfor, eksisterer den ikke.

### Arrays / Dicts-metodebegrænsninger
- Arrays kan KUN bruge: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objekter/Dicts kan KUN bruge: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Reserverede Node Label-navne
Undlad at bruge følgende navne som node-labels: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Eksempler

**Betingelse**: `$input.text.length > 0`

**LLM-brugermeddelelse**: `$input.text`

**Outputmeddelelse**: `$llm.text`

**Variabelværdi**: `$input.count + 1`

### DSL-eksempel

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Relateret

- [Udtryksvurderingsdialog](./expression-evaluation-dialog.md) – Udvidelig editor med live forhåndsvisning og autofærdiggørelse i backend
- [Canvas-funktioner](./canvas-features.md) – Datapin til test af udtryk uden at genkøre noder
- [Node-typer](./node-types.md) – Noder der bruger udtryk ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md), osv.)
- [Klistermærke-node](../nodes/sticky-note-node.md) – Markdown-noter på canvas med redigerbar titel, farve og billedvisning
- [Agent-node](../nodes/agent-node.md) – Brug af udtryk i agent-prompts
- [Agenters persistente hukommelse](./agent-persistent-memory.md) – `persistentMemoryEnabled` og `memoryShares` i agent-`data` (ikke udtryksfelter)
- [Workflow-struktur](./workflow-structure.md) – Node-`data`-felter der accepterer udtryk
- [Legitimationsoplysningsfanen](../tabs/credentials-tab.md) – Legitimationsoplysninger refereret af noder
- [Deling af legitimationsoplysninger](./credentials-sharing.md) – Del legitimationsoplysninger og brug `$credentials` i udtryk
- [Globale variabler](./global-variables.md) – Persistente variabler med `$global`
