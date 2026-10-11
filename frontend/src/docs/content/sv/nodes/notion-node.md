# Notion

**Notion**-noden hanterar databaser, datakällor, sidor och block via Notion API.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Autentiseringsuppgifter | Intern integrationstoken eller Notion OAuth |
| API-version | `2026-03-11` |

Notion-samlingar av databastyp använder **datakälls-ID:n** i aktuella API-versioner. Dela varje sida
eller datakälla som workflowet behöver med integrationen innan noden körs.
Resursfält accepterar antingen ett råformat Notion-ID eller en fullständig Notion-URL. URL:er
normaliseras till sitt inbäddade resurs-ID före API-anropet.

## Operationer

| Operation | Obligatoriska fält | Huvudsaklig utdata |
|-----------|--------------------|---------------------|
| Search | Valfri query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID eller Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, ett av Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Database request med `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, icke-tom database request | `.database`, `.id`, `.url` |
| Create Data Source | Data source request med `parent` och icke-tom `properties` | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, icke-tom data source request | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block- eller Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, block update-objekt | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block- eller Page ID, Children | `.results`, `.count` |

Alla operationer returnerar även `.success` och `.operation`.

## JSON-fält

Fälten Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon och Cover accepterar
Notion API JSON. Uttryck inuti JSON-strängar löses upp före anropet. Ett fält kan även
vara ett fristående uttryck som direkt löses upp till det obligatoriska objektet eller arrayen, såsom
`$input.database`, `$input.properties` eller `$input.children`.

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

För sid- eller blockinnehåll är Children en array av Notion-blockobjekt:

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

## Databaser och datakällor

I aktuell Notion API är en **databas** en behållare och en **datakälla** håller egenskapsschemat
och de frågbara raderna. Retrieve Database returnerar databasens `data_sources`-lista; använd ett av
dessa ID:n med Retrieve Data Source eller Query Data Source.

Create Database accepterar det fullständiga request-objektet från Notions Create a database-endpoint. Det
måste innehålla `parent` och kan innehålla `title`, `description`, `is_inline`,
`initial_data_source`, `icon` och `cover`. Till exempel:

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

Update Database accepterar update-endpointens request-objekt, inklusive `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` och `is_locked`. Fält för Database ID accepterar
ett råformat ID, en fullständig Notion-URL eller ett uttryck.

Använd **Retrieve Data Source** för att hämta datakällans `properties`-schema innan ett
Create Page properties-objekt byggs. **Create Data Source** kräver ett parent database-objekt och ett
icke-tomt `properties`-schema. **Update Data Source** accepterar ett icke-tomt request-objekt som stöds
av motsvarande Notion-endpoint.

Till exempel, skapa en datakälla inuti en befintlig databas:

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

Väljarna Data Source och Parent Page stöder sökning på serversidan med en kort debounce och
cursor-baserad **Load more**-paginering. Använd **Refresh** efter att en ny resurs har delats i Notion.
Byt till **Use expression** för att ange ett uttryck, ett råformat ID eller en URL.

Sökfilter från äldre guider som använder
`{"property":"object","value":"database"}` översätts till det aktuella värdet `data_source`.
Nya workflows bör använda `data_source` eller `page` direkt.

Append Blocks stöder positionerna **Start**, **End** och **After Block**. Create Page och Append
Blocks delar automatiskt upp fler än 100 toppnivåbarn i ordnade anrop för att uppfylla
Notions gräns per anrop.

Begäranden med hastighetsbegränsning (`429` eller `529`) görs om upp till tre gånger. Heym respekterar Notions
`Retry-After`-header, begränsar varje väntetid till 10 sekunder och lägger till slumpmässig jitter. Notion-begäranden
delar en processomfattande HTTP-anslutningspool över sidor och workflow-noder.
## Notion API-begränsningar

- Ett enskilt rich-text-värde för `text.content` kan innehålla högst 2 000 tecken. Längre text
  delas upp i flera rich-text-objekt.
- Notion begränsar antalet underordnade block på toppnivå till 100 per begäran. Heym batchar större
  Children-arrayer, men varje enskilt block måste fortfarande uppfylla Notions payload-begränsningar.
- API:et accepterar högst två nästlade nivåer av underordnade block i en begäran. Djupare
  strukturer skapas med efterföljande Append Blocks-operationer.
- Begärans payloads är begränsade till 1 000 blockelement och 500 KB totalt.

## Paginering

Search, Query Data Source och Get Block Children accepterar en sidstorlek från 1 till 100 samt en
valfri startmarkör. Ange sidstorleken till `0` för att följa markörer automatiskt och slå samman
alla resultat, upp till nodens säkerhetsgräns på 10 000 resultat.

## Konfiguration av autentiseringsuppgifter

Välj någon av följande konfigurationer i dialogrutan för autentiseringsuppgifter (**Internal
token** eller **OAuth**):

- **Internal token:** Skapa en intern integration, kopiera dess token till Heym och dela sedan varje
  nödvändig sida eller datakälla med integrationen. Använd **Test Connection** för att verifiera
  åtkomsten.
- **OAuth:** Skapa en publik Notion-integration och registrera
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` i Notion. I Heyms dialogruta för
  autentiseringsuppgifter väljs **OAuth**, integrationens Client ID och Client Secret anges, och
  därefter klickas **Connect** för att auktorisera en arbetsyta. Hemligheten lagras krypterad
  tillsammans med autentiseringsuppgiften och placeras inte i OAuth-state eller
  miljökonfiguration. Efter auktorisering visar autentiseringsuppgiften namnet på den anslutna
  arbetsytan (`connected (Workspace Name)`). Väntande OAuth-autentiseringsuppgifter visar
  `Not connected`.

Om fältet för intern token lämnas tomt vid redigering bevaras den lagrade token.

För anpassade [HTTP](../nodes/http-node.md)-begäranden matchar `$credentials.YourNotionCredential`
samma bearer-token som Notion-noden använder (intern token eller OAuth-åtkomsttoken).

## Anteckningar om API-version

Heym låser Notion-begäranden till API-version `2026-03-11`. Denna version använder:

- `data_source_id`-föräldrar och `/data_sources`-endpoints i stället för äldre sökvägar för
  databasfrågor
- `in_trash` i stället för `archived` för operationer för att flytta sidor till papperskorgen eller
  återställa dem
- `position`-objekt (`start`, `end`, `after_block`) för Append Block Children

Vid migrering av äldre Notion-automatiseringsexempel:

- Ersätt referenser till databasförälder/databasfråga med datakällans ID från **Retrieve Database**
  eller redigerarens datakällväljare
- Ersätt `archived: true` med `in_trash: true`
- Ersätt tilläggsparametern `after` med nodens fält **Append Position**

Sökfilter som fortfarande använder objektvärdet `database` normaliseras automatiskt till
`data_source`.

## Relaterat

- [Autentiseringsuppgifter](../reference/credentials.md)
- [Tredjepartsintegrationer](../reference/integrations.md)
- [Nodtyper](../reference/node-types.md)
