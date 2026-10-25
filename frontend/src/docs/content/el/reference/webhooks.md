# Webhooks

Τα Workflows μπορούν να ενεργοποιηθούν μέσω HTTP webhooks. Το τυπικό endpoint εκτέλεσης επιστρέφει JSON, ενώ η παραλλαγή streaming επιστρέφει Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Αντικαταστήστε το `{workflow_id}` με το UUID του workflow. Το βασικό URL είναι η παρουσία σας στο Heym (π.χ. `https://app.heym.ai`).

## Μέθοδος Αίτησης

Κάθε workflow δέχεται ένα HTTP verb, το οποίο επιλέγεται στο παράθυρο διαλόγου cURL του editor: `GET`, `POST`, `PUT` ή `DELETE`. **Το `POST` είναι η προεπιλογή**, και κάθε workflow που δημιουργήθηκε πριν από την ύπαρξη αυτής της ρύθμισης τη διατηρεί, επομένως τίποτα από όσα λειτουργούν σήμερα δεν αλλάζει.

Η κλήση ενός workflow με διαφορετικό verb επιστρέφει `405 Method Not Allowed` με header `Allow` που ονομάζει το ρυθμισμένο verb:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Μία εξαίρεση: τα αιτήματα που φέρουν `?test_run=true` παρακάμπτουν τον έλεγχο. Αυτό αποστέλλουν το κουμπί **Run** του editor και το panel αποσφαλμάτωσης, ώστε ένα workflow ρυθμισμένο σε `GET` να παραμένει δοκιμάσιμο μέσα από το προϊόν.

### Μέθοδοι χωρίς σώμα

Τα `GET` και `DELETE` δεν φέρουν σώμα αίτησης. Τα inputs προέρχονται από το query string και διαβάζονται με `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

Το παράθυρο διαλόγου cURL αποκρύπτει τον editor σώματος αίτησης και αφαιρεί το header `Content-Type` για αυτές τις δύο μεθόδους.

Συνδυάστε το `GET` με έναν [HTML output mapper](../nodes/html-output-mapper-node.md) για να σερβίρετε μια σελίδα που μπορεί να ανοίξει απευθείας ένας browser.

## Endpoint Streaming

`POST /api/workflows/{workflow_id}/execute/stream`

Χρησιμοποιήστε το endpoint streaming όταν επιθυμείτε σταδιακά συμβάντα εκτέλεσης αντί για μία μόνο απάντηση JSON. Ανατρέξτε στο [SSE Streaming](./sse-streaming.md) για το πρωτόκολλο συμβάντων και τη ρύθμιση του μηνύματος έναρξης ανά node.

## Μορφή Αίτησης

Το σώμα αίτησης περνά ως `body` στους [Input](../nodes/input-node.md) nodes. Το Heym δέχεται και τις δύο μορφές αίτησης:

- **Raw JSON** – π.χ. `{"userId": "123", "action": "create"}`
- **Wrapped format** – `{"inputs": {...}, "test_run": false}`

Όταν χρησιμοποιείται η wrapped format, το `inputs` εξάγεται και περνά ως `body`. Το `test_run` παρακάμπτει το rate limiting και την προσωρινή αποθήκευση απαντήσεων. Μπορείτε επίσης να στείλετε `?test_run=true` ως query parameter κατά την αποστολή raw JSON.

## Λειτουργίες Σώματος Αίτησης

Κάθε workflow έχει μια ρύθμιση `webhook_body_mode` που ελέγχει πώς ο editor δημιουργεί δείγματα αιτημάτων:

| Λειτουργία | Συμπεριφορά |
|------|----------|
| **defined** | Ο editor και το παράθυρο διαλόγου cURL διαμορφώνουν το παράδειγμα σώματος από τα πεδία του Input node του workflow και διατηρούν τα κενά κλειδιά στο JSON payload. Τα υπάρχοντα cURL payloads defined-style συνεχίζουν να λειτουργούν. |
| **generic** | Ο editor και το παράθυρο διαλόγου cURL χρησιμοποιούν ένα ελεύθερης μορφής σώμα JSON. Το σώμα αίτησης περνά ως έχει, ώστε οι εξωτερικές εφαρμογές να μπορούν να στέλνουν τη δική τους σταθερή μορφή payload. |

Το API εκτέλεσης παραμένει συμβατό προς τα πίσω και στις δύο λειτουργίες. Τα αιτήματα raw JSON και wrapped `{ "inputs": ... }` εξακολουθούν να γίνονται δεκτά και με τους δύο τρόπους.

Τα headers και τα query params είναι διαθέσιμα σε εκφράσεις ως `$input.headers` και `$input.query`. Τα κλειδιά των headers μετατρέπονται σε πεζά.

## Έλεγχος Ταυτότητας

Ρυθμίζεται ανά workflow στον editor (ρυθμίσεις workflow). Ο έλεγχος ταυτότητας πραγματοποιείται πριν από την εκτέλεση.

| auth_type | Συμπεριφορά |
|-----------|----------|
| **anonymous** | Δεν απαιτείται έλεγχος ταυτότητας. Οποιοσδήποτε μπορεί να καλέσει το endpoint. |
| **jwt** | Απαιτείται Bearer token. Δέχεται είτε token συνεδρίας χρήστη (ο χρήστης πρέπει να έχει πρόσβαση στο workflow) είτε ένα scoped [Execution Token](./execution-tokens.md) που δημιουργήθηκε για αυτό το workflow. |
| **header_auth** | Πρέπει να ταιριάζει ένα προσαρμοσμένο header. Ορίστε `auth_header_key` (π.χ. `X-API-Key`) και `auth_header_value`. |

Για το `header_auth`, η τιμή του header αίτησης πρέπει να ταιριάζει ακριβώς με τη ρυθμισμένη τιμή. Χρήστες JWT με πρόσβαση στο workflow μπορούν επίσης να καλέσουν χωρίς το προσαρμοσμένο header.

Για το `jwt`, τα [Execution Tokens](./execution-tokens.md) είναι ο συνιστώμενος τρόπος κλήσης workflows από εξωτερικά συστήματα — είναι scoped σε ένα μόνο workflow και μπορούν να ανακληθούν ανεξάρτητα.

## Προσωρινή Αποθήκευση Απαντήσεων

Ρυθμίστε το `cache_ttl_seconds` ανά workflow. Όταν οριστεί και είναι μεγαλύτερο από 0:

- **Κλειδί cache**: SHA256 hash των `workflow_id` + `body` + `query`
- **Cache hit**: Επιστρέφει αμέσως με `status: "cached"` και τα αποθηκευμένα outputs
- **Cache set**: Μόνο μετά από επιτυχή εκτέλεση (`status: "success"`)
- **Αποθήκευση**: Υποστηρίζεται από Postgres και κοινοποιείται μεταξύ backend workers

| Ρύθμιση | Αποτέλεσμα |
|---------|--------|
| `cache_ttl_seconds` = 0 ή null | Η προσωρινή αποθήκευση απενεργοποιημένη |
| `cache_ttl_seconds` > 0 | Οι απαντήσεις αποθηκεύονται προσωρινά για τόσα δευτερόλεπτα |

Τα αιτήματα `test_run` παρακάμπτουν την cache (χωρίς ανάγνωση, χωρίς εγγραφή).

Όταν η προσωρινή αποθήκευση απαντήσεων είναι ενεργοποιημένη στο παράθυρο διαλόγου cURL, η επιλογή **Clear cache** εκκαθαρίζει αμέσως τις αποθηκευμένες απαντήσεις του τρέχοντος workflow.

## Περιορισμός Ρυθμού

Ρυθμίζεται ανά workflow: `rate_limit_requests` και `rate_limit_window_seconds`.

- **Εμβέλεια**: Ανά `workflow_id` + IP πελάτη (sliding window)
- **Υπέρβαση**: HTTP 429 με header `Retry-After`
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Ρύθμιση | Περιγραφή |
|---------|-------------|
| `rate_limit_requests` | Μέγιστος αριθμός αιτημάτων που επιτρέπονται στο παράθυρο |
| `rate_limit_window_seconds` | Διάρκεια παραθύρου σε δευτερόλεπτα |

Τα αιτήματα `test_run` παρακάμπτουν τον περιορισμό ρυθμού.
<a id="concurrency-limit-and-queued-runs"></a>

## Όριο ταυτοχρονισμού και εκτελέσεις σε ουρά

Ένα workflow μπορεί να περιορίσει τον αριθμό των εκτελέσεων παραγωγής που εκτελούνται ταυτόχρονα. Ενεργοποιήστε το **Όριο ταυτοχρονισμού** στον πίνακα **Properties** σε επίπεδο workflow και ορίστε το **Μέγιστες ταυτόχρονες εκτελέσεις**. Οι ιδιοκτήτες και οι συνεργάτες με δικαίωμα επεξεργασίας μπορούν να το αλλάξουν. Το όριο είναι απενεργοποιημένο από προεπιλογή.

Όταν συμπληρωθεί το όριο, οι νέες εκτελέσεις περιμένουν σε μια ουρά FIFO (πρώτο μέσα, πρώτο έξω). Αυτό καλύπτει κάθε σημείο εισόδου παραγωγής: αυτό το endpoint, το [endpoint streaming](./sse-streaming.md), το [Portal](./portal.md), το [Quick Drawer](./quick-drawer.md), το [MCP](../tabs/mcp-tab.md) και κάθε [trigger](./triggers.md). Οι δοκιμαστικές εκτελέσεις του ίδιου του επεξεργαστή ξεκινούν πάντα αμέσως και δεν καταλαμβάνουν θέση. Η αποστολή του `test_run=true` χωρίς συνδεδεμένη συνεδρία που μπορεί να ανοίξει το workflow δεν παρακάμπτει την ουρά.

| Ρύθμιση | Περιγραφή |
|---|---|
| `concurrency_limit` | Επιτρεπόμενες εκτελέσεις παραγωγής ταυτόχρονα. Το `0` απενεργοποιεί το όριο |
| `concurrency_max_queue` | Προαιρετικό. Εκτελέσεις που επιτρέπεται να περιμένουν ταυτόχρονα. Κενό σημαίνει χωρίς όριο |
| `concurrency_max_wait_seconds` | Προαιρετικό. Μια εκτέλεση που περιμένει περισσότερο καταγράφεται ως `expired`. Κενό σημαίνει αναμονή όσο χρειαστεί |

### 202 Accepted

Μια κλήση που ξεκινά αμέσως συμπεριφέρεται ακριβώς όπως περιγράφεται στην ενότητα Μορφή Απόκρισης. Μια κλήση που πρέπει να περιμένει λαμβάνει αμέσως `202 Accepted`, ανεξάρτητα από το τι αναφέρει το `X-Simple-Response`, με μια επικεφαλίδα `Location` που δείχνει στο URL κατάστασής της:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Πεδίο | Περιγραφή |
|---|---|
| `queue.position` | Η θέση αυτής της εκτέλεσης στην ουρά, ξεκινώντας από το 1 |
| `queue.size` | Εκτελέσεις που περιμένουν αυτή τη στιγμή |
| `queue.running` | Εκτελέσεις που καταλαμβάνουν θέση αυτή τη στιγμή |
| `queue.limit` | Το όριο ταυτοχρονισμού του workflow |
| `status_token` | Μόνο για ανώνυμα workflows. Επιστρέφεται μία φορά, σε αυτήν την απόκριση |

### Status URL

Το `GET /api/workflows/{workflow_id}/executions/{execution_id}/status` αποκρίνεται με την κατάσταση της εκτέλεσης. Καλέστε το με τα ίδια διαπιστευτήρια που ξεκίνησαν την εκτέλεση: μια συνεδρία ή JWT, ένα [διακριτικό εκτέλεσης](./execution-tokens.md) ή την προσαρμοσμένη επικεφαλίδα του workflow. Ένα ανώνυμο workflow δεν διαθέτει διαπιστευτήρια για έλεγχο, επομένως στείλτε το `status_token` από το 202 στην επικεφαλίδα `X-Heym-Run-Token`. Το διακριτικό δεν διαβάζεται ποτέ από το query string. Ένα εσφαλμένο ή ελλιπές διακριτικό λαμβάνει `404`, όπως και μια άγνωστη εκτέλεση.

```json
{
  "execution_id": "...",
  "workflow_id": "...",
  "status": "success",
  "queue": null,
  "outputs": { "done": { "result": "ok" } },
  "error": null,
  "execution_time_ms": 5120
}
```

| `status` | Σημασία (μια εκτέλεση που πρέπει να περιμένει για θέση ταυτοχρονισμού λαμβάνει την [απόκριση 202](#202-accepted) αντ' αυτού) |
|---|---|
| `queued` | Αναμονή για θέση. Το `queue` δείχνει τη θέση |
| `running` | Έχει δεσμεύσει θέση και εκτελείται |
| `success` / `error` | Ολοκληρώθηκε. Τα `outputs` και `error` έχουν συμπληρωθεί |
| `pending` | Σε παύση για [ανθρώπινο έλεγχο](./human-in-the-loop.md) |
| `cancelled` | Ακυρώθηκε από το [Ιστορικό εκτελέσεων](./execution-history.md) |
| `expired` | Περίμενε περισσότερο από το `concurrency_max_wait_seconds` και δεν εκτελέστηκε ποτέ |

Κάντε polling κάθε λίγα δευτερόλεπτα μέχρι η κατάσταση να μην είναι `queued` ή `running`. Μια εκτέλεση σε ουρά εκτελείται ακόμη και αν κανείς δεν κάνει polling.

### Πλήρης ουρά

Όταν έχει οριστεί το `concurrency_max_queue` και περιμένουν ήδη τόσες εκτελέσεις, η κλήση απορρίπτεται με `429 Concurrency queue is full` και μια εγγραφή `queue_full` στο ιστορικό εκτελέσεων. Τίποτα δεν μπαίνει στην ουρά.

## Μορφή Απόκρισης

Το endpoint επιστρέφει JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Πεδίο | Περιγραφή |
|-------|-------------|
| `workflow_id` | UUID του Workflow |
| `status` | `success`, `error`, `cached` ή `rate_limited` |
| `outputs` | Έξοδοι των terminal nodes. Όταν ως μοναδικό terminal υπάρχει ένας μόνο [JSON output mapper](../nodes/json-output-mapper-node.md), το σώμα της απόκρισης είναι αυτό το mapped αντικείμενο στο ανώτατο επίπεδο (προεπιλεγμένες απλές αποκρίσεις JSON). Διαφορετικά, περιλαμβάνει το [Output](../nodes/output-node.md) και άλλα terminals με κλειδί την ετικέτα τους. |
| `execution_time_ms` | Χρόνος εκτέλεσης σε χιλιοστά του δευτερολέπτου (0 για cached/rate_limited) |

Σε περίπτωση σφάλματος, το `outputs` ενδέχεται να περιέχει λεπτομέρειες σφάλματος. Ένας node [Throw Error](../nodes/throw-error-node.md) μπορεί να ορίσει προσαρμοσμένο κωδικό κατάστασης HTTP (4xx/5xx).

## Παράθυρο διαλόγου Run with cURL

Το κουμπί της γραμμής εργαλείων **Run with cURL** (επάνω δεξιά του editor, εικονίδιο `cURL`) ανοίγει ένα παράθυρο διαλόγου που δημιουργεί και αντιγράφει μια έτοιμη προς εκτέλεση εντολή cURL για το τρέχον workflow.

### Τι Κάνει

| Πεδίο | Περιγραφή |
|-------|-------------|
| **Request Body Mode** | Επιλέξτε **Defined** ή **Generic**. Το Generic διατηρεί το σώμα ως ακατέργαστο JSON αντί να το διαμορφώνει από τα πεδία Input. |
| **Authentication** | Επιλέξτε Anonymous, JWT Token ή Header Auth. Ορίζει το σωστό auth header στην εντολή. Όταν επιλεγεί JWT Token, το παράθυρο διαλόγου εμφανίζει έναν διαχειριστή [Execution Token](./execution-tokens.md) — δημιουργήστε ή επιλέξτε ένα token για να το ενσωματώσετε απευθείας στην εντολή. |
| **Header Key / Value** | Εμφανίζεται όταν έχει επιλεγεί Header Auth. Προσυμπληρώνεται από τις ρυθμίσεις auth του workflow. |
| **Response Cache** | Λεπτά για την προσωρινή αποθήκευση πανομοιότυπων αποκρίσεων (0 = απενεργοποιημένο). Οι αλλαγές αποθηκεύονται στο workflow. Όταν είναι ενεργοποιημένο, το **Clear cache** εκκαθαρίζει αμέσως τις προσωρινά αποθηκευμένες αποκρίσεις. |
| **Rate Limit** | Μέγιστος αριθμός αιτημάτων ανά χρονικό παράθυρο. Οι αλλαγές αποθηκεύονται στο workflow. |
| **SSE Streaming** | Αλλάζει την εντολή σε `/execute/stream`, προσθέτει `--no-buffer` και εκθέτει ρυθμίσεις μηνυμάτων `node_start` ανά node. |
| **Body** | Σώμα αιτήματος JSON. Στη λειτουργία Defined προσυμπληρώνεται από τα πεδία [Input](../nodes/input-node.md) και διατηρεί τα κενά κλειδιά. Στη λειτουργία Generic είναι ένας ακατέργαστος editor JSON. |
| **Command** | Προεπισκόπηση μόνο για ανάγνωση της πλήρους εντολής cURL. |

Κάντε κλικ στο **Copy cURL** για να αντιγράψετε την εντολή στο πρόχειρο.

### Παράδειγμα

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Στη λειτουργία Generic, τα ένθετα payloads παραμένουν άθικτα, για παράδειγμα:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Το παράθυρο διαλόγου αντικατοπτρίζει τις ρυθμίσεις authentication, body mode, caching και rate-limit που είναι αποθηκευμένες στο workflow — η επεξεργασία τους εδώ ενημερώνει αμέσως το workflow.

### SSE Streaming στο Παράθυρο Διαλόγου

Ενεργοποιήστε το **SSE Streaming** όταν θέλετε η παραγόμενη εντολή να παρακολουθεί την εκτέλεση σε πραγματικό χρόνο από το terminal σας.

- Το endpoint αλλάζει από `/execute` σε `/execute/stream`
- Η εντολή προσθέτει `--no-buffer` και `Accept: text/event-stream`
- Κάθε μη sticky node εμφανίζεται σε μια λίστα όπου μπορείτε να:
  - ενεργοποιήσετε ή να απενεργοποιήσετε το μήνυμα `node_start`
  - προσαρμόσετε το κείμενο του μηνύματος έναρξης
- Τα συμβάντα `node_complete` εκπέμπονται πάντα και περιλαμβάνουν την πλήρη έξοδο του node

Παράδειγμα:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Για το πλήρες πρωτόκολλο συμβάντων και παραδείγματα, ανατρέξτε στο [SSE Streaming](./sse-streaming.md).

## Επισήμανση Πηγής Trigger

Κάθε εκτέλεση αποθηκεύει μια ετικέτα `trigger_source` ορατή στο [Execution History](./execution-history.md). Ορίστε την στέλνοντας το header `X-Trigger-Source` με οποιαδήποτε τιμή επιθυμείτε:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Το κουμπί **Copy cURL** στο παράθυρο διαλόγου του editor περιλαμβάνει αυτόματα το `X-Trigger-Source: API`. Μπορείτε να αντικαταστήσετε το `API` με οποιαδήποτε σημαντική τιμή — `scheduler`, `rabbitmq`, `github-actions` κ.λπ.

Εάν το header δεν σταλεί, το `trigger_source` έχει προεπιλεγμένη τιμή `"API"` και η εκτέλεση επισημαίνεται ως **API** στο ιστορικό. Παρακάμψτε το με οποιαδήποτε τιμή έχει νόημα για το σύστημά σας — `scheduler`, `github-actions`, `rabbitmq` κ.λπ.

## Σχετικά

- [Execution Tokens](./execution-tokens.md) – Scoped JWTs για την κλήση workflows από εξωτερικά συστήματα
- [SSE Streaming](./sse-streaming.md) – Μετάδοση συμβάντων node σε πραγματικό χρόνο μέσω Server-Sent Events
- [Triggers](./triggers.md) – Όλα τα σημεία εισόδου του workflow, συμπεριλαμβανομένου του webhook
- [Workflow Structure](./workflow-structure.md) – Nodes και edges
- [Expression DSL](./expression-dsl.md) – Πρόσβαση σε `$input.body`, `$input.headers`, `$input.query`
