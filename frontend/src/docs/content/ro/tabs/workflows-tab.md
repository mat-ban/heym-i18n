# Filă Workflows

Fila **Workflows** este vizualizarea implicită a panoului de control. Afișează lista de workflow-uri, structura de foldere și permite crearea, editarea și organizarea workflow-urilor.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Urmăriți demonstrația Workflows</a></p>

## Începeți o conversație

Deasupra listei de workflow-uri se află o casetă de chat care vă salută pe nume și vă întreabă ce doriți să automatizați. Introduceți un prompt, atașați opțional un fișier și selectați credentialul și modelul dorit. Ambele liste derulante sunt căutabile și pornesc de la [valorile implicite AI](../reference/user-settings.md).

Trimiterea creează o conversație nouă și o deschide în [fila Chat](./chat-tab.md), unde răspunsul este transmis în flux. Atașamentele acceptate sunt fișiere text, imagini și PDF-uri, câte unul per mesaj, la fel ca în compozitorul de chat.

Dacă nu aveți încă un credential LLM, caseta afișează un link către [fila Credentials](./credentials-tab.md), iar trimiterea rămâne dezactivată.

Faceți clic pe **x** pentru a ascunde caseta. Un buton **Ask AI** apare apoi lângă titlul Workflows și o readuce în vizualizare. Alegerea este reținută în browser.

## Lista de workflow-uri

Lista este o vizualizare cu două panouri: workflow-urile și folderele în stânga, o previzualizare a workflow-ului selectat în dreapta.

- Fiecare rând afișează pictograma workflow-ului, numele, descrierea, momentul ultimei actualizări și un [indicator de stare](#workflow-status)
- Workflow-urile pot fi în rădăcină sau în interiorul folderelor, iar workflow-urile fixate apar în propriul grup **Pinned** în partea de sus
- **Faceți clic** pe un rând pentru a-l selecta și a încărca previzualizarea în dreapta
- **Faceți dublu clic** pe un rând sau apăsați **Enter** în timp ce acesta este focalizat pentru a-l deschide în [editor](../getting-started/quick-start.md)
- Folosiți **Ctrl+clic** (sau **Cmd+clic**) pentru a deschide într-o filă nouă
- Fiecare rând are acțiunile de editare, copiere, fixare și ștergere în partea dreaptă. Pe telefoane acestea sunt ascunse pentru ca numele să ocupe întreaga lățime; **apăsați lung** pe un rând pentru a deschide foaia de acțiuni
- Fixați workflow-urile utilizate frecvent în [Quick Drawer](../reference/quick-drawer.md) pentru a le putea rula rapid din fila Workflows și din alte pagini interne

## Previzualizarea workflow-ului

Selectarea unui workflow umple panoul de previzualizare de lângă listă. Pe ecranele mai înguste de 1280px, același panou se deschide ca o foaie din partea de jos a ecranului.

Panoul afișează:

- Numele workflow-ului, cine l-a creat și când, și când a fost editat ultima dată
- **Open Workflow** – deschide workflow-ul în editor
- **Run Now** – deschide workflow-ul în [Quick Drawer](../reference/quick-drawer.md), unde completați datele de intrare și porniți execuția fără a părăsi lista
- **Description** – descrierea workflow-ului
- **Trigger Configuration** – programul pentru un workflow cron sau trigger-ul de ascultare pentru un workflow bazat pe evenimente. Workflow-urile care sunt invocate prin HTTP afișează un buton **Copy cURL** în locul endpoint-ului brut și al textului de autentificare: acesta copiază o cerere completă cu URL-ul corect, anteturile, substituentul de autentificare și un corp construit din câmpurile de intrare ale workflow-ului. Când workflow-ul publică un [portal](../reference/portal.md), linkul public de chat apare și aici
- **Last Run Details** – rezultatul și durata celei mai recente execuții sau o notă că workflow-ul nu a fost niciodată executat
- **Workflow Steps & Sub-agents** – nodurile în ordinea execuției, fiecare cu modelul, operația sau programul său și un punct care indică dacă este activ. Selectarea unui pas deschide acel nod în editor cu panoul său de proprietăți deja deschis

Panoul rămâne fixat lângă listă în timp ce derulați, astfel încât rămâne lizibil într-o listă lungă de workflow-uri.
## Administrarea la nivel de instanță

Conturile enumerate în `HEYM_ADMIN_EMAILS` pot lista, deschide, edita, inspecta istoricul execuțiilor și șterge orice workflow de pe instanță fără partajare sau transfer de proprietate. Această setare este o listă de adrese de email separate prin virgulă, comparate fără a ține cont de majuscule/minuscule. O listă goală nu acordă nimănui acest acces. Reporniți backend-ul după modificarea acesteia.

Administratorii văd adresa de email a proprietarului în lista de workflow-uri și pot căuta după acea adresă. Selectați un workflow pentru a deschide **Instance administration** în previzualizarea acestuia:

1. **Pause triggers** este afișat doar pentru workflow-urile care conțin un nod Cron. Această acțiune dezactivează Cron-ul workflow-ului și alte noduri de declanșare automată printr-o salvare versionată normală. Execuțiile existente se pot finaliza. Apelurile manuale, API, portal și sub-workflow rămân disponibile; această acțiune nu este o blocare a execuției la nivelul întregului workflow.
2. Butonul se schimbă în **Resume triggers** în timp ce este în pauză, inclusiv după reîncărcarea paginii. Resume reactivează trigger-ele puse în pauză de administrator și lasă neschimbate trigger-ele care erau deja dezactivate. Pentru workflow-urile mai vechi puse în pauză fără o stare de pauză administrativă salvată, Resume activează trigger-ele lor automate.
3. Utilizați acțiunea **Delete workflow** din rândul workflow-ului după ce execuțiile s-au încheiat. Ștergerea returnează un conflict cât timp există lucrări în execuție, în coadă sau în așteptarea revizuirii. Ștergerea programată aplică aceeași verificare.

Puneți trigger-ele în pauză și lăsați execuțiile existente să se finalizeze înainte de ștergere. Un trigger deja expediat în momentul punerii în pauză se poate finaliza în continuare. Utilizați ștergerea atunci când workflow-ul nu mai trebuie să fie apelabil.

Secretele webhook și setările de autentificare exclusiv ale proprietarului își păstrează protecțiile existente. Administrarea nu transferă proprietatea și nu partajează înregistrările de credențiale ale proprietarului. Acțiunile administrative de pauză, reluare, ștergere și programare apar în [audit trail](../reference/audit.md) împreună cu administratorul care acționează și proprietarul workflow-ului.

## Starea workflow-ului

Fiecare rând poartă un chip de stare derivat din nodurile de declanșare ale workflow-ului, starea sa de execuție live
și — pentru workflow-urile fără nod de declanșare — modul în care a fost pornită cea mai recentă execuție a sa:

| Stare | Semnificație |
| --- | --- |
| **Running** | Workflow-ul are o execuție în curs chiar acum |
| **Scheduled** | Are un trigger [cron](../nodes/cron-node.md) activ |
| **Listening** | Are un trigger de eveniment activ, cum ar fi un trigger Slack, Telegram, IMAP sau WebSocket |
| **Paused** | Are noduri de declanșare, dar toate sunt dezactivate |
| **API** | Nu are noduri de declanșare și a fost rulat ultima dată printr-un apel HTTP către endpoint-ul său de execuție |
| **SubWorker** | Nu are noduri de declanșare și a fost rulat ultima dată ca sub-workflow de către un workflow părinte |
| **Portal** | Nu are noduri de declanșare și a fost rulat ultima dată din [portal](../reference/portal.md) |
| **WEB** | Nu are noduri de declanșare și singurul său terminal este un [HTML output mapper](../nodes/html-output-mapper-node.md), astfel încât apelarea sa returnează o pagină web randată |
| **Manual** | Nu are noduri de declanșare și nu a rulat niciodată, sau ultima sa rulare a venit din altă parte |
| **Remove Scheduled** | Este [programat pentru ștergere](../reference/workflow-organization.md) |

Chip-urile API, SubWorker și Portal citesc singura intrare cea mai recentă din
[istoricul execuțiilor](./logs-tab.md) al workflow-ului, astfel încât un workflow care este apelat în două moduri afișează pe cel care a venit ultimul. **WEB** este decis din graf, în schimb, deci are prioritate față de acestea trei: un workflow care servește pagini afișează WEB chiar și după ce a fost apelat prin HTTP. Nodurile de declanșare au întotdeauna prioritate față de toate acestea: un workflow cron pe care cineva îl apelează și prin HTTP rămâne **Scheduled**.

Utilizați meniul derulant **Status** de lângă câmpul de căutare pentru a afișa doar o singură stare. Meniul derulant listează câte workflow-uri corespund în prezent fiecăreia. Un filtru de stare ajunge și în interiorul folderelor: folderele cu o potrivire sunt extinse automat, iar folderele fără una sunt ascunse până când ștergeți filtrul.

## Workflow-uri active

Pe desktop, badge-ul circular din bara de instrumente superioară arată câte workflow-uri rulează în prezent
și se reîmprospătează automat la fiecare 10 secunde. Faceți clic pe un badge diferit de zero pentru a deschide lista
workflow-urilor active, care afișează până la patru rânduri înainte de derulare. Selectați numele unui workflow pentru a atașa
editorul la vizualizarea live a acelei execuții. Badge-ul zero este informativ și nu poate fi deschis, iar
badge-ul este ascuns pe ecranele mobile.

## Căutare

Utilizați câmpul de căutare a workflow-urilor de lângă **Status**, sau apăsați **Ctrl+F** (sau **Cmd+F**), pentru a filtra workflow-urile după titlu sau descriere. Workflow-urile care corespund în interiorul folderelor sunt afișate cu ramurile folderelor extinse. Apăsați **Escape** pentru a șterge căutarea.
## Dosare

- Organizați workflow-urile în [dosare și subdosare](../reference/workflow-organization.md)
- Creați dosare cu butonul **New Folder**, atribuind fiecăruia un nume și o descriere opțională afișată sub numele său în listă
- Fiecare rând de dosar afișează câte workflow-uri conține, incluzând subdosarele, alături de acțiunile sale de creare subdosar, redenumire, schimbare pictogramă, descărcare ca ZIP și ștergere. Pe telefoane, rândul afișează un singur buton de meniu
- Trageți un workflow peste un dosar sau subdosar pentru a vedea o previzualizare a destinației de dimensiunea unui card. Previzualizarea evidențiată afișează calea completă a dosarului înainte de a plasa, iar trecerea cu cursorul peste un dosar restrâns îl extinde scurt pentru a putea ajunge la dosarele imbricate.
- Trageți workflow-uri între dosare sau către rădăcină. Cardul tras rămâne vizibil ca o umbră, iar destinația activă rămâne evidențiată în timp ce derulați.
- Plasarea unui workflow înapoi în dosarul său curent este dezactivată și marcată **Already in Folder**.
- Redenumiți un dosar sau modificați-i descrierea din acțiunea sa de redenumire sau din meniul contextual al clicului dreapta

## Crearea workflow-urilor

1. Faceți clic pe **New Workflow**
2. Introduceți un nume și o descriere opțională
3. Workflow-ul se deschide în editor

## Import

Trageți și plasați un fișier JSON de workflow în zona de workflow-uri pentru a crea un workflow nou. Nodurile și muchiile importate sunt utilizate pentru a crea workflow-ul; numele provine din câmpul `name` din JSON sau din numele fișierului. Consultați [Download & Import](../reference/download-import.md) pentru formatul JSON și opțiunile de import.

## Partajare

Deschideți un workflow în editor și faceți clic pe **Share** pentru a invita utilizatori prin email sau pentru a partaja cu o [echipă](./teams-tab.md). Alegeți **Read** (vizualizare și rulare) sau **Write** (de asemenea editare) pentru fiecare utilizator sau echipă și modificați ulterior din lista derulantă de lângă intrare. Credențialele și sub-workflow-urile nu sunt partajate automat; partajați-le separat cu aceiași utilizatori sau echipe. Consultați [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) și [Credentials Sharing](../reference/credentials-sharing.md).

## Editare și ștergere

- **Edit** – Modificați numele și descrierea workflow-ului din acțiunea de editare a rândului
- **Delete** – Workflow-urile sunt [programate pentru ștergere](../reference/workflow-organization.md); acestea se mută într-o zonă de coș de gunoi înainte de eliminarea permanentă

## Editări concurente

La salvare se trimite revizia pe care se bazează editările dumneavoastră, iar serverul respinge scrierea dacă workflow-ul s-a modificat între timp — de exemplu, pentru că un coleg l-a salvat sau ați lăsat același workflow deschis într-o a doua filă. Heym afișează apoi un dialog **Stale Workflow Detected** cu două opțiuni:

- **Cancel** – Păstrează modificările nesalvate în editor pentru a le putea reîncărca într-o altă filă și reconcilia
- **Override** – Salvează oricum, înlocuind versiunea celeilalte persoane

**Rularea** unui workflow îl salvează mai întâi, astfel încât trece prin aceeași verificare. Dacă workflow-ul s-a modificat sub dumneavoastră, rularea se oprește la dialog în loc să suprascrie silențios: **Override and Run** salvează versiunea dumneavoastră și pornește rularea, **Cancel Run** abandonează ambele și lasă editările dumneavoastră neatinse.

Verificarea face parte din cererea de salvare în sine, astfel încât nu costă un drum suplimentar și nu există nicio fereastră în care o salvare ar putea trece neobservată. Modificările dumneavoastră din altă parte a aplicației — o redenumire, o modificare de setări, o comutare în panoul de proprietăți — nu contează niciodată ca un conflict.

## Command Palette

Apăsați **Ctrl+K** (sau **Cmd+K**) pentru a deschide command palette. Puteți:
- Căuta workflow-uri după nume
- Naviga la orice [filă de dashboard](./credentials-tab.md)
- Deschide workflow-uri recente

## Asociate

- [Quick Start](../getting-started/quick-start.md) – Construiți primul dumneavoastră workflow
- [Workflow Organization](../reference/workflow-organization.md) – Dosare, subdosare și ștergere programată
- [Workflow Structure](../reference/workflow-structure.md) – Formatul JSON pentru workflow-uri
- [Download & Import](../reference/download-import.md) – Exportați și importați workflow-uri ca JSON
- [Portal](../reference/portal.md) – Expuneți workflow-uri ca interfețe publice de chat
- [Board](./board-tab.md) – Rulați workflow-uri din carduri kanban prin lanțuri de coloane
- [Core Concepts](../getting-started/core-concepts.md) – Workflow-uri, noduri și execuție
- [Execution History](../reference/execution-history.md) – Vizualizați rulările anterioare și Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Fixați și rulați workflow-uri din dashboard, documentație și alte pagini care nu sunt editorul
- [Contextual Showcase](../reference/contextual-showcase.md) – Ghid scurt de pagină pentru suprafețele dashboard-ului
