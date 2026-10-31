# A2A

Heym proporciona el **Heym Agent** mitjançant el protocol Agent2Agent (A2A 1.0, vinculació JSON-RPC). El Heym Agent és el motor que impulsa la [Pestanya Chat](../tabs/chat-tab.md); els clients MCP accedeixen al mateix agent com a l'eina `heym_chat` (vegeu la [Pestanya MCP / A2A](../tabs/mcp-tab.md)). Amb A2A activat, un altre agent pot enviar-li una Task en llenguatge natural i rebre la resposta, gaudint de les mateixes capacitats que Chat.

## Activació

1. Obriu la pestanya **MCP / A2A**.
2. Activeu el **Heym Agent** al servidor per defecte o a un servidor amb nom, i trieu les seves credencials i el model.
3. Marqueu **Activar A2A**. La targeta mostrarà l'URL de l'**Agent Card** i l'**Endpoint JSON-RPC**.

A2A depèn directament del Heym Agent: desactivar l'agent desactiva també A2A.

## Endpoints

| | Servidor per defecte | Servidor amb nom |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

L'Agent Card no requereix credencials i no menciona cap usuari, servidor ni Workflow. Només existeix mentre A2A estigui activat: la targeta de domini mentre almenys un usuari tingui A2A actiu al servidor per defecte; la targeta d'un servidor amb nom mentre A2A estigui actiu en aquest servidor. En cas contrari, l'adreça respondrà amb 404.

## Autenticació

Envieu les mateixes credencials que per a MCP, exclusivament a les capçaleres:

- `X-MCP-Key: <key>`: la clau del servidor per defecte o la clau del servidor amb nom
- `Authorization: Bearer <token>`: un Token OAuth del servidor OAuth de Heym

Les credencials a l'URL seran rebutjades. L'Agent Card declara ambdós esquemes, permetent que un client A2A les llegeixi directament des de la targeta.

## Mètodes

| Mètode | Descripció |
|---|---|
| `SendMessage` | Inicia una Task o en continua una que espera entrada. Espera la resposta tret que `configuration.returnImmediately` sigui `true`. |
| `SendStreamingMessage` | El mateix, com a flux Server-Sent Events del progrés de la Task i del seu resultat. |
| `GetTask` | Estat, resposta i historial d'una Task (`historyLength` limita l'historial). |
| `ListTasks` | Les vostres Tasks en aquest servidor, les més recents primer, filtrades per `contextId` o `status`, amb `pageSize` en `pageToken`. |
| `CancelTask` | Atura una Task que encara s'està executant o esperant. |
| `SubscribeToTask` | Segueix una Task en curs. |
| `GetExtendedAgentCard` | La targeta amb el nom del servidor i els seus Workflows assignats com a habilitats. |

No s'ofereixen notificacions push: la targeta indica `pushNotifications: false`, i els mètodes push responen amb `PushNotificationNotSupportedError`. Les sol·licituds utilitzen A2A 1.0; envieu `A2A-Version: 1.0`. Els noms de mètodes d'A2A 0.3 com ara `message/send` responen amb `VersionNotSupportedError`.

## Tasks i converses

Cada Task és una conversa a la pestanya Chat, indicada amb una icona de xarxa. El `contextId` de la Task és aquesta conversa: envieu un missatge nou amb el mateix `contextId` i sense `taskId` per continuar-la.

| Què ha fet l'agent | Estat de la Task |
|---|---|
| Ha respost | `TASK_STATE_COMPLETED`, amb la resposta en format text i, quan n'ha desat, els enllaços a Workflows i suites d'avaluació com a dades |
| Ha formulat una pregunta d'aclariment | `TASK_STATE_INPUT_REQUIRED`: responeu amb el mateix `taskId` |
| Requereix una credencial | `TASK_STATE_AUTH_REQUIRED`: el missatge d'estat conté un enllaç a la pàgina de credencials de Heym. L'usuari l'obre en un navegador amb sessió iniciada a Heym; el valor mai passa per l'altre agent. A continuació, envieu un missatge a la mateixa Task per continuar. |
| Ha fallat | `TASK_STATE_FAILED`, amb el motiu |
| S'ha cancel·lat | `TASK_STATE_CANCELED` |

Un missatge adreçat a una Task finalitzada o encara en curs serà rebutjat amb `UnsupportedOperationError`. Els missatges admeten parts `text` i `data`, amb un límit conjunt de 20.000 caràcters; les parts de fitxers seran rebutjades, de manera que heu d'enviar fitxers com a enllaços.

## Progrés

Mentre una Task treballa, el flux transmet una actualització d'estat per a cada pas amb les mateixes paraules que mostra la pestanya Chat, per exemple `Running workflow "Invoice Parser"` o `Testing the workflow · attempt 2/5`. Els clients MCP reben aquests mateixos passos com a `notifications/progress` des de `heym_chat`.

## Exemple

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

## Límits

- `CancelTask` atura immediatament un torn en execució a la instància de Heym corresponent, exactament com fa el botó Stop de la pestanya Chat. A altres llocs la Task es marca com a cancel·lada i el resultat tardà no queda enregistrat.
- Sense notificacions push, sense vinculació REST o gRPC, sense Agent Cards signades.

## Relacionat

- [Pestanya MCP / A2A](../tabs/mcp-tab.md): activar Heym Agent i A2A
- [Pestanya Chat](../tabs/chat-tab.md): el motor intern de l'agent
- [Seguretat](./security.md): emmagatzematge de claus
