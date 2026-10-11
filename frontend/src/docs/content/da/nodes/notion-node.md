# Notion

**Notion**-noden håndterer databaser, datakilder, sider og blokke via Notion-API'en.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Legitimationsoplysninger | Intern integrationstoken eller Notion OAuth |
| API-version | `2026-03-11` |

Notion-databasesamlinger bruger **datakilde-ID'er** i de nuværende API-versioner. Det er nødvendigt at dele hver side eller datakilde, som workflowet skal have adgang til, med integrationen før kørsel af noden.
Resurcafelter accepterer enten en rå Notion-ID eller en fuld Notion-URL. URL'er normaliseres til deres indlejrede ressource-ID før API-anmodningen.

## Operationer

| Operation | Påkrævede felter | Primær output |
|-----------|-----------------|-------------|
| Søg | Valgfri forespørgsel/filter/sortering | `.results`, `.count`, `.next_cursor` |
| Hent side | Side-ID | `.page` |
| Opret side | Datakilde-ID eller overordnet side-ID, Egenskaber | `.page`, `.id`, `.url` |
| Opdater side | Side-ID, en af Egenskaber/Ikon/Forside | `.page` |
| Flyt side til papirkurv | Side-ID | `.page` |
| Gendan side | Side-ID | `.page` |
| Opret database | Databaseanmodning med `parent` | `.database`, `.id`, `.url` |
| Hent database | Database-ID | `.database` |
| Opdater database | Database-ID, ikke-tom databaseanmodning | `.database`, `.id`, `.url` |
| Opret datakilde | Datakildeanmodning med `parent` og ikke-tomme `properties` | `.data_source`, `.id`, `.url` |
| Hent datakilde | Datakilde | `.data_source` |
| Opdater datakilde | Datakilde-ID, ikke-tom datakildeanmodning | `.data_source`, `.id`, `.url` |
| Forespørg datakilde | Datakilde-ID | `.results`, `.count`, `.next_cursor` |
| Hent blokbørn | Blok- eller side-ID | `.results`, `.count`, `.next_cursor` |
| Opdater blok | Blok-ID, blokopdateringsobjekt | `.block` |
| Slet blok | Blok-ID | `.block` |
| Tilføj blokke | Blok- eller side-ID, Børn | `.results`, `.count` |

Alle operationer returnerer også `.success` og `.operation`.

## JSON-felter

Databaseanmodning, Datakildeanmodning, Egenskaber, Børn, Filter, Sortering, Sorteringer, Ikon og Forside-felter accepterer Notion API JSON. Udtryk inden i JSON-strenge løses før anmodningen. Et felt kan også være et enkeltstående udtryk, der løses direkte til det påkrævede objekt eller array, såsom `$input.database`, `$input.properties` eller `$input.children`.

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

For side- eller blokindhold er Børn et array af Notion-blokobjekter:

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

## Databaser og datakilder

I den nuværende Notion-API er en **database** en container, og en **datakilde** indeholder egenskabsskemaet og forespørgselsbare rækker. Hent Database returnerer databasens `data_sources`-liste; brug en af disse ID'er med Hent Datakilde eller Forespørg Datakilde.

Opret Database accepterer det komplette anmodningsobjekt fra Notions Opret en database-endepunkt. Det skal indeholde `parent` og kan indeholde `title`, `description`, `is_inline`, `initial_data_source`, `icon` og `cover`. For eksempel:

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
        "content": "Opgaver"
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

Opdater Database accepterer opdateringsendepunktets anmodningsobjekt, herunder `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` og `is_locked`. Database-ID-felter accepterer en rå ID, fuld Notion-URL eller udtryk.

Brug **Hent Datakilde** for at hente datakildens `properties`-skema før opbygning af et Opret Side-egenskaber-objekt. **Opret Datakilde** kræver et overordnet databaseobjekt og et ikke-tomt `properties`-skema. **Opdater Datakilde** accepterer et ikke-tomt anmodningsobjekt understøttet af det tilsvarende Notion-endepunkt.

For eksempel, opret en datakilde i en eksisterende database:

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

Datakilde- og Overordnet Side-vælgere understøtter serverside-søgning med en kort debounce og markørbaseret **Indlæs flere**-paginering. Brug **Opdater** efter deling af en ny ressource i Notion. Skift til **Brug udtryk** for at indtaste et udtryk, rå ID eller URL.

Søgefilter fra ældre tutorials, der bruger `{"property":"object","value":"database"}`, oversættes til den nuværende `data_source`-værdi. Nye workflows bør bruge `data_source` eller `page` direkte.

Tilføj Blokke understøtter **Start**, **Slut** og **Efter blok**-positioner. Opret Side og Tilføj Blokke deler automatisk mere end 100 topniveau-børn i ordnede anmodninger for at overholde Notions grænse pr. anmodning.

Ratelimiterede anmodninger (`429` eller `529`) forsøges op til tre gange. Heym overholder Notions `Retry-After`-header, begrænser hver ventetid til 10 sekunder og tilføjer tilfældig jitter. Notion-anmodninger deler en procesbred HTTP-forbindelsespul på tværs af sider og workflow-noder.
## Notion API-begrænsninger

- En enkelt `text.content`-værdi i rich-text kan højst indeholde 2.000 tegn. Længere tekst skal opdeles i flere rich-text-objekter.
- Notion begrænser topniveau-blokbørn til 100 per anmodning. Heym grupperer større Children-arrays, men hver enkelt blok skal stadig opfylde Notions payload-begrænsninger.
- API'en accepterer højst to indlejrede niveauer af blokbørn i en anmodning. Dybere strukturer skal oprettes med efterfølgende Append Blocks-operationer.
- Anmodnings-payloads er begrænset til 1.000 blokelementer og 500 KB samlet.

## Paginering

Search, Query Data Source og Get Block Children accepterer en sidestørrelse fra 1 til 100 samt en valgfri startcursor. Angiv sidestørrelse til `0` for automatisk at følge cursors og flette alle resultater, op til nodens sikkerhedsgrænse på 10.000 resultater.

## Opsætning af legitimationsoplysninger

Vælg en af følgende opsætningsmetoder i legitimationsdialogen (**Internal token** eller **OAuth**):

- **Internal token:** Opret en intern integration, kopier dens token ind i Heym, og del derefter hver påkrævet side eller datakilde med integrationen. Brug **Test Connection** for at verificere adgang.
- **OAuth:** Opret en offentlig Notion-integration og registrer `{FRONTEND_URL}/api/credentials/notion/oauth/callback` i Notion. I Heyms legitimationsdialog vælges **OAuth**, hvorpå integrationens Client ID og Client Secret indtastes. Klik **Connect** for at godkende et arbejdsområde. Secret gemmes krypteret med legitimationsoplysningerne og placeres ikke i OAuth-tilstand eller miljøkonfiguration. Efter godkendelse viser legitimationsoplysningen det tilsluttede arbejdsområdenavn (`connected (Workspace Name)`). Afventende OAuth-legitimationsoplysninger viser `Not connected`.

Hvis det interne token-felt efterlades tomt under redigering, bevares det gemte token.

Til brugerdefinerede [HTTP](../nodes/http-node.md)-anmodninger vil `$credentials.YourNotionCredential` oversættes til samme bearer-token som Notion-noden bruger (internt token eller OAuth access token).

## API-versionnoter

Heym fastlåser Notion-anmodninger til API-version `2026-03-11`. Denne version bruger:

- `data_source_id`-forældre og `/data_sources`-endepunkter i stedet for forældede databaseforespørgselsstier
- `in_trash` i stedet for `archived` til sidepapirkurvs-/gendannelsesoperationer
- `position`-objekter (`start`, `end`, `after_block`) til Append Block Children

Ved migrering af ældre Notion-automatiseringseksempler:

- Erstat databaseforælder/forespørgselsreferencer med datakilde-ID'er fra **Retrieve Database** eller editorens datakildevælger
- Erstat `archived: true` med `in_trash: true`
- Erstat append-`after`-parametre med nodens **Append Position**-felt

Søgefiltre, der stadig bruger objektværdien `database`, normaliseres automatisk til `data_source`.

## Relateret

- [Legitimationsoplysninger](../reference/credentials.md)
- [Tredjepartsintegrationer](../reference/integrations.md)
- [Nodetyper](../reference/node-types.md)
