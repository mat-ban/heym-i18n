# Pestanya Traces

La pestanya **Traces** mostra les traces d'execució dels LLM. Inspeccioneu els payloads de petició/resposta, la temporització, les crides d'eines i depureu el comportament dels nodes [Agent](../nodes/agent-node.md) i [LLM](../reference/node-types.md), a més de mètriques agregades (crides, tokens, cost, latència, taxa d'error) en qualsevol finestra temporal.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>

## Capçalera d'estadístiques

La pàgina s'obre amb un resum d'estadístiques per sobre de la llista de traces, calculat segons el rang temporal seleccionat i els altres filtres actius:

- **Targetes KPI** – Total de crides, total de tokens, cost total (USD), latència mitjana, % d'errors
- **Tokens per model** – Gràfic de dònuts del volum de tokens per model
- **Cost per model** – Gràfic de dònuts de la despesa en USD per model. Els models sense preu mostren un enllaç "Configure pricing" a la [Taula de costos d'LLM](./datatable-tab.md#llm-cost-table-system-table)
- **Crides al llarg del temps** – Gràfic d'àrea apilada de crides correctes vs fallides per interval (5 min / 1 h / 6 h / 1 dia, triat automàticament segons el rang)
- **Avís de models sense preu** – Apareix sota els gràfics quan alguns models traçats no tenen fila de preus, amb un enllaç a la Taula de costos d'LLM

## Rang temporal

Un únic selector de **Time range** a la part superior de la barra de filtres controla tant la capçalera d'estadístiques com la llista de traces. Opcions: Last 1 hour, Last 24 hours, Last 7 days (per defecte), Last 30 days, All time. Canviar el rang reinicia la paginació i recarrega els gràfics i la llista conjuntament.

## Llista de traces

- Llista paginada de traces recents dins del rang temporal seleccionat
- Cada traça mostra: workflow, node, credencial, marca temporal, durada
- Feu clic en una traça per obrir la vista de detall
- Utilitzeu **Prev / Next** dins del diàleg de detall per moure's entre traces sense tancar-lo

## Filtratge

- **Time range** – 1h / 24h / 7d / 30d / All; filtra els gràfics i la llista conjuntament
- **Credential** – Filtra per credencial (clau API) utilitzada
- **Source** – Filtra per workflow o font d'execució
- **Search** – Cerca per model, workflow, credencial o etiqueta de node
- **Refresh** – Recarrega la pàgina actual de traces

## Detall de la traça

Quan obriu una traça:

- **Steps** – Una línia temporal de dalt a baix que llegeix la traça com una cadena ordenada: System → User → Assistant → Tool → Answer. Cada pas és plegable; en expandir-ne un es mostra un detall llegible (text del missatge, o els arguments i el resultat d'una eina) seguit del JSON d'aquell pas. El contingut JSON de cada tipus d'esdeveniment—incloent-hi crides MCP i payloads JSON-RPC—s'obre per defecte en un arbre expandible, amb el primer nivell expandit. Utilitzeu **Tree / Raw** per alternar entre l'estructura formatada i el text original. El JSON mal format es manté visible com a text pla. Els passos d'eines mostren la seva durada i una insígnia MCP/Skill quan escau, a més d'insígnies pending / timeout / cancelled quan l'estat de la crida d'eina està definit. El pas Answer pot mostrar insígnies agregades de `tool_metrics` (recomptes de crides per estat i durada total de les eines). Quan una traça registra cada crida al model, com fan un missatge de Dashboard Chat i un agent enrutat, un pas **LLM** se situa abans de les eines que la crida ha sol·licitat, i el **Duration Breakdown** desplega cada crida al model, eina i decisió d'enrutament en una sola línia temporal. Un missatge de Dashboard Chat és una única traça, per moltes rondes d'eines que requereixi. Les traces sense cadena de missatges (per exemple, generació d'imatges) mostren una línia temporal mínima Request → Response.
- **Request** – Payload complet de la petició enviat a l'LLM, amb vistes JSON **Tree / Raw**
- **Response** – Resposta del model, incloent-hi crides d'eines si n'hi ha, amb vistes JSON **Tree / Raw**
- **Tool metrics** – Quan són presents a la resposta, un resum compacte dels recomptes de crides d'eines (`success` / `error` / `pending` / `timeout` / `cancelled`) i la durada total de les eines
- **Timing breakdown** – `llm_ms`, `tools_ms`, `mcp_list_ms` per a l'anàlisi de rendiment
- **Tool calls** – Nom de l'eina, arguments, resultat, estat i temps transcorregut
- **Skills included** – Skills passades al model a la petició
- **Go to Workflow** – Salta directament al workflow relacionat des del diàleg de detall de la traça

## Copiar i exportar

- Copieu el JSON de petició o resposta al porta-retalls; copiar sempre utilitza el payload raw complet independentment de la vista activa
- Utilitzeu-ho per a la depuració o per compartir-ho amb el suport

## Manteniment

- **Clear All** – Elimina totes les traces desades després de confirmar-ho
- Els controls de paginació mostren el rang visible actual (per exemple `1-25 of 240`)

## Relacionat

- [Why Heym](../getting-started/why-heym.md) – Observabilitat d'LLM al llarg del cicle de vida de l'agent
- [Agent Node](../nodes/agent-node.md) – Node Agent amb crida d'eines
- [Node Types](../reference/node-types.md) – Nodes LLM i Agent
- [Credentials Tab](./credentials-tab.md) – Credencials utilitzades a les traces
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Exportació OTel opcional per a spans de workflow, node i eines d'Agent
- [DataTable Tab](./datatable-tab.md) – Allotja la Taula de costos d'LLM utilitzada pel gràfic de costos
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacta de pàgina per a superfícies del dashboard
