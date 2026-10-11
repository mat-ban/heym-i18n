# Triggers

Τα Workflows ξεκινούν από **trigger nodes** ή **entry points**. Κάθε τύπος trigger έχει το δικό του endpoint ή διεργασία παρασκηνίου.

## Trigger Nodes

Κόμβοι εκκίνησης (χωρίς εισερχόμενες ακμές) που ξεκινούν την εκτέλεση:

| Τύπος Κόμβου | Περιγραφή |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | Σημείο εισόδου HTTP. Λαμβάνει `body`, `headers`, `query` από αιτήματα. |
| [Cron](../nodes/cron-node.md) | Εκτελείται βάσει χρονοδιαγράμματος (έκφραση cron, π.χ. `0 * * * *` για ωριαία εκτέλεση). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Ξεκινά όταν το Telegram στέλνει ενημέρωση webhook bot στο webhook URL που αντιστοιχεί στον κόμβο. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Ξεκινά όταν το Discord στέλνει webhook του Interactions API στο endpoint που αντιστοιχεί στον κόμβο. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Κάνει polling σε γραμματοκιβώτιο IMAP και ξεκινά μία φορά για κάθε νεοεντοπισμένο email. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Ξεκινά όταν το Heym δημοσιεύει ένα συμβάν πλατφόρμας. Τα συμβάντα σε ένα παράθυρο αποστολής φτάνουν μαζί ως array. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Ανοίγει εξερχόμενη σύνδεση client προς εξωτερικό socket και ξεκινά σε επιλεγμένα συμβάντα socket. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Δημιουργεί URL μεταφόρτωσης μίας χρήσης και ξεκινά όταν ένας caller στέλνει μεγάλο multipart αρχείο. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Ξεκινά όταν καταναλώνεται ένα μήνυμα από ουρά RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Ξεκινά όταν το Slack στέλνει ένα συμβάν μέσω webhook του Events API. |

## Entry Points

| Trigger | Endpoint / Πηγή | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | Κεφαλίδα `X-MCP-Key` ή `Authorization: Bearer` (μόνο headers) |
| **Portal** | `POST /api/portal/{slug}/execute` | Token συνεδρίας Portal |
| **Board** | Μετακίνηση κάρτας [Board](../tabs/board-tab.md) / follow-up run σε στήλη με workflow chain (`trigger_source="board"`) | JWT (κάτοχος board) |
| **Cron** | Χρονοπρογραμματιστής Cron (εκτελείται κάθε 60s, αξιολογεί εκφράσεις cron) | N/A |
| **IMAP** | Διαχειριστής trigger IMAP (leader worker, διάστημα polling ανά κόμβο) | Όνομα χρήστη/κωδικός IMAP |
| **WebSocket** | Διαχειριστής εξερχόμενου trigger WebSocket (leader worker, μόνιμες συνδέσεις client) | Προαιρετικές κεφαλίδες ανά κόμβο |
| **File Upload** | `POST /api/file-intake/u/{token}` αφού δημιουργηθεί ένα slot | Token δυνατότητας μίας χρήσης |
| **RabbitMQ** | Καταναλωτής RabbitMQ (leader worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | Μυστικό υπογραφής HMAC-SHA256 |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Δημόσιο κλειδί εφαρμογής Ed25519 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Προαιρετικό `x-telegram-bot-api-secret-token` |
| **Editor** | Ίδιο με το Webhook, μέσω `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: Το σώμα του αιτήματος περνά ως `body` στους κόμβους textInput
- **Body mode**: Τα Workflows μπορούν να χρησιμοποιούν παραδείγματα με σχήμα πεδίων `defined` ή ακατέργαστα παραδείγματα JSON `generic` στον editor και στο παράθυρο διαλόγου cURL
- **Auth**: Ρυθμίζεται ανά workflow (`auth_type`, `allow_anonymous`)

Ανατρέξτε στο [Webhooks](./webhooks.md) για λεπτομέρειες σχετικά με TTL, cache, rate limiting και auth.

### MCP

Τα Workflows με `mcp_enabled=true` εμφανίζονται ως εργαλεία σε clients MCP. Το όνομα του εργαλείου προκύπτει από το όνομα του workflow. Ανατρέξτε στην [MCP Tab](../tabs/mcp-tab.md).

### Portal

Δημόσιο UI chat στο `/chat/{slug}`. Ανατρέξτε στο [Portal](./portal.md) για λεπτομέρειες.

### Cron

Ο χρονοπρογραμματιστής cron εκτελείται κάθε 60 δευτερόλεπτα, εντοπίζει workflows με ενεργούς κόμβους `cron`, αξιολογεί εκφράσεις cron και εκτελεί τα αντίστοιχα workflows. Το input περιλαμβάνει `{"triggered_by": "cron"}`.

### IMAP

Ο διαχειριστής trigger IMAP εκτελείται στον leader worker και ελέγχει τους ενεργούς κόμβους `imapTrigger` στο ρυθμισμένο `pollIntervalMinutes` τους. Κάθε κόμβος αποθηκεύει έναν δείκτη IMAP (`UIDVALIDITY` + τελευταίο UID που εντοπίστηκε). Το input περιλαμβάνει `email`, `triggered_by: "imap"`, `trigger_node_id` και `triggered_at`.

### Heym Platform Events

Ο dispatcher συμβάντων Heym κάνει polling στο αρχείο καταγραφής `heym_events` κάθε 5 δευτερόλεπτα και παραδίδει τα αντίστοιχα συμβάντα σε ενεργούς κόμβους `heymTrigger`. Η παράδοση διεκδικείται ανά (event, workflow, node) μέσω μοναδικού περιορισμού, ώστε ένα συμβάν να ενεργοποιείται ακριβώς μία φορά ανά συνδρομητικό κόμβο σε κάθε worker, container και μηχάνημα. Κάθε συμβάν που διεκδικείται σε ένα πέρασμα παραδίδεται σε μία μόνο εκτέλεση: το input περιλαμβάνει `events` (πάντα array, από το παλαιότερο πρώτα), `count`, `triggered_by: "heym_event"`, `trigger_node_id` και `triggered_at`. Μόνο συμβάντα που δημοσιεύτηκαν τα τελευταία 5 λεπτά αποστέλλονται, γεγονός που αποτρέπει την αναπαραγωγή συσσωρευμένων συμβάντων μετά από διακοπή λειτουργίας· τα συμβάντα διατηρούνται για 7 ημέρες.

### WebSocket

Ο διαχειριστής trigger WebSocket εκτελείται στον leader worker και διατηρεί μία εξερχόμενη σύνδεση client ανά ενεργό κόμβο [WebSocket Trigger](../nodes/websocket-trigger-node.md). Μπορεί να εκπέμπει εκτελέσεις για `onMessage`, `onConnected` και `onClosed`. Το input περιλαμβάνει `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` και ένα από τα `message`, `connection` ή `close`.
### Μεταφόρτωση Αρχείου

Το [Trigger Μεταφόρτωσης Αρχείου](../nodes/file-upload-trigger-node.md) δημιουργεί μια θέση μεταφόρτωσης με περιορισμένο TTL και μίας χρήσης, όταν το workflow καλείται μέσω του API, του MCP ή του καμβά. Η μεταφόρτωση multipart form data στο `POST /api/file-intake/u/{token}` καταναλώνει τη θέση, αποθηκεύει το αρχείο ως αρχείο Drive και εκκινεί το workflow σύγχρονα. Η είσοδος περιλαμβάνει `file`, `uploaded_at`, `triggered_by: "file_upload"` και μεταδεδομένα μεταφόρτωσης.

### Telegram

Το Telegram αποστέλλει ενημερώσεις bot webhook στο `POST /api/telegram/webhook/{node_id}`. Το payload μεταβιβάζεται στο workflow ως `update`, `message`, προαιρετικό `callback_query`, καθαρισμένα `headers`, `triggered_by`, `trigger_node_id` και `triggered_at`. Εάν το επιλεγμένο διαπιστευτήριο διαθέτει secret token, το Heym επαληθεύει το `x-telegram-bot-api-secret-token` πριν από την εκτέλεση.

### Discord

Το Discord αποστέλλει webhooks αλληλεπίδρασης στο `POST /api/discord/webhook/{node_id}`. Το payload μεταβιβάζεται στο workflow ως `interaction`, `type`, `data`, καθαρισμένα `headers`, `triggered_by`, `trigger_node_id` και `triggered_at`. Το Heym επαληθεύει το αίτημα χρησιμοποιώντας Ed25519 και το δημόσιο κλειδί εφαρμογής του επιλεγμένου διαπιστευτηρίου `discord_trigger` πριν από την εκτέλεση.

### RabbitMQ

Ο καταναλωτής RabbitMQ εκκινείται όταν αρχικοποιείται ο leader worker. Τα workflows με nodes `rabbitmq` όπου `rabbitmqOperation === "receive"` αποκτούν καταναλωτή. Η είσοδος περιλαμβάνει `message_data` (body, headers, routing_key κ.λπ.) και `triggered_by: "rabbitmq"`.

## trigger_source

Το ιστορικό εκτελέσεων καταγράφει το `trigger_source` για κάθε σημείο εισόδου:

| Τιμή | Πότε |
|-------|------|
| `"API"` | Κλήση Webhook / API χωρίς ρητή κεφαλίδα (προεπιλογή) |
| `"Canvas"` | Εκτέλεση από τον καμβά του επεξεργαστή workflow |
| `"Quick Drawer"` | Εκτέλεση από τον πίνακα quick-drawer του επεξεργαστή |
| `"cron"` | Χρονοπρογραμματιστής Cron |
| `"imap"` | Διαχειριστής Trigger IMAP |
| `"websocket"` | Διαχειριστής Trigger εξερχόμενου WebSocket |
| `"file_upload"` | Endpoint μεταφόρτωσης του Trigger Μεταφόρτωσης Αρχείου |
| `"telegram"` | Webhook bot Telegram |
| `"Discord"` | Webhook αλληλεπιδράσεων Discord |
| `"MCP"` | Κλήση εργαλείου MCP |
| `"portal"` | Εκτέλεση Portal |
| `"dashboard_chat"` | Chat βοηθού AI |
| `"AI Agents"` | Υπο-workflow που καλείται από node AI agent |
| `"SUB_WORKFLOW"` | Υπο-workflow που καλείται από node Execute Workflow |
| προσαρμοσμένη | Οποιαδήποτε τιμή αποστέλλεται στην κεφαλίδα `X-Trigger-Source` ή στη παράμετρο query/body `trigger_source` |
| (δεν έχει οριστεί) | Καταναλωτής RabbitMQ |

## Είσοδοι ανά Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` από το αίτημα
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + προαιρετικό `callback_query` + καθαρισμένα `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + καθαρισμένα `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Μεταφόρτωση Αρχείου**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (πλήρες αντικείμενο συμβάντος Slack) + `headers` (καθαρισμένα) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + προαιρετικό `conversation_history`

## Σχετικά

- [Webhooks](./webhooks.md) – TTL Webhook, cache, όριο ρυθμού, έλεγχος ταυτότητας
- [Δομή Workflow](./workflow-structure.md) – Nodes και edges
- [Τύποι Node](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Trigger webhook αλληλεπιδράσεων Discord
- [Γρήγορη Εκκίνηση](../getting-started/quick-start.md) – Δημιουργία workflow με Input
- [Portal](./portal.md) – Trigger Portal και UI chat
- [Ιστορικό Εκτελέσεων](./execution-history.md) – Προβολή προηγούμενων εκτελέσεων και trigger_source
