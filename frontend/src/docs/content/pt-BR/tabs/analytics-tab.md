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
- **Arraste para selecionar** – Clique e arraste em qualquer gráfico para focar em um intervalo de datas personalizado
- **Modo de seleção** – Os intervalos selecionados atualizam os cards de resumo, os gráficos e as tabelas de workflow sem alterar o preset base
- **Limpar Seleção** – Retorne à janela de tempo predefinida quando terminar a análise detalhada

## Atualização Automática

- Ative a atualização automática para manter as métricas atualizadas sem recarregar manualmente

## Relacionados

- [Aba Workflows](./workflows-tab.md) – Workflows sendo medidos
- [Aba Traces](./traces-tab.md) – Inspeção detalhada de traces
- [Aba Logs](./logs-tab.md) – Logs de execução para depuração
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para superfícies do dashboard

Quando um gráfico mostra uma tendência sobre a qual você prefere ser notificado em vez de monitorar, transforme-a em um [alerta](./alerts-tab.md): contagem de erros, duração de execução, gasto com LLM e contagem de execuções podem todos receber um limite ao longo de uma janela de tempo.
