# Tablica podataka

Značajka **Tablica podataka** omogućuje vam stvaranje i upravljanje strukturiranim tablicama podataka izravno u Heym-u. Tablice se mogu koristiti u workflows putem [DataTable čvora](../nodes/datatable-node.md) za programatske CRUD operacije.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Pogledajte DataTable demonstraciju</a></p>

## Stvaranje tablice

1. Idite na karticu Tablica podataka s nadzorne ploče
2. Kliknite **Stvori Tablicu podataka**
3. Unesite naziv i opcionalni opis
4. Dodajte stupce pomoću uređivača stupaca

## Stupci

Svaki stupac ima:

| Svojstvo | Opis |
|----------|-------------|
| Naziv | Prikazni naziv stupca |
| Tip | `string`, `number`, `boolean`, `date` ili `json` |
| Obavezno | Mora li nova redak uključivati ovaj stupac |
| Jedinstveno | Moraju li vrijednosti biti jedinstvene među redovima |
| Zadana vrijednost | Automatski se popunjava kada redak izostavi ovaj stupac |

Dodajte, uredite ili uklonite stupce iz zaglavlja prikaza detalja tablice.

## Generiranje stupaca pomoću AI

Umjesto da dodajete stupce ručno, možete opisati tablicu na jednostavnom jeziku (ili zalijepiti uzorak JSON-a) i dopustiti LLM-u da predloži shemu. Oba ulaza otvaraju isti dijalog:

- **Generiraj s AI** (zaglavlje popisa Tablica podataka) — stvara potpuno novu tablicu prema vašem opisu.
- **AI stupci** (prikaz detalja tablice, pored kontrola stupaca) — predlaže *nove* stupce za dodavanje u otvorenu tablicu.

### Kako to funkcionira

1. Odaberite **LLM vjerodajnicu** i **model** (zadano na vašu prvu LLM vjerodajnicu i njen najnoviji model).
2. Upisujte opis — na primjer *"Tablica knjiga s naslovom, autorom, brojem stranica i informacijom o tome jesam li je pročitao"* — ili zalijepite uzorak/shema JSON-a.
3. Kliknite **Generiraj**. Model vraća predloženu shemu.
4. Pregledajte generirane stupce u uređivom obliku: promijenite **naziv**, **tip**, **zadano**, **jedinstveno** i **ne prazno** (obavezno) za svaki, izbrišite neželjene stupce ili **Dodajte stupac** ručno. Za novu tablicu također možete urediti AI-predloženi **naziv** i **opis**.
5. Kliknite **Stvori tablicu** (nova tablica) ili **Dodaj stupce** (postojeća tablica) za spremanje. Pritisnite **Esc** za zatvaranje dijaloga u bilo kojem trenutku.

### Samo dodavanje za postojeće tablice

Kada generirate stupce za postojeću tablicu, model vidi vaše trenutne stupce kao kontekst i predlaže **samo nove** stupce. Postojeći stupci i njihovi podaci nikada se ne mijenjaju ili uklanjaju — generirani stupci se dodaju. Duplikati naziva (neovisno o velikim i malim slovima) automatski se uklanjaju.

> LLM vjerodajnica (OpenAI, Google ili prilagođena) je obavezna. Ako je nemate, prvo je dodajte u Postavkama.

## Upravljanje redovima

- **Dodaj red**: Kliknite gumb za dodavanje kako biste stvorili novi red
- **Uređivanje u retku**: Dvaput kliknite na bilo koju ćeliju da biste uredili njezinu vrijednost. Pritisnite Enter ili kliknite izvan da biste spremili, Escape za otkazivanje
- **Izbriši red**: Koristite izbornik akcija reda za uklanjanje reda
- **Paginaranje**: Redovi se prikazuju po 25 po stranici s navigacijom stranica

## CSV Uvoz/Izvoz

### Uvoz
1. Kliknite **Uvezi CSV** u prikazu detalja tablice
2. Odaberite CSV datoteku za prijenos
3. Pregledajte prvih 5 redova i mapiranje stupaca
4. Zeleni stupci su usklađeni s postojećim stupcima tablice; žuti su neusklađeni
5. Kliknite Uvezi za masovno umetanje redova

### Izvoz
Kliknite **Izvezi CSV** za preuzimanje svih redova kao CSV datoteke.

## Dijeljenje

Dijelite tablice s drugim korisnicima ili timovima:

1. Otvorite dijalog za dijeljenje iz prikaza detalja tablice
2. Dodajte korisnike putem e-pošte s **čitanje** ili **pisanje** dozvolom
3. Dodajte timove s **čitanje** ili **pisanje** dozvolom
4. Korisnici s pravom samo za čitanje mogu pregledavati podatke; korisnici s pravom pisanja mogu mijenjati retke i stupce. Preimenovanje tablice, promjena njezinog opisa i upravljanje dijeljenjem ostaju rezervirani samo za vlasnika.

## Stvaranje tablica putem AI asistenta

[AI asistent](../reference/ai-assistant.md#data-tables) na platnu, [Chat](./chat-tab.md) i alat `heym_chat` na [kartici MCP](./mcp-tab.md) mogu odabrati jednu od vaših tablica za workflow koji grade ili stvoriti novu. Predlažu naziv i stupce te stvaraju tablicu kada pošaljete karticu s pitanjima. Asistent na platnu konfigurira čvorove workflowa iz metapodataka tablice. Chat i `heym_chat` također mogu pregledavati retke, dodavati ili uklanjati stupce te izravno umetati, ažurirati ili brisati retke. Navedite im naziv tablice ili poveznicu ove kartice. Pisanje zahtijeva vlasništvo ili izravan/timski pristup za **pisanje**. Dodavanje stupaca zadržava postojeće podatke; uklanjanje stupaca briše njihove vrijednosti iz svakog retka. Uklanjanje stupaca i brisanje svih redaka traže potvrdu, jednako kao na ovoj kartici.

## Korištenje u Workflows

[DataTable čvor](../nodes/datatable-node.md) povezuje tablice s workflows. Operacije uključuju find, getAll, getById, insert, update, remove i upsert. Nema potrebnih vjerodajnica.

## LLM Troškovna tablica (sustavna tablica)

Fiksna sekcija **Sustavne tablice** pojavljuje se iznad vaših tablica koje ste stvorili s jednim unosom: **LLM Troškovna tablica**. Ovo je fiksna shema, per-user uređivačka verzija cijena po modelu korištenih u [Izvršavanjima](./traces-tab.md) troškovnim grafikonima.

### Odakle dolaze podaci

Heym održava globalnu tablicu cijena po modelu koja se temelji na javnom cjeniku Helicone-a (`https://www.helicone.ai/api/llm-costs`). Sinhronizacija se odvija u pozadini prvi put kada otvorite tablicu ili Izvršavanja i ograničena je na jedno preuzimanje svakih 24 sata. Pritisnite **Osvježi** za prisilnu trenutnu ponovnu sinhronizaciju. Uklanjanja iz Helicone-a s gornjeg popisa ne brišu se lokalno, tako da povijesne pretrage troškova ostaju stabilne.

### Shema (stupci samo za čitanje)

| Stupac | Značenje |
|---|---|
| Pružatelj | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informativno, koristi Helicone) |
| Model | Identifikator modela usklađen s `trace.model` |
| Op | Operator usklađivanja: `equals`, `startsWith` ili `includes` |
| Ulaz $/1M | USD po 1 milijun prompt tokena |
| Izlaz $/1M | USD po 1 milijun completion tokena |
| Izvor | `helicone`, `seed` ili `user` |
### Prilagodba cijena

- **Uredite redak** kako biste nadjačali njegove cijene. Vaše nadjačavanje je po korisniku i označeno je oznakom `Customized`; buduće sinkronizacije s Helicone-om ga neće promijeniti.
- **Poništi na zadano** uklanja nadjačavanje i vraća globalnu vrijednost za taj redak.
- **Dodaj prilagođeni model** otvara dijalog za kreiranje reda koji je samo za korisnika (na primjer, privatni fino podešeni model koji Helicone ne navodi). Prilagođeni redovi su označeni kao `User added`, a brisanjem se potpuno uklanjaju.

### Usporedba s izvršavanjima

Kada nadzorna ploča Izvršavanja izračunava trošak, uspoređuje svaki `trace.model` s:

1. Vašim nadjačavanjima (točna podudarnost po imenu modela) prvo
2. Inače, s globalnom tablicom — `equals` točna podudarnost ima prioritet nad `startsWith`/`includes`; izjednačenja unutar istog operatora rješavaju se prema najdužem odgovarajućem prefiksu/podstringu modela

Ako nijedan redak ne odgovara, model se navodi pod obavijesti **Unpriced models** na stranici Izvršavanja; njegov doprinos trošku je nula dok ne dodate prilagođeni redak ili ne nadjačate jedan.

## Povezano

- [DataTable Node](../nodes/datatable-node.md) - Referenca za čvorove radnog toka
- [Traces Tab](./traces-tab.md) - Koristi LLM Cost Table za trošak donut i KPI kartice
- [Grist Node](../nodes/grist-node.md) - Alternativa vanjskom proračunu
- [Variables Tab](./global-variables-tab.md) - Alternativa za pohranu ključ-vrijednost