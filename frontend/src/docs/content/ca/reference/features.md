# Conjunt complet de funcionalitats de Heym

Una visió general exhaustiva de totes les capacitats de Heym. Cada secció descriu una funcionalitat o un concepte en unes poques frases.

---

## Primers passos

### [Introducció](../getting-started/introduction.md)

Heym és la infraestructura per executar i governar agents d'IA en producció. Construïu sistemes agentics en un canvas visual i executeu-los amb confiança: orquestreu agents, automatitzeu processos de negoci, inspeccioneu cada execució i manteniu el control humà a la vostra pròpia infraestructura. Admet workflows visuals, nodes potenciats per IA ([LLM](../nodes/llm-node.md), [Node Agent](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), un [Assistent d'IA](./ai-assistant.md), integracions ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), correu electrònic entrant mitjançant [IMAP Trigger](../nodes/imap-trigger-node.md), correu electrònic sortint mitjançant [Send Email](../nodes/send-email-node.md)), programació amb [Cron](../nodes/cron-node.md) i portals de Chat de [Portal](./portal.md) per als usuaris finals.

Vegeu també [Conceptes bàsics](../getting-started/core-concepts.md), [Tipus de nodes](./node-types.md) i [Integracions de tercers](./integrations.md).

### [Per què Heym](../getting-started/why-heym.md)

Per què Heym recorre el cicle de vida dels agents (construir, orquestrar, executar, observar, avaluar, controlar, exposar) i mostra què gestiona un entorn d'execució autoallotjat en cada etapa. Això inclou el node [LLM](../nodes/llm-node.md) i el [Node Agent](../nodes/agent-node.md) amb crida d'eines, eines de Python, connexions [MCP](../tabs/mcp-tab.md), habilitats i orquestració multiagent; triggers, reintents i [distribució de càrrega](./cluster.md); [Execucions](../tabs/traces-tab.md) amb cost en USD per execució i exportació OpenTelemetry; [Avaluacions](../tabs/evals-tab.md); [punts de control de revisió humana](./human-in-the-loop.md), barreres de seguretat, SSO i una pista d'auditoria; i endpoints REST, MCP i Portal. La pàgina es tanca amb una comparació de capacitats amb n8n, Zapier i Make.com.

Vegeu també [Node Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) i [Arquitectura d'agents](./agent-architecture.md).

### [Inici ràpid](../getting-started/quick-start.md)

Poseu en marxa el vostre primer workflow en qüestió de minuts: creeu un workflow des de la pestanya [Workflows](../tabs/workflows-tab.md), afegiu un node [Input](../nodes/input-node.md), un node [LLM](../nodes/llm-node.md) i un node [Output](../nodes/output-node.md), i connecteu-los. Configureu el [LLM](../nodes/llm-node.md) amb una credencial i establiu `userMessage` a `$input.text`; utilitzeu Run o l'[Assistent d'IA](./ai-assistant.md) per executar o generar workflows amb llenguatge natural.

Es combina de manera natural amb [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) i [Expression DSL](./expression-dsl.md).

### [Conceptes bàsics](../getting-started/core-concepts.md)

Els workflows són grafs dirigits de nodes connectats per arestes; l'execució flueix des dels nodes trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) a través dels nodes de processament fins als nodes [Output](../nodes/output-node.md). Cada node té un tipus, dades (configuració) i entrades/sortides; les arestes defineixen el flux de dades. Els nodes fan referència a dades dels nodes anteriors mitjançant expressions d'[Expression DSL](./expression-dsl.md) com ara `$nodeLabel.field`; els nodes independents s'executen automàticament en [paral·lel](./parallel-execution.md).

Vegeu també [Triggers](./triggers.md), [Execució en paral·lel](./parallel-execution.md) i [Estructura del workflow](./workflow-structure.md).

### [Execució i desplegament](../getting-started/running-and-deployment.md)

Heym proporciona `run.sh` per al desenvolupament local (base de dades en Docker, backend FastAPI, frontend Vite) i `deploy.sh` per a producció amb Docker Compose. Tots dos utilitzen un fitxer `.env`; les variables clau inclouen `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` i `ALLOW_REGISTER`. El desenvolupament s'executa en ports de frontend i backend configurables; la producció serveix l'API sota `/api` a través del contenidor de frontend.

Vegeu també [Seguretat](./security.md), [Empresa](./enterprise.md) i [Configuració](./user-settings.md).
### [Migrar a Heym](../getting-started/migrate-to-heym.md)

L'eina AI Convert converteix un workflow d'una altra plataforma (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) o una descripció en llenguatge natural en un workflow de Heym, emès en directe sobre un canvas i a punt per a [descarregar i importar](./download-import.md). Executa una comprovació de seguretat d'IA i, tot seguit, genera el DSL amb els límits d'entrada i de taxa corresponents. Obriu-la a [heym.run/convert](https://heym.run/convert).

Vegeu també [Inici ràpid](../getting-started/quick-start.md), [Descàrrega i importació](./download-import.md) i [Assistent d'IA](./ai-assistant.md).

---

## Nodes

### Triggers

#### [Input](../nodes/input-node.md)

El node Input és el punt d'entrada per als workflows que reben dades de l'usuari o de qui crida l'API. Admet un o diversos camps d'entrada i exposa les metadades de la sol·licitud (headers, query params). Accediu als camps del body mitjançant `$nodeLabel.body.fieldKey`, als headers mitjançant `$nodeLabel.headers` i a la query mitjançant `$nodeLabel.query`.

Es combina de manera natural amb [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) i [Output](../nodes/output-node.md). Per a les referències de payload i l'accés als camps, vegeu [Expression DSL](./expression-dsl.md) i [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

El node Cron activa un workflow segons una programació mitjançant una expressió cron estàndard de cinc camps. No requereix cap entrada de l'usuari: el workflow s'executa automàticament en els moments especificats (per exemple, cada hora, diàriament, cada 15 minuts). La sortida és un esdeveniment de trigger sense payload.

Vegeu també [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) i [Historial d'execucions](./execution-history.md) per a execucions programades i ajornades.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

El node IMAP Trigger consulta una bústia d'entrada a intervals de minuts configurables i inicia un workflow per a cada correu electrònic nou detectat. Produeix headers analitzats, llistes de remitents i destinataris, cossos en text pla i HTML, metadades dels adjunts i una marca temporal del trigger. Utilitzeu-lo per al triatge de bústies de suport, l'encaminament de correu a [Slack](../nodes/slack-node.md) o fluxos d'aprovació basats en correu electrònic amb [Human-in-the-Loop](./human-in-the-loop.md).

Es combina amb [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) i [Slack](../nodes/slack-node.md) per a fluxos de triatge i resposta de correu entrant.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

El node Heym Trigger inicia un workflow quan el mateix Heym publica un esdeveniment de plataforma: `heym.started`, `workflow.created`, `workflow.updated` o `workflow.deleted`. El lliurament és per lots: cada esdeveniment publicat dins d'una mateixa finestra de despatx de cinc segons arriba en una sola execució com a `$nodeLabel.events`, sempre un array. Cada esdeveniment es reclama mitjançant una restricció única de base de dades, de manera que s'activa exactament una vegada per node subscrit, independentment de quants workers, contenidors o màquines estiguin en execució. Utilitzeu-lo per a pistes d'auditoria de canvis de workflow, anuncis de desplegament i resums de salut de la instància.

Es combina amb el node [Heym](../nodes/heym-node.md) per consultar el workflow modificat, i amb [Loop](../nodes/loop-node.md) per actuar una vegada per esdeveniment.

#### [Heym](../nodes/heym-node.md)

El node Heym llegeix les dades pròpies de Heym mitjançant tres operacions: `listWorkflows` retorna tots els workflows als quals el propietari pot accedir amb recomptes de nodes i marques temporals, `getWorkflow` retorna l'estructura de nodes i arestes d'un workflow, i `getExecutionHistory` retorna entrades de l'historial d'execucions de més recent a més antiga amb filtres opcionals d'estat, finestra temporal i límit, juntament amb totals agrupats per estat. Els resultats estan abastats al propietari del workflow on resideix el node, de manera que una execució iniciada per cron, un portal o un esdeveniment retorna les mateixes dades que una execució manual. `getWorkflow` retorna la configuració completa dels nodes, cosa que fa possible auditar un workflow a la recerca de claus o tokens codificats directament; no exposa res que el propietari del workflow no pogués ja obrir a l'editor. No requereix cap credencial.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

El node WebSocket Trigger obre una connexió de client sortint cap a un servidor WebSocket extern i inicia el workflow amb `onMessage`, `onConnected` o `onClosed`. Expandeix payloads de missatges analitzats, l'estat de reconnexió, les metadades de tancament i l'URL del socket per a expressions posteriors.

Es combina amb [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) i [SSE Streaming](./sse-streaming.md) per a integracions en temps real.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

El node Telegram Trigger rep actualitzacions de webhook del bot i inicia el workflow immediatament. Expandeix el payload complet de l'actualització, l'objecte principal del missatge, les consultes de callback, els headers sanejats i una marca temporal del trigger. Utilitzeu-lo per a chatbots, assistents d'IA a [Telegram](../nodes/telegram-node.md) i fluxos basats en botons.

Es combina amb [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) i [Webhooks](./webhooks.md) per a workflows basats en bots.
#### [Trigger de Slack](../nodes/slack-trigger-node.md)

El node Trigger de Slack rep webhooks de l'API d'Events de Slack i inicia un workflow automàticament després de verificar la signatura de la sol·licitud. Exposa el payload de l'esdeveniment i les capçaleres sanititzades per a l'encaminament descendent, la classificació basada en [LLM](../nodes/llm-node.md) i els fluxos de resposta.

Es combina amb [Slack](../nodes/slack-node.md), [Node Agent](../nodes/agent-node.md) i [Integracions de tercers](./integrations.md).

#### [Trigger de Discord](../nodes/discord-trigger-node.md)

El node Trigger de Discord rep webhooks de l'API d'Interactions de Discord, verifica les signatures Ed25519 amb la credencial `discord_trigger` seleccionada i inicia el workflow. Exposa el payload complet de la interacció, les dades de la comanda, les capçaleres sanititzades i les metadades del trigger per a l'encaminament descendent o les respostes.

Es combina amb [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Node Agent](../nodes/agent-node.md) i [Integracions de tercers](./integrations.md).

#### [RabbitMQ](../nodes/rabbitmq-node.md)

El node RabbitMQ envia o rep missatges de les cues i intercanvis de RabbitMQ. Utilitzeu-lo per a workflows basats en missatges i processament d'esdeveniments. El mode d'enviament publica un missatge amb retard opcional; el mode de recepció actua com a [trigger](./triggers.md), de manera que el workflow s'inicia quan arriba un missatge. La sortida inclou status, message_id i body.

Es combina amb [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) i [Execució paral·lela](./parallel-execution.md) per al processament basat en esdeveniments.

#### [Error Handler](../nodes/error-handler-node.md)

El node Error Handler s'executa automàticament quan falla qualsevol node del workflow. No calen arestes entrants; el motor l'activa. La sortida inclou el missatge d'error, l'etiqueta del node fallit, el tipus de node i la marca temporal. Utilitzeu-lo per enviar notificacions mitjançant [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) o [Send Email](../nodes/send-email-node.md), registrar errors o retornar respostes d'error personalitzades.

Com a alternativa a gestionar errors al canvas, un workflow també pot delegar els errors a un workflow separat — consulteu [Error Workflow](#error-workflow). Si el canvas ja conté un node Error Handler, el workflow d'errors **no** es crida (el gestor local té prioritat).

Els destins de notificació habituals són [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) i [Send Email](../nodes/send-email-node.md); els detalls d'execució són més fàcils d'inspeccionar a [Historial d'execucions](./execution-history.md).

### IA
#### [Node Agent](../nodes/agent-node.md)

El node Agent d'IA és un node [LLM](../nodes/llm-node.md) amb crida d'eines. Pot executar eines Python, cridar nodes del canvas connectats com a eines, connectar-se a servidors [MCP](../tabs/mcp-tab.md), utilitzar skills (fitxers d'instruccions i scripts Python opcionals), actuar com a orquestrador que delega en altres nodes agent i cridar altres workflows com a eines. La sortida està disponible com a `$nodeLabel.text`. Un commutador opcional **Extra Body** adjunta un objecte JSON de paràmetres de sol·licitud específics del proveïdor a cada sol·licitud dins del bucle de crida d'eines; està desactivat per defecte. Un commutador opcional **Use Responses API** encamina les crides al model de l'agent a través de l'API Responses, que preserva el raonament del model entre crides d'eines, de manera que un model de raonament manté la seva cadena de pensament durant un bucle de diversos passos; està desactivat per defecte i funciona amb OpenAI i credencials personalitzades.

Les eines de nodes del canvas permeten que un agent cridi nodes de workflow configurats directament des del canvas. Connecteu un node compatible a la nansa d'eines de l'agent i, a continuació, marqueu camps específics com a proporcionats per l'agent amb la icona del bot. Aquests camps esdevenen paràmetres d'eina en temps d'execució, mentre que les credencials i els camps no marcats romanen fixos a la configuració del node.

La secció Skills ara inclou **AI Build** per crear skills noves, una acció de edició en línia amb IA per a skills existents, la descàrrega individual de cada skill en ZIP i un commutador opcional **Enable Drive files** per a skills que necessiten llegir fitxers de Heym Drive en temps d'execució. El modal Skill Builder transmet una conversa de chat a l'esquerra, accepta fitxers arrossegats i deixats anar amb cada comentari d'ajust fi, mostra una previsualització en directe de només lectura dels fitxers `SKILL.md` i `.py` generats a la dreta, pot descarregar aquesta previsualització com a ZIP i desa els fitxers d'ajust fi pujats com a actius de skill empaquetats mitjançant el mateix flux d'ingestió ZIP que utilitzen les pujades manuals.

Amb la **[Memòria Persistent de l'Agent](./agent-persistent-memory.md)** activada, cada node agent manté el seu propi graf de coneixement: els fets es carreguen al prompt del sistema quan no estan buits, i les execucions correctes desencadenen una fusió en segon pla de noves entitats i relacions. Els subagents utilitzen grafs separats. Podeu **compartir** el graf d'un agent amb altres agents (del mateix workflow o d'un altre) amb accés de només lectura o de lectura/escriptura des del diàleg del graf. El control de cervell del canvas obre l'editor del graf.

Els nodes agent també poden entrar en mode [Human-in-the-Loop](./human-in-the-loop.md). En aquest mode, l'agent obté una eina `request_human_review` i pot fer una pausa en passos específics que requereixen aprovació, crear un enllaç de revisió públic d'un sol ús, exposar una branca de canvas `review` per a fluxos de notificació i esperar fins que un revisor accepti, editi o rebutgi el text de revisió en Markdown. El camp HITL del node actua com a directrius d'aprovació sobre quan cal preguntar, mentre que el resum adreçat al revisor es genera a partir de cada sol·licitud de revisió. Per a les eines [MCP](../tabs/mcp-tab.md), Heym utilitza el model per interpretar aquestes instruccions escrites com a `always`, `once` o `never`, de manera que el llenguatge d'aprovació lliure es tradueix en una política concreta en temps d'execució. L'execució es marca com a `pending` i es reprèn des de la instantània d'execució desada un cop arriba la decisió, i la mateixa execució de l'agent pot fer una pausa més d'una vegada si passos posteriors també requereixen revisió.

Els nodes agent comprimeixen automàticament el seu historial de missatges acumulat quan s'acosta al 80% de la finestra de context del model. El prompt del sistema, el primer missatge de l'usuari i el missatge més recent de l'usuari sempre es preserven; tot el que hi ha entremig es resumeix utilitzant el mateix model i la mateixa credencial. Els esdeveniments de compressió són visibles al panell Debug, a l'[Historial d'execucions](./execution-history.md) i a la pestanya [Execucions](../tabs/traces-tab.md).

Vegeu també [LLM](../nodes/llm-node.md), [Arquitectura de l'Agent](./agent-architecture.md), [Memòria Persistent de l'Agent](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) i [Generació de Fitxers](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

El node Codex executa la CLI d'OpenAI Codex dins d'un espai de treball Heym aïllat. Accepta una credencial de Codex (inicieu sessió amb ChatGPT per utilitzar la vostra subscripció sense costos per token d'API, o enganxeu un token d'accés), una credencial de GitHub, l'URL del repositori, la branca base, el prompt de la tasca, el mode de publicació (`diff_only` o `draft_pr`), el nom de la branca i el temps d'espera. L'executor clona el repositori localment, passa el paquet de tokens de ChatGPT o `CODEX_ACCESS_TOKEN` només al procés de Codex, i retorna un resum estructurat, notes de validació, fitxers modificats, el diff, metadades d'ús i una URL opcional de PR en esborrany.

Quan Codex retorna `needs_input`, el workflow es posa en pausa i exposa la branca `question`. Connecteu aquesta branca a Slack, correu electrònic o un altre node de notificació; l'enllaç públic de seguiment reprèn la instantània d'execució desada després que es trameti la resposta. El node Codex també es pot adjuntar a un Agent d'IA com a eina, permetent que l'agent delegui tasques de programació; com a eina, un resultat `needs_input` es retorna en línia a l'agent en lloc de posar en pausa el workflow.

Vegeu també [GitHub](../nodes/github-node.md), [Credencials](./credentials.md), [Compartició de credencials](./credentials-sharing.md) i [Tipus de nodes](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

El node OpenCode Go executa la CLI d'OpenCode (Go) contra un repositori de GitHub. L'aïllament segueix el patró de Codex: localment s'executa com un subprocés de l'amfitrió, mentre que els desplegaments amb Docker l'executen dins d'un contenidor germà endurit que comparteix el volum de l'espai de treball. Accepta una credencial d'OpenCode Go (una clau d'API de passarel·la amb una URL base opcional), una credencial de GitHub, l'URL del repositori, la branca base, el prompt de la tasca, el mode de publicació, el nom de la branca, el temps d'espera i un model `opencode-go/<model>` triat d'una llista de models en directe i cercable (amb un valor de reserva integrat). Heym realitza totes les operacions de git/GitHub a l'amfitrió i mai col·loca el token de GitHub dins de la sandbox; OpenCode només edita fitxers al disc. El node retorna un resum estructurat, notes de validació, fitxers modificats, el diff i una URL opcional de pull request. Es pot adjuntar a un Agent d'IA com a eina.

Vegeu també [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Credencials](./credentials.md), [Compartició de credencials](./credentials-sharing.md) i [Tipus de nodes](./node-types.md).

#### [LLM](../nodes/llm-node.md)

El node LLM processa text amb un model de llenguatge o genera imatges. Admet generació de text, visió (entrada d'imatge), generació d'imatges, sortida JSON estructurada, execució nativa de Batch API del proveïdor per a endpoints compatibles amb OpenAI i OpenAI, i un commutador opcional **Use Responses API** que encamina la crida a través de l'API de Responses en lloc de Chat Completions (desactivat per defecte; funciona amb OpenAI i credencials personalitzades, i no es pot combinar amb el mode Batch). Configureu la credencial, el model, els missatges de sistema i d'usuari, la temperatura i el nombre màxim de tokens; utilitzeu l'[Expression DSL](./expression-dsl.md) als prompts. En mode batch, `userMessage` ha de resoldre's a un array, el node emet una branca `batchStatus` amb actualitzacions de progrés, i la sortida final inclou resultats batch per element. Un commutador opcional **Extra Body** adjunta un objecte JSON de paràmetres de sol·licitud específics del proveïdor (per exemple `{"thinking": {"type": "disabled"}}`) a cada crida d'API; està desactivat per defecte. Els [Guardrails](./guardrails.md) opcionals bloquegen contingut insegur abans de la crida.

Es combina de manera natural amb [Qdrant RAG](../nodes/rag-node.md), [Node Agent](../nodes/agent-node.md), [Guardrails](./guardrails.md) i [Diàleg d'avaluació d'expressions](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

El node Decision planteja preguntes tipades a un model de decisió sobre l'estat de l'execució i retorna probabilitats en lloc de prosa. Un camp **State** transporta allò que el model ha de llegir —una expressió sola conserva el seu propi tipus, de manera que `$input` envia l'objecte en lloc del seu text— i una llista de preguntes transporta els judicis. Les preguntes es presenten en tres formes: **noul** respon si es compleix una condició, **choice** tria una opció d'un conjunt que definiu i retorna la distribució completa, i **score** valora l'estat al llarg de nivells ordenats i pot situar-se entre ells. Les respostes de choice i score també porten una confiança, de manera que un [Switch](../nodes/switch-node.md) pot encaminar segons la resposta mentre un [Condition](../nodes/condition-node.md) filtra segons com de segura era. **Generate with AI** redacta la plantilla d'estat i les files de preguntes a partir d'una frase simple, i **Custom request body** envia JSON escrit a mà per a un endpoint el contracte del qual difereix. La resposta del proveïdor es passa sense modificar, i cada crida es registra a [Execucions](../tabs/traces-tab.md).

Necessita una credencial de Decision Model; es combina de manera natural amb [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) i [Node Agent](../nodes/agent-node.md).
#### [RAG / Magatzem vectorial](../nodes/rag-node.md)

El node RAG / Magatzem vectorial insereix, actualitza (upsert), elimina i cerca documents en un magatzem vectorial per a la generació augmentada per recuperació. Un desplegable de Base de dades selecciona el backend — **Qdrant** (servidor extern) o **Postgres (pgvector)** (la base de dades pròpia de Heym, sense servei extern), amb Qdrant com a opció per defecte. Trieu un magatzem vectorial des de la pestanya [Magatzems vectorials](../tabs/vectorstores-tab.md) i establiu l'operació a inserir, actualitzar, eliminar o cercar. Les operacions d'actualització i eliminació adrecen un document mitjançant un id únic emmagatzemat dins del payload — un **Camp d'ID de document** anomena aquest camp (per defecte `doc_id`) i **ID de document** en conté el valor — de manera que un document conserva l'id que el vostre propi sistema ja utilitza: l'actualització substitueix tots els punts coincidents abans d'emmagatzemar la nova versió, i l'eliminació informa si alguna cosa ha coincidit. Les metadades del document accepten expressions en els seus valors, de manera que `{"url": "$start.url"}` emmagatzema allò que l'execució ha produït. La cerca admet filtres de metadades, **Hybrid Search** opcional (similitud vectorial fusionada amb coincidència de paraules clau BM25, de manera que els termes exactes com ara identificadors i codis d'error es trobin al costat de les coincidències semàntiques) i reordenació opcional de Cohere, i retorna una matriu de resultats amb text, score, metadata, indicadors reranked i hybrid, i count per utilitzar en fluxos de [LLM](../nodes/llm-node.md) o [Node Agent](../nodes/agent-node.md).

Els nodes descendents habituals són [LLM](../nodes/llm-node.md) i [Node Agent](../nodes/agent-node.md); la configuració del magatzem vectorial es troba a [Magatzems vectorials](../tabs/vectorstores-tab.md).

#### [Node de crida MCP](../nodes/mcp-call-node.md)

El node de crida MCP crida una eina [MCP](../tabs/mcp-tab.md) específica directament, sense que un LLM decideixi quina eina invocar. Utilitzeu-lo quan sapigueu exactament quina eina executar en temps de disseny — per a una execució determinista d'una eina MCP en un sol pas dins d'un workflow. Configureu una connexió (SSE, HTTP transmissible o stdio; els mateixos camps que la connexió MCP del [Node Agent](../nodes/agent-node.md)), feu clic a **Fetch Tools** per omplir un desplegable, seleccioneu una eina i ompliu els camps d'arguments que es renderitzen automàticament a partir de l'esquema d'entrada de l'eina. Cada argument accepta un valor estàtic o una [expressió DSL](./expression-dsl.md) com ara `$userInput.body.text`. El resultat està disponible com a `$nodeLabel.result` (objecte JSON si és analitzable, en cas contrari una cadena). El node de crida MCP no es pot connectar a un [Node Agent](../nodes/agent-node.md) com a eina del canvas.

Vegeu també [Node Agent](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) i [Expressió DSL](./expression-dsl.md).

### Lògica

#### [Condició](../nodes/condition-node.md)

El node Condició ramifica el workflow en funció d'una expressió if/else. Té dues sortides: una per quan la condició és verdadera i una per quan és falsa. Utilitzeu operadors de comparació i lògics de l'[Expressió DSL](./expression-dsl.md) en l'expressió de la condició; el node passa l'entrada a la branca escollida.

Vegeu també [Switch](../nodes/switch-node.md), [Llançar error](../nodes/throw-error-node.md) i [Expressió DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

El node Switch encamina l'execució cap a camins diferents fent coincidir un valor amb casos. Configureu una expressió a avaluar i una llista de valors de cas; cada cas obté una sortida i s'utilitza una sortida per defecte per als valors que no coincideixen. L'entrada es passa a la branca coincident.

Utilitzeu [Condició](../nodes/condition-node.md) per a ramificacions binàries i [Merge](../nodes/merge-node.md) per reunir camins encaminats; les regles de coincidència es tracten a [Expressió DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

El node Merge espera múltiples entrades paral·leles i les combina en una única sortida. Establiu el nombre d'entrades a esperar; el node produeix un objecte fusionat un cop totes les branques s'han completat. Utilitzeu-lo per unir resultats de branques paral·leles abans de continuar; no l'utilitzeu quan les branques paral·leles acaben en nodes de sortida separats.

Vegeu també [Execució paral·lela](./parallel-execution.md), [Bucle](../nodes/loop-node.md) i [Sortida](../nodes/output-node.md) en recombinar branques.

#### [Bucle](../nodes/loop-node.md)

El node Bucle itera sobre una matriu, executant els nodes descendents per a cada element. Requereix una connexió de retorn des de l'últim node del cos de la iteració per avançar. Dins del cos del bucle utilitzeu `item`, `index`, `total`, `isFirst` i `isLast`; el bucle té sortides separades per al camí d'iteració i el camí de finalització.

Es combina amb [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) i [Expressió DSL](./expression-dsl.md) per a workflows iteratius.

### Dades
#### [Set](../nodes/set-node.md)

El node Set transforma i mapeja les dades d'entrada a una sortida personalitzada. Definiu mapejos clau-valor on cada valor sigui una expressió d'[Expression DSL](./expression-dsl.md). Utilitzeu-lo per a majúscules, subcadenes, concatenació, nombres aleatoris i transformacions similars. Accediu a la sortida per clau (per exemple, `$setNode.keyName`). Quan es connecta a un agent com a eina de node del canvas, els valors del mapeig es poden marcar com a proporcionats per l'agent perquè aquest els ompli en temps d'execució. Per cridar altres workflows, utilitzeu el node [Execute](../nodes/execute-node.md) en el seu lloc.

Vegeu també [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) i [Expression DSL](./expression-dsl.md).

#### [Converter](../nodes/converter-node.md)

El node Converter converteix dades entre formats sense escriure codi. Les conversions de text són `csvToJson` (text CSV en un array d'objectes de fila, o arrays quan no hi ha capçalera), `jsonToCsv` (un array d'objectes/files en text CSV), `xmlToJson` (text XML en un objecte) i `jsonToXml` (un objecte en text XML). Configureu la direcció de conversió i l'expressió d'origen; les conversions CSV utilitzen addicionalment un delimitador i la gestió de capçaleres, i `jsonToCsv` pot fixar un ordre de columnes explícit. Les cometes, els delimitadors incrustats i els salts de línia incrustats segueixen la RFC 4180. Els atributs XML utilitzen prefixos `@`, el text barrejat amb atributs utilitza `#text`, els elements repetits esdevenen arrays i l'expansió d'entitats XML està desactivada. El mateix node també funciona amb fitxers emmagatzemats. `imageToText` i `pdfToText` executen Tesseract OCR, llegint un fitxer de Heym Drive (`$Upload.file.id` d'un trigger File upload, el resultat d'un node Drive o un fitxer generat per un agent), seleccionant l'idioma automàticament a partir de l'escriptura detectada o utilitzant codis que especifiqueu com ara `tur` o `eng+tur`, i normalitzant el text a UTF-8 per defecte amb normalització NFC opcional i conjunts de caràcters més estrets com `cp1254`. `fileConvert` reescriu un fitxer emmagatzemat en un altre format, documents mitjançant pandoc i imatges mitjançant Pillow, i desa el resultat com un fitxer nou de Drive sense tocar l'original. El resultat està disponible com a `$converterNode.result`, amb `.language`, `.encoding`, `.page_count`, `.pages` i `.file` al costat per a les execucions d'OCR, i `.id`, `.filename` i `.download_url` per a `fileConvert`.

Vegeu també [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) i [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

El node Code executa Python que escriviu vosaltres, amb el seu propi `requirements.txt`, en un contenidor que es crea i es destrueix per a cada execució. El vostre codi defineix una funció `main(params)` i retorna qualsevol valor serialitzable en JSON, que esdevé `$codeNode.result`; tot el que imprimeix es captura per separat com a `$codeNode.logs`, i `$codeNode.install` informa quina eina ha instal·lat les dependències. Els paràmetres es configuren com un objecte JSON les expressions `$` del qual es resolen abans de l'execució, i el codi els llegeix amb notació de punt com ara `params.user.name` o `params.orders[0].id`. Les dependències s'instal·len amb `uv`, amb retrocés a `pip` per als paquets que `uv` no pot gestionar, sense memòria cau entre execucions; deixar `requirements.txt` buit omet completament la instal·lació i és molt més ràpid. La fase d'execució no té xarxa tret que `codeAllowNetwork` estigui activat, mentre que la instal·lació de dependències sempre arriba a PyPI. El sandbox s'executa sense root amb totes les capacitats eliminades, un sistema de fitxers d'arrel de només lectura, sense socket de Docker i sense accés als secrets del backend, limitat a 512 MB de memòria, una CPU, 256 processos, una instal·lació de 120 segons i una execució de 60 segons. Docker és necessari i no hi ha mode alternatiu: sense un dimoni accessible, el node falla en lloc d'executar el vostre codi al procés del backend.

#### [Variable](../nodes/variable-node.md)

El node Variable estableix o actualitza una variable local del workflow (`$vars.variableName`) o una [variable global](./global-variables.md) persistent (`$global.variableName`). Utilitzeu-lo per a comptadors, llistes acumulades i estat compartit. Configureu el nom de la variable, l'expressió del valor, la coerció de tipus i si s'ha d'emmagatzemar al magatzem global. Les variables d'array admeten `$array()` i `.add()`.

Es combina amb [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) i [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

El node Execute crida un altre workflow (sub-workflow) i li passa l'entrada. Especifiqueu el workflow de destinació per ID i proporcioneu l'entrada mitjançant una única expressió o mapejos clau-valor. La sortida inclou workflow_id, status i outputs; utilitzeu-lo per a lògica reutilitzable, no per a la transformació de dades (per a això utilitzeu Set).

Vegeu també [Canvas Features](./canvas-features.md) per a Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) i [Output](../nodes/output-node.md).

### Integrations
#### [HTTP](../nodes/http-node.md)

El node HTTP realitza peticions HTTP mitjançant una configuració a l'estil cURL. Pot ser un punt d'inici del workflow (sense aresta d'entrada) o rebre entrada de nodes upstream. La resposta està disponible com a status, headers i body (JSON analitzat quan sigui aplicable). Utilitzeu [Credencials](./credentials.md) per a autenticació Bearer o capçalera personalitzada.

Es combina amb [Webhooks](./webhooks.md), [Credencials](./credentials.md) i [Integracions de tercers](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

El node WebSocket Send obre una connexió de client sortint, envia un missatge de text/JSON/binari i la tanca. Utilitzeu-lo per publicar la sortida del workflow en sistemes en temps real sense crear un endpoint de socket allotjat per Heym.

Vegeu també [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) i [Integracions de tercers](./integrations.md).

#### [Telegram](../nodes/telegram-node.md)

El node Telegram envia un missatge de bot a un xat, grup o canal. Configureu una [credencial](./credentials.md) de Telegram, establiu `chatId` i composeu el `message` de sortida amb expressions d'[Expression DSL](./expression-dsl.md). Es combina de manera natural amb [Telegram Trigger](../nodes/telegram-trigger-node.md) per a workflows conversacionals i amb [Error Handler](../nodes/error-handler-node.md) per a alertes d'operador.

Vegeu també [Integracions de tercers](./integrations.md) i [Credencials](./credentials.md) per a la configuració i els patrons de credencials.

#### [Slack](../nodes/slack-node.md)

El node Slack envia un missatge a un canal de Slack mitjançant un Incoming Webhook. Configureu una [credencial](./credentials.md) de Slack i una expressió de missatge. Utilitzeu-lo per a notificacions, alertes i informes d'errors; la sortida passa a través de l'entrada.

Es combina amb [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) i [Integracions de tercers](./integrations.md).

#### [Discord](../nodes/discord-node.md)

El node Discord envia un missatge a un canal de Discord mitjançant un Incoming Webhook. Configureu una [credencial](./credentials.md) de Discord, composeu el missatge de sortida amb [Expression DSL](./expression-dsl.md) i, opcionalment, establiu substitucions del nom d'usuari o avatar del webhook.

Es combina amb [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) i [Integracions de tercers](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

El node Send Email envia correus electrònics via SMTP. Configureu una [credencial](./credentials.md) SMTP i expressions d'[Expression DSL](./expression-dsl.md) per al destinatari o destinataris, l'assumpte i el cos. Utilitzeu-lo per a notificacions, alertes i correus transaccionals. La sortida inclou status, to i subject.

El [IMAP Trigger](../nodes/imap-trigger-node.md) complementa Send Email gestionant el correu entrant. Junts permeten que un workflow llegeixi el correu entrant d'una bústia compartida, el resumeixi o classifiqui amb nodes d'IA i enviï un missatge de seguiment o escalat. El [Telegram Trigger](../nodes/telegram-trigger-node.md) i el [node Telegram](../nodes/telegram-node.md) proporcionen el mateix patró d'entrada/sortida per a workflows de xat impulsats per bots.

Per a fluxos de notificació bidireccionals, també es combina bé amb [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) i [Integracions de tercers](./integrations.md).

#### [Redis](../nodes/redis-node.md)

El node Redis realitza operacions de Redis: set, get, hasKey i deleteKey. Utilitzeu-lo per a memòria cau, limitació de velocitat i emmagatzematge clau-valor. Configureu una [credencial](./credentials.md), el tipus d'operació, l'expressió de la clau i, per a les operacions set, el valor i el TTL opcional. La sortida varia segons l'operació (value, success, exists, deleted).

Es combina amb [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) i [Parallel Execution](./parallel-execution.md) per a memòria cau, limitació i coordinació.

#### [Grist](../nodes/grist-node.md)

El node Grist llegeix, escriu i gestiona dades en fulls de càlcul de Grist. Les operacions inclouen getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables i listColumns. Proporcioneu l'ID del document, l'ID de la taula i, per a create/update, les dades del registre mitjançant els ID de columna. Utilitzeu-lo per a CRUD, actualitzacions per lots i automatització de fulls de càlcul.

Vegeu també [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) i [Integracions de tercers](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

El node Google Sheets llegeix, escriu i gestiona dades de fulls de càlcul via OAuth2. Utilitzeu-lo per llegir informes, afegir resultats del workflow, actualitzar seguiments i netejar o inspeccionar pestanyes de fulls des de dins d'un workflow. Com [BigQuery](../nodes/bigquery-node.md), utilitza una credencial d'integració recolzada per Google i encaixa bé al costat de [Grist](../nodes/grist-node.md) quan les dades de fulls de càlcul formen part del flux.

Es combina amb [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) i [Integracions de tercers](./integrations.md).
#### [BigQuery](../nodes/bigquery-node.md)

El node BigQuery executa consultes SQL i insereix files en conjunts de dades de Google BigQuery mitjançant OAuth2. És útil per a workflows d'analítica, pipelines d'informes i l'escriptura de dades d'esdeveniments estructurades provinents d'execucions de workflow. Sovint s'emparella amb [Set](../nodes/set-node.md) per donar forma a les files i amb [Google Sheets](../nodes/google-sheets-node.md) per a informes més lleugers orientats a fulls de càlcul.

S'emparella amb [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) i [Third-Party Integrations](./integrations.md).

#### [Google Drive](../nodes/google-drive-node.md)

El node Google Drive llista, descarrega, actualitza i elimina fitxers i carpetes de Drive mitjançant OAuth2, i pot copiar un fitxer de Drive directament a [Heym Drive](../nodes/drive-node.md) amb la seva operació `syncToHeymDrive`. Google Docs, Sheets i Slides no tenen bytes descarregables, de manera que el node els exporta automàticament — Docs a PDF, Sheets a XLSX, Slides a PPTX — amb una opció per sobreescriure el format de destinació. Les eliminacions mouen els elements a la paperera de Drive tret que s'habiliti "Delete permanently", i el node es nega a eliminar una carpeta mitjançant l'operació de fitxer o viceversa. Com [Google Sheets](../nodes/google-sheets-node.md), utilitza una credencial OAuth2 de Google; tingueu en compte que aquesta sol·licita accés complet a Drive, així que reviseu [Credential Sharing](./credentials-sharing.md) abans de compartir-la.

S'emparella amb [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) i [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

El node GitHub proporciona 40 accions natives de GitHub REST que cobreixen repositoris, organitzacions i usuaris, issues, pull requests, revisions, releases, workflows d'Actions, informació de trànsit i fitxers de repositori. Utilitzeu-lo per al triatge d'issues, l'automatització de revisions, el despatx de workflows i l'espera de finalització, l'automatització de releases i les actualitzacions de fitxers de repositori sense construir manualment sol·licituds HTTP. Admet GitHub.com i un `base_url` opcional de GitHub Enterprise a la credencial.

S'emparella amb [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) i [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

El node Jira connecta workflows amb les API REST de Jira Cloud o Jira Data Center / Server per a l'automatització de projectes, issues, comentaris, adjuncions, usuaris, notificacions i transicions. Pot llistar projectes, cercar issues amb JQL, crear o actualitzar issues, inspeccionar changelogs, notificar les parts interessades, gestionar comentaris i adjuncions, obtenir o gestionar usuaris, llistar les transicions disponibles i moure issues mitjançant un ID de transició. Utilitzeu una credencial de Jira amb correu electrònic d'Atlassian, token d'API, URL base del lloc i mode de desplegament.

S'emparella amb [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) i [Third-Party Integrations](./integrations.md) per a l'entrada de sol·licituds de suport, el triatge d'errors i workflows de release.

#### [Linear](../nodes/linear-node.md)

El node Linear connecta workflows amb l'API GraphQL de Linear per a l'automatització d'espais de treball i issues. Pot llistar equips, projectes, issues, estats de workflow, membres d'equip i comentaris; crear, actualitzar, eliminar i enllaçar issues; i crear, actualitzar, resoldre, tornar a obrir o eliminar comentaris. Utilitzeu una clau d'API personal de Linear o una credencial OAuth2, i després descobriu els UUID d'equip, projecte, estat i assignat a partir de les operacions de llistat abans de crear o actualitzar issues.

S'emparella amb [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) i [Third-Party Integrations](./integrations.md) per a workflows d'entrada, triatge i backlog d'enginyeria.

#### [Supabase](../nodes/supabase-node.md)

El node Supabase llegeix i modifica taules exposades a través de Supabase PostgREST. Funciona bé per a backends de producte, dades d'usuari/perfil, estat de workflow i automatitzacions d'estil CRUD que volen accés a la base de dades sense cablejar sol·licituds HTTP personalitzades.

S'emparella amb [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) i [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

El node ClickHouse executa operacions CRUD, de recompte i SQL en cru contra una base de dades ClickHouse externa a través de la seva interfície HTTP. És adequat per a pipelines d'analítica, registre d'esdeveniments i workflows d'informes: inseriu esdeveniments a mesura que es produeixen i, després, agregueu-los o compteu-los amb `query`/`count`. Replica el conjunt d'operacions de [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) més una via d'escapament SQL en cru, amb `update`/`remove` executant-se com a mutacions de ClickHouse.

S'emparella amb [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) per a informes programats i [Third-Party Integrations](./integrations.md).
#### [Notion](../nodes/notion-node.md)

El node Notion gestiona bases de dades, fonts de dades, pàgines i blocs de Notion mitjançant l'API actual de Notion (`2026-03-11`). Admet cerca, operacions CRUD de pàgines, operacions de bases de dades i fonts de dades, blocs fills, afegir/actualitzar/eliminar blocs, i paperera/restauració. Utilitzeu un token d'integració interna o una credencial OAuth d'integració pública de Notion. L'editor pot cercar i paginar amb cursor les fonts de dades i pàgines pare accessibles. Les credencials compartides funcionen igual que les credencials pròpies per a l'execució de workflows.

Per a crides REST personalitzades, `$credentials.YourNotionCredential` es resol al mateix bearer token. S'emparella amb [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) i [Third-Party Integrations](./integrations.md).

#### [Sentry](../nodes/sentry-node.md)

El node Sentry automatitza organitzacions, projectes, equips, incidències, esdeveniments i versions de Sentry mitjançant l'API REST de Sentry. Utilitzeu-lo per al triatge d'alertes, l'actualització de l'estat d'incidències, l'automatització de versions, la consulta d'esdeveniments i la configuració o neteja de projectes i equips. Admet Sentry SaaS i Sentry autoallotjat mitjançant una URL base de credencial opcional.

S'emparella amb [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) i [Third-Party Integrations](./integrations.md) per a workflows d'incidents i versions.

#### [DataTable](../nodes/datatable-node.md)

El node DataTable llegeix, escriu i gestiona dades a les Taules de dades de Heym (emmagatzematge estructurat propi). Les operacions inclouen find, getAll, getById, insert, update, remove i upsert. No calen credencials externes. Les taules es gestionen des de la pestanya de Taula de dades del tauler [DataTable](../tabs/datatable-tab.md) i hi accedeix directament el propietari del workflow.

S'emparella amb [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) i la [pestanya DataTable](../tabs/datatable-tab.md) per a l'emmagatzematge estructurat propi.

#### [Drive](../nodes/drive-node.md)

El node Drive gestiona fitxers generats per skills directament des d'un workflow. Les operacions inclouen delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams i unshareWithMyTeams per a la gestió d'accés d'equip de només lectura; la conversió de format es troba al node [Converter](../nodes/converter-node.md). Referencieu el fitxer amb `$agentLabel._generated_files[0].id`; les sortides inclouen status, file_id, updated download_url per a restriccions d'enllaç i shared_team_count per a la compartició amb equips. Això és especialment útil amb workflows de [Agent Node](../nodes/agent-node.md) que utilitzen [File Generation](./file-generation.md) i el model de referència de [Drive](./drive.md).

Els acompanyants habituals són [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) i [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

El node Amazon S3 executa operacions d'emmagatzematge d'objectes a Amazon S3 mitjançant una credencial `s3` (clau d'accés, clau secreta, regió, token de sessió opcional). Les operacions inclouen putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder i listBuckets. S'admet la càrrega de text i la descàrrega de text o base64, amb els camps bucket i key que accepten [Expression DSL](./expression-dsl.md). Utilitzeu-lo per emmagatzemar sortides de workflows, arxivar fitxers i llegir objectes de tornada a un flux.

S'emparella amb [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) i [Third-Party Integrations](./integrations.md).

### Automatització

#### [Crawler](../nodes/crawler-node.md)

El node Crawler extreu contingut de pàgines web mitjançant FlareSolverr amb extracció HTML opcional a través de selectors CSS. Configureu una [credencial](./credentials.md) de FlareSolverr, una expressió d'URL, un temps d'espera i selectors opcionals per a l'extracció. La sortida és l'HTML en brut o el contingut extret. Utilitzeu-lo per a l'extracció web i l'extracció de contingut.

S'emparella amb [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) i [LLM](../nodes/llm-node.md) per a fluxos d'extracció i anàlisi.

#### [Playwright](../nodes/playwright-node.md)

El node Playwright automatitza interaccions amb el navegador amb passos configurables (navigate, refresh, click, type, screenshot, extract, aiStep) o el mode **Run Code** per a Playwright Python personalitzat (en sandbox; desactivat per defecte mitjançant `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Admet el mode headless, una configuració opcional que redueix els senyals comuns d'automatització de Playwright, temps d'espera, captura de xarxa opcional (responses, cookies, localStorage, sessionStorage), arrencada d'autenticació mitjançant cookie/storageState a partir d'expressions de [Global Variables](./global-variables.md) com ara `$global.authState`, passos d'inici de sessió de reserva quan falla la restauració d'autenticació, i un pas d'IA amb Auto Heal quan fallen els selectors. Utilitzeu-lo per a l'extracció web, l'ompliment de formularis i workflows basats en navegador.

Vegeu també [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) i [Execution History](./execution-history.md) per a l'automatització de navegador i la depuració.

### Utilitats
#### [Output](../nodes/output-node.md)

El node Output és l'endpoint del workflow que retorna la resposta al sol·licitant. Establiu l'expressió del missatge per fer referència al node anterior mitjançant l'etiqueta (no utilitzeu mai `$input` del node [Input](../nodes/input-node.md) aquí). L'opció asíncrona descendent opcional permet que els nodes posteriors a l'output s'executin en segon pla després d'enviar la resposta.

Les fonts ascendents habituals són [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) i [Execute](../nodes/execute-node.md); la configuració de la resposta és més fàcil de depurar al [Diàleg d'avaluació d'expressions](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

El node JSON output mapper construeix un objecte JSON pla a partir de mapatges clau-valor a l'estil de [Set](../nodes/set-node.md) i el retorna a l'arrel de la resposta del workflow. Utilitzeu-lo quan un sol·licitant d'API hagi de rebre un cos JSON en cru en lloc de l'embolcall estàndard del node [Output](../nodes/output-node.md).

#### [HTML output mapper](../nodes/html-output-mapper-node.md)

El node HTML output mapper renderitza una única plantilla HTML, interpolant expressions `$nodeLabel.field` a la pàgina. Quan és l'únic node terminal del workflow, el webhook d'execució respon amb `text/html` i el codi d'estat configurat del node en lloc d'un cos JSON, de manera que un workflow pot servir una pàgina directament a un navegador. Envieu `X-Simple-Response: false` per obtenir el sobre JSON habitual per a la depuració.

Es combina amb [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) i [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

El node Chart Output és el node terminal del workflow d'un giny del [Dashboard](../tabs/dashboard-tab.md). Converteix les files produïdes pels nodes ascendents en un payload de gràfic estandarditzat que el dashboard renderitza. Trieu un `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, Gantt, entity relationships, text o HITL), mapeu `labelField`/`valueField` (o `series` per a múltiples sèries, o `text` per a un missatge markdown) i col·loqueu-lo al final; no té aresta de sortida. Gantt llegeix files de tasques amb dates d'inici/fi ISO, progrés i identificadors de dependència. Entity relationships llegeix un objecte de graf amb entitats, camps, claus PK/FK i relacions. Tots dos es renderitzen també a les pàgines de Heym Work i a les previsualitzacions de propostes de widgets. HITL ignora les files ascendents i llista les vostres revisions humanes pendents. i una altra com a botons d'enllaç que obren un URL en una nova pestanya (`linkColumn`, amb `linkLabel` per al text del botó)

Vegeu també [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) i [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

El node Wait posa en pausa l'execució del workflow durant una durada especificada en mil·lisegons, fins a 15 minuts. Utilitzeu-lo per a la limitació de taxa, accions ajornades o intervals d'enquestació. Passa l'entrada sense modificar-la.

Es combina amb [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) i [Parallel Execution](./parallel-execution.md) per al ritme i l'enquestació.

#### [Sticky Note](../nodes/sticky-note-node.md)

El node Sticky Note afegeix notes markdown al canvas. No s'executa. Utilitzeu-lo per a documentació, instruccions o notes del workflow juntament amb altres [Canvas Features](./canvas-features.md). Feu doble clic al canvas per editar el contingut de la nota.

Vegeu també [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) i [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

El node Console Log registra un valor a la consola del backend (servidor). Utilitzeu-lo per a la depuració i la inspecció durant el desenvolupament. El missatge de registre admet expressions del [Expression DSL](./expression-dsl.md); la sortida passa l'entrada sense modificar-la.

Es combina amb [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) i [Diàleg d'avaluació d'expressions](./expression-evaluation-dialog.md) per a la depuració.

#### [Disable Node](../nodes/disable-node.md)

El node Disable Node desactiva permanentment un altre node del workflow establint el seu indicador `active` a false. Especifiqueu el node objectiu mitjançant l'etiqueta. Utilitzeu-lo per a operacions puntuals, com ara aturar un trigger [Cron](../nodes/cron-node.md) un cop es compleixi una condició.

Vegeu també [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) i [Cron](../nodes/cron-node.md) per als patrons de control del workflow.

#### [Enable Node](../nodes/enable-node.md)

El node Enable Node torna a activar un altre node establint el seu indicador `active` a true i desant el canvi. Especifiqueu el node objectiu mitjançant l'etiqueta. Utilitzeu-lo per tornar a armar un trigger [Cron](../nodes/cron-node.md) desactivat des d'un altre punt d'entrada, o per activar un node un cop es compleixi una condició. Un objectiu que es troba aigües avall del Enable Node i que encara no s'ha executat també s'executa en l'execució actual.

Vegeu també [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) i [Cron](../nodes/cron-node.md) per als patrons de control del workflow.
#### [Throw Error](../nodes/throw-error-node.md)

El node Throw Error atura immediatament l'execució del workflow i retorna una resposta d'error amb un codi d'estat HTTP personalitzat. Configureu l'expressió del missatge d'error i el codi d'estat (per exemple, 400, 401, 403, 404, 429, 500). Utilitzeu-lo per a errors de validació, accessos no autoritzats o altres condicions d'error, especialment quan es combina amb [Condition](../nodes/condition-node.md) i [Error Handler](../nodes/error-handler-node.md).

Es combina amb [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) i [Security](./security.md) per a camins de fallada explícits.

---

## Referència

### [Tipus de node](./node-types.md)

Heym ofereix una varietat de tipus de node: triggers com ara [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) i [Error Handler](../nodes/error-handler-node.md); nodes d'IA com ara [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) i [MCP Call](../nodes/mcp-call-node.md); nodes de lògica com ara [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) i [Loop](../nodes/loop-node.md); nodes de dades com ara [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) i [Heym](../nodes/heym-node.md); integracions com ara [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) i [Drive](../nodes/drive-node.md); nodes d'automatització com ara [Crawler](../nodes/crawler-node.md) i [Playwright](../nodes/playwright-node.md); i utilitats com ara [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) i [Sticky Note](../nodes/sticky-note-node.md). Utilitzeu expressions com `$input.text` i `$nodeLabel.field` a la configuració dels nodes.

Vegeu també [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) i [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym utilitza un llenguatge d'expressions senzill per referenciar dades de nodes anteriors. Utilitzeu `$input` per al node [Input](../nodes/input-node.md), `$nodeLabel.field` per a qualsevol node anterior, `$credentials.CredentialName` per a les [credencials](./credentials.md) i `$global.variableName` per a les [variables globals](./global-variables.md). Les variables especials integrades inclouen `$now`, `$UUID` i metadades del workflow: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` i `$executionId` (l'id d'[Execution History](./execution-history.md) de l'execució — `/workflows/{id}/{executionId}` obre aquesta execució al canvas; només en temps d'execució, buit al diàleg de previsualització d'expressions). El suport inclou literals, aritmètica, comparacions, context de [Loop](../nodes/loop-node.md), camps niats i ajudants de cadena/matriu (incloent-hi `$text.toJson()` per analitzar una cadena JSON). Quan el valor complet és un únic `$expr`, el backend preserva matrius, objectes, booleans i nombres com a tipus natius.

Vegeu també [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) i [Workflow Structure](./workflow-structure.md).
### [Variables globals](./global-variables.md)

El Magatzem de variables globals conté dades persistents de tipus clau-valor, abastades per usuari, que sobreviuen entre execucions de workflow. Creeu variables des de la pestanya [Variables](../tabs/global-variables-tab.md) o des d'un node [Variable](../nodes/variable-node.md) amb l'opció "Store in Global Variable Store" activada. Accediu-hi amb `$global.variableName` a les expressions; es poden compartir amb altres usuaris o [equips](./teams.md).

Es combina amb [Variable](../nodes/variable-node.md), [Equips](./teams.md) i [Compartició de credencials](./credentials-sharing.md) per a l'estat compartit del workflow.

### [Diàleg d'avaluació d'expressions](./expression-evaluation-dialog.md)

El Diàleg d'avaluació d'expressions és un editor expandible que apareix quan feu clic al botó d'expansió que hi ha al costat dels camps d'expressió. S'obre com un modal gran centrat, manté l'autocompletat actiu i actualitza automàticament la sortida de previsualització del backend després que deixeu d'escriure. Els resultats d'objectes i arrays es poden explorar amb el selector de camí de sortida. El diàleg accepta un camí de punt sense prefix en línia completa (per exemple `myNode.output.field`) com si fos `$myNode.output.field`; consulteu les regles de col·locació de l'[Expression DSL](./expression-dsl.md).

El botó **Build with AI** de la barra d'eines us permet descriure l'expressió que voleu en text pla. Seleccioneu una [credencial](./credentials.md) i un model d'LLM, escriviu una descripció com ara *"Get the customer name from the API response"* i feu clic a Generate. El backend envia el context de l'[Expression DSL](./expression-dsl.md) i les sortides de l'última execució dels nodes al model i retorna una única cadena d'expressió. El resultat s'avalua immediatament perquè el pugueu verificar abans de fer clic a Apply.

Es combina de manera natural amb l'[Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) i el [mapador de sortida JSON](../nodes/json-output-mapper-node.md).

### [Estructura del workflow](./workflow-structure.md)

Els workflows s'emmagatzemen com a JSON amb nodes i arestes. L'objecte del workflow inclou id, name, description, nodes, edges i paràmetres d'autenticació. Cada node té id, type, position i data (label i configuració específica del tipus). Les arestes connecten els IDs dels nodes d'origen i de destinació amb IDs de handle opcionals. La sintaxi d'expressió als camps de data segueix l'[Expression DSL](./expression-dsl.md), i aquesta mateixa estructura s'utilitza a [Baixada i importació](./download-import.md).

Vegeu també [Tipus de node](./node-types.md), [Expression DSL](./expression-dsl.md) i [Baixada i importació](./download-import.md).

### [Funcions del canvas](./canvas-features.md)

Passeu el cursor per sobre de qualsevol node del canvas que no sigui un sticky i feu clic a **Run** per executar fins a aquest node. Les entrades requerides s'obren al tauler Run amb el primer camp enfocat; els camins sense entrades s'inicien immediatament. Vegeu [Executar fins al node](./canvas-features.md#run-to-node).

L'editor de workflows ofereix Data Pin (fixa l'última sortida d'un node per provar els nodes posteriors sense tornar a executar), Registres d'execució (resultats dels nodes en temps real i progrés de l'agent que complementen l'[Historial d'execucions](./execution-history.md)), Habilitar/Deshabilitar (omet nodes durant l'execució) i Extreure a sub-workflow (mou una selecció a un workflow nou i la substitueix per un node [Execute](../nodes/execute-node.md)). Una execució de producció en curs es pot obrir des de l'Historial o des d'una targeta del Tauler; l'editor restaura la seva instantània actual, es connecta a SSE i manté l'animació del canvas i els registres de Debug en directe. Les [Dreceres de teclat](./keyboard-shortcuts.md) admeten copiar, enganxar, executar i la cerca de nodes en línia.

Vegeu també [Dreceres de teclat](./keyboard-shortcuts.md), [Historial d'edicions](./edit-history.md) i [Historial d'execucions](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Dreceres de teclat](./keyboard-shortcuts.md)

Heym ofereix dreceres a tot l'editor: Paleta d'ordres (Ctrl+K), Executar (Ctrl+Enter), Desar (Ctrl+S), Desfer/Refer i Escape per tancar. Al canvas: seleccionar-ho tot, selecció múltiple, copiar/retallar/enganxar, suprimir, alternar node habilitat (D), alternar dades fixades (P) i cerca de nodes en línia escrivint. Les dreceres estan documentades a la referència integrada de l'aplicació i funcionen estretament amb les [Funcions del canvas](./canvas-features.md), com ara Data Pin i l'habilitació/deshabilitació de nodes.

Vegeu també [Funcions del canvas](./canvas-features.md), [Calaix ràpid](./quick-drawer.md) i [Aparador contextual](./contextual-showcase.md).
### [Assistent d'IA](./ai-assistant.md)

L'Assistent d'IA és un panell de Chat obert des del panell de Depuració que permet crear o modificar Workflows amb llenguatge natural. Seleccioneu una [credencial](./credentials.md) i un model, i després descriviu què voleu; la IA transmet una resposta i qualsevol [workflow JSON](./workflow-structure.md) vàlid dins d'un bloc de codi s'analitza automàticament i s'aplica al Canvas. L'entrada de veu és compatible amb navegadors compatibles.

Activeu el **mode YOLO** (mode Agent, desactivat per defecte) i l'assistent prova allò que construeix. Després de cada canvi, executa el Workflow al Canvas, llegeix el resultat i corregeix el Workflow fins que fa el que heu demanat, durant un màxim de 5 execucions per missatge. Demana entrades de prova abans de la primera execució, pot executar els vostres altres Workflows quan necessita el seu resultat, i mostra cada pas mentre treballa. Vegeu [Assistent d'IA › Mode YOLO](./ai-assistant.md#yolo-mode).

Feu clic a **AI** sobre qualsevol node al canvas per canviar o reparar només aquest node. El tauler mostra el node que s'està modificant (amb el seu darrer resultat un cop executat) i ofereix **Change this node as ...**, **Fix error in this node ...** i **Other**. Només s'actualitza aquest node; la resta del workflow i la disposició romanen inalterats. Vegeu [AI Assistant › Modificar un sol node](./ai-assistant.md#changing-one-node).

Quan un Workflow emmagatzema registres, l'assistent pregunta quina [taula de dades](../tabs/datatable-tab.md) utilitzar, o en crea una amb les columnes que el Workflow necessita. Vegeu [Assistent d'IA › Taules de dades](./Chat i MCP `heym_chat` també poden editar columnes i files directament amb accés de propietari o d'escriptura, amb confirmació abans de suprimir columnes o buidar totes les files. Chat i MCP `heym_chat` també poden editar columnes i files directament amb accés de propietari o d'escriptura, amb confirmació abans de suprimir columnes o buidar totes les files. ai-assistant.md#data-tables).

Quan el Workflow actual conté habilitats del [Node Agent](../nodes/agent-node.md), l'assistent envia només el `SKILL.md` de cada habilitat dins del context del Workflow. Els fitxers `.py` adjunts i els actius binaris d'habilitats s'exclouen abans de la sol·licitud perquè els paquets d'habilitats grans no desbordin la finestra de context del model.

Es combina bé amb [Chat with Heym](./chat-with-heym.md), [Arquitectura d'Agents](./agent-architecture.md) i [Expression DSL](./expression-dsl.md).

### [Chat with Heym](./chat-with-heym.md)

Chat with Heym és un assistent de capçalera de documentació per a preguntes sobre el producte. S'obre en un diàleg centrat, manté la selecció de credencials i model visible a la part superior, injecta la ruta de la pàgina de documentació activa com a context i esborra l'historial de missatges quan es tanca el diàleg. Complementa l'[Assistent d'IA](./ai-assistant.md) més ampli i el [Contextual Showcase](./contextual-showcase.md) més lleuger.

Vegeu també [Assistent d'IA](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) i [Tipus de Nodes](./node-types.md).

### [Organització de Workflows](./workflow-organization.md)

Els administradors d'instància (`HEYM_ADMIN_EMAILS`) poden accedir i editar tots els Workflows, trobar els Workflows d'un propietari per correu electrònic, inspeccionar les programacions i l'historial d'execucions, pausar i reprendre Triggers automàtics, i eliminar Workflows un cop les execucions s'estabilitzen. Vegeu [Administració d'Instància](../tabs/workflows-tab.md#instance-administration) per al flux de desvinculació i la distinció entre pausar Triggers automàtics i bloquejar totes les crides.

Els Workflows es poden organitzar en carpetes i subcarpetes en una estructura d'arbre. Les carpetes tenen noms i un pare opcional; els Workflows s'assignen a carpetes. Els Workflows es poden programar per a la seva eliminació (traslladats a una àrea de paperera abans de l'eliminació permanent). L'API admet crear, actualitzar, eliminar i moure Workflows entre carpetes, i el mateix model d'organització apareix a la pestanya [Workflows](../tabs/workflows-tab.md).

Vegeu també [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) i [Historial d'edicions](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

El Quick Drawer és un panell fix d'execució ràpida a la part dreta per a pàgines internes que no són del Canvas. Permet cercar [Workflows](../tabs/workflows-tab.md), fixar preferits, seleccionar entrades, executar immediatament i inspeccionar el progrés o els resultats sense obrir l'editor. Un Workflow amb un [File Upload Trigger](../nodes/file-upload-trigger-node.md) admet un fitxer deixat anar o seleccionat. L'ordre dels fixats i l'últim Workflow seleccionat s'emmagatzemen al navegador.

Vegeu també [Organització de Workflows](./workflow-organization.md), [Dreceres de teclat](./keyboard-shortcuts.md) i [Historial d'execucions](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

El Contextual Showcase és una guia compacta integrada a l'aplicació per a les superfícies principals autenticades, com ara les pestanyes del tauler, [Avaluacions](../tabs/evals-tab.md), Docs i l'editor de Workflows. Roman tancat per defecte, ofereix primer un resum breu de la pàgina, proporciona una mica de detall addicional sota demanda i enllaça a l'article complet de documentació quan voleu una guia més profunda.

Es combina amb [Chat with Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) i [Assistent d'IA](./ai-assistant.md) per als fluxos de guia integrats a l'aplicació.

### [Credencials](./credentials.md)

Les Credencials emmagatzemen claus d'API i secrets utilitzats pels nodes del Workflow. Afegiu-les a la pestanya [Credencials](../tabs/credentials-tab.md) i referencieu-les pel nom o ID en nodes com ara [LLM](../nodes/llm-node.md), [Node Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) i [Redis](../nodes/redis-node.md). S'encripten en repòs, es poden compartir amb usuaris o [equips](./teams.md), i també es poden referenciar a [Expression DSL](./expression-dsl.md) mitjançant `$credentials.Name`.

Vegeu també [Credencials](../tabs/credentials-tab.md), [Compartició de Credencials](./credentials-sharing.md) i [Integracions de tercers](./integrations.md).
### [Compartició de credencials](./credentials-sharing.md)

Les credencials es poden compartir amb altres usuaris per correu electrònic o amb equips; tots els membres de l'equip obtenen accés quan es comparteix una credencial amb un equip. Les credencials compartides apareixen amb un indicador a la pestanya [Credencials](../tabs/credentials-tab.md). En temps d'execució, el context del propietari del workflow fusiona les credencials pròpies, les compartides per usuaris i les compartides per equips. Utilitzeu `$credentials.CredentialName` en expressions o establiu credentialId a les dades del node.

Vegeu també [Credencials](./credentials.md), [Equips](./teams.md) i [Integracions de tercers](./integrations.md).

### [Equips](./teams.md)

Els equips permeten compartir workflows, credencials, variables globals, magatzems vectorials i fitxers de Drive amb un grup d'usuaris alhora. Creeu equips des de la pestanya [Equips](../tabs/teams-tab.md) i afegiu membres per correu electrònic. Compartiu recursos amb un equip des dels diàlegs de compartició corresponents; tots els membres tindran accés. El creador pot editar i eliminar l'equip; eliminar un equip suprimeix totes les comparticions de l'equip.

Es combina amb [Compartició de credencials](./credentials-sharing.md), [Variables globals](./global-variables.md) i [Empresa](./enterprise.md).

### [Execució paral·lela](./parallel-execution.md)

Heym executa nodes en paral·lel quan no tenen dependències entre si. L'executor construeix un DAG i executa nodes del mateix nivell de manera concurrent amb un pool de fils; tan bon punt un node finalitza, els seus nodes descendents es planifiquen. Utilitzeu el node [Merge](../nodes/merge-node.md) per combinar branques paral·leles quan calgui. Diverses execucions de workflow s'executen de manera concurrent; cada execució està aïllada. El mode [SSE Streaming](./sse-streaming.md) emet esdeveniments a mesura que els nodes es completen.

Vegeu també [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) i [Historial d'execucions](./execution-history.md).

### [Arquitectura d'agents](./agent-architecture.md)

El [Node Agent](../nodes/agent-node.md) admet subagents (l'orquestrador crida altres nodes agent mitjançant call_sub_agent), subworkflows (l'agent crida altres workflows mitjançant call_sub_workflow), skills (contingut d'instruccions i eines Python des de .zip o .md) i connexions de client [MCP](../tabs/mcp-tab.md). L'executor d'eines de l'orquestrador encamina les crides a subagents i subworkflows; la resta d'eines van a executors de Python, MCP o skills. La profunditat màxima d'imbricació per a subagents i subworkflows és 5. El bucle de crida d'eines inclou compressió automàtica de context: abans de cada iteració, s'estima l'ús de tokens i, si supera el 80% de la finestra de context del model, els missatges intermedis se sintetitzen utilitzant el mateix model, mantenint intactes el prompt del sistema, el primer missatge d'usuari i l'últim missatge d'usuari.

Vegeu també [Node Agent](../nodes/agent-node.md), [Memòria persistent d'agents](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) i [MCP](../tabs/mcp-tab.md).

### [Memòria persistent d'agents](./agent-persistent-memory.md)

Graf de coneixement opcional per [Node Agent](../nodes/agent-node.md) emmagatzemat a Postgres: entitats, tipus, propietats i relacions dirigides. Quan `persistentMemoryEnabled` és true, el graf se sintetitza al prompt del sistema a cada execució; després de complecions correctes, un [LLM](../nodes/llm-node.md) extreu actualitzacions estructurades en segon pla. El CRUD REST es troba sota `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. L'editor s'obre des del control de cervell rosa del node.

Vegeu també [Node Agent](../nodes/agent-node.md), [Arquitectura d'agents](./agent-architecture.md) i [Execucions](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-Loop permet que un [Node Agent](../nodes/agent-node.md) sol·liciti aprovació en punts de control específics, creï una pàgina pública `/review/{token}` i esperi que un revisor no autenticat accepti, editi o rebutgi el text de revisió en Markdown. Els agents amb HITL habilitat també exposen una sortida `review` perquè pugueu notificar [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) o altres canals mentre l'execució està pendent. El text HITL a nivell de node s'utilitza com a directrius d'aprovació, mentre que el resum de la pàgina pública es genera a partir de la pròpia sol·licitud de revisió. Les execucions pendents apareixen a l'[Historial d'execucions](./execution-history.md) immediatament, poden produir-se més d'una vegada en la mateixa execució i es reprenen des de l'instantània exacta del workflow emmagatzemada un cop es tramet cada decisió.

Vegeu també [Node Agent](../nodes/agent-node.md), [Portal](./portal.md), [Historial d'execucions](./execution-history.md) i [Send Email](../nodes/send-email-node.md).
### [Webhooks](./webhooks.md)

Els workflows es poden iniciar mitjançant [HTTP](../nodes/http-node.md) a `POST /api/workflows/{workflow_id}/execute`, o bé transmetre's de manera incremental des de `POST /api/workflows/{workflow_id}/execute/stream`. El cos de la sol·licitud es passa com a body als nodes [Input](../nodes/input-node.md); les capçaleres i els paràmetres de consulta estan disponibles a les expressions de l'[Expression DSL](./expression-dsl.md). Configureu l'autenticació per workflow: anònima, JWT o capçalera personalitzada. L'emmagatzematge en memòria cau de respostes opcional, la limitació de taxa i el diàleg **Run with cURL** de l'editor resideixen al workflow i s'apliquen a tots dos modes. Amb un [límit de concurrència](./webhooks.md#concurrency-limit-and-queued-runs), una crida que ha d'esperar rep `202 Accepted` amb un identificador d'execució i un URL d'estat en el seu lloc.

Vegeu també [Input](../nodes/input-node.md), [Execution Tokens](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) i [Workflow Structure](./workflow-structure.md).

### [Execution Tokens](./execution-tokens.md)

Els execution tokens són JWT amb abast que concedeixen accés als endpoints execute i stream d'un únic workflow. Quan un workflow utilitza autenticació JWT, els tokens permeten que scripts externs, pipelines de CI i integracions cridin el workflow sense compartir una sessió d'usuari. Cada token porta una reclamació `wid` que el fixa a un workflow, un `jti` utilitzat per a la revocació instantània i un TTL configurable (de 60 segons a 10 anys). Creeu, seleccioneu i revoqueu tokens directament des del diàleg **Run with cURL**: el token seleccionat s'incrusta automàticament a l'ordre generada.

Vegeu també [Webhooks](./webhooks.md), [Security](./security.md) i [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

El diàleg de cURL pot canviar l'execució del [webhook](./webhooks.md) al mode Server-Sent Events. Això produeix esdeveniments `execution_started`, `node_start`, `node_complete` i `execution_complete` en temps real, afegeix `--no-buffer` a l'ordre cURL generada i us permet configurar missatges d'inici per node, com ara `[START] LLM` o text personalitzat per a consumidors de terminal externs.

Vegeu també [Webhooks](./webhooks.md), [Execution History](./execution-history.md) i [LLM](../nodes/llm-node.md).

### [Triggers](./triggers.md)

Els workflows s'inicien mitjançant nodes trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), recepció de [RabbitMQ](../nodes/rabbitmq-node.md)) o punts d'entrada: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), planificador Cron, webhook de Telegram, webhook d'interacció de Discord, gestor de triggers IMAP, consumidor de RabbitMQ o execució de l'editor. Cada trigger té el seu propi endpoint o procés en segon pla; [Cron](../nodes/cron-node.md) s'executa cada 60 segons, els nodes [Telegram Trigger](../nodes/telegram-trigger-node.md) reben webhooks del bot, els nodes [Discord Trigger](../nodes/discord-trigger-node.md) reben webhooks d'interacció signats i els nodes [IMAP Trigger](../nodes/imap-trigger-node.md) s'executen segons el seu interval d'enquestació configurat. Els nodes [Input](../nodes/input-node.md) reben body, capçaleres i consulta de les sol·licituds de webhook.

Vegeu també [Node Types](./node-types.md), [Webhooks](./webhooks.md) i [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

L'historial d'execucions registra les execucions dels workflows: entrades, sortides, resultats dels nodes, estat i origen del trigger. Hi podeu accedir des de la barra d'eines de l'editor, la vista Docs, la capçalera del Dashboard o la vista [Evals](../tabs/evals-tab.md). L'historial per workflow mostra les execucions del workflow obert; la vista de tot l'historial mostra les execucions de tots els workflows i del chat. Les execucions en curs apareixen a la part superior de tots dos diàlegs amb les accions **Open live** i **Cancel**. Open live adjunta l'editor a l'execució existent mitjançant [SSE](./sse-streaming.md), restaura els nodes completats, fa parpellejar els nodes actuals i pendents i afegeix registres de Debug sense iniciar una altra execució. Bring to Canvas carrega les entrades i les sortides dels nodes d'una execució completada per tornar-la a executar o depurar-la; l'enllaç profund `/workflows/{workflowId}/{executionId}` admet tant execucions en directe com completades. Les execucions pausades per [Human-in-the-Loop](./human-in-the-loop.md) s'emmagatzemen immediatament com a `pending`, incloent-hi l'URL de revisió pública i qualsevol node de notificació executat des de la branca `review` de l'agent. Si el servidor es reinicia a mig executar, les execucions interrompudes es recuperen automàticament: es tornen a executar des de zero amb les mateixes entrades i es mostren com a completades (marcades com a **Recovered**), controlat per un commutador **Auto-recover runs** per workflow que, en cas contrari, pot registrar-les com a `skipped`.

Vegeu també [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) i [Traces](../tabs/traces-tab.md).
### Destacats d'execució

Després d'una execució en directe —o després de **Bring to Canvas**— apareix una finestra emergent **Execution Highlights** descartable a la part superior dreta del Canvas, que llista què ha produït cada node en ordre d'execució. És una manera ràpida d'inspeccionar la sortida de cada node sense obrir-los un per un; tanqueu-la amb la **✕** i es tornarà a obrir a la propera execució. Els destacats també es mostren a les execucions del tauler. Consulteu [Execution History](./execution-history.md) per obtenir més informació.

### [Edit History](./edit-history.md)

Edit History fa un seguiment de les versions desades d'un workflow (cada desada crea una versió). Visualitzeu la llista, obriu una versió per veure'n les diferències respecte del workflow actual ([nodes](./workflow-structure.md), arestes, configuració) i feu servir Revert per restaurar una versió anterior. A diferència de [Execution History](./execution-history.md), Edit History fa un seguiment dels canvis d'estructura, no de les execucions.

Vegeu també [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) i [Canvas Features](./canvas-features.md).

### Workflow d'error

Un workflow pot designar un altre workflow perquè s'executi quan falli. Configureu-ho al tauler **Properties** a nivell de workflow (que es mostra quan no hi ha cap node seleccionat), a **On error, run workflow**. Només el propietari del workflow pot establir-lo, modificar-lo o esborrar-lo; consulteu [Owner-only settings](./workflow-organization.md#owner-only-settings). Quan una execució de nivell superior acaba amb un error no gestionat, s'executa el workflow d'error seleccionat i rep el context de l'error (id i nom del workflow que ha fallat, id de l'execució, missatge d'error, etiqueta i tipus del node que ha fallat, i una marca temporal). Si el canvas ja conté un node [Error Handler](../nodes/error-handler-node.md), el gestor local té prioritat i el workflow d'error **no** es crida. El workflow d'error s'executa directament, de manera que mai no activa el seu propi workflow d'error.

Cobreix totes les execucions de nivell superior que no siguin de prova: tots dos endpoints d'execució, el [Portal](./portal.md) i tots els trigger, incloent-hi [cron](../nodes/cron-node.md), els trigger de la plataforma de chat, correu electrònic, cues, [MCP](../tabs/mcp-tab.md) i ginys del tauler. Amb [Load Distribution](./cluster.md) activat, això no canvia, incloent-hi les execucions que ha dut a terme un worker: el node que ha fallat torna amb el resultat, i el workflow d'error es distribueix com qualsevol altra execució, de manera que un node que hi hagi dins i que s'hagi d'executar a la instància principal encara ho fa. Dos casos es deixen deliberadament de banda, perquè el resultat del workflow encara no es coneix: una execució que cap instància no ha dut a terme mai i una espera que ha expirat mentre l'execució encara podia estar en curs. Tampoc **no** s'activa amb les execucions de prova manuals del canvas.

### Timeout del workflow

Cada workflow pot establir un **timeout del workflow** en segons al tauler **Properties** a nivell de workflow. El valor `0` (per defecte) el desactiva. Quan s'estableix, una execució que supera el límit s'atura a la següent frontera de node i es registra com una execució fallida amb un error de "timed out". El timeout s'aplica a les execucions manuals, d'API i activades per trigger. Els nodes [Wait](../nodes/wait-node.md) llargs s'interrompen puntualment en lloc de bloquejar-se durant tota la seva durada.

### Límit de concurrència

Cada workflow pot limitar quantes execucions de producció s'executen alhora amb el **Límit de concurrència** al panell **Properties** a nivell de workflow; el propietari i els col·laboradors amb accés d'edició poden modificar-lo, i està desactivat per defecte. Quan s'arriba al límit, les noves execucions dels endpoints de [webhook](./webhooks.md#concurrency-limit-and-queued-runs) i [streaming](./sse-streaming.md), el [Portal](./portal.md), el [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) i cada [trigger](./triggers.md) esperen en una cua FIFO (primer a entrar, primer a sortir), comptabilitzada a totes les instàncies d'un [clúster](./cluster.md). Les execucions de prova de l'editor, les crides a sub-workflows, les [Evals](../tabs/evals-tab.md) i les represes de revisió mai no es posen a la cua, i les execucions de targetes del [Board](../tabs/board-tab.md), les càrregues de fitxers, les execucions iniciades per l'eina run-workflow de l'assistent d'IA i els workflows de notificació d'alertes s'inicien sense esperar un slot. Una crida de webhook que ha d'esperar rep `202 Accepted` immediatament amb un `execution_id`, un URL d'estat que respon amb les mateixes credencials, la seva posició, la mida de la cua i el recompte d'execucions en curs; un client MCP rep el mateix i sondeja l'eina `heym_execution_status`. L'opció **Mida màxima de la cua** rebutja les crides addicionals amb `429`, i l'opció **Espera màxima** registra una execució que ha esperat massa temps com a `expired`. Les execucions en espera apareixen a l'[Historial d'execucions](./execution-history.md) com a **A la cua n/m** i es poden cancel·lar allà.

### Temps estalviat

Cada workflow pot registrar un **temps estalviat estimat per execució** (en minuts), establert al tauler **Properties** a nivell de workflow. La pestanya [Analytics](../tabs/analytics-tab.md) ho agrega en el rang seleccionat com una estadística total de **Time Saved** (suma de l'estimació de cada workflow × les seves execucions correctes). Most Used també llista aquesta suma per workflow; **Not Set** obre el camp d'estimació quan no està establert. L'informe [Workflow Analysis](./workflow-analysis.md) recomana establir una estimació quan no n'hi ha cap de configurada.

### [Settings](./user-settings.md)

El diàleg Settings (que s'obre des del vostre avatar a la capçalera) té quatre pestanyes: Profile (imatge de Gravatar, nom visible, User Rules), [Security](./security.md) (canvi de contrasenya), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) i Observability (estat de [OpenTelemetry](./opentelemetry.md) de només lectura). Les User Rules són instruccions personalitzades que s'injecten a cada sol·licitud d'IA, incloent-hi el constructor de workflows i el [Chat](../tabs/chat-tab.md), de manera que podeu establir l'idioma, el to, l'estil de codificació o les convencions de workflow una sola vegada. La política de contrasenyes i la gestió de claus d'API de [MCP](../tabs/mcp-tab.md) també estan disponibles.

Vegeu també [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) i [AI Assistant](./ai-assistant.md).
### [Traçabilitat amb OpenTelemetry](./opentelemetry.md)

Heym pot emetre traces d'OpenTelemetry per a cada execució de workflow i execució de node: un span arrel `heym.workflow.execute` per execució i un span fill `heym.node.execute` per node, amb l'ús de model i token adjuntat als nodes LLM i agent. Els spans s'exporten mitjançant OTLP/HTTP a qualsevol backend compatible (Jaeger, Grafana Tempo, Honeycomb, Datadog), i el context de traça W3C es propaga a través de webhooks entrants, HTTP sortints i sub-workflows. La traçabilitat està desactivada per defecte i es configura amb les [variables d'entorn](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*`; l'estat actiu es mostra a la pestanya Observability de [Settings](./user-settings.md).

Vegeu també [Historial d'execucions](./execution-history.md), [Execucions](../tabs/traces-tab.md) i [Webhooks](./webhooks.md).

### [Descàrrega i importació](./download-import.md)

Exporteu el workflow actual com a JSON des de la barra d'eines de l'Editor (botó Download); el fitxer inclou nodes i arestes. Importeu arrossegant un fitxer JSON a la pestanya [Workflows](../tabs/workflows-tab.md) (crea un workflow nou) o al canvas (substitueix o fusiona). El JSON ha d'incloure una matriu de nodes; el nom i les arestes són opcionals. Utilitzeu-ho per a còpies de seguretat, compartició o migració entre instàncies.

Vegeu també [Estructura del workflow](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) i [Funcions del canvas](./canvas-features.md).

### [Portal](./portal.md)

El Portal exposa els workflows com a interfícies de chat públiques a `/chat/{slug}`. Configureu portal_enabled, slug, autenticació opcional (usuaris del portal), streaming i càrrega de fitxers per workflow. Els usuaris finals interactuen mitjançant una interfície de chat sense iniciar sessió a Heym; les sortides d'imatge es poden mostrar al chat. Els workflows del portal també poden derivar a pàgines de revisió de [Human-in-the-Loop](./human-in-the-loop.md) quan un [Node Agent](../nodes/agent-node.md) requereix aprovació, mentre que la branca `review` de l'agent envia notificacions a altres canals. Utilitzeu-ho per a eines internes, chatbots orientats al client i formularis impulsats per IA.

Vegeu també [Human-in-the-Loop](./human-in-the-loop.md), [Node Agent](../nodes/agent-node.md) i [Drive](./drive.md).

### [Generació de fitxers](./file-generation.md)

Les Skills poden generar fitxers com ara PDF, DOCX, CSV, JSON i imatges durant l'execució escrivint a l'espai de treball `_OUTPUT_DIR`. Heym captura aquests fitxers automàticament, els emmagatzema i exposa les metadades de descàrrega sota `_generated_files`, que després es poden gestionar amb el [node Drive](../nodes/drive-node.md) o revisar a la pestanya [Drive](../tabs/drive-tab.md).

Vegeu també [Node Agent](../nodes/agent-node.md), [Drive](./drive.md) i [node Drive](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive és la capa d'emmagatzematge i compartició per als fitxers generats per les Skills. Permet navegar pels fitxers, crear enllaços públics o protegits amb contrasenya, aplicar caducitat i límits de descàrrega, compartir fitxers en mode només lectura amb els vostres equips i gestionar aquests fitxers programàticament amb el [node Drive](../nodes/drive-node.md) o manualment des de la pestanya [Drive](../tabs/drive-tab.md).

Vegeu també [Drive](../tabs/drive-tab.md), [Generació de fitxers](./file-generation.md) i [Portal](./portal.md).

### [Seguretat](./security.md)

Heym aplica una política de contrasenyes (longitud, majúscules, minúscules, dígits), emmagatzema els tokens d'accés en cookies HttpOnly i rota els tokens de refresc en usar-los. La limitació de velocitat s'aplica a l'inici de sessió, el registre i l'inici de sessió del [Portal](./portal.md). Les [Credencials](./credentials.md) s'encripten en repòs amb AES-256 (Fernet). La clau API de [MCP](../tabs/mcp-tab.md) s'utilitza per a l'autenticació de clients; la seguretat del contingut està disponible mitjançant [Guardrails](./guardrails.md) als nodes [LLM](../nodes/llm-node.md) i [Node Agent](../nodes/agent-node.md). Els [Tokens d'execució](./execution-tokens.md) proporcionen JWTs amb abast per workflow per a invocadors externs.

Vegeu també [Tokens d'execució](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) i [Credencials](./credentials.md).

### [Inici de sessió únic](./sso.md)

Heym autentica les persones contra qualsevol proveïdor extern d'OpenID Connect - Keycloak, Okta, Entra ID, Auth0, Google - configurat en temps d'execució des de **Settings → SSO** per un administrador de la instància inclòs a `HEYM_ADMIN_EMAILS`. Només s'introdueixen una URL d'emissor i les credencials del client; tots els endpoints provenen del document de descobriment del proveïdor, de manera que cap proveïdor està codificat de forma rígida. L'inici de sessió utilitza Authorization Code amb PKCE, i l'ID token es verifica contra les claus publicades del proveïdor. Els comptes s'assignen primer per `(issuer, subject)` i després per correu electrònic verificat, amb un aprovisionament automàtic opcional limitat a una llista permesa de dominis de correu electrònic. L'inici de sessió amb contrasenya continua disponible juntament amb SSO i es pot desactivar un cop superada una prova de connexió, amb els comptes de `HEYM_ADMIN_EMAILS` exempts perquè un proveïdor mal configurat no pugui bloquejar la instància.

Vegeu també [Settings](./user-settings.md), [Seguretat](./security.md) i [Registre d'auditoria](./audit.md).
### [Distribució de càrrega](./cluster.md)

Apunteu una segona instància de Heym a la mateixa base de dades i s'uneix com a worker. Les execucions en segon pla —cron, webhooks, crides a eines MCP, triggers de Chat— es reparteixen entre les instàncies segons un percentatge que estableix un administrador d'instància a **Settings → Instances**, amb l'estat, la latència de base de dades i la versió de cada instància en una sola taula. Les instàncies no es comuniquen mai entre elles: Postgres transporta la feina, de manera que un worker no necessita cap port obert ni cap ruta de retorn cap a la instància principal. La feina que toca fitxers locals, un espai de treball d'agent de codi o un connector instal·lat sempre s'executa a la instància principal, i el panell informa de quina part de les últimes 24 hores ha estat això, perquè un operador pugui veure quan els percentatges no poden ajudar. Cada execució de l'historial indica la instància que l'ha executada, i tots dos diàlegs d'historial permeten filtrar per aquesta.

Vegeu també [Settings](./user-settings.md), [Execucions](../tabs/traces-tab.md) i [Analytics](../tabs/analytics-tab.md).

### [Integracions de tercers](./integrations.md)

Heym es connecta a serveis externs mitjançant credencials emmagatzemades a la pestanya [Credencials](../tabs/credentials-tab.md) (xifrades en repòs). Els tipus admesos inclouen OpenAI, Google, Decision Model per al [node Decision](../nodes/decision-node.md), Model Router per a la selecció automàtica de model (vegeu més avall), GitHub per al [node GitHub](../nodes/github-node.md) i integracions MCP, Jira per al [node Jira](../nodes/jira-node.md), Notion per al [node Notion](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP per a [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header i FlareSolverr per a [Crawler](../nodes/crawler-node.md). Cada tipus documenta els camps obligatoris; les credencials es poden compartir amb usuaris o [equips](./teams.md) i es poden referenciar pel nom als nodes o com a `$credentials.Name` a les expressions.

### Model Router (Auto Model)

Una credencial **Model Router** tria el model per petició en lloc de contenir una clau. Emmagatzema una credencial de model de decisió més una llista de les vostres credencials existents d'OpenAI/Google/Custom, cadascuna amb criteris que indiquen quan s'ha d'utilitzar, i apareix a tots els selectors de model amb un únic model anomenat **Auto**.

Les Execucions, l'Execution Log del Canvas i la Span View mostren les dues meitats de l'elecció, per exemple `Auto Model / GPT-5`, mentre que el cost es manté atribuït al model que s'ha executat. Auto Model no es pot combinar amb l'API Responses, el mode Batch ni la sortida d'imatge. Vegeu [Credencials](./credentials.md) per al comportament complet.

Vegeu també [Credencials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) i [Equips](./teams.md).

### [Guardrails](./guardrails.md)

Els Guardrails bloquegen missatges d'usuari insegurs o no desitjats abans que arribin a un [LLM](../nodes/llm-node.md) o un [Agent Node](../nodes/agent-node.md). Activeu-los per node i seleccioneu les categories a bloquejar (p. ex. violència, discurs d'odi, contingut sexual, autolesió, assetjament, activitat il·legal). Establiu la sensibilitat (baixa, mitjana, alta). Quan es disparen, el node llança un error que podeu capturar amb un [Error Handler](../nodes/error-handler-node.md). La detecció utilitza l'API de moderació del proveïdor o la classificació del LLM segons el tipus de credencial.

Vegeu també [Security](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) i [Error Handler](../nodes/error-handler-node.md).

### [Enterprise](./enterprise.md)

Enterprise cobreix la llicència comercial, el suport professional i els serveis de desplegament per a equips que executen Heym en producció. Inclou ajuda amb l'arquitectura de Workflows, incorporació, orientació sobre Kubernetes i escalat, suport prioritari i desenvolupament a mida al voltant de funcions avançades com ara [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) i [Portal](./portal.md).

Vegeu també [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) i [Equips](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work és una segona interfície per a equips de negoci construïda sobre Heym. Els usuaris descriuen una feina, responen unes quantes preguntes i obtenen un Workflow provat, i després treballen des de pàgines, aprovacions i una llista d'Activitat on cada execució porta un nom. Els administradors de la instància el connecten a **Configuració → Heym Work** amb la seva adreça i una clau d'integració; té la seva pròpia llicència de l'equip de Heym.

Vegeu també [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) i [Human-in-the-Loop](./human-in-the-loop.md).

---

## Pestanyes del Dashboard
### [Workflows](../tabs/workflows-tab.md)

La pestanya Workflows és la vista de tauler predeterminada. Mostra una llista de dos panells: workflows i carpetes com a files compactes a l'esquerra, i una previsualització del workflow seleccionat a la dreta amb el seu trigger, l'última execució i els passos, a més d'Obrir workflow i Executar ara. Cada fila porta una etiqueta d'estat (En execució, Programat, Escoltant, En pausa, API, SubWorker, Portal, Manual, Eliminar programació) que el desplegable Estat pot filtrar. Un workflow sense node de trigger s'etiqueta segons com va començar la seva execució més recent — API per a una crida HTTP, SubWorker per a un workflow pare, Portal pel seu chat públic — i roman Manual fins que s'ha executat. Les carpetes i subcarpetes gestionen l'[organització](./workflow-organization.md). Creeu workflows amb Nou workflow, arrossegueu i deixeu anar JSON per [importar](./download-import.md), i editeu o suprimiu des de les accions de la fila. Els workflows es poden moure entre carpetes; la supressió es programa (paperera) abans de l'eliminació permanent.

Vegeu també [Organització de workflows](./workflow-organization.md), [Descàrrega i importació](./download-import.md) i [Calaix ràpid](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Un tauler kanban agentic on les targetes són tasques persistents. Configureu cada columna amb una cadena de workflows ordenada; moure una targeta a la columna executa la cadena amb el context complet de la targeta (contingut, comentaris, historial, sortides prèvies). Els resultats s'escriuen de tornada a la targeta — verd en cas d'èxit, vermell en cas de fallada, ambre mentre s'executa. Les rondes de seguiment tornen a executar la cadena de la columna actual amb tot l'acumulat fins al moment, cosa que impulsa la planificació iterativa. Les execucions es registren a l'[Historial d'execucions](./execution-history.md) amb l'origen de trigger `board`. Mentre una execució de targeta és activa, **Obrir en directe** obre aquella execució exacta al canvas animat amb registres de depuració incrementals.

Vegeu també [Workflows](../tabs/workflows-tab.md), [Historial d'execucions](./execution-history.md) i [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

La pestanya Templates us permet desar i reutilitzar plantilles de workflow (workflows complets) i plantilles de node (nodes individuals configurats). Creeu plantilles de workflow des de l'editor (Compartir com a plantilla) i plantilles de node fent clic dret sobre un node. Navegueu per visibilitat (Tothom o usuaris/[equips](./teams.md) específics), apliqueu una plantilla per crear un workflow nou o afegir un node al canvas, i gestioneu les vostres plantilles compartides.

Vegeu també [Workflows](../tabs/workflows-tab.md), [Equips](./teams.md) i [Funcions del canvas](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

La pestanya Variables gestiona el [Magatzem de variables globals](./global-variables.md). Creeu, editeu i suprimiu variables globals; establiu el nom, el valor i el tipus de valor (Auto, String, Number, Boolean, Array, Object). Les variables tenen abast d'usuari i persisteixen entre execucions. Referencieu-les en qualsevol [expressió](./expression-dsl.md) de workflow com a `$global.variableName`. Les variables es poden compartir amb altres usuaris o [equips](./teams.md).

Vegeu també [Variables globals](./global-variables.md), [Variable](../nodes/variable-node.md) i [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

La pestanya Chat és la superfície d'agents de llarga durada de Heym per operar l'espai de treball des de la conversa. Seleccioneu una [credencial](./credentials.md) i un model, i després demaneu a Chat que respongui preguntes, inspeccioni definicions de workflow, executi workflows existents, resumeixi execucions i programacions, informi de l'historial d'execucions d'un sol workflow (recompte d'execucions, desglossament per estat, darrera execució i els detalls d'una execució a petició), informi quines execucions s'estan executant en aquest moment (amb temps transcorregut, node actual i un enllaç a cada execució en directe), resolgui revisions humanes pendents, creï i revisi workflows amb el mateix motor d'AI Builder utilitzat a l'editor, o afegeixi targetes a taulers kanban amb llenguatge natural. Les targetes noves sempre comencen a la primera columna del tauler seleccionat; quan hi ha diversos taulers disponibles i no se n'ha anomenat cap, Chat presenta una selecció de tauler abans de crear la targeta.

Chat continua executant-se al backend després que es tanqui el navegador. Mentre una resposta s'està transmetent, podeu enviar més missatges; Heym els emmagatzema en una cua recolzada per base de dades, us permet editar o eliminar missatges en cua abans que comencin, i els executa en ordre quan finalitza la resposta actual. Si l'assistent necessita detalls de planificació i retorna preguntes d'aclariment, la cua es posa en pausa fins que respongueu aquestes preguntes, i després es reprèn després de la resposta de planificació.

Les respostes es transmeten amb markdown, imatges en línia, targetes de previsualització de workflow, targetes de crides d'eines plegables, ús de context i compressió automàtica de context. Chat admet adjunts, entrada de veu, reproducció de lectura en veu alta, accions de còpia, prompts ràpids, User Rules de [Settings](./user-settings.md) i [variables globals](./global-variables.md) com a context.

Vegeu també [AI Assistant](./ai-assistant.md), [Credentials](./credentials.md) i [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

### [Credentials](../tabs/credentials-tab.md)

La pestanya Credentials gestiona les claus d'API i els secrets utilitzats pels nodes. Afegiu credencials per tipus (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere, etc.), assigneu-los un nom i referencieu-los als nodes del workflow. Editeu o elimineu des de la targeta; compartiu amb usuaris per correu electrònic o amb [equips](./teams.md). Tots els valors estan xifrats en repòs i emmascarats a la interfície.

Vegeu també [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) i [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

La pestanya Vectorstores gestiona els magatzems vectorials utilitzats pels nodes [RAG](../nodes/rag-node.md). Creeu un magatzem amb un nom i una [credencial](./credentials.md) de magatzem vectorial — *RAG: Qdrant + OpenAI* (Qdrant extern) o *RAG: Psql + OpenAI* (el propi Postgres de Heym via pgvector), que fixa el backend del magatzem — opcionalment establiu un nom de col·lecció i després pugeu documents (PDF, TXT, etc.). Gestioneu el contingut (visualitzeu, elimineu fonts), editeu els detalls del magatzem i compartiu magatzems amb usuaris. En un node [RAG](../nodes/rag-node.md), trieu la Database, seleccioneu el magatzem vectorial i executeu operacions d'inserció, upsert, eliminació o cerca.

Vegeu també [Qdrant RAG](../nodes/rag-node.md), [Credentials](./credentials.md) i [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>
### [MCP](../tabs/mcp-tab.md)

La pestanya MCP configura la integració del Model Context Protocol. Heym admet dos modes:

**Servidor predeterminat** – Un únic endpoint a `/api/mcp/sse` exposa tots els workflows amb MCP habilitat. Visualitzeu i regenereu la vostra clau API, copieu el JSON de client a punt per utilitzar, connecteu Cursor amb un sol clic o seguiu el flux de configuració de Claude amb registre OAuth automàtic.

**Servidors amb nom** – Creeu múltiples endpoints MCP aïllats, cadascun amb la seva pròpia URL basada en UUID (`/api/mcp/servers/{uuid}/sse`) i clau API independent. Assigneu workflows específics a cada servidor perquè diferents clients d'IA o equips només vegin les eines que necessiten. Cada servidor amb nom admet els mateixos mètodes d'autenticació (clau API, Claude OAuth) i disposa de les seves pròpies dreceres Copiar JSON i Afegir a Cursor. Tots dos endpoints admeten transport SSE (GET) i transport Streamable HTTP (POST). En activar o desactivar un workflow dins d'un servidor amb nom, aquest es mou a la part superior de la llista assignada perquè la fila modificada romangui visible.

**Eina de chat de Heym** – Qualsevol dels dos modes també pot exposar el motor de [Chat](../tabs/chat-tab.md) com una única eina `heym_chat`, activada per superfície amb la seva pròpia credencial LLM i model (preomplert amb el vostre model preferit a [Settings](./user-settings.md)). Un client MCP envia un sol `message` en llenguatge natural i el motor fa la resta: crear workflows en mode de construcció (desar, executar proves fins a cinc vegades, corregir i verificar), executar workflows, analítiques, execucions, estat d'execució en directe, programacions, taulers i targetes, equips, variables globals, cerca de documentació i decisions amb intervenció humana. Les capacitats afegides al Chat posteriorment són accessibles a través de la mateixa eina sense cap registre addicional. Cada crida s'emmagatzema a l'historial de la pestanya Chat com una conversa marcada amb un endoll i retorna un `conversation_id` que el client pot tornar a passar per continuar el fil.

Vegeu també [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) i [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

La pestanya Traces mostra les traces d'execució d'[LLM](../nodes/llm-node.md). Una capçalera d'estadístiques sobre la llista resumeix el rang de temps seleccionat amb targetes KPI (Calls, Tokens, Cost, Avg Latency, Error %) i tres gràfics — Tokens by Model, Cost by Model i Calls Over Time (apilat èxit vs error). Un únic selector **Time range** (1h / 24h / 7d / 30d / All; per defecte 7 dies) filtra conjuntament els gràfics i la llista. El cost es calcula a partir de la [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) per usuari; els models sense preu es mostren com una advertència en línia que enllaça amb aquesta taula. Obriu qualsevol traça per veure els payloads de petició i resposta, el desglossament de temps (llm_ms, tools_ms, mcp_list_ms), les crides d'eines (nom, arguments, resultat) i les habilitats incloses. Els esdeveniments expandits mostren el JSON —incloent-hi payloads MCP i JSON-RPC— com un arbre plegable amb el primer nivell obert per defecte; **Tree / Raw** torna al text original i el JSON mal format continua sent llegible. Utilitzeu les traces per depurar el comportament d'[Agent Node](../nodes/agent-node.md) i [LLM](../nodes/llm-node.md) i per copiar o exportar payloads.

Vegeu també [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) i [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Alertes](../tabs/alerts-tab.md)

La pestanya Alertes defineix condicions llindar sobre una finestra temporal i us indica quan es creuen. Quatre tipus d'alerta cobreixen les preguntes que els operadors realment es fan: **llindar d'errors** (ha fallat més de N vegades dins la finestra), **durada del workflow** (les execucions s'han alentit, mesurat com a màxim, mitjana o p95), **cost en tokens / USD** (la despesa ha superat un pressupost, resolt mitjançant la mateixa taula de preus que a [Execucions](../tabs/traces-tab.md)) i **recompte d'execucions** (s'ha executat molt més sovint del que hauria). Cada tipus es jutja sobre una finestra que trieu vosaltres, mai sobre un esdeveniment aïllat, perquè una execució fallida és soroll i una allau és un incident. Les alertes vigilen un workflow o tots els workflows als quals teniu accés.

Un assistent de cinc passos recorre el tipus, l'abast, la condició, la resposta i la revisió. El pas de Revisió **retroprova** primer la condició, informant de quantes vegades s'hauria activat durant les últimes 24 hores fins a 7 dies, de manera que un llindar massa baix es detecta abans de desar-lo i no després que hagi avisat algú. Descriviu el que voleu en llenguatge natural i la IA omple tots els passos que pot, marcant les seves suposicions; una sol·licitud parcial encara fa avançar l'assistent, obrint-se al primer pas que encara necessita una decisió en lloc de fer-vos començar de nou. Per defecte, una alerta s'activa una vegada i es manté en silenci fins que la mètrica es recupera; alternativament, podeu fer que es repeteixi en un interval.

Al pas de resposta, una alerta pot crear i assignar un workflow nou per executar-se quan s'activi, utilitzar-ne un que ja tingueu, o no fer res. El payload d'activació porta el valor observat, el llindar, la finestra i els workflows que han contribuït al número, que és com les alertes arriben a Slack, correu electrònic o Telegram mitjançant nodes que ja teniu. L'historial d'activacions registra què era cert en el moment en què cada alerta es va activar i es conserva durant 90 dies; reconèixer una activació canvia la insígnia d'Activant-se a Reconeguda sense pretendre que la condició s'hagi resolt. La pestanya [Chat](../tabs/chat-tab.md) pot respondre quines alertes existeixen i per què o quan es va activar una. Les alertes es poden compartir amb usuaris i [equips](../tabs/teams-tab.md).

Vegeu també [Analítiques](../tabs/analytics-tab.md), [Execucions](../tabs/traces-tab.md) i [Historial d'execucions](./execution-history.md).

### [Analítiques](../tabs/analytics-tab.md)

La pestanya Analítiques mostra mètriques i tendències d'execució. Les estadístiques resum inclouen el total d'execucions, la taxa d'èxit, la taxa d'errors, els desglossaments de latència i el total de **Temps estalviat** (la suma dels minuts estimats estalviats per execució de cada workflow × les seves execucions correctes). Més utilitzats llista aquesta mateixa suma per workflow. Seleccioneu un interval de temps base (24 h, 7 d, 30 d o tot), opcionalment filtreu per workflow i, a continuació, arrossegueu sobre qualsevol gràfic per aprofundir en un interval de dates seleccionat. Els gràfics i les taules de workflows s'actualitzen a la selecció, i l'actualització automàtica manté les mètriques al dia. Complementa l'[Historial d'execucions](./execution-history.md) i la vista [Programats](../tabs/scheduled-tab.md) quan necessiteu tant resultats passats com execucions properes.

Vegeu també [Historial d'execucions](./execution-history.md), [Programats](../tabs/scheduled-tab.md) i [Avaluacions](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>
### [Tauler](../tabs/dashboard-tab.md)

La pestanya Tauler és un espai a l'estil de Grafana on es construeixen graelles de ginys de gràfics, cadascun renderitzat des del seu propi workflow de Heym ocult. Mantingueu tants taulers com necessiteu i compartiu cadascun amb usuaris o equips, en mode només lectura o editable; els ginys sempre s'executen amb les credencials del propietari, de manera que tothom veu les mateixes dades. Descriviu una mètrica en llenguatge natural i la IA genera el giny, o afegiu-ne un manualment i trieu un tipus de gràfic, amb previsualització mitjançant dades de mostra: barres, línies, àrea, circular, taula, numèric, indicador, dispersió, proporció, indicador de barres, text o HITL. HITL és un carrusel de les vostres revisions humanes pendents. La capçalera mostra `1/n pending`. El nom del workflow obre aquesta execució al canvas. **Approve**, **Request changes** i **Reject** la resolen, i la icona d'historial al costat del títol del giny obre aquesta execució al diàleg d'historial de la mateixa pàgina. Els ginys emmagatzemen els resultats en memòria cau, es poden ajustar amb IA (cada canvi es desa a l'[Historial d'edicions](./edit-history.md)), clonar juntament amb el seu workflow complet, reorganitzar amb Tidy up, i arrossegar o redimensionar en mode d'edició. Les taules poden mostrar xips d'estat i enllaçar les seves files a un tauler de detall que llegeix el registre de la fila clicada com a `$page.record`, i un giny Run executa un workflow des del tauler: sobre un fitxer deixat anar, amb els seus camps d'entrada o amb un botó Executa. Com que cada giny és un workflow, qualsevol dada que pugueu obtenir —una crida [HTTP](../nodes/http-node.md), una consulta [BigQuery](../nodes/bigquery-node.md), una cerca [RAG](../nodes/rag-node.md) o una sortida d'[LLM](../nodes/llm-node.md)— pot esdevenir un gràfic. La configuració d'un widget HITL pot restringir-lo a les revisions d'un sol workflow, o a un pas d'agent o d'aprovació de Slack en el seu si; un widget d'aquest tipus les mostra a tothom que pot obrir aquest workflow i queda ocult per a qui no pot. [Chat](../tabs/chat-tab.md) i l'eina MCP `heym_chat` llisten els vostres dashboards amb els seus widgets, indiquen a quin dashboard es troba un workflow, afegeixen un nou widget (primer un widget buit el workflow del qual Chat construeix i prova), col·loquen un workflow existent com a widget, reanomenen o eliminen widgets i organitzen el disseny tal com fa el botó Organitzar.

Vegeu també [Node de sortida de gràfic](../nodes/chart-output-node.md), [Analítiques](../tabs/analytics-tab.md) i [Historial d'execucions](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>

### [Avaluacions](../tabs/evals-tab.md)

La pestanya Avaluacions (a `/evals`) us permet crear conjunts d'avaluació, afegir o generar casos de prova, optimitzar el prompt del conjunt i executar avaluacions contra workflows del [Node Agent](../nodes/agent-node.md). Seleccioneu un o més models, trieu un mètode de puntuació (Exact Match, Contains o LLM-as-Judge), opcionalment deixeu que un model separat o un [Model de decisió](../nodes/decision-node.md) jutgi les respostes d'LLM-as-Judge, establiu les execucions per prova (a més de la temperatura i l'esforç de raonament per a Exact Match i Contains), i després compareu els resultats d'aprovat/fallit i les sortides per model. Reviseu l'historial d'execucions d'avaluacions anteriors, incloent-hi el jutge que va utilitzar cada execució, torneu a executar-ne una amb el mateix jutge, exporteu-la com a JSON i verifiqueu el comportament subjacent a les [Execucions](../tabs/traces-tab.md).

Una **suite d'agent** comprova en comptes d'això un sol node d'agent: mostra la latència de referència de l'agent, el cost en USD, els tokens i les crides d'eines a partir de les seves execucions reals, permet marcar cada eina, eina MCP, subagent, sub-workflow o habilitat com a obligatòria o prohibida per a l'agent, estableix límits superiors un 20% per sobre de la línia base, executa el workflow un nombre seleccionat de vegades amb les entrades de l'última execució o escrites per IA, i puntua cada execució amb el motiu de qualsevol fallada. El selector de suites llista tots dos tipus i permet la cerca, i l'informe [Workflow Analysis](./workflow-analysis.md) suggereix una suite per a workflows amb nodes d'agent o LLM.

Vegeu també [Node Agent](../nodes/agent-node.md), [Execucions](../tabs/traces-tab.md) i [Historial d'execucions](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

### [Equips](../tabs/teams-tab.md)

La pestanya Equips us permet crear i gestionar equips. Creeu un equip, afegiu membres per correu electrònic i elimineu membres (el creador no es pot eliminar). Compartiu [workflows](../tabs/workflows-tab.md), [plantilles](../tabs/templates-tab.md), [credencials](../tabs/credentials-tab.md), [variables](../tabs/global-variables-tab.md), [magatzems vectorials](../tabs/vectorstores-tab.md) i [fitxers de Drive](../tabs/drive-tab.md) amb equips des dels seus diàlegs de compartició respectius; tots els membres de l'equip obtenen accés. Editeu el nom i la descripció de l'equip o suprimiu l'equip (elimina totes les comparticions d'equip).

Vegeu també [Equips](./teams.md), [Compartició de credencials](./credentials-sharing.md) i [Organització de workflows](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

### [Programats](../tabs/scheduled-tab.md)

La pestanya Programats mostra tots els workflows de [Cron](../nodes/cron-node.md) actius en un calendari visual. Canvieu entre les vistes de dia, setmana i mes per veure quan estan programades les vostres automatitzacions, i torneu al [workflow](../tabs/workflows-tab.md) relacionat quan necessiteu editar la programació.

Vegeu també [Cron](../nodes/cron-node.md), [Analítiques](../tabs/analytics-tab.md) i [Historial d'execucions](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>
### [Logs](../tabs/logs-tab.md)

La pestanya Logs mostra els registres dels contenidors Docker de l'stack de Heym (backend, frontend, PostgreSQL). Seleccioneu un o diversos contenidors, filtreu per nivell de registre (All, INFO, WARNING, ERROR, DEBUG) i cerqueu dins dels registres. Utilitzeu-la per a la depuració i la resolució de problemes. Per als registres d'execució de workflows (resultats dels nodes, sortides), utilitzeu l'[Historial d'execucions](./execution-history.md), les [Execucions](../tabs/traces-tab.md) o el panell de depuració de l'editor.

Vegeu també l'[Historial d'execucions](./execution-history.md), les [Execucions](../tabs/traces-tab.md) i les [Funcions del Canvas](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

### [Taula de dades](../tabs/datatable-tab.md)

La pestanya Taula de dades us permet crear i gestionar taules de dades estructurades dins de Heym. Definiu columnes tipades (string, number, boolean, date, JSON), gestioneu files amb edició en línia mitjançant doble clic, importeu/exporteu CSV i compartiu taules amb usuaris o [equips](./teams.md) amb permisos de lectura/escriptura. Utilitzeu el [node Taula de dades](../nodes/datatable-node.md) per accedir a les taules de manera programàtica en els workflows. Una secció fixada de **Taules del sistema** a la part superior allotja la **Taula de costos d'LLM**: una vista d'esquema fix de la tarificació per model, alimentada des de Helicone en segon pla (TTL de 24 hores, actualització manual), on cada usuari pot sobreescriure preus o afegir files personalitzades per a models que Helicone no llista. Aquestes regles de tarificació alimenten l'indicador de cost i el gràfic de cost per model de la pestanya [Execucions](../tabs/traces-tab.md).

Vegeu també el [node Taula de dades](../nodes/datatable-node.md), les [Execucions](../tabs/traces-tab.md), l'[Estructura del workflow](./workflow-structure.md) i els [Equips](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>

### [Drive](../tabs/drive-tab.md)

La pestanya Drive mostra tots els fitxers generats per les skills en els vostres workflows. Llista cada fitxer amb el nom, el tipus, la mida, el node d'origen, la data de creació i l'estat de compartició amb l'equip, i ofereix controls de cerca, descàrrega autenticada, compartició, eliminació i paginació. És el complement de tauler de control de la [Generació de fitxers](./file-generation.md), la referència del [Drive](./drive.md) i el [node Drive](../nodes/drive-node.md).

Vegeu també el [Drive](./drive.md), la [Generació de fitxers](./file-generation.md) i el [node Drive](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Watch Drive demo</a></p>

### [Col·laboració a Canvas](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
