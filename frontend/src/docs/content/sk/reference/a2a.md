# A2A

Heym poskytuje **Heym Agent** prostredníctvom protokolu Agent2Agent (A2A 1.0, väzba JSON-RPC). Heym Agent je jadrom za [kartou Chat](../tabs/chat-tab.md); klienti MCP pristupujú k rovnakému agentovi ako k nástroju `heym_chat` (pozrite [kartu MCP / A2A](../tabs/mcp-tab.md)). So zapnutým A2A mu môže iný agent odoslať Task v prirodzenom jazyku a získať odpoveď s rovnakými možnosťami, aké ponúka Chat.

## Zapnutie

1. Otvorte kartu **MCP / A2A**.
2. Zapnite **Heym Agent** na predvolenom serveri alebo na pomenovanom serveri a vyberte príslušné poverenie a model.
3. Začiarknite **Povoliť A2A**. Karta zobrazí URL adresu **Agent Card** a **JSON-RPC Endpoint**.

A2A stavia na Heym Agent: vypnutím agenta sa vypne aj A2A.

## Endpoints

| | Predvolený server | Pomenovaný server |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card nevyžaduje žiadne poverenia a neuvádza používateľa, server ani Workflow. Existuje len vtedy, kým je A2A zapnuté: doménová karta, kým má aspoň jeden používateľ zapnuté A2A pre predvolený server; karta pomenovaného servera, kým je A2A daného servera aktívne. V opačnom prípade adresa odpovedá kódom 404.

## Autentifikácia

Odosielajte rovnaké poverenia ako pre MCP, výhradne v hlavičkách:

- `X-MCP-Key: <key>`: kľúč predvoleného servera alebo kľúč pomenovaného servera
- `Authorization: Bearer <token>`: Token OAuth z OAuth servera Heym

Poverenia v URL adrese sú odmietnuté. Agent Card deklaruje obe schémy, takže si ich klient A2A môže z karty prečítať.

## Metódy

| Metóda | Popis činnosti |
|---|---|
| `SendMessage` | Spustí Task alebo pokračuje v tej, ktorá čaká na vstup. Čaká na odpoveď, pokiaľ `configuration.returnImmediately` nie je `true`. |
| `SendStreamingMessage` | To isté ako prúd Server-Sent Events s priebehom a výsledkom Task. |
| `GetTask` | Stav, odpoveď a história danej Task (`historyLength` obmedzuje dĺžku histórie). |
| `ListTasks` | Vaše Tasks na tomto serveri, od najnovších, filtrované podľa `contextId` alebo `status`, s `pageSize` a `pageToken`. |
| `CancelTask` | Zastaví Task, ktorá stále prebieha alebo čaká. |
| `SubscribeToTask` | Sleduje Task, ktorá stále prebieha. |
| `GetExtendedAgentCard` | Karta s názvom servera a priradenými Workflows ako schopnosťami. |

Push oznámenia nie sú k dispozícii: karta uvádza `pushNotifications: false` a push metódy odpovedajú chybou `PushNotificationNotSupportedError`. Požiadavky používajú A2A 1.0; odosielajte `A2A-Version: 1.0`. Názvy metód z A2A 0.3 ako `message/send` odpovedajú chybou `VersionNotSupportedError`.

## Tasks a konverzácie

Každá Task predstavuje konverzáciu v karte Chat označenú sieťovou ikonou. `contextId` danej Task je táto konverzácia: odošlite novú správu s rovnakým `contextId` a bez `taskId` na pokračovanie.

| Čo agent vykonal | Stav Task |
|---|---|
| Odpovedal | `TASK_STATE_COMPLETED`, s odpoveďou v textovej podobe a prípadne uloženými odkazmi na Workflows a hodnotiace balíky ako dátami |
| Položil spresňujúcu otázku | `TASK_STATE_INPUT_REQUIRED`: odpovedzte s rovnakým `taskId` |
| Vyžaduje poverenie | `TASK_STATE_AUTH_REQUIRED`: stavová správa obsahuje odkaz na stránku poverení Heym. Používateľ ju otvorí v prehliadači prihlásenom do Heym; hodnota nikdy neprechádza cez druhého agenta. Potom odošlite správu v rámci rovnakej Task pre pokračovanie. |
| Zlyhal | `TASK_STATE_FAILED`, s uvedením dôvodu |
| Bola zrušená | `TASK_STATE_CANCELED` |

Správa odoslaná na dokončenú Task alebo na Task stále prebiehajúcu je odmietnutá s chybou `UnsupportedOperationError`. Správy prijímajú časti `text` a `data`, celkovo do 20 000 znakov; súborové časti sú odmietnuté, súbory preto posielajte ako odkazy.

## Priebeh

Kým Task pracuje, prúd odosiela aktualizáciu stavu pre každý krok v znení známom z karty Chat, napríklad `Running workflow "Invoice Parser"` alebo `Testing the workflow · attempt 2/5`. Klienti MCP dostávajú rovnaké kroky ako `notifications/progress` z `heym_chat`.

## Príklad

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

## Obmedzenia

- `CancelTask` okamžite zastaví prebiehajúci ťah na danej inštancii Heym, rovnako ako tlačidlo Stop v karte Chat. Inde je Task označená ako zrušená a oneskorený výsledok sa nezaznamená.
- Žiadne push oznámenia, žiadna väzba REST či gRPC, žiadne podpísané Agent Cards.

## Súvisiace

- [Karta MCP / A2A](../tabs/mcp-tab.md): zapnutie Heym Agent a A2A
- [Karta Chat](../tabs/chat-tab.md): motor bežiaci za agentom
- [Zabezpečenie](./security.md): spôsob ukladania kľúčov
