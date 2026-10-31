# A2A

Heym pruža **Heym Agent** putem protokola Agent2Agent (A2A 1.0, JSON-RPC povezivanje). Heym Agent je pogon iza [kartice Chat](../tabs/chat-tab.md); MCP klijenti pristupaju istom agentu kao alatu `heym_chat` (pogledajte [karticu MCP / A2A](../tabs/mcp-tab.md)). Uz uključeni A2A, drugi agent mu može poslati Task na prirodnom jeziku i primiti odgovor, uz iste mogućnosti koje ima Chat.

## Uključivanje

1. Otvorite karticu **MCP / A2A**.
2. Uključite **Heym Agent** na zadanom poslužitelju ili imenovanom poslužitelju te odaberite njegovu vjerodajnicu i model.
3. Označite **Omogući A2A**. Kartica prikazuje URL adresu **Agent Card** i **JSON-RPC Endpoint**.

A2A se oslanja na Heym Agent: isključivanjem agenta isključuje se i A2A.

## Endpoints

| | Zadani poslužitelj | Imenovani poslužitelj |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card ne zahtijeva vjerodajnice i ne navodi korisnika, poslužitelj niti Workflow. Postoji samo dok je A2A uključen: domenska kartica dok barem jedan korisnik ima uključen A2A za zadani poslužitelj; kartica imenovanog poslužitelja dok je A2A tog poslužitelja aktivan. U suprotnom adresa odgovara statusom 404.

## Autentifikacija

Šaljite iste vjerodajnice kao i za MCP, isključivo u zaglavljima:

- `X-MCP-Key: <key>`: ključ zadanog poslužitelja ili ključ imenovanog poslužitelja
- `Authorization: Bearer <token>`: OAuth Token s poslužitelja Heym OAuth

Vjerodajnice u URL adresi se odbijaju. Agent Card deklarira obje sheme, tako da ih A2A klijent može pročitati s kartice.

## Metode

| Metoda | Opis |
|---|---|
| `SendMessage` | Pokreće Task ili nastavlja onu koja čeka unos. Čeka na odgovor osim ako je `configuration.returnImmediately` postavljeno na `true`. |
| `SendStreamingMessage` | Isto, kao Server-Sent Events tok napretka i rezultata Task. |
| `GetTask` | Stanje, odgovor i povijest Task (`historyLength` ograničava duljinu povijesti). |
| `ListTasks` | Vaši zadaci na ovom poslužitelju, najnoviji prvo, filtrirani prema `contextId` ili `status`, s `pageSize` i `pageToken`. |
| `CancelTask` | Zaustavlja Task koja se još izvršava ili čeka. |
| `SubscribeToTask` | Prati Task koja se još izvršava. |
| `GetExtendedAgentCard` | Kartica s nazivom poslužitelja i dodijeljenim Workflows kao vještinama. |

Push obavijesti se ne nude: kartica navodi `pushNotifications: false`, a push metode odgovaraju pogreškom `PushNotificationNotSupportedError`. Zahtjevi koriste A2A 1.0; pošaljite `A2A-Version: 1.0`. Nazivi metoda iz A2A 0.3 kao što je `message/send` odgovaraju s `VersionNotSupportedError`.

## Tasks i razgovori

Svaka Task predstavlja razgovor na kartici Chat, označen ikonom mreže. `contextId` tog zadatka je taj razgovor: pošaljite novu poruku s istim `contextId` i bez `taskId` kako biste ga nastavili.

| Što je agent napravio | Stanje Task |
|---|---|
| Odgovorio | `TASK_STATE_COMPLETED`, s odgovorom kao tekstom i, ako su spremljene, poveznicama na Workflows i evaluacijske pakete kao podacima |
| Postavio pitanje za pojašnjenje | `TASK_STATE_INPUT_REQUIRED`: odgovorite s istim `taskId` |
| Potrebna je vjerodajnica | `TASK_STATE_AUTH_REQUIRED`: statusna poruka sadrži poveznicu na stranicu vjerodajnica u Heymu. Korisnik je otvara u pregledniku prijavljenom u Heym; vrijednost nikada ne prolazi kroz drugog agenta. Zatim pošaljite poruku u istom Tasku za nastavak. |
| Nije uspjelo | `TASK_STATE_FAILED`, s razlogom |
| Otkazano | `TASK_STATE_CANCELED` |

Poruka poslana dovršenoj Task ili onoj koja još radi odbija se s `UnsupportedOperationError`. Poruke prihvaćaju dijelove `text` i `data`, do ukupno 20.000 znakova; dijelovi datoteka se odbijaju, stoga datoteke šaljite kao poveznice.

## Napredak

Dok Task radi, tok šalje ažuriranje stanja za svaki korak, rječnikom prikazanim na kartici Chat, na primjer `Running workflow "Invoice Parser"` ili `Testing the workflow · attempt 2/5`. MCP klijenti dobivaju iste korake kao `notifications/progress` iz `heym_chat`.

## Primjer

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

## Ograničenja

- `CancelTask` trenutačno zaustavlja krug koji se izvršava na instanci Heyma koja ga pokreće, baš kao i gumb Stop na kartici Chat. Drugdje se Task označava kao otkazana, a kasni rezultat kruga se ne bilježi.
- Nema push obavijesti, nema REST ili gRPC povezivanja, nema potpisanih Agent Cards.

## Povezano

- [Kartica MCP / A2A](../tabs/mcp-tab.md): uključivanje Heym Agent i A2A
- [Kartica Chat](../tabs/chat-tab.md): pogon iza agenta
- [Sigurnost](./security.md): način pohrane ključeva
