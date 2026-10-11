# Crawler

**Crawler** node kogub veebilehti, kasutades FlareSolverri, valikulise HTML-i ekstraktimisega CSS-selektorite kaudu. Kasutage seda veebi kraapimiseks ja sisu ekstraktimiseks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.body` (HTML või ekstraktitud sisu) |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | FlareSolverri mandaat jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | Kraabitav URL (toetab avaldisi) |
| `crawlerWaitSeconds` | number | Ootamise aeg sekundites enne kraapimist (vaikeväärtus: 0) |
| `crawlerMaxTimeout` | number | Maksimaalne ajalõpp millisekundites (vaikeväärtus: 60000) |
| `crawlerMode` | string | `"basic"` või muud režiimid |
| `crawlerSelectors` | array | CSS-selektorid ekstraktimiseks. Igaüks: `{ selector, attribute? }` |

## Näide

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## Väljuvliikluse turvalisus

- Mandaadis salvestatud FlareSolverri URL peab kasutama `http://` või `https://` ning ei tohi laheneda link-local ega pilve-metadata aadressile. Keelatud hulk on `169.254.0.0/16`, `fe80::/10`, Alibaba Cloudi ja AWS-i IPv6 metadata aadressid ning IPv6 üleminekuvormid, mis võivad üht neist kanda. See on nimekiri teadaolevatest endpoint'idest, mitte garantii iga teenusepakkuja kohta.
- Loopback- ja privaataadressid on lubatud meelega, et dokumenteeritud `http://localhost:8191` seadistus ja compose'i teenusenimed nagu `http://flaresolverr:8191` jätkaksid töötamist. Selle tagajärg on, et seda välja saab suunata ka mis tahes muule teenusele, millele backend nendel aadressitel ligi pääseb, ning vastus tuleb tagasi node'i väljundis. Mandaadi jagamine ei hoia seda ära: iga sisselogitud kasutaja saab luua oma FlareSolverri mandaadi, seega olemasoleva mandaadi tagasihoidmine ei muuda midagi. Kehtivad kontrollid on usaldus nende inimeste vastu, kes saavad workflow'sid koostada, ning võrgureeglid, mis piiravad, millele backend ligi pääseb.
- Heym kinnitab lahendatud aadressi enne ühendamist, seega DNS-vastus ei saa pärast kontrolli päringut metadata-aadressile ümber suunata. Keskkonna proxy'd on valvuri aktiivsel ajal keelatud ning ümbersuunamisi ei järgita.
- Leht, mille FlareSolverr seejärel teie eest hangib, on eraldi hüpe, mille FlareSolverr ise lahendab. Heym ei kontrolli seda, seega FlareSolverri konteineri ühenduste piiramine kuulub teie võrgupoliitika alla.
- Usaldusväärsed isemajutatud juurutused saavad metadata-reegli tühistada valikuga `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Hoidke vaikeväärtus hostitud või mitme rentniku juurutustel.

## Seotud

- [Node'i tüübid](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Playwright Node](./playwright-node.md) – Brauseri automatiseerimise alternatiiv
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – FlareSolverri mandaadi lisamine
