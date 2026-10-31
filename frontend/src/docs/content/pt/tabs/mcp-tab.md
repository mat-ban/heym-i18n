# Separador MCP / A2A / A2A

O separador **MCP** configura a integração com o Model Context Protocol (MCP), e como servidores [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) aos quais outros agentes podem delegar tarefas. O MCP permite que clientes de IA (Claude, ChatGPT, Gemini, Cursor e qualquer ferramenta compatível com MCP) invoquem os seus workflows Heym como ferramentas.

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
- **ChatGPT** – O separador mostra o URL do servidor MCP e os passos de configuração para uma aplicação ChatGPT. Ative o modo de programador, crie uma aplicação com o URL e escolha OAuth; o ChatGPT regista-se automaticamente.
- **Gemini** – O separador mostra o URL do servidor MCP e os passos de configuração para uma aplicação personalizada do Gemini: em gemini.google.com, aceda a **Settings → Connected Apps → Add a custom app**, cole o URL e deixe **Advanced features** fechado; o Gemini regista-se automaticamente e autentica-se via Heym OAuth. Uma vez ligado, o Heym também funciona na aplicação móvel do Gemini.

### Ativação do MCP por Workflow

Cada workflow pode ser exposto como uma ferramenta MCP:

- **Ativar** – As ferramentas do workflow ficam disponíveis para todos os clientes ligados ao servidor predefinido
- **Desativar** – O workflow não é exposto

Os cartões dos workflows apresentam a descrição e uma pré-visualização dos nomes dos campos de entrada, para que possa ver o que cada ferramenta espera antes de a ativar.


### Execuções em fila e heym_execution_status

Um workflow com um [limite de concorrência](../reference/webhooks.md#concurrency-limit-and-queued-runs) pode estar ocupado quando um cliente o chama. A chamada retorna imediatamente um resultado que não é um erro:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

O cliente consulta a ferramenta `heym_execution_status` com esse `execution_id`. Ela retorna o mesmo corpo do [URL de estado](../reference/webhooks.md#status-url): `queued` com a posição atual, `running`, e depois `success` ou `error` com as saídas. Só localiza execuções de workflows expostos pelo mesmo servidor. A ferramenta é listada no servidor predefinido e em cada servidor nomeado apenas enquanto pelo menos um dos seus workflows tiver um limite de concorrência. Quando a fila do workflow está cheia, a chamada retorna o erro "Concurrency queue is full".
## Agente Heym

A secção **Capacidades do Heym** transforma o motor do separador Chat numa única ferramenta MCP denominada `heym_chat`. Ative-a no servidor predefinido, em qualquer servidor nomeado, ou em ambos — cada superfície mantém a sua própria ativação e seleção de modelo.

Quando está ativada, `heym_chat` aparece em `tools/list` juntamente com as ferramentas dos seus workflows. Um cliente MCP envia uma mensagem em linguagem natural e o motor do Heym encarrega-se do resto, com as mesmas capacidades do separador Chat:

- Construir um workflow, testá-lo com entradas de exemplo, corrigi-lo e concluir quando uma execução for bem-sucedida (consulte [Modo Build](#build-mode))
- Inspecionar e executar os seus workflows existentes
- Reportar análises, execuções recentes e agendamentos cron futuros
- Explicar onde os workflows falham e por que motivo são lentos: os workflows que mais executaram, que mais falharam e os mais lentos, bem como os tipos de nós com maior tempo, erros e chamadas nas últimas 1, 3 ou 6 horas, 24 horas, 7 ou 30 dias, ou desde sempre
- Reportar o histórico de execuções de um workflow: quantas vezes foi executado, contagens por estado, quando foi executado e, a pedido, as entradas, saídas e erros por nó de uma única execução
- Reportar o que está a ser executado neste momento: quantas execuções estão ativas, os nomes dos respetivos workflows, há quanto tempo cada uma está em execução, o nó em que cada uma se encontra atualmente e uma ligação para a execução em direto
- Listar quadros, criar cartões e ler o detalhe dos cartões no [separador Board](./board-tab.md)
- Listar os seus dashboards (páginas do Heym Work) e respetivos widgets, identificar em que dashboard se encontra um workflow, adicionar um novo widget e criar o seu workflow, colocar um workflow existente como widget num dashboard, renomear ou eliminar widgets ou organizar o esquema (ver [Dashboard › A partir do Chat e MCP](./dashboard-tab.md#from-chat-and-mcp))
- Inspecionar tabelas de dados e linhas, criar tabelas, adicionar ou remover colunas, inserir, atualizar ou eliminar linhas e interligar tabelas em workflows
- Criar, editar e executar suites de avaliação de prompts e de agentes ([Eval suites](./evals-tab.md#from-chat-and-mcp)), incluindo a linha de base de um agente: reportada, construída a partir de execuções ou especificada numericamente. O resultado lista a ligação de Evals de cada suite guardada.
- Criar ou atualizar as suas credenciais na página própria do Heym (consulte [Credenciais](#credenciais))
- Ler equipas e variáveis globais e pesquisar na documentação
- Aprovar, editar ou recusar revisões pendentes de human-in-the-loop

As capacidades adicionadas posteriormente ao separador Chat ficam automaticamente disponíveis através de `heym_chat` — não existe qualquer ativação por capacidade a manter sincronizada.

Estas capacidades são executadas dentro de `heym_chat`: `tools/list` apresenta `heym_chat` e as suas ferramentas de workflow, nunca as ferramentas internas do chat, como as suites de avaliação.

### Modo Build

O `heym_chat` executa sempre o motor de Chat em modo build. Numa única chamada, o assistente pode guardar um novo workflow, executá-lo com entradas de exemplo realistas, ler o relatório de execução, corrigir o que falhou e executá-lo novamente, até cinco execuções de teste por chamada. Quando a última execução da última gravação é bem-sucedida, termina com um resumo de uma frase e a resposta conclui com `Verified: the latest test run of the saved workflow passed.`

Quando uma chamada cria ou edita um workflow, a resposta lista cada um com a respetiva ligação completa do editor, tal como `https://heym.example.com/workflows/<id>`, e as ligações na resposta do assistente são também ligações completas. Utilizam o seu endereço Heym configurado (`FRONTEND_URL`) e abrem para utilizadores com sessão iniciada no Heym que tenham acesso a esse workflow.

- As execuções de teste são execuções reais. Os seus efeitos secundários ocorrem e aparecem no histórico de execuções do workflow como qualquer outra execução.
- As gravações seguem o caminho do editor: uma alteração ao grafo mantém o grafo anterior no **Edit History** do workflow.
- Para alterar um workflow construído anteriormente, continue o tópico com o mesmo `conversation_id`. O assistente atualiza esse workflow em vez de criar um novo e apenas altera workflows que tenha permissão para editar.
- Quando as cinco execuções de teste se esgotam, o assistente para e explica o que continua a falhar.

As tabelas de dados são diferentes. Uma tabela não contém segredos, pelo que `heym_chat` pode listar as suas tabelas, perguntar qual delas um workflow deve utilizar e criar uma nova com as respetivas colunas. Nunca lê nem escreve linhas.

### Credenciais

`heym_chat` vê as credenciais que possui e as partilhadas consigo, por nome e tipo, da mesma forma que o separador Chat. Quando um workflow que constrói necessita de uma credencial, pergunta qual utilizar através de uma questão no resultado. Responda com o mesmo `conversation_id`.

Para adicionar uma credencial ou atualizar uma sua, o assistente abre o formulário de credenciais do Heym numa página Heym, `/credentials/setup/<id>`. Inicia sessão aí, introduz a chave ou liga a conta e guarda. O valor vai diretamente para o Heym: o cliente MCP e o respetivo modelo apenas tomam conhecimento do nome e tipo da credencial. Não cole chaves no cliente MCP; peça antes o formulário.

| Cliente | O que acontece |
|---------|----------------|
| Suporta elicitação de URL MCP | O cliente solicita que abra a página do Heym. A chamada aguarda enquanto preenche o formulário, até dez minutos, continuando depois com a nova credencial. |
| Qualquer outro | O resultado inclui a ligação e pede ao cliente para chamar novamente `heym_chat` com `wait_for_credential_form`. Essa chamada aguarda até cinco minutos enquanto preenche o formulário e depois retoma a conversa. Se o cliente não aguardar, guarde o formulário e responda com o mesmo `conversation_id`; a próxima chamada saberá que o formulário foi guardado e qual credencial foi criada. |

A página só abre para a conta Heym que iniciou o pedido, pelo que uma ligação reencaminhada é inútil para qualquer outra pessoa. Um formulário fica disponível durante 24 horas e pode ser recusado a partir da página. Assim que guardar ou recusar, o passo na conversa do separador Chat mostra o resultado.


### Credencial e modelo

`heym_chat` executa o motor na sua conta Heym, pelo que necessita de uma credencial LLM própria:

| Campo | Comportamento |
|-------|----------|
| **Credencial** | Escolha qualquer credencial OpenAI, Google ou Personalizada a que tenha acesso. Pré-preenchida a partir da credencial preferida em [Definições](../reference/user-settings.md) quando ainda não escolheu nenhuma. |
| **Modelo** | Carregado a partir da credencial selecionada. Pré-preenchido a partir do seu modelo preferido quando a credencial corresponde. |

Se algum destes estiver em falta, a ferramenta continua a aparecer em `tools/list`, mas cada chamada devolve um erro a indicar que deve concluir a configuração neste separador.


Os nós LLM e Agent num workflow construído por `heym_chat` são executados com esta credencial e modelo, incluindo credenciais partilhadas consigo, para que as execuções de teste funcionem sem etapas adicionais de configuração. Quando `heym_chat` edita um workflow, os nós LLM e Agent que já possuem uma credencial mantêm-na juntamente com o seu modelo.
### Argumentos e histórico

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `message` | Sim | A instrução ou pergunta, em linguagem natural. |
| `conversation_id` | Não | Um `conversation_id` de um resultado anterior de `heym_chat`, para continuar essa conversa. |
| `wait_for_credential_form` | Não | Com `conversation_id`: aguardar até que o utilizador guarde ou recuse o formulário de credencial aberto pelo tópico e depois enviar `message`. |

Cada chamada é registada no histórico do seu [separador Chat](./chat-tab.md) como uma conversa normal, marcada com um ícone de ficha na lista de conversas. As mensagens, os cartões de ferramentas e as pausas para esclarecimento são exatamente iguais aos de uma conversa iniciada por si, e pode abrir a conversa e continuar a falar no navegador. Cada resultado devolve o respetivo `conversation_id`, para que o cliente MCP possa continuar a mesma conversa em vez de abrir uma nova a cada chamada.

Quando o assistente necessita de esclarecimento, faz uma pausa e indica-o; responda com as respostas utilizando o mesmo `conversation_id`.

### Ativar A2A

Enquanto o Agente Heym estiver ativo, o cartão apresenta a caixa de verificação **Ativar A2A**. Assinale-a para permitir que outros agentes enviem tarefas ao Agente Heym através do protocolo Agent2Agent (A2A 1.0). O cartão apresenta então o URL do **Agent Card** e o **endpoint JSON-RPC**, cada um com um botão de cópia, e um comando `curl` que obtém o cartão. O A2A utiliza a mesma chave e autenticação OAuth do MCP. Desativar o agente desativa igualmente o A2A. Consulte [A2A](../reference/a2a.md) para métodos, estados de tarefas e um exemplo prático.

### Progresso

Uma chamada longa a `heym_chat` comunica a atividade do agente como progresso MCP (`notifications/progress`), com as mesmas palavras apresentadas no separador Chat, por exemplo `A testar o workflow · tentativa 2/5`. Os clientes que reiniciam o seu tempo limite a cada notificação de progresso continuam a aguardar enquanto o agente trabalha.

### Ativar A2A

Enquanto o Agente Heym estiver ativo, o cartão apresenta a caixa de verificação **Ativar A2A**. Assinale-a para permitir que outros agentes enviem tarefas ao Agente Heym através do protocolo Agent2Agent (A2A 1.0). O cartão apresenta então o URL do **Agent Card** e o **endpoint JSON-RPC**, cada um com um botão de cópia, e um comando `curl` que obtém o cartão. O A2A utiliza a mesma chave e autenticação OAuth do MCP. Desativar o agente desativa igualmente o A2A. Consulte [A2A](../reference/a2a.md) para métodos, estados de tarefas e um exemplo prático.

### Progresso

Uma chamada longa a `heym_chat` comunica a atividade do agente como progresso MCP (`notifications/progress`), com as mesmas palavras apresentadas no separador Chat, por exemplo `A testar o workflow · tentativa 2/5`. Os clientes que reiniciam o seu tempo limite a cada notificação de progresso continuam a aguardar enquanto o agente trabalha.

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
| **Heym Capabilities** | Ative ou desative o Agente Heym (`heym_chat`) para este servidor e selecione a sua credencial e modelo |
| **Ativar A2A** | Interruptor A2A próprio deste servidor, com o seu próprio Agent Card em `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Ativar A2A** | Interruptor A2A próprio deste servidor, com o seu próprio Agent Card em `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Assigned Workflows** | Ative ou desative quais dos seus workflows este servidor expõe |

### Atribuição de Workflows

A atribuição de workflows é feita por servidor e é independente do interruptor do servidor predefinido. Um workflow pode estar ativo no servidor predefinido e em vários servidores com nome em simultâneo, ou em nenhum.

Ao ativar ou desativar um workflow, este passa para o topo da lista de atribuídos, para que a linha que acabou de alterar permaneça visível em vez de desaparecer ao fazer scroll.

### Autenticação

Os servidores com nome suportam os mesmos métodos de autenticação que o servidor predefinido:

- **Cabeçalho X-MCP-Key** – Passe a chave de API do servidor diretamente (clientes de API, Cursor). Apenas por cabeçalho: as chaves não são aceites como parâmetro de consulta `?key=`, porque os URLs acabam em registos de acesso, registos de proxy e histórico do navegador.
- **Claude, ChatGPT e Gemini OAuth** – Adicione o URL do servidor aos conectores ou aplicações personalizadas do cliente; deixe as credenciais em branco e o cliente regista-se automaticamente via OAuth. O bearer token tem de ser enviado no cabeçalho `Authorization`, e não como `?token=`.
- **Session token** – Emitido durante o handshake SSE; limitado ao servidor específico, para que os tokens de um servidor com nome não possam aceder a outro. Este parâmetro `?session=` de curta duração não é afetado.

### Eliminar um Servidor com Nome

Clique no ícone **X** no cabeçalho de um cartão de servidor. A eliminação remove o servidor e todas as suas atribuições de workflows; os workflows em si não são afetados.

## SSE Endpoint

| Servidor | Endpoint |
|--------|----------|
| Predefinido | `{origin}/api/mcp/sse` |
| Com nome | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Ambos os endpoints suportam o transporte SSE (GET, especificação MCP 2024-11-05) e o transporte Streamable HTTP (POST, especificação MCP 2025-03-26). O Claude, o ChatGPT e o Gemini utilizam OAuth 2.1 / PKCE para início de sessão seguro em ambos.

## Relacionado

- [Why Heym](../getting-started/why-heym.md) – MCP como primitiva de primeira classe no Heym
- [Agent Node](../nodes/agent-node.md) – Nó de agente com suporte de ferramentas MCP
- [Agent Architecture](../reference/agent-architecture.md) – Cliente MCP, despacho de ferramentas, orquestrador
- [Triggers](../reference/triggers.md) – MCP como ponto de entrada de um workflow
- [Chat Tab](./chat-tab.md) – O motor por trás da ferramenta `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Criar e gerir workflows
- [Node Types](../reference/node-types.md) – Visão geral dos nós de IA
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para as superfícies do dashboard