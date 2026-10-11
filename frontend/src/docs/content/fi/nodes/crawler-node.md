# Crawler

**Crawler**-solmu kaappaa verkkosivuja käyttäen FlareSolverria ja mahdollistaa HTML:n erottelun CSS-valitsimien avulla. Käytä sitä verkkosivujen kaappaukseen ja sisällön erotteluun.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.body` (HTML tai eroteltu sisältö) |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | FlareSolverr-tunnistetiedot [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdeltä |
| `crawlerUrl` | lauseke | Kaavittavan sivun URL (tukee lausekkeita) |
| `crawlerWaitSeconds` | numero | Odotusaika sekunteina ennen kaappausta (oletus: 0) |
| `crawlerMaxTimeout` | numero | Maksimiaika ms (oletus: 60000) |
| `crawlerMode` | merkkijono | `"basic"` tai muut tilat |
| `crawlerSelectors` | taulukko | CSS-valitsimet erottelua varten. Jokainen: `{ selector, attribute? }` |

## Esimerkki

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

## Egress-turvallisuus

- FlareSolverr-URL, joka tallennetaan tunnistetietoihin, on käytettävä `http://` tai `https://` -muodossa, eikä sen saa viitata linkkilokaaliin tai pilvimetatieto-osoitteeseen. Kiellettyjä ovat `169.254.0.0/16`, `fe80::/10`, Alibaba Cloudin ja AWS:n IPv6-metatietoosoitteet sekä IPv6-siirtymämuodot, jotka voivat sisältää jonkin näistä. Kyseessä on luettelo tunnetuista päätepisteistä, ei takuu kaikista palveluntarjoajista.
- Loopback- ja yksityiset osoitteet sallitaan tarkoituksella, jotta dokumentoitu `http://localhost:8191` -asetus ja compose-palvelun nimet, kuten `http://flaresolverr:8191`, pysyvät toiminnassa. Seurauksena on, että tähän kenttään voidaan osoittaa myös mikä tahansa muu palvelu, johon taustajärjestelmä pääsee käsiksi näillä osoitteilla, ja vastaus palautuu solmun tulosteeseen. Tunnistetietojen jakaminen ei sisällä tätä: mikä tahansa kirjautunut käyttäjä voi luoda omat FlareSolverr-tunnistetietonsa, joten olemassa olevan tunnistetiedon pidättäminen ei muuta mitään. Käytössä olevat valvontatoimet ovat luottamus niihin henkilöihin, jotka voivat laatia workflowja, ja verkkoasetukset, jotka rajoittavat sitä, mihin taustajärjestelmä pääsee käsiksi.
- Heym kiinnittää ratkaistun osoitteen ennen yhteyden muodostamista, joten DNS-vastaus ei voi siirtää pyyntöä metatieto-osoitteeseen tarkistuksen jälkeen. Ympäristön välityspalvelimet poistetaan käytöstä, kun suojatoiminto on aktiivinen, ja uudelleenohjauksia ei seurata.
- Sivu, jonka FlareSolverr sitten hakee puolestasi, on erillinen hyppy, jonka FlareSolverr ratkaisee itse. Heym ei tarkista sitä, joten FlareSolverr-säiliön yhteyksien rajoittaminen kuuluu verkko-ohjeisiisi.
- Luotetuissa omissa käytöissä metatietosääntö voidaan poistaa asettamalla `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Säilytä oletusarvo isännöidyissä tai monivuokrausympäristöissä.

## Liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Playwright-solmu](./playwright-node.md) – Vaihtoehto selainautomaatiolle
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää FlareSolverr-tunnistetiedot
