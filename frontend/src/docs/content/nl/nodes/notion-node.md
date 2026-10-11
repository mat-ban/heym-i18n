# Notion

De **Notion**-node beheert databases, databronnen, pagina's en blokken via de Notion API.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Referentie | Interne integratietoken of Notion OAuth |
| API-versie | `2026-03-11` |

Notion-collecties in databasestijl gebruiken **databron-ID's** in de huidige API-versies. Deel elke pagina
of databron die de workflow nodig heeft met de integratie voordat u de node uitvoert.
Resourcevelden accepteren zowel een onbewerkte Notion-ID als een volledige Notion-URL. URL's worden
genormaliseerd naar hun ingesloten resource-ID voordat het API-verzoek wordt gedaan.

## Bewerkingen

| Bewerking | Verplichte velden | Belangrijkste uitvoer |
|-----------|-----------------|-------------|
| Search | Optionele query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Pagina-ID | `.page` |
| Create Page | Databron-ID of bovenliggende pagina-ID, eigenschappen | `.page`, `.id`, `.url` |
| Update Page | Pagina-ID, een van Eigenschappen/Pictogram/Omslag | `.page` |
| Move Page to Trash | Pagina-ID | `.page` |
| Restore Page | Pagina-ID | `.page` |
| Create Database | Databaseverzoek met `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database-ID | `.database` |
| Update Database | Database-ID, niet-lege databaseverzoek | `.database`, `.id`, `.url` |
| Create Data Source | Databronverzoek met `parent` en niet-lege `properties` | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Databron | `.data_source` |
| Update Data Source | Databron-ID, niet-leeg databronverzoek | `.data_source`, `.id`, `.url` |
| Query Data Source | Databron-ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Blok- of pagina-ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Blok-ID, blokupdate-object | `.block` |
| Delete Block | Blok-ID | `.block` |
| Append Blocks | Blok- of pagina-ID, Children | `.results`, `.count` |

Alle bewerkingen retourneren ook `.success` en `.operation`.

## JSON-velden

De velden Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon en Cover accepteren
Notion API JSON. Expressies binnen JSON-strings worden opgelost vóór het verzoek. Een veld kan ook
één zelfstandige expressie zijn die direct wordt omgezet naar het vereiste object of de vereiste array, zoals
`$input.database`, `$input.properties` of `$input.children`.

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

Voor pagina- of blokinhoud is Children een array van Notion-blokobjecten:

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

## Databases en databronnen

In de huidige Notion API is een **database** een container en bevat een **databron** het eigenschapsschema
en de opvraagbare rijen. Retrieve Database retourneert de `data_sources`-lijst van de database; gebruik een van
die ID's met Retrieve Data Source of Query Data Source.

Create Database accepteert het volledige verzoekobject van Notion's Create a database-endpoint. Het
moet `parent` bevatten en mag `title`, `description`, `is_inline`,
`initial_data_source`, `icon` en `cover` bevatten. Bijvoorbeeld:

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

Update Database accepteert het verzoekobject van het update-endpoint, inclusief `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` en `is_locked`. Database-ID-velden accepteren
een onbewerkte ID, volledige Notion-URL of expressie.

Gebruik **Retrieve Data Source** om het `properties`-schema van de databron op te halen voordat u een
Create Page-eigenschappenobject samenstelt. **Create Data Source** vereist een bovenliggend databaseobject en een
niet-leeg `properties`-schema. **Update Data Source** accepteert een niet-leeg verzoekobject dat wordt ondersteund
door het bijbehorende Notion-endpoint.

Bijvoorbeeld, maak een databron aan binnen een bestaande database:

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

De selectors Data Source en Parent Page ondersteunen server-side zoeken met een korte debounce en
cursor-gebaseerde **Load more**-paginering. Gebruik **Refresh** nadat u een nieuwe resource in Notion heeft gedeeld.
Schakel over naar **Use expression** om een expressie, onbewerkte ID of URL in te voeren.

Zoekfilters uit oudere tutorials die
`{"property":"object","value":"database"}` gebruiken, worden omgezet naar de huidige `data_source`-waarde.
Nieuwe workflows dienen `data_source` of `page` rechtstreeks te gebruiken.

Append Blocks ondersteunt de posities **Start**, **End** en **After Block**. Create Page en Append
Blocks splitsen automatisch meer dan 100 top-level children in geordende verzoeken om te voldoen aan
Notion's limiet per verzoek.

Verzoeken met snelheidsbeperking (`429` of `529`) worden tot drie keer opnieuw geprobeerd. Heym respecteert Notion's
`Retry-After`-header, beperkt elke wachttijd tot 10 seconden en voegt gerandomiseerde jitter toe. Notion-verzoeken
delen een procesbrede HTTP-verbindingspool over pagina's en workflow-nodes.
## Notion API-limieten

- Een enkele rich-text `text.content`-waarde kan maximaal 2.000 tekens bevatten. Splits langere tekst
  in meerdere rich-text-objecten.
- Notion beperkt het aantal onderliggende blokken op het hoogste niveau tot 100 per verzoek. Heym
  batched grotere Children-arrays, maar elk afzonderlijk blok moet nog steeds voldoen aan de
  payload-limieten van Notion.
- De API accepteert maximaal twee geneste niveaus van onderliggende blokken in één verzoek. Creëer
  diepere structuren met vervolgoperaties voor Append Blocks.
- Verzoek-payloads zijn beperkt tot 1.000 blokelementen en 500 KB in totaal.

## Paginering

Search, Query Data Source en Get Block Children accepteren een paginagrootte van 1 tot 100 en een
optionele startcursor. Stel de paginagrootte in op `0` om cursors automatisch te volgen en alle
resultaten samen te voegen, tot de veiligheidslimiet van 10.000 resultaten van de node.

## Referentie-instelling

Kies een van beide instellingen in het referentiedialoogvenster (**Internal token** of **OAuth**):

- **Internal token:** Maak een interne integratie aan, kopieer het token naar Heym en deel
  vervolgens elke vereiste pagina of gegevensbron met de integratie. Gebruik **Test Connection** om
  de toegang te verifiëren.
- **OAuth:** Maak een openbare Notion-integratie aan en registreer
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` in Notion. Kies in het
  Heym-referentiedialoogvenster **OAuth**, voer de Client ID en Client Secret van de integratie in
  en klik op **Connect** om een workspace te autoriseren. Het secret wordt versleuteld opgeslagen
  bij de referentie en wordt niet opgenomen in de OAuth-state of omgevingsconfiguratie. Na
  autorisatie toont de referentie de naam van de verbonden workspace (`connected (Workspace Name)`).
  Referenties waarvoor OAuth nog in behandeling is, tonen `Not connected`.

Als het veld voor het interne token leeg blijft tijdens het bewerken, blijft het opgeslagen token
behouden.

Voor aangepaste [HTTP](../nodes/http-node.md)-verzoeken verwijst
`$credentials.YourNotionCredential` naar hetzelfde bearer-token dat de Notion-node gebruikt
(internal token of OAuth access token).

## Opmerkingen over de API-versie

Heym pint Notion-verzoeken vast op API-versie `2026-03-11`. Deze versie gebruikt:

- `data_source_id`-parents en `/data_sources`-endpoints in plaats van verouderde
  database-querypaden
- `in_trash` in plaats van `archived` voor het verplaatsen naar de prullenbak en het herstellen van
  pagina's
- `position`-objecten (`start`, `end`, `after_block`) voor Append Block Children

Bij het migreren van oudere Notion-automatiseringsvoorbeelden:

- Vervang database-parent- en queryverwijzingen door data source-ID's uit **Retrieve Database** of
  de data source-kiezer in de editor
- Vervang `archived: true` door `in_trash: true`
- Vervang `after`-parameters voor toevoegen door het veld **Append Position** van de node

Zoekfilters die nog steeds de objectwaarde `database` gebruiken, worden automatisch genormaliseerd
naar `data_source`.

## Gerelateerd

- [Referenties](../reference/credentials.md)
- [Integraties van derden](../reference/integrations.md)
- [Node-typen](../reference/node-types.md)
