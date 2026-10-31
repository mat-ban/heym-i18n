# A2A

Heym poskytuje **Heym Agent** prostřednictvím protokolu Agent2Agent (A2A 1.0, vazba JSON-RPC). Heym Agent je jádrem [záložky Chat](../tabs/chat-tab.md); klienti MCP přistupují ke stejnému agentovi jako k nástroji `heym_chat` (viz [záložka MCP / A2A](../tabs/mcp-tab.md)). Se zapnutým A2A mu může jiný agent odeslat Task v přirozeném jazyce a získat odpověď se stejnými možnostmi, jaké nabízí Chat.

## Zapnutí

1. Otevřete záložku **MCP / A2A**.
2. Zapněte **Heym Agent** na výchozím serveru nebo na pojmenovaném serveru a vyberte příslušné pověření a model.
3. Zaškrtněte **Povolit A2A**. Karta zobrazí URL adresu **Agent Card** a **JSON-RPC Endpoint**.

A2A staví na Heym Agent: vypnutím agenta se vypne také A2A.

## Endpoints

| | Výchozí server | Pojmenovaný server |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card nevyžaduje žádná pověření a neuvádí žádného uživatele, server ani Workflow. Existuje pouze tehdy, když je A2A zapnuto: doménová karta, dokud má alespoň jeden uživatel zapnuté A2A pro výchozí server; karta pojmenovaného serveru, dokud je A2A tohoto serveru aktivní. V opačném případě adresa odpovídá kódem 404.

## Autentizace

Odesílejte stejná pověření jako pro MCP, výhradně v hlavičkách:

- `X-MCP-Key: <key>`: klíč výchozího serveru nebo klíč pojmenovaného serveru
- `Authorization: Bearer <token>`: Token OAuth z OAuth serveru Heym

Pověření v URL adrese jsou odmítnuta. Agent Card deklaruje obě schémata, takže si je klient A2A může z karty přečíst.

## Metody

| Metoda | Popis činnosti |
|---|---|
| `SendMessage` | Spustí Task nebo pokračuje v té, která čeká na vstup. Čeká na odpověď, pokud `configuration.returnImmediately` není `true`. |
| `SendStreamingMessage` | Totéž jako stream Server-Sent Events s průběhem a výsledkem Task. |
| `GetTask` | Stav, odpověď a historie dané Task (`historyLength` omezuje délku historie). |
| `ListTasks` | Vaše Tasks na tomto serveru, od nejnovějších, filtrované podle `contextId` nebo `status`, s `pageSize` a `pageToken`. |
| `CancelTask` | Zastaví Task, která stále probíhá nebo čeká. |
| `SubscribeToTask` | Sleduje Task, která stále probíhá. |
| `GetExtendedAgentCard` | Karta s názvem serveru a přiřazenými Workflows jako dovednostmi. |

Push oznámení nejsou nabízena: karta uvádí `pushNotifications: false` a push metody odpovídají chybou `PushNotificationNotSupportedError`. Požadavky používají A2A 1.0; posílejte `A2A-Version: 1.0`. Názvy metod z A2A 0.3 jako `message/send` odpovídají chybou `VersionNotSupportedError`.

## Tasks a konverzace

Každá Task představuje konverzaci v záložce Chat označenou síťovou ikonou. `contextId` dané Task je tato konverzace: pošlete novou zprávu se stejným `contextId` a bez `taskId` pro pokračování.

| Co agent provedl | Stav Task |
|---|---|
| Odpověděl | `TASK_STATE_COMPLETED`, s odpovědí v podobě textu a případně uloženými odkazy na Workflows a eval suites jako daty |
| Položil upřesňující otázku | `TASK_STATE_INPUT_REQUIRED`: odpovězte se stejným `taskId` |
| Vyžaduje pověření | `TASK_STATE_AUTH_REQUIRED`: stavová zpráva obsahuje odkaz na stránku pověření Heym. Uživatel ji otevře v prohlížeči přihlášeném do Heym; hodnota nikdy neprochází druhým agentem. Poté odešlete zprávu v rámci stejné Task pro pokračování. |
| Selhal | `TASK_STATE_FAILED`, s uvedením důvodu |
| Byla zrušena | `TASK_STATE_CANCELED` |

Zpráva odeslaná na dokončenou Task nebo na Task stále běžící je odmítnuta s chybou `UnsupportedOperationError`. Zprávy přijímají části `text` a `data`, celkem do 20 000 znaků; souborové části jsou odmítnuty, soubory proto posílejte jako odkazy.

## Průběh

Zatímco Task běží, stream odesílá aktualizaci stavu pro každý krok ve znění známém ze záložky Chat, například `Running workflow "Invoice Parser"` nebo `Testing the workflow · attempt 2/5`. Klienti MCP dostávají stejné kroky jako `notifications/progress` z `heym_chat`.

## Příklad

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

## Omezení

- `CancelTask` okamžitě zastaví běžící tah na dané instanci Heym, stejně jako tlačítko Stop v záložce Chat. Jinde je Task označena jako zrušená a opožděný výsledek se nezaznamená.
- Žádná push oznámení, žádná vazba REST či gRPC, žádné podepsané Agent Cards.

## Související

- [Záložka MCP / A2A](../tabs/mcp-tab.md): zapnutí Heym Agent a A2A
- [Záložka Chat](../tabs/chat-tab.md): jádro běžící za agentem
- [Zabezpečení](./security.md): jak jsou klíče ukládány
