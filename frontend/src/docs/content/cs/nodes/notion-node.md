# Notion

Uzel **Notion** spravuje databáze, zdroje dat, stránky a bloky prostřednictvím Notion API.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Přihlašovací údaje | Interní integrační token nebo Notion OAuth |
| Verze API | `2026-03-11` |

Kolekce ve stylu databází Notion používají v aktuálních verzích API **ID zdrojů dat**. Před spuštěním uzlu nasdílejte s integrací každou stránku nebo zdroj dat, které workflow potřebuje.
Pole prostředků přijímají buď surové ID Notion, nebo úplnou URL adresu Notion. URL adresy jsou před odesláním požadavku na API normalizovány na své vložené ID prostředku.

## Operace

| Operace | Povinná pole | Hlavní výstup |
|-----------|-----------------|-------------|
| Search | Volitelný dotaz/filtr/řazení | `.results`, `.count`, `.next_cursor` |
| Get Page | ID stránky | `.page` |
| Create Page | ID zdroje dat nebo ID nadřazené stránky, Properties | `.page`, `.id`, `.url` |
| Update Page | ID stránky, jedno z Properties/Icon/Cover | `.page` |
| Move Page to Trash | ID stránky | `.page` |
| Restore Page | ID stránky | `.page` |
| Create Database | Požadavek na databázi s `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | ID databáze | `.database` |
| Update Database | ID databáze, neprázdný požadavek na databázi | `.database`, `.id`, `.url` |
| Create Data Source | Požadavek na zdroj dat s `parent` a neprázdným `properties` | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Zdroj dat | `.data_source` |
| Update Data Source | ID zdroje dat, neprázdný požadavek na zdroj dat | `.data_source`, `.id`, `.url` |
| Query Data Source | ID zdroje dat | `.results`, `.count`, `.next_cursor` |
| Get Block Children | ID bloku nebo stránky | `.results`, `.count`, `.next_cursor` |
| Update Block | ID bloku, objekt aktualizace bloku | `.block` |
| Delete Block | ID bloku | `.block` |
| Append Blocks | ID bloku nebo stránky, Children | `.results`, `.count` |

Všechny operace rovněž vracejí `.success` a `.operation`.

## Pole JSON

Pole Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon a Cover přijímají JSON Notion API. Výrazy uvnitř řetězců JSON jsou před odesláním požadavku vyhodnoceny. Pole může být také jediný samostatný výraz, který se vyhodnotí přímo na požadovaný objekt nebo pole, například
`$input.database`, `$input.properties` nebo `$input.children`.

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

Pro obsah stránky nebo bloku je Children pole objektů bloků Notion:

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

## Databáze a zdroje dat

V aktuálním Notion API je **databáze** kontejner a **zdroj dat** obsahuje schéma vlastností a dotazovatelné řádky. Retrieve Database vrací seznam `data_sources` databáze; použijte jedno z těchto ID s Retrieve Data Source nebo Query Data Source.

Create Database přijímá kompletní objekt požadavku z endpointu Create a database v Notion. Musí obsahovat `parent` a může obsahovat `title`, `description`, `is_inline`,
`initial_data_source`, `icon` a `cover`. Například:

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

Update Database přijímá objekt požadavku z endpointu update, včetně `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` a `is_locked`. Pole ID databáze přijímají surové ID, úplnou URL adresu Notion nebo výraz.

Před sestavením objektu properties pro Create Page použijte **Retrieve Data Source** k načtení schématu `properties` zdroje dat. **Create Data Source** vyžaduje objekt nadřazené databáze a neprázdné schéma `properties`. **Update Data Source** přijímá neprázdný objekt požadavku podporovaný odpovídajícím endpointem Notion.

Například vytvoření zdroje dat uvnitř existující databáze:

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

Selektory Data Source a Parent Page podporují vyhledávání na straně serveru s krátkým debounce a stránkováním **Load more** založeným na kurzoru. Po nasdílení nového prostředku v Notion použijte **Refresh**.
Přepněte na **Use expression** pro zadání výrazu, surového ID nebo URL adresy.

Filtry vyhledávání ze starších návodů, které používají
`{"property":"object","value":"database"}`, jsou přeloženy na aktuální hodnotu `data_source`.
Nové workflow by měly používat přímo `data_source` nebo `page`.

Append Blocks podporuje pozice **Start**, **End** a **After Block**. Create Page a Append
Blocks automaticky rozdělují více než 100 podřízených prvků nejvyšší úrovně do seřazených požadavků, aby vyhověly limitu Notion na jeden požadavek.

Požadavky s omezenou rychlostí (`429` nebo `529`) se opakují až třikrát. Heym respektuje hlavičku `Retry-After` od Notion, omezuje každé čekání na 10 sekund a přidává randomizovaný jitter. Požadavky Notion
sdílejí procesně široký fond HTTP připojení napříč stránkami a uzly workflow.
## Limity Notion API

- Jedna hodnota `text.content` ve formátu rich-text může obsahovat nejvýše 2 000 znaků. Delší text
  rozdělte do více objektů rich-text.
- Notion omezuje počet potomků bloku na nejvyšší úrovni na 100 na jeden požadavek. Heym dávkuje
  větší pole Children, ale každý jednotlivý blok musí stále splňovat limity payloadu Notion.
- API přijímá v jednom požadavku nejvýše dvě vnořené úrovně potomků bloků. Hlubší struktury
  vytvářejte pomocí navazujících operací Append Blocks.
- Payloady požadavků jsou omezeny na 1 000 prvků bloků a celkově 500 KB.

## Stránkování

Operace Search, Query Data Source a Get Block Children přijímají velikost stránky od 1 do 100
a volitelný počáteční kurzor. Nastavte velikost stránky na `0` pro automatické sledování kurzorů
a sloučení všech výsledků až do bezpečnostního limitu uzlu 10 000 výsledků.

## Nastavení přihlašovacích údajů

V dialogu přihlašovacích údajů zvolte jedno z nastavení (**Internal token** nebo **OAuth**):

- **Internal token:** Vytvořte interní integraci, zkopírujte její token do HeyMu a poté nasdílejte
  každou požadovanou stránku nebo datový zdroj s integrací. Ověřte přístup pomocí **Test Connection**.
- **OAuth:** Vytvořte veřejnou integraci Notion a zaregistrujte v Notionu
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`. V dialogu přihlašovacích údajů HeyMu
  zvolte **OAuth**, zadejte Client ID a Client Secret integrace a poté kliknutím na **Connect**
  autorizujte pracovní prostor. Secret je uložen šifrovaně spolu s přihlašovacími údaji a není
  umístěn ve stavu OAuth ani v konfiguraci prostředí. Po autorizaci přihlašovací údaje zobrazují
  název připojeného pracovního prostoru (`connected (Workspace Name)`). Nevyřízené přihlašovací
  údaje OAuth zobrazují `Not connected`.

Ponecháte-li pole interního tokenu při úpravách prázdné, uložený token zůstane zachován.

Pro vlastní požadavky [HTTP](../nodes/http-node.md) se `$credentials.YourNotionCredential` přeloží
na stejný bearer token, který používá uzel Notion (interní token nebo přístupový token OAuth).

## Poznámky k verzi API

Heym připíná požadavky Notion k verzi API `2026-03-11`. Tato verze používá:

- rodiče `data_source_id` a endpointy `/data_sources` místo starších cest pro dotazování databáze
- `in_trash` místo `archived` pro operace přesunu stránky do koše a jejího obnovení
- objekty `position` (`start`, `end`, `after_block`) pro Append Block Children

Při migraci starších příkladů automatizace Notion:

- Nahraďte odkazy na rodiče databáze a dotazy na databázi identifikátory datových zdrojů z operace
  **Retrieve Database** nebo z výběru datového zdroje v editoru
- Nahraďte `archived: true` výrazem `in_trash: true`
- Nahraďte parametry `after` pro append polem **Append Position** v uzlu

Filtry vyhledávání, které stále používají hodnotu objektu `database`, jsou automaticky
normalizovány na `data_source`.

## Související

- [Přihlašovací údaje](../reference/credentials.md)
- [Integrace třetích stran](../reference/integrations.md)
- [Typy uzlů](../reference/node-types.md)
