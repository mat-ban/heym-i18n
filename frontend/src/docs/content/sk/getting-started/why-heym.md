# Prečo Heym

Heym je infraštruktúra na spúšťanie a správu AI agentov v produkcii. Jeden self-hosted runtime pokrýva každú fázu životného cyklu agenta.

Prototyp agenta potrebuje model, prompt a niekoľko nástrojov. Produkčný agent navyše potrebuje triggery a opakovania, uložený stav, keď sa pozastaví kvôli človeku, záznam o každom volaní modelu a nástroja, náklady na každé spustenie, testy pred nasadením zmeny a jasné limity toho, čo môže vykonávať samostatne. Heym to všetko drží na jednom mieste, takže systém, ktorý navrhnete na plátne, je systém, ktorý sa spúšťa. Vytvárajte agentické systémy a potom ich spúšťajte s istotou.

## Jeden runtime pre životný cyklus agenta

| Fáza | Čo vám Heym poskytuje |
|---|---|
| **Tvorba** | Zostavujte agentov a deterministické kroky na plátne, generujte ich pomocou [AI Assistant](../reference/ai-assistant.md) alebo začnite zo [šablón](../tabs/templates-tab.md) a prenosných skills. |
| **Orchestrácia** | Koordinujte agentov, [sub-agentov](../reference/agent-architecture.md), kódovacích agentov, RAG, automatizáciu prehliadača a nástroje s explicitným tokom dát a [paralelným vykonávaním](../reference/parallel-execution.md). |
| **Spúšťanie** | Spúšťajte behy z [webhookov](../reference/webhooks.md), plánovačov a event [triggerov](../reference/triggers.md), s opakovaniami na úrovni uzlov, [spracovaním chýb](../nodes/error-handler-node.md) a [distribúciou záťaže](../reference/cluster.md) medzi inštanciami. |
| **Pozorovanie** | Skúmajte každé vykonanie prostredníctvom [histórie](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md), nákladov na beh v USD, živých behov na plátne, [analytiky](../tabs/analytics-tab.md), [upozornení](../tabs/alerts-tab.md) a exportu [OpenTelemetry](../reference/opentelemetry.md). |
| **Vyhodnocovanie** | Testujte prompty a modely voči očakávaným výstupom v [Evals](../tabs/evals-tab.md), s hodnotením LLM-as-Judge a porovnaním modelov vedľa seba. |
| **Kontrola** | Udržujte ľudí v kontrole pomocou [kontrolných bodov na schválenie](../reference/human-in-the-loop.md) a [guardrails](../reference/guardrails.md) a spravujte prístup pomocou šifrovaných [credentials](../reference/credentials.md), [tímov](../reference/teams.md), [single sign-on](../reference/sso.md) a [auditnej stopy](../reference/audit.md). |
| **Sprístupnenie** | Poskytujte workflowy cez REST a [SSE](../reference/sse-streaming.md), ako [MCP](../tabs/mcp-tab.md) nástroje, ako chatovacie rozhrania [Portal](../reference/portal.md) a ako widgety [dashboardu](../tabs/dashboard-tab.md). |

## Tvorba

### AI Assistant: Tvorte workflowy prirodzeným jazykom

[AI Assistant](../reference/ai-assistant.md) je chatovací panel v editore workflowu. Opíšte, čo chcete, napríklad „vytvor workflow, ktorý prijme vstup od používateľa, prehľadá moju znalostnú bázu a odpovie pomocou GPT-4o“, a asistent vygeneruje uzly a hrany, ktoré sa okamžite aplikujú na plátno.

- Používa vaše vlastné LLM credentials (akýkoľvek podporovaný model)
- Podporuje **hlasový vstup** pre návrh workflowu bez použitia rúk
- Automaticky aplikuje platný JSON workflowu z odpovede AI na plátno
- Streamuje odpovede v reálnom čase

Asistent pracuje priamo v editore a streamuje uzly na plátno v reálnom čase a všetko, čo vygeneruje, zostáva upravovateľné rovnako ako uzly, ktoré ste umiestnili ručne.

### Systém skills

Skills sú prenosné balíky schopností, inštrukčný súbor `SKILL.md` plus voliteľné Python skripty, ktoré možno umiestniť na ľubovoľný uzol Agent.

- Inštrukcie skillu sa pridajú na začiatok systémového promptu agenta
- Python súbory v skille sa stanú volateľnými nástrojmi
- Skills sú opakovane použiteľné naprieč workflowmi a zdieľateľné ako `.zip` archívy

Je to analogické tomu, ako keby ste svojmu agentovi odovzdali popis pracovnej pozície a sadu nástrojov v jednom kroku.

### Workflow Analyzer: Spätná väzba s ohľadom na beh

Panel [Workflow Analysis](../reference/workflow-analysis.md) je nástroj na dokumentáciu a spätnú väzbu s ohľadom na beh, zabudovaný do editora. Kliknite na **Analyze**, vyberte LLM credentials a model a Heym vygeneruje upravovateľnú Markdown správu pre aktuálny workflow.

Na rozdiel od statickej poznámky analyzátor najprv spustí workflow, keď je to možné, a do promptu zahrnie výsledok vykonania. Správa pokrýva oblasti na zlepšenie, účel workflowu a vysvetlenie toho, čo jednotlivé uzly robia, krok za krokom. Ak správa už existuje, **Reanalyze** streamuje samostatný náhľad, takže môžete prijať novú verziu alebo si ponechať aktuálny zdieľaný dokument.

## Orchestrácia
### Vstavané uzly LLM a Agent

[Agent Node](../nodes/agent-node.md) od Heym spúšťa tesne integrovanú slučku volania nástrojov s inline Python nástrojmi, MCP pripojeniami a prenosným systémom skills, všetko navrhnuté pre produkčné agentov.

Obyčajný [LLM node](../nodes/llm-node.md) od Heym tiež presahuje jednoduchý krok prompt-response. Pre podporované OpenAI a OpenAI-kompatibilné endpointy sa môže prepnúť do **režimu Batch API**, takže jeden uzol odošle pole promptov v cenovo výhodnejšej natívnej batch požiadavke poskytovateľa. Plátno potom sprístupní vyhradenú vetvu `batchStatus`, ktorá sa spustí, keď batch prechádza stavmi ako `pending`, `processing` a `completed`.

To znamená, že LLM node môže robiť dve veci súčasne:

- Spustiť hlavnú batch požiadavku a vrátiť konečné výstupy pre jednotlivé položky na bežnej vetve
- Spustiť logiku notifikácie alebo logovania pri každej významnej aktualizácii stavu batch bez toho, aby sa tok zmenil na vlastnú polling slučku

Batch spustenie je prvotriedny primitív LLM workflow, s kontrolami schopností poskytovateľa a modelu v UI uzla.

**Agent Node** je jadrom orchestrácie agentov v Heym:

- **Volanie nástrojov** – Agent iteruje cez volania nástrojov v slučke, kým nevytvorí konečnú odpoveď
- **Python nástroje** – Definujte vlastné nástroje inline s plným Pythonom; agent ich volá za behu
- **MCP pripojenia** – Pripojte sa k akémukoľvek [Model Context Protocol](https://modelcontextprotocol.io/) serveru (stdio alebo SSE) a agent automaticky získa všetky jeho nástroje
- **Skills** – Presuňte `.zip` alebo `.md` súbor na agenta, aby ste rozšírili jeho systémový kontext a pridali Python tooling
- **Volania pod-workflow** – Agent môže vyvolávať iné Heym workflow ako nástroje, čím skladá komplexné správanie bez vlastného kódu

Pozrite si [Agent Node](../nodes/agent-node.md) a [Agent Architecture](../reference/agent-architecture.md) pre úplnú referenciu.

### Orchestrácia viacerých agentov

Heym podporuje **vzor orchestrátora** s prvotriednymi vizuálnymi primitívmi:

- Jeden agent vystupuje ako **orchestrátor** (`isOrchestrator: true`) a dostane nástroj `call_sub_agent`
- Deleguje úlohy na pomenovaných **sub-agentov** na tom istom plátne
- Sub-agenti môžu sami volať iných agentov alebo pod-workflow (maximálna hĺbka: 5)
- **Paralelné spustenie**: Keď orchestrátor zavolá viacerých sub-agentov v jednom ťahu, spustia sa paralelne pre rýchlejšie výsledky

To umožňuje architektúry ako plánovací agent, ktorý smeruje prácu na výskumníka, programátora a sumarizátora, všetko vizuálne prepojené bez vlastného orchestračného kódu.

Pozrite si [Agent Architecture](../reference/agent-architecture.md) pre detaily spustenia.

### Kódovací agenti ako uzly workflow

Heym dodáva dva uzly, ktoré spúšťajú skutočného kódovacieho agenta ako krok workflow, nie ako chat completion:

- **[Codex Node](../nodes/codex-node.md)** – Spúšťa OpenAI Codex CLI v izolovanom Heym workspace proti GitHub repozitáru. Podporuje **Sign in with ChatGPT** (PKCE OAuth na vašom Plus/Pro predplatnom, žiadne náklady na API za token) alebo access token, klonuje repo, nechá Codex upravovať kód a vráti `summary`, `diff`, `changedFiles` a koncept `pullRequestUrl`.
- **[OpenCode Go Node](../nodes/opencode-go-node.md)** – Rovnaký workflow repozitára cez poskytovateľsky nezávislú OpenCode bránu (Kimi, DeepSeek, Qwen a ďalšie), spustený v **spevnenom jednorazovom kontajneri**: všetky schopnosti odstránené, root len na čítanie, limity pid/pamäť/CPU. GitHub token zostáva mimo sandboxu: Heym vykonáva každú git a GitHub operáciu na strane hostiteľa, takže generovaný kód nemôže exfiltrovať push prihlasovacie údaje.

To znamená, že workflow môže triageovať chybu z webhook, odovzdať repo kódovaciemu agentovi, počkať na koncept PR a poslať odkaz na Slack, plne automatizovane, s limitmi zdrojov konfigurovateľnými pre každé nasadenie.

### Vstavaný RAG pipeline

Heym obsahuje [RAG / Vector Store Node](../nodes/rag-node.md) a spravovanú kartu [Vectorstores](../tabs/vectorstores-tab.md). Môžete:

- Vybrať si vektorový backend: **Qdrant** (externý server) alebo **Postgres (pgvector)**, ktorý ukladá vektory vo vlastnej databáze Heym bez potreby spúšťať ďalšiu službu
- Vkladať dokumenty do vektorového úložiska priamo z uzla workflow
- Vykonávať sémantické vyhľadávanie a posielať výsledky do LLM alebo Agent uzla
- Odkazovať na výsledky výrazmi ako `$ragNode.results.map("item.payload.content").join("\n\n")`

V Heym je RAG dva uzly s plnou kontrolou nad embeddings a retrieval.

### Automatizácia prehliadača s Playwright

[Playwright node](../nodes/playwright-node.md) je first-party automatizácia prehliadača na plátne.

- **Režim krokov** – Vizuálne skladajte akcie navigate, click, type, fill, screenshot, extract a scroll
- **AI kroky s auto-heal** – Opíšte akciu v prirodzenom jazyku a LLM vygeneruje Playwright akcie; neúspešné selektory môžu byť automaticky opravené a vygenerované kroky môžu byť cachované, aby sa preskočili budúce volania LLM
- **Režim Run Code** – Prepnite uzol na plný Playwright Python pre komplexné toky (predvolene vypnuté; po zapnutí beží v spevnenom sandboxe Heym)
- **Autentifikované relácie** – Obnovte cookies/`storageState` pred spustením, overte prihlásenie kontrolou selektora a v prípade potreby sa vráťte na skriptované prihlasovacie kroky
- **Zachytávanie siete** – Voliteľne zbierajte JSON odpovede, hlavičky, cookies a úložisko prehliadača spolu s výsledkami

Heym zaobchádza s prehliadačom ako s bežným uzlom s rovnakými výrazmi, prihlasovacími údajmi a spracovaním chýb ako so všetkým ostatným.
### Expression DSL

[Expression DSL](../reference/expression-dsl.md) od Heym poskytuje čistú a výkonnú syntax na odkazovanie na dáta z predchádzajúcich uzlov:

- `$input.text` – Dáta vstupného uzla
- `$nodeName.field` – Výstupné pole ľubovoľného predchádzajúceho uzla
- `$global.variableName` – Perzistentné globálne premenné
- Pomocníci pre polia: `.first()`, `.map("field")`, `.join("\n")`

Výrazy fungujú v každom textovom poli vrátane promptov, HTTP hlavičiek, podmienok a nastavovaných hodnôt, takže dáta sa medzi krokmi presúvajú explicitne. DSL vyvažuje výkonnosť a čitateľnosť bez potreby znalosti celého JavaScriptu.

## Spustenie

### Trigger, opakovania a chybové cesty

Workflow môže začínať z mnohých miest. Uzly [Input](../nodes/input-node.md) prijímajú HTTP [webhooky](../reference/webhooks.md), [Cron](../nodes/cron-node.md) sa spúšťa podľa plánu a event [triggers](../reference/triggers.md) spúšťajú behy z Telegramu, Discordu, Slacku, IMAP schránok, WebSocket streamov, RabbitMQ frontov, nahrávaní súborov a udalostí platformy Heym.

Zlyhania sa riešia v rámci grafu. Každý uzol môže pri zlyhaní opakovať pokusy s nastaveným počtom pokusov a čakaním medzi nimi, každý pokus sa zaznamenáva do [histórie vykonávania](../reference/execution-history.md) a uzol [Error Handler](../nodes/error-handler-node.md) sa spustí automaticky, keď uzol zlyhá, takže obnova je súčasťou samotného workflow.

### Paralelné vykonávanie DAG

Vykonávací engine workflow Heym používa plánovač orientovaného acyklického grafu (DAG). Nezávislé uzly sa spúšťajú paralelne automaticky, bez potreby konfigurácie.

- Uzly na rovnakej úrovni závislosti sa odosielajú súbežne do thread poolu (`max_workers=8`)
- Hneď ako sa akýkoľvek uzol dokončí, jeho nadväzujúce uzly sa naplánujú
- Uzol [Merge Node](../nodes/merge-node.md) kombinuje výsledky paralelných vetiev
- Viacero behov workflow sa vykonáva súbežne; každý beh je plne izolovaný

Paralelizmus je predvolené správanie určené štruktúrou grafu.

Pozrite si [Paralelné vykonávanie](../reference/parallel-execution.md).

### Škálovanie naprieč inštanciami

Nasmerujte druhú inštanciu Heym na rovnakú databázu PostgreSQL a pripojí sa ako worker. Behy na pozadí sa zdieľajú medzi inštanciami podľa vami nastavených váh, jeden zvolený leader udržiava plány, vyhodnocovanie alertov a obnovu po páde prostredníctvom failoveru a každý beh zaznamenáva inštanciu, ktorá ho vykonala. Pozrite si [Distribúcia záťaže](../reference/cluster.md).

### Agentický Kanban board

[Karta Board](../tabs/board-tab.md) je vstavaný Kanban board, kde samotné stĺpce vykonávajú workflow. Karta je perzistentná agentická úloha, ktorá nesie kontext, históriu konverzácie, stav vykonávania, výstupy a behy workflow.

- **Reťazce workflow v stĺpcoch** – Presun karty do stĺpca spustí reťazec workflow daného stĺpca; **Agentic Kanban Model** (vaše prihlasovacie údaje + model) mapuje obsah karty na vstupy workflow a premieňa výstupy späť na čitateľný text
- **Prílohy kariet** – Presuňte súbory na kartu; dokumenty sa extrahujú na text a obrázky sa odovzdávajú modelom s podporou videnia pred každým behom
- **Živé plátno behu** – Otvorte aktívny beh v karte a sledujte jeho vykonávanie na skutočnom plátne workflow, uzol po uzle
- **Zdieľanie v tíme** – Zdieľajte boardy s používateľmi alebo tímami s právami na čítanie/zápis; reťazce na zdieľaných boardoch sa spúšťajú s prihlasovacími údajmi vlastníka, takže spolupracovníci nikdy nepotrebujú vlastné
- **Viditeľnosť zlyhaní** – Zlyhané karty zobrazujú indikátor histórie chýb a následné behy sa môžu pozastaviť a čakať na komentáre

Board je natívna súčasť platformy: karty, workflow, prihlasovacie údaje a živé behy sú všetky na jednom mieste.

### Heym Drive: Vstavané úložisko súborov

[Karta Drive](../tabs/drive-tab.md) je úložisko súborov vstavané do platformy. Súbory generované skillmi a workflow (PDF, DOCX, CSV, obrázky) sa tam ukladajú automaticky a prílohy kariet boardu sa tam tiež ukladajú.

- **Odkazy na zdieľanie** – Verejné alebo heslom chránené (Basic Auth) odkazy na stiahnutie s voliteľnou expiráciou a maximálnym počtom stiahnutí
- **Zdieľanie v tíme** – Zdieľajte súbory iba na čítanie so svojimi tímami a odstráňte všetky zdieľania s tímom jednou akciou
- **Hromadné akcie** – Viacnásobný výber s rozsahmi pomocou shift-kliknutia, zabaľte výber do jedného ZIP na stiahnutie alebo aplikujte jedno nastavenie zdieľania/hesla/zmazania na mnoho súborov naraz
- **Prístup agenta** – Skill sa môže prihlásiť na čítanie súborov z Drive, takže agent môže pracovať s dokumentmi, ktoré vytvorili vy alebo iné workflow

Generované artefakty získavajú trvalé, zdieľateľné miesto v rámci platformy.

## Pozorovanie

### LLM Traces

[Karta Traces](../tabs/traces-tab.md) poskytuje úplnú observabilitu pre každé volanie LLM:

- Payloady požiadaviek a odpovedí
- Časovanie jednotlivých volaní: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Názvy volaní nástrojov, argumenty a výsledky
- Skill odovzdané modelu

Systém traces je účelovo navrhnutý na ladenie agentického správania, s úplnými payloadmi požiadaviek a odpovedí a časovaním jednotlivých volaní.
### Sledovanie nákladov na LLM Token

Každé volanie LLM v Heym je automaticky spoplatnené. [Karta Traces](../tabs/traces-tab.md) zobrazuje počty vstupných a výstupných tokenov pre každý trace spolu s nákladmi v USD v reálnom čase, ktoré sa odvodzujú zo synchronizovanej cenovej tabuľky.

- **Náklady na trace** – Vstupné tokeny, výstupné tokeny a celková suma v USD zobrazená v každom riadku trace
- **Analytika nákladov** – KPI karty a graf nákladov podľa modelu sa aktualizujú podľa zvoleného časového rozsahu (1h / 24h / 7d / 30d / All)
- **Tabuľka nákladov na LLM** – Systémová tabuľka v [karte DataTable](../tabs/datatable-tab.md) sa napĺňa z Helicone každých 24 hodín; môžete prepísať ceny alebo pridať vlastné riadky pre modely, ktoré ešte nie sú uvedené
- **Upozornenie na chýbajúcu cenu** – Pri trace pre modely bez cenovej položky sa zobrazí inline upozornenie s priamym odkazom na tabuľku nákladov

Každé spustenie nesie vlastné náklady v USD, rozdelené podľa modelu.

### Otvorenie produkčných behov na živom plátne

Produkčný workflow zostáva kontrolovateľný aj po spustení mimo editora. Otvorte ľubovoľný záznam so stavom **Running** z ktoréhokoľvek dialógu History alebo otvorte aktívny beh v karte Agentic Kanban a Heym pripojí bežný editor workflow k presne tomu spusteniu.

- Uzly, ktoré už dokončili, sa zobrazia okamžite so svojimi výsledkami
- Aktuálny uzol a čakajúce nadväzujúce uzly naďalej pulzujú, ako spustenie postupuje
- Panel Debug prijíma rovnaké prírastkové výsledky uzlov ako beh spustený z plátna
- Konečný výstup a zvýraznenia spustenia prichádzajú bez pollingu alebo spustenia duplicitného behu
- Zatvorenie editora iba odpojí pozorovateľa; nikdy nezruší produkčný workflow

Pozorovateľ používa SSE podporované snapshotom spustenia naprieč workermi, takže funguje pre webhook, schedule, chat, MCP, integration a Board triggery, aj keď beh vlastní iný backendový worker.

### OpenTelemetry, analytika a upozornenia

Heym vysiela [OpenTelemetry](../reference/opentelemetry.md) spany pre každý beh workflow, spustenie uzla a vyvolanie nástroja Agenta, exportované cez OTLP/HTTP do Jaeger, Grafana Tempo, Honeycomb, Datadog alebo akéhokoľvek iného kompatibilného backendu.

Karta [Analytics](../tabs/analytics-tab.md) sleduje počty behov, mieru úspešnosti, trvanie a trendy pre každý workflow. [Alerts](../tabs/alerts-tab.md) sledujú počty chýb, trvanie behu, výdavky na tokeny alebo v USD a objem spustení v časovom okne, potom spustia notify workflow, ktorý zvolíte, takže upozornenie dorazí do Slacku, e-mailu, Telegramu alebo kamkoľvek inam, kam môže dosiahnuť uzol.

## Evaluate

### Vstavané Evals

[Karta Evals](../tabs/evals-tab.md) vám umožňuje definovať testovacie sady a spúšťať ich proti vašim agentovým workflow:

- Vytvorte testovacie prípady so vstupmi a očakávanými výstupmi alebo ich vygenerujte z promptu sady
- Spustite jednu sadu proti viacerým modelom a porovnajte ich výstupy vedľa seba
- Skórujte pomocou Exact Match, Contains alebo LLM-as-Judge s nezávislým judge modelom
- Skontrolujte pass/fail, skutočné vs očakávané a históriu behov

Zmeňte prompt alebo model, znova spustite sadu a porovnajte výsledky predtým, než zmena dosiahne produkciu.

## Control

### Human-in-the-Loop (HITL)

Heym má vstavaný systém [Human-in-the-Loop](../reference/human-in-the-loop.md), ktorý umožňuje agentom pozastaviť spustenie, požiadať o ľudskú kontrolu a pokračovať presne tam, kde skončili.

- **Kontrolné body agenta** – Povoľte `hitlEnabled` na ľubovoľnom uzle Agent, čím mu dáte nástroj `request_human_review`. Agent rozhodne, kedy si rozhodnutie vyžaduje ľudský dohľad, a zavolá nástroj so zhrnutím a konceptom.
- **Verejné URL na kontrolu** – Každá žiadosť o kontrolu vygeneruje bezpečný jednorazový odkaz na `/review/{token}` (TTL 168 hodín). Recenzenti môžu **prijať**, **upraviť a pokračovať** alebo **odmietnuť** bez prihlásenia.
- **Snapshoty spustenia** – Workflow zmrazí svoj úplný stav (história konverzácie, premenné, výsledky nástrojov), takže po odpovedi recenzenta pokračuje presne tam, kde sa pozastavil.
- **Vetva notifikácie** – Voliteľný výstupný handle `review` vám umožňuje zapojiť tok notifikácií (Slack, e-mail, webhook), ktorý sa spustí pri požiadaní o kontrolu.
- **Politiky schvaľovania nástrojov MCP** – Písané pokyny HITL sa interpretujú do rozsahov schvaľovania (`always` / `once` / `never`), takže agent môže automaticky schváliť nízko-rizikové nástroje a eskalovať vysoko-rizikové.
- **Viacero kontrolných bodov** – Jedno spustenie agenta sa môže pozastaviť na kontrolu viackrát; každý kontrolný bod je nezávislý.

Verejné URL na kontrolu, edit-and-continue, vetvenie notifikácií a obnovenie zo snapshotu fungujú všetky z rovnakého kontrolného bodu agenta.

Úplnú referenciu nájdete v [Human-in-the-Loop](../reference/human-in-the-loop.md).

### LLM Guardrails

Heym má vstavané [Guardrails](../reference/guardrails.md) na uzloch [LLM](../nodes/llm-node.md) aj [Agent](../nodes/agent-node.md), takže môžete zablokovať nebezpečný obsah skôr, než odpoveď modelu dosiahne nadväzujúce kroky.

- **Prepínač bezpečnosti na úrovni uzla** – Povoľte guardrails priamo na uzle, ktorý generuje alebo spracúva obsah určený používateľovi
- **Široké pokrytie politík** – Blokujte násilie, nenávistné prejavy, sexuálny obsah, NSFW/vulgárne výrazy, obťažovanie, nezákonnú činnosť, žiadosti o osobné údaje a pokusy o prompt injection
- **Viacjazyčná detekcia** – Aplikujte rovnaké bezpečnostné pravidlá naprieč turečtinou, angličtinou, arabčinou, španielčinou a ďalšími jazykmi
- **Fallback natívny pre workflow** – Keď je správa zablokovaná, uzol vyhodí typovanú chybu workflow, ktorú môžete smerovať cez [Error Handler](../nodes/error-handler-node.md)

Bezpečnostná politika žije priamo v konfigurácii LLM a Agent a zapája sa priamo do vetvenia workflow a spracovania chýb.
### Prístup, prihlasovacie údaje a audit

Agenti konajú s reálnymi prihlasovacími údajmi, preto je prístup súčasťou správy. [Prihlasovacie údaje](../reference/credentials.md) sú šifrované v pokoji, po vytvorení maskované a zdieľateľné s používateľmi alebo [tímami](../reference/teams.md), pričom tímy zdieľajú aj Workflow, premenné, vektorové úložiská a súbory v Drive. [Single sign-on](../reference/sso.md) sa pripája k akémukoľvek poskytovateľovi OpenID Connect, vrátane Okta, Entra ID, Keycloak, Auth0 a Google. [Auditná stopa](../reference/audit.md) zaznamenáva každú bezpečnostne relevantnú akciu s jej aktérom, cieľom a výsledkom, streamovanú spolu s logmi vášho kontajnera do zberača logov alebo SIEM, ktorý už prevádzkujete.

### Self-Hosted, vaše dáta vlastníte vy

Heym beží na vašej infraštruktúre. Workflow, prihlasovacie údaje, história spustení a stopy žijú vo vašej vlastnej databáze a volania modelov smerujú z vašich serverov k poskytovateľovi, ktorého si vyberiete, alebo k modelu, ktorý hostujete sami prostredníctvom Ollama alebo vLLM. Pre agentov, ktorí spracúvajú citlivé dokumenty, zákaznícke dáta alebo proprietárne znalostné bázy, je to často nevyhnutnou požiadavkou.

Heym je licencovaný pod **MIT License s podmienkou Commons Clause**. Zdrojový kód je source-available: môžete ho slobodne používať, upravovať a self-hostovať. Commons Clause obmedzuje predaj softvéru vrátane ponúkania platenej hostingovej alebo konzultačnej/podpornej služby, ktorej hodnota pochádza podstatnou mierou z Heym. Pre komerčné licencovanie, podnikové nasadenia alebo profesionálnu podporu kontaktujte [enterprise@heym.run](mailto:enterprise@heym.run).

## Sprístupnenie

### API a streamovanie

Workflow sú volateľné cez HTTP na `/api/workflows/{workflow_id}/execute`, ktorý vracia JSON, a na `/api/workflows/{workflow_id}/execute/stream`, ktorý streamuje udalosti uzlov ako Server-Sent Events počas priebehu spustenia. Oba zdieľajú autentifikáciu na úrovni Workflow, obmedzovanie rýchlosti a ukladanie odpovedí do vyrovnávacej pamäte. Pozrite si [Webhooky](../reference/webhooks.md) a [SSE Streaming](../reference/sse-streaming.md).

### Integrácia MCP (Model Context Protocol)

Heym má natívnu podporu [MCP](../tabs/mcp-tab.md) na oboch stranách:

- **Ako klient**: Uzly agentov sa pripájajú k externým MCP serverom (Filesystem, Browserbase, vlastné nástroje) cez stdio alebo SSE a automaticky konzumujú ich nástroje
- **Ako server**: Workflow so zapnutým MCP sa stanú nástrojmi na predvolenom serveri na `/api/mcp/sse` alebo na pomenovaných serveroch s vlastnou URL a API kľúčom, takže Claude Desktop, Cursor a ďalší MCP klienti môžu priamo volať vaše Heym Workflow

Agenti môžu konzumovať niekoľko MCP serverov naraz a akýkoľvek Workflow sa môže stať nástrojom pre externého MCP klienta.

### Portál: publikovanie Workflow ako chatovacích rozhraní

Funkcia [Portál](../reference/portal.md) mení akýkoľvek Workflow na verejne prístupné chatovacie rozhranie na `/chat/{slug}`:

- Voliteľná autentifikácia s prihlasovacími údajmi pre jednotlivých používateľov
- Streamované spustenie (priebeh uzlov v reálnom čase)
- Podpora nahrávania súborov
- História viackolovej konverzácie

Tímy dodávajú interné nástroje, chatboty pre zákazníkov a AI formuláre z jedného Workflow a URL bez toho, aby museli písať frontendový kód.

### Dashboardy poháňané Workflow

Karta [Dashboard](../tabs/dashboard-tab.md) je používateľmi vytváraná reportovacia plocha, kde je každý widget grafu poháňaný vlastným skrytým Heym Workflow. Widget môže volať API, dopytovať BigQuery, prehľadávať RAG/vektorové úložiská, spúšťať LLM kroky, transformovať riadky a zakončiť uzlom [Chart Output](../nodes/chart-output-node.md). Widgety môžete vytvárať manuálne, generovať ich pomocou AI, neskôr ich doladiť, ukladať výsledky do vyrovnávacej pamäte a vizuálne preusporiadať mriežku.
## Porovnanie s nástrojmi na automatizáciu Workflow

Mnohé tímy prichádzajú do Heymu z nástrojov na automatizáciu Workflow. Tabuľka nižšie porovnáva Heym s n8n, Zapier a Make.com v oblastiach, ktoré sú dôležité, keď agenti bežia v produkcii, a poznámky pod ňou citujú oficiálnu dokumentáciu, z ktorej porovnanie vychádza. Pre podrobnejší pohľad na jednotlivé nástroje si pozrite porovnávacie stránky na [heym.run/compare](https://heym.run/compare).

| Schopnosť | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Vstavaný uzol LLM | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + vetvy podľa stavu | ✓ | obmedzené¹¹ | –¹¹ | obmedzené¹¹ |
| Vstavaný uzol Agent (volanie nástrojov) | ✓ | ✓ | ✓ | ✓ |
| Orchestrácia viacerých agentov | ✓ | ✓ | obmedzené | obmedzené |
| Uzly kódovacieho agenta (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Vstavaný RAG / vektorové úložisko | ✓ | ✓ | obmedzené¹ | plugin² |
| Čítanie / zápis cez WebSocket | ✓ | obmedzené¹² | –¹³ | –¹⁴ |
| Tvorba Workflow v prirodzenom jazyku | ✓ | obmedzené³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Otvorenie prebiehajúceho behu na živom plátne | ✓ | obmedzené¹⁹ | obmedzené¹⁹ | –¹⁹ |
| Dashboardy poháňané Workflow | ✓ | obmedzené¹⁷ | obmedzené¹⁷ | obmedzené¹⁷ |
| Agentický Kanban board | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Systém Skills pre agentov | ✓ | – | – | – |
| Vstavaný file drive (zdieľané odkazy, tímy) | ✓ | obmedzené²² | obmedzené²² | –²² |
| Uzol na automatizáciu prehliadača (Playwright) | ✓ | obmedzené²³ | obmedzené²³ | –²³ |
| Inšpekcia LLM trace | ✓ | obmedzené⁴ | – | ✓ |
| Export OpenTelemetry tracing | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Sledovanie nákladov na LLM tokeny (USD) | ✓ | –¹⁵ | –¹⁵ | obmedzené¹⁵ |
| Vstavané evals pre AI Workflow | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | obmedzené⁶ | obmedzené⁷ |
| LLM guardrails | ✓ | ✓⁸ | ✓⁸ | obmedzené⁸ |
| Automatická kompresia kontextu | ✓ | – | – | – |
| Paralelné vykonávanie DAG | ✓ | obmedzené⁹ | – | – |
| Možnosť self-hostingu, dostupný zdrojový kód | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL pre dynamické dáta | ✓ | ✓ | obmedzené | ✓ |
> **Poznámky pod čiarou:** ¹ Zapier Knowledge Sources — žiadne vystavené úložisko vektorov ani ovládanie embeddingov. ² Make.com má moduly Pinecone/Qdrant, ale žiadny natívny RAG uzol. ³ n8n AI Workflow Builder je cloud-only beta s limitmi kreditov. ⁴ n8n zobrazuje medzikroky; úplné trasovanie vyžaduje nástroje tretích strán. ⁵ n8n podporuje schvaľovanie volaní AI nástrojov cez chat, e-mail a kolaboračné kanály, ale nesníma a neobnovuje celé vykonávanie tak ako Heym. ⁶ Zapier Human in the Loop podporuje schválenia a zber údajov v rámci Zaps, ale nie je to systém kontrolných bodov s verejným posudzovaním a obnovením zo snímky. ⁷ Make.com ponúka Human in the Loop ako Enterprise aplikáciu so žiadosťami o posúdenie a výsledkami adjusted/approved/canceled, ale zostáva limitovaný plánom a menej agent-native. ⁸ n8n dodáva dedikovaný uzol Guardrails, Zapier dodáva AI Guardrails naprieč svojimi AI produktmi a Make.com dokumentuje pravidlá agentov plus toky posudzovania, ale nie porovnateľnú samostatnú funkciu guardrails, preto je Make označený ako limitovaný. ⁹ n8n vykonáva štandardne sekvenčne; paralelizmus vyžaduje obchádzky cez pod-workflow. ¹⁰ Sustainable Use License — bezplatné self-hostovanie na interné použitie, komerčná redistribúcia obmedzená. ¹¹ K 22. aprílu 2026 oficiálna dokumentácia n8n opisuje HTTP dávkovanie a vzory loop/wait namiesto natívnej vetvy stavu dávky LLM, oficiálna dokumentácia aplikácie ChatGPT od Zapier neuvádza žiadne triggery a iba generickú beta verziu API Request a oficiálna stránka integrácie OpenAI od Make vystavuje dávkové akcie ako create/watch completed, ale nie prvotriedny uzol LLM s vetvením stavu, preto sú n8n/Make označené ako limitované a Zapier ako nedostupný pre tento konkrétny vzor workflow. ¹² Oficiálna dokumentácia n8n pokrýva uzly HTTP Webhook a HTTP Request plus rozšíriteľnosť cez Code/custom/community, ale nepodarilo sa mi nájsť prvotriedny uzol WebSocket trigger/send, preto je n8n označený ako limitovaný. ¹³ Oficiálna dokumentácia Zapier pokrýva prichádzajúce webhooky a odchádzajúce webhook/API požiadavky iba cez HTTP, nie natívne kroky WebSocket trigger alebo send. ¹⁴ Oficiálna dokumentácia Make pokrýva moduly Webhooks a moduly HTTP(S) request, ale nepodarilo sa mi nájsť natívny modul WebSocket trigger alebo send. ¹⁵ n8n nemá natívne sledovanie nákladov na tokeny LLM; existujú komunitné obchádzkové workflow, ale vyžadujú manuálnu inštaláciu a API volania po vykonaní (otvorená žiadosť o funkciu k máju 2026). Zapier nevystavuje používateľom počet tokenov na vykonanie ani náklady v USD; AI kroky spotrebúvajú iba úlohy. Dashboard kreditov Make.com čiastočne odráža spotrebu tokenov pre AI hostované na Make (od augusta 2025), ale pripojenia s API kľúčmi tretích strán sa účtujú ako 1 operácia = 1 kredit bez počítania tokenov; nie je k dispozícii rozpis nákladov v USD na vykonanie podľa modelu. ¹⁶ Heym emituje natívne OpenTelemetry spany (jeden na beh workflow plus jeden na uzol) cez OTLP/HTTP do akéhokoľvek kompatibilného backendu, so šírením W3C trace-context a bez inštrumentačného kódu, konfigurované cez `HEYM_OTEL_*` env premenné a štandardne vypnuté. n8n má zdokumentovanú integráciu OpenTelemetry trasovania pre vykonávanie workflow a uzlov. Zapier a Make.com nedokumentujú export OpenTelemetry svojich vykonávaní workflow/scenárov k júnu 2026. ¹⁷ n8n dokumentuje Insights dashboard pre metriky produkčného vykonávania, Zapier dokumentuje Zap History plus Task Usage a Make.com dokumentuje Scenario History; ide o monitorovacie/historické rozhrania, nie o vlastné widgety dashboardu podložené ľubovoľnou logikou workflow ako Dashboard tab v Heym. ¹⁸ Heym Workflow Analyzer spustí workflow, keď je to možné, prečíta výsledok vykonania a vygeneruje zdieľaný editovateľný Markdown report pokrývajúci oblasti zlepšenia, účel a správanie krok za krokom. n8n dokumentuje AI Workflow Builder na vytváranie/vylaďovanie/ladenie workflow, Zapier dokumentuje AI riešenie problémov pre chybové behy Zap a Make.com dokumentuje históriu scenárov plus kroky uvažovania AI agenta, ale ich verejná dokumentácia neopisuje ten istý zdieľaný dokument analýzy workflow s vedomím behu. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) uvádza bežiace vykonávania a dokáže načítať údaje z predchádzajúceho vykonania do editora, zatiaľ čo [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) vystavuje stav running vo svojom editore. [Make Scenario History](https://help.make.com/scenario-history) dokumentuje detaily behu a logy. Ich verejná dokumentácia, skontrolovaná 18. júla 2026, neopisuje presný tok Heym: otvoriť ľubovoľný prebiehajúci produkčný beh z History alebo z Kanban karty, obnoviť jeho aktuálnu snímku uzla a pokračovať v prijímaní animácie uzlov a Debug logov na tom istom plátne. ²⁰ Uzly [Codex](../nodes/codex-node.md) a [OpenCode Go](../nodes/opencode-go-node.md) v Heym spúšťajú skutočné CLI kódovacieho agenta v izolovanom pracovnom priestore Heym proti GitHub repozitáru — klonovanie, úprava, vytvorenie diffu, push vetvy, otvorenie pull requestu — ako prvotriedny krok workflow. K 20. júlu 2026 žiadny konkurent nedokumentuje ekvivalent: [OpenAI node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) v n8n pokrýva volania chat/assistant API, nie kódovacieho agenta na úrovni repozitára, a natívna podpora Codex zostáva komunitnou požiadavkou; vlastný blog Zapier dokumentuje opačný smer — [Codex poháňa nástroje Zapier cez Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — nie Codex ako krok Zap; moduly OpenAI v Make.com vystavujú completions/assistants/batch akcie, nie kódovacieho agenta, ktorý klonuje repozitáre a otvára PR. ²¹ [Board tab](../tabs/board-tab.md) v Heym je vstavaná agentická Kanban tabuľa, ktorej stĺpce vykonávajú workflow a ktorej karty nesú kontext, históriu konverzácie, stav vykonania a behy. n8n ([Kanban Tool integration](https://n8n.io/integrations/kanban-tool/)), Zapier ([Kanban Tool integrations](https://zapier.com/apps/kanbantool/integrations)) a Make.com ([Kanban Tool integration](https://www.make.com/en/integrations/kanban-tool)) sa iba pripájajú k aplikáciám kanban tretích strán, ako sú Kanban Tool, Wekan alebo NocoDB; žiadny nedokumentuje vstavanú tabuľu, ktorá spúšťa vlastné workflow, k 20. júlu 2026. ²² n8n ukladá binárne údaje vykonávania interne (voliteľne na [S3-kompatibilnom externom úložisku](https://docs.n8n.io/hosting/scaling/external-storage/)), ale nedokumentuje žiadny používateľsky prístupný súborový disk so zdieľanými odkazmi alebo tímovým zdieľaním, preto je označený ako limitovaný. [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) spracúva súbory iba počas behu Zap a [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) uchováva malé textové hodnoty, preto je Zapier označený ako limitovaný. [Dátové úložiská](https://help.make.com/l6du-data-stores) Make.com uchovávajú štruktúrované záznamy a jeho [spracovanie súborov](https://help.make.com/working-with-files) prenáša súbory medzi aplikáciami bez trvalého vstavaného úložiska, preto je Make označený ako nedostupný. ²³ [Playwright node](../nodes/playwright-node.md) v Heym je prvotriedna automatizácia prehliadača s vizuálnym režimom krokov, AI-generovanými krokmi a režimom plného kódu. n8n ponúka iba komunitné balíčky ako [n8n-playwright](https://github.com/toema/n8n-playwright) s dosiaľ otvorenou [žiadosťou o funkciu pre natívne uzly automatizácie prehliadača](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), preto je označený ako limitovaný. Zapier Agents dokážu [prehliadať a čítať stránky cez web browsing a rozšírenie Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), ale Zapier nedokumentuje žiadny skriptovaný krok automatizácie prehliadača, preto je označený ako limitovaný. Make.com dokumentuje HTTP moduly a aplikácie na scraping tretích strán namiesto akéhokoľvek natívneho modulu automatizácie prehliadača, k 20. júlu 2026.
## Súvisiace

- [Úvod](./introduction.md) – Prehľad platformy
- [Rýchly štart](./quick-start.md) – Vytvorte svoj prvý workflow
- [Analýza workflow](../reference/workflow-analysis.md) – Generujte zdieľané reporty o behoch workflow a spätnú väzbu na zlepšenie
- [Karta Dashboard](../tabs/dashboard-tab.md) – Vytvárajte dashboardy podložené workflow s AI-generovanými widgetmi grafov
- [Uzol Agent](../nodes/agent-node.md) – LLM uzol s volaním nástrojov, MCP a skills
- [Architektúra agenta](../reference/agent-architecture.md) – Sub-agenti, orchestrátor a dispatch nástrojov
- [Karta Board](../tabs/board-tab.md) – Agentický Kanban board so stĺpcami spúšťajúcimi workflow
- [Uzol Codex](../nodes/codex-node.md) – Spustite kódovacieho agenta OpenAI Codex proti GitHub repozitáru
- [Uzol OpenCode Go](../nodes/opencode-go-node.md) – Na poskytovateľovi nezávislý kódovací agent v zabezpečenom kontajneri
- [Karta Drive](../tabs/drive-tab.md) – Vstavané úložisko súborov s odkazmi na zdieľanie, tímami a hromadnými akciami
- [Uzol Playwright](../nodes/playwright-node.md) – Automatizácia prehliadača prvej strany s AI krokmi a režimom kódu
- [Uzol RAG / Vector Store](../nodes/rag-node.md) – Vektorové vyhľadávanie a vkladanie dokumentov (Qdrant alebo Postgres pgvector)
- [AI asistent](../reference/ai-assistant.md) – Tvorba workflow v prirodzenom jazyku
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Kontrolné body agenta s verejnými URL na recenziu
- [Guardrails](../reference/guardrails.md) – Zablokujte nebezpečné prompty skôr, než sa dostanú k vašim modelom
- [Karta Traces](../tabs/traces-tab.md) – Pozorovateľnosť volaní LLM
- [Karta Evals](../tabs/evals-tab.md) – Testovacie sady pre AI workflow
- [Karta Alerts](../tabs/alerts-tab.md) – Upozornenia na prahové hodnoty pri chybách, trvaní, nákladoch a objeme behov
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Exportujte spany behov, uzlov a nástrojov cez OTLP
- [Distribúcia záťaže](../reference/cluster.md) – Zdieľajte behy medzi inštanciami s failoverom leadera
- [Single Sign-On](../reference/sso.md) – Prihláste sa cez akéhokoľvek poskytovateľa OpenID Connect
- [Audit Logging](../reference/audit.md) – Bezpečnostne relevantné akcie s aktérom, cieľom a výsledkom
- [Portál](../reference/portal.md) – Publikujte workflow ako verejné chat UI
- [Paralelné vykonávanie](../reference/parallel-execution.md) – Konkurentné vykonávanie založené na DAG
- [Karta MCP](../tabs/mcp-tab.md) – Konfigurácia MCP servera a klienta
