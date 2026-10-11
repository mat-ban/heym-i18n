# Crawler

Uzel **Crawler** provádí scraping webových stránek pomocí FlareSolverr s volitelnou extrakcí HTML prostřednictvím CSS selektorů. Použijte jej pro web scraping a extrakci obsahu.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.body` (HTML nebo extrahovaný obsah) |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaj FlareSolverr z [Přihlašovacích údajů](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL adresa pro scraping (podporuje výrazy) |
| `crawlerWaitSeconds` | number | Počet sekund čekání před scrapingem (výchozí: 0) |
| `crawlerMaxTimeout` | number | Maximální časový limit v ms (výchozí: 60000) |
| `crawlerMode` | string | `"basic"` nebo jiné režimy |
| `crawlerSelectors` | array | CSS selektory pro extrakci. Každý: `{ selector, attribute? }` |

## Příklad

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

## Bezpečnost odchozího provozu

- URL adresa FlareSolverr uložená v přihlašovacím údaji musí používat `http://` nebo `https://` a nesmí se přeložit na link-local nebo cloud-metadata adresu. Odmítnutá množina zahrnuje `169.254.0.0/16`, `fe80::/10`, adresy Alibaba Cloud a AWS IPv6 metadata a formy IPv6 přechodu, které mohou některou z nich přenášet. Jde o seznam známých endpointů, nikoli o záruku týkající se všech poskytovatelů.
- Loopback a privátní adresy jsou povoleny záměrně, aby dokumentované nastavení `http://localhost:8191` a názvy služeb v compose, jako například `http://flaresolverr:8191`, nadále fungovaly. Důsledkem je, že toto pole lze také namířit na jakoukoli jinou službu, kterou backend na těchto adresách dosáhne, a odpověď se vrátí ve výstupu uzlu. Sdílení přihlašovacích údajů to neřeší: každý přihlášený uživatel si může vytvořit vlastní přihlašovací údaj FlareSolverr, takže zadržení existujícího nic nezmění. Účinnými kontrolami jsou důvěra v osoby, které mohou vytvářet workflow, a síťová pravidla omezující to, co backend dosáhne.
- Heym před připojením připne přeloženou adresu, takže odpověď DNS nemůže po kontrole přesunout požadavek na metadata adresu. Během aktivní ochrany jsou proxy serveru prostředí zakázány a přesměrování se nenásledují.
- Stránka, kterou pak FlareSolverr načte za Vás, je samostatný přeskok, který si FlareSolverr přeloží sám. Heym ji nezkoumá, takže omezení toho, kam se kontejner FlareSolverr smí připojit, spadá do Vaší síťové politiky.
- Důvěryhodná self-hosted nasazení mohou pravidlo pro metadata zrušit pomocí `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Výchozí nastavení ponechte zapnuté u hostovaných nebo multi-tenant nasazení.

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Uzel Playwright](./playwright-node.md) – Alternativa pro automatizaci prohlížeče
- [Karta Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání přihlašovacího údaje FlareSolverr
