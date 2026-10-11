# Autorstvo pluginov

Heym pluginy sú dôveryhodné zip balíčky, ktoré inštaluje operátor. Balíček môže
pridať jeden alebo viac vlastných uzlov typu akcia alebo trigger bez zmeny
jadra aplikácie.

## Štruktúra balíčka

Zip balíček pluginu musí obsahovať `plugin.json` v koreňovom adresári balíčka a
Python vstupný súbor pomenovaný podľa `entry` (predvolene `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` je voliteľný a slúži ako dokumentačná stránka pluginu. Umiestnite
`icon.svg` do koreňového adresára balíčka pre predvolenú ikonu uzla, alebo
nastavte cestu k `icon` špecifickú pre uzol v `plugin.json`.

## Manifest

Použite viacuzlový `plugin.json`, keď jeden balíček sprístupňuje niekoľko uzlov:

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

Akceptované sú aj staršie manifesty s jedným uzlom: vynechajte `nodes` a uveďte
`kind`, `fields`, `dslHint` a `docSlug` na najvyššej úrovni.

## Polia manifestu

| Pole | Poznámky |
|-------|-------|
| `id` | Identifikátor balíčka malými písmenami používajúci písmená, čísla a pomlčky. |
| `name` | Ľudsky čitateľný názov balíčka. |
| `version` | Verzia balíčka používaná na zobrazenie a cacheovanie handlera. |
| `description` | Krátky popis zobrazený v UI a v kontexte asistenta. |
| `entry` | Cesta k Python súboru handlera vnútri zip balíčka; predvolene `handler.py`. |
| `dependencies` | Voliteľné pip požiadavky inštalované pomocou `uv pip install`. |
| `nodes` | Vlastné uzly sprístupnené týmto balíčkom. |

Každý uzol potrebuje jedinečný `key`, `name` a `kind` s hodnotou buď `action`,
alebo `trigger`. Ak je `function` vynechané, akcie volajú `run` a triggery volajú
`trigger`.

Podporované typy polí sú `string`, `number`, `boolean` a `select`. Polia typu
select používajú pole `options` s objektmi `{ "label": "...", "value": "..." }`.
Nastavte `required` pre povinné polia a `secret` pre maskované vstupy. Manifest
tiež akceptuje metadata `default`, `dynamic` a `expression` pre polia; tieto sa
ukladajú spolu s manifestom, ale uzly pluginu v súčasnosti čítajú uloženú
konfiguráciu uzla za behu namiesto automatického dopĺňania chýbajúcej
konfigurácie z predvolených hodnôt.

Nesekretové textové polia sa vykresľujú pomocou UI vstupu výrazu. Za behu sa
akákoľvek uložená textová hodnota konfigurácie začínajúca znakom `$` vyrieši
pred zavolaním handlera.

## Funkcie handlera

Handlery akcií prijímajú vstupy workflowu, vyriešenú konfiguráciu a malý kontext:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Handlery triggerov prijímajú vyriešenú konfiguráciu a kontext:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Vráťte slovník na sprístupnenie pomenovaných výstupných polí. Ak handler vráti
iný typ, Heym ho zabalí ako `{ "value": result }`.

## Inštalácia a beh

Pluginy sú predvolene zakázané. Operátori ich povoľujú pomocou
`HEYM_PLUGINS_ENABLED=true` a obmedzujú správu na
`HEYM_PLUGIN_ADMIN_EMAILS`. Nainštalované súbory pluginov sa nachádzajú v
`HEYM_PLUGINS_DIR` a v kontajnerových nasadeniach by mali byť pripojené
perzistentne.

Kód pluginu je dôveryhodný, operátorom nainštalovaný Python, ktorý beží v rámci
procesu backendu. Môže pristupovať k sieti a nainštalovaným knižniciam, preto
inštalujte iba balíčky, ktoré ste ochotní spúšťať s rovnakou úrovňou dôvery ako
samotný Heym.
