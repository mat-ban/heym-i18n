# Pluginade autorlus

Heymi pluginad on usaldusväärsed zip-paketid, mille installib operaator. Pakett võib
lisada ühe või mitu kohandatud action- või trigger-node'i ilma tuumrakendust muutmata.

## Paketi ülesehitus

Plugina zip peab sisaldama `plugin.json`-i paketi juurkaustas ja Pythoni sisendfaili,
millele viitab `entry` (vaikimisi `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` on valikuline ja seda serveeritakse plugina dokumentatsioonilehena. Asetage
`icon.svg` paketi juurkausta vaikimisi node'i ikooni jaoks või määrake node-spetsiifiline
`icon` tee `plugin.json`-is.

## Manifest

Kasutage mitme node'iga `plugin.json`-i, kui üks pakett eksponeerib mitut node'i:

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

Toetatud on ka pärandmanifestid ühe node'iga: jätke `nodes` välja ja esitage
ülatasemel `kind`, `fields`, `dslHint` ja `docSlug`.

## Manifesti väljad

| Väli | Märkused |
|-------|-------|
| `id` | Väiketähtedega paketi id, mis kasutab tähti, numbreid ja sidekriipse. |
| `name` | Inimloetav paketi nimi. |
| `version` | Paketi versioon, mida kasutatakse kuvamiseks ja handleri vahemällu salvestamiseks. |
| `description` | Lühikirjeldus, mida kuvatakse UI-s ja assistendi kontekstis. |
| `entry` | Pythoni handleri faili tee zipi sees; vaikimisi `handler.py`. |
| `dependencies` | Valikulised pip-nõuded, mis installitakse käsuga `uv pip install`. |
| `nodes` | Selle paketi eksponeeritud kohandatud node'id. |

Iga node vajab unikaalset `key`-d, `name`-i ja `kind`-i, mille väärtus on kas `action` või
`trigger`. Kui `function` on välja jäetud, kutsuvad actionid välja `run` ja triggerid
kutsuvad välja `trigger`.

Toetatud väljatüübid on `string`, `number`, `boolean` ja `select`. Select-väljad
kasutavad `options` massiivi, mis koosneb `{ "label": "...", "value": "..." }` objektidest.
Määrake `required` kohustuslike väljade jaoks ja `secret` maskeeritud sisendite jaoks. Manifest
aktsepteerib väljade jaoks ka `default`, `dynamic` ja `expression` metaandmeid; need
salvestatakse koos manifestiga, kuid plugina node'id loevad praegu käitusajal salvestatud node'i konfiguratsiooni,
mitte ei täida automaatselt puuduvat konfiguratsiooni vaikeväärtustest.

Mitte-salajased string-väljad renderdatakse avaldise sisestuse UI-ga. Käitusajal
lahendatakse iga salvestatud string-konfiguratsiooni väärtus, mis algab sümboliga `$`, enne handleri
kutsumist.

## Handleri funktsioonid

Action-handlerid saavad workflow sisendid, lahendatud konfiguratsiooni ja väikese konteksti:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Trigger-handlerid saavad lahendatud konfiguratsiooni ja konteksti:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Tagastage sõnastik, et eksponeerida nimetatud väljundvälju. Kui handler tagastab muu
tüübi, pakib Heym selle kujule `{ "value": result }`.

## Installimine ja käitusaeg

Pluginad on vaikimisi keelatud. Operaatorid lubavad need, määrates
`HEYM_PLUGINS_ENABLED=true`, ja piiravad haldust
`HEYM_PLUGIN_ADMIN_EMAILS`-iga. Installitud plugina failid asuvad
`HEYM_PLUGINS_DIR` all ja need tuleks konteineri juurutustes ühendada püsivalt.

Plugina kood on usaldusväärne, operaatori installitud Python, mis töötab backendiga
samas protsessis. See pääseb ligi võrgule ja installitud teekidele, seega installige ainult
pakette, mida olete valmis käitama Heymi endaga samal usaldustasemel.
