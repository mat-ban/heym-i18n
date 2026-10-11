# Compartilhamento de Credenciais

Credentials podem ser compartilhadas com outros usuários para que seus workflows possam utilizar suas chaves de API. Consulte [Credentials](./credentials.md) para uma visão geral e [Credentials Tab](../tabs/credentials-tab.md) para adicionar e gerenciar credentials.

## Compartilhando Credentials com um LLM

Para permitir que um LLM ou um agente de IA utilize uma chave de API, armazene a chave como uma credential e deixe que o nó que faz a requisição a anexe. O modelo decide o que chamar; o nó autentica a chamada quando é executado.

- **Armazene o segredo como uma credential.** Valores sensíveis são criptografados em repouso e mascarados na interface após a criação.
- **Referencie-a onde a requisição é feita.** Os nós [LLM](../nodes/llm-node.md) e [Agent](../nodes/agent-node.md) selecionam sua credential de modelo por ID, e requisições HTTP colocam `$credentials.CredentialName` no cabeçalho de autenticação. Mantenha segredos fora dos campos de prompt, pois tudo em um prompt é enviado ao provedor do modelo como texto.
- **Forneça ferramentas ao agente, não chaves.** Quando um Agent chama um nó HTTP, um servidor MCP ou um sub-workflow como ferramenta, a credential é aplicada dentro dessa ferramenta e o modelo recebe o resultado da ferramenta.
- **As saídas são mascaradas.** Quando um valor de credential com mais de sete caracteres aparece na saída de um nó, apenas seus primeiros sete caracteres são mantidos, de modo que uma resposta que ecoa uma chave exibe apenas esse prefixo nos resultados e traces. Consulte [Output Masking](#output-masking).
- **Deixe o assistente criar credentials.** Quando o [AI Assistant](./ai-assistant.md#credentials) ou a aba Chat cria uma credential, ele vê apenas o nome e o tipo, e você insere o segredo no formulário regular de credential.
- **Compartilhe com pessoas da mesma forma.** Compartilhe a credential com um usuário ou uma equipe, conforme descrito abaixo, e seus workflows poderão usar sua chave por meio de seus próprios nós LLM e Agent.

## Modelo de Compartilhamento

- **CredentialShare** – Vincula `credential_id` a `user_id` (único por par)
- **Compartilhar por e-mail** – `POST /api/credentials/{credential_id}/shares` com e-mail; o usuário é localizado e adicionado
- **Revogar** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Você também pode compartilhar credentials com [Teams](./teams.md):

- **CredentialTeamShare** – Vincula `credential_id` a `team_id`; todos os membros da equipe ganham acesso
- **Compartilhar com equipe** – `POST /api/credentials/{credential_id}/team-shares` com `team_id`
- **Revogar compartilhamento com equipe** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Credentials compartilhadas exibem um indicador na interface da [Credentials Tab](../tabs/credentials-tab.md).

## Credentials de Escopo Amplo

Compartilhar uma credential concede ao destinatário tudo o que essa credential pode fazer. Para a maioria das integrações, isso está limitado a um workspace ou às permissões de uma chave de API, mas algumas credentials são muito mais amplas.

> **Credentials do Google Drive concedem acesso total ao Drive.** A credential do [Google Drive](../nodes/google-drive-node.md) é autorizada com o escopo `https://www.googleapis.com/auth/drive` para que o nó possa operar sobre arquivos que você já possui. Compartilhá-la com um usuário ou uma equipe concede a cada um deles a capacidade de **ler, modificar e excluir permanentemente qualquer coisa em seu Google Drive** por meio de um workflow — não apenas os arquivos que você tinha em mente. Compartilhe-a apenas com pessoas às quais você concederia acesso total ao Drive diretamente.

Se você precisar limitar a exposição, crie uma conta Google dedicada com acesso apenas às pastas de que o workflow necessita e conecte a credential com essa conta em vez da sua conta principal.

Uma credential de **Decision Model** carrega o endpoint e, quando definida, uma chave de API. Compartilhá-la permite que o destinatário consuma essa chave a partir de qualquer workflow que ele possa executar, exatamente como uma credential de LLM.

Uma credential de **Model Router** compartilha tudo para o que ela roteia. As pessoas com quem você a compartilha podem executar requisições contra todas as credentials em sua lista de opções, e essas requisições consomem suas chaves. Elas não podem ler as chaves, e as credentials não aparecem em sua própria lista de credentials.

Esta é a mesma concessão que compartilhar uma credential da OpenAI diretamente, e é o que torna um router útil para uma equipe. Se você não deseja isso, compartilhe as credentials individuais e deixe cada pessoa escolher um modelo.

## Compartilhando com Colaboradores de Workflow

Quando você compartilha um workflow, os colaboradores podem abri-lo e executá-lo, mas não podem usar suas credentials a menos que você compartilhe essas credentials com eles também. Isso se aplica às credentials no workflow principal e em quaisquer sub-workflows que ele chame. Compartilhe cada credential com os mesmos usuários ou equipes que você convidou para o workflow. Os sub-workflows também devem ser compartilhados separadamente a partir do editor do workflow filho. Consulte [Workflow Organization](./workflow-organization.md#sharing-workflows).

## Contexto de Execução

Quando um workflow é executado, as credentials são resolvidas para o **proprietário do workflow** (ou usuário atual no momento da execução). `get_credentials_context()` mescla:

1. **Credentials próprias** – `Credential.owner_id == user_id`
2. **Credentials compartilhadas com o usuário** – `CredentialShare` onde `CredentialShare.user_id == user_id`
3. **Credentials compartilhadas com a equipe** – `CredentialTeamShare` onde o usuário é membro da equipe

Todas são mescladas em um único dict de contexto indexado pelo nome da credential.

## Uso em Workflows
### Por Nome (Expression DSL)

As credenciais são expostas como `$credentials.CredentialName` na [Expression DSL](./expression-dsl.md). Utilize isto para:

- Nós HTTP (autenticação Bearer/Header)
- Nós do Telegram
- Nós do Slack
- Tokens bearer do Notion em requisições HTTP personalizadas (token interno ou access token OAuth)
- Qualquer nó que aceite expressões para autenticação

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Por ID (credentialId)

Alguns nós armazenam `credentialId` (UUID) em `node.data`:

| Tipo de Nó | Campo | Descrição |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Credencial da API do LLM |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Credencial do access token do Codex e credencial do GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Credencial do gateway do OpenCode Go e credencial do GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Credencial de e-mail/API token do Jira Cloud ou de usuário/senha do Data Center |
| [Notion](../nodes/notion-node.md) | `credentialId` | Token interno do Notion ou credencial de workspace OAuth |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Auth token do Sentry e base URL opcional |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL do projeto Supabase e API key |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Detalhes de conexão do ClickHouse (host, port, auth, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Credencial do bot do Telegram |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Credencial de chave pública ou webhook do Discord |
| Vector Store | `credential_id` | Banco de dados vetorial Qdrant ou Postgres (pgvector), por meio de uma credencial RAG do Qdrant, Psql ou Custom Embeddings |
| Evals | `credential_id`, `judge_credential_id` | Credencial de modelo; uma credencial de modelo ou Decision Model para o juiz LLM-as-Judge |
| [Playwright](../nodes/playwright-node.md) etapa de IA | `credentialId` | Modelo LLM/Vision (para etapa de IA e [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

O executor carrega a credencial diretamente do banco de dados por ID e descriptografa a configuração.

## Mascaramento de Saída

Após a execução, `mask_sensitive_output()` mascara os valores das credenciais nas saídas, mantendo os primeiros sete caracteres de cada segredo com mais de sete caracteres e substituindo o restante por `**`, para que os segredos não sejam expostos em resultados ou traces.

## Relacionados

- [Aba Credentials](../tabs/credentials-tab.md) – Adicionar e compartilhar credenciais
- [Integrações de Terceiros](./integrations.md) – Configuração detalhada para cada tipo de credencial
- [Teams](./teams.md) – Compartilhar com equipes
- [Expression DSL](./expression-dsl.md) – Sintaxe `$credentials`
- [Tipos de Nó](./node-types.md) – Nós que utilizam credenciais ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Nó Agent](../nodes/agent-node.md) – Utiliza `credentialId` para LLM
