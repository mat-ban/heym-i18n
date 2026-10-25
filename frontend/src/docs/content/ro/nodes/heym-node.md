# Heym

Nodul **Heym** citește datele proprii ale Heym: workflow-urile la care aveți acces, structura unui workflow și istoricul execuțiilor acestuia. Acesta este modul în care construiți meta-workflow-uri — inventare de instanțe, sinteze ale execuțiilor și rapoarte de stare despre Heym însuși.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Operațiuni | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Acreditări | Nu sunt necesare |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `heymOperation` | Select | Ce citire se efectuează |
| `heymWorkflowId` | UUID | Setați-l la `all` la `getExecutionHistory` pentru a citi toate workflow-urile accesibile. |
| `heymLimit` | String | Numărul maxim de rânduri returnate. **Lăsați gol sau introduceți `0` pentru a returna tot** — aceasta este valoarea implicită. Suportă expresii. |
| `heymStatus` | String | Filtru opțional de status pentru `getExecutionHistory`. Suportă expresii. |
| `heymSinceDays` | String | Interval opțional de căutare în urmă, în zile, pentru `getExecutionHistory`. Suportă expresii. |

Selectorul de workflow-uri este o listă derulantă căutabilă care afișează fiecare workflow la care aveți acces.

## Domeniu de acces

Rezultatele sunt limitate la **proprietarul workflow-ului în care se află nodul** — nu la persoana care a pornit execuția. Setul vizibil cuprinde:

- workflow-urile deținute de proprietar,
- workflow-urile partajate direct cu proprietarul,
- workflow-urile partajate cu o echipă din care face parte proprietarul.

Limitarea la proprietar este ceea ce face ca nodul să se comporte identic indiferent dacă o execuție a fost pornită manual, prin cron, dintr-un portal sau de un eveniment al platformei. Limitarea la actor nu ar returna nimic la fiecare execuție nesupravegheată. Este aceeași regulă pe care Heym o folosește deja pentru acreditări și variabile globale.

Un workflow la care nu aveți acces și un workflow care nu există produc același mesaj de eroare, astfel încât nodul nu poate fi folosit pentru a sonda id-uri de workflow-uri.

## Operațiuni

### List Workflows

Returnează fiecare workflow la care proprietarul are acces, cel mai recent actualizat primul.

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.workflows` | Array de rezumate de workflow-uri |
| `$nodeLabel.workflows[0].id` | UUID-ul workflow-ului |
| `$nodeLabel.workflows[0].name` | Numele workflow-ului |
| `$nodeLabel.workflows[0].description` | Descrierea, sau `null` |
| `$nodeLabel.workflows[0].active` | Dacă workflow-ul este activ |
| `$nodeLabel.workflows[0].folder_id` | UUID-ul folderului, sau `null` |
| `$nodeLabel.workflows[0].updated_at` | Timestamp ISO al ultimei salvări |
| `$nodeLabel.workflows[0].node_count` | Câte noduri conține workflow-ul |
| `$nodeLabel.total` | Numărul total accesibil **înainte** de aplicarea limitei |

`total` este în mod deliberat numărul nelimitat, astfel încât `$inventory.total` să raporteze în continuare dimensiunea reală atunci când limitați rândurile returnate. Golirea câmpului **Limit**, sau setarea acestuia la `0`, returnează fiecare workflow — aceasta fiind valoarea implicită.

### Get Workflow

Returnează identitatea și structura unui singur workflow.

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Identitatea workflow-ului |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metadatele workflow-ului |
| `$nodeLabel.node_count` | Numărul de noduri |
| `$nodeLabel.nodes` | Array de `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Array de `{ id, source, target, sourceHandle, targetHandle }` |

`data` este **configurația completă a nodului** — fiecare câmp așa cum a fost salvat. Aceasta este ceea ce face posibilă auditarea: nu puteți scana un workflow pentru a găsi un API key pe care cineva l-a lipit într-un câmp dacă nodul refuză să afișeze câmpul.

Aceasta nu acordă niciun acces pe care apelantul nu îl avea deja. Nodul este limitat la workflow-urile pe care proprietarul le poate deschide oricum în editor, iar secretele acreditărilor stocate nu se află aici: datele nodului conțin doar **id-uri** de acreditări, în timp ce secretele în sine sunt stocate criptat în tabelul de acreditări.

### Scanarea după secrete codificate direct

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Furnizați agentului `$detail.nodes` și cereți-i să semnaleze orice valoare din `data` care pare a fi un key sau un token activ. Câmpurile care merită urmărite sunt cele cu text liber — `curl` pe nodurile HTTP, `userMessage` și `systemInstruction` pe nodurile LLM și Agent, precum și corpurile uneltelor Python — deoarece un id de acreditare este un UUID inofensiv, dar un `sk-…` lipit nu este.
### Obținerea istoricului execuțiilor

Returnează intrările din istoricul execuțiilor pentru un workflow, cele mai recente primele.

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.executions` | Array de intrări din istoric |
| `$nodeLabel.executions[0].id` | UUID-ul execuției |
| `$nodeLabel.executions[0].status` | `success`, `error` și așa mai departe |
| `$nodeLabel.executions[0].started_at` | Marcaj temporal ISO |
| `$nodeLabel.executions[0].execution_time_ms` | Durata în timp real |
| `$nodeLabel.executions[0].trigger_source` | Ce a pornit rularea, de exemplu `cron` sau `heym_event` |
| `$nodeLabel.executions[0].recovered` | Dacă rularea a fost recuperată după o cădere |
| `$nodeLabel.executions[0].inputs` | Ce a primit rularea - payload-ul trigger-ului sau input-ul apelantului |
| `$nodeLabel.executions[0].outputs` | Output-ul workflow-ului pentru acea rulare |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow-ul căruia îi aparține istoricul sau `null` cu **{AW}** |
u `null` cu **{AW}** |
| `$nodeLabel.total` | Totalul execuțiilor care corespund **înainte** de limită |
| `$nodeLabel.by_s| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Cu **{AW}**, workflow-ul căruia îi aparține fiecare rulare |
tatus` | Numărători indexate după status, de exemplu `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Începutul ferestrei sau `null` pentru istoricul complet |

Intrările conțin atât `inputs`, cât și `outputs` - ce a primit rularea și ce a răspuns - dar niciodată `node_results`: urma per nod este cea mai mare coloană din tabel și ar eclipsa tot ce urmează. Obțineți o singură execuție prin API atunci când aveți nevoie de urma completă.

`total` și `by_status` descriu întotdeauna **întregul** istoric care corespunde, chiar și atunci când **Limit** limitează intrările returnate — astfel încât puteți extrage cele mai recente cinci rulări și totuși să raportați un număr exact de eșecuri.

Lăsați **Since (days)** gol pentru a acoperi totul, **Status filter** gol pentru a include fiecare status și **Limit** gol sau `0` pentru a returna fiecare intrare.

## Exemplu de workflow

**Rezumat zilnic al instanței**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` etichetat `inventory`
- **Loop** peste `$inventory.workflows`
- **Heym** `getExecutionHistory` cu `heymWorkflowId` setat la `id`-ul elementului din buclă, `heymSinceDays` de `1` și `heymLimit` de `5`
- **LLM** transformă rulările colectate și numărătorile de status într-un rezumat lizibil

## Note

- Nu este necesară nicio acreditare; nodul citește aceeași bază de date pe care rulează Heym.
- **Limit** este același câmp pentru ambele operații de listare și înseamnă același lucru în ambele: gol sau `0` returnează totul.
- Nodul primește un input normal și poate fi atașat la un nod Agent ca instrument, astfel încât un agent poate răspunde la întrebări despre instanța dvs. Heym — sau o poate audita.
- Payload-urile `getWorkflow` cresc odată cu workflow-ul: prompt-urile lungi și corpurile uneltelor Python călătoresc toate în interiorul `data`.
- Asociați-l cu [Heym Trigger](./heym-trigger-node.md) pentru a reacționa la modificările workflow-ului pe măsură ce se produc, în loc să interogați periodic conform unui program.

## Asociate

- [Heym Trigger](./heym-trigger-node.md) – Porniți un workflow din evenimente ale platformei
- [Execute](./execute-node.md) – Rulați un alt workflow în loc să îl descrieți
- [Loop](./loop-node.md) – Iterați peste lista de workflow-uri returnată
