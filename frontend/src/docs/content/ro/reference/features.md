# Setul complet de funcționalități Heym

O prezentare cuprinzătoare a tuturor capabilităților Heym. Fiecare secțiune descrie o funcționalitate sau un concept în câteva propoziții.

---

## Primii pași

### [Introducere](../getting-started/introduction.md)

Heym este infrastructura pentru rularea și guvernanța agenților AI în producție. Construiți sisteme agentice pe un canvas vizual și rulați-le cu încredere: orchestrați agenți, automatizați procese de business, inspectați fiecare execuție și mențineți oamenii în control pe propria infrastructură. Suportă workflow-uri vizuale, noduri bazate pe AI ([LLM](../nodes/llm-node.md), [Nod Agent](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), un [Asistent AI](./ai-assistant.md), integrări ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), email inbound prin [IMAP Trigger](../nodes/imap-trigger-node.md), email outbound prin [Send Email](../nodes/send-email-node.md)), programare cu [Cron](../nodes/cron-node.md) și portaluri de chat [Portal](./portal.md) pentru utilizatorii finali.

Consultați și [Concepte de bază](../getting-started/core-concepts.md), [Tipuri de noduri](./node-types.md) și [Integrări terțe](./integrations.md).

### [De ce Heym](../getting-started/why-heym.md)

De ce Heym parcurge ciclul de viață al agentului (construire, orchestrare, rulare, observare, evaluare, control, expunere) și arată ce gestionează un singur runtime self-hosted la fiecare etapă. Aceasta acoperă nodul [LLM](../nodes/llm-node.md) și [Nodul Agent](../nodes/agent-node.md) cu apelare de unelte, unelte Python, conexiuni [MCP](../tabs/mcp-tab.md), abilități și orchestrare multi-agent; trigger-e, reîncercări și [distribuirea încărcării](./cluster.md); [Execuții](../tabs/traces-tab.md) cu cost USD per rulare și export OpenTelemetry; [Evaluări](../tabs/evals-tab.md); [puncte de verificare pentru revizuire umană](./human-in-the-loop.md), guardrails, SSO și o urmă de audit; și endpoint-uri REST, MCP și Portal. O comparație de capabilități cu n8n, Zapier și Make.com încheie pagina.

Consultați și [Nodul Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) și [Arhitectura agentului](./agent-architecture.md).

### [Pornire rapidă](../getting-started/quick-start.md)

Puneți în funcțiune primul workflow în câteva minute: creați un workflow din fila [Workflow-uri](../tabs/workflows-tab.md), adăugați un nod [Input](../nodes/input-node.md), un nod [LLM](../nodes/llm-node.md) și un nod [Output](../nodes/output-node.md), apoi conectați-le. Configurați [LLM](../nodes/llm-node.md) cu o acreditare și setați `userMessage` la `$input.text`; utilizați Run sau [Asistentul AI](./ai-assistant.md) pentru a executa sau genera workflow-uri cu limbaj natural.

Se îmbină natural cu [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) și [Expression DSL](./expression-dsl.md).

### [Concepte de bază](../getting-started/core-concepts.md)

Workflow-urile sunt grafuri orientate de noduri conectate prin muchii; execuția curge de la nodurile trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) prin nodurile de procesare către nodurile [Output](../nodes/output-node.md). Fiecare nod are un tip, date (configurație) și intrări/ieșiri; muchiile definesc fluxul de date. Nodurile referențiază datele din amonte prin expresii [Expression DSL](./expression-dsl.md) precum `$nodeLabel.field`; nodurile independente rulează automat în [paralel](./parallel-execution.md).

Consultați și [Trigger-e](./triggers.md), [Execuție paralelă](./parallel-execution.md) și [Structura workflow-ului](./workflow-structure.md).

### [Rulare și implementare](../getting-started/running-and-deployment.md)

Heym oferă `run.sh` pentru dezvoltare locală (bază de date în Docker, backend FastAPI, frontend Vite) și `deploy.sh` pentru producție cu Docker Compose. Ambele utilizează un fișier `.env`; variabilele cheie includ `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` și `ALLOW_REGISTER`. Dezvoltarea rulează pe porturi configurabile de frontend și backend; producția servește API-ul sub `/api` prin containerul de frontend.

Consultați și [Securitate](./security.md), [Enterprise](./enterprise.md) și [Setări](./user-settings.md).

### [Migrare la Heym](../getting-started/migrate-to-heym.md)

Instrumentul AI Convert transformă un workflow dintr-o altă platformă (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) sau o descriere în limbaj natural într-un workflow Heym, transmis în timp real pe un canvas și gata de [descărcat și importat](./download-import.md). Rulează o verificare de siguranță AI, apoi generează DSL-ul cu limitele de intrare și de rată stabilite. Deschideți-l la [heym.run/convert](https://heym.run/convert).

Consultați și [Pornire rapidă](../getting-started/quick-start.md), [Descărcare și import](./download-import.md) și [Asistent AI](./ai-assistant.md).

---

## Noduri

### Trigger-e
#### [Input](../nodes/input-node.md)

Nodul Input este punctul de intrare pentru workflow-urile care primesc date de la utilizator sau de la apelantul API. Acceptă unul sau mai multe câmpuri de intrare și expune metadatele cererii (headers, query params). Accesați câmpurile din body prin `$nodeLabel.body.fieldKey`, headers prin `$nodeLabel.headers` și query prin `$nodeLabel.query`.

Se îmbină în mod natural cu [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) și [Output](../nodes/output-node.md). Pentru referințe la payload și accesarea câmpurilor, consultați [Expression DSL](./expression-dsl.md) și [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Nodul Cron declanșează un workflow conform unui program, utilizând o expresie cron standard cu cinci câmpuri. Nu este necesară nicio intervenție din partea utilizatorului—workflow-ul rulează automat la momentele specificate (de ex. din oră în oră, zilnic, la fiecare 15 minute). Rezultatul este un eveniment de tip trigger fără payload.

Consultați și [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) și [Execution History](./execution-history.md) pentru rulări programate și întârziate.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Nodul IMAP Trigger interoghează o căsuță poștală la un interval configurabil de minute și pornește un workflow pentru fiecare e-mail nou detectat. Acesta returnează headers analizate, liste de expeditori și destinatari, corpuri în text simplu și HTML, metadate ale atașamentelor și un timestamp al declanșării. Utilizați-l pentru trierea căsuțelor de suport, rutarea de la căsuța poștală către [Slack](../nodes/slack-node.md) sau fluxuri de aprobare bazate pe e-mail cu [Human-in-the-Loop](./human-in-the-loop.md).

Se îmbină cu [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) și [Slack](../nodes/slack-node.md) pentru workflow-uri de triere și răspuns la mesaje primite.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Nodul Heym Trigger pornește un workflow atunci când Heym însuși publică un eveniment de platformă: `heym.started`, `workflow.created`, `workflow.updated` sau `workflow.deleted`. Livrarea este grupată - fiecare eveniment publicat în intervalul unei ferestre de dispatch de cinci secunde ajunge într-o singură rulare ca `$nodeLabel.events`, întotdeauna un array. Fiecare eveniment este revendicat printr-o constrângere unică de bază de date, astfel încât se declanșează exact o dată per nod abonat, indiferent câți workeri, containere sau mașini rulează. Utilizați-l pentru urmărirea modificărilor workflow-urilor, anunțuri de deploy și sinteze privind starea instanței.

Se îmbină cu nodul [Heym](../nodes/heym-node.md) pentru a căuta workflow-ul modificat și cu [Loop](../nodes/loop-node.md) pentru a acționa o dată per eveniment.

#### [Heym](../nodes/heym-node.md)

Nodul Heym citește datele proprii ale Heym prin trei operațiuni: `listWorkflows` returnează fiecare workflow la care proprietarul are acces, împreună cu numărul de noduri și timestamp-uri, `getWorkflow` returnează structura de noduri și muchii a unui singur workflow, iar `getExecutionHistory` returnează intrări din istoricul execuțiilor, cele mai recente primele, cu filtre opționale de status, interval de timp și limită, alături de totaluri grupate după status. Rezultatele sunt limitate la proprietarul workflow-ului în care se află nodul, astfel încât o rulare pornită de cron, de un portal sau de un eveniment returnează aceleași date ca o rulare manuală. `getWorkflow` returnează configurația completă a nodurilor, ceea ce face posibilă auditarea unui workflow pentru chei sau token-uri hardcodate; nu expune nimic ce proprietarul workflow-ului nu ar putea deja deschide în editor. Nu este necesară nicio acreditare.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

Nodul WebSocket Trigger deschide o conexiune de client outbound către un server WebSocket extern și pornește workflow-ul la `onMessage`, `onConnected` sau `onClosed`. Acesta expune payload-uri de mesaje analizate, starea reconectării, metadate de închidere și URL-ul socket-ului pentru expresii în aval.

Se îmbină cu [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) și [SSE Streaming](./sse-streaming.md) pentru integrări în timp real.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Nodul Telegram Trigger primește actualizări webhook de la bot și pornește workflow-ul imediat. Acesta expune payload-ul complet al actualizării, obiectul principal de mesaj, callback queries, headers sanitizate și un timestamp al declanșării. Utilizați-l pentru chatbot-uri, asistenți AI în [Telegram](../nodes/telegram-node.md) și fluxuri bazate pe butoane.

Se îmbină cu [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) și [Webhooks](./webhooks.md) pentru workflow-uri bazate pe bot.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Nodul Slack Trigger primește webhook-uri Slack Events API și pornește automat un workflow după verificarea semnăturii cererii. Acesta expune payload-ul evenimentului și headers sanitizate pentru rutare în aval, clasificare bazată pe [LLM](../nodes/llm-node.md) și fluxuri de răspuns.

Se îmbină cu [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) și [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Nodul Discord Trigger primește webhook-uri Discord Interactions API, verifică semnăturile Ed25519 cu acreditarea `discord_trigger` selectată și pornește workflow-ul. Acesta expune payload-ul complet al interacțiunii, datele comenzii, headers sanitizate și metadate ale declanșării pentru rutare sau răspunsuri în aval.

Se îmbină cu [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) și [Third-Party Integrations](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

Nodul RabbitMQ trimite sau primește mesaje din cozi și exchange-uri RabbitMQ. Utilizați-l pentru workflow-uri bazate pe mesaje și procesarea evenimentelor. Modul de trimitere publică un mesaj cu întârziere opțională; modul de primire acționează ca un [trigger](./triggers.md), astfel încât workflow-ul pornește atunci când sosește un mesaj. Rezultatul include status, message_id și body.

Se combină cu [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) și [Parallel Execution](./parallel-execution.md) pentru procesare bazată pe evenimente.

#### [Error Handler](../nodes/error-handler-node.md)

Nodul Error Handler rulează automat atunci când orice nod din workflow eșuează. Nu sunt necesare muchii de intrare; acesta este declanșat de motor. Rezultatul include mesajul de eroare, eticheta nodului care a eșuat, tipul nodului și marcajul temporal. Utilizați-l pentru a trimite notificări prin [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) sau [Send Email](../nodes/send-email-node.md), pentru a înregistra erori sau pentru a returna răspunsuri de eroare personalizate.

Ca alternativă la gestionarea erorilor pe canvas, un workflow poate delega, de asemenea, eșecurile către un workflow separat — consultați [Error Workflow](#error-workflow). Dacă canvas-ul conține deja un nod Error Handler, workflow-ul de eroare **nu** este apelat (handler-ul local are prioritate).

Țintele comune de notificare sunt [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) și [Send Email](../nodes/send-email-node.md); detaliile execuției sunt mai ușor de inspectat în [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

Nodul AI Agent este un nod [LLM](../nodes/llm-node.md) cu apelare de unelte. Acesta poate rula unelte Python, poate apela noduri conectate din canvas ca unelte, se poate conecta la servere [MCP](../tabs/mcp-tab.md), poate utiliza abilități (fișiere de instrucțiuni și scripturi Python opționale), poate acționa ca un orchestrator care deleagă către alte noduri agent și poate apela alte workflow-uri ca unelte. Rezultatul este disponibil ca `$nodeLabel.text`. Un comutator opțional **Extra Body** atașează un obiect JSON cu parametri de cerere specifici furnizorului la fiecare cerere din bucla de apelare a uneltelor; este dezactivat implicit. Un comutator opțional **Use Responses API** direcționează apelurile modelului agentului prin Responses API, care păstrează raționamentul modelului de-a lungul apelurilor de unelte, astfel încât un model de raționament își menține lanțul de gândire pe parcursul unei bucle cu mai mulți pași; este dezactivat implicit și funcționează cu OpenAI și acreditări personalizate.

Uneltele sub formă de noduri din canvas permit unui agent să apeleze direct noduri de workflow configurate din canvas. Conectați un nod acceptat la mânerul de unelte al agentului, apoi marcați câmpuri specifice ca fiind furnizate de agent cu ajutorul pictogramei bot. Acele câmpuri devin parametri de unealtă la runtime, în timp ce acreditările și câmpurile nemarcate rămân fixe în configurația nodului.

Secțiunea Skills include acum **AI Build** pentru crearea de abilități noi, o acțiune de editare AI inline pentru abilitățile existente, descărcare ZIP per abilitate și un comutator opțional **Enable Drive files** pentru abilitățile care trebuie să citească fișiere Heym Drive la runtime. Fereastra modală Skill Builder transmite în flux o conversație de chat în stânga, acceptă fișiere prin tragere și plasare cu fiecare comentariu de reglaj fin, afișează o previzualizare live doar pentru citire a fișierelor generate `SKILL.md` și `.py` în dreapta, poate descărca acea previzualizare ca ZIP și salvează fișierele de reglaj fin încărcate înapoi ca active de abilitate incluse, prin același flux de ingestie ZIP utilizat de încărcările manuale.

Cu **[Agent Persistent Memory](./agent-persistent-memory.md)** activat, fiecare nod agent își păstrează propriul graf de cunoștințe: faptele sunt încărcate în prompt-ul de sistem atunci când nu sunt goale, iar execuțiile reușite declanșează o fuziune în fundal a noilor entități și relații. Sub-agenții utilizează grafuri separate. Puteți **partaja** graful unui agent cu alți agenți (din același workflow sau din alte workflow-uri) cu acces doar pentru citire sau citire/scriere din dialogul grafului. Controlul creierului din canvas deschide editorul de graf.

Nodurile agent pot intra, de asemenea, în modul [Human-in-the-Loop](./human-in-the-loop.md). În acest mod, agentul primește o unealtă `request_human_review` și poate face o pauză la pași specifici care necesită aprobare, poate crea un link public de revizuire de unică folosință, poate expune o ramură de canvas `review` pentru fluxuri de notificare și poate aștepta până când un revizor acceptă, editează sau refuză textul de revizuire Markdown. Câmpul HITL al nodului acționează ca ghid de aprobare pentru momentul în care trebuie solicitată aprobarea, în timp ce rezumatul destinat revizorului este generat din fiecare cerere de revizuire. Pentru uneltele [MCP](../tabs/mcp-tab.md), Heym utilizează modelul pentru a interpreta acele instrucțiuni scrise în `always`, `once` sau `never`, astfel încât limbajul liber de aprobare se mapează la o politică concretă de runtime. Execuția este marcată ca `pending` și se reia din instantaneul de execuție stocat după ce decizia sosește, iar aceeași execuție a agentului poate face pauză de mai multe ori dacă pașii ulteriori necesită, de asemenea, revizuire.

Nodurile agent comprimă automat istoricul acumulat de mesaje atunci când acesta se apropie de 80% din fereastra de context a modelului. Prompt-ul de sistem, primul mesaj al utilizatorului și cel mai recent mesaj al utilizatorului sunt întotdeauna păstrate; tot ce se află între ele este rezumat utilizând același model și aceeași acreditare. Evenimentele de comprimare sunt vizibile în panoul Debug, în [Execution History](./execution-history.md) și în fila [Traces](../tabs/traces-tab.md).

Consultați și [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) și [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Nodul Codex rulează OpenAI Codex CLI într-un spațiu de lucru Heym izolat. Acesta acceptă o acreditare Codex (autentificați-vă cu ChatGPT pentru a utiliza abonamentul dvs. fără costuri API per token sau lipiți un token de acces), o acreditare GitHub, URL-ul depozitului, branch-ul de bază, prompt-ul sarcinii, modul de publicare (`diff_only` sau `draft_pr`), numele branch-ului și timeout-ul. Runner-ul clonează depozitul local, transmite pachetul de token-uri ChatGPT sau `CODEX_ACCESS_TOKEN` exclusiv procesului Codex și returnează un rezumat structurat, note de validare, fișiere modificate, diff, metadate de utilizare și un URL opțional pentru draft PR.

Când Codex returnează `needs_input`, workflow-ul se pauzează și expune branch-ul `question`. Conectați acel branch la Slack, email sau alt nod de notificare; linkul public de continuare reia instantaneul execuției salvate după ce răspunsul este trimis. Nodul Codex poate fi de asemenea atașat unui AI Agent ca instrument, permițând agentului să delege sarcini de programare; ca instrument, un rezultat `needs_input` este returnat inline agentului în loc să pauzeze workflow-ul.

Consultați și [GitHub](../nodes/github-node.md), [Acreditări](./credentials.md), [Partajarea acreditărilor](./credentials-sharing.md) și [Tipuri de noduri](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Nodul OpenCode Go rulează OpenCode CLI (Go) împotriva unui depozit GitHub. Izolarea urmează modelul Codex: local rulează ca subproces gazdă, în timp ce implementările Docker îl rulează într-un container frate securizat care partajează volumul spațiului de lucru. Acesta acceptă o acreditare OpenCode Go (o cheie API gateway cu un URL de bază opțional), o acreditare GitHub, URL-ul depozitului, branch-ul de bază, prompt-ul sarcinii, modul de publicare, numele branch-ului, timeout-ul și un model `opencode-go/<model>` ales dintr-o listă de modele live, căutabilă (cu o soluție de rezervă integrată). Heym efectuează toate operațiunile git/GitHub pe gazdă și nu plasează niciodată token-ul GitHub în sandbox; OpenCode editează doar fișiere pe disc. Nodul returnează un rezumat structurat, note de validare, fișiere modificate, diff și un URL opțional pentru pull request. Poate fi atașat unui AI Agent ca instrument.

Consultați și [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Acreditări](./credentials.md), [Partajarea acreditărilor](./credentials-sharing.md) și [Tipuri de noduri](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Nodul LLM procesează text cu un model lingvistic sau generează imagini. Acesta acceptă generarea de text, viziune (intrare imagine), generarea de imagini, ieșire JSON structurată, execuția Batch API nativă a furnizorului pentru endpoint-uri OpenAI și compatibile OpenAI acceptate și un comutator opțional **Use Responses API** care direcționează apelul prin Responses API în loc de Chat Completions (dezactivat implicit; funcționează cu OpenAI și acreditări personalizate și nu poate fi combinat cu modul Batch). Configurați acreditarea, modelul, mesajele de sistem și utilizator, temperatura și numărul maxim de token-uri; utilizați [Expression DSL](./expression-dsl.md) în prompt-uri. În modul batch, `userMessage` trebuie să se rezolve la un array, nodul emite un branch `batchStatus` cu actualizări de progres, iar ieșirea finală include rezultate batch per element. Un comutator opțional **Extra Body** atașează un obiect JSON de parametri de cerere specifici furnizorului (de exemplu `{"thinking": {"type": "disabled"}}`) la fiecare apel API; este dezactivat implicit. [Guardrails](./guardrails.md) opționale blochează conținutul nesigur înainte de apel.

Se îmbină natural cu [Qdrant RAG](../nodes/rag-node.md), [Nodul Agent](../nodes/agent-node.md), [Guardrails](./guardrails.md) și [Dialogul de evaluare a expresiilor](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Nodul Decision adresează unui model de decizie întrebări tastate despre starea execuției și returnează probabilități în loc de text. Un câmp **State** transportă ceea ce modelul ar trebui să citească — o expresie singulară își păstrează propriul tip, astfel încât `$input` trimite obiectul în loc de textul său — iar o listă de întrebări transportă judecățile. Întrebările vin în trei forme: **noul** răspunde dacă o condiție este îndeplinită, **choice** alege o opțiune dintr-un set pe care îl definiți și returnează distribuția completă, iar **score** evaluează starea pe niveluri ordonate și poate ajunge între ele. Răspunsurile choice și score transportă și o încredere, astfel încât un [Switch](../nodes/switch-node.md) poate direcționa pe baza răspunsului, în timp ce un [Condition](../nodes/condition-node.md) filtrează pe baza cât de sigur a fost. **Generate with AI** schițează șablonul de stare și rândurile de întrebări dintr-o propoziție simplă, iar **Custom request body** trimite JSON scris manual pentru un endpoint al cărui contract diferă. Răspunsul furnizorului este transmis neschimbat, iar fiecare apel este înregistrat în [Traces](../tabs/traces-tab.md).

Necesită o acreditare Decision Model; se îmbină natural cu [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) și [Nodul Agent](../nodes/agent-node.md).
#### [RAG / Depozit vectorial](../nodes/rag-node.md)

Nodul RAG / Depozit vectorial inserează, face upsert, șterge și caută documente într-un depozit vectorial pentru generare augmentată prin recuperare. Un meniu derulant Database selectează backend-ul — **Qdrant** (server extern) sau **Postgres (pgvector)** (baza de date proprie Heym, fără serviciu extern), implicit Qdrant. Alegeți un depozit vectorial din fila [Depozite vectoriale](../tabs/vectorstores-tab.md) și setați operația la insert, upsert, delete sau search. Upsert și delete adresează un document printr-un id unic stocat în payload — un câmp **Document ID Field** numește acel câmp (implicit `doc_id`), iar **Document ID** conține valoarea acestuia — astfel încât un document păstrează id-ul pe care sistemul dvs. îl folosește deja: upsert înlocuiește fiecare punct corespunzător înainte de a stoca noua versiune, iar delete raportează dacă s-a găsit o potrivire. Metadatele documentului acceptă expresii în valorile sale, astfel încât `{"url": "$start.url"}` stochează ceea ce a produs execuția. Căutarea acceptă filtre de metadate și reranking Cohere opțional și returnează un array de rezultate cu text, scor, metadate, indicator reranked și count pentru utilizare în fluxuri [LLM](../nodes/llm-node.md) sau [Nod Agent](../nodes/agent-node.md).

Nodurile downstream comune sunt [LLM](../nodes/llm-node.md) și [Nod Agent](../nodes/agent-node.md); configurarea depozitului vectorial se află în [Depozite vectoriale](../tabs/vectorstores-tab.md).

#### [Nod MCP Call](../nodes/mcp-call-node.md)

Nodul MCP Call apelează direct un instrument [MCP](../tabs/mcp-tab.md) specific, fără ca un LLM să decidă ce instrument să invoce. Utilizați-l atunci când știți exact ce instrument să rulați în momentul proiectării — pentru execuție deterministă, într-un singur pas, a unui instrument MCP într-un workflow. Configurați o conexiune (SSE, Streamable HTTP sau stdio; aceleași câmpuri ca conexiunea MCP a [Nodului Agent](../nodes/agent-node.md)), faceți clic pe **Fetch Tools** pentru a popula un meniu derulant, selectați un instrument și completați câmpurile de argumente care sunt generate automat din schema de intrare a instrumentului. Fiecare argument acceptă o valoare statică sau o [expresie DSL](./expression-dsl.md), cum ar fi `$userInput.body.text`. Rezultatul este disponibil ca `$nodeLabel.result` (obiect JSON dacă poate fi parsat, altfel string). Nodul MCP Call nu poate fi conectat la un [Nod Agent](../nodes/agent-node.md) ca instrument de canvas.

Consultați și [Nod Agent](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) și [Expression DSL](./expression-dsl.md).

### Logică

#### [Condition](../nodes/condition-node.md)

Nodul Condition ramifică workflow-ul pe baza unei expresii if/else. Are două mânere de ieșire: unul pentru când condiția este adevărată și unul pentru falsă. Utilizați operatori de comparație și logici din [Expression DSL](./expression-dsl.md) în expresia condiției; nodul transmite intrarea către ramura aleasă.

Consultați și [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) și [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Nodul Switch direcționează execuția către căi diferite prin potrivirea unei valori cu cazuri. Configurați o expresie de evaluat și o listă de valori de caz; fiecare caz primește un mâner sursă, iar un mâner implicit este utilizat pentru valorile care nu corespund. Intrarea este transmisă către ramura potrivită.

Utilizați [Condition](../nodes/condition-node.md) pentru ramificare binară și [Merge](../nodes/merge-node.md) pentru a reuni căile direcționate; regulile de potrivire sunt acoperite în [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Nodul Merge așteaptă multiple intrări paralele și le combină într-o singură ieșire. Setați numărul de intrări de așteptat; nodul produce un obiect combinat odată ce toate ramurile s-au finalizat. Utilizați-l pentru a uni rezultatele din ramuri paralele înainte de a continua; nu îl utilizați când ramurile paralele se termină în noduri Output separate.

Consultați și [Execuție paralelă](./parallel-execution.md), [Loop](../nodes/loop-node.md) și [Output](../nodes/output-node.md) la recombinarea ramurilor.

#### [Loop](../nodes/loop-node.md)

Nodul Loop iterează peste un array, executând nodurile downstream pentru fiecare element. Necesită o conexiune inversă de la ultimul nod din corpul iterației pentru a avansa. În interiorul corpului buclei utilizați `item`, `index`, `total`, `isFirst` și `isLast`; bucla are ieșiri separate pentru calea de iterație și calea done.

Se împerechează cu [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) și [Expression DSL](./expression-dsl.md) pentru workflow-uri iterative.

### Date

#### [Set](../nodes/set-node.md)

Nodul Set transformă și mapează datele de intrare către o ieșire personalizată. Definiți mapări cheie-valoare unde fiecare valoare este o expresie [Expression DSL](./expression-dsl.md). Utilizați-l pentru majuscule, substring, concatenare, numere aleatorii și transformări similare. Accesați ieșirea prin cheie (de ex. `$setNode.keyName`). Când este conectat la un agent ca instrument de nod de canvas, valorile de mapare pot fi marcate ca furnizate de agent, astfel încât agentul să le completeze la runtime. Pentru apelarea altor workflow-uri utilizați nodul [Execute](../nodes/execute-node.md).

Consultați și [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) și [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Nodul Converter transformă datele între formate fără a scrie cod. Conversiile de text sunt `csvToJson` (text CSV într-un tablou de obiecte rând, sau tablouri atunci când nu există antet), `jsonToCsv` (un tablou de obiecte/rânduri în text CSV), `xmlToJson` (text XML într-un obiect) și `jsonToXml` (un obiect în text XML). Configurați direcția conversiei și expresia sursă; conversiile CSV utilizează suplimentar un delimitator și gestionarea antetului, iar `jsonToCsv` poate fixa o ordine explicită a coloanelor. Citarea, delimitatorii încorporați și liniile noi încorporate respectă RFC 4180. Atributele XML folosesc prefixe `@`, textul combinat cu atribute folosește `#text`, elementele repetate devin tablouri, iar expandarea entităților XML este dezactivată. Același nod funcționează și pe fișiere stocate. `imageToText` și `pdfToText` rulează Tesseract OCR, citind un fișier din Heym Drive (`$Upload.file.id` dintr-un trigger File upload, un rezultat al unui nod Drive sau un fișier generat de un agent), alegând limba automat din scriptul detectat sau folosind coduri pe care le numiți precum `tur` sau `eng+tur`, și normalizând textul la UTF-8 în mod implicit, cu normalizare NFC opțională și seturi de caractere mai restrânse precum `cp1254`. `fileConvert` rescrie un fișier stocat într-un alt format, documentele prin pandoc și imaginile prin Pillow, și salvează rezultatul ca un fișier Drive nou fără a atinge originalul. Rezultatul este disponibil ca `$converterNode.result`, cu `.language`, `.encoding`, `.page_count`, `.pages` și `.file` alături pentru rulările OCR, și `.id`, `.filename` și `.download_url` pentru `fileConvert`.

Consultați și [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) și [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Nodul Code rulează Python pe care îl scrieți, cu propriul `requirements.txt`, într-un container care este creat și distrus pentru fiecare execuție. Codul dumneavoastră definește o funcție `main(params)` și returnează orice valoare serializabilă JSON, care devine `$codeNode.result`; orice afișează este capturat separat ca `$codeNode.logs`, iar `$codeNode.install` raportează ce instrument a instalat dependențele. Parametrii sunt configurați ca un obiect JSON ale cărui expresii `$` sunt rezolvate înainte de rulare, iar codul îi citește cu notație cu punct precum `params.user.name` sau `params.orders[0].id`. Dependențele sunt instalate cu `uv`, cu revenire la `pip` pentru pachetele pe care `uv` nu le poate gestiona, fără cache între rulări; lăsarea `requirements.txt` gol omite complet instalarea și este mult mai rapidă. Faza de execuție nu are rețea decât dacă `codeAllowNetwork` este activat, în timp ce instalarea dependențelor ajunge întotdeauna la PyPI. Sandbox-ul rulează fără privilegii root cu toate capabilitățile eliminate, un sistem de fișiere root read-only, fără socket Docker și fără acces la secretele backend-ului, limitat la 512 MB de memorie, un CPU, 256 de procese, o instalare de 120 de secunde și o execuție de 60 de secunde. Docker este necesar și nu există mod de rezervă: fără un daemon accesibil, nodul eșuează în loc să ruleze codul dumneavoastră în procesul backend.

#### [Variable](../nodes/variable-node.md)

Nodul Variable setează sau actualizează o variabilă locală workflow-ului (`$vars.variableName`) sau o [variabilă globală](./global-variables.md) persistentă (`$global.variableName`). Utilizați-l pentru contoare, liste acumulate și stare partajată. Configurați numele variabilei, expresia valorii, coerciția tipului și dacă se stochează în depozitul global. Variabilele de tip tablou acceptă `$array()` și `.add()`.

Se împerechează cu [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) și [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Nodul Execute apelează un alt workflow (sub-workflow) și îi transmite date de intrare. Specificați workflow-ul țintă prin ID și furnizați date de intrare printr-o singură expresie sau mapări cheie-valoare. Rezultatul include workflow_id, status și outputs; utilizați-l pentru logică reutilizabilă, nu pentru transformarea datelor (folosiți Set pentru aceasta).

Consultați și [Canvas Features](./canvas-features.md) pentru Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) și [Output](../nodes/output-node.md).

### Integrări

#### [HTTP](../nodes/http-node.md)

Nodul HTTP efectuează cereri HTTP folosind configurare în stil cURL. Poate fi un punct de pornire al workflow-ului (fără muchie de intrare) sau poate primi date de intrare de la noduri anterioare. Răspunsul este disponibil ca status, headers și body (JSON analizat atunci când este aplicabil). Utilizați [Credentials](./credentials.md) pentru autentificare Bearer sau cu antet personalizat.

Se împerechează cu [Webhooks](./webhooks.md), [Credentials](./credentials.md) și [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Nodul WebSocket Send deschide o conexiune de client de ieșire, trimite un mesaj text/JSON/binar și o închide. Utilizați-l pentru a publica rezultatul workflow-ului către sisteme în timp real fără a crea un endpoint socket găzduit de Heym.

Consultați și [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) și [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Nodul Telegram trimite un mesaj de bot către un chat, un grup sau un canal. Configurați o [acreditare](./credentials.md) Telegram, setați `chatId` și compuneți `message`-ul de ieșire cu expresii [Expression DSL](./expression-dsl.md). Se îmbină în mod natural cu [Telegram Trigger](../nodes/telegram-trigger-node.md) pentru workflow-uri conversaționale și cu [Error Handler](../nodes/error-handler-node.md) pentru alerte destinate operatorilor.

Consultați și [Third-Party Integrations](./integrations.md) și [Credentials](./credentials.md) pentru configurare și modele de acreditări.

#### [Slack](../nodes/slack-node.md)

Nodul Slack trimite un mesaj către un canal Slack printr-un Incoming Webhook. Configurați o [acreditare](./credentials.md) Slack și o expresie pentru mesaj. Utilizați-l pentru notificări, alerte și raportarea erorilor; ieșirea trece prin intrare.

Se îmbină cu [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) și [Third-Party Integrations](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Nodul Discord trimite un mesaj către un canal Discord printr-un Incoming Webhook. Configurați o [acreditare](./credentials.md) Discord, compuneți mesajul de ieșire cu [Expression DSL](./expression-dsl.md) și, opțional, setați suprascrieri pentru numele de utilizator sau avatarul webhook-ului.

Se îmbină cu [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) și [Third-Party Integrations](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Nodul Send Email trimite e-mailuri prin SMTP. Configurați o [acreditare](./credentials.md) SMTP și expresii [Expression DSL](./expression-dsl.md) pentru destinatar(i), subiect și corp. Utilizați-l pentru notificări, alerte și e-mailuri tranzacționale. Ieșirea include status, to și subject.

[IMAP Trigger](../nodes/imap-trigger-node.md) completează Send Email prin gestionarea mesajelor primite. Împreună, permit unui workflow să citească e-mailurile primite dintr-o căsuță partajată, să le rezume sau să le clasifice cu noduri AI și să trimită un mesaj de continuare sau de escaladare. [Telegram Trigger](../nodes/telegram-trigger-node.md) și [Nodul Telegram](../nodes/telegram-node.md) oferă același model de intrare/ieșire pentru workflow-uri de chat bazate pe bot.

Pentru fluxuri de notificare bidirecționale, se îmbină bine și cu [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) și [Third-Party Integrations](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Nodul Redis efectuează operațiuni Redis: set, get, hasKey și deleteKey. Utilizați-l pentru caching, limitarea ratei și stocare cheie-valoare. Configurați o [acreditare](./credentials.md), tipul operațiunii, expresia cheii și, pentru operațiunile de tip set, valoarea și TTL-ul opțional. Ieșirea variază în funcție de operațiune (value, success, exists, deleted).

Se îmbină cu [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) și [Parallel Execution](./parallel-execution.md) pentru caching, limitare și coordonare.

#### [Grist](../nodes/grist-node.md)

Nodul Grist citește, scrie și gestionează date în foi de calcul Grist. Operațiunile includ getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables și listColumns. Furnizați ID-ul documentului, ID-ul tabelului și, pentru create/update, datele înregistrării folosind ID-urile coloanelor. Utilizați-l pentru CRUD, actualizări în lot și automatizarea foilor de calcul.

Consultați și [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) și [Third-Party Integrations](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Nodul Google Sheets citește, scrie și gestionează date din foi de calcul prin OAuth2. Utilizați-l pentru a citi rapoarte, a adăuga rezultatele workflow-ului, a actualiza trackere și a goli sau inspecta filele foii de calcul din interiorul unui workflow. La fel ca [BigQuery](../nodes/bigquery-node.md), folosește o acreditare de integrare susținută de Google și se potrivește bine alături de [Grist](../nodes/grist-node.md) atunci când datele din foi de calcul fac parte din flux.

Se îmbină cu [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) și [Third-Party Integrations](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

Nodul BigQuery execută interogări SQL și inserează rânduri în seturi de date Google BigQuery prin OAuth2. Este util pentru workflow-uri de analiză, pipeline-uri de raportare și scrierea datelor de evenimente structurate din execuțiile workflow-ului. Se îmbină adesea cu [Set](../nodes/set-node.md) pentru modelarea rândurilor și cu [Google Sheets](../nodes/google-sheets-node.md) pentru raportare mai ușoară orientată spre foi de calcul.

Se îmbină cu [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) și [Third-Party Integrations](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Nodul Google Drive listează, descarcă, actualizează și șterge fișiere și foldere din Drive prin OAuth2 și poate copia un fișier din Drive direct în [Heym Drive](../nodes/drive-node.md) cu operația sa `syncToHeymDrive`. Google Docs, Sheets și Slides nu au octeți descărcabili, astfel încât nodul le exportă automat — Docs în PDF, Sheets în XLSX, Slides în PPTX — cu posibilitatea de a suprascrie formatul țintă. Ștergerile mută elementele în coșul de gunoi al Drive, cu excepția cazului în care este activată opțiunea "Delete permanently", iar nodul refuză să șteargă un folder prin operația de fișier sau invers. La fel ca [Google Sheets](../nodes/google-sheets-node.md), utilizează o acreditare OAuth2 susținută de Google; rețineți că aceasta solicită acces complet la Drive, așa că consultați [Partajarea acreditărilor](./credentials-sharing.md) înainte de a o partaja.

Se îmbină cu [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) și [Integrări terțe](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Nodul GitHub oferă 40 de acțiuni native GitHub REST care acoperă depozite, organizații și utilizatori, issues, pull requests, recenzii, releases, workflow-uri Actions, informații despre trafic și fișiere din depozit. Utilizați-l pentru trierea issues, automatizarea recenziilor, declanșarea workflow-urilor și așteptarea finalizării acestora, automatizarea releases și actualizarea fișierelor din depozit fără a construi manual cereri HTTP. Acceptă GitHub.com și un `base_url` opțional pentru GitHub Enterprise la nivel de acreditare.

Se îmbină cu [Nodul Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) și [Integrări terțe](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Nodul Jira conectează workflow-urile la API-urile REST Jira Cloud sau Jira Data Center / Server pentru automatizarea proiectelor, issues, comentariilor, atașamentelor, utilizatorilor, notificărilor și tranzițiilor. Poate lista proiecte, căuta issues cu JQL, crea sau actualiza issues, inspecta changelogs, notifica părțile interesate, gestiona comentarii și atașamente, prelua sau gestiona utilizatori, lista tranzițiile disponibile și muta issues printr-un ID de tranziție. Utilizați o acreditare Jira cu e-mail Atlassian, API token, URL de bază al site-ului și mod de implementare.

Se îmbină cu [LLM](../nodes/llm-node.md), [Nodul Agent](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) și [Integrări terțe](./integrations.md) pentru preluarea solicitărilor de suport, trierea erorilor și workflow-uri de release.

#### [Linear](../nodes/linear-node.md)

Nodul Linear conectează workflow-urile la API-ul GraphQL al Linear pentru automatizarea spațiilor de lucru și a issues. Poate lista echipe, proiecte, issues, stări de workflow, membri ai echipei și comentarii; poate crea, actualiza, șterge și conecta issues; și poate crea, actualiza, rezolva, nerezolva sau șterge comentarii. Utilizați o cheie API personală Linear sau o acreditare OAuth2, apoi descoperiți UUID-urile de echipă, proiect, stare și responsabil din operațiile de listare înainte de a crea sau actualiza issues.

Se îmbină cu [LLM](../nodes/llm-node.md), [Nodul Agent](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) și [Integrări terțe](./integrations.md) pentru preluarea solicitărilor, triere și workflow-uri de backlog inginereasc.

#### [Supabase](../nodes/supabase-node.md)

Nodul Supabase citește și modifică tabelele expuse prin Supabase PostgREST. Funcționează bine pentru backend-uri de produs, date de utilizator/profil, starea workflow-urilor și automatizări de tip CRUD care necesită acces la baza de date fără configurarea manuală a cererilor HTTP.

Se îmbină cu [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) și [Integrări terțe](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Nodul ClickHouse execută operații CRUD, de numărare și SQL brut împotriva unei baze de date ClickHouse externe prin interfața sa HTTP. Este potrivit pentru pipeline-uri de analiză, jurnalizarea evenimentelor și workflow-uri de raportare: inserați evenimente pe măsură ce apar, apoi agregați-le sau numărați-le cu `query`/`count`. Oglindește setul de operații al [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) plus o soluție de acces SQL brut, cu `update`/`remove` executate ca mutații ClickHouse.

Se îmbină cu [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) pentru rapoarte programate și [Integrări terțe](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Nodul Notion gestionează bazele de date, sursele de date, paginile și blocurile Notion prin API-ul Notion actual (`2026-03-11`). Acceptă căutare, CRUD pentru pagini, operații pe baze de date și surse de date, blocuri copil, adăugare/actualizare/ștergere de blocuri și mutare la coș/restaurare. Utilizați un token de integrare internă sau o acreditare OAuth pentru integrare publică Notion. Editorul poate căuta și pagina cu cursor sursele de date și paginile părinte accesibile. Acreditările partajate funcționează la fel ca acreditările proprii pentru executarea workflow-urilor.

Pentru apeluri REST personalizate, `$credentials.YourNotionCredential` se rezolvă la același bearer token. Se îmbină cu [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) și [Integrări terțe](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Nodul Sentry automatizează organizațiile, proiectele, echipele, problemele, evenimentele și versiunile Sentry prin intermediul API-ului REST Sentry. Utilizați-l pentru trierea alertelor, actualizarea stării problemelor, automatizarea versiunilor, căutarea evenimentelor și configurarea sau curățarea proiectelor și echipelor. Acceptă Sentry SaaS și Sentry auto-găzduit printr-un URL de bază opțional pentru acreditări.

Se îmbină cu [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) și [Third-Party Integrations](./integrations.md) pentru workflow-uri de incidente și versiuni.

#### [DataTable](../nodes/datatable-node.md)

Nodul DataTable citește, scrie și gestionează date în Heym DataTables (stocare structurată first-party). Operațiile includ find, getAll, getById, insert, update, remove și upsert. Nu sunt necesare acreditări externe. Tabelele sunt gestionate din fila de dashboard [DataTable](../tabs/datatable-tab.md) și sunt accesate direct de către proprietarul workflow-ului.

Se îmbină cu [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) și fila [DataTable](../tabs/datatable-tab.md) pentru stocare structurată first-party.

#### [Drive](../nodes/drive-node.md)

Nodul Drive gestionează fișierele generate de skills direct din interiorul unui workflow. Operațiile includ delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams și unshareWithMyTeams pentru gestionarea accesului de citire pentru echipe; conversia de format se află în schimb în nodul [Converter](../nodes/converter-node.md). Referiți fișierul cu `$agentLabel._generated_files[0].id`; rezultatele includ status, file_id, updated download_url pentru constrângerile de link și shared_team_count pentru partajarea cu echipele. Acest lucru este util în special cu workflow-urile [Agent Node](../nodes/agent-node.md) care utilizează [File Generation](./file-generation.md) și modelul de referință [Drive](./drive.md).

Însoțitorii obișnuiți sunt [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) și [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Nodul Amazon S3 execută operații de stocare a obiectelor pe Amazon S3 utilizând o acreditare `s3` (cheie de acces, cheie secretă, regiune, token de sesiune opțional). Operațiile includ putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder și listBuckets. Sunt acceptate încărcarea de text și descărcarea de text sau base64, câmpurile bucket și key acceptând [Expression DSL](./expression-dsl.md). Utilizați-l pentru a stoca rezultatele workflow-ului, a arhiva fișiere și a citi obiecte înapoi într-un flux.

Se îmbină cu [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) și [Third-Party Integrations](./integrations.md).

### Automatizare

#### [Crawler](../nodes/crawler-node.md)

Nodul Crawler extrage pagini web utilizând FlareSolverr cu extragere HTML opțională prin selectori CSS. Configurați o [acreditare](./credentials.md) FlareSolverr, o expresie URL, timpul de așteptare și selectori opționali pentru extragere. Rezultatul este HTML-ul brut sau conținutul extras. Utilizați-l pentru web scraping și extragerea conținutului.

Se îmbină cu [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) și [LLM](../nodes/llm-node.md) pentru fluxuri de extragere și analiză.

#### [Playwright](../nodes/playwright-node.md)

Nodul Playwright automatizează interacțiunile cu browserul prin pași configurabili (navigate, refresh, click, type, screenshot, extract, aiStep) sau modul **Run Code** pentru Playwright Python personalizat (sandbox; dezactivat implicit prin `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Acceptă modul headless, o setare opțională care reduce semnalele comune de automatizare Playwright, timeout-uri, captură de rețea opțională (responses, cookies, localStorage, sessionStorage), bootstrap de autentificare cookie/storageState din expresii [Global Variables](./global-variables.md) precum `$global.authState`, pași de autentificare de rezervă atunci când restaurarea autentificării eșuează și un pas AI cu Auto Heal atunci când selectorii eșuează. Utilizați-l pentru web scraping, completarea formularelor și workflow-uri bazate pe browser.

Consultați și [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) și [Execution History](./execution-history.md) pentru automatizarea browserului și depanare.

### Utilitare

#### [Output](../nodes/output-node.md)

Nodul Output este endpoint-ul workflow-ului care returnează răspunsul către apelant. Setați expresia mesajului pentru a face referire la nodul anterior prin etichetă (nu utilizați niciodată `$input` de la nodul [Input](../nodes/input-node.md) aici). Fluxul descendent asincron opțional permite nodurilor de după output să ruleze în fundal după trimiterea răspunsului.

Sursele amonte obișnuite sunt [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) și [Execute](../nodes/execute-node.md); modelarea răspunsului este mai ușor de depanat în [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

Nodul JSON output mapper construiește un obiect JSON simplu din mapări cheie-valoare în stil [Set](../nodes/set-node.md) și îl returnează la rădăcina răspunsului workflow-ului. Utilizați-l atunci când un apelant API ar trebui să primească un corp JSON brut în loc de wrapper-ul standard al nodului [Output](../nodes/output-node.md).
#### [Mapare ieșire HTML](../nodes/html-output-mapper-node.md)

Nodul de mapare ieșire HTML randează un singur șablon HTML, interpolând expresiile `$nodeLabel.field` în pagină. Atunci când este singurul nod terminal al workflow-ului, webhook-ul de execuție răspunde cu `text/html` și codul de stare configurat al nodului în loc de un corp JSON, astfel încât un workflow poate servi o pagină direct către un browser. Trimiteți `X-Simple-Response: false` pentru a primi înapoi anvelopa JSON obișnuită pentru depanare.

Se împerechează cu [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Structura workflow-ului](./workflow-structure.md) și [Webhook-uri](./webhooks.md).

#### [Ieșire grafic](../nodes/chart-output-node.md)

Nodul Ieșire grafic este nodul terminal al unui workflow de widget [Dashboard](../tabs/dashboard-tab.md). Transformă rândurile produse de nodurile anterioare într-un payload de grafic standardizat pe care dashboard-ul îl randează. Alegeți un `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text sau HITL), mapați `labelField`/`valueField` (sau `series` pentru serii multiple, sau `text` pentru un mesaj markdown) și plasați-l ultimul; nu are muchie de ieșire. HITL ignoră rândurile anterioare și listează recenziile umane în așteptare.

Consultați și [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) și [Output](../nodes/output-node.md).

#### [Așteptare](../nodes/wait-node.md)

Nodul Așteptare întrerupe execuția workflow-ului pentru o durată specificată în milisecunde, până la 15 minute. Utilizați-l pentru limitarea ratei, acțiuni întârziate sau intervale de polling. Transmite intrarea neschimbată.

Se împerechează cu [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) și [Execuție paralelă](./parallel-execution.md) pentru ritmare și polling.

#### [Notă adezivă](../nodes/sticky-note-node.md)

Nodul Notă adezivă adaugă note markdown pe canvas. Nu este executat. Utilizați-l pentru documentație, instrucțiuni sau note de workflow alături de alte [Funcționalități canvas](./canvas-features.md). Faceți dublu clic pe canvas pentru a edita conținutul notei.

Consultați și [Funcționalități canvas](./canvas-features.md), [Scurtături tastatură](./keyboard-shortcuts.md) și [Organizarea workflow-ului](./workflow-organization.md).

#### [Jurnal consolă](../nodes/console-log-node.md)

Nodul Jurnal consolă înregistrează o valoare în consola backend (server). Utilizați-l pentru depanare și inspecție în timpul dezvoltării. Mesajul de jurnal acceptă expresii [Expression DSL](./expression-dsl.md); ieșirea transmite intrarea mai departe.

Se împerechează cu [Istoric execuții](./execution-history.md), [Execuții](../tabs/traces-tab.md) și [Dialog evaluare expresii](./expression-evaluation-dialog.md) pentru depanare.

#### [Dezactivare nod](../nodes/disable-node.md)

Nodul Dezactivare nod dezactivează permanent un alt nod din workflow setând indicatorul său `active` la false. Specificați nodul țintă prin etichetă. Utilizați-l pentru operațiuni unice, cum ar fi oprirea unui trigger [Cron](../nodes/cron-node.md) după îndeplinirea unei condiții.

Consultați și [Funcționalități canvas](./canvas-features.md), [Istoric editări](./edit-history.md) și [Cron](../nodes/cron-node.md) pentru modele de control al workflow-ului.

#### [Activare nod](../nodes/enable-node.md)

Nodul Activare nod reactivează un alt nod setând indicatorul său `active` la true și salvând modificarea. Specificați nodul țintă prin etichetă. Utilizați-l pentru a rearma un trigger [Cron](../nodes/cron-node.md) dezactivat dintr-un alt punct de intrare sau pentru a activa un nod odată ce o condiție este îndeplinită. O țintă care se află în aval de nodul Activare nod și nu a rulat încă rulează și în execuția curentă.

Consultați și [Dezactivare nod](../nodes/disable-node.md), [Funcționalități canvas](./canvas-features.md) și [Cron](../nodes/cron-node.md) pentru modele de control al workflow-ului.

#### [Aruncare eroare](../nodes/throw-error-node.md)

Nodul Aruncare eroare oprește imediat execuția workflow-ului și returnează un răspuns de eroare cu un cod de stare HTTP personalizat. Setați expresia mesajului de eroare și codul de stare (de ex. 400, 401, 403, 404, 429, 500). Utilizați-l pentru eșecuri de validare, acces neautorizat sau alte condiții de eroare, în special când este împerecheat cu [Condiție](../nodes/condition-node.md) și [Handler erori](../nodes/error-handler-node.md).

Se împerechează cu [Condiție](../nodes/condition-node.md), [Handler erori](../nodes/error-handler-node.md) și [Securitate](./security.md) pentru căi explicite de eșec.

---

## Referință
### [Tipuri de noduri](./node-types.md)

Heym oferă o varietate de tipuri de noduri: trigger-e precum [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) și [Error Handler](../nodes/error-handler-node.md); noduri AI precum [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) și [MCP Call](../nodes/mcp-call-node.md); noduri de logică precum [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) și [Loop](../nodes/loop-node.md); noduri de date precum [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) și [Heym](../nodes/heym-node.md); integrări precum [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) și [Drive](../nodes/drive-node.md); noduri de automatizare precum [Crawler](../nodes/crawler-node.md) și [Playwright](../nodes/playwright-node.md); și utilitare precum [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) și [Sticky Note](../nodes/sticky-note-node.md). Utilizați expresii precum `$input.text` și `$nodeLabel.field` în configurația nodurilor.

Consultați și [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) și [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym utilizează un limbaj simplu de expresii pentru a face referire la date din nodurile anterioare. Utilizați `$input` pentru nodul [Input](../nodes/input-node.md), `$nodeLabel.field` pentru orice nod anterior, `$credentials.CredentialName` pentru [acreditări](./credentials.md) și `$global.variableName` pentru [variabile globale](./global-variables.md). Variabilele speciale încorporate includ `$now`, `$UUID` și metadate ale workflow-ului: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` și `$executionId` (id-ul [Istoricului execuțiilor](./execution-history.md) al rulării — `/workflows/{id}/{executionId}` deschide acea rulare pe canvas; disponibil doar la runtime, gol în dialogul de previzualizare a expresiilor). Sunt acceptate literali, operații aritmetice, comparații, contextul [Loop](../nodes/loop-node.md), câmpuri imbricate și funcții ajutătoare pentru șiruri de caractere și tablouri (inclusiv `$text.toJson()` pentru a analiza un șir JSON). Atunci când valoarea completă este o singură expresie `$expr`, backend-ul păstrează tablourile, obiectele, valorile booleene și numerele ca tipuri native.

Consultați și [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) și [Workflow Structure](./workflow-structure.md).

### [Variabile globale](./global-variables.md)

Depozitul de variabile globale păstrează date persistente de tip cheie-valoare, specifice utilizatorului, care supraviețuiesc de-a lungul execuțiilor workflow-urilor. Creați variabile din fila [Variables](../tabs/global-variables-tab.md) sau dintr-un nod [Variable](../nodes/variable-node.md) cu opțiunea "Store in Global Variable Store" activată. Accesați-le cu `$global.variableName` în expresii; acestea pot fi partajate cu alți utilizatori sau cu [echipe](./teams.md).

Se completează cu [Variable](../nodes/variable-node.md), [Teams](./teams.md) și [Credentials Sharing](./credentials-sharing.md) pentru starea partajată a workflow-urilor.
### [Dialogul de evaluare a expresiilor](./expression-evaluation-dialog.md)

Dialogul de evaluare a expresiilor este un editor extensibil care apare atunci când faceți clic pe butonul de extindere de lângă câmpurile de expresie. Se deschide ca o fereastră modală mare, centrată, menține autocompletarea activă și reîmprospătează automat rezultatul de previzualizare din backend după ce încetați să tastați. Rezultatele de tip obiect și array pot fi parcurse cu selectorul de căi de ieșire. Dialogul acceptă o cale cu punct simplu pe un rând întreg (de exemplu `myNode.output.field`) ca și cum ar fi `$myNode.output.field`; consultați regulile de plasare din [Expression DSL](./expression-dsl.md).

Butonul **Build with AI** din bara de instrumente vă permite să descrieți expresia dorită în text simplu. Selectați o [acreditare](./credentials.md) LLM și un model, tastați o descriere precum *„Obține numele clientului din răspunsul API"* și faceți clic pe Generate. Backend-ul trimite contextul [Expression DSL](./expression-dsl.md) și ieșirile nodurilor de la ultima execuție către model și returnează un singur șir de expresie. Rezultatul este evaluat imediat, astfel încât să îl puteți verifica înainte de a face clic pe Apply.

Se potrivește în mod natural cu [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) și [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Structura Workflow-ului](./workflow-structure.md)

Workflow-urile sunt stocate ca JSON cu noduri și muchii. Obiectul workflow include id, name, description, nodes, edges și setările de autentificare. Fiecare nod are id, type, position și data (etichetă și configurație specifică tipului). Muchiile conectează ID-urile nodurilor sursă și țintă cu ID-uri de handle opționale. Sintaxa expresiilor din câmpurile data urmează [Expression DSL](./expression-dsl.md), iar aceeași structură este utilizată de [Download & Import](./download-import.md).

Consultați și [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md) și [Download & Import](./download-import.md).

### [Funcționalități Canvas](./canvas-features.md)

Treceți cu cursorul peste orice nod non-sticky din canvas și faceți clic pe **Run** pentru a executa până la acel nod. Intrările obligatorii se deschid în panoul Run cu primul câmp focalizat; căile fără intrări pornesc imediat. Consultați [Run to Node](./canvas-features.md#run-to-node).

Editorul de workflow-uri oferă Data Pin (fixați ultima ieșire a unui nod pentru testarea în aval fără a rula din nou), Execution Logs (rezultatele nodurilor în timp real și progresul agentului care completează [Execution History](./execution-history.md)), Enable/Disable (omite nodurile în timpul execuției) și Extract to Sub-Workflow (mutați o selecție într-un workflow nou și înlocuiți-o cu un nod [Execute](../nodes/execute-node.md)). O execuție de producție în curs poate fi deschisă din History sau dintr-un card Board; editorul restaurează instantaneul curent, se atașează la SSE și menține animația canvas-ului și jurnalele Debug active. [Keyboard Shortcuts](./keyboard-shortcuts.md) acceptă copiere, lipire, rulare și căutare inline a nodurilor.

Consultați și [Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md) și [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Scurtături de tastatură](./keyboard-shortcuts.md)

Heym oferă scurtături în întregul editor: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo și Escape pentru închidere. Pe canvas: select all, multi-select, copy/cut/paste, delete, toggle node enabled (D), toggle pinned data (P) și căutare inline a nodurilor prin tastare. Scurtăturile sunt documentate în referința din aplicație și funcționează împreună cu [Canvas Features](./canvas-features.md), precum Data Pin și activarea/dezactivarea nodurilor.

Consultați și [Canvas Features](./canvas-features.md), [Quick Drawer](./quick-drawer.md) și [Contextual Showcase](./contextual-showcase.md).

### [Asistent AI](./ai-assistant.md)

Asistentul AI este un panou de chat deschis din panoul Debug care vă permite să creați sau să modificați workflow-uri cu limbaj natural. Selectați o [acreditare](./credentials.md) și un model, apoi descrieți ce doriți; AI-ul transmite un răspuns în flux, iar orice [workflow JSON](./workflow-structure.md) valid dintr-un bloc de cod este analizat automat și aplicat pe canvas. Introducerea vocală este acceptată în browserele compatibile.

Activați **modul YOLO** (modul Agent, dezactivat implicit) și asistentul testează ceea ce construiește. După fiecare modificare, rulează workflow-ul pe canvas, citește rezultatul și corectează workflow-ul până când face ceea ce ați cerut, pentru maximum 5 rulări per mesaj. Solicită intrări de test înainte de prima rulare, poate rula celelalte workflow-uri ale dvs. atunci când are nevoie de rezultatul lor și afișează fiecare pas pe măsură ce lucrează. Consultați [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode).

Atunci când un workflow stochează înregistrări, asistentul întreabă ce [tabel de date](../tabs/datatable-tab.md) să utilizeze sau creează unul cu coloanele de care are nevoie workflow-ul. Consultați [AI Assistant › Data tables](./ai-assistant.md#data-tables).

Atunci când workflow-ul curent conține abilități ale [Agent Node](../nodes/agent-node.md), asistentul trimite doar `SKILL.md` al fiecărei abilități în contextul workflow-ului. Fișierele `.py` atașate și activele binare ale abilităților sunt excluse înainte de cerere, astfel încât pachetele mari de abilități să nu depășească fereastra de context a modelului.

Se potrivește bine cu [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md) și [Expression DSL](./expression-dsl.md).
### [Chat cu Heym](./chat-with-heym.md)

Chat cu Heym este un asistent pentru antetul documentației, destinat întrebărilor despre produs. Se deschide într-un dialog centrat, păstrează selecția acreditărilor și a modelului vizibilă în partea de sus, injectează calea paginii active de documentație ca context și șterge istoricul mesajelor la închiderea dialogului. Completează [AI Assistant](./ai-assistant.md) extins și [Contextual Showcase](./contextual-showcase.md) mai simplu.

Consultați și [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) și [Node Types](./node-types.md).

### [Organizarea Workflow-urilor](./workflow-organization.md)

Administratorii de instanță (`HEYM_ADMIN_EMAILS`) pot accesa și edita orice workflow, pot găsi workflow-urile unui proprietar după email, pot inspecta programările și istoricul execuțiilor, pot întrerupe și relua trigger-ele automate și pot șterge workflow-uri după ce execuțiile se finalizează. Consultați [Instance Administration](../tabs/workflows-tab.md#instance-administration) pentru fluxul de offboarding și distincția dintre întreruperea trigger-elor automate și blocarea tuturor apelurilor.

Workflow-urile pot fi organizate în foldere și sub-foldere într-o structură arborescentă. Folderele au nume și părinte opțional; workflow-urile sunt atribuite folderelor. Workflow-urile pot fi programate pentru ștergere (mutate într-o zonă de coș înainte de eliminarea permanentă). API-ul acceptă crearea, actualizarea, ștergerea și mutarea workflow-urilor între foldere, iar același model de organizare apare în fila [Workflows](../tabs/workflows-tab.md).

Consultați și [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) și [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer este un panou fix de execuție rapidă pe partea dreaptă, pentru paginile interne care nu sunt pe canvas. Permite căutarea [workflow-urilor](../tabs/workflows-tab.md), fixarea favoritelor, selectarea intrărilor, executarea imediată și inspectarea progresului sau rezultatelor fără a deschide editorul. Ordinea de fixare și ultimul workflow selectat sunt stocate în browser.

Consultați și [Organizarea Workflow-urilor](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) și [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase este o bară compactă de ghidare în aplicație, pentru suprafețele principale autentificate, cum ar fi filele din dashboard, [Evals](../tabs/evals-tab.md), Docs și editorul de workflow-uri. Rămâne închisă implicit, oferă mai întâi un scurt rezumat al paginii, oferă detalii suplimentare la cerere și trimite către articolul complet de documentație atunci când doriți îndrumare mai aprofundată.

Se completează cu [Chat cu Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) și [AI Assistant](./ai-assistant.md) pentru fluxuri de ghidare în aplicație.

### [Acreditări](./credentials.md)

Acreditările stochează chei API și secrete utilizate de nodurile de workflow. Adăugați-le în fila [Credentials](../tabs/credentials-tab.md) și faceți referire la ele după nume sau ID în noduri precum [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) și [Redis](../nodes/redis-node.md). Acestea sunt criptate în repaus, pot fi partajate cu utilizatori sau [echipe](./teams.md) și pot fi, de asemenea, referite în [Expression DSL](./expression-dsl.md) prin `$credentials.Name`.

Consultați și [Credentials](../tabs/credentials-tab.md), [Partajarea Acreditărilor](./credentials-sharing.md) și [Third-Party Integrations](./integrations.md).

### [Partajarea Acreditărilor](./credentials-sharing.md)

Acreditările pot fi partajate cu alți utilizatori prin email sau cu echipe; toți membrii echipei obțin acces atunci când o acreditare este partajată cu o echipă. Acreditările partajate apar cu un indicator în fila [Credentials](../tabs/credentials-tab.md). La runtime, contextul proprietarului workflow-ului fuzionează acreditările deținute, cele partajate cu utilizatorul și cele partajate cu echipa. Utilizați `$credentials.CredentialName` în expresii sau setați credentialId în datele nodului.

Consultați și [Acreditări](./credentials.md), [Echipe](./teams.md) și [Third-Party Integrations](./integrations.md).

### [Echipe](./teams.md)

Echipele permit partajarea workflow-urilor, acreditărilor, variabilelor globale, depozitelor vectoriale și fișierelor Drive cu un grup de utilizatori simultan. Creați echipe din fila [Teams](../tabs/teams-tab.md) și adăugați membri prin email. Partajați resurse cu o echipă din dialogurile de partajare relevante; toți membrii au apoi acces. Creatorul poate edita și șterge echipa; ștergerea unei echipe elimină toate partajările echipei.

Se completează cu [Partajarea Acreditărilor](./credentials-sharing.md), [Global Variables](./global-variables.md) și [Enterprise](./enterprise.md).

### [Execuție Paralelă](./parallel-execution.md)

Heym rulează nodurile în paralel atunci când acestea nu au dependențe între ele. Executorul construiește un DAG și rulează nodurile de la același nivel concurent, cu un thread pool; imediat ce un nod se finalizează, nodurile sale din aval sunt programate. Utilizați nodul [Merge](../nodes/merge-node.md) pentru a combina ramurile paralele atunci când este necesar. Mai multe execuții de workflow rulează concurent; fiecare execuție este izolată. Modul [SSE Streaming](./sse-streaming.md) emite evenimente pe măsură ce nodurile se finalizează.

Consultați și [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) și [Execution History](./execution-history.md).
### [Arhitectura Agentului](./agent-architecture.md)

[Nodul Agent](../nodes/agent-node.md) acceptă sub-agenți (orchestratorul apelează alte noduri agent prin call_sub_agent), sub-workflow-uri (agentul apelează alte workflow-uri prin call_sub_workflow), competențe (conținut de instrucțiuni și instrumente Python din .zip sau .md) și conexiuni client [MCP](../tabs/mcp-tab.md). Executorul de instrumente al orchestratorului direcționează apelurile către sub-agenți și sub-workflow-uri; celelalte instrumente merg către executorii Python, MCP sau de competențe. Adâncimea maximă de imbricare pentru sub-agenți și sub-workflow-uri este 5. Bucla de apelare a instrumentelor include compresie automată a contextului: înainte de fiecare iterație, utilizarea token-urilor este estimată, iar dacă depășește 80% din fereastra de context a modelului, mesajele din mijloc sunt rezumate folosind același model, păstrând intacte prompt-ul de sistem, primul mesaj al utilizatorului și ultimul mesaj al utilizatorului.

Consultați și [Nodul Agent](../nodes/agent-node.md), [Memoria Persistentă a Agentului](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) și [MCP](../tabs/mcp-tab.md).

### [Memoria Persistentă a Agentului](./agent-persistent-memory.md)

Graf de cunoștințe opțional per [Nod Agent](../nodes/agent-node.md), stocat în Postgres: entități, tipuri, proprietăți și relații direcționate. Când `persistentMemoryEnabled` este true, graful este rezumat în prompt-ul de sistem la fiecare rulare; după finalizări reușite, un [LLM](../nodes/llm-node.md) extrage actualizări structurate în fundal. Operațiunile REST CRUD se află sub `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Editorul se deschide din controlul roz cu formă de creier de pe nod.

Consultați și [Nodul Agent](../nodes/agent-node.md), [Arhitectura Agentului](./agent-architecture.md) și [Execuții](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-loop permite unui [Nod Agent](../nodes/agent-node.md) să solicite aprobare la puncte de verificare specifice, să creeze o pagină publică `/review/{token}` și să aștepte ca un recenzent neautentificat să accepte, să editeze sau să refuze textul de recenzie în format Markdown. Agenții cu HITL activat expun și o ieșire `review`, astfel încât să puteți notifica [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) sau alte canale în timp ce rularea este în așteptare. Textul HITL la nivel de nod este folosit ca ghid pentru aprobare, în timp ce rezumatul paginii publice este generat din cererea de recenzie în sine. Rulările în așteptare apar imediat în [Istoricul Execuțiilor](./execution-history.md), pot avea loc de mai multe ori în aceeași rulare și se reiau din instantaneul exact stocat al workflow-ului odată ce fiecare decizie este trimisă.

Consultați și [Nodul Agent](../nodes/agent-node.md), [Portal](./portal.md), [Istoricul Execuțiilor](./execution-history.md) și [Send Email](../nodes/send-email-node.md).

### [Webhook-uri](./webhooks.md)

Workflow-urile pot fi declanșate prin [HTTP](../nodes/http-node.md) la `POST /api/workflows/{workflow_id}/execute` sau transmise incremental prin streaming de la `POST /api/workflows/{workflow_id}/execute/stream`. Corpul cererii este transmis ca body către nodurile [Input](../nodes/input-node.md); anteturile și parametrii de interogare sunt disponibili în expresiile [Expression DSL](./expression-dsl.md). Configurați autentificarea per workflow: anonimă, JWT sau antet personalizat. Memorarea opțională în cache a răspunsurilor, limitarea ratei și dialogul Run with cURL al editorului se află toate la nivelul workflow-ului și se aplică ambelor moduri.

Consultați și [Input](../nodes/input-node.md), [Token-uri de Execuție](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) și [Structura Workflow-ului](./workflow-structure.md).

### [Token-uri de Execuție](./execution-tokens.md)

Token-urile de execuție sunt JWT-uri cu domeniu de aplicare care acordă acces la endpoint-urile de execuție și streaming ale unui singur workflow. Când un workflow utilizează autentificare JWT, token-urile permit scripturilor externe, pipeline-urilor CI și integrărilor să apeleze workflow-ul fără a partaja o sesiune de utilizator. Fiecare token conține o declarație `wid` care îl fixează la un singur workflow, un `jti` folosit pentru revocare instantanee și un TTL configurabil (de la 60 de secunde la 10 ani). Creați, selectați și revocați token-uri direct din dialogul **Run with cURL** — token-ul selectat este încorporat automat în comanda generată.

Consultați și [Webhook-uri](./webhooks.md), [Securitate](./security.md) și [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

Dialogul cURL poate comuta execuția [webhook](./webhooks.md) în modul Server-Sent Events. Acest lucru produce evenimente `execution_started`, `node_start`, `node_complete` și `execution_complete` în timp real, adaugă `--no-buffer` la comanda cURL generată și vă permite să configurați mesaje de început per nod, precum `[START] LLM` sau text personalizat pentru consumatorii de terminal externi.

Consultați și [Webhook-uri](./webhooks.md), [Istoricul Execuțiilor](./execution-history.md) și [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Workflow-urile sunt pornite de noduri de tip trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), recepția [RabbitMQ](../nodes/rabbitmq-node.md)) sau de puncte de intrare: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), planificatorul Cron, webhook-ul Telegram, webhook-ul de interacțiune Discord, managerul de trigger IMAP, consumatorul RabbitMQ sau rularea din Editor. Fiecare trigger are propriul endpoint sau proces în fundal; [Cron](../nodes/cron-node.md) rulează la fiecare 60 de secunde, nodurile [Telegram Trigger](../nodes/telegram-trigger-node.md) primesc webhook-uri de bot, nodurile [Discord Trigger](../nodes/discord-trigger-node.md) primesc webhook-uri de interacțiune semnate, iar nodurile [IMAP Trigger](../nodes/imap-trigger-node.md) rulează la intervalul de polling configurat. Nodurile [Input](../nodes/input-node.md) primesc body, headers și query din cererile webhook.

Consultați și [Node Types](./node-types.md), [Webhooks](./webhooks.md) și [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

Istoricul execuțiilor înregistrează rulările workflow-urilor: intrări, ieșiri, rezultatele nodurilor, starea și sursa trigger-ului. Accesați-l din bara de instrumente a Editorului, vizualizarea Docs, antetul Dashboard-ului sau vizualizarea [Evals](../tabs/evals-tab.md). Istoricul per workflow afișează rulările pentru workflow-ul deschis; vizualizarea întregului istoric afișează rulările din toate workflow-urile și din chat. Execuțiile care rulează în prezent apar în partea de sus a ambelor dialoguri, cu acțiunile **Open live** și **Cancel**. Open live atașează editorul la execuția existentă prin [SSE](./sse-streaming.md), restaurează nodurile finalizate, pulsează nodurile curente și în așteptare și adaugă jurnalele Debug fără a porni o altă rulare. Bring to Canvas încarcă intrările și ieșirile nodurilor unei rulări finalizate pentru re-rulare sau depanare; linkul direct `/workflows/{workflowId}/{executionId}` acceptă atât execuții live, cât și finalizate. Rulările întrerupte de [Human-in-the-Loop](./human-in-the-loop.md) sunt stocate imediat ca `pending`, inclusiv URL-ul public de revizuire și orice noduri de notificare executate din ramura `review` a agentului. Dacă serverul repornește în timpul rulării, rulările întrerupte sunt recuperate automat: sunt re-rulate de la zero cu aceleași intrări și afișate ca finalizate (marcate **Recovered**), controlate de un comutator per workflow **Auto-recover runs** care, în schimb, le poate înregistra ca `skipped`.

Consultați și [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) și [Traces](../tabs/traces-tab.md).

### Execution Highlights

După o rulare live — sau după **Bring to Canvas** — apare un popup **Execution Highlights** care poate fi închis, în colțul din dreapta sus al Canvas-ului, listând ce a produs fiecare nod în ordinea execuției. Este o modalitate rapidă de a inspecta ieșirea fiecărui nod fără a deschide fiecare nod; închideți-l cu **✕**, iar acesta se redeschide la următoarea rulare. Highlights sunt afișate și pentru rulările din dashboard. Consultați [Execution History](./execution-history.md) pentru detalii.

### [Edit History](./edit-history.md)

Edit History urmărește versiunile salvate ale unui workflow (fiecare Salvare creează o versiune). Vizualizați lista, deschideți o versiune pentru a vedea un diff față de workflow-ul curent ([noduri](./workflow-structure.md), muchii, configurație) și folosiți Revert pentru a restaura o versiune anterioară. Spre deosebire de [Execution History](./execution-history.md), Edit History urmărește modificările de structură, nu rulările.

Consultați și [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) și [Canvas Features](./canvas-features.md).

### Error Workflow

Un workflow poate desemna un alt workflow care să ruleze atunci când acesta eșuează. Configurați-l în panoul **Properties** la nivel de workflow (afișat când nu este selectat niciun nod), la secțiunea **On error, run workflow**. Doar proprietarul workflow-ului poate seta, modifica sau șterge această opțiune; consultați [Owner-only settings](./workflow-organization.md#owner-only-settings). Când o rulare de nivel superior se încheie cu o eroare netratată, workflow-ul de eroare selectat rulează și primește contextul erorii (id-ul și numele workflow-ului eșuat, id-ul rulării, mesajul de eroare, eticheta și tipul nodului eșuat și un timestamp). Dacă pe canvas există deja un nod [Error Handler](../nodes/error-handler-node.md), handler-ul local are prioritate și workflow-ul de eroare **nu** este apelat. Workflow-ul de eroare rulează el însuși direct, astfel încât nu își declanșează niciodată propriul workflow de eroare.

Acesta acoperă fiecare rulare de nivel superior care nu este test: ambele endpoint-uri de execuție, [Portal](./portal.md) și fiecare trigger, inclusiv [cron](../nodes/cron-node.md), trigger-ele platformelor de chat, email, cozi, [MCP](../tabs/mcp-tab.md) și widget-urile din dashboard. Cu [Load Distribution](./cluster.md) activat, acest lucru rămâne neschimbat, inclusiv pentru rulările executate de un worker: nodul care eșuează se întoarce împreună cu rezultatul, iar workflow-ul de eroare este apoi distribuit ca orice altă rulare, astfel încât un nod din interiorul său care trebuie să ruleze pe instanța principală o face în continuare. Două cazuri sunt omise în mod deliberat, deoarece rezultatul workflow-ului însuși nu este încă cunoscut: o rulare pe care nicio instanță nu a executat-o vreodată și o așteptare care a expirat în timp ce rularea ar putea fi încă în curs. De asemenea, **nu** este declanșat de rulările de test manuale din canvas.
### Timeout pentru Workflow

Fiecare workflow poate seta un **timeout pentru workflow** în secunde, în panoul **Properties** la nivel de workflow. Valoarea `0` (implicită) îl dezactivează. Când este setat, o execuție care depășește limita este oprită la următoarea limită de nod și înregistrată ca execuție eșuată cu eroarea „timed out". Timeout-ul se aplică execuțiilor manuale, prin API și celor declanșate de trigger. Nodurile [Wait](../nodes/wait-node.md) de durată lungă sunt întrerupte prompt, în loc să blocheze pe toată durata lor.

### Timp economisit

Fiecare workflow poate înregistra un **timp estimat economisit per execuție** (în minute), setat în panoul **Properties** la nivel de workflow. Filiala [Analytics](../tabs/analytics-tab.md) agregă această valoare pe intervalul selectat ca statistică totală **Time Saved** (suma dintre estimarea fiecărui workflow × execuțiile sale reușite). Most Used listează de asemenea această sumă per workflow; **Not Set** deschide câmpul de estimare atunci când acesta nu este setat. Raportul [Workflow Analysis](./workflow-analysis.md) recomandă setarea unei estimări atunci când niciuna nu este configurată.

### [Settings](./user-settings.md)

Dialogul Settings (deschis din avatarul dvs. din antet) are patru file: Profile (imagine Gravatar, nume afișat, User Rules), [Security](./security.md) (schimbare parolă), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) și Observability (stare [OpenTelemetry](./opentelemetry.md) doar pentru citire). User Rules sunt instrucțiuni personalizate injectate în fiecare cerere AI, inclusiv în constructorul de workflow-uri și în [Chat](../tabs/chat-tab.md), astfel încât puteți seta o singură dată limba, tonul, stilul de cod sau convențiile de workflow. Politica de parole și gestionarea cheilor API [MCP](../tabs/mcp-tab.md) sunt de asemenea disponibile.

Consultați și [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) și [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym poate emite urme OpenTelemetry pentru fiecare execuție de workflow și execuție de nod: un span rădăcină `heym.workflow.execute` per execuție și un span copil `heym.node.execute` per nod, cu utilizarea modelului și a token-urilor atașată nodurilor LLM și agent. Span-urile sunt exportate prin OTLP/HTTP către orice backend compatibil (Jaeger, Grafana Tempo, Honeycomb, Datadog), iar contextul de urmărire W3C se propagă prin webhook-uri de intrare, HTTP de ieșire și sub-workflow-uri. Urmărirea este dezactivată implicit și se configurează prin [variabile de mediu](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*`; starea activă este afișată în filiala Observability din [Settings](./user-settings.md).

Consultați și [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) și [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Exportați workflow-ul curent ca JSON din bara de instrumente a Editorului (butonul Download); fișierul include noduri și muchii. Importați trăgând un fișier JSON pe filiala [Workflows](../tabs/workflows-tab.md) (creează un workflow nou) sau pe canvas (înlocuiește sau fuzionează). JSON-ul trebuie să includă un array de noduri; numele și muchiile sunt opționale. Utilizați-l pentru backup, partajare sau migrare între instanțe.

Consultați și [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) și [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portalul expune workflow-urile ca interfețe publice de chat la `/chat/{slug}`. Configurați portal_enabled, slug, autentificare opțională (utilizatori portal), streaming și încărcare de fișiere per workflow. Utilizatorii finali interacționează printr-o interfață de chat fără a se autentifica în Heym; rezultatele de tip imagine pot fi afișate în chat. Workflow-urile din Portal pot de asemenea să transfere către paginile de revizuire [Human-in-the-Loop](./human-in-the-loop.md) atunci când un [Agent Node](../nodes/agent-node.md) necesită aprobare, în timp ce ramura `review` a agentului trimite notificări către alte canale. Utilizați-l pentru instrumente interne, chatbot-uri pentru clienți și formulare bazate pe AI.

Consultați și [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) și [Drive](./drive.md).

### [File Generation](./file-generation.md)

Skills pot genera fișiere precum PDF, DOCX, CSV, JSON și imagini în timpul execuției, scriind în spațiul de lucru `_OUTPUT_DIR`. Heym captează automat acele fișiere, le stochează și expune metadatele de descărcare sub `_generated_files`, care pot fi apoi gestionate cu [Drive node](../nodes/drive-node.md) sau revizuite în filiala [Drive](../tabs/drive-tab.md).

Consultați și [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) și [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive este stratul partajat de stocare și partajare pentru fișierele generate de skills. Vă permite să răsfoiți fișiere, să creați linkuri publice sau protejate cu parolă, să aplicați expirare și limite de descărcare, să partajați fișiere doar pentru citire cu echipele dvs. și să gestionați acele fișiere programatic cu [Drive node](../nodes/drive-node.md) sau manual din filiala [Drive](../tabs/drive-tab.md).

Consultați și [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md) și [Portal](./portal.md).
### [Securitate](./security.md)

Heym aplică o politică de parole (lungime, majuscule, minuscule, cifre), stochează token-urile de acces în cookie-uri HttpOnly și rotește token-urile de refresh la utilizare. Limitarea ratei se aplică pentru autentificare, înregistrare și autentificarea în [Portal](./portal.md). [Acreditările](./credentials.md) sunt criptate în repaus cu AES-256 (Fernet). Cheia API [MCP](../tabs/mcp-tab.md) este utilizată pentru autentificarea clienților; siguranța conținutului este disponibilă prin [Guardrails](./guardrails.md) pe nodurile [LLM](../nodes/llm-node.md) și [Agent Node](../nodes/agent-node.md). [Execution Tokens](./execution-tokens.md) oferă JWT-uri cu domeniu de aplicare per workflow pentru apelanți externi.

Consultați și [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) și [Acreditări](./credentials.md).

### [Single Sign-On](./sso.md)

Heym autentifică utilizatorii față de orice furnizor extern OpenID Connect - Keycloak, Okta, Entra ID, Auth0, Google - configurat la runtime din **Settings → SSO** de către un administrator de instanță listat în `HEYM_ADMIN_EMAILS`. Se introduc doar un URL de issuer și acreditările de client; fiecare endpoint provine din documentul de discovery al furnizorului, astfel încât niciun furnizor nu este hardcodat. Autentificarea utilizează Authorization Code cu PKCE, iar token-ul ID este verificat față de cheile publicate ale furnizorului. Conturile se mapează mai întâi după `(issuer, subject)` și apoi după emailul verificat, cu auto-provisionare opțională limitată la o listă de domenii de email permise. Autentificarea prin parolă rămâne disponibilă alături de SSO și poate fi dezactivată odată ce un test de conexiune trece, cu conturile din `HEYM_ADMIN_EMAILS` exceptate, astfel încât un furnizor configurat greșit să nu poată bloca instanța.

Consultați și [Settings](./user-settings.md), [Securitate](./security.md) și [Audit Logging](./audit.md).

### [Distribuirea încărcării](./cluster.md)

Îndreptați o a doua instanță Heym către aceeași bază de date și aceasta se alătură ca worker. Execuțiile din fundal - cron, webhook-uri, apeluri de unelte MCP, trigger-e de chat - sunt distribuite între instanțe după un procentaj setat de un administrator de instanță în **Settings → Instances**, cu statusul, latența bazei de date și versiunea fiecărei instanțe într-un singur tabel. Instanțele nu comunică niciodată între ele: Postgres transportă lucrul, astfel încât un worker nu are nevoie de niciun port deschis și de nicio rută înapoi către instanța principală. Lucrul care implică fișiere locale, un spațiu de lucru pentru agent de cod sau un plugin instalat rulează întotdeauna pe instanța principală, iar panoul raportează cât din ultimele 24 de ore a reprezentat acesta, astfel încât un operator să poată vedea când procentajele nu pot ajuta. Fiecare execuție din istoric indică instanța care a executat-o, iar ambele dialoguri de istoric pot filtra după aceasta.

Consultați și [Settings](./user-settings.md), [Execuții](../tabs/traces-tab.md) și [Analytics](../tabs/analytics-tab.md).

### [Integrări terțe](./integrations.md)

Heym se conectează la servicii externe prin acreditări stocate în fila [Acreditări](../tabs/credentials-tab.md) (criptate în repaus). Tipurile acceptate includ OpenAI, Google, Decision Model pentru [Nodul Decision](../nodes/decision-node.md), Model Router pentru selectarea automată a modelului (a se vedea mai jos), GitHub pentru [Nodul GitHub](../nodes/github-node.md) și integrări MCP, Jira pentru [Nodul Jira](../nodes/jira-node.md), Notion pentru [Nodul Notion](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP pentru [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header și FlareSolverr pentru [Crawler](../nodes/crawler-node.md). Fiecare tip documentează câmpurile obligatorii; acreditările pot fi partajate cu utilizatori sau [echipe](./teams.md) și pot fi referite prin nume în noduri sau ca `$credentials.Name` în expresii.

### Model Router (Auto Model)

O acreditare **Model Router** alege modelul per cerere în loc să dețină o cheie. Aceasta
stochează o acreditare de model de decizie plus o listă de acreditări OpenAI/Google/Custom
existente, fiecare cu criterii care spun când ar trebui utilizată, și apare în fiecare
selector de model cu un singur model numit **Auto**.

Execuțiile, Execution Log-ul din canvas și Span View afișează ambele jumătăți ale
alegerii, de exemplu `Auto Model / GPT-5`, în timp ce costul rămâne atribuit modelului care
a rulat. Auto Model nu poate fi combinat cu Responses API, modul Batch sau ieșirea de
imagini. Consultați [Acreditări](./credentials.md) pentru comportamentul complet.

Consultați și [Acreditări](./credentials.md), [Partajarea acreditărilor](./credentials-sharing.md) și [Echipe](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blochează mesajele utilizatorilor nesigure sau nedorite înainte de a ajunge la un [LLM](../nodes/llm-node.md) sau [Agent Node](../nodes/agent-node.md). Activați-le per nod și selectați categoriile de blocat (de ex. violență, discurs de ură, conținut sexual, auto-vătămare, hărțuire, activitate ilegală). Setați sensibilitatea (scăzută, medie, ridicată). Când este declanșat, nodul aruncă o eroare pe care o puteți prinde cu un [Error Handler](../nodes/error-handler-node.md). Detectarea utilizează API-ul de moderare al furnizorului sau clasificarea LLM în funcție de tipul acreditării.

Consultați și [Securitate](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) și [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise acoperă licențierea comercială, suportul profesional și serviciile de implementare pentru echipele care rulează Heym în producție. Include asistență pentru arhitectura workflow-urilor, onboarding, îndrumare pentru Kubernetes și scalare, suport prioritar și dezvoltare personalizată pentru funcționalități avansate precum [Nodul Agent](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Execuție paralelă](./parallel-execution.md) și [Portal](./portal.md).

Consultați și [Rulare și implementare](../getting-started/running-and-deployment.md), [Securitate](./security.md) și [Echipe](./teams.md).

---

## Filele panoului de control

### [Workflow-uri](../tabs/workflows-tab.md)

Fila Workflow-uri este vizualizarea implicită a panoului de control. Afișează o listă cu două panouri: workflow-uri și foldere ca rânduri dense în stânga, și o previzualizare a workflow-ului selectat în dreapta, cu trigger-ul, ultima rulare și pașii săi, plus Open Workflow și Run Now. Fiecare rând are un chip de stare (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled) după care se poate filtra din meniul derulant Status. Un workflow fără nod de trigger este etichetat în funcție de modul în care a început cea mai recentă rulare - API pentru un apel HTTP, SubWorker pentru un workflow părinte, Portal pentru chat-ul său public - și rămâne Manual până când a rulat. Folderele și sub-folderele gestionează [organizarea](./workflow-organization.md). Creați workflow-uri cu New Workflow, trageți și plasați JSON pentru a [importa](./download-import.md) și editați sau ștergeți din acțiunile rândului. Workflow-urile pot fi mutate între foldere; ștergerea este programată (coș de gunoi) înainte de eliminarea permanentă.

Consultați și [Organizarea workflow-urilor](./workflow-organization.md), [Descărcare și import](./download-import.md) și [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Un board kanban agentic în care cardurile sunt sarcini persistente. Configurați fiecare coloană cu un lanț ordonat de workflow-uri; mutarea unui card în coloană rulează lanțul cu contextul complet al cardului (conținut, comentarii, istoric, rezultate anterioare). Rezultatele sunt scrise înapoi pe card — verde la succes, roșu la eșec, chihlimbar în timpul rulării. Rundele ulterioare re-rulează lanțul coloanei curente cu tot ce s-a acumulat până acum, ceea ce alimentează planificarea iterativă. Rulările sunt înregistrate în [Istoricul execuțiilor](./execution-history.md) cu sursa de trigger `board`. În timp ce o rulare de card este activă, **Open live** deschide exact acea rulare pe canvas-ul animat cu jurnale Debug incrementale.

Consultați și [Workflow-uri](../tabs/workflows-tab.md), [Istoricul execuțiilor](./execution-history.md) și [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Șabloane](../tabs/templates-tab.md)

Fila Șabloane vă permite să salvați și să reutilizați șabloane de workflow (workflow-uri complete) și șabloane de nod (noduri individuale configurate). Creați șabloane de workflow din editor (Share as Template) și șabloane de nod făcând clic dreapta pe un nod. Răsfoiți după vizibilitate (Everyone sau Specific users/[teams](./teams.md)), aplicați un șablon pentru a crea un workflow nou sau pentru a adăuga un nod pe canvas și gestionați șabloanele partajate.

Consultați și [Workflow-uri](../tabs/workflows-tab.md), [Echipe](./teams.md) și [Funcționalități canvas](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variabile](../tabs/global-variables-tab.md)

Fila Variabile gestionează [Depozitul global de variabile](./global-variables.md). Creați, editați și ștergeți variabile globale; setați numele, valoarea și tipul valorii (Auto, String, Number, Boolean, Array, Object). Variabilele sunt la nivel de utilizator și persistă între execuții. Faceți referire la ele în orice [expresie](./expression-dsl.md) de workflow ca `$global.variableName`. Variabilele pot fi partajate cu alți utilizatori sau [echipe](./teams.md).

Consultați și [Variabile globale](./global-variables.md), [Variable](../nodes/variable-node.md) și [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Fila Chat este suprafața de agent de lungă durată a Heym pentru operarea spațiului de lucru prin conversație. Selectați o [acreditare](./credentials.md) și un model, apoi solicitați Chat-ului să răspundă la întrebări, să inspecteze definițiile workflow-urilor, să ruleze workflow-uri existente, să rezume execuții și programări, să raporteze istoricul de rulare al unui singur workflow (număr de rulări, defalcare pe stări, ultima rulare și detaliile unei rulări la cerere), să raporteze ce execuții rulează chiar acum (cu timpul scurs, nodul curent și un link către fiecare rulare activă), să rezolve recenziile umane în așteptare, să creeze și să revizuiască workflow-uri cu același motor AI Builder folosit în editor sau să adauge carduri pe panourile kanban cu limbaj natural. Cardurile noi încep întotdeauna în prima coloană a panoului selectat; când sunt disponibile mai multe panouri și niciunul nu a fost numit, Chat prezintă o selecție de panouri înainte de a crea cardul.

Chat continuă să ruleze pe backend după închiderea browserului. În timp ce un răspuns este transmis în flux, puteți trimite mai multe mesaje; Heym le stochează într-o coadă susținută de o bază de date, vă permite să editați sau să ștergeți mesajele din coadă înainte de a începe și le rulează în ordine când răspunsul curent se termină. Dacă asistentul are nevoie de detalii de planificare și returnează întrebări de clarificare, coada se pauzează până când răspundeți la acele întrebări, apoi se reia după răspunsul de planificare.

Răspunsurile sunt transmise în flux cu markdown, imagini inline, carduri de previzualizare a workflow-urilor, carduri pliabile pentru apelurile de unelte, utilizarea contextului și compresia automată a contextului. Chat acceptă atașamente, introducere vocală, redare cu voce tare, acțiuni de copiere, prompt-uri rapide, User Rules din [Settings](./user-settings.md) și [variabile globale](./global-variables.md) ca context.

Consultați și [AI Assistant](./ai-assistant.md), [Credentials](./credentials.md) și [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

### [Credentials](../tabs/credentials-tab.md)

Fila Credentials gestionează cheile API și secretele folosite de noduri. Adăugați acreditări după tip (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere etc.), denumiți-le și faceți referire la ele în nodurile workflow-urilor. Editați sau ștergeți din card; partajați cu utilizatori prin email sau cu [echipe](./teams.md). Toate valorile sunt criptate în repaus și mascate în interfața utilizator.

Consultați și [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) și [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Fila Vectorstores gestionează depozitele vectoriale folosite de nodurile [RAG](../nodes/rag-node.md). Creați un depozit cu un nume și o [acreditare](./credentials.md) de depozit vectorial — *RAG: Qdrant + OpenAI* (Qdrant extern) sau *RAG: Psql + OpenAI* (Postgres propriu al Heym prin pgvector), care fixează backend-ul depozitului — opțional setați un nume de colecție, apoi încărcați documente (PDF, TXT etc.). Gestionați conținutul (vizualizați, ștergeți surse), editați detaliile depozitului și partajați depozitele cu utilizatori. Într-un nod [RAG](../nodes/rag-node.md), alegeți Database, selectați depozitul vectorial și rulați operațiuni de inserare, upsert, ștergere sau căutare.

Consultați și [Qdrant RAG](../nodes/rag-node.md), [Credentials](./credentials.md) și [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>
### [MCP](../tabs/mcp-tab.md)

Fila MCP configurează integrarea Model Context Protocol. Heym acceptă două moduri:

**Server implicit** – Un singur endpoint la `/api/mcp/sse` expune toate workflow-urile cu MCP activat. Vizualizați și regenerați cheia API, copiați JSON-ul de client gata de utilizare, conectați Cursor dintr-un singur clic sau urmați fluxul de configurare Claude cu înregistrare OAuth automată.

**Servere denumite** – Creați mai multe endpoint-uri MCP izolate, fiecare cu propriul URL bazat pe UUID (`/api/mcp/servers/{uuid}/sse`) și cheie API independentă. Atribuiți workflow-uri specifice fiecărui server, astfel încât diferiți clienți AI sau echipe să vadă doar instrumentele de care au nevoie. Fiecare server denumit acceptă aceleași metode de autentificare (cheie API, Claude OAuth) și are propriile scurtături Copy JSON și Add to Cursor. Ambele endpoint-uri acceptă transport SSE (GET) și transport Streamable HTTP (POST). Comutarea unui workflow în interiorul unui server denumit îl mută în partea de sus a listei atribuite, astfel încât rândul modificat rămâne vizibil.

**Instrumentul Chat Heym** – Oricare mod poate expune, de asemenea, motorul [Chat](../tabs/chat-tab.md) ca un singur instrument `heym_chat`, comutat per suprafață cu propriile acreditări LLM și model (precompletate din modelul preferat în [Settings](./user-settings.md)). Un client MCP trimite un singur `message` în limbaj natural, iar motorul face restul: construiește, editează și rulează workflow-uri, analize, execuții, stare de rulare în timp real, programări, panouri și carduri, echipe, variabile globale, căutare în documentație și decizii cu implicare umană. Capacitățile adăugate ulterior în Chat sunt accesibile prin același instrument fără înregistrare suplimentară. Fiecare apel este stocat în istoricul filei Chat ca o conversație marcată cu un plug și returnează un `conversation_id` pe care clientul îl poate transmite înapoi pentru a continua firul.

Consultați și [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) și [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

Fila Traces afișează urmele de execuție [LLM](../nodes/llm-node.md). Un antet de statistici deasupra listei rezumă intervalul de timp selectat cu carduri KPI (Calls, Tokens, Cost, Avg Latency, Error %) și trei grafice — Tokens by Model, Cost by Model și Calls Over Time (succes vs eroare suprapuse). Un singur selector **Time range** (1h / 24h / 7d / 30d / All; implicit 7 zile) filtrează atât graficele, cât și lista împreună. Costul este calculat din [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) per utilizator; modelele fără preț apar ca un avertisment inline care face legătura către acesta. Deschideți orice urmă pentru a vedea payload-urile de cerere și răspuns, defalcarea temporală (llm_ms, tools_ms, mcp_list_ms), apelurile de instrumente (nume, argumente, rezultat) și abilitățile incluse. Evenimentele extinse afișează JSON—inclusiv payload-uri MCP și JSON-RPC—ca un arbore pliabil cu primul nivel deschis implicit; **Tree / Raw** comută înapoi la textul original, iar JSON-ul malformat rămâne lizibil. Utilizați urmele pentru a depana comportamentul [Agent Node](../nodes/agent-node.md) și [LLM](../nodes/llm-node.md) și pentru a copia sau exporta payload-uri.

Consultați și [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) și [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Alerte](../tabs/alerts-tab.md)

Fila Alerte definește condiții de prag pe o fereastră de timp și vă anunță când acestea sunt depășite. Patru tipuri de alerte acoperă întrebările pe care și le pun în mod real operatorii: **prag de eroare** (a eșuat de mai mult de N ori în fereastră), **durată workflow** (execuțiile au devenit mai lente, măsurat ca maxim, medie sau p95), **cost token / USD** (cheltuiala a depășit un buget, rezolvat prin același tabel de tarifare ca la [Execuții](../tabs/traces-tab.md)) și **număr de execuții** (a rulat mult mai des decât ar fi trebuit). Fiecare tip este evaluat pe o fereastră pe care o alegeți, niciodată pe un singur eveniment, deoarece o singură execuție eșuată este zgomot, iar o serie de eșecuri este un incident. Alertele monitorizează un singur workflow sau toate workflow-urile la care aveți acces.

Un wizard în cinci pași parcurge tipul, domeniul de aplicare, condiția, răspunsul și verificarea. Pasul de verificare **testează retrospectiv** condiția mai întâi, raportând cât de des s-ar fi declanșat în ultimele 24 de ore până la 7 zile, astfel încât un prag mult prea scăzut este prins înainte de a fi salvat, nu după ce declanșează o alertă cuiva. Descrieți ce doriți în limbaj natural, iar AI completează fiecare pas pe care îl poate, marcându-și presupunerile; o cerere parțială tot face wizard-ul să avanseze, deschizându-se la primul pas care încă necesită o decizie, în loc să vă oblige să o luați de la capăt. În mod implicit, o alertă se declanșează o dată și rămâne silențioasă până când metrica își revine; în schimb, o puteți face să se repete la un interval.

La pasul de răspuns, o alertă poate crea și atribui un workflow nou care să ruleze când se declanșează, poate folosi unul pe care îl aveți deja sau nu face nimic. Payload-ul de declanșare transportă valoarea observată, pragul, fereastra și workflow-urile care au contribuit la valoare, ceea ce permite alertelor să ajungă în Slack, email sau Telegram folosind noduri pe care le aveți deja. Istoricul declanșărilor înregistrează ce era adevărat în momentul în care fiecare alertă s-a declanșat și este păstrat timp de 90 de zile; confirmarea unei declanșări schimbă insigna din Declanșată în Confirmată fără a pretinde că condiția s-a rezolvat. Fila [Chat](../tabs/chat-tab.md) poate răspunde la întrebarea ce alerte există și de ce sau când s-a declanșat una. Alertele pot fi partajate cu utilizatori și [echipe](../tabs/teams-tab.md).

Consultați și [Analitice](../tabs/analytics-tab.md), [Execuții](../tabs/traces-tab.md) și [Istoric execuții](./execution-history.md).

### [Analitice](../tabs/analytics-tab.md)

Fila Analitice afișează metrici și tendințe ale execuțiilor. Statisticile de sinteză includ totalul execuțiilor, rata de succes, rata de eroare, defalcări ale latenței și totalul **Timp economisit** (suma minutelor estimate economisite pe execuție pentru fiecare workflow × execuțiile sale reușite). Cele mai utilizate listează aceeași sumă per workflow. Selectați un interval de timp de bază (24h, 7z, 30z sau tot), filtrați opțional după workflow, apoi trageți pe orice grafic pentru a analiza în detaliu un interval de date selectat. Graficele și tabelele de workflow-uri se actualizează la selecție, iar reîmprospătarea automată menține metricile actualizate. Completează [Istoricul execuțiilor](./execution-history.md) și vizualizarea [Programări](../tabs/scheduled-tab.md) atunci când aveți nevoie atât de rezultatele trecute, cât și de execuțiile viitoare.

Consultați și [Istoric execuții](./execution-history.md), [Programări](../tabs/scheduled-tab.md) și [Evaluare](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Urmăriți demonstrația Analitice</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Fila Dashboard este un spațiu în stil Grafana în care construiți grile de widget-uri grafice, fiecare redat din propriul său workflow Heym ascuns. Păstrați câte dashboard-uri aveți nevoie și partajați fiecare cu utilizatori sau echipe, doar pentru citire sau editabil; widget-urile rulează întotdeauna cu acreditările proprietarului, astfel încât toată lumea vede aceleași date. Descrieți o metrică în limbaj natural și AI generează widget-ul, sau adăugați unul manual și alegeți un tip de grafic, previzualizat cu date de probă: bare, linie, arie, circular, tabel, numeric, indicator, dispersie, proporție, indicator cu bare, text sau HITL. HITL este un carusel al recenziilor umane în așteptare. Antetul afișează `1/n pending`. Numele workflow-ului deschide acea execuție pe canvas. **Aprobare**, **Solicitare modificări** și **Respingere** o rezolvă, iar pictograma de istoric de lângă titlul widget-ului deschide acea execuție în dialogul de istoric de pe aceeași pagină. Widget-urile își memorează în cache rezultatele, pot fi reglate fin cu AI (fiecare modificare este salvată în [Istoric editări](./edit-history.md)), clonate împreună cu workflow-ul lor complet, rearanjate cu Tidy up și trase sau redimensionate în modul de editare. Deoarece fiecare widget este un workflow, orice date pe care le puteți obține — un apel [HTTP](../nodes/http-node.md), o interogare [BigQuery](../nodes/bigquery-node.md), o căutare [RAG](../nodes/rag-node.md) sau ieșirea unui [LLM](../nodes/llm-node.md) — pot deveni un grafic.

Consultați și [Nodul Chart Output](../nodes/chart-output-node.md), [Analitice](../tabs/analytics-tab.md) și [Istoric execuții](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Urmăriți demonstrația Dashboard</a></p>
### [Evaluare](../tabs/evals-tab.md)

Fila Evaluare (la `/evals`) vă permite să creați suite de evaluare, să adăugați sau să generați cazuri de test, să optimizați promptul suitei și să rulați evaluări pe workflow-uri cu [Nod Agent](../nodes/agent-node.md). Selectați unul sau mai multe modele, alegeți o metodă de punctare (Exact Match, Contains sau LLM-as-Judge), opțional permiteți unui model separat sau unui [Model de decizie](../nodes/decision-node.md) să judece răspunsurile LLM-as-Judge, setați rulările per test (plus temperature și reasoning effort pentru Exact Match și Contains), apoi comparați rezultatele pass/fail și ieșirile per model. Consultați istoricul rulărilor pentru evaluările anterioare, inclusiv judge-ul folosit de fiecare rulare, re-rulați una cu același judge, exportați-o ca JSON și verificați comportamentul subiacent în [Execuții](../tabs/traces-tab.md).

Consultați și [Nod Agent](../nodes/agent-node.md), [Execuții](../tabs/traces-tab.md) și [Istoric execuții](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

### [Echipe](../tabs/teams-tab.md)

Fila Echipe vă permite să creați și să gestionați echipe. Creați o echipă, adăugați membri prin email și eliminați membri (creatorul nu poate fi eliminat). Partajați [workflow-uri](../tabs/workflows-tab.md), [șabloane](../tabs/templates-tab.md), [acreditări](../tabs/credentials-tab.md), [variabile](../tabs/global-variables-tab.md), [depozite vectoriale](../tabs/vectorstores-tab.md) și [fișiere Drive](../tabs/drive-tab.md) cu echipele din dialogurile lor respective de partajare; toți membrii echipei obțin acces. Editați numele și descrierea echipei sau ștergeți echipa (elimină toate partajările echipei).

Consultați și [Echipe](./teams.md), [Partajarea acreditărilor](./credentials-sharing.md) și [Organizarea workflow-urilor](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

### [Programări](../tabs/scheduled-tab.md)

Fila Programări afișează toate workflow-urile active [Cron](../nodes/cron-node.md) pe un calendar vizual. Comutați între vizualizările pe zi, săptămână și lună pentru a vedea când sunt programate să ruleze automatizările dvs., apoi reveniți la [workflow-ul](../tabs/workflows-tab.md) asociat atunci când trebuie să editați programarea.

Consultați și [Cron](../nodes/cron-node.md), [Analitice](../tabs/analytics-tab.md) și [Istoric execuții](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>

### [Loguri](../tabs/logs-tab.md)

Fila Loguri afișează logurile containerelor Docker pentru stiva Heym (backend, frontend, PostgreSQL). Selectați containerul (containerele), filtrați după nivelul de log (All, INFO, WARNING, ERROR, DEBUG) și căutați în cadrul logurilor. Utilizați-o pentru depanare și diagnosticare. Pentru logurile de execuție ale workflow-urilor (rezultatele nodurilor, ieșiri), utilizați în schimb [Istoric execuții](./execution-history.md), [Execuții](../tabs/traces-tab.md) sau panoul Debug din editor.

Consultați și [Istoric execuții](./execution-history.md), [Execuții](../tabs/traces-tab.md) și [Funcționalități Canvas](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

### [Tabele de date](../tabs/datatable-tab.md)

Fila Tabele de date vă permite să creați și să gestionați tabele de date structurate în Heym. Definiți coloane tipizate (string, number, boolean, date, JSON), gestionați rândurile cu editare inline prin dublu-clic, importați/exportați CSV și partajați tabelele cu utilizatori sau [echipe](./teams.md) cu permisiuni de citire/scriere. Utilizați [Nodul DataTable](../nodes/datatable-node.md) pentru a accesa tabelele programatic în workflow-uri. O secțiune fixată **Tabele de sistem** în partea de sus găzduiește **Tabelul de costuri LLM**: o vizualizare cu schemă fixă a prețurilor per model, populată de la Helicone în fundal (TTL de 24 de ore, Refresh manual), unde fiecare utilizator poate suprascrie prețuri sau adăuga rânduri personalizate pentru modelele pe care Helicone nu le listează. Aceste reguli de prețuri alimentează KPI-ul de cost și graficul de cost per model din fila [Execuții](../tabs/traces-tab.md).

Consultați și [Nodul DataTable](../nodes/datatable-node.md), [Execuții](../tabs/traces-tab.md), [Structura workflow-ului](./workflow-structure.md) și [Echipe](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>
### [Drive](../tabs/drive-tab.md)

Fila Drive afișează toate fișierele generate de skill-uri în cadrul workflow-urilor dvs. Aceasta listează fiecare fișier cu nume, tip, dimensiune, nod sursă, data creării și starea de partajare la nivel de echipă și oferă controale de căutare, descărcare autentificată, partajare, ștergere și paginare. Este companionul de dashboard pentru [File Generation](./file-generation.md), referința [Drive](./drive.md) și [nodul Drive](../nodes/drive-node.md).

Consultați și [Drive](./drive.md), [File Generation](./file-generation.md) și [nodul Drive](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Watch Drive demo</a></p>
