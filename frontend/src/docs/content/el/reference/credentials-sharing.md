# Κοινοποίηση Διαπιστευτηρίων

Τα Διαπιστευτήρια μπορούν να κοινοποιηθούν σε άλλους χρήστες, ώστε τα workflows τους να μπορούν να χρησιμοποιούν τα API keys σας. Ανατρέξτε στην ενότητα [Διαπιστευτήρια](./credentials.md) για μια επισκόπηση και στην ενότητα [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) για την προσθήκη και τη διαχείριση διαπιστευτηρίων.

## Κοινοποίηση Διαπιστευτηρίων με ένα LLM

Για να επιτρέψετε σε ένα LLM ή σε έναν AI agent να χρησιμοποιεί ένα API key, αποθηκεύστε το key ως διαπιστευτήριο και αφήστε τον node που πραγματοποιεί το αίτημα να το επισυνάψει. Το μοντέλο αποφασίζει τι θα καλέσει· ο node πιστοποιεί την κλήση κατά την εκτέλεση.

- **Αποθηκεύστε το μυστικό ως διαπιστευτήριο.** Οι ευαίσθητες τιμές κρυπτογραφούνται σε κατάσταση ηρεμίας και αποκρύπτονται στη διεπαφή μετά τη δημιουργία.
- **Ανατρέξτε σε αυτό στο σημείο όπου πραγματοποιείται το αίτημα.** Οι nodes [LLM](../nodes/llm-node.md) και [Agent](../nodes/agent-node.md) επιλέγουν το διαπιστευτήριο του μοντέλου τους με βάση το ID, και τα HTTP requests τοποθετούν το `$credentials.CredentialName` στην κεφαλίδα auth. Κρατήστε τα μυστικά εκτός των πεδίων prompt, καθώς ό,τι βρίσκεται σε ένα prompt αποστέλλεται στον πάροχο του μοντέλου ως κείμενο.
- **Δώστε στον agent εργαλεία, όχι keys.** Όταν ένας Agent καλεί έναν HTTP node, έναν MCP server ή ένα sub-workflow ως εργαλείο, το διαπιστευτήριο εφαρμόζεται εντός αυτού του εργαλείου και το μοντέλο λαμβάνει το αποτέλεσμα του εργαλείου.
- **Οι έξοδοι αποκρύπτονται.** Όταν μια τιμή διαπιστευτηρίου μεγαλύτερη από επτά χαρακτήρες εμφανίζεται στην έξοδο ενός node, διατηρούνται μόνο οι πρώτοι επτά χαρακτήρες της, ώστε μια απόκριση που επαναλαμβάνει ένα key να εμφανίζει μόνο αυτό το πρόθεμα στα αποτελέσματα και στα traces. Ανατρέξτε στην ενότητα [Απόκρυψη Εξόδου](#output-masking).
- **Αφήστε τον βοηθό να δημιουργεί διαπιστευτήρια.** Όταν ο [AI Assistant](./ai-assistant.md#credentials) ή η καρτέλα Chat δημιουργεί ένα διαπιστευτήριο, βλέπει μόνο το όνομα και τον τύπο, και εσείς εισάγετε το μυστικό στην κανονική φόρμα διαπιστευτηρίου.
- **Κοινοποιήστε με άτομα με τον ίδιο τρόπο.** Κοινοποιήστε το διαπιστευτήριο σε έναν χρήστη ή σε μια ομάδα, όπως περιγράφεται παρακάτω, και τα workflows τους μπορούν να χρησιμοποιούν το key σας μέσω των δικών τους nodes LLM και Agent.

## Μοντέλο Κοινοποίησης

- **CredentialShare** – Συνδέει το `credential_id` με το `user_id` (μοναδικό ανά ζεύγος)
- **Κοινοποίηση μέσω email** – `POST /api/credentials/{credential_id}/shares` με email· ο χρήστης αναζητείται και προστίθεται
- **Ανάκληση** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Μπορείτε επίσης να κοινοποιήσετε διαπιστευτήρια σε [Ομάδες](./teams.md):

- **CredentialTeamShare** – Συνδέει το `credential_id` με το `team_id`· όλα τα μέλη της ομάδας αποκτούν πρόσβαση
- **Κοινοποίηση σε ομάδα** – `POST /api/credentials/{credential_id}/team-shares` με `team_id`
- **Ανάκληση κοινοποίησης σε ομάδα** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Τα κοινόχρηστα διαπιστευτήρια εμφανίζουν μια ένδειξη στη διεπαφή της [Καρτέλας Διαπιστευτηρίων](../tabs/credentials-tab.md).

## Διαπιστευτήρια Ευρείας Εμβέλειας

Η κοινοποίηση ενός διαπιστευτηρίου παρέχει στον παραλήπτη όλα όσα μπορεί να κάνει αυτό το διαπιστευτήριο. Για τις περισσότερες ενσωματώσεις, αυτό περιορίζεται σε έναν χώρο εργασίας ή στα δικαιώματα ενός API key, αλλά ορισμένα διαπιστευτήρια έχουν πολύ ευρύτερη εμβέλεια.

> **Τα διαπιστευτήρια Google Drive παρέχουν πλήρη πρόσβαση στο Drive.** Το διαπιστευτήριο [Google Drive](../nodes/google-drive-node.md) εξουσιοδοτείται με το scope `https://www.googleapis.com/auth/drive`, ώστε ο node να μπορεί να εκτελεί ενέργειες σε αρχεία που ήδη κατέχετε. Η κοινοποίησή του σε έναν χρήστη ή σε μια ομάδα παρέχει σε κάθε ένα από αυτά τα μέλη τη δυνατότητα να **διαβάζει, να τροποποιεί και να διαγράφει οριστικά οτιδήποτε στο Google Drive σας** μέσω ενός workflow — όχι μόνο τα αρχεία που είχατε κατά νου. Κοινοποιήστε το μόνο σε άτομα στα οποία θα δίνατε απευθείας πλήρη πρόσβαση στο Drive.

Εάν χρειάζεται να περιορίσετε την έκθεση, δημιουργήστε έναν αποκλειστικό λογαριασμό Google με πρόσβαση μόνο στους φακέλους που χρειάζεται το workflow, και συνδέστε το διαπιστευτήριο με αυτόν τον λογαριασμό αντί για τον κύριό σας.

Ένα διαπιστευτήριο **Decision Model** φέρει το endpoint και, όταν έχει οριστεί, ένα API key. Η κοινοποίησή του επιτρέπει στον παραλήπτη να πραγματοποιεί δαπάνες με αυτό το key από οποιοδήποτε workflow μπορεί να εκτελέσει, ακριβώς όπως ένα διαπιστευτήριο LLM.

Ένα διαπιστευτήριο **Model Router** κοινοποιεί όλα όσα δρομολογεί. Τα άτομα με τα οποία το κοινοποιείτε μπορούν να εκτελούν requests προς κάθε διαπιστευτήριο στη λίστα επιλογών του, και αυτά τα requests δαπανούν τα keys σας. Δεν μπορούν να διαβάσουν τα keys, και τα διαπιστευτήρια δεν εμφανίζονται στη δική τους λίστα διαπιστευτηρίων.

Πρόκειται για την ίδια παραχώρηση με την απευθείας κοινοποίηση ενός διαπιστευτηρίου OpenAI, και είναι αυτό που καθιστά έναν router χρήσιμο για μια ομάδα. Εάν δεν το επιθυμείτε αυτό, κοινοποιήστε τα μεμονωμένα διαπιστευτήρια και αφήστε κάθε άτομο να επιλέξει ένα μοντέλο.

## Κοινοποίηση με Συνεργάτες Workflow

Όταν κοινοποιείτε ένα workflow, οι συνεργάτες μπορούν να το ανοίξουν και να το εκτελέσουν, αλλά δεν μπορούν να χρησιμοποιήσουν τα διαπιστευτήριά σας εκτός εάν τους τα κοινοποιήσετε και αυτά. Αυτό ισχύει για τα διαπιστευτήρια στο κύριο workflow και σε οποιαδήποτε sub-workflows καλεί. Κοινοποιήστε κάθε διαπιστευτήριο στους ίδιους χρήστες ή ομάδες που προσκαλέσατε στο workflow. Τα sub-workflows πρέπει επίσης να κοινοποιούνται ξεχωριστά από τον editor του θυγατρικού workflow. Ανατρέξτε στην ενότητα [Οργάνωση Workflow](./workflow-organization.md#sharing-workflows).

## Πλαίσιο Εκτέλεσης

Όταν εκτελείται ένα workflow, τα διαπιστευτήρια επιλύονται για τον **κάτοχο του workflow** (ή τον τρέχοντα χρήστη κατά την εκτέλεση). Η συνάρτηση `get_credentials_context()` συγχωνεύει:

1. **Διαπιστευτήρια που κατέχετε** – `Credential.owner_id == user_id`
2. **Διαπιστευτήρια κοινόχρηστα σε χρήστες** – `CredentialShare` όπου `CredentialShare.user_id == user_id`
3. **Διαπιστευτήρια κοινόχρηστα σε ομάδες** – `CredentialTeamShare` όπου ο χρήστης είναι μέλος της ομάδας

Όλα συγχωνεύονται σε ένα ενιαίο dict πλαισίου με κλειδιά βάσει του ονόματος του διαπιστευτηρίου.

## Χρήση σε Workflows
### Με Όνομα (Expression DSL)

Τα Διαπιστευτήρια εκτίθενται ως `$credentials.CredentialName` στο [Expression DSL](./expression-dsl.md). Χρησιμοποιήστε το για:

- Κόμβους HTTP (Bearer/Header auth)
- Κόμβους Telegram
- Κόμβους Slack
- Notion bearer tokens σε προσαρμοσμένα HTTP requests (εσωτερικό token ή OAuth access token)
- Οποιονδήποτε κόμβο που δέχεται εκφράσεις για auth

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Με ID (credentialId)

Ορισμένοι κόμβοι αποθηκεύουν το `credentialId` (UUID) στο `node.data`:

| Τύπος Κόμβου | Πεδίο | Περιγραφή |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Διαπιστευτήριο LLM API |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Διαπιστευτήριο Codex access token και διαπιστευτήριο GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Διαπιστευτήριο OpenCode Go gateway και διαπιστευτήριο GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Διαπιστευτήριο Jira Cloud email/API token ή Data Center username/password |
| [Notion](../nodes/notion-node.md) | `credentialId` | Διαπιστευτήριο Notion internal token ή OAuth workspace |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth token και προαιρετικό base URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase project URL και API key |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Στοιχεία σύνδεσης ClickHouse (host, port, auth, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Διαπιστευτήριο Telegram bot |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Διαπιστευτήριο Discord public key ή webhook |
| Vector Store | `credential_id` | Qdrant ή Postgres (pgvector) vector DB, μέσω διαπιστευτηρίου Qdrant, Psql ή Custom Embeddings RAG |
| Evals | `credential_id`, `judge_credential_id` | Διαπιστευτήριο μοντέλου· διαπιστευτήριο μοντέλου ή Decision Model για τον κριτή LLM-as-Judge |
| [Playwright](../nodes/playwright-node.md) AI step | `credentialId` | Μοντέλο LLM/Vision (για AI step και [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Ο executor φορτώνει το διαπιστευτήριο απευθείας από τη βάση δεδομένων με ID και αποκρυπτογραφεί τη διαμόρφωση.

## Απόκρυψη Εξόδου

Μετά την εκτέλεση, η `mask_sensitive_output()` αποκρύπτει τις τιμές των διαπιστευτηρίων στις εξόδους, διατηρώντας τους πρώτους επτά χαρακτήρες κάθε μυστικού που είναι μεγαλύτερο από επτά χαρακτήρες και αντικαθιστώντας τους υπόλοιπους με `**`, ώστε τα μυστικά να μην εκτίθενται σε αποτελέσματα ή traces.

## Σχετικά

- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη και κοινή χρήση διαπιστευτηρίων
- [Third-Party Integrations](./integrations.md) – Λεπτομερής ρύθμιση για κάθε τύπο διαπιστευτηρίου
- [Teams](./teams.md) – Κοινή χρήση με ομάδες
- [Expression DSL](./expression-dsl.md) – Σύνταξη `$credentials`
- [Node Types](./node-types.md) – Κόμβοι που χρησιμοποιούν διαπιστευτήρια ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent Node](../nodes/agent-node.md) – Χρησιμοποιεί `credentialId` για LLM
