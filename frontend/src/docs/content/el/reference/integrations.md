# Ενσωματώσεις Τρίτων

Το Heym συνδέεται με εξωτερικές υπηρεσίες μέσω **διαπιστευτηρίων**. Κάθε τύπος διαπιστευτηρίου αποθηκεύει τις λεπτομέρειες σύνδεσης για μία υπηρεσία και μπορεί να επαναχρησιμοποιηθεί σε πολλαπλούς κόμβους και workflows. Ανατρέξτε στην ενότητα [Διαπιστευτήρια](./credentials.md) για μια επισκόπηση.

Προσθέστε διαπιστευτήρια στις [Ρυθμίσεις → Διαπιστευτήρια](../tabs/credentials-tab.md). Όλες οι τιμές κρυπτογραφούνται κατά την αποθήκευση. Τα διαπιστευτήρια μπορούν να [κοινοποιηθούν](./credentials-sharing.md) με άλλους χρήστες ή [Ομάδες](./teams.md).

Ορισμένοι κόμβοι ενσωμάτωσης **δεν** απαιτούν διαπιστευτήρια. Οι κόμβοι [WebSocket Trigger](../nodes/websocket-trigger-node.md) και [WebSocket Send](../nodes/websocket-send-node.md) συνδέονται σε εξωτερικά sockets χρησιμοποιώντας το URL, τις κεφαλίδες και τα subprotocols που έχουν ρυθμιστεί απευθείας στον κόμβο.

## Επισκόπηση Τύπων Διαπιστευτηρίων

| Τύπος | Χρησιμοποιείται Από | Βασικά Πεδία |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, προαιρετικό `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, προαιρετικό `base_url` |
| **Jira** | [Jira node](../nodes/jira-node.md) | `api_token`, `base_url`, `deployment`, `auth_mode`, `email` (μόνο Basic auth), προαιρετικό `api_version` |
| **Linear** | [Linear node](../nodes/linear-node.md) | `api_key`, ή `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry node](../nodes/sentry-node.md) | `api_token`, προαιρετικό `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Αξιολογήσεις](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, προαιρετικό `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | ένα διαπιστευτήριο decision model, συν επιλογές μοντέλου που παραπέμπουν στα άλλα διαπιστευτήριά σας |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (τα vectors αποθηκεύονται στο Postgres του Heym μέσω pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, προαιρετικό `embedding_api_key`, συν `qdrant_host` όταν το `db_type` είναι `qdrant` |
| **Grist** | [Grist node](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets node](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + συγκατάθεση OAuth2 |
| **Google Drive** | [Google Drive node](../nodes/google-drive-node.md) | `client_id`, `client_secret` + συγκατάθεση OAuth2 (πλήρες πεδίο Drive) |
| **BigQuery** | [BigQuery node](../nodes/bigquery-node.md) | `client_id`, `client_secret` + συγκατάθεση OAuth2 |
| **Supabase** | [Supabase node](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, προαιρετικό `supabase_schema` |
| **ClickHouse** | [ClickHouse node](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion node](../nodes/notion-node.md) | `api_token`, ή `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 node](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger node](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger node](../nodes/telegram-trigger-node.md), [Telegram node](../nodes/telegram-node.md) | `bot_token`, προαιρετικό `secret_token` |
| **Discord** | [Discord node](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger node](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ node](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis node](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack node](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger node](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP node](../nodes/http-node.md) | `token` |
| **Header** | [HTTP node](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler node](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Το διαπιστευτήριο GitHub αποθηκεύει ένα GitHub personal access token (PAT), ώστε τα workflows να μπορούν να καλούν το GitHub REST API μέσω του [GitHub node](../nodes/github-node.md), να μεταβιβάζουν το token σε MCP servers όπως το `@modelcontextprotocol/server-github`, ή να το χρησιμοποιούν από το [HTTP node](../nodes/http-node.md) για προσαρμοσμένες κλήσεις REST.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `api_key` | GitHub personal access token (fine-grained PAT `github_pat_...` ή classic PAT `ghp_...`) |
### Προαιρετικά Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `base_url` | GitHub API base URL για GitHub Enterprise Server (για παράδειγμα `https://github.example.com/api/v3`) |

### Σημειώσεις

- Συνιστώνται fine-grained personal access tokens όταν είναι δυνατό, καθώς μπορούν να περιοριστούν σε συγκεκριμένα repositories και δικαιώματα.
- Αφήστε το `base_url` κενό για το GitHub.com. Για GitHub Enterprise Server, χρησιμοποιήστε το πλήρες REST API
  endpoint συμπεριλαμβανομένου του `/api/v3` (για παράδειγμα `https://github.example.com/api/v3`), όχι τη
  ρίζα του web UI του server, όπως `https://github.example.com`.
- Αυτό το διαπιστευτήριο μοντελοποιεί προς το παρόν μόνο PAT-based auth. Για πρόσβαση σε organization repositories, χρησιμοποιήστε ένα PAT στο οποίο έχουν εκχωρηθεί τα απαιτούμενα δικαιώματα organization/repository.
- Τα GitHub App installation tokens και οι ροές ρύθμισης GitHub App δεν είναι first-class στο Heym UI σήμερα.
- Προτιμήστε τον [GitHub node](../nodes/github-node.md) για εγγενείς λειτουργίες repository, user, issue, pull request, review, release, Actions workflow, traffic και file. Χρησιμοποιήστε τον [HTTP node](../nodes/http-node.md) μόνο όταν χρειάζεστε endpoints ή payloads που δεν καλύπτει ο GitHub node.
- Χρησιμοποιήστε τον [Agent node](../nodes/agent-node.md) με MCP περνώντας το `$credentials.YourGitHubCredential` σε μια μεταβλητή περιβάλλοντος σύνδεσης MCP, όπως `GITHUB_PERSONAL_ACCESS_TOKEN`.
- Το REST API του GitHub συνήθως αναμένει `Authorization: Bearer <token>` καθώς και `Accept: application/vnd.github+json`.
- Κατά την επεξεργασία ενός GitHub credential, αφήνοντας το GitHub Enterprise `base_url` κενό διατηρείται το
  υπάρχον endpoint. Εισαγάγετε νέο URL μόνο όταν θέλετε να αλλάξετε αυτό το endpoint.

### Χρησιμοποιείται Από

- [GitHub node](../nodes/github-node.md)
- [Codex node](../nodes/codex-node.md)
- [Agent node](../nodes/agent-node.md)
- [HTTP node](../nodes/http-node.md)

---

## Decision Model

Ένα decision model απαντά σε τυποποιημένες ερωτήσεις σχετικά με μια κατάσταση και επιστρέφει πιθανότητες αντί για κείμενο. Το Jev της TypeSafe είναι η υλοποίηση αναφοράς· οποιοδήποτε endpoint δέχεται το ίδιο σώμα `{model, state, questions}` λειτουργεί, και ο node [Decision](../nodes/decision-node.md) μπορεί να στείλει ένα χειροκίνητα γραμμένο σώμα για ένα που δεν το κάνει.

### Απαιτούμενα Πεδία

- `base_url` – το endpoint, για παράδειγμα `https://api.typesafe.ai`. Το Heym προσθέτει `/v1/systemone`.

### Προαιρετικά Πεδία

- `api_key` – αποστέλλεται ως `Authorization: Bearer`. Τα endpoints που δεν χρειάζονται κλειδί μπορούν να το αφήσουν κενό.

### Σημειώσεις

- Το **Test Connection** στέλνει μία μικροσκοπική ερώτηση για να επιβεβαιώσει ότι το endpoint και το κλειδί λειτουργούν.
- Η επεξεργασία ενός credential διατηρεί το αποθηκευμένο κλειδί όταν το πεδίο κλειδιού αφεθεί κενό.
- Τα εξερχόμενα αιτήματα προς ιδιωτικές και loopback διευθύνσεις αποκλείονται από προεπιλογή, επομένως ένα self-hosted endpoint στο `localhost` ή σε ιδιωτικό εύρος χρειάζεται `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Αυτά τα μοντέλα απουσιάζουν από τους πίνακες τιμολόγησης LLM που συγχρονίζει το Heym, επομένως η στήλη Cost στο [Traces](../tabs/traces-tab.md) παραμένει κενή. Οι μετρήσεις Token καταγράφονται ακόμα.

### Χρησιμοποιείται Από

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – βαθμολογεί τις απαντήσεις `LLM-as-Judge` έναντι του αναμενόμενου output

## OpenAI Codex

Το OpenAI Codex credential πιστοποιεί τον [Codex node](../nodes/codex-node.md). Είναι ξεχωριστό από το credential του OpenAI API key που χρησιμοποιείται από τους nodes LLM, Agent και RAG.

### Λειτουργίες Πιστοποίησης

| Λειτουργία | Περιγραφή |
|------|-------------|
| **Sign in with ChatGPT** (συνιστάται) | Σύνδεση OAuth (PKCE) που χρησιμοποιεί τη συνδρομή σας ChatGPT Plus/Pro, ώστε οι εκτελέσεις να αποφεύγουν το κόστος API ανά token. Το Heym αποθηκεύει και ανανεώνει αυτόματα το token bundle. |
| **Access token** | Ένα ChatGPT/Codex `access_token` που περνά μόνο στη τοπική διεργασία Codex CLI. |

### Σημειώσεις

- Τα API keys απορρίπτονται για αυτόν τον τύπο credential.
- Τα Codex tokens δεν εκτίθενται μέσω του `$credentials.Name`.
- Ο Codex node χρειάζεται επίσης ένα GitHub credential για repository clone, branch push και δημιουργία draft PR.

### Χρησιμοποιείται Από

- [Codex node](../nodes/codex-node.md)

## OpenCode Go

Το OpenCode Go credential πιστοποιεί τον [OpenCode Go node](../nodes/opencode-go-node.md). Αποθηκεύει ένα API key του gateway OpenCode Go (από το [opencode.ai/go](https://opencode.ai/go)) και ένα προαιρετικό gateway base URL.

### Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| **API Key** | API key του gateway OpenCode Go (απαιτείται). |
| **Gateway Base URL** | Προαιρετικό· προεπιλογή σε `https://opencode.ai/zen/go/v1`. Παρακάμψτε το μόνο για self-hosted ή proxied gateway. |

### Σημειώσεις

- Το API key περνά μόνο στη διεργασία OpenCode CLI μέσα σε ένα hardened container.
- Ο OpenCode Go node χρειάζεται επίσης ένα GitHub credential για repository clone, branch push και δημιουργία pull request. Το GitHub token δεν τοποθετείται ποτέ μέσα στο sandbox container.

### Χρησιμοποιείται Από

- [OpenCode Go node](../nodes/opencode-go-node.md)

---

## Linear

Το Linear credential υποστηρίζει είτε ένα προσωπικό API key είτε OAuth2 για τον
[Linear node](../nodes/linear-node.md). Το Heym στέλνει εγγενή GraphQL queries στο Linear για workspace
metadata, projects, issues και comments.
### Ρύθμιση

Επιλέξτε μία λειτουργία ελέγχου ταυτότητας:

**Personal API key**

1. Στο Linear, ανοίξτε **Settings → Security & Access → Personal API keys**.
2. Δημιουργήστε ένα κλειδί με πρόσβαση στον χώρο εργασίας που θέλετε να αυτοματοποιήσετε.
3. Επικολλήστε το κλειδί σε ένα διαπιστευτήριο Linear στο Heym και χρησιμοποιήστε το **Test Connection** για να το επαληθεύσετε.

**OAuth2**

1. Δημιουργήστε μια εφαρμογή Linear OAuth.
2. Καταχωρίστε το `{FRONTEND_URL}/api/credentials/linear/oauth/callback` ως το redirect URI.
3. Στο Heym Dashboard → **Credentials** → **New** → πληκτρολογήστε **Linear**.
4. Επιλέξτε **OAuth2**, εισαγάγετε το Client ID και το Client Secret και, στη συνέχεια, κάντε κλικ στο **Connect**.

### Απαιτούμενα πεδία

| Λειτουργία | Πεδίο | Περιγραφή |
|------|-------|-------------|
| Personal API key | `api_key` | Προσωπικό API key του Linear, συνήθως με πρόθεμα `lin_api_` |
| OAuth2 | `client_id` | Client ID από την εφαρμογή Linear OAuth |
| OAuth2 | `client_secret` | Client Secret από την εφαρμογή Linear OAuth |

Τα OAuth tokens (`access_token`, `refresh_token`, `token_expiry`) αποθηκεύονται και ανανεώνονται αυτόματα.

### Σημειώσεις

- Τα Personal API keys και τα OAuth tokens ενεργούν ως ο χρήστης του Linear που τα δημιούργησε ή τα εξουσιοδότησε.
- Το Linear OAuth χρησιμοποιεί τα scopes `read,write,issues:create,comments:create`.
- Χρησιμοποιήστε το **Test Connection** στο παράθυρο διαλόγου διαπιστευτηρίων για να επαληθεύσετε το API key ή το OAuth token έναντι του Linear API.
- Χρησιμοποιήστε τις επιλογές List Teams και List Projects στον node Linear για να ανακαλύψετε UUIDs πριν από τη δημιουργία ή το φιλτράρισμα θεμάτων.
- Χρησιμοποιήστε τις επιλογές List Workflow States και List Team Members για να ανακαλύψετε UUIDs καταστάσεων και αναδόχων για ενημερώσεις.
- Περιστρέψτε ένα API key επεξεργαζόμενοι το διαπιστευτήριο και εισάγοντας την τιμή αντικατάστασης. Εάν περιστρέψετε τα secrets της εφαρμογής OAuth, επανασυνδέστε το διαπιστευτήριο μέσω **Connect**.

### Χρησιμοποιείται από

- [Linear node](../nodes/linear-node.md)

---

## Jira

Το διαπιστευτήριο Jira αποθηκεύει τα διαπιστευτήρια Jira Basic auth ή ένα διακριτικό προσωπικής πρόσβασης Data Center, το base URL του ιστότοπου Jira, τη λειτουργία ανάπτυξης και την προαιρετική έκδοση REST API για τον [Jira node](../nodes/jira-node.md). Χρησιμοποιήστε `cloud` για το Jira Cloud ή `data_center` για το Jira Data Center / Server.

### Ρύθμιση

**Jira Cloud**

1. Στις ρυθμίσεις λογαριασμού Atlassian, δημιουργήστε ένα API token.
2. Στο Heym Dashboard → **Credentials** → **New** → πληκτρολογήστε **Jira**.
3. Εισαγάγετε το email Atlassian, το API token και το URL του ιστότοπου Jira, όπως `https://your-domain.atlassian.net`.
4. Χρησιμοποιήστε το **Test Connection** για να επαληθεύσετε το διαπιστευτήριο.

**Jira Data Center / Server**

1. Επιλέξτε **Jira Data Center / Server** ως ανάπτυξη.
2. Επιλέξτε μια μέθοδο ελέγχου ταυτότητας. Το **Όνομα χρήστη και κωδικός πρόσβασης** χρησιμοποιεί Basic auth. Το **Personal Access Token** χρησιμοποιεί `Authorization: Bearer <token>` και απαιτεί Jira Data Center / Server 8.14 ή νεότερη έκδοση. Δημιουργήστε το διακριτικό στην ενότητα **Προφίλ → Personal Access Tokens** στο Jira.
3. Εισαγάγετε το όνομα χρήστη και τον κωδικό πρόσβασης Jira ή επικολλήστε το διακριτικό προσωπικής πρόσβασης (δεν απαιτείται όνομα χρήστη).
4. Εισαγάγετε τη διεύθυνση URL της τοποθεσίας Jira, για παράδειγμα `https://jira.example.com`.
5. Χρησιμοποιήστε το **Test Connection** για να επαληθεύσετε το διαπιστευτήριο.

### Πεδία

| Πεδίο | Περιγραφή |
| --- | --- |
| `auth_mode` | `basic` (προεπιλογή εάν λείπει) ή `pat`. Το `pat` είναι έγκυρο μόνο με `data_center` |
| `email` | Διεύθυνση ηλεκτρονικού ταχυδρομείου λογαριασμού Atlassian Jira Cloud ή όνομα χρήστη Jira Data Center / Server. Δεν χρησιμοποιείται στη λειτουργία `pat` |
| `api_token` | Διακριτικό API Atlassian Jira Cloud, κωδικός πρόσβασης Jira Data Center / Server για Basic auth ή το διακριτικό προσωπικής πρόσβασης Data Center στη λειτουργία `pat` |
| `base_url` | Base URL του ιστότοπου Jira |
| `deployment` | `cloud` για Jira Cloud ή `data_center` για Jira Data Center / Server |
| `api_version` | Έκδοση REST API· προεπιλογή `3` για Jira Cloud. Το Data Center / Server χρησιμοποιεί v2 |

### Σημειώσεις

- Ο node Jira αποστέλλει περιγραφές θεμάτων και σχόλια ως έγγραφα κειμένου Atlassian Document Format
  για το Jira Cloud REST API v3. Τα διαπιστευτήρια Data Center / Server αποστέλλουν απλό κείμενο.
- Το Data Center / Server υποστηρίζει Basic auth με όνομα χρήστη/κωδικό πρόσβασης και έλεγχο ταυτότητας με διακριτικό προσωπικής πρόσβασης (PAT) χρησιμοποιώντας το σχήμα Bearer. Ο έλεγχος ταυτότητας PAT απαιτεί Jira Data Center / Server 8.14 ή νεότερη έκδοση.
- Η μεταφόρτωση συνημμένων δέχεται περιεχόμενο base64 ή data URL και υπόκειται στο όριο μεγέθους αρχείου της πλατφόρμας (προεπιλογή 99 MB). Η λήψη συνημμένων μπορεί να επιστρέψει περιεχόμενο base64 όταν είναι ενεργοποιημένη.
- Η δημιουργία, η διαγραφή χρήστη και η ειδοποίηση θεμάτων απαιτούν ο ελεγχόμενος λογαριασμός Jira να έχει τα σχετικά δικαιώματα του ιστότοπου ή του οργανισμού Jira.
- Χρησιμοποιήστε τις επιλογές List Projects, Search Issues και List Transitions για να ανακαλύψετε κλειδιά έργων, κλειδιά θεμάτων και IDs μεταβάσεων.
- Για προσαρμοσμένα endpoints που δεν καλύπτονται από τον κόμβο Jira, χρησιμοποιήστε τον [κόμβο HTTP](../nodes/http-node.md) με Jira Basic Auth (`email:api_token` για Cloud ή `username:password` για Data Center / Server) ή PAT Bearer auth (`Authorization: Bearer <token>` για Data Center / Server). Εναλλακτικά, χρησιμοποιήστε ένα διαπιστευτήριο Header με την κατάλληλη επικεφαλίδα `Authorization`.

Δείτε επίσης:

- [Jira node](../nodes/jira-node.md)
- [Credentials](./credentials.md)

---

## Sentry

Το διαπιστευτήριο Sentry αποθηκεύει ένα auth token για τον [Sentry node](../nodes/sentry-node.md). Το Heym χρησιμοποιεί το REST API του Sentry για λειτουργίες οργανισμού, έργου, ομάδας, θέματος, συμβάντος και έκδοσης.

### Απαιτούμενα πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `api_token` | Auth token του Sentry με πρόσβαση στους οργανισμούς και τα έργα που αυτοματοποιείτε |

### Προαιρετικά πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `base_url` | Προαιρετικό root URL για self-hosted Sentry, για παράδειγμα `https://sentry.example.com` |

### Σημειώσεις

- Αφήστε το `base_url` κενό για το Sentry SaaS.
- Χρησιμοποιήστε το **Test Connection** για να επιβεβαιώσετε ότι το token μπορεί να εμφανίσει τους ορατούς οργανισμούς.
- Για προσαρμοσμένες κλήσεις REST, χρησιμοποιήστε το `$credentials.YourSentryCredential` ως bearer token.

### Χρησιμοποιείται από

- [Sentry node](../nodes/sentry-node.md)

---

## Qdrant

Το [Qdrant](https://qdrant.tech) είναι μια βάση δεδομένων διανυσμάτων ανοιχτού κώδικα που χρησιμοποιείται για σημασιολογική αναζήτηση και RAG (Retrieval Augmented Generation).

### Απαιτούμενα πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `qdrant_host` | Πλήρες URL προς την παρουσία Qdrant (π.χ. `http://localhost:6333` ή ένα cloud endpoint) |
| `openai_api_key` | OpenAI API key που χρησιμοποιείται για τη δημιουργία embeddings κατά την ευρετηρίαση και αναζήτηση εγγράφων |
### Σημειώσεις

- Οι συλλογές Qdrant διαχειρίζονται από την καρτέλα [Διανυσματικοί χώροι αποθήκευσης](../tabs/vectorstores-tab.md). Κάθε διανυσματικός χώρος αποθήκευσης αντιστοιχίζεται σε μια συλλογή Qdrant.
- Ο [node RAG](../nodes/rag-node.md) χρησιμοποιεί έναν διανυσματικό χώρο αποθήκευσης (ο οποίος παραπέμπει σε ένα διαπιστευτήριο Qdrant) — δεν παραπέμπει απευθείας στο διαπιστευτήριο.
- Εάν η παρουσία Qdrant απαιτεί API key, συμπεριλάβετέ το στην τιμή `qdrant_host` ή διαμορφώστε ανάλογα το Qdrant· η τρέχουσα ενσωμάτωση δεν διαθέτει ξεχωριστό πεδίο για Qdrant API key.
- Self-hosted Qdrant: χρησιμοποιήστε το [επίσημο Docker image](https://hub.docker.com/r/qdrant/qdrant) και εκθέστε τη θύρα `6333`.

### Χρησιμοποιείται από

- [node RAG](../nodes/rag-node.md) (μέσω διανυσματικού χώρου αποθήκευσης)
- [Καρτέλα Διανυσματικών χώρων αποθήκευσης](../tabs/vectorstores-tab.md)

## Προσαρμοσμένα Embeddings (RAG)

Από προεπιλογή, τα RAG embeddings προέρχονται από το OpenAI. Ένα διαπιστευτήριο **RAG: Custom Embeddings**
παραπέμπει σε οποιοδήποτε συμβατό με OpenAI endpoint embeddings — Ollama, vLLM, Text
Embeddings Inference, LM Studio, Together ή ένα hosted gateway — και καθορίζει τον διανυσματικό χώρο
αποθήκευσης στον οποίο εγγράφει.

### Απαιτούμενα πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `embedding_base_url` | URL του endpoint συμπεριλαμβανομένης της διαδρομής `/v1`, π.χ. `http://localhost:11434/v1` |
| `embedding_api_key` | Προαιρετικό. Οι τοπικοί διακομιστές συνήθως δεν απαιτούν key |
| `embedding_model` | Όνομα μοντέλου όπως το αναμένει το endpoint, π.χ. `nomic-embed-text` |
| `embedding_dimensions` | Πλάτος διανύσματος που επιστρέφει το μοντέλο (προεπιλογή `1536`) |
| `embedding_request_dimensions` | Προαιρετικό. Ζητήστε από το endpoint να επιστρέψει `embedding_dimensions` αντί για το εγγενές πλάτος του μοντέλου |
| `db_type` | `qdrant` ή `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Σύνδεση Qdrant, απαιτείται όταν το `db_type` είναι `qdrant` |

### Σημειώσεις

- **Το Qdrant δέχεται οποιονδήποτε αριθμό διαστάσεων.** Κάθε συλλογή δημιουργείται με το πλάτος που δηλώνει αυτό
  το διαπιστευτήριο, επομένως το πεδίο Dimensions είναι ελεύθερα επεξεργάσιμο.
- **Το Postgres (pgvector) απαιτεί ακριβώς 1536 διαστάσεις.** Η στήλη του είναι σταθερή
  `vector(1536)`, επομένως το πεδίο Dimensions είναι καρφιτσωμένο στις 1536 και ένα διαπιστευτήριο που δηλώνει
  οποιοδήποτε άλλο πλάτος απορρίπτεται κατά την αποθήκευση.
- **Συντόμευση για pgvector.** Όταν ο χώρος αποθήκευσης είναι Postgres, το παράθυρο διαλόγου προσφέρει *Ask the
  endpoint to return 1536 dimensions*. Αυτό αποστέλλει την παράμετρο αιτήματος `dimensions`,
  την οποία τα μοντέλα που έχουν εκπαιδευτεί με αναπαραστάσεις Matryoshka (OpenAI `text-embedding-3-*`,
  `nomic-embed-text-v1.5`, `jina-v3` και παρόμοια) τιμούν επιστρέφοντας ένα συντομευμένο,
  αλλά ακόμα σημαντικό διάνυσμα. Τα endpoints που δεν υποστηρίζουν την παράμετρο απορρίπτουν την
  αίτηση, και τα endpoints που τη δέχονται αλλά την αγνοούν παράγουν ένα σαφές σφάλμα που αναφέρει το
  πλάτος που πραγματικά επιστράφηκε. Το Heym δεν περικόπτει ποτέ τα διανύσματα από μόνο του, επειδή η κοπή
  της εξόδου ενός μοντέλου που δεν είναι Matryoshka υποβαθμίζει σιωπηλά την ποιότητα ανάκτησης. Η επιλογή δεν
  προσφέρεται για το Qdrant, το οποίο μπορεί να προσαρμόσει μια συλλογή σε οποιοδήποτε πλάτος.
- Χρησιμοποιήστε το **Test Connection** στο παράθυρο διαλόγου διαπιστευτηρίων για να ενσωματώσετε μια συμβολοσειρά
  δοκιμής και να δείτε το πλάτος που πραγματικά επιστρέφει το μοντέλο πριν δημιουργήσετε έναν χώρο αποθήκευσης.
- Η παράμετρος αιτήματος `dimensions` αποστέλλεται μόνο στο ίδιο το OpenAI, καθώς οι περισσότεροι
  συμβατοί με OpenAI διακομιστές απορρίπτουν άγνωστες παραμέτρους. Το εγγενές πλάτος του μοντέλου
  επικυρώνεται αντ' αυτού έναντι του διαπιστευτηρίου.
- Τα υπάρχοντα διαπιστευτήρια **RAG: Qdrant + OpenAI** και **RAG: Psql + OpenAI** είναι
  αμετάβλητα και συνεχίζουν να λειτουργούν.

### Χρησιμοποιείται από

- [node RAG](../nodes/rag-node.md) (μέσω διανυσματικού χώρου αποθήκευσης)
- [Καρτέλα Διανυσματικών χώρων αποθήκευσης](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Το Heym μπορεί επίσης να αποθηκεύει διανύσματα **μέσα στη δική του βάση δεδομένων Postgres** χρησιμοποιώντας την
επέκταση [pgvector](https://github.com/pgvector/pgvector) — χωρίς να απαιτείται εξωτερική υπηρεσία διανυσμάτων.
Δημιουργήστε ένα διαπιστευτήριο **RAG: Psql + OpenAI** και χρησιμοποιήστε το κατά τη δημιουργία ενός διανυσματικού χώρου
αποθήκευσης, έπειτα επιλέξτε **Postgres (pgvector)** στο αναπτυσσόμενο μενού Database του node RAG.

### Απαιτούμενα πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `openai_api_key` | OpenAI API key που χρησιμοποιείται για τη δημιουργία embeddings κατά την ευρετηρίαση και αναζήτηση εγγράφων |

### Σημειώσεις

- Δεν απαιτείται host/port — τα διανύσματα εγγράφονται στη δική του βάση δεδομένων του Heym· το Heym δεν συνδέεται ποτέ σε διαφορετική βάση δεδομένων.
- Κάθε λειτουργία RAG που είναι διαθέσιμη με το Qdrant (εισαγωγή, αναζήτηση, φίλτρα μεταδεδομένων, επανακατάταξη Cohere, κλωνοποίηση, κοινή χρήση) λειτουργεί πανομοιότυπα με το backend Postgres.
- Απαιτεί την επέκταση `vector`. Το Heym διατηρεί το επίσημο image `postgres:16` αμετάβλητο (ώστε τα υπάρχοντα δεδομένα να μην θίγονται ποτέ) και **εγκαθιστά αυτόματα το πακέτο `postgresql-16-pgvector` κατά την εκκίνηση** — τα `run.sh`, `deploy.sh` και `run_e2e.sh` το χειρίζονται όλα. Η εγκατάσταση δεν είναι κρίσιμη: εάν δεν μπορεί να εκτελεστεί (π.χ. χωρίς δίκτυο), το Qdrant RAG συνεχίζει να λειτουργεί και το backend Postgres παραμένει ανενεργό (η μετανάστευση παραλείπει τον πίνακα με ομαλό τρόπο).
- Εάν εκτελείτε το δημοσιευμένο single-container image (`ghcr.io/heymrun/heym`) σε **δική σας εξωτερική Postgres**, αυτή η βάση δεδομένων πρέπει να υποστηρίζει την επέκταση `vector` (το Heym δεν μπορεί να την εγκαταστήσει σε μια βάση δεδομένων που δεν διαχειρίζεται). Χωρίς αυτήν, η δημιουργία ή η μεταφόρτωση σε έναν διανυσματικό χώρο αποθήκευσης Postgres επιστρέφει ένα σαφές μήνυμα και το Qdrant RAG συνεχίζει να λειτουργεί.

### Χρησιμοποιείται από

- [node RAG](../nodes/rag-node.md) (μέσω διανυσματικού χώρου αποθήκευσης)
- [Καρτέλα Διανυσματικών χώρων αποθήκευσης](../tabs/vectorstores-tab.md)

---

## Grist

Το [Grist](https://www.getgrist.com) είναι ένα υβρίδιο υπολογιστικού φύλλου/βάσης δεδομένων που υποστηρίζει δομημένα δεδομένα και τύπους. Το διαπιστευτήριο Grist επιτρέπει στο Heym να διαβάζει και να γράφει έγγραφα Grist.
### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `api_key` | Κλειδί Grist API (βρίσκεται στο **Profile → API Key** στην εγκατάσταση Grist σας) |
| `server_url` | Βασικό URL του διακομιστή Grist σας (π.χ. `https://docs.getgrist.com` για το Grist Cloud ή το URL της αυτο-φιλοξενούμενης εγκατάστασής σας) |

### Σημειώσεις

- Ο [Grist node](../nodes/grist-node.md) απαιτεί το **Document ID** (από το URL του εγγράφου Grist) και το **Table ID** στη διαμόρφωσή του — αυτά δεν αποτελούν μέρος του διαπιστευτηρίου.
- Για αυτο-φιλοξενούμενο Grist, ορίστε το `server_url` στον τομέα της εγκατάστασής σας.
- Τα Column IDs στο Grist χρησιμοποιούν κάτω παύλες (π.χ. `User_Name`), όχι ετικέτες εμφάνισης. Χρησιμοποιήστε τη λειτουργία `listColumns` για να τα ανακαλύψετε.

### Χρησιμοποιείται Από

- [Grist node](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Το διαπιστευτήριο Google Sheets συνδέει το Heym με το Google Sheets API χρησιμοποιώντας ένα μοντέλο OAuth2 "Bring Your Own App". Παρέχετε ένα Google Cloud OAuth2 Client ID και Client Secret και στη συνέχεια εξουσιοδοτείτε την πρόσβαση μέσω ενός αναδυόμενου παραθύρου του προγράμματος περιήγησης. Τα Token ανανεώνονται αυτόματα στο παρασκήνιο.

### Ρύθμιση

1. Ανοίξτε το [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → αναζητήστε και ενεργοποιήστε το **Google Sheets API**.
2. Μεταβείτε στο **Credentials** → **Create Credentials** → **OAuth client ID** → τύπος εφαρμογής **Web application**.
3. Στο **Authorized redirect URIs** προσθέστε: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Αντιγράψτε το παραγόμενο **Client ID** και **Client Secret**.
5. Στο Heym Dashboard → **Credentials** → **New** → τύπος **Google Sheets (OAuth2)**.
6. Εισαγάγετε το Client ID, το Client Secret και ένα όνομα και, στη συνέχεια, κάντε κλικ στο **Connect** για να ανοίξετε το αναδυόμενο παράθυρο συγκατάθεσης της Google και να εξουσιοδοτήσετε την πρόσβαση.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `client_id` | OAuth2 Client ID από το Google Cloud Console |
| `client_secret` | OAuth2 Client Secret από το Google Cloud Console |

Τα Token (`access_token`, `refresh_token`, `token_expiry`) αποθηκεύονται και ανανεώνονται αυτόματα — δεν τα διαχειρίζεστε απευθείας.

### Σημειώσεις

- Η οθόνη συγκατάθεσης OAuth2 απαιτεί το spreadsheets scope (`https://www.googleapis.com/auth/spreadsheets`).
- Το Heym χρησιμοποιεί το refresh token για να αποκτήσει νέα access token πριν λήξουν (περιθώριο ασφαλείας 60 δευτερολέπτων).
- Εάν περιστρέψετε το Client Secret στο Google Cloud Console, επανασυνδέστε το διαπιστευτήριο μέσω του κουμπιού **Connect**.
- **Production:** Ορίστε το backend **`FRONTEND_URL`** στο ακριβές δημόσιο URL που ανοίγουν οι χρήστες στο πρόγραμμα περιήγησης (scheme + host, π.χ. `https://heym.example.com`). Το Heym δημιουργεί το redirect URI του Google OAuth μόνο από αυτήν την τιμή — **δεν** εμπιστεύεται τις κεφαλίδες `Origin` ή `X-Forwarded-*` (ελεγχόμενες από τον πελάτη). Καταχωρίστε το `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` στο Google Cloud Console.

### Χρησιμοποιείται Από

- [Google Sheets node](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Το διαπιστευτήριο Google Drive συνδέει το Heym με το Google Drive API χρησιμοποιώντας το ίδιο μοντέλο OAuth2 "Bring Your Own App" όπως το Google Sheets. Παρέχετε ένα Google Cloud OAuth2 Client ID και Client Secret και στη συνέχεια εξουσιοδοτείτε την πρόσβαση μέσω ενός αναδυόμενου παραθύρου του προγράμματος περιήγησης. Τα Token ανανεώνονται αυτόματα στο παρασκήνιο.

### Ρύθμιση

1. Ανοίξτε το [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → αναζητήστε και ενεργοποιήστε το **Google Drive API**.
2. Μεταβείτε στο **Credentials** → **Create Credentials** → **OAuth client ID** → τύπος εφαρμογής **Web application**.
3. Στο **Authorized redirect URIs** προσθέστε: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Αντιγράψτε το παραγόμενο **Client ID** και **Client Secret**.
5. Στο Heym Dashboard → **Credentials** → **New** → τύπος **Google Drive (OAuth2)**.
6. Εισαγάγετε το Client ID, το Client Secret και ένα όνομα και, στη συνέχεια, κάντε κλικ στο **Connect** για να ανοίξετε το αναδυόμενο παράθυρο συγκατάθεσης της Google και να εξουσιοδοτήσετε την πρόσβαση.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `client_id` | OAuth2 Client ID από το Google Cloud Console |
| `client_secret` | OAuth2 Client Secret από το Google Cloud Console |

Τα Token (`access_token`, `refresh_token`, `token_expiry`) αποθηκεύονται και ανανεώνονται αυτόματα — δεν τα διαχειρίζεστε απευθείας.

### Scope

Το Google Drive ζητά το **πλήρες Drive scope** (`https://www.googleapis.com/auth/drive`).

Αυτό απαιτείται επειδή ο node λειτουργεί σε αρχεία που κατέχετε ήδη. Το στενότερο scope `drive.file` παρέχει πρόσβαση μόνο σε αρχεία που δημιούργησε ο ίδιος ο OAuth client, γεγονός που θα έκανε τις λειτουργίες `listFolderFiles`, `updateFile`, `removeFile` και `removeFolder` να μην βλέπουν τίποτα από το υπάρχον Drive σας.

Επειδή παρέχετε το δικό σας Client ID και Secret από το δικό σας έργο Google Cloud, οι απαιτήσεις επαλήθευσης εφαρμογής της Google για αυτό το scope ισχύουν για το έργο σας, όχι για το Heym.

### Σημειώσεις

- Το Heym χρησιμοποιεί το refresh token για να αποκτήσει νέα access token πριν λήξουν (περιθώριο ασφαλείας 60 δευτερολέπτων).
- Εάν περιστρέψετε το Client Secret στο Google Cloud Console, επανασυνδέστε το διαπιστευτήριο μέσω του κουμπιού **Connect**.
- Τα κοινόχρηστα drive υποστηρίζονται — ο node ορίζει το `supportsAllDrives` σε κάθε κλήση API.
- **Production:** Ορίστε το backend **`FRONTEND_URL`** στο ακριβές δημόσιο URL που ανοίγουν οι χρήστες στο πρόγραμμα περιήγησης. Το Heym δημιουργεί το redirect URI του Google OAuth μόνο από αυτήν την τιμή — **δεν** εμπιστεύεται τις κεφαλίδες `Origin` ή `X-Forwarded-*`. Καταχωρίστε το `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` στο Google Cloud Console.
- Ανατρέξτε στο [Credential Sharing](./credentials-sharing.md) πριν μοιραστείτε αυτό το διαπιστευτήριο με μια ομάδα.

### Χρησιμοποιείται Από

- [Google Drive node](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Το διαπιστευτήριο BigQuery συνδέει το Heym με το Google BigQuery API χρησιμοποιώντας το μοντέλο OAuth2 "Bring Your Own App". Παρέχετε ένα Google Cloud OAuth2 Client ID και Client Secret και στη συνέχεια εξουσιοδοτείτε την πρόσβαση μέσω ενός αναδυόμενου παραθύρου του προγράμματος περιήγησης. Τα Token ανανεώνονται αυτόματα στο παρασκήνιο.

### Ρύθμιση

1. Ανοίξτε το [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → αναζητήστε και ενεργοποιήστε το **BigQuery API**.
2. Μεταβείτε στο **Credentials** → **Create Credentials** → **OAuth client ID** → τύπος εφαρμογής **Web application**.
3. Στο **Authorized redirect URIs** προσθέστε: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Αντιγράψτε το παραγόμενο **Client ID** και **Client Secret**.
5. Στο Heym Dashboard → **Credentials** → **New** → τύπος **BigQuery (OAuth2)**.
6. Εισαγάγετε το Client ID, το Client Secret και ένα όνομα και, στη συνέχεια, κάντε κλικ στο **Connect** για να ανοίξετε το αναδυόμενο παράθυρο συγκατάθεσης της Google και να εξουσιοδοτήσετε την πρόσβαση.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `client_id` | OAuth2 Client ID από το Google Cloud Console |
| `client_secret` | OAuth2 Client Secret από το Google Cloud Console |

Τα Token (`access_token`, `refresh_token`, `token_expiry`) αποθηκεύονται και ανανεώνονται αυτόματα.

### Σημειώσεις

- Η οθόνη συγκατάθεσης OAuth2 απαιτεί το scope του BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Παραγωγή:** Ορίστε το backend **`FRONTEND_URL`** στη δημόσια διεύθυνση URL. Καταχωρίστε το `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` στο Google Cloud Console.

### Χρησιμοποιείται Από

- [BigQuery node](../nodes/bigquery-node.md)

---

## Supabase

Το διαπιστευτήριο Supabase συνδέει το Heym με το PostgREST API ενός έργου Supabase, ώστε τα workflow να μπορούν να εκτελούν ερωτήματα και να τροποποιούν πίνακες που υποστηρίζονται από Postgres.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `supabase_url` | Βασική διεύθυνση URL του έργου, για παράδειγμα `https://your-project.supabase.co` |
| `supabase_key` | Κλειδί API με πρόσβαση στους πίνακες-στόχους |
| `supabase_schema` | Προαιρετικό προεπιλεγμένο schema (προεπιλογή: `public`) |

### Σημειώσεις

- Το [Supabase node](../nodes/supabase-node.md) επικοινωνεί με το `/rest/v1/<table>` και υποστηρίζει φίλτρα τελεστών (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` και σχετικούς τελεστές PostgREST) καθώς και ένθετες λογικές ομάδες `or` / `and`.
- Για λειτουργίες εγγραφής, προτιμήστε ένα κλειδί που προορίζεται για αξιόπιστη χρήση από την πλευρά του διακομιστή με τα ελάχιστα απαιτούμενα δικαιώματα πίνακα.
- Τα node μπορούν να παρακάμψουν το schema ανά βήμα, ακόμη και αν το διαπιστευτήριο ορίζει ένα προεπιλεγμένο schema.

### Χρησιμοποιείται Από

- [Supabase node](../nodes/supabase-node.md)

## ClickHouse

Το διαπιστευτήριο ClickHouse συνδέει το Heym με μια εξωτερική βάση δεδομένων ClickHouse μέσω της διεπαφής HTTP της, ώστε τα workflow να μπορούν να εκτελούν λειτουργίες SQL, CRUD και καταμέτρησης σε πίνακες OLAP.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `host` | Κεντρικός υπολογιστής HTTP χωρίς scheme, για παράδειγμα `your-instance.clickhouse.cloud` |
| `port` | Θύρα διεπαφής HTTP (`8443` για HTTPS, `8123` για HTTP) |
| `username` | Χρήστης ClickHouse (προεπιλογή: `default`) |
| `password` | Κωδικός πρόσβασης χρήστη (προαιρετικό) |
| `database` | Βάση δεδομένων-στόχος (προεπιλογή: `default`) |
| `secure` | Χρήση HTTPS όταν είναι `true` (απαιτείται για το ClickHouse Cloud) |

### Σημειώσεις

- Το [ClickHouse node](../nodes/clickhouse-node.md) χρησιμοποιεί τον επίσημο πελάτη HTTP `clickhouse-connect` και παραμετροποιεί τα bindings φίλτρων και τιμών.
- Τα `update` και `remove` αντιστοιχούν σε `ALTER TABLE ... UPDATE` και `DELETE FROM`, τα οποία είναι ασύγχρονες μεταλλάξεις του ClickHouse· και τα δύο απαιτούν φίλτρο.
- Το `upsert` εκτελεί μια `INSERT` και προϋποθέτει πίνακα `ReplacingMergeTree` για συμπεριφορά merge-on-key.
- Χρησιμοποιήστε το **Test connection** στο παράθυρο διαλόγου του διαπιστευτηρίου για να επαληθεύσετε τη συνδεσιμότητα.

### Χρησιμοποιείται Από

- [ClickHouse node](../nodes/clickhouse-node.md)

## Notion

Το διαπιστευτήριο Notion υποστηρίζει είτε ένα token εσωτερικής ενσωμάτωσης είτε μια σύνδεση OAuth δημόσιας ενσωμάτωσης. Το OAuth επιτρέπει σε κάθε χρήστη να εξουσιοδοτεί έναν χώρο εργασίας Notion από το Heym αντί να αντιγράφει χειροκίνητα ένα token.

### Απαιτούμενα Πεδία

| Λειτουργία | Πεδίο | Περιγραφή |
|------|-------|-------------|
| Εσωτερικό token | `api_token` | Token εσωτερικής ενσωμάτωσης (`ntn_...`) |
| OAuth | `client_id` | Client ID από μια δημόσια ενσωμάτωση Notion |
| OAuth | `client_secret` | Client Secret από τη δημόσια ενσωμάτωση Notion |

Το callback του OAuth αποθηκεύει αυτόματα τα `access_token`, `auth_mode`, `workspace_id`, `workspace_name` και `bot_id`. Τυχόν προηγούμενο εσωτερικό `api_token` αφαιρείται όταν ολοκληρωθεί το OAuth. Καταχωρίστε αυτό το redirect URI στο Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Ροή ρύθμισης OAuth

1. Επιλέξτε **OAuth** στο παράθυρο διαλόγου του διαπιστευτηρίου, εισαγάγετε ένα όνομα, Client ID και Client Secret.
2. Κάντε κλικ στο **Connect** και εξουσιοδοτήστε τον χώρο εργασίας στο αναδυόμενο παράθυρο του Notion.
   - Για ένα **νέο** διαπιστευτήριο, το Heym δημιουργεί την εγγραφή του διαπιστευτηρίου όταν κάνετε κλικ στο **Connect**.
   - Ολοκληρώστε την εξουσιοδότηση στο αναδυόμενο παράθυρο και, στη συνέχεια, κάντε κλικ στο **Save** για να επιστρέψετε στη λίστα διαπιστευτηρίων.
3. Ένα συνδεδεμένο διαπιστευτήριο εμφανίζει `connected (Workspace Name)` στη λίστα. Τα εκκρεμή διαπιστευτήρια OAuth εμφανίζουν `Not connected` μέχρι να ολοκληρωθεί η εξουσιοδότηση.

Χρησιμοποιήστε το **Test Connection** στο παράθυρο διαλόγου του διαπιστευτηρίου για να επαληθεύσετε είτε ένα εσωτερικό token είτε μια ολοκληρωμένη εξουσιοδότηση OAuth. Κατά την επεξεργασία, η κενή τιμή στο πεδίο token διατηρεί το αποθηκευμένο εσωτερικό token.

Τόσο τα εσωτερικά token όσο και τα access token του OAuth είναι διαθέσιμα μέσω του `$credentials.CredentialName` για προσαρμοσμένες κλήσεις [HTTP](../nodes/http-node.md) που χρειάζονται bearer token του Notion.
### Σημειώσεις

- Οι εσωτερικές ενσωματώσεις απαιτούν την κοινοποίηση των σχετικών σελίδων, βάσεων δεδομένων και πηγών δεδομένων.
- Οι χρήστες OAuth επιλέγουν τον χώρο εργασίας/τις σελίδες κατά την εξουσιοδότηση στο Notion.
- Τα διαπιστευτήρια της εφαρμογής OAuth κρυπτογραφούνται εντός του διαπιστευτηρίου Notion. Το callback τα επαναφορτώνει
  στην πλευρά του διακομιστή· το secret δεν ενσωματώνεται στο OAuth state.
- Τα συνδεδεμένα διαπιστευτήρια OAuth εμφανίζουν το όνομα του χώρου εργασίας· τα εκκρεμή διαπιστευτήρια OAuth εμφανίζουν
  `Not connected` έως ότου ολοκληρωθεί η εξουσιοδότηση.
- **Παραγωγή:** Ορίστε το backend **`FRONTEND_URL`** στη δημόσια διεύθυνση URL του προγράμματος περιήγησης (scheme + host, χωρίς
  κάθετο στο τέλος). Το redirect URI του Notion πρέπει να ταιριάζει ακριβώς:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Ο node χρησιμοποιεί την έκδοση API `2026-03-11` και την τρέχουσα ορολογία `data_source`. Ανατρέξτε στο
  άρθρο [Notion node](../nodes/notion-node.md#api-version-notes) για οδηγίες μετεγκατάστασης από
  παλαιότερα παραδείγματα `archived`, `after` ή database-query.
- Τα παλιά φίλτρα αναζήτησης με τιμή αντικειμένου `database` κανονικοποιούνται σε `data_source`.

### Χρησιμοποιείται Από

- [Notion node](../nodes/notion-node.md)

---

## SMTP (Email)

Το διαπιστευτήριο SMTP αποθηκεύει τα στοιχεία σύνδεσης του διακομιστή email για την αποστολή εξερχόμενης αλληλογραφίας.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `host` | Όνομα κεντρικού υπολογιστή του διακομιστή SMTP (π.χ. `smtp.gmail.com`) |
| `port` | Θύρα SMTP (συνήθως `587` για STARTTLS, `465` για SSL) |
| `email` | Όνομα χρήστη με το οποίο συνδέεται ο διακομιστής SMTP· επίσης ο ορατός αποστολέας όταν το `from` είναι κενό |
| `password` | Κωδικός πρόσβασης SMTP ή App Password |

### Προαιρετικά Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `from` (`smtp_from`) | Ορατή διεύθυνση αποστολέα (From). Αφήστε κενό για αποστολή ως `email`. Ο διακομιστής εξακολουθεί να συνδέεται ως `email`, επομένως αυτός ο λογαριασμός πρέπει να επιτρέπεται να στέλνει ως αυτή η διεύθυνση (στο Gmail, ένα επαληθευμένο ψευδώνυμο **Αποστολή αλληλογραφίας ως**). |

### Συνήθεις Πάροχοι SMTP

| Πάροχος | Host | Θύρα | Σημειώσεις |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Απαιτείται [App Password](https://support.google.com/accounts/answer/185833) (πρέπει να είναι ενεργοποιημένος ο έλεγχος 2 βημάτων) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Χρησιμοποιήστε τα διαπιστευτήρια του λογαριασμού Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Χρησιμοποιήστε τα διαπιστευτήρια SMTP του Mailgun από τις ρυθμίσεις του domain σας |
| SendGrid | `smtp.sendgrid.net` | `587` | Χρησιμοποιήστε το `apikey` ως όνομα χρήστη και ένα API key ως κωδικό πρόσβασης |
| Προσαρμοσμένος / Self-hosted | το domain σας | `587` / `465` | Postfix, Exim, κ.λπ. |

### Σημειώσεις

- Το Gmail απαιτεί ένα **App Password** αντί για τον κανονικό κωδικό πρόσβασης όταν είναι ενεργοποιημένη η επαλήθευση 2 βημάτων.
- Η θύρα `587` χρησιμοποιεί STARTTLS (ξεκινά με απλό κείμενο, αναβαθμίζεται σε TLS). Η θύρα `465` χρησιμοποιεί άμεσο TLS (SSL από την αρχή).

### Χρησιμοποιείται Από

- [Send Email node](../nodes/send-email-node.md)

---

## IMAP (Inbound Email)

Το διαπιστευτήριο IMAP αποθηκεύει τα στοιχεία σύνδεσης για την παρακολούθηση ενός inbox με τον [IMAP Trigger node](../nodes/imap-trigger-node.md).

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `imap_host` | Όνομα κεντρικού υπολογιστή του διακομιστή IMAP (για παράδειγμα `imap.gmail.com`) |
| `imap_port` | Θύρα IMAP (`993` για SSL/TLS στους περισσότερους παρόχους) |
| `imap_username` | Όνομα χρήστη του mailbox ή πλήρης διεύθυνση email |
| `imap_password` | Κωδικός πρόσβασης ή app password ειδικό για τον πάροχο |

### Προαιρετικά Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `imap_mailbox` | Φάκελος mailbox προς παρακολούθηση (προεπιλογή: `INBOX`) |
| `imap_use_ssl` | Ενεργοποίηση SSL/TLS (συνιστάται· προεπιλογή: `true`) |

### Σημειώσεις

- Ο trigger IMAP καταγράφει το τρέχον mailbox ως βάση στην πρώτη δημοσκόπηση και στη συνέχεια επεξεργάζεται μόνο νεότερα email.
- Το Gmail, το Microsoft 365 και άλλοι φιλοξενούμενοι πάροχοι απαιτούν συχνά ένα **app password** ή παρόμοιο secret ειδικό για IMAP.
- Το περιεχόμενο των συνημμένων δεν λαμβάνεται στο payload του workflow· το Heym εκθέτει μόνο τα μεταδεδομένα των συνημμένων.

### Χρησιμοποιείται Από

- [IMAP Trigger node](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP ως trigger workflow)

---

## RabbitMQ

Το [RabbitMQ](https://www.rabbitmq.com) είναι ένας message broker ανοιχτού κώδικα. Το διαπιστευτήριο RabbitMQ αποθηκεύει τα στοιχεία σύνδεσης για τη δημοσίευση σε και την κατανάλωση από ουρές και exchanges.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `rabbitmq_host` | Διεύθυνση URL σύνδεσης AMQP (π.χ. `amqp://localhost:5672`) |
| `rabbitmq_username` | Όνομα χρήστη RabbitMQ (προεπιλογή: `guest`) |
| `rabbitmq_password` | Κωδικός πρόσβασης RabbitMQ (προεπιλογή: `guest`) |

### Εικονικοί Κόμβοι (Virtual Hosts)

Για να συνδεθείτε σε έναν συγκεκριμένο εικονικό κόμβο, συμπεριλάβετέ τον στη διεύθυνση URL `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Εάν χρησιμοποιείτε τον προεπιλεγμένο vhost, η διαδρομή `/` μπορεί να παραλειφθεί.

### Πρόσθετο Καθυστερημένων Μηνυμάτων (Delayed Message Plugin)

Ο [RabbitMQ node](../nodes/rabbitmq-node.md) υποστηρίζει το πρόσθετο **rabbitmq_delayed_message_exchange**. Όταν αυτό το πρόσθετο είναι ενεργοποιημένο στον διακομιστή RabbitMQ, μπορείτε να ορίσετε καθυστέρηση (σε χιλιοστά του δευτερολέπτου) στα εξερχόμενα μηνύματα χρησιμοποιώντας το πεδίο `rabbitmqDelayMs` στον node.

Ο node ορίζει την κεφαλίδα `x-delay` στο δημοσιευμένο μήνυμα. Ο τύπος exchange πρέπει να είναι `x-delayed-message` για να τεθούν σε ισχύ οι καθυστερήσεις.

Για να ενεργοποιήσετε το πρόσθετο σε μια self-hosted εγκατάσταση RabbitMQ:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Όταν το πρόσθετο δεν είναι εγκατεστημένο, η κεφαλίδα `x-delay` αγνοείται και τα μηνύματα παραδίδονται αμέσως.

### Χρησιμοποιείται Από

- [RabbitMQ node](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ ως trigger workflow)

---

## Amazon S3

Το διαπιστευτήριο Amazon S3 συνδέει το Heym με το [Amazon S3](https://aws.amazon.com/s3/). Χρησιμοποιήστε το με τον [Amazon S3 node](../nodes/amazon-s3-node.md) για τη διαχείριση buckets και φακέλων, τη μεταφόρτωση και λήψη αντικειμένων, την αντιγραφή keys και την καταχώριση ή διαγραφή αντικειμένων από workflows.
### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `aws_access_key_id` | AWS IAM access key ID |
| `aws_secret_access_key` | Secret access key που αντιστοιχεί στο access key ID |
| `aws_region` | AWS region όπου βρίσκονται τα buckets (π.χ. `us-east-1`) |

### Προαιρετικά Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `aws_session_token` | Προσωρινό session token κατά τη χρήση διαπιστευτηρίων AWS STS |

### Σημειώσεις

- Το διαπιστευτήριο χρησιμοποιεί τυπικό έλεγχο ταυτότητας AWS SigV4 μέσω boto3.
- Οι λειτουργίες μεταφόρτωσης αποστέλλουν προς το παρόν περιεχόμενο κειμένου UTF-8· οι λήψεις μπορούν να επιστρέψουν κείμενο ή base64 για δυαδικά αντικείμενα.

### Χρησιμοποιείται Από

- [Amazon S3 node](../nodes/amazon-s3-node.md)

---

## Redis

Το [Redis](https://redis.io) είναι ένας αποθηκευτικός χώρος κλειδιού-τιμής στη μνήμη που χρησιμοποιείται για caching και γρήγορη πρόσβαση δεδομένων.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `host` | Όνομα κεντρικού υπολογιστή ή IP του διακομιστή Redis (π.χ. `localhost`) |
| `port` | Θύρα Redis (προεπιλογή: `6379`) |
| `password` | Κωδικός πρόσβασης Redis (αφήστε κενό εάν δεν έχει οριστεί) |

### Χρησιμοποιείται Από

- [Redis node](../nodes/redis-node.md)

---

## Slack

Το διαπιστευτήριο Slack αποθηκεύει ένα **Incoming Webhook URL** για την αποστολή μηνυμάτων σε κανάλια Slack.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (από τη διαμόρφωση της εφαρμογής σας στο Slack) |

### Σημειώσεις

- Δημιουργήστε ένα Incoming Webhook στο [api.slack.com/apps](https://api.slack.com/apps) → την εφαρμογή σας → **Incoming Webhooks**.
- Κάθε webhook περιορίζεται σε ένα συγκεκριμένο κανάλι. Δημιουργήστε πολλαπλά διαπιστευτήρια για διαφορετικά κανάλια.

### Χρησιμοποιείται Από

- [Slack node](../nodes/slack-node.md)

---

## Telegram

Το διαπιστευτήριο Telegram αποθηκεύει ένα **Bot Token** και ένα προαιρετικό **Webhook Secret Token** για workflows που βασίζονται σε bots.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `bot_token` | Telegram Bot API token από το BotFather |

### Προαιρετικά Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `secret_token` | Κοινόχρηστο μυστικό που επαληθεύεται έναντι του `x-telegram-bot-api-secret-token` σε εισερχόμενα webhooks |

### Σημειώσεις

- Χρησιμοποιήστε το ίδιο διαπιστευτήριο τόσο για το [Telegram Trigger](../nodes/telegram-trigger-node.md) όσο και για το [Telegram](../nodes/telegram-node.md).
- Καταχωρίστε το webhook χειροκίνητα με το API `setWebhook` του Telegram χρησιμοποιώντας το URL που εμφανίζεται στο πάνελ του Telegram Trigger node.
- Το `chatId` στο Telegram node μπορεί να είναι ένα κυριολεκτικό ID ή μια έκφραση όπως `$telegramEvent.message.chat.id`.

### Χρησιμοποιείται Από

- [Telegram Trigger node](../nodes/telegram-trigger-node.md)
- [Telegram node](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Αυτά τα διαπιστευτήρια χρησιμοποιούνται από το [HTTP node](../nodes/http-node.md) για τον έλεγχο ταυτότητας εξερχόμενων αιτημάτων.

### Bearer

Προσθέτει μια κεφαλίδα `Authorization: Bearer <token>` στα αιτήματα HTTP.

| Πεδίο | Περιγραφή |
|-------|-------------|
| `token` | Η τιμή του bearer token |

### Header

Προσθέτει μια προσαρμοσμένη κεφαλίδα στα αιτήματα HTTP.

| Πεδίο | Περιγραφή |
|-------|-------------|
| `header_key` | Όνομα κεφαλίδας (π.χ. `X-Api-Key`) |
| `header_value` | Τιμή κεφαλίδας |

Και οι δύο τύποι μπορούν επίσης να αναφερθούν μέσω `$credentials.CredentialName` στο [Expression DSL](./expression-dsl.md) για δυναμική χρήση σε οποιονδήποτε node δέχεται εκφράσεις.

### Χρησιμοποιείται Από

- [HTTP node](../nodes/http-node.md)

---

## Πάροχοι LLM (OpenAI, Google, Custom, Cohere)

Αυτά τα διαπιστευτήρια τροφοδοτούν τους nodes AI.

| Τύπος | Περιγραφή |
|------|-------------|
| **OpenAI** | API key για μοντέλα GPT και embeddings OpenAI |
| **Google** | API key για μοντέλα Gemini |
| **Custom** | API key + base URL για endpoints συμβατά με OpenAI (Ollama, vLLM, LM Studio, κ.λπ.) |
| **Cohere** | API key για embeddings Cohere |

### OpenAI Prompt Caching

Το OpenAI αποθηκεύει αυτόματα στην cache το στατικό (αμετάβλητο) πρόθεμα του system prompt σας — δεν απαιτείται πρόσθετη διαμόρφωση. Επαναλαμβανόμενες εκτελέσεις workflow που μοιράζονται το ίδιο πρόθεμα system prompt επωφελούνται από την τιμολόγηση cached token, η οποία μειώνει τόσο το κόστος όσο και την καθυστέρηση. Αυτό είναι ιδιαίτερα χρήσιμο όταν έχετε μακροσκελείς, σταθερές οδηγίες και μόνο το μήνυμα του χρήστη αλλάζει μεταξύ των εκτελέσεων. Παρακολουθήστε τα ποσοστά cache hit και την εξοικονόμηση token στην [καρτέλα Traces](../tabs/traces-tab.md) ή στον πίνακα ελέγχου χρήσης του OpenAI για να βελτιστοποιήσετε τη δομή του prompt σας για μέγιστη επαναχρησιμοποίηση cache.

### Χρησιμοποιείται Από

- [LLM node](../nodes/llm-node.md)
- [Agent node](../nodes/agent-node.md)
- [RAG node](../nodes/rag-node.md) (embeddings OpenAI μέσω διαπιστευτηρίου Qdrant)

---

## FlareSolverr

Το [FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) είναι ένας διακομιστής μεσολάβησης για την παράκαμψη του Cloudflare και παρόμοιων προκλήσεων προστασίας από bots.

### Απαιτούμενα Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| `flaresolverr_url` | URL της παρουσίας FlareSolverr σας (π.χ. `http://localhost:8191`) |

Οι διευθύνσεις loopback και οι ιδιωτικές διευθύνσεις υποστηρίζονται εδώ, επομένως η εκτέλεση του FlareSolverr δίπλα στο Heym λειτουργεί όπως τεκμηριώνεται. Το URL δεν επιτρέπεται να επιλύεται σε διεύθυνση link-local ή cloud-metadata. Επειδή επιτρέπονται οι ιδιωτικές διευθύνσεις, αυτό το πεδίο μπορεί επίσης να κατευθυνθεί σε άλλη εσωτερική υπηρεσία και η απάντηση επιστρέφεται στην έξοδο του node. Οποιοσδήποτε συνδεδεμένος χρήστης μπορεί να δημιουργήσει αυτό το διαπιστευτήριο, επομένως το όριο είναι ποιος μπορεί να συντάσσει workflows συν τους κανόνες δικτύου σας, όχι ο διαμοιρασμός διαπιστευτηρίων. Ανατρέξτε στην ενότητα [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Χρησιμοποιείται Από

- [Crawler node](../nodes/crawler-node.md)

---
## Σχετικά

- [Διαπιστευτήρια](./credentials.md) – Επισκόπηση των διαπιστευτηρίων και του τρόπου με τον οποίο τα nodes τα χρησιμοποιούν
- [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) – Προσθήκη και διαχείριση διαπιστευτηρίων
- [Κοινή Χρήση Διαπιστευτηρίων](./credentials-sharing.md) – Κοινή χρήση διαπιστευτηρίων με χρήστες και ομάδες
- [Ασφάλεια](./security.md) – Κρυπτογράφηση σε κατάσταση ηρεμίας, έλεγχος πρόσβασης
- [Expression DSL](./expression-dsl.md) – Σύνταξη `$credentials` για δυναμική πρόσβαση

---

## Model Router (Auto Model)

Δρομολογεί κάθε αίτημα σε ένα από τα υπάρχοντα διαπιστευτήρια μοντέλων σας, χρησιμοποιώντας ένα μοντέλο απόφασης για
την επιλογή. Αποθηκεύει αναφορές, ποτέ δικό του κλειδί.

### Απαιτούμενα Πεδία

- `decision_credential_id` – ένα διαπιστευτήριο **Decision Model** στο οποίο έχετε πρόσβαση.
- `decision_model` – το μοντέλο που εκτελεί την κλήση δρομολόγησης, για παράδειγμα `jev-latest`.
- `options` – τουλάχιστον δύο καταχωρίσεις, καθεμία με ένα όνομα, ένα από τα διαπιστευτήρια OpenAI/Google/Custom
  σας, ένα μοντέλο σε αυτό, και κριτήρια που καθορίζουν πότε πρέπει να επικρατήσει.

### Προαιρετικά Πεδία

- `routing_instructions` – πώς να σταθμίζονται οι επιλογές συνολικά.
- Μία επιλογή μπορεί να επισημανθεί ως η εφεδρική που χρησιμοποιείται όταν η δρομολόγηση αποτύχει.

### Σημειώσεις

Τα ονόματα των επιλογών είναι αυτά μεταξύ των οποίων επιλέγει το μοντέλο απόφασης, επομένως πρέπει να είναι διακριτά. Μία
επιλογή δεν μπορεί να δείχνει σε άλλο Model Router.
