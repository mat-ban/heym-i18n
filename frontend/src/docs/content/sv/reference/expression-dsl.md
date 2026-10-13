# Expression DSL

Heym använder ett enkelt uttrycksspråk för att referera till data från uppströmsnoder. Uttryck används i nodkonfiguration såsom LLM `userMessage`, Condition `condition`, Output `message`, Set-mappningar och Variable-värden. Använd [Expression Evaluation Dialog](./expression-evaluation-dialog.md) för en större editor, backend-driven live-förhandsvisning och val av utdatasökväg.

## Grundläggande referenser

### Input-nod kontra namngivna noder

- **`$input`** – Används endast när det finns en enda uppströms [Input](../nodes/input-node.md)-nod och dess utdata ska refereras. Exempel: `$input.text`. Detta är en förkortning för "data från den anslutna inputen."
- **`$nodeLabel.field`** – Används för att referera till valfri uppströmsnod via dess **label** (`label` i nodens data). Detta föredras när det finns flera noder eller när AI Assistant / workflow DSL förväntar sig explicita labels. Exempel: `$userInput.body.text`, `$myLLM.text`.

**När respektive form ska användas:**

| Kontext | Föredra | Exempel |
|--------|--------|---------|
| Enkel input-nod, enkelt flöde | `$input.text` | Output-meddelande från en Input |
| Flera noder eller namngivna referenser | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Alltid `$nodeLabel.field` | Workflow-byggaren förväntar sig labels, inte `$input` |

### Input-nod

Använd `$input` för att referera till Input-nodens data när det finns en enda uppströms input:

```
$input.text
```

### Namngivna noder

Referera till valfri uppströmsnod via dess label. När en nod har [pinned data](./canvas-features.md#data-pin) använder uttryckskomplettering denna istället för körningsutdata.

```
$llm.text
$httpResponse.body
$condition
```

### Credentials

Använd `$credentials.CredentialName` för att referera till credential-värden (t.ex. API-nycklar, bearer tokens eller Notion-integrationstokens) via namn. Se [Credentials Sharing](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Namn som inte är vanliga identifierare (de innehåller `-`, börjar med en siffra eller är reserverade ord) använder hakparentesformen: `$credentials["my-api-key"]`.

### Globala variabler

Använd `$global.variableName` för att referera till [Global Variables](./global-variables.md) – persistent, användarscopad nyckel-värde-data som hanteras i [Variables tab](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Nästlade fält

Använd punktnotation för nästlade objekt:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literaler

- **Strängar**: `"hello"` eller `'hello'`
- **Tal**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`

## Typbevarande

När **hela** värdet är ett enda `$expr` bevarar backend den ursprungliga typen:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

När ett uttryck är en del av en större sträng är slutresultatet alltid en sträng:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

[Sticky Note](../nodes/sticky-note-node.md)-noder är canvas-dokumentation, inte körbara uttrycksfält. Deras `note`-innehåll renderas som markdown, så använd vanliga markdown-länkar och bilder istället för `$...`-uttryck.

Sticky notes stöder en anpassad visningstitel och sex sparade bakgrundsfärger:

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

Tillåtna värden för `stickyColor` är `yellow`, `sky`, `emerald`, `rose`, `violet` och `zinc`.

## Aritmetik

Operatorer som stöds: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Jämförelser

Används i [Condition](../nodes/condition-node.md)-noder: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Loop-kontext

Inuti en [Loop](../nodes/loop-node.md)-nod används `item` för att referera till det aktuella arrayelementet:

```
item.name
item.value
```

## Specialvariabler
- `$now` - Aktuellt datum och tid med formateringsmetoder
- `$Date()` - Skapa/tolka datum (t.ex. `$Date("2024-01-15")`)
- `$UUID` - Generera en unik identifierare med 32 tecken (INGA parenteser; använd `$UUID` inte `$UUID()`)
- `$workflowName` - Det aktuella workflowets namn
- `$workflowDescription` - Det aktuella workflowets beskrivning
- `$workflowPath` - Workflowets relativa sökväg, t.ex. `/workflows/<id>`
- `$workflowUrl` - Workflowets absoluta URL, t.ex. `https://<host>/workflows/<id>`
- `$executionId` - Den aktuella körningens id (motsvarar postens id i [Execution History](./execution-history.md), så `/workflows/<id>/<executionId>` öppnar denna körning på canvas). **Endast vid körning**: tom i dialogrutan för uttrycksförhandsvisning; fylls endast i medan ett workflow körs.
- `$vars` - Workflow-lokala variabler (nås via `$vars.variableName`; uppdateras via `variable`-noden)
- `$global` - Persistent global variabellagring (nås via `$global.variableName`)
- `$page.record` - Endast för workflows i instrumentpanelswidgetar: posten för detaljsidan som widgeten ligger på, från instrumentpanelens parameter `?record=`. Är `null` på en instrumentpanel som öppnats utan parametern samt i förhandsgranskningsdialogen för uttryck. En nod med etiketten `page` har företräde. Se [Detaljsidor](../tabs/dashboard-tab.md#detail-pages).

### Användning av $vars
- `$vars.counter` - Nå en variabel med namnet `counter`
- `$vars.myArray.add("item")` - Lägg till ett element i en arrayvariabel

### Användning av $global
- `$global.environment` - Nå en global variabel med namnet `environment`
- `$global.settings.baseUrl` - Nå nästlade fält i en global variabel av objekttyp
## Request Context (API-exekvering)
När en workflow körs via HTTP API tar input-noder emot ytterligare request-metadata:
- `$textInputLabel.body` - HTTP request body-objekt (rå JSON-payload)
- `$textInputLabel.headers` - HTTP request headers-objekt (alla header-nycklar är gemener)
- `$textInputLabel.query` - URL query-parametrar som objekt

Åtkomst till request-data sker så här:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Typkonverteringsfunktioner
- `str(value)` - Konvertera till sträng
- `int(value)` - Konvertera till heltal
- `float(value)` - Konvertera till flyttal
- `bool(value)` - Konvertera till boolean
- `list(value)` - Konvertera till lista
- `dict(key=value, ...)` - Skapa dictionary med nyckelordsargument (t.ex. `$dict(name="Ali", age=30)`)

## Matematiska funktioner
- `len(value)` - Hämta längd
- `abs(value)` - Absolutvärde
- `min(a, b)` - Minsta värde
- `max(a, b)` - Största värde
- `round(value)` - Avrunda tal
- `sum(list)` - Summa av lista
- `sorted(list)` - Sortera lista
- `randomInt(min, max)` - Slumpmässigt heltal

## Array-funktioner
- `$array(a, b, c)` - Skapa array från argument (t.ex. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Skapa heltalsintervall från `a` till `b` med `b` exkluderat (t.ex. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Misslyckas när `a > b`
- `notNull(list)` - Ta bort null-värden från array

## Strängbyggnadsfunktion (för map/filter-uttryck)
- `concat(a, b, c, ...)` - Sammanfoga N argument
  - Används inuti `.map()` som en uttryckssträng (inget `$` inuti strängen)
  - Använd enkla citattecken inuti concat-strängen:
    - Korrekt: `concat('prefix', 'item.field', 'suffix')`

## Objektliteraler / Dictionaries
Skapa objekt/dictionaries med klammerparentes-syntax med valfria strängnycklar:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dynamiska nycklar
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Regler för objektliteraler
- Nycklar kan vara valfri sträng (inklusive mellanslag/specialtecken)
- Nycklar MÅSTE omges av dubbla citattecken (t.ex. `"key"`)
- Värden kan vara strängar/tal/booleans/uttryck/nästlade objekt

## Strängfunktioner
- `upper(text)` - Versaler
- `lower(text)` - Gemener
- `strip(text)` - Ta bort blanksteg i kanterna
- `capitalize(text)` - Inledande versal
- `title(text)` - Titelformat
- `split(text, separator)` - Dela sträng
- `join(separator, list)` - Sammanfoga lista
- `replace(text, old, new)` - Ersätt text
- `regexReplace(text, pattern, replacement)` - Ersätt med regex-mönster
- `base64Encode(text)` - Koda UTF-8-text som standard Base64
- `base64Decode(text)` - Avkoda standard Base64 till UTF-8-text
- `toJson(text)` - Tolka en JSON-sträng som ett objekt, en array eller ett värde

## Strängmetoder (på strängvärden)
- `.orEmpty()` - Returnera strängvärdet, eller `""` när värdet är null/saknas
- `.upper()` / `.lower()` - Skiftlägeskonvertering
- `.strip()` - Ta bort blanksteg i kanterna
- `.capitalize()` / `.title()` - Inledande versal
- `.length` - Stränglängd
- `.toString()` - Konvertera till sträng
- `.substring(start, end)` - Extrahera delsträng
- `.contains(text)` - Kontrollera om delsträng finns
- `.startswith(prefix)` / `.endswith(suffix)` - Kontrollera prefix/suffix
- `.indexOf(text)` - Hitta position (returnerar -1 om den inte hittas)
- `.replace(old, new)` - Ersätt första förekomsten
- `.replaceAll(old, new)` - Ersätt alla förekomster
- `.regexReplace(pattern, replacement)` - Ersätt med regex-mönster
- `.hash()` - MD5-hash av strängen
- `.base64Encode()` - Koda UTF-8-text som standard Base64
- `.base64Decode()` - Avkoda standard Base64 till UTF-8-text
- `.urlEncode()` - URL-koda sträng
- `.urlDecode()` - URL-avkoda sträng
- `.escape()` - JSON-escape sträng (konvertera specialtecken till JSON-format)
- `.unescape()` - JSON-unescape sträng (konvertera JSON-format till originalsträng)
- `.toJson()` - Tolka en JSON-sträng som ett objekt, en array eller ett värde

### Exempel på strängmetoder
- `$profile.nickname.orEmpty()` - Konvertera nullable/saknad text till en tom sträng
- `$text.upper()` - Konvertera till versaler
- `$text.lower()` - Konvertera till gemener
- `$text.strip()` - Ta bort blanksteg
- `$text.replace("old", "new")` - Ersätt text
- `$text.replaceAll("a", "b")` - Ersätt alla förekomster
- `$text.length` - Hämta stränglängd
- `$text.escape()` - Escapa speciella JSON-tecken (t.ex. citattecken, radbrytningar)
- `$escapedText.unescape()` - Unescapa JSON-formaterad sträng tillbaka till originalet
- `$text.toJson()` - Tolka en JSON-objekt-/array-sträng (sedan `$text.toJson().repoUrl`)
- `$toJson($text)` - Samma tolkning som funktion
- `$base64Encode("Héym 🌍")` - Returnerar `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Avkoda Base64 till UTF-8-text
- `$text.urlEncode()` - URL-koda för API-parametrar
- `$encodedText.urlDecode()` - Avkoda URL-kodad text
## Array-metoder (på arrayer)
- `.first()` - Hämta första elementet
- `.last()` - Hämta sista elementet
- `.random()` - Hämta slumpmässigt element
- `.reverse()` - Vänd arrayen
- `.flat()` - Platta ut nästlade arrayer till en enda array
- `.flat(depth)` - Platta ut med djupbegränsning
- `.distinct()` - Ta bort dubbletter
- `.distinctBy(expr)` - Ta bort dubbletter baserat på uttryck (t.ex. `$array.distinctBy("item.id")`)
- `.notNull()` - Ta bort null-värden
- `.add(item)` - Lägg till element (returnerar ny array)
- `.contains(item)` - Kontrollera om arrayen innehåller elementet (returnerar boolean)
- `.join(separator)` - Slå samman arrayelement till en sträng
- `.filter(expr)` - Filtrera arrayen med variabeln `item` (t.ex. `$array.filter("item > 5")`)
- `.map(expr)` - Transformera varje element med variabeln `item` (t.ex. `$array.map("item.name")`)
- `.sort(expr, order)` - Sortera efter uttryck, ordning är `"asc"` (standard) eller `"desc"`
- `.take(n)` - Hämta första N (positivt) eller sista N (negativt) elementen
- `.length` - Arrayens längd
- `.toString()` - Konvertera till JSON-sträng

### Exempel på Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Object/Dictionary-metoder (på objekt)
- `.get(key)` - Hämta värde via nyckel (returnerar null om det inte hittas)
- `.get(key, default)` - Hämta värde via nyckel med standardvärde som fallback
- `.keys()` - Returnera en lista över alla nycklar
- `.values()` - Returnera en lista över alla värden
- `.entries()` - Returnera en lista av `{key, value}`-objekt (ett per egenskap)
- `.filter(expr)` - Iterera `{key, value}`-poster och returnera matchande poster som en lista (använd `item.key` / `item.value` i `expr`)
- `.map(expr)` - Iterera `{key, value}`-poster och returnera en lista av transformerade värden (använd `item.key` / `item.value` i `expr`)
- `.toString()` - Konvertera till JSON-sträng

### Exempel på objektiteration
Vid iteration av ett objekt med `.map()` eller `.filter()` är varje `item` ett `{key, value}`-par:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → lista över egenskapsnamn som inte är null

## Datum/Tid
- `$now` - Aktuellt datum och tid
- `$now.format("YYYY-MM-DD")` - Formatera datum/tid
- `$now.toISO()` / `.toDate()` / `.toTime()` - Konvertera format
- `$now.addDays(n)` / `.addHours(n)` - Datummatematik
- `$Date("2024-01-15")` - Tolka datumsträng

## Numeriska operationer
- Grundläggande matematik: `+`, `-`, `*`, `/`, `%`
- Jämförelser: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Booleska operatorer: `and`, `or`, `not`

## Booleska villkor
För booleaner, skriv uttrycket direkt (tvinga inte `== true`):
- Fel: `$nodeName.isValid == true`
- Rätt: `$nodeName.isValid`
- Negering: `not $nodeName.isValid`

## Regler & vitlista (kritiskt)
### Regler för $ placering
- Ett fristående uttryck börjar vanligtvis med ett inledande `$`.
- Mallsträngar kan innehålla flera `$refs`.
- Metodparametrar kan även innehålla nästlade `$refs` när resultatet av ett annat uttryck ska skickas in (dynamisk nyckel eller nästlad uppslagning).
  - Giltigt: `$node.method(other.field)` — `other` löses upp från kontexten som en toppnivåetikett (inget `$` inuti argumentet).
  - Giltigt: `$node.method($other.field)` — nästlat `$` stöds i förhandsvisningen av utvärderingsdialogen och vid villkorsutvärdering.
  - Giltigt: `$array($a.x, $b.y)`
  - Autokomplettering inuti `.get(` infogar **bara** `label.field`-sökvägar (utan inledande `$`), samma som inuti `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Om hela det inskickade värdet är en enda punktseparerad sökväg **utan** inledande `$` (till exempel text markerad i editorn, som `execute.outputs.output.result.today`), behandlar backend det på samma sätt som `$execute.outputs.output.result.today`. Värden som innehåller en ny rad eller vagnretur efter trimning skrivs inte om (undviker tvetydiga flerradiga payloads). Föredra att skriva `$` i sparade workflow-fält; omskrivningen är främst för inspektion och verktyg.
- Resultatet från `Run` i utvärderingsdialogen är den auktoritativa källan för hur ett konkret uttryck löses upp.

### Citattecken för strängar i arrayer
Vid skapande av arrayer med strängvärden, använd ALLTID dubbla citattecken:
- Rätt: `$array("hello", "world")`
- Fel: `$array('hello', 'world')`

### ANVÄND ENDAST DESSA FUNKTIONER (vitlista)
Använd ENDAST:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumenterade sträng-/array-/objektmetoder

Om en funktion inte finns med i listan ovan existerar den inte.

### Begränsningar för array-/dict-metoder
- Arrayer kan ENDAST använda: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objekt/Dicts kan ENDAST använda: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Reserverade nodetiketter

Använd inte dessa namn som nodetiketter: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Exempel

**Condition**: `$input.text.length > 0`

**LLM user message**: `$input.text`

**Output message**: `$llm.text`

**Variable value**: `$input.count + 1`

### DSL-exempel

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Relaterat

- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – Expanderbar editor med live-förhandsvisning från backend och autokomplettering
- [Canvas Features](./canvas-features.md) – Data pin för testning av uttryck utan att köra om noder
- [Node Types](./node-types.md) – Noder som använder uttryck ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md), etc.)
- [Sticky Note](../nodes/sticky-note-node.md) – Canvas markdown-anteckningar med redigerbar titel, färg och bildvisning
- [Agent Node](../nodes/agent-node.md) – Användning av uttryck i agent-prompts
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled` och `memoryShares` i agent-`data` (inte uttrycksfält)
- [Workflow Structure](./workflow-structure.md) – Nod-`data`-fält som accepterar uttryck
- [Credentials Tab](../tabs/credentials-tab.md) – Credentials som refereras av noder
- [Credentials Sharing](./credentials-sharing.md) – Dela credentials och använd `$credentials` i uttryck
- [Global Variables](./global-variables.md) – Persistenta variabler med `$global`
