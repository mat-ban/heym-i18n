# Webhooks

Workflows podem ser acionados via webhooks HTTP. O endpoint de execução padrão retorna JSON, e a variante de streaming retorna Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Substitua `{workflow_id}` pelo UUID do workflow. A URL base é a sua instância do Heym (por exemplo, `https://app.heym.ai`).

## Método da Requisição

Cada workflow aceita um verbo HTTP, escolhido no diálogo cURL do editor: `GET`, `POST`, `PUT` ou `DELETE`. **`POST` é o padrão**, e todo workflow criado antes da existência dessa configuração a mantém, portanto nada que funcione hoje será alterado.

Chamar um workflow com um verbo diferente retorna `405 Method Not Allowed` com um cabeçalho `Allow` indicando o verbo configurado:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Uma exceção: requisições que carregam `?test_run=true` ignoram a verificação. É isso que o botão **Run** do editor e o painel de debug enviam, então um workflow configurado como `GET` permanece testável de dentro do produto.

### Métodos sem corpo

`GET` e `DELETE` não carregam corpo de requisição. As entradas vêm da query string e são lidas com `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

O diálogo cURL oculta o editor de corpo da requisição e remove o cabeçalho `Content-Type` para esses dois métodos.

Combine `GET` com um [HTML output mapper](../nodes/html-output-mapper-node.md) para servir uma página que o navegador possa abrir diretamente.

## Endpoint de Streaming

`POST /api/workflows/{workflow_id}/execute/stream`

Use o endpoint de streaming quando quiser eventos de execução incrementais em vez de uma única resposta JSON. Consulte [SSE Streaming](./sse-streaming.md) para o protocolo de eventos e a configuração de mensagem de início por Nó.

## Formato da Requisição

O corpo da requisição é passado como `body` para os Nós [Input](../nodes/input-node.md). O Heym aceita ambos os formatos de requisição:

- **JSON bruto** – por exemplo, `{"userId": "123", "action": "create"}`
- **Formato encapsulado** – `{"inputs": {...}, "test_run": false}`

Ao usar o formato encapsulado, `inputs` é extraído e passado como `body`. `test_run` ignora o rate limiting e o cache de resposta. Você também pode enviar `?test_run=true` como parâmetro de query ao postar JSON bruto.

## Modos de Corpo da Requisição

Cada workflow possui uma configuração `webhook_body_mode` que controla como o editor constrói requisições de exemplo:

| Modo | Comportamento |
|------|----------|
| **defined** | O editor e o diálogo cURL moldam o corpo de exemplo a partir dos campos do Nó Input do workflow e mantêm chaves vazias no payload JSON. Payloads cURL existentes no estilo defined continuam funcionando. |
| **generic** | O editor e o diálogo cURL usam um corpo JSON de formato livre. O corpo da requisição é repassado como está, para que aplicações externas possam enviar seu próprio formato de payload fixo. |

A API de execução permanece retrocompatível em ambos os modos. Requisições JSON brutas e encapsuladas `{ "inputs": ... }` continuam sendo aceitas de qualquer forma.

Cabeçalhos e query params estão disponíveis em expressões como `$input.headers` e `$input.query`. As chaves de cabeçalho são convertidas para minúsculas.

## Autenticação

Configure por workflow no editor (configurações do workflow). A autenticação é verificada antes da execução.

| auth_type | Comportamento |
|-----------|----------|
| **anonymous** | Nenhuma autenticação necessária. Qualquer pessoa pode chamar o endpoint. |
| **jwt** | Bearer token obrigatório. Aceita tanto um token de sessão de usuário (o usuário deve ter acesso ao workflow) quanto um [Execution Token](./execution-tokens.md) com escopo criado para este workflow. |
| **header_auth** | Um cabeçalho customizado deve corresponder. Defina `auth_header_key` (por exemplo, `X-API-Key`) e `auth_header_value`. |

Para `header_auth`, o valor do cabeçalho da requisição deve corresponder exatamente ao valor configurado. Usuários JWT com acesso ao workflow também podem chamar sem o cabeçalho customizado.

Para `jwt`, os [Execution Tokens](./execution-tokens.md) são a forma recomendada de chamar workflows a partir de sistemas externos — eles têm escopo para um único workflow e podem ser revogados de forma independente.

## Cache de Resposta

Configure `cache_ttl_seconds` por workflow. Quando definido e maior que 0:

- **Chave de cache**: hash SHA256 de `workflow_id` + `body` + `query`
- **Cache hit**: Retorna imediatamente com `status: "cached"` e saídas em cache
- **Cache set**: Somente após uma execução bem-sucedida (`status: "success"`)
- **Armazenamento**: Com suporte em Postgres e compartilhado entre workers de backend

| Configuração | Efeito |
|---------|--------|
| `cache_ttl_seconds` = 0 ou null | Cache desabilitado |
| `cache_ttl_seconds` > 0 | Respostas em cache por esse número de segundos |

Requisições `test_run` ignoram o cache (sem leitura, sem escrita).

Quando o cache de resposta está habilitado no diálogo cURL, **Clear cache** remove imediatamente as respostas em cache do workflow atual.

## Rate Limiting

Configure por workflow: `rate_limit_requests` e `rate_limit_window_seconds`.

- **Escopo**: Por `workflow_id` + IP do cliente (janela deslizante)
- **Excedido**: HTTP 429 com cabeçalho `Retry-After`
- **Cabeçalhos**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Configuração | Descrição |
|---------|-----------|
| `rate_limit_requests` | Máximo de requisições permitidas na janela |
| `rate_limit_window_seconds` | Duração da janela em segundos |

Requisições `test_run` ignoram o rate limiting.
## Formato de Resposta

O endpoint retorna JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Campo | Descrição |
|-------|-----------|
| `workflow_id` | UUID do Workflow |
| `status` | `success`, `error`, `cached` ou `rate_limited` |
| `outputs` | Saídas dos nós terminais. Com um único [mapeador de saída JSON](../nodes/json-output-mapper-node.md) como único terminal, o corpo da resposta é esse objeto mapeado no nível superior (respostas JSON simples padrão). Caso contrário, inclui o [Output](../nodes/output-node.md) e outros terminais identificados por label. |
| `execution_time_ms` | Tempo de execução em milissegundos (0 para cached/rate_limited) |

Em caso de erro, `outputs` pode conter detalhes do erro. Um nó [Throw Error](../nodes/throw-error-node.md) pode definir um código de status HTTP personalizado (4xx/5xx).

## Diálogo Run with cURL

O botão **Run with cURL** na barra de ferramentas (canto superior direito do editor, ícone `cURL`) abre um diálogo que monta e copia um comando cURL pronto para execução referente ao Workflow atual.

### O Que Ele Faz

| Campo | Descrição |
|-------|-----------|
| **Request Body Mode** | Escolha **Defined** ou **Generic**. Generic mantém o corpo como JSON bruto em vez de moldá-lo a partir dos campos de Input. |
| **Authentication** | Escolha Anonymous, JWT Token ou Header Auth. Define o cabeçalho de autenticação correto no comando. Quando JWT Token é selecionado, o diálogo exibe um gerenciador de [Execution Token](./execution-tokens.md) — crie ou selecione um token para incorporá-lo diretamente ao comando. |
| **Header Key / Value** | Visível quando Header Auth está selecionado. Pré-preenchido a partir das configurações de autenticação do Workflow. |
| **Response Cache** | Minutos para armazenar em cache respostas idênticas (0 = desabilitado). As alterações são salvas no Workflow. Quando habilitado, **Clear cache** remove as respostas em cache imediatamente. |
| **Rate Limit** | Máximo de requisições por janela de tempo. As alterações são salvas no Workflow. |
| **SSE Streaming** | Alterna o comando para `/execute/stream`, adiciona `--no-buffer` e expõe configurações de mensagem `node_start` por nó. |
| **Body** | Corpo da requisição em JSON. No modo Defined, é pré-preenchido a partir dos campos de [Input](../nodes/input-node.md) e mantém chaves vazias. No modo Generic, é um editor de JSON bruto. |
| **Command** | Pré-visualização somente leitura do comando cURL completo. |

Clique em **Copy cURL** para copiar o comando para a área de transferência.

### Exemplo

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

No modo Generic, payloads aninhados permanecem intactos, por exemplo:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

O diálogo reflete as configurações de autenticação, modo de corpo, cache e rate limit armazenadas no Workflow — editá-las aqui atualiza o Workflow imediatamente.

### SSE Streaming no Diálogo

Habilite **SSE Streaming** quando quiser que o comando gerado acompanhe a execução em tempo real a partir do seu terminal.

- O endpoint muda de `/execute` para `/execute/stream`
- O comando adiciona `--no-buffer` e `Accept: text/event-stream`
- Cada nó não-sticky aparece em uma lista onde você pode:
  - habilitar ou desabilitar a mensagem `node_start`
  - personalizar o texto da mensagem de início
- Eventos `node_complete` são sempre emitidos e incluem a saída completa do nó

Exemplo:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Para o protocolo completo de eventos e exemplos, consulte [SSE Streaming](./sse-streaming.md).

## Marcação de Origem do Trigger

Cada execução armazena um rótulo `trigger_source` visível no [Execution History](./execution-history.md). Defina-o enviando o cabeçalho `X-Trigger-Source` com qualquer valor de sua escolha:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

O botão **Copy cURL** no diálogo do editor inclui `X-Trigger-Source: API` automaticamente. Você pode substituir `API` por qualquer valor significativo — `scheduler`, `rabbitmq`, `github-actions`, etc.

Se o cabeçalho não for enviado, `trigger_source` assume o padrão `"API"` e a execução é rotulada como **API** no histórico. Substitua-o por qualquer valor significativo para o seu sistema — `scheduler`, `github-actions`, `rabbitmq`, etc.

## Relacionados

- [Execution Tokens](./execution-tokens.md) – JWTs com escopo para chamar Workflows a partir de sistemas externos
- [SSE Streaming](./sse-streaming.md) – Transmita eventos de nós em tempo real via Server-Sent Events
- [Triggers](./triggers.md) – Todos os pontos de entrada do Workflow, incluindo webhook
- [Workflow Structure](./workflow-structure.md) – Nós e arestas
- [Expression DSL](./expression-dsl.md) – Acesse `$input.body`, `$input.headers`, `$input.query`
