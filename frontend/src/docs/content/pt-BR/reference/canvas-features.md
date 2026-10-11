# Recursos do Canvas

O editor de Workflow oferece diversos recursos para depuração, teste e organização de Nós: **Executar até o Nó**, **Data Pin**, **Logs de Execução**, **Ativar/Desativar** e **Extrair para Sub-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Assistir à demonstração do Editor</a></p>

## Executar até o Nó

Passe o mouse sobre qualquer Nó, exceto uma nota adesiva, e clique em **Run** abaixo dele. O Heym executa esse Nó e suas dependências upstream, deixando os Nós downstream e ramificações não relacionadas intactos. Isso utiliza o modo de teste do canvas, incluindo saídas fixadas e as condições normais de ramificação do Workflow.

Se o caminho selecionado tiver campos de entrada, o painel **Run** à direita será aberto e focará o primeiro campo. Insira os valores e clique em **Run to _rótulo do Nó_** ou pressione **Ctrl+Enter** (Cmd+Enter no macOS). O modo de corpo genérico foca o editor de corpo JSON. Caminhos sem campos de entrada são executados imediatamente, sem abrir o painel. Nós de Entrada fixados reutilizam sua saída fixada sem solicitar entrada.

O painel mantém o alvo selecionado para execuções subsequentes. Escolha **Run full workflow** para limpar o alvo. Os botões de execução ficam desabilitados enquanto uma execução estiver ativa. Um alvo dentro de um loop interrompe a execução quando esse Nó é alcançado pela primeira vez; selecionar um Nó após o loop executa o loop upstream completo.

## Data Pin

O Data Pin permite fixar a saída de um Nó da última execução para que você possa testar Nós downstream sem reexecutar o Nó fixado.

### Onde Encontrá-lo

- **Painel de propriedades** – Selecione um Nó e role até a seção **Pinned Data**
- **Badge do Nó** – Um ícone de alfinete aparece no Nó quando os dados estão fixados

### Ações

| Ação | Descrição |
|--------|-------------|
| **Pin** | Fixa a saída da última execução do Nó (disponível após uma execução) |
| **Clear** | Remove os dados fixados |
| **Edit** | Edite o JSON fixado diretamente; clique em Save para aplicar |

### Comportamento no Modo de Teste

Ao executar um Workflow no modo de teste, os Nós com `pinnedData` pulam a execução e usam a saída fixada. Use isso para:

- Testar a lógica downstream sem chamar APIs externas
- Depurar expressões que referenciam a saída do Nó
- Iterar sobre Prompts ou condições com dados de exemplo fixos

A conclusão de expressões no editor usa dados fixados quando disponíveis para sugerir campos.

## Logs de Execução

O **Painel de Depuração** (gaveta inferior) exibe logs de execução em tempo real durante as execuções do Workflow. Você
também pode abrir uma execução de produção em andamento a partir do diálogo de Histórico ou de um card do Board. O
editor se conecta ao stream SSE dessa execução, restaura os resultados dos Nós concluídos e continua a
exibir animações e logs dos Nós conforme novos Nós iniciam e terminam.

### O Que Ele Exibe

- **Resultados dos Nós** – Status por Nó (`success`, `error`, `skipped`, `running`), tempo de execução e saída
- **Saídas finais** – Saídas agregadas dos Nós [Output](../nodes/output-node.md)
- **Progresso do Agente** – Para Nós [Agent](../nodes/agent-node.md), chamadas de ferramentas passo a passo e raciocínio

### Ações

- **Copy as JSON** – Copia o log de execução completo para a área de transferência
- **Open in JSON editor** – Abre o log no JSON Hero ou JSON Editor Online para inspeção
- **Download generated files** – Se uma skill produziu arquivos para download (`_generated_files`), um botão Download aparece. Um único arquivo é baixado diretamente; múltiplos arquivos abrem um popup de seleção.

### Distinção da Aba Logs

O Painel de Depuração exibe logs de **execução do Workflow** (resultados dos Nós, saídas). A [Aba Logs](../tabs/logs-tab.md) exibe logs do **contêiner Docker** (backend, frontend, banco de dados). <!-- pragma: allowlist secret -->

## Ativar / Desativar

Você pode desativar Nós para que sejam pulados durante a execução. Nós desativados exibem um badge "off" e aparecem esmaecidos.

### Como Alternar

| Método | Descrição |
|--------|-------------|
| **Painel de propriedades** | Selecione o Nó → ícone de Energia (canto superior direito) |
| **Menu de contexto** | Clique com o botão direito no(s) Nó(s) → Disable ou Enable |
| **Teclado** | Selecione o(s) Nó(s) → pressione **D** (consulte [Atalhos de Teclado](./keyboard-shortcuts.md)) |

### Seleção Múltipla

Quando múltiplos Nós estão selecionados, Enable/Disable se aplica a todos eles. O menu de contexto exibe "Enable" se qualquer Nó selecionado estiver desativado, "Disable" se todos estiverem ativados.

### Comportamento em Tempo de Execução

Nós com `active: false` são pulados. Nós downstream não recebem dados de Nós pulados. Use isso para excluir Nós temporariamente sem excluí-los.

Para ativar ou desativar um Nó de dentro de um Workflow em vez de manualmente, use [Disable Node](../nodes/disable-node.md) e [Enable Node](../nodes/enable-node.md).
## Grafo de memória do Agente

Nós [Agente](../nodes/agent-node.md) com **[memória persistente](./agent-persistent-memory.md)** habilitada exibem um controle rosa de **cérebro** no nó. Clique nele para abrir o editor de grafo de memória: as entidades são renderizadas como um grafo animado, direcionado por força e agrupado por tipo de entidade, com seletores pesquisáveis de Origem/Destino para adicionar relacionamentos e um painel de conexões para navegar entre entidades vinculadas. O mesmo diálogo inclui **Compartilhar memória com outros agentes** (workflow → agente → leitura ou leitura/gravação) para [compartilhamento de memória entre agentes](./agent-persistent-memory.md#sharing-with-other-agents). Enquanto o diálogo estiver aberto, o desfazer/refazer do canvas principal fica suspenso, para que a edição do grafo mantenha seu próprio histórico.

**Filtrando o grafo.** O canto superior esquerdo do canvas tem um controle de busca, recolhido em um botão de atalho até você clicar nele ou pressionar **Ctrl/Cmd+F**. Ele corresponde ao nome de uma entidade, seu tipo e cada chave e valor de atributo, bem como ao tipo de um relacionamento (`parent_of`) e suas propriedades; um relacionamento correspondente traz consigo ambas as suas entidades. Todos os termos separados por espaço devem corresponder. Uma entidade correspondente traz consigo toda a sua vizinhança — cada relacionamento do qual participa e a entidade do outro lado de cada um — para que uma correspondência nunca fique como um ponto desconectado. Um relacionamento correspondente traz apenas as duas entidades que ele une e para por aí, já que buscar um tipo de relação é uma pergunta sobre essa relação, e não sobre tudo ao que suas extremidades estão conectadas. Todo o restante é ocultado por completo — não esmaecido — no canvas e na lista **All edges**, e um selo mostra quantas do total de entidades restaram. O **✕** dentro da caixa limpa a consulta primeiro e, em seguida, fecha a caixa em um segundo pressionamento. Escape desfaz da mesma forma, do mais interno para o mais externo: limpa a consulta, depois fecha a caixa de busca, depois sai da visualização expandida do canvas e só fecha o diálogo quando nenhum desses estiver aberto. Limpar restaura o grafo completo com cada entidade de volta onde estava.

**Posicionando entidades manualmente.** Arrastar uma entidade a fixa onde você a soltar, de modo que o layout automático acomoda o restante do grafo ao redor dela em vez de puxá-la de volta. Arrastar a entidade que você selecionou move suas entidades diretamente conectadas junto com ela, mantendo a forma do agrupamento; arrastar qualquer outra entidade move apenas aquela. **Tidy layout** (o botão da varinha) libera todas as entidades fixadas e executa novamente o layout automático.

## Extrair para Sub-Workflow

Converta os nós selecionados em um sub-workflow reutilizável e substitua-os por um nó [Execute](../nodes/execute-node.md).

### Como Usar

1. Selecione um ou mais nós no canvas
2. Clique com o botão direito → **Extract to Sub-Workflow**
3. Insira um nome (e uma descrição opcional) para o novo workflow
4. Clique em **Extract**

### O Que Acontece

- Um novo workflow é criado com os nós selecionados
- Entradas externas (edges vindas de fora da seleção) tornam-se os campos [Input](../nodes/input-node.md) do sub-workflow
- Saídas externas (edges para nós fora da seleção) são mapeadas para o [Output](../nodes/output-node.md) do sub-workflow
- Os nós selecionados são substituídos por um único nó [Execute](../nodes/execute-node.md) que chama o novo workflow
- Os mapeamentos de entrada/saída são preservados automaticamente

### Casos de Uso

- Reutilizar uma sequência de nós em vários workflows
- Simplificar um workflow complexo agrupando lógica relacionada
- Criar sub-workflows modulares e testáveis

## Executar com cURL

O botão **cURL** na barra de ferramentas do editor (canto superior direito) abre um diálogo para montar e copiar um comando cURL para acionar o workflow via API.

- Escolha o modo de corpo da requisição do workflow (`Defined` ou `Generic`)
- Defina o tipo de autenticação (Anonymous, JWT ou Header Auth)
- Configure o cache de resposta e o rate limiting
- Ative ou desative o streaming SSE e personalize as mensagens de início por nó
- Edite o corpo da requisição
- No modo Generic, o painel de execução do canvas usa o mesmo corpo JSON bruto do diálogo cURL
- Clique em **Copy cURL** para copiar o comando pronto para executar

Consulte [Webhooks](./webhooks.md#run-with-curl-dialog) para obter todos os detalhes do diálogo e [SSE Streaming](./sse-streaming.md) para o protocolo de eventos.

## Relacionados

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Todos os atalhos do canvas e do editor
- [Agent Persistent Memory](./agent-persistent-memory.md) – Comportamento e API do grafo de memória
- [Execute Node](../nodes/execute-node.md) – Chama sub-workflows
- [Expression DSL](./expression-dsl.md) – Referências e dados fixados
- [Workflow Structure](./workflow-structure.md) – Formato de nós e edges
- [Download & Import](./download-import.md) – Exporte e importe workflows como JSON
- [Node Types](./node-types.md) – Todos os tipos de nó
- [Logs Tab](../tabs/logs-tab.md) – Logs de contêiner Docker
- [Execution History](./execution-history.md) – Execuções anteriores
- [Templates](../tabs/templates-tab.md) – Salve e reutilize workflows e nós
- [Contextual Showcase](./contextual-showcase.md) – Guia compacto da página disponível no editor
