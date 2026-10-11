# Fliken Traces

Fliken **Traces** visar LLM-körningsspår. Inspektera request/response-payloads, tidsstyrning, tool-anrop och felsök beteendet hos [Agent](../nodes/agent-node.md)- och [LLM](../reference/node-types.md)-noder, samt aggregerade mätvärden (anrop, tokens, kostnad, latens, felfrekvens) över valfritt tidsfönster.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>

## Statistikrubrik

Sidan inleds med en statistiksammanfattning ovanför spårlistan, beräknad över det valda tidsintervallet och övriga aktiva filter:

- **KPI-kort** – Total Calls, Total Tokens, Total Cost (USD), Avg Latency, Error %
- **Tokens by Model** – Donutdiagram över tokenvolym per modell
- **Cost by Model** – Donutdiagram över USD-kostnad per modell. Modeller utan prissättning visar en länk "Configure pricing" till [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)
- **Calls Over Time** – Staplat ytdiagram över lyckade vs misslyckade anrop per bucket (5 min / 1 h / 6 h / 1 dag, väljs automatiskt per intervall)
- **Unpriced models notice** – Visas under diagrammen när vissa spårade modeller saknar prissättningsrad, med länk till LLM Cost Table

## Tidsintervall

En enda **Time range**-väljare högst upp i filterfältet styr både statistikrubriken och spårlistan. Val: Last 1 hour, Last 24 hours, Last 7 days (standard), Last 30 days, All time. Ändring av intervallet återställer paginering och laddar om diagram och lista tillsammans.

## Spårlista

- Paginerad lista över senaste spår inom det valda tidsintervallet
- Varje spår visar: workflow, nod, credential, tidsstämpel, varaktighet
- Klicka på ett spår för att öppna detaljvyn
- Använd **Prev / Next** i detaljdialogen för att navigera mellan spår utan att stänga den

## Filtrering

- **Time range** – 1h / 24h / 7d / 30d / All; filtrerar diagram och lista tillsammans
- **Credential** – Filtrera efter använd credential (API-nyckel)
- **Source** – Filtrera efter workflow eller körningskälla
- **Search** – Sök efter modell, workflow, credential eller nodetikett
- **Refresh** – Ladda om aktuell sida med spår

## Spårdetalj

När ett spår öppnas:

- **Steps** – En tidslinje uppifrån och ned som läser spåret som en ordnad kedja: System → User → Assistant → Tool → Answer. Varje steg är kollapsbart; expandering visar en läsbar detalj (meddelandetext, eller ett tools argument och resultat) följt av stegets JSON. JSON-innehåll i varje händelsetyp – inklusive MCP-anrop och JSON-RPC-payloads – öppnas som ett expanderbart träd som standard, med första nivån expanderad. Använd **Tree / Raw** för att växla mellan den formaterade strukturen och originaltexten. Felformad JSON förblir synlig som klartext. Tool-steg visar sin varaktighet och en MCP/Skill-badge där tillämpligt, samt pending / timeout / cancelled-badges när tool-anropets status är satt. Answer-steget kan visa aggregerade `tool_metrics`-badges (anropsantal per status och total tool-varaktighet). När ett spår registrerar varje modellanrop, som ett Dashboard Chat-meddelande och en routad agent gör, placeras ett **LLM**-steg före de tools som anropet begärde, och **Duration Breakdown** lägger ut varje modellanrop, tool och routingbeslut på en tidslinje. Ett Dashboard Chat-meddelande är ett enda spår, oavsett hur många tool-rundor det tog. Spår utan meddelandekedja (till exempel bildgenerering) visar en minimal Request → Response-tidslinje.
- **Request** – Fullständig request-payload som skickats till LLM, med **Tree / Raw**-JSON-vyer
- **Response** – Modellsvar, inklusive tool-anrop om sådana finns, med **Tree / Raw**-JSON-vyer
- **Tool metrics** – När det finns på svaret, en kompakt sammanfattning av tool-anropsantal (`success` / `error` / `pending` / `timeout` / `cancelled`) och total tool-varaktighet
- **Timing breakdown** – `llm_ms`, `tools_ms`, `mcp_list_ms` för prestandaanalys
- **Tool calls** – Tool-namn, argument, resultat, status och förfluten tid
- **Skills included** – Skills som skickats till modellen i requesten
- **Go to Workflow** – Hoppa direkt till det relaterade workflowet från spårdetaljdialogen

## Kopiera och exportera

- Kopiera request- eller response-JSON till urklipp; kopiering använder alltid den fullständiga råa payloaden oavsett aktiv vy
- Används för felsökning eller delning med support

## Underhåll

- **Clear All** – Ta bort alla sparade spår efter bekräftelse
- Pagineringskontroller visar aktuellt synligt intervall (till exempel `1-25 of 240`)

## Relaterat

- [Why Heym](../getting-started/why-heym.md) – LLM-observability över agentens livscykel
- [Agent Node](../nodes/agent-node.md) – Agent-nod med tool calling
- [Node Types](../reference/node-types.md) – LLM- och Agent-noder
- [Credentials Tab](./credentials-tab.md) – Credentials som används i spår
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Opt-in OTel-export för workflow-, nod- och Agent tool-spans
- [DataTable Tab](./datatable-tab.md) – Innehåller LLM Cost Table som används av kostnadsdiagrammet
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakt sidguide för dashboard-ytor
