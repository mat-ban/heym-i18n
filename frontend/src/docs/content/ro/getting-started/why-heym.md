# De ce Heym

Heym este infrastructură pentru rularea și guvernanța agenților AI în producție. Un singur runtime self-hosted acoperă fiecare etapă a ciclului de viață al agentului.

Un agent prototip are nevoie de un model, un prompt și câteva instrumente. Un agent de producție are nevoie, de asemenea, de trigger-e și reîncercări, de stare salvată atunci când face o pauză pentru o persoană, de o înregistrare a fiecărui apel de model și de instrument, de un cost pentru fiecare rulare, de teste înainte ca o modificare să fie livrată și de limite clare privind ceea ce poate face în mod autonom. Heym păstrează toate acestea într-un singur loc, astfel încât sistemul pe care îl proiectați pe canvas este sistemul care rulează. Construiți sisteme agentice, apoi rulați-le cu încredere.

## Un singur Runtime pentru Ciclul de Viață al Agentului

| Etapă | Ce vă oferă Heym |
|---|---|
| **Construire** | Compuneți agenți și pași determiniști pe canvas, generați-i cu [AI Assistant](../reference/ai-assistant.md) sau porniți de la [Șabloane](../tabs/templates-tab.md) și competențe portabile. |
| **Orchestrare** | Coordonați agenți, [sub-agenți](../reference/agent-architecture.md), agenți de codare, RAG, automatizare de browser și instrumente cu flux de date explicit și [execuție paralelă](../reference/parallel-execution.md). |
| **Rulare** | Porniți rulări din [webhook-uri](../reference/webhooks.md), programări și [trigger-e](../reference/triggers.md) de evenimente, cu reîncercări per nod, [gestionarea erorilor](../nodes/error-handler-node.md) și [distribuirea încărcării](../reference/cluster.md) între instanțe. |
| **Observare** | Inspectați fiecare execuție prin [istoric](../reference/execution-history.md), [urme LLM](../tabs/traces-tab.md), cost USD per rulare, rulări live pe canvas, [analitice](../tabs/analytics-tab.md), [alerte](../tabs/alerts-tab.md) și export [OpenTelemetry](../reference/opentelemetry.md). |
| **Evaluare** | Testați prompt-uri și modele față de rezultatele așteptate în [Evals](../tabs/evals-tab.md), cu scorare LLM-as-Judge și comparare side-by-side a modelelor. |
| **Control** | Mențineți oamenii în control cu [puncte de verificare pentru revizuire](../reference/human-in-the-loop.md) și [guardrails](../reference/guardrails.md) și guvernați accesul cu [credențiale](../reference/credentials.md) criptate, [echipe](../reference/teams.md), [single sign-on](../reference/sso.md) și o [urmă de audit](../reference/audit.md). |
| **Expunere** | Serviți workflow-uri prin REST și [SSE](../reference/sse-streaming.md), ca instrumente [MCP](../tabs/mcp-tab.md), ca interfețe de chat [Portal](../reference/portal.md) și ca widget-uri de [dashboard](../tabs/dashboard-tab.md). |

## Construire

### AI Assistant: Construiți Workflow-uri cu Limbaj Natural

[AI Assistant](../reference/ai-assistant.md) este un panou de chat în interiorul editorului de workflow. Descrieți ceea ce doriți, de exemplu „creați un workflow care preia input de la utilizator, caută în baza mea de cunoștințe și răspunde folosind GPT-4o”, iar asistentul generează noduri și muchii care sunt aplicate instantaneu pe canvas.

- Utilizează propria dumneavoastră credențială LLM (orice model acceptat)
- Suportă **input vocal** pentru proiectarea workflow-urilor fără mâini
- Aplică automat JSON valid de workflow din răspunsul AI pe canvas
- Transmite răspunsuri în timp real

Asistentul funcționează direct în interiorul editorului și transmite noduri pe canvas în timp real, iar tot ceea ce generează rămâne editabil precum nodurile pe care le-ați plasat manual.

### Sistemul de Competențe

Competențele sunt pachete portabile de capabilități, un fișier de instrucțiuni `SKILL.md` plus scripturi Python opționale, care pot fi plasate pe orice nod Agent.

- Instrucțiunile competenței sunt adăugate în fața prompt-ului de sistem al agentului
- Fișierele Python din competență devin instrumente apelabile
- Competențele sunt reutilizabile între workflow-uri și partajabile ca arhive `.zip`

Acest lucru este analog cu a oferi agentului dumneavoastră o descriere a postului și o cutie de instrumente într-o singură plasare.

### Workflow Analyzer: Feedback conștient de rulare

Panoul [Workflow Analysis](../reference/workflow-analysis.md) este un instrument de documentare și feedback conștient de rulare integrat în editor. Faceți clic pe **Analyze**, alegeți o credențială LLM și un model, iar Heym generează un raport Markdown editabil pentru workflow-ul curent.

Spre deosebire de o notă statică, analizorul rulează mai întâi workflow-ul atunci când este posibil și include rezultatul execuției în prompt. Raportul acoperă zonele de îmbunătățire, scopul workflow-ului și o explicație pas cu pas a ceea ce fac nodurile. Când un raport există deja, **Reanalyze** transmite o previzualizare separată, astfel încât să puteți accepta noua versiune sau să păstrați documentul partajat curent.

## Orchestrare
### Noduri LLM și Agent integrate

[Nodul Agent](../nodes/agent-node.md) din Heym rulează o buclă strâns integrată de apelare a instrumentelor cu instrumente Python inline, conexiuni MCP și un sistem portabil de competențe, toate concepute pentru agenți de producție.

De asemenea, [nodul LLM](../nodes/llm-node.md) simplu din Heym depășește un singur pas de tip prompt-răspuns. Pentru endpoint-urile OpenAI și compatibile cu OpenAI acceptate, acesta poate comuta în **modul Batch API**, astfel încât un singur nod să trimită o matrice de prompt-uri într-o cerere batch nativă a furnizorului, la un cost redus. Canvas-ul expune apoi o ramură dedicată `batchStatus` care se declanșează pe măsură ce batch-ul parcurge stări precum `pending`, `processing` și `completed`.

Aceasta înseamnă că nodul LLM poate face două lucruri simultan:

- Rulează cererea batch principală și returnează rezultatele finale per element pe ramura normală
- Declanșează logica de notificare sau de înregistrare în jurnal la fiecare actualizare semnificativă a stării batch-ului, fără a transforma fluxul într-o buclă de polling personalizată

Execuția batch este o primitivă de flux de lucru LLM de primă clasă, cu verificări ale capacităților furnizorului și modelului în interfața nodului.

**Nodul Agent** este nucleul orchestrației agenților în Heym:

- **Apelarea instrumentelor** – Agentul iterează peste apelurile de instrumente într-o buclă până când produce un răspuns final
- **Instrumente Python** – Definiți instrumente personalizate inline cu Python complet; agentul le apelează la runtime
- **Conexiuni MCP** – Conectați-vă la orice server [Model Context Protocol](https://modelcontextprotocol.io/) (stdio sau SSE) și agentul primește automat toate instrumentele acestuia
- **Competențe** – Plasați un fișier `.zip` sau `.md` pe un agent pentru a-i extinde contextul de sistem și a adăuga instrumente Python
- **Apeluri de sub-fluxuri de lucru** – Agentul poate invoca alte fluxuri de lucru Heym ca instrumente, compunând comportamente complexe fără cod personalizat

Consultați [Nodul Agent](../nodes/agent-node.md) și [Arhitectura Agentului](../reference/agent-architecture.md) pentru referința completă.

### Orchestrare multi-agent

Heym acceptă un **model de orchestrator** cu primitive vizuale de primă clasă:

- Un agent acționează ca **orchestrator** (`isOrchestrator: true`) și primește un instrument `call_sub_agent`
- Acesta deleagă sarcini către **sub-agenți** numiți pe același canvas
- Sub-agenții pot la rândul lor să apeleze alți agenți sau sub-fluxuri de lucru (adâncime maximă: 5)
- **Execuție paralelă**: Când orchestratorul apelează mai mulți sub-agenți într-o singură rundă, aceștia rulează în paralel pentru rezultate mai rapide

Aceasta permite arhitecturi precum un agent de planificare care direcționează munca către un cercetător, un programator și un sumarizator, toate conectate vizual fără cod de orchestrare personalizat.

Consultați [Arhitectura Agentului](../reference/agent-architecture.md) pentru detalii de execuție.

### Agenți de programare ca noduri de flux de lucru

Heym include două noduri care rulează un agent de programare real ca pas de flux de lucru, nu ca o completare de chat:

- **[Nodul Codex](../nodes/codex-node.md)** – Rulează CLI-ul OpenAI Codex într-un spațiu de lucru Heym izolat, împotriva unui repository GitHub. Acceptă **Sign in with ChatGPT** (PKCE OAuth pe abonamentul dumneavoastră Plus/Pro, fără cost API per token) sau un token de acces, clonează repository-ul, permite Codex să editeze codul și returnează `summary`, `diff`, `changedFiles` și un `pullRequestUrl` preliminar.
- **[Nodul OpenCode Go](../nodes/opencode-go-node.md)** – Același flux de lucru cu repository prin gateway-ul OpenCode agnostic față de furnizor (Kimi, DeepSeek, Qwen și altele), executat într-un **container de unică folosință securizat**: toate capabilitățile eliminate, root read-only, limite de pid/memorie/CPU. Token-ul GitHub rămâne în afara sandbox-ului: Heym efectuează fiecare operațiune git și GitHub pe partea de host, astfel încât codul generat nu poate exfiltra credențiale de push.

Aceasta înseamnă că un flux de lucru poate tria un bug dintr-un webhook, poate încredința repository-ul unui agent de programare, poate aștepta PR-ul preliminar și poate posta link-ul pe Slack, complet automatizat, cu limite de resurse configurabile per implementare.

### Pipeline RAG integrat

Heym include un [Nod RAG / Vector Store](../nodes/rag-node.md) și o filă gestionată [Vectorstores](../tabs/vectorstores-tab.md). Puteți:

- Alege backend-ul vectorial: **Qdrant** (server extern) sau **Postgres (pgvector)**, care stochează vectorii în baza de date proprie Heym fără a rula un serviciu suplimentar
- Inserta documente într-un vector store direct dintr-un nod de flux de lucru
- Efectua căutări semantice și alimenta rezultatele într-un nod LLM sau Agent
- Referi rezultatele cu expresii precum `$ragNode.results.map("item.payload.content").join("\n\n")`

În Heym, RAG înseamnă două noduri cu control complet asupra embedding-urilor și recuperării.

### Automatizare de browser cu Playwright

[Nodul Playwright](../nodes/playwright-node.md) este automatizare de browser first-party pe canvas.

- **Modul Steps** – Compuneți vizual acțiuni de navigare, clic, tastare, completare, captură de ecran, extragere și derulare
- **Pași AI cu auto-vindecare** – Descrieți o acțiune în limbaj natural și un LLM generează acțiunile Playwright; selectorii eșuați pot fi vindecați automat, iar pașii generați pot fi stocați în cache pentru a evita apelurile LLM viitoare
- **Modul Run Code** – Comutați nodul pe Playwright Python complet pentru fluxuri complexe (dezactivat implicit; rulează în sandbox-ul securizat Heym când este activat)
- **Sesiuni autentificate** – Restaurați cookie-uri/`storageState` înainte de rulare, verificați autentificarea printr-o verificare a selectorului și reveniți la pași de autentificare scriptați
- **Captură de rețea** – Colectați opțional răspunsuri JSON, antete, cookie-uri și stocare de browser alături de rezultate

Heym tratează browserul ca un nod normal, cu aceleași expresii, credențiale și gestionare a erorilor ca orice altceva.
### Expression DSL

[Expression DSL](../reference/expression-dsl.md) al Heym oferă o sintaxă curată și puternică pentru referirea datelor nodurilor anterioare:

- `$input.text` – Datele nodului Input
- `$nodeName.field` – Câmpul de ieșire al oricărui nod anterior
- `$global.variableName` – Variabile globale persistente
- Funcții ajutătoare pentru array-uri: `.first()`, `.map("field")`, `.join("\n")`

Expresiile funcționează în orice câmp de tip string, inclusiv în prompt-uri, antete HTTP, condiții și valori atribuite, astfel încât datele circulă explicit între pași. DSL-ul echilibrează puterea și lizibilitatea fără a necesita cunoștințe complete de JavaScript.

## Rulare

### Trigger-e, reîncercări și căi de eroare

Un workflow poate porni din multiple locuri. Nodurile [Input](../nodes/input-node.md) primesc [webhook-uri](../reference/webhooks.md) HTTP, [Cron](../nodes/cron-node.md) rulează conform unui program, iar [trigger-ele](../reference/triggers.md) de evenimente pornesc rulări din Telegram, Discord, Slack, inbox-uri IMAP, fluxuri WebSocket, cozi RabbitMQ, încărcări de fișiere și evenimente ale platformei Heym.

Eșecurile sunt gestionate în interiorul grafului. Orice nod poate reîncerca la eșec cu un număr prestabilit de încercări și o așteptare între ele, fiecare încercare este înregistrată în [istoricul de execuție](../reference/execution-history.md), iar un nod [Error Handler](../nodes/error-handler-node.md) rulează automat când un nod eșuează, astfel încât recuperarea face parte din workflow însuși.

### Execuție DAG paralelă

Executorul de workflow-uri al Heym utilizează un planificator bazat pe graf aciclic direcționat (DAG). Nodurile independente rulează automat în paralel, fără a fi necesară configurare.

- Nodurile aflate la același nivel de dependență sunt expediate concurent către un pool de thread-uri (`max_workers=8`)
- Imediat ce un nod se termină, nodurile sale descendente sunt planificate
- [Nodul Merge](../nodes/merge-node.md) combină rezultatele ramurilor paralele
- Multiple rulări de workflow se execută concurent; fiecare rulare este complet izolată

Paralelismul este comportamentul implicit, determinat de structura grafului.

Consultați [Execuția paralelă](../reference/parallel-execution.md).

### Scalare pe mai multe instanțe

Îndreptați o a doua instanță Heym către aceeași bază de date PostgreSQL și aceasta se alătură ca worker. Rulările din fundal sunt distribuite între instanțe conform ponderilor pe care le stabiliți, un lider ales menține programările, evaluarea alertelor și recuperarea după crash-uri funcționând prin failover, iar fiecare rulare înregistrează instanța care a executat-o. Consultați [Distribuirea încărcării](../reference/cluster.md).

### Panou Kanban agentic

[Fila Board](../tabs/board-tab.md) este un panou Kanban integrat în care coloanele însele execută workflow-uri. Un card este un job agentic persistent care păstrează contextul, istoricul conversației, starea execuției, rezultatele și rulările de workflow.

- **Lanțuri de workflow pe coloane** – Mutarea unui card într-o coloană declanșează lanțul de workflow al acelei coloane; un **Agentic Kanban Model** (credențialele și modelul dumneavoastră) mapează conținutul cardului către intrările workflow-ului și transformă rezultatele înapoi în text lizibil
- **Atașamente la carduri** – Trageți fișiere pe un card; documentele sunt extrase în text, iar imaginile sunt transmise modelelor cu capabilități de vision înainte de fiecare rulare
- **Canvas de rulare live** – Deschideți rularea activă în interiorul unui card și urmăriți-o executându-se pe canvas-ul real al workflow-ului, nod cu nod
- **Partajare în echipă** – Partajați panourile cu utilizatori sau echipe cu permisiuni de citire/scriere; lanțurile de pe panourile partajate rulează cu credențialele proprietarului, astfel încât colaboratorii nu au nevoie niciodată de propriile credențiale
- **Vizibilitatea eșecurilor** – Cardurile eșuate afișează un indicator de istoric al erorilor, iar rulările ulterioare se pot opri pentru a aștepta comentarii

Panoul este o suprafață nativă a platformei: cardurile, workflow-urile, credențialele și rulările live se află toate într-un singur loc.

### Heym Drive: stocare de fișiere integrată

[Fila Drive](../tabs/drive-tab.md) este un depozit de fișiere integrat în platformă. Fișierele generate de skills și workflow-uri (PDF, DOCX, CSV, imagini) ajung acolo automat, iar atașamentele cardurilor din panou sunt stocate tot acolo.

- **Linkuri de partajare** – Linkuri de descărcare publice sau protejate prin parolă (Basic Auth), cu expirare opțională și limite maxime de descărcare
- **Partajare în echipă** – Partajați fișiere în mod read-only cu echipele dumneavoastră și eliminați toate partajările de echipă printr-o singură acțiune
- **Acțiuni în bloc** – Selectare multiplă cu intervale prin shift-click, împachetarea selecțiilor într-o singură descărcare ZIP sau aplicarea unei singure setări de partajare/parolă/ștergere pentru mai multe fișiere simultan
- **Acces pentru agenți** – Skills pot opta să citească fișiere din Drive, astfel încât un agent poate lucra cu documentele produse de dumneavoastră sau de alte workflow-uri

Artefactele generate primesc un loc permanent și partajabil în interiorul platformei.

## Observare

### Trasee LLM

[Fila Traces](../tabs/traces-tab.md) oferă observabilitate completă pentru fiecare apel LLM:

- Payload-uri de cerere și răspuns
- Temporizare per apel: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Numele apelurilor de tool, argumentele și rezultatele
- Skills transmise modelului

Sistemul de trasee este conceput special pentru depanarea comportamentului agentic, cu payload-uri complete de cerere și răspuns și temporizare per apel.
### Urmărirea costurilor Token pentru LLM

Fiecare apel LLM din Heym este costat automat. [Fila Traces](../tabs/traces-tab.md) afișează numărul de tokenuri de intrare și de ieșire pentru fiecare trace, împreună cu un cost USD în timp real derivat dintr-un tabel de prețuri sincronizat.

- **Cost per trace** – Tokenuri de intrare, tokenuri de ieșire și totalul USD afișate pe fiecare rând de trace
- **Analiză costuri** – Cardurile KPI și graficul de costuri per model se actualizează în funcție de intervalul de timp selectat (1h / 24h / 7d / 30d / All)
- **Tabelul de costuri LLM** – Un tabel de sistem din [fila DataTable](../tabs/datatable-tab.md) este populat din Helicone la fiecare 24 de ore; puteți suprascrie prețurile sau adăuga rânduri personalizate pentru modelele care nu sunt încă listate
- **Avertisment privind prețul lipsă** – Trace-urile pentru modelele fără o intrare de preț afișează un avertisment inline cu un link direct către tabelul de costuri

Fiecare execuție are propriul cost USD, defalcat pe model.

### Deschiderea execuțiilor de producție pe un Canvas live

Un workflow de producție rămâne inspectabil după ce pornește în afara editorului. Deschideți orice intrare **Running** din oricare dialog History sau deschideți execuția activă dintr-un card Agentic Kanban, iar Heym atașează editorul normal de workflow la acea execuție exactă.

- Nodurile care s-au încheiat deja apar cu rezultatele lor imediat
- Nodul curent și nodurile ulterioare în așteptare continuă să pulseze pe măsură ce execuția avansează
- Panoul Debug primește aceleași rezultate incrementale ale nodurilor ca o execuție pornită din canvas
- Rezultatul final și evidențierile execuției sosesc fără polling și fără a porni o execuție duplicat
- Închiderea editorului doar deconectează observatorul; nu anulează niciodată workflow-ul de producție

Observatorul utilizează SSE susținut de un snapshot de execuție cross-worker, astfel încât funcționează pentru trigger-ele webhook, schedule, chat, MCP, integration și Board chiar și atunci când un alt worker de backend deține execuția.

### OpenTelemetry, Analytics și Alerts

Heym emite span-uri [OpenTelemetry](../reference/opentelemetry.md) pentru fiecare rulare de workflow, execuție de nod și invocare de tool Agent, exportate prin OTLP/HTTP către Jaeger, Grafana Tempo, Honeycomb, Datadog sau orice alt backend compatibil.

Fila [Analytics](../tabs/analytics-tab.md) urmărește numărul de rulări, rata de succes, durata și tendințele per workflow. [Alerts](../tabs/alerts-tab.md) monitorizează numărul de erori, durata rulării, consumul de tokenuri sau USD și volumul de execuții pe o fereastră de timp, apoi rulează un workflow de notificare ales de dumneavoastră, astfel încât o alertă ajunge în Slack, email, Telegram sau oriunde altundeva unde poate ajunge un nod.

## Evaluate

### Evaluări integrate

[Fila Evals](../tabs/evals-tab.md) vă permite să definiți suite de teste și să le rulați împotriva workflow-urilor agentului dumneavoastră:

- Creați cazuri de test cu intrări și ieșiri așteptate sau generați-le din prompt-ul suitei
- Rulați o suită împotriva mai multor modele și comparați rezultatele lor una lângă alta
- Acordați scor cu Exact Match, Contains sau LLM-as-Judge cu un model judge independent
- Examinați pass/fail, actual vs așteptat și istoricul rulărilor

Modificați un prompt sau un model, rulați din nou suita și comparați rezultatele înainte ca modificarea să ajungă în producție.

## Control

### Human-in-the-Loop (HITL)

Heym are un sistem integrat [Human-in-the-Loop](../reference/human-in-the-loop.md) care permite agenților să întrerupă execuția, să solicite revizuire umană și să reia exact de unde au rămas.

- **Puncte de control ale agentului** – Activați `hitlEnabled` pe orice nod Agent pentru a-i oferi un tool `request_human_review`. Agentul decide când o decizie necesită supraveghere umană și apelează tool-ul cu un rezumat și o schiță.
- **URL-uri publice de revizuire** – Fiecare cerere de revizuire generează un link securizat de unică folosință la `/review/{token}` (TTL de 168 de ore). Revizorii pot **accepta**, **edita și continua** sau **refuza** fără a se autentifica.
- **Snapshot-uri de execuție** – Workflow-ul își îngheață starea completă (istoricul conversației, variabile, rezultatele tool-urilor) astfel încât să reia exact de unde a fost întrerupt după ce revizorul răspunde.
- **Ramură de notificare** – O ieșire opțională `review` vă permite să conectați un flux de notificare (Slack, email, webhook) care se declanșează atunci când se solicită o revizuire.
- **Politici de aprobare pentru tool-uri MCP** – Liniile directoare HITL scrise sunt interpretate în scopuri de aprobare (`always` / `once` / `never`), astfel încât agentul poate aproba automat tool-urile cu risc scăzut și poate escalada cele cu risc ridicat.
- **Puncte de control multiple** – O singură rulare a agentului poate fi întreruptă pentru revizuire de mai multe ori; fiecare punct de control este independent.

URL-urile publice de revizuire, edit-and-continue, ramificarea notificărilor și reluarea bazată pe snapshot funcționează toate din același punct de control al agentului.

Consultați [Human-in-the-Loop](../reference/human-in-the-loop.md) pentru referința completă.

### Guardrails pentru LLM

Heym are [Guardrails](../reference/guardrails.md) integrate atât pe nodurile [LLM](../nodes/llm-node.md), cât și pe cele [Agent](../nodes/agent-node.md), astfel încât puteți bloca conținutul nesigur înainte ca un răspuns al modelului să ajungă la pașii ulteriori.

- **Comutator de siguranță la nivel de nod** – Activați guardrails direct pe nodul care generează sau procesează conținut destinat utilizatorului
- **Acoperire largă a politicilor** – Blocați violența, discursul instigator la ură, conținutul sexual, NSFW/profanitatea, hărțuirea, activitățile ilegale, cererile de date personale și încercările de prompt injection
- **Detecție multilingvă** – Aplicați aceleași reguli de siguranță în turcă, engleză, arabă, spaniolă și alte limbi
- **Fallback nativ în workflow** – Când un mesaj este blocat, nodul aruncă o eroare de workflow tipizată pe care o puteți direcționa printr-un [Error Handler](../nodes/error-handler-node.md)

Politica de siguranță se află direct în configurația LLM și Agent și se conectează direct la ramificarea workflow-ului și la gestionarea erorilor.
### Acces, Credențiale și Audit

Agenții acționează cu credențiale reale, astfel încât accesul face parte din guvernanță. [Credențialele](../reference/credentials.md) sunt criptate în repaus, mascate după creare și partajabile cu utilizatori sau [echipe](../reference/teams.md), iar echipele partajează de asemenea workflow-uri, variabile, vector stores și fișiere Drive. [Single sign-on](../reference/sso.md) conectează orice furnizor OpenID Connect, inclusiv Okta, Entra ID, Keycloak, Auth0 și Google. [Audit trail](../reference/audit.md) înregistrează fiecare acțiune relevantă pentru securitate împreună cu actorul, ținta și rezultatul acesteia, transmise împreună cu logurile containerului dumneavoastră către colectorul de loguri sau SIEM-ul pe care îl utilizați deja.

### Self-Hosted, Dețineți Controlul asupra Datelor

Heym rulează pe infrastructura dumneavoastră. Workflow-urile, credențialele, istoricul execuțiilor și trace-urile rezidă în propria dumneavoastră bază de date, iar apelurile către modele pleacă de pe serverele dumneavoastră către furnizorul pe care îl alegeți sau către un model pe care îl găzduiți singur prin Ollama sau vLLM. Pentru agenții care procesează documente sensibile, date ale clienților sau baze de cunoștințe proprietare, aceasta este adesea o cerință obligatorie.

Heym este licențiat sub **MIT License cu condiția Commons Clause**. Codul sursă este source-available: îl puteți utiliza, modifica și self-host în mod liber. Commons Clause restricționează vânzarea software-ului, inclusiv oferirea de găzduire plătită sau servicii de consultanță/suport a căror valoare derivă în mod substanțial din Heym. Pentru licențiere comercială, implementări enterprise sau suport profesional, contactați [enterprise@heym.run](mailto:enterprise@heym.run).

## Expunere

### API-uri și Streaming

Workflow-urile sunt apelabile prin HTTP la `/api/workflows/{workflow_id}/execute`, care returnează JSON, și la `/api/workflows/{workflow_id}/execute/stream`, care transmite evenimente ale nodurilor ca Server-Sent Events pe măsură ce execuția progresează. Ambele partajează autentificarea la nivel de workflow, rate limiting și caching-ul răspunsurilor. Consultați [Webhooks](../reference/webhooks.md) și [SSE Streaming](../reference/sse-streaming.md).

### Integrare MCP (Model Context Protocol)

Heym are suport nativ [MCP](../tabs/mcp-tab.md) pe ambele părți:

- **Ca client**: Nodurile Agent se conectează la servere MCP externe (Filesystem, Browserbase, unelte personalizate) prin stdio sau SSE și consumă automat uneltele acestora
- **Ca server**: Workflow-urile cu MCP activat devin unelte pe serverul implicit la `/api/mcp/sse`, sau pe servere denumite cu propriul URL și API key, astfel încât Claude Desktop, Cursor și alți clienți MCP să poată apela direct workflow-urile dumneavoastră Heym

Agenții pot consuma mai multe servere MCP simultan, iar orice workflow poate deveni o unealtă pentru un client MCP extern.

### Portal: Publicați Workflow-uri ca Interfețe de Chat

Funcționalitatea [Portal](../reference/portal.md) transformă orice workflow într-o interfață de chat publică la `/chat/{slug}`:

- Autentificare opțională cu credențiale per utilizator
- Execuție în streaming (progres în timp real al nodurilor)
- Suport pentru încărcare de fișiere
- Istoric de conversație multi-turn

Echipele livrează unelte interne, chatbot-uri pentru clienți și formulare bazate pe AI pornind de la un workflow și un URL, fără a scrie cod frontend.

### Dashboard-uri Bazate pe Workflow-uri

[Tab-ul Dashboard](../tabs/dashboard-tab.md) este o suprafață de raportare construită de utilizator, în care fiecare widget de tip chart este alimentat de propriul său workflow Heym ascuns. Un widget poate apela API-uri, interoga BigQuery, căuta în RAG/vector stores, rula pași LLM, transforma rânduri și finaliza cu un [nod Chart Output](../nodes/chart-output-node.md). Puteți crea widget-uri manual, genera cu AI, ajusta ulterior, cache-ui rezultatele și rearanja grila vizual.
## Comparație cu instrumentele de automatizare a fluxurilor de lucru

Multe echipe ajung la Heym pornind de la instrumente de automatizare a fluxurilor de lucru. Tabelul de mai jos compară Heym cu n8n, Zapier și Make.com din perspectiva capacităților care contează odată ce agenții rulează în producție, iar notele de subsol de sub tabel citează documentația oficială care stă la baza comparației. Pentru o analiză aprofundată a fiecărui instrument în parte, consultați paginile de comparație de la [heym.run/compare](https://heym.run/compare).

| Capacitate | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Nod LLM integrat | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + ramuri de stare | ✓ | limitat¹¹ | –¹¹ | limitat¹¹ |
| Nod Agent integrat (apelare de instrumente) | ✓ | ✓ | ✓ | ✓ |
| Orchestrare multi-agent | ✓ | ✓ | limitat | limitat |
| Noduri de agent pentru programare (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| RAG / vector store integrat | ✓ | ✓ | limitat¹ | plugin² |
| Citire / scriere WebSocket | ✓ | limitat¹² | –¹³ | –¹⁴ |
| Constructor de fluxuri de lucru în limbaj natural | ✓ | limitat³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Deschiderea unei rulări în curs pe canvas-ul live | ✓ | limitat¹⁹ | limitat¹⁹ | –¹⁹ |
| Dashboard-uri bazate pe fluxuri de lucru | ✓ | limitat¹⁷ | limitat¹⁷ | limitat¹⁷ |
| Tablă Kanban agentică | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Sistem de Skills pentru agenți | ✓ | – | – | – |
| Drive de fișiere integrat (linkuri de partajare, echipe) | ✓ | limitat²² | limitat²² | –²² |
| Nod de automatizare a browserului (Playwright) | ✓ | limitat²³ | limitat²³ | –²³ |
| Inspectarea trace-urilor LLM | ✓ | limitat⁴ | – | ✓ |
| Export de trace-uri OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Urmărirea costului tokenilor LLM (USD) | ✓ | –¹⁵ | –¹⁵ | limitat¹⁵ |
| Eval-uri integrate pentru fluxuri de lucru AI | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | limitat⁶ | limitat⁷ |
| Guardrails pentru LLM | ✓ | ✓⁸ | ✓⁸ | limitat⁸ |
| Compresie automată a contextului | ✓ | – | – | – |
| Execuție DAG paralelă | ✓ | limitat⁹ | – | – |
| Self-hostable, cu cod sursă disponibil | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL pentru date dinamice | ✓ | ✓ | limitat | ✓ |
> **Note de subsol:** ¹ Zapier Knowledge Sources — nu expune un vector store sau control al embedding-urilor. ² Make.com are module Pinecone/Qdrant, dar niciun nod RAG nativ. ³ n8n AI Workflow Builder este beta doar în cloud, cu limite de credite. ⁴ n8n afișează pașii intermediari; trasarea completă necesită instrumente terțe. ⁵ n8n acceptă aprobări pentru apeluri de instrumente AI prin chat, e-mail și canale de colaborare, dar nu realizează snapshot și reluare a întregii execuții așa cum face Heym. ⁶ Zapier Human in the Loop acceptă aprobări și colectare de date în cadrul Zap-urilor, dar nu este un sistem de checkpoint cu revizuire publică și reluare din snapshot. ⁷ Make.com oferă Human in the Loop ca aplicație Enterprise cu cereri de revizuire și rezultate de tip ajustat/aprobat/anulat, dar rămâne limitat de plan și mai puțin nativ pentru agenți. ⁸ n8n livrează un nod dedicat Guardrails, Zapier livrează AI Guardrails în produsele sale AI, iar Make.com documentează reguli pentru agenți plus fluxuri de revizuire, dar nu o funcționalitate standalone comparabilă de guardrails, astfel încât Make este marcat ca limitat. ⁹ n8n execută secvențial în mod implicit; paralelismul necesită soluții ocolitoare prin sub-workflow-uri. ¹⁰ Sustainable Use License — gratuit pentru self-hosting în uz intern, redistribuire comercială restricționată. ¹¹ Începând cu 22 aprilie 2026, documentația oficială n8n descrie batching HTTP și tipare loop/wait, nu o ramificare nativă de tip batch-status pentru LLM; documentația oficială a aplicației ChatGPT de la Zapier nu listează trigger-e și doar un API Request beta generic; pagina oficială de integrare OpenAI a Make expune acțiuni batch precum create/watch completed, dar nu un nod LLM de primă clasă cu ramificare pe status, astfel încât n8n/Make sunt marcate ca limitate, iar Zapier este marcat ca indisponibil pentru acest tipar specific de workflow. ¹² Documentația oficială n8n acoperă nodurile HTTP Webhook și HTTP Request plus extensibilitatea prin Code/custom/community, dar nu am putut găsi un nod first-party de trigger/send WebSocket, astfel încât n8n este marcat ca limitat. ¹³ Documentația oficială Zapier acoperă webhook-uri de intrare și cereri webhook/API de ieșire doar prin HTTP, nu pași nativi de trigger sau send WebSocket. ¹⁴ Documentația oficială Make acoperă modulele Webhooks și modulele de cereri HTTP(S), dar nu am putut găsi un modul nativ de trigger sau send WebSocket. ¹⁵ n8n nu are urmărire nativă a costului pe token pentru LLM; există workflow-uri comunitare ocolitoare, dar necesită instalare manuală și apeluri API post-execution (cerere de funcționalitate deschisă începând cu mai 2026). Zapier nu expune utilizatorilor numărul de token-uri pe execuție sau costul în USD; pașii AI consumă doar task-uri. Dashboard-ul de credite al Make.com reflectă parțial consumul de token-uri pentru AI-ul găzduit de Make (din august 2025), dar conexiunile cu chei API terțe sunt facturate ca 1 operație = 1 credit, fără numărare de token-uri; nu este disponibilă o defalcare în USD pe execuție și pe model. ¹⁶ Heym emite span-uri native OpenTelemetry (unul per rulare de workflow plus unul per nod) prin OTLP/HTTP către orice backend compatibil, cu propagare a contextului de trasare W3C și fără cod de instrumentare, configurat prin variabilele de mediu `HEYM_OTEL_*` și dezactivat implicit. n8n are o integrare documentată de trasare OpenTelemetry pentru execuțiile de workflow și nod. Zapier și Make.com nu documentează exportul OpenTelemetry al execuțiilor workflow/scenario începând cu iunie 2026. ¹⁷ n8n documentează un dashboard Insights pentru metrici de execuție în producție, Zapier documentează Zap History plus Task Usage, iar Make.com documentează Scenario History; acestea sunt suprafețe de monitorizare/istoric, nu widget-uri personalizate de dashboard susținute de logică arbitrară de workflow precum tab-ul Dashboard din Heym. ¹⁸ Heym Workflow Analyzer rulează workflow-ul atunci când este posibil, citește rezultatul execuției și generează un raport Markdown partajat și editabil care acoperă zonele de îmbunătățire, scopul și comportamentul pas cu pas. n8n documentează AI Workflow Builder pentru crearea/rafinarea/depanarea workflow-urilor, Zapier documentează depanarea AI pentru rulările Zap cu erori, iar Make.com documentează istoricul scenariilor plus pașii de raționament ai agentului AI, dar documentația lor publică nu descrie același document partajat de analiză a workflow-ului conștient de rulare. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) listează execuțiile în curs și poate încărca date dintr-o execuție anterioară în editor, în timp ce [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) expune o stare de rulare în editorul său. [Make Scenario History](https://help.make.com/scenario-history) documentează detaliile rulării și jurnalele. Documentația lor publică, verificată la 18 iulie 2026, nu descrie fluxul exact al Heym: deschiderea unei rulări de producție arbitrare în curs din History sau dintr-un card Kanban, restaurarea snapshot-ului nodului curent și continuarea primirii animației nodului și a jurnalelor Debug pe același canvas. ²⁰ Nodurile Heym [Codex](../nodes/codex-node.md) și [OpenCode Go](../nodes/opencode-go-node.md) rulează un CLI real de agent de codare într-un workspace Heym izolat, împotriva unui repository GitHub — clone, editare, producere de diff, push pe branch, deschidere de pull request — ca pas de workflow de primă clasă. Începând cu 20 iulie 2026, niciun competitor nu documentează un echivalent: [nodul OpenAI](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) al n8n acoperă apeluri API de chat/assistant, nu un agent de codare la nivel de repository, iar suportul nativ Codex rămâne o cerere a comunității; blogul propriu al Zapier documentează direcția inversă — [Codex care conduce instrumente Zapier prin Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — nu Codex ca pas de Zap; modulele OpenAI ale Make.com expun completions/assistants/acțiuni batch, nu un agent de codare care clonează repository-uri și deschide PR-uri. ²¹ [Tab-ul Board](../tabs/board-tab.md) al Heym este un board Kanban agentic integrat, ale cărui coloane execută workflow-uri și ale cărui carduri poartă context, istoric de conversație, stare de execuție și rulări. n8n ([integrare Kanban Tool](https://n8n.io/integrations/kanban-tool/)), Zapier ([integrări Kanban Tool](https://zapier.com/apps/kanbantool/integrations)) și Make.com ([integrare Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) se conectează doar la aplicații kanban terțe precum Kanban Tool, Wekan sau NocoDB; niciunul nu documentează un board integrat care își rulează propriile workflow-uri, începând cu 20 iulie 2026. ²² n8n stochează datele binare de execuție intern (opțional pe [stocare externă compatibilă S3](https://docs.n8n.io/hosting/scaling/external-storage/)), dar nu documentează niciun drive de fișiere orientat către utilizator cu link-uri de partajare sau partajare în echipă, astfel încât este marcat ca limitat. [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) al Zapier procesează fișiere doar pe durata unei rulări de Zap, iar [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) păstrează valori text mici, astfel încât Zapier este marcat ca limitat. [Data stores](https://help.make.com/l6du-data-stores) ale Make.com păstrează înregistrări structurate, iar [gestionarea fișierelor](https://help.make.com/working-with-files) transmite fișiere între aplicații fără stocare persistentă integrată, astfel încât Make este marcat ca indisponibil. ²³ [Nodul Playwright](../nodes/playwright-node.md) al Heym este automatizare de browser first-party cu un mod vizual de pași, pași generați de AI și un mod complet de cod. n8n oferă doar pachete comunitare precum [n8n-playwright](https://github.com/toema/n8n-playwright) cu o [cerere de funcționalitate încă deschisă pentru noduri native de automatizare a browserului](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), astfel încât este marcat ca limitat. Zapier Agents pot [naviga și citi pagini prin web browsing și o extensie Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), dar Zapier nu documentează niciun pas de automatizare scriptată a browserului, astfel încât este marcat ca limitat. Make.com documentează module HTTP și aplicații terțe de scraping, nu vreun modul nativ de automatizare a browserului, începând cu 20 iulie 2026.
## Resurse conexe

- [Introducere](./introduction.md) – Prezentare generală a platformei
- [Pornire rapidă](./quick-start.md) – Creați primul dumneavoastră workflow
- [Analiza workflow-urilor](../reference/workflow-analysis.md) – Generați rapoarte partajate ale execuțiilor workflow-urilor și feedback pentru îmbunătățire
- [Fila Dashboard](../tabs/dashboard-tab.md) – Creați dashboard-uri bazate pe workflow-uri cu widget-uri grafice generate de AI
- [Nodul Agent](../nodes/agent-node.md) – Nod LLM cu apelare de unelte, MCP și competențe
- [Arhitectura agentului](../reference/agent-architecture.md) – Sub-agenți, orchestrator și dispecerizarea uneltelor
- [Fila Board](../tabs/board-tab.md) – Tablă Kanban agentică cu coloane care execută workflow-uri
- [Nodul Codex](../nodes/codex-node.md) – Rulați agentul de programare OpenAI Codex pe un depozit GitHub
- [Nodul OpenCode Go](../nodes/opencode-go-node.md) – Agent de programare independent de furnizor într-un container securizat
- [Fila Drive](../tabs/drive-tab.md) – Stocare de fișiere integrată cu linkuri de partajare, echipe și acțiuni în bloc
- [Nodul Playwright](../nodes/playwright-node.md) – Automatizare de browser first-party cu pași AI și mod cod
- [Nodul RAG / Vector Store](../nodes/rag-node.md) – Căutare vectorială și inserare de documente (Qdrant sau Postgres pgvector)
- [Asistent AI](../reference/ai-assistant.md) – Constructor de workflow-uri în limbaj natural
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Puncte de control ale agentului cu URL-uri publice de revizuire
- [Guardrails](../reference/guardrails.md) – Blocați prompt-urile nesigure înainte de a ajunge la modelele dumneavoastră
- [Fila Traces](../tabs/traces-tab.md) – Observabilitatea apelurilor LLM
- [Fila Evals](../tabs/evals-tab.md) – Suite de teste pentru workflow-uri AI
- [Fila Alerts](../tabs/alerts-tab.md) – Alerte de prag pentru erori, durată, cost și volum de execuții
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Exportați span-uri de execuție, nod și unealtă prin OTLP
- [Distribuirea încărcării](../reference/cluster.md) – Partajați execuțiile între instanțe cu failover pentru lider
- [Single Sign-On](../reference/sso.md) – Autentificare prin orice furnizor OpenID Connect
- [Audit Logging](../reference/audit.md) – Acțiuni relevante pentru securitate cu actor, țintă și rezultat
- [Portal](../reference/portal.md) – Publicați workflow-uri ca interfețe de chat publice
- [Execuție paralelă](../reference/parallel-execution.md) – Execuție concurentă bazată pe DAG
- [Fila MCP](../tabs/mcp-tab.md) – Configurare server și client MCP
