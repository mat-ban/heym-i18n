# Crawler

Uzol **Crawler** scrapuje webové stránky pomocou FlareSolverr s voliteľnou extrakciou HTML prostredníctvom CSS selektorov. Použite ho na web scraping a extrakciu obsahu.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.body` (HTML alebo extrahovaný obsah) |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje FlareSolverr z [Prihlasovacie údaje](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL na scrapovanie (podporuje výrazy) |
| `crawlerWaitSeconds` | number | Počet sekúnd čakania pred scrapovaním (predvolené: 0) |
| `crawlerMaxTimeout` | number | Maximálny časový limit v ms (predvolené: 60000) |
| `crawlerMode` | string | `"basic"` alebo iné režimy |
| `crawlerSelectors` | array | CSS selektory na extrakciu. Každý: `{ selector, attribute? }` |

## Príklad

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

## Bezpečnosť odchádzajúcich požiadaviek

- URL FlareSolverr uložená v prihlasovacích údajoch musí používať `http://` alebo `https://` a nesmie sa prekladať na link-local alebo cloud-metadata adresu. Odmietnutá množina je `169.254.0.0/16`, `fe80::/10`, adresy Alibaba Cloud a AWS IPv6 metadata a formy IPv6 prechodu, ktoré môžu jednu z nich prenášať. Ide o zoznam známych endpointov, nie o záruku týkajúcu sa každého poskytovateľa.
- Loopback a privátne adresy sú povolené zámerne, aby dokumentované nastavenie `http://localhost:8191` a názvy služieb v compose, ako napríklad `http://flaresolverr:8191`, fungovali naďalej. Dôsledkom je, že toto pole možno nasmerovať aj na akúkoľvek inú službu, ku ktorej sa backend na týchto adresách dostane, a odpoveď sa vráti vo výstupe uzla. Zdieľanie prihlasovacích údajov to neobmedzuje: každý prihlásený používateľ si môže vytvoriť vlastné prihlasovacie údaje FlareSolverr, takže zadržanie existujúcich nič nemení. Účinné sú kontroly, ktoré spočívajú v dôvere voči osobám oprávneným vytvárať workflowy, a sieťové pravidlá obmedzujúce, ku čomu sa backend dostane.
- Heym pred pripojením pripne preloženú adresu, takže odpoveď DNS nemôže po kontrole presunúť požiadavku na metadata adresu. Environmentálne proxy sú počas aktívnej ochrany vypnuté a presmerovania sa nesledujú.
- Stránka, ktorú potom FlareSolverr načíta za Vás, je samostatný skok, ktorý si FlareSolverr prekladá sám. Heym ju nekontroluje, takže obmedzenie toho, kam sa kontajner FlareSolverr môže pripojiť, patrí do Vašej sieťovej politiky.
- Dôveryhodné self-hosted nasadenia môžu zrušiť pravidlo pre metadata pomocou `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Predvolené nastavenie ponechajte zapnuté v hostovaných alebo multi-tenant nasadeniach.

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Uzol Playwright](./playwright-node.md) – Alternatíva k automatizácii prehliadača
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie prihlasovacích údajov FlareSolverr
