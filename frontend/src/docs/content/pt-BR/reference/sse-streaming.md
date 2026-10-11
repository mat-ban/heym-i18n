# SSE Streaming

Os Workflows podem transmitir eventos de execução em tempo real com Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Este endpoint utiliza as mesmas regras de autenticação em nível de workflow, limitação de taxa e cache de resposta que o endpoint de execução padrão documentado em [Webhooks](./webhooks.md).

## Habilitando SSE no Diálogo cURL

Abra o diálogo **Run with cURL** no editor e habilite **SSE Streaming**.

Quando habilitado, o Heym:

- altera o comando gerado de `/execute` para `/execute/stream`
- adiciona `--no-buffer` para que os eventos transmitidos apareçam imediatamente na saída do terminal
- adiciona `Accept: text/event-stream`
- permite configurar mensagens `node_start` por nó diretamente no diálogo

## Protocolo de Eventos

Cada frame SSE é um JSON delimitado por nova linha, prefixado com `data: `.

| Tipo de evento | Quando é emitido | Campos principais |
|------------|--------------------|------------|
| `execution_started` | Imediatamente após a requisição ser aceita | `execution_id`, `server_now_ms` |
| `node_start` | Logo antes de um nó iniciar a execução | `node_id`, `node_label`, `started_at_ms`, `message` opcional |
| `node_retry` | Quando um nó é repetido | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Após um nó finalizar | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Quando um nó Output retorna antecipadamente | `node_label`, `output` |
| `execution_complete` | Após o workflow terminar | `status`, `outputs`, `execution_time_ms` |

## Mensagens de Início por Nó

O diálogo cURL armazena as configurações de SSE no próprio workflow:

- **Send start** controla se um evento `node_start` inclui uma `message`
- **Start message** tem como padrão `[START] {nodeLabel}`
- limpar uma mensagem personalizada reverte para o texto padrão
- `node_complete` é sempre emitido e sempre inclui a saída do nó

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

- workflows `anonymous`, `jwt` e `header_auth` se comportam da mesma forma que o endpoint de webhook regular
- o cache de resposta ainda se aplica quando `cache_ttl_seconds` está configurado
- os limites de taxa do workflow ainda se aplicam quando `rate_limit_requests` e `rate_limit_window_seconds` estão configurados
- `test_run` ignora tanto o cache quanto a limitação de taxa, da mesma forma que faz para `/execute`

## Relacionados

- [Webhooks](./webhooks.md) – Endpoint de execução padrão e diálogo cURL
- [Parallel Execution](./parallel-execution.md) – Como o streaming se encaixa no agendador DAG do Heym
- [Canvas Features](./canvas-features.md) – Controles do editor, incluindo Run with cURL
- [Security](./security.md) – Autenticação e tratamento de segredos
