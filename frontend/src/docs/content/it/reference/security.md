# Sicurezza

Pratiche di sicurezza e configurazione per la piattaforma Heym.

## Policy delle password

Tutte le password — in fase di registrazione e durante la modifica della password — devono soddisfare i seguenti requisiti:

| Regola | Requisito |
|------|-------------|
| Lunghezza minima | 8 caratteri |
| Maiuscole | Almeno una lettera maiuscola (A–Z) |
| Minuscole | Almeno una lettera minuscola (a–z) |
| Cifra | Almeno un numero (0–9) |

Queste regole sono applicate sia sul frontend sia sul backend (validatore Pydantic). Una richiesta con una password non conforme viene rifiutata con una risposta `422 Unprocessable Entity` prima che avvenga qualsiasi scrittura sul database.

**Esempio di password valida:** `MyWorkflow7!`

## Gestione delle sessioni

- Gli access token sono memorizzati in cookie **HttpOnly**, non in `localStorage`. Ciò impedisce a JavaScript (inclusi i payload XSS) di leggere il token.
- Il refresh token è limitato al percorso `/api/auth/refresh` e non può essere inviato ad altri endpoint.
- Ogni chiamata a `/api/auth/refresh` **ruota** il refresh token: il vecchio token viene immediatamente revocato e ne viene emesso uno nuovo. Il riutilizzo di un refresh token già usato restituisce `401`.

## Rate Limiting

I seguenti endpoint sono soggetti a rate limiting per IP:

| Endpoint | Limite | Durata del ban |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 req / 60 s | 15 min |
| `POST /api/auth/register` | 5 req / 60 s | 10 min |
| `POST /register` (client OAuth) | 5 req / 60 s | 10 min |
| Login del portale | 3 tentativi | 24 h |

Quando `REDIS_URL` è configurato, i rate limit sono condivisi tra tutti i worker del backend. In assenza di tale variabile, i limiti si applicano per singolo processo worker.

## Crittografia delle credenziali

Tutte le API key, gli URL dei webhook e i bearer token memorizzati nel pannello [Credenziali](../tabs/credentials-tab.md) sono crittografati a riposo tramite AES-256 (Fernet) prima di essere scritti nel database. La chiave è derivata dalla variabile d'ambiente `ENCRYPTION_KEY`. Gli script `run.sh` e `deploy.sh` generano automaticamente un valore robusto quando questa è vuota; l'applicazione rifiuta di avviarsi se `ENCRYPTION_KEY` è vuota o impostata su un placeholder noto.

## API Key MCP

L'API key MCP viene utilizzata per autenticare i client MCP esterni che si connettono all'endpoint `/api/mcp/sse`. Quando la connessione SSE viene stabilita, viene emesso un session token a breve scadenza (1 ora) che viene incorporato nell'URL dell'endpoint dei messaggi al posto della vera API key, evitando che quest'ultima compaia nei log di accesso del server. Per la configurazione, consultare la [Scheda MCP](../tabs/mcp-tab.md).

## OAuth / PKCE

Il server di autorizzazione OAuth 2.0 (utilizzato per i client MCP) supporta esclusivamente il grant `authorization_code` con PKCE (`S256`). Il modulo di consenso utilizza token CSRF HMAC-SHA256 validi per 10 minuti. Tutti i valori visualizzati nella pagina di consenso sono sottoposti a escape HTML.

## Execution Token

Gli [execution token](./execution-tokens.md) sono JWT con scope limitato per chiamare l'endpoint di esecuzione di un workflow da sistemi esterni. A differenza dei token di sessione utente, essi sono:

- **Limitati a un singolo workflow** — un token viene rifiutato per qualsiasi altro workflow.
- **Revocabili in modo indipendente** — la revoca di un token non ha alcun effetto sulla sessione dell'utente che lo ha emesso.
- **A breve o lunga scadenza** — è possibile scegliere un TTL da 60 secondi a 10 anni.

I token sono firmati con lo stesso secret dell'applicazione (`SECRET_KEY`) e verificati a ogni richiesta: firma, scadenza, corrispondenza del claim `wid` e stato di revoca. Per la configurazione e il riferimento API, consultare [Execution Token](./execution-tokens.md).

## Sicurezza dei contenuti

Utilizzare le [Guardrails](./guardrails.md) sui nodi LLM e Agent per bloccare messaggi utente non sicuri o in violazione delle policy prima che raggiungano il modello. Le Guardrails supportano nove categorie di contenuto (violenza, incitamento all'odio, contenuti sessuali, ecc.) con livelli di sensibilità configurabili.

## Sandbox degli strumenti Python

Gli strumenti Python definiti dall'utente sul [Nodo Agent](../nodes/agent-node.md) eseguono codice non attendibile. Per impostazione predefinita Heym esegue ogni strumento all'interno di un container Docker usa-e-getta e irrobustito con:

- nessun accesso alla rete,
- un filesystem root in sola lettura con una piccola directory di lavoro `tmpfs`,
- un utente non root con tutte le capability Linux rimosse e `no-new-privileges`,
- limiti rigorosi di CPU, memoria e PID, e
- **nessun Docker socket** montato, così che uno strumento non possa raggiungere il daemon Docker dell'host.

Il backend di esecuzione è controllato dalla variabile d'ambiente `HEYM_PYTHON_TOOL_SANDBOX`:

| Valore | Comportamento |
|-------|----------|
| `auto` (predefinito) | Esecuzione nel container Docker irrobustito. Se Docker non è disponibile, l'esecuzione **fallisce in modo sicuro** — non esegue silenziosamente codice non attendibile senza isolamento a livello di sistema operativo. |
| `docker` | Come `auto`, ma senza alcun fallback. |
| `subprocess` | Esecuzione in un sottoprocesso locale in-process protetto da una allowlist di import. Questa **non è un confine di sicurezza** ed è destinata esclusivamente a codice attendibile o allo sviluppo locale. `run.sh` la seleziona per lo sviluppo nativo. |

Impostare `HEYM_PYTHON_TOOL_IMAGE` per fissare l'immagine della sandbox; quando è vuota, Heym rileva automaticamente l'immagine del backend in esecuzione. Le restrizioni in-process (una allowlist di import più il filtraggio di attributi e introspezione) sono applicate come difesa in profondità, ma il container è il vero confine di isolamento — mantenere la modalità predefinita `auto` (o `docker`) per distribuzioni multiutente e in produzione.

## Sandbox delle Skill

Le skill Python associate a un [nodo Agent](../nodes/agent-node.md) eseguono anch'esse codice non attendibile — una skill può arrivare testualmente all'interno di un workflow condiviso o di un modello con visibilità `everyone` — pertanto le skill vengono eseguite attraverso lo **stesso** interruttore `HEYM_PYTHON_TOOL_SANDBOX` utilizzato per gli strumenti Python e in caso di errore si comportano allo stesso modo, fallendo in modo sicuro. Il container delle skill è rafforzato in modo identico (non-root, tutte le capability rimosse, `no-new-privileges`, filesystem root in sola lettura, limiti di CPU/memoria/PID e **nessun socket Docker**), con due differenze deliberate dovute al fatto che le skill ne hanno legittimamente bisogno:

- **L'egress di rete è consentito** (le skill chiamano API e installano le proprie dipendenze tramite `uv`), e
- **è montato uno workspace scrivibile** affinché le skill possano generare file di output e leggere i file di Heym Drive.

Lo workspace è condiviso con il container sibling temporaneo attraverso lo stesso volume Docker denominato utilizzato dal runner Codex (`heym-codex-workspaces`, montato in `/app/data/codex-workspaces`). Nel sibling viene montata solo la sottodirectory della presente esecuzione — tramite un `volume-subpath` per esecuzione — così una skill non vede mai i dati dello workspace di un'altra esecuzione o di Codex. Lo stack Docker Compose monta sempre questo volume; il comando `docker run` a container singolo deve includere `-v heym-codex-workspaces:/app/data/codex-workspaces` sia per le skill Python sia per Codex. Se il volume è assente in modalità `auto`/`docker`, l'esecuzione della skill **fallisce in modo sicuro** anziché essere eseguita nel backend. Poiché i mount di sottopath per esecuzione richiedono **Docker Engine 25.0 o versione successiva**, i motori più datati dovrebbero essere aggiornati oppure eseguire le skill attendibili con `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Nel container vengono inoltrate solo variabili d'ambiente portabili e non segrete (impostazioni di proxy e CA-bundle, locale); gli URL del database, `SECRET_KEY`/`ENCRYPTION_KEY`, le chiavi API dei provider e i segreti OAuth vengono esclusi tramite allowlist. I percorsi dei file delle skill vengono validati affinché rimangano all'interno dello workspace, e i symlink inseriti nella directory di output (incluso il sentinel `_hitl_request.json`) non vengono mai seguiti. Se necessario, è possibile sovrascrivere i valori predefiniti con `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` e `HEYM_SKILL_USER`.

Come per gli strumenti, la modalità `subprocess` esegue la skill nel processo del backend e **non costituisce un confine di sicurezza** — utilizzarla solo per ambienti attendibili mono-utente o per lo sviluppo locale (`run.sh` la seleziona per lo sviluppo nativo).

## Sandbox del Nodo Code

Il [nodo Code](../nodes/code-node.md) esegue codice Python arbitrario dell'utente insieme a dipendenze di terze parti arbitrarie, pertanto è il più rigoroso dei tre sandbox e l'unico **senza alcuna via di fuga**: non legge alcuna variabile di modalità sandbox, non dispone di una modalità `subprocess` e fallisce in modo sicuro quando non è raggiungibile alcun daemon Docker. Non ricorre mai all'esecuzione del codice utente nel processo del backend.

L'esecuzione avviene in uno o due container temporanei, entrambi rafforzati come i sandbox degli strumenti e delle skill (non-root, tutte le capability rimosse, `no-new-privileges`, filesystem root in sola lettura, limiti di CPU/memoria/PID e **nessun socket Docker**):

- Con un `requirements.txt` vuoto, un **singolo container con `--network none`** esegue il codice. Il runner arriva nel payload stdin del container, quindi non viene montato nulla.
- Con delle dipendenze, un primo container le installa con accesso alla rete in una directory `.deps` per esecuzione, e un secondo container monta quel sottoalbero **in sola lettura** ed esegue il codice. Il container di esecuzione non ha rete a meno che l'opzione `codeAllowNetwork` del nodo non sia attivata.

Le dipendenze vengono installate con `uv`, ritentate con `pip` e mai memorizzate in cache tra un'esecuzione e l'altra. Quando il backend viene eseguito in un container, la directory per esecuzione risiede sullo stesso volume `heym-codex-workspaces` utilizzato dal sandbox delle skill, montato tramite un `volume-subpath` per esecuzione, così un'esecuzione non vede mai i file di un'altra; tale forma richiede **Docker Engine 25.0 o versione successiva**. Un backend nativo (`./run.sh`) non dispone di tale volume e non ne ha bisogno — la sua directory per esecuzione è un percorso temporaneo locale montato direttamente nel sibling. In entrambi i casi la directory viene eliminata dopo ogni esecuzione, indipendentemente dall'esito.

Nei container vengono inoltrate solo variabili d'ambiente portabili e non segrete — impostazioni di proxy, CA bundle e locale, di cui l'installazione delle dipendenze necessita per raggiungere PyPI dietro un proxy aziendale. Gli URL del database, `SECRET_KEY`/`ENCRYPTION_KEY`, le chiavi API dei provider e i segreti OAuth vengono esclusi tramite allowlist, così un nuovo segreto del backend viene scartato per impostazione predefinita anziché trapelare finché qualcuno non aggiorna una denylist. La variabile `HOME` del backend non sovrascrive mai il percorso scrivibile proprio del sandbox.

Il pulsante **Format** utilizza lo stesso sandbox. Ruff analizza e riscrive il sorgente anziché eseguirlo, ma eseguirlo sull'host del backend assegnerebbe a un file non attendibile un processo che eredita l'intero ambiente del backend, pertanto gli viene assegnato un proprio container temporaneo `--network none` con gli stessi limiti e lo stesso ambiente in allowlist. Fallisce in modo sicuro senza Docker anziché formattare sull'host.

I limiti del sandbox sono costanti anziché variabili d'ambiente — 512 MB di memoria, una CPU, 256 processi, un timeout di installazione di 120 secondi e un timeout di esecuzione di 60 secondi. L'immagine viene risolta dalla catena esistente `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; il nodo non introduce configurazioni proprie.

## Correlati

- [Esecuzione e distribuzione](../getting-started/running-and-deployment.md) – Configurare `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` e `HEYM_PYTHON_TOOL_SANDBOX` all'avvio
- [Nodo Code](../nodes/code-node.md) – Esecuzione Python in sandbox con dipendenze dedicate
- [Nodo Agent](../nodes/agent-node.md) – Strumenti Python personalizzati eseguiti nella sandbox
- [Token di esecuzione](./execution-tokens.md) – JWT con ambito limitato per richiamare i workflow da sistemi esterni
- [Guardrail](./guardrails.md) – Bloccare contenuti non sicuri nei nodi LLM e Agent
- [Impostazioni](./user-settings.md) – Modificare la password
- [Scheda Credenziali](../tabs/credentials-tab.md) – Gestire le chiavi API
- [Scheda MCP](../tabs/mcp-tab.md) – Chiave API MCP e client OAuth
- [Portale](./portal.md) – Controllo di accesso al portale chat pubblico
