# Discord

Węzeł **Discord** wysyła wiadomość do kanału Discord za pośrednictwem Incoming Webhook. Należy go używać do alertów, powiadomień o workflow, odpowiedzi w stylu bota oraz raportowania błędów.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania `discord` zawierające URL incoming webhook |
| `message` | expression | Tekst wiadomości wychodzącej. Obsługuje [wyrażenia](../reference/expression-dsl.md). |
| `username` | expression | Opcjonalne nadpisanie nazwy wyświetlanej dla tej wiadomości |
| `avatarUrl` | expression | Opcjonalne nadpisanie URL awatara dla tej wiadomości |

## Konfiguracja

1. Utwórz [dane logowania Discord Webhook](../reference/integrations.md#discord)
2. Dodaj węzeł **Discord** do swojego workflow
3. Wybierz dane logowania
4. Ustaw `message` na tekst wychodzący lub szablon zbudowany z danych pochodzących z węzłów poprzedzających
5. Opcjonalnie nadpisz wyświetlaną nazwę `username` oraz `avatarUrl`

## Przykład

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Pola wyjściowe

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.status` | Kod statusu HTTP zwrócony przez Discord, zazwyczaj `204` w przypadku sukcesu |
| `$nodeLabel.response` | Surowa treść odpowiedzi zwrócona przez webhook Discord |
| `$nodeLabel.message` | Tekst wiadomości wysłanej przez Heym |
| `$nodeLabel.username` | Nazwa użytkownika wysłana wraz z webhook, jeśli została podana |
| `$nodeLabel.avatar_url` | URL awatara wysłany wraz z webhook, jeśli został podany |

## Typowe wzorce

- Należy go używać razem z [Discord Trigger](./discord-trigger-node.md), gdy potrzebna jest dodatkowa publikacja na kanale poza odpowiedzią na interakcję
- Wysyłanie powiadomień o błędach z [Error Handler](./error-handler-node.md)
- Publikowanie podsumowań generowanych przez [LLM](./llm-node.md) lub [Agent](./agent-node.md)

## Bezpieczeństwo ruchu wychodzącego

- URL webhook przechowywany w danych logowania musi używać `http://` lub `https://` i wskazywać wyłącznie adresy publiczne. Miejsca docelowe typu loopback, prywatne, link-local, multicast oraz cloud-metadata są blokowane.
- Heym weryfikuje rozwiązane adresy i przypina cel połączenia przed wysłaniem, dzięki czemu odpowiedź DNS nie może przenieść żądania na adres wewnętrzny po zakończeniu sprawdzania. Proxy środowiskowe są wyłączane, gdy mechanizm ochronny jest aktywny, a przekierowania nie są śledzone.
- Wdrożenia wysyłające żądania do wewnętrznego odbiorcy webhook mogą ustawić `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` na zaufanej instancji self-hosted. W przypadku wdrożeń hostowanych lub wielodostępnych należy pozostawić ustawienie domyślne.

**Uwaga dotycząca aktualizacji do v0.0.109:** to sprawdzenie jest nowe dla Discord. Dane logowania, których URL webhook wskazuje na loopback lub adres prywatny, są odrzucane, chyba że powyższe ustawienie zostanie włączone.

## Powiązane

- [Discord Trigger](./discord-trigger-node.md) – Uruchamianie workflow na podstawie przychodzących interakcji Discord
- [Third-Party Integrations](../reference/integrations.md) – Konfiguracja danych logowania Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Dodawanie i zarządzanie danymi logowania `discord`
- [Node Types](../reference/node-types.md) – Przegląd wszystkich typów węzłów
