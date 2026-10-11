# Integrações de Terceiros

O Heym se conecta a serviços externos por meio de **credentials**. Cada tipo de credential armazena os detalhes de conexão de um serviço e pode ser reutilizado em vários nós e workflows. Consulte [Credentials](./credentials.md) para obter uma visão geral.

Adicione credentials em [Configurações → Credentials](../tabs/credentials-tab.md). Todos os valores são criptografados em repouso. As credentials podem ser [compartilhadas](./credentials-sharing.md) com outros usuários ou [Teams](./teams.md).

Alguns nós de integração **não** exigem credentials. O [WebSocket Trigger](../nodes/websocket-trigger-node.md) e o [WebSocket Send](../nodes/websocket-send-node.md) se conectam a sockets externos usando a URL, os headers e os subprotocolos configurados diretamente no nó.

## Tipos de Credential em Resumo

| Tipo | Usado Por | Campos Principais |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, `base_url` opcional |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, `base_url` opcional |
| **Jira** | [Nó Jira](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, `api_version` opcional |
| **Linear** | [Nó Linear](../nodes/linear-node.md) | `api_key`, ou `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Nó Sentry](../nodes/sentry-node.md) | `api_token`, `base_url` opcional |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) (juiz LLM-as-Judge) | `base_url`, `api_key` opcional |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | uma credential de decision model, além de opções de modelo que fazem referência às suas outras credentials |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (vetores armazenados no próprio Postgres do Heym via pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, `embedding_api_key` opcional, além de `qdrant_host` quando `db_type` for `qdrant` |
| **Grist** | [Nó Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Nó Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + consentimento OAuth2 |
| **Google Drive** | [Nó Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + consentimento OAuth2 (escopo completo do Drive) |
| **BigQuery** | [Nó BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + consentimento OAuth2 |
| **Supabase** | [Nó Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, `supabase_schema` opcional |
| **ClickHouse** | [Nó ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Nó Notion](../nodes/notion-node.md) | `api_token`, ou `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Nó Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Nó IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Nó Telegram Trigger](../nodes/telegram-trigger-node.md), [Nó Telegram](../nodes/telegram-node.md) | `bot_token`, `secret_token` opcional |
| **Discord** | [Nó Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Nó Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Nó RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Nó Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Nó Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Nó Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Nó HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Nó HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Nó Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

A credential do GitHub armazena um token de acesso pessoal (PAT) do GitHub para que os workflows possam chamar a API REST do GitHub por meio do [nó GitHub](../nodes/github-node.md), passar o token para servidores MCP como `@modelcontextprotocol/server-github` ou usá-lo a partir do [nó HTTP](../nodes/http-node.md) para chamadas REST personalizadas.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `api_key` | Token de acesso pessoal do GitHub (PAT refinado `github_pat_...` ou PAT clássico `ghp_...`) |
### Campos Opcionais

| Campo | Descrição |
|-------|-----------|
| `base_url` | URL base da API do GitHub para o GitHub Enterprise Server (por exemplo, `https://github.example.com/api/v3`) |

### Observações

- Recomenda-se o uso de personal access tokens refinados (fine-grained) sempre que possível, pois é possível restringi-los a repositórios e permissões específicos.
- Deixe `base_url` vazio para o GitHub.com. Para o GitHub Enterprise Server, utilize o endpoint
  completo da REST API, incluindo `/api/v3` (por exemplo, `https://github.example.com/api/v3`), e não a
  raiz da interface web do servidor, como `https://github.example.com`.
- Atualmente, esta credencial modela apenas autenticação baseada em PAT. Para acessar repositórios de uma organização, utilize um PAT que tenha recebido as permissões necessárias de organização/repositório.
- Tokens de instalação do GitHub App e fluxos de configuração do GitHub App ainda não são suportados nativamente na interface do Heym.
- Prefira o [nó GitHub](../nodes/github-node.md) para operações nativas de repositório, usuário, issue, pull request, review, release, workflow do Actions, tráfego e arquivos. Utilize o [nó HTTP](../nodes/http-node.md) apenas quando precisar de endpoints ou payloads que o nó GitHub não cobre.
- Utilize o [nó Agent](../nodes/agent-node.md) com MCP passando `$credentials.YourGitHubCredential` para uma variável de ambiente de conexão MCP, como `GITHUB_PERSONAL_ACCESS_TOKEN`.
- A REST API do GitHub geralmente espera `Authorization: Bearer <token>` além de `Accept: application/vnd.github+json`.
- Ao editar uma credencial do GitHub, deixar o `base_url` do GitHub Enterprise vazio preserva o
  endpoint existente. Informe uma nova URL apenas quando desejar alterar esse endpoint.

### Utilizada Por

- [nó GitHub](../nodes/github-node.md)
- [nó Codex](../nodes/codex-node.md)
- [nó Agent](../nodes/agent-node.md)
- [nó HTTP](../nodes/http-node.md)

---

## Modelo de Decisão

Um modelo de decisão responde a perguntas tipadas sobre um estado e retorna probabilidades em vez de texto. O Jev da TypeSafe é a implementação de referência; qualquer endpoint que aceite o mesmo corpo `{model, state, questions}` funciona, e o nó [Decision](../nodes/decision-node.md) pode enviar um corpo escrito manualmente para um endpoint que não o faça.

### Campos Obrigatórios

- `base_url` – o endpoint, por exemplo `https://api.typesafe.ai`. O Heym acrescenta `/v1/systemone`.

### Campos Opcionais

- `api_key` – enviada como `Authorization: Bearer`. Endpoints que não exigem chave podem deixar este campo em branco.

### Observações

- **Test Connection** envia uma pequena pergunta para confirmar que o endpoint e a chave funcionam.
- Ao editar uma credencial, a chave armazenada é mantida quando o campo de chave é deixado em branco.
- Requisições de saída para endereços privados e de loopback são bloqueadas por padrão, portanto um endpoint auto-hospedado em `localhost` ou em uma faixa privada precisa de `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Esses modelos estão ausentes das tabelas de preços de LLM sincronizadas pelo Heym, então a coluna Cost em [Traces](../tabs/traces-tab.md) permanece vazia. As contagens de tokens ainda são registradas.

### Utilizada Por

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – avalia respostas de `LLM-as-Judge` em relação à saída esperada

## OpenAI Codex

A credencial do OpenAI Codex autentica o [nó Codex](../nodes/codex-node.md). Ela é separada da credencial de chave de API da OpenAI usada pelos nós LLM, Agent e RAG.

### Modos de Autenticação

| Modo | Descrição |
|------|-----------|
| **Sign in with ChatGPT** (recomendado) | Login via OAuth (PKCE) que utiliza sua assinatura ChatGPT Plus/Pro, de modo que as execuções evitam custos de API por token. O Heym armazena e atualiza automaticamente o pacote de tokens. |
| **Access token** | Um `access_token` do ChatGPT/Codex passado apenas ao processo local do Codex CLI. |

### Observações

- Chaves de API são rejeitadas para este tipo de credencial.
- Tokens do Codex não são expostos por meio de `$credentials.Name`.
- O nó Codex também precisa de uma credencial do GitHub para clonagem de repositório, push de branch e criação de PR em rascunho.

### Utilizada Por

- [nó Codex](../nodes/codex-node.md)

## OpenCode Go

A credencial do OpenCode Go autentica o [nó OpenCode Go](../nodes/opencode-go-node.md). Ela armazena uma chave de API do gateway do OpenCode Go (de [opencode.ai/go](https://opencode.ai/go)) e uma URL base opcional do gateway.

### Campos

| Campo | Descrição |
|-------|-----------|
| **API Key** | Chave de API do gateway do OpenCode Go (obrigatória). |
| **Gateway Base URL** | Opcional; o padrão é `https://opencode.ai/zen/go/v1`. Substitua apenas para um gateway auto-hospedado ou com proxy. |

### Observações

- A chave de API é passada apenas ao processo do OpenCode CLI dentro de um container reforçado.
- O nó OpenCode Go também precisa de uma credencial do GitHub para clonagem de repositório, push de branch e criação de pull request. O token do GitHub nunca é colocado dentro do container sandbox.

### Utilizada Por

- [nó OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

A credencial do Linear oferece suporte a uma chave de API pessoal ou a OAuth2 para o
[nó Linear](../nodes/linear-node.md). O Heym envia consultas GraphQL nativas ao Linear para metadados
de workspace, projetos, issues e comentários.
### Configuração

Escolha um modo de autenticação:

**Chave de API pessoal**

1. No Linear, abra **Settings → Security & Access → Personal API keys**.
2. Crie uma chave com acesso ao workspace que você deseja automatizar.
3. Cole a chave em uma credencial do Linear no Heym e use **Test Connection** para verificá-la.

**OAuth2**

1. Crie uma aplicação OAuth do Linear.
2. Registre `{FRONTEND_URL}/api/credentials/linear/oauth/callback` como o redirect URI.
3. No Heym Dashboard → **Credentials** → **New** → tipo **Linear**.
4. Escolha **OAuth2**, insira o Client ID e o Client Secret e clique em **Connect**.

### Campos Obrigatórios

| Modo | Campo | Descrição |
|------|-------|-------------|
| Chave de API pessoal | `api_key` | Chave de API pessoal do Linear, geralmente com o prefixo `lin_api_` |
| OAuth2 | `client_id` | Client ID da aplicação OAuth do Linear |
| OAuth2 | `client_secret` | Client Secret da aplicação OAuth do Linear |

Os tokens OAuth (`access_token`, `refresh_token`, `token_expiry`) são armazenados e atualizados automaticamente.

### Observações

- Chaves de API pessoais e tokens OAuth atuam como o usuário do Linear que os criou ou autorizou.
- O OAuth do Linear utiliza os escopos `read,write,issues:create,comments:create`.
- Use **Test Connection** no diálogo de credencial para verificar a chave de API ou o token OAuth junto à API do Linear.
- Use List Teams e List Projects no nó Linear para descobrir UUIDs antes de criar ou filtrar issues.
- Use List Workflow States e List Team Members para descobrir UUIDs de estado e responsável para atualizações.
- Faça a rotação de uma chave de API editando a credencial e inserindo o valor substituto. Se você fizer a rotação dos secrets da aplicação OAuth, reconecte a credencial via **Connect**.

### Utilizado Por

- [Nó Linear](../nodes/linear-node.md)

---

## Jira

A credencial do Jira armazena credenciais de autenticação Basic do Jira, a URL base do site do Jira, o modo de implantação e a versão opcional da REST API para o [nó Jira](../nodes/jira-node.md). Use `cloud` para o Jira Cloud ou `data_center` para o Jira Data Center / Server.

### Configuração

**Jira Cloud**

1. Nas configurações da conta Atlassian, crie um API token.
2. No Heym Dashboard → **Credentials** → **New** → tipo **Jira**.
3. Insira o e-mail da Atlassian, o API token e a URL do site do Jira, como `https://your-domain.atlassian.net`.
4. Use **Test Connection** para verificar a credencial.

**Jira Data Center / Server**

1. Selecione **Jira Data Center / Server** como a implantação.
2. Insira o nome de usuário e a senha do Jira usados para autenticação Basic.
3. Insira a URL do site do Jira, por exemplo `https://jira.example.com`.
4. Use **Test Connection** para verificar a credencial.

### Campos

| Campo | Descrição |
| --- | --- |
| `email` | E-mail da conta Atlassian do Jira Cloud, ou nome de usuário do Jira Data Center / Server |
| `api_token` | API token da Atlassian do Jira Cloud, ou senha do Jira Data Center / Server para autenticação Basic |
| `base_url` | URL base do site do Jira |
| `deployment` | `cloud` para o Jira Cloud ou `data_center` para o Jira Data Center / Server |
| `api_version` | Versão da REST API; o padrão é `3` para o Jira Cloud. O Data Center / Server usa a v2 |

### Observações

- O nó Jira envia descrições de issues e comentários como documentos de texto no formato Atlassian Document Format para a REST API v3 do Jira Cloud. As credenciais do Data Center / Server enviam texto simples.
- O Data Center / Server atualmente suporta apenas autenticação Basic com nome de usuário/senha. Personal access tokens e autenticação Bearer ainda não são suportados.
- O upload de anexos aceita conteúdo em base64 ou data URL e está sujeito ao limite de tamanho de arquivo da plataforma (padrão de 99 MB). O download de anexos pode retornar conteúdo em base64 quando habilitado.
- A criação e exclusão de usuários e a notificação de issues exigem que a conta autenticada do Jira tenha as permissões relevantes do site ou da organização do Jira.
- Use List Projects, Search Issues e List Transitions para descobrir chaves de projeto, chaves de issue e IDs de transição.
- Para endpoints personalizados não cobertos pelo nó Jira, use o [nó HTTP](../nodes/http-node.md) com Jira Basic Auth (`email:api_token` para Cloud ou `username:password` para Data Center / Server) no comando cURL, ou uma credencial Header com o valor correspondente `Authorization: Basic <base64(user:secret)>`.

Veja também:

- [Nó Jira](../nodes/jira-node.md)
- [Credenciais](./credentials.md)

---

## Sentry

A credencial do Sentry armazena um auth token para o [nó Sentry](../nodes/sentry-node.md). O Heym usa a REST API do Sentry para operações de organização, projeto, equipe, issue, evento e release.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `api_token` | Auth token do Sentry com acesso às organizações e aos projetos que você automatiza |

### Campos Opcionais

| Campo | Descrição |
|-------|-------------|
| `base_url` | URL raiz opcional para Sentry auto-hospedado, por exemplo `https://sentry.example.com` |

### Observações

- Deixe `base_url` vazio para o Sentry SaaS.
- Use **Test Connection** para confirmar que o token consegue listar as organizações visíveis.
- Para chamadas REST personalizadas, use `$credentials.YourSentryCredential` como o bearer token.

### Utilizado Por

- [Nó Sentry](../nodes/sentry-node.md)

---

## Qdrant

O [Qdrant](https://qdrant.tech) é um banco de dados vetorial de código aberto usado para busca semântica e RAG (Retrieval Augmented Generation).

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `qdrant_host` | URL completa para a sua instância do Qdrant (ex.: `http://localhost:6333` ou um endpoint de nuvem) |
| `openai_api_key` | Chave de API da OpenAI usada para gerar embeddings ao indexar e pesquisar documentos |
### Observações

- As coleções do Qdrant são gerenciadas na aba [Vectorstores](../tabs/vectorstores-tab.md). Cada vector store é mapeado para uma coleção do Qdrant.
- O [nó RAG](../nodes/rag-node.md) utiliza um vector store (que referencia uma credencial do Qdrant) — ele não referencia a credencial diretamente.
- Se a sua instância do Qdrant exigir uma API key, inclua-a no valor de `qdrant_host` ou configure o Qdrant adequadamente; a integração atual não possui um campo separado para a API key do Qdrant.
- Qdrant auto-hospedado: utilize a [imagem Docker oficial](https://hub.docker.com/r/qdrant/qdrant) e exponha a porta `6333`.

### Utilizado Por

- [nó RAG](../nodes/rag-node.md) (via vector store)
- [Aba Vectorstores](../tabs/vectorstores-tab.md)

## Embeddings Personalizados (RAG)

Por padrão, os embeddings de RAG vêm da OpenAI. Uma credencial **RAG: Custom Embeddings**
aponta para qualquer endpoint de embeddings compatível com OpenAI — Ollama, vLLM, Text
Embeddings Inference, LM Studio, Together ou um gateway hospedado — e nomeia o vector
store no qual ela grava.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `embedding_base_url` | URL do endpoint incluindo o caminho `/v1`, por exemplo `http://localhost:11434/v1` |
| `embedding_api_key` | Opcional. Servidores locais geralmente não precisam de key |
| `embedding_model` | Nome do modelo conforme o endpoint espera, por exemplo `nomic-embed-text` |
| `embedding_dimensions` | Largura do vetor retornada pelo modelo (padrão `1536`) |
| `embedding_request_dimensions` | Opcional. Solicita ao endpoint que retorne `embedding_dimensions` em vez da largura nativa do modelo |
| `db_type` | `qdrant` ou `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Conexão com o Qdrant, obrigatória quando `db_type` é `qdrant` |

### Observações

- **O Qdrant aceita qualquer número de dimensões.** Cada coleção é criada com a largura
  declarada por esta credencial, portanto o campo Dimensions é livremente editável.
- **O Postgres (pgvector) exige exatamente 1536 dimensões.** Sua coluna é um
  `vector(1536)` fixo, portanto o campo Dimensions fica fixado em 1536 e uma credencial
  que declare qualquer outra largura é rejeitada no momento de salvar.
- **Encurtamento para pgvector.** Quando o store é Postgres, o diálogo oferece *Ask the
  endpoint to return 1536 dimensions*. Isso envia o parâmetro de requisição `dimensions`,
  que modelos treinados com representações Matryoshka (OpenAI `text-embedding-3-*`,
  `nomic-embed-text-v1.5`, `jina-v3` e similares) respeitam retornando um vetor encurtado,
  porém ainda significativo. Endpoints que não suportam o parâmetro rejeitam a
  requisição, e endpoints que o aceitam mas o ignoram produzem um erro claro nomeando a
  largura efetivamente retornada. O Heym nunca trunca vetores por conta própria, pois
  fatiar a saída de um modelo não-Matryoshka degrada a qualidade da recuperação de forma
  silenciosa. A opção não é oferecida para o Qdrant, que pode dimensionar uma coleção com
  qualquer largura.
- Utilize **Test Connection** no diálogo da credencial para gerar o embedding de uma
  string de teste e ver a largura que o modelo realmente retorna antes de criar um store.
- O parâmetro de requisição `dimensions` é enviado apenas para a própria OpenAI, já que a
  maioria dos servidores compatíveis com OpenAI rejeita parâmetros desconhecidos. A
  largura nativa do modelo é validada em relação à credencial.
- As credenciais existentes **RAG: Qdrant + OpenAI** e **RAG: Psql + OpenAI** permanecem
  inalteradas e continuam funcionando.

### Utilizado Por

- [nó RAG](../nodes/rag-node.md) (via vector store)
- [Aba Vectorstores](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

O Heym também pode armazenar vetores **dentro do seu próprio banco de dados Postgres**
utilizando a extensão [pgvector](https://github.com/pgvector/pgvector) — sem necessidade
de um serviço de vetores externo. Crie uma credencial **RAG: Psql + OpenAI** e utilize-a
ao criar um vector store, depois selecione **Postgres (pgvector)** no dropdown Database do
nó RAG.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `openai_api_key` | API key da OpenAI utilizada para gerar embeddings ao indexar e buscar documentos |

### Observações

- Não é necessário host/port — os vetores são gravados no próprio banco de dados do Heym; o Heym nunca se conecta a um banco de dados diferente.
- Todos os recursos de RAG disponíveis com o Qdrant (inserção, busca, filtros de metadados, reranking com Cohere, clonagem, compartilhamento) funcionam de forma idêntica com o backend Postgres.
- Requer a extensão `vector`. O Heym mantém a imagem oficial `postgres:16` inalterada (para que os dados existentes nunca sejam afetados) e **instala automaticamente o pacote `postgresql-16-pgvector` na inicialização** — `run.sh`, `deploy.sh` e `run_e2e.sh` tratam isso. A instalação não é fatal: se não puder ser executada (por exemplo, sem rede), o RAG com Qdrant continua funcionando e o backend Postgres permanece inativo (a migração ignora a tabela de forma adequada).
- Se você executar a imagem publicada de contêiner único (`ghcr.io/heymrun/heym`) contra o **seu próprio Postgres externo**, esse banco de dados deve suportar a extensão `vector` (o Heym não pode instalá-la em um banco de dados que ele não gerencia). Sem ela, criar ou enviar dados para um vector store Postgres retorna uma mensagem clara e o RAG com Qdrant continua funcionando.

### Utilizado Por

- [nó RAG](../nodes/rag-node.md) (via vector store)
- [Aba Vectorstores](../tabs/vectorstores-tab.md)

---

## Grist

O [Grist](https://www.getgrist.com) é um híbrido de planilha e banco de dados que suporta dados estruturados e fórmulas. A credencial do Grist permite que o Heym leia e grave documentos do Grist.
### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `api_key` | Chave de API do Grist (encontrada em **Profile → API Key** na sua instância do Grist) |
| `server_url` | URL base do seu servidor Grist (por exemplo, `https://docs.getgrist.com` para o Grist Cloud, ou a URL da sua instância auto-hospedada) |

### Observações

- O [nó Grist](../nodes/grist-node.md) requer o **Document ID** (obtido a partir da URL do documento Grist) e o **Table ID** em sua configuração — estes não fazem parte da credencial.
- Para o Grist auto-hospedado, defina `server_url` como o domínio da sua instância.
- Os IDs de coluna no Grist utilizam underscores (por exemplo, `User_Name`), e não os rótulos de exibição. Utilize a operação `listColumns` para descobri-los.

### Utilizado Por

- [nó Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

A credencial do Google Sheets conecta o Heym à API do Google Sheets utilizando um modelo OAuth2 "Bring Your Own App". Você fornece um Client ID e um Client Secret OAuth2 do Google Cloud e, em seguida, autoriza o acesso por meio de um popup no navegador. Os Tokens são atualizados automaticamente em segundo plano.

### Configuração

1. Abra o [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → pesquise e habilite a **Google Sheets API**.
2. Acesse **Credentials** → **Create Credentials** → **OAuth client ID** → tipo de aplicação **Web application**.
3. Em **Authorized redirect URIs**, adicione: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Copie o **Client ID** e o **Client Secret** gerados.
5. No Heym Dashboard → **Credentials** → **New** → tipo **Google Sheets (OAuth2)**.
6. Insira o Client ID, o Client Secret e um nome, depois clique em **Connect** para abrir o popup de consentimento do Google e autorizar o acesso.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `client_id` | Client ID OAuth2 do Google Cloud Console |
| `client_secret` | Client Secret OAuth2 do Google Cloud Console |

Os Tokens (`access_token`, `refresh_token`, `token_expiry`) são armazenados e atualizados automaticamente — você não os gerencia diretamente.

### Observações

- A tela de consentimento OAuth2 requer o escopo de spreadsheets (`https://www.googleapis.com/auth/spreadsheets`).
- O Heym utiliza o refresh token para obter novos access tokens antes que expirem (buffer de segurança de 60 segundos).
- Se você rotacionar o Client Secret no Google Cloud Console, reconecte a credencial por meio do botão **Connect**.
- **Produção:** Defina o **`FRONTEND_URL`** do backend como a URL pública exata que os usuários abrem no navegador (esquema + host, por exemplo, `https://heym.example.com`). O Heym constrói o URI de redirecionamento OAuth do Google apenas a partir desse valor — ele **não** confia nos cabeçalhos `Origin` ou `X-Forwarded-*` (controlados pelo cliente). Registre `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` no Google Cloud Console.

### Utilizado Por

- [nó Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

A credencial do Google Drive conecta o Heym à API do Google Drive utilizando o mesmo modelo OAuth2 "Bring Your Own App" do Google Sheets. Você fornece um Client ID e um Client Secret OAuth2 do Google Cloud e, em seguida, autoriza o acesso por meio de um popup no navegador. Os Tokens são atualizados automaticamente em segundo plano.

### Configuração

1. Abra o [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → pesquise e habilite a **Google Drive API**.
2. Acesse **Credentials** → **Create Credentials** → **OAuth client ID** → tipo de aplicação **Web application**.
3. Em **Authorized redirect URIs**, adicione: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Copie o **Client ID** e o **Client Secret** gerados.
5. No Heym Dashboard → **Credentials** → **New** → tipo **Google Drive (OAuth2)**.
6. Insira o Client ID, o Client Secret e um nome, depois clique em **Connect** para abrir o popup de consentimento do Google e autorizar o acesso.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `client_id` | Client ID OAuth2 do Google Cloud Console |
| `client_secret` | Client Secret OAuth2 do Google Cloud Console |

Os Tokens (`access_token`, `refresh_token`, `token_expiry`) são armazenados e atualizados automaticamente — você não os gerencia diretamente.

### Escopo

O Google Drive solicita o **escopo completo do Drive** (`https://www.googleapis.com/auth/drive`).

Isso é necessário porque o nó opera sobre arquivos que você já possui. O escopo mais restrito `drive.file` concede acesso apenas aos arquivos criados pelo próprio cliente OAuth, o que faria com que `listFolderFiles`, `updateFile`, `removeFile` e `removeFolder` não enxergassem nada do seu Drive existente.

Como você fornece seu próprio Client ID e Secret a partir do seu próprio projeto do Google Cloud, os requisitos de verificação de aplicativo do Google para esse escopo se aplicam ao seu projeto, e não ao Heym.

### Observações

- O Heym utiliza o refresh token para obter novos access tokens antes que expirem (buffer de segurança de 60 segundos).
- Se você rotacionar o Client Secret no Google Cloud Console, reconecte a credencial por meio do botão **Connect**.
- Drives compartilhados são suportados — o nó define `supportsAllDrives` em todas as chamadas de API.
- **Produção:** Defina o **`FRONTEND_URL`** do backend como a URL pública exata que os usuários abrem no navegador. O Heym constrói o URI de redirecionamento OAuth do Google apenas a partir desse valor — ele **não** confia nos cabeçalhos `Origin` ou `X-Forwarded-*`. Registre `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` no Google Cloud Console.
- Consulte [Credential Sharing](./credentials-sharing.md) antes de compartilhar esta credencial com uma equipe.

### Utilizado Por

- [nó Google Drive](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

A credencial do BigQuery conecta o Heym à API do Google BigQuery usando um modelo OAuth2 "Bring Your Own App". Você fornece um Client ID e um Client Secret OAuth2 do Google Cloud e, em seguida, autoriza o acesso por meio de um popup do navegador. Os tokens são renovados automaticamente em segundo plano.

### Configuração

1. Abra o [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → pesquise e habilite a **BigQuery API**.
2. Acesse **Credentials** → **Create Credentials** → **OAuth client ID** → tipo de aplicação **Web application**.
3. Em **Authorized redirect URIs**, adicione: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Copie o **Client ID** e o **Client Secret** gerados.
5. No Heym Dashboard → **Credentials** → **New** → tipo **BigQuery (OAuth2)**.
6. Informe o Client ID, o Client Secret e um nome e clique em **Connect** para abrir o popup de consentimento do Google e autorizar o acesso.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `client_id` | Client ID OAuth2 do Google Cloud Console |
| `client_secret` | Client Secret OAuth2 do Google Cloud Console |

Os tokens (`access_token`, `refresh_token`, `token_expiry`) são armazenados e renovados automaticamente.

### Observações

- A tela de consentimento OAuth2 exige o escopo do BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Produção:** Defina o **`FRONTEND_URL`** do backend para a URL pública. Registre `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` no Google Cloud Console.

### Utilizada Por

- [Nó BigQuery](../nodes/bigquery-node.md)

---

## Supabase

A credencial do Supabase conecta o Heym à API PostgREST de um projeto Supabase, permitindo que os workflows consultem e modifiquem tabelas com suporte do Postgres.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `supabase_url` | URL base do projeto, por exemplo `https://your-project.supabase.co` |
| `supabase_key` | Chave de API com acesso às tabelas de destino |
| `supabase_schema` | Schema padrão opcional (o padrão é `public`) |

### Observações

- O [nó Supabase](../nodes/supabase-node.md) comunica-se com `/rest/v1/<table>` e oferece suporte a filtros de operadores (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` e operadores PostgREST relacionados), além de grupos lógicos aninhados `or` / `and`.
- Para operações de escrita, prefira uma chave destinada ao uso confiável no lado do servidor, com as permissões mínimas necessárias nas tabelas.
- Os nós podem substituir o schema por etapa, mesmo que a credencial defina um schema padrão.

### Utilizada Por

- [Nó Supabase](../nodes/supabase-node.md)

## ClickHouse

A credencial do ClickHouse conecta o Heym a um banco de dados ClickHouse externo por meio de sua interface HTTP, permitindo que os workflows executem operações SQL, CRUD e de contagem em tabelas OLAP.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `host` | Host HTTP sem esquema, por exemplo `your-instance.clickhouse.cloud` |
| `port` | Porta da interface HTTP (`8443` para HTTPS, `8123` para HTTP) |
| `username` | Usuário do ClickHouse (o padrão é `default`) |
| `password` | Senha do usuário (opcional) |
| `database` | Banco de dados de destino (o padrão é `default`) |
| `secure` | Usar HTTPS quando `true` (obrigatório para o ClickHouse Cloud) |

### Observações

- O [nó ClickHouse](../nodes/clickhouse-node.md) usa o cliente HTTP oficial `clickhouse-connect` e parametriza os bindings de filtros e valores.
- `update` e `remove` mapeiam para `ALTER TABLE ... UPDATE` e `DELETE FROM`, que são mutações assíncronas do ClickHouse; ambos exigem um filtro.
- `upsert` executa um `INSERT` e pressupõe uma tabela `ReplacingMergeTree` para o comportamento de merge-on-key.
- Use **Test connection** no diálogo da credencial para verificar a acessibilidade.

### Utilizada Por

- [Nó ClickHouse](../nodes/clickhouse-node.md)

## Notion

A credencial do Notion oferece suporte tanto a um token de integração interna quanto a uma conexão OAuth de integração pública. O OAuth permite que cada usuário autorize um workspace do Notion a partir do Heym, em vez de copiar manualmente um token.

### Campos Obrigatórios

| Modo | Campo | Descrição |
|------|-------|-------------|
| Token interno | `api_token` | Token de integração interna (`ntn_...`) |
| OAuth | `client_id` | Client ID de uma integração pública do Notion |
| OAuth | `client_secret` | Client Secret da integração pública do Notion |

O callback OAuth armazena automaticamente `access_token`, `auth_mode`, `workspace_id`, `workspace_name` e `bot_id`. Qualquer `api_token` interno anterior é removido quando o OAuth é concluído. Registre este URI de redirecionamento no Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Fluxo de configuração do OAuth

1. Escolha **OAuth** no diálogo da credencial, informe um nome, o Client ID e o Client Secret.
2. Clique em **Connect** e autorize o workspace no popup do Notion.
   - Para uma credencial **nova**, o Heym cria o registro da credencial quando você clica em **Connect**.
   - Conclua a autorização no popup e clique em **Save** para retornar à lista de credenciais.
3. Uma credencial conectada exibe `connected (Workspace Name)` na lista. Credenciais OAuth pendentes exibem `Not connected` até que a autorização seja concluída.

Use **Test Connection** no diálogo da credencial para verificar tanto um token interno quanto uma autorização OAuth concluída. Ao editar, deixar o campo do token em branco preserva o token interno armazenado.

Tanto os tokens internos quanto os access tokens OAuth estão disponíveis por meio de `$credentials.CredentialName` para chamadas [HTTP](../nodes/http-node.md) personalizadas que precisem de um bearer token do Notion.
### Observações

- Integrações internas exigem que as páginas, databases e fontes de dados relevantes sejam compartilhadas.
- Usuários de OAuth escolhem o workspace/páginas durante a autorização do Notion.
- As credenciais da aplicação OAuth são criptografadas dentro da credencial do Notion. O callback as recarrega
  no lado do servidor; o segredo não é incorporado ao estado do OAuth.
- Credenciais OAuth conectadas exibem o nome do workspace; credenciais OAuth pendentes mostram
  `Not connected` até que a autorização seja concluída.
- **Produção:** Defina o **`FRONTEND_URL`** do backend para a URL pública do navegador (esquema + host, sem
  barra final). O URI de redirecionamento do Notion deve corresponder exatamente a:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- O nó utiliza a versão de API `2026-03-11` e a terminologia atual de `data_source`. Consulte o
  artigo do [nó Notion](../nodes/notion-node.md#api-version-notes) para orientações de migração a partir de
  exemplos mais antigos de `archived`, `after` ou consultas a databases.
- Filtros de busca antigos com valor de objeto `database` são normalizados para `data_source`.

### Utilizado Por

- [Nó Notion](../nodes/notion-node.md)

---

## SMTP (Email)

A credencial SMTP armazena os detalhes de conexão com o servidor de email para o envio de mensagens.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `host` | Nome do host do servidor SMTP (ex.: `smtp.gmail.com`) |
| `port` | Porta SMTP (normalmente `587` para STARTTLS, `465` para SSL) |
| `email` | Endereço de email do remetente |
| `password` | Senha SMTP ou App Password |

### Provedores SMTP Comuns

| Provedor | Host | Porta | Observações |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Requer uma [App Password](https://support.google.com/accounts/answer/185833) (a verificação em duas etapas deve estar habilitada) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Utilize as credenciais da sua conta Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Utilize as credenciais SMTP do Mailgun obtidas nas configurações do seu domínio |
| SendGrid | `smtp.sendgrid.net` | `587` | Utilize `apikey` como nome de usuário e uma API key como senha |
| Personalizado / Auto-hospedado | seu domínio | `587` / `465` | Postfix, Exim, etc. |

### Observações

- O Gmail requer uma **App Password** em vez da sua senha regular quando a verificação em duas etapas está habilitada.
- A porta `587` utiliza STARTTLS (inicia em texto simples, atualiza para TLS). A porta `465` utiliza TLS implícito (SSL desde o início).

### Utilizado Por

- [Nó Send Email](../nodes/send-email-node.md)

---

## IMAP (Email de Entrada)

A credencial IMAP armazena os detalhes de conexão para monitorar uma caixa de entrada com o [nó IMAP Trigger](../nodes/imap-trigger-node.md).

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `imap_host` | Nome do host do servidor IMAP (por exemplo `imap.gmail.com`) |
| `imap_port` | Porta IMAP (`993` para SSL/TLS na maioria dos provedores) |
| `imap_username` | Nome de usuário da caixa de correio ou endereço de email completo |
| `imap_password` | Senha ou app password específica do provedor |

### Campos Opcionais

| Campo | Descrição |
|-------|-------------|
| `imap_mailbox` | Pasta da caixa de correio a ser monitorada (padrão: `INBOX`) |
| `imap_use_ssl` | Habilita SSL/TLS (recomendado; padrão: `true`) |

### Observações

- O trigger IMAP estabelece uma linha de base da caixa de correio atual na primeira verificação e, em seguida, processa apenas emails mais recentes.
- O Gmail, o Microsoft 365 e outros provedores hospedados frequentemente exigem uma **app password** ou segredo específico para IMAP semelhante.
- O conteúdo dos anexos não é baixado para o payload do workflow; o Heym expõe apenas os metadados dos anexos.

### Utilizado Por

- [Nó IMAP Trigger](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP como trigger de workflow)

---

## RabbitMQ

O [RabbitMQ](https://www.rabbitmq.com) é um message broker de código aberto. A credencial RabbitMQ armazena os detalhes de conexão para publicar e consumir de filas e exchanges.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `rabbitmq_host` | URL de conexão AMQP (ex.: `amqp://localhost:5672`) |
| `rabbitmq_username` | Nome de usuário do RabbitMQ (padrão: `guest`) |
| `rabbitmq_password` | Senha do RabbitMQ (padrão: `guest`) |

### Virtual Hosts

Para conectar a um virtual host específico, inclua-o na URL `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Se estiver utilizando o vhost padrão, o caminho `/` pode ser omitido.

### Plugin de Mensagens Atrasadas

O [nó RabbitMQ](../nodes/rabbitmq-node.md) oferece suporte ao plugin **rabbitmq_delayed_message_exchange**. Quando esse plugin está habilitado no seu servidor RabbitMQ, você pode definir um atraso (em milissegundos) nas mensagens de saída utilizando o campo `rabbitmqDelayMs` no nó.

O nó define o cabeçalho `x-delay` na mensagem publicada. O tipo de exchange deve ser `x-delayed-message` para que os atrasos tenham efeito.

Para habilitar o plugin em uma instância auto-hospedada do RabbitMQ:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Quando o plugin não está instalado, o cabeçalho `x-delay` é ignorado e as mensagens são entregues imediatamente.

### Utilizado Por

- [Nó RabbitMQ](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ como trigger de workflow)

---

## Amazon S3

A credencial Amazon S3 conecta o Heym ao [Amazon S3](https://aws.amazon.com/s3/). Utilize-a com o [nó Amazon S3](../nodes/amazon-s3-node.md) para gerenciar buckets e pastas, fazer upload e download de objetos, copiar chaves e listar ou excluir objetos a partir de workflows.
### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `aws_access_key_id` | ID da chave de acesso do AWS IAM |
| `aws_secret_access_key` | Chave de acesso secreta associada ao ID da chave de acesso |
| `aws_region` | Região da AWS onde os buckets residem (ex.: `us-east-1`) |

### Campos Opcionais

| Campo | Descrição |
|-------|-------------|
| `aws_session_token` | Token de sessão temporário ao utilizar credenciais do AWS STS |

### Observações

- A credencial utiliza autenticação padrão AWS SigV4 via boto3.
- As operações de upload atualmente enviam conteúdo de texto em UTF-8; os downloads podem retornar texto ou base64 para objetos binários.

### Utilizada Por

- [Nó Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

O [Redis](https://redis.io) é um armazenamento de chave-valor em memória utilizado para caching e acesso rápido a dados.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `host` | Nome do host ou IP do servidor Redis (ex.: `localhost`) |
| `port` | Porta do Redis (padrão: `6379`) |
| `password` | Senha do Redis (deixe vazio se não estiver definida) |

### Utilizada Por

- [Nó Redis](../nodes/redis-node.md)

---

## Slack

A credencial do Slack armazena uma **URL de Incoming Webhook** para publicar mensagens em canais do Slack.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `webhook_url` | URL do Incoming Webhook do Slack (obtida na configuração do seu app no Slack) |

### Observações

- Crie um Incoming Webhook em [api.slack.com/apps](https://api.slack.com/apps) → seu app → **Incoming Webhooks**.
- Cada webhook é restrito a um canal específico. Crie múltiplas credenciais para canais diferentes.

### Utilizada Por

- [Nó Slack](../nodes/slack-node.md)

---

## Telegram

A credencial do Telegram armazena um **Bot Token** e um **Webhook Secret Token** opcional para workflows baseados em bots.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `bot_token` | Token da Telegram Bot API obtido junto ao BotFather |

### Campos Opcionais

| Campo | Descrição |
|-------|-------------|
| `secret_token` | Segredo compartilhado verificado contra `x-telegram-bot-api-secret-token` em webhooks recebidos |

### Observações

- Utilize a mesma credencial tanto para o [Telegram Trigger](../nodes/telegram-trigger-node.md) quanto para o [Telegram](../nodes/telegram-node.md).
- Registre o webhook manualmente com a API `setWebhook` do Telegram, utilizando a URL exibida no painel do nó Telegram Trigger.
- O `chatId` no nó Telegram pode ser um ID literal ou uma expressão como `$telegramEvent.message.chat.id`.

### Utilizada Por

- [Nó Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Nó Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Estas credenciais são utilizadas pelo [Nó HTTP](../nodes/http-node.md) para autenticar requisições de saída.

### Bearer

Anexa um cabeçalho `Authorization: Bearer <token>` às requisições HTTP.

| Campo | Descrição |
|-------|-------------|
| `token` | O valor do bearer token |

### Header

Anexa um cabeçalho personalizado às requisições HTTP.

| Campo | Descrição |
|-------|-------------|
| `header_key` | Nome do cabeçalho (ex.: `X-Api-Key`) |
| `header_value` | Valor do cabeçalho |

Ambos os tipos também podem ser referenciados via `$credentials.CredentialName` na [Expression DSL](./expression-dsl.md) para uso dinâmico em qualquer nó que aceite expressões.

### Utilizada Por

- [Nó HTTP](../nodes/http-node.md)

---

## Provedores de LLM (OpenAI, Google, Custom, Cohere)

Estas credenciais alimentam os nós de IA.

| Tipo | Descrição |
|------|-------------|
| **OpenAI** | Chave de API para modelos GPT e embeddings da OpenAI |
| **Google** | Chave de API para modelos Gemini |
| **Custom** | Chave de API + URL base para endpoints compatíveis com OpenAI (Ollama, vLLM, LM Studio, etc.) |
| **Cohere** | Chave de API para embeddings da Cohere |

### Cache de Prompt da OpenAI

A OpenAI armazena automaticamente em cache o prefixo estático (inalterado) do seu system prompt — nenhuma configuração adicional é necessária. Execuções repetidas de workflow que compartilham o mesmo prefixo de system prompt se beneficiam do preço de tokens em cache, o que reduz tanto o custo quanto a latência. Isso é especialmente útil quando você possui instruções longas e fixas e apenas a mensagem do usuário muda entre execuções. Monitore as taxas de acerto de cache e a economia de tokens na [Aba Traces](../tabs/traces-tab.md) ou no painel de uso da OpenAI para otimizar a estrutura do seu prompt visando o máximo reaproveitamento de cache.

### Utilizada Por

- [Nó LLM](../nodes/llm-node.md)
- [Nó Agent](../nodes/agent-node.md)
- [Nó RAG](../nodes/rag-node.md) (embeddings da OpenAI via credencial Qdrant)

---

## FlareSolverr

O [FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) é um servidor proxy para contornar o Cloudflare e desafios similares de proteção contra bots.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `flaresolverr_url` | URL da sua instância do FlareSolverr (ex.: `http://localhost:8191`) |

Endereços de loopback e privados são suportados aqui, portanto executar o FlareSolverr ao lado do Heym funciona conforme documentado. A URL não pode resolver para um endereço link-local ou de metadados de nuvem. Como endereços privados são permitidos, este campo também pode apontar para outro serviço interno e a resposta retorna na saída do nó. Qualquer usuário autenticado pode criar esta credencial, portanto o limite é quem pode criar workflows somado às suas regras de rede, e não o compartilhamento de credenciais. Consulte [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Utilizada Por

- [Nó Crawler](../nodes/crawler-node.md)

---
## Relacionados

- [Credentials](./credentials.md) – Visão geral das credenciais e como os nós as utilizam
- [Credentials Tab](../tabs/credentials-tab.md) – Adicionar e gerenciar credenciais
- [Credentials Sharing](./credentials-sharing.md) – Compartilhar credenciais com usuários e equipes
- [Security](./security.md) – Criptografia em repouso, controle de acesso
- [Expression DSL](./expression-dsl.md) – Sintaxe `$credentials` para acesso dinâmico

---

## Model Router (Auto Model)

Encaminha cada requisição para uma das suas credenciais de modelo existentes, utilizando um modelo de decisão para
escolher. Ele armazena referências, nunca uma chave própria.

### Campos Obrigatórios

- `decision_credential_id` – uma credencial de **Decision Model** à qual você tem acesso.
- `decision_model` – o modelo que realiza a chamada de roteamento, por exemplo `jev-latest`.
- `options` – pelo menos duas entradas, cada uma com um nome, uma das suas credenciais OpenAI/Google/Custom,
  um modelo nela, e critérios indicando quando ela deve vencer.

### Campos Opcionais

- `routing_instructions` – como ponderar as opções de forma geral.
- Uma opção pode ser marcada como o fallback utilizado quando o roteamento falha.

### Observações

Os nomes das opções são o que o modelo de decisão escolhe entre eles, portanto devem ser distintos. Uma
opção não pode apontar para outro Model Router.
