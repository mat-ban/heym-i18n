# A2A

Heym udostępnia **Heym Agent** za pośrednictwem protokołu Agent2Agent (A2A 1.0, wiązanie JSON-RPC). Heym Agent to silnik napędzający [zakładkę Chat](../tabs/chat-tab.md); klienci MCP uzyskują dostęp do tego samego agenta jako narzędzia `heym_chat` (zob. [zakładka MCP / A2A](../tabs/mcp-tab.md)). Po włączeniu A2A inny agent może przesłać mu Task w języku naturalnym i otrzymać odpowiedź, korzystając z tych samych możliwości, co Chat.

## Włączanie

1. Otwórz zakładkę **MCP / A2A**.
2. Włącz **Heym Agent** na serwerze domyślnym lub nazwanym, a następnie wybierz poświadczenie i model.
3. Zaznacz pole **Włącz A2A**. Karta wyświetli adres URL **Agent Card** oraz **Endpoint JSON-RPC**.

A2A bazuje na Heym Agent: wyłączenie agenta powoduje również wyłączenie A2A.

## Endpoints

| | Serwer domyślny | Serwer nazwany |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card nie wymaga poświadczeń i nie wskazuje użytkownika, serwera ani Workflow. Istnieje tylko wtedy, gdy A2A jest włączone: karta domeny tak długo, jak przynajmniej jeden użytkownik ma włączone A2A dla serwera domyślnego, a karta serwera nazwanego tak długo, jak A2A tego serwera pozostaje aktywne. W przeciwnym razie adres odpowiada kodem 404.

## Uwierzytelnianie

Przesyłaj te same poświadczenia co w przypadku MCP, wyłącznie w nagłówkach:

- `X-MCP-Key: <key>`: klucz serwera domyślnego lub klucz serwera nazwanego
- `Authorization: Bearer <token>`: Token OAuth z serwera OAuth Heym

Poświadczenia podane w adresie URL są odrzucane. Agent Card deklaruje oba schematy, dzięki czemu klient A2A może odczytać je bezpośrednio z karty.

## Metody

| Metoda | Opis działania |
|---|---|
| `SendMessage` | Uruchamia Task lub kontynuuje oczekującą na dane wejściowe. Oczekuje na odpowiedź, chyba że parametr `configuration.returnImmediately` ma wartość `true`. |
| `SendStreamingMessage` | To samo w postaci strumienia Server-Sent Events z postępem i wynikiem Task. |
| `GetTask` | Stan, odpowiedź i historia danej Task (`historyLength` ogranicza wielkość historii). |
| `ListTasks` | Twoje Tasks na tym serwerze, od najnowszych, filtrowane według `contextId` lub `status`, z parametrami `pageSize` i `pageToken`. |
| `CancelTask` | Zatrzymuje Task, która nadal trwa lub oczekuje. |
| `SubscribeToTask` | Śledzi trwającą Task. |
| `GetExtendedAgentCard` | Karta zawierająca nazwę serwera i przypisane do niego Workflows jako umiejętności. |

Powiadomienia push nie są oferowane: karta wskazuje `pushNotifications: false`, a metody push zwracają błąd `PushNotificationNotSupportedError`. Żądania używają A2A 1.0; przesyłaj nagłówek `A2A-Version: 1.0`. Nazwy metod z wersji A2A 0.3, takie jak `message/send`, zwracają `VersionNotSupportedError`.

## Tasks i konwersacje

Każda Task stanowi konwersację w zakładce Chat, oznaczoną ikoną sieci. Wartość `contextId` danej Task to ta konwersacja: wyślij nową wiadomość z tym samym `contextId` i bez `taskId`, aby ją kontynuować.

| Co wykonał agent | Stan Task |
|---|---|
| Udzielił odpowiedzi | `TASK_STATE_COMPLETED`, z odpowiedzią w formie tekstu oraz, jeśli zostały zapisane, linkami do Workflows i zestawów ewaluacyjnych jako danymi |
| Zadano pytanie uściślające | `TASK_STATE_INPUT_REQUIRED`: odpowiedz z tym samym `taskId` |
| Wymaga poświadczenia | `TASK_STATE_AUTH_REQUIRED`: komunikat stanu zawiera łącze do strony poświadczeń Heym. Użytkownik otwiera je w przeglądarce zalogowanej w Heym; wartość ta nigdy nie przechodzi przez drugiego agenta. Następnie wyślij wiadomość w tej samej Task, aby kontynuować. |
| Zakończono niepowodzeniem | `TASK_STATE_FAILED`, z podaniem przyczyny |
| Anulowano | `TASK_STATE_CANCELED` |

Wiadomość wysłana do zakończonej Task lub do Task będącej w trakcie przetwarzania jest odrzucana z błędem `UnsupportedOperationError`. Wiadomości przyjmują części `text` i `data`, łącznie do 20 000 znaków; części plikowe są odrzucane, dlatego pliki należy przesyłać jako łącza.

## Postęp

Podczas wykonywania Task strumień przesyła aktualizację stanu dla każdego kroku, posługując się treściami znanymi z zakładki Chat, na przykład `Running workflow "Invoice Parser"` lub `Testing the workflow · attempt 2/5`. Klienci MCP otrzymują te same kroki jako `notifications/progress` z `heym_chat`.

## Przykład

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## Ograniczenia

- `CancelTask` natychmiast zatrzymuje trwającą turę na wykonującej ją instancji Heym, analogicznie do przycisku Stop w zakładce Chat. W innych węzłach Task jest oznaczana jako anulowana, a spóźniony wynik tury nie jest zapisywany.
- Brak powiadomień push, brak wiązania REST lub gRPC, brak podpisanych kart Agent Cards.

## Powiązane

- [Zakładka MCP / A2A](../tabs/mcp-tab.md): włączanie Heym Agent i A2A
- [Zakładka Chat](../tabs/chat-tab.md): silnik napędzający agenta
- [Bezpieczeństwo](./security.md): sposób przechowywania kluczy
