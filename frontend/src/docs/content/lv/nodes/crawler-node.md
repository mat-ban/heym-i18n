# Crawler

**Crawler** mezgls iegūst tīmekļa lapu saturu, izmantojot FlareSolverr, ar papildu HTML izvilkšanas iespēju, izmantojot CSS selektorus. Izmantojiet to tīmekļa skrāpēšanai un satura izvilkšanai.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.body` (HTML vai izvilktais saturs) |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | FlareSolverr akreditācijas dati no [Akreditācijas dati](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | Skrāpējamais URL (atbalsta izteiksmes) |
| `crawlerWaitSeconds` | number | Sekundes, cik gaidīt pirms skrāpēšanas (noklusējums: 0) |
| `crawlerMaxTimeout` | number | Maksimālais noildze ms (noklusējums: 60000) |
| `crawlerMode` | string | `"basic"` vai citi režīmi |
| `crawlerSelectors` | array | CSS selektori izvilkšanai. Katrs: `{ selector, attribute? }` |

## Piemērs

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

## Izejas drošība

- Akreditācijas datos saglabātajam FlareSolverr URL ir jāizmanto `http://` vai `https://`, un tas nedrīkst atrisināties uz link-local vai cloud-metadata adresi. Noraidīto adrešu kopa ir `169.254.0.0/16`, `fe80::/10`, Alibaba Cloud un AWS IPv6 metadata adreses, kā arī IPv6 pārejas formas, kas var saturēt kādu no tām. Tas ir zināmo endpoint saraksts, nevis garantija par katru pakalpojumu sniedzēju.
- Loopback un privātās adreses ir atļautas apzināti, lai dokumentētais `http://localhost:8191` iestatījums un compose servisu nosaukumi, piemēram, `http://flaresolverr:8191`, turpinātu darboties. Tā rezultātā šo lauku var arī novirzīt uz jebkuru citu servisu, ko backend var sasniegt šajās adresēs, un atbilde tiek atgriezta mezgla izvadē. Akreditācijas datu koplietošana to neierobežo: jebkurš pierakstījies lietotājs var izveidot savus FlareSolverr akreditācijas datus, tāpēc esošo aizturēšana neko nemaina. Piemērojamie kontroles pasākumi ir uzticēšanās cilvēkiem, kuri var veidot workflow, un tīkla noteikumi, kas ierobežo to, ko backend var sasniegt.
- Heym pirms savienojuma izveides piesprauž atrisināto adresi, tāpēc DNS atbilde nevar pārvietot pieprasījumu uz metadata adresi pēc pārbaudes. Vides starpniekserveri tiek atspējoti, kamēr aizsargs ir aktīvs, un pāradresācijas netiek sekotas.
- Lapa, ko FlareSolverr pēc tam ielādē jūsu vietā, ir atsevišķs posms, ko FlareSolverr atrisina pats. Heym to neinspicē, tāpēc ierobežošana, kur FlareSolverr konteiners drīkst savienoties, ir jūsu tīkla politikas ziņā.
- Uzticami pašmitināti izvietojumi var atcelt metadata noteikumu ar `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mitinātos vai daudznomnieku izvietojumos saglabājiet noklusējuma iestatījumu.

## Saistītie

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Playwright mezgls](./playwright-node.md) – Pārlūka automatizācijas alternatīva
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienot FlareSolverr akreditācijas datus
