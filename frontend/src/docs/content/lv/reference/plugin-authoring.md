# Plugin Authoring

Heym spraudņi ir uzticami zip pakotnes, ko instalē operators. Pakotne var
pievienot vienu vai vairākus pielāgotus action vai trigger mezglus, nemainot pamata lietotni.

## Pakotnes izkārtojums

Spraudņa zip failam pakotnes saknē ir jāsatur `plugin.json` un Python entry
fails, kas norādīts ar `entry` (pēc noklusējuma `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` nav obligāts un tiek pasniegts kā spraudņa dokumentācijas lapa. Ievietojiet
`icon.svg` pakotnes saknē noklusējuma mezgla ikonai vai iestatiet mezglam specifisku
`icon` ceļu failā `plugin.json`.

## Manifest

Izmantojiet vairāku mezglu `plugin.json`, ja viena pakotne atklāj vairākus mezglus:

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

Tiek pieņemti arī mantotie viena mezgla manifesti: izlaidiet `nodes` un norādiet
augšējā līmeņa `kind`, `fields`, `dslHint` un `docSlug`.

## Manifest lauki

| Lauks | Piezīmes |
|-------|-------|
| `id` | Pakotnes id ar mazajiem burtiem, izmantojot burtus, ciparus un defises. |
| `name` | Cilvēkam lasāms pakotnes nosaukums. |
| `version` | Pakotnes versija, ko izmanto attēlošanai un handler kešošanai. |
| `description` | Īss apraksts, kas parādīts UI un asistenta kontekstā. |
| `entry` | Python handler faila ceļš zip iekšienē; pēc noklusējuma `handler.py`. |
| `dependencies` | Neobligātas pip prasības, kas instalētas ar `uv pip install`. |
| `nodes` | Pielāgotie mezgli, ko atklāj šī pakotne. |

Katram mezglam nepieciešams unikāls `key`, `name` un `kind` ar vērtību `action` vai
`trigger`. Ja `function` ir izlaists, action izsauc `run`, bet trigger izsauc
`trigger`.

Atbalstītie lauku tipi ir `string`, `number`, `boolean` un `select`. Select
lauki izmanto `options` masīvu ar `{ "label": "...", "value": "..." }` objektiem.
Iestatiet `required` obligātajiem laukiem un `secret` maskētajām ievadēm. Manifest
arī pieņem `default`, `dynamic` un `expression` metadatus laukiem; tie tiek
saglabāti kopā ar manifestu, bet spraudņu mezgli pašlaik izpildes laikā nolasa saglabāto mezgla config, nevis automātiski aizpilda trūkstošo config no noklusējumiem.

Ne-secret string lauki tiek attēloti ar izteiksmes ievades UI. Izpildes laikā
jebkura saglabātā string config vērtība, kas sākas ar `$`, tiek atrisināta pirms handler
tiek izsaukts.

## Handler funkcijas

Action handleri saņem workflow ievades, atrisināto config un nelielu kontekstu:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Trigger handleri saņem atrisināto config un kontekstu:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Atgrieziet vārdnīcu, lai atklātu nosauktos izvades laukus. Ja handler atgriež citu
tipu, Heym iesaiņo to kā `{ "value": result }`.

## Instalēšana un izpildes vide

Spraudņi pēc noklusējuma ir atspējoti. Operatoriem tie jāiespējo ar
`HEYM_PLUGINS_ENABLED=true` un jāierobežo pārvaldība ar
`HEYM_PLUGIN_ADMIN_EMAILS`. Instalētie spraudņu faili atrodas zem
`HEYM_PLUGINS_DIR` un konteineru izvietojumos tie ir jāmontē noturīgi.

Spraudņu kods ir uzticams, operatora instalēts Python, kas darbojas vienā procesā ar
backend. Tam var būt piekļuve tīklam un instalētajām bibliotēkām, tāpēc instalējiet tikai tādas
pakotnes, kuras esat gatavi palaist ar tādu pašu uzticamības līmeni kā pašu Heym.
