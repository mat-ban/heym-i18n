# Nó Agent

O nó **AI Agent** é um nó LLM com chamada de ferramentas. Ele pode executar ferramentas Python, chamar nós conectados do canvas como ferramentas, conectar-se a servidores MCP, utilizar skills, atuar opcionalmente como um orquestrador que delega a outros nós agent, chamar outros workflows como ferramentas e pausar para [revisão humana](../reference/human-in-the-loop.md).

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1, além do opcional `review` quando o HITL está habilitado |
| Saída | `$nodeLabel.text`, `$nodeLabel.fieldName` (quando a saída JSON está habilitada) ou um payload HITL pendente enquanto aguarda revisão |

## Parâmetros principais

### Credencial e modelo

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial LLM (chave de API) definida em Configurações |
| `model` | string | Nome do modelo (ex.: `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (opcional) | Credencial de fallback quando a principal falha |
| `fallbackModel` | string (opcional) | Modelo de fallback quando o principal falha |

Adicione credenciais na aba [Credenciais](../tabs/credentials-tab.md). A lista de modelos é carregada a partir da credencial selecionada. Se a credencial ou o modelo principal retornar um erro, o nó tenta novamente automaticamente com a credencial e o modelo de fallback antes de falhar.

### Prompts

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt de sistema para a IA. Suporta [expressões](../reference/expression-dsl.md). |
| `userMessage` | string | Mensagem/prompt do usuário. Padrão: `$input.text` |
| `jsonOutputEnabled` | boolean | Saída JSON estruturada |
| `jsonOutputSchema` | string | JSON Schema para saída estruturada |
| `extraBodyEnabled` | boolean | Envia parâmetros de requisição específicos do provedor (padrão: `false`) |
| `extraBody` | string | Objeto JSON mesclado em cada requisição de API que o agent realiza |

Utilize `$input.text`, `$nodeName.field` e outras sintaxes do [Expression DSL](../reference/expression-dsl.md).

### Modelos de raciocínio (o1, o3)

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (padrão: 0.7), para modelos padrão |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Profundidade de raciocínio para modelos de raciocínio |

Ao utilizar um modelo de raciocínio (ex.: o1, o3), a interface exibe **Reasoning Effort** em vez de Temperature. Para modelos padrão, **Temperature** controla a criatividade.

**Exemplo de saída JSON:** Quando você precisar de dados estruturados do agent (ex.: classificação, extração), habilite a saída JSON e forneça um schema. O agent retorna JSON compatível com o schema; acesse os campos por nome na saída do nó:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Os nós subsequentes podem utilizar `$agentLabel.status`, `$agentLabel.reason`, etc. Comportamento idêntico à saída JSON do [nó LLM](../nodes/llm-node.md).
## Revisão Humana (HITL)

Utilize HITL quando um agente precisar de aprovação em momentos específicos antes de ações importantes.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Adiciona pontos de verificação de revisão humana ao agente |
| `hitlSummary` | string | Diretrizes de aprovação que informam ao agente quando a revisão humana é necessária |

Quando o HITL está habilitado, o agente recebe uma ferramenta `request_human_review`. Utilize o system prompt e este campo de diretrizes para explicar quais chamadas de ferramentas, sub-agentes, sub-workflows, ações MCP, skills ou efeitos colaterais exigem aprovação. O agente pode chamar essa ferramenta apenas quando necessário, inclusive múltiplas vezes em uma única execução.

O resumo voltado ao revisor na página pública é gerado a partir da solicitação de revisão do agente em tempo de execução. Se o agente não fornecer um resumo explicitamente, o Heym deriva um a partir do corpo da revisão em Markdown.

Para ferramentas MCP, o Heym solicita ao modelo que interprete as suas instruções HITL escritas como um de três escopos: `always`, `once` ou `never`. Isso significa que formulações livres como "para cada chamada", "apenas uma vez" ou "nunca perguntar" são normalizadas antes que o controle de execução em tempo de execução seja aplicado.

Cada ponto de verificação HITL cria um link público de revisão de uso único em `/review/{token}`. Um revisor pode:

- **Aceitar** o texto original da revisão em Markdown
- **Editar e Continuar** com o Markdown modificado
- **Recusar** e continuar com `text: ""`

Quando o HITL está habilitado, o nó também expõe um handle de saída `review` no canvas. Conecte esse ramo a nós de Slack, e-mail ou outras notificações caso deseje transmitir a URL de revisão e o resumo assim que a execução for pausada.

A execução passa para o estado `pending` até que um revisor responda. O texto da revisão é um único corpo em Markdown, e o payload pendente também inclui o texto do link compartilhável para transferência externa. Os nós no ramo `review` são executados imediatamente quando a pausa é criada; o caminho de saída normal só continua após a aprovação. Após a aprovação, o Heym retoma a partir do snapshot de execução armazenado e o agente continua com o contexto aprovado. Se uma etapa posterior também precisar de aprovação, o agente pode criar outro ponto de verificação HITL. Consulte [Human-in-the-Loop](../reference/human-in-the-loop.md) para o formato do payload, o comportamento da URL de revisão e a semântica de retomada.

O HITL está disponível apenas para saída de agente em modo texto. Na v1, não pode ser combinado com `jsonOutputEnabled`.


## Modo Orquestrador

Quando habilitado, o agente pode delegar tarefas a outros nós de agente no workflow. Se o **modo Orquestrador estiver desabilitado**, o agente **não poderá criar conexões agente→agente** no canvas.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Quando `true`, o agente recebe uma ferramenta `call_sub_agent` |
| `subAgentLabels` | string[] | Labels dos nós de agente que este orquestrador pode chamar |

Os **sub-agentes** devem usar `$input.text` em sua User Message para que recebam o prompt do orquestrador.

Quando o orquestrador chama múltiplos sub-agentes em um único turno, eles são executados em paralelo. Consulte [Agent Architecture](../reference/agent-architecture.md) para mais detalhes.

## Sub-Workflows

Quando configurado, o agente recebe uma ferramenta `call_sub_workflow` para executar outros workflows.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | IDs dos workflows que este agente pode chamar como ferramentas |

Selecione workflows na seção Sub-Workflows da configuração do agente. O agente os chamará com `workflow_id` e `inputs` (objeto correspondente aos campos de entrada do workflow de destino). Profundidade máxima: 5 chamadas de sub-workflow aninhadas.

## Ferramentas de Nó do Canvas

Você pode conectar um nó de workflow compatível ao handle de **ferramentas** de um agente para que o agente possa chamar esse nó em tempo de execução. Isso transforma ações e transformações existentes do canvas em ferramentas chamáveis sem escrever Python.

Utilize ferramentas de nó do canvas quando desejar que o agente decida quando executar um nó configurado, mantendo ainda as credenciais, os campos estáticos e as configurações específicas do workflow na interface do nó.

### Campos fornecidos pelo agente

Os campos em um nó de ferramenta conectado podem ser marcados com o ícone de bot. Os campos marcados tornam-se parâmetros obrigatórios da ferramenta que o agente deve fornecer ao chamar o nó. Os campos não marcados permanecem fixos e são lidos da configuração do nó.

Por exemplo:

- Conecte um nó Slack a um agente como ferramenta
- Mantenha a credencial fixa no nó Slack
- Marque `message` como fornecida pelo agente
- O agente recebe uma ferramenta Slack na qual fornece apenas a mensagem em tempo de execução

Se o nó não estiver conectado a um agente como ferramenta, o ícone de bot ficará oculto e o nó se comportará como uma etapa normal do workflow.
### Comportamento em tempo de execução

Quando o agente chama uma ferramenta de nó do canvas, o Heym mescla temporariamente os argumentos fornecidos pelo agente aos dados desse nó, executa o nó, retorna a saída do nó ao agente e, em seguida, restaura a configuração original do nó. Os nós de ferramenta não são executados como etapas regulares do workflow por meio do agendamento normal; eles são executados apenas quando o agente os chama.

As ferramentas de nó do canvas são úteis com nós de integração como Slack, Telegram, HTTP, Send Email e nós de modelagem de dados como [Set](./set-node.md). Nós de Trigger, nós de fluxo de controle e mapeadores de saída terminal ([mapeador de saída JSON](./json-output-mapper-node.md), [mapeador de saída HTML](./html-output-mapper-node.md)) não podem ser usados como ferramentas do agente.

## Ferramentas Python

Defina ferramentas personalizadas que o agente pode chamar. Cada ferramenta possui:

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `name` | string | Nome da ferramenta (ex.: `count_characters`) |
| `description` | string | Descrição para o LLM |
| `parameters` | JSON Schema | Esquema de chamada de função da OpenAI (formato de objeto) |
| `code` | string | Código da função Python |

**Parameters** deve ser um objeto JSON, não uma string:

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

> **Sandbox.** As ferramentas Python são executadas como código não confiável em um contêiner Docker isolado e reforçado por padrão (sem rede, sem socket Docker, sistema de arquivos somente leitura, não-root). As importações são limitadas a uma lista de permissões de módulos seguros da biblioteca padrão. Consulte [Segurança → Sandbox de Ferramentas Python](../reference/security.md#python-tool-sandbox) para configuração (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Máximo de segundos por execução de ferramenta (padrão: 30) |
| `requestTimeoutSeconds` | number | Máximo de segundos para aguardar cada resposta do modelo antes do timeout (padrão: 60). Aumente esse valor para provedores lentos ou auto-hospedados (LiteLLM, vLLM, modelos locais) e execuções longas com múltiplas etapas. |
## Conexões MCP

Conecte-se a servidores do [Model Context Protocol](https://modelcontextprotocol.io/) para expor as suas ferramentas ao agente.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Tipo de conexão |
| `timeoutSeconds` | number | Timeout para esta conexão (padrão: 30) |
| `label` | string | Nome de exibição opcional |

**stdio** (processo local):

| Campo | Descrição |
|-------|-------------|
| `command` | Comando a executar (ex.: `npx`) |
| `args` | Array JSON (ex.: `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | Objeto JSON de variáveis de ambiente injetadas no processo (ex.: `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

A maioria dos servidores stdio com chave de API autentica-se através de variáveis de ambiente em vez de argumentos de comando. Defina `env` por conexão para que cada nó de agente possa utilizar uma credencial diferente sem alterar o ambiente do host.

Os valores de `env` suportam [Expression DSL](../reference/expression-dsl.md), permitindo passar entradas do workflow como credenciais em vez de codificar segredos diretamente:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

A expressão `$userInput.pat` é resolvida em tempo de execução com base nos dados de entrada do workflow antes de o processo MCP ser iniciado. Isto permite aceitar tokens a partir de um trigger ou nó de entrada em vez de os incorporar na definição do workflow.

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

A credencial GitHub integrada destina-se atualmente à autenticação baseada em PAT. Caso necessite de acesso à organização, utilize um PAT com as permissões de organização/repositório necessárias.

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
| `headers` | Objeto JSON para cabeçalhos de autenticação/personalizados. Os valores suportam expressões. |

**Streamable HTTP** (servidor remoto):

| Campo | Descrição |
|-------|-------------|
| `url` | URL do endpoint MCP (ex.: `https://example.com/mcp`). Suporta expressões. |
| `headers` | Objeto JSON para cabeçalhos de autenticação/personalizados. Os valores suportam expressões. |

## Skills

As Skills são instruções em SKILL.md, acrescidas de ficheiros Python opcionais e recursos empacotados. Estendem o contexto de sistema do agente e podem adicionar ferramentas Python.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `name` | string | Nome da Skill |
| `content` | string | Conteúdo do SKILL.md (instruções) |
| `timeoutSeconds` | number | Timeout para a execução Python da skill (padrão: 30) |
| `driveFilesEnabled` | boolean | Ativa o auxiliar `heym_drive` em tempo de execução para esta skill (padrão: false) |
| `files` | array | Entradas opcionais `{ path, content, encoding, mimeType }` (ex.: scripts `.py` ou recursos binários armazenados em base64) |

As Skills podem ser adicionadas arrastando um ficheiro `.zip` ou `.md` para a área de Skills.
Após expandir um cartão de skill, arraste qualquer ficheiro para essa skill para anexar ou substituir um ficheiro empacotado, incluindo recursos binários como PDFs e imagens.
Utilize o botão de transferência no cartão de skill para exportar essa skill como um arquivo `.zip` para cópia de segurança ou reutilização noutro workflow.

Ative **Drive files** numa skill apenas quando o seu código Python necessitar de ler ficheiros do Heym Drive. As skills ativadas recebem um auxiliar `heym_drive.py` gerado em tempo de execução e podem chamar `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` ou `read_drive_base64` com um id de ficheiro do Drive ou um nome de ficheiro exato. A pesquisa por nome de ficheiro utiliza a correspondência acessível mais recente. As skills desativadas não recebem o auxiliar.

Cada cartão de skill tem quatro ações na linha abaixo do título:

| Botão | Descrição |
|--------|-------------|
| **Edit with AI** | Abre o Skill Builder para rever a skill a partir de um prompt de chat |
| **Download** | Exporta a skill como um arquivo `.zip` |
| **Remove** | Elimina a skill deste nó de agente |
| **History** | Abre o histórico da skill derivado do [Edit History](../reference/edit-history.md) |
### Histórico de Skills

O histórico de Skills **não** é armazenado separadamente. Ele é derivado dos snapshots do Histórico de Edição do workflow: cada versão salva do workflow inclui o array completo `skills` do nó do agente.

A partir do diálogo Histórico, é possível:

- **Pré-visualizar** um snapshot anterior (SKILL.md e lista de arquivos)
- **Editar** — carregar um snapshot no editor de skills sem reverter todo o workflow
- **AI Fine-tune** — abrir o Skill Builder com esse snapshot como ponto de partida
- **Reverter** — restaurar apenas esta skill a partir de uma versão anterior (os demais nós permanecem como estão)

O Histórico segue a mesma retenção de 7 dias do Histórico de Edição do workflow. Salvar o workflow após edições de skill cria novas entradas no histórico.

A seção Skills também inclui o **AI Build**:

- Clique em **AI Build** para criar uma nova skill a partir de um prompt de chat
- Clique no botão sparkle em uma skill existente para revisá-la com IA
- Arraste arquivos para o compositor de prompt para anexá-los ao comentário de fine-tune; esses arquivos também são salvos como assets empacotados da skill
- O modal transmite o texto do assistente enquanto exibe pré-visualizações ao vivo dos arquivos `SKILL.md` e `.py`
- **Download ZIP** exporta a pré-visualização atual sem adicioná-la ao nó
- **Save & Add** salva os arquivos gerados de volta pelo mesmo fluxo de parsing de ZIP usado em uploads manuais

Ao editar com IA, o Heym envia apenas arquivos de skill de texto `.md` e `.py` para o builder. Anexos binários e outros não editáveis são preservados e compartilhados com o builder como metadados de caminho, para que o código Python gerado possa manter referências relativas de arquivos corretas.
Selecione um arquivo anexado no painel direito e habilite **Include this file in AI context** quando a IA precisar inspecionar um template empacotado. Arquivos de texto, PDF e DOCX são extraídos para o contexto do prompt quando possível; o Heym não aplica um limite separado de tamanho de anexo do Skill Builder além do limite de corpo da requisição da plataforma.

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
- As expressões `$` são resolvidas antes do parsing. Como esta é uma substituição textual, um valor resolvido
  contendo aspas duplas ou uma quebra de linha produz JSON inválido e faz o nó falhar.

Mesmo campo e comportamento do extra body do [Nó LLM](./llm-node.md).

## Guardrails

Habilite **Guardrails** nas propriedades do nó para bloquear mensagens de usuário inseguras antes da execução do agente. Consulte [Guardrails](../reference/guardrails.md) para a referência completa.

## Memória persistente (grafo)

Grafo de conhecimento opcional **por nó de agente** armazenado no banco de dados. Quando habilitado, o Heym anexa um resumo em Markdown das entidades e relacionamentos memorizados à **instrução de sistema** antes de cada execução (somente se o grafo não estiver vazio). Após uma conclusão **bem-sucedida** do agente, um job em segundo plano extrai novos fatos duráveis da conversa e os mescla ao grafo.

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Habilita o carregamento + extração em segundo plano para este nó do canvas |

**Sub-agentes** mantêm o **próprio** grafo (indexado pelo id do seu nó), separado do orquestrador.

Use o controle rosa de **brain** no nó (quando a memória está ativada ou a linha do modelo é exibida) para abrir o editor de grafo e o **compartilhamento de memória** opcional (outros workflows/agentes). Comportamento completo, caminhos REST e detalhes de exportação JSON: [Memória Persistente do Agente](../reference/agent-persistent-memory.md).
## API Responses e continuidade de raciocínio

A caixa de seleção **Use Responses API** encaminha as chamadas de modelo do agente através da
[Responses API](https://platform.openai.com/docs/api-reference/responses) em vez de Chat
Completions. Está desativada por padrão.

É mais relevante em um modelo de raciocínio como `gpt-5` ou a série `o`. A Responses API retorna
o raciocínio do modelo juntamente com cada chamada de ferramenta, e o agente realimenta esses itens
de raciocínio no turno seguinte, de modo que o modelo mantém a sua cadeia de pensamento ao longo de
um ciclo de ferramentas com múltiplos passos, em vez de a reconstruir após cada resultado de
ferramenta. Todo o ciclo é executado no mesmo caminho, incluindo a pausa e retomada da
[revisão humana](#human-review-hitl), a [compressão de contexto](#context-compression)
e a resposta final.

A conversa em si permanece no Heym. O Heym envia a entrada completa em cada turno e transporta o
raciocínio como um blob encriptado, pelo que nada é retido do lado do fornecedor entre chamadas.
Os itens de raciocínio dentro de um intervalo que a compressão de contexto resume são descartados
juntamente com ele, uma vez que um blob encriptado não pode ser resumido.

Funciona com uma credencial OpenAI e com uma credencial personalizada cujo gateway suporte o
endpoint. Com uma credencial Google, permanece desativada.

## Compressão de Contexto

Quando um agente executa muitas iterações de ferramentas com resultados extensos (web scraping, leitura de documentos, saídas de sub-workflow), o histórico de mensagens acumulado pode aproximar-se do limite da janela de contexto do modelo. O Heym comprime automaticamente o histórico da conversa a meio da execução para evitar a sobrecarga do contexto.

**Como funciona:**

1. Antes de cada iteração de ferramenta, o Heym estima a contagem atual de tokens (~4 caracteres por token).
2. Se a estimativa exceder **80%** da janela de contexto do modelo, a compressão é acionada.
3. O histórico de mensagens é dividido em secções preservadas e comprimidas:
   - **Preservado**: prompt de sistema, primeira mensagem do utilizador, mensagem mais recente do utilizador
   - **Comprimido**: tudo o que está entre elas (turnos de raciocínio do assistente, chamadas de ferramentas, resultados de ferramentas)
4. A secção intermédia é resumida utilizando o **mesmo modelo e credencial** — sem necessidade de configuração adicional.
5. O resumo comprimido substitui a secção intermédia como uma única mensagem do assistente.

**Observabilidade:**

Os eventos de compressão aparecem como entradas `Context compressed (N messages → summary)` em:
- A lista de chamadas de ferramentas do **Debug panel** durante a execução em tempo real
- A vista de detalhe da execução no **Execution history**
- O **Traces tab** como uma entrada de trace `context.compression`

A compressão é automática e está sempre ativa para os Nós Agent. **Não** se aplica aos Nós LLM, ao separador Chat nem às sessões do AI Assistant.

## Relacionado

- [Porquê o Heym](../getting-started/why-heym.md) – Como os agentes são executados e permanecem governados em produção
- [Memória Persistente do Agente](../reference/agent-persistent-memory.md) – Grafo de conhecimento por Nó Agent, partilha opcional, API, editor
- [Arquitetura do Agente](../reference/agent-architecture.md) – Sub-agentes, orquestrador, skills, MCP, chamada de ferramentas
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Páginas de revisão públicas, execuções pendentes, fluxo de aprovação/edição/recusa
- [Guardrails](../reference/guardrails.md) – Bloquear categorias de conteúdo não seguro
- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [AI Assistant](../reference/ai-assistant.md) – Interface de Chat para construir workflows com linguagem natural (distinta do Nó Agent)
- [Expression DSL](../reference/expression-dsl.md) – Referenciar dados em prompts
- [Estrutura do Workflow](../reference/workflow-structure.md) – Nós, arestas e formato DSL
- [Quick Start](../getting-started/quick-start.md) – Workflow básico com LLM e expressões
- [Separador Credenciais](../tabs/credentials-tab.md) – Adicionar chaves de API para o agente
- [Separador MCP](../tabs/mcp-tab.md) – Configurar MCP para ferramentas de workflow
