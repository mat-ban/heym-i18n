# A2A

Heym stelt de **Heym Agent** beschikbaar via het Agent2Agent-protocol (A2A 1.0, JSON-RPC-binding). De Heym Agent vormt de motor achter het [Chat-tabblad](../tabs/chat-tab.md); MCP-clients benaderen dezelfde agent via de `heym_chat`-tool (zie het [MCP / A2A-tabblad](../tabs/mcp-tab.md)). Wanneer A2A is ingeschakeld, kan een andere agent een Task in natuurlijke taal verzenden en het antwoord ontvangen, met exact dezelfde mogelijkheden als Chat.

## Inschakelen

1. Open het tabblad **MCP / A2A**.
2. Schakel de **Heym Agent** in op de standaardserver of op een benoemde server, en kies de bijbehorende inloggegevens en het model.
3. Vink **A2A inschakelen** aan. De kaart toont de URL van de **Agent Card** en het **JSON-RPC-Endpoint**.

A2A bouwt voort op de Heym Agent: het uitschakelen van de agent schakelt A2A automatisch eveneens uit.

## Endpoints

| | Standaardserver | Benoemde server |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

De Agent Card vereist geen inloggegevens en vermeldt geen gebruiker, server of Workflow. Deze bestaat uitsluitend zolang A2A actief is: de domeinkaart zolang minstens één gebruiker A2A heeft ingeschakeld voor de standaardserver, de kaart van een benoemde server zolang A2A voor die server actief is. In andere gevallen retourneert het adres een 404.

## Authenticatie

Verzend dezelfde inloggegevens als voor MCP, uitsluitend in headers:

- `X-MCP-Key: <key>`: de sleutel van de standaardserver of de sleutel van de benoemde server
- `Authorization: Bearer <token>`: een OAuth-Token afkomstig van de Heym OAuth-server

Inloggegevens in de URL worden geweigerd. De Agent Card declareert beide schema's, zodat een A2A-client deze uit de kaart kan uitlezen.

## Methoden

| Methode | Beschrijving |
|---|---|
| `SendMessage` | Start een Task of vervolgt een Task die wacht op invoer. Wacht op het antwoord tenzij `configuration.returnImmediately` de waarde `true` heeft. |
| `SendStreamingMessage` | Hetzelfde, als een Server-Sent Events-stream van de voortgang en het resultaat van de Task. |
| `GetTask` | Status, antwoord en geschiedenis van een Task (`historyLength` begrenst de geschiedenis). |
| `ListTasks` | Uw Tasks op deze server, nieuwste eerst, gefilterd op `contextId` of `status`, met `pageSize` en `pageToken`. |
| `CancelTask` | Stopt een Task die nog in uitvoering is of wacht. |
| `SubscribeToTask` | Volgt een Task die nog in uitvoering is. |
| `GetExtendedAgentCard` | De kaart met de naam van de server en de toegewezen Workflows als vaardigheden. |

Push-meldingen worden niet aangeboden: de kaart vermeldt `pushNotifications: false`, en push-methoden beantwoorden met `PushNotificationNotSupportedError`. Verzoeken gebruiken A2A 1.0; verzend `A2A-Version: 1.0`. A2A 0.3-methodenamen zoals `message/send` beantwoorden met `VersionNotSupportedError`.

## Tasks en conversaties

Elke Task is een conversatie in het Chat-tabblad, gemarkeerd met een netwerkpictogram. De `contextId` van de Task komt overeen met die conversatie: stuur een nieuw bericht met dezelfde `contextId` en zonder `taskId` om deze voort te zetten.

| Wat de agent deed | Task-status |
|---|---|
| Beantwoord | `TASK_STATE_COMPLETED`, met het antwoord als tekst en, indien opgeslagen, links naar Workflows en evaluatiesuites als data |
| Stelde een verduidelijkende vraag | `TASK_STATE_INPUT_REQUIRED`: antwoord met hetzelfde `taskId` |
| Vereist inloggegevens | `TASK_STATE_AUTH_REQUIRED`: het statusbericht bevat een koppeling naar de pagina met inloggegevens van Heym. De gebruiker opent deze in een browser ingelogd bij Heym; de waarde passeert nooit de andere agent. Verzend vervolgens een bericht binnen dezelfde Task om door te gaan. |
| Mislukt | `TASK_STATE_FAILED`, met de reden |
| Geannuleerd | `TASK_STATE_CANCELED` |

Een bericht aan een voltooide Task of aan een Task die nog wordt uitgevoerd, wordt geweigerd met `UnsupportedOperationError`. Berichten accepteren `text`- en `data`-onderdelen, tot maximaal 20.000 tekens gecombineerd; bestandsonderdelen worden geweigerd, verzend bestanden daarom als links.

## Voortgang

Tijdens het uitvoeren van een Task verzendt de stream een statusupdate voor elke stap, in de bewoordingen van het Chat-tabblad, bijvoorbeeld `Running workflow "Invoice Parser"` of `Testing the workflow · attempt 2/5`. MCP-clients ontvangen dezelfde stappen als `notifications/progress` via `heym_chat`.

## Voorbeeld

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

## Beperkingen

- `CancelTask` stopt een actieve cyclus onmiddellijk op de uitvoerende Heym-instantie, net zoals de Stop-knop in het Chat-tabblad. Elders wordt de Task gemarkeerd als geannuleerd en wordt het late resultaat niet opgeslagen.
- Geen push-meldingen, geen REST- of gRPC-binding, geen ondertekende Agent Cards.

## Gerelateerd

- [MCP / A2A-tabblad](../tabs/mcp-tab.md): de Heym Agent en A2A inschakelen
- [Chat-tabblad](../tabs/chat-tab.md): de motor achter de agent
- [Beveiliging](./security.md): veilige opslag van sleutels
