# Aba MCP

A aba **MCP** configura a integração com o Model Context Protocol (MCP). O MCP permite que clientes de IA (Claude, ChatGPT, Gemini, Cursor e qualquer ferramenta compatível com MCP) chamem seus Workflows do Heym como ferramentas.

O Heym oferece suporte a dois modos: um **servidor padrão** que expõe todos os Workflows habilitados para MCP sob um único Endpoint, e **servidores nomeados** que concedem a cada grupo lógico de Workflows sua própria URL dedicada e chave de API.

Ambos os modos podem expor dois tipos de ferramentas: **Workflows** individuais e a **ferramenta de chat do Heym** — todo o motor da [aba Chat](./chat-tab.md) por trás de uma única ferramenta `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Assistir à demonstração do MCP</a></p>

## Servidor MCP Padrão

O servidor padrão está sempre disponível em `{origin}/api/mcp/sse`. Todos os Workflows com o MCP ativado aparecem como ferramentas aqui.

### Chave de API do MCP

- As chaves são armazenadas como resumos SHA-256, portanto o Heym não consegue exibir uma chave existente. A aba informa se uma chave está definida, mas não qual é.
- **Generate** / **Regenerate** – A nova chave é exibida uma única vez, logo após a criação. Copie-a nesse momento; ao recarregar a aba, ela ficará oculta permanentemente.
- Use esta chave ao conectar o Claude Desktop, o Cursor ou outros clientes MCP ao Heym
- Perdeu uma chave? Regenere-a. A chave anterior deixa de funcionar imediatamente.

### Métodos de Conexão

- **API Key** – Use a chave de API do MCP para conexões programáticas. A aba pode copiar uma configuração JSON pronta para uso e inclui um botão **Add to Cursor** para configuração do Cursor com um clique.
- **Claude** – A aba exibe a URL do servidor MCP e as etapas de configuração para o Claude. Deixe OAuth Client ID e Secret em branco; o Claude se registra automaticamente e autentica via OAuth do Heym.
- **ChatGPT** – A aba mostra a URL do servidor MCP e as etapas de configuração para um app do ChatGPT. Ative o modo de desenvolvedor, crie um app com a URL e escolha OAuth; o ChatGPT se registra automaticamente.
- **Gemini** – A aba mostra a URL do servidor MCP e as etapas de configuração para um app personalizado do Gemini: em gemini.google.com, acesse **Settings → Connected Apps → Add a custom app**, cole a URL e deixe **Advanced features** fechado; o Gemini se registra automaticamente e se autentica via Heym OAuth. Depois de conectado, o Heym também funciona no aplicativo móvel do Gemini.

### Toggle de MCP do Workflow

Cada Workflow pode ser exposto como uma ferramenta MCP:

- **Enable** – As ferramentas do Workflow ficam disponíveis para todos os clientes conectados ao servidor padrão
- **Disable** – O Workflow não é exposto

Os cards de Workflow exibem a descrição e uma prévia dos nomes dos campos de entrada, para que você veja o que cada ferramenta espera antes de habilitá-la.


### Execuções na fila e heym_execution_status

Um workflow com um [limite de simultaneidade](../reference/webhooks.md#concurrency-limit-and-queued-runs) pode estar ocupado quando um cliente o chama. A chamada retorna imediatamente um resultado que não é um erro:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

O cliente faz polling da ferramenta `heym_execution_status` com esse `execution_id`. Ela retorna o mesmo corpo da [URL de status](../reference/webhooks.md#status-url): `queued` com a posição atual, `running`, e depois `success` ou `error` com as saídas. Só encontra execuções de workflows que o mesmo servidor expõe. A ferramenta é listada no servidor padrão e em cada servidor nomeado apenas enquanto pelo menos um de seus workflows tiver um limite de simultaneidade. Quando a fila do workflow está cheia, a chamada retorna o erro "Concurrency queue is full".
## Ferramenta de Chat do Heym

A seção **Heym Capabilities** transforma o motor da aba Chat em uma única ferramenta MCP chamada `heym_chat`. Habilite-a no servidor padrão, em qualquer servidor nomeado, ou em ambos — cada superfície mantém seu próprio toggle e seleção de modelo.

Quando ativada, `heym_chat` aparece em `tools/list` junto com suas ferramentas de Workflow. Um cliente MCP envia uma mensagem em linguagem natural e o motor do Heym assume a partir daí, com as mesmas capacidades da aba Chat:

- Construir um Workflow, executá-lo em teste com entradas de exemplo, corrigi-lo e concluir quando uma execução passar (veja [Modo Build](#build-mode))
- Inspecionar e executar seus Workflows existentes
- Reportar análises, execuções recentes e agendamentos Cron futuros
- Reportar o histórico de execução de um Workflow: quantas vezes ele foi executado, contagens de status, quando foi executado e, sob solicitação, as entradas, saídas e erros por Nó de uma única execução
- Reportar o que está em execução no momento: quantas execuções estão ativas, seus nomes de Workflow, há quanto tempo cada uma está em execução, o Nó em que cada uma está no momento e um link para a execução ao vivo
- Listar boards, criar cards e ler detalhes de cards na [aba Board](./board-tab.md)
- Listar suas tabelas de dados com suas colunas, criar novas e conectá-las aos Workflows que constrói
- Criar ou atualizar suas credenciais na página própria do Heym (consulte [Credenciais](#credenciais))
- Ler equipes e variáveis globais, e pesquisar a documentação
- Aprovar, editar ou recusar revisões pendentes de human-in-the-loop

Capacidades adicionadas à aba Chat posteriormente tornam-se disponíveis automaticamente por meio de `heym_chat` — não há toggle por capacidade a ser sincronizado.

### Modo Build

O `heym_chat` sempre executa o mecanismo do Chat no modo build. Em uma única chamada, o assistente pode salvar um novo Workflow, executá-lo com entradas de exemplo realistas, ler o relatório de execução, corrigir o que falhou e executá-lo novamente, em até cinco execuções de teste por chamada. Quando a última execução do último salvamento passa, ele finaliza com um resumo de uma frase, e a resposta termina com `Verified: the latest test run of the saved workflow passed.`

Quando uma chamada cria ou edita um workflow, a resposta lista cada um com o link completo para o editor, como `https://heym.example.com/workflows/<id>`, e os links dentro da resposta do assistente também são links completos. Eles usam seu endereço configurado do Heym (`FRONTEND_URL`) e abrem para quem estiver conectado ao Heym com permissão de acesso àquele workflow.

- As execuções de teste são execuções reais. Seus efeitos colaterais acontecem e elas aparecem no histórico de execuções do Workflow como qualquer outra execução.
- Os salvamentos seguem o caminho do editor: uma alteração no grafo mantém o grafo anterior no **Edit History** do Workflow.
- Para alterar um Workflow construído anteriormente, continue a conversa com o mesmo `conversation_id`. O assistente atualiza esse Workflow em vez de criar um novo e só altera Workflows que você pode editar.
- Quando as cinco execuções de teste são usadas, o assistente para e explica o que ainda está falhando.

As tabelas de dados são diferentes. Uma tabela não contém segredos, então `heym_chat` pode listar suas tabelas, perguntar qual delas um Workflow deve usar e criar uma nova com suas colunas. Ele nunca lê ou grava linhas.

### Credenciais

`heym_chat` visualiza as credenciais que você possui e aquelas compartilhadas com você, por nome e tipo, da mesma forma que a aba Chat. Quando um workflow construído precisa de uma credencial, ele pergunta qual usar como uma pergunta no resultado. Responda com o mesmo `conversation_id`.

Para adicionar uma credencial ou atualizar uma que você possui, o assistente abre o formulário de credenciais do Heym em uma página do Heym, `/credentials/setup/<id>`. Você entra no Heym por lá, insere a chave ou conecta a conta e clica em salvar. O valor vai diretamente para o Heym: o cliente MCP e seu modelo aprendem apenas o nome e o tipo da credencial. Não cole chaves no cliente MCP; peça o formulário em vez disso.

| Cliente | O que acontece |
|---------|----------------|
| Suporta elicitação de URL MCP | O cliente pede para você abrir a página do Heym. A chamada aguarda enquanto você preenche o formulário, por até dez minutos, e depois continua com a nova credencial. |
| Qualquer outro | O resultado inclui o link e pede ao cliente para chamar `heym_chat` novamente com `wait_for_credential_form`. Essa chamada aguarda até cinco minutos enquanto você preenche o formulário e depois retoma a conversa. Se o cliente não aguardar, salve o formulário e responda com o mesmo `conversation_id`; a próxima chamada saberá que o formulário foi salvo e qual credencial foi criada. |

A página só abre para a conta do Heym que iniciou a solicitação, portanto um link encaminhado é inútil para qualquer outra pessoa. Um formulário permanece aberto por 24 horas e pode ser recusado diretamente na página. Assim que você salvar ou recusar, a etapa na conversa da aba Chat mostra o resultado.


### Credencial e modelo

`heym_chat` executa o motor na sua conta do Heym, portanto precisa de uma credencial de LLM própria:

| Campo | Comportamento |
|-------|----------|
| **Credential** | Escolha qualquer credencial OpenAI, Google ou Custom à qual você tenha acesso. Pré-preenchida a partir da credencial preferida em [Settings](../reference/user-settings.md) quando você não escolheu uma. |
| **Model** | Carregado a partir da credencial selecionada. Pré-preenchido a partir do seu modelo preferido quando a credencial corresponde. |

Se qualquer um dos dois estiver ausente, a ferramenta ainda aparece em `tools/list`, mas cada chamada retorna um erro informando que você deve concluir a configuração nesta aba.


Os nós LLM e Agent em um workflow construído pelo `heym_chat` rodam nessa credencial e modelo, incluindo credenciais compartilhadas com você, de modo que execuções de teste funcionam sem etapas adicionais de configuração. Quando o `heym_chat` edita um workflow, os nós LLM e Agent que já possuem credencial a mantêm, juntamente com o modelo.
### Argumentos e histórico

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `message` | Sim | A instrução ou pergunta, em linguagem natural. |
| `conversation_id` | Não | Um `conversation_id` de um resultado anterior de `heym_chat`, para continuar aquela conversa. |
| `wait_for_credential_form` | Não | Com `conversation_id`: aguardar até o usuário salvar ou recusar o formulário de credencial aberto pela conversa, e depois enviar `message`. |

Cada chamada é gravada no histórico da sua [aba Chat](./chat-tab.md) como uma conversa normal, marcada com um ícone de plug na lista de conversas. Mensagens, cards de ferramentas e pausas para esclarecimento se parecem exatamente com uma conversa iniciada por você mesmo, e você pode abrir a conversa e continuar falando no navegador. Cada resultado retorna seu `conversation_id` para que o cliente MCP possa continuar a mesma conversa em vez de abrir uma nova a cada chamada.

Quando o assistente precisa de esclarecimento, ele pausa e avisa; responda com as respostas usando o mesmo `conversation_id`.
## Servidores MCP Nomeados

Servidores nomeados permitem segmentar workflows em endpoints MCP isolados. Cada servidor tem sua própria URL e API key, para que diferentes clientes de IA, equipes ou casos de uso possam se conectar exatamente aos workflows de que precisam.

### Criando um Servidor Nomeado

1. Digite um nome no campo de entrada na parte inferior da aba MCP (ex.: **CRM Tools**)
2. Clique em **Create** — um novo card de servidor aparece imediatamente
3. Clique no card para expandi-lo

### Configurações por Servidor

Cada card de servidor exibe:

| Configuração | Descrição |
|---------|-------------|
| **SSE Endpoint** | URL única: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Key independente, exibida uma única vez quando gerada ou regenerada. Copie-a imediatamente; ela é armazenada com hash e não pode ser revelada posteriormente |
| **How to connect** | **Copy JSON** copia a configuração MCP pronta para colar; **Add to Cursor** instala em um clique |
| **Heym Capabilities** | Ative ou desative a ferramenta `heym_chat` para este servidor e escolha sua credencial e modelo |
| **Assigned Workflows** | Ative ou desative quais dos seus workflows este servidor expõe |

### Atribuição de Workflows

A atribuição de workflows é por servidor e independente do toggle do servidor padrão. Um workflow pode ser habilitado no servidor padrão e em múltiplos servidores nomeados simultaneamente, ou em nenhum.

Alternar um workflow o move para o topo da lista de atribuídos, para que a linha que você acabou de alterar permaneça visível em vez de rolar para fora da tela.

### Autenticação

Servidores nomeados suportam os mesmos métodos de autenticação do servidor padrão:

- **Header X-MCP-Key** – Passe a API key do servidor diretamente (clientes de API, Cursor). Somente via header: keys não são aceitas como parâmetro de query `?key=`, porque URLs acabam em logs de acesso, logs de proxy e histórico do navegador.
- **Claude, ChatGPT e Gemini OAuth** – Adicione a URL do servidor aos conectores ou apps personalizados do cliente; deixe as credenciais em branco e o cliente se registra via OAuth automaticamente. O bearer token deve trafegar no header `Authorization`, não como `?token=`.
- **Session token** – Emitido durante o handshake SSE; com escopo restrito ao servidor específico, de modo que tokens de um servidor nomeado não podem acessar outro. Este parâmetro `?session=` de curta duração não é afetado.

### Excluindo um Servidor Nomeado

Clique no ícone **X** no cabeçalho de um card de servidor. A exclusão remove o servidor e todas as suas atribuições de workflow; os workflows em si não são afetados.

## SSE Endpoint

| Servidor | Endpoint |
|--------|----------|
| Padrão | `{origin}/api/mcp/sse` |
| Nomeado | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Ambos os endpoints suportam o transporte SSE (GET, MCP spec 2024-11-05) e o transporte Streamable HTTP (POST, MCP spec 2025-03-26). Claude, ChatGPT e Gemini usam OAuth 2.1 / PKCE para login seguro em ambos.

## Relacionados

- [Why Heym](../getting-started/why-heym.md) – MCP como primitivo de primeira classe no Heym
- [Agent Node](../nodes/agent-node.md) – Nó Agente com suporte a ferramentas MCP
- [Agent Architecture](../reference/agent-architecture.md) – Cliente MCP, despacho de ferramentas, orquestrador
- [Triggers](../reference/triggers.md) – MCP como ponto de entrada de workflow
- [Chat Tab](./chat-tab.md) – O motor por trás da ferramenta `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Crie e gerencie workflows
- [Node Types](../reference/node-types.md) – Visão geral dos nós de IA
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para superfícies do dashboard
