# Envio WebSocket

O nó **WebSocket Send** abre uma conexão de cliente de saída para um servidor WebSocket externo, envia uma mensagem e fecha a conexão. Utilize-o quando um workflow precisar enviar eventos para um sistema em tempo real sem expor um endpoint de socket pertencente ao Heym.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `websocketUrl` | string / expression | URL externa `ws://` ou `wss://` |
| `websocketHeaders` | string de objeto JSON / expression | Headers de handshake opcionais |
| `websocketSubprotocols` | string | Lista opcional de subprotocolos separados por vírgula |
| `websocketMessage` | expression | Payload a ser enviado |

## Regras de Serialização de Mensagens

- Se `websocketMessage` for resolvido como uma **string**, o Heym envia um frame de texto.
- Se for resolvido como um **objeto**, **array**, **número**, **booleano** ou `null`, o Heym o serializa como texto JSON.
- Se for resolvido como **bytes**, o Heym envia um frame binário.
- Expressões completas como `$input` preservam os tipos nativos antes da serialização.

## Campos de Saída

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` em caso de sucesso |
| `$nodeLabel.url` | URL de destino resolvida |
| `$nodeLabel.message_type` | `text`, `json` ou `binary` |
| `$nodeLabel.size_bytes` | Tamanho do payload em bytes |
| `$nodeLabel.subprotocol` | Subprotocolo negociado, quando presente |
| `$nodeLabel.sent_at` | Timestamp ISO |

## Exemplo de Workflow

**Requisição HTTP → transformação → publicação via WebSocket**

```
input → set → websocketSend → output
```

- O nó **Set** cria um objeto de payload como `{ "type": "user.updated", "user": $input.body }`
- O nó **WebSocket Send** utiliza `$payloadNode` como `websocketMessage`
- O nó **Output** pode retornar `$socketSend.status`

## Exemplo de JSON do Nó

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

## Observações

- Nenhuma [credencial](../reference/credentials.md) é necessária para este nó.
- Se o servidor remoto esperar headers de autenticação ou de tenant, passe-os via `websocketHeaders`.
- Utilize o nó [HTTP](./http-node.md) quando o sistema remoto for baseado em requisição/resposta em vez de socket.

## Segurança de Saída (Egress)

- Por padrão, a URL deve usar `ws://` ou `wss://` e resolver apenas para endereços públicos. Destinos de loopback, privados, link-local, multicast e de metadados de nuvem são bloqueados.
- O Heym valida cada endereço resolvido e se conecta diretamente a um desses endereços. Proxies de ambiente e redirecionamentos de WebSocket são desabilitados enquanto a proteção estiver ativa.
- Headers `Authorization`, `Origin`, `User-Agent` e headers de dados personalizados são suportados. O `Origin` é enviado por meio da opção dedicada do cliente WebSocket. Os headers `Host`, `Connection`, `Upgrade` e `Sec-WebSocket-*` não podem ser sobrescritos.
- Implantações auto-hospedadas confiáveis que se conectam intencionalmente a serviços internos podem definir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenha o padrão em implantações hospedadas ou multi-tenant.

**Nota de atualização para a v0.0.105:** esta política de escopo da instância agora também protege destinos derivados de credenciais utilizados pelo Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, execução personalizada de LLM e descoberta de modelos, o assistente de IA, guardrails e embeddings de RAG. Credenciais existentes que apontam para endereços de loopback, privados ou link-local são recusadas, a menos que `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` esteja habilitado em uma instância auto-hospedada confiável. Enquanto a proteção estiver ativa, os clientes HTTP protegidos ignoram `HTTP_PROXY` e `HTTPS_PROXY`; habilitar a opção de exclusão os restaura. Os pacotes de CA do operador configurados por meio de `SSL_CERT_FILE` ou `SSL_CERT_DIR` continuam suportados. O ClickHouse é verificado antes da abertura da conexão, mas não é fixado no momento da discagem, pois o clickhouse-connect traz seu próprio transporte urllib3.

## Relacionados

- [WebSocket Trigger](./websocket-trigger-node.md) – Escute um socket externo e dispare workflows em eventos
- [Tipos de Nó](../reference/node-types.md) – Visão geral dos nós de integração
- [Expression DSL](../reference/expression-dsl.md) – Construa payloads JSON dinâmicos
- [Integrações de Terceiros](../reference/integrations.md) – Integrações com credenciais vs. configuração direta
