# Filă Evals

Fila **Evals** este o pagină separată la `/evals`. Aceasta vă permite să creați suite de evaluare, să definiți cazuri de test și să rulați evaluări împotriva workflow-urilor dumneavoastră [Agent](../nodes/agent-node.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Urmăriți demonstrația Evals</a></p>

## Acces

- Faceți clic pe **Evals** în bara de file a panoului de control
- Sau navigați la `/evals`
- Sau utilizați **Ctrl+K** (Cmd+K) și selectați „Evals" din paleta de comenzi

## Suite de evaluare

- **Creați o suită** – Definiți o suită cu un nume și o descriere
- **Selectați workflow-ul** – Alegeți workflow-ul care urmează a fi evaluat
- **Selectați credențialul** – Cheia API pentru rularea workflow-ului
- **Prompt de sistem** – Editați promptul de sistem la nivel de suită direct în panoul din stânga
- **Optimizați promptul** – Solicitați unui LLM să îmbunătățească promptul de sistem curent

## Cazuri de test

- Adăugați cazuri de test cu prompturi de intrare și rezultate așteptate
- Fiecare caz poate avea o valoare așteptată personalizată pentru comparație
- Editați sau ștergeți cazuri din suită
- **Generați date de test** – Utilizați credențialul/modelul selectat pentru a crea automat cazuri de test din promptul suitei

## Rularea evaluărilor

- **Selectați unul sau mai multe modele** – Rulați aceeași suită împotriva mai multor modele într-o singură evaluare
- **Metodă de punctare** – Alegeți `Exact Match`, `Contains` sau `LLM-as-Judge`
- **Judge** – Pentru `LLM-as-Judge`, opțional alegeți un credențial OpenAI, OpenAI compatible (Custom), Gemini (Google) sau [Decision Model](../nodes/decision-node.md) și introduceți modelul judge-ului (de exemplu `gpt-4o-mini` sau `jev-latest`) pentru a puncta cu un judge independent
- **Rulări per test** – Repetați fiecare caz de test de mai multe ori într-o singură rulare
- **Temperature** – Setați temperature modelului (`Exact Match` și `Contains`)
- **Reasoning effort** – Setați reasoning effort pentru modelele de raționament (`Exact Match` și `Contains`)

### LLM-as-Judge

Cu un judge, fiecare model răspunde la intrarea de test doar cu promptul suitei, apoi judge-ul evaluează cât de aproape se potrivește răspunsul cu rezultatul așteptat, de la 0 la 100:

- **Un judge de tip model** (OpenAI, OpenAI compatible sau Gemini) citește întrebarea, rezultatul așteptat și răspunsul și returnează un scor cu o justificare de o singură linie. Acesta rulează la temperature `0`, sau la reasoning effort `low` pentru un model de raționament, astfel încât același răspuns primește același verdict.
- **Un judge de tip decision model** evaluează răspunsul pe o rubrică cu cinci niveluri, de la *Complet pe lângă* la *Se potrivește pe deplin*. Scorul este poziția ponderată probabilistic pe acea rubrică, deci provine dintr-o distribuție calculată de model, nu dintr-un număr scris de acesta.

Cardul de hover al celulei afișează justificarea judge-ului sau, pentru un decision model, nivelul, scorul și încrederea acestuia. Latența și tokenii descriu modelul testat; apelurile proprii ale judge-ului apar în [Traces](./traces-tab.md) sub sursa **Evals**. Selectorul de modele omite credențialele Model Router, deoarece o evaluare compară modele specifice.

Fără un judge, fiecare model răspunde și își punctează propriul răspuns într-o singură cerere.

Temperature și reasoning effort sunt ascunse în acest mod, iar rularea utilizează setări fixe: temperature `0.7` pentru modelele standard și reasoning effort `medium` pentru modelele de raționament (`low` când își punctează propriile răspunsuri).

## Rezultate

- Vizualizați promovat/nepromovat per caz de test
- Inspectați rezultatele reale vs. cele așteptate
- Comparați rezultatele per model una lângă alta când o rulare include mai multe modele
- Examinați istoricul rulărilor pentru evaluările anterioare; o rulare `LLM-as-Judge` afișează modelul judge în lista istoricului
- Deschideți rulările istorice din panoul de rezultate și inspectați instantaneele salvate de prompt/intrare/ieșire
- Deschiderea unei rulări anterioare încarcă metoda sa de punctare și judge-ul în panoul din stânga, astfel încât **Re-Run Evals** repetă aceeași evaluare
- **Export** descarcă rularea ca JSON, incluzând `judge_credential_id` și `judge_model`

## Idei pentru matricea de benchmark

Când construiți o matrice de benchmark pentru workflow-uri de agent, includeți scenariile HITL ca cazuri de primă clasă, în loc să le tratați ca pe niște cazuri limită.

- Acoperiți toate cele trei decizii de revizuire: `accepted`, `edited` și `refused`
- Includeți multiple surse de trigger, precum rulări din editor, portal, curl/webhook și execuții declanșate de cron
- Adăugați scenarii de revizuire repetată în care o singură rulare a agentului se oprește de mai multe ori
- Verificați ramificațiile de notificare conectate la ieșirea `review` a agentului
- Validați comportamentul din aval după refuz, mai ales dacă nodurile ulterioare se ramifică pe `$agent.decision`

## Resurse conexe

- [Why Heym](../getting-started/why-heym.md) – Evals ca etapă de testare a ciclului de viață al agentului
- [Agent Node](../nodes/agent-node.md) – Workflow-urile care sunt evaluate
- [Credentials Tab](./credentials-tab.md) – Credențiale pentru rulările de evaluare
- [Traces Tab](./traces-tab.md) – Inspecție detaliată a trace-urilor
- [Workflows Tab](./workflows-tab.md) – Creați workflow-uri de evaluat
- [Execution History](../reference/execution-history.md) – Vizualizați rulările anterioare (butonul History din antet)
- [Contextual Showcase](../reference/contextual-showcase.md) – Ghid compact de pagină disponibil pe pagina evals
