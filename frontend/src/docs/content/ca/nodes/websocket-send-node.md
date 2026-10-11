# WebSocket Send

El node **WebSocket Send** obre una connexió de client sortint cap a un servidor WebSocket extern, envia un missatge i tanca la connexió. Utilitzeu-lo quan un workflow necessiti publicar esdeveniments cap a un sistema en temps real sense exposar un endpoint de socket propietat de Heym.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `websocketUrl` | string / expressió | URL externa `ws://` o `wss://` |
| `websocketHeaders` | string d'objecte JSON / expressió | Capçaleres de handshake opcionals |
| `websocketSubprotocols` | string | Llista opcional de subprotocols separats per comes |
| `websocketMessage` | expressió | Payload a enviar |

## Regles de serialització de missatges

- Si `websocketMessage` es resol com a **string**, Heym envia un text frame.
- Si es resol com a **object**, **array**, **number**, **boolean** o `null`, Heym el serialitza com a text JSON.
- Si es resol com a **bytes**, Heym envia un binary frame.
- Les expressions completes com ara `$input` preserven els tipus natius abans de la serialització.

## Camps de sortida

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` en cas d'èxit |
| `$nodeLabel.url` | URL de destinació resolta |
| `$nodeLabel.message_type` | `text`, `json` o `binary` |
| `$nodeLabel.size_bytes` | Mida del payload en bytes |
| `$nodeLabel.subprotocol` | Subprotocol negociat quan està present |
| `$nodeLabel.sent_at` | Marca de temps ISO |

## Workflow d'exemple

**Petició HTTP → transformació → publicació per WebSocket**

```
input → set → websocketSend → output
```

- **Set** crea un objecte payload com ara `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** utilitza `$payloadNode` com a `websocketMessage`
- **Output** pot retornar `$socketSend.status`

## JSON d'exemple del node

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

## Notes

- Aquest node no requereix cap [credencial](../reference/credentials.md).
- Si el servidor remot espera capçaleres d'autenticació o de tenant, passeu-les mitjançant `websocketHeaders`.
- Utilitzeu [HTTP](./http-node.md) quan el sistema remot es basi en petició/resposta en lloc de sockets.

## Seguretat de sortida

- Per defecte, l'URL ha d'utilitzar `ws://` o `wss://` i resoldre's únicament a adreces públiques. Les destinacions de loopback, privades, link-local, multicast i de metadades del núvol estan bloquejades.
- Heym valida cada adreça resolta i es connecta directament a una d'aquestes adreces. Els proxys d'entorn i les redireccions de WebSocket estan desactivats mentre la protecció està activa.
- Les capçaleres `Authorization`, `Origin`, `User-Agent` i les capçaleres de dades personalitzades són compatibles. `Origin` s'envia mitjançant l'opció dedicada del client WebSocket. Les capçaleres `Host`, `Connection`, `Upgrade` i `Sec-WebSocket-*` no es poden sobreescriure.
- Els desplegaments autoallotjats de confiança que es connectin intencionadament a serveis interns poden establir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Manteniu el valor per defecte en desplegaments allotjats o multi-tenant.

**Nota d'actualització per a la v0.0.105:** aquesta política a nivell d'instància ara també protegeix les destinacions derivades de credencials utilitzades per Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, l'execució personalitzada de LLM i el descobriment de models, l'assistent d'IA, els guardrails i els embeddings de RAG. Les credencials existents que apunten a adreces de loopback, privades o link-local es rebutgen tret que `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` estigui habilitat en una instància autoallotjada de confiança. Mentre la protecció està activa, els clients HTTP protegits ignoren `HTTP_PROXY` i `HTTPS_PROXY`; habilitar l'opt-out els restaura. Els paquets de CA de l'operador configurats mitjançant `SSL_CERT_FILE` o `SSL_CERT_DIR` continuen sent compatibles. ClickHouse es comprova abans que s'obri la connexió, però no es fixa en el moment del dial, perquè clickhouse-connect aporta el seu propi transport urllib3.

## Relacionat

- [WebSocket Trigger](./websocket-trigger-node.md) – Escolteu un socket extern i activeu workflows davant d'esdeveniments
- [Node Types](../reference/node-types.md) – Visió general dels nodes d'integració
- [Expression DSL](../reference/expression-dsl.md) – Construïu payloads JSON dinàmics
- [Third-Party Integrations](../reference/integrations.md) – Integracions basades en credencials vs. de configuració directa