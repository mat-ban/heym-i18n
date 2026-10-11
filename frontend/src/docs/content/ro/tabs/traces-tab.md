# Filă Traces

Fila **Traces** afișează urmele de execuție LLM. Inspectați payload-urile de cerere/răspuns, temporizarea, apelurile de unelte și depanați comportamentul nodurilor [Agent](../nodes/agent-node.md) și [LLM](../reference/node-types.md), plus metrici agregate (apeluri, tokenuri, cost, latență, rată de eroare) pe orice interval de timp.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Urmăriți demonstrația Traces</a></p>

## Antet de statistici

Pagina se deschide cu un rezumat de statistici deasupra listei de urme, calculat pe intervalul de timp selectat și pe celelalte filtre active:

- **Carduri KPI** – Total apeluri, Total tokenuri, Cost total (USD), Latență medie, % erori
- **Tokenuri pe model** – Diagramă inelară a volumului de tokenuri per model
- **Cost pe model** – Diagramă inelară a cheltuielii în USD per model. Modelele fără preț afișează un link „Configure pricing" către [Tabelul de costuri LLM](./datatable-tab.md#llm-cost-table-system-table)
- **Apeluri în timp** – Diagramă cu arie suprapusă a apelurilor reușite vs eșuate per interval (5 min / 1 h / 6 h / 1 zi, ales automat în funcție de interval)
- **Notificare modele fără preț** – Apare sub diagrame când unele modele urmărite nu au rând de preț, cu link către Tabelul de costuri LLM

## Interval de timp

Un singur selector **Time range** în partea de sus a barei de filtre controlează atât antetul de statistici, cât și lista de urme. Opțiuni: Ultima 1 oră, Ultimele 24 de ore, Ultimele 7 zile (implicit), Ultimele 30 de zile, Toate timpurile. Schimbarea intervalului resetează paginarea și reîncarcă diagramele și lista împreună.

## Lista de urme

- Listă paginată a urmelor recente din intervalul de timp selectat
- Fiecare urmă afișează: workflow, nod, credential, marcaj temporal, durată
- Faceți clic pe o urmă pentru a deschide vizualizarea detaliată
- Folosiți **Prev / Next** în dialogul de detalii pentru a naviga între urme fără a-l închide

## Filtrare

- **Time range** – 1h / 24h / 7d / 30d / All; filtrează diagramele și lista împreună
- **Credential** – Filtrați după credentialul (cheia API) utilizat
- **Source** – Filtrați după workflow sau sursa de execuție
- **Search** – Căutați după model, workflow, credential sau eticheta nodului
- **Refresh** – Reîncarcă pagina curentă de urme

## Detalii urmă

Când deschideți o urmă:

- **Steps** – O cronologie de sus în jos care citește urma ca un lanț ordonat: System → User → Assistant → Tool → Answer. Fiecare pas este pliabil; extinderea unuia afișează un detaliu lizibil (textul mesajului, sau argumentele și rezultatul unei unelte) urmat de JSON-ul acelui pas. Conținutul JSON din fiecare tip de eveniment—inclusiv apelurile MCP și payload-urile JSON-RPC—se deschide implicit într-un arbore extensibil, cu primul nivel extins. Folosiți **Tree / Raw** pentru a comuta între structura formatată și textul original. JSON-ul malformat rămâne vizibil ca text simplu. Pașii de unelte afișează durata lor și un badge MCP/Skill acolo unde este cazul, plus badge-uri pending / timeout / cancelled când starea apelului de unealtă este setată. Pasul Answer poate afișa badge-uri agregate `tool_metrics` (număr de apeluri după stare și durata totală a uneltelor). Când o urmă înregistrează fiecare apel de model, așa cum fac un mesaj Dashboard Chat și un agent rutat, un pas **LLM** se află înaintea uneltelor pe care le-a solicitat apelul, iar **Duration Breakdown** prezintă fiecare apel de model, unealtă și decizie de rutare pe o singură cronologie. Un mesaj Dashboard Chat este o singură urmă, indiferent câte runde de unelte au fost necesare. Urmele fără un lanț de mesaje (de exemplu generarea de imagini) afișează o cronologie minimală Request → Response.
- **Request** – Payload-ul complet al cererii trimise către LLM, cu vizualizări JSON **Tree / Raw**
- **Response** – Răspunsul modelului, inclusiv apelurile de unelte dacă există, cu vizualizări JSON **Tree / Raw**
- **Tool metrics** – Când sunt prezente în răspuns, un rezumat compact al numărului de apeluri de unelte (`success` / `error` / `pending` / `timeout` / `cancelled`) și durata totală a uneltelor
- **Timing breakdown** – `llm_ms`, `tools_ms`, `mcp_list_ms` pentru analiza performanței
- **Tool calls** – Numele uneltei, argumente, rezultat, stare și timp scurs
- **Skills included** – Skill-urile transmise modelului în cerere
- **Go to Workflow** – Sari direct la workflow-ul asociat din dialogul de detalii al urmei

## Copiere și export

- Copiați JSON-ul cererii sau răspunsului în clipboard; copierea utilizează întotdeauna payload-ul brut complet indiferent de vizualizarea activă
- Utilizați pentru depanare sau partajare cu suportul

## Întreținere

- **Clear All** – Șterge toate urmele salvate după confirmare
- Controalele de paginare afișează intervalul vizibil curent (de exemplu `1-25 of 240`)

## Resurse conexe

- [Why Heym](../getting-started/why-heym.md) – Observabilitate LLM pe parcursul ciclului de viață al agentului
- [Agent Node](../nodes/agent-node.md) – Nod Agent cu apelare de unelte
- [Node Types](../reference/node-types.md) – Noduri LLM și Agent
- [Credentials Tab](./credentials-tab.md) – Credentiale utilizate în urme
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Export OTel opțional pentru span-uri de workflow, nod și unelte Agent
- [DataTable Tab](./datatable-tab.md) – Găzduiește Tabelul de costuri LLM utilizat de diagrama de costuri
- [Contextual Showcase](../reference/contextual-showcase.md) – Ghid compact de pagină pentru suprafețele dashboard-ului
