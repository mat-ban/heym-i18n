# Credentials

As credentials armazenam chaves de API e segredos usados pelos nós de workflow. Você as adiciona na [Aba Credentials](../tabs/credentials-tab.md) e as referencia por nome na configuração do nó.

## O que são Credentials

- **Armazenadas por usuário** – Cada credential pertence a um usuário e pode ser [compartilhada](./credentials-sharing.md) com outros usuários ou [Equipes](./teams.md).
- **Criptografadas em repouso** – Valores sensíveis são criptografados; a interface os mascara após a criação.
- **Referenciadas por nome** – Os nós selecionam uma credential por nome (ou ID). O mecanismo de execução resolve a credential para o proprietário do workflow em tempo de execução.

## Como os Nós as Utilizam

| Tipo de Nó | Credential típica | Finalidade |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | Chave de API para o modelo |
| [Decision](../nodes/decision-node.md), juiz de [Evals](../tabs/evals-tab.md) | Decision Model | URL base de um endpoint de modelo de decisão, além de uma chave de API opcional |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Seleciona qual dos seus modelos atende cada requisição, usando um modelo de decisão |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Login via assinatura do ChatGPT (OAuth) ou um token de acesso do Codex para o runner, além de um PAT do GitHub para operações em repositórios |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | Uma chave de API do gateway OpenCode Go (URL base opcional) para o runner, além de um PAT do GitHub para operações em repositórios |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | Token de acesso pessoal do GitHub (PAT) para chamadas à API do GitHub, operações do Nó GitHub e integrações MCP |
| [Jira](../nodes/jira-node.md) | Jira | E-mail/token de API do Cloud, usuário/senha do Data Center ou personal access token, URL base do site Jira, modo de implantação e versão opcional da REST API |
| [Linear](../nodes/linear-node.md) | Linear | Chave de API pessoal ou OAuth2 para equipes, projetos, issues e comentários |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autenticação para requisições |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Token do bot e segredo opcional do webhook |
| [Discord](../nodes/discord-node.md) | Discord | URL do webhook de entrada |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Chave pública da aplicação para verificação de assinatura |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Conexão com o vector store (Qdrant externo ou o próprio Postgres do Heym via pgvector), com endpoint de embeddings da OpenAI ou de qualquer serviço compatível com OpenAI |
| [Slack](../nodes/slack-node.md) | Slack | Webhook ou token de API |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Conexão com caixa de correio de entrada |
| [Send Email](../nodes/send-email-node.md) | SMTP | Servidor de e-mail |
| [Redis](../nodes/redis-node.md) | Redis | Conexão |
| [Grist](../nodes/grist-node.md) | Grist | Chave de API + URL do servidor |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + consentimento OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + consentimento OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + consentimento OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL do projeto + chave de API (+ schema padrão opcional) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + porta + usuário/senha + banco de dados (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Token de integração interna, ou Client ID + Client Secret + consentimento OAuth de integração pública |
| [Sentry](../nodes/sentry-node.md) | Sentry | Token de autenticação e URL base opcional para instância auto-hospedada |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, região |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | URL do AMQP |

Para configuração detalhada (hosts, portas, campos específicos de cada provedor), consulte [Integrações de Terceiros](./integrations.md). Isso inclui a configuração do bot do Telegram, e-mail de entrada via IMAP e e-mail de saída via SMTP.

As credentials do GitHub também podem incluir um `base_url` opcional quando você está direcionando para o GitHub
Enterprise Server em vez do GitHub.com. Ao editar uma credential do GitHub para rotacionar o token,
deixar `base_url` vazio preserva o endpoint Enterprise existente. Informe uma nova URL apenas quando
você quiser alterar esse endpoint.

As credentials de Jira, Linear, Supabase, Notion, Sentry e ClickHouse expõem **Test Connection** no diálogo de credential. Para o Jira, a verificação chama o endpoint de usuário atual do Jira. Para o Linear,
a verificação chama a API do Linear com `getViewer` e confirma que a chave de API ou o token OAuth é válido.
Ao editar, você pode testar sem reinserir a chave de API se o segredo armazenado ainda estiver presente. Para o Notion,
escolha **Internal token** ou **OAuth** no diálogo; o OAuth usa o Client ID e o Client Secret
da sua integração pública do Notion. Consulte [Integrações de Terceiros](./integrations.md#notion) para
detalhes da configuração do Notion.
## Uso do pacote de codificação

A aba **AI Defaults** em [Configurações](./user-settings.md) mostra o uso restante do pacote de codificação para suas credenciais do Codex (próprias e compartilhadas). Para cada credencial do Codex, ela exibe uma barra horizontal por janela ativa de limite de taxa — tipicamente uma janela de **5 horas** e/ou **Semanal**, dependendo do seu plano — com a porcentagem de cota restante e uma contagem regressiva para o reset. Os dados vêm dos cabeçalhos de resposta de limite de taxa do backend do Codex, obtidos sob demanda.

Credenciais do OpenCode Go também são listadas ali, mas marcadas como **"uso indisponível"**: o gateway OpenCode zen não expõe dados de cota restante, portanto nenhuma barra pode ser exibida.

## Em Expressões

Alguns nós permitem expressões para autenticação. Use a [Expression DSL](./expression-dsl.md) com `$credentials.CredentialName` para referenciar o segredo resolvido de uma credencial dentro de uma expressão. Para a linha de cabeçalho que cada tipo de credencial precisa em uma requisição HTTP, consulte [HTTP › Autenticando com Credenciais](../nodes/http-node.md#authenticating-with-credentials).

Credenciais do Codex são intencionalmente excluídas de `$credentials`. Seja ao fazer login com ChatGPT (assinatura, sem custo de API por token) ou ao colar um `access_token` do Codex, os tokens são passados apenas para o processo local do runner do Codex. Tokens de login do ChatGPT são renovados automaticamente conforme expiram.

Credenciais do Jira também são excluídas de `$credentials`. O [Nó Jira](../nodes/jira-node.md) carrega a credencial por `credentialId` em tempo de execução. Para chamadas REST personalizadas do Jira não cobertas pelo Nó Jira, use o [Nó HTTP](../nodes/http-node.md) com Jira Basic Auth (`email:api_token` para Jira Cloud ou `username:password` para Data Center / Server), por exemplo `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Você também pode usar uma credencial [Header](../nodes/http-node.md) com `Authorization: Basic <base64(user:secret)>`. Para personal access tokens do Jira Data Center / Server, envie `Authorization: Bearer <token>`; a própria credencial do Jira suporta isso por meio de seu modo de autenticação **Personal Access Token**.

| Tipo de credencial | Valor exposto a `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | String do token Bearer |
| Header | Linha completa `header key: header value`, pronta para inserir em um argumento `-H` do cURL |
| GitHub | Token de acesso pessoal |
| Notion | `api_token` interno ou `access_token` OAuth (token Bearer para chamadas à API do Notion) |
| Sentry | Token de autenticação do Sentry |
| Discord / Slack | URL do Webhook |

Exemplo:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Use o **nó** Notion para operações nativas de banco de dados, página e bloco. Use `$credentials` quando uma requisição [HTTP](../nodes/http-node.md) personalizada precisar do mesmo token Bearer do Notion.

## Criando Credenciais pelo Chat

O [Assistente de IA](./ai-assistant.md#credentials), a [aba Chat](../tabs/chat-tab.md) e o [Chat com Heym](./chat-with-heym.md) podem criar uma credencial quando um workflow precisar de uma, ou sempre que você solicitar. O assistente sugere o tipo e um nome, e o formulário regular de credencial abre na conversa. Peça para atualizar uma credencial que você possui e o mesmo formulário abre sobre ela, com seus segredos mascarados. O assistente vê apenas o nome e o tipo. O `heym_chat` via [MCP](../tabs/mcp-tab.md) não pode criar, atualizar ou escolher credenciais.

## Relacionados

- [Aba Credentials](../tabs/credentials-tab.md) – Adicionar, editar, excluir credenciais
- [Nó GitHub](../nodes/github-node.md) – Operações REST nativas do GitHub
- [Nó Jira](../nodes/jira-node.md) – Automação de projetos, issues, comentários, anexos, usuários, notificações e transições do Jira
- [Nó Linear](../nodes/linear-node.md) – Automação de workspace e issues do Linear via GraphQL
- [Nó Notion](../nodes/notion-node.md) – Pesquisar e gerenciar conteúdo do Notion
- [Nó Sentry](../nodes/sentry-node.md) – Automação de organizações, projetos, equipes, issues, eventos e releases do Sentry
- [Compartilhamento de Credenciais](./credentials-sharing.md) – Compartilhar com usuários e equipes
- [Integrações de Terceiros](./integrations.md) – Guia de configuração por tipo de credencial
- [Expression DSL](./expression-dsl.md) – `$credentials` em expressões

## Model Router (Auto Model)

Um Model Router não contém nenhuma chave. Ele contém uma **credencial de modelo de decisão**, uma lista de **opções de modelo** — cada uma sendo uma credencial existente do OpenAI, Google ou Custom mais um modelo — e, para cada opção, texto livre indicando quando aquela opção deve ser usada.

Ele aparece em todos os seletores que oferecem um modelo: os nós [LLM](../nodes/llm-node.md) e [Agent](../nodes/agent-node.md), Chat, AI Defaults, Dashboards, o construtor de expressões e Data Tables. Seu único modelo é **Auto**. Selecione-o, e o modelo de decisão lê cada requisição e a roteia. [Evals](../tabs/evals-tab.md) o deixa de fora, porque um eval compara modelos específicos e um router escolhe o seu próprio.

Um agente redireciona conforme seu loop de ferramentas avança, de modo que um modelo barato pode assumir os turnos iniciais e um mais forte o turno que precisar dele. Entradas idênticas reutilizam a decisão anterior, então um loop só paga por uma decisão quando a conversa realmente avançou.

### O que ele não pode fazer

O Auto Model não pode ser combinado com a **Responses API**, o **modo Batch** ou a **saída de imagem**. Esses toggles se desativam quando um router é selecionado, e cada um explica o motivo. Verificações de guardrail e o classificador de política de revisão humana são chamadas fixas de modelo único e nunca são roteados.
### Quando o roteamento falha

Marque uma opção **Use this option when routing fails** e uma indisponibilidade do modelo de decisão nunca
interrompe uma execução; o fallback é usado e o motivo é registrado na execução. Sem isso, o
Nó falha em vez de adivinhar.

### Vendo para onde uma requisição foi

Os Traces mostram `Auto Model / GPT-5` em vez de apenas o modelo, e o custo permanece atribuído
ao modelo que realmente foi executado. O Execution Log e o Span View do canvas mostram o mesmo par,
e o Span View lista qual turno foi para onde.
