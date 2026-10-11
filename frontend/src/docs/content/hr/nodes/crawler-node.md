# Crawler

**Crawler** čvor scrapa web-stranice koristeći FlareSolverr s opcionalnim HTML izvlačenjem putem CSS selektora. Koristite ga za web scraping i izvlačenje sadržaja.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.body` (HTML ili izvučeni sadržaj) |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | FlareSolverr vjerodajnica iz [Vjerodajnice](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL za scraping (podržava izraze) |
| `crawlerWaitSeconds` | number | Sekunde čekanja prije scrapinga (zadano: 0) |
| `crawlerMaxTimeout` | number | Maksimalno vrijeme čekanja u ms (zadano: 60000) |
| `crawlerMode` | string | `"basic"` ili drugi načini rada |
| `crawlerSelectors` | array | CSS selektori za izvlačenje. Svaki: `{ selector, attribute? }` |

## Primjer

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

## Sigurnost izlaznog prometa

- FlareSolverr URL pohranjen u vjerodajnici mora koristiti `http://` ili `https://` i ne smije se razriješiti na link-local ili cloud-metadata adresu. Odbijeni skup je `169.254.0.0/16`, `fe80::/10`, Alibaba Cloud i AWS IPv6 metadata adrese te IPv6 prijelazni oblici koji mogu prenositi neku od njih. To je popis poznatih endpointa, a ne jamstvo za svakog pružatelja usluga.
- Loopback i privatne adrese dopuštene su namjerno, kako bi dokumentirana postavka `http://localhost:8191` i nazivi compose servisa poput `http://flaresolverr:8191` nastavili raditi. Posljedica je da se ovo polje može usmjeriti i na bilo koju drugu uslugu do koje backend može doći na tim adresama, a odgovor se vraća u izlazu čvora. Dijeljenje vjerodajnica to ne sprječava: svaki prijavljeni korisnik može izraditi vlastitu FlareSolverr vjerodajnicu, pa uskraćivanje postojeće ništa ne mijenja. Kontrole koje se doista primjenjuju jesu povjerenje u osobe koje mogu autorirati workflowe i mrežna pravila koja ograničavaju do čega backend može doći.
- Heym prije povezivanja fiksira razriješenu adresu, pa DNS odgovor ne može premjestiti zahtjev na metadata adresu nakon provjere. Proxyji iz okoline onemogućeni su dok je zaštita aktivna, a preusmjeravanja se ne slijede.
- Stranica koju zatim FlareSolverr dohvaća za vas zaseban je hop koji FlareSolverr sam razrješava. Heym ga ne pregledava, pa ograničavanje toga gdje se FlareSolverr kontejner smije povezati pripada vašoj mrežnoj politici.
- Pouzdane self-hosted instalacije mogu ukinuti metadata pravilo s `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Zadržite zadanu postavku na hosted ili multi-tenant instalacijama.

## Povezano

- [Vrste čvorova](../reference/node-types.md) – Pregled svih vrsta čvorova
- [Playwright čvor](./playwright-node.md) – Alternativa za automatizaciju preglednika
- [Kartica Vjerodajnice](../tabs/credentials-tab.md) – Dodavanje FlareSolverr vjerodajnice
