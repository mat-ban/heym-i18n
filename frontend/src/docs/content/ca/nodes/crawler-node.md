# Crawler

El node **Crawler** extreu contingut de pàgines web mitjançant FlareSolverr, amb extracció HTML opcional a través de selectors CSS. Utilitzeu-lo per a l'scraping web i l'extracció de contingut.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.body` (HTML o contingut extret) |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de FlareSolverr de [Credencials](../tabs/credentials-tab.md) |
| `crawlerUrl` | expressió | URL a extreure (admet expressions) |
| `crawlerWaitSeconds` | number | Segons d'espera abans d'extreure (per defecte: 0) |
| `crawlerMaxTimeout` | number | Temps d'espera màxim en ms (per defecte: 60000) |
| `crawlerMode` | string | `"basic"` o altres modes |
| `crawlerSelectors` | array | Selectors CSS per a l'extracció. Cadascun: `{ selector, attribute? }` |

## Exemple

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

## Seguretat de sortida

- L'URL de FlareSolverr emmagatzemat a la credencial ha d'utilitzar `http://` o `https://` i no pot resoldre's a una adreça link-local o de metadades del núvol. El conjunt refusat és `169.254.0.0/16`, `fe80::/10`, les adreces de metadades IPv6 d'Alibaba Cloud i AWS, i les formes de transició IPv6 que poden transportar-ne una. És una llista d'endpoints coneguts, no una garantia sobre tots els proveïdors.
- Les adreces de loopback i privades es permeten deliberadament, de manera que la configuració documentada `http://localhost:8191` i els noms de servei de compose com `http://flaresolverr:8191` continuen funcionant. La conseqüència és que aquest camp també es pot apuntar a qualsevol altre servei que el backend pugui assolir en aquestes adreces, i la resposta retorna a la sortida del node. Compartir credencials no conté això: qualsevol usuari autenticat pot crear la seva pròpia credencial de FlareSolverr, de manera que retenir-ne una d'existent no canvia res. Els controls que sí que s'apliquen són confiar en les persones que poden crear workflows, i les regles de xarxa que limiten allò que el backend pot assolir.
- Heym fixa l'adreça resolta abans de connectar-se, de manera que una resposta DNS no pot desplaçar la sol·licitud cap a una adreça de metadades després de la comprovació. Els proxys d'entorn es desactiven mentre la protecció és activa, i no se segueixen les redireccions.
- La pàgina que FlareSolverr obté després per a vosaltres és un salt separat que FlareSolverr resol per si mateix. Heym no la inspecciona, de manera que restringir on es pot connectar el contenidor de FlareSolverr pertany a la vostra política de xarxa.
- Els desplegaments autoallotjats de confiança poden aixecar la regla de metadades amb `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Manteniu el valor per defecte en desplegaments allotjats o multi-tenant.

## Relacionat

- [Tipus de nodes](../reference/node-types.md) – Visió general de tots els tipus de nodes
- [Node Playwright](./playwright-node.md) – Alternativa d'automatització del navegador
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegir una credencial de FlareSolverr