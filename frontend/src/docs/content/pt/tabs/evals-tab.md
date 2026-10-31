# Separador Avaliações

O separador **Avaliações** é uma página separada em `/evals`. Permite criar conjuntos de avaliação, definir casos de teste e executar avaliações nos seus workflows de [Agente](../nodes/agent-node.md). Uma [suite de agentes](#agent-suites) executa um agente ou lê as suas execuções reais, verificando as ferramentas que chama, a sua latência, o seu custo em USD, os seus tokens e o seu número de chamadas de ferramentas.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Ver demonstração de Avaliações</a></p>

## Acesso

- Clique em **Avaliações** na barra de separadores do painel
- Ou navegue para `/evals`
- Ou utilize **Ctrl+K** (Cmd+K) e selecione "Avaliações" na paleta de comandos

## Conjuntos de Avaliação

- **Nova suite** – Escolha **Suite de prompts** para testar um prompt de sistema entre modelos, ou **Suite de agentes** para verificar as execuções reais de um agente (ver [Suites de agentes](#agent-suites))
- **Seletor de suites** – Lista suites de prompts e de agentes em conjunto com o tipo ao lado de cada nome; digite para pesquisar
- **Criar conjunto** – Defina um conjunto com um nome e uma descrição
- **Selecionar workflow** – Escolha qual o workflow a avaliar
- **Selecionar credencial** – Chave de API para executar o workflow
- **Prompt de sistema** – Edite o prompt de sistema ao nível do conjunto diretamente no painel esquerdo
- **Otimizar Prompt** – Peça a um LLM para melhorar o prompt de sistema atual

## Casos de Teste

- Adicione casos de teste com prompts de entrada e saídas esperadas
- Cada caso pode ter um valor esperado personalizado para comparação
- Edite ou elimine casos do conjunto
- **Gerar Dados de Teste** – Utilize a credencial/modelo selecionado para criar automaticamente casos de teste a partir do prompt do conjunto

## Executar Avaliações

- **Selecione um ou mais modelos** – Execute o mesmo conjunto contra vários modelos numa única avaliação
- **Método de pontuação** – Escolha `Exact Match`, `Contains` ou `LLM-as-Judge`
- **Juiz** – Para `LLM-as-Judge`, selecione opcionalmente uma credencial OpenAI, OpenAI compatível (Personalizada), Gemini (Google) ou [Modelo de Decisão](../nodes/decision-node.md) e introduza o modelo do juiz (por exemplo `gpt-4o-mini` ou `jev-latest`) para pontuar com um juiz independente
- **Execuções por teste** – Repita cada caso de teste várias vezes numa única execução
- **Definições memorizadas** – Uma suite abre com as definições da sua execução mais recente: credencial, modelos, método de pontuação e juiz, temperatura, esforço de raciocínio e execuções por teste. Abrir uma execução anterior carrega essas definições, pelo que **Reexecutar avaliações** repete a mesma
- **Temperatura** – Defina a temperatura do modelo (`Exact Match` e `Contains`)
- **Esforço de raciocínio** – Defina o esforço de raciocínio para modelos de raciocínio, de Baixo a Muito alto e Máx tal como nos nós LLM e Agent (`Exact Match` e `Contains`)

### LLM-as-Judge

Com um juiz, cada modelo responde à entrada de teste apenas com o prompt do conjunto, e depois o juiz avalia quão próxima a resposta está da saída esperada, de 0 a 100:

- **Um juiz modelo** (OpenAI, OpenAI compatível ou Gemini) lê a pergunta, a saída esperada e a resposta, e devolve uma pontuação com uma justificação de uma linha. É executado à temperatura `0`, ou com esforço de raciocínio `low` para um modelo de raciocínio, para que a mesma resposta obtenha o mesmo veredicto.
- **Um juiz modelo de decisão** avalia a resposta segundo uma rubrica de cinco níveis, desde *Completamente errado* até *Correspondência total*. A pontuação é a posição ponderada pela probabilidade nessa rubrica, pelo que provém de uma distribuição calculada pelo modelo e não de um número por ele escrito.

O cartão ao passar o cursor sobre a célula mostra o motivo do juiz ou, para um modelo de decisão, o nível, a pontuação e a respetiva confiança. A latência e os tokens descrevem o modelo sob teste; as chamadas do próprio juiz surgem em [Trilhos](./traces-tab.md) sob a origem **Avaliações**. O seletor de juiz omite credenciais Model Router, uma vez que um juiz tem de ser um modelo fixo único. A credencial para os modelos sob teste pode ser um [Model Router](../reference/credentials.md#model-router-auto-model): o seu modelo **Auto** seleciona um modelo por pedido, exatamente como acontece num workflow.

Sem um juiz, cada modelo responde e pontua a sua própria resposta num único pedido.

A temperatura e o esforço de raciocínio ficam ocultos neste modo, e a execução utiliza definições fixas: temperatura `0.7` para modelos padrão, e esforço de raciocínio `medium` para modelos de raciocínio (`low` quando pontuam as suas próprias respostas).

## Resultados

- Veja aprovado/reprovado por caso de teste
- Inspecione as saídas reais versus as esperadas
- Compare as saídas por modelo lado a lado quando uma execução inclui vários modelos
- Reveja o histórico de execuções de avaliações anteriores; uma execução `LLM-as-Judge` mostra o seu modelo juiz na lista de histórico
- Abra execuções históricas a partir do painel de resultados e inspecione instantâneos guardados de prompt/entrada/saída
- Abrir uma execução anterior carrega o seu método de pontuação e juiz no painel esquerdo, para que **Reexecutar Avaliações** repita a mesma avaliação
- **Exportar** descarrega a execução como JSON, incluindo `judge_credential_id` e `judge_model`

## Agent Suites

Uma suite de agentes verifica um nó [Agent](../nodes/agent-node.md) em relação às suas execuções. Lê-as a partir de [Trilhos](./traces-tab.md), onde cada execução já regista o seu tempo, tokens, custo e chamadas de ferramentas, podendo também executar o workflow por si.

Crie uma em **Nova suite** → **Suite de agentes** e siga três passos:

1. **Agente** – Escolha o workflow e, em seguida, o seu nó de agente. Apenas são listados workflows com nó de agente; um workflow ou agente que ainda não tenha sido executado é apresentado, mas não pode ser selecionado. As definições do agente escolhido (modelo, instruções, ferramentas e limites) surgem à direita, e uma tela apenas de leitura do seu workflow, com o agente destacado, é apresentada abaixo.
2. **Baseline** – As últimas 10 execuções do agente: latência p50 e p95, custo por execução, tokens por execução e chamadas de ferramentas por execução, que ferramentas foram chamadas e com que frequência, bem como as métricas próprias de cada execução. Execuções terminadas em erro são listadas, mas excluídas da baseline.
3. **Verificações** – Marque cada ferramenta como **Must call**, **Must not call** ou **Either**. Cada tipo de chamada é listado com o respetivo tipo: ferramentas Python e de nó, ferramentas **MCP** com o respetivo servidor, **subagentes** por etiqueta, **subworkflows** por nome e **skills**. Adicione uma por tipo e nome caso ainda não tenha sido executada, e remova-a com o respetivo **X**. Defina limites superiores para latência, custo, tokens totais e chamadas de ferramentas; cada um começa 20% acima do p95 da baseline e pode ser desativado.

Uma suite guardada abre em **Resultados**, com **Baseline** e **Editar verificações** ao lado:

- **Executar o workflow** – Escolha quantas execuções realizar (até 20); quatro são executadas em simultâneo. As entradas são preenchidas a partir da execução mais recente do workflow e podem ser editadas, sendo utilizadas por todas as execuções. Ative **Gerar entradas** (o ícone de faísca) e, em seguida, escolha uma credencial e um modelo para que o modelo componha uma entrada diferente para cada execução. Este lê as instruções de sistema do agente e mantém-se próximo dos valores digitados: introduzir o nome de uma cidade gera outros nomes de cidades. Cada execução processa o workflow completo como qualquer outra execução e surge no Histórico de execuções com o trigger `agent_suite`. Para ignorar passos posteriores, como o envio de um e-mail, abra o workflow através de **Ir para o workflow** no painel e desative esses nós previamente. **Parar** termina a execução da suite: não são iniciadas novas execuções e as que estiverem a decorrer são canceladas. Uma execução de suite cujo servidor tenha parado, por exemplo durante um reinício, é indicada como interrompida após um minuto em vez de permanecer bloqueada.
- **Resultados** – A execução mais recente da suite é avaliada por predefinição. Cada execução de suite é preservada com a respetiva data no seletor de execuções, onde pode abri-la ou eliminá-la; ou mude para as últimas 10, 20 ou 50 execuções do agente para incluir as suas outras execuções. Verá a taxa de aprovação, a frequência com que cada verificação passou, latência, custo, tokens e chamadas de ferramentas ao lado da baseline guardada, bem como cada execução com o motivo da falha e uma ligação para o seu trilho.
- **Ir para o workflow** abre o workflow do agente num novo separador. No campo do nome, **Esc** ou o **X** limpa o texto.

Como os valores são interpretados:

- A **latência** é o tempo do modelo somado ao tempo das chamadas de ferramentas da execução.
- O **custo** utiliza os mesmos preços de Traces. A execução de um modelo sem preço ignora a verificação de custo em vez de falhar.
- Uma execução **passa** quando termina sem erros e cumpre todas as verificações.
- A suite lê exclusivamente os seus próprios trilhos, a mesma regra aplicada ao separador Trilhos.
- **Utilizar execuções recentes como baseline** em **Editar verificações** substitui a baseline guardada pelas execuções mais recentes do agente.

A baseline de uma suite provém de uma de três origens. **Editar verificações** indica qual está ativa ao lado de **Baseline guardada**:

- as execuções mais recentes do agente (o padrão e o valor assumido por **Utilizar execuções recentes como baseline**),
- uma execução de suite terminada,
- valores introduzidos manualmente.

As duas últimas definem-se a partir do [Chat](./chat-tab.md#working-with-evals) ou da API:

- `PATCH /api/evals/agent-suites/{id}` aceita `baseline: {"source": "suite_run", "run_id": "…"}` ou `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` aceita `inputs_list`: um objeto de entrada por execução, até 20.

### A partir do Chat e MCP

O [Chat](./chat-tab.md#working-with-evals) e a ferramenta MCP `heym_chat` podem criar, modificar e executar suites de prompts e de agentes:

- Redigem casos de teste e entradas de execução autonomamente.
- Perguntam que credencial utilizar antes de criar uma suite de prompts, exceto se apenas uma for adequada.
- Criam ligações para cada suite mencionada nesta página.

## Ideias para Matrizes de Benchmark

Ao construir uma matriz de benchmark para workflows de agente, inclua cenários HITL como casos de primeira classe em vez de os tratar como casos-limite.

- Cubra as três decisões de revisão: `accepted`, `edited` e `refused`
- Inclua múltiplas origens de trigger, tais como execuções do editor, portal, curl/webhook e execuções acionadas por cron
- Adicione cenários de revisão repetida em que uma execução do agente pausa mais do que uma vez
- Verifique os ramos de notificação ligados à saída `review` do agente
- Confirme o comportamento a jusante após recusa, especialmente se nós posteriores ramificarem em `$agent.decision`

## Relacionado

- [Porquê o Heym](../getting-started/why-heym.md) – As Avaliações como a fase de teste do ciclo de vida do agente
- [Nó de Agente](../nodes/agent-node.md) – Workflows a serem avaliados
- [Separador Credenciais](./credentials-tab.md) – Credenciais para execuções de avaliação
- [Separador Rastreios](./traces-tab.md) – Inspeção detalhada de rastreios
- [Separador Workflows](./workflows-tab.md) – Criar workflows para avaliar
- [Histórico de Execuções](../reference/execution-history.md) – Ver execuções anteriores (botão Histórico no cabeçalho)
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto da página disponível na página de avaliações
