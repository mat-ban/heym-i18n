# Dashboard

Fila **Dashboard** este un spațiu de tip Grafana în care construiți grile de widgeturi grafice. Fiecare widget este randat din rezultatul propriului său workflow Heym ascuns, astfel încât orice dată pe care o puteți produce într-un workflow — interogări de baze de date, apeluri API, căutări RAG, rezultate LLM — poate deveni un grafic. Puteți păstra mai multe dashboarduri și partaja fiecare dintre ele cu persoane sau echipe.

## Dashboarduri

Toată lumea începe cu un dashboard, creat prima dată când deschide fila. Utilizați selectorul de dashboarduri din partea de sus a filei pentru a comuta între dashboarduri, iar **+** de lângă el pentru a crea unul nou. Selectorul listează mai întâi dashboardurile dumneavoastră, apoi pe cele partajate cu dumneavoastră, etichetate cu numele persoanei care le-a partajat.

Fila redeschide dashboardul pe care l-ați utilizat ultima dată, iar bara de adrese conține dashboardul deschis (`?tab=dashboard&dashboard=<id>`), astfel încât un link deschide exact acel dashboard pentru oricine are acces la el.

Butonul de setări (doar pentru proprietari) redenumește dashboardul, stabilește ce înregistrări acceptă ca [pagină de detalii](#detail-pages), gestionează partajarea și îl șterge. Ștergerea unui dashboard elimină widgeturile sale și workflowurile acestora. Păstrați întotdeauna cel puțin un dashboard propriu, astfel încât ultimul nu poate fi șters.

## Widgeturi

Un widget este un singur grafic pe grilă. Tipuri de grafice acceptate:

- **Bar** (vertical sau orizontal)
- **Line**
- **Area** (tendință umplută, acceptă mai multe serii)
- **Pie**
- **Table** (derulabil; faceți clic pe antetul unei coloane pentru a sorta crescător și faceți clic din nou pentru a sorta descrescător. O coloană poate fi afișată ca [cipuri de stare](../nodes/chart-output-node.md#status-chips), o coloană poate conține [butoane de link](../nodes/chart-output-node.md#link-buttons) care deschid un URL într-o filă nouă, iar rândurile pot deschide o [pagină de detalii](#pagini-de-detalii))
- **Numeric** (o singură valoare KPI cu unitate opțională)
- **Gauge** (o singură valoare raportată la un interval min–max, de ex. un procent)
- **Scatter** (puncte X/Y pentru grafice de corelație)
- **Proportion** (o bară împărțită în cote cu o legendă procentuală, de ex. o defalcare pe limbi)
- **Bar gauge** (un gauge orizontal pe rând cu un gradient roșu→verde și o valoare, de ex. spațiu liber pe disc)
- **Text** (un mesaj markdown, de ex. o notă de stare precum „Ultima execuție la 19:47"; acceptă [casete de selectare interactive](../nodes/chart-output-node.md#interactive-task-lists) când markdownul este static și [liste numerotate explicite](../nodes/chart-output-node.md#numbered-lists) pentru numerotare personalizată sau descendentă)
- **HITL** (recenziile dumneavoastră umane în așteptare. Antetul afișează `1/n pending`. Numele workflowului deschide acea execuție pe canvas. **Approve**, **Request changes** și **Reject** o rezolvă. Pictograma de istoric de lângă titlul widgetului deschide acea execuție în dialogul de istoric de pe această pagină. Widgetul nu utilizează rânduri din amonte, iar fiecare persoană își vede propria coadă. În schimb, poate afișa verificările unui singur Workflow, pentru toți cei care pot deschide acel Workflow; vedeți [Widget-uri HITL](#widget-uri-hitl))

Pe lângă grafice, un widget **Run a workflow** rulează unul dintre workflowurile dvs. direct din dashboard: pe un fișier plasat, cu câmpurile sale de intrare sau cu un buton Run; consultați [Widgeturi de rulare](#run-widgets).

Fiecare widget își încarcă datele asincron când deschideți fila, astfel încât pagina rămâne receptivă în timp ce graficele se populează.

## Adăugarea unui widget

1. Faceți clic pe **Add widget**, acordați-i un titlu și alegeți un tip de grafic. Sub selector, dialogul desenează un exemplu al acelui tip de grafic cu date eșantion și numește rândurile pe care le așteaptă, astfel încât să puteți compara tipurile înainte de a construi ceva.
2. Widgetul se deschide în editorul de workflowuri cu un graf inițial: un nod [Set](../nodes/set-node.md) care produce rândurile, conectat la un nod [Chart Output](../nodes/chart-output-node.md). Înlocuiți nodul Set cu orice sursă de date. Un widget **HITL** este doar nodul Chart Output; acesta citește recenziile dumneavoastră în așteptare și nu necesită o sursă de date.
3. Construiți workflowul astfel încât nodul care alimentează **Chart Output** să producă un array de rânduri, apoi configurați maparea câmpurilor nodului Chart Output (câmpul etichetă, câmpul valoare etc.).
4. Salvați, reveniți la fila Dashboard, iar widgetul se randează.

Pentru un widget **Run a workflow**, alegeți în schimb workflowul pe care îl rulează; selectorul indică modul în care widgetul îl va rula pe fiecare. Widgetul este adăugat direct în grilă; nu există niciun workflow nou de construit.

Faceți dublu clic pe un widget (sau utilizați butonul său de editare) pentru a-i redeschide workflowul oricând. Utilizați **Clone widget** în antetul widgetului pentru a duplica atât widgetul, cât și workflowul său complet. Copia este plasată sub original și etichetată cu **(Copy)**, astfel încât să o puteți edita independent.

## Widget-uri HITL

Un widget HITL nou afișează fiecare verificare care așteaptă în coada dvs. proprie. Pentru a afișa doar verificările unui Workflow, deschideți **Setări** ale widget-ului:

1. La **Workflow**, alegeți Workflow-ul. Lista conține Workflow-urile pe care le puteți deschide, ale dvs. sau partajate cu dvs. ori cu echipa dvs., care au un pas ce așteaptă o persoană: un Agent cu verificare umană sau un pas Slack de aprobare, butoane ori formular. Pictograma de lângă el deschide acel Workflow într-o filă nouă.
2. Dacă Workflow-ul are un singur astfel de pas, acesta este ales automat. Dacă are mai multe, **Select agent** le listează după numele nodului, cu **All agents** primul; pașii Slack sunt marcați cu **(Slack)**.
3. Salvați. `1/n pending` din antet numără doar aceste verificări. Alegeți **Toate Workflow-urile** pentru a afișa din nou coada dvs. proprie.

Aceeași alegere există pe canvas, în proprietățile nodului Chart Output. **Rafinați cu AI** o poate face („afișează doar aprobările de facturi”), la fel ca descrierea unui widget nou care numește Workflow-ul. Fiecare modificare este o editare a Workflow-ului, deci apare în Edit History.

- **Cine vede verificările.** Un widget filtrat pe un Workflow afișează verificările acelui Workflow tuturor celor care pot deschide Workflow-ul, iar aceștia pot aproba, solicita modificări sau respinge din el, la fel cum ar putea rula Workflow-ul. Un widget nefiltrat afișează fiecărei persoane propria coadă.
- **Cine vede widget-ul.** Cine nu poate deschide Workflow-ul ales nu vede deloc widget-ul, nici măcar pe un dashboard partajat cu persoana respectivă. Când proprietarul dashboard-ului pierde accesul la Workflow sau acesta este șters, proprietarul vede „You no longer have access to the workflow this widget shows” și poate alege altul în **Setări**.
- **Doar alegeri accesibile.** Un Workflow pe care nu îl puteți deschide este refuzat la salvarea widget-ului, fie din setări, de pe canvas sau prin AI.

## Pagini de detalii

Un widget de tip tabel își poate lega rândurile de un alt dashboard, care funcționează apoi ca o pagină de detalii: un singur dashboard care deservește fiecare client, factură sau tichet.

1. Deschideți **Settings** pentru widgetul tabel și alegeți dashboardul sub **Row link**.
2. Introduceți **Record column**, coloana a cărei valoare identifică rândul (de exemplu `id`), și opțional o **Label column** care îl denumește (de exemplu `name`).
3. Salvați. Făcând clic pe un rând (sau focalizându-l și apăsând Enter) se deschide dashboardul asociat cu `?record=<value>&label=<name>`.

Pe dashboardul de detalii, fiecare workflow al unui widget citește valoarea ca `$page.record` (consultați [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), iar pagina afișează `Dashboard / <label>` deasupra grilei, împreună cu un buton pentru ștergerea înregistrării. Butonul Înapoi revine la tabelul din care ați plecat.

- **Cine o poate deschide.** Rândurile pot fi accesate prin clic doar de către vizualizatorii care pot deschide dashboardul asociat. Ceilalți văd același tabel fără linkuri.
- **Formatul înregistrării.** Înregistrarea provine din URL, astfel încât dashboardul de detalii decide ce acceptă. În setările sale, **Detail page records** este una dintre opțiunile: ID-uri (litere, cifre, `-`, `_` și `.`, până la 128 de caractere; valoarea implicită), numere, UUID-uri sau adrese de e-mail. Orice altă valoare este refuzată înainte ca un widget să ruleze, iar widgeturile afișează „This page does not accept that record".
- **Tot rularea proprietarului.** Widgeturile rulează ca proprietar al dashboardului și pe o pagină de detalii. Creatorii ar trebui să transmită `$page.record` doar acolo unde un nod face escape valorii, niciodată direct în textul unei interogări.
- **Memorarea în cache.** Fiecare widget își memorează în cache graficul per înregistrare, pentru aceeași durată de viață (TTL) ca și widgetul, și păstrează cele mai recente 50 de înregistrări utilizate.

## Widgeturi de rulare

Un widget **Run a workflow** rulează unul dintre workflowurile dvs. și afișează rezultatul: starea, durata de rulare și ieșirile. Ceea ce afișează depinde de datele de intrare pe care le primește workflowul:

- **Un fișier.** Pentru un workflow care începe cu un [File Upload Trigger](../nodes/file-upload-trigger-node.md), plasați un fișier pe acesta (sau faceți clic pentru a alege unul), iar widgetul îl încarcă prin linkul de încărcare de unică folosință al triggerului. Widgetul afișează tipurile și dimensiunea fișierelor pe care le acceptă triggerul și le refuză pe celelalte înainte de încărcare. Când workflowul începe și cu un nod Text Input, widgetul afișează câmpurile acestuia lângă zona de plasare: alegeți un fișier, completați câmpurile, iar **Run** le trimite pe amândouă. Valorile călătoresc împreună cu linkul de încărcare generat de widget, astfel încât un link de încărcare partajat nu le poate seta.
- **Câmpuri de intrare.** Pentru un workflow care începe cu un nod Text Input, widgetul își afișează câmpurile cu valorile lor implicite; **Run** rulează workflowul cu valorile dvs. Valorile pentru câmpurile pe care workflowul nu le are sunt ignorate.
- **Nimic.** Un workflow fără intrări primește un buton **Run**.

Butonul **Wrap** al rezultatului încadrează liniile lungi de ieșire în interiorul casetei; dezactivați-l pentru a citi aspectul JSON al ieșirii.

- Oricine poate deschide dashboardul poate rula widgetul, la fel cum oricine poate reîmprospăta un grafic. Accesul la workflow aparține proprietarului dashboardului: adăugarea widgetului necesită un workflow pe care atât dvs., cât și proprietarul îl puteți rula, iar rularea în sine folosește credențialele proprietarului workflowului, ca orice link de încărcare.
- Rezultatul rămâne pe ecranul dvs. până când părăsiți pagina; ceilalți vizualizatori nu văd fișierele, valorile sau rezultatele dvs. Rularea apare în istoricul execuțiilor cu triggerul `dashboard`.
- Partajarea unui dashboard nu acordă niciodată acces la workflowul în sine. **Edit workflow** îl deschide pentru persoanele care au deja acces, iar **Fine-tune with AI** nu este oferit.
- Rulările cu fișiere se execută pe instanța principală, unde sunt stocate fișierele încărcate, la fel ca orice rulare File Upload Trigger.

## Generarea unui widget cu AI

Faceți clic pe **AI**, descrieți metrica dorită (de exemplu, „rata de succes a workflowurilor din ultimele 30 de zile ca grafic cu bare") și alegeți o credențială LLM și un model. Heym generează un workflow complet de widget care se încheie cu un nod Chart Output și îl adaugă pe grilă. Consultați [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) pentru exemple de prompturi pe tip de grafic.

Widget-ul primește un titlu scurt de unul sau două cuvinte în limba cererii dvs., de exemplu „Cazuri deschise”. Un titlu nu conține niciodată id-ul unui tabel de date; când modelul numește widget-ul printr-o propoziție, Heym păstrează primele cuvinte ale acesteia.

API-ul de widget-uri poate crea și un **card de numărare** fără AI: un widget `text` pe un tabel de date (`data_table_id`) cu `count_column` și `count_value` afișează câte rânduri au acea valoare; titlul widget-ului numește valoarea. Heym Work deschide paginile create dintr-un tabel de date cu un card de numărare pentru fiecare status.

Utilizați butonul **Fine-tune with AI** al unui widget pentru a revizui un widget existent cu o nouă instrucțiune. Fiecare ajustare AI salvează instantaneu workflowul anterior în **Edit History** al widgetului, astfel încât să puteți examina sau reveni asupra modificărilor din editorul de workflowuri.

## Editarea aspectului

Comutați **Edit** pentru a intra în modul de editare, unde puteți trage widgeturile și le puteți redimensiona pe o grilă de 12 coloane. Modificările de aspect sunt salvate automat. Titlurile widgeturilor sunt editabile inline din antetul widgetului.

## Memorare în cache și reîmprospătare

Fiecare widget își memorează în cache pe server ultimele date calculate pentru o durată de viață (TTL) configurabilă. Cât timp cache-ul este proaspăt, redeschiderea dashboardului servește rezultatul stocat în loc să reexecute workflowul. Cache-ul este înlocuit pe loc de fiecare dată când datele sunt recalculate (un cache per widget, plus unul per înregistrare pe o [pagină de detalii](#detail-pages)) și este invalidat automat când editați workflowul widgetului.

Utilizați butonul **Refresh** al unui widget (sau **Refresh** din bara de instrumente) pentru a ocoli cache-ul și a recalcula imediat.
## Partajare

Proprietarii partajează un dashboard din setările acestuia, cu utilizatori individuali (prin email) sau cu orice [echipă](teams-tab.md) din care fac parte. Fiecare partajare este **Read** sau **Write**; atunci când cineva are atât o partajare personală, cât și una de echipă, se aplică cea mai puternică.

| Acțiune | Proprietar | Write | Read |
|--------|:-----:|:-----:|:----:|
| Vizualizarea widgeturilor, reîmprospătarea acestora, utilizarea reîmprospătării automate | ✓ | ✓ | ✓ |
| Deschiderea paginilor de detalii, rularea widgeturilor de rulare | ✓ | ✓ | ✓ |
| Adăugarea, clonarea, ștergerea, redenumirea și redimensionarea widgeturilor; generarea și ajustarea fină cu AI; bifarea elementelor din checklist | ✓ | ✓ | |
| Deschiderea workflow-ului unui widget în editor | ✓ | ✓ | |
| Redenumirea sau ștergerea dashboard-ului, setarea formatului înregistrării, gestionarea partajării | ✓ | | |

**Widgeturile rulează întotdeauna ca proprietar al dashboard-ului.** Indiferent cine vizualizează, un widget utilizează credențialele și variabilele globale ale proprietarului, iar execuțiile sale apar în istoricul de execuție și în traces-urile proprietarului. Astfel, colegii de echipă văd aceleași date fără a avea acces la conturile din spatele acestora, iar fiecare vizualizator partajează același rezultat cache-uit per widget. Widgeturile pe care le adaugă sau le clonează un colaborator cu drept de scriere aparțin de asemenea proprietarului.

Din acest motiv, **Write** implică același nivel de încredere ca partajarea unui workflow pentru editare: un colaborator cu drept de scriere poate modifica ceea ce rulează cu credențialele dumneavoastră. Acordați acest drept doar persoanelor cărora le-ați permite să editeze workflow-urile dumneavoastră. O execuție de test pe care un colaborator o pornește din editorul de workflow utilizează propriile credențiale, ca în cazul oricărui workflow partajat; doar dashboard-ul în sine rulează ca proprietar. **Read** nu acordă acces la workflow-urile widgeturilor, iar vizualizatorii cu drept de citire primesc graficul în sine, dar nu și detaliile de execuție per nod din spatele acestuia.

Eliminarea unei partajări sau reducerea acesteia de la write la read produce efecte imediat.

## Resurse conexe

- [Nodul Chart Output](../nodes/chart-output-node.md)
- [Fila Analytics](analytics-tab.md) — metrici de execuție integrate (diferite de dashboard-urile create de utilizatori)