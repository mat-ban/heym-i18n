# Creazione di Plugin

I plugin di Heym sono pacchetti zip attendibili installati da un operatore. Un pacchetto può aggiungere uno o più nodi azione o trigger personalizzati senza modificare l'applicazione principale.

## Struttura del Pacchetto

Un plugin zip deve contenere `plugin.json` nella radice del pacchetto e il file di entry Python indicato da `entry` (il valore predefinito è `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` è opzionale e viene servito come pagina di documentazione del plugin. Inserire un file `icon.svg` nella radice del pacchetto per l'icona predefinita del nodo, oppure impostare un percorso `icon` specifico per il nodo in `plugin.json`.

## Manifest

Utilizzare un `plugin.json` multi-nodo quando un singolo pacchetto espone più nodi:

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

Sono accettati anche i manifest legacy a nodo singolo: omettere `nodes` e fornire `kind`, `fields`, `dslHint` e `docSlug` a livello superiore.

## Campi del Manifest

| Campo | Note |
|-------|-------|
| `id` | Id del pacchetto in minuscolo composto da lettere, numeri e trattini. |
| `name` | Nome del pacchetto leggibile dall'utente. |
| `version` | Versione del pacchetto utilizzata per la visualizzazione e la cache dell'handler. |
| `description` | Breve descrizione mostrata nell'interfaccia e nel contesto dell'assistente. |
| `entry` | Percorso del file handler Python all'interno dello zip; il valore predefinito è `handler.py`. |
| `dependencies` | Requisiti pip opzionali installati con `uv pip install`. |
| `nodes` | Nodi personalizzati esposti da questo pacchetto. |

Ogni nodo necessita di una `key` univoca, un `name` e un `kind` pari a `action` o `trigger`. Se `function` viene omesso, le azioni richiamano `run` e i trigger richiamano `trigger`.

I tipi di campo supportati sono `string`, `number`, `boolean` e `select`. I campi select utilizzano un array `options` di oggetti `{ "label": "...", "value": "..." }`. Impostare `required` per i campi obbligatori e `secret` per gli input mascherati. Il manifest accetta inoltre i metadati `default`, `dynamic` ed `expression` per i campi; questi vengono memorizzati con il manifest, ma i nodi dei plugin attualmente leggono la configurazione salvata del nodo a runtime anziché popolare automaticamente la configurazione mancante a partire dai valori predefiniti.

I campi stringa non segreti vengono renderizzati con l'interfaccia di input delle espressioni. A runtime, qualsiasi valore di configurazione stringa salvato che inizia con `$` viene risolto prima che l'handler venga richiamato.

## Funzioni Handler

Gli handler delle azioni ricevono gli input del workflow, la configurazione risolta e un piccolo contesto:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Gli handler dei trigger ricevono la configurazione risolta e il contesto:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Restituire un dizionario per esporre campi di output denominati. Se un handler restituisce un altro tipo, Heym lo racchiude come `{ "value": result }`.

## Installazione e Runtime

I plugin sono disabilitati per impostazione predefinita. Gli operatori li abilitano con `HEYM_PLUGINS_ENABLED=true` e limitano la gestione a `HEYM_PLUGIN_ADMIN_EMAILS`. I file dei plugin installati risiedono in `HEYM_PLUGINS_DIR` e dovrebbero essere montati in modo persistente nelle distribuzioni containerizzate.

Il codice dei plugin è Python attendibile, installato dall'operatore, che viene eseguito in-process con il backend. Può accedere alla rete e alle librerie installate, pertanto installare esclusivamente pacchetti che si è disposti a eseguire con lo stesso livello di attendibilità di Heym stesso.