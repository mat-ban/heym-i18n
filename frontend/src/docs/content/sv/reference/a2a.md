# A2A

Heym tillhandahåller **Heym Agent** via Agent2Agent-protokollet (A2A 1.0, JSON-RPC-bindning). Heym Agent är motorn bakom [Chat-fliken](../tabs/chat-tab.md); MCP-klienter når samma agent som verktyget `heym_chat` (se [MCP / A2A-fliken](../tabs/mcp-tab.md)). Med A2A aktiverat kan en annan agent skicka en Task på naturligt språk och få svar, med samma förmågor som Chat har.

## Aktivera

1. Öppna fliken **MCP / A2A**.
2. Aktivera **Heym Agent** på standardservern eller på en namngiven server och välj autentiseringsuppgift samt modell.
3. Markera **Aktivera A2A**. Kortet visar webbadressen till **Agent Card** samt **JSON-RPC Endpoint**.

A2A bygger på Heym Agent: om agenten inaktiveras stängs även A2A av.

## Endpoints

| | Standardserver | Namngiven server |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card kräver inga inloggningsuppgifter och namnger varken användare, server eller Workflow. Det existerar endast så länge A2A är aktiverat: domänkortet så länge minst en användare har A2A på för standardservern; en namngiven servers kort så länge den serverns A2A är på. I annat fall svarar adressen med 404.

## Autentisering

Skicka samma autentiseringsuppgifter som för MCP, uteslutande i rubriker (headers):

- `X-MCP-Key: <key>`: standardserverns nyckel eller den namngivna serverns nyckel
- `Authorization: Bearer <token>`: en OAuth Token från Heyms OAuth-server

Inloggningsuppgifter i URL:en avvisas. Agent Card deklarerar båda schemana så att en A2A-klient kan läsa dem från kortet.

## Metoder

| Metod | Beskrivning |
|---|---|
| `SendMessage` | Startar en Task eller fortsätter en som väntar på indata. Väntar på svar såvida inte `configuration.returnImmediately` är `true`. |
| `SendStreamingMessage` | Samma sak, som en Server-Sent Events-ström av uppgiftens framsteg och resultat. |
| `GetTask` | Status, svar och historik för en Task (`historyLength` begränsar historiken). |
| `ListTasks` | Dina Tasks på denna server, nyast först, filtrerade efter `contextId` eller `status`, med `pageSize` och `pageToken`. |
| `CancelTask` | Avbryter en Task som fortfarande körs eller väntar. |
| `SubscribeToTask` | Följer en Task som fortfarande bearbetas. |
| `GetExtendedAgentCard` | Kortet med serverns namn och dess tilldelade Workflows som färdigheter. |

Push-meddelanden erbjuds inte: kortet anger `pushNotifications: false`, och push-metoderna svarar med `PushNotificationNotSupportedError`. Förfrågningar använder A2A 1.0; skicka `A2A-Version: 1.0`. Metodnamn från A2A 0.3 som `message/send` svarar med `VersionNotSupportedError`.

## Tasks och konversationer

Varje Task utgör en konversation i Chat-fliken, markerad med en nätverksikon. Uppgiftens `contextId` är den konversationen: skicka ett nytt meddelande med samma `contextId` och utan `taskId` för att fortsätta den.

| Vad agenten gjorde | Task-status |
|---|---|
| Svarade | `TASK_STATE_COMPLETED`, med svaret som text och, om några sparats, länkarna till Workflows och utvärderingssviter som data |
| Ställde en förtydligande fråga | `TASK_STATE_INPUT_REQUIRED`: svara med samma `taskId` |
| Kräver autentiseringsuppgift | `TASK_STATE_AUTH_REQUIRED`: statusmeddelandet innehåller en länk till Heyms sida för inloggningsuppgifter. Användaren öppnar den i en webbläsare inloggad på Heym; värdet passerar aldrig genom den andra agenten. Skicka sedan ett meddelande i samma Task för att fortsätta. |
| Misslyckades | `TASK_STATE_FAILED`, med orsak |
| Avbröts | `TASK_STATE_CANCELED` |

Ett meddelande till en avslutad Task eller till en som fortfarande bearbetas avvisas med `UnsupportedOperationError`. Meddelanden tar emot `text`- och `data`-delar, upp till 20 000 tecken sammanlagt; fildelar avvisas, så skicka filer som länkar.

## Framsteg

Medan en Task bearbetas skickar strömmen en statusuppdatering för varje steg, med de ord som visas i Chat-fliken, till exempel `Running workflow "Invoice Parser"` eller `Testing the workflow · attempt 2/5`. MCP-klienter får samma steg som `notifications/progress` från `heym_chat`.

## Exempel

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

## Begränsningar

- `CancelTask` stoppar omedelbart en pågående omgång på den körande Heym-instansen, precis som Stopp-knappen i Chat-fliken gör. På andra ställen markeras uppgiften som avbruten och omgångens sena resultat sparas inte.
- Inga push-meddelanden, ingen REST- eller gRPC-bindning, inga signerade Agent Cards.

## Relaterat

- [MCP / A2A-fliken](../tabs/mcp-tab.md): aktivera Heym Agent och A2A
- [Chat-fliken](../tabs/chat-tab.md): motorn bakom agenten
- [Säkerhet](./security.md): hur nycklar lagras
