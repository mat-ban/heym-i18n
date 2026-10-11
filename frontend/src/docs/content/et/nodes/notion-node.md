# Notion

**Notion** node haldab andmebaase, andmeallikaid, lehti ja plokke Notioni API kaudu.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Mandaat | Sisemine integratsiooni token või Notioni OAuth |
| API versioon | `2026-03-11` |

Notioni andmebaasilaadsed kogumid kasutavad praegustes API versioonides **andmeallika ID-sid**. Jagage iga lehte
või andmeallikat, mida workflow vajab, integratsiooniga enne node'i käivitamist.
Ressursi väljad aktsepteerivad kas toorat Notioni ID-d või täielikku Notioni URL-i. URL-id normaliseeritakse nende
sisseehitatud ressursi ID-ks enne API päringut.

## Toimingud

| Toiming | Nõutavad väljad | Peamine väljund |
|-----------|-----------------|-------------|
| Search | Valikuline query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID või Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, üks järgnevatest: Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Database request koos `parent`-iga | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, mitte-tühi database request | `.database`, `.id`, `.url` |
| Create Data Source | Data source request koos `parent`-i ja mitte-tühja `properties`-iga | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, mitte-tühi data source request | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block või Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, block update objekt | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block või Page ID, Children | `.results`, `.count` |

Kõik toimingud tagastavad ka `.success` ja `.operation`.

## JSON väljad

Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon ja Cover väljad aktsepteerivad
Notioni API JSON-i. Avaldised JSON-stringide sees lahendatakse enne päringut. Väli võib olla ka
üksik avaldis, mis lahendub otse nõutavaks objektiks või massiiviks, näiteks
`$input.database`, `$input.properties` või `$input.children`.

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

Lehe või ploki sisu jaoks on Children Notioni plokiobjektide massiiv:

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

## Andmebaasid ja andmeallikad

Praeguses Notioni API-s on **andmebaas** konteiner ja **andmeallikas** hoiab omaduste
skeemi ja päritavaid ridu. Retrieve Database tagastab andmebaasi `data_sources` nimekirja; kasutage ühte
neist ID-dest Retrieve Data Source või Query Data Source'iga.

Create Database aktsepteerib täielikku päringuobjekti Notioni Create a database endpoint'ist. See
peab sisaldama `parent`-i ja võib sisaldada `title`, `description`, `is_inline`,
`initial_data_source`, `icon` ja `cover`. Näiteks:

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

Update Database aktsepteerib update endpoint'i päringuobjekti, sealhulgas `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` ja `is_locked`. Database ID väljad aktsepteerivad
toorat ID-d, täielikku Notioni URL-i või avaldist.

Kasutage **Retrieve Data Source**-i, et hankida andmeallika `properties` skeem enne Create Page properties objekti koostamist. **Create Data Source** nõuab parent database objekti ja
mitte-tühja `properties` skeemi. **Update Data Source** aktsepteerib mitte-tühja päringuobjekti, mida vastav Notioni endpoint toetab.

Näiteks looge andmeallikas olemasoleva andmebaasi sees:

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

Data Source ja Parent Page valijad toetavad serveripoolset otsingut lühikese debounce'i ja
kursoripõhise **Load more** lehekülgedeks jaotusega. Kasutage **Refresh**-i pärast uue ressursi jagamist Notionis.
Lülituge **Use expression**-ile, et sisestada avaldis, tooras ID või URL.

Otsingufiltrid vanematest õpetustest, mis kasutavad
`{"property":"object","value":"database"}`, tõlgitakse praeguseks `data_source` väärtuseks.
Uued workflow'd peaksid kasutama otse `data_source` või `page`.

Append Blocks toetab **Start**, **End** ja **After Block** positsioone. Create Page ja Append
Blocks jagavad automaatselt rohkem kui 100 ülemise tasandi child'i järjestatud päringuteks, et rahuldada
Notioni päringupõhist limiiti.

Kiiruspiiranguga päringud (`429` või `529`) proovitakse uuesti kuni kolm korda. Heym austab Notioni
`Retry-After` päist, piirab iga ootamise 10 sekundiga ja lisab juhusliku jitteri. Notioni päringud
jagavad protsessiülest HTTP ühenduste pooli lehtede ja workflow node'ide vahel.
## Notioni API piirangud

- Üksik rich-text `text.content` väärtus võib sisaldada kõige rohkem 2000 tähemärki. Tükeldage pikem tekst mitmeks rich-text objektiks.
- Notion piirab ülemise taseme ploki alam-elemente 100-ga päringu kohta. Heym koondab suuremad Children massiivid partiidesse, kuid iga üksik plokk peab siiski vastama Notioni payload'i piirangutele.
- API võtab ühes päringus vastu kõige rohkem kaks pesastatud ploki alam-elementide taset. Sügavamad struktuurid looge järgnevate Append Blocks operatsioonidega.
- Päringu payload'id on piiratud 1000 plokielemendi ja üldiselt 500 KB-ga.

## Lehekülgede kaupa liigendamine

Search, Query Data Source ja Get Block Children võtavad vastu lehekülje suuruse vahemikus 1 kuni 100 ning valikulise alguskursori. Määrake lehekülje suuruseks `0`, et järgida kursoreid automaatselt ja ühendada kõik tulemused, kuni sõlme 10 000 tulemuse turvapiirini.

## Mandaadi seadistamine

Valige mandaadi dialoogis üks kahest seadistusest (**Internal token** või **OAuth**):

- **Internal token:** Looge sisemine integratsioon, kopeerige selle token Heymi, seejärel jagage iga vajalikku lehekülge või andmeallikat integratsiooniga. Kasutage **Test Connection**, et juurdepääsu kontrollida.
- **OAuth:** Looge avalik Notioni integratsioon ja registreerige Notionis `{FRONTEND_URL}/api/credentials/notion/oauth/callback`. Heymi mandaadi dialoogis valige **OAuth**, sisestage integratsiooni Client ID ja Client Secret, seejärel klõpsake **Connect**, et tööruum autoriseerida. Secret salvestatakse krüpteeritult koos mandaadiga ega paigutata OAuth state'i ega keskkonna konfiguratsiooni. Pärast autoriseerimist kuvab mandaat ühendatud tööruumi nime (`connected (Workspace Name)`). Ootel OAuth mandaadid kuvavad `Not connected`.

Sisemise tokeni välja tühjaks jätmine redigeerimise ajal säilitab salvestatud tokeni.

Kohandatud [HTTP](../nodes/http-node.md) päringute puhul laheneb `$credentials.YourNotionCredential` samale bearer-tokenile, mida Notioni sõlm kasutab (sisemine token või OAuth juurdepääsutoken).

## API versiooni märkused

Heym kinnitab Notioni päringud API versioonile `2026-03-11`. See versioon kasutab:

- `data_source_id` vanemaid ja `/data_sources` endpoint'e pärandandmebaasi-päringute teede asemel
- `in_trash` `archived` asemel lehekülgede prügikasti/taastamise operatsioonide jaoks
- `position` objekte (`start`, `end`, `after_block`) Append Block Children jaoks

Vanemate Notioni automatiseerimise näidete migreerimisel:

- Asendage andmebaasi vanema/päringu viited andmeallika ID-dega, mis pärinevad **Retrieve Database**-ist või redaktori andmeallika valijast
- Asendage `archived: true` väärtusega `in_trash: true`
- Asendage append `after` parameetrid sõlme **Append Position** väljaga

Otsingufiltrid, mis kasutavad endiselt objekti väärtust `database`, normaliseeritakse automaatselt väärtuseks `data_source`.

## Seotud

- [Mandaadid](../reference/credentials.md)
- [Kolmandate osapoolte integratsioonid](../reference/integrations.md)
- [Sõlmetüübid](../reference/node-types.md)
