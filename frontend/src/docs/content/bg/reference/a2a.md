# A2A

Heym предоставя **Heym Agent** чрез протокола Agent2Agent (A2A 1.0, JSON-RPC свързване). Heym Agent е двигателят зад [раздела Chat](../tabs/chat-tab.md); MCP клиентите достигат до същия агент като инструмента `heym_chat` (вижте [раздела MCP / A2A](../tabs/mcp-tab.md)). При включен A2A друг агент може да му изпрати Task на естествен език и да получи отговор със същите възможности, с които разполага Chat.

## Включване

1. Отворете раздела **MCP / A2A**.
2. Включете **Heym Agent** на сървъра по подразбиране или на именуван сървър и изберете неговите идентификационни данни и модел.
3. Поставете отметка на **Активиране на A2A**. Картата показва URL адреса на **Agent Card** и **JSON-RPC Endpoint**.

A2A работи върху Heym Agent: изключването на агента изключва и A2A.

## Endpoints

| | Сървър по подразбиране | Именуван сървър |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card не изисква идентификационни данни и не споменава потребител, сървър или Workflow. Тя съществува само докато A2A е включен: картата на домейна, докато поне един потребител е включил A2A за сървъра по подразбиране; картата на именуван сървър, докато A2A на този сървър е активен. В противен случай адресът отговаря с 404.

## Удостоверяване

Изпращайте същите идентификационни данни, както за MCP, само в заглавките:

- `X-MCP-Key: <key>`: ключът на сървъра по подразбиране или ключът на именувания сървър
- `Authorization: Bearer <token>`: OAuth Token от OAuth сървъра на Heym

Идентификационни данни в URL адреса се отхвърлят. Agent Card декларира и двете схеми, така че A2A клиентът може да ги прочете от картата.

## Методи

| Метод | Описание |
|---|---|
| `SendMessage` | Стартира Task или продължава такава, чакаща входни данни. Изчаква отговора, освен ако `configuration.returnImmediately` не е `true`. |
| `SendStreamingMessage` | Същото като Server-Sent Events поток за напредъка на Task и нейния резултат. |
| `GetTask` | Състояние, отговор и история на Task (`historyLength` ограничава размера на историята). |
| `ListTasks` | Вашите Tasks на този сървър, първо най-новите, филтрирани по `contextId` или `status`, с `pageSize` и `pageToken`. |
| `CancelTask` | Спира Task, която все още работи или чака. |
| `SubscribeToTask` | Проследява Task, която все още работи. |
| `GetExtendedAgentCard` | Картата с името на сървъра и присвоените му Workflows като умения. |

Push известия не се предлагат: картата посочва `pushNotifications: false`, а push методите отговарят с `PushNotificationNotSupportedError`. Заявките използват A2A 1.0; изпращайте `A2A-Version: 1.0`. Имената на методи от A2A 0.3 като `message/send` отговарят с `VersionNotSupportedError`.

## Tasks и разговори

Всяка Task е разговор в раздела Chat, означен с мрежова икона. `contextId` на Task представлява този разговор: изпратете ново съобщение със същото `contextId` и без `taskId`, за да го продължите.

| Действие на агента | Състояние на Task |
|---|---|
| Отговорил | `TASK_STATE_COMPLETED`, с отговора като текст и, ако има запазени, връзките към Workflows и пакетите за оценка като данни |
| Задал уточняващ въпрос | `TASK_STATE_INPUT_REQUIRED`: отговорете със същото `taskId` |
| Изисква идентификационни данни | `TASK_STATE_AUTH_REQUIRED`: съобщението за състояние съдържа връзка към страницата за идентификационни данни на Heym. Потребителят я отваря в браузър с вход в Heym; стойността никога не преминава през другия агент. След това изпратете съобщение в същата Task, за да продължите. |
| Неуспешен | `TASK_STATE_FAILED`, с посочване на причината |
| Анулирана | `TASK_STATE_CANCELED` |

Съобщение до приключила Task или до такава, която все още работи, се отхвърля с `UnsupportedOperationError`. Съобщенията приемат части `text` и `data`, общо до 20 000 знака; части с файлове се отхвърлят, затова изпращайте файловете като връзки.

## Напредък

Докато дадена Task работи, потокът изпраща актуализация на състоянието за всяка стъпка с думите, които се показват в раздела Chat, например `Running workflow "Invoice Parser"` или `Testing the workflow · attempt 2/5`. MCP клиентите получават същите стъпки като `notifications/progress` от `heym_chat`.

## Пример

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

## Ограничения

- `CancelTask` спира незабавно изпълняван ход на инстанцията на Heym, която го изпълнява, както прави бутонът Stop в раздела Chat. На други места Task се маркира като анулирана и закъснелият резултат от хода не се записва.
- Без push известия, без REST или gRPC свързване, без подписани Agent Cards.

## Свързани

- [Раздел MCP / A2A](../tabs/mcp-tab.md): включване на Heym Agent и A2A
- [Раздел Chat](../tabs/chat-tab.md): двигателят зад агента
- [Сигурност](./security.md): начин на съхранение на ключовете
