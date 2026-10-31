# A2A

Heym udbyder **Heym Agent** via Agent2Agent-protokollen (A2A 1.0, JSON-RPC-binding). Heym Agent er motoren bag [Chat-fanen](../tabs/chat-tab.md); MCP-klienter tilgår den samme agent som værktøjet `heym_chat` (se [MCP / A2A-fanen](../tabs/mcp-tab.md)). Med A2A slået til kan en anden agent sende en Task i naturligt sprog og modtage svaret med de samme egenskaber, som Chat har.

## Aktivering

1. Åbn fanen **MCP / A2A**.
2. Slå **Heym Agent** til på standardserveren eller på en navngiven server, og vælg dens legitimationsoplysninger og model.
3. Markér **Aktivér A2A**. Kortet viser webadressen til **Agent Card** og **JSON-RPC Endpoint**.

A2A bygger oven på Heym Agent: deaktivering af agenten slår også A2A fra.

## Endpoints

| | Standardserver | Navngiven server |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card kræver ingen legitimationsoplysninger og navngiver hverken bruger, server eller Workflow. Det findes kun, mens A2A er slået til: domænekortet, så længe mindst én bruger har A2A slået til for standardserveren; en navngiven servers kort, så længe denne servers A2A er slået til. Ellers svarer adressen med 404.

## Godkendelse

Send de samme legitimationsoplysninger som for MCP, udelukkende i headers:

- `X-MCP-Key: <key>`: standardserverens nøgle eller den navngivne servers nøgle
- `Authorization: Bearer <token>`: en OAuth Token fra Heyms OAuth-server

Legitimationsoplysninger i URL'en afvises. Agent Card erklærer begge ordninger, så en A2A-klient kan læse dem direkte fra kortet.

## Metoder

| Metode | Beskrivelse |
|---|---|
| `SendMessage` | Starter en Task eller fortsætter en, der venter på input. Venter på svar, medmindre `configuration.returnImmediately` er `true`. |
| `SendStreamingMessage` | Det samme som en Server-Sent Events-strøm over opgavens fremskridt og resultat. |
| `GetTask` | Status, svar og historik for en Task (`historyLength` begrænser historikken). |
| `ListTasks` | Dine Tasks på denne server, nyeste først, filtreret efter `contextId` eller `status`, med `pageSize` og `pageToken`. |
| `CancelTask` | Stopper en Task, der stadig arbejder eller venter. |
| `SubscribeToTask` | Følger en Task, der stadig arbejder. |
| `GetExtendedAgentCard` | Kortet med serverens navn og dens tildelte Workflows som færdigheder. |

Push-notifikationer tilbydes ikke: kortet angiver `pushNotifications: false`, og push-metoderne svarer med `PushNotificationNotSupportedError`. Anmodninger anvender A2A 1.0; send `A2A-Version: 1.0`. Metodenavne fra A2A 0.3 såsom `message/send` svarer med `VersionNotSupportedError`.

## Tasks og samtaler

Hver Task er en samtale i Chat-fanen, markeret med et netværksikon. Opgavens `contextId` er denne samtale: send en ny besked med det samme `contextId` og uden `taskId` for at fortsætte den.

| Hvad agenten gjorde | Task-tilstand |
|---|---|
| Svarede | `TASK_STATE_COMPLETED`, med svaret som tekst og, hvis der er gemt nogen, links til Workflows og evalueringspakker som data |
| Stillede et opklarende spørgsmål | `TASK_STATE_INPUT_REQUIRED`: svar med det samme `taskId` |
| Kræver legitimationsoplysning | `TASK_STATE_AUTH_REQUIRED`: statusmeddelelsen indeholder et link til Heyms legitimationsside. Brugeren åbner det i en browser logget ind på Heym; værdien passerer aldrig igennem den anden agent. Send derefter en besked på samme Task for at fortsætte. |
| Mislykkedes | `TASK_STATE_FAILED`, med begrundelse |
| Blev annulleret | `TASK_STATE_CANCELED` |

En besked til en afsluttet Task eller til en, der stadig arbejder, afvises med `UnsupportedOperationError`. Beskeder modtager `text`- og `data`-dele, op til 20.000 tegn i alt; fildele afvises, så send filer som links.

## Fremskridt

Mens en Task arbejder, sender strømmen en statusopdatering for hvert trin, med de ord Chat-fanen viser, for eksempel `Running workflow "Invoice Parser"` eller `Testing the workflow · attempt 2/5`. MCP-klienter modtager de samme trin som `notifications/progress` fra `heym_chat`.

## Eksempel

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

## Begrænsninger

- `CancelTask` stopper øjeblikkeligt en igangværende tur på den udførende Heym-instans, ligesom Stop-knappen i Chat-fanen. Andre steder markeres opgaven som annulleret, og turens sene resultat registreres ikke.
- Ingen push-notifikationer, ingen REST- eller gRPC-binding, ingen signerede Agent Cards.

## Relateret

- [MCP / A2A-fanen](../tabs/mcp-tab.md): slå Heym Agent og A2A til
- [Chat-fanen](../tabs/chat-tab.md): motoren bag agenten
- [Sikkerhed](./security.md): hvordan nøgler opbevares
