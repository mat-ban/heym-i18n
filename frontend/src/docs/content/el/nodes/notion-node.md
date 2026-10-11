# Notion

Ο **node** **Notion** διαχειρίζεται βάσεις δεδομένων, πηγές δεδομένων, σελίδες και blocks μέσω του Notion API.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Διαπιστευτήριο | Internal integration token ή Notion OAuth |
| Έκδοση API | `2026-03-11` |

Οι συλλογές τύπου βάσης δεδομένων του Notion χρησιμοποιούν **data source IDs** στις τρέχουσες εκδόσεις του API. Κοινοποιήστε κάθε σελίδα
ή πηγή δεδομένων που χρειάζεται το workflow με το integration πριν από την εκτέλεση του node.
Τα πεδία πόρων δέχονται είτε ένα ακατέργαστο Notion ID είτε ένα πλήρες Notion URL. Τα URLs κανονικοποιούνται στο
ενσωματωμένο resource ID τους πριν από το αίτημα API.

## Λειτουργίες

| Λειτουργία | Απαιτούμενα πεδία | Κύρια έξοδος |
|-----------|-----------------|-------------|
| Search | Προαιρετικό query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID ή Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, ένα από Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Database request με `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, μη κενό database request | `.database`, `.id`, `.url` |
| Create Data Source | Data source request με `parent` και μη κενό `properties` | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, μη κενό data source request | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block ή Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, block update object | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block ή Page ID, Children | `.results`, `.count` |

Όλες οι λειτουργίες επιστρέφουν επίσης `.success` και `.operation`.

## Πεδία JSON

Τα πεδία Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon και Cover δέχονται
Notion API JSON. Οι εκφράσεις εντός συμβολοσειρών JSON επιλύονται πριν από το αίτημα. Ένα πεδίο μπορεί επίσης
να είναι μία μεμονωμένη έκφραση που επιλύεται απευθείας στο απαιτούμενο αντικείμενο ή πίνακα, όπως
`$input.database`, `$input.properties` ή `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Για περιεχόμενο σελίδας ή block, το Children είναι ένας πίνακας από Notion block objects:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## Βάσεις δεδομένων και πηγές δεδομένων

Στο τρέχον Notion API, μια **database** είναι ένα container και μια **data source** περιέχει το schema
των ιδιοτήτων και τις ερωτήσιμες γραμμές. Το Retrieve Database επιστρέφει τη λίστα `data_sources` της βάσης δεδομένων· χρησιμοποιήστε ένα
από αυτά τα IDs με το Retrieve Data Source ή το Query Data Source.

Το Create Database δέχεται το πλήρες request object από το endpoint Create a database του Notion. Πρέπει
να περιέχει `parent` και μπορεί να περιέχει `title`, `description`, `is_inline`,
`initial_data_source`, `icon` και `cover`. Για παράδειγμα:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Το Update Database δέχεται το request object του endpoint update, συμπεριλαμβανομένων των `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` και `is_locked`. Τα πεδία Database ID δέχονται
ένα ακατέργαστο ID, πλήρες Notion URL ή έκφραση.

Χρησιμοποιήστε το **Retrieve Data Source** για να ανακτήσετε το schema `properties` της πηγής δεδομένων πριν από τη δημιουργία
ενός αντικειμένου properties για το Create Page. Το **Create Data Source** απαιτεί ένα parent database object και ένα
μη κενό schema `properties`. Το **Update Data Source** δέχεται ένα μη κενό request object που υποστηρίζεται
από το αντίστοιχο endpoint του Notion.

Για παράδειγμα, δημιουργήστε μια πηγή δεδομένων μέσα σε μια υπάρχουσα βάση δεδομένων:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Οι επιλογείς Data Source και Parent Page υποστηρίζουν αναζήτηση από την πλευρά του server με σύντομο debounce και
pagination βασισμένο σε cursor μέσω του **Load more**. Χρησιμοποιήστε το **Refresh** αφού κοινοποιήσετε έναν νέο πόρο στο Notion.
Μεταβείτε στο **Use expression** για να εισαγάγετε μια έκφραση, ακατέργαστο ID ή URL.

Τα φίλτρα αναζήτησης από παλαιότερα tutorials που χρησιμοποιούν
`{"property":"object","value":"database"}` μεταφράζονται στην τρέχουσα τιμή `data_source`.
Τα νέα workflows θα πρέπει να χρησιμοποιούν απευθείας `data_source` ή `page`.

Το Append Blocks υποστηρίζει θέσεις **Start**, **End** και **After Block**. Τα Create Page και Append
Blocks χωρίζουν αυτόματα περισσότερα από 100 top-level children σε διαδοχικά αιτήματα για να ικανοποιήσουν
το όριο του Notion ανά αίτημα.

Τα αιτήματα με rate limit (`429` ή `529`) επαναλαμβάνονται έως και τρεις φορές. Το Heym σέβεται το
header `Retry-After` του Notion, περιορίζει κάθε αναμονή στα 10 δευτερόλεπτα και προσθέτει τυχαίο jitter. Τα αιτήματα του Notion
μοιράζονται ένα process-wide HTTP connection pool μεταξύ σελίδων και workflow nodes.
## Όρια του Notion API

- Μία μεμονωμένη τιμή rich-text `text.content` μπορεί να περιέχει έως 2.000 χαρακτήρες. Διαχωρίστε
  μεγαλύτερα κείμενα σε πολλαπλά αντικείμενα rich-text.
- Το Notion περιορίζει τα θυγατρικά blocks ανώτατου επιπέδου σε 100 ανά αίτημα. Το Heym ομαδοποιεί
  μεγαλύτερους πίνακες Children, αλλά κάθε μεμονωμένο block πρέπει να ικανοποιεί τα όρια του
  payload του Notion.
- Το API δέχεται έως δύο επίπεδα ένθετων θυγατρικών blocks σε ένα αίτημα. Δημιουργήστε βαθύτερες
  δομές με επακόλουθες λειτουργίες Append Blocks.
- Τα payload των αιτημάτων περιορίζονται σε 1.000 στοιχεία block και 500 KB συνολικά.

## Σελιδοποίηση

Τα Search, Query Data Source και Get Block Children δέχονται μέγεθος σελίδας από 1 έως 100 και
προαιρετικό start cursor. Ορίστε το μέγεθος σελίδας σε `0` για αυτόματη ακολούθηση των cursors και
συγχώνευση όλων των αποτελεσμάτων, έως το όριο ασφαλείας των 10.000 αποτελεσμάτων του node.

## Ρύθμιση διαπιστευτηρίων

Επιλέξτε μία από τις δύο ρυθμίσεις στο παράθυρο διαλόγου διαπιστευτηρίων (**Internal token** ή
**OAuth**):

- **Internal token:** Δημιουργήστε ένα internal integration, αντιγράψτε το token του στο Heym και
  έπειτα κοινοποιήστε κάθε απαιτούμενη σελίδα ή data source στο integration. Χρησιμοποιήστε το
  **Test Connection** για να επαληθεύσετε την πρόσβαση.
- **OAuth:** Δημιουργήστε ένα public Notion integration και καταχωρίστε το
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` στο Notion. Στο παράθυρο διαλόγου
  διαπιστευτηρίων του Heym, επιλέξτε **OAuth**, εισαγάγετε το Client ID και το Client Secret του
  integration και έπειτα κάντε κλικ στο **Connect** για να εξουσιοδοτήσετε έναν χώρο εργασίας. Το
  secret αποθηκεύεται κρυπτογραφημένο μαζί με το διαπιστευτήριο και δεν τοποθετείται στο OAuth
  state ή στη διαμόρφωση περιβάλλοντος. Μετά την εξουσιοδότηση, το διαπιστευτήριο εμφανίζει το
  όνομα του συνδεδεμένου χώρου εργασίας (`connected (Workspace Name)`). Τα εκκρεμή διαπιστευτήρια
  OAuth εμφανίζουν `Not connected`.

Η κενή τιμή στο πεδίο internal token κατά την επεξεργασία διατηρεί το αποθηκευμένο token.

Για προσαρμοσμένα αιτήματα [HTTP](../nodes/http-node.md), το
`$credentials.YourNotionCredential` επιλύεται στο ίδιο bearer token που χρησιμοποιεί το node του
Notion (internal token ή OAuth access token).

## Σημειώσεις έκδοσης API

Το Heym καθηλώνει τα αιτήματα προς το Notion στην έκδοση API `2026-03-11`. Αυτή η έκδοση
χρησιμοποιεί:

- γονείς `data_source_id` και endpoints `/data_sources` αντί για τις παλαιότερες διαδρομές
  database-query
- `in_trash` αντί για `archived` για τις λειτουργίες trash/restore σελίδων
- αντικείμενα `position` (`start`, `end`, `after_block`) για το Append Block Children

Κατά τη μετάβαση παλαιότερων παραδειγμάτων αυτοματισμού του Notion:

- Αντικαταστήστε τις αναφορές γονέα/query βάσης δεδομένων με IDs data source από το **Retrieve
  Database** ή τον επιλογέα data-source του editor
- Αντικαταστήστε το `archived: true` με `in_trash: true`
- Αντικαταστήστε τις παραμέτρους append `after` με το πεδίο **Append Position** του node

Τα φίλτρα αναζήτησης που εξακολουθούν να χρησιμοποιούν την τιμή αντικειμένου `database`
κανονικοποιούνται αυτόματα σε `data_source`.

## Σχετικά

- [Διαπιστευτήρια](../reference/credentials.md)
- [Ενσωματώσεις τρίτων](../reference/integrations.md)
- [Τύποι node](../reference/node-types.md)
