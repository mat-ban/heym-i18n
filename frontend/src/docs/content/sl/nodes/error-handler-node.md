# Obvladovalec napak

**Obvladovalec napak** je vozlišče, ki zajame napake iz kateregakoli vozlišča v workflowu. Ko je prisoten, se samodejno izvede, ko katero koli vozlišče ne uspe. Ni potrebnih vhodnih povezav—aktivira ga motor workflowa.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 0 (aktivira se ob napaki) |
| Izhodi | 1 |
| Izhod | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `message` | izraz | Neobvezno. Privzeto: `$error.message` |

## Kontekst napake

Ko se obvladovalec napak izvede, so na voljo naslednja polja:

| Polje | Opis |
|-------|-------------|
| `$errorHandler.error` | Niz sporočila o napaki |
| `$errorHandler.errorNode` | Oznaka vozlišča, ki je odpovedalo |
| `$errorHandler.errorNodeType` | Tip odpovedanega vozlišča |
| `$errorHandler.timestamp` | Čas, ko je prišlo do napake |

## Uporabniški primeri

- Pošljite obvestila preko [Telegram](./telegram-node.md), [Slack](./slack-node.md) ali [Pošlji e-pošto](./send-email-node.md) ob neuspehu
- Zabeležite napake v zunanje sisteme
- Vrnite prilagojen odgovor o napaki preko [Izhoda](./output-node.md)

Na voljo je le en Obvladovalec napak na workflow.

## Primer

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Povežite z Izhodom za prilagojen odgovor o napaki:
```json
{"message": "Napaka: $errorHandler.error pri $errorHandler.errorNode"}
```

Ali povežite s Slackom za obvestila:
```json
{"message": "Workflow je neuspešno deloval: $errorHandler.error v $errorHandler.errorNode"}
```

## Sorodno

- [Tipi vozlišč](../reference/node-types.md) – Pregled vseh tipov vozlišč
- [Telegram vozlišče](./telegram-node.md) – Obvestilo ob napaki
- [Slack vozlišče](./slack-node.md) – Obvestilo ob napaki
- [Pošlji e-pošto vozlišče](./send-email-node.md) – E-poštna opozorila
- [Vrzi napako vozlišče](./throw-error-node.md) – Namerno povzročene napake
