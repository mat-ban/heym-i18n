# Pestanya Evals

La pestanya **Evals** és una pàgina independent a `/evals`. Permet crear suites d'avaluació, definir casos de prova i executar avaluacions contra els vostres workflows d'[Agent](../nodes/agent-node.md). Una [suite d'agents](#agent-suites) executa un agent o llegeix les seves execucions reals, comprovant les eines que crida, la seva latència, el seu cost en USD, els seus tokens i el seu nombre de crides d'eines.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

## Accés

- Feu clic a **Evals** a la barra de pestanyes del tauler
- O navegueu a `/evals`
- O utilitzeu **Ctrl+K** (Cmd+K) i seleccioneu "Evals" a la paleta d'ordres

## Suites d'avaluació

- **Nova suite** – Trieu **Suite de prompts** per provar un prompt de sistema entre models, o **Suite d'agents** per comprovar execucions reals d'un agent (vegeu [Suites d'agents](#agent-suites))
- **Selector de suite** – Llista les suites de prompts i d'agents juntes amb el tipus al costat de cada nom; escriviu per cercar
- **Create suite** – Definiu una suite amb un nom i una descripció
- **Select workflow** – Trieu quin workflow avaluar
- **Select credential** – Clau API per executar el workflow
- **System prompt** – Editeu el system prompt a nivell de suite directament al panell esquerre
- **Optimize Prompt** – Demaneu a un LLM que millori el system prompt actual

## Casos de prova

- Afegiu casos de prova amb prompts d'entrada i sortides esperades
- Cada cas pot tenir un valor esperat personalitzat per a la comparació
- Editeu o suprimiu casos de la suite
- **Generate Test Data** – Utilitzeu la credencial/model seleccionats per crear automàticament casos de prova a partir del prompt de la suite

## Executar avaluacions

- **Select one or more models** – Executeu la mateixa suite contra diversos models en una sola avaluació
- **Scoring method** – Trieu `Exact Match`, `Contains` o `LLM-as-Judge`
- **Judge** – Per a `LLM-as-Judge`, opcionalment trieu una credencial d'OpenAI, OpenAI compatible (Custom), Gemini (Google) o [Decision Model](../nodes/decision-node.md) i escriviu el model del judge (per exemple `gpt-4o-mini` o `jev-latest`) per puntuar amb un judge independent
- **Runs per test** – Repetiu cada cas de prova diverses vegades en una mateixa execució
- **Configuració recordada** – Una suite s'obre amb la configuració de la seva execució més recent: credencial, models, mètode de puntuació i jutge, temperatura, esforç de raonament i execucions per prova. Obrir una execució anterior carrega aquesta configuració, de manera que **Reexecutar avaluacions** repeteix la mateixa
- **Temperature** – Definiu la temperatura del model (`Exact Match` i `Contains`)
- **Esforç de raonament** – Establiu l'esforç de raonament per a models de raonament, de Baix a Molt alt i Màx igual que als nodes LLM i Agent (`Exact Match` i `Contains`)

### LLM-as-Judge

Amb un judge, cada model respon a l'entrada de prova només amb el prompt de la suite, i després el judge valora com s'aproxima la resposta a la sortida esperada, de 0 a 100:

- **Un judge de model** (OpenAI, OpenAI compatible o Gemini) llegeix la pregunta, la sortida esperada i la resposta, i retorna una puntuació amb una raó d'una línia. S'executa a temperatura `0`, o amb esforç de raonament `low` per a un model de raonament, de manera que la mateixa resposta obté el mateix veredicte.
- **Un judge de model de decisió** valora la resposta segons una rúbrica de cinc nivells, des de *Completely off* fins a *Fully matches*. La puntuació és la posició ponderada per probabilitat en aquesta rúbrica, de manera que prové d'una distribució que el model ha calculat, no d'un número que hagi escrit.

La targeta emergent de la cel·la mostra el motiu del jutge o, per a un model de decisió, el nivell, la puntuació i la seva confiança. La latència i els tokens descriuen el model sota prova; les crides del propi jutge apareixen a [Traces](./traces-tab.md) sota l'origen **Avaluacions**. El selector de jutge omet les credencials de Model Router, perquè un jutge ha de ser un únic model fix. La credencial per als models sota prova pot ser un [Model Router](../reference/credentials.md#model-router-auto-model): el seu model **Auto** selecciona un model per sol·licitud, de la mateixa manera que en un workflow.

Sense un judge, cada model respon i puntua la seva pròpia resposta en una sola petició.

La temperatura i l'esforç de raonament s'oculten en aquest mode, i l'execució utilitza paràmetres fixos: temperatura `0.7` per als models estàndard, i esforç de raonament `medium` per als models de raonament (`low` quan puntuen les seves pròpies respostes).

## Resultats

- Visualitzeu aprovat/fallit per cas de prova
- Inspeccioneu les sortides reals vs. esperades
- Compareu les sortides de cada model costat a costat quan una execució inclou diversos models
- Reviseu l'historial d'execucions d'avaluacions passades; una execució `LLM-as-Judge` mostra el seu model judge a la llista de l'historial
- Obriu execucions històriques des del panell de resultats i inspeccioneu les instantànies desades de prompt/entrada/sortida
- Obrir una execució passada carrega el seu mètode de puntuació i judge al panell esquerre, de manera que **Re-Run Evals** repeteix la mateixa avaluació
- **Export** descarrega l'execució com a JSON, incloent-hi `judge_credential_id` i `judge_model`

## Agent Suites

Una suite d'agents comprova un node [Agent](../nodes/agent-node.md) enfront de les seves execucions. Les llegeix de [Traces](./traces-tab.md), on cada execució ja registra el seu temps, tokens, cost i crides d'eines, i també pot executar el workflow per vós.

Creeu-ne una amb **Nova suite** → **Suite d'agents** i seguiu tres passos:

1. **Agent** – Trieu el workflow i després el seu node d'agent. Només es llisten els workflows amb node d'agent; un workflow o agent que encara no s'hagi executat es mostra però no es pot seleccionar. Els paràmetres de l'agent triat (model, instruccions, eines i límits) es mostren a la dreta, i a sota apareix un llenç de només lectura del seu workflow amb l'agent ressaltat.
2. **Baseline** – Les darreres 10 execucions de l'agent: latència p50 i p95, cost per execució, tokens per execució i crides d'eines per execució, quines eines ha cridat i amb quina freqüència, i els números individuals de cada execució. Les execucions que han acabat en error es llisten però queden fora de la baseline.
3. **Comprovacions** – Marqueu cada eina com a **Must call**, **Must not call** o **Either**. Cada tipus de crida es llista amb el seu tipus: eines Python i de node, eines **MCP** amb el seu servidor, **subagents** per etiqueta, **subworkflows** per nom i **skills**. Afegiu-ne una per tipus i nom si encara no s'ha executat, i traieu-la amb la seva **X**. Establiu límits superiors per a latència, cost, tokens totals i crides d'eines; cadascun comença un 20% per sobre del p95 de la baseline i es pot desactivar.

Una suite desada s'obre a **Resultats**, amb **Baseline** i **Editar comprovacions** al costat:

- **Executar el workflow** – Trieu quantes execucions fer (fins a 20); se n'executen quatre alhora. Les entrades s'omplen a partir de l'execució més recent del workflow i es poden editar, utilitzant-les cada execució. Activeu **Generar entrades** (la icona d'espurna) i després trieu una credencial i un model perquè el model redacti una entrada diferent per a cada execució. Llegeix les instruccions de sistema de l'agent i es manté fidel als valors escrits: escriure el nom d'una ciutat genera altres noms de ciutats. Cada execució executa tot el workflow com qualsevol altra execució i apareix a l'Historial d'execucions amb el trigger `agent_suite`. Per ometre passos posteriors, com ara un enviament de correu, obriu el workflow amb **Anar al workflow** al panell i desactiveu primer aquests nodes. **Aturar** finalitza l'execució de la suite: no s'inicien noves execucions i les que estan en curs es cancel·len. Una execució de suite el servidor de la qual s'ha aturat, per exemple durant un reinici, es mostra com a interrompuda després d'un minut en lloc de quedar-se blocada.
- **Resultats** – La darrera execució de la suite es puntua per defecte. Cada execució de suite es conserva amb la seva data al selector d'execucions, on la podeu obrir o suprimir; o canvieu a les darreres 10, 20 o 50 execucions de l'agent per incloure les seves altres execucions. Veureu la taxa d'aprovació, amb quina freqüència s'ha superat cada comprovació, latència, cost, tokens i crides d'eines al costat de la baseline desada, així com cada execució amb el motiu del fracàs i un enllaç a la seva traça.
- **Anar al workflow** obre el workflow de l'agent en una pestanya nova. Al camp del nom, **Esc** o la **X** neteja el text.

Com s'interpreten les xifres:

- La **latència** és el temps del model més el temps de les crides d'eines de l'execució.
- El **cost** utilitza els mateixos preus que Traces. L'execució d'un model sense preu omet la comprovació de cost en lloc de fallar.
- Una execució **aprova** quan acaba sense errors i supera totes les comprovacions.
- La suite només llegeix les vostres pròpies traces, la mateixa regla que a la pestanya Traces.
- **Utilitzar les darreres execucions com a baseline** a **Editar comprovacions** substitueix la baseline desada per les darreres execucions de l'agent.

La baseline d'una suite prové d'un de tres orígens. **Editar comprovacions** mostra quin és actiu al costat de **Baseline desada**:

- les darreres execucions de l'agent (per defecte, i el que agafa **Utilitzar les darreres execucions com a baseline**),
- una execució de suite finalitzada,
- números introduïts manualment.

Els dos darrers es configuren des de [Chat](./chat-tab.md#working-with-evals) o l'API:

- `PATCH /api/evals/agent-suites/{id}` accepta `baseline: {"source": "suite_run", "run_id": "…"}` o `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` accepta `inputs_list`: un objecte d'entrada per execució, fins a 20.

### Des de Chat i MCP

El [Chat](./chat-tab.md#working-with-evals) i l'eina MCP `heym_chat` poden crear, modificar i executar suites de prompts i d'agents:

- Redacten casos de prova i entrades d'execució de forma autònoma.
- Pregunten quina credencial utilitzar abans de crear una suite de prompts, llevat que només una sigui adequada.
- Enllacen cada suite que mencionen en aquesta pàgina.

## Idees per a matrius de benchmark

Quan construïu una matriu de benchmark per a workflows d'agent, incloeu escenaris HITL com a casos de primera classe en lloc de tractar-los com a casos límit.

- Cobriu les tres decisions de revisió: `accepted`, `edited` i `refused`
- Incloeu múltiples fonts de trigger com ara execucions des de l'editor, portal, curl/webhook i execucions desencadenades per cron
- Afegiu escenaris de revisió repetida on una execució d'agent es pausa més d'una vegada
- Verifiqueu les branques de notificació connectades a la sortida `review` de l'agent
- Comproveu el comportament posterior a un refús, especialment si nodes posteriors fan branques sobre `$agent.decision`

## Relacionat

- [Why Heym](../getting-started/why-heym.md) – Evals com a etapa de prova del cicle de vida de l'agent
- [Agent Node](../nodes/agent-node.md) – Workflows que s'avaluen
- [Credentials Tab](./credentials-tab.md) – Credencials per a execucions d'avaluació
- [Traces Tab](./traces-tab.md) – Inspecció detallada de traces
- [Workflows Tab](./workflows-tab.md) – Creeu workflows per avaluar
- [Execution History](../reference/execution-history.md) – Visualitzeu execucions passades (botó History a la capçalera)
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacta de la pàgina disponible a la pàgina d'evals
