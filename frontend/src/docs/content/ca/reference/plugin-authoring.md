# Creació de plugins

Els plugins de Heym són paquets zip de confiança instal·lats per un operador. Un paquet pot afegir un o més nodes d'acció o trigger personalitzats sense modificar l'aplicació principal.

## Estructura del paquet

Un zip de plugin ha de contenir `plugin.json` a l'arrel del paquet i el fitxer d'entrada de Python indicat per `entry` (per defecte, `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` és opcional i es publica com a pàgina de documentació del plugin. Col·loqueu un `icon.svg` a l'arrel del paquet per a la icona de node per defecte, o establiu una ruta `icon` específica per node a `plugin.json`.

## Manifest

Utilitzeu un `plugin.json` multi-node quan un paquet exposi diversos nodes:

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

També s'accepten manifests d'un sol node heretats: ometeu `nodes` i proporcioneu `kind`, `fields`, `dslHint` i `docSlug` a nivell superior.

## Camps del manifest

| Camp | Notes |
|-------|-------|
| `id` | Id del paquet en minúscules amb lletres, números i guions. |
| `name` | Nom del paquet llegible per a persones. |
| `version` | Versió del paquet utilitzada per a la visualització i la memòria cau del handler. |
| `description` | Descripció breu mostrada a la interfície i al context de l'assistent. |
| `entry` | Ruta del fitxer handler de Python dins del zip; per defecte, `handler.py`. |
| `dependencies` | Requisits pip opcionals instal·lats amb `uv pip install`. |
| `nodes` | Nodes personalitzats exposats per aquest paquet. |

Cada node necessita una `key` única, un `name` i un `kind` que sigui `action` o `trigger`. Si s'omet `function`, les accions criden `run` i els triggers criden `trigger`.

Els tipus de camp admesos són `string`, `number`, `boolean` i `select`. Els camps select utilitzen una matriu `options` d'objectes `{ "label": "...", "value": "..." }`. Establiu `required` per als camps obligatoris i `secret` per a les entrades emmascarades. El manifest també accepta metadades `default`, `dynamic` i `expression` per als camps; aquestes s'emmagatzemen amb el manifest, però els nodes de plugin actualment llegeixen la configuració del node desada en temps d'execució en lloc d'omplir automàticament la configuració absent a partir dels valors per defecte.

Els camps de cadena no secrets es renderitzen amb la interfície d'entrada d'expressions. En temps d'execució, qualsevol valor de configuració de cadena desat que comenci per `$` es resol abans que es cridi el handler.

## Funcions handler

Els handlers d'acció reben les entrades del workflow, la configuració resolta i un context petit:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Els handlers de trigger reben la configuració resolta i el context:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Retorneu un diccionari per exposar camps de sortida amb nom. Si un handler retorna un altre tipus, Heym l'embolcalla com a `{ "value": result }`.

## Instal·lació i temps d'execució

Els plugins estan desactivats per defecte. Els operadors els activen amb `HEYM_PLUGINS_ENABLED=true` i restringeixen la gestió a `HEYM_PLUGIN_ADMIN_EMAILS`. Els fitxers de plugin instal·lats resideixen sota `HEYM_PLUGINS_DIR` i s'han de muntar de manera persistent en desplegaments de contenidors.

El codi del plugin és Python de confiança, instal·lat per l'operador, que s'executa en procés amb el backend. Pot accedir a la xarxa i a les biblioteques instal·lades, de manera que instal·leu només paquets que estigueu disposats a executar amb el mateix nivell de confiança que el propi Heym.