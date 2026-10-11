# Notion

Uzol **Notion** spravuje databázy, dátové zdroje, stránky a bloky prostredníctvom Notion API.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Prihlasovacie údaje | Interný integračný token alebo Notion OAuth |
| Verzia API | `2026-03-11` |

Kolekcie v štýle Notion databáz používajú v aktuálnych verziách API **ID dátových zdrojov**. Pred spustením uzla zdieľajte každú stránku alebo dátový zdroj, ktorý workflow potrebuje, s integráciou. Polia zdrojov akceptujú buď surové Notion ID, alebo úplnú Notion URL. URL adresy sa pred odoslaním API požiadavky normalizujú na vložené ID zdroja.

## Operácie

| Operácia | Povinné polia | Hlavný výstup |
|-----------|-----------------|-------------|
| Search | Voliteľný query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID alebo Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, jedno z Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Database request s `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, neprázdny database request | `.database`, `.id`, `.url` |
| Create Data Source | Data source request s `parent` a neprázdnym `properties` | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, neprázdny data source request | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block alebo Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, objekt aktualizácie bloku | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block alebo Page ID, Children | `.results`, `.count` |

Všetky operácie tiež vracajú `.success` a `.operation`.

## JSON polia

Polia Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon a Cover akceptujú JSON Notion API. Výrazy vo vnútri JSON reťazcov sa pred odoslaním požiadavky vyhodnotia. Pole môže byť tiež jeden samostatný výraz, ktorý sa vyhodnotí priamo na požadovaný objekt alebo pole, napríklad `$input.database`, `$input.properties` alebo `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Pre obsah stránky alebo bloku je Children pole objektov blokov Notion:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## Databázy a dátové zdroje

V aktuálnom Notion API je **databáza** kontajner a **dátový zdroj** obsahuje schému vlastností a dotazovateľné riadky. Retrieve Database vracia zoznam `data_sources` databázy; použite jedno z týchto ID s Retrieve Data Source alebo Query Data Source.

Create Database akceptuje kompletný objekt požiadavky z Notion endpointu Create a database. Musí obsahovať `parent` a môže obsahovať `title`, `description`, `is_inline`, `initial_data_source`, `icon` a `cover`. Napríklad:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Update Database akceptuje objekt požiadavky update endpointu vrátane `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` a `is_locked`. Polia Database ID akceptujú surové ID, úplnú Notion URL alebo výraz.

Použite **Retrieve Data Source** na získanie schémy `properties` dátového zdroja pred zostavením objektu properties pre Create Page. **Create Data Source** vyžaduje objekt nadradenej databázy a neprázdnu schému `properties`. **Update Data Source** akceptuje neprázdny objekt požiadavky podporovaný príslušným Notion endpointom.

Napríklad vytvorte dátový zdroj v existujúcej databáze:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Selektory Data Source a Parent Page podporujú vyhľadávanie na strane servera s krátkym debounce a stránkovaním **Load more** založeným na kurzore. Po zdieľaní nového zdroja v Notion použite **Refresh**. Prepnutím na **Use expression** zadáte výraz, surové ID alebo URL.

Filtre vyhľadávania zo starších tutoriálov, ktoré používajú `{"property":"object","value":"database"}`, sa prekladajú na aktuálnu hodnotu `data_source`. Nové workflowy by mali používať priamo `data_source` alebo `page`.

Append Blocks podporuje pozície **Start**, **End** a **After Block**. Create Page a Append Blocks automaticky rozdeľujú viac ako 100 podradených blokov najvyššej úrovne do zoradených požiadaviek, aby vyhoveli limitu Notion na jednu požiadavku.

Požiadavky obmedzené rýchlosťou (`429` alebo `529`) sa opakujú až trikrát. Heym rešpektuje hlavičku `Retry-After` od Notion, obmedzuje každé čakanie na 10 sekúnd a pridáva randomizovaný jitter. Notion požiadavky zdieľajú celoprocesový HTTP connection pool naprieč stránkami a uzlami workflowu.
## Limity Notion API

- Jedna hodnota rich-text `text.content` môže obsahovať najviac 2 000 znakov. Dlhší text rozdeľte
  do viacerých rich-text objektov.
- Notion obmedzuje počet potomkov blokov najvyššej úrovne na 100 na jednu požiadavku. Heym dávkuje
  väčšie polia Children, ale každý jednotlivý blok musí stále spĺňať limity payloadu Notion.
- API akceptuje najviac dve úrovne vnorenia potomkov blokov v jednej požiadavke. Hlbšie štruktúry
  vytvárajte pomocou následných operácií Append Blocks.
- Payloady požiadaviek sú obmedzené na 1 000 blokových elementov a celkovo 500 KB.

## Stránkovanie

Search, Query Data Source a Get Block Children akceptujú veľkosť stránky od 1 do 100 a voliteľný
počiatočný kurzor. Nastavte veľkosť stránky na `0`, aby sa kurzory sledovali automaticky a všetky
výsledky sa zlúčili, až po bezpečnostný limit uzla 10 000 výsledkov.

## Nastavenie prihlasovacích údajov

V dialógovom okne prihlasovacích údajov zvoľte jedno z dvoch nastavení (**Internal token** alebo **OAuth**):

- **Internal token:** Vytvorte internú integráciu, skopírujte jej token do Heymu a potom zdieľajte
  každú požadovanú stránku alebo dátový zdroj s integráciou. Prístup overte pomocou **Test Connection**.
- **OAuth:** Vytvorte verejnú integráciu Notion a zaregistrujte
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` v Notione. V dialógovom okne prihlasovacích údajov
  Heymu zvoľte **OAuth**, zadajte Client ID a Client Secret integrácie a potom kliknutím na **Connect**
  autorizujte pracovný priestor. Secret sa ukladá zašifrovaný spolu s prihlasovacími údajmi a nie je
  umiestnený v OAuth state ani v konfigurácii prostredia. Po autorizácii prihlasovacie údaje zobrazujú
  názov pripojeného pracovného priestoru (`connected (Workspace Name)`). Čakajúce OAuth prihlasovacie
  údaje zobrazujú `Not connected`.

Ak pri úprave ponecháte pole interného tokenu prázdne, uložený token sa zachová.

Pre vlastné požiadavky [HTTP](../nodes/http-node.md) sa `$credentials.YourNotionCredential` preloží na
rovnaký bearer token, ktorý používa uzol Notion (interný token alebo OAuth access token).

## Poznámky k verzii API

Heym pripája požiadavky Notion k verzii API `2026-03-11`. Táto verzia používa:

- rodičov `data_source_id` a endpointy `/data_sources` namiesto starších ciest na dotazovanie databázy
- `in_trash` namiesto `archived` pre operácie presunu stránky do koša a obnovenia
- objekty `position` (`start`, `end`, `after_block`) pre Append Block Children

Pri migrácii starších príkladov automatizácie Notion:

- Nahraďte odkazy na rodiča databázy a dotazy ID dátových zdrojov z **Retrieve Database** alebo
  výberu dátového zdroja v editore
- Nahraďte `archived: true` za `in_trash: true`
- Nahraďte parametre append `after` poľom **Append Position** uzla

Filtre vyhľadávania, ktoré stále používajú hodnotu objektu `database`, sa automaticky normalizujú na `data_source`.

## Súvisiace

- [Prihlasovacie údaje](../reference/credentials.md)
- [Integrácie tretích strán](../reference/integrations.md)
- [Typy uzlov](../reference/node-types.md)
