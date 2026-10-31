# Credenciais

As credenciais armazenam chaves de API e segredos utilizados pelos nós de workflow. Estas são adicionadas no [Separador Credenciais](../tabs/credentials-tab.md) e referenciadas por nome na configuração dos nós.

## O que são Credenciais

- **Armazenadas por utilizador** – Cada credencial pertence a um utilizador e pode ser [partilhada](./credentials-sharing.md) com outros utilizadores ou [Equipas](./teams.md).
- **Encriptadas em repouso** – Os valores sensíveis são encriptados; a interface mascara-os após a criação.
- **Referenciadas por nome** – Os nós selecionam uma credencial por nome (ou ID). O motor de execução resolve a credencial para o proprietário do workflow em tempo de execução.

## Como os Nós as Utilizam

| Tipo de nó | Credencial típica | Finalidade |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agente](../nodes/agent-node.md), [Avaliações](../tabs/evals-tab.md) | OpenAI, Google, Personalizada | Chave de API para o modelo |
| [Decisão](../nodes/decision-node.md), juiz de [Avaliações](../tabs/evals-tab.md) | Modelo de Decisão | URL base de um endpoint de modelo de decisão, mais uma chave de API opcional |
| [LLM](../nodes/llm-node.md), [Agente](../nodes/agent-node.md), Chat, Predefinições de IA, [Avaliações](../tabs/evals-tab.md) suites de prompts | Router de Modelos (Modelo Automático) | Seleciona qual dos seus modelos serve cada pedido, utilizando um modelo de decisão |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Início de sessão com subscrição ChatGPT (OAuth) ou um token de acesso Codex para o runner, mais um PAT do GitHub para operações de repositório |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | Uma chave de API do gateway OpenCode Go (URL base opcional) para o runner, mais um PAT do GitHub para operações de repositório |
| [Agente](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | Token de acesso pessoal (PAT) do GitHub para chamadas à API do GitHub, operações do nó GitHub e integrações MCP |
| [Jira](../nodes/jira-node.md) | Jira | Email/token de API da Cloud, nome de utilizador/palavra-passe do Data Center ou token de acesso pessoal, URL base do site Jira, modo de implementação e versão opcional da API REST |
| [Linear](../nodes/linear-node.md) | Linear | Chave de API pessoal ou OAuth2 para equipas, projetos, issues e comentários |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autenticação para pedidos |
| [Telegram](../nodes/telegram-node.md), [Trigger Telegram](../nodes/telegram-trigger-node.md) | Telegram | Token do bot e segredo de webhook opcional |
| [Discord](../nodes/discord-node.md) | Discord | URL de webhook de entrada |
| [Trigger Discord](../nodes/discord-trigger-node.md) | Trigger Discord (Chave Pública) | Chave pública da aplicação para verificação de assinatura |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Embeddings Personalizados | Ligação ao armazenamento vetorial (Qdrant externo, ou o próprio Postgres do Heym via pgvector), com OpenAI ou qualquer endpoint de embeddings compatível com OpenAI |
| [Slack](../nodes/slack-node.md) | Slack | Webhook ou token de API |
| [Trigger IMAP](../nodes/imap-trigger-node.md) | IMAP | Ligação à caixa de correio de entrada |
| [Enviar Email](../nodes/send-email-node.md) | SMTP | Servidor de correio |
| [Redis](../nodes/redis-node.md) | Redis | Ligação |
| [Grist](../nodes/grist-node.md) | Grist | Chave de API + URL do servidor |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + consentimento OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + consentimento OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + consentimento OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL do projeto + chave de API (+ esquema predefinido opcional) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + porta + nome de utilizador/palavra-passe + base de dados (+ seguro) |
| [Notion](../nodes/notion-node.md) | Notion | Token de integração interna, ou Client ID + Client Secret + consentimento OAuth de integração pública |
| [Sentry](../nodes/sentry-node.md) | Sentry | Token de autenticação mais URL base auto-alojado opcional |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Chave de acesso, chave secreta, região |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | URL AMQP |

Para configuração detalhada (hosts, portas, campos específicos do fornecedor), consulte [Integrações de Terceiros](./integrations.md). Isto inclui a configuração do bot Telegram, correio de entrada via IMAP e correio de saída via SMTP.

As credenciais GitHub podem também incluir um `base_url` opcional quando está a direcionar para o GitHub
Enterprise Server em vez de GitHub.com. Ao editar uma credencial GitHub para rodar o token,
deixar `base_url` vazio preserva o endpoint Enterprise existente. Introduza um novo URL apenas quando
pretender alterar esse endpoint.

As credenciais Jira, Linear, Supabase, Notion, Sentry e ClickHouse expõem **Testar Ligação** no diálogo de credenciais. Para Jira, a verificação chama o endpoint do utilizador atual do Jira. Para Linear,
a verificação chama a API Linear com `getViewer` e confirma que a chave de API ou token OAuth é válido.
Ao editar, pode testar sem reintroduzir a chave de API se o segredo armazenado ainda estiver presente. Para Notion,
escolha **Token interno** ou **OAuth** no diálogo; OAuth utiliza o Client ID e Client Secret
da sua integração pública Notion. Consulte [Integrações de Terceiros](./integrations.md#notion) para
detalhes de configuração do Notion.

## Utilização do pacote de programação

O separador **AI Defaults** em [Definições](./user-settings.md) mostra a utilização restante do pacote de programação para as suas credenciais Codex (próprias e partilhadas). Para cada credencial Codex, é apresentada uma barra horizontal por cada janela de limite de taxa ativa — tipicamente uma janela de **5 horas** e/ou **Semanal**, dependendo do seu plano — com a percentagem de quota restante e uma contagem decrescente para a reposição. Os dados provêm dos cabeçalhos de resposta de limite de taxa do backend do Codex, obtidos a pedido.

As credenciais OpenCode Go também são listadas aí, mas marcadas como **"utilização indisponível"**: o gateway OpenCode zen não expõe dados de quota restante, pelo que não é possível apresentar qualquer barra.

## Em Expressões

Alguns nós permitem expressões para autenticação. Utilize a [Expression DSL](./expression-dsl.md) com `$credentials.CredentialName` para referenciar o segredo resolvido de uma credencial dentro de uma expressão. Para a linha de cabeçalho necessária em cada tipo de credencial num pedido HTTP, consulte [HTTP › Autenticação com Credenciais](../nodes/http-node.md#authenticating-with-credentials).

As credenciais Codex são intencionalmente excluídas de `$credentials`. Quer inicie sessão com o ChatGPT (subscrição, sem custo de API por token) quer cole um `access_token` do Codex, os tokens são apenas transmitidos ao processo local do runner do Codex. Os tokens de início de sessão do ChatGPT são renovados automaticamente à medida que expiram.

As credenciais Jira também são excluídas de `$credentials`. O [Nó Jira](../nodes/jira-node.md) carrega a credencial por `credentialId` em tempo de execução. Para chamadas REST personalizadas ao Jira não abrangidas pelo Nó Jira, utilize o [Nó HTTP](../nodes/http-node.md) com Jira Basic Auth (`email:api_token` para Jira Cloud ou `username:password` para Data Center / Server), por exemplo `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Também pode utilizar uma credencial [Header](../nodes/http-node.md) com `Authorization: Basic <base64(user:secret)>`. Para tokens de acesso pessoal do Jira Data Center / Server, envie `Authorization: Bearer <token>`; a própria credencial Jira suporta esta opção através do seu modo de autenticação **Personal Access Token**.

| Tipo de credencial | Valor exposto a `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Cadeia de token Bearer |
| Header | Linha completa `header key: header value`, pronta a inserir num argumento `-H` do cURL |
| GitHub | Token de acesso pessoal |
| Notion | `api_token` interno ou `access_token` OAuth (token Bearer para chamadas à API do Notion) |
| Sentry | Token de autenticação do Sentry |
| Discord / Slack | URL do Webhook |

Exemplo:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Utilize o **nó** Notion para operações nativas de base de dados, página e bloco. Utilize `$credentials` quando um pedido [HTTP](../nodes/http-node.md) personalizado necessitar do mesmo token Bearer do Notion.

## Criar Credenciais a partir do Chat

O [AI Assistant](./ai-assistant.md#credentials), o [separador Chat](../tabs/chat-tab.md) e o [Chat com o Heym](./chat-with-heym.md) podem criar uma credencial quando um workflow necessita de uma, ou sempre que a solicitar. O assistente sugere o tipo e um nome, e o formulário habitual de credenciais abre na conversa. Peça para atualizar uma credencial que possui e o mesmo formulário abre sobre ela, com os seus segredos ocultados. O assistente apenas vê o nome e o tipo. O `heym_chat` através de [MCP](../tabs/mcp-tab.md) não pode criar, atualizar ou escolher credenciais.

## Relacionado

- [Separador Credenciais](../tabs/credentials-tab.md) – Adicionar, editar, eliminar credenciais
- [Nó GitHub](../nodes/github-node.md) – Operações REST nativas do GitHub
- [Nó Jira](../nodes/jira-node.md) – Automação de projetos, issues, comentários, anexos, utilizadores, notificações e transições do Jira
- [Nó Linear](../nodes/linear-node.md) – Automação de workspace e issues do Linear GraphQL
- [Nó Notion](../nodes/notion-node.md) – Pesquisar e gerir conteúdo do Notion
- [Nó Sentry](../nodes/sentry-node.md) – Automação de organizações, projetos, equipas, issues, eventos e releases do Sentry
- [Partilha de Credenciais](./credentials-sharing.md) – Partilhar com utilizadores e equipas
- [Integrações de Terceiros](./integrations.md) – Guia de configuração por tipo de credencial
- [Expression DSL](./expression-dsl.md) – `$credentials` em expressões

## Model Router (Auto Model)

Um Model Router não contém qualquer chave. Contém uma **credencial de modelo de decisão**, uma lista de **opções de modelo** — cada uma uma credencial OpenAI, Google ou Custom existente mais um modelo — e, para cada opção, texto livre a indicar quando essa opção deve ser utilizada.

Aparece em todos os seletores que oferecem um modelo: os nós [LLM](../nodes/llm-node.md) e [Agent](../nodes/agent-node.md), Chat, AI Defaults, Dashboards, o construtor de expressões e as Tabelas de dados. O seu único modelo é **Auto**. Selecione-o, e o modelo de decisão lê cada pedido e encaminha-o. As [Evals](../tabs/evals-tab.md) excluem-no, porque uma eval compara modelos específicos e um router escolhe por si próprio.

Um agente reencaminha à medida que o seu ciclo de ferramentas avança, pelo que um modelo económico pode assumir os primeiros turnos e um mais forte o turno que dele necessita. Entradas idênticas reutilizam a decisão anterior, pelo que um ciclo só paga por uma decisão quando a conversa efetivamente avançou.

### O que não pode fazer

O Auto Model não pode ser combinado com a **Responses API**, o **modo Batch** ou a **saída de imagem**. Esses interruptores desativam-se quando um router é selecionado, e cada um indica o motivo. As verificações de guardrail e o classificador de política de revisão humana são chamadas fixas de modelo único e nunca são encaminhadas.

### Quando o encaminhamento falha

Marque uma opção **Utilizar esta opção quando o encaminhamento falha** e uma indisponibilidade do modelo de decisão nunca
interrompe uma execução; a alternativa é utilizada e o motivo é registado na execução. Sem esta opção, o
nó falha em vez de fazer suposições.

### Ver para onde foi um pedido

Os Rastreios mostram `Auto Model / GPT-5` em vez de apenas o modelo, e o custo permanece atribuído
ao modelo que efetivamente foi executado. O Registo de Execução do canvas e a Vista de Spans mostram o mesmo par,
e a Vista de Spans lista qual a interação que foi para onde.
