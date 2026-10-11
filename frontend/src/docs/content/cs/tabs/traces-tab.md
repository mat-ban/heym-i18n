# Záložka Traces

Záložka **Traces** zobrazuje průběhy spuštění LLM. Prohlížejte si požadavky a odpovědi (payloady), časování, volání nástrojů a ladění chování uzlů [Agent](../nodes/agent-node.md) a [LLM](../reference/node-types.md), včetně souhrnných metrik (volání, tokeny, náklady, latence, míra chyb) za libovolné časové období.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Přehrát ukázku Traces</a></p>

## Souhrn statistik

Stránka se otevírá souhrnem statistik nad seznamem průběhů, který se počítá za zvolené časové období a další aktivní filtry:

- **Karty KPI** – Celkem volání, Celkem tokenů, Celkové náklady (USD), Průměrná latence, % chyb
- **Tokeny podle modelu** – Prstencový graf objemu tokenů podle modelu
- **Náklady podle modelu** – Prstencový graf výdajů v USD podle modelu. Modely bez cen zobrazují odkaz „Configure pricing" na [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)
- **Volání v čase** – Skládaný plošný graf úspěšných a neúspěšných volání za interval (5 min / 1 h / 6 h / 1 den, zvoleno automaticky podle rozsahu)
- **Upozornění na modely bez cen** – Zobrazí se pod grafy, pokud některé sledované modely nemají řádek s cenou, s odkazem na LLM Cost Table

## Časové období

Jediný přepínač **Time range** v horní části panelu filtrů řídí jak souhrn statistik, tak seznam průběhů. Možnosti: Poslední 1 hodina, Posledních 24 hodin, Posledních 7 dní (výchozí), Posledních 30 dní, Celé období. Změna rozsahu resetuje stránkování a znovu načte grafy i seznam společně.

## Seznam průběhů

- Stránkovaný seznam nedávných průběhů v rámci zvoleného časového období
- Každý průběh zobrazuje: workflow, uzel, přihlašovací údaje, časové razítko, dobu trvání
- Kliknutím na průběh otevřete detailní zobrazení
- Pomocí **Prev / Next** uvnitř dialogu s detailem se pohybujte mezi průběhy bez jeho zavření

## Filtrování

- **Time range** – 1h / 24h / 7d / 30d / All; filtruje grafy a seznam společně
- **Credential** – Filtrování podle použitých přihlašovacích údajů (API klíče)
- **Source** – Filtrování podle workflow nebo zdroje spuštění
- **Search** – Vyhledávání podle modelu, workflow, přihlašovacích údajů nebo popisku uzlu
- **Refresh** – Znovu načte aktuální stránku průběhů

## Detail průběhu

Když otevřete průběh:

- **Steps** – Časová osa shora dolů, která čte průběh jako uspořádaný řetězec: System → User → Assistant → Tool → Answer. Každý krok lze sbalit; rozbalením se zobrazí čitelný detail (text zprávy nebo argumenty a výsledek nástroje) následovaný JSON daného kroku. Obsah JSON u každého typu události – včetně volání MCP a JSON-RPC payloadů – se ve výchozím stavu otevírá ve rozbalovacím stromu s rozbalenou první úrovní. Pomocí **Tree / Raw** přepínáte mezi formátovanou strukturou a původním textem. Poškozený JSON zůstává viditelný jako prostý text. Kroky nástrojů zobrazují svou dobu trvání a případně odznak MCP/Skill, dále odznaky pending / timeout / cancelled, pokud je nastaven stav volání nástroje. Krok Answer může zobrazovat souhrnné odznaky `tool_metrics` (počty volání podle stavu a celkovou dobu trvání nástrojů). Pokud průběh zaznamenává každé volání modelu, jako to dělá zpráva v Dashboard Chat a směrovaný agent, před nástroji, které volání vyžádalo, stojí krok **LLM** a **Duration Breakdown** rozkládá každé volání modelu, nástroj a rozhodnutí o směrování na jedné časové ose. Zpráva v Dashboard Chat je jediný průběh, bez ohledu na to, kolik kol nástrojů si vyžádala. Průběhy bez řetězce zpráv (například generování obrázků) zobrazují minimální časovou osu Request → Response.
- **Request** – Úplný payload požadavku odeslaný LLM, se zobrazením JSON **Tree / Raw**
- **Response** – Odpověď modelu včetně volání nástrojů, pokud existují, se zobrazením JSON **Tree / Raw**
- **Tool metrics** – Pokud jsou v odpovědi přítomny, kompaktní souhrn počtů volání nástrojů (`success` / `error` / `pending` / `timeout` / `cancelled`) a celkové doby trvání nástrojů
- **Timing breakdown** – `llm_ms`, `tools_ms`, `mcp_list_ms` pro analýzu výkonu
- **Tool calls** – Název nástroje, argumenty, výsledek, stav a uplynulý čas
- **Skills included** – Skills předané modelu v požadavku
- **Go to Workflow** – Přímý přechod na související workflow z dialogu s detailem průběhu

## Kopírování a export

- Zkopírujte JSON požadavku nebo odpovědi do schránky; kopírování vždy používá úplný surový payload bez ohledu na aktivní zobrazení
- Využijte pro ladění nebo sdílení s podporou

## Údržba

- **Clear All** – Po potvrzení smaže všechny uložené průběhy
- Ovládací prvky stránkování zobrazují aktuální viditelný rozsah (například `1-25 of 240`)

## Související

- [Why Heym](../getting-started/why-heym.md) – Pozorovatelnost LLM v průběhu životního cyklu agenta
- [Agent Node](../nodes/agent-node.md) – Uzel Agent s voláním nástrojů
- [Node Types](../reference/node-types.md) – Uzly LLM a Agent
- [Credentials Tab](./credentials-tab.md) – Přihlašovací údaje použité v průbězích
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Volitelný export OTel pro spany workflow, uzlů a nástrojů agenta
- [DataTable Tab](./datatable-tab.md) – Obsahuje LLM Cost Table používanou grafem nákladů
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktní průvodce stránkou pro povrchy dashboardu
