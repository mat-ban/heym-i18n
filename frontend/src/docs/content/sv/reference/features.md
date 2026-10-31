# Heyms kompletta funktionsuppsättning

En omfattande översikt över alla Heyms funktioner. Varje avsnitt beskriver en funktion eller ett koncept i några meningar.

---

## Komma igång

### [Introduktion](../getting-started/introduction.md)

Heym är infrastruktur för att köra och styra AI-agenter i produktion. Agentiska system byggs på en visuell canvas och körs med tillförsikt: orkestrering av agenter, automatisering av affärsprocesser, inspektion av varje körning och mänsklig kontroll på den egna infrastrukturen. Plattformen stöder visuella Workflows, AI-drivna noder ([LLM](../nodes/llm-node.md), [Agent-nod](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), en [AI-assistent](./ai-assistant.md), integrationer ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), inkommande [IMAP-Trigger](../nodes/imap-trigger-node.md) för e-post, utgående [Send Email](../nodes/send-email-node.md)), schemaläggning med [Cron](../nodes/cron-node.md) samt [Portal](./portal.md)-chattportaler för slutanvändare.

Se även [Kärnkoncept](../getting-started/core-concepts.md), [Nodtyper](./node-types.md) och [Tredjepartsintegrationer](./integrations.md).

### [Varför Heym](../getting-started/why-heym.md)

Varför Heym går igenom agentens livscykel (bygga, orkestrera, köra, observera, utvärdera, styra, exponera) och visar vad en självhostad runtime hanterar i varje steg. Det omfattar [LLM](../nodes/llm-node.md)-noden och [Agent-noden](../nodes/agent-node.md) med tool calling, Python-verktyg, [MCP](../tabs/mcp-tab.md)-anslutningar, skills och multi-agent-orkestrering; Triggers, återförsök och [lastfördelning](./cluster.md); [Körningar](../tabs/traces-tab.md) med USD-kostnad per körning och OpenTelemetry-export; [Utvärdering](../tabs/evals-tab.md); [checkpoints för mänsklig granskning](./human-in-the-loop.md), guardrails, SSO och en granskningslogg; samt REST-, MCP- och Portal-endpoints. En funktionsjämförelse med n8n, Zapier och Make.com avslutar sidan.

Se även [Agent-nod](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) och [Agentarkitektur](./agent-architecture.md).

### [Snabbstart](../getting-started/quick-start.md)

Få den första Workflowen igång på några minuter: skapa en Workflow från fliken [Workflows](../tabs/workflows-tab.md), lägg till en [Inmatningsnod](../nodes/input-node.md), en [LLM](../nodes/llm-node.md)-nod och en [Utmatningsnod](../nodes/output-node.md) och anslut dem. Konfigurera [LLM](../nodes/llm-node.md)-noden med en autentiseringsuppgift och ange `userMessage` till `$input.text`; använd Kör eller [AI-assistenten](./ai-assistant.md) för att köra eller generera Workflows med naturligt språk.

Kombineras naturligt med [Inmatningsnod](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Utmatningsnod](../nodes/output-node.md) och [Expression DSL](./expression-dsl.md).

### [Kärnkoncept](../getting-started/core-concepts.md)

Workflows är riktade grafer av noder sammankopplade med kanter; körning flödar från Trigger-noder ([Inmatningsnod](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram-Trigger](../nodes/telegram-trigger-node.md), [Discord-Trigger](../nodes/discord-trigger-node.md), [IMAP-Trigger](../nodes/imap-trigger-node.md), [Heym-Trigger](../nodes/heym-trigger-node.md), [WebSocket-Trigger](../nodes/websocket-trigger-node.md)) genom bearbetningsnoder till [Utmatningsnoder](../nodes/output-node.md). Varje nod har en typ, data (konfiguration) samt indata/utdata; kanter definierar dataflödet. Noder refererar till uppströmsdata via [Expression DSL](./expression-dsl.md)-uttryck som `$nodeLabel.field`; oberoende noder körs automatiskt [parallellt](./parallel-execution.md).

Se även [Triggers](./triggers.md), [Parallell körning](./parallel-execution.md) och [Workflow-struktur](./workflow-structure.md).

### [Körning och distribution](../getting-started/running-and-deployment.md)

Heym tillhandahåller `run.sh` för lokal utveckling (databas i Docker, FastAPI-backend, Vite-frontend) och `deploy.sh` för produktion med Docker Compose. Båda använder en `.env`-fil; centrala variabler inkluderar `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` och `ALLOW_REGISTER`. Utveckling körs på konfigurerbara frontend- och backend-portar; produktion serverar API:et under `/api` via frontend-containern.

Se även [Säkerhet](./security.md), [Enterprise](./enterprise.md) och [Inställningar](./user-settings.md).

### [Migrera till Heym](../getting-started/migrate-to-heym.md)

Verktyget AI Convert omvandlar en Workflow från en annan plattform (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) eller en beskrivning på naturligt språk till en Heym-Workflow, strömmad live till en canvas och redo att [ladda ner och importera](./download-import.md). Det kör en AI-säkerhetskontroll och genererar sedan DSL med indata och hastighetsbegränsningar på plats. Öppna det på [heym.run/convert](https://heym.run/convert).

Se även [Snabbstart](../getting-started/quick-start.md), [Ladda ner och importera](./download-import.md) och [AI-assistent](./ai-assistant.md).

---

## Noder

### Triggers
#### [Input](../nodes/input-node.md)

Noden Input är ingångspunkten för workflows som tar emot data från användaren eller API-anroparen. Den stöder ett eller flera inmatningsfält och exponerar förfrågningsmetadata (headers, query-parametrar). Fält i body nås via `$nodeLabel.body.fieldKey`, headers via `$nodeLabel.headers` och query via `$nodeLabel.query`.

Fungerar naturligt tillsammans med [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) och [Output](../nodes/output-node.md). För payload-referenser och fältåtkomst, se [Expression DSL](./expression-dsl.md) och [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Noden Cron startar en workflow enligt ett schema med ett standardiserat cron-uttryck med fem fält. Ingen användarinmatning krävs – workflowen körs automatiskt vid angivna tidpunkter (t.ex. varje timme, dagligen, var 15:e minut). Utdata är en trigger-händelse utan payload.

Se även [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) och [Execution History](./execution-history.md) för schemalagda och fördröjda körningar.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Noden IMAP Trigger pollar en inkorg med ett konfigurerbart minutintervall och startar en workflow för varje nytt e-postmeddelande som upptäcks. Den producerar parsade headers, avsändar- och mottagarlistor, plain-text- och HTML-body, metadata för bilagor samt en trigger-tidsstämpel. Används för triage av supportinkorgar, vidarebefordran från mailbox till [Slack](../nodes/slack-node.md) eller e-postdrivna godkännandeflöden med [Human-in-the-Loop](./human-in-the-loop.md).

Fungerar tillsammans med [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) och [Slack](../nodes/slack-node.md) för inkommande triage och svarsflöden.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Noden Heym Trigger startar en workflow när Heym självt publicerar en plattformshändelse: `heym.started`, `workflow.created`, `workflow.updated` eller `workflow.deleted`. Leveransen sker i batchar – varje händelse som publiceras inom ett femsekundersfönster anländer i en enda körning som `$nodeLabel.events`, alltid en array. Varje händelse görs anspråk på via en unik databasbegränsning, vilket innebär att den utlöses exakt en gång per prenumererande nod oavsett hur många workers, containers eller maskiner som körs. Används för granskningsloggar över workflow-ändringar, distributionsmeddelanden och sammanställningar av instanshälsa.

Fungerar tillsammans med noden [Heym](../nodes/heym-node.md) för att slå upp den ändrade workflowen, och med [Loop](../nodes/loop-node.md) för att agera en gång per händelse.

#### [Heym](../nodes/heym-node.md)

Noden Heym läser Heyms egna data genom tre operationer: `listWorkflows` returnerar varje workflow som ägaren kan nå med nodantal och tidsstämplar, `getWorkflow` returnerar en workflows nod- och kantstruktur, och `getExecutionHistory` returnerar poster från körningshistoriken med de nyaste först, med valfria filter för status, tidsfönster och limit, tillsammans med totaler grupperade efter status. Resultaten är begränsade till ägaren av den workflow som noden finns i, så en körning som startats av cron, en portal eller en händelse returnerar samma data som en manuell körning. `getWorkflow` returnerar den fullständiga nodkonfigurationen, vilket gör det möjligt att granska en workflow för hårdkodade nycklar eller tokens; den exponerar inget som workflowens ägare inte redan kunde öppna i editorn. Ingen autentiseringsuppgift krävs.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

Noden WebSocket Trigger öppnar en utgående klientanslutning till en extern WebSocket-server och startar workflowen vid `onMessage`, `onConnected` eller `onClosed`. Den exponerar parsade meddelandepayloads, återanslutningsstatus, stängningsmetadata och socket-URL:en för nedströms uttryck.

Fungerar tillsammans med [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) och [SSE Streaming](./sse-streaming.md) för realtidsintegrationer.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Noden Telegram Trigger tar emot bot-webhook-uppdateringar och startar workflowen omedelbart. Den exponerar hela uppdaterings-payloaden, det primära meddelandeobjektet, callback-queries, sanerade headers och en trigger-tidsstämpel. Används för chatbotar, AI-assistenter i [Telegram](../nodes/telegram-node.md) och knappdrivna flöden.

Fungerar tillsammans med [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) och [Webhooks](./webhooks.md) för botdrivna workflows.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Noden Slack Trigger tar emot webhooks från Slack Events API och startar en workflow automatiskt efter att ha verifierat förfrågans signatur. Den exponerar händelse-payloaden och sanerade headers för nedströms routning, [LLM](../nodes/llm-node.md)-baserad klassificering och svarsflöden.

Fungerar tillsammans med [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) och [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Noden Discord Trigger tar emot webhooks från Discord Interactions API, verifierar Ed25519-signaturer med den valda autentiseringsuppgiften `discord_trigger` och startar workflowen. Den exponerar hela interaktions-payloaden, kommandodata, sanerade headers och trigger-metadata för nedströms routning eller svar.

Fungerar tillsammans med [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) och [Third-Party Integrations](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ-noden skickar eller tar emot meddelanden från RabbitMQ-köer och exchanges. Den används för meddelandedrivna workflows och händelsebearbetning. I sändningsläge publiceras ett meddelande med valfri fördröjning; i mottagningsläge fungerar noden som en [trigger](./triggers.md) så att workflowet startar när ett meddelande anländer. Utdata innehåller status, message_id och body.

Kombineras med [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) och [Parallel Execution](./parallel-execution.md) för händelsedriven bearbetning.

#### [Error Handler](../nodes/error-handler-node.md)

Error Handler-noden körs automatiskt när någon nod i workflowet misslyckas. Inga inkommande kanter krävs; den utlöses av motorn. Utdata innehåller felmeddelande, etiketten för den misslyckade noden, nodtyp och tidsstämpel. Den används för att skicka aviseringar via [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) eller [Send Email](../nodes/send-email-node.md), logga fel eller returnera anpassade felsvar.

Som ett alternativ till att hantera fel på canvasen kan ett workflow även delegera misslyckanden till ett separat workflow — se [Error Workflow](#error-workflow). Om canvasen redan innehåller en Error Handler-nod anropas **inte** error workflowet (den lokala hanteraren har företräde).

Vanliga aviseringsmål är [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) och [Send Email](../nodes/send-email-node.md); körningsdetaljer är enklare att granska i [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

AI Agent-noden är en [LLM](../nodes/llm-node.md)-nod med tool calling. Den kan köra Python-verktyg, anropa anslutna canvas-noder som verktyg, ansluta till [MCP](../tabs/mcp-tab.md)-servrar, använda skills (instruktionsfiler och valfria Python-skript), agera som en orkestrerare som delegerar till andra agent-noder samt anropa andra workflows som verktyg. Utdata är tillgänglig som `$nodeLabel.text`. En valfri **Extra Body**-växel bifogar ett JSON-objekt med leverantörsspecifika begärandeparametrar till varje begäran i tool-calling-loopen; den är avstängd som standard. En valfri **Use Responses API**-växel dirigerar agentens modellanrop genom Responses API, vilket bevarar modellens resonemang över verktygsanrop så att en resonemangsmodell behåller sin tankekedja genom en flerstegsloop; den är avstängd som standard och fungerar med OpenAI och anpassade autentiseringsuppgifter.

Canvas-nodverktyg låter en agent anropa konfigurerade workflow-noder direkt från canvasen. Anslut en nod som stöds till agentens verktygshandtag och markera sedan specifika fält som agent-tillhandahållna med bot-ikonen. Dessa fält blir verktygsparametrar vid körning, medan autentiseringsuppgifter och omarkerade fält förblir fasta i nodkonfigurationen.

Avsnittet Skills innehåller nu **AI Build** för att skapa nya skills, en inline AI-redigeringsåtgärd för befintliga skills, nedladdning av enskilda skills som ZIP samt en valfri **Enable Drive files**-växel för skills som behöver läsa Heym Drive-filer vid körning. Skill Builder-modalen strömmar en chattkonversation till vänster, accepterar drag-and-drop-filer med varje finjusteringskommentar, visar en live skrivskyddad förhandsvisning av genererade `SKILL.md`- och `.py`-filer till höger, kan ladda ner förhandsvisningen som en ZIP och sparar uppladdade finjusteringsfiler tillbaka som paketerade skill-tillgångar genom samma ZIP-intagsflöde som används vid manuella uppladdningar.

Med **[Agent Persistent Memory](./agent-persistent-memory.md)** aktiverat håller varje agent-nod sin egen kunskapsgraf: fakta laddas in i systemprompten när den inte är tom, och lyckade körningar utlöser en bakgrundssammanslagning av nya entiteter och relationer. Sub-agenter använder separata grafer. En agents graf kan **delas** med andra agenter (i samma eller andra workflows) med läs- eller läs-/skrivåtkomst från graf dialogen. Canvasens hjärnkontroll öppnar grafredigeraren.

Agent-noder kan även gå in i [Human-in-the-Loop](./human-in-the-loop.md)-läge. I detta läge får agenten ett `request_human_review`-verktyg och kan pausa vid specifika steg som kräver godkännande, skapa en engångslänk för offentlig granskning, exponera en `review`-canvasgren för aviseringsflöden och vänta tills en granskare accepterar, redigerar eller avvisar Markdown-granskningstexten. Nodens HITL-fält fungerar som godkännanderiktlinjer för när frågan ska ställas, medan sammanfattningen som visas för granskaren genereras från varje granskningsbegäran. För [MCP](../tabs/mcp-tab.md)-verktyg använder Heym modellen för att tolka de skriftliga instruktionerna till `always`, `once` eller `never`, så att fritt formulerat godkännandespråk mappas till en konkret körningspolicy. Körningen markeras som `pending` och återupptas från den lagrade körningsögonblicksbilden efter att beslutet anländer, och samma agentkörning kan pausa mer än en gång om senare steg också kräver granskning.

Agent-noder komprimerar automatiskt sin ackumulerade meddelandehistorik när den närmar sig 80 % av modellens kontextfönster. Systemprompten, det första användarmeddelandet och det senaste användarmeddelandet bevaras alltid; allt däremellan sammanfattas med samma modell och autentiseringsuppgifter. Komprimeringshändelser visas i Debug-panelen, [Execution History](./execution-history.md) och fliken [Traces](../tabs/traces-tab.md).

Se även [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) och [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Noden Codex kör OpenAI Codex CLI i en isolerad Heym-arbetsyta. Den tar emot en Codex-uppgift (logga in med ChatGPT för att använda prenumerationen utan kostnader per token, eller klistra in en åtkomsttoken), en GitHub-uppgift, repository-URL, basgren, uppgiftsprompt, publiceringsläge (`diff_only` eller `draft_pr`), grennamn och timeout. Körningsmotorn klonar repositoryt lokalt, skickar ChatGPT-tokenpaketet eller `CODEX_ACCESS_TOKEN` endast till Codex-processen och returnerar en strukturerad sammanfattning, valideringsanteckningar, ändrade filer, diff, användningsmetadata och en valfri URL till draft-PR.

När Codex returnerar `needs_input` pausas workflowet och grenen `question` exponeras. Anslut den grenen till Slack, e-post eller en annan aviseringsnod; den publika uppföljningslänken återupptar den sparade körningsögonblicksbilden efter att svaret har skickats in. Noden Codex kan även kopplas till en AI-agent som ett verktyg, vilket låter agenten delegera kodningsuppgifter; som verktyg returneras ett `needs_input`-resultat direkt till agenten i stället för att pausa workflowet.

Se även [GitHub](../nodes/github-node.md), [Autentiseringsuppgifter](./credentials.md), [Delning av autentiseringsuppgifter](./credentials-sharing.md) och [Nodtyper](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Noden OpenCode Go kör OpenCode CLI (Go) mot ett GitHub-repository. Isoleringen följer Codex-mönstret: lokalt körs den som en värdprocess, medan Docker-distributioner kör den i en härdad syskoncontainer som delar arbetsytevolymen. Den tar emot en OpenCode Go-uppgift (en gateway-API-nyckel med valfri bas-URL), en GitHub-uppgift, repository-URL, basgren, uppgiftsprompt, publiceringsläge, grennamn, timeout och en `opencode-go/<model>`-modell vald från en live, sökbar modellista (med en inbyggd reserv). Heym utför alla git/GitHub-operationer på värden och placerar aldrig GitHub-token i sandlådan; OpenCode redigerar endast filer på disk. Noden returnerar en strukturerad sammanfattning, valideringsanteckningar, ändrade filer, diff och en valfri URL till pull request. Den kan kopplas till en AI-agent som ett verktyg.

Se även [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Autentiseringsuppgifter](./credentials.md), [Delning av autentiseringsuppgifter](./credentials-sharing.md) och [Nodtyper](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Noden LLM bearbetar text med en språkmodell eller genererar bilder. Den stöder textgenerering, vision (bildinmatning), bildgenerering, strukturerad JSON-utdata, leverantörsinbyggd Batch API-körning för OpenAI och OpenAI-kompatibla endpoints som stöds, samt en valfri växlingsknapp **Use Responses API** som dirigerar anropet via Responses API i stället för Chat Completions (avstängd som standard; fungerar med OpenAI och anpassade autentiseringsuppgifter och kan inte kombineras med Batch-läge). Konfigurera autentiseringsuppgifter, modell, system- och användarmeddelanden, temperatur och max tokens; använd [Expression DSL](./expression-dsl.md) i prompts. I batch-läge måste `userMessage` lösas upp till en array, noden skickar en `batchStatus`-gren med förloppsuppdateringar och den slutliga utdatan innehåller batchresultat per objekt. En valfri växlingsknapp **Extra Body** bifogar ett JSON-objekt med leverantörsspecifika begärandeparametrar (till exempel `{"thinking": {"type": "disabled"}}`) till varje API-anrop; den är avstängd som standard. Valfria [Guardrails](./guardrails.md) blockerar osäkert innehåll före anropet.

Kombineras naturligt med [Qdrant RAG](../nodes/rag-node.md), [Agent-nod](../nodes/agent-node.md), [Guardrails](./guardrails.md) och [Dialog för uttrycksutvärdering](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Noden Decision ställer skrivna frågor till en beslutsmodell om körningens tillstånd och returnerar sannolikheter i stället för prosa. Ett fält **State** bär vad modellen ska läsa — ett enskilt uttryck behåller sin egen typ, så `$input` skickar objektet i stället för dess text — och en lista med frågor bär bedömningarna. Frågor förekommer i tre former: **noul** svarar på huruvida ett villkor gäller, **choice** väljer ett alternativ från en uppsättning som definieras och returnerar hela fördelningen, och **score** bedömer tillståndet längs ordnade nivåer och kan hamna mellan dem. Svar av typen choice och score bär även en konfidens, så en [Switch](../nodes/switch-node.md) kan dirigera på svaret medan en [Condition](../nodes/condition-node.md) grindar på hur säkert det var. **Generate with AI** utformar tillståndsmallen och frågeraderna från en vanlig mening, och **Custom request body** skickar handskriven JSON för en endpoint vars kontrakt skiljer sig. Leverantörens svar skickas igenom oförändrat och varje anrop registreras i [Traces](../tabs/traces-tab.md).

Kräver en autentiseringsuppgift för beslutsmodell; kombineras naturligt med [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) och [Agent-nod](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

Noden RAG / Vector Store infogar, uppdaterar (upsert), tar bort och söker efter dokument i ett vektorlager för retrieval-augmented generation. En rullgardinsmeny för databas väljer backend — **Qdrant** (extern server) eller **Postgres (pgvector)** (Heyms egen databas, ingen extern tjänst), med Qdrant som standard. Välj ett vektorlager från fliken [Vectorstores](../tabs/vectorstores-tab.md) och ange operationen till insert, upsert, delete eller search. Upsert och delete adresserar ett dokument via ett unikt id som lagras i payloaden — ett **Document ID Field** namnger det fältet (standard `doc_id`) och **Document ID** innehåller dess värde — så ett dokument behåller det id som det egna systemet redan använder: upsert ersätter varje matchande punkt innan den nya versionen lagras, och delete rapporterar huruvida något matchade. Dokumentmetadata accepterar uttryck i sina värden, så `{"url": "$start.url"}` lagrar det som körningen producerade. Search stöder metadatafilter, valfri **Hybrid Search** (vektorlikhet kombinerad med BM25-nyckelordsmatchning, så att exakta termer som ID:n och felkoder hittas bredvid semantiska matchningar) och valfri Cohere-reranking, och returnerar en array med resultat med text, score, metadata, reranked- och hybrid-flaggor samt count för användning i flöden med [LLM](../nodes/llm-node.md) eller [Agent Node](../nodes/agent-node.md).

Vanliga nedströmsnoder är [LLM](../nodes/llm-node.md) och [Agent Node](../nodes/agent-node.md); konfiguration av vektorlager beskrivs i [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

Noden MCP Call anropar ett specifikt [MCP](../tabs/mcp-tab.md)-verktyg direkt, utan att en LLM avgör vilket verktyg som ska anropas. Den används när det vid designtillfället är känt exakt vilket verktyg som ska köras — för deterministisk MCP-verktygskörning i ett enda steg i ett workflow. Konfigurera en anslutning (SSE, Streamable HTTP eller stdio; samma fält som MCP-anslutningen i [Agent Node](../nodes/agent-node.md)), klicka på **Fetch Tools** för att fylla en rullgardinsmeny, välj ett verktyg och fyll i argumentfält som automatiskt renderas från verktygets input-schema. Varje argument accepterar ett statiskt värde eller ett [DSL-uttryck](./expression-dsl.md) som `$userInput.body.text`. Resultatet är tillgängligt som `$nodeLabel.result` (JSON-objekt om det kan parsas, annars sträng). Noden MCP Call kan inte anslutas till en [Agent Node](../nodes/agent-node.md) som ett canvas-verktyg.

Se även [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) och [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

Noden Condition förgrenar workflowet baserat på ett if/else-uttryck. Den har två utdatahandtag: ett för när villkoret är sant och ett för falskt. Använd jämförelse- och logiska operatorer från [Expression DSL](./expression-dsl.md) i villkorsuttrycket; noden skickar vidare indata till den valda grenen.

Se även [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) och [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Noden Switch dirigerar körningen till olika vägar genom att matcha ett värde mot case. Konfigurera ett uttryck som ska utvärderas och en lista med case-värden; varje case får ett källhandtag och ett standardhandtag används för icke-matchande värden. Indata skickas vidare till den matchade grenen.

Använd [Condition](../nodes/condition-node.md) för binär förgrening och [Merge](../nodes/merge-node.md) för att återförena dirigerade vägar; matchningsregler beskrivs i [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Noden Merge väntar på flera parallella indata och kombinerar dem till en enda utdata. Ange antalet indata som ska inväntas; noden producerar ett sammanslaget objekt när alla grenar har slutförts. Den används för att sammanfoga resultat från parallella grenar innan körningen fortsätter; den ska inte användas när parallella grenar slutar i separata Output-noder.

Se även [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) och [Output](../nodes/output-node.md) vid återförening av grenar.

#### [Loop](../nodes/loop-node.md)

Noden Loop itererar över en array och kör nedströmsnoder för varje objekt. Den kräver en bakåtkoppling från den sista noden i iterationskroppen för att gå vidare. Inuti loopkroppen används `item`, `index`, `total`, `isFirst` och `isLast`; loopen har separata utdata för iterationsvägen och done-vägen.

Kombineras med [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) och [Expression DSL](./expression-dsl.md) för iterativa workflows.

### Data

#### [Set](../nodes/set-node.md)

Noden Set transformerar och mappar indata till anpassad utdata. Definiera nyckel-värde-mappningar där varje värde är ett [Expression DSL](./expression-dsl.md)-uttryck. Den används för versaler, delsträngar, sammanslagning, slumptal och liknande transformationer. Åtkomst till utdata sker via nyckel (t.ex. `$setNode.keyName`). När noden är ansluten till en agent som en canvas-nod kan mappningsvärden markeras som agent-tillhandahållna så att agenten fyller dem vid körning. För att anropa andra workflows används noden [Execute](../nodes/execute-node.md) i stället.

Se även [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) och [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Noden Converter konverterar data mellan format utan att skriva kod. Textkonverteringarna är `csvToJson` (CSV-text till en array av radobjekt, eller arrayer när det inte finns någon rubrikrad), `jsonToCsv` (en array av objekt/rader till CSV-text), `xmlToJson` (XML-text till ett objekt) och `jsonToXml` (ett objekt till XML-text). Konverteringsriktning och källuttryck konfigureras; CSV-konverteringar använder dessutom en avgränsare och hantering av rubrikrader, och `jsonToCsv` kan låsa en explicit kolumnordning. Citattecken, inbäddade avgränsare och inbäddade radbrytningar följer RFC 4180. XML-attribut använder prefixet `@`, text blandad med attribut använder `#text`, upprepade element blir arrayer och expansion av XML-entiteter är inaktiverad. Samma nod fungerar även på lagrade filer. `imageToText` och `pdfToText` kör Tesseract OCR, läser en fil från Heym Drive (`$Upload.file.id` från en File upload-trigger, ett resultat från en Drive-nod eller en agents genererade fil), väljer språk automatiskt utifrån det detekterade skriptet eller använder koder som anges, såsom `tur` eller `eng+tur`, och normaliserar texten till UTF-8 som standard med valfri NFC-normalisering och snävare teckenuppsättningar som `cp1254`. `fileConvert` skriver om en lagrad fil i ett annat format, dokument via pandoc och bilder via Pillow, och sparar resultatet som en ny Drive-fil utan att röra originalet. Resultatet är tillgängligt som `$converterNode.result`, med `.language`, `.encoding`, `.page_count`, `.pages` och `.file` vid sidan av för OCR-körningar, samt `.id`, `.filename` och `.download_url` för `fileConvert`.

Se även [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) och [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Noden Code kör Python som skrivs av användaren, med en egen `requirements.txt`, i en container som skapas och förstörs vid varje körning. Koden definierar en funktion `main(params)` och returnerar ett JSON-serialiserbart värde, vilket blir `$codeNode.result`; allt som skrivs ut fångas separat som `$codeNode.logs`, och `$codeNode.install` rapporterar vilket verktyg som installerade beroendena. Parametrar konfigureras som ett JSON-objekt vars `$`-uttryck löses upp före körningen, och koden läser dem med punktnotation såsom `params.user.name` eller `params.orders[0].id`. Beroenden installeras med `uv`, med fallback till `pip` för paket som `uv` inte kan hantera, utan cachelagring mellan körningar; lämnas `requirements.txt` tomt hoppas installationen över helt och är betydligt snabbare. Körningsfasen har inget nätverk om inte `codeAllowNetwork` aktiveras, medan beroendeinstallationen alltid når PyPI. Sandboxen körs som icke-root med alla behörigheter borttagna, ett skrivskyddat rotfilsystem, ingen Docker-socket och ingen åtkomst till backend-hemligheter, begränsad till 512 MB minne, en CPU, 256 processer, 120 sekunders installation och 60 sekunders körning. Docker krävs och det finns inget fallback-läge: utan en nåbar daemon misslyckas noden i stället för att köra koden i backend-processen.

#### [Variable](../nodes/variable-node.md)

Noden Variable sätter eller uppdaterar en workflow-lokal variabel (`$vars.variableName`) eller en persistent [global variabel](./global-variables.md) (`$global.variableName`). Den används för räknare, ackumulerade listor och delat tillstånd. Konfigurera variabelnamn, värdeuttryck, typkonvertering och huruvida värdet ska lagras i det globala lagret. Arrayvariabler stöder `$array()` och `.add()`.

Fungerar tillsammans med [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) och [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Noden Execute anropar ett annat workflow (sub-workflow) och skickar indata till det. Ange mål-workflowet med ID och tillhandahåll indata via ett enskilt uttryck eller nyckel-värde-mappningar. Utdata innehåller workflow_id, status och outputs; använd den för återanvändbar logik, inte för datatransformering (använd Set för det).

Se även [Canvas Features](./canvas-features.md) för Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) och [Output](../nodes/output-node.md).

### Integrations

#### [HTTP](../nodes/http-node.md)

Noden HTTP gör HTTP-anrop med cURL-liknande konfiguration. Den kan vara en startpunkt för ett workflow (ingen inkommande kant) eller ta emot indata från uppströms noder. Svaret är tillgängligt som status, headers och body (parsad JSON när tillämpligt). Använd [Credentials](./credentials.md) för Bearer- eller anpassad header-autentisering.

Fungerar tillsammans med [Webhooks](./webhooks.md), [Credentials](./credentials.md) och [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Noden WebSocket Send öppnar en utgående klientanslutning, skickar ett text-/JSON-/binärt meddelande och stänger den. Den används för att publicera workflow-utdata till realtidssystem utan att skapa en Heym-hostad socket-endpoint.

Se även [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) och [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Telegram-noden skickar ett botmeddelande till en chatt, grupp eller kanal. Konfigurera en Telegram-[autentiseringsuppgift](./credentials.md), ange `chatId` och komponera det utgående `message` med uttryck från [Expression DSL](./expression-dsl.md). Den kombineras naturligt med [Telegram Trigger](../nodes/telegram-trigger-node.md) för konversationsflöden och med [Error Handler](../nodes/error-handler-node.md) för aviseringar till operatörer.

Se även [Third-Party Integrations](./integrations.md) och [Credentials](./credentials.md) för konfiguration och mönster för autentiseringsuppgifter.

#### [Slack](../nodes/slack-node.md)

Slack-noden skickar ett meddelande till en Slack-kanal via en Incoming Webhook. Konfigurera en Slack-[autentiseringsuppgift](./credentials.md) och ett meddelandeuttryck. Den används för notiser, varningar och felrapportering; utdata passerar genom indata.

Kombineras med [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) och [Third-Party Integrations](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Discord-noden skickar ett meddelande till en Discord-kanal via en Incoming Webhook. Konfigurera en Discord-[autentiseringsuppgift](./credentials.md), komponera det utgående meddelandet med [Expression DSL](./expression-dsl.md) och ange valfritt åsidosättningar för webhook-användarnamn eller avatar.

Kombineras med [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) och [Third-Party Integrations](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Send Email-noden skickar e-post via SMTP. Konfigurera en SMTP-[autentiseringsuppgift](./credentials.md) och uttryck från [Expression DSL](./expression-dsl.md) för mottagare, ämne och brödtext. Den används för notiser, varningar och transaktionell e-post. Utdata innehåller status, to och subject.

[IMAP Trigger](../nodes/imap-trigger-node.md) kompletterar Send Email genom att hantera inkommande e-post. Tillsammans gör de det möjligt för ett workflow att läsa inkommande e-post från en delad inkorg, sammanfatta eller klassificera den med AI-noder och skicka ett uppföljnings- eller eskaleringsmeddelande. [Telegram Trigger](../nodes/telegram-trigger-node.md) och [Telegram-noden](../nodes/telegram-node.md) tillhandahåller samma mönster för inkommande/utgående trafik i botdrivna chattflöden.

För tvåvägsnotiser kombineras den även väl med [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) och [Third-Party Integrations](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Redis-noden utför Redis-operationer: set, get, hasKey och deleteKey. Den används för cachelagring, hastighetsbegränsning och nyckel-värde-lagring. Konfigurera en [autentiseringsuppgift](./credentials.md), operationstyp, nyckeluttryck samt för set-operationer värde och valfritt TTL. Utdata varierar beroende på operation (value, success, exists, deleted).

Kombineras med [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) och [Parallel Execution](./parallel-execution.md) för cachelagring, strypning och samordning.

#### [Grist](../nodes/grist-node.md)

Grist-noden läser, skriver och hanterar data i Grist-kalkylblad. Operationerna omfattar getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables och listColumns. Ange dokument-ID, tabell-ID och för create/update postdata med kolumn-ID:n. Den används för CRUD, batchuppdateringar och kalkylbladsautomatisering.

Se även [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) och [Third-Party Integrations](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets-noden läser, skriver och hanterar kalkylbladsdata via OAuth2. Den används för att läsa rapporter, lägga till workflow-resultat, uppdatera spårare och rensa eller inspektera kalkylbladsflikar inifrån ett workflow. Precis som [BigQuery](../nodes/bigquery-node.md) använder den en Google-baserad integrationsautentiseringsuppgift och passar väl tillsammans med [Grist](../nodes/grist-node.md) när kalkylbladsdata ingår i flödet.

Kombineras med [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) och [Third-Party Integrations](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery-noden kör SQL-frågor och infogar rader i Google BigQuery-datamängder via OAuth2. Den är användbar för analysflöden, rapporteringspipelines och för att skriva strukturerad händelsedata från workflow-körningar. Den kombineras ofta med [Set](../nodes/set-node.md) för att forma rader och [Google Sheets](../nodes/google-sheets-node.md) för lättare kalkylbladsorienterad rapportering.

Kombineras med [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) och [Third-Party Integrations](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Noden Google Drive listar, laddar ner, uppdaterar och tar bort Drive-filer och mappar via OAuth2, och kan kopiera en Drive-fil direkt till [Heym Drive](../nodes/drive-node.md) med operationen `syncToHeymDrive`. Google Docs, Sheets och Slides har inga nedladdningsbara bytes, så noden exporterar dem automatiskt — Docs till PDF, Sheets till XLSX, Slides till PPTX — med en överstyrning för målformatet. Borttagningar flyttar objekt till Drive-papperskorgen om inte "Delete permanently" är aktiverat, och noden vägrar ta bort en mapp via filoperationen eller vice versa. Precis som [Google Sheets](../nodes/google-sheets-node.md) använder den en Google-stödd OAuth2-autentiseringsuppgift; observera att denna begär full Drive-åtkomst, så granska [Credential Sharing](./credentials-sharing.md) innan den delas.

Kombineras med [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) och [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Noden GitHub tillhandahåller 40 inbyggda GitHub REST-åtgärder som täcker repositorier, organisationer och användare, ärenden, pull requests, granskningar, releaser, Actions-workflows, trafikinsikter och repositoriefiler. Den används för ärendehantering, granskningsautomatisering, workflow-dispatch och väntan på slutförande, releaseautomatisering och uppdateringar av repofiler utan att bygga HTTP-förfrågningar manuellt. Den stöder GitHub.com och valfri `base_url` för GitHub Enterprise på autentiseringsuppgiften.

Kombineras med [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) och [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Noden Jira ansluter workflows till Jira Cloud eller Jira Data Center / Server REST-API:er för automatisering av projekt, ärenden, kommentarer, bilagor, användare, aviseringar och övergångar. Den kan lista projekt, söka ärenden med JQL, skapa eller uppdatera ärenden, granska ändringsloggar, avisera intressenter, hantera kommentarer och bilagor, hämta eller hantera användare, lista tillgängliga övergångar och flytta ärenden via ett övergångs-ID. Använd en Jira-autentiseringsuppgift med Atlassian-e-post, API-token, webbplatsens bas-URL och distributionsläge.

Kombineras med [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) och [Third-Party Integrations](./integrations.md) för supportintag, bugghantering och releaseworkflows.

#### [Linear](../nodes/linear-node.md)

Noden Linear ansluter workflows till Linears GraphQL-API för automatisering av arbetsytor och ärenden. Den kan lista team, projekt, ärenden, workflow-tillstånd, teammedlemmar och kommentarer; skapa, uppdatera, ta bort och länka ärenden; samt skapa, uppdatera, lösa, återöppna eller ta bort kommentarer. Använd en personlig Linear-API-nyckel eller OAuth2-autentiseringsuppgift, och hämta sedan UUID:er för team, projekt, tillstånd och tilldelade från listoperationer innan ärenden skapas eller uppdateras.

Kombineras med [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) och [Third-Party Integrations](./integrations.md) för intag, ärendehantering och arbetsflöden för engineering-backlog.

#### [Supabase](../nodes/supabase-node.md)

Noden Supabase läser och ändrar tabeller som exponeras via Supabase PostgREST. Den fungerar väl för produktbackends, användar- och profildata, workflow-tillstånd och CRUD-liknande automatiseringar som vill ha databasåtkomst utan anpassad HTTP-förfrågningskoppling.

Kombineras med [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) och [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Noden ClickHouse kör CRUD-, count- och råa SQL-operationer mot en extern ClickHouse-databas via dess HTTP-gränssnitt. Den passar analyspipelines, händelseloggning och rapporteringsworkflows: infoga händelser när de inträffar och aggregera eller räkna dem sedan med `query`/`count`. Den speglar [DataTable](../nodes/datatable-node.md)s operationsuppsättning (find, getAll, count, getById, insert, update, remove, upsert) plus en rå SQL-utväg, där `update`/`remove` körs som ClickHouse-mutationer.

Kombineras med [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) för schemalagda rapporter och [Third-Party Integrations](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Noden Notion hanterar Notion-databaser, datakällor, sidor och block via det aktuella Notion-API:et (`2026-03-11`). Den stöder sökning, CRUD för sidor, operationer för databaser och datakällor, blockbarn, append/update/delete-block och papperskorg/återställning. Använd en intern integrationstoken eller en OAuth-autentiseringsuppgift för Notion public integration. Redigeraren kan söka och markörpagineringsbläddra bland tillgängliga datakällor och överordnade sidor. Delade autentiseringsuppgifter fungerar på samma sätt som ägda autentiseringsuppgifter för workflow-körning.

För anpassade REST-anrop löses `$credentials.YourNotionCredential` till samma bearer-token. Kombineras med [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) och [Third-Party Integrations](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Sentry-noden automatiserar Sentry-organisationer, projekt, team, ärenden, händelser och releaser via Sentry REST API. Den används för triagering av varningar, statusuppdateringar av ärenden, release-automation, uppslagning av händelser samt uppsättning och rensning av projekt och team. Sentry SaaS och självhostad Sentry stöds via en valfri bas-URL i autentiseringsuppgiften.

Kombineras med [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) och [Third-Party Integrations](./integrations.md) för incident- och release-workflows.

#### [DataTable](../nodes/datatable-node.md)

DataTable-noden läser, skriver och hanterar data i Heym Datatabeller (förstapartsstrukturerad lagring). Operationerna omfattar find, getAll, getById, insert, update, remove och upsert. Inga externa autentiseringsuppgifter krävs. Tabeller hanteras från fliken [DataTable](../tabs/datatable-tab.md) i instrumentpanelen och nås direkt av workflow-ägaren.

Kombineras med [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) och fliken [DataTable](../tabs/datatable-tab.md) för förstapartsstrukturerad lagring.

#### [Drive](../nodes/drive-node.md)

Drive-noden hanterar filer som genereras av skills direkt inifrån en workflow. Operationerna omfattar delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams och unshareWithMyTeams för hantering av skrivskyddad teamåtkomst; formatkonvertering hanteras i stället av noden [Converter](../nodes/converter-node.md). Referera till filen med `$agentLabel._generated_files[0].id`; utdata omfattar status, file_id, uppdaterad download_url för länkbegränsningar samt shared_team_count för teamdelning. Detta är särskilt användbart tillsammans med [Agent Node](../nodes/agent-node.md)-workflows som använder [File Generation](./file-generation.md) och referensmodellen [Drive](./drive.md).

Vanliga följeslagare är [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) och [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3-noden utför objektlagringsoperationer på Amazon S3 med en `s3`-autentiseringsuppgift (åtkomstnyckel, hemlig nyckel, region, valfritt sessionstoken). Operationerna omfattar putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder och listBuckets. Uppladdning av text samt nedladdning av text eller base64 stöds, där fälten för bucket och key accepterar [Expression DSL](./expression-dsl.md). Den används för att lagra workflow-utdata, arkivera filer och läsa tillbaka objekt in i ett flöde.

Kombineras med [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) och [Third-Party Integrations](./integrations.md).

### Automation

#### [Crawler](../nodes/crawler-node.md)

Crawler-noden skrapar webbsidor med FlareSolverr och valfri HTML-extrahering via CSS-selektorer. Konfigurera en FlareSolverr-[autentiseringsuppgift](./credentials.md), ett URL-uttryck, väntetid och valfria selektorer för extrahering. Utdata är rå HTML eller extraherat innehåll. Den används för webbskrapning och innehållsextrahering.

Kombineras med [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) och [LLM](../nodes/llm-node.md) för flöden som skrapar och analyserar.

#### [Playwright](../nodes/playwright-node.md)

Playwright-noden automatiserar webbläsarinteraktioner med konfigurerbara steg (navigate, refresh, click, type, screenshot, extract, aiStep) eller läget **Run Code** för anpassad Playwright Python (sandboxat; inaktiverat som standard via `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Den stöder headless-läge, en valfri inställning som minskar vanliga Playwright-automatiseringssignaler, timeouts, valfri nätverksinspelning (responses, cookies, localStorage, sessionStorage), autentiseringsbootstrap för cookie/storageState från [Global Variables](./global-variables.md)-uttryck som `$global.authState`, reservinloggningssteg när återställning av autentisering misslyckas samt ett AI-steg med Auto Heal när selektorer misslyckas. Den används för webbskrapning, formulärifyllning och webbläsarbaserade workflows.

Se även [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) och [Execution History](./execution-history.md) för webbläsarautomation och felsökning.

### Utilities

#### [Output](../nodes/output-node.md)

Output-noden är workflow-slutpunkten som returnerar svaret till anroparen. Ange meddelandeuttrycket så att det refererar till föregående nod via etikett (använd aldrig `$input` från noden [Input](../nodes/input-node.md) här). Valfri asynkron nedströms gör att noder efter output kan köras i bakgrunden efter att svaret har skickats.

Vanliga uppströmskällor är [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) och [Execute](../nodes/execute-node.md); formning av svar är enklare att felsöka i [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper-noden bygger ett vanligt JSON-objekt från nyckel-värde-mappningar i [Set](../nodes/set-node.md)-stil och returnerar det i roten av workflow-svaret. Den används när en API-anropare ska ta emot en rå JSON-body i stället för standardomslaget från noden [Output](../nodes/output-node.md).
#### [HTML-utdatamappare](../nodes/html-output-mapper-node.md)

Noden HTML-utdatamappare renderar en enskild HTML-mall och interpolerar `$nodeLabel.field`-uttryck i sidan. När den är workflowets enda terminalnod svarar execute-webhooken med `text/html` och nodens konfigurerade statuskod i stället för en JSON-body, så att ett workflow kan servera en sida direkt till en webbläsare. Skicka `X-Simple-Response: false` för att få tillbaka det vanliga JSON-höljet för felsökning.

Fungerar tillsammans med [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow-struktur](./workflow-structure.md) och [Webhooks](./webhooks.md).

#### [Diagramutdata](../nodes/chart-output-node.md)

Noden Diagramutdata är terminalnoden i ett workflow för en [Dashboard](../tabs/dashboard-tab.md)-widget. Den omvandlar raderna som produceras av uppströmsnoder till en standardiserad diagram-payload som dashboarden renderar. Välj en `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, Gantt, entity relationships, text eller HITL), mappa `labelField`/`valueField` (eller `series` för flera serier, eller `text` för ett markdown-meddelande) och placera den sist; den har ingen utgående kant. Gantt läser uppgiftsrader med ISO-start-/slutdatum, förlopp och beroende-ID:n. Entity relationships läser ett grafobjekt med entiteter, fält, PK/FK-nycklar och relationer. Båda renderas även på Heym Work-sidor och i dess widgetförslag. HITL ignorerar uppströmsrader och listar väntande mänskliga granskningar. och en annan som länkningsknappar som öppnar en URL i en ny flik (`linkColumn`, med `linkLabel` för knapptexten)

Se även [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) och [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Noden Wait pausar workflowets körning under en angiven varaktighet i millisekunder, upp till 15 minuter. Den används för hastighetsbegränsning, fördröjda åtgärder eller pollningsintervall. Den skickar vidare indata oförändrade.

Fungerar tillsammans med [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) och [Parallell körning](./parallel-execution.md) för styrning av takt och pollning.

#### [Sticky Note](../nodes/sticky-note-node.md)

Noden Sticky Note lägger till markdown-anteckningar på canvasen. Den körs inte. Den används för dokumentation, instruktioner eller workflowanteckningar tillsammans med andra [Canvas-funktioner](./canvas-features.md). Dubbelklicka på canvasen för att redigera anteckningens innehåll.

Se även [Canvas-funktioner](./canvas-features.md), [Tangentbordsgenvägar](./keyboard-shortcuts.md) och [Workflow-organisering](./workflow-organization.md).

#### [Konsollogg](../nodes/console-log-node.md)

Noden Konsollogg loggar ett värde till backend-konsolen (serverns konsol). Den används för felsökning och inspektion under utveckling. Loggmeddelandet stöder [Expression DSL](./expression-dsl.md)-uttryck; utdata skickas vidare från indata.

Fungerar tillsammans med [Körningshistorik](./execution-history.md), [Körningar](../tabs/traces-tab.md) och [Dialogrutan för uttrycksutvärdering](./expression-evaluation-dialog.md) för felsökning.

#### [Inaktivera nod](../nodes/disable-node.md)

Noden Inaktivera nod inaktiverar permanent en annan nod i workflowet genom att sätta dess `active`-flagga till false. Ange målnoden med etikett. Den används för engångsåtgärder, till exempel att stoppa en [Cron](../nodes/cron-node.md)-trigger efter att ett villkor har uppfyllts.

Se även [Canvas-funktioner](./canvas-features.md), [Redigeringshistorik](./edit-history.md) och [Cron](../nodes/cron-node.md) för mönster för workflowstyrning.

#### [Aktivera nod](../nodes/enable-node.md)

Noden Aktivera nod slår på en annan nod igen genom att sätta dess `active`-flagga till true och spara ändringen. Ange målnoden med etikett. Den används för att återaktivera en inaktiverad [Cron](../nodes/cron-node.md)-trigger från en annan ingångspunkt, eller för att slå på en nod när ett villkor har uppfyllts. Ett mål som ligger nedströms Aktivera nod och ännu inte har körts körs också i den aktuella körningen.

Se även [Inaktivera nod](../nodes/disable-node.md), [Canvas-funktioner](./canvas-features.md) och [Cron](../nodes/cron-node.md) för mönster för workflowstyrning.

#### [Utlös fel](../nodes/throw-error-node.md)

Noden Utlös fel stoppar workflowets körning omedelbart och returnerar ett felsvar med en anpassad HTTP-statuskod. Ange felmeddelandeuttrycket och statuskoden (t.ex. 400, 401, 403, 404, 429, 500). Den används för valideringsfel, obehörig åtkomst eller andra felvillkor, särskilt tillsammans med [Condition](../nodes/condition-node.md) och [Error Handler](../nodes/error-handler-node.md).

Fungerar tillsammans med [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) och [Säkerhet](./security.md) för explicita felflöden.

---

## Referens
### [Nodtyper](./node-types.md)

Heym tillhandahåller en mängd olika nodtyper: triggers som [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) och [Error Handler](../nodes/error-handler-node.md); AI-noder som [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) och [MCP Call](../nodes/mcp-call-node.md); logiknoder som [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) och [Loop](../nodes/loop-node.md); datanoder som [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) och [Heym](../nodes/heym-node.md); integrationer som [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) och [Drive](../nodes/drive-node.md); automatiseringsnoder som [Crawler](../nodes/crawler-node.md) och [Playwright](../nodes/playwright-node.md); samt verktyg som [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) och [Sticky Note](../nodes/sticky-note-node.md). Använd uttryck som `$input.text` och `$nodeLabel.field` i nodkonfigurationen.

Se även [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) och [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym använder ett enkelt uttrycksspråk för att referera till data från uppströmsnoder. Använd `$input` för [Input](../nodes/input-node.md)-noden, `$nodeLabel.field` för valfri uppströmsnod, `$credentials.CredentialName` för [autentiseringsuppgifter](./credentials.md) och `$global.variableName` för [globala variabler](./global-variables.md). Inbyggda specialvariabler inkluderar `$now`, `$UUID` och workflow-metadata: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` och `$executionId` (körningens [Execution History](./execution-history.md)-id — `/workflows/{id}/{executionId}` öppnar den körningen på canvas; endast vid körning, tomt i dialogrutan för uttrycksförhandsgranskning). Stöd finns för literaler, aritmetik, jämförelser, [Loop](../nodes/loop-node.md)-kontext, nästlade fält samt sträng- och arrayhjälpfunktioner (inklusive `$text.toJson()` för att tolka en JSON-sträng). När hela värdet är ett enskilt `$expr` bevarar backend arrayer, objekt, booleaner och tal som inbyggda typer.

Se även [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) och [Workflow Structure](./workflow-structure.md).

### [Global Variables](./global-variables.md)

Global Variable Store innehåller beständig, användarscopad nyckel-värde-data som överlever mellan workflow-körningar. Variabler skapas från fliken [Variables](../tabs/global-variables-tab.md) eller från en [Variable](../nodes/variable-node.md)-nod med "Store in Global Variable Store" aktiverat. De nås med `$global.variableName` i uttryck; de kan delas med andra användare eller [team](./teams.md).

Fungerar tillsammans med [Variable](../nodes/variable-node.md), [Teams](./teams.md) och [Credentials Sharing](./credentials-sharing.md) för delat workflow-tillstånd.
### [Dialogrutan för utvärdering av uttryck](./expression-evaluation-dialog.md)

Dialogrutan för utvärdering av uttryck är en expanderbar editor som visas när expanderingsknappen intill uttrycksfält klickas. Den öppnas som en stor centrerad modal, håller autokomplettering aktiv och uppdaterar förhandsgranskningsresultatet från backend automatiskt efter att skrivandet pausats. Objekt- och arrayresultat kan bläddras med väljaren för utdatasökväg. Dialogrutan accepterar en helradig bar punktsökväg (till exempel `myNode.output.field`) som om den vore `$myNode.output.field`; se placeringsregler i [Expression DSL](./expression-dsl.md).

Knappen **Bygg med AI** i verktygsfältet gör det möjligt att beskriva det önskade uttrycket i klartext. Välj en LLM-[autentiseringsuppgift](./credentials.md) och modell, ange en beskrivning såsom *"Hämta kundnamnet från API-svaret"* och klicka på Generera. Backend skickar kontexten för [Expression DSL](./expression-dsl.md) och nodutdata från senaste körningen till modellen och returnerar en enskild uttryckssträng. Resultatet utvärderas omedelbart så att det kan verifieras innan Använd klickas.

Fungerar naturligt tillsammans med [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) och [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Workflow-struktur](./workflow-structure.md)

Workflows lagras som JSON med noder och kanter. Workflow-objektet innehåller id, name, description, nodes, edges och auth-inställningar. Varje nod har id, type, position och data (etikett och typspecifik konfiguration). Kanter kopplar samman käll- och målnod-ID:n med valfria handle-ID:n. Uttryckssyntax i datafält följer [Expression DSL](./expression-dsl.md), och samma struktur används av [Download & Import](./download-import.md).

Se även [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md) och [Download & Import](./download-import.md).

### [Canvas-funktioner](./canvas-features.md)

Håll muspekaren över valfri icke-sticky-nod på canvas och klicka på **Kör** för att köra fram till den noden. Nödvändiga indata öppnas i körpanelen med det första fältet fokuserat; sökvägar utan indata startar omedelbart. Se [Run to Node](./canvas-features.md#run-to-node).

Workflow-editorn tillhandahåller Data Pin (fäst en nods senaste utdata för testning av efterföljande noder utan att köra om), Körningsloggar (nodresultat och agentförlopp i realtid som kompletterar [Execution History](./execution-history.md)), Enable/Disable (hoppa över noder under körning) och Extract to Sub-Workflow (flytta en markering till en ny workflow och ersätt den med en [Execute](../nodes/execute-node.md)-nod). En pågående produktionskörning kan öppnas från Historik eller ett Board-kort; editorn återställer dess aktuella ögonblicksbild, ansluter till SSE och håller canvas-animeringen och Debug-loggarna aktiva. [Keyboard Shortcuts](./keyboard-shortcuts.md) stöder kopiera, klistra in, köra och inline-nodsökning.

Se även [Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md) och [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym tillhandahåller kortkommandon i hela editorn: Command Palette (Ctrl+K), Kör (Ctrl+Enter), Spara (Ctrl+S), Ångra/Gör om och Escape för att stänga. På canvas: markera allt, flermarkering, kopiera/klipp ut/klistra in, ta bort, växla nod aktiverad (D), växla fäst data (P) och inline-nodsökning genom att skriva. Kortkommandon dokumenteras i den inbyggda referensen och fungerar nära tillsammans med [Canvas-funktioner](./canvas-features.md) såsom Data Pin och aktivering/inaktivering av noder.

Se även [Canvas-funktioner](./canvas-features.md), [Quick Drawer](./quick-drawer.md) och [Contextual Showcase](./contextual-showcase.md).

### [AI-assistent](./ai-assistant.md)

AI-assistenten är en chatpanel som öppnas från Debug-panelen och gör det möjligt att skapa eller ändra workflows med naturligt språk. Välj en [autentiseringsuppgift](./credentials.md) och modell och beskriv sedan vad som önskas; AI:n strömmar ett svar och all giltig [workflow-JSON](./workflow-structure.md) i ett kodblock tolkas automatiskt och tillämpas på canvas. Röstinmatning stöds i kompatibla webbläsare.

Aktivera **YOLO-läge** (Agent-läge, avstängt som standard) och assistenten testar det den bygger. Efter varje ändring kör den workflowen på canvas, läser resultatet och åtgärdar workflowen tills den gör vad som efterfrågats, i upp till 5 körningar per meddelande. Den frågar efter testindata före den första körningen, kan köra andra workflows när den behöver deras resultat och visar varje steg medan den arbetar. Se [AI-assistent › YOLO-läge](./ai-assistant.md#yolo-mode).

Klicka på **AI** ovanför en valfri nod på ritytan för att endast ändra eller åtgärda den noden. Panelen visar noden som ändras (med dess senaste resultat när den har körts) och erbjuder **Change this node as ...**, **Fix error in this node ...** och **Other**. Endast den noden uppdateras; resten av arbetsflödet och layouten förblir som de är. Se [AI Assistant › Ändra en enskild nod](./ai-assistant.md#changing-one-node).

När en workflow lagrar poster frågar assistenten vilken [datatabell](../tabs/datatable-tab.md) som ska användas, eller skapar en med de kolumner som workflowen behöver. Se [AI-assistent › Datatabeller](./Chat och MCP `heym_chat` kan också redigera kolumner och rader direkt med ägar- eller skrivbehörighet, med bekräftelse innan kolumner tas bort eller alla rader rensas. Chat och MCP `heym_chat` kan också redigera kolumner och rader direkt med ägar- eller skrivbehörighet, med bekräftelse innan kolumner tas bort eller alla rader rensas. ai-assistant.md#data-tables).

När den aktuella workflowen innehåller skills för [Agent-nod](../nodes/agent-node.md) skickar assistenten endast varje skills `SKILL.md` in i workflow-kontexten. Bifogade `.py`-filer och binära skill-tillgångar utesluts före begäran så att stora skill-paket inte överskrider modellens kontextfönster.

Fungerar väl tillsammans med [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md) och [Expression DSL](./expression-dsl.md).
### [Chatta med Heym](./chat-with-heym.md)

Chatta med Heym är en dokumentationshuvudassistent för produktfrågor. Den öppnas i en centrerad dialogruta, håller val av autentiseringsuppgifter och modell synliga högst upp, injicerar den aktiva dokumentationssidans sökväg som kontext och rensar meddelandehistoriken när dialogrutan stängs. Den kompletterar den bredare [AI-assistenten](./ai-assistant.md) och den lättare [Kontextuella visningen](./contextual-showcase.md).

Se även [AI-assistenten](./ai-assistant.md), [Kontextuell visning](./contextual-showcase.md) och [Nodtyper](./node-types.md).

### [Workflow-organisering](./workflow-organization.md)

Instansadministratörer (`HEYM_ADMIN_EMAILS`) kan komma åt och redigera alla workflows, hitta en ägares workflows via e-post, granska scheman och körningshistorik, pausa och återuppta automatiska triggers samt ta bort workflows när körningar har slutförts. Se [Instansadministration](../tabs/workflows-tab.md#instance-administration) för offboarding-flödet och skillnaden mellan att pausa automatiska triggers och att blockera alla anrop.

Workflows kan organiseras i mappar och undermappar i en trädstruktur. Mappar har namn och valfri överordnad mapp; workflows tilldelas mappar. Workflows kan schemaläggas för borttagning (flyttas till en papperskorgsarea före permanent borttagning). API:et stöder skapande, uppdatering, borttagning och flytt av workflows mellan mappar, och samma organisationsmodell visas i fliken [Workflows](../tabs/workflows-tab.md).

Se även [Snabbpanelen](./quick-drawer.md), [Nedladdning och import](./download-import.md) och [Redigeringshistorik](./edit-history.md).

### [Snabbpanelen](./quick-drawer.md)

Snabbpanelen är en fast panel på höger sida för snabb körning på interna sidor utanför canvas. Den gör det möjligt att söka bland [workflows](../tabs/workflows-tab.md), fästa favoriter, välja indata, köra omedelbart och granska förlopp eller resultat utan att öppna redigeraren. En workflow med en [File Upload Trigger](../nodes/file-upload-trigger-node.md) tar emot en släppt eller vald fil. Fästordning och den senast valda workflowen lagras i webbläsaren.

Se även [Workflow-organisering](./workflow-organization.md), [Tangentbordsgenvägar](./keyboard-shortcuts.md) och [Körningshistorik](./execution-history.md).

### [Kontextuell visning](./contextual-showcase.md)

Den kontextuella visningen är en kompakt guidepanel i appen för autentiserade huvudytor som instrumentpanelsflikar, [Utvärdering](../tabs/evals-tab.md), Docs och workflow-redigeraren. Den är stängd som standard, visar först en kort sammanfattning av sidan, erbjuder lite extra information vid behov och länkar till den fullständiga dokumentationsartikeln när djupare vägledning önskas.

Fungerar tillsammans med [Chatta med Heym](./chat-with-heym.md), [Snabbpanelen](./quick-drawer.md) och [AI-assistenten](./ai-assistant.md) för vägledningsflöden i appen.

### [Autentiseringsuppgifter](./credentials.md)

Autentiseringsuppgifter lagrar API-nycklar och hemligheter som används av workflow-noder. De läggs till i fliken [Autentiseringsuppgifter](../tabs/credentials-tab.md) och refereras med namn eller ID i noder som [LLM](../nodes/llm-node.md), [Agent-nod](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Skicka e-post](../nodes/send-email-node.md) och [Redis](../nodes/redis-node.md). De är krypterade i vila, kan delas med användare eller [team](./teams.md) och kan även refereras i [Expression DSL](./expression-dsl.md) via `$credentials.Name`.

Se även [Autentiseringsuppgifter](../tabs/credentials-tab.md), [Delning av autentiseringsuppgifter](./credentials-sharing.md) och [Tredjepartsintegrationer](./integrations.md).

### [Delning av autentiseringsuppgifter](./credentials-sharing.md)

Autentiseringsuppgifter kan delas med andra användare via e-post eller med team; alla teammedlemmar får åtkomst när en autentiseringsuppgift delas med ett team. Delade autentiseringsuppgifter visas med en indikator i fliken [Autentiseringsuppgifter](../tabs/credentials-tab.md). Vid körning sammanfogar workflow-ägarens kontext ägda, användardelade och teamdelade autentiseringsuppgifter. Använd `$credentials.CredentialName` i uttryck eller ange credentialId i noddata.

Se även [Autentiseringsuppgifter](./credentials.md), [Team](./teams.md) och [Tredjepartsintegrationer](./integrations.md).

### [Team](./teams.md)

Team gör det möjligt att dela workflows, autentiseringsuppgifter, globala variabler, vektorlager och Drive-filer med en grupp användare samtidigt. Team skapas från fliken [Team](../tabs/teams-tab.md) och medlemmar läggs till via e-post. Resurser delas med ett team från respektive delningsdialog; alla medlemmar har då åtkomst. Skaparen kan redigera och ta bort teamet; borttagning av ett team tar bort alla teamdelningar.

Fungerar tillsammans med [Delning av autentiseringsuppgifter](./credentials-sharing.md), [Globala variabler](./global-variables.md) och [Enterprise](./enterprise.md).

### [Parallell körning](./parallel-execution.md)

Heym kör noder parallellt när de inte är beroende av varandra. Exekveraren bygger en DAG och kör noder på samma nivå samtidigt med en trådpool; så snart en nod är klar schemaläggs dess nedströmsnoder. Använd noden [Merge](../nodes/merge-node.md) för att kombinera parallella grenar vid behov. Flera workflow-körningar körs samtidigt; varje körning är isolerad. Läget [SSE Streaming](./sse-streaming.md) sänder händelser när noder slutförs.

Se även [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) och [Körningshistorik](./execution-history.md).
### [Agent-arkitektur](./agent-architecture.md)

[Agent-noden](../nodes/agent-node.md) stöder sub-agenter (orkestreraren anropar andra agent-noder via call_sub_agent), sub-workflows (agenten anropar andra workflows via call_sub_workflow), skills (instruktionsinnehåll och Python-verktyg från .zip eller .md) samt [MCP](../tabs/mcp-tab.md)-klientanslutningar. Orkestrerarens verktygsexekutor dirigerar anrop till sub-agenter och sub-workflows; övriga verktyg går till Python-, MCP- eller skill-exekutorer. Maximal nästlingsdjup för sub-agenter och sub-workflows är 5. Verktygsanropsloopen inkluderar automatisk kontextkomprimering: före varje iteration uppskattas token-användningen och om den överstiger 80 % av modellens kontextfönster sammanfattas de mittersta meddelandena med samma modell, medan systemprompten, första användarmeddelandet och sista användarmeddelandet hålls intakta.

Se även [Agent-noden](../nodes/agent-node.md), [Agentens beständiga minne](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) och [MCP](../tabs/mcp-tab.md).

### [Agentens beständiga minne](./agent-persistent-memory.md)

Valfri kunskapsgraf per [Agent-nod](../nodes/agent-node.md) som lagras i Postgres: entiteter, typer, egenskaper och riktade relationer. När `persistentMemoryEnabled` är true sammanfattas grafen i systemprompten vid varje körning; efter lyckade slutföranden extraherar en [LLM](../nodes/llm-node.md) strukturerade uppdateringar i bakgrunden. REST CRUD finns under `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Redigeraren öppnas från den rosa hjärnkontrollen på noden.

Se även [Agent-noden](../nodes/agent-node.md), [Agent-arkitektur](./agent-architecture.md) och [Körningar](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-Loop låter en [Agent-nod](../nodes/agent-node.md) begära godkännande vid specifika kontrollpunkter, skapa en publik `/review/{token}`-sida och vänta på att en icke-inloggad granskare accepterar, redigerar eller avvisar Markdown-granskningstexten. HITL-aktiverade agenter exponerar även en `review`-utgång så att [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) eller andra kanaler kan meddelas medan körningen väntar. HITL-texten på nodnivå används som godkännanderiktlinjer, medan sammanfattningen på den publika sidan genereras från själva granskningsbegäran. Väntande körningar visas omedelbart i [Körningshistorik](./execution-history.md), kan inträffa mer än en gång i samma körning och återupptas från den exakt lagrade workflow-ögonblicksbilden när varje beslut har skickats in.

Se även [Agent-noden](../nodes/agent-node.md), [Portal](./portal.md), [Körningshistorik](./execution-history.md) och [Send Email](../nodes/send-email-node.md).

### [Webhooks](./webhooks.md)

Workflows kan triggas via [HTTP](../nodes/http-node.md) på `POST /api/workflows/{workflow_id}/execute`, eller strömmas inkrementellt från `POST /api/workflows/{workflow_id}/execute/stream`. Förfrågans body skickas som body till [Input](../nodes/input-node.md)-noder; headers och query-parametrar är tillgängliga i [Expression DSL](./expression-dsl.md)-uttryck. Konfigurera autentisering per workflow: anonym, JWT eller anpassad header. Valfri svars-cachning, hastighetsbegränsning och redigerarens dialog för Kör med cURL finns alla på workflowen och gäller för båda lägena. Med en [concurrency-gräns](./webhooks.md#concurrency-limit-and-queued-runs) får ett anrop som måste vänta istället `202 Accepted` med ett körnings-ID och en status-URL.

Se även [Input](../nodes/input-node.md), [Körningstoken](./execution-tokens.md), [SSE-strömning](./sse-streaming.md), [HTTP](../nodes/http-node.md) och [Workflow-struktur](./workflow-structure.md).

### [Körningstoken](./execution-tokens.md)

Körningstoken är avgränsade JWT:er som ger åtkomst till en enskild workflows execute- och stream-endpoints. När en workflow använder JWT-autentisering låter token externa skript, CI-pipelines och integrationer anropa workflowen utan att dela en användarsession. Varje token bär en `wid`-claim som fäster den vid en workflow, en `jti` som används för omedelbar återkallelse samt en konfigurerbar TTL (60 sekunder till 10 år). Skapa, välj och återkalla token direkt från dialogen **Kör med cURL** — den valda token bäddas automatiskt in i det genererade kommandot.

Se även [Webhooks](./webhooks.md), [Säkerhet](./security.md) och [SSE-strömning](./sse-streaming.md).

### [SSE-strömning](./sse-streaming.md)

cURL-dialogen kan växla [webhook](./webhooks.md)-körning till Server-Sent Events-läge. Detta producerar händelserna `execution_started`, `node_start`, `node_complete` och `execution_complete` i realtid, lägger till `--no-buffer` i det genererade cURL-kommandot och gör det möjligt att konfigurera startmeddelanden per nod, såsom `[START] LLM` eller anpassad text för externa terminalkonsumenter.

Se även [Webhooks](./webhooks.md), [Körningshistorik](./execution-history.md) och [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Workflows startas av trigger-noder ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) receive) eller startpunkter: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron-schemaläggaren, Telegram-webhook, Discord-interaktionswebhook, IMAP trigger manager, RabbitMQ-konsument eller körning från redigeraren. Varje trigger har sin egen endpoint eller bakgrundsprocess; [Cron](../nodes/cron-node.md) körs var 60:e sekund, [Telegram Trigger](../nodes/telegram-trigger-node.md)-noder tar emot bot-webhooks, [Discord Trigger](../nodes/discord-trigger-node.md)-noder tar emot signerade interaktionswebhooks och [IMAP Trigger](../nodes/imap-trigger-node.md)-noder körs enligt sitt konfigurerade pollningsintervall. [Input](../nodes/input-node.md)-noder tar emot body, headers och query från webhook-förfrågningar.

Se även [Node Types](./node-types.md), [Webhooks](./webhooks.md) och [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

Execution history registrerar workflow-körningar: indata, utdata, nodresultat, status och triggerkälla. Det nås från redigerarens verktygsfält, Docs-vyn, Dashboardens sidhuvud eller [Evals](../tabs/evals-tab.md)-vyn. Historik per workflow visar körningar för det öppna workflowet; vyn för all historik visar körningar över alla workflows och chattar. Pågående körningar visas högst upp i båda dialogerna med åtgärderna **Open live** och **Cancel**. Open live kopplar redigeraren till den befintliga körningen via [SSE](./sse-streaming.md), återställer slutförda noder, pulserar aktuella och väntande noder och lägger till Debug-loggar utan att starta en ny körning. Bring to Canvas laddar en slutförd körnings indata och nodutdata för omkörning eller felsökning; djuplänken `/workflows/{workflowId}/{executionId}` stöder både pågående och slutförda körningar. Körningar som pausats av [Human-in-the-Loop](./human-in-the-loop.md) lagras omedelbart som `pending`, inklusive den publika gransknings-URL:en och eventuella notifieringsnoder som körts från agentens `review`-gren. Om servern startas om mitt i en körning återställs avbrutna körningar automatiskt: de körs om från början med samma indata och visas som slutförda (markerade **Recovered**), styrt av en **Auto-recover runs**-växel per workflow som i stället kan registrera dem som `skipped`.

Se även [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) och [Traces](../tabs/traces-tab.md).

### Execution Highlights

Efter en pågående körning — eller efter **Bring to Canvas** — visas en stängbar **Execution Highlights**-popup högst upp till höger på Canvas, med en lista över vad varje nod producerade i körningsordning. Det är ett snabbt sätt att granska utdata per nod utan att öppna varje nod; stäng den med **✕**, och den öppnas igen vid nästa körning. Highlights visas även på dashboard-körningar. Se [Execution History](./execution-history.md) för detaljer.

### [Edit History](./edit-history.md)

Edit History spårar sparade versioner av ett workflow (varje Save skapar en version). Visa listan, öppna en version för att se en diff mot det aktuella workflowet ([noder](./workflow-structure.md), kanter, konfiguration) och använd Revert för att återställa en tidigare version. Till skillnad från [Execution History](./execution-history.md) spårar Edit History strukturändringar, inte körningar.

Se även [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) och [Canvas Features](./canvas-features.md).

### Error Workflow

Ett workflow kan utse ett annat workflow att köra när det misslyckas. Det konfigureras i workflowets **Properties**-panel (som visas när ingen nod är vald) under **On error, run workflow**. Endast workflowets ägare kan ange, ändra eller rensa det; se [Owner-only settings](./workflow-organization.md#owner-only-settings). När en körning på översta nivån avslutas med ett ohanterat fel körs det valda error-workflowet och tar emot felkontexten (misslyckat workflow-id och namn, körnings-id, felmeddelande, etikett och typ för den misslyckade noden samt en tidsstämpel). Om Canvas redan innehåller en [Error Handler](../nodes/error-handler-node.md)-nod har den lokala hanteraren företräde och error-workflowet anropas **inte**. Error-workflowet körs direkt och utlöser därför aldrig sitt eget error-workflow.

Det omfattar varje körning på översta nivån som inte är en testkörning: båda execute-endpoints, [Portal](./portal.md) och varje trigger, inklusive [cron](../nodes/cron-node.md), chattplattformarnas triggers, e-post, köer, [MCP](../tabs/mcp-tab.md) och dashboard-widgetar. Med [Load Distribution](./cluster.md) aktiverat är detta oförändrat, inklusive körningar som en worker utfört: den misslyckade noden följer med tillbaka i resultatet, och error-workflowet distribueras sedan som vilken annan körning som helst, så en nod i det som måste köras på huvudinstansen gör fortfarande det. Två fall lämnas medvetet utanför, eftersom workflowets eget utfall ännu inte är känt: en körning som ingen instans någonsin utförde, och en väntan som nådde timeout medan körningen kan pågå fortfarande. Det utlöses inte heller av manuella testkörningar från Canvas.
### Workflow-timeout

Varje workflow kan ange en **workflow-timeout** i sekunder i panelen **Egenskaper** på workflow-nivå. `0` (standardvärdet) inaktiverar den. När den är angiven stoppas en körning som överskrider gränsen vid nästa nodgräns och registreras som en misslyckad körning med felet "timed out". Timeouten gäller för manuella körningar, API-körningar och trigger-baserade körningar. Långa [Wait](../nodes/wait-node.md)-noder avbryts omedelbart i stället för att blockera under hela sin varaktighet.

### Concurrency-gräns

Varje workflow kan begränsa hur många produktionskörningar som utförs samtidigt med **Concurrency-gräns** i panelen **Properties** på workflow-nivå; ägaren och medarbetare med redigeringsbehörighet kan ändra detta, och den är avstängd som standard. När gränsen nås väntar nya körningar från [webhook-](./webhooks.md#concurrency-limit-and-queued-runs) och [streaming-endpoints](./sse-streaming.md), [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) och varje [trigger](./triggers.md) i en FIFO-kö (först in, först ut), räknat över alla instanser i ett [kluster](./cluster.md). Editorns testkörningar, anrop till sub-workflows, [Evals](../tabs/evals-tab.md) och återupptagna granskningar köas aldrig, och kortkörningar på [Board](../tabs/board-tab.md), filuppladdningskörningar, körningar som startas av AI-assistentens run-workflow-verktyg och larmmeddelandeworkflows startar utan att vänta på en plats. Ett webhook-anrop som måste vänta får omedelbart `202 Accepted` med ett `execution_id`, en status-URL som svarar med samma autentiseringsuppgifter, dess position, köstorleken och antalet aktiva körningar; en MCP-klient får samma och pollar verktyget `heym_execution_status`. Det valfria valet **Max köstorlek** avvisar extra anrop med `429`, och valfri **Max väntetid** registrerar en körning som väntat för länge som `expired`. Väntande körningar visas i [Körningshistorik](./execution-history.md) som **Köad n/m** och kan avbrytas där.

### Sparad tid

Varje workflow kan registrera en **uppskattad sparad tid per körning** (i minuter), vilket anges i panelen **Egenskaper** på workflow-nivå. Fliken [Analytics](../tabs/analytics-tab.md) aggregerar detta över det valda intervallet som en total statistik för **Sparad tid** (summan av varje workflows uppskattning × dess lyckade körningar). Most Used listar även denna summa per workflow; **Not Set** öppnar uppskattningsfältet när det inte är angivet. Rapporten [Workflow-analys](./workflow-analysis.md) rekommenderar att en uppskattning anges när ingen är konfigurerad.

### [Inställningar](./user-settings.md)

Dialogrutan Inställningar (öppnas från avataren i sidhuvudet) har fyra flikar: Profil (Gravatar-bild, visningsnamn, användarregler), [Säkerhet](./security.md) (ändra lösenord), Röst ([ElevenLabs TTS/STT](./chat-voice.md)) och Observability (skrivskyddad [OpenTelemetry](./opentelemetry.md)-status). Användarregler är anpassade instruktioner som injiceras i varje AI-begäran, inklusive workflow-byggaren och [Chat](../tabs/chat-tab.md), så att språk, ton, kodstil eller workflow-konventioner kan anges en gång. Lösenordspolicy och hantering av [MCP](../tabs/mcp-tab.md) API-nycklar finns också tillgängliga.

Se även [Säkerhet](./security.md), [Chat-röst](./chat-voice.md), [OpenTelemetry-spårning](./opentelemetry.md) och [AI-assistent](./ai-assistant.md).

### [OpenTelemetry-spårning](./opentelemetry.md)

Heym kan generera OpenTelemetry-spår för varje workflow-körning och nodexekvering: en rotspan `heym.workflow.execute` per körning och en barnspan `heym.node.execute` per nod, med modell- och tokenanvändning kopplad till LLM- och agentnoder. Spans exporteras via OTLP/HTTP till valfri kompatibel backend (Jaeger, Grafana Tempo, Honeycomb, Datadog), och W3C trace context propageras över inkommande webhooks, utgående HTTP och sub-workflows. Spårning är inaktiverad som standard och konfigureras med `HEYM_OTEL_*` [miljövariabler](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md); den aktiva statusen visas i fliken Observability under [Inställningar](./user-settings.md).

Se även [Körningshistorik](./execution-history.md), [Spårningar](../tabs/traces-tab.md) och [Webhooks](./webhooks.md).

### [Ladda ner och importera](./download-import.md)

Exportera den aktuella workflowen som JSON från redigerarens verktygsfält (knappen Ladda ner); filen innehåller noder och kanter. Importera genom att dra en JSON-fil till fliken [Workflows](../tabs/workflows-tab.md) (skapar en ny workflow) eller till canvas (ersätter eller sammanfogar). JSON-filen måste innehålla en nodarray; namn och kanter är valfria. Använd det för säkerhetskopiering, delning eller migrering mellan instanser.

Se även [Workflow-struktur](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) och [Canvas-funktioner](./canvas-features.md).

### [Portal](./portal.md)

Portalen exponerar workflows som publika chattgränssnitt på `/chat/{slug}`. Konfigurera portal_enabled, slug, valfri autentisering (portalanvändare), streaming och filuppladdning per workflow. Slutanvändare interagerar via ett chattgränssnitt utan att logga in i Heym; bildutdata kan visas i chatten. Portal-workflows kan även överlämna till granskningssidor för [Human-in-the-Loop](./human-in-the-loop.md) när en [Agent-nod](../nodes/agent-node.md) kräver godkännande, medan agentens `review`-gren skickar aviseringar till andra kanaler. Använd det för interna verktyg, kundvända chatbotar och AI-drivna formulär.

Se även [Human-in-the-Loop](./human-in-the-loop.md), [Agent-nod](../nodes/agent-node.md) och [Drive](./drive.md).

### [Filgenerering](./file-generation.md)

Skills kan generera filer som PDF, DOCX, CSV, JSON och bilder under körning genom att skriva till arbetsytan `_OUTPUT_DIR`. Heym fångar automatiskt upp dessa filer, lagrar dem och exponerar nedladdningsmetadata under `_generated_files`, vilket sedan kan hanteras med [Drive-noden](../nodes/drive-node.md) eller granskas i fliken [Drive](../tabs/drive-tab.md).

Se även [Agent-nod](../nodes/agent-node.md), [Drive](./drive.md) och [Drive-nod](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive är lagrings- och delningslagret för filer som genereras av skills. Det gör det möjligt att bläddra bland filer, skapa publika eller lösenordsskyddade länkar, tillämpa utgångsdatum och nedladdningsgränser, dela filer skrivskyddat med team och hantera dessa filer programmatiskt med [Drive-noden](../nodes/drive-node.md) eller manuellt från fliken [Drive](../tabs/drive-tab.md).

Se även [Drive](../tabs/drive-tab.md), [Filgenerering](./file-generation.md) och [Portal](./portal.md).
### [Säkerhet](./security.md)

Heym tillämpar en lösenordspolicy (längd, versaler, gemener, siffror), lagrar åtkomsttoken i HttpOnly-cookies och roterar refresh-token vid användning. Hastighetsbegränsning gäller för inloggning, registrering och inloggning till [Portalen](./portal.md). [Autentiseringsuppgifter](./credentials.md) krypteras i vila med AES-256 (Fernet). MCP API-nyckel används för klientautentisering; innehållssäkerhet är tillgänglig via [Guardrails](./guardrails.md) på [LLM](../nodes/llm-node.md)- och [Agent-noder](../nodes/agent-node.md). [Execution Tokens](./execution-tokens.md) tillhandahåller per-workflow avgränsade JWT:er för externa anropare.

Se även [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portalen](./portal.md) och [Autentiseringsuppgifter](./credentials.md).

### [Single Sign-On](./sso.md)

Heym autentiserar användare mot valfri extern OpenID Connect-leverantör - Keycloak, Okta, Entra ID, Auth0, Google - konfigurerad vid körning från **Settings → SSO** av en instansadministratör som finns med i `HEYM_ADMIN_EMAILS`. Endast en issuer-URL och klientuppgifter anges; varje endpoint hämtas från leverantörens discovery-dokument, så ingen leverantör är hårdkodad. Inloggning använder Authorization Code med PKCE, och ID-token verifieras mot leverantörens publicerade nycklar. Konton mappas först via `(issuer, subject)` och därefter via verifierad e-post, med valfri automatisk etablering begränsad till en tillåten e-postdomänlista. Lösenordsinloggning finns kvar parallellt med SSO och kan stängas av när ett anslutningstest har godkänts, med konton i `HEYM_ADMIN_EMAILS` undantagna så att en felkonfigurerad leverantör inte kan låsa instansen.

Se även [Settings](./user-settings.md), [Säkerhet](./security.md) och [Audit Logging](./audit.md).

### [Lastfördelning](./cluster.md)

Peka en andra Heym-instans mot samma databas och den ansluter som en worker. Bakgrundskörningar - cron, webhooks, MCP-verktygsanrop, chat-triggers - delas mellan instanserna enligt en procentsats som en instansadministratör anger under **Settings → Instances**, med varje instans status, databaslatens och version i en tabell. Instanserna kommunicerar aldrig med varandra: Postgres bär arbetet, så en worker behöver ingen öppen port och ingen rutt tillbaka till huvudinstansen. Arbete som berör lokala filer, en arbetsyta för kodningsagenter eller ett installerat plugin körs alltid på huvudinstansen, och panelen rapporterar hur stor del av de senaste 24 timmarna det utgjorde, så en operatör kan se när procentsatser inte hjälper. Varje körning i historiken anger vilken instans som utförde den, och båda historikdialogerna kan filtrera på detta.

Se även [Settings](./user-settings.md), [Körningar](../tabs/traces-tab.md) och [Analys](../tabs/analytics-tab.md).

### [Tredjepartsintegrationer](./integrations.md)

Heym ansluter till externa tjänster via autentiseringsuppgifter som lagras i fliken [Autentiseringsuppgifter](../tabs/credentials-tab.md) (krypterade i vila). Typer som stöds inkluderar OpenAI, Google, Decision Model för [Decision-noden](../nodes/decision-node.md), Model Router för automatiskt modellval (se nedan), GitHub för [GitHub-noden](../nodes/github-node.md) och MCP-integrationer, Jira för [Jira-noden](../nodes/jira-node.md), Notion för [Notion-noden](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP för [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header och FlareSolverr för [Crawler](../nodes/crawler-node.md). Varje typ dokumenterar obligatoriska fält; autentiseringsuppgifter kan delas med användare eller [team](./teams.md) och refereras till med namn i noder eller som `$credentials.Name` i uttryck.

### Model Router (Auto Model)

En **Model Router**-autentiseringsuppgift väljer modell per begäran istället för att hålla en nyckel. Den
lagrar en autentiseringsuppgift för beslutsmodellen plus en lista över befintliga OpenAI/Google/Custom-
autentiseringsuppgifter, var och en med kriterier som anger när den ska användas, och visas i varje modell-
väljare med en enda modell som kallas **Auto**.

Körningar, Canvans körningslogg och Span View visar båda halvorna av valet, till
exempel `Auto Model / GPT-5`, medan kostnaden förblir hänförd till den modell som kördes. Auto
Model kan inte kombineras med Responses API, Batch-läge eller bildutdata. Se
[Autentiseringsuppgifter](./credentials.md) för det fullständiga beteendet.

Se även [Autentiseringsuppgifter](./credentials.md), [Delning av autentiseringsuppgifter](./credentials-sharing.md) och [Team](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blockerar osäkra eller oönskade användarmeddelanden innan de når en [LLM](../nodes/llm-node.md) eller [Agent-nod](../nodes/agent-node.md). Aktivera dem per nod och välj kategorier att blockera (t.ex. våld, hatpropaganda, sexuellt innehåll, självskada, trakasserier, olaglig aktivitet). Ange känslighet (låg, medel, hög). När de utlöses kastar noden ett fel som kan fångas med en [Error Handler](../nodes/error-handler-node.md). Detektering använder leverantörens moderation-API eller LLM-klassificering beroende på typ av autentiseringsuppgift.

Se även [Säkerhet](./security.md), [LLM](../nodes/llm-node.md), [Agent-nod](../nodes/agent-node.md) och [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise omfattar kommersiell licensiering, professionell support och driftsättningstjänster för team som kör Heym i produktion. Det inkluderar hjälp med workflow-arkitektur, onboarding, vägledning för Kubernetes och skalning, prioriterad support samt anpassad utveckling kring avancerade funktioner som [Agent-nod](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallell körning](./parallel-execution.md) och [Portal](./portal.md).

Se även [Körning och driftsättning](../getting-started/running-and-deployment.md), [Säkerhet](./security.md) och [Team](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work är ett andra gränssnitt för affärsteam ovanpå Heym. Användare beskriver ett jobb, svarar på några frågor och får en testad workflow, och arbetar sedan från sidor, godkännanden och en aktivitetslista där varje körning har ett namn. Instansadministratörer ansluter det under **Inställningar → Heym Work** med dess adress och en integrationsnyckel; det har en egen licens från Heym-teamet.

Se även [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) och [Human-in-the-Loop](./human-in-the-loop.md).

---

## Flikar i instrumentpanelen

### [Workflows](../tabs/workflows-tab.md)

Fliken Workflows är standardvyn i instrumentpanelen. Den visar en lista i två paneler: workflows och mappar som kompakta rader till vänster, och en förhandsvisning av den valda workflowen till höger med dess trigger, senaste körning och steg, samt Open Workflow och Run Now. Varje rad har en statusmarkering (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled) som listrutan Status kan filtrera på. En workflow utan trigger-nod märks utifrån hur dess senaste körning startades – API för ett HTTP-anrop, SubWorker för en överordnad workflow, Portal för dess publika chatt – och förblir Manual tills den har körts. Mappar och undermappar hanterar [organisering](./workflow-organization.md). Skapa workflows med New Workflow, dra och släpp JSON för att [importera](./download-import.md), och redigera eller ta bort via radåtgärderna. Workflows kan flyttas mellan mappar; borttagning schemaläggs (papperskorg) före permanent radering.

Se även [Workflow-organisering](./workflow-organization.md), [Nedladdning och import](./download-import.md) och [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

En agentisk kanban-tavla där kort är beständiga jobb. Konfigurera varje kolumn med en ordnad workflow-kedja; att flytta ett kort till kolumnen kör kedjan med kortets fullständiga kontext (innehåll, kommentarer, historik, tidigare utdata). Resultat skrivs tillbaka till kortet – grönt vid framgång, rött vid fel, gult medan det körs. Uppföljningsomgångar kör om den aktuella kolumnens kedja med allt som ackumulerats hittills, vilket möjliggör iterativ planering. Körningar registreras i [Körningshistorik](./execution-history.md) med trigger-källan `board`. Medan en kortkörning är aktiv öppnar **Open live** just den körningen på den animerade canvasen med inkrementella Debug-loggar.

Se även [Workflows](../tabs/workflows-tab.md), [Körningshistorik](./execution-history.md) och [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Mallar](../tabs/templates-tab.md)

Fliken Mallar gör det möjligt att spara och återanvända workflow-mallar (hela workflows) och nodmallar (enskilda konfigurerade noder). Skapa workflow-mallar från editorn (Share as Template) och nodmallar genom att högerklicka på en nod. Bläddra efter synlighet (Everyone eller specifika användare/[team](./teams.md)), tillämpa en mall för att skapa en ny workflow eller lägga till en nod på canvasen, och hantera delade mallar.

Se även [Workflows](../tabs/workflows-tab.md), [Team](./teams.md) och [Canvas-funktioner](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variabler](../tabs/global-variables-tab.md)

Fliken Variabler hanterar [Global Variable Store](./global-variables.md). Skapa, redigera och ta bort globala variabler; ange namn, värde och värdetyp (Auto, String, Number, Boolean, Array, Object). Variabler är användarscopade och består mellan körningar. Referera till dem i valfritt workflow-[uttryck](./expression-dsl.md) som `$global.variableName`. Variabler kan delas med andra användare eller [team](./teams.md).

Se även [Globala variabler](./global-variables.md), [Variable](../nodes/variable-node.md) och [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Fliken Chat är Heyms yta för långvariga agenter som används för att styra arbetsytan via konversation. Välj en [autentiseringsuppgift](./credentials.md) och modell, och be sedan Chat att besvara frågor, granska workflow-definitioner, köra befintliga workflows, sammanfatta körningar och scheman, rapportera körningshistoriken för ett enskilt workflow (antal körningar, statusfördelning, senaste körning samt detaljerna för en körning på begäran), rapportera vilka körningar som pågår just nu (med förfluten tid, aktuell nod och en länk till varje aktiv körning), hantera väntande mänskliga granskningar, skapa och revidera workflows med samma AI Builder-motor som används i editorn, eller lägga till kort på kanban-tavlor med naturligt språk. Nya kort hamnar alltid i den valda tavlans första kolumn; när flera tavlor är tillgängliga och ingen angavs presenterar Chat ett val av tavla innan kortet skapas.

Chat fortsätter att köras i backend efter att webbläsaren stängs. Medan ett svar streamas går det att skicka fler meddelanden; Heym lagrar dem i en databasbaserad kö, låter meddelanden i kön redigeras eller tas bort innan de startar och kör dem i ordning när det aktuella svaret är klart. Om assistenten behöver planeringsdetaljer och returnerar förtydligandefrågor pausas kön tills dessa frågor har besvarats, och återupptas sedan efter planeringssvaret.

Svar streamas med markdown, inbäddade bilder, förhandsgranskningskort för workflows, ihopfällbara kort för verktygsanrop, kontextanvändning och automatisk kontextkomprimering. Chat stöder bilagor, röstinmatning, uppläsning, kopieringsåtgärder, snabba prompts, användarregler från [Settings](./user-settings.md) och [globala variabler](./global-variables.md) som kontext.

Se även [AI Assistant](./ai-assistant.md), [Autentiseringsuppgifter](./credentials.md) och [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

### [Autentiseringsuppgifter](../tabs/credentials-tab.md)

Fliken Autentiseringsuppgifter hanterar API-nycklar och hemligheter som används av noder. Lägg till autentiseringsuppgifter efter typ (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere med flera), namnge dem och referera till dem i workflow-noder. Redigera eller ta bort från kortet; dela med användare via e-post eller med [team](./teams.md). Alla värden är krypterade i vila och maskerade i gränssnittet.

Se även [Autentiseringsuppgifter](./credentials.md), [Credentials Sharing](./credentials-sharing.md) och [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

### [Vektorlager](../tabs/vectorstores-tab.md)

Fliken Vektorlager hanterar vektorlager som används av [RAG](../nodes/rag-node.md)-noder. Skapa ett lager med ett namn och en autentiseringsuppgift för vektorlagret — *RAG: Qdrant + OpenAI* (extern Qdrant) eller *RAG: Psql + OpenAI* (Heyms egen Postgres via pgvector), vilket fastställer lagrets backend — ange valfritt ett samlingsnamn och ladda sedan upp dokument (PDF, TXT med mera). Hantera innehåll (visa, ta bort källor), redigera lagerdetaljer och dela lager med användare. I en [RAG](../nodes/rag-node.md)-nod väljs databasen, vektorlagret väljs och åtgärderna insert, upsert, delete eller search körs.

Se även [Qdrant RAG](../nodes/rag-node.md), [Autentiseringsuppgifter](./credentials.md) och [Team](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>
### [MCP](../tabs/mcp-tab.md)

Fliken MCP konfigurerar integreringen av Model Context Protocol. Heym stöder två lägen:

**Standardserver** – En enda endpoint på `/api/mcp/sse` exponerar alla MCP-aktiverade workflows. Visa och återskapa API-nyckeln, kopiera färdig client-JSON, anslut Cursor med ett klick, eller följ Claude-installationsflödet med automatisk OAuth-registrering.

**Namngivna servrar** – Skapa flera isolerade MCP-endpoints, var och en med sin egen UUID-baserade URL (`/api/mcp/servers/{uuid}/sse`) och oberoende API-nyckel. Tilldela specifika workflows till varje server så att olika AI-klienter eller team endast ser de verktyg de behöver. Varje namngiven server stöder samma autentiseringsmetoder (API-nyckel, Claude OAuth) och har egna genvägar för Copy JSON och Add to Cursor. Båda typerna av endpoint stöder SSE-transport (GET) och Streamable HTTP-transport (POST). När en workflow slås av eller på inuti en namngiven server flyttas den högst upp i den tilldelade listan så att den ändrade raden förblir synlig.

**Heym chat-verktyg** – Båda lägena kan även exponera [Chat](../tabs/chat-tab.md)-motorn som ett enda `heym_chat`-verktyg, vilket slås av eller på per yta med egna LLM-autentiseringsuppgifter och egen modell (förifylld från den föredragna modellen i [Settings](./user-settings.md)). En MCP-klient skickar ett enda `message` i naturligt språk och motorn gör resten: bygger workflows i byggläge (spara, testkör upp till fem gånger, åtgärda och verifiera), kör workflows, analys, körningar, status för pågående körningar, scheman, boards och kort, team, globala variabler, dokumentsökning och beslut med människa i loopen. Funktioner som senare läggs till i Chat nås via samma verktyg utan ytterligare registrering. Varje anrop lagras i Chat-flikens historik som en konversation markerad med en kontakt och returnerar ett `conversation_id` som klienten kan skicka tillbaka för att fortsätta tråden.

Se även [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) och [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

Fliken Traces visar körningsspår för [LLM](../nodes/llm-node.md). En statistikrubrik ovanför listan sammanfattar det valda tidsintervallet med KPI-kort (Calls, Tokens, Cost, Avg Latency, Error %) och tre diagram — Tokens by Model, Cost by Model och Calls Over Time (staplad lyckade vs misslyckade). En enda **Time range**-väljare (1h / 24h / 7d / 30d / All; standard 7 dagar) filtrerar både diagrammen och listan tillsammans. Kostnad beräknas från den per användare gällande [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table); modeller utan prissättning visas som en inline-varning som länkar till den. Öppna valfritt spår för att se request- och response-payloads, tidsuppdelning (llm_ms, tools_ms, mcp_list_ms), verktygsanrop (namn, argument, resultat) och inkluderade skills. Utökade händelser visar JSON — inklusive MCP- och JSON-RPC-payloads — som ett kollapsbart träd med första nivån öppen som standard; **Tree / Raw** växlar tillbaka till originaltexten och felaktig JSON förblir läsbar. Använd traces för att felsöka beteendet hos [Agent Node](../nodes/agent-node.md) och [LLM](../nodes/llm-node.md) samt för att kopiera eller exportera payloads.

Se även [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) och [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Varningar](../tabs/alerts-tab.md)

Fliken Varningar definierar tröskelvillkor över ett tidsfönster och meddelar när dessa passeras. Fyra varningstyper täcker de frågor operatörer faktiskt ställer: **feltröskel** (misslyckades detta fler än N gånger inom fönstret), **workflow-varaktighet** (blev körningarna långsammare, mätt som max, genomsnitt eller p95), **token-/USD-kostnad** (överskred utgifterna en budget, beräknad via samma pristabell som [Körningar](../tabs/traces-tab.md)) samt **antal körningar** (kördes detta långt oftare än det borde). Varje typ bedöms över ett valt fönster, aldrig utifrån en enskild händelse, eftersom en misslyckad körning är brus medan en anstormning är en incident. Varningar bevakar en workflow eller samtliga workflows som är åtkomliga.

En guide i fem steg leder genom typ, omfattning, villkor, åtgärd och granskning. Granskningssteget **backtestar** villkoret först och rapporterar hur ofta det skulle ha utlösts under de senaste 24 timmarna till 7 dagarna, så att en tröskel som är alldeles för låg upptäcks innan den sparas snarare än efter att den larmat någon. Beskriv önskemålet i klartext och AI fyller i varje steg den kan, med sina antaganden markerade; en ofullständig begäran förflyttar ändå guiden framåt och öppnas på det första steg som fortfarande kräver ett beslut, i stället för att börja om från början. Som standard utlöses en varning en gång och förblir tyst tills mätvärdet återhämtar sig; alternativt kan den upprepas med ett intervall.

I åtgärdssteget kan en varning skapa och tilldela en ny workflow som körs när den utlöses, använda en befintlig workflow eller inte göra något. Den utlösande payloaden innehåller det observerade värdet, tröskeln, fönstret och de workflows som bidrog till siffran, vilket är hur varningar når Slack, e-post eller Telegram med hjälp av befintliga noder. Utlösningshistorik registrerar vad som gällde i det ögonblick varje varning utlöstes och sparas i 90 dagar; att kvittera en utlösning ändrar märket från Firing till Acknowledged utan att låtsas som att villkoret har upphört. Fliken [Chat](../tabs/chat-tab.md) kan svara på vilka varningar som finns och varför eller när en utlöstes. Varningar kan delas med användare och [team](../tabs/teams-tab.md).

Se även [Analys](../tabs/analytics-tab.md), [Körningar](../tabs/traces-tab.md) och [Körningshistorik](./execution-history.md).

### [Analys](../tabs/analytics-tab.md)

Fliken Analys visar körningsmätvärden och trender. Sammanfattande statistik omfattar totalt antal körningar, framgångsgrad, felfrekvens, latensuppdelningar och total **Time Saved** (summan av varje workflows uppskattade sparade minuter per körning × dess lyckade körningar). Most Used listar samma summa per workflow. Välj ett baserat tidsintervall (24h, 7d, 30d eller allt), filtrera valfritt på workflow och dra sedan över valfritt diagram för att borra ned i ett valt datumintervall. Diagram och workflow-tabeller uppdateras efter valet, och automatisk uppdatering håller mätvärdena aktuella. Det kompletterar [Körningshistorik](./execution-history.md) och vyn [Scheman](../tabs/scheduled-tab.md) när både tidigare resultat och kommande körningar behövs.

Se även [Körningshistorik](./execution-history.md), [Scheman](../tabs/scheduled-tab.md) och [Utvärdering](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

### [Instrumentpanel](../tabs/dashboard-tab.md)

Fliken Instrumentpanel är ett Grafana-liknande utrymme där rutnät av diagramwidgetar byggs, var och en renderad från sin egen dolda Heym-workflow. Så många instrumentpaneler som behövs kan hållas och var och en delas med användare eller team, skrivskyddat eller redigerbart; widgetar körs alltid med ägarens autentiseringsuppgifter, så alla ser samma data. Beskriv ett mätvärde i klartext och AI genererar widgeten, eller lägg till en manuellt och välj en diagramtyp, förhandsgranskad med exempeldata: stapel, linje, area, cirkel, tabell, numerisk, mätare, punktdiagram, proportion, stapelmätare, text eller HITL. HITL är en karusell över väntande mänskliga granskningar. Rubriken visar `1/n pending`. Workflow-namnet öppnar den körningen på canvas. **Approve**, **Request changes** och **Reject** löser den, och historikikonen bredvid widgettiteln öppnar den körningen i historikdialogen på samma sida. Widgetar cachar sina resultat, kan finjusteras med AI (varje ändring sparas i [Redigeringshistorik](./edit-history.md)), klonas tillsammans med sin kompletta workflow, ordnas om med Tidy up och dras eller ändras storlek på i redigeringsläge. Tabeller kan visa statusbrickor och länka sina rader till en detaljpanel som läser den klickade radens post som `$page.record`, och en Run-widget kör en workflow från panelen: på en släppt fil, med sina inmatningsfält eller med en Kör-knapp. Eftersom varje widget är en workflow kan vilken data som helst som går att hämta — ett [HTTP](../nodes/http-node.md)-anrop, en [BigQuery](../nodes/bigquery-node.md)-fråga, en [RAG](../nodes/rag-node.md)-uppslagning eller [LLM](../nodes/llm-node.md)-utdata — bli ett diagram. Inställningarna för en HITL-widget kan begränsa den till granskningar för ett enskilt arbetsflöde, eller till ett agent- eller Slack-godkännandesteg i det; en sådan widget visar dem för alla som kan öppna det arbetsflödet och är dold för alla som inte kan. [Chat](../tabs/chat-tab.md) och MCP-verktyget `heym_chat` listar dina instrumentpaneler med deras widgetar, anger vilken instrumentpanel ett arbetsflöde finns på, lägger till en ny widget (först en tom widget vars arbetsflöde Chat sedan bygger och testar), placerar ett befintligt arbetsflöde som en widget på en instrumentpanel, byter namn på eller tar bort widgetar och snyggar till layouten precis som knappen Snygga till gör.

Se även [Noden Chart Output](../nodes/chart-output-node.md), [Analys](../tabs/analytics-tab.md) och [Körningshistorik](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>
### [Utvärdering](../tabs/evals-tab.md)

Fliken Utvärdering (på `/evals`) gör det möjligt att skapa utvärderingssviter, lägga till eller generera testfall, optimera svitens prompt och köra utvärderingar mot [Agent-nodens](../nodes/agent-node.md) workflows. Välj en eller flera modeller, välj en poängsättningsmetod (Exact Match, Contains eller LLM-as-Judge), låt valfritt en separat modell eller en [Beslutsnod](../nodes/decision-node.md) bedöma LLM-as-Judge-svar, ange antal körningar per test (samt temperature och reasoning effort för Exact Match och Contains) och jämför sedan godkänd/underkänd samt utdata per modell. Granska körningshistorik för tidigare utvärderingar, inklusive vilken domare varje körning använde, kör om en med samma domare, exportera den som JSON och verifiera det underliggande beteendet i [Körningar](../tabs/traces-tab.md).

En **agentsvit** kontrollerar istället en enskild agentnod: den visar agentens baslinjelatens, USD-kostnad, tokens och verktygsanrop från dess verkliga körningar, låter dig markera varje verktyg, MCP-verktyg, underagent, underarbetsflöde eller färdighet som något agenten måste eller inte får anropa, sätter övre gränser 20 % över baslinjen, kör arbetsflödet ett valt antal gånger med indata från senaste körningen eller AI-skrivna indata, och poängsätter varje körning med orsaken till att den misslyckades. Svitväljaren listar båda typerna med deras typ och är sökbar, och rapporten [Workflow Analysis](./workflow-analysis.md) föreslår en svit för arbetsflöden med agent- eller LLM-noder.

Se även [Agent-noden](../nodes/agent-node.md), [Körningar](../tabs/traces-tab.md) och [Körningshistorik](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

### [Team](../tabs/teams-tab.md)

Fliken Team gör det möjligt att skapa och hantera team. Skapa ett team, lägg till medlemmar via e-post och ta bort medlemmar (skaparen kan inte tas bort). Dela [workflows](../tabs/workflows-tab.md), [mallar](../tabs/templates-tab.md), [autentiseringsuppgifter](../tabs/credentials-tab.md), [variabler](../tabs/global-variables-tab.md), [vektorlager](../tabs/vectorstores-tab.md) och [Drive-filer](../tabs/drive-tab.md) med team via respektive delningsdialog; alla teammedlemmar får åtkomst. Redigera teamets namn och beskrivning eller ta bort teamet (tar bort alla teamdelningar).

Se även [Team](./teams.md), [Delning av autentiseringsuppgifter](./credentials-sharing.md) och [Workflow-organisering](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

### [Scheman](../tabs/scheduled-tab.md)

Fliken Scheman visar alla aktiva [Cron](../nodes/cron-node.md)-workflows i en visuell kalender. Växla mellan dag-, vecko- och månadsvyer för att se när automatiseringarna är schemalagda att köras och gå sedan tillbaka till den relaterade [workflowen](../tabs/workflows-tab.md) när schemat behöver redigeras.

Se även [Cron](../nodes/cron-node.md), [Analys](../tabs/analytics-tab.md) och [Körningshistorik](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>

### [Loggar](../tabs/logs-tab.md)

Fliken Loggar visar Docker-containerloggar för Heym-stacken (backend, frontend, PostgreSQL). Välj container/containrar, filtrera efter loggnivå (All, INFO, WARNING, ERROR, DEBUG) och sök i loggarna. Använd den för felsökning. För workflow-körningsloggar (nodresultat, utdata), använd [Körningshistorik](./execution-history.md), [Körningar](../tabs/traces-tab.md) eller Debug-panelen i editorn i stället.

Se även [Körningshistorik](./execution-history.md), [Körningar](../tabs/traces-tab.md) och [Canvas-funktioner](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

### [Datatabell](../tabs/datatable-tab.md)

Fliken Datatabell gör det möjligt att skapa och hantera strukturerade datatabeller i Heym. Definiera typade kolumner (string, number, boolean, date, JSON), hantera rader med inline-redigering via dubbelklick, importera/exportera CSV och dela tabeller med användare eller [team](./teams.md) med läs-/skrivbehörighet. Använd [Datatabell-noden](../nodes/datatable-node.md) för att komma åt tabeller programmatiskt i workflows. En fäst sektion för **Systemtabeller** högst upp innehåller **LLM-kostnadstabellen**: en vy med fast schema över prissättning per modell som fylls på från Helicone i bakgrunden (24-timmars TTL, manuell uppdatering), där varje användare kan åsidosätta priser eller lägga till anpassade rader för modeller som Helicone inte listar. Dessa prissättningsregler styr kostnads-KPI:n och diagrammet över kostnad per modell på fliken [Körningar](../tabs/traces-tab.md).

Se även [Datatabell-noden](../nodes/datatable-node.md), [Körningar](../tabs/traces-tab.md), [Workflow-struktur](./workflow-structure.md) och [Team](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>
### [Drive](../tabs/drive-tab.md)

Fliken Drive visar alla filer som genereras av skills i samtliga workflows. Varje fil listas med namn, typ, storlek, källnod, skapandedatum och status för teamdelning, och fliken tillhandahåller sökning, autentiserad nedladdning, delning, borttagning samt pagineringskontroller. Det är dashboardens motsvarighet till [File Generation](./file-generation.md), referensen [Drive](./drive.md) och [Drive-noden](../nodes/drive-node.md).

Se även [Drive](./drive.md), [File Generation](./file-generation.md) och [Drive-noden](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Watch Drive demo</a></p>

### [Canvas-samarbete](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
