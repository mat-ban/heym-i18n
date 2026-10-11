# Compartilhamento de Credenciais

As credenciais podem ser compartilhadas com outros usuários para que os workflows deles possam usar as suas chaves de API. Consulte [Credenciais](./credentials.md) para uma visão geral e [Aba Credenciais](../tabs/credentials-tab.md) para adicionar e gerenciar credenciais.

## Compartilhamento de Credenciais com um LLM

Para permitir que um LLM ou um agente de IA use uma chave de API, armazene a chave como uma credencial e deixe que o nó que faz a requisição a anexe. O modelo decide o que chamar; o nó autentica a chamada quando é executado.

- **Armazene o segredo como uma credencial.** Valores sensíveis são criptografados em repouso e mascarados na UI após a criação.
- **Referencie-a onde a requisição é feita.** Os nós [LLM](../nodes/llm-node.md) e [Agent](../nodes/agent-node.md) selecionam sua credencial de modelo por ID, e as requisições HTTP colocam `$credentials.CredentialName` no cabeçalho de autenticação. Mantenha os segredos fora dos campos de prompt, pois tudo em um prompt é enviado ao provedor do modelo como texto.
- **Forneça ferramentas ao agente, não chaves.** Quando um Agent chama um nó HTTP, um servidor MCP ou um sub-workflow como ferramenta, a credencial é aplicada dentro dessa ferramenta e o modelo recebe o resultado da ferramenta.
- **As saídas são mascaradas.** Quando um valor de credencial com mais de sete caracteres aparece na saída de um nó, apenas os seus primeiros sete caracteres são mantidos, de modo que uma resposta que ecoa uma chave exibe apenas esse prefixo nos resultados e nas execuções. Consulte [Mascaramento de Saída](#output-masking).
- **Deixe o assistente criar credenciais.** Quando o [Assistente de IA](./ai-assistant.md#credentials) ou a aba Chat cria uma credencial, ele vê apenas o nome e o tipo, e você insere o segredo no formulário regular de credencial.
- **Compartilhe com pessoas da mesma forma.** Compartilhe a credencial com um usuário ou uma equipe, conforme descrito abaixo, e os workflows deles poderão usar a sua chave por meio dos próprios nós LLM e Agent.

## Modelo de Compartilhamento

- **CredentialShare** – Vincula `credential_id` a `user_id` (único por par)
- **Compartilhar por e-mail** – `POST /api/credentials/{credential_id}/shares` com e-mail; o usuário é localizado e adicionado
- **Revogar** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Você também pode compartilhar credenciais com [Equipes](./teams.md):

- **CredentialTeamShare** – Vincula `credential_id` a `team_id`; todos os membros da equipe ganham acesso
- **Compartilhar com equipe** – `POST /api/credentials/{credential_id}/team-shares` com `team_id`
- **Revogar compartilhamento com equipe** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

As credenciais compartilhadas exibem um indicador na UI da [Aba Credenciais](../tabs/credentials-tab.md).

## Credenciais de Escopo Amplo

Compartilhar uma credencial concede ao destinatário tudo o que essa credencial pode fazer. Para a maioria das integrações, isso está limitado a um workspace ou às permissões de uma chave de API, mas algumas credenciais são muito mais amplas.

> **As credenciais do Google Drive concedem acesso total ao Drive.** A credencial do [Google Drive](../nodes/google-drive-node.md) é autorizada com o escopo `https://www.googleapis.com/auth/drive` para que o nó possa operar sobre arquivos que você já possui. Compartilhá-la com um usuário ou uma equipe concede a cada um deles a capacidade de **ler, modificar e excluir permanentemente qualquer coisa no seu Google Drive** por meio de um workflow — não apenas os arquivos que você tinha em mente. Compartilhe-a apenas com pessoas às quais você concederia acesso total ao Drive diretamente.

Se você precisar limitar a exposição, crie uma conta dedicada do Google com acesso apenas às pastas de que o workflow necessita e conecte a credencial com essa conta em vez da sua conta principal.

Uma credencial de **Decision Model** carrega o endpoint e, quando definida, uma chave de API. Compartilhá-la permite que o destinatário consuma essa chave a partir de qualquer workflow que ele possa executar, exatamente como uma credencial de LLM.

Uma credencial de **Model Router** compartilha tudo para o que ela roteia. As pessoas com quem você a compartilha podem executar requisições contra todas as credenciais em sua lista de opções, e essas requisições consomem as suas chaves. Elas não podem ler as chaves, e as credenciais não aparecem na lista de credenciais delas.

Esta é a mesma concessão que compartilhar uma credencial da OpenAI diretamente, e é o que torna um router útil para uma equipe. Se você não deseja isso, compartilhe as credenciais individuais e deixe que cada pessoa escolha um modelo.

## Compartilhamento com Colaboradores de Workflow

Quando você compartilha um workflow, os colaboradores podem abri-lo e executá-lo, mas não podem usar as suas credenciais, a menos que você compartilhe essas credenciais com eles também. Isso se aplica às credenciais no workflow principal e em quaisquer sub-workflows que ele chame. Compartilhe cada credencial com os mesmos usuários ou equipes que você convidou para o workflow. Os sub-workflows também devem ser compartilhados separadamente a partir do editor do workflow filho. Consulte [Organização de Workflows](./workflow-organization.md#sharing-workflows).
## Contexto de Execução

Quando um workflow é executado, as credenciais são resolvidas para o **proprietário do workflow** (ou o usuário atual no momento da execução). `get_credentials_context()` mescla:

1. **Credenciais próprias** – `Credential.owner_id == user_id`
2. **Credenciais compartilhadas com o usuário** – `CredentialShare` onde `CredentialShare.user_id == user_id`
3. **Credenciais compartilhadas com a equipe** – `CredentialTeamShare` onde o usuário é membro da equipe

Todas são mescladas em um único dict de contexto indexado pelo nome da credencial.

## Uso em Workflows

### Por Nome (Expression DSL)

As credenciais são expostas como `$credentials.CredentialName` na [Expression DSL](./expression-dsl.md). Utilize esta forma para:

- Nós HTTP (autenticação Bearer/Header)
- Nós Telegram
- Nós Slack
- Tokens bearer do Notion em requisições HTTP personalizadas (token interno ou token de acesso OAuth)
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
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Credencial do token de acesso do Codex e credencial do GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Credencial do gateway OpenCode Go e credencial do GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Credencial de e-mail/token de API do Jira Cloud ou de usuário/senha do Data Center |
| [Notion](../nodes/notion-node.md) | `credentialId` | Credencial de token interno do Notion ou de workspace OAuth |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Token de autenticação do Sentry e URL base opcional |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL do projeto Supabase e chave de API |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Detalhes de conexão do ClickHouse (host, porta, autenticação, banco de dados) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Credencial do bot do Telegram |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Credencial de chave pública ou webhook do Discord |
| Vector Store | `credential_id` | Banco de dados vetorial Qdrant ou Postgres (pgvector), por meio de uma credencial RAG do Qdrant, Psql ou Custom Embeddings |
| Evals | `credential_id`, `judge_credential_id` | Credencial de modelo; uma credencial de modelo ou de Decision Model para o juiz LLM-as-Judge |
| [Playwright](../nodes/playwright-node.md) etapa de IA | `credentialId` | Modelo LLM/Vision (para a etapa de IA e o [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

O executor carrega a credencial diretamente do banco de dados por ID e descriptografa a configuração.

## Mascaramento de Saída

Após a execução, `mask_sensitive_output()` mascara os valores das credenciais nas saídas, mantendo os primeiros sete caracteres de cada segredo com mais de sete caracteres e substituindo o restante por `**`, de modo que os segredos não sejam expostos em resultados ou execuções.

## Relacionados

- [Aba Credenciais](../tabs/credentials-tab.md) – Adicione e compartilhe credenciais
- [Integrações de Terceiros](./integrations.md) – Configuração detalhada para cada tipo de credencial
- [Equipes](./teams.md) – Compartilhe com equipes
- [Expression DSL](./expression-dsl.md) – Sintaxe `$credentials`
- [Tipos de Nó](./node-types.md) – Nós que utilizam credenciais ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Nó Agent](../nodes/agent-node.md) – Utiliza `credentialId` para o LLM
