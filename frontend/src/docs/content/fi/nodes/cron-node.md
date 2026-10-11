# Cron

**Cron**-solmu käynnistää workflown aikataulun mukaisesti käyttäen cron-lauseketta. Käyttäjän syöttöä ei vaadita – workflow suoritetaan automaattisesti määritetyin ajoin.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 0 |
| Tulosteet | 1 |
| Tulos | Trigger-tapahtuma (ei payloadia) |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `cronExpression` | merkkijono | Cron-lauseke (esim. `0 * * * *` tunti välein) |

## Cron-lausekkeen Muoto

Standardi 5-kenttäinen cron: `minuutti tunti päivä kuukausi viikonpäivä`

| Kenttä | Arvot | Esimerkki |
|-------|--------|---------|
| Minuutti | 0–59 | `0` = minuutilla 0 |
| Tunti | 0–23 | `*` = joka tunti |
| Kuukauden päivä | 1–31 | `*` = joka päivä |
| Kuukausi | 1–12 | `*` = joka kuukausi |
| Viikonpäivä | 0–7 (0 ja 7 = sunnuntai) | `*` = joka päivä |

**Yleisiä esimerkkejä:**

- `0 * * * *` – joka tunti
- `0 0 * * *` – päivittäin keskiyöllä
- `*/15 * * * *` – 15 minuutin välein
- `0 9 * * 1-5` – arkipäivisin kello 9:00

## Esimerkki

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Aiheeseen Liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Triggerit](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Solmun Poistaminen Käytöstä](./disable-node.md) – Pysäytä cron-triggeri ehdon täyttyessä
- [Solmun Ota Käyttöön](./enable-node.md) – Käynnistä pois käytöstä ollut cron-triggeri uudelleen
