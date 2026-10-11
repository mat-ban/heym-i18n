# RAG / Vector Store

Ο κόμβος **RAG / Vector Store** εισάγει, κάνει upsert, διαγράφει και αναζητά έγγραφα σε έναν διανυσματικό χώρο αποθήκευσης για Retrieval Augmented Generation (RAG). Χρησιμοποιήστε τον για να εμπλουτίσετε το context του LLM με σχετικά έγγραφα και για να διατηρείτε αυτό το context συγχρονισμένο με το σύστημα από το οποίο προέρχονται τα έγγραφα.

Ο κόμβος διαθέτει ένα αναπτυσσόμενο μενού **Database** που επιλέγει το backend:

- **Qdrant** – αποθηκεύει διανύσματα σε εξωτερικό διακομιστή Qdrant (απαιτεί διαπιστευτήριο *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – αποθηκεύει διανύσματα μέσα στην ίδια τη βάση δεδομένων Postgres του Heym, χωρίς εξωτερική υπηρεσία (απαιτεί διαπιστευτήριο *RAG: Psql + OpenAI*).

Η προεπιλογή είναι **Qdrant** για λόγους συμβατότητας προς τα πίσω. Η αλλαγή του Database φιλτράρει τη λίστα **Vector Store** ώστε να εμφανίζονται οι χώροι αποθήκευσης που υποστηρίζονται από αυτή τη βάση δεδομένων. Και τα δύο backends υποστηρίζουν τις ίδιες λειτουργίες, φιλτράρισμα μεταδεδομένων και επανακατάταξη (reranking) με Cohere.

Σε οποιοδήποτε από τα δύο backends μπορεί επίσης να γίνει πρόσβαση μέσω ενός διαπιστευτηρίου *RAG: Custom Embeddings*, το οποίο
αντικαθιστά το OpenAI με οποιοδήποτε συμβατό με OpenAI endpoint embeddings και ορίζει τον δικό του διανυσματικό
χώρο αποθήκευσης. Ένας χώρος αποθήκευσης που δημιουργήθηκε από ένα τέτοιο διαπιστευτήριο εμφανίζεται κάτω από όποιο Database
στοχεύει. Ανατρέξτε στο [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend διανυσματικού χώρου αποθήκευσης (προεπιλογή: `"qdrant"`) |
| `vectorStoreId` | UUID | Διανυσματικός χώρος αποθήκευσης από την καρτέλα [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Τύπος λειτουργίας (επίσης `operation`) |
| `documentContent` | expression | Κείμενο εγγράφου προς αποθήκευση (insert, upsert) |
| `documentMetadata` | JSON string | Μεταδεδομένα για τα αποθηκευμένα έγγραφα (insert, upsert)· οι τιμές υποστηρίζουν expressions |
| `documentIdField` | string | Πεδίο του payload που περιέχει το μοναδικό id (upsert, delete; προεπιλογή `doc_id`) |
| `documentId` | expression | Τιμή του μοναδικού id (upsert, delete) |
| `queryText` | expression | Ερώτημα αναζήτησης (μόνο για search) |
| `searchLimit` | number | Μέγιστος αριθμός αποτελεσμάτων (προεπιλογή: 5) |
| `metadataFilters` | JSON string | Φίλτρα μεταδεδομένων για αναζήτηση (οι τιμές υποστηρίζουν expressions) |
| `enableReranker` | boolean | Χρήση Cohere για επανακατάταξη των αποτελεσμάτων αναζήτησης |
| `rerankerCredentialId` | UUID | Διαπιστευτήριο Cohere για επανακατάταξη |
| `rerankerTopN` | number | Αριθμός κορυφαίων αποτελεσμάτων που διατηρούνται μετά την επανακατάταξη |

## Λειτουργίες

### Insert

Προσθέτει έγγραφα στον διανυσματικό χώρο αποθήκευσης.

| Πεδίο | Απαιτείται | Περιγραφή |
|-------|----------|-------------|
| `documentContent` | ναι | Κείμενο προς ενσωμάτωση (embedding) και αποθήκευση |
| `documentMetadata` | όχι | Αντικείμενο JSON, π.χ. `{"source": "user", "category": "general"}` |

**Έξοδος:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Εκφράσεις μεταδεδομένων

Οι τιμές μεταδεδομένων δέχονται expressions, ώστε ένα έγγραφο να μπορεί να αποθηκευτεί με context από την εκτέλεση:

```json
{ "url": "$start.url", "category": "faq" }
```

Οι εκφράσεις επιλύονται αφού γίνει η ανάλυση (parsing) του JSON, όχι με υποκατάσταση κειμένου μέσα σε αυτό, οπότε μια
τιμή που περιέχει εισαγωγικό ή αλλαγή γραμμής δεν μπορεί να διασπάσει το αντικείμενο. Μια τιμή που είναι μία
ολόκληρη έκφραση διατηρεί τον επιλυμένο τύπο της — το `{"count": "$start.count"}` αποθηκεύει έναν αριθμό, όχι
`"7"` — κάτι που έχει σημασία επειδή τα `metadataFilters` της αναζήτησης ταιριάζουν με βάση τον ακριβή τύπο. Μικτό κείμενο όπως
`"page $start.count"` επιλύεται σε συμβολοσειρά, ενώ και τα ένθετα αντικείμενα και οι πίνακες διατρέχονται επίσης.

Το ίδιο ισχύει για το `upsert` και για τα `metadataFilters` της αναζήτησης: γίνεται πρώτα ανάλυση (parsing) και οι
τιμές τους επιλύονται μετά, με τους ίδιους κανόνες. Έτσι, ένα φίλτρο γραμμένο ως `{"count": "$start.count"}`
ταιριάζει με τον αριθμό που αποθήκευσε ένα insert, αντί με τη συμβολοσειρά `"7"`.

### Ποιο workflow αποθήκευσε ένα έγγραφο

Ένα έγγραφο που αποθηκεύτηκε χωρίς δικό του `source` σημαίνεται με το workflow που το αποθήκευσε,
ως `source: "workflow:<workflow name>"`. Η καρτέλα [Vectorstores](../tabs/vectorstores-tab.md)
ομαδοποιεί αυτά κάτω από το **Added workflow: _name_**, ώστε τα περιεχόμενα ενός χώρου αποθήκευσης να δηλώνουν από πού
προέρχεται κάθε έγγραφο, και τα έγγραφα ενός workflow να μπορούν να διαγραφούν ως ομάδα. Ο ορισμός του `source` από εσάς
στο `documentMetadata` υπερισχύει πάντα της σήμανσης.

### Upsert

Εισάγει ένα έγγραφο ή αντικαθιστά αυτό που είναι ήδη αποθηκευμένο κάτω από το ίδιο μοναδικό id.

Το id είναι ένα πεδίο **μέσα στο payload**, όχι το εσωτερικό point id του χώρου αποθήκευσης, ώστε ένα έγγραφο
να διατηρεί το αναγνωριστικό που χρησιμοποιεί ήδη το δικό σας σύστημα — ένα id εγγραφής CRM, ένα SKU, ένα slug σελίδας.
Το `documentIdField` ονομάζει αυτό το πεδίο και το `documentId` φέρει την τιμή του.

| Πεδίο | Απαιτείται | Περιγραφή |
|-------|----------|-------------|
| `documentId` | ναι | Μοναδικό id του εγγράφου (υποστηρίζει expressions) |
| `documentContent` | ναι | Κείμενο προς ενσωμάτωση (embedding) και αποθήκευση |
| `documentIdField` | όχι | Πεδίο του payload στο οποίο βρίσκεται το id (προεπιλογή `doc_id`) |
| `documentMetadata` | όχι | Αντικείμενο JSON, π.χ. `{"source": "crm", "url": "$start.url"}` (οι τιμές υποστηρίζουν expressions) |

Κάθε point του οποίου το πεδίο id ταιριάζει αφαιρείται πρώτα, ώστε ένα έγγραφο που ήταν προηγουμένως
αποθηκευμένο ως πολλά chunks να αντικαθίσταται ως σύνολο αντί να διπλασιάζεται. Το πεδίο id
γράφεται στο payload για εσάς, και το point id παραμένει σταθερό μεταξύ upserts του ίδιου
εγγράφου.

**Έξοδος:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
αν αντικαταστάθηκε μια υπάρχουσα έκδοση), `$nodeLabel.replaced_count`
### Διαγραφή

Αφαιρέστε ένα έγγραφο με το ίδιο μοναδικό αναγνωριστικό.

| Πεδίο | Απαιτείται | Περιγραφή |
|-------|----------|-------------|
| `documentId` | ναι | Μοναδικό αναγνωριστικό του εγγράφου (υποστηρίζει εκφράσεις) |
| `documentIdField` | όχι | Πεδίο του Payload στο οποίο βρίσκεται το αναγνωριστικό (προεπιλογή `doc_id`) |

**Έξοδος:** `$nodeLabel.deleted` – `true` όταν τουλάχιστον ένα σημείο αντιστοιχίστηκε, `false` όταν το αναγνωριστικό
δεν υπήρχε στον χώρο αποθήκευσης. Το `$nodeLabel.deleted_count` περιέχει πόσα σημεία αφαιρέθηκαν.

Η διαγραφή ενός αναγνωριστικού που δεν υπάρχει δεν αποτελεί σφάλμα: ο node ολοκληρώνεται επιτυχώς με `deleted: false`, επομένως
ένας κλάδος καθαρισμού δεν χρειάζεται προστατευτικό έλεγχο μπροστά του.

### Αναζήτηση

Σημασιολογική αναζήτηση για παρόμοια έγγραφα.

| Πεδίο | Απαιτείται | Περιγραφή |
|-------|----------|-------------|
| `queryText` | ναι | Ερώτημα αναζήτησης |
| `searchLimit` | όχι | Μέγιστος αριθμός αποτελεσμάτων (προεπιλογή: 5) |
| `metadataFilters` | όχι | Φιλτράρισμα κατά metadata (αντικείμενο JSON ακριβούς αντιστοίχισης, οι τιμές υποστηρίζουν εκφράσεις) |
| `enableReranker` | όχι | Ενεργοποίηση επανακατάταξης Cohere για καλύτερη συνάφεια |
| `rerankerCredentialId` | όταν γίνεται επανακατάταξη | Διαπιστευτήριο Cohere |
| `rerankerTopN` | όχι | Τελικός αριθμός αποτελεσμάτων μετά την επανακατάταξη |

**Έξοδος:** `$nodeLabel.results` – πίνακας από `{ id, text, score, metadata }`

Όταν είναι ενεργοποιημένη η επανακατάταξη:

- Το `$nodeLabel.reranked` γίνεται `true`
- Κάθε αποτέλεσμα περιλαμβάνει επίσης `relevance_score`
- Το `score` παραμένει η αρχική βαθμολογία διανυσματικής ομοιότητας
- Το `relevance_score` είναι η βαθμολογία του επανακατατάκτη Cohere

## Πρόσβαση στα Αποτελέσματα

- `$ragNode.results.first().text` – περιεχόμενο κορυφαίου αποτελέσματος
- `$ragNode.results.first().score` – βαθμολογία ομοιότητας (0–1)
- `$ragNode.results.first().metadata.source` – metadata κορυφαίου αποτελέσματος
- `$ragNode.results.map("item.text").join("\n\n")` – συνένωση για context LLM
- `$ragNode.reranked` – αν εφαρμόστηκε επανακατάταξη
- `$ragNode.count` – αριθμός επιστρεφόμενων αποτελεσμάτων
- `$ragNode.replaced` – αν ένα upsert αντικατέστησε υπάρχον έγγραφο
- `$ragNode.deleted` – αν μια διαγραφή αφαίρεσε κάτι

## Παράδειγμα – Αναζήτηση

```json
{
  "type": "rag",
  "data": {
    "label": "searchDocs",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "metadataFilters": "{\"category\": \"faq\"}",
    "enableReranker": true,
    "rerankerCredentialId": "cohere-credential-uuid",
    "rerankerTopN": 5
  }
}
```

## Παράδειγμα – Εισαγωγή

```json
{
  "type": "rag",
  "data": {
    "label": "insertDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "insert",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"user_input\"}"
  }
}
```

## Παράδειγμα – Upsert

```json
{
  "type": "rag",
  "data": {
    "label": "syncDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "upsert",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"crm\"}"
  }
}
```

## Παράδειγμα – Διαγραφή

```json
{
  "type": "rag",
  "data": {
    "label": "removeDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "delete",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id"
  }
}
```

## Σχετικά

- [Why Heym](../getting-started/why-heym.md) – Ενσωματωμένο RAG ως μέρος του χρόνου εκτέλεσης του agent
- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
- [Vectorstores Tab](../tabs/vectorstores-tab.md) – Δημιουργία και διαχείριση διανυσματικών χώρων αποθήκευσης
- [Third-Party Integrations](../reference/integrations.md#qdrant) – Ρύθμιση διαπιστευτηρίων Qdrant και Postgres (pgvector)
- [Agent Node](./agent-node.md) – Χρήση αποτελεσμάτων RAG ως context agent
- [LLM Node](./llm-node.md) – Τροφοδότηση αποτελεσμάτων RAG στο system prompt του LLM
