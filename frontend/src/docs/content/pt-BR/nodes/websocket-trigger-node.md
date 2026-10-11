# WebSocket Trigger

O nó **WebSocket Trigger** abre uma conexão de cliente de saída para um servidor WebSocket externo e inicia o workflow quando eventos selecionados do socket ocorrem. Utilize-o para fluxos de eventos como feeds de mercado, telemetria ou backplanes de chat. A conexão a sistemas de tempo real internos exige a opção de exclusão de URL privada descrita abaixo.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 |
| Saídas | 1 |
| Saída | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Comportamento Importante

- Este nó conecta **do Heym para outro servidor WebSocket**.
- Ele **não** expõe um endpoint WebSocket no Heym.
- Nenhuma [credencial](../reference/credentials.md) é necessária. Configure URL, headers e subprotocolos diretamente no nó.
- O worker líder mantém a conexão aberta em segundo plano e reconecta quando habilitado.

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `websocketUrl` | string | URL externa `ws://` ou `wss://` |
| `websocketHeaders` | JSON object string | Headers de handshake opcionais |
| `websocketSubprotocols` | string | Lista opcional de subprotocolos separados por vírgula |
| `websocketTriggerEvents` | array | Qualquer um entre `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Reconectar após uma desconexão |
| `retryWaitSeconds` | integer | Atraso antes de reconectar |

## Eventos Emitidos

### `onMessage`

Disparado quando um frame chega do socket remoto.

Campos úteis:

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.message.data` | Payload JSON analisado ou valor bruto da mensagem |
| `$nodeLabel.message.text` | Texto decodificado em UTF-8 quando disponível |
| `$nodeLabel.message.base64` | Payload binário em base64 |
| `$nodeLabel.message.sizeBytes` | Tamanho do payload |
| `$nodeLabel.message.isJson` | Indica se a mensagem foi analisada como JSON |

### `onConnected`

Disparado após o socket abrir com sucesso.

Campos úteis:

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` na primeira conexão, `true` em reconexões posteriores |
| `$nodeLabel.connection.subprotocol` | Subprotocolo negociado |

### `onClosed`

Disparado quando uma conexão estabelecida é encerrada.

Campos úteis:

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` ou `unknown` |
| `$nodeLabel.close.code` | Código de fechamento do WebSocket |
| `$nodeLabel.close.reason` | Motivo do fechamento |
| `$nodeLabel.close.wasClean` | `true` para fechamento normal `1000` |
| `$nodeLabel.close.reconnecting` | Indica se o nó tentará reconectar |

## Semântica do Trigger

- Um nó ativo mantém uma conexão de socket de saída de longa duração.
- A conexão é executada apenas no worker líder, de forma semelhante ao [IMAP Trigger](./imap-trigger-node.md) e ao modo de recebimento do [RabbitMQ](./rabbitmq-node.md).
- Se a reconexão estiver habilitada, o Heym aguarda `retryWaitSeconds` e abre o socket novamente após uma queda.
- Cada evento emitido cria uma execução de workflow separada com `trigger_source = "websocket"`.

## Segurança de Egress

- Por padrão, a URL deve usar `ws://` ou `wss://` e resolver apenas para endereços públicos. Destinos de loopback, privados, link-local, multicast e de metadados de nuvem são bloqueados.
- O Heym revalida o DNS a cada reconexão, valida cada endereço resolvido e conecta-se diretamente a um desses endereços. Proxies de ambiente e redirecionamentos de WebSocket são desabilitados enquanto o guard estiver ativo.
- Violações permanentes de política interrompem o trigger em vez de tentar novamente indefinidamente. Falhas temporárias de DNS ou de rede ainda seguem as configurações de retry do nó.
- `Authorization`, `Origin`, `User-Agent` e headers de dados personalizados são suportados. `Origin` é enviado por meio da opção dedicada do cliente WebSocket. Os headers `Host`, `Connection`, `Upgrade` e `Sec-WebSocket-*` não podem ser sobrescritos.
- Implantações self-hosted confiáveis que se conectam intencionalmente a serviços internos podem definir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenha o padrão em implantações hospedadas ou multi-tenant.

**Nota de atualização para v0.0.105:** esta política em nível de instância agora também protege destinos derivados de credenciais usados por Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, execução personalizada de LLM e descoberta de modelos, o assistente de IA, guardrails e embeddings de RAG. Credenciais existentes que apontam para endereços de loopback, privados ou link-local são recusadas, a menos que `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` esteja habilitado em uma instância self-hosted confiável. Enquanto o guard estiver ativo, clientes HTTP protegidos ignoram `HTTP_PROXY` e `HTTPS_PROXY`; habilitar a opção de exclusão os restaura. Bundles de CA do operador configurados por meio de `SSL_CERT_FILE` ou `SSL_CERT_DIR` continuam suportados. O ClickHouse é verificado antes da abertura da conexão, mas não é fixado no momento do dial, pois o clickhouse-connect traz seu próprio transporte urllib3.

## Exemplo de Workflow

**Fluxo de eventos externo → filtro → notificação**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** label: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** message: `"Realtime alert: $streamEvent.message.data.title"`
## Exemplo de JSON do nó

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

## Relacionados

- [Triggers](../reference/triggers.md) – Arquitetura de trigger em segundo plano e `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Envia dados para um socket externo a partir de uma etapa do workflow
- [Node Types](../reference/node-types.md) – Visão geral de todos os nós
- [Third-Party Integrations](../reference/integrations.md) – Quais nós utilizam credenciais e quais não utilizam
