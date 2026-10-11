# Pogovor o Vrednotenju Izrazov

Pogovor o vrednotenju izrazov je razširjeni urejevalnik za polja, ki podpirajo izraze. Odpre se s klikom na gumb za širitev poleg vnosa izraza in vam ponudi večje delovno okolje, samodejno dopolnjevanje, v živo predogled v ozadju in brskanje po izhodu na enem mestu.

## Odpiranje pogovora

- Kliknite gumb za širitev poleg polja izraza v plošči lastnosti.
- Večvrstična polja prikazujejo gumb znotraj vnosa.
- Enovrstična polja prikazujejo gumb desno od vnosa.

## Postavitev pogovora

- Pogovor se odpre kot centrirana modalna okna, približno **80vw × 80vh**.
- Glava prikazuje **Vrednotenje — {ime polja}**, ko je oznaka polja znana.
- Urejevalnik ohranja samodejno dopolnjevanje, navigacijo med polji in običajne akcije **Uporabi** / **Prekliči**.
- Predogled se samodejno osveži približno **300 ms** po tem, ko prenehate tipkati.
- Pritisnite `Ctrl` / `Cmd` + `Enter`, da uporabite trenutni besedilo nazaj v polje in zaprete pogovor (enako kot **Uporabi**).

## Oddelek za izhod

Območje izhoda se samodejno osveži, ko prenehate tipkati v urejevalniku.

### Vrednotenje

| Tip izraza | Rezultat |
|---|---|
| Enotni `$expr` (celotno polje) | Naravna vrednost je ohranjena |
| Enotna gola pika (celotno polje, brez `$`, brez vgrajenega preloma vrstice) | Enako kot `$` + ta pot (ozadje normalizira za vrednotenje) |
| Besedilo z vgrajenimi `$refs` | Končni rezultat je vedno niz |
| Literarno besedilo (brez `$`, ne enotna pika) | Vrnjen kot je |

**Primeri**

| Vnos | Rezultat |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (enako kot `$input.items`, ko je celotna vrednost ta pot) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Kontekst vrednotenja se gradi v tem vrstnem redu:

- **Pripeta podatka** na zgornjih vozliščih
- **Izhodi zadnjega izvajanja** iz platna
- `null`, ko ni na voljo zgornjih podatkov

Če ima trenutno vozlišče zgornje odvisnosti, vendar nobeno od njih nima pripetih podatkov ali nedavnega rezultata izvajanja, pogovor najprej izvede testno izvajanje, da zgradi kontekst in nato vrednoti trenutni tekst.

### Izbirnik poti izhoda

Ko je rezultat ozadja objekt ali tabela, lahko območje izhoda prikaže interaktivni izbirnik poti namesto surovega JSON.

- Dvakrat kliknite vrstico, da dodate to pot trenutni referenci `$node.path`.
- Enkrat kliknite razširljive vrstice, da odprete ali zaprete veje.
- Uporabite vgrajeno iskalno polje za iskanje ključev, vrednosti in nizov poti.

## Samodejno dopolnjevanje

- Vtipkajte `$`, da odprete predloge za zgornja vozlišča, vgrajene funkcije in metode.
- Pritisnite `Tab` ali `Enter`, da vstavite izbrano predlog.
- Uporabite `↑` / `↓`, da se premikate po seznamu predlog.

### Primeri odgovorov

Ko nadaljujete s `$…` referenco z piko, vsaka vrstica predloga prikazuje odgovor, ki bi ga ta predlog proizvedel, v krepko pisavo na desni strani vrstice.

- Vtipkajte `$set.listItems.first().toString().u`, da prikažete `upper`, `urlEncode`, `urlDecode` in `unescape`, vsak z njegovim ocenjenim rezultatom — tako lahko izberete glede na izhod namesto po imenu.
- Vtipkajte `$node.text.toJson()`, da razčlenite JSON niz v objekt ali tabelo. Po `.toJson()` lahko samodejno dopolnjevanje ponudi razčlenjene ključe (na primer `repoUrl`), ko so na voljo izhodi zadnjega izvajanja ali pripeti podatki.
- Rezultati se ocenjujejo na ozadju glede na iste pripete podatke in izhode zadnjega izvajanja, ki jih uporablja predogled pogovora, tako da se ujemajo s tem, kar bo polje proizvedlo.
- Le predlogi, ki stojijo sami, se ocenjujejo: metode brez argumentov (`upper()`, `first()`, `keys()`, `toJson()`) in navadne lastnosti (`length`, `year`). Predlogi, ki potrebujejo argumente najprej — `map`, `filter`, `sort`, `replace` — ostanejo prazni.
- Vrstica ostane prazna, ko kandidat ne proizvede odgovora: napaka, `null` ali metoda, ki se ne uporablja za to vrednost.
- Odgovori so skrajšani na eno vrstico. Premaknite se nad skrajšanim odgovorom, da vidite več o njem.

## Gradnja z AI

Gumb **Gradnja z AI** se prikaže v zgornjem desnem kotu pogovora za vrednotenje, ko je delovni tok naložen. Odpre gnezdeno modalno okno, kjer lahko opišete izraz, ki ga želite, v navadnem besedilu, in omogočite LLM, da ga ustvari za vas.

### Kako deluje

1. Kliknite **Gradnja z AI** v orodni vrstici pogovora za vrednotenje.
2. Izberite poverilnico LLM in model iz spustnih menijev.
3. Vtipkajte opis v navadnem besedilu, kaj želite — na primer, *"Pridobite ime stranke iz odgovora API"*.
4. Kliknite **Ustvari**. Modalno okno pokliče ozadje, ki uporablja sistemski poziv [Expression DSL](./expression-dsl.md) plus izhode zadnjega izvajanja delovnega toka kot kontekst, in vrne en sam niz izraza.
5. Ustvarjeni izraz se takoj oceni glede na iste podatke platna, tako da lahko vidite rezultat, preden ga uporabite.
6. Kliknite **Uporabi**, da zamenjate vsebino urejevalnika z ustvarjenim izrazom, ali **Ponovno ustvari**, da poskusite znova.

### Uporabljen kontekst

Generator prejme izhode vozlišča iz zadnjega testnega izvajanja na platnu. Če delovni tok še ni bil izveden, LLM ustvari izraz po najboljših močeh na podlagi oznak vozlišč in konvencij DSL.

### Zahteve

- Poverilnica LLM (OpenAI, Google ali po meri) mora biti konfigurirana v zavihku [Poverilnice](./credentials.md).
- Delovni tok mora biti odprt v urejevalniku.

## Bližnjice na tipkovnici

| Bližnjica | Dejanje |
|---|---|
| Premor pri tipkanju (~300 ms) | Osveži predogled ozadja |
| `Ctrl` / `Cmd` + `Enter` | Uporabi in zapri pogovor |
| `Escape` | Najprej zaprite samodejno dopolnjevanje, sicer zaprite pogovor |
## Vloženi `$` v argumentih metod

Za ocenjevanje dialogov / ozadja lahko prenesete drugo referenco z vloženim `$` znotraj klicev, kot je `.get($other.field)`, kadar potrebujete dinamični ključ. Uporabite lahko tudi golo pot znotraj `.get(...)` (na primer `other.field`); ozadje to razreši na enak način. Shranjena polja delovnega toka morajo še vedno slediti pravilom [Expression DSL](./expression-dsl.md); API za vrednotenje prav tako sprejema polno linijsko golo piko pot za priročnost (glejte zgornjo tabelo).

## Navigacija

Urejevalniki za nastavitev in izvajanje preslikav lahko prikažejo gumbe **Prejšnji** / **Naslednji**, tako da se lahko premikate med polji, ne da bi zaprli dialog.

## Sorodno

- [Expression DSL](./expression-dsl.md)
- [Vrste vozlišč](./node-types.md)
- [Poverilnice](./credentials.md) — potrebne za funkcijo Gradnja z AI
- [LLM vozlišče](../nodes/llm-node.md)
- [Izhodno vozlišče](../nodes/output-node.md)
- [Pogojno vozlišče](../nodes/condition-node.md)
