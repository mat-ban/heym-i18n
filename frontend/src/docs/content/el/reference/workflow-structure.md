# Δομή Workflow

Τα Workflows αποθηκεύονται ως JSON με nodes και edges. Ανατρέξτε στο [Node Types](./node-types.md) για τους διαθέσιμους τύπους node και στο [Expression DSL](./expression-dsl.md) για τη σύνταξη εκφράσεων στα πεδία `data`.

## Αντικείμενο Workflow

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Αντικείμενο Node

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### `data` node Agent (μόνιμη μνήμη)

Οι nodes [Agent](../nodes/agent-node.md) υποστηρίζουν ένα προαιρετικό γράφο γνώσης ανά node του καμβά:

| Πεδίο | Τύπος | Περιγραφή |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Όταν είναι `true`, φορτώνει τον αποθηκευμένο γράφο στο system prompt και συγχωνεύει νέα γεγονότα μετά από επιτυχημένες εκτελέσεις |
| `memoryShares` | array (προαιρετικό) | Παρέχει σε άλλους agents πρόσβαση στον γράφο μνήμης αυτού του node (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Ανατρέξτε στο [Agent Persistent Memory](./agent-persistent-memory.md). |

Παράδειγμα:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

Ανατρέξτε στο [Agent Persistent Memory](./agent-persistent-memory.md) για διαδρομές API, συμπεριφορά του editor και σημασιολογία εξαγωγής.

## Αντικείμενο Edge

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Τύποι Node

Συνήθεις τιμές `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) και άλλα. Πλήρης λίστα: [Node Types](./node-types.md). Οι nodes στο ίδιο επίπεδο εκτέλεσης εκτελούνται [παράλληλα](./parallel-execution.md).

## Διάταξη editor

Κάθε node διαθέτει `position.x` και `position.y` για τη διάταξη στον καμβά επιφάνειας εργασίας. Σε οθόνες κάτω από το breakpoint των
768px, ο editor αντικαθιστά τον ελεύθερο καμβά Vue Flow με ένα δέντρο workflow πλήρους οθόνης με εσοχές. Το δέντρο ακολουθεί τις συνδεδεμένες διαδρομές εκτέλεσης, επισημαίνει τους παράλληλους κλάδους και χρησιμοποιεί τις ίδιες ετικέτες node, εικονίδια και κατάσταση τελευταίας εκτέλεσης με τον editor επιφάνειας εργασίας.

Πατήστε ένα node για να το επιλέξετε. Εάν διαθέτει καταγεγραμμένο αποτέλεσμα εκτέλεσης, ανοίγει η λεπτομέρεια πλήρους οθόνης του με καρτέλες input, output και error. Η κάτω πλοήγηση για κινητά παρέχει **Nodes**, **Properties**, **Run** και **More**· η κεφαλίδα διατηρεί τις ενέργειες αποθήκευσης, ιστορικού, αναζήτησης, ρυθμίσεων και κοινοποίησης. Η επιφάνεια εργασίας συνεχίζει να χρησιμοποιεί τον ελεύθερο καμβά Vue Flow και τα πλαϊνά πάνελ.

Χρησιμοποιήστε το **Add node** στην καρτέλα Nodes για κινητά για αναζήτηση στη βιβλιοθήκη node. Ένας κανονικός node ανοίγει αμέσως ένα φύλλο σύνδεσης μετά την προσθήκη του: επιλέξτε έναν node-άγκυρα και τοποθετήστε τον **After**, **Before** ή ως **Parallel** κλάδο. Στη λειτουργία επεξεργασίας, πατήστε έναν υπάρχοντα κανονικό node για να ανοίξετε το ίδιο φύλλο με την τρέχουσα σύνδεσή του επιλεγμένη. Οι nodes Trigger παραμένουν ανεξάρτητοι, καθώς δεν δέχονται κανονικό input. Το στοιχείο ελέγχου επεξεργασίας εκθέτει επίσης μια ενέργεια αφαίρεσης για τον επιλεγμένο node. Οι λεπτομέρειες εκτέλεσης περιλαμβάνουν βέλη προηγούμενου και επόμενου όταν είναι διαθέσιμα τα αποτελέσματα γειτονικών node. Ο AI Assistant ανοίγει πάνω από το δέντρο για κινητά ως φύλλο στο κάτω μέρος, χωρίς να αλλάζει την ενεργή καρτέλα του editor.

## Σχετικά

- [Node Types](./node-types.md) – Όλοι οι τύποι node και οι περιγραφές τους
- [Canvas Features](./canvas-features.md) – Λειτουργίες editor (data pin, αρχεία καταγραφής εκτέλεσης, ενεργοποίηση/απενεργοποίηση, εξαγωγή σε sub-workflow)
- [Download & Import](./download-import.md) – Εξαγωγή και εισαγωγή workflows ως JSON
- [Agent Node](../nodes/agent-node.md) – Δομή `data` του node Agent
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` και API γράφου μνήμης
- [Expression DSL](./expression-dsl.md) – Σύνταξη για `userMessage`, `condition`, `$vars`, `$global` κ.λπ.
- [Parallel Execution](./parallel-execution.md) – Πώς εκτελούνται οι nodes παράλληλα
- [Triggers](./triggers.md) – Nodes έναρξης και σημεία εισόδου
- [Workflows Tab](../tabs/workflows-tab.md) – Δημιουργία και διαχείριση workflows
