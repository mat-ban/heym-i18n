# A2A

A Heym a **Heym Agent** komponenst az Agent2Agent protokollon (A2A 1.0, JSON-RPC kötés) keresztül teszi elérhetővé. A Heym Agent a [Chat lap](../tabs/chat-tab.md) mögött működő motor; az MCP kliensek ugyanazt az agentet érik el a `heym_chat` eszköz formájában (lásd: [MCP / A2A lap](../tabs/mcp-tab.md)). Bekapcsolt A2A mellett egy másik agent természetes nyelven küldhet neki Task megbízást, és megkaphatja a választ, ugyanazokkal a képességekkel, mint a Chat.

## Bekapcsolás

1. Nyissa meg az **MCP / A2A** lapot.
2. Kapcsolja be a **Heym Agent** komponenst az alapértelmezett vagy egy elnevezett kiszolgálón, majd válassza ki a hitelesítő adatot és a modellt.
3. Jelölje be az **A2A engedélyezése** jelölőnégyzetet. A kártya megjeleníti az **Agent Card** URL-jét és a **JSON-RPC Endpoint** címet.

Az A2A a Heym Agentre épül: az agent kikapcsolása az A2A-t is kikapcsolja.

## Endpoints

| | Alapértelmezett kiszolgáló | Elnevezett kiszolgáló |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Az Agent Card nem igényel hitelesítő adatokat, és nem nevez meg felhasználót, kiszolgálót vagy Workflow-t sem. Csak akkor létezik, amíg az A2A aktív: a tartománykártya addig, amíg legalább egy felhasználónál aktív az A2A az alapértelmezett kiszolgálón; egy elnevezett kiszolgáló kártyája pedig addig, amíg annak az A2A funkciója be van kapcsolva. Ellenkező esetben a cím 404-es hibával válaszol.

## Hitelesítés

Ugyanazokat a hitelesítő adatokat küldje, mint az MCP esetén, kizárólag a fejlécekben:

- `X-MCP-Key: <key>`: az alapértelmezett kiszolgáló kulcsa vagy az elnevezett kiszolgáló kulcsa
- `Authorization: Bearer <token>`: a Heym OAuth kiszolgálójától származó OAuth Token

Az URL-ben megadott hitelesítő adatokat a rendszer elutasítja. Az Agent Card mindkét sémát deklarálja, így az A2A kliens ki tudja olvasni azokat a kártyáról.

## Metódusok

| Metódus | Művelet leírása |
|---|---|
| `SendMessage` | Elindít egy Task megbízást, vagy folytat egy bemenetre várót. Megvárja a választ, kivéve ha a `configuration.returnImmediately` értéke `true`. |
| `SendStreamingMessage` | Ugyanez, a Task előrehaladását és eredményét közvetítő Server-Sent Events adatfolyamként. |
| `GetTask` | Egy Task állapota, válasza és előzményei (a `historyLength` korlátozza az előzmények hosszát). |
| `ListTasks` | Az Ön megbízásai ezen a kiszolgálón, a legújabbal kezdve, `contextId` vagy `status` szerint szűrve, `pageSize` és `pageToken` paraméterekkel. |
| `CancelTask` | Leállít egy még futó vagy várakozó Task megbízást. |
| `SubscribeToTask` | Követ egy még folyamatban lévő Taskot. |
| `GetExtendedAgentCard` | A kártya a kiszolgáló nevével és a hozzárendelt Workflows elemekkel készségekként. |

Push értesítések nem állnak rendelkezésre: a kártya a `pushNotifications: false` értéket jelzi, a push metódusok pedig `PushNotificationNotSupportedError` hibával válaszolnak. A kérések az A2A 1.0 verziót használják; küldjön `A2A-Version: 1.0` fejlécet. Az A2A 0.3 verzióból származó metódusnevek, mint például a `message/send`, `VersionNotSupportedError` hibát adnak.

## Tasks és beszélgetések

Minden Task egy beszélgetés a Chat lapon, hálózati ikonnal megjelölve. A Taskhoz tartozó `contextId` az adott beszélgetést azonosítja: küldjön új üzenetet ugyanazzal a `contextId` értékkel és `taskId` nélkül a folytatáshoz.

| Mit tett az agent | Task állapota |
|---|---|
| Válaszolt | `TASK_STATE_COMPLETED`, a válasszal szövegként, és ha mentett valamit, a Workflows és értékelési csomagok linkjeivel adatként |
| Pontosító kérdést tett fel | `TASK_STATE_INPUT_REQUIRED`: válaszoljon ugyanazzal a `taskId` azonosítóval |
| Hitelesítő adat szükséges | `TASK_STATE_AUTH_REQUIRED`: az állapotüzenet tartalmaz egy linket a Heym hitelesítő adatok oldalára. A felhasználó megnyitja azt egy Heymbe bejelentkezett böngészőben; az érték soha nem halad át a másik agenten. Ezután küldjön üzenetet ugyanazon a Taskon a folytatáshoz. |
| Sikertelen | `TASK_STATE_FAILED`, a megadott indokkal |
| Megszakítva | `TASK_STATE_CANCELED` |

Egy befejezett vagy még dolgozó Task részére küldött üzenet `UnsupportedOperationError` hibával elutasításra kerül. Az üzenetek `text` és `data` részeket fogadnak el, együttesen legfeljebb 20 000 karakterig; a fájlrészek elutasításra kerülnek, ezért a fájlokat linkként küldje el.

## Előrehaladás

Amíg egy Task dolgozik, az adatfolyam minden lépésről állapotfrissítést küld a Chat lapon látható megfogalmazásokkal, például `Running workflow "Invoice Parser"` vagy `Testing the workflow · attempt 2/5`. Az MCP kliensek ugyanezeket a lépéseket `notifications/progress` formájában kapják meg a `heym_chat` eszközből.

## Példa

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

## Korlátok

- A `CancelTask` azonnal leállítja a folyamatban lévő kört azon a Heym példányon, amely futtatja azt, ahogyan a Chat lap Leállítás gombja is teszi. Máshol a Task megszakítottként van megjelölve, és a kör késői eredménye nem kerül rögzítésre.
- Nincsenek push értesítések, nincs REST vagy gRPC kötés, nincsenek aláírt Agent Cards elemek.

## Kapcsolódó

- [MCP / A2A lap](../tabs/mcp-tab.md): a Heym Agent és az A2A bekapcsolása
- [Chat lap](../tabs/chat-tab.md): az agent mögött működő motor
- [Biztonság](./security.md): a kulcsok tárolási módja
