# Plugin Authoring

Heym-plugins zijn vertrouwde zip-pakketten die door een operator worden geïnstalleerd. Een pakket kan een of meer aangepaste actie- of trigger-nodes toevoegen zonder de kernapplicatie te wijzigen.

## Pakketindeling

Een plugin-zip moet `plugin.json` in de hoofdmap van het pakket bevatten en het Python-entrybestand dat door `entry` wordt genoemd (standaard `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` is optioneel en wordt aangeboden als de documentatiepagina van de plugin. Plaats een `icon.svg` in de hoofdmap van het pakket voor het standaardpictogram van de node, of stel een node-specifiek `icon`-pad in `plugin.json` in.

## Manifest

Gebruik een multi-node `plugin.json` wanneer één pakket meerdere nodes beschikbaar stelt:

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

Verouderde single-node-manifests worden ook geaccepteerd: laat `nodes` weg en geef op het hoogste niveau `kind`, `fields`, `dslHint` en `docSlug` op.

## Manifestvelden

| Veld | Opmerkingen |
|-------|-------|
| `id` | Pakket-id in kleine letters met letters, cijfers en koppeltekens. |
| `name` | Door mensen leesbare pakketnaam. |
| `version` | Pakketversie die wordt gebruikt voor weergave en handler-caching. |
| `description` | Korte beschrijving die wordt getoond in de UI en in de context van de assistent. |
| `entry` | Pad naar het Python-handlerbestand in de zip; standaard `handler.py`. |
| `dependencies` | Optionele pip-vereisten die worden geïnstalleerd met `uv pip install`. |
| `nodes` | Aangepaste nodes die door dit pakket beschikbaar worden gesteld. |

Elke node heeft een unieke `key`, een `name` en een `kind` van hetzij `action` of `trigger`. Als `function` wordt weggelaten, roepen acties `run` aan en roepen triggers `trigger` aan.

Ondersteunde veldtypen zijn `string`, `number`, `boolean` en `select`. Select-velden gebruiken een `options`-array van `{ "label": "...", "value": "..." }`-objecten. Stel `required` in voor verplichte velden en `secret` voor gemaskeerde invoer. Het manifest accepteert ook `default`-, `dynamic`- en `expression`-metadata voor velden; deze worden samen met het manifest opgeslagen, maar plugin-nodes lezen tijdens runtime momenteel de opgeslagen node-configuratie in plaats van ontbrekende configuratie automatisch in te vullen op basis van standaardwaarden.

Niet-geheime string-velden worden weergegeven met de UI voor expressie-invoer. Tijdens runtime wordt elke opgeslagen string-configuratiewaarde die begint met `$` opgelost voordat de handler wordt aangeroepen.

## Handler-functies

Actie-handlers ontvangen workflow-invoer, opgeloste configuratie en een kleine context:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Trigger-handlers ontvangen opgeloste configuratie en context:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Retourneer een dictionary om benoemde uitvoervelden beschikbaar te stellen. Als een handler een ander type retourneert, verpakt Heym dit als `{ "value": result }`.

## Installatie en runtime

Plugins zijn standaard uitgeschakeld. Operators schakelen ze in met `HEYM_PLUGINS_ENABLED=true` en beperken het beheer tot `HEYM_PLUGIN_ADMIN_EMAILS`. Geïnstalleerde plugin-bestanden bevinden zich onder `HEYM_PLUGINS_DIR` en dienen in container-implementaties persistent te worden gemount.

Plugin-code is vertrouwde, door een operator geïnstalleerde Python die in-process met de backend draait. Deze kan toegang krijgen tot het netwerk en geïnstalleerde bibliotheken, dus installeer alleen pakketten die u bereid bent uit te voeren met hetzelfde vertrouwensniveau als Heym zelf.
