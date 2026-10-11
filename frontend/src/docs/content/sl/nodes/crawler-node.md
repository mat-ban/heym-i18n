# Crawler

**Crawler** vozlišče zbira spletne strani z uporabo FlareSolverr, z možnostjo ekstrakcije HTML prek CSS selektorjev. Uporabite ga za spletno strganje in ekstrakcijo vsebine.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.body` (HTML ali ekstraktirana vsebina) |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | FlareSolverr poverilnica iz [Poverilnic](../tabs/credentials-tab.md) |
| `crawlerUrl` | izraz | URL za strganje (podpira izraze) |
| `crawlerWaitSeconds` | število | Sekunde čakanja pred strganjem (privzeto: 0) |
| `crawlerMaxTimeout` | število | Maksimalni časovni limit v ms (privzeto: 60000) |
| `crawlerMode` | niz | `"basic"` ali drugi načini |
| `crawlerSelectors` | niz | CSS selektorji za ekstrakcijo. Vsak: `{ selector, attribute? }` |

## Primer

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

## Varnost izhoda

- URL FlareSolverr, shranjen v poverilnici, mora uporabljati `http://` ali `https://` in ne sme kazati na povezavo lokalnega omrežja ali naslovov metapodatkov v oblaku. Prepovedan nabor je `169.254.0.0/16`, `fe80::/10`, naslovi metapodatkov Alibaba Cloud in AWS IPv6 ter oblike prehoda IPv6, ki lahko nosijo enega od njih. To je seznam znanih končnih točk, ne pa zagotovilo o vsakem ponudniku.
- Naslovi za povratne zanke in zasebni naslovi so dovoljeni namenoma, tako da dokumentirana nastavitev `http://localhost:8191` in imena storitev compose, kot je `http://flaresolverr:8191`, še naprej delujejo. Posledica tega je, da se to polje lahko usmeri tudi na katero koli drugo storitev, do katere lahko dostopa zadnji del na teh naslovih, in odgovor se vrne v izhod vozlišča. Deljenje poverilnic tega ne vsebuje: vsak prijavljen uporabnik lahko ustvari svojo FlareSolverr poverilnico, zato zadrževanje obstoječe ne spremeni ničesar. Kontrole, ki se uporabljajo, so zaupanje ljudem, ki lahko avtorirajo workflows, in omrežna pravila, ki omejujejo, do česa lahko dostopa zadnji del.
- Heym zaklene razrešen naslov pred povezovanjem, tako da odgovor DNS ne more premakniti zahteve na naslov metapodatkov po preverjanju. Proxiji okolja so onemogočeni, medtem ko je zaščita aktivna, in preusmeritve se ne sledijo.
- Stran, ki jo FlareSolverr nato pridobi za vas, je ločen skok, ki ga FlareSolverr razreši sam. Heym je ne pregleduje, zato omejevanje, na katero povezavo se lahko poveže kontejner FlareSolverr, spada v vašo omrežno politiko.
- Zaupanja vredne samostojne namestitve lahko dvignejo pravilo o metapodatkih z `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Ohranite privzeto nastavitev pri gostovanih ali večnajamenskih namestitvah.

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Playwright vozlišče](./playwright-node.md) – Alternativa za avtomatizacijo brskalnika
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte FlareSolverr poverilnico
