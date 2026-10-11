# Proč Heym

Heym je infrastruktura pro provoz a správu AI agentů v produkci. Jeden self-hosted runtime pokrývá všechny fáze životního cyklu agenta.

Prototyp agenta potřebuje model, prompt a několik nástrojů. Produkční agent navíc potřebuje triggery a opakování, uložený stav, když se pozastaví kvůli člověku, záznam o každém volání modelu a nástroje, náklady na každý běh, testy před nasazením změny a jasné limity toho, co může dělat samostatně. Heym to vše drží na jednom místě, takže systém, který navrhnete na plátně, je systém, který skutečně běží. Vytvářejte agentní systémy a pak je provozujte s jistotou.

## Jeden runtime pro životní cyklus agenta

| Fáze | Co vám Heym poskytuje |
|---|---|
| **Build** | Sestavujte agenty a deterministické kroky na plátně, generujte je pomocí [AI Assistant](../reference/ai-assistant.md) nebo začněte ze [šablon](../tabs/templates-tab.md) a přenosných dovedností. |
| **Orchestrate** | Koordinujte agenty, [sub-agenty](../reference/agent-architecture.md), kódovací agenty, RAG, automatizaci prohlížeče a nástroje s explicitním tokem dat a [paralelním prováděním](../reference/parallel-execution.md). |
| **Run** | Spouštějte běhy z [webhooků](../reference/webhooks.md), plánů a událostních [triggerů](../reference/triggers.md), s opakováním na úrovni uzlů, [zpracováním chyb](../nodes/error-handler-node.md) a [rozložením zátěže](../reference/cluster.md) mezi instancemi. |
| **Observe** | Zkoumejte každé spuštění prostřednictvím [historie](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md), nákladů v USD na běh, živých běhů na plátně, [analytiky](../tabs/analytics-tab.md), [upozornění](../tabs/alerts-tab.md) a exportu [OpenTelemetry](../reference/opentelemetry.md). |
| **Evaluate** | Testujte prompty a modely proti očekávaným výstupům v [Evals](../tabs/evals-tab.md), s hodnocením LLM-as-Judge a porovnáním modelů vedle sebe. |
| **Control** | Udržujte lidi pod kontrolou pomocí [kontrolních bodů pro revizi](../reference/human-in-the-loop.md) a [guardrails](../reference/guardrails.md) a spravujte přístup pomocí šifrovaných [credentials](../reference/credentials.md), [týmů](../reference/teams.md), [single sign-on](../reference/sso.md) a [auditní stopy](../reference/audit.md). |
| **Expose** | Zpřístupněte workflow přes REST a [SSE](../reference/sse-streaming.md), jako nástroje [MCP](../tabs/mcp-tab.md), jako chatovací rozhraní [Portal](../reference/portal.md) a jako widgety [dashboardu](../tabs/dashboard-tab.md). |

## Build

### AI Assistant: Sestavujte workflow přirozeným jazykem

[AI Assistant](../reference/ai-assistant.md) je chatovací panel uvnitř editoru workflow. Popište, co chcete, například „vytvoř workflow, který přijme vstup od uživatele, prohledá moji znalostní bázi a odpoví pomocí GPT-4o“, a asistent vygeneruje uzly a hrany, které se okamžitě aplikují na plátno.

- Používá vaše vlastní LLM credentials (jakýkoli podporovaný model)
- Podporuje **hlasový vstup** pro návrh workflow bez použití rukou
- Automaticky aplikuje platný JSON workflow z odpovědi AI na plátno
- Streamuje odpovědi v reálném čase

Asistent pracuje přímo v editoru a streamuje uzly na plátno v reálném čase a vše, co vygeneruje, zůstává editovatelné stejně jako uzly, které umístíte ručně.

### Systém dovedností

Dovednosti jsou přenosné balíčky schopností, instruktážní soubor `SKILL.md` plus volitelné Python skripty, které lze vložit na jakýkoli uzel Agent.

- Instrukce dovednosti se přidají na začátek systémového promptu agenta
- Python soubory v dovednosti se stanou volatelnými nástroji
- Dovednosti jsou znovupoužitelné napříč workflow a sdílitelné jako archivy `.zip`

To je analogické tomu, jako byste svému agentovi předali popis práce a sadu nástrojů v jednom kroku.

### Workflow Analyzer: Zpětná vazba s ohledem na běh

Panel [Workflow Analysis](../reference/workflow-analysis.md) je nástroj pro dokumentaci a zpětnou vazbu s ohledem na běh, zabudovaný do editoru. Klikněte na **Analyze**, zvolte LLM credentials a model a Heym vygeneruje editovatelný Markdown report pro aktuální workflow.

Na rozdíl od statické poznámky analyzátor nejprve spustí workflow, když je to možné, a zahrne výsledek spuštění do promptu. Report pokrývá oblasti pro zlepšení, účel workflow a vysvětlení toho, co jednotlivé uzly dělají, krok za krokem. Pokud report již existuje, **Reanalyze** streamuje samostatný náhled, takže můžete přijmout novou verzi nebo zachovat aktuální sdílený dokument.

## Orchestrate
### Vestavěné LLM a Agent uzly

[Agent uzel](../nodes/agent-node.md) v Heymu spouští těsně integrovanou smyčku volání nástrojů s inline Python nástroji, MCP připojeními a přenosným systémem dovedností, to vše navrženo pro produkční agenty.

Obyčejný [LLM uzel](../nodes/llm-node.md) v Heymu také přesahuje rámec jednoho kroku prompt-odpověď. Pro podporované OpenAI a OpenAI-kompatibilní endpointy se může přepnout do **Batch API režimu**, takže jeden uzel odešle pole promptů v nativním dávkovém požadavku poskytovatele s nižšími náklady. Plátno pak zpřístupní vyhrazenou větev `batchStatus`, která se spouští, jak dávka prochází stavy jako `pending`, `processing` a `completed`.

To znamená, že LLM uzel může dělat dvě věci současně:

- Spustit hlavní dávkový požadavek a vrátit konečné výstupy pro jednotlivé položky na normální větvi
- Spustit logiku oznámení nebo protokolování při každé významné aktualizaci stavu dávky, aniž by se tok změnil na vlastní polling smyčku

Dávkové provádění je prvotřídní primitivum LLM workflow, s kontrolami schopností poskytovatele a modelu v UI uzlu.

**Agent uzel** je jádrem orchestrace agentů v Heymu:

- **Volání nástrojů** – Agent iteruje přes volání nástrojů ve smyčce, dokud neprodukuje konečnou odpověď
- **Python nástroje** – Definujte vlastní nástroje inline s plným Pythonem; agent je volá za běhu
- **MCP připojení** – Připojte se k jakémukoli serveru [Model Context Protocol](https://modelcontextprotocol.io/) (stdio nebo SSE) a agent automaticky získá všechny jeho nástroje
- **Dovednosti** – Přetáhněte soubor `.zip` nebo `.md` na agenta pro rozšíření jeho systémového kontextu a přidání Python nástrojů
- **Volání pod-workflow** – Agent může vyvolávat jiné Heym workflow jako nástroje, čímž skládá komplexní chování bez vlastního kódu

Úplnou referenci naleznete v [Agent uzel](../nodes/agent-node.md) a [Architektura agenta](../reference/agent-architecture.md).

### Multi-Agent Orchestrace

Heym podporuje **vzor orchestrátoru** s prvotřídními vizuálními primitivy:

- Jeden agent funguje jako **orchestrátor** (`isOrchestrator: true`) a je mu dán nástroj `call_sub_agent`
- Deleguje úkoly na pojmenované **sub-agenty** na stejném plátně
- Sub-agenti sami mohou volat další agenty nebo pod-workflow (maximální hloubka: 5)
- **Paralelní provádění**: Když orchestrátor zavolá více sub-agentů v jednom tahu, běží paralelně pro rychlejší výsledky

To umožňuje architektury jako plánovací agent, který směruje práci na výzkumníka, kodéra a sumarizátora, vše propojeno vizuálně bez vlastního orchestračního kódu.

Podrobnosti provádění naleznete v [Architektura agenta](../reference/agent-architecture.md).

### Coding Agenti jako Workflow Uzly

Heym dodává dva uzly, které spouštějí skutečného coding agenta jako krok workflow, nikoli chat completion:

- **[Codex uzel](../nodes/codex-node.md)** – Spouští OpenAI Codex CLI v izolovaném Heym workspace proti GitHub repozitáři. Podporuje **Sign in with ChatGPT** (PKCE OAuth na vašem Plus/Pro předplatném, žádné náklady na API za token) nebo přístupový token, klonuje repo, nechá Codex upravovat kód a vrací `summary`, `diff`, `changedFiles` a koncept `pullRequestUrl`.
- **[OpenCode Go uzel](../nodes/opencode-go-node.md)** – Stejný workflow s repozitářem přes poskytovatele-nezávislou OpenCode bránu (Kimi, DeepSeek, Qwen a další), prováděný v **zabezpečeném jednorázovém kontejneru**: všechny schopnosti odebrány, root pouze pro čtení, limity pid/paměti/CPU. GitHub token zůstává mimo sandbox: Heym provádí každou git a GitHub operaci na straně hostitele, takže generovaný kód nemůže exfiltrovat push přihlašovací údaje.

To znamená, že workflow může triageovat bug z webhooku, předat repo coding agentovi, počkat na koncept PR a poslat odkaz na Slack, plně automatizovaně, s limity zdrojů konfigurovatelnými pro každé nasazení.

### Vestavěný RAG Pipeline

Heym zahrnuje [RAG / Vector Store uzel](../nodes/rag-node.md) a spravovanou kartu [Vectorstores](../tabs/vectorstores-tab.md). Můžete:

- Zvolit svůj vektorový backend: **Qdrant** (externí server) nebo **Postgres (pgvector)**, který ukládá vektory do vlastní databáze Heymu bez nutnosti provozovat další službu
- Vkládat dokumenty do vektorového úložiště přímo z uzlu workflow
- Provádět sémantické vyhledávání a předávat výsledky do LLM nebo Agent uzlu
- Odkazovat na výsledky výrazy jako `$ragNode.results.map("item.payload.content").join("\n\n")`

V Heymu je RAG dva uzly s plnou kontrolou nad embeddingy a retrievalem.

### Automatizace prohlížeče s Playwright

[Playwright uzel](../nodes/playwright-node.md) je first-party automatizace prohlížeče na plátně.

- **Režim kroků** – Vizuálně skládejte akce navigate, click, type, fill, screenshot, extract a scroll
- **AI kroky s auto-heal** – Popište akci přirozeným jazykem a LLM vygeneruje Playwright akce; neúspěšné selektory mohou být automaticky opraveny a vygenerované kroky mohou být cachovány pro přeskočení budoucích LLM volání
- **Režim Run Code** – Přepněte uzel na plný Playwright Python pro komplexní toky (ve výchozím nastavení zakázáno; po povolení běží v zabezpečeném sandboxu Heymu)
- **Autentizované relace** – Obnovte cookies/`storageState` před spuštěním, ověřte přihlášení kontrolou selektoru a v případě potřeby se vraťte k skriptovaným přihlašovacím krokům
- **Zachytávání sítě** – Volitelně shromažďujte JSON odpovědi, hlavičky, cookies a úložiště prohlížeče spolu s výsledky

Heym zachází s prohlížečem jako s normálním uzlem se stejnými výrazy, přihlašovacími údaji a zpracováním chyb jako se vším ostatním.
### Expression DSL

Heym's [Expression DSL](../reference/expression-dsl.md) poskytuje čistou a výkonnou syntaxi pro odkazování na data z upstream uzlů:

- `$input.text` – Data vstupního uzlu
- `$nodeName.field` – Výstupní pole libovolného upstream uzlu
- `$global.variableName` – Persistentní globální proměnné
- Pomocné funkce pro pole: `.first()`, `.map("field")`, `.join("\n")`

Výrazy fungují v každém řetězcovém poli, včetně promptů, HTTP hlaviček, podmínek a nastavovaných hodnot, takže data mezi kroky přecházejí explicitně. DSL vyvažuje výkonnost a čitelnost, aniž by vyžadoval znalost JavaScriptu.

## Spuštění

### Triggery, opakování a chybové cesty

Workflow může být spuštěn z mnoha míst. Uzly [Input](../nodes/input-node.md) přijímají HTTP [webhooky](../reference/webhooks.md), [Cron](../nodes/cron-node.md) běží podle plánu a event [triggery](../reference/triggers.md) spouštějí běhy z Telegramu, Discordu, Slacku, IMAP schránek, WebSocket streamů, RabbitMQ front, nahrávaných souborů a platformních událostí Heym.

Selhání jsou řešena uvnitř grafu. Libovolný uzel může při selhání opakovat činnost s nastaveným počtem pokusů a čekáním mezi nimi, každý pokus je zaznamenán v [historii spuštění](../reference/execution-history.md) a uzel [Error Handler](../nodes/error-handler-node.md) se spustí automaticky, když uzel selže, takže obnova je součástí samotného workflow.

### Paralelní spouštění DAG

Workflow executor v Heymu používá plánovač orientovaného acyklického grafu (DAG). Nezávislé uzly běží automaticky paralelně, bez nutnosti konfigurace.

- Uzly na stejné úrovni závislosti jsou odesílány souběžně do thread poolu (`max_workers=8`)
- Jakmile libovolný uzel dokončí činnost, jeho downstream uzly jsou naplánovány
- [Merge Node](../nodes/merge-node.md) kombinuje výsledky paralelních větví
- Více běhů workflow probíhá souběžně; každý běh je zcela izolovaný

Paralelismus je výchozí chování, určené strukturou grafu.

Viz [Parallel Execution](../reference/parallel-execution.md).

### Škálování napříč instancemi

Nasměrujte druhou instanci Heymu na stejnou PostgreSQL databázi a ta se připojí jako worker. Běhy na pozadí jsou sdíleny mezi instancemi podle vah, které nastavíte, jeden zvolený leader udržuje plány, vyhodnocování alertů a obnovu po pádu prostřednictvím failoveru a každý běh zaznamenává instanci, která jej vykonala. Viz [Load Distribution](../reference/cluster.md).

### Agentic Kanban Board

[Board tab](../tabs/board-tab.md) je vestavěný Kanban board, kde samotné sloupce vykonávají workflow. Karta je persistentní agentic úloha, která nese kontext, historii konverzace, stav spuštění, výstupy a běhy workflow.

- **Řetězy workflow ve sloupcích** – Přesunutí karty do sloupce spustí řetěz workflow daného sloupce; **Agentic Kanban Model** (vaše credential + model) mapuje obsah karty na vstupy workflow a převádí výstupy zpět na čitelný text
- **Přílohy karet** – Přetáhněte soubory na kartu; dokumenty jsou extrahovány do textu a obrázky jsou před každým během předány modelům s podporou vision
- **Živé plátno běhu** – Otevřete aktivní běh uvnitř karty a sledujte, jak se vykonává na skutečném plátně workflow, uzel po uzlu
- **Sdílení v týmu** – Sdílejte boardy s uživateli nebo týmy s právy pro čtení/zápis; řetězy na sdílených boardech běží s credentials vlastníka, takže spolupracovníci nikdy nepotřebují vlastní
- **Viditelnost selhání** – Selhané karty zobrazují indikátor historie chyb a navazující běhy mohou pozastavit činnost a čekat na komentáře

Board je nativní součástí platformy: karty, workflow, credentials a živé běhy jsou všechny na jednom místě.

### Heym Drive: Vestavěné úložiště souborů

[Drive tab](../tabs/drive-tab.md) je úložiště souborů vestavěné do platformy. Soubory generované skilly a workflow (PDF, DOCX, CSV, obrázky) se tam ukládají automaticky a přílohy karet boardu jsou tam také ukládány.

- **Odkazy pro sdílení** – Veřejné nebo heslem chráněné (Basic Auth) odkazy pro stažení s volitelnou expirací a maximálním počtem stažení
- **Sdílení v týmu** – Sdílejte soubory pouze pro čtení se svými týmy a odeberte všechna týmová sdílení jednou akcí
- **Hromadné akce** – Vícenásobný výběr pomocí shift-click rozsahů, seskupte výběry do jednoho ZIP ke stažení nebo použijte jedno nastavení sdílení/hesla/smazání na mnoho souborů najednou
- **Přístup agenta** – Skilly se mohou přihlásit k odběru čtení souborů z Drive, takže agent může pracovat s dokumenty, které vytvořil vy nebo jiné workflow

Vygenerované artefakty získají trvalé, sdílitelné umístění uvnitř platformy.

## Sledování

### LLM Traces

[Traces Tab](../tabs/traces-tab.md) poskytuje plnou observabilitu pro každé volání LLM:

- Payloady požadavků a odpovědí
- Časování jednotlivých volání: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Názvy volání nástrojů, argumenty a výsledky
- Skilly předané modelu

Systém traces je účelově navržen pro ladění agentic chování, s plnými payloady požadavků a odpovědí a časováním jednotlivých volání.
### Sledování nákladů na LLM Tokeny

Každé volání LLM v Heym je automaticky oceněno. [Záložka Traces](../tabs/traces-tab.md) zobrazuje počty vstupních a výstupních tokenů pro každý trace spolu s cenou v USD v reálném čase, odvozenou ze synchronizované cenové tabulky.

- **Cena za trace** – Vstupní tokeny, výstupní tokeny a celková cena v USD zobrazená u každého řádku trace
- **Analytika nákladů** – KPI karty a graf nákladů podle modelu se aktualizují podle zvoleného časového rozsahu (1h / 24h / 7d / 30d / Vše)
- **Tabulka nákladů LLM** – Systémová tabulka v [záložce DataTable](../tabs/datatable-tab.md) je naplňována z Helicone každých 24 hodin; můžete přepsat ceny nebo přidat vlastní řádky pro modely, které zde ještě nejsou uvedeny
- **Upozornění na chybějící cenu** – U tras modelů bez cenové položky se zobrazí inline upozornění s přímým odkazem na tabulku nákladů

Každé spuštění nese vlastní náklady v USD, rozdělené podle modelu.

### Otevření produkčních běhů na živém plátně

Produkční workflow zůstává po spuštění mimo editor prohlížitelné. Otevřete libovolnou položku ve stavu **Running** z kteréhokoli dialogu Historie nebo otevřete aktivní běh uvnitř karty Agentic Kanban a Heym připojí běžný editor workflow k přesně tomuto spuštění.

- Uzly, které již dokončily, se okamžitě zobrazí se svými výsledky
- Aktuální uzel a čekající navazující uzly dále pulzují, jak spuštění postupuje
- Panel Debug přijímá stejné přírůstkové výsledky uzlů jako běh spuštěný z plátna
- Konečný výstup a zvýraznění spuštění dorazí bez dotazování (polling) nebo spuštění duplicitního běhu
- Zavřením editoru se pouze odpojí pozorovatel; nikdy nezruší produkční workflow

Pozorovatel používá SSE podporované snímkem spuštění napříč workery, takže funguje pro webhook, schedule, chat, MCP, integrační a Board triggery, i když běh vlastní jiný backendový worker.

### OpenTelemetry, analytika a upozornění

Heym vysílá [OpenTelemetry](../reference/opentelemetry.md) spany pro každý běh workflow, spuštění uzlu a vyvolání nástroje Agent, exportované přes OTLP/HTTP do Jaeger, Grafana Tempo, Honeycomb, Datadog nebo jakéhokoli jiného kompatibilního backendu.

[Záložka Analytics](../tabs/analytics-tab.md) sleduje počty běhů, míru úspěšnosti, dobu trvání a trendy pro každé workflow. [Upozornění](../tabs/alerts-tab.md) sledují počty chyb, dobu běhu, útratu za tokeny nebo USD a objem spuštění v časovém okně, poté spustí vámi zvolené notify workflow, takže upozornění dorazí do Slacku, e-mailem, na Telegram nebo kamkoli jinam, kam může dosáhnout uzel.

## Evaluate

### Vestavěné evaluace

[Záložka Evals](../tabs/evals-tab.md) vám umožňuje definovat testovací sady a spouštět je proti vašim agentním workflow:

- Vytvářejte testovací případy se vstupy a očekávanými výstupy nebo je generujte z promptu sady
- Spusťte jednu sadu proti několika modelům a porovnejte jejich výstupy vedle sebe
- Skórujte pomocí Exact Match, Contains nebo LLM-as-Judge s nezávislým modelem soudce
- Prohlížejte si pass/fail, skutečné vs. očekávané a historii běhů

Změňte prompt nebo model, znovu spusťte sadu a porovnejte výsledky, než se změna dostane do produkce.

## Control

### Human-in-the-Loop (HITL)

Heym má vestavěný systém [Human-in-the-Loop](../reference/human-in-the-loop.md), který umožňuje agentům pozastavit spuštění, požádat o lidskou kontrolu a pokračovat přesně tam, kde skončily.

- **Kontrolní body agenta** – Povolte `hitlEnabled` na libovolném uzlu Agent a přidělíte mu nástroj `request_human_review`. Agent rozhodne, kdy rozhodnutí vyžaduje lidský dohled, a zavolá nástroj se shrnutím a konceptem.
- **Veřejné URL pro kontrolu** – Každý požadavek na kontrolu vygeneruje zabezpečený jednorázový odkaz na `/review/{token}` (TTL 168 hodin). Recenzenti mohou **přijmout**, **upravit a pokračovat** nebo **odmítnout** bez přihlášení.
- **Snímky spuštění** – Workflow zmrazí svůj úplný stav (historie konverzace, proměnné, výsledky nástrojů), takže po odpovědi recenzenta pokračuje přesně tam, kde se pozastavilo.
- **Větev oznámení** – Volitelný výstupní handle `review` vám umožňuje zapojit tok oznámení (Slack, e-mail, webhook), který se spustí při požadavku na kontrolu.
- **Zásady schvalování nástrojů MCP** – Písemné pokyny HITL jsou interpretovány do rozsahů schválení (`always` / `once` / `never`), takže agent může automaticky schvalovat nástroje s nízkým rizikem a eskalovat ty s vysokým rizikem.
- **Více kontrolních bodů** – Jedno spuštění agenta se může pozastavit pro kontrolu vícekrát; každý kontrolní bod je nezávislý.

Veřejné URL pro kontrolu, úprava a pokračování, větvení oznámení a obnovení ze snímku fungují všechny ze stejného kontrolního bodu agenta.

Úplnou referenci naleznete v [Human-in-the-Loop](../reference/human-in-the-loop.md).

### Ochranné mechanismy LLM

Heym má vestavěné [Guardrails](../reference/guardrails.md) na uzlech [LLM](../nodes/llm-node.md) i [Agent](../nodes/agent-node.md), takže můžete zablokovat nebezpečný obsah, než se odpověď modelu dostane do navazujících kroků.

- **Přepínač zabezpečení na úrovni uzlu** – Povolte guardrails přímo na uzlu, který generuje nebo zpracovává obsah určený uživateli
- **Široké pokrytí zásad** – Blokujte násilí, nenávistné projevy, sexuální obsah, NSFW/vulgarismy, obtěžování, nezákonnou činnost, požadavky na osobní údaje a pokusy o prompt injection
- **Multilingvální detekce** – Aplikujte stejná bezpečnostní pravidla napříč turečtinou, angličtinou, arabštinou, španělštinou a dalšími jazyky
- **Nativní fallback ve workflow** – Když je zpráva zablokována, uzel vyvolá typovanou chybu workflow, kterou můžete směrovat přes [Error Handler](../nodes/error-handler-node.md)

Bezpečnostní zásady žijí přímo v konfiguraci LLM a Agent a zapojují se přímo do větvení workflow a zpracování chyb.
### Přístup, přihlašovací údaje a audit

Agenti jednají s reálnými přihlašovacími údaji, takže přístup je součástí správy. [Přihlašovací údaje](../reference/credentials.md) jsou šifrovány v klidu, po vytvoření maskovány a sdílitelné s uživateli nebo [týmy](../reference/teams.md), přičemž týmy také sdílejí workflowy, proměnné, vektorová úložiště a soubory Drive. [Single sign-on](../reference/sso.md) se připojuje k jakémukoli poskytovateli OpenID Connect, včetně Okta, Entra ID, Keycloak, Auth0 a Google. [Auditní stopa](../reference/audit.md) zaznamenává každou akci relevantní pro bezpečnost spolu s jejím aktérem, cílem a výsledkem, streamovaná s protokoly vašeho kontejneru do sběrače protokolů nebo SIEM, který již provozujete.

### Vlastní hostování, vaše data zůstávají vaše

Heym běží na vaší infrastruktuře. Workflowy, přihlašovací údaje, historie spuštění a stopy žijí ve vaší vlastní databázi a volání modelů jdou z vašich serverů k poskytovateli, kterého si vyberete, nebo k modelu, který hostujete sami prostřednictvím Ollama nebo vLLM. Pro agenty, kteří zpracovávají citlivé dokumenty, zákaznická data nebo proprietární znalostní báze, je to často tvrdý požadavek.

Heym je licencován pod **MIT License s podmínkou Commons Clause**. Zdrojový kód je source-available: můžete jej volně používat, upravovat a hostovat sami. Commons Clause omezuje prodej softwaru, včetně nabízení placeného hostingu nebo konzultačních/podpůrných služeb, jejichž hodnota je podstatně odvozena od Heymu. Pro komerční licencování, podniková nasazení nebo profesionální podporu kontaktujte [enterprise@heym.run](mailto:enterprise@heym.run).

## Zveřejnění

### API a streamování

Workflowy jsou volatelná přes HTTP na `/api/workflows/{workflow_id}/execute`, což vrací JSON, a na `/api/workflows/{workflow_id}/execute/stream`, což streamuje události uzlů jako Server-Sent Events, zatímco běh postupuje. Obě sdílejí autentizaci na úrovni workflowu, omezení rychlosti a cachování odpovědí. Viz [Webhooky](../reference/webhooks.md) a [SSE Streaming](../reference/sse-streaming.md).

### Integrace MCP (Model Context Protocol)

Heym má nativní podporu [MCP](../tabs/mcp-tab.md) na obou stranách:

- **Jako klient**: Uzly agentů se připojují k externím MCP serverům (Filesystem, Browserbase, vlastní nástroje) přes stdio nebo SSE a automaticky konzumují jejich nástroje
- **Jako server**: Workflowy s zapnutým MCP se stávají nástroji na výchozím serveru na `/api/mcp/sse`, nebo na pojmenovaných serverech s vlastní URL a API klíčem, takže Claude Desktop, Cursor a další MCP klienti mohou přímo volat vaše Heym workflowy

Agenti mohou konzumovat několik MCP serverů najednou a jakýkoli workflow se může stát nástrojem pro externího MCP klienta.

### Portál: Publikujte workflowy jako chatovací UI

Funkce [Portál](../reference/portal.md) promění jakýkoli workflow na veřejné chatovací rozhraní na `/chat/{slug}`:

- Volitelná autentizace s přihlašovacími údaji pro jednotlivé uživatele
- Streamované spuštění (pokrok uzlů v reálném čase)
- Podpora nahrávání souborů
- Historie konverzace s více tahy

Týmy dodávají interní nástroje, chatboty pro zákazníky a AI-poháněné formuláře z workflowu a URL, bez nutnosti psát frontendový kód.

### Dashboardy poháněné workflowy

[Záložka Dashboard](../tabs/dashboard-tab.md) je uživatelsky vytvořená reportovací plocha, kde každý widget grafu je poháněn vlastním skrytým Heym workflowem. Widget může volat API, dotazovat BigQuery, prohledávat RAG/vektorová úložiště, spouštět LLM kroky, transformovat řádky a skončit s [uzlem Chart Output](../nodes/chart-output-node.md). Widgety můžete vytvářet ručně, generovat je pomocí AI, později je doladit, cachovat výsledky a vizuálně přeskupovat mřížku.
## Srovnání s nástroji pro automatizaci Workflow

Mnoho týmů přichází do Hey mu z nástrojů pro automatizaci Workflow. Tabulka níže srovnává Heym s n8n, Zapier a Make.com v oblastech, které jsou důležité, jakmile agenti běží v produkci, a poznámky pod tabulkou citují oficiální dokumentaci, z níž srovnání vychází. Podrobnější pohled na jednotlivé nástroje najdete na srovnávacích stránkách [heym.run/compare](https://heym.run/compare).

| Schopnost | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Vestavěný uzel LLM | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + větvení podle stavu | ✓ | omezené¹¹ | –¹¹ | omezené¹¹ |
| Vestavěný uzel Agent (volání nástrojů) | ✓ | ✓ | ✓ | ✓ |
| Orchestrace více agentů | ✓ | ✓ | omezené | omezené |
| Uzly pro kódovací agenty (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Vestavěný RAG / vektorové úložiště | ✓ | ✓ | omezené¹ | plugin² |
| Čtení / zápis WebSocket | ✓ | omezené¹² | –¹³ | –¹⁴ |
| Tvůrce Workflow v přirozeném jazyce | ✓ | omezené³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Otevření probíhajícího běhu na živém plátně | ✓ | omezené¹⁹ | omezené¹⁹ | –¹⁹ |
| Dashboardy poháněné Workflow | ✓ | omezené¹⁷ | omezené¹⁷ | omezené¹⁷ |
| Agentický Kanban board | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Systém Skills pro agenty | ✓ | – | – | – |
| Vestavěný souborový disk (odkazy pro sdílení, týmy) | ✓ | omezené²² | omezené²² | –²² |
| Uzel pro automatizaci prohlížeče (Playwright) | ✓ | omezené²³ | omezené²³ | –²³ |
| Inspekce LLM trace | ✓ | omezené⁴ | – | ✓ |
| Export trasování OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Sledování nákladů na LLM tokeny (USD) | ✓ | –¹⁵ | –¹⁵ | omezené¹⁵ |
| Vestavěné evals pro AI Workflow | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | omezené⁶ | omezené⁷ |
| LLM guardrails | ✓ | ✓⁸ | ✓⁸ | omezené⁸ |
| Automatická komprese kontextu | ✓ | – | – | – |
| Paralelní spouštění DAG | ✓ | omezené⁹ | – | – |
| Možnost self-hostingu, dostupný zdrojový kód | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL pro dynamická data | ✓ | ✓ | omezené | ✓ |
> **Poznámky pod čarou:** ¹ Zapier Knowledge Sources — žádné vystavené vector store ani kontrola embeddingů. ² Make.com má moduly Pinecone/Qdrant, ale žádný nativní RAG uzel. ³ n8n AI Workflow Builder je pouze cloudová beta s limity kreditů. ⁴ n8n zobrazuje mezilehlé kroky; úplné trasování vyžaduje nástroje třetích stran. ⁵ n8n podporuje schvalování volání AI nástrojů prostřednictvím chatu, e-mailu a kolaboračních kanálů, ale nepořizuje snímek a neobnovuje celé spuštění tak jako Heym. ⁶ Zapier Human in the Loop podporuje schvalování a sběr dat uvnitř Zaps, ale nejde o systém kontrolních bodů s veřejnou kontrolou a obnovou ze snímku. ⁷ Make.com nabízí Human in the Loop jako podnikovou aplikaci s žádostmi o kontrolu a výsledky upraveno/schváleno/zrušeno, ale zůstává omezený tarifem a méně agentně orientovaný. ⁸ n8n dodává vyhrazený uzel Guardrails, Zapier dodává AI Guardrails napříč svými AI produkty a Make.com dokumentuje pravidla agentů plus kontrolní toky, ale nikoli srovnatelnou samostatnou funkci guardrails, proto je Make označen jako omezený. ⁹ n8n ve výchozím nastavení spouští sekvenčně; paralelismus vyžaduje obcházení pomocí dílčích workflow. ¹⁰ Sustainable Use License — zdarma pro vlastní hostování pro interní použití, komerční redistribuce omezena. ¹¹ K 22. dubnu 2026 oficiální dokumentace n8n popisuje dávkování HTTP a vzory smyček/čekání spíše než nativní větev stavu dávky LLM, oficiální dokumentace aplikace ChatGPT od Zapier uvádí žádné triggery a pouze obecnou beta verzi API Request a oficiální stránka integrace OpenAI od Make vystavuje dávkové akce jako create/watch completed, ale nikoli prvotřídní uzel LLM s větvením stavu, proto jsou n8n/Make označeny jako omezené a Zapier je pro tento konkrétní vzor workflow označen jako nedostupný. ¹² Oficiální dokumentace n8n pokrývá uzly HTTP Webhook a HTTP Request plus rozšiřitelnost pomocí Code/custom/community, ale nemohl jsem najít prvotní uzel WebSocket trigger/send, proto je n8n označen jako omezený. ¹³ Oficiální dokumentace Zapier pokrývá příchozí webhooky a odchozí webhook/API požadavky pouze přes HTTP, nikoli nativní kroky WebSocket trigger nebo send. ¹⁴ Oficiální dokumentace Make pokrývá moduly Webhooks a moduly HTTP(S) request, ale nemohl jsem najít nativní modul WebSocket trigger nebo send. ¹⁵ n8n nemá nativní sledování nákladů na tokeny LLM; existují komunitní obcházející workflow, ale vyžadují ruční instalaci a volání API po spuštění (otevřený požadavek na funkci k květnu 2026). Zapier nevystavuje uživatelům počet tokenů ani náklady v USD na spuštění; AI kroky spotřebovávají pouze úlohy. Dashboard kreditů Make.com částečně odráží spotřebu tokenů pro AI hostovanou na Make (od srpna 2025), ale připojení s klíčem API třetích stran se účtují jako 1 operace = 1 kredit bez počítání tokenů; není k dispozici žádný rozpis nákladů v USD na spuštění podle modelu. ¹⁶ Heym vysílá nativní OpenTelemetry spany (jeden na spuštění workflow plus jeden na uzel) přes OTLP/HTTP do jakéhokoli kompatibilního backendu, s propagací W3C trace-context a bez instrumentačního kódu, konfigurováno pomocí env proměnných `HEYM_OTEL_*` a ve výchozím nastavení zakázáno. n8n má dokumentovanou integraci trasování OpenTelemetry pro spuštění workflow a uzlů. Zapier a Make.com k červnu 2026 nedokumentují export OpenTelemetry svých spuštění workflow/scénářů. ¹⁷ n8n dokumentuje dashboard Insights pro metriky produkčních spuštění, Zapier dokumentuje Zap History plus Task Usage a Make.com dokumentuje Scenario History; jde o monitorovací/historické plochy, nikoli o vlastní widgety dashboardu podložené libovolnou logikou workflow jako karta Dashboard v Heym. ¹⁸ Heym Workflow Analyzer spouští workflow, když je to možné, čte výsledek spuštění a generuje sdílený upravitelný Markdown report pokrývající oblasti zlepšení, účel a chování krok za krokem. n8n dokumentuje AI Workflow Builder pro vytváření/vylaďování/ladění workflow, Zapier dokumentuje AI řešení problémů pro chybové běhy Zap a Make.com dokumentuje historii scénářů plus kroky uvažování AI agenta, ale jejich veřejná dokumentace nepopisuje stejný dokument sdílené analýzy workflow s povědomím o spuštění. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) uvádí běžící spuštění a může načíst data z předchozího spuštění do editoru, zatímco [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) vystavuje stav running ve svém editoru. [Make Scenario History](https://help.make.com/scenario-history) dokumentuje podrobnosti běhu a logy. Jejich veřejná dokumentace, zkontrolovaná 18. července 2026, nepopisuje přesný tok Heym: otevřít libovolný probíhající produkční běh z History nebo karty Kanban, obnovit jeho aktuální snímek uzlu a pokračovat v přijímání animace uzlů a Debug logů na stejném plátně. ²⁰ Uzly Heym [Codex](../nodes/codex-node.md) a [OpenCode Go](../nodes/opencode-go-node.md) spouštějí skutečné CLI kódovacího agenta v izolovaném pracovním prostoru Heym proti repozitáři GitHub — klonovat, upravit, vytvořit diff, pushnout větev, otevřít pull request — jako prvotřídní krok workflow. K 20. červenci 2026 žádný konkurent nedokumentuje ekvivalent: [OpenAI uzel](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) v n8n pokrývá volání chat/assistant API, nikoli kódovacího agenta na úrovni repozitáře, a nativní podpora Codex zůstává komunitním požadavkem; vlastní blog Zapier dokumentuje opačný směr — [Codex řídící nástroje Zapier prostřednictvím Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — nikoli Codex jako krok Zap; moduly OpenAI v Make.com vystavují completions/assistants/batch akce, nikoli kódovacího agenta, který klonuje repozitáře a otevírá PR. ²¹ [Karta Board](../tabs/board-tab.md) v Heym je vestavěná agentní Kanban tabule, jejíž sloupce spouštějí workflow a jejíž karty nesou kontext, historii konverzace, stav spuštění a běhy. n8n ([integrace Kanban Tool](https://n8n.io/integrations/kanban-tool/)), Zapier ([integrace Kanban Tool](https://zapier.com/apps/kanbantool/integrations)) a Make.com ([integrace Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) se pouze připojují k aplikacím kanban třetích stran, jako jsou Kanban Tool, Wekan nebo NocoDB; žádný k 20. červenci 2026 nedokumentuje vestavěnou tabuli, která spouští vlastní workflow. ²² n8n ukládá binární data spuštění interně (volitelně na [externím úložišti kompatibilním s S3](https://docs.n8n.io/hosting/scaling/external-storage/)), ale nedokumentuje žádný uživatelsky orientovaný souborový disk s odkazy pro sdílení nebo týmovým sdílením, proto je označen jako omezený. [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) zpracovává soubory pouze po dobu běhu Zap a [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) uchovává malé textové hodnoty, proto je Zapier označen jako omezený. [Data stores](https://help.make.com/l6du-data-stores) v Make.com uchovávají strukturované záznamy a jeho [zpracování souborů](https://help.make.com/working-with-files) předává soubory mezi aplikacemi bez trvalého vestavěného úložiště, proto je Make označen jako nedostupný. ²³ [Uzel Playwright](../nodes/playwright-node.md) v Heym je prvotní automatizace prohlížeče s režimem vizuálních kroků, AI generovanými kroky a režimem plného kódu. n8n nabízí pouze komunitní balíčky jako [n8n-playwright](https://github.com/toema/n8n-playwright) se stále otevřeným [požadavkem na funkci nativních uzlů automatizace prohlížeče](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), proto je označen jako omezený. Zapier Agents mohou [procházet a číst stránky prostřednictvím webového prohlížení a rozšíření Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), ale Zapier nedokumentuje žádný skriptovaný krok automatizace prohlížeče, proto je označen jako omezený. Make.com k 20. červenci 2026 dokumentuje HTTP moduly a aplikace pro scraping třetích stran spíše než jakýkoli nativní modul automatizace prohlížeče.
## Související

- [Úvod](./introduction.md) – Přehled platformy
- [Rychlý start](./quick-start.md) – Vytvořte svůj první workflow
- [Analýza workflow](../reference/workflow-analysis.md) – Generujte sdílené reporty workflow s ohledem na běhy a zpětnou vazbu pro zlepšení
- [Záložka Dashboard](../tabs/dashboard-tab.md) – Vytvářejte dashboardy postavené na workflow s AI generovanými widgety grafů
- [Uzel Agent](../nodes/agent-node.md) – LLM uzel s voláním nástrojů, MCP a dovednostmi
- [Architektura agenta](../reference/agent-architecture.md) – Sub-agenti, orchestrátor a dispatch nástrojů
- [Záložka Board](../tabs/board-tab.md) – Agentický Kanban board se sloupci spouštějícími workflow
- [Uzel Codex](../nodes/codex-node.md) – Spusťte kódovacího agenta OpenAI Codex proti GitHub repozitáři
- [Uzel OpenCode Go](../nodes/opencode-go-node.md) – Na poskytovateli nezávislý kódovací agent v zabezpečeném kontejneru
- [Záložka Drive](../tabs/drive-tab.md) – Vestavěné úložiště souborů s odkazy pro sdílení, týmy a hromadnými akcemi
- [Uzel Playwright](../nodes/playwright-node.md) – Automatizace prohlížeče první strany s AI kroky a kódovým režimem
- [Uzel RAG / Vector Store](../nodes/rag-node.md) – Vektorové vyhledávání a vkládání dokumentů (Qdrant nebo Postgres pgvector)
- [AI asistent](../reference/ai-assistant.md) – Tvůrce workflow v přirozeném jazyce
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Kontrolní body agenta s veřejnými URL pro revizi
- [Guardrails](../reference/guardrails.md) – Zablokujte nebezpečné prompty dříve, než se dostanou k vašim modelům
- [Záložka Traces](../tabs/traces-tab.md) – Pozorovatelnost volání LLM
- [Záložka Evals](../tabs/evals-tab.md) – Testovací sady pro AI workflow
- [Záložka Alerts](../tabs/alerts-tab.md) – Upozornění na prahové hodnoty u chyb, trvání, nákladů a objemu běhů
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Exportujte spany běhů, uzlů a nástrojů přes OTLP
- [Distribuce zátěže](../reference/cluster.md) – Sdílejte běhy mezi instancemi s převzetím role leadera při selhání
- [Single Sign-On](../reference/sso.md) – Přihlaste se prostřednictvím libovolného poskytovatele OpenID Connect
- [Audit Logging](../reference/audit.md) – Bezpečnostně relevantní akce s aktérem, cílem a výsledkem
- [Portál](../reference/portal.md) – Publikujte workflow jako veřejná chatovací rozhraní
- [Paralelní provádění](../reference/parallel-execution.md) – Souběžné provádění založené na DAG
- [Záložka MCP](../tabs/mcp-tab.md) – Konfigurace MCP serveru a klienta
