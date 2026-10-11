# Τύποι Κόμβων

Το Heym παρέχει μια ποικιλία τύπων κόμβων για τη δημιουργία workflows. Χρησιμοποιήστε [εκφράσεις](./expression-dsl.md) όπως `$input.text` και `$nodeLabel.field` στη διαμόρφωση των κόμβων.

## Κόμβοι Trigger

| Κόμβος | Περιγραφή | Έξοδοι |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Σημείο εισόδου κειμένου για το workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger βάσει χρονοδιαγράμματος (έκφραση cron) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger όταν φτάνει ενημέρωση webhook από bot του Telegram | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger όταν το Slack στέλνει webhook του Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger όταν το Discord στέλνει webhook αλληλεπίδρασης εφαρμογής | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger όταν φτάνει νέο email σε γραμματοκιβώτιο IMAP | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger όταν το Heym δημοσιεύει συμβάν της πλατφόρμας (ομαδοποιημένος πίνακας) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger από εξερχόμενη σύνδεση προς εξωτερικό διακομιστή WebSocket | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Δημιουργία συνδέσμου μεταφόρτωσης μίας χρήσης και έναρξη όταν μεταφορτωθεί μεγάλο αρχείο | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger όταν λαμβάνεται μήνυμα από ουρά | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Εκτελείται όταν προκύψει σφάλμα σε οποιονδήποτε κόμβο (χωρίς εισερχόμενη ακμή) | 1 |

Ανατρέξτε στα [Triggers](./triggers.md) για όλα τα σημεία εισόδου.

## Κόμβοι AI

| Κόμβος | Περιγραφή | Είσοδοι | Έξοδοι |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Επεξεργασία κειμένου με μοντέλο γλώσσας | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Υποβολή ερωτήσεων με τύπο σε μοντέλο αποφάσεων και διακλάδωση βάσει των πιθανοτήτων που επιστρέφει | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM με κλήση εργαλείων, skills, MCP, προαιρετική [ανθρώπινη αξιολόγηση](./human-in-the-loop.md) και προαιρετικό [γράφο επίμονης μνήμης](./agent-persistent-memory.md). Ανατρέξτε στην [Αρχιτεκτονική Agent](./agent-architecture.md). | 1 | 1, συν προαιρετική έξοδο `review` |
| [Codex](../nodes/codex-node.md) | Εκτέλεση του τοπικού Codex CLI σε αποθετήριο GitHub χρησιμοποιώντας token πρόσβασης ChatGPT/Codex | 1 | 1, συν έξοδο `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Εκτέλεση του OpenCode CLI σε αποθετήριο GitHub σε ενισχυμένο container χρησιμοποιώντας κλειδί API της πύλης OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Απευθείας κλήση συγκεκριμένου εργαλείου MCP χωρίς επιλογή από LLM | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Εισαγωγή, upsert, διαγραφή ή αναζήτηση σε [διανυσματικό χώρο αποθήκευσης](../tabs/vectorstores-tab.md) Qdrant ή Postgres (pgvector) για RAG | 1 | 1 |

## Κόμβοι Λογικής

| Κόμβος | Περιγραφή | Είσοδοι | Έξοδοι |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Διακλάδωση βάσει if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Δρομολόγηση με αντιστοίχιση τιμής σε περιπτώσεις | 1 | n |
| [Merge](../nodes/merge-node.md) | Αναμονή για πολλαπλές εισόδους και συγχώνευση | n | 1 |
| [Loop](../nodes/loop-node.md) | Επανάληψη σε πίνακα | 1 | 2 (loop/done) |

## Κόμβοι Δεδομένων

| Κόμβος | Περιγραφή | Είσοδοι | Έξοδοι |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Μετασχηματισμός και αντιστοίχιση δεδομένων | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Μετατροπή δεδομένων μεταξύ μορφότυπων (CSV, JSON, XML) και OCR εικόνων ή PDF σε κείμενο | 1 | 1 |
| [Code](../nodes/code-node.md) | Εκτέλεση Python σε απορριπτόμενο, απομονωμένο από δίκτυο sandbox με δικό του requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Ορισμός ή λήψη μεταβλητής (τοπικής workflow ή [καθολικής](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Κλήση άλλου workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Ανάγνωση workflows και ιστορικού εκτελέσεων του Heym | 1 | 1 |
## Κόμβοι Ενσωμάτωσης

| Κόμβος | Περιγραφή | Είσοδοι | Έξοδοι |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Εκτέλεση αιτημάτων HTTP (cURL) | 0 ή 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Σύνδεση σε εξωτερικό WebSocket και αποστολή ενός μηνύματος | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Αποστολή μηνυμάτων Telegram bot | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Αποστολή μηνυμάτων Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Αποστολή μηνυμάτων Discord webhook | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Αποστολή email μέσω SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Λειτουργίες Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Ανάγνωση/εγγραφή υπολογιστικών φύλλων Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Διαχείριση αποθετηρίων, χρηστών, issues, pull requests, reviews, releases, Actions workflows και αρχείων μέσω του GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Διαχείριση έργων, issues, σχολίων, συνημμένων, χρηστών, ειδοποιήσεων και μεταβάσεων workflow του Jira μέσω του Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Διαχείριση ομάδων, έργων, issues, καταστάσεων workflow και σχολίων του Linear μέσω GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Ανάγνωση/εγγραφή Google Sheets μέσω OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Καταγραφή, λήψη, ενημέρωση και διαγραφή αρχείων Google Drive μέσω OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Εκτέλεση ερωτημάτων SQL και εισαγωγή γραμμών στο BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Υποβολή ερωτημάτων και τροποποίηση πινάκων Supabase μέσω PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Εκτέλεση λειτουργιών SQL, CRUD και count στο ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Διαχείριση βάσεων δεδομένων, πηγών δεδομένων, σελίδων και blocks του Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Διαχείριση οργανισμών, έργων, ομάδων, issues, events και releases του Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Διαχείριση buckets και φακέλων· καταγραφή, μεταφόρτωση, λήψη, αντιγραφή και διαγραφή αντικειμένων | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Ανάγνωση/εγγραφή Heym DataTables (πρωτογενής αποθήκευση) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Διαχείριση αρχείων Drive: διαγραφή, ορισμός κωδικού πρόσβασης, TTL, μέγιστου αριθμού λήψεων, κοινής χρήσης/ακύρωσης κοινής χρήσης με ομάδα | 1 | 1 |

## Κόμβοι Αυτοματισμού

| Κόμβος | Περιγραφή | Είσοδοι | Έξοδοι |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Συλλογή δεδομένων από ιστοσελίδες με FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Αυτοματισμός περιηγητή με βήμα AI και Auto Heal | 1 | 1 |

## Κόμβοι Βοηθητικών Λειτουργιών

| Κόμβος | Περιγραφή | Είσοδοι | Έξοδοι |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Καθυστέρηση εκτέλεσης | 1 | 1 |
| [Output](../nodes/output-node.md) | Endpoint εξόδου | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Αντιστοίχιση πεδίων σε αντικείμενο JSON· μοναδικός τερματικός κόμβος = σώμα webhook/εκτέλεσης ανώτατου επιπέδου | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Απόδοση σελίδας HTML· μοναδικός τερματικός κόμβος = το webhook αποκρίνεται με text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Έξοδος τερματικού widget πίνακα ελέγχου που αντιστοιχίζει ανάντη γραμμές σε payloads γραφημάτων | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Προσθήκη σημειώσεων markdown στον καμβά (δεν εκτελείται) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Καταγραφή στην κονσόλα backend | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Απενεργοποίηση άλλου κόμβου στο workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Ενεργοποίηση απενεργοποιημένου κόμβου στο workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Διακοπή workflow με απόκριση σφάλματος | 1 | 0 |

## Κόμβοι Plugin

Οι κόμβοι plugin παρέχονται από plugins που είναι εγκατεστημένα στην εγκατάσταση. Κάθε εγκατεστημένο
plugin εμφανίζεται στην παλέτα κάτω από την ενότητα **Plugins** με το δικό του όνομα· στο παρασκήνιο
αντιστοιχίζεται σε έναν από αυτούς τους δύο τύπους κόμβων.

| Κόμβος | Περιγραφή | Είσοδοι | Έξοδοι |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Προσαρμοσμένη ενέργεια που παρέχεται από εγκατεστημένο plugin | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Προσαρμοσμένο trigger που παρέχεται από εγκατεστημένο plugin | 0 | 1 |
## Σχετικά

- [Δυνατότητες Canvas](./canvas-features.md) – Data pin, αρχεία καταγραφής εκτελέσεων, ενεργοποίηση/απενεργοποίηση, εξαγωγή σε sub-workflow
- [Agent Node](../nodes/agent-node.md) – Λεπτομερής αναφορά για τον node AI Agent
- [Agent Architecture](./agent-architecture.md) – Sub-agents, orchestrator, skills, MCP, tool calling
- [Agent Persistent Memory](./agent-persistent-memory.md) – Γράφος γνώσης ανά node, κοινή χρήση και εξαγωγή στο παρασκήνιο
- [Human-in-the-Loop](./human-in-the-loop.md) – Παύση της εξόδου του agent για ανθρώπινη έγκριση
- [Expression DSL](./expression-dsl.md) – Αναφορά δεδομένων στη διαμόρφωση node
- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – Επεξεργαστής με δυνατότητα επέκτασης και ζωντανή προεπισκόπηση backend
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – Αποδοχή μεγάλων multipart μεταφορτώσεων μέσω συνδέσμων μίας χρήσης
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Trigger εξερχόμενου socket σε πραγματικό χρόνο
- [WebSocket Send](../nodes/websocket-send-node.md) – Αποστολή μηνυμάτων σε εξωτερικά sockets
- [Δομή Workflow](./workflow-structure.md) – Μορφή JSON για nodes και edges
- [Triggers](./triggers.md) – Όλα τα σημεία εισόδου workflow
- [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) – Προσθήκη API keys για LLM, HTTP και άλλους nodes
- [Κοινή Χρήση Διαπιστευτηρίων](./credentials-sharing.md) – Κοινή χρήση διαπιστευτηρίων με άλλους χρήστες
- [Portal](./portal.md) – Έκθεση workflows ως δημόσια περιβάλλοντα chat
- [Καρτέλα Διανυσματικών Χώρων Αποθήκευσης](../tabs/vectorstores-tab.md) – Δημιουργία διανυσματικών χώρων αποθήκευσης για nodes RAG
