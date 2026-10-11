# Plugin-Entwicklung

Heym-Plugins sind vertrauenswürdige Zip-Pakete, die von einem Operator installiert werden. Ein Paket kann einen oder mehrere benutzerdefinierte Action- oder Trigger-Knoten hinzufügen, ohne die Kernanwendung zu verändern.

## Paket-Layout

Ein Plugin-Zip muss `plugin.json` im Paketstammverzeichnis enthalten sowie die Python-Einstiegsdatei, die durch `entry` benannt wird (standardmäßig `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` ist optional und wird als Dokumentationsseite des Plugins bereitgestellt. Lege eine `icon.svg` im Paketstammverzeichnis ab, um das Standard-Knotensymbol festzulegen, oder setze einen knotenspezifischen `icon`-Pfad in `plugin.json`.

## Manifest

Verwende ein Multi-Node-`plugin.json`, wenn ein Paket mehrere Knoten bereitstellt:

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

Ältere Single-Node-Manifeste werden ebenfalls akzeptiert: Lasse `nodes` weg und gib `kind`, `fields`, `dslHint` und `docSlug` auf oberster Ebene an.

## Manifest-Felder

| Feld | Hinweise |
|-------|-------|
| `id` | Paket-ID in Kleinbuchstaben mit Buchstaben, Zahlen und Bindestrichen. |
| `name` | Menschenlesbarer Paketname. |
| `version` | Paketversion, die für die Anzeige und das Handler-Caching verwendet wird. |
| `description` | Kurze Beschreibung, die in der UI und im Assistant-Kontext angezeigt wird. |
| `entry` | Pfad zur Python-Handler-Datei innerhalb des Zips; standardmäßig `handler.py`. |
| `dependencies` | Optionale pip-Anforderungen, die mit `uv pip install` installiert werden. |
| `nodes` | Benutzerdefinierte Knoten, die von diesem Paket bereitgestellt werden. |

Jeder Knoten benötigt einen eindeutigen `key`, einen `name` und ein `kind`, das entweder `action` oder `trigger` ist. Wenn `function` weggelassen wird, rufen Actions `run` auf und Trigger rufen `trigger` auf.

Unterstützte Feldtypen sind `string`, `number`, `boolean` und `select`. Select-Felder verwenden ein `options`-Array aus `{ "label": "...", "value": "..." }`-Objekten. Setze `required` für erforderliche Felder und `secret` für maskierte Eingaben. Das Manifest akzeptiert außerdem `default`-, `dynamic`- und `expression`-Metadaten für Felder; diese werden mit dem Manifest gespeichert, aber Plugin-Knoten lesen derzeit die gespeicherte Knotenkonfiguration zur Laufzeit, anstatt fehlende Konfiguration aus Standardwerten automatisch zu befüllen.

Nicht-geheime String-Felder werden mit der Expression-Eingabe-UI gerendert. Zur Laufzeit wird jeder gespeicherte String-Konfigurationswert, der mit `$` beginnt, aufgelöst, bevor der Handler aufgerufen wird.

## Handler-Funktionen

Action-Handler erhalten Workflow-Eingaben, aufgelöste Konfiguration und einen kleinen Kontext:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Trigger-Handler erhalten aufgelöste Konfiguration und Kontext:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Gib ein Dictionary zurück, um benannte Ausgabefelder bereitzustellen. Wenn ein Handler einen anderen Typ zurückgibt, verpackt Heym ihn als `{ "value": result }`.

## Installation und Laufzeit

Plugins sind standardmäßig deaktiviert. Operatoren aktivieren sie mit
`HEYM_PLUGINS_ENABLED=true` und beschränken die Verwaltung auf
`HEYM_PLUGIN_ADMIN_EMAILS`. Installierte Plugin-Dateien liegen unter
`HEYM_PLUGINS_DIR` und sollten in Container-Deployments persistent gemountet werden.

Plugin-Code ist vertrauenswürdiges, vom Operator installiertes Python, das in-process mit dem Backend läuft. Es kann auf das Netzwerk und installierte Bibliotheken zugreifen, daher sollten nur Pakete installiert werden, die mit demselben Vertrauensniveau wie Heym selbst ausgeführt werden sollen.
