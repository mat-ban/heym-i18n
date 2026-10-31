# A2A

Heym furnizează **Heym Agent** prin intermediul protocolului Agent2Agent (A2A 1.0, legare JSON-RPC). Heym Agent este motorul din spatele [filei Chat](../tabs/chat-tab.md); clienții MCP accesează același agent ca instrumentul `heym_chat` (consultați [fila MCP / A2A](../tabs/mcp-tab.md)). Cu A2A activat, un alt agent îi poate trimite o Task în limbaj natural și poate primi răspunsul, beneficiind de aceleași capacități pe care le oferă Chat.

## Activare

1. Deschideți fila **MCP / A2A**.
2. Activați **Heym Agent** pe serverul implicit sau pe un server denumit și alegeți credențialul și modelul corespunzător.
3. Bifați **Activare A2A**. Cardul afișează adresa URL a **Agent Card** și **JSON-RPC Endpoint**.

A2A depinde de Heym Agent: dezactivarea agentului dezactivează automat și A2A.

## Endpoints

| | Server implicit | Server denumit |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card nu necesită credențiale și nu specifică niciun utilizator, server sau Workflow. Există numai în timp ce A2A este activat: cardul de domeniu cât timp cel puțin un utilizator are A2A activat pentru serverul implicit; cardul unui server denumit cât timp A2A pentru acel server este activ. În caz contrar, adresa răspunde cu 404.

## Autentificare

Trimiteți aceleași credențiale ca pentru MCP, exclusiv în antete:

- `X-MCP-Key: <key>`: cheia serverului implicit sau cheia serverului denumit
- `Authorization: Bearer <token>`: un Token OAuth emis de serverul OAuth Heym

Credențialele trimise în URL sunt refuzate. Agent Card declară ambele scheme, permițând unui client A2A să le citească direct din card.

## Metode

| Metodă | Descriere |
|---|---|
| `SendMessage` | Pornește o Task sau continuă una care așteaptă date de intrare. Așteaptă răspunsul, cu excepția cazului în care `configuration.returnImmediately` este `true`. |
| `SendStreamingMessage` | Același lucru, ca flux Server-Sent Events care transmite progresul și rezultatul Task. |
| `GetTask` | Starea, răspunsul și istoricul unei Task (`historyLength` limitează istoricul). |
| `ListTasks` | Tasks dumneavoastră de pe acest server, cele mai recente primele, filtrate după `contextId` sau `status`, cu `pageSize` și `pageToken`. |
| `CancelTask` | Oprește o Task care încă rulează sau așteaptă. |
| `SubscribeToTask` | Urmărește o Task aflată în derulare. |
| `GetExtendedAgentCard` | Cardul cu numele serverului și Workflows atribuite acestuia ca abilități. |

Notificările push nu sunt oferite: cardul indică `pushNotifications: false`, iar metodele push răspund cu `PushNotificationNotSupportedError`. Solicitările utilizează A2A 1.0; trimiteți `A2A-Version: 1.0`. Denumirile metodelor din A2A 0.3, cum ar fi `message/send`, răspund cu `VersionNotSupportedError`.

## Tasks și conversații

Fiecare Task reprezintă o conversație în fila Chat, marcată cu o pictogramă de rețea. Parametrul `contextId` al Task este respectiva conversație: trimiteți un mesaj nou cu același `contextId` și fără `taskId` pentru a o continua.

| Acțiunea agentului | Starea Task |
|---|---|
| A răspuns | `TASK_STATE_COMPLETED`, cu răspunsul sub formă de text și, dacă au fost salvate, legăturile către Workflows și suitele de evaluare ca date |
| A adresat o întrebare de clarificare | `TASK_STATE_INPUT_REQUIRED`: răspundeți cu același `taskId` |
| Necesită un credențial | `TASK_STATE_AUTH_REQUIRED`: mesajul de stare conține un link către pagina de credențiale Heym. Utilizatorul îl deschide într-un browser conectat la Heym; valoarea nu trece niciodată prin celălalt agent. Apoi trimiteți un mesaj în aceeași Task pentru a continua. |
| A eșuat | `TASK_STATE_FAILED`, însoțită de motiv |
| A fost anulată | `TASK_STATE_CANCELED` |

Un mesaj trimis către o Task finalizată sau aflată încă în execuție este refuzat cu `UnsupportedOperationError`. Mesajele acceptă părți `text` și `data`, până la un total cumulat de 20.000 de caractere; părțile de fișier sunt refuzate, așadar trimiteți fișierele sub formă de legături.

## Progres

În timp ce o Task rulează, fluxul trimite o actualizare de stare pentru fiecare pas, în formulările afișate în fila Chat, de exemplu `Running workflow "Invoice Parser"` sau `Testing the workflow · attempt 2/5`. Clienții MCP primesc aceiași pași sub formă de `notifications/progress` prin `heym_chat`.

## Exemplu

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

## Limite

- `CancelTask` oprește imediat o tură în curs de desfășurare pe instanța Heym care o execută, similar butonului Stop din fila Chat. În alte noduri, Task este marcată ca anulată, iar rezultatul tardiv nu este înregistrat.
- Fără notificări push, fără legare REST sau gRPC, fără Agent Cards semnate.

## Conexe

- [Fila MCP / A2A](../tabs/mcp-tab.md): activarea Heym Agent și A2A
- [Fila Chat](../tabs/chat-tab.md): motorul din spatele agentului
- [Securitate](./security.md): modul de stocare a cheilor
