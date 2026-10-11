# Autorstvo Plugina

Heym pluginovi su pouzdani zip paketi koje instalira operator. Paket može dodati jedan ili više prilagođenih čvorova akcija ili okidača bez promjene osnovne aplikacije.

## Raspored Paketa

Zip paket plugina mora sadržavati `plugin.json` u korijenu paketa i Python ulaznu datoteku nazvanu prema `entry` (zadano `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` je opcionalan i služi kao dokumentacijska stranica plugina. Stavite `icon.svg` u korijen paketa za zadanu ikonu čvora, ili postavite putanju specifičnu za čvor `icon` u `plugin.json`.

## Manifest

Koristite višekratni `plugin.json` kada jedan paket izlaže nekoliko čvorova:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Interni CRM akcije i okidači",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Kreiraj Kontakt",
      "kind": "action",
      "function": "create_contact",
      "description": "Kreiraj CRM kontakt",
      "icon": "assets/publisher.svg",
      "dslHint": "Koristite ovo kada workflow treba kreirati Acme CRM kontakt.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Pošalji uvodni email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Kontakt Kreiran",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Pokreni kada stigne događaj kontakta"
    }
  ]
}
```

Stari manifesti s jednim čvorom također su prihvaćeni: izostavite `nodes` i navedite `kind`, `fields`, `dslHint` i `docSlug` na vrhu.

## Polja Manifesta

| Polje | Napomene |
|-------|-------|
| `id` | Mala slova id paketa koristeći slova, brojeve i crtice. |
| `name` | Naziv paketa koji je razumljiv ljudima. |
| `version` | Verzija paketa koja se koristi za prikaz i predmemoriju handlera. |
| `description` | Kratak opis prikazan u UI-u i kontekstu asistenta. |
| `entry` | Putanja do Python handler datoteke unutar zip-a; zadano `handler.py`. |
| `dependencies` | Opcionalni pip zahtjevi instalirani s `uv pip install`. |
| `nodes` | Prilagođeni čvorovi koje izlaže ovaj paket. |

Svaki čvor treba jedinstveni `key`, `name` i `kind` koji može biti ili `action` ili `trigger`. Ako je `function` izostavljen, akcije pozivaju `run`, a okidači pozivaju `trigger`.

Podržani tipovi polja su `string`, `number`, `boolean` i `select`. Select polja koriste `options` niz objekata `{ "label": "...", "value": "..." }`. Postavite `required` za obavezna polja i `secret` za maskirane unose. Manifest također prihvaća `default`, `dynamic` i `expression` metapodatke za polja; ovi se pohranjuju s manifestom, ali čvorovi plugina trenutno čitaju spremljenu konfiguraciju čvora u vrijeme izvođenja umjesto da automatski popunjavaju nedostajuću konfiguraciju iz zadanih vrijednosti.

Ne-tajna string polja prikazuju se s UI-jem za unos izraza. U vrijeme izvođenja, svaka spremljena vrijednost string konfiguracije koja počinje s `$` se rješava prije nego što se pozove handler.

## Funkcije Handlera

Handleri akcija primaju ulaze workflow-a, riješenu konfiguraciju i mali kontekst:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Handleri okidača primaju riješenu konfiguraciju i kontekst:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Vratite rječnik kako biste izložili imenovana izlazna polja. Ako handler vrati drugu vrstu, Heym ga obavija kao `{ "value": result }`.

## Instalacija i Izvršavanje

Pluginovi su prema zadanim postavkama onemogućeni. Operator ih omogućuje s `HEYM_PLUGINS_ENABLED=true` i ograničava upravljanje na `HEYM_PLUGIN_ADMIN_EMAILS`. Instalirane datoteke plugina nalaze se pod `HEYM_PLUGINS_DIR` i trebaju biti trajno montirane u implementacijama kontejnera.

Kod plugina je pouzdan, Python koji instalira operator i koji se izvršava unutar procesa s backendom. Može pristupiti mreži i instaliranim knjižnicama, stoga instalirajte samo pakete koje ste spremni pokrenuti s istim razinom povjerenja kao i Heym sam.
