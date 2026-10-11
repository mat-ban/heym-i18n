# Per què Heym

Heym és infraestructura per executar i governar agents d'IA en producció. Un únic runtime autoallotjat cobreix totes les etapes del cicle de vida dels agents.

Un agent prototip necessita un model, un prompt i unes quantes eines. Un agent de producció també necessita Triggers i reintents, estat desat quan es posa en pausa per a una persona, un registre de cada crida a model i eina, un cost per a cada execució, proves abans que un canvi es desplegui i límits clars sobre què pot fer pel seu compte. Heym ho conté tot en un sol lloc, de manera que el sistema que dissenyeu al llenç és el sistema que s'executa. Construïu sistemes agèntics i executeu-los amb confiança.

## Un Runtime per al Cicle de Vida dels Agents

| Etapa | Què us ofereix Heym |
|---|---|
| **Construir** | Composeu agents i passos deterministes al llenç, genereu-los amb l'[Assistent d'IA](../reference/ai-assistant.md) o comenceu des de [Plantilles](../tabs/templates-tab.md) i skills portables. |
| **Orquestrar** | Coordeneu agents, [sub-agents](../reference/agent-architecture.md), agents de codificació, RAG, automatització de navegador i eines amb flux de dades explícit i [execució en paral·lel](../reference/parallel-execution.md). |
| **Executar** | Inicieu execucions des de [webhooks](../reference/webhooks.md), planificacions i [triggers](../reference/triggers.md) d'esdeveniments, amb reintents per Node, [gestió d'errors](../nodes/error-handler-node.md) i [distribució de càrrega](../reference/cluster.md) entre instàncies. |
| **Observar** | Inspeccioneu cada execució mitjançant l'[historial](../reference/execution-history.md), les [traces d'LLM](../tabs/traces-tab.md), el cost en USD per execució, les execucions en directe al llenç, l'[analítica](../tabs/analytics-tab.md), les [alertes](../tabs/alerts-tab.md) i l'exportació a [OpenTelemetry](../reference/opentelemetry.md). |
| **Avaluar** | Proveu prompts i models contra sortides esperades a les [Avaluacions](../tabs/evals-tab.md), amb puntuació LLM-as-Judge i comparació de models costat a costat. |
| **Controlar** | Manteniu les persones al comandament amb [punts de control de revisió](../reference/human-in-the-loop.md) i [guardrails](../reference/guardrails.md), i governeu l'accés amb [credencials](../reference/credentials.md) xifrades, [equips](../reference/teams.md), [inici de sessió únic](../reference/sso.md) i una [pista d'auditoria](../reference/audit.md). |
| **Exposar** | Serviu Workflows sobre REST i [SSE](../reference/sse-streaming.md), com a eines [MCP](../tabs/mcp-tab.md), com a interfícies de xat de [Portal](../reference/portal.md) i com a ginys de [dashboard](../tabs/dashboard-tab.md). |

## Construir

### Assistent d'IA: Construïu Workflows amb Llenguatge Natural

L'[Assistent d'IA](../reference/ai-assistant.md) és un panell de xat dins de l'editor de Workflows. Descriviu què voleu, per exemple "crea un workflow que prengui l'entrada de l'usuari, cerqui a la meva base de coneixement i respongui utilitzant GPT-4o", i l'assistent genera Nodes i arestes que s'apliquen instantàniament al llenç.

- Utilitza la vostra pròpia credencial d'LLM (qualsevol model compatible)
- Admet **entrada de veu** per dissenyar Workflows mans lliures
- Aplica automàticament el JSON de Workflow vàlid de la resposta de la IA al llenç
- Transmet les respostes en temps real

L'assistent funciona directament dins de l'editor i transmet Nodes al llenç en temps real, i tot el que genera es manté editable com els Nodes que hàgiu col·locat manualment.

### Sistema de Skills

Les skills són paquets de capacitats portables, un fitxer d'instruccions `SKILL.md` més scripts de Python opcionals, que es poden afegir a qualsevol Node Agent.

- Les instruccions de la skill s'anteposen al prompt de sistema de l'agent
- Els fitxers de Python de la skill es converteixen en eines invocables
- Les skills són reutilitzables entre Workflows i compartibles com a arxius `.zip`

Això és anàleg a donar al vostre agent una descripció del lloc de treball i una caixa d'eines en una sola operació.

### Analitzador de Workflows: Retroalimentació Conscient de l'Execució

El panell d'[Anàlisi de Workflows](../reference/workflow-analysis.md) és una eina de documentació i retroalimentació conscient de l'execució integrada a l'editor. Feu clic a **Analitza**, trieu una credencial d'LLM i un model, i Heym genera un informe Markdown editable per al Workflow actual.

A diferència d'una nota estàtica, l'analitzador primer executa el Workflow quan pot i inclou el resultat de l'execució al prompt. L'informe cobreix àrees de millora, el propòsit del Workflow i una explicació pas a pas del que fan els Nodes. Quan ja existeix un informe, **Reanalitza** transmet una previsualització separada perquè pugueu acceptar la nova versió o conservar el document compartit actual.

## Orquestrar
### Nodes LLM i Agent integrats

El [Node Agent](../nodes/agent-node.md) de Heym executa un bucle de crida d'eines estretament integrat amb eines Python en línia, connexions MCP i un sistema de skills portables, tot dissenyat per a agents de producció.

El [Node LLM](../nodes/llm-node.md) simple de Heym també va més enllà d'un únic pas de prompt-resposta. Per als endpoints compatibles amb OpenAI i OpenAI, pot canviar al **mode Batch API** de manera que un Node envia una matriu de prompts en una sol·licitud per lots nativa del proveïdor de cost inferior. El canvas aleshores exposa una branca dedicada `batchStatus` que s'activa a mesura que el lot passa per estats com `pending`, `processing` i `completed`.

Això significa que el Node LLM pot fer dues coses alhora:

- Executar la sol·licitud per lots principal i retornar les sortides finals per element a la branca normal
- Activar la lògica de notificació o registre a cada actualització d'estat del lot significativa sense convertir el flux en un bucle de sondeig personalitzat

L'execució per lots és una primitiva de Workflow LLM de primera classe, amb comprovacions de capacitat del proveïdor i del model a la interfície del Node.

El **Node Agent** és el nucli de l'orquestració d'agents a Heym:

- **Crida d'eines** – L'agent itera sobre les crides d'eines en un bucle fins que produeix una resposta final
- **Eines Python** – Definiu eines personalitzades en línia amb Python complet; l'agent les crida en temps d'execució
- **Connexions MCP** – Connecteu-vos a qualsevol servidor [Model Context Protocol](https://modelcontextprotocol.io/) (stdio o SSE) i l'agent obté totes les seves eines automàticament
- **Skills** – Deixeu anar un fitxer `.zip` o `.md` sobre un agent per ampliar el seu context de sistema i afegir eines Python
- **Crides a sub-workflows** – L'agent pot invocar altres Workflows de Heym com a eines, component comportaments complexos sense codi personalitzat

Consulteu [Node Agent](../nodes/agent-node.md) i [Arquitectura d'Agent](../reference/agent-architecture.md) per a la referència completa.

### Orquestració multi-agent

Heym admet un **patró orquestrador** amb primitives visuals de primera classe:

- Un agent actua com a **orquestrador** (`isOrchestrator: true`) i se li proporciona una eina `call_sub_agent`
- Delega tasques a **sub-agents** amb nom al mateix canvas
- Els sub-agents poden al seu torn cridar altres agents o sub-workflows (profunditat màxima: 5)
- **Execució paral·lela**: Quan l'orquestrador crida múltiples sub-agents en un torn, s'executen en paral·lel per obtenir resultats més ràpids

Això permet arquitectures com un agent de planificació que encamina la feina a un investigador, un programador i un resumidor, tot connectat visualment sense codi d'orquestració personalitzat.

Consulteu [Arquitectura d'Agent](../reference/agent-architecture.md) per als detalls d'execució.

### Agents de programació com a Nodes de Workflow

Heym inclou dos Nodes que executen un agent de programació real com a pas de Workflow, no una compleció de xat:

- **[Node Codex](../nodes/codex-node.md)** – Executa la CLI d'OpenAI Codex en un espai de treball Heym aïllat contra un repositori de GitHub. Admet **Inicia sessió amb ChatGPT** (PKCE OAuth a la vostra subscripció Plus/Pro, sense cost d'API per token) o un testimoni d'accés, clona el repositori, permet que Codex editi codi i retorna `summary`, `diff`, `changedFiles` i un esborrany de `pullRequestUrl`.
- **[Node OpenCode Go](../nodes/opencode-go-node.md)** – El mateix flux de repositori a través de la passarel·la OpenCode agnòstica del proveïdor (Kimi, DeepSeek, Qwen i més), executat en un **contenidor d'un sol ús endurit**: totes les capacitats eliminades, arrel de només lectura, límits de pid/memòria/CPU. El testimoni de GitHub es manté fora de la sandbox: Heym realitza cada operació de git i GitHub al costat de l'amfitrió, de manera que el codi generat no pot exfiltrar credencials de push.

Això significa que un Workflow pot triar un error des d'un Webhook, lliurar el repositori a un agent de programació, esperar l'esborrany de PR i publicar l'enllaç a Slack, totalment automatitzat, amb límits de recursos configurables per desplegament.

### Pipeline RAG integrat

Heym inclou un [Node RAG / Vector Store](../nodes/rag-node.md) i una pestanya gestionada de [Vectorstores](../tabs/vectorstores-tab.md). Podeu:

- Triar el vostre backend vectorial: **Qdrant** (servidor extern) o **Postgres (pgvector)**, que emmagatzema vectors a la base de dades pròpia de Heym sense cap servei addicional per executar
- Inserir documents en un vector store directament des d'un Node de Workflow
- Realitzar cerca semàntica i alimentar els resultats a un Node LLM o Agent
- Referenciar resultats amb expressions com `$ragNode.results.map("item.payload.content").join("\n\n")`

A Heym, RAG són dos Nodes amb control total sobre els embeddings i la recuperació.

### Automatització de navegador amb Playwright

El [Node Playwright](../nodes/playwright-node.md) és automatització de navegador pròpia al canvas.

- **Mode de passos** – Composeu accions de navegació, clic, escriptura, emplenament, captura de pantalla, extracció i desplaçament visualment
- **Passos d'IA amb auto-reparació** – Descriviu una acció en llenguatge natural i un LLM genera les accions de Playwright; els selectors fallits es poden reparar automàticament, i els passos generats es poden emmagatzemar a la memòria cau per ometre futures crides al LLM
- **Mode d'execució de codi** – Canvieu el Node a Playwright Python complet per a fluxos complexos (desactivat per defecte; s'executa a la sandbox endurida de Heym quan s'activa)
- **Sessions autenticades** – Restaureu cookies/`storageState` abans d'executar, verifiqueu l'inici de sessió amb una comprovació de selector i recurreu a passos d'inici de sessió programats
- **Captura de xarxa** – Recolliu opcionalment respostes JSON, capçaleres, cookies i emmagatzematge del navegador juntament amb els resultats

Heym tracta el navegador com un Node normal amb les mateixes expressions, credencials i gestió d'errors que tota la resta.
### Expression DSL

L'[Expression DSL](../reference/expression-dsl.md) de Heym ofereix una sintaxi neta i potent per referenciar dades de Nodes upstream:

- `$input.text` – Dades del Node d'entrada
- `$nodeName.field` – Camp de sortida de qualsevol Node upstream
- `$global.variableName` – Variables globals persistents
- Ajudants d'arrays: `.first()`, `.map("field")`, `.join("\n")`

Les expressions funcionen a tots els camps de cadena, incloent-hi prompts, capçaleres HTTP, condicions i valors assignats, de manera que les dades es mouen entre passos de forma explícita. El DSL equilibra potència i llegibilitat sense requerir coneixements complets de JavaScript.

## Run

### Triggers, reintents i camins d'error

Un Workflow pot iniciar-se des de molts llocs. Els Nodes d'[entrada](../nodes/input-node.md) reben [webhooks](../reference/webhooks.md) HTTP, el [Cron](../nodes/cron-node.md) s'executa segons una planificació, i els [triggers](../reference/triggers.md) d'esdeveniments inicien execucions des de Telegram, Discord, Slack, bústies IMAP, fluxos WebSocket, cues RabbitMQ, càrregues de fitxers i esdeveniments de la plataforma Heym.

Els errors es gestionen dins del graf. Qualsevol Node pot reintentar-se en cas d'error amb un nombre determinat d'intents i una espera entre ells; cada intent es registra a l'[historial d'execucions](../reference/execution-history.md), i un Node [Error Handler](../nodes/error-handler-node.md) s'executa automàticament quan un Node falla, de manera que la recuperació forma part del mateix Workflow.

### Execució DAG en paral·lel

L'executor de Workflows de Heym utilitza un planificador de graf acíclic dirigit (DAG). Els Nodes independents s'executen en paral·lel automàticament, sense necessitat de configuració.

- Els Nodes al mateix nivell de dependència es despatxen de manera concurrent a un pool de fils (`max_workers=8`)
- Tan bon punt un Node acaba, els seus Nodes downstream es planifiquen
- El [Merge Node](../nodes/merge-node.md) combina els resultats de branques paral·leles
- Múltiples execucions de Workflow s'executen de manera concurrent; cada execució és completament aïllada

El paral·lelisme és el comportament per defecte, determinat per l'estructura del graf.

Vegeu [Execució en paral·lel](../reference/parallel-execution.md).

### Escalat entre instàncies

Apunteu una segona instància de Heym a la mateixa base de dades PostgreSQL i s'uneix com a worker. Les execucions en segon pla es comparteixen entre instàncies segons els pesos que configureu, un líder elegit manté les planificacions, l'avaluació d'alertes i la recuperació de fallades en funcionament durant un failover, i cada execució registra la instància que l'ha executada. Vegeu [Distribució de càrrega](../reference/cluster.md).

### Tauler Kanban agentic

La [pestanya Board](../tabs/board-tab.md) és un tauler Kanban integrat on les mateixes columnes executen Workflows. Una targeta és una tasca agentic persistent que porta context, historial de conversa, estat d'execució, sortides i execucions de Workflow.

- **Cadenes de Workflow per columna** – Moure una targeta a una columna activa la cadena de Workflow d'aquella columna; un **Agentic Kanban Model** (la vostra credencial + model) mapeja el contingut de la targeta als inputs del Workflow i converteix les sortides de nou en text llegible
- **Adjunts de targeta** – Arrossegueu fitxers sobre una targeta; els documents s'extreuen a text i les imatges es passen a models amb capacitat de visió abans de cada execució
- **Canvas d'execució en directe** – Obriu l'execució activa dins d'una targeta i observeu com s'executa al canvas real del Workflow, Node a Node
- **Compartició amb equips** – Compartiu taulers amb usuaris o equips amb permisos de lectura/escriptura; les cadenes en taulers compartits s'executen amb les credencials del propietari, de manera que els col·laboradors no necessiten les seves pròpies
- **Visibilitat de fallades** – Les targetes fallides mostren un indicador d'historial d'errors, i les execucions de seguiment poden pausar-se per esperar comentaris

El tauler és una superfície nativa de la plataforma: targetes, Workflows, credencials i execucions en directe conviuen en un sol lloc.

### Heym Drive: emmagatzematge de fitxers integrat

La [pestanya Drive](../tabs/drive-tab.md) és un magatzem de fitxers integrat a la plataforma. Els fitxers generats per skills i Workflows (PDF, DOCX, CSV, imatges) hi arriben automàticament, i els adjunts de les targetes del tauler també s'hi emmagatzemen.

- **Enllaços per compartir** – Enllaços de descàrrega públics o protegits amb contrasenya (Basic Auth) amb caducitat opcional i límits màxims de descàrregues
- **Compartició amb equips** – Compartiu fitxers en mode només lectura amb els vostres equips, i elimineu totes les comparticions d'equip en una sola acció
- **Accions massives** – Selecció múltiple amb rangs mitjançant shift-clic, agrupeu seleccions en una única descàrrega ZIP, o apliqueu una configuració de compartició/contrasenya/eliminació a molts fitxers alhora
- **Accés d'agents** – Els skills poden optar per llegir fitxers del Drive, de manera que un agent pot treballar sobre documents que vosaltres o altres Workflows heu produït

Els artefactes generats obtenen una llar permanent i compartible dins de la plataforma.

## Observe

### Traces d'LLM

La [pestanya Traces](../tabs/traces-tab.md) proporciona observabilitat completa per a cada crida a l'LLM:

- Payloads de petició i resposta
- Temporització per crida: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Noms de crides d'eines, arguments i resultats
- Skills passats al model

El sistema de traces està dissenyat específicament per depurar el comportament agentic, amb payloads complets de petició i resposta i temporització per crida.
### Seguiment del cost de tokens d'LLM

Cada crida a un LLM a Heym es factura automàticament. La [Pestanya Traces](../tabs/traces-tab.md) mostra el recompte de tokens d'entrada i de sortida per traça, juntament amb un cost en USD en temps real derivat d'una taula de preus sincronitzada.

- **Cost per traça** – Tokens d'entrada, tokens de sortida i total en USD mostrats a cada fila de traça
- **Analítica de costos** – Targetes de KPI i un gràfic de cost per model que s'actualitzen amb el rang de temps seleccionat (1h / 24h / 7d / 30d / Tot)
- **Taula de costos d'LLM** – Una taula de sistema a la [Pestanya DataTable](../tabs/datatable-tab.md) s'omple des de Helicone cada 24 hores; podeu sobreescriure els preus o afegir files personalitzades per a models que encara no hi apareguin
- **Avís de preu absent** – Les traces de models sense entrada de preus mostren un avís en línia amb un enllaç directe a la taula de costos

Cada execució porta el seu propi cost en USD, desglossat per model.

### Obrir execucions de producció en un llenç en directe

Un workflow de producció roman inspeccionable després d'iniciar-se fora de l'editor. Obriu qualsevol entrada **En execució** des de qualsevol dels diàlegs d'Historial, o obriu l'execució activa dins d'una targeta d'Agentic Kanban, i Heym adjunta l'editor de workflows habitual a aquesta execució exacta.

- Els Nodes que ja han acabat apareixen amb els seus resultats immediatament
- El Node actual i els Nodes posteriors pendents continuen polsant a mesura que avança l'execució
- El panell de Debug rep els mateixos resultats incrementals de Nodes que una execució iniciada des del llenç
- La sortida final i els ressaltats d'execució arriben sense sondeig ni iniciar una execució duplicada
- Tancar l'editor només desconnecta l'observador; mai cancel·la el workflow de producció

L'observador utilitza SSE recolzat per una instantània d'execució entre workers, de manera que funciona per a Triggers de Webhook, planificació, xat, MCP, integració i Board fins i tot quan un altre worker de backend és propietari de l'execució.

### OpenTelemetry, analítica i alertes

Heym emet spans d'[OpenTelemetry](../reference/opentelemetry.md) per a cada execució de workflow, execució de Node i invocació d'eina d'Agent, exportats via OTLP/HTTP a Jaeger, Grafana Tempo, Honeycomb, Datadog o qualsevol altre backend compatible.

La pestanya [Analytics](../tabs/analytics-tab.md) fa el seguiment de recomptes d'execucions, taxa d'èxit, durada i tendències per workflow. Les [Alertes](../tabs/alerts-tab.md) vigilen recomptes d'errors, durada d'execució, despesa en tokens o USD i volum d'execucions durant una finestra de temps, i després executen un workflow de notificació que trieu, de manera que una alerta arriba a Slack, correu electrònic, Telegram o a qualsevol altre lloc on pugui arribar un Node.

## Avaluar

### Avaluacions integrades

La [Pestanya Evals](../tabs/evals-tab.md) us permet definir suites de proves i executar-les contra els vostres workflows d'agent:

- Creeu casos de prova amb entrades i sortides esperades, o genereu-los a partir del Prompt de la suite
- Executeu una suite contra diversos models i compareu-ne les sortides costat a costat
- Puntueu amb Exact Match, Contains o LLM-as-Judge amb un model jutge independent
- Reviseu aprovat/suspès, real vs esperat i l'historial d'execucions

Canvieu un Prompt o un model, torneu a executar la suite i compareu els resultats abans que el canvi arribi a producció.

## Controlar

### Human-in-the-Loop (HITL)

Heym té un sistema integrat de [Human-in-the-Loop](../reference/human-in-the-loop.md) que permet als agents pausar l'execució, sol·licitar revisió humana i reprendre exactament on ho van deixar.

- **Punts de control d'Agent** – Activeu `hitlEnabled` a qualsevol Node d'Agent per donar-li una eina `request_human_review`. L'agent decideix quan una decisió necessita supervisió humana i crida l'eina amb un resum i un esborrany.
- **URLs de revisió públiques** – Cada sol·licitud de revisió genera un enllaç segur d'un sol ús a `/review/{token}` (TTL de 168 hores). Els revisors poden **acceptar**, **editar i continuar** o **refusar** sense iniciar sessió.
- **Instantànies d'execució** – El workflow congela el seu estat complet (historial de conversa, variables, resultats d'eines) de manera que es reprèn exactament on es va pausar després que el revisor respongui.
- **Branca de notificació** – Una sortida opcional `review` us permet connectar un flux de notificació (Slack, correu electrònic, Webhook) que s'activa quan es sol·licita una revisió.
- **Polítiques d'aprovació d'eines MCP** – Les directrius HITL escrites s'interpreten en àmbits d'aprovació (`always` / `once` / `never`) perquè l'agent pugui aprovar automàticament eines de baix risc i escalar les d'alt risc.
- **Múltiples punts de control** – Una sola execució d'agent pot pausar-se per revisió diverses vegades; cada punt de control és independent.

Les URLs de revisió públiques, l'edició i continuació, la ramificació de notificacions i la represa basada en instantànies funcionen totes des del mateix punt de control d'agent.

Consulteu [Human-in-the-Loop](../reference/human-in-the-loop.md) per a la referència completa.

### Barreres de seguretat d'LLM

Heym té [Guardrails](../reference/guardrails.md) integrats tant als Nodes [LLM](../nodes/llm-node.md) com als Nodes [Agent](../nodes/agent-node.md), de manera que podeu bloquejar contingut insegur abans que una resposta del model arribi als passos posteriors.

- **Interruptor de seguretat a nivell de Node** – Activeu les barreres de seguretat directament al Node que genera o processa contingut adreçat a l'usuari
- **Cobertura àmplia de polítiques** – Bloquegeu violència, discurs d'odi, contingut sexual, NSFW/profanitat, assetjament, activitat il·legal, sol·licituds de dades personals i intents d'injecció de Prompt
- **Detecció multilingüe** – Apliqueu les mateixes regles de seguretat en turc, anglès, àrab, espanyol i altres llengües
- **Fallback natiu del workflow** – Quan es bloqueja un missatge, el Node llança un error de workflow tipat que podeu encaminar a través d'un [Error Handler](../nodes/error-handler-node.md)

La política de seguretat viu directament dins de la configuració d'LLM i d'Agent i s'integra directament amb la ramificació i la gestió d'errors del workflow.
### Accés, credencials i auditoria

Els agents actuen amb credencials reals, de manera que l'accés forma part de la governança. Les [credencials](../reference/credentials.md) s'encripten en repòs, s'emmasqueren després de la creació i es poden compartir amb usuaris o [equips](../reference/teams.md); els equips també comparteixen workflows, variables, vector stores i fitxers de Drive. L'[inici de sessió únic](../reference/sso.md) connecta qualsevol proveïdor OpenID Connect, incloent-hi Okta, Entra ID, Keycloak, Auth0 i Google. El [registre d'auditoria](../reference/audit.md) enregistra cada acció rellevant per a la seguretat amb el seu actor, objectiu i resultat, i s'envia juntament amb els registres del vostre contenidor al recopilador de registres o SIEM que ja utilitzeu.

### Autoallotjat, les vostres dades són vostres

Heym s'executa a la vostra infraestructura. Els workflows, les credencials, l'historial d'execucions i les traces resideixen a la vostra pròpia base de dades, i les crides als models surten dels vostres servidors cap al proveïdor que trieu, o cap a un model que allotgeu vosaltres mateixos mitjançant Ollama o vLLM. Per als agents que processen documents sensibles, dades de clients o bases de coneixement propietàries, sovint això és un requisit indispensable.

Heym es distribueix sota la **Llicència MIT amb la condició Commons Clause**. El codi font és de disponibilitat oberta: podeu utilitzar-lo, modificar-lo i autoallotjar-lo lliurement. La Commons Clause restringeix la venda del programari, incloent-hi l'oferiment d'allotjament de pagament o serveis de consultoria/suport el valor dels quals derivi substancialment de Heym. Per a llicències comercials, desplegaments empresarials o suport professional, contacteu amb [enterprise@heym.run](mailto:enterprise@heym.run).

## Exposició

### APIs i streaming

Els workflows es poden cridar per HTTP a `/api/workflows/{workflow_id}/execute`, que retorna JSON, i a `/api/workflows/{workflow_id}/execute/stream`, que transmet esdeveniments de node com a Server-Sent Events mentre l'execució avança. Tots dos comparteixen l'autenticació a nivell de workflow, la limitació de taxa i la memòria cau de respostes. Vegeu [Webhooks](../reference/webhooks.md) i [SSE Streaming](../reference/sse-streaming.md).

### Integració amb MCP (Model Context Protocol)

Heym té suport natiu d'[MCP](../tabs/mcp-tab.md) en tots dos costats:

- **Com a client**: els nodes d'agent es connecten a servidors MCP externs (Filesystem, Browserbase, eines personalitzades) mitjançant stdio o SSE i consumeixen les seves eines automàticament
- **Com a servidor**: els workflows amb MCP activat es converteixen en eines al servidor predeterminat a `/api/mcp/sse`, o en servidors amb nom amb la seva pròpia URL i clau d'API, de manera que Claude Desktop, Cursor i altres clients MCP poden cridar directament els vostres workflows de Heym

Els agents poden consumir diversos servidors MCP alhora, i qualsevol workflow pot esdevenir una eina per a un client MCP extern.

### Portal: publiqueu workflows com a interfícies de xat

La funcionalitat [Portal](../reference/portal.md) converteix qualsevol workflow en una interfície de xat d'accés públic a `/chat/{slug}`:

- Autenticació opcional amb credencials per usuari
- Execució en streaming (progrés dels nodes en temps real)
- Suport per a la càrrega de fitxers
- Historial de converses de diversos torns

Els equips publiquen eines internes, chatbots per a clients i formularis impulsats per IA a partir d'un workflow i una URL, sense haver d'escriure cap codi de frontend.

### Quadres de comandament impulsats per workflows

La [pestanya Dashboard](../tabs/dashboard-tab.md) és una superfície d'informes creada per l'usuari on cada widget de gràfic s'impulsa amb el seu propi workflow ocult de Heym. Un widget pot cridar APIs, consultar BigQuery, cercar en RAG/vector stores, executar passos LLM, transformar files i acabar amb un [node Chart Output](../nodes/chart-output-node.md). Podeu crear widgets manualment, generar-los amb IA, ajustar-los més endavant, emmagatzemar els resultats a la memòria cau i reorganitzar la graella visualment.
## Comparació amb eines d'automatització de Workflows

Molts equips arriben a Heym provinents d'eines d'automatització de Workflows. La taula següent compara Heym amb n8n, Zapier i Make.com quant a les capacitats que importen quan els agents s'executen en producció, i les notes al peu que hi ha a sota citen la documentació oficial que dona suport a la comparació. Per a una anàlisi més detallada d'una eina concreta, consulteu les pàgines de comparació a [heym.run/compare](https://heym.run/compare).

| Capacitat | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Node LLM integrat | ✓ | ✓ | ✓ | ✓ |
| API Batch d'LLM + branques d'estat | ✓ | limitat¹¹ | –¹¹ | limitat¹¹ |
| Node Agent integrat (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Orquestració multiagent | ✓ | ✓ | limitat | limitat |
| Nodes d'agent de codificació (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| RAG / magatzem vectorial integrat | ✓ | ✓ | limitat¹ | plugin² |
| Lectura / escriptura WebSocket | ✓ | limitat¹² | –¹³ | –¹⁴ |
| Constructor de Workflows en llenguatge natural | ✓ | limitat³ | ✓ | ✓ |
| Analitzador de Workflows | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Obrir una execució en curs al llenç en directe | ✓ | limitat¹⁹ | limitat¹⁹ | –¹⁹ |
| Taulers de control impulsats per Workflows | ✓ | limitat¹⁷ | limitat¹⁷ | limitat¹⁷ |
| Tauler Kanban agentic | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Sistema de Skills per a agents | ✓ | – | – | – |
| Unitat de fitxers integrada (enllaços per compartir, equips) | ✓ | limitat²² | limitat²² | –²² |
| Node d'automatització de navegador (Playwright) | ✓ | limitat²³ | limitat²³ | –²³ |
| Inspecció de traces d'LLM | ✓ | limitat⁴ | – | ✓ |
| Exportació de traces OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Seguiment del cost de tokens d'LLM (USD) | ✓ | –¹⁵ | –¹⁵ | limitat¹⁵ |
| Avaluacions integrades per a Workflows d'IA | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | limitat⁶ | limitat⁷ |
| Barreres de seguretat d'LLM | ✓ | ✓⁸ | ✓⁸ | limitat⁸ |
| Compressió automàtica de context | ✓ | – | – | – |
| Execució de DAG en paral·lel | ✓ | limitat⁹ | – | – |
| Autoallotjable, codi obert disponible | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| DSL d'expressions per a dades dinàmiques | ✓ | ✓ | limitat | ✓ |
> **Footnotes:** ¹ Zapier Knowledge Sources — no exposa cap magatzem vectorial ni control d'embedding. ² Make.com té mòduls de Pinecone/Qdrant, però cap Node RAG natiu. ³ n8n AI Workflow Builder és una beta només al núvol amb límits de crèdits. ⁴ n8n mostra els passos intermedis; el traçat complet requereix eines de tercers. ⁵ n8n admet aprovacions de crides d'eines d'IA mitjançant xat, correu electrònic i canals de col·laboració, però no fa una instantània ni reprèn tota l'execució com fa Heym. ⁶ Zapier Human in the Loop admet aprovacions i recollida de dades dins de Zaps, però no és un sistema de punt de control amb revisió pública i represa mitjançant instantània. ⁷ Make.com ofereix Human in the Loop com a aplicació Enterprise amb sol·licituds de revisió i resultats ajustats/aprovats/cancel·lats, però continua estant limitat pel pla i és menys natiu per a agents. ⁸ n8n inclou un Node Guardrails dedicat, Zapier inclou AI Guardrails a tots els seus productes d'IA, i Make.com documenta regles d'agent i fluxos de revisió, però no una funcionalitat de guardrails independent comparable, de manera que Make es marca com a limitat. ⁹ n8n s'executa seqüencialment per defecte; el paral·lelisme requereix solucions alternatives amb sub-workflows. ¹⁰ Sustainable Use License — gratuït per a autoallotjament d'ús intern, redistribució comercial restringida. ¹¹ A data del 22 d'abril de 2026, la documentació oficial de n8n descriu l'agrupació HTTP i patrons de bucle/espera en lloc d'una branca nativa d'estat de lot d'LLM, la documentació oficial de l'aplicació ChatGPT de Zapier no llista cap Trigger i només una beta genèrica d'API Request, i la pàgina oficial d'integració amb OpenAI de Make exposa accions per lots com create/watch completed, però no un Node LLM de primera classe amb branques d'estat, de manera que n8n/Make es marquen com a limitats i Zapier es marca com a no disponible per a aquest patró de Workflow específic. ¹² La documentació oficial de n8n cobreix els Nodes HTTP Webhook i HTTP Request, així com l'extensibilitat mitjançant Code/personalitzat/comunitat, però no he pogut trobar cap Node propi de Trigger/enviament WebSocket, de manera que n8n es marca com a limitat. ¹³ La documentació oficial de Zapier cobreix Webhooks d'entrada i sol·licituds de sortida per Webhook/API només sobre HTTP, no passos natius de Trigger o enviament WebSocket. ¹⁴ La documentació oficial de Make cobreix mòduls de Webhooks i mòduls de sol·licitud HTTP(S), però no he pogut trobar cap Trigger o mòdul d'enviament WebSocket natiu. ¹⁵ n8n no té seguiment natiu del cost de tokens d'LLM; existeixen Workflows alternatius de la comunitat, però requereixen instal·lació manual i crides API posteriors a l'execució (sol·licitud de funcionalitat oberta a data de maig de 2026). Zapier no exposa als usuaris cap recompte de tokens ni cost en USD per execució; els passos d'IA només consumeixen tasques. El tauler de crèdits de Make.com reflecteix parcialment el consum de tokens per a la IA allotjada a Make (des d'agost de 2025), però les connexions amb claus API de tercers es facturen com a 1 operació = 1 crèdit sense recompte de tokens; no hi ha cap desglossament en USD per execució per model. ¹⁶ Heym emet spans natius d'OpenTelemetry (un per execució de Workflow més un per Node) sobre OTLP/HTTP cap a qualsevol backend compatible, amb propagació de context de traça W3C i sense codi d'instrumentació, configurat mitjançant variables d'entorn `HEYM_OTEL_*` i desactivat per defecte. n8n té una integració documentada de traçat OpenTelemetry per a execucions de Workflow i de Node. Zapier i Make.com no documenten l'exportació OpenTelemetry de les seves execucions de Workflow/escenari a data de juny de 2026. ¹⁷ n8n documenta un tauler Insights per a mètriques d'execució en producció, Zapier documenta Zap History més Task Usage, i Make.com documenta Scenario History; aquestes són superfícies de monitoratge/historial, no ginys de tauler personalitzats recolzats per lògica de Workflow arbitrària com la pestanya Dashboard de Heym. ¹⁸ Heym Workflow Analyzer executa el Workflow quan és possible, llegeix el resultat de l'execució i genera un informe Markdown compartit i editable que cobreix àrees de millora, propòsit i comportament pas a pas. n8n documenta AI Workflow Builder per crear/refinar/depurar Workflows, Zapier documenta la resolució de problemes amb IA per a execucions de Zap amb errors, i Make.com documenta l'historial d'escenaris més els passos de raonament de l'agent d'IA, però la seva documentació pública no descriu el mateix document compartit d'anàlisi de Workflow conscient de l'execució. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) llista les execucions en curs i pot carregar dades d'una execució anterior a l'editor, mentre que [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) exposa un estat en curs al seu editor. [Make Scenario History](https://help.make.com/scenario-history) documenta el detall d'execució i els registres. La seva documentació pública, consultada el 18 de juliol de 2026, no descriu el flux exacte de Heym: obrir una execució de producció arbitrària en curs des de History o una targeta Kanban, restaurar la instantània del Node actual i continuar rebent l'animació del Node i els registres de Debug al mateix llenç. ²⁰ Els Nodes [Codex](../nodes/codex-node.md) i [OpenCode Go](../nodes/opencode-go-node.md) de Heym executen una CLI real d'agent de programació en un espai de treball aïllat de Heym contra un repositori de GitHub — clonar, editar, produir un diff, pujar una branca, obrir una pull request — com a pas de Workflow de primera classe. A data del 20 de juliol de 2026, cap competidor documenta un equivalent: el [Node OpenAI](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) de n8n cobreix crides a l'API de xat/assistent, no un agent de programació a nivell de repositori, i el suport natiu de Codex continua sent una sol·licitud de la comunitat; el blog del propi Zapier documenta la direcció inversa — [Codex impulsant eines de Zapier mitjançant Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — no Codex com a pas de Zap; els mòduls OpenAI de Make.com exposen accions de completions/assistants/lots, no un agent de programació que clona repositoris i obre PR. ²¹ La [pestanya Board](../tabs/board-tab.md) de Heym és un tauler Kanban agentic integrat les columnes del qual executen Workflows i les targetes del qual porten context, historial de conversa, estat d'execució i execucions. n8n ([integració amb Kanban Tool](https://n8n.io/integrations/kanban-tool/)), Zapier ([integracions amb Kanban Tool](https://zapier.com/apps/kanbantool/integrations)) i Make.com ([integració amb Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) només es connecten a aplicacions kanban de tercers com Kanban Tool, Wekan o NocoDB; cap documenta un tauler integrat que executi els seus propis Workflows, a data del 20 de juliol de 2026. ²² n8n emmagatzema les dades binàries d'execució internament (opcionalment en [emmagatzematge extern compatible amb S3](https://docs.n8n.io/hosting/scaling/external-storage/)), però no documenta cap unitat d'arxius orientada a l'usuari amb enllaços per compartir o compartició en equip, de manera que es marca com a limitat. [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) de Zapier processa arxius només durant l'execució d'un Zap i [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) conté valors de text petits, de manera que Zapier es marca com a limitat. Els [magatzems de dades](https://help.make.com/l6du-data-stores) de Make.com contenen registres estructurats i la seva [gestió d'arxius](https://help.make.com/working-with-files) passa arxius entre aplicacions sense emmagatzematge integrat persistent, de manera que Make es marca com a no disponible. ²³ El [Node Playwright](../nodes/playwright-node.md) de Heym és automatització de navegador pròpia amb un mode visual de passos, passos generats per IA i un mode de codi complet. n8n només ofereix paquets de la comunitat com [n8n-playwright](https://github.com/toema/n8n-playwright) amb una [sol·licitud de funcionalitat encara oberta per a Nodes natius d'automatització de navegador](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), de manera que es marca com a limitat. Zapier Agents pot [navegar i llegir pàgines mitjançant la navegació web i una extensió de Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), però Zapier no documenta cap pas d'automatització de navegador amb scripts, de manera que es marca com a limitat. Make.com documenta mòduls HTTP i aplicacions de scraping de tercers en lloc de qualsevol mòdul natiu d'automatització de navegador, a data del 20 de juliol de 2026.
## Relacionat

- [Introducció](./introduction.md) – Visió general de la plataforma
- [Inici ràpid](./quick-start.md) – Creeu el vostre primer workflow
- [Anàlisi de Workflow](../reference/workflow-analysis.md) – Genereu informes compartits de workflow amb consciència d'execució i comentaris de millora
- [Pestanya Dashboard](../tabs/dashboard-tab.md) – Creeu dashboards basats en workflows amb ginys de gràfics generats per IA
- [Node Agent](../nodes/agent-node.md) – Node LLM amb crida d'eines, MCP i skills
- [Arquitectura d'Agent](../reference/agent-architecture.md) – Sub-agents, orquestrador i enviament d'eines
- [Pestanya Board](../tabs/board-tab.md) – Tauler Kanban agentic amb columnes que executen workflows
- [Node Codex](../nodes/codex-node.md) – Executeu l'agent de codificació OpenAI Codex contra un repositori de GitHub
- [Node OpenCode Go](../nodes/opencode-go-node.md) – Agent de codificació agnòstic del proveïdor en un contenidor endurit
- [Pestanya Drive](../tabs/drive-tab.md) – Emmagatzematge de fitxers integrat amb enllaços per compartir, equips i accions massives
- [Node Playwright](../nodes/playwright-node.md) – Automatització de navegador pròpia amb passos d'IA i mode de codi
- [Node RAG / Vector Store](../nodes/rag-node.md) – Cerca vectorial i inserció de documents (Qdrant o Postgres pgvector)
- [Assistent d'IA](../reference/ai-assistant.md) – Constructor de workflows en llenguatge natural
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Punts de control d'agents amb URL de revisió públiques
- [Guardrails](../reference/guardrails.md) – Bloquegeu prompts insegurs abans que arribin als vostres models
- [Pestanya Traces](../tabs/traces-tab.md) – Observabilitat de crides LLM
- [Pestanya Evals](../tabs/evals-tab.md) – Conjunts de proves per a workflows d'IA
- [Pestanya Alerts](../tabs/alerts-tab.md) – Alertes de llindar sobre errors, durada, cost i volum d'execucions
- [Traçabilitat OpenTelemetry](../reference/opentelemetry.md) – Exporteu spans d'execució, node i eines mitjançant OTLP
- [Distribució de càrrega](../reference/cluster.md) – Compartiu execucions entre instàncies amb failover de líder
- [Inici de sessió únic](../reference/sso.md) – Inicieu sessió a través de qualsevol proveïdor OpenID Connect
- [Registre d'auditoria](../reference/audit.md) – Accions rellevants per a la seguretat amb actor, objectiu i resultat
- [Portal](../reference/portal.md) – Publiqueu workflows com a interfícies de xat públiques
- [Execució paral·lela](../reference/parallel-execution.md) – Execució concurrent basada en DAG
- [Pestanya MCP](../tabs/mcp-tab.md) – Configuració del servidor i client MCP
