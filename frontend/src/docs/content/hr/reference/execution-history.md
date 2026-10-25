# Povijest Izvršavanja

Povijest izvršavanja bilježi pokretanja workflow-a: ulaze, izlaze, rezultate čvorova, status i izvor okidača. Koristite je za praćenje aktivnog produkcijskog pokretanja, inspekciju prošlih pokretanja, otklanjanje grešaka ili ponovno pokretanje s istim ulazima putem **Donesi na Platno**.

## Pregled

Svako izvršavanje pohranjuje:

| Polje | Opis |
|-------|-------------|
| **Ulazi** | Tijelo zahtjeva ili ulazi za pokretanje (npr. `text` za Input čvor) |
| **Izlazi** | Izlazi na razini workflow-a |
| **Rezultati čvorova** | Izlazi po čvorovima, status i vrijeme izvršavanja |
| **Status** | `success`, `error`, `pending`, `skipped` ili `failed` (vidi [Obnova nakon pada](#crash-recovery)) |
| **trigger_source** | Kako je pokretanje inicirano (vidi [Okidači](./triggers.md)) |

## Pristup Povijesti

| Lokacija | Opseg |
|----------|-------|
| **Editor** alatna traka | Samo trenutni workflow |
| **Docs** prikaz zaglavlja | Samo trenutni workflow |
| **Dashboard** zaglavlje (Chat kartica) | Svi workflow-i + chat/asistent pokretanja |
| **Evals** prikaz zaglavlja | Svi workflow-i + chat/asistent pokretanja |

Kliknite na gumb **Povijest** (ikona sata) za otvaranje dijaloga.

## Povijest po workflow-u vs. Sve Povijesti

- **Po workflow-u** (Editor, Docs): Prikazuje pokretanja za workflow koji imate otvoren. Koristite **Obriši povijest** za uklanjanje pokretanja samo za taj workflow.
- **Sve Povijesti** (Dashboard, Evals): Prikazuje pokretanja kroz sve workflow-e i chat/asistent sesije. Pokrivenost odgovara pristupu workflow-ima: workflow-i koje posjedujete, workflow-i koje su s Vama izravno dijeljeni i workflow-i koje dijelite s timom kojem pripadate. Koristite **Obriši svu povijest** za uklanjanje svih zapisa koje posjedujete. Povijest za dijeljene workflow-e bit će zadržana.

## Donesi na Platno

**Donesi na Platno** učitava ulaze i izlaze čvorova odabranog pokretanja u trenutni workflow.

### Što se učitava

- **Ulazi** → Panel ulaza za pokretanje (npr. `text` za Input čvor, ili prilagođena polja)
- **Rezultati čvorova** → Panel rezultata izvršavanja prikazuje prošle izlaze po čvorovima
- **Rezultat izvršavanja** → Status, izlazi i vrijeme iz pokretanja

### Ponašanje po kontekstu

- **U Editoru** (povijest po workflow-u): Odmah se primjenjuje na otvoreni workflow i zatvara dijalog.
- **Iz Sve Povijesti** (Dashboard/Evals): Navigira do uređivača workflow-a, zatim primjenjuje podatke kada se uređivač učita. Dostupno samo za pokretanja workflow-a — ne za chat/asistent pokretanja.

### Duboka poveznica izvršavanja

Otvaranje workflow-a na `/workflows/{workflowId}/{executionId}` automatski donosi to izvršavanje na platno — isto kao odabir pokretanja i odabir **Donesi na Platno**. Ovo čini određeno prošlo pokretanje dijeljivim kao URL. Ako se izvršavanje ne može pronaći (pogrešan ili izbrisan id), uređivač se vraća na učitavanje običnog workflow-a.

### Primjeri korištenja

- Ponovno pokretanje workflow-a s istim ulazima
- Otklanjanje grešaka u neuspješnom pokretanju inspekcijom ulaza i izlaza čvorova
- Usporedba izlaza između pokretanja

## Pitaj AI

Oba dijaloška okvira povijesti imaju gumb **Pitaj AI** (ikona iskre) pored naslova. Otvara [karticu Chat](../tabs/chat-tab.md#asking-about-a-run) u novom razgovoru s priloženim workflowom i odabranim izvođenjem kao uklonjivim čipovima. Pitajte zašto je izvođenje bilo sporo, što nije uspjelo ili zatražite od Chata da popravi workflow. Chat čita točno to izvođenje, uključujući trag po čvorovima i pogreške.

U dijaloškom okviru All History **Pitaj AI** se prikazuje samo kada je odabrano izvođenje workflowa; izvođenja chata i pomoćnika ga ne prikazuju.

## Vremenska traka izvođenja

U pojedinostima izvođenja gumb **Vremenska traka** (ikona štoperice) pored **Proširi sve** zamjenjuje popis **Koraci** vremenskom trakom raspona. Dok je vremenska traka prikazana, isti gumb nosi naziv **Zapisnici**; kliknite ga za povratak na popis. U All History gumb se prikazuje samo za izvođenja workflowa. Vremenska traka crta traku po čvoru u trenutku kada je započeo, tako da vidite koji je čvor koliko trajao i koji su se izvodili paralelno. Prijeđite mišem preko trake za trajanje; kliknite je da biste otvorili isti inspektor pojedinosti kao [vremenska traka izvođenja](#execution-timeline-details) u uređivaču. Odabrani prikaz ostaje aktivan dok je dijalog otvoren.

Izvođenja zabilježena prije pohranjivanja početnih vremena čvorova raspoređena su jedno za drugim prema trajanju.

## Istaknuti Izvršavanje

Nakon aktivnog pokretanja — ili nakon **Donesi na Platno** — pojavljuje se odjavna **Istaknuta izvršavanja** skočna obavijest u **gornjem desnom kutu Platna**. To je brz način da se vidi *što je svaki čvor proizveo*, navedeno od vrha prema dnu u redoslijedu izvršavanja. Zatvorite ga s **✕**; ponovno se otvara pri sljedećem pokretanju.

### Što se prikazuje

| Zapis | Izvor | Automatski? |
|--------|--------|-------|
| **Ulaz** | Ulazni parametri pokretanja (ulazni/okidač čvor) | Da |
| **Izlaz** | Rezultat izlaznog čvora — ili, ako ga nema, poruka posljednjeg čvora | Da |
| **Agent / LLM** | Izlaz svakog agenta ili LLM čvora | Da |
| **Izlaz** | Bilo koji drugi čvor s omogućenom **Istakni izlaz čvora** | Opcionalno |

Čvorovi koji su već automatski istaknuti (ulaz / izlaz / posljednji / agent / llm) nikada se ne pojavljuju dvaput, čak i ako također omogućite prekidač.

### Svaki zapis

- Prikazuje `Čvor — poruka…` s prvih **250 znakova**; kliknite na redak za proširenje i prikaz **cijele poruke kao Markdown**, s gumbom **Kopiraj**.
- Čvor koji se izvršio više puta (npr. unutar petlje) prikazuje `Čvor (N)` s odabirnikom `‹ i / N ›` — odaberite koje pokretanje želite vidjeti; odabirnik svakog čvora je neovisan.

### Istakni izlaz čvora

Svaki čvor **osim Agenta i LLM** ima okvir za potvrdu **Istakni izlaz čvora** u svom panelu svojstava (zadano isključeno). Omogućite ga za dodavanje izlaza tog čvora u skočnu obavijest. Mala ✦ oznaka pojavljuje se na istaknutim čvorovima na platnu. U [workflow DSL](./expression-dsl.md) ovo je polje podataka čvora `"highlight": true` (zadano `false`).

### Na nadzornim pločama

Kartice widgeta na nadzornoj ploči koje su pokrenule workflow prikazuju ✦ gumb **Istaknuta izvršavanja** u zaglavlju kartice; kliknite ga za otvaranje iste skočne obavijesti za to pokretanje widgeta, s prikazanim izlazom widgeta kao istaknutim zapisom.
## Pokretanje Izvršavanja

Oba dijaloga povijesti prikazuju **trenutno pokrenuta izvršavanja** na vrhu popisa, prije prošlih izvršavanja.

- Pojavljuje se indikator koji se vrti i oznaka **Pokrenuto** s vremenom početka
- Kliknite **Otvorite uživo** kako biste povezali uređivač s tim točnim izvršavanjem bez ponovnog pokretanja
- Platno prvo obnavlja čvorove koji su već završili, a zatim prima
  `node_start`, `node_complete` i konačne događaje izvršavanja putem SSE
- Trenutni čvor pulsira na platnu, čvorovi nizvodno zadržavaju svoju animaciju čekanja, a
  Debug panel dodaje svaki rezultat kako dolazi—baš kao što je to slučaj s izvršavanjem pokrenutim iz uređivača
- Kliknite **Otkaži** kako biste odmah zaustavili izvršavanje
- Otkažemo li iz bilo kojeg dijaloga (Uređivač ili Nadzorna ploča), također se zatvara aktivni SSE stream u bilo kojoj otvorenoj kartici platna za taj workflow, tako da se stanje uređivača čisto resetira
- Nakon otkazivanja, pokrenuti unos nestaje pri sljedećem osvježavanju; pritisnite **Osvježi** kako biste ručno ažurirali popis
- Ako otkažete izvršavanje koje je već završeno, zahtjev je bez učinka

Pokretanja koja čekaju na [slot istovremenosti](./webhooks.md#concurrency-limit-and-queued-runs) navedena su u istom odjeljku s oznakom **Queued 2/5**, svojim mjestom u redu i veličinom reda čekanja. Nemaju gumb **Open live** jer se još ništa ne izvodi; **Cancel** uklanja pokretanje na čekanju iz reda i bilježi ga kao `cancelled`. Pokretanje koje je čekalo dulje od maksimalnog vremena čekanja workflowa bilježi se kao `expired`, a pokretanje odbijeno zbog punog reda kao `queue_full`; oba imaju vlastitu značku na popisu pokretanja.

Živa URL adresa je `/workflows/{workflowId}/{executionId}`. Promatrač je samo za čitanje: napuštanjem
uređivača samo se prekida ta kartica preglednika i nikada ne zaustavlja workflow. Aktivne snimke
dijele se putem PostgreSQL-a, tako da otvaranje izvršavanja i dalje funkcionira kada zahtjevi za trigger i uređivač dođu na različite backend radnike.

## Oporavak od Rušenja

Ako se poslužitelj ponovno pokrene (implementacija, ponovno pokretanje kontejnera ili rušenje) dok je workflow u tijeku, radnik tog izvršavanja prestaje s radom usred izvršavanja. Heym automatski oporavlja ova prekinuta izvršavanja umjesto da ih ostavlja zaglavljenima kao **Pokrenuto**.

- Pri sljedećem pokretanju, izabrani vođa procesa otkriva napuštena izvršavanja — odmah za uredno ponovno pokretanje, ili unutar ~60 sekundi za teško rušenje (jednom kada otkucaji jasno prestanu).
- Oporavljena izvršavanja se **ponovno pokreću od nule s istim ulazima** (ne nastavljaju se od mjesta na kojem su stala), koristeći trenutnu definiciju workflow-a. Po završetku bilježe normalan terminalni unos (npr. `success`), tako da povijest prikazuje izvršavanje kao završeno.
- Izvršavanje se ponavlja **jednom**. Ako je pokušaj oporavka također prekinut — ili je workflow od tada izbrisan — unos se bilježi kao `failed`.
- Ovo funkcionira isto u okviru jednog kontejnera i višeradničkih implementacija; samo vođa provodi oporavak, tako da se izvršavanje nikada ne oporavlja dvaput od strane različitih radnika.

### Prekidač za automatski oporavak

Panel **Izvršni dnevnik** (izvršavanje) uređivača ima okvir za **Automatski oporavak**, **uključen prema zadanim postavkama** za svaki workflow.

- **Uključeno**: prekinuta izvršavanja ovog workflow-a ponovno se pokreću kao što je opisano iznad.
- **Isključeno**: prekinuta izvršavanja se ne ponovo pokreću i bilježe se s statusom `skipped`.

> Izvršavanja pod-workflow-a ne oporavljaju se neovisno — ponovno ih pokreće njihovo oporavljeno roditeljsko izvršavanje. Triggers s vlastitim ponovnim isporukama (RabbitMQ, raspoređeno/cron, IMAP) također mogu ponovo isporučiti pri ponovnom pokretanju, tako da se oporavljeno izvršavanje ponekad može izvršiti dvaput.

## Na čekanju za Ljudsku Recenziju

Izvršavanja koja se pauziraju radi odobrenja [Human-in-the-Loop](./human-in-the-loop.md) odmah se upisuju u povijest s statusom `pending`.

- Čvor agenta na čekanju pohranjuje payload recenzije koji uključuje `reviewUrl`, `draftText` i `expiresAt`
- Bilo koji čvorovi povezani s agentovim `review` rukovanjem također mogu raditi prije nego što čovjek odgovori, a njihovi rezultati čvora pohranjuju se u istom unosu povijesti na čekanju
- Dijalogi povijesti prikazuju poveznicu za recenziju kako bi vlasnici mogli kopirati ili otvoriti
- Dijalogi povijesti i Debug panel uređivača prikazuju konačnu ljudsku odluku nakon što se izvršavanje nastavi
- Kada recenzent prihvati, uređuje ili odbije nacrt, isti unos povijesti se ažurira s konačnim rezultatom izvršavanja
- Ako se isto izvršavanje pauzira za HITL više od jednom, unos povijesti ostaje isti dok svaki kontrolni točka dobiva svoju jedinstvenu poveznicu za recenziju

Ovo je posebno korisno za portalna izvršavanja i dugotrajne workflow-e koji mogu čekati sate ili dane prije nego što nastave.

## Kopiraj

Koristite **Kopiraj** pored Ulaza ili Izlaza kako biste kopirali JSON u međuspremnik.

## Očisti Povijest

- **Po workflow-u**: U dijalogu povijesti Uređivača, kliknite **Očisti povijest** kako biste uklonili izvršavanja za trenutni workflow.
- **Cijela Povijest**: U dijalogu povijesti Nadzorne ploče/Evals, kliknite **Očisti svu povijest** kako biste uklonili sve zapise izvršavanja koje posjedujete. Izvršavanja iz dijeljenih workflow-a se zadržavaju. Ova radnja se ne može poništiti.

## Detalji vremenske linije izvršavanja

Kada je **Izvršni dnevnik** uređivača otvoren, kliknite gumb tajmera kako biste prikazali vremensku liniju izvršavanja. Odaberite raspon kako biste otvorili inspektor detalja koji preuzima područje redaka. Prikazuje status odabranog koraka, trajanje, broj pokušaja, informacije o ponovnom pokušaju, pogreške, ID traganja i sažeti pregled izlaza. Objektni i nizni izlazi koriste isti `JsonTree` preglednik kao i ostatak Debug panela; skalarne vrijednosti koriste tekstualni pregled. Kada korak generira slike (snimke zaslona Playwrighta, generirane slike, slikovne datoteke ili base64 slike u tijelu zahtjeva, pronađene bilo gdje u izlazu), one se pojavljuju kao sličice iznad izlaza, a JSON prikazuje kratki zamjenski tekst umjesto sirovog base64. Kliknite sličicu kako biste je otvorili u lightboxu; tipke sa strelicama ili tipke ←/→ prelaze kroz svaku sliku u izvršavanju, s brojačem poput `2 / 5`. Koristite **Otvorite trag** za LLM i Agent raspona kada je ID traga dostupan.
## Detalji mobilnog čvora

Na telefonu, uređivač prikazuje drvo workflow-a na cijelom ekranu umjesto slobodnog platna. Dodirnite čvor u drvetu s zabilježenim rezultatom kako biste otvorili njegovo izvršavanje kao detalj na cijelom ekranu. Prikaz nudi odvojene kartice **Ulazni podaci**, **Izlazni podaci** i **Pogreške**. Kartica izlaza prikazuje zabilježeni rezultat i nudi opciju **Kopiraj izlaz**; kartica ulaza prikazuje konfiguraciju odabranog čvora, a kartica pogrešaka prikazuje zabilježenu pogrešku kada je čvor zakazao. Koristite **Natrag na workflow** ili gumb za zatvaranje kako biste se vratili na drvo.

Dijalozi povijesti platna i nadzorne ploče zadržavaju svoje kontrole izvođenja u jednom redu i postavljaju dostupne oznake i instance filtre u responzivnu mrežu. Njihovi izbornici filtara koriste isti odabir unutar aplikacije, tako da odabrani kvačica ima dosljedan razmak i osnovnu liniju s svakom oznakom opcije.

## Povezano

- [Triggers](./triggers.md) – Kako se pokreću workflows; povijesni zapisi `trigger_source` (uključujući `board` za izvršenja pokrenuta pomicanjem kartica u [Board](../tabs/board-tab.md) i nastavcima)
- [Human-in-the-Loop](./human-in-the-loop.md) – URL-ovi na čekanju za pregled i ponašanje nastavka
- [Edit History](./edit-history.md) – Kontrola verzija za spremanja workflow-a (vrati, razlika)
- [Quick Start](../getting-started/quick-start.md) – Izradite i pokrenite svoj prvi workflow
- [Workflows Tab](../tabs/workflows-tab.md) – Kreirajte i upravljajte workflow-ima
