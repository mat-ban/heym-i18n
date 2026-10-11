# Istoric de execuție

Istoricul de execuție înregistrează rulările workflow-urilor: intrări, ieșiri, rezultate ale nodurilor, status și sursa
trigger-ului. Utilizați-l pentru a urmări o rulare activă în producție, pentru a inspecta rulările anterioare, pentru a depana erori sau pentru a re-rula
cu aceleași intrări prin **Bring to Canvas**.

## Prezentare generală

Fiecare execuție stochează:

| Câmp | Descriere |
|-------|-------------|
| **Inputs** | Corpul cererii sau intrările rulării (de ex. `text` pentru nodul Input) |
| **Outputs** | Ieșirile la nivel de workflow |
| **Node results** | Ieșirile per nod, statusul și timpul de execuție |
| **Status** | `success`, `error`, `pending`, `skipped` sau `failed` (consultați [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Modul în care a fost declanșată rularea (consultați [Triggers](./triggers.md)) |

## Accesarea istoricului

| Locație | Domeniu de aplicare |
|----------|-------|
| Bara de instrumente din **Editor** | Doar workflow-ul curent |
| Antetul vizualizării **Docs** | Doar workflow-ul curent |
| Antetul **Dashboard** (fila Chat) | Toate workflow-urile + rulările de chat/asistent |
| Antetul vizualizării **Evals** | Toate workflow-urile + rulările de chat/asistent |

Faceți clic pe butonul **History** (pictograma cu ceas) pentru a deschide dialogul.

## Istoric per workflow vs. istoric complet

- **Per workflow** (Editor, Docs): Afișează rulările pentru workflow-ul deschis. Utilizați **Clear history** pentru a elimina rulările doar pentru acel workflow.
- **All History** (Dashboard, Evals): Afișează rulările din toate workflow-urile și sesiunile de chat/asistent. Acoperirea corespunde accesului la workflow-uri: workflow-urile pe care le dețineți, workflow-urile partajate direct cu dumneavoastră și workflow-urile partajate cu o echipă din care faceți parte. Utilizați **Clear all history** pentru a elimina toate înregistrările pe care le dețineți. Istoricul pentru workflow-urile partajate va fi păstrat.

## Bring to Canvas

**Bring to Canvas** încarcă intrările și ieșirile nodurilor unei rulări selectate în workflow-ul curent.

### Ce încarcă

- **Inputs** → Panoul de intrare al rulării (de ex. `text` pentru nodul Input sau câmpuri personalizate)
- **Node results** → Panoul de rezultate al execuției afișează ieșirile anterioare per nod
- **Execution result** → Statusul, ieșirile și durata rulării

### Comportament în funcție de context

- **În Editor** (istoric per workflow): Se aplică imediat workflow-ului deschis și închide dialogul.
- **Din All History** (Dashboard/Evals): Navighează la editorul workflow-ului, apoi aplică datele la încărcarea editorului. Disponibil doar pentru rulările de workflow — nu și pentru rulările de chat/asistent.

### Deep link către execuție

Deschiderea unui workflow la `/workflows/{workflowId}/{executionId}` aduce automat acea execuție pe canvas — la fel ca selectarea rulării și alegerea opțiunii **Bring to Canvas**. Astfel, o anumită rulare anterioară poate fi partajată ca URL. Dacă execuția nu poate fi găsită (id greșit sau șters), editorul revine la încărcarea workflow-ului simplu.

### Cazuri de utilizare

- Re-rularea unui workflow cu aceleași intrări
- Depanarea unei rulări eșuate prin inspectarea intrărilor și ieșirilor nodurilor
- Compararea ieșirilor între rulări

## Execution Highlights

După o rulare live — sau după **Bring to Canvas** — apare un popup **Execution Highlights** care poate fi închis, în **colțul din dreapta sus al Canvas-ului**. Este o modalitate rapidă de a vedea *ce a produs fiecare nod*, listat de sus în jos în ordinea execuției. Închideți-l cu **✕**; se redeschide la următoarea rulare.

### Ce este afișat

| Înregistrare | Sursă | Automat? |
|--------|--------|-------|
| **Input** | Parametrii de intrare ai rulării (nodul input/trigger) | Da |
| **Output** | Rezultatul nodului de output — sau, dacă nu există, mesajul ultimului nod | Da |
| **Agent / LLM** | Ieșirea fiecărui nod agent sau LLM | Da |
| **Output** | Orice alt nod cu **Highlight Node Output** activat | Opțional |

Nodurile care sunt deja evidențiate automat (input / output / last / agent / llm) nu apar niciodată de două ori, chiar dacă activați și comutatorul.

### Fiecare înregistrare

- Afișează `Node — message…` cu primele **250 de caractere**; faceți clic pe un rând pentru a-l extinde și a reda **mesajul complet ca Markdown**, cu un buton **Copy**.
- Un nod care a rulat de mai multe ori (de ex. într-o buclă) afișează `Node (N)` cu un selector `‹ i / N ›` — alegeți ce rulare să vizualizați; selectorul fiecărui nod este independent.

### Highlight Node Output

Fiecare nod **cu excepția Agent și LLM** are o casetă de selectare **Highlight Node Output** în panoul său de proprietăți (implicit dezactivată). Activați-o pentru a adăuga ieșirea acelui nod în popup. Pe canvas apare un mic badge ✦ pe nodurile evidențiate. În [workflow DSL](./expression-dsl.md) acesta este câmpul de date al nodului `"highlight": true` (implicit `false`).

### Pe dashboard-uri

Cardurile widget-urilor din dashboard care au rulat un workflow afișează un buton ✦ **Execution highlights** în antetul cardului; faceți clic pe el pentru a deschide același popup pentru rularea acelui widget, cu ieșirea desenată a widget-ului ca înregistrare proeminentă.
## Executarea execuțiilor

Ambele dialoguri de istoric afișează **execuțiile în curs de rulare** în partea de sus a listei, înaintea rulărilor anterioare.

- Un indicator rotativ și eticheta **Running** apar împreună cu ora de început
- Faceți clic pe **Open live** pentru a atașa editorul la acea rulare exactă fără a o reporni
- Canvasul restaurează mai întâi nodurile care s-au încheiat deja, apoi primește
  evenimentele `node_start`, `node_complete` și evenimentele finale de execuție prin SSE
- Nodul curent pulsează pe canvas, nodurile din aval își păstrează animația de așteptare, iar
  panoul Debug adaugă fiecare rezultat pe măsură ce sosește — exact ca o rulare pornită din editor
- Faceți clic pe **Cancel** pentru a opri execuția imediat
- Anularea din orice dialog (Editor sau Dashboard) închide de asemenea fluxul SSE activ din orice filă de canvas deschisă pentru acel workflow, astfel încât starea editorului se resetează curat
- După anulare, intrarea în curs de rulare dispare la următoarea reîmprospătare; apăsați **Refresh** pentru a actualiza lista manual
- Dacă anulați o rulare care s-a încheiat deja, cererea nu are niciun efect

URL-ul live este `/workflows/{workflowId}/{executionId}`. Observatorul este read-only: părăsirea
editorului doar deconectează acea filă de browser și nu oprește niciodată workflow-ul. Instantaneele active
sunt partajate prin PostgreSQL, astfel încât deschiderea unei rulări funcționează chiar și atunci când trigger-ul și cererea
editorului ajung pe workeri de backend diferiți.

## Recuperarea după crash

Dacă serverul repornește (deploy, repornirea containerului sau crash) în timp ce un workflow rulează, workerul acelei rulări se oprește la mijlocul execuției. Heym recuperează automat aceste rulări întrerupte în loc să le lase blocate ca **Running**.

- La următoarea pornire, procesul lider ales detectează rulările orfane — instantaneu pentru o repornire grațioasă sau în aproximativ 60 de secunde pentru un crash dur (odată ce heartbeat-urile se opresc clar).
- Rulările recuperate sunt **rulate din nou de la zero cu aceleași intrări** (nu reluate din punctul în care s-au oprit), folosind definiția curentă a workflow-ului. La finalizare, înregistrează o intrare terminală normală (de ex. `success`), astfel încât istoricul afișează rularea ca finalizată.
- O rulare este reîncercată **o singură dată**. Dacă și tentativa de recuperare este întreruptă — sau workflow-ul a fost între timp șters — intrarea este înregistrată ca `failed`.
- Acest lucru funcționează la fel pe un singur container și pe implementările multi-worker; doar liderul efectuează recuperarea, astfel încât o rulare nu este niciodată recuperată de două ori de workeri diferiți.

### Comutatorul Auto-recover

Panoul **Execution Log** (rulare) al editorului are o casetă de selectare **Auto-recover**, **activată implicit** per workflow.

- **On**: rulările întrerupte ale acestui workflow sunt rulate din nou conform descrierii de mai sus.
- **Off**: rulările întrerupte nu sunt rulate din nou și sunt înregistrate cu statusul `skipped`.

> Rulările sub-workflow nu sunt recuperate independent — ele sunt relansate de rularea părinte recuperată. Trigger-ele cu propria retransmitere (RabbitMQ, programat/cron, IMAP) pot de asemenea retransmite la repornire, astfel încât o rulare recuperată poate ocazional să se execute de două ori.

## Revizuire umană în așteptare

Rulările care se opun pentru aprobare [Human-in-the-Loop](./human-in-the-loop.md) sunt scrise imediat în istoric cu statusul `pending`.

- Nodul agent în așteptare stochează un payload de revizuire care include `reviewUrl`, `draftText` și `expiresAt`
- Orice noduri conectate la handle-ul `review` al agentului pot rula de asemenea înainte ca omul să răspundă, iar rezultatele nodurilor lor sunt stocate în aceeași intrare de istoric în așteptare
- Dialogurile de istoric afișează linkul de revizuire, astfel încât proprietarii îl pot copia sau deschide
- Dialogurile de istoric și panoul Debug al editorului afișează decizia umană finală după ce rularea se reia
- Când un revizor acceptă, editează sau refuză schița, aceeași intrare de istoric este actualizată cu rezultatul final al execuției
- Dacă aceeași rulare se opune pentru HITL de mai multe ori, intrarea de istoric rămâne aceeași, în timp ce fiecare punct de verificare primește propriul link de revizuire unic

Acest lucru este deosebit de util pentru rulările de portal și workflow-urile de lungă durată care pot aștepta ore sau zile înainte de a continua.

## Copiere

Folosiți **Copy** lângă Inputs sau Outputs pentru a copia JSON-ul în clipboard.

## Ștergerea istoricului

- **Per workflow**: În dialogul de istoric al Editorului, faceți clic pe **Clear history** pentru a elimina rulările pentru workflow-ul curent.
- **Tot istoricul**: În dialogul de istoric al Dashboard/Evals, faceți clic pe **Clear all history** pentru a elimina toate înregistrările de execuție pe care le dețineți. Rulările din workflow-urile partajate sunt păstrate. Această acțiune nu poate fi anulată.

## Detalii despre cronologia execuției

Când **Execution Log** al editorului este deschis, faceți clic pe butonul de cronometru pentru a afișa cronologia execuției. Selectați un interval pentru a deschide un inspector de detalii inline care preia zona rândurilor. Acesta afișează statusul pasului selectat, durata, numărul de încercări, informațiile despre reîncercare, erorile, trace ID-ul și o previzualizare compactă a rezultatului. Rezultatele de tip obiect și array folosesc același vizualizator `JsonTree` ca restul panoului Debug; valorile scalare folosesc o previzualizare text. Când un pas produce imagini (capturi de ecran Playwright, imagini generate, fișiere imagine), acestea apar ca miniaturi deasupra rezultatului, iar JSON-ul afișează un scurt substituent în locul base64 brut. Faceți clic pe o miniatură pentru a o deschide într-o casetă lightbox; butoanele cu săgeți sau tastele ←/→ parcurg fiecare imagine din rulare, cu un contor precum `2 / 5`. Folosiți **Open trace** pentru span-urile LLM și Agent atunci când un trace ID este disponibil.
## Detalii nod pe mobil

Pe un telefon, editorul afișează un arbore de workflow pe ecran complet în locul canvasului liber. Atingeți un nod din arbore care are un rezultat înregistrat pentru a-i deschide execuția ca detaliu pe ecran complet. Vizualizarea oferă file separate **Input Data**, **Output Data** și **Errors**. Fila de output afișează rezultatul înregistrat și oferă **Copy Output**; fila de input afișează configurația nodului selectat, iar fila de erori afișează eroarea înregistrată atunci când nodul a eșuat. Utilizați **Back to workflow** sau butonul de închidere pentru a reveni la arbore.

Dialogurile de istoric din canvas și dashboard păstrează controalele de rulare pe un singur rând și plasează filtrele disponibile de etichete și instanțe într-o grilă adaptivă. Meniurile lor de filtrare folosesc același selector din aplicație, astfel încât bifa selectată are o margine și o linie de bază consecvente cu fiecare etichetă de opțiune.

## Related

- [Triggers](./triggers.md) – Cum sunt pornite workflow-urile; istoricul înregistrează `trigger_source` (inclusiv `board` pentru rulările pornite de mutările de carduri din [Board](../tabs/board-tab.md) și follow-up-uri)
- [Human-in-the-Loop](./human-in-the-loop.md) – URL-uri de revizuire în așteptare și comportamentul de reluare
- [Edit History](./edit-history.md) – Controlul versiunilor pentru salvările de workflow (revert, diff)
- [Quick Start](../getting-started/quick-start.md) – Construiți și rulați primul dumneavoastră workflow
- [Workflows Tab](../tabs/workflows-tab.md) – Creați și gestionați workflow-uri
