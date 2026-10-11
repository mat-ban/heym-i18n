# Aba Evals

A aba **Evals** é uma página separada em `/evals`. Ela permite criar suítes de avaliação, definir casos de teste e executar avaliações nos seus Workflows de [Agente](../nodes/agent-node.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Assistir à demonstração de Evals</a></p>

## Acesso

- Clique em **Evals** na barra de abas do dashboard
- Ou navegue até `/evals`
- Ou use **Ctrl+K** (Cmd+K) e selecione "Evals" na paleta de comandos

## Suítes de Eval

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
- **Temperatura** – Defina a temperatura do modelo (`Exact Match` e `Contains`)
- **Esforço de raciocínio** – Defina o esforço de raciocínio para modelos de raciocínio (`Exact Match` e `Contains`)

### LLM-as-Judge

Com um juiz, cada modelo responde à entrada de teste apenas com o prompt da suíte, e então o juiz avalia quão próxima a resposta está da saída esperada, de 0 a 100:

- **Um juiz de modelo** (OpenAI, OpenAI compatível ou Gemini) lê a pergunta, a saída esperada e a resposta, e retorna uma pontuação com uma justificativa de uma linha. Ele é executado com temperatura `0`, ou com esforço de raciocínio `low` para um modelo de raciocínio, de modo que a mesma resposta recebe o mesmo veredito.
- **Um juiz de modelo de decisão** avalia a resposta em uma rubrica de cinco níveis, de *Completamente fora* a *Correspondência total*. A pontuação é a posição ponderada por probabilidade nessa rubrica, portanto vem de uma distribuição que o modelo calculou, em vez de um número que ele escreveu.

O cartão de hover da célula mostra a justificativa do juiz ou, para um modelo de decisão, o nível, a pontuação e sua confiança. Latência e tokens descrevem o modelo em teste; as chamadas do próprio juiz aparecem em [Traces](./traces-tab.md) sob a fonte **Evals**. O seletor de modelos omite credenciais de Model Router, porque uma eval compara modelos específicos.

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
