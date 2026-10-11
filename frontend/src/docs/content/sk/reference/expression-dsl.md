# Expression DSL

Heym používa jednoduchý výrazový jazyk na odkazovanie na dáta z predchádzajúcich uzlov. Výrazy používajte v konfigurácii uzlov, ako napríklad LLM `userMessage`, Condition `condition`, Output `message`, mapovania Set a hodnoty premenných. Pre väčší editor, live náhľad poháňaný backendom a výber výstupných ciest použite [Dialóg vyhodnotenia výrazu](./expression-evaluation-dialog.md).

## Základné odkazy

### Vstupný uzol vs. pomenované uzly

- **`$input`** – Použite iba vtedy, keď existuje jediný predchádzajúci [Vstupný](../nodes/input-node.md) uzol a chcete odkázať na jeho výstup. Príklad: `$input.text`. Ide o skratku pre „dáta z pripojeného vstupu."
- **`$nodeLabel.field`** – Použite na odkazovanie na ľubovoľný predchádzajúci uzol podľa jeho **labelu** (pole `label` v dátach uzla). Uprednostnite tento spôsob, keď máte viacero uzlov alebo keď AI Assistant / workflow DSL očakáva explicitné labely. Príklad: `$userInput.body.text`, `$myLLM.text`.

**Kedy použiť ktorý:**

| Kontext | Uprednostnite | Príklad |
|--------|--------|---------|
| Jediný vstupný uzol, jednoduchý tok | `$input.text` | Výstupná správa z jedného Vstupu |
| Viacero uzlov alebo pomenované odkazy | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Vždy `$nodeLabel.field` | Tvorca workflowu očakáva labely, nie `$input` |

### Vstupný uzol

Použite `$input` na odkazovanie na dáta Vstupného uzla, keď existuje jediný predchádzajúci vstup:

```
$input.text
```

### Pomenované uzly

Odkazujte na ľubovoľný predchádzajúci uzol podľa jeho labelu. Keď má uzol [pinned data](./canvas-features.md#data-pin), dopĺňanie výrazov použije tieto dáta namiesto výstupu spustenia.

```
$llm.text
$httpResponse.body
$condition
```

### Prihlasovacie údaje

Použite `$credentials.CredentialName` na odkazovanie na hodnoty prihlasovacích údajov (napr. API kľúče, bearer tokeny alebo Notion integration tokeny) podľa názvu. Pozrite si [Zdieľanie prihlasovacích údajov](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Názvy, ktoré nie sú jednoduchými identifikátormi (obsahujú `-`, začínajú číslicou alebo sú rezervovanými slovami), používajú formu so zátvorkami: `$credentials["my-api-key"]`.

### Globálne premenné

Použite `$global.variableName` na odkazovanie na [Globálne premenné](./global-variables.md) – perzistentné, používateľom viazané kľúč-hodnota dáta spravované v [karte Premenné](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Vnorené polia

Pre vnorené objekty použite bodkovú notáciu:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literály

- **Reťazce**: `"hello"` alebo `'hello'`
- **Čísla**: `42`, `3.14`
- **Booleany**: `true`, `false`
- **Null**: `null`

## Zachovanie typu

Keď je **celá** hodnota jediným `$expr`, backend zachová natívny typ:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Keď je výraz súčasťou väčšieho reťazca, konečný výsledok je vždy reťazec:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

Uzly [Sticky Note](../nodes/sticky-note-node.md) slúžia ako dokumentácia na plátne, nie ako spustiteľné polia výrazov. Ich obsah `note` sa vykresľuje ako markdown, preto používajte bežné markdown odkazy a obrázky namiesto výrazov `$...`.

Sticky notes podporujú vlastný zobrazovaný titulok a šesť uložených farieb pozadia:

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

Povolené hodnoty `stickyColor` sú `yellow`, `sky`, `emerald`, `rose`, `violet` a `zinc`.

## Aritmetika

Podporované operátory: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Porovnania

Použite v uzloch [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Kontext Loop

Vnútri uzla [Loop](../nodes/loop-node.md) použite `item` na odkazovanie na aktuálny prvok poľa:

```
item.name
item.value
```

## Špeciálne premenné
- `$now` – Aktuálny dátum a čas s metódami formátovania
- `$Date()` – Vytvorenie/parsovanie dátumu (napr. `$Date("2024-01-15")`)
- `$UUID` – Generovanie 32-znakového jedinečného identifikátora (BEZ zátvoriek; použite `$UUID`, nie `$UUID()`)
- `$workflowName` – Názov aktuálneho workflowu
- `$workflowDescription` – Popis aktuálneho workflowu
- `$workflowPath` – Relatívna cesta workflowu, napr. `/workflows/<id>`
- `$workflowUrl` – Absolútna URL workflowu, napr. `https://<host>/workflows/<id>`
- `$executionId` – ID aktuálneho spustenia (rovná sa ID záznamu v [Histórii spustení](./execution-history.md), takže `/workflows/<id>/<executionId>` otvorí toto spustenie na plátne). **Iba za behu**: prázdne v dialógu náhľadu výrazu; naplnené iba počas spúšťania workflowu.
- `$vars` – Lokálne premenné workflowu (prístup cez `$vars.variableName`; aktualizované cez uzol `variable`)
- `$global` – Perzistentné úložisko globálnych premenných (prístup cez `$global.variableName`)

### Použitie $vars
- `$vars.counter` – Prístup k premennej s názvom `counter`
- `$vars.myArray.add("item")` – Pridanie prvku do premennej typu pole

### Použitie $global
- `$global.environment` – Prístup ku globálnej premennej s názvom `environment`
- `$global.settings.baseUrl` – Prístup k vnoreným poliam v globálnej premennej typu objekt
## Kontext požiadavky (spustenie API)
Keď sa workflow spustí prostredníctvom HTTP API, vstupné uzly prijímajú dodatočné metadáta požiadavky:
- `$textInputLabel.body` - objekt tela HTTP požiadavky (raw JSON payload)
- `$textInputLabel.headers` - objekt hlavičiek HTTP požiadavky (všetky kľúče hlavičiek sú malými písmenami)
- `$textInputLabel.query` - objekt parametrov URL query

Prístup k údajom požiadavky:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Funkcie na konverziu typov
- `str(value)` - Konverzia na string
- `int(value)` - Konverzia na integer
- `float(value)` - Konverzia na float
- `bool(value)` - Konverzia na boolean
- `list(value)` - Konverzia na list
- `dict(key=value, ...)` - Vytvorenie dictionary pomocou keyword argumentov (napr. `$dict(name="Ali", age=30)`)

## Matematické funkcie
- `len(value)` - Získanie dĺžky
- `abs(value)` - Absolútna hodnota
- `min(a, b)` - Minimálna hodnota
- `max(a, b)` - Maximálna hodnota
- `round(value)` - Zaokrúhlenie čísla
- `sum(list)` - Súčet listu
- `sorted(list)` - Zoradenie listu
- `randomInt(min, max)` - Náhodné celé číslo

## Funkcie pre polia
- `$array(a, b, c)` - Vytvorenie poľa z argumentov (napr. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Vytvorenie rozsahu celých čísel od `a` po `b` s vylúčením `b` (napr. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Zlyhá, keď `a > b`
- `notNull(list)` - Odstránenie null hodnôt z poľa

## Funkcia na skladanie stringov (pre map/filter výrazy)
- `concat(a, b, c, ...)` - Spojenie N argumentov
  - Použite vnútri `.map()` ako výrazový string (bez `$` vnútri stringu)
  - Vnútri concat stringu používajte jednoduché úvodzovky:
    - Správne: `concat('prefix', 'item.field', 'suffix')`

## Objektové literály / Dictionary
Vytvárajte objekty/dictionary pomocou syntaxe so zloženými zátvorkami s ľubovoľnými string kľúčmi:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dynamické kľúče
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Pravidlá objektových literálov
- Kľúče môžu byť ľubovoľné stringy (vrátane medzier/špeciálnych znakov)
- Kľúče MUSIA byť v úvodzovkách s dvojitými úvodzovkami (napr. `"key"`)
- Hodnoty môžu byť stringy/čísla/booleany/výrazy/vnorené objekty

## Funkcie pre stringy
- `upper(text)` - Veľké písmená
- `lower(text)` - Malé písmená
- `strip(text)` - Odstránenie medzier
- `capitalize(text)` - Prvé písmeno veľké
- `title(text)` - Title case
- `split(text, separator)` - Rozdelenie stringu
- `join(separator, list)` - Spojenie listu
- `replace(text, old, new)` - Nahradenie textu
- `regexReplace(text, pattern, replacement)` - Nahradenie pomocou regex patternu
- `base64Encode(text)` - Kódovanie UTF-8 textu ako štandardný Base64
- `base64Decode(text)` - Dekódovanie štandardného Base64 do UTF-8 textu
- `toJson(text)` - Parsovanie JSON stringu na objekt, pole alebo hodnotu

## Metódy pre stringy (na string hodnotách)
- `.orEmpty()` - Vráti string hodnotu alebo `""`, keď je hodnota null/chýbajúca
- `.upper()` / `.lower()` - Konverzia veľkosti písmen
- `.strip()` - Odstránenie medzier
- `.capitalize()` / `.title()` - Prvé písmeno veľké
- `.length` - Dĺžka stringu
- `.toString()` - Konverzia na string
- `.substring(start, end)` - Extrakcia podstringu
- `.contains(text)` - Kontrola, či obsahuje podstring
- `.startswith(prefix)` / `.endswith(suffix)` - Kontrola prefixu/sufixu
- `.indexOf(text)` - Nájdenie pozície (vráti -1, ak sa nenájde)
- `.replace(old, new)` - Nahradenie prvého výskytu
- `.replaceAll(old, new)` - Nahradenie všetkých výskytov
- `.regexReplace(pattern, replacement)` - Nahradenie pomocou regex patternu
- `.hash()` - MD5 hash stringu
- `.base64Encode()` - Kódovanie UTF-8 textu ako štandardný Base64
- `.base64Decode()` - Dekódovanie štandardného Base64 do UTF-8 textu
- `.urlEncode()` - URL kódovanie stringu
- `.urlDecode()` - URL dekódovanie stringu
- `.escape()` - JSON escape stringu (konverzia špeciálnych znakov do JSON formátu)
- `.unescape()` - JSON unescape stringu (konverzia JSON formátu na pôvodný string)
- `.toJson()` - Parsovanie JSON stringu na objekt, pole alebo hodnotu

### Príklady metód pre stringy
- `$profile.nickname.orEmpty()` - Konverzia nullable/chýbajúceho textu na prázdny string
- `$text.upper()` - Konverzia na veľké písmená
- `$text.lower()` - Konverzia na malé písmená
- `$text.strip()` - Odstránenie medzier
- `$text.replace("old", "new")` - Nahradenie textu
- `$text.replaceAll("a", "b")` - Nahradenie všetkých výskytov
- `$text.length` - Získanie dĺžky stringu
- `$text.escape()` - Escape špeciálnych JSON znakov (napr. úvodzoviek, nových riadkov)
- `$escapedText.unescape()` - Unescape JSON formátovaného stringu späť na pôvodný
- `$text.toJson()` - Parsovanie JSON objektu/poľa stringu (potom `$text.toJson().repoUrl`)
- `$toJson($text)` - Rovnaké parsovanie ako funkcia
- `$base64Encode("Héym 🌍")` - Vráti `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Dekódovanie Base64 do UTF-8 textu
- `$text.urlEncode()` - URL kódovanie pre API parametre
- `$encodedText.urlDecode()` - Dekódovanie URL kódovaného textu
## Metódy pre polia (na poliach)
- `.first()` – Získa prvý prvok
- `.last()` – Získa posledný prvok
- `.random()` – Získa náhodný prvok
- `.reverse()` – Obráti poradie poľa
- `.flat()` – Zlúči vnorené polia do jedného poľa
- `.flat(depth)` – Zlúči s obmedzením hĺbky
- `.distinct()` – Odstráni duplikáty
- `.distinctBy(expr)` – Odstráni duplikáty podľa výrazu (napr. `$array.distinctBy("item.id")`)
- `.notNull()` – Odstráni hodnoty null
- `.add(item)` – Pridá prvok na koniec (vráti nové pole)
- `.contains(item)` – Skontroluje, či pole obsahuje prvok (vráti boolean)
- `.join(separator)` – Spojí prvky poľa do reťazca
- `.filter(expr)` – Filtruje pole pomocou premennej `item` (napr. `$array.filter("item > 5")`)
- `.map(expr)` – Transformuje každý prvok pomocou premennej `item` (napr. `$array.map("item.name")`)
- `.sort(expr, order)` – Zoradí podľa výrazu, poradie je `"asc"` (predvolené) alebo `"desc"`
- `.take(n)` – Vezme prvých N (kladné) alebo posledných N (záporné) prvkov
- `.length` – Dĺžka poľa
- `.toString()` – Skonvertuje na JSON reťazec

### Príklady Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Metódy pre objekty/slovníky (na objektoch)
- `.get(key)` – Získa hodnotu podľa kľúča (vráti null, ak sa nenájde)
- `.get(key, default)` – Získa hodnotu podľa kľúča s predvolenou hodnotou
- `.keys()` – Vráti zoznam všetkých kľúčov
- `.values()` – Vráti zoznam všetkých hodnôt
- `.entries()` – Vráti zoznam objektov `{key, value}` (jeden na každú vlastnosť)
- `.filter(expr)` – Iteruje cez položky `{key, value}` a vráti zodpovedajúce položky ako zoznam (vo výraze `expr` použite `item.key` / `item.value`)
- `.map(expr)` – Iteruje cez položky `{key, value}` a vráti zoznam transformovaných hodnôt (vo výraze `expr` použite `item.key` / `item.value`)
- `.toString()` – Skonvertuje na JSON reťazec

### Príklady iterácie objektov
Pri iterácii objektu pomocou `.map()` alebo `.filter()` je každý `item` pár `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → zoznam názvov vlastností, ktoré nie sú null

## Dátum/Čas
- `$now` – Aktuálny dátum a čas
- `$now.format("YYYY-MM-DD")` – Formátovanie dátumu/času
- `$now.toISO()` / `.toDate()` / `.toTime()` – Konverzia formátov
- `$now.addDays(n)` / `.addHours(n)` – Matematika s dátumom
- `$Date("2024-01-15")` – Parsovanie reťazca s dátumom

## Numerické operácie
- Základná matematika: `+`, `-`, `*`, `/`, `%`
- Porovnania: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Booleovské operátory: `and`, `or`, `not`

## Booleovské podmienky
Pri booleovských hodnotách píšte výraz priamo (nevynucujte `== true`):
- Nesprávne: `$nodeName.isValid == true`
- Správne: `$nodeName.isValid`
- Negácia: `not $nodeName.isValid`

## Pravidlá a whitelist (kritické)
### Pravidlá umiestnenia `$`
- Samostatný výraz zvyčajne začína úvodným `$`.
- Šablónové reťazce môžu obsahovať viacero `$refs`.
- Parametre metód môžu tiež obsahovať vnorené `$refs`, ak chcete odovzdať výsledok iného výrazu (dynamický kľúč alebo vnorené rozlíšenie).
  - Platné: `$node.method(other.field)` — `other` sa rozlíši z kontextu ako najvyšší label (bez `$` vnútri argumentu).
  - Platné: `$node.method($other.field)` — vnorené `$` je podporované v náhľade dialógu vyhodnotenia a pri vyhodnocovaní podmienok.
  - Platné: `$array($a.x, $b.y)`
  - Automatické dopĺňanie vnútri `.get(` vkladá **holé** cesty `label.field` (bez úvodného `$`), rovnako ako vnútri `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Ak je celá odoslaná hodnota jediná bodková cesta **bez** úvodného `$` (napríklad text vybraný v editore, ako `execute.outputs.output.result.today`), backend s ňou zaobchádza rovnako ako s `$execute.outputs.output.result.today`. Hodnoty, ktoré po orezaní obsahujú znak nového riadku alebo návrat vozíka, sa neprepisujú (vyhýba sa nejednoznačným viacriadkovým payloadom). V uložených poliach workflowu uprednostnite písanie `$`; prepis je určený hlavne na kontrolu a pre nástroje.
- Výsledok `Run` v dialógu Evaluate je zdrojom pravdy pre to, ako sa konkrétny výraz rozlíši.

### Uvodzovanie reťazcov v poliach
Pri vytváraní polí s reťazcovými hodnotami VŽDY používajte dvojité úvodzovky:
- Správne: `$array("hello", "world")`
- Nesprávne: `$array('hello', 'world')`

### POUŽÍVAJTE IBA TIETO FUNKCIE (whitelist)
Používajte IBA:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumentované metódy pre reťazce/polia/objekty

Ak funkcia nie je uvedená vyššie, neexistuje.

### Limity metód pre polia / slovníky
- Polia môžu používať IBA: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objekty/Slovníky môžu používať IBA: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Rezervované názvy označení uzlov
Tieto názvy nepoužívajte ako označenia uzlov: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Príklady

**Podmienka**: `$input.text.length > 0`

**Používateľská správa pre LLM**: `$input.text`

**Výstupná správa**: `$llm.text`

**Hodnota premennej**: `$input.count + 1`

### Príklad DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Súvisiace

- [Dialóg vyhodnotenia výrazu](./expression-evaluation-dialog.md) – Rozbaliteľný editor s živým náhľadom backendu a automatickým dopĺňaním
- [Funkcie plátna](./canvas-features.md) – Dátový pin na testovanie výrazov bez opätovného spúšťania uzlov
- [Typy uzlov](./node-types.md) – Uzly, ktoré používajú výrazy ([LLM](../nodes/llm-node.md), [Podmienka](../nodes/condition-node.md), [Výstup](../nodes/output-node.md), [Nastavenie](../nodes/set-node.md) atď.)
- [Sticky Note](../nodes/sticky-note-node.md) – Markdown poznámky na plátne s upraviteľným názvom, farbou a zobrazením obrázka
- [Uzol agenta](../nodes/agent-node.md) – Používanie výrazov v promptoch agenta
- [Trvalá pamäť agenta](./agent-persistent-memory.md) – `persistentMemoryEnabled` a `memoryShares` v `data` agenta (nie polia výrazov)
- [Štruktúra workflowu](./workflow-structure.md) – Polia `data` uzla, ktoré akceptujú výrazy
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Prihlasovacie údaje odkazované uzlami
- [Zdieľanie prihlasovacích údajov](./credentials-sharing.md) – Zdieľajte prihlasovacie údaje a používajte `$credentials` vo výrazoch
- [Globálne premenné](./global-variables.md) – Trvalé premenné s `$global`
