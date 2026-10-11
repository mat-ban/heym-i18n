# Seguretat

Pràctiques de seguretat i configuració per a la plataforma Heym.

## Política de contrasenyes

Totes les contrasenyes — tant en el registre com en el canvi de contrasenya — han de complir els requisits següents:

| Regla | Requisit |
|------|-------------|
| Longitud mínima | 8 caràcters |
| Majúscules | Com a mínim una lletra majúscula (A–Z) |
| Minúscules | Com a mínim una lletra minúscula (a–z) |
| Dígit | Com a mínim un número (0–9) |

Aquestes regles s'apliquen tant al frontend com al backend (validador de Pydantic). Una sol·licitud amb una contrasenya que no compleixi els requisits es rebutja amb una resposta `422 Unprocessable Entity` abans que es produeixi cap escriptura a la base de dades.

**Exemple de contrasenya vàlida:** `MyWorkflow7!`

## Gestió de sessions

- Els tokens d'accés s'emmagatzemen en cookies **HttpOnly**, no a `localStorage`. Això impedeix que JavaScript (incloent-hi els payloads XSS) pugui llegir el token.
- El token de refresc està limitat a la ruta `/api/auth/refresh` i no es pot enviar a altres endpoints.
- Cada crida a `/api/auth/refresh` **rota** el token de refresc: el token antic es revoca immediatament i se n'emet un de nou. Si es reutilitza un token de refresc ja emprat, es retorna `401`.

## Limitació de taxa

Els endpoints següents tenen limitació de taxa per IP:

| Endpoint | Límit | Durada del bloqueig |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 req / 60 s | 15 min |
| `POST /api/auth/register` | 5 req / 60 s | 10 min |
| `POST /register` (clients OAuth) | 5 req / 60 s | 10 min |
| Inici de sessió del portal | 3 intents | 24 h |

Quan `REDIS_URL` està configurat, els límits de taxa es comparteixen entre tots els workers del backend. Sense aquesta configuració, els límits s'apliquen per procés worker.

## Xifratge de credencials

Totes les claus API, URLs de webhook i tokens de portador emmagatzemats al tauler [Credentials](../tabs/credentials-tab.md) es xifren en repòs mitjançant AES-256 (Fernet) abans d'escriure's a la base de dades. La clau es deriva de la variable d'entorn `ENCRYPTION_KEY`. Els scripts `run.sh` i `deploy.sh` generen automàticament un valor fort quan està buida; l'aplicació es nega a iniciar-se si `ENCRYPTION_KEY` està buida o conté un valor de marcador de posició conegut.

## Clau API d'MCP

La clau API d'MCP s'utilitza per autenticar clients MCP externs que es connecten a l'endpoint `/api/mcp/sse`. Quan s'estableix la connexió SSE, s'emet un token de sessió de curta durada (1 hora) i s'incrusta a l'URL de l'endpoint de missatges en lloc de la clau API real, evitant que la clau aparegui als registres d'accés del servidor. Consulteu [MCP Tab](../tabs/mcp-tab.md) per a la configuració.

## OAuth / PKCE

El servidor d'autorització OAuth 2.0 (utilitzat per als clients MCP) només admet la concessió `authorization_code` amb PKCE (`S256`). El formulari de consentiment utilitza tokens CSRF HMAC-SHA256 vàlids durant 10 minuts. Tots els valors mostrats a la pàgina de consentiment s'escapen en HTML.

## Tokens d'execució

Els [tokens d'execució](./execution-tokens.md) són JWTs amb abast per cridar l'endpoint d'execució d'un workflow des de sistemes externs. A diferència dels tokens de sessió d'usuari, són:

- **Amb abast d'un sol workflow** — un token es rebutja per a qualsevol altre workflow.
- **Revocables de manera independent** — revocar un token no té cap efecte sobre la sessió de l'usuari que l'ha emès.
- **De curta o llarga durada** — trieu un TTL des de 60 segons fins a 10 anys.

Els tokens es signen amb el mateix secret de l'aplicació (`SECRET_KEY`) i es comproven a cada sol·licitud: signatura, caducitat, coincidència de la reclamació `wid` i estat de revocació. Consulteu [Execution Tokens](./execution-tokens.md) per a la configuració i la referència de l'API.

## Seguretat del contingut

Utilitzeu [Guardrails](./guardrails.md) als Nodes LLM i Agent per bloquejar missatges d'usuari insegurs o que incompleixin les polítiques abans que arribin al model. Guardrails admet nou categories de contingut (violència, discurs d'odi, contingut sexual, etc.) amb nivells de sensibilitat configurables.

## Sandbox d'eines Python

Les eines Python definides per l'usuari al [Node Agent](../nodes/agent-node.md) executen codi no fiable. Per defecte, Heym executa cada eina dins d'un contenidor Docker fortificat i d'un sol ús amb:

- sense accés a la xarxa,
- un sistema de fitxers arrel de només lectura amb un petit directori de treball `tmpfs`,
- un usuari no root amb totes les capacitats de Linux eliminades i `no-new-privileges`,
- límits estrictes de CPU, memòria i PID, i
- **sense socket de Docker** muntat, de manera que una eina no pot arribar al dimoni Docker de l'amfitrió.

El backend d'execució es controla mitjançant la variable d'entorn `HEYM_PYTHON_TOOL_SANDBOX`:

| Valor | Comportament |
|-------|----------|
| `auto` (per defecte) | S'executa al contenidor Docker fortificat. Si Docker no està disponible, l'execució **falla de manera segura** — no executa silenciosament codi no fiable sense aïllament del sistema operatiu. |
| `docker` | Igual que `auto`, però mai fa fallback. |
| `subprocess` | S'executa en un subprocés local dins del mateix procés protegit per una llista blanca d'importacions. Això **no és una frontera de seguretat** i està pensat només per a codi de confiança o desenvolupament local. `run.sh` el selecciona per al desenvolupament natiu. |

Establiu `HEYM_PYTHON_TOOL_IMAGE` per fixar la imatge del sandbox; quan està buida, Heym detecta automàticament la imatge del backend en execució. Les restriccions dins del procés (una llista blanca d'importacions més el filtratge d'atributs i introspecció) s'apliquen com a defensa en profunditat, però el contenidor és la frontera d'aïllament real — manteniu el mode `auto` (o `docker`) per defecte per a desplegaments multiusuari i de producció.
## Sandbox d'habilitats

Les habilitats de Python adjuntes a un [Node d'agent](../nodes/agent-node.md) també executen codi no fiable — una habilitat pot arribar textualment dins d'un Workflow compartit o d'una plantilla amb visibilitat `everyone` —, de manera que les habilitats passen pel **mateix** commutador `HEYM_PYTHON_TOOL_SANDBOX` que les eines de Python i fallen de manera segura igual. El contenidor d'habilitats està endurit de manera idèntica (no root, totes les capacitats eliminades, `no-new-privileges`, sistema de fitxers arrel de només lectura, límits de CPU/memòria/PID i **sense socket de Docker**), amb dues diferències deliberades perquè les habilitats les necessiten legítimament:

- **L'egress de xarxa està permès** (les habilitats criden APIs i instal·len les seves pròpies dependències mitjançant `uv`), i
- **es munta un espai de treball d'escriptura** perquè les habilitats puguin generar fitxers de sortida i llegir fitxers de Heym Drive.

L'espai de treball es comparteix amb el contenidor germà d'un sol ús mitjançant el mateix volum Docker amb nom que utilitza l'executor de Codex (`heym-codex-workspaces`, muntat a `/app/data/codex-workspaces`). Només el subdirectori d'aquesta mateixa execució es munta al germà — mitjançant un `volume-subpath` per execució —, de manera que una habilitat mai no veu les dades de l'espai de treball d'una altra execució ni les de Codex. L'stack de Docker Compose sempre munta aquest volum; el `docker run` d'un sol contenidor ha d'incloure `-v heym-codex-workspaces:/app/data/codex-workspaces` tant per a les habilitats de Python com per a Codex. Si el volum no hi és en mode `auto`/`docker`, l'execució de l'habilitat **falla de manera segura** en lloc d'executar-se al backend. Com que els muntatges de subcamí per execució requereixen **Docker Engine 25.0 o superior**, els motors més antics haurien d'actualitzar-se o executar habilitats de confiança amb `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Només es reenvien al contenidor variables d'entorn no secretes i portables (configuració de proxy i de CA-bundle, locale); les URL de bases de dades, `SECRET_KEY`/`ENCRYPTION_KEY`, les claus d'API de proveïdors i els secrets d'OAuth es retenen mitjançant una llista de permisos. Els camins dels fitxers d'habilitats es validen perquè romanguin dins de l'espai de treball, i els enllaços simbòlics plantats al directori de sortida (inclòs el sentinella `_hitl_request.json`) no se segueixen mai. Substituïu els valors per defecte amb `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` i `HEYM_SKILL_USER` si cal.

Com amb les eines, el mode `subprocess` executa l'habilitat dins del procés del backend i **no és una frontera de seguretat** — utilitzeu-lo només per a desenvolupament local o d'un sol usuari de confiança (`run.sh` el selecciona per al desenvolupament natiu).

## Sandbox del Node de codi

El [Node de codi](../nodes/code-node.md) executa Python arbitrari de l'usuari juntament amb dependències de tercers arbitràries, de manera que és el més estricte dels tres sandbox i l'únic que **no té via d'escapament**: no llegeix cap variable de mode de sandbox, no té mode `subprocess` i falla de manera segura quan no hi ha cap dimoni de Docker accessible. Mai no recorre a executar codi d'usuari dins del procés del backend.

L'execució és d'un o dos contenidors d'un sol ús, tots dos endurits com els sandbox d'eines i d'habilitats (no root, totes les capacitats eliminades, `no-new-privileges`, sistema de fitxers arrel de només lectura, límits de CPU/memòria/PID i **sense socket de Docker**):

- Amb un `requirements.txt` buit, **un sol contenidor amb `--network none`** executa el codi. L'executor arriba dins del payload d'stdin del contenidor, de manera que no es munta absolutament res.
- Amb dependències, un primer contenidor les instal·la amb accés a la xarxa en un directori `.deps` per execució, i un segon contenidor munta aquest subarbre **de només lectura** i executa el codi. El contenidor d'execució no té xarxa tret que l'opció `codeAllowNetwork` del Node estigui activada.

Les dependències s'instal·len amb `uv`, es reintenten amb `pip` i mai no es memoritzen en caché entre execucions. Quan el backend s'executa dins d'un contenidor, el directori per execució viu al mateix volum `heym-codex-workspaces` que utilitza el sandbox d'habilitats, muntat mitjançant un `volume-subpath` per execució perquè una execució mai no vegi els fitxers d'una altra; aquesta forma requereix **Docker Engine 25.0 o superior**. Un backend natiu (`./run.sh`) no té aquest volum i no en necessita cap — el seu directori per execució és un camí temporal local muntat directament al germà. En qualsevol cas, el directori se suprimeix després de cada execució independentment del resultat.

Només es reenvien als contenidors variables d'entorn no secretes i portables — configuració de proxy, CA bundles i locale, que la instal·lació de dependències necessita per arribar a PyPI darrere d'un proxy corporatiu. Les URL de bases de dades, `SECRET_KEY`/`ENCRYPTION_KEY`, les claus d'API de proveïdors i els secrets d'OAuth es retenen mitjançant una llista de permisos, de manera que un secret nou del backend es descarta per defecte en lloc de filtrar-se fins que algú actualitzi una llista de denegació. El `HOME` del backend mai no substitueix el propi camí d'escriptura del sandbox.

El botó **Format** utilitza el mateix sandbox. Ruff analitza i reescriu el codi font en lloc d'executar-lo, però executar-lo a l'amfitrió del backend donaria a un fitxer no fiable un procés que hereta tot l'entorn del backend, de manera que obté el seu propi contenidor d'un sol ús amb `--network none` amb els mateixos límits i el mateix entorn de llista de permisos. Falla de manera segura sense Docker en lloc de formatar a l'amfitrió.

Els límits del sandbox són constants en lloc de variables d'entorn — 512 MB de memòria, una CPU, 256 processos, un temps d'espera d'instal·lació de 120 segons i un temps d'espera d'execució de 60 segons. La imatge es resol a partir de la cadena existent `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; el Node no introdueix cap configuració pròpia.
## Relacionat

- [Execució i desplegament](../getting-started/running-and-deployment.md) – Configureu `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` i `HEYM_PYTHON_TOOL_SANDBOX` a l'inici
- [Node de codi](../nodes/code-node.md) – Execució de Python en sandbox amb les seves pròpies dependències
- [Node d'agent](../nodes/agent-node.md) – Eines de Python personalitzades que s'executen al sandbox
- [Tokens d'execució](./execution-tokens.md) – JWT amb abast per invocar workflows des de sistemes externs
- [Guardrails](./guardrails.md) – Bloquegeu contingut insegur als nodes LLM i Agent
- [Configuració](./user-settings.md) – Canvieu la vostra contrasenya
- [Pestanya de credencials](../tabs/credentials-tab.md) – Gestioneu les claus API
- [Pestanya MCP](../tabs/mcp-tab.md) – Claus API MCP i clients OAuth
- [Portal](./portal.md) – Control d'accés al portal de xat públic
