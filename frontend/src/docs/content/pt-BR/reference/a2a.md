# A2A

O Heym disponibiliza o **Heym Agent** por meio do protocolo Agent2Agent (A2A 1.0, vinculação JSON-RPC). O Heym Agent é o mecanismo por trás da [Aba Chat](../tabs/chat-tab.md); clientes MCP acessam o mesmo agent como a ferramenta `heym_chat` (consulte a [Aba MCP / A2A](../tabs/mcp-tab.md)). Com o A2A ativado, outro agent pode enviar uma Task em linguagem natural e obter a resposta, contando com os mesmos recursos do Chat.

## Ativação

1. Abra a aba **MCP / A2A**.
2. Ative o **Heym Agent** no servidor padrão ou em um servidor nomeado e selecione suas credenciais e modelo.
3. Marque **Habilitar A2A**. O card exibirá a URL da **Agent Card** e o **Endpoint JSON-RPC**.

O A2A opera diretamente sobre o Heym Agent: desativar o agent também desativa o A2A.

## Endpoints

| | Servidor padrão | Servidor nomeado |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

A Agent Card não requer credenciais e não menciona usuário, servidor ou Workflow. Ela existe apenas enquanto o A2A estiver ativado: o card de domínio enquanto ao menos um usuário mantiver o A2A ativo no servidor padrão, e o card de um servidor nomeado enquanto o A2A desse servidor estiver ativo. Caso contrário, o endereço responderá com 404.

## Autenticação

Envie as mesmas credenciais utilizadas no MCP, exclusivamente nos cabeçalhos:

- `X-MCP-Key: <key>`: a chave do servidor padrão ou a chave do servidor nomeado
- `Authorization: Bearer <token>`: um Token OAuth gerado pelo servidor OAuth do Heym

Credenciais informadas na URL serão recusadas. A Agent Card declara ambos os esquemas, permitindo que um cliente A2A os obtenha diretamente da card.

## Métodos

| Método | Descrição |
|---|---|
| `SendMessage` | Inicia uma Task ou prossegue com uma em espera por entrada. Aguarda a resposta a menos que `configuration.returnImmediately` seja `true`. |
| `SendStreamingMessage` | O mesmo, em formato de stream Server-Sent Events do progresso da Task e seu resultado. |
| `GetTask` | Estado, resposta e histórico de uma Task (`historyLength` limita o tamanho do histórico). |
| `ListTasks` | Suas Tasks neste servidor, as mais recentes primeiro, filtradas por `contextId` ou `status`, com `pageSize` e `pageToken`. |
| `CancelTask` | Interrompe uma Task ainda em execução ou em espera. |
| `SubscribeToTask` | Acompanha uma Task em andamento. |
| `GetExtendedAgentCard` | A card com o nome do servidor e seus Workflows atribuídos como habilidades. |

Notificações push não são oferecidas: o card indica `pushNotifications: false`, e os métodos push respondem com `PushNotificationNotSupportedError`. As requisições utilizam A2A 1.0; envie `A2A-Version: 1.0`. Nomes de método do A2A 0.3, como `message/send`, respondem com `VersionNotSupportedError`.

## Tasks e conversas

Cada Task representa uma conversa na aba Chat, sinalizada por um ícone de rede. O `contextId` da Task é essa conversa: envie uma nova mensagem com o mesmo `contextId` e sem `taskId` para continuá-la.

| Ação do agent | Estado da Task |
|---|---|
| Respondeu | `TASK_STATE_COMPLETED`, com a resposta em texto e, quando houver registros salvos, os links para Workflows e suítes de avaliação como dados |
| Fez uma pergunta de esclarecimento | `TASK_STATE_INPUT_REQUIRED`: responda com o mesmo `taskId` |
| Requer credencial | `TASK_STATE_AUTH_REQUIRED`: a mensagem de status contém um link para a página de credenciais do Heym. O usuário deve abri-la em um navegador conectado ao Heym; o valor nunca passa pelo outro agent. Em seguida, envie uma mensagem na mesma Task para prosseguir. |
| Falhou | `TASK_STATE_FAILED`, acompanhado do motivo |
| Foi cancelada | `TASK_STATE_CANCELED` |

Uma mensagem enviada para uma Task concluída ou ainda em execução é recusada com `UnsupportedOperationError`. Mensagens aceitam partes `text` e `data`, com um limite combinado de 20.000 caracteres; arquivos anexados são recusados, portanto envie arquivos como links.

## Progresso

Enquanto uma Task é executada, o stream envia uma atualização de status a cada etapa, nas mesmas palavras exibidas pela aba Chat, por exemplo `Running workflow "Invoice Parser"` ou `Testing the workflow · attempt 2/5`. Clientes MCP recebem as mesmas etapas como `notifications/progress` a partir de `heym_chat`.

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

- `CancelTask` interrompe imediatamente o turno em execução na instância do Heym correspondente, exatamente como o botão Stop da aba Chat. Em outros locais, a Task é marcada como cancelada e o resultado atrasado do turno não é registrado.
- Sem notificações push, sem suporte a REST ou gRPC, sem Agent Cards assinadas.

## Relacionado

- [Aba MCP / A2A](../tabs/mcp-tab.md): ativar o Heym Agent e o A2A
- [Aba Chat](../tabs/chat-tab.md): o mecanismo central por trás do agent
- [Segurança](./security.md): armazenamento e gestão de chaves
