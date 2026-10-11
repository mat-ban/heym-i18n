# Tabblad Traces

Het tabblad **Traces** toont LLM-uitvoeringstraces. Inspecteer request/response-payloads, timing, tool-aanroepen en debug het gedrag van [Agent](../nodes/agent-node.md)- en [LLM](../reference/node-types.md)-knooppunten, plus geaggregeerde statistieken (aanroepen, tokens, kosten, latentie, foutpercentage) over elk tijdvenster.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>

## Statistiekenkop

De pagina opent met een statistiekensamenvatting boven de tracelijst, berekend over het geselecteerde tijdbereik en andere actieve filters:

- **KPI-kaarten** – Totaal aantal aanroepen, totaal aantal tokens, totale kosten (USD), gemiddelde latentie, foutpercentage
- **Tokens per model** – Donutdiagram van tokenvolume per model
- **Kosten per model** – Donutdiagram van USD-uitgaven per model. Modellen zonder prijsstelling tonen een koppeling "Configure pricing" naar de [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)
- **Aanroepen in de tijd** – Gestapeld vlakdiagram van geslaagde versus mislukte aanroepen per bucket (5 min / 1 u / 6 u / 1 dag, automatisch gekozen per bereik)
- **Melding voor modellen zonder prijs** – Verschijnt onder de diagrammen wanneer sommige getracete modellen geen prijsregel hebben, met een koppeling naar de LLM Cost Table

## Tijdbereik

Een enkele **Time range**-selector bovenaan de filterbalk stuurt zowel de statistiekenkop als de tracelijst aan. Keuzes: Last 1 hour, Last 24 hours, Last 7 days (standaard), Last 30 days, All time. Het wijzigen van het bereik reset de paginering en herlaadt diagrammen en lijst samen.

## Tracelijst

- Gepagineerde lijst van recente traces binnen het geselecteerde tijdbereik
- Elke trace toont: workflow, knooppunt, referentie, tijdstempel, duur
- Klik op een trace om de detailweergave te openen
- Gebruik **Prev / Next** in het detailvenster om tussen traces te navigeren zonder het te sluiten

## Filteren

- **Time range** – 1u / 24u / 7d / 30d / All; filtert diagrammen en lijst samen
- **Credential** – Filter op gebruikte referentie (API key)
- **Source** – Filter op workflow of uitvoeringsbron
- **Search** – Zoek op model, workflow, referentie of knooppuntlabel
- **Refresh** – Herlaad de huidige pagina met traces

## Tracedetail

Wanneer u een trace opent:

- **Steps** – Een tijdlijn van boven naar beneden die de trace als een geordende keten leest: System → User → Assistant → Tool → Answer. Elke stap is inklapbaar; het uitklappen van een stap toont een leesbare detailweergave (berichttekst, of de argumenten en het resultaat van een tool) gevolgd door de JSON van die stap. JSON-inhoud in elk gebeurtenistype—inclusief MCP-aanroepen en JSON-RPC-payloads—opent standaard in een uitklapbare boom, met het eerste niveau uitgeklapt. Gebruik **Tree / Raw** om te schakelen tussen de opgemaakte structuur en de oorspronkelijke tekst. Misvormde JSON blijft zichtbaar als platte tekst. Tool-stappen tonen hun duur en een MCP/Skill-badge waar van toepassing, plus pending / timeout / cancelled-badges wanneer de tool-call-status is ingesteld. De Answer-stap kan geaggregeerde `tool_metrics`-badges tonen (aanroepaantallen per status en totale tool-duur). Wanneer een trace elke modelaanroep vastlegt, zoals een Dashboard Chat-bericht en een gerouteerde agent doen, staat er een **LLM**-stap vóór de tools die de aanroep heeft aangevraagd, en legt de **Duration Breakdown** elke modelaanroep, tool en routeringsbeslissing op één tijdlijn. Een Dashboard Chat-bericht is één trace, ongeacht het aantal tool-rondes dat nodig was. Traces zonder berichtketen (bijvoorbeeld beeldgeneratie) tonen een minimale Request → Response-tijdlijn.
- **Request** – Volledige request-payload verzonden naar de LLM, met **Tree / Raw** JSON-weergaven
- **Response** – Modelrespons, inclusief tool-aanroepen indien aanwezig, met **Tree / Raw** JSON-weergaven
- **Tool metrics** – Indien aanwezig op de respons, een compacte samenvatting van tool-aanroepaantallen (`success` / `error` / `pending` / `timeout` / `cancelled`) en totale tool-duur
- **Timing breakdown** – `llm_ms`, `tools_ms`, `mcp_list_ms` voor prestatieanalyse
- **Tool calls** – Toolnaam, argumenten, resultaat, status en verstreken tijd
- **Skills included** – Skills die in de request aan het model zijn doorgegeven
- **Go to Workflow** – Spring direct naar de gerelateerde workflow vanuit het tracedetailvenster

## Kopiëren en exporteren

- Kopieer request- of response-JSON naar het klembord; bij kopiëren wordt altijd de volledige ruwe payload gebruikt, ongeacht de actieve weergave
- Gebruik voor debugging of delen met support

## Onderhoud

- **Clear All** – Verwijder alle opgeslagen traces na bevestiging
- Pagineringsbesturingselementen tonen het huidige zichtbare bereik (bijvoorbeeld `1-25 of 240`)

## Gerelateerd

- [Why Heym](../getting-started/why-heym.md) – LLM-observability gedurende de levenscyclus van de agent
- [Agent Node](../nodes/agent-node.md) – Agent-knooppunt met tool calling
- [Node Types](../reference/node-types.md) – LLM- en Agent-knooppunten
- [Credentials Tab](./credentials-tab.md) – Referenties gebruikt in traces
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Opt-in OTel-export voor workflow-, knooppunt- en Agent-tool-spans
- [DataTable Tab](./datatable-tab.md) – Host de LLM Cost Table die door het kostendiagram wordt gebruikt
- [Contextual Showcase](../reference/contextual-showcase.md) – Compacte paginagids voor dashboardoppervlakken
