# Crawler

**Crawler** mazgas renka informaciją iš interneto puslapių naudodamas FlareSolverr su pasirinktiniais HTML ištraukimo CSS selektoriais. Naudokite jį interneto duomenų rinkimui ir turinio ištraukimo procesams.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.body` (HTML arba ištrauktas turinys) |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | FlareSolverr kredencialas iš [Kredencialų](../tabs/credentials-tab.md) |
| `crawlerUrl` | išraiška | URL, kurį reikia surinkti (palaiko išraiškas) |
| `crawlerWaitSeconds` | skaičius | Sekundžių skaičius, kurį reikia palaukti prieš renkant informaciją (numatytasis: 0) |
| `crawlerMaxTimeout` | skaičius | Maksimalus laiko limitas ms (numatytasis: 60000) |
| `crawlerMode` | tekstas | `"basic"` arba kiti režimai |
| `crawlerSelectors` | masyvas | CSS selektoriai ištraukimo procesui. Kiekvienas: `{ selector, attribute? }` |

## Pavyzdys

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

## Išėjimo Saugumas

- FlareSolverr URL, saugomas kredenciale, turi naudoti `http://` arba `https://` ir negali būti nuoroda į vietinį ar debesų metaduomenų adresą. Atmetimo rinkinys yra `169.254.0.0/16`, `fe80::/10`, Alibaba Cloud ir AWS IPv6 metaduomenų adresai, taip pat IPv6 perėjimo formos, galinčios turėti vieną iš jų. Tai yra žinomų endpoint'ų sąrašas, o ne garantija dėl kiekvieno teikėjo.
- Loopback ir privatūs adresai leidžiami tyčia, todėl dokumentuota `http://localhost:8191` konfigūracija ir sudėtiniai paslaugų pavadinimai, tokie kaip `http://flaresolverr:8191`, veikia toliau. Dėl to šis laukas taip pat gali būti nukreiptas į bet kurią kitą paslaugą, kurią backend gali pasiekti šiais adresais, o atsakymas grįžta į mazgo išvestį. Kredencialų dalijimasis to neapima: bet kuris prisijungęs vartotojas gali sukurti savo FlareSolverr kredencialą, todėl esamos kredencialos sulaikymas nieko nekeičia. Taikomi kontrolės mechanizmai yra pasitikėjimas žmonėmis, kurie gali kurti workflows, ir tinklo taisyklės, ribojančios, ką backend gali pasiekti.
- Heym fiksuoja išspręstą adresą prieš prisijungdama, todėl DNS atsakymas negali perkelti užklausos į metaduomenų adresą po patikrinimo. Aplinkos proxy yra išjungti, kol veikia apsauga, o peradresavimai nėra sekami.
- Puslapis, kurį FlareSolverr tada surenka už Jus, yra atskiras šuolis, kurį FlareSolverr išsprendžia pats. Heym jo nepatikrina, todėl apribojimas, kur FlareSolverr konteineris gali prisijungti, priklauso nuo Jūsų tinklo politikos.
- Pasitikėjimo verti savarankiškai talpinami diegimai gali panaikinti metaduomenų taisyklę nustatydami `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Laikykite numatytąją nustatymą talpinamuose ar daugiakartiniuose diegimuose.

## Susiję

- [Node Types](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Playwright Node](./playwright-node.md) – Naršyklės automatizavimo alternatyva
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti FlareSolverr kredencialą
