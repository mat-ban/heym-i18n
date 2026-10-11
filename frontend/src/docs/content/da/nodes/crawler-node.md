# Crawler

**Crawler**-noden udtrækker data fra websider ved hjælp af FlareSolverr med valgfri HTML-ekstraktion via CSS-selectorer. Anvendes til webscraping og indholdsextraktion.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.body` (HTML eller ekstraheret indhold) |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | FlareSolverr-legitimationsoplysninger fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL der skal scrapes (understøtter expressions) |
| `crawlerWaitSeconds` | number | Ventetid i sekunder før scraping (standard: 0) |
| `crawlerMaxTimeout` | number | Maksimal timeout i ms (standard: 60000) |
| `crawlerMode` | string | `"basic"` eller andre tilstande |
| `crawlerSelectors` | array | CSS-selectorer til ekstraktion. Hver: `{ selector, attribute? }` |

## Eksempel

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

## Egress-sikkerhed

- FlareSolverr-URL'en gemt i legitimationsoplysningerne skal bruge `http://` eller `https://` og må ikke pege på en link-lokal eller cloud-metadata-adresse. Den afviste mængde omfatter `169.254.0.0/16`, `fe80::/10`, Alibaba Cloud- og AWS IPv6-metadataadresser samt IPv6-overgangsformer, der kan indeholde en af dem. Det er en liste over kendte endpoints, ikke en garanti for hver enkelt udbyder.
- Loopback- og private adresser er med vilje tilladt, så den dokumenterede opsætning `http://localhost:8191` og compose-servicenavne som `http://flaresolverr:8191` fortsat virker. Konsekvensen er, at dette felt også kan pege på andre tjenester, som backend'en kan nå på disse adresser, og svaret returneres i node-output. Delt legitimationsoplysninger indeholder ikke dette: enhver bruger med login kan oprette egne FlareSolverr-legitimationsoplysninger, så tilbageholdelse af eksisterende ændrer intet. De kontroller, der gælder, er tillid til dem, der kan redigere workflows, og netværksregler, der begrænser, hvad backend'en kan nå.
- Heym fastlægger den resolvede adresse før forbindelse, så et DNS-svar ikke kan flytte anmodningen til en metadata-adresse efter tjekket. Miljøproxier deaktiveres, mens sikkerhedstjekket er aktivt, og omdirigeringer følges ikke.
- Den side, FlareSolverr henter, er et separat hop, som FlareSolverr selv resolverer. Heym inspicerer det ikke, så begrænsning af, hvor FlareSolverr-containeren må forbinde, hører under netværkspolitikken.
- Pålidelige selvhostede installationer kan ophæve metadata-reglen med `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Bevar standardindstillingen på hostede eller multi-tenant-installationer.

## Relateret

- [Nodetyper](../reference/node-types.md) – Oversigt over alle nodetyper
- [Playwright Node](./playwright-node.md) – Alternativ til browserautomatisering
- [Legitimationsoplysninger-fane](../tabs/credentials-tab.md) – Tilføj FlareSolverr-legitimationsoplysninger
