# Tipos de Nó

O Heym disponibiliza uma variedade de tipos de nó para a construção de workflows. Utilize [expressões](./expression-dsl.md) como `$input.text` e `$nodeLabel.field` na configuração dos nós.

## Nós de Trigger

| Nó | Descrição | Saídas |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Ponto de entrada de texto para o workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger segundo um agendamento (expressão cron) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger quando chega uma atualização de webhook de um bot do Telegram | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger quando o Slack envia um webhook da Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger quando o Discord envia um webhook de interação de aplicação | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger quando chega um novo email a uma caixa de correio IMAP | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger quando o Heym publica um evento da plataforma (array em lote) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger a partir de uma ligação de saída para um servidor WebSocket externo | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Gera uma ligação de upload de utilização única e inicia quando é carregado um ficheiro grande | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger quando é recebida uma mensagem de uma fila | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Executa quando qualquer nó apresenta erro (sem aresta de entrada) | 1 |

Consulte [Triggers](./triggers.md) para conhecer todos os pontos de entrada.

## Nós de IA

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Processa texto com um modelo de linguagem | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Coloca perguntas tipificadas a um modelo de decisão e ramifica com base nas probabilidades devolvidas | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM com chamada de ferramentas, skills, MCP, [revisão humana](./human-in-the-loop.md) opcional e [grafo de memória persistente](./agent-persistent-memory.md) opcional. Consulte [Agent Architecture](./agent-architecture.md). | 1 | 1, mais uma saída `review` opcional |
| [Codex](../nodes/codex-node.md) | Executa a CLI local do Codex contra um repositório GitHub utilizando um token de acesso ChatGPT/Codex | 1 | 1, mais uma saída `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Executa a CLI do OpenCode contra um repositório GitHub num contentor reforçado utilizando uma chave de API do gateway OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Chama diretamente uma ferramenta MCP específica sem que um LLM a selecione | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Insere, faz upsert, elimina ou pesquisa (vetorial ou híbrida vetorial + BM25) num [armazenamento vetorial](../tabs/vectorstores-tab.md) Qdrant ou Postgres (pgvector) para RAG | 1 | 1 |

## Nós de Lógica

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Ramifica com base em if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Encaminha correspondendo um valor a casos | 1 | n |
| [Merge](../nodes/merge-node.md) | Aguarda por múltiplas entradas e funde-as | n | 1 |
| [Loop](../nodes/loop-node.md) | Itera sobre um array | 1 | 2 (loop/done) |

## Nós de Dados

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transforma e mapeia dados | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Converte dados entre formatos (CSV, JSON, XML) e aplica OCR a imagens ou PDFs para texto | 1 | 1 |
| [Code](../nodes/code-node.md) | Executa Python numa sandbox descartável e isolada da rede, com o seu próprio requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Define ou obtém uma variável (local ao workflow ou [global](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Chama outro workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Lê workflows do Heym e o histórico de execuções | 1 | 1 |

## Nós de Integração

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Efetuar pedidos HTTP (cURL) | 0 ou 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Ligar a um WebSocket externo e enviar uma mensagem | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Enviar mensagens de bot do Telegram | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Enviar mensagens do Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Enviar mensagens de webhook do Discord | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Enviar emails via SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Operações Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Ler/escrever folhas de cálculo Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Gerir repositórios, utilizadores, issues, pull requests, revisões, releases, workflows do Actions e ficheiros através da API REST do GitHub | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Gerir projetos, issues, comentários, anexos, utilizadores, notificações e transições de workflow do Jira através da API REST do Jira | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Gerir equipas, projetos, issues, estados de workflow e comentários do Linear através de GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Ler/escrever Google Sheets via OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Listar, transferir, atualizar e eliminar ficheiros do Google Drive via OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Executar consultas SQL e inserir linhas no BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Consultar e alterar tabelas do Supabase através do PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Executar operações SQL, CRUD e de contagem no ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Gerir bases de dados, fontes de dados, páginas e blocos do Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Gerir organizações, projetos, equipas, issues, eventos e releases do Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Gerir buckets e pastas; listar, carregar, transferir, copiar e eliminar objetos | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Ler/escrever Tabelas de dados do Heym (armazenamento próprio) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Gerir ficheiros do Drive: eliminar, definir palavra-passe, TTL, máximo de transferências, partilha/anulação de partilha com a equipa | 1 | 1 |

## Nós de Automação

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Extrair conteúdo de páginas web com o FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Automação de navegador com passo de IA e Auto Heal | 1 | 1 |

## Nós Utilitários

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Atrasar a execução | 1 | 1 |
| [Output](../nodes/output-node.md) | Endpoint de saída | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mapear campos para um objeto JSON; único terminal = corpo de topo do webhook/execução | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Renderizar uma página HTML; único terminal = o webhook responde com text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Saída terminal de widget de dashboard que mapeia linhas a montante para payloads de gráficos | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Adicionar notas markdown ao canvas (não é executado) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Registar na consola do backend | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Desativar outro nó no workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Ativar um nó desativado no workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Parar o workflow com uma resposta de erro | 1 | 0 |

## Nós de Plugin

Os nós de plugin são fornecidos por plugins instalados na instância. Cada plugin
instalado aparece na paleta em **Plugins** com o seu próprio nome; internamente,
mapeia para um destes dois tipos de nó.

| Nó | Descrição | Entradas | Saídas |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Ação personalizada fornecida por um plugin instalado | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Trigger personalizado fornecido por um plugin instalado | 0 | 1 |

## Relacionado

- [Funcionalidades do Canvas](./canvas-features.md) – Fixação de dados, registos de execução, ativar/desativar, extrair para sub-workflow
- [Nó de Agente](../nodes/agent-node.md) – Referência detalhada para o nó de Agente de IA
- [Arquitetura de Agentes](./agent-architecture.md) – Sub-agentes, orquestrador, competências, MCP, chamada de ferramentas
- [Memória Persistente de Agentes](./agent-persistent-memory.md) – Grafo de conhecimento por nó, partilha e extração em segundo plano
- [Human-in-the-Loop](./human-in-the-loop.md) – Pausar a saída do agente para aprovação humana
- [Expression DSL](./expression-dsl.md) – Referenciar dados na configuração de nós
- [Diálogo de Avaliação de Expressões](./expression-evaluation-dialog.md) – Editor expansível com pré-visualização em tempo real do backend
- [Trigger de Carregamento de Ficheiros](../nodes/file-upload-trigger-node.md) – Aceitar carregamentos multipart de grande dimensão através de ligações de uso único
- [Trigger WebSocket](../nodes/websocket-trigger-node.md) – Trigger de socket de saída em tempo real
- [Envio por WebSocket](../nodes/websocket-send-node.md) – Enviar mensagens para sockets externos
- [Estrutura de Workflow](./workflow-structure.md) – Formato JSON para nós e arestas
- [Triggers](./triggers.md) – Todos os pontos de entrada de workflows
- [Separador Credenciais](../tabs/credentials-tab.md) – Adicionar chaves de API para LLM, HTTP e outros nós
- [Partilha de Credenciais](./credentials-sharing.md) – Partilhar credenciais com outros utilizadores
- [Portal](./portal.md) – Expor workflows como interfaces de chat públicas
- [Separador Armazenamentos Vetoriais](../tabs/vectorstores-tab.md) – Criar armazenamentos vetoriais para nós RAG
