# Hvorfor Heym

Heym er infrastruktur til at køre og styre AI-agenter i produktion. Én selvhostet runtime dækker alle faser af agentens livscyklus.

En prototype-agent har brug for en model, en prompt og et par værktøjer. En produktionsagent har derudover brug for triggere og genforsøg, gemt tilstand når den pauses for en person, en registrering af hvert model- og værktøjskald, en omkostning for hver kørsel, tests før en ændring udrulles, og klare grænser for hvad den må gøre på egen hånd. Heym samler alt dette ét sted, så det system der designes på canvas'et, er det system der kører. Byg agentiske systemer, og kør dem derefter med tillid.

## Én Runtime til Agentens Livscyklus

| Fase | Hvad Heym giver |
|---|---|
| **Byg** | Komponér agenter og deterministiske trin på canvas'et, generér dem med [AI Assistant](../reference/ai-assistant.md), eller start fra [Templates](../tabs/templates-tab.md) og portable skills. |
| **Orkestrér** | Koordinér agenter, [sub-agenter](../reference/agent-architecture.md), coding agents, RAG, browserautomatisering og værktøjer med eksplicit dataflow og [parallel eksekvering](../reference/parallel-execution.md). |
| **Kør** | Start kørsler fra [webhooks](../reference/webhooks.md), tidsplaner og event-[triggere](../reference/triggers.md), med genforsøg pr. node, [fejlhåndtering](../nodes/error-handler-node.md) og [load distribution](../reference/cluster.md) på tværs af instanser. |
| **Observer** | Inspicér hver eksekvering gennem [historik](../reference/execution-history.md), [LLM-traces](../tabs/traces-tab.md), USD-omkostning pr. kørsel, live-kørsler på canvas'et, [analytics](../tabs/analytics-tab.md), [alarmer](../tabs/alerts-tab.md) og [OpenTelemetry](../reference/opentelemetry.md)-eksport. |
| **Evaluer** | Test prompts og modeller mod forventede outputs i [Evals](../tabs/evals-tab.md), med LLM-as-Judge-scoring og side-om-side-sammenligning af modeller. |
| **Styr** | Hold mennesker i kontrol med [review-checkpoints](../reference/human-in-the-loop.md) og [guardrails](../reference/guardrails.md), og styr adgang med krypterede [credentials](../reference/credentials.md), [teams](../reference/teams.md), [single sign-on](../reference/sso.md) og et [audit trail](../reference/audit.md). |
| **Eksponér** | Servér workflows over REST og [SSE](../reference/sse-streaming.md), som [MCP](../tabs/mcp-tab.md)-værktøjer, som [Portal](../reference/portal.md)-chat-UIs og som [dashboard](../tabs/dashboard-tab.md)-widgets. |

## Byg

### AI Assistant: Byg Workflows med Naturligt Sprog

[AI Assistant](../reference/ai-assistant.md) er et chatpanel inde i workflow-editoren. Beskriv hvad der ønskes, for eksempel "opret et workflow der tager brugerinput, søger i min vidensbase og svarer ved hjælp af GPT-4o", og assistenten genererer noder og kanter, der straks anvendes på canvas'et.

- Bruger egen LLM-credential (enhver understøttet model)
- Understøtter **stemmeinput** til håndfri workflow-design
- Anvender automatisk gyldig workflow-JSON fra AI-svaret på canvas'et
- Streamer svar i realtid

Assistenten arbejder direkte inde i editoren og streamer noder onto canvas'et i realtid, og alt hvad den genererer, forbliver redigerbart som noder placeret manuelt.

### Skills-system

Skills er portable kapabilitetspakker, en `SKILL.md`-instruktionsfil plus valgfrie Python-scripts, der kan placeres på enhver Agent-node.

- Skill'ens instruktioner tilføjes foran agentens system prompt
- Python-filer i skill'en bliver kaldbare værktøjer
- Skills kan genbruges på tværs af workflows og deles som `.zip`-arkiver

Dette svarer til at give agenten en jobbeskrivelse og en værktøjskasse i ét drop.

### Workflow Analyzer: Kørselsbevidst Feedback

Panelet [Workflow Analysis](../reference/workflow-analysis.md) er et kørselsbevidst dokumentations- og feedbackværktøj indbygget i editoren. Klik på **Analyze**, vælg en LLM-credential og model, og Heym genererer en redigerbar Markdown-rapport for det aktuelle workflow.

I modsætning til en statisk note kører analyzøren først workflowet når det er muligt, og inkluderer eksekveringsresultatet i prompten. Rapporten dækker forbedringsområder, workflowets formål og en trinvis forklaring af hvad noderne gør. Når en rapport allerede findes, streamer **Reanalyze** en separat forhåndsvisning, så den nye version kan accepteres eller det aktuelle delte dokument bevares.

## Orkestrér
### Indbyggede LLM- og agent-noder

Heyms [Agent-node](../nodes/agent-node.md) kører en tæt integreret værktøjskaldende løkke med inline Python-værktøjer, MCP-forbindelser og et portabelt skills-system, alt designet til produktionsagenter.

Heyms almindelige [LLM-node](../nodes/llm-node.md) går også ud over et enkelt prompt-respons-trin. For understøttede OpenAI- og OpenAI-kompatible endpoints kan den skifte til **Batch API-tilstand**, så én node indsender et array af prompts i en billigere udbydernative batch-anmodning. Canvas'en eksponerer derefter en dedikeret `batchStatus`-gren, der udløses, efterhånden som batchen bevæger sig gennem tilstande som `pending`, `processing` og `completed`.

Det betyder, at LLM-noden kan udføre to ting på én gang:

- Køre den primære batch-anmodning og returnere de endelige per-element-outputs på den normale gren
- Udløse notifikations- eller logningslogik ved hver meningsfuld batch-statusopdatering uden at gøre flowet til en brugerdefineret polling-løkke

Batch-eksekvering er en førsteklasses LLM-workflow-primitiv med kontrol af udbyder- og modelkapaciteter i node-UI'en.

**Agent-noden** er kernen i agent-orkestrering i Heym:

- **Tool calling** – Agenten itererer over værktøjskald i en løkke, indtil den producerer et endeligt svar
- **Python-værktøjer** – Definer brugerdefinerede værktøjer inline med fuld Python; agenten kalder dem ved runtime
- **MCP-forbindelser** – Forbind til enhver [Model Context Protocol](https://modelcontextprotocol.io/)-server (stdio eller SSE), og agenten får automatisk alle dens værktøjer
- **Skills** – Slip en `.zip`- eller `.md`-fil ind på en agent for at udvide dens systemkontekst og tilføje Python-værktøjer
- **Sub-workflow-kald** – Agenten kan kalde andre Heym-workflows som værktøjer og komponere kompleks adfærd uden brugerdefineret kode

Se [Agent-node](../nodes/agent-node.md) og [Agent-arkitektur](../reference/agent-architecture.md) for den fulde reference.

### Multi-agent-orkestrering

Heym understøtter et **orchestrator-mønster** med førsteklasses visuelle primitiver:

- Én agent fungerer som **orchestrator** (`isOrchestrator: true`) og får et `call_sub_agent`-værktøj
- Den delegerer opgaver til navngivne **sub-agenter** på samme canvas
- Sub-agenter kan selv kalde andre agenter eller sub-workflows (maks. dybde: 5)
- **Parallel eksekvering**: Når orchestratoren kalder flere sub-agenter i én tur, kører de parallelt for hurtigere resultater

Dette muliggør arkitekturer som en planlægningsagent, der ruter arbejde til en researcher, en coder og en summarizer, alt sammen visuelt forbundet uden brugerdefineret orkestreringskode.

Se [Agent-arkitektur](../reference/agent-architecture.md) for eksekveringsdetaljer.

### Coding-agenter som workflow-noder

Heym leverer to noder, der kører en rigtig coding-agent som et workflow-trin, ikke en chat completion:

- **[Codex-node](../nodes/codex-node.md)** – Kører OpenAI Codex CLI i et isoleret Heym-workspace mod et GitHub-repository. Understøtter **Sign in with ChatGPT** (PKCE OAuth på Plus/Pro-abonnementet, ingen per-token API-omkostning) eller et access token, kloner repoet, lader Codex redigere kode og returnerer `summary`, `diff`, `changedFiles` og en draft `pullRequestUrl`.
- **[OpenCode Go-node](../nodes/opencode-go-node.md)** – Samme repository-workflow gennem den udbyderagnostiske OpenCode-gateway (Kimi, DeepSeek, Qwen og flere), eksekveret i en **hærdet engangscontainer**: alle capabilities droppet, read-only root, pid-/hukommelses-/CPU-grænser. GitHub-tokenet forbliver uden for sandboxen: Heym udfører enhver git- og GitHub-operation host-side, så genereret kode ikke kan eksfiltrere push-legitimationsoplysninger.

Det betyder, at et workflow kan triagere en bug fra en webhook, overdrage repoet til en coding-agent, vente på draft-PR'en og poste linket til Slack, fuldt automatiseret, med ressourcegrænser konfigurerbare per deployment.

### Indbygget RAG-pipeline

Heym inkluderer en [RAG / Vector Store-node](../nodes/rag-node.md) og en administreret [Vectorstores](../tabs/vectorstores-tab.md)-fane. Det er muligt at:

- Vælge vector-backend: **Qdrant** (ekstern server) eller **Postgres (pgvector)**, som gemmer vektorer i Heyms egen database uden ekstra tjenester at køre
- Indsætte dokumenter i et vector store direkte fra en workflow-node
- Udføre semantisk søgning og føde resultater ind i en LLM- eller Agent-node
- Referere til resultater med udtryk som `$ragNode.results.map("item.payload.content").join("\n\n")`

I Heym er RAG to noder med fuld kontrol over embeddings og retrieval.

### Browser-automatisering med Playwright

[Playwright-noden](../nodes/playwright-node.md) er first-party browser-automatisering på canvas'en.

- **Steps-tilstand** – Komponer navigate, click, type, fill, screenshot, extract og scroll-handlinger visuelt
- **AI-steps med auto-heal** – Beskriv en handling i naturligt sprog, og en LLM genererer Playwright-handlingerne; fejlede selectors kan heales automatisk, og genererede steps kan caches for at springe fremtidige LLM-kald over
- **Run Code-tilstand** – Skift noden til fuld Playwright Python for komplekse flows (deaktiveret som standard; kører i Heyms hærdede sandbox, når det aktiveres)
- **Autentificerede sessioner** – Gendan cookies/`storageState` før kørsel, verificer login med et selector-tjek, og fald tilbage til scriptede login-steps
- **Network capture** – Indsaml eventuelt JSON-responses, headers, cookies og browser-lagring sammen med resultater

Heym behandler browseren som en normal node med samme udtryk, credentials og fejlhåndtering som alt andet.
### Expression DSL

Heyms [Expression DSL](../reference/expression-dsl.md) tilbyder en ren og kraftfuld syntaks til at referere til data fra opstrøms noder:

- `$input.text` – Input-node-data
- `$nodeName.field` – Enhver opstrøms-nodes outputfelt
- `$global.variableName` – Vedvarende globale variabler
- Array-hjælpere: `.first()`, `.map("field")`, `.join("\n")`

Udtryk fungerer i alle strengfelter, herunder prompts, HTTP-headere, betingelser og sætværdier, så data flyttes eksplicit mellem trin. DSL'en balancerer kraft og læsbarhed uden at kræve fuld JavaScript-viden.

## Run

### Triggers, Retries og Error Paths

En workflow kan starte fra mange steder. [Input](../nodes/input-node.md)-noder modtager HTTP-[webhooks](../reference/webhooks.md), [Cron](../nodes/cron-node.md) kører efter en tidsplan, og event-[triggers](../reference/triggers.md) starter kørsler fra Telegram, Discord, Slack, IMAP-indbakker, WebSocket-streams, RabbitMQ-køer, filuploads og Heym-platformshændelser.

Fejl håndteres inde i grafen. Enhver node kan genforsøge ved fejl med et fastsat antal forsøg og en ventetid mellem dem, hvert forsøg registreres i [execution history](../reference/execution-history.md), og en [Error Handler](../nodes/error-handler-node.md)-node kører automatisk, når en node fejler, så gendannelse er en del af selve workflowen.

### Parallel DAG Execution

Heyms workflow-eksekvering bruger en directed acyclic graph (DAG)-scheduler. Uafhængige noder kører automatisk parallelt uden behov for konfiguration.

- Noder på samme afhængighedsniveau sendes samtidigt til en thread pool (`max_workers=8`)
- Så snart en node afsluttes, planlægges dens nedstrøms noder
- [Merge Node](../nodes/merge-node.md) kombinerer resultater fra parallelle grene
- Flere workflow-kørsler udføres samtidigt; hver kørsel er fuldt isoleret

Parallelisme er standardadfærden, bestemt af grafstrukturen.

Se [Parallel Execution](../reference/parallel-execution.md).

### Scale Across Instances

Peg en anden Heym-instans mod den samme PostgreSQL-database, og den tilmelder sig som worker. Baggrundskørsler deles mellem instanser efter vægte, der angives, én valgt leader holder tidsplaner, alarmevaluering og crash recovery kørende gennem et failover, og hver kørsel registrerer den instans, der udførte den. Se [Load Distribution](../reference/cluster.md).

### Agentic Kanban Board

[Board-fanen](../tabs/board-tab.md) er et indbygget Kanban-board, hvor kolonnerne selv udfører workflows. Et kort er et vedvarende agentic-job, der bærer kontekst, samtalehistorik, eksekveringstilstand, outputs og workflow-kørsler.

- **Column workflow chains** – Flytning af et kort ind i en kolonne udløser kolonnens workflow-kæde; en **Agentic Kanban Model** (egen credential + model) mapper kortindhold til workflow-inputs og omdanner outputs tilbage til læsbar tekst
- **Card attachments** – Slip filer på et kort; dokumenter udtrækkes til tekst, og billeder sendes til vision-kapable modeller før hver kørsel
- **Live run canvas** – Åbn den aktive kørsel inde i et kort og følg den udføre på det rigtige workflow-canvas, node for node
- **Team sharing** – Del boards med brugere eller teams med læse-/skriverettigheder; kæder på delte boards kører med ejerens credentials, så samarbejdspartnere aldrig behøver egne
- **Failure visibility** – Fejlede kort viser en fejlhistorik-indikator, og opfølgende kørsler kan pause for at afvente kommentarer

Boardet er en native overflade på platformen: kort, workflows, credentials og live-kørsler findes alle på ét sted.

### Heym Drive: Built-In File Storage

[Drive-fanen](../tabs/drive-tab.md) er et fillager indbygget i platformen. Filer genereret af skills og workflows (PDF, DOCX, CSV, billeder) lander der automatisk, og board-kortvedhæftninger gemmes også der.

- **Share links** – Offentlige eller adgangskodebeskyttede (Basic Auth) downloadlinks med valgfri udløb og maksimale downloadgrænser
- **Team sharing** – Del filer skrivebeskyttet med teams, og fjern alle team-delinger i én handling
- **Bulk actions** – Multivælg med shift-klik-intervaller, saml valg i én ZIP-download, eller anvend én delings-/adgangskode-/sletteindstilling på mange filer på én gang
- **Agent access** – Skills kan tilvælge at læse Drive-filer, så en agent kan arbejde over dokumenter, som andre workflows eller brugere har produceret

Genererede artefakter får et permanent, delbart hjem inde i platformen.

## Observe

### LLM Traces

[Traces-fanen](../tabs/traces-tab.md) giver fuld observerbarhed for hvert LLM-kald:

- Request- og response-payloads
- Timing pr. kald: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Tool call-navne, argumenter og resultater
- Skills sendt til modellen

Trace-systemet er specialbygget til fejlfinding af agentic-adfærd, med fulde request- og response-payloads og timing pr. kald.
### LLM Token-omkostningssporing

Hvert LLM-kald i Heym tildeles automatisk en omkostning. [Traces-fanen](../tabs/traces-tab.md) viser input- og output-tokenantal pr. trace sammen med en realtids-USD-omkostning, der er udledt af en synkroniseret prisningstabel.

- **Omkostning pr. trace** – Input-tokens, output-tokens og samlet USD vises på hver trace-række
- **Omkostningsanalyse** – KPI-kort og et omkostningsdiagram pr. model opdateres med det valgte tidsinterval (1t / 24t / 7d / 30d / Alle)
- **LLM-omkostningstabel** – En systemtabel i [DataTable-fanen](../tabs/datatable-tab.md) fyldes fra Helicone hver 24. time; priser kan tilsidesættes, eller der kan tilføjes brugerdefinerede rækker for modeller, der endnu ikke er angivet
- **Advarsel om manglende pris** – Traces for modeller uden en prispost viser en inline-advarsel med et direkte link til omkostningstabellen

Hver eksekvering bærer sin egen USD-omkostning, opdelt pr. model.

### Åbn produktionskørsler på et live-canvas

En produktionsworkflow forbliver inspicerbar, efter den starter uden for editoren. Åbn en vilkårlig **Running**-post fra en af History-dialogerne, eller åbn den aktive kørsel inde i et Agentic Kanban-kort, og Heym knytter den normale workflow-editor til netop den eksekvering.

- Noder, der allerede er afsluttet, vises med deres resultater med det samme
- Den aktuelle node og efterfølgende ventende noder fortsætter med at pulse, efterhånden som eksekveringen skrider frem
- Debug-panelet modtager de samme inkrementelle node-resultater som en canvas-startet kørsel
- Det endelige output og eksekverings-highlights ankommer uden polling eller start af en duplikeret kørsel
- Lukning af editoren afbryder kun observatøren; den annullerer aldrig produktionsworkflowet

Observatøren bruger SSE understøttet af et cross-worker-eksekveringssnapshot, så den fungerer for webhook-, schedule-, chat-, MCP-, integration- og Board-triggers, selv når en anden backend-worker ejer kørslen.

### OpenTelemetry, Analytics og Alerts

Heym udsender [OpenTelemetry](../reference/opentelemetry.md)-spans for hver workflow-kørsel, node-eksekvering og Agent-værktøjskald, eksporteret via OTLP/HTTP til Jaeger, Grafana Tempo, Honeycomb, Datadog eller en hvilken som helst anden kompatibel backend.

Fanen [Analytics](../tabs/analytics-tab.md) sporer antal kørsler, succesrate, varighed og tendenser pr. workflow. [Alerts](../tabs/alerts-tab.md) overvåger fejlantaler, kørselsvarighed, token- eller USD-forbrug og eksekveringsvolumen over et tidsvindue og kører derefter et valgfrit notify-workflow, så en alert kan nå Slack, e-mail, Telegram eller hvor som helst en node kan nå.

## Evaluate

### Indbyggede Evals

Fanen [Evals](../tabs/evals-tab.md) gør det muligt at definere testsuiter og køre dem mod agent-workflows:

- Opret testcases med inputs og forventede outputs, eller generér dem ud fra suite-prompten
- Kør én suite mod flere modeller og sammenlign deres outputs side om side
- Bedøm med Exact Match, Contains eller LLM-as-Judge med en uafhængig judge-model
- Gennemgå pass/fail, faktisk vs. forventet og kørselshistorik

Ændr en prompt eller en model, kør suiten igen, og sammenlign resultaterne, før ændringen når produktion.

## Control

### Human-in-the-Loop (HITL)

Heym har et indbygget [Human-in-the-Loop](../reference/human-in-the-loop.md)-system, der gør det muligt for agenter at pause eksekveringen, anmode om menneskelig gennemgang og genoptage præcis, hvor de slap.

- **Agent-checkpoints** – Aktivér `hitlEnabled` på en vilkårlig Agent-node for at give den et `request_human_review`-værktøj. Agenten afgør, hvornår en beslutning kræver menneskeligt tilsyn, og kalder værktøjet med et resumé og et udkast.
- **Offentlige review-URL'er** – Hver review-anmodning genererer et sikkert engangslink på `/review/{token}` (168 timers TTL). Reviewere kan **acceptere**, **redigere & fortsætte** eller **afvise** uden at logge ind.
- **Eksekveringssnapshots** – Workflowet fryser sin fulde tilstand (samtalehistorik, variabler, værktøjsresultater), så det genoptages præcis, hvor det blev sat på pause, efter revieweren svarer.
- **Notifikationsgren** – Et valgfrit `review`-output-håndtag gør det muligt at forbinde et notifikationsflow (Slack, e-mail, webhook), der udløses, når en review anmodes om.
- **MCP-værktøjsgodkendelsespolitikker** – Skriftlige HITL-retningslinjer fortolkes til godkendelsesomfang (`always` / `once` / `never`), så agenten automatisk kan godkende lavrisiko-værktøjer og eskalere højrisiko-værktøjer.
- **Flere checkpoints** – En enkelt agent-kørsel kan pauses til review flere gange; hvert checkpoint er uafhængigt.

Offentlige review-URL'er, rediger-og-fortsæt, notifikationsforgrening og snapshot-baseret genoptagelse fungerer alle fra samme agent-checkpoint.

Se [Human-in-the-Loop](../reference/human-in-the-loop.md) for den fulde reference.

### LLM Guardrails

Heym har indbyggede [Guardrails](../reference/guardrails.md) på både [LLM](../nodes/llm-node.md)- og [Agent](../nodes/agent-node.md)-noder, så usikkert indhold kan blokeres, før et modelsvar når downstream-trin.

- **Sikkerhedstoggle på node-niveau** – Aktivér guardrails direkte på den node, der genererer eller behandler brugervendt indhold
- **Bred politikdækning** – Blokér vold, hadefuld tale, seksuelt indhold, NSFW/profanitet, chikane, ulovlig aktivitet, anmodninger om personoplysninger og forsøg på prompt injection
- **Flersproget detektion** – Anvend de samme sikkerhedsregler på tværs af tyrkisk, engelsk, arabisk, spansk og andre sprog
- **Workflow-native fallback** – Når en meddelelse blokeres, kaster noden en typet workflow-fejl, der kan routes gennem en [Error Handler](../nodes/error-handler-node.md)

Sikkerhedspolitikken ligger direkte inde i LLM- og Agent-konfigurationen og kobles direkte til workflow-forgrening og fejlhåndtering.
### Adgang, Legitimationsoplysninger og Revision

Agenter handler med rigtige legitimationsoplysninger, så adgang er en del af governance. [Legitimationsoplysninger](../reference/credentials.md) krypteres ved lagring, maskeres efter oprettelse og kan deles med brugere eller [teams](../reference/teams.md), og teams deler også workflows, variabler, vector stores og Drive-filer. [Single sign-on](../reference/sso.md) forbinder enhver OpenID Connect-udbyder, herunder Okta, Entra ID, Keycloak, Auth0 og Google. [Revisionssporet](../reference/audit.md) registrerer enhver sikkerhedsrelevant handling med dens aktør, mål og resultat, streamet med containerlogs til den log collector eller SIEM, der allerede anvendes.

### Self-Hosted, Data Ejerskab

Heym kører på egen infrastruktur. Workflows, legitimationsoplysninger, eksekveringshistorik og traces ligger i egen database, og modelkald går fra egne servere til den valgte udbyder, eller til en model der hostes selv gennem Ollama eller vLLM. For agenter, der behandler følsomme dokumenter, kundedata eller proprietære knowledge bases, er dette ofte et hårdt krav.

Heym er licenseret under **MIT License med Commons Clause-betingelsen**. Kildekoden er source-available: den kan frit bruges, modificeres og self-hostes. Commons Clause begrænser salg af softwaren, herunder tilbud om betalt hosting eller konsulent-/supportydelser, hvis værdi i væsentlig grad stammer fra Heym. For kommerciel licensering, enterprise-udrulninger eller professionel support, kontakt [enterprise@heym.run](mailto:enterprise@heym.run).

## Eksponering

### API'er og Streaming

Workflows kan kaldes over HTTP på `/api/workflows/{workflow_id}/execute`, som returnerer JSON, og på `/api/workflows/{workflow_id}/execute/stream`, som streamer node-hændelser som Server-Sent Events, mens kørslen skrider frem. Begge deler workflow-niveau-autentificering, rate limiting og response caching. Se [Webhooks](../reference/webhooks.md) og [SSE Streaming](../reference/sse-streaming.md).

### MCP (Model Context Protocol) Integration

Heym har native [MCP](../tabs/mcp-tab.md)-support på begge sider:

- **Som klient**: Agent-noder forbinder til eksterne MCP-servere (Filesystem, Browserbase, brugerdefinerede værktøjer) via stdio eller SSE og forbruger deres værktøjer automatisk
- **Som server**: Workflows med MCP slået til bliver værktøjer på standardserveren på `/api/mcp/sse`, eller på navngivne servere med deres egen URL og API-nøgle, så Claude Desktop, Cursor og andre MCP-klienter kan kalde Heym-workflows direkte

Agenter kan forbruge flere MCP-servere på én gang, og enhver workflow kan blive et værktøj for en ekstern MCP-klient.

### Portal: Publicering af Workflows som Chat-UIs

Funktionen [Portal](../reference/portal.md) omdanner enhver workflow til en offentligt tilgængelig chat-grænseflade på `/chat/{slug}`:

- Valgfri autentificering med per-bruger legitimationsoplysninger
- Streaming-eksekvering (real-time node-fremdrift)
- Understøttelse af filupload
- Flerstrenget samtalehistorik

Teams leverer interne værktøjer, kundevendte chatbots og AI-drevne formularer fra en workflow og en URL, uden frontend-kode at skrive.

### Workflow-Drevne Dashboards

[Fanen Dashboard](../tabs/dashboard-tab.md) er en brugerskabt rapporteringsoverflade, hvor hver diagram-widget drives af sin egen skjulte Heym-workflow. En widget kan kalde API'er, forespørge BigQuery, søge i RAG/vector stores, køre LLM-trin, transformere rækker og afslutte med en [Chart Output-node](../nodes/chart-output-node.md). Widgets kan oprettes manuelt, genereres med AI, finjusteres senere, cacheresultater og omarrangeres visuelt i gitteret.
## Sammenlignet med Workflow-automatiseringsværktøjer

Mange teams kommer til Heym fra workflow-automatiseringsværktøjer. Tabellen nedenfor sammenligner Heym med n8n, Zapier og Make.com på de egenskaber, der er afgørende, når agenter kører i produktion, og fodnoterne under den henviser til den officielle dokumentation bag sammenligningen. For et dybere indblik i ét værktøj ad gangen, se sammenligningssiderne på [heym.run/compare](https://heym.run/compare).

| Egenskab | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Indbygget LLM-node | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + statusbrancher | ✓ | begrænset¹¹ | –¹¹ | begrænset¹¹ |
| Indbygget Agent-node (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Multi-agent-orkestrering | ✓ | ✓ | begrænset | begrænset |
| Coding agent-noder (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Indbygget RAG / vector store | ✓ | ✓ | begrænset¹ | plugin² |
| WebSocket læsning / skrivning | ✓ | begrænset¹² | –¹³ | –¹⁴ |
| Workflow-bygger i naturligt sprog | ✓ | begrænset³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Åbning af et igangværende run på det live canvas | ✓ | begrænset¹⁹ | begrænset¹⁹ | –¹⁹ |
| Workflow-drevne dashboards | ✓ | begrænset¹⁷ | begrænset¹⁷ | begrænset¹⁷ |
| Agentisk Kanban-board | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Skills-system til agenter | ✓ | – | – | – |
| Indbygget fildrev (delingslinks, teams) | ✓ | begrænset²² | begrænset²² | –²² |
| Browser-automatiseringsnode (Playwright) | ✓ | begrænset²³ | begrænset²³ | –²³ |
| LLM trace-inspektion | ✓ | begrænset⁴ | – | ✓ |
| OpenTelemetry tracing-eksport | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM token-omkostningssporing (USD) | ✓ | –¹⁵ | –¹⁵ | begrænset¹⁵ |
| Indbyggede evals til AI-workflows | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | begrænset⁶ | begrænset⁷ |
| LLM guardrails | ✓ | ✓⁸ | ✓⁸ | begrænset⁸ |
| Automatisk kontekstkomprimering | ✓ | – | – | – |
| Parallel DAG-eksekvering | ✓ | begrænset⁹ | – | – |
| Self-hostable, source available | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL til dynamiske data | ✓ | ✓ | begrænset | ✓ |
> **Fodnoter:** ¹ Zapier Knowledge Sources — ingen eksponeret vector store eller embedding-kontrol. ² Make.com har Pinecone/Qdrant-moduler, men ingen native RAG-node. ³ n8n AI Workflow Builder er cloud-only beta med kreditlofter. ⁴ n8n viser mellemliggende trin; fuld tracing kræver tredjepartsværktøjer. ⁵ n8n understøtter godkendelser af AI-værktøjskald via chat, e-mail og samarbejdskanaler, men der tages ikke snapshot af og genoptages hele eksekveringen på samme måde som i Heym. ⁶ Zapier Human in the Loop understøtter godkendelser og dataindsamling i Zaps, men det er ikke et offentligt review-, snapshot-genoptagelses-checkpointsystem. ⁷ Make.com tilbyder Human in the Loop som en Enterprise-app med review-anmodninger og justerede/godkendte/annullerede resultater, men den forbliver planbegrænset og mindre agent-native. ⁸ n8n leverer en dedikeret Guardrails-node, Zapier leverer AI Guardrails på tværs af sine AI-produkter, og Make.com dokumenterer agentregler plus review-flows, men ikke en sammenlignelig selvstændig guardrails-funktion, så Make er markeret som begrænset. ⁹ n8n eksekverer sekventielt som standard; parallelisme kræver workarounds med sub-workflows. ¹⁰ Sustainable Use License — gratis at self-hoste til intern brug, kommerciel redistribution begrænset. ¹¹ Pr. 22. april 2026 beskriver n8ns officielle dokumentation HTTP-batching og loop/wait-mønstre frem for en native LLM batch-status-branch, Zapiers officielle ChatGPT-app-dokumentation angiver ingen triggere og kun en generisk API Request-beta, og Makes officielle OpenAI-integrationsside eksponerer batch-handlinger som create/watch completed, men ikke en førsteklasses status-branching LLM-node, så n8n/Make er markeret som begrænsede, og Zapier er markeret som utilgængelig for dette specifikke workflow-mønster. ¹² n8ns officielle dokumentation dækker HTTP Webhook- og HTTP Request-noder samt Code/custom/community-udvidelsesmuligheder, men der kunne ikke findes en førsteparts WebSocket trigger/send-node, så n8n er markeret som begrænset. ¹³ Zapiers officielle dokumentation dækker indgående webhooks og udgående webhook/API-anmodninger over HTTP alene, ikke native WebSocket trigger- eller send-trin. ¹⁴ Makes officielle dokumentation dækker Webhooks-moduler og HTTP(S)-anmodningsmoduler, men der kunne ikke findes et native WebSocket trigger- eller send-modul. ¹⁵ n8n har ingen native LLM-tokenomkostningssporing; community-workaround-workflows findes, men kræver manuel installation og API-kald efter eksekvering (åben feature request pr. maj 2026). Zapier eksponerer intet tokenantal eller USD-omkostning pr. eksekvering for brugere; AI-trin forbruger kun tasks. Make.coms credits-dashboard afspejler delvist tokenforbrug for Make-hosted AI (siden august 2025), men tredjeparts API-nøgleforbindelser faktureres som 1 operation = 1 credit uden tokentælling; ingen USD-opdeling pr. eksekvering efter model er tilgængelig. ¹⁶ Heym udsender native OpenTelemetry-spans (én pr. workflow-kørsel plus én pr. node) over OTLP/HTTP til enhver kompatibel backend, med W3C trace-context-propagation og ingen instrumentation-kode, konfigureret via `HEYM_OTEL_*` env-variabler og deaktiveret som standard. n8n har en dokumenteret OpenTelemetry tracing-integration til workflow- og node-eksekveringer. Zapier og Make.com dokumenterer ikke OpenTelemetry-eksport af deres workflow-/scenario-eksekveringer pr. juni 2026. ¹⁷ n8n dokumenterer et Insights-dashboard til produktions-eksekveringsmetrikker, Zapier dokumenterer Zap History plus Task Usage, og Make.com dokumenterer Scenario History; disse er overvågnings-/historikflader, ikke brugerdefinerede dashboard-widgets understøttet af vilkårlig workflow-logik som Heyms Dashboard-fane. ¹⁸ Heym Workflow Analyzer kører workflowet, når det er muligt, læser eksekveringsresultatet og genererer en delt redigerbar Markdown-rapport, der dækker forbedringsområder, formål og trinvis adfærd. n8n dokumenterer AI Workflow Builder til at oprette/forfine/debugge workflows, Zapier dokumenterer AI-fejlfinding for fejlramte Zap-kørsler, og Make.com dokumenterer scenario-historik plus AI-agent-ræsonneringstrin, men deres offentlige dokumentation beskriver ikke det samme kørselsbevidste delte workflow-analyse-dokument. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) viser kørende eksekveringer og kan indlæse data fra en tidligere eksekvering i editoren, mens [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) eksponerer en running-tilstand i sin editor. [Make Scenario History](https://help.make.com/scenario-history) dokumenterer kørselsdetaljer og logs. Deres offentlige dokumentation, kontrolleret 18. juli 2026, beskriver ikke Heyms præcise flow: åbn en vilkårlig igangværende produktionskørsel fra History eller et Kanban-kort, gendan dets aktuelle node-snapshot, og fortsæt med at modtage node-animation og Debug-logs på samme canvas. ²⁰ Heyms [Codex](../nodes/codex-node.md) og [OpenCode Go](../nodes/opencode-go-node.md)-noder kører en rigtig coding agent CLI i et isoleret Heym-workspace mod et GitHub-repository — clone, rediger, producer en diff, push en branch, åbn en pull request — som et førsteklasses workflow-trin. Pr. 20. juli 2026 dokumenterer ingen konkurrent et tilsvarende: n8ns [OpenAI-node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) dækker chat/assistant-API-kald, ikke en repository-niveau coding agent, og native Codex-understøttelse forbliver en community-anmodning; Zapiers egen blog dokumenterer den modsatte retning — [Codex driver Zapier-værktøjer gennem Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — ikke Codex som et Zap-trin; Make.coms OpenAI-moduler eksponerer completions/assistants/batch-handlinger, ikke en coding agent, der kloner repos og åbner PR'er. ²¹ Heyms [Board-fane](../tabs/board-tab.md) er et indbygget agentisk Kanban-board, hvis kolonner eksekverer workflows, og hvis kort bærer kontekst, samtalehistorik, eksekveringstilstand og kørsler. n8n ([Kanban Tool-integration](https://n8n.io/integrations/kanban-tool/)), Zapier ([Kanban Tool-integrationer](https://zapier.com/apps/kanbantool/integrations)) og Make.com ([Kanban Tool-integration](https://www.make.com/en/integrations/kanban-tool)) forbinder kun til tredjeparts-kanban-apps som Kanban Tool, Wekan eller NocoDB; ingen dokumenterer et indbygget board, der kører sine egne workflows, pr. 20. juli 2026. ²² n8n gemmer eksekverings-binærdata internt (valgfrit på [S3-kompatibel ekstern lagring](https://docs.n8n.io/hosting/scaling/external-storage/)), men dokumenterer ingen brugervendt fildrive med delingslinks eller teamdeling, så den er markeret som begrænset. Zapiers [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) behandler kun filer i løbet af en Zap-kørsel, og [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) indeholder små tekstværdier, så Zapier er markeret som begrænset. Make.coms [data stores](https://help.make.com/l6du-data-stores) indeholder strukturerede poster, og dens [filhåndtering](https://help.make.com/working-with-files) sender filer mellem apps uden vedvarende indbygget lagring, så Make er markeret som utilgængelig. ²³ Heyms [Playwright-node](../nodes/playwright-node.md) er førsteparts browserautomatisering med en visuel trin-tilstand, AI-genererede trin og en fuld-kode-tilstand. n8n tilbyder kun community-pakker som [n8n-playwright](https://github.com/toema/n8n-playwright) med en stadig åben [feature request for native browserautomatiserings-noder](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), så den er markeret som begrænset. Zapier Agents kan [browse og læse sider via web browsing og en Chrome-udvidelse](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), men Zapier dokumenterer ikke et scriptet browserautomatiseringstrin, så den er markeret som begrænset. Make.com dokumenterer HTTP-moduler og tredjeparts scraping-apps frem for noget native browserautomatiseringsmodul, pr. 20. juli 2026.
## Relateret

- [Introduktion](./introduction.md) – Platformsoverblik
- [Hurtig start](./quick-start.md) – Byg det første workflow
- [Workflow-analyse](../reference/workflow-analysis.md) – Generér delte run-aware workflow-rapporter og forbedringsforslag
- [Dashboard-fane](../tabs/dashboard-tab.md) – Byg workflow-understøttede dashboards med AI-genererede diagram-widgets
- [Agent-node](../nodes/agent-node.md) – LLM-node med tool calling, MCP og skills
- [Agent-arkitektur](../reference/agent-architecture.md) – Sub-agenter, orkestrator og tool dispatch
- [Board-fane](../tabs/board-tab.md) – Agentisk Kanban-board med workflow-udførende kolonner
- [Codex-node](../nodes/codex-node.md) – Kør OpenAI Codex coding agent mod et GitHub-repo
- [OpenCode Go-node](../nodes/opencode-go-node.md) – Provider-agnostisk coding agent i en hærdet container
- [Drive-fane](../tabs/drive-tab.md) – Indbygget fillagring med delingslinks, teams og massehandlinger
- [Playwright-node](../nodes/playwright-node.md) – First-party browserautomatisering med AI-trin og code mode
- [RAG / Vector Store-node](../nodes/rag-node.md) – Vektorsøgning og dokumentindsættelse (Qdrant eller Postgres pgvector)
- [AI-assistent](../reference/ai-assistant.md) – Workflow-builder i naturligt sprog
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Agent-checkpoints med offentlige review-URL'er
- [Guardrails](../reference/guardrails.md) – Blokér usikre prompts, før de når modellerne
- [Traces-fane](../tabs/traces-tab.md) – Observabilitet for LLM-kald
- [Evals-fane](../tabs/evals-tab.md) – Testsuiter til AI-workflows
- [Alerts-fane](../tabs/alerts-tab.md) – Tærskelalarmer på fejl, varighed, omkostninger og run-volumen
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Eksportér run-, node- og tool-spans over OTLP
- [Load Distribution](../reference/cluster.md) – Del runs på tværs af instanser med leader failover
- [Single Sign-On](../reference/sso.md) – Log ind via enhver OpenID Connect-provider
- [Audit Logging](../reference/audit.md) – Sikkerhedsrelevante handlinger med aktør, mål og resultat
- [Portal](../reference/portal.md) – Publicér workflows som offentlige chat-UI'er
- [Parallel Execution](../reference/parallel-execution.md) – DAG-baseret samtidig udførelse
- [MCP-fane](../tabs/mcp-tab.md) – Konfiguration af MCP-server og -klient
