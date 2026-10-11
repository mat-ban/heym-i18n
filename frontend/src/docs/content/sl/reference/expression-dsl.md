# Izrazni DSL

Heym uporablja preprost izrazni jezik za sklicevanje na podatke iz zgornjih vozlišč. Uporabite izraze v konfiguraciji vozlišč, kot so LLM `userMessage`, Pogoj `condition`, Izhod `message`, Nastavitve preslikav in Vrednosti spremenljivk. Uporabite [Dialog za vrednotenje izrazov](./expression-evaluation-dialog.md) za večjega urejevalnika, v realnem času podprtih predogledov in izbiro izhodne poti.

## Osnovne reference

### Vhodno vozlišče proti poimenovanim vozliščem

- **`$input`** – Uporabite le, kadar obstaja eno samo zgornje [Vhodno](../nodes/input-node.md) vozlišče in želite sklicevati na njegov izhod. Primer: `$input.text`. To je okrajšava za "podatke iz povezanega vhoda."
- **`$nodeLabel.field`** – Uporabite za sklicevanje na katerokoli zgornje vozlišče po njegovi **označbi** (označba v podatkih vozlišča). To je priporočljivo, kadar imate več vozlišč ali kadar AI asistent / workflow DSL pričakuje eksplicitne oznake. Primer: `$userInput.body.text`, `$myLLM.text`.

**Kdaj uporabiti katero:**

| Kontekst | Prednost | Primer |
|--------|--------|---------|
| Enotno vhodno vozlišče, preprost tok | `$input.text` | Izhodna sporočila iz enega vhoda |
| Več vozlišč ali poimenovane reference | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI asistent](./ai-assistant.md) / workflow JSON | Vedno `$nodeLabel.field` | Graditelj delovnega toka pričakuje oznake, ne `$input` |

### Vhodno vozlišče

Uporabite `$input` za sklicevanje na podatke vhodnega vozlišča, kadar obstaja eno samo zgornje vhodno vozlišče:

```
$input.text
```

### Poimenovana vozlišča

Sklicujte se na katerokoli zgornje vozlišče po njegovi oznaki. Ko ima vozlišče [pripeta podatke](./canvas-features.md#data-pin), dokončanje izrazov uporablja te podatke namesto izhodnih podatkov izvajanja.

```
$llm.text
$httpResponse.body
$condition
```

### Poverilnice

Uporabite `$credentials.CredentialName` za sklicevanje na vrednosti poverilnic (npr. API ključi, nosilni žetoni ali žetoni za integracijo Notion) po imenu. Oglejte si [Deljenje poverilnic](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Imena, ki niso preprosti identifikatorji (vsebujejo `-`, se začnejo z digitom ali so rezervirane besede), uporabite obliko z oklepaji: `$credentials["my-api-key"]`.

### Globalne spremenljivke

Uporabite `$global.variableName` za sklicevanje na [Globalne spremenljivke](./global-variables.md) – trajne, uporabniško obsežne podatkovne pare, ki jih upravljamo na [zavihek spremenljivk](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Gnezdene vrednosti

Uporabite notacijo z piko za gnezdene objekte:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literali

- **Nizi**: `"hello"` ali `'hello'`
- **Številke**: `42`, `3.14`
- **Boole**: `true`, `false`
- **Null**: `null`

## Ohranjanje tipov

Ko je **cela** vrednost en sam `$expr`, strežnik ohrani naravni tip:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Ko je izraz del večjega niza, je končni rezultat vedno niz:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Lepljivi zapiski

[Lepljivi zapisek](../nodes/sticky-note-node.md) so dokumentacija platna, ne izvršljiva polja izrazov. Njihova vsebina `note` se prikazuje kot markdown, zato uporabite običajne markdown povezave in slike namesto `$...` izrazov.

Lepljivi zapiski podpirajo prilagojen naslov za prikaz in šest shranjenih barv ozadja:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Zapiski o zagonu",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

Dovoljene vrednosti `stickyColor` so `yellow`, `sky`, `emerald`, `rose`, `violet` in `zinc`.

## Aritmetika

Podprti operatorji: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Primerjave

Uporabite v [Pogoj](../nodes/condition-node.md) vozliščih: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Kontekst zanke

Znotraj [Zanke](../nodes/loop-node.md) vozlišča uporabite `item` za sklicevanje na trenutni element tabele:

```
item.name
item.value
```

## Posebne spremenljivke
- `$now` - Trenutni datum in čas z metodami oblikovanja
- `$Date()` - Ustvari/analiziraj datum (npr. `$Date("2024-01-15")`)
- `$UUID` - Generira 32-znakovni edinstveni identifikator (Brez oklepajev; uporabite `$UUID`, ne `$UUID()`)
- `$workflowName` - Ime trenutnega delovnega toka
- `$workflowDescription` - Opis trenutnega delovnega toka
- `$workflowPath` - Relativna pot delovnega toka, npr. `/workflows/<id>`
- `$workflowUrl` - Absolutna URL povezava delovnega toka, npr. `https://<host>/workflows/<id>`
- `$executionId` - ID trenutnega izvajanja (enak ID-ju vnosa [Zgodovina izvajanja](./execution-history.md), tako da `/workflows/<id>/<executionId>` odpre to izvajanje na platnu). **Samo v času izvajanja**: prazen v dialogu za predogled izrazov; napolnjen le med izvajanjem delovnega toka.
- `$vars` - Spremenljivke lokalnega delovnega toka (dostop preko `$vars.variableName`; posodobljene preko vozlišča `variable`)
- `$global` - Trajna globalna shramba spremenljivk (dostop preko `$global.variableName`)

### Uporaba $vars
- `$vars.counter` - Dostop do spremenljivke z imenom `counter`
- `$vars.myArray.add("item")` - Dodajanje elementa v tabelo spremenljivk

### Uporaba $global
- `$global.environment` - Dostop do globalne spremenljivke z imenom `environment`
- `$global.settings.baseUrl` - Dostop do gnezdenih polj v globalni spremenljivki tipa objekt
## Kontekst Zahteve (Izvedba API)
Ko se workflow izvede preko HTTP API, vhodna vozlišča prejmejo dodatne metapodatke o zahtevi:
- `$textInputLabel.body` - Objekt telesa HTTP zahteve (neobdelan JSON payload)
- `$textInputLabel.headers` - Objekt glav HTTP zahteve (vse ključne vrednosti so v malih črkah)
- `$textInputLabel.query` - Objekt URL poizvedbenih parametrov

Dostopajte do podatkov o zahtevi tako:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Funkcije Pretvorbe Tipov
- `str(value)` - Pretvori v niz
- `int(value)` - Pretvori v celo število
- `float(value)` - Pretvori v decimalno število
- `bool(value)` - Pretvori v logično vrednost
- `list(value)` - Pretvori v seznam
- `dict(key=value, ...)` - Ustvari slovar s ključnimi argumenti (npr. `$dict(name="Ali", age=30)`)

## Matematične Funkcije
- `len(value)` - Pridobi dolžino
- `abs(value)` - Absolutna vrednost
- `min(a, b)` - Minimalna vrednost
- `max(a, b)` - Maksimalna vrednost
- `round(value)` - Zaokroži število
- `sum(list)` - Vsota seznama
- `sorted(list)` - Uredi seznam
- `randomInt(min, max)` - Naključno celo število

## Funkcije za Tabele
- `$array(a, b, c)` - Ustvari tabelo iz argumentov (npr. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Ustvari celoštevilski razpon od `a` do `b`, pri čemer je `b` izključen (npr. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Neuspešno, ko je `a > b`
- `notNull(list)` - Odstrani null vrednosti iz tabele

## Funkcija za Gradnjo Nizov (za izraze map/filter)
- `concat(a, b, c, ...)` - Združi N argumentov
  - Uporabite znotraj `.map()` kot izraz (brez `$` znotraj niza)
  - Uporabite enojne narekovaje znotraj concat niza:
    - Pravilno: `concat('prefix', 'item.field', 'suffix')`

## Literali Objektov / Slovarji
Ustvarite objekte/slovarje z uporabo sintakse zavitih oklepajev z vsemi ključnimi nizi:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dinamični Ključi
- `${now.format("MMMM DD"): "Današnja vrednost"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Pravila Literala Objekta
- Ključi so lahko kateri koli niz (vključno s presledki/posebnimi znaki)
- Ključi MORAJO biti navedeni z dvojimi narekovaji (npr. `"key"`)
- Vrednosti so lahko nizi/števila/logične vrednosti/izrazi/nested objekti

## Funkcije za Nize
- `upper(text)` - Velike črke
- `lower(text)` - Male črke
- `strip(text)` - Odstrani presledke
- `capitalize(text)` - Velika začetnica prve črke
- `title(text)` - Naslovna oblika
- `split(text, separator)` - Razdeli niz
- `join(separator, list)` - Združi seznam
- `replace(text, old, new)` - Zamenjaj besedilo
- `regexReplace(text, pattern, replacement)` - Zamenjaj z regex vzorcem
- `base64Encode(text)` - Kodiraj UTF-8 niz kot standardni Base64
- `base64Decode(text)` - Dekodiraj standardni Base64 v UTF-8 niz
- `toJson(text)` - Razčleni JSON niz v objekt, tabelo ali vrednost

## Metode Nizov (na vrednostih nizov)
- `.orEmpty()` - Vrne vrednost niza ali `""`, ko je vrednost null/manjkajoča
- `.upper()` / `.lower()` - Pretvorba velikih/malih črk
- `.strip()` - Odstrani presledke
- `.capitalize()` / `.title()` - Velika začetnica
- `.length` - Dolžina niza
- `.toString()` - Pretvori v niz
- `.substring(start, end)` - Izvleči podniz
- `.contains(text)` - Preveri, ali vsebuje podniz
- `.startswith(prefix)` / `.endswith(suffix)` - Preveri predpono/končnico
- `.indexOf(text)` - Najdi položaj (vrne -1, če ni najdeno)
- `.replace(old, new)` - Zamenjaj prvo pojavljanje
- `.replaceAll(old, new)` - Zamenjaj vsa pojavljanja
- `.regexReplace(pattern, replacement)` - Zamenjaj z regex vzorcem
- `.hash()` - MD5 hash niza
- `.base64Encode()` - Kodiraj UTF-8 niz kot standardni Base64
- `.base64Decode()` - Dekodiraj standardni Base64 v UTF-8 niz
- `.urlEncode()` - URL kodiraj niz
- `.urlDecode()` - URL dekodiraj niz
- `.escape()` - JSON escape niz (pretvori posebne znake v JSON format)
- `.unescape()` - JSON unescape niz (pretvori JSON format v izvirni niz)
- `.toJson()` - Razčleni JSON niz v objekt, tabelo ali vrednost

### Primeri Metod Nizov
- `$profile.nickname.orEmpty()` - Pretvori nullable/manjkajoči tekst v prazen niz
- `$text.upper()` - Pretvori v velike črke
- `$text.lower()` - Pretvori v male črke
- `$text.strip()` - Odstrani presledke
- `$text.replace("old", "new")` - Zamenjaj besedilo
- `$text.replaceAll("a", "b")` - Zamenjaj vsa pojavljanja
- `$text.length` - Pridobi dolžino niza
- `$text.escape()` - Escape posebne JSON znake (npr. narekovaje, nove vrstice)
- `$escapedText.unescape()` - Unescape JSON formatiran niz nazaj v izvirnik
- `$text.toJson()` - Razčleni JSON objekt/tabelo niz (potem `$text.toJson().repoUrl`)
- `$toJson($text)` - Enaka razčlenitev kot funkcija
- `$base64Encode("Héym 🌍")` - Vrne `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Dekodiraj Base64 v UTF-8 niz
- `$text.urlEncode()` - URL kodiraj za API parametre
- `$encodedText.urlDecode()` - Dekodiraj URL kodiran niz
## Metode za Tabele (na tabelah)
- `.first()` - Pridobi prvi element
- `.last()` - Pridobi zadnji element
- `.random()` - Pridobi naključni element
- `.reverse()` - Obrni tabelo
- `.flat()` - Zravnaj gnezdene tabele v eno samo tabelo
- `.flat(depth)` - Zravnaj z omejitvijo globine
- `.distinct()` - Odstrani podvojene vrednosti
- `.distinctBy(expr)` - Odstrani podvojene vrednosti po izrazu (npr. `$array.distinctBy("item.id")`)
- `.notNull()` - Odstrani null vrednosti
- `.add(item)` - Dodaj element (vrne novo tabelo)
- `.contains(item)` - Preveri, ali tabela vsebuje element (vrne boolean)
- `.join(separator)` - Združi elemente tabele v niz
- `.filter(expr)` - Filtriraj tabelo z uporabo spremenljivke `item` (npr. `$array.filter("item > 5")`)
- `.map(expr)` - Pretvori vsak element z uporabo spremenljivke `item` (npr. `$array.map("item.name")`)
- `.sort(expr, order)` - Razvrsti po izrazu, vrstni red je `"asc"` (privzeto) ali `"desc"`
- `.take(n)` - Pridobi prvih N (pozitivnih) ali zadnjih N (negativnih) elementov
- `.length` - Dolžina tabele
- `.toString()` - Pretvori v JSON niz

### Primeri Filtriranja / Pretvorbe / Razvrščanja
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Metode za Objekte/Sklade (na objektih)
- `.get(key)` - Pridobi vrednost po ključu (vrne null, če ni najdeno)
- `.get(key, default)` - Pridobi vrednost po ključu z privzeto vrednostjo
- `.keys()` - Vrne seznam vseh ključev
- `.values()` - Vrne seznam vseh vrednosti
- `.entries()` - Vrne seznam `{key, value}` objektov (ena za vsako lastnost)
- `.filter(expr)` - Iterira `{key, value}` vnose in vrne ujemajoče vnose kot seznam (uporabite `item.key` / `item.value` znotraj `expr`)
- `.map(expr)` - Iterira `{key, value}` vnose in vrne seznam spremenjenih vrednosti (uporabite `item.key` / `item.value` znotraj `expr`)
- `.toString()` - Pretvori v JSON niz

### Primeri Iteracije po Objektih
Ko iterirate objekt z `.map()` ali `.filter()`, je vsak `item` par `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → seznam imen lastnosti, ki niso null

## Datum/Čas
- `$now` - Trenutni datum in čas
- `$now.format("YYYY-MM-DD")` - Oblikovanje datuma/časa
- `$now.toISO()` / `.toDate()` / `.toTime()` - Pretvorba formatov
- `$now.addDays(n)` / `.addHours(n)` - Matematične operacije z datumi
- `$Date("2024-01-15")` - Parsiranje datumske niza

## Številske Operacije
- Osnovne matematične operacije: `+`, `-`, `*`, `/`, `%`
- Primerjave: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Boolean operatorji: `and`, `or`, `not`

## Boolean Pogoji
Za booleane, izraz napišite neposredno (ne silite `== true`):
- Napačno: `$nodeName.isValid == true`
- Pravilno: `$nodeName.isValid`
- Negacija: `not $nodeName.isValid`

## Pravila & Seznam Dovoljenih (Kritično)
### Pravila za Postavitev $
- Samostojen izraz običajno začne z vodilnim `$`.
- Predloge lahko vsebujejo več `$refs`.
- Parametri metod lahko prav tako vsebujejo gnezdene `$refs`, ko želite posredovati rezultat drugega izraza (dinamični ključ ali gnezdena rešitev).
  - Veljavno: `$node.method(other.field)` — `other` se reši iz konteksta kot oznaka na najvišji ravni (brez `$` znotraj argumenta).
  - Veljavno: `$node.method($other.field)` — gnezdeni `$` je podprt v predogledu dialoga za ocenjevanje in ocenjevanje pogojev.
  - Veljavno: `$array($a.x, $b.y)`
  - Samodejno dopolnjevanje znotraj `.get(` vstavi **gole** poti `label.field` (brez vodilnega `$`), enako kot znotraj `$array(...)` / `$notNull(...)`.
- **Ocenjevanje API (Zagon):** Če je celotna predložena vrednost ena sama pika **brez** vodilnega `$` (na primer besedilo izbrano v urejevalniku, kot je `execute.outputs.output.result.today`), backend to obravnava enako kot `$execute.outputs.output.result.today`. Vrednosti, ki vsebujejo novo vrstico ali povratni znak po obrezovanju, niso prepisane (izogibanje dvoumnim večvrstičnim payloadom). Prednostno pišite `$` v shranjenih poljih delovnega toka; prepis je predvsem za pregled in orodja.
- Rezultat dialoga za ocenjevanje `Zagon` je vir resnice za to, kako se konkretni izraz razreši.

### Navedba Nizov v Tabelah
Pri ustvarjanju tabel z nizovnimi vrednostmi, vedno uporabite dvojne narekovaje:
- Pravilno: `$array("hello", "world")`
- Napačno: `$array('hello', 'world')`

### UPORABITE SAMO TE FUNKCIJE (Seznam Dovoljenih)
Uporabite SAMO:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumentirane metode za nize/tabele/objekte

Če funkcija ni navedena zgoraj, ne obstaja.

### Omejitve Metod za Tabele / Sklade
- Tabele lahko UPORABLJAJO SAMO: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objekti/Skladi lahko UPORABLJAJO SAMO: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Rezervirana imena oznak vozlišč
Ne uporabljajte teh imen kot oznake vozlišč: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Primeri

**Pogoj**: `$input.text.length > 0`

**Sporočilo uporabnika LLM**: `$input.text`

**Izhodno sporočilo**: `$llm.text`

**Vrednost spremenljivke**: `$input.count + 1`

### DSL Primer

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Sorodno

- [Pogovor o vrednotenju izrazov](./expression-evaluation-dialog.md) – Razširljiv urejevalnik z vnaprejšnjim ogledom in samodejnim dopolnjevanjem
- [Značilnosti platna](./canvas-features.md) – Podatkovna priponka za testiranje izrazov brez ponovnega izvajanja vozlišč
- [Vrste vozlišč](./node-types.md) – Vozlišča, ki uporabljajo izraze ([LLM](../nodes/llm-node.md), [Pogoj](../nodes/condition-node.md), [Izhod](../nodes/output-node.md), [Nastavi](../nodes/set-node.md), itd.)
- [Priponka](../nodes/sticky-note-node.md) – Opombe Markdown na platnu z urejanjem naslova, barve in prikazom slike
- [Agent vozlišče](../nodes/agent-node.md) – Uporaba izrazov v pozivih agentov
- [Trajna pomnilnika agenta](./agent-persistent-memory.md) – `persistentMemoryEnabled` in `memoryShares` v agentovih `data` (ne polja izrazov)
- [Struktura delovnega toka](./workflow-structure.md) – Polja `data` vozlišč, ki sprejemajo izraze
- [Zavihek poverilnic](../tabs/credentials-tab.md) – Poverilnice, na katere se sklicujejo vozlišča
- [Deljenje poverilnic](./credentials-sharing.md) – Delite poverilnice in uporabite `$credentials` v izrazih
- [Globalne spremenljivke](./global-variables.md) – Trajne spremenljivke z `$global`
