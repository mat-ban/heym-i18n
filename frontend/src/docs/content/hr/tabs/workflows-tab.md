# Tablica Workflows

Tablica **Workflows** je zadani prikaz nadzorne ploče. Prikazuje vaš popis workflow-a, strukturu mapa i omogućuje vam stvaranje, uređivanje i organiziranje workflow-a.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Pogledajte demo Workflows-a</a></p>

## Pokrenite Chat

Iznad popisa workflow-a nalazi se chat okvir koji vas pozdravlja po imenu i pita što želite automatizirati. Unesite prompt, opcionalno priložite jedan datoteku i odaberite vjerodajnicu i model koji želite. Oba padajuća izbornika su pretraživa i započinju s vašim [AI zadanim postavkama](../reference/user-settings.md).

Slanjem se stvara nova konverzacija koja se otvara u [Chat tabu](./chat-tab.md), gdje dolaze odgovori. Podržani privici su tekstualne datoteke, slike i PDF-ovi, jedan po poruci, isto kao i chat composer.

Ako još nemate LLM vjerodajnicu, okvir prikazuje poveznicu na [Credentials tab](./credentials-tab.md) i slanje ostaje onemogućeno.

Kliknite **x** za skrivanje okvira. Zatim se pojavljuje gumb **Ask AI** pored naslova Workflows i vraća ga natrag. Odabir se pamti u vašem pregledniku.

## Popis Workflow-a

Popis je prikaz u dva okna: workflow-i i mape s lijeve strane, pregled odabranog workflow-a s desne strane.

- Svaki redak prikazuje ikonu workflow-a, naziv, opis, kada je posljednji put ažuriran i [status chip](#workflow-status)
- Workflow-i mogu biti u korijenu ili unutar mapa, a pinani workflow-i pojavljuju se u vlastitoj grupi **Pinned** na vrhu
- **Kliknite** redak za odabir i učitavanje njegovog pregleda s desne strane
- **Dvostruki klik** na redak, ili pritisnite **Enter** dok je fokusiran, da ga otvorite u [uredniku](../getting-started/quick-start.md)
- Koristite **Ctrl+klik** (ili **Cmd+klik**) za otvaranje u novoj kartici
- Svaki redak nosi svoje radnje uređivanja, kopiranja, pinanja i brisanja s desne strane. Na telefonima su skrivene kako bi naziv zadržao punu širinu; **dugi pritisak** na redak tamo otvara izbornik radnji
- Pinajte često korištene workflow-e u [Quick Drawer](../reference/quick-drawer.md) kako biste ih brzo pokrenuli iz tablice Workflows i drugih unutarnjih stranica

## Pregled Workflow-a

Odabirom workflow-a ispunjava se panel pregleda pored popisa. Na ekranima užim od 1280px isti panel otvara se kao list iz donjeg dijela ekrana.

Panel prikazuje:

- Naziv workflow-a, tko ga je stvorio i kada, te kada je posljednji put uređen
- **Otvorite Workflow** – otvara workflow u uredniku
- **Pokreni sada** – otvara workflow u [Quick Drawer](../reference/quick-drawer.md), gdje ispunjavate njegove ulaze i započinjete izvođenje bez napuštanja popisa
- **Opis** – opis workflow-a
- **Konfiguracija Trigger-a** – raspored za cron workflow, ili trigger koji sluša za event workflow. Workflow-i koji se pozivaju putem HTTP-a prikazuju gumb **Copy cURL** umjesto sirovog endpoint-a i auth teksta: kopira cijeli zahtjev s pravim URL-om, zaglavljima, auth mjestom i tijelom izgrađenim iz ulaznih polja workflow-a. Kada workflow objavi [portal](../reference/portal.md), njegova javna chat poveznica također se pojavljuje ovdje
- **Detalji posljednjeg izvođenja** – ishod i trajanje najnovijeg izvođenja, ili napomena da workflow nikada nije pokrenut
- **Koraci Workflow-a & Pod-agenti** – čvorovi u redoslijedu izvođenja, svaki sa svojim modelom, operacijom ili rasporedom i točkom koja pokazuje je li aktivan. Odabirom koraka otvara se taj čvor u uredniku s već otvorenom njegovom panelom svojstava

Panel ostaje prikovan pored popisa dok se pomičete, tako da ostaje čitljiv u dugom popisu workflow-a.
## Administracija Instance

Računi navedeni u `HEYM_ADMIN_EMAILS` mogu pregledavati, otvarati, uređivati, inspekcijski pregledavati povijest izvršavanja i brisati bilo koji workflow na instanci bez prijenosa dijeljenja ili vlasništva. Ova postavka je zarezom odvojena lista email adresa, koja se podudara bez obzira na velika i mala slova. Prazna lista ne daje nikome ovaj pristup. Ponovno pokrenite backend nakon promjene.

Administratori vide email vlasnika u popisu workflow-a i mogu pretraživati prema toj adresi. Odaberite workflow kako biste otvorili **Administraciju instance** u njegovom pregledu:

1. **Pauziraj okidače** prikazuje se samo za workflow-e koji sadrže Cron čvor. On onemogućava Cron i druge automatske okidače workflow-a putem normalnog verzioniranog spremanja. Postojeće izvršavanja mogu završiti. Ručni, API, portal i pozivi pod-workflow-a ostaju dostupni; ova radnja nije zaključavanje izvršavanja na razini workflow-a.
2. Gumb se mijenja u **Nastavi okidače** dok je pauziran, uključujući nakon ponovnog učitavanja stranice. Nastavi ponovno omogućava okidače koje je administrator pauzirao i ostavlja okidače koji su već onemogućeni nepromijenjenima. Za starije pauzirane workflow-e bez spremljenog stanja pauze administratora, Nastavi omogućava njihove automatske okidače.
3. Koristite radnju **Obriši workflow** u redu workflow-a kada se izvršavanja smire. Brisanje vraća sukob dok postojeći radovi koji se izvršavaju, čekaju ili su na pregledu ostaju. Planirano brisanje primjenjuje istu provjeru.

Pauzirajte okidače i dopustite postojećim izvršavanjima da završe prije brisanja. Okidač koji je već poslan kada je pauziran može se još uvijek završiti. Koristite brisanje kada workflow više ne smije biti pozivan.

Tajne webhook-a i postavke autentifikacije koje su samo za vlasnike zadržavaju svoju postojeću zaštitu. Administracija ne prenosi vlasništvo niti dijeli evidenciju vjerodajnica vlasnika. Administrativne radnje pauze, nastavka, brisanja i planiranja pojavljuju se u [audit trail](../reference/audit.md) s djelatnim administratorom i vlasnikom workflow-a.

## Status Workflow-a

Svaki redak nosi oznaku statusa koja proizlazi iz okidača workflow-a, njegovog trenutnog stanja izvršavanja, i — za workflow-e bez okidača — kako je njegovo najnovije izvršavanje započeto:

| Status | Značenje |
| --- | --- |
| **Izvršava se** | Workflow ima izvršavanje u tijeku upravo sada |
| **Planirano** | Ima aktivan [cron](../nodes/cron-node.md) okidač |
| **Sluša** | Ima aktivan okidač događaja, poput Slack, Telegram, IMAP ili WebSocket okidača |
| **Pauzirano** | Ima okidače, ali su svi onemogućeni |
| **API** | Nema okidače i posljednji put je pokrenut HTTP pozivom na njegov execute endpoint |
| **SubWorker** | Nema okidače i posljednji put je pokrenut kao pod-workflow od roditeljskog workflow-a |
| **Portal** | Nema okidače i posljednji put je pokrenut iz svog [portala](../reference/portal.md) |
| **WEB** | Nema okidače i njegov jedini terminal je [HTML output mapper](../nodes/html-output-mapper-node.md), tako da poziv vraća prikazanu web stranicu |
| **Ručno** | Nema okidače i nikada nije pokrenut, ili je njegovo posljednje izvršavanje došlo iz drugog izvora |
| **Ukloni planirano** | [Planirano za brisanje](../reference/workflow-organization.md) |

API, SubWorker i Portal oznake čitaju jedini najnoviji unos u [povijesti izvršavanja](./logs-tab.md) workflow-a, tako da workflow koji se poziva na dva načina prikazuje onaj koji je došao posljednji. **WEB** se odlučuje iz grafa umjesto toga, tako da ima prednost nad ta tri: workflow koji poslužuje stranicu čita WEB čak i nakon što je pozvan putem HTTP-a. Okidači uvijek pobjeđuju nad svima njima: cron workflow koji netko također poziva putem HTTP-a ostaje **Planirano**.

Koristite **Status** padajući izbornik pored pretraživačkog polja kako biste prikazali samo jedan status. Padajući izbornik navodi koliko workflow-a trenutno odgovara svakom od njih. Filtriranje statusa također doseže unutar mapa: mape s podudaranjem automatski se proširuju, a mape bez podudaranja skrivene su dok ne očistite filtar.

## Aktivni Workflow-i

Na radnoj površini, kružni oznaka u gornjoj alatnoj traci prikazuje koliko workflow-a trenutno izvršava i automatski se osvježava svake 10 sekundi. Kliknite oznaku koja nije nula kako biste otvorili popis aktivnih workflow-a, koji prikazuje do četiri retka prije pomicanja. Odaberite naziv workflow-a kako biste povezali uređivač s trenutnim pregledom tog izvršavanja. Oznaka nula je informativna i ne može se otvoriti, a oznaka je skrivena na mobilnim ekranima.

## Pretraživanje

Koristite polje za pretraživanje workflow-a pored **Status**, ili pritisnite **Ctrl+F** (ili **Cmd+F**), kako biste filtrirali workflow-e prema naslovu ili opisu. Odgovarajući workflow-i unutar mapa prikazuju se s proširenim granama svojih mapa. Pritisnite **Escape** kako biste očistili pretraživanje.
## Mape

- Organizirajte workflows u [mape i pod-mape](../reference/workflow-organization.md)
- Kreirajte mape pomoću gumba **Nova mapa**, dajući svakoj ime i opcionalni opis koji se prikazuje ispod imena u popisu
- Svaki redak mape prikazuje koliko workflows sadrži, uključujući pod-mape, uz akcije za novu pod-mapu, preimenovanje, promjenu ikone, preuzimanje kao ZIP i brisanje. Na telefonima redak prikazuje samo jedan izbornik umjesto toga
- Povucite workflow preko mape ili pod-mape da biste vidjeli pregled odredišta veličine kartice. Istaknuti pregled prikazuje puni put do mape prije nego što ispustite, a prelazak mišem preko sažete mape kratko je proširuje kako biste mogli doći do ugniježdenih mapa.
- Povucite workflows između mapa ili do korijena. Povučena kartica ostaje vidljiva kao duh, a aktivno odredište ostaje istaknuto dok se pomičete.
- Ispuštanje workflow-a natrag u trenutnu mapu onemogućeno je i označeno kao **Već u mapi**.
- Preimenujte mapu ili promijenite njezin opis putem akcije za preimenovanje ili kontekstnog izbornika desnog klika

## Kreiranje Workflows

1. Kliknite **Novi Workflow**
2. Unesite ime i opcionalni opis
3. Workflow se otvara u uređivaču

## Uvoz

Povucite i ispustite JSON datoteku workflow-a na područje workflow-a kako biste stvorili novi workflow. Uvezeni čvorovi i rubovi koriste se za stvaranje workflow-a; ime dolazi iz polja `name` u JSON-u ili iz naziva datoteke. Pogledajte [Preuzimanje i Uvoz](../reference/download-import.md) za JSON format i opcije uvoza.

## Dijeljenje

Otvorite workflow u uređivaču i kliknite **Dijeli** kako biste pozvali korisnike putem e-pošte ili podijelili s [timom](./teams-tab.md). Odaberite **Čitanje** (pregled i pokretanje) ili **Pisanje** (također uređivanje) za svakog korisnika ili tim, i promijenite to kasnije iz padajućeg izbornika pored unosa. Vjerodajnice i pod-workflows se ne dijele automatski; dijelite ih odvojeno s istim korisnicima ili timovima. Pogledajte [Organizacija Workflows](../reference/workflow-organization.md#sharing-workflows) i [Dijeljenje Vjerodajnica](../reference/credentials-sharing.md).

## Uređivanje i Brisanje

- **Uredi** – Promijenite ime i opis workflow-a putem akcije za uređivanje u retku
- **Izbriši** – Workflows su [zakazani za brisanje](../reference/workflow-organization.md); premještaju se u područje smeća prije trajnog uklanjanja

## Paralelna Uređivanja

Spremanje šalje reviziju na kojoj se temelje Vaša uređivanja, a poslužitelj odbija pisanje ako se workflow promijenio u međuvremenu — na primjer, jer ga je kolega spremio, ili ste ostavili isti workflow otvoren u drugoj kartici. Heym tada prikazuje dijalog **Otkrivena zastarjela verzija workflow-a** s dvije opcije:

- **Otkaži** – Čuva Vaše nespremljene promjene u uređivaču kako biste ih mogli ponovo učitati u drugoj kartici i uskladiti
- **Zamijeni** – Spremi unatoč svemu, zamjenjujući verziju druge osobe

**Pokretanje** workflow-a prvo ga sprema, tako da prolazi kroz istu provjeru. Ako se workflow promijenio ispod Vas, pokretanje se pauzira na dijalogu umjesto da tiho prepisuje: **Zamijeni i Pokreni** sprema Vašu verziju i započinje pokretanje, **Otkaži Pokretanje** napušta oboje i ostavlja Vaša uređivanja netaknuta.

Provjera je dio samog zahtjeva za spremanje, tako da ne košta dodatno putovanje i ne postoji prozor u kojem bi spremanje moglo proći mimo njega. Vaše vlastite promjene iz drugih dijelova aplikacije — preimenovanje, promjena postavki, prebacivanje panela s svojstvima — nikada se ne računaju kao sukob.

## Paleta Komandi

Pritisnite **Ctrl+K** (ili **Cmd+K**) za otvaranje palete komandi. Možete:
- Pretraživati workflows po imenu
- Skočiti na bilo koju [karticu nadzorne ploče](./credentials-tab.md)
- Otvoriti nedavne workflows

## Povezano

- [Brzi Početak](../getting-started/quick-start.md) – Izradite svoj prvi workflow
- [Organizacija Workflows](../reference/workflow-organization.md) – Mape, pod-mape i zakazano brisanje
- [Struktura Workflows](../reference/workflow-structure.md) – JSON format za workflows
- [Preuzimanje i Uvoz](../reference/download-import.md) – Izvoz i uvoz workflows kao JSON
- [Portal](../reference/portal.md) – Izložite workflows kao javne chat UI-e
- [Odbor](./board-tab.md) – Pokrenite workflows iz kanban kartica putem lanaca stupaca
- [Osnovni Koncepti](../getting-started/core-concepts.md) – Workflows, čvorovi i izvršavanje
- [Povijest Izvršenja](../reference/execution-history.md) – Pregledajte prošla pokretanja i dovedite na Canvas
- [Brzi Izbornik](../reference/quick-drawer.md) – Prikvačite i pokrenite workflows s nadzorne ploče, dokumenata i drugih stranica koje nisu uređivač
- [Kontekstualna Izložba](../reference/contextual-showcase.md) – Kratki vodič za stranice nadzorne ploče
