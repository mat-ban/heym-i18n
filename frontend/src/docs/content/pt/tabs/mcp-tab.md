# Separador MCP

O separador **MCP** configura a integração com o Model Context Protocol (MCP). O MCP permite que clientes de IA (Claude, Cursor e qualquer ferramenta compatível com MCP) invoquem os seus workflows Heym como ferramentas.

O Heym suporta dois modos: um **servidor predefinido** que expõe todos os workflows com MCP ativado sob um único endpoint, e **servidores nomeados** que atribuem a cada grupo lógico de workflows o seu próprio URL dedicado e chave de API.

Ambos os modos podem expor dois tipos de ferramentas: **workflows** individuais e a **ferramenta de chat do Heym** — todo o motor do [separador Chat](./chat-tab.md) por trás de uma única ferramenta `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Ver demonstração do MCP</a></p>

## Servidor MCP Predefinido

O servidor predefinido está sempre disponível em `{origin}/api/mcp/sse`. Todos os workflows com o MCP ativado aparecem aqui como ferramentas.

### Chave de API do MCP

- As chaves são armazenadas como resumos SHA-256, pelo que o Heym não consegue mostrar-lhe uma chave existente. O separador indica se está definida, não qual é o seu valor.
- **Gerar** / **Regenerar** – A nova chave é apresentada uma única vez, imediatamente após a sua criação. Copie-a nesse momento; ao recarregar o separador, a chave deixa de estar visível permanentemente.
- Utilize esta chave ao ligar o Claude Desktop, o Cursor ou outros clientes MCP ao Heym
- Perdeu uma chave? Regenera-a. A chave anterior deixa de funcionar imediatamente.

### Métodos de Ligação

- **Chave de API** – Utilize a chave de API do MCP para ligações programáticas. O separador permite copiar uma configuração JSON pronta a utilizar e inclui um botão **Adicionar ao Cursor** para uma configuração do Cursor com um único clique.
- **Claude** – O separador apresenta o URL do servidor MCP e os passos de configuração para o Claude. Deixe os campos OAuth Client ID e Secret em branco; o Claude regista-se automaticamente e autentica-se através do OAuth do Heym.

### Ativação do MCP por Workflow

Cada workflow pode ser exposto como uma ferramenta MCP:

- **Ativar** – As ferramentas do workflow ficam disponíveis para todos os clientes ligados ao servidor predefinido
- **Desativar** – O workflow não é exposto

Os cartões dos workflows apresentam a descrição e uma pré-visualização dos nomes dos campos de entrada, para que possa ver o que cada ferramenta espera antes de a ativar.

## Ferramenta de Chat do Heym

A secção **Capacidades do Heym** transforma o motor do separador Chat numa única ferramenta MCP denominada `heym_chat`. Ative-a no servidor predefinido, em qualquer servidor nomeado, ou em ambos — cada superfície mantém a sua própria ativação e seleção de modelo.

Quando está ativada, `heym_chat` aparece em `tools/list` juntamente com as ferramentas dos seus workflows. Um cliente MCP envia uma mensagem em linguagem natural e o motor do Heym encarrega-se do resto, com as mesmas capacidades do separador Chat:

- Construir, editar, inspecionar e executar workflows através do Workflow AI Builder
- Reportar análises, execuções recentes e agendamentos cron futuros
- Reportar o histórico de execuções de um workflow: quantas vezes foi executado, contagens por estado, quando foi executado e, a pedido, as entradas, saídas e erros por nó de uma única execução
- Reportar o que está a ser executado neste momento: quantas execuções estão ativas, os nomes dos respetivos workflows, há quanto tempo cada uma está em execução, o nó em que cada uma se encontra atualmente e uma ligação para a execução em direto
- Listar quadros, criar cartões e ler o detalhe dos cartões no [separador Board](./board-tab.md)
- Listar as suas tabelas de dados com as respetivas colunas, criar novas e integrá-las nos workflows que constrói
- Ler equipas e variáveis globais e pesquisar na documentação
- Aprovar, editar ou recusar revisões pendentes de human-in-the-loop

As capacidades adicionadas posteriormente ao separador Chat ficam automaticamente disponíveis através de `heym_chat` — não existe qualquer ativação por capacidade a manter sincronizada.

As credenciais permanecem na interface: `heym_chat` nunca as lista, escolhe ou cria. Quando constrói ou edita um workflow, os novos nós que necessitam de uma credencial são deixados em branco e a resposta nomeia-os, para que possa defini-los no editor.

As tabelas de dados são diferentes. Uma tabela não contém segredos, pelo que `heym_chat` pode listar as suas tabelas, perguntar qual delas um workflow deve utilizar e criar uma nova com as respetivas colunas. Nunca lê nem escreve linhas.

### Credencial e modelo

`heym_chat` executa o motor na sua conta Heym, pelo que necessita de uma credencial LLM própria:

| Campo | Comportamento |
|-------|----------|
| **Credencial** | Escolha qualquer credencial OpenAI, Google ou Personalizada a que tenha acesso. Pré-preenchida a partir da credencial preferida em [Definições](../reference/user-settings.md) quando ainda não escolheu nenhuma. |
| **Modelo** | Carregado a partir da credencial selecionada. Pré-preenchido a partir do seu modelo preferido quando a credencial corresponde. |

Se algum destes estiver em falta, a ferramenta continua a aparecer em `tools/list`, mas cada chamada devolve um erro a indicar que deve concluir a configuração neste separador.

### Argumentos e histórico

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `message` | Sim | A instrução ou pergunta, em linguagem natural. |
| `conversation_id` | Não | Um `conversation_id` de um resultado anterior de `heym_chat`, para continuar essa conversa. |

Cada chamada é registada no histórico do seu [separador Chat](./chat-tab.md) como uma conversa normal, marcada com um ícone de ficha na lista de conversas. As mensagens, os cartões de ferramentas e as pausas para esclarecimento são exatamente iguais aos de uma conversa iniciada por si, e pode abrir a conversa e continuar a falar no navegador. Cada resultado devolve o respetivo `conversation_id`, para que o cliente MCP possa continuar a mesma conversa em vez de abrir uma nova a cada chamada.

Quando o assistente necessita de esclarecimento, faz uma pausa e indica-o; responda com as respostas utilizando o mesmo `conversation_id`.

## Servidores MCP com Nome

Os servidores com nome permitem segmentar workflows em endpoints MCP isolados. Cada servidor tem o seu próprio URL e chave de API, para que diferentes clientes de IA, equipas ou casos de utilização se possam ligar exatamente aos workflows de que necessitam.

### Criar um Servidor com Nome

1. Introduza um nome no campo de entrada na parte inferior do separador MCP (por exemplo, **CRM Tools**)
2. Clique em **Create** — aparece imediatamente um novo cartão de servidor
3. Clique no cartão para o expandir

### Definições por Servidor

Cada cartão de servidor apresenta:

| Definição | Descrição |
|---------|-------------|
| **SSE Endpoint** | URL único: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Chave independente, apresentada uma única vez quando é gerada ou regenerada. Copie-a de imediato; é armazenada com hash e não pode ser revelada posteriormente |
| **How to connect** | **Copy JSON** copia a configuração MCP pronta a colar; **Add to Cursor** instala-a com um clique |
| **Heym Capabilities** | Ative ou desative a ferramenta `heym_chat` para este servidor e escolha a respetiva credencial e modelo |
| **Assigned Workflows** | Ative ou desative quais dos seus workflows este servidor expõe |

### Atribuição de Workflows

A atribuição de workflows é feita por servidor e é independente do interruptor do servidor predefinido. Um workflow pode estar ativo no servidor predefinido e em vários servidores com nome em simultâneo, ou em nenhum.

Ao ativar ou desativar um workflow, este passa para o topo da lista de atribuídos, para que a linha que acabou de alterar permaneça visível em vez de desaparecer ao fazer scroll.

### Autenticação

Os servidores com nome suportam os mesmos métodos de autenticação que o servidor predefinido:

- **Cabeçalho X-MCP-Key** – Passe a chave de API do servidor diretamente (clientes de API, Cursor). Apenas por cabeçalho: as chaves não são aceites como parâmetro de consulta `?key=`, porque os URLs acabam em registos de acesso, registos de proxy e histórico do navegador.
- **Claude OAuth** – Adicione o URL do servidor às integrações do Claude; deixe as credenciais em branco e o Claude regista-se automaticamente via OAuth. O bearer token tem de ser enviado no cabeçalho `Authorization`, e não como `?token=`.
- **Session token** – Emitido durante o handshake SSE; limitado ao servidor específico, para que os tokens de um servidor com nome não possam aceder a outro. Este parâmetro `?session=` de curta duração não é afetado.

### Eliminar um Servidor com Nome

Clique no ícone **X** no cabeçalho de um cartão de servidor. A eliminação remove o servidor e todas as suas atribuições de workflows; os workflows em si não são afetados.

## SSE Endpoint

| Servidor | Endpoint |
|--------|----------|
| Predefinido | `{origin}/api/mcp/sse` |
| Com nome | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Ambos os endpoints suportam o transporte SSE (GET, especificação MCP 2024-11-05) e o transporte Streamable HTTP (POST, especificação MCP 2025-03-26). O Claude utiliza OAuth 2.1 / PKCE para início de sessão seguro em ambos.

## Relacionado

- [Why Heym](../getting-started/why-heym.md) – MCP como primitiva de primeira classe no Heym
- [Agent Node](../nodes/agent-node.md) – Nó de agente com suporte de ferramentas MCP
- [Agent Architecture](../reference/agent-architecture.md) – Cliente MCP, despacho de ferramentas, orquestrador
- [Triggers](../reference/triggers.md) – MCP como ponto de entrada de um workflow
- [Chat Tab](./chat-tab.md) – O motor por trás da ferramenta `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Criar e gerir workflows
- [Node Types](../reference/node-types.md) – Visão geral dos nós de IA
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para as superfícies do dashboard
