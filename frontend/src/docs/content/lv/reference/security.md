# Drošība

Drošības prakse un konfigurācija Heym platformai.

## Paroles politika

Visām parolēm — gan reģistrējoties, gan mainot paroli — jāatbilst šādām prasībām:

| Noteikums | Prasība |
|------|-------------|
| Minimālais garums | 8 rakstzīmes |
| Lielie burti | Vismaz viens lielais burts (A–Z) |
| Mazie burti | Vismaz viens mazais burts (a–z) |
| Cipars | Vismaz viens skaitlis (0–9) |

Šie noteikumi tiek piemēroti gan frontend, gan backend (Pydantic validator). Pieprasījums ar neatbilstošu paroli tiek noraidīts ar `422 Unprocessable Entity` atbildi pirms jebkādas datubāzes ierakstīšanas.

**Derīgas paroles piemērs:** `MyWorkflow7!`

## Sesiju pārvaldība

- Piekļuves token tiek glabāti **HttpOnly** sīkfailos, nevis `localStorage`. Tas neļauj JavaScript (tostarp XSS payload) nolasīt token.
- Atjaunošanas token ir piesaistīts `/api/auth/refresh` ceļam un to nevar nosūtīt uz citiem endpoint.
- Katrs `/api/auth/refresh` izsaukums **rotē** atjaunošanas token: vecais token tiek nekavējoties atsaukts un tiek izsniegts jauns. Atkārtoti izmantojot jau lietotu atjaunošanas token, tiek atgriezts `401`.

## Pieprasījumu ierobežošana

Šiem endpoint tiek piemērots pieprasījumu ierobežojums uz IP:

| Endpoint | Ierobežojums | Bloķēšanas ilgums |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 piepr. / 60 s | 15 min |
| `POST /api/auth/register` | 5 piepr. / 60 s | 10 min |
| `POST /register` (OAuth klienti) | 5 piepr. / 60 s | 10 min |
| Portāla pieteikšanās | 3 mēģinājumi | 24 h |

Kad `REDIS_URL` ir konfigurēts, pieprasījumu ierobežojumi tiek koplietoti starp visiem backend worker. Bez tā ierobežojumi tiek piemēroti katram worker procesam atsevišķi.

## Akreditācijas datu šifrēšana

Visi API atslēgas, webhook URL un bearer token, kas tiek glabāti [Akreditācijas datu](../tabs/credentials-tab.md) panelī, pirms ierakstīšanas datubāzē tiek šifrēti miera stāvoklī, izmantojot AES-256 (Fernet). Atslēga tiek iegūta no `ENCRYPTION_KEY` vides mainīgā. Skripti `run.sh` un `deploy.sh` automātiski ģenerē stipru vērtību, ja tā ir tukša; lietojumprogramma atsakās startēt, ja `ENCRYPTION_KEY` ir tukšs vai atstāts pie zināmas viettura vērtības.

## MCP API atslēga

MCP API atslēga tiek izmantota, lai autentificētu ārējos MCP klientus, kas pieslēdzas `/api/mcp/sse` endpoint. Kad SSE savienojums tiek izveidots, tiek izsniegts īslaicīgs (1 stundu) sesijas token un iegults ziņojumu endpoint URL īstās API atslēgas vietā, novēršot atslēgas parādīšanos servera piekļuves žurnālos. Iestatīšanu skatiet sadaļā [MCP cilne](../tabs/mcp-tab.md).

## OAuth / PKCE

OAuth 2.0 autorizācijas serveris (izmantots MCP klientiem) atbalsta tikai `authorization_code` grant ar PKCE (`S256`). Piekrišanas forma izmanto HMAC-SHA256 CSRF token, kas derīgi 10 minūtes. Visas vērtības, kas tiek parādītas piekrišanas lapā, tiek HTML-escape.

## Izpildes token

[Izpildes token](./execution-tokens.md) ir piesaistīti JWT, lai no ārējām sistēmām izsauktu workflow izpildes endpoint. Atšķirībā no lietotāja sesijas token tie ir:

- **Piesaistīti vienam workflow** — token tiek noraidīts jebkuram citam workflow.
- **Neatkarīgi atsaucami** — token atsaukšana neietekmē izsniedzēja lietotāja sesiju.
- **Īslaicīgi vai ilglaicīgi** — izvēlieties TTL no 60 sekundēm līdz 10 gadiem.

Token tiek parakstīti ar to pašu lietojumprogrammas noslēpumu (`SECRET_KEY`) un tiek pārbaudīti katrā pieprasījumā: paraksts, derīguma termiņš, `wid` claim atbilstība un atsaukšanas statuss. Iestatīšanu un API atsauci skatiet sadaļā [Izpildes token](./execution-tokens.md).

## Satura drošība

Izmantojiet [Guardrails](./guardrails.md) uz LLM un Agent mezgliem, lai bloķētu nedrošus vai politiku pārkāpjošus lietotāja ziņojumus pirms tie sasniedz modeli. Guardrails atbalsta deviņas satura kategorijas (vardarbība, naida runa, seksuāls saturs utt.) ar konfigurējamiem jutīguma līmeņiem.

## Python rīku sandbox

Lietotāja definēti Python rīki uz [Agent mezgla](../nodes/agent-node.md) izpilda neuzticamu kodu. Pēc noklusējuma Heym izpilda katru rīku nostiprinātā, vienreizlietojamā Docker konteinerā ar:

- nav tīkla piekļuves,
- tikai lasāma saknes failu sistēma ar nelielu `tmpfs` darba direktoriju,
- lietotājs, kas nav root, ar visām atņemtajām Linux capabilities un `no-new-privileges`,
- stingriem CPU, atmiņas un PID ierobežojumiem, un
- **nav montēts Docker socket**, tāpēc rīks nevar sasniegt resursdatora Docker daemon.

Izpildes backend tiek kontrolēts ar `HEYM_PYTHON_TOOL_SANDBOX` vides mainīgo:

| Vērtība | Darbība |
|-------|----------|
| `auto` (noklusējums) | Izpildīt nostiprinātā Docker konteinerā. Ja Docker nav pieejams, izpilde **neizdodas droši** — tā klusi neizpilda neuzticamu kodu bez OS izolācijas. |
| `docker` | Tāpat kā `auto`, bet nekad neatkāpjas. |
| `subprocess` | Izpildīt lokālā procesa ietvaros esošā apakšprocesā, ko aizsargā importa atļauto saraksts. Tas **nav drošības robeža** un ir paredzēts tikai uzticamam kodam vai lokālai izstrādei. `run.sh` to izvēlas vietējai izstrādei. |

Iestatiet `HEYM_PYTHON_TOOL_IMAGE`, lai piesaistītu sandbox attēlu; kad tas ir tukšs, Heym automātiski nosaka darbojošos backend attēlu. Procesa ietvaros esošie ierobežojumi (importa atļauto saraksts plus atribūtu un introspekcijas filtrēšana) tiek piemēroti kā aizsardzība dziļumā, bet konteiners ir īstā izolācijas robeža — saglabājiet noklusējuma `auto` (vai `docker`) režīmu vairāku lietotāju un produkcijas izvietojumiem.
## Skill Sandbox

Python prasmes, kas pievienotas [Agent node](../nodes/agent-node.md), arī izpilda neuzticamu kodu — prasme var nonākt burtiski tādā pašā veidā koplietotā workflow vai `everyone` redzamības veidnē — tāpēc prasmes tiek izpildītas caur **to pašu** `HEYM_PYTHON_TOOL_SANDBOX` slēdzi, ko izmanto Python rīki, un tās neizdodas droši tādā pašā veidā. Prasmes konteiners ir nostiprināts identiski (nav root, visas capabilities noņemtas, `no-new-privileges`, tikai lasāma saknes failu sistēma, CPU/atmiņas/PID ierobežojumi un **nav Docker socket**), ar divām apzinātām atšķirībām, jo prasmēm tās likumīgi ir nepieciešamas:

- **Tīkla piekļuve ir atļauta** (prasmes izsauc API un instalē savas atkarības, izmantojot `uv`), un
- **ir pievienota rakstāma darbvieta**, lai prasmes varētu ģenerēt izvades failus un lasīt Heym Drive failus.

Darbvieta tiek koplietota ar vienreizlietojamo blakus konteineru, izmantojot to pašu nosaukto Docker volume, ko izmanto Codex runner (`heym-codex-workspaces`, pievienots pie `/app/data/codex-workspaces`). Blakus konteinerā tiek pievienota tikai šīs izpildes pašas apakšdirektorija — izmantojot katrai izpildei atsevišķu `volume-subpath` — tāpēc viena prasme nekad neredz citas izpildes vai Codex darbvietas datus. Docker Compose steks vienmēr pievieno šo volume; vienkonteinera `docker run` ir jāiekļauj `-v heym-codex-workspaces:/app/data/codex-workspaces` gan Python prasmēm, gan Codex. Ja volume trūkst `auto`/`docker` režīmā, prasmes izpilde **neizdodas droši**, nevis tiek palaista backend vidē. Tā kā katrai izpildei atsevišķi subpath pievienojumi prasa **Docker Engine 25.0 vai jaunāku**, vecākiem engine ir jāveic jaunināšana vai uzticamas prasmes jāpalaiž ar `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Konteinerā tiek pārsūtīti tikai nekonfidenciāli, pārnesami vides mainīgie (proxy un CA-bundle iestatījumi, locale); datubāzes URL, `SECRET_KEY`/`ENCRYPTION_KEY`, pakalpojumu sniedzēju API atslēgas un OAuth noslēpumi tiek aizturēti ar allowlist palīdzību. Prasmes failu ceļi tiek validēti, lai tie paliktu darbvietas ietvaros, un simboliskās saites, kas ievietotas izvades direktorijā (tostarp `_hitl_request.json` sentinel), nekad netiek izsekotas. Ja nepieciešams, ignorējiet noklusējuma vērtības ar `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` un `HEYM_SKILL_USER`.

Tāpat kā ar rīkiem, `subprocess` režīms izpilda prasmi backend procesā un **nav drošības robeža** — izmantojiet to tikai uzticamai vienlietotāja vai lokālai izstrādei (`run.sh` to izvēlas native izstrādei).

## Code Node Sandbox

[Code node](../nodes/code-node.md) izpilda patvaļīgu lietotāja Python kodu kopā ar patvaļīgām trešo pušu atkarībām, tāpēc tas ir stingrākais no trim sandbox un vienīgais ar **bez izejas iespējas**: tas nelasa nevienu sandbox režīma mainīgo, tam nav `subprocess` režīma un tas neizdodas droši, ja nav sasniedzams neviens Docker daemon. Tas nekad neatgriežas pie lietotāja koda izpildes backend procesā.

Izpilde ir viens vai divi vienreizlietojami konteineri, abi nostiprināti tāpat kā rīku un prasmju sandbox (nav root, visas capabilities noņemtas, `no-new-privileges`, tikai lasāma saknes failu sistēma, CPU/atmiņas/PID ierobežojumi un **nav Docker socket**):

- Ar tukšu `requirements.txt` kodu izpilda **viens konteiners ar `--network none`**. Runner nonāk konteinera stdin payload, tāpēc nekas netiek pievienots vispār.
- Ar atkarībām pirmais konteiners tās instalē ar tīkla piekļuvi katrai izpildei atsevišķā `.deps` direktorijā, un otrais konteiners pievieno šo apakškoku **tikai lasāmu** un izpilda kodu. Izpildes konteineram nav tīkla, ja vien node opcija `codeAllowNetwork` nav ieslēgta.

Atkarības tiek instalētas ar `uv`, atkārtoti mēģinātas ar `pip` un nekad netiek kešotas starp izpildēm. Kad backend darbojas konteinerā, katrai izpildei atsevišķā direktorija atrodas tajā pašā `heym-codex-workspaces` volume, ko izmanto prasmju sandbox, pievienota, izmantojot katrai izpildei atsevišķu `volume-subpath`, tāpēc viena izpilde nekad neredz citas failus; šai formai nepieciešams **Docker Engine 25.0 vai jaunāks**. Native backend (`./run.sh`) šādu volume neizmanto un tam tas nav nepieciešams — tā katrai izpildei atsevišķā direktorija ir lokāls pagaidu ceļš, kas tieši bind-mountēts blakus konteinerā. Jebkurā gadījumā direktorija tiek dzēsta pēc katras izpildes neatkarīgi no rezultāta.

Konteineros tiek pārsūtīti tikai nekonfidenciāli, pārnesami vides mainīgie — proxy iestatījumi, CA bundles un locale, kas atkarību instalēšanai nepieciešami, lai sasniegtu PyPI aiz korporatīvā proxy. Datubāzes URL, `SECRET_KEY`/`ENCRYPTION_KEY`, pakalpojumu sniedzēju API atslēgas un OAuth noslēpumi tiek aizturēti ar allowlist palīdzību, tāpēc jauns backend noslēpums pēc noklusējuma tiek izlaists, nevis noplūdināts, līdz kāds atjaunina denylist. Backend `HOME` nekad neaizstāj sandbox paša rakstāmo ceļu.

Poga **Format** izmanto to pašu sandbox. Ruff parsē un pārraksta pirmkodu, nevis to izpilda, bet tā palaišana backend hostā piešķirtu neuzticamam failam procesu, kas manto visu backend vidi, tāpēc tam tiek izveidots savs vienreizlietojams `--network none` konteiners ar tiem pašiem ierobežojumiem un to pašu allowlist vidi. Tas neizdodas droši bez Docker, nevis formatē hostā.

Sandbox ierobežojumi ir konstantes, nevis vides mainīgie — 512 MB atmiņas, viens CPU, 256 procesi, 120 sekunžu instalēšanas taimauts un 60 sekunžu izpildes taimauts. Attēls tiek noteikts no esošās `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` ķēdes; node pats ievieš nekādu konfigurāciju.
## Saistītie

- [Palaišana un izvietošana](../getting-started/running-and-deployment.md) – Konfigurējiet `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` un `HEYM_PYTHON_TOOL_SANDBOX` startēšanas laikā
- [Code mezgls](../nodes/code-node.md) – Sandboxed Python izpilde ar savām atkarībām
- [Agent mezgls](../nodes/agent-node.md) – Pielāgoti Python rīki, kas darbojas sandbox vidē
- [Izpildes Token](../execution-tokens.md) – Ierobežotas JWT piekļuves tiesības workflow izsaukšanai no ārējām sistēmām
- [Guardrails](./guardrails.md) – Bloķējiet nedrošu saturu LLM un Agent mezglos
- [Iestatījumi](./user-settings.md) – Mainiet savu paroli
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pārvaldiet API atslēgas
- [MCP cilne](../tabs/mcp-tab.md) – MCP API atslēga un OAuth klienti
- [Portāls](./portal.md) – Publiskā chat portāla piekļuves kontrole
