# Expression DSL

A Heym egy egyszerű kifejezésnyelvet használ a felsőbb csomópontok adatainak hivatkozására. A kifejezéseket a csomópontok konfigurációjában használhatja, például az LLM `userMessage`, a Condition `condition`, az Output `message`, a Set leképezések és a Változók értékei esetében. Nagyobb szerkesztőfelülethez, backend-vezérelt élő előnézethez és kimeneti útvonal kiválasztásához használja az [Expression Evaluation Dialog](./expression-evaluation-dialog.md) ablakot.

## Alapvető hivatkozások

### Bemeneti csomópont vs. elnevezett csomópontok

- **`$input`** – Csak akkor használja, ha egyetlen felsőbb [Input](../nodes/input-node.md) csomópont van, és annak kimenetére szeretne hivatkozni. Példa: `$input.text`. Ez egy rövidítés a "csatlakoztatott bemenet adataira".
- **`$nodeLabel.field`** – Bármely felsőbb csomópontra hivatkozhat annak **címkéjével** (a csomópont adataiban szereplő `label`). Ezt részesítse előnyben, ha több csomópontja van, vagy ha az AI Assistant / workflow DSL kifejezett címkéket vár. Példa: `$userInput.body.text`, `$myLLM.text`.

**Mikor melyiket használja:**

| Kontextus | Előnyben részesítendő | Példa |
|--------|--------|---------|
| Egyetlen bemeneti csomópont, egyszerű folyamat | `$input.text` | Output üzenet egyetlen Input csomópontból |
| Több csomópont vagy elnevezett hivatkozások | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Mindig `$nodeLabel.field` | A workflow builder címkéket vár, nem `$input`-ot |

### Bemeneti csomópont

Használja a `$input` kifejezést a Bemeneti csomópont adatainak hivatkozására, ha egyetlen felsőbb bemenet van:

```
$input.text
```

### Elnevezett csomópontok

Hivatkozzon bármely felsőbb csomópontra annak címkéjével. Ha egy csomóponton [rögzített adat](./canvas-features.md#data-pin) van, a kifejezés-kiegészítés azt használja a végrehajtási kimenet helyett.

```
$llm.text
$httpResponse.body
$condition
```

### Hitelesítési adatok

A `$credentials.CredentialName` segítségével név szerint hivatkozhat a hitelesítési adatok értékeire (pl. API kulcsok, bearer tokenek vagy Notion integrációs tokenek). Lásd: [Credentials Sharing](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Azok a nevek, amelyek nem egyszerű azonosítók (tartalmaznak `-` karaktert, számmal kezdődnek, vagy fenntartott szavak), szögletes zárójeles formát használnak: `$credentials["my-api-key"]`.

### Globális változók

A `$global.variableName` segítségével hivatkozhat a [Global Variables](./global-variables.md) értékeire – ezek tartós, felhasználóhoz kötött kulcs-érték adatok, amelyeket a [Variables tab](../tabs/global-variables-tab.md) kezel.

```
$global.environment
$global.settings.baseUrl
```

### Beágyazott mezők

Beágyazott objektumokhoz pontjelölést használjon:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literálok

- **Stringek**: `"hello"` vagy `'hello'`
- **Számok**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`

## Típusmegőrzés

Amikor a **teljes** érték egyetlen `$expr`, a backend megőrzi az eredeti típust:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Amikor egy kifejezés egy nagyobb string része, a végeredmény mindig string:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

A [Sticky Note](../nodes/sticky-note-node.md) csomópontok vászon-dokumentációt jelentenek, nem végrehajtható kifejezésmezőket. A `note` tartalmuk markdownként jelenik meg, ezért használjon normál markdown linkeket és képeket a `$...` kifejezések helyett.

A sticky notes támogatja az egyedi megjelenítési címet és hat mentett háttérszínt:

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

Az engedélyezett `stickyColor` értékek: `yellow`, `sky`, `emerald`, `rose`, `violet` és `zinc`.

## Aritmetika

Támogatott operátorok: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Összehasonlítások

A [Condition](../nodes/condition-node.md) csomópontokban használhatók: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Loop kontextus

A [Loop](../nodes/loop-node.md) csomóponton belül az `item` segítségével hivatkozhat az aktuális tömbelemre:

```
item.name
item.value
```

## Speciális változók
- `$now` - Aktuális dátum és idő formázási metódusokkal
- `$Date()` - Dátum létrehozása/értelmezése (pl. `$Date("2024-01-15")`)
- `$UUID` - 32 karakteres egyedi azonosító generálása (NINCS zárójel; használja a `$UUID` formát, ne a `$UUID()`-t)
- `$workflowName` - Az aktuális workflow neve
- `$workflowDescription` - Az aktuális workflow leírása
- `$workflowPath` - A workflow relatív útvonala, pl. `/workflows/<id>`
- `$workflowUrl` - A workflow abszolút URL-je, pl. `https://<host>/workflows/<id>`
- `$executionId` - Az aktuális futtatás azonosítója (megegyezik az [Execution History](./execution-history.md) bejegyzés azonosítójával, így a `/workflows/<id>/<executionId>` megnyitja ezt a futtatást a vásznon). **Csak futásidőben elérhető**: üres a kifejezés-előnézet ablakban; csak akkor töltődik fel, amikor egy workflow éppen fut.
- `$vars` - Workflow-lokális változók (elérés: `$vars.variableName`; frissítés: `variable` csomóponton keresztül)
- `$global` - Tartós globális változótár (elérés: `$global.variableName`)
- `$page.record` - Csak irányítópult-widget workflow-k esetén: annak a részletező oldalnak a rekordja, amelyen a widget található, az irányítópult `?record=` paraméteréből. Értéke `null` az e paraméter nélkül megnyitott irányítópulton, valamint a kifejezés-előnézeti párbeszédablakban. A `page` címkéjű csomópont elsőbbséget élvez. Lásd: [Részletező oldalak](../tabs/dashboard-tab.md#detail-pages).

### $vars használat
- `$vars.counter` - A `counter` nevű változó elérése
- `$vars.myArray.add("item")` - Elem hozzáadása egy tömb típusú változóhoz

### $global használat
- `$global.environment` - Az `environment` nevű globális változó elérése
- `$global.settings.baseUrl` - Beágyazott mezők elérése egy objektum típusú globális változóban
## Kérés kontextusa (API végrehajtás)
Amikor egy workflow HTTP API-n keresztül kerül végrehajtásra, a bemeneti csomópontok további kérés-metaadatokat kapnak:
- `$textInputLabel.body` - HTTP kérés törzs objektum (nyers JSON payload)
- `$textInputLabel.headers` - HTTP kérés fejléc objektum (minden fejléc kulcs kisbetűs)
- `$textInputLabel.query` - URL query paraméterek objektuma

A kérés adatai az alábbi módon érhetők el:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Típuskonverziós függvények
- `str(value)` - Konvertálás stringgé
- `int(value)` - Konvertálás egész számmá
- `float(value)` - Konvertálás lebegőpontos számmá
- `bool(value)` - Konvertálás logikai értékké
- `list(value)` - Konvertálás listává
- `dict(key=value, ...)` - Szótár létrehozása kulcsszó-argumentumokkal (pl. `$dict(name="Ali", age=30)`)

## Matematikai függvények
- `len(value)` - Hossz lekérdezése
- `abs(value)` - Abszolút érték
- `min(a, b)` - Minimum érték
- `max(a, b)` - Maximum érték
- `round(value)` - Szám kerekítése
- `sum(list)` - Lista összege
- `sorted(list)` - Lista rendezése
- `randomInt(min, max)` - Véletlen egész szám

## Tömb függvények
- `$array(a, b, c)` - Tömb létrehozása argumentumokból (pl. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Egész szám tartomány létrehozása `a`-tól `b`-ig, a `b` kizárásával (pl. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Sikertelen, ha `a > b`
- `notNull(list)` - Null értékek eltávolítása a tömbből

## String építő függvény (map/filter kifejezésekhez)
- `concat(a, b, c, ...)` - N argumentum összefűzése
  - Használja `.map()`-en belül kifejezés stringként (a stringen belül ne legyen `$`)
  - A concat stringen belül használjon egyszeres idézőjeleket:
    - Helyes: `concat('prefix', 'item.field', 'suffix')`

## Objektum literálok / Szótárak
Hozzon létre objektumokat/szótárakat kapcsos zárójel szintaxissal, tetszőleges string kulcsokkal:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dinamikus kulcsok
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Objektum literál szabályok
- A kulcsok tetszőleges stringek lehetnek (beleértve szóközöket/speciális karaktereket)
- A kulcsokat idézőjelbe KELL tenni (pl. `"key"`)
- Az értékek lehetnek stringek/számok/logikai értékek/kifejezések/beágyazott objektumok

## String függvények
- `upper(text)` - Nagybetűsítés
- `lower(text)` - Kisbetűsítés
- `strip(text)` - Szóközök eltávolítása
- `capitalize(text)` - Első betű nagybetűsítése
- `title(text)` - Cím formátum
- `split(text, separator)` - String felosztása
- `join(separator, list)` - Lista összefűzése
- `replace(text, old, new)` - Szöveg cseréje
- `regexReplace(text, pattern, replacement)` - Cserélje regex mintával
- `base64Encode(text)` - UTF-8 szöveg kódolása szabványos Base64-ként
- `base64Decode(text)` - Szabványos Base64 dekódolása UTF-8 szöveggé
- `toJson(text)` - JSON string elemzése objektummá, tömbbé vagy értékké

## String metódusok (string értékeken)
- `.orEmpty()` - Adja vissza a string értéket, vagy `""`-t, ha az érték null/hiányzó
- `.upper()` / `.lower()` - Kis- és nagybetű konverzió
- `.strip()` - Szóközök eltávolítása
- `.capitalize()` / `.title()` - Nagybetűsítés
- `.length` - String hossza
- `.toString()` - Konvertálás stringgé
- `.substring(start, end)` - Részstring kinyerése
- `.contains(text)` - Részstring tartalmának ellenőrzése
- `.startswith(prefix)` / `.endswith(suffix)` - Előtag/utótag ellenőrzése
- `.indexOf(text)` - Pozíció keresése (-1-et ad vissza, ha nem található)
- `.replace(old, new)` - Első előfordulás cseréje
- `.replaceAll(old, new)` - Minden előfordulás cseréje
- `.regexReplace(pattern, replacement)` - Cserélje regex mintával
- `.hash()` - A string MD5 hash-e
- `.base64Encode()` - UTF-8 szöveg kódolása szabványos Base64-ként
- `.base64Decode()` - Szabványos Base64 dekódolása UTF-8 szöveggé
- `.urlEncode()` - String URL kódolása
- `.urlDecode()` - String URL dekódolása
- `.escape()` - JSON escape string (speciális karakterek konvertálása JSON formátumba)
- `.unescape()` - JSON unescape string (JSON formátum visszaalakítása eredeti stringgé)
- `.toJson()` - JSON string elemzése objektummá, tömbbé vagy értékké

### String metódus példák
- `$profile.nickname.orEmpty()` - Nullable/hiányzó szöveg konvertálása üres stringgé
- `$text.upper()` - Konvertálás nagybetűssé
- `$text.lower()` - Konvertálás kisbetűssé
- `$text.strip()` - Szóközök eltávolítása
- `$text.replace("old", "new")` - Szöveg cseréje
- `$text.replaceAll("a", "b")` - Minden előfordulás cseréje
- `$text.length` - String hosszának lekérdezése
- `$text.escape()` - Speciális JSON karakterek escape-elése (pl. idézőjelek, sortörések)
- `$escapedText.unescape()` - JSON formátumú string visszaalakítása eredetivé
- `$text.toJson()` - JSON objektum/tömb string elemzése (majd `$text.toJson().repoUrl`)
- `$toJson($text)` - Ugyanaz az elemzés függvényként
- `$base64Encode("Héym 🌍")` - Visszaadja: `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Base64 dekódolása UTF-8 szöveggé
- `$text.urlEncode()` - URL kódolás API paraméterekhez
- `$encodedText.urlDecode()` - URL kódolt szöveg dekódolása
## Tömbmetódusok (tömbökön)
- `.first()` – Első elem lekérése
- `.last()` – Utolsó elem lekérése
- `.random()` – Véletlenszerű elem lekérése
- `.reverse()` – Tömb megfordítása
- `.flat()` – Beágyazott tömbök egyetlen tömbbé lapítása
- `.flat(depth)` – Lapítás mélységkorláttal
- `.distinct()` – Duplikátumok eltávolítása
- `.distinctBy(expr)` – Duplikátumok eltávolítása kifejezés alapján (pl. `$array.distinctBy("item.id")`)
- `.notNull()` – Null értékek eltávolítása
- `.add(item)` – Elem hozzáfűzése (új tömböt ad vissza)
- `.contains(item)` – Annak ellenőrzése, hogy a tömb tartalmazza-e az elemet (boolean értéket ad vissza)
- `.join(separator)` – Tömb elemeinek összefűzése sztringgé
- `.filter(expr)` – Tömb szűrése az `item` változó használatával (pl. `$array.filter("item > 5")`)
- `.map(expr)` – Minden elem átalakítása az `item` változó használatával (pl. `$array.map("item.name")`)
- `.sort(expr, order)` – Rendezés kifejezés alapján; az order értéke `"asc"` (alapértelmezett) vagy `"desc"`
- `.take(n)` – Első N (pozitív) vagy utolsó N (negatív) elem vétele
- `.length` – Tömb hossza
- `.toString()` – Konvertálás JSON sztringgé

### Filter / Map / Sort példák
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Objektum/Szótár metódusok (objektumokon)
- `.get(key)` – Érték lekérése kulcs alapján (null értéket ad vissza, ha nem található)
- `.get(key, default)` – Érték lekérése kulcs alapján, alapértelmezett visszaesési értékkel
- `.keys()` – Az összes kulcs listájának visszaadása
- `.values()` – Az összes érték listájának visszaadása
- `.entries()` – `{key, value}` objektumok listájának visszaadása (tulajdonságonként egy)
- `.filter(expr)` – `{key, value}` bejegyzések bejárása és a megfelelő bejegyzések listaként való visszaadása (az `expr`-en belül használja az `item.key` / `item.value` kifejezést)
- `.map(expr)` – `{key, value}` bejegyzések bejárása és átalakított értékek listájának visszaadása (az `expr`-en belül használja az `item.key` / `item.value` kifejezést)
- `.toString()` – Konvertálás JSON sztringgé

### Objektum iterációs példák
Amikor egy objektumot `.map()` vagy `.filter()` metódussal iterál, minden `item` egy `{key, value}` pár:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → a nem null tulajdonságnevek listája

## Dátum/Idő
- `$now` – Aktuális dátum és idő
- `$now.format("YYYY-MM-DD")` – Dátum/idő formázása
- `$now.toISO()` / `.toDate()` / `.toTime()` – Formátumok konvertálása
- `$now.addDays(n)` / `.addHours(n)` – Dátumaritmetika
- `$Date("2024-01-15")` – Dátum sztring értelmezése

## Numerikus műveletek
- Alapvető matematika: `+`, `-`, `*`, `/`, `%`
- Összehasonlítások: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Boolean operátorok: `and`, `or`, `not`

## Boolean feltételek
Boolean értékek esetén közvetlenül írja a kifejezést (ne kényszerítse a `== true` használatát):
- Helytelen: `$nodeName.isValid == true`
- Helyes: `$nodeName.isValid`
- Tagadás: `not $nodeName.isValid`

## Szabályok és whitelist (kritikus)
### A `$` elhelyezésének szabályai
- Az önálló kifejezés általában egy kezdő `$` karakterrel kezdődik.
- A sablon sztringek több `$ref`-et is tartalmazhatnak.
- A metódusparaméterek beágyazott `$ref`-eket is tartalmazhatnak, ha egy másik kifejezés eredményét kívánja átadni (dinamikus kulcs vagy beágyazott feloldás).
  - Érvényes: `$node.method(other.field)` — az `other` a kontextusból oldódik fel, mint egy felső szintű címke (nincs `$` az argumentumon belül).
  - Érvényes: `$node.method($other.field)` — a beágyazott `$` támogatott az evaluate dialog előnézetében és a feltételkiértékelésben.
  - Érvényes: `$array($a.x, $b.y)`
  - Az automatikus kiegészítés a `.get(` belsejében **csupasz** `label.field` útvonalakat szúr be (kezdő `$` nélkül), ugyanúgy, mint a `$array(...)` / `$notNull(...)` belsejében.
- **Evaluate API (Run):** Ha a beküldött érték teljes egészében egyetlen pont-útvonal **kezdő `$` nélkül** (például a szerkesztőben kijelölt szöveg, mint `execute.outputs.output.result.today`), a backend ugyanúgy kezeli, mint a `$execute.outputs.output.result.today` kifejezést. Azok az értékek, amelyek a levágás után újsor vagy kocsivissza karaktert tartalmaznak, nem kerülnek átírásra (elkerüli a kétértelmű többsoros payloadokat). A mentett workflow mezőkben előnyben részesítse a `$` kiírását; az átírás elsősorban ellenőrzésre és eszközökhöz szolgál.
- Az Evaluate dialog `Run` eredménye a hiteles forrás arra vonatkozóan, hogy egy konkrét kifejezés hogyan oldódik fel.

### Tömb sztring idézőjelek
Amikor sztring értékekkel tömböt hoz létre, MINDIG használjon dupla idézőjelet:
- Helyes: `$array("hello", "world")`
- Helytelen: `$array('hello', 'world')`

### CSAK EZEKET A FÜGGVÉNYEKET HASZNÁLJA (whitelist)
Kizárólag az alábbiakat használja:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumentált sztring/tömb/objektum metódusok

Ha egy függvény nem szerepel a fenti listában, az nem létezik.

### Tömbök / szótárak metóduskorlátai
- A tömbök KIZÁRÓLAG az alábbiakat használhatják: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Az objektumok/szótárak KIZÁRÓLAG az alábbiakat használhatják: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Fenntartott csomópontcímke-nevek
Ne használja ezeket a neveket csomópontcímkeként: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Példák

**Condition**: `$input.text.length > 0`

**LLM user message**: `$input.text`

**Output message**: `$llm.text`

**Variable value**: `$input.count + 1`

### DSL példa

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Kapcsolódó tartalmak

- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – Bővíthető szerkesztő backend oldali élő előnézettel és automatikus kiegészítéssel
- [Canvas Features](./canvas-features.md) – Adatcsatlakozó (data pin) kifejezések teszteléséhez a csomópontok újrafuttatása nélkül
- [Node Types](./node-types.md) – Kifejezéseket használó csomópontok ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md) stb.)
- [Sticky Note](../nodes/sticky-note-node.md) – Vászon markdown jegyzetek szerkeszthető címmel, színnel és képmegjelenítéssel
- [Agent Node](../nodes/agent-node.md) – Kifejezések használata agent promptokban
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled` és `memoryShares` az agent `data` mezőjében (nem kifejezésmezők)
- [Workflow Structure](./workflow-structure.md) – Kifejezéseket elfogadó csomópont `data` mezők
- [Credentials Tab](../tabs/credentials-tab.md) – A csomópontok által hivatkozott hitelesítési adatok
- [Credentials Sharing](./credentials-sharing.md) – Hitelesítési adatok megosztása és `$credentials` használata kifejezésekben
- [Global Variables](./global-variables.md) – Perzisztens változók a `$global` segítségével
