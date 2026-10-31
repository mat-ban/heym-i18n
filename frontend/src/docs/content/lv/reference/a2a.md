# A2A

Heym nodrošina **Heym Agent** izmantojot Agent2Agent protokolu (A2A 1.0, JSON-RPC saistījums). Heym Agent ir dzinējs aiz [cilnē Chat](../tabs/chat-tab.md); MCP klienti piekļūst tam pašam aģentam kā rīkam `heym_chat` (skatīt [cilnē MCP / A2A](../tabs/mcp-tab.md)). Kad A2A ir ieslēgts, cits aģents var tam nosūtīt Task dabiskā valodā un saņemt atbildi ar tādām pašām iespējām, kādas ir pieejamas Chat.

## Ieslēgšana

1. Atveriet cilni **MCP / A2A**.
2. Ieslēdziet **Heym Agent** noklusējuma serverī vai nosauktā serverī un izvēlieties tā akreditācijas datus un modeli.
3. Atzīmējiet izvēles rūtiņu **Iespējot A2A**. Kartīte parāda **Agent Card** URL un **JSON-RPC Endpoint**.

A2A balstās uz Heym Agent: aģenta izslēgšana izslēdz arī A2A.

## Endpoints

| | Noklusējuma serveris | Nosaukts serveris |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card neprasa akreditācijas datus un nenosauc nevienu lietotāju, serveri vai Workflow. Tā pastāv tikai tad, kad A2A ir ieslēgts: domēna kartīte, kamēr vismaz vienam lietotājam ir ieslēgts A2A noklusējuma serverim; nosaukta servera kartīte, kamēr šī servera A2A ir aktīvs. Pretējā gadījumā adrese atbild ar 404 kļūdu.

## Autentifikācija

Sūtiet tos pašus akreditācijas datus, ko izmanto MCP, tikai galvenēs:

- `X-MCP-Key: <key>`: noklusējuma servera atslēga vai nosauktā servera atslēga
- `Authorization: Bearer <token>`: OAuth Token no Heym OAuth servera

Akreditācijas dati URL adresē tiek noraidīti. Agent Card deklarē abas shēmas, ļaujot A2A klientam tās nolasīt tieši no kartītes.

## Metodes

| Metode | Darbības apraksts |
|---|---|
| `SendMessage` | Sāk Task vai turpina tādu, kas gaida ievadi. Gaida atbildi, ja vien `configuration.returnImmediately` nav `true`. |
| `SendStreamingMessage` | Tas pats kā Server-Sent Events straume ar Task progresu un rezultātu. |
| `GetTask` | Task stāvoklis, atbilde un vēsture (`historyLength` ierobežo vēstures apjomu). |
| `ListTasks` | Jūsu Tasks šajā serverī, jaunākie vispirms, filtrēti pēc `contextId` vai `status`, ar `pageSize` un `pageToken`. |
| `CancelTask` | Aptur Task, kas joprojām darbojas vai gaida. |
| `SubscribeToTask` | Seko Task, kas joprojām tiek izpildīta. |
| `GetExtendedAgentCard` | Kartīte ar servera nosaukumu un piešķirtajiem Workflows kā prasmēm. |

Push paziņojumi netiek piedāvāti: kartīte norāda `pushNotifications: false`, un push metodes atbild ar `PushNotificationNotSupportedError`. Pieprasījumi izmanto A2A 1.0; sūtiet galveni `A2A-Version: 1.0`. Metožu nosaukumi no A2A 0.3, piemēram, `message/send`, atbild ar `VersionNotSupportedError`.

## Tasks un sarunas

Katra Task ir saruna cilnē Chat, kas atzīmēta ar tīkla ikonu. Task parametrs `contextId` ir šī saruna: nosūtiet jaunu ziņojumu ar to pašu `contextId` un bez `taskId`, lai to turpinātu.

| Ko aģents paveica | Task stāvoklis |
|---|---|
| Atbildēja | `TASK_STATE_COMPLETED`, ar atbildi teksta formā un, ja saglabāts, saitēm uz Workflows un novērtēšanas komplektiem kā datiem |
| Uzdeva precizējošu jautājumu | `TASK_STATE_INPUT_REQUIRED`: atbildiet ar to pašu `taskId` |
| Nepieciešami akreditācijas dati | `TASK_STATE_AUTH_REQUIRED`: statusa ziņojumā ir saite uz Heym akreditācijas datu lapu. Lietotājs to atver pārlūkprogrammā, kurā ir pieteicies Heym; vērtība nekad nenonāk pie otra aģenta. Pēc tam nosūtiet ziņojumu tajā pašā Task, lai turpinātu. |
| Neizdevās | `TASK_STATE_FAILED`, ar norādītu iemeslu |
| Tika atcelts | `TASK_STATE_CANCELED` |

Ziņojums pabeigtai Task vai tādai, kas joprojām darbojas, tiek noraidīts ar kļūdu `UnsupportedOperationError`. Ziņojumi pieņem daļas `text` un `data`, kopā līdz 20 000 rakstzīmēm; failu daļas tiek noraidītas, tāpēc sūtiet failus kā saites.

## Progress

Kamēr Task darbojas, straume sūta statusa atjauninājumu katram solim ar vārdiem, kas redzami cilnē Chat, piemēram, `Running workflow "Invoice Parser"` vai `Testing the workflow · attempt 2/5`. MCP klienti saņem tos pašus soļus kā `notifications/progress` no `heym_chat`.

## Piemērs

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

## Ierobežojumi

- `CancelTask` nekavējoties pārtrauc notiekošo gājienu izpildošajā Heym instancē, tieši tāpat kā to dara poga Stop cilnē Chat. Citur Task tiek atzīmēta kā atcelta, un gājiena vēlīnais rezultāts netiek reģistrēts.
- Nav push paziņojumu, nav REST vai gRPC saistījuma, nav parakstītu Agent Cards.

## Saistītie resursi

- [Cilnē MCP / A2A](../tabs/mcp-tab.md): Heym Agent un A2A ieslēgšana
- [Cilnē Chat](../tabs/chat-tab.md): dzinējs aiz aģenta
- [Drošība](./security.md): kā tiek glabātas atslēgas
