# A2A

Heym ponuja **Heym Agent** prek protokola Agent2Agent (A2A 1.0, vezava JSON-RPC). Heym Agent je gonilnik za [zavihkom Chat](../tabs/chat-tab.md); odjemalci MCP dostopajo do istega agenta kot orodja `heym_chat` (glejte [zavihek MCP / A2A](../tabs/mcp-tab.md)). Z vklopljenim A2A mu lahko drug agent pošlje Task v naravnem jeziku in prejme odgovor z enakimi zmožnostmi, kot jih ima Chat.

## Vklop

1. Odprite zavihek **MCP / A2A**.
2. Vklopite **Heym Agent** na privzetem strežniku ali poimenovanem strežniku ter izberite njegove poverilnice in model.
3. Označite **Omogoči A2A**. Kartica prikazuje URL naslov **Agent Card** in **JSON-RPC Endpoint**.

A2A temelji na Heym Agent: izklop agenta izklopi tudi A2A.

## Endpoints

| | Privzeti strežnik | Poimenovani strežnik |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card ne zahteva poverilnic in ne navaja uporabnika, strežnika ali Workflow. Obstaja le, dokler je A2A vklopljen: domenska kartica, dokler ima vsaj en uporabnik vklopljen A2A za privzeti strežnik; kartica poimenovanega strežnika, dokler je A2A tega strežnika aktiven. V nasprotnem primeru naslov odgovori s kodo 404.

## Preverjanje pristnosti

Pošljite enake poverilnice kot za MCP, izključno v glavah:

- `X-MCP-Key: <key>`: ključ privzetega strežnika ali ključ poimenovanega strežnika
- `Authorization: Bearer <token>`: Token OAuth iz strežnika Heym OAuth

Poverilnice v URL naslovu se zavrnejo. Agent Card deklarira obe shemi, tako da ju lahko odjemalec A2A prebere neposredno s kartice.

## Metode

| Metoda | Opis |
|---|---|
| `SendMessage` | Zažene Task ali nadaljuje tisto, ki čaka na vnos. Čaka na odgovor, razen če je `configuration.returnImmediately` nastavljen na `true`. |
| `SendStreamingMessage` | Enako, kot Server-Sent Events tok napredka in rezultata Task. |
| `GetTask` | Stanje, odgovor in zgodovina Task (`historyLength` omeji obseg zgodovine). |
| `ListTasks` | Vaše Tasks na tem strežniku, najnovejše najprej, filtrirane po `contextId` ali `status`, s `pageSize` in `pageToken`. |
| `CancelTask` | Ustavi Task, ki se še vedno izvaja ali čaka. |
| `SubscribeToTask` | Spremlja Task, ki se še izvaja. |
| `GetExtendedAgentCard` | Kartica z imenom strežnika in dodeljenimi Workflows kot veščinami. |

Potisna obvestila niso na voljo: kartica navaja `pushNotifications: false`, potisne metode pa odgovarjajo z napako `PushNotificationNotSupportedError`. Zahtevki uporabljajo A2A 1.0; pošljite glavo `A2A-Version: 1.0`. Imena metod iz A2A 0.3, kot je `message/send`, odgovarjajo z `VersionNotSupportedError`.

## Tasks in pogovori

Vsaka Task predstavlja pogovor v zavihku Chat, označen z omrežno ikono. `contextId` te naloge je ta pogovor: pošljite novo sporočilo z istim `contextId` in brez `taskId`, da ga nadaljujete.

| Kaj je agent storil | Stanje Task |
|---|---|
| Odgovoril | `TASK_STATE_COMPLETED`, z odgovorom kot besedilom in, če so bile shranjene, povezavami do Workflows in ocenjevalnih paketov kot podatki |
| Zastavil vprašanje za pojasnilo | `TASK_STATE_INPUT_REQUIRED`: odgovorite z istim `taskId` |
| Potrebuje poverilnico | `TASK_STATE_AUTH_REQUIRED`: sporočilo o stanju vsebuje povezavo do strani s poverilnicami Heym. Uporabnik jo odpre v brskalniku, prijavljenem v Heym; vrednost nikoli ne preide skozi drugega agenta. Nato pošljite sporočilo v isti Task za nadaljevanje. |
| Ni uspelo | `TASK_STATE_FAILED`, z navedbo razloga |
| Preklicano | `TASK_STATE_CANCELED` |

Sporočilo, poslano zaključeni Task ali tisti, ki še dela, se zavrne z napako `UnsupportedOperationError`. Sporočila sprejemajo dele `text` in `data`, skupaj do 20.000 znakov; deli z datotekami se zavrnejo, zato datoteke pošljite kot povezave.

## Napredek

Medtem ko Task dela, tok pošilja posodobitev stanja za vsak korak v besedilu, prikazanem v zavihku Chat, na primer `Running workflow "Invoice Parser"` ali `Testing the workflow · attempt 2/5`. Odjemalci MCP prejmejo enake korake kot `notifications/progress` iz `heym_chat`.

## Primer

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

## Omejitve

- `CancelTask` takoj ustavi krog, ki se izvaja na instanci Heym, enako kot gumb Stop v zavihku Chat. Drugje je Task označena kot preklicana, pozen rezultat pa se ne zabeleži.
- Brez potisnih obvestil, brez vezave REST ali gRPC, brez podpisanih Agent Cards.

## Povezano

- [Zavihek MCP / A2A](../tabs/mcp-tab.md): vklop Heym Agent in A2A
- [Zavihek Chat](../tabs/chat-tab.md): gonilnik v ozadju agenta
- [Varnost](./security.md): način shranjevanja ključev
