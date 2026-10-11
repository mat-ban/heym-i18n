# Waarom Heym

Heym is infrastructuur voor het uitvoeren en beheren van AI-agenten in productie. Eén self-hosted runtime dekt elke fase van de levenscyclus van een agent.

Een prototype-agent heeft een model, een prompt en een paar tools nodig. Een productie-agent heeft daarnaast triggers en retries nodig, opgeslagen status wanneer deze pauzeert voor een persoon, een registratie van elke model- en toolaanroep, kosten per uitvoering, tests voordat een wijziging wordt uitgerold, en duidelijke limieten voor wat deze zelfstandig mag doen. Heym bundelt dit alles op één plek, zodat het systeem dat op het canvas wordt ontworpen het systeem is dat daadwerkelijk draait. Bouw agentische systemen en voer ze vervolgens met vertrouwen uit.

## Eén Runtime voor de Levenscyclus van een Agent

| Fase | Wat Heym biedt |
|---|---|
| **Bouwen** | Stel agenten en deterministische stappen samen op het canvas, genereer ze met de [AI Assistant](../reference/ai-assistant.md), of start vanuit [Sjablonen](../tabs/templates-tab.md) en overdraagbare skills. |
| **Orkestreren** | Coördineer agenten, [sub-agenten](../reference/agent-architecture.md), coding agents, RAG, browserautomatisering en tools met expliciete datastromen en [parallelle uitvoering](../reference/parallel-execution.md). |
| **Uitvoeren** | Start uitvoeringen vanuit [webhooks](../reference/webhooks.md), schema's en event-[triggers](../reference/triggers.md), met retries per knooppunt, [foutafhandeling](../nodes/error-handler-node.md) en [load distribution](../reference/cluster.md) over instanties. |
| **Observeren** | Inspecteer elke uitvoering via [geschiedenis](../reference/execution-history.md), [LLM-traces](../tabs/traces-tab.md), USD-kosten per uitvoering, live uitvoeringen op het canvas, [analytics](../tabs/analytics-tab.md), [waarschuwingen](../tabs/alerts-tab.md) en [OpenTelemetry](../reference/opentelemetry.md)-export. |
| **Evalueren** | Test prompts en modellen tegen verwachte uitvoer in [Evaluaties](../tabs/evals-tab.md), met LLM-as-Judge-scoring en modelvergelijking naast elkaar. |
| **Beheren** | Houd mensen in controle met [review checkpoints](../reference/human-in-the-loop.md) en [guardrails](../reference/guardrails.md), en beheer toegang met versleutelde [inloggegevens](../reference/credentials.md), [teams](../reference/teams.md), [single sign-on](../reference/sso.md) en een [audit trail](../reference/audit.md). |
| **Beschikbaar stellen** | Stel workflows beschikbaar via REST en [SSE](../reference/sse-streaming.md), als [MCP](../tabs/mcp-tab.md)-tools, als [Portal](../reference/portal.md)-chatinterfaces en als [dashboard](../tabs/dashboard-tab.md)-widgets. |

## Bouwen

### AI Assistant: Bouw Workflows met Natuurlijke Taal

De [AI Assistant](../reference/ai-assistant.md) is een chatpaneel binnen de workflow-editor. Beschrijf wat u wilt, bijvoorbeeld "maak een workflow die gebruikersinvoer aanneemt, mijn kennisbank doorzoekt en antwoordt met GPT-4o", en de assistent genereert knooppunten en verbindingen die direct op het canvas worden toegepast.

- Gebruikt uw eigen LLM-inloggegevens (elk ondersteund model)
- Ondersteunt **spraakinvoer** voor handsfree workflow-ontwerp
- Past geldige workflow-JSON uit het AI-antwoord automatisch toe op het canvas
- Streamt antwoorden in realtime

De assistent werkt direct in de editor en streamt knooppunten in realtime naar het canvas, en alles wat deze genereert blijft bewerkbaar, net als knooppunten die handmatig zijn geplaatst.

### Skills-systeem

Skills zijn overdraagbare bundels van mogelijkheden, een `SKILL.md`-instructiebestand plus optionele Python-scripts, die op elk Agent-knooppunt kunnen worden geplaatst.

- De instructies van de skill worden voorafgegaan aan de system prompt van de agent
- Python-bestanden in de skill worden aanroepbare tools
- Skills zijn herbruikbaar across workflows en deelbaar als `.zip`-archieven

Dit is vergelijkbaar met het geven van een functiebeschrijving en een gereedschapskist aan uw agent in één keer.

### Workflow Analyzer: Uitvoeringsbewuste Feedback

Het paneel [Workflow Analysis](../reference/workflow-analysis.md) is een uitvoeringsbewuste documentatie- en feedbacktool die in de editor is ingebouwd. Klik op **Analyze**, kies LLM-inloggegevens en een model, en Heym genereert een bewerkbaar Markdown-rapport voor de huidige workflow.

Anders dan een statische notitie voert de analyzer eerst de workflow uit wanneer dat mogelijk is en neemt het uitvoeringsresultaat op in de prompt. Het rapport behandelt verbeterpunten, het doel van de workflow en een stapsgewijze uitleg van wat de knooppunten doen. Wanneer er al een rapport bestaat, streamt **Reanalyze** een aparte preview, zodat u de nieuwe versie kunt accepteren of het huidige gedeelde document kunt behouden.

## Orkestreren

### Ingebouwde LLM- en Agent-knooppunten

Heym's [Agent-knooppunt](../nodes/agent-node.md) voert een nauw geïntegreerde tool-calling-lus uit met inline Python-tools, MCP-verbindingen en een draagbaar skills-systeem, allemaal ontworpen voor productie-agenten.

Heym's gewone [LLM-knooppunt](../nodes/llm-node.md) gaat ook verder dan een enkele prompt-response-stap. Voor ondersteunde OpenAI- en OpenAI-compatibele endpoints kan het overschakelen naar **Batch API-modus**, zodat één knooppunt een array van prompts indient in een goedkopere provider-native batch-aanvraag. Het canvas stelt vervolgens een speciale `batchStatus`-vertakking beschikbaar die wordt geactiveerd wanneer de batch door statussen zoals `pending`, `processing` en `completed` gaat.

Dat betekent dat het LLM-knooppunt twee dingen tegelijk kan doen:

- De hoofd-batchaanvraag uitvoeren en de uiteindelijke uitvoer per item retourneren op de normale vertakking
- Notificatie- of logging-logica activeren bij elke betekenisvolle statusupdate van de batch, zonder de flow om te vormen tot een aangepaste polling-lus

Batch-uitvoering is een eersteklas LLM-workflow-primitief, met controle van provider- en modelmogelijkheden in de UI van het knooppunt.

Het **Agent-knooppunt** is de kern van agent-orchestratie in Heym:

- **Tool calling** – De agent itereert over tool-aanroepen in een lus totdat deze een definitief antwoord produceert
- **Python-tools** – Definieer aangepaste tools inline met volledige Python; de agent roept ze aan tijdens runtime
- **MCP-verbindingen** – Maak verbinding met elke [Model Context Protocol](https://modelcontextprotocol.io/)-server (stdio of SSE) en de agent krijgt automatisch alle bijbehorende tools
- **Skills** – Sleep een `.zip`- of `.md`-bestand naar een agent om de systeemcontext uit te breiden en Python-tooling toe te voegen
- **Sub-workflow-aanroepen** – De agent kan andere Heym-workflows als tools aanroepen, waardoor complex gedrag wordt samengesteld zonder aangepaste code

Zie [Agent-knooppunt](../nodes/agent-node.md) en [Agent-architectuur](../reference/agent-architecture.md) voor de volledige referentie.

### Multi-agent-orchestratie

Heym ondersteunt een **orchestrator-patroon** met eersteklas visuele primitieven:

- Eén agent fungeert als de **orchestrator** (`isOrchestrator: true`) en krijgt een `call_sub_agent`-tool
- Deze delegeert taken aan benoemde **sub-agenten** op hetzelfde canvas
- Sub-agenten kunnen zelf andere agenten of sub-workflows aanroepen (maximale diepte: 5)
- **Parallelle uitvoering**: Wanneer de orchestrator meerdere sub-agenten in één beurt aanroept, worden deze parallel uitgevoerd voor snellere resultaten

Dit maakt architecturen mogelijk zoals een planningsagent die werk routeert naar een onderzoeker, een programmeur en een samenvatter, allemaal visueel met elkaar verbonden zonder aangepaste orchestratiecode.

Zie [Agent-architectuur](../reference/agent-architecture.md) voor uitvoeringsdetails.

### Coding-agents als workflow-knooppunten

Heym levert twee knooppunten die een echte coding-agent uitvoeren als workflow-stap, niet als chat-completion:

- **[Codex-knooppunt](../nodes/codex-node.md)** – Voert de OpenAI Codex CLI uit in een geïsoleerde Heym-werkruimte tegen een GitHub-repository. Ondersteunt **Sign in with ChatGPT** (PKCE OAuth op uw Plus/Pro-abonnement, geen API-kosten per token) of een access token, kloont de repository, laat Codex code bewerken en retourneert `summary`, `diff`, `changedFiles` en een concept-`pullRequestUrl`.
- **[OpenCode Go-knooppunt](../nodes/opencode-go-node.md)** – Dezelfde repository-workflow via de provider-agnostische OpenCode-gateway (Kimi, DeepSeek, Qwen en meer), uitgevoerd in een **gehardende wegwerpcontainer**: alle capabilities verwijderd, alleen-lezen root, pid-/geheugen-/CPU-limieten. Het GitHub-token blijft buiten de sandbox: Heym voert elke git- en GitHub-operatie host-side uit, zodat gegenereerde code geen push-referenties kan exfiltreren.

Dat betekent dat een workflow een bug kan triageren vanuit een webhook, de repository aan een coding-agent kan overdragen, kan wachten op de concept-PR en de link naar Slack kan plaatsen, volledig geautomatiseerd, met per deployment configureerbare resource-limieten.

### Ingebouwde RAG-pijplijn

Heym bevat een [RAG / Vector Store-knooppunt](../nodes/rag-node.md) en een beheerd tabblad [Vectorstores](../tabs/vectorstores-tab.md). U kunt:

- Uw vector-backend kiezen: **Qdrant** (externe server) of **Postgres (pgvector)**, dat vectoren opslaat in Heym's eigen database zonder extra service die moet draaien
- Documenten rechtstreeks vanuit een workflow-knooppunt in een vector store invoegen
- Semantisch zoeken uitvoeren en resultaten doorgeven aan een LLM- of Agent-knooppunt
- Resultaten refereren met expressies zoals `$ragNode.results.map("item.payload.content").join("\n\n")`

In Heym is RAG twee knooppunten met volledige controle over embeddings en retrieval.

### Browserautomatisering met Playwright

Het [Playwright-knooppunt](../nodes/playwright-node.md) is first-party browserautomatisering op het canvas.

- **Stappen-modus** – Stel navigate-, click-, type-, fill-, screenshot-, extract- en scroll-acties visueel samen
- **AI-stappen met auto-heal** – Beschrijf een actie in natuurlijke taal en een LLM genereert de Playwright-acties; mislukte selectors kunnen automatisch worden hersteld en gegenereerde stappen kunnen worden gecached om toekomstige LLM-aanroepen over te slaan
- **Run Code-modus** – Schakel het knooppunt over naar volledige Playwright Python voor complexe flows (standaard uitgeschakeld; draait in Heym's gehardende sandbox wanneer ingeschakeld)
- **Geauthenticeerde sessies** – Herstel cookies/`storageState` vóór uitvoering, verifieer login met een selector-controle en val terug op gescripte login-stappen
- **Netwerk-capture** – Verzamel optioneel JSON-responses, headers, cookies en browseropslag naast resultaten

Heym behandelt de browser als een normaal knooppunt met dezelfde expressies, inloggegevens en foutafhandeling als al het andere.

### Expression DSL

De [Expression DSL](../reference/expression-dsl.md) van Heym biedt een schone, krachtige syntaxis voor het verwijzen naar gegevens van upstream-knooppunten:

- `$input.text` – Gegevens van het Input-knooppunt
- `$nodeName.field` – Het uitvoerveld van elk upstream-knooppunt
- `$global.variableName` – Persistente globale variabelen
- Array-helpers: `.first()`, `.map("field")`, `.join("\n")`

Expressies werken in elk tekstveld, inclusief prompts, HTTP-headers, voorwaarden en ingestelde waarden, zodat gegevens expliciet tussen stappen worden doorgegeven. De DSL balanceert kracht en leesbaarheid zonder volledige JavaScript-kennis te vereisen.

## Uitvoering

### Triggers, Herhaalpogingen en Foutpaden

Een workflow kan vanaf vele plaatsen starten. [Input](../nodes/input-node.md)-knooppunten ontvangen HTTP-[webhooks](../reference/webhooks.md), [Cron](../nodes/cron-node.md) wordt volgens een schema uitgevoerd en gebeurtenis-[triggers](../reference/triggers.md) starten uitvoeringen vanuit Telegram, Discord, Slack, IMAP-inboxen, WebSocket-streams, RabbitMQ-wachtrijen, bestandsuploads en gebeurtenissen van het Heym-platform.

Fouten worden binnen de grafiek afgehandeld. Elk knooppunt kan bij een fout opnieuw proberen met een ingesteld aantal pogingen en een wachttijd ertussen, elke poging wordt vastgelegd in de [uitvoeringsgeschiedenis](../reference/execution-history.md), en een [Error Handler](../nodes/error-handler-node.md)-knooppunt wordt automatisch uitgevoerd wanneer een knooppunt faalt, zodat herstel deel uitmaakt van de workflow zelf.

### Parallelle DAG-uitvoering

De workflow-uitvoerder van Heym gebruikt een directed acyclic graph (DAG)-planner. Onafhankelijke knooppunten worden automatisch parallel uitgevoerd, zonder configuratie.

- Knooppunten op hetzelfde afhankelijkheidsniveau worden gelijktijdig naar een thread pool verzonden (`max_workers=8`)
- Zodra een knooppunt is voltooid, worden de downstream-knooppunten gepland
- Het [Merge Node](../nodes/merge-node.md) combineert resultaten van parallelle vertakkingen
- Meerdere workflow-uitvoeringen worden gelijktijdig uitgevoerd; elke uitvoering is volledig geïsoleerd

Parallelisme is het standaardgedrag, bepaald door de structuur van de grafiek.

Zie [Parallelle Uitvoering](../reference/parallel-execution.md).

### Schalen over Instanties

Richt een tweede Heym-instantie op dezelfde PostgreSQL-database en deze sluit aan als worker. Achtergronduitvoeringen worden tussen instanties gedeeld op basis van door u ingestelde gewichten, één gekozen leader houdt schema's, waarschuwingsevaluatie en crashherstel draaiende via een failover, en elke uitvoering legt de instantie vast die deze heeft uitgevoerd. Zie [Load Distribution](../reference/cluster.md).

### Agentic Kanban-bord

Het [Board-tabblad](../tabs/board-tab.md) is een ingebouwd Kanban-bord waarbij de kolommen zelf workflows uitvoeren. Een kaart is een persistente agentic-taak die context, gespreksgeschiedenis, uitvoeringsstatus, uitvoer en workflow-uitvoeringen met zich meedraagt.

- **Workflow-ketens per kolom** – Het verplaatsen van een kaart naar een kolom activeert de workflow-keten van die kolom; een **Agentic Kanban Model** (uw referentie + model) zet kaartinhoud om naar workflow-invoer en zet uitvoer terug naar leesbare tekst
- **Kaartbijlagen** – Sleep bestanden naar een kaart; documenten worden naar tekst geëxtraheerd en afbeeldingen worden vóór elke uitvoering doorgegeven aan vision-capabele modellen
- **Live uitvoeringscanvas** – Open de actieve uitvoering in een kaart en bekijk deze knooppunt voor knooppunt op het echte workflow-canvas
- **Teams delen** – Deel borden met gebruikers of teams met lees-/schrijfrechten; ketens op gedeelde borden worden uitgevoerd met de referenties van de eigenaar, zodat medewerkers nooit hun eigen referenties nodig hebben
- **Zichtbaarheid van fouten** – Mislukte kaarten tonen een indicator voor foutgeschiedenis, en vervolguitvoeringen kunnen pauzeren om op opmerkingen te wachten

Het bord is een native oppervlak van het platform: kaarten, workflows, referenties en live uitvoeringen bevinden zich allemaal op één plek.

### Heym Drive: Ingebouwde Bestandsopslag

Het [Drive-tabblad](../tabs/drive-tab.md) is een bestandsopslag die in het platform is ingebouwd. Bestanden die door skills en workflows worden gegenereerd (PDF, DOCX, CSV, afbeeldingen) komen daar automatisch terecht, en bijlagen van bordkaarten worden er ook opgeslagen.

- **Deellinks** – Openbare of met wachtwoord beveiligde (Basic Auth) downloadlinks met optionele vervaldatum en maximale downloadlimieten
- **Teams delen** – Deel bestanden alleen-lezen met uw teams, en verwijder alle teamdeelacties in één handeling
- **Bulkacties** – Meervoudige selectie met shift-klik-bereiken, bundel selecties in één ZIP-download, of pas één deel-/wachtwoord-/verwijderinstelling toe op meerdere bestanden tegelijk
- **Agent-toegang** – Skills kunnen ervoor kiezen om Drive-bestanden te lezen, zodat een agent kan werken met documenten die u of andere workflows hebben geproduceerd

Gegenereerde artefacten krijgen een permanente, deelbare thuisbasis binnen het platform.

## Observeren

### LLM Traces

Het [Traces-tabblad](../tabs/traces-tab.md) biedt volledige observeerbaarheid voor elke LLM-aanroep:

- Request- en response-payloads
- Timing per aanroep: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Namen, argumenten en resultaten van tool-aanroepen
- Skills die aan het model zijn doorgegeven

Het trace-systeem is speciaal gebouwd voor het debuggen van agentic-gedrag, met volledige request- en response-payloads en timing per aanroep.

### LLM Token Cost Tracking

Elke LLM-aanroep in Heym wordt automatisch van kosten voorzien. Het tabblad [Traces](../tabs/traces-tab.md) toont per trace het aantal input- en outputtokens, samen met realtime USD-kosten op basis van een gesynchroniseerde prijstabel.

- **Kosten per trace** – Inputtokens, outputtokens en totale USD-kosten weergegeven op elke tracerij
- **Kostenanalyse** – KPI-kaarten en een kostenkaart per model worden bijgewerkt op basis van het geselecteerde tijdsbereik (1u / 24u / 7d / 30d / Alles)
- **LLM Cost Table** – Een systeemtabel in het tabblad [DataTable](../tabs/datatable-tab.md) wordt elke 24 uur gevuld vanuit Helicone; prijzen kunnen worden overschreven of er kunnen aangepaste rijen worden toegevoegd voor modellen die nog niet zijn opgenomen
- **Waarschuwing bij ontbrekende prijs** – Traces voor modellen zonder prijsvermelding tonen een inline waarschuwing met een directe link naar de kostentabel

Elke uitvoering draagt zijn eigen USD-kosten, uitgesplitst per model.

### Open Productie-uitvoeringen op een Live Canvas

Een productie-workflow blijft inspecteerbaar nadat deze buiten de editor is gestart. Open een **Running**-vermelding vanuit een van beide Geschiedenis-dialoogvensters, of open de actieve uitvoering in een Agentic Kanban-kaart, en Heym koppelt de normale workflow-editor aan die exacte uitvoering.

- Knooppunten die al zijn voltooid, verschijnen onmiddellijk met hun resultaten
- Het huidige knooppunt en wachtende downstream-knooppunten blijven pulseren terwijl de uitvoering vordert
- Het Debug-paneel ontvangt dezelfde incrementele knooppuntresultaten als een uitvoering die vanaf het canvas is gestart
- De uiteindelijke output en uitvoeringsmarkeringen arriveren zonder polling of het starten van een dubbele uitvoering
- Het sluiten van de editor verbreekt alleen de observer; de productie-workflow wordt nooit geannuleerd

De observer gebruikt SSE, ondersteund door een cross-worker execution snapshot, zodat deze werkt voor webhook-, schedule-, chat-, MCP-, integratie- en Board-triggers, zelfs wanneer een andere backend-worker de uitvoering bezit.

### OpenTelemetry, Analytics en Waarschuwingen

Heym zendt [OpenTelemetry](../reference/opentelemetry.md)-spans uit voor elke workflow-uitvoering, knooppuntuitvoering en Agent-toolaanroep, geëxporteerd via OTLP/HTTP naar Jaeger, Grafana Tempo, Honeycomb, Datadog of een andere compatibele backend.

Het tabblad [Analytics](../tabs/analytics-tab.md) volgt uitvoeringsaantallen, slagingspercentage, duur en trends per workflow. [Waarschuwingen](../tabs/alerts-tab.md) bewaken foutenaantallen, uitvoeringsduur, token- of USD-uitgaven en uitvoeringsvolume over een tijdvenster, en voeren vervolgens een door u gekozen notify-workflow uit, zodat een waarschuwing Slack, e-mail, Telegram of elke andere plek bereikt die een knooppunt kan bereiken.

## Evaluate

### Ingebouwde Evaluaties

Het tabblad [Evals](../tabs/evals-tab.md) laat u testsuites definiëren en deze uitvoeren tegen uw agent-workflows:

- Maak testcases met inputs en verwachte outputs, of genereer ze vanuit de suite-prompt
- Voer één suite uit tegen meerdere modellen en vergelijk hun outputs naast elkaar
- Beoordeel met Exact Match, Contains of LLM-as-Judge met een onafhankelijk judge-model
- Bekijk pass/fail, werkelijk versus verwacht, en uitvoeringsgeschiedenis

Wijzig een prompt of een model, voer de suite opnieuw uit en vergelijk de resultaten voordat de wijziging productie bereikt.

## Control

### Human-in-the-Loop (HITL)

Heym heeft een ingebouwd [Human-in-the-Loop](../reference/human-in-the-loop.md)-systeem waarmee agenten de uitvoering kunnen pauzeren, menselijke beoordeling kunnen aanvragen en precies kunnen hervatten waar ze zijn gebleven.

- **Agent-checkpoints** – Schakel `hitlEnabled` in op elk Agent-knooppunt om het een `request_human_review`-tool te geven. De agent beslist wanneer een beslissing menselijk toezicht vereist en roept de tool aan met een samenvatting en concept.
- **Openbare review-URL's** – Elke reviewaanvraag genereert een beveiligde eenmalige link op `/review/{token}` (TTL van 168 uur). Beoordelaars kunnen **accepteren**, **bewerken & doorgaan** of **weigeren** zonder in te loggen.
- **Execution snapshots** – De workflow bevriest zijn volledige status (gespreksgeschiedenis, variabelen, toolresultaten), zodat deze precies hervat waar deze was gepauzeerd nadat de beoordelaar heeft gereageerd.
- **Notificatiebranch** – Een optionele `review`-outputhandle laat u een notificatiestroom (Slack, e-mail, webhook) aansluiten die wordt geactiveerd wanneer een review wordt aangevraagd.
- **MCP-toolgoedkeuringsbeleid** – Geschreven HITL-richtlijnen worden geïnterpreteerd in goedkeuringsscopes (`always` / `once` / `never`), zodat de agent tools met laag risico automatisch kan goedkeuren en tools met hoog risico kan escaleren.
- **Meerdere checkpoints** – Een enkele agent-uitvoering kan meerdere keren pauzeren voor review; elk checkpoint is onafhankelijk.

Openbare review-URL's, bewerken-en-doorgaan, notificatiebranches en hervatten op basis van snapshots werken allemaal vanuit hetzelfde agent-checkpoint.

Zie [Human-in-the-Loop](../reference/human-in-the-loop.md) voor de volledige referentie.

### LLM Guardrails

Heym heeft ingebouwde [Guardrails](../reference/guardrails.md) op zowel [LLM](../nodes/llm-node.md)- als [Agent](../nodes/agent-node.md)-knooppunten, zodat u onveilige inhoud kunt blokkeren voordat een modelreactie downstream-stappen bereikt.

- **Veiligheidsschakelaar op knooppuntniveau** – Schakel guardrails direct in op het knooppunt dat gebruikersgerichte inhoud genereert of verwerkt
- **Brede beleidsdekking** – Blokkeer geweld, haatzaaiende uitlatingen, seksuele inhoud, NSFW/scheldwoorden, intimidatie, illegale activiteiten, verzoeken om persoonsgegevens en pogingen tot prompt injection
- **Meertalige detectie** – Pas dezelfde veiligheidsregels toe op Turks, Engels, Arabisch, Spaans en andere talen
- **Workflow-native fallback** – Wanneer een bericht wordt geblokkeerd, werpt het knooppunt een getypeerde workflow-fout op die u kunt routeren via een [Error Handler](../nodes/error-handler-node.md)

Het veiligheidsbeleid bevindt zich direct in de LLM- en Agent-configuratie en sluit rechtstreeks aan op workflow-vertakking en foutafhandeling.

### Toegang, Inloggegevens en Audit

Agenten handelen met echte inloggegevens, dus toegang maakt deel uit van governance. [Inloggegevens](../reference/credentials.md) worden versleuteld opgeslagen, na aanmaak gemaskeerd en deelbaar met gebruikers of [teams](../reference/teams.md), en teams delen ook workflows, variabelen, vector stores en Drive-bestanden. [Single sign-on](../reference/sso.md) verbindt elke OpenID Connect-provider, waaronder Okta, Entra ID, Keycloak, Auth0 en Google. Het [auditspoor](../reference/audit.md) registreert elke beveiligingsrelevante actie met de actor, het doel en de uitkomst, en streamt deze samen met de containerlogs naar de logcollector of SIEM die al in gebruik is.

### Self-Hosted, Uw Gegevens Blijven van U

Heym draait op uw infrastructuur. Workflows, inloggegevens, uitvoeringsgeschiedenis en traces bevinden zich in uw eigen database, en modelaanroepen gaan van uw servers naar de provider die u kiest, of naar een model dat u zelf host via Ollama of vLLM. Voor agenten die gevoelige documenten, klantgegevens of propriëtaire kennisbanken verwerken, is dit vaak een harde vereiste.

Heym is gelicentieerd onder de **MIT License met de Commons Clause-voorwaarde**. De broncode is source-available: u kunt deze vrij gebruiken, aanpassen en self-hosten. De Commons Clause beperkt de verkoop van de software, waaronder het aanbieden van betaalde hosting of consultancy-/ondersteuningsdiensten waarvan de waarde in belangrijke mate aan Heym ontleend wordt. Voor commerciële licenties, enterprise-implementaties of professionele ondersteuning kunt u contact opnemen via [enterprise@heym.run](mailto:enterprise@heym.run).

## Expose

### API's en Streaming

Workflows zijn aanroepbaar via HTTP op `/api/workflows/{workflow_id}/execute`, dat JSON retourneert, en op `/api/workflows/{workflow_id}/execute/stream`, dat node-events streamt als Server-Sent Events terwijl de uitvoering vordert. Beide delen authenticatie op workflowniveau, rate limiting en response caching. Zie [Webhooks](../reference/webhooks.md) en [SSE Streaming](../reference/sse-streaming.md).

### MCP (Model Context Protocol)-integratie

Heym heeft native [MCP](../tabs/mcp-tab.md)-ondersteuning aan beide zijden:

- **Als client**: Agent-knooppunten verbinden met externe MCP-servers (Filesystem, Browserbase, aangepaste tools) via stdio of SSE en gebruiken hun tools automatisch
- **Als server**: Workflows met MCP ingeschakeld worden tools op de standaardserver op `/api/mcp/sse`, of op benoemde servers met hun eigen URL en API-key, zodat Claude Desktop, Cursor en andere MCP-clients uw Heym-workflows rechtstreeks kunnen aanroepen

Agenten kunnen meerdere MCP-servers tegelijk gebruiken, en elke workflow kan een tool worden voor een externe MCP-client.

### Portal: Workflows Publiceren als Chat-UI's

De [Portal](../reference/portal.md)-functie verandert elke workflow in een publiek toegankelijke chat-interface op `/chat/{slug}`:

- Optionele authenticatie met inloggegevens per gebruiker
- Streaming-uitvoering (realtime node-voortgang)
- Ondersteuning voor bestandsuploads
- Gespreksgeschiedenis over meerdere beurten

Teams leveren interne tools, klantgerichte chatbots en AI-gedreven formulieren vanuit één workflow en één URL, zonder frontend-code te schrijven.

### Workflow-gedreven Dashboards

Het [Dashboard-tabblad](../tabs/dashboard-tab.md) is een door gebruikers gebouwd rapportageoppervlak waarin elk grafiekwidget wordt aangedreven door zijn eigen verborgen Heym-workflow. Een widget kan API's aanroepen, BigQuery bevragen, RAG-/vector stores doorzoeken, LLM-stappen uitvoeren, rijen transformeren en eindigen met een [Chart Output-knooppunt](../nodes/chart-output-node.md). U kunt widgets handmatig aanmaken, ze met AI genereren, ze later verfijnen, resultaten cachen en het raster visueel herschikken.

## Vergeleken met Workflow-automatiseringstools

Veel teams komen bij Heym terecht vanuit workflow-automatiseringstools. De onderstaande tabel vergelijkt Heym met n8n, Zapier en Make.com op de capaciteiten die van belang zijn zodra agenten in productie draaien, en de voetnoten eronder verwijzen naar de officiële documentatie achter de vergelijking. Voor een diepere blik op één tool tegelijk, zie de vergelijkingspagina's op [heym.run/compare](https://heym.run/compare).

| Capaciteit | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Ingebouwde LLM-node | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + statusvertakkingen | ✓ | beperkt¹¹ | –¹¹ | beperkt¹¹ |
| Ingebouwde Agent-node (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Multi-agent orkestratie | ✓ | ✓ | beperkt | beperkt |
| Coding agent-nodes (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Ingebouwde RAG / vectoropslag | ✓ | ✓ | beperkt¹ | plugin² |
| WebSocket lezen / schrijven | ✓ | beperkt¹² | –¹³ | –¹⁴ |
| Natural language workflow-builder | ✓ | beperkt³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Een lopende uitvoering openen op het live canvas | ✓ | beperkt¹⁹ | beperkt¹⁹ | –¹⁹ |
| Door workflows aangedreven dashboards | ✓ | beperkt¹⁷ | beperkt¹⁷ | beperkt¹⁷ |
| Agentic Kanban-bord | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Skills-systeem voor agenten | ✓ | – | – | – |
| Ingebouwde file drive (deellinks, teams) | ✓ | beperkt²² | beperkt²² | –²² |
| Browser automation-node (Playwright) | ✓ | beperkt²³ | beperkt²³ | –²³ |
| LLM trace-inspectie | ✓ | beperkt⁴ | – | ✓ |
| OpenTelemetry tracing-export | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM token-kostenregistratie (USD) | ✓ | –¹⁵ | –¹⁵ | beperkt¹⁵ |
| Ingebouwde evaluaties voor AI-workflows | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | beperkt⁶ | beperkt⁷ |
| LLM guardrails | ✓ | ✓⁸ | ✓⁸ | beperkt⁸ |
| Automatische contextcompressie | ✓ | – | – | – |
| Parallelle DAG-uitvoering | ✓ | beperkt⁹ | – | – |
| Zelf te hosten, source available | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL voor dynamische data | ✓ | ✓ | beperkt | ✓ |

> **Voetnoten:** ¹ Zapier Knowledge Sources — geen blootgestelde vectoropslag of embeddingbeheer. ² Make.com heeft Pinecone/Qdrant-modules maar geen native RAG-knooppunt. ³ n8n AI Workflow Builder is een cloud-only bèta met creditlimieten. ⁴ n8n toont tussenstappen; volledige tracing vereist tools van derden. ⁵ n8n ondersteunt goedkeuringen voor AI-toolaanroepen via chat, e-mail en samenwerkingskanalen, maar het maakt geen snapshot van de volledige uitvoering en hervat deze niet zoals Heym doet. ⁶ Zapier Human in the Loop ondersteunt goedkeuringen en gegevensverzameling binnen Zaps, maar het is geen checkpoint-systeem met publieke beoordeling en snapshot-hervatting. ⁷ Make.com biedt Human in the Loop als een Enterprise-app met beoordelingsverzoeken en uitkomsten als aangepast/goedgekeurd/geannuleerd, maar het blijft beperkt tot bepaalde abonnementen en is minder agent-native. ⁸ n8n levert een speciaal Guardrails-knooppunt, Zapier levert AI Guardrails across its AI-producten, en Make.com documenteert agentregels plus beoordelingsstromen maar geen vergelijkbare zelfstandige guardrails-functie, dus Make is gemarkeerd als beperkt. ⁹ n8n voert standaard sequentieel uit; parallellisme vereist workarounds met sub-workflows. ¹⁰ Sustainable Use License — gratis voor self-hosting bij intern gebruik, commerciële herdistributie beperkt. ¹¹ Met ingang van 22 april 2026 beschrijven de officiële documentatie van n8n HTTP-batching en loop/wait-patronen in plaats van een native LLM batch-status-vertakking, vermeldt de officiële documentatie van Zapier's ChatGPT-app geen triggers en slechts een generieke API Request-bèta, en toont de officiële OpenAI-integratiepagina van Make batch-acties zoals create/watch completed maar geen eersteklas LLM-knooppunt met statusvertakking, dus n8n/Make zijn gemarkeerd als beperkt en Zapier is gemarkeerd als niet beschikbaar voor dit specifieke workflowpatroon. ¹² De officiële documentatie van n8n behandelt HTTP Webhook- en HTTP Request-knooppunten plus Code/aangepaste/community-uitbreidbaarheid, maar ik kon geen first-party WebSocket-trigger/verzendknooppunt vinden, dus n8n is gemarkeerd als beperkt. ¹³ De officiële documentatie van Zapier behandelt inkomende webhooks en uitgaande webhook/API-verzoeken alleen via HTTP, niet via native WebSocket-triggers of verzendstappen. ¹⁴ De officiële documentatie van Make behandelt Webhooks-modules en HTTP(S)-request-modules, maar ik kon geen native WebSocket-trigger of verzendmodule vinden. ¹⁵ n8n heeft geen native tracking van LLM-tokenkosten; er bestaan community-workaround-workflows maar deze vereisen handmatige installatie en API-aanroepen na uitvoering (openstaand feature request met ingang van mei 2026). Zapier toont gebruikers geen tokenaantal of USD-kosten per uitvoering; AI-stappen verbruiken alleen taken. Het credits-dashboard van Make.com weerspiegelt gedeeltelijk het tokenverbruik voor door Make gehoste AI (sinds augustus 2025), maar verbindingen met API-sleutels van derden worden gefactureerd als 1 operatie = 1 credit zonder tokenregistratie; er is geen USD-uitsplitsing per uitvoering per model beschikbaar. ¹⁶ Heym zendt native OpenTelemetry-spans uit (één per workflowuitvoering plus één per knooppunt) via OTLP/HTTP naar elke compatibele backend, met W3C trace-context-propagatie en zonder instrumentatiecode, geconfigureerd via `HEYM_OTEL_*` env-variabelen en standaard uitgeschakeld. n8n heeft een gedocumenteerde OpenTelemetry-tracingintegratie voor workflow- en knooppuntuitvoeringen. Zapier en Make.com documenteren met ingang van juni 2026 geen OpenTelemetry-export van hun workflow-/scenariouitvoeringen. ¹⁷ n8n documenteert een Insights-dashboard voor productie-uitvoeringsstatistieken, Zapier documenteert Zap History plus Task Usage, en Make.com documenteert Scenario History; dit zijn monitoring-/geschiedenismogelijkheden, geen aangepaste dashboardwidgets ondersteund door willekeurige workflowlogica zoals Heym's Dashboard-tab. ¹⁸ Heym Workflow Analyzer voert de workflow uit wanneer mogelijk, leest het uitvoeringsresultaat en genereert een gedeeld bewerkbaar Markdown-rapport met verbeterpunten, doel en stapsgewijs gedrag. n8n documenteert AI Workflow Builder voor het maken/verfijnen/debuggen van workflows, Zapier documenteert AI-probleemoplossing voor mislukte Zap-uitvoeringen, en Make.com documenteert scenariogeschiedenis plus redeneerstappen van AI-agenten, maar hun openbare documentatie beschrijft niet hetzelfde uitvoeringsbewuste gedeelde workflowanalysedocument. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) toont lopende uitvoeringen en kan gegevens van een eerdere uitvoering in de editor laden, terwijl [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) een running-status in de editor toont. [Make Scenario History](https://help.make.com/scenario-history) documenteert uitvoeringsdetails en logs. Hun openbare documentatie, gecontroleerd op 18 juli 2026, beschrijft niet de exacte flow van Heym: een willekeurige lopende productie-uitvoering openen vanuit Geschiedenis of een Kanban-kaart, de huidige knooppunt-snapshot herstellen en op hetzelfde canvas knooppuntanimatie en Debug-logs blijven ontvangen. ²⁰ Heym's [Codex](../nodes/codex-node.md)- en [OpenCode Go](../nodes/opencode-go-node.md)-knooppunten voeren een echte coding-agent-CLI uit in een geïsoleerde Heym-werkruimte tegen een GitHub-repository — klonen, bewerken, een diff produceren, een branch pushen, een pull request openen — als een eersteklas workflowstap. Met ingang van 20 juli 2026 documenteert geen enkele concurrent een equivalent: n8n's [OpenAI-knooppunt](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) behandelt chat-/assistant-API-aanroepen, niet een coding-agent op repositoryniveau, en native Codex-ondersteuning blijft een communityverzoek; Zapier's eigen blog documenteert de omgekeerde richting — [Codex die Zapier-tools aanstuurt via Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — niet Codex als een Zap-stap; de OpenAI-modules van Make.com bieden completions/assistants/batch-acties, niet een coding-agent die repositories kloont en PR's opent. ²¹ Heym's [Board-tab](../tabs/board-tab.md) is een ingebouwd agentic Kanban-bord waarvan de kolommen workflows uitvoeren en waarvan de kaarten context, gespreksgeschiedenis, uitvoeringsstatus en uitvoeringen bevatten. n8n ([Kanban Tool-integratie](https://n8n.io/integrations/kanban-tool/)), Zapier ([Kanban Tool-integraties](https://zapier.com/apps/kanbantool/integrations)) en Make.com ([Kanban Tool-integratie](https://www.make.com/en/integrations/kanban-tool)) maken alleen verbinding met kanban-apps van derden zoals Kanban Tool, Wekan of NocoDB; geen enkele documenteert een ingebouwd bord dat zijn eigen workflows uitvoert, met ingang van 20 juli 2026. ²² n8n slaat binaire uitvoeringsgegevens intern op (optioneel op [S3-compatibele externe opslag](https://docs.n8n.io/hosting/scaling/external-storage/)) maar documenteert geen gebruikersgerichte bestandsdrive met deellinks of teamsamenwerking, dus het is gemarkeerd als beperkt. Zapier's [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) verwerkt bestanden alleen voor de duur van een Zap-uitvoering en [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) bevat kleine tekstwaarden, dus Zapier is gemarkeerd als beperkt. Make.com's [data stores](https://help.make.com/l6du-data-stores) bevatten gestructureerde records en de [bestandsverwerking](https://help.make.com/working-with-files) geeft bestanden door tussen apps zonder persistente ingebouwde opslag, dus Make is gemarkeerd als niet beschikbaar. ²³ Heym's [Playwright-knooppunt](../nodes/playwright-node.md) is first-party browserautomatisering met een visuele stappenmodus, door AI gegenereerde stappen en een volledige codemodus. n8n biedt alleen communitypakketten zoals [n8n-playwright](https://github.com/toema/n8n-playwright) met een nog openstaand [feature request voor native browserautomatiseringsknooppunten](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), dus het is gemarkeerd als beperkt. Zapier Agents kunnen [pagina's browsen en lezen via webbrowsen en een Chrome-extensie](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension) maar Zapier documenteert geen gescripte browserautomatiseringsstap, dus het is gemarkeerd als beperkt. Make.com documenteert HTTP-modules en scraping-apps van derden in plaats van een native browserautomatiseringsmodule, met ingang van 20 juli 2026.

## Gerelateerd

- [Introductie](./introduction.md) – Platformoverzicht
- [Snelstart](./quick-start.md) – Bouw uw eerste workflow
- [Workflow-analyse](../reference/workflow-analysis.md) – Genereer gedeelde run-aware workflow-rapporten en verbeterfeedback
- [Dashboard-tab](../tabs/dashboard-tab.md) – Bouw workflow-ondersteunde dashboards met door AI gegenereerde grafiekwidgets
- [Agent-knooppunt](../nodes/agent-node.md) – LLM-knooppunt met tool calling, MCP en skills
- [Agent-architectuur](../reference/agent-architecture.md) – Sub-agenten, orchestrator en tool-dispatch
- [Board-tab](../tabs/board-tab.md) – Agentisch Kanban-bord met workflow-uitvoerende kolommen
- [Codex-knooppunt](../nodes/codex-node.md) – Voer de OpenAI Codex coding agent uit tegen een GitHub-repo
- [OpenCode Go-knooppunt](../nodes/opencode-go-node.md) – Provider-agnostische coding agent in een gehardende container
- [Drive-tab](../tabs/drive-tab.md) – Ingebouwde bestandsopslag met deellinks, teams en bulkacties
- [Playwright-knooppunt](../nodes/playwright-node.md) – First-party browserautomatisering met AI-stappen en codemodus
- [RAG / Vectoropslag-knooppunt](../nodes/rag-node.md) – Vectorzoekopdracht en documentinvoeging (Qdrant of Postgres pgvector)
- [AI-assistent](../reference/ai-assistant.md) – Natural language workflow builder
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Agent-checkpoints met openbare review-URL's
- [Guardrails](../reference/guardrails.md) – Blokkeer onveilige prompts voordat ze uw modellen bereiken
- [Traces-tab](../tabs/traces-tab.md) – LLM-call-observability
- [Evals-tab](../tabs/evals-tab.md) – Testsuites voor AI-workflows
- [Alerts-tab](../tabs/alerts-tab.md) – Drempelwaarschuwingen voor fouten, duur, kosten en uitvoeringsvolume
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Exporteer run-, node- en tool-spans via OTLP
- [Load Distribution](../reference/cluster.md) – Deel uitvoeringen over instanties met leader-failover
- [Single Sign-On](../reference/sso.md) – Meld u aan via elke OpenID Connect-provider
- [Audit Logging](../reference/audit.md) – Beveiligingsrelevante acties met actor, doel en resultaat
- [Portaal](../reference/portal.md) – Publiceer workflows als openbare chat-UIs
- [Parallelle uitvoering](../reference/parallel-execution.md) – DAG-gebaseerde gelijktijdige uitvoering
- [MCP-tab](../tabs/mcp-tab.md) – MCP-server- en clientconfiguratie
