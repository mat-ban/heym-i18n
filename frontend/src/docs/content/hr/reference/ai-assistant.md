# AI Asistent

**AI Asistent** je chat panel koji se otvara iz Debug panela i pojavljuje se u donjem desnom kutu uređivača. Povucite zaglavlje kako biste ga pomaknuli, a povucite rub ili kut kako biste promijenili njegovu širinu ili visinu. Neće se smanjiti ispod 360×480 piksela. Pozicija i veličina se pamte u ovom pregledniku. **Resetirajte poziciju i veličinu** u zaglavlju vraća panel natrag u donji desni kut. Koristite prirodni jezik za kreiranje ili izmjenu workflows-a — opišite što želite, a AI generira čvorove i rubove koji se primjenjuju na platnu.

Za pitanja o dokumentaciji izvan uređivača, koristite [Chat with Heym](./chat-with-heym.md). Ta površina je optimizirana za pomoć u vezi s proizvodom koja je svjesna stranice, umjesto za generiranje workflows-a.

## Otvaranje Panela

1. Otvorite workflow u uređivaču
2. Pronađite **Debug panel** na dnu (područje rezultata izvršavanja)
3. Kliknite na **AI** gumb (ikona s iskricama) u alatnoj traci panela
4. Panel AI Asistenta se otvara u donjem desnom kutu. Povucite njegovo zaglavlje kako biste ga pomaknuli, ili povucite rub ili kut kako biste promijenili njegovu širinu i visinu.

Pritisnite `Ctrl + I` / `Cmd + I` bilo gdje u uređivaču kako biste otvorili ili zatvorili panel — prečac radi čak i dok je fokus na unosu teksta. Pogledajte [Prečaci na tipkovnici](./keyboard-shortcuts.md).

## Zatvaranje Panela

Kliknite na **X** gumb, pritisnite `Ctrl + I` / `Cmd + I`, ili prebacite **AI** gumb u alatnoj traci Debug panela. Zaglavlje povlači panel; ne zatvara ga.

## Konfiguracija

Prije slanja poruka, odaberite:

| Postavka | Opis |
|----------|------|
| **Vjerodajnica** | LLM vjerodajnica (API ključ) iz [Vjerodajnica](../tabs/credentials-tab.md) |
| **Model** | Ime modela (npr. `gpt-4o`, `gemini-2.5-flash`) |

Dodajte vjerodajnice u [Kartici Vjerodajnica](../tabs/credentials-tab.md). Popis modela učitava se iz odabrane vjerodajnice.

## Agent Mod vs Ask Mod

Panel ima dva moda, koji se prebacuju s **Agent / Ask** čipa u zaglavlju panela.

| Mod | Zadano | Ponašanje |
|-----|--------|-----------|
| **Agent** | ✓ | Gradi i modificira platno. AI generira workflow JSON blok koji se automatski primjenjuje na platnu kada je odgovor dovršen. |
| **Ask** | | Odgovara samo na pitanja. Platno nikada nije dotaknuto. Koristite ovo za postavljanje pitanja o Vašem workflow-u, Heym značajkama ili za dobivanje savjeta bez pokretanja ažuriranja platna. |

Prebacujte se između modova u bilo kojem trenutku. Promjena moda ne briše razgovor.

U Agent modu, **YOLO mode** okvir ispod polja za poruke omogućuje asistentu da testira i ispravi ono što gradi. Pogledajte [YOLO Mode](#yolo-mode).

## Korištenje Chata

- Upisujte svoj zahtjev u unos (npr. "Kreirajte workflow koji uzima korisnički unos i šalje ga LLM-u")
- Pritisnite **Enter** za slanje (Shift+Enter za novi red)
- AI streama svoj odgovor. U **Agent** modu, ako odgovor uključuje workflow u \`\`\`json kod bloku, automatski se analizira i primjenjuje na platnu. U **Ask** modu platno nikada nije modificirano.
- Koristite **Clear** za resetiranje razgovora
- Pređite mišem preko poruke i kliknite na ikonu kopiranja kako biste kopirali tekst koji prikazuje, uključujući bilo koji workflow JSON
- Povucite liniju iznad okvira za poruke kako biste povećali visinu okvira. Područje za unos može rasti do 60% panela, a vraća se na svoju zadanu visinu kada se stranica ponovo učita.

## Automatska Primjena Workflows-a

Kada AI odgovor sadrži valjan workflow JSON blok (s `nodes` i opcionalno `edges`) u \`\`\`json kod bloku, Heym:

1. Analizira JSON iz odgovora
2. Zamjenjuje trenutno platno novim čvorovima i rubovima
3. Uređuje raspored čvorova
4. Označava workflow kao nespremljen

Ako analiza ne uspije, pojavljuje se **Retry** gumb za regeneriranje odgovora.

## YOLO Mod

**YOLO mod** omogućuje asistentu da testira ono što gradi. Označite **YOLO mode** okvir ispod polja za poruke, a zatim pošaljite svoj zahtjev. Okvir se pojavljuje samo u Agent modu. Isključuje se prema zadanim postavkama i vraća se na isključeno kada se stranica ponovo učita. Pređite mišem preko ikone informacija pored njega za kratki sažetak.

S uključenim YOLO modom, asistent ne prestaje nakon što primijeni workflow:

1. Primjenjuje workflow na platnu.
2. Prije prvog izvođenja traži testne unose. Kartica navodi ulazna polja workflow-a, ispunjena vrijednostima koje asistent predlaže. Uredite ih i pritisnite **Run**. Kasnija izvođenja ponovno koriste te vrijednosti. Kartica se vraća samo kada se ulazna polja promijene ili asistent treba različite testne podatke.
3. Izvodi workflow na platnu točno kao gumb **Run**: nespremljene promjene se prvo spremaju, čvorovi se osvjetljavaju, a izvođenje se pojavljuje u Debug panelu i [Povijesti Izvršenja](./execution-history.md).
4. Čita rezultat. Ako je izvođenje učinilo ono što ste tražili, završava s **Verified** i kratkim sažetkom. Ako ne, ispravlja workflow i ponovno ga pokreće.

Izvodi najviše **5 izvođenja** po poruci. Pritisnite **Stop** u bilo kojem trenutku kako biste prekinuli petlju i zaustavili izvođenje u tijeku.

Svaki odgovor prikazuje svoje korake dok se događaju:
- `Primjena promjena na platnu`;
- `Izvođenje workflow-a · pokušaj 2/5`, s redom `Izvršavanje <node>` za svaki čvor;
- konačna presuda.

Nakon svakog izvođenja kratka linija poput *Rezultat pokušaja 1 poslan · greška u 1.2s* pokazuje da je rezultat vraćen asistentu.
### Pokretanje drugih workflows

U YOLO modu asistent može također pokretati Vaše druge workflows kada mu je potreban njihov rezultat. Na primjer, može provjeriti što workflow vraća prije nego što ga pozove iz [Execute](../nodes/execute-node.md) čvora. Ova izvršavanja prikazuju se kao `Running workflow "<name>"...` koraci i bilježe se u Povijesti izvršavanja s izvorom okidača `ai_assistant`. Workflow koji se uređuje uvijek se testira na platnu.

### Kada se rano zaustavi

| Situacija | Što se događa |
|---|---|
| Asistent treba odluku, informaciju, vjerodajnicu ili tablicu podataka | Postavlja pitanje s uobičajenom karticom. Odgovaranje nastavlja petlju. |
| Izvršavanje čeka na [ljudsku reviziju](./human-in-the-loop.md) | Petlja se zaustavlja. Odobrite reviziju, zatim pošaljite poruku. |
| Workflow čeka na prijenos datoteke | Petlja se zaustavlja. YOLO mod ne može testirati izvršavanja pokrenuta prijenosom. |
| Novija verzija workflowa je spremljena negdje drugdje | Petlja se zaustavlja. Riješite sukob u spremanju, zatim pošaljite poruku. |

> **Izvršavanja su stvarna.** E-mailovi, poruke i API pozivi u workflowu zapravo se šalju pri svakom pokušaju, a DataTable čvorovi pišu stvarne redove. Svako izvršavanje sprema workflow, tako da ranije verzije ostaju u [Povijesti uređivanja](./edit-history.md).

## Unos glasa

Na podržanim preglednicima, **Voice** gumb omogućuje pretvaranje govora u tekst. Kliknite za početak snimanja, ponovno kliknite za zaustavljanje. Transkribirani tekst šalje se AI-u na ispravak gramatike prije nego što pošaljete.

## Agent čvor vs AI asistent

| | Agent čvor | AI asistent |
|---|------------|---------------|
| **Svrha** | LLM čvor unutar workflowa; izvršava se tijekom izvršavanja | Chat UI za izradu workflows s prirodnim jezikom |
| **Lokacija** | Čvor na platnu | Debug panel → lebdeći panel |
| **Kada** | Tijekom izvođenja | Dok uređujete |

Pogledajte [Agent čvor](../nodes/agent-node.md) za workflow čvor koji izvršava LLM pozive s alatima i MCP.

## Kako to funkcionira (AI Builder DSL)

AI asistent pokreće **workflow DSL** (jezik specifičan za domenu) koji opisuje čvorove, rubove i izraze. Kada pošaljete poruku:

1. Vaša poruka plus [User Rules](./user-settings.md) i trenutni workflow (ako postoji) šalju se na backend.
2. Backend gradi **sistemsku poruku** koja uključuje:
   - Cijeli workflow DSL (tipovi čvorova, sintaksa izraza, pravila, primjeri)
   - Vaša pravila korisnika dodana kao "User Custom Rules"
   - Trenutni workflow JSON kada uređujete postojeći workflow
   - Popis dostupnih workflows ako koristite Execute čvor
   - Imena, tipove i ID-eve Vaših vlastitih vjerodajnica (nikada njihove vrijednosti)
   - Imena, ID-eve, opise i stupce tablica podataka koje možete koristiti (nikada njihove redove)
3. Model vraća jedan workflow JSON blok (s `nodes` i `edges`). Frontend ga analizira i primjenjuje na platnu.

### Vjerodajnice

Kada workflow treba vjerodajnicu, asistent postavlja pitanje prije nego što je izgradi. Ako imate vjerodajnice odgovarajućeg tipa, navodi ih zajedno s **Kreiraj novu vjerodajnicu**; ako ih nemate, pita Vas želite li kreirati jednu. Svako pitanje također Vam omogućuje nastavak bez vjerodajnice.

Odabir za kreiranje otvara obrazac za vjerodajnicu u panelu, unaprijed postavljen na pravi tip i predloženo ime. Vrijednosti idu izravno u Heym; asistent samo uči ime i tip. OAuth vjerodajnice (Google Sheets, Google Drive, BigQuery, Linear, Notion) povezuju se u iskačućem prozoru, a poveznica na stranicu za autorizaciju pojavljuje se u slučaju da je iskačući prozor blokiran. Nakon što je vjerodajnica spremljena, kartica prikazuje njezino ime, a gumb za kreiranje se isključuje; pritisnite **Pošaljite odgovore** i asistent stavlja novu vjerodajnicu na čvor.

Također možete zatražiti vjerodajnicu samostalno ("kreiraj GitHub vjerodajnicu") ili zatražiti promjenu one koju posjedujete ("ažuriraj svoju vjerodajnicu za tablicu", "ponovno poveži svoje Google Sheets"). Asistent odgovara s istom karticom: kreiranje otvara prazan obrazac, ažuriranje otvara obrazac za tu vjerodajnicu s njezinim tajnama maskiranim.

Asistent preferira posvećen čvor. Kada nijedan čvor ne pokriva operaciju, kao što je dodavanje kartice u Google Sheet, koristi HTTP zahtjev i piše zaglavlje za odabranu vjerodajnicu. Pogledajte [HTTP › Autentifikacija s vjerodajnicama](../nodes/http-node.md#authenticating-with-credentials).

Pitanja za pojašnjenje koja workflow može obaviti bez njih označena su kao **Opcionalno** u njihovom unosu i mogu se preskočiti.

DSL nameće camelCase oznake, ujednačena pravila izraza i polja specifična za čvor. Ako je vrijednost polja jedan `$expr`, backend zadržava izvorni tip; ako vrijednost miješa prozu s `$refs`, rezultat je string. Pravilo jednog `$` i dalje vrijedi: nema `$` unutar zagrada. [Postavke](./user-settings.md) Pravila korisnika umetnuta su u ovu sistemsku poruku tako da se Vaše postavke primjenjuju na svaki AI-generirani workflow.

Ako trenutni workflow sadrži Agent vještine, AI asistent uključuje samo `SKILL.md` svake vještine u tom kontekstu workflowa. Priložene `.py` datoteke i binarni resursi vještina uklanjaju se prije zahtjeva kako bi se graditelj održao unutar ograničenja modela konteksta, čak i kada vještine sadrže velike implementacije.
### Tablica podataka

Kada workflow sprema, pohranjuje ili pretražuje zapise, a Vi niste imenovali drugo spremište, asistent koristi [DataTable](../nodes/datatable-node.md) čvor. Ako imenujete jednu od svojih tablica i ona ima stupce koje workflow treba, asistent će je koristiti. U suprotnom, pita koju tablicu koristiti. Kartica prikazuje tablice koje odgovaraju, svaka sa svojim opisom i tipovima stupaca, plus **Kreiraj novu tablicu** s predloženim imenom i stupcima. Također se nude tablice koje su s Vama dijeljene; jedna koju možete samo čitati nudi se samo za čitanje.

Odaberite novu tablicu i pritisnite **Pošaljite odgovore**: kartica kreira tablicu, a asistent stavlja njezin ID na čvor i koristi točne nazive stupaca. Također možete zatražiti tablicu samostalno, na primjer "kreiraj tablicu za moje kontakte".

Asistent vidi imena tablica, opise i stupce, nikada redove. Nikada ne mijenja stupce postojeće tablice: ako tablica nema stupac koji workflow treba, imenuje stupac i nudi novu tablicu umjesto toga. Dodajte stupce u [DataTable kartici](../tabs/datatable-tab.md).

## Povezano

- [Zašto Heym](../getting-started/why-heym.md) – Gradnja prirodnim jezikom kao prva faza životnog ciklusa agenta
- [Brzi početak](../getting-started/quick-start.md) – Izradite svoj prvi workflow
- [Postavke](./user-settings.md) – Pravila korisnika umetnuta u sustav prompt AI asistenta
- [Chat s Heym](./chat-with-heym.md) – Asistent svjestan stranice unutar dokumentacijske oblasti
- [Osnovni koncepti](../getting-started/core-concepts.md) – Workflows, čvorovi i tijek izvršavanja
- [Agent čvor](../nodes/agent-node.md) – LLM čvor s alatima i MCP
- [Kartica Vjerodajnice](../tabs/credentials-tab.md) – Dodajte API ključeve za AI asistenta
- [Struktura workflow-a](./workflow-structure.md) – JSON format za workflows
