# Crawler

Noden **Crawler** skrapar webbsidor med hjälp av FlareSolverr, med valfri HTML-extrahering via CSS-selektorer. Den används för webbskrapning och innehållsutvinning.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Inmatningar | 1 |
| Utmatningar | 1 |
| Utdata | `$nodeLabel.body` (HTML eller extraherat innehåll) |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | FlareSolverr-autentiseringsuppgift från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL som ska skrapas (stöder uttryck) |
| `crawlerWaitSeconds` | number | Antal sekunder att vänta innan skrapning (standard: 0) |
| `crawlerMaxTimeout` | number | Maximal timeout i ms (standard: 60000) |
| `crawlerMode` | string | `"basic"` eller andra lägen |
| `crawlerSelectors` | array | CSS-selektorer för extrahering. Var och en: `{ selector, attribute? }` |

## Exempel

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

## Säkerhet vid utgående trafik

- FlareSolverr-URL:en som lagras i autentiseringsuppgiften måste använda `http://` eller `https://` och får inte peka mot en link-local- eller molnmetadata-adress. Den nekade mängden är `169.254.0.0/16`, `fe80::/10`, Alibaba Cloud- och AWS IPv6-metadataadresser samt de IPv6-övergångsformer som kan bära någon av dem. Det är en lista över kända endpoints, inte en garanti för samtliga leverantörer.
- Loopback- och privata adresser tillåts med avsikt, så att den dokumenterade konfigurationen `http://localhost:8191` och compose-tjänstenamn som `http://flaresolverr:8191` fortsätter att fungera. Konsekvensen är att detta fält även kan riktas mot vilken annan tjänst som helst som backend kan nå på dessa adresser, och svaret returneras i nodens utdata. Delning av autentiseringsuppgifter begränsar inte detta: varje inloggad användare kan skapa sina egna FlareSolverr-autentiseringsuppgifter, så att undanhålla en befintlig ändrar ingenting. De kontroller som faktiskt gäller är att lita på de personer som kan skapa workflows, samt nätverksregler som begränsar vad backend kan nå.
- Heym låser den uppslagna adressen innan anslutning, så ett DNS-svar kan inte flytta begäran till en metadata-adress efter kontrollen. Miljöproxies inaktiveras medan skyddet är aktivt, och omdirigeringar följs inte.
- Sidan som FlareSolverr sedan hämtar åt användaren är ett separat hopp som FlareSolverr löser upp själv. Heym inspekterar den inte, så att begränsa var FlareSolverr-containern får ansluta hör till nätverkspolicyn.
- Betrodda självhostade distributioner kan häva metadata-regeln med `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Behåll standardvärdet i hostade eller fleranvändardistributioner.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Playwright-nod](./playwright-node.md) – Alternativ för webbläsarautomatisering
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till FlareSolverr-autentiseringsuppgift
