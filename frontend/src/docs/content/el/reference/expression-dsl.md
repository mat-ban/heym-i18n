# Γλώσσα Εκφράσεων (Expression DSL)

Το Heym χρησιμοποιεί μια απλή γλώσσα εκφράσεων για την αναφορά δεδομένων από ανάντη nodes. Χρησιμοποιήστε εκφράσεις στη διαμόρφωση των nodes, όπως στο `userMessage` του LLM, στη `condition` του Condition, στο `message` του Output, στις αντιστοιχίσεις του Set και στις τιμές των Μεταβλητών. Χρησιμοποιήστε το [Παράθυρο Αξιολόγησης Εκφράσεων](./expression-evaluation-dialog.md) για μεγαλύτερο επεξεργαστή, ζωντανή προεπισκόπηση από το backend και επιλογή διαδρομών εξόδου.

## Βασικές Αναφορές

### Input node vs Ονομασμένα nodes

- **`$input`** – Χρησιμοποιήστε το μόνο όταν υπάρχει ένα μόνο ανάντη [Input](../nodes/input-node.md) node και θέλετε να αναφερθείτε στην έξοδό του. Παράδειγμα: `$input.text`. Αυτό είναι συντομογραφία για «τα δεδομένα από το συνδεδεμένο input».
- **`$nodeLabel.field`** – Χρησιμοποιήστε το για να αναφερθείτε σε οποιοδήποτε ανάντη node μέσω της **ετικέτας** του (το `label` στα δεδομένα του node). Προτιμήστε το όταν έχετε πολλά nodes ή όταν ο AI Assistant / το workflow DSL αναμένει ρητές ετικέτες. Παράδειγμα: `$userInput.body.text`, `$myLLM.text`.

**Πότε να χρησιμοποιείτε ποιο:**

| Περίσταση | Προτιμήστε | Παράδειγμα |
|--------|--------|---------|
| Ένα input node, απλή ροή | `$input.text` | Μήνυμα εξόδου από ένα Input |
| Πολλά nodes ή ονομασμένες αναφορές | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Πάντα `$nodeLabel.field` | Ο builder του workflow αναμένει ετικέτες, όχι `$input` |

### Input node

Χρησιμοποιήστε το `$input` για να αναφερθείτε στα δεδομένα του Input node όταν υπάρχει ένα μόνο ανάντη input:

```
$input.text
```

### Ονομασμένα nodes

Αναφερθείτε σε οποιοδήποτε ανάντη node μέσω της ετικέτας του. Όταν ένα node έχει [pinned data](./canvas-features.md#data-pin), η συμπλήρωση έκφρασης χρησιμοποιεί αυτά αντί για την έξοδο εκτέλεσης.

```
$llm.text
$httpResponse.body
$condition
```

### Διαπιστευτήρια

Χρησιμοποιήστε το `$credentials.CredentialName` για να αναφερθείτε σε τιμές διαπιστευτηρίων (π.χ. API keys, bearer tokens ή Notion integration tokens) μέσω ονόματος. Δείτε [Κοινή Χρήση Διαπιστευτηρίων](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Ονόματα που δεν είναι απλοί αναγνωριστικοί δείκτες (περιέχουν `-`, ξεκινούν με ψηφίο ή είναι δεσμευμένες λέξεις) χρησιμοποιούν τη μορφή αγκύλης: `$credentials["my-api-key"]`.

### Καθολικές Μεταβλητές

Χρησιμοποιήστε το `$global.variableName` για να αναφερθείτε σε [Καθολικές Μεταβλητές](./global-variables.md) – επίμονα δεδομένα key-value με εύρος χρήστη, που διαχειρίζονται στην [καρτέλα Μεταβλητών](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Ένθετα Πεδία

Χρησιμοποιήστε σημειογραφία με τελείες για ένθετα αντικείμενα:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Κυριολεκτικές Τιμές

- **Strings**: `"hello"` ή `'hello'`
- **Numbers**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`

## Διατήρηση Τύπου

Όταν η **ολόκληρη** τιμή είναι μία μόνο `$expr`, το backend διατηρεί τον εγγενή τύπο:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Όταν μια έκφραση αποτελεί μέρος μεγαλύτερου string, το τελικό αποτέλεσμα είναι πάντα string:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

Τα nodes [Sticky Note](../nodes/sticky-note-node.md) είναι τεκμηρίωση του καμβά, όχι εκτελέσιμα πεδία έκφρασης. Το περιεχόμενο `note` τους αποδίδεται ως markdown, επομένως χρησιμοποιήστε κανονικούς συνδέσμους και εικόνες markdown αντί για εκφράσεις `$...`.

Τα sticky notes υποστηρίζουν προσαρμοσμένο τίτλο εμφάνισης και έξι αποθηκευμένα χρώματα φόντου:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

Οι επιτρεπόμενες τιμές `stickyColor` είναι `yellow`, `sky`, `emerald`, `rose`, `violet` και `zinc`.

## Αριθμητική

Υποστηριζόμενοι τελεστές: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Συγκρίσεις

Χρησιμοποιήστε τις σε nodes [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Πλαίσιο Loop

Μέσα σε ένα node [Loop](../nodes/loop-node.md), χρησιμοποιήστε το `item` για να αναφερθείτε στο τρέχον στοιχείο του πίνακα:

```
item.name
item.value
```

## Ειδικές Μεταβλητές
- `$now` - Τρέχουσα ημερομηνία/ώρα με μεθόδους μορφοποίησης
- `$Date()` - Δημιουργία/ανάλυση ημερομηνίας (π.χ. `$Date("2024-01-15")`)
- `$UUID` - Δημιουργία μοναδικού αναγνωριστικού 32 χαρακτήρων (ΧΩΡΙΣ παρενθέσεις· χρησιμοποιήστε `$UUID` όχι `$UUID()`)
- `$workflowName` - Το όνομα του τρέχοντος workflow
- `$workflowDescription` - Η περιγραφή του τρέχοντος workflow
- `$workflowPath` - Σχετική διαδρομή του workflow, π.χ. `/workflows/<id>`
- `$workflowUrl` - Απόλυτο URL του workflow, π.χ. `https://<host>/workflows/<id>`
- `$executionId` - Το id της τρέχουσας εκτέλεσης (ισούται με το id της καταχώρισης στο [Ιστορικό Εκτελέσεων](./execution-history.md), οπότε το `/workflows/<id>/<executionId>` ανοίγει αυτή την εκτέλεση στον καμβά). **Μόνο κατά την εκτέλεση**: κενό στο παράθυρο προεπισκόπησης εκφράσεων· συμπληρώνεται μόνο όσο εκτελείται ένα workflow.
- `$vars` - Μεταβλητές τοπικές του workflow (πρόσβαση μέσω `$vars.variableName`· ενημέρωση μέσω node `variable`)
- `$global` - Επίμονος χώρος αποθήκευσης καθολικών μεταβλητών (πρόσβαση μέσω `$global.variableName`)
- `$page.record` - Μόνο για workflows από widgets πίνακα ελέγχου: η εγγραφή της σελίδας λεπτομερειών στην οποία βρίσκεται το widget, από την παράμετρο `?record=` του πίνακα ελέγχου. Είναι `null` σε πίνακα ελέγχου που ανοίγει χωρίς αυτήν και στον διάλογο προεπισκόπησης έκφρασης. Ένας κόμβος με ετικέτα `page` έχει προτεραιότητα. Δείτε [Σελίδες λεπτομερειών](../tabs/dashboard-tab.md#detail-pages).

### Χρήση του $vars
- `$vars.counter` - Πρόσβαση σε μεταβλητή με όνομα `counter`
- `$vars.myArray.add("item")` - Προσθήκη στοιχείου σε μεταβλητή πίνακα

### Χρήση του $global
- `$global.environment` - Πρόσβαση σε καθολική μεταβλητή με όνομα `environment`
- `$global.settings.baseUrl` - Πρόσβαση σε ένθετα πεδία σε καθολική μεταβλητή τύπου αντικειμένου
## Πλαίσιο Αιτήματος (Εκτέλεση API)
Όταν ένα workflow εκτελείται μέσω HTTP API, οι input nodes λαμβάνουν πρόσθετα μεταδεδομένα αιτήματος:
- `$textInputLabel.body` - Αντικείμενο σώματος HTTP αιτήματος (raw JSON payload)
- `$textInputLabel.headers` - Αντικείμενο κεφαλίδων HTTP αιτήματος (όλα τα κλειδιά κεφαλίδων είναι πεζά)
- `$textInputLabel.query` - Αντικείμενο παραμέτρων URL query

Πρόσβαση στα δεδομένα αιτήματος ως εξής:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Συναρτήσεις Μετατροπής Τύπων
- `str(value)` - Μετατροπή σε string
- `int(value)` - Μετατροπή σε ακέραιο
- `float(value)` - Μετατροπή σε δεκαδικό
- `bool(value)` - Μετατροπή σε boolean
- `list(value)` - Μετατροπή σε λίστα
- `dict(key=value, ...)` - Δημιουργία λεξικού με ορίσματα λέξεων-κλειδιών (π.χ. `$dict(name="Ali", age=30)`)

## Μαθηματικές Συναρτήσεις
- `len(value)` - Λήψη μήκους
- `abs(value)` - Απόλυτη τιμή
- `min(a, b)` - Ελάχιστη τιμή
- `max(a, b)` - Μέγιστη τιμή
- `round(value)` - Στρογγυλοποίηση αριθμού
- `sum(list)` - Άθροισμα λίστας
- `sorted(list)` - Ταξινόμηση λίστας
- `randomInt(min, max)` - Τυχαίος ακέραιος

## Συναρτήσεις Πίνακα
- `$array(a, b, c)` - Δημιουργία πίνακα από ορίσματα (π.χ. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Δημιουργία εύρους ακεραίων από `a` έως `b` με το `b` εξαιρούμενο (π.χ. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Αποτυγχάνει όταν `a > b`
- `notNull(list)` - Αφαίρεση null τιμών από πίνακα

## Συνάρτηση Δημιουργίας String (για εκφράσεις map/filter)
- `concat(a, b, c, ...)` - Συνένωση N ορισμάτων
  - Χρήση εντός `.map()` ως string έκφρασης (χωρίς `$` εντός του string)
  - Χρήση απλών εισαγωγικών εντός του string concat:
    - Σωστό: `concat('prefix', 'item.field', 'suffix')`

## Αντικείμενα Literal / Λεξικά
Δημιουργία αντικειμένων/λεξικών χρησιμοποιώντας σύνταξη με άγκιστρα με οποιαδήποτε κλειδιά string:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Δυναμικά Κλειδιά
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Κανόνες Αντικειμένων Literal
- Τα κλειδιά μπορούν να είναι οποιοδήποτε string (συμπεριλαμβανομένων κενών/ειδικών χαρακτήρων)
- Τα κλειδιά ΠΡΕΠΕΙ να περικλείονται σε διπλά εισαγωγικά (π.χ. `"key"`)
- Οι τιμές μπορούν να είναι strings/αριθμοί/booleans/εκφράσεις/ένθετα αντικείμενα

## Συναρτήσεις String
- `upper(text)` - Κεφαλαία
- `lower(text)` - Πεζά
- `strip(text)` - Αφαίρεση κενών διαστημάτων
- `capitalize(text)` - Κεφαλαίο πρώτο γράμμα
- `title(text)` - Κεφαλαίο πρώτο γράμμα κάθε λέξης
- `split(text, separator)` - Διαχωρισμός string
- `join(separator, list)` - Συνένωση λίστας
- `replace(text, old, new)` - Αντικατάσταση κειμένου
- `regexReplace(text, pattern, replacement)` - Αντικατάσταση με μοτίβο regex
- `base64Encode(text)` - Κωδικοποίηση κειμένου UTF-8 ως τυπικό Base64
- `base64Decode(text)` - Αποκωδικοποίηση τυπικού Base64 σε κείμενο UTF-8
- `toJson(text)` - Ανάλυση string JSON σε αντικείμενο, πίνακα ή τιμή

## Μέθοδοι String (σε τιμές string)
- `.orEmpty()` - Επιστροφή της τιμής string, ή `""` όταν η τιμή είναι null/απούσα
- `.upper()` / `.lower()` - Μετατροπή πεζών/κεφαλαίων
- `.strip()` - Αφαίρεση κενών διαστημάτων
- `.capitalize()` / `.title()` - Κεφαλαιοποίηση
- `.length` - Μήκος string
- `.toString()` - Μετατροπή σε string
- `.substring(start, end)` - Εξαγωγή υποσυμβολοσειράς
- `.contains(text)` - Έλεγχος αν περιέχει υποσυμβολοσειρά
- `.startswith(prefix)` / `.endswith(suffix)` - Έλεγχος προθέματος/καταλήξεως
- `.indexOf(text)` - Εύρεση θέσης (επιστρέφει -1 αν δεν βρεθεί)
- `.replace(old, new)` - Αντικατάσταση πρώτης εμφάνισης
- `.replaceAll(old, new)` - Αντικατάσταση όλων των εμφανίσεων
- `.regexReplace(pattern, replacement)` - Αντικατάσταση με μοτίβο regex
- `.hash()` - Hash MD5 του string
- `.base64Encode()` - Κωδικοποίηση κειμένου UTF-8 ως τυπικό Base64
- `.base64Decode()` - Αποκωδικοποίηση τυπικού Base64 σε κείμενο UTF-8
- `.urlEncode()` - Κωδικοποίηση URL string
- `.urlDecode()` - Αποκωδικοποίηση URL string
- `.escape()` - Διαφυγή string JSON (μετατροπή ειδικών χαρακτήρων σε μορφή JSON)
- `.unescape()` - Αναίρεση διαφυγής string JSON (μετατροπή μορφής JSON σε αρχικό string)
- `.toJson()` - Ανάλυση string JSON σε αντικείμενο, πίνακα ή τιμή

### Παραδείγματα Μεθόδων String
- `$profile.nickname.orEmpty()` - Μετατροπή nullable/απόντος κειμένου σε κενό string
- `$text.upper()` - Μετατροπή σε κεφαλαία
- `$text.lower()` - Μετατροπή σε πεζά
- `$text.strip()` - Αφαίρεση κενών διαστημάτων
- `$text.replace("old", "new")` - Αντικατάσταση κειμένου
- `$text.replaceAll("a", "b")` - Αντικατάσταση όλων των εμφανίσεων
- `$text.length` - Λήψη μήκους string
- `$text.escape()` - Διαφυγή ειδικών χαρακτήρων JSON (π.χ. εισαγωγικά, αλλαγές γραμμής)
- `$escapedText.unescape()` - Αναίρεση διαφυγής string μορφής JSON σε αρχικό
- `$text.toJson()` - Ανάλυση string αντικειμένου/πίνακα JSON (έπειτα `$text.toJson().repoUrl`)
- `$toJson($text)` - Ίδια ανάλυση ως συνάρτηση
- `$base64Encode("Héym 🌍")` - Επιστρέφει `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Αποκωδικοποίηση Base64 σε κείμενο UTF-8
- `$text.urlEncode()` - Κωδικοποίηση URL για παραμέτρους API
- `$encodedText.urlDecode()` - Αποκωδικοποίηση κωδικοποιημένου URL κειμένου
## Μέθοδοι Πινάκων (σε πίνακες)
- `.first()` - Λήψη πρώτου στοιχείου
- `.last()` - Λήψη τελευταίου στοιχείου
- `.random()` - Λήψη τυχαίου στοιχείου
- `.reverse()` - Αντιστροφή πίνακα
- `.flat()` - Ισοπέδωση ένθετων πινάκων σε έναν ενιαίο πίνακα
- `.flat(depth)` - Ισοπέδωση με όριο βάθους
- `.distinct()` - Αφαίρεση διπλότυπων
- `.distinctBy(expr)` - Αφαίρεση διπλότυπων βάσει έκφρασης (π.χ. `$array.distinctBy("item.id")`)
- `.notNull()` - Αφαίρεση τιμών null
- `.add(item)` - Προσθήκη στοιχείου (επιστρέφει νέο πίνακα)
- `.contains(item)` - Έλεγχος αν ο πίνακας περιέχει το στοιχείο (επιστρέφει boolean)
- `.join(separator)` - Συνένωση στοιχείων πίνακα σε συμβολοσειρά
- `.filter(expr)` - Φιλτράρισμα πίνακα χρησιμοποιώντας τη μεταβλητή `item` (π.χ. `$array.filter("item > 5")`)
- `.map(expr)` - Μετασχηματισμός κάθε στοιχείου χρησιμοποιώντας τη μεταβλητή `item` (π.χ. `$array.map("item.name")`)
- `.sort(expr, order)` - Ταξινόμηση βάσει έκφρασης, το order είναι `"asc"` (προεπιλογή) ή `"desc"`
- `.take(n)` - Λήψη των πρώτων N (θετικό) ή των τελευταίων N (αρνητικό) στοιχείων
- `.length` - Μήκος πίνακα
- `.toString()` - Μετατροπή σε συμβολοσειρά JSON

### Παραδείγματα Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Μέθοδοι Αντικειμένων/Λεξικών (σε αντικείμενα)
- `.get(key)` - Λήψη τιμής βάσει κλειδιού (επιστρέφει null αν δεν βρεθεί)
- `.get(key, default)` - Λήψη τιμής βάσει κλειδιού με προεπιλεγμένη τιμή fallback
- `.keys()` - Επιστροφή λίστας όλων των κλειδιών
- `.values()` - Επιστροφή λίστας όλων των τιμών
- `.entries()` - Επιστροφή λίστας αντικειμένων `{key, value}` (ένα ανά ιδιότητα)
- `.filter(expr)` - Επανάληψη εγγραφών `{key, value}` και επιστροφή των αντίστοιχων εγγραφών ως λίστα (χρησιμοποιήστε `item.key` / `item.value` μέσα στην `expr`)
- `.map(expr)` - Επανάληψη εγγραφών `{key, value}` και επιστροφή λίστας μετασχηματισμένων τιμών (χρησιμοποιήστε `item.key` / `item.value` μέσα στην `expr`)
- `.toString()` - Μετατροπή σε συμβολοσειρά JSON

### Παραδείγματα Επανάληψης Αντικειμένων
Κατά την επανάληψη ενός αντικειμένου με `.map()` ή `.filter()`, κάθε `item` είναι ένα ζεύγος `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → λίστα ονομάτων ιδιοτήτων που δεν είναι null

## Ημερομηνία/Ώρα
- `$now` - Τρέχουσα ημερομηνία/ώρα
- `$now.format("YYYY-MM-DD")` - Μορφοποίηση ημερομηνίας/ώρας
- `$now.toISO()` / `.toDate()` / `.toTime()` - Μετατροπή μορφών
- `$now.addDays(n)` / `.addHours(n)` - Αριθμητική ημερομηνίας
- `$Date("2024-01-15")` - Ανάλυση συμβολοσειράς ημερομηνίας

## Αριθμητικές Πράξεις
- Βασικά μαθηματικά: `+`, `-`, `*`, `/`, `%`
- Συγκρίσεις: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Λογικοί τελεστές: `and`, `or`, `not`

## Συνθήκες Boolean
Για booleans, γράψτε την έκφραση απευθείας (μην επιβάλλετε `== true`):
- Λάθος: `$nodeName.isValid == true`
- Σωστό: `$nodeName.isValid`
- Άρνηση: `not $nodeName.isValid`

## Κανόνες & Λίστα Επιτρεπόμενων (Κρίσιμο)
### Κανόνες Τοποθέτησης `$`
- Μια αυτόνομη έκφραση συνήθως ξεκινά με ένα κορυφαίο `$`.
- Οι συμβολοσειρές προτύπων μπορούν να περιέχουν πολλαπλά `$refs`.
- Οι παράμετροι μεθόδων μπορούν επίσης να περιέχουν ένθετα `$refs` όταν θέλετε να περάσετε το αποτέλεσμα μιας άλλης έκφρασης (δυναμικό κλειδί ή ένθετη ανάλυση).
  - Έγκυρο: `$node.method(other.field)` — το `other` αναλύεται από το περιβάλλον όπως μια ετικέτα κορυφαίου επιπέδου (χωρίς `$` μέσα στο όρισμα).
  - Έγκυρο: `$node.method($other.field)` — το ένθετο `$` υποστηρίζεται στην προεπισκόπηση του παραθύρου αξιολόγησης και στην αξιολόγηση συνθηκών.
  - Έγκυρο: `$array($a.x, $b.y)`
  - Η αυτόματη συμπλήρωση μέσα στο `.get(` εισάγει διαδρομές **γυμνές** `label.field` (χωρίς κορυφαίο `$`), όπως ακριβώς μέσα στα `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Αν ολόκληρη η υποβληθείσα τιμή είναι μια μεμονωμένη διαδρομή με τελείες **χωρίς** κορυφαίο `$` (για παράδειγμα κείμενο που έχει επιλεγεί στον επεξεργαστή, όπως `execute.outputs.output.result.today`), το backend τη χειρίζεται το ίδιο όπως `$execute.outputs.output.result.today`. Τιμές που περιέχουν αλλαγή γραμμής ή επιστροφή μεταφοράς μετά την περικοπή δεν ξαναγράφονται (αποφεύγονται αμφίσημα payload πολλαπλών γραμμών). Προτιμήστε να γράφετε `$` στα αποθηκευμένα πεδία workflow· η επανεγγραφή προορίζεται κυρίως για επιθεώρηση και εργαλεία.
- Το αποτέλεσμα `Run` του παραθύρου Evaluate είναι η πηγή αλήθειας για το πώς αναλύεται μια συγκεκριμένη έκφραση.

### Εισαγωγικά σε Συμβολοσειρές Πινάκων
Κατά τη δημιουργία πινάκων με τιμές συμβολοσειρών, χρησιμοποιείτε ΠΑΝΤΑ διπλά εισαγωγικά:
- Σωστό: `$array("hello", "world")`
- Λάθος: `$array('hello', 'world')`

### ΧΡΗΣΙΜΟΠΟΙΕΙΤΕ ΜΟΝΟ ΑΥΤΕΣ ΤΙΣ ΣΥΝΑΡΤΗΣΕΙΣ (Λίστα Επιτρεπόμενων)
Χρησιμοποιείτε ΜΟΝΟ:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- τεκμηριωμένες μέθοδοι συμβολοσειρών/πινάκων/αντικειμένων

Αν μια συνάρτηση δεν αναφέρεται παραπάνω, δεν υπάρχει.

### Όρια Μεθόδων Πινάκων / Λεξικών
- Οι πίνακες μπορούν να χρησιμοποιούν ΜΟΝΟ: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Τα Αντικείμενα/Λεξικά μπορούν να χρησιμοποιούν ΜΟΝΟ: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Δεσμευμένα Ονόματα Ετικετών Κόμβων
Μην χρησιμοποιείτε αυτά τα ονόματα ως ετικέτες κόμβων: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Παραδείγματα

**Συνθήκη**: `$input.text.length > 0`

**Μήνυμα χρήστη LLM**: `$input.text`

**Μήνυμα εξόδου**: `$llm.text`

**Τιμή μεταβλητής**: `$input.count + 1`

### Παράδειγμα DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Σχετικά

- [Παράθυρο διαλόγου αξιολόγησης εκφράσεων](./expression-evaluation-dialog.md) – Επεξεργαστής με δυνατότητα επέκτασης, ζωντανή προεπισκόπηση backend και αυτόματη συμπλήρωση
- [Δυνατότητες Καμβά](./canvas-features.md) – Data pin για δοκιμή εκφράσεων χωρίς εκ νέου εκτέλεση κόμβων
- [Τύποι Κόμβων](./node-types.md) – Κόμβοι που χρησιμοποιούν εκφράσεις ([LLM](../nodes/llm-node.md), [Συνθήκη](../nodes/condition-node.md), [Έξοδος](../nodes/output-node.md), [Set](../nodes/set-node.md), κ.λπ.)
- [Sticky Note](../nodes/sticky-note-node.md) – Σημειώσεις markdown στον Καμβά με επεξεργάσιμο τίτλο, χρώμα και εμφάνιση εικόνας
- [Κόμβος Agent](../nodes/agent-node.md) – Χρήση εκφράσεων σε prompts agent
- [Μόνιμη Μνήμη Agent](./agent-persistent-memory.md) – `persistentMemoryEnabled` και `memoryShares` στο `data` του agent (όχι πεδία έκφρασης)
- [Δομή Workflow](./workflow-structure.md) – Πεδία `data` κόμβων που δέχονται εκφράσεις
- [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) – Διαπιστευτήρια που αναφέρονται από κόμβους
- [Κοινή Χρήση Διαπιστευτηρίων](./credentials-sharing.md) – Κοινή χρήση διαπιστευτηρίων και χρήση του `$credentials` σε εκφράσεις
- [Καθολικές Μεταβλητές](./global-variables.md) – Μόνιμες μεταβλητές με `$global`
