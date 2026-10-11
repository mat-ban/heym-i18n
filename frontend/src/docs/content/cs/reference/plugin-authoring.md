# Autorství pluginů

Pluginy Heym jsou důvěryhodné zip balíčky instalované operátorem. Balíček může
přidat jeden nebo více uzlů vlastních akcí či triggerů bez nutnosti měnit jádro aplikace.

## Uspořádání balíčku

Zip balíček pluginu musí obsahovat `plugin.json` v kořeni balíčku a Python vstupní
soubor pojmenovaný podle `entry` (výchozí hodnota je `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` je volitelný a slouží jako stránka s dokumentací pluginu. Umístěte
`icon.svg` do kořene balíčku pro výchozí ikonu uzlu, nebo nastavte cestu
`icon` specifickou pro daný uzel v `plugin.json`.

## Manifest

Použijte manifest `plugin.json` s více uzly, pokud jeden balíček zpřístupňuje několik uzlů:

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

Akceptovány jsou také starší manifesty s jedním uzlem: vynechejte `nodes` a uveďte
`kind`, `fields`, `dslHint` a `docSlug` na nejvyšší úrovni.

## Pole manifestu

| Pole | Poznámky |
|-------|-------|
| `id` | ID balíčku psané malými písmeny s použitím písmen, číslic a pomlček. |
| `name` | Název balíčku čitelný pro člověka. |
| `version` | Verze balíčku používaná pro zobrazení a cachování handleru. |
| `description` | Krátký popis zobrazený v UI a v kontextu asistenta. |
| `entry` | Cesta k Python souboru handleru uvnitř zip balíčku; výchozí je `handler.py`. |
| `dependencies` | Volitelné pip závislosti instalované pomocí `uv pip install`. |
| `nodes` | Vlastní uzly zpřístupněné tímto balíčkem. |

Každý uzel potřebuje jedinečný `key`, `name` a `kind` s hodnotou buď `action`, nebo
`trigger`. Pokud je `function` vynecháno, akce volají `run` a triggery volají
`trigger`.

Podporované typy polí jsou `string`, `number`, `boolean` a `select`. Pole typu select
používají pole `options` s objekty `{ "label": "...", "value": "..." }`.
Nastavte `required` pro povinná pole a `secret` pro maskované vstupy. Manifest
také akceptuje metadata polí `default`, `dynamic` a `expression`; tato jsou
uložena spolu s manifestem, ale uzly pluginů aktuálně čtou uloženou konfiguraci uzlu
za běhu, namísto automatického doplňování chybějící konfigurace z výchozích hodnot.

Nesekretová pole typu string se vykreslují pomocí UI pro zadávání výrazů. Za běhu
je jakákoli uložená hodnota konfigurace typu string začínající znakem `$` vyhodnocena před
zavoláním handleru.

## Funkce handleru

Handlery akcí přijímají vstupy workflow, vyhodnocenou konfiguraci a malý kontext:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Handlery triggerů přijímají vyhodnocenou konfiguraci a kontext:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Vraťte slovník pro zpřístupnění pojmenovaných výstupních polí. Pokud handler vrátí jiný
typ, Heym jej zabalí jako `{ "value": result }`.

## Instalace a běhové prostředí

Pluginy jsou ve výchozím stavu zakázány. Operátoři je povolují pomocí
`HEYM_PLUGINS_ENABLED=true` a omezují správu na
`HEYM_PLUGIN_ADMIN_EMAILS`. Nainstalované soubory pluginů se nacházejí pod
`HEYM_PLUGINS_DIR` a v kontejnerových nasazeních by měly být připojeny trvale.

Kód pluginu je důvěryhodný, operátorem nainstalovaný Python, který běží v rámci
procesu backendu. Může přistupovat k síti a nainstalovaným knihovnám, proto instalujte
pouze balíčky, které jste ochotni spouštět se stejnou úrovní důvěryhodnosti jako samotný Heym.
