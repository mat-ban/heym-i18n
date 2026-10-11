# Βασικές Έννοιες

## Workflows

Ένα workflow είναι ένα κατευθυνόμενο γράφημα από [**nodes**](../reference/node-types.md) που συνδέονται με **edges**. Διαχειριστείτε τα workflows στην καρτέλα [Workflows](../tabs/workflows-tab.md). Οργανώστε τα σε [φακέλους](../reference/workflow-organization.md). Η εκτέλεση ρέει από τους [trigger nodes](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) μέσω nodes επεξεργασίας προς nodes [εξόδου](../nodes/output-node.md). Ανατρέξτε στη [Δομή Workflow](../reference/workflow-structure.md) για τη μορφή JSON. Αποθηκεύστε και μοιραστείτε workflows ως [Templates](../tabs/templates-tab.md) για να τα επαναχρησιμοποιήσετε σε πολλαπλά projects. Τα workflows μπορούν επίσης να εκτελεστούν από το [Board](../tabs/board-tab.md), όπου οι κάρτες kanban ενεργοποιούν την αλυσίδα workflow μιας στήλης με το πλήρες context της κάρτας.

## Nodes

Κάθε node διαθέτει:

- **Type** – Καθορίζει τη συμπεριφορά (π.χ. `llm`, `condition`, `http`)
- **Data** – Διαμόρφωση (model, prompt, URL, κ.λπ.)
- **Inputs/Outputs** – Χειριστήρια για σύνδεση με άλλα nodes

Ανατρέξτε στους [Τύπους Node](../reference/node-types.md) για την πλήρη λίστα.

## Edges

Τα edges συνδέουν το output handle ενός source node με το input handle ενός target node. Τα δεδομένα ρέουν κατά μήκος των edges κατά την εκτέλεση.

## Ροή Εκτέλεσης

1. **Trigger** – Ένα node Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger ή [WebSocket Trigger](../nodes/websocket-trigger-node.md) ξεκινά την εκτέλεση (ανατρέξτε στα [Triggers](../reference/triggers.md))
2. **Downstream** – Κάθε node λαμβάνει output από τα συνδεδεμένα upstream nodes· η [παράλληλη εκτέλεση](../reference/parallel-execution.md) εκτελεί ανεξάρτητα nodes ταυτόχρονα
3. **Expressions** – Τα nodes αναφέρονται σε upstream δεδομένα μέσω `$nodeLabel.field`. Ανατρέξτε στο [Expression DSL](../reference/expression-dsl.md).
4. **Output** – Το node [Output](../nodes/output-node.md) παράγει το τελικό αποτέλεσμα

## Αναφορές Παραστάσεων

Χρησιμοποιήστε το `$input` για τα δεδομένα του κόμβου Input και το `$nodeLabel.field` για οποιονδήποτε ανάντη κόμβο. Παράδειγμα: το `$llm.text` αναφέρεται στο πεδίο `text` από έναν κόμβο με ετικέτα "llm". Πλήρης σύνταξη: [Expression DSL](../reference/expression-dsl.md). Χρησιμοποιήστε το [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) για έναν μεγαλύτερο editor με ζωντανή προεπισκόπηση backend κατά την επεξεργασία παραστάσεων.

## Σχετικά

- [Γρήγορη Εκκίνηση](./quick-start.md) – Δημιουργήστε το πρώτο σας workflow
- [Δυνατότητες Καμβά](../reference/canvas-features.md) – Data pin, αρχεία καταγραφής εκτέλεσης, ενεργοποίηση/απενεργοποίηση, εξαγωγή σε sub-workflow
- [AI Assistant](../reference/ai-assistant.md) – Δημιουργία workflow με φυσική γλώσσα
- [Τύποι Κόμβων](../reference/node-types.md) – Όλοι οι διαθέσιμοι κόμβοι
- [Expression DSL](../reference/expression-dsl.md) – Αναφορά δεδομένων σε παραστάσεις
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Επεκτάσιμος editor με ζωντανή προεπισκόπηση backend
- [Καρτέλα Workflows](../tabs/workflows-tab.md) – Διαχείριση workflow και φακέλων
- [Οργάνωση Workflow](../reference/workflow-organization.md) – Φάκελοι και προγραμματισμένη διαγραφή
- [Triggers](../reference/triggers.md) – Σημεία εισόδου για workflow
- [Webhooks](../reference/webhooks.md) – Trigger HTTP webhook (TTL, cache, rate limit)
- [Παράλληλη Εκτέλεση](../reference/parallel-execution.md) – Πώς εκτελούνται οι κόμβοι παράλληλα
