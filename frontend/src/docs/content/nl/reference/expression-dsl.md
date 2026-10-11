# Expression DSL

Heym gebruikt een eenvoudige expressietaal om gegevens van upstream-knooppunten te refereren. Gebruik expressies in de configuratie van knooppunten, zoals LLM `userMessage`, Condition `condition`, Output `message`, Set-toewijzingen en Variabelewaarden. Gebruik de [Expression Evaluation Dialog](./expression-evaluation-dialog.md) voor een grotere editor, een door de backend aangedreven live preview en het selecteren van uitvoerpaden.

## Basisreferenties

### Input-knooppunt versus benoemde knooppunten

- **`$input`** – Gebruik dit alleen wanneer er één upstream [Input](../nodes/input-node.md)-knooppunt is en u de uitvoer daarvan wilt refereren. Voorbeeld: `$input.text`. Dit is een verkorte notatie voor "de gegevens van de verbonden input."
- **`$nodeLabel.field`** – Gebruik dit om elk upstream-knooppunt te refereren via het **label** (het `label` in de gegevens van het knooppunt). Geef hier de voorkeur aan wanneer er meerdere knooppunten zijn of wanneer de AI Assistant / workflow DSL expliciete labels verwacht. Voorbeeld: `$userInput.body.text`, `$myLLM.text`.

**Wanneer gebruikt u welke:**

| Context | Voorkeur | Voorbeeld |
|--------|--------|---------|
| Eén input-knooppunt, eenvoudige flow | `$input.text` | Uitvoerbericht van één Input |
| Meerdere knooppunten of benoemde referenties | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Altijd `$nodeLabel.field` | De workflow-builder verwacht labels, niet `$input` |

### Input-knooppunt

Gebruik `$input` om de gegevens van het Input-knooppunt te refereren wanneer er één upstream input is:

```
$input.text
```

### Benoemde knooppunten

Refereer elk upstream-knooppunt via het label. Wanneer een knooppunt [vastgezette gegevens](./canvas-features.md#data-pin) heeft, gebruikt de expressie-aanvulling die in plaats van de uitvoer van de uitvoering.

```
$llm.text
$httpResponse.body
$condition
```

### Referenties

Gebruik `$credentials.CredentialName` om referentiewaarden (bijv. API-sleutels, bearer-tokens of Notion-integratietokens) op naam te refereren. Zie [Credentials Sharing](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Namen die geen gewone identifiers zijn (ze bevatten `-`, beginnen met een cijfer of zijn gereserveerde woorden) gebruiken de haakjesvorm: `$credentials["my-api-key"]`.

### Globale variabelen

Gebruik `$global.variableName` om [Global Variables](./global-variables.md) te refereren – persistente key-value-gegevens binnen het bereik van de gebruiker, beheerd in het tabblad [Variables](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Geneste velden

Gebruik puntnotatie voor geneste objecten:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literals

- **Strings**: `"hello"` of `'hello'`
- **Getallen**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`

## Typebehoud

Wanneer de **volledige** waarde één enkele `$expr` is, behoudt de backend het oorspronkelijke type:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Wanneer een expressie deel uitmaakt van een grotere string, is het eindresultaat altijd een string:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

[Sticky Note](../nodes/sticky-note-node.md)-knooppunten zijn canvas-documentatie, geen uitvoerbare expressievelden. De inhoud van hun `note` wordt weergegeven als markdown, dus gebruik gewone markdown-links en afbeeldingen in plaats van `$...`-expressies.

Sticky notes ondersteunen een aangepaste weergavetitel en zes opgeslagen achtergrondkleuren:

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

Toegestane waarden voor `stickyColor` zijn `yellow`, `sky`, `emerald`, `rose`, `violet` en `zinc`.

## Rekenkunde

Ondersteunde operatoren: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Vergelijkingen

Gebruik in [Condition](../nodes/condition-node.md)-knooppunten: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Loop-context

Gebruik binnen een [Loop](../nodes/loop-node.md)-knooppunt `item` om het huidige array-element te refereren:

```
item.name
item.value
```

## Speciale variabelen
- `$now` - Huidige datum en tijd met opmaakmethoden
- `$Date()` - Datum aanmaken/parsen (bijv. `$Date("2024-01-15")`)
- `$UUID` - Genereer een unieke identifier van 32 tekens (GEEN haakjes; gebruik `$UUID`, niet `$UUID()`)
- `$workflowName` - Naam van de huidige workflow
- `$workflowDescription` - Beschrijving van de huidige workflow
- `$workflowPath` - Relatief pad van de workflow, bijv. `/workflows/<id>`
- `$workflowUrl` - Absoluut URL van de workflow, bijv. `https://<host>/workflows/<id>`
- `$executionId` - Id van de huidige uitvoering (gelijk aan het id van het item in de [Execution History](./execution-history.md), dus `/workflows/<id>/<executionId>` opent deze run op het canvas). **Alleen tijdens uitvoering**: leeg in het dialoogvenster voor expressievoorbeeld; alleen gevuld terwijl een workflow wordt uitgevoerd.
- `$vars` - Workflow-lokale variabelen (toegang via `$vars.variableName`; bijgewerkt via het `variable`-knooppunt)
- `$global` - Persistente globale variabeleopslag (toegang via `$global.variableName`)

### Gebruik van $vars
- `$vars.counter` - Toegang tot een variabele met de naam `counter`
- `$vars.myArray.add("item")` - Item toevoegen aan een array-variabele

### Gebruik van $global
- `$global.environment` - Toegang tot een globale variabele met de naam `environment`
- `$global.settings.baseUrl` - Toegang tot geneste velden in een globale variabele van het type object

## Requestcontext (API-uitvoering)
Wanneer een workflow via de HTTP API wordt uitgevoerd, ontvangen invoerknooppunten aanvullende requestmetadata:
- `$textInputLabel.body` - HTTP request body-object (raw JSON-payload)
- `$textInputLabel.headers` - HTTP request headers-object (alle header-sleutels zijn lowercase)
- `$textInputLabel.query` - URL-queryparameters-object

Toegang tot requestgegevens zoals:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Typeconversiefuncties
- `str(value)` - Converteren naar string
- `int(value)` - Converteren naar integer
- `float(value)` - Converteren naar float
- `bool(value)` - Converteren naar boolean
- `list(value)` - Converteren naar lijst
- `dict(key=value, ...)` - Woordenboek maken met keyword-argumenten (bijv. `$dict(name="Ali", age=30)`)

## Wiskundige functies
- `len(value)` - Lengte ophalen
- `abs(value)` - Absolute waarde
- `min(a, b)` - Minimumwaarde
- `max(a, b)` - Maximumwaarde
- `round(value)` - Getal afronden
- `sum(list)` - Som van lijst
- `sorted(list)` - Lijst sorteren
- `randomInt(min, max)` - Willekeurig geheel getal

## Array-functies
- `$array(a, b, c)` - Array maken van argumenten (bijv. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Gehele reeks maken van `a` tot `b`, waarbij `b` wordt uitgesloten (bijv. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Mislukt wanneer `a > b`
- `notNull(list)` - Null-waarden uit array verwijderen

## Functie voor stringopbouw (voor map/filter-expressies)
- `concat(a, b, c, ...)` - N argumenten samenvoegen
  - Gebruik binnen `.map()` als expressiestring (geen `$` binnen de string)
  - Gebruik enkele aanhalingstekens binnen de concat-string:
    - Correct: `concat('prefix', 'item.field', 'suffix')`

## Objectliterals / Woordenboeken
Objecten/woordenboeken maken met accolades-syntaxis met willekeurige string-sleutels:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dynamische sleutels
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Regels voor objectliterals
- Sleutels kunnen elke string zijn (inclusief spaties/specialtekens)
- Sleutels MOETEN tussen dubbele aanhalingstekens staan (bijv. `"key"`)
- Waarden kunnen strings/getallen/booleans/expressies/geneste objecten zijn

## Stringfuncties
- `upper(text)` - Hoofdletters
- `lower(text)` - Kleine letters
- `strip(text)` - Witruimte verwijderen
- `capitalize(text)` - Eerste letter hoofdletter
- `title(text)` - Titelkapitalisatie
- `split(text, separator)` - String splitsen
- `join(separator, list)` - Lijst samenvoegen
- `replace(text, old, new)` - Tekst vervangen
- `regexReplace(text, pattern, replacement)` - Vervangen met regex-patroon
- `base64Encode(text)` - UTF-8-tekst coderen als standaard Base64
- `base64Decode(text)` - Standaard Base64 decoderen naar UTF-8-tekst
- `toJson(text)` - Een JSON-string parseren naar een object, array of waarde

## Stringmethoden (op stringwaarden)
- `.orEmpty()` - Retourneer de stringwaarde, of `""` wanneer de waarde null/ontbrekend is
- `.upper()` / `.lower()` - Hoofdletterconversie
- `.strip()` - Witruimte verwijderen
- `.capitalize()` / `.title()` - Kapitalisatie
- `.length` - Stringlengte
- `.toString()` - Converteren naar string
- `.substring(start, end)` - Substring extraheren
- `.contains(text)` - Controleren of substring aanwezig is
- `.startswith(prefix)` / `.endswith(suffix)` - Prefix/suffix controleren
- `.indexOf(text)` - Positie vinden (retourneert -1 indien niet gevonden)
- `.replace(old, new)` - Eerste voorkomen vervangen
- `.replaceAll(old, new)` - Alle voorkomens vervangen
- `.regexReplace(pattern, replacement)` - Vervangen met regex-patroon
- `.hash()` - MD5-hash van de string
- `.base64Encode()` - UTF-8-tekst coderen als standaard Base64
- `.base64Decode()` - Standaard Base64 decoderen naar UTF-8-tekst
- `.urlEncode()` - String URL-coderen
- `.urlDecode()` - String URL-decoderen
- `.escape()` - JSON-string escapen (speciale tekens converteren naar JSON-formaat)
- `.unescape()` - JSON-string unescapen (JSON-formaat converteren naar oorspronkelijke string)
- `.toJson()` - Een JSON-string parseren naar een object, array of waarde

### Voorbeelden van stringmethoden
- `$profile.nickname.orEmpty()` - Nullable/ontbrekende tekst converteren naar een lege string
- `$text.upper()` - Converteren naar hoofdletters
- `$text.lower()` - Converteren naar kleine letters
- `$text.strip()` - Witruimte verwijderen
- `$text.replace("old", "new")` - Tekst vervangen
- `$text.replaceAll("a", "b")` - Alle voorkomens vervangen
- `$text.length` - Stringlengte ophalen
- `$text.escape()` - Speciale JSON-tekens escapen (bijv. aanhalingstekens, regeleinden)
- `$escapedText.unescape()` - JSON-geformatteerde string unescapen naar het origineel
- `$text.toJson()` - Een JSON-object-/array-string parseren (daarna `$text.toJson().repoUrl`)
- `$toJson($text)` - Zelfde parse als functie
- `$base64Encode("Héym 🌍")` - Retourneert `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Base64 decoderen naar UTF-8-tekst
- `$text.urlEncode()` - URL-coderen voor API-parameters
- `$encodedText.urlDecode()` - URL-gecodeerde tekst decoderen

## Array-methoden (op arrays)
- `.first()` - Eerste element ophalen
- `.last()` - Laatste element ophalen
- `.random()` - Willekeurig element ophalen
- `.reverse()` - Array omkeren
- `.flat()` - Geneste arrays samenvoegen tot één array
- `.flat(depth)` - Samenvoegen met dieptelimiet
- `.distinct()` - Duplicaten verwijderen
- `.distinctBy(expr)` - Duplicaten verwijderen op basis van expressie (bijv. `$array.distinctBy("item.id")`)
- `.notNull()` - Null-waarden verwijderen
- `.add(item)` - Element toevoegen (retourneert een nieuwe array)
- `.contains(item)` - Controleren of de array het element bevat (retourneert een boolean)
- `.join(separator)` - Array-elementen samenvoegen tot een string
- `.filter(expr)` - Array filteren met de variabele `item` (bijv. `$array.filter("item > 5")`)
- `.map(expr)` - Elk element transformeren met de variabele `item` (bijv. `$array.map("item.name")`)
- `.sort(expr, order)` - Sorteren op expressie, order is `"asc"` (standaard) of `"desc"`
- `.take(n)` - Eerste N (positief) of laatste N (negatief) elementen nemen
- `.length` - Lengte van de array
- `.toString()` - Converteren naar JSON-string

### Filter / Map / Sort-voorbeelden
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Object-/Dictionary-methoden (op objecten)
- `.get(key)` - Waarde ophalen op basis van sleutel (retourneert null indien niet gevonden)
- `.get(key, default)` - Waarde ophalen op basis van sleutel met standaardwaarde als fallback
- `.keys()` - Een lijst van alle sleutels retourneren
- `.values()` - Een lijst van alle waarden retourneren
- `.entries()` - Een lijst van `{key, value}`-objecten retourneren (één per eigenschap)
- `.filter(expr)` - `{key, value}`-items doorlopen en overeenkomende items als lijst retourneren (gebruik `item.key` / `item.value` binnen `expr`)
- `.map(expr)` - `{key, value}`-items doorlopen en een lijst van getransformeerde waarden retourneren (gebruik `item.key` / `item.value` binnen `expr`)
- `.toString()` - Converteren naar JSON-string

### Voorbeelden van object-iteratie
Bij het doorlopen van een object met `.map()` of `.filter()` is elk `item` een `{key, value}`-paar:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → lijst van eigenschapsnamen die niet null zijn

## Datum/Tijd
- `$now` - Huidige datum en tijd
- `$now.format("YYYY-MM-DD")` - Datum/tijd formatteren
- `$now.toISO()` / `.toDate()` / `.toTime()` - Formaten converteren
- `$now.addDays(n)` / `.addHours(n)` - Datumberekeningen
- `$Date("2024-01-15")` - Datumstring parsen

## Numerieke bewerkingen
- Basisrekenkunde: `+`, `-`, `*`, `/`, `%`
- Vergelijkingen: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Booleaanse operatoren: `and`, `or`, `not`

## Booleaanse voorwaarden
Schrijf voor booleans de expressie direct (forceer niet `== true`):
- Onjuist: `$nodeName.isValid == true`
- Correct: `$nodeName.isValid`
- Negatie: `not $nodeName.isValid`

## Regels & whitelist (kritiek)
### Regels voor $ plaatsing
- Een zelfstandige expressie begint doorgaans met een leidende `$`.
- Template-strings kunnen meerdere `$refs` bevatten.
- Methodeparameters kunnen ook geneste `$refs` bevatten wanneer u het resultaat van een andere expressie wilt doorgeven (dynamische sleutel of geneste resolutie).
  - Geldig: `$node.method(other.field)` — `other` wordt vanuit de context opgelost als een top-level label (geen `$` binnen het argument).
  - Geldig: `$node.method($other.field)` — geneste `$` wordt ondersteund in de preview van het evaluate-dialoogvenster en bij voorwaardelijke evaluatie.
  - Geldig: `$array($a.x, $b.y)`
  - Autocomplete binnen `.get(` voegt **bare** `label.field`-paden in (zonder leidende `$`), net als binnen `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Als de volledig ingediende waarde een enkel dot-pad is **zonder** leidende `$` (bijvoorbeeld tekst die in de editor is geselecteerd, zoals `execute.outputs.output.result.today`), behandelt de backend dit hetzelfde als `$execute.outputs.output.result.today`. Waarden die na trimmen een newline of carriage return bevatten, worden niet herschreven (om dubbelzinnige multi-line payloads te voorkomen). Geef er de voorkeur aan `$` te schrijven in opgeslagen workflow-velden; de herschrijving is voornamelijk bedoeld voor inspectie en tooling.
- Het resultaat van `Run` in het Evaluate-dialoogvenster is de bron van waarheid voor hoe een concrete expressie wordt opgelost.

### Quoting van strings in arrays
Gebruik bij het maken van arrays met stringwaarden ALTIJD dubbele aanhalingstekens:
- Correct: `$array("hello", "world")`
- Onjuist: `$array('hello', 'world')`

### GEBRUIK UITSLUITEND DEZE FUNCTIES (whitelist)
Gebruik UITSLUITEND:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- gedocumenteerde string-/array-/object-methoden

Als een functie niet in de bovenstaande lijst staat, bestaat deze niet.

### Methodelimieten voor arrays / dicts
- Arrays kunnen UITSLUITEND gebruikmaken van: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objecten/Dicts kunnen UITSLUITEND gebruikmaken van: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`

### Gereserveerde Node-labelnamen
Gebruik deze namen niet als node-labels: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Voorbeelden

**Condition**: `$input.text.length > 0`

**LLM user message**: `$input.text`

**Output message**: `$llm.text`

**Variable value**: `$input.count + 1`

### DSL-voorbeeld

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Gerelateerd

- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – Uitbreidbare editor met live backend-voorbeeld en autocomplete
- [Canvas Features](./canvas-features.md) – Data pin voor het testen van expressies zonder nodes opnieuw uit te voeren
- [Node Types](./node-types.md) – Nodes die expressies gebruiken ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md), enz.)
- [Sticky Note](../nodes/sticky-note-node.md) – Canvas markdown-notities met bewerkbare titel, kleur en afbeeldingsweergave
- [Agent Node](../nodes/agent-node.md) – Expressies gebruiken in agent-prompts
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled` en `memoryShares` in agent-`data` (geen expressievelden)
- [Workflow Structure](./workflow-structure.md) – Node-`data`-velden die expressies accepteren
- [Credentials Tab](../tabs/credentials-tab.md) – Referenties waarnaar nodes verwijzen
- [Credentials Sharing](./credentials-sharing.md) – Referenties delen en `$credentials` gebruiken in expressies
- [Global Variables](./global-variables.md) – Persistente variabelen met `$global`
