# Aba Credentials

A aba **Credentials** gerencia chaves de API e segredos usados pelos nós. Adicione credenciais aqui e faça referência a elas por nome nos nós do workflow. Para uma visão geral do que são credenciais e como os nós as utilizam, consulte [Credentials](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Assistir à demonstração de Credentials</a></p>

## Tipos de Credencial

| Tipo | Caso de Uso |
|------|----------|
| **OpenAI** | Chave de API da OpenAI para nós LLM, Agent e RAG |
| **Google** | Chave de API do Google AI (Gemini) |
| **GitHub** | Token de acesso pessoal (PAT) do GitHub para API do GitHub, workflows com o nó GitHub, servidores MCP e workflows de agentes; `base_url` opcional do GitHub Enterprise |
| **Linear** | Chave de API pessoal do Linear ou OAuth2 para times, projetos, issues e comentários |
| **Notion** | Token de integração interna ou autorização de workspace via OAuth de integração pública |
| **Custom** | Endpoints de LLM personalizados |
| **Bearer** | Token Bearer para autenticação HTTP |
| **Header** | Par chave-valor de header personalizado para requisições HTTP |
| **Telegram** | Token do bot do Telegram e segredo de webhook opcional |
| **Slack** | URL de webhook de entrada do Slack |
| **Discord** | URL de webhook de entrada do Discord |
| **Discord Trigger** | Chave pública da aplicação Discord |
| **IMAP** | Credenciais do trigger de caixa de entrada |
| **SMTP** | Credenciais para envio de e-mail |
| **Redis** | Conexão Redis |
| **RAG: Qdrant + OpenAI** | Vector store para nós RAG, com suporte de um servidor Qdrant externo |
| **RAG: Psql + OpenAI** | Vector store para nós RAG, com suporte do próprio banco de dados Postgres do Heym (pgvector) — sem serviço externo |
| **RAG: Custom Embeddings** | Vector store para nós RAG usando qualquer endpoint de embeddings compatível com OpenAI, com Qdrant ou Postgres (pgvector) como store |
| **Cohere** | API da Cohere para embeddings |

## Adicionando Credenciais

1. Clique em **Add Credential**
2. Escolha o tipo de credencial
3. Insira os valores necessários (chave de API, URL, etc.)
4. Dê um nome a ela para referência nos nós

Para o GitHub, o fluxo atual de credencial é baseado em PAT. Recomenda-se o uso de PATs de escopo refinado (fine-grained). Fluxos de instalação do GitHub App ainda não são de primeira classe na interface hoje. Se você usa o GitHub Enterprise Server, também pode definir uma URL base opcional da API do GitHub, como `https://github.example.com/api/v3`.

Para o Linear, escolha **Personal API key** ou **OAuth2** no diálogo. As chaves de API pessoais são criadas
em **Settings → Security & Access → Personal API keys** no Linear. O OAuth2 usa um Client ID e um Client Secret
de uma aplicação OAuth do Linear, com `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
registrado como URI de redirecionamento. A credencial atua com as permissões do usuário do Linear que
a criou ou autorizou. Use **Test Connection** no diálogo da credencial para verificar a chave de API ou o
token OAuth antes de salvar.

Para o **Notion**, escolha **Internal token** ou **OAuth** no diálogo. O OAuth usa o Client ID e o
Client Secret da sua integração pública do Notion; o Heym os armazena criptografados na credencial.
Use **Test Connection** para verificar credenciais do Supabase, Linear ou Notion antes de salvar um workflow. Consulte
[Third-Party Integrations](../reference/integrations.md#notion) para detalhes de configuração do Notion.

Credenciais OAuth abrem a página de autorização do provedor em um popup. Se o navegador bloqueá-la, use o link **Open the authorization page** abaixo do botão Connect; o diálogo detecta quando a conexão é concluída. Assim que uma nova credencial estiver conectada, o botão exibirá **Connected**.

## Editando e Excluindo

- **Edit** – Atualize os valores da credencial (valores sensíveis são mascarados)
- **Delete** – Remova uma credencial; workflows que a utilizam precisarão de uma substituta

Ao editar uma credencial do **GitHub** no GitHub Enterprise Server, deixar o campo opcional **GitHub
API Base URL** vazio preserva o endpoint Enterprise existente. Insira uma nova URL apenas quando
quiser alterar esse endpoint.

## Compartilhamento

- [Compartilhe credenciais](../reference/credentials-sharing.md) com outros usuários por e-mail ou com [Teams](../reference/teams.md)
- Credenciais compartilhadas aparecem com um indicador
- Revogue o compartilhamento pelo menu do cartão da credencial
## Uso em Nós

Referencie credenciais por nome na configuração do nó. Por exemplo:
- [Nó LLM](../nodes/llm-node.md) – Selecione a credencial para a API do modelo
- [Nó HTTP](../nodes/http-node.md) – Use credenciais Bearer ou Header para autenticação
- [Nó Agente](../nodes/agent-node.md) – Passe tokens do GitHub para variáveis de ambiente do servidor MCP, como `GITHUB_PERSONAL_ACCESS_TOKEN`
- [Nó GitHub](../nodes/github-node.md) – Execute operações nativas de repositório, usuário, issue, review, release, workflow, tráfego e arquivo do GitHub
- [Nó Linear](../nodes/linear-node.md) – Leia metadados do workspace e automatize issues e comentários do Linear
- [Nó Notion](../nodes/notion-node.md) – Gerencie bancos de dados, fontes de dados, páginas e blocos do Notion
- [Nó RAG](../nodes/rag-node.md) – Use uma credencial Qdrant ou Postgres (pgvector) para o vector store
- [Nó Telegram Trigger](../nodes/telegram-trigger-node.md) – Receba webhooks de bot do Telegram
- [Nó Telegram](../nodes/telegram-node.md) – Envie mensagens de bot do Telegram
- [Nó Discord Trigger](../nodes/discord-trigger-node.md) – Receba webhooks de interação do Discord
- [Nó Discord](../nodes/discord-node.md) – Envie mensagens de webhook do Discord
- [Nó IMAP Trigger](../nodes/imap-trigger-node.md) – Faça polling de uma caixa de entrada compartilhada em busca de novos e-mails

Consulte [Expression DSL](../reference/expression-dsl.md) para referenciar valores respaldados por credenciais em expressões.

## Relacionados

- [Integrações de Terceiros](../reference/integrations.md) – Guia detalhado de configuração para cada tipo de credencial (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack e mais)
- [Compartilhamento de Credenciais](../reference/credentials-sharing.md) – Compartilhe credenciais com outros usuários
- [Segurança](../reference/security.md) – Criptografia em repouso, gerenciamento de sessão, rate limiting
- [Tipos de Nó](../reference/node-types.md) – Nós que usam credenciais ([LLM](../nodes/llm-node.md), [Agente](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Aba Vectorstores](./vectorstores-tab.md) – Usa credenciais Qdrant ou Postgres (pgvector)
- [Aba Chat](./chat-tab.md) – Usa credenciais OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para superfícies do dashboard
