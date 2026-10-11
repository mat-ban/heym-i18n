# Nó Agent

O nó **AI Agent** é um nó LLM com chamada de ferramentas. Ele pode executar ferramentas Python, chamar nós conectados do canvas como ferramentas, conectar-se a servidores MCP, usar skills, atuar opcionalmente como um orquestrador que delega para outros nós agent, chamar outros workflows como ferramentas e pausar para [revisão humana](../reference/human-in-the-loop.md).

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1, mais o opcional `review` quando o HITL está habilitado |
| Saída | `$nodeLabel.text`, `$nodeLabel.fieldName` (quando a saída JSON está habilitada), ou um payload HITL pendente enquanto aguarda revisão |

## Parâmetros principais

### Credencial e modelo

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial LLM (chave de API) das Configurações |
| `model` | string | Nome do modelo (ex.: `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (opcional) | Credencial de fallback quando a primária falha |
| `fallbackModel` | string (opcional) | Modelo de fallback quando o primário falha |

Adicione credenciais na aba [Credentials](../tabs/credentials-tab.md). A lista de modelos é carregada a partir da credencial selecionada. Se a credencial ou o modelo primário retornar um erro, o nó tenta novamente automaticamente com a credencial e o modelo de fallback antes de falhar.

### Prompts

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt de sistema para a IA. Suporta [expressões](../reference/expression-dsl.md). |
| `userMessage` | string | Mensagem/prompt do usuário. Padrão: `$input.text` |
| `jsonOutputEnabled` | boolean | Saída JSON estruturada |
| `jsonOutputSchema` | string | JSON Schema para saída estruturada |
| `extraBodyEnabled` | boolean | Envia parâmetros de requisição específicos do provedor (padrão: `false`) |
| `extraBody` | string | Objeto JSON mesclado em cada requisição de API que o agent faz |

Use `$input.text`, `$nodeName.field` e outras sintaxes do [Expression DSL](../reference/expression-dsl.md).

### Modelos de raciocínio (o1, o3)

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (padrão: 0.7), para modelos padrão |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Profundidade de raciocínio para modelos de raciocínio |

Ao usar um modelo de raciocínio (ex.: o1, o3), a interface exibe **Reasoning Effort** em vez de Temperature. Para modelos padrão, **Temperature** controla a criatividade.

**Exemplo de saída JSON:** Quando você precisa de dados estruturados do agent (ex.: classificação, extração), habilite a saída JSON e forneça um schema. O agent retorna JSON correspondente ao schema; acesse os campos por nome na saída do nó:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Nós subsequentes podem usar `$agentLabel.status`, `$agentLabel.reason`, etc. Mesmo comportamento da saída JSON do [nó LLM](../nodes/llm-node.md).

## Revisão humana (HITL)

Use o HITL quando um agent pode precisar de aprovação em momentos específicos antes de ações importantes.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Adiciona checkpoints de revisão humana ao agent |
| `hitlSummary` | string | Diretrizes de aprovação que informam ao agent quando a revisão humana é necessária |

Quando o HITL está habilitado, o agent recebe uma ferramenta `request_human_review`. Use o prompt de sistema e
este campo de diretrizes para explicar quais chamadas de ferramentas, sub-agents, sub-workflows, ações MCP, skills
ou efeitos colaterais exigem aprovação. O agent pode chamar essa ferramenta apenas quando necessário, inclusive várias
vezes em uma mesma execução.

O resumo voltado ao revisor na página pública é gerado a partir da solicitação de revisão do agent em
tempo de execução. Se o agent não fornecer um resumo explicitamente, o Heym deriva um a partir do corpo
Markdown da revisão.

Para ferramentas MCP, o Heym solicita ao modelo que interprete suas instruções HITL escritas como um de três
escopos: `always`, `once` ou `never`. Isso significa que formulações livres como "para cada chamada", "apenas
uma vez" ou "nunca perguntar" são normalizadas antes que o gating em tempo de execução seja aplicado.

Cada checkpoint HITL cria um link público de revisão de uso único em `/review/{token}`. Um revisor pode:

- **Accept** o texto Markdown original da revisão
- **Edit & Continue** com o Markdown modificado
- **Refuse** e continuar com `text: ""`

Quando o HITL está habilitado, o nó também expõe um handle de saída `review` no canvas. Conecte esse branch a nós de Slack, e-mail ou outras notificações se você quiser transmitir a URL de revisão e o resumo assim que a execução pausar.

A execução passa para `pending` até que um revisor responda. O texto da revisão é um único corpo Markdown, e o payload pendente também inclui o texto do link compartilhável para repasse externo. Os nós no branch `review` são executados imediatamente quando a pausa é criada; o caminho de saída normal só continua após a aprovação. Após a aprovação, o Heym retoma a partir do snapshot de execução armazenado e o agent continua com o contexto aprovado. Se uma etapa posterior também precisar de aprovação, o agent pode criar outro checkpoint HITL. Consulte [Human-in-the-Loop](../reference/human-in-the-loop.md) para o formato do payload, o comportamento da URL de revisão e a semântica de retomada.

O HITL está disponível apenas para saída de agent em modo texto. Na v1, ele não pode ser combinado com `jsonOutputEnabled`.
## Modo Orchestrator

Quando habilitado, o agente pode delegar tarefas a outros nós de agente no workflow. Se o **modo Orchestrator estiver desabilitado**, o agente **não poderá criar conexões agente→agente** no canvas.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Quando `true`, o agente recebe uma ferramenta `call_sub_agent` |
| `subAgentLabels` | string[] | Labels dos nós de agente que este orchestrator pode chamar |

Os **sub-agentes** devem usar `$input.text` em sua User Message para que recebam o prompt do orchestrator.

Quando o orchestrator chama múltiplos sub-agentes em um único turno, eles são executados em paralelo. Consulte [Agent Architecture](../reference/agent-architecture.md) para mais detalhes.

## Sub-Workflows

Quando configurado, o agente recebe uma ferramenta `call_sub_workflow` para executar outros workflows.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | IDs dos workflows que este agente pode chamar como ferramentas |

Selecione workflows na seção Sub-Workflows da configuração do agente. O agente os chamará com `workflow_id` e `inputs` (objeto correspondente aos campos de entrada do workflow de destino). Profundidade máxima: 5 chamadas de sub-workflow aninhadas.

## Ferramentas de Nó do Canvas

Você pode conectar um nó de workflow compatível à alça de **ferramentas** de um agente para que o agente possa chamar esse nó em tempo de execução. Isso transforma ações e transformações existentes do canvas em ferramentas chamáveis sem escrever Python.

Use ferramentas de nó do canvas quando quiser que o agente decida quando executar um nó configurado, mantendo ainda as credenciais, os campos estáticos e as configurações específicas do workflow na interface do nó.

### Campos fornecidos pelo agente

Os campos em um nó de ferramenta conectado podem ser marcados com o ícone de bot. Os campos marcados tornam-se parâmetros obrigatórios da ferramenta que o agente deve fornecer ao chamar o nó. Os campos não marcados permanecem fixos e são lidos da configuração do nó.

Por exemplo:

- Conecte um nó Slack a um agente como ferramenta
- Mantenha a credencial fixa no nó Slack
- Marque `message` como fornecido pelo agente
- O agente recebe uma ferramenta Slack na qual fornece apenas a mensagem em tempo de execução

Se o nó não estiver conectado a um agente como ferramenta, o ícone de bot fica oculto e o nó se comporta como uma etapa normal do workflow.

### Comportamento em tempo de execução

Quando o agente chama uma ferramenta de nó do canvas, o Heym mescla temporariamente os argumentos fornecidos pelo agente aos dados desse nó, executa o nó, retorna a saída do nó ao agente e, em seguida, restaura a configuração original do nó. Os nós de ferramenta não são executados como etapas regulares do workflow por meio do agendamento normal; eles são executados apenas quando o agente os chama.

As ferramentas de nó do canvas são úteis com nós de integração como Slack, Telegram, HTTP, Send Email e nós de modelagem de dados como [Set](./set-node.md). Nós de Trigger, nós de controle de fluxo e mapeadores de saída terminal ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) não podem ser usados como ferramentas de agente.

## Ferramentas Python

Defina ferramentas personalizadas que o agente pode chamar. Cada ferramenta possui:

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `name` | string | Nome da ferramenta (ex.: `count_characters`) |
| `description` | string | Descrição para o LLM |
| `parameters` | JSON Schema | Schema de function-calling da OpenAI (formato de objeto) |
| `code` | string | Código da função Python |

Os **Parameters** devem ser um objeto JSON, não uma string:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Exemplo de ferramenta:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** As ferramentas Python são executadas como código não confiável em um contêiner Docker isolado e reforçado por padrão (sem rede, sem socket Docker, sistema de arquivos somente leitura, não-root). As importações são limitadas a uma allowlist de módulos seguros da biblioteca padrão. Consulte [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox) para configuração (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Máximo de segundos por execução de ferramenta (padrão: 30) |
| `requestTimeoutSeconds` | number | Máximo de segundos para aguardar cada resposta do modelo antes do timeout (padrão: 60). Aumente esse valor para provedores lentos ou auto-hospedados (LiteLLM, vLLM, modelos locais) e execuções longas com múltiplas etapas. |
## Conexões MCP

Conecte-se a servidores do [Model Context Protocol](https://modelcontextprotocol.io/) para expor suas ferramentas ao agente.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Tipo de conexão |
| `timeoutSeconds` | number | Tempo limite para esta conexão (padrão: 30) |
| `label` | string | Nome de exibição opcional |

**stdio** (processo local):

| Campo | Descrição |
|-------|-------------|
| `command` | Comando a ser executado (ex.: `npx`) |
| `args` | Array JSON (ex.: `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | Objeto JSON de variáveis de ambiente injetadas no processo (ex.: `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

A maioria dos servidores stdio autenticados por API key realiza autenticação por meio de variáveis de ambiente, em vez de argumentos de comando. Defina `env` por conexão para que cada nó de agente possa usar uma credencial diferente sem alterar o ambiente do host.

Os valores de `env` suportam [Expression DSL](../reference/expression-dsl.md), permitindo que você passe entradas do workflow como credenciais em vez de codificar segredos diretamente:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

A expressão `$userInput.pat` é resolvida em tempo de execução com base nos dados de entrada do workflow antes de o processo MCP iniciar. Isso permite que você aceite tokens de um trigger ou nó de entrada em vez de incorporá-los à definição do workflow.

Exemplo — GitHub MCP com token codificado diretamente:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Exemplo — GitHub MCP com token dinâmico proveniente da entrada do workflow:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Exemplo — GitHub MCP com uma credencial GitHub do Heym:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

A credencial GitHub integrada atualmente é destinada à autenticação baseada em PAT. Caso precise de acesso à organização, utilize um PAT com as permissões necessárias de organização/repositório.

Exemplo — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (servidor remoto):

| Campo | Descrição |
|-------|-------------|
| `url` | URL do endpoint SSE. Suporta expressões (ex.: `$userInput.serverUrl`). |
| `headers` | Objeto JSON para autenticação/cabeçalhos personalizados. Os valores suportam expressões. |

**Streamable HTTP** (servidor remoto):

| Campo | Descrição |
|-------|-------------|
| `url` | URL do endpoint MCP (ex.: `https://example.com/mcp`). Suporta expressões. |
| `headers` | Objeto JSON para autenticação/cabeçalhos personalizados. Os valores suportam expressões. |

## Skills

Skills são instruções em SKILL.md, além de arquivos Python opcionais e assets empacotados. Elas estendem o contexto de sistema do agente e podem adicionar ferramentas Python.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `name` | string | Nome da skill |
| `content` | string | Conteúdo do SKILL.md (instruções) |
| `timeoutSeconds` | number | Tempo limite para execução do Python da skill (padrão: 30) |
| `driveFilesEnabled` | boolean | Habilita o helper `heym_drive` em tempo de execução para esta skill (padrão: false) |
| `files` | array | Entradas opcionais `{ path, content, encoding, mimeType }` (ex.: scripts `.py` ou assets binários armazenados como base64) |

Skills podem ser adicionadas soltando um arquivo `.zip` ou `.md` na área de Skills.
Após expandir um cartão de skill, solte qualquer arquivo sobre essa skill para anexar ou substituir um arquivo empacotado, incluindo assets binários como PDFs e imagens.
Use o botão de download em um cartão de skill para exportar essa skill como um arquivo `.zip` para backup ou reutilização em outro workflow.

Habilite **Drive files** em uma skill somente quando seu código Python precisar ler arquivos do Heym Drive. Skills habilitadas recebem um helper `heym_drive.py` gerado em tempo de execução e podem chamar `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` ou `read_drive_base64` com um id de arquivo do Drive ou nome de arquivo exato. A busca por nome de arquivo utiliza a correspondência acessível mais recente. Skills desabilitadas não recebem o helper.

Cada cartão de skill possui quatro ações na linha abaixo do título:

| Botão | Descrição |
|--------|-------------|
| **Edit with AI** | Abre o Skill Builder para revisar a skill a partir de um prompt de chat |
| **Download** | Exporta a skill como um arquivo `.zip` |
| **Remove** | Exclui a skill deste nó de agente |
| **History** | Abre o histórico da skill derivado do [Edit History](../reference/edit-history.md) |
### Histórico de Skills

O histórico de Skills **não** é armazenado separadamente. Ele é derivado dos snapshots do Histórico de Edição do workflow: cada versão salva do workflow inclui o array `skills` completo do nó do agente.

No diálogo de Histórico, você pode:

- **Visualizar** um snapshot anterior (SKILL.md e lista de arquivos)
- **Editar** — carregar um snapshot no editor de skills sem reverter todo o workflow
- **AI Fine-tune** — abrir o Skill Builder com esse snapshot como ponto de partida
- **Reverter** — restaurar apenas esta skill a partir de uma versão anterior (os demais nós permanecem como estão)

O histórico segue a mesma retenção de 7 dias do Histórico de Edição do workflow. Salvar o workflow após edições de skill cria novas entradas no histórico.

A seção Skills também inclui o **AI Build**:

- Clique em **AI Build** para criar uma nova skill a partir de um prompt de chat
- Clique no botão de brilho em uma skill existente para revisá-la com IA
- Arraste arquivos para o compositor de prompt para anexá-los ao comentário de fine-tune; esses arquivos também são salvos como assets empacotados da skill
- O modal transmite o texto do assistente enquanto exibe pré-visualizações ao vivo dos arquivos `SKILL.md` e `.py`
- **Download ZIP** exporta a pré-visualização atual sem adicioná-la ao nó
- **Save & Add** salva os arquivos gerados de volta pelo mesmo fluxo de parsing de ZIP usado em uploads manuais

Ao editar com IA, o Heym envia apenas arquivos de skill de texto `.md` e `.py` para o builder. Anexos binários e outros não editáveis são preservados e compartilhados com o builder como metadados de caminho, para que o código Python gerado possa manter referências relativas de arquivos corretas.
Selecione um arquivo anexado no painel direito e habilite **Include this file in AI context** quando a IA precisar inspecionar um template empacotado. Arquivos de texto, PDF e DOCX são extraídos para o contexto do prompt quando possível; o Heym não aplica um limite separado de tamanho de anexo do Skill Builder além do limite de corpo de requisição da plataforma.

## Extra Body

Alguns provedores aceitam parâmetros de requisição que os campos padrão compatíveis com OpenAI não
cobrem, como desabilitar o modo de raciocínio de um modelo. Marque **Send extra request body** nas
propriedades do nó e insira um objeto JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Desabilitado por padrão.** Com a caixa de seleção desmarcada, nada extra é enviado.
- Aplicado a **todas** as requisições no loop de chamadas de ferramentas, não apenas ao primeiro turno, além da
  tentativa do modelo de fallback. Não é aplicado a verificações de guardrail, que usam um modelo separado.
- Deve ser um **objeto** JSON. Um array, um escalar ou texto malformado faz o nó falhar com
  `Invalid extra body JSON` em vez de ser silenciosamente descartado.
- Expressões `$` são resolvidas antes do parsing. Como esta é uma substituição textual, um valor resolvido
  contendo aspas duplas ou uma quebra de linha produz JSON inválido e faz o nó falhar.

Mesmo campo e comportamento do extra body do [nó LLM](./llm-node.md).

## Guardrails

Habilite **Guardrails** nas propriedades do nó para bloquear mensagens de usuário inseguras antes que o agente seja executado. Consulte [Guardrails](../reference/guardrails.md) para a referência completa.

## Memória persistente (grafo)

Grafo de conhecimento opcional **por nó de agente** armazenado no banco de dados. Quando habilitado, o Heym anexa um resumo em Markdown das entidades e relacionamentos memorizados à **instrução de sistema** antes de cada execução (apenas se o grafo não estiver vazio). Após uma conclusão **bem-sucedida** do agente, um job em segundo plano extrai novos fatos duráveis da conversa e os mescla ao grafo.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Habilita o carregamento + extração em segundo plano para este nó do canvas |

**Sub-agentes** mantêm seu **próprio** grafo (indexado pelo id do seu nó), separado do orquestrador.

Use o controle rosa de **cérebro** no nó (quando a memória está ativada ou a linha do modelo é exibida) para abrir o editor de grafo e o **compartilhamento de memória** opcional (outros workflows/agentes). Comportamento completo, caminhos REST e detalhes de exportação JSON: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API e continuidade de raciocínio

Uma caixa de seleção **Use Responses API** roteia as chamadas de modelo do agente pela
[Responses API](https://platform.openai.com/docs/api-reference/responses) em vez de Chat
Completions. Ela fica desativada por padrão.

Isso importa mais em um modelo de raciocínio como `gpt-5` ou a série `o`. A Responses API retorna
o raciocínio do modelo junto com cada chamada de ferramenta, e o agente realimenta esses itens de raciocínio no
próximo turno, para que o modelo mantenha sua cadeia de pensamento ao longo de um loop de ferramentas de várias etapas, em vez de
reconstruí-la após cada resultado de ferramenta. Todo o loop é executado no mesmo caminho, incluindo
pausa e retomada da [revisão humana](#human-review-hitl), [compressão de contexto](#context-compression)
e a resposta final.

A conversa em si permanece no Heym. O Heym envia a entrada completa em cada turno e carrega o
raciocínio como um blob criptografado, de modo que nada é retido do lado do provedor entre chamadas.
Itens de raciocínio dentro de um span que a compressão de contexto resume são descartados junto com ele, já que
um blob criptografado não pode ser resumido.

Funciona com uma credencial OpenAI e com uma credencial personalizada cujo gateway suporte o
endpoint. Com uma credencial Google, permanece desabilitada.
## Compressão de Contexto

Quando um agente executa muitas iterações de ferramentas com resultados extensos (web scraping, leitura de documentos, saídas de sub-workflows), o histórico de mensagens acumulado pode se aproximar do limite da janela de contexto do modelo. O Heym comprime automaticamente o histórico da conversa durante a execução para evitar o estouro de contexto.

**Como funciona:**

1. Antes de cada iteração de ferramenta, o Heym estima a contagem atual de tokens (~4 caracteres por token).
2. Se a estimativa exceder **80%** da janela de contexto do modelo, a compressão é acionada.
3. O histórico de mensagens é dividido em seções preservadas e comprimidas:
   - **Preservado**: system prompt, primeira mensagem do usuário, mensagem mais recente do usuário
   - **Comprimido**: tudo entre elas (turnos de raciocínio do assistente, chamadas de ferramentas, resultados de ferramentas)
4. A seção intermediária é resumida usando o **mesmo modelo e credencial** — nenhuma configuração adicional é necessária.
5. O resumo comprimido substitui a seção intermediária como uma única mensagem do assistente.

**Observabilidade:**

Os eventos de compressão aparecem como entradas `Context compressed (N messages → summary)` em:
- Na lista de chamadas de ferramentas do **painel de Debug** durante a execução ao vivo
- Na visualização de detalhes da execução no **histórico de Execução**
- Na **aba Traces** como uma entrada de trace `context.compression`

A compressão é automática e sempre ativa para nós Agent. Ela **não** se aplica a nós LLM, à aba Chat ou a sessões do Assistente de IA.

## Relacionados

- [Por que o Heym](../getting-started/why-heym.md) – Como os agentes são executados e permanecem governados em produção
- [Memória Persistente do Agente](../reference/agent-persistent-memory.md) – Grafo de conhecimento por nó de agente, compartilhamento opcional, API, editor
- [Arquitetura do Agente](../reference/agent-architecture.md) – Sub-agentes, orquestrador, skills, MCP, chamada de ferramentas
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Páginas públicas de revisão, execuções pendentes, fluxo de aprovar/editar/recusar
- [Guardrails](../reference/guardrails.md) – Bloquear categorias de conteúdo inseguro
- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Assistente de IA](../reference/ai-assistant.md) – Interface de chat para construir workflows com linguagem natural (distinta do nó Agent)
- [Expression DSL](../reference/expression-dsl.md) – Referenciando dados em prompts
- [Estrutura do Workflow](../reference/workflow-structure.md) – Nós, arestas e formato DSL
- [Início Rápido](../getting-started/quick-start.md) – Workflow básico com LLM e expressões
- [Aba Credentials](../tabs/credentials-tab.md) – Adicionar chaves de API para o agente
- [Aba MCP](../tabs/mcp-tab.md) – Configurar MCP para ferramentas de workflow
