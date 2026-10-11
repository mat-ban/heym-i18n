# Separador Analytics

O separador **Analytics** apresenta métricas de execução e tendências dos seus workflows. Monitorize a utilização, o desempenho e identifique estrangulamentos.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Ver demonstração do Analytics</a></p>

## Estatísticas Resumidas

- **Total de execuções** – Contagem de execuções do workflow no período selecionado
- **Taxa de sucesso** – Percentagem de execuções bem-sucedidas
- **Duração média** – Tempo médio de execução
- **Tempo poupado** – Total estimado de tempo poupado: os minutos poupados por execução configurados em cada workflow × as respetivas execuções bem-sucedidas, somados ao longo da janela selecionada
- **Tendências** – Indicadores de subida/descida em comparação com o período anterior

## Intervalo Temporal

- **24h** – Últimas 24 horas
- **7d** – Últimos 7 dias
- **30d** – Últimos 30 dias
- **Tudo** – Histórico completo disponível

## Filtro de Workflow

- Filtre as métricas por um workflow específico
- **Todos os workflows** – Agregação de todos os workflows

## Tabelas

Duas tabelas apresentam a utilização dos workflows: **Mais Utilizados** (mais larga) e **Mais Falhados**.

- **Tempo Poupado** – A tabela Mais Utilizados apresenta o tempo poupado somado de cada workflow (minutos poupados por execução × execuções bem-sucedidas). **Não Definido** significa que a estimativa está em falta; clique para abrir esse campo no workflow.
- **Colunas ordenáveis** – Clique no cabeçalho de uma coluna para ordenar por essa coluna. Clique novamente para alternar entre ordem ascendente/descendente. Os indicadores de seta mostram a direção da ordenação.
- **Etiquetas em dispositivos móveis** – Em ecrãs pequenos, as etiquetas das colunas são abreviadas (por exemplo, "Executions" → "Runs", "Success" → "OK", "Error" → "Err") para que as tabelas caibam sem deslocamento horizontal.

## Gráficos

- **Volume de Execuções ao Longo do Tempo** – Gráfico de linhas das execuções por intervalo temporal
- **Taxa de Sucesso vs Erro** – Gráfico de área que compara execuções saudáveis e falhadas
- **Latência Média ao Longo do Tempo** – Gráfico de linhas que mostra as variações do tempo de resposta
- **Arrastar para selecionar** – Clique e arraste sobre qualquer gráfico para focar um intervalo de datas personalizado
- **Modo de seleção** – Os intervalos selecionados atualizam os cartões de resumo, os gráficos e as tabelas de workflows sem alterar a predefinição base
- **Limpar Seleção** – Regresse à janela temporal predefinida quando terminar a análise detalhada

## Atualização Automática

- Ative a atualização automática para manter as métricas atualizadas sem recarregamento manual

## Relacionado

- [Separador Workflows](./workflows-tab.md) – Workflows a serem medidos
- [Separador Traces](./traces-tab.md) – Inspeção detalhada de traces
- [Separador Logs](./logs-tab.md) – Logs de execução para depuração
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto das páginas do dashboard

Quando um gráfico apresenta uma tendência sobre a qual pretende ser notificado em vez de a vigiar, transforme-a num [alerta](./alerts-tab.md): a contagem de erros, a duração das execuções, os gastos com LLM e a contagem de execuções podem todos receber um limiar ao longo de uma janela temporal.
