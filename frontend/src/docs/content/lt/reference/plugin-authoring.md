# Priedų kūrimas

Heym priedai yra patikimi zip paketai, kuriuos įdiegia operatorius. Paketas gali pridėti vieną ar daugiau pasirinktinių veiksmų arba įvykių mazgų, nekeisdamas pagrindinės programos.

## Paketo struktūra

Priedų zip turi turėti `plugin.json` paketo šaknyje ir Python įėjimo failą, pavadintą `entry` (numatytasis pavadinimas yra `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` yra neprivalomas ir tarnauja kaip priedo dokumentacijos puslapis. Įdėkite `icon.svg` paketo šaknyje kaip numatytąjį mazgo ikoną arba nustatykite mazgo specifinį `icon` kelią `plugin.json`.

## Manifestas

Naudokite daugiamazgį `plugin.json`, kai vienas paketas atskleidžia kelis mazgus:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Vidinės CRM veiklos ir įvykiai",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Sukurti kontaktą",
      "kind": "action",
      "function": "create_contact",
      "description": "Sukurti CRM kontaktą",
      "icon": "assets/publisher.svg",
      "dslHint": "Naudokite tai, kai darbo eiga turi sukurti Acme CRM kontaktą.",
      "fields": [
        {
          "key": "email",
          "label": "El. paštas",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Siųsti sveikinimo el. laišką",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Kontaktas sukurtas",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Pradėti, kai atvyksta kontaktų įvykis"
    }
  ]
}
```

Senesni vieno mazgo manifestai taip pat priimami: praleiskite `nodes` ir pateikite viršutinio lygio `kind`, `fields`, `dslHint` ir `docSlug`.

## Manifesto laukai

| Laukas | Pastabos |
|--------|----------|
| `id` | Mažosiomis raidėmis parašytas paketo ID, naudojant raides, skaičius ir brūkšnelius. |
| `name` | Žmonėms suprantamas paketo pavadinimas. |
| `version` | Paketo versija, naudojama rodymui ir tvarkyklės talpinimui. |
| `description` | Trumpas aprašymas, rodomas vartotojo sąsajoje ir asistento kontekste. |
| `entry` | Python tvarkyklės failo kelias zip faile; numatytasis pavadinimas yra `handler.py`. |
| `dependencies` | Pasirinktiniai pip reikalavimai, įdiegti naudojant `uv pip install`. |
| `nodes` | Pasirinktiniai mazgai, kuriuos atskleidžia šis paketas. |

Kiekvienam mazgui reikia unikalus `key`, `name` ir `kind`, kuris gali būti arba `action`, arba `trigger`. Jei `function` praleidžiamas, veiksmai kviečia `run`, o įvykiai kviečia `trigger`.

Palaikomi laukų tipai yra `string`, `number`, `boolean` ir `select`. Pasirinkimo laukai naudoja `options` masyvą, sudarytą iš `{ "label": "...", "value": "..." }` objektų. Nustatykite `required` privalomiems laukams ir `secret` maskuotiems įvedimams. Manifestas taip pat priima `default`, `dynamic` ir `expression` metaduomenis laukams; šie duomenys saugomi kartu su manifestu, tačiau priedo mazgai šiuo metu skaito išsaugotą mazgo konfigūraciją vykdymo metu, o ne automatiškai užpildo trūkstamą konfigūraciją iš numatytųjų.

Ne-slapti string laukai yra pateikiami su išraiškos įvedimo vartotojo sąsaja. Vykdymo metu bet kuri išsaugota string konfigūracijos reikšmė, prasidedanti nuo `$`, yra išsprendžiama prieš kviečiant tvarkyklę.

## Tvarkyklės funkcijos

Veiksmų tvarkyklės gauna darbo eigos įvestis, išspręstą konfigūraciją ir nedidelį kontekstą:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Įvykių tvarkyklės gauna išspręstą konfigūraciją ir kontekstą:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Grąžinkite žodyną, kad atskleistumėte pavadintus išvesties laukus. Jei tvarkyklė grąžina kitokio tipo reikšmę, Heym ją apvynioja kaip `{ "value": result }`.

## Įdiegimas ir vykdymas

Priedai pagal numatytuosius nustatymus yra išjungti. Operatoriai juos įjungia su `HEYM_PLUGINS_ENABLED=true` ir riboja valdymą `HEYM_PLUGIN_ADMIN_EMAILS`. Įdiegtų priedų failai gyvena po `HEYM_PLUGINS_DIR` ir turėtų būti nuolat montuojami konteinerių diegimuose.

Priedų kodas yra patikimas, operatoriaus įdiegtas Python, kuris veikia procese su backend. Jis gali pasiekti tinklą ir įdiegtas bibliotekas, todėl įdiekite tik tuos paketus, kuriuos esate pasiruošę vykdyti su tokiu pačiu pasitikėjimo lygiu kaip ir pats Heym.
