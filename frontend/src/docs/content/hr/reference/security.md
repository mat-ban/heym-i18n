# Sigurnost

Sigurnosne prakse i konfiguracija za Heym platformu.

## Politika lozinki

Sve lozinke — prilikom registracije i prilikom promjene lozinke — moraju zadovoljiti sljedeće zahtjeve:

| Pravilo | Zahtjev |
|---------|---------|
| Minimalna duljina | 8 znakova |
| Velika slova | Najmanje jedno veliko slovo (A–Z) |
| Mala slova | Najmanje jedno malo slovo (a–z) |
| Broj | Najmanje jedan broj (0–9) |

Ova pravila se primjenjuju na frontend i backend (Pydantic validator). Zahtjev s neusklađenom lozinkom odbija se s odgovorom `422 Unprocessable Entity` prije nego što dođe do bilo kojeg pisanja u bazu podataka.

**Primjer valjane lozinke:** `MyWorkflow7!`

## Upravljanje sesijama

- Pristupni tokeni pohranjuju se u **HttpOnly** kolačićima, a ne u `localStorage`. To sprječava JavaScript (uključujući XSS payloads) da čita token.
- Refresh token je ograničen na putanju `/api/auth/refresh` i ne može se slati na druge endpointove.
- Svaki poziv na `/api/auth/refresh` **rotira** refresh token: stari token se odmah opoziva, a novi se izdaje. Ponovno korištenje korištenog refresh tokena vraća `401`.

## Ograničenje brzine

Sljedeći endpointovi imaju ograničenje brzine po IP adresi:

| Endpoint | Ograničenje | Trajanje zabrane |
|----------|-------------|------------------|
| `POST /api/auth/login` | 10 zahtjeva / 60 s | 15 min |
| `POST /api/auth/register` | 5 zahtjeva / 60 s | 10 min |
| `POST /register` (OAuth klijenti) | 5 zahtjeva / 60 s | 10 min |
| Prijava na portal | 3 pokušaja | 24 h |

Kada je `REDIS_URL` konfiguriran, ograničenja brzine dijele se među svim backend radnicima. Bez njega, ograničenja se primjenjuju po radnom procesu.

## Enkripcija vjerodajnica

Sve API ključeve, webhook URL-ove i bearer tokene pohranjene u [Vjerodajnicama](../tabs/credentials-tab.md) panelu enkriptiraju se u mirovanju koristeći AES-256 (Fernet) prije nego što se zapisu u bazu podataka. Ključ se dobiva iz varijable okruženja `ENCRYPTION_KEY`. Skripte `run.sh` i `deploy.sh` automatski generiraju snažnu vrijednost kada je prazna; aplikacija odbija pokretanje ako je `ENCRYPTION_KEY` prazna ili ostavljena na poznatom mjestu.

## MCP API ključ

MCP API ključ koristi se za autentifikaciju vanjskih MCP klijenata koji se povezuju na `/api/mcp/sse` endpoint. Kada se uspostavi SSE veza, izdaje se kratkotrajni (1-satni) sesijski token koji se ugrađuje u URL poruke umjesto pravog API ključa, sprječavajući da ključ bude vidljiv u zapisima pristupa poslužitelju. Pogledajte [MCP Tab](../tabs/mcp-tab.md) za postavke.

## OAuth / PKCE

OAuth 2.0 autorizacijski poslužitelj (koji se koristi za MCP klijente) podržava samo `authorization_code` grant s PKCE (`S256`). Obrazac za pristanak koristi HMAC-SHA256 CSRF tokene koji su valjani 10 minuta. Sve vrijednosti prikazane na stranici za pristanak su HTML-escaped.

## Tokeni izvršenja

[Tokeni izvršenja](./execution-tokens.md) su scoped JWT-ovi za pozivanje endpointa za izvršavanje workflow-a iz vanjskih sustava. Za razliku od tokena korisničke sesije, oni su:

- **Scoped za jedan workflow** — token se odbija za bilo koji drugi workflow.
- **Neovisno opozivi** — opoziv tokena nema učinak na sesiju korisnika koji ga je izdao.
- **Kratkotrajni ili dugotrajni** — odaberite TTL od 60 sekundi do 10 godina.

Tokeni se potpisuju istim tajnim ključem aplikacije (`SECRET_KEY`) i provjeravaju se pri svakom zahtjevu: potpis, isteka, podudaranje `wid` zahtjeva i status opoziva. Pogledajte [Tokeni izvršenja](./execution-tokens.md) za postavke i API referencu.

## Sigurnost sadržaja

Koristite [Guardrails](./guardrails.md) na LLM i Agent čvorovima kako biste blokirali nesigurne ili politike kršeće korisničke poruke prije nego što dođu do modela. Guardrails podržavaju devet kategorija sadržaja (nasilje, govora mržnje, seksualni sadržaj itd.) s konfigurabilnim razinama osjetljivosti.

## Sandbox za Python alate

Korisnički definirani Python alati na [Agent čvoru](../nodes/agent-node.md) izvršavaju nepouzdani kod. Po defaultu, Heym pokreće svaki alat unutar učvršćenog, jednokratnog Docker kontejnera s:

- bez pristupa mreži,
- samo za čitanje root datotečnim sustavom s malim `tmpfs` radnim direktorijem,
- korisnikom koji nije root s uklonjenim svim Linux mogućnostima i `no-new-privileges`,
- strogim ograničenjima CPU-a, memorije i PID-a, i
- **bez Docker socket** montiranog, tako da alat ne može doći do host Docker demona.

Backend izvršenja kontrolira se varijablom okruženja `HEYM_PYTHON_TOOL_SANDBOX`:

| Vrijednost | Ponašanje |
|------------|-----------|
| `auto` (default) | Pokreće se u učvršćenom Docker kontejneru. Ako Docker nije dostupan, izvršenje **ne uspije** — ne pokreće se tiho nepouzdani kod bez OS izolacije. |
| `docker` | Isto kao `auto`, ali nikada se ne vraća. |
| `subprocess` | Pokreće se u lokalnom in-process subprocessu zaštićenom popisom dopuštenih uvoza. Ovo **nije sigurnosna granica** i namijenjeno je samo pouzdanim kodovima ili lokalnom razvoju. `run.sh` ga odabire za native dev. |

Postavite `HEYM_PYTHON_TOOL_IMAGE` za fiksiranje slike sandboxa; kada je prazna, Heym automatski otkriva sliku koja se pokreće u pozadini. Ograničenja unutar procesa (popis dopuštenih uvoza plus filtriranje atributa i introspekcije) primjenjuju se kao dodatna obrana, ali kontejner je stvarna granica izolacije — zadržite default `auto` (ili `docker`) način za višekorisničke i produkcijske implementacije.
## Sandbox za vještine

Python vještine povezane s [Agent čvorom](../nodes/agent-node.md) također izvršavaju nepouzdani kod — vještina može doći doslovno unutar zajedničkog workflow-a ili predloška s vidljivošću `everyone` — stoga se vještine izvršavaju kroz **isti** `HEYM_PYTHON_TOOL_SANDBOX` prekidač kao Python alati i neuspjeh se zatvara na isti način. Kontejner vještine je ojačan identično (ne-root, sve mogućnosti uklonjene, `no-new-privileges`, samo za čitanje root datotečni sustav, ograničenja CPU/memorije/PID-a, i **bez Docker socket-a**), s dva namjerna izuzetka jer vještine legitimno trebaju:

- **Mrežni izlaz je dopušten** (vještine pozivaju API-je i instaliraju svoje vlastite ovisnosti putem `uv`), i
- **montiran je zapisiv radni prostor** kako bi vještine mogle generirati izlazne datoteke i čitati datoteke s Heym Drive-a.

Radni prostor dijeli se s kontejnerom za jednokratnu upotrebu kroz isti imenovani Docker volumen koji koristi Codex runner (`heym-codex-workspaces`, montiran na `/app/data/codex-workspaces`). Samo poddirektorij ovog izvođenja montira se u srodni — putem `volume-subpath` po izvođenju — tako da jedna vještina nikada ne vidi podatke radnog prostora druge izvedbe ili Codexa. Docker Compose stog uvijek montira ovaj volumen; jedinstveni kontejner `docker run` mora uključivati `-v heym-codex-workspaces:/app/data/codex-workspaces` za Python vještine kao i Codex. Ako volumen nedostaje u `auto`/`docker` modu, izvršavanje vještine **neuspijeva zatvoreno** umjesto da se izvršava u pozadini. Budući da montiranje podputanja po izvođenju zahtijeva **Docker Engine 25.0 ili noviji**, stariji motori trebaju ili nadograditi ili izvršavati pouzdane vještine s `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Samo ne-tajni, prenosivi varijable okruženja (proxy i CA-bundle postavke, lokalizacija) prosljeđuju se u kontejner; URL-ovi baza podataka, `SECRET_KEY`/`ENCRYPTION_KEY`, API ključevi pružatelja i OAuth tajne zadržavaju se putem dopuštene liste. Putanje datoteka vještina validiraju se kako bi ostale unutar radnog prostora, a simboličke veze postavljene u izlaznom direktoriju (uključujući `_hitl_request.json` sentinel) nikada se ne prate. Prekoračite zadane postavke s `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS`, i `HEYM_SKILL_USER` ako je potrebno.

Kao i s alatima, `subprocess` način izvršava vještinu u pozadinskom procesu i **nije sigurnosna granica** — koristite ga samo za pouzdane korisničke ili lokalne razvojne svrhe (`run.sh` ga odabire za lokalni razvoj).

## Sandbox za Code čvor

[Code čvor](../nodes/code-node.md) izvršava proizvoljni korisnički Python zajedno s proizvoljnim ovisnostima trećih strana, stoga je najstroži od tri sandboxa i jedini bez **izlaznog ventila**: ne čita nijednu varijablu načina sandboxa, nema `subprocess` način, i neuspijeva zatvoreno kada nijedan Docker demon nije dostupan. Nikada se ne vraća na izvršavanje korisničkog koda u pozadinskom procesu.

Izvršavanje se odvija u jednom ili dva jednokratna kontejnera, oba ojačana poput sandboxa za alate i vještine (ne-root, sve mogućnosti uklonjene, `no-new-privileges`, samo za čitanje root datotečni sustav, ograničenja CPU/memorije/PID-a, i **bez Docker socket-a**):

- S praznim `requirements.txt`, **jedan kontejner s `--network none`** izvršava kod. Runner dolazi u stdin payload kontejnera, tako da ništa nije montirano.
- S ovisnostima, prvi kontejner ih instalira s mrežnim pristupom u per-run `.deps` direktorij, a drugi kontejner montira tu podmapu **samo za čitanje** i izvršava kod. Izvršni kontejner nema mrežni pristup osim ako nije uključena opcija `codeAllowNetwork` čvora.

Ovisnosti se instaliraju s `uv`, ponovo pokušavajući s `pip`, i nikada se ne keširaju između izvođenja. Kada se pozadina izvršava u kontejneru, direktorij po izvođenju živi na istom `heym-codex-workspaces` volumenu koji koristi sandbox za vještine, montiran kroz `volume-subpath` po izvođenju tako da jedna izvedba nikada ne vidi datoteke druge; taj oblik zahtijeva **Docker Engine 25.0 ili noviji**. Izvorna pozadina (`./run.sh`) nema takav volumen i ne treba ga — njezin direktorij po izvođenju je lokalna privremena putanja koja se izravno montira u srodni. U svakom slučaju, direktorij se briše nakon svake izvršavanja bez obzira na ishod.

Samo ne-tajni, prenosivi varijable okruženja prosljeđuju se u kontejnere — postavke proxy-a, CA paketi i lokalizacija, koje instalacija ovisnosti treba za pristup PyPI-u iza korporativnog proxy-a. URL-ovi baza podataka, `SECRET_KEY`/`ENCRYPTION_KEY`, API ključevi pružatelja i OAuth tajne zadržavaju se putem dopuštene liste, tako da se nova tajna pozadine prema zadanim postavkama ne otkriva dok netko ne ažurira zabranjenu listu. Pozadina `HOME` nikada ne prepisuje vlastitu zapisivu putanju sandboxa.

Gumb **Format** koristi isti sandbox. Ruff analizira i prepisuje izvor umjesto da ga izvršava, ali izvršavanje na hostu bi dalo nepouzdanom datoteci proces koji nasljeđuje cijelo okruženje pozadine, stoga dobiva svoj vlastiti jednokratni kontejner s `--network none` s istim ograničenjima i istim dopuštenim okruženjem. Neuspijeva zatvoreno bez Dockera umjesto da formatira na hostu.

Ograničenja sandboxa su konstante, a ne varijable okruženja — 512 MB memorije, jedan CPU, 256 procesa, vremensko ograničenje instalacije od 120 sekundi, i vremensko ograničenje izvršavanja od 60 sekundi. Slika se rješava iz postojećeg lanca `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; čvor ne uvodi vlastitu konfiguraciju.
## Povezano

- [Pokretanje i implementacija](../getting-started/running-and-deployment.md) – Konfigurirajte `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` i `HEYM_PYTHON_TOOL_SANDBOX` pri pokretanju
- [Code čvor](../nodes/code-node.md) – Izvršavanje Python koda u sandboxu s vlastitim ovisnostima
- [Agent čvor](../nodes/agent-node.md) – Prilagođeni Python alati koji se izvršavaju u sandboxu
- [Tokeni izvršavanja](./execution-tokens.md) – Scoped JWT-ovi za pozivanje workflows iz vanjskih sustava
- [Zaštitne mjere](./guardrails.md) – Blokiranje nesigurnog sadržaja u LLM i Agent čvorovima
- [Postavke](./user-settings.md) – Promijenite svoju lozinku
- [Zavičaj vjerodajnica](../tabs/credentials-tab.md) – Upravljanje API ključevima
- [MCP zavičaj](../tabs/mcp-tab.md) – MCP API ključ i OAuth klijenti
- [Portal](./portal.md) – Kontrola pristupa javnom chat portalu
