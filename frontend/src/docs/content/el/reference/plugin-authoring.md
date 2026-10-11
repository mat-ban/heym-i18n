# Συγγραφή Plugin

Τα plugins του Heym είναι έμπιστα πακέτα zip που εγκαθίστανται από έναν διαχειριστή. Ένα πακέτο μπορεί να προσθέσει έναν ή περισσότερους προσαρμοσμένους κόμβους action ή trigger χωρίς να τροποποιήσει την κύρια εφαρμογή.

## Δομή Πακέτου

Ένα plugin zip πρέπει να περιέχει το `plugin.json` στη ρίζα του πακέτου και το αρχείο Python εισόδου που καθορίζεται από το `entry` (προεπιλογή: `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

Το `README.md` είναι προαιρετικό και σερβίρεται ως η σελίδα τεκμηρίωσης του plugin. Τοποθετήστε ένα `icon.svg` στη ρίζα του πακέτου για το προεπιλεγμένο εικονίδιο κόμβου ή ορίστε μια διαδρομή `icon` ειδικά για τον κόμβο στο `plugin.json`.

## Manifest

Χρησιμοποιήστε ένα multi-node `plugin.json` όταν ένα πακέτο εκθέτει πολλούς κόμβους:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

Γίνονται επίσης δεκτά παλαιότερα manifests με έναν μόνο κόμβο: παραλείψτε το `nodes` και παρέχετε `kind`, `fields`, `dslHint` και `docSlug` στο ανώτατο επίπεδο.

## Πεδία Manifest

| Πεδίο | Σημειώσεις |
|-------|-------|
| `id` | Αναγνωριστικό πακέτου με πεζά γράμματα, αριθμούς και παύλες. |
| `name` | Όνομα πακέτου αναγνώσιμο από τον άνθρωπο. |
| `version` | Έκδοση πακέτου που χρησιμοποιείται για εμφάνιση και caching του handler. |
| `description` | Σύντομη περιγραφή που εμφανίζεται στο UI και στο context του assistant. |
| `entry` | Διαδρομή αρχείου Python handler μέσα στο zip· προεπιλογή: `handler.py`. |
| `dependencies` | Προαιρετικές απαιτήσεις pip που εγκαθίστανται με `uv pip install`. |
| `nodes` | Προσαρμοσμένοι κόμβοι που εκθέτει αυτό το πακέτο. |

Κάθε κόμβος χρειάζεται ένα μοναδικό `key`, ένα `name` και ένα `kind` είτε `action` είτε `trigger`. Αν το `function` παραλειφθεί, τα actions καλούν το `run` και τα triggers καλούν το `trigger`.

Οι υποστηριζόμενοι τύποι πεδίων είναι `string`, `number`, `boolean` και `select`. Τα πεδία select χρησιμοποιούν έναν πίνακα `options` από αντικείμενα `{ "label": "...", "value": "..." }`. Ορίστε `required` για υποχρεωτικά πεδία και `secret` για κρυφά πεδία εισόδου. Το manifest δέχεται επίσης μεταδεδομένα `default`, `dynamic` και `expression` για πεδία· αυτά αποθηκεύονται μαζί με το manifest, αλλά οι κόμβοι plugin προς το παρόν διαβάζουν την αποθηκευμένη διαμόρφωση του κόμβου κατά τον χρόνο εκτέλεσης αντί να συμπληρώνουν αυτόματα τη διαμόρφωση που λείπει από τις προεπιλογές.

Τα μη κρυφά πεδία string αποδίδονται με το UI εισόδου έκφρασης. Κατά τον χρόνο εκτέλεσης, οποιαδήποτε αποθηκευμένη τιμή διαμόρφωσης string που ξεκινά με `$` επιλύεται πριν κληθεί ο handler.

## Συναρτήσεις Handler

Οι handlers action λαμβάνουν τα inputs του workflow, τη διαμορφωμένη διαμόρφωση και ένα μικρό context:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Οι handlers trigger λαμβάνουν τη διαμορφωμένη διαμόρφωση και το context:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Επιστρέψτε ένα λεξικό για να εκθέσετε ονομασμένα πεδία εξόδου. Αν ένας handler επιστρέψει άλλον τύπο, το Heym τον τυλίγει ως `{ "value": result }`.

## Εγκατάσταση και Χρόνος Εκτέλεσης

Τα plugins είναι απενεργοποιημένα από προεπιλογή. Οι διαχειριστές τα ενεργοποιούν με `HEYM_PLUGINS_ENABLED=true` και περιορίζουν τη διαχείριση στο `HEYM_PLUGIN_ADMIN_EMAILS`. Τα εγκατεστημένα αρχεία plugin βρίσκονται κάτω από το `HEYM_PLUGINS_DIR` και θα πρέπει να προσαρτώνται μόνιμα σε αναπτύξεις container.

Ο κώδικας plugin είναι έμπιστος, εγκατεστημένος από τον διαχειριστή Python που εκτελείται εντός της διεργασίας με το backend. Μπορεί να έχει πρόσβαση στο δίκτυο και σε εγκατεστημένες βιβλιοθήκες, επομένως εγκαταστήστε μόνο πακέτα που είστε διατεθειμένοι να εκτελέσετε με το ίδιο επίπεδο εμπιστοσύνης όπως το ίδιο το Heym.
