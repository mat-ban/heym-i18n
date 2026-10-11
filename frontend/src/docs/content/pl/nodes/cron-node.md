# Cron

Węzeł **Cron** uruchamia workflow zgodnie z harmonogramem przy użyciu wyrażenia cron. Nie jest wymagane żadne działanie użytkownika — workflow uruchamia się automatycznie w określonych momentach.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 |
| Wyjścia | 1 |
| Wyjście | Zdarzenie triggera (bez payloadu) |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `cronExpression` | string | Wyrażenie cron (np. `0 * * * *` dla uruchomienia co godzinę) |

## Format wyrażenia cron

Standardowy 5-polowy cron: `minuta godzina dzień-miesiąca miesiąc dzień-tygodnia`

| Pole | Wartości | Przykład |
|-------|--------|---------|
| Minuta | 0–59 | `0` = w minucie 0 |
| Godzina | 0–23 | `*` = co godzinę |
| Dzień miesiąca | 1–31 | `*` = codziennie |
| Miesiąc | 1–12 | `*` = co miesiąc |
| Dzień tygodnia | 0–7 (0 i 7 = niedziela) | `*` = codziennie |

**Typowe przykłady:**

- `0 * * * *` – co godzinę
- `0 0 * * *` – codziennie o północy
- `*/15 * * * *` – co 15 minut
- `0 9 * * 1-5` – w dni robocze o 9:00

## Przykład

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Triggery](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Węzeł Disable](./disable-node.md) – Zatrzymanie triggera cron po spełnieniu warunku
- [Węzeł Enable](./enable-node.md) – Ponowne uruchomienie wyłączonego triggera cron
