# Veakäsitleja

**Veakäsitleja** node püüab kinni kõikide workflow'de sõlmede vead. Kui see on olemas, käivitub see automaatselt, kui mõni sõlm ebaõnnestub. Sissetulevaid ühendusi pole vaja—selle käivitab workflow mootor.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 (käivitub vea korral) |
| Väljundid | 1 |
| Väljund | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Node'i identifikaator (camelCase) |
| `message` | expression | Valikuline. Vaikeväärtus: `$error.message` |

## Vea kontekst

Kui veakäsitleja käivitub, on saadaval järgmised väljad:

| Väli | Kirjeldus |
|-------|-------------|
| `$errorHandler.error` | Veateate string |
| `$errorHandler.errorNode` | Ebaõnnestunud sõlme label |
| `$errorHandler.errorNodeType` | Ebaõnnestunud sõlme tüüp |
| `$errorHandler.timestamp` | Vea toimumise aeg |

## Kasutusjuhud

- Saatke [Telegram](./telegram-node.md), [Slack](./slack-node.md) või [Send Email](./send-email-node.md) teavitusi ebaõnnestumise korral
- Logige vead välistesse süsteemidesse
- Tagastage kohandatud veavastus [Output](./output-node.md) kaudu

Ainult üks veakäsitleja workflow kohta.

## Näide

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Ühendage Output'iga kohandatud veavastuse jaoks:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Või ühendage Slack'iga teavituste jaoks:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõikidest node'i tüüpidest
- [Telegram Node](./telegram-node.md) – Teavita vea korral
- [Slack Node](./slack-node.md) – Teavita vea korral
- [Send Email Node](./send-email-node.md) – E-posti teavitused
- [Throw Error Node](./throw-error-node.md) – Tahtlikud vead
