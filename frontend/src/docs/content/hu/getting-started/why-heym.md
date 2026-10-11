# Miért a Heym

A Heym olyan infrastruktúra, amely az AI-ügynökök éles környezetben történő futtatására és irányítására szolgál. Egy önállóan üzemeltetett runtime az ügynök életciklusának minden szakaszát lefedi.

Egy prototípus-ügynökhöz modellre, promptra és néhány eszközre van szükség. Egy éles ügynökhöz ezen felül triggerre és újrapróbálkozásokra, mentett állapotra, amikor egy személyre vár, minden modell- és eszközhívás naplózására, minden futás költségére, a változás kiadása előtti tesztekre, valamint világos korlátokra arra vonatkozóan, hogy mit tehet önállóan. A Heym mindezt egy helyen tartja, így az a rendszer, amelyet a vásznon megtervez, az a rendszer, amely fut. Építsen ügynökalapú rendszereket, majd futtassa azokat magabiztosan.

## Egy runtime az ügynök életciklusához

| Szakasz | Mit nyújt a Heym |
|---|---|
| **Építés** | Állítson össze ügynököket és determinisztikus lépéseket a vásznon, generálja azokat az [AI Assistant](../reference/ai-assistant.md) segítségével, vagy induljon ki [Templates](../tabs/templates-tab.md) sablonokból és hordozható skillekből. |
| **Orchestrálás** | Koordinálja az ügynököket, [sub-agents](../reference/agent-architecture.md) al-ügynököket, coding agenteket, RAG-ot, böngészőautomatizálást és eszközöket explicit adatfolyammal és [parallel execution](../reference/parallel-execution.md) párhuzamos végrehajtással. |
| **Futtatás** | Indítson futásokat [webhooks](../reference/webhooks.md) webhookokból, ütemezésekből és esemény-[triggers](../reference/triggers.md) triggerekből, csomópontonkénti újrapróbálkozásokkal, [error handling](../nodes/error-handler-node.md) hibakezeléssel és [load distribution](../reference/cluster.md) terheléselosztással a példányok között. |
| **Megfigyelés** | Vizsgáljon meg minden végrehajtást a [history](../reference/execution-history.md) előzmények, [LLM traces](../tabs/traces-tab.md) LLM-nyomok, futásonkénti USD-költség, a vásznon megjelenő élő futások, [analytics](../tabs/analytics-tab.md) elemzések, [alerts](../tabs/alerts-tab.md) riasztások és [OpenTelemetry](../reference/opentelemetry.md) export segítségével. |
| **Kiértékelés** | Tesztelje a promptokat és modelleket a várt kimenetekkel szemben az [Evals](../tabs/evals-tab.md) kiértékelésekben, LLM-as-Judge pontozással és egymás melletti modell-összehasonlítással. |
| **Irányítás** | Tartsa az embereket a kontrollban [review checkpoints](../reference/human-in-the-loop.md) ellenőrzési pontokkal és [guardrails](../reference/guardrails.md) guardrail-ekkel, valamint szabályozza a hozzáférést titkosított [credentials](../reference/credentials.md) hitelesítő adatokkal, [teams](../reference/teams.md) csapatokkal, [single sign-on](../reference/sso.md) egyszeri bejelentkezéssel és [audit trail](../reference/audit.md) auditnaplóval. |
| **Közzététel** | Szolgálja ki a workflow-kat REST és [SSE](../reference/sse-streaming.md) SSE felületeken, [MCP](../tabs/mcp-tab.md) MCP-eszközként, [Portal](../reference/portal.md) Portal chat-felületekként és [dashboard](../tabs/dashboard-tab.md) irányítópult-widgetekként. |

## Építés

### AI Assistant: Workflow-k építése természetes nyelvvel

Az [AI Assistant](../reference/ai-assistant.md) egy chatpanel a workflow-szerkesztőn belül. Írja le, mit szeretne, például „hozz létre egy workflow-t, amely felhasználói bemenetet fogad, megkeresi a tudásbázisomat, és GPT-4o használatával válaszol", és az asszisztens olyan csomópontokat és éleket generál, amelyek azonnal a vászonra kerülnek.

- A saját LLM hitelesítő adatait használja (bármely támogatott modell)
- Támogatja a **hangbevitelt** a kéz nélküli workflow-tervezéshez
- Automatikusan alkalmazza az AI-válaszból származó érvényes workflow JSON-t a vászonra
- Valós időben streameli a válaszokat

Az asszisztens közvetlenül a szerkesztőn belül működik, és valós időben streameli a csomópontokat a vászonra, és minden, amit generál, szerkeszthető marad, akárcsak a kézzel elhelyezett csomópontok.

### Skills rendszer

A skillek hordozható képességcsomagok, egy `SKILL.md` utasításfájl plusz opcionális Python-szkriptek, amelyek bármely Agent csomópontra ráhelyezhetők.

- A skill utasításai az ügynök rendszer-promptja elé kerülnek
- A skillben lévő Python-fájlok hívható eszközökké válnak
- A skillek újrafelhasználhatók a workflow-k között, és `.zip` archívumként megoszthatók

Ez ahhoz hasonlítható, mintha az ügynökének egy munkaköri leírást és egy eszköztárat adna egyetlen mozdulattal.

### Workflow Analyzer: Futás-tudatos visszajelzés

A [Workflow Analysis](../reference/workflow-analysis.md) panel egy futás-tudatos dokumentációs és visszajelzési eszköz, amely a szerkesztőbe van beépítve. Kattintson az **Analyze** gombra, válasszon egy LLM hitelesítő adatot és modellt, és a Heym egy szerkeszthető Markdown-jelentést generál az aktuális workflow-ról.

Ellentétben egy statikus jegyzettel, az elemző először lefuttatja a workflow-t, amikor csak lehetséges, és az eredményt belefoglalja a promptba. A jelentés lefedi a fejlesztési területeket, a workflow célját és a csomópontok lépésenkénti magyarázatát. Ha már létezik jelentés, a **Reanalyze** egy külön előnézetet streamel, így elfogadhatja az új verziót, vagy megtarthatja a jelenlegi megosztott dokumentumot.

## Orchestrálás
### Beépített LLM- és Agent csomópontok

A Heym [Agent csomópontja](../nodes/agent-node.md) szorosan integrált tool-calling ciklust futtat inline Python eszközökkel, MCP kapcsolatokkal és hordozható skills rendszerrel, mindezt éles üzemű agentekhez tervezve.

A Heym egyszerű [LLM csomópontja](../nodes/llm-node.md) szintén túlmutat egyetlen prompt-válasz lépésen. A támogatott OpenAI és OpenAI-kompatibilis endpointok esetében átválthat **Batch API módba**, így egy csomópont egy prompt-tömböt küld be egy alacsonyabb költségű, szolgáltatóra jellemző batch kérésben. A vászon ezután egy dedikált `batchStatus` ágat tesz elérhetővé, amely akkor aktiválódik, amikor a batch olyan állapotokon halad át, mint a `pending`, `processing` és `completed`.

Ez azt jelenti, hogy az LLM csomópont egyszerre két dolgot tud elvégezni:

- Futtatja a fő batch kérést, és a normál ágon visszaadja a végső, tételenkénti kimeneteket
- Értesítési vagy naplózási logikát indít minden jelentős batch állapotfrissítésnél anélkül, hogy a folyamat egyedi polling ciklussá alakulna

A batch végrehajtás első osztályú LLM workflow primitív, a szolgáltató és modell képesség-ellenőrzésekkel a csomópont felületén.

Az **Agent csomópont** az agent-orkesztráció magja a Heymben:

- **Tool calling** – Az agent ciklusban iterál a tool hívásokon, amíg végleges választ nem produkál
- **Python eszközök** – Egyedi eszközök definiálhatók inline, teljes Python használatával; az agent futásidőben hívja meg őket
- **MCP kapcsolatok** – Csatlakozás bármely [Model Context Protocol](https://modelcontextprotocol.io/) szerverhez (stdio vagy SSE), és az agent automatikusan megkapja annak összes eszközét
- **Skills** – Húzzon egy `.zip` vagy `.md` fájlt egy agentre a rendszerkontextus kiterjesztéséhez és Python eszközkészlet hozzáadásához
- **Sub-workflow hívások** – Az agent más Heym workflow-kat hívhat meg eszközként, összetett viselkedést komponálva egyedi kód nélkül

A teljes referenciáért lásd az [Agent csomópont](../nodes/agent-node.md) és az [Agent architektúra](../reference/agent-architecture.md) oldalakat.

### Multi-Agent orkesztráció

A Heym támogatja az **orchestrator mintát** első osztályú vizuális primitívekkel:

- Egy agent **orchestratorként** működik (`isOrchestrator: true`), és kap egy `call_sub_agent` eszközt
- Feladatokat delegál a névvel ellátott **sub-agenteknek** ugyanazon a vásznon
- A sub-agentek maguk is hívhatnak más agenteket vagy sub-workflow-kat (maximális mélység: 5)
- **Párhuzamos végrehajtás**: Amikor az orchestrator egy körben több sub-agentet hív meg, azok párhuzamosan futnak a gyorsabb eredmény érdekében

Ez olyan architektúrákat tesz lehetővé, mint egy tervező agent, amely a munkát egy kutatóhoz, egy kódolóhoz és egy összegzőhöz irányítja, mindezt vizuálisan összekötve egyedi orkesztrációs kód nélkül.

A végrehajtás részleteiért lásd az [Agent architektúra](../reference/agent-architecture.md) oldalt.

### Kódoló agentek workflow csomópontokként

A Heym két csomópontot kínál, amelyek egy valódi kódoló agentet futtatnak workflow lépésként, nem chat completionként:

- **[Codex csomópont](../nodes/codex-node.md)** – Az OpenAI Codex CLI-t futtatja egy izolált Heym munkaterületen egy GitHub repository ellenében. Támogatja a **Sign in with ChatGPT**-t (PKCE OAuth az Ön Plus/Pro előfizetésén, tokenenkénti API költség nélkül) vagy egy access tokent, klónozza a repót, hagyja, hogy a Codex szerkessze a kódot, és visszaadja a `summary`, `diff`, `changedFiles` értékeket, valamint egy draft `pullRequestUrl`-t.
- **[OpenCode Go csomópont](../nodes/opencode-go-node.md)** – Ugyanaz a repository workflow a szolgáltatófüggetlen OpenCode gateway-en keresztül (Kimi, DeepSeek, Qwen és mások), egy **megerősített eldobható konténerben** végrehajtva: minden képesség elvéve, csak olvasható root, pid/memória/CPU limitek. A GitHub token a sandboxon kívül marad: a Heym minden git és GitHub műveletet host oldalon végez, így a generált kód nem tudja kiszivárogtatni a push hitelesítő adatokat.

Ez azt jelenti, hogy egy workflow egy webhookból triage-olhat egy hibát, átadhatja a repót egy kódoló agentnek, megvárhatja a draft PR-t, és közzéteheti a linket Slacken, teljesen automatizáltan, telepítésenként konfigurálható erőforrás-limitekkel.

### Beépített RAG pipeline

A Heym tartalmaz egy [RAG / Vector Store csomópontot](../nodes/rag-node.md) és egy kezelt [Vectorstores](../tabs/vectorstores-tab.md) fület. Ön a következőket teheti:

- Kiválaszthatja a vektor backendet: **Qdrant** (külső szerver) vagy **Postgres (pgvector)**, amely a vektorokat a Heym saját adatbázisában tárolja, futtatandó extra szolgáltatás nélkül
- Dokumentumokat szúrhat be egy vektor store-ba közvetlenül egy workflow csomópontból
- Szemantikus keresést végezhet, és az eredményeket egy LLM vagy Agent csomópontba táplálhatja
- Az eredményekre olyan kifejezésekkel hivatkozhat, mint a `$ragNode.results.map("item.payload.content").join("\n\n")`

A Heymben a RAG két csomópont, teljes kontrollal az embeddings és a retrieval felett.

### Böngésző-automatizálás Playwright-tal

A [Playwright csomópont](../nodes/playwright-node.md) első féltől származó böngésző-automatizálás a vásznon.

- **Steps mód** – Navigate, click, type, fill, screenshot, extract és scroll műveletek vizuális összeállítása
- **AI steps automatikus javítással** – Írjon le egy műveletet természetes nyelven, és egy LLM generálja a Playwright műveleteket; a sikertelen selectorok automatikusan javíthatók, és a generált lépések cache-elhetők a jövőbeli LLM hívások kihagyásához
- **Run Code mód** – A csomópont átválthat teljes Playwright Pythonra összetett folyamatokhoz (alapértelmezés szerint letiltva; engedélyezés esetén a Heym megerősített sandboxában fut)
- **Hitelesített munkamenetek** – Cookie-k/`storageState` visszaállítása futtatás előtt, bejelentkezés ellenőrzése selector-ellenőrzéssel, és visszaesés scriptelt bejelentkezési lépésekre
- **Hálózati rögzítés** – Opcionálisan JSON válaszok, headerek, cookie-k és böngésző tároló gyűjtése az eredmények mellett

A Heym a böngészőt normál csomópontként kezeli, ugyanazokkal a kifejezésekkel, hitelesítő adatokkal és hibakezeléssel, mint bármi más.
### Expression DSL

A Heym [Expression DSL](../reference/expression-dsl.md) tiszta, hatékony szintaxist biztosít a felsőbb csomópontok adatainak hivatkozásához:

- `$input.text` – Input csomópont adatai
- `$nodeName.field` – Bármely felsőbb csomópont kimeneti mezője
- `$global.variableName` – Perzisztens globális változók
- Tömb segédfüggvények: `.first()`, `.map("field")`, `.join("\n")`

Az Expression DSL minden string mezőben működik, beleértve a Promptokat, HTTP fejléceket, feltételeket és beállított értékeket, így az adatok explicit módon mozognak a lépések között. A DSL egyensúlyt teremt a hatékonyság és az olvashatóság között anélkül, hogy teljes JavaScript-ismeretekre lenne szükség.

## Futtatás

### Trigger, Újrapróbálkozások és Hibaútvonalak

Egy Workflow számos helyről indulhat. Az [Input](../nodes/input-node.md) csomópontok HTTP [Webhookokat](../reference/webhooks.md) fogadnak, a [Cron](../nodes/cron-node.md) ütemezés szerint fut, az esemény [Triggerek](../reference/triggers.md) pedig Telegramból, Discordból, Slackből, IMAP postaládákból, WebSocket streamekből, RabbitMQ sorokból, fájlfeltöltésekből és Heym platform eseményekből indítanak futtatásokat.

A hibák a gráfon belül kerülnek kezelésre. Bármely csomópont újrapróbálkozhat hiba esetén meghatározott számú kísérlettel és a közöttük lévő várakozással, minden kísérlet rögzítésre kerül az [execution history](../reference/execution-history.md) ban, és egy [Error Handler](../nodes/error-handler-node.md) csomópont automatikusan fut, amikor egy csomópont meghibásodik, így a helyreállítás magának a Workflow-nak a része.

### Párhuzamos DAG Végrehajtás

A Heym Workflow végrehajtója egy irányított aciklikus gráf (DAG) ütemezőt használ. A független csomópontok automatikusan párhuzamosan futnak, konfiguráció nélkül.

- Az azonos függőségi szinten lévő csomópontok egyidejűleg kerülnek kiosztásra egy szálkészletbe (`max_workers=8`)
- Amint bármely csomópont befejeződik, a leszármazott csomópontjai ütemezésre kerülnek
- A [Merge Node](../nodes/merge-node.md) egyesíti a párhuzamos ágak eredményeit
- Több Workflow futtatás egyidejűleg történik; minden futtatás teljesen izolált

A párhuzamosság az alapértelmezett viselkedés, amelyet a gráf szerkezete határoz meg.

Lásd: [Parallel Execution](../reference/parallel-execution.md).

### Skálázás Példányok Között

Mutasson egy második Heym példányt ugyanarra a PostgreSQL adatbázisra, és az workerként csatlakozik. A háttérfuttatások megoszlanak a példányok között az Ön által beállított súlyok szerint, egy megválasztott vezető tartja fenn az ütemezéseket, riasztásértékelést és összeomlás-helyreállítást egy failover során, és minden futtatás rögzíti a végrehajtó példányt. Lásd: [Load Distribution](../reference/cluster.md).

### Agentic Kanban Tábla

A [Board tab](../tabs/board-tab.md) egy beépített Kanban tábla, ahol maguk az oszlopok hajtják végre a Workflow-kat. Egy kártya egy perzisztens agentic feladat, amely kontextust, beszélgetési előzményeket, végrehajtási állapotot, kimeneteket és Workflow futtatásokat hordoz.

- **Oszlop Workflow láncok** – Egy kártya oszlopba mozgatása elindítja az adott oszlop Workflow láncát; egy **Agentic Kanban Model** (az Ön credentialje + modellje) leképezi a kártya tartalmát Workflow bemenetekre, és a kimeneteket olvasható szöveggé alakítja vissza
- **Kártya mellékletek** – Húzzon fájlokat egy kártyára; a dokumentumok szöveggé kerülnek kinyerésre, a képek pedig vision-képes modellekhez kerülnek átadásra minden futtatás előtt
- **Élő futtatás vászon** – Nyissa meg az aktív futtatást egy kártyán belül, és nézze végig, ahogy a valódi Workflow vásznon csomópontról csomópontra végrehajtódik
- **Csapatmegosztás** – Ossza meg a táblákat felhasználókkal vagy csapatokkal olvasási/írási jogosultságokkal; a megosztott táblákon lévő láncok a tulajdonos credentialjeivel futnak, így a közreműködőknek soha nem kell sajátot használniuk
- **Hibák láthatósága** – A sikertelen kártyák hiba-előzmény jelzőt jelenítenek meg, és a nyomon követő futtatások szünetelhetnek, hogy megvárják a megjegyzéseket

A tábla a platform natív felülete: a kártyák, Workflow-k, credentialek és élő futtatások mind egy helyen vannak.

### Heym Drive: Beépített Fájltároló

A [Drive tab](../tabs/drive-tab.md) egy fájltároló, amely a platformba van beépítve. A skillek és Workflow-k által generált fájlok (PDF, DOCX, CSV, képek) automatikusan oda kerülnek, és a tábla kártya mellékletek is ott tárolódnak.

- **Megosztási linkek** – Nyilvános vagy jelszóval védett (Basic Auth) letöltési linkek opcionális lejárattal és maximális letöltési limitekkel
- **Csapatmegosztás** – Ossza meg a fájlokat csak olvasható módon a csapataival, és távolítsa el az összes csapatmegosztást egy művelettel
- **Tömeges műveletek** – Többszörös kijelölés shift-kattintás tartományokkal, a kijelölések egyetlen ZIP letöltésbe csomagolása, vagy egy megosztási/jelszó/törlési beállítás alkalmazása sok fájlra egyszerre
- **Agent hozzáférés** – A skillek opt-in alapon olvashatják a Drive fájlokat, így egy agent dolgozhat az Ön vagy más Workflow-k által előállított dokumentumokon

A generált artefaktumok állandó, megosztható helyet kapnak a platformon belül.

## Megfigyelés

### LLM Nyomkövetések

A [Traces Tab](../tabs/traces-tab.md) teljes megfigyelhetőséget biztosít minden LLM híváshoz:

- Kérés és válasz Payloadok
- Hívásonkénti időzítés: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Tool hívás nevek, argumentumok és eredmények
- A modellhez átadott skillek

A trace rendszer célirányosan az agentic viselkedés hibakeresésére készült, teljes kérés- és válasz-Payloadokkal és hívásonkénti időzítéssel.
### LLM Token Költségkövetés

Minden LLM-hívás a Heym-ben automatikusan költséget kap. A [Traces Tab](../tabs/traces-tab.md) nyomkövetésenként mutatja a bemeneti és kimeneti tokenek számát, valamint a szinkronizált árazási táblából származtatott valós idejű USD-költséget.

- **Nyomkövetésenkénti költség** – Bemeneti tokenek, kimeneti tokenek és teljes USD minden nyomkövetési sorban megjelenítve
- **Költségelemzés** – KPI-kártyák és modellenkénti költségdiagram frissül a kiválasztott időtartomány szerint (1h / 24h / 7d / 30d / All)
- **LLM Cost Table** – A [DataTable tab](../tabs/datatable-tab.md) rendszertáblája 24 óránként frissül a Helicone-ból; felülírhatja az árakat, vagy egyedi sorokat adhat hozzá még nem szereplő modellekhez
- **Hiányzó ár figyelmeztetés** – Az árazási bejegyzéssel nem rendelkező modellek nyomkövetései beágyazott figyelmeztetést jelenítenek meg, közvetlen hivatkozással a költségtáblára

Minden végrehajtás saját USD-költséget hordoz, modellenkénti bontásban.

### Nyitott éles futtatások élő vásznon

Egy éles workflow a szerkesztőn kívüli indítás után is vizsgálható marad. Nyisson meg bármely **Running** bejegyzést bármelyik History párbeszédablakból, vagy nyissa meg az aktív futtatást egy Agentic Kanban kártyán belül, és a Heym a normál workflow-szerkesztőt csatolja pontosan ahhoz a végrehajtáshoz.

- A már befejezett csomópontok azonnal megjelennek az eredményeikkel együtt
- Az aktuális csomópont és a függőben lévő downstream csomópontok pulzálnak, ahogy a végrehajtás előrehalad
- A Debug panel ugyanazokat a növekményes csomópont-eredményeket kapja, mint egy vászonról indított futtatás
- A végső kimenet és a végrehajtási kiemelések lekérdezés vagy duplikált futtatás indítása nélkül érkeznek meg
- A szerkesztő bezárása csak a megfigyelőt kapcsolja le; soha nem szakítja meg az éles workflow-t

A megfigyelő SSE-t használ, amelyet egy cross-worker végrehajtási pillanatkép támogat, így működik webhook, schedule, chat, MCP, integration és Board triggerek esetén is, még akkor is, ha a futtatást egy másik backend worker birtokolja.

### OpenTelemetry, Analytics és riasztások

A Heym [OpenTelemetry](../reference/opentelemetry.md) spane-eket bocsát ki minden workflow-futtatáshoz, csomópont-végrehajtáshoz és Agent eszközhíváshoz, amelyeket OTLP/HTTP-n keresztül exportál a Jaeger, Grafana Tempo, Honeycomb, Datadog vagy bármely más kompatibilis backend felé.

Az [Analytics](../tabs/analytics-tab.md) fül futtatásszámokat, sikerességi arányt, időtartamot és trendeket követ nyomon workflow-nként. Az [Alerts](../tabs/alerts-tab.md) a hibaszámokat, futtatási időtartamot, token- vagy USD-költést és végrehajtási volumenet figyeli egy időablakon belül, majd egy Ön által választott értesítési workflow-t futtat, így a riasztás eljut a Slackbe, e-mailbe, Telegramba vagy bárhová, ahová egy csomópont el tud jutni.

## Evaluate

### Beépített evals

Az [Evals Tab](../tabs/evals-tab.md) lehetővé teszi tesztcsomagok definiálását és azok futtatását az agent workflow-jai ellen:

- Hozzon létre teszteseteket bemenetekkel és elvárt kimenetekkel, vagy generálja azokat a csomag promptjából
- Futtasson egy csomagot több modellen, és hasonlítsa össze a kimeneteiket egymás mellett
- Pontozzon Exact Match, Contains vagy LLM-as-Judge módszerrel, független judge modellel
- Tekintse át a pass/fail eredményeket, a tényleges és elvárt értékeket, valamint a futtatási előzményeket

Módosítson egy promptot vagy egy modellt, futtassa újra a csomagot, és hasonlítsa össze az eredményeket, mielőtt a változás elérné az éles környezetet.

## Control

### Human-in-the-Loop (HITL)

A Heym beépített [Human-in-the-Loop](../reference/human-in-the-loop.md) rendszerrel rendelkezik, amely lehetővé teszi az agentek számára a végrehajtás szüneteltetését, emberi felülvizsgálat kérését és a folytatást pontosan onnan, ahol abbahagyták.

- **Agent checkpoints** – Engedélyezze a `hitlEnabled` beállítást bármely Agent csomóponton, hogy kapjon egy `request_human_review` eszközt. Az agent eldönti, mikor igényel egy döntés emberi felügyeletet, és meghívja az eszközt egy összefoglalóval és tervezettel.
- **Nyilvános felülvizsgálati URL-ek** – Minden felülvizsgálati kérés egy biztonságos egyszeri hivatkozást generál a `/review/{token}` címen (168 órás TTL). A felülvizsgálók bejelentkezés nélkül **elfogadhatják**, **szerkeszthetik és folytathatják**, vagy **elutasíthatják**.
- **Végrehajtási pillanatképek** – A workflow befagyasztja a teljes állapotát (beszélgetési előzmények, változók, eszközeredmények), így pontosan onnan folytatódik, ahol szünetelt, miután a felülvizsgáló válaszolt.
- **Értesítési ág** – Egy opcionális `review` kimeneti handle lehetővé teszi egy értesítési folyamat (Slack, e-mail, webhook) bekötését, amely a felülvizsgálat kérésekor aktiválódik.
- **MCP eszköz-jóváhagyási szabályzatok** – Az írásos HITL irányelvek jóváhagyási hatókörökké (`always` / `once` / `never`) értelmeződnek, így az agent automatikusan jóváhagyhatja az alacsony kockázatú eszközöket, és eszkalálhatja a magas kockázatúakat.
- **Több checkpoint** – Egyetlen agent-futtatás többször is szünetelhet felülvizsgálat céljából; minden checkpoint független.

A nyilvános felülvizsgálati URL-ek, a szerkesztés és folytatás, az értesítési elágazás és a pillanatkép-alapú folytatás mind ugyanabból az agent checkpointból működnek.

A teljes referenciáért lásd a [Human-in-the-Loop](../reference/human-in-the-loop.md) oldalt.

### LLM Guardrails

A Heym beépített [Guardrails](../reference/guardrails.md) funkcióval rendelkezik mind az [LLM](../nodes/llm-node.md), mind az [Agent](../nodes/agent-node.md) csomópontokon, így blokkolhatja a nem biztonságos tartalmat, mielőtt egy modellválasz elérné a downstream lépéseket.

- **Csomópont-szintű biztonsági kapcsoló** – Engedélyezze a guardrails-t közvetlenül azon a csomóponton, amely felhasználó felé irányuló tartalmat generál vagy dolgoz fel
- **Széles szabályzatlefedettség** – Blokkolja az erőszakot, gyűlöletbeszédet, szexuális tartalmat, NSFW/káromkodást, zaklatást, illegális tevékenységet, személyes adatokra vonatkozó kéréseket és prompt injection kísérleteket
- **Többnyelvű észlelés** – Ugyanazokat a biztonsági szabályokat alkalmazza török, angol, arab, spanyol és más nyelveken
- **Workflow-natív fallback** – Amikor egy üzenet blokkolásra kerül, a csomópont egy tipizált workflow-hibát dob, amelyet egy [Error Handler](../nodes/error-handler-node.md) segítségével irányíthat

A biztonsági szabályzat közvetlenül az LLM és Agent konfigurációjában él, és egyenesen bekapcsolódik a workflow-elágazásba és a hibakezelésbe.
### Hozzáférés, hitelesítő adatok és auditálás

Az ügynökök valódi hitelesítő adatokkal működnek, ezért a hozzáférés a irányítás része. A [hitelesítő adatok](../reference/credentials.md) titkosítva vannak tárolva, létrehozás után maszkolva vannak, és megoszthatók felhasználókkal vagy [csapatokkal](../reference/teams.md), a csapatok emellett munkafolyamatokat, változókat, vektor tárakat és Drive fájlokat is megoszthatnak. Az [egyszeri bejelentkezés](../reference/sso.md) bármely OpenID Connect szolgáltatóhoz csatlakozik, beleértve az Okta, Entra ID, Keycloak, Auth0 és Google szolgáltatásokat. Az [audit napló](../reference/audit.md) minden biztonsági szempontból releváns műveletet rögzít a végrehajtóval, céllal és eredménnyel együtt, és a konténer naplóival együtt továbbítja a már használt naplógyűjtőbe vagy SIEM rendszerbe.

### Saját üzemeltetés, Ön birtokolja az adatait

A Heym az Ön infrastruktúráján fut. A munkafolyamatok, hitelesítő adatok, végrehajtási előzmények és nyomkövetések a saját adatbázisában találhatók, a modellhívások pedig az Ön szervereiről mennek az Ön által választott szolgáltatóhoz, vagy egy Ön által üzemeltetett modellhez az Ollama vagy vLLM segítségével. Az érzékeny dokumentumokat, ügyféladatokat vagy saját tudásbázisokat feldolgozó ügynökök esetében ez gyakran kemény követelmény.

A Heym az **MIT License with the Commons Clause condition** alatt licencelt. A forráskód source-available: szabadon használhatja, módosíthatja és saját maga üzemeltetheti. A Commons Clause korlátozza a szoftver értékesítését, beleértve a fizetett hosting vagy tanácsadási/támogatási szolgáltatások nyújtását, amelyek értéke jelentős mértékben a Heym-ből származik. Kereskedelmi licenceléshez, vállalati telepítésekhez vagy professzionális támogatáshoz forduljon a [enterprise@heym.run](mailto:enterprise@heym.run) címhez.

## Közzététel

### API-k és streamelés

A munkafolyamatok HTTP-n keresztül hívhatók a `/api/workflows/{workflow_id}/execute` végponton, amely JSON-t ad vissza, valamint a `/api/workflows/{workflow_id}/execute/stream` végponton, amely Server-Sent Events formájában streameli a csomópont eseményeket a futás előrehaladtával. Mindkettő ugyanazt a munkafolyamat-szintű hitelesítést, sebességkorlátozást és válasz gyorsítótárazást használja. Lásd: [Webhookok](../reference/webhooks.md) és [SSE Streaming](../reference/sse-streaming.md).

### MCP (Model Context Protocol) integráció

A Heym natív [MCP](../tabs/mcp-tab.md) támogatással rendelkezik mindkét oldalon:

- **Kliensként**: Az ügynök csomópontok külső MCP szerverekhez csatlakoznak (Filesystem, Browserbase, egyedi eszközök) stdio vagy SSE segítségével, és automatikusan használják azok eszközeit
- **Szerverként**: Az MCP-vel rendelkező munkafolyamatok eszközökké válnak az alapértelmezett szerveren a `/api/mcp/sse` címen, vagy névvel ellátott szervereken saját URL-lel és API kulccsal, így a Claude Desktop, Cursor és más MCP kliensek közvetlenül hívhatják az Ön Heym munkafolyamatait

Az ügynökök egyszerre több MCP szervert is használhatnak, és bármely munkafolyamat eszközzé válhat egy külső MCP kliens számára.

### Portal: Munkafolyamatok közzététele chat felületekként

A [Portal](../reference/portal.md) funkció bármely munkafolyamatot nyilvános chat felületté alakít a `/chat/{slug}` címen:

- Opcionális hitelesítés felhasználónkénti hitelesítő adatokkal
- Streamelt végrehajtás (valós idejű csomópont előrehaladás)
- Fájlfeltöltés támogatása
- Többfordulós beszélgetési előzmények

A csapatok belső eszközöket, ügyféloldali chatbotokat és AI-vezérelt űrlapokat szállítanak egy munkafolyamatból és egy URL-ből, frontend kód írása nélkül.

### Munkafolyamat-vezérelt irányítópultok

A [Dashboard tab](../tabs/dashboard-tab.md) egy felhasználó által épített jelentéskészítő felület, ahol minden diagram widgetet a saját rejtett Heym munkafolyamata működtet. Egy widget hívhat API-kat, lekérdezhet BigQuery-t, kereshet RAG/vektor tárakban, futtathat LLM lépéseket, átalakíthat sorokat, és befejezheti egy [Chart Output csomóponttal](../nodes/chart-output-node.md). A widgeteket manuálisan hozhatja létre, AI-val generálhatja, később finomhangolhatja, az eredményeket gyorsítótárazhatja, és a rácsot vizuálisan átrendezheti.
## Összehasonlítás Workflow Automation eszközökkel

Sok csapat a workflow automation eszközöktől érkezik a Heymhez. Az alábbi táblázat a Heymet hasonlítja össze az n8n-nel, a Zapierrel és a Make.com-mal azon képességek tekintetében, amelyek akkor számítanak, amikor az agentek éles környezetben futnak, a lábjegyzetek pedig az összehasonlítás mögötti hivatalos dokumentációra hivatkoznak. Ha egy-egy eszközt szeretne mélyebben megismerni, tekintse meg a [heym.run/compare](https://heym.run/compare) oldalon található összehasonlító oldalakat.

| Képesség | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Beépített LLM csomópont | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + állapotágak | ✓ | korlátozott¹¹ | –¹¹ | korlátozott¹¹ |
| Beépített Agent csomópont (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Multi-agent orchestration | ✓ | ✓ | korlátozott | korlátozott |
| Coding agent csomópontok (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Beépített RAG / vector store | ✓ | ✓ | korlátozott¹ | plugin² |
| WebSocket olvasás / írás | ✓ | korlátozott¹² | –¹³ | –¹⁴ |
| Természetes nyelvű workflow builder | ✓ | korlátozott³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Futás közbeni futtatás megnyitása az élő vásznon | ✓ | korlátozott¹⁹ | korlátozott¹⁹ | –¹⁹ |
| Workflow-alapú dashboardok | ✓ | korlátozott¹⁷ | korlátozott¹⁷ | korlátozott¹⁷ |
| Agentic Kanban tábla | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Skills rendszer agentekhez | ✓ | – | – | – |
| Beépített fájlmeghajtó (megosztási linkek, csapatok) | ✓ | korlátozott²² | korlátozott²² | –²² |
| Böngészőautomatizálási csomópont (Playwright) | ✓ | korlátozott²³ | korlátozott²³ | –²³ |
| LLM trace vizsgálat | ✓ | korlátozott⁴ | – | ✓ |
| OpenTelemetry tracing export | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM token költségkövetés (USD) | ✓ | –¹⁵ | –¹⁵ | korlátozott¹⁵ |
| Beépített evals AI workflow-okhoz | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | korlátozott⁶ | korlátozott⁷ |
| LLM guardrails | ✓ | ✓⁸ | ✓⁸ | korlátozott⁸ |
| Automatikus kontextustömörítés | ✓ | – | – | – |
| Párhuzamos DAG végrehajtás | ✓ | korlátozott⁹ | – | – |
| Önállóan hosztolható, forráskód elérhető | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL dinamikus adatokhoz | ✓ | ✓ | korlátozott | ✓ |
> **Lábjegyzetek:** ¹ Zapier Knowledge Sources — nincs nyilvános vector store vagy embedding-vezérlés. ² A Make.com rendelkezik Pinecone/Qdrant modulokkal, de natív RAG csomópont nélkül. ³ Az n8n AI Workflow Builder csak felhőalapú béta, kreditekkel korlátozva. ⁴ Az n8n megjeleníti a köztes lépéseket; a teljes nyomkövetéshez harmadik féltől származó eszközök szükségesek. ⁵ Az n8n támogatja az AI tool-call jóváhagyásokat chat, e-mail és együttműködési csatornákon keresztül, de nem készít pillanatképet és nem folytatja a teljes végrehajtást úgy, ahogy a Heym teszi. ⁶ A Zapier Human in the Loop támogatja a jóváhagyásokat és adatgyűjtést a Zapokon belül, de ez nem egy nyilvános felülvizsgálati, pillanatkép-folytatási ellenőrzőpont-rendszer. ⁷ A Make.com Human in the Loop szolgáltatást Enterprise alkalmazásként kínálja felülvizsgálati kérésekkel és módosított/jóváhagyott/törölt kimenetelekkel, de ez továbbra is csomaghoz kötött és kevésbé agent-natív. ⁸ Az n8n szállít egy dedikált Guardrails csomópontot, a Zapier AI Guardrails-t szállít az AI termékei között, a Make.com pedig agent szabályokat és felülvizsgálati folyamatokat dokumentál, de nem egy összehasonlítható önálló guardrails funkciót, ezért a Make korlátozottként van megjelölve. ⁹ Az n8n alapértelmezés szerint szekvenciálisan hajtja végre; a párhuzamossághoz al-workflow megoldások szükségesek. ¹⁰ Sustainable Use License — ingyenes az önálló üzemeltetés belső használatra, a kereskedelmi újraelosztás korlátozott. ¹¹ 2026. április 22-én az n8n hivatalos dokumentációja HTTP kötegelt feldolgozást és loop/wait mintákat ír le, nem pedig natív LLM batch-status elágazást, a Zapier hivatalos ChatGPT alkalmazás dokumentációja nem sorol fel triggereket és csak egy általános API Request bétát tartalmaz, a Make hivatalos OpenAI integrációs oldala pedig olyan batch műveleteket tesz elérhetővé, mint a create/watch completed, de nem egy első osztályú status-elágazó LLM csomópontot, ezért az n8n/Make korlátozottként, a Zapier pedig elérhetetlenként van megjelölve erre a konkrét workflow mintára. ¹² Az n8n hivatalos dokumentációja lefedi a HTTP Webhook és HTTP Request csomópontokat, valamint a Code/egyedi/közösségi bővíthetőséget, de nem találtam első féltől származó WebSocket trigger/küldő csomópontot, ezért az n8n korlátozottként van megjelölve. ¹³ A Zapier hivatalos dokumentációja lefedi a bejövő webhookokat és a kimenő webhook/API kéréseket kizárólag HTTP felett, nem pedig natív WebSocket trigger vagy küldő lépéseket. ¹⁴ A Make hivatalos dokumentációja lefedi a Webhooks modulokat és a HTTP(S) kérés modulokat, de nem találtam natív WebSocket trigger vagy küldő modult. ¹⁵ Az n8n-nek nincs natív LLM token költségkövetése; léteznek közösségi megoldás workflow-k, de ezek manuális telepítést és végrehajtás utáni API hívásokat igényelnek (nyitott feature request 2026 májusában). A Zapier nem tesz elérhetővé végrehajtásonkénti token számot vagy USD költséget a felhasználók számára; az AI lépések csak taskokat fogyasztanak. A Make.com kreditek irányítópultja részben tükrözi a token fogyasztást a Make-hosted AI esetében (2025 augusztusa óta), de a harmadik féltől származó API kulcs kapcsolatok 1 művelet = 1 kreditként vannak számlázva token számlálás nélkül; végrehajtásonkénti USD bontás modellenként nem elérhető. ¹⁶ A Heym natív OpenTelemetry span-okat bocsát ki (egyet workflow futásonként plusz egyet csomópontonként) OTLP/HTTP felett bármely kompatibilis backend felé, W3C trace-context propagációval és instrumentation kód nélkül, a `HEYM_OTEL_*` env változókon keresztül konfigurálva és alapértelmezés szerint letiltva. Az n8n rendelkezik dokumentált OpenTelemetry tracing integrációval a workflow és csomópont végrehajtásokhoz. A Zapier és a Make.com nem dokumentálja a workflow/scenario végrehajtásaik OpenTelemetry exportját 2026 júniusáig. ¹⁷ Az n8n dokumentál egy Insights irányítópultot a produkciós végrehajtási metrikákhoz, a Zapier dokumentálja a Zap History-t plusz a Task Usage-t, a Make.com pedig a Scenario History-t; ezek monitoring/előzmény felületek, nem pedig tetszőleges workflow logikával támogatott egyedi irányítópult widgetek, mint a Heym Dashboard füle. ¹⁸ A Heym Workflow Analyzer lehetőség szerint futtatja a workflow-t, beolvassa a végrehajtási eredményt, és egy megosztott, szerkeszthető Markdown jelentést generál, amely lefedi a fejlesztési területeket, a célt és a lépésenkénti viselkedést. Az n8n dokumentálja az AI Workflow Builder-t workflow-k létrehozásához/finomításához/hibakereséséhez, a Zapier dokumentálja az AI hibaelhárítást a hibás Zap futásokhoz, a Make.com pedig a scenario előzményeket plusz az AI agent érvelési lépéseket, de nyilvános dokumentációjuk nem írja le ugyanazt a futás-tudatos megosztott workflow elemzési dokumentumot. ¹⁹ Az [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) felsorolja a futó végrehajtásokat és be tud tölteni adatokat egy korábbi végrehajtásból a szerkesztőbe, míg a [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) egy futó állapotot tesz elérhetővé a szerkesztőjében. A [Make Scenario History](https://help.make.com/scenario-history) dokumentálja a futás részleteit és naplóit. Nyilvános dokumentációjuk, 2026. július 18-án ellenőrizve, nem írja le a Heym pontos folyamatát: megnyitni egy tetszőleges folyamatban lévő produkciós futást az Előzményekből vagy egy Kanban kártyáról, visszaállítani az aktuális csomópont pillanatképét, és továbbra is fogadni a csomópont animációt és Debug naplókat ugyanazon a vásznon. ²⁰ A Heym [Codex](../nodes/codex-node.md) és [OpenCode Go](../nodes/opencode-go-node.md) csomópontjai egy valódi coding agent CLI-t futtatnak egy izolált Heym munkaterületen egy GitHub repository ellen — klónozás, szerkesztés, diff készítés, branch push, pull request nyitás — első osztályú workflow lépésként. 2026. július 20-án egyetlen versenytárs sem dokumentál egyenértékűt: az n8n [OpenAI node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) lefedi a chat/assistant API hívásokat, nem pedig egy repository szintű coding agent-et, és a natív Codex támogatás továbbra is közösségi kérés; a Zapier saját blogja a fordított irányt dokumentálja — [Codex driving Zapier tools through Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — nem pedig a Codex-et mint Zap lépést; a Make.com OpenAI moduljai completions/assistants/batch műveleteket tesznek elérhetővé, nem pedig egy coding agent-et, amely repository-kat klónoz és PR-eket nyit. ²¹ A Heym [Board tab](../tabs/board-tab.md) egy beépített agentic Kanban tábla, amelynek oszlopai workflow-kat hajtanak végre, és amelynek kártyái kontextust, beszélgetési előzményeket, végrehajtási állapotot és futásokat hordoznak. Az n8n ([Kanban Tool integration](https://n8n.io/integrations/kanban-tool/)), a Zapier ([Kanban Tool integrations](https://zapier.com/apps/kanbantool/integrations)) és a Make.com ([Kanban Tool integration](https://www.make.com/en/integrations/kanban-tool)) csak harmadik féltől származó kanban alkalmazásokhoz kapcsolódnak, mint a Kanban Tool, Wekan vagy NocoDB; egyik sem dokumentál egy beépített táblát, amely a saját workflow-it futtatja, 2026. július 20-án. ²² Az n8n belsőleg tárolja a végrehajtási bináris adatokat (opcionálisan [S3-kompatibilis külső tárolón](https://docs.n8n.io/hosting/scaling/external-storage/)), de nem dokumentál felhasználóknak szóló fájlmeghajtót megosztási linkekkel vagy csapatmegosztással, ezért korlátozottként van megjelölve. A Zapier [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) csak a Zap futásának időtartamára dolgozza fel a fájlokat, és a [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) kis szöveges értékeket tárol, ezért a Zapier korlátozottként van megjelölve. A Make.com [data stores](https://help.make.com/l6du-data-stores) strukturált rekordokat tárol, és a [file handling](https://help.make.com/working-with-files) fájlokat ad át alkalmazások között állandó beépített tárolás nélkül, ezért a Make elérhetetlenként van megjelölve. ²³ A Heym [Playwright node](../nodes/playwright-node.md) első féltől származó böngészőautomatizálás vizuális lépések móddal, AI-generált lépésekkel és teljes kód móddal. Az n8n csak közösségi csomagokat kínál, mint az [n8n-playwright](https://github.com/toema/n8n-playwright), egy még mindig nyitott [feature request-tel natív böngészőautomatizálási csomópontokhoz](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), ezért korlátozottként van megjelölve. A Zapier Agents [web böngészéssel és egy Chrome kiterjesztéssel tud oldalakat böngészni és olvasni](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), de a Zapier nem dokumentál scriptelt böngészőautomatizálási lépést, ezért korlátozottként van megjelölve. A Make.com HTTP modulokat és harmadik féltől származó scraping alkalmazásokat dokumentál, nem pedig natív böngészőautomatizálási modult, 2026. július 20-án.
## Kapcsolódó témák

- [Bevezetés](./introduction.md) – A platform áttekintése
- [Gyors kezdés](./quick-start.md) – Építse fel első workflow-ját
- [Workflow elemzés](../reference/workflow-analysis.md) – Megosztott, futtatás-tudatos workflow jelentések és fejlesztési visszajelzések generálása
- [Dashboard fül](../tabs/dashboard-tab.md) – Workflow-alapú dashboardok építése AI-generált diagram widgetekkel
- [Agent csomópont](../nodes/agent-node.md) – LLM csomópont tool calling, MCP és skillek támogatásával
- [Agent architektúra](../reference/agent-architecture.md) – Al-ügynökök, orchestrator és tool dispatch
- [Board fül](../tabs/board-tab.md) – Agentic Kanban tábla workflow-t végrehajtó oszlopokkal
- [Codex csomópont](../nodes/codex-node.md) – Az OpenAI Codex kódoló ügynök futtatása GitHub repository-n
- [OpenCode Go csomópont](../nodes/opencode-go-node.md) – Szolgáltató-független kódoló ügynök megerősített konténerben
- [Drive fül](../tabs/drive-tab.md) – Beépített fájltárolás megosztási linkekkel, csapatokkal és tömeges műveletekkel
- [Playwright csomópont](../nodes/playwright-node.md) – Első féltől származó böngészőautomatizálás AI lépésekkel és kód móddal
- [RAG / Vector Store csomópont](../nodes/rag-node.md) – Vektoros keresés és dokumentum beszúrás (Qdrant vagy Postgres pgvector)
- [AI asszisztens](../reference/ai-assistant.md) – Természetes nyelvű workflow építő
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Agent ellenőrzési pontok nyilvános review URL-ekkel
- [Guardrails](../reference/guardrails.md) – Nem biztonságos promptok blokkolása, mielőtt elérnék a modelljeit
- [Traces fül](../tabs/traces-tab.md) – LLM hívások megfigyelhetősége
- [Evals fül](../tabs/evals-tab.md) – Tesztcsomagok AI workflow-okhoz
- [Alerts fül](../tabs/alerts-tab.md) – Küszöbérték riasztások hibákra, időtartamra, költségre és futtatási volumenre
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Futtatási, csomópont- és tool span-ek exportálása OTLP-n keresztül
- [Terheléselosztás](../reference/cluster.md) – Futtatások megosztása példányok között leader failover-rel
- [Egyszeri bejelentkezés](../reference/sso.md) – Bejelentkezés bármely OpenID Connect szolgáltatón keresztül
- [Audit naplózás](../reference/audit.md) – Biztonsági szempontból releváns műveletek szereplővel, céllal és eredménnyel
- [Portál](../reference/portal.md) – Workflow-ok publikálása nyilvános chat felületekként
- [Párhuzamos végrehajtás](../reference/parallel-execution.md) – DAG-alapú párhuzamos végrehajtás
- [MCP fül](../tabs/mcp-tab.md) – MCP szerver és kliens konfiguráció
