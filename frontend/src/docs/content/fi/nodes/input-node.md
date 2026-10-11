# Syötesolmu

**Syötesolmu** on workflowien alkupiste, joka vastaanottaa käyttäjältä tai API-kutsujalta tulevia tietoja. Se tukee yhtä tai useampaa syötekenttää ja tarjoaa käyttöön pyynnön metatiedot (otsikot, hakuparametrit).

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 0 |
| Lähtöarvot | 1 |
| Lähtö | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `value` | merkkijono | Oletusarvo yksittäiselle tekstisyötteelle (valinnainen) |
| `inputFields` | taulukko | Syötekenttien määrittelyt. Jokainen: `{ key, defaultValue? }` |

### Syötekentät

| Kenttä | Tyyppi | Kuvaus |
|-------|------|-------------|
| `key` | merkkijono | Kenttäavain (esim. `text`, `imageUrl`, `base64`) |
| `defaultValue` | merkkijono | Oletusarvo, jos arvoa ei anneta (valinnainen) |

## Syötetietojen käyttö

**Body-kentät** (käytä aina muotoa `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – tekstikenttä
- `$userInput.body.imageUrl` – kuvan URL-osoite
- `$userInput.body.userId` – määritetty oletusarvo
- `$userInput.body.event.user.id` – sisäkkäinen JSON Generic-webhook-tilassa

**Pyynnön metatiedot** (API:n kautta suoritettaessa):

- `$userInput.headers` – kaikki otsikot (avaimet pienellä kirjoitettuna)
- `$userInput.headers.authorization` – tietty otsikko
- `$userInput.query` – hakuparametrit
- `$userInput.query.param1` – tietty hakuparametri

## Suorituspanelin tiedostosyöte

Editorin **Suorita**-välilehdessä (Defined-webhook-tila) jokainen syötekenttä tukee tiedostojen raahaamista ja upotettua liitetiedoston valintaa (kentän oikeassa alakulmassa):

- **Tekstitiedostot** (`.txt`, `.md`, `.json`, `.csv` ja vastaavat) luetaan pelkkänä tekstinä.
- **Kuvat** (JPEG, PNG, GIF, WebP) tallennetaan `data:`-URL-osoitteina (base64) kentän arvoksi – käytä kenttäavaimia kuten `imageUrl` tai `base64`, kun myöhemmät solmut odottavat kuvadataa.
- **PDF**-tiedostot muunnetaan puretuksi tekstiksi (enintään 5 MB:n tiedosto, 100 000 merkkiä sisältöä).

Yksi tiedosto per kenttä. Tekstialuetta voi muokata myös tiedoston lataamisen jälkeen. Generic-webhook-tila (raaka JSON-body) ei näytä kenttäkohtaisia tiedostonvalintakontrollia.

## Syötekentät vs. Generic-webhookit

`inputFields` kuvaavat edelleen odotettuja syötteitä määritetyssä tilassa oleville editorilomakkeille, alityönkulkujen kartoitukselle ja muille metatietopohjaisille käyttöliittymille.

Kun workflow käyttää **Generic**-webhook-body-tilaa, saapuva HTTP-body ei muotoilla uudelleen `inputFields`-kenttien perusteella. Sen sijaan raaka JSON-payload välitetään suoraan `$nodeLabel.body`-muuttujaan, ja Syötesolmun kenttien lisäys-/poistokontrollit piilotetaan solmun paneelista.

## Esimerkkejä

**Yksittäinen syöte (oletus):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Useita syötteitä:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Kaikkien solmutyyppien yleiskatsaus
- [Triggerit](../reference/triggers.md) – Alkupisteet (Syöte, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Viittaukset muotoihin `$nodeLabel.body`, `$nodeLabel.query`
- [Portaali](../reference/portal.md) – Workflowien tarjoaminen chätin käyttöliittymänä
- [Webhookit](../reference/webhooks.md) – HTTP-trigger workflowille
