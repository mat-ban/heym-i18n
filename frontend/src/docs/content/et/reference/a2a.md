# A2A

Heym pakub **Heym Agent** komponenti Agent2Agent protokolli kaudu (A2A 1.0, JSON-RPC sidumine). Heym Agent on mootor [Chat vahekaart](../tabs/chat-tab.md) taga; MCP kliendid jõuavad sama agendini tööriistana `heym_chat` (vt [MCP / A2A vahekaart](../tabs/mcp-tab.md)). Kui A2A on sisse lülitatud, saab teine agent saata talle loomulikus keeles Task ülesande ja saada vastuse, omades samu võimeid nagu Chat.

## Sisselülitamine

1. Avage vahekaart **MCP / A2A**.
2. Lülitage **Heym Agent** vaikimisi serveris või nimega serveris sisse ning valige selle mandaat ja mudel.
3. Märkige ruut **Luba A2A**. Kaardil kuvatakse **Agent Card** URL ja **JSON-RPC Endpoint**.

A2A toetub Heym Agentile: agendi väljalülitamine lülitab välja ka A2A.

## Endpoints

| | Vaikimisi server | Nimega server |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card ei vaja mandaate ega nimeta ühtegi kasutajat, serverit ega Workflow'd. See eksisteerib ainult seni, kuni A2A on sisse lülitatud: domeenikaart seni, kuni vähemalt ühel kasutajal on vaikimisi serveri jaoks A2A sees; nimega serveri kaart seni, kuni selle serveri A2A on aktiivne. Vastasel juhul vastab aadress olekukoodiga 404.

## Autentimine

Saatke samad mandaadid nagu MCP puhul, ainult päistes:

- `X-MCP-Key: <key>`: vaikimisi serveri võti või nimega serveri võti
- `Authorization: Bearer <token>`: Heymi OAuth serverist pärinev OAuth Token

URL-is esitatud mandaadid lükatakse tagasi. Agent Card deklareerib mõlemad skeemid, võimaldades A2A kliendil neid kaardilt lugeda.

## Meetodid

| Meetod | Kirjeldus |
|---|---|
| `SendMessage` | Käivitab Task ülesande või jätkab sisendit ootavat ülesannet. Ootab vastust, välja arvatud juhul, kui `configuration.returnImmediately` on `true`. |
| `SendStreamingMessage` | Sama Server-Sent Events voona ülesande edenemise ja tulemuse kohta. |
| `GetTask` | Taski olek, vastus ja ajalugu (`historyLength` piirab ajaloo mahtu). |
| `ListTasks` | Teie Tasks ülesanded selles serveris, uusimad esimesena, filtreerituna `contextId` või `status` järgi, koos parameetritega `pageSize` ja `pageToken`. |
| `CancelTask` | Peatab Taski, mis alles töötab või ootab. |
| `SubscribeToTask` | Jälgib Taski, mis alles töötab. |
| `GetExtendedAgentCard` | Kaart serveri nime ja sellele määratud Workflows töövoogudega oskustena. |

Push-teavitusi ei pakuta: kaart näitab `pushNotifications: false` ja push-meetodid vastavad veaga `PushNotificationNotSupportedError`. Päringud kasutavad A2A 1.0; saatke `A2A-Version: 1.0`. A2A 0.3 meetodite nimed, nagu `message/send`, vastavad veaga `VersionNotSupportedError`.

## Tasks ja vestlused

Iga Task on vestlus Chat vahekaardil, mis on märgistatud võrguikooniga. Taski `contextId` on see vestlus: saatke selle jätkamiseks uus sõnum sama `contextId` väärtusega ja ilma `taskId` parameetrita.

| Mida agent tegi | Task olek |
|---|---|
| Vastatud | `TASK_STATE_COMPLETED`, vastusega tekstina ja salvestatud linkidega Workflows ja hindamiskomplektide juurde andmetena |
| Esitas täpsustava küsimuse | `TASK_STATE_INPUT_REQUIRED`: vastake sama `taskId` väärtusega |
| Vajab mandaati | `TASK_STATE_AUTH_REQUIRED`: olekusõnum sisaldab linki Heymi mandaatide lehele. Kasutaja avab selle Heymi sisse logitud brauseris; väärtus ei liigu kunagi läbi teise agendi. Seejärel saatke jätkamiseks sõnum samas Taskis. |
| Ebaõnnestus | `TASK_STATE_FAILED`, koos põhjusega |
| Tühistati | `TASK_STATE_CANCELED` |

Sõnum lõpetatud või veel töötavale Taskile lükatakse tagasi veaga `UnsupportedOperationError`. Sõnumid võtavad vastu osasid `text` ja `data`, kokku kuni 20 000 tähemärki; failiosad lükatakse tagasi, seega saatke failid linkidena.

## Edenemine

Kuni Task töötab, saadab voog iga sammu kohta olekuvärskenduse sõnadega, mida Chat vahekaart kuvab, näiteks `Running workflow "Invoice Parser"` või `Testing the workflow · attempt 2/5`. MCP kliendid saavad samad sammud teavitusena `notifications/progress` tööriistast `heym_chat`.

## Näide

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

## Piirangud

- `CancelTask` peatab käimasoleva vooru kohe seda käitavas Heym eksemplaris, täpselt nagu nupu Stop vajutamine vahekaardil Chat. Mujal märgitakse Task tühistatuks ja vooru hilinenud tulemust ei salvestata.
- Push-teavitused puuduvad, REST või gRPC sidumine puudub, allkirjastatud Agent Cards kaardid puuduvad.

## Seotud

- [MCP / A2A vahekaart](../tabs/mcp-tab.md): Heym Agenti ja A2A sisselülitamine
- [Chat vahekaart](../tabs/chat-tab.md): mootor agendi taga
- [Turvalisus](./security.md): võtmete talletamise viis
