# WebSocket Send

Uzel **WebSocket Send** otevírá odchozí klientské připojení k externímu WebSocket serveru, odešle jednu zprávu a připojení uzavře. Použijte jej, když workflow potřebuje odesílat události do realtime systému, aniž by vystavovalo socket endpoint vlastněný platformou Heym.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `websocketUrl` | string / expression | Externí URL `ws://` nebo `wss://` |
| `websocketHeaders` | JSON object string / expression | Volitelné hlavičky handshake |
| `websocketSubprotocols` | string | Volitelný seznam subprotokolů oddělený čárkami |
| `websocketMessage` | expression | Payload k odeslání |

## Pravidla serializace zpráv

- Pokud se `websocketMessage` vyhodnotí jako **string**, Heym odešle textový rámec.
- Pokud se vyhodnotí jako **object**, **array**, **number**, **boolean** nebo `null`, Heym jej serializuje jako JSON text.
- Pokud se vyhodnotí jako **bytes**, Heym odešle binární rámec.
- Úplné výrazy jako `$input` zachovávají nativní typy před serializací.

## Výstupní pole

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` při úspěchu |
| `$nodeLabel.url` | Vyhodnocená cílová URL |
| `$nodeLabel.message_type` | `text`, `json` nebo `binary` |
| `$nodeLabel.size_bytes` | Velikost payloadu v bajtech |
| `$nodeLabel.subprotocol` | Vyjednaný subprotokol, pokud je přítomen |
| `$nodeLabel.sent_at` | ISO časové razítko |

## Příklad workflow

**HTTP request → transform → publikace přes WebSocket**

```
input → set → websocketSend → output
```

- **Set** vytvoří objekt payloadu, například `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** použije `$payloadNode` jako `websocketMessage`
- **Output** může vrátit `$socketSend.status`

## Příklad JSON uzlu

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Poznámky

- Pro tento uzel není vyžadováno žádné [přihlašovací údaje](../reference/credentials.md).
- Pokud vzdálený server očekává autentizační nebo tenant hlavičky, předejte je prostřednictvím `websocketHeaders`.
- Použijte [HTTP](./http-node.md), pokud je vzdálený systém založen na request/response namísto socketů.

## Bezpečnost odchozího provozu

- Ve výchozím nastavení musí URL používat `ws://` nebo `wss://` a překládat se pouze na veřejné adresy. Loopback, privátní, link-local, multicast a cloud-metadata destinace jsou blokovány.
- Heym ověřuje každou vyhodnocenou adresu a připojuje se přímo k jedné z těchto adres. Proxy prostředí a přesměrování WebSocket jsou během aktivní ochrany zakázány.
- Hlavičky `Authorization`, `Origin`, `User-Agent` a vlastní datové hlavičky jsou podporovány. `Origin` je odesílán prostřednictvím vyhrazené volby WebSocket klienta. Hlavičky `Host`, `Connection`, `Upgrade` a `Sec-WebSocket-*` nelze přepsat.
- Důvěryhodná self-hosted nasazení, která záměrně komunikují s interními službami, mohou nastavit `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Výchozí hodnotu ponechte zapnutou u hostovaných nebo multi-tenant nasazení.

**Poznámka k upgradu pro v0.0.105:** tato politika platná pro celou instanci nyní chrání také destinace odvozené z přihlašovacích údajů používané službami Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, vlastním spouštěním LLM a vyhledáváním modelů, AI asistentem, guardrails a RAG embeddings. Stávající přihlašovací údaje odkazující na loopback, privátní nebo link-local adresy jsou odmítnuty, pokud není na důvěryhodné self-hosted instanci povoleno `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Dokud je ochrana aktivní, chránění HTTP klienti ignorují `HTTP_PROXY` a `HTTPS_PROXY`; povolení opt-out je obnoví. CA balíčky operátora konfigurované prostřednictvím `SSL_CERT_FILE` nebo `SSL_CERT_DIR` zůstávají podporovány. ClickHouse je kontrolován před otevřením připojení, ale není připnut v okamžiku navázání spojení, protože clickhouse-connect přináší vlastní urllib3 transport.

## Související

- [WebSocket Trigger](./websocket-trigger-node.md) – Naslouchejte externímu socketu a spouštějte workflow na základě událostí
- [Node Types](../reference/node-types.md) – Přehled integračních uzlů
- [Expression DSL](../reference/expression-dsl.md) – Sestavujte dynamické JSON payloady
- [Third-Party Integrations](../reference/integrations.md) – Integrace založené na přihlašovacích údajích vs. přímé konfiguraci
