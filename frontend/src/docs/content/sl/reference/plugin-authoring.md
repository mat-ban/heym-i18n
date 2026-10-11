# Avtorstvo Vtičnikov

Vtičniki Heym so zaupanja vredni zip paketi, ki jih namesti operater. Paket lahko doda eno ali več prilagojenih akcij ali trigger vozlišč, ne da bi spremenil jedro aplikacije.

## Postavitev Paketa

Zip vtičnika mora vsebovati `plugin.json` v korenu paketa in Python vstopno datoteko, poimenovano z `entry` (privzeto `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` je neobvezna in služi kot dokumentacijska stran vtičnika. V korenu paketa postavite `icon.svg` za privziko ikono vozlišča ali nastavite pot do specifične ikone vozlišča v `plugin.json`.

## Manifest

Uporabite več-vozliščni `plugin.json`, ko en paket izpostavi več vozlišč:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Notranje CRM akcije in triggerji",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Ustvari Kontakt",
      "kind": "action",
      "function": "create_contact",
      "description": "Ustvari CRM kontakt",
      "icon": "assets/publisher.svg",
      "dslHint": "Uporabite to, ko workflow potrebuje ustvariti kontakt Acme CRM.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Pošlji dobrodošlico",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Kontakt Ustvarjen",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Začne, ko pride dogodek kontakta"
    }
  ]
}
```

Zastareli manifesti z enim vozliščem so prav tako sprejeti: izpustite `nodes` in zagotovite vrhnji `kind`, `fields`, `dslHint` in `docSlug`.

## Polja Manifesta

| Polje | Opombe |
|-------|-------|
| `id` | Majhne črke id paketa, ki uporablja črke, številke in vezaje. |
| `name` | Človeško berljivo ime paketa. |
| `version` | Različica paketa, uporabljena za prikaz in predpomnjenje obdelovalca. |
| `description` | Kratek opis, prikazan v uporabniškem vmesniku in kontekstu asistenta. |
| `entry` | Pot do Python obdelovalne datoteke znotraj zip; privzeto `handler.py`. |
| `dependencies` | Neobvezne zahteve pip, nameščene z `uv pip install`. |
| `nodes` | Prilagojena vozlišča, izpostavljena s tem paketom. |

Vsako vozlišče potrebuje edinstven `key`, `name` in `kind`, ki je lahko bodisi `action` bodisi `trigger`. Če je `function` izpuščena, akcije kličejo `run`, triggerji pa kličejo `trigger`.

Podprti tipi polj so `string`, `number`, `boolean` in `select`. Polja za izbiro uporabljajo `options` tabelo objektov `{ "label": "...", "value": "..." }`. Nastavite `required` za obvezna polja in `secret` za maskirane vnose. Manifest prav tako sprejema `default`, `dynamic` in `expression` metapodatke za polja; ti so shranjeni z manifestom, vendar trenutna vozlišča vtičnika berejo shranjeno konfiguracijo vozlišča ob izvajanju, namesto da bi samodejno napolnila manjkajočo konfiguracijo iz privzetih vrednosti.

Neskrivna polja tipa string se prikazujejo z uporabniškim vmesnikom za vnos izrazov. Ob izvajanju se vsaka shranjena vrednost konfiguracije string, ki se začne z `$`, razreši pred klicem obdelovalca.

## Funkcije Obdelovalcev

Obdelovalci akcij prejmejo vhodne podatke workflow, razrešeno konfiguracijo in majhen kontekst:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Obdelovalci triggerjev prejmejo razrešeno konfiguracijo in kontekst:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Vrni slovar, da izpostavi poimenovana izhodna polja. Če obdelovalec vrne drugo vrsto, Heym to ovije kot `{ "value": result }`.

## Namestitev In Izvajanje

Vtičniki so privzeto onemogočeni. Operaterji jih omogočijo z `HEYM_PLUGINS_ENABLED=true` in omejijo upravljanje na `HEYM_PLUGIN_ADMIN_EMAILS`. Namestitvene datoteke vtičnikov živijo pod `HEYM_PLUGINS_DIR` in jih je treba trajno pritrditi v namestitvah kontejnerjev.

Koda vtičnika je zaupanja vredna, Python, ki ga namesti operater, in deluje v procesu z backendom. Ima dostop do omrežja in nameščenih knjižnic, zato namestite samo pakete, ki jih želite izvajati z enako stopnjo zaupanja kot Heym sam.
