# Διαπιστευτήρια

Τα Διαπιστευτήρια αποθηκεύουν API keys και secrets που χρησιμοποιούνται από τους κόμβους των workflow. Τα προσθέτετε στην [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) και τα αναφέρετε ονομαστικά στη διαμόρφωση των κόμβων.

## Τι Είναι τα Διαπιστευτήρια

- **Αποθηκεύονται ανά χρήστη** – Κάθε διαπιστευτήριο ανήκει σε έναν χρήστη και μπορεί να [κοινοποιηθεί](./credentials-sharing.md) με άλλους χρήστες ή [Ομάδες](./teams.md).
- **Κρυπτογραφημένα σε κατάσταση ηρεμίας** – Οι ευαίσθητες τιμές κρυπτογραφούνται· η διεπαφή τις αποκρύπτει μετά τη δημιουργία.
- **Αναφέρονται ονομαστικά** – Οι κόμβοι επιλέγουν ένα διαπιστευτήριο με το όνομα (ή το ID) του. Η μηχανή εκτέλεσης επιλύει το διαπιστευτήριο για τον κάτοχο του workflow κατά τον χρόνο εκτέλεσης.

## Πώς τα Χρησιμοποιούν οι Κόμβοι

| Τύπος κόμβου | Τυπικό διαπιστευτήριο | Σκοπός |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Αξιολογήσεις](../tabs/evals-tab.md) | OpenAI, Google, Custom | API key για το μοντέλο |
| [Decision](../nodes/decision-node.md), [Αξιολογήσεις](../tabs/evals-tab.md) judge | Decision Model | Base URL ενός endpoint μοντέλου αποφάσεων, συν ένα προαιρετικό API key |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults, [Αξιολογήσεις](../tabs/evals-tab.md) σουίτες prompt | Model Router (Auto Model) | Επιλέγει ποιο από τα μοντέλα σας εξυπηρετεί κάθε αίτημα, χρησιμοποιώντας ένα μοντέλο αποφάσεων |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Σύνδεση με συνδρομή ChatGPT (OAuth) ή ένα Codex access token για τον runner, συν ένα GitHub PAT για λειτουργίες αποθετηρίου |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | Ένα API key πύλης OpenCode Go (προαιρετικό base URL) για τον runner, συν ένα GitHub PAT για λειτουργίες αποθετηρίου |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personal access token (PAT) για κλήσεις GitHub API, λειτουργίες του κόμβου GitHub και ενσωματώσεις MCP |
| [Jira](../nodes/jira-node.md) | Jira | Cloud email/API token, Data Center username/password ή personal access token, base URL του ιστότοπου Jira, λειτουργία ανάπτυξης και προαιρετική έκδοση REST API |
| [Linear](../nodes/linear-node.md) | Linear | Personal API key ή OAuth2 για ομάδες, έργα, ζητήματα και σχόλια |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Έλεγχος ταυτότητας για αιτήματα |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token και προαιρετικό webhook secret |
| [Discord](../nodes/discord-node.md) | Discord | Incoming webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Δημόσιο κλειδί εφαρμογής για επαλήθευση υπογραφής |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Σύνδεση διανυσματικού χώρου αποθήκευσης (εξωτερικό Qdrant ή το δικό του Postgres του Heym μέσω pgvector), με OpenAI ή οποιοδήποτε συμβατό με OpenAI endpoint embeddings |
| [Slack](../nodes/slack-node.md) | Slack | Webhook ή API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Σύνδεση εισερχόμενου γραμματοκιβωτίου |
| [Send Email](../nodes/send-email-node.md) | SMTP | Διακομιστής αλληλογραφίας |
| [Redis](../nodes/redis-node.md) | Redis | Σύνδεση |
| [Grist](../nodes/grist-node.md) | Grist | API key + URL διακομιστή |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + συγκατάθεση OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + συγκατάθεση OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + συγκατάθεση OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL έργου + API key (+ προαιρετικό προεπιλεγμένο schema) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + username/password + database (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Internal integration token ή δημόσιο integration Client ID + Client Secret + συγκατάθεση OAuth |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token συν προαιρετικό base URL αυτο-φιλοξενούμενης εγκατάστασης |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

Για λεπτομερή διαμόρφωση (hosts, ports, πεδία ειδικά για παρόχους), ανατρέξτε στις [Ενσωματώσεις Τρίτων](./integrations.md). Αυτό περιλαμβάνει τη διαμόρφωση του bot Telegram, τα εισερχόμενα email μέσω IMAP και τα εξερχόμενα email μέσω SMTP.

Τα διαπιστευτήρια GitHub μπορούν επίσης να περιλαμβάνουν ένα προαιρετικό `base_url` όταν στοχεύετε σε GitHub
Enterprise Server αντί για το GitHub.com. Όταν επεξεργάζεστε ένα διαπιστευτήριο GitHub για να εναλλάξετε το token,
αφήνοντας το `base_url` κενό διατηρείται το υπάρχον endpoint Enterprise. Εισαγάγετε ένα νέο URL μόνο όταν
θέλετε να αλλάξετε αυτό το endpoint.

Τα διαπιστευτήρια Jira, Linear, Supabase, Notion, Sentry και ClickHouse εκθέτουν **Test Connection** στον διάλογο διαπιστευτηρίων. Για το Jira, ο έλεγχος καλεί το τρέχον endpoint χρήστη του Jira. Για το Linear,
ο έλεγχος καλεί το Linear API με `getViewer` και επιβεβαιώνει ότι το API key ή το OAuth token είναι έγκυρο.
Κατά την επεξεργασία, μπορείτε να κάνετε έλεγχο χωρίς να εισαγάγετε εκ νέου το API key εάν το αποθηκευμένο secret είναι ακόμη παρόν. Για το Notion,
επιλέξτε **Internal token** ή **OAuth** στον διάλογο· το OAuth χρησιμοποιεί το Client ID και το Client Secret
από τη δημόσια ενσωμάτωσή σας στο Notion. Ανατρέξτε στις [Ενσωματώσεις Τρίτων](./integrations.md#notion) για
λεπτομέρειες διαμόρφωσης του Notion.
## Χρήση πακέτου προγραμματισμού

Η καρτέλα **AI Defaults** στις [Ρυθμίσεις](./user-settings.md) εμφανίζει την υπόλοιπη χρήση του πακέτου προγραμματισμού για τα διαπιστευτήρια Codex σας (ιδιόκτητα και κοινόχρηστα). Για κάθε διαπιστευτήριο Codex αποδίδει μια οριζόντια μπάρα ανά ενεργό παράθυρο ορίου ρυθμού — συνήθως ένα παράθυρο **5 hours** ή/και **Weekly**, ανάλογα με το πρόγραμμά σας — με το ποσοστό του υπολοίπου quota και αντίστροφη μέτρηση επαναφοράς. Τα δεδομένα προέρχονται από τις κεφαλίδες απόκρισης ορίου ρυθμού του backend του Codex, και ανακτώνται κατ' απαίτηση.

Τα διαπιστευτήρια OpenCode Go εμφανίζονται επίσης εκεί, αλλά επισημαίνονται ως **"usage unavailable"**: η πύλη OpenCode zen δεν εκθέτει δεδομένα υπολοίπου quota, οπότε δεν μπορεί να εμφανιστεί μπάρα.

## Σε Εκφράσεις

Ορισμένοι κόμβοι επιτρέπουν εκφράσεις για authentication. Χρησιμοποιήστε το [Expression DSL](./expression-dsl.md) με `$credentials.CredentialName` για να αναφερθείτε στο resolved secret ενός διαπιστευτηρίου μέσα σε μια έκφραση. Για τη γραμμή header που χρειάζεται κάθε τύπος διαπιστευτηρίου σε ένα HTTP request, δείτε [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Τα διαπιστευτήρια Codex εξαιρούνται σκόπιμα από το `$credentials`. Είτε συνδεθείτε με ChatGPT (συνδρομή, χωρίς κόστος API ανά token) είτε επικολλήσετε ένα Codex `access_token`, τα tokens περνούν μόνο στη διεργασία του τοπικού Codex runner. Τα tokens σύνδεσης ChatGPT ανανεώνονται αυτόματα καθώς λήγουν.

Τα διαπιστευτήρια Jira εξαιρούνται επίσης από το `$credentials`. Ο [Jira node](../nodes/jira-node.md) φορτώνει το διαπιστευτήριο μέσω `credentialId` κατά τον χρόνο εκτέλεσης. Για προσαρμοσμένες κλήσεις Jira REST που δεν καλύπτονται από τον Jira node, χρησιμοποιήστε τον [HTTP node](../nodes/http-node.md) με Jira Basic Auth (`email:api_token` για Jira Cloud ή `username:password` για Data Center / Server), για παράδειγμα `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Μπορείτε επίσης να χρησιμοποιήσετε ένα διαπιστευτήριο [Header](../nodes/http-node.md) με `Authorization: Basic <base64(user:secret)>`. Για τα personal access tokens του Jira Data Center / Server, στείλτε αντ' αυτού `Authorization: Bearer <token>`. Το ίδιο το διαπιστευτήριο Jira το υποστηρίζει μέσω της λειτουργίας ελέγχου ταυτότητας **Personal Access Token**.

| Τύπος διαπιστευτηρίου | Τιμή που εκτίθεται στο `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Συμβολοσειρά Bearer token |
| Header | Πλήρης γραμμή `header key: header value`, έτοιμη για εισαγωγή σε όρισμα cURL `-H` |
| GitHub | Personal access token |
| Notion | Εσωτερικό `api_token` ή OAuth `access_token` (Bearer token για κλήσεις Notion API) |
| Sentry | Sentry auth token |
| Discord / Slack | Webhook URL |

Παράδειγμα:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Χρησιμοποιήστε τον **node** Notion για εγγενείς λειτουργίες βάσης δεδομένων, σελίδας και block. Χρησιμοποιήστε το `$credentials` όταν ένα προσαρμοσμένο αίτημα [HTTP](../nodes/http-node.md) χρειάζεται το ίδιο Notion bearer token.

## Δημιουργία Διαπιστευτηρίων από το Chat

Ο [AI Assistant](./ai-assistant.md#credentials), η [καρτέλα Chat](../tabs/chat-tab.md) και το [Chat with Heym](./chat-with-heym.md) μπορούν να δημιουργήσουν ένα διαπιστευτήριο όταν ένα workflow το χρειάζεται, ή όποτε το ζητήσετε. Ο assistant προτείνει τον τύπο και ένα όνομα, και η κανονική φόρμα διαπιστευτηρίου ανοίγει μέσα στη συνομιλία. Ζητήστε να ενημερωθεί ένα διαπιστευτήριο που σας ανήκει και η ίδια φόρμα ανοίγει πάνω του, με τα secrets του masked. Ο assistant βλέπει μόνο το όνομα και τον τύπο. Το `heym_chat` μέσω [MCP](../tabs/mcp-tab.md) δεν μπορεί να δημιουργήσει, να ενημερώσει ή να επιλέξει διαπιστευτήρια.

## Σχετικά

- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη, επεξεργασία, διαγραφή διαπιστευτηρίων
- [GitHub Node](../nodes/github-node.md) – Εγγενείς λειτουργίες GitHub REST
- [Jira Node](../nodes/jira-node.md) – Αυτοματοποίηση έργου, issue, σχολίου, συνημμένου, χρήστη, ειδοποίησης και μετάβασης Jira
- [Linear Node](../nodes/linear-node.md) – Αυτοματοποίηση χώρου εργασίας και issue Linear GraphQL
- [Notion Node](../nodes/notion-node.md) – Αναζήτηση και διαχείριση περιεχομένου Notion
- [Sentry Node](../nodes/sentry-node.md) – Αυτοματοποίηση οργανισμού, έργου, ομάδας, issue, συμβάντος και release Sentry
- [Credentials Sharing](./credentials-sharing.md) – Κοινοποίηση με χρήστες και ομάδες
- [Third-Party Integrations](./integrations.md) – Οδηγός ρύθμισης ανά τύπο διαπιστευτηρίου
- [Expression DSL](./expression-dsl.md) – `$credentials` σε εκφράσεις

## Model Router (Auto Model)

Ένα Model Router δεν κρατά κλειδί. Κρατά ένα **decision model credential**, μια λίστα από **model options** — καθένα ένα υπάρχον διαπιστευτήριο OpenAI, Google ή Custom συν ένα μοντέλο — και, για κάθε επιλογή, ελεύθερο κείμενο που δηλώνει πότε πρέπει να χρησιμοποιείται αυτή η επιλογή.

Εμφανίζεται σε κάθε picker που προσφέρει μοντέλο: τους κόμβους [LLM](../nodes/llm-node.md) και [Agent](../nodes/agent-node.md), το Chat, τα AI Defaults, τα Dashboards, τον expression builder και τα Data Tables. Το μοναδικό του μοντέλο είναι το **Auto**. Επιλέξτε το, και το decision model διαβάζει κάθε αίτημα και το δρομολογεί. Τα [Evals](../tabs/evals-tab.md) το αφήνουν εκτός, επειδή ένα eval συγκρίνει συγκεκριμένα μοντέλα και ένας router επιλέγει μόνος του.

Ένας agent επαναδρομολογεί καθώς προχωρά ο βρόχος εργαλείων του, ώστε ένα φθηνό μοντέλο να αναλάβει τους πρώτους γύρους και ένα ισχυρότερο τον γύρο που το χρειάζεται. Πανομοιότυπα inputs επαναχρησιμοποιούν την προηγούμενη απόφαση, ώστε ένας βρόχος να πληρώνει για μια απόφαση μόνο όταν η συνομιλία έχει πραγματικά προχωρήσει.

### Τι δεν μπορεί να κάνει

Το Auto Model δεν μπορεί να συνδυαστεί με το **Responses API**, το **Batch mode** ή το **image output**. Αυτοί οι διακόπτες απενεργοποιούνται όταν επιλεγεί ένας router, και ο καθένας εξηγεί τον λόγο. Οι έλεγχοι guardrail και ο classifier πολιτικής ανθρώπινης αξιολόγησης είναι σταθερές κλήσεις ενός μοντέλου και δεν δρομολογούν ποτέ.
### Όταν η δρομολόγηση αποτυγχάνει

Επισημάνετε μία επιλογή **Χρήση αυτής της επιλογής όταν η δρομολόγηση αποτυγχάνει** και μια διακοπή λειτουργίας του μοντέλου αποφάσεων δεν σταματά ποτέ μια εκτέλεση· χρησιμοποιείται η εφεδρική επιλογή και ο λόγος καταγράφεται στην εκτέλεση. Χωρίς αυτήν, ο node αποτυγχάνει αντί να μαντέψει.

### Βλέποντας πού κατευθύνθηκε ένα αίτημα

Το Traces εμφανίζει `Auto Model / GPT-5` αντί για το μοντέλο μόνο, και το κόστος παραμένει αποδιδόμενο στο μοντέλο που εκτελέστηκε πραγματικά. Το Execution Log και το Span View του καμβά εμφανίζουν το ίδιο ζεύγος, και το Span View παραθέτει ποια σειρά κατευθύνθηκε πού.
