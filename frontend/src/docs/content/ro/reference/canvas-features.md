# Funcționalități Canvas

Editorul de workflow-uri oferă mai multe funcționalități pentru depanare, testare și organizarea nodurilor: **Run to Node**, **AI pe un nod**, **Data Pin**, **Execution Logs**, **Enable/Disable** și **Extract to Sub-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Urmăriți demonstrația Editorului</a></p>

## Run to Node

Poziționați cursorul deasupra oricărui nod, cu excepția unei note lipicioase, și faceți clic pe **Run** sub acesta. Heym execută nodul respectiv și dependențele sale anterioare, lăsând neatinse nodurile ulterioare și ramurile fără legătură. Aceasta utilizează modul de testare canvas, incluzând ieșirile fixate și condițiile normale de ramificare ale workflow-ului.

Dacă calea selectată are câmpuri de intrare, panoul **Run** din dreapta se deschide și focalizează primul câmp. Introduceți valorile, apoi faceți clic pe **Run to _node label_** sau apăsați **Ctrl+Enter** (Cmd+Enter pe macOS). Modul generic body focalizează editorul JSON body. Căile fără câmpuri de intrare rulează imediat fără a deschide panoul. Nodurile Pinned Input reutilizează ieșirea fixată fără a solicita intrare.

Panoul păstrează ținta selectată pentru rulările ulterioare. Alegeți **Run full workflow** pentru a șterge ținta. Butoanele Run sunt dezactivate în timp ce o execuție este activă. O țintă dintr-o buclă oprește rularea când acel nod este atins pentru prima dată; selectarea unui nod după buclă rulează întreaga buclă anterioară.

## AI pe un nod

Treceți cu cursorul peste orice nod cu excepția unei note adezive și faceți clic pe **AI** deasupra lui. [AI Assistant](./ai-assistant.md) se deschide pe acel nod și oferă **Change this node as ...**, **Fix error in this node ...** și **Other**. În modul Agent, asistentul modifică doar acel nod; alte noduri, conexiuni și aspectul rămân neschimbate. Consultați [AI Assistant › Modificarea unui singur nod](./ai-assistant.md#changing-one-node).

Butonul este ascuns la workflow-urile pe care aveți drept doar de vizualizare.

## Data Pin

Data Pin vă permite să fixați ieșirea unui nod din ultima rulare, astfel încât să puteți testa nodurile ulterioare fără a re-executa nodul fixat.

### Unde îl găsiți

- **Panoul Properties** – Selectați un nod și derulați la secțiunea **Pinned Data**
- **Insigna nodului** – O pictogramă de fixare apare pe nod când datele sunt fixate

### Acțiuni

| Acțiune | Descriere |
|--------|-------------|
| **Pin** | Fixează ieșirea ultimei execuții a nodului (disponibilă după o rulare) |
| **Clear** | Elimină datele fixate |
| **Edit** | Editați direct JSON-ul fixat; faceți clic pe Save pentru a aplica |

### Comportamentul în modul de testare

La rularea unui workflow în modul de testare, nodurile cu `pinnedData` omit execuția și utilizează ieșirea fixată în schimb. Utilizați aceasta pentru a:

- Testa logica ulterioară fără a apela API-uri externe
- Depana expresii care fac referire la ieșirea nodului
- Itera asupra prompt-urilor sau condițiilor cu date eșantion fixe

Completarea expresiilor în editor utilizează datele fixate atunci când sunt disponibile pentru a sugera câmpuri.

## Execution Logs

**Panoul Debug** (sertarul de jos) afișează jurnalele de execuție în timp real în timpul rulărilor workflow-ului. De asemenea, puteți deschide o execuție de producție în curs fie din dialogul History, fie dintr-un card Board. Editorul se atașează la fluxul SSE al acelei rulări, restaurează rezultatele nodurilor finalizate și continuă să afișeze animațiile nodurilor și jurnalele pe măsură ce noduri noi încep și se termină.

### Ce afișează

- **Rezultatele nodurilor** – Starea per nod (`success`, `error`, `skipped`, `running`), timpul de execuție și ieșirea
- **Ieșirile finale** – Ieșiri agregate de la nodurile [Output](../nodes/output-node.md)
- **Progresul Agent** – Pentru nodurile [Agent](../nodes/agent-node.md), apeluri de unelte pas cu pas și raționament

### Acțiuni

- **Copy as JSON** – Copiază jurnalul complet de execuție în clipboard
- **Open in JSON editor** – Deschide jurnalul în JSON Hero sau JSON Editor Online pentru inspectare
- **Download generated files** – Dacă o abilitate a produs fișiere descărcabile (`_generated_files`), apare un buton Download. Un singur fișier se descarcă direct; mai multe fișiere deschid un popup de selecție.

### Distincția față de fila Logs

Panoul Debug afișează jurnalele de **execuție a workflow-ului** (rezultatele nodurilor, ieșiri). [Fila Logs](../tabs/logs-tab.md) afișează jurnalele **containerului Docker** (backend, frontend, bază de date). <!-- pragma: allowlist secret -->

## Enable / Disable

Puteți dezactiva noduri astfel încât acestea să fie omise în timpul execuției. Nodurile dezactivate afișează o insignă "off" și apar estompate.

### Cum se comută

| Metodă | Descriere |
|--------|-------------|
| **Panoul Properties** | Selectați nodul → Pictograma Power (dreapta sus) |
| **Meniul contextual** | Faceți clic dreapta pe nod(uri) → Disable sau Enable |
| **Tastatură** | Selectați nod(uri) → apăsați **D** (consultați [Keyboard Shortcuts](./keyboard-shortcuts.md)) |

### Selecție multiplă

Când sunt selectate mai multe noduri, Enable/Disable se aplică tuturor. Meniul contextual afișează "Enable" dacă orice nod selectat este dezactivat, "Disable" dacă toate sunt activate.

### Comportamentul la runtime

Nodurile cu `active: false` sunt omise. Nodurile ulterioare nu primesc date de la nodurile omise. Utilizați aceasta pentru a exclude temporar noduri fără a le șterge.

Pentru a activa sau dezactiva un nod din interiorul unui workflow în loc de manual, utilizați [Disable Node](../nodes/disable-node.md) și [Enable Node](../nodes/enable-node.md).
## Graficul de memorie al agentului

Nodurile [Agent](../nodes/agent-node.md) cu **[memorie persistentă](./agent-persistent-memory.md)** activată afișează un control roz de tip **brain** pe nod. Faceți clic pe el pentru a deschide editorul graficului de memorie: entitățile sunt redate ca un grafic animat, cu direcționare forțată, grupat pe tip de entitate, cu selectoare Source/Target căutabile pentru adăugarea de relații și un panou de conexiuni pentru a naviga între entitățile conectate. Același dialog include **Share memory with other agents** (workflow → agent → citire sau citire/scriere) pentru [partajarea memoriei între agenți](./agent-persistent-memory.md#sharing-with-other-agents). Cât timp dialogul este deschis, undo/redo pe canvasul principal este amânat, astfel încât editarea graficului își păstrează propriul istoric.

**Filtrarea graficului.** În colțul din stânga sus al canvasului există un control de căutare, restrâns la un buton de acces rapid până când faceți clic pe el sau apăsați **Ctrl/Cmd+F**. Acesta caută în numele unei entități, tipul acesteia și fiecare cheie și valoare de atribut, precum și în tipul unei relații (`parent_of`) și proprietățile acesteia; o relație care corespunde aduce cu ea ambele entități. Toți termenii separați prin spații trebuie să corespundă. O entitate care corespunde aduce cu ea întregul său vecinătate — fiecare relație în care este implicată și entitatea de la celălalt capăt al fiecăreia — astfel încât o potrivire nu rămâne niciodată ca un punct neconectat. O relație care corespunde aduce doar cele două entități pe care le unește și se oprește acolo, deoarece căutarea unui tip de relație este o întrebare despre acea relație, nu despre tot ceea ce este atașat la capetele ei. Tot restul este ascuns de tot — nu estompat — pe canvas și în lista **All edges**, iar un badge arată câte dintre entitățile totale au rămas. **✕** din interiorul casetei șterge mai întâi interogarea, apoi închide caseta la o a doua apăsare. Escape derulează înapoi în același mod, cel mai interior primul: șterge interogarea, apoi închide caseta de căutare, apoi părăsește vizualizarea extinsă a canvasului și închide dialogul doar după ce niciuna dintre acestea nu mai este deschisă. Ștergerea restaurează graficul complet, cu fiecare entitate înapoi acolo unde era.

**Plasarea entităților manual.** Tragerea unei entități o fixează acolo unde o plasați, astfel încât aspectul automat așază restul graficului în jurul ei în loc să o tragă înapoi. Tragerea entității pe care ați selectat-o mută împreună cu ea entitățile conectate direct, păstrând forma grupului; tragerea oricărei alte entități mută doar acea entitate. **Tidy layout** (butonul cu bagheta) eliberează fiecare entitate fixată și rulează din nou aspectul automat.

## Extract to Sub-Workflow

Convertiți nodurile selectate într-un sub-workflow reutilizabil și înlocuiți-le cu un nod [Execute](../nodes/execute-node.md).

### Cum se utilizează

1. Selectați unul sau mai multe noduri pe canvas
2. Faceți clic dreapta → **Extract to Sub-Workflow**
3. Introduceți un nume (și o descriere opțională) pentru noul workflow
4. Faceți clic pe **Extract**

### Ce se întâmplă

- Un nou workflow este creat cu nodurile selectate
- Intrările externe (muchii din afara selecției) devin câmpurile [Input](../nodes/input-node.md) ale sub-workflow-ului
- Ieșirile externe (muchii către noduri din afara selecției) sunt mapate la [Output](../nodes/output-node.md) al sub-workflow-ului
- Nodurile selectate sunt înlocuite cu un singur nod [Execute](../nodes/execute-node.md) care apelează noul workflow
- Mapările de intrare/ieșire sunt păstrate automat

### Cazuri de utilizare

- Reutilizarea unei secvențe de noduri în mai multe workflow-uri
- Simplificarea unui workflow complex prin gruparea logicii conexe
- Crearea de sub-workflow-uri modulare și testabile

## Run with cURL

Butonul **cURL** din bara de instrumente a editorului (dreapta sus) deschide un dialog pentru a construi și copia o comandă cURL pentru declanșarea workflow-ului prin API.

- Alegeți modul corpului cererii al workflow-ului (`Defined` sau `Generic`)
- Setați tipul de autentificare (Anonymous, JWT sau Header Auth)
- Configurați cache-ul răspunsului și limitarea ratei
- Comutați streamingul SSE și personalizați mesajele de început pentru fiecare nod
- Editați corpul cererii
- În modul Generic, panoul de rulare al canvasului folosește același corp JSON brut ca dialogul cURL
- Faceți clic pe **Copy cURL** pentru a copia comanda gata de rulare

Consultați [Webhooks](./webhooks.md#run-with-curl-dialog) pentru detalii complete despre dialog și [SSE Streaming](./sse-streaming.md) pentru protocolul de evenimente.

## Related

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Toate comenzile rapide pentru canvas și editor
- [Agent Persistent Memory](./agent-persistent-memory.md) – Comportamentul graficului de memorie și API
- [Execute Node](../nodes/execute-node.md) – Apelează sub-workflow-uri
- [Expression DSL](./expression-dsl.md) – Referințe și date fixate
- [Workflow Structure](./workflow-structure.md) – Formatul nodurilor și muchiilor
- [Download & Import](./download-import.md) – Exportați și importați workflow-uri ca JSON
- [Node Types](./node-types.md) – Toate tipurile de noduri
- [Logs Tab](../tabs/logs-tab.md) – Jurnalele containerelor Docker
- [Execution History](./execution-history.md) – Rulări anterioare
- [Templates](../tabs/templates-tab.md) – Salvați și reutilizați workflow-uri și noduri
- [Contextual Showcase](./contextual-showcase.md) – Ghid compact al paginii disponibil în editor
