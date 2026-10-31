# Filă Evals

Fila **Evals** este o pagină separată la `/evals`. Aceasta vă permite să creați suite de evaluare, să definiți cazuri de test și să rulați evaluări împotriva workflow-urilor dumneavoastră [Agent](../nodes/agent-node.md). O [suită de agenți](#agent-suites) rulează un agent sau citește rulările reale ale acestuia și verifică instrumentele apelate, latența, costul în USD, tokenurile și numărul de apeluri de instrumente.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Urmăriți demonstrația Evals</a></p>

## Acces

- Faceți clic pe **Evals** în bara de file a panoului de control
- Sau navigați la `/evals`
- Sau utilizați **Ctrl+K** (Cmd+K) și selectați „Evals" din paleta de comenzi

## Suite de evaluare

- **Suită nouă** – Alegeți **Suită de prompturi** pentru a testa un prompt de sistem între modele, sau **Suită de agenți** pentru a verifica rulările reale ale unui agent (consultați [Suite de agenți](#agent-suites))
- **Selector de suită** – Afișează suitele de prompturi și de agenți împreună cu tipul lângă fiecare nume; tastați pentru a căuta
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
- **Setări memorate** – O suită se deschide cu setările celei mai recente rulări: credențial, modele, metodă de notare și arbitru, temperatură, efort de raționament și rulări per test. Deschiderea unei rulări anterioare încarcă setările acesteia, astfel încât **Reia evaluările** repetă același test
- **Temperature** – Setați temperature modelului (`Exact Match` și `Contains`)
- **Efort de raționament** – Setați efortul de raționament pentru modelele de raționament, de la Scăzut la Foarte ridicat și Max la fel ca la nodurile LLM și Agent (`Exact Match` și `Contains`)

### LLM-as-Judge

Cu un judge, fiecare model răspunde la intrarea de test doar cu promptul suitei, apoi judge-ul evaluează cât de aproape se potrivește răspunsul cu rezultatul așteptat, de la 0 la 100:

- **Un judge de tip model** (OpenAI, OpenAI compatible sau Gemini) citește întrebarea, rezultatul așteptat și răspunsul și returnează un scor cu o justificare de o singură linie. Acesta rulează la temperature `0`, sau la reasoning effort `low` pentru un model de raționament, astfel încât același răspuns primește același verdict.
- **Un judge de tip decision model** evaluează răspunsul pe o rubrică cu cinci niveluri, de la *Complet pe lângă* la *Se potrivește pe deplin*. Scorul este poziția ponderată probabilistic pe acea rubrică, deci provine dintr-o distribuție calculată de model, nu dintr-un număr scris de acesta.

Cardul afișat la trecerea cursorului peste celulă prezintă motivul arbitrului sau, pentru un model decizional, nivelul, scorul și încrederea acestuia. Latența și tokenurile descriu modelul testat; apelurile proprii ale arbitrului apar în [Urme](./traces-tab.md) sub sursa **Evaluări**. Selectorul de arbitru exclude credențialele Model Router, deoarece un arbitru trebuie să fie un singur model fix. Credențialul pentru modelele testate poate fi un [Model Router](../reference/credentials.md#model-router-auto-model): modelul său **Auto** alege un model per solicitare, la fel ca într-un workflow.

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

## Agent Suites

O suită de agenți verifică un nod [Agent](../nodes/agent-node.md) în raport cu rulările sale. Le citește din [Urme](./traces-tab.md), unde fiecare rulare înregistrează deja timpul, tokenurile, costul și apelurile de instrumente, și poate rula workflow-ul în locul dumneavoastră.

Creați una prin **Suită nouă** → **Suită de agenți** și urmați trei pași:

1. **Agent** – Alegeți workflow-ul, apoi nodul său de agent. Sunt listate doar workflow-urile cu nod de agent; un workflow sau agent care nu a rulat încă este afișat, dar nu poate fi selectat. Setările agentului ales (model, instrucțiuni, instrumente și limite) apar în dreapta, iar mai jos este afișată o pânză în mod doar citire a workflow-ului său, cu agentul evidențiat.
2. **Baseline** – Ultimele 10 rulări ale agentului: latența p50 și p95, costul per rulare, tokenurile per rulare și apelurile de instrumente per rulare, ce instrumente a apelat și cât de des, precum și valorile individuale ale fiecărei rulări. Rulările încheiate cu eroare sunt listate, dar excluse din baseline.
3. **Verificări** – Marcați fiecare instrument ca **Must call**, **Must not call** sau **Either**. Fiecare tip de apel este listat cu tipul său: instrumente Python și de nod, instrumente **MCP** cu serverul lor, **sub-agenți** după etichetă, **sub-workflow-uri** după nume și **skills**. Adăugați unul după tip și nume dacă nu a rulat încă și eliminați-l cu butonul **X**. Setați limite superioare pentru latență, cost, totalul de tokenuri și apelurile de instrumente; fiecare pornește cu 20% peste p95-ul baseline-ului și poate fi dezactivată.

O suită salvată se deschide pe **Rezultate**, având alături **Baseline** și **Editează verificările**:

- **Rulează workflow-ul** – Alegeți numărul de rulări (până la 20); patru rulează simultan. Datele de intrare sunt completate din cea mai recentă rulare a workflow-ului și pot fi editate, fiind utilizate de fiecare rulare. Activați **Generează intrări** (pictograma scânteie), apoi alegeți un credențial și un model pentru ca modelul să genereze o intrare diferită pentru fiecare rulare. Acesta citește instrucțiunile de sistem ale agentului și rămâne fidel valorilor introduse: tastarea numelui unui oraș generează alte nume de orașe. Fiecare rulare execută întregul workflow la fel ca orice rulare obișnuită și este listată în Istoricul execuțiilor cu triggerul `agent_suite`. Pentru a sări peste pași ulteriori, cum ar fi trimiterea de e-mailuri, deschideți workflow-ul cu **Mergi la workflow** din panou și dezactivați acele noduri în prealabil. **Oprește** finalizează rularea suitei: nu mai pornesc rulări noi, iar cele în curs sunt anulate. O rulare de suită al cărei server s-a oprit, de exemplu în timpul unei reporniri, este marcată ca întreruptă după un minut în loc să rămână blocată.
- **Rezultate** – Cea mai recentă rulare a suitei este notată în mod implicit. Fiecare rulare de suită este păstrată cu data sa în selectorul de rulări, de unde o puteți deschide sau șterge; sau comutați la ultimele 10, 20 sau 50 de rulări ale agentului pentru a include și celelalte rulări ale acestuia. Vedeți rata de promovare, frecvența cu care fiecare verificare a fost trecută, latența, costul, tokenurile și apelurile de instrumente alături de baseline-ul salvat, precum și fiecare rulare cu motivul eșecului și un link către urma sa.
- **Mergi la workflow** deschide workflow-ul agentului într-o filă nouă. În câmpul de nume, tasta **Esc** sau pictograma **X** șterge textul.

Cum sunt interpretate datele:

- **Latența** reprezintă timpul modelului plus durata apelurilor de instrumente ale rulării.
- **Costul** aplică aceleași tarife ca Traces. O rulare a unui model fără tarif stabilit omite verificarea costului în loc să eșueze.
- O rulare **promovează** atunci când se finalizează fără eroare și trece toate verificările.
- Suita citește doar propriile dumneavoastră urme, conform aceleiași reguli ca fila Urme.
- **Folosește ultimele rulări ca baseline** din **Editează verificările** înlocuiește baseline-ul salvat cu cele mai recente rulări ale agentului.

Baseline-ul unei suite provine din una dintre trei surse. **Editează verificările** arată care este activă lângă **Baseline salvat**:

- cele mai recente rulări ale agentului (implicit, și ceea ce preia opțiunea **Folosește ultimele rulări ca baseline**),
- o rulare de suită finalizată,
- valori introduse manual.

Ultimele două se configurează din [Chat](./chat-tab.md#working-with-evals) sau prin API:

- `PATCH /api/evals/agent-suites/{id}` acceptă `baseline: {"source": "suite_run", "run_id": "…"}` sau `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` acceptă `inputs_list`: un obiect de intrare per rulare, până la 20.

### Din Chat și MCP

[Chat](./chat-tab.md#working-with-evals) și instrumentul MCP `heym_chat` pot crea, modifica și rula suite de prompturi și de agenți:

- Formulează cazuri de testare și intrări de rulare în mod autonom.
- Întreabă ce credențial să utilizeze înainte de a crea o suită de prompturi, cu excepția cazului în care doar unul este potrivit.
- Conectează fiecare suită pe care o menționează pe această pagină.

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
