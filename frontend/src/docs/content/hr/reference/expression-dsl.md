# Izrazni DSL

Heym koristi jednostavni jezik izraza za referenciranje podataka iz uzvodnih čvorova. Koristite izraze u konfiguraciji čvorova kao što su LLM `userMessage`, Uvjet `condition`, Izlaz `message`, Postavljanje mapiranja i Vrijednosti varijabli. Koristite [Dijalog za evaluaciju izraza](./expression-evaluation-dialog.md) za veći uređivač, pregled uživo pokretan backendom i odabir izlazne putanje.

## Osnovne reference

### Ulazni čvor vs imenovani čvorovi

- **`$input`** – Koristite samo kada postoji jedan uzvodni [Input](../nodes/input-node.md) čvor i želite referencirati njegov izlaz. Primjer: `$input.text`. Ovo je skraćenica za "podatke iz povezanog ulaza."
- **`$nodeLabel.field`** – Koristite za referenciranje bilo kojeg uzvodnog čvora prema njegovoj **oznaci** (oznaka u podacima čvora). Preferirajte ovo kada imate više čvorova ili kada AI asistent / workflow DSL očekuje eksplicitne oznake. Primjer: `$userInput.body.text`, `$myLLM.text`.

**Kada koristiti što:**

| Kontekst | Preferirajte | Primjer |
|----------|--------------|---------|
| Jedan ulazni čvor, jednostavan tok | `$input.text` | Izlazna poruka iz jednog Input-a |
| Više čvorova ili imenovane reference | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI asistent](./ai-assistant.md) / workflow JSON | Uvijek `$nodeLabel.field` | Graditelj workflow-a očekuje oznake, ne `$input` |

### Ulazni čvor

Koristite `$input` za referenciranje podataka iz Ulaznog čvora kada postoji jedan uzvodni ulaz:

```
$input.text
```

### Imenovani čvorovi

Referencirajte bilo koji uzvodni čvor prema njegovoj oznaci. Kada čvor ima [priključene podatke](./canvas-features.md#data-pin), dovršavanje izraza koristi to umjesto izlaza izvršenja.

```
$llm.text
$httpResponse.body
$condition
```

### Vjerodajnice

Koristite `$credentials.CredentialName` za referenciranje vrijednosti vjerodajnica (npr. API ključeva, bearer tokena ili tokena za Notion integraciju) po imenu. Pogledajte [Dijeljenje vjerodajnica](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Imena koja nisu obični identifikatori (sadrže `-`, počinju s brojkom ili su rezervirane riječi) koriste oblik s zagradama: `$credentials["my-api-key"]`.

### Globalne varijable

Koristite `$global.variableName` za referenciranje [Globalnih varijabli](./global-variables.md) – trajnih, korisnički opsežnih ključ-vrijednost podataka upravljanih u [Završnoj kartici](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Ugniježdene vrijednosti

Koristite notaciju točke za ugniježdene objekte:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literali

- **Stringovi**: `"hello"` ili `'hello'`
- **Brojevi**: `42`, `3.14`
- **Booleovi**: `true`, `false`
- **Null**: `null`

## Očuvanje tipa

Kada je **cijela** vrijednost jedan `$expr`, backend očuvava izvorni tip:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Kada je izraz dio većeg stringa, konačni rezultat je uvijek string:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Ljepljive bilješke

[Sticky Note](../nodes/sticky-note-node.md) čvorovi su dokumentacija na platnu, a ne izvršne polja izraza. Njihov sadržaj `note` prikazuje se kao markdown, stoga koristite redovne markdown poveznice i slike umjesto `$...` izraza.

Ljepljive bilješke podržavaju prilagođeni naslov prikaza i šest spremljenih boja pozadine:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Napomene o lansiranju",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

Dopuštene vrijednosti `stickyColor` su `yellow`, `sky`, `emerald`, `rose`, `violet` i `zinc`.

## Aritmetika

Podržani operatori: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Usporedbe

Koristite u [Condition](../nodes/condition-node.md) čvorovima: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Kontekst petlje

Unutar [Loop](../nodes/loop-node.md) čvora, koristite `item` za referenciranje trenutnog elementa niza:

```
item.name
item.value
```

## Posebne varijable
- `$now` - Trenutni datum i vrijeme s metodama formatiranja
- `$Date()` - Kreiranje/parsing datuma (npr. `$Date("2024-01-15")`)
- `$UUID` - Generiranje jedinstvenog identifikatora od 32 znaka (BEZ zagrada; koristite `$UUID`, a ne `$UUID()`)
- `$workflowName` - Ime trenutnog workflow-a
- `$workflowDescription` - Opis trenutnog workflow-a
- `$workflowPath` - Relativna putanja workflow-a, npr. `/workflows/<id>`
- `$workflowUrl` - Apsolutna URL adresa workflow-a, npr. `https://<host>/workflows/<id>`
- `$executionId` - ID trenutnog izvršenja (jednak ID-u unosa [Povijesti izvršenja](./execution-history.md), tako da `/workflows/<id>/<executionId>` otvara ovo izvođenje na platnu). **Samo u vrijeme izvođenja**: prazan u dijalogu za pregled izraza; popunjen samo dok se workflow izvršava.
- `$vars` - Varijable lokalne za workflow (pristupite putem `$vars.variableName`; ažurira se putem čvora varijable)
- `$global` - Trajna globalna pohrana varijabli (pristupite putem `$global.variableName`)
- `$page.record` - Samo za workflowe widgeta nadzorne ploče: zapis stranice s pojedinostima na kojoj se widget nalazi, iz parametra `?record=` nadzorne ploče. Ima vrijednost `null` na nadzornoj ploči otvorenoj bez tog parametra i u dijalogu pregleda izraza. Čvor označen s `page` ima prednost. Pogledajte [Stranice s pojedinostima](../tabs/dashboard-tab.md#detail-pages).

### Korištenje $vars
- `$vars.counter` - Pristup varijabli nazvanoj `counter`
- `$vars.myArray.add("item")` - Dodajte stavku u niz varijable

### Korištenje $global
- `$global.environment` - Pristup globalnoj varijabli nazvanoj `environment`
- `$global.settings.baseUrl` - Pristup ugniježdenim vrijednostima u objektu tipa globalne varijable
## Kontekst Zahtjeva (API Izvršavanje)
Kada se workflow izvrši putem HTTP API-ja, ulazni čvorovi primaju dodatne metapodatke zahtjeva:
- `$textInputLabel.body` - HTTP tijelo zahtjeva (sirovi JSON payload)
- `$textInputLabel.headers` - HTTP zaglavlja zahtjeva (svi ključevi zaglavlja su mala slova)
- `$textInputLabel.query` - URL parametri upita

Pristupite podacima zahtjeva kao:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Funkcije Konverzije Tipova
- `str(value)` - Konvertirati u string
- `int(value)` - Konvertirati u cijeli broj
- `float(value)` - Konvertirati u decimalni broj
- `bool(value)` - Konvertirati u boolean
- `list(value)` - Konvertirati u listu
- `dict(key=value, ...)` - Kreirati rječnik s ključnim argumentima (npr. `$dict(name="Ali", age=30)`)

## Matematičke Funkcije
- `len(value)` - Dobiti duljinu
- `abs(value)` - Apsolutna vrijednost
- `min(a, b)` - Minimalna vrijednost
- `max(a, b)` - Maksimalna vrijednost
- `round(value)` - Zaokružiti broj
- `sum(list)` - Zbroj liste
- `sorted(list)` - Sortirati listu
- `randomInt(min, max)` - Nasumični cijeli broj

## Funkcije Niza
- `$array(a, b, c)` - Kreirati niz iz argumenata (npr. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Kreirati cijeli broj u rasponu od `a` do `b` s isključenim `b` (npr. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Neuspjeh kada je `a > b`
- `notNull(list)` - Ukloniti null vrijednosti iz niza

## Funkcija za Izgradnju Niza (za map/filter izraze)
- `concat(a, b, c, ...)` - Konkatenirati N argumenata
  - Koristite unutar `.map()` kao izrazni string (bez `$` unutar stringa)
  - Koristite jednostruke navodnike unutar concat stringa:
    - Ispravno: `concat('prefix', 'item.field', 'suffix')`

## Literali Objekata / Rječnici
Kreirajte objekte/rječnike koristeći sintaksu s vitičastim zagradama s bilo kojim string ključevima:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dinamički Ključevi
- `${now.format("MMMM DD"): "Danasnja vrijednost"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Pravila Literala Objekata
- Ključevi mogu biti bilo koji string (uključujući razmake/posebne znakove)
- Ključevi MORAJU biti navedeni s dvostrukim navodnicima (npr. `"key"`)
- Vrijednosti mogu biti stringovi/brojevi/boolean/izrazi/nested objekti

## Funkcije za Nizove
- `upper(text)` - Velika slova
- `lower(text)` - Mala slova
- `strip(text)` - Ukloniti praznine
- `capitalize(text)` - Veliko prvo slovo
- `title(text)` - Naslovni oblik
- `split(text, separator)` - Podijeliti string
- `join(separator, list)` - Spojiti listu
- `replace(text, old, new)` - Zamijeniti tekst
- `regexReplace(text, pattern, replacement)` - Zamijeniti s regex obrascem
- `base64Encode(text)` - Kodirati UTF-8 tekst kao standardni Base64
- `base64Decode(text)` - Dekodirati standardni Base64 u UTF-8 tekst
- `toJson(text)` - Parsirati JSON string u objekt, niz ili vrijednost

## Metode Niza (na vrijednostima niza)
- `.orEmpty()` - Vraća vrijednost niza, ili `""` kada je vrijednost null/izgubljena
- `.upper()` / `.lower()` - Konverzija slučaja
- `.strip()` - Ukloniti praznine
- `.capitalize()` / `.title()` - Veliko prvo slovo
- `.length` - Duljina niza
- `.toString()` - Konvertirati u string
- `.substring(start, end)` - Izdvojiti podniz
- `.contains(text)` - Provjeriti sadrži li podniz
- `.startswith(prefix)` / `.endswith(suffix)` - Provjeriti prefiks/sufiks
- `.indexOf(text)` - Pronaći poziciju (vraća -1 ako nije pronađeno)
- `.replace(old, new)` - Zamijeniti prvo pojavljivanje
- `.replaceAll(old, new)` - Zamijeniti sva pojavljivanja
- `.regexReplace(pattern, replacement)` - Zamijeniti s regex obrascem
- `.hash()` - MD5 hash niza
- `.base64Encode()` - Kodirati UTF-8 tekst kao standardni Base64
- `.base64Decode()` - Dekodirati standardni Base64 u UTF-8 tekst
- `.urlEncode()` - URL kodirati string
- `.urlDecode()` - URL dekodirati string
- `.escape()` - JSON escape string (pretvoriti posebne znakove u JSON format)
- `.unescape()` - JSON unescape string (pretvoriti JSON format u izvorni string)
- `.toJson()` - Parsirati JSON string u objekt, niz ili vrijednost

### Primjeri Metoda Niza
- `$profile.nickname.orEmpty()` - Pretvoriti nullable/izgubljeni tekst u prazan string
- `$text.upper()` - Pretvoriti u velika slova
- `$text.lower()` - Pretvoriti u mala slova
- `$text.strip()` - Ukloniti praznine
- `$text.replace("old", "new")` - Zamijeniti tekst
- `$text.replaceAll("a", "b")` - Zamijeniti sva pojavljivanja
- `$text.length` - Dobiti duljinu niza
- `$text.escape()` - Escape posebne JSON znakove (npr., navodnike, nove redove)
- `$escapedText.unescape()` - Vratiti JSON formatirani string u izvorni
- `$text.toJson()` - Parsirati JSON objekt/niz string (zatim `$text.toJson().repoUrl`)
- `$toJson($text)` - Ista parsiranje kao funkcija
- `$base64Encode("Héym 🌍")` - Vratiti `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Dekodirati Base64 u UTF-8 tekst
- `$text.urlEncode()` - URL kodirati za API parametre
- `$encodedText.urlDecode()` - Dekodirati URL kodirani tekst
## Metode nizova (na nizovima)
- `.first()` - Dohvati prvi element
- `.last()` - Dohvati posljednji element
- `.random()` - Dohvati nasumični element
- `.reverse()` - Obrni niz
- `.flat()` - Izravnaj ugniježdene nizove u jedan niz
- `.flat(depth)` - Izravnaj s ograničenjem dubine
- `.distinct()` - Ukloni duplicirane vrijednosti
- `.distinctBy(expr)` - Ukloni duplicirane vrijednosti prema izrazu (npr. `$array.distinctBy("item.id")`)
- `.notNull()` - Ukloni null vrijednosti
- `.add(item)` - Dodaj stavku (vraća novi niz)
- `.contains(item)` - Provjeri sadrži li niz stavku (vraća boolean)
- `.join(separator)` - Spoji elemente niza u string
- `.filter(expr)` - Filtriraj niz koristeći varijablu `item` (npr. `$array.filter("item > 5")`)
- `.map(expr)` - Transformiraj svaki element koristeći varijablu `item` (npr. `$array.map("item.name")`)
- `.sort(expr, order)` - Sortiraj prema izrazu, redoslijed je `"asc"` (zadano) ili `"desc"`
- `.take(n)` - Uzmi prvih N (pozitivnih) ili posljednjih N (negativnih) elemenata
- `.length` - Duljina niza
- `.toString()` - Pretvori u JSON string

### Primjeri filtriranja / mapiranja / sortiranja
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Metode objekata/rječnika (na objektima)
- `.get(key)` - Dohvati vrijednost prema ključu (vraća null ako nije pronađeno)
- `.get(key, default)` - Dohvati vrijednost prema ključu s zadanim povratkom
- `.keys()` - Vraća popis svih ključeva
- `.values()` - Vraća popis svih vrijednosti
- `.entries()` - Vraća popis `{key, value}` objekata (jedan po svojstvu)
- `.filter(expr)` - Iteriraj `{key, value}` unose i vrati odgovarajuće unose kao popis (koristite `item.key` / `item.value` unutar `expr`)
- `.map(expr)` - Iteriraj `{key, value}` unose i vrati popis transformiranih vrijednosti (koristite `item.key` / `item.value` unutar `expr`)
- `.toString()` - Pretvori u JSON string

### Primjeri iteracije objekata
Kada iterirate objekt s `.map()` ili `.filter()`, svaki `item` je `{key, value}` par:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → popis imena svojstava koja nisu null

## Datum/Vrijeme
- `$now` - Trenutni datum i vrijeme
- `$now.format("YYYY-MM-DD")` - Formatiraj datum/vrijeme
- `$now.toISO()` / `.toDate()` / `.toTime()` - Pretvori formate
- `$now.addDays(n)` / `.addHours(n)` - Matematičke operacije s datumima
- `$Date("2024-01-15")` - Parsiraj string datuma

## Numeričke operacije
- Osnovne matematičke operacije: `+`, `-`, `*`, `/`, `%`
- Usporedbe: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Booleanske operatore: `and`, `or`, `not`

## Booleanske uvjete
Za booleanske izraze, pišite izraz izravno (ne forsirajte `== true`):
- Pogrešno: `$nodeName.isValid == true`
- Točno: `$nodeName.isValid`
- Negacija: `not $nodeName.isValid`

## Pravila i bijela lista (kritično)
### Pravila postavljanja $
- Samostalni izraz obično počinje s vodećim `$`.
- Predloške mogu sadržavati više `$refs`.
- Parametri metoda također mogu sadržavati ugniježdene `$refs` kada želite proslijediti rezultat drugog izraza (dinamički ključ ili ugniježdeno rješavanje).
  - Valjano: `$node.method(other.field)` — `other` se rješava iz konteksta poput oznake na vrhu (bez `$` unutar argumenta).
  - Valjano: `$node.method($other.field)` — ugniježdeni `$` je podržan u pregledu dijaloga za evaluaciju i evaluaciji uvjeta.
  - Valjano: `$array($a.x, $b.y)`
  - Automatsko dovršavanje unutar `.get(` umetne **gole** `label.field` putanje (bez vodećeg `$`), isto kao unutar `$array(...)` / `$notNull(...)`.
- **Evaluate API (Pokreni):** Ako je cijela predana vrijednost jedna točka putanja **bez** vodećeg `$` (na primjer, tekst odabran u uređivaču, poput `execute.outputs.output.result.today`), backend to tretira isto kao `$execute.outputs.output.result.today`. Vrijednosti koje sadrže novi redak ili povratak u red nakon obrezivanja se ne prepisuju (izbjegava nejasne višelinijske payload-e). Preporučuje se pisanje `$` u spremljenim poljima workflow-a; prepisivanje je uglavnom za inspekciju i alate.
- Rezultat dijaloga za evaluaciju `Run` je izvor istine za to kako se konkretan izraz rješava.

### Citiranje nizova
Kada kreirate nizove s string vrijednostima, UVIJEK koristite dvostruke navodnike:
- Točno: `$array("hello", "world")`
- Pogrešno: `$array('hello', 'world')`

### KORISTITE SAMO OVE FUNKCIJE (Bijela lista)
Koristite SAMO:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumentirane metode za string/niz/objekt

Ako funkcija nije navedena iznad, ne postoji.

### Ograničenja metoda nizova / rječnika
- Nizovi mogu KORISTITI SAMO: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objekti/Rječnici mogu KORISTITI SAMO: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Rezervirana Imena Oznaka Čvorova
Nemojte koristiti ova imena kao oznake čvorova: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Primjeri

**Uvjet**: `$input.text.length > 0`

**Poruka korisnika LLM-a**: `$input.text`

**Poruka izlaza**: `$llm.text`

**Vrijednost varijable**: `$input.count + 1`

### DSL Primjer

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Povezano

- [Dijalog Evaluacije Izraza](./expression-evaluation-dialog.md) – Proširivi uređivač s pregledom uživo na pozadini i automatskim dovršavanjem
- [Značajke Platna](./canvas-features.md) – Podaci za testiranje izraza bez ponovnog pokretanja čvorova
- [Tipovi Čvorova](./node-types.md) – Čvorovi koji koriste izraze ([LLM](../nodes/llm-node.md), [Uvjet](../nodes/condition-node.md), [Izlaz](../nodes/output-node.md), [Postavi](../nodes/set-node.md), itd.)
- [Ljepljiva Napomena](../nodes/sticky-note-node.md) – Markdown napomene na platnu s uređivim naslovom, bojom i prikazom slike
- [Agent Čvor](../nodes/agent-node.md) – Korištenje izraza u promptovima agenata
- [Trajna Memorija Agenta](./agent-persistent-memory.md) – `persistentMemoryEnabled` i `memoryShares` u agentovim `data` (ne izrazi)
- [Struktura Workflows-a](./workflow-structure.md) – Polja `data` čvorova koja prihvaćaju izraze
- [Zaslon Vjerodajnica](../tabs/credentials-tab.md) – Vjerodajnice na koje se pozivaju čvorovi
- [Dijeljenje Vjerodajnica](./credentials-sharing.md) – Dijelite vjerodajnice i koristite `$credentials` u izrazima
- [Globalne Varijable](./global-variables.md) – Trajne varijable s `$global`
