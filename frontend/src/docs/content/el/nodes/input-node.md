# Input

Ο **node** Input αποτελεί το σημείο εισόδου για workflows που λαμβάνουν δεδομένα από τον χρήστη ή τον καλούντα του API. Υποστηρίζει ένα ή περισσότερα πεδία εισόδου και εκθέτει μεταδεδομένα αιτήματος (headers, query params).

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 0 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό node (camelCase) |
| `value` | string | Προεπιλεγμένη τιμή για μεμονωμένη είσοδο κειμένου (προαιρετικό) |
| `inputFields` | array | Ορισμοί πεδίων εισόδου. Κάθε ένα: `{ key, defaultValue? }` |

### Πεδία Εισόδου

| Πεδίο | Τύπος | Περιγραφή |
|-------|------|-------------|
| `key` | string | Κλειδί πεδίου (π.χ. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Προεπιλογή εάν δεν παρέχεται (προαιρετικό) |

## Πρόσβαση στα Δεδομένα Εισόδου

**Πεδία body** (χρησιμοποιείτε πάντα `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – πεδίο κειμένου
- `$userInput.body.imageUrl` – URL εικόνας
- `$userInput.body.userId` – με προεπιλογή εάν έχει ρυθμιστεί
- `$userInput.body.event.user.id` – ένθετο JSON από λειτουργία Generic webhook

**Μεταδεδομένα αιτήματος** (όταν εκτελείται μέσω API):

- `$userInput.headers` – όλα τα headers (κλειδιά με πεζά γράμματα)
- `$userInput.headers.authorization` – συγκεκριμένο header
- `$userInput.query` – query parameters
- `$userInput.query.param1` – συγκεκριμένο query param

## Είσοδος Αρχείου στο Run Panel

Στην καρτέλα **Run** του editor (λειτουργία Defined webhook), κάθε πεδίο εισόδου υποστηρίζει drag-and-drop και ένα ενσωματωμένο στοιχείο επισύναψης (κάτω δεξιά του πεδίου):

- **Αρχεία κειμένου** (`.txt`, `.md`, `.json`, `.csv` και παρόμοια) διαβάζονται ως απλό κείμενο.
- **Εικόνες** (JPEG, PNG, GIF, WebP) αποθηκεύονται ως URL `data:` (base64) στην τιμή του πεδίου — χρησιμοποιήστε κλειδιά πεδίων όπως `imageUrl` ή `base64` όταν οι επόμενοι nodes αναμένουν δεδομένα εικόνας.
- **Αρχεία PDF** μετατρέπονται σε εξαγόμενο κείμενο (μέγιστο μέγεθος αρχείου 5 MB, 100k χαρακτήρες περιεχομένου).

Ένα αρχείο ανά πεδίο. Μπορείτε ακόμα να επεξεργαστείτε το textarea αφού φορτωθεί ένα αρχείο. Η λειτουργία Generic webhook (raw JSON body) δεν εμφανίζει στοιχεία ελέγχου αρχείων ανά πεδίο.

## Πεδία Εισόδου vs Generic Webhooks

Τα `inputFields` εξακολουθούν να περιγράφουν τα αναμενόμενα inputs για φόρμες editor σε defined mode, αντιστοίχιση sub-workflow και άλλες επιφάνειες που βασίζονται σε μεταδεδομένα.

Όταν ένα workflow χρησιμοποιεί λειτουργία **Generic** webhook body, το εισερχόμενο HTTP body δεν αναδιαμορφώνεται από τα `inputFields`. Αντ' αυτού, το raw JSON payload περνά απευθείας στο `$nodeLabel.body`, και τα στοιχεία ελέγχου προσθήκης/αφαίρεσης πεδίων του node Input αποκρύπτονται στο panel του node.

## Παραδείγματα

**Μεμονωμένη είσοδος (προεπιλογή):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Πολλαπλές είσοδοι:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
- [Triggers](../reference/triggers.md) – Σημεία εισόδου (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Αναφορά σε `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Έκθεση workflows ως chat UIs
- [Webhooks](../reference/webhooks.md) – HTTP trigger για workflows
