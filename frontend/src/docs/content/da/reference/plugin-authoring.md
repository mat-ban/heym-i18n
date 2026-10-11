# Plugin-udvikling

Heym-plugins er verificerede zip-pakker, der installeres af en operatør. En pakke kan tilføje en eller flere brugerdefinerede action- eller trigger-noder uden at ændre kerneapplikationen.

## Pakkelayout

En plugin-zip skal indeholde `plugin.json` i pakkens rod og en Python-entry-fil navngivet efter `entry` (standard er `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` er valgfri og fungerer som plugin'ets dokumentationsside. For at angive en standard node-ikon placeres en `icon.svg` i pakkens rod, eller der kan angives en node-specifik `icon`-sti i `plugin.json`.

## Manifest

Ved brug af et multi-node `plugin.json`, når en pakke eksponerer flere noder:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Interne CRM-handlinger og -triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Opret kontakt",
      "kind": "action",
      "function": "create_contact",
      "description": "Opret en CRM-kontakt",
      "icon": "assets/publisher.svg",
      "dslHint": "Anvend denne, når workflowet skal oprette en Acme CRM-kontakt.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send velkomstemail",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Kontakt oprettet",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start ved modtagelse af en kontaktbegivenhed"
    }
  ]
}
```

Ældre single-node-manifester accepteres også: udelad `nodes` og angiv `kind`, `fields`, `dslHint` og `docSlug` på topplan.

## Manifest-felter

| Felt | Noter |
|-------|-------|
| `id` | Pakke-id i lowercase med bogstaver, tal og bindestreger. |
| `name` | Læsevenligt pakkenavn. |
| `version` | Pakkeversion brugt til visning og handler-caching. |
| `description` | Kort beskrivelse vist i brugergrænsefladen og assistentkontekst. |
| `entry` | Sti til Python-handlerfil i zip'en; standard er `handler.py`. |
| `dependencies` | Valgfrie pip-krav installeret med `uv pip install`. |
| `nodes` | Brugerdefinerede noder eksponeret af denne pakke. |

Hver node kræver en unik `key`, et `name` og en `kind` på enten `action` eller `trigger`. Hvis `function` udelades, kalder actions `run` og triggers kalder `trigger`.

Understøttede felttyper er `string`, `number`, `boolean` og `select`. Select-felter bruger en `options`-array med `{ "label": "...", "value": "..." }`-objekter. Angiv `required` for obligatoriske felter og `secret` for maskerede inputs. Manifestet accepterer også `default`, `dynamic` og `expression`-metadata for felter; disse gemmes med manifestet, men plugin-noder læser i øjeblikket den gemte node-konfiguration ved kørsel i stedet for automatisk at udfylde manglende konfiguration fra standardværdier.

Ikke-hemmelige strengfelter renderes med expression-input-brugergrænsefladen. Ved kørsel opløses enhver gemt strengkonfigurationsværdi, der starter med `$`, før handleren kaldes.

## Handler-funktioner

Action-handlere modtager workflow-inputs, opløst konfiguration og en lille kontekst:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Trigger-handlere modtager opløst konfiguration og kontekst:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Returner en dictionary for at eksponere navngivne outputfelter. Hvis en handler returnerer en anden type, indkapsler Heym den som `{ "value": result }`.

## Installation og kørsel

Plugins er deaktiveret som standard. Operatorer aktiverer dem med `HEYM_PLUGINS_ENABLED=true` og begrænser administration til `HEYM_PLUGIN_ADMIN_EMAILS`. Installerede plugin-filer findes under `HEYM_PLUGINS_DIR` og bør monteres persistent i container-installationer.

Plugin-kode er betroet, operator-installeret Python, der kører in-proces med backend'en. Den kan tilgå netværket og installerede biblioteker, så installer kun pakker, der er lige så betroede som Heym selv.
