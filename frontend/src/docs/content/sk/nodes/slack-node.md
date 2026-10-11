# Slack

Uzol **Slack** odosiela správu do kanála Slack prostredníctvom Incoming Webhook. Použite ho na notifikácie, upozornenia a hlásenie chýb.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | Prechádza vstupom |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje Slack (webhook URL) z [Prihlasovacích údajov](../tabs/credentials-tab.md) |
| `message` | expression | Text správy. Podporuje [expressions](../reference/expression-dsl.md). |

## Nastavenie

1. Vytvorte Incoming Webhook vo svojom pracovnom priestore Slack
2. Pridajte prihlasovacie údaje Slack na karte Prihlasovacie údaje s webhook URL
3. Odkážte na prihlasovacie údaje v uzle

## Príklad

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Použite s [Error Handler](./error-handler-node.md) na notifikácie o zlyhaní:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Bezpečnosť odchádzajúceho prenosu

- Webhook URL uložená v prihlasovacích údajoch musí používať `http://` alebo `https://` a musí sa prekladať iba na verejné adresy. Loopback, súkromné, link-local, multicast a cloud-metadata destinácie sú blokované.
- Heym overuje preložené adresy a pred odoslaním pripína cieľ pripojenia, takže odpoveď DNS nemôže po kontrole presunúť požiadavku na internú adresu. Environment proxies sú počas aktívnej ochrany zakázané a presmerovania sa nesledujú.
- Nasadenia, ktoré odosielajú na interný webhook prijímač, môžu nastaviť `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` na dôveryhodnej self-hosted inštancii. Na hostovaných alebo multi-tenant nasadeniach ponechajte predvolené nastavenie.

**Poznámka k aktualizácii pre v0.0.109:** táto kontrola je pre Slack nová. Prihlasovacie údaje, ktorých webhook URL smeruje na loopback alebo súkromnú adresu, sú odmietnuté, pokiaľ nie je povolené vyššie uvedené nastavenie.

## Súvisiace

- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Error Handler](./error-handler-node.md) – Odoslanie Slack pri zlyhaní workflowu
- [Credentials Tab](../tabs/credentials-tab.md) – Pridanie Slack webhooku
