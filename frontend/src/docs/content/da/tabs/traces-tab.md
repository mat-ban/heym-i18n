# Spor-fanen

**Spor**-fanen viser eksekveringsspor for LLM. Det er muligt at inspicere request/response-payloads, timing, tool calls og fejlsøge [Agent](../nodes/agent-node.md)- og [LLM](../reference/node-types.md)-node-adfærd, samt se aggregerede målepunkter (kald, tokens, omkostninger, ventetid, fejlrate) for ethvert tidsvindue.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Se Spor-demo</a></p>

## Statistikoverskrift

Siden åbner med en statistikoversigt over sporlisten, beregnet ud fra det valgte tidsinterval og andre aktive filtre:

- **KPI-kort** – Samlede kald, Samlede tokens, Samlede omkostninger (USD), Gennemsnitlig ventetid, Fejlprocent
- **Tokens efter model** – Donut-diagram over tokenforbrug pr. model
- **Omkostninger efter model** – Donut-diagram over USD-forbrug pr. model. Modeller uden priser viser et "Konfigurer priser"-link til [LLM-omkostningstabellen](./datatable-tab.md#llm-cost-table-system-table)
- **Kald over tid** – Stakket arealdiagram over succesfulde vs. mislykkede kald pr. tidsinterval (5 min / 1 t / 6 t / 1 dag, valgt automatisk efter interval)
- **Bemærkning om uprisede modeller** – Vises under diagrammerne, nogle sporerede modeller mangler prisdata, med link til LLM-omkostningstabellen

## Tidsinterval

Et enkelt **Tidsinterval**-vælger øverst i filterlinjen styrer både statistikoversigten og sporlisten. Valgmuligheder: Sidste 1 time, Sidste 24 timer, Sidste 7 dage (standard), Sidste 30 dage, Altid. Ændring af interval nulstiller paginering og genindlæser diagrammer og liste sammen.

## Sporliste

- Pagineret liste over nylige spor inden for det valgte tidsinterval
- Hvert spor viser: workflow, node, legitimationsoplysninger, tidsstempel, varighed
- Klik på et spor for at åbne detaljevisningen
- Brug **Forrige / Næste** i detaljedialogen til at navigere mellem spor uden at lukke den

## Filtrering

- **Tidsinterval** – 1t / 24t / 7d / 30d / Alt; filtrerer både diagrammer og liste
- **Legitimationsoplysninger** – Filtrer efter brugt legitimationsoplysning (API-nøgle)
- **Kilde** – Filtrer efter workflow eller eksekveringskilde
- **Søgning** – Søg efter model, workflow, legitimationsoplysninger eller node-label
- **Opdater** – Genindlæs den aktuelle side med spor

## Spordetaljer

Når et spor åbnes:

- **Trin** – En tidslinje fra top til bund, der læser sporet som en ordnet kæde: System → Bruger → Assistent → Værktøj → Svar. Hvert trin kan foldes sammen; ved udfoldning vises læsbare detaljer (beskedtekst eller et værktøjs argumenter og resultat) efterfulgt af trinets JSON. JSON-indhold i alle eventtyper – inklusive MCP-kald og JSON-RPC-payloads – åbnes som standard i et udfoldeligt træ med første niveau udfoldet. Brug **Træ / Rå** for at skifte mellem formateret struktur og original tekst. Ugyldig JSON vises som almindelig tekst. Værktøjstrin viser deres varighed og et MCP/Skill-mærke, hvor relevant, plus ventende / timeout / annullerede mærker, når værktøjskaldstatus er angivet. Svar-trinnet kan vise aggregerede `tool_metrics`-mærker (kaldtællinger efter status og samlet værktøjsvarighed). Når et spor registrerer hvert modelkald, som en Dashboard Chat-besked og en routed agent gør, placeres et **LLM**-trin før de anmodede værktøjskald, og **Varighedsopdeling** viser hvert modelkald, værktøj og routingbeslutning på én tidslinje. En Dashboard Chat-besked er et enkelt spor, uanset hvor mange værktøjsrunder det krævede. Spor uden en beskedkæde (f.eks. billedgenerering) viser en minimal Request → Response-tidslinje.
- **Request** – Fuld request-payload sendt til LLM, med **Træ / Rå** JSON-visninger
- **Response** – Modelrespons, inklusive værktøjskald hvis relevante, med **Træ / Rå** JSON-visninger
- **Værktøjsmålepunkter** – Når tilgængelige i responsen, en kompakt oversigt over værktøjskaldtællinger (`success` / `error` / `pending` / `timeout` / `cancelled`) og samlet værktøjsvarighed
- **Tidsopdeling** – `llm_ms`, `tools_ms`, `mcp_list_ms` til performanceanalyse
- **Værktøjskald** – Værktøjsnavn, argumenter, resultat, status og forbrugt tid
- **Inkluderede skills** – Skills sendt til modellen i requesten
- **Gå til Workflow** – Spring direkte til det relaterede workflow fra spordetaljedialogen

## Kopiering og eksport

- Kopier request- eller response-JSON til udklipsholder; kopiering bruger altid den komplette rå payload uanset aktiv visning
- Brug til fejlsøgning eller deling med support

## Vedligeholdelse

- **Ryd alt** – Slet alle gemte spor efter bekræftelse
- Pagineringskontroller viser det aktuelle synlige interval (f.eks. `1-25 af 240`)

## Relateret

- [Hvorfor Heym](../getting-started/why-heym.md) – LLM-observabilitet gennem agentens livscyklus
- [Agent Node](../nodes/agent-node.md) – Agent-node med værktøjskald
- [Node-typer](../reference/node-types.md) – LLM- og Agent-noder
- [Legitimationsoplysninger-fanen](./credentials-tab.md) – Legitimationsoplysninger brugt i spor
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Valgfri OTel-eksport for workflow-, node- og Agent-værktøjsspænd
- [DataTable-fanen](./datatable-tab.md) – Indeholder LLM-omkostningstabellen brugt af omkostningsdiagrammet
- [Kontekstuel showcase](../reference/contextual-showcase.md) – Kompakt sideguide til dashboard-overflader
