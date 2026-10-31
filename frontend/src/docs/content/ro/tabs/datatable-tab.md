# DataTable

Fila **DataTable** vă permite să creați și să gestionați tabele de date structurate direct în Heym. Tabelele pot fi utilizate în workflow-uri prin intermediul [nodului DataTable](../nodes/datatable-node.md) pentru operațiuni CRUD programatice.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>

## Crearea unui tabel

1. Navigați la fila DataTable din dashboard
2. Faceți clic pe **Create DataTable**
3. Introduceți un nume și o descriere opțională
4. Adăugați coloane cu ajutorul editorului de coloane

## Coloane

Fiecare coloană are:

| Proprietate | Descriere |
|----------|-------------|
| Name | Numele afișat al coloanei |
| Type | `string`, `number`, `boolean`, `date` sau `json` |
| Required | Dacă rândurile noi trebuie să includă această coloană |
| Unique | Dacă valorile trebuie să fie unice între rânduri |
| Default Value | Completat automat când un rând omite această coloană |

Adăugați, editați sau eliminați coloane din antetul vizualizării detaliate a tabelului.

## Generarea coloanelor cu AI

În loc să adăugați coloane manual, puteți descrie tabelul în limbaj natural (sau lipi un exemplu JSON) și lăsați un LLM să propună schema. Ambele puncte de intrare deschid același dialog:

- **Generate with AI** (antetul listei DataTable) — creează un tabel complet nou pe baza descrierii dumneavoastră.
- **AI columns** (vizualizarea detaliată a tabelului, lângă controalele coloanelor) — propune coloane *noi* care se adaugă la tabelul deschis.

### Cum funcționează

1. Selectați o **credentială LLM** și un **model** (implicit, prima dumneavoastră credentială LLM și cel mai recent model al acesteia).
2. Tastați o descriere — de exemplu *„Un tabel de cărți cu titlu, autor, număr de pagini și dacă am citit-o"* — sau lipiți un exemplu/schemă JSON.
3. Faceți clic pe **Generate**. Modelul returnează o schemă sugerată.
4. Verificați coloanele generate într-un formular editabil: modificați **name**, **type**, **default**, **unique** și **notEmpty** (obligatoriu) pentru fiecare, ștergeți coloanele nedorite sau folosiți **Add column** manual. Pentru un tabel nou, puteți edita și **name** și **description** sugerate de AI.
5. Faceți clic pe **Create Table** (tabel nou) sau **Add Columns** (tabel existent) pentru a salva. Apăsați **Esc** pentru a închide dialogul oricând.

### Doar adăugare pentru tabelele existente

Când generați coloane pentru un tabel existent, modelul vede coloanele dumneavoastră actuale ca context și propune **doar coloane noi**. Coloanele existente și datele lor nu sunt niciodată modificate sau eliminate — coloanele generate sunt adăugate. Numele duplicate (fără a ține cont de majuscule/minuscule) sunt eliminate automat.

> Este necesară o credentială LLM (OpenAI, Google sau Custom). Dacă nu aveți niciuna, adăugați mai întâi una în Settings.

## Gestionarea rândurilor

- **Adăugare rând**: Faceți clic pe butonul de adăugare pentru a crea un rând nou
- **Editare inline**: Faceți dublu clic pe orice celulă pentru a-i edita valoarea. Apăsați Enter sau faceți clic în altă parte pentru a salva, Escape pentru a anula
- **Ștergere rând**: Folosiți meniul de acțiuni al rândului pentru a elimina un rând
- **Paginare**: Rândurile sunt afișate câte 25 pe pagină, cu navigare între pagini

## Import/Export CSV

### Import
1. Faceți clic pe **Import CSV** în vizualizarea detaliată a tabelului
2. Selectați un fișier CSV pentru încărcare
3. Previzualizați primele 5 rânduri și maparea coloanelor
4. Coloanele verzi sunt asociate coloanelor existente ale tabelului; cele galbene sunt neasociate
5. Faceți clic pe Import pentru a insera rândurile în bloc

### Export
Faceți clic pe **Export CSV** pentru a descărca toate rândurile ca fișier CSV.

## Partajare

Partajați tabelele cu alți utilizatori sau echipe:

1. Deschideți dialogul de partajare din vizualizarea detaliată a tabelului
2. Adăugați utilizatori după email cu permisiune de **read** sau **write**
3. Adăugați echipe cu permisiune de **read** sau **write**
4. Utilizatorii doar-în-citire pot vizualiza datele; utilizatorii cu acces de scriere pot modifica rândurile și coloanele. Redenumirea tabelului, modificarea descrierii acestuia și gestionarea partajărilor rămân permise doar proprietarului.

## Crearea tabelelor din AI Assistant

[Asistentul AI](../reference/ai-assistant.md#data-tables) din canvas, [Chat](./chat-tab.md) și instrumentul `heym_chat` din [fila MCP](./mcp-tab.md) pot alege unul dintre tabelele dvs. pentru un workflow pe care îl construiesc sau pot crea unul nou. Acestea propun un nume și coloane și creează tabelul când trimiteți cardul de întrebări. Asistentul din canvas configurează nodurile de workflow din metadatele tabelului. Chat și `heym_chat` pot, de asemenea, să inspecteze rânduri, să adauge sau să elimine coloane și să introducă, să actualizeze sau să șteargă rânduri direct. Numiți-le un tabel sau linkul acestei file. Scrierile necesită calitatea de proprietar sau acces direct/de echipă de **scriere**. Adăugarea de coloane păstrează datele existente; eliminarea coloanelor șterge valorile acestora din fiecare rând. Eliminarea coloanelor și ștergerea tuturor rândurilor cer confirmare, similar acestei file.

## Utilizarea în workflow-uri

[Nodul DataTable](../nodes/datatable-node.md) conectează tabelele la workflow-uri. Operațiunile includ find, getAll, getById, insert, update, remove și upsert. Nu sunt necesare credentiale.

## Tabelul LLM Cost (tabel de sistem)

O secțiune fixată **System tables** apare deasupra tabelelor create de utilizator, cu o singură intrare: **LLM Cost Table**. Aceasta este o vizualizare cu schemă fixă, editabilă per utilizator, a prețurilor per model, utilizată de graficele de costuri din [Traces](./traces-tab.md).

### De unde provin datele

Heym menține un tabel global de prețuri per model, populat din endpoint-ul public de prețuri al Helicone (`https://www.helicone.ai/api/llm-costs`). Sincronizarea rulează în fundal prima dată când deschideți tabelul sau Traces și este limitată la o singură preluare la fiecare 24 de ore. Apăsați **Refresh** pentru a forța o resincronizare imediată. Elementele eliminate de Helicone din lista upstream nu sunt șterse local, astfel încât căutările istorice de costuri rămân stabile.

### Schemă (coloane read-only)

| Coloană | Semnificație |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informativ, utilizat de Helicone) |
| Model | Identificatorul modelului comparat cu `trace.model` |
| Op | Operator de potrivire: `equals`, `startsWith` sau `includes` |
| Input $/1M | USD per 1 milion de tokenuri de prompt |
| Output $/1M | USD per 1 milion de tokenuri de completare |
| Source | `helicone`, `seed` sau `user` |
### Personalizarea prețurilor

- **Editați un rând** pentru a suprascrie prețurile acestuia. Suprascrierea dumneavoastră este per-utilizator și este marcată cu insigna `Customized`; sincronizările viitoare Helicone nu o modifică.
- **Reset to default** elimină suprascrierea și restaurează valoarea globală pentru rândul respectiv.
- **Add Custom Model** deschide un dialog pentru a crea un rând exclusiv pentru utilizator (de exemplu, un model privat ajustat fin pe care Helicone nu îl listează). Rândurile personalizate sunt marcate `User added`, iar ștergerea lor le elimină complet.

### Potrivirea cu trace-uri

Când dashboard-ul Traces calculează costul, acesta potrivește fiecare `trace.model` cu:

1. Suprascrierile dumneavoastră (potrivire exactă pe numele modelului) mai întâi
2. În caz contrar, tabelul global — potrivirea exactă `equals` are prioritate față de `startsWith`/`includes`; egalitățile în cadrul aceluiași operator sunt rezolvate prin cel mai lung prefix/subșir de model care se potrivește

Dacă niciun rând nu se potrivește, modelul este listat sub notificarea **Unpriced models** din pagina Traces; contribuția sa la cost este zero până când adăugați un rând personalizat sau suprascrieți unul.

## Resurse conexe

- [DataTable Node](../nodes/datatable-node.md) - Referință pentru nodul de Workflow
- [Traces Tab](./traces-tab.md) - Utilizează LLM Cost Table pentru diagrama circulară a costurilor și cardurile KPI
- [Grist Node](../nodes/grist-node.md) - Alternativă de foaie de calcul externă
- [Variables Tab](./global-variables-tab.md) - Alternativă de stocare cheie-valoare