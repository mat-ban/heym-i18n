# Tipos de Nó

O Heym oferece uma variedade de tipos de Nó para a construção de Workflows. Use [expressões](./expression-dsl.md) como `$input.text` e `$nodeLabel.field` na configuração do Nó.

## Nós de Trigger

| Nó | Descrição | Saídas |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Ponto de entrada de texto para o Workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Dispara em um agendamento (expressão cron) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Dispara quando uma atualização de webhook do bot do Telegram chega | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Dispara quando o Slack envia um webhook da Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Dispara quando o Discord envia um webhook de interação de aplicação | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Dispara quando um novo e-mail chega em uma caixa de correio IMAP | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Dispara quando o Heym publica um evento de plataforma (array em lote) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Dispara a partir de uma conexão de saída para um servidor WebSocket externo | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Gera um link de upload de uso único e inicia quando um arquivo grande é enviado | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Dispara quando uma mensagem é recebida de uma fila | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Executa quando qualquer Nó apresenta erro (sem aresta de entrada) | 1 |

Consulte [Triggers](./triggers.md) para todos os pontos de entrada.

## Nós de IA

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Processa texto com um modelo de linguagem | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Faz perguntas tipadas a um modelo de decisão e ramifica com base nas probabilidades retornadas | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM com tool calling, skills, MCP, [revisão humana](./human-in-the-loop.md) opcional e [grafo de memória persistente](./agent-persistent-memory.md) opcional. Consulte [Agent Architecture](./agent-architecture.md). | 1 | 1, mais saída `review` opcional |
| [Codex](../nodes/codex-node.md) | Executa o Codex CLI local em um repositório do GitHub usando um token de acesso ChatGPT/Codex | 1 | 1, mais saída `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Executa o OpenCode CLI em um repositório do GitHub em um contêiner reforçado usando uma chave de API do gateway OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Chama uma ferramenta MCP específica diretamente, sem que um LLM a selecione | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Insere, faz upsert, exclui ou pesquisa (vetorial ou híbrida vetorial + BM25) em um [vector store](../tabs/vectorstores-tab.md) Qdrant ou Postgres (pgvector) para RAG | 1 | 1 |

## Nós de Lógica

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Ramifica com base em if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Roteia correspondendo um valor a casos | 1 | n |
| [Merge](../nodes/merge-node.md) | Aguarda múltiplas entradas e mescla | n | 1 |
| [Loop](../nodes/loop-node.md) | Itera sobre um array | 1 | 2 (loop/done) |

## Nós de Dados

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transforma e mapeia dados | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Converte dados entre formatos (CSV, JSON, XML) e aplica OCR em imagens ou PDFs para texto | 1 | 1 |
| [Code](../nodes/code-node.md) | Executa Python em um sandbox descartável e isolado de rede com seu próprio requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Define ou obtém uma variável (local ao Workflow ou [global](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Chama outro Workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Lê Workflows do Heym e histórico de execução | 1 | 1 |
## Nós de Integração

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Realiza requisições HTTP (cURL) | 0 ou 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Conecta-se a um WebSocket externo e envia uma mensagem | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Envia mensagens de bot do Telegram | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Envia mensagens do Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Envia mensagens de webhook do Discord | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Envia e-mails via SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Operações no Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Lê/grava planilhas do Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Gerencia repositórios, usuários, issues, pull requests, reviews, releases, Workflows do Actions e arquivos por meio da API REST do GitHub | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Gerencia projetos, issues, comentários, anexos, usuários, notificações e transições de Workflow do Jira por meio da API REST do Jira | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Gerencia equipes, projetos, issues, estados de Workflow e comentários do Linear por meio de GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Lê/grava Google Sheets via OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Lista, baixa, atualiza e exclui arquivos do Google Drive via OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Executa consultas SQL e insere linhas no BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Consulta e modifica tabelas do Supabase por meio do PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Executa operações de SQL, CRUD e contagem no ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Gerencia bancos de dados, fontes de dados, páginas e blocos do Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Gerencia organizações, projetos, equipes, issues, eventos e releases do Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Gerencia buckets e pastas; lista, faz upload, baixa, copia e exclui objetos | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Lê/grava DataTables do Heym (armazenamento próprio) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Gerencia arquivos do Drive: excluir, definir senha, TTL, máximo de downloads, compartilhar/descompartilhar com a equipe | 1 | 1 |

## Nós de Automação

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Faz scraping de páginas web com FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Automação de navegador com passo de IA e Auto Heal | 1 | 1 |

## Nós Utilitários

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Atrasa a execução | 1 | 1 |
| [Output](../nodes/output-node.md) | Endpoint de saída | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mapeia campos para um objeto JSON; único terminal = corpo de webhook/execução de nível superior | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Renderiza uma página HTML; único terminal = webhook responde com text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Saída de widget de dashboard terminal que mapeia linhas upstream para payloads de gráfico | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Adiciona notas em markdown à tela (não é executado) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Registra no console do backend | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Desabilita outro Nó no Workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Habilita um Nó desabilitado no Workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Interrompe o Workflow com resposta de erro | 1 | 0 |

## Nós de Plugin

Os Nós de Plugin são fornecidos por plugins instalados na instância. Cada plugin
instalado aparece na paleta em **Plugins** com seu próprio nome; internamente,
ele é mapeado para um destes dois tipos de Nó.

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Ação personalizada fornecida por um plugin instalado | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Trigger personalizado fornecido por um plugin instalado | 0 | 1 |
## Relacionados

- [Recursos do Canvas](./canvas-features.md) – Data pin, logs de execução, ativar/desativar, extrair para sub-workflow
- [Nó Agente](../nodes/agent-node.md) – Referência detalhada para o Nó Agente de IA
- [Arquitetura do Agente](./agent-architecture.md) – Sub-agentes, orquestrador, skills, MCP, tool calling
- [Memória Persistente do Agente](./agent-persistent-memory.md) – Grafo de conhecimento por Nó, compartilhamento e extração em segundo plano
- [Human-in-the-Loop](./human-in-the-loop.md) – Pausar a saída do agente para aprovação humana
- [Expression DSL](./expression-dsl.md) – Referenciando dados na configuração do Nó
- [Diálogo de Avaliação de Expressões](./expression-evaluation-dialog.md) – Editor expansível com preview em tempo real do backend
- [Trigger de Upload de Arquivo](../nodes/file-upload-trigger-node.md) – Aceite uploads multipart grandes através de links de uso único
- [Trigger WebSocket](../nodes/websocket-trigger-node.md) – Trigger de socket de saída em tempo real
- [Envio via WebSocket](../nodes/websocket-send-node.md) – Enviar mensagens para sockets externos
- [Estrutura do Workflow](./workflow-structure.md) – Formato JSON para Nós e arestas
- [Triggers](./triggers.md) – Todos os pontos de entrada do workflow
- [Aba de Credenciais](../tabs/credentials-tab.md) – Adicionar chaves de API para LLM, HTTP e outros Nós
- [Compartilhamento de Credenciais](./credentials-sharing.md) – Compartilhar credenciais com outros usuários
- [Portal](./portal.md) – Expor workflows como interfaces de chat públicas
- [Aba de Vectorstores](../tabs/vectorstores-tab.md) – Criar vector stores para Nós de RAG
