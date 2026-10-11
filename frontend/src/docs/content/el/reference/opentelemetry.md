# Παρακολούθηση OpenTelemetry

Το Heym μπορεί να εκπέμπει traces [OpenTelemetry](https://opentelemetry.io/) για κάθε εκτέλεση workflow, εκτέλεση node και κλήση εργαλείου Agent. Κάθε εκτέλεση παράγει ένα root span με θυγατρικά spans ανά node και ανά εργαλείο Agent, ώστε να είναι δυνατό να διαπιστωθεί ποιο βήμα απέτυχε, πόσο χρόνο διήρκεσε, τι κλήθηκε και τι επιστράφηκε. Τα spans εξάγονται μέσω OTLP/HTTP σε οποιοδήποτε συμβατό backend, όπως Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic ή Grafana Cloud.

Η παρακολούθηση είναι **απενεργοποιημένη από προεπιλογή**. Όταν είναι ανενεργή, δεν υπάρχει μετρήσιμη επιβάρυνση και δεν δημιουργούνται spans.

## Ενεργοποίηση Παρακολούθησης

Ορίστε τις ακόλουθες μεταβλητές περιβάλλοντος στο backend και, στη συνέχεια, επανεκκινήστε το:

Για τον πλήρη κατάλογο μεταβλητών περιβάλλοντος, ανατρέξτε στο [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Μεταβλητή | Προεπιλογή | Περιγραφή |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Κεντρικός διακόπτης. Ορίστε σε `true` για ενεργοποίηση της παρακολούθησης. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Βασικό endpoint OTLP/HTTP, για παράδειγμα `http://collector:4318`. Το Heym αποστέλλει spans στο `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Κεφαλίδες `key=value` διαχωρισμένες με κόμμα για έλεγχο ταυτότητας του exporter, για παράδειγμα `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Το resource attribute `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Αναλογία head sampling μεταξύ `0.0` και `1.0`, εφαρμοζόμενη με parent-based sampler. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Όταν είναι `true`, επισυνάπτονται περικομμένα payload εισόδου και εξόδου node στα spans των nodes. Απενεργοποιημένο από προεπιλογή για λόγους ιδιωτικότητας. |

Ελάχιστο παράδειγμα:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Είναι δυνατή η επιβεβαίωση της ενεργής διαμόρφωσης στην εφαρμογή, στην ενότητα **Settings → Observability** (ανοίξτε την από το avatar σας στην κεφαλίδα). Το συγκεκριμένο πάνελ είναι μόνο για ανάγνωση και δεν εμφανίζει ποτέ μυστικά του exporter.

## Τι Παρακολουθείται

### Root span workflow

Όνομα: `heym.workflow.execute`

| Attribute | Περιγραφή |
|-----------|-------------|
| `heym.workflow.id` | Το UUID του workflow. |
| `heym.node.count` | Αριθμός nodes στο workflow. |
| `heym.workflow.test_mode` | `true` για δοκιμαστικές εκτελέσεις. |
| `heym.sub_workflow.depth` | Βάθος ένθεσης όταν καλείται ως sub-workflow. |
| `heym.workflow.status` | Τελική κατάσταση της εκτέλεσης. Μια αποτυχημένη εκτέλεση θέτει την κατάσταση του span σε `ERROR`. |

### Span node

Όνομα: `heym.node.execute`, δημιουργείται ως θυγατρικό του span του workflow.

| Attribute | Περιγραφή |
|-----------|-------------|
| `heym.node.id` | Το id του node. |
| `heym.node.type` | Ο τύπος του node, για παράδειγμα `agent`, `llm`, `http`. |
| `heym.node.label` | Η ετικέτα του node που εμφανίζεται στον καμβά. |
| `heym.node.status` | `success` ή `error`. Τα σφάλματα θέτουν την κατάσταση του span σε `ERROR`. |
| `heym.node.duration_ms` | Χρόνος εκτέλεσης του node σε χιλιοστά του δευτερολέπτου. |
| `heym.llm.model` | Όνομα μοντέλου για nodes LLM και agent, όταν είναι διαθέσιμο. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Χρήση tokens για nodes LLM και agent, όταν είναι διαθέσιμη. |

Τα spans των nodes ενσωματώνονται σωστά κάτω από το span του workflow ακόμη και όταν τα nodes εκτελούνται παράλληλα, επειδή το context του workflow μεταδίδεται στα worker threads.

### Span εργαλείου Agent

Όνομα: `heym.agent.tool.execute`, δημιουργείται κάτω από το ενεργό span του node Agent.

| Attribute | Περιγραφή |
|-----------|-------------|
| `heym.agent.tool.name` | Όνομα εργαλείου που επιλέχθηκε από το μοντέλο. |
| `heym.agent.tool.call_id` | Το id κλήσης εργαλείου του παρόχου, όταν είναι διαθέσιμο. |
| `heym.agent.tool.source` | Προέλευση εργαλείου, όπως `node_tool`, `mcp`, `skill` ή `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Ετικέτα διακομιστή MCP, όταν εφαρμόζεται. |
| `heym.agent.tool.iteration` | Επανάληψη του βρόχου εργαλείων του Agent. |
| `heym.agent.tool.args_bytes` | Μέγεθος UTF-8 των σειριοποιημένων ορισμάτων του εργαλείου. |
| `heym.agent.tool.result_bytes` | Μέγεθος UTF-8 του σειριοποιημένου αποτελέσματος του εργαλείου. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` ή `cancelled`. Τα σφάλματα εργαλείου θέτουν την κατάσταση του span σε `ERROR`. |

Τα ακατέργαστα ορίσματα και αποτελέσματα των εργαλείων δεν επισυνάπτονται στα spans από προεπιλογή.

## Ασφάλεια payload εργαλείων Agent

Τα αποθηκευμένα payload παρατηρησιμότητας του Agent αποκρύπτονται και περικόπτονται σε επίπεδο κώδικα (`4096` χαρακτήρες ανά συμβολοσειρά, βάθος `6`, `32768` συνολικοί χαρακτήρες ανά εγγραφή trace LLM). Ο συνολικός προϋπολογισμός του trace κατανέμεται μεταξύ των εγγραφών εργαλείων, ώστε ένα πρώιμο μεγάλο αποτέλεσμα να μην μπορεί να αποκρύψει την ταυτότητα και την κατάσταση κύκλου ζωής μεταγενέστερων κλήσεων. Τα περιορισμένα μεταδεδομένα λήψης `_generated_files` δεσμεύονται ξεχωριστά από την ογκώδη έξοδο skill:

- Ενότητες εργαλείων `request` / `response` του trace LLM, συμπεριλαμβανομένων των αντιγράφων `_hitl_pending` που εγγράφονται στο trace store
- Εγγραφές `tool_calls` του αποτελέσματος Agent που εμφανίζονται στο ιστορικό εκτελέσεων
- Συμβάντα αποτελεσμάτων εργαλείων του Live Debug panel, τα οποία επαναχρησιμοποιούν την ίδια περιορισμένη και εξυγιασμένη εγγραφή

Η ζωντανή εκτέλεση εργαλείων, τα μηνύματα εργαλείων που αποστέλλονται στο μοντέλο και η κατάσταση επανάληψης HITL στη μνήμη (`_hitl_pending.agent_state.messages` / `tool_arguments`) διατηρούν τις αρχικές τιμές, ώστε η επανάληψη και η αντιστοίχιση ακριβών ορισμάτων να εξακολουθούν να λειτουργούν. Μόνο τα αποθηκευμένα αντίγραφα παρατηρησιμότητας εξυγιαίνονται.
## Διάδοση Πλαισίου Trace

Το Heym ακολουθεί το πρότυπο [W3C Trace Context](https://www.w3.org/TR/trace-context/) ώστε τα traces να παραμένουν συνδεδεμένα across service boundaries.

- **Εισερχόμενα webhooks:** όταν ένα εισερχόμενο αίτημα φέρει header `traceparent`, η εκτέλεση του workflow καταγράφεται ως παιδί αυτού του trace. Αυτό συνδέει τις εκτελέσεις του Heym με το upstream σύστημα που τις ενεργοποίησε.
- **Εξερχόμενο HTTP:** ο node HTTP εισάγει το `traceparent` στα αιτήματα που πραγματοποιεί, ώστε οι downstream υπηρεσίες να μπορούν να συνεχίσουν το ίδιο trace.
- **Υπο-workflows:** μια εκτέλεση υπο-workflow συνδέεται ως παιδί με τον node που την κάλεσε, διατηρώντας την ιεραρχία κλήσεων σε ένα trace.

Τα Triggers χωρίς εισερχόμενο πλαίσιο (όπως Cron, IMAP, RabbitMQ και WebSocket) ξεκινούν ένα νέο trace ανά εκτέλεση.

## Αξιοπιστία

- Ένας αργός ή μη προσβάσιμος collector δεν μπλοκάρει ποτέ την εκτέλεση του workflow. Τα spans ομαδοποιούνται σε batches και εξάγονται στο παρασκήνιο.
- Εάν η προετοιμασία του tracing αποτύχει (για παράδειγμα, λόγω εσφαλμένου endpoint), το backend καταγράφει το σφάλμα και συνεχίζει με το tracing απενεργοποιημένο αντί να αποτύχει η εκκίνηση.
- Τα headers πιστοποίησης του OTLP διαβάζονται αποκλειστικά από το περιβάλλον. Δεν αποθηκεύονται ποτέ στη βάση δεδομένων και δεν επιστρέφονται ποτέ από το API κατάστασης.

## Σχετικά

- [Ρυθμίσεις](./user-settings.md) – Η καρτέλα Observability που εμφανίζει την κατάσταση του tracing
- [Μεταβλητές Περιβάλλοντος](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Πλήρης αναφορά διαμόρφωσης
- [Triggers](./triggers.md) – Πώς ξεκινούν τα workflows, συμπεριλαμβανομένων των webhooks
- [Ιστορικό Εκτελέσεων](./execution-history.md) – Η ενσωματωμένη προβολή ιστορικού ανά εκτέλεση του Heym
- [HTTP](../nodes/http-node.md) – Ο node που διαδίδει το πλαίσιο trace σε downstream κλήσεις
