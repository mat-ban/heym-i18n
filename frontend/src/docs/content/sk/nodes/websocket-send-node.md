# WebSocket Send

Uzol **WebSocket Send** otvára odchádzajúce klientske pripojenie k externému WebSocket serveru, odošle jednu správu a pripojenie zatvorí. Použite ho, keď workflow potrebuje odosielať udalosti do realtime systému bez toho, aby vystavoval socket endpoint vlastnený Heym.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `websocketUrl` | string / expression | Externá `ws://` alebo `wss://` URL |
| `websocketHeaders` | JSON object string / expression | Voliteľné handshake hlavičky |
| `websocketSubprotocols` | string | Voliteľný zoznam subprotokolov oddelený čiarkami |
| `websocketMessage` | expression | Payload na odoslanie |

## Pravidlá serializácie správ

- Ak sa `websocketMessage` vyhodnotí ako **string**, Heym odošle textový frame.
- Ak sa vyhodnotí ako **object**, **array**, **number**, **boolean** alebo `null`, Heym ho serializuje ako JSON text.
- Ak sa vyhodnotí ako **bytes**, Heym odošle binárny frame.
- Úplné výrazy ako `$input` zachovávajú natívne typy pred serializáciou.

## Výstupné polia

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` pri úspechu |
| `$nodeLabel.url` | Vyhodnotená cieľová URL |
| `$nodeLabel.message_type` | `text`, `json` alebo `binary` |
| `$nodeLabel.size_bytes` | Veľkosť payloadu v bajtoch |
| `$nodeLabel.subprotocol` | Vyjednaný subprotokol, ak je prítomný |
| `$nodeLabel.sent_at` | ISO časová značka |

## Príklad workflowu

**HTTP požiadavka → transformácia → publikovanie cez WebSocket**

```
input → set → websocketSend → output
```

- **Set** vytvorí payload objekt, napríklad `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** použije `$payloadNode` ako `websocketMessage`
- **Output** môže vrátiť `$socketSend.status`

## Príklad JSON uzla

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

- Pre tento uzol nie sú potrebné žiadne [prihlasovacie údaje](../reference/credentials.md).
- Ak vzdialený server očakáva autentifikačné alebo tenant hlavičky, odovzdajte ich cez `websocketHeaders`.
- Použite [HTTP](./http-node.md), keď je vzdialený systém založený na request/response namiesto socketov.

## Bezpečnosť odchádzajúcej komunikácie

- Štandardne musí URL používať `ws://` alebo `wss://` a musí sa prekladať iba na verejné adresy. Loopback, privátne, link-local, multicast a cloud-metadata destinácie sú blokované.
- Heym validuje každú preloženú adresu a pripája sa priamo k jednej z týchto adries. Environment proxy a WebSocket presmerovania sú počas aktívnej ochrany zakázané.
- Hlavičky `Authorization`, `Origin`, `User-Agent` a vlastné dátové hlavičky sú podporované. `Origin` sa odosiela cez dedikovanú voľbu WebSocket klienta. Hlavičky `Host`, `Connection`, `Upgrade` a `Sec-WebSocket-*` nie je možné prepísať.
- Dôveryhodné self-hosted nasadenia, ktoré zámerne komunikujú s internými službami, môžu nastaviť `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Na hostovaných alebo multi-tenant nasadeniach ponechajte predvolené nastavenie.

**Poznámka k upgradu pre v0.0.105:** táto politika na úrovni celej inštancie teraz chráni aj destinácie odvodené z prihlasovacích údajov, ktoré používajú Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, vlastné LLM spúšťanie a objavovanie modelov, AI asistent, guardrails a RAG embeddings. Existujúce prihlasovacie údaje, ktoré smerujú na loopback, privátne alebo link-local adresy, sú odmietnuté, pokiaľ nie je na dôveryhodnej self-hosted inštancii povolené `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Kým je ochrana aktívna, chránení HTTP klienti ignorujú `HTTP_PROXY` a `HTTPS_PROXY`; povolenie opt-out ich obnoví. CA balíky operátora nakonfigurované cez `SSL_CERT_FILE` alebo `SSL_CERT_DIR` zostávajú podporované. ClickHouse sa kontroluje pred otvorením pripojenia, ale nie je pripnutý v čase nadviazania spojenia, pretože clickhouse-connect prináša vlastný urllib3 transport.

## Súvisiace

- [WebSocket Trigger](./websocket-trigger-node.md) – Počúvajte na externom sockete a spúšťajte workflowy pri udalostiach
- [Typy uzlov](../reference/node-types.md) – Prehľad integračných uzlov
- [Expression DSL](../reference/expression-dsl.md) – Vytvárajte dynamické JSON payloady
- [Integrácie tretích strán](../reference/integrations.md) – Integrácie založené na prihlasovacích údajoch vs. priama konfigurácia
