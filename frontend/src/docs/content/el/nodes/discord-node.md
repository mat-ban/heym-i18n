# Discord

Ο **node Discord** στέλνει ένα μήνυμα σε ένα κανάλι Discord μέσω ενός Incoming Webhook. Χρησιμοποιήστε τον για ειδοποιήσεις, ειδοποιήσεις workflow, απαντήσεις τύπου bot και αναφορά σφαλμάτων.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο `discord` που περιέχει το URL του incoming webhook |
| `message` | expression | Κείμενο εξερχόμενου μηνύματος. Υποστηρίζει [expressions](../reference/expression-dsl.md). |
| `username` | expression | Προαιρετική παράκαμψη του εμφανιζόμενου ονόματος για αυτό το μήνυμα |
| `avatarUrl` | expression | Προαιρετική παράκαμψη του URL του avatar για αυτό το μήνυμα |

## Ρύθμιση

1. Δημιουργήστε ένα [Διαπιστευτήριο Discord Webhook](../reference/integrations.md#discord)
2. Προσθέστε τον node **Discord** στο workflow σας
3. Επιλέξτε το διαπιστευτήριο
4. Ορίστε το `message` στο εξερχόμενο κείμενο ή σε ένα πρότυπο που δημιουργείται από δεδομένα ανάντη
5. Προαιρετικά παρακάμψτε το εμφανιζόμενο `username` και το `avatarUrl`

## Παράδειγμα

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Πεδία Εξόδου

| Expression | Περιγραφή |
|------------|-------------|
| `$nodeLabel.status` | Κωδικός κατάστασης HTTP που επιστρέφεται από το Discord, συνήθως `204` σε περίπτωση επιτυχίας |
| `$nodeLabel.response` | Ακατέργαστο σώμα απόκρισης που επιστρέφεται από το webhook του Discord |
| `$nodeLabel.message` | Κείμενο μηνύματος που έστειλε το Heym |
| `$nodeLabel.username` | Όνομα χρήστη που στάλθηκε με το webhook, εάν παρασχέθηκε |
| `$nodeLabel.avatar_url` | URL του avatar που στάλθηκε με το webhook, εάν παρασχέθηκε |

## Συνήθη Πρότυπα

- Χρησιμοποιήστε τον μαζί με το [Discord Trigger](./discord-trigger-node.md) όταν θέλετε μια επιπλέον ανάρτηση σε κανάλι πέρα από την απάντηση αλληλεπίδρασης
- Στείλτε ειδοποιήσεις αποτυχίας από τον [Error Handler](./error-handler-node.md)
- Αναρτήστε περιλήψεις που δημιουργούνται από το [LLM](./llm-node.md) ή τον [Agent](./agent-node.md)

## Ασφάλεια Εξόδου

- Το URL του webhook που είναι αποθηκευμένο στο διαπιστευτήριο πρέπει να χρησιμοποιεί `http://` ή `https://` και να επιλύεται μόνο σε δημόσιες διευθύνσεις. Προορισμοί loopback, ιδιωτικοί, link-local, multicast και cloud-metadata αποκλείονται.
- Το Heym επικυρώνει τις επιλυμένες διευθύνσεις και καρφιτσώνει τον στόχο σύνδεσης πριν από την αποστολή, ώστε μια απάντηση DNS να μην μπορεί να μετακινήσει το αίτημα σε εσωτερική διεύθυνση μετά τον έλεγχο. Οι proxies περιβάλλοντος απενεργοποιούνται όσο ο φρουρός είναι ενεργός και οι ανακατευθύνσεις δεν ακολουθούνται.
- Οι αναπτύξεις που αναρτούν σε έναν εσωτερικό δέκτη webhook μπορούν να ορίσουν `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` σε ένα αξιόπιστο self-hosted instance. Διατηρήστε την προεπιλογή σε hosted ή multi-tenant αναπτύξεις.

**Σημείωση αναβάθμισης για v0.0.109:** αυτός ο έλεγχος είναι νέος για το Discord. Ένα διαπιστευτήριο του οποίου το URL του webhook δείχνει σε loopback ή ιδιωτική διεύθυνση απορρίπτεται εκτός εάν είναι ενεργοποιημένη η παραπάνω ρύθμιση.

## Σχετικά

- [Discord Trigger](./discord-trigger-node.md) – Ξεκινήστε ένα workflow από εισερχόμενες αλληλεπιδράσεις Discord
- [Third-Party Integrations](../reference/integrations.md) – Ρύθμιση διαπιστευτηρίου Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Προσθέστε και διαχειριστείτε διαπιστευτήρια `discord`
- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
