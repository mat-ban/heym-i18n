# Γρήγορη Εκκίνηση

Ξεκινήστε το πρώτο σας Workflow στο Heym σε λίγα λεπτά.

Δεν έχετε ακόμη το Heym σε λειτουργία; Δείτε [Εκτέλεση & Ανάπτυξη](./running-and-deployment.md), ή ακολουθήστε το βίντεο-οδηγό: [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Δημιουργία Workflow

1. Μεταβείτε στην καρτέλα [Workflows](../tabs/workflows-tab.md)
2. Κάντε κλικ στο **New Workflow**
3. Ονομάστε το Workflow σας (π.χ. "Hello World")

## 2. Προσθήκη Nodes

1. Ανοίξτε το πάνελ **Nodes** στα αριστερά
2. Σύρετε ένα node [Input](../nodes/input-node.md) στον καμβά
3. Σύρετε ένα node [LLM](../nodes/llm-node.md) και συνδέστε το με το Input
4. Σύρετε ένα node [Output](../nodes/output-node.md) και συνδέστε το με το LLM

```
[Input] --> [LLM] --> [Output]
```

Δείτε τους [Τύπους Nodes](../reference/node-types.md) για όλα τα διαθέσιμα nodes.

## 3. Διαμόρφωση

- **Input**: Ορίστε μια προεπιλεγμένη τιμή ή αφήστε το κενό για είσοδο χρήστη (δείτε [Input Node](../nodes/input-node.md))
- **LLM**: Επιλέξτε ένα [credential](../tabs/credentials-tab.md) και μοντέλο, προσθέστε μια οδηγία συστήματος και ορίστε το `userMessage` σε `$input.text` (δείτε [LLM Node](../nodes/llm-node.md))
- **Output**: Ορίστε το `message` σε `$llm.text` για να μεταβιβάσετε την απάντηση του LLM (δείτε [Output Node](../nodes/output-node.md))

Χρησιμοποιήστε τη σύνταξη [Expression DSL](../reference/expression-dsl.md) για τα `$input.text` και `$llm.text`. Κάντε κλικ στο κουμπί ανάπτυξης στα πεδία έκφρασης για το [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) με ζωντανή προεπισκόπηση backend.

## 4. Εκτέλεση

Κάντε κλικ στο **Run**, πατήστε `Ctrl + Enter`, ή χρησιμοποιήστε το πάνελ εντοπισμού σφαλμάτων για εκτέλεση. Το Workflow εκτελείται από το node Input μέσω των συνδεδεμένων nodes έως το Output. Δείτε τα [Triggers](../reference/triggers.md) για άλλους τρόπους εκτέλεσης Workflows ([webhook](../reference/webhooks.md), portal, cron, κ.λπ.).

Δείτε προηγούμενες εκτελέσεις στο **History** (γραμμή εργαλείων) και χρησιμοποιήστε το **Bring to Canvas** για επανεκτέλεση με τις ίδιες εισόδους.

Στα Docs, Evals και άλλες εσωτερικές σελίδες εκτός καμβά, μπορείτε επίσης να χρησιμοποιήσετε το [Quick Drawer](../reference/quick-drawer.md) για να επιλέξετε ένα καρφιτσωμένο Workflow και να το εκτελέσετε χωρίς να επιστρέψετε στον editor.

Αν διαβάζετε τα docs και θέλετε διευκρίνιση πριν από τη δημιουργία, ανοίξτε το [Chat with Heym](../reference/chat-with-heym.md) από την κεφαλίδα των Docs για να υποβάλετε ερωτήσεις σχετικές με τη σελίδα.

Εναλλακτικά, χρησιμοποιήστε τον [AI Assistant](../reference/ai-assistant.md) από το πάνελ Debug για να δημιουργήσετε Workflows με φυσική γλώσσα—περιγράψτε τι θέλετε και το AI δημιουργεί nodes και edges.

Δημιουργείτε ήδη αυτοματισμούς σε άλλο εργαλείο; Το [Migrate to Heym](./migrate-to-heym.md) μετατρέπει ένα Workflow από n8n, Flowise, Dify, Langflow, sim.ai ή Activepieces σε Workflow του Heym που μπορείτε να εισαγάγετε.

## Σχετικά

- [Βασικές Έννοιες](./core-concepts.md) – Workflows, nodes και ροή εκτέλεσης
- [Μετεγκατάσταση στο Heym](./migrate-to-heym.md) – Μετατροπή workflows από n8n, Flowise, Dify, Langflow, sim.ai ή Activepieces σε Heym με AI
- [Εκτέλεση & Ανάπτυξη](./running-and-deployment.md) – Εκκίνηση τοπικά με `run.sh` ή ανάπτυξη με `deploy.sh`
- [Μεταβλητές Περιβάλλοντος](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Πλήρης αναφορά διαμόρφωσης
- [Ρυθμίσεις](../reference/user-settings.md) – Διαμόρφωση ονόματος, User Rules και κωδικού πρόσβασης
- [Λειτουργίες Canvas](../reference/canvas-features.md) – Data pin, αρχεία καταγραφής εκτέλεσης, ενεργοποίηση/απενεργοποίηση, εξαγωγή σε sub-workflow
- [Συντομεύσεις Πληκτρολογίου](../reference/keyboard-shortcuts.md) – Συντομεύσεις Canvas και editor
- [Expression DSL](../reference/expression-dsl.md) – Αναφορά δεδομένων στη διαμόρφωση node
- [Παράθυρο Αξιολόγησης Expression](../reference/expression-evaluation-dialog.md) – Επεκτάσιμος editor με ζωντανή προεπισκόπηση backend
- [Triggers](../reference/triggers.md) – Όλα τα σημεία εισόδου workflow ([webhook](../reference/webhooks.md), portal, cron, κ.λπ.)
- [Ιστορικό Εκτελέσεων](../reference/execution-history.md) – Προβολή προηγούμενων εκτελέσεων και Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Εκτέλεση καρφιτσωμένων workflows από σελίδες εκτός canvas
- [Συνομιλία με το Heym](../reference/chat-with-heym.md) – Υποβολή ερωτήσεων με βάση τα συμφραζόμενα από την κεφαλίδα της τεκμηρίωσης
- [Καρτέλα Workflows](../tabs/workflows-tab.md) – Δημιουργία και διαχείριση workflows
- [Καρτέλα Credentials](../tabs/credentials-tab.md) – Προσθήκη API keys για nodes LLM
- [AI Assistant](../reference/ai-assistant.md) – Δημιουργία workflows με φυσική γλώσσα
