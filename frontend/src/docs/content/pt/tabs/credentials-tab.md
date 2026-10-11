# Separador Credenciais

O separador **Credenciais** gere as chaves de API e os segredos utilizados pelos nós. Adicione credenciais aqui e faça referência a elas por nome nos nós do workflow. Para uma visão geral do que são credenciais e de como os nós as utilizam, consulte [Credenciais](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Ver demonstração de Credenciais</a></p>

## Tipos de Credenciais

| Tipo | Caso de Utilização |
|------|----------|
| **OpenAI** | Chave de API da OpenAI para nós LLM, Agent e RAG |
| **Google** | Chave de API do Google AI (Gemini) |
| **GitHub** | Token de acesso pessoal (PAT) do GitHub para a API do GitHub, workflows com o nó GitHub, servidores MCP e workflows de agentes; `base_url` opcional para GitHub Enterprise |
| **Linear** | Chave de API pessoal do Linear ou OAuth2 para equipas, projetos, issues e comentários |
| **Notion** | Token de integração interna ou autorização de workspace via OAuth de integração pública |
| **Custom** | Endpoints LLM personalizados |
| **Bearer** | Token Bearer para autenticação HTTP |
| **Header** | Par chave-valor de cabeçalho personalizado para pedidos HTTP |
| **Telegram** | Token de bot do Telegram e segredo de webhook opcional |
| **Slack** | URL de webhook de entrada do Slack |
| **Discord** | URL de webhook de entrada do Discord |
| **Discord Trigger** | Chave pública da aplicação Discord |
| **IMAP** | Credenciais do trigger de caixa de correio de entrada |
| **SMTP** | Credenciais de envio de email |
| **Redis** | Ligação ao Redis |
| **RAG: Qdrant + OpenAI** | Armazenamento vetorial para nós RAG, suportado por um servidor Qdrant externo |
| **RAG: Psql + OpenAI** | Armazenamento vetorial para nós RAG, suportado pela base de dados Postgres do próprio Heym (pgvector) — sem serviço externo |
| **RAG: Custom Embeddings** | Armazenamento vetorial para nós RAG utilizando qualquer endpoint de embeddings compatível com OpenAI, com Qdrant ou Postgres (pgvector) como armazenamento |
| **Cohere** | API Cohere para embeddings |

## Adicionar Credenciais

1. Clique em **Adicionar Credencial**
2. Escolha o tipo de credencial
3. Introduza os valores necessários (chave de API, URL, etc.)
4. Atribua-lhe um nome para referência nos nós

Para o GitHub, o fluxo de credenciais atual baseia-se em PAT. Recomendam-se PATs de granularidade fina. Os fluxos de instalação da GitHub App não são de primeira classe na interface atualmente. Se utilizar o GitHub Enterprise Server, pode também definir um URL base opcional da API do GitHub, como `https://github.example.com/api/v3`.

Para o Linear, escolha **Chave de API pessoal** ou **OAuth2** na caixa de diálogo. As chaves de API pessoais são criadas
em **Settings → Security & Access → Personal API keys** no Linear. O OAuth2 utiliza um Client ID e um Client Secret de uma aplicação OAuth
do Linear, com `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
registado como URI de redirecionamento. A credencial atua com as permissões do utilizador Linear que
a criou ou autorizou. Utilize **Testar Ligação** na caixa de diálogo da credencial para verificar a chave de API ou
o token OAuth antes de guardar.

Para o **Notion**, escolha **Token interno** ou **OAuth** na caixa de diálogo. O OAuth utiliza o Client ID e o
Client Secret da sua integração pública do Notion; o Heym armazena-os encriptados na credencial.
Utilize **Testar Ligação** para verificar credenciais do Supabase, Linear ou Notion antes de guardar um workflow. Consulte
[Integrações de Terceiros](../reference/integrations.md#notion) para detalhes de configuração do Notion.

As credenciais OAuth abrem a página de autorização do fornecedor numa janela popup. Se o navegador a bloquear, utilize a ligação **Abrir a página de autorização** por baixo do botão Ligar; a caixa de diálogo deteta quando a ligação é concluída. Assim que uma nova credencial estiver ligada, o botão apresenta **Ligado**.

## Editar e Eliminar

- **Editar** – Atualizar os valores da credencial (os valores sensíveis são mascarados)
- **Eliminar** – Remover uma credencial; os workflows que a utilizam necessitarão de uma substituição

Ao editar uma credencial **GitHub** no GitHub Enterprise Server, deixar o campo opcional **GitHub
API Base URL** vazio preserva o endpoint Enterprise existente. Introduza um novo URL apenas quando
pretender alterar esse endpoint.

## Partilha

- [Partilhar credenciais](../reference/credentials-sharing.md) com outros utilizadores por email ou com [Equipas](../reference/teams.md)
- As credenciais partilhadas aparecem com um indicador
- Revogar a partilha a partir do menu do cartão da credencial

## Utilização em Nós

Referencie as credenciais por nome na configuração do nó. Por exemplo:
- [Nó LLM](../nodes/llm-node.md) – Selecione a credencial para a API do modelo
- [Nó HTTP](../nodes/http-node.md) – Utilize credenciais Bearer ou Header para autenticação
- [Nó de agente](../nodes/agent-node.md) – Passe tokens do GitHub para variáveis de ambiente do servidor MCP, como `GITHUB_PERSONAL_ACCESS_TOKEN`
- [Nó GitHub](../nodes/github-node.md) – Execute operações nativas do GitHub em repositórios, utilizadores, issues, revisões, releases, workflows, tráfego e ficheiros
- [Nó Linear](../nodes/linear-node.md) – Leia metadados do workspace e automatize issues e comentários do Linear
- [Nó Notion](../nodes/notion-node.md) – Faça a gestão de bases de dados, fontes de dados, páginas e blocos do Notion
- [Nó RAG](../nodes/rag-node.md) – Utilize uma credencial Qdrant ou Postgres (pgvector) para o armazenamento vetorial
- [Nó Telegram Trigger](../nodes/telegram-trigger-node.md) – Receba webhooks do bot do Telegram
- [Nó Telegram](../nodes/telegram-node.md) – Envie mensagens do bot do Telegram
- [Nó Discord Trigger](../nodes/discord-trigger-node.md) – Receba webhooks de interação do Discord
- [Nó Discord](../nodes/discord-node.md) – Envie mensagens de webhook do Discord
- [Nó IMAP Trigger](../nodes/imap-trigger-node.md) – Faça polling a uma caixa de correio partilhada para novos emails

Consulte [Expression DSL](../reference/expression-dsl.md) para referenciar valores suportados por credenciais em expressões.

## Relacionado

- [Integrações de Terceiros](../reference/integrations.md) – Guia de configuração detalhado para cada tipo de credencial (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack e mais)
- [Partilha de Credenciais](../reference/credentials-sharing.md) – Partilhe credenciais com outros utilizadores
- [Segurança](../reference/security.md) – Encriptação em repouso, gestão de sessões, limitação de taxa
- [Tipos de Nós](../reference/node-types.md) – Nós que utilizam credenciais ([LLM](../nodes/llm-node.md), [Agente](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Enviar Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Separador Armazenamentos Vetoriais](./vectorstores-tab.md) – Utiliza credenciais Qdrant ou Postgres (pgvector)
- [Separador Chat](./chat-tab.md) – Utiliza credenciais OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para as superfícies do dashboard
