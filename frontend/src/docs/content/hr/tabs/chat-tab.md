# Chat Tab

Tablica **Chat** pruža izravno sučelje za razgovor s LLM-om. Koristite ga za testiranje modela, postavljanje pitanja, pokretanje postojećih workflows-a ili stvaranje novog workflows-a iz zahtjeva na prirodnom jeziku.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Pogledajte Chat demo</a></p>

## Postavljanje

1. Odaberite [vjerodajnicu](./credentials-tab.md) (API ključ za OpenAI, Google itd.)
2. Odaberite model iz padajućeg izbornika (modeli se učitavaju iz odabrane vjerodajnice)
3. Počnite tipkati kako biste slali poruke

Također možete započeti razgovor iz okvira za chat na [Workflows tab](./workflows-tab.md). To šalje vašu prvu poruku i otvara novi razgovor ovdje s odgovorom koji se već prenosi.

## Značajke

- **Kontekst globalnih varijabli** – Vaše [Globalne Varijable](../reference/global-variables.md) su dostupne LLM-u, tako da možete postavljati pitanja ili se referirati na pohranjene vrijednosti
- **Kontekst predložaka radnog prostora** – Dijeljeni workflows-i i predlošci čvorova u vašem radnom prostoru uključeni su kao kontekst, tako da Chat može odgovarati na pitanja o dostupnim predlošcima
- **Agent koji dugo radi** – Chat nastavlja raditi u pozadini čak i ako se preglednik zatvori, tako da se možete vratiti s drugog uređaja i nastaviti isti razgovor
- **Stvaranje workflows-a** – Zamolite Chat da stvori ili postavi workflow, a on koristi isti Workflow AI Builder motor kao asistent u uređivaču za generiranje i spremanje workflows-a
- **Stvaranje Kanban zadataka** – Prirodno zatražite dodavanje zadatka ili stvaranje kartice. Chat ga dodaje u prvu kolonu zatraženog ploče; kada imate više ploča i ne imenujete jednu, Chat prikazuje odabir ploče prije stvaranja kartice
- **Redoslijed slijedećih poruka** – Šaljite više poruka dok se odgovor prenosi. Poruke u redu se čuvaju, mogu se uređivati ili brisati prije nego što započnu, a izvršavaju se redom nakon aktivnog odgovora
- **Pauze za planiranje** – Kada Chat treba detalje o planiranju, postavlja pitanja za pojašnjenje i pauzira poruke u redu dok ne odgovorite. Nakon što se odgovor na planiranje završi, poruke u redu se nastavljaju
- **Vjerodajnice** – Kada workflow koji Chat stvara ili uređuje treba vjerodajnicu, Chat pita koju koristiti, nudi stvaranje nove u razgovoru ili vam omogućuje nastavak bez nje. Također možete zatražiti od Chata da stvori vjerodajnicu ili ažurira onu koju posjedujete; otvara obrazac za vjerodajnice u razgovoru. Model vidi ime i tip vjerodajnice, nikada njezine vrijednosti. Pogledajte [AI Assistant › Vjerodajnice](../reference/ai-assistant.md#credentials)
- **Tablice podataka** – Kada workflow koji Chat stvara ili uređuje pohranjuje zapise, Chat pita koju [tablicu podataka](./datatable-tab.md) koristiti ili nudi stvaranje nove s kolonama koje workflow treba. Također može navesti vaše tablice i njihove kolone. Nikada ne čita niti piše redove. Pogledajte [AI Assistant › Tablice podataka](../reference/ai-assistant.md#data-tables)
- **Streaming odgovori** – Vidite izlaz modela dok se prenosi
- **Prekid odgovora** – Prekinite trenutni streaming odgovor u bilo kojem trenutku; prekid također briše poruke u redu za taj razgovor
- **Markdown renderiranje** – Odgovori podržavaju markdown formatiranje, uključujući inline slike
- **Prikaz slika** – Slike ugrađene u odgovore (npr. iz generiranja slika LLM-a) pojavljuju se inline; kliknite na bilo koju sliku da biste je vidjeli na cijelom ekranu. Pritisnite **Esc** ili gumb za povratak (mobilno) da biste zatvorili prikaz na cijelom ekranu
- **Kopiranje poruka** – Kopirajte bilo koju poruku u međuspremnik
- **Brisanje chata** – Započnite novi razgovor
- **Unos glasa** – Koristite gumb mikrofona za pretvaranje govora u tekst (podržano u pregledniku). Kada snimanje završi, Heym može lagano očistiti transkript prije nego što ga pošaljete
- **Raspoređeni workflows-i** – Pitajte kada se cron workflows-i izvode (danas, ovaj tjedan, ovaj mjesec ili prilagođeni datum). Asistent koristi iste podatke o rasporedu kao [Raspoređeni](./scheduled-tab.md) tab i može ograničiti rezultate na workflows-e koje posjedujete ili uključiti one koje su s vama dijeljene
- **Povijest izvršavanja workflows-a** – Pitajte o jednom workflow-u ("koliko je puta dnevno izvješće izvršeno?", "je li neuspješno?", "kada je posljednji put izvršeno?"). Chat pretražuje workflow prema njegovom ID-u i odgovara na temelju broja izvršavanja, razdiobe statusa, vremena prvog i posljednjeg izvršavanja te prosječnog trajanja. Pitajte zašto je izvršavanje neuspjelo ili što je vratilo, a Chat tada otvara to pojedinačno izvršavanje kako bi pročitao njegove ulaze, izlaze i greške po čvorovima
- **Status aktivnog izvršavanja** – Pitajte što se trenutno izvršava i Chat odgovara s brojem, imenima workflows-a, koliko dugo svako izvršavanje traje, na kojem je čvoru i poveznicom izravno na aktivno izvršavanje
## Korištenje Chata iz MCP Klijenta

Chat motor također se može koristiti izvan preglednika. Omogućite **Heym Chat Alat** u [MCP kartici](./mcp-tab.md) i MCP klijenti — Claude, Cursor i bilo što drugo što podržava MCP — dobivaju jedan `heym_chat` alat koji pokreće ovaj isti motor sa svim svojim mogućnostima.

Te razgovore možete pronaći u povijesti ove kartice, označene ikonom utičnice u popisu razgovora. Otvorite jedan kako biste pročitali što je klijent pitao, vidjeli alate koje je aktivirao i nastavili raspravu sami. Odgovaranje na pitanje za pojašnjenje funkcionira na isti način, bez obzira na to je li razgovor započeo ovdje ili iz MCP klijenta.

Preko MCP-a, Chat ne navodi, ne bira niti stvara vjerodajnice. Workflows koje gradi ostavljaju polja za vjerodajnice praznima, a odgovor navodi čvorove koji trebaju vjerodajnicu kako biste ih mogli postaviti u uređivaču.

Tablice podataka također rade preko MCP-a: Chat navodi vaše tablice, stvara nove i povezuje ih u workflows koje gradi. Njegovo pitanje o tablici dolazi kao tekst u rezultatu, stoga mu odgovorite s istim `conversation_id`.

## Ograničenje Konteksta

Chat zadržava do 25 nedavnih poruka u kontekstu. Starije poruke se uklanjaju kako bi se ostalo unutar ograničenja modela.

## Kreiranje Workflows

Kada zatražite od Chata da kreira, izgradi, generira ili postavi workflow, on stvara novi spremljeni workflow s generiranim imenom i opisom. Odgovor uključuje pregled platna samo za čitanje generiranih čvorova i rubova, plus **Otvorite workflow** poveznicu koja otvara uređivač workflow-a u novoj kartici preglednika. Koristite **Pokreni** gumb na pregledu kartice kada želite izvršiti workflow.

Povratne informacije u istom chatu uređuju taj workflow umjesto da kreiraju novi. Na primjer, nakon što Chat kreira workflow, možete reći "dodaj korak odobrenja", "promijeni format izlaza" ili "şöyle yap" i Chat ažurira spremljeni workflow i osvježava pregled.

Ovo je najbolje za zahtjeve gdje želite da se posao obavi kao ponovna automatizacija, a ne samo kao jednokratni odgovor.

## Kreiranje Kanban Zadatka

Zatražite od Chata na običnom jeziku, na primjer, “Dodaj zadatak pod nazivom Popravi grešku prijave” ili “Kreiraj novu karticu Ažuriraj dokumentaciju na Launch ploči.” Možete uključiti opis u istom zahtjevu. Chat uvijek stvara karticu u prvom stupcu odabrane ploče.

Ako vaš radni prostor ima nekoliko ploča i ne identificirate jednu, Chat se zaustavlja s odabirom ploče s jednim izborom. Odaberite ploču kako biste završili kreiranje kartice. Nema potrebe za slash naredbom ili posebnim formatom poruke.

## Pitanje Što Se Izvodi

Pitajte na običnom jeziku — "što se izvodi?", "koliko je workflows aktivno upravo sada?", "na kojem je čvoru noćno izvješće?" — i Chat izvještava o trenutnoj situaciji:

- **Koliko** izvršavanja je u tijeku, podijeljeno na aktivna i ona koja čekaju ljudsku reviziju
- **Koji workflows** im pripadaju, po imenu
- **Koliko dugo** svaka izvedba traje (na primjer `1m 35s`, `3h 25m`)
- **Koji čvor** se trenutno izvršava, prema oznaci na platnu, plus posljednji čvor koji je završio
- **Poveznica** na svaku aktivnu izvedbu, koja otvara platno s tom izvršbom koja se ponavlja

Izvedbe koje su pauzirane za [Human-in-the-Loop](../reference/human-in-the-loop.md) ili Codex reviziju izvještavaju se kao čekanje na Vas, a ne kao aktivne. Ovo su isti podaci kao oznaka aktivnih izvršavanja u zaglavlju, tako da Chat i oznaka nikada ne proturječe. Za izvedbe koje su već završile, pitajte za nedavna izvršavanja umjesto toga — to se odnosi na [Povijest Izvršavanja](../reference/execution-history.md).

## Pitanje O Upozorenjima

Chat može odgovoriti na pitanja o [upozorenjima](./alerts-tab.md) koje ste definirali:

- **Što postoji** — "koja upozorenja imam?", "ima li upozorenje na workflow-u za fakturu?", "koja upozorenja se trenutno aktiviraju?"
- **Kako je postavljeno** — "koja je granica na upozorenju o troškovima?", "kako je to konfigurirano?"
- **Zašto i kada se aktiviralo** — "zašto se aktiviralo upozorenje o troškovima?", "kada je ovo posljednji put aktivirano?"

Za pitanje "zašto se aktiviralo", Chat čita zapis o aktivaciji i citira stvarnu zabilježenu vrijednost, granicu i točan vremenski okvir koji je evaluiran, plus detalje koji su doprinijeli: identifikatori neuspješnih izvršavanja i poruke o grešci za upozorenja o grešci, potrošnja po modelu za upozorenja o troškovima ili raspodjela izvora okidača za upozorenja o broju izvršavanja. Izvještava što je bilo točno kada se upozorenje aktiviralo, umjesto da ponovo izračunava vremenski okvir, jer je vremenski okvir prošao i svježi izračun može dati drugačiji odgovor.

## Pravila Korisnika

[Pravila Korisnika](../reference/user-settings.md) (konfigurirana u Postavkama) automatski se umetnu u svaki Chat razgovor kao upute na razini sustava. Postavite ih jednom kako biste primijenili trajne preferencije na sve chat zahtjeve.
## Povezano

- [MCP Tab](./mcp-tab.md) – Izložite ovaj motor klijentima MCP-a kao alat `heym_chat`
- [Postavke](../reference/user-settings.md) – Postavite korisnička pravila primjenjiva na sve chat zahtjeve
- [Tablica vjerodajnica](./credentials-tab.md) – Dodajte i upravljajte API ključevima
- [Tablica varijabli](./global-variables-tab.md) – Globalne varijable dostupne za Chat
- [Tipovi čvorova](../reference/node-types.md) – LLM i Agent čvorovi za workflows
- [Agent čvor](../nodes/agent-node.md) – AI Agent s pozivima alata
- [AI Asistent](../reference/ai-assistant.md) – Asistent za uređivanje pokretan istim DSL-om za izgradnju workflows
- [Povijest izvršavanja](../reference/execution-history.md) – Pregledajte prethodna izvršavanja (gumb Povijest u zaglavlju)
- [Raspoređena tablica](./scheduled-tab.md) – Kalendar nadolazećih cron izvršavanja (isti podaci koje Chat može sažeti)
- [Tablica upozorenja](./alerts-tab.md) – Upozorenja o pragovima koja Chat može navesti i objasniti
- [Kontekstualna izložba](../reference/contextual-showcase.md) – Kompaktna orijentacija unutar aplikacije za ovu stranicu
- [Chat glas (TTS & STT)](../reference/chat-voice.md) – Čitajte poruke naglas i razgovarajte bez ruku s ElevenLabs

## Pozivi alata i veličina konteksta

Svaki put kada asistent pozove alat (izvodi workflow, navodi izvršavanja, gradi novi workflow), u razgovoru se pojavljuje sklopiva kartica. Kartica se automatski širi dok alat radi, prikazujući točne argumente. Kada alat završi, kartica se smanjuje na sažetak u jednoj liniji s proteklim vremenom. Kliknite na bilo koju karticu da ponovo proširite argumente i sažetak odgovora.

Mala oznaka u obliku prstena ispod unosa prikazuje trenutnu upotrebu konteksta kao postotak prozora modela (npr. `12% · ~9.2k`). Pređite mišem preko oznake da biste vidjeli detaljnu analizu: sistemski prompt, AGENTS.md, blok workflows, korisnička pravila, povijest i Vaš nacrt unosa. Kada upotreba prijeđe 80%, prsten postaje žut; pri 95% postaje crven.

Ako upotreba dođe blizu granice, Heym automatski komprimira starije poruke u kratak sažetak koristeći isti mehanizam koji koriste agent čvorovi. Kartica "Kontekst komprimiran" pojavljuje se unutar teksta kako bi prikazala što se dogodilo.
