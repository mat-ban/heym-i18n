# Αποστολή WebSocket

Ο κόμβος **WebSocket Send** ανοίγει μια εξερχόμενη σύνδεση client προς έναν εξωτερικό διακομιστή WebSocket, αποστέλλει ένα μήνυμα και κλείνει τη σύνδεση. Χρησιμοποιήστε τον όταν ένα workflow χρειάζεται να προωθήσει συμβάντα σε ένα σύστημα πραγματικού χρόνου χωρίς να εκθέσει ένα endpoint socket που ανήκει στο Heym.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `websocketUrl` | string / expression | Εξωτερικό URL `ws://` ή `wss://` |
| `websocketHeaders` | JSON object string / expression | Προαιρετικές κεφαλίδες handshake |
| `websocketSubprotocols` | string | Προαιρετική λίστα subprotocol διαχωρισμένη με κόμμα |
| `websocketMessage` | expression | Payload προς αποστολή |

## Κανόνες Σειριοποίησης Μηνυμάτων

- Αν το `websocketMessage` επιλυθεί σε **string**, το Heym αποστέλλει ένα text frame.
- Αν επιλυθεί σε **object**, **array**, **number**, **boolean** ή `null`, το Heym το σειριοποιεί ως JSON text.
- Αν επιλυθεί σε **bytes**, το Heym αποστέλλει ένα binary frame.
- Πλήρεις εκφράσεις όπως `$input` διατηρούν τους εγγενείς τύπους πριν από τη σειριοποίηση.

## Πεδία Εξόδου

| Έκφραση | Περιγραφή |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` σε περίπτωση επιτυχίας |
| `$nodeLabel.url` | Επιλυμένο URL προορισμού |
| `$nodeLabel.message_type` | `text`, `json` ή `binary` |
| `$nodeLabel.size_bytes` | Μέγεθος payload σε bytes |
| `$nodeLabel.subprotocol` | Διαπραγματευμένο subprotocol όταν υπάρχει |
| `$nodeLabel.sent_at` | Χρονική σήμανση ISO |

## Παράδειγμα Workflow

**HTTP request → transform → publish over WebSocket**

```
input → set → websocketSend → output
```

- Το **Set** δημιουργεί ένα αντικείμενο payload όπως `{ "type": "user.updated", "user": $input.body }`
- Το **WebSocket Send** χρησιμοποιεί το `$payloadNode` ως `websocketMessage`
- Το **Output** μπορεί να επιστρέψει το `$socketSend.status`

## Παράδειγμα Node JSON

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Σημειώσεις

- Δεν απαιτείται [διαπιστευτήριο](../reference/credentials.md) για αυτόν τον κόμβο.
- Αν ο απομακρυσμένος διακομιστής αναμένει κεφαλίδες auth ή tenant, περάστε τις μέσω του `websocketHeaders`.
- Χρησιμοποιήστε το [HTTP](./http-node.md) όταν το απομακρυσμένο σύστημα βασίζεται σε request/response αντί για socket.

## Ασφάλεια Εξερχόμενης Κίνησης

- Από προεπιλογή, το URL πρέπει να χρησιμοποιεί `ws://` ή `wss://` και να επιλύεται μόνο σε δημόσιες διευθύνσεις. Προορισμοί loopback, private, link-local, multicast και cloud-metadata αποκλείονται.
- Το Heym επικυρώνει κάθε επιλυμένη διεύθυνση και συνδέεται απευθείας σε μία από αυτές τις διευθύνσεις. Οι proxies περιβάλλοντος και οι ανακατευθύνσεις WebSocket είναι απενεργοποιημένες όσο ο μηχανισμός προστασίας είναι ενεργός.
- Υποστηρίζονται οι κεφαλίδες `Authorization`, `Origin`, `User-Agent` και προσαρμοσμένες κεφαλίδες δεδομένων. Το `Origin` αποστέλλεται μέσω της ειδικής επιλογής του client WebSocket. Οι κεφαλίδες `Host`, `Connection`, `Upgrade` και `Sec-WebSocket-*` δεν μπορούν να παρακαμφθούν.
- Αξιόπιστες self-hosted εγκαταστάσεις που συνδέονται σκόπιμα σε εσωτερικές υπηρεσίες μπορούν να ορίσουν `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Διατηρήστε την προεπιλογή σε hosted ή multi-tenant εγκαταστάσεις.

**Σημείωση αναβάθμισης για την v0.0.105:** αυτή η πολιτική σε επίπεδο instance προστατεύει πλέον και προορισμούς που προέρχονται από διαπιστευτήρια και χρησιμοποιούνται από τα Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, προσαρμοσμένη εκτέλεση LLM και ανακάλυψη μοντέλων, τον AI assistant, τα guardrails και τα RAG embeddings. Υπάρχοντα διαπιστευτήρια που δείχνουν σε διευθύνσεις loopback, private ή link-local απορρίπτονται εκτός αν το `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` είναι ενεργοποιημένο σε αξιόπιστη self-hosted εγκατάσταση. Όσο ο μηχανισμός προστασίας είναι ενεργός, οι προστατευμένοι HTTP clients αγνοούν τα `HTTP_PROXY` και `HTTPS_PROXY`· η ενεργοποίηση της εξαίρεσης τα επαναφέρει. Τα πακέτα CA του διαχειριστή που έχουν ρυθμιστεί μέσω `SSL_CERT_FILE` ή `SSL_CERT_DIR` εξακολουθούν να υποστηρίζονται. Το ClickHouse ελέγχεται πριν ανοίξει η σύνδεση αλλά δεν καρφιτσώνεται τη στιγμή της κλήσης, επειδή το clickhouse-connect φέρνει το δικό του transport urllib3.

## Σχετικά

- [WebSocket Trigger](./websocket-trigger-node.md) – Ακρόαση εξωτερικού socket και ενεργοποίηση workflows σε συμβάντα
- [Node Types](../reference/node-types.md) – Επισκόπηση κόμβων ενσωμάτωσης
- [Expression DSL](../reference/expression-dsl.md) – Δημιουργία δυναμικών JSON payloads
- [Third-Party Integrations](../reference/integrations.md) – Ενσωματώσεις με διαπιστευτήρια vs άμεσης διαμόρφωσης
