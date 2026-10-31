# A2A

Heym teikia **Heym Agent** per Agent2Agent protokolą (A2A 1.0, JSON-RPC susiejimas). Heym Agent yra variklis, veikiantis už [skirtuke Chat](../tabs/chat-tab.md); MCP klientai pasiekia tą patį agentą kaip įrankį `heym_chat` (žr. [skirtuke MCP / A2A](../tabs/mcp-tab.md)). Įjungus A2A, kitas agentas gali nusiųsti jam Task natūralia kalba ir gauti atsakymą su tomis pačiomis galimybėmis, kurias turi Chat.

## Įjungimas

1. Atidarykite skirtuką **MCP / A2A**.
2. Įjunkite **Heym Agent** numatytajame serveryje arba įvardytame serveryje ir pasirinkite jo kredencialus bei modelį.
3. Pažymėkite **Įgalinti A2A**. Kortelėje bus parodytas **Agent Card** URL ir **JSON-RPC Endpoint**.

A2A remiasi Heym Agent: išjungus agentą, išsijungia ir A2A.

## Endpoints

| | Numatytasis serveris | Įvardytas serveris |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card nereikalauja kredencialų ir nenurodo naudotojo, serverio ar Workflow. Ji egzistuoja tik tada, kai A2A yra įjungtas: domeno kortelė tol, kol bent vienas naudotojas turi įjungęs A2A numatytajam serveriui; įvardyto serverio kortelė tol, kol to serverio A2A yra aktyvus. Priešingu atveju adresas atsako kodu 404.

## Autentifikavimas

Siųskite tuos pačius kredencialus kaip ir MCP atveju, tik antraštėse:

- `X-MCP-Key: <key>`: numatytojo serverio raktas arba įvardyto serverio raktas
- `Authorization: Bearer <token>`: OAuth Token iš Heym OAuth serverio

Kredencialai URL atmetami. Agent Card deklaruoja abi schemas, todėl A2A klientas gali jas perskaityti iš kortelės.

## Metodai

| Metodas | Veikimo aprašymas |
|---|---|
| `SendMessage` | Pradeda Task arba tęsia laukiančią įvesties. Laukia atsakymo, nebent `configuration.returnImmediately` yra `true`. |
| `SendStreamingMessage` | Tas pats, kaip Server-Sent Events srautas su Task eiga ir rezultatu. |
| `GetTask` | Task būsena, atsakymas ir istorija (`historyLength` riboja istorijos apimtį). |
| `ListTasks` | Jūsų Tasks šiame serveryje, naujausios pirmiausia, filtruojamos pagal `contextId` arba `status`, su `pageSize` ir `pageToken`. |
| `CancelTask` | Sustabdo Task, kuri vis dar vykdoma arba laukia. |
| `SubscribeToTask` | Stebi Task, kuri vis dar vykdoma. |
| `GetExtendedAgentCard` | Kortelė su serverio pavadinimu ir jam priskirtais Workflows kaip įgūdžiais. |

Push pranešimai nesiūlomi: kortelėje nurodyta `pushNotifications: false`, o push metodai atsako klaida `PushNotificationNotSupportedError`. Užklausos naudoja A2A 1.0; siųskite `A2A-Version: 1.0`. A2A 0.3 metodų pavadinimai, tokie kaip `message/send`, atsako klaida `VersionNotSupportedError`.

## Tasks ir pokalbiai

Kiekviena Task yra pokalbis skirtuke Chat, pažymėtas tinklo piktograma. Šios užduoties `contextId` yra tas pokalbis: nusiųskite naują pranešimą su tuo pačiu `contextId` ir be `taskId`, kad jį pratęstumėte.

| Ką agentas atliko | Task būsena |
|---|---|
| Atsakė | `TASK_STATE_COMPLETED`, su atsakymu teksto pavidalu ir, jei išsaugota, nuorodomis į Workflows bei vertinimo paketus kaip duomenimis |
| Užsakė patikslinantį klausimą | `TASK_STATE_INPUT_REQUIRED`: atsakykite nurodydami tą patį `taskId` |
| Reikia kredencialo | `TASK_STATE_AUTH_REQUIRED`: būsenos pranešime yra nuoroda į Heym kredencialų puslapį. Naudotojas atidaro jį naršyklėje, prisijungęs prie Heym; reikšmė niekada nekeliauja per kitą agentą. Tada išsiųskite pranešimą toje pačioje Task, kad tęstumėte. |
| Nepavyko | `TASK_STATE_FAILED`, nurodant priežastį |
| Buvo atšaukta | `TASK_STATE_CANCELED` |

Pranešimas baigtai Task arba dar vykdomai atmetamas su klaida `UnsupportedOperationError`. Pranešimai priima `text` ir `data` dalis, kartu iki 20 000 simbolių; failų dalys atmetamos, todėl failus siųskite kaip nuorodas.

## Eiga

Kol Task dirba, srautas siunčia būsenos atnaujinimą kiekvienam žingsniui, naudodamas žodžius, kuriuos rodo skirtukas Chat, pavyzdžiui, `Running workflow "Invoice Parser"` arba `Testing the workflow · attempt 2/5`. MCP klientai gauna tuos pačius žingsnius kaip `notifications/progress` iš `heym_chat`.

## Pavyzdys

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

## Apribojimai

- `CancelTask` nedelsiant sustabdo vykdomą ėjimą tame Heym egzemplioriuje, kuris jį vykdo, lygiai taip pat, kaip Stop mygtukas skirtuke Chat. Kitur Task pažymima kaip atšaukta, o vėlyvas ėjimo rezultatas neužregistruojamas.
- Nėra push pranešimų, nėra REST ar gRPC susiejimo, nėra pasirašytų Agent Cards.

## Susiję

- [Skirtuke MCP / A2A](../tabs/mcp-tab.md): Heym Agent ir A2A įjungimas
- [Skirtuke Chat](../tabs/chat-tab.md): variklis, veikiantis už agento
- [Saugumas](./security.md): kaip saugomi raktai
