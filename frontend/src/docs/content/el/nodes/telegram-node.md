# Telegram

Ο **Telegram** node στέλνει ένα μήνυμα μέσω του Telegram Bot API. Χρησιμοποιήστε τον για απαντήσεις σε chat, επιχειρησιακές ειδοποιήσεις, ενημερώσεις κατάστασης workflow ή οποιοδήποτε επόμενο βήμα που πρέπει να στείλει μήνυμα σε χρήστη, ομάδα ή κανάλι του Telegram.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο `telegram` που περιέχει το bot token |
| `chatId` | expression | Αναγνωριστικό προορισμού chat, ομάδας ή καναλιού |
| `message` | expression | Κείμενο εξερχόμενου μηνύματος. Υποστηρίζει [expressions](../reference/expression-dsl.md). |

## Ρύθμιση

1. Δημιουργήστε ένα [Telegram Bot credential](../reference/integrations.md#telegram)
2. Προσθέστε τον **Telegram** node στο workflow σας
3. Επιλέξτε το διαπιστευτήριο
4. Ορίστε το `chatId` σε ένα στατικό chat ID ή σε μια έκφραση όπως `$telegramEvent.message.chat.id`
5. Ορίστε το `message` στο εξερχόμενο κείμενο ή σε ένα πρότυπο που δημιουργείται από δεδομένα προηγούμενων βημάτων

## Παράδειγμα

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Πεδία Εξόδου

| Έκφραση | Περιγραφή |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` σε περίπτωση επιτυχίας |
| `$nodeLabel.ok` | Σημαία επιτυχίας του Telegram API |
| `$nodeLabel.result` | Ακατέργαστο αντικείμενο αποτελέσματος `sendMessage` από το Telegram |
| `$nodeLabel.result.message_id` | Αναγνωριστικό μηνύματος Telegram |
| `$nodeLabel.result.chat.id` | Αναγνωριστικό chat προορισμού που επιστρέφεται από το Telegram |

## Συνήθη Πρότυπα

- Συνδυάστε τον με το [Telegram Trigger](./telegram-trigger-node.md) για bots συνομιλίας
- Στείλτε ειδοποιήσεις σφαλμάτων από τον [Error Handler](./error-handler-node.md)
- Δημοσιεύστε περιλήψεις που δημιουργούνται από το [LLM](./llm-node.md) ή τον [Agent](./agent-node.md)

## Σχετικά

- [Telegram Trigger](./telegram-trigger-node.md) – Ξεκινήστε ένα workflow από εισερχόμενα μηνύματα bot
- [Third-Party Integrations](../reference/integrations.md) – Ρύθμιση διαπιστευτηρίου Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη και διαχείριση διαπιστευτηρίων `telegram`
- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
