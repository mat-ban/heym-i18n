# Karta Spustenia

Karta **Spustenia** zobrazuje spustenia LLM. Skúmajte požiadavky/odpovede payloadov, časovanie, volania nástrojov a ladite správanie uzlov [Agent](../nodes/agent-node.md) a [LLM](../reference/node-types.md), plus agregované metriky (volania, tokeny, náklady, latencia, miera chýb) v ľubovoľnom časovom okne.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Pozrite si ukážku Spustení</a></p>

## Hlavička štatistík

Stránka sa otvára súhrnom štatistík nad zoznamom spustení, vypočítaným v rámci zvoleného časového rozsahu a ďalších aktívnych filtrov:

- **KPI karty** – Celkové volania, Celkové tokeny, Celkové náklady (USD), Priemerná latencia, % chýb
- **Tokeny podľa modelu** – Donut graf objemu tokenov na model
- **Náklady podľa modelu** – Donut graf výdavkov v USD na model. Modely bez cien zobrazujú odkaz „Konfigurovať ceny" na [Tabuľku nákladov LLM](./datatable-tab.md#llm-cost-table-system-table)
- **Volania v čase** – Skladaný plošný graf úspešných vs neúspešných volaní na interval (5 min / 1 h / 6 h / 1 deň, zvolený automaticky podľa rozsahu)
- **Upozornenie na modely bez cien** – Zobrazí sa pod grafmi, keď niektoré spustené modely nemajú riadok s cenami, s odkazom na Tabuľku nákladov LLM

## Časový rozsah

Jediný selektor **Časový rozsah** v hornej časti filtračnej lišty ovláda hlavičku štatistík aj zoznam spustení. Možnosti: Posledná 1 hodina, Posledných 24 hodín, Posledných 7 dní (predvolené), Posledných 30 dní, Celé obdobie. Zmena rozsahu resetuje stránkovanie a znovu načíta grafy aj zoznam spolu.

## Zoznam spustení

- Stránkovaný zoznam nedávnych spustení v rámci zvoleného časového rozsahu
- Každé spustenie zobrazuje: workflow, uzol, prihlasovacie údaje, časovú značku, trvanie
- Kliknutím na spustenie otvoríte detailné zobrazenie
- Použite **Predchádzajúce / Ďalšie** v dialógu s detailmi na pohyb medzi spusteniami bez jeho zatvorenia

## Filtrovanie

- **Časový rozsah** – 1h / 24h / 7d / 30d / Všetko; filtruje grafy a zoznam spolu
- **Prihlasovacie údaje** – Filtrovanie podľa použitých prihlasovacích údajov (API kľúč)
- **Zdroj** – Filtrovanie podľa workflow alebo zdroja spustenia
- **Hľadať** – Hľadanie podľa modelu, workflow, prihlasovacích údajov alebo označenia uzla
- **Obnoviť** – Znovu načíta aktuálnu stránku spustení

## Detaily spustenia

Keď otvoríte spustenie:

- **Kroky** – Časová os zhora nadol, ktorá číta spustenie ako usporiadaný reťazec: Systém → Používateľ → Asistent → Nástroj → Odpoveď. Každý krok je rozbaľovací; rozbalenie zobrazí čitateľný detail (text správy alebo argumenty a výsledok nástroja) nasledovaný JSON daného kroku. JSON obsah v každom type udalosti – vrátane MCP volaní a JSON-RPC payloadov – sa predvolene otvára v rozbaliteľnom strome s rozbalenou prvou úrovňou. Použite **Strom / Raw** na prepnutie medzi formátovanou štruktúrou a pôvodným textom. Poškodený JSON zostáva viditeľný ako čistý text. Kroky nástrojov zobrazujú svoje trvanie a odznak MCP/Skill, kde je to relevantné, plus odznaky pending / timeout / cancelled, keď je nastavený stav volania nástroja. Krok Odpoveď môže zobrazovať agregované odznaky `tool_metrics` (počty volaní podľa stavu a celkové trvanie nástrojov). Keď spustenie zaznamenáva každé volanie modelu, ako to robí správa v Dashboard Chate a smerovaný agent, krok **LLM** sa nachádza pred nástrojmi, ktoré volanie vyžiadalo, a **Rozpis trvania** rozloží každé volanie modelu, nástroj a rozhodnutie o smerovaní na jednu časovú os. Správa v Dashboard Chate je jedno spustenie, bez ohľadu na to, koľko kôl nástrojov si vyžiadalo. Spustenia bez reťazca správ (napríklad generovanie obrázkov) zobrazujú minimálnu časovú os Požiadavka → Odpoveď.
- **Požiadavka** – Úplný payload požiadavky odoslaný LLM, so zobrazeniami JSON **Strom / Raw**
- **Odpoveď** – Odpoveď modelu vrátane volaní nástrojov, ak nejaké sú, so zobrazeniami JSON **Strom / Raw**
- **Metriky nástrojov** – Ak sú prítomné v odpovedi, kompaktný súhrn počtov volaní nástrojov (`success` / `error` / `pending` / `timeout` / `cancelled`) a celkového trvania nástrojov
- **Rozpis časovania** – `llm_ms`, `tools_ms`, `mcp_list_ms` pre analýzu výkonu
- **Volania nástrojov** – Názov nástroja, argumenty, výsledok, stav a uplynutý čas
- **Zahrnuté skilly** – Skilly odovzdané modelu v požiadavke
- **Prejsť na Workflow** – Skočte priamo na súvisiaci workflow z dialógu s detailmi spustenia

## Kopírovanie a export

- Kopírovanie JSON požiadavky alebo odpovede do schránky; kopírovanie vždy používa úplný raw payload bez ohľadu na aktívne zobrazenie
- Použite na ladenie alebo zdieľanie s podporou

## Údržba

- **Vymazať všetko** – Vymaže všetky uložené spustenia po potvrdení
- Ovládacie prvky stránkovania zobrazujú aktuálny viditeľný rozsah (napríklad `1-25 of 240`)

## Súvisiace

- [Prečo Heym](../getting-started/why-heym.md) – LLM observability v rámci životného cyklu agenta
- [Uzol Agent](../nodes/agent-node.md) – Uzol Agent s volaním nástrojov
- [Typy uzlov](../reference/node-types.md) – Uzly LLM a Agent
- [Karta Prihlasovacie údaje](./credentials-tab.md) – Prihlasovacie údaje použité v spusteniach
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Voliteľný OTel export pre spany workflow, uzlov a nástrojov Agenta
- [Karta Dátová tabuľka](./datatable-tab.md) – Hostí Tabuľku nákladov LLM používanú grafom nákladov
- [Kontextová ukážka](../reference/contextual-showcase.md) – Kompaktný sprievodca stránkou pre povrchy dashboardu
