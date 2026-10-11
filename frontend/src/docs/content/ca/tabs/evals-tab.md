# Pestanya Evals

La pestanya **Evals** és una pàgina independent a `/evals`. Permet crear suites d'avaluació, definir casos de prova i executar avaluacions contra els vostres workflows d'[Agent](../nodes/agent-node.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

## Accés

- Feu clic a **Evals** a la barra de pestanyes del tauler
- O navegueu a `/evals`
- O utilitzeu **Ctrl+K** (Cmd+K) i seleccioneu "Evals" a la paleta d'ordres

## Suites d'avaluació

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
- **Temperature** – Definiu la temperatura del model (`Exact Match` i `Contains`)
- **Reasoning effort** – Definiu l'esforç de raonament per als models de raonament (`Exact Match` i `Contains`)

### LLM-as-Judge

Amb un judge, cada model respon a l'entrada de prova només amb el prompt de la suite, i després el judge valora com s'aproxima la resposta a la sortida esperada, de 0 a 100:

- **Un judge de model** (OpenAI, OpenAI compatible o Gemini) llegeix la pregunta, la sortida esperada i la resposta, i retorna una puntuació amb una raó d'una línia. S'executa a temperatura `0`, o amb esforç de raonament `low` per a un model de raonament, de manera que la mateixa resposta obté el mateix veredicte.
- **Un judge de model de decisió** valora la resposta segons una rúbrica de cinc nivells, des de *Completely off* fins a *Fully matches*. La puntuació és la posició ponderada per probabilitat en aquesta rúbrica, de manera que prové d'una distribució que el model ha calculat, no d'un número que hagi escrit.

La targeta emergent de la cel·la mostra la raó del judge o, per a un model de decisió, el nivell, la puntuació i la seva confiança. La latència i els tokens descriuen el model sota prova; les crides pròpies del judge apareixen a [Traces](./traces-tab.md) sota la font **Evals**. El selector de models omet les credencials de Model Router, perquè una avaluació compara models concrets.

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
