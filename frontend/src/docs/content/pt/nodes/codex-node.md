# Nó Codex

O nó **Codex** executa a CLI do OpenAI Codex em um workspace isolado do Heym contra um repositório do GitHub. Ele foi projetado para tarefas de codificação, como corrigir testes, editar arquivos, produzir um patch ou abrir um pull request em rascunho.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1, mais `question` |
| Credencial | Token de acesso do Codex + GitHub |
| Saída | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autenticação

A credencial **OpenAI Codex** oferece suporte a dois modos de autenticação:

| Modo | Descrição |
|------|-------------|
| **Sign in with ChatGPT** (recomendado) | Login via OAuth (PKCE) que utiliza a sua assinatura ChatGPT Plus/Pro, de modo que as execuções **não** incorrem em custos de API por token. Clique em **Sign in with ChatGPT** no diálogo de credencial, autorize no navegador e cole a URL de redirecionamento `localhost:1455` de volta no Heym. O Heym armazena o pacote de tokens resultante e o renova automaticamente conforme ele expira. |
| **Access token** | Cole um `access_token` do ChatGPT/Codex usado apenas pelo runner local do Codex. |

Chaves de API não são aceitas para a credencial do Codex. O nó não envia tarefas do Codex para a nuvem; ele clona o repositório dentro do runtime do Heym, grava o pacote de tokens do ChatGPT em um `auth.json` isolado (ou passa `CODEX_ACCESS_TOKEN`) apenas para o processo do Codex, e mantém o token fora de `$credentials`.

O nó também requer uma credencial do **GitHub** para clonar repositórios privados, enviar a branch de trabalho e criar pull requests em rascunho.

Em implantações com Docker, o Heym executa o Codex dentro de um contêiner irmão a partir da mesma imagem do Heym (não uma imagem GHCR separada). Esse contêiner monta apenas o volume do workspace do Codex e permite que o próprio sandbox bubblewrap do Codex crie namespaces e um `/proc` novo. O runner adiciona `SYS_ADMIN`, seccomp e AppArmor irrestritos, e `systempaths=unconfined` (Docker Engine 25+). Sem esse último parâmetro, todo comando falha antes da inicialização com `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Referências da OpenAI:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Campos

| Campo | Descrição |
|-------|-------------|
| Codex Credential | Credencial OpenAI Codex (login com ChatGPT ou `access_token`) |
| GitHub Credential | Credencial de PAT do GitHub usada para acesso ao repositório |
| Repository URL | URL HTTPS do repositório do GitHub |
| Base Branch | Branch a ser clonada antes da execução do Codex, padrão `main` |
| Model | Modelo Codex opcional (lista suspensa editável, ex.: `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); vazio usa o padrão do Codex |
| Reasoning Effort | Profundidade de raciocínio do Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max` ou `ultra` (padrão `medium`) |
| Task Prompt | Tarefa de codificação para o Codex; aceita expressões como `$input.text` |
| Publish Mode | Como as alterações são entregues (consulte a tabela abaixo) |
| Branch Name | Branch de trabalho para os modos de PR/commit, padrão `codex/$executionId` |
| Timeout | Tempo máximo de execução do Codex em segundos |

## Modos de publicação

| Modo | O que faz |
|------|--------------|
| `diff_only` | Edita arquivos localmente e retorna o patch e os arquivos alterados. Nada é enviado. |
| `draft_pr` | Faz commit na branch, a envia e abre um pull request em rascunho. |
| `open_pr` | Faz commit na branch, a envia e abre um pull request pronto para revisão (não rascunho). |
| `commit_push` | Faz commit na branch e a envia, sem abrir um pull request. |
| `direct_commit` | Faz commit e envia diretamente para a branch base (sem branch separada ou PR). |
| `open_or_update_pr` | Atualiza o PR aberto existente do agente quando houver um — mesmo que o nome da branch seja diferente, o runner o encontra por autor + base — caso contrário, abre um novo. Ideal para reexecuções e instruções do tipo "atualizar o PR aberto". |
| `update_existing_pr` | Adiciona um commit à branch/PR existente; abre um se ainda não houver nenhum. |
| `patch_artifact` | Salva o diff como um arquivo para download e retorna `patchUrl`. Nada é enviado. |

## Saídas

| Chave | Descrição |
|-----|-------------|
| `status` | `completed` ou `needs_input` |
| `summary` | Resumo do Codex |
| `validation` | Notas de validação, testes ou verificações relatadas pelo Codex |
| `diff` | Patch do Git quando arquivos foram alterados |
| `changedFiles` | Caminhos dos arquivos alterados |
| `threadId` | Id da thread/sessão do Codex quando disponível |
| `branchName` | Nome da branch de trabalho |
| `pullRequestUrl` | URL do PR nos modos `draft_pr`, `open_pr`, `open_or_update_pr` e `update_existing_pr` |
| `pushedBranch` | Branch que foi enviada nos modos de commit/PR |
| `patchUrl` | Link para download do diff no modo `patch_artifact` |
| `usage` | Metadados de uso relatados pela CLI do Codex quando disponíveis |
## Capturas de tela de UI em pull requests

Para tarefas de UI/frontend, o Codex deve salvar capturas de tela em PNG em um caminho ignorado pelo git, como `frontend/.e2e-artifacts/` (não no código-fonte). Caso as dependências de frontend estejam ausentes, o Codex pode executar `bun install` (ou npm/pnpm install) e iniciar uma pré-visualização de curta duração/`bun run dev` exclusivamente para capturar a UI. O Heym faz upload dessas imagens para um único **prerelease** compartilhado do GitHub (`codex-pr-assets`) como assets nomeados `<branch>-…`, e então as incorpora na descrição do PR **antes de o pull request ser aberto**, de modo que um novo PR já é criado contendo suas capturas de tela (PRs existentes são atualizados no local). O Codex também deve definir um `pull_request_title` significativo (nunca placeholders como `Done.`).

Por vezes, o Codex encerra um turno no meio da tarefa ("…Now let me take a screenshot"), o que finalizaria a execução antes de a captura de tela ser feita. Para evitar isso, o prompt do runner exige a captura de telas **antes** do resultado final e, caso a execução ainda termine sem um resumo publicável ou com uma alteração de UI mas sem captura de tela, o Heym executa mais uma passagem do Codex no mesmo workspace para concluir. Se uma alteração de UI ainda permanecer sem captura de tela depois disso, uma nota visível é adicionada ao corpo do PR para que a lacuna nunca passe em silêncio.

## O que é publicado no GitHub

O seu **Task Prompt** é uma entrada privada, não conteúdo do PR. Apenas duas coisas são publicadas: um `## Change Summary` descrevendo o que a alteração de código faz, e uma seção `## Screenshots` quando capturas de tela foram registradas. O título do PR é derivado exclusivamente do resumo da alteração.

O prompt do runner declara essa política, e o Heym também a aplica após a execução: antes que qualquer coisa seja commitada ou aberta como pull request, ele remove seções de eco do prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) e qualquer parágrafo copiado literalmente do task prompt do resumo, do corpo do PR e da mensagem de commit. Narração de etapas como `Both pass. Let me do a final review:` também é rejeitada como título de PR ou assunto de commit.

## Perguntas de acompanhamento

Se o Codex precisar de requisitos ausentes ou de uma decisão de produto, ele retorna `needs_input`. O Heym pausa a execução e expõe um handle de saída `question`. Conecte esse handle a um ramo de notificação, por exemplo Slack ou Send Email, para enviar ao revisor o link público de acompanhamento.

Quando o revisor responde, o Heym retoma o mesmo snapshot de execução e a mesma thread do Codex a partir dos metadados salvos do workspace.

## Como ferramenta de agente

O nó Codex pode ser anexado ao handle de ferramenta de um nó **AI Agent** para que o agente possa delegar tarefas de codificação. Configure a credencial, a credencial do GitHub e o repositório no nó, depois marque **Task Prompt** (e opcionalmente **Repository URL**) com o toggle fornecido pelo agente para que o agente os forneça no momento da chamada. Quando o Codex é executado como ferramenta, um resultado `needs_input` é retornado inline ao agente em vez de pausar o workflow, de modo que o agente pode refinar a solicitação e chamar o Codex novamente.

## Exemplo

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## Relacionados

- [Nó GitHub](./github-node.md)
- [Nó Agent](./agent-node.md)
- [Credenciais](../reference/credentials.md)
- [Compartilhamento de Credenciais](../reference/credentials-sharing.md)
- [Tipos de Nó](../reference/node-types.md)
