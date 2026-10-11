# Tablica Izvršavanja

Tablica **Izvršavanja** prikazuje tragove izvršavanja LLM-a. Istražite zahtjeve/odgovore, vrijeme trajanja, pozive alata i debugirajte ponašanje [Agenta](../nodes/agent-node.md) i [LLM](../reference/node-types.md) čvorova, uz agregirane metrike (pozivi, tokeni, trošak, latencija, stopa pogrešaka) unutar bilo kojeg vremenskog okvira.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Pogledajte demo Izvršavanja</a></p>

## Statistika

Stranica se otvara sa sažetkom statistike iznad popisa tragova, izračunatim za odabrani vremenski raspon i druge aktivne filtre:

- **KPI kartice** – Ukupni pozivi, Ukupni tokeni, Ukupni trošak (USD), Prosječna latencija, Postotak pogrešaka
- **Tokeni po modelu** – Donut grafikon volumena tokena po modelu
- **Trošak po modelu** – Donut grafikon troškova u USD po modelu. Modeli bez cijena prikazuju poveznicu "Konfigurirajte cijene" na [Tablicu troškova LLM-a](./datatable-tab.md#llm-cost-table-system-table)
- **Pozivi tijekom vremena** – Stacked area grafikon uspješnih naspram neuspješnih poziva po intervalu (5 min / 1 h / 6 h / 1 dan, automatski odabran po rasponu)
- **Obavijest o modelima bez cijena** – Pojavljuje se ispod grafikona kada neki modela u tragovima nemaju redak cijene, povezujući se na Tablicu troškova LLM-a

## Vremenski Raspon

Jedan **Odabir vremenskog raspona** na vrhu trake filtra upravlja i zaglavljem statistike i popisom tragova. Opcije: Posljednji 1 sat, Posljednja 24 sata, Posljednjih 7 dana (zadano), Posljednjih 30 dana, Sve vrijeme. Promjena raspona resetira paginaciju i ponovno učitava grafikone i popis zajedno.

## Popis Tragova

- Paginirani popis nedavnih tragova unutar odabranog vremenskog raspona
- Svaki trag prikazuje: workflow, čvor, vjerodajnicu, vremensku oznaku, trajanje
- Kliknite na trag za otvaranje prikaza detalja
- Koristite **Prethodni / Sljedeći** unutar dijaloga detalja za kretanje između tragova bez zatvaranja

## Filtriranje

- **Vremenski raspon** – 1h / 24h / 7d / 30d / Sve; filtrira grafikone i popis zajedno
- **Vjerodajnica** – Filtrirajte prema korištenoj vjerodajnici (API ključ)
- **Izvor** – Filtrirajte prema workflow-u ili izvoru izvršavanja
- **Pretraživanje** – Pretražujte prema modelu, workflow-u, vjerodajnici ili oznaci čvora
- **Osvježi** – Ponovno učitajte trenutnu stranicu tragova

## Detalji Traga

Kada otvorite trag:

- **Koraci** – Vremenska linija od vrha prema dnu koja prikazuje trag kao uređeni lanac: Sustav → Korisnik → Asistent → Alat → Odgovor. Svaki korak je moguće sažeti; proširivanjem jednog prikazuje se čitljiv detalj (tekst poruke ili argumenti i rezultat alata) nakon čega slijedi JSON tog koraka. JSON sadržaj u svakoj vrsti događaja—uključujući MCP pozive i JSON-RPC payload-e—otvara se u proširivoj strukturi po defaultu, s prvim nivoom proširenim. Koristite **Stablo / Sirovo** za prebacivanje između formatirane strukture i originalnog teksta. Neispravan JSON ostaje vidljiv kao običan tekst. Koraci alata prikazuju svoje trajanje i oznaku MCP/Skill gdje je primjenjivo, plus oznake za čekanje / istekao / otkazano kada je status poziva alata postavljen. Korak Odgovor može prikazati agregatne oznake `tool_metrics` (broj poziva po statusu i ukupno trajanje alata). Kada trag bilježi svaki poziv modela, kao što to čini poruka Dashboard Chat-a i usmjereni agent, korak **LLM** nalazi se ispred alata koji su pozvani, a **Razrada trajanja** prikazuje svaki poziv modela, alat i odluku o usmjeravanju na jednoj vremenskoj liniji. Poruka Dashboard Chat-a je jedan trag, bez obzira na to koliko je krugova alata bilo potrebno. Tragovi bez lanca poruka (na primjer generiranje slika) prikazuju minimalnu vremensku liniju Zahtjev → Odgovor.
- **Zahtjev** – Cjelokupni payload zahtjeva poslan LLM-u, s **Stablo / Sirovo** JSON prikazima
- **Odgovor** – Odgovor modela, uključujući pozive alata ako ih ima, s **Stablo / Sirovo** JSON prikazima
- **Metrike alata** – Kada su prisutne u odgovoru, sažetak broja poziva alata (`success` / `error` / `pending` / `timeout` / `cancelled`) i ukupno trajanje alata
- **Razrada vremena** – `llm_ms`, `tools_ms`, `mcp_list_ms` za analizu performansi
- **Pozivi alata** – Ime alata, argumenti, rezultat, status i proteklo vrijeme
- **Uključene vještine** – Vještine proslijeđene modelu u zahtjevu
- **Idite na Workflow** – Izravno skočite na povezani workflow iz dijaloga detalja traga

## Kopiranje i Izvoz

- Kopirajte JSON zahtjeva ili odgovora u međuspremnik; kopiranje uvijek koristi cjelokupni sirovi payload bez obzira na aktivni prikaz
- Koristite za debugiranje ili dijeljenje s podrškom

## Održavanje

- **Izbriši sve** – Izbrišite sve spremljene tragove nakon potvrde
- Kontrole paginacije prikazuju trenutni vidljivi raspon (na primjer `1-25 od 240`)

## Povezano

- [Zašto Heym](../getting-started/why-heym.md) – LLM vidljivost tijekom životnog ciklusa agenta
- [Agent Čvor](../nodes/agent-node.md) – Agent čvor s pozivima alata
- [Vrste Čvorova](../reference/node-types.md) – LLM i Agent čvorovi
- [Tablica Vjerodajnica](./credentials-tab.md) – Vjerodajnice korištene u tragovima
- [OpenTelemetry Praćenje](../reference/opentelemetry.md) – Opt-in OTel izvoz za workflow, čvor i Agent alate
- [DataTable Tab](./datatable-tab.md) – Sadrži Tablicu troškova LLM-a korištenu od strane grafikona troškova
- [Kontekstualna Izložba](../reference/contextual-showcase.md) – Kompaktni vodič za površine nadzorne ploče
