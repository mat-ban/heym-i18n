# Streaming SSE

Os Workflows podem transmitir eventos de execução em tempo real com Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Este endpoint utiliza as mesmas regras de autenticação ao nível do workflow, limitação de taxa e cache de resposta que o endpoint de execução padrão documentado em [Webhooks](./webhooks.md).

## Ativar SSE na caixa de diálogo cURL

Abra a caixa de diálogo **Run with cURL** no editor e ative **SSE Streaming**.

Quando ativado, o Heym:

- altera o comando gerado de `/execute` para `/execute/stream`
- adiciona `--no-buffer` para que os eventos transmitidos apareçam imediatamente na saída do terminal
- adiciona `Accept: text/event-stream`
- permite configurar mensagens `node_start` por nó diretamente na caixa de diálogo

## Protocolo de Eventos

Cada frame SSE é JSON delimitado por nova linha e prefixado com `data: `.

| Tipo de evento | Quando é emitido | Campos principais |
|------------|--------------------|------------|
| `queued` | O workflow atingiu o seu [limite de simultaneidade](./webhooks.md#concurrency-limit-and-queued-runs); enviado novamente sempre que o lugar da execução é alterado | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Imediatamente após o pedido ser aceite, ou quando uma execução em fila começa | `execution_id`, `server_now_ms` |
| `node_start` | Imediatamente antes de um nó iniciar a execução | `node_id`, `node_label`, `started_at_ms`, `message` opcional |
| `node_retry` | Quando um nó é repetido | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Após um nó terminar | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Quando um nó Output retorna antecipadamente | `node_label`, `output` |
| `execution_complete` | Após o workflow terminar | `status`, `outputs`, `execution_time_ms` |

### Execuções na fila

Quando o workflow atinge o seu limite de simultaneidade, o stream permanece aberto e envia eventos `queued` enquanto a execução aguarda. Uma execução na fila é processada no worker em segundo plano, possivelmente noutro processo, pelo que o seu stream transmite `execution_started` quando a execução começa e `execution_complete` quando termina, mas nenhum evento `node_start`, `node_complete` ou de tokens de permeio. O seu `execution_complete` tem um `node_results` vazio; abra a execução no [Histórico de execuções](./execution-history.md) para obter detalhes do nó. O fecho da ligação não cancela uma execução na fila. Quando a fila está cheia, o pedido é respondido com `429` antes da abertura do stream.

## Mensagens de Início por Nó

A caixa de diálogo cURL armazena as configurações de SSE no próprio workflow:

- **Send start** controla se um evento `node_start` inclui uma `message`
- **Start message** tem como predefinição `[START] {nodeLabel}`
- ao limpar uma mensagem personalizada, é reposto o texto predefinido
- `node_complete` é sempre emitido e inclui sempre a saída do nó

Exemplo de configuração armazenada:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## Exemplo cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Exemplo de fluxo de eventos:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Notas de Segurança

- os workflows `anonymous`, `jwt` e `header_auth` comportam-se da mesma forma que o endpoint webhook normal
- o cache de resposta continua a aplicar-se quando `cache_ttl_seconds` está configurado
- os limites de taxa do workflow continuam a aplicar-se quando `rate_limit_requests` e `rate_limit_window_seconds` estão configurados
- `test_run` ignora tanto o cache como a limitação de taxa, tal como acontece com `/execute`

## Relacionado

- [Webhooks](./webhooks.md) – Endpoint de execução padrão e caixa de diálogo cURL
- [Parallel Execution](./parallel-execution.md) – Como o streaming se integra no agendador DAG do Heym
- [Canvas Features](./canvas-features.md) – Controlos do editor, incluindo Run with cURL
- [Security](./security.md) – Autenticação e gestão de segredos