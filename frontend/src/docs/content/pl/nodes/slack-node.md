# Slack

Węzeł **Slack** wysyła wiadomość do kanału Slack poprzez Incoming Webhook. Należy go używać do powiadomień, alertów i raportowania błędów.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | Przekazuje dane wejściowe dalej |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania Slack (adres URL webhooka) z zakładki [Dane logowania](../tabs/credentials-tab.md) |
| `message` | expression | Treść wiadomości. Obsługuje [wyrażenia](../reference/expression-dsl.md). |

## Konfiguracja

1. Utwórz Incoming Webhook w obszarze roboczym Slack
2. Dodaj dane logowania Slack w zakładce Dane logowania wraz z adresem URL webhooka
3. Odwołaj się do danych logowania w węźle

## Przykład

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

Użycie z [Error Handler](./error-handler-node.md) do powiadomień o błędach:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Bezpieczeństwo ruchu wychodzącego

- Adres URL webhooka przechowywany w danych logowania musi używać protokołu `http://` lub `https://` i prowadzić wyłącznie do adresów publicznych. Miejsca docelowe typu loopback, prywatne, link-local, multicast oraz cloud-metadata są blokowane.
- Heym weryfikuje rozwiązane adresy i przypina cel połączenia przed wysłaniem, dzięki czemu odpowiedź DNS nie może przekierować żądania na adres wewnętrzny po zakończeniu sprawdzania. Proxy środowiskowe są wyłączane, gdy mechanizm ochronny jest aktywny, a przekierowania nie są śledzone.
- Wdrożenia wysyłające żądania do wewnętrznego odbiorcy webhooka mogą ustawić `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` na zaufanej instancji self-hosted. W przypadku wdrożeń hostowanych lub wielodostępnych należy pozostawić wartość domyślną.

**Uwaga dotycząca aktualizacji do wersji v0.0.109:** to sprawdzenie jest nowe dla węzła Slack. Dane logowania, których adres URL webhooka wskazuje na loopback lub adres prywatny, są odrzucane, o ile powyższe ustawienie nie zostanie włączone.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Error Handler](./error-handler-node.md) – Wysyłanie wiadomości Slack przy niepowodzeniu workflow
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodawanie webhooka Slack
