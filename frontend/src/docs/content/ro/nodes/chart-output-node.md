# Ieșire grafic

Nodul **Ieșire grafic** este nodul terminal al unui workflow de [widget de dashboard](../tabs/dashboard-tab.md). Acesta preia rândurile produse de nodurile anterioare și le transformă într-un payload standardizat de grafic pe care dashboard-ul îl afișează.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 0 (terminal) |
| Ieșire | Payload standardizat de grafic |

Plasați acest nod **ultimul** într-un workflow de widget de dashboard. Pentru relațiile dintre entități, nodul anterior produce un obiect graf (consultați [Entity relationships](#entity-relationships-db)). Alte grafice bazate pe date utilizează un array de obiecte rând, de exemplu:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Când aveți doar date de exemplu (fără o sursă reală), produceți aceste rânduri cu un nod **Set** folosind `$array(dict(...), dict(...))` — de exemplu `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Nu** folosiți `${...}` sau literali de obiect `{...}` simpli; Heym construiește obiecte doar cu `dict(key=value)`.

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `gantt`, `erDiagram`, `text` sau `hitl` |
| `orientation` | string | `vertical` sau `horizontal` (doar pentru grafice cu bare) |
| `dataPath` | string | Cale cu puncte către array-ul de rânduri (sau obiect graf pentru `erDiagram`) din ieșirea nodului anterior (de ex. `data` sau `result.items`). Lăsați gol pentru detectare automată. |
| `labelField` | string | Cheia rândului folosită ca etichetă de categorie (pie/bar/line) |
| `valueField` | string | Cheia rândului folosită ca valoare numerică (pie/bar/line/numeric/gauge) |
| `series` | array | Definiție opțională multi-serie `[{ "name": "Sent", "field": "sent" }]` pentru bar/line (suprascrie `valueField`) |
| `columns` | array | Listă opțională de coloane pentru `table` (implicit cheile primului rând) |
| `statusColumn` | string | Coloană opțională din `table` afișată ca [etichete de stare](#status-chips) colorate. Trebuie să fie una dintre coloanele afișate. |, iar cu `linkColumn` conține coloana de link și textul butonului.
| `statusTones` | object | Mapare opțională de la o valoare de stare la o nuanță (`success`, `attention`, `failure`, `waiting`, `neutral`) pentru valorile neacoperite implicit |
| `linkColumn` | string | Coloană `table` opțională ale cărei celule conțin un URL, afișat ca [buton de link](#link-buttons) care îl deschide într-o filă nouă. Trebuie să fie una dintre coloanele afișate. |
| `linkLabel` | string | Text opțional al butonului de link. Dacă este lăsat gol, butonul afișează doar o pictogramă de link. |
| `xField` / `yField` | string | Cheile rândului pentru axele numerice X și Y (scatter) |
| `min` / `max` | number | Interval numeric pentru `gauge` (implicit `0` / `100`) |
| `unit` | string | Unitate opțională afișată lângă o valoare `numeric` sau `gauge` |
| `text` | string | Mesaj Markdown pentru tipul de grafic `text`. Lăsați gol și setați `valueField` pentru a afișa un mesaj dinamic preluat din datele anterioare. |
| `title` | string | Titlu opțional al graficului |
| `hitlWorkflowId` | string | Doar `hitl`. Afișează numai recenziile acestui workflow. Dacă este lăsat gol, widgetul afișează toate recenziile. |
| `hitlNodeId` | string | Doar `hitl`. Restrânge `hitlWorkflowId` la un pas: un Agent cu revizuire umană sau un pas Slack de aprobare, butoane ori formular. |

## Tipuri de grafice

- **bar / line / area / pie** — grafice categorice bazate pe `labelField` + `valueField` (sau `series` pentru bar/line/area multi-serie). `area` este un grafic de tendință umplut.
- **table** — rânduri brute afișate ca tabel derulabil folosind `columns`. O coloană poate fi afișată ca [etichete de stare](#status-chips), iar rândurile pot deschide o [pagină de detalii](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — o singură valoare KPI din primul rând, cu un `unit` opțional.
- **gauge** — o singură valoare afișată pe un interval `min`–`max` (de ex. un procent). Folosește `valueField`.
- **scatter** — puncte X/Y din `xField` și `yField` pentru grafice de corelație.
- **proportion** — o singură bară orizontală împărțită în proporții cu o legendă procentuală (de ex. o defalcare pe limbi). Folosește `labelField` + `valueField`.
- **barGauge** — un gauge orizontal per rând cu un gradient roșu→verde și o valoare (de ex. spațiu liber pe disc). Folosește `labelField` + `valueField`, `unit` opțional și `max` (implicit valoarea maximă a rândului).
- **gantt** — planificări de sarcini cu date, progres și dependențe; consultați [Planificări Gantt](#gantt-schedules).
- **erDiagram** — entități de bază de date, câmpuri, chei și relații; consultați [Entity relationships](#entity-relationships-db).
- **text** — un mesaj markdown (de ex. o notă de stare precum „Ultima execuție la 19:47"). Puneți markdown-ul în `text` pentru un mesaj static, sau lăsați `text` gol și setați `valueField` pentru a afișa un string produs anterior. Suportă titluri, bold/italic, [liste](../nodes/chart-output-node.md#interactive-task-lists), linkuri și cod inline.
- **hitl** — un carusel cu recenziile dvs. umane în așteptare. Antetul afișează `1/n pending`; săgeata stângă este dezactivată pe primul card, iar săgeata dreaptă pe ultimul. Numele workflow-ului deschide acea execuție pe canvas. **Approve**, **Request changes** și **Reject** o rezolvă, iar pictograma de istoric de lângă titlul widget-ului deschide acea execuție în dialogul de istoric de pe aceeași pagină. Acest tip de grafic ignoră rândurile anterioare, astfel încât workflow-ul widget-ului este doar nodul Ieșire grafic. Fiecare persoană autentificată vede recenziile pentru workflow-urile pe care le deține. Alegeți un **Workflow** (și **Select agent** când are mai mulți pași de revizuire) în proprietățile nodului sau în setările widgetului pentru a afișa în schimb recenziile acelui workflow, tuturor celor care îl pot deschide; vedeți [widgeturi HITL](../tabs/dashboard-tab.md#hitl-widgets).

### Planificări Gantt

Alegeți **Gantt** (`gantt`) pentru calendare de proiect și cronologii de sarcini. Setați `dataPath` pe array-ul de sarcini, cum ar fi `tasks`. Rândurile folosesc nume fixe de câmpuri:

```json
{
  "tasks": [
    { "id": "design", "label": "Design", "start": "2026-10-01", "end": "2026-10-05", "progress": 100 },
    { "id": "build", "label": "Build", "start": "2026-10-05", "end": "2026-10-14", "progress": 40, "dependencies": ["design"] }
  ]
}
```

`start` și `end` acceptă date sau marcaje temporale ISO. Valorile fără fus orar utilizează UTC; decalajele de fus orar sunt convertite în UTC. `end` trebuie să fie egal sau ulterior lui `start`. `progress` este opțional (0–100, implicit 0); `dependencies` conține ID-uri ale sarcinilor existente. ID-urile trebuie să fie unice. Treceți cu cursorul peste o sarcină pentru a citi datele complete, progresul și dependențele. Diagramele mari permit derularea în interiorul widgetului. Sunt acceptate cel mult 500 de sarcini.

Pentru date demonstrative, o mapare Set numită `tasks` poate utiliza `$array(dict(id="design", label="Design", start="2026-10-01", end="2026-10-05", progress=60))`. Conectați-o la Chart Output cu `chartType: "gantt"` și `dataPath: "tasks"`. Mapați coloanele sursă în aceste nume fixe cu un nod Set; `labelField` și `valueField` nu sunt utilizate.

### Entity relationships (DB)

Alegeți **Entity relationships (DB)** (`erDiagram`) pentru scheme de baze de date și conexiuni între entități. Setați `dataPath` pe un **obiect** graf, cum ar fi `graph`, conținând ambele array-uri:

```json
{
  "graph": {
    "entities": [
      { "id": "customers", "label": "Customers", "fields": [{ "name": "id", "type": "uuid", "key": "PK" }] },
      { "id": "orders", "label": "Orders", "fields": [{ "name": "customer_id", "type": "uuid", "key": "FK" }] }
    ],
    "relations": [
      { "source": "customers", "target": "orders", "sourceField": "id", "targetField": "customer_id", "cardinality": "one-to-many", "label": "places" }
    ]
  }
}
```

Câmpurile conțin un `name`, `type` opțional și `key` opțională (`PK`, `FK`, `PK/FK` sau gol). Relațiile fac referire la ID-uri de entități existente; câmpurile opționale `sourceField` și `targetField` ancorează conexiunea la câmpurile denumite. `cardinality` acceptă `one-to-one`, `one-to-many` (implicit), `many-to-one` sau `many-to-many`. ID-urile entităților și numele de câmpuri din fiecare entitate trebuie să fie unice. Sunt acceptate cel mult 100 de entități, 100 de câmpuri per entitate și 500 de relații.

Cu un nod Set, construiți `graph` prin `$dict(entities=array(dict(...)), relations=array(dict(...)))`; utilizați `chartType: "erDiagram"` și `dataPath: "graph"`. Aceasta este o vizualizare a schemei furnizate; nu inspectează automat o bază de date activă.

Ambele tipuri apar în **Adăugare widget** cu o previzualizare și în selectorul de tip de diagramă al nodului pe canvas. Heym Work poate propune aceste tipuri atunci când descrieți o planificare sau o schemă de bază de date, desenând previzualizări ale sarcinilor sau entităților propuse înainte de a crea pagina.

### Liste de activități interactive

Folosiți sintaxa de listă de activități markdown în stil GitHub în câmpul static `text`:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

Pe [Dashboard](../tabs/dashboard-tab.md), casetele de selectare sunt afișate ca elemente de control clicabile (compatibile cu modul întunecat și luminos). Comutarea unei casete de selectare actualizează câmpul `text` al workflow-ului widget-ului și persistă între reîmprospătări.

**Editare inline:** faceți dublu clic pe eticheta unui element de activitate pentru a-l edita pe loc. Apăsați Enter sau faceți clic în altă parte pentru a salva; apăsați Escape pentru a anula. Goliți complet eticheta pentru a elimina acel element din listă.

**Linkuri în elementele de activitate:** când o etichetă conține un link markdown (`[title](url)`), clic pe link deschide URL-ul fără a comuta caseta de selectare. Faceți clic în altă parte pe rând pentru a comuta.

**Doar text static:** interactivitatea necesită sintaxa de listă de activități GFM (`- [ ]` / `- [x]`). Mesajele de stare dinamice simple, fără elemente de activitate, rămân doar pentru citire. Când markdown-ul provine din `valueField`, prima comutare îl copiază în câmpul static `text` pentru ca modificările să persiste.
### Liste numerotate

Widgeturile de text afișează markdown cu **numerele de linie explicite păstrate**. Prefixați fiecare linie cu numărul pe care doriți să îl afișați (de ex. `9.`, `8.`, `7.`). Heym nu renumerotează liniile pentru dumneavoastră.

**De ce numere explicite?** Listele ordonate standard markdown (`1.`, `2.`, `3.`) devin liste HTML `<ol>`, care numără doar **crescător** de la primul număr. O listă scrisă ca `9.` / `8.` / `7.` s-ar afișa ca `9`, `10`, `11` într-un renderer markdown normal. Prefixarea fiecărei linii cu numărul dorit evită acest lucru.

**Liste descrescătoare (de ex. cele mai recente primele):** construiți markdown-ul într-o buclă de workflow și calculați numărul afișat pentru fiecare element:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Model tipic:

1. Obțineți sau construiți un array de elemente (de ex. HTTP → `body.videos`).
2. [Loop](./loop-node.md) peste array; în interiorul corpului, utilizați o [Variable](./variable-node.md) cu `.add()` pentru a adăuga o linie numerotată per iterație.
3. După ramura **done** a buclei, [Set](./set-node.md) `join("\n")` pe array-ul acumulat (sau echivalent) într-un singur string markdown.
4. Îndreptați **Chart Output** `valueField` către acel string (sau setați `text` static).

Exemplu de expresie de linie în interiorul buclei (etichetă `processVideos`, elemente cu `title` și `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Markdown rezultat:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Pentru o listă simplă crescătoare care începe de la 1, fie prefixați fiecare linie (`1.`, `2.`, `3.`), fie utilizați o buclă cu `$loop.index + 1`. Utilizați [liste cu bullet](#interactive-task-lists) (`- item`) atunci când nu aveți nevoie de numere.

## Etichete de stare

Un `table` poate afișa o coloană sub formă de etichete colorate (chips). Setați **Status column** în proprietățile nodului (sau `statusColumn` în DSL) la numele unei coloane. Fiecare valoare primește una dintre cele cinci nuanțe, iar cuvintele uzuale primesc una fără configurare:

| Nuanță | Cuvinte implicite |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | orice altceva |

Potrivirea ignoră diferențele dintre majuscule și minuscule, `_` și `-`, astfel încât `IN_PROGRESS` și `in-progress` sunt ambele `waiting`. Adăugați **Status tones** pentru alte valori; o intrare suprascrie valoarea implicită pentru acel statut:

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

Serverul rezolvă fiecare valoare la nuanța sa, astfel încât Heym și Heym Work afișează aceleași culori.

## Pagini de detalii: `$page.record`

Un tablou de bord deschis cu `?record=<value>` rulează fiecare Workflow de widget cu acea valoare ca `$page.record`. Un link dintr-un rând de tabel deschide o astfel de pagină; consultați [Pagini de detalii](../tabs/dashboard-tab.md#detail-pages). Pe tabloul de bord deschis fără o înregistrare și în dialogul de expresii, `$page.record` este `null`. Un nod cu eticheta `page` are prioritate față de acesta.

Folosiți-l pentru a prelua înregistrarea exactă despre care este pagina, de exemplu într-un nod [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` este chiar valoarea rândului pe care s-a făcut clic, cum ar fi `V-1002`, nu un obiect cu câmpuri. Pentru a găsi acea înregistrare într-un [DataTable](./datatable-node.md), filtrați coloana de înregistrare după valoare: operația `find` cu filtrul `{"vendor_id": "$page.record"}`. O cale precum `$page.record.id` nu rezolvă nimic, astfel încât un widget construit sau ajustat de AI elimină acele câmpuri și citește direct `$page.record`.

Valoarea provine dintr-un URL pe care oricine îl poate edita. Tabloul de bord acceptă doar valori în formatul său de înregistrare (litere, cifre, `-`, `_` și `.` în mod implicit), dar tratați-o totuși ca pe o intrare nesigură: transmiteți-o acolo unde nodul face escape valorilor, cum ar fi un parametru de interogare HTTP sau o valoare de filtru [DataTable](./datatable-node.md) ori ClickHouse, și nu construiți niciodată textul interogării prin concatenarea șirurilor. Widgeturile rulează în continuare în numele proprietarului tabloului de bord, indiferent cine deschide pagina.

## Cum sunt rezolvate datele

1. Dacă `dataPath` este setat, nodul urmărește acea cale cu puncte în output-ul din amonte.
2. În caz contrar, caută un array: o listă de nivel superior, un array `data` sau primul câmp cu valoare de listă.
3. Rândurile provenite direct dintr-un nod [Data Table](./datatable-node.md) (`{id, data, created_at}`) sunt citite cu coloanele lor la nivelul superior lângă `id`, astfel încât `labelField`, `valueField` și `columns` denumesc propriile coloane ale tabelului.
4. Pentru `table`, fiecare rând devine un rând de tabel folosind `columns` (sau cheile primului rând). Cu `statusColumn`, Payload-ul poartă și nuanța fiecărei valori din acea coloană.
5. Pentru `numeric` și `gauge`, valoarea provine din `valueField` pe primul rând (sau primul câmp numeric).
6. Pentru `scatter`, fiecare rând devine un punct `[xField, yField]`.
7. Pentru `text`, mesajul este preluat din `valueField` pe primul rând atunci când este setat, altfel din configurația statică `text` (în caz contrar, primul câmp string al primului rând).

## Exemplu

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge (valoare unică vs. un interval):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter (puncte X/Y):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proporție (o bară împărțită pe cote + legendă cu procente):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Arie (tendință multi-serie umplută):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge (gauge cu gradient per rând cu valori):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text (un mesaj markdown static — nu sunt necesare rânduri din amonte):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text (dinamic — string-ul mesajului este produs în amonte și preluat prin `valueField`):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```
## Exemple de prompt-uri AI

Când generați un widget cu **AI**, prompt-uri precum acestea se mapează direct la fiecare tip:

- **Bar** — "Afișați venitul lunar pentru ultimele 6 luni ca un grafic cu bare verticale, folosind date de exemplu."
- **Line** — "Reprezentați utilizatorii activi zilnic din ultimele 14 zile ca un grafic cu linii."
- **Area** — "Afișați utilizarea memoriei și a CPU-ului din ultimele 24 de ore ca un grafic cu arii cu două serii. Folosiți date de exemplu."
- **Pie** — "Defalcați starea execuțiilor (succes, eroare, anulat) ca un grafic circular."
- **Table** — "Afișați primele 10 workflow-uri după numărul de execuții ca un tabel derulabil cu coloanele name și runs. Folosiți date de exemplu."
- **Numeric** — "Afișați numărul total de execuții de workflow-uri de astăzi ca un singur KPI cu unitatea 'runs'. Folosiți date de exemplu."
- **Gauge** — "Afișați utilizarea curentă a CPU-ului ca un indicator de tip gauge de la 0 la 100 la sută."
- **Scatter** — "Reprezentați latența cererilor în raport cu dimensiunea payload-ului ca un grafic de dispersie, folosind date de exemplu."
- **Proportion** — "Afișați limbajele mele cele mai utilizate ca o bară de proporții: Kotlin 49,64%, JavaScript 23,73%, TypeScript 11,64%, Java 8,92%, Python 6,06%. Folosiți date de exemplu."
- **Bar gauge** — "Afișați spațiul liber pe disc pentru fiecare volum (sda1 până la sda7) ca un bar gauge în GB. Folosiți date de exemplu."
- **Text** — "Adăugați un widget de text cu o listă de verificare în format markdown (un element bifat, două nebifate) sau listați cele mai noi 5 videoclipuri tutorial în ordine descrescătoare (de la 5. la 1.) cu linkuri YouTube — prefixați fiecare linie cu un număr explicit (`5. Titlu`, `4. Titlu`, …)."

## Resurse conexe

- [Fila Dashboard](../tabs/dashboard-tab.md) — construiți și aranjați widget-uri
- [Nod de ieșire](output-node.md) — nod terminal pentru workflow-uri obișnuite


## Butoane de link

Un `table` poate transforma o coloană în butoane care deschid un link. Setați **Link column** în proprietățile nodului (sau `linkColumn` în DSL) la o coloană ale cărei celule conțin un URL și, opțional, **Link button text** (`linkLabel`). Fiecare celulă devine un buton care își deschide URL-ul într-o filă nouă. Fără text pentru buton, acesta afișează doar o pictogramă de link:

| Valoarea celulei | Deschide |
| ---------------- | -------- |
| `https://jira.example.com/browse/T-1` | Alt site, într-o filă nouă |
| `/dashboards` | O pagină din Heym, într-o filă nouă |

Doar adresele `http://` și `https://` și căile care încep cu un singur `/` devin butoane. Orice altă valoare, cum ar fi `javascript:` sau `//host`, rămâne text simplu, iar o celulă goală nu afișează nimic.

Butonul funcționează alături de un [link de rând](../tabs/dashboard-tab.md#detail-pages): un clic pe buton deschide linkul său într-o filă nouă, iar un clic în orice altă parte a rândului deschide în continuare pagina de detalii.
