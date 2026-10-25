# Asistent AI

**Asistentul AI** este un panou de chat care se deschide din panoul Debug și apare în colțul din dreapta jos al editorului. Trageți antetul pentru a-l muta și trageți de o margine sau de un colț pentru a-i modifica lățimea sau înălțimea. Nu se va micșora sub 360×480 pixeli. Poziția și dimensiunea sunt reținute în acest browser. Opțiunea **Reset position and size** din antet readuce panoul în colțul din dreapta jos. Folosiți limbajul natural pentru a crea sau modifica workflow-uri—descrieți ce doriți, iar AI-ul generează noduri și muchii care sunt aplicate pe canvas.

Pentru întrebări legate de documentație în afara editorului, folosiți [Chat with Heym](./chat-with-heym.md). Acea interfață este optimizată pentru ajutor de produs conștient de pagină, în locul generării de workflow-uri.

## Deschiderea panoului

1. Deschideți un workflow în editor
2. Localizați **Debug panel** în partea de jos (zona cu rezultatele execuției)
3. Faceți clic pe butonul **AI** (pictograma Sparkles) din bara de instrumente a panoului
4. Panoul Asistent AI se deschide în colțul din dreapta jos. Trageți antetul pentru a-l muta sau trageți de o margine ori de un colț pentru a-i modifica lățimea sau înălțimea.

Apăsați `Ctrl + I` / `Cmd + I` oriunde în editor pentru a deschide sau închide panoul — comanda rapidă funcționează chiar și atunci când un câmp de text este focalizat. Consultați [Keyboard Shortcuts](./keyboard-shortcuts.md).

Pentru a lucra pe un singur nod, treceți cu cursorul peste el pe canvas și faceți clic pe **AI** deasupra lui. Panoul se deschide focalizat pe acel nod. Consultați [Modificarea unui singur nod](#changing-one-node).

## Închiderea panoului

Faceți clic pe butonul **X**, apăsați `Ctrl + I` / `Cmd + I` sau comutați butonul **AI** din bara de instrumente a panoului Debug. Antetul mută panoul; nu îl închide.

## Configurare

Înainte de a trimite mesaje, selectați:

| Setare | Descriere |
|---------|-------------|
| **Credential** | Acreditare LLM (cheie API) din [Credentials](../tabs/credentials-tab.md) |
| **Model** | Numele modelului (de ex. `gpt-4o`, `gemini-2.5-flash`) |

Adăugați acreditări în [Credentials Tab](../tabs/credentials-tab.md). Lista de modele se încarcă din acreditarea selectată.

## Modul Agent vs modul Ask

Panoul are două moduri, comutate cu ajutorul cipului **Agent / Ask** din antetul panoului.

| Mod | Implicit | Comportament |
|------|---------|-----------|
| **Agent** | ✓ | Construiește și modifică canvas-ul. AI-ul generează un bloc JSON de workflow care este aplicat automat pe canvas la finalizarea răspunsului. |
| **Ask** | | Răspunde doar la întrebări. Canvas-ul nu este niciodată atins. Folosiți acest mod pentru a întreba despre workflow-ul dvs., despre funcționalitățile Heym sau pentru a primi sfaturi fără a declanșa o actualizare a canvas-ului. |

Comutați între moduri oricând. Schimbarea modului nu șterge conversația.

În modul Agent, caseta **YOLO mode** de sub câmpul de mesaj face ca asistentul să ruleze și să corecteze ceea ce construiește. Consultați [YOLO Mode](#yolo-mode).

## Utilizarea chat-ului

- Tastați cererea în câmpul de introducere (de ex. „Create a workflow that takes user input and sends it to an LLM")
- Apăsați **Enter** pentru a trimite (Shift+Enter pentru linie nouă)
- AI-ul transmite răspunsul în flux. În modul **Agent**, dacă răspunsul include un workflow într-un bloc de cod \`\`\`json, acesta este analizat automat și aplicat pe canvas. În modul **Ask**, canvas-ul nu este niciodată modificat.
- Folosiți **Clear** pentru a reseta conversația
- Treceți cu cursorul peste un mesaj și faceți clic pe pictograma de copiere pentru a copia textul afișat, inclusiv orice JSON de workflow
- Trageți linia de deasupra casetei de mesaj pentru a mări caseta. Zona de introducere poate crește până la 60% din panou și revine la înălțimea implicită la reîncărcarea paginii

## Aplicarea automată a workflow-ului

Când răspunsul AI conține un bloc JSON de workflow valid (cu `nodes` și, opțional, `edges`) într-un bloc de cod \`\`\`json, Heym:

1. Analizează JSON-ul din răspuns
2. Înlocuiește canvas-ul curent cu noile noduri și muchii
3. Aranjează aspectul nodurilor
4. Marchează workflow-ul ca nesalvat

Dacă analizarea eșuează, apare un buton **Retry** pentru a regenera răspunsul.

## Modificarea unui singur nod

Treceți cu cursorul peste un nod pe canvas și faceți clic pe **AI** deasupra lui. Panoul se deschide în modul Agent, focalizat pe acel nod, și arată ce nod modifică:

| Nodul are... | Panoul arată |
|---|---|
| Niciun rezultat în rularea curentă | **Modifying Node:** pe un rând compact cu pictograma și numele nodului. Asistentul editează exclusiv din configurația nodului; rulați nodul mai întâi dacă trebuie să vadă ieșirea |
| Un rezultat în rularea curentă | **Modifying Node: (Has Node Output)** deasupra nodului însuși: pictogramă, nume și tip, ultimul status și durata, și eroarea dacă a eșuat. Asistentul vede acea ieșire și eroarea atunci când editează nodul |

Treceți cu cursorul peste etichetă pentru a vedea în ce stare se află panoul.

În oricare stare a panoului, asistentul citește și pagina de documentație a nodului, din spatele pictogramei de carte din antetul nodului. O utilizează pentru a înțelege opțiunile nodului și a răspunde la întrebări despre acestea.

Sub mesaje, trei opțiuni pornesc solicitarea:

| Opțiune | Ce face |
|---|---|
| **Change this node as ...** | Completează caseta de mesaj cu *Modifică acest nod în* pentru a termina propoziția |
| **Fix error in this node ...** | Completează *Remediază eroarea din acest nod.* Asistentul citește eroarea acestui nod din ultima rulare |
| **Other** | Focalizează o casetă de mesaj goală |

Editați textul și apăsați **Send**. Asistentul returnează doar acest nod și Heym îl actualizează pe loc: nodul își păstrează id-ul, tipul și numele, astfel încât expresii precum `$checkLinkedIn.result` din alte noduri continuă să funcționeze. Alte noduri, conexiuni și aspectul nu se modifică, iar **Undo** restabilește configurația anterioară.

Dacă solicitarea nu se potrivește în nod, de exemplu necesită un alt tip de nod sau un nod nou, asistentul precizează ce ar trebui modificat în loc să editeze. Închideți focalizarea nodului cu **X** de pe cardul nodului pentru a edita din nou întregul workflow. Închiderea panoului șterge de asemenea focalizarea.

[Modul YOLO](#yolo-mode) funcționează cu un nod focalizat: asistentul modifică nodul, rulează workflow-ul și remediază nodul până când rularea reușește. În modul **Ask**, focalizarea îi indică asistentului despre ce nod este întrebarea dvs., iar canvasul nu este modificat.

## Modul YOLO

**Modul YOLO** permite asistentului să testeze ceea ce construiește. Bifați caseta **YOLO mode** de sub câmpul de mesaj, apoi trimiteți cererea. Caseta apare doar în modul Agent. Este dezactivată implicit și revine la starea dezactivată la reîncărcarea paginii. Treceți cu cursorul peste pictograma de informații de lângă ea pentru un scurt rezumat.

Cu modul YOLO activat, asistentul nu se oprește după ce aplică un workflow:

1. Aplică workflow-ul pe canvas.
2. Înainte de prima rulare, solicită date de test. Cardul listează câmpurile de intrare ale workflow-ului, completate cu valori sugerate de asistent. Editați-le și apăsați **Run**. Rulările ulterioare refolosesc aceste valori. Cardul reapare doar când câmpurile de intrare se modifică sau când asistentul are nevoie de date de test diferite.
3. Rulează workflow-ul pe canvas exact ca butonul **Run**: modificările nesalvate sunt salvate mai întâi, nodurile se aprind, iar rularea apare în panoul Debug și în [Execution History](./execution-history.md).
4. Citește rezultatul. Dacă rularea a făcut ceea ce ați cerut, se încheie cu **Verified** și un scurt rezumat. Dacă nu, corectează workflow-ul și îl rulează din nou.

Efectuează cel mult **5 rulări** per mesaj. Apăsați **Stop** oricând pentru a încheia bucla și a opri o rulare în curs.

Fiecare răspuns își afișează pașii pe măsură ce se produc:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, cu un rând `Executing <node>` pentru fiecare nod;
- verdictul final.

După fiecare rulare, o scurtă linie precum *Attempt 1 result sent · error in 1.2s* arată că rezultatul a fost trimis înapoi asistentului.
### Rularea celorlalte workflow-uri ale dvs.

În modul YOLO, asistentul poate rula și celelalte workflow-uri ale dvs. atunci când are nevoie de rezultatul acestora. De exemplu, poate verifica ce returnează un workflow înainte de a-l apela dintr-un nod [Execute](../nodes/execute-node.md). Aceste rulări apar ca pași `Running workflow "<name>"...` și sunt înregistrate în Istoricul execuțiilor cu sursa trigger-ului `ai_assistant`. Workflow-ul editat este întotdeauna testat pe canvas.

### Când se oprește prematur

| Situație | Ce se întâmplă |
|---|---|
| Asistentul are nevoie de o decizie, o informație, o acreditare sau un tabel de date | Solicită prin cardul de întrebare obișnuit. Răspunsul continuă bucla. |
| Rularea așteaptă o [verificare umană](./human-in-the-loop.md) | Bucla se oprește. Aprobați verificarea, apoi trimiteți un mesaj. |
| Workflow-ul așteaptă încărcarea unui fișier | Bucla se oprește. Modul YOLO nu poate testa rulările declanșate de încărcarea fișierelor. |
| O versiune mai nouă a workflow-ului a fost salvată în altă parte | Bucla se oprește. Rezolvați conflictul de salvare, apoi trimiteți un mesaj. |

> **Rulările sunt reale.** E-mailurile, mesajele și apelurile API din workflow sunt efectiv trimise la fiecare încercare, iar nodurile DataTable scriu rânduri reale. Fiecare rulare salvează workflow-ul, astfel încât versiunile anterioare rămân în [Istoricul editărilor](./edit-history.md).

## Introducere vocală

În browserele compatibile, un buton **Voice** activează conversia vorbirii în text. Faceți clic pentru a începe înregistrarea, faceți clic din nou pentru a o opri. Textul transcris este trimis către AI pentru corectarea gramaticală înainte de a-l trimite.

## Nodul Agent vs Asistentul AI

| | Nodul Agent | Asistentul AI |
|---|------------|---------------|
| **Scop** | Nod LLM în interiorul unui workflow; rulează în timpul execuției | Interfață Chat pentru construirea workflow-urilor cu limbaj natural |
| **Locație** | Nod pe canvas | Panou de depanare → panou flotant |
| **Când** | La runtime | În timpul editării |

Consultați [Nodul Agent](../nodes/agent-node.md) pentru nodul de workflow care execută apeluri LLM cu instrumente și MCP.

## Cum funcționează (AI Builder DSL)

Asistentul AI este alimentat de un **workflow DSL** (limbaj specific domeniului) care descrie noduri, muchii și expresii. Când trimiteți un mesaj:

1. Mesajul dvs. împreună cu [Regulile utilizatorului](./user-settings.md) și workflow-ul curent (dacă există) sunt trimise către backend.
2. Backend-ul construiește un **system prompt** care include:
   - DSL-ul complet al workflow-ului (tipuri de noduri, sintaxa expresiilor, reguli, exemple)
   - Regulile dvs. de utilizator adăugate ca "User Custom Rules"
   - JSON-ul workflow-ului curent atunci când editați un workflow existent
   - Lista workflow-urilor disponibile dacă utilizați nodul Execute
   - Numele, tipurile și ID-urile acreditărilor dvs. (niciodată valorile acestora)
   - Numele, ID-urile, descrierile și coloanele tabelelor de date pe care le puteți utiliza (niciodată rândurile acestora)
3. Modelul returnează un singur bloc JSON de workflow (cu `nodes` și `edges`). Frontend-ul îl analizează și îl aplică pe canvas.

### Acreditări

Atunci când un workflow are nevoie de o acreditare, asistentul întreabă înainte de a-l construi. Dacă aveți acreditări de un tip potrivit, le listează împreună cu **Create a new credential**; dacă nu aveți niciuna, întreabă dacă doriți să creați una. Fiecare întrebare vă permite, de asemenea, să continuați fără o acreditare.

Alegerea de a crea una deschide formularul de acreditare în panou, presetat cu tipul corect și un nume sugerat. Valorile ajung direct la Heym; asistentul află doar numele și tipul. Acreditările OAuth (Google Sheets, Google Drive, BigQuery, Linear, Notion) se conectează într-o fereastră popup, iar un link către pagina de autorizare apare în caz că popup-ul este blocat. Odată ce acreditarea este salvată, cardul afișează numele acesteia și butonul de creare se dezactivează; apăsați **Submit answers** și asistentul plasează noua acreditare pe nod.

De asemenea, puteți solicita o acreditare separat ("create a GitHub credential") sau puteți cere modificarea uneia pe care o dețineți ("update my sheet credential", "reconnect my Google Sheets"). Asistentul răspunde cu același card: crearea deschide un formular gol, actualizarea deschide formularul pe acea acreditare cu secretele mascate.

Asistentul preferă un nod dedicat. Când niciun nod nu acoperă o operațiune, cum ar fi adăugarea unui tab la un Google Sheet, acesta utilizează o cerere HTTP și scrie linia de antet pentru acreditarea aleasă. Consultați [HTTP › Autentificare cu acreditări](../nodes/http-node.md#authenticating-with-credentials).

Întrebările de clarificare de care workflow-ul se poate dispensa afișează **Optional** în câmpul lor de introducere și pot fi omise.

DSL-ul impune etichete camelCase, reguli de expresie unificate și câmpuri specifice nodurilor. Dacă valoarea unui câmp este un singur `$expr`, backend-ul păstrează tipul nativ; dacă valoarea amestecă text cu `$refs`, rezultatul este un șir de caractere. Regula unui singur `$` se aplică în continuare: niciun `$` în interiorul parantezelor. Regulile de utilizator din [Setări](./user-settings.md) sunt injectate în acest system prompt, astfel încât preferințele dvs. se aplică fiecărui workflow generat de AI.

Dacă workflow-ul curent conține abilități Agent, Asistentul AI include doar `SKILL.md` al fiecărei abilități în acel context de workflow. Fișierele `.py` atașate și activele binare ale abilităților sunt eliminate înainte de cerere, astfel încât builder-ul să rămână în limitele de context ale modelului chiar și atunci când abilitățile conțin implementări mari.
### Tabele de date

Atunci când un workflow salvează, stochează sau caută înregistrări și nu ați numit un alt depozit, asistentul utilizează un nod [DataTable](../nodes/datatable-node.md). Dacă denumiți unul dintre tabelele dvs. și acesta are coloanele de care are nevoie workflow-ul, asistentul îl utilizează. În caz contrar, acesta întreabă ce tabel să utilizeze. Cardul listează tabelele care se potrivesc, fiecare cu descrierea și tipurile de coloane ale sale, plus **Creați un tabel nou** cu un nume și coloane propuse. Sunt oferite și tabelele partajate cu dvs.; unul pe care îl puteți doar citi este oferit doar pentru citire.

Selectați tabelul nou și apăsați **Trimiteți răspunsurile**: cardul creează tabelul, iar asistentul plasează id-ul acestuia pe nod și utilizează numele exacte ale coloanelor sale. De asemenea, puteți solicita un tabel separat, de exemplu „creați un tabel pentru clienții mei potențiali”.

Asistentul vede numele tabelelor, descrierile și coloanele, niciodată rândurile. Nu modifică niciodată coloanele unui tabel existent: dacă unui tabel îi lipsește o coloană de care are nevoie workflow-ul, acesta numește coloana și oferă în schimb un tabel nou. Adăugați coloane în [fila DataTable](../tabs/datatable-tab.md).

## Resurse conexe

- [De ce Heym](../getting-started/why-heym.md) – Construirea în limbaj natural ca prima etapă a ciclului de viață al agentului
- [Start rapid](../getting-started/quick-start.md) – Construiți primul dvs. workflow
- [Setări](./user-settings.md) – Reguli de utilizator injectate în prompt-ul de sistem al Asistentului AI
- [Chat cu Heym](./chat-with-heym.md) – Asistent conștient de pagină în zona de documentație
- [Concepte fundamentale](../getting-started/core-concepts.md) – Workflow-uri, noduri și flux de execuție
- [Nod Agent](../nodes/agent-node.md) – Nod LLM cu instrumente și MCP
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugați chei API pentru Asistentul AI
- [Structura workflow-ului](./workflow-structure.md) – Format JSON pentru workflow-uri
