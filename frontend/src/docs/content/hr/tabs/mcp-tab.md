# MCP / A2A Kartica

Kartica **MCP** konfigurira integraciju Model Context Protocol (MCP), te kao [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) poslužitelji kojima drugi agenti mogu delegirati zadatke. MCP omogućuje AI klijentima (Claude, ChatGPT, Gemini, Cursor i bilo kojem alatu kompatibilnom s MCP-om) da pozivaju Vaše Heym workflows kao alate.

Heym podržava dva načina: **zadani poslužitelj** koji izlaže sve workflows omogućene za MCP pod jednim endpointom, i **imenovane poslužitelje** koji daju svakoj logičkoj grupi workflows vlastitu posvećenu URL adresu i API ključ.

Oba načina mogu izložiti dvije vrste alata: pojedinačne **workflows** i **Heym chat alat** — cijeli [Chat tab](./chat-tab.md) motor iza jednog `heym_chat` alata.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Pogledajte MCP demonstraciju</a></p>

## Zadani MCP Poslužitelj

Zadani poslužitelj uvijek je dostupan na `{origin}/api/mcp/sse`. Svi workflows s uključenim MCP-om pojavljuju se kao alati ovdje.

### MCP API Ključ

- Ključevi se pohranjuju kao SHA-256 sažeci, tako da Heym ne može prikazati postojeći ključ. Kartica izvještava je li jedan postavljen, a ne koji je.
- **Generiraj** / **Ponovno generiraj** – Novi ključ se prikazuje jednom, odmah nakon što ga kreirate. Kopirajte ga tada; ponovnim učitavanjem kartice skriva se zauvijek.
- Koristite ovaj ključ prilikom povezivanja Claude Desktop, Cursor ili drugih MCP klijenata s Heym-om.
- Izgubili ste ključ? Ponovno ga generirajte. Prethodni ključ prestaje raditi odmah.

### Metode Povezivanja

- **API Ključ** – Koristite MCP API ključ za programske veze. Kartica može kopirati spremnu JSON konfiguraciju i uključuje gumb **Dodaj u Cursor** za jednostavno postavljanje Cursor-a jednim klikom.
- **Claude** – Kartica prikazuje MCP URL poslužitelja i korake postavljanja za Claude. Ostavite OAuth Client ID i Secret praznima; Claude se automatski registrira i autentificira putem Heym OAuth-a.
- **ChatGPT** – Kartica prikazuje URL MCP poslužitelja i korake postavljanja za ChatGPT aplikaciju. Uključite Developer mode, izradite aplikaciju s URL-om i odaberite OAuth; ChatGPT se automatski registrira.
- **Gemini** – Kartica prikazuje URL MCP poslužitelja i korake postavljanja za prilagođenu Gemini aplikaciju: na gemini.google.com odaberite **Settings → Connected Apps → Add a custom app**, zalijepite URL i ostavite **Advanced features** zatvorenim; Gemini se automatski registrira i autentificira putem Heym OAuth-a. Nakon povezivanja, Heym radi i u mobilnoj aplikaciji Gemini.

### Workflow MCP Preklopnik

Svaki workflow može biti izložen kao MCP alat:

- **Omogući** – Alati workflow-a postaju dostupni svim klijentima povezanim na zadani poslužitelj.
- **Onemogući** – Workflow nije izložen.

Kartice workflow-a prikazuju opis i pregled imena ulaznih polja kako biste mogli vidjeti što svaki alat očekuje prije nego što ga omogućite.


### Pokretanja u redu čekanja i heym_execution_status

Workflow s [ograničenjem istodobnosti](../reference/webhooks.md#concurrency-limit-and-queued-runs) može biti zauzet kada ga klijent pozove. Poziv tada odmah vraća rezultat koji nije pogreška:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

Klijent proziva alat `heym_execution_status` s tim `execution_id`. On vraća isto tijelo kao i [URL statusa](../reference/webhooks.md#status-url): `queued` s trenutnom pozicijom, `running`, zatim `success` ili `error` s izlazima. Pronalazi samo pokretanja onih workflows koje isti poslužitelj izlaže. Alat je naveden na zadanom poslužitelju i na svakom imenovanom poslužitelju samo dok barem jedan od njegovih workflows ima ograničenje istodobnosti. Kada je red čekanja pun, poziv vraća pogrešku „Concurrency queue is full“.
## Heym Agent

Odjeljak **Heym Mogućnosti** pretvara Chat tab motor u jedan MCP alat nazvan `heym_chat`. Omogućite ga na zadanom poslužitelju, na bilo kojem imenovanom poslužitelju ili na oba — svaka površina zadržava svoj vlastiti preklopnik i odabir modela.

Kada je uključen, `heym_chat` se pojavljuje u `tools/list` uz Vaše workflow alate. MCP klijent šalje jednu poruku na prirodnom jeziku, a Heym motor preuzima odatle, s istim mogućnostima koje ima Chat tab:

- Izgradnja workflowa, testno pokretanje s oglednim ulazima, popravljanje i završetak kada pokretanje uspije (pogledajte [Način izgradnje](#build-mode))
- Inspekcija i pokretanje Vaših postojećih workflowa
- Izvještavanje o analitici, nedavnim izvršavanjima i nadolazećim cron rasporedima.
- Objašnjava gdje workflowi ne uspijevaju i zašto su spori: workflowe koji su se najčešće izvodili, najviše puta podbacili i koji su najsporiji, kao i tipove čvorova s najviše vremena, pogrešaka i poziva tijekom posljednjih 1, 3 ili 6 sati, 24 sata, 7 ili 30 dana ili za sve vrijeme
- Izvještavanje o povijesti izvršavanja jednog workflow-a: koliko je puta pokrenut, brojevi statusa, kada je pokrenut, i na zahtjev ulazi, izlazi i greške po čvoru jednog izvršavanja.
- Izvještavanje o tome što se trenutno izvršava: koliko je izvršavanja aktivno, njihova imena workflow-a, koliko dugo svako traje, na kojem se čvoru trenutno nalazi, i poveznica na aktivno izvršavanje.
- Popis ploča, kreiranje kartica i čitanje detalja kartica na [Board tab](./board-tab.md).
- Prikazuje vaše nadzorne ploče (stranice Heym Worka) i njihove widgete, pronalazi na kojoj se nadzornoj ploči nalazi workflow, dodaje novi widget i gradi njegov workflow, postavlja postojeći workflow kao widget, preimenuje ili briše widgete ili uređuje raspored (pogledajte [Dashboard › Iz Chata i MCP-a](./dashboard-tab.md#from-chat-and-mcp))
- Pregledava podatkovne tablice i retke, stvara tablice, dodaje ili uklanja stupce, umeće, ažurira ili briše retke te povezuje tablice u workflowe
- Stvara, uređuje i pokreće evaluacijske pakete promptova i agenata ([Eval suites](./evals-tab.md#from-chat-and-mcp)), uključujući polaznu osnovu agenta: prijavljenu, izgrađenu iz izvođenja ili navedenu brojkama. Rezultat navodi vezu Evals za svaki spremljeni paket.
- Stvaranje ili ažuriranje vjerodajnica na vlastitoj stranici Heyma (pogledajte [Vjerodajnice](#vjerodajnice))
- Čitanje timova i globalnih varijabli, te pretraživanje dokumentacije.
- Odobravanje, uređivanje ili odbijanje čekajućih recenzija ljudi u petlji.

Mogućnosti dodane u Chat tab kasnije postaju dostupne putem `heym_chat` automatski — ne postoji preklopnik po mogućnosti za održavanje sinkronizacije.

Ove mogućnosti rade unutar `heym_chat`: `tools/list` prikazuje `heym_chat` i vaše alate za workflow, nikada interne alate chata kao što su oni za evaluacijske pakete.

### Način izgradnje

`heym_chat` uvijek pokreće Chat pogon u načinu izgradnje (build mode). U jednom pozivu asistent može spremiti novi workflow, pokrenuti ga s realističnim oglednim ulazima, pročitati izvješće o pokretanju, popraviti ono što nije uspjelo i ponovno ga pokrenuti, do pet testnih pokretanja po pozivu. Kada posljednje pokretanje posljednjeg spremanja uspije, završava sažetkom u jednoj rečenici, a odgovor završava s `Verified: the latest test run of the saved workflow passed.`

Kada poziv stvori ili uredi workflow, odgovor navodi svaki s njegovom punom vezom uređivača, kao što je `https://heym.example.com/workflows/<id>`, a veze unutar odgovora asistenta također su pune veze. Koriste vašu konfiguriranu Heym adresu (`FRONTEND_URL`) i otvaraju se korisnicima prijavljenim u Heym koji imaju pristup tom workflowu.

- Testna pokretanja su stvarna pokretanja. Njihovi popratni učinci se događaju i pojavljuju se u povijesti pokretanja workflowa kao i svako drugo pokretanje.
- Spremanja slijede put uređivača: promjena grafa zadržava prethodni graf u **Edit History** workflowa.
- Da biste promijenili workflow koji je ranije izgradio, nastavite nit s istim `conversation_id`. Asistent ažurira taj workflow umjesto stvaranja novog i mijenja samo workflowe koje možete uređivati.
- Kada se iskoristi pet testnih pokretanja, asistent staje i objašnjava što i dalje ne uspijeva.

Tablice podataka su drugačije. Tablica ne sadrži tajne, tako da `heym_chat` može popisati Vaše tablice, pitati koju bi workflow trebao koristiti i stvoriti novu s njenim stupcima. Nikada ne čita niti piše redove.

### Vjerodajnice

`heym_chat` vidi vjerodajnice u vašem vlasništvu i one podijeljene s vama, po imenu i vrsti, na isti način kao i kartica Chat. Kada workflow koji gradi treba vjerodajnicu, postavlja pitanje u rezultatu koju koristiti. Odgovorite s istim `conversation_id`.

Za dodavanje vjerodajnice ili ažuriranje one u vašem vlasništvu, asistent otvara obrazac vjerodajnica Heyma na stranici Heyma, `/credentials/setup/<id>`. Tamo se prijavljujete u Heym, unosite ključ ili povezujete račun i spremate. Vrijednost ide izravno u Heym: MCP klijent i njegov model saznaju samo naziv i vrstu vjerodajnice. Nemojte lijepiti ključeve u MCP klijent; umjesto toga zatražite obrazac.

| Klijent | Što se događa |
|---------|---------------|
| Podržava MCP URL elicitaciju | Klijent od vas traži da otvorite stranicu Heyma. Poziv čeka dok ispunjavate obrazac (do deset minuta), a zatim nastavlja s novom vjerodajnicom. |
| Bilo što drugo | Rezultat nosi poveznicu i traži od klijenta da ponovno pozove `heym_chat` s `wait_for_credential_form`. Taj poziv čeka do pet minuta dok ispunjavate obrazac, a zatim nastavlja razgovor. Ako klijent ne čeka, spremite obrazac i odgovorite s istim `conversation_id`; sljedeći poziv zna da je obrazac spremljen i koju je vjerodajnicu stvorio. |

Stranica se otvara samo za Heym račun koji je pokrenuo zahtjev, stoga je proslijeđena poveznica beskorisna bilo kome drugome. Obrazac ostaje otvoren 24 sata i možete ga odbiti sa stranice. Nakon što ga spremite ili odbijete, korak u razgovoru kartice Chat prikazuje rezultat.


### Vjerodajnica i model

`heym_chat` pokreće motor na Vašem Heym računu, tako da mu je potrebna vlastita LLM vjerodajnica:

| Polje | Ponašanje |
|-------|----------|
| **Vjerodajnica** | Odaberite bilo koju OpenAI, Google ili Custom vjerodajnicu kojoj imate pristup. Ispunjava se iz preferirane vjerodajnice u [Postavkama](../reference/user-settings.md) kada niste odabrali nijednu. |
| **Model** | Učitava se iz odabrane vjerodajnice. Ispunjava se iz Vašeg preferiranog modela kada se vjerodajnica podudara. |

Ako bilo što nedostaje, alat se i dalje pojavljuje u `tools/list`, ali svaki poziv vraća grešku koja Vas obavještava da završite postavljanje u ovoj kartici.


LLM i Agent čvorovi u workflowu koji `heym_chat` gradi pokreću se na ovoj vjerodajnici i modelu, uključujući vjerodajnicu podijeljenu s vama, tako da testna pokretanja rade bez dodatnog koraka postavljanja. Kada `heym_chat` uređuje workflow, LLM i Agent čvorovi koji već imaju vjerodajnicu zadržavaju je zajedno sa svojim modelom.
### Argumenti i povijest

| Argument | Obavezno | Opis |
|----------|----------|-------------|
| `message` | Da | Uputa ili pitanje, na prirodnom jeziku. |
| `conversation_id` | Ne | `conversation_id` iz prethodnog `heym_chat` rezultata, za nastavak tog razgovora. |
| `wait_for_credential_form` | Ne | S `conversation_id`: pričekajte dok korisnik ne spremi ili odbije obrazac vjerodajnice koji je otvorila nit, a zatim pošaljite `message`. |

Svaki poziv zapisuje se u Vaš [Chat tab](./chat-tab.md) povijest kao normalan razgovor, označen ikonom utikača u popisu razgovora. Poruke, kartice alata i pauze za pojašnjenje izgledaju točno kao razgovor koji ste sami započeli, a možete otvoriti nit i nastaviti razgovor u pregledniku. Svaki rezultat vraća svoj `conversation_id` tako da MCP klijent može nastaviti istu nit umjesto da otvara novu pri svakom pozivu.

Kada asistent treba pojašnjenje, pauzira i to kaže; odgovorite s odgovorima koristeći isti `conversation_id`.
### Omogući A2A

Dok je Heym Agent uključen, kartica prikazuje potvrdni okvir **Omogući A2A**. Označite ga i drugi agenti moći će slati zadatke Heym Agentu putem protokola Agent2Agent (A2A 1.0). Kartica zatim navodi URL za **Agent Card** i krajnju točku **JSON-RPC endpoint**, svaka s gumbom za kopiranje, te naredbu `curl` koja dohvaća karticu. A2A koristi isti ključ i OAuth prijavu kao MCP. Isključivanjem agenta isključuje se i A2A. Pogledajte [A2A](../reference/a2a.md) za metode, stanja zadataka i primjer.

### Napredak

Dugi poziv `heym_chat` prijavljuje što agent radi kao napredak u MCP-u (`notifications/progress`), istim riječima koje prikazuje kartica Chat, na primjer `Testiranje workflowa · pokušaj 2/5`. Klijenti koji poništavaju svoje vremensko ograničenje pri primitku obavijesti o napretku nastavljaju čekati dok agent radi.

## Imenovani MCP poslužitelji

Imenovani poslužitelji omogućuju segmentiranje workflows-a u izolirane MCP endpoint-e. Svaki poslužitelj ima svoju URL adresu i API ključ, tako da različiti AI klijenti, timovi ili slučajevi upotrebe mogu povezati točno one workflows-e koji su im potrebni.

### Kreiranje Imenovanog Poslužitelja

1. Unesite ime u ulazno polje na dnu MCP taba (npr. **CRM Alati**)
2. Kliknite **Kreiraj** — nova kartica poslužitelja odmah se pojavljuje
3. Kliknite na karticu da je proširite

### Postavke po Poslužitelju

Svaka kartica poslužitelja prikazuje:

| Postavka | Opis |
|----------|------|
| **SSE Endpoint** | Jedinstvena URL adresa: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Ključ** | Nezavisni ključ, prikazan jednom kada je generiran ili regeneriran. Kopirajte ga odmah; pohranjuje se u hashiranom obliku i ne može se kasnije otkriti |
| **Kako se povezati** | **Kopiraj JSON** kopira spremnu MCP konfiguraciju; **Dodaj u Cursor** instalira je jednim klikom |
| **Heym Capabilities** | Uključite ili isključite Heym Agenta (`heym_chat`) za ovaj poslužitelj i odaberite njegove vjerodajnice i model |
| **Omogući A2A** | Vlastiti A2A prekidač ovog poslužitelja, s vlastitom Agent Card na `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Omogući A2A** | Vlastiti A2A prekidač ovog poslužitelja, s vlastitom Agent Card na `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Dodijeljeni Workflows** | Uključite koji od Vaših workflows-a ovaj poslužitelj izlaže |

### Dodjela Workflows-a

Dodjela workflows-a je po poslužitelju i neovisna o preklopniku zadatnog poslužitelja. Workflow se može omogućiti na zadatom poslužitelju i na više imenovanih poslužitelja istovremeno, ili na nijednom.

Prebacivanje workflows-a pomiče ga na vrh dodijeljene liste, tako da redak koji ste upravo promijenili ostaje vidljiv umjesto da se pomiče.

### Autentifikacija

Imenovani poslužitelji podržavaju iste metode autentifikacije kao i zadani poslužitelj:

- **X-MCP-Key header** – Proslijedite API ključ poslužitelja izravno (API klijenti, Cursor). Samo header: ključevi se ne prihvaćaju kao `?key=` upitni parametar, jer URL-ovi završavaju u zapisnicima pristupa, zapisnicima proxy-a i povijesti preglednika.
- **Claude, ChatGPT i Gemini OAuth** – Dodajte URL poslužitelja u konektore ili prilagođene aplikacije klijenta; ostavite vjerodajnice prazne i klijent se automatski registrira putem OAuth-a. Bearer token mora putovati u `Authorization` header-u, a ne kao `?token=`.
- **Session token** – Izdaje se tijekom SSE handshake-a; ograničen na specifični poslužitelj tako da tokeni s jednog imenovanog poslužitelja ne mogu pristupiti drugom. Ovaj kratkotrajni `?session=` parametar nije pogođen.

### Brisanje Imenovanog Poslužitelja

Kliknite na ikonu **X** na zaglavlju kartice poslužitelja. Brisanje uklanja poslužitelj i sve njegove dodjele workflows-a; sami workflows-i nisu pogođeni.

## SSE Endpoint

| Poslužitelj | Endpoint |
|-------------|----------|
| Zadani | `{origin}/api/mcp/sse` |
| Imenovani | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Oba endpoint-a podržavaju SSE transport (GET, MCP specifikacija 2024-11-05) i Streamable HTTP transport (POST, MCP specifikacija 2025-03-26). Claude, ChatGPT i Gemini koriste OAuth 2.1 / PKCE za sigurnu prijavu na oba.

## Povezano

- [Zašto Heym](../getting-started/why-heym.md) – MCP kao prvorazredna primitiva u Heym-u
- [Agent Node](../nodes/agent-node.md) – Agent čvor s podrškom za MCP alat
- [Agent Arhitektura](../reference/agent-architecture.md) – MCP klijent, raspodjela alata, orkestrator
- [Triggeri](../reference/triggers.md) – MCP kao ulazna točka za workflow
- [Chat Tab](./chat-tab.md) – Motor iza alata `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Kreirajte i upravljajte workflows-ima
- [Tipovi Čvorova](../reference/node-types.md) – Pregled AI čvorova
- [Kontekstualna Izložba](../reference/contextual-showcase.md) – Kompaktni vodič za površine nadzorne ploče