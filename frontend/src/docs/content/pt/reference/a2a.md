# A2A

O Heym disponibiliza o **Heym Agent** através do protocolo Agent2Agent (A2A 1.0, integração JSON-RPC). O Heym Agent é o motor por detrás do [Separador Chat](../tabs/chat-tab.md); os clientes MCP contactam o mesmo agent através da ferramenta `heym_chat` (consulte o [Separador MCP / A2A](../tabs/mcp-tab.md)). Com o A2A ativo, outro agent pode enviar-lhe uma Task em linguagem natural e receber a resposta, com as mesmas capacidades do Chat.

## Ativação

1. Abra o separador **MCP / A2A**.
2. Ative o **Heym Agent** no servidor predefinido ou num servidor nomeado e selecione as credenciais e o modelo.
3. Selecione **Ativar A2A**. O cartão apresenta o URL da **Agent Card** e o **Endpoint JSON-RPC**.

O A2A depende do Heym Agent: desativar o agent desativa igualmente o A2A.

## Endpoints

| | Servidor predefinido | Servidor nomeado |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

A Agent Card não exige credenciais e não identifica qualquer utilizador, servidor ou Workflow. Só existe enquanto o A2A estiver ativo: a placa de domínio enquanto pelo menos um utilizador tiver o A2A ativo no servidor predefinido; a placa de um servidor nomeado enquanto o A2A desse servidor estiver ativo. Caso contrário, o endereço devolve 404.

## Autenticação

Envie as mesmas credenciais do MCP, exclusivamente nos cabeçalhos:

- `X-MCP-Key: <key>`: a chave do servidor predefinido ou a chave do servidor nomeado
- `Authorization: Bearer <token>`: um Token OAuth emitido pelo servidor OAuth do Heym

As credenciais no URL são recusadas. A Agent Card declara ambos os esquemas, permitindo que um cliente A2A as consulte a partir do cartão.

## Métodos

| Método | Descrição |
|---|---|
| `SendMessage` | Inicia uma Task ou retoma uma que esteja a aguardar intervenção. Aguarda a resposta, a menos que `configuration.returnImmediately` seja `true`. |
| `SendStreamingMessage` | O mesmo, num fluxo Server-Sent Events do progresso e do resultado da Task. |
| `GetTask` | Estado, resposta e histórico de uma Task (`historyLength` limita o histórico). |
| `ListTasks` | As suas Tasks neste servidor, as mais recentes primeiro, filtradas por `contextId` ou `status`, com `pageSize` e `pageToken`. |
| `CancelTask` | Interrompe uma Task ainda em execução ou em espera. |
| `SubscribeToTask` | Acompanha uma Task ainda em processamento. |
| `GetExtendedAgentCard` | A placa com o nome do servidor e os respetivos Workflows atribuídos como competências. |

As notificações push não são disponibilizadas: o cartão indica `pushNotifications: false`, e os métodos push respondem com `PushNotificationNotSupportedError`. Os pedidos utilizam o A2A 1.0; envie `A2A-Version: 1.0`. Os métodos do A2A 0.3, como `message/send`, respondem com `VersionNotSupportedError`.

## Tasks e conversações

Cada Task representa uma conversação no separador Chat, identificada por um ícone de rede. O `contextId` da Task é essa conversação: envie uma nova mensagem com o mesmo `contextId` e sem `taskId` para a continuar.

| Ação do agent | Estado da Task |
|---|---|
| Respondeu | `TASK_STATE_COMPLETED`, com a resposta em texto e, caso existam registos guardados, as hiperligações para Workflows e pacotes de avaliação como dados |
| Formulou uma questão de esclarecimento | `TASK_STATE_INPUT_REQUIRED`: responda com o mesmo `taskId` |
| Necessita de credenciais | `TASK_STATE_AUTH_REQUIRED`: a mensagem de estado contém uma ligação para a página de credenciais do Heym. O utilizador abre-a num navegador autenticado no Heym; o valor nunca é transmitido através do outro agent. Em seguida, envie uma mensagem na mesma Task para prosseguir. |
| Falhou | `TASK_STATE_FAILED`, acompanhado do motivo |
| Foi cancelada | `TASK_STATE_CANCELED` |

Uma mensagem enviada para uma Task concluída ou ainda em execução é recusada com `UnsupportedOperationError`. As mensagens aceitam partes `text` e `data`, com um limite combinado de 20 000 carateres; partes de ficheiros são rejeitadas, pelo que os ficheiros devem ser enviados como hiperligações.

## Progresso

Enquanto uma Task está a ser executada, o fluxo transmite uma atualização de estado para cada etapa, nos mesmos termos apresentados no separador Chat, como `Running workflow "Invoice Parser"` ou `Testing the workflow · attempt 2/5`. Os clientes MCP recebem as mesmas etapas através de `notifications/progress` do `heym_chat`.

## Exemplo

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## Limites

- `CancelTask` interrompe de imediato a ronda em execução na instância do Heym responsável, à semelhança do botão Stop do separador Chat. Noutros locais, a Task é marcada como cancelada e o resultado tardio não é registado.
- Sem notificações push, sem suporte REST ou gRPC, sem Agent Cards assinadas.

## Relacionado

- [Separador MCP / A2A](../tabs/mcp-tab.md): ativar o Heym Agent e o A2A
- [Separador Chat](../tabs/chat-tab.md): o motor do agent
- [Segurança](./security.md): armazenamento e proteção de chaves
