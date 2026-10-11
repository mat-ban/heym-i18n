# Funcionalidades do Canvas

O editor de workflows disponibiliza várias funcionalidades para depurar, testar e organizar nós: **Executar até ao Nó**, **Data Pin**, **Registos de Execução**, **Ativar/Desativar** e **Extrair para Sub-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Ver demonstração do Editor</a></p>

## Executar até ao Nó

Passe o cursor sobre qualquer nó, exceto uma nota adesiva, e clique em **Run** por baixo do mesmo. O Heym executa esse nó e as suas dependências a montante, deixando os nós a jusante e os ramos não relacionados intactos. Isto utiliza o modo de teste do canvas, incluindo saídas fixadas e as condições normais de ramificação do workflow.

Se o caminho selecionado tiver campos de entrada, o painel **Run** à direita abre-se e foca o primeiro campo. Introduza os valores e, em seguida, clique em **Run to _etiqueta do nó_** ou prima **Ctrl+Enter** (Cmd+Enter no macOS). O modo de corpo genérico foca o editor de corpo JSON. Os caminhos sem campos de entrada são executados imediatamente sem abrir o painel. Os nós Input fixados reutilizam a sua saída fixada sem solicitar entrada.

O painel mantém o alvo selecionado para execuções subsequentes. Escolha **Run full workflow** para limpar o alvo. Os botões de execução ficam desativados enquanto uma execução estiver ativa. Um alvo dentro de um ciclo interrompe a execução quando esse nó é alcançado pela primeira vez; selecionar um nó após o ciclo executa o ciclo completo a montante.

## Data Pin

O Data Pin permite fixar a saída de um nó da última execução, para que possa testar os nós a jusante sem reexecutar o nó fixado.

### Onde Encontrar

- **Painel de propriedades** – Selecione um nó e desloque-se até à secção **Pinned Data**
- **Distintivo do nó** – Um ícone de pino aparece no nó quando os dados estão fixados

### Ações

| Ação | Descrição |
|--------|-------------|
| **Pin** | Fixa a saída da última execução do nó (disponível após uma execução) |
| **Clear** | Remove os dados fixados |
| **Edit** | Edite o JSON fixado diretamente; clique em Save para aplicar |

### Comportamento em Modo de Teste

Ao executar um workflow em modo de teste, os nós com `pinnedData` ignoram a execução e utilizam a saída fixada. Utilize isto para:

- Testar a lógica a jusante sem chamar APIs externas
- Depurar expressões que fazem referência à saída do nó
- Iterar sobre prompts ou condições com dados de amostra fixos

O preenchimento automático de expressões no editor utiliza os dados fixados, quando disponíveis, para sugerir campos.

## Registos de Execução

O **painel de Depuração** (gaveta inferior) mostra registos de execução em tempo real durante as execuções do workflow. Também
pode abrir uma execução de produção em curso a partir do diálogo Histórico ou de um cartão do Board. O
editor liga-se ao fluxo SSE dessa execução, restaura os resultados dos nós concluídos e continua a
mostrar as animações dos nós e os registos à medida que novos nós iniciam e terminam.

### O Que Mostra

- **Resultados dos nós** – Estado por nó (`success`, `error`, `skipped`, `running`), tempo de execução e saída
- **Saídas finais** – Saídas agregadas dos nós [Output](../nodes/output-node.md)
- **Progresso do agente** – Para nós [Agent](../nodes/agent-node.md), chamadas de ferramentas passo a passo e raciocínio

### Ações

- **Copy as JSON** – Copia o registo de execução completo para a área de transferência
- **Open in JSON editor** – Abre o registo no JSON Hero ou JSON Editor Online para inspeção
- **Download generated files** – Se uma skill produziu ficheiros transferíveis (`_generated_files`), aparece um botão Download. Um único ficheiro é transferido diretamente; vários ficheiros abrem uma janela de seleção.

### Distinção em Relação ao Separador Logs

O painel de Depuração mostra registos de **execução do workflow** (resultados dos nós, saídas). O [Separador Logs](../tabs/logs-tab.md) mostra registos do **contentor Docker** (backend, frontend, base de dados). <!-- pragma: allowlist secret -->

## Ativar / Desativar

Pode desativar nós para que sejam ignorados durante a execução. Os nós desativados mostram um distintivo "off" e aparecem esbatidos.

### Como Alternar

| Método | Descrição |
|--------|-------------|
| **Painel de propriedades** | Selecione o nó → ícone Power (canto superior direito) |
| **Menu de contexto** | Clique com o botão direito no(s) nó(s) → Disable ou Enable |
| **Teclado** | Selecione o(s) nó(s) → prima **D** (ver [Atalhos de Teclado](./keyboard-shortcuts.md)) |

### Seleção Múltipla

Quando vários nós estão selecionados, Enable/Disable aplica-se a todos eles. O menu de contexto mostra "Enable" se algum nó selecionado estiver desativado, "Disable" se todos estiverem ativados.

### Comportamento em Tempo de Execução

Os nós com `active: false` são ignorados. Os nós a jusante não recebem dados dos nós ignorados. Utilize isto para excluir temporariamente nós sem os eliminar.

Para ativar ou desativar um nó a partir do interior de um workflow em vez de manualmente, utilize [Disable Node](../nodes/disable-node.md) e [Enable Node](../nodes/enable-node.md).

## Grafo de memória do agente

Os nós [Agente](../nodes/agent-node.md) com **[memória persistente](./agent-persistent-memory.md)** ativada apresentam um controlo **cérebro** cor-de-rosa no nó. Clique nele para abrir o editor do grafo de memória: as entidades são apresentadas como um grafo animado, orientado por forças e agrupado por tipo de entidade, com seletores pesquisáveis de Origem/Destino para adicionar relações e um painel de ligações para saltar entre entidades associadas. A mesma caixa de diálogo inclui **Partilhar memória com outros agentes** (workflow → agente → leitura ou leitura/escrita) para [partilha de memória entre agentes](./agent-persistent-memory.md#sharing-with-other-agents). Enquanto a caixa de diálogo estiver aberta, o anular/refazer do canvas principal é suspenso, para que a edição do grafo mantenha o seu próprio histórico.

**Filtrar o grafo.** O canto superior esquerdo do canvas tem um controlo de pesquisa, recolhido num botão de atalho até clicar nele ou premir **Ctrl/Cmd+F**. Corresponde ao nome de uma entidade, ao seu tipo e a todas as chaves e valores de atributos, bem como ao tipo de uma relação (`parent_of`) e às suas propriedades; uma relação correspondida traz consigo ambas as suas entidades. Todos os termos separados por espaços em branco têm de corresponder. Uma entidade correspondida traz consigo toda a sua vizinhança — todas as relações em que participa e a entidade do lado oposto de cada uma — para que uma correspondência nunca fique como um ponto isolado. Uma relação correspondida traz apenas as duas entidades que une e para aí, uma vez que pesquisar um tipo de relação é uma questão sobre essa relação e não sobre tudo o que está ligado às suas extremidades. Tudo o resto é ocultado por completo — não esbatido — no canvas e na lista **Todas as arestas**, e um distintivo mostra quantas das entidades totais restam. O **✕** dentro da caixa limpa primeiro a consulta e, numa segunda pressão, fecha a caixa. A tecla Escape desfaz pela mesma ordem, do mais interior para o mais exterior: limpa a consulta, depois fecha a caixa de pesquisa, depois sai da vista expandida do canvas e só fecha a caixa de diálogo quando nenhuma dessas estiver aberta. Limpar restaura o grafo completo com todas as entidades de volta ao seu lugar.

**Colocar entidades manualmente.** Arrastar uma entidade fixa-a onde a largar, para que o layout automático assente o resto do grafo à sua volta em vez de a puxar de volta. Arrastar a entidade que tem selecionada move as entidades diretamente ligadas a ela, mantendo a forma do agrupamento; arrastar qualquer outra entidade move apenas essa. **Dispor** (o botão da varinha) liberta todas as entidades fixadas e volta a executar o layout automático.

## Extrair para Sub-Workflow

Converta os nós selecionados num sub-workflow reutilizável e substitua-os por um nó [Executar](../nodes/execute-node.md).

### Como utilizar

1. Selecione um ou mais nós no canvas
2. Clique com o botão direito → **Extrair para Sub-Workflow**
3. Introduza um nome (e uma descrição opcional) para o novo workflow
4. Clique em **Extrair**

### O que acontece

- É criado um novo workflow com os nós selecionados
- As entradas externas (arestas provenientes de fora da seleção) tornam-se os campos [Entrada](../nodes/input-node.md) do sub-workflow
- As saídas externas (arestas para nós fora da seleção) são mapeadas para a [Saída](../nodes/output-node.md) do sub-workflow
- Os nós selecionados são substituídos por um único nó [Executar](../nodes/execute-node.md) que chama o novo workflow
- Os mapeamentos de entrada/saída são preservados automaticamente

### Casos de utilização

- Reutilizar uma sequência de nós em vários workflows
- Simplificar um workflow complexo agrupando lógica relacionada
- Criar sub-workflows modulares e testáveis

## Executar com cURL

O botão **cURL** na barra de ferramentas do editor (canto superior direito) abre uma caixa de diálogo para construir e copiar um comando cURL para acionar o workflow via API.

- Escolha o modo do corpo do pedido do workflow (`Defined` ou `Generic`)
- Defina o tipo de autenticação (Anonymous, JWT ou Header Auth)
- Configure a colocação em cache de respostas e a limitação de taxa
- Ative ou desative a transmissão SSE e personalize as mensagens de início por nó
- Edite o corpo do pedido
- No modo Generic, o painel de execução do canvas utiliza o mesmo corpo JSON em bruto que a caixa de diálogo cURL
- Clique em **Copiar cURL** para copiar o comando pronto a executar

Consulte [Webhooks](./webhooks.md#run-with-curl-dialog) para obter todos os detalhes da caixa de diálogo e [Transmissão SSE](./sse-streaming.md) para o protocolo de eventos.

## Relacionado

- [Atalhos de teclado](./keyboard-shortcuts.md) – Todos os atalhos do canvas e do editor
- [Memória persistente do agente](./agent-persistent-memory.md) – Comportamento e API do grafo de memória
- [Nó Executar](../nodes/execute-node.md) – Chama sub-workflows
- [DSL de expressões](./expression-dsl.md) – Referências e dados fixados
- [Estrutura do workflow](./workflow-structure.md) – Formato de nós e arestas
- [Transferir e importar](./download-import.md) – Exportar e importar workflows como JSON
- [Tipos de nó](./node-types.md) – Todos os tipos de nó
- [Separador Registos](../tabs/logs-tab.md) – Registos do contentor Docker
- [Histórico de execuções](./execution-history.md) – Execuções anteriores
- [Modelos](../tabs/templates-tab.md) – Guardar e reutilizar workflows e nós
- [Apresentação contextual](./contextual-showcase.md) – Guia de página compacto disponível no editor
