# Redigering av plugin

Heym-plugin är betrodda zip-paket som installeras av en operatör. Ett paket kan
lägga till en eller flera anpassade åtgärds- eller triggernoder utan att ändra kärnapplikationen.

## Paketstruktur

En plugin-zip måste innehålla `plugin.json` i paketets rot och den Python-entry-fil
som anges av `entry` (standardvärdet är `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` är valfri och visas som pluginens dokumentationssida. Placera en
`icon.svg` i paketets rot för standardnodikonen, eller ange en nodspecifik
`icon`-sökväg i `plugin.json`.

## Manifest

Använd ett manifest för flera noder i `plugin.json` när ett paket exponerar flera noder:

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

Äldre manifest för en enskild nod accepteras också: utelämna `nodes` och ange
`kind`, `fields`, `dslHint` och `docSlug` på toppnivå.

## Manifestfält

| Fält | Noteringar |
|-------|-------|
| `id` | Paket-id med gemener som använder bokstäver, siffror och bindestreck. |
| `name` | Läsbart paketnamn. |
| `version` | Paketversion som används för visning och cachelagring av hanterare. |
| `description` | Kort beskrivning som visas i användargränssnittet och assistentens kontext. |
| `entry` | Sökväg till Python-hanterarfilen i zip-filen; standardvärdet är `handler.py`. |
| `dependencies` | Valfria pip-krav som installeras med `uv pip install`. |
| `nodes` | Anpassade noder som exponeras av detta paket. |

Varje nod behöver en unik `key`, ett `name` och en `kind` som antingen är `action` eller
`trigger`. Om `function` utelämnas anropar åtgärder `run` och triggers anropar
`trigger`.

Fälttyper som stöds är `string`, `number`, `boolean` och `select`. Select-fält
använder en `options`-array med objekt av typen `{ "label": "...", "value": "..." }`.
Ange `required` för obligatoriska fält och `secret` för maskerade inmatningar. Manifestet
accepterar även metadata av typen `default`, `dynamic` och `expression` för fält; dessa
lagras med manifestet, men pluginnoder läser för närvarande den sparade nodkonfigurationen
vid körning i stället för att automatiskt fylla i saknad konfiguration från standardvärden.

Icke-hemliga strängfält renderas med uttrycksinmatningens användargränssnitt. Vid körning
löses alla sparade strängkonfigurationsvärden som börjar med `$` upp innan hanteraren
anropas.

## Hanterarfunktioner

Åtgärdshanterare tar emot workflow-indata, upplöst konfiguration och en liten kontext:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Triggerhanterare tar emot upplöst konfiguration och kontext:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Returnera en dictionary för att exponera namngivna utdatafält. Om en hanterare returnerar en annan
typ omsluter Heym den som `{ "value": result }`.

## Installation och körning

Plugin är inaktiverade som standard. Operatörer aktiverar dem med
`HEYM_PLUGINS_ENABLED=true` och begränsar hanteringen till
`HEYM_PLUGIN_ADMIN_EMAILS`. Installerade pluginfiler finns under
`HEYM_PLUGINS_DIR` och bör monteras persistent i containerdistributioner.

Plugin-kod är betrodd, operatörsinstallerad Python som körs i processen med
backend. Den kan komma åt nätverket och installerade bibliotek, så installera
endast paket som är acceptabla att köra med samma förtroendenivå som Heym självt.
