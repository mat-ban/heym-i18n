# Expression DSL

Heym käyttää yksinkertaista lausekekieltä viittaamaan ylävirran solmujen tietoihin. Lausekkeita voidaan käyttää solmujen asetuksissa, kuten LLM-solmujen `userMessage`-kentässä, Condition-solmujen `condition`-kentässä, Output-solmujen `message`-kentässä, Set-solmujen mappauksissa ja Variable-solmujen arvoissa. Käytä [Expression Evaluation Dialog](./expression-evaluation-dialog.md) -toimintoa laajempaan muokkaamiseen, taustajärjestelmän tarjoamaan esikatseluun ja output-polun valintaan.

## Perusviittaukset

### Syötesolmu vs. nimetyt solmut

- **`$input`** – Käytä vain, kun työnkulussa on yksittäinen ylävirran [Syötesolmu](../nodes/input-node.md) ja haluat viitata sen tulokseen. Esimerkki: `$input.text`. Tämä on lyhennysmerkintä "yhdistetyn syötteen tiedoille".
- **`$nodeLabel.field`** – Viittaa mihin tahansa ylävirran solmuun sen **nimikkeen** (solmun tiedoissa määritelty `label`) avulla. Suositaan tätä, kun työnkulussa on useita solmuja tai kun AI Assistant / workflow DSL edellyttää eksplisiittisiä nimikkeitä. Esimerkkejä: `$userInput.body.text`, `$myLLM.text`.

**Käyttökohteet:**

| Konteksti | Suositus | Esimerkki |
|--------|--------|---------|
| Yksittäinen syötesolmu, yksinkertainen työnkulku | `$input.text` | Output-viesti yhdestä Syötesolmusta |
| Useita solmuja tai nimetyt viittaukset | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Aina `$nodeLabel.field` | Workflow Builder odottaa nimikkeitä, ei `$input`-viittauksia |

### Syötesolmu

Käytä `$input`-viittausta, kun työnkulussa on yksittäinen ylävirran syötesolmu:

```
$input.text
```

### Nimetyt solmut

Viittaa mihin tahansa ylävirran solmuun sen nimikkeen avulla. Kun solmussa on [kiinnitetty data](./canvas-features.md#data-pin), lausekkeen täydennys käyttää sitä suoritustuloksen sijaan.

```
$llm.text
$httpResponse.body
$condition
```

### Tunnistetiedot

Käytä `$credentials.CredentialName`-muotoa viitataksesi tunnistetietoihin (kuten API-avaimiin, bearer-tokeneihin tai Notion-integrointitokeneihin) nimellä. Katso [Tunnistetietojen jakaminen](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Nimissä, jotka eivät ole tavallisia tunnisteita (sisältävät `-`, alkavat numerolla tai ovat varattuja sanoja), käytetään hakasulkumuotoa: `$credentials["my-api-key"]`.

### Globaalit muuttujat

Käytä `$global.variableName`-muotoa viitataksesi [Globaaleihin muuttujiin](./global-variables.md) – käyttäjäkohtaiseen, pysyvään avain-arvo -dataan, jota hallinnoidaan [Muuttujat-välilehdessä](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Sisäkkäiset kentät

Käytä pistenotaatiota sisäkkäisille objekteille:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literaalit

- **Merkkijonot**: `"hello"` tai `'hello'`
- **Numerot**: `42`, `3.14`
- **Totuusarvot**: `true`, `false`
- **Null**: `null`

## Tyyppien säilyttäminen

Kun **koko** arvo koostuu yksittäisestä `$expr`-lausekkeesta, taustajärjestelmä säilyttää alkuperäisen tyypin:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Kun lauseke on osa laajempaa merkkijonoa, lopputulos on aina merkkijono:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Muistilaput

[Sticky Note](../nodes/sticky-note-node.md) -solmut ovat dokumentaatiota, eivät suoritettavia lausekekenttiä. Niiden `note`-sisältö renderöidään markdownina, joten käytä säännöllisiä markdown-linkkejä ja -kuvia `$...`-lausekkeiden sijaan.

Muistilaput tukevat mukautettua otsikkoa ja kuutta tallennettua taustaväriä:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Käynnistysmuistiinpanot",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

Sallitut `stickyColor`-arvot ovat `yellow`, `sky`, `emerald`, `rose`, `violet` ja `zinc`.

## Aritmetiikka

Tuetut operaattorit: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Vertailut

Käytä [Condition](../nodes/condition-node.md) -solmuissa: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Silmukkakonteksti

[Loop](../nodes/loop-node.md) -solmun sisällä käytä `item`-viittausta nykyiseen taulukon alkioon:

```
item.name
item.value
```

## Erikoismuuttujat
- `$now` - Nykyinen päivämäärä ja aika muotoiluineen
- `$Date()` - Luo/jäsennä päivämäärä (esim. `$Date("2024-01-15")`)
- `$UUID` - Luo 32-merkkinen yksilöllinen tunniste (EI SULKEITA; käytä `$UUID` eikä `$UUID()`)
- `$workflowName` - Nykyisen workflowin nimi
- `$workflowDescription` - Nykyisen workflowin kuvaus
- `$workflowPath` - Workflowin suhteellinen polku, esim. `/workflows/<id>`
- `$workflowUrl` - Workflowin absoluuttinen URL, esim. `https://<host>/workflows/<id>`
- `$executionId` - Nykyisen suorituksen tunniste (vastaa [Suoritushistorian](./execution-history.md) merkinnän id:tä, joten `/workflows/<id>/<executionId>` avaa tämän suorituksen canvasilla). **Vain suoritusaikana**: tyhjä expression preview -dialogissa; täytetään vain workflowa suoritettaessa.
- `$vars` - Workflow-lokaalit muuttujat (käyttö muodossa `$vars.variableName`; päivitetään `variable`-solmulla)
- `$global` - Pysyvät globaalit muuttujat (käyttö muodossa `$global.variableName`)

### $vars-käyttö
- `$vars.counter` - Käytä muuttujaa nimeltä `counter`
- `$vars.myArray.add("item")` - Lisää alkio taulukkotyypiseen muuttujaan

### $global-käyttö
- `$global.environment` - Käytä globaalia muuttujaa nimeltä `environment`
- `$global.settings.baseUrl` - Käytä sisäkkäisiä kenttiä objektityyppisessä globaalissa muuttujassa
## Pyyntökonteksti (API-suoritus)
Kun workflow suoritetaan HTTP-API:n kautta, syötesolmut saavat lisäksi pyyntömetatietoja:
- `$textInputLabel.body` - HTTP-pyynnön runko (raaka JSON-payload)
- `$textInputLabel.headers` - HTTP-pyynnön otsikot (kaikki otsikkoavaimet pienellä kirjoitettuina)
- `$textInputLabel.query` - URL-parametrit

Käytä pyyntötietoja seuraavasti:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Typpimuunnosfunktiot
- `str(arvo)` - Muunna merkkijonoksi
- `int(arvo)` - Muunna kokonaisluvuksi
- `float(arvo)` - Muunna liukuluvuksi
- `bool(arvo)` - Muunna totuusarvoksi
- `list(arvo)` - Muunna listaksi
- `dict(avain=arvo, ...)` - Luo sanakirja avain-arvo-pareista (esim. `$dict(nimi="Ali", ikä=30)`)

## Matemaattiset funktiot
- `len(arvo)` - Palauta pituus
- `abs(arvo)` - Itseisarvo
- `min(a, b)` - Pienempi arvo
- `max(a, b)` - Suurempi arvo
- `round(arvo)` - Pyöristä luku
- `sum(lista)` - Listan summa
- `sorted(lista)` - Järjestä lista
- `randomInt(min, max)` - Satunnainen kokonaisluku

## Taulukkofunktiot
- `$array(a, b, c)` - Luo taulukko argumenteista (esim. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Luo kokonaislukuväli `a`:sta `b`:hen (`b` ei sisälly) (esim. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Epäonnistuu, jos `a > b`
- `notNull(lista)` - Poista null-arvot taulukosta

## Merkkijonon rakennusfunktio (map/filter-lausekkeisiin)
- `concat(a, b, c, ...)` - Yhdistä N argumenttia
  - Käytä `.map()`-lausekkeen sisällä merkkijonona (ei `$`-merkkiä merkkijonon sisällä)
  - Käytä yksinkertaisia lainausmerkkejä concat-merkkijonon sisällä:
    - Oikein: `concat('etuliite', 'item.kenttä', 'jälkiliite')`

## Objektikirjaimet / sanakirjat
Luo objekteja/sanakirjoja aaltosulkusyntaksilla millä tahansa merkkijonoavaimilla:
- `${"nimi": "Ali", "ikä": 30}` -> `{"nimi": "Ali", "ikä": 30}`

### Dynaamiset avaimet
- `${now.format("MMMM DD"): "Tämän päivän arvo"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Objektikirjaimien säännöt
- Avaimet voivat olla mitä tahansa merkkijonoja (mukaan lukien välilyönnit ja erikoismerkit)
- Avaimet on lainattava kaksoislainausmerkeillä (esim. `"avain"`)
- Arvot voivat olla merkkijonoja/lukuja/totuusarvoja/lausekkeita/sisäkkäisiä objekteja

## Merkkijonofunktiot
- `upper(teksti)` - Isot kirjaimet
- `lower(teksti)` - Pienet kirjaimet
- `strip(teksti)` - Poista whitespace
- `capitalize(teksti)` - Alkukirjain isoksi
- `title(teksti)` - Alkukirjaimet isoksi
- `split(teksti, erotin)` - Jaa merkkijono
- `join(erotin, lista)` - Yhdistä lista
- `replace(teksti, vanha, uusi)` - Korvaa teksti
- `regexReplace(teksti, malli, korvaus)` - Korvaa regex-mallilla
- `base64Encode(teksti)` - Koodaa UTF-8-teksti standardi Base64:ksi
- `base64Decode(teksti)` - Dekoodaa standardi Base64 UTF-8-tekstiksi
- `toJson(teksti)` - Jäsennä JSON-merkkijono objektiksi, taulukoksi tai arvoksi

## Merkkijonometodit (merkkijonoarvoilla)
- `.orEmpty()` - Palauta merkkijonoarvo tai `""`, jos arvo on null/puuttuu
- `.upper()` / `.lower()` - Kirjainkoon muutos
- `.strip()` - Poista whitespace
- `.capitalize()` / `.title()` - Alkukirjain isoksi
- `.length` - Merkkijonon pituus
- `.toString()` - Muunna merkkijonoksi
- `.substring(alku, loppu)` - Poimi osajono
- `.contains(teksti)` - Tarkista, sisältääkö osajonon
- `.startswith(etuliite)` / `.endswith(jälkiliite)` - Tarkista etu-/jälkiliite
- `.indexOf(teksti)` - Etsi sijainti (palauttaa -1, jos ei löydy)
- `.replace(vanha, uusi)` - Korvaa ensimmäinen esiintymä
- `.replaceAll(vanha, uusi)` - Korvaa kaikki esiintymät
- `.regexReplace(malli, korvaus)` - Korvaa regex-mallilla
- `.hash()` - Merkkijonon MD5-tiiviste
- `.base64Encode()` - Koodaa UTF-8-teksti standardi Base64:ksi
- `.base64Decode()` - Dekoodaa standardi Base64 UTF-8-tekstiksi
- `.urlEncode()` - URL-koodaa merkkijono
- `.urlDecode()` - URL-dekoodaa merkkijono
- `.escape()` - JSON-koodaa merkkijono (muunna erikoismerkit JSON-muotoon)
- `.unescape()` - JSON-dekoodaa merkkijono (muunna JSON-muoto alkuperäiseksi merkkijonoksi)
- `.toJson()` - Jäsennä JSON-merkkijono objektiksi, taulukoksi tai arvoksi

### Merkkijonometodiesimerkkejä
- `$profile.nickname.orEmpty()` - Muunna null/puuttuva teksti tyhjäksi merkkijonoksi
- `$text.upper()` - Muunna isoiksi kirjaimiksi
- `$text.lower()` - Muunna pieniksi kirjaimiksi
- `$text.strip()` - Poista whitespace
- `$text.replace("vanha", "uusi")` - Korvaa teksti
- `$text.replaceAll("a", "b")` - Korvaa kaikki esiintymät
- `$text.length` - Hae merkkijonon pituus
- `$text.escape()` - Koodaa erikoismerkit JSON-muotoon (esim. lainausmerkit, rivinvaihdot)
- `$escapedText.unescape()` - Dekoodaa JSON-muotoinen merkkijono alkuperäiseksi
- `$text.toJson().repoUrl` - Jäsennä JSON-objekti/taulukkomerkkijono (käytä sitten `.repoUrl`)
- `$toJson($text)` - Sama jäsennys funktiona
- `$base64Encode("Héym 🌍")` - Palauttaa `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Dekoodaa Base64 UTF-8-tekstiksi
- `$text.urlEncode()` - URL-koodaa API-parametreiksi
- `$encodedText.urlDecode()` - Dekoodaa URL-koodattu teksti
## Taulukkometodit (array)
- `.first()` - Hae ensimmäinen alkio
- `.last()` - Hae viimeinen alkio
- `.random()` - Hae satunnainen alkio
- `.reverse()` - Käänteinen järjestys
- `.flat()` - Litistä sisäkkäiset taulukot yhdeksi taulukoksi
- `.flat(depth)` - Litistä syvyysrajoituksella
- `.distinct()` - Poista duplikaatit
- `.distinctBy(expr)` - Poista duplikaatit lausekkeen perusteella (esim. `$array.distinctBy("item.id")`)
- `.notNull()` - Poista null-arvot
- `.add(item)` - Lisää alkio (palauttaa uuden taulukon)
- `.contains(item)` - Tarkista, sisältääkö taulukko alkion (palauttaa totuusarvon)
- `.join(separator)` - Yhdistä taulukon alkiot merkkijonoksi
- `.filter(expr)` - Suodata taulukko käyttäen `item`-muuttujaa (esim. `$array.filter("item > 5")`)
- `.map(expr)` - Muunna jokainen alkio käyttäen `item`-muuttujaa (esim. `$array.map("item.name")`)
- `.sort(expr, order)` - Järjestä lausekkeen perusteella, järjestys on `"asc"` (oletus) tai `"desc"`
- `.take(n)` - Ota ensimmäiset N (positiivinen) tai viimeiset N (negatiivinen) alkiot
- `.length` - Taulukon pituus
- `.toString()` - Muunna JSON-merkkijonoksi

### Suodatus / Muunnos / Järjestäminen - esimerkkejä
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Objekti/Sanakirjametodit (object)
- `.get(key)` - Hae arvo avaimella (palauttaa null, jos ei löydy)
- `.get(key, default)` - Hae arvo avaimella oletusarvon kera
- `.keys()` - Palauta kaikki avaimet listana
- `.values()` - Palauta kaikki arvot listana
- `.entries()` - Palauta `{key, value}`-objektien lista (yksi per ominaisuus)
- `.filter(expr)` - Käy läpi `{key, value}`-parit ja palauta vastaavat merkinnät listana (käytä `item.key` / `item.value` lausekkeen sisällä)
- `.map(expr)` - Käy läpi `{key, value}`-parit ja palauta muunnetut arvot listana (käytä `item.key` / `item.value` lausekkeen sisällä)
- `.toString()` - Muunna JSON-merkkijonoksi

### Objektin iterointiesimerkkejä
Kun objektia iteroidaan `.map()`- tai `.filter()`-metodeilla, jokainen `item` on `{key, value}`-pari:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → ei-null-ominaisuuksien nimien lista

## Päivämäärä/Aika
- `$now` - Nykyinen päivämäärä ja aika
- `$now.format("YYYY-MM-DD")` - Muotoile päivämäärä/aika
- `$now.toISO()` / `.toDate()` / `.toTime()` - Muunna muotoja
- `$now.addDays(n)` / `.addHours(n)` - Päivämäärälaskenta
- `$Date("2024-01-15")` - Jäsennä päivämäärämerkkijono

## Numeeriset operaatiot
- Peruslaskutoimitukset: `+`, `-`, `*`, `/`, `%`
- Vertailut: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Loogiset operaattorit: `and`, `or`, `not`

## Totuusarvolausekkeet
Totuusarvoille kirjoitetaan lauseke suoraan (älä pakota `== true`):
- Väärin: `$nodeName.isValid == true`
- Oikein: `$nodeName.isValid`
- Kieltäminen: `not $nodeName.isValid`

## Säännöt & Sallittujen toimintojen lista (kriittistä)
### $-sijoituksen säännöt
- Itsenäinen lauseke alkaa yleensä `$`-merkillä.
- Mallimerkkijonot voivat sisältää useita `$viittauksia`.
- Metodiparametrit voivat sisältää sisäkkäisiä `$viittauksia`, kun halutaan välittää toisen lausekkeen tulos (dynaaminen avain tai sisäkkäinen resoluutio).
  - Kelvollinen: `$node.method(other.field)` — `other` selvitetään kontekstista kuten ylimmän tason tunniste (ei `$`-merkkiä argumentin sisällä).
  - Kelvollinen: `$node.method($other.field)` — sisäkkäinen `$` on tuettu evaluointidialogin esikatselussa ja ehtojen arvioinnissa.
  - Kelvollinen: `$array($a.x, $b.y)`
  - Automaattinen täydennys `.get(`-sulkeiden sisällä lisää **pelkkiä** `label.field`-polkuja (ei etuliitettä `$`), kuten `$array(...)` / `$notNull(...)` -sisällä.
- **Evaluointi-API (Suorita):** Jos lähetetty arvo on yksittäinen piste-polku **ilman** `$`-etuliitettä (esim. editorissa valittu teksti, kuten `execute.outputs.output.result.today`), taustajärjestelmä käsittelee sen samoin kuin `$execute.outputs.output.result.today`. Arvot, jotka sisältävät rivinvaihdon tai rivinsiirron trimmauksen jälkeen, eivät kirjoitu uudelleen (vältetään monirivisten payloadien monitulkintaisuus). Suosittelemme `$`-merkin käyttöä tallennetuissa workflow-kentissä; uudelleenkirjoitus on tarkoitettu pääasiassa tarkasteluun ja työkalujen käyttöön.
- Evaluointidialogin `Suorita`-tulos on lopullinen lähde siitä, kuinka konkreettinen lauseke ratkaistaan.

### Taulukkomerkkijonojen lainausmerkit
Kun luot taulukoita merkkijonoarvoilla, käytä AINA lainausmerkkejä:
- Oikein: `$array("hello", "world")`
- Väärin: `$array('hello', 'world')`

### KÄYTÄ VAIN NÄITÄ FUNKTIOITA (Sallittujen toimintojen lista)
Käytä VAIN:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumentoidut merkkijono-/taulukko-/objektimetodit

Jos funktiota ei ole lueteltu yllä, sitä ei ole olemassa.

### Taulukoiden / Sanakirjojen metodirajoitukset
- Taulukoissa voi KÄYTTÄÄ VAIN: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objekteissa/Sanakirjoissa voi KÄYTTÄÄ VAIN: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Varatut solmujen nimikkeet
Älä käytä seuraavia nimiä solmujen nimikkeinä: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Esimerkkejä

**Ehto**: `$input.text.length > 0`

**LLM-käyttäjäviesti**: `$input.text`

**Tulostusviesti**: `$llm.text`

**Muuttujan arvo**: `$input.count + 1`

### DSL-esimerkki

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Aiheeseen liittyvät

- [Lausekkeiden arviointidialogi](./expression-evaluation-dialog.md) – Laajennettava editori, jossa on taustalla toimiva esikatselu ja täydennys
- [Canvas-ominaisuudet](./canvas-features.md) – Dataneula lausekkeiden testaamiseen ilman solmujen uudelleenajoa
- [Solmutyypit](./node-types.md) – Lausekkeita käyttävät solmut ([LLM](../nodes/llm-node.md), [Ehto](../nodes/condition-node.md), [Tulostus](../nodes/output-node.md), [Asetus](../nodes/set-node.md) jne.)
- [Muistilappu](../nodes/sticky-note-node.md) – Canvasin Markdown-muistilaput, joissa on muokattava otsikko, väri ja kuvanäyttö
- [Agenttisolmu](../nodes/agent-node.md) – Lausekkeiden käyttö agenttien kehotteissa
- [Agentin pysyvä muisti](./agent-persistent-memory.md) – `persistentMemoryEnabled` ja `memoryShares` agentin `data`-kentissä (ei lausekekentissä)
- [Workflown rakenne](./workflow-structure.md) – Solmujen `data`-kentät, jotka hyväksyvät lausekkeita
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Solmujen viittaamat tunnistetiedot
- [Tunnistetietojen jakaminen](./credentials-sharing.md) – Jaa tunnistetiedot ja käytä `$credentials`-lausekkeita
- [Globaalit muuttujat](./global-variables.md) – Pysyvät muuttujat `$global`-avulla
