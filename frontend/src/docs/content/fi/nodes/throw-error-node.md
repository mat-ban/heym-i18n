# Virheenheitto

**Virheenheitto**-solmu keskeyttää workflown suorituksen välittömästi ja palauttaa mukautetun HTTP-tilakoodin sisältävän virhevasteen. Käytä sitä validointivirheiden, luvattoman käytön tai muiden virhetilanteiden ilmoittamiseen.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 0 |
| Tulos | Workflow keskeytyy; virheviesti palautetaan kutsujalle |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `errorMessage` | lauseke | Virheviesti (tukee lausekkeita) |
| `httpStatusCode` | numero | HTTP-tilakoodi (esim. 400, 401, 403, 404, 429, 500) |

## Yleisimmät tilakoodit

| Koodi | Käyttötarkoitus |
|------|----------|
| 400 | Virheellinen pyyntö (kelvoton syöte) |
| 401 | Ei valtuuksia (vaatii tunnistautumisen) |
| 403 | Kielletty (pääsy evätty) |
| 404 | Ei löytynyt (resurssi puuttuu) |
| 422 | Käsittelemätön yksikkö (validointivirhe) |
| 429 | Liian monta pyyntöä (nopeusrajoitus) |
| 500 | Sisäinen palvelinvirhe |

## Esimerkki

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Tekstisyöte on pakollinen",
    "httpStatusCode": 400
  }
}
```

Käytä yhdessä [Ehto](./condition-node.md)-solmun kanssa syötteen validointiin ja virheenheittoon vain virhetilanteessa:
- Ehto tosi → jatka Tulosteeseen
- Ehto epätosi → Heitä virhe

## Liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Ehtosolmu](./condition-node.md) – Validoi ennen virheenheittoa
- [Virheenkäsittelijä](./error-handler-node.md) – Kaappaa muiden solmujen virheet
