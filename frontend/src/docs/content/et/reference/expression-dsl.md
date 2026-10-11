# Avaldiste DSL

Heym kasutab lihtsat avaldiste keelt, et viidata andmetele ülemvoolu sõlmedest. Kasutage avaldisi sõlmede konfiguratsioonis, näiteks LLM-i `userMessage`, Condition'i `condition`, Output'i `message`, Set-mappinguid ja Muutujate väärtusi. Suurema redaktori, taustaprogrammi toega reaalajas eelvaate ja väljundtee valimise jaoks kasutage [Avaldise hindamise dialoogi](./expression-evaluation-dialog.md).

## Põhilised viited

### Sisendsõlm vs nimetatud sõlmed

- **`$input`** – Kasutage ainult siis, kui on üks ülemvoolu [Input](../nodes/input-node.md) sõlm ja soovite viidata selle väljundile. Näide: `$input.text`. See on lühend tähenduses "andmed ühendatud sisendist."
- **`$nodeLabel.field`** – Kasutage mis tahes ülemvoolu sõlmele viitamiseks selle **sildi** (sõlme andmetes olev `label`) järgi. Eelistage seda, kui teil on mitu sõlme või kui AI Assistant / workflow DSL eeldab selgesõnalisi silte. Näide: `$userInput.body.text`, `$myLLM.text`.

**Millal kumba kasutada:**

| Kontekst | Eelistage | Näide |
|--------|--------|---------|
| Üksik sisendsõlm, lihtne voog | `$input.text` | Väljundi sõnum ühest Input'ist |
| Mitu sõlme või nimetatud viited | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Alati `$nodeLabel.field` | Workflow ehitaja eeldab silte, mitte `$input` |

### Sisendsõlm

Kasutage `$input`, et viidata Input sõlme andmetele, kui on üks ülemvoolu sisend:

```
$input.text
```

### Nimetatud sõlmed

Viitage mis tahes ülemvoolu sõlmele selle sildi järgi. Kui sõlmel on [kinnitatud andmed](./canvas-features.md#data-pin), kasutab avaldise lõpetamine seda täitmise väljundi asemel.

```
$llm.text
$httpResponse.body
$condition
```

### Mandaadid

Kasutage `$credentials.CredentialName`, et viidata mandaadi väärtustele (nt API võtmed, bearer tokenid või Notioni integratsiooni tokenid) nime järgi. Vt [Mandaatide jagamine](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Nimed, mis ei ole tavalised identifikaatorid (sisaldavad `-`, algavad numbriga või on reserveeritud sõnad), kasutavad nurksulu vormi: `$credentials["my-api-key"]`.

### Globaalsed muutujad

Kasutage `$global.variableName`, et viidata [Globaalsetele muutujatele](./global-variables.md) – püsivad, kasutajapõhised võti-väärtus andmed, mida hallatakse [Muutujate vahekaardil](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Pesastatud väljad

Kasutage pesastatud objektide jaoks punktnotatsiooni:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literaalid

- **Stringid**: `"hello"` või `'hello'`
- **Numbrid**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`

## Tüübi säilitamine

Kui **terve** väärtus on üksik `$expr`, säilitab taustaprogramm algse tüübi:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Kui avaldis on osa suuremast stringist, on lõpptulemus alati string:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Kleepuvad märkmed

[Sticky Note](../nodes/sticky-note-node.md) sõlmed on lõuendi dokumentatsioon, mitte täidetavad avaldise väljad. Nende `note` sisu renderdatakse markdownina, seega kasutage tavalisi markdown-linke ja pilte, mitte `$...` avaldisi.

Kleepuvad märkmed toetavad kohandatud kuvamispealkirja ja kuut salvestatud taustavärvi:

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

Lubatud `stickyColor` väärtused on `yellow`, `sky`, `emerald`, `rose`, `violet` ja `zinc`.

## Aritmeetika

Toetatud operaatorid: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Võrdlused

Kasutage [Condition](../nodes/condition-node.md) sõlmedes: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Loop'i kontekst

[Loop](../nodes/loop-node.md) sõlme sees kasutage `item`, et viidata praegusele massiivi elemendile:

```
item.name
item.value
```

## Eri muutujad
- `$now` - Praegune kuupäev ja kellaaeg koos vormindusmeetoditega
- `$Date()` - Kuupäeva loomine/tõlgendamine (nt `$Date("2024-01-15")`)
- `$UUID` - 32-kohalise unikaalse identifikaatori genereerimine (ILMA sulgudeta; kasutage `$UUID`, mitte `$UUID()`)
- `$workflowName` - Praeguse workflow nimi
- `$workflowDescription` - Praeguse workflow kirjeldus
- `$workflowPath` - Workflow suhteline tee, nt `/workflows/<id>`
- `$workflowUrl` - Workflow absoluutne URL, nt `https://<host>/workflows/<id>`
- `$executionId` - Praeguse käivituse id (võrdub [Käivituste ajaloo](./execution-history.md) kirje id-ga, seega `/workflows/<id>/<executionId>` avab selle käivituse lõuendil). **Ainult käitusajal**: tühi avaldise eelvaate dialoogis; täidetakse ainult workflow täitmise ajal.
- `$vars` - Workflow-lokaalsed muutujad (juurdepääs `$vars.variableName` kaudu; uuendatakse `variable` sõlme kaudu)
- `$global` - Püsiv globaalne muutujate hoidla (juurdepääs `$global.variableName` kaudu)

### $vars kasutamine
- `$vars.counter` - Juurdepääs muutujale nimega `counter`
- `$vars.myArray.add("item")` - Elemendi lisamine massiivi muutujale

### $global kasutamine
- `$global.environment` - Juurdepääs globaalsele muutujale nimega `environment`
- `$global.settings.baseUrl` - Juurdepääs pesastatud väljadele objektitüüpi globaalses muutujas
## Päringu kontekst (API käivitamine)
Kui workflow käivitatakse HTTP API kaudu, saavad sisendsõlmed täiendava päringu metaandmed:
- `$textInputLabel.body` - HTTP päringu keha objekt (töötlemata JSON payload)
- `$textInputLabel.headers` - HTTP päringu päiste objekt (kõik päise võtmed on väiketähtedega)
- `$textInputLabel.query` - URL-i päringuparameetrite objekt

Päringu andmetele juurdepääs:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Tüübiteisenduse funktsioonid
- `str(value)` - Teisenda stringiks
- `int(value)` - Teisenda täisarvuks
- `float(value)` - Teisenda ujukomaarvuks
- `bool(value)` - Teisenda tõeväärtuseks
- `list(value)` - Teisenda loendiks
- `dict(key=value, ...)` - Loo sõnastik märksõnaargumentidega (nt `$dict(name="Ali", age=30)`)

## Matemaatikafunktsioonid
- `len(value)` - Hangi pikkus
- `abs(value)` - Absoluutväärtus
- `min(a, b)` - Miinimumväärtus
- `max(a, b)` - Maksimumväärtus
- `round(value)` - Ümarda arv
- `sum(list)` - Loendi summa
- `sorted(list)` - Sorteeri loend
- `randomInt(min, max)` - Juhuslik täisarv

## Massiivi funktsioonid
- `$array(a, b, c)` - Loo massiiv argumentidest (nt `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Loo täisarvuvahemik `a`-st `b`-ni, `b` on välja jäetud (nt `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Ebaõnnestub, kui `a > b`
- `notNull(list)` - Eemalda massiivist null-väärtused

## Stringi koostamise funktsioon (map/filter avaldiste jaoks)
- `concat(a, b, c, ...)` - Ühenda N argumenti
  - Kasutage `.map()` sees avaldisena (stringi sees ei tohi olla `$`)
  - Kasutage concat-stringi sees üksikuid jutumärke:
    - Õige: `concat('prefix', 'item.field', 'suffix')`

## Objekti literaalid / sõnastikud
Looge objekte/sõnastikke loogeliste sulgude süntaksiga, kasutades suvalisi stringi võtmeid:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dünaamilised võtmed
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Objekti literaali reeglid
- Võtmed võivad olla suvalised stringid (sealhulgas tühikud/erimärgid)
- Võtmed PEAVAD olema kaetud topeltjutumärkidega (nt `"key"`)
- Väärtused võivad olla stringid/arvud/tõeväärtused/avaldised/pesastatud objektid

## Stringifunktsioonid
- `upper(text)` - Suurtähtedeks
- `lower(text)` - Väiketähtedeks
- `strip(text)` - Eemalda tühikud
- `capitalize(text)` - Esimene täht suureks
- `title(text)` - Iga sõna esitäht suureks
- `split(text, separator)` - Tükelda string
- `join(separator, list)` - Ühenda loend
- `replace(text, old, new)` - Asenda tekst
- `regexReplace(text, pattern, replacement)` - Asenda regex-mustriga
- `base64Encode(text)` - Kodeeri UTF-8 tekst standardseks Base64-ks
- `base64Decode(text)` - Dekodeeri standardne Base64 UTF-8 tekstiks
- `toJson(text)` - Parsige JSON-string objektiks, massiiviks või väärtuseks

## Stringi meetodid (stringi väärtustel)
- `.orEmpty()` - Tagasta stringi väärtus või `""`, kui väärtus on null/puudub
- `.upper()` / `.lower()` - Suur-/väiketähtedeks teisendamine
- `.strip()` - Eemalda tühikud
- `.capitalize()` / `.title()` - Esitäht suureks
- `.length` - Stringi pikkus
- `.toString()` - Teisenda stringiks
- `.substring(start, end)` - Eralda alamsõne
- `.contains(text)` - Kontrolli, kas sisaldab alamsõne
- `.startswith(prefix)` / `.endswith(suffix)` - Kontrolli prefiksit/sufiksit
- `.indexOf(text)` - Leia asukoht (tagastab -1, kui ei leita)
- `.replace(old, new)` - Asenda esimene esinemine
- `.replaceAll(old, new)` - Asenda kõik esinemised
- `.regexReplace(pattern, replacement)` - Asenda regex-mustriga
- `.hash()` - Stringi MD5 räsi
- `.base64Encode()` - Kodeeri UTF-8 tekst standardseks Base64-ks
- `.base64Decode()` - Dekodeeri standardne Base64 UTF-8 tekstiks
- `.urlEncode()` - URL-kodeeri string
- `.urlDecode()` - URL-dekodeeri string
- `.escape()` - JSON-escape string (teisenda erimärgid JSON-vormingusse)
- `.unescape()` - JSON-unescape string (teisenda JSON-vorming tagasi algseks stringiks)
- `.toJson()` - Parsige JSON-string objektiks, massiiviks või väärtuseks

### Stringi meetodite näited
- `$profile.nickname.orEmpty()` - Teisenda null- või puuduv tekst tühjaks stringiks
- `$text.upper()` - Teisenda suurtähtedeks
- `$text.lower()` - Teisenda väiketähtedeks
- `$text.strip()` - Eemalda tühikud
- `$text.replace("old", "new")` - Asenda tekst
- `$text.replaceAll("a", "b")` - Asenda kõik esinemised
- `$text.length` - Hangi stringi pikkus
- `$text.escape()` - Escape'i spetsiaalsed JSON-märgid (nt jutumärgid, reavahetused)
- `$escapedText.unescape()` - Unescape'i JSON-vormingus string tagasi algseks
- `$text.toJson()` - Parsige JSON-objekti/massiivi string (seejärel `$text.toJson().repoUrl`)
- `$toJson($text)` - Sama parsija funktsioonina
- `$base64Encode("Héym 🌍")` - Tagastab `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Dekodeeri Base64 UTF-8 tekstiks
- `$text.urlEncode()` - URL-kodeeri API parameetrite jaoks
- `$encodedText.urlDecode()` - Dekodeeri URL-kodeeritud tekst
## Massiivi meetodid (massiivide puhul)
- `.first()` – Hangi esimene element
- `.last()` – Hangi viimane element
- `.random()` – Hangi juhuslik element
- `.reverse()` – Pööra massiiv ümber
- `.flat()` – Lamenda pesastatud massiivid üheks massiiviks
- `.flat(depth)` – Lamenda sügavuspiiranguga
- `.distinct()` – Eemalda duplikaadid
- `.distinctBy(expr)` – Eemalda duplikaadid avaldise järgi (nt `$array.distinctBy("item.id")`)
- `.notNull()` – Eemalda null-väärtused
- `.add(item)` – Lisa element (tagastab uue massiivi)
- `.contains(item)` – Kontrolli, kas massiiv sisaldab elementi (tagastab tõeväärtuse)
- `.join(separator)` – Ühenda massiivi elemendid stringiks
- `.filter(expr)` – Filtreeri massiivi, kasutades muutujat `item` (nt `$array.filter("item > 5")`)
- `.map(expr)` – Teisenda iga element, kasutades muutujat `item` (nt `$array.map("item.name")`)
- `.sort(expr, order)` – Sorteeri avaldise järgi, järjekord on `"asc"` (vaikimisi) või `"desc"`
- `.take(n)` – Võta esimesed N (positiivne) või viimased N (negatiivne) elementi
- `.length` – Massiivi pikkus
- `.toString()` – Teisenda JSON-stringiks

### Filtreerimise / Map'i / Sortimise näited
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Objekti/Sõnastiku meetodid (objektide puhul)
- `.get(key)` – Hangi väärtus võtme järgi (tagastab null, kui ei leita)
- `.get(key, default)` – Hangi väärtus võtme järgi vaikeväärtusega
- `.keys()` – Tagasta kõigi võtmete loend
- `.values()` – Tagasta kõigi väärtuste loend
- `.entries()` – Tagasta `{key, value}` objektide loend (üks iga omaduse kohta)
- `.filter(expr)` – Itereeri `{key, value}` kirjeid ja tagasta sobivad kirjed loendina (kasuta `item.key` / `item.value` avaldise sees)
- `.map(expr)` – Itereeri `{key, value}` kirjeid ja tagasta teisendatud väärtuste loend (kasuta `item.key` / `item.value` avaldise sees)
- `.toString()` – Teisenda JSON-stringiks

### Objekti iteratsiooni näited
Objekti itereerimisel `.map()` või `.filter()` abil on iga `item` `{key, value}` paar:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → loend omaduste nimedest, mis ei ole null

## Kuupäev/Kellaaeg
- `$now` – Praegune kuupäev ja kellaaeg
- `$now.format("YYYY-MM-DD")` – Vorminda kuupäev/kellaaeg
- `$now.toISO()` / `.toDate()` / `.toTime()` – Teisenda formaate
- `$now.addDays(n)` / `.addHours(n)` – Kuupäevaarvutus
- `$Date("2024-01-15")` – Parsige kuupäevastring

## Numbrilised operatsioonid
- Põhiline matemaatika: `+`, `-`, `*`, `/`, `%`
- Võrdlused: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Tõeväärtusoperaatorid: `and`, `or`, `not`

## Tõeväärtustingimused
Tõeväärtuste puhul kirjutage avaldis otse (ärge sundige `== true`):
- Vale: `$nodeName.isValid == true`
- Õige: `$nodeName.isValid`
- Eitus: `not $nodeName.isValid`

## Reeglid ja lubatud loend (kriitiline)
### $ paigutamise reeglid
- Eraldiseisev avaldis algab tavaliselt eesliitega `$`.
- Mallistringid võivad sisaldada mitut `$ref`-i.
- Meetodi parameetrid võivad samuti sisaldada pesastatud `$ref`-e, kui soovite edastada teise avaldise tulemust (dünaamiline võti või pesastatud lahendamine).
  - Kehtiv: `$node.method(other.field)` — `other` lahendatakse kontekstist nagu ülatasemel silt (argumendi sees ei ole `$`).
  - Kehtiv: `$node.method($other.field)` — pesastatud `$` on toetatud hindamisdialoogi eelvaates ja tingimuste hindamisel.
  - Kehtiv: `$array($a.x, $b.y)`
  - Automaatne täiendamine `.get(` sees sisestab **paljad** `label.field` teed (ilma eesliiteta `$`), samamoodi nagu `$array(...)` / `$notNull(...)` sees.
- **Hindamis-API (Run):** Kui kogu esitatud väärtus on üksik punktiga tee **ilma** eesliiteta `$` (näiteks redaktoris valitud tekst, nagu `execute.outputs.output.result.today`), käsitleb taustsüsteem seda samamoodi nagu `$execute.outputs.output.result.today`. Väärtusi, mis sisaldavad pärast trimmerdamist reavahetust või veebimärki, ei kirjutata ümber (väldib mitmetähenduslikke mitmerealisi payload'e). Eelistage salvestatud workflow väljadel kirjutada `$`; ümberkirjutamine on peamiselt kontrollimiseks ja tööriistadele.
- Hindamisdialoogi `Run` tulemus on tõeallikas selle kohta, kuidas konkreetne avaldis lahendatakse.

### Massiivi stringide tsiteerimine
Stringiväärtustega massiivide loomisel kasutage ALATI topeltjutumärke:
- Õige: `$array("hello", "world")`
- Vale: `$array('hello', 'world')`

### KASUTAGE AINULT NEID FUNKTSIOONE (lubatud loend)
Kasutage AINULT:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumenteeritud stringi-/massiivi-/objektimetodid

Kui funktsioon ei ole ülalpool loetletud, siis seda ei ole olemas.

### Massiivide / sõnastike meetodite piirangud
- Massiivid saavad kasutada AINULT: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objektid/sõnastikud saavad kasutada AINULT: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Reserveeritud sõlmede siltide nimed
Ärge kasutage neid nimesid sõlmede siltidena: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Näited

**Condition**: `$input.text.length > 0`

**LLM user message**: `$input.text`

**Output message**: `$llm.text`

**Variable value**: `$input.count + 1`

### DSL-i näide

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Seotud

- [Avaldise hindamise dialoog](./expression-evaluation-dialog.md) – Laiendatav redaktor, millel on taustapõhine reaalajas eelvaade ja automaatne täitmine
- [Lõuendi funktsioonid](./canvas-features.md) – Andmete kinnitamine avaldiste testimiseks ilma sõlmi uuesti käivitamata
- [Sõlmede tüübid](./node-types.md) – Sõlmed, mis kasutavad avaldisi ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md) jne)
- [Kleepuv märkus](../nodes/sticky-note-node.md) – Lõuendi markdown-märkmed muudetava pealkirja, värvi ja pildi kuvamisega
- [Agendi sõlm](../nodes/agent-node.md) – Avaldiste kasutamine agendi promptides
- [Agendi püsiv mälu](./agent-persistent-memory.md) – `persistentMemoryEnabled` ja `memoryShares` agendi `data` väljadel (mitte avaldise väljadel)
- [Workflow struktuur](./workflow-structure.md) – Sõlme `data` väljad, mis aktsepteerivad avaldisi
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – Sõlmede poolt viidatud mandaadid
- [Mandaatide jagamine](./credentials-sharing.md) – Mandaatide jagamine ja `$credentials` kasutamine avaldistes
- [Globaalsed muutujad](./global-variables.md) – Püsivad muutujad `$global`-iga
