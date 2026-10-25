# Portal

O **Portal** expõe Workflows do Heym como interfaces públicas de Chat. Os usuários finais podem executar Workflows através de um URL sem iniciar sessão no Heym.

## O Que Faz

- **URL Público**: `/chat/{slug}` (ex.: `/chat/my-workflow`)
- **Interface de Chat**: Os usuários interagem através de uma UI de Chat (mensagens, entradas, respostas)
- **Autenticação opcional**: Se os usuários do Portal estiverem configurados, o início de sessão é obrigatório; caso contrário, o Portal é público
- **Streaming**: Progresso dos nós em tempo real durante a execução (quando ativado)
- **Parar Execuções em Curso**: Os usuários podem parar uma execução do Portal em curso a partir do rodapé do Chat; a execução ativa do Workflow é igualmente cancelada no servidor
- **Carregamento de Ficheiros**: Carregamentos de ficheiros opcionais (texto, imagens, etc.) por campo de entrada
- **Transferência para Revisão Humana**: As execuções do Portal podem apresentar [links de revisão HITL](./human-in-the-loop.md) quando um agente pausa para aprovação
- **Apresentação de Imagens**: As saídas do Workflow que contenham imagens (ex.: de geração de imagens por LLM ou capturas de ecrã do Playwright) aparecem como miniaturas no Chat. Clique em qualquer imagem para abrir um visualizador em ecrã inteiro; prima **Esc** ou utilize o botão de retroceder do dispositivo para fechar

## Configuração do Workflow

| Definição | Descrição |
|---------|-------------|
| `portal_enabled` | Ativar o Portal para este Workflow |
| `portal_slug` | Slug do URL (ex.: `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Utilizar execução com streaming |
| `portal_file_upload_enabled` | Permitir carregamento de ficheiros |
| `portal_file_config` | Configuração de ficheiros por campo (tipos, limites) |

Configure no editor: O botão **Portal** no cabeçalho do Workflow abre a caixa de diálogo de definições do Portal.

## Fluxo

1. **Informação**: `GET /api/portal/{slug}/info` – Devolve os metadados do Workflow e os campos de entrada (sem autenticação)
2. **Início de Sessão** (se necessário): `POST /api/portal/{slug}/login` – Devolve o Token de sessão
3. **Executar**: `POST /api/portal/{slug}/execute` – A UI de Chat do Portal chama este Endpoint (ou a sua variante de streaming internamente quando ativada); os usuários finais interagem através da interface de Chat, não chamando a API diretamente.
4. **Parar**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Solicitado quando o usuário prime **Parar** durante uma execução ativa do Portal

## Limite de simultaneidade

Quando o workflow tem um [limite de simultaneidade](./webhooks.md#concurrency-limit-and-queued-runs) e todos os slots estão em utilização, uma mensagem do portal aguarda a sua vez em vez de ser executada imediatamente. O chat mostra **Waiting in queue (2/5)** na sua linha de progresso até que a execução comece, apresentando depois a resposta habitual. A execução continua a ocorrer mesmo que o utilizador feche a página. **Stop** retira uma execução em espera da fila. Quando a fila está cheia, a mensagem falha com "Concurrency queue is full". Uma execução que aguardou na fila não transmite a sua resposta token a token; a resposta completa é apresentada quando a execução termina.

## HITL em Execuções do Portal

Se um Workflow do Portal atingir um [Nó Agent](../nodes/agent-node.md) com [Human-in-the-Loop](./human-in-the-loop.md) ativado, a resposta do Portal apresenta um link de revisão em vez de aparecer vazia.

- O estado da execução do Workflow passa a `pending`
- O Chat do Portal apresenta o URL de revisão
- Quaisquer nós ligados ao manipulador de saída `review` do agente podem notificar o Slack, email ou outros canais imediatamente
- Um revisor conclui a decisão em `/review/{token}` sem iniciar sessão
- Após a revisão, o Workflow retoma a partir do snapshot armazenado

Isto torna possível combinar fluxos de Chat públicos com etapas privadas de aprovação humana.

## Campos de Entrada

Os campos de entrada provêm dos nós [Input](../nodes/input-node.md). A API extrai os nós iniciais do tipo `textInput` e os respetivos `inputFields`. A execução utiliza o mesmo motor que as execuções normais; as entradas são passadas como `body.inputs` e `conversation_history` para fluxos com múltiplos turnos.

## Autenticação e Sessões

- **WorkflowPortalUser**: Nome de usuário/palavra-passe por Workflow (quando a autenticação está ativada)
- **Remover o último utilizador**: Com o portal ativado, eliminar o último utilizador do portal torna o portal público novamente; a caixa de diálogo de definições solicita confirmação primeiro
- **PortalSession**: Tokens de sessão com TTL de 168 horas
- **Limitação de taxa**: 3 tentativas de início de sessão falhadas → banimento de 24h por Workflow+IP
- As sessões expiradas são limpas por uma tarefa Cron

## UI de Configuração

**WebPortalSettingsDialog** separadores:

1. **Geral**: Ativar o Portal, definir o slug, copiar o URL do Portal
2. **Usuários**: Adicionar/remover usuários do Portal (nome de usuário/palavra-passe)
3. **Opções**: Modo de streaming, carregamento de ficheiros, ver campos de entrada

## Relacionado

- [Porquê o Heym](../getting-started/why-heym.md) – O Portal como superfície de Chat para agentes em produção
- [Separador Workflows](../tabs/workflows-tab.md) – Criar Workflows e ativar o Portal
- [Human-in-the-Loop](./human-in-the-loop.md) – Páginas de revisão públicas para saídas de agentes pendentes
- [Triggers](./triggers.md) – O Portal como ponto de entrada
- [Tipos de Nó](./node-types.md) – [Input](../nodes/input-node.md) para entradas do Portal
- [Estrutura do Workflow](./workflow-structure.md) – Nós e arestas