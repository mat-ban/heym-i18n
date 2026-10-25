# Nó GitHub

O nó **GitHub** adiciona operações nativas da REST API do GitHub a um workflow, de forma semelhante aos nós GitHub de múltiplas operações que você pode conhecer de ferramentas como o n8n.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | GitHub |
| Saída | `$nodeLabel.*` |

## Operações suportadas

O nó atualmente disponibiliza 40 ações:

| Recurso | Ações |
|----------|---------|
| Repositório | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organização / Usuário | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| Arquivo | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Credencial

Crie uma credencial **GitHub** na [Aba Credenciais](../tabs/credentials-tab.md) com:

- Um personal access token
- URL base completa opcional da REST API para o GitHub Enterprise Server

Deixe a URL base vazia para o GitHub.com. Recomenda-se o uso de PATs de granularidade fina.

Para o GitHub Enterprise Server, insira o endpoint completo da REST API, incluindo `/api/v3`, como
`https://github.example.com/api/v3`. Não insira apenas a raiz da interface web
(`https://github.example.com`).

Se você utiliza o GitHub Enterprise Server e posteriormente editar a credencial para rotacionar o token, deixar
`base_url` vazio preserva o endpoint Enterprise existente. Insira uma nova URL apenas quando desejar
alterar esse endpoint.

## Campos comuns

A maioria das operações utiliza:

- **Owner** – Proprietário do repositório, nome da organização ou nome de usuário
- **Repository** – Nome do repositório

`List Organization Repositories` requer apenas **Owner** (o nome da organização) e não utiliza o campo de repositório.

`List User Repositories` requer apenas **Owner** (o nome de usuário) e não utiliza o campo de repositório.

`Get User Repositories` espelha a ação User → Get Repositories do n8n. `Get User Issues` retorna
issues atribuídas ao usuário autenticado do GitHub por padrão. Defina **Mentioned Filter** com qualquer
valor não vazio para retornar issues que mencionam o usuário autenticado. Também suporta
filtros de state, labels, updated-since, sort, direction e per-page. `Invite User` requer uma
organização e um endereço de e-mail e não utiliza Owner nem Repository.

## Repositório

As operações de repositório incluem metadados, conteúdo de licença detectado, perfil de integridade da comunidade e
insights de tráfego. `List Popular Paths for Repository` e
`List Top Referrers for Repository` retornam as principais entradas de tráfego do GitHub dos últimos 14 dias e
requerem acesso de push de administração do repositório.

`List Issues` suporta filtros opcionais de assignee, creator, mentioned user, labels separadas por vírgula,
timestamp updated-since, sort e direction. `List Pull Requests` suporta controles de state, sort,
direction e per-page.

`Get Repository Issues` e `Get Repository Pull Requests` expõem as mesmas APIs que suas
contrapartes List, sob nomes explícitos de ações de repositório compatíveis com o n8n.

### Obter metadados do repositório

`Get Repository` armazena a resposta completa do GitHub em `$github.repository` e também expõe
`$github.full_name`, `$github.default_branch`, `$github.private` e `$github.url`.

O payload do repositório comumente inclui:

- Identidade e propriedade: ID, nome, nome completo, descrição, owner e visibilidade
- Estado do repositório: private, fork, archived, disabled e default branch
- URLs: página do GitHub, API, clone, SSH e URLs Git
- Atividade e tamanho: timestamps de criação, atualização e push, tamanho, stars, watchers, forks, subscribers e issues abertas
- Recursos: issues, projects, wiki, Pages, discussions, topics, language e homepage
- Licença, configurações de merge, permissões do chamador, configurações de segurança e metadados de fork parent/source quando disponíveis

Alguns campos administrativos, de permissão, de merge e de segurança dependem das permissões de repositório
da credencial.

Exemplo:

- Owner: `heymrun`
- Repository: `heym`

## Issues

As operações de issue suportam campos de título/corpo e campos opcionais de array JSON para labels e assignees.

`List Issues` retorna apenas issues do repositório. Pull requests são excluídos; utilize `List Pull Requests` para resultados de PR.

```json
["bug", "backend"]
```

```json
["octocat"]
```
### Semântica dos campos de Edit Issue

Para `Edit Issue`, apenas os campos definidos explicitamente são enviados ao GitHub:

- **State** – Escolha `Don't change`, `Open` ou `Closed`. Deixe sem definição para manter o estado atual.
- **State Reason** – Opcionalmente, defina `Completed`, `Not Planned`, `Duplicate` ou `Reopened`.
- **Title / Body** – Deixe em branco para manter o valor atual.
- **Labels / Assignees** – Deixe o campo vazio para manter o valor atual. Utilize `[]` para limpar todas as labels ou assignees. Utilize um array JSON como `["bug"]` para substituí-los.

`Edit Issue` requer pelo menos um campo a ser alterado em tempo de execução. Se você fornecer apenas um número de issue, a execução falhará com um erro de validação da camada de API do GitHub.

## Lock Issue

`Lock Issue` aceita um **Lock reason** opcional. Quando fornecido, deve ser um dos valores suportados pelo GitHub:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Deixe o motivo vazio para bloquear sem um motivo específico.

## Pull Requests

Create PR requer:

- Title
- Head branch
- Base branch
- Body opcional
- Modo draft opcional

## Pull Request Reviews

As operações de review correspondem à API de pull request review do GitHub:

| Operação | Campos obrigatórios | Campos opcionais |
|-----------|-----------------|-----------------|
| `Create Review` | Número do pull request, event | Body, commit ID |
| `Get Review` | Número do pull request, review ID | — |
| `List Reviews` | Número do pull request | Per page |
| `Update Review` | Número do pull request, review ID, body | — |

`Create Review` suporta `Approve`, `Request Changes`, `Comment` e `Pending`.
O body é obrigatório para `Request Changes` e `Comment`. Quando o Commit ID está vazio, o GitHub
analisa o commit mais recente do pull request.

## Releases

| Operação | Campos obrigatórios em tempo de execução | Comumente opcionais |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (title), body, target branch, draft, prerelease |
| `Update Release` | Release ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` pode definir explicitamente `draft` / `prerelease` como `true` ou `false`.

## Workflows

As operações de Workflow suportam:

- Listar Workflows do repositório
- Obter um Workflow por ID numérico ou nome de arquivo de Workflow
- Habilitar ou desabilitar um Workflow
- Ler o uso faturável do Workflow por sistema operacional do runner
- Disparar um Workflow com um ref ou branch, além de um objeto JSON de inputs opcional

O GitHub está em processo de descontinuação do endpoint `Get Workflow Usage`. Workflows que utilizam
esta operação podem precisar migrar quando o GitHub remover o endpoint.

`Dispatch Workflow` aceita ambas as formas de resposta do GitHub: o legado `204 No Content` e a resposta
mais recente `200` contendo `workflow_run_id`, `run_url` e `html_url`.

`Dispatch Workflow and Wait` dispara o Workflow e consulta a execução até que seu status seja
`completed`. Configure o timeout e o intervalo de polling em segundos. O Heym utiliza
`workflow_run_id` quando o GitHub retorna a resposta mais recente `200`. Para a resposta tradicional `204 No
Content`, o Heym descobre a execução `workflow_dispatch` recém-criada para o Workflow e ref selecionados, e então aguarda essa execução.

## File Contents

`Get File` lê um arquivo do repositório através da API de contents do GitHub e decodifica o conteúdo de texto quando disponível. Arquivos binários e conteúdo não UTF-8 podem retornar metadados sem um campo `content` decodificado.

`List Files` retorna entradas de diretório da API de contents do repositório para um caminho de pasta e ref opcional. Deixe **Directory Path** vazio para listar a raiz do repositório.

`Create or Update File` grava conteúdo de texto em um caminho do repositório utilizando:

- File path
- Commit message
- File content
- Branch opcional

`Delete File` remove um caminho do repositório utilizando uma commit message e branch opcional. Se o arquivo existir, o Heym busca o SHA atual automaticamente antes de excluí-lo.

Se o arquivo já existir, o Heym busca o SHA atual automaticamente antes de atualizá-lo.

## Paginação

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` e `Get User Repositories` suportam
**Per Page** (1–100). O Heym solicita uma página de resultados; não há campo `page` para buscar
páginas adicionais na mesma operação.

### Return all pages

Ative **Return all pages** para que uma execução percorra todas as páginas, começando em **Cursor** quando definido. Cada pedido solicita 100 itens, independentemente do valor de **Per Page**. O nó para após cerca de 1.000 itens (ou 100 pedidos): os objetos issue têm cerca de 6 KB cada, pelo que um limite maior produziria saídas de nó muito grandes. Se parar antes, devolve o que obteve com `has_more: true` e um `next_cursor` em vez de gerar um erro, e pode continuar passando esse cursor à execução seguinte. Parar o workflow ou atingir o seu tempo limite termina a obtenção entre páginas.

## Saída

O formato exato depende da operação selecionada. Os campos comuns incluem:

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

Substitua `github` pelo rótulo do seu nó.

## Observações

- Os rótulos (labels) e responsáveis (assignees) devem ser arrays JSON válidos quando fornecidos.
- As entradas de dispatch do Workflow devem ser um objeto JSON válido quando fornecidas.
- `Edit Issue` utiliza `state` apenas quando você o define explicitamente; deixe-o indefinido para manter o estado atual da issue.
- As permissões da API do GitHub dependem dos escopos do token ou das permissões refinadas de repositório que você conceder.

## Relacionado

- [Aba Credenciais](../tabs/credentials-tab.md) – Adicione e gerencie Credenciais do GitHub
- [Integrações de Terceiros](../reference/integrations.md) – Configuração de Credenciais do GitHub e `base_url` do Enterprise
- [Nó Agent](./agent-node.md) – Utilize Credenciais do GitHub com `@modelcontextprotocol/server-github`
- [Tipos de Nó](../reference/node-types.md) – Catálogo completo de nós
