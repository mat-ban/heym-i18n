# Telegram Trigger

Ο κόμβος **Telegram Trigger** είναι ένα σημείο εισόδου μηδενικής εισόδου που εκκινεί ένα workflow όταν το bot σας στο Telegram λαμβάνει ένα webhook update. Χρησιμοποιήστε τον για chatbots, διαλογή αιτημάτων υποστήριξης, εντολές τύπου slash ή callbacks από inline κουμπιά που πρέπει να διοχετεύονται σε επόμενους κόμβους AI και ενσωματώσεων.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 0 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο `telegram` που περιέχει το bot token και προαιρετικά το webhook secret token |

## Οδηγός Ρύθμισης

### 1. Δημιουργία Διαπιστευτηρίου `telegram`

1. Μεταβείτε στις **Settings → Credentials → New Credential**
2. Επιλέξτε τύπο **Telegram Bot**
3. Επικολλήστε το **Bot Token** από το BotFather
4. Προαιρετικά ορίστε ένα **Webhook Secret Token** εάν θέλετε το Telegram να στέλνει μια αντίστοιχη κεφαλίδα επαλήθευσης
5. Αποθηκεύστε το διαπιστευτήριο

### 2. Προσθήκη του Κόμβου στο Workflow σας

1. Σύρετε τον **Telegram Trigger** στον καμβά
2. Επιλέξτε τον κόμβο για να ανοίξετε τον πίνακα Ιδιοτήτων
3. Επιλέξτε το διαπιστευτήριο `telegram` σας
4. Αντιγράψτε το **Webhook URL** που εμφανίζεται στον πίνακα του κόμβου

### 3. Καταχώριση του Webhook στο Telegram

Χρησιμοποιήστε τη μέθοδο `setWebhook` του Bot API με το URL από τον κόμβο:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Εάν έχετε ρυθμίσει ένα secret token στο Heym, στείλτε την ίδια τιμή κατά τη ρύθμιση του webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Πεδία Εξόδου

Αφού ενεργοποιηθεί ο κόμβος, οι επόμενοι κόμβοι μπορούν να έχουν πρόσβαση στα εξής:

| Έκφραση | Περιγραφή |
|------------|-------------|
| `$nodeLabel.update` | Πλήρες payload του Telegram update |
| `$nodeLabel.message` | Κύριο αντικείμενο τύπου μηνύματος από το update |
| `$nodeLabel.message.text` | Κείμενο του εισερχόμενου μηνύματος |
| `$nodeLabel.message.chat.id` | Chat ID για απάντηση σε επόμενους κόμβους |
| `$nodeLabel.message.from.id` | Telegram user ID |
| `$nodeLabel.callback_query` | Payload callback όταν το update προήλθε από inline πληκτρολόγιο |
| `$nodeLabel.headers` | Εξυγιασμένες κεφαλίδες webhook |
| `$nodeLabel.triggered_by` | Ετικέτα πηγής trigger (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | Canvas node ID που έλαβε το Telegram update |
| `$nodeLabel.triggered_at` | Χρονική σήμανση ISO για αυτή την εκτέλεση του workflow |

## Παράδειγμα Workflow

**Telegram message → LLM → Telegram reply**

```
telegramTrigger → llm → telegram
```

- Ετικέτα **Telegram Trigger**: `telegramEvent`
- Μήνυμα χρήστη **LLM**: `"Reply briefly to this user message: $telegramEvent.message.text"`
- chatId **Telegram**: `$telegramEvent.message.chat.id`

## Ασφάλεια

- Εάν το διαπιστευτήριό σας διαθέτει `secret_token`, το Heym επαληθεύει το `x-telegram-bot-api-secret-token` πριν εκτελέσει το workflow.
- Οι ευαίσθητες κεφαλίδες αιτημάτων αφαιρούνται πριν το payload φτάσει στους επόμενους κόμβους.
- Το webhook URL είναι στατικό για το node ID, επομένως χρειάζεται να το καταχωρίσετε εκ νέου μόνο όταν αλλάξει ο ίδιος ο κόμβος.

## Σχετικά

- [Telegram Node](./telegram-node.md) – Αποστολή απάντησης ή εξερχόμενης ειδοποίησης
- [Triggers](../reference/triggers.md) – Επισκόπηση όλων των σημείων εισόδου workflow
- [Third-Party Integrations](../reference/integrations.md) – Ρύθμιση διαπιστευτηρίου Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη και διαχείριση διαπιστευτηρίων `telegram`
