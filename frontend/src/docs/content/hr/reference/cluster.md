# Distribucija Opterećenja

Usmjerite drugu Heym instancu na istu PostgreSQL bazu podataka i ona se pridružuje kao radnik. Pozadinski workflow izvršavanja tada se dijele između instanci prema postotku koji postavite, tako da stroj koji opslužuje UI i API nije jedini stroj koji pokreće svaki workflow.

Instance nikada ne komuniciraju međusobno. Postgres nosi posao, tako da radnik ne treba otvoreni port, certifikat ili povratnu vezu na glavnu instancu — samo pristup bazi podataka.

## Uloge

Jedna instanca je **glavna**, označena varijablom okruženja. Ona opslužuje UI, API, MCP i chat portal, te posjeduje pohranu datoteka i instalirane dodatke. Svaka druga instanca je **radnik**: ona pristupa samo bazi podataka i izvršava pozadinske radnje.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # ili: worker
HEYM_INSTANCE_NAME=EU Main    # oznaka za prikaz, može se kasnije uređivati u Postavkama
HEYM_INSTANCE_ID=eu-main      # opcionalno; izvedeno iz imena kada je prazno
```

Glavna uloga je odvojena od izbora vođe. Heym već bira jednog vođu unutar klastera koji upravlja cron-om, evaluacijom upozorenja i oporavkom od pada; ako glavna instanca padne, vođstvo prelazi na radnika unutar nekoliko sekundi, a zakazani radovi nastavljaju se izvršavati. Glavna uloga se ne premješta, jer pohrana datoteka ne može ići s njom.

## Što može napustiti glavnu instancu

Smještaj se odlučuje prema čvorovima workflow-a prije nego što izvršavanje započne. Izvršavanje ostaje na glavnoj instanci kada bilo koji čvor u njemu — uključujući čvorove unutar pod-workflow-a koje poziva — dodirne nešto što postoji samo na jednom stroju:

| Čvor | Zašto ostaje na glavnoj instanci |
|---|---|
| Codex, OpenCode Go | Radno okruženje kodnog agenta ostaje na lokalnom disku kako bi se nastavilo kasnije |
| Agent s pridruženom vještinom | Kod vještine čita i piše u Heym Drive |
| Drive, Converter, Google Drive | Čitaju i pišu generirane datoteke |
| Okidač za prijenos datoteka | Prijenos se pohranjuje na disku glavne instance |
| Slanje e-pošte | Korporativni SMTP poslužitelji obično dopuštaju samo jednu izvoru adresu |
| Čvorovi dodataka | Dodatak je instaliran na disku jedne instance |

**Sve ostalo je distribuirano** — uključujući Code čvor, Playwright i Agent Python alate. Svaka instanca pokreće istu sliku sa svojim Docker priključkom, tako da sandbox nije razlog za zadržavanje izvršavanja na glavnoj instanci, a to su najviše CPU-intenzivni čvorovi u proizvodu.

Workflow čiji se pod-workflow bira izrazom ne može se unaprijed pregledati, pa ostaje na glavnoj instanci.

## Odabir postotaka

Težine su cijeli brojevi postavljeni pod **Postavke → Instance**. One su **dijelovi bilo kojih instanci koje trenutno mogu preuzeti posao**, a ne postotci od 100: planer dijeli prema ukupnom broju tog bazena.

Ta razlika postaje očita čim jedna instanca ispadne. Sa `Main 41, Worker A 26, Worker B 33`, isključivanje Radnika B ostavlja bazen od 67, tako da Glavna zapravo prima 41/67 = **61%**, a Radnik A 26/67 = **39%**. Panel ispisuje učinkovitu podjelu ispod tablice iz tog razloga, a spremanje nikada nije blokirano jer se brojevi ne zbrajaju na 100 — samo podjela gdje nijedna omogućena instanca nema težinu se odbija.

Još dvije stvari lako se mogu pogrešno shvatiti.

**Postotak nije udio strojnog kapaciteta.** Pokriva samo izvršavanja koja prolaze kroz red. Opsluživanje UI-a i API-a, streaming uređivača i portalnih izvršavanja, te rukovanje prijenosima datoteka su sve glavne zadaće i ništa od toga se ne računa. Glavna instanca radi više nego što njezin broj pokazuje.

**Postotak glavne instance je strop, a ne pod.** Izvršavanja koja se mogu izvršiti samo na glavnoj instanci terete njezinu kvotu, tako da kada se ta kvota potroši, preostala distribuirana izvršavanja padaju na radnike. Postavljanje niskog broja za glavnu instancu je sigurno — posao koji mora tamo raditi i dalje se izvršava. Postavljanje visokog broja osiromašuje radnike.

Dakle, s jakom glavnom instancom i manjim radnikom, započnite bliže 60/40 nego sirovom omjeru strojeva, a zatim usporedite stvarna trajanja izvršavanja na kartici Izvršavanja i prilagodite.

Težine se ponovo normaliziraju među instancama koje su trenutno aktivne i omogućene. Sa `main=70, A=15, B=15`, ako A isključi, podjela postaje 70/85 i 15/85 između glavne i B, a vraća se na 70/15/15 kada se A vrati.

**Instanca koja se vraća ne duguje izvršavanja koja je propustila.** Vrijeme provedeno Offline, Onemogućeno ili na neusklađenoj verziji ne računa se protiv nje, tako da radnik koji je proveo noć nedostupan ponovno se pridružuje trenutnoj poziciji bazena i podjela se ponovno prikazuje kao 70/30 od svog prvog izvršavanja — ne apsorbira svako izvršavanje dok se ne nadoknadi. Radnik koji je bio dostupan cijelo vrijeme i dalje se nadoknađuje, što čini postotak glavne instance stropom.

### Nova instanca pridružuje se s nulom

Instanca koja nikada nije dobila težinu započinje s 0, što bi je ostavilo Aktivnom, Omogućenom i bez primanja. **Automatski dodijelite udio novim instancama** — prema zadanim postavkama, ispod tablice instanci — rješava to: pri sljedećem prolazu vođe novopridošla instanca dobiva jednak udio bazena, a postojeće težine se smanjuju zadržavajući svoje omjere jedni prema drugima, tako da namjerno 70/30 i dalje izgleda otprilike 70/30 nakon toga. Ukupno ostaje točno 100.

To se odvija **jednom po instanci**. I automatski prolaz i Vaša vlastita izmjena označavaju instancu kao konfiguriranu, tako da instanca koju sami postavite nikada ne bude promijenjena bez Vašeg znanja — uključujući onu koju ste namjerno postavili na 0. Isključite postavku ako želite da svaka nova mašina čeka na Vas.

Samo omogućene, aktivne i kompatibilne instance sudjeluju. Dodjeljivanje udjela stroju koji ne može izvršiti ništa ostavilo bi taj udio bez koristi.
### Kada postotci ne mogu pomoći

Panel s postavkama izvještava koliko je od posljednjih 24 sata izvršavanja moglo biti izvršeno samo na glavnom čvoru. Ako je taj broj visok — opterećenje s puno Codexa ili Drivea — radnici će ostati neaktivni bez obzira na to što kažu težine, a rješenje je veći glavni čvor umjesto više njih.

## Određivanje veličine PostgreSQL za klaster

Veze se skaliraju s instancama, a ne samo s korisnicima. Svaka instanca pokreće nekoliko uvicorn procesa, a svaki proces drži bazu veza plus četiri `LISTEN` veze (otkazivanje, buđenje reda, rezultati izvršavanja, chat streamovi). Otvoreni chat streamovi dijele jednu chat vezu, tako da ne dodaju veze prema bazi podataka. Klaster s tri instance na zadanoj vrijednosti `max_connections = 100` brzo se ispuni, a Heym tada ne može doći do vlastite baze podataka.

Približno izračunajte `instances x processes x (async pool + sync pool + 4)` i postavite `max_connections` iznad toga.

Smanjite bazu veza umjesto da samo povećavate gornju granicu. Jedno implementiranje prema zadanim postavkama ima 10+20 asinkronih i 5+10 sinkronih veza po procesu, što je velikodušno za jednu mašinu, a previše za klaster:

| Varijabla | Jedna instanca | Klaster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Primjer compose datoteke postavlja te vrijednosti i `max_connections = 300`. To smanjuje gornju granicu klastera s dvije instance s 768 veza na 192, dok tri instance ostaju ispod 300.

## Zahtjevi koje klaster ne može nametnuti umjesto Vas

**Svaka instanca mora koristiti isti `SECRET_KEY` i `ENCRYPTION_KEY`.** Radnik s različitim `ENCRYPTION_KEY` ne može dešifrirati vjerodajnice, a svako izvršavanje koje koristi vjerodajnice završava greškom koja ne navodi ništa korisno. Heym uspoređuje sažetak oba ključa na svakom otkucaju srca, zajedno s verzijom aplikacije i revizijom baze podataka, i označava nesukladnu instancu kao **Mismatch** tako da ne prima nikakav rad. Opterećenje se vraća na glavni čvor dok to ne ispravite.

To također definira redoslijed nadogradnje. Prvo nadogradite glavni čvor, što označava svakog radnika kao nekompatibilnog; rad se vraća na glavni čvor, a svaki radnik se ponovno pridružuje kada se nadogradi. Sporije, vidljivo i reverzibilno.

**Usmjerite ulaz samo na glavni čvor.** Raspodjela korisničkog prometa među instancama poslala bi prijenos datoteka na jednu mašinu, a preuzimanje na drugu. Ništa u kodu ne sprječava ovo, jer radnik pokreće istu sliku i odgovara na svaki zahtjev koji primi.

**Svaka instanca treba `FRONTEND_URL`, postavljen na istu javnu adresu.** Izvršavanje koje se pauzira radi ljudske provjere generira svoj link za pregled na instanci koja ga je izvršila, a ne na glavnom čvoru, a isto vrijedi i za linkove za nastavak Codexa i za URL-ove preuzimanja generiranih datoteka. Radnik koji ostane bez njega gradi te linkove prema vlastitoj lokalnoj adresi, a tko god primi jedan ne može ga otvoriti.

**Radničke instance imaju drugačiji izlazni IP.** Svaka API koja dopušta popis izvora vidi novi IP. Slanje e-pošte radi na glavnom čvoru upravo iz ovog razloga; za HTTP čvor, ili dajte klasteru jednu NAT izlaznu adresu ili dopustite popis svake instance.

## Dodavanje radnika na drugoj mašini

`docker-compose.worker.yml` u korijenu repozitorija pokreće radnika na vlastitom hostu. Nema bazu podataka i nema UI: povezuje se s PostgreSQL glavnog čvora i preuzima svoj dio pozadinskih izvršavanja.

Ispunite `.env` pored njega - oznaku slike, host baze podataka i vjerodajnice, oba ključa i ID instance - i pokrenite ga. Compose odbija pokretanje dok nisu postavljene sve potrebne vrijednosti, umjesto da se pokrene s oznakom koja kasnije ne uspijeva na način koji je teško pročitati.

Oznaka slike mora biti verzija koju glavni čvor pokreće, a oba ključa moraju biti točno kopirana. Razlika u bilo kojem od njih prikazuje radnika kao Mismatch i ne prima nikakav rad.

## Čitanje tablice Instanci

| Stupac | Značenje |
|---|---|
| Ime | Uređivačka oznaka; otisnuta je na svakoj izvršavanju koju ova instanca izvršava |
| Uloga | `main` ili `worker`, iz okruženja |
| Status | **Živo** s novim otkucajem srca, **Offline** nakon 30 sekundi tišine, **Mismatch** kada se verzija, revizija baze podataka ili ključevi razlikuju od glavnog |
| ms | Vrijeme povratka od te instance do baze podataka, mjeri ga sama instanca |
| Uključeno | Uklonite radnika iz rotacije bez zaustavljanja — izvršavanja koja se trenutno odvijaju završavaju, a nova se ne dodjeljuju. Zaključano za glavni čvor: radovi s datotekama, dodacima i kodnim agentima odvijaju se tamo bez obzira na to što prekidač kaže |
| Težina | Njegov udio u distribuiranim izvršavanjima |

## Ograničenja istodobnosti u clusteru

[Ograničenje istodobnosti](./webhooks.md#concurrency-limit-and-queued-runs) workflowa broji se u PostgreSQL-u, pa vrijedi na svakoj instanci i svakom procesu: dvije instance nikada ne pokreću više izvođenja jednog workflowa nego što dopušta ograničenje. Izvođenje koje je čekalo na mjesto raspoređuje se prema istim pravilima kao i svako drugo izvođenje pri pokretanju, pa izvođenje koje mora ostati na main instanci to i dalje čini. Worker reda čekanja koji izvršava ova izvođenja sada se pokreće pri svakoj instalaciji, uključujući i pojedinačnu instancu, gdje preuzima samo izvođenja koja je u red stavila njegova vlastita instanca. To znači da pojedinačna instanca također drži vezu za buđenje reda `LISTEN` u svakom procesu, stoga planirajte njezine veze na isti način kao i za instancu cluster-a.

## Povijest izvršavanja

Svako izvršavanje u povijesti izvršavanja imenuje instancu koja ga je izvršila, a oba dijaloga povijesti mogu se filtrirati na jednu instancu. Filtriranje se podudara s ID-jem instance dok prikazuje njezino ime, tako da preimenovanje instance ne prepisuje ono što stari izvršavanja kažu.

Ništa od ovoga ne pojavljuje se na instalaciji s jednom instancom: polja su prazna, nijedna oznaka se ne prikazuje, a nijedna opcija filtriranja nije ponuđena.
## Ponašanje u slučaju neuspjeha

**Ako radnik umre tijekom izvršavanja**, njegov heartbeat postaje zastario, a postojeći oporavak vođe ponovo pokreće izvršavanje na aktivnom čvoru. Redak u redu koji je preuzeo se posebno povlači: kada ne postoji aktivno izvršavanje za njega i kada prođe dvominutna milost, vođa označava redak kao neuspješan i budi onoga tko je čekao na rezultat. Sama starost nikada nije okidač, tako da se legitimno dugo izvršavanje ostavlja na miru; redak se označava kao neuspješan umjesto da se ponovo stavlja u red, jer oporavak već preuzima ponovni rad, a ponovno stavljanje u red bi pokrenulo isti workflow dvaput.

**Ako glavni čvor padne**, cron nastavlja raditi s radnikom, a distribuirana izvršavanja se nastavljaju. Izvršavanja koja trebaju glavni čvor se redaju i čekaju, a ispražnjavaju se kada se vrati — ali samo unutar prozora milosti za pogrešno aktiviranje (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, 600 sekundi prema zadanim postavkama). Sve što je starije zatvara se kao propušteno, uz zabilježen razlog, umjesto da se odjednom ponovo pokreće sati zaostataka.

UI, API, MCP i uređivač nisu dostupni dok je glavni čvor nedostupan, jer su to ulazne točke.

## Povezano

- [Pokretanje i implementacija](../getting-started/running-and-deployment.md) – Prvo implementirajte jednu instancu; varijable okruženja i postavke ključeva nalaze se tamo
- [Postavke](./user-settings.md) – Kartica Instances i tko je može vidjeti
- [Izvršavanja](../tabs/traces-tab.md) – Usporedite stvarna trajanja izvršavanja između instanci prije nego što promijenite podjelu
- [Sigurnost](./security.md) – Zašto svaka instanca mora dijeliti `SECRET_KEY` i `ENCRYPTION_KEY`
