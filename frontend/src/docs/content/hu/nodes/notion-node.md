# Notion

A **Notion** csomópont adatbázisokat, adatforrásokat, oldalakat és blokkokat kezel a Notion API-n keresztül.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Hitelesítési adatok | Belső integrációs token vagy Notion OAuth |
| API-verzió | `2026-03-11` |

A Notion adatbázis-stílusú gyűjteményei a jelenlegi API-verziókban **adatforrás-azonosítókat** használnak. A csomópont futtatása előtt ossza meg az integrációval minden olyan oldalt vagy adatforrást, amelyre a workflow-nak szüksége van.
Az erőforrás-mezők nyers Notion-azonosítót vagy teljes Notion URL-t egyaránt elfogadnak. Az URL-eket a rendszer a bennük lévő erőforrás-azonosítóra normalizálja az API-kérés előtt.

## Műveletek

| Művelet | Kötelező mezők | Fő kimenet |
|-----------|-----------------|-------------|
| Search | Opcionális query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID vagy Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, Properties/Icon/Cover közül legalább az egyik | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Adatbázis-kérés `parent` mezővel | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, nem üres adatbázis-kérés | `.database`, `.id`, `.url` |
| Create Data Source | Adatforrás-kérés `parent` és nem üres `properties` mezővel | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, nem üres adatforrás-kérés | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block vagy Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, blokkfrissítési objektum | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block vagy Page ID, Children | `.results`, `.count` |

Minden művelet visszaadja továbbá a `.success` és `.operation` értékeket is.

## JSON-mezők

A Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon és Cover mezők
Notion API JSON-t fogadnak el. A JSON-sztringeken belüli kifejezések a kérés előtt kerülnek feloldásra. Egy mező lehet
egyetlen önálló kifejezés is, amely közvetlenül a kívánt objektumra vagy tömbre oldódik fel, például
`$input.database`, `$input.properties` vagy `$input.children`.

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

Oldal- vagy blokktartalom esetén a Children egy Notion blokkobjektumokból álló tömb:

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

## Adatbázisok és adatforrások

A jelenlegi Notion API-ban az **adatbázis** egy tároló, az **adatforrás** pedig a tulajdonságsémát
és a lekérdezhető sorokat tartalmazza. A Retrieve Database visszaadja az adatbázis `data_sources` listáját; használja ezen azonosítók egyikét a Retrieve Data Source vagy a Query Data Source művelethez.

A Create Database elfogadja a Notion Create a database endpointjának teljes kérés-objektumát. Ennek
tartalmaznia kell a `parent` mezőt, és tartalmazhatja a `title`, `description`, `is_inline`,
`initial_data_source`, `icon` és `cover` mezőket. Például:

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

Az Update Database elfogadja az update endpoint kérés-objektumát, beleértve a `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` és `is_locked` mezőket. A Database ID mezők nyers azonosítót, teljes Notion URL-t vagy kifejezést fogadnak el.

A **Retrieve Data Source** művelettel kérheti le az adatforrás `properties` sémáját, mielőtt összeállítaná
a Create Page properties objektumot. A **Create Data Source** művelethez szükség van egy szülő adatbázis-objektumra és egy
nem üres `properties` sémára. Az **Update Data Source** egy nem üres, a megfelelő Notion-endpoint által támogatott kérés-objektumot fogad el.

Például hozzon létre egy adatforrást egy meglévő adatbázison belül:

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

A Data Source és Parent Page választók támogatják a szerveroldali keresést rövid debounce-sal és
kurzor-alapú **Load more** lapozással. Új erőforrás Notionban történő megosztása után használja a **Refresh** lehetőséget.
Váltson a **Use expression** módra kifejezés, nyers azonosító vagy URL megadásához.

A régebbi útmutatókból származó, `{"property":"object","value":"database"}` alakú keresési szűrők
a jelenlegi `data_source` értékre kerülnek átfordításra.
Az új workflow-knak közvetlenül a `data_source` vagy `page` értéket érdemes használniuk.

Az Append Blocks támogatja a **Start**, **End** és **After Block** pozíciókat. A Create Page és az Append
Blocks automatikusan 100-nál több felső szintű gyermeket oszt fel sorrendben végrehajtott kérésekre, hogy megfeleljen a Notion kérésenkénti korlátjának.

A sebességkorlátozott kérések (`429` vagy `529`) legfeljebb háromszor kerülnek újrapróbálásra. A Heym figyelembe veszi a Notion
`Retry-After` fejlécét, a várakozást legfeljebb 10 másodpercre korlátozza, és véletlenszerű jitter-t ad hozzá. A Notion-kérések
folyamatszintű HTTP-kapcsolatpoolt osztanak meg az oldalak és a workflow-csomópontok között.
## Notion API korlátok

- Egyetlen rich-text `text.content` érték legfeljebb 2 000 karaktert tartalmazhat. A hosszabb szöveget
  több rich-text objektumra kell bontani.
- A Notion a legfelső szintű blokk-gyermekek számát kérésenként 100-ra korlátozza. A Heym a nagyobb
  Children tömböket kötegekbe rendezi, de az egyes blokkoknak továbbra is meg kell felelniük a Notion
  payload-korlátainak.
- Az API egyetlen kérésben legfeljebb két beágyazott szintű blokk-gyermeket fogad el. A mélyebb
  struktúrákat további Append Blocks műveletekkel kell létrehozni.
- A kérés payload-jai legfeljebb 1 000 blokkelemre és összesen 500 KB-ra korlátozottak.

## Lapozás

A Search, a Query Data Source és a Get Block Children egy 1 és 100 közötti lapméretet, valamint egy
opcionális kezdőkurzort fogad el. Állítsa a lapméretet `0`-ra, hogy a kurzorokat automatikusan
kövesse, és az összes találatot összevonja, a csomópont 10 000 találatra vonatkozó biztonsági
korlátjáig.

## Hitelesítési adatok beállítása

A hitelesítési adatok párbeszédpanelén válassza az alábbi beállítások egyikét (**Internal token**
vagy **OAuth**):

- **Internal token:** Hozzon létre egy belső integrációt, másolja a tokenjét a Heymbe, majd ossza meg
  az egyes szükséges oldalakat vagy adatforrásokat az integrációval. A **Test Connection**
  használatával ellenőrizze a hozzáférést.
- **OAuth:** Hozzon létre egy nyilvános Notion integrációt, és regisztrálja a
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` címet a Notionban. A Heym hitelesítési
  adatok párbeszédpanelén válassza az **OAuth** lehetőséget, adja meg az integráció Client ID és
  Client Secret értékeit, majd kattintson a **Connect** gombra egy munkaterület engedélyezéséhez. A
  secret a hitelesítési adatokkal titkosítva tárolódik, és nem kerül az OAuth state-be vagy a
  környezeti konfigurációba. Az engedélyezés után a hitelesítési adatok megjelenítik a csatlakoztatott
  munkaterület nevét (`connected (Workspace Name)`). A függőben lévő OAuth hitelesítési adatok
  `Not connected` állapotot mutatnak.

Ha szerkesztés közben üresen hagyja a belső token mezőt, a tárolt token megmarad.

Egyéni [HTTP](../nodes/http-node.md) kérések esetén a `$credentials.YourNotionCredential` ugyanarra a
bearer tokenre oldódik fel, amelyet a Notion csomópont használ (belső token vagy OAuth access token).

## API verzióval kapcsolatos megjegyzések

A Heym a Notion kéréseket a `2026-03-11` API verzióhoz rögzíti. Ez a verzió a következőket használja:

- `data_source_id` szülők és `/data_sources` endpointok a régi adatbázis-lekérdezési útvonalak helyett
- `in_trash` az `archived` helyett az oldal kukába helyezési/visszaállítási műveleteihez
- `position` objektumok (`start`, `end`, `after_block`) az Append Block Children művelethez

A régebbi Notion automatizálási példák migrálásakor:

- Cserélje le az adatbázis szülőre/lekérdezésre vonatkozó hivatkozásokat a **Retrieve Database**
  műveletből vagy a szerkesztő adatforrás-választójából származó adatforrás-azonosítókra
- Cserélje le az `archived: true` értéket `in_trash: true` értékre
- Cserélje le az append `after` paramétereit a csomópont **Append Position** mezőjére

Azok a keresési szűrők, amelyek továbbra is a `database` objektumértéket használják, automatikusan
`data_source` értékre normalizálódnak.

## Kapcsolódó

- [Hitelesítési adatok](../reference/credentials.md)
- [Külső integrációk](../reference/integrations.md)
- [Csomóponttípusok](../reference/node-types.md)
