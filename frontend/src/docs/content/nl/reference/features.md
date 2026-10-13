# Heym Volledige Functieset

Een uitgebreid overzicht van alle Heym-mogelijkheden. Elke sectie beschrijft een functie of concept in enkele zinnen.

---

## Aan de slag

### [Introductie](../getting-started/introduction.md)

Heym is infrastructuur voor het uitvoeren en beheren van AI-agents in productie. U bouwt agentische systemen op een visueel canvas en voert deze met vertrouwen uit: orkestreer agents, automatiseer bedrijfsprocessen, inspecteer elke uitvoering en houd mensen in controle op uw eigen infrastructuur. Het ondersteunt visuele workflows, AI-aangedreven nodes ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), een [AI Assistant](./ai-assistant.md), integraties ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), inkomende [IMAP Trigger](../nodes/imap-trigger-node.md) e-mail, uitgaande [Send Email](../nodes/send-email-node.md)), planning met [Cron](../nodes/cron-node.md) en [Portal](./portal.md) chatportalen voor eindgebruikers.

Zie ook [Kernconcepten](../getting-started/core-concepts.md), [Node-typen](./node-types.md) en [Integraties van derden](./integrations.md).

### [Waarom Heym](../getting-started/why-heym.md)

Waarom Heym doorloopt de agent-levenscyclus (bouwen, orkestreren, uitvoeren, observeren, evalueren, beheren, ontsluiten) en toont wat één zelf-gehoste runtime in elke fase afhandelt. Dat omvat de [LLM](../nodes/llm-node.md)-node en [Agent Node](../nodes/agent-node.md) met tool calling, Python-tools, [MCP](../tabs/mcp-tab.md)-verbindingen, skills en multi-agent-orkestratie; triggers, retries en [load distribution](./cluster.md); [Traces](../tabs/traces-tab.md) met USD-kosten per run en OpenTelemetry-export; [Evals](../tabs/evals-tab.md); [human review checkpoints](./human-in-the-loop.md), guardrails, SSO en een audittrail; en REST-, MCP- en Portal-endpoints. Een vergelijking van mogelijkheden met n8n, Zapier en Make.com sluit de pagina af.

Zie ook [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) en [Agent-architectuur](./agent-architecture.md).

### [Snelstart](../getting-started/quick-start.md)

Zet uw eerste workflow binnen enkele minuten aan de praat: maak een workflow aan vanuit het tabblad [Workflows](../tabs/workflows-tab.md), voeg een [Input](../nodes/input-node.md)-node, een [LLM](../nodes/llm-node.md)-node en een [Output](../nodes/output-node.md)-node toe en verbind deze met elkaar. Configureer de [LLM](../nodes/llm-node.md) met een referentie en stel `userMessage` in op `$input.text`; gebruik Run of de [AI Assistant](./ai-assistant.md) om workflows uit te voeren of te genereren met natuurlijke taal.

Combineert van nature met [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) en [Expression DSL](./expression-dsl.md).

### [Kernconcepten](../getting-started/core-concepts.md)

Workflows zijn gerichte grafen van nodes die door edges met elkaar verbonden zijn; de uitvoering verloopt van trigger-nodes ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) via verwerkingsnodes naar [Output](../nodes/output-node.md)-nodes. Elke node heeft een type, data (configuratie) en inputs/outputs; edges definiëren de gegevensstroom. Nodes verwijzen naar gegevens van bovenliggende nodes via [Expression DSL](./expression-dsl.md)-expressies zoals `$nodeLabel.field`; onafhankelijke nodes worden automatisch [parallel](./parallel-execution.md) uitgevoerd.

Zie ook [Triggers](./triggers.md), [Parallelle uitvoering](./parallel-execution.md) en [Workflow-structuur](./workflow-structure.md).

### [Uitvoeren & Deployment](../getting-started/running-and-deployment.md)

Heym biedt `run.sh` voor lokale ontwikkeling (database in Docker, FastAPI-backend, Vite-frontend) en `deploy.sh` voor productie met Docker Compose. Beide gebruiken een `.env`-bestand; belangrijke variabelen zijn `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` en `ALLOW_REGISTER`. Ontwikkeling draait op configureerbare frontend- en backend-poorten; productie serveert de API onder `/api` via de frontend-container.

Zie ook [Beveiliging](./security.md), [Enterprise](./enterprise.md) en [Instellingen](./user-settings.md).

### [Migreren naar Heym](../getting-started/migrate-to-heym.md)

De AI Convert-tool zet een workflow van een ander platform (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) of een beschrijving in gewoon Nederlands om naar een Heym-workflow, live gestreamd op een canvas en klaar om te [downloaden en importeren](./download-import.md). De tool voert een AI-veiligheidscontrole uit en genereert vervolgens de DSL met input- en snelheidslimieten. Open de tool op [heym.run/convert](https://heym.run/convert).

Zie ook [Snelstart](../getting-started/quick-start.md), [Downloaden & Importeren](./download-import.md) en [AI Assistant](./ai-assistant.md).

---

## Nodes

### Triggers
#### [Invoer](../nodes/input-node.md)

De Invoer-node is het toegangspunt voor workflows die gegevens ontvangen van de gebruiker of de API-aanroeper. Deze ondersteunt één of meerdere invoervelden en stelt metadata van het verzoek beschikbaar (headers, query-parameters). Toegang tot body-velden verloopt via `$nodeLabel.body.fieldKey`, headers via `$nodeLabel.headers` en query via `$nodeLabel.query`.

Combineert van nature met [Voorwaarde](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) en [Uitvoer](../nodes/output-node.md). Raadpleeg voor payload-referenties en veldtoegang de [Expression DSL](./expression-dsl.md) en [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

De Cron-node start een workflow volgens een tijdschema met behulp van een standaard cron-expressie met vijf velden. Er is geen gebruikersinvoer vereist—de workflow wordt automatisch uitgevoerd op de opgegeven tijdstippen (bijv. elk uur, dagelijks, elke 15 minuten). De uitvoer is een trigger-event zonder payload.

Zie ook [Triggers](./triggers.md), [Wachten](../nodes/wait-node.md) en [Uitvoeringsgeschiedenis](./execution-history.md) voor geplande en vertraagde uitvoeringen.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

De IMAP Trigger-node pollt een inbox met een configureerbaar interval in minuten en start een workflow voor elke nieuw gedetecteerde e-mail. Deze voert geparseerde headers, afzender- en ontvangerlijsten, platte tekst en HTML-bodies, metadata van bijlagen en een trigger-tijdstempel uit. Gebruik deze voor het triageren van support-inboxen, mailbox-naar-[Slack](../nodes/slack-node.md)-routering of e-mailgestuurde goedkeuringsstromen met [Human-in-the-Loop](./human-in-the-loop.md).

Combineert met [E-mail Verzenden](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) en [Slack](../nodes/slack-node.md) voor inkomende triage- en responsworkflows.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

De Heym Trigger-node start een workflow wanneer Heym zelf een platformgebeurtenis publiceert: `heym.started`, `workflow.created`, `workflow.updated` of `workflow.deleted`. De levering is gebundeld - elke gebeurtenis die binnen één dispatch-venster van vijf seconden wordt gepubliceerd, arriveert in één uitvoering als `$nodeLabel.events`, altijd een array. Elke gebeurtenis wordt geclaimd via een unieke databasebeperking, zodat deze precies één keer wordt geactiveerd per abonnerende node, ongeacht het aantal workers, containers of machines dat actief is. Gebruik deze voor audittrails van workflowwijzigingen, aankondigingen van deployments en gezondheidsdigesten van instanties.

Combineert met de [Heym](../nodes/heym-node.md)-node om de gewijzigde workflow op te zoeken, en met [Loop](../nodes/loop-node.md) om één keer per gebeurtenis te handelen.

#### [Heym](../nodes/heym-node.md)

De Heym-node leest Heyms eigen gegevens via drie bewerkingen: `listWorkflows` retourneert elke workflow die de eigenaar kan bereiken met node-aantallen en tijdstempels, `getWorkflow` retourneert de node- en randstructuur van één workflow, en `getExecutionHistory` retourneert uitvoeringsgeschiedenis-items van nieuwste naar oudste met optionele filters voor status, tijdvenster en limiet, samen met totalen gegroepeerd per status. Resultaten zijn beperkt tot de eigenaar van de workflow waarin de node zich bevindt, zodat een uitvoering gestart door cron, een portaal of een gebeurtenis dezelfde gegevens retourneert als een handmatige uitvoering. `getWorkflow` retourneert de volledige node-configuratie, wat het mogelijk maakt om een workflow te controleren op hardcoded keys of tokens; het stelt niets beschikbaar dat de workflow-eigenaar niet al in de editor zou kunnen openen. Er is geen referentie vereist.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

De WebSocket Trigger-node opent een uitgaande clientverbinding naar een externe WebSocket-server en start de workflow bij `onMessage`, `onConnected` of `onClosed`. Deze stelt geparseerde berichtpayloads, reconnect-status, sluitingsmetadata en de socket-URL beschikbaar voor downstream-expressies.

Combineert met [WebSocket Verzenden](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) en [SSE Streaming](./sse-streaming.md) voor realtime-integraties.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

De Telegram Trigger-node ontvangt webhook-updates van de bot en start de workflow onmiddellijk. Deze stelt de volledige update-payload, het primaire berichtobject, callback-queries, gesanitiseerde headers en een trigger-tijdstempel beschikbaar. Gebruik deze voor chatbots, AI-assistenten in [Telegram](../nodes/telegram-node.md) en knopgestuurde stromen.

Combineert met [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) en [Webhooks](./webhooks.md) voor botgestuurde workflows.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

De Slack Trigger-node ontvangt webhooks van de Slack Events API en start automatisch een workflow na verificatie van de verzoekhandtekening. Deze stelt de gebeurtenis-payload en gesanitiseerde headers beschikbaar voor downstream-routering, op [LLM](../nodes/llm-node.md) gebaseerde classificatie en antwoordstromen.

Combineert met [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) en [Integraties van Derden](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

De Discord Trigger-node ontvangt webhooks van de Discord Interactions API, verifieert Ed25519-handtekeningen met de geselecteerde `discord_trigger`-referentie en start de workflow. Deze stelt de volledige interactie-payload, commandogegevens, gesanitiseerde headers en trigger-metadata beschikbaar voor downstream-routering of antwoorden.

Combineert met [Uitvoer](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) en [Integraties van Derden](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

De RabbitMQ-node verzendt of ontvangt berichten van RabbitMQ-wachtrijen en -exchanges. Gebruik deze voor berichtgestuurde workflows en gebeurtenisverwerking. De verzendmodus publiceert een bericht met optionele vertraging; de ontvangstmodus fungeert als een [trigger](./triggers.md), zodat de workflow start wanneer een bericht aankomt. De uitvoer bevat status, message_id en body.

Combineert met [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) en [Parallel Execution](./parallel-execution.md) voor gebeurtenisgestuurde verwerking.

#### [Error Handler](../nodes/error-handler-node.md)

De Error Handler-node wordt automatisch uitgevoerd wanneer een node in de workflow mislukt. Er zijn geen inkomende edges nodig; deze wordt door de engine geactiveerd. De uitvoer bevat het foutbericht, het label van de mislukte node, het node-type en een tijdstempel. Gebruik deze om meldingen te verzenden via [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) of [Send Email](../nodes/send-email-node.md), fouten te loggen of aangepaste foutresponsen te retourneren.

Als alternatief voor het afhandelen van fouten op het canvas kan een workflow mislukkingen ook delegeren aan een aparte workflow — zie [Error Workflow](#error-workflow). Als het canvas al een Error Handler-node bevat, wordt de error workflow **niet** aangeroepen (de lokale handler heeft voorrang).

Veelvoorkomende meldingsdoelen zijn [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) en [Send Email](../nodes/send-email-node.md); uitvoeringsdetails zijn eenvoudiger te inspecteren in [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

De AI Agent-node is een [LLM](../nodes/llm-node.md)-node met tool calling. Deze kan Python-tools uitvoeren, verbonden canvas-nodes als tools aanroepen, verbinding maken met [MCP](../tabs/mcp-tab.md)-servers, skills gebruiken (instructiebestanden en optionele Python-scripts), fungeren als orchestrator die delegeert naar andere agent-nodes en andere workflows als tools aanroepen. De uitvoer is beschikbaar als `$nodeLabel.text`. Een optionele **Extra Body**-schakelaar voegt een JSON-object met providerspecifieke aanvraagparameters toe aan elke aanvraag in de tool-calling-lus; deze staat standaard uit. Een optionele **Use Responses API**-schakelaar leidt de modelaanroepen van de agent via de Responses API, waardoor de redenering van het model behouden blijft tijdens tool calls, zodat een reasoning-model zijn chain of thought behoudt gedurende een meerstaps-lus; deze staat standaard uit en werkt met OpenAI en aangepaste referenties.

Met canvas-node-tools kan een agent geconfigureerde workflow-nodes rechtstreeks vanaf het canvas aanroepen. Verbind een ondersteunde node met de tools-handle van de agent en markeer vervolgens specifieke velden als door de agent aangeleverd met het bot-pictogram. Die velden worden tijdens runtime tool-parameters, terwijl referenties en niet-gemarkeerde velden vast blijven in de node-configuratie.

De sectie Skills bevat nu **AI Build** voor het maken van nieuwe skills, een inline AI-bewerkingsactie voor bestaande skills, downloaden per skill als ZIP en een optionele **Enable Drive files**-schakelaar voor skills die tijdens runtime Heym Drive-bestanden moeten lezen. De Skill Builder-modal streamt een chatgesprek aan de linkerkant, accepteert drag-and-drop-bestanden bij elke fine-tune-opmerking, toont een live alleen-lezen voorbeeld van de gegenereerde `SKILL.md`- en `.py`-bestanden aan de rechterkant, kan dat voorbeeld als ZIP downloaden en slaat geüploade fine-tune-bestanden op als gebundelde skill-assets via dezelfde ZIP-ingestiestroom die bij handmatige uploads wordt gebruikt.

Met **[Agent Persistent Memory](./agent-persistent-memory.md)** ingeschakeld houdt elke agent-node zijn eigen knowledge graph bij: feiten worden in de system prompt geladen wanneer deze niet leeg is, en succesvolle uitvoeringen activeren een achtergrondmerge van nieuwe entiteiten en relaties. Sub-agents gebruiken afzonderlijke graphs. U kunt de graph van een agent **delen** met andere agents (in dezelfde of andere workflows) met alleen-lezen of lees/schrijf-toegang vanuit het graph-dialoogvenster. De brain-bediening op het canvas opent de graph-editor.

Agent-nodes kunnen ook de [Human-in-the-Loop](./human-in-the-loop.md)-modus activeren. In deze modus krijgt de agent een `request_human_review`-tool en kan deze pauzeren bij specifieke stappen waarvoor goedkeuring vereist is, een eenmalige openbare reviewlink aanmaken, een `review`-canvas-tak beschikbaar stellen voor meldingsstromen en wachten tot een reviewer de Markdown-reviewtekst accepteert, bewerkt of weigert. Het HITL-veld van de node fungeert als goedkeuringsrichtlijnen voor wanneer erom gevraagd moet worden, terwijl de samenvatting voor de reviewer wordt gegenereerd op basis van elke reviewaanvraag. Voor [MCP](../tabs/mcp-tab.md)-tools gebruikt Heym het model om die geschreven instructies te interpreteren als `always`, `once` of `never`, zodat vrije goedkeuringstaal wordt omgezet naar een concreet runtime-beleid. De uitvoering wordt gemarkeerd als `pending` en hervat vanuit de opgeslagen execution snapshot nadat de beslissing binnenkomt, en dezelfde agent-uitvoering kan meer dan eens pauzeren als latere stappen ook review vereisen.

Agent-nodes comprimeren automatisch hun opgebouwde berichtgeschiedenis wanneer deze 80% van het contextvenster van het model nadert. De system prompt, het eerste gebruikersbericht en het meest recente gebruikersbericht blijven altijd behouden; alles daartussen wordt samengevat met hetzelfde model en dezelfde referentie. Compressiegebeurtenissen zijn zichtbaar in het Debug-paneel, [Execution History](./execution-history.md) en het tabblad [Traces](../tabs/traces-tab.md).

Zie ook [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) en [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

De Codex-node voert de OpenAI Codex CLI uit binnen een geïsoleerde Heym-workspace. De node accepteert een Codex-referentie (meld u aan met ChatGPT om uw abonnement te gebruiken zonder API-kosten per token, of plak een access token), een GitHub-referentie, repository-URL, base branch, taakprompt, publicatiemodus (`diff_only` of `draft_pr`), branchnaam en timeout. De runner kloont de repository lokaal, geeft de ChatGPT-tokenbundel of `CODEX_ACCESS_TOKEN` uitsluitend door aan het Codex-proces en retourneert een gestructureerde samenvatting, validatienotities, gewijzigde bestanden, diff, gebruiksmetadata en een optionele draft PR-URL.

Wanneer Codex `needs_input` retourneert, pauzeert de workflow en wordt de `question`-branch beschikbaar gesteld. Verbind die branch met Slack, e-mail of een andere notificatie-node; de openbare vervolglink hervat de opgeslagen uitvoeringssnapshot nadat het antwoord is ingediend. De Codex-node kan ook als tool aan een AI Agent worden gekoppeld, zodat de agent coderingstaken kan delegeren; als tool wordt een `needs_input`-resultaat inline aan de agent geretourneerd in plaats van de workflow te pauzeren.

Zie ook [GitHub](../nodes/github-node.md), [Referenties](./credentials.md), [Referenties delen](./credentials-sharing.md) en [Node-typen](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

De OpenCode Go-node voert de OpenCode CLI (Go) uit tegen een GitHub-repository. De isolatie volgt het Codex-patroon: lokaal draait deze als host-subproces, terwijl Docker-implementaties deze uitvoeren in een geharde zustercontainer die het workspace-volume deelt. De node accepteert een OpenCode Go-referentie (een gateway-API-key met een optionele base URL), een GitHub-referentie, repository-URL, base branch, taakprompt, publicatiemodus, branchnaam, timeout en een `opencode-go/<model>`-model gekozen uit een live, doorzoekbare modellenlijst (met een ingebouwde fallback). Heym voert alle git-/GitHub-operaties uit op de host en plaatst het GitHub-token nooit in de sandbox; OpenCode bewerkt uitsluitend bestanden op schijf. De node retourneert een gestructureerde samenvatting, validatienotities, gewijzigde bestanden, diff en een optionele pull request-URL. De node kan als tool aan een AI Agent worden gekoppeld.

Zie ook [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Referenties](./credentials.md), [Referenties delen](./credentials-sharing.md) en [Node-typen](./node-types.md).

#### [LLM](../nodes/llm-node.md)

De LLM-node verwerkt tekst met een taalmodel of genereert afbeeldingen. De node ondersteunt tekstgeneratie, vision (afbeeldingsinvoer), afbeeldingsgeneratie, gestructureerde JSON-uitvoer, provider-native Batch API-uitvoering voor ondersteunde OpenAI- en OpenAI-compatibele endpoints, en een optionele schakelaar **Use Responses API** die de aanroep via de Responses API leidt in plaats van Chat Completions (standaard uitgeschakeld; werkt met OpenAI- en aangepaste referenties en kan niet worden gecombineerd met de Batch-modus). Configureer referentie, model, systeem- en gebruikersberichten, temperatuur en max tokens; gebruik [Expression DSL](./expression-dsl.md) in prompts. In de batch-modus moet de `userMessage` naar een array verwijzen, zendt de node een `batchStatus`-branch met voortgangsupdates uit, en bevat de uiteindelijke uitvoer batchresultaten per item. Een optionele schakelaar **Extra Body** voegt een JSON-object met providerspecifieke aanvraagparameters (bijvoorbeeld `{"thinking": {"type": "disabled"}}`) toe aan elke API-aanroep; deze staat standaard uit. Optionele [Guardrails](./guardrails.md) blokkeren onveilige inhoud vóór de aanroep.

Combineert van nature met [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) en [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

De Decision-node stelt een beslissingsmodel getypte vragen over de toestand van de uitvoering en retourneert waarschijnlijkheden in plaats van proza. Een veld **State** bevat wat het model moet lezen — een losse expressie behoudt het eigen type, dus `$input` verzendt het object in plaats van de tekst ervan — en een lijst met vragen bevat de beoordelingen. Vragen komen in drie vormen: **noul** beantwoordt of een voorwaarde geldt, **choice** kiest één optie uit een door u gedefinieerde set en retourneert de volledige verdeling, en **score** beoordeelt de toestand langs geordende niveaus en kan daartussen uitkomen. Choice- en score-antwoorden bevatten ook een betrouwbaarheid, zodat een [Switch](../nodes/switch-node.md) op het antwoord kan routeren terwijl een [Condition](../nodes/condition-node.md) controleert hoe zeker het was. **Generate with AI** stelt de state-template en de vraagrijen op vanuit een gewone zin, en **Custom request body** verzendt handgeschreven JSON voor een endpoint waarvan het contract afwijkt. Het providerantwoord wordt ongewijzigd doorgegeven en elke aanroep wordt vastgelegd in [Traces](../tabs/traces-tab.md).

Vereist een Decision Model-referentie; combineert van nature met [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) en [Agent Node](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

De RAG / Vector Store-node voegt documenten in, upsert, verwijdert en doorzoekt documenten in een vectorstore voor retrieval-augmented generation. Een Database-dropdown selecteert de backend — **Qdrant** (externe server) of **Postgres (pgvector)** (Heym's eigen database, geen externe service), met Qdrant als standaard. Kies een vectorstore uit het tabblad [Vectorstores](../tabs/vectorstores-tab.md) en stel de bewerking in op insert, upsert, delete of search. Upsert en delete adresseren een document via een unieke id die in de payload is opgeslagen — een **Document ID Field** benoemt dat veld (standaard `doc_id`) en **Document ID** bevat de waarde ervan — zodat een document de id behoudt die uw eigen systeem al gebruikt: upsert vervangt elk overeenkomend point voordat de nieuwe versie wordt opgeslagen, en delete rapporteert of er iets is gematcht. Documentmetadata accepteert expressies in de waarden, zodat `{"url": "$start.url"}` opslaat wat de uitvoering heeft geproduceerd. Search ondersteunt metadatafilters en optionele Cohere-reranking, en retourneert een array met resultaten met tekst, score, metadata, reranked-flag en count voor gebruik in [LLM](../nodes/llm-node.md)- of [Agent Node](../nodes/agent-node.md)-flows.

Veelvoorkomende downstream-nodes zijn [LLM](../nodes/llm-node.md) en [Agent Node](../nodes/agent-node.md); het instellen van een vectorstore staat in [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

De MCP Call-node roept een specifieke [MCP](../tabs/mcp-tab.md)-tool direct aan, zonder dat een LLM beslist welke tool moet worden aangeroepen. Gebruik deze wanneer u op ontwerptijd al precies weet welke tool moet worden uitgevoerd — voor deterministische, single-step MCP-tooluitvoering in een workflow. Configureer een verbinding (SSE, Streamable HTTP of stdio; dezelfde velden als de MCP-verbinding van de [Agent Node](../nodes/agent-node.md)), klik op **Fetch Tools** om een dropdown te vullen, selecteer een tool en vul argumentvelden in die automatisch worden gerenderd op basis van het input-schema van de tool. Elk argument accepteert een statische waarde of een [DSL-expressie](./expression-dsl.md) zoals `$userInput.body.text`. Het resultaat is beschikbaar als `$nodeLabel.result` (JSON-object indien parsebaar, anders een string). De MCP Call-node kan niet als canvas-tool worden verbonden met een [Agent Node](../nodes/agent-node.md).

Zie ook [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) en [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

De Condition-node vertakt de workflow op basis van een if/else-expressie. De node heeft twee output-handles: één voor wanneer de conditie truthy is en één voor falsy. Gebruik vergelijkings- en logische operatoren uit de [Expression DSL](./expression-dsl.md) in de conditie-expressie; de node geeft de invoer door aan de gekozen vertakking.

Zie ook [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) en [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

De Switch-node routeert de uitvoering naar verschillende paden door een waarde te matchen tegen cases. Configureer een expressie om te evalueren en een lijst met case-waarden; elke case krijgt een source-handle en een default-handle wordt gebruikt voor niet-overeenkomende waarden. De invoer wordt doorgegeven aan de gematchte vertakking.

Gebruik [Condition](../nodes/condition-node.md) voor binaire vertakking en [Merge](../nodes/merge-node.md) om gerouteerde paden weer samen te voegen; matching-regels worden behandeld in [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

De Merge-node wacht op meerdere parallelle invoeren en combineert deze tot één uitvoer. Stel het aantal invoeren in waarop moet worden gewacht; de node produceert een samengevoegd object zodra alle vertakkingen zijn voltooid. Gebruik deze om resultaten van parallelle vertakkingen samen te voegen voordat u verdergaat; gebruik deze niet wanneer parallelle vertakkingen eindigen in afzonderlijke Output-nodes.

Zie ook [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) en [Output](../nodes/output-node.md) bij het opnieuw combineren van vertakkingen.

#### [Loop](../nodes/loop-node.md)

De Loop-node itereert over een array en voert downstream-nodes uit voor elk item. De node vereist een terugverbinding vanaf de laatste node in de iteratie-body om verder te gaan. Gebruik binnen de loop-body `item`, `index`, `total`, `isFirst` en `isLast`; de loop heeft afzonderlijke uitvoeren voor het iteratiepad en het done-pad.

Combineert met [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) en [Expression DSL](./expression-dsl.md) voor iteratieve workflows.

### Data

#### [Set](../nodes/set-node.md)

De Set-node transformeert en mapt invoergegevens naar aangepaste uitvoer. Definieer key-value-mappings waarbij elke waarde een [Expression DSL](./expression-dsl.md)-expressie is. Gebruik deze voor uppercase, substring, concatenatie, willekeurige getallen en vergelijkbare transformaties. Toegang tot de uitvoer via key (bijv. `$setNode.keyName`). Wanneer de node als canvas-node-tool is verbonden met een agent, kunnen mapping-waarden worden gemarkeerd als agent-provided, zodat de agent deze tijdens runtime invult. Gebruik voor het aanroepen van andere workflows de [Execute](../nodes/execute-node.md)-node.

Zie ook [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) en [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

De Converter-node converteert gegevens tussen formaten zonder dat u code hoeft te schrijven. De tekstconversies zijn `csvToJson` (CSV-tekst naar een array van rijobjecten, of arrays wanneer er geen header is), `jsonToCsv` (een array van objecten/rijen naar CSV-tekst), `xmlToJson` (XML-tekst naar een object) en `jsonToXml` (een object naar XML-tekst). Configureer de conversierichting en de bronexpressie; CSV-conversies gebruiken daarnaast een scheidingsteken en header-afhandeling, en `jsonToCsv` kan een expliciete kolomvolgorde vastleggen. Quoting, ingesloten scheidingstekens en ingesloten regeleinden volgen RFC 4180. XML-attributen gebruiken `@`-prefixen, tekst gemengd met attributen gebruikt `#text`, herhaalde elementen worden arrays, en XML-entiteitsexpansie is uitgeschakeld. Dezelfde node werkt ook op opgeslagen bestanden. `imageToText` en `pdfToText` voeren Tesseract OCR uit, lezen een bestand van Heym Drive (`$Upload.file.id` van een File upload-trigger, een Drive-node-resultaat, of een door een agent gegenereerd bestand), kiezen de taal automatisch op basis van het gedetecteerde schrift of gebruiken codes die u opgeeft zoals `tur` of `eng+tur`, en normaliseren de tekst standaard naar UTF-8 met optionele NFC-normalisatie en smallere tekensets zoals `cp1254`. `fileConvert` herschrijft een opgeslagen bestand in een ander formaat, documenten via pandoc en afbeeldingen via Pillow, en slaat het resultaat op als een nieuw Drive-bestand zonder het origineel aan te tasten. Het resultaat is beschikbaar als `$converterNode.result`, met `.language`, `.encoding`, `.page_count`, `.pages` en `.file` daarnaast voor OCR-uitvoeringen, en `.id`, `.filename` en `.download_url` voor `fileConvert`.

Zie ook [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) en [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

De Code-node voert Python uit dat u schrijft, met een eigen `requirements.txt`, in een container die voor elke uitvoering wordt aangemaakt en vernietigd. Uw code definieert een `main(params)`-functie en retourneert een willekeurige JSON-serialiseerbare waarde, die `$codeNode.result` wordt; alles wat deze print wordt apart vastgelegd als `$codeNode.logs`, en `$codeNode.install` rapporteert welke tool de afhankelijkheden heeft geïnstalleerd. Parameters worden geconfigureerd als een JSON-object waarvan de `$`-expressies worden opgelost vóór de uitvoering, en de code leest ze met puntnotatie zoals `params.user.name` of `params.orders[0].id`. Afhankelijkheden worden geïnstalleerd met `uv`, met terugval naar `pip` voor pakketten die `uv` niet aankan, zonder caching tussen uitvoeringen; als `requirements.txt` leeg blijft, wordt installatie volledig overgeslagen en dat is veel sneller. De uitvoeringsfase heeft geen netwerk tenzij `codeAllowNetwork` is ingeschakeld, terwijl de installatie van afhankelijkheden altijd PyPI bereikt. De sandbox draait non-root met alle capabilities ingetrokken, een alleen-lezen root-bestandssysteem, geen Docker-socket en geen toegang tot backend-secrets, beperkt tot 512 MB geheugen, één CPU, 256 processen, een installatie van 120 seconden en een uitvoering van 60 seconden. Docker is vereist en er is geen terugvalmodus: zonder bereikbare daemon faalt de node in plaats van uw code in het backend-proces uit te voeren.

#### [Variable](../nodes/variable-node.md)

De Variable-node stelt een workflow-lokale variabele (`$vars.variableName`) of een persistente [global variable](./global-variables.md) (`$global.variableName`) in of werkt deze bij. Gebruik deze voor tellers, verzamelde lijsten en gedeelde status. Configureer variabelenaam, waarde-expressie, type-coercion en of deze in de global store moet worden opgeslagen. Array-variabelen ondersteunen `$array()` en `.add()`.

Combineert met [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) en [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

De Execute-node roept een andere workflow (sub-workflow) aan en geeft invoer door. Geef de doel-workflow op via ID en lever invoer via een enkele expressie of key-value-mappings. De uitvoer bevat workflow_id, status en outputs; gebruik deze voor herbruikbare logica, niet voor gegevenstransformatie (gebruik daarvoor Set).

Zie ook [Canvas Features](./canvas-features.md) voor Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) en [Output](../nodes/output-node.md).

### Integraties

#### [HTTP](../nodes/http-node.md)

De HTTP-node doet HTTP-verzoeken met een cURL-achtige configuratie. Deze kan een workflow-startpunt zijn (geen inkomende edge) of invoer ontvangen van upstream-nodes. De respons is beschikbaar als status, headers en body (geparseerde JSON indien van toepassing). Gebruik [Credentials](./credentials.md) voor Bearer- of aangepaste header-authenticatie.

Combineert met [Webhooks](./webhooks.md), [Credentials](./credentials.md) en [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

De WebSocket Send-node opent een uitgaande clientverbinding, verzendt één tekst-/JSON-/binair bericht en sluit deze. Gebruik deze om workflow-uitvoer naar realtime-systemen te publiceren zonder een door Heym gehost socket-endpoint aan te maken.

Zie ook [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) en [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

De Telegram-node verzendt een botbericht naar een chat, groep of kanaal. Configureer een Telegram-[referentie](./credentials.md), stel `chatId` in en stel het uitgaande `message` samen met [Expression DSL](./expression-dsl.md)-expressies. De node combineert op natuurlijke wijze met [Telegram Trigger](../nodes/telegram-trigger-node.md) voor conversationele workflows en met [Error Handler](../nodes/error-handler-node.md) voor waarschuwingen aan operators.

Zie ook [Third-Party Integrations](./integrations.md) en [Referenties](./credentials.md) voor configuratie en referentiepatronen.

#### [Slack](../nodes/slack-node.md)

De Slack-node verzendt een bericht naar een Slack-kanaal via een Incoming Webhook. Configureer een Slack-[referentie](./credentials.md) en een berichtexpressie. Gebruik de node voor notificaties, waarschuwingen en foutrapportage; de uitvoer wordt ongewijzigd doorgegeven.

Combineert met [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) en [Third-Party Integrations](./integrations.md).

#### [Discord](../nodes/discord-node.md)

De Discord-node verzendt een bericht naar een Discord-kanaal via een Incoming Webhook. Configureer een Discord-[referentie](./credentials.md), stel het uitgaande bericht samen met [Expression DSL](./expression-dsl.md) en stel optioneel overschrijvingen in voor de webhook-gebruikersnaam of avatar.

Combineert met [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) en [Third-Party Integrations](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

De Send Email-node verzendt e-mails via SMTP. Configureer een SMTP-[referentie](./credentials.md) en [Expression DSL](./expression-dsl.md)-expressies voor ontvanger(s), onderwerp en berichttekst. Gebruik de node voor notificaties, waarschuwingen en transactionele e-mails. De uitvoer bevat status, to en subject.

De [IMAP Trigger](../nodes/imap-trigger-node.md) vormt een aanvulling op Send Email door inkomende e-mail te verwerken. Samen stellen zij een workflow in staat om inkomende e-mail uit een gedeelde inbox te lezen, deze met AI-nodes samen te vatten of te classificeren en een vervolg- of escalatiebericht te verzenden. De [Telegram Trigger](../nodes/telegram-trigger-node.md) en de [Telegram-node](../nodes/telegram-node.md) bieden hetzelfde inkomende/uitgaande patroon voor botgestuurde chatworkflows.

Voor tweerichtingsnotificatiestromen combineert de node eveneens goed met [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) en [Third-Party Integrations](./integrations.md).

#### [Redis](../nodes/redis-node.md)

De Redis-node voert Redis-bewerkingen uit: set, get, hasKey en deleteKey. Gebruik de node voor caching, rate limiting en key-value-opslag. Configureer een [referentie](./credentials.md), het bewerkingstype, een key-expressie en voor set-bewerkingen een waarde en optionele TTL. De uitvoer verschilt per bewerking (value, success, exists, deleted).

Combineert met [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) en [Parallel Execution](./parallel-execution.md) voor caching, throttling en coördinatie.

#### [Grist](../nodes/grist-node.md)

De Grist-node leest, schrijft en beheert gegevens in Grist-spreadsheets. De bewerkingen omvatten getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables en listColumns. Geef het document-ID, tabel-ID en voor create/update de recordgegevens op basis van kolom-ID's. Gebruik de node voor CRUD, batchupdates en spreadsheetautomatisering.

Zie ook [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) en [Third-Party Integrations](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

De Google Sheets-node leest, schrijft en beheert spreadsheetgegevens via OAuth2. Gebruik de node om rapporten te lezen, workflowresultaten toe te voegen, trackers bij te werken en werkbladtabs te wissen of te inspecteren vanuit een workflow. Net als [BigQuery](../nodes/bigquery-node.md) maakt de node gebruik van een door Google ondersteunde integratiereferentie en past deze goed naast [Grist](../nodes/grist-node.md) wanneer spreadsheetgegevens deel uitmaken van de flow.

Combineert met [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) en [Third-Party Integrations](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

De BigQuery-node voert SQL-query's uit en voegt rijen in Google BigQuery-datasets in via OAuth2. De node is nuttig voor analytics-workflows, rapportagepijplijnen en het wegschrijven van gestructureerde gebeurtenisgegevens vanuit workflowuitvoeringen. De node combineert vaak met [Set](../nodes/set-node.md) voor het vormgeven van rijen en [Google Sheets](../nodes/google-sheets-node.md) voor lichtere, op spreadsheets gerichte rapportage.

Combineert met [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) en [Third-Party Integrations](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

De Google Drive-node geeft Drive-bestanden en -mappen weer, downloadt, werkt bij en verwijdert deze via OAuth2, en kan een Drive-bestand rechtstreeks naar [Heym Drive](../nodes/drive-node.md) kopiëren met de bewerking `syncToHeymDrive`. Google Docs, Sheets en Slides hebben geen downloadbare bytes, dus de node exporteert deze automatisch — Docs naar PDF, Sheets naar XLSX, Slides naar PPTX — met een override voor het doelformaat. Verwijderingen verplaatsen items naar de Drive-prullenbak, tenzij "Permanent verwijderen" is ingeschakeld, en de node weigert een map te verwijderen via de bestandsbewerking of andersom. Net als [Google Sheets](../nodes/google-sheets-node.md) gebruikt deze een door Google ondersteunde OAuth2-referentie; let op dat deze volledige Drive-toegang aanvraagt, dus raadpleeg [Referenties delen](./credentials-sharing.md) voordat u deze deelt.

Combineert met [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) en [Integraties van derden](./integrations.md).

#### [GitHub](../nodes/github-node.md)

De GitHub-node biedt 40 native GitHub REST-acties voor repositories, organisaties en gebruikers, issues, pull requests, reviews, releases, Actions-workflows, verkeersinzichten en repositorybestanden. Gebruik deze voor issue-triage, reviewautomatisering, workflow-dispatch en het wachten op voltooiing, releaseautomatisering en het bijwerken van repobestanden zonder handmatig HTTP-verzoeken op te bouwen. Deze ondersteunt GitHub.com en een optionele GitHub Enterprise `base_url` op de referentie.

Combineert met [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) en [Integraties van derden](./integrations.md).

#### [Jira](../nodes/jira-node.md)

De Jira-node verbindt workflows met Jira Cloud of Jira Data Center / Server REST API's voor automatisering van projecten, issues, opmerkingen, bijlagen, gebruikers, meldingen en transities. Deze kan projecten weergeven, issues doorzoeken met JQL, issues aanmaken of bijwerken, changelogs inspecteren, belanghebbenden op de hoogte stellen, opmerkingen en bijlagen beheren, gebruikers ophalen of beheren, beschikbare transities weergeven en issues verplaatsen via een transitie-ID. Gebruik een Jira-referentie met Atlassian-e-mail, API-token, site-basis-URL en implementatiemodus.

Combineert met [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) en [Integraties van derden](./integrations.md) voor supportintake, bugtriage en releaseworkflows.

#### [Linear](../nodes/linear-node.md)

De Linear-node verbindt workflows met de GraphQL API van Linear voor automatisering van workspaces en issues. Deze kan teams, projecten, issues, workflowstatussen, teamleden en opmerkingen weergeven; issues aanmaken, bijwerken, verwijderen en koppelen; en opmerkingen aanmaken, bijwerken, oplossen, heropenen of verwijderen. Gebruik een persoonlijke API-sleutel van Linear of een OAuth2-referentie, en ontdek vervolgens team-, project-, status- en toegewezen-UUID's via lijstbewerkingen voordat u issues aanmaakt of bijwerkt.

Combineert met [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) en [Integraties van derden](./integrations.md) voor intake-, triage- en engineering-backlogworkflows.

#### [Supabase](../nodes/supabase-node.md)

De Supabase-node leest en muteert tabellen die via Supabase PostgREST worden blootgesteld. Deze werkt goed voor productbackends, gebruikers-/profielgegevens, workflowstatus en CRUD-achtige automatiseringen die databasetoegang willen zonder aangepaste HTTP-verzoekbedrading.

Combineert met [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) en [Integraties van derden](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

De ClickHouse-node voert CRUD-, count- en raw SQL-bewerkingen uit op een externe ClickHouse-database via de HTTP-interface. Deze is geschikt voor analysedata-pipelines, gebeurtenislogging en rapportageworkflows: voeg gebeurtenissen in zodra ze plaatsvinden en aggregeer of tel ze vervolgens met `query`/`count`. Deze volgt dezelfde set bewerkingen als [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) plus een raw SQL-uitweg, waarbij `update`/`remove` als ClickHouse-mutaties worden uitgevoerd.

Combineert met [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) voor geplande rapporten en [Integraties van derden](./integrations.md).

#### [Notion](../nodes/notion-node.md)

De Notion-node beheert Notion-databases, gegevensbronnen, pagina's en blokken via de huidige Notion API (`2026-03-11`). Deze ondersteunt zoeken, pagina-CRUD, database- en gegevensbronbewerkingen, blokchildren, blokken toevoegen/bijwerken/verwijderen en prullenbak/herstellen. Gebruik een interne integratietoken of een OAuth-referentie voor een openbare Notion-integratie. De editor kan doorzoekbare gegevensbronnen en bovenliggende pagina's doorzoeken en met cursor pagineren. Gedeelde referenties werken hetzelfde als eigen referenties voor workflowuitvoering.

Voor aangepaste REST-aanroepen verwijst `$credentials.YourNotionCredential` naar hetzelfde bearer-token. Combineert met [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) en [Integraties van derden](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

De Sentry-node automatiseert Sentry-organisaties, -projecten, -teams, -issues, -events en -releases via de Sentry REST API. Gebruik deze voor alert-triage, statusupdates van issues, release-automatisering, het opzoeken van events en het opzetten of opruimen van projecten en teams. De node ondersteunt Sentry SaaS en self-hosted Sentry via een optionele base URL in de referentie.

Combineert met [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) en [Third-Party Integrations](./integrations.md) voor incident- en release-workflows.

#### [DataTable](../nodes/datatable-node.md)

De DataTable-node leest, schrijft en beheert gegevens in Heym DataTables (first-party gestructureerde opslag). De bewerkingen omvatten find, getAll, getById, insert, update, remove en upsert. Er zijn geen externe referenties vereist. Tabellen worden beheerd vanuit het dashboardtabblad [DataTable](../tabs/datatable-tab.md) en direct benaderd door de eigenaar van de workflow.

Combineert met [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) en het [DataTable-tabblad](../tabs/datatable-tab.md) voor first-party gestructureerde opslag.

#### [Drive](../nodes/drive-node.md)

De Drive-node beheert bestanden die door skills zijn gegenereerd, direct vanuit een workflow. De bewerkingen omvatten delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams en unshareWithMyTeams voor het beheren van read-only teamtoegang; formaatconversie vindt plaats in de [Converter](../nodes/converter-node.md)-node. Verwijs naar het bestand met `$agentLabel._generated_files[0].id`; de uitvoer omvat status, file_id, bijgewerkte download_url voor linkbeperkingen en shared_team_count voor teamdeling. Dit is met name nuttig bij [Agent Node](../nodes/agent-node.md)-workflows die gebruikmaken van [File Generation](./file-generation.md) en het [Drive](./drive.md)-referentiemodel.

Veelvoorkomende metgezellen zijn [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) en [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

De Amazon S3-node voert objectopslagbewerkingen uit op Amazon S3 met behulp van een `s3`-referentie (access key, secret key, regio, optioneel session token). De bewerkingen omvatten putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder en listBuckets. Uploaden van tekst en downloaden van tekst of base64 worden ondersteund, waarbij de velden voor bucket en key [Expression DSL](./expression-dsl.md) accepteren. Gebruik deze om workflow-uitvoer op te slaan, bestanden te archiveren en objecten terug in een flow te lezen.

Combineert met [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) en [Third-Party Integrations](./integrations.md).

### Automatisering

#### [Crawler](../nodes/crawler-node.md)

De Crawler-node scrapet webpagina's met FlareSolverr en optionele HTML-extractie via CSS-selectors. Configureer een FlareSolverr-[referentie](./credentials.md), een URL-expressie, wachttijd en optionele selectors voor extractie. De uitvoer is de ruwe HTML of de geëxtraheerde inhoud. Gebruik deze voor webscraping en contentextractie.

Combineert met [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) en [LLM](../nodes/llm-node.md) voor scrape-en-analyse-flows.

#### [Playwright](../nodes/playwright-node.md)

De Playwright-node automatiseert browserinteracties met configureerbare stappen (navigate, refresh, click, type, screenshot, extract, aiStep) of de modus **Run Code** voor aangepaste Playwright Python (gesandboxed; standaard uitgeschakeld via `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). De node ondersteunt headless modus, een optionele instelling die veelvoorkomende Playwright-automatiseringssignalen vermindert, time-outs, optionele netwerkopname (responses, cookies, localStorage, sessionStorage), cookie-/storageState-authenticatiebootstrap vanuit [Global Variables](./global-variables.md)-expressies zoals `$global.authState`, fallback-loginstappen wanneer het herstellen van authenticatie mislukt, en een AI-stap met Auto Heal wanneer selectors falen. Gebruik deze voor webscraping, het invullen van formulieren en browsergebaseerde workflows.

Zie ook [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) en [Execution History](./execution-history.md) voor browserautomatisering en debugging.

### Hulpprogramma's

#### [Output](../nodes/output-node.md)

De Output-node is het workflow-endpoint dat de respons aan de aanroeper retourneert. Stel de berichtexpressie in om naar de vorige node te verwijzen via het label (gebruik hier nooit `$input` van de [Input](../nodes/input-node.md)-node). Optionele asynchrone downstream maakt het mogelijk dat nodes na de output op de achtergrond worden uitgevoerd nadat de respons is verzonden.

Veelvoorkomende upstream-bronnen zijn [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) en [Execute](../nodes/execute-node.md); het vormgeven van de respons is eenvoudiger te debuggen in [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

De JSON output mapper-node bouwt een eenvoudig JSON-object op uit key-value-mappings in [Set](../nodes/set-node.md)-stijl en retourneert dit in de hoofdmap van de workflow-respons. Gebruik deze wanneer een API-aanroeper een onbewerkte JSON-body moet ontvangen in plaats van de standaard wrapper van de [Output](../nodes/output-node.md)-node.
#### [HTML output mapper](../nodes/html-output-mapper-node.md)

De HTML output mapper-node rendert één HTML-sjabloon en interpoleert `$nodeLabel.field`-expressies in de pagina. Wanneer dit de enige terminale node van de workflow is, antwoordt de execute-webhook met `text/html` en de geconfigureerde statuscode van de node in plaats van een JSON-body, zodat een workflow rechtstreeks een pagina aan een browser kan leveren. Verstuur `X-Simple-Response: false` om de gebruikelijke JSON-envelope terug te krijgen voor foutopsporing.

Vormt een paar met [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) en [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

De Chart Output-node is de terminale node van een [Dashboard](../tabs/dashboard-tab.md)-widgetworkflow. Deze zet de rijen die door upstream-nodes zijn geproduceerd om in een gestandaardiseerde chart-payload die het dashboard rendert. Kies een `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text of HITL), koppel `labelField`/`valueField` (of `series` voor meerdere reeksen, of `text` voor een markdown-bericht) en plaats deze als laatste; de node heeft geen uitvoerrand. HITL negeert upstream-rijen en toont uw openstaande menselijke beoordelingen.

Zie ook [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) en [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

De Wait-node pauzeert de uitvoering van de workflow gedurende een opgegeven duur in milliseconden, tot maximaal 15 minuten. Gebruik deze voor rate limiting, vertraagde acties of polling-intervallen. De node geeft de invoer ongewijzigd door.

Vormt een paar met [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) en [Parallel Execution](./parallel-execution.md) voor het doseren en pollen.

#### [Sticky Note](../nodes/sticky-note-node.md)

De Sticky Note-node voegt markdown-notities toe aan het canvas. De node wordt niet uitgevoerd. Gebruik deze voor documentatie, instructies of workflow-notities naast andere [Canvas Features](./canvas-features.md). Dubbelklik op het canvas om de inhoud van de notitie te bewerken.

Zie ook [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) en [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

De Console Log-node logt een waarde naar de backend-console (serverconsole). Gebruik deze voor foutopsporing en inspectie tijdens de ontwikkeling. Het logbericht ondersteunt [Expression DSL](./expression-dsl.md)-expressies; de uitvoer geeft de invoer door.

Vormt een paar met [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) en [Expression Evaluation Dialog](./expression-evaluation-dialog.md) voor foutopsporing.

#### [Disable Node](../nodes/disable-node.md)

De Disable Node-node schakelt een andere node in de workflow permanent uit door de `active`-flag op false te zetten. Geef de doelnode op via het label. Gebruik deze voor eenmalige handelingen, zoals het stoppen van een [Cron](../nodes/cron-node.md)-trigger nadat aan een voorwaarde is voldaan.

Zie ook [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) en [Cron](../nodes/cron-node.md) voor patronen voor workflowbesturing.

#### [Enable Node](../nodes/enable-node.md)

De Enable Node-node schakelt een andere node weer in door de `active`-flag op true te zetten en de wijziging op te slaan. Geef de doelnode op via het label. Gebruik deze om een uitgeschakelde [Cron](../nodes/cron-node.md)-trigger opnieuw te activeren vanuit een ander toegangspunt, of om een node in te schakelen zodra aan een voorwaarde is voldaan. Een doel dat zich downstream van de Enable Node bevindt en nog niet is uitgevoerd, wordt ook in de huidige uitvoering uitgevoerd.

Zie ook [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) en [Cron](../nodes/cron-node.md) voor patronen voor workflowbesturing.

#### [Throw Error](../nodes/throw-error-node.md)

De Throw Error-node stopt de uitvoering van de workflow onmiddellijk en retourneert een foutrespons met een aangepaste HTTP-statuscode. Stel de expressie voor het foutbericht en de statuscode in (bijv. 400, 401, 403, 404, 429, 500). Gebruik deze voor validatiefouten, ongeautoriseerde toegang of andere foutcondities, vooral in combinatie met [Condition](../nodes/condition-node.md) en [Error Handler](../nodes/error-handler-node.md).

Vormt een paar met [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) en [Security](./security.md) voor expliciete faalpaden.

---

## Referentie
### [Node-typen](./node-types.md)

Heym biedt een verscheidenheid aan node-typen: triggers zoals [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) en [Error Handler](../nodes/error-handler-node.md); AI-nodes zoals [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) en [MCP Call](../nodes/mcp-call-node.md); logic-nodes zoals [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) en [Loop](../nodes/loop-node.md); data-nodes zoals [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) en [Heym](../nodes/heym-node.md); integraties zoals [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) en [Drive](../nodes/drive-node.md); automatiseringsnodes zoals [Crawler](../nodes/crawler-node.md) en [Playwright](../nodes/playwright-node.md); en hulpmiddelen zoals [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) en [Sticky Note](../nodes/sticky-note-node.md). Gebruik expressies zoals `$input.text` en `$nodeLabel.field` in de node-configuratie.

Zie ook [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) en [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym gebruikt een eenvoudige expressietaal om gegevens van upstream-nodes te refereren. Gebruik `$input` voor de [Input](../nodes/input-node.md)-node, `$nodeLabel.field` voor elke upstream-node, `$credentials.CredentialName` voor [referenties](./credentials.md) en `$global.variableName` voor [globale variabelen](./global-variables.md). Ingebouwde speciale variabelen zijn onder andere `$now`, `$UUID` en workflow-metadata: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` en `$executionId` (het id van de [Uitvoeringsgeschiedenis](./execution-history.md) van de run — `/workflows/{id}/{executionId}` opent die run op het canvas; alleen tijdens runtime, leeg in het expressie-voorbeeldvenster). Ondersteuning omvat literals, rekenkunde, vergelijkingen, [Loop](../nodes/loop-node.md)-context, geneste velden en string-/array-helpers (waaronder `$text.toJson()` om een JSON-string te parsen). Wanneer de volledige waarde één enkele `$expr` is, behoudt de backend arrays, objecten, booleans en getallen als native typen.

Zie ook [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) en [Workflow Structure](./workflow-structure.md).

### [Globale variabelen](./global-variables.md)

De Global Variable Store bevat persistente, gebruikersgebonden key-value-gegevens die bewaard blijven over workflow-uitvoeringen heen. Maak variabelen aan vanuit het tabblad [Variables](../tabs/global-variables-tab.md) of vanuit een [Variable](../nodes/variable-node.md)-node met "Store in Global Variable Store" ingeschakeld. Benader ze met `$global.variableName` in expressies; ze kunnen worden gedeeld met andere gebruikers of [teams](./teams.md).

Combineert met [Variable](../nodes/variable-node.md), [Teams](./teams.md) en [Credentials Sharing](./credentials-sharing.md) voor gedeelde workflow-status.
### [Dialoogvenster Expressie-evaluatie](./expression-evaluation-dialog.md)

Het dialoogvenster Expressie-evaluatie is een uitbreidbare editor die verschijnt wanneer u op de uitbreidingsknop naast expressievelden klikt. Het opent als een grote gecentreerde modal, houdt autocomplete actief en ververst de preview-uitvoer van de backend automatisch nadat u stopt met typen. Object- en arrayresultaten kunnen worden verkend met de uitvoerpadkiezer. Het dialoogvenster accepteert een volledige regel met een kale puntpad (bijvoorbeeld `myNode.output.field`) alsof het `$myNode.output.field` is; zie de plaatsingsregels van de [Expression DSL](./expression-dsl.md).

Met de knop **Build with AI** in de werkbalk kunt u de gewenste expressie in platte tekst beschrijven. Selecteer een LLM-[referentie](./credentials.md) en model, typ een beschrijving zoals *"Get the customer name from the API response"* en klik op Generate. De backend stuurt de [Expression DSL](./expression-dsl.md)-context en de uitvoer van de laatst uitgevoerde node naar het model en retourneert één expressiestring. Het resultaat wordt onmiddellijk geëvalueerd, zodat u het kunt verifiëren voordat u op Apply klikt.

Combineert van nature met [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) en [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Workflow-structuur](./workflow-structure.md)

Workflows worden opgeslagen als JSON met nodes en edges. Het workflow-object bevat id, name, description, nodes, edges en auth-instellingen. Elke node heeft id, type, position en data (label en typespecifieke configuratie). Edges verbinden source- en target-node-ID's met optionele handle-ID's. De expressiesyntaxis in datavelden volgt de [Expression DSL](./expression-dsl.md), en dezelfde structuur wordt gebruikt door [Download & Import](./download-import.md).

Zie ook [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md) en [Download & Import](./download-import.md).

### [Canvas-functies](./canvas-features.md)

Beweeg de muis over een niet-sticky canvas-node en klik op **Run** om tot die node uit te voeren. Vereiste invoer wordt geopend in het Run-paneel met het eerste veld gefocust; paden zonder invoer starten onmiddellijk. Zie [Run to Node](./canvas-features.md#run-to-node).

De workflow-editor biedt Data Pin (de laatste uitvoer van een node vastzetten om downstream te testen zonder opnieuw uit te voeren), Execution Logs (realtime node-resultaten en agent-voortgang die [Execution History](./execution-history.md) aanvullen), Enable/Disable (nodes tijdens uitvoering overslaan) en Extract to Sub-Workflow (een selectie naar een nieuwe workflow verplaatsen en vervangen door een [Execute](../nodes/execute-node.md)-node). Een actieve productie-uitvoering kan worden geopend vanuit Geschiedenis of een Board-kaart; de editor herstelt de huidige snapshot, maakt verbinding met SSE en houdt de canvas-animatie en Debug-logs live. [Keyboard Shortcuts](./keyboard-shortcuts.md) ondersteunen kopiëren, plakken, uitvoeren en inline node-zoeken.

Zie ook [Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md) en [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym biedt sneltoetsen in de hele editor: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo en Escape om te sluiten. Op het canvas: alles selecteren, meervoudige selectie, kopiëren/knippen/plakken, verwijderen, node in-/uitschakelen (D), vastgezette data in-/uitschakelen (P) en inline node-zoeken door te typen. Sneltoetsen zijn gedocumenteerd in de in-app referentie en werken nauw samen met [Canvas Features](./canvas-features.md) zoals Data Pin en het in-/uitschakelen van nodes.

Zie ook [Canvas Features](./canvas-features.md), [Quick Drawer](./quick-drawer.md) en [Contextual Showcase](./contextual-showcase.md).

### [AI Assistant](./ai-assistant.md)

De AI Assistant is een chatpaneel dat wordt geopend vanuit het Debug-paneel en waarmee u workflows kunt maken of wijzigen met natuurlijke taal. Selecteer een [referentie](./credentials.md) en model en beschrijf vervolgens wat u wilt; de AI streamt een antwoord en elke geldige [workflow-JSON](./workflow-structure.md) in een codeblok wordt automatisch geparseerd en toegepast op het canvas. Spraakinvoer wordt ondersteund in compatibele browsers.

Schakel **YOLO mode** in (Agent-modus, standaard uit) en de assistent test wat hij bouwt. Na elke wijziging voert hij de workflow op het canvas uit, leest het resultaat en corrigeert de workflow tot deze doet wat u hebt gevraagd, voor maximaal 5 uitvoeringen per bericht. Hij vraagt om testinvoer vóór de eerste uitvoering, kan uw andere workflows uitvoeren wanneer hij hun resultaat nodig heeft en toont elke stap terwijl hij werkt. Zie [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode).

Wanneer een workflow records opslaat, vraagt de assistent welke [gegevenstabel](../tabs/datatable-tab.md) moet worden gebruikt, of maakt er een aan met de kolommen die de workflow nodig heeft. Zie [AI Assistant › Data tables](./ai-assistant.md#data-tables).

Wanneer de huidige workflow [Agent Node](../nodes/agent-node.md)-skills bevat, stuurt de assistent alleen de `SKILL.md` van elke skill naar de workflowcontext. Bijgevoegde `.py`-bestanden en binaire skill-assets worden vóór het verzoek uitgesloten, zodat grote skill-bundels het contextvenster van het model niet overschrijden.

Combineert goed met [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md) en [Expression DSL](./expression-dsl.md).
### [Chat met Heym](./chat-with-heym.md)

Chat met Heym is een documentatie-header-assistent voor productvragen. Het opent in een gecentreerde dialoog, houdt de selectie van referenties en modellen zichtbaar bovenaan, injecteert het pad van de actieve documentatiepagina als context en wist de berichtgeschiedenis wanneer de dialoog wordt gesloten. Het vormt een aanvulling op de bredere [AI Assistant](./ai-assistant.md) en de lichtere [Contextual Showcase](./contextual-showcase.md).

Zie ook [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) en [Node Types](./node-types.md).

### [Workflow-organisatie](./workflow-organization.md)

Instantiebeheerders (`HEYM_ADMIN_EMAILS`) hebben toegang tot en kunnen elke workflow bewerken, de workflows van een eigenaar vinden op e-mailadres, tijdschema's en uitvoeringsgeschiedenis inspecteren, automatische triggers pauzeren en hervatten, en workflows verwijderen zodra uitvoeringen zijn afgerond. Zie [Instance Administration](../tabs/workflows-tab.md#instance-administration) voor de offboarding-flow en het onderscheid tussen het pauzeren van automatische triggers en het blokkeren van alle aanroepen.

Workflows kunnen worden georganiseerd in mappen en submappen in een boomstructuur. Mappen hebben namen en een optionele bovenliggende map; workflows worden aan mappen toegewezen. Workflows kunnen voor verwijdering worden gepland (verplaatst naar een prullenbakgebied vóór definitieve verwijdering). De API ondersteunt het aanmaken, bijwerken, verwijderen en verplaatsen van workflows tussen mappen, en hetzelfde organisatiemodel verschijnt in het tabblad [Workflows](../tabs/workflows-tab.md).

Zie ook [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) en [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

De Quick Drawer is een vast paneel aan de rechterzijde voor snel uitvoeren op interne niet-canvas-pagina's. Het stelt u in staat om [workflows](../tabs/workflows-tab.md) te doorzoeken, favorieten vast te pinnen, invoer te selecteren, onmiddellijk uit te voeren en de voortgang of resultaten te inspecteren zonder de editor te openen. Een workflow met een [File Upload Trigger](../nodes/file-upload-trigger-node.md) accepteert een gesleept of gekozen bestand. De volgorde van vastgepinde items en de laatst geselecteerde workflow worden opgeslagen in de browser.

Zie ook [Workflow-organisatie](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) en [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

De Contextual Showcase is een compacte begeleidingsrail in de applicatie voor geauthenticeerde hoofdoppervlakken zoals dashboardtabbladen, [Evals](../tabs/evals-tab.md), Docs en de workflow-editor. Deze blijft standaard gesloten, geeft eerst een korte samenvatting van de pagina, biedt op verzoek wat extra detail en linkt naar het volledige documentatieartikel wanneer u diepgaandere begeleiding wenst.

Vormt een paar met [Chat met Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) en [AI Assistant](./ai-assistant.md) voor begeleidingsflows in de applicatie.

### [Referenties](./credentials.md)

Referenties slaan API-sleutels en secrets op die door workflow-nodes worden gebruikt. Voeg ze toe in het tabblad [Credentials](../tabs/credentials-tab.md) en verwijs ernaar op naam of ID in nodes zoals [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) en [Redis](../nodes/redis-node.md). Ze worden versleuteld opgeslagen, kunnen worden gedeeld met gebruikers of [teams](./teams.md) en kunnen ook worden gerefereerd in [Expression DSL](./expression-dsl.md) via `$credentials.Name`.

Zie ook [Credentials](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md) en [Third-Party Integrations](./integrations.md).

### [Credentials Sharing](./credentials-sharing.md)

Referenties kunnen met andere gebruikers worden gedeeld via e-mail of met teams; alle teamleden krijgen toegang wanneer een referentie met een team wordt gedeeld. Gedeelde referenties verschijnen met een indicator in het tabblad [Credentials](../tabs/credentials-tab.md). Tijdens runtime voegt de context van de workflow-eigenaar eigen, door gebruikers gedeelde en door teams gedeelde referenties samen. Gebruik `$credentials.CredentialName` in expressies of stel credentialId in bij node-data.

Zie ook [Referenties](./credentials.md), [Teams](./teams.md) en [Third-Party Integrations](./integrations.md).

### [Teams](./teams.md)

Met teams kunt u workflows, referenties, globale variabelen, vectorstores en Drive-bestanden in één keer met een groep gebruikers delen. Maak teams aan vanuit het tabblad [Teams](../tabs/teams-tab.md) en voeg leden toe via e-mail. Deel resources met een team vanuit de betreffende deelvensters; alle leden hebben dan toegang. De maker kan het team bewerken en verwijderen; het verwijderen van een team verwijdert alle team-shares.

Vormt een paar met [Credentials Sharing](./credentials-sharing.md), [Global Variables](./global-variables.md) en [Enterprise](./enterprise.md).

### [Parallelle uitvoering](./parallel-execution.md)

Heym voert nodes parallel uit wanneer ze geen afhankelijkheden van elkaar hebben. De executor bouwt een DAG en voert nodes op hetzelfde niveau gelijktijdig uit met een thread pool; zodra een node klaar is, worden de downstream-nodes ingepland. Gebruik de [Merge](../nodes/merge-node.md)-node om parallelle vertakkingen indien nodig samen te voegen. Meerdere workflow-uitvoeringen worden gelijktijdig uitgevoerd; elke uitvoering is geïsoleerd. De modus [SSE Streaming](./sse-streaming.md) zendt gebeurtenissen uit zodra nodes voltooid zijn.

Zie ook [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) en [Execution History](./execution-history.md).
### [Agent-architectuur](./agent-architecture.md)

De [Agent-node](../nodes/agent-node.md) ondersteunt sub-agents (orchestrator roept andere agent-nodes aan via call_sub_agent), sub-workflows (agent roept andere workflows aan via call_sub_workflow), skills (instructiecontent en Python-tools uit .zip of .md) en [MCP](../tabs/mcp-tab.md)-clientverbindingen. De orchestrator-tool-uitvoerder routeert sub-agent- en sub-workflowaanroepen; overige tools gaan naar Python-, MCP- of skill-uitvoerders. De maximale nestingsdiepte voor sub-agents en sub-workflows is 5. De tool-calling-loop bevat automatische contextcompressie: vóór elke iteratie wordt het tokengebruik geschat en als dit 80% van het contextvenster van het model overschrijdt, worden de middelste berichten samengevat met hetzelfde model, waarbij de systeemprompt, het eerste gebruikersbericht en het laatste gebruikersbericht intact blijven.

Zie ook [Agent-node](../nodes/agent-node.md), [Agent persistent geheugen](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) en [MCP](../tabs/mcp-tab.md).

### [Agent persistent geheugen](./agent-persistent-memory.md)

Optionele kennisgraaf per [Agent-node](../nodes/agent-node.md), opgeslagen in Postgres: entiteiten, types, eigenschappen en gerichte relaties. Wanneer `persistentMemoryEnabled` true is, wordt de graaf bij elke uitvoering samengevat in de systeemprompt; na succesvolle voltooiingen extraheert een [LLM](../nodes/llm-node.md) op de achtergrond gestructureerde updates. REST CRUD bevindt zich onder `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. De editor opent via het roze brein-besturingselement op de node.

Zie ook [Agent-node](../nodes/agent-node.md), [Agent-architectuur](./agent-architecture.md) en [Uitvoeringen](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-loop laat een [Agent-node](../nodes/agent-node.md) goedkeuring aanvragen op specifieke controlepunten, een openbare `/review/{token}`-pagina aanmaken en wachten tot een niet-ingelogde reviewer de Markdown-reviewtekst accepteert, bewerkt of weigert. HITL-ingeschakelde agents bieden ook een `review`-uitvoerhandle, zodat u [Slack](../nodes/slack-node.md), [E-mail verzenden](../nodes/send-email-node.md) of andere kanalen kunt informeren terwijl de uitvoering in behandeling is. De HITL-tekst op node-niveau wordt gebruikt als goedkeuringsrichtlijnen, terwijl de samenvatting op de openbare pagina wordt gegenereerd op basis van het reviewverzoek zelf. Uitvoeringen in behandeling verschijnen onmiddellijk in [Uitvoeringsgeschiedenis](./execution-history.md), kunnen meerdere keren in dezelfde uitvoering plaatsvinden en hervatten vanuit de exact opgeslagen workflow-snapshot zodra elke beslissing is ingediend.

Zie ook [Agent-node](../nodes/agent-node.md), [Portaal](./portal.md), [Uitvoeringsgeschiedenis](./execution-history.md) en [E-mail verzenden](../nodes/send-email-node.md).

### [Webhooks](./webhooks.md)

Workflows kunnen worden getriggerd via [HTTP](../nodes/http-node.md) op `POST /api/workflows/{workflow_id}/execute`, of incrementeel worden gestreamd vanaf `POST /api/workflows/{workflow_id}/execute/stream`. De request body wordt doorgegeven als body aan [Invoer](../nodes/input-node.md)-nodes; headers en query params zijn beschikbaar in [Expression DSL](./expression-dsl.md)-expressies. Configureer auth per workflow: anoniem, JWT of aangepaste header. Optionele response caching, rate limiting en de dialoog **Uitvoeren met cURL** van de editor bevinden zich allemaal op de workflow en gelden voor beide modi.

Zie ook [Invoer](../nodes/input-node.md), [Uitvoeringstokens](./execution-tokens.md), [SSE-streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) en [Workflow-structuur](./workflow-structure.md).

### [Uitvoeringstokens](./execution-tokens.md)

Uitvoeringstokens zijn afgebakende JWT's die toegang verlenen tot de execute- en stream-endpoints van één enkele workflow. Wanneer een workflow JWT-authenticatie gebruikt, stellen tokens externe scripts, CI-pipelines en integraties in staat de workflow aan te roepen zonder een gebruikerssessie te delen. Elk token bevat een `wid`-claim die het aan één workflow koppelt, een `jti` voor onmiddellijke intrekking en een configureerbare TTL (60 seconden tot 10 jaar). Maak, selecteer en trek tokens rechtstreeks in vanuit de dialoog **Uitvoeren met cURL** — het geselecteerde token wordt automatisch in het gegenereerde commando ingebed.

Zie ook [Webhooks](./webhooks.md), [Beveiliging](./security.md) en [SSE-streaming](./sse-streaming.md).

### [SSE-streaming](./sse-streaming.md)

De cURL-dialoog kan de uitvoering van [webhooks](./webhooks.md) omschakelen naar Server-Sent Events-modus. Dit produceert `execution_started`-, `node_start`-, `node_complete`- en `execution_complete`-gebeurtenissen in realtime, voegt `--no-buffer` toe aan het gegenereerde cURL-commando en laat u startberichten per node configureren, zoals `[START] LLM` of aangepaste tekst voor externe terminalgebruikers.

Zie ook [Webhooks](./webhooks.md), [Uitvoeringsgeschiedenis](./execution-history.md) en [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Workflows worden gestart door trigger-nodes ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) receive) of entry points: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron scheduler, Telegram webhook, Discord interaction webhook, IMAP trigger manager, RabbitMQ consumer, of Editor run. Elke trigger heeft zijn eigen endpoint of achtergrondproces; [Cron](../nodes/cron-node.md) draait elke 60 seconden, [Telegram Trigger](../nodes/telegram-trigger-node.md)-nodes ontvangen bot-webhooks, [Discord Trigger](../nodes/discord-trigger-node.md)-nodes ontvangen ondertekende interaction-webhooks, en [IMAP Trigger](../nodes/imap-trigger-node.md)-nodes draaien op hun geconfigureerde polling-interval. [Input](../nodes/input-node.md)-nodes ontvangen body, headers en query uit webhook-verzoeken.

Zie ook [Node Types](./node-types.md), [Webhooks](./webhooks.md) en [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

Execution history registreert workflow-runs: inputs, outputs, node-resultaten, status en trigger-bron. U opent deze vanuit de Editor-toolbar, Docs-weergave, Dashboard-header of [Evals](../tabs/evals-tab.md)-weergave. De geschiedenis per workflow toont runs voor de geopende workflow; de allesomvattende geschiedenisweergave toont runs over alle workflows en chat. Momenteel lopende uitvoeringen verschijnen bovenaan beide dialoogvensters met de acties **Open live** en **Cancel**. Open live koppelt de editor aan de bestaande uitvoering via [SSE](./sse-streaming.md), herstelt voltooide nodes, laat de huidige en wachtende nodes pulseren en voegt Debug-logs toe zonder een nieuwe run te starten. Bring to Canvas laadt de inputs en node-outputs van een voltooide run voor heruitvoering of debugging; de deep link `/workflows/{workflowId}/{executionId}` ondersteunt zowel live als voltooide uitvoeringen. Runs die gepauzeerd zijn door [Human-in-the-Loop](./human-in-the-loop.md) worden onmiddellijk opgeslagen als `pending`, inclusief de openbare review-URL en eventuele notificatie-nodes die zijn uitgevoerd vanuit de `review`-branch van de agent. Als de server halverwege een run opnieuw opstart, worden onderbroken runs automatisch hersteld: ze worden vanaf het begin opnieuw uitgevoerd met dezelfde inputs en weergegeven als voltooid (gemarkeerd als **Recovered**), geregeld via een workflow-specifieke schakelaar **Auto-recover runs** die ze in plaats daarvan kan registreren als `skipped`.

Zie ook [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) en [Traces](../tabs/traces-tab.md).

### Execution Highlights

Na een live run — of na **Bring to Canvas** — verschijnt een sluitbare popup **Execution Highlights** in de rechterbovenhoek van het Canvas, met daarin wat elke node heeft geproduceerd in uitvoeringsvolgorde. Het is een snelle manier om de output per node te inspecteren zonder elke node te openen; sluit deze met de **✕**, en de popup verschijnt opnieuw bij de volgende run. Highlights worden ook getoond bij dashboard-runs. Zie [Execution History](./execution-history.md) voor details.

### [Edit History](./edit-history.md)

Edit History houdt opgeslagen versies van een workflow bij (elke Save maakt een versie aan). Bekijk de lijst, open een versie om een diff te zien ten opzichte van de huidige workflow ([nodes](./workflow-structure.md), edges, config) en gebruik Revert om een eerdere versie te herstellen. In tegenstelling tot [Execution History](./execution-history.md) houdt Edit History structuurwijzigingen bij, niet runs.

Zie ook [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) en [Canvas Features](./canvas-features.md).

### Error Workflow

Een workflow kan een andere workflow aanwijzen die wordt uitgevoerd wanneer deze mislukt. Configureer dit in het workflow-specifieke **Properties**-paneel (weergegeven wanneer geen node is geselecteerd) onder **On error, run workflow**. Alleen de eigenaar van de workflow kan dit instellen, wijzigen of wissen; zie [Owner-only settings](./workflow-organization.md#owner-only-settings). Wanneer een top-level run eindigt met een onafgehandelde fout, wordt de geselecteerde error workflow uitgevoerd en ontvangt deze de foutcontext (id en naam van de mislukte workflow, run-id, foutmelding, label en type van de mislukte node, en een tijdstempel). Als het canvas al een [Error Handler](../nodes/error-handler-node.md)-node bevat, krijgt de lokale handler voorrang en wordt de error workflow **niet** aangeroepen. De error workflow zelf wordt direct uitgevoerd, dus deze activeert nooit zijn eigen error workflow.

Dit geldt voor elke niet-test top-level run: beide execute-endpoints, de [Portal](./portal.md) en elke trigger, inclusief [cron](../nodes/cron-node.md), de chatplatform-triggers, e-mail, queues, [MCP](../tabs/mcp-tab.md) en dashboard-widgets. Met [Load Distribution](./cluster.md) ingeschakeld blijft dit ongewijzigd, inclusief runs die een worker heeft uitgevoerd: de mislukte node reist terug met het resultaat, en de error workflow wordt vervolgens gedistribueerd zoals elke andere run, zodat een node daarbinnen die op de main instance moet draaien dat nog steeds doet. Twee gevallen worden bewust buiten beschouwing gelaten, omdat de uitkomst van de workflow zelf nog niet bekend is: een run die door geen enkele instance ooit is uitgevoerd, en een wait die is verlopen terwijl de run mogelijk nog gaande is. Deze wordt ook **niet** geactiveerd door handmatige canvas-testruns.
### Workflow-time-out

Elke workflow kan een **workflow-time-out** in seconden instellen in het paneel **Eigenschappen** op workflowniveau. `0` (de standaardwaarde) schakelt deze uit. Indien ingesteld, wordt een uitvoering die de limiet overschrijdt, gestopt bij de volgende node-grens en geregistreerd als een mislukte uitvoering met een "timed out"-fout. De time-out is van toepassing op handmatige, API- en getriggerde uitvoeringen. Lange [Wait](../nodes/wait-node.md)-nodes worden onmiddellijk onderbroken in plaats van hun volledige duur te blokkeren.

### Bespaarde tijd

Elke workflow kan een **geschatte bespaarde tijd per uitvoering** (in minuten) vastleggen, ingesteld in het paneel **Eigenschappen** op workflowniveau. Het tabblad [Analytics](../tabs/analytics-tab.md) aggregeert dit over het geselecteerde bereik als een totale statistiek **Time Saved** (som van de schatting van elke workflow × het aantal succesvolle uitvoeringen). Most Used vermeldt die som ook per workflow; **Not Set** opent het schattingsveld wanneer dit niet is ingesteld. Het rapport [Workflow Analysis](./workflow-analysis.md) adviseert een schatting in te stellen wanneer er geen is geconfigureerd.

### [Settings](./user-settings.md)

Het dialoogvenster Settings (geopend via uw avatar in de header) heeft vier tabbladen: Profile (Gravatar-afbeelding, weergavenaam, User Rules), [Security](./security.md) (wachtwoord wijzigen), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) en Observability (alleen-lezen [OpenTelemetry](./opentelemetry.md)-status). User Rules zijn aangepaste instructies die in elk AI-verzoek worden geïnjecteerd, inclusief de workflow-builder en [Chat](../tabs/chat-tab.md), zodat u eenmalig taal, toon, codeerstijl of workflow-conventies kunt instellen. Wachtwoordbeleid en [MCP](../tabs/mcp-tab.md)-API-sleutelbeheer zijn ook beschikbaar.

Zie ook [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) en [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym kan OpenTelemetry-traces uitzenden voor elke workflow-uitvoering en node-uitvoering: een root-`heym.workflow.execute`-span per uitvoering en een child-`heym.node.execute`-span per node, met model- en tokengebruik gekoppeld aan LLM- en agent-nodes. Spans worden geëxporteerd via OTLP/HTTP naar elke compatibele backend (Jaeger, Grafana Tempo, Honeycomb, Datadog), en W3C trace context propageert over inkomende webhooks, uitgaande HTTP en sub-workflows. Tracing is standaard uitgeschakeld en wordt geconfigureerd met `HEYM_OTEL_*` [omgevingsvariabelen](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md); de actieve status wordt weergegeven op het tabblad Observability in [Settings](./user-settings.md).

Zie ook [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) en [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Exporteer de huidige workflow als JSON vanuit de werkbalk van de Editor (Download-knop); het bestand bevat nodes en edges. Importeer door een JSON-bestand naar het tabblad [Workflows](../tabs/workflows-tab.md) te slepen (maakt een nieuwe workflow aan) of naar het canvas (vervangt of voegt samen). De JSON moet een nodes-array bevatten; naam en edges zijn optioneel. Gebruik het voor back-up, delen of migreren tussen instanties.

Zie ook [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) en [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

De Portal stelt workflows beschikbaar als openbare chat-UIs op `/chat/{slug}`. Configureer portal_enabled, slug, optionele auth (portal-gebruikers), streaming en bestandsupload per workflow. Eindgebruikers communiceren via een chat-interface zonder in te loggen bij Heym; afbeeldingsuitvoer kan in de chat worden weergegeven. Portal-workflows kunnen ook overdragen aan [Human-in-the-Loop](./human-in-the-loop.md)-beoordelingspagina's wanneer een [Agent Node](../nodes/agent-node.md) goedkeuring vereist, terwijl de `review`-branch van de agent meldingen naar andere kanalen stuurt. Gebruik het voor interne tools, klantgerichte chatbots en AI-aangedreven formulieren.

Zie ook [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) en [Drive](./drive.md).

### [File Generation](./file-generation.md)

Skills kunnen tijdens de uitvoering bestanden genereren zoals PDF, DOCX, CSV, JSON en afbeeldingen door naar de `_OUTPUT_DIR`-werkruimte te schrijven. Heym legt die bestanden automatisch vast, slaat ze op en stelt downloadmetadata beschikbaar onder `_generated_files`, die vervolgens kunnen worden beheerd met de [Drive node](../nodes/drive-node.md) of bekeken in het tabblad [Drive](../tabs/drive-tab.md).

Zie ook [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) en [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive is de gedeelde opslag- en deel-laag voor bestanden die door skills zijn gegenereerd. U kunt bestanden doorbladeren, openbare of met wachtwoord beveiligde links maken, vervaldatums en downloadlimieten toepassen, bestanden alleen-lezen delen met uw teams en die bestanden programmatisch beheren met de [Drive node](../nodes/drive-node.md) of handmatig vanuit het tabblad [Drive](../tabs/drive-tab.md).

Zie ook [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md) en [Portal](./portal.md).
### [Beveiliging](./security.md)

Heym handhaaft een wachtwoordbeleid (lengte, hoofdletters, kleine letters, cijfers), slaat access tokens op in HttpOnly-cookies en roteert refresh tokens bij gebruik. Rate limiting is van toepassing op inloggen, registreren en inloggen via het [Portal](./portal.md). [Referenties](./credentials.md) worden versleuteld opgeslagen met AES-256 (Fernet). De [MCP](../tabs/mcp-tab.md) API key wordt gebruikt voor clientauthenticatie; content safety is beschikbaar via [Guardrails](./guardrails.md) op [LLM](../nodes/llm-node.md)- en [Agent Node](../nodes/agent-node.md)-nodes. [Execution Tokens](./execution-tokens.md) bieden per-workflow scoped JWT's voor externe aanroepers.

Zie ook [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) en [Referenties](./credentials.md).

### [Single Sign-On](./sso.md)

Heym authenticeert personen tegen elke externe OpenID Connect-provider - Keycloak, Okta, Entra ID, Auth0, Google - die tijdens runtime wordt geconfigureerd via **Settings → SSO** door een instance-beheerder die is opgenomen in `HEYM_ADMIN_EMAILS`. Er worden alleen een issuer-URL en client-referenties ingevoerd; elk endpoint komt uit het discovery-document van de provider, zodat geen enkele provider hardcoded is. Aanmelden maakt gebruik van Authorization Code met PKCE, en het ID token wordt geverifieerd tegen de gepubliceerde sleutels van de provider. Accounts worden eerst gekoppeld op basis van `(issuer, subject)` en daarna op basis van geverifieerd e-mailadres, waarbij optionele automatische provisioning beperkt is tot een allowlist van e-maildomeinen. Aanmelden met wachtwoord blijft beschikbaar naast SSO en kan worden uitgeschakeld zodra een verbindingstest slaagt, waarbij accounts in `HEYM_ADMIN_EMAILS` zijn uitgezonderd zodat een verkeerd geconfigureerde provider de instance niet kan blokkeren.

Zie ook [Settings](./user-settings.md), [Beveiliging](./security.md) en [Audit Logging](./audit.md).

### [Load Distribution](./cluster.md)

Wijs een tweede Heym-instance naar dezelfde database en deze sluit aan als worker. Achtergrondtaken - cron, webhooks, MCP tool calls, chat triggers - worden verdeeld tussen de instances op basis van een percentage dat een instance-beheerder instelt onder **Settings → Instances**, met de status, databaselatentie en versie van elke instance in één tabel. De instances communiceren nooit met elkaar: Postgres draagt het werk, zodat een worker geen open poort en geen route terug naar de main instance nodig heeft. Werk dat lokale bestanden, een coding-agent workspace of een geïnstalleerde plugin raakt, wordt altijd uitgevoerd op de main instance, en het paneel rapporteert hoeveel van de afgelopen 24 uur dat betrof, zodat een operator kan zien wanneer percentages niet kunnen helpen. Elke uitvoering in de geschiedenis vermeldt de instance die deze heeft uitgevoerd, en beide geschiedenisdialogen kunnen hierop filteren.

Zie ook [Settings](./user-settings.md), [Uitvoeringen](../tabs/traces-tab.md) en [Analytics](../tabs/analytics-tab.md).

### [Third-Party Integrations](./integrations.md)

Heym maakt verbinding met externe services via referenties die zijn opgeslagen in het tabblad [Referenties](../tabs/credentials-tab.md) (versleuteld opgeslagen). Ondersteunde typen zijn onder meer OpenAI, Google, Decision Model voor de [Decision-node](../nodes/decision-node.md), Model Router voor automatische modelselectie (zie hieronder), GitHub voor de [GitHub-node](../nodes/github-node.md) en MCP-integraties, Jira voor de [Jira-node](../nodes/jira-node.md), Notion voor de [Notion-node](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP voor [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header en FlareSolverr voor [Crawler](../nodes/crawler-node.md). Elk type documenteert de vereiste velden; referenties kunnen worden gedeeld met gebruikers of [teams](./teams.md) en worden gerefereerd op naam in nodes of als `$credentials.Name` in expressies.

### Model Router (Auto Model)

Een **Model Router**-referentie kiest het model per verzoek in plaats van een sleutel te bevatten. Deze
slaat een decision model-referentie op plus een lijst van uw bestaande OpenAI/Google/Custom-
referenties, elk met criteria die aangeven wanneer deze moet worden gebruikt, en verschijnt in elke model-
picker met één model genaamd **Auto**.

Uitvoeringen, het Execution Log op het canvas en de Span View tonen beide helften
van de keuze, bijvoorbeeld `Auto Model / GPT-5`, terwijl kosten worden toegeschreven aan het model dat
daadwerkelijk is uitgevoerd. Auto Model kan niet worden gecombineerd met de Responses API, Batch-modus of
image output. Zie [Referenties](./credentials.md) voor het volledige gedrag.

Zie ook [Referenties](./credentials.md), [Credentials Sharing](./credentials-sharing.md) en [Teams](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blokkeren onveilige of ongewenste gebruikersberichten voordat deze een [LLM](../nodes/llm-node.md) of [Agent Node](../nodes/agent-node.md) bereiken. Schakel ze per node in en selecteer categorieën om te blokkeren (bijv. geweld, haatzaaiende uitlatingen, seksuele inhoud, zelfbeschadiging, intimidatie, illegale activiteiten). Stel de gevoeligheid in (laag, gemiddeld, hoog). Wanneer geactiveerd, werpt de node een fout op die u kunt opvangen met een [Error Handler](../nodes/error-handler-node.md). Detectie maakt gebruik van de moderation API van de provider of LLM-classificatie, afhankelijk van het referentietype.

Zie ook [Beveiliging](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) en [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise omvat commerciële licenties, professionele ondersteuning en deployment-diensten voor teams die Heym in productie gebruiken. Het biedt hulp bij workflow-architectuur, onboarding, Kubernetes- en schaalbaarheidsadvies, prioriteitsondersteuning en maatwerkontwikkeling rond geavanceerde functies zoals [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) en [Portal](./portal.md).

Zie ook [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) en [Teams](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work is een tweede interface voor zakelijke teams bovenop Heym. Gebruikers beschrijven een taak, beantwoorden enkele vragen en krijgen een geteste workflow, en werken vervolgens vanuit pagina's, goedkeuringen en een activiteitenlijst waarin elke uitvoering een naam heeft. Instantiebeheerders koppelen het via **Instellingen → Heym Work** met het adres en een integratiesleutel; het heeft een eigen licentie van het Heym-team.

Zie ook [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) en [Human-in-the-Loop](./human-in-the-loop.md).

---

## Dashboard Tabs

### [Workflows](../tabs/workflows-tab.md)

Het tabblad Workflows is de standaardweergave van het dashboard. Het toont een tweedelige lijst: workflows en mappen als compacte rijen aan de linkerkant, en een voorbeeld van de geselecteerde workflow aan de rechterkant met de bijbehorende trigger, laatste uitvoering en stappen, plus Open Workflow en Run Now. Elke rij heeft een statuslabel (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled) waarop de Status-dropdown kan filteren. Een workflow zonder trigger-node wordt aangeduid op basis van hoe de meest recente uitvoering is gestart - API voor een HTTP-aanroep, SubWorker voor een bovenliggende workflow, Portal voor de openbare chat - en blijft Manual totdat deze is uitgevoerd. Mappen en submappen regelen de [organisatie](./workflow-organization.md). Maak workflows aan met New Workflow, sleep JSON om te [importeren](./download-import.md) en bewerk of verwijder via de rijacties. Workflows kunnen tussen mappen worden verplaatst; verwijdering wordt gepland (prullenbak) voordat deze definitief wordt verwijderd.

Zie ook [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) en [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Een agentisch kanbanbord waarbij kaarten permanente jobs zijn. Configureer elke kolom met een geordende workflow-keten; het verplaatsen van een kaart naar de kolom voert de keten uit met de volledige context van de kaart (inhoud, opmerkingen, geschiedenis, eerdere uitvoer). Resultaten worden teruggeschreven naar de kaart — groen bij succes, rood bij een fout, oranje tijdens uitvoering. Vervolgrondes voeren de keten van de huidige kolom opnieuw uit met alles wat tot dan toe is verzameld, wat iteratieve planning mogelijk maakt. Uitvoeringen worden vastgelegd in [Execution History](./execution-history.md) met de triggerbron `board`. Terwijl een kaartuitvoering actief is, opent **Open live** die exacte uitvoering op het geanimeerde canvas met incrementele Debug-logs.

Zie ook [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) en [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Op het tabblad Templates kunt u workflow-sjablonen (volledige workflows) en node-sjablonen (afzonderlijk geconfigureerde nodes) opslaan en hergebruiken. Maak workflow-sjablonen aan vanuit de editor (Share as Template) en node-sjablonen door met de rechtermuisknop op een node te klikken. Blader op basis van zichtbaarheid (Everyone of specifieke gebruikers/[teams](./teams.md)), pas een sjabloon toe om een nieuwe workflow aan te maken of een node aan het canvas toe te voegen, en beheer uw gedeelde sjablonen.

Zie ook [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) en [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

Op het tabblad Variables beheert u de [Global Variable Store](./global-variables.md). Maak globale variabelen aan, bewerk en verwijder ze; stel naam, waarde en waardetype in (Auto, String, Number, Boolean, Array, Object). Variabelen zijn gebruikersgebonden en blijven behouden tussen uitvoeringen. Verwijs ernaar in elke workflow-[expressie](./expression-dsl.md) als `$global.variableName`. Variabelen kunnen worden gedeeld met andere gebruikers of [teams](./teams.md).

Zie ook [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) en [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Het tabblad Chat is het oppervlak voor langdurige agents van Heym om de workspace vanuit een gesprek te bedienen. Selecteer een [referentie](./credentials.md) en model, en vraag Chat vervolgens om vragen te beantwoorden, workflowdefinities te inspecteren, bestaande workflows uit te voeren, uitvoeringen en tijdschema's samen te vatten, de uitvoeringsgeschiedenis van één workflow te rapporteren (aantal uitvoeringen, statusoverzicht, laatste uitvoering en op verzoek de details van één uitvoering), te rapporteren welke uitvoeringen op dit moment actief zijn (met verstreken tijd, huidige node en een link naar elke actieve uitvoering), openstaande menselijke beoordelingen af te handelen, workflows aan te maken en te herzien met dezelfde AI Builder-engine die in de editor wordt gebruikt, of kaarten toe te voegen aan kanbanborden met natuurlijke taal. Nieuwe kaarten beginnen altijd in de eerste kolom van het geselecteerde bord; wanneer meerdere borden beschikbaar zijn en geen daarvan is genoemd, toont Chat een bordselectie voordat de kaart wordt aangemaakt.

Chat blijft op de backend draaien nadat de browser is gesloten. Terwijl een antwoord wordt gestreamd, kunt u meer berichten verzenden; Heym slaat deze op in een database-backed wachtrij, laat u wachtrijberichten bewerken of verwijderen voordat ze starten, en voert ze in volgorde uit wanneer het huidige antwoord is voltooid. Als de assistent planningsdetails nodig heeft en om verduidelijking vraagt, wordt de wachtrij gepauzeerd totdat u die vragen beantwoordt, en wordt deze hervat na het planningsantwoord.

Antwoorden worden gestreamd met markdown, inline afbeeldingen, workflowvoorbeeldkaarten, inklapbare tool-call-kaarten, contextgebruik en automatische contextcompressie. Chat ondersteunt bijlagen, spraakinvoer, voorleesweergave, kopieeracties, snelle prompts, User Rules uit [Settings](./user-settings.md) en [global variables](./global-variables.md) als context.

Zie ook [AI Assistant](./ai-assistant.md), [Credentials](./credentials.md) en [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

### [Credentials](../tabs/credentials-tab.md)

Het tabblad Referenties beheert API-sleutels en secrets die door nodes worden gebruikt. Voeg referenties toe op type (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere, enz.), geef ze een naam en verwijs ernaar in workflownodes. Bewerk of verwijder vanaf de kaart; deel met gebruikers via e-mail of met [teams](./teams.md). Alle waarden worden versleuteld opgeslagen en gemaskeerd in de UI.

Zie ook [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) en [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Het tabblad Vectorstores beheert vectorstores die door [RAG](../nodes/rag-node.md)-nodes worden gebruikt. Maak een store aan met een naam en een vectorstore-[referentie](./credentials.md) — *RAG: Qdrant + OpenAI* (externe Qdrant) of *RAG: Psql + OpenAI* (Heym's eigen Postgres via pgvector), wat de backend van de store vastlegt — stel optioneel een collectienaam in en upload vervolgens documenten (PDF, TXT, enz.). Beheer inhoud (bronnen bekijken, verwijderen), bewerk storegegevens en deel stores met gebruikers. Selecteer in een [RAG](../nodes/rag-node.md)-node de Database, kies de vectorstore en voer insert-, upsert-, delete- of zoekbewerkingen uit.

Zie ook [Qdrant RAG](../nodes/rag-node.md), [Credentials](./credentials.md) en [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>
### [MCP](../tabs/mcp-tab.md)

Het tabblad MCP configureert de integratie van het Model Context Protocol. Heym ondersteunt twee modi:

**Standaardserver** – Een enkel endpoint op `/api/mcp/sse` stelt alle MCP-ingeschakelde workflows beschikbaar. Bekijk en regenereer uw API-key, kopieer kant-en-klare client-JSON, verbind Cursor met één klik, of volg de Claude-installatiestroom met automatische OAuth-registratie.

**Benoemde servers** – Maak meerdere geïsoleerde MCP-endpoints, elk met een eigen op UUID gebaseerde URL (`/api/mcp/servers/{uuid}/sse`) en onafhankelijke API-key. Wijs specifieke workflows toe aan elke server, zodat verschillende AI-clients of teams alleen de tools zien die zij nodig hebben. Elke benoemde server ondersteunt dezelfde authenticatiemethoden (API-key, Claude OAuth) en heeft eigen snelkoppelingen voor Copy JSON en Add to Cursor. Beide endpoints ondersteunen SSE-transport (GET) en Streamable HTTP-transport (POST). Het in- of uitschakelen van een workflow binnen een benoemde server verplaatst deze naar de bovenkant van de toegewezen lijst, zodat de gewijzigde rij in beeld blijft.

**Heym chat-tool** – Beide modi kunnen ook de [Chat](../tabs/chat-tab.md)-engine beschikbaar stellen als één enkele `heym_chat`-tool, per oppervlak in- of uitgeschakeld met een eigen LLM-referentie en model (vooraf ingevuld op basis van uw voorkeursmodel in [Settings](./user-settings.md)). Een MCP-client verzendt één natuurlijk taalbericht `message` en de engine doet de rest: workflows bouwen in de bouwmodus (opslaan, maximaal vijf keer testen, herstellen en verifiëren), workflows uitvoeren, analytics, uitvoeringen, live run-status, tijdschema's, boards en kaarten, teams, globale variabelen, documentatiezoekopdrachten en human-in-the-loop-beslissingen. Mogelijkheden die later aan Chat worden toegevoegd, zijn via dezelfde tool bereikbaar zonder extra registratie. Elke aanroep wordt opgeslagen in de geschiedenis van het tabblad Chat als een met een plug gemarkeerd gesprek en retourneert een `conversation_id` die de client kan terugsturen om de thread voort te zetten.

Zie ook [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) en [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

Het tabblad Traces toont [LLM](../nodes/llm-node.md)-uitvoeringstraces. Een statistiekenkop boven de lijst vat het geselecteerde tijdsbereik samen met KPI-kaarten (Calls, Tokens, Cost, Avg Latency, Error %) en drie grafieken — Tokens by Model, Cost by Model en Calls Over Time (gestapeld succes versus fout). Een enkele **Time range**-selector (1h / 24h / 7d / 30d / All; standaard 7 dagen) filtert zowel de grafieken als de lijst tegelijk. Kosten worden berekend op basis van de per-gebruiker [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table); modellen zonder prijsinformatie verschijnen als een inline waarschuwing die ernaar linkt. Open een trace om request- en response-payloads, timing-uitsplitsing (llm_ms, tools_ms, mcp_list_ms), tool-aanroepen (naam, argumenten, resultaat) en opgenomen skills te bekijken. Uitgeklapte gebeurtenissen tonen JSON—inclusief MCP- en JSON-RPC-payloads—als een uitklapbare boom met het eerste niveau standaard open; **Tree / Raw** schakelt terug naar de oorspronkelijke tekst en misvormde JSON blijft leesbaar. Gebruik traces om het gedrag van [Agent Node](../nodes/agent-node.md) en [LLM](../nodes/llm-node.md) te debuggen en om payloads te kopiëren of te exporteren.

Zie ook [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) en [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Waarschuwingen](../tabs/alerts-tab.md)

Het tabblad Waarschuwingen definieert drempelvoorwaarden over een tijdvenster en laat u weten wanneer deze worden overschreden. Vier typen waarschuwingen dekken de vragen die operators daadwerkelijk stellen: **foutdrempel** (is dit vaker dan N keer mislukt binnen het venster), **workflowduur** (werden uitvoeringen langzamer, gemeten als maximum, gemiddelde of p95), **token-/USD-kosten** (werd een budget overschreden, bepaald via dezelfde prijstabel als [Uitvoeringen](../tabs/traces-tab.md)), en **uitvoeringsaantal** (werd dit veel vaker uitgevoerd dan zou moeten). Elk type wordt beoordeeld over een door u gekozen venster, nooit op basis van één enkele gebeurtenis, omdat één mislukte uitvoering ruis is en een uitbarsting een incident. Waarschuwingen bewaken één workflow of elke workflow waartoe u toegang hebt.

Een wizard van vijf stappen leidt u door type, bereik, voorwaarde, respons en beoordeling. De stap Beoordeling **backtest** eerst de voorwaarde en rapporteert hoe vaak deze zou zijn afgegaan over de afgelopen 24 uur tot 7 dagen, zodat een veel te lage drempel wordt opgemerkt voordat deze wordt opgeslagen in plaats van nadat er iemand wordt gealarmeerd. Beschrijf wat u wilt in gewone taal en AI vult elke stap in die het kan, waarbij het zijn aannames markeert; een gedeeltelijk verzoek brengt de wizard nog steeds vooruit en opent op de eerste stap die nog een beslissing vereist, in plaats van u opnieuw te laten beginnen. Standaard gaat een waarschuwing één keer af en blijft stil totdat de metriek herstelt; u kunt deze in plaats daarvan met een interval laten herhalen.

In de stap Respons kan een waarschuwing een nieuwe workflow aanmaken en toewijzen om uit te voeren wanneer deze afgaat, een bestaande gebruiken, of niets doen. De payload bij afgaan bevat de waargenomen waarde, drempel, venster en de workflows die aan het getal hebben bijgedragen, wat de manier is waarop waarschuwingen Slack, e-mail of Telegram bereiken met behulp van nodes die u al hebt. De afgaan-geschiedenis registreert wat waar was op het moment dat elke waarschuwing afging en wordt 90 dagen bewaard; het bevestigen van een afgaan verandert de badge van Afgaan naar Bevestigd zonder te doen alsof de voorwaarde is opgeheven. Het tabblad [Chat](../tabs/chat-tab.md) kan antwoorden welke waarschuwingen bestaan en waarom of wanneer een waarschuwing is afgegaan. Waarschuwingen kunnen worden gedeeld met gebruikers en [teams](../tabs/teams-tab.md).

Zie ook [Analytics](../tabs/analytics-tab.md), [Uitvoeringen](../tabs/traces-tab.md) en [Uitvoeringsgeschiedenis](./execution-history.md).

### [Analytics](../tabs/analytics-tab.md)

Het tabblad Analytics toont uitvoeringsmetrieken en trends. Samenvattingsstatistieken omvatten totale uitvoeringen, slagingspercentage, foutpercentage, latentie-uitsplitsingen en totale **Bespaarde tijd** (de som van de geschatte bespaarde minuten per uitvoering van elke workflow × de succesvolle uitvoeringen). Meest gebruikt toont diezelfde som per workflow. Selecteer een basistijdbereik (24u, 7d, 30d of alles), filter optioneel op workflow en sleep vervolgens over een grafiek om in te zoomen op een geselecteerd datumbereik. Grafieken en workflowtabellen worden vernieuwd naar de selectie en automatisch vernieuwen houdt metrieken bijgewerkt. Het vormt een aanvulling op [Uitvoeringsgeschiedenis](./execution-history.md) en de weergave [Tijdschema's](../tabs/scheduled-tab.md) wanneer u zowel eerdere resultaten als aankomende uitvoeringen nodig hebt.

Zie ook [Uitvoeringsgeschiedenis](./execution-history.md), [Tijdschema's](../tabs/scheduled-tab.md) en [Evaluatie](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Het tabblad Dashboard is een ruimte in Grafana-stijl waar u rasters van grafiekwidgets bouwt, elk weergegeven vanuit zijn eigen verborgen Heym-workflow. Houd zoveel dashboards aan als u nodig hebt en deel elk dashboard met gebruikers of teams, alleen-lezen of bewerkbaar; widgets worden altijd uitgevoerd met de referenties van de eigenaar, zodat iedereen dezelfde gegevens ziet. Beschrijf een metriek in gewone taal en de AI genereert de widget, of voeg er handmatig een toe en kies een grafiektype, voorvertoond met voorbeeldgegevens: staaf, lijn, gebied, cirkel, tabel, numeriek, meter, spreiding, proportie, staafmeter, tekst of HITL. HITL is een carrousel van uw openstaande menselijke beoordelingen. De kop toont `1/n pending`. De workflownaam opent die uitvoering op het canvas. **Goedkeuren**, **Wijzigingen aanvragen** en **Afwijzen** lossen deze op, en het geschiedenis-pictogram naast de widgettitel opent die uitvoering in het geschiedenisdialoogvenster op dezelfde pagina. Widgets cachen hun resultaten, kunnen met AI worden verfijnd (elke wijziging wordt opgeslagen in [Bewerkingsgeschiedenis](./edit-history.md)), samen met hun volledige workflow worden gekloond, worden herschikt met Opruimen en in bewerkingsmodus worden gesleept of vergroot of verkleind. Tabellen kunnen statuschips tonen en hun rijen koppelen aan een detaildashboard dat het record van de aangeklikte rij leest als `$page.record`, en een Run-widget voert een workflow uit vanaf het dashboard: op een gesleept bestand, met de invoervelden of met een knop Uitvoeren. Omdat elke widget een workflow is, kan elke gegevensbron die u kunt ophalen — een [HTTP](../nodes/http-node.md)-aanroep, een [BigQuery](../nodes/bigquery-node.md)-query, een [RAG](../nodes/rag-node.md)-opzoeking of [LLM](../nodes/llm-node.md)-uitvoer — een grafiek worden.

Zie ook [Chart Output-node](../nodes/chart-output-node.md), [Analytics](../tabs/analytics-tab.md) en [Uitvoeringsgeschiedenis](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>
### [Evaluatie](../tabs/evals-tab.md)

Op het tabblad Evaluatie (op `/evals`) kunt u evaluatiesuites aanmaken, testcases toevoegen of genereren, de suite-prompt optimaliseren en evaluaties uitvoeren op [Agent Node](../nodes/agent-node.md)-workflows. Selecteer één of meer modellen, kies een scoringsmethode (Exact Match, Contains of LLM-as-Judge), laat optioneel een afzonderlijk model of een [Decision Model](../nodes/decision-node.md) de LLM-as-Judge-antwoorden beoordelen, stel het aantal runs per test in (plus temperatuur en reasoning effort voor Exact Match en Contains) en vergelijk vervolgens de slaag-/faalresultaten en de uitvoer per model. Bekijk de uitvoeringsgeschiedenis van eerdere evaluaties, inclusief de judge die elke run heeft gebruikt, voer een evaluatie opnieuw uit met dezelfde judge, exporteer deze als JSON en controleer het onderliggende gedrag in [Traces](../tabs/traces-tab.md).

Zie ook [Agent Node](../nodes/agent-node.md), [Traces](../tabs/traces-tab.md) en [Uitvoeringsgeschiedenis](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

### [Teams](../tabs/teams-tab.md)

Op het tabblad Teams kunt u teams aanmaken en beheren. Maak een team aan, voeg leden toe via e-mail en verwijder leden (de maker kan niet worden verwijderd). Deel [workflows](../tabs/workflows-tab.md), [sjablonen](../tabs/templates-tab.md), [referenties](../tabs/credentials-tab.md), [variabelen](../tabs/global-variables-tab.md), [vectorstores](../tabs/vectorstores-tab.md) en [Drive-bestanden](../tabs/drive-tab.md) met teams via de betreffende deelvensters; alle teamleden krijgen toegang. Bewerk de teamnaam en -beschrijving of verwijder het team (hiermee worden alle teamshares verwijderd).

Zie ook [Teams](./teams.md), [Referenties delen](./credentials-sharing.md) en [Workflow-organisatie](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

### [Tijdschema's](../tabs/scheduled-tab.md)

Op het tabblad Tijdschema's worden alle actieve [Cron](../nodes/cron-node.md)-workflows weergegeven op een visuele kalender. Schakel tussen dag-, week- en maandweergaven om te zien wanneer uw automatiseringen gepland staan, en spring terug naar de betreffende [workflow](../tabs/workflows-tab.md) wanneer u het schema wilt bewerken.

Zie ook [Cron](../nodes/cron-node.md), [Analytics](../tabs/analytics-tab.md) en [Uitvoeringsgeschiedenis](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>

### [Logs](../tabs/logs-tab.md)

Op het tabblad Logs worden Docker-containerlogs van de Heym-stack (backend, frontend, PostgreSQL) weergegeven. Selecteer container(s), filter op logniveau (All, INFO, WARNING, ERROR, DEBUG) en zoek binnen logs. Gebruik dit voor debugging en probleemoplossing. Gebruik voor workflow-uitvoeringslogs (node-resultaten, uitvoer) in plaats daarvan [Uitvoeringsgeschiedenis](./execution-history.md), [Traces](../tabs/traces-tab.md) of het Debug-paneel in de editor.

Zie ook [Uitvoeringsgeschiedenis](./execution-history.md), [Traces](../tabs/traces-tab.md) en [Canvas-functies](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

### [DataTable](../tabs/datatable-tab.md)

Op het tabblad DataTable kunt u gestructureerde gegevenstabellen binnen Heym aanmaken en beheren. Definieer getypeerde kolommen (string, number, boolean, date, JSON), beheer rijen met inline bewerken via dubbelklikken, importeer/exporteer CSV en deel tabellen met gebruikers of [teams](./teams.md) met lees-/schrijfrechten. Gebruik de [DataTable-node](../nodes/datatable-node.md) om tabellen programmatisch te benaderen in workflows. Een vastgezet gedeelte **Systeemtabellen** bovenaan bevat de **LLM Cost Table**: een weergave met vast schema van prijzen per model, op de achtergrond gevuld vanuit Helicone (TTL van 24 uur, handmatig vernieuwen), waarbij elke gebruiker prijzen kan overschrijven of aangepaste rijen kan toevoegen voor modellen die Helicone niet vermeldt. Deze prijsregels sturen de kosten-KPI en de kostenkaart per model aan op het tabblad [Traces](../tabs/traces-tab.md).

Zie ook [DataTable-node](../nodes/datatable-node.md), [Traces](../tabs/traces-tab.md), [Workflow-structuur](./workflow-structure.md) en [Teams](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>
### [Drive](../tabs/drive-tab.md)

Het tabblad Drive toont alle bestanden die door skills in uw workflows zijn gegenereerd. Het vermeldt elk bestand met naam, type, grootte, bron-node, aanmaakdatum en de status van teamdeling, en biedt bedieningselementen voor zoeken, geauthenticeerd downloaden, delen, verwijderen en paginering. Het is de dashboard-metgezel van [File Generation](./file-generation.md), de [Drive](./drive.md)-referentie en de [Drive-node](../nodes/drive-node.md).

Zie ook [Drive](./drive.md), [File Generation](./file-generation.md) en [Drive-node](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Bekijk Drive-demo</a></p>
