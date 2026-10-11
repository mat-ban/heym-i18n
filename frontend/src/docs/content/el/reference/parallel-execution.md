# Παράλληλη Εκτέλεση

Το Heym εκτελεί nodes παράλληλα όταν δεν έχουν εξαρτήσεις μεταξύ τους και επιτρέπει σε πολλαπλές εκτελέσεις workflow να εκτελούνται ταυτόχρονα.

## Εντός Μίας Εκτέλεσης

### Χρονοπρογραμματισμός Βασισμένος σε DAG

Ο executor ομαδοποιεί τα nodes ανά **επίπεδο εκτέλεσης** χρησιμοποιώντας έναν κατευθυνόμενο ακυκλικό γράφο (DAG):

1. **Επίπεδο 0** – Nodes χωρίς εισερχόμενες ακμές (nodes έναρξης)
2. **Επίπεδο N** – Nodes των οποίων όλες οι ανάντη εξαρτήσεις βρίσκονται στα επίπεδα 0..N-1

Τα nodes στο ίδιο επίπεδο δεν έχουν εξαρτήσεις μεταξύ τους και εκτελούνται παράλληλα.

### Thread Pool

- **Κοινόχρηστο pool**: `ThreadPoolExecutor(max_workers=8)` για την εκτέλεση nodes
- **Χρονοπρογραμματισμός**: `wait(..., return_when=FIRST_COMPLETED)` – μόλις ολοκληρωθεί οποιοδήποτε node, τα κατάντη nodes χρονοπρογραμματίζονται
- **Thread-safe**: Τα outputs των nodes αποθηκεύονται με lock (`store_node_output`)

### Υπο-Πράκτορες Orchestrator

Όταν ένας orchestrator agent επιστρέφει πολλαπλές κλήσεις εργαλείου `call_sub_agent` σε έναν κύκλο, αυτές εκτελούνται παράλληλα. Ανατρέξτε στην ενότητα [Agent Architecture](./agent-architecture.md).

### Merge Node

Το node [Merge](../nodes/merge-node.md) συνδυάζει outputs από πολλαπλούς παράλληλους κλάδους. Χρησιμοποιήστε το όταν χρειάζεται ρητά να συνδυάσετε αποτελέσματα· διαφορετικά, οι παράλληλοι κλάδοι μπορούν να καταλήξουν σε ξεχωριστά output nodes.

### Βρόχοι

Οι επαναλήψεις βρόχων εκτελούνται **διαδοχικά**. Τα nodes του σώματος του βρόχου επαναχρονοπρογραμματίζονται ανά επανάληψη.

### Πρόωρη Επιστροφή

Τα output nodes με `allowDownstream` μπορούν να επιστρέψουν πρόωρα. Η υπόλοιπη κατάντη εργασία εκτελείται στο παρασκήνιο.

## Ταυτόχρονες Εκτελέσεις Workflow

- **Χωρίς lock ανά workflow** – Πολλαπλά αιτήματα μπορούν να εκτελέσουν το ίδιο workflow ταυτόχρονα
- **Async API** – Τα endpoints του FastAPI χρησιμοποιούν `asyncio.to_thread(execute_workflow)` ώστε ο event loop να παραμένει αποκρίσιμος
- **Απομόνωση** – Κάθε εκτέλεση λαμβάνει το δικό της instance `WorkflowExecutor` και state

Τα triggers που εκτελούν workflows ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) καλούν ανεξάρτητα το `execute_workflow`.

## Streaming

Το streaming χρησιμοποιεί το ίδιο παράλληλο μοντέλο αλλά εκπέμπει events καθώς ολοκληρώνονται τα nodes. Το editor και το portal chat UI χρησιμοποιούν streaming εσωτερικά για ενημέρωση προόδου σε πραγματικό χρόνο, και οι χρήστες webhook μπορούν πλέον να ενταχθούν στο ίδιο event stream μέσω του endpoint εκτέλεσης [SSE Streaming](./sse-streaming.md).

## Σχετικά

- [Why Heym](../getting-started/why-heym.md) – Παράλληλη εκτέλεση DAG στο runtime του Heym
- [Workflow Structure](./workflow-structure.md) – Nodes, ακμές και ροή εκτέλεσης
- [Core Concepts](../getting-started/core-concepts.md) – Επισκόπηση ροής εκτέλεσης
- [Node Types](./node-types.md) – Node [Merge](../nodes/merge-node.md) και άλλοι τύποι
- [Triggers](./triggers.md) – Σημεία εισόδου που ενεργοποιούν εκτελέσεις
- [SSE Streaming](./sse-streaming.md) – Μορφή event stream για `/execute/stream`
