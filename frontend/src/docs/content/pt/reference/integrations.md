# Integrações de Terceiros

O Heym conecta-se a serviços externos por meio de **credenciais**. Cada tipo de credencial armazena os detalhes de conexão de um serviço e pode ser reutilizada em vários nós e workflows. Consulte [Credenciais](./credentials.md) para obter uma visão geral.

Adicione credenciais em [Configurações → Credenciais](../tabs/credentials-tab.md). Todos os valores são criptografados em repouso. As credenciais podem ser [compartilhadas](./credentials-sharing.md) com outros usuários ou [Equipes](./teams.md).

Alguns nós de integração **não** exigem credenciais. O [WebSocket Trigger](../nodes/websocket-trigger-node.md) e o [WebSocket Send](../nodes/websocket-send-node.md) conectam-se a sockets externos utilizando a URL, os cabeçalhos e os subprotocolos configurados diretamente no nó.

## Tipos de Credenciais em Resumo

| Tipo | Utilizado Por | Campos Principais |
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
| **Decision Model** | [Decision](../nodes/decision-node.md), [Avaliações](../tabs/evals-tab.md) (juiz LLM-as-Judge) | `base_url`, `api_key` opcional |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, Padrões de IA | uma credencial de modelo de decisão, além de opções de modelo que fazem referência às suas outras credenciais |
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

A credencial do GitHub armazena um token de acesso pessoal (PAT) do GitHub para que os Workflows possam chamar a API REST do GitHub através do [Nó GitHub](../nodes/github-node.md), passar o token para servidores MCP como `@modelcontextprotocol/server-github`, ou utilizá-lo a partir do [Nó HTTP](../nodes/http-node.md) para chamadas REST personalizadas.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `api_key` | Token de acesso pessoal do GitHub (PAT refinado `github_pat_...` ou PAT clássico `ghp_...`) |

### Campos Opcionais

| Campo | Descrição |
|-------|-------------|
| `base_url` | URL base da API do GitHub para GitHub Enterprise Server (por exemplo `https://github.example.com/api/v3`) |

### Notas

- Recomenda-se utilizar tokens de acesso pessoal refinados sempre que possível, pois é possível restringi-los a repositórios e permissões específicos.
- Deixe `base_url` vazio para o GitHub.com. Para o GitHub Enterprise Server, utilize o endpoint completo da API REST
  incluindo `/api/v3` (por exemplo `https://github.example.com/api/v3`), e não a
  raiz da interface web do servidor, como `https://github.example.com`.
- Esta credencial atualmente modela apenas autenticação baseada em PAT. Para acessar repositórios de organização, utilize um PAT ao qual tenham sido concedidas as permissões de organização/repositório necessárias.
- Tokens de instalação do GitHub App e fluxos de configuração do GitHub App não são nativos na interface do Heym atualmente.
- Prefira o [Nó GitHub](../nodes/github-node.md) para operações nativas de repositório, usuário, issue, pull request, review, release, Workflow do Actions, tráfego e arquivos. Utilize o [Nó HTTP](../nodes/http-node.md) apenas quando precisar de endpoints ou payloads que o Nó GitHub não cobre.
- Utilize o [Nó Agent](../nodes/agent-node.md) com MCP passando `$credentials.YourGitHubCredential` para uma variável de ambiente de conexão MCP, como `GITHUB_PERSONAL_ACCESS_TOKEN`.
- A API REST do GitHub geralmente espera `Authorization: Bearer <token>` mais `Accept: application/vnd.github+json`.
- Ao editar uma credencial do GitHub, deixar o `base_url` do GitHub Enterprise vazio preserva o
  endpoint existente. Insira uma nova URL apenas quando desejar alterar esse endpoint.

### Utilizada Por

- [Nó GitHub](../nodes/github-node.md)
- [Nó Codex](../nodes/codex-node.md)
- [Nó Agent](../nodes/agent-node.md)
- [Nó HTTP](../nodes/http-node.md)

---

## Decision Model

Um decision model responde a perguntas tipadas sobre um estado e retorna probabilidades em vez de texto. O Jev da TypeSafe é a implementação de referência; qualquer endpoint que aceite o mesmo corpo `{model, state, questions}` funciona, e o Nó [Decision](../nodes/decision-node.md) pode enviar um corpo escrito manualmente para um que não aceite.

### Campos Obrigatórios

- `base_url` – o endpoint, por exemplo `https://api.typesafe.ai`. O Heym acrescenta `/v1/systemone`.

### Campos Opcionais

- `api_key` – enviado como `Authorization: Bearer`. Endpoints que não exigem chave podem deixar este campo em branco.

### Notas

- **Test Connection** envia uma pequena pergunta para confirmar que o endpoint e a chave funcionam.
- Editar uma credencial mantém a chave armazenada quando o campo da chave é deixado em branco.
- Requisições de saída para endereços privados e de loopback são bloqueadas por padrão, portanto um endpoint auto-hospedado em `localhost` ou em um intervalo privado precisa de `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Esses modelos estão ausentes das tabelas de preços de LLM que o Heym sincroniza, portanto a coluna Cost em [Execuções](../tabs/traces-tab.md) permanece vazia. As contagens de Token ainda são registradas.

### Utilizada Por

- [Decision](../nodes/decision-node.md)
- [Avaliações](../tabs/evals-tab.md) – pontua respostas `LLM-as-Judge` em relação à saída esperada

## OpenAI Codex

A credencial do OpenAI Codex autentica o [Nó Codex](../nodes/codex-node.md). Ela é separada da credencial de chave de API da OpenAI utilizada pelos nós LLM, Agent e RAG.

### Modos de Autenticação

| Modo | Descrição |
|------|-------------|
| **Sign in with ChatGPT** (recomendado) | Login OAuth (PKCE) que utiliza a sua assinatura ChatGPT Plus/Pro, de modo que as execuções evitam custos de API por Token. O Heym armazena e atualiza automaticamente o pacote de tokens. |
| **Access token** | Um `access_token` do ChatGPT/Codex passado apenas para o processo local do Codex CLI. |

### Notas

- Chaves de API são rejeitadas para este tipo de credencial.
- Tokens do Codex não são expostos através de `$credentials.Name`.
- O Nó Codex também precisa de uma credencial do GitHub para clonagem de repositório, push de branch e criação de PR em rascunho.

### Utilizada Por

- [Nó Codex](../nodes/codex-node.md)

## OpenCode Go

A credencial do OpenCode Go autentica o [Nó OpenCode Go](../nodes/opencode-go-node.md). Ela armazena uma chave de API do gateway OpenCode Go (de [opencode.ai/go](https://opencode.ai/go)) e uma URL base opcional do gateway.

### Campos

| Campo | Descrição |
|-------|-------------|
| **API Key** | Chave de API do gateway OpenCode Go (obrigatória). |
| **Gateway Base URL** | Opcional; o padrão é `https://opencode.ai/zen/go/v1`. Substitua apenas para um gateway auto-hospedado ou com proxy. |
### Notas

- A chave de API é passada apenas para o processo da CLI do OpenCode dentro de um contêiner reforçado.
- O nó OpenCode Go também precisa de uma credencial do GitHub para clonagem de repositório, push de branch e criação de pull request. O token do GitHub nunca é colocado dentro do contêiner sandbox.

### Utilizado por

- [Nó OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

A credencial do Linear oferece suporte a uma chave de API pessoal ou OAuth2 para o
[Nó Linear](../nodes/linear-node.md). O Heym envia consultas GraphQL nativas ao Linear para metadados de workspace,
projetos, issues e comentários.

### Configuração

Escolha um modo de autenticação:

**Chave de API pessoal**

1. No Linear, abra **Settings → Security & Access → Personal API keys**.
2. Crie uma chave com acesso ao workspace que você deseja automatizar.
3. Cole a chave em uma credencial do Linear no Heym e use **Test Connection** para verificá-la.

**OAuth2**

1. Crie um aplicativo OAuth do Linear.
2. Registre `{FRONTEND_URL}/api/credentials/linear/oauth/callback` como o URI de redirecionamento.
3. No Heym Dashboard → **Credentials** → **New** → tipo **Linear**.
4. Escolha **OAuth2**, insira o Client ID e o Client Secret e clique em **Connect**.

### Campos obrigatórios

| Modo | Campo | Descrição |
|------|-------|-------------|
| Chave de API pessoal | `api_key` | Chave de API pessoal do Linear, geralmente com o prefixo `lin_api_` |
| OAuth2 | `client_id` | Client ID do aplicativo OAuth do Linear |
| OAuth2 | `client_secret` | Client Secret do aplicativo OAuth do Linear |

Os tokens OAuth (`access_token`, `refresh_token`, `token_expiry`) são armazenados e atualizados automaticamente.

### Notas

- Chaves de API pessoais e tokens OAuth atuam como o usuário do Linear que os criou ou autorizou.
- O OAuth do Linear usa os escopos `read,write,issues:create,comments:create`.
- Use **Test Connection** no diálogo de credencial para verificar a chave de API ou o token OAuth em relação à API do Linear.
- Use List Teams e List Projects no nó Linear para descobrir UUIDs antes de criar ou filtrar issues.
- Use List Workflow States e List Team Members para descobrir UUIDs de estado e responsável para atualizações.
- Faça a rotação de uma chave de API editando a credencial e inserindo o valor de substituição. Se você fizer a rotação dos segredos do aplicativo OAuth, reconecte a credencial via **Connect**.

### Utilizado por

- [Nó Linear](../nodes/linear-node.md)

---

## Jira

A credencial do Jira armazena credenciais de autenticação Basic do Jira, URL base do site do Jira, modo de implantação e versão opcional da API REST para o [Nó Jira](../nodes/jira-node.md). Use `cloud` para o Jira Cloud ou `data_center` para o Jira Data Center / Server.

### Configuração

**Jira Cloud**

1. Nas configurações da conta Atlassian, crie um token de API.
2. No Heym Dashboard → **Credentials** → **New** → tipo **Jira**.
3. Insira o e-mail da Atlassian, o token de API e a URL do site do Jira, como `https://your-domain.atlassian.net`.
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
| `api_token` | Token de API da Atlassian do Jira Cloud, ou senha do Jira Data Center / Server para autenticação Basic |
| `base_url` | URL base do site do Jira |
| `deployment` | `cloud` para Jira Cloud ou `data_center` para Jira Data Center / Server |
| `api_version` | Versão da API REST; o padrão é `3` para Jira Cloud. Data Center / Server usa v2 |

### Notas

- O nó Jira envia descrições de issues e comentários como documentos de texto no formato Atlassian Document Format
  para a API REST v3 do Jira Cloud. Credenciais de Data Center / Server enviam texto simples.
- O Data Center / Server atualmente oferece suporte apenas a autenticação Basic com nome de usuário/senha. Tokens de acesso pessoal
  e autenticação Bearer ainda não são suportados.
- O upload de anexos aceita conteúdo em base64 ou data URL e está sujeito ao limite de tamanho de arquivo da plataforma (padrão de 99 MB). O download de anexos pode retornar conteúdo em base64 quando habilitado.
- A criação e exclusão de usuários e a notificação de issues exigem que a conta autenticada do Jira tenha as permissões relevantes do site ou da organização do Jira.
- Use List Projects, Search Issues e List Transitions para descobrir chaves de projeto, chaves de issue e IDs de transição.
- Para endpoints personalizados não cobertos pelo nó Jira, use o [Nó HTTP](../nodes/http-node.md) com Jira Basic Auth (`email:api_token` para Cloud ou `username:password` para Data Center / Server) no comando cURL, ou uma credencial de Header com o valor correspondente `Authorization: Basic <base64(user:secret)>`.

Veja também:

- [Nó Jira](../nodes/jira-node.md)
- [Credenciais](./credentials.md)

---

## Sentry

A credencial do Sentry armazena um token de autenticação para o [Nó Sentry](../nodes/sentry-node.md). O Heym usa a API REST do Sentry para operações de organização, projeto, equipe, issue, evento e release.
### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `api_token` | Token de autenticação do Sentry com acesso às organizações e projetos que você automatiza |

### Campos Opcionais

| Campo | Descrição |
|-------|-------------|
| `base_url` | URL raiz opcional para Sentry auto-hospedado, por exemplo `https://sentry.example.com` |

### Observações

- Deixe `base_url` vazio para o Sentry SaaS.
- Utilize **Test Connection** para confirmar que o token consegue listar as organizações visíveis.
- Para chamadas REST personalizadas, utilize `$credentials.YourSentryCredential` como bearer token.

### Utilizado Por

- [Nó Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) é um banco de dados vetorial de código aberto utilizado para busca semântica e RAG (Retrieval Augmented Generation).

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `qdrant_host` | URL completa para a sua instância do Qdrant (ex.: `http://localhost:6333` ou um endpoint na nuvem) |
| `openai_api_key` | Chave de API da OpenAI utilizada para gerar embeddings ao indexar e pesquisar documentos |

### Observações

- As coleções do Qdrant são gerenciadas na aba [Vectorstores](../tabs/vectorstores-tab.md). Cada armazenamento vetorial é mapeado para uma coleção do Qdrant.
- O [Nó RAG](../nodes/rag-node.md) utiliza um armazenamento vetorial (que referencia uma credencial do Qdrant) — ele não referencia a credencial diretamente.
- Se a sua instância do Qdrant exigir uma chave de API, inclua-a no valor de `qdrant_host` ou configure o Qdrant adequadamente; a integração atual não possui um campo separado para a chave de API do Qdrant.
- Qdrant auto-hospedado: utilize a [imagem Docker oficial](https://hub.docker.com/r/qdrant/qdrant) e exponha a porta `6333`.

### Utilizado Por

- [Nó RAG](../nodes/rag-node.md) (via armazenamento vetorial)
- [Aba Vectorstores](../tabs/vectorstores-tab.md)

## Embeddings Personalizados (RAG)

Por padrão, os embeddings de RAG vêm da OpenAI. Uma credencial **RAG: Custom Embeddings**
aponta para qualquer endpoint de embeddings compatível com OpenAI — Ollama, vLLM, Text
Embeddings Inference, LM Studio, Together ou um gateway hospedado — e nomeia o armazenamento
vetorial no qual grava.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `embedding_base_url` | URL do endpoint incluindo o caminho `/v1`, ex.: `http://localhost:11434/v1` |
| `embedding_api_key` | Opcional. Servidores locais geralmente não precisam de chave |
| `embedding_model` | Nome do modelo conforme o endpoint espera, ex.: `nomic-embed-text` |
| `embedding_dimensions` | Largura do vetor retornada pelo modelo (padrão `1536`) |
| `embedding_request_dimensions` | Opcional. Solicita ao endpoint que retorne `embedding_dimensions` em vez da largura nativa do modelo |
| `db_type` | `qdrant` ou `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Conexão com o Qdrant, obrigatória quando `db_type` é `qdrant` |

### Observações

- **O Qdrant aceita qualquer contagem de dimensões.** Cada coleção é criada com a largura declarada por esta credencial, portanto o campo Dimensions é livremente editável.
- **O Postgres (pgvector) exige exatamente 1536 dimensões.** Sua coluna é um `vector(1536)` fixo, portanto o campo Dimensions fica fixado em 1536 e uma credencial que declare qualquer outra largura é rejeitada no momento de salvar.
- **Encurtamento para pgvector.** Quando o armazenamento é Postgres, a caixa de diálogo oferece *Ask the endpoint to return 1536 dimensions*. Isso envia o parâmetro de requisição `dimensions`, que modelos treinados com representações Matryoshka (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` e similares) respeitam ao retornar um vetor encurtado, ainda significativo. Endpoints que não suportam o parâmetro rejeitam a requisição, e endpoints que o aceitam mas o ignoram produzem um erro claro nomeando a largura efetivamente retornada. O Heym nunca trunca vetores por conta própria, pois fatiar a saída de um modelo não-Matryoshka degrada a qualidade da recuperação de forma silenciosa. A opção não é oferecida para o Qdrant, que consegue dimensionar uma coleção para qualquer largura.
- Utilize **Test Connection** na caixa de diálogo da credencial para gerar o embedding de uma string de teste e ver a largura que o modelo efetivamente retorna antes de criar um armazenamento.
- O parâmetro de requisição `dimensions` é enviado apenas para a própria OpenAI, já que a maioria dos servidores compatíveis com OpenAI rejeita parâmetros desconhecidos. A largura nativa do modelo é validada em relação à credencial.
- As credenciais existentes **RAG: Qdrant + OpenAI** e **RAG: Psql + OpenAI** permanecem inalteradas e continuam funcionando.

### Utilizado Por

- [Nó RAG](../nodes/rag-node.md) (via armazenamento vetorial)
- [Aba Vectorstores](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

O Heym também pode armazenar vetores **dentro do seu próprio banco de dados Postgres** utilizando a
extensão [pgvector](https://github.com/pgvector/pgvector) — sem necessidade de serviço vetorial externo.
Crie uma credencial **RAG: Psql + OpenAI** e utilize-a ao criar um armazenamento vetorial; em seguida,
selecione **Postgres (pgvector)** no menu suspenso Database do Nó RAG.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `openai_api_key` | Chave de API da OpenAI utilizada para gerar embeddings ao indexar e pesquisar documentos |
### Notas

- Não é necessário host/porta — os vetores são gravados no próprio banco de dados do Heym; o Heym nunca se conecta a um banco de dados diferente.
- Todos os recursos de RAG disponíveis com o Qdrant (inserção, busca, filtros de metadados, reranking do Cohere, clonagem, compartilhamento) funcionam de forma idêntica com o backend Postgres.
- Requer a extensão `vector`. O Heym mantém a imagem oficial `postgres:16` inalterada (de modo que os dados existentes nunca são afetados) e **instala automaticamente o pacote `postgresql-16-pgvector` na inicialização** — `run.sh`, `deploy.sh` e `run_e2e.sh` tratam isso. A instalação não é fatal: se não puder ser executada (por exemplo, sem rede), o RAG do Qdrant continua funcionando e o backend Postgres permanece inativo (a migração ignora a tabela de forma elegante).
- Se você executar a imagem publicada de contêiner único (`ghcr.io/heymrun/heym`) contra o **seu próprio Postgres externo**, esse banco de dados deverá suportar a extensão `vector` (o Heym não pode instalá-la em um banco de dados que não gerencia). Sem ela, criar ou enviar para um armazenamento vetorial Postgres retorna uma mensagem clara e o RAG do Qdrant continua funcionando.

### Utilizado por

- [Nó RAG](../nodes/rag-node.md) (via armazenamento vetorial)
- [Aba Vectorstores](../tabs/vectorstores-tab.md)

---

## Grist

O [Grist](https://www.getgrist.com) é um híbrido de planilha e banco de dados que suporta dados estruturados e fórmulas. A credencial do Grist permite que o Heym leia e grave documentos do Grist.

### Campos obrigatórios

| Campo | Descrição |
|-------|-----------|
| `api_key` | Chave de API do Grist (encontrada em **Profile → API Key** na sua instância do Grist) |
| `server_url` | URL base do seu servidor Grist (por exemplo, `https://docs.getgrist.com` para o Grist Cloud, ou a URL da sua instância auto-hospedada) |

### Notas

- O [Nó Grist](../nodes/grist-node.md) requer o **Document ID** (a partir da URL do documento Grist) e o **Table ID** na sua configuração — estes não fazem parte da credencial.
- Para o Grist auto-hospedado, defina `server_url` como o domínio da sua instância.
- Os IDs de coluna no Grist usam sublinhados (por exemplo, `User_Name`), não rótulos de exibição. Use a operação `listColumns` para descobri-los.

### Utilizado por

- [Nó Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

A credencial do Google Sheets conecta o Heym à API do Google Sheets usando um modelo OAuth2 "Bring Your Own App". Você fornece um Client ID e um Client Secret do OAuth2 do Google Cloud e, em seguida, autoriza o acesso por meio de um popup do navegador. Os tokens são atualizados automaticamente em segundo plano.

### Configuração

1. Abra o [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → pesquise e ative a **Google Sheets API**.
2. Acesse **Credentials** → **Create Credentials** → **OAuth client ID** → tipo de aplicação **Web application**.
3. Em **Authorized redirect URIs**, adicione: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Copie o **Client ID** e o **Client Secret** gerados.
5. No Heym Dashboard → **Credentials** → **New** → tipo **Google Sheets (OAuth2)**.
6. Insira o Client ID, o Client Secret e um nome e, em seguida, clique em **Connect** para abrir o popup de consentimento do Google e autorizar o acesso.

### Campos obrigatórios

| Campo | Descrição |
|-------|-----------|
| `client_id` | Client ID do OAuth2 do Google Cloud Console |
| `client_secret` | Client Secret do OAuth2 do Google Cloud Console |

Os tokens (`access_token`, `refresh_token`, `token_expiry`) são armazenados e atualizados automaticamente — você não os gerencia diretamente.

### Notas

- A tela de consentimento do OAuth2 requer o escopo de planilhas (`https://www.googleapis.com/auth/spreadsheets`).
- O Heym usa o refresh token para obter novos access tokens antes que expirem (margem de segurança de 60 segundos).
- Se você rotacionar o Client Secret no Google Cloud Console, reconecte a credencial por meio do botão **Connect**.
- **Produção:** Defina o **`FRONTEND_URL`** do backend como a URL pública exata que os usuários abrem no navegador (esquema + host, por exemplo, `https://heym.example.com`). O Heym constrói o URI de redirecionamento do OAuth do Google apenas a partir desse valor — ele **não** confia nos cabeçalhos `Origin` ou `X-Forwarded-*` (controlados pelo cliente). Registre `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` no Google Cloud Console.

### Utilizado por

- [Nó Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

A credencial do Google Drive conecta o Heym à API do Google Drive usando o mesmo modelo OAuth2 "Bring Your Own App" do Google Sheets. Você fornece um Client ID e um Client Secret do OAuth2 do Google Cloud e, em seguida, autoriza o acesso por meio de um popup do navegador. Os tokens são atualizados automaticamente em segundo plano.
### Configuração

1. Abra o [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → pesquise e ative a **Google Drive API**.
2. Acesse **Credentials** → **Create Credentials** → **OAuth client ID** → tipo de aplicação **Web application**.
3. Em **Authorized redirect URIs**, adicione: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Copie o **Client ID** e o **Client Secret** gerados.
5. No Heym Dashboard → **Credenciais** → **New** → tipo **Google Drive (OAuth2)**.
6. Insira o Client ID, o Client Secret e um nome; em seguida, clique em **Connect** para abrir o popup de consentimento do Google e autorizar o acesso.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `client_id` | OAuth2 Client ID do Google Cloud Console |
| `client_secret` | OAuth2 Client Secret do Google Cloud Console |

Os Tokens (`access_token`, `refresh_token`, `token_expiry`) são armazenados e atualizados automaticamente — você não os gerencia diretamente.

### Escopo

O Google Drive solicita o **escopo completo do Drive** (`https://www.googleapis.com/auth/drive`).

Isso é necessário porque o nó opera sobre arquivos que você já possui. O escopo mais restrito `drive.file` concede acesso apenas aos arquivos criados pelo próprio cliente OAuth, o que faria com que `listFolderFiles`, `updateFile`, `removeFile` e `removeFolder` não enxergassem nada do seu Drive existente.

Como você fornece o seu próprio Client ID e Secret do seu próprio projeto do Google Cloud, os requisitos de verificação de aplicativo do Google para esse escopo se aplicam ao seu projeto, e não ao Heym.

### Observações

- O Heym utiliza o refresh token para obter novos access tokens antes de expirarem (margem de segurança de 60 segundos).
- Caso rotacione o Client Secret no Google Cloud Console, reconecte a credencial por meio do botão **Connect**.
- Drives compartilhados são suportados — o nó define `supportsAllDrives` em todas as chamadas à API.
- **Produção:** Defina o **`FRONTEND_URL`** do backend como a URL pública exata que os usuários abrem no navegador. O Heym constrói o URI de redirecionamento do Google OAuth exclusivamente a partir desse valor — ele **não** confia nos cabeçalhos `Origin` ou `X-Forwarded-*`. Registre `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` no Google Cloud Console.
- Consulte [Credential Sharing](./credentials-sharing.md) antes de compartilhar esta credencial com uma equipe.

### Utilizado Por

- [Nó Google Drive](../nodes/google-drive-node.md)

---

## BigQuery (OAuth2)

A credencial BigQuery conecta o Heym à API do Google BigQuery usando um modelo OAuth2 "Bring Your Own App". Você fornece um Client ID e um Client Secret OAuth2 do Google Cloud e, em seguida, autoriza o acesso por meio de um popup no navegador. Os Tokens são atualizados automaticamente em segundo plano.

### Configuração

1. Abra o [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → pesquise e ative a **BigQuery API**.
2. Acesse **Credentials** → **Create Credentials** → **OAuth client ID** → tipo de aplicação **Web application**.
3. Em **Authorized redirect URIs**, adicione: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Copie o **Client ID** e o **Client Secret** gerados.
5. No Heym Dashboard → **Credenciais** → **New** → tipo **BigQuery (OAuth2)**.
6. Insira o Client ID, o Client Secret e um nome; em seguida, clique em **Connect** para abrir o popup de consentimento do Google e autorizar o acesso.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `client_id` | OAuth2 Client ID do Google Cloud Console |
| `client_secret` | OAuth2 Client Secret do Google Cloud Console |

Os Tokens (`access_token`, `refresh_token`, `token_expiry`) são armazenados e atualizados automaticamente.

### Observações

- A tela de consentimento OAuth2 exige o escopo do BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Produção:** Defina o **`FRONTEND_URL`** do backend como a URL pública. Registre `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` no Google Cloud Console.

### Utilizado Por

- [Nó BigQuery](../nodes/bigquery-node.md)

---

## Supabase

A credencial Supabase conecta o Heym à API PostgREST de um projeto Supabase, permitindo que os workflows consultem e modifiquem tabelas com backend em Postgres.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `supabase_url` | URL base do projeto, por exemplo `https://your-project.supabase.co` |
| `supabase_key` | Chave de API com acesso às tabelas de destino |
| `supabase_schema` | Esquema padrão opcional (o padrão é `public`) |

### Observações

- O [Nó Supabase](../nodes/supabase-node.md) comunica-se com `/rest/v1/<table>` e oferece suporte a filtros de operadores (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` e operadores PostgREST relacionados), além de grupos lógicos aninhados `or` / `and`.
- Para operações de escrita, prefira uma chave destinada ao uso confiável no lado do servidor, com as permissões mínimas necessárias nas tabelas.
- Os nós podem substituir o esquema por etapa, mesmo que a credencial defina um esquema padrão.

### Utilizado Por

- [Nó Supabase](../nodes/supabase-node.md)
## ClickHouse

A credencial ClickHouse conecta o Heym a um banco de dados ClickHouse externo por meio de sua interface HTTP, permitindo que os workflows executem operações SQL, CRUD e de contagem em tabelas OLAP.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-----------|
| `host` | Host HTTP sem esquema, por exemplo `your-instance.clickhouse.cloud` |
| `port` | Porta da interface HTTP (`8443` para HTTPS, `8123` para HTTP) |
| `username` | Usuário do ClickHouse (padrão: `default`) |
| `password` | Senha do usuário (opcional) |
| `database` | Banco de dados de destino (padrão: `default`) |
| `secure` | Utilizar HTTPS quando `true` (obrigatório para o ClickHouse Cloud) |

### Observações

- O [Nó ClickHouse](../nodes/clickhouse-node.md) utiliza o cliente HTTP oficial `clickhouse-connect` e parametriza as vinculações de filtros e valores.
- `update` e `remove` mapeiam para `ALTER TABLE ... UPDATE` e `DELETE FROM`, que são mutações assíncronas do ClickHouse; ambos exigem um filtro.
- `upsert` executa um `INSERT` e pressupõe uma tabela `ReplacingMergeTree` para o comportamento de merge-on-key.
- Utilize **Test connection** no diálogo de credencial para verificar a acessibilidade.

### Utilizada Por

- [Nó ClickHouse](../nodes/clickhouse-node.md)

## Notion

A credencial Notion oferece suporte tanto a um token de integração interna quanto a uma conexão OAuth de integração pública. O OAuth permite que cada usuário autorize um workspace do Notion a partir do Heym, em vez de copiar manualmente um token.

### Campos Obrigatórios

| Modo | Campo | Descrição |
|------|-------|-----------|
| Token interno | `api_token` | Token de integração interna (`ntn_...`) |
| OAuth | `client_id` | Client ID de uma integração pública do Notion |
| OAuth | `client_secret` | Client Secret da integração pública do Notion |

O callback OAuth armazena automaticamente `access_token`, `auth_mode`, `workspace_id`, `workspace_name` e `bot_id`. Qualquer `api_token` interno anterior é removido quando o OAuth é concluído. Registre este URI de redirecionamento no Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Fluxo de configuração do OAuth

1. Escolha **OAuth** no diálogo de credencial, insira um nome, o Client ID e o Client Secret.
2. Clique em **Connect** e autorize o workspace no popup do Notion.
   - Para uma credencial **nova**, o Heym cria o registro da credencial quando você clica em **Connect**.
   - Conclua a autorização no popup e, em seguida, clique em **Save** para retornar à lista de credenciais.
3. Uma credencial conectada exibe `connected (Workspace Name)` na lista. Credenciais OAuth pendentes exibem `Not connected` até que a autorização seja concluída.

Utilize **Test Connection** no diálogo de credencial para verificar tanto um token interno quanto uma autorização OAuth concluída. Ao editar, deixar o campo de token em branco preserva o token interno armazenado.

Tanto os tokens internos quanto os tokens de acesso OAuth estão disponíveis por meio de `$credentials.CredentialName` para chamadas [HTTP](../nodes/http-node.md) personalizadas que necessitem de um bearer token do Notion.

### Observações

- As integrações internas exigem que as páginas, os bancos de dados e as fontes de dados relevantes sejam compartilhados.
- Os usuários de OAuth escolhem o workspace/páginas durante a autorização do Notion.
- As credenciais da aplicação OAuth são criptografadas dentro da credencial Notion. O callback as recarrega no lado do servidor; o secret não é incorporado ao estado do OAuth.
- Credenciais OAuth conectadas exibem o nome do workspace; credenciais OAuth pendentes exibem `Not connected` até que a autorização seja concluída.
- **Produção:** Defina o **`FRONTEND_URL`** do backend como a URL pública do navegador (esquema + host, sem barra final). O URI de redirecionamento do Notion deve corresponder exatamente:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- O nó utiliza a versão de API `2026-03-11` e a terminologia atual de `data_source`. Consulte o artigo do [Nó Notion](../nodes/notion-node.md#api-version-notes) para orientações de migração a partir de exemplos mais antigos de `archived`, `after` ou consultas a bancos de dados.
- Filtros de pesquisa antigos com valor de objeto `database` são normalizados para `data_source`.

### Utilizada Por

- [Nó Notion](../nodes/notion-node.md)

---

## SMTP (Email)

A credencial SMTP armazena os detalhes de conexão do servidor de email para o envio de mensagens.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-----------|
| `host` | Nome do host do servidor SMTP (ex.: `smtp.gmail.com`) |
| `port` | Porta SMTP (normalmente `587` para STARTTLS, `465` para SSL) |
| `email` | Endereço de email do remetente |
| `password` | Senha SMTP ou App Password |

### Provedores SMTP Comuns

| Provedor | Host | Porta | Observações |
|----------|------|-------|-------------|
| Gmail | `smtp.gmail.com` | `587` | Requer uma [App Password](https://support.google.com/accounts/answer/185833) (a verificação em duas etapas deve estar ativada) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Utilize as credenciais da sua conta Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Utilize as credenciais SMTP do Mailgun obtidas nas configurações do seu domínio |
| SendGrid | `smtp.sendgrid.net` | `587` | Utilize `apikey` como nome de usuário e uma API key como senha |
| Personalizado / Auto-hospedado | seu domínio | `587` / `465` | Postfix, Exim, etc. |
### Notas

- O Gmail exige uma **App Password** em vez da sua senha normal quando a Verificação em Duas Etapas está ativada.
- A porta `587` utiliza STARTTLS (inicia em texto simples, atualiza para TLS). A porta `465` utiliza TLS implícito (SSL desde o início).

### Utilizado Por

- [Nó Send Email](../nodes/send-email-node.md)

---

## IMAP (E-mail de Entrada)

A credencial IMAP armazena os detalhes de conexão para monitorizar uma caixa de correio com o [Nó IMAP Trigger](../nodes/imap-trigger-node.md).

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `imap_host` | Nome do host do servidor IMAP (por exemplo `imap.gmail.com`) |
| `imap_port` | Porta IMAP (`993` para SSL/TLS na maioria dos fornecedores) |
| `imap_username` | Nome de utilizador da caixa de correio ou endereço de e-mail completo |
| `imap_password` | Senha ou app password específica do fornecedor |

### Campos Opcionais

| Campo | Descrição |
|-------|-------------|
| `imap_mailbox` | Pasta da caixa de correio a monitorizar (predefinição: `INBOX`) |
| `imap_use_ssl` | Ativar SSL/TLS (recomendado; predefinição: `true`) |

### Notas

- O IMAP trigger estabelece a linha de base da caixa de correio atual na primeira consulta e, em seguida, processa apenas e-mails mais recentes.
- O Gmail, o Microsoft 365 e outros fornecedores alojados exigem frequentemente uma **app password** ou um segredo específico de IMAP semelhante.
- O conteúdo dos anexos não é transferido para o payload do workflow; o Heym expõe apenas os metadados dos anexos.

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
| `rabbitmq_username` | Nome de utilizador do RabbitMQ (predefinição: `guest`) |
| `rabbitmq_password` | Senha do RabbitMQ (predefinição: `guest`) |

### Virtual Hosts

Para se conectar a um virtual host específico, inclua-o no URL `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Se utilizar o vhost predefinido, o caminho `/` pode ser omitido.

### Plugin de Mensagens Atrasadas

O [Nó RabbitMQ](../nodes/rabbitmq-node.md) suporta o plugin **rabbitmq_delayed_message_exchange**. Quando este plugin está ativado no seu servidor RabbitMQ, pode definir um atraso (em milissegundos) nas mensagens de saída utilizando o campo `rabbitmqDelayMs` no nó.

O nó define o cabeçalho `x-delay` na mensagem publicada. O tipo de exchange deve ser `x-delayed-message` para que os atrasos tenham efeito.

Para ativar o plugin numa instância RabbitMQ auto-alojada:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Quando o plugin não está instalado, o cabeçalho `x-delay` é ignorado e as mensagens são entregues imediatamente.

### Utilizado Por

- [Nó RabbitMQ](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ como trigger de workflow)

---

## Amazon S3

A credencial Amazon S3 conecta o Heym ao [Amazon S3](https://aws.amazon.com/s3/). Utilize-a com o [Nó Amazon S3](../nodes/amazon-s3-node.md) para gerir buckets e pastas, carregar e transferir objetos, copiar chaves e listar ou eliminar objetos a partir de workflows.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `aws_access_key_id` | ID da chave de acesso AWS IAM |
| `aws_secret_access_key` | Chave de acesso secreta associada ao ID da chave de acesso |
| `aws_region` | Região AWS onde os buckets residem (ex.: `us-east-1`) |

### Campos Opcionais

| Campo | Descrição |
|-------|-------------|
| `aws_session_token` | Token de sessão temporário ao utilizar credenciais AWS STS |

### Notas

- A credencial utiliza autenticação AWS SigV4 padrão através do boto3.
- As operações de carregamento enviam atualmente conteúdo de texto UTF-8; as transferências podem devolver texto ou base64 para objetos binários.

### Utilizado Por

- [Nó Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

O [Redis](https://redis.io) é um armazenamento de chave-valor em memória utilizado para caching e acesso rápido a dados.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `host` | Nome do host ou IP do servidor Redis (ex.: `localhost`) |
| `port` | Porta Redis (predefinição: `6379`) |
| `password` | Senha do Redis (deixe vazio se não estiver definida) |

### Utilizado Por

- [Nó Redis](../nodes/redis-node.md)

---

## Slack

A credencial Slack armazena um **Incoming Webhook URL** para publicar mensagens em canais do Slack.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (a partir da configuração da sua aplicação Slack) |

### Notas

- Crie um Incoming Webhook em [api.slack.com/apps](https://api.slack.com/apps) → a sua aplicação → **Incoming Webhooks**.
- Cada webhook está limitado a um canal específico. Crie múltiplas credenciais para canais diferentes.

### Utilizado Por

- [Nó Slack](../nodes/slack-node.md)

---

## Telegram

A credencial Telegram armazena um **Bot Token** e um **Webhook Secret Token** opcional para workflows baseados em bots.
### Campos Obrigatórios

| Campo | Descrição |
|-------|-----------|
| `bot_token` | Token da API do Telegram Bot obtido junto ao BotFather |

### Campos Opcionais

| Campo | Descrição |
|-------|-----------|
| `secret_token` | Segredo compartilhado verificado em relação ao cabeçalho `x-telegram-bot-api-secret-token` nos webhooks recebidos |

### Observações

- Utilize a mesma credencial tanto para o [Telegram Trigger](../nodes/telegram-trigger-node.md) quanto para o [Telegram](../nodes/telegram-node.md).
- Registre o webhook manualmente por meio da API `setWebhook` do Telegram, utilizando a URL exibida no painel do nó Telegram Trigger.
- O `chatId` no nó Telegram pode ser um ID literal ou uma expressão como `$telegramEvent.message.chat.id`.

### Utilizado Por

- [Nó Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Nó Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer e Header)

Estas credenciais são utilizadas pelo [Nó HTTP](../nodes/http-node.md) para autenticar requisições de saída.

### Bearer

Anexa um cabeçalho `Authorization: Bearer <token>` às requisições HTTP.

| Campo | Descrição |
|-------|-----------|
| `token` | O valor do token bearer |

### Header

Anexa um cabeçalho personalizado às requisições HTTP.

| Campo | Descrição |
|-------|-----------|
| `header_key` | Nome do cabeçalho (ex.: `X-Api-Key`) |
| `header_value` | Valor do cabeçalho |

Ambos os tipos também podem ser referenciados por meio de `$credentials.CredentialName` na [Expression DSL](./expression-dsl.md) para uso dinâmico em qualquer nó que aceite expressões.

### Utilizado Por

- [Nó HTTP](../nodes/http-node.md)

---

## Provedores de LLM (OpenAI, Google, Custom, Cohere)

Estas credenciais alimentam os nós de IA.

| Tipo | Descrição |
|------|-----------|
| **OpenAI** | Chave de API para modelos GPT e embeddings da OpenAI |
| **Google** | Chave de API para modelos Gemini |
| **Custom** | Chave de API + URL base para endpoints compatíveis com OpenAI (Ollama, vLLM, LM Studio, etc.) |
| **Cohere** | Chave de API para embeddings da Cohere |

### Cache de Prompt da OpenAI

A OpenAI armazena automaticamente em cache o prefixo estático (inalterado) do seu prompt de sistema — nenhuma configuração adicional é necessária. Execuções repetidas do workflow que compartilham o mesmo prefixo de prompt de sistema se beneficiam do preço de tokens em cache, o que reduz tanto o custo quanto a latência. Isso é especialmente útil quando você possui instruções longas e fixas e apenas a mensagem do usuário muda entre as execuções. Monitore as taxas de acerto do cache e a economia de tokens na [aba Execuções](../tabs/traces-tab.md) ou no painel de uso da OpenAI para otimizar a estrutura do seu prompt e maximizar a reutilização do cache.

### Utilizado Por

- [Nó LLM](../nodes/llm-node.md)
- [Nó Agent](../nodes/agent-node.md)
- [Nó RAG](../nodes/rag-node.md) (embeddings da OpenAI via credencial Qdrant)

---

## FlareSolverr

O [FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) é um servidor proxy para contornar o Cloudflare e desafios semelhantes de proteção contra bots.

### Campos Obrigatórios

| Campo | Descrição |
|-------|-----------|
| `flaresolverr_url` | URL da sua instância do FlareSolverr (ex.: `http://localhost:8191`) |

Endereços de loopback e privados são suportados aqui, portanto executar o FlareSolverr ao lado do Heym funciona conforme documentado. A URL não pode resolver para um endereço link-local ou de metadados de nuvem. Como endereços privados são permitidos, este campo também pode apontar para outro serviço interno, e a resposta retorna na saída do nó. Qualquer usuário autenticado pode criar esta credencial, portanto o limite é quem pode criar workflows, somado às suas regras de rede, e não o compartilhamento de credenciais. Consulte [Segurança de Egress](../nodes/crawler-node.md#egress-safety).

### Utilizado Por

- [Nó Crawler](../nodes/crawler-node.md)

---

## Relacionados

- [Credenciais](./credentials.md) – Visão geral das credenciais e de como os nós as utilizam
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicione e gerencie credenciais
- [Compartilhamento de Credenciais](./credentials-sharing.md) – Compartilhe credenciais com usuários e equipes
- [Segurança](./security.md) – Criptografia em repouso, controle de acesso
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

- `routing_instructions` – como ponderar as opções de modo geral.
- Uma opção pode ser marcada como o fallback utilizado quando o roteamento falha.

### Observações

Os nomes das opções são aquilo entre o que o modelo de decisão escolhe, portanto devem ser distintos. Uma
opção não pode apontar para outro Model Router.
