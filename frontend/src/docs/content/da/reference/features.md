# Heym Komplet Funktionsoversigt

En omfattende gennemgang af alle Heym-funktioner. Hver sektion beskriver en funktion eller et koncept med få sætninger.

---

## Kom godt i gang

### [Introduktion](../getting-started/introduction.md)

Heym er infrastruktur til at køre og administrere AI-agenter i produktion. Der bygges agentbaserede systemer på et visuelt canvas, som køres med tillid: koordinering af agenter, automatisering af forretningsprocesser, inspektion af hver kørsel og menneskelig kontrol på egen infrastruktur. Platformen understøtter visuelle workflows, AI-drevne noder ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), en [AI Assistant](./ai-assistant.md), integrationer ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), indgående [IMAP Trigger](../nodes/imap-trigger-node.md) e-mail, udgående [Send Email](../nodes/send-email-node.md)), planlægning med [Cron](../nodes/cron-node.md) samt [Portal](./portal.md) chat-portaler til slutbrugere.

Se også [Kernebegreber](../getting-started/core-concepts.md), [Nodetyper](./node-types.md) og [Tredjepartsintegrationer](./integrations.md).

### [Hvorfor Heym](../getting-started/why-heym.md)

Hvorfor Heym gennemgår agentlivscyklussen (byg, koordiner, kør, observer, evaluer, kontroller, eksponer) og viser, hvad en selv-hostet runtime håndterer på hvert trin. Dette dækker [LLM](../nodes/llm-node.md)-noden og [Agent Node](../nodes/agent-node.md) med værktøjsopkald, Python-værktøjer, [MCP](../tabs/mcp-tab.md)-forbindelser, færdigheder og multi-agent-koordinering; triggers, genkørsler og [belastningsfordeling](./cluster.md); [Traces](../tabs/traces-tab.md) med USD-omkostninger pr. kørsel og OpenTelemetry-eksport; [Evals](../tabs/evals-tab.md); [menneskelig gennemgang](./human-in-the-loop.md), sikkerhedsforanstaltninger, SSO og revisionsspor samt REST-, MCP- og Portal-endpoints. En funktionssammenligning med n8n, Zapier og Make.com afslutter siden.

Se også [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) og [Agentarkitektur](./agent-architecture.md).

### [Hurtig start](../getting-started/quick-start.md)

Få det første workflow til at køre på få minutter: opret et workflow fra fanen [Workflows](../tabs/workflows-tab.md), tilføj en [Input](../nodes/input-node.md)-node, en [LLM](../nodes/llm-node.md)-node og en [Output](../nodes/output-node.md)-node, og forbind dem. Konfigurer [LLM](../nodes/llm-node.md) med legitimationsoplysninger og indstil `userMessage` til `$input.text`; brug Kør eller [AI Assistant](./ai-assistant.md) til at eksekvere eller generere workflows med naturligt sprog.

Passer naturligt sammen med [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) og [Expression DSL](./expression-dsl.md).

### [Kernebegreber](../getting-started/core-concepts.md)

Workflows er rettede grafer af noder forbundet med kanter; eksekvering flyder fra trigger-noder ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) gennem processeringsnoder til [Output](../nodes/output-node.md)-noder. Hver node har en type, data (konfiguration) og input/output; kanter definerer dataflow. Noder refererer til opstrømsdata via [Expression DSL](./expression-dsl.md)-udtryk som `$nodeLabel.field`; uafhængige noder kører automatisk i [parallel](./parallel-execution.md).

Se også [Triggers](./triggers.md), [Parallel Execution](./parallel-execution.md) og [Workflow-struktur](./workflow-structure.md).

### [Kørsel & Deployment](../getting-started/running-and-deployment.md)

Heym tilbyder `run.sh` til lokal udvikling (database i Docker, FastAPI-backend, Vite-frontend) og `deploy.sh` til produktion med Docker Compose. Begge bruger en `.env`-fil; nøglevariabler inkluderer `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` og `ALLOW_REGISTER`. Udvikling kører på konfigurerbare frontend- og backend-porte; produktion serverer API'en under `/api` gennem frontend-containeren.

Se også [Sikkerhed](./security.md), [Enterprise](./enterprise.md) og [Indstillinger](./user-settings.md).

### [Migrer til Heym](../getting-started/migrate-to-heym.md)

AI Convert-værktøjet omdanner et workflow fra en anden platform (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) eller en beskrivelse på almindeligt engelsk til et Heym-workflow, streamet live på et canvas og klar til [download og import](./download-import.md). Det udfører en AI-sikkerhedskontrol og genererer derefter DSL'en med input- og hastighedsbegrænsninger på plads. Åbn det på [heym.run/convert](https://heym.run/convert).

Se også [Hurtig start](../getting-started/quick-start.md), [Download & Import](./download-import.md) og [AI Assistant](./ai-assistant.md).

---

## Noder

### Triggers
#### [Input](../nodes/input-node.md)

Input-noden er indgangspunktet for workflows, der modtager data fra brugeren eller API-kaldere. Den understøtter enten enkelt- eller flerfeltsinput og eksponerer request-metadata (headers, query-parametre). Adgang til body-felter sker via `$nodeLabel.body.fieldKey`, headers via `$nodeLabel.headers` og query via `$nodeLabel.query`.

Passer naturligt sammen med [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) og [Output](../nodes/output-node.md). For payload-referencer og feltadgang, se [Expression DSL](./expression-dsl.md) og [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Cron-noden trigger et workflow på en tidsplan ved brug af et standard fem-felts cron-udtryk. Ingen brugerinput er nødvendigt - workflowet kører automatisk på de angivne tidspunkter (f.eks. hver time, dagligt, hver 15. minut). Outputtet er en trigger-begivenhed uden payload.

Se også [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) og [Execution History](./execution-history.md) for planlagte og forsinkede kørsler.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

IMAP Trigger-noden afsøger en indbakke med konfigurerbart minutinterval og starter et workflow for hver nyopdaget email. Den outputter parsed headers, lister over afsendere og modtagere, plain-text- og HTML-bodies, vedhæftningsmetadata og en trigger-tidsstempel. Anvend den til supportindbakke-triage, mailbox-til-[Slack](../nodes/slack-node.md)-routing eller email-drevne godkendelsesflows med [Human-in-the-Loop](./human-in-the-loop.md).

Passer sammen med [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) og [Slack](../nodes/slack-node.md) for indgående triage- og responsworkflows.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Heym Trigger-noden starter et workflow, når Heym selv udgiver en platformbegivenhed: `heym.started`, `workflow.created`, `workflow.updated` eller `workflow.deleted`. Levering er batch-baseret - hver begivenhed udgivet inden for et fem-sekunders dispatch-vindue ankommer i en enkelt kørsel som `$nodeLabel.events`, altid en array. Hver begivenhed claimes gennem en unik databasebegrænsning, så den udløses præcis én gang per abonnerende node uanset antallet af workers, containere eller maskiner, der kører. Anvend den til workflow-ændringsrevisioner, deploy-annonceringer og instanshelbredsoversigter.

Passer sammen med [Heym](../nodes/heym-node.md)-noden til opslag af det ændrede workflow og med [Loop](../nodes/loop-node.md) til handling pr. begivenhed.

#### [Heym](../nodes/heym-node.md)

Heym-noden læser Heyms egne data gennem tre operationer: `listWorkflows` returnerer alle workflows, som ejeren kan nå med node-tællinger og tidsstempler, `getWorkflow` returnerer én workflows node- og kantstruktur, og `getExecutionHistory` returnerer eksekveringshistorikposter nyeste-først med valgfrie status-, tidsvindue- og grænsefiltreringer sammen med totaler grupperet efter status. Resultaterne er scoped til ejeren af workflowet, som noden befinder sig i, så en kørsel startet af cron, en portal eller en begivenhed returnerer de samme data som en manuel kørsel. `getWorkflow` returnerer den fulde nodekonfiguration, hvilket gør det muligt at revidere et workflow for hårdkodede nøgler eller tokens; den eksponerer intet, som workflowejeren ikke allerede kunne åbne i editoren. Ingen legitimationsoplysninger kræves.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

WebSocket Trigger-noden åbner en udgående klientforbindelse til en ekstern WebSocket-server og starter workflowet ved `onMessage`, `onConnected` eller `onClosed`. Den eksponerer parsed message-payloads, reconnect-tilstand, close-metadata og socket-URL'en for nedstrømsudtryk.

Passer sammen med [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) og [SSE Streaming](./sse-streaming.md) til realtidsintegrationer.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Telegram Trigger-noden modtager bot-webhook-opdateringer og starter workflowet umiddelbart. Den eksponerer den fulde update-payload, det primære message-objekt, callback-forespørgsler, saniterede headers og en trigger-tidsstempel. Anvend den til chatbots, AI-assistenter i [Telegram](../nodes/telegram-node.md) og knap-drevne flows.

Passer sammen med [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) og [Webhooks](./webhooks.md) til bot-drevne workflows.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Slack Trigger-noden modtager Slack Events API-webhooks og starter automatisk et workflow efter at have verificeret request-signaturen. Den eksponerer event-payloaden og saniterede headers til nedstrømsrouting, [LLM](../nodes/llm-node.md)-baseret klassifikation og svarflows.

Passer sammen med [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) og [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Discord Trigger-noden modtager Discord Interactions API-webhooks, verificerer Ed25519-signaturer med de valgte `discord_trigger`-legitimationsoplysninger og starter workflowet. Den eksponerer den fulde interaktionspayload, kommandodata, saniterede headers og trigger-metadata til nedstrømsrouting eller svar.

Passer sammen med [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) og [Third-Party Integrations](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ-noden sender eller modtager beskeder fra RabbitMQ-køer og -exchanges. Den anvendes til message-driven workflows og eventbehandling. I send-tilstand publiceres en besked med valgfri forsinkelse; i receive-tilstand fungerer den som en [trigger](./triggers.md), hvor workflowet startes, når en besked ankommer. Output inkluderer status, message_id og body.

Kombineres med [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) og [Parallel Execution](./parallel-execution.md) til eventdrevet behandling.

#### [Error Handler](../nodes/error-handler-node.md)

Error Handler-noden køres automatisk, når en hvilken som helst node i workflowet fejler. Der kræves ingen indgående kanter; den trigges af motoren. Output inkluderer fejlmeddelelse, fejlende node-label, nodetype og tidsstempel. Den kan bruges til at sende notifikationer via [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) eller [Send Email](../nodes/send-email-node.md), logge fejl eller returnere brugerdefinerede fejlsvar.

Som alternativ til fejlhåndtering på canvas kan et workflow delegere fejl til et separat workflow - se [Error Workflow](#error-workflow). Hvis canvas allerede indeholder en Error Handler-node, kaldes error-workflowet **ikke** (den lokale handler har forrang).

Almindelige notifikationsmål er [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) og [Send Email](../nodes/send-email-node.md); kørselsdetaljer er lettere at inspicere i [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

AI Agent-noden er en [LLM](../nodes/llm-node.md)-node med tool calling. Den kan køre Python-værktøjer, kalde tilsluttede canvas-noder som værktøjer, forbinde til [MCP](../tabs/mcp-tab.md)-servere, bruge skills (instruktionsfiler og valgfrie Python-scripts), fungere som en orchestrator, der delegerer til andre agent-noder, og kalde andre workflows som værktøjer. Output er tilgængeligt som `$nodeLabel.text`. En valgfri **Extra Body**-toggle vedhæfter et JSON-objekt med providerspecifikke anmodningsparametre til hver anmodning i tool-calling-loopet; den er slået fra som standard. En valgfri **Use Responses API**-toggle dirigerer agentens modelkald gennem Responses API'en, som bevarer modellens ræsonnement på tværs af tool calls, så en ræsonnerende model bevarer sin tankekæde gennem et multi-step-loop; den er slået fra som standard og virker med OpenAI og brugerdefinerede legitimationsoplysninger.

Canvas node-værktøjer lader en agent kalde konfigurerede workflow-noder direkte fra canvas. Tilslut en understøttet node til agentens tools-håndtag, og marker derefter specifikke felter som agent-leverede med bot-ikonet. Disse felter bliver til værktøjsparametre ved runtime, mens legitimationsoplysninger og umarkerede felter forbliver faste i nodekonfigurationen.

Skills-sektionen inkluderer nu **AI Build** til at oprette nye skills, en inline AI-redigeringshandling for eksisterende skills, per-skill ZIP-download og en valgfri **Enable Drive files**-switch til skills, der skal læse Heym Drive-filer ved runtime. Skill Builder-modalen streamer en chatkonversation til venstre, accepterer drag-and-drop-filer med hver fine-tune-kommentar, viser en live read-only forhåndsvisning af genererede `SKILL.md`- og `.py`-filer til højre, kan downloade denne forhåndsvisning som en ZIP og gemmer uploadede fine-tune-filer som bundled skill-assets gennem samme ZIP-indtagelsesflow, der bruges ved manuelle uploads.

Med **[Agent Persistent Memory](./agent-persistent-memory.md)** aktiveret opretholder hver agent-node sin egen videnstilstand: facts indlæses i systemprompten, når den ikke er tom, og vellykkede kørsler udløser en baggrundsfletning af nye enheder og relationer. Sub-agenter bruger separate grafer. Det er muligt at **dele** en agents graf med andre agenter (samme eller andre workflows) med read-only eller read/write-adgang fra graf-dialogen. Canvas brain-control åbner grafeditoren.

Agent-noder kan også gå i [Human-in-the-Loop](./human-in-the-loop.md)-tilstand. I denne tilstand får agenten et `request_human_review`-værktøj og kan pause ved specifikke godkendelseskrævende trin, oprette et engangs-public review-link, eksponere en `review`-canvas-gren til notifikationsflows og vente, indtil en reviewer accepterer, redigerer eller afviser Markdown-review-teksten. Nodens HITL-felt fungerer som godkendelsesretningslinjer for, hvornår der skal anmodes, mens reviewer-summary genereres fra hver anmodning. For [MCP](../tabs/mcp-tab.md)-værktøjer bruger Heym modellen til at fortolke disse skrevne instruktioner til `always`, `once` eller `never`, så fri form-godkendelsessprog mappes til en konkret runtime-politik. Kørslen markeres `pending` og genoptages fra den gemte execution-snapshot, efter beslutningen ankommer, og den samme agentkørsel kan pause mere end én gang, hvis senere trin også kræver review.

Agent-noder komprimerer automatisk deres akkumulerede beskedhistorik, når den nærmer sig 80% af modellens kontekstvindue. Systemprompten, den første brugerbesked og den seneste brugerbesked bevares altid; alt derimellem sammenfattes ved hjælp af samme model og legitimationsoplysninger. Komprimeringsevents er synlige i Debug-panelet, [Execution History](./execution-history.md) og [Traces](../tabs/traces-tab.md)-fanen.

Se også [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) og [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Codex-noden kører OpenAI Codex CLI i et isoleret Heym-workspace. Den accepterer en Codex-legitimationsoplysning (log ind med ChatGPT for at bruge abonnementet uden API-omkostninger pr. token, eller indsæt en access-token), en GitHub-legitimationsoplysning, repository-URL, base-branch, task-prompt, publish-mode (`diff_only` eller `draft_pr`), branch-navn og timeout. Kørslen kloner repository'et lokalt, sender kun ChatGPT-token-bundlen eller `CODEX_ACCESS_TOKEN` til Codex-processen og returnerer en struktureret oversigt, valideringsnoter, ændrede filer, diff, brugsmetadata og en valgfri draft-PR-URL.

Når Codex returnerer `needs_input`, pauses workflowet og eksponerer `question`-branchen. Forbind denne branch til Slack, e-mail eller en anden notifikationsnode; det offentlige opfølgningslink genoptager den gemte kørselsøjebliksbillede efter svaret er indsendt. Codex-noden kan også tilknyttes en AI Agent som et værktøj, hvor agenten kan delegere kodningsopgaver; som værktøj returneres et `needs_input`-resultat inline til agenten i stedet for at pause workflowet.

Se også [GitHub](../nodes/github-node.md), [Legitimationsoplysninger](./credentials.md), [Deling af legitimationsoplysninger](./credentials-sharing.md) og [Nodetyper](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

OpenCode Go-noden kører OpenCode CLI (Go) mod et GitHub-repository. Isolation følger Codex-mønsteret: lokalt kører den som en host-subproces, mens Docker-deployment kører den i en hærdet sibling-container, der deler workspace-volumen. Den accepterer en OpenCode Go-legitimationsoplysning (en gateway-API-nøgle med en valgfri base-URL), en GitHub-legitimationsoplysning, repository-URL, base-branch, task-prompt, publish-mode, branch-navn, timeout og en `opencode-go/<model>`-model valgt fra en live, søgbar modeliste (med indbygget fallback). Heym udfører alle git/GitHub-operationer på hosten og placerer aldrig GitHub-token i sandkassen; OpenCode redigerer kun filer på disken. Noden returnerer en struktureret oversigt, valideringsnoter, ændrede filer, diff og en valgfri pull-request-URL. Den kan tilknyttes en AI Agent som et værktøj.

Se også [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Legitimationsoplysninger](./credentials.md), [Deling af legitimationsoplysninger](./credentials-sharing.md) og [Nodetyper](./node-types.md).

#### [LLM](../nodes/llm-node.md)

LLM-noden behandler tekst med en sprogmodel eller genererer billeder. Den understøtter tekstgenerering, vision (billedinput), billedgenerering, struktureret JSON-output, provider-native Batch API-kørsel for understøttede OpenAI- og OpenAI-kompatible endpoints og en valgfri **Use Responses API**-toggle, der dirigerer kaldet gennem Responses API i stedet for Chat Completions (slået fra som standard; virker med OpenAI og brugerdefinerede legitimationsoplysninger og kan ikke kombineres med Batch-mode). Konfigurer legitimationsoplysninger, model, system- og brugerbeskeder, temperatur og max tokens; brug [Expression DSL](./expression-dsl.md) i prompts. I batch-mode skal `userMessage` resultere i et array, noden udsender en `batchStatus`-branch med statusopdateringer, og det endelige output inkluderer batch-resultater pr. emne. En valgfri **Extra Body**-toggle vedhæfter et JSON-objekt med providerspecifikke anmodningsparametre (f.eks. `{"thinking": {"type": "disabled"}}`) til hvert API-kald; den er slået fra som standard. Valgfrie [Guardrails](./guardrails.md) blokerer usikker indhold før kaldet.

Passer naturligt sammen med [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) og [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Decision-noden stiller en beslutningsmodel typede spørgsmål om kørslens tilstand og returnerer sandsynligheder i stedet for prosa. Et **State**-felt angiver, hvad modellen skal læse – et enkelt udtryk beholder sin egen type, så `$input` sender objektet i stedet for dets tekst – og en liste af spørgsmål indeholder vurderingerne. Spørgsmål kommer i tre former: **noul** svarer på, om en betingelse gælder, **choice** vælger en mulighed fra et defineret sæt og returnerer den fulde fordeling, og **score** vurderer tilstanden langs ordnede niveauer og kan lande mellem dem. Choice- og score-svar indeholder også en konfidens, så en [Switch](../nodes/switch-node.md) kan dirigere baseret på svaret, mens en [Condition](../nodes/condition-node.md) kan afhænge af, hvor sikker den var. **Generate with AI** udkaster statesskabelonen og spørgsmålsrækkerne fra en simpel sætning, og **Custom request body** sender håndskrevet JSON for et endpoint, hvis kontrakt afviger. Providerens svar sendes uændret videre, og hvert kald registreres i [Traces](../tabs/traces-tab.md).

Kræver en Decision Model-legitimationsoplysning; passer naturligt sammen med [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) og [Agent Node](../nodes/agent-node.md).
#### [RAG / Vektorlagre](../nodes/rag-node.md)

RAG / Vektorlagre-noden indsætter, opdaterer, sletter og søger dokumenter i et vektorlagre til retrieval-augmenteret generering. En Database-dropdown vælger backend'en — **Qdrant** (ekstern server) eller **Postgres (pgvector)** (Heyms egen database, ingen ekstern tjeneste), med Qdrant som standard. Vælg et vektorlagre fra fanen [Vektorlagre](../tabs/vectorstores-tab.md) og indstil operationen til insert, upsert, delete eller search. Upsert og delete adresserer et dokument via et unikt id gemt i payload'en — et **Document ID Field** navngiver dette felt (standard `doc_id`) og **Document ID** indeholder dets værdi — så et dokument beholder det id, som det allerede har i det eksisterende system: upsert erstatter alle matchende punkter før lagring af den nye version, og delete rapporterer om der blev fundet noget. Dokumentmetadata accepterer udtryk i sine værdier, så `{"url": "$start.url"}` lagrer det, som kørslen producerede. Search understøtter metadatafiltre, valgfri **Hybrid Search** (vektorlighed fusioneret med BM25-nøgleordsmatchning, så nøjagtige termer som ID'er og fejlkoder findes ved siden af semantiske matches) og valgfri Cohere-omrangering (reranking) og returnerer et array af resultater med text, score, metadata, reranked- og hybrid-flag og count til brug i [LLM](../nodes/llm-node.md) eller [Agent Node](../nodes/agent-node.md) workflows.

Almindelige efterfølgende noder er [LLM](../nodes/llm-node.md) og [Agent Node](../nodes/agent-node.md); opsætning af vektorlagre findes i [Vektorlagre](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

MCP Call-noden kalder et specifikt [MCP](../tabs/mcp-tab.md)-værktøj direkte, uden at en LLM beslutter hvilket værktøj der skal aktiveres. Den anvendes når det på forhånd er kendt hvilket værktøj der skal køres — til deterministisk, enkelt-trins MCP-værktøjsudførelse i et workflow. Konfigurer en forbindelse (SSE, Streamable HTTP eller stdio; samme felter som [Agent Node](../tabs/mcp-tab.md) MCP-forbindelse), klik på **Fetch Tools** for at udfylde en dropdown, vælg et værktøj og udfyld argumentfelter, der automatisk genereres fra værktøjets inputskema. Hvert argument accepterer en statisk værdi eller et [DSL-udtryk](./expression-dsl.md) som `$userInput.body.text`. Resultatet er tilgængeligt som `$nodeLabel.result` (JSON-objekt hvis det kan parses, ellers streng). MCP Call-noden kan ikke forbindes til en [Agent Node](../nodes/agent-node.md) som et canvas-værktøj.

Se også [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) og [Expression DSL](./expression-dsl.md).

### Logik

#### [Condition](../nodes/condition-node.md)

Condition-noden forgrener workflowet baseret på et if/else-udtryk. Den har to output-håndtag: et for når betingelsen er sand og et for falsk. Brug sammenlignings- og logiske operatorer fra [Expression DSL](./expression-dsl.md) i betingelsesudtrykket; noden sender input videre til den valgte gren.

Se også [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) og [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Switch-noden dirigerer udførelsen til forskellige stier ved at matche en værdi mod cases. Konfigurer et udtryk der skal evalueres og en liste af case-værdier; hver case får et source-håndtag og et standard-håndtag bruges til ikke-matchende værdier. Input sendes videre til den matchende gren.

Brug [Condition](../nodes/condition-node.md) til binær forgrening og [Merge](../nodes/merge-node.md) til at genforene dirigeret stier; matchingsregler dækkes i [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Merge-noden venter på flere parallelle inputs og kombinerer dem til et enkelt output. Indstil antallet af inputs der skal ventes på; noden producerer et samlet objekt når alle grene er færdige. Brug den til at samle resultater fra parallelle grene før der fortsættes; brug den ikke når parallelle grene slutter i separate Output-noder.

Se også [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) og [Output](../nodes/output-node.md) når grene skal genforenes.

#### [Loop](../nodes/loop-node.md)

Loop-noden itererer over et array og udfører efterfølgende noder for hvert element. Den kræver en tilbageforbindelse fra den sidste node i iterationskroppen for at fortsætte. Inden i loop-kroppen kan `item`, `index`, `total`, `isFirst` og `isLast` bruges; loopet har separate outputs for iterationsstien og done-stien.

Parres med [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) og [Expression DSL](./expression-dsl.md) til iterative workflows.

### Data

#### [Set](../nodes/set-node.md)

Set-noden transformerer og mapper inputdata til brugerdefineret output. Definer nøgle-værdi-mappinger hvor hver værdi er et [Expression DSL](./expression-dsl.md)-udtryk. Brug den til store bogstaver, understrenge, sammenkædning, tilfældige tal og lignende transformationer. Adgang til output sker via nøgle (f.eks. `$setNode.keyName`). Når den forbindes til en agent som et canvas-nodeværktøj, kan mappingsværdier markeres som agent-leveret, så agenten udfylder dem under kørsel. Til at kalde andre workflows bruges i stedet [Execute](../nodes/execute-node.md)-noden.

Se også [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) og [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Converter-noden konverterer data mellem formater uden at kræve kodeskrivning. Tekstkonverteringer inkluderer `csvToJson` (CSV-tekst til et array af rækkeobjekter eller arrays, hvis der ikke er nogen header), `jsonToCsv` (et array af objekter/rækker til CSV-tekst), `xmlToJson` (XML-tekst til et objekt) og `jsonToXml` (et objekt til XML-tekst). Konverteringsretningen og kildeudtrykket konfigureres; CSV-konverteringer bruger desuden en separator og håndtering af headers, og `jsonToCsv` kan fastsætte en eksplicit kolonneorden. Citater, indlejrede separators og linjeskift følger RFC 4180. XML-attributter bruger `@`-præfikser, tekst blandet med attributter bruger `#text`, gentagne elementer bliver til arrays, og XML-entity-udvidelse er deaktiveret. Samme node fungerer også på lagrede filer. `imageToText` og `pdfToText` kører Tesseract OCR, læser en fil fra Heym Drive (`$Upload.file.id` fra en File upload-trigger, en Drive-node-resultat eller en agents genererede fil), vælger sproget automatisk ud fra det detekterede script eller bruger specificerede koder som `tur` eller `eng+tur`, og normaliserer teksten til UTF-8 som standard med valgfri NFC-normalisering og smallere tegnsæt som `cp1254`. `fileConvert` omskriver en lagret fil til et andet format, dokumenter via pandoc og billeder via Pillow, og gemmer resultatet som en ny Drive-fil uden at ændre originalen. Resultatet er tilgængeligt som `$converterNode.result`, med `.language`, `.encoding`, `.page_count`, `.pages` og `.file` ved siden af for OCR-kørsler, samt `.id`, `.filename` og `.download_url` for `fileConvert`.

Se også [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) og [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Code-noden kører Python-kode, der skrives manuelt, med egen `requirements.txt`, i en container, der oprettes og fjernes ved hver kørsel. Koden definerer en `main(params)`-funktion og returnerer en hvilken som helst JSON-serialiserbar værdi, som bliver til `$codeNode.result`; alt, der udskrives, fanges separat som `$codeNode.logs`, og `$codeNode.install` rapporterer, hvilket værktøj der installerede afhængighederne. Parametre konfigureres som et JSON-objekt, hvis `$`-udtryk løses før kørsel, og koden læser dem med punktnotation som `params.user.name` eller `params.orders[0].id`. Afhængigheder installeres med `uv`, med `pip` som reserve til pakker, `uv` ikke kan håndtere, uden caching mellem kørsler; en tom `requirements.txt` springer installation over og er meget hurtigere. Kørselsfasen har ikke netværk, medmindre `codeAllowNetwork` er aktiveret, mens afhængighedsinstallation altid kontakter PyPI. Sandkassen kører ikke-root uden kapabiliteter, med et read-only-root-filsystem, ingen Docker-socket og ingen adgang til backend-hemmeligheder, begrænset til 512 MB hukommelse, én CPU, 256 processer, 120 sekunders installation og 60 sekunders kørsel. Docker er påkrævet, og der er ingen fallback-tilstand: uden en tilgængelig daemon fejler noden i stedet for at køre koden i backend-processen.

#### [Variable](../nodes/variable-node.md)

Variable-noden sætter eller opdaterer en workflow-lokal variabel (`$vars.variableName`) eller en vedvarend [global variabel](./global-variables.md) (`$global.variableName`). Anvendes til tællere, akkumulerede lister og delt tilstand. Konfigurer variabelnavn, værdiudtryk, typecoercion og om der skal gemmes i det globale lager. Array-variabler understøtter `$array()` og `.add()`.

Parres med [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) og [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Execute-noden kalder et andet workflow (under-workflow) og sender input til det. Mål-workflowet angives ved ID, og input gives via et enkelt udtryk eller nøgle-værdi-mappinger. Output inkluderer workflow_id, status og outputs; anvendes til genanvendelig logik, ikke til datatransformation (brug Set til dette).

Se også [Canvas Features](./canvas-features.md) for Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) og [Output](../nodes/output-node.md).

### Integrationer

#### [HTTP](../nodes/http-node.md)

HTTP-noden foretager HTTP-anmodninger ved hjælp af cURL-stil konfiguration. Kan være et workflow-startpunkt (ingen indgående kant) eller modtage input fra opstrømsnoder. Svar er tilgængeligt som status, headers og body (parset JSON, når det er relevant). Brug [Credentials](./credentials.md) til Bearer eller brugerdefineret header-autentifikation.

Parres med [Webhooks](./webhooks.md), [Credentials](./credentials.md) og [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

WebSocket Send-noden åbner en udgående klientforbindelse, sender én tekst/JSON/binær besked og lukker den. Anvendes til at publicere workflow-output til realtidssystemer uden at oprette et Heym-hostet socket-endpoint.

Se også [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) og [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Telegram-noden sender en bot-besked til en chat, gruppe eller kanal. For at konfigurere noden skal der oprettes en Telegram-[legitimationsoplysning](./credentials.md), indstilles `chatId` og sammensættes den udgående `message` med [Expression DSL](./expression-dsl.md)-udtryk. Noden passer naturligt sammen med [Telegram Trigger](../nodes/telegram-trigger-node.md) til samtalebaserede workflows og med [Error Handler](../nodes/error-handler-node.md) til operatøralarmer.

Se også [Third-Party Integrations](./integrations.md) og [Credentials](./credentials.md) for opsætningsvejledninger og legitimationsmønstre.

#### [Slack](../nodes/slack-node.md)

Slack-noden sender en besked til en Slack-kanal via en Incoming Webhook. For at bruge noden skal der konfigureres en Slack-[legitimationsoplysning](./credentials.md) og et beskedudtryk. Noden egner sig til notifikationer, advarsler og fejlrapportering; output videregives gennem input.

Passer sammen med [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) og [Third-Party Integrations](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Discord-noden sender en besked til en Discord-kanal via en Incoming Webhook. For at bruge noden skal der konfigureres en Discord-[legitimationsoplysning](./credentials.md), sammensættes den udgående besked med [Expression DSL](./expression-dsl.md) og eventuelt angives webhook-brugernavn eller avatar-overstyringer.

Passer sammen med [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) og [Third-Party Integrations](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Send Email-noden sender e-mails via SMTP. For at bruge noden skal der konfigureres en SMTP-[legitimationsoplysning](./credentials.md) og [Expression DSL](./expression-dsl.md)-udtryk til modtager(e), emne og brødtekst. Noden egner sig til notifikationer, advarsler og transaktionsmails. Output inkluderer status, modtager og emne.

[IMAP Trigger](../nodes/imap-trigger-node.md) komplementerer Send Email ved at håndtere indgående mails. Sammen giver de mulighed for at workflowet kan læse indgående mails fra en fælles indbakke, sammenfatte eller klassificere dem med AI-noder og sende en opfølgning eller eskalering. [Telegram Trigger](../nodes/telegram-trigger-node.md) og [Telegram node](../nodes/telegram-node.md) giver samme indgående/udgående mønster til bot-drevne chat-workflows.

Til tovejs-notifikationsflows passer noden også godt sammen med [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) og [Third-Party Integrations](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Redis-noden udfører Redis-operationer: set, get, hasKey og deleteKey. Noden kan bruges til caching, rate limiting og nøgle-værdi-lagring. For at bruge noden skal der konfigureres en [legitimationsoplysning](./credentials.md), operationstype, nøgleudtryk og for set-operationer værdi og valgfri TTL. Output varierer efter operation (værdi, success, exists, deleted).

Passer sammen med [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) og [Parallel Execution](./parallel-execution.md) til caching, throttling og koordinering.

#### [Grist](../nodes/grist-node.md)

Grist-noden læser, skriver og administrerer data i Grist-regneark. Operationer inkluderer getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables og listColumns. For at bruge noden skal der angives dokument-ID, tabel-ID og for create/update postdata ved brug af kolonne-ID'er. Noden egner sig til CRUD, batchopdateringer og regnearksautomatisering.

Se også [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) og [Third-Party Integrations](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets-noden læser, skriver og administrerer regnearksdata via OAuth2. Noden kan bruges til at læse rapporter, tilføje workflow-resultater, opdatere trackere og inspicere eller rydde ark-faner fra et workflow. Ligesom [BigQuery](../nodes/bigquery-node.md) bruger noden en Google-baseret integrationslegitimationsoplysning og passer godt sammen med [Grist](../nodes/grist-node.md) når regnearksdata er en del af flowet.

Passer sammen med [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) og [Third-Party Integrations](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery-noden kører SQL-forespørgsler og indsætter rækker i Google BigQuery-datasæt via OAuth2. Noden er nyttig til analytiske workflows, rapporteringspipelines og skrivning af struktureret begivenhedsdata fra workflow-kørsler. Den passer ofte sammen med [Set](../nodes/set-node.md) til formning af rækker og [Google Sheets](../nodes/google-sheets-node.md) til lettere regnearksorienteret rapportering.

Passer sammen med [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) og [Third-Party Integrations](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Google Drive-noden lister, downloader, opdaterer og sletter filer og mapper i Drive via OAuth2 og kan kopiere en Drive-fil direkte til [Heym Drive](../nodes/drive-node.md) med `syncToHeymDrive`-operationen. Google Docs, Sheets og Slides har ikke downloadbare bytes, så noden eksporterer dem automatisk - Docs til PDF, Sheets til XLSX, Slides til PPTX - med mulighed for at tilsidesætte målformatet. Sletninger flytter elementer til Drive-papirkurven, medmindre "Slet permanent" er aktiveret, og noden nægter at slette en mappe via filoperationen eller omvendt. Ligesom [Google Sheets](../nodes/google-sheets-node.md) bruger den en Google-baseret OAuth2-legitimationsoplysning; bemærk at denne anmoder om fuld Drive-adgang, så gennemgå [Credential Sharing](./credentials-sharing.md) før deling.

Parres med [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) og [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

GitHub-noden tilbyder 40 native GitHub REST-handlinger, der dækker repositories, organisationer og brugere, issues, pull requests, reviews, releases, Actions-workflows, trafikindsigt og repository-filer. Anvendes til issue-håndtering, review-automatisering, workflow-udsendelse og afventning af fuldførelse, release-automatisering og repo-filopdateringer uden manuel HTTP-request-konstruktion. Understøtter GitHub.com og valgfri GitHub Enterprise `base_url` på legitimationsoplysningen.

Parres med [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) og [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Jira-noden forbinder workflows til Jira Cloud eller Jira Data Center / Server REST API'er til projekt-, issue-, kommentar-, vedhæftning-, bruger-, notifikations- og transitionsautomatisering. Kan liste projekter, søge issues med JQL, oprette eller opdatere issues, inspicere ændringslogge, underrette interessenter, håndtere kommentarer og vedhæftninger, hente eller administrere brugere, liste tilgængelige transitioner og flytte issues via et transition-ID. Brug en Jira-legitimationsoplysning med Atlassian-e-mail, API-token, site base URL og deployment mode.

Parres med [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) og [Third-Party Integrations](./integrations.md) til supportmodtagelse, fejlhåndtering og release-workflows.

#### [Linear](../nodes/linear-node.md)

Linear-noden forbinder workflows til Linears GraphQL API til workspace- og issue-automatisering. Kan liste teams, projekter, issues, workflow-tilstande, teammedlemmer og kommentarer; oprette, opdatere, slette og linke issues; samt oprette, opdatere, løse, genåbne eller slette kommentarer. Brug en Linear personlig API-nøgle eller OAuth2-legitimationsoplysning, og opdag team-, projekt-, tilstands- og assignee-UUID'er fra listeoperationer før oprettelse eller opdatering af issues.

Parres med [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) og [Third-Party Integrations](./integrations.md) til modtagelse, håndtering og ingeniør-backlog-workflows.

#### [Supabase](../nodes/supabase-node.md)

Supabase-noden læser og muterer tabeller eksponeret gennem Supabase PostgREST. Egner sig godt til produkt-backends, bruger-/profildata, workflow-tilstand og CRUD-style-automatiseringer, der ønsker databaseadgang uden brugerdefineret HTTP-request-konfiguration.

Parres med [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) og [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

ClickHouse-noden udfører CRUD-, count- og raw SQL-operationer mod en ekstern ClickHouse-database via dens HTTP-interface. Egner sig til analytikpipeliner, eventlogging og rapporteringsworkflows: indsæt events efterhånden som de sker, og aggreger eller tæl dem med `query`/`count`. Spejler [DataTable](../nodes/datatable-node.md)-operationssættet (find, getAll, count, getById, insert, update, remove, upsert) plus en raw SQL-escape-hatch, hvor `update`/`remove` kører som ClickHouse-mutationer.

Parres med [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) til planlagte rapporter og [Third-Party Integrations](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Notion-noden administrerer Notion-databaser, datakilder, sider og blokke gennem den aktuelle Notion API (`2026-03-11`). Understøtter søgning, side-CRUD, database- og datakildeoperationer, blokbørn, tilføjelse/opdatering/sletning af blokke samt papirkurv/genoprettelse. Brug et intern integrationstoken eller en Notion public integration OAuth-legitimationsoplysning. Editoren kan søge og cursor-paginere tilgængelige datakilder og overordnede sider. Delte legitimationsoplysninger fungerer på samme måde som ejede legitimationsoplysninger til workflow-udførelse.

Til brugerdefinerede REST-kald resolver `$credentials.YourNotionCredential` til samme bearer-token. Parres med [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) og [Third-Party Integrations](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Sentry-noden automatiserer Sentry-organisationer, projekter, teams, issues, events og releases gennem Sentry REST API. Den kan anvendes til alert-håndtering, opdatering af issue-status, release-automatisering, opslag af events samt opsætning eller oprydning af projekter og teams. Noden understøtter både Sentry SaaS og selvhostede Sentry-installationer via en valgfri base URL i legitimationsoplysningerne.

Kombineres typisk med [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) og [Third-Party Integrations](./integrations.md) til incident- og release-workflows.

#### [DataTable](../nodes/datatable-node.md)

DataTable-noden læser, skriver og administrerer data i Heym DataTables (first-party struktureret lagring). Operationer omfatter find, getAll, getById, insert, update, remove og upsert. Der kræves ingen eksterne legitimationsoplysninger. Tabeller administreres fra [DataTable](../tabs/datatable-tab.md)-dashboardet og tilgås direkte af workflow-ejeren.

Passer godt sammen med [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) og [DataTable-tab](../tabs/datatable-tab.md) til first-party struktureret lagring.

#### [Drive](../nodes/drive-node.md)

Drive-noden håndterer filer genereret af skills direkte fra et workflow. Operationer inkluderer delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams og unshareWithMyTeams til skrivebeskyttet teamadgangsstyring; filkonvertering håndteres i stedet af [Converter](../nodes/converter-node.md)-noden. Referer til filen med `$agentLabel._generated_files[0].id`. Outputs omfatter status, file_id, opdateret download_url til linkbegrænsninger samt shared_team_count til teamdeling. Særligt nyttigt sammen med [Agent Node](../nodes/agent-node.md)-workflows der anvender [File Generation](./file-generation.md) og [Drive](./drive.md)-referencemodellen.

Almindelige kombinationer er [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) og [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3-noden udfører objektlagringsoperationer på Amazon S3 ved brug af `s3`-legitimationsoplysninger (access key, secret key, region, valgfri session token). Operationer omfatter putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder og listBuckets. Der understøttes tekstupload samt tekst- eller base64-download, hvor bucket- og key-felter accepterer [Expression DSL](./expression-dsl.md). Anvendes til lagring af workflow-outputs, filarkivering og indlæsning af objekter tilbage i en flow.

Kombineres med [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) og [Third-Party Integrations](./integrations.md).

### Automatisering

#### [Crawler](../nodes/crawler-node.md)

Crawler-noden scraper websider ved hjælp af FlareSolverr med valgfri HTML-ekstraktion via CSS-selectors. Konfigureres med FlareSolverr-[legitimationsoplysninger](./credentials.md), URL-udtryk, ventetid og valgfrie selectors til ekstraktion. Output er enten rå HTML eller ekstraheret indhold. Anvendes til webscraping og indholdsextrahering.

Passer godt sammen med [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) og [LLM](../nodes/llm-node.md) til scrape-og-analyser-flows.

#### [Playwright](../nodes/playwright-node.md)

Playwright-noden automatiserer browserinteraktioner med konfigurerbare trin (navigate, refresh, click, type, screenshot, extract, aiStep) eller **Run Code**-tilstand til brugerdefineret Playwright Python (sandboxed; deaktiveret som standard via `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Understøtter headless-tilstand, en valgfri indstilling der reducerer almindelige Playwright-automatiseringssignaler, timeouts, valgfri netværksfangst (responser, cookies, localStorage, sessionStorage), cookie/storageState auth bootstrap fra [Global Variables](./global-variables.md)-udtryk som `$global.authState`, fallback-logintrin ved auth-genoprettelsesfejl samt AI-trin med Auto Heal når selectors fejler. Anvendes til webscraping, formularudfyldning og browserbaserede workflows.

Se også [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) og [Execution History](./execution-history.md) til browserautomatisering og debugging.

### Hjælpefunktioner

#### [Output](../nodes/output-node.md)

Output-noden er workflow-endpointet der returnerer responsen til kaldet. Indstil message-udtrykket til at referere til den foregående node via label (brug aldrig `$input` fra [Input](../nodes/input-node.md)-noden her). Valgfri async downstream tillader noder efter output at køre i baggrunden efter responsen er sendt.

Almindelige upstream-kilder er [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) og [Execute](../nodes/execute-node.md); responsformning er lettere at debugge i [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper-noden konstruerer et simpelt JSON-objekt fra [Set](../nodes/set-node.md)-style key-value-mappings og returnerer det i roden af workflow-responsen. Anvendes når en API-kaldende part skal modtage en rå JSON-body i stedet for standard [Output](../nodes/output-node.md)-node-wrapperen.
#### [HTML-outputmapper](../nodes/html-output-mapper-node.md)

HTML-outputmapper-noden gengiver en enkelt HTML-skabelon ved at interpolere `$nodeLabel.field`-udtryk ind på siden. Når det er workflowets eneste terminal-node, svarer execute-webhook'en med `text/html` og nodens konfigurerede statuskode i stedet for en JSON-krop, så et workflow kan servere en side direkte til en browser. Send `X-Simple-Response: false` for at få det sædvanlige JSON-kuvert svar tilbage til fejlfinding.

Parres med [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow-struktur](./workflow-structure.md) og [Webhooks](./webhooks.md).

#### [Diagramoutput](../nodes/chart-output-node.md)

Diagramoutput-noden er terminalnoden i et [Dashboard](../tabs/dashboard-tab.md)-widget-workflow. Den omdanner de rækker, der produceres af opstrømsnoder, til en standardiseret diagram-payload, som dashboardet gengiver. Vælg en `chartType` (søjle, linje, område, cirkel, tabel, numerisk, måler, spredning, proportion, søjlemåler, Gantt, entity relationships, tekst eller HITL), tilknyt `labelField`/`valueField` (eller `series` til flere serier, eller `text` til en markdown-besked), og placer den sidst; den har ingen outputkant. Gantt læser opgaverækker med ISO-start-/slutdatoer, fremskridt og afhængigheds-id'er. Entity relationships læser et grafobjekt med entiteter, felter, PK/FK-nøgler og relationer. Begge gengives også på Heym Work-sider og i forhåndsvisninger af widgetforslag. HITL ignorerer opstrømsrækker og viser afventende menneskelige gennemgange. og en anden som linkknapper, der åbner en URL på en ny fane (`linkColumn`, med `linkLabel` til knapteksten)

Se også [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) og [Output](../nodes/output-node.md).

#### [Vent](../nodes/wait-node.md)

Vent-noden sætter workflow-udførelsen på pause i en angivet varighed i millisekunder, op til 15 minutter. Anvend den til hastighedsbegrænsning, forsinkede handlinger eller afsøgningsintervaller. Den sender input uændret videre.

Parres med [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) og [Parallel udførelse](./parallel-execution.md) til pacing og afsøgning.

#### [Klistermærke](../nodes/sticky-note-node.md)

Klistermærke-noden tilføjer markdown-noter til canvas'et. Den udføres ikke. Brug den til dokumentation, instruktioner eller workflow-noter sammen med andre [Canvas-funktioner](./canvas-features.md). Dobbeltklik på canvas'et for at redigere noteindholdet.

Se også [Canvas-funktioner](./canvas-features.md), [Tastaturgenveje](./keyboard-shortcuts.md) og [Workflow-organisation](./workflow-organization.md).

#### [Konsollog](../nodes/console-log-node.md)

Konsollog-noden logger en værdi til backend (server)-konsollen. Brug den til fejlfinding og inspektion under udvikling. Logbeskeden understøtter [Expression DSL](./expression-dsl.md)-udtryk; output sendes uændret videre.

Parres med [Udførelseshistorik](./execution-history.md), [Spor](../tabs/traces-tab.md) og [Udtryksvurderingsdialog](./expression-evaluation-dialog.md) til fejlfinding.

#### [Deaktiver node](../nodes/disable-node.md)

Deaktiver node-noden deaktiverer permanent en anden node i workflowet ved at sætte dens `active`-flag til false. Angiv målnoden ved etiket. Brug den til engangsoperationer som at stoppe en [Cron](../nodes/cron-node.md)-trigger efter en betingelse er opfyldt.

Se også [Canvas-funktioner](./canvas-features.md), [Redigeringshistorik](./edit-history.md) og [Cron](../nodes/cron-node.md) til workflow-kontrolmønstre.

#### [Aktiver node](../nodes/enable-node.md)

Aktiver node-noden tænder for en anden node igen ved at sætte dens `active`-flag til true og gemme ændringen. Angiv målnoden ved etiket. Brug den til at genaktivere en deaktiveret [Cron](../nodes/cron-node.md)-trigger fra en anden indgangspunkt, eller til at tænde for en node, når en betingelse er opfyldt. En mål-node, der ligger nedstrøms af Aktiver node og endnu ikke er kørt, kører også i den aktuelle udførelse.

Se også [Deaktiver node](../nodes/disable-node.md), [Canvas-funktioner](./canvas-features.md) og [Cron](../nodes/cron-node.md) til workflow-kontrolmønstre.

#### [Kast fejl](../nodes/throw-error-node.md)

Kast fejl-noden stopper workflow-udførelsen øjeblikkeligt og returnerer en fejlrespons med en brugerdefineret HTTP-statuskode. Indstil fejlmeddelelsesudtrykket og statuskoden (f.eks. 400, 401, 403, 404, 429, 500). Brug den til valideringsfejl, uautoriseret adgang eller andre fejltilstande, især når den parres med [Condition](../nodes/condition-node.md) og [Error Handler](../nodes/error-handler-node.md).

Parres med [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) og [Sikkerhed](./security.md) til eksplicitte fejlveje.

---

## Reference
### [Nodetyper](./node-types.md)

Heym tilbyder en række forskellige nodetyper: triggers som [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) og [Error Handler](../nodes/error-handler-node.md); AI-noder som [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) og [MCP Call](../nodes/mcp-call-node.md); logiknoder som [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) og [Loop](../nodes/loop-node.md); datanoder som [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) og [Heym](../nodes/heym-node.md); integrationer som [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) og [Drive](../nodes/drive-node.md); automationsnoder som [Crawler](../nodes/crawler-node.md) og [Playwright](../nodes/playwright-node.md); samt hjælpeværktøjer som [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) og [Sticky Note](../nodes/sticky-note-node.md). Det er muligt at bruge udtryk som `$input.text` og `$nodeLabel.field` i nodekonfigurationen.

Se også [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) og [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym anvender et simpelt udtrykssprog til at henvise til data fra opstrømsnoder. Brug `$input` for [Input](../nodes/input-node.md)-noden, `$nodeLabel.field` for enhver opstrømsnode, `$credentials.CredentialName` for [legitimationsoplysninger](./credentials.md) og `$global.variableName` for [globale variabler](./global-variables.md). Indbyggede specielle variabler inkluderer `$now`, `$UUID` samt workflow-metadata: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` og `$executionId` (kørslens [Execution History](./execution-history.md)-id - `/workflows/{id}/{executionId}` åbner denne kørsel på canvas; kun tilgængelig under kørsel, tom i udtryksforhåndsvisningsdialogen). Understøttelse omfatter litteraler, aritmetik, sammenligninger, [Loop](../nodes/loop-node.md)-kontekst, nestede felter samt streng-/arrayhjælpere (inklusive `$text.toJson()` til at parse en JSON-streng). Når hele værdien er et enkelt `$expr`, bevarer backend'en arrays, objekter, booleans og tal som native typer.

Se også [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) og [Workflow Structure](./workflow-structure.md).

### [Globale variabler](./global-variables.md)

Den globale variabelbutik indeholder persistente, brugerdefinerede nøgle-værdi-data, der bevares på tværs af workflowkørsler. Variabler kan oprettes fra [Variables](../tabs/global-variables-tab.md)-fanen eller fra en [Variable](../nodes/variable-node.md)-node med "Store in Global Variable Store" aktiveret. Adgang sker via `$global.variableName` i udtryk; de kan deles med andre brugere eller [teams](./teams.md).

Suppleres med [Variable](../nodes/variable-node.md), [Teams](./teams.md) og [Credentials Sharing](./credentials-sharing.md) for delt workflowtilstand.
### [Udtryksvurderingsdialog](./expression-evaluation-dialog.md)

Udtryksvurderingsdialogen er en udvidelig editor, der vises ved at klikke på udvidelsesknappen ved siden af udtryksfelter. Den åbner som en stor centreret modal, bevarer autofærdiggørelse aktiv og opdaterer forhåndsvisningen af backend-output automatisk efter en pause i indtastningen. Objekt- og array-resultater kan gennemses med output-stivælgeren. Dialogen accepterer en fuld linje med en simpel dot-sti (f.eks. `myNode.output.field`) som om det var `$myNode.output.field`; se [Expression DSL](./expression-dsl.md) placeringregler.

Knappen **Build with AI** i værktøjslinjen giver mulighed for at beskrive det ønskede udtryk i almindelig tekst. Vælg en LLM-[legitimationsoplysning](./credentials.md) og model, indtast en beskrivelse som *"Hent kundens navn fra API-svaret"* og klik på Generer. Backenden sender [Expression DSL](./expression-dsl.md)-konteksten og de seneste node-outputs til modellen og returnerer et enkelt udtryksstreng. Resultatet evalueres umiddelbart, så det kan verificeres før der klikkes på Anvend.

Passer naturligt sammen med [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) og [JSON-outputmapper](../nodes/json-output-mapper-node.md).

### [Workflow-struktur](./workflow-structure.md)

Workflows gemmes som JSON med noder og kanter. Workflow-objektet inkluderer id, navn, beskrivelse, noder, kanter og auth-indstillinger. Hver node har id, type, position og data (label og typespecifik konfiguration). Kanter forbinder source- og target-node-ID'er med valgfri handle-ID'er. Udtrykssyntaks i datafelter følger [Expression DSL](./expression-dsl.md), og samme struktur bruges af [Download & Import](./download-import.md).

Se også [Node-typer](./node-types.md), [Expression DSL](./expression-dsl.md) og [Download & Import](./download-import.md).

### [Canvas-funktioner](./canvas-features.md)

Hold markøren over en ikke-fast canvas-node og klik på **Kør** for at udføre op til den pågældende node. Påkrævede input åbnes i Kør-panelet med det første felt i fokus; stier uden input starter umiddelbart. Se [Kør til Node](./canvas-features.md#run-to-node).

Workflow-editoren tilbyder Data Pin (fastgør en nodes seneste output til test af downstream uden genkørsel), Kørselslogfiler (realtids-node-resultater og agent-fremskridt der supplerer [Kørselshistorik](./execution-history.md)), Aktivér/Deaktivér (spring noder over under kørsel) og Ekstraher til Sub-Workflow (flyt et udvalg til en ny workflow og erstat det med en [Execute](../nodes/execute-node.md)-node). En igangværende produktionskørsel kan åbnes fra Historik eller et Board-kort; editoren gendanner dens aktuelle snapshot, tilknytter SSE og bevarer canvas-animationen og Debug-logs live. [Tastaturgenveje](./keyboard-shortcuts.md) understøtter kopiering, indsætning, kørsel og inline-node-søgning.

Se også [Tastaturgenveje](./keyboard-shortcuts.md), [Redigeringshistorik](./edit-history.md) og [Kørselshistorik](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Se Editor-demo</a></p>

### [Tastaturgenveje](./keyboard-shortcuts.md)

Heym tilbyder genveje i hele editoren: Kommandopalette (Ctrl+K), Kør (Ctrl+Enter), Gem (Ctrl+S), Fortryd/Gendan og Escape for at lukke. På canvas: vælg alt, multivalg, kopier/klip/indsæt, slet, skift node-aktiv (D), skift fastgjort data (P) og inline-node-søgning ved indtastning. Genvejene dokumenteres i den indbyggede reference og fungerer tæt sammen med [Canvas-funktioner](./canvas-features.md) som Data Pin og node-aktiv/deaktiv.

Se også [Canvas-funktioner](./canvas-features.md), [Hurtigskuffe](./quick-drawer.md) og [Kontekstuel showcase](./contextual-showcase.md).

### [AI-assistent](./ai-assistant.md)

AI-assistenten er en chatpanel åbnet fra Debug-panelet, der giver mulighed for at oprette eller ændre workflows med naturligt sprog. Vælg en [legitimationsoplysning](./credentials.md) og model, beskriv derefter ønsket; AI'en streamer et svar, og enhver gyldig [workflow-JSON](./workflow-structure.md) i en kodeblok parses automatisk og anvendes på canvas. Stemmeinput understøttes i kompatible browsere.

Aktivér **YOLO-tilstand** (Agent-tilstand, deaktiveret som standard), så assistenten tester det den bygger. Efter hver ændring kører den workflowet på canvas, læser resultatet og retter workflowet indtil det gør det ønskede, op til 5 kørsler pr. besked. Den spørger om testinput før første kørsel, kan køre andre workflows hvis den har brug for deres resultat, og viser hvert trin undervejs. Se [AI-assistent › YOLO-tilstand](./ai-assistant.md#yolo-mode).

Klik på **AI** over en vilkårlig node på lærredet for kun at ændre eller rette denne node. Panelet viser den node, der ændres (med dens seneste resultat, når den har kørt), og tilbyder **Change this node as ...**, **Fix error in this node ...** og **Other**. Kun denne node opdateres; resten af workflowet og layoutet forbliver som de er. Se [AI Assistant › Ændring af en enkelt node](./ai-assistant.md#changing-one-node).

Når en workflow gemmer poster, spørger assistenten hvilken [datatabel](../tabs/datatable-tab.md) der skal bruges, eller opretter en med de kolonner workflowet kræver. Se [AI-assistent › Datatabeller](./Chat og MCP `heym_chat` kan også redigere kolonner og rækker direkte ved hjælp af ejer- eller skriveadgang, med bekræftelse før fjernelse af kolonner eller rydning af alle rækker. Chat og MCP `heym_chat` kan også redigere kolonner og rækker direkte ved hjælp af ejer- eller skriveadgang, med bekræftelse før fjernelse af kolonner eller rydning af alle rækker. ai-assistant.md#data-tables).

Når den aktuelle workflow indeholder [Agent Node](../nodes/agent-node.md)-færdigheder, sender assistenten kun hver færdigheds `SKILL.md` ind i workflow-konteksten. Vedhæftede `.py`-filer og binære færdighedsaktiver udelukkes før anmodningen, så store færdighedspakker ikke overskrider modelkontekstvinduet.

Passer godt sammen med [Chat med Heym](./chat-with-heym.md), [Agentarkitektur](./agent-architecture.md) og [Expression DSL](./expression-dsl.md).
### [Chat med Heym](./chat-with-heym.md)

Chat med Heym er en dokumentationsassistent til produktspørgsmål. Den åbner i en centreret dialog, holder legitimationsoplysninger og modelvalg synlige øverst, indsætter den aktive dokumentationsside som kontekst og rydder beskedhistorikken, når dialogen lukkes. Den supplerer den mere omfattende [AI Assistant](./ai-assistant.md) og den lettere [Contextual Showcase](./contextual-showcase.md).

Se også [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) og [Node Types](./node-types.md).

### [Workflow-organisation](./workflow-organization.md)

Instansadministratorer (`HEYM_ADMIN_EMAILS`) har adgang til og kan redigere alle workflows, finde en ejers workflows via email, inspicere tidsplaner og kørselshistorik, pause og genoptage automatiske triggers samt slette workflows, når kørsler er afsluttet. Se [Instance Administration](../tabs/workflows-tab.md#instance-administration) for offboarding-flowet og forskellen mellem at pause automatiske triggers og blokere alle kald.

Workflows kan organiseres i mapper og undermapper i en træstruktur. Mapper har navne og en valgfri overordnet mappe; workflows tildeles mapper. Workflows kan planlægges til sletning (flyttes til en papirkurv, før de fjernes permanent). API'en understøtter oprettelse, opdatering, sletning og flytning af workflows mellem mapper, og den samme organisationsmodel vises i fanen [Workflows](../tabs/workflows-tab.md).

Se også [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) og [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer er et fast højrepanel til hurtig kørsel på interne ikke-canvas-sider. Det giver mulighed for at søge efter [workflows](../tabs/workflows-tab.md), fastgøre favoritter, vælge inputs, køre med det samme samt inspicere fremskridt eller resultater uden at åbne editoren. Et workflow med en [File Upload Trigger](../nodes/file-upload-trigger-node.md) modtager en sluppet eller valgt fil. Fastgørelsesrækkefølge og det sidst valgte workflow gemmes i browseren.

Se også [Workflow Organization](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) og [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase er en kompakt in-app-guide til autentificerede hovedflader som dashboard-faner, [Evals](../tabs/evals-tab.md), Docs og workflow-editoren. Den forbliver som standard lukket, giver først en kort sidesammenfatning, tilbyder lidt ekstra detaljer på anmodning og linker til den fulde dokumentationsartikel, når der ønskes dybere vejledning.

Suppleres med [Chat med Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) og [AI Assistant](./ai-assistant.md) for in-app-vejledningsflows.

### [Legitimationsoplysninger](./credentials.md)

Legitimationsoplysninger gemmer API-nøgler og hemmeligheder, der bruges af workflow-noder. Tilføj dem i fanen [Credentials](../tabs/credentials-tab.md) og henvis til dem ved navn eller ID i noder som [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) og [Redis](../nodes/redis-node.md). De er krypteret i hvile, kan deles med brugere eller [teams](./teams.md) og kan også henvises til i [Expression DSL](./expression-dsl.md) via `$credentials.Name`.

Se også [Credentials](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md) og [Third-Party Integrations](./integrations.md).

### [Deling af legitimationsoplysninger](./credentials-sharing.md)

Legitimationsoplysninger kan deles med andre brugere via email eller med teams; alle teammedlemmer får adgang, når legitimationsoplysninger deles med et team. Delte legitimationsoplysninger vises med en indikator i fanen [Credentials](../tabs/credentials-tab.md). Ved kørsel flettes workflow-ejerens kontekst med egne, bruger-delte og team-delte legitimationsoplysninger. Brug `$credentials.CredentialName` i udtryk eller sæt credentialId i nodedata.

Se også [Credentials](./credentials.md), [Teams](./teams.md) og [Third-Party Integrations](./integrations.md).

### [Teams](./teams.md)

Teams giver mulighed for at dele workflows, legitimationsoplysninger, globale variabler, vektorlagre og Drive-filer med en gruppe brugere på én gang. Opret teams fra fanen [Teams](../tabs/teams-tab.md) og tilføj medlemmer via email. Del ressourcer med et team fra de relevante delingsdialogue; alle medlemmer har derefter adgang. Opretteren kan redigere og slette teamet; sletning af et team fjerner alle team-deling.

Suppleres med [Credentials Sharing](./credentials-sharing.md), [Global Variables](./global-variables.md) og [Enterprise](./enterprise.md).

### [Parallel kørsel](./parallel-execution.md)

Heym kører noder parallelt, når de ikke har afhængigheder af hinanden. Executoren bygger en DAG og kører noder på samme niveau samtidigt med en trådpulje; så snart en node er færdig, planlægges dens nedstrømsnoder. Brug [Merge](../nodes/merge-node.md)-noden til at kombinere parallelle grene, når det er nødvendigt. Flere workflow-kørsler udføres samtidigt; hver kørsel er isoleret. [SSE Streaming](./sse-streaming.md)-tilstand udsender begivenheder, når noder afsluttes.

Se også [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) og [Execution History](./execution-history.md).
### [Agentarkitektur](./agent-architecture.md)

[Agent Node](../nodes/agent-node.md) understøtter sub-agenter (orchestrator kalder andre agent-noder via call_sub_agent), sub-workflows (agent kalder andre workflows via call_sub_workflow), skills (instruktionsindhold og Python-værktøjer fra .zip eller .md) samt [MCP](../tabs/mcp-tab.md) klientforbindelser. Orchestrator-værktøjsudførelsen dirigerer sub-agent- og sub-workflow-kald; andre værktøjer sendes til Python-, MCP- eller skill-udførere. Maksimal nestingdybde for sub-agenter og sub-workflows er 5. Værktøjskaldingsløkken inkluderer automatisk kontekstkomprimering: før hver iteration estimeres tokenforbrug, og hvis det overstiger 80% af modellens kontekstvindue, sammenfattes de midterste beskeder ved hjælp af samme model, mens systemprompten, den første brugerbesked og den sidste brugerbesked bevares uændret.

Se også [Agent Node](../nodes/agent-node.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) og [MCP](../tabs/mcp-tab.md).

### [Agent Persistent Memory](./agent-persistent-memory.md)

Valgfri videnbase pr. [Agent Node](../nodes/agent-node.md), der gemmes i Postgres: enheder, typer, egenskaber og rettede relationer. Når `persistentMemoryEnabled` er sand, sammenfattes grafen i systemprompten ved hver kørsel; efter vellykkede fuldførelser udtrækker en [LLM](../nodes/llm-node.md) strukturelle opdateringer i baggrunden. REST CRUD findes under `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Editoren åbnes fra den pink hjerne-kontrol på noden.

Se også [Agent Node](../nodes/agent-node.md), [Agentarkitektur](./agent-architecture.md) og [Traces](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-Loop gør det muligt for en [Agent Node](../nodes/agent-node.md) at anmode om godkendelse ved specifikke checkpoints, oprette en offentlig `/review/{token}`-side og vente på, at en ikke-logget anmelder accepterer, redigerer eller afviser Markdown-anmeldelsesteksten. HITL-aktiverede agenter eksponerer også et `review` output-handle, så det er muligt at underrette [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) eller andre kanaler, mens kørslen er afventende. Node-niveauets HITL-tekst bruges som godkendelsesretningslinjer, mens den offentlige-side-sammenfattning genereres fra anmeldelsesanmodningen selv. Afventende kørsler vises umiddelbart i [Execution History](./execution-history.md), kan forekomme mere end én gang i samme kørsel og genoptages fra det nøjagtige gemte workflow-øjebliksbillede, når hver beslutning er indsendt.

Se også [Agent Node](../nodes/agent-node.md), [Portal](./portal.md), [Execution History](./execution-history.md) og [Send Email](../nodes/send-email-node.md).

### [Webhooks](./webhooks.md)

Workflows kan udløses via [HTTP](../nodes/http-node.md) på `POST /api/workflows/{workflow_id}/execute` eller streames inkrementelt fra `POST /api/workflows/{workflow_id}/execute/stream`. Request-body sendes som body til [Input](../nodes/input-node.md)-noder; headers og query-parametre er tilgængelige i [Expression DSL](./expression-dsl.md)-udtryk. Konfigurer per-workflow-autentificering: anonym, JWT eller brugerdefineret header. Valgfri response-caching, rate-limiting og editorens Run with cURL-dialog findes på workflow-niveau og gælder for begge tilstande. Med en [concurrency-grænse](./webhooks.md#concurrency-limit-and-queued-runs) modtager et kald, der skal vente, i stedet `202 Accepted` med et eksekverings-ID og en status-URL.

Se også [Input](../nodes/input-node.md), [Execution Tokens](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) og [Workflow Structure](./workflow-structure.md).

### [Execution Tokens](./execution-tokens.md)

Execution tokens er scopede JWTs, der giver adgang til et enkelt workflows execute- og stream-endpoints. Når et workflow bruger JWT-autentificering, giver tokens eksterne scripts, CI-pipeliner og integrationer mulighed for at kalde workflowet uden at dele en brugersession. Hvert token indeholder et `wid`-claim, der binder det til ét workflow, et `jti` til øjeblikkelig tilbagekaldelse og en konfigurerbar TTL (60 sekunder til 10 år). Opret, vælg og tilbagekald tokens direkte fra **Run with cURL**-dialogen - det valgte token indlejres automatisk i den genererede kommando.

Se også [Webhooks](./webhooks.md), [Security](./security.md) og [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

cURL-dialogen kan skifte [webhook](./webhooks.md)-udførelse til Server-Sent Events-tilstand. Dette producerer `execution_started`, `node_start`, `node_complete` og `execution_complete`-events i realtid, tilføjer `--no-buffer` til den genererede cURL-kommando og giver mulighed for at konfigurere per-node startbeskeder såsom `[START] LLM` eller brugerdefineret tekst til eksterne terminalforbrugere.

Se også [Webhooks](./webhooks.md), [Execution History](./execution-history.md) og [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Workflows startes af trigger-noder ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) receive) eller indgangspunkter: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron-scheduler, Telegram-webhook, Discord-interaktionswebhook, IMAP-trigger-manager, RabbitMQ-consumer eller Editor-run. Hver trigger har sin egen endpoint eller baggrundsproces; [Cron](../nodes/cron-node.md) kører hver 60. sekund, [Telegram Trigger](../nodes/telegram-trigger-node.md)-noder modtager bot-webhooks, [Discord Trigger](../nodes/discord-trigger-node.md)-noder modtager signerede interaktionswebhooks, og [IMAP Trigger](../nodes/imap-trigger-node.md)-noder kører på deres konfigurerede polling-interval. [Input](../nodes/input-node.md)-noder modtager body, headers og query fra webhook-forespørgsler.

Se også [Node-typer](./node-types.md), [Webhooks](./webhooks.md) og [Parallel Execution](./parallel-execution.md).

### [Kørselshistorik](./execution-history.md)

Kørselshistorik registrerer workflow-kørsler: inputs, outputs, node-resultater, status og triggerkilde. Adgang sker via Editor-værktøjslinjen, Docs-visning, Dashboard-header eller [Evalueringer](../tabs/evals-tab.md)-visning. Per-workflow-historik viser kørsler for det åbne workflow; alt-historik-visning viser kørsler på tværs af workflows og chat. I øjeblikket kørende eksekveringer vises øverst i begge dialoger med **Åben live** og **Annuller**-handlinger. Åben live tilknytter editoren til den eksisterende kørsel via [SSE](./sse-streaming.md), gendanner fuldførte noder, pulserer aktuelle og ventende noder og tilføjer Debug-logs uden at starte en ny kørsel. Bring to Canvas indlæser en fuldført kørsels inputs og node-outputs til genkørsel eller debugging; den dybe link `/workflows/{workflowId}/{executionId}` understøtter både live og fuldførte kørsler. [Human-in-the-Loop](./human-in-the-loop.md)-pausede kørsler gemmes umiddelbart som `pending`, inklusive den offentlige gennemgangs-URL og eventuelle notifikationsnoder eksekveret fra agentens `review`-gren. Hvis serveren genstartes midt i en kørsel, gendannes afbrudte kørsler automatisk: de køres forfra med samme inputs og markeres som fuldført (markeret **Gendannet**), styret af en per-workflow **Auto-recover runs**-kontakt, der i stedet kan registrere dem som `skipped`.

Se også [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) og [Traces](../tabs/traces-tab.md).

### Kørselshøjdepunkter

Efter en live kørsel - eller efter **Bring to Canvas** - vises en afviselig **Kørselshøjdepunkter**-popup øverst til højre på Canvas, der viser, hvad hver node producerede i kørselstilfældig rækkefølge. Det er en hurtig måde at inspicere per-node-output uden at åbne hver node; luk den med **✕**, og den genåbnes ved næste kørsel. Højdepunkter vises også på dashboard-kørsler. Se [Kørselshistorik](./execution-history.md) for detaljer.

### [Redigeringshistorik](./edit-history.md)

Redigeringshistorik sporer gemte versioner af et workflow (hver Gem-opretter en version). Vis listen, åbn en version for at se en diff mod det aktuelle workflow ([noder](./workflow-structure.md), kanter, konfig) og Revert for at gendanne en tidligere version. I modsætning til [Kørselshistorik](./execution-history.md) sporer Redigeringshistorik strukturændringer, ikke kørsler.

Se også [Kørselshistorik](./execution-history.md), [Workflow-struktur](./workflow-structure.md) og [Canvas-funktioner](./canvas-features.md).

### Fejlworkflow

Et workflow kan udpege et andet workflow til at køre, når det fejler. Konfigurer det i workflow-niveauets **Egenskaber**-panel (vises, når ingen node er valgt) under **Ved fejl, kør workflow**. Kun workflow-ejeren kan angive, ændre eller fjerne det; se [Ejerkun-indstillinger](./workflow-organization.md#owner-only-settings). Når en topniveau-kørslingsslutter med en uhåndteret fejl, kører det valgte fejlworkflow og modtager fejlkonteksten (fejlet workflow-id og -navn, kørsel-id, fejlmeddelelse, fejlet node-label og -type samt en tidsstempel). Hvis canvas allerede indeholder en [Error Handler](../nodes/error-handler-node.md)-node, har den lokale handler forrang, og fejlworkflowet kaldes **ikke**. Fejlworkflowet kører direkte, så det udløser aldrig sit eget fejlworkflow.

Det dækker hver ikke-test topniveau-kørsel: både execute-endpoints, [Portal](./portal.md) og hver trigger, inklusive [cron](../nodes/cron-node.md), chat-platform-triggere, e-mail, køer, [MCP](../tabs/mcp-tab.md) og dashboard-widgets. Med [Load Distribution](./cluster.md) aktiveret forbliver dette uændret, inklusive kørsler en worker eksekverede: den fejlende node rejser tilbage med resultatet, og fejlworkflowet distribueres derefter som enhver anden kørsel, så en node inde i det, der skal køre på hovedinstansen, stadig gør det. To tilfælde udelades bevidst, fordi workflowets egen udfald endnu ikke er kendt: en kørsel, ingen instans nogensinde eksekverede, og en ventetid, der udløb, mens kørsel måske stadig kører. Det udløses heller **ikke** af manuelle canvas-testkørsler.
### Workflow Timeout

Det er muligt at angive en **workflow timeout** i sekunder på workflow-niveau i **Properties**-panelet. Standardværdien `0` deaktiverer funktionen. Når timeout er sat, afbrydes en kørsel, der overskrider grænsen, ved næste node-grænse og registreres som en mislykket kørsel med en "timed out"-fejl. Timeout gælder for manuelle, API- og triggered kørsler. Lange [Wait](../nodes/wait-node.md)-noder afbrydes omgående i stedet for at blokere for deres fulde varighed.

### Concurrency-grænse

Hvert workflow kan begrænse, hvor mange produktionskørsler der afvikles samtidigt med **Concurrency-grænse** i panelet **Properties** på workflow-niveau; ejeren og bidragydere med redigeringsadgang kan ændre det, og det er slået fra som standard. Når grænsen nås, venter nye kørsler fra [webhook-](./webhooks.md#concurrency-limit-and-queued-runs) og [streaming-endpoints](./sse-streaming.md), [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) og hver [trigger](./triggers.md) i en FIFO-kø (først ind, først ud), talt på tværs af alle instanser i et [cluster](./cluster.md). Editortestkørsler, sub-workflowkald, [Evals](../tabs/evals-tab.md) og genoptagelser efter review sættes aldrig i kø, og kortkørsler på [Board](../tabs/board-tab.md), filuploadkørsler, kørsler startet af AI-assistentens run-workflow-værktøj og advarselsmeddelelsesworkflows starter uden at vente på en plads. Et webhook-kald, der skal vente, modtager straks `202 Accepted` med et `execution_id`, en status-URL, der svarer med de samme legitimationsoplysninger, dens position, køstørrelsen og antallet af kørende instanser; en MCP-klient modtager det samme og poller værktøjet `heym_execution_status`. Den valgfrie indstilling **Maks. køstørrelse** afviser ekstra kald med `429`, og den valgfrie **Maks. ventetid** registrerer en kørsel, der ventede for længe, som `expired`. Ventende kørsler vises i [Kørselshistorik](./execution-history.md) som **I kø n/m** og kan annulleres der.

### Tid sparet

Det er muligt at registrere et **estimeret tidsbesparelse per kørsel** (i minutter) på workflow-niveau i **Properties**-panelet. Fanen [Analytics](../tabs/analytics-tab.md) aggregerer dette over det valgte interval som en samlet **Time Saved**-statistik (summen af hvert workflows estimat × dets vellykkede kørsler). "Most Used" viser også denne sum per workflow; **Not Set** åbner estimatfeltet, når det ikke er sat. Rapporten [Workflow Analysis](./workflow-analysis.md) anbefaler at angive et estimat, når der ikke er konfigureret et.

### [Indstillinger](./user-settings.md)

Indstillingsdialogen (åbnes fra avatar i headeren) har fire faner: Profil (Gravatar-billede, visningsnavn, User Rules), [Sikkerhed](./security.md) (skift adgangskode), Stemme ([ElevenLabs TTS/STT](./chat-voice.md)) og Observability (skrivebeskyttet [OpenTelemetry](./opentelemetry.md)-status). User Rules er brugerdefinerede instruktioner, der injiceres i hver AI-anmodning, inklusive workflow-builder og [Chat](../tabs/chat-tab.md), så der kan angives sprog, tone, kodestil eller workflow-konventioner én gang. Adgangskodepolitik og [MCP](../tabs/mcp-tab.md) API-nøglehåndtering er også tilgængelige.

Se også [Sikkerhed](./security.md), [Chat Stemme](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) og [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym kan udsende OpenTelemetry-sporinger for hver workflow-kørsel og node-udførelse: en rod-`heym.workflow.execute`-span per kørsel og en underordnet `heym.node.execute`-span per node, med model- og token-forbrug tilknyttet LLM- og agent-noder. Spans eksporteres via OTLP/HTTP til enhver kompatibel backend (Jaeger, Grafana Tempo, Honeycomb, Datadog), og W3C trace-kontekst propageres på tværs af indgående webhooks, udgående HTTP og underordnede workflows. Sporing er deaktiveret som standard og konfigureres med `HEYM_OTEL_*` [miljøvariabler](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md); aktiv status vises i fanen Observability under [Indstillinger](./user-settings.md).

Se også [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) og [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Eksportér det aktuelle workflow som JSON fra Editor-værktøjslinjen (Download-knappen); filen inkluderer noder og kanter. Importér ved at trække en JSON-fil til fanen [Workflows](../tabs/workflows-tab.md) (opretter et nyt workflow) eller til canvas (erstatter eller flettes). JSON skal indeholde en nodes-array; navn og kanter er valgfrie. Brug det til backup, deling eller migrering mellem instanser.

Se også [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) og [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portalen eksponerer workflows som offentlige chat-brugergrænseflader på `/chat/{slug}`. Konfigurer portal_enabled, slug, valgfri auth (portal-brugere), streaming og filupload per workflow. Slutbrugere interagerer via en chat-grænseflade uden at logge ind i Heym; billedoutput kan vises i chatten. Portal-workflows kan også overdrage til [Human-in-the-Loop](./human-in-the-loop.md)-gennemgangssider, når en [Agent Node](../nodes/agent-node.md) kræver godkendelse, mens agentens `review`-gren sender notifikationer til andre kanaler. Brug det til interne værktøjer, kundevendte chatbots og AI-drevne formularer.

Se også [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) og [Drive](./drive.md).

### [Filgenerering](./file-generation.md)

Skills kan generere filer som PDF, DOCX, CSV, JSON og billeder under udførelse ved at skrive til `_OUTPUT_DIR`-arbejdsområdet. Heym indfanger disse filer automatisk, lagrer dem og eksponerer download-metadata under `_generated_files`, som derefter kan håndteres med [Drive node](../nodes/drive-node.md) eller gennemses i fanen [Drive](../tabs/drive-tab.md).

Se også [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) og [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive er det delte lager- og delingslag for filer genereret af skills. Det giver mulighed for at gennemse filer, oprette offentlige eller adgangskodebeskyttede links, anvende udløb og downloadbegrænsninger, dele filer skrivebeskyttet med teams og administrere disse filer programmatisk med [Drive node](../nodes/drive-node.md) eller manuelt fra fanen [Drive](../tabs/drive-tab.md).

Se også [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md) og [Portal](./portal.md).
### [Sikkerhed](./security.md)

Heym håndhæver en adgangskodepolitik (længde, store/små bogstaver, tal), gemmer adgangstokens i HttpOnly-cookies og roterer refresh-tokens ved brug. Rate limiting gælder for login, registrering og [Portal](./portal.md)-login. [Legitimationsoplysninger](./credentials.md) krypteres på disk med AES-256 (Fernet). [MCP](../tabs/mcp-tab.md) API-nøgle bruges til klientautentifikation; indholdssikkerhed tilbydes via [Guardrails](./guardrails.md) på [LLM](../nodes/llm-node.md)- og [Agent Node](../nodes/agent-node.md)-noder. [Execution Tokens](./execution-tokens.md) giver workflow-scopede JWTs til eksterne kaldere.

Se også [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) og [Legitimationsoplysninger](./credentials.md).

### [Single Sign-On](./sso.md)

Heym autentificerer brugere mod enhver ekstern OpenID Connect-udbyder - Keycloak, Okta, Entra ID, Auth0, Google - konfigureret runtime fra **Indstillinger → SSO** af en administrator angivet i `HEYM_ADMIN_EMAILS`. Kun issuer-URL og klientlegitimationsoplysninger indtastes; alle endpoints hentes fra udbyderens discovery-dokument, så ingen udbyder er hardkodet. Login bruger Authorization Code med PKCE, og ID-token valideres mod udbyderens offentliggjorte nøgler. Konti mappes efter `(issuer, subject)` først og verificeret email andet, med valgfri auto-provisioning begrænset til en email-domæne-allowlist. Password-login forbliver tilgængeligt sammen med SSO og kan deaktiveres, når en forbindelsestest bestås, hvor `HEYM_ADMIN_EMAILS`-konti er undtaget, så en fejlkonfigureret udbyder ikke kan låse instansen.

Se også [Indstillinger](./user-settings.md), [Sikkerhed](./security.md) og [Revisionslog](./audit.md).

### [Belastningsfordeling](./cluster.md)

Ved at pege en anden Heym-instans på samme database tilføjes den som worker. Baggrundskørsler - cron, webhooks, MCP-værktøjskald, chat-triggers - fordeles mellem instanser efter en procentdel, som en administrator indstiller under **Indstillinger → Instanser**, hvor hver instans status, databaseforsinkelse og version vises i én tabel. Instanser kommunikerer ikke direkte: Postgres håndterer arbejdet, så en worker ikke behøver åbne porte eller have rute tilbage til hovedinstansen. Arbejde der involverer lokale filer, et coding-agent-workspace eller installeret plugin kører altid på hovedinstansen, og panelet viser hvor stor en del af de seneste 24 timer dette udgjorde, så en operatør kan se hvornår procentfordeling ikke hjælper. Hver kørsel i historikken navngiver den instans der udførte den, og begge historik-dialoger kan filtrere efter dette.

Se også [Indstillinger](./user-settings.md), [Kørsler](../tabs/traces-tab.md) og [Analyser](../tabs/analytics-tab.md).

### [Tredjepartsintegrationer](./integrations.md)

Heym forbinder til eksterne tjenester via legitimationsoplysninger gemt i [Legitimationsoplysninger](../tabs/credentials-tab.md)-fanen (krypteret på disk). Understøttede typer inkluderer OpenAI, Google, Decision Model til [Decision node](../nodes/decision-node.md), Model Router til automatisk modelvalg (se nedenfor), GitHub til [GitHub node](../nodes/github-node.md) og MCP-integrationer, Jira til [Jira node](../nodes/jira-node.md), Notion til [Notion node](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP til [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header og FlareSolverr til [Crawler](../nodes/crawler-node.md). Hver type dokumenterer påkrævede felter; legitimationsoplysninger kan deles med brugere eller [teams](./teams.md) og refereres ved navn i noder eller som `$credentials.Name` i udtryk.

### Model Router (Auto Model)

En **Model Router**-legitimationsoplysning vælger model pr. anmodning i stedet for at indeholde en nøgle. Den gemmer en decision model-legitimationsoplysning plus en liste over eksisterende OpenAI/Google/Custom-legitimationsoplysninger, hver med kriterier for hvornår den skal bruges, og vises i hver modelvælger med en enkelt model kaldet **Auto**.

Kørsler, canvas Execution Log og Span View viser begge dele af valget, f.eks. `Auto Model / GPT-5`, mens omkostninger tilskrives den model der kørte. Auto Model kan ikke kombineres med Responses API, Batch-tilstand eller billedoutput. Se [Legitimationsoplysninger](./credentials.md) for fuld adfærd.

Se også [Legitimationsoplysninger](./credentials.md), [Deling af legitimationsoplysninger](./credentials-sharing.md) og [Teams](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blokerer usikre eller uønskede brugerbeskeder før de når en [LLM](../nodes/llm-node.md)- eller [Agent Node](../nodes/agent-node.md)-node. Aktiveres pr. node med valg af kategorier at blokere (f.eks. vold, hadefuld tale, seksuelt indhold, selvskade, chikane, ulovlig aktivitet). Indstil følsomhed (lav, medium, høj). Ved udløsning kaster noden en fejl der kan håndteres med en [Error Handler](../nodes/error-handler-node.md). Detektion bruger udbyderens moderation-API eller LLM-klassifikation afhængigt af legitimationsoplysningstype.

Se også [Sikkerhed](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) og [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise dækker kommerciel licensiering, professionel support og implementeringstjenester til teams, der kører Heym i produktionsmiljøer. Det inkluderer hjælp til workflow-arkitektur, onboarding, vejledning til Kubernetes og skalering, prioriteret support samt tilpasset udvikling af avancerede funktioner som [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) og [Portal](./portal.md).

Se også [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) og [Teams](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work er en anden brugerflade til forretningsteams oven på Heym. Brugere beskriver en opgave, besvarer et par spørgsmål og får et testet workflow, hvorefter de arbejder fra sider, godkendelser og en aktivitetsliste, hvor hver kørsel har et navn. Instansadministratorer forbinder det under **Indstillinger → Heym Work** med dets adresse og en integrationsnøgle; det har sin egen licens fra Heym-teamet.

Se også [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) og [Human-in-the-Loop](./human-in-the-loop.md).

---

## Dashboard-faner

### [Workflows](../tabs/workflows-tab.md)

Workflows-fanen er standardvisningen i dashboardet. Den viser en to-delt liste: workflows og mapper som kompakte rækker til venstre samt en forhåndsvisning af det valgte workflow til højre med dets trigger, seneste kørsel og trin, plus muligheder for at åbne workflowet eller køre det med det samme. Hver række indeholder en statusmarkør (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), som kan filtreres via Status-dropdownmenuen. Et workflow uden trigger-node markeres efter, hvordan den seneste kørsel startede - API for et HTTP-kald, SubWorker for et overordnet workflow, Portal for dets offentlige chat - og forbliver Manual, indtil det har kørt. Mapper og undermapper håndterer [organisation](./workflow-organization.md). Nye workflows oprettes med New Workflow, JSON-filer kan trækkes og slippes for at [importere](./download-import.md), og redigering eller sletning foretages via rækkehandlinger. Workflows kan flyttes mellem mapper; sletning er planlagt (papirkurv) før permanent fjernelse.

Se også [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) og [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Se Workflows-demo</a></p>

### [Board](../tabs/board-tab.md)

Et agent-baseret kanban-board, hvor kortene er vedvarende jobs. Konfigurer hver kolonne med en ordnet workflow-kæde; når et kort flyttes ind i kolonnen, køres kæden med kortets fulde kontekst (indhold, kommentarer, historik, tidligere output). Resultater skrives tilbage på kortet - grøn ved succes, rød ved fejl og gul under kørsel. Opfølgende runder genkører kolonnens kæde med alt akkumuleret indhold hidtil, hvilket understøtter iterativ planlægning. Kørsler registreres i [Execution History](./execution-history.md) med `board` som triggerkilde. Mens en kortkørsel er aktiv, åbner **Open live** den præcise kørsel på det animerede canvas med inkrementelle Debug-logs.

Se også [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) og [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Se Board-demo</a></p>
-->

### [Skabeloner](../tabs/templates-tab.md)

Skabelonfanen giver mulighed for at gemme og genbruge workflow-skabeloner (fulde workflows) og node-skabeloner (enkeltstående konfigurerede noder). Workflow-skabeloner oprettes fra editoren (Share as Template), og node-skabeloner oprettes ved at højreklikke på en node. Gennemse efter synlighed (Everyone eller Specific users/[teams](./teams.md)), anvend en skabelon til at oprette et nyt workflow eller tilføje en node til canvas, og administrer delte skabeloner.

Se også [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) og [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Se Skabelon-demo</a></p>

### [Variabler](../tabs/global-variables-tab.md)

Variabelfanen administrerer [Global Variable Store](./global-variables.md). Opret, rediger og slet globale variabler; angiv navn, værdi og værditype (Auto, String, Number, Boolean, Array, Object). Variabler er brugerdefinerede og vedvarer på tværs af kørsler. De kan refereres i ethvert workflow-[udtryk](./expression-dsl.md) som `$global.variableName`. Variabler kan deles med andre brugere eller [teams](./teams.md).

Se også [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) og [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Se Variabel-demo</a></p>
### [Chat](../tabs/chat-tab.md)

Chat-fanen er Heyms løbende agent-grænseflade til at administrere arbejdsområdet via samtale. Vælg [legitimationsoplysninger](./credentials.md) og model, og bed Chat om at besvare spørgsmål, inspicere workflow-definitioner, køre eksisterende workflows, sammenfatte kørsler og tidsplaner, rapportere kørehistorikken for et enkelt workflow (antal kørsler, statusfordeling, seneste kørsel og detaljer for en specifik kørsel ved anmodning), rapportere hvilke kørsler der kører i øjeblikket (med forløbet tid, nuværende node og link til hver live kørsel), løse afventende menneskelige gennemgange, oprette og revidere workflows med den samme AI Builder-motor, der bruges i editoren, eller tilføje kort til kanban-tavler med naturligt sprog. Nye kort placeres altid i den valgte tavles første kolonne; når flere tavler er tilgængelige og ingen er navngivet, præsenterer Chat en tavleudvælgelse før oprettelse af kortet.

Chat fortsætter med at køre på backend, selv efter browseren er lukket. Mens et svar streames, kan der sendes flere beskeder; Heym gemmer dem i en databaseunderstøttet kø, giver mulighed for at redigere eller slette ventende beskeder, før de påbegyndes, og kører dem i rækkefølge, når det aktuelle svar er afsluttet. Hvis assistenten har brug for planlægningsdetaljer og returnerer opklaringsspørgsmål, pauses køen, indtil der gives svar på disse spørgsmål, hvorefter den genoptages efter planlægningssvaret.

Svar streames med markdown, inline-billeder, workflow-eksempelkort, sammenklappelige værktøjskaldskort, kontekstforbrug og automatisk kontekstkomprimering. Chat understøtter vedhæftninger, stemmeinput, oplæsningsafspilning, kopieringshandlinger, hurtige prompts, Brugerregler fra [Indstillinger](./user-settings.md) og [globale variabler](./global-variables.md) som kontekst.

Se også [AI Assistant](./ai-assistant.md), [Legitimationsoplysninger](./credentials.md) og [Indstillinger](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Se Chat-demo</a></p>

### [Legitimationsoplysninger](../tabs/credentials-tab.md)

Legitimationsoplysnings-fanen håndterer API-nøgler og hemmeligheder, der bruges af noder. Tilføj legitimationsoplysninger efter type (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere osv.), navngiv dem, og referer til dem i workflow-noder. Rediger eller slet fra kortet; del med brugere via e-mail eller med [teams](./teams.md). Alle værdier er krypteret ved opbevaring og maskeret i brugergrænsefladen.

Se også [Legitimationsoplysninger](./credentials.md), [Deling af legitimationsoplysninger](./credentials-sharing.md) og [Tredjepartsintegrationer](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Se Legitimationsoplysnings-demo</a></p>

### [Vektorlagre](../tabs/vectorstores-tab.md)

Vektorlagre-fanen håndterer vektorlagre, der bruges af [RAG](../nodes/rag-node.md)-noder. Opret et lager med et navn og en vektorlager-[legitimationsoplysning](./credentials.md) — *RAG: Qdrant + OpenAI* (ekstern Qdrant) eller *RAG: Psql + OpenAI* (Heyms egen Postgres via pgvector), som fastlægger lagrets backend — valgfrit angives et kollektionsnavn, hvorefter der uploades dokumenter (PDF, TXT osv.). Administrer indhold (vis, slet kilder), rediger lagersdetaljer, og del lagre med brugere. I en [RAG](../nodes/rag-node.md)-node vælges databasen, vektorlageret udvælges, og der køres insert-, upsert-, delete- eller søgeoperationer.

Se også [Qdrant RAG](../nodes/rag-node.md), [Legitimationsoplysninger](./credentials.md) og [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Se Vektorlagre-demo</a></p>
### [MCP](../tabs/mcp-tab.md)

MCP-fanen konfigurerer integration af Model Context Protocol. Heym understøtter to tilstande:

**Standardserver** – En enkelt endpoint på `/api/mcp/sse` eksponerer alle MCP-aktiverede workflows. Det er muligt at se og regenerere API-nøglen, kopiere klar-til-brug klient-JSON, forbinde Cursor med et enkelt klik eller følge Claude-opsætningsflowet med automatisk OAuth-registrering.

**Navngivne servere** – Opret flere isolerede MCP-endpoints, hver med sin egen UUID-baserede URL (`/api/mcp/servers/{uuid}/sse`) og uafhængig API-nøgle. Tildel specifikke workflows til hver server, så forskellige AI-klienter eller teams kun ser de værktøjer, de har brug for. Hver navngiven server understøtter de samme godkendelsesmetoder (API-nøgle, Claude OAuth) og har sine egne funktioner til at kopiere JSON og tilføje til Cursor. Begge endpoints understøtter SSE-transport (GET) og Streamable HTTP-transport (POST). Ved at aktivere/deaktivere et workflow i en navngiven server flyttes det til toppen af den tildelte liste, så den ændrede række forbliver synlig.

**Heym chat-værktøj** – Begge tilstande kan også eksponere [Chat](../tabs/chat-tab.md)-motoren som et enkelt `heym_chat`-værktøj, der kan aktiveres/deaktiveres pr. overflade med sine egne LLM-legitimationsoplysninger og model (forududfyldt fra den foretrukne model i [Indstillinger](./user-settings.md)). En MCP-klient sender en naturlig-sproglig `message`, og motoren håndterer resten: opbygning af workflows i build-tilstand (gem, testkør op til fem gange, ret og verificer), kørsel af workflows, analyser, kørsler, live kørselsstatus, tidsplaner, boards og kort, teams, globale variabler, dokumentationssøgning og menneskelige beslutninger. Egenskaber, der tilføjes til Chat senere, er tilgængelige gennem det samme værktøj uden ekstra registrering. Hvert opkald gemmes i Chat-fanens historik som en stikmærket samtale og returnerer et `conversation_id`, som klienten kan sende tilbage for at fortsætte tråden.

Se også [Agentarkitektur](./agent-architecture.md), [Agent-node](../nodes/agent-node.md) og [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Se MCP-demo</a></p>

### [Kørsler](../tabs/traces-tab.md)

Kørselsfanen viser [LLM](../nodes/llm-node.md)-eksekveringsspor. En statistikoverskrift over listen opsummerer det valgte tidsinterval med KPI-kort (Opkald, Tokens, Omkostninger, Gennemsnitlig ventetid, Fejlprocent) og tre diagrammer – Tokens efter model, Omkostninger efter model og Opkald over tid (stablede succes vs. fejl). En enkelt **Tidsinterval**-vælger (1t / 24t / 7d / 30d / Alle; standard 7 dage) filtrerer både diagrammer og liste sammen. Omkostninger beregnes fra den brugerdefinerede [LLM-omkostningstabel](../tabs/datatable-tab.md#llm-cost-table-system-table); modeller uden priser vises som en inline-advarsel, der linker til den. Åbn ethvert spor for at se anmodnings- og svar-payloads, tidsfordeling (llm_ms, tools_ms, mcp_list_ms), værktøjsopkald (navn, argumenter, resultat) og inkluderede færdigheder. Udvidede hændelser viser JSON – inklusive MCP- og JSON-RPC-payloads – som et sammenklappeligt træ med første niveau åbent som standard; **Træ / Rå** skifter tilbage til den originale tekst, og ugyldig JSON forbliver læsbar. Brug spor til at fejlfinde [Agent-node](../nodes/agent-node.md) og [LLM](../nodes/llm-node.md)-adfærd og til at kopiere eller eksportere payloads.

Se også [Kørselshistorik](./execution-history.md), [Agent-node](../nodes/agent-node.md) og [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Se Kørselsdemo</a></p>
### [Advarsler](../tabs/alerts-tab.md)

Advarselsfanen definerer tærskelbetingelser over et tidsvindue og giver besked, når de overskrides. Fire advarselstyper dækker de spørgsmål, operatører faktisk stiller: **fejltærskel** (fejlede dette mere end N gange i vinduet), **workflow-varighed** (blev kørsler langsommere, målt som maksimum, gennemsnit eller p95), **token/USD-omkostning** (overskred udgifterne et budget, beregnet via samme pristabel som [Sporinger](../tabs/traces-tab.md)) og **kørselsantal** (kørte dette langt hyppigere end forventet). Hver type vurderes over et valgfrit tidsvindue, aldrig på en enkelt hændelse, da en fejlet kørsel er støj, mens en serie udgør en hændelse. Advarsler overvåger enten et enkelt workflow eller alle tilgængelige workflows.

En fem-trins guide gennemgår type, omfang, betingelse, respons og gennemgang. Gennemgangstrinnet **backtester** betingelsen først og rapporterer, hvor ofte den ville have udløst over de seneste 24 timer til 7 dage, så en alt for lav tærskel opdages, før den gemmes, i stedet for efter den har sendt en alarm. Beskriv ønsket i almindeligt sprog, og AI udfylder alle trin, den kan, med markering af dens gæt; en delvis anmodning fremskynder stadig guiden og åbner det første trin, der kræver en beslutning, i stedet for at genstarte. Som standard udløser en advarsel én gang og forbliver inaktiv, indtil målet normaliseres; det er også muligt at konfigurere gentagelse med interval.

På respons-trinnet kan en advarsel oprette og tildele et nyt workflow til kørsel ved udløs, anvende et eksisterende eller intet gøre. Payload'en ved udløb indeholder den observerede værdi, tærskel, vindue og de workflows, der bidrog til tallet, hvilket gør det muligt at sende advarsler til Slack, e-mail eller Telegram via eksisterende noder. Historikken over udløbte advarsler gemmer tilstanden ved hvert udløb og bevares i 90 dage; anerkendelse af en advarsel ændrer badge-status fra Udløst til Anerkendt uden at simulere normalisering. [Chat](../tabs/chat-tab.md)-fanen kan besvare spørgsmål om eksisterende advarsler og deres udløsningsårsager eller -tidspunkter. Advarsler kan deles med brugere og [teams](../tabs/teams-tab.md).

Se også [Analytics](../tabs/analytics-tab.md), [Sporinger](../tabs/traces-tab.md) og [Kørselshistorik](./execution-history.md).

### [Analytics](../tabs/analytics-tab.md)

Analytics-fanen viser kørselsstatistik og tendenser. Resuméstatistikker omfatter totale kørsler, succesrate, fejlrate, latenstopdeling og samlet **Tid sparet** (summen af hvert workflows estimerede minutbesparelse pr. kørsel × dets succesfulde kørsler). Mest brugte viser samme sum pr. workflow. Vælg et basisinterval (24t, 7d, 30d eller alt), filtrer eventuelt efter workflow, og træk derefter over enhver graf for at zoome ind på et valgt datointerval. Grafer og workflowtabeller opdateres til valget, og auto-opdatering holder statistikkerne ajour. Det supplerer [Kørselshistorik](./execution-history.md) og [Tidsplaner](../tabs/scheduled-tab.md), når både tidligere resultater og kommende kørsler er relevante.

Se også [Kørselshistorik](./execution-history.md), [Tidsplaner](../tabs/scheduled-tab.md) og [Evalueringer](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Se Analytics-demo</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Dashboard-fanen er et Grafana-lignende område, hvor der oprettes gitter af diagramwidgets, hver genereret af sit eget skjulte Heym-workflow. Det er muligt at oprette flere dashboards og dele hvert enkelt med brugere eller teams, skrivebeskyttet eller redigerbart; widgets kører altid med ejerens legitimationsoplysninger, så alle ser de samme data. Beskriv en metrik i almindeligt sprog, og AI genererer widgetten, eller tilføj manuelt og vælg en diagramtype med eksempeldata: søjle, linje, område, lagkage, tabel, numerisk, måler, punkt, proportion, søjlemåler, tekst eller HITL. HITL er en karusel af afventende menneskelige gennemgange. Headeren viser `1/n afventende`. Workflow-navnet åbner kørslen på canvas. **Godkend**, **Anmod om ændringer** og **Afvis** afslutter den, og historikikonet ved siden af widget-titlen åbner kørslen i historikdialogen på samme side. Widgets cacher deres resultater, kan finjusteres med AI (hver ændring gemmes i [Redigeringshistorik](./edit-history.md)), klones sammen med deres komplette workflow, omarrangeres med Tidy up og trækkes eller ændres i størrelse i redigeringstilstand. Tabeller kan vise statuschips og linke deres rækker til et detaljedashboard, der læser den klikkede rækkes post som `$page.record`, og en Run-widget kører et workflow fra dashboardet: på en sluppet fil, med sine inputfelter eller med en Kør-knap. Da hver widget er et workflow, kan enhver datahentning — et [HTTP](../nodes/http-node.md)-kald, en [BigQuery](../nodes/bigquery-node.md)-forespørgsel, et [RAG](../nodes/rag-node.md)-opslag eller [LLM](../nodes/llm-node.md)-output — blive til et diagram. Indstillingerne for en HITL-widget kan begrænse den til et enkelt workflows gennemgange eller til et agent- eller Slack-godkendelsestrin i det; en sådan widget viser dem til alle, der kan åbne dette workflow, og er skjult for alle, der ikke kan. [Chat](../tabs/chat-tab.md) og MCP-værktøjet `heym_chat` lister dine dashboards med deres widgets, fortæller hvilket dashboard en arbejdsgang er på, tilføjer en ny widget (først en tom widget, hvis arbejdsgang Chat derefter opbygger og tester), placerer en eksisterende arbejdsgang som en widget på et dashboard, omdøber eller sletter widgets og rydder op i layoutet, ligesom knappen Ryd op gør.

Se også [Diagramoutput-node](../nodes/chart-output-node.md), [Analytics](../tabs/analytics-tab.md) og [Kørselshistorik](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Se Dashboard-demo</a></p>
### [Evalueringer](../tabs/evals-tab.md)

Fanebladet Evalueringer (på `/evals`) giver mulighed for at oprette evalueringssuiter, tilføje eller generere testcases, optimere suite-prompten og køre evalueringer mod [Agent Node](../nodes/agent-node.md)-workflows. Det er muligt at vælge en eller flere modeller, vælge en scoringsmetode (Exact Match, Contains eller LLM-as-Judge), eventuelt lade en separat model eller en [Decision Model](../nodes/decision-node.md) bedømme LLM-as-Judge-svar, angive kørsler pr. test (plus temperatur og reasoning effort for Exact Match og Contains), og derefter sammenligne pass/fail samt output pr. model. Der kan gennemgås kørselshistorik for tidligere evalueringer, inklusive den anvendte bedømmermodel, genkøre en evaluering med samme bedømmer, eksportere den som JSON, og krydstjekke den underliggende adfærd i [Kørsler](../tabs/traces-tab.md).

En **agentsuite** kontrollerer i stedet en enkelt agentnode: den viser agentens baseline-latens, USD-omkostninger, tokens og værktøjskald fra dens virkelige kørsler, lader dig markere hvert værktøj, MCP-værktøj, underagent, underarbejdsgang eller færdighed som noget agenten skal eller ikke må kalde, sætter øvre grænser 20 % over baseline, kører arbejdsgangen et valgt antal gange med input fra sidste kørsel eller AI-skrevne input, og bedømmer hver kørsel med årsagen til fejlen. Suitevælgeren lister begge slags med deres type og er søgbar, og rapporten [Workflow Analysis](./workflow-analysis.md) foreslår en suite til arbejdsgange med agent- eller LLM-noder.

Se også [Agent Node](../nodes/agent-node.md), [Kørsler](../tabs/traces-tab.md), og [Kørselshistorik](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Se Evalueringer-demo</a></p>

### [Teams](../tabs/teams-tab.md)

Fanebladet Teams giver mulighed for at oprette og administrere teams. Der kan oprettes et team, tilføjes medlemmer via email og fjernes medlemmer (opretteren kan ikke fjernes). Det er muligt at dele [workflows](../tabs/workflows-tab.md), [skabeloner](../tabs/templates-tab.md), [legitimationsoplysninger](../tabs/credentials-tab.md), [variabler](../tabs/global-variables-tab.md), [vektorlagre](../tabs/vectorstores-tab.md) og [Drive-filer](../tabs/drive-tab.md) med teams fra deres respektive delingsdialoger; alle teammedlemmer får adgang. Teamnavn og beskrivelse kan redigeres, eller teamet kan slettes (hvilket fjerner alle teamdeling).

Se også [Teams](./teams.md), [Deling af legitimationsoplysninger](./credentials-sharing.md), og [Workflow-organisation](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Se Teams-demo</a></p>

### [Tidsplaner](../tabs/scheduled-tab.md)

Fanebladet Tidsplaner viser alle aktive [Cron](../nodes/cron-node.md)-workflows på en visuel kalender. Der kan skiftes mellem dag-, uge- og månedsvisning for at se, hvornår automatiseringer er planlagt til at køre, og derefter hoppe tilbage til det relaterede [workflow](../tabs/workflows-tab.md), når der er behov for at redigere tidsplanen.

Se også [Cron](../nodes/cron-node.md), [Analyser](../tabs/analytics-tab.md), og [Kørselshistorik](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Se Tidsplaner-demo</a></p>

### [Logfiler](../tabs/logs-tab.md)

Fanebladet Logfiler viser Docker-containerlogfiler for Heym-stakken (backend, frontend, PostgreSQL). Der kan vælges container(e), filtreres efter logniveau (All, INFO, WARNING, ERROR, DEBUG) og søges i logfiler. Det bruges til debugging og fejlfinding. For workflowkørselslogfiler (node-resultater, outputs) skal der i stedet bruges [Kørselshistorik](./execution-history.md), [Kørsler](../tabs/traces-tab.md) eller Debug-panelet i editoren.

Se også [Kørselshistorik](./execution-history.md), [Kørsler](../tabs/traces-tab.md), og [Canvas-funktioner](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Se Logfiler-demo</a></p>

### [Datatabeller](../tabs/datatable-tab.md)

Fanebladet Datatabeller giver mulighed for at oprette og administrere struktureret datatabeller i Heym. Der kan defineres typede kolonner (string, number, boolean, date, JSON), administreres rækker med inline dobbeltklik-redigering, importeres/eksporteres CSV, og deles tabeller med brugere eller [teams](./teams.md) med læse-/skriveadgang. Det er muligt at bruge [DataTable node](../nodes/datatable-node.md) til programmatisk adgang til tabeller i workflows. En fastgjort **System tables**-sektion øverst indeholder **LLM Cost Table**: en fastskema-visning af priser pr. model, der hentes i baggrunden fra Helicone (24-timers TTL, manuel Refresh), hvor hver bruger kan tilsidesætte priser eller tilføje brugerdefinerede rækker for modeller, Helicone ikke viser. Disse priceregler driver KPI'en for omkostninger og den pr. model omkostningsdiagram på [Kørsler](../tabs/traces-tab.md)-fanebladet.

Se også [DataTable node](../nodes/datatable-node.md), [Kørsler](../tabs/traces-tab.md), [Workflow-struktur](./workflow-structure.md), og [Teams](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Se Datatabeller-demo</a></p>
### [Drive](../tabs/drive-tab.md)

Fanebladet Drive viser alle filer, der er genereret af skills i workflows. Der vises en liste over hver fil med navn, type, størrelse, kilde-node, oprettelsesdato og teamdelingstatus samt funktioner til søgning, autentificeret download, deling, sletning og paginering. Det fungerer som dashboard-komplement til [File Generation](./file-generation.md), [Drive](./drive.md)-referencen og [Drive-node](../nodes/drive-node.md).

Se også [Drive](./drive.md), [File Generation](./file-generation.md) og [Drive-node](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Se Drive-demo</a></p>

### [Canvas-samarbejde](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
