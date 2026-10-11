# Slack

Uzel **Slack** odesílá zprávu do kanálu Slack prostřednictvím Incoming Webhook. Použijte jej pro oznámení, výstrahy a hlášení chyb.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | Předává vstup dále |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaj Slack (webhook URL) z [Přihlašovacích údajů](../tabs/credentials-tab.md) |
| `message` | expression | Text zprávy. Podporuje [expressions](../reference/expression-dsl.md). |

## Nastavení

1. Vytvořte Incoming Webhook ve svém pracovním prostoru Slack
2. Přidejte přihlašovací údaj Slack na kartě Přihlašovací údaje s webhook URL
3. Odkažte se na přihlašovací údaj v uzlu

## Příklad

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

Použijte s [Error Handler](./error-handler-node.md) pro oznámení o selhání:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Zabezpečení odchozího provozu

- Webhook URL uložená v přihlašovacím údaji musí používat `http://` nebo `https://` a překládat se pouze na veřejné adresy. Cíle typu loopback, privátní, link-local, multicast a cloud-metadata jsou blokovány.
- Heym ověřuje přeložené adresy a před odesláním připne cíl připojení, takže odpověď DNS nemůže po kontrole přesunout požadavek na interní adresu. Zatímco je ochrana aktivní, proxy serverů prostředí jsou zakázány a přesměrování nejsou následována.
- Nasazení, která odesílají na interní webhook příjemce, mohou nastavit `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` na důvěryhodné self-hosted instanci. Na hostovaných nebo multi-tenant nasazeních ponechte výchozí hodnotu.

**Poznámka k upgradu na v0.0.109:** tato kontrola je pro Slack nová. Přihlašovací údaj, jehož webhook URL směřuje na loopback nebo privátní adresu, je odmítnut, pokud není výše uvedené nastavení povoleno.

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Error Handler](./error-handler-node.md) – Odeslání Slack při selhání workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Přidání Slack webhook
