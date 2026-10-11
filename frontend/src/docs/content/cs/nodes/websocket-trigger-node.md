# WebSocket Trigger

Uzel **WebSocket Trigger** otevírá odchozí klientské připojení k externímu WebSocket serveru a spouští workflow při výskytu vybraných událostí socketu. Použijte jej pro datové toky událostí, jako jsou tržní feedy, telemetrie nebo chatovací backplane. Připojení k interním realtime systémům vyžaduje výslovné povolení privátních URL popsané níže.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Důležité chování

- Tento uzel se připojuje **z Hey mu k jinému WebSocket serveru**.
- **Nevystavuje** WebSocket endpoint na Hey mu.
- Nevyžaduje žádné [přihlašovací údaje](../reference/credentials.md). URL, hlavičky a subprotokoly konfigurujte přímo na uzlu.
- Leader worker udržuje připojení otevřené na pozadí a při povolení se znovu připojuje.

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `websocketUrl` | string | Externí URL `ws://` nebo `wss://` |
| `websocketHeaders` | JSON object string | Volitelné hlavičky handshake |
| `websocketSubprotocols` | string | Volitelný seznam subprotokolů oddělený čárkami |
| `websocketTriggerEvents` | array | Libovolná z hodnot `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Opětovné připojení po odpojení |
| `retryWaitSeconds` | integer | Prodleva před opětovným připojením |

## Vysílané události

### `onMessage`

Spustí se, když dorazí rámec ze vzdáleného socketu.

Užitečná pole:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.message.data` | Parsovaný JSON payload nebo surová hodnota zprávy |
| `$nodeLabel.message.text` | Text dekódovaný v UTF-8, pokud je k dispozici |
| `$nodeLabel.message.base64` | Binární payload ve formátu base64 |
| `$nodeLabel.message.sizeBytes` | Velikost payloadu |
| `$nodeLabel.message.isJson` | Zda byla zpráva parsována jako JSON |

### `onConnected`

Spustí se po úspěšném otevření socketu.

Užitečná pole:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` při prvním připojení, `true` při dalších opětovných připojeních |
| `$nodeLabel.connection.subprotocol` | Vyjednaný subprotokol |

### `onClosed`

Spustí se, když se navázané připojení uzavře.

Užitečná pole:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` nebo `unknown` |
| `$nodeLabel.close.code` | Kód uzavření WebSocketu |
| `$nodeLabel.close.reason` | Důvod uzavření |
| `$nodeLabel.close.wasClean` | `true` pro normální uzavření s kódem `1000` |
| `$nodeLabel.close.reconnecting` | Zda se uzel pokusí o opětovné připojení |

## Sémantika triggeru

- Jeden aktivní uzel udržuje jedno dlouhodobé odchozí připojení socketu.
- Připojení běží pouze na leader workeru, podobně jako režim příjmu u [IMAP Trigger](./imap-trigger-node.md) a [RabbitMQ](./rabbitmq-node.md).
- Pokud je povoleno opětovné připojení, Heym počká `retryWaitSeconds` a po výpadku socket znovu otevře.
- Každá vysílaná událost vytváří samostatné spuštění workflow s `trigger_source = "websocket"`.

## Zabezpečení odchozího provozu

- Ve výchozím nastavení musí URL používat `ws://` nebo `wss://` a překládat se pouze na veřejné adresy. Cíle typu loopback, privátní, link-local, multicast a cloud-metadata jsou blokovány.
- Heym znovu ověřuje DNS při každém opětovném připojení, validuje každou přeloženou adresu a připojuje se přímo k jedné z těchto adres. Proxy serveru prostředí a přesměrování WebSocketu jsou během aktivní ochrany zakázány.
- Trvalá porušení zásad zastaví trigger namísto nekonečného opakování. Dočasná selhání DNS nebo sítě se stále řídí nastavením opakování uzlu.
- Hlavičky `Authorization`, `Origin`, `User-Agent` a vlastní datové hlavičky jsou podporovány. `Origin` se odesílá prostřednictvím vyhrazené volby WebSocket klienta. Hlavičky `Host`, `Connection`, `Upgrade` a `Sec-WebSocket-*` nelze přepsat.
- Důvěryhodná self-hosted nasazení, která záměrně komunikují s interními službami, mohou nastavit `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. U hostovaných nebo multi-tenant nasazení ponechte výchozí hodnotu.

**Poznámka k upgradu na v0.0.105:** tato celoinstanční zásada nyní chrání také cíle odvozené z přihlašovacích údajů, které používají Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, vlastní spouštění LLM a vyhledávání modelů, AI asistent, guardrails a RAG embeddings. Stávající přihlašovací údaje odkazující na loopback, privátní nebo link-local adresy jsou odmítnuty, pokud není na důvěryhodné self-hosted instanci povoleno `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Dokud je ochrana aktivní, chránění HTTP klienti ignorují `HTTP_PROXY` a `HTTPS_PROXY`; povolení výjimky je obnoví. CA balíčky operátora konfigurované prostřednictvím `SSL_CERT_FILE` nebo `SSL_CERT_DIR` zůstávají podporovány. ClickHouse je kontrolován před otevřením připojení, ale není připnut v okamžiku navázání spojení, protože clickhouse-connect přináší vlastní urllib3 transport.

## Příklad workflow

**Externí datový tok událostí → filtr → notifikace**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** label: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** zpráva: `"Realtime alert: $streamEvent.message.data.title"`
## Příklad JSON uzlu

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## Související

- [Triggers](../reference/triggers.md) – Architektura background triggerů a `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Odesílání dat do externího socketu z kroku workflow
- [Node Types](../reference/node-types.md) – Přehled všech uzlů
- [Third-Party Integrations](../reference/integrations.md) – Které uzly používají přihlašovací údaje a které nikoli
