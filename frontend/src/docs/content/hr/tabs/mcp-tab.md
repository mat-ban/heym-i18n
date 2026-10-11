# MCP Kartica

Kartica **MCP** konfigurira integraciju Model Context Protocol (MCP). MCP omogućuje AI klijentima (Claude, Cursor i bilo kojem alatu kompatibilnom s MCP-om) da pozivaju Vaše Heym workflows kao alate.

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

### Workflow MCP Preklopnik

Svaki workflow može biti izložen kao MCP alat:

- **Omogući** – Alati workflow-a postaju dostupni svim klijentima povezanim na zadani poslužitelj.
- **Onemogući** – Workflow nije izložen.

Kartice workflow-a prikazuju opis i pregled imena ulaznih polja kako biste mogli vidjeti što svaki alat očekuje prije nego što ga omogućite.

## Heym Chat Alat

Odjeljak **Heym Mogućnosti** pretvara Chat tab motor u jedan MCP alat nazvan `heym_chat`. Omogućite ga na zadanom poslužitelju, na bilo kojem imenovanom poslužitelju ili na oba — svaka površina zadržava svoj vlastiti preklopnik i odabir modela.

Kada je uključen, `heym_chat` se pojavljuje u `tools/list` uz Vaše workflow alate. MCP klijent šalje jednu poruku na prirodnom jeziku, a Heym motor preuzima odatle, s istim mogućnostima koje ima Chat tab:

- Izgradnja, uređivanje, inspekcija i pokretanje workflows putem Workflow AI Builder-a.
- Izvještavanje o analitici, nedavnim izvršavanjima i nadolazećim cron rasporedima.
- Izvještavanje o povijesti izvršavanja jednog workflow-a: koliko je puta pokrenut, brojevi statusa, kada je pokrenut, i na zahtjev ulazi, izlazi i greške po čvoru jednog izvršavanja.
- Izvještavanje o tome što se trenutno izvršava: koliko je izvršavanja aktivno, njihova imena workflow-a, koliko dugo svako traje, na kojem se čvoru trenutno nalazi, i poveznica na aktivno izvršavanje.
- Popis ploča, kreiranje kartica i čitanje detalja kartica na [Board tab](./board-tab.md).
- Popis Vaših tablica podataka s njihovim stupcima, kreiranje novih i povezivanje u workflows koje gradi.
- Čitanje timova i globalnih varijabli, te pretraživanje dokumentacije.
- Odobravanje, uređivanje ili odbijanje čekajućih recenzija ljudi u petlji.

Mogućnosti dodane u Chat tab kasnije postaju dostupne putem `heym_chat` automatski — ne postoji preklopnik po mogućnosti za održavanje sinkronizacije.

Vjerodajnice ostaju u UI-u: `heym_chat` nikada ne navodi, ne bira niti ne stvara ih. Kada gradi ili uređuje workflow, novi čvorovi koji trebaju vjerodajnicu ostaju prazni, a odgovor ih imenuje, tako da ih možete postaviti u uređivaču.

Tablice podataka su drugačije. Tablica ne sadrži tajne, tako da `heym_chat` može popisati Vaše tablice, pitati koju bi workflow trebao koristiti i stvoriti novu s njenim stupcima. Nikada ne čita niti piše redove.

### Vjerodajnica i model

`heym_chat` pokreće motor na Vašem Heym računu, tako da mu je potrebna vlastita LLM vjerodajnica:

| Polje | Ponašanje |
|-------|----------|
| **Vjerodajnica** | Odaberite bilo koju OpenAI, Google ili Custom vjerodajnicu kojoj imate pristup. Ispunjava se iz preferirane vjerodajnice u [Postavkama](../reference/user-settings.md) kada niste odabrali nijednu. |
| **Model** | Učitava se iz odabrane vjerodajnice. Ispunjava se iz Vašeg preferiranog modela kada se vjerodajnica podudara. |

Ako bilo što nedostaje, alat se i dalje pojavljuje u `tools/list`, ali svaki poziv vraća grešku koja Vas obavještava da završite postavljanje u ovoj kartici.

### Argumenti i povijest

| Argument | Obavezno | Opis |
|----------|----------|-------------|
| `message` | Da | Uputa ili pitanje, na prirodnom jeziku. |
| `conversation_id` | Ne | `conversation_id` iz prethodnog `heym_chat` rezultata, za nastavak tog razgovora. |

Svaki poziv zapisuje se u Vaš [Chat tab](./chat-tab.md) povijest kao normalan razgovor, označen ikonom utikača u popisu razgovora. Poruke, kartice alata i pauze za pojašnjenje izgledaju točno kao razgovor koji ste sami započeli, a možete otvoriti nit i nastaviti razgovor u pregledniku. Svaki rezultat vraća svoj `conversation_id` tako da MCP klijent može nastaviti istu nit umjesto da otvara novu pri svakom pozivu.

Kada asistent treba pojašnjenje, pauzira i to kaže; odgovorite s odgovorima koristeći isti `conversation_id`.
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
| **Heym Mogućnosti** | Uključite alat `heym_chat` za ovaj poslužitelj i odaberite njegove vjerodajnice i model |
| **Dodijeljeni Workflows** | Uključite koji od Vaših workflows-a ovaj poslužitelj izlaže |

### Dodjela Workflows-a

Dodjela workflows-a je po poslužitelju i neovisna o preklopniku zadatnog poslužitelja. Workflow se može omogućiti na zadatom poslužitelju i na više imenovanih poslužitelja istovremeno, ili na nijednom.

Prebacivanje workflows-a pomiče ga na vrh dodijeljene liste, tako da redak koji ste upravo promijenili ostaje vidljiv umjesto da se pomiče.

### Autentifikacija

Imenovani poslužitelji podržavaju iste metode autentifikacije kao i zadani poslužitelj:

- **X-MCP-Key header** – Proslijedite API ključ poslužitelja izravno (API klijenti, Cursor). Samo header: ključevi se ne prihvaćaju kao `?key=` upitni parametar, jer URL-ovi završavaju u zapisnicima pristupa, zapisnicima proxy-a i povijesti preglednika.
- **Claude OAuth** – Dodajte URL poslužitelja u Claude integracije; ostavite vjerodajnice prazne i Claude se automatski registrira putem OAuth-a. Bearer token mora putovati u `Authorization` header-u, a ne kao `?token=`.
- **Session token** – Izdaje se tijekom SSE handshake-a; ograničen na specifični poslužitelj tako da tokeni s jednog imenovanog poslužitelja ne mogu pristupiti drugom. Ovaj kratkotrajni `?session=` parametar nije pogođen.

### Brisanje Imenovanog Poslužitelja

Kliknite na ikonu **X** na zaglavlju kartice poslužitelja. Brisanje uklanja poslužitelj i sve njegove dodjele workflows-a; sami workflows-i nisu pogođeni.

## SSE Endpoint

| Poslužitelj | Endpoint |
|-------------|----------|
| Zadani | `{origin}/api/mcp/sse` |
| Imenovani | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Oba endpoint-a podržavaju SSE transport (GET, MCP specifikacija 2024-11-05) i Streamable HTTP transport (POST, MCP specifikacija 2025-03-26). Claude koristi OAuth 2.1 / PKCE za sigurnu prijavu na oba.

## Povezano

- [Zašto Heym](../getting-started/why-heym.md) – MCP kao prvorazredna primitiva u Heym-u
- [Agent Node](../nodes/agent-node.md) – Agent čvor s podrškom za MCP alat
- [Agent Arhitektura](../reference/agent-architecture.md) – MCP klijent, raspodjela alata, orkestrator
- [Triggeri](../reference/triggers.md) – MCP kao ulazna točka za workflow
- [Chat Tab](./chat-tab.md) – Motor iza alata `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Kreirajte i upravljajte workflows-ima
- [Tipovi Čvorova](../reference/node-types.md) – Pregled AI čvorova
- [Kontekstualna Izložba](../reference/contextual-showcase.md) – Kompaktni vodič za površine nadzorne ploče
