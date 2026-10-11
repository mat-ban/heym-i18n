# Turvalisus

Heymi platvormi turbepraktikad ja konfiguratsioon.

## Paroolipoliitika

Kõik paroolid — nii registreerimisel kui ka parooli muutmisel — peavad vastama järgmistele nõuetele:

| Reegel | Nõue |
|------|-------------|
| Minimaalne pikkus | 8 tähemärki |
| Suurtähed | Vähemalt üks suurtäht (A–Z) |
| Väiketähed | Vähemalt üks väiketäht (a–z) |
| Number | Vähemalt üks number (0–9) |

Neid reegleid rakendatakse nii frontendis kui ka backendis (Pydantic valideerija). Nõuetele mittevastava parooliga päring lükatakse tagasi vastusega `422 Unprocessable Entity` enne, kui andmebaasi kirjutamine toimub.

**Näide kehtivast paroolist:** `MyWorkflow7!`

## Sessioonihaldus

- Access tokenid salvestatakse **HttpOnly** küpsistesse, mitte `localStorage`-i. See takistab JavaScriptil (sealhulgas XSS payload'idel) tokenit lugemast.
- Refresh token on piiratud `/api/auth/refresh` teega ega saa saata teistele endpointidele.
- Iga `/api/auth/refresh` päring **roteerib** refresh tokeni: vana token tühistatakse koheselt ja väljastatakse uus. Kasutatud refresh tokeni uuesti esitamine tagastab `401`.

## Päringusageduse piiramine

Järgmistele endpointidele on kehtestatud IP-põhine päringusageduse piirang:

| Endpoint | Piirang | Blokeeringu kestus |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 päringut / 60 s | 15 min |
| `POST /api/auth/register` | 5 päringut / 60 s | 10 min |
| `POST /register` (OAuth kliendid) | 5 päringut / 60 s | 10 min |
| Portaali sisselogimine | 3 katset | 24 h |

Kui `REDIS_URL` on konfigureeritud, jagatakse päringusageduse piiranguid kõigi backend workerite vahel. Ilma selleta kehtivad piirangud iga worker-protsessi kohta eraldi.

## Mandaatide krüpteerimine

Kõik API võtmed, webhook URL-id ja bearer tokenid, mis on salvestatud [Mandaadid](../tabs/credentials-tab.md) paneelile, krüpteeritakse andmebaasi kirjutamise eel AES-256 (Fernet) abil. Võti tuletatakse `ENCRYPTION_KEY` keskkonnamuutujast. Skriptid `run.sh` ja `deploy.sh` genereerivad tugeva väärtuse automaatselt, kui see on tühi; rakendus keeldub käivitumast, kui `ENCRYPTION_KEY` on tühi või jäetud tuntud kohatäitjale.

## MCP API võti

MCP API võtit kasutatakse väliste MCP klientide autentimiseks, mis ühenduvad `/api/mcp/sse` endpointiga. Kui SSE ühendus luuakse, väljastatakse lühiajaline (1-tunnine) sessiooni token, mis põimitakse sõnumi endpointi URL-i, mitte ei kasutata tegelikku API võtit, vältides võtme ilmumist serveri juurdepääsulogides. Seadistamise kohta vt [MCP vahekaart](../tabs/mcp-tab.md).

## OAuth / PKCE

OAuth 2.0 autoriseerimisserver (mida kasutatakse MCP klientide jaoks) toetab ainult `authorization_code` grant'i koos PKCE-ga (`S256`). Nõusolekuvorm kasutab HMAC-SHA256 CSRF tokeneid, mis kehtivad 10 minutit. Kõik nõusoleku lehel kuvatavad väärtused on HTML-escaped.

## Käivituste tokenid

[Käivituste tokenid](./execution-tokens.md) on skoobitud JWT-d workflow'de käivitamise endpointi kutsumiseks välistest süsteemidest. Erinevalt kasutaja sessiooni tokenitest on need:

- **Ühe workflow'ga piiratud** — token lükatakse tagasi iga teise workflow' puhul.
- **Iseseisvalt tühistatavad** — tokeni tühistamine ei mõjuta väljastanud kasutaja sessiooni.
- **Lühiajalised või pikaajalised** — valige TTL vahemikus 60 sekundit kuni 10 aastat.

Tokenid on allkirjastatud sama rakenduse saladusega (`SECRET_KEY`) ja neid kontrollitakse igal päringul: allkiri, aegumine, `wid` claim'i vastavus ja tühistamise olek. Seadistamise ja API viite kohta vt [Käivituste tokenid](./execution-tokens.md).

## Sisu turvalisus

Kasutage [Guardrails](./guardrails.md) LLM ja Agent node'idel, et blokeerida ebaturvalised või poliitikat rikkuvad kasutajasõnumid enne, kui need mudelini jõuavad. Guardrails toetab üheksat sisukategooriat (vägivald, vihakõne, seksuaalne sisu jne) konfigureeritavate tundlikkustasemetega.

## Python tööriistade liivakast

Kasutaja määratletud Python tööriistad [Agent node'is](../nodes/agent-node.md) käivitavad mitteusaldusväärset koodi. Vaikimisi käivitab Heym iga tööriista karastatud, ühekordses Docker konteineris, millel on:

- võrguühendus puudub,
- kirjutuskaitstud juurfailisüsteem väikese `tmpfs` töökataloogiga,
- mitte-root kasutaja, kellelt on eemaldatud kõik Linuxi võimekused ja `no-new-privileges`,
- ranged CPU, mälu ja PID piirangud ning
- **Docker socket** ei ole mount'itud, seega tööriist ei pääse ligi hosti Docker daemonile.

Käitamise backend on juhitud `HEYM_PYTHON_TOOL_SANDBOX` keskkonnamuutuja poolt:

| Väärtus | Käitumine |
|-------|----------|
| `auto` (vaikimisi) | Käivita karastatud Docker konteineris. Kui Docker pole saadaval, käivitamine **ebaõnnestub suletult** — see ei käivita vaikselt mitteusaldusväärset koodi ilma OS-i isolatsioonita. |
| `docker` | Sama mis `auto`, kuid ei lange kunagi tagasi. |
| `subprocess` | Käivita kohalikus protsessisisese alamprotsessina, mida valvab importide lubatud nimekiri. See **ei ole turvapiir** ja on mõeldud ainult usaldusväärse koodi või kohaliku arenduse jaoks. `run.sh` valib selle natiivse arenduse jaoks. |

Määrake `HEYM_PYTHON_TOOL_IMAGE`, et kinnitada liivakasti pilt; kui tühi, tuvastab Heym automaatselt jooksva backend pildi. Protsessisisesed piirangud (importide lubatud nimekiri pluss atribuutide ja introspektsiooni filtreerimine) rakendatakse sügavuti kaitseks, kuid konteiner on tegelik isolatsioonipiir — hoidke vaikimisi `auto` (või `docker`) režiimi mitme kasutaja ja tootmiskeskkonna juurutuste jaoks.
## Skill Sandbox

[Agent node'i](../nodes/agent-node.md) külge kinnitatud Python-skillsid käivitavad samuti mitteusaldusväärset koodi — skill võib jõuda muutmata kujul jagatud workflow'sse või `everyone`-nähtavusega mallidesse — seega käivituvad skillsid **sama** `HEYM_PYTHON_TOOL_SANDBOX` lüliti kaudu nagu Python-tööriistad ja nurjuvad suletud režiimis ühtemoodi. Skill-konteiner on karastatud identselt (mitte-root, kõik võimekused eemaldatud, `no-new-privileges`, kirjutuskaitstud juurfailisüsteem, CPU/mälu/PID-i piirangud ja **Docker-socket puudub**), kuid kahe teadliku erinevusega, kuna skillsid vajavad neid õiguspäraselt:

- **Võrgu väljundliiklus on lubatud** (skillsid kutsuvad API-sid ja paigaldavad oma sõltuvusi `uv` kaudu) ning
- **kirjutatav tööruum on mount'itud**, et skillsid saaksid genereerida väljundfaile ja lugeda Heym Drive'i faile.

Tööruum on jagatud ühekordse kõrvalkonteineriga sama nimega Docker-volume'i kaudu, mida Codex runner kasutab (`heym-codex-workspaces`, mount'itud asukohas `/app/data/codex-workspaces`). Kõrvalkonteinerisse mount'itakse ainult selle käivituse enda alamkataloog — käivituse-põhise `volume-subpath` kaudu —, nii et üks skill ei näe kunagi teise käivituse ega Codexi tööruumi andmeid. Docker Compose'i stack mount'ib selle volume'i alati; üksikkonteineri `docker run` peab sisaldama `-v heym-codex-workspaces:/app/data/codex-workspaces` nii Python-skillside kui ka Codexi jaoks. Kui volume puudub režiimis `auto`/`docker`, **nurjub** skilli käivitamine suletud režiimis, selle asemel et joosta backend'is. Kuna käivituse-põhised subpath-mount'id nõuavad **Docker Engine 25.0 või uemat**, peaksid vanemad engine'id kas uuendama või käivitama usaldusväärseid skillsid valikuga `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Konteinerisse edastatakse ainult mitte-salajased, teisaldatavad keskkonnamuutujad (proxy- ja CA-bundle'i seaded, lokaadid); andmebaasi URL-id, `SECRET_KEY`/`ENCRYPTION_KEY`, teenusepakkuja API-võtmed ja OAuth-saladused jäetakse allowlist'i abil edastamata. Skill-failide teed valideeritakse, et need püsiksid tööruumi sees, ning väljundkataloogi istutatud sümbollinke (sealhulgas `_hitl_request.json` sentinel) ei järgita kunagi. Vajadusel saab vaikeväärtusi üle kirjutada muutujatega `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` ja `HEYM_SKILL_USER`.

Nagu tööriistade puhul, käivitab režiim `subprocess` skilli backend-protsessis ega ole **turvapiir** — kasutage seda ainult usaldusväärsete üksikkasutaja või kohaliku arenduse puhul (`run.sh` valib selle natiivse arenduse jaoks).

## Code Node Sandbox

[Code node](../nodes/code-node.md) käivitab suvalist kasutaja Pythonit koos suvaliste kolmanda osapoole sõltuvustega, mistõttu on see kolmest sandbox'ist kõige rangem ja ainus, millel **puudub varuväljapääs**: see ei loe ühtegi sandbox-režiimi muutujat, sellel puudub `subprocess`-režiim ja see nurjub suletud režiimis, kui ükski Docker-daemon pole kättesaadav. See ei lange kunagi tagasi kasutaja koodi käivitamisele backend-protsessis.

Käivitamine toimub ühe või kahe ühekordse konteineri kaudu, mis mõlemad on karastatud nagu tööriista- ja skill-sandbox'id (mitte-root, kõik võimekused eemaldatud, `no-new-privileges`, kirjutuskaitstud juurfailisüsteem, CPU/mälu/PID-i piirangud ja **Docker-socket puudub**):

- Tühja `requirements.txt` korral käivitab koodi **üksikkonteiner valikuga `--network none`**. Runner saabub konteineri stdin-payload'na, seega ei mount'ita üldse midagi.
- Sõltuvuste korral paigaldab esimene konteiner need võrguühenduse olemasolul käivituse-põhisesse `.deps` kataloogi ning teine konteiner mount'ib selle alampuu **kirjutuskaitstuna** ja käivitab koodi. Käivituskonteineril puudub võrk, välja arvatud juhul, kui node'i valik `codeAllowNetwork` on sisse lülitatud.

Sõltuvused paigaldatakse `uv`-ga, korratakse `pip`-ga ega cache'ita kunagi käivituste vahel. Kui backend töötab konteineris, asub käivituse-põhine kataloog samal `heym-codex-workspaces` volume'il, mida skill-sandbox kasutab, mount'ituna käivituse-põhise `volume-subpath` kaudu, nii et üks käivitus ei näe kunagi teise faile; see vorm nõuab **Docker Engine 25.0 või uemat**. Natiivsel backend'il (`./run.sh`) sellist volume'i pole ega ole ka vaja — selle käivituse-põhine kataloog on kohalik ajutine tee, mis bind-mount'itakse otse kõrvalkonteinerisse. Mõlemal juhul kustutatakse kataloog pärast iga käivitust sõltumata tulemusest.

Konteineritesse edastatakse ainult mitte-salajased, teisaldatavad keskkonnamuutujad — proxy-seaded, CA-bundle'id ja lokaadid, mida sõltuvuste paigaldamine vajab PyPI-le jõudmiseks ettevõtte proxy taga. Andmebaasi URL-id, `SECRET_KEY`/`ENCRYPTION_KEY`, teenusepakkuja API-võtmed ja OAuth-saladused jäetakse allowlist'i abil edastamata, nii et uus backend-saladus jäetakse vaikimisi edastamata, mitte ei leki enne, kui keegi denylist'i uuendab. Backend'i `HOME` ei kirjuta kunagi üle sandbox'i enda kirjutatavat teed.

Nupp **Format** kasutab sama sandbox'i. Ruff parsib ja kirjutab lähtekoodi ümber, mitte ei käivita seda, kuid selle käivitamine backend-hostil annaks mitteusaldusväärsele failile protsessi, mis pärib backend'i kogu keskkonna, seega saab see oma ühekordse `--network none` konteineri samade piirangute ja sama allowlist'itud keskkonnaga. See nurjub suletud režiimis ilma Dockerita, selle asemel et hostil vormindada.

Sandbox'i piirangud on konstandid, mitte keskkonnamuutujad — 512 MB mälu, üks CPU, 256 protsessi, 120-sekundiline paigalduse timeout ja 60-sekundiline käivituse timeout. Image lahendatakse olemasolevast `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` ahelast; node ei too sisse oma konfiguratsiooni.
## Seotud

- [Käivitamine ja juurutamine](../getting-started/running-and-deployment.md) – Konfigureerige käivitamisel `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` ja `HEYM_PYTHON_TOOL_SANDBOX`
- [Code Node](../nodes/code-node.md) – Liivakastis Pythoni käitamine koos oma sõltuvustega
- [Agent Node](../nodes/agent-node.md) – Kohandatud Pythoni tööriistad, mis töötavad liivakastis
- [Käivituse tokenid](./execution-tokens.md) – Piiratud ulatusega JWT-d workflow'de kutsumiseks välistest süsteemidest
- [Guardrails](./guardrails.md) – Blokeerige ebaturvaline sisu LLM- ja Agent-sõlmedes
- [Seaded](./user-settings.md) – Muutke oma parooli
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – Hallake API võtmeid
- [MCP vahekaart](../tabs/mcp-tab.md) – MCP API võti ja OAuth kliendid
- [Portal](./portal.md) – Avaliku chat-portaali juurdepääsu kontroll
