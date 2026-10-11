# Dashboard

Fila **Dashboard** este un spațiu de tip Grafana în care construiți grile de widgeturi grafice. Fiecare widget este randat din rezultatul propriului său workflow Heym ascuns, astfel încât orice dată pe care o puteți produce într-un workflow — interogări de baze de date, apeluri API, căutări RAG, rezultate LLM — poate deveni un grafic. Puteți păstra mai multe dashboarduri și partaja fiecare dintre ele cu persoane sau echipe.

## Dashboarduri

Toată lumea începe cu un dashboard, creat prima dată când deschide fila. Utilizați selectorul de dashboarduri din partea de sus a filei pentru a comuta între dashboarduri, iar **+** de lângă el pentru a crea unul nou. Selectorul listează mai întâi dashboardurile dumneavoastră, apoi pe cele partajate cu dumneavoastră, etichetate cu numele persoanei care le-a partajat.

Fila redeschide dashboardul pe care l-ați utilizat ultima dată, iar bara de adrese conține dashboardul deschis (`?tab=dashboard&dashboard=<id>`), astfel încât un link deschide exact acel dashboard pentru oricine are acces la el.

Butonul de setări (doar pentru proprietari) redenumește dashboardul, gestionează partajarea și îl șterge. Ștergerea unui dashboard elimină widgeturile sale și workflowurile acestora. Păstrați întotdeauna cel puțin un dashboard propriu, astfel încât ultimul nu poate fi șters.

## Widgeturi

Un widget este un singur grafic pe grilă. Tipuri de grafice acceptate:

- **Bar** (vertical sau orizontal)
- **Line**
- **Area** (tendință umplută, acceptă mai multe serii)
- **Pie**
- **Table** (cu derulare)
- **Numeric** (o singură valoare KPI cu unitate opțională)
- **Gauge** (o singură valoare raportată la un interval min–max, de ex. un procent)
- **Scatter** (puncte X/Y pentru grafice de corelație)
- **Proportion** (o bară împărțită în cote cu o legendă procentuală, de ex. o defalcare pe limbi)
- **Bar gauge** (un gauge orizontal pe rând cu un gradient roșu→verde și o valoare, de ex. spațiu liber pe disc)
- **Text** (un mesaj markdown, de ex. o notă de stare precum „Ultima execuție la 19:47"; acceptă [casete de selectare interactive](../nodes/chart-output-node.md#interactive-task-lists) când markdownul este static și [liste numerotate explicite](../nodes/chart-output-node.md#numbered-lists) pentru numerotare personalizată sau descendentă)
- **HITL** (recenziile dumneavoastră umane în așteptare. Antetul afișează `1/n pending`. Numele workflowului deschide acea execuție pe canvas. **Approve**, **Request changes** și **Reject** o rezolvă. Pictograma de istoric de lângă titlul widgetului deschide acea execuție în dialogul de istoric de pe această pagină. Widgetul nu utilizează rânduri din amonte, iar fiecare persoană își vede propria coadă)

Fiecare widget își încarcă datele asincron când deschideți fila, astfel încât pagina rămâne receptivă în timp ce graficele se populează.

## Adăugarea unui widget

1. Faceți clic pe **Add widget**, acordați-i un titlu și alegeți un tip de grafic. Sub selector, dialogul desenează un exemplu al acelui tip de grafic cu date eșantion și numește rândurile pe care le așteaptă, astfel încât să puteți compara tipurile înainte de a construi ceva.
2. Widgetul se deschide în editorul de workflowuri cu un graf inițial: un nod [Set](../nodes/set-node.md) care produce rândurile, conectat la un nod [Chart Output](../nodes/chart-output-node.md). Înlocuiți nodul Set cu orice sursă de date. Un widget **HITL** este doar nodul Chart Output; acesta citește recenziile dumneavoastră în așteptare și nu necesită o sursă de date.
3. Construiți workflowul astfel încât nodul care alimentează **Chart Output** să producă un array de rânduri, apoi configurați maparea câmpurilor nodului Chart Output (câmpul etichetă, câmpul valoare etc.).
4. Salvați, reveniți la fila Dashboard, iar widgetul se randează.

Faceți dublu clic pe un widget (sau utilizați butonul său de editare) pentru a-i redeschide workflowul oricând. Utilizați **Clone widget** în antetul widgetului pentru a duplica atât widgetul, cât și workflowul său complet. Copia este plasată sub original și etichetată cu **(Copy)**, astfel încât să o puteți edita independent.

## Generarea unui widget cu AI

Faceți clic pe **AI**, descrieți metrica dorită (de exemplu, „rata de succes a workflowurilor din ultimele 30 de zile ca grafic cu bare") și alegeți o credențială LLM și un model. Heym generează un workflow complet de widget care se încheie cu un nod Chart Output și îl adaugă pe grilă. Consultați [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) pentru exemple de prompturi pe tip de grafic.

Utilizați butonul **Fine-tune with AI** al unui widget pentru a revizui un widget existent cu o nouă instrucțiune. Fiecare ajustare AI salvează instantaneu workflowul anterior în **Edit History** al widgetului, astfel încât să puteți examina sau reveni asupra modificărilor din editorul de workflowuri.

## Editarea aspectului

Comutați **Edit** pentru a intra în modul de editare, unde puteți trage widgeturile și le puteți redimensiona pe o grilă de 12 coloane. Modificările de aspect sunt salvate automat. Titlurile widgeturilor sunt editabile inline din antetul widgetului.

## Memorare în cache și reîmprospătare

Fiecare widget își memorează în cache pe server ultimele date calculate pentru o durată de viață (TTL) configurabilă. Cât timp cache-ul este proaspăt, redeschiderea dashboardului servește rezultatul stocat în loc să reexecute workflowul. Cache-ul este înlocuit pe loc de fiecare dată când datele sunt recalculate (un cache per widget) și este invalidat automat când editați workflowul widgetului.

Utilizați butonul **Refresh** al unui widget (sau **Refresh** din bara de instrumente) pentru a ocoli cache-ul și a recalcula imediat.
## Partajare

Proprietarii partajează un dashboard din setările acestuia, cu utilizatori individuali (prin email) sau cu orice [echipă](teams-tab.md) din care fac parte. Fiecare partajare este **Read** sau **Write**; atunci când cineva are atât o partajare personală, cât și una de echipă, se aplică cea mai puternică.

| Acțiune | Proprietar | Write | Read |
|--------|:-----:|:-----:|:----:|
| Vizualizarea widgeturilor, reîmprospătarea acestora, utilizarea reîmprospătării automate | ✓ | ✓ | ✓ |
| Adăugarea, clonarea, ștergerea, redenumirea și redimensionarea widgeturilor; generarea și ajustarea fină cu AI; bifarea elementelor din checklist | ✓ | ✓ | |
| Deschiderea workflow-ului unui widget în editor | ✓ | ✓ | |
| Redenumirea sau ștergerea dashboard-ului, gestionarea partajării | ✓ | | |

**Widgeturile rulează întotdeauna ca proprietar al dashboard-ului.** Indiferent cine vizualizează, un widget utilizează credențialele și variabilele globale ale proprietarului, iar execuțiile sale apar în istoricul de execuție și în traces-urile proprietarului. Astfel, colegii de echipă văd aceleași date fără a avea acces la conturile din spatele acestora, iar fiecare vizualizator partajează același rezultat cache-uit per widget. Widgeturile pe care le adaugă sau le clonează un colaborator cu drept de scriere aparțin de asemenea proprietarului.

Din acest motiv, **Write** implică același nivel de încredere ca partajarea unui workflow pentru editare: un colaborator cu drept de scriere poate modifica ceea ce rulează cu credențialele dumneavoastră. Acordați acest drept doar persoanelor cărora le-ați permite să editeze workflow-urile dumneavoastră. O execuție de test pe care un colaborator o pornește din editorul de workflow utilizează propriile credențiale, ca în cazul oricărui workflow partajat; doar dashboard-ul în sine rulează ca proprietar. **Read** nu acordă acces la workflow-urile widgeturilor, iar vizualizatorii cu drept de citire primesc graficul în sine, dar nu și detaliile de execuție per nod din spatele acestuia.

Eliminarea unei partajări sau reducerea acesteia de la write la read produce efecte imediat.

## Resurse conexe

- [Nodul Chart Output](../nodes/chart-output-node.md)
- [Fila Analytics](analytics-tab.md) — metrici de execuție integrate (diferite de dashboard-urile create de utilizatori)
