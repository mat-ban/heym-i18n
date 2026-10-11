# Crawler

A **Crawler** csomópont weboldalakat scrape-el a FlareSolverr segítségével, opcionális HTML-kinyeréssel CSS-szelektorokon keresztül. Web scrapinghez és tartalomkinyeréshez használható.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.body` (HTML vagy kinyert tartalom) |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | FlareSolverr hitelesítési adat a [Hitelesítési adatok](../tabs/credentials-tab.md) közül |
| `crawlerUrl` | expression | A scrape-elendő URL (támogatja a kifejezéseket) |
| `crawlerWaitSeconds` | number | A scrape-elés előtti várakozás másodpercben (alapértelmezett: 0) |
| `crawlerMaxTimeout` | number | Maximális időtúllépés ms-ban (alapértelmezett: 60000) |
| `crawlerMode` | string | `"basic"` vagy egyéb módok |
| `crawlerSelectors` | array | CSS-szelektorok a kinyeréshez. Mindegyik: `{ selector, attribute? }` |

## Példa

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

## Egress-biztonság

- A hitelesítési adatban tárolt FlareSolverr URL-nek `http://` vagy `https://` sémát kell használnia, és nem oldható fel link-local vagy cloud-metadata címre. A tiltott halmaz: `169.254.0.0/16`, `fe80::/10`, az Alibaba Cloud és AWS IPv6 metadata címei, valamint azon IPv6 átmeneti formák, amelyek ezek valamelyikét hordozhatják. Ez az ismert végpontok listája, nem pedig garancia minden szolgáltatóra nézve.
- A loopback- és privát címek szándékosan engedélyezettek, így a dokumentált `http://localhost:8191` beállítás és a compose szolgáltatásnevek, például a `http://flaresolverr:8191` továbbra is működnek. Ennek következménye, hogy ez a mező bármely más olyan szolgáltatásra is irányítható, amelyet a backend ezeken a címeken elér, és a válasz a csomópont kimenetében jelenik meg. A hitelesítési adatok megosztása ezt nem korlátozza: bármely bejelentkezett felhasználó létrehozhatja a saját FlareSolverr hitelesítési adatát, így egy meglévő visszatartása semmit sem változtat. Az alkalmazható kontrollok: a workflow-k szerzőinek megbízhatósága, valamint azon hálózati szabályok, amelyek korlátozzák, hogy a backend mit érhet el.
- A Heym a csatlakozás előtt rögzíti a feloldott címet, így egy DNS-válasz nem tudja a kérést a ellenőrzés után metadata-címre átirányítani. A környezeti proxyk le vannak tiltva, amíg az őr aktív, és a rendszer nem követi a átirányításokat.
- Az az oldal, amelyet a FlareSolverr ezután Önnek letölt, egy külön ugrás, amelyet a FlareSolverr maga old fel. A Heym nem vizsgálja, ezért annak korlátozása, hogy a FlareSolverr konténer hova csatlakozhat, az Ön hálózati szabályzatának a feladata.
- A megbízható, saját üzemeltetésű telepítések a `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` beállítással feloldhatják a metadata-szabályt. Hostolt vagy többbérlős telepítéseken tartsa meg az alapértelmezett beállítást.

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Playwright csomópont](./playwright-node.md) – Böngészőautomatizálási alternatíva
- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – FlareSolverr hitelesítési adat hozzáadása
