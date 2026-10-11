# Securitate

Practici și configurare de securitate pentru platforma Heym.

## Politica de parole

Toate parolele — la înregistrare și la schimbarea parolei — trebuie să îndeplinească următoarele cerințe:

| Regulă | Cerință |
|------|-------------|
| Lungime minimă | 8 caractere |
| Majuscule | Cel puțin o literă majusculă (A–Z) |
| Minuscule | Cel puțin o literă minusculă (a–z) |
| Cifră | Cel puțin o cifră (0–9) |

Aceste reguli sunt aplicate atât în frontend, cât și în backend (validator Pydantic). O cerere cu o parolă neconformă este respinsă cu un răspuns `422 Unprocessable Entity` înainte de orice scriere în baza de date.

**Exemplu de parolă validă:** `MyWorkflow7!`

## Gestionarea sesiunilor

- Tokenurile de acces sunt stocate în cookie-uri **HttpOnly**, nu în `localStorage`. Astfel se împiedică JavaScript (inclusiv payload-urile XSS) să citească tokenul.
- Tokenul de refresh este limitat la calea `/api/auth/refresh` și nu poate fi trimis către alte endpoint-uri.
- Fiecare apel `/api/auth/refresh` **rotește** tokenul de refresh: tokenul vechi este revocat imediat și este emis unul nou. Reutilizarea unui token de refresh deja folosit returnează `401`.

## Limitarea ratei

Următoarele endpoint-uri au rate limitat per IP:

| Endpoint | Limită | Durata banului |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 cereri / 60 s | 15 min |
| `POST /api/auth/register` | 5 cereri / 60 s | 10 min |
| `POST /register` (clienți OAuth) | 5 cereri / 60 s | 10 min |
| Autentificare portal | 3 încercări | 24 h |

Când `REDIS_URL` este configurat, limitele de rată sunt partajate între toate procesele worker din backend. Fără acesta, limitele se aplică per proces worker.

## Criptarea credențialelor

Toate cheile API, URL-urile de webhook și tokenurile bearer stocate în panoul [Credentials](../tabs/credentials-tab.md) sunt criptate în repaus folosind AES-256 (Fernet) înainte de a fi scrise în baza de date. Cheia este derivată din variabila de mediu `ENCRYPTION_KEY`. Scripturile `run.sh` și `deploy.sh` generează automat o valoare puternică atunci când aceasta este goală; aplicația refuză să pornească dacă `ENCRYPTION_KEY` este goală sau lăsată la o valoare placeholder cunoscută.

## Cheia API MCP

Cheia API MCP este utilizată pentru a autentifica clienții MCP externi care se conectează la endpoint-ul `/api/mcp/sse`. Când conexiunea SSE este stabilită, este emis un token de sesiune cu durată scurtă de viață (1 oră) și încorporat în URL-ul endpoint-ului de mesaje în locul cheii API reale, împiedicând apariția cheii în jurnalele de acces ale serverului. Consultați [MCP Tab](../tabs/mcp-tab.md) pentru configurare.

## OAuth / PKCE

Serverul de autorizare OAuth 2.0 (utilizat pentru clienții MCP) acceptă doar grant-ul `authorization_code` cu PKCE (`S256`). Formularul de consimțământ utilizează tokenuri CSRF HMAC-SHA256 valabile 10 minute. Toate valorile afișate în pagina de consimțământ sunt escape-uite HTML.

## Tokenuri de execuție

[Tokenurile de execuție](./execution-tokens.md) sunt JWT-uri cu scop definit pentru apelarea endpoint-ului de execuție al unui workflow din sisteme externe. Spre deosebire de tokenurile de sesiune ale utilizatorilor, acestea sunt:

- **Limitate la un singur workflow** — un token este respins pentru orice alt workflow.
- **Revocabile independent** — revocarea unui token nu are niciun efect asupra sesiunii utilizatorului care l-a emis.
- **Cu durată scurtă sau lungă de viață** — alegeți un TTL de la 60 de secunde la 10 ani.

Tokenurile sunt semnate cu același secret al aplicației (`SECRET_KEY`) și verificate la fiecare cerere: semnătură, expirare, potrivirea claim-ului `wid` și starea de revocare. Consultați [Execution Tokens](./execution-tokens.md) pentru configurare și referința API.

## Siguranța conținutului

Utilizați [Guardrails](./guardrails.md) pe nodurile LLM și Agent pentru a bloca mesajele utilizatorilor nesigure sau care încalcă politica înainte de a ajunge la model. Guardrails acceptă nouă categorii de conținut (violență, discurs instigator la ură, conținut sexual etc.) cu niveluri de sensibilitate configurabile.

## Sandbox pentru unelte Python

Uneltele Python definite de utilizator pe [Agent node](../nodes/agent-node.md) execută cod nesigur. În mod implicit, Heym rulează fiecare unealtă într-un container Docker izolat, întărit și efemer, cu:

- fără acces la rețea,
- un sistem de fișiere root read-only cu un director de lucru `tmpfs` mic,
- un utilizator non-root cu toate capabilitățile Linux eliminate și `no-new-privileges`,
- limite stricte de CPU, memorie și PID și
- **fără socket Docker** montat, astfel încât o unealtă să nu poată accesa daemonul Docker al gazdei.

Backend-ul de execuție este controlat de variabila de mediu `HEYM_PYTHON_TOOL_SANDBOX`:

| Valoare | Comportament |
|-------|----------|
| `auto` (implicit) | Rulează în containerul Docker întărit. Dacă Docker nu este disponibil, execuția **eșuează în siguranță** — nu rulează silențios cod nesigur fără izolare la nivel de sistem de operare. |
| `docker` | La fel ca `auto`, dar nu face niciodată fallback. |
| `subprocess` | Rulează într-un subproces local în proces, protejat de o listă de permisiuni pentru importuri. Acesta **nu este o graniță de securitate** și este destinat doar codului de încredere sau dezvoltării locale. `run.sh` îl selectează pentru dezvoltare nativă. |

Setați `HEYM_PYTHON_TOOL_IMAGE` pentru a fixa imaginea sandbox-ului; când este goală, Heym detectează automat imaginea backend-ului care rulează. Restricțiile în proces (o listă de permisiuni pentru importuri plus filtrarea atributelor și introspecției) sunt aplicate ca apărare în adâncime, dar containerul este adevărata graniță de izolare — păstrați modul implicit `auto` (sau `docker`) pentru implementări multi-utilizator și de producție.
## Sandbox pentru skill-uri

Skill-urile Python atașate unui [nod Agent](../nodes/agent-node.md) execută și ele cod nesigur — un skill poate ajunge textual într-un workflow partajat sau într-un șablon cu vizibilitate `everyone` — astfel încât skill-urile rulează prin **același** comutator `HEYM_PYTHON_TOOL_SANDBOX` ca uneltele Python și eșuează în siguranță în același mod. Containerul pentru skill-uri este securizat identic (non-root, toate capabilitățile eliminate, `no-new-privileges`, sistem de fișiere root read-only, limite CPU/memorie/PID și **fără socket Docker**), cu două diferențe deliberate, deoarece skill-urile au nevoie legitim de ele:

- **Egress-ul de rețea este permis** (skill-urile apelează API-uri și își instalează propriile dependențe prin `uv`) și
- **un workspace inscriptibil este montat** pentru ca skill-urile să poată genera fișiere de ieșire și să citească fișiere din Heym Drive.

Workspace-ul este partajat cu containerul frate efemer prin același volum Docker numit pe care îl folosește runner-ul Codex (`heym-codex-workspaces`, montat la `/app/data/codex-workspaces`). Doar subdirectorul propriei rulări este montat în containerul frate — printr-un `volume-subpath` per rulare — astfel încât un skill nu vede niciodată datele din workspace-ul altei rulări sau ale Codex. Stack-ul Docker Compose montează întotdeauna acest volum; comanda `docker run` pentru un singur container trebuie să includă `-v heym-codex-workspaces:/app/data/codex-workspaces` atât pentru skill-urile Python, cât și pentru Codex. Dacă volumul lipsește în modul `auto`/`docker`, execuția skill-ului **eșuează în siguranță** în loc să ruleze în backend. Deoarece montările de subpath per rulare necesită **Docker Engine 25.0 sau mai nou**, motoarele mai vechi ar trebui fie actualizate, fie să ruleze skill-uri de încredere cu `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Doar variabile de mediu portabile, care nu sunt secrete (setări de proxy și CA-bundle, locale), sunt transmise în container; URL-urile de bază de date, `SECRET_KEY`/`ENCRYPTION_KEY`, cheile API ale furnizorilor și secretele OAuth sunt reținute printr-o listă de permisiuni. Căile fișierelor de skill sunt validate pentru a rămâne în interiorul workspace-ului, iar link-urile simbolice plantate în directorul de ieșire (inclusiv sentinela `_hitl_request.json`) nu sunt niciodată urmărite. Suprascrieți valorile implicite cu `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` și `HEYM_SKILL_USER` dacă este necesar.

Ca și în cazul uneltelor, modul `subprocess` rulează skill-ul în procesul backend și **nu reprezintă o graniță de securitate** — utilizați-l doar pentru utilizatori unici de încredere sau dezvoltare locală (`run.sh` îl selectează pentru dezvoltare nativă).

## Sandbox pentru nodul Code

[Nodul Code](../nodes/code-node.md) rulează cod Python arbitrar al utilizatorului împreună cu dependențe terțe arbitrare, astfel încât este cel mai strict dintre cele trei sandbox-uri și singurul cu **nicio cale de scăpare**: nu citește nicio variabilă de mod sandbox, nu are mod `subprocess` și eșuează în siguranță atunci când nu este accesibil niciun daemon Docker. Nu revine niciodată la rularea codului utilizatorului în procesul backend.

Execuția constă într-unul sau două containere efemere, ambele securizate ca sandbox-urile pentru unelte și skill-uri (non-root, toate capabilitățile eliminate, `no-new-privileges`, sistem de fișiere root read-only, limite CPU/memorie/PID și **fără socket Docker**):

- Cu un `requirements.txt` gol, **un singur container cu `--network none`** rulează codul. Runner-ul ajunge în payload-ul stdin al containerului, astfel încât nu se montează absolut nimic.
- Cu dependențe, un prim container le instalează cu acces la rețea într-un director `.deps` per rulare, iar un al doilea container montează acel subarbore **read-only** și rulează codul. Containerul de execuție nu are rețea decât dacă opțiunea `codeAllowNetwork` a nodului este activată.

Dependențele sunt instalate cu `uv`, reîncercate cu `pip` și niciodată cache-uite între rulări. Când backend-ul rulează într-un container, directorul per rulare se află pe același volum `heym-codex-workspaces` pe care îl folosește sandbox-ul pentru skill-uri, montat printr-un `volume-subpath` per rulare, astfel încât o rulare nu vede niciodată fișierele alteia; această formă necesită **Docker Engine 25.0 sau mai nou**. Un backend nativ (`./run.sh`) nu are un astfel de volum și nu are nevoie de unul — directorul său per rulare este o cale temporară locală montată direct în containerul frate. În orice caz, directorul este șters după fiecare execuție, indiferent de rezultat.

Doar variabile de mediu portabile, care nu sunt secrete, sunt transmise în containere — setări de proxy, CA bundles și locale, de care instalarea dependențelor are nevoie pentru a ajunge la PyPI în spatele unui proxy corporativ. URL-urile de bază de date, `SECRET_KEY`/`ENCRYPTION_KEY`, cheile API ale furnizorilor și secretele OAuth sunt reținute printr-o listă de permisiuni, astfel încât un nou secret de backend este eliminat implicit în loc să fie scurs până când cineva actualizează o listă de interdicții. `HOME` al backend-ului nu suprascrie niciodată calea inscriptibilă proprie a sandbox-ului.

Butonul **Format** folosește același sandbox. Ruff analizează și rescrie sursa în loc să o execute, dar rularea lui pe gazda backend ar oferi unui fișier nesigur un proces care moștenește întregul mediu al backend-ului, așa că primește propriul container efemer `--network none` cu aceleași limite și același mediu cu listă de permisiuni. Eșuează în siguranță fără Docker în loc să formateze pe gazdă.

Limitele sandbox-ului sunt constante, nu variabile de mediu — 512 MB de memorie, un CPU, 256 de procese, un timeout de instalare de 120 de secunde și un timeout de execuție de 60 de secunde. Imaginea este rezolvată din lanțul existent `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; nodul nu introduce nicio configurare proprie.
## Resurse conexe

- [Rulare și implementare](../getting-started/running-and-deployment.md) – Configurați `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` și `HEYM_PYTHON_TOOL_SANDBOX` la pornire
- [Nodul Code](../nodes/code-node.md) – Execuție Python în sandbox cu dependențe proprii
- [Nodul Agent](../nodes/agent-node.md) – Instrumente Python personalizate care rulează în sandbox
- [Tokenuri de execuție](./execution-tokens.md) – JWT-uri cu domeniu de aplicare pentru apelarea workflow-urilor din sisteme externe
- [Guardrails](./guardrails.md) – Blocați conținutul nesigur în nodurile LLM și Agent
- [Setări](./user-settings.md) – Schimbați-vă parola
- [Fila Credentials](../tabs/credentials-tab.md) – Gestionați cheile API
- [Fila MCP](../tabs/mcp-tab.md) – Cheia API MCP și clienții OAuth
- [Portal](./portal.md) – Controlul accesului la portalul public de chat
