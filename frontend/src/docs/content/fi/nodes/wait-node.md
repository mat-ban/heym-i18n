# Odota

**Odota**-solmu keskeyttää workflown suorituksen määritellyksi ajaksi. Sitä voidaan käyttää esimerkiksi nopeudenrajoituksiin, viivästettyihin toimenpiteisiin tai säännölliseen tarkistukseen.

## Yleiskatsaus

| Ominaisuus | Arvo |
|-----------|------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | Välittää syötteen läpi |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|--------|---------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `duration` | numero | Viive millisekunteina (esim. 1000 = 1 sekunti). Editori hyväksyy arvot 1–900000 (15 minuuttia) |

## Esimerkki

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Loop-solmu](./loop-node.md) – Käytä Odota-solmua silmukoissa nopeudenrajoitusten toteuttamiseen
