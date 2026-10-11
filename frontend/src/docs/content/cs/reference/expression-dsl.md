# Expression DSL

Heym používá jednoduchý výrazový jazyk pro odkazování na data z předchozích uzlů. Výrazy používejte v konfiguraci uzlů, jako jsou LLM `userMessage`, Condition `condition`, Output `message`, mapování v uzlu Set a hodnoty proměnných. Pro větší editor, živý náhled poháněný backendem a výběr výstupních cest použijte [Dialog vyhodnocení výrazů](./expression-evaluation-dialog.md).

## Základní odkazy

### Vstupní uzel vs. pojmenované uzly

- **`$input`** – Použijte pouze tehdy, když existuje jediný předchozí [Input](../nodes/input-node.md) uzel a chcete odkazovat na jeho výstup. Příklad: `$input.text`. Jde o zkratku pro „data z připojeného vstupu“.
- **`$nodeLabel.field`** – Použijte pro odkaz na jakýkoli předchozí uzel podle jeho **labelu** (hodnota `label` v datech uzlu). Upřednostněte tento způsob, když máte více uzlů nebo když AI Assistant / workflow DSL očekává explicitní labely. Příklad: `$userInput.body.text`, `$myLLM.text`.

**Kdy použít který:**

| Kontext | Preferujte | Příklad |
|--------|--------|---------|
| Jediný vstupní uzel, jednoduchý tok | `$input.text` | Výstupní zpráva z jednoho Input uzlu |
| Více uzlů nebo pojmenované odkazy | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Vždy `$nodeLabel.field` | Tvůrce workflow očekává labely, nikoli `$input` |

### Vstupní uzel

Použijte `$input` pro odkaz na data Input uzlu, když existuje jediný předchozí vstup:

```
$input.text
```

### Pojmenované uzly

Odkazujte na jakýkoli předchozí uzel podle jeho labelu. Když má uzel [připnutá data](./canvas-features.md#data-pin), našeptávač výrazů použije tato data místo výstupu z provedení.

```
$llm.text
$httpResponse.body
$condition
```

### Přihlašovací údaje

Použijte `$credentials.CredentialName` pro odkaz na hodnoty přihlašovacích údajů (např. API klíče, bearer tokeny nebo integrační tokeny Notion) podle názvu. Viz [Sdílení přihlašovacích údajů](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Názvy, které nejsou prostými identifikátory (obsahují `-`, začínají číslicí nebo jsou rezervovanými slovy), používají formu se závorkami: `$credentials["my-api-key"]`.

### Globální proměnné

Použijte `$global.variableName` pro odkaz na [Globální proměnné](./global-variables.md) – trvalá data typu klíč-hodnota vázaná na uživatele, spravovaná na kartě [Variables](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Vnořená pole

Pro vnořené objekty použijte tečkovou notaci:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literály

- **Řetězce**: `"hello"` nebo `'hello'`
- **Čísla**: `42`, `3.14`
- **Booleovské hodnoty**: `true`, `false`
- **Null**: `null`

## Zachování typu

Když je **celá** hodnota jediným `$expr`, backend zachová nativní typ:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Když je výraz součástí většího řetězce, je výsledek vždy řetězec:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

Uzly [Sticky Note](../nodes/sticky-note-node.md) slouží jako dokumentace na plátně, nikoli jako spustitelná pole výrazů. Jejich obsah `note` se vykresluje jako markdown, proto používejte běžné markdown odkazy a obrázky místo výrazů `$...`.

Sticky notes podporují vlastní zobrazovaný název a šest uložených barev pozadí:

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

Povolené hodnoty `stickyColor` jsou `yellow`, `sky`, `emerald`, `rose`, `violet` a `zinc`.

## Aritmetika

Podporované operátory: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Porovnání

Použijte v uzlech [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Kontext smyčky

Uvnitř uzlu [Loop](../nodes/loop-node.md) použijte `item` pro odkaz na aktuální prvek pole:

```
item.name
item.value
```

## Speciální proměnné
- `$now` – Aktuální datum a čas s metodami formátování
- `$Date()` – Vytvoření/parsování data (např. `$Date("2024-01-15")`)
- `$UUID` – Generování 32znakového jedinečného identifikátoru (BEZ závorek; použijte `$UUID`, nikoli `$UUID()`)
- `$workflowName` – Název aktuálního workflow
- `$workflowDescription` – Popis aktuálního workflow
- `$workflowPath` – Relativní cesta workflow, např. `/workflows/<id>`
- `$workflowUrl` – Absolutní URL workflow, např. `https://<host>/workflows/<id>`
- `$executionId` – Id aktuálního provedení (rovná se id záznamu v [Execution History](./execution-history.md), takže `/workflows/<id>/<executionId>` otevře toto spuštění na plátně). **Pouze za běhu**: v dialogu náhledu výrazů prázdné; naplní se pouze během provádění workflow.
- `$vars` – Proměnné lokální pro workflow (přístup přes `$vars.variableName`; aktualizace přes uzel `variable`)
- `$global` – Trvalé úložiště globálních proměnných (přístup přes `$global.variableName`)

### Použití $vars
- `$vars.counter` – Přístup k proměnné s názvem `counter`
- `$vars.myArray.add("item")` – Přidání prvku do proměnné typu pole

### Použití $global
- `$global.environment` – Přístup ke globální proměnné s názvem `environment`
- `$global.settings.baseUrl` – Přístup k vnořeným polím v globální proměnné typu objekt
## Kontext požadavku (spuštění API)
Když je workflow spuštěn prostřednictvím HTTP API, vstupní uzly obdrží dodatečná metadata požadavku:
- `$textInputLabel.body` - objekt těla HTTP požadavku (raw JSON payload)
- `$textInputLabel.headers` - objekt hlaviček HTTP požadavku (všechny klíče hlaviček jsou malými písmeny)
- `$textInputLabel.query` - objekt parametrů URL query

Přístup k datům požadavku:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Funkce pro převod typů
- `str(value)` - Převod na řetězec
- `int(value)` - Převod na celé číslo
- `float(value)` - Převod na desetinné číslo
- `bool(value)` - Převod na boolean
- `list(value)` - Převod na seznam
- `dict(key=value, ...)` - Vytvoření slovníku pomocí klíčových argumentů (např. `$dict(name="Ali", age=30)`)

## Matematické funkce
- `len(value)` - Získání délky
- `abs(value)` - Absolutní hodnota
- `min(a, b)` - Minimální hodnota
- `max(a, b)` - Maximální hodnota
- `round(value)` - Zaokrouhlení čísla
- `sum(list)` - Součet seznamu
- `sorted(list)` - Seřazení seznamu
- `randomInt(min, max)` - Náhodné celé číslo

## Funkce pro pole
- `$array(a, b, c)` - Vytvoření pole z argumentů (např. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Vytvoření rozsahu celých čísel od `a` do `b` s vyloučením `b` (např. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Selže, když `a > b`
- `notNull(list)` - Odstranění hodnot null z pole

## Funkce pro sestavení řetězce (pro výrazy map/filter)
- `concat(a, b, c, ...)` - Spojení N argumentů
  - Použijte uvnitř `.map()` jako výrazový řetězec (bez `$` uvnitř řetězce)
  - Uvnitř řetězce concat používejte jednoduché uvozovky:
    - Správně: `concat('prefix', 'item.field', 'suffix')`

## Objektové literály / slovníky
Vytvářejte objekty/slovníky pomocí syntaxe se složenými závorkami s libovolnými řetězcovými klíči:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dynamické klíče
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Pravidla objektových literálů
- Klíče mohou být libovolné řetězce (včetně mezer/speciálních znaků)
- Klíče MUSÍ být uzavřeny v dvojitých uvozovkách (např. `"key"`)
- Hodnoty mohou být řetězce/čísla/booleany/výrazy/vnořené objekty

## Funkce pro řetězce
- `upper(text)` - Převod na velká písmena
- `lower(text)` - Převod na malá písmena
- `strip(text)` - Odstranění bílých znaků
- `capitalize(text)` - Velké první písmeno
- `title(text)` - Velká první písmena slov
- `split(text, separator)` - Rozdělení řetězce
- `join(separator, list)` - Spojení seznamu
- `replace(text, old, new)` - Nahrazení textu
- `regexReplace(text, pattern, replacement)` - Nahrazení pomocí regex vzoru
- `base64Encode(text)` - Kódování UTF-8 textu do standardního Base64
- `base64Decode(text)` - Dekódování standardního Base64 do UTF-8 textu
- `toJson(text)` - Parsování JSON řetězce na objekt, pole nebo hodnotu

## Metody řetězců (na hodnotách řetězců)
- `.orEmpty()` - Vrátí hodnotu řetězce nebo `""`, když je hodnota null/chybějící
- `.upper()` / `.lower()` - Převod velikosti písmen
- `.strip()` - Odstranění bílých znaků
- `.capitalize()` / `.title()` - Velká písmena
- `.length` - Délka řetězce
- `.toString()` - Převod na řetězec
- `.substring(start, end)` - Extrakce podřetězce
- `.contains(text)` - Kontrola, zda obsahuje podřetězec
- `.startswith(prefix)` / `.endswith(suffix)` - Kontrola prefixu/sufixu
- `.indexOf(text)` - Nalezení pozice (vrací -1, pokud nenalezeno)
- `.replace(old, new)` - Nahrazení prvního výskytu
- `.replaceAll(old, new)` - Nahrazení všech výskytů
- `.regexReplace(pattern, replacement)` - Nahrazení pomocí regex vzoru
- `.hash()` - MD5 hash řetězce
- `.base64Encode()` - Kódování UTF-8 textu do standardního Base64
- `.base64Decode()` - Dekódování standardního Base64 do UTF-8 textu
- `.urlEncode()` - URL kódování řetězce
- `.urlDecode()` - URL dekódování řetězce
- `.escape()` - JSON escape řetězce (převod speciálních znaků do JSON formátu)
- `.unescape()` - JSON unescape řetězce (převod JSON formátu na původní řetězec)
- `.toJson()` - Parsování JSON řetězce na objekt, pole nebo hodnotu

### Příklady metod řetězců
- `$profile.nickname.orEmpty()` - Převod nullable/chybějícího textu na prázdný řetězec
- `$text.upper()` - Převod na velká písmena
- `$text.lower()` - Převod na malá písmena
- `$text.strip()` - Odstranění bílých znaků
- `$text.replace("old", "new")` - Nahrazení textu
- `$text.replaceAll("a", "b")` - Nahrazení všech výskytů
- `$text.length` - Získání délky řetězce
- `$text.escape()` - Escape speciálních JSON znaků (např. uvozovek, nových řádků)
- `$escapedText.unescape()` - Unescape JSON formátovaného řetězce zpět na původní
- `$text.toJson()` - Parsování JSON objektu/řetězce pole (poté `$text.toJson().repoUrl`)
- `$toJson($text)` - Stejné parsování jako funkce
- `$base64Encode("Héym 🌍")` - Vrátí `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Dekódování Base64 do UTF-8 textu
- `$text.urlEncode()` - URL kódování pro API parametry
- `$encodedText.urlDecode()` - Dekódování URL kódovaného textu
## Metody pole (pro pole)
- `.first()` - Získá první prvek
- `.last()` - Získá poslední prvek
- `.random()` - Získá náhodný prvek
- `.reverse()` - Obrátí pole
- `.flat()` - Sloučí vnořená pole do jednoho pole
- `.flat(depth)` - Sloučí s omezením hloubky
- `.distinct()` - Odstraní duplicity
- `.distinctBy(expr)` - Odstraní duplicity podle výrazu (např. `$array.distinctBy("item.id")`)
- `.notNull()` - Odstraní hodnoty null
- `.add(item)` - Připojí prvek (vrací nové pole)
- `.contains(item)` - Ověří, zda pole obsahuje prvek (vrací boolean)
- `.join(separator)` - Spojí prvky pole do řetězce
- `.filter(expr)` - Filtruje pole pomocí proměnné `item` (např. `$array.filter("item > 5")`)
- `.map(expr)` - Transformuje každý prvek pomocí proměnné `item` (např. `$array.map("item.name")`)
- `.sort(expr, order)` - Řadí podle výrazu, pořadí je `"asc"` (výchozí) nebo `"desc"`
- `.take(n)` - Vezme prvních N (kladné) nebo posledních N (záporné) prvků
- `.length` - Délka pole
- `.toString()` - Převede na JSON řetězec

### Příklady Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Metody objektu/slovníku (pro objekty)
- `.get(key)` - Získá hodnotu podle klíče (vrací null, pokud není nalezena)
- `.get(key, default)` - Získá hodnotu podle klíče s výchozí náhradní hodnotou
- `.keys()` - Vrací seznam všech klíčů
- `.values()` - Vrací seznam všech hodnot
- `.entries()` - Vrací seznam objektů `{key, value}` (jeden pro každou vlastnost)
- `.filter(expr)` - Iteruje položky `{key, value}` a vrací odpovídající položky jako seznam (uvnitř `expr` použijte `item.key` / `item.value`)
- `.map(expr)` - Iteruje položky `{key, value}` a vrací seznam transformovaných hodnot (uvnitř `expr` použijte `item.key` / `item.value`)
- `.toString()` - Převede na JSON řetězec

### Příklady iterace objektu
Při iteraci objektu pomocí `.map()` nebo `.filter()` je každý `item` pár `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → seznam názvů vlastností, které nejsou null

## Datum/Čas
- `$now` - Aktuální datum a čas
- `$now.format("YYYY-MM-DD")` - Formátování data/času
- `$now.toISO()` / `.toDate()` / `.toTime()` - Převod formátů
- `$now.addDays(n)` / `.addHours(n)` - Matematika s datem
- `$Date("2024-01-15")` - Parsování řetězce s datem

## Numerické operace
- Základní matematika: `+`, `-`, `*`, `/`, `%`
- Porovnání: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Booleovské operátory: `and`, `or`, `not`

## Booleovské podmínky
U booleanů pište výraz přímo (nevynucujte `== true`):
- Špatně: `$nodeName.isValid == true`
- Správně: `$nodeName.isValid`
- Negace: `not $nodeName.isValid`

## Pravidla a whitelist (kritické)
### Pravidla umístění `$`
- Samostatný výraz obvykle začíná úvodním `$`.
- Šablonové řetězce mohou obsahovat více `$refs`.
- Parametry metod mohou také obsahovat vnořené `$refs`, pokud chcete předat výsledek jiného výrazu (dynamický klíč nebo vnořené rozlišení).
  - Platné: `$node.method(other.field)` — `other` je rozlišen z kontextu jako nejvyšší popisek (žádné `$` uvnitř argumentu).
  - Platné: `$node.method($other.field)` — vnořené `$` je podporováno v náhledu dialogu Evaluate a při vyhodnocování podmínek.
  - Platné: `$array($a.x, $b.y)`
  - Automatické doplňování uvnitř `.get(` vkládá **holé** cesty `label.field` (bez úvodního `$`), stejně jako uvnitř `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Pokud je celá odeslaná hodnota jediná tečková cesta **bez** úvodního `$` (například text vybraný v editoru, jako `execute.outputs.output.result.today`), backend s ní zachází stejně jako s `$execute.outputs.output.result.today`. Hodnoty, které po oříznutí obsahují znak nového řádku nebo návrat vozíku, nejsou přepisovány (vyhýbá se nejednoznačným víceřádkovým payloadům). V uložených polích workflow preferujte psaní `$`; přepis je určen především pro inspekci a nástroje.
- Výsledek `Run` v dialogu Evaluate je zdrojem pravdy pro to, jak se konkrétní výraz vyhodnotí.

### Uvozování řetězců v polích
Při vytváření polí s řetězcovými hodnotami VŽDY používejte dvojité uvozovky:
- Správně: `$array("hello", "world")`
- Špatně: `$array('hello', 'world')`

### POUŽÍVEJTE POUZE TYTO FUNKCE (whitelist)
Používejte POUZE:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumentované metody pro řetězce/pole/objekty

Pokud funkce není uvedena výše, neexistuje.

### Limity metod polí / slovníků
- Pole mohou používat POUZE: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objekty/Slovníky mohou používat POUZE: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Rezervované názvy uzlů

Nepoužívejte tyto názvy jako označení uzlů: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Příklady

**Podmínka**: `$input.text.length > 0`

**Uživatelská zpráva LLM**: `$input.text`

**Výstupní zpráva**: `$llm.text`

**Hodnota proměnné**: `$input.count + 1`

### Příklad DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Související

- [Dialog vyhodnocení výrazů](./expression-evaluation-dialog.md) – Rozšiřitelný editor s živým náhledem backendu a automatickým doplňováním
- [Funkce plátna](./canvas-features.md) – Datový pin pro testování výrazů bez opětovného spouštění uzlů
- [Typy uzlů](./node-types.md) – Uzly, které používají výrazy ([LLM](../nodes/llm-node.md), [Podmínka](../nodes/condition-node.md), [Výstup](../nodes/output-node.md), [Nastavit](../nodes/set-node.md) atd.)
- [Sticky Note](../nodes/sticky-note-node.md) – Markdown poznámky na plátně s upravitelným názvem, barvou a zobrazením obrázků
- [Uzel Agent](../nodes/agent-node.md) – Použití výrazů v promptech agenta
- [Trvalá paměť agenta](./agent-persistent-memory.md) – `persistentMemoryEnabled` a `memoryShares` v `data` agenta (nikoli pole výrazů)
- [Struktura Workflow](./workflow-structure.md) – Pole `data` uzlů, která přijímají výrazy
- [Záložka Přihlašovací údaje](../tabs/credentials-tab.md) – Přihlašovací údaje odkazované uzly
- [Sdílení přihlašovacích údajů](./credentials-sharing.md) – Sdílejte přihlašovací údaje a používejte `$credentials` ve výrazech
- [Globální proměnné](./global-variables.md) – Trvalé proměnné s `$global`
