# Plugin készítése

A Heym pluginok megbízható zip csomagok, amelyeket egy operátor telepít. Egy csomag egy vagy több egyedi action vagy trigger csomópontot adhat hozzá az alapalkalmazás módosítása nélkül.

## Csomag felépítése

A plugin zipnek tartalmaznia kell a `plugin.json` fájlt a csomag gyökérkönyvtárában, valamint az `entry` által megnevezett Python belépési fájlt (alapértelmezésben `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

A `README.md` opcionális, és a plugin dokumentációs oldalaként kerül kiszolgálásra. Helyezzen el egy `icon.svg` fájlt a csomag gyökérkönyvtárában az alapértelmezett csomópont ikonhoz, vagy állítson be csomópont-specifikus `icon` útvonalat a `plugin.json` fájlban.

## Manifest

Használjon több csomópontot tartalmazó `plugin.json` fájlt, ha egy csomag több csomópontot tesz elérhetővé:

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

A régi, egyetlen csomópontot tartalmazó manifestek is elfogadottak: hagyja el a `nodes` mezőt, és adja meg a legfelső szintű `kind`, `fields`, `dslHint` és `docSlug` mezőket.

## Manifest mezők

| Mező | Megjegyzések |
|-------|-------|
| `id` | Kisbetűs csomagazonosító betűk, számok és kötőjelek használatával. |
| `name` | Ember által olvasható csomagnév. |
| `version` | A megjelenítéshez és a handler gyorsítótárazásához használt csomagverzió. |
| `description` | Rövid leírás, amely a felületen és az asszisztens kontextusában jelenik meg. |
| `entry` | A zipen belüli Python handler fájl útvonala; alapértelmezésben `handler.py`. |
| `dependencies` | Opcionális pip követelmények, amelyek az `uv pip install` paranccsal települnek. |
| `nodes` | A csomag által elérhetővé tett egyedi csomópontok. |

Minden csomóponthoz egyedi `key`, egy `name`, valamint `action` vagy `trigger` típusú `kind` szükséges. Ha a `function` mező hiányzik, az actionök a `run`, a triggerek pedig a `trigger` függvényt hívják meg.

A támogatott mezőtípusok: `string`, `number`, `boolean` és `select`. A select mezők `{ "label": "...", "value": "..." }` objektumokból álló `options` tömböt használnak. Állítsa be a `required` értéket a kötelező mezőknél, és a `secret` értéket a maszkolt bemeneteknél. A manifest a mezők `default`, `dynamic` és `expression` metaadatait is elfogadja; ezek a manifesttel együtt tárolódnak, azonban a plugin csomópontok jelenleg futásidőben a mentett csomópontkonfigurációt olvassák be, nem pedig a hiányzó konfigurációt töltik ki automatikusan az alapértelmezett értékekből.

A nem titkos string mezők az expression bemeneti felülettel jelennek meg. Futásidőben minden mentett string konfigurációs érték, amely `$` karakterrel kezdődik, feloldásra kerül, mielőtt a handler meghívásra kerül.

## Handler függvények

Az action handlerek megkapják a workflow bemeneteit, a feloldott konfigurációt és egy kis kontextust:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

A trigger handlerek a feloldott konfigurációt és a kontextust kapják meg:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Adjon vissza egy dictionaryt a nevesített kimeneti mezők elérhetővé tételéhez. Ha egy handler más típust ad vissza, a Heym `{ "value": result }` formában csomagolja be.

## Telepítés és futásidő

A pluginok alapértelmezésben le vannak tiltva. Az operátorok a `HEYM_PLUGINS_ENABLED=true` beállítással engedélyezik őket, és a kezelést a `HEYM_PLUGIN_ADMIN_EMAILS` értékre korlátozzák. A telepített plugin fájlok a `HEYM_PLUGINS_DIR` alatt találhatók, és konténeres telepítéseknél tartósan csatolni kell őket.

A plugin kód megbízható, operátor által telepített Python, amely a backenddel egy folyamatban fut. Hozzáférhet a hálózathoz és a telepített könyvtárakhoz, ezért csak olyan csomagokat telepítsen, amelyeket hajlandó a Heymmel azonos megbízhatósági szinten futtatni.
