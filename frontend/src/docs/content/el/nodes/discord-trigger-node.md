# Discord Trigger

Ο κόμβος **Discord Trigger** είναι ένα σημείο εισόδου μηδενικής εισόδου που λαμβάνει webhooks του Discord Interactions API και ξεκινά αυτόματα ένα workflow. Χρησιμοποιήστε τον για slash commands, κουμπιά, modals και άλλες αλληλεπιδράσεις εφαρμογών Discord που θα πρέπει να διοχετεύονται σε επόμενους κόμβους AI ή ενσωμάτωσης.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 0 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο `discord_trigger` που περιέχει το δημόσιο κλειδί της εφαρμογής Discord |

## Οδηγός Ρύθμισης

### 1. Δημιουργία Διαπιστευτηρίου `discord_trigger`

1. Μεταβείτε στις **Settings → Credentials → New Credential**
2. Επιλέξτε τύπο **Discord Trigger (Public Key)**
3. Επικολλήστε το **Application Public Key** από το Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Αποθηκεύστε το διαπιστευτήριο

### 2. Προσθήκη του Κόμβου στο Workflow σας

1. Σύρετε τον κόμβο **Discord Trigger** στον καμβά
2. Επιλέξτε τον κόμβο για να ανοίξει ο πίνακας Ιδιοτήτων
3. Επιλέξτε το διαπιστευτήριο `discord_trigger` σας
4. Αντιγράψτε το **Interactions URL** που εμφανίζεται στον πίνακα του κόμβου

### 3. Καταχώριση του Interactions Endpoint στο Discord

1. Ανοίξτε το [Discord Developer Portal](https://discord.com/developers/applications)
2. Επιλέξτε την εφαρμογή σας
3. Μεταβείτε στις **General Information** ή **Interactions**
4. Επικολλήστε το **Interactions Endpoint URL** του κόμβου στο πεδίο endpoint
5. Το Discord στέλνει ένα αίτημα `PING` για να επικυρώσει το endpoint και το Heym απαντά αυτόματα αφού επαληθεύσει την υπογραφή
6. Αποθηκεύστε τις αλλαγές σας

## Πεδία Εξόδου

Αφού ενεργοποιηθεί ο κόμβος, οι επόμενοι κόμβοι μπορούν να έχουν πρόσβαση στα εξής:

| Έκφραση | Περιγραφή |
|------------|-------------|
| `$nodeLabel.interaction` | Πλήρες payload αλληλεπίδρασης Discord |
| `$nodeLabel.type` | Τύπος αλληλεπίδρασης |
| `$nodeLabel.data` | Payload εντολής, κουμπιού ή modal |
| `$nodeLabel.data.name` | Όνομα slash command, όταν είναι εφαρμόσιμο |
| `$nodeLabel.data.options` | Πίνακας επιλογών slash command |
| `$nodeLabel.headers` | Εξυγιασμένες κεφαλίδες webhook |
| `$nodeLabel.triggered_by` | Ετικέτα πηγής trigger (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | Αναγνωριστικό κόμβου στον καμβά που έλαβε την αλληλεπίδραση Discord |
| `$nodeLabel.triggered_at` | Χρονική σήμανση ISO για αυτή την εκτέλεση workflow |

## Παράδειγμα Workflow

**Discord slash command → LLM → Output**

```
discordTrigger → llm → output
```

- Ετικέτα **Discord Trigger**: `discordEvent`
- Μήνυμα χρήστη **LLM**: `"Reply to this Discord command: $discordEvent.data.name"`
- Μήνυμα **Output**: `$llm.text`

## Ασφάλεια

- Τα αιτήματα επαληθεύονται χρησιμοποιώντας **Ed25519** με το δημόσιο κλειδί της εφαρμογής σας
- Χρονικές σημάνσεις παλαιότερες από **5 λεπτά** απορρίπτονται για να μειωθούν οι επιθέσεις επανάληψης
- Ευαίσθητες κεφαλίδες (`x-signature-ed25519`, `authorization`, κ.λπ.) αφαιρούνται πριν τα δεδομένα φτάσουν στους επόμενους κόμβους
- Το trigger απαιτεί έγκυρο διαπιστευτήριο `discord_trigger`· τα αιτήματα απορρίπτονται εάν το διαπιστευτήριο λείπει ή είναι άκυρο

## Σημειώσεις

- Το Heym επιστρέφει αμέσως μια αναβαλλόμενη απάντηση Discord, εκτελεί το workflow στο παρασκήνιο και δημοσιεύει την τελική έξοδο του workflow ως follow-up του Discord όταν ένας κόμβος `Output` παράγει περιεχόμενο
- Το interactions URL προκύπτει από το αναγνωριστικό του κόμβου και παραμένει σταθερό ακόμη και αν το workflow μετονομαστεί
- Χρησιμοποιήστε έναν κανονικό [Discord Node](./discord-node.md) μόνο όταν θέλετε επίσης ξεχωριστή δημοσίευση webhook επιπλέον του interaction follow-up
- Ένας κόμβος `discordTrigger` είναι συνήθως αρκετός· χρησιμοποιήστε **Switch** ή **Condition** στους επόμενους κόμβους για δρομολόγηση διαφορετικών τύπων αλληλεπίδρασης

## Σχετικά

- [Discord Node](./discord-node.md) – Αποστολή εξερχόμενων μηνυμάτων Discord
- [Triggers](../reference/triggers.md) – Επισκόπηση όλων των σημείων εισόδου workflow
- [Third-Party Integrations](../reference/integrations.md) – Ρύθμιση διαπιστευτηρίων Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη και διαχείριση διαπιστευτηρίων `discord_trigger`
