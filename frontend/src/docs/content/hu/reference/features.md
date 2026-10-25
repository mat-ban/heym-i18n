# Heym Teljes Funkciókészlet

Az összes Heym képesség átfogó áttekintése. Minden szakasz néhány mondatban írja le egy funkciót vagy koncepciót.

---

## Kezdő lépések

### [Bevezetés](../getting-started/introduction.md)

A Heym infrastruktúra a termelési környezetben működő AI-ügynökök futtatásához és irányításához. Vizualis vásznon építhet ügynökrendszereket, és megbízhatóan futtathatja azokat: koordinálhat ügynököket, automatizálhat üzleti folyamatokat, megvizsgálhat minden futtatást, és biztosíthatja az emberi felügyeletet saját infrastruktúráján. Támogatja a vizuális workflow-kat, AI-alapú csomópontokat ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), egy [AI Assistant](./ai-assistant.md) segédet, integrációkat ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), bejövő [IMAP Trigger](../nodes/imap-trigger-node.md) e-maileket, kimenő [Send Email](../nodes/send-email-node.md) e-maileket), ütemezést [Cron](../nodes/cron-node.md) segítségével, valamint [Portal](./portal.md) chat portálokat végfelhasználók számára.

Lásd még: [Alapfogalmak](../getting-started/core-concepts.md), [Csomóponttípusok](./node-types.md) és [Harmadik féltől származó integrációk](./integrations.md).

### [Miért a Heym](../getting-started/why-heym.md)

A "Miért a Heym" bemutatja az ügynök életciklusát (építés, koordináció, futtatás, megfigyelés, értékelés, irányítás, közzététel), és bemutatja, hogy mit kezel egy önállóan üzemeltetett futási környezet minden szakaszban. Ez magában foglalja az [LLM](../nodes/llm-node.md) csomópontot és az [Agent Node](../nodes/agent-node.md) eszközhívással, Python eszközökkel, [MCP](../tabs/mcp-tab.md) kapcsolatokkal, készségekkel és több ügynök koordinációját; triggereket, újrapróbálkozásokat és [terheléselosztást](./cluster.md); [Nyomkövetéseket](../tabs/traces-tab.md) futtatásonkénti USD költséggel és OpenTelemetry exportálással; [Értékeléseket](../tabs/evals-tab.md); [emberi ellenőrzési pontokat](./human-in-the-loop.md), korlátokat, SSO-t és audit nyomvonalat; valamint REST, MCP és Portal végpontokat. Az oldalt egy képesség-összehasonlítás zárja az n8n, Zapier és Make.com platformokkal.

Lásd még: [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) és [Agent Architecture](./agent-architecture.md).

### [Gyors útmutató](../getting-started/quick-start.md)

Az első workflow perc
#### [Bemeneti csomópont](../nodes/input-node.md)

A Bemeneti csomópont a workflow-k belépési pontja, amely adatokat fogad a felhasználótól vagy API hívótól. Támogat egy vagy több bemeneti mezőt, valamint hozzáférést biztosít a kérés metaadataihoz (fejlécek, query paraméterek). A törzs mezőit a `$nodeLabel.body.fieldKey`, a fejléceket a `$nodeLabel.headers`, a query paramétereket pedig a `$nodeLabel.query` segítségével érheti el.

Természetes párjai a [Feltétel](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) és [Kimeneti](../nodes/output-node.md) csomópontok. A payload hivatkozásokhoz és mezőeléréshez lásd az [Expression DSL](./expression-dsl.md) és [Webhooks](./webhooks.md) dokumentációt.

#### [Cron](../nodes/cron-node.md)

A Cron csomópont egy workflow-t indít el ütemezés szerint, szabványos ötmezős cron kifejezés használatával. Nincs szükség felhasználói bemenetre – a workflow automatikusan fut a megadott időpontokban (pl. óránként, naponta, 15 percenként). A kimenet egy trigger esemény, payload nélkül.

Lásd még: [Triggers](./triggers.md), [Várakozás](../nodes/wait-node.md) és [Futtatási előzmények](./execution-history.md) az ütemezett és késleltetett futtatásokhoz.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Az IMAP Trigger csomópont konfigurálható percenkénti intervallumban lekérdezi a postaládát, és minden újonnan észlelt e-mail esetén elindít egy workflow-t. A kimenet tartalmazza az elemzett fejléceket, feladó és címzett listát, egyszerű szöveges és HTML törzset, melléklet metaadatokat, valamint a trigger időbélyegét. Használható támogatási postaládák kezelésére, e-mail-Slack útválasztásra vagy [Human-in-the-Loop](./human-in-the-loop.md) e-mail-alapú jóváhagyási folyamatokhoz.

Természetes párjai: [E-mail küldés](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) és [Slack](../nodes/slack-node.md) a bejövő levelek kezelésére és válaszadásra.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

A Heym Trigger csomópont akkor indít el egy workflow-t, amikor maga a Heym platform eseményt tesz közzé: `heym.started`, `workflow.created`, `workflow.updated` vagy `workflow.deleted`. A kézbesítés kötegelt – minden, egy öt másodperces diszpécser ablakon belül közzétett esemény egyetlen futtatásban érkezik a `$nodeLabel.events` tömbként. Minden esemény egyedi adatbázis-korláttal rendelkezik, így minden feliratkozó csomópont esetén pontosan egyszer aktiválódik, függetlenül a futó munkavégzők, konténerek vagy gépek számától. Használható workflow-változások naplózására, telepítési értesítésekre és példány állapotjelentésekre.

Természetes párjai: [Heym](../nodes/heym-node.md) csomópont a módosított workflow kereséséhez, és [Ciklus](../nodes/loop-node.md) az eseményenkénti művelethez.

#### [Heym](../nodes/heym-node.md)

A Heym csomópont három műveleten keresztül olvassa ki a Heym saját adatait: a `listWorkflows` visszaadja minden olyan workflow-t, amelyhez a tulajdonos hozzáfér (csomópont számokkal és időbélyegekkel), a `getWorkflow` egy workflow csomópont- és élstruktúráját adja vissza, a `getExecutionHistory` pedig a futtatási előzmények bejegyzéseit adja vissza legújabbtól kezdve, opcionális állapot-, időablak- és limit szűrőkkel, valamint állapotonkénti összesítésekkel. Az eredmények a csomópontot tartalmazó workflow tulajdonosára vannak korlátozva, így a cron, portál vagy esemény által indított futtatás ugyanazokat az adatokat adja vissza, mint a kézi futtatás. A `getWorkflow` visszaadja a teljes csomópont konfigurációt, ami lehetővé teszi a workflow auditálását hardkódolt kulcsok vagy tokenek után; semmit sem tesz elérhetővé, amit a workflow tulajdonosa ne tudna már megnyitni a szerkesztőben. Nincs szükség hitelesítő adatra.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

A WebSocket Trigger csomópont kimenő klienskapcsolatot nyit egy külső WebSocket szerverrel, és a workflow-t az `onMessage`, `onConnected` vagy `onClosed` eseményekre indítja el. Hozzáférést biztosít az elemzett üzenet payloadokhoz, újrakapcsolódási állapothoz, lezárási metaadatokhoz és a socket URL-hez a lefelé irányuló kifejezésekhez.

Természetes párjai: [WebSocket küldés](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) és [SSE Streaming](./sse-streaming.md) valós idejű integrációkhoz.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

A Telegram Trigger csomópont bot webhook frissítéseket fogad, és azonnal elindítja a workflow-t. Hozzáférést biztosít a teljes frissítési payloadhoz, az elsődleges üzenet objektumhoz, callback lekérdezésekhez, tisztított fejlécekhez és egy trigger időbélyeghez. Használható chatbotokhoz, AI asszisztensekhez [Telegram](../nodes/telegram-node.md)-ban és gombvezérelt folyamatokhoz.

Természetes párjai: [Telegram](../nodes/telegram-node.md), [Agent csomópont](../nodes/agent-node.md) és [Webhooks](./webhooks.md) botvezérelt workflow-khoz.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

A Slack Trigger csomópont fogadja a Slack Events API webhookjait, ellenőrzi a kérés aláírását, majd automatikusan elindít egy workflow-t. Hozzáférést biztosít az esemény payloadhoz és tisztított fejlécekhez az útválasztáshoz, [LLM](../nodes/llm-node.md)-alapú osztályozáshoz és válaszfolyamatokhoz.

Természetes párjai: [Slack](../nodes/slack-node.md), [Agent csomópont](../nodes/agent-node.md) és [Harmadik féltől származó integrációk](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

A Discord Trigger csomópont fogadja a Discord Interactions API webhookjait, ellenőrzi az Ed25519 aláírásokat a kiválasztott `discord_trigger` hitelesítő adattal, majd elindítja a workflow-t. Hozzáférést biztosít a teljes interakciós payloadhoz, parancsadatokhoz, tisztított fejlécekhez és trigger metaadatokhoz az útválasztáshoz vagy válaszadáshoz.

Természetes párjai: [Kimeneti](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent csomópont](../nodes/agent-node.md) és [Harmadik féltől származó integrációk](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

A RabbitMQ csomópont üzeneteket küld vagy fogad RabbitMQ várólistákból és cserepontokból. Használható üzenetvezérelt workflow-khoz és eseményfeldolgozáshoz. A küldési mód egy üzenetet tesz közzé opcionális késleltetéssel; a fogadási mód [triggerként](./triggers.md) működik, így a workflow akkor indul el, amikor egy üzenet érkezik. A kimenet tartalmazza az állapotot, az üzenet azonosítóját és a törzset.

Párosítható a [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) és [Parallel Execution](./parallel-execution.md) csomópontokkal eseményvezérelt feldolgozáshoz.

#### [Error Handler](../nodes/error-handler-node.md)

Az Error Handler csomópont automatikusan fut le, ha bármely csomópont meghibásodik a workflow-ban. Nincs szükség bejövő élekhez; a motor aktiválja. A kimenet tartalmazza a hibaüzenetet, a sikertelen csomópont címkéjét, a csomópont típusát és az időbélyeget. Használható értesítések küldésére [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) vagy [Send Email](../nodes/send-email-node.md) csomópontokon keresztül, hibák naplózására vagy egyéni hibaüzenetek visszaküldésére.

Alternatívaként a hibakezelés delegálható egy külön workflow-ra – lásd [Error Workflow](#error-workflow). Ha a vásznon már szerepel Error Handler csomópont, a hibaworkflow **nem** hívódik meg (a helyi kezelő élvez elsőbbséget).

Gyakori értesítési célpontok a [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) és [Send Email](../nodes/send-email-node.md); a futtatás részletei könnyebben ellenőrizhetők az [Execution History](./execution-history.md) alatt.

### AI

#### [Agent Node](../nodes/agent-node.md)

Az AI Agent csomópont egy [LLM](../nodes/llm-node.md) csomópont eszközhívási képességekkel. Képes Python eszközök futtatására, csatlakoztatott vászoneszközök hívására, [MCP](../tabs/mcp-tab.md) szerverekhez kapcsolódásra, készségek használatára (utasítófájlok és opcionális Python szkriptek), más agent csomópontokra delegáló orchestrátorként működésre, valamint más workflow-k eszközként való meghívására. A kimenet elérhető `$nodeLabel.text` formában. Egy opcionális **Extra Body** kapcsoló minden kéréshez csatol egy JSON objektumot a szolgáltató-specifikus kérési paraméterekkel az eszközhívási ciklusban; alapértelmezés szerint ki van kapcsolva. Egy opcionális **Use Responses API** kapcsoló az agent modellhívásait a Responses API-n keresztül irányítja, amely megőrzi a modell érvelését az eszközhívások között, így egy gondolkodó modell megtartja a gondolatmenetét a többlépéses ciklus során; alapértelmezés szerint ki van kapcsolva, és OpenAI-val és egyéni hitelesítő adatokkal működik.

A vászoneszközök lehetővé teszik, hogy egy agent közvetlenül a vászonról hívja meg a konfigurált workflow csomópontokat. Csatlakoztasson egy támogatott csomópontot az agent eszközkezelőjéhez, majd jelölje meg a bot ikonnal azokat a mezőket, amelyeket az agent fog szolgáltatni. Ezek a mezők futási időben eszközparaméterekké válnak, míg a hitelesítő adatok és a nem megjelölt mezők a csomópont konfigurációjában rögzítve maradnak.

A Készségek szekció mostantól tartalmaz **AI Build** lehetőséget új készségek létrehozásához, beágyazott AI szerkesztési műveletet meglévő készségekhez, készségenkénti ZIP letöltést, valamint egy opcionális **Enable Drive files** kapcsolót azokhoz a készségekhez, amelyeknek futási időben Heym Drive fájlokat kell olvasniuk. A Skill Builder modál bal oldalon egy csevegésbeszélgetést közvetít, fogadja a drag-and-drop fájlokat minden finomhangolási megjegyzéssel, jobb oldalon élő, csak olvasható előnézetet mutat a generált `SKILL.md` és `.py` fájlokról, letöltheti ezt az előnézetet ZIP-ként, és a feltöltött finomhangolási fájlokat visszamentheti csomagolt készségtárgyakként ugyanazon ZIP-beviteli folyamaton keresztül, amelyet a kézi feltöltések használnak.

Ha az **[Agent Persistent Memory](./agent-persistent-memory.md)** engedélyezve van, minden agent csomópont saját tudásgráfot tart fenn: a tények a rendszerutasításba kerülnek betöltésre, ha nem üresek, és a sikeres futtatások új entitások és kapcsolatok háttérbeli egyesítését indítják el. Az alárendelt agentek külön gráfokat használnak. Megoszthatja egy agent gráfját más agentekkel (ugyanazon vagy más workflow-kban) csak olvasható vagy írható-olvasható hozzáféréssel a gráfpárbeszédablakból. A vászon agykontrollja megnyitja a gráfszerkesztőt.

Az Agent csomópontok beléphetnek [Human-in-the-Loop](./human-in-the-loop.md) módba is. Ebben az üzemmódban az agent kap egy `request_human_review` eszközt, és megállhat bizonyos jóváhagyást igénylő lépéseknél, létrehozhat egy egyszeri nyilvános ellenőrzési linket, feltárhat egy `review` vászonágat értesítési folyamatokhoz, és várhat, amíg egy ellenőző elfogadja, szerkeszti vagy elutasítja a Markdown ellenőrzési szöveget. A csomópont HITL mezője irányelvekként szolgál arra, hogy mikor kell kérdezni, míg az ellenőrző felé összefoglaló generálódik minden ellenőrzési kérésből. [MCP](../tabs/mcp-tab.md) eszközök esetén a Heym a modellt használja ezeknek az írott utasításoknak az `always`, `once` vagy `never` értékekre történő értelmezésére, így a szabadformájú jóváhagyási nyelv egy konkrét futási politikává alakul. A futtatás `pending` állapotúra kerül, és a tárolt végrehajtási pillanatképből folytatódik, miután megérkezik a döntés, és ugyanazon agent futtatás többször is megállhat, ha későbbi lépések szintén ellenőrzést igényelnek.

Az Agent csomópontok automatikusan tömörítik a felhalmozott üzenetelőzményüket, amikor az megközelíti a modell kontextusablakának 80%-át. A rendszerutasítás, az első felhasználói üzenet és a legutóbbi felhasználói üzenet mindig megmarad; minden közötti tartalom ugyanazzal a modellel és hitelesítő adatokkal összegeződik. A tömörítési események láthatók a Debug panelen, az [Execution History](./execution-history.md) alatt és a [Traces](../tabs/traces-tab.md) lapon.

Lásd még: [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) és [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

A Codex csomópont az OpenAI Codex CLI-t futtatja egy izolált Heym munkaterületen belül. Elfogad egy Codex hitelesítési adatot (jelentkezzen be ChatGPT-vel, hogy előfizetését használhassa tokenenkénti API költségek nélkül, vagy illesszen be egy hozzáférési tokent), egy GitHub hitelesítési adatot, tárhely URL-t, alapágat, feladatpromptot, közzétételi módot (`diff_only` vagy `draft_pr`), ágnevet és időkorlátot. A futtató helyileg klónozza a tárhelyet, csak a Codex folyamatnak adja át a ChatGPT token csomagot vagy a `CODEX_ACCESS_TOKEN`-t, és visszaad egy strukturált összefoglalót, érvényesítési megjegyzéseket, módosított fájlokat, diff-et, használati metaadatokat és opcionális vázlat PR URL-t.

Amikor a Codex `needs_input` értéket ad vissza, a workflow szünetel és megjeleníti a `question` ágat. Csatlakoztassa ezt az ágat Slackhez, e-mailhez vagy egy másik értesítő csomóponthoz; a nyilvános folytatási hivatkozás folytatja a mentett végrehajtási pillanatképet a válasz beküldése után. A Codex csomópont AI Agenthez is csatolható eszközként, lehetővé téve az ügynök számára a kódolási feladatok delegálását; eszközként a `needs_input` eredményt inline visszaadja az ügynöknek a workflow szüneteltetése helyett.

Lásd még: [GitHub](../nodes/github-node.md), [Hitelesítési adatok](./credentials.md), [Hitelesítési adatok megosztása](./credentials-sharing.md) és [Csomópont típusok](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Az OpenCode Go csomópont az OpenCode CLI-t (Go) futtatja egy GitHub tárhellyel szemben. Az izoláció a Codex mintáját követi: helyileg gazdagép alfolyamatként fut, míg Docker telepítésekben egy megerősített testvérkonténeren belül fut, amely megosztja a munkaterület kötetét. Elfogad egy OpenCode Go hitelesítési adatot (átjáró API kulcs opcionális alap URL-lel), egy GitHub hitelesítési adatot, tárhely URL-t, alapágat, feladatpromptot, közzétételi módot, ágnevet, időkorlátot és egy `opencode-go/<model>` modellt, amelyet egy élő, kereshető modelllistából választ ki (beépített tartalék lehetőséggel). A Heym minden git/GitHub műveletet a gazdagépen hajt végre, és soha nem helyezi el a GitHub tokent a homokozóban; az OpenCode csak a lemezen lévő fájlokat szerkeszti. A csomópont visszaad egy strukturált összefoglalót, érvényesítési megjegyzéseket, módosított fájlokat, diff-et és egy opcionális pull request URL-t. AI Agenthez eszközként csatolható.

Lásd még: [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Hitelesítési adatok](./credentials.md), [Hitelesítési adatok megosztása](./credentials-sharing.md) és [Csomópont típusok](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Az LLM csomópont szöveget dolgoz fel nyelvi modellel vagy képeket generál. Támogatja a szöveggenerálást, látást (képbemenet), képgenerálást, strukturált JSON kimenetet, szolgáltató natív Batch API végrehajtást a támogatott OpenAI és OpenAI-kompatibilis végpontokhoz, valamint egy opcionális **Válaszok API használata** kapcsolót, amely a hívást a Válaszok API-n keresztül irányítja a Chat Completions helyett (alapértelmezés szerint ki; OpenAI és egyéni hitelesítési adatokkal működik, és nem kombinálható Batch módban). Konfigurálja a hitelesítési adatot, modellt, rendszer- és felhasználói üzeneteket, hőmérsékletet és maximális tokeneket; használjon [Kifejezés DSL](./expression-dsl.md)-t a promptokban. Batch módban a `userMessage`-nek tömbnek kell feloldódnia, a csomópont `batchStatus` ágat bocsát ki folyamatfrissítésekkel, és a végső kimenet tartalmazza az egyes tételek batch eredményeit. Egy opcionális **Extra Body** kapcsoló csatol egy JSON objektumot szolgáltató-specifikus kérésparaméterekkel (például `{"thinking": {"type": "disabled"}}`) minden API híváshoz; alapértelmezés szerint ki. Opcionális [Korlátok](./guardrails.md) blokkolják a nem biztonságos tartalmat a hívás előtt.

Természetes párja: [Qdrant RAG](../nodes/rag-node.md), [Agent csomópont](../nodes/agent-node.md), [Korlátok](./guardrails.md) és [Kifejezés kiértékelési párbeszéd](./expression-evaluation-dialog.md).

#### [Döntés](../nodes/decision-node.md)

A Döntés csomópont egy döntési modelltől kérdez típusos kérdéseket a futás állapotáról, és valószínűségeket ad vissza prózai szöveg helyett. Egy **Állapot** mező tartalmazza, amit a modellnek el kell olvasnia – egyetlen kifejezés megtartja saját típusát, így a `$input` az objektumot küldi el, nem annak szövegét –, és egy kérdések listája hordozza az ítéleteket. A kérdések három formában jelennek meg: a **noul** megválaszolja, hogy egy feltétel fennáll-e, a **choice** kiválaszt egy lehetőséget az Ön által meghatározott halmazból, és visszaadja a teljes eloszlást, a **score** pedig rendezett szintek mentén értékeli az állapotot, és közéjük is kerülhet. A choice és score válaszok magukban hordozzák a bizonyosságot is, így egy [Kapcsoló](../nodes/switch-node.md) az válasz alapján irányíthat, míg egy [Feltétel](../nodes/condition-node.md) azon kapcsol, mennyire volt biztos. A **Generálás AI-val** vázlatot készít az állapotsablonból és a kérdéssorokból egy egyszerű mondatból, a **Egyéni kérés törzs** pedig kézzel írt JSON-t küld egy olyan végpontnak, amelynek szerződése eltér. A szolgáltató válaszát változatlanul továbbítják, és minden hívást rögzítenek a [Nyomok](../tabs/traces-tab.md) lapon.

Döntési Modell hitelesítési adatra van szüksége; természetes párja: [Kapcsoló](../nodes/switch-node.md), [Feltétel](../nodes/condition-node.md) és [Agent csomópont](../nodes/agent-node.md).
#### [RAG / Vektortároló](../nodes/rag-node.md)

A RAG / Vektortároló csomópont dokumentumokat szúr be, frissít (upsert), töröl és keres egy vektortárolóban, a lekérdezés-alapú generálás érdekében. Az **Adatbázis** legördülő menüben választható a háttérrendszer — **Qdrant** (külső szerver) vagy **Postgres (pgvector)** (a Heym saját adatbázisa, külső szolgáltatás nélkül), alapértelmezés szerint Qdrant. Válasszon egy vektortárolót a [Vektortárolók](../tabs/vectorstores-tab.md) lapról, és állítsa be a műveletet beszúrásra, frissítésre, törlésre vagy keresésre. A frissítés és törlés egy dokumentumot egy egyedi azonosító alapján érint, amely a payload-ban található — a **Dokumentumazonosító mező** nevezi meg ezt a mezőt (alapértelmezés szerint `doc_id`), a **Dokumentumazonosító** pedig tartalmazza annak értékét — így a dokumentum megtartja a saját rendszere által már használt azonosítót: a frissítés minden egyező pontot lecserél az új verzió tárolása előtt, a törlés pedig jelzi, talált-e egyezést. A dokumentum metaadatainak értékeiben kifejezések is megadhatók, például `{"url": "$start.url"}` tárolja azt, amit a futtatás előállított. A keresés támogatja a metaadat-szűrőket, az opcionális **Hybrid Search** funkciót (vektoralapú hasonlóság BM25 kulcsszó-illesztéssel ötvözve, így a pontos kifejezések, például az azonosítók és hibakódok a szemantikai egyezések mellett találhatók meg) és az opcionális Cohere újrarendezést (reranking), valamint egy eredménylistát ad vissza text, score, metadata, reranked és hybrid jelölőkkel és count értékkel, amelyek felhasználhatók [LLM](../nodes/llm-node.md) vagy [Agent csomópont](../nodes/agent-node.md) folyamatokban.

Gyakori lefelé irányuló csomópontok az [LLM](../nodes/llm-node.md) és az [Agent csomópont](../nodes/agent-node.md); a vektortároló beállítása a [Vektortárolók](../tabs/vectorstores-tab.md) lapon található.

#### [MCP Hívás csomópont](../nodes/mcp-call-node.md)

Az MCP Hívás csomópont közvetlenül meghív egy adott [MCP](../tabs/mcp-tab.md) eszközt, anélkül, hogy egy LLM döntené el, melyik eszközt kell aktiválni. Használja, ha tervezési időben pontosan tudja, melyik eszközt kell futtatni — determinisztikus, egylépéses MCP eszköz-végrehajtáshoz egy workflow-ban. Konfiguráljon egy kapcsolatot (SSE, Streamable HTTP vagy stdio; ugyanazok a mezők, mint az [Agent csomópont](../nodes/agent-node.md) MCP kapcsolatánál), kattintson az **Eszközök lekérése** gombra a legördülő menü feltöltéséhez, válasszon egy eszközt, és töltse ki az argumentummezőket, amelyek automatikusan megjelennek az eszköz bemeneti sémája alapján. Minden argumentum elfogad statikus értéket vagy egy [DSL kifejezést](./expression-dsl.md), például `$userInput.body.text`. Az eredmény elérhető `$nodeLabel.result` néven (JSON objektum, ha elemezhető, egyébként sztring). Az MCP Hívás csomópont nem csatlakoztatható [Agent csomópontként](../nodes/agent-node.md) vászon eszközként.

Lásd még: [Agent csomópont](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) és [Expression DSL](./expression-dsl.md).

### Logika

#### [Feltétel](../nodes/condition-node.md)

A Feltétel csomópont egy if/else kifejezés alapján ágaztatja el a workflow-ot. Két kimeneti fogópontja van: egy az igaz ágnak, egy a hamis ágnak. Használjon összehasonlító és logikai operátorokat az [Expression DSL](./expression-dsl.md)-ből a feltétel kifejezésében; a csomópont továbbítja a bemenetet a kiválasztott ágnak.

Lásd még: [Kapcsoló](../nodes/switch-node.md), [Hiba dobása](../nodes/throw-error-node.md) és [Expression DSL](./expression-dsl.md).

#### [Kapcsoló](../nodes/switch-node.md)

A Kapcsoló csomópont a végrehajtást különböző útvonalakra irányítja egy érték esetekkel való egyeztetése alapján. Konfiguráljon egy kiértékelendő kifejezést és egy esetértékek listáját; minden esethez tartozik egy forrás fogópont, és egy alapértelmezett fogópont használatos a nem egyező értékeknél. A bemenet továbbítódik a megfelelő ágnak.

Használja a [Feltétel](../nodes/condition-node.md) csomópontot bináris elágazáshoz és az [Összevonás](../nodes/merge-node.md) csomópontot az elágazó útvonalak újraegyesítéséhez; az egyeztetési szabályokat az [Expression DSL](./expression-dsl.md) ismerteti.

#### [Összevonás](../nodes/merge-node.md)

Az Összevonás csomópont több párhuzamos bemenetre vár, és egyetlen kimenetté egyesíti őket. Állítsa be a várakozó bemenetek számát; a csomópont egy összevont objektumot állít elő, miután minden ág befejeződött. Használja párhuzamos ágak eredményeinek összevonására a folytatás előtt; ne használja, ha a párhuzamos ágak külön Kimeneti csomópontokban végződnek.

Lásd még: [Párhuzamos végrehajtás](./parallel-execution.md), [Ciklus](../nodes/loop-node.md) és [Kimenet](../nodes/output-node.md) az ágak újraegyesítéséhez.

#### [Ciklus](../nodes/loop-node.md)

A Ciklus csomópont egy tömbön iterál, és lefelé irányuló csomópontokat hajt végre minden elemre. Szükséges egy visszakapcsolódás az iterációs test utolsó csomópontjából a folytatáshoz. A ciklus testén belül használhatja az `item`, `index`, `total`, `isFirst` és `isLast` változókat; a ciklusnak külön kimenetei vannak az iterációs útvonalnak és a befejezett útvonalnak.

Párosítható a [Változó](../nodes/variable-node.md), [Összevonás](../nodes/merge-node.md) és [Expression DSL](./expression-dsl.md) csomópontokkal iteratív workflow-okhoz.

### Adat

#### [Beállítás](../nodes/set-node.md)

A Beállítás csomópont átalakítja és leképezi a bemeneti adatokat egyéni kimenetre. Definiáljon kulcs-érték hozzárendeléseket, ahol minden érték egy [Expression DSL](./expression-dsl.md) kifejezés. Használható nagybetűsítéshez, részsztringhez, összefűzéshez, véletlenszámokhoz és hasonló átalakításokhoz. A kimenet kulcs alapján érhető el (pl. `$setNode.keyName`). Ha egy ügynökhöz csatlakozik vászon csomópont eszközként, a leképezési értékek megjelölhetők ügynök által megadottként, így az ügynök futásidőben tölti ki őket. Más workflow-ok meghívásához használja inkább a [Végrehajtás](../nodes/execute-node.md) csomópontot.

Lásd még: [Változó](../nodes/variable-node.md), [Végrehajtás](../nodes/execute-node.md) és [Expression DSL](./expression-dsl.md).
#### [Konverter](../nodes/converter-node.md)

A Konverter csomópont adatformátumok közötti átalakítást végez kódírás nélkül. A szöveges átalakítások közé tartozik a `csvToJson` (CSV szöveg sorobjektumokká vagy tömbökké, ha nincs fejléc), a `jsonToCsv` (objektumok/sorok tömbjéből CSV szöveg), az `xmlToJson` (XML szövegből objektum) és a `jsonToXml` (objektumból XML szöveg). Konfigurálja az átalakítás irányát és a forráskifejezést; a CSV átalakítások továbbiakban használnak egy elválasztójelet és fejléckezelést, és a `jsonToCsv` explicit oszloprendet is rögzíthet. Az idézőjelek, beágyazott elválasztók és beágyazott új sorok az RFC 4180 szabványt követik. Az XML attribútumok `@` előtagokat használnak, a szöveg, amely attribútumokkal keveredik, `#text` jelölést kap, az ismétlődő elemek tömbökké válnak, és az XML entitások kibontása le van tiltva. Ugyanez a csomópont tárolt fájlokon is működik. Az `imageToText` és a `pdfToText` a Tesseract OCR-t futtatja, egy fájlt olvas be a Heym Drive-ból (`$Upload.file.id` egy Fájlfeltöltés triggerből, egy Drive csomópont eredményéből vagy egy ügynök által generált fájlból), automatikusan kiválasztja a nyelvet az észlelt szkript alapján vagy Ön által megadott kódok alapján, mint például a `tur` vagy az `eng+tur`, és alapértelmezés szerint UTF-8-ra normalizálja a szöveget, opcionális NFC normalizálással és szűkebb karakterkészletekkel, mint például a `cp1254`. A `fileConvert` egy tárolt fájlt más formátumba ír át, dokumentumokat pandoc-on és képeket Pillow-on keresztül, és az eredményt új Drive fájlként menti anélkül, hogy az eredetit módosítaná. Az eredmény elérhető `$converterNode.result` néven, az OCR futásokhoz tartozó `.language`, `.encoding`, `.page_count`, `.pages` és `.file` mellett, valamint a `fileConvert` esetében `.id`, `.filename` és `.download_url` is elérhető.

Lásd még: [Set](../nodes/set-node.md), [Adattábla](../nodes/datatable-node.md) és [Kifejezés DSL](./expression-dsl.md).

#### [Kód](../nodes/code-node.md)

A Kód csomópont Python kódot futtat, amelyet Ön ír, saját `requirements.txt` fájllal, egy olyan konténerben, amely minden futtatáshoz létrejön és megsemmisül. A kódja egy `main(params)` függvényt definiál, és bármilyen JSON-szerializálható értéket visszaad, amely `$codeNode.result` lesz; bármit, amit kiír, külön rögzítve `$codeNode.logs` néven, és `$codeNode.install` jelenti, hogy melyik eszköz telepítette a függőségeket. A paraméterek egy JSON objektumként vannak konfigurálva, amelynek `$` kifejezései a futtatás előtt feloldódnak, és a kód pontjelöléssel olvassa őket, például `params.user.name` vagy `params.orders[0].id`. A függőségek `uv` segítségével települnek, visszaesve `pip`-re azokhoz a csomagokhoz, amelyeket az `uv` nem tud kezelni, és nincs gyorsítótárazás a futások között; ha üresen hagyja a `requirements.txt` fájlt, teljesen kihagyja a telepítést, és sokkal gyorsabb. A futtatási fázisban nincs hálózat, kivéve, ha a `codeAllowNetwork` be van kapcsolva, míg a függőségek telepítése mindig eléri a PyPI-t. A homokozó nem root felhasználóként fut, minden képességgel lecsökkentve, csak olvasható gyökérfájlrendszerrel, Docker socket nélkül, és nincs hozzáférés a háttér titkos kulcsaihoz, legfeljebb 512 MB memóriával, egy CPU-val, 256 folyamattal, 120 másodperces telepítéssel és 60 másodperces futtatással. Docker szükséges, és nincs visszaesési mód: elérhető démon nélkül a csomópont hibát jelez, nem pedig a háttérfolyamatban futtatja a kódot.

#### [Változó](../nodes/variable-node.md)

A Változó csomópont beállít vagy frissít egy workflow-lokális változót (`$vars.variableName`) vagy egy állandó [globális változót](./global-variables.md) (`$global.variableName`). Használja számlálókhoz, felhalmozott listákhoz és megosztott állapothoz. Konfigurálja a változó nevét, értékkifejezést, típuskényszerítést és azt, hogy a globális tárolóban kell-e tárolni. A tömbváltozók támogatják a `$array()` és a `.add()` függvényeket.

Párosítva: [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) és [Globális változók](./global-variables.md).

#### [Futtatás](../nodes/execute-node.md)

A Futtatás csomópont egy másik workflow-t (al-workflow-t) hív meg és átadja neki a bemenetet. Adja meg a célworkflow-t azonosító alapján, és adjon meg bemenetet egyetlen kifejezéssel vagy kulcs-érték leképezésekkel. A kimenet tartalmazza a workflow_id-t, állapotot és kimeneteket; használja újrafelhasználható logikához, nem pedig adatátalakításhoz (erre használja a Set csomópontot).

Lásd még: [Vászon funkciók](./canvas-features.md) az Al-Workflow kinyeréséhez, [Workflow szerkezet](./workflow-structure.md) és [Kimenet](../nodes/output-node.md).

### Integrációk

#### [HTTP](../nodes/http-node.md)

A HTTP csomópont HTTP kéréseket indít cURL-stílusú konfigurációval. Kezdőpont lehet egy workflow-ban (nincs bejövő él) vagy bemenetet kaphat felsőbb csomópontoktól. A válasz állapotként, fejlécként és törzsként (alkalmazható esetben elemzett JSON-ként) érhető el. Használjon [Hitelesítési adatokat](./credentials.md) Bearer vagy egyéni fejléc hitelesítéshez.

Párosítva: [Webhookok](./webhooks.md), [Hitelesítési adatok](./credentials.md) és [Harmadik féltől származó integrációk](./integrations.md).

#### [WebSocket Küldés](../nodes/websocket-send-node.md)

A WebSocket Küldés csomópont egy kimenő klienskapcsolatot nyit meg, egy szöveges/JSON/bináris üzenetet küld, majd bezárja azt. Használja workflow kimenetek valós idejű rendszerekbe történő közzétételéhez anélkül, hogy Heym által hosztolt socket végpontot hozna létre.

Lásd még: [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) és [Harmadik féltől származó integrációk](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

A Telegram csomópont üzenetet küld egy csevegésbe, csoportba vagy csatornára egy bot segítségével. Konfiguráljon egy Telegram [hitelesítési adatot](./credentials.md), állítsa be a `chatId` paramétert, és állítsa össze a kimenő `message` üzenetet [Expression DSL](./expression-dsl.md) kifejezésekkel. Természetes párjai a [Telegram Trigger](../nodes/telegram-trigger-node.md) a beszélgetésalapú workflow-khoz, valamint a [Error Handler](../nodes/error-handler-node.md) az operátori riasztásokhoz.

Lásd még: [Harmadik féltől származó integrációk](./integrations.md) és [Hitelesítési adatok](./credentials.md) a beállításhoz és a hitelesítési mintákhoz.

#### [Slack](../nodes/slack-node.md)

A Slack csomópont üzenetet küld egy Slack csatornába egy bejövő Webhook segítségével. Konfiguráljon egy Slack [hitelesítési adatot](./credentials.md) és egy üzenetkifejezést. Használható értesítések, riasztások és hibajelentések küldésére; a kimenet továbbítja a bemenetet.

Természetes párjai: [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) és [Harmadik féltől származó integrációk](./integrations.md).

#### [Discord](../nodes/discord-node.md)

A Discord csomópont üzenetet küld egy Discord csatornába egy bejövő Webhook segítségével. Konfiguráljon egy Discord [hitelesítési adatot](./credentials.md), állítsa össze a kimenő üzenetet [Expression DSL](./expression-dsl.md) kifejezésekkel, és opcionálisan állíthat be webhook felhasználónevet vagy avatar felülírásokat.

Természetes párjai: [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) és [Harmadik féltől származó integrációk](./integrations.md).

#### [E-mail küldése](../nodes/send-email-node.md)

Az E-mail küldése csomópont e-maileket küld SMTP-n keresztül. Konfiguráljon egy SMTP [hitelesítési adatot](./credentials.md) és [Expression DSL](./expression-dsl.md) kifejezéseket a címzettek, tárgy és törzs megadásához. Használható értesítések, riasztások és tranzakciós e-mailek küldésére. A kimenet tartalmazza az állapotot, a címzettet és a tárgyat.

Az [IMAP Trigger](../nodes/imap-trigger-node.md) kiegészíti az E-mail küldést a bejövő levelek kezelésével. Együtt lehetővé teszik, hogy egy workflow olvassa a bejövő e-maileket egy megosztott postaládából, összefoglalja vagy osztályozza őket AI csomópontokkal, majd küldjön egy következő vagy eszkalációs üzenetet. A [Telegram Trigger](../nodes/telegram-trigger-node.md) és a [Telegram csomópont](../nodes/telegram-node.md) ugyanezt a bejövő/kimenő mintát biztosítja a bot által vezérelt csevegéses workflow-khoz.

Kétirányú értesítési folyamatokhoz jól párosítható az [LLM](../nodes/llm-node.md), az [Agent Node](../nodes/agent-node.md) és a [Harmadik féltől származó integrációk](./integrations.md).

#### [Redis](../nodes/redis-node.md)

A Redis csomópont Redis műveleteket hajt végre: set, get, hasKey és deleteKey. Használható gyorsítótárazásra, sebességkorlátozásra és kulcs-érték tárolásra. Konfiguráljon egy [hitelesítési adatot](./credentials.md), művelet típust, kulcskifejezést, és set műveletekhez értéket és opcionális TTL-t. A kimenet a művelettől függően változik (érték, siker, létezés, törölve).

Természetes párjai: [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) és [Parallel Execution](./parallel-execution.md) gyorsítótárazáshoz, szabályozáshoz és koordinációhoz.

#### [Grist](../nodes/grist-node.md)

A Grist csomópont olvas, ír és kezel adatokat Grist táblázatokban. A műveletek közé tartozik a getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables és listColumns. Adja meg a dokumentum azonosítóját, tábla azonosítóját, és létrehozás/frissítés esetén a rekord adatokat oszlop azonosítók használatával. Használható CRUD műveletekre, kötegelt frissítésekre és táblázat automatizálásra.

Lásd még: [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) és [Harmadik féltől származó integrációk](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

A Google Sheets csomópont OAuth2-n keresztül olvas, ír és kezel táblázat adatokat. Használható jelentések olvasására, workflow eredmények hozzáfűzésére, nyomkövetők frissítésére és lapok vizsgálatára vagy törlésére egy workflow-on belül. A [BigQuery](../nodes/bigquery-node.md) hasonlóan Google által támogatott integrációs hitelesítést használ, és jól illeszkedik a [Grist](../nodes/grist-node.md) mellé, ha a táblázat adatok részei a folyamatnak.

Természetes párjai: [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) és [Harmadik féltől származó integrációk](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

A BigQuery csomópont SQL lekérdezéseket futtat és sorokat szúr be Google BigQuery adathalmazokba OAuth2-n keresztül. Hasznos elemző workflow-khoz, jelentéskészítő folyamatokhoz és strukturált eseményadatok írásához workflow futtatásokból. Gyakran párosul a [Set](../nodes/set-node.md) csomóponttal a sorok formázásához és a [Google Sheets](../nodes/google-sheets-node.md) csomóponttal a könnyebb, táblázat-orientált jelentéskészítéshez.

Természetes párjai: [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) és [Harmadik féltől származó integrációk](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

A Google Drive csomópont listázza, letölti, frissíti és töröl Drive-fájlokat és mappákat OAuth2-n keresztül, valamint közvetlenül átmásolhat egy Drive-fájlt a [Heym Drive](../nodes/drive-node.md) rendszerbe a `syncToHeymDrive` művelet segítségével. A Google Docs, Sheets és Slides fájloknak nincsenek letölthető bájtjaik, ezért a csomópont automatikusan exportálja őket – a Docs-ot PDF-be, a Sheets-t XLSX-be, a Slides-t PPTX-be –, felülbírálható célformátummal. A törlések alapértelmezés szerint a Drive lomtárába kerülnek, kivéve, ha a "Végleges törlés" opció be van kapcsolva. A csomópont nem engedélyezi, hogy egy mappát a fájlművelettel vagy fordítva töröljenek. A [Google Sheets](../nodes/google-sheets-node.md) csomóponthoz hasonlóan Google által támogatott OAuth2 hitelesítési adatot használ; vegye figyelembe, hogy ez teljes Drive-hozzáférést kér, ezért a megosztás előtt tekintse át a [Hitelesítési adatok megosztását](./credentials-sharing.md).

Jól kombinálható a [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) és [Harmadik féltől származó integrációk](./integrations.md) csomópontokkal.

#### [GitHub](../nodes/github-node.md)

A GitHub csomópont 40 natív GitHub REST-műveletet kínál, amelyek a repository-k, szervezetek és felhasználók, issue-k, pull request-ek, értékelések, kiadások, Actions workflow-k, forgalmi elemzések és repository fájlok kezelését fedik le. Használható issue-kezeléshez, értékelési automatizáláshoz, workflow-végrehajtáshoz és várakozáshoz, kiadási automatizáláshoz, valamint repository fájlok frissítéséhez kézi HTTP kérések nélkül. Támogatja a GitHub.com-ot és opcionális GitHub Enterprise `base_url`-t a hitelesítési adatokban.

Jól kombinálható az [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) és [Harmadik féltől származó integrációk](./integrations.md) csomópontokkal.

#### [Jira](../nodes/jira-node.md)

A Jira csomópont a workflow-kat kapcsolja össze a Jira Cloud vagy Jira Data Center / Server REST API-jával projekt-, issue-, megjegyzés-, melléklet-, felhasználó-, értesítés- és átmenetautomatizáláshoz. Képes projektek listázására, issue-k keresésére JQL-lel, issue-k létrehozására vagy frissítésére, változásnaplók vizsgálatára, érdekelt felek értesítésére, megjegyzések és mellékletek kezelésére, felhasználók lekérésére vagy kezelésére, elérhető átmenetek listázására, valamint issue-k átvitelére egy átmeneti azonosító segítségével. Használjon Jira hitelesítési adatot Atlassian e-mail címmel, API token-nel, site alap URL-lel és üzembehelyezési móddal.

Jól kombinálható az [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) és [Harmadik féltől származó integrációk](./integrations.md) csomópontokkal támogatási beérkezés, hibakezelés és kiadási workflow-khoz.

#### [Linear](../nodes/linear-node.md)

A Linear csomópont a workflow-kat kapcsolja össze a Linear GraphQL API-jával munkaterület- és issue-automatizáláshoz. Képes csapatok, projektek, issue-k, workflow állapotok, csapattagok és megjegyzések listázására; issue-k létrehozására, frissítésére, törlésére és összekapcsolására; valamint megjegyzések létrehozására, frissítésére, megoldására, megoldás visszavonására vagy törlésére. Használjon személyes API kulcsot vagy Linear OAuth2 hitelesítési adatot, majd fedezze fel a csapat, projekt, állapot és felelős UUID-kat a listázási műveletekből az issue-k létrehozása vagy frissítése előtt.

Jól kombinálható az [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) és [Harmadik féltől származó integrációk](./integrations.md) csomópontokkal beérkezés, kezelés és mérnöki backlog workflow-khoz.

#### [Supabase](../nodes/supabase-node.md)

A Supabase csomópont olvas és módosítja a Supabase PostgREST-en keresztül elérhető táblákat. Kiválóan alkalmas termék háttérrendszerekhez, felhasználói/profiladatokhoz, workflow állapothoz és CRUD-stílusú automatizálásokhoz, amelyek adatbázis-hozzáférést igényelnek egyéni HTTP kérések nélkül.

Jól kombinálható a [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) és [Harmadik féltől származó integrációk](./integrations.md) csomópontokkal.

#### [ClickHouse](../nodes/clickhouse-node.md)

A ClickHouse csomópont CRUD, számláló és nyers SQL műveleteket hajt végre egy külső ClickHouse adatbázison keresztül annak HTTP interfészén. Ideális analitikai folyamatokhoz, eseménynaplózáshoz és jelentéskészítési workflow-khoz: beszúrhat eseményeket történtükkor, majd aggregálhat vagy megszámolhatja őket a `query`/`count` műveletekkel. Tükrözi a [DataTable](../nodes/datatable-node.md) műveletkészletét (find, getAll, count, getById, insert, update, remove, upsert), plusz egy nyers SQL kiegészítést, ahol az `update`/`remove` műveletek ClickHouse mutációkként futnak.

Jól kombinálható a [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) ütemezett jelentésekhez és [Harmadik féltől származó integrációk](./integrations.md) csomópontokkal.

#### [Notion](../nodes/notion-node.md)

A Notion csomópont kezeli a Notion adatbázisokat, adatforrásokat, oldalakat és blokkokat a jelenlegi Notion API (`2026-03-11`) segítségével. Támogatja a keresést, oldal CRUD műveleteket, adatbázis és adatforrás műveleteket, blokk gyermekeket, blokkok hozzáfűzését/frissítését/törlését, valamint a lomtárba helyezést/visszaállítást. Használjon belső integrációs tokent vagy Notion nyilvános integrációs OAuth hitelesítési adatot. A szerkesztő képes keresni és kurzoros lapozással elérhető adatforrásokat és szülőoldalakat. A megosztott hitelesítési adatok ugyanúgy működnek, mint a tulajdonos hitelesítési adatok a workflow végrehajtásához.

Egyéni REST hívásokhoz a `$credentials.YourNotionCredential` ugyanazt a bearer tokent oldja fel. Jól kombinálható a [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) és [Harmadik féltől származó integrációk](./integrations.md) csomópontokkal.
#### [Sentry](../nodes/sentry-node.md)

A Sentry csomópont automatizálja a Sentry szervezetek, projektek, csapatok, hibák, események és kiadások kezelését a Sentry REST API-n keresztül. Riasztások kezelésére, hibák állapotának frissítésére, kiadások automatizálására, események keresésére, valamint projektek és csapatok beállítására vagy törlésére használható. Támogatja a Sentry SaaS-t és az önállóan üzemeltetett Sentry-t egy opcionális hitelesítési alap URL segítségével.

Jól kombinálható a [Hibakezelő](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) csomópontokkal és a [Harmadik féltől származó integrációkkal](./integrations.md) incidens- és kiadás-munkafolyamatokhoz.

#### [Adattábla](../nodes/datatable-node.md)

Az Adattábla csomópont olvas, ír és kezel adatokat a Heym Adattáblákban (elsődleges strukturált tároló). Műveletek közé tartozik a keresés, összes lekérdezése, azonosító alapján lekérdezése, beszúrás, frissítés, törlés és upsert. Külső hitelesítő adatok nem szükségesek. A táblákat az [Adattábla](../tabs/datatable-tab.md) irányítópult lapon kezelheti, és közvetlenül a munkafolyamat tulajdonosa férhet hozzájuk.

Jól párosítható a [Beállítás](../nodes/set-node.md), [Változó](../nodes/variable-node.md) csomópontokkal és az [Adattábla lap](../tabs/datatable-tab.md) elsődleges strukturált tároláshoz.

#### [Drive](../nodes/drive-node.md)

A Drive csomópont kezeli a készségek által generált fájlokat közvetlenül a munkafolyamaton belül. Műveletek közé tartozik a törlés, jelszó beállítása, élettartam beállítása, maximális letöltések beállítása, megosztás csapatokkal és megosztás visszavonása csapatokból a csak olvasható hozzáférés kezeléséhez; a formátumátalakítás a [Konverter](../nodes/converter-node.md) csomópontban található. A fájlra a `$agentLabel._generated_files[0].id` kifejezéssel hivatkozhat; a kimenetek közé tartozik az állapot, fájlazonosító, frissített letöltési URL a linkkorlátozásokhoz, és a megosztott_csapat_száma a csoportos megosztáshoz. Különösen hasznos az [Ügynök csomópont](../nodes/agent-node.md) munkafolyamatokkal, amelyek [Fájlgenerálást](./file-generation.md) és a [Drive](./drive.md) referencia modellt használják.

Gyakori társai az [Ügynök csomópont](../nodes/agent-node.md), a [Fájlgenerálás](./file-generation.md) és a [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Az Amazon S3 csomópont objektumtárolási műveleteket hajt végre az Amazon S3-on egy `s3` hitelesítő adat (hozzáférési kulcs, titkos kulcs, régió, opcionális munkamenet-token) segítségével. Műveletek közé tartozik az objektum feltöltése, lekérése, törlése, objektumok listázása, objektum másolása, bucket létrehozása, bucket törlése, mappa létrehozása, mappa törlése, összes mappa lekérése és bucket-ek listázása. Szöveges feltöltés és szöveges vagy base64 letöltés támogatott, a bucket és kulcs mezők elfogadják a [Kifejezés DSL](./expression-dsl.md) kifejezéseket. Használható munkafolyamat kimenetek tárolására, fájlok archiválására és objektumok visszaolvasására a folyamba.

Jól kombinálható a [Beállítás](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Hitelesítő adatok](./credentials.md) és [Harmadik féltől származó integrációk](./integrations.md) csomópontokkal.

### Automatizálás

#### [Crawler](../nodes/crawler-node.md)

A Crawler csomópont weboldalakat kapar le FlareSolverr segítségével, opcionális HTML kinyeréssel CSS szelektorok használatával. Konfiguráljon egy FlareSolverr [hitelesítő adatot](./credentials.md), URL kifejezést, várakozási időt és opcionális szelektorokat a kinyeréshez. A kimenet a nyers HTML vagy a kinyert tartalom. Webes adatgyűjtésre és tartalomkinyerésre használható.

Jól párosítható a [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) és [LLM](../nodes/llm-node.md) csomópontokkal kaparás-és-elemzés folyamatokhoz.

#### [Playwright](../nodes/playwright-node.md)

A Playwright csomópont automatizálja a böngészőinterakciókat konfigurálható lépésekkel (navigálás, frissítés, kattintás, gépelés, képernyőkép, kinyerés, aiStep) vagy **Kód futtatása** módban egyéni Playwright Python kódhoz (homokozóban; alapértelmezés szerint ki van kapcsolva a `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED` változóval). Támogatja a fej nélküli módot, egy opcionális beállítást, amely csökkenti a gyakori Playwright automatizációs jeleket, időtúllépéseket, opcionális hálózatrögzítést (válaszok, sütik, localStorage, sessionStorage), süti/tárolási állapot hitelesítés betöltését [Globális változók](./global-variables.md) kifejezésekkel, mint például `$global.authState`, tartalék bejelentkezési lépéseket, amikor a hitelesítés visszaállítása meghiúsul, és egy AI lépést Auto Heal funkcióval, ha a szelektorok meghiúsulnak. Webes adatgyűjtésre, űrlapkitöltésre és böngészőalapú munkafolyamatokhoz használható.

Lásd még: [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) és [Végrehajtási előzmények](./execution-history.md) böngészőautomatizáláshoz és hibakereséshez.

### Segédprogramok

#### [Kimenet](../nodes/output-node.md)

A Kimenet csomópont a munkafolyamat végpontja, amely visszaadja a választ a hívónak. Állítsa be az üzenet kifejezést az előző csomópontra címke alapján történő hivatkozáshoz (soha ne használja a `$input`-ot a [Bemenet](../nodes/input-node.md) csomópontból itt). Az opcionális aszinkron lefelé irányuló folyamat lehetővé teszi, hogy a kimenet utáni csomópontok a háttérben fussanak a válasz elküldése után.

Gyakori felfelé irányuló források a [Bemenet](../nodes/input-node.md), [LLM](../nodes/llm-node.md) és [Végrehajtás](../nodes/execute-node.md) csomópontok; a válaszformázás könnyebben hibakereshető a [Kifejezés kiértékelési párbeszédpanelben](./expression-evaluation-dialog.md).

#### [JSON kimenet leképező](../nodes/json-output-mapper-node.md)

A JSON kimenet leképező csomópont egy egyszerű JSON objektumot épít fel [Beállítás](../nodes/set-node.md) stílusú kulcs-érték hozzárendelésekből, és visszaadja azt a munkafolyamat válaszának gyökerében. Használja, ha egy API hívónak nyers JSON törzsre van szüksége a szabványos [Kimenet](../nodes/output-node.md) csomópont burkolója helyett.
#### [HTML kimenet leképező](../nodes/html-output-mapper-node.md)

A HTML kimenet leképező csomópont egyetlen HTML sablont renderel, amelybe a `$nodeLabel.field` kifejezéseket illeszti be. Ha ez a workflow egyetlen terminálcsomópontja, az execute webhook `text/html` típusú választ küld a konfigurált állapotkóddal együtt a JSON törzs helyett, így a workflow közvetlenül egy böngészőnek szolgálhat ki egy oldalt. A `X-Simple-Response: false` fejléc küldésével a szokásos JSON burkolatot kaphatja vissza hibakeresés céljából.

Párosítható a [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) és [Webhooks](./webhooks.md) csomópontokkal.

#### [Diagram kimenet](../nodes/chart-output-node.md)

A Diagram kimenet csomópont a [Dashboard](../tabs/dashboard-tab.md) widget workflow terminálcsomópontja. A felsőbb rétegű csomópontok által előállított sorokat szabványos diagram adattá alakítja, amelyet a dashboard megjelenít. Válasszon `chartType` értéket (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text vagy HITL), képezze le a `labelField`/`valueField` mezőket (vagy `series` több sorozathoz, vagy `text` egy markdown üzenethez), és helyezze el utolsóként; nincs kimeneti éle. A HITL figyelmen kívül hagyja a felsőbb rétegű sorokat, és a függőben lévő emberi ellenőrzéseket listázza. egy másikat pedig hivatkozásgombokként, amelyek új lapon nyitnak meg egy URL-t (`linkColumn`, a gomb szövegéhez `linkLabel` paraméterrel)

Lásd még: [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) és [Output](../nodes/output-node.md).

#### [Várakozás](../nodes/wait-node.md)

A Várakozás csomópont a workflow végrehajtását a megadott milliszekundumos időtartamra szünetelteti, legfeljebb 15 percig. Használható sávszélesség-szabályozáshoz, késleltetett műveletekhez vagy lekérdezési időközökhöz. A bemenetet változatlanul továbbítja.

Párosítható a [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) és [Parallel Execution](./parallel-execution.md) csomópontokkal ütemezéshez és lekérdezéshez.

#### [Címke](../nodes/sticky-note-node.md)

A Címke csomópont markdown jegyzeteket ad a vászathoz. Nem kerül végrehajtásra. Használható dokumentációhoz, utasításokhoz vagy workflow jegyzetekhez más [Canvas Features](./canvas-features.md) mellett. Kattintson duplán a vászatra a jegyzet tartalmának szerkesztéséhez.

Lásd még: [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) és [Workflow Organization](./workflow-organization.md).

#### [Konzol napló](../nodes/console-log-node.md)

A Konzol napló csomópont egy értéket naplóz a háttérrendszer (szerver) konzoljára. Hibakereséshez és vizsgálathoz használható fejlesztés közben. A naplóüzenet támogatja az [Expression DSL](./expression-dsl.md) kifejezéseket; a bemenetet változatlanul továbbítja.

Párosítható az [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) és [Expression Evaluation Dialog](./expression-evaluation-dialog.md) csomópontokkal hibakereséshez.

#### [Csomópont letiltása](../nodes/disable-node.md)

A Csomópont letiltása csomópont véglegesen letilt egy másik csomópontot a workflow-ban az `active` jelző false értékre állításával. Adja meg a célcsomópontot címkével. Használható egyszeri műveletekhez, például egy [Cron](../nodes/cron-node.md) trigger leállításához egy feltétel teljesülése után.

Lásd még: [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) és [Cron](../nodes/cron-node.md) workflow vezérlési mintákhoz.

#### [Csomópont engedélyezése](../nodes/enable-node.md)

A Csomópont engedélyezése csomópont visszakapcsol egy másik csomópontot az `active` jelző true értékre állításával és a változtatás mentésével. Adja meg a célcsomópontot címkével. Használható egy letiltott [Cron](../nodes/cron-node.md) trigger újraaktiválásához egy másik belépési pontból, vagy egy csomópont bekapcsolásához egy feltétel teljesülése után. Egy célcsomópont, amely a Csomópont engedélyezése alatt helyezkedik el és még nem futott le, a jelenlegi végrehajtásban is lefut.

Lásd még: [Csomópont letiltása](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) és [Cron](../nodes/cron-node.md) workflow vezérlési mintákhoz.

#### [Hiba dobása](../nodes/throw-error-node.md)

A Hiba dobása csomópont azonnal leállítja a workflow végrehajtását, és egy egyéni HTTP állapotkódú hibaüzenettel tér vissza. Állítsa be a hibaüzenet kifejezést és az állapotkódot (pl. 400, 401, 403, 404, 429, 500). Használható érvénytelen adatokhoz, jogosulatlan hozzáféréshez vagy más hibás állapotokhoz, különösen [Condition](../nodes/condition-node.md) és [Error Handler](../nodes/error-handler-node.md) csomópontokkal párosítva.

Párosítható a [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) és [Security](./security.md) csomópontokkal explicit hibautakhoz.

---

## Referencia
### [Csomóponttípusok](./node-types.md)

A Heym számos csomóponttípust kínál: triggerek, mint például a [Bemenet](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) és a [Hibakezelő](../nodes/error-handler-node.md); AI csomópontok, mint az [LLM](../nodes/llm-node.md), [Döntés](../nodes/decision-node.md), [Agent csomópont](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) és az [MCP hívás](../nodes/mcp-call-node.md); logikai csomópontok, mint a [Feltétel](../nodes/condition-node.md), [Kapcsoló](../nodes/switch-node.md), [Összevonás](../nodes/merge-node.md) és a [Ciklus](../nodes/loop-node.md); adatcsomópontok, mint a [Beállítás](../nodes/set-node.md), [Konverter](../nodes/converter-node.md), [Kód](../nodes/code-node.md), [Változó](../nodes/variable-node.md), [Végrehajtás](../nodes/execute-node.md) és a [Heym](../nodes/heym-node.md); integrációk, mint az [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [E-mail küldés](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Táblázatok](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Adattábla](../nodes/datatable-node.md) és a [Drive](../nodes/drive-node.md); automatizációs csomópontok, mint a [Crawler](../nodes/crawler-node.md) és a [Playwright](../nodes/playwright-node.md); valamint segédprogramok, mint a [Várakozás](../nodes/wait-node.md), [Kimenet](../nodes/output-node.md), [JSON kimenet leképező](../nodes/json-output-mapper-node.md), [HTML kimenet leképező](../nodes/html-output-mapper-node.md), [Konzol napló](../nodes/console-log-node.md), [Hiba dobás](../nodes/throw-error-node.md), [Csomópont letiltás](../nodes/disable-node.md), [Csomópont engedélyezés](../nodes/enable-node.md) és a [Címke](../nodes/sticky-note-node.md). A csomópontok konfigurálásakor használjon kifejezéseket, mint például `$input.text` és `$nodeLabel.field`.

Lásd még: [Triggerek](./triggers.md), [Harmadik féltől származó integrációk](./integrations.md) és [Párhuzamos végrehajtás](./parallel-execution.md).

### [Kifejezés DSL](./expression-dsl.md)

A Heym egy egyszerű kifejezésnyelvet használ a felsőbb rétegbeli csomópontok adatainak hivatkozására. Használja a `$input` kifejezést a [Bemenet](../nodes/input-node.md) csomópont esetében, `$nodeLabel.field` bármely felsőbb rétegbeli csomópontra, `$credentials.CredentialName` a [hitelesítési adatok](./credentials.md) esetében, és `$global.variableName` a [globális változók](./global-variables.md) esetében. Beépített speciális változók közé tartozik a `$now`, `$UUID` és a workflow metaadatok: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` és `$executionId` (a futtatás [Végrehajtási előzményeinek](./execution-history.md) azonosítója — a `/workflows/{id}/{executionId}` elérési út megnyitja a futtatást a vásznon; csak futási időben érhető el, üres a kifejezés előnézeti párbeszédablakban). A támogatott funkciók közé tartoznak a literálok, aritmetikai műveletek, összehasonlítások, [Ciklus](../nodes/loop-node.md) kontextus, beágyazott mezők, valamint karakterlánc- és tömbsegédfüggvények (beleértve a `$text.toJson()` függvényt JSON karakterlánc elemzéséhez). Ha a teljes érték egyetlen `$expr` kifejezés, a háttérrendszer megőrzi a tömböket, objektumokat, logikai értékeket és számokat natív típusként.

Lásd még: [Kifejezés kiértékelési párbeszédablak](./expression-evaluation-dialog.md), [Globális változók](./global-variables.md) és [Workflow szerkezet](./workflow-structure.md).

### [Globális változók](./global-variables.md)

A Globális Változó Tároló tartós, felhasználóhoz kötött kulcs-érték adatokat tárol, amelyek a workflow-végrehajtások között is megmaradnak. Változókat hozhat létre a [Változók](../tabs/global-variables-tab.md) lapról vagy egy [Változó](../nodes/variable-node.md) csomópontból, ha engedélyezve van a "Tárolás a Globális Változó Tárolóban" lehetőség. Ezeket a `$global.variableName` kifejezéssel érheti el; megoszthatók más felhasználókkal vagy [csapatokkal](./teams.md).

Párosítható a [Változó](../nodes/variable-node.md) csomóponttal, a [Csapatok](./teams.md) és a [Hitelesítési adatok megosztása](./credentials-sharing.md) funkciókkal a megosztott workflow-állapot kezeléséhez.
### [Kifejezésértékelő párbeszédpanel](./expression-evaluation-dialog.md)

A Kifejezésértékelő párbeszédpanel egy kinyitható szerkesztő, amely akkor jelenik meg, amikor a kifejezésmezők melletti kibontás gombra kattint. Nagy, középre igazított modalként nyílik meg, megtartja az automatikus kiegészítés funkciót, és automatikusan frissíti a háttérben generált előnézeti kimenetet, miután szünetelteti a gépelést. Az objektum- és tömb eredményeket a kimeneti útvonalválasztóval lehet böngészni. A párbeszédpanel elfogad egy teljes sorban megadott pontozott útvonalat (például `myNode.output.field`), mintha `$myNode.output.field` lenne; lásd a [Kifejezés DSL](./expression-dsl.md) elhelyezési szabályait.

Az eszköztár **AI-vel építés** gombja lehetővé teszi, hogy egyszerű szövegben írja le a kívánt kifejezést. Válasszon ki egy LLM [hitelesítési adatot](./credentials.md) és modellt, írjon be egy leírást, például *"Kérje le az ügyfél nevét az API válaszból"*, majd kattintson a Generálás gombra. A háttérrendszer elküldi a [Kifejezés DSL](./expression-dsl.md) kontextust és a legutóbbi futtatás csomópontkimeneteit a modellnek, és egyetlen kifejezésláncot ad vissza. Az eredmény azonnal kiértékelődik, így ellenőrizheti, mielőtt az Alkalmaz gombra kattint.

Természetesen párosítható a [Kifejezés DSL](./expression-dsl.md), a [Kimenet](../nodes/output-node.md) és a [JSON kimenetleképező](../nodes/json-output-mapper-node.md) csomópontokkal.

### [Workflow szerkezet](./workflow-structure.md)

A Workflow-k JSON formátumban tárolódnak csomópontokkal és élekkel. A workflow objektum tartalmazza az azonosítót, nevet, leírást, csomópontokat, éleket és hitelesítési beállításokat. Minden csomópont rendelkezik azonosítóval, típussal, pozícióval és adatokkal (címke és típus-specifikus konfiguráció). Az élek összekötik a forrás- és célcsomópont azonosítóit, opcionális fogóazonosítókkal. Az adatmezőkben szereplő kifejezésszintaxis követi a [Kifejezés DSL](./expression-dsl.md) szabályait, és ugyanezt az alakot használja a [Letöltés és importálás](./download-import.md) funkció is.

Lásd még: [Csomóponttípusok](./node-types.md), [Kifejezés DSL](./expression-dsl.md) és [Letöltés és importálás](./download-import.md).

### [Vászon funkciók](./canvas-features.md)

Ha egy nem rögzített vászoncsomópont fölé viszi az egérmutatót, és a **Futtatás** gombra kattint, akkor az adott csomópontig történik a végrehajtás. A szükséges bemenetek megnyílnak a Futtatás panelen, az első mező fókuszálva; a bemenet nélküli útvonalak azonnal elindulnak. Lásd: [Futtatás csomópontig](./canvas-features.md#run-to-node).

A workflow-szerkesztő biztosítja az Adatrögzítést (egy csomópont utolsó kimenetének rögzítése a lefelé tartó folyamat teszteléséhez anélkül, hogy újra futtatná), Végrehajtási naplókat (valós idejű csomóponteredmények és ügynökfolyamat, amely kiegészíti a [Végrehajtási előzményeket](./execution-history.md)), Engedélyezés/Letiltás (csomópontok kihagyása a végrehajtás során) és Kinyerés al-workflowba (egy kijelölés áthelyezése egy új workflowba és lecserélése egy [Végrehajtás](../nodes/execute-node.md) csomópontra). Egy futó éles végrehajtás megnyitható az Előzményekből vagy egy Tábla kártyáról; a szerkesztő visszaállítja annak aktuális pillanatképét, csatlakozik az SSE-hez, és élőben tartja a vászon animációt és a Hibakeresési naplókat. A [Billentyűparancsok](./keyboard-shortcuts.md) támogatják a másolást, beillesztést, futtatást és a beágyazott csomópontkeresést.

Lásd még: [Billentyűparancsok](./keyboard-shortcuts.md), [Szerkesztési előzmények](./edit-history.md) és [Végrehajtási előzmények](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Szerkesztő bemutató megtekintése</a></p>

### [Billentyűparancsok](./keyboard-shortcuts.md)

A Heym billentyűparancsokat kínál a szerkesztőben: Parancspaletta (Ctrl+K), Futtatás (Ctrl+Enter), Mentés (Ctrl+S), Visszavonás/Visszavonás visszavonása, és Escape a bezáráshoz. A vásznon: minden kijelölése, többes kijelölés, másolás/kivágás/beillesztés, törlés, csomópont engedélyezésének váltása (D), rögzített adatok váltása (P), és beágyazott csomópontkeresés gépeléssel. A billentyűparancsok dokumentálva vannak a beépített segédletben, és szorosan együttműködnek a [Vászon funkciókkal](./canvas-features.md), például az Adatrögzítéssel és a csomópont engedélyezésével/letiltásával.

Lásd még: [Vászon funkciók](./canvas-features.md), [Gyors fiók](./quick-drawer.md) és [Kontextuális bemutató](./contextual-showcase.md).

### [AI asszisztens](./ai-assistant.md)

Az AI asszisztens egy csevegőpanel, amely a Hibakeresés panelből nyitható meg, és lehetővé teszi, hogy természetes nyelven hozzon létre vagy módosítson workflow-kat. Válasszon ki egy [hitelesítési adatot](./credentials.md) és modellt, majd írja le, mit szeretne; az AI adatfolyamként küldi a választ, és minden érvényes [workflow JSON](./workflow-structure.md) egy kódblokkban automatikusan feldolgozódik és alkalmazódik a vásznon. A hangbemenet támogatott kompatibilis böngészőkön.

Kapcsolja be a **YOLO módot** (Ügynök mód, alapértelmezés szerint ki van kapcsolva), és az asszisztens teszteli azt, amit épít. Minden változtatás után futtatja a workflow-t a vásznon, elolvassa az eredményt és javítja a workflow-t, amíg az nem teszi azt, amit kért, legfeljebb 5 futtatás üzenetenként. A első futtatás előtt tesztbemeneteket kér, futtathatja más workflow-jait, ha szükséges azok eredménye, és megmutatja minden lépést, ahogy dolgozik. Lásd: [AI asszisztens › YOLO mód](./ai-assistant.md#yolo-mode).

Kattintson az **AI** gombra a vászon bármely csomópontja felett, ha csak azt a csomópontot szeretné módosítani vagy javítani. A panel mutatja a módosított csomópontot (a futtatás utáni legutóbbi eredménnyel), és a **Change this node as ...**, **Fix error in this node ...** és **Other** lehetőségeket kínálja. Csak az adott csomópont frissül; a workflow többi része és az elrendezés változatlan marad. Lásd: [AI Assistant › Egyetlen csomópont módosítása](./ai-assistant.md#changing-one-node).

Amikor egy workflow rekordokat tárol, az asszisztens megkérdezi, melyik [adattáblát](../tabs/datatable-tab.md) használja, vagy létrehoz egyet azokkal az oszlopokkal, amelyekre a workflow-nak szüksége van. Lásd: [AI asszisztens › Adattáblák](./ai-assistant.md#data-tables).

Ha az aktuális workflow tartalmaz [Ügynök csomópont](../nodes/agent-node.md) készségeket, az asszisztens csak az egyes készségek `SKILL.md` fájljait küldi be a workflow kontextusba. A csatolt `.py` fájlok és bináris készség eszközök ki vannak zárva a kérés előtt, hogy a nagy készségcsomagok ne töltsék túl a modell kontextusablakát.

Jól párosítható a [Heym-mel való csevegés](./chat-with-heym.md), az [Ügynök architektúra](./agent-architecture.md) és a [Kifejezés DSL](./expression-dsl.md) funkciókkal.
### [Chat with Heym](./chat-with-heym.md)

A Chat with Heym egy dokumentációs fejléc-asszisztens termékkérdésekhez. Központban megnyíló párbeszédablakban jelenik meg, a hitelesítési adatok és a modellválasztás látható marad a tetején, az aktív dokumentációs oldal elérési útját injektálja kontextusként, és törli az üzenetelőzményeket a párbeszédablak bezárásakor. Kiegészíti a szélesebb körű [AI Assistant](./ai-assistant.md) és a könnyebb súlyú [Contextual Showcase](./contextual-showcase.md) funkciókat.

Lásd még: [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) és [Node Types](./node-types.md).

### [Workflow Organization](./workflow-organization.md)

A példányadminisztrátorok (`HEYM_ADMIN_EMAILS`) hozzáférhetnek és szerkeszthetnek minden workflow-hoz, megtalálhatják egy tulajdonos workflow-jait e-mail cím alapján, megvizsgálhatják az ütemezéseket és a végrehajtási előzményeket, szüneteltethetik és folytathatják az automatikus trigger-eket, valamint törölhetik a workflow-kat, ha a futtatások leállnak. Az [Instance Administration](../tabs/workflows-tab.md#instance-administration) részben található az offboarding folyamat, valamint a különbség az automatikus trigger-ek szüneteltetése és az összes hívás blokkolása között.

A workflow-kat mappákba és almappákba lehet rendezni fa szerkezetben. A mappáknak vannak neveik és opcionális szülőmappáik; a workflow-kat mappákhoz rendelik. A workflow-kat törlésre ütemezhetik (átkerülnek egy kuka területre a végleges eltávolítás előtt). Az API támogatja a workflow-k létrehozását, frissítését, törlését és a mappák közötti áthelyezését, ugyanez a szervezési modell jelenik meg a [Workflows](../tabs/workflows-tab.md) lapon.

Lásd még: [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) és [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

A Quick Drawer egy rögzített, jobb oldali gyorsfuttatási panel belső, nem vászonlapokhoz. Lehetővé teszi a [workflow-k](../tabs/workflows-tab.md) keresését, kedvencek rögzítését, bemenetek kiválasztását, azonnali futtatást, valamint a folyamat vagy eredmények ellenőrzését a szerkesztő megnyitása nélkül. A [File Upload Trigger](../nodes/file-upload-trigger-node.md) csomóponttal rendelkező workflow behúzott vagy kiválasztott fájlt fogad. A rögzített sorrend és az utoljára kiválasztott workflow a böngészőben tárolódik.

Lásd még: [Workflow Organization](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) és [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

A Contextual Showcase egy kompakt, alkalmazáson belüli útmutató sáv a hitelesített főfelületekhez, például az irányítópult lapokhoz, [Evals](../tabs/evals-tab.md), Dokumentációk és a workflow-szerkesztőhöz. Alapértelmezés szerint zárt állapotban marad, először egy rövid oldalösszefoglalót jelenít meg, igény szerint további részleteket kínál, és hivatkozást biztosít a teljes dokumentációs cikkre, ha mélyebb útmutatásra van szükség.

Párosítható a [Chat with Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) és [AI Assistant](./ai-assistant.md) funkciókkal az alkalmazáson belüli útmutatási folyamatokhoz.

### [Credentials](./credentials.md)

A Credentials tárolják az API-kulcsokat és titkos kulcsokat, amelyeket a workflow csomópontok használnak. A [Credentials](../tabs/credentials-tab.md) lapon adhatók hozzá, és név vagy azonosító alapján hivatkozhatók rá olyan csomópontokban, mint az [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) és [Redis](../nodes/redis-node.md). Titkosítva tárolódnak, megoszthatók felhasználókkal vagy [csapatokkal](./teams.md), és hivatkozhatók rá az [Expression DSL](./expression-dsl.md) segítségével a `$credentials.Name` szintaxissal.

Lásd még: [Credentials](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md) és [Third-Party Integrations](./integrations.md).

### [Credentials Sharing](./credentials-sharing.md)

A hitelesítési adatokat megoszthatják más felhasználókkal e-mail cím alapján vagy csapatokkal; minden csapattag hozzáférést kap, ha egy hitelesítési adatot megosztanak egy csapattal. A megosztott hitelesítési adatok jelzővel jelennek meg a [Credentials](../tabs/credentials-tab.md) lapon. Futásidőben a workflow tulajdonosának kontextusa egyesíti a saját, felhasználó által megosztott és csapat által megosztott hitelesítési adatokat. Használja a `$credentials.CredentialName` kifejezést vagy állítsa be a credentialId értéket a csomópont adataiban.

Lásd még: [Credentials](./credentials.md), [Teams](./teams.md) és [Third-Party Integrations](./integrations.md).

### [Teams](./teams.md)

A csapatok lehetővé teszik, hogy workflow-kat, hitelesítési adatokat, globális változókat, vektortárolókat és Drive-fájlokat osszon meg egy felhasználói csoporttal egyszerre. Csapatokat a [Teams](../tabs/teams-tab.md) lapon hozhat létre, és tagokat adhat hozzá e-mail cím alapján. Az erőforrásokat megoszthatja egy csapattal a megfelelő megosztási párbeszédpaneleken; ekkor minden tag hozzáférést kap. A létrehozó szerkesztheti és törölheti a csapatot; egy csapat törlése minden csapatmegosztást is eltávolít.

Párosítható a [Credentials Sharing](./credentials-sharing.md), [Global Variables](./global-variables.md) és [Enterprise](./enterprise.md) funkciókkal.

### [Parallel Execution](./parallel-execution.md)

A Heym párhuzamosan futtatja a csomópontokat, ha nincsenek függőségeik egymással. A végrehajtó egy DAG-ot épít fel, és azonos szintű csomópontokat párhuzamosan futtat egy szálkészlettel; amint egy csomópont befejeződik, annak lefelé irányuló csomópontjai ütemeződnek. Használja a [Merge](../nodes/merge-node.md) csomópontot párhuzamos ágak összevonásához, ha szükséges. Több workflow-futtatás párhuzamosan fut; minden futtatás elszigetelt. Az [SSE Streaming](./sse-streaming.md) mód eseményeket küld, ahogy a csomópontok befejeződnek.

Lásd még: [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) és [Execution History](./execution-history.md).
### [Ügynök architektúra](./agent-architecture.md)

Az [Agent csomópont](../nodes/agent-node.md) támogatja az al-ügynököket (az orchestrator más ügynök csomópontokat hív meg a `call_sub_agent` segítségével), al-workflow-kat (az ügynök más workflow-kat hív meg a `call_sub_workflow` segítségével), készségeket (utasítás tartalom és Python eszközök .zip vagy .md fájlokból), valamint [MCP](../tabs/mcp-tab.md) klienskapcsolatokat. Az orchestrator eszköz-végrehajtó irányítja az al-ügynök és al-workflow hívásokat; a többi eszköz a Python, MCP vagy készség-végrehajtókhoz kerül. Az al-ügynökök és al-workflow-k maximális beágyazási mélysége 5. Az eszközhívási ciklus automatikus kontextus-tömörítést tartalmaz: minden iteráció előtt a tokenhasználat becsülve lesz, és ha az meghaladja a modell kontextusablakának 80%-át, a középső üzenetek összefoglalásra kerülnek ugyanazon modell segítségével, miközben a rendszerutasítás, az első felhasználói üzenet és az utolsó felhasználói üzenet változatlan marad.

Lásd még: [Agent csomópont](../nodes/agent-node.md), [Ügynök állandó memória](./agent-persistent-memory.md), [Ember a hurokban](./human-in-the-loop.md) és [MCP](../tabs/mcp-tab.md).

### [Ügynök állandó memória](./agent-persistent-memory.md)

Opcionális, [Agent csomópontonként](../nodes/agent-node.md) konfigurálható tudásgráf Postgres-ben tárolva: entitások, típusok, tulajdonságok és irányított kapcsolatok. Ha a `persistentMemoryEnabled` értéke igaz, a gráf minden futtatáskor összefoglalásra kerül a rendszerutasításban; sikeres befejezések után egy [LLM](../nodes/llm-node.md) strukturált frissítéseket kinyer a háttérben. A REST CRUD műveletek az `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...` útvonal alatt érhetők el. A szerkesztő a csomóponton található rózsaszín agy ikonra kattintva nyílik meg.

Lásd még: [Agent csomópont](../nodes/agent-node.md), [Ügynök architektúra](./agent-architecture.md) és [Nyomok](../tabs/traces-tab.md).

### [Ember a hurokban](./human-in-the-loop.md)

Az "Ember a hurokban" funkció lehetővé teszi, hogy egy [Agent csomópont](../nodes/agent-node.md) jóváhagyást kérjen meghatározott ellenőrzőpontokon, egy nyilvános `/review/{token}` oldalt hozzon létre, és várjon egy be nem jelentkezett értékelő döntésére, aki elfogadhatja, szerkesztheti vagy elutasíthatja a Markdown formátumú értékelési szöveget. A HITL-kompatibilis ügynökök egy `review` kimeneti kezelőt is elérhetővé tesznek, így értesíthet például [Slack](../nodes/slack-node.md), [E-mail küldése](../nodes/send-email-node.md) vagy más csatornákat, miközben a futtatás függőben van. A csomópontszintű HITL szöveg jóváhagyási irányelvekként szolgál, míg a nyilvános oldalon megjelenő összefoglaló magából az értékelési kérelemből generálódik. A függőben lévő futtatások azonnal megjelennek a [Futtatási előzmények](./execution-history.md) között, ugyanazon futtatás során többször is előfordulhatnak, és minden döntés beküldése után pontosan a mentett workflow pillanatképből folytatódnak.

Lásd még: [Agent csomópont](../nodes/agent-node.md), [Portál](./portal.md), [Futtatási előzmények](./execution-history.md) és [E-mail küldése](../nodes/send-email-node.md).

### [Webhookok](./webhooks.md)

A workflow-k indíthatók [HTTP](../nodes/http-node.md) segítségével a `POST /api/workflows/{workflow_id}/execute` útvonalon, vagy növekményesen streamelhetők a `POST /api/workflows/{workflow_id}/execute/stream` útvonalról. A kérés törzse továbbítódik a [Bemenet](../nodes/input-node.md) csomópontoknak; a fejlécek és lekérdezési paraméterek elérhetők az [Expression DSL](./expression-dsl.md) kifejezésekben. Konfigurálható workflow-onkénti hitelesítés: névtelen, JWT vagy egyéni fejléc. Az opcionális válasz gyorsítótárazás, sebességkorlátozás és a szerkesztő "Futtatás cURL paranccsal" párbeszédablaka mind a workflow-ra vonatkozik, és mindkét módra érvényes. [Konkurencialimit](./webhooks.md#concurrency-limit-and-queued-runs) esetén a várakozásra kényszerülő hívás helyette `202 Accepted` választ kap egy futtatási azonosítóval és egy állapot-URL-lel.

Lásd még: [Bemenet](../nodes/input-node.md), [Futtatási tokenek](./execution-tokens.md), [SSE streamelés](./sse-streaming.md), [HTTP](../nodes/http-node.md) és [Workflow szerkezet](./workflow-structure.md).

### [Futtatási tokenek](./execution-tokens.md)

A futtatási tokenek hatókörrel rendelkező JWT-k, amelyek hozzáférést biztosítanak egyetlen workflow végrehajtási és streamelési végpontjaihoz. Amikor egy workflow JWT hitelesítést használ, a tokenek lehetővé teszik, hogy külső szkriptek, CI folyamatok és integrációk hívják meg a workflow-t felhasználói munkamenet megosztása nélkül. Minden token tartalmaz egy `wid` jogcímet, amely egy workflow-hoz köti, egy `jti` azonnali visszavonáshoz, és egy konfigurálható élettartamot (60 másodperctől 10 évig). Tokenek létrehozása, kiválasztása és visszavonása közvetlenül a **Futtatás cURL paranccsal** párbeszédablakból történik – a kiválasztott token automatikusan beágyazódik a generált parancsba.

Lásd még: [Webhookok](./webhooks.md), [Biztonság](./security.md) és [SSE streamelés](./sse-streaming.md).

### [SSE streamelés](./sse-streaming.md)

A cURL párbeszédablak átválthatja a [webhook](./webhooks.md) végrehajtást Server-Sent Events módba. Ez valós időben `execution_started`, `node_start`, `node_complete` és `execution_complete` eseményeket generál, `--no-buffer` kapcsolót ad a generált cURL parancshoz, és lehetővé teszi csomópontonkénti kezdő üzenetek konfigurálását, például `[START] LLM` vagy egyéni szöveget külső terminál felhasználók számára.

Lásd még: [Webhookok](./webhooks.md), [Futtatási előzmények](./execution-history.md) és [LLM](../nodes/llm-node.md).
### [Trigger-ek](./triggers.md)

A Workflow-kat trigger csomópontok indítják el ([Bemeneti](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) fogadó) vagy belépési pontok: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portál](./portal.md), Cron ütemező, Telegram webhook, Discord interakciós webhook, IMAP trigger kezelő, RabbitMQ fogyasztó vagy Szerkesztőből történő futtatás. Minden triggernek saját végpontja vagy háttérfolyamata van; a [Cron](../nodes/cron-node.md) 60 másodpercenként fut, a [Telegram Trigger](../nodes/telegram-trigger-node.md) csomópontok bot webhookokat fogadnak, a [Discord Trigger](../nodes/discord-trigger-node.md) csomópontok aláírt interakciós webhookokat kapnak, az [IMAP Trigger](../nodes/imap-trigger-node.md) csomópontok pedig a beállított lekérdezési időközönként futnak. A [Bemeneti](../nodes/input-node.md) csomópontok a webhook kérésekből kapják meg a törzset, fejléceket és lekérdezéseket.

Lásd még: [Csomópont típusok](./node-types.md), [Webhookok](./webhooks.md) és [Párhuzamos végrehajtás](./parallel-execution.md).

### [Végrehajtási előzmények](./execution-history.md)

A végrehajtási előzmények rögzítik a workflow futtatásokat: bemenetek, kimenetek, csomópont eredmények, állapot és trigger forrás. Elérhetők a Szerkesztő eszköztárából, a Dokumentáció nézetből, az Irányítópult fejlécéből vagy az [Értékelések](../tabs/evals-tab.md) nézetből. A workflow-specifikus előzmények a megnyitott workflow futtatásait mutatják; az összesített előzmények nézet pedig a workflow-k és csevegések közötti futtatásokat jeleníti meg. A jelenleg futó végrehajtások mindkét párbeszédablak tetején jelennek meg **Élő megnyitás** és **Megszakítás** műveletekkel. Az Élő megnyitás a szerkesztőt csatolja a meglévő végrehajtáshoz [SSE](./sse-streaming.md) segítségével, visszaállítja a befejezett csomópontokat, pulzálja az aktuális és függőben lévő csomópontokat, és hozzáfűzi a Hibakeresési naplókat újabb futtatás indítása nélkül. A Vászonra hozás betölti egy befejezett futtatás bemeneteit és csomópont kimeneteit újrafuttatáshoz vagy hibakereséshez; a `/workflows/{workflowId}/{executionId}` mélyhivatkozás támogatja mind az élő, mind a befejezett végrehajtásokat. Az [Emberi beavatkozás](./human-in-the-loop.md) által szüneteltetett futtatások azonnal `pending` állapotban kerülnek tárolásra, beleértve a nyilvános felülvizsgálati URL-t és az ügynök `review` ágából végrehajtott értesítő csomópontokat. Ha a szerver újraindul egy futtatás közben, a megszakított futtatások automatikusan helyreállnak: újra futnak a kezdetektől ugyanazokkal a bemenetekkel, és befejezettként jelennek meg (**Helyreállított** jelöléssel), amelyet workflow-onkénti **Automatikus helyreállítás** kapcsoló vezérel, ami ehelyett `kihagyott`ként is rögzítheti őket.

Lásd még: [SSE Streamelés](./sse-streaming.md), [Emberi beavatkozás](./human-in-the-loop.md) és [Nyomvonalak](../tabs/traces-tab.md).

### Végrehajtási kiemelések

Egy élő futtatás után – vagy a **Vászonra hozás** után – a Vászon jobb felső sarkában egy eltávolítható **Végrehajtási kiemelések** felugró ablak jelenik meg, amely felsorolja, hogy mit állított elő az egyes csomópontok végrehajtási sorrendben. Ez gyors módja az egyes csomópontok kimenetének vizsgálatának minden csomópont megnyitása nélkül; zárja be a **✕** gombbal, és a következő futtatáskor újra megnyílik. A kiemelések az irányítópult futtatásain is megjelennek. Részletekért lásd: [Végrehajtási előzmények](./execution-history.md).

### [Szerkesztési előzmények](./edit-history.md)

A Szerkesztési előzmények nyomon követik egy workflow mentett verzióit (minden Mentés létrehoz egy verziót). Megtekintheti a listát, megnyithat egy verziót, hogy lássa a különbségeket az aktuális workflow-hoz képest ([csomópontok](./workflow-structure.md), élek, konfiguráció), és Visszaállíthat egy korábbi verziót. A [Végrehajtási előzményekkel](./execution-history.md) ellentétben a Szerkesztési előzmények a szerkezeti változásokat követik nyomon, nem a futtatásokat.

Lásd még: [Végrehajtási előzmények](./execution-history.md), [Workflow szerkezet](./workflow-structure.md) és [Vászon funkciók](./canvas-features.md).

### Hibakezelő Workflow

Egy workflow kijelölhet egy másik workflow-t, amely akkor fut le, ha az meghibásodik. Konfigurálható a workflow szintű **Tulajdonságok** panelben (amikor nincs csomópont kiválasztva) a **Hiba esetén futtatandó workflow** alatt. Csak a workflow tulajdonosa állíthatja be, módosíthatja vagy törölheti; lásd: [Csak tulajdonos által módosítható beállítások](./workflow-organization.md#owner-only-settings). Ha egy legfelső szintű futtatás kezeletlen hibával ér véget, a kiválasztott hibakezelő workflow fut, és megkapja a hiba kontextusát (sikertelen workflow azonosító és név, futtatás azonosító, hibaüzenet, sikertelen csomópont címke és típus, időbélyeg). Ha a vászon már tartalmaz [Hibakezelő](../nodes/error-handler-node.md) csomópontot, a helyi kezelő élvez elsőbbséget, és a hibakezelő workflow **nem** hívódik meg. A hibakezelő workflow közvetlenül fut, így soha nem indítja el a saját hibakezelő workflow-ját.

Minden nem teszt legfelső szintű futtatást lefed: mindkét végrehajtási végpont, a [Portál](./portal.md), és minden trigger, beleértve a [cron](../nodes/cron-node.md) ütemezőt, a csevegő platform trigger-eket, e-mailt, várólistákat, [MCP](../tabs/mcp-tab.md)-t és irányítópult widget-eket. A [Terheléselosztás](./cluster.md) engedélyezése esetén ez változatlan, beleértve a munkavégző által végrehajtott futtatásokat: a sikertelen csomópont visszautazik az eredménnyel, és a hibakezelő workflow ezután elosztásra kerül, mint bármely más futtatás, így egy benne lévő csomópont, amelynek a fő példányon kell futnia, továbbra is ott fut. Két eset szándékosan kimarad, mert a workflow saját eredménye még nem ismert: egy olyan futtatás, amelyet egyetlen példány sem hajtott végre, és egy várakozás, amely időtúllépés miatt leállt, miközben a futtatás még folytatódhat. Szintén **nem** indítja el a kézi vászon teszt futtatásokat.
### Workflow Időtúllépés

Minden workflow beállíthat egy **workflow időtúllépést** másodpercben a workflow szintű **Properties** panelen. A `0` (alapértelmezett) letiltja ezt. Ha be van állítva, egy olyan futtatás, amely túllépi a korlátot, a következő csomópont határánál leáll, és "timed out" hibával megjelölt sikertelen futtatásként rögzítődik. Az időtúllépés vonatkozik a manuális, API-val és triggerrel indított futtatásokra is. A hosszú [Wait](../nodes/wait-node.md) csomópontok azonnal megszakadnak, nem pedig a teljes időtartamukra blokkolják a folyamatot.

### Konkurencialimit

Minden workflow korlátozhatja az egyszerre végrehajtható éles futások számát a workflow szintű **Properties** panelen található **Konkurencialimit** beállítással; a tulajdonos és a szerkesztési hozzáféréssel rendelkező közreműködők módosíthatják, és alapértelmezés szerint ki van kapcsolva. A limit elérésekor a [webhook](./webhooks.md#concurrency-limit-and-queued-runs) és a [streaming](./sse-streaming.md) endpointokról, a [Portalról](./portal.md), a [Quick Drawerről](./quick-drawer.md), az [MCP-ről](../tabs/mcp-tab.md) és az egyes [triggerekről](./triggers.md) érkező új futások egy FIFO (elsőként be, elsőként ki) sorban várakoznak, amelyet a [klaszter](./cluster.md) összes példányára kiterjedően számolnak. A szerkesztő tesztfutásai, az al-workflow hívások, az [Evals](../tabs/evals-tab.md) és a felülvizsgálati folytatások soha nem kerülnek sorba, a [Board](../tabs/board-tab.md) kártyafutások, a fájlfeltöltési futások, az AI asszisztens run-workflow eszköze által indított futások és a riasztási értesítési workflow-k pedig slotra várakozás nélkül indulnak el. A várakozásra kényszerülő webhook hívás azonnal `202 Accepted` választ kap egy `execution_id`-val, egy ugyanazokkal a hitelesítő adatokkal válaszoló állapot-URL-lel, a pozíciójával, a sor méretével és a futó példányok számával; az MCP kliens ugyanezt kapja, és lekérdezi a `heym_execution_status` eszközt. Az opcionális **Maximális sorméret** a további hívásokat `429` hibával elutasítja, az opcionális **Maximális várakozás** pedig `expired` állapotúként rögzíti a túl sokáig várakozó futást. A várakozó futások megjelennek a [Futtatási előzményekben](./execution-history.md) **Sorban n/m** jelöléssel, és ott megszakíthatók.

### Megtakarított idő

Minden workflow rögzíthet egy **becsült megtakarított időt futtatásonként** (percben), amelyet a workflow szintű **Properties** panelen állíthat be. Az [Analytics](../tabs/analytics-tab.md) lap ezt összesíti a kiválasztott időtartományban, és megjeleníti a **Time Saved** statisztikát (minden workflow becslésének összege × sikeres futtatásai). A "Leggyakrabban használt" lista is megjeleníti ezt az összeget workflow-onként; a **Not Set** megnyitja a becslés mezőt, ha az nincs beállítva. A [Workflow Analysis](./workflow-analysis.md) jelentés javasolja a becslés beállítását, ha nincs konfigurálva.

### [Beállítások](./user-settings.md)

A Beállítások párbeszédpanel (a fejlécben található avatarjára kattintva nyitható meg) négy lapot tartalmaz: Profil (Gravatar kép, megjelenítendő név, Felhasználói Szabályok), [Biztonság](./security.md) (jelszó módosítása), Hang ([ElevenLabs TTS/STT](./chat-voice.md)), és Megfigyelhetőség (csak olvasható [OpenTelemetry](./opentelemetry.md) állapot). A Felhasználói Szabályok egyéni utasítások, amelyek minden AI kérésbe bekerülnek, beleértve a workflow szerkesztőt és a [Chat](../tabs/chat-tab.md) lapot, így egyszer beállíthatja a nyelvet, hangnemet, kódolási stílust vagy workflow konvenciókat. A jelszóházirend és az [MCP](../tabs/mcp-tab.md) API kulcs kezelése is elérhető.

Lásd még: [Biztonság](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md), és [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

A Heym OpenTelemetry nyomkövetést képes kibocsátani minden workflow futtatáshoz és csomópont végrehajtáshoz: egy gyökér `heym.workflow.execute` span futtatásonként, és egy gyermek `heym.node.execute` span csomópontonként, modell- és tokenhasználattal az LLM és agent csomópontokhoz csatolva. A span-ok OTLP/HTTP-n keresztül exportálódnak bármely kompatibilis backendbe (Jaeger, Grafana Tempo, Honeycomb, Datadog), és a W3C nyomkövetési kontextus propagálódik a bejövő webhookokon, kimenő HTTP-n és al-workflow-kon keresztül. A nyomkövetés alapértelmezés szerint ki van kapcsolva, és a `HEYM_OTEL_*` [környezeti változókkal](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) konfigurálható; az aktív állapot a [Beállítások](./user-settings.md) Megfigyelhetőség lapján látható.

Lásd még: [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md), és [Webhooks](./webhooks.md).

### [Letöltés és Importálás](./download-import.md)

Exportálja az aktuális workflow-t JSON formátumban a Szerkesztő eszköztárból (Letöltés gomb); a fájl tartalmazza a csomópontokat és éleket. Importálás úgy történik, hogy egy JSON fájlt húz a [Workflows](../tabs/workflows-tab.md) lapra (új workflow-t hoz létre) vagy a vászonra (lecseréli vagy egyesíti). A JSON-nak tartalmaznia kell egy nodes tömböt; a név és élek opcionálisak. Használható biztonsági mentésre, megosztásra vagy példányok közötti migrálásra.

Lásd még: [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md), és [Canvas Features](./canvas-features.md).

### [Portál](./portal.md)

A Portál nyilvános chat felületeken teszi elérhetővé a workflow-kat a `/chat/{slug}` útvonalon. Konfigurálható a portal_enabled, slug, opcionális hitelesítés (portál felhasználók), streaming és fájlfeltöltés workflow-onként. A végfelhasználók chat felületen keresztül kommunikálhatnak a Heym-be való bejelentkezés nélkül; a képkimenetek megjeleníthetők a chatben. A portál workflow-k átadhatják a folyamatot [Human-in-the-Loop](./human-in-the-loop.md) felülvizsgálati oldalaknak, ha egy [Agent Node](../nodes/agent-node.md) jóváhagyást igényel, miközben az agent `review` ága értesítéseket küld más csatornákra. Használható belső eszközökhöz, ügyfélfelé irányuló chatbotokhoz és AI-alapú űrlapokhoz.

Lásd még: [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md), és [Drive](./drive.md).

### [Fájlgenerálás](./file-generation.md)

A készségek képesek fájlokat generálni, például PDF, DOCX, CSV, JSON és képeket a végrehajtás során az `_OUTPUT_DIR` munkaterületre írással. A Heym automatikusan rögzíti ezeket a fájlokat, tárolja őket, és letöltési metaadatokat tesz elérhetővé a `_generated_files` alatt, amelyeket ezután kezelhet a [Drive node](../nodes/drive-node.md) vagy megtekinthet a [Drive](../tabs/drive-tab.md) lapon.

Lásd még: [Agent Node](../nodes/agent-node.md), [Drive](./drive.md), és [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

A Drive a megosztott tárhely és megosztási réteg a készségek által generált fájlokhoz. Lehetővé teszi a fájlok böngészését, nyilvános vagy jelszóval védett linkek létrehozását, lejárati idő és letöltési korlátok beállítását, fájlok olvasható megosztását csapataival, valamint ezeknek a fájloknak a programozott kezelését a [Drive node](../nodes/drive-node.md) segítségével vagy manuálisan a [Drive](../tabs/drive-tab.md) lapról.

Lásd még: [Drive](../tabs/drive-tab.md), [Fájlgenerálás](./file-generation.md), és [Portál](./portal.md).
### [Biztonság](./security.md)

A Heym kényszerített jelszóházirendet alkalmaz (hossz, nagybetű, kisbetű, szám), a hozzáférési tokeneket HttpOnly sütikben tárolja, és a frissítő tokeneket használatkor rotálja. A bejelentkezésre, regisztrációra és a [Portál](./portal.md) bejelentkezésre sebességkorlátozás vonatkozik. A [Hitelesítési adatok](./credentials.md) titkosítva tárolódnak AES-256 (Fernet) algoritmussal. Az [MCP](../tabs/mcp-tab.md) API kulcsot használja az ügyfél hitelesítéséhez; a tartalom biztonsága biztosítható a [Guardrails](./guardrails.md) segítségével az [LLM](../nodes/llm-node.md) és [Agent csomópont](../nodes/agent-node.md) csomópontokon. Az [Execution Tokens](./execution-tokens.md) workflow-hatókörű JWT-ket biztosítanak külső hívók számára.

Lásd még: [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portál](./portal.md) és [Hitelesítési adatok](./credentials.md).

### [Egyszeri bejelentkezés (SSO)](./sso.md)

A Heym bármely külső OpenID Connect szolgáltatóval hitelesíthet felhasználókat - Keycloak, Okta, Entra ID, Auth0, Google - amelyek a **Beállítások → SSO** menüpont alatt konfigurálhatók a `HEYM_ADMIN_EMAILS` listán szereplő példányadminisztrátor által. Csak egy kiállító URL-t és ügyfél hitelesítési adatokat kell megadni; minden végpont a szolgáltató felderítési dokumentumából származik, így egyetlen szolgáltató sincs keményen kódolva. A bejelentkezés Authorization Code with PKCE-t használ, és az ID tokent a szolgáltató közzétett kulcsai ellen ellenőrzi. A fiókok `(kiállító, tárgy)` alapján képeződnek le, másodsorban ellenőrzött e-mail cím alapján, opcionális automatikus kiépítéssel, amely korlátozható egy e-mail domain engedélyezési listára. A jelszavas bejelentkezés továbbra is elérhető marad az SSO mellett, és kikapcsolható, ha a szolgáltató kapcsolati tesztje sikeres, a `HEYM_ADMIN_EMAILS` fiókok kivételével, így egy hibásan konfigurált szolgáltató nem zárhatja ki a példányt.

Lásd még: [Beállítások](./user-settings.md), [Biztonság](./security.md) és [Naplózás](./audit.md).

### [Terheléselosztás](./cluster.md)

Ha egy második Heym példányt ugyanarra az adatbázisra irányít, az munkavégzőként csatlakozik. A háttérben futó műveletek - cron, webhookok, MCP eszközhívások, chat trigger-ek - a példányadminisztrátor által a **Beállítások → Példányok** alatt beállított százalék alapján oszlanak meg a példányok között, minden példány állapotával, adatbázis késésével és verziójával egy táblázatban. A példányok soha nem kommunikálnak egymással: a Postgres viszi a terhet, így a munkavégzőnek nincs szüksége nyitott portra vagy visszairányú útvonalra a főpéldányhoz. A helyi fájlokat, egy kódoló-ügynök munkaterületet vagy telepített plugin-t érintő munka mindig a főpéldányon fut, és a panel jelzi, hogy az elmúlt 24 órában mennyi volt ez, így egy operátor láthatja, mikor nem segíthet a százalékos beállítás. A történetben minden futtatás megnevezi azt a példányt, amely végrehajtotta, és mindkét történet párbeszédpanel szűrheti ezt.

Lásd még: [Beállítások](./user-settings.md), [Nyomvonalak](../tabs/traces-tab.md) és [Elemzések](../tabs/analytics-tab.md).

### [Harmadik féltől származó integrációk](./integrations.md)

A Heym külső szolgáltatásokhoz kapcsolódik a [Hitelesítési adatok](../tabs/credentials-tab.md) lapon tárolt hitelesítési adatok segítségével (titkosítva tárolva). A támogatott típusok közé tartozik az OpenAI, Google, Döntési modell a [Döntési csomópont](../nodes/decision-node.md) számára, Modell útválasztó automatikus modellválasztáshoz (lásd alább), GitHub a [GitHub csomópont](../nodes/github-node.md) és MCP integrációk számára, Jira a [Jira csomópont](../nodes/jira-node.md) számára, Notion a [Notion csomópont](../nodes/notion-node.md) számára, Egyéni LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP az [E-mail küldése](../nodes/send-email-node.md) számára, [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header és FlareSolverr a [Crawler](../nodes/crawler-node.md) számára. Minden típus dokumentálja a szükséges mezőket; a hitelesítési adatok megoszthatók felhasználókkal vagy [csapatokkal](./teams.md), és név szerint hivatkozhatók csomópontokban vagy `$credentials.Name` kifejezésekben.

### Modell útválasztó (Auto Model)

Egy **Modell útválasztó** hitelesítési adat kérésenként választ modellt, ahelyett hogy egy kulcsot tárolna. Egy döntési modell hitelesítési adatot tárol, plusz a meglévő OpenAI/Google/Egyéni hitelesítési adatok listáját, mindegyikhez feltételekkel, amelyek meghatározzák, mikor használják, és minden modellválasztóban megjelenik egyetlen **Auto** nevű modellel.

A nyomvonalak, a vászon Végrehajtási napló és a Span nézet mindkét részét mutatják a választásnak, például `Auto Model / GPT-5`, miközben a költség továbbra is a futó modellhez van rendelve. Az Auto Model nem kombinálható a Válaszok API-val, Kötegelt móddal vagy képkimenettel. Lásd a [Hitelesítési adatok](./credentials.md) teljes viselkedését.

Lásd még: [Hitelesítési adatok](./credentials.md), [Hitelesítési adatok megosztása](./credentials-sharing.md) és [Csapatok](./teams.md).

### [Guardrails](./guardrails.md)

A Guardrails blokkolják a nem biztonságos vagy nemkívánatos felhasználói üzeneteket, mielőtt azok elérnék egy [LLM](../nodes/llm-node.md) vagy [Agent csomópont](../nodes/agent-node.md) csomópontot. Engedélyezhetők csomópontonként, és kiválaszthatók a blokkolandó kategóriák (pl. erőszak, gyűlöletbeszéd, szexuális tartalom, önkárosítás, zaklatás, illegális tevékenység). Beállítható az érzékenység (alacsony, közepes, magas). Ha aktiválódik, a csomópont hibát dob, amelyet elkaphat egy [Hibakezelő](../nodes/error-handler-node.md) csomópont. Az észlelés a szolgáltató moderációs API-ját vagy LLM osztályozást használ a hitelesítési adatok típusától függően.

Lásd még: [Biztonság](./security.md), [LLM](../nodes/llm-node.md), [Agent csomópont](../nodes/agent-node.md) és [Hibakezelő](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Az Enterprise csomag kereskedelmi licencelést, professzionális támogatást és üzembehelyezési szolgáltatásokat kínál azoknak a csapatoknak, amelyek a Heym-et éles környezetben használják. Tartalmazza a workflow-architektúrával kapcsolatos segítséget, bevezetést, Kubernetes és skálázási útmutatást, prioritásos támogatást, valamint egyéni fejlesztéseket olyan fejlett funkciók körében, mint az [Agent Node](../nodes/agent-node.md), a [Human-in-the-Loop](./human-in-the-loop.md), a [Parallel Execution](./parallel-execution.md) és a [Portal](./portal.md).

Lásd még: [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) és [Teams](./teams.md).

### [Heym Work](./heym-work.md)

A Heym Work egy második, üzleti csapatoknak szánt felület a Heym felett. A felhasználók leírnak egy feladatot, válaszolnak néhány kérdésre, és kapnak egy letesztelt workflow-t, majd oldalakból, jóváhagyásokból és egy Tevékenység listából dolgoznak, ahol minden futtatásnak neve van. A példány adminisztrátorai a **Beállítások → Heym Work** menüpontban csatlakoztatják a címével és egy integrációs kulccsal; saját licenccel rendelkezik a Heym csapattól.

Lásd még: [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) és [Human-in-the-Loop](./human-in-the-loop.md).

---

## Vezérlőpult lapok

### [Workflows](../tabs/workflows-tab.md)

A Workflows lap a vezérlőpult alapértelmezett nézete. Két paneles listázást jelenít meg: a bal oldalon a workflow-k és mappák sűrű sorokban, a jobb oldalon pedig a kiválasztott workflow előnézete látható az triggerrel, utolsó futtatással és lépésekkel, valamint az Open Workflow és Run Now gombokkal. Minden sor tartalmaz egy állapotjelző címkét (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), amelyet a Status legördülő menüvel szűrhet. Egy trigger csomópont nélküli workflow-t a legutóbbi futtatás módja szerint címkéznek - API egy HTTP hívás esetén, SubWorker egy szülő workflow esetén, Portal a nyilvános chat esetén -, és Manual marad, amíg nem fut le. A mappák és almappák a [workflow-szervezést](./workflow-organization.md) kezelik. Új workflow-kat a New Workflow gombbal hozhat létre, JSON fájlok húzásával és elhelyezésével [importálhat](./download-import.md), valamint szerkeszthet vagy törölhet a sor műveletek segítségével. A workflow-kat mappák között mozgathatja; a törlés előzetesen ütemezett (kuka), mielőtt véglegesen eltávolításra kerülne.

Lásd még: [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) és [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Workflows bemutató megtekintése</a></p>

### [Board](../tabs/board-tab.md)

Egy ügynök-alapú kanban tábla, ahol a kártyák állandó feladatokat jelképeznek. Minden oszlopot egy rendezett workflow-lánccal konfigurálhat; egy kártya oszlopba helyezése elindítja a láncot a kártya teljes környezetével (tartalom, megjegyzések, előzmények, korábbi kimenetek). Az eredmények visszaíródnak a kártyára - zöld a siker, piros a hiba, borostyánszínű a futás közben. A következő körök az aktuális oszlop láncát újrafuttatják mindaddig összegyűjtött adatokkal, ami lehetővé teszi az iteratív tervezést. A futtatások rögzítésre kerülnek az [Execution History](./execution-history.md)-ban a `board` trigger forrással. Amíg egy kártyafuttatás aktív, az **Open live** gomb megnyitja azt a pontos futtatást az animált vásznon, a növekményes Debug naplókkal együtt.

Lásd még: [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) és [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Board bemutató megtekintése</a></p>
-->

### [Templates](../tabs/templates-tab.md)

A Templates lap lehetővé teszi workflow-sablonok (teljes workflow-k) és csomópont-sablonok (egyetlen konfigurált csomópont) mentését és újrafelhasználását. Workflow-sablonokat a szerkesztőből hozhat létre (Share as Template), csomópont-sablonokat pedig egy csomópontra jobb kattintással. Böngésszen láthatóság szerint (Everyone vagy Specific users/[teams](./teams.md)), alkalmazzon egy sablont új workflow létrehozásához vagy csomópont hozzáadásához a vász
### [Chat](../tabs/chat-tab.md)

A Chat fül a Heym hosszantartó ügynökfelülete, ahol a munkaterületet beszélgetésen keresztül kezelheti. Válasszon ki egy [hitelesítési adatot](./credentials.md) és modellt, majd kérje a Chatet, hogy válaszoljon kérdésekre, vizsgálja meg a workflow-definíciókat, futtasson meglévő workflow-kat, összefoglalja a futtatásokat és ütemezéseket, jelentést készítsen egyetlen workflow futtatási előzményeiről (futtatások száma, állapot szerinti bontás, utolsó futtatás, valamint egy kért futtatás részletei), jelentést adjon az éppen futó futtatásokról (eltelt idővel, aktuális csomóponttal és egy hivatkozással minden élő futtatáshoz), oldja fel a függőben lévő emberi ellenőrzéseket, hozzon létre és módosítson workflow-kat az editorban használt AI Builder motorral, vagy adjon hozzá kártyákat kanban táblákhoz természetes nyelven. Az új kártyák mindig a kiválasztott tábla első oszlopában kezdődnek; ha több tábla áll rendelkezésre és egyik sem lett megnevezve, a Chat táblaválasztást kínál a kártya létrehozása előtt.

A Chat a háttérben tovább fut a böngésző bezárása után. Míg egy válasz streamelődik, további üzeneteket küldhet; a Heym egy adatbázisban tárolt várólistába helyezi el ezeket, lehetővé teszi a várólistán lévő üzenetek szerkesztését vagy törlését, mielőtt azok elkezdenék, és sorrendben futtatja őket, amikor az aktuális válasz befejeződik. Ha az asszisztensnek tervezési részletekre van szüksége és további kérdéseket küld vissza, a várólista szünetel, amíg meg nem válaszol ezekre a kérdésekre, majd folytatódik a tervezési válasz után.

A válaszok markdown formátumban streamelődnek, inline képekkel, workflow előnézeti kártyákkal, összecsukható eszközhívási kártyákkal, kontextusfelhasználással és automatikus kontextuskompresszióval. A Chat támogatja a mellékleteket, hangbemenetet, felolvasó lejátszást, másolási műveleteket, gyors promptokat, [Beállítások](./user-settings.md) alatti Felhasználói Szabályokat és [globális változókat](./global-variables.md) kontextusként.

Lásd még: [AI Assistant](./ai-assistant.md), [Hitelesítési adatok](./credentials.md) és [Beállítások](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Chat bemutató megtekintése</a></p>

### [Hitelesítési adatok](../tabs/credentials-tab.md)

A Hitelesítési adatok fül kezeli a csomópontok által használt API-kulcsokat és titkos adatokat. Adjon hozzá hitelesítési adatokat típus szerint (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere stb.), nevezze el őket, és hivatkozzon rájuk a workflow csomópontokban. Szerkessze vagy törölje a kártyáról; ossza meg felhasználókkal e-mailben vagy [csapatokkal](./teams.md). Minden érték titkosítva van tárolva és elrejtve a felületen.

Lásd még: [Hitelesítési adatok](./credentials.md), [Hitelesítési adatok megosztása](./credentials-sharing.md) és [Harmadik féltől származó integrációk](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Hitelesítési adatok bemutató megtekintése</a></p>

### [Vektortárolók](../tabs/vectorstores-tab.md)

A Vektortárolók fül kezeli a [RAG](../nodes/rag-node.md) csomópontok által használt vektortárolókat. Hozzon létre egy tárolót egy névvel és egy vektortároló [hitelesítési adattal](./credentials.md) — *RAG: Qdrant + OpenAI* (külső Qdrant) vagy *RAG: Psql + OpenAI* (Heym saját Postgres pgvector-en keresztül), ami rögzíti a tároló háttérrendszerét — opcionálisan állítson be egy gyűjteménynevet, majd töltse fel a dokumentumokat (PDF, TXT stb.). Kezelje a tartalmat (források megtekintése, törlése), szerkessze a tároló részleteit, és ossza meg a tárolókat felhasználókkal. Egy [RAG](../nodes/rag-node.md) csomópontban válassza ki az Adatbázist, jelölje ki a vektortárolót, és futtasson beszúrás, frissítés, törlés vagy keresési műveleteket.

Lásd még: [Qdrant RAG](../nodes/rag-node.md), [Hitelesítési adatok](./credentials.md) és [Csapatok](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Vektortárolók bemutató megtekintése</a></p>
### [MCP](../tabs/mcp-tab.md)

Az MCP lap a Model Context Protocol integráció konfigurálását teszi lehetővé. A Heym két módot támogat:

**Alapértelmezett szerver** – Egyetlen végpont (`/api/mcp/sse`) teszi elérhetővé az összes MCP-kompatibilis workflow-t. Megtekintheti és újragenerálhatja az API kulcsát, másolhatja a készen lévő ügyfél JSON-t, egy kattintással csatlakoztathatja a Cursor-t, vagy követheti a Claude beállítási folyamatát az automatikus OAuth regisztrációval.

**Elnevezett szerverek** – Több elkülönített MCP végpontot hozhat létre, mindegyik saját UUID-alapú URL-lel (`/api/mcp/servers/{uuid}/sse`) és független API kulccsal. Meghatározott workflow-kat rendelhet hozzá minden szerverhez, így a különböző AI ügyfelek vagy csapatok csak a számukra szükséges eszközöket látják. Minden elnevezett szerver ugyanazokat a hitelesítési módszereket támogatja (API kulcs, Claude OAuth), és rendelkezik saját JSON másolási és Cursor-ba való hozzáadási lehetőségekkel. Mindkét végpont támogatja az SSE átvitelt (GET) és a Streamable HTTP átvitelt (POST). Egy workflow elnevezett szerveren belüli be- vagy kikapcsolása a hozzárendelt lista tetejére helyezi át, így a módosított sor mindig látható marad.

**Heym chat eszköz** – Bármelyik mód elérhetővé teheti a [Chat](../tabs/chat-tab.md) motort egyetlen `heym_chat` eszközként, amelyet felületenként lehet bekapcsolni, saját LLM hitelesítő adatokkal és modellel (előre kitöltve a [Beállítások](./user-settings.md) alapján preferált modellből). Egy MCP ügyfél egy természetes nyelvű `message`-t küld, és a motor elvégzi a többit: workflow-k építése build módban (mentés, legfeljebb ötszöri tesztfuttatás, javítás és ellenőrzés), workflow-k futtatása, analitika, végrehajtások, élő futtatási állapot, ütemezések, táblák és kártyák, csapatok, globális változók, dokumentáció keresés és emberi döntések. A később a Chat-hez hozzáadott képességek ugyanazon az eszközön keresztül érhetők el extra regisztráció nélkül. Minden hívás a Chat lap előzményeiben kerül elmentésre, mint egy csatlakozással jelölt beszélgetés, és visszaad egy `conversation_id`-t, amit az ügyfél visszaküldhet a szál folytatásához.

Lásd még: [Agent Architektúra](./agent-architecture.md), [Agent csomópont](../nodes/agent-node.md) és [SSE Streamelés](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ MCP bemutató megtekintése</a></p>

### [Futtatások](../tabs/traces-tab.md)

A Futtatások lap az [LLM](../nodes/llm-node.md) végrehajtási nyomvonalakat jeleníti meg. A lista feletti statisztikai fejléc összefoglalja a kiválasztott időtartományt KPI kártyákkal (Hívások, Tokenek, Költség, Átlagos késleltetés, Hiba %), valamint három diagrammal – Tokenek modellenként, Költség modellenként és Időbeli hívások (sikeres vs hibás veremezve). Egyetlen **Időtartomány** választó (1 óra / 24 óra / 7 nap / 30 nap / Összes; alapértelmezett 7 nap) szűri egyszerre a diagramokat és a listát. A költség a felhasználónkénti [LLM Költségtábla](../tabs/datatable-tab.md#llm-cost-table-system-table) alapján kerül kiszámításra; a díjszabás nélküli modellek figyelmeztetésként jelennek meg, amely erre a táblára mutató hivatkozással rendelkezik. Bármely nyomvonal megnyitásával megtekintheti a kérés és válasz adattartalmakat, időzítési bontást (llm_ms, tools_ms, mcp_list_ms), eszközhívásokat (név, argumentumok, eredmény) és a benne foglalt képességeket. A kibontott események JSON-ként jelennek meg – beleértve az MCP és JSON-RPC adattartalmakat – összecsukható fa struktúrában, alapértelmezés szerint az első szinttel nyitva; a **Fa / Nyers** váltó visszavált az eredeti szövegre, és a hibás JSON is olvasható marad. A nyomvonalak segítségével hibakeresheti az [Agent csomópont](../nodes/agent-node.md) és [LLM](../nodes/llm-node.md) viselkedését, valamint másolhatja vagy exportálhatja az adattartalmakat.

Lásd még: [Végrehajtási előzmények](./execution-history.md), [Agent csomópont](../nodes/agent-node.md) és [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Futtatások bemutató megtekintése</a></p>
### [Riasztások](../tabs/alerts-tab.md)

A Riasztások lapon küszöbértékeket határozhat meg egy időablakon belül, amelyek túllépése esetén értesítést kap. Négy riasztástípus fedi le az operátorok által gyakran feltett kérdéseket: **hibaküszöb** (több mint N-szer hibázott-e az időablakban), **workflow futási idő** (lassultak-e a futtatások, maximum, átlag vagy p95 érték szerint mérve), **token / USD költség** (túllépte-e a költségkeretet, ugyanazzal az árazási táblázattal számolva, mint a [Nyomkövetések](../tabs/traces-tab.md)), és **futtatások száma** (többször futott-e, mint kellett volna). Minden típus esetén egy Ön által választott időablakot értékelünk, soha nem egyetlen eseményt, mert egy sikertelen futtatás zaj, míg egy sorozat incidens. A riasztások egyetlen workflow-t vagy az összes elérhető workflow-t figyelhetnek.

Egy ötlépéses varázsló vezeti végig a típus, hatókör, feltétel, válasz és áttekintés lépéseit. Az Áttekintés lépés **visszateszteli** először a feltételt, és jelentést készít arról, hogy az elmúlt 24 órában vagy 7 napban hányszor aktiválódott volna, így egy túl alacsony küszöbérték már mentés előtt kiderül, nem pedig azután, hogy valakit értesített. Írja le, mit szeretne egyszerű nyelven, és az AI kitölti minden olyan lépést, amelyet képes, megjelölve a tippjeit; egy részleges kérés is továbbviszi a varázslót, az első olyan lépésnél nyitva, amelyhez még döntésre van szükség, nem pedig újrakezdésre kényszerít. Alapértelmezés szerint egy riasztás egyszer aktiválódik, és csendben marad, amíg a metrika nem normalizálódik; beállíthatja azonban, hogy egy intervallumonként ismétlődhessen.

A válaszlépésben egy riasztás létrehozhat és hozzárendelhet egy új workflow-t aktiváláskor, használhat egy már meglévőt, vagy nem tesz semmit. Az aktiváló payload tartalmazza a megfigyelt értéket, a küszöböt, az időablakot és azokat a workflow-kat, amelyek hozzájárultak a számhoz – így érik el a riasztások a Slackot, e-mailt vagy Telegramot a már meglévő csomópontok segítségével. Az aktiválási előzmények rögzítik, mi volt igaz minden egyes riasztás aktiválásakor, és 90 napig tárolódnak; egy aktiválás nyugtázása a Folyamatban jelzést Nyugtázottra változtatja anélkül, hogy azt állítaná, a feltétel megszűnt. A [Chat](../tabs/chat-tab.md) lap megválaszolhatja, hogy milyen riasztások léteznek, és miért vagy mikor aktiválódott egy. A riasztások megoszthatók felhasználókkal és [csapatokkal](../tabs/teams-tab.md).

Lásd még: [Analitika](../tabs/analytics-tab.md), [Nyomkövetések](../tabs/traces-tab.md) és [Futtatási előzmények](./execution-history.md).

### [Analitika](../tabs/analytics-tab.md)

Az Analitika lap a futtatási metrikákat és trendeket mutatja. Az összefoglaló statisztikák közé tartozik a teljes futtatások száma, a sikerarány, a hibaráta, a késleltetés lebontása és a teljes **Megtakarított idő** (minden workflow becsült percenkénti megtakarításának összege × sikeres futtatásai). A Legtöbbet használt listázza ugyanezt workflow-onként. Válasszon ki egy alap időtartományt (24 óra, 7 nap, 30 nap vagy összes), opcionálisan szűrhet workflow szerint, majd húzzon bármely diagramon egy dátumtartomány kiválasztásához. A diagramok és workflow táblázatok frissülnek a kiválasztásra, és az automatikus frissítés naprakészen tartja a metrikákat. Kiegészíti a [Futtatási előzményeket](./execution-history.md) és az [Ütemezett](../tabs/scheduled-tab.md) nézetet, ha mind a múltbeli eredményekre, mind a közelgő futtatásokra szüksége van.

Lásd még: [Futtatási előzmények](./execution-history.md), [Ütemezett](../tabs/scheduled-tab.md) és [Értékelések](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Az Analitika bemutató megtekintése</a></p>

### [Irányítópult](../tabs/dashboard-tab.md)

Az Irányítópult lap egy Grafana-stílusú terület, ahol diagramwidgetek rácsait építheti, mindegyiket a saját rejtett Heym workflow-jával renderelve. Tarthat annyi irányítópultot, amennyire szüksége van, és mindegyiket megoszthatja felhasználókkal vagy csapatokkal, csak olvasható vagy szerkeszthető módban; a widgetek mindig a tulajdonos hitelesítési adataival futnak, így mindenki ugyanazokat az adatokat látja. Írja le egy metrikát egyszerű nyelven, és az AI generálja a widgetet, vagy adjon hozzá manuálisan, válasszon diagramtípust, amelyet mintáadatokkal előnézetben láthat: oszlop, vonal, terület, kör, táblázat, numerikus, mérő, szórás, arány, oszlopmérő, szöveg vagy HITL. A HITL az Ön függőben lévő emberi értékeléseinek karusellja. A fejléc a `1/n függőben` szöveget jeleníti meg. A workflow nevére kattintva megnyílik a futtatás a vásznon. A **Jóváhagyás**, **Változtatások kérése** és **Elutasítás** gombokkal zárhatja le, a widget cím melletti előzmények ikon pedig ugyanazon az oldalon nyitja meg a futtatást az előzmények párbeszédablakában. A widgetek gyorsítótárazzák eredményeiket, finomhangolhatók AI-val (minden változtatás mentésre kerül a [Szerkesztési előzményekbe](./edit-history.md)), klónozhatók teljes workflow-jukkal együtt, rendezhetők a Rendezés gombbal, valamint áthelyezhetők és átméretezhetők szerkesztési módban. A táblázatok állapotjelzőket jeleníthetnek meg, és soraikat összekapcsolhatják egy részletező irányítópulttal, amely a kattintott sor rekordját `$page.record` néven olvassa be, a Run widget pedig közvetlenül az irányítópultról futtat egy workflow-t: behúzott fájlon, a bemeneti mezőivel vagy egy Futtatás gombbal. Mivel minden widget egy workflow, bármilyen adat, amelyet lekérhet – egy [HTTP](../nodes/http-node.md) hívás, egy [BigQuery](../nodes/bigquery-node.md) lekérdezés, egy [RAG](../nodes/rag-node.md) keresés vagy [LLM](../nodes/llm-node.md) kimenet – diagrammá válhat. A HITL widget beállításai leszűkíthetik azt egyetlen workflow ellenőrzéseire, vagy egy abban lévő ágens- vagy Slack-jóváhagyási lépésre; egy ilyen widget megjeleníti azokat mindenkinek, aki megnyithatja a workflow-t, és el van rejtve mindenki elől, aki nem.

Lásd még: [Diagramkimenet csomópont](../nodes/chart-output-node.md), [Analitika](../tabs/analytics-tab.md) és [Futtatási előzmények](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Az Irányítópult bemutató megtekintése</a></p>
### [Értékelések](../tabs/evals-tab.md)

Az Értékelések lap (a `/evals` útvonalon) lehetővé teszi értékelési készletek létrehozását, tesztesetek hozzáadását vagy generálását, a készlet promptjának optimalizálását, valamint értékelések futtatását [Agent csomópont](../nodes/agent-node.md) Workflow-kon. Válasszon ki egy vagy több modellt, válassza ki az értékelési módszert (Exact Match, Contains vagy LLM-as-Judge), opcionálisan engedélyezze, hogy egy külön modell vagy egy [Döntési modell](../nodes/decision-node.md) értékelje az LLM-as-Judge válaszokat, állítsa be a tesztenkénti futtatások számát (valamint a hőmérsékletet és a gondolkodási erőfeszítést az Exact Match és Contains esetén), majd hasonlítsa össze a sikeres/sikertelen eredményeket és a modellenkénti kimeneteket. Tekintse át a futtatási előzményeket a korábbi értékelésekhez, beleértve az egyes futtatások által használt bírót, futtassa újra ugyanazzal a bíróval, exportálja JSON formátumban, és ellenőrizze az alapul szolgáló viselkedést a [Nyomkövetések](../tabs/traces-tab.md) lapon.

Lásd még: [Agent csomópont](../nodes/agent-node.md), [Nyomkövetések](../tabs/traces-tab.md) és [Futtatási előzmények](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Értékelések bemutató megtekintése</a></p>

### [Csapatok](../tabs/teams-tab.md)

A Csapatok lap lehetővé teszi csapatok létrehozását és kezelését. Hozzon létre egy csapatot, adjon hozzá tagokat e-mail cím alapján, és távolítson el tagokat (a létrehozó nem távolítható el). Osszon meg [Workflow-kat](../tabs/workflows-tab.md), [Sablonokat](../tabs/templates-tab.md), [Hitelesítési adatokat](../tabs/credentials-tab.md), [Változókat](../tabs/global-variables-tab.md), [Vektortárolókat](../tabs/vectorstores-tab.md) és [Drive fájlokat](../tabs/drive-tab.md) csapatokkal a megfelelő megosztási párbeszédpaneleken keresztül; minden csapattag hozzáférést kap. Szerkessze a csapat nevét és leírását, vagy törölje a csapatot (ez minden csapatmegosztást eltávolít).

Lásd még: [Csapatok](./teams.md), [Hitelesítési adatok megosztása](./credentials-sharing.md) és [Workflow szervezés](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Csapatok bemutató megtekintése</a></p>

### [Ütemezések](../tabs/scheduled-tab.md)

Az Ütemezések lap egy vizuális naptáron mutatja az összes aktív [Cron](../nodes/cron-node.md) Workflow-t. Váltson nap, hét vagy hónap nézet között, hogy lássa, mikor vannak ütemezve az automatizálások futtatásra, majd térjen vissza a kapcsolódó [Workflow-hoz](../tabs/workflows-tab.md), ha szerkeszteni kell az ütemezést.

Lásd még: [Cron](../nodes/cron-node.md), [Analitika](../tabs/analytics-tab.md) és [Futtatási előzmények](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Ütemezések bemutató megtekintése</a></p>

### [Naplók](../tabs/logs-tab.md)

A Naplók lap a Heym stack (backend, frontend, PostgreSQL) Docker konténereinek naplóit jeleníti meg. Válasszon ki konténereket, szűrjön naplószint szerint (Összes, INFO, WARNING, ERROR, DEBUG), és keressen a naplókon belül. Használja hibakereséshez és problémamegoldáshoz. A Workflow-végrehajtási naplókhoz (csomópont eredmények, kimenetek) használja inkább a [Futtatási előzményeket](./execution-history.md), a [Nyomkövetéseket](../tabs/traces-tab.md) vagy a szerkesztő Debug paneljét.

Lásd még: [Futtatási előzmények](./execution-history.md), [Nyomkövetések](../tabs/traces-tab.md) és [Vászon funkciók](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Naplók bemutató megtekintése</a></p>

### [Adattáblák](../tabs/datatable-tab.md)

Az Adattáblák lap lehetővé teszi strukturált adattáblák létrehozását és kezelését a Heym-en belül. Definiáljon típusos oszlopokat (string, number, boolean, date, JSON), kezeljen sorokat beágyazott dupla kattintással szerkeszthető módon, importáljon/exportáljon CSV-t, és osszon meg táblákat felhasználókkal vagy [csapatokkal](./teams.md) olvasási/írási engedélyekkel. Használja a [DataTable csomópontot](../nodes/datatable-node.md) a táblák programozott eléréséhez Workflow-kban. A tetején rögzített **Rendszertáblák** szakasz tartalmazza az **LLM Költségtáblát**: egy fix sémájú nézetet a modellenkénti árakról, amelyet a Helicone szolgáltat a háttérben (24 órás TTL, manuális Frissítés), ahol minden felhasználó felülírhatja az árakat vagy adhat hozzá egyéni sorokat olyan modellekhez, amelyeket a Helicone nem listáz. Ezek az árazási szabályok hajtják a költség KPI-t és a modellenkénti költségdiagramot a [Nyomkövetések](../tabs/traces-tab.md) lapon.

Lásd még: [DataTable csomópont](../nodes/datatable-node.md), [Nyomkövetések](../tabs/traces-tab.md), [Workflow szerkezet](./workflow-structure.md) és [Csapatok](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Adattáblák bemutató megtekintése</a></p>
### [Drive](../tabs/drive-tab.md)

A Drive fül az összes, munkafolyamatokban lévő készségek által generált fájlt megjeleníti. Minden fájlt listáz a nevével, típusával, méretével, forráscsomópontjával, létrehozási dátumával és a csoportmegosztási állapotával, valamint keresési, hitelesített letöltési, megosztási, törlési és lapozási vezérlőket biztosít. Ez az irányítópult kiegészítője a [Fájlgenerálás](./file-generation.md), a [Drive](./drive.md) referenciának és a [Drive csomópontnak](../nodes/drive-node.md).

Lásd még: [Drive](./drive.md), [Fájlgenerálás](./file-generation.md) és [Drive csomópont](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Drive bemutató megtekintése</a></p>

### [Együttműködés a vásznon](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
