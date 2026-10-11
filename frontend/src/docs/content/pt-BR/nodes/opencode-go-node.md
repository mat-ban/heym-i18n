# OpenCode Go

O nó **OpenCode Go** executa a CLI do [OpenCode](https://opencode.ai) (Go) em um contêiner Heym isolado e reforçado, contra um repositório GitHub. Assim como o nó Codex, ele foi projetado para tarefas de codificação, como corrigir testes, editar arquivos, produzir um patch ou abrir um pull request — mas utiliza o gateway de modelos **OpenCode Go**, agnóstico em relação ao provedor, em vez do OpenAI Codex.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | Chave de API do OpenCode Go + GitHub |
| Saída | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autenticação

A credencial do **OpenCode Go** armazena uma **API key** do gateway OpenCode Go (obtida em [opencode.ai/go](https://opencode.ai/go)) e uma **Gateway Base URL** opcional (o padrão é `https://opencode.ai/zen/go/v1`; substitua apenas para um gateway auto-hospedado ou com proxy).

O nó também requer uma credencial do **GitHub** para clonar repositórios privados, enviar a branch de trabalho e criar pull requests. O token do GitHub **nunca é colocado dentro do contêiner sandbox** — o Heym executa todas as operações de git e GitHub no host, de modo que o código gerado não pode exfiltrar credenciais de push.

## Isolamento e segurança

O isolamento de execução é escolhido por `HEYM_OPENCODE_CLI_COMMAND`, exatamente como no nó Codex:

- **Desenvolvimento local (`run.sh`)** mantém o valor padrão `opencode`, de modo que o OpenCode é executado como um subprocesso do host contra o workspace clonado — sem necessidade de Docker, sem flags adicionais.
- **Implantações Docker (`deploy.sh` e a imagem única do GHCR)** definem o valor como `/usr/local/bin/heym-opencode-docker`, um wrapper que executa `opencode run` dentro de um **contêiner irmão descartável e reforçado**, compartilhando o volume nomeado do workspace do OpenCode.

O contêiner runner reforçado remove todas as capabilities do Linux, define `no-new-privileges`, usa um root somente leitura com um tmpfs `/tmp` e aplica limites de pid/memória/CPU. A saída de rede é permitida (o OpenCode precisa alcançar o gateway de modelos). O **token do GitHub nunca é colocado dentro do contêiner** — todas as operações de git e GitHub são executadas no host, de modo que apenas a API key do OpenCode e os arquivos do repositório ficam dentro dele.

O OpenCode apenas edita arquivos em disco; o Heym é responsável por todas as ações de git/GitHub.

## Modelos

O catálogo de modelos do OpenCode Go muda com frequência, portanto o campo **Model** é preenchido dinamicamente a partir da lista de modelos do gateway (`GET https://opencode.ai/zen/go/v1/models`) e exibido como um dropdown pesquisável. Se a lista dinâmica estiver indisponível, uma lista de fallback integrada é utilizada. Os ids de modelo usam o formato `opencode-go/<model>` (por exemplo, `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` é o id do provedor da CLI do OpenCode para o gateway Go. Deixe o campo vazio para usar o padrão do runner (`opencode-go/kimi-k3`). Ids de modelo salvos no formato mais antigo `opencode/<model>` são reescritos automaticamente em tempo de execução.

## Campos

| Campo | Descrição |
|-------|-------------|
| OpenCode Go Credential | Credencial do OpenCode Go (API key do gateway) |
| GitHub Credential | Credencial de PAT do GitHub usada para acesso ao repositório |
| Repository URL | URL HTTPS do repositório GitHub; suporta expressões |
| Base Branch | Branch a ser clonada antes da execução do OpenCode, padrão `main` |
| Model | Modelo do OpenCode Go (dropdown pesquisável dinâmico, `opencode-go/<model>`); vazio usa o padrão do runner |
| Reasoning Variant | Opcional; mapeia para `opencode run --variant` em modelos que suportam esforço de raciocínio |
| Task Prompt | Tarefa de codificação para o OpenCode; suporta expressões como `$input.text` |
| Publish Mode | Como as alterações são entregues (consulte a tabela abaixo) |
| Branch Name | Branch de trabalho para os modos de PR/commit, padrão `opencode/$executionId` |
| Timeout | Tempo máximo de execução do OpenCode em segundos |

## Modos de Publicação

| Modo | O que faz |
|------|--------------|
| `diff_only` | Edita arquivos localmente e retorna o patch e os arquivos alterados. Nada é enviado. |
| `draft_pr` | Faz commit na branch, envia-a e abre um pull request em rascunho. |
| `open_pr` | Faz commit na branch, envia-a e abre um pull request pronto para revisão (não rascunho). |
| `commit_push` | Faz commit na branch e a envia, sem abrir um pull request. |
| `direct_commit` | Faz commit e envia diretamente para a branch base (sem branch separada ou PR). |
| `open_or_update_pr` | Atualiza o PR aberto existente do agente quando houver um — mesmo que o nome da branch seja diferente, o runner o encontra por autor + base — caso contrário, abre um novo. Ideal para reexecuções e instruções do tipo "atualizar o PR aberto". |
| `update_existing_pr` | Adiciona um commit à branch/PR existente; abre um se ainda não existir. |
| `patch_artifact` | Salva o diff como um arquivo para download e retorna `patchUrl`. Nada é enviado. |

## Saídas

| Chave | Descrição |
|-----|-------------|
| `status` | Sempre `completed` (o nó OpenCode Go não pausa para entrada) |
| `summary` | Mensagem final do OpenCode |
| `validation` | Notas de validação quando reportadas |
| `diff` | Patch do git quando arquivos foram alterados |
| `changedFiles` | Caminhos dos arquivos alterados |
| `branchName` | Nome da branch de trabalho |
| `pullRequestUrl` | URL do PR nos modos `draft_pr`, `open_pr`, `open_or_update_pr` e `update_existing_pr` |
| `pushedBranch` | Branch que foi enviada nos modos de commit/PR |
| `patchUrl` | Link para download do diff no modo `patch_artifact` |
## Capturas de tela de UI em pull requests

Para tarefas de UI/frontend, o OpenCode deve salvar capturas de tela em PNG em um caminho ignorado pelo git, como `frontend/.e2e-artifacts/` (não no código-fonte). Se as dependências de frontend estiverem ausentes, o prompt do runner permite uma instalação direcionada de pacotes (por exemplo, `bun install`) além de uma pré-visualização de curta duração/`bun run dev` exclusivamente para capturar a UI. O Heym faz upload dessas imagens para um único **prerelease** compartilhado do GitHub (`opencode-pr-assets`) como assets nomeados `<branch>-…`, e então as incorpora na descrição do PR **antes de o pull request ser aberto**, de modo que um novo PR já é criado contendo suas capturas de tela (PRs existentes são atualizados no local).

O OpenCode também é instruído a terminar com uma linha `PR_TITLE: …` para que o Heym possa abrir o pull request com um assunto significativo em vez de placeholders como `Done.`

O OpenCode às vezes encerra um turno no meio da tarefa ("…Now let me take a screenshot"), o que finalizaria a execução antes de a captura de tela ser feita. Para evitar isso, o prompt do runner exige a captura de telas **antes** da mensagem final, e se a execução ainda terminar sem um resumo publicável ou com uma alteração de UI mas sem captura de tela, o Heym executa mais uma passagem do OpenCode no mesmo workspace para finalizar. Se uma alteração de UI ainda não tiver captura de tela depois disso, uma nota visível é adicionada ao corpo do PR para que a lacuna nunca passe em silêncio.

## O que é publicado no GitHub

Seu **Task Prompt** é uma entrada privada, não conteúdo do PR. Apenas duas coisas são publicadas: uma seção `## Change Summary` descrevendo o que a alteração de código faz, e uma seção `## Screenshots` quando capturas de tela foram feitas. O título do PR é derivado apenas do resumo da alteração.

O prompt do runner declara essa política, e o Heym também a aplica após a execução: antes que qualquer coisa seja commitada ou aberta como pull request, ele remove seções de eco de prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) e qualquer parágrafo copiado literalmente do task prompt do resumo, do corpo do PR e da mensagem de commit.

O Heym lê a seção `## Change Summary` das mensagens do agente em vez de pegar o que ele disse por último, porque o OpenCode emite uma mensagem por etapa e a final costuma ser um comentário no meio da execução. A narração de etapas (`Both pass. Let me do a final review:`) também é rejeitada como título de PR ou assunto de commit. Se a execução não produzir um resumo de alteração utilizável, o pull request recorre à listagem dos arquivos alterados em vez de publicar comentários.

## Como ferramenta de agente

O nó OpenCode Go pode ser conectado ao handle de ferramenta de um nó **AI Agent** para que o agente possa delegar tarefas de codificação. Configure a credencial, a credencial do GitHub e o repositório no nó, depois marque **Task Prompt** (e opcionalmente **Repository URL**) com o toggle fornecido pelo agente para que o agente os forneça no momento da chamada.

## Exemplo

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## Relacionados

- [Nó Codex](./codex-node.md)
- [Nó GitHub](./github-node.md)
- [Nó Agent](./agent-node.md)
- [Credenciais](../reference/credentials.md)
- [Compartilhamento de Credenciais](../reference/credentials-sharing.md)
- [Tipos de Nó](../reference/node-types.md)
