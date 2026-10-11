# Καρτέλα Διαπιστευτηρίων

Η καρτέλα **Διαπιστευτήρια** διαχειρίζεται κλειδιά API και μυστικά που χρησιμοποιούνται από τους κόμβους. Προσθέστε διαπιστευτήρια εδώ και αναφερθείτε σε αυτά με το όνομά τους στους κόμβους του workflow. Για μια επισκόπηση του τι είναι τα διαπιστευτήρια και πώς τα χρησιμοποιούν οι κόμβοι, ανατρέξτε στο [Διαπιστευτήρια](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Παρακολουθήστε την επίδειξη Διαπιστευτηρίων</a></p>

## Τύποι Διαπιστευτηρίων

| Τύπος | Περίπτωση Χρήσης |
|------|----------|
| **OpenAI** | Κλειδί API OpenAI για κόμβους LLM, Agent και RAG |
| **Google** | Κλειδί API Google AI (Gemini) |
| **GitHub** | Προσωπικό token πρόσβασης (PAT) GitHub για API GitHub, workflows κόμβων GitHub, διακομιστές MCP και workflows agent· προαιρετικό `base_url` GitHub Enterprise |
| **Linear** | Προσωπικό κλειδί API Linear ή OAuth2 για ομάδες, έργα, ζητήματα και σχόλια |
| **Notion** | Token εσωτερικής ενσωμάτωσης ή εξουσιοδότηση χώρου εργασίας OAuth δημόσιας ενσωμάτωσης |
| **Custom** | Προσαρμοσμένα endpoints LLM |
| **Bearer** | Token Bearer για έλεγχο ταυτότητας HTTP |
| **Header** | Προσαρμοσμένο ζεύγος κλειδιού-τιμής header για αιτήματα HTTP |
| **Telegram** | Token bot Telegram και προαιρετικό μυστικό webhook |
| **Slack** | URL εισερχόμενου webhook Slack |
| **Discord** | URL εισερχόμενου webhook Discord |
| **Discord Trigger** | Δημόσιο κλειδί εφαρμογής Discord |
| **IMAP** | Διαπιστευτήρια trigger εισερχόμενου γραμματοκιβωτίου |
| **SMTP** | Διαπιστευτήρια αποστολής email |
| **Redis** | Σύνδεση Redis |
| **RAG: Qdrant + OpenAI** | Διανυσματικός χώρος αποθήκευσης για κόμβους RAG, με υποστήριξη από εξωτερικό διακομιστή Qdrant |
| **RAG: Psql + OpenAI** | Διανυσματικός χώρος αποθήκευσης για κόμβους RAG, με υποστήριξη από τη βάση δεδομένων Postgres του Heym (pgvector) — χωρίς εξωτερική υπηρεσία |
| **RAG: Custom Embeddings** | Διανυσματικός χώρος αποθήκευσης για κόμβους RAG που χρησιμοποιούν οποιοδήποτε endpoint ενσωμάτωσης συμβατό με OpenAI, με Qdrant ή Postgres (pgvector) ως χώρο αποθήκευσης |
| **Cohere** | API Cohere για ενσωματώσεις |

## Προσθήκη Διαπιστευτηρίων

1. Κάντε κλικ στο **Προσθήκη Διαπιστευτηρίου**
2. Επιλέξτε τον τύπο διαπιστευτηρίου
3. Εισαγάγετε τις απαιτούμενες τιμές (κλειδί API, URL κ.λπ.)
4. Δώστε ένα όνομα για αναφορά στους κόμβους

Για το GitHub, η τρέχουσα ροή διαπιστευτηρίων βασίζεται σε PAT. Συνιστώνται PAT με λεπτομερή δικαιώματα. Οι ροές εγκατάστασης GitHub App δεν είναι πρώτης κατηγορίας στο UI σήμερα. Εάν χρησιμοποιείτε GitHub Enterprise Server, μπορείτε επίσης να ορίσετε ένα προαιρετικό βασικό URL API GitHub, όπως `https://github.example.com/api/v3`.

Για το Linear, επιλέξτε **Personal API key** ή **OAuth2** στο παράθυρο διαλόγου. Τα προσωπικά κλειδιά API δημιουργούνται
στο **Settings → Security & Access → Personal API keys** στο Linear. Το OAuth2 χρησιμοποιεί ένα Client ID και Client Secret
εφαρμογής OAuth Linear, με το `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
καταχωρισμένο ως URI ανακατεύθυνσης. Το διαπιστευτήριο ενεργεί με τα δικαιώματα του χρήστη Linear που
το δημιούργησε ή το εξουσιοδότησε. Χρησιμοποιήστε το **Test Connection** στο παράθυρο διαλόγου διαπιστευτηρίων για να επαληθεύσετε το κλειδί API ή
το token OAuth πριν την αποθήκευση.

Για το **Notion**, επιλέξτε **Internal token** ή **OAuth** στο παράθυρο διαλόγου. Το OAuth χρησιμοποιεί το Client ID και
το Client Secret από τη δημόσια ενσωμάτωση Notion σας· το Heym τα αποθηκεύει κρυπτογραφημένα στο διαπιστευτήριο.
Χρησιμοποιήστε το **Test Connection** για να επαληθεύσετε διαπιστευτήρια Supabase, Linear ή Notion πριν την αποθήκευση ενός workflow. Ανατρέξτε στο
[Ενσωματώσεις Τρίτων](../reference/integrations.md#notion) για λεπτομέρειες ρύθμισης του Notion.

Τα διαπιστευτήρια OAuth ανοίγουν τη σελίδα εξουσιοδότησης του παρόχου σε ένα αναδυόμενο παράθυρο. Εάν το πρόγραμμα περιήγησης το αποκλείσει, χρησιμοποιήστε τον σύνδεσμο **Άνοιγμα της σελίδας εξουσιοδότησης** κάτω από το κουμπί Σύνδεση· το παράθυρο διαλόγου ειδοποιεί όταν ολοκληρωθεί η σύνδεση. Μόλις συνδεθεί ένα νέο διαπιστευτήριο, το κουμπί εμφανίζει **Connected**.

## Επεξεργασία και Διαγραφή

- **Επεξεργασία** – Ενημέρωση τιμών διαπιστευτηρίων (οι ευαίσθητες τιμές αποκρύπτονται)
- **Διαγραφή** – Αφαίρεση διαπιστευτηρίου· τα workflows που το χρησιμοποιούν θα χρειαστούν αντικατάσταση

Κατά την επεξεργασία ενός διαπιστευτηρίου **GitHub** σε GitHub Enterprise Server, αφήνοντας το προαιρετικό **GitHub
API Base URL** κενό διατηρείται το υπάρχον endpoint Enterprise. Εισαγάγετε ένα νέο URL μόνο όταν
θέλετε να αλλάξετε αυτό το endpoint.

## Κοινοποίηση

- [Κοινοποίηση διαπιστευτηρίων](../reference/credentials-sharing.md) με άλλους χρήστες μέσω email ή με [Ομάδες](../reference/teams.md)
- Τα κοινόχρηστα διαπιστευτήρια εμφανίζονται με ένδειξη
- Ανάκληση κοινοποίησης από το μενού της κάρτας διαπιστευτηρίου
## Χρήση σε Κόμβους

Ανατρέξτε στα διαπιστευτήρια με το όνομά τους στη διαμόρφωση του κόμβου. Για παράδειγμα:
- [LLM node](../nodes/llm-node.md) – Επιλέξτε διαπιστευτήριο για το API του μοντέλου
- [HTTP node](../nodes/http-node.md) – Χρησιμοποιήστε διαπιστευτήρια Bearer ή Header για έλεγχο ταυτότητας
- [Agent node](../nodes/agent-node.md) – Περάστε GitHub tokens σε μεταβλητές περιβάλλοντος του MCP server, όπως `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub node](../nodes/github-node.md) – Εκτελέστε εγγενείς λειτουργίες GitHub για αποθετήρια, χρήστες, issues, reviews, releases, workflows, traffic και αρχεία
- [Linear node](../nodes/linear-node.md) – Διαβάστε μεταδεδομένα του workspace και αυτοματοποιήστε issues και σχόλια στο Linear
- [Notion node](../nodes/notion-node.md) – Διαχειριστείτε βάσεις δεδομένων, πηγές δεδομένων, σελίδες και blocks του Notion
- [RAG node](../nodes/rag-node.md) – Χρησιμοποιήστε διαπιστευτήριο Qdrant ή Postgres (pgvector) για τον διανυσματικό χώρο αποθήκευσης
- [Telegram Trigger node](../nodes/telegram-trigger-node.md) – Λάβετε webhooks από bot του Telegram
- [Telegram node](../nodes/telegram-node.md) – Στείλτε μηνύματα από bot του Telegram
- [Discord Trigger node](../nodes/discord-trigger-node.md) – Λάβετε webhooks αλληλεπίδρασης από το Discord
- [Discord node](../nodes/discord-node.md) – Στείλτε μηνύματα webhook στο Discord
- [IMAP Trigger node](../nodes/imap-trigger-node.md) – Κάντε poll σε ένα κοινόχρηστο inbox για νέα email

Ανατρέξτε στο [Expression DSL](../reference/expression-dsl.md) για αναφορά σε τιμές που υποστηρίζονται από διαπιστευτήρια μέσα σε εκφράσεις.

## Σχετικά

- [Third-Party Integrations](../reference/integrations.md) – Λεπτομερής οδηγός ρύθμισης για κάθε τύπο διαπιστευτηρίου (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack και άλλα)
- [Credentials Sharing](../reference/credentials-sharing.md) – Κοινοποίηση διαπιστευτηρίων με άλλους χρήστες
- [Security](../reference/security.md) – Κρυπτογράφηση σε κατάσταση ηρεμίας, διαχείριση συνεδριών, περιορισμός ρυθμού
- [Node Types](../reference/node-types.md) – Κόμβοι που χρησιμοποιούν διαπιστευτήρια ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vectorstores Tab](./vectorstores-tab.md) – Χρησιμοποιεί διαπιστευτήρια Qdrant ή Postgres (pgvector)
- [Chat Tab](./chat-tab.md) – Χρησιμοποιεί διαπιστευτήρια OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Συνοπτικός οδηγός σελίδας για τις επιφάνειες του dashboard
