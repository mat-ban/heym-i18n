# Crawler

Węzeł **Crawler** pobiera zawartość stron internetowych przy użyciu FlareSolverr, z opcjonalnym wyodrębnianiem HTML za pomocą selektorów CSS. Służy do scrapowania stron i ekstrakcji treści.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.body` (HTML lub wyodrębniona treść) |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania FlareSolverr z sekcji [Dane logowania](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL do scrapowania (obsługuje wyrażenia) |
| `crawlerWaitSeconds` | number | Liczba sekund oczekiwania przed scrapowaniem (domyślnie: 0) |
| `crawlerMaxTimeout` | number | Maksymalny limit czasu w ms (domyślnie: 60000) |
| `crawlerMode` | string | `"basic"` lub inne tryby |
| `crawlerSelectors` | array | Selektory CSS do ekstrakcji. Każdy: `{ selector, attribute? }` |

## Przykład

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

## Bezpieczeństwo ruchu wychodzącego

- URL FlareSolverr przechowywany w danych logowania musi używać protokołu `http://` lub `https://` i nie może prowadzić do adresu link-local ani adresu metadanych chmury. Zbiór odrzucanych adresów obejmuje `169.254.0.0/16`, `fe80::/10`, adresy metadanych IPv6 Alibaba Cloud i AWS oraz formy przejściowe IPv6, które mogą przenosić jeden z nich. Jest to lista znanych endpointów, a nie gwarancja dotycząca każdego dostawcy.
- Adresy loopback i prywatne są celowo dozwolone, dzięki czemu udokumentowana konfiguracja `http://localhost:8191` oraz nazwy usług compose, takie jak `http://flaresolverr:8191`, nadal działają. Konsekwencją jest to, że to pole można również skierować na dowolną inną usługę osiągalną dla backendu pod tymi adresami, a odpowiedź wraca w wyjściu węzła. Udostępnianie danych logowania tego nie ogranicza: każdy zalogowany użytkownik może utworzyć własne dane logowania FlareSolverr, więc odmowa dostępu do istniejących niczego nie zmienia. Skuteczne mechanizmy kontroli to zaufanie do osób uprawnionych do tworzenia workflow oraz reguły sieciowe ograniczające to, do czego backend może sięgać.
- Heym przypina rozwiązywany adres przed nawiązaniem połączenia, więc odpowiedź DNS nie może przenieść żądania na adres metadanych po zakończeniu sprawdzania. Proxy środowiskowe są wyłączone, gdy mechanizm ochronny jest aktywny, a przekierowania nie są śledzone.
- Strona, którą następnie pobiera dla użytkownika FlareSolverr, to osobny przeskok, który FlareSolverr rozwiązuje samodzielnie. Heym jej nie sprawdza, więc ograniczenie tego, z czym może się łączyć kontener FlareSolverr, należy do polityki sieciowej.
- Zaufane wdrożenia self-hosted mogą znieść regułę metadanych za pomocą `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. W przypadku wdrożeń hostowanych lub wielodostępnych należy zachować wartość domyślną.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Węzeł Playwright](./playwright-node.md) – Alternatywa automatyzacji przeglądarki
- [Karta Dane logowania](../tabs/credentials-tab.md) – Dodawanie danych logowania FlareSolverr
