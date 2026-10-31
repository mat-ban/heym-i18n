# Aba Evals

A aba **Evals** é uma página separada em `/evals`. Ela permite criar suítes de avaliação, definir casos de teste e executar avaliações nos seus Workflows de [Agente](../nodes/agent-node.md). Uma [suíte de agentes](#agent-suites) executa um agente ou lê suas execuções reais, verificando as ferramentas que ele chama, sua latência, seu custo em USD, seus tokens e sua quantidade de chamadas de ferramentas.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Assistir à demonstração de Evals</a></p>

## Acesso

- Clique em **Evals** na barra de abas do dashboard
- Ou navegue até `/evals`
- Ou use **Ctrl+K** (Cmd+K) e selecione "Evals" na paleta de comandos

## Suítes de Eval

- **Nova suíte** – Escolha **Suíte de prompts** para testar um prompt de sistema entre modelos, ou **Suíte de agentes** para verificar execuções reais de um agente (consulte [Suítes de agentes](#agent-suites))
- **Seletor de suíte** – Lista suítes de prompts e de agentes juntas com o tipo ao lado de cada nome; digite para pesquisar
- **Criar suíte** – Defina uma suíte com nome e descrição
- **Selecionar Workflow** – Escolha qual Workflow avaliar
- **Selecionar credencial** – Chave de API para executar o Workflow
- **Prompt de sistema** – Edite o prompt de sistema no nível da suíte diretamente no painel esquerdo
- **Otimizar Prompt** – Peça a um LLM para melhorar o prompt de sistema atual

## Casos de Teste

- Adicione casos de teste com prompts de entrada e saídas esperadas
- Cada caso pode ter um valor esperado personalizado para comparação
- Edite ou exclua casos da suíte
- **Gerar Dados de Teste** – Use a credencial/modelo selecionado para criar automaticamente casos de teste a partir do prompt da suíte

## Executando Avaliações

- **Selecione um ou mais modelos** – Execute a mesma suíte em vários modelos em uma única avaliação
- **Método de pontuação** – Escolha `Exact Match`, `Contains` ou `LLM-as-Judge`
- **Juiz** – Para `LLM-as-Judge`, opcionalmente escolha uma credencial OpenAI, OpenAI compatível (Custom), Gemini (Google) ou [Modelo de Decisão](../nodes/decision-node.md) e digite o modelo do juiz (por exemplo `gpt-4o-mini` ou `jev-latest`) para pontuar com um juiz independente
- **Execuções por teste** – Repita cada caso de teste várias vezes em uma execução
- **Configurações memorizadas** – Uma suíte abre com as configurações de sua execução mais recente: credencial, modelos, método de pontuação e juiz, temperatura, esforço de raciocínio e execuções por teste. Abrir uma execução anterior carrega essas configurações, de modo que **Reexecutar avaliações** repete a mesma avaliação
- **Temperatura** – Defina a temperatura do modelo (`Exact Match` e `Contains`)
- **Esforço de raciocínio** – Defina o esforço de raciocínio para modelos de raciocínio, de Baixo a Muito alto e Máx assim como nos nós LLM e Agent (`Exact Match` e `Contains`)

### LLM-as-Judge

Com um juiz, cada modelo responde à entrada de teste apenas com o prompt da suíte, e então o juiz avalia quão próxima a resposta está da saída esperada, de 0 a 100:

- **Um juiz de modelo** (OpenAI, OpenAI compatível ou Gemini) lê a pergunta, a saída esperada e a resposta, e retorna uma pontuação com uma justificativa de uma linha. Ele é executado com temperatura `0`, ou com esforço de raciocínio `low` para um modelo de raciocínio, de modo que a mesma resposta recebe o mesmo veredito.
- **Um juiz de modelo de decisão** avalia a resposta em uma rubrica de cinco níveis, de *Completamente fora* a *Correspondência total*. A pontuação é a posição ponderada por probabilidade nessa rubrica, portanto vem de uma distribuição que o modelo calculou, em vez de um número que ele escreveu.

O cartão ao passar o cursor sobre a célula mostra o motivo do juiz ou, para um modelo de decisão, o nível, a pontuação e sua confiança. A latência e os tokens descrevem o modelo sob teste; as chamadas do próprio juiz aparecem em [Rastreamentos](./traces-tab.md) sob a origem **Avaliações**. O seletor de juiz omite credenciais Model Router, pois um juiz precisa ser um único modelo fixo. A credencial para os modelos sob teste pode ser um [Model Router](../reference/credentials.md#model-router-auto-model): seu modelo **Auto** escolhe um modelo por requisição, do mesmo modo que em um workflow.

Sem um juiz, cada modelo responde e pontua sua própria resposta em uma única requisição.

Temperatura e esforço de raciocínio ficam ocultos nesse modo, e a execução usa configurações fixas: temperatura `0.7` para modelos padrão, e esforço de raciocínio `medium` para modelos de raciocínio (`low` quando eles pontuam suas próprias respostas).

## Resultados

- Veja aprovação/reprovação por caso de teste
- Inspecione saídas reais vs. esperadas
- Compare saídas por modelo lado a lado quando uma execução inclui vários modelos
- Revise o histórico de execuções de avaliações anteriores; uma execução `LLM-as-Judge` mostra seu modelo juiz na lista de histórico
- Abra execuções históricas a partir do painel de resultados e inspecione snapshots salvos de prompt/entrada/saída
- Abrir uma execução anterior carrega seu método de pontuação e juiz no painel esquerdo, de modo que **Re-Run Evals** repete a mesma avaliação
- **Export** baixa a execução como JSON, incluindo `judge_credential_id` e `judge_model`

## Agent Suites

Uma suíte de agentes verifica um nó [Agent](../nodes/agent-node.md) em relação às suas execuções. Ela as lê de [Rastreamentos](./traces-tab.md), onde cada execução já registra seu tempo, tokens, custo e chamadas de ferramentas, podendo também executar o workflow para você.

Crie uma em **Nova suíte** → **Suíte de agentes** e siga três passos:

1. **Agente** – Escolha o workflow e, em seguida, seu nó de agente. Somente workflows com nó de agente são listados; um workflow ou agente que ainda não tenha sido executado é exibido, mas não pode ser selecionado. As configurações do agente escolhido (modelo, instruções, ferramentas e limites) aparecem à direita, e uma tela somente leitura de seu workflow, com o agente destacado, é exibida abaixo.
2. **Baseline** – As últimas 10 execuções do agente: latência p50 e p95, custo por execução, tokens por execução e chamadas de ferramentas por execução, quais ferramentas foram chamadas e com que frequência, bem como as métricas individuais de cada execução. Execuções encerradas em erro são listadas, mas desconsideradas na baseline.
3. **Verificações** – Marque cada ferramenta como **Must call**, **Must not call** ou **Either**. Cada tipo de chamada é listado com seu tipo: ferramentas Python e de nó, ferramentas **MCP** com seu servidor, **subagentes** por rótulo, **subworkflows** por nome e **skills**. Adicione uma por tipo e nome caso ainda não tenha sido executada, e remova-a com seu **X**. Defina limites superiores para latência, custo, tokens totais e chamadas de ferramentas; cada um começa 20% acima do p95 da baseline e pode ser desativado.

Uma suíte salva abre em **Resultados**, com **Baseline** e **Editar verificações** ao lado:

- **Executar o workflow** – Escolha quantas execuções realizar (até 20); quatro rodam simultaneamente. As entradas são preenchidas a partir da execução mais recente do workflow e podem ser editadas, sendo utilizadas por todas as execuções. Ative **Gerar entradas** (o ícone de faísca) e, em seguida, escolha uma credencial e um modelo para que o modelo gere uma entrada diferente para cada execução. Ele lê as instruções de sistema do agente e mantém-se próximo dos valores digitados: digitar o nome de uma cidade gera outros nomes de cidades. Cada execução processa o workflow completo como qualquer outra execução e aparece no Histórico de execuções com o trigger `agent_suite`. Para pular etapas posteriores, como o envio de um e-mail, abra o workflow em **Ir para o workflow** no painel e desative esses nós primeiro. **Parar** encerra a execução da suíte: nenhuma nova execução é iniciada e as em andamento são canceladas. Uma execução de suíte cujo servidor tenha parado, por exemplo durante uma reinicialização, é indicada como interrompida após um minuto em vez de permanecer travada.
- **Resultados** – A execução mais recente da suíte é pontuada por padrão. Cada execução de suíte é mantida com sua data no seletor de execuções, onde você pode abri-la ou excluí-la; ou mude para as últimas 10, 20 ou 50 execuções do agente para incluir suas outras execuções. Você verá a taxa de aprovação, a frequência com que cada verificação passou, latência, custo, tokens e chamadas de ferramentas ao lado da baseline salva, bem como cada execução com o motivo da falha e um link para seu rastreamento.
- **Ir para o workflow** abre o workflow do agente em uma nova aba. No campo de nome, **Esc** ou o **X** limpa o texto.

Como os números são interpretados:

- A **latência** é o tempo do modelo somado ao tempo das chamadas de ferramentas da execução.
- O **custo** utiliza os mesmos preços de Traces. A execução de um modelo sem preço pula a verificação de custo em vez de falhar.
- Uma execução **passa** quando é finalizada sem erros e atende a todas as verificações.
- A suíte lê apenas os seus próprios rastreamentos, a mesma regra aplicada à aba Traces.
- **Usar execuções recentes como baseline** em **Editar verificações** substitui a baseline salva pelas execuções mais recentes do agente.

A baseline de uma suíte provém de uma de três fontes. **Editar verificações** indica qual está ativa ao lado de **Baseline salva**:

- as execuções mais recentes do agente (o padrão e o que **Usar execuções recentes como baseline** utiliza),
- uma execução de suíte concluída,
- números inseridos manualmente.

As duas últimas opções são configuradas pelo [Chat](./chat-tab.md#working-with-evals) ou pela API:

- `PATCH /api/evals/agent-suites/{id}` aceita `baseline: {"source": "suite_run", "run_id": "…"}` ou `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` aceita `inputs_list`: um objeto de entrada por execução, até 20.

### A partir do Chat e MCP

O [Chat](./chat-tab.md#working-with-evals) e a ferramenta MCP `heym_chat` podem criar, alterar e executar suítes de prompts e de agentes:

- Eles mesmos redigem casos de teste e entradas de execução.
- Perguntam qual credencial utilizar antes de criar uma suíte de prompts, exceto se apenas uma for compatível.
- Vinculam cada suíte mencionada nesta página.

## Ideias para Matriz de Benchmark

Ao construir uma matriz de benchmark para Workflows de agente, inclua cenários HITL como casos de primeira classe em vez de tratá-los como casos extremos.

- Cubra todas as três decisões de revisão: `accepted`, `edited` e `refused`
- Inclua múltiplas fontes de Trigger, como execuções pelo editor, portal, curl/webhook e execuções disparadas por cron
- Adicione cenários de revisão repetida em que uma execução de agente pausa mais de uma vez
- Verifique ramificações de notificação conectadas à saída `review` do agente
- Valide o comportamento downstream após recusa, especialmente se nós posteriores ramificarem em `$agent.decision`

## Relacionados

- [Por que Heym](../getting-started/why-heym.md) – Evals como o estágio de teste do ciclo de vida do agente
- [Nó Agente](../nodes/agent-node.md) – Workflows sendo avaliados
- [Aba Credentials](./credentials-tab.md) – Credenciais para execuções de eval
- [Aba Traces](./traces-tab.md) – Inspeção detalhada de traces
- [Aba Workflows](./workflows-tab.md) – Crie Workflows para avaliar
- [Histórico de Execução](../reference/execution-history.md) – Veja execuções anteriores (botão History no cabeçalho)
- [Showcase Contextual](../reference/contextual-showcase.md) – Guia compacto da página disponível na página de evals
