# Išraiškų DSL

Heym naudoja paprastą išraiškų kalbą, kad galėtų nurodyti duomenis iš aukščiau esančių mazgų. Naudokite išraiškas mazgo konfigūracijoje, tokiose kaip LLM `userMessage`, Condition `condition`, Output `message`, Set mappings ir Variable values. Naudokite [Išraiškų vertinimo dialogą](./expression-evaluation-dialog.md) didesniam redaktoriui, backend'u pagrįstam gyvam peržiūrai ir išvesties kelio pasirinkimui.

## Pagrindiniai nuorodos

### Įvesties mazgas vs Pavadinti mazgai

- **`$input`** – Naudokite tik tada, kai yra vienas aukščiau esantis [Input](../nodes/input-node.md) mazgas ir norite nurodyti jo išvestį. Pavyzdys: `$input.text`. Tai yra trumpinys "duomenys iš prijungto įvesties mazgo."
- **`$nodeLabel.field`** – Naudokite norėdami nurodyti bet kurį aukščiau esantį mazgą pagal jo **etiketę** (etiketė mazgo duomenyse). Teikite pirmenybę šiam variantui, kai turite kelis mazgus arba kai AI Assistant / workflow DSL tikisi aiškių etikečių. Pavyzdys: `$userInput.body.text`, `$myLLM.text`.

**Kada naudoti ką:**

| Kontekstas | Pirmenybė | Pavyzdys |
|------------|-----------|----------|
| Vienas įvesties mazgas, paprastas srautas | `$input.text` | Išvesties pranešimas iš vieno įvesties mazgo |
| Daugiau mazgų arba pavadintos nuorodos | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Visada `$nodeLabel.field` | Workflow kūrėjas tikisi etikečių, o ne `$input` |

### Įvesties mazgas

Naudokite `$input`, kad nurodytumėte įvesties mazgo duomenis, kai yra vienas aukščiau esantis įvesties mazgas:

```
$input.text
```

### Pavadinti mazgai

Nurodykite bet kurį aukščiau esantį mazgą pagal jo etiketę. Kai mazgas turi [prikabintus duomenis](./canvas-features.md#data-pin), išraiškų užbaigimas naudoja tuos duomenis, o ne vykdymo išvestį.

```
$llm.text
$httpResponse.body
$condition
```

### Kredencialai

Naudokite `$credentials.CredentialName`, kad nurodytumėte kredencialų vertes (pvz., API raktus, bearer token'us arba Notion integracijos token'us) pagal pavadinimą. Žr. [Kredencialų dalijimasis](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Pavadinimai, kurie nėra paprasti identifikatoriai (jie turi `-`, prasideda skaičiumi arba yra rezervuoti žodžiai), naudoja skliaustų formą: `$credentials["my-api-key"]`.

### Globalūs kintamieji

Naudokite `$global.variableName`, kad nurodytumėte [Global Variables](./global-variables.md) – nuolatinius, vartotojo apibrėžtus raktų-vertės duomenis, valdomus [Kintamųjų skirtuke](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Įdėtiniai laukai

Naudokite taško notaciją sudėtiniams objektams:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literaliai

- **Eilutės**: `"hello"` arba `'hello'`
- **Skaičiai**: `42`, `3.14`
- **Boolean**: `true`, `false`
- **Null**: `null`

## Tipo išsaugojimas

Kai **visas** vertė yra vienas `$expr`, backend'as išsaugo natūralų tipą:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Kai išraiška yra didesnės eilutės dalis, galutinis rezultatas visada yra eilutė:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Lipniosios pastabos

[Lipniosios pastabos](../nodes/sticky-note-node.md) mazgai yra drobės dokumentacija, o ne vykdomosios išraiškos laukai. Jų `note` turinys yra pateikiamas kaip markdown, todėl naudokite įprastas markdown nuorodas ir vaizdus, o ne `$...` išraiškas.

Lipniosios pastabos palaiko pasirinktą rodymo pavadinimą ir šešis išsaugotus fono spalvų variantus:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Paleidimo pastabos",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

Leidžiami `stickyColor` vertės yra `yellow`, `sky`, `emerald`, `rose`, `violet` ir `zinc`.

## Aritmetika

Palaikomi operatoriai: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Palyginimai

Naudokite [Condition](../nodes/condition-node.md) mazguose: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Ciklo kontekstas

Viduje [Loop](../nodes/loop-node.md) mazgo naudokite `item`, kad nurodytumėte dabartinį masyvo elementą:

```
item.name
item.value
```

## Specialūs kintamieji
- `$now` - Dabartinė data ir laikas su formatavimo metodais
- `$Date()` - Sukurti/analizuoti datą (pvz., `$Date("2024-01-15")`)
- `$UUID` - Generuoti 32 simbolių unikalų identifikatorių (BE skliaustų; naudokite `$UUID`, o ne `$UUID()`)
- `$workflowName` - Dabartinio workflow pavadinimas
- `$workflowDescription` - Dabartinio workflow aprašymas
- `$workflowPath` - Santykinis workflow kelias, pvz., `/workflows/<id>`
- `$workflowUrl` - Absoliutus workflow URL, pvz., `https://<host>/workflows/<id>`
- `$executionId` - Dabartinio vykdymo id (atitinka [Vykdymo istoriją](./execution-history.md) įrašo id, todėl `/workflows/<id>/<executionId>` atidaro šį vykdymą drobėje). **Tik vykdymo metu**: tuščias išraiškų peržiūros dialoge; užpildomas tik vykdant workflow.
- `$vars` - Workflow vietiniai kintamieji (prieiga per `$vars.variableName`; atnaujinama per `variable` mazgą)
- `$global` - Nuolatinė globalių kintamųjų saugykla (prieiga per `$global.variableName`)
- `$page.record` - Tik prietaisų skydelio valdiklių workflow: išsamios informacijos puslapio, kuriame yra valdiklis, įrašas iš prietaisų skydelio parametro `?record=`. Reikšmė yra `null` prietaisų skydelyje, atidarytame be šio parametro, ir išraiškos peržiūros lange. Mazgas su etikete `page` turi pirmenybę. Žr. [Išsamios informacijos puslapiai](../tabs/dashboard-tab.md#detail-pages).

### $vars naudojimas
- `$vars.counter` - Prieiga prie kintamojo, pavadinto `counter`
- `$vars.myArray.add("item")` - Pridėti elementą prie masyvo kintamojo

### $global naudojimas
- `$global.environment` - Prieiga prie globalaus kintamojo, pavadinto `environment`
- `$global.settings.baseUrl` - Prieiga prie įdėtinių laukų objektų tipo globaliame kintamajame
## Užklausos kontekstas (API vykdymas)
Kai Workflow vykdomas per HTTP API, įvesties mazgai gauna papildomą užklausos metaduomenų informaciją:
- `$textInputLabel.body` - HTTP užklausos kūno objektas (žalias JSON payload)
- `$textInputLabel.headers` - HTTP užklausos antraščių objektas (visos antraščių raktai yra mažosiomis raidėmis)
- `$textInputLabel.query` - URL užklausos parametrų objektas

Prieiti prie užklausos duomenų galima taip:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Tipų konversijos funkcijos
- `str(value)` - Konvertuoti į eilutę
- `int(value)` - Konvertuoti į sveikąjį skaičių
- `float(value)` - Konvertuoti į slankiojo kablelio skaičių
- `bool(value)` - Konvertuoti į boolean
- `list(value)` - Konvertuoti į sąrašą
- `dict(key=value, ...)` - Sukurti žodyną su raktų argumentais (pvz. `$dict(name="Ali", age=30)`)

## Matematinės funkcijos
- `len(value)` - Gauti ilgį
- `abs(value)` - Absoliuti reikšmė
- `min(a, b)` - Mažiausia reikšmė
- `max(a, b)` - Didžiausia reikšmė
- `round(value)` - Apvalinti skaičių
- `sum(list)` - Sąrašo suma
- `sorted(list)` - Rūšiuoti sąrašą
- `randomInt(min, max)` - Atsitiktinis sveikasis skaičius

## Masyvų funkcijos
- `$array(a, b, c)` - Sukurti masyvą iš argumentų (pvz. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Sukurti sveikųjų skaičių intervalą nuo `a` iki `b`, neįskaitant `b` (pvz. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Nepavyksta, kai `a > b`
- `notNull(list)` - Pašalinti null reikšmes iš masyvo

## Eilučių sudarymo funkcija (map/filter išraiškoms)
- `concat(a, b, c, ...)` - Sujungti N argumentų
  - Naudokite viduje `.map()` kaip išraiškos eilutę (be `$` viduje eilutės)
  - Naudokite viengubas kabutes viduje concat eilutės:
    - Teisinga: `concat('prefix', 'item.field', 'suffix')`

## Objektų literaliai / Žodynai
Sukurkite objektus/žodynus naudodami skliaustų sintaksę su bet kokiais eilutės raktais:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dinaminiai raktai
- `${now.format("MMMM DD"): "Šiandienos vertė"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Objektų literalių taisyklės
- Raktai gali būti bet kokia eilutė (įskaitant tarpus/specialius simbolius)
- Raktai PRIVALO būti įrašyti dvigubose kabutėse (pvz. `"key"`)
- Reikšmės gali būti eilutės/skaičiai/boolean/išraiškos/nestoti objektai

## Eilučių funkcijos
- `upper(text)` - Didžiosios raidės
- `lower(text)` - Mažosios raidės
- `strip(text)` - Pašalinti tarpus
- `capitalize(text)` - Pirmąją raidę padaryti didžiąja
- `title(text)` - Pavadinimo atveju
- `split(text, separator)` - Padalinti eilutę
- `join(separator, list)` - Sujungti sąrašą
- `replace(text, old, new)` - Pakeisti tekstą
- `regexReplace(text, pattern, replacement)` - Pakeisti pagal regex modelį
- `base64Encode(text)` - Užkoduoti UTF-8 tekstą kaip standartinį Base64
- `base64Decode(text)` - Iššifruoti standartinį Base64 į UTF-8 tekstą
- `toJson(text)` - Išanalizuoti JSON eilutę į objektą, masyvą ar reikšmę

## Eilučių metodai (ant eilutės reikšmių)
- `.orEmpty()` - Grąžinti eilutės reikšmę arba `""`, kai reikšmė yra null/trūksta
- `.upper()` / `.lower()` - Raidžių keitimas
- `.strip()` - Pašalinti tarpus
- `.capitalize()` / `.title()` - Pirmąją raidę padaryti didžiąja
- `.length` - Eilutės ilgis
- `.toString()` - Konvertuoti į eilutę
- `.substring(start, end)` - Išgauti dalinę eilutę
- `.contains(text)` - Patikrinti, ar yra dalinė eilutė
- `.startswith(prefix)` / `.endswith(suffix)` - Patikrinti prefiksą/sufiksą
- `.indexOf(text)` - Rasti poziciją (grąžina -1, jei nerasta)
- `.replace(old, new)` - Pakeisti pirmą pasikartojimą
- `.replaceAll(old, new)` - Pakeisti visus pasikartojimus
- `.regexReplace(pattern, replacement)` - Pakeisti pagal regex modelį
- `.hash()` - MD5 hash eilutės
- `.base64Encode()` - Užkoduoti UTF-8 tekstą kaip standartinį Base64
- `.base64Decode()` - Iššifruoti standartinį Base64 į UTF-8 tekstą
- `.urlEncode()` - URL koduoti eilutę
- `.urlDecode()` - URL dekoduoti eilutę
- `.escape()` - JSON pabėgti eilutę (paversti specialius simbolius į JSON formatą)
- `.unescape()` - JSON atpalaiduoti eilutę (paversti JSON formatą atgal į pradinę eilutę)
- `.toJson()` - Išanalizuoti JSON eilutę į objektą, masyvą ar reikšmę

### Eilučių metodo pavyzdžiai
- `$profile.nickname.orEmpty()` - Konvertuoti nullable/trūkstamą tekstą į tuščią eilutę
- `$text.upper()` - Konvertuoti į didžiąsias raides
- `$text.lower()` - Konvertuoti į mažąsias raides
- `$text.strip()` - Pašalinti tarpus
- `$text.replace("old", "new")` - Pakeisti tekstą
- `$text.replaceAll("a", "b")` - Pakeisti visus pasikartojimus
- `$text.length` - Gauti eilutės ilgį
- `$text.escape()` - Pabėgti specialius JSON simbolius (pvz., kabutes, naujas eilutes)
- `$escapedText.unescape()` - Atpalaiduoti JSON formatuotą eilutę atgal į pradinę
- `$text.toJson()` - Išanalizuoti JSON objekto/masyvo eilutę (tada `$text.toJson().repoUrl`)
- `$toJson($text)` - Tas pats analizavimas kaip funkcija
- `$base64Encode("Héym 🌍")` - Grąžinti `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Iššifruoti Base64 į UTF-8 tekstą
- `$text.urlEncode()` - URL koduoti API parametrams
- `$encodedText.urlDecode()` - Dekoduoti URL koduotą tekstą
## Masyvų metodai (masyvams)
- `.first()` - Gauti pirmą elementą
- `.last()` - Gauti paskutinį elementą
- `.random()` - Gauti atsitiktinį elementą
- `.reverse()` - Apversti masyvą
- `.flat()` - Suplokštinti įdėtus masyvus į vieną masyvą
- `.flat(depth)` - Suplokštinti su gylio ribojimu
- `.distinct()` - Pašalinti pasikartojančius elementus
- `.distinctBy(expr)` - Pašalinti pasikartojančius elementus pagal išraišką (pvz., `$array.distinctBy("item.id")`)
- `.notNull()` - Pašalinti null reikšmes
- `.add(item)` - Pridėti elementą (grąžina naują masyvą)
- `.contains(item)` - Patikrinti, ar masyvas turi elementą (grąžina boolean)
- `.join(separator)` - Sujungti masyvo elementus į eilutę
- `.filter(expr)` - Filtruoti masyvą naudojant `item` kintamąjį (pvz., `$array.filter("item > 5")`)
- `.map(expr)` - Transformuoti kiekvieną elementą naudojant `item` kintamąjį (pvz., `$array.map("item.name")`)
- `.sort(expr, order)` - Rūšiuoti pagal išraišką, tvarka yra `"asc"` (numatytoji) arba `"desc"`
- `.take(n)` - Gauti pirmus N (teigiamus) arba paskutinius N (neigiamus) elementus
- `.length` - Masyvo ilgis
- `.toString()` - Konvertuoti į JSON eilutę

### Filtravimo / Žemėlapio / Rūšiavimo pavyzdžiai
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Objekto/Diktoriaus metodai (objektams)
- `.get(key)` - Gauti reikšmę pagal raktą (grąžina null, jei nerasta)
- `.get(key, default)` - Gauti reikšmę pagal raktą su numatytuoju atsarginiu variantu
- `.keys()` - Grąžinti visų raktų sąrašą
- `.values()` - Grąžinti visų reikšmių sąrašą
- `.entries()` - Grąžinti `{key, value}` objektų sąrašą (po vieną už kiekvieną savybę)
- `.filter(expr)` - Iteruoti `{key, value}` įrašus ir grąžinti atitinkančius įrašus kaip sąrašą (naudokite `item.key` / `item.value` viduje `expr`)
- `.map(expr)` - Iteruoti `{key, value}` įrašus ir grąžinti transformuotų reikšmių sąrašą (naudokite `item.key` / `item.value` viduje `expr`)
- `.toString()` - Konvertuoti į JSON eilutę

### Objekto iteracijos pavyzdžiai
Iteruojant objektą su `.map()` arba `.filter()`, kiekvienas `item` yra `{key, value}` pora:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → sąrašas savybių pavadinimų, kurie nėra null

## Data / Laikas
- `$now` - Dabartinė data ir laikas
- `$now.format("YYYY-MM-DD")` - Formatuoti datą/laiką
- `$now.toISO()` / `.toDate()` / `.toTime()` - Konvertuoti formatus
- `$now.addDays(n)` / `.addHours(n)` - Datos matematika
- `$Date("2024-01-15")` - Analizuoti datos eilutę

## Skaitmeninės operacijos
- Pagrindinė matematika: `+`, `-`, `*`, `/`, `%`
- Palyginimai: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Boolean operatoriai: `and`, `or`, `not`

## Boolean sąlygos
Boolean reikšmėms rašykite išraišką tiesiogiai (nepriverskite `== true`):
- Klaidinga: `$nodeName.isValid == true`
- Teisinga: `$nodeName.isValid`
- Neigimas: `not $nodeName.isValid`

## Taisyklės ir baltasis sąrašas (kritiška)
### $ vietos taisyklės
- Savarankiška išraiška paprastai prasideda nuo `$`.
- Šablonų eilutės gali turėti kelis `$refs`.
- Metodo parametrai taip pat gali turėti įdėtus `$refs`, kai norite perduoti kitos išraiškos rezultatą (dinaminis raktas arba įdėtinė rezoliucija).
  - Galioja: `$node.method(other.field)` — `other` yra išsprendžiamas iš konteksto kaip viršutinio lygio etiketė (be `$` argumente).
  - Galioja: `$node.method($other.field)` — įdėtiniai `$` yra palaikomi vertinimo dialogo peržiūroje ir sąlygų vertinime.
  - Galioja: `$array($a.x, $b.y)`
  - Automatinis užpildymas viduje `.get(` įterpia **nuogus** `label.field` kelius (be pradinio `$`), tas pats kaip viduje `$array(...)` / `$notNull(...)`.
- **Vertinimo API (Vykdyti):** Jei visas pateiktas reikšmė yra vienas taško kelias **be** pradinio `$` (pavyzdžiui, teksto pasirinkimas redaktoriuje, kaip `execute.outputs.output.result.today`), backendas traktuoja tai taip pat kaip `$execute.outputs.output.result.today`. Reikšmės, kurios po apkarpymo turi naują eilutę arba grąžinimo simbolį, nėra perrašomos (vengia neaiškių kelių su keliais įkrovimais). Rekomenduojama rašyti `$` išsaugotuose workflow laukuose; perrašymas yra daugiausia skirtas inspekcijai ir įrankiams.
- Vertinimo dialogo `Vykdyti` rezultatas yra tiesa, kaip konkretus išraiškos sprendimas.

### Masyvų eilutės citavimas
Kuriant masyvus su eilutės reikšmėmis, VISADA naudokite dvigubas kabutes:
- Teisinga: `$array("hello", "world")`
- Klaidinga: `$array('hello', 'world')`

### NAUDOKITE TIK ŠIAS FUNKCIJAS (Baltasis sąrašas)
Naudokite TIK:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumentuoti eilutės/masyvo/objekto metodai

Jei funkcija nėra išvardyta aukščiau, ji neegzistuoja.

### Masyvų / Diktų metodų ribos
- Masyvai gali NAUDOTI TIK: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objektai/Diktai gali NAUDOTI TIK: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Rezervuoti mazgo etikečių pavadinimai
Nenaudokite šių pavadinimų kaip mazgo etikečių: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Pavyzdžiai

**Sąlyga**: `$input.text.length > 0`

**LLM vartotojo žinutė**: `$input.text`

**Išvesties žinutė**: `$llm.text`

**Kintamojo reikšmė**: `$input.count + 1`

### DSL Pavyzdys

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Susiję

- [Išraiškų vertinimo dialogas](./expression-evaluation-dialog.md) – Išplečiamas redaktorius su backend gyvu peržiūra ir automatinio užpildymo funkcija
- [Drobės funkcijos](./canvas-features.md) – Duomenų pin'as, skirtas išraiškų testavimui be mazgų pakartotinio vykdymo
- [Mazgų tipai](./node-types.md) – Mazgai, kurie naudoja išraiškas ([LLM](../nodes/llm-node.md), [Sąlyga](../nodes/condition-node.md), [Išvestis](../nodes/output-node.md), [Nustatyti](../nodes/set-node.md) ir kt.)
- [Lipni pastaba](../nodes/sticky-note-node.md) – Drobės markdown pastabos su redaguojamu pavadinimu, spalva ir vaizdo rodymu
- [Agentų mazgas](../nodes/agent-node.md) – Išraiškų naudojimas agentų promptuose
- [Agentų nuolatinė atmintis](./agent-persistent-memory.md) – `persistentMemoryEnabled` ir `memoryShares` agento `data` (ne išraiškų laukai)
- [Workflow struktūra](./workflow-structure.md) – Mazgo `data` laukai, kurie priima išraiškas
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Kredencialai, kuriuos nurodo mazgai
- [Kredencialų dalijimasis](./credentials-sharing.md) – Dalinkitės kredencialais ir naudokite `$credentials` išraiškose
- [Globalūs kintamieji](./global-variables.md) – Nuolatiniai kintamieji su `$global`
