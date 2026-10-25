# Portal

O **Portal** expõe workflows do Heym como UIs públicas no estilo chat. Os usuários finais podem executar workflows por meio de uma URL sem fazer login no Heym.

## O que ele faz

- **URL pública**: `/chat/{slug}` (ex.: `/chat/my-workflow`)
- **Interface de chat**: Os usuários interagem por meio de uma UI de chat (mensagens, entradas, respostas)
- **Autenticação opcional**: Se os usuários do portal estiverem configurados, o login será exigido; caso contrário, o portal é público
- **Streaming**: Progresso dos nós em tempo real durante a execução (quando habilitado)
- **Interromper execuções em andamento**: Os usuários podem interromper uma execução do portal em andamento pelo rodapé do chat; a execução ativa do workflow também é cancelada no lado do servidor
- **Upload de arquivos**: Uploads de arquivos opcionais (texto, imagens etc.) por campo de entrada
- **Encaminhamento para revisão humana**: Execuções do portal podem exibir [links de revisão HITL](./human-in-the-loop.md) quando um agente pausa para aprovação
- **Exibição de imagens**: Saídas do workflow que contenham imagens (ex.: de geração de imagens por LLM ou capturas de tela do Playwright) aparecem como miniaturas no chat. Clique em qualquer imagem para abrir um visualizador em tela cheia; pressione **Esc** ou use o botão voltar do dispositivo para fechar

## Configuração do Workflow

| Configuração | Descrição |
|---------|-------------|
| `portal_enabled` | Habilita o portal para este workflow |
| `portal_slug` | Slug da URL (ex.: `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Usa execução com streaming |
| `portal_file_upload_enabled` | Permite uploads de arquivos |
| `portal_file_config` | Configuração de arquivos por campo (tipos, limites) |

Configure no editor: o botão **Portal** no cabeçalho do workflow abre a caixa de diálogo de configurações do portal.

## Fluxo

1. **Info**: `GET /api/portal/{slug}/info` – Retorna metadados do workflow e campos de entrada (sem autenticação)
2. **Login** (se exigido): `POST /api/portal/{slug}/login` – Retorna o token de sessão
3. **Execute**: `POST /api/portal/{slug}/execute` – A UI de chat do portal chama este endpoint (ou sua variante de streaming internamente quando habilitado); os usuários finais interagem pela interface de chat, não chamando a API diretamente.
4. **Stop**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Solicitado quando o usuário pressiona **Stop** durante uma execução ativa do portal

## Limite de simultaneidade

Quando o workflow tem um [limite de simultaneidade](./webhooks.md#concurrency-limit-and-queued-runs) e todos os slots estão em uso, uma mensagem do portal aguarda sua vez em vez de ser executada imediatamente. O chat exibe **Waiting in queue (2/5)** em sua linha de progresso até que a execução comece, e depois a resposta habitual. A execução continua ocorrendo mesmo que o usuário feche a página. **Stop** remove da fila uma execução em espera. Quando a fila está cheia, a mensagem falha com "Concurrency queue is full". Uma execução que aguardou na fila não transmite sua resposta token por token; a resposta completa aparece quando a execução é concluída.

## HITL em execuções do Portal

Se um workflow do portal alcançar um [Nó Agent](../nodes/agent-node.md) com [Human-in-the-Loop](./human-in-the-loop.md) habilitado, a resposta do portal exibirá um link de revisão em vez de aparecer vazia.

- O status da execução do workflow passa a ser `pending`
- O chat do portal exibe a URL de revisão
- Quaisquer nós conectados à saída `review` do agente podem notificar o Slack, e-mail ou outros canais imediatamente
- Um revisor conclui a decisão em `/review/{token}` sem fazer login
- Após a revisão, o workflow é retomado a partir do snapshot armazenado

Isso torna possível combinar fluxos de chat públicos com etapas privadas de aprovação humana.

## Campos de entrada

Os campos de entrada vêm dos nós [Input](../nodes/input-node.md). A API extrai os nós iniciais do tipo `textInput` e seus `inputFields`. A execução usa o mesmo motor das execuções normais; as entradas são passadas como `body.inputs` e `conversation_history` para fluxos com múltiplos turnos.

## Autenticação e sessões

- **WorkflowPortalUser**: Nome de usuário/senha por workflow (quando a autenticação está habilitada)
- **Remover o último usuário**: Com o portal ativado, excluir o último usuário do portal torna o portal público novamente; a caixa de diálogo de configurações solicita confirmação primeiro
- **PortalSession**: Tokens de sessão com TTL de 168 horas
- **Limitação de taxa**: 3 tentativas de login malsucedidas → banimento de 24h por workflow+IP
- As sessões expiradas são limpas por um cron job

## UI de configuração

Abas do **WebPortalSettingsDialog**:

1. **General**: Habilita o portal, define o slug, copia a URL do portal
2. **Users**: Adiciona/remove usuários do portal (nome de usuário/senha)
3. **Options**: Modo de streaming, upload de arquivos, visualização dos campos de entrada

## Relacionados

- [Por que o Heym](../getting-started/why-heym.md) – O Portal como uma superfície de chat para agentes em produção
- [Aba Workflows](../tabs/workflows-tab.md) – Crie workflows e habilite o portal
- [Human-in-the-Loop](./human-in-the-loop.md) – Páginas públicas de revisão para saídas pendentes de agentes
- [Triggers](./triggers.md) – O Portal como ponto de entrada
- [Tipos de nós](./node-types.md) – [Input](../nodes/input-node.md) para entradas do portal
- [Estrutura do Workflow](./workflow-structure.md) – Nós e arestas
