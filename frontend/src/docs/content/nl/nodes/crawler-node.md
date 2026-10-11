# Crawler

De **Crawler**-node scrapet webpagina's met behulp van FlareSolverr, met optionele HTML-extractie via CSS-selectors. Gebruik deze voor webscraping en contentextractie.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.body` (HTML of geëxtraheerde content) |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | FlareSolverr-referentie uit [Referenties](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL om te scrapen (ondersteunt expressies) |
| `crawlerWaitSeconds` | number | Seconden om te wachten voordat wordt gescrapet (standaard: 0) |
| `crawlerMaxTimeout` | number | Maximale timeout in ms (standaard: 60000) |
| `crawlerMode` | string | `"basic"` of andere modi |
| `crawlerSelectors` | array | CSS-selectors voor extractie. Elk: `{ selector, attribute? }` |

## Voorbeeld

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

## Egress-veiligheid

- De FlareSolverr-URL die in de referentie is opgeslagen, moet gebruikmaken van `http://` of `https://` en mag niet verwijzen naar een link-local- of cloud-metadata-adres. De geweigerde set is `169.254.0.0/16`, `fe80::/10`, de Alibaba Cloud- en AWS IPv6-metadata-adressen, en de IPv6-overgangsvormen die een van deze kunnen bevatten. Het is een lijst van bekende endpoints, geen garantie voor elke provider.
- Loopback- en privéadressen zijn bewust toegestaan, zodat de gedocumenteerde `http://localhost:8191`-configuratie en compose-servicenamen zoals `http://flaresolverr:8191` blijven werken. Het gevolg is dat dit veld ook kan worden gericht op elke andere service die de backend op die adressen kan bereiken, en het antwoord komt terug in de node-uitvoer. Het delen van referenties dekt dit niet af: elke aangemelde gebruiker kan zijn eigen FlareSolverr-referentie aanmaken, dus het achterhouden van een bestaande verandert niets. De maatregelen die wel van toepassing zijn, zijn het vertrouwen in de personen die workflows kunnen maken, en netwerkregels die beperken wat de backend kan bereiken.
- Heym pint het opgeloste adres vast voordat er verbinding wordt gemaakt, zodat een DNS-antwoord de aanvraag na de controle niet naar een metadata-adres kan verplaatsen. Omgevingsproxies zijn uitgeschakeld terwijl de beveiliging actief is, en redirects worden niet gevolgd.
- De pagina die FlareSolverr vervolgens voor u ophaalt, is een afzonderlijke hop die FlareSolverr zelf resolveert. Heym inspecteert deze niet, dus het beperken van waar de FlareSolverr-container verbinding mee mag maken, hoort bij uw netwerkbeleid.
- Vertrouwde self-hosted-implementaties kunnen de metadataregel opheffen met `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Behoud de standaardinstelling op gehoste of multi-tenant-implementaties.

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Playwright-node](./playwright-node.md) – Alternatief voor browserautomatisering
- [Tabblad Referenties](../tabs/credentials-tab.md) – FlareSolverr-referentie toevoegen
