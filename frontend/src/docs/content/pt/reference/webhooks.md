# Webhooks

Os Workflows podem ser acionados através de webhooks HTTP. O endpoint de execução padrão devolve JSON, e a variante de streaming devolve Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Substitua `{workflow_id}` pelo UUID do workflow. O URL base é a sua instância Heym (por exemplo, `https://app.heym.ai`).

## Método do Pedido

Cada workflow aceita um verbo HTTP, escolhido no diálogo cURL do editor: `GET`, `POST`, `PUT` ou `DELETE`. **`POST` é a predefinição**, e todos os workflows criados antes da existência desta definição mantêm-no, pelo que nada do que funciona atualmente é alterado.

Chamar um workflow com um verbo diferente devolve `405 Method Not Allowed` com um cabeçalho `Allow` a indicar o verbo configurado:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Uma exceção: os pedidos que transportam `?test_run=true` ignoram a verificação. É o que o botão **Run** do editor e o painel de depuração enviam, pelo que um workflow definido como `GET` permanece testável a partir do próprio produto.

### Métodos sem corpo

`GET` e `DELETE` não transportam corpo no pedido. As entradas provêm da query string e são lidas com `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

O diálogo cURL oculta o editor de corpo do pedido e remove o cabeçalho `Content-Type` para estes dois métodos.

Combine `GET` com um [mapeador de saída HTML](../nodes/html-output-mapper-node.md) para servir uma página que um navegador possa abrir diretamente.

## Endpoint de Streaming

`POST /api/workflows/{workflow_id}/execute/stream`

Utilize o endpoint de streaming quando pretender eventos de execução incrementais em vez de uma única resposta JSON. Consulte [SSE Streaming](./sse-streaming.md) para o protocolo de eventos e a configuração da mensagem de início por nó.

## Formato do Pedido

O corpo do pedido é passado como `body` aos nós [Input](../nodes/input-node.md). O Heym aceita ambos os formatos de pedido:

- **JSON em bruto** – por exemplo, `{"userId": "123", "action": "create"}`
- **Formato encapsulado** – `{"inputs": {...}, "test_run": false}`

Ao utilizar o formato encapsulado, `inputs` é extraído e passado como `body`. `test_run` contorna a limitação de taxa e a cache de respostas. Também pode enviar `?test_run=true` como parâmetro de query ao publicar JSON em bruto.

## Modos do Corpo do Pedido

Cada workflow tem uma definição `webhook_body_mode` que controla a forma como o editor constrói pedidos de exemplo:

| Modo | Comportamento |
|------|----------|
| **defined** | O editor e o diálogo cURL constroem o corpo de exemplo a partir dos campos do nó Input do workflow e mantêm as chaves vazias no payload JSON. Os payloads cURL existentes no estilo defined continuam a funcionar. |
| **generic** | O editor e o diálogo cURL utilizam um corpo JSON de forma livre. O corpo do pedido é transmitido tal como está, para que as aplicações externas possam enviar o seu próprio formato de payload fixo. |

A API de execução mantém-se retrocompatível em ambos os modos. Os pedidos JSON em bruto e encapsulados `{ "inputs": ... }` continuam a ser aceites de qualquer forma.

Os cabeçalhos e os parâmetros de query estão disponíveis nas expressões como `$input.headers` e `$input.query`. As chaves dos cabeçalhos são convertidas para minúsculas.

## Autenticação

Configure por workflow no editor (definições do workflow). A autenticação é verificada antes da execução.

| auth_type | Comportamento |
|-----------|----------|
| **anonymous** | Não requer autenticação. Qualquer pessoa pode chamar o endpoint. |
| **jwt** | Requer Bearer token. Aceita um token de sessão de utilizador (o utilizador tem de ter acesso ao workflow) ou um [Execution Token](./execution-tokens.md) com âmbito criado para este workflow. |
| **header_auth** | O cabeçalho personalizado tem de corresponder. Defina `auth_header_key` (por exemplo, `X-API-Key`) e `auth_header_value`. |

Para `header_auth`, o valor do cabeçalho do pedido tem de corresponder exatamente ao valor configurado. Os utilizadores JWT com acesso ao workflow também podem chamar sem o cabeçalho personalizado.

Para `jwt`, os [Execution Tokens](./execution-tokens.md) são a forma recomendada de chamar workflows a partir de sistemas externos — têm âmbito limitado a um único workflow e podem ser revogados de forma independente.

## Cache de Respostas

Configure `cache_ttl_seconds` por workflow. Quando definido e superior a 0:

- **Chave de cache**: hash SHA256 de `workflow_id` + `body` + `query`
- **Acerto na cache**: devolve imediatamente com `status: "cached"` e as saídas em cache
- **Definição na cache**: apenas após uma execução bem-sucedida (`status: "success"`)
- **Armazenamento**: suportado por Postgres e partilhado entre os workers do backend

| Definição | Efeito |
|---------|--------|
| `cache_ttl_seconds` = 0 ou null | Cache desativada |
| `cache_ttl_seconds` > 0 | Respostas em cache durante este número de segundos |

Os pedidos `test_run` contornam a cache (sem leitura, sem escrita).

Quando a cache de respostas está ativada no diálogo cURL, **Clear cache** remove imediatamente as respostas em cache do workflow atual.

## Limitação de Taxa

Configure por workflow: `rate_limit_requests` e `rate_limit_window_seconds`.

- **Âmbito**: por `workflow_id` + IP do cliente (janela deslizante)
- **Excedido**: HTTP 429 com cabeçalho `Retry-After`
- **Cabeçalhos**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Definição | Descrição |
|---------|-------------|
| `rate_limit_requests` | Número máximo de pedidos permitidos na janela |
| `rate_limit_window_seconds` | Duração da janela em segundos |

Os pedidos `test_run` contornam a limitação de taxa.

## Formato da Resposta

O endpoint devolve JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Campo | Descrição |
|-------|-------------|
| `workflow_id` | UUID do Workflow |
| `status` | `success`, `error`, `cached` ou `rate_limited` |
| `outputs` | Saídas dos nós terminais. Com um único [mapeador de saída JSON](../nodes/json-output-mapper-node.md) como único terminal, o corpo da resposta é esse objeto mapeado ao nível superior (respostas JSON simples por predefinição). Caso contrário, inclui o nó [Output](../nodes/output-node.md) e outros terminais identificados por etiqueta. |
| `execution_time_ms` | Tempo de execução em milissegundos (0 para cached/rate_limited) |

Em caso de erro, `outputs` pode conter detalhes do erro. Um nó [Throw Error](../nodes/throw-error-node.md) pode definir um código de estado HTTP personalizado (4xx/5xx).

## Diálogo Run with cURL

O botão **Run with cURL** da barra de ferramentas (canto superior direito do editor, ícone `cURL`) abre um diálogo que constrói e copia um comando cURL pronto a executar para o workflow atual.

### O Que Faz

| Campo | Descrição |
|-------|-------------|
| **Request Body Mode** | Escolha **Defined** ou **Generic**. O modo Generic mantém o corpo como JSON em bruto em vez de o moldar a partir dos campos de Input. |
| **Authentication** | Escolha Anonymous, JWT Token ou Header Auth. Define o cabeçalho de autenticação correto no comando. Quando JWT Token está selecionado, o diálogo apresenta um gestor de [Execution Token](./execution-tokens.md) — crie ou selecione um token para o incorporar diretamente no comando. |
| **Header Key / Value** | Visível quando Header Auth está selecionado. Pré-preenchido a partir das definições de autenticação do workflow. |
| **Response Cache** | Minutos para colocar em cache respostas idênticas (0 = desativado). As alterações são guardadas no workflow. Quando ativado, **Clear cache** remove imediatamente as respostas em cache. |
| **Rate Limit** | Máximo de pedidos por janela temporal. As alterações são guardadas no workflow. |
| **SSE Streaming** | Muda o comando para `/execute/stream`, adiciona `--no-buffer` e expõe as definições da mensagem `node_start` por nó. |
| **Body** | Corpo do pedido em JSON. No modo Defined é pré-preenchido a partir dos campos de [Input](../nodes/input-node.md) e mantém chaves vazias. No modo Generic é um editor de JSON em bruto. |
| **Command** | Pré-visualização apenas de leitura do comando cURL completo. |

Clique em **Copy cURL** para copiar o comando para a área de transferência.

### Exemplo

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

No modo Generic, os payloads aninhados permanecem intactos, por exemplo:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

O diálogo reflete as definições de autenticação, modo de corpo, caching e rate-limit armazenadas no workflow — editá-las aqui atualiza o workflow imediatamente.

### SSE Streaming no Diálogo

Ative **SSE Streaming** quando pretender que o comando gerado acompanhe a execução em tempo real a partir do seu terminal.

- O endpoint muda de `/execute` para `/execute/stream`
- O comando adiciona `--no-buffer` e `Accept: text/event-stream`
- Cada nó não-sticky aparece numa lista onde pode:
  - ativar ou desativar a mensagem `node_start`
  - personalizar o texto da mensagem de início
- Os eventos `node_complete` são sempre emitidos e incluem a saída completa do nó

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

## Etiquetagem da Origem do Trigger

Cada execução armazena uma etiqueta `trigger_source` visível no [Histórico de Execuções](./execution-history.md). Defina-a enviando o cabeçalho `X-Trigger-Source` com qualquer valor à sua escolha:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

O botão **Copy cURL** no diálogo do editor inclui automaticamente `X-Trigger-Source: API`. Pode substituir `API` por qualquer valor significativo — `scheduler`, `rabbitmq`, `github-actions`, etc.

Se o cabeçalho não for enviado, `trigger_source` assume o valor predefinido `"API"` e a execução é etiquetada como **API** no histórico. Substitua-o por qualquer valor significativo para o seu sistema — `scheduler`, `github-actions`, `rabbitmq`, etc.

## Relacionado

- [Execution Tokens](./execution-tokens.md) – JWTs com âmbito para chamar workflows a partir de sistemas externos
- [SSE Streaming](./sse-streaming.md) – Transmitir eventos de nós em tempo real via Server-Sent Events
- [Triggers](./triggers.md) – Todos os pontos de entrada do workflow, incluindo webhook
- [Estrutura do Workflow](./workflow-structure.md) – Nós e arestas
- [Expression DSL](./expression-dsl.md) – Aceder a `$input.body`, `$input.headers`, `$input.query`
