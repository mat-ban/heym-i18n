# Konsoli-loki

**Konsoli-loki** -solmu kirjaa arvon palvelimen konsoliin. Käytä sitä virheenkorjaukseen ja tarkasteluun kehitysvaiheessa.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | Läpikulkee syötteen |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `logMessage` | lauseke | Kirjattava arvo. Tukee [lausekkeita](../reference/expression-dsl.md). |

## Esimerkki

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Tuloste näkyy palvelinlokeissa (esim. terminaalitulosteessa `uvicorn`-ajon aikana).

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Lokit-välilehti](../tabs/logs-tab.md) – Sovelluslokien tarkastelu
