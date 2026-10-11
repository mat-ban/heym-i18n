# Notion

**Notion** mezgls pārvalda datubāzes, datu avotus, lapas un blokus, izmantojot Notion API.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Akreditācijas dati | Iekšējais integrācijas token vai Notion OAuth |
| API versija | `2026-03-11` |

Notion datubāzes tipa kolekcijas pašreizējās API versijās izmanto **datu avota ID**. Pirms mezgla
palaišanas kopīgojiet katru lapu vai datu avotu, kas nepieciešams workflow, ar integrāciju.
Resursu lauki pieņem gan neapstrādātu Notion ID, gan pilnu Notion URL. URL tiek normalizēti uz to
iegulto resursa ID pirms API pieprasījuma.

## Darbības

| Darbība | Nepieciešamie lauki | Galvenā izvade |
|-----------|-----------------|-------------|
| Search | Neobligāts query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Lapas ID | `.page` |
| Create Page | Datu avota ID vai vecākās lapas ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Lapas ID, viens no Properties/Icon/Cover | `.page` |
| Move Page to Trash | Lapas ID | `.page` |
| Restore Page | Lapas ID | `.page` |
| Create Database | Datubāzes pieprasījums ar `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Datubāzes ID | `.database` |
| Update Database | Datubāzes ID, ne-tukšs datubāzes pieprasījums | `.database`, `.id`, `.url` |
| Create Data Source | Datu avota pieprasījums ar `parent` un ne-tukšu `properties` | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Datu avots | `.data_source` |
| Update Data Source | Datu avota ID, ne-tukšs datu avota pieprasījums | `.data_source`, `.id`, `.url` |
| Query Data Source | Datu avota ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Bloka vai lapas ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Bloka ID, bloka atjaunināšanas objekts | `.block` |
| Delete Block | Bloka ID | `.block` |
| Append Blocks | Bloka vai lapas ID, Children | `.results`, `.count` |

Visas darbības arī atgriež `.success` un `.operation`.

## JSON lauki

Lauki Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon un Cover pieņem
Notion API JSON. Izteiksmes JSON virknēs tiek atrisinātas pirms pieprasījuma. Lauks var arī
būt viena atsevišķa izteiksme, kas tieši atrisinās uz nepieciešamo objektu vai masīvu, piemēram,
`$input.database`, `$input.properties` vai `$input.children`.

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

Lapas vai bloka saturam Children ir Notion bloku objektu masīvs:

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

## Datubāzes un datu avoti

Pašreizējā Notion API **datubāze** ir konteiners, un **datu avots** satur īpašību
shēmu un vaicājamās rindas. Retrieve Database atgriež datubāzes `data_sources` sarakstu; izmantojiet vienu no
šiem ID ar Retrieve Data Source vai Query Data Source.

Create Database pieņem pilnu pieprasījuma objektu no Notion's Create a database endpoint. Tam
jāsatur `parent` un var saturēt `title`, `description`, `is_inline`,
`initial_data_source`, `icon` un `cover`. Piemēram:

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

Update Database pieņem update endpoint pieprasījuma objektu, tostarp `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` un `is_locked`. Datubāzes ID lauki pieņem
neapstrādātu ID, pilnu Notion URL vai izteiksmi.

Izmantojiet **Retrieve Data Source**, lai iegūtu datu avota `properties` shēmu pirms Create Page properties objekta veidošanas. **Create Data Source** prasa vecākās datubāzes objektu un
ne-tukšu `properties` shēmu. **Update Data Source** pieņem ne-tukšu pieprasījuma objektu, ko atbalsta
attiecīgais Notion endpoint.

Piemēram, izveidojiet datu avotu esošā datubāzē:

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

Datu avota un vecākās lapas atlasītāji atbalsta servera puses meklēšanu ar īsu aizturi un
uz kursoriem balstītu **Load more** lappušu numerāciju. Izmantojiet **Refresh** pēc jauna resursa kopīgošanas Notion. Pārslēdzieties uz **Use expression**, lai ievadītu izteiksmi, neapstrādātu ID vai URL.

Search filtri no vecākām apmācībām, kas izmanto
`{"property":"object","value":"database"}`, tiek pārveidoti uz pašreizējo `data_source` vērtību.
Jauniem workflow jāizmanto `data_source` vai `page` tieši.

Append Blocks atbalsta **Start**, **End** un **After Block** pozīcijas. Create Page un Append
Blocks automātiski sadala vairāk nekā 100 augstākā līmeņa children secīgos pieprasījumos, lai apmierinātu
Notion viena pieprasījuma ierobežojumu.

Pieprasījumi ar ātruma ierobežojumu (`429` vai `529`) tiek atkārtoti līdz trīs reizēm. Heym ievēro Notion
`Retry-After` galveni, ierobežo katru gaidīšanu līdz 10 sekundēm un pievieno nejaušu jitter. Notion pieprasījumi
izmanto koplietotu procesa mēroga HTTP savienojumu kopu starp lapām un workflow mezgliem.
## Notion API ierobežojumi

- Viena rich-text `text.content` vērtība var saturēt ne vairāk kā 2 000 rakstzīmes. Sadaliet garāku tekstu
  vairākos rich-text objektos.
- Notion ierobežo augstākā līmeņa bloka atvasinātos elementus līdz 100 vienā pieprasījumā. Heym apvieno
  lielākus Children masīvus, taču katram atsevišķam blokam joprojām ir jāatbilst Notion payload ierobežojumiem.
- API vienā pieprasījumā pieņem ne vairāk kā divus ligzdotos bloka atvasināto elementu līmeņus. Dziļākas
  struktūras veidojiet ar turpmākām Append Blocks operācijām.
- Pieprasījuma payload ir ierobežots līdz 1 000 bloka elementiem un 500 KB kopumā.

## Lapošana

Search, Query Data Source un Get Block Children pieņem lapas izmēru no 1 līdz 100 un neobligātu
sākuma kursoru. Iestatiet lapas izmēru uz `0`, lai automātiski sekotu kursoriem un apvienotu visus rezultātus,
līdz mezgla 10 000 rezultātu drošības ierobežojumam.

## Akreditācijas datu iestatīšana

Akreditācijas datu dialogā izvēlieties vienu no iestatīšanas veidiem (**Internal token** vai **OAuth**):

- **Internal token:** Izveidojiet iekšējo integrāciju, nokopējiet tās token uz Heym, pēc tam kopīgojiet katru
  nepieciešamo lapu vai datu avotu ar integrāciju. Izmantojiet **Test Connection**, lai pārbaudītu piekļuvi.
- **OAuth:** Izveidojiet publisku Notion integrāciju un reģistrējiet
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` Notion. Heym akreditācijas datu dialogā
  izvēlieties **OAuth**, ievadiet integrācijas Client ID un Client Secret, pēc tam noklikšķiniet uz **Connect**, lai
  autorizētu darbvietu. Secret tiek glabāts šifrēts kopā ar akreditācijas datiem un netiek ievietots
  OAuth state vai vides konfigurācijā. Pēc autorizācijas akreditācijas dati parāda
  pievienotās darbvietas nosaukumu (`connected (Workspace Name)`). Gaidošie OAuth akreditācijas dati parāda
  `Not connected`.

Atstājot iekšējā token lauku tukšu rediģēšanas laikā, saglabājas saglabātais token.

Pielāgotiem [HTTP](../nodes/http-node.md) pieprasījumiem `$credentials.YourNotionCredential` tiek atrisināts uz
to pašu bearer token, ko izmanto Notion mezgls (iekšējais token vai OAuth piekļuves token).

## API versijas piezīmes

Heym piesaista Notion pieprasījumus API versijai `2026-03-11`. Šī versija izmanto:

- `data_source_id` vecākus un `/data_sources` endpoint vietā legacy datubāzes vaicājuma ceļiem
- `in_trash` vietā `archived` lapas trash/restore operācijām
- `position` objektus (`start`, `end`, `after_block`) Append Block Children

Migrējot vecākus Notion automatizācijas piemērus:

- Aizstājiet datubāzes vecāku/vaicājuma atsauces ar datu avota ID no **Retrieve Database** vai
  redaktora datu avota atlasītāja
- Aizstājiet `archived: true` ar `in_trash: true`
- Aizstājiet append `after` parametrus ar mezgla **Append Position** lauku

Meklēšanas filtri, kas joprojām izmanto objekta vērtību `database`, tiek automātiski normalizēti uz `data_source`.

## Saistītie

- [Akreditācijas dati](../reference/credentials.md)
- [Trešo pušu integrācijas](../reference/integrations.md)
- [Mezglu tipi](../reference/node-types.md)
