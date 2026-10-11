# Dijalog za Evaluaciju Izraza

Dijalog za Evaluaciju Izraza je prošireni uređivač za polja koja podržavaju izraze. Otvara se pritiskom na gumb za proširenje pored ulaza za izraz i pruža vam veći radni prostor, automatsko dovršavanje, pregled uživo s backend-a i pregled izlaza na jednom mjestu.

## Otvaranje Dijaloga

- Kliknite na gumb za proširenje pored polja za izraz u panelu Svojstva.
- Višelinijska polja prikazuju gumb unutar ulaza.
- Jednolinijska polja prikazuju gumb desno od ulaza.

## Izgled Dijaloga

- Dijalog se otvara kao centrirani modal s dimenzijama otprilike **80vw × 80vh**.
- U zaglavlju se prikazuje **Evaluiraj — {naziv polja}** kada je oznaka polja poznata.
- Uređivač zadržava automatsko dovršavanje, navigaciju između polja i uobičajene akcije **Primijeni** / **Odustani**.
- Pregled se automatski osvježava otprilike **300 ms** nakon što prestanete tipkati.
- Pritisnite `Ctrl` / `Cmd` + `Enter` za primjenu trenutnog teksta natrag u polje i zatvaranje dijaloga (isto kao **Primijeni**).

## Odjeljak Izlaza

Područje Izlaza se automatski osvježava nakon što prestanete tipkati u uređivaču.

### Evaluacija

| Tip izraza | Rezultat |
|---|---|
| Jedan `$expr` (cijelo polje) | Izvorna vrijednost se čuva |
| Jednostavna točka (cijelo polje, bez `$`, bez umetnute nove linije) | Isto kao `$` + ta putanja (backend normalizira za evaluaciju) |
| Tekst s umetnutim `$refs` | Konačni rezultat je uvijek string |
| Literarni tekst (bez `$`, ne jednostavna točka) | Vraća se onakav kakav jest |

**Primjeri**

| Ulaz | Rezultat |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (isto kao `$input.items` kada je cijela vrijednost ova putanja) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Kontekst evaluacije se gradi u ovom redoslijedu:

- **Pinirani podaci** na uzvodnim čvorovima
- **Izlazi posljednjeg izvođenja** s platna
- `null` kada nema dostupnih uzvodnih podataka

Ako trenutni čvor ima uzvodne ovisnosti, ali nijedna od njih nema pinirane podatke ili nedavni rezultat izvođenja, dijalog prvo izvodi testno izvođenje kako bi izgradio kontekst, a zatim evaluira trenutni tekst.

### Odabir Putanje Izlaza

Kada je rezultat backend-a objekt ili niz, područje Izlaza može prikazati interaktivni odabir putanje umjesto sirovog JSON-a.

- Dvaput kliknite na redak kako biste dodali tu putanju trenutnom `$node.path` referencu.
- Jednostruko kliknite na proširive retke kako biste otvorili ili zatvorili grane.
- Koristite ugrađeni okvir za pretraživanje za pretraživanje ključeva, vrijednosti i putanjskih nizova.

## Automatsko Dovršavanje

- Upisujte `$` kako biste otvorili prijedloge za uzvodne čvorove, ugrađene funkcije i metode.
- Pritisnite `Tab` ili `Enter` za umetanje odabranog prijedloga.
- Koristite `↑` / `↓` za kretanje kroz popis prijedloga.

### Primjeri Odgovora

Kada nastavite `$…` referencu s točkom, svaki redak prijedloga prikazuje odgovor koji bi taj prijedlog proizveo, podebljano s desne strane retka.

- Upisivanje `$set.listItems.first().toString().u` prikazuje `upper`, `urlEncode`, `urlDecode` i `unescape`, svaki s rezultatom evaluacije — tako da možete odabrati prema ishodu umjesto prema imenu.
- Upisivanje `$node.text.toJson()` parsira JSON string u objekt ili niz. Nakon `.toJson()`, automatsko dovršavanje može ponuditi analizirane ključeve (na primjer `repoUrl`) kada su dostupni izlazi posljednjeg izvođenja ili pinirani izlazi.
- Rezultati se evaluiraju na backend-u protiv istih piniranih podataka i izlaza posljednjeg izvođenja koje pregled dijaloga koristi, tako da se podudaraju s onim što će polje proizvesti.
- Samo prijedlozi koji stoje sami se evaluiraju: metode bez argumenata (`upper()`, `first()`, `keys()`, `toJson()`) i obična svojstva (`length`, `year`). Prijedlozi koji trebaju argumente prvo — `map`, `filter`, `sort`, `replace` — ostavljaju se prazni.
- Redak ostaje prazan kada kandidat ne proizvodi odgovor: grešku, `null` ili metodu koja se ne može primijeniti na tu vrijednost.
- Odgovori su skraćeni na jedan redak. Pređite mišem preko skraćenog odgovora kako biste vidjeli više od njega.

## Izgradnja s AI

Gumb **Izgradi s AI** pojavljuje se u gornjem desnom kutu dijaloga za evaluaciju kada je workflow učitan. Otvara ugniježdeni modal gdje možete opisati izraz koji želite u običnom tekstu i imati LLM da ga generira za Vas.

### Kako to funkcionira

1. Kliknite **Izgradi s AI** u alatnoj traci dijaloga za evaluaciju.
2. Odaberite LLM vjerodajnicu i model iz padajućih izbornika.
3. Upisujte opis u običnom tekstu onoga što želite — na primjer, *"Dohvati ime kupca iz API odgovora"*.
4. Kliknite **Generiraj**. Modal poziva backend, koji koristi [Expression DSL](./expression-dsl.md) sistemski prompt plus izlaze posljednjeg izvođenja Vašeg workflow-a kao kontekst, i vraća jedan izraz kao string.
5. Generirani izraz se odmah evaluira protiv istih podataka s platna kako biste mogli vidjeti rezultat prije primjene.
6. Kliknite **Primijeni** kako biste zamijenili sadržaj uređivača generiranim izrazom, ili **Ponovno generiraj** kako biste pokušali ponovno.

### Korišteni Kontekst

Generator prima izlaze čvora iz posljednjeg testnog izvođenja na platnu. Ako workflow još nije bio pokrenut, LLM generira izraz temeljen na oznakama čvorova i DSL konvencijama.

### Zahtjevi

- LLM vjerodajnica (OpenAI, Google ili Prilagođeno) mora biti konfigurirana u [Vjerodajnicama](./credentials.md) kartici.
- Workflow mora biti otvoren u uređivaču.

## Prečaci na Tipkovnici

| Prečac | Akcija |
|---|---|
| Pauza u tipkanju (~300 ms) | Osvježi pregled backend-a |
| `Ctrl` / `Cmd` + `Enter` | Primijeni i zatvori dijalog |
| `Escape` | Prvo zatvori automatsko dovršavanje, inače zatvori dijalog |
## Ugniježđeni `$` u argumentima metoda

Za dijalog / evaluaciju na backendu, možete proslijediti drugu referencu s ugniježđenim `$` unutar poziva kao što je `.get($other.field)` kada vam je potreban dinamički ključ. Također možete koristiti golu putanju unutar `.get(...)` (na primjer `other.field`); backend to rješava na isti način. Spremna polja workflow-a trebala bi i dalje slijediti pravila [Expression DSL](./expression-dsl.md); evaluate API također prihvaća punu golu točku putanju radi praktičnosti (vidi tablicu iznad).

## Navigacija

Uređivači za postavljanje i izvršavanje mapiranja mogu prikazivati gumbe **Prev** / **Next** kako biste mogli prelaziti između polja bez zatvaranja dijaloga.

## Povezano

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Vjerodajnice](./credentials.md) — potrebne za značajku Build with AI
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
