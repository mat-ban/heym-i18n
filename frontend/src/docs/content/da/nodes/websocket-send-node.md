# WebSocket Send

**WebSocket Send**-noden åbner en udgående klientforbindelse til en ekstern WebSocket-server, sender én besked og lukker forbindelsen. Den anvendes, når et workflow skal skubbe hændelser til et realtidssystem uden at eksponere en socket-endpoint, der ejes af Heym.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `websocketUrl` | streng / udtryk | Ekstern `ws://` eller `wss://` URL |
| `websocketHeaders` | JSON-objektstreng / udtryk | Valgfrie håndtryks-headers |
| `websocketSubprotocols` | streng | Valgfri kommasepareret liste af underprotokoller |
| `websocketMessage` | udtryk | Payload der skal sendes |

## Besked-serialiseringsregler

- Hvis `websocketMessage` resulterer i en **streng**, sender Heym en tekstframe.
- Hvis det resulterer i et **objekt**, **array**, **tal**, **boolean** eller `null`, serialiseres det som JSON-tekst.
- Hvis det resulterer i **bytes**, sender Heym en binær frame.
- Fuldstændige udtryk som `$input` bevarer native typer før serialisering.

## Output-felter

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` ved succes |
| `$nodeLabel.url` | Resolveret destinations-URL |
| `$nodeLabel.message_type` | `text`, `json` eller `binary` |
| `$nodeLabel.size_bytes` | Payload-størrelse i bytes |
| `$nodeLabel.subprotocol` | Forhandlet underprotokol, når til stede |
| `$nodeLabel.sent_at` | ISO-tidsstempel |

## Eksempel-workflow

**HTTP-anmodning → transformér → publicér via WebSocket**

```
input → set → websocketSend → output
```

- **Set** opretter en payload som f.eks. `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** bruger `$payloadNode` som `websocketMessage`
- **Output** kan returnere `$socketSend.status`

## Eksempel-node-JSON

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

## Bemærkninger

- Ingen [legitimationsoplysninger](../reference/credentials.md) kræves for denne node.
- Hvis fjernserveren forventer auth- eller tenant-headers, sendes de via `websocketHeaders`.
- Brug [HTTP](./http-node.md), når fjernsystemet er baseret på request/response i stedet for socket-baseret.

## Egress-sikkerhed

- Som standard skal URL'en bruge `ws://` eller `wss://` og kun resultere i offentlige adresser. Loopback, private, link-local, multicast og cloud-metadata-destinationer blokeres.
- Heym validerer hver resolveret adresse og forbinder direkte til en af disse adresser. Miljøproxier og WebSocket-omdirigeringer deaktiveres, mens sikkerheden er aktiv.
- `Authorization`, `Origin`, `User-Agent` og brugerdefinerede data-headers understøttes. `Origin` sendes gennem WebSocket-klientens dedikerede option. `Host`, `Connection`, `Upgrade` og `Sec-WebSocket-*` headers kan ikke tilsidesættes.
- Selvhostede installationer, der bevidst forbinder til interne tjenester, kan sætte `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Behold standardindstillingen på hostede eller multi-tenant-installationer.

**Opgraderingsnote for v0.0.105:** Denne instansvide politik beskytter nu også credential-afledte destinationer brugt af Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, brugerdefineret LLM-udførelse og modelopdagelse, AI-assistenten, guardrails og RAG-embeddings. Eksisterende legitimationsoplysninger, der peger på loopback-, private eller link-local-adresser, afvises, medmindre `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` er aktiveret på en selvhostet installation. Mens sikkerheden er aktiv, ignorerer beskyttede HTTP-klienter `HTTP_PROXY` og `HTTPS_PROXY`; aktivering af opt-out gendanner dem. Operatør-CA-bundter konfigureret via `SSL_CERT_FILE` eller `SSL_CERT_DIR` forbliver understøttet. ClickHouse kontrolleres før forbindelsen åbnes, men er ikke fastgjort ved opkaldstidspunktet, da clickhouse-connect medbringer sit eget urllib3-transport.

## Relateret

- [WebSocket Trigger](./websocket-trigger-node.md) – Lyt til en ekstern socket og trigger workflows ved hændelser
- [Node-typer](../reference/node-types.md) – Overblik over integrationsnoder
- [Expression DSL](../reference/expression-dsl.md) – Byg dynamiske JSON-payloads
- [Tredjepartsintegrationer](../reference/integrations.md) – Credential-baserede vs direkte konfigurationsintegrationer
