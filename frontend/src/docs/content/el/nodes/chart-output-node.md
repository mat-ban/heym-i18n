# Έξοδος Διαγράμματος

Ο κόμβος **Έξοδος Διαγράμματος** είναι ο τελικός κόμβος ενός workflow [widget πίνακα ελέγχου](../tabs/dashboard-tab.md). Λαμβάνει τις γραμμές που παράγονται από τους ανάντη κόμβους και τις μετατρέπει σε ένα τυποποιημένο payload διαγράμματος που αποδίδει ο πίνακας ελέγχου.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 0 (τερματικός) |
| Έξοδος | Τυποποιημένο payload διαγράμματος |

Τοποθετήστε αυτόν τον κόμβο **τελευταίο** σε ένα workflow widget πίνακα ελέγχου. Ο κόμβος πριν από αυτόν θα πρέπει να παράγει έναν πίνακα αντικειμένων γραμμών, για παράδειγμα:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Όταν διαθέτετε μόνο δεδομένα παραδείγματος/δείγματος (χωρίς πραγματική πηγή), παράγετε αυτές τις γραμμές με έναν κόμβο **Set** χρησιμοποιώντας `$array(dict(...), dict(...))` — για παράδειγμα `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. Μη **χρησιμοποιείτε** `${...}` ή γυμνά αντικείμενα `{...}`; το Heym δημιουργεί αντικείμενα μόνο με `dict(key=value)`.

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό κόμβου (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` ή `hitl` |
| `orientation` | string | `vertical` ή `horizontal` (μόνο για διαγράμματα bar) |
| `dataPath` | string | Διαδρομή με τελείες προς τον πίνακα γραμμών εντός της ανάντη εξόδου (π.χ. `data` ή `result.items`). Αφήστε το κενό για αυτόματο εντοπισμό. |
| `labelField` | string | Κλειδί γραμμής που χρησιμοποιείται ως ετικέτα κατηγορίας (pie/bar/line) |
| `valueField` | string | Κλειδί γραμμής που χρησιμοποιείται ως αριθμητική τιμή (pie/bar/line/numeric/gauge) |
| `series` | array | Προαιρετικός ορισμός πολλαπλών σειρών `[{ "name": "Sent", "field": "sent" }]` για bar/line (υπερισχύει του `valueField`) |
| `columns` | array | Προαιρετική λίστα στηλών για `table` (προεπιλογή: τα κλειδιά της πρώτης γραμμής) |
| `statusColumn` | string | Προαιρετική στήλη `table` που αποδίδεται ως χρωματιστά [chips κατάστασης](#status-chips). Πρέπει να είναι μία από τις εμφανιζόμενες στήλες. |
| `statusTones` | object | Προαιρετική αντιστοίχιση από μια τιμή κατάστασης σε έναν τόνο (`success`, `attention`, `failure`, `waiting`, `neutral`) για τιμές που δεν καλύπτονται από τις προεπιλογές |
| `xField` / `yField` | string | Κλειδιά γραμμών για τους αριθμητικούς άξονες X και Y (scatter) |
| `min` / `max` | number | Αριθμητικό εύρος για `gauge` (προεπιλογή `0` / `100`) |
| `unit` | string | Προαιρετική μονάδα που εμφανίζεται δίπλα σε μια τιμή `numeric` ή `gauge` |
| `text` | string | Μήνυμα Markdown για τον τύπο διαγράμματος `text`. Αφήστε το κενό και ορίστε το `valueField` για να αποδοθεί ένα δυναμικό μήνυμα που αντλείται από ανάντη δεδομένα. |
| `title` | string | Προαιρετικός τίτλος διαγράμματος |

## Τύποι διαγραμμάτων

- **bar / line / area / pie** — κατηγορικά διαγράμματα που καθοδηγούνται από `labelField` + `valueField` (ή `series` για πολλαπλών σειρών bar/line/area). Το `area` είναι ένα συμπληρωμένο διάγραμμα τάσης.
- **table** — ακατέργαστες γραμμές που αποδίδονται ως πίνακας με δυνατότητα κύλισης χρησιμοποιώντας `columns`. Μία στήλη μπορεί να αποδοθεί ως [chips κατάστασης](#status-chips) και οι γραμμές μπορούν να ανοίξουν μια [σελίδα λεπτομερειών](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — μια μεμονωμένη τιμή KPI από την πρώτη γραμμή, με προαιρετική `unit`.
- **gauge** — μια μεμονωμένη τιμή που εμφανίζεται έναντι ενός εύρους `min`–`max` (π.χ. ένα ποσοστό). Χρησιμοποιεί `valueField`.
- **scatter** — σημεία X/Y από τα `xField` και `yField` για γραφήματα συσχέτισης.
- **proportion** — μια μεμονωμένη οριζόντια μπάρα χωρισμένη σε μερίδια με υπόμνημα ποσοστών (π.χ. ανάλυση γλώσσας). Χρησιμοποιεί `labelField` + `valueField`.
- **barGauge** — ένα οριζόντιο gauge ανά γραμμή με διαβάθμιση κόκκινο→πράσινο και μια τιμή (π.χ. ελεύθερος χώρος δίσκου). Χρησιμοποιεί `labelField` + `valueField`, προαιρετικό `unit` και `max` (προεπιλογή: η μεγαλύτερη τιμή γραμμής).
- **text** — ένα μήνυμα markdown (π.χ. μια σημείωση κατάστασης όπως "Last execution at 19:47"). Τοποθετήστε το markdown στο `text` για στατικό μήνυμα, ή αφήστε το `text` κενό και ορίστε το `valueField` για να αποδοθεί ένα string που παράγεται ανάντη. Υποστηρίζει επικεφαλίδες, έντονα/πλάγια, [λίστες](../nodes/chart-output-node.md#interactive-task-lists), συνδέσμους και inline κώδικα.
- **hitl** — ένα καρουζέλ των εκκρεμών ανθρώπινων αξιολογήσεών σας. Η κεφαλίδα εμφανίζει `1/n pending`; το αριστερό βέλος είναι απενεργοποιημένο στην πρώτη κάρτα και το δεξί βέλος στην τελευταία. Το όνομα του workflow ανοίγει αυτή την εκτέλεση στον καμβά. Τα **Approve**, **Request changes** και **Reject** την επιλύουν, και το εικονίδιο ιστορικού δίπλα στον τίτλο του widget ανοίγει αυτή την εκτέλεση στο παράθυρο διαλόγου ιστορικού στην ίδια σελίδα. Αυτός ο τύπος διαγράμματος αγνοεί τις ανάντη γραμμές, επομένως το workflow του widget είναι μόνο ο κόμβος Έξοδος Διαγράμματος. Κάθε συνδεδεμένο άτομο βλέπει τις αξιολογήσεις σε workflows που του ανήκουν.

### Διαδραστικές λίστες εργασιών

Χρησιμοποιήστε σύνταξη λίστας εργασιών markdown τύπου GitHub στο στατικό πεδίο `text`:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

Στον [Πίνακα ελέγχου](../tabs/dashboard-tab.md), τα πλαίσια ελέγχου αποδίδονται ως κλικαδόρικα στοιχεία ελέγχου (φιλικά για σκοτεινή και φωτεινή λειτουργία). Η εναλλαγή ενός πλαισίου ελέγχου ενημερώνει το πεδίο `text` του workflow του widget και διατηρείται στις ανανεώσεις.

**Inline επεξεργασία:** κάντε διπλό κλικ στην ετικέτα ενός στοιχείου εργασίας για να την επεξεργαστείτε επί τόπου. Πατήστε Enter ή κάντε κλικ αλλού για αποθήκευση· πατήστε Escape για ακύρωση. Διαγράψτε εντελώς την ετικέτα για να αφαιρέσετε αυτό το στοιχείο από τη λίστα.

**Σύνδεσμοι σε στοιχεία εργασιών:** όταν μια ετικέτα περιέχει σύνδεσμο markdown (`[title](url)`), κάνοντας κλικ στον σύνδεσμο ανοίγει το URL χωρίς να εναλλάσσεται το πλαίσιο ελέγχου. Κάντε κλικ αλλού στη γραμμή για εναλλαγή.

**Μόνο στατικό κείμενο:** η διαδραστικότητα απαιτεί σύνταξη λίστας εργασιών GFM (`- [ ]` / `- [x]`). Τα απλά δυναμικά μηνύματα κατάστασης χωρίς στοιχεία εργασίας παραμένουν μόνο για ανάγνωση. Όταν το markdown προέρχεται από το `valueField`, η πρώτη εναλλαγή το αντιγράφει στο στατικό πεδίο `text` ώστε οι αλλαγές να διατηρούνται.
### Αριθμημένες λίστες

Τα Text widgets αποδίδουν markdown με **ρητά διατηρημένους αριθμούς γραμμών**. Προσθέστε ως πρόθεμα σε κάθε γραμμή τον αριθμό που θέλετε να εμφανίζεται (π.χ. `9.`, `8.`, `7.`). Το Heym δεν επαναριθμεί τις γραμμές για εσάς.

**Γιατί ρητοί αριθμοί;** Οι τυπικές αριθμημένες λίστες markdown (`1.`, `2.`, `3.`) μετατρέπονται σε λίστες HTML `<ol>`, οι οποίες μετρούν **μόνο προς τα πάνω** από τον πρώτο αριθμό. Μια λίστα γραμμένη ως `9.` / `8.` / `7.` θα εμφανιζόταν ως `9`, `10`, `11` σε έναν κανονικό renderer markdown. Η προσθήκη του επιθυμητού αριθμού ως προθέματος σε κάθε γραμμή το αποφεύγει.

**Φθίνουσες λίστες (π.χ. νεότερα πρώτα):** δημιουργήστε το markdown σε έναν βρόχο workflow και υπολογίστε τον αριθμό εμφάνισης ανά στοιχείο:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Τυπικό μοτίβο:

1. Ανακτήστε ή δημιουργήστε έναν πίνακα στοιχείων (π.χ. HTTP → `body.videos`).
2. [Loop](./loop-node.md) πάνω από τον πίνακα· μέσα στο σώμα, χρησιμοποιήστε μια [Variable](./variable-node.md) με `.add()` για να προσθέσετε μία αριθμημένη γραμμή ανά επανάληψη.
3. Μετά τον κλάδο **done** του βρόχου, [Set](./set-node.md) `join("\n")` στον συσσωρευμένο πίνακα (ή ισοδύναμο) σε ένα ενιαίο string markdown.
4. Κατευθύνετε το **Chart Output** `valueField` σε αυτό το string (ή ορίστε στατικό `text`).

Παράδειγμα έκφρασης γραμμής μέσα στον βρόχο (label `processVideos`, στοιχεία με `title` και `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Προκύπτον markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Για μια απλή αύξουσα λίστα που ξεκινά από το 1, είτε προσθέστε ως πρόθεμα σε κάθε γραμμή (`1.`, `2.`, `3.`) είτε χρησιμοποιήστε έναν βρόχο με `$loop.index + 1`. Χρησιμοποιήστε [λίστες με κουκκίδες](#interactive-task-lists) (`- item`) όταν δεν χρειάζεστε αριθμούς.

## Chips κατάστασης

Ένα `table` μπορεί να εμφανίζει μία στήλη ως χρωματιστά chips. Ορίστε το **Status column** στις ιδιότητες του κόμβου (ή το `statusColumn` στο DSL) σε ένα όνομα στήλης. Κάθε τιμή λαμβάνει έναν από πέντε τόνους και οι συνηθισμένες λέξεις λαμβάνουν έναν χωρίς ρύθμιση:

| Τόνος | Προεπιλεγμένες λέξεις |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | οτιδήποτε άλλο |

Η αντιστοίχιση αγνοεί πεζά/κεφαλαία, `_` και `-`, επομένως τα `IN_PROGRESS` και `in-progress` αντιστοιχούν και τα δύο σε `waiting`. Προσθέστε **Status tones** για άλλες τιμές· μια καταχώριση αντικαθιστά την προεπιλογή για αυτήν την τιμή:

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

Ο διακομιστής επιλύει κάθε τιμή στον τόνο της, ώστε το Heym και το Heym Work να εμφανίζουν τα ίδια χρώματα.

## Σελίδες λεπτομερειών: `$page.record`

Ένας πίνακας ελέγχου που ανοίγει με `?record=<value>` εκτελεί κάθε Workflow widget με αυτή την τιμή ως `$page.record`. Ένας σύνδεσμος γραμμής πίνακα ανοίγει μια τέτοια σελίδα· δείτε [Σελίδες λεπτομερειών](../tabs/dashboard-tab.md#detail-pages). Στον πίνακα ελέγχου που ανοίγει χωρίς εγγραφή, καθώς και στον διάλογο εκφράσεων, το `$page.record` είναι `null`. Ένας κόμβος με ετικέτα `page` υπερισχύει αυτού.

Χρησιμοποιήστε το για να ανακτήσετε τη συγκεκριμένη εγγραφή που αφορά η σελίδα, για παράδειγμα σε έναν κόμβο [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

Το `$page.record` είναι η ίδια η τιμή της γραμμής που επιλέχθηκε, όπως `V-1002`, και όχι ένα αντικείμενο με πεδία. Για να βρείτε αυτή την εγγραφή σε ένα [DataTable](./datatable-node.md), φιλτράρετε τη στήλη εγγραφής με βάση την τιμή: ενέργεια `find` με φίλτρο `{"vendor_id": "$page.record"}`. Μια διαδρομή όπως `$page.record.id` δεν επιλύεται σε τίποτα, οπότε ένα widget που δημιουργεί ή βελτιστοποιεί η AI παραλείπει αυτά τα πεδία και διαβάζει αντ' αυτού το `$page.record`.

Η τιμή προέρχεται από ένα URL που μπορεί να επεξεργαστεί οποιοσδήποτε. Ο πίνακας ελέγχου δέχεται μόνο τιμές στη μορφή εγγραφής του (γράμματα, ψηφία, `-`, `_` και `.` από προεπιλογή), αλλά αντιμετωπίστε την παρ' όλα αυτά ως μη αξιόπιστη είσοδο: περάστε την εκεί όπου ο κόμβος κάνει escape τις τιμές, όπως μια παράμετρος ερωτήματος HTTP ή μια τιμή φίλτρου [DataTable](./datatable-node.md) ή ClickHouse, και μην κατασκευάζετε ποτέ κείμενο ερωτήματος ενώνοντας συμβολοσειρές με αυτήν. Τα widgets εξακολουθούν να εκτελούνται ως ο κάτοχος του πίνακα ελέγχου, όποιος κι αν ανοίξει τη σελίδα.

## Πώς επιλύονται τα δεδομένα

1. Εάν έχει οριστεί το `dataPath`, ο node ακολουθεί αυτή τη διαδρομή με τελείες μέσα στο upstream output.
2. Διαφορετικά αναζητά έναν πίνακα: μια λίστα στο ανώτατο επίπεδο, έναν πίνακα `data` ή το πρώτο πεδίο με τιμή λίστας.
3. Οι γραμμές που προέρχονται απευθείας από έναν κόμβο [Data Table](./datatable-node.md) (`{id, data, created_at}`) διαβάζονται με τις στήλες τους στο ανώτατο επίπεδο δίπλα στο `id`, ώστε τα `labelField`, `valueField` και `columns` να ονομάζουν τις ίδιες τις στήλες του πίνακα.
4. Για `table`, κάθε γραμμή γίνεται γραμμή πίνακα χρησιμοποιώντας το `columns` (ή τα κλειδιά της πρώτης γραμμής). Με το `statusColumn`, το Payload μεταφέρει επίσης τον τόνο κάθε τιμής σε αυτή τη στήλη.
5. Για `numeric` και `gauge`, η τιμή προέρχεται από το `valueField` στην πρώτη γραμμή (ή το πρώτο αριθμητικό πεδίο).
6. Για `scatter`, κάθε γραμμή γίνεται σημείο `[xField, yField]`.
7. Για `text`, το μήνυμα λαμβάνεται από το `valueField` στην πρώτη γραμμή όταν έχει οριστεί, διαφορετικά από τη στατική ρύθμιση `text` (ειδάλλως το πρώτο πεδίο string της πρώτης γραμμής).

## Παράδειγμα

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

Gauge (μεμονωμένη τιμή έναντι εύρους):

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

Scatter (σημεία X/Y):

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

Proportion (μία μπάρα χωρισμένη κατά μερίδιο + υπόμνημα ποσοστού):

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

Area (συμπληρωμένη τάση πολλαπλών σειρών):

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

Bar gauge (gauge διαβάθμισης ανά γραμμή με τιμές):

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

Text (ένα στατικό μήνυμα markdown — δεν απαιτούνται upstream γραμμές):

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

Text (δυναμικό — το string μηνύματος παράγεται upstream και αντλείται μέσω `valueField`):

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
## Παραδείγματα AI prompts

Κατά τη δημιουργία ενός widget με **AI**, prompts όπως τα παρακάτω αντιστοιχίζονται με σαφήνεια σε κάθε τύπο:

- **Bar** — "Show monthly revenue for the last 6 months as a vertical bar chart with example data."
- **Line** — "Plot daily active users over the last 14 days as a line chart."
- **Area** — "Show memory and CPU usage over the last 24 hours as an area chart with two series. Use example data."
- **Pie** — "Break down execution status (success, error, cancelled) as a pie chart."
- **Table** — "Show the top 10 workflows by execution count as a scrollable table with name and runs columns. Use example data."
- **Numeric** — "Show today's total workflow executions as a single KPI with unit 'runs'. Use example data."
- **Gauge** — "Show current CPU usage as a gauge from 0 to 100 percent."
- **Scatter** — "Plot request latency versus payload size as a scatter chart with example data."
- **Proportion** — "Show my most used languages as a proportion bar: Kotlin 49.64%, JavaScript 23.73%, TypeScript 11.64%, Java 8.92%, Python 6.06%. Use example data."
- **Bar gauge** — "Show free disk space per volume (sda1 to sda7) as a bar gauge in GB. Use example data."
- **Text** — "Add a text widget with a markdown checklist (one checked item, two unchecked), or list the 5 newest tutorial videos in descending order (5. down to 1.) with YouTube links — prefix each line with an explicit number (`5. Title`, `4. Title`, …)."

## Σχετικά

- [Καρτέλα Dashboard](../tabs/dashboard-tab.md) — δημιουργία και διάταξη widgets
- [Output node](output-node.md) — τελικός κόμβος για συνήθεις ροές εργασίας
