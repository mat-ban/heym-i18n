# Slack

**Slack**-solmu lähettää viestin Slack-kanavalle Webhookin avulla. Sitä voidaan käyttää ilmoituksiin, hälytyksiin ja virheraportointiin.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | Kuljettaa syötteen läpi |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | Slack-tunnistetiedot (webhook-osoite) [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdeltä |
| `message` | lauseke | Viestin teksti. Tukee [lausekkeita](../reference/expression-dsl.md). |

## Asennus

1. Luo Incoming Webhook Slack-työtilassasi
2. Lisää Slack-tunnistetiedot Tunnistetiedot-välilehdelle webhook-osoitteella
3. Viittaa tunnistetietoihin solmussa

## Esimerkki

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow suoritettu: $userInput.body.text"
  }
}
```

Käytä [Virheenkäsittelijä](./error-handler-node.md) -solmun kanssa virhe-ilmoituksia varten:
```json
"message": "Virhe solmussa $errorHandler.errorNode: $errorHandler.error"
```

## Egress-turvallisuus

- Tunnistetiedoissa tallennettu webhook-osoite on käytettävä `http://` tai `https://` -protokollaa ja sen on osoitettava vain julkisiin osoitteisiin. Loopback-, yksityiset, link-local-, multicast- ja cloud-metadata-osoitteet estetään.
- Heym validoi ratkaistut osoitteet ja kiinnittää yhteyden kohteen ennen lähetystä, joten DNS-vastaus ei voi siirtää pyyntöä sisäiseen osoitteeseen tarkistuksen jälkeen. Ympäristön välityspalvelimet poistetaan käytöstä, kun suojaus on aktiivinen, ja uudelleenohjauksia ei seurata.
- Käyttöönotot, jotka lähettävät viestejä sisäiseen webhook-vastaanottimeen, voivat asettaa `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` luotetussa itse isännöidyssä instanssissa. Säilytä oletusasetus isännöidyissä tai monivuokralaiskäyttöönotoissa.

**Päivityshuomio versiolle v0.0.109:** tämä tarkistus on uusi Slack-solmuille. Tunnistetiedot, joiden webhook-osoite osoittaa loopback- tai yksityiseen osoitteeseen, hylätään, ellei yllä mainittua asetusta ole otettu käyttöön.

## Liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Virheenkäsittelijä](./error-handler-node.md) – Lähetä Slack-viesti workflow-virheen sattuessa
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää Slack-webhook
