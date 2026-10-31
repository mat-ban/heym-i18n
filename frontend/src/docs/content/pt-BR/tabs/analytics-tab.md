# Aba Analytics

A aba **Analytics** exibe métricas de execução e tendências dos seus workflows. Monitore o uso, o desempenho e identifique gargalos.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Assista à demonstração do Analytics</a></p>

## Estatísticas Resumidas

- **Total de execuções** – Contagem de execuções de workflow no período selecionado
- **Taxa de sucesso** – Porcentagem de execuções bem-sucedidas
- **Duração média** – Tempo médio de execução
- **Tempo economizado** – Total estimado de tempo economizado: os minutos economizados por execução configurados em cada workflow × suas execuções bem-sucedidas, somados ao longo da janela selecionada
- **Tendências** – Indicadores de alta/baixa em relação ao período anterior

## Intervalo de Tempo

- **1h**, **3h**, **6h** – Última hora, 3 horas ou 6 horas. As análises são salvas por hora, portanto contabilizam a hora de início da janela integralmente: Última hora às 15:20 abrange das 14:00 até agora
- **24h** – Últimas 24 horas
- **7d** – Últimos 7 dias
- **30d** – Últimos 30 dias
- **Tudo** – Todo o histórico disponível

## Filtro de Workflow

- Filtre as métricas por um workflow específico
- **Todos os workflows** – Agrega todos os workflows

## Tabelas

Duas tabelas mostram o uso dos workflows: **Mais Usados** (mais larga) e **Mais Falhas**.

- **Tempo Economizado** – Mais Usados exibe o tempo economizado somado de cada workflow (minutos economizados por execução × execuções bem-sucedidas). **Não Definido** significa que a estimativa está ausente; clique para abrir esse campo no workflow.
- **Colunas classificáveis** – Clique no cabeçalho de uma coluna para classificar por ela. Clique novamente para alternar entre crescente/decrescente. Indicadores de seta mostram a direção da classificação.
- **Rótulos no mobile** – Em telas pequenas, os rótulos das colunas são abreviados (ex.: "Executions" → "Runs", "Success" → "OK", "Error" → "Err") para que as tabelas caibam sem rolagem horizontal.

## Gráficos

- **Volume de Execuções ao Longo do Tempo** – Gráfico de linha das execuções por intervalo de tempo
- **Taxa de Sucesso vs Erro** – Gráfico de área comparando execuções saudáveis e com falha
- **Latência Média ao Longo do Tempo** – Gráfico de linha mostrando as variações no tempo de resposta
- **Arrastar para selecionar** – Clique e arraste sobre qualquer gráfico para focar um intervalo de datas personalizado. Uma seleção deve cobrir pelo menos dois pontos no gráfico; um clique simples não seleciona nada
- **Modo de seleção** – Os intervalos selecionados atualizam os cards de resumo, os gráficos e as tabelas de workflow sem alterar o preset base
- **Limpar Seleção** – Retorne à janela de tempo predefinida quando terminar a análise detalhada

## Tipos de nós

Abaixo dos percentis de latência, três gráficos mostram para onde vão o tempo e as falhas dos nós, agrupados por tipo de nó (Agent, HTTP Request, Code, etc.) em todos os workflows visíveis:

- **Nós com maior tempo consumido** – Os 10 tipos de nós com maior tempo total de execução, plotados como duração média por chamada. Uma hora sem chamadas de determinado tipo exibe **Sem chamadas** na tooltip.
- **Tipos de nós mais com falhas** – Os 10 tipos de nós com mais erros (erro ou timeout), cada um com sua própria contagem de erros por intervalo de tempo.
- **Tipos de nós mais chamados** – Os 10 tipos de nós que mais executaram, cada um com sua própria contagem de chamadas por intervalo de tempo. Nós ignorados não são contabilizados.

Passe o cursor sobre um gráfico para ver o tipo de nó sob o ponteiro, logo ao lado. Um tipo de nó pequeno demais para ser visto ao lado do maior em um gráfico (abaixo de 1% dele) é omitido do gráfico e de sua legenda. Os gráficos acompanham o filtro de workflow, o intervalo de tempo e qualquer intervalo arrastado sobre um gráfico. As métricas de nós são registradas para execuções a partir da versão que as introduziu, e uma execução concluída aparece em cerca de um minuto. Execuções mais antigas não são consideradas.

## Atualização Automática

- Ative a atualização automática para manter as métricas atualizadas sem recarregar manualmente

## Relacionados

- [Aba Workflows](./workflows-tab.md) – Workflows sendo medidos
- [Aba Traces](./traces-tab.md) – Inspeção detalhada de traces
- [Aba Logs](./logs-tab.md) – Logs de execução para depuração
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para superfícies do dashboard

Quando um gráfico mostra uma tendência sobre a qual você prefere ser notificado em vez de monitorar, transforme-a em um [alerta](./alerts-tab.md): contagem de erros, duração de execução, gasto com LLM e contagem de execuções podem todos receber um limite ao longo de uma janela de tempo.
