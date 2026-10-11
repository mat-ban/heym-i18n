# Tulostus

**Tulostus**-solmu on workflown päätepiste, joka palauttaa vastauksen kutsujalle. Viittaa aina edelliseen solmuun sen tunnisteen avulla – älä koskaan käytä `$input`-viitettä.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 (valinnainen, asynkronista jälkikäsittelyä varten) |
| Tuloste | Palauttaa `message`-arvon kutsujalle |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `message` | lauseke | Tulostusarvo. **Täytyy** viitata edelliseen solmuun: `$edellisenSolmunTunniste.kenttä` |
| `allowDownstream` | totuusarvo | Jos tosi, tulostuksen jälkeiset solmut suoritetaan asynkronisesti vastauksen lähettämisen jälkeen |

## Agenttityökalun käyttö

Kun Tulostus-solmu on kytketty [Agenttisolmuun](./agent-node.md) canvas-työkaluna, `message`-kenttä voidaan merkitä **agentin toimittamaksi** bottikuvakkeella. Agentti toimittaa viestin kutsuttaessa työkalua. Jos Tulostus-solmu ei ole kytketty agenttityökaluna, bottikuvake piilotetaan.

## Kriittinen sääntö

**Älä koskaan käytä `$input`-viitettä tulostussolussa.** Käytä aina edellisen solmun tunnistetta:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$käsitteleData.text"` (missä `käsitteleData` on edellisen solmun tunniste)

## Asynkroninen jälkikäsittely

Kun `allowDownstream: true`, vastaus palautetaan välittömästi. Tulostuksen jälkeen kytketyt solmut suoritetaan taustalla (esim. Slack-ilmoitukset, lokitus). Koska jälkikäsittelyketju voi päättyä myöhemmin, jälkikäsittelyn epäonnistuminen voi muuttaa tallennetun suorituksen tilan `error`-tilaksi, vaikka vastaus on jo palautettu; lopullinen historia ja analytiikka heijastavat tätä myöhempää lopputulosta.

## Esimerkki

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Esimerkki – asynkronisella jälkikäsittelyllä

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Kytke tämän jälkeen [Telegram](./telegram-node.md)-, [Slack](./slack-node.md)- tai muu solmu tulostuksen jälkeen fire-and-forget-ilmoituksia varten.

## Liittyvät

- [JSON-tulostuskartta](./json-output-mapper-node.md) – Juuri-JSON-keho ilman `result`-käärettä, kun se on ainoa päätepiste
- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Lausekkeiden DSL](../reference/expression-dsl.md) – Viittaus solmujen tulosteisiin
- [Lausekkeiden arviointidialogi](../reference/expression-evaluation-dialog.md) – Laajennettava editori live-esikatselulla message-kentälle
- [Workflown rakenne](../reference/workflow-structure.md) – JSON-muoto
