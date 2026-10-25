# Ροή SSE

Τα Workflows μπορούν να μεταδίδουν συμβάντα εκτέλεσης σε πραγματικό χρόνο με Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Αυτό το endpoint χρησιμοποιεί τους ίδιους κανόνες authentication σε επίπεδο workflow, rate limiting και response caching με το τυπικό execute endpoint που τεκμηριώνεται στο [Webhooks](./webhooks.md).

## Ενεργοποίηση SSE στον Διάλογο cURL

Ανοίξτε τον διάλογο **Run with cURL** στον editor και ενεργοποιήστε το **SSE Streaming**.

Όταν είναι ενεργοποιημένο, το Heym:

- αλλάζει την εντολή που δημιουργείται από `/execute` σε `/execute/stream`
- προσθέτει `--no-buffer` ώστε τα streamed συμβάντα να εμφανίζονται αμέσως στην έξοδο του terminal
- προσθέτει `Accept: text/event-stream`
- σας επιτρέπει να ρυθμίσετε μηνύματα `node_start` ανά node απευθείας στον διάλογο

## Πρωτόκολλο Συμβάντων

Κάθε πλαίσιο SSE είναι JSON οριοθετημένο με νέα γραμμή και πρόθεμα `data: `.

| Τύπος συμβάντος | Πότε εκπέμπεται | Βασικά πεδία |
|------------|--------------------|------------|
| `queued` | Το workflow βρίσκεται στο [όριο ταυτοχρονισμού](./webhooks.md#concurrency-limit-and-queued-runs) του. Αποστέλλεται ξανά κάθε φορά που αλλάζει η θέση της εκτέλεσης | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Αμέσως αφού γίνει αποδεκτό το αίτημα, ή όταν ξεκινά μια εκτέλεση σε ουρά | `execution_id`, `server_now_ms` |
| `node_start` | Ακριβώς πριν ξεκινήσει την εκτέλεση ένας node | `node_id`, `node_label`, `started_at_ms`, προαιρετικό `message` |
| `node_retry` | Όταν ένας node επαναλαμβάνει | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Αφού ολοκληρωθεί ένας node | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Όταν ένας Output node επιστρέφει πρόωρα | `node_label`, `output` |
| `execution_complete` | Αφού ολοκληρωθεί το workflow | `status`, `outputs`, `execution_time_ms` |

### Εκτελέσεις σε ουρά

Όταν το workflow βρίσκεται στο όριο ταυτοχρονισμού του, το stream παραμένει ανοιχτό και αποστέλλει συμβάντα `queued` ενώ η εκτέλεση περιμένει. Μια εκτέλεση σε ουρά εκτελείται στον background worker, πιθανώς σε άλλη διεργασία, επομένως το stream της μεταφέρει το `execution_started` κατά την έναρξη της εκτέλεσης και το `execution_complete` κατά τον τερματισμό της, αλλά καθόλου ενδιάμεσα συμβάντα `node_start`, `node_complete` ή token. Το `execution_complete` της περιέχει ένα κενό `node_results`. Ανοίξτε την εκτέλεση στο [Ιστορικό εκτέλεσης](./execution-history.md) για λεπτομέρειες των κόμβων. Το κλείσιμο της σύνδεσης δεν ακυρώνει μια εκτέλεση σε ουρά. Όταν η ουρά είναι γεμάτη, το αίτημα απαντάται με `429` πριν ανοίξει το stream.

## Μηνύματα Έναρξης ανά Node

Ο διάλογος cURL αποθηκεύει τις ρυθμίσεις SSE στο ίδιο το workflow:

- Το **Send start** ελέγχει αν ένα συμβάν `node_start` περιλαμβάνει `message`
- Το **Start message** έχει προεπιλογή `[START] {nodeLabel}`
- η διαγραφή ενός προσαρμοσμένου μηνύματος επιστρέφει στο προεπιλεγμένο κείμενο
- το `node_complete` εκπέμπεται πάντα και πάντα περιλαμβάνει την έξοδο του node

Παράδειγμα αποθηκευμένης ρύθμισης:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## Παράδειγμα cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Δείγμα ροής συμβάντων:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Σημειώσεις Ασφαλείας

- Τα workflows `anonymous`, `jwt` και `header_auth` συμπεριφέρονται το ίδιο με το κανονικό webhook endpoint
- το response caching εξακολουθεί να εφαρμόζεται όταν έχει ρυθμιστεί το `cache_ttl_seconds`
- τα workflow rate limits εξακολουθούν να εφαρμόζονται όταν έχουν ρυθμιστεί τα `rate_limit_requests` και `rate_limit_window_seconds`
- το `test_run` παρακάμπτει και το cache και το rate limiting, με τον ίδιο τρόπο όπως κάνει για το `/execute`

## Σχετικά

- [Webhooks](./webhooks.md) – Τυπικό execute endpoint και διάλογος cURL
- [Parallel Execution](./parallel-execution.md) – Πώς η ροή ενσωματώνεται στον DAG scheduler του Heym
- [Canvas Features](./canvas-features.md) – Στοιχεία ελέγχου του editor, συμπεριλαμβανομένου του Run with cURL
- [Security](./security.md) – Authentication και διαχείριση μυστικών
