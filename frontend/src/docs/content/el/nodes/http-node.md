# HTTP

Ο **κόμβος** HTTP εκτελεί αιτήματα HTTP χρησιμοποιώντας σύνταξη cURL. Μπορεί να αποτελέσει σημείο εκκίνησης ενός workflow (χωρίς εισερχόμενη ακμή) ή να λαμβάνει είσοδο από ανάντη nodes.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 0 ή 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό node (camelCase) |
| `curl` | string | Εντολή cURL (π.χ. `curl -X GET https://api.example.com`) |

## Μορφή Απόκρισης

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Πρόσβαση στην Απόκριση

- `$httpNode.status` – Κωδικός κατάστασης HTTP
- `$httpNode.body` – Σώμα απόκρισης (string ή αναλυμένο JSON)
- `$httpNode.body.fieldName` – Πρόσβαση σε πεδία JSON
- `$httpNode.headers` – Κεφαλίδες απόκρισης

## Παράδειγμα

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Χρησιμοποιήστε σύνταξη cURL με `-H` για κεφαλίδες, `-d` για σώμα POST κ.λπ. Οι εκφράσεις μπορούν να χρησιμοποιηθούν οπουδήποτε στη συμβολοσειρά curl, συμπεριλαμβανομένου του URL, μιας κεφαλίδας ή ολόκληρης της γραμμής κεφαλίδας. Ένα [διαπιστευτήριο](../reference/credentials.md) Header επιλύεται σε `key: value`, οπότε το `-H "$credentials.MyApiKey"` στέλνει την πλήρη κεφαλίδα:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Τα εισαγωγικά και τα κενά εντός μιας έκφρασης ανήκουν στην έκφραση, όχι στην εντολή cURL, επομένως μέθοδοι που δέχονται ορίσματα συμβολοσειράς λειτουργούν ενσωματωμένα:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Έλεγχος Ταυτότητας με Διαπιστευτήρια

Το `$credentials.Name` επιλύεται σε διαφορετική τιμή για κάθε τύπο [διαπιστευτηρίου](../reference/credentials.md), οπότε η γραμμή κεφαλίδας εξαρτάται από τον τύπο:

| Τύπος διαπιστευτηρίου | Το `$credentials.Name` επιλύεται σε | Κεφαλίδα |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Το ακατέργαστο API key | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Το ακατέργαστο API key | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Το ακατέργαστο API key | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Ένα νέο OAuth access token, ανανεωμένο όταν λήξει | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Το token | `-H "Authorization: Bearer $credentials.Name"` |

Ένα διαπιστευτήριο Bearer φέρει ήδη το πρόθεμα `Bearer `, οπότε η προσθήκη ενός ακόμη στέλνει `Bearer Bearer …`. Τα διαπιστευτήρια Google Sheets και Google Drive σας επιτρέπουν να καλείτε Google APIs που δεν καλύπτονται από τον αντίστοιχο node, όπως η προσθήκη καρτέλας σε ένα υπολογιστικό φύλλο, εντός των scopes που έχουν εκχωρηθεί στο διαπιστευτήριο. Όταν ένα όνομα δεν είναι απλό αναγνωριστικό (περιέχει `-`, ξεκινά με ψηφίο ή είναι δεσμευμένη λέξη), χρησιμοποιήστε τη μορφή με αγκύλες: `-H "Authorization: $credentials["my-api-key"]"`.

Όταν ο [AI Assistant](../reference/ai-assistant.md) ή το [Chat](../tabs/chat-tab.md) δημιουργεί ένα αίτημα HTTP που χρειάζεται έλεγχο ταυτότητας και κανένας ειδικός node δεν καλύπτει την υπηρεσία, ρωτά ποιο διαπιστευτήριο να χρησιμοποιηθεί. Επιλέξτε ένα, αλλάξτε το προσυμπληρωμένο όνομα κεφαλίδας εάν το API αναμένει διαφορετικό, και θα συντάξει τη γραμμή κεφαλίδας για εσάς. Ο assistant βλέπει ονόματα και τύπους διαπιστευτηρίων, ποτέ τις τιμές τους. Εάν δεν έχετε κατάλληλο διαπιστευτήριο, η ερώτηση προσφέρει τη δημιουργία ενός. Τα μυστικά που φτάνουν στην έξοδο του node, όπως οι αποσταλμένες `request.headers`, αποκρύπτονται στα αποτελέσματα εκτέλεσης.

## Ασφάλεια Εξόδου

- Από προεπιλογή, το URL πρέπει να χρησιμοποιεί `http://` ή `https://` και να επιλύεται μόνο σε δημόσιες διευθύνσεις. Προορισμοί loopback, ιδιωτικοί, link-local, multicast και cloud-metadata αποκλείονται.
- Το Heym επικυρώνει τις επιλυμένες διευθύνσεις και καρφιτσώνει τον στόχο σύνδεσης για την αποτροπή DNS rebinding. Οι proxies περιβάλλοντος απενεργοποιούνται όσο ο φρουρός είναι ενεργός. Οι ανακατευθύνσεις δεν ακολουθούνται από προεπιλογή· προσθέστε την επιλογή `-L` του cURL για να τις ακολουθήσετε. Όταν ενεργοποιηθεί, κάθε βήμα ανακατεύθυνσης ελέγχεται βάσει της ίδιας πολιτικής δημόσιων διευθύνσεων και καρφιτσώνεται πριν από τη σύνδεση.
- Οι αξιόπιστες αυτο-φιλοξενούμενες εγκαταστάσεις που συνδέονται σκόπιμα με εσωτερικές υπηρεσίες μπορούν να ορίσουν `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Διατηρήστε την προεπιλογή σε φιλοξενούμενες ή multi-tenant εγκαταστάσεις.

**Σημείωση αναβάθμισης για v0.0.105:** αυτή η πολιτική σε επίπεδο instance προστατεύει πλέον και προορισμούς που προέρχονται από διαπιστευτήρια και χρησιμοποιούνται από τα Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, την προσαρμοσμένη εκτέλεση LLM και την ανακάλυψη μοντέλων, τον AI assistant, τα guardrails και τα RAG embeddings. Τα υπάρχοντα διαπιστευτήρια που δείχνουν σε διευθύνσεις loopback, ιδιωτικές ή link-local απορρίπτονται εκτός εάν ενεργοποιηθεί το `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` σε αξιόπιστη αυτο-φιλοξενούμενη εγκατάσταση. Όσο ο φρουρός είναι ενεργός, οι προστατευόμενοι HTTP clients αγνοούν τα `HTTP_PROXY` και `HTTPS_PROXY`· η ενεργοποίηση της εξαίρεσης τα επαναφέρει. Τα πακέτα CA του διαχειριστή που έχουν ρυθμιστεί μέσω `SSL_CERT_FILE` ή `SSL_CERT_DIR` εξακολουθούν να υποστηρίζονται. Το ClickHouse ελέγχεται πριν ανοίξει η σύνδεση αλλά δεν καρφιτσώνεται τη στιγμή της κλήσης, επειδή το clickhouse-connect φέρει το δικό του transport urllib3.

## Σχετικά

- [Τύποι Node](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
- [Triggers](../reference/triggers.md) – HTTP ως σημείο εισόδου workflow
- [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) – Προσθήκη API keys για αιτήματα με έλεγχο ταυτότητας
