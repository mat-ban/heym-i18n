# Varför Heym

Heym är infrastruktur för att köra och styra AI-agenter i produktion. En självhostad runtime täcker varje steg i agentens livscykel.

En prototypagent behöver en modell, en prompt och några verktyg. En produktionsagent behöver dessutom triggers och återförsök, sparat tillstånd när den pausar för en person, en logg över varje modell- och verktygsanrop, en kostnad för varje körning, tester innan en ändring släpps, och tydliga gränser för vad den får göra på egen hand. Heym håller allt detta på ett ställe, så systemet som designas på canvasen är systemet som körs. Bygg agentiska system och kör dem sedan med tillförsikt.

## En runtime för agentens livscykel

| Steg | Vad Heym ger |
|---|---|
| **Bygg** | Komponera agenter och deterministiska steg på canvasen, generera dem med [AI-assistenten](../reference/ai-assistant.md), eller utgå från [Mallar](../tabs/templates-tab.md) och portabla skills. |
| **Orkestrera** | Koordinera agenter, [sub-agenter](../reference/agent-architecture.md), kodningsagenter, RAG, webbläsarautomatisering och verktyg med explicit dataflöde och [parallell körning](../reference/parallel-execution.md). |
| **Kör** | Starta körningar från [webhooks](../reference/webhooks.md), scheman och händelse[triggers](../reference/triggers.md), med återförsök per nod, [felhantering](../nodes/error-handler-node.md) och [lastfördelning](../reference/cluster.md) över instanser. |
| **Observera** | Inspektera varje körning genom [historik](../reference/execution-history.md), [LLM-spårningar](../tabs/traces-tab.md), USD-kostnad per körning, livekörningar på canvasen, [analys](../tabs/analytics-tab.md), [larm](../tabs/alerts-tab.md) och export via [OpenTelemetry](../reference/opentelemetry.md). |
| **Utvärdera** | Testa prompts och modeller mot förväntade utdata i [Evals](../tabs/evals-tab.md), med LLM-as-Judge-poängsättning och sida-vid-sida-jämförelse av modeller. |
| **Styr** | Behåll människan i kontroll med [granskningskontrollpunkter](../reference/human-in-the-loop.md) och [guardrails](../reference/guardrails.md), och styr åtkomst med krypterade [uppgifter](../reference/credentials.md), [team](../reference/teams.md), [enkel inloggning](../reference/sso.md) och en [granskningslogg](../reference/audit.md). |
| **Exponera** | Tillhandahåll workflows över REST och [SSE](../reference/sse-streaming.md), som [MCP](../tabs/mcp-tab.md)-verktyg, som [Portal](../reference/portal.md)-chattgränssnitt och som [dashboard](../tabs/dashboard-tab.md)-widgetar. |

## Bygg

### AI-assistenten: Bygg workflows med naturligt språk

[AI-assistenten](../reference/ai-assistant.md) är en chattpanel inuti workflow-editorn. Beskriv vad som önskas, till exempel "skapa en workflow som tar användarinmatning, söker i min kunskapsbas och svarar med GPT-4o", och assistenten genererar noder och kanter som omedelbart tillämpas på canvasen.

- Använder egna LLM-uppgifter (valfri modell som stöds)
- Stöder **röstinmatning** för handsfree-workflowdesign
- Tillämpar automatiskt giltig workflow-JSON från AI-svaret på canvasen
- Strömmar svar i realtid

Assistenten arbetar direkt inuti editorn och strömmar noder till canvasen i realtid, och allt den genererar förblir redigerbart precis som noder som placerats manuellt.

### Skills-system

Skills är portabla kapabilitetspaket, en `SKILL.md`-instruktionsfil plus valfria Python-skript, som kan släppas på vilken Agent-nod som helst.

- Skillens instruktioner läggs före agentens system-prompt
- Python-filer i skillen blir anropbara verktyg
- Skills är återanvändbara mellan workflows och delbara som `.zip`-arkiv

Detta motsvarar att ge agenten en arbetsbeskrivning och en verktygslåda i ett enda steg.

### Workflow Analyzer: Körningsmedveten återkoppling

Panelen [Workflow Analysis](../reference/workflow-analysis.md) är ett körningsmedvetet dokumentations- och återkopplingsverktyg inbyggt i editorn. Klicka på **Analyze**, välj LLM-uppgifter och modell, och Heym genererar en redigerbar Markdown-rapport för den aktuella workflowen.

Till skillnad från en statisk anteckning kör analysatorn först workflowen när det är möjligt och inkluderar körningsresultatet i prompten. Rapporten täcker förbättringsområden, workflowens syfte och en steg-för-steg-förklaring av vad noderna gör. När en rapport redan finns strömmar **Reanalyze** en separat förhandsvisning så att den nya versionen kan accepteras eller det aktuella delade dokumentet behållas.

## Orkestrera
### Inbyggda LLM- och Agent-noder

Heyms [Agent-nod](../nodes/agent-node.md) kör en tätt integrerad verktygsanropsloop med inline Python-verktyg, MCP-anslutningar och ett portabelt skills-system, allt utformat för produktionsagenter.

Heyms vanliga [LLM-nod](../nodes/llm-node.md) går också bortom ett enskilt prompt-svar-steg. För endpoints som stöds av OpenAI och OpenAI-kompatibla endpoints kan den växla till **Batch API-läge** så att en nod skickar en array av prompts i en leverantörsintern batch-begäran till lägre kostnad. Canvasyta exponerar då en dedikerad `batchStatus`-gren som utlöses när batchen rör sig genom tillstånd som `pending`, `processing` och `completed`.

Det innebär att LLM-noden kan göra två saker samtidigt:

- Köra den huvudsakliga batch-begäran och returnera de slutliga utdata per objekt på den normala grenen
- Utlösa notifierings- eller loggningslogik vid varje meningsfull uppdatering av batch-status utan att göra om flödet till en anpassad pollningsloop

Batch-körning är en förstklassig LLM-workflow-primitiv, med kontroller av leverantörs- och modellkapacitet i nodens UI.

**Agent-noden** är kärnan i agent-orkestrering i Heym:

- **Verktygsanrop** – Agenten itererar över verktygsanrop i en loop tills den producerar ett slutligt svar
- **Python-verktyg** – Definiera anpassade verktyg inline med fullständig Python; agenten anropar dem vid körning
- **MCP-anslutningar** – Anslut till valfri [Model Context Protocol](https://modelcontextprotocol.io/)-server (stdio eller SSE) och agenten får automatiskt alla dess verktyg
- **Skills** – Släpp en `.zip`- eller `.md`-fil på en agent för att utöka dess systemkontext och lägga till Python-verktyg
- **Anrop till under-workflows** – Agenten kan anropa andra Heym-workflows som verktyg och komponera komplexa beteenden utan anpassad kod

Se [Agent-nod](../nodes/agent-node.md) och [Agent-arkitektur](../reference/agent-architecture.md) för fullständig referens.

### Multi-Agent-orkestrering

Heym stöder ett **orkestrerarmönster** med förstklassiga visuella primitiver:

- En agent fungerar som **orkestrerare** (`isOrchestrator: true`) och tilldelas ett `call_sub_agent`-verktyg
- Den delegerar uppgifter till namngivna **under-agenter** på samma canvasyta
- Under-agenter kan i sin tur anropa andra agenter eller under-workflows (maxdjup: 5)
- **Parallell körning**: När orkestreraren anropar flera under-agenter i en och samma tur körs de parallellt för snabbare resultat

Detta möjliggör arkitekturer som en planeringsagent som dirigerar arbete till en researcher, en kodare och en sammanfattare, allt kopplat visuellt utan anpassad orkestreringskod.

Se [Agent-arkitektur](../reference/agent-architecture.md) för körningsdetaljer.

### Kodningsagenter som workflow-noder

Heym levererar två noder som kör en riktig kodningsagent som ett workflow-steg, inte en chatt-komplettering:

- **[Codex-nod](../nodes/codex-node.md)** – Kör OpenAI Codex CLI i en isolerad Heym-arbetsyta mot ett GitHub-repositorium. Stöder **Sign in with ChatGPT** (PKCE OAuth via Plus/Pro-prenumeration, ingen API-kostnad per token) eller en access token, klonar repot, låter Codex redigera kod och returnerar `summary`, `diff`, `changedFiles` och en utkast-`pullRequestUrl`.
- **[OpenCode Go-nod](../nodes/opencode-go-node.md)** – Samma repositorium-workflow via den leverantörsagnostiska OpenCode-gatewayen (Kimi, DeepSeek, Qwen med flera), kört i en **härdad engångscontainer**: alla capabilities borttagna, read-only root, pid-/minnes-/CPU-gränser. GitHub-token förblir utanför sandboxen: Heym utför varje git- och GitHub-operation på värdsidan, så genererad kod kan inte exfiltrera push-uppgifter.

Det innebär att ett workflow kan triagera en bugg från en webhook, lämna repot till en kodningsagent, vänta på utkast-PR:en och publicera länken till Slack, helt automatiserat, med resursgränser konfigurerbara per distribution.

### Inbyggd RAG-pipeline

Heym innehåller en [RAG / Vector Store-nod](../nodes/rag-node.md) och en hanterad flik för [Vectorstores](../tabs/vectorstores-tab.md). Det går att:

- Välja sin vektorbackend: **Qdrant** (extern server) eller **Postgres (pgvector)**, som lagrar vektorer i Heyms egen databas utan extra tjänst att köra
- Infoga dokument i ett vektorlager direkt från en workflow-nod
- Utföra semantisk sökning och mata in resultat i en LLM- eller Agent-nod
- Referera till resultat med uttryck som `$ragNode.results.map("item.payload.content").join("\n\n")`

I Heym är RAG två noder med full kontroll över embeddings och hämtning.

### Webbläsarautomatisering med Playwright

[Playwright-noden](../nodes/playwright-node.md) är förstaparts webbläsarautomatisering på canvasyta.

- **Steps-läge** – Komponera navigate, click, type, fill, screenshot, extract och scroll-åtgärder visuellt
- **AI-steg med auto-heal** – Beskriv en åtgärd i naturligt språk och en LLM genererar Playwright-åtgärderna; misslyckade selektorer kan healas automatiskt, och genererade steg kan cachas för att hoppa över framtida LLM-anrop
- **Run Code-läge** – Växla noden till fullständig Playwright Python för komplexa flöden (inaktiverat som standard; körs i Heyms härdade sandbox när det aktiveras)
- **Autentiserade sessioner** – Återställ cookies/`storageState` före körning, verifiera inloggning med en selektorkontroll och fall tillbaka på skriptade inloggningssteg
- **Nätverksinspelning** – Samla valfritt in JSON-svar, headers, cookies och webbläsarlagring tillsammans med resultat

Heym behandlar webbläsaren som en vanlig nod med samma uttryck, uppgifter och felhantering som allt annat.
### Expression DSL

Heyms [Expression DSL](../reference/expression-dsl.md) tillhandahåller en ren och kraftfull syntax för att referera till data från uppströmsnoder:

- `$input.text` – Data från Input-noden
- `$nodeName.field` – Utdatafält från valfri uppströmsnod
- `$global.variableName` – Beständiga globala variabler
- Array-hjälpfunktioner: `.first()`, `.map("field")`, `.join("\n")`

Expressioner fungerar i alla strängfält, inklusive prompts, HTTP-headers, villkor och angivna värden, så att data förflyttas explicit mellan steg. DSL:en balanserar kraft och läsbarhet utan att kräva fullständiga JavaScript-kunskaper.

## Körning

### Triggers, återförsök och felsökvägar

En workflow kan starta från många platser. [Input](../nodes/input-node.md)-noder tar emot HTTP-[webhooks](../reference/webhooks.md), [Cron](../nodes/cron-node.md) körs enligt ett schema, och händelse[triggers](../reference/triggers.md) startar körningar från Telegram, Discord, Slack, IMAP-inkorgar, WebSocket-strömmar, RabbitMQ-köer, filuppladdningar och Heym-plattformshändelser.

Fel hanteras inuti grafen. Vilken nod som helst kan göra återförsök vid fel med ett angivet antal försök och en väntetid mellan dem, varje försök registreras i [körningshistoriken](../reference/execution-history.md), och en [Error Handler](../nodes/error-handler-node.md)-nod körs automatiskt när en nod misslyckas, så återställning är en del av själva workflown.

### Parallell DAG-körning

Heyms workflow-exekutor använder en schemaläggare för riktad acyklisk graf (DAG). Oberoende noder körs automatiskt parallellt, utan konfiguration.

- Noder på samma beroendenivå skickas samtidigt till en trådpool (`max_workers=8`)
- Så snart en nod är klar schemaläggs dess nedströmsnoder
- [Merge-noden](../nodes/merge-node.md) kombinerar resultat från parallella grenar
- Flera workflow-körningar körs samtidigt; varje körning är helt isolerad

Parallelism är standardbeteendet och bestäms av grafens struktur.

Se [Parallell körning](../reference/parallel-execution.md).

### Skala över instanser

Peka en andra Heym-instans mot samma PostgreSQL-databas och den ansluter som en worker. Bakgrundskörningar delas mellan instanser enligt vikter som anges, en vald leader håller scheman, larmutvärdering och kraschåterställning igång genom en failover, och varje körning registrerar vilken instans som utförde den. Se [Lastfördelning](../reference/cluster.md).

### Agentisk Kanban-tavla

Fliken [Board](../tabs/board-tab.md) är en inbyggd Kanban-tavla där kolumnerna själva kör workflows. Ett kort är ett beständigt agentiskt jobb som bär kontext, konversationshistorik, körningstillstånd, utdata och workflow-körningar.

- **Kolumnens workflow-kedjor** – Att flytta ett kort till en kolumn utlöser kolumnens workflow-kedja; en **Agentic Kanban Model** (egen credential + modell) mappar kortets innehåll till workflow-indata och omvandlar utdata tillbaka till läsbar text
- **Kortbilagor** – Släpp filer på ett kort; dokument extraheras till text och bilder skickas till visionskapabla modeller före varje körning
- **Live run-canvas** – Öppna den aktiva körningen inuti ett kort och se den köras på den riktiga workflow-canvasen, nod för nod
- **Teamdelning** – Dela tavlor med användare eller team med läs-/skrivbehörigheter; kedjor på delade tavlor körs med ägarens credentials, så medarbetare behöver aldrig egna
- **Synlighet vid fel** – Misslyckade kort visar en indikator för felhistorik, och uppföljande körningar kan pausa för att invänta kommentarer

Tavlan är en inbyggd yta i plattformen: kort, workflows, credentials och live-körningar finns alla på ett ställe.

### Heym Drive: Inbyggd fillagring

Fliken [Drive](../tabs/drive-tab.md) är ett fillager inbyggt i plattformen. Filer som genereras av skills och workflows (PDF, DOCX, CSV, bilder) hamnar där automatiskt, och bilagor till board-kort lagras också där.

- **Delningslänkar** – Offentliga eller lösenordsskyddade (Basic Auth) nedladdningslänkar med valfri utgång och maxgräns för nedladdningar
- **Teamdelning** – Dela filer skrivskyddat med team, och ta bort alla teamdelningar i en åtgärd
- **Massåtgärder** – Markera flera med shift-klick-intervall, paketera urval i en enda ZIP-nedladdning, eller tillämpa en delnings-/lösenords-/borttagningsinställning på många filer samtidigt
- **Agentåtkomst** – Skills kan välja att läsa Drive-filer, så en agent kan arbeta över dokument som skapats av användaren eller andra workflows

Genererade artefakter får en permanent, delbar plats inuti plattformen.

## Observera

### LLM-spårningar

Fliken [Traces](../tabs/traces-tab.md) ger full observerbarhet för varje LLM-anrop:

- Payloads för request och response
- Tidsmätning per anrop: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Namn på verktygsanrop, argument och resultat
- Skills som skickats till modellen

Spårningssystemet är specialbyggt för att felsöka agentiskt beteende, med fullständiga payloads för request och response samt tidsmätning per anrop.
### LLM Token Cost Tracking

Varje LLM-anrop i Heym kostnadsberäknas automatiskt. Fliken [Traces](../tabs/traces-tab.md) visar antal input- och output-tokens per trace tillsammans med en realtidskostnad i USD som härleds från en synkroniserad pristabell.

- **Kostnad per trace** – Input-tokens, output-tokens och total USD visas på varje trace-rad
- **Kostnadsanalys** – KPI-kort och ett kostnadsdiagram per modell uppdateras med det valda tidsintervallet (1h / 24h / 7d / 30d / All)
- **LLM Cost Table** – En systemtabell i fliken [DataTable](../tabs/datatable-tab.md) seedas från Helicone var 24:e timme; priser kan åsidosättas eller anpassade rader läggas till för modeller som ännu inte finns med
- **Varning för saknat pris** – Traces för modeller utan prispost visar en inline-varning med en direktlänk till kostnadstabellen

Varje körning bär sin egen USD-kostnad, uppdelad per modell.

### Öppna produktionskörningar på en live-canvas

Ett produktions-workflow förblir inspekterbart efter att det har startat utanför editorn. Öppna valfri **Running**-post från endera History-dialogen, eller öppna den aktiva körningen inuti ett Agentic Kanban-kort, och Heym kopplar den vanliga workflow-editorn till den exakta körningen.

- Noder som redan har slutförts visas med sina resultat omedelbart
- Den aktuella noden och väntande nedströms noder fortsätter pulsera i takt med att körningen fortskrider
- Debug-panelen tar emot samma inkrementella nodresultat som en canvas-startad körning
- Den slutliga utdatan och körningsmarkeringarna anländer utan polling eller att en dubblerad körning startas
- Att stänga editorn kopplar endast bort observatören; produktions-workflowet avbryts aldrig

Observatören använder SSE som backas av en körningsögonblicksbild över workers, så den fungerar för webhook-, schedule-, chat-, MCP-, integration- och Board-triggers även när en annan backend-worker äger körningen.

### OpenTelemetry, Analytics och Alerts

Heym emitterar [OpenTelemetry](../reference/opentelemetry.md)-spans för varje workflow-körning, nodexekvering och Agent-verktygsanrop, exporterade över OTLP/HTTP till Jaeger, Grafana Tempo, Honeycomb, Datadog eller valfri annan kompatibel backend.

Fliken [Analytics](../tabs/analytics-tab.md) spårar antal körningar, framgångsgrad, varaktighet och trender per workflow. [Alerts](../tabs/alerts-tab.md) bevakar felantal, körningsvaraktighet, token- eller USD-förbrukning och exekveringsvolym över ett tidsfönster och kör sedan ett valfritt notify-workflow, så att en alert når Slack, e-post, Telegram eller var som helst en nod kan nå.

## Evaluate

### Built-In Evals

Fliken [Evals](../tabs/evals-tab.md) gör det möjligt att definiera testsviter och köra dem mot agent-workflows:

- Skapa testfall med inputs och förväntade outputs, eller generera dem från svitens prompt
- Kör en svit mot flera modeller och jämför deras outputs sida vid sida
- Poängsätt med Exact Match, Contains eller LLM-as-Judge med en oberoende judge-modell
- Granska pass/fail, faktiskt vs förväntat och körningshistorik

Ändra en prompt eller en modell, kör om sviten och jämför resultaten innan ändringen når produktion.

## Control

### Human-in-the-Loop (HITL)

Heym har ett inbyggt [Human-in-the-Loop](../reference/human-in-the-loop.md)-system som gör att agenter kan pausa körningen, begära mänsklig granskning och återuppta exakt där de slutade.

- **Agent-checkpoints** – Aktivera `hitlEnabled` på valfri Agent-nod för att ge den ett `request_human_review`-verktyg. Agenten avgör när ett beslut kräver mänsklig översyn och anropar verktyget med en sammanfattning och ett utkast.
- **Publika gransknings-URL:er** – Varje granskningsbegäran genererar en säker engångslänk på `/review/{token}` (168 timmars TTL). Granskare kan **accept**, **edit & continue** eller **refuse** utan att logga in.
- **Körningsögonblicksbilder** – Workflowet fryser sitt fullständiga tillstånd (konversationshistorik, variabler, verktygsresultat) så att det återupptas exakt där det pausades efter att granskaren har svarat.
- **Notifieringsgren** – En valfri `review`-output-handle gör det möjligt att koppla ett notifieringsflöde (Slack, e-post, webhook) som utlöses när en granskning begärs.
- **MCP-verktygets godkännandepolicyer** – Skrivna HITL-riktlinjer tolkas till godkännandescope (`always` / `once` / `never`) så att agenten kan auto-godkänna lågriskverktyg och eskalera högriskverktyg.
- **Flera checkpoints** – En enskild agentkörning kan pausa för granskning flera gånger; varje checkpoint är oberoende.

Publika gransknings-URL:er, edit-and-continue, notifieringsförgrening och ögonblicksbildsbaserad återupptagning fungerar alla från samma agent-checkpoint.

Se [Human-in-the-Loop](../reference/human-in-the-loop.md) för fullständig referens.

### LLM Guardrails

Heym har inbyggda [Guardrails](../reference/guardrails.md) på både [LLM](../nodes/llm-node.md)- och [Agent](../nodes/agent-node.md)-noder, så att osäkert innehåll kan blockeras innan ett modellsvar når nedströms steg.

- **Säkerhetsväxel på nodnivå** – Aktivera guardrails direkt på noden som genererar eller bearbetar användarvänt innehåll
- **Bred policytäckning** – Blockera våld, hatpropaganda, sexuellt innehåll, NSFW/profanitet, trakasserier, olaglig aktivitet, begäranden om personuppgifter och försök till prompt injection
- **Flerspråkig detektering** – Tillämpa samma säkerhetsregler över turkiska, engelska, arabiska, spanska och andra språk
- **Workflow-native fallback** – När ett meddelande blockeras kastar noden ett typat workflow-fel som kan dirigeras genom en [Error Handler](../nodes/error-handler-node.md)

Säkerhetspolicyn finns direkt i LLM- och Agent-konfigurationen och kopplas rakt in i workflow-förgrening och felhantering.
### Åtkomst, autentiseringsuppgifter och granskning

Agenter agerar med riktiga autentiseringsuppgifter, så åtkomst är en del av styrningen. [Autentiseringsuppgifter](../reference/credentials.md) krypteras i vila, maskeras efter skapande och kan delas med användare eller [team](../reference/teams.md), och team delar även workflows, variabler, vector stores och Drive-filer. [Single sign-on](../reference/sso.md) ansluter valfri OpenID Connect-leverantör, inklusive Okta, Entra ID, Keycloak, Auth0 och Google. [Granskningsloggen](../reference/audit.md) registrerar varje säkerhetsrelevant åtgärd med dess aktör, mål och utfall, och strömmas med containerloggarna till den logginsamlare eller SIEM som redan används.

### Self-Hosted, dataägande i egen miljö

Heym körs på egen infrastruktur. Workflows, autentiseringsuppgifter, körningshistorik och traces finns i den egna databasen, och modellanrop går från de egna servrarna till vald leverantör, eller till en modell som hostas själv via Ollama eller vLLM. För agenter som hanterar känsliga dokument, kunddata eller proprietära kunskapsbaser är detta ofta ett hårt krav.

Heym är licensierad under **MIT License med Commons Clause-villkoret**. Källkoden är source-available: den kan användas, modifieras och self-hostas fritt. Commons Clause begränsar försäljning av programvaran, inklusive erbjudande av betald hosting eller konsult-/supporttjänster vars värde till väsentlig del härrör från Heym. För kommersiell licensiering, enterprise-distributioner eller professionell support, kontakta [enterprise@heym.run](mailto:enterprise@heym.run).

## Exponera

### API:er och strömning

Workflows kan anropas över HTTP på `/api/workflows/{workflow_id}/execute`, vilket returnerar JSON, och på `/api/workflows/{workflow_id}/execute/stream`, vilket strömmar nodhändelser som Server-Sent Events medan körningen fortskrider. Båda delar autentisering på workflow-nivå, hastighetsbegränsning och svars-cachning. Se [Webhooks](../reference/webhooks.md) och [SSE Streaming](../reference/sse-streaming.md).

### MCP-integration (Model Context Protocol)

Heym har inbyggt stöd för [MCP](../tabs/mcp-tab.md) på båda sidor:

- **Som klient**: Agentnoder ansluter till externa MCP-servrar (Filesystem, Browserbase, anpassade verktyg) via stdio eller SSE och konsumerar deras verktyg automatiskt
- **Som server**: Workflows med MCP aktiverat blir verktyg på standardservern på `/api/mcp/sse`, eller på namngivna servrar med egen URL och API-nyckel, så att Claude Desktop, Cursor och andra MCP-klienter kan anropa Heym-workflows direkt

Agenter kan konsumera flera MCP-servrar samtidigt, och vilken workflow som helst kan bli ett verktyg för en extern MCP-klient.

### Portal: publicera workflows som chattgränssnitt

Funktionen [Portal](../reference/portal.md) gör om vilken workflow som helst till ett offentligt chattgränssnitt på `/chat/{slug}`:

- Valfri autentisering med autentiseringsuppgifter per användare
- Strömmad körning (nodförlopp i realtid)
- Stöd för filuppladdning
- Konversationshistorik över flera turer

Team levererar interna verktyg, kundvända chatbotar och AI-drivna formulär från en workflow och en URL, utan att skriva någon frontend-kod.

### Workflow-drivna dashboards

Fliken [Dashboard](../tabs/dashboard-tab.md) är en användarbyggd rapporteringsyta där varje diagramwidget drivs av sin egen dolda Heym-workflow. En widget kan anropa API:er, fråga BigQuery, söka i RAG/vector stores, köra LLM-steg, transformera rader och avsluta med en [Chart Output-nod](../nodes/chart-output-node.md). Widgets kan skapas manuellt, genereras med AI, finjusteras senare, cacha resultat och arrangeras om visuellt i rutnätet.
## Jämförelse med verktyg för Workflow-automatisering

Många team kommer till Heym från verktyg för Workflow-automatisering. Tabellen nedan jämför Heym med n8n, Zapier och Make.com avseende de funktioner som är avgörande när agenter körs i produktion, och fotnoterna under den hänvisar till den officiella dokumentation som ligger till grund för jämförelsen. För en djupare genomgång av ett verktyg i taget, se jämförelsesidorna på [heym.run/compare](https://heym.run/compare).

| Funktion | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Inbyggd LLM-nod | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + statusgrenar | ✓ | begränsad¹¹ | –¹¹ | begränsad¹¹ |
| Inbyggd Agent-nod (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Multi-agent-orkestrering | ✓ | ✓ | begränsad | begränsad |
| Kodningsagent-noder (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Inbyggd RAG / vector store | ✓ | ✓ | begränsad¹ | plugin² |
| WebSocket läsning / skrivning | ✓ | begränsad¹² | –¹³ | –¹⁴ |
| Workflow-byggare med naturligt språk | ✓ | begränsad³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Öppna en pågående körning på den aktiva canvasen | ✓ | begränsad¹⁹ | begränsad¹⁹ | –¹⁹ |
| Workflow-drivna dashboards | ✓ | begränsad¹⁷ | begränsad¹⁷ | begränsad¹⁷ |
| Agentisk Kanban-tavla | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Skills-system för agenter | ✓ | – | – | – |
| Inbyggd fildrive (delningslänkar, team) | ✓ | begränsad²² | begränsad²² | –²² |
| Nod för webbläsarautomatisering (Playwright) | ✓ | begränsad²³ | begränsad²³ | –²³ |
| Inspektion av LLM-trace | ✓ | begränsad⁴ | – | ✓ |
| Export av OpenTelemetry-tracing | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Spårning av LLM-tokenkostnad (USD) | ✓ | –¹⁵ | –¹⁵ | begränsad¹⁵ |
| Inbyggda evals för AI-workflows | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | begränsad⁶ | begränsad⁷ |
| LLM-guardrails | ✓ | ✓⁸ | ✓⁸ | begränsad⁸ |
| Automatisk kontextkomprimering | ✓ | – | – | – |
| Parallell DAG-exekvering | ✓ | begränsad⁹ | – | – |
| Självhostbar, källkod tillgänglig | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL för dynamisk data | ✓ | ✓ | begränsad | ✓ |
> **Fotnoter:** ¹ Zapier Knowledge Sources — ingen exponerad vector store eller styrning av embedding. ² Make.com har Pinecone/Qdrant-moduler men ingen inbyggd RAG-nod. ³ n8n AI Workflow Builder är en molnbaserad beta med kreditbegränsningar. ⁴ n8n visar mellanliggande steg; full spårning kräver tredjepartsverktyg. ⁵ n8n stöder godkännanden av AI-verktygsanrop via chatt, e-post och samarbetskanaler, men det tar inte ögonblicksbilder och återupptar hela körningen på det sätt som Heym gör. ⁶ Zapier Human in the Loop stöder godkännanden och datainsamling i Zaps, men det är inte ett checkpoint-system för offentlig granskning med snapshot-återupptagning. ⁷ Make.com erbjuder Human in the Loop som en Enterprise-app med granskningsbegäranden och utfall som justerad/godkänd/avbruten, men den förblir planbegränsad och mindre agent-native. ⁸ n8n levererar en dedikerad Guardrails-nod, Zapier levererar AI Guardrails över sina AI-produkter, och Make.com dokumenterar agentregler plus granskningsflöden men inte en jämförbar fristående guardrails-funktion, så Make markeras som begränsad. ⁹ n8n kör sekventiellt som standard; parallellitet kräver workarounds med sub-workflows. ¹⁰ Sustainable Use License — gratis att self-hosta för internt bruk, kommersiell redistribution begränsad. ¹¹ Per den 22 april 2026 beskriver n8ns officiella dokumentation HTTP-batchning och loop/vänta-mönster snarare än en inbyggd LLM-batch-statusgren, Zapiers officiella dokumentation för ChatGPT-appen listar inga triggers och endast en generisk API Request-beta, och Makes officiella integrationssida för OpenAI exponerar batch-åtgärder som create/watch completed men inte en förstklassig LLM-nod för statusförgrening, så n8n/Make markeras som begränsade och Zapier markeras som otillgänglig för detta specifika workflow-mönster. ¹² n8ns officiella dokumentation täcker HTTP Webhook- och HTTP Request-noder plus Code/anpassad/community-baserad utökningsbarhet, men ingen förstaparts WebSocket-trigger/send-nod kunde hittas, så n8n markeras som begränsad. ¹³ Zapiers officiella dokumentation täcker inkommande webhooks och utgående webhook/API-förfrågningar endast över HTTP, inte inbyggda WebSocket-triggers eller skicka-steg. ¹⁴ Makes officiella dokumentation täcker Webhooks-moduler och HTTP(S)-förfrågningsmoduler, men ingen inbyggd WebSocket-trigger eller skicka-modul kunde hittas. ¹⁵ n8n har ingen inbyggd spårning av LLM-tokenkostnad; community-workarounds existerar men kräver manuell installation och API-anrop efter körning (öppen funktionsbegäran per maj 2026). Zapier exponerar inget antal tokens per körning eller USD-kostnad för användare; AI-steg förbrukar endast tasks. Make.coms credits-dashboard återspeglar delvis tokenförbrukning för Make-hostad AI (sedan augusti 2025) men tredjeparts-API-nyckelanslutningar faktureras som 1 operation = 1 credit utan tokenräkning; ingen USD-uppdelning per körning och modell är tillgänglig. ¹⁶ Heym emitterar inbyggda OpenTelemetry-spans (en per workflow-körning plus en per nod) över OTLP/HTTP till valfri kompatibel backend, med W3C trace-context-propagering och utan instrumenteringskod, konfigurerat via `HEYM_OTEL_*` env-variabler och inaktiverat som standard. n8n har en dokumenterad OpenTelemetry tracing-integration för workflow- och nodkörningar. Zapier och Make.com dokumenterar inte OpenTelemetry-export av sina workflow-/scenario-körningar per juni 2026. ¹⁷ n8n dokumenterar en Insights-dashboard för produktionskörningsmetrik, Zapier dokumenterar Zap History plus Task Usage, och Make.com dokumenterar Scenario History; dessa är övervaknings-/historikytor, inte anpassade dashboard-widgets som backas av godtycklig workflow-logik som Heyms Dashboard-flik. ¹⁸ Heym Workflow Analyzer kör workflowet när det är möjligt, läser körningsresultatet och genererar en delad redigerbar Markdown-rapport som täcker förbättringsområden, syfte och steg-för-steg-beteende. n8n dokumenterar AI Workflow Builder för att skapa/förfina/felsöka workflows, Zapier dokumenterar AI-felsökning för felaktiga Zap-körningar, och Make.com dokumenterar scenario-historik plus AI-agentens resonemangssteg, men deras offentliga dokumentation beskriver inte samma körningsmedvetna delade workflow-analysdokument. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) listar pågående körningar och kan ladda data från en tidigare körning till editorn, medan [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) exponerar ett running-tillstånd i sin editor. [Make Scenario History](https://help.make.com/scenario-history) dokumenterar körningsdetaljer och loggar. Deras offentliga dokumentation, kontrollerad den 18 juli 2026, beskriver inte Heyms exakta flöde: öppna en godtycklig pågående produktionskörning från History eller ett Kanban-kort, återställ dess aktuella nod-snapshot och fortsätt ta emot nodanimering och Debug-loggar på samma canvas. ²⁰ Heyms [Codex](../nodes/codex-node.md) och [OpenCode Go](../nodes/opencode-go-node.md)-noder kör en riktig coding agent CLI i en isolerad Heym-arbetsyta mot ett GitHub-repositorium — klona, redigera, producera en diff, pusha en branch, öppna en pull request — som ett förstklassigt workflow-steg. Per den 20 juli 2026 dokumenterar ingen konkurrent en motsvarighet: n8ns [OpenAI-nod](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) täcker chatt-/assistent-API-anrop, inte en coding agent på repositorienivå, och inbyggt Codex-stöd förblir en community-begäran; Zapiers egen blogg dokumenterar den omvända riktningen — [Codex som driver Zapier-verktyg genom Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — inte Codex som ett Zap-steg; Make.coms OpenAI-moduler exponerar completions/assistants/batch-åtgärder, inte en coding agent som klonar repos och öppnar PRs. ²¹ Heyms [Board-flik](../tabs/board-tab.md) är en inbyggd agentisk Kanban-tavla vars kolumner kör workflows och vars kort bär kontext, konversationshistorik, körningstillstånd och körningar. n8n ([Kanban Tool-integration](https://n8n.io/integrations/kanban-tool/)), Zapier ([Kanban Tool-integrationer](https://zapier.com/apps/kanbantool/integrations)) och Make.com ([Kanban Tool-integration](https://www.make.com/en/integrations/kanban-tool)) ansluter endast till tredjeparts-kanban-appar såsom Kanban Tool, Wekan eller NocoDB; ingen dokumenterar en inbyggd tavla som kör sina egna workflows, per den 20 juli 2026. ²² n8n lagrar binär körningsdata internt (valfritt på [S3-kompatibel extern lagring](https://docs.n8n.io/hosting/scaling/external-storage/)) men dokumenterar ingen användarvänd filenhet med delningslänkar eller teamdelning, så den markeras som begränsad. Zapiers [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) bearbetar filer endast under en Zap-körnings varaktighet och [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) håller små textvärden, så Zapier markeras som begränsad. Make.coms [data stores](https://help.make.com/l6du-data-stores) håller strukturerade poster och dess [filhantering](https://help.make.com/working-with-files) skickar filer mellan appar utan beständig inbyggd lagring, så Make markeras som otillgänglig. ²³ Heyms [Playwright-nod](../nodes/playwright-node.md) är förstaparts webbläsarautomatisering med ett visuellt stegläge, AI-genererade steg och ett fullkodsläge. n8n erbjuder endast community-paket såsom [n8n-playwright](https://github.com/toema/n8n-playwright) med en fortfarande öppen [funktionsbegäran för inbyggda webbläsarautomatiseringsnoder](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), så den markeras som begränsad. Zapier Agents kan [bläddra och läsa sidor via webbläsning och en Chrome-tillägg](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension) men Zapier dokumenterar inget skriptat webbläsarautomatiseringssteg, så den markeras som begränsad. Make.com dokumenterar HTTP-moduler och tredjeparts-scraping-appar snarare än någon inbyggd webbläsarautomatiseringsmodul, per den 20 juli 2026.
## Relaterat

- [Introduktion](./introduction.md) – Plattformsöversikt
- [Snabbstart](./quick-start.md) – Bygg den första workflowen
- [Workflow-analys](../reference/workflow-analysis.md) – Generera delade körningsmedvetna workflow-rapporter och förbättringsfeedback
- [Dashboard-fliken](../tabs/dashboard-tab.md) – Bygg workflow-baserade dashboards med AI-genererade diagramwidgetar
- [Agent-nod](../nodes/agent-node.md) – LLM-nod med tool calling, MCP och skills
- [Agent-arkitektur](../reference/agent-architecture.md) – Sub-agenter, orkestrerare och tool dispatch
- [Board-fliken](../tabs/board-tab.md) – Agentisk Kanban-tavla med workflow-exekverande kolumner
- [Codex-nod](../nodes/codex-node.md) – Kör OpenAI Codex-kodningsagenten mot ett GitHub-repo
- [OpenCode Go-nod](../nodes/opencode-go-node.md) – Leverantörsoberoende kodningsagent i en härdad container
- [Drive-fliken](../tabs/drive-tab.md) – Inbyggd fillagring med delningslänkar, team och massåtgärder
- [Playwright-nod](../nodes/playwright-node.md) – Förstaparts webbläsarautomatisering med AI-steg och kodläge
- [RAG / Vector Store-nod](../nodes/rag-node.md) – Vektorsökning och dokumentinsättning (Qdrant eller Postgres pgvector)
- [AI-assistent](../reference/ai-assistant.md) – Workflow-byggare med naturligt språk
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Agent-checkpoints med publika gransknings-URL:er
- [Guardrails](../reference/guardrails.md) – Blockera osäkra prompts innan de når modellerna
- [Traces-fliken](../tabs/traces-tab.md) – Observabilitet för LLM-anrop
- [Evals-fliken](../tabs/evals-tab.md) – Tests Sviter för AI-workflows
- [Alerts-fliken](../tabs/alerts-tab.md) – Tröskelvarningar för fel, varaktighet, kostnad och körningsvolym
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Exportera körnings-, nod- och tool-spans över OTLP
- [Lastfördelning](../reference/cluster.md) – Dela körningar mellan instanser med leader failover
- [Single Sign-On](../reference/sso.md) – Logga in via valfri OpenID Connect-leverantör
- [Audit Logging](../reference/audit.md) – Säkerhetsrelevanta åtgärder med aktör, mål och utfall
- [Portal](../reference/portal.md) – Publicera workflows som publika chattgränssnitt
- [Parallell exekvering](../reference/parallel-execution.md) – DAG-baserad samtidig exekvering
- [MCP-fliken](../tabs/mcp-tab.md) – Konfiguration av MCP-server och -klient
