# Aba Scheduled

A aba **Scheduled** exibe todos os workflows cron ativos em um calendário visual. Alterne entre as visualizações de dia, semana e mês para ver quando suas automações estão agendadas para executar.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Assistir à demonstração do Scheduled</a></p>

## Visualizações

- **Dia** – Linha do tempo hora a hora para o dia selecionado; cada ocorrência aparece como um bloco no horário agendado
- **Semana** – Grade de sete colunas abrangendo a semana atual; os blocos se empilham quando vários workflows disparam na mesma hora
- **Mês** – Grade do mês completo; cada célula lista os workflows agendados para executar naquele dia

## Blocos de Workflow

Cada bloco exibe:

- **Nome do workflow** – Clique para abrir o canvas do workflow diretamente
- **Expressão cron** – Visível ao passar o mouse, mostrando o agendamento bruto (ex.: `0 9 * * 1-5`)

## Navegação

Administradores da instância listados em `HEYM_ADMIN_EMAILS` veem os agendamentos de todos os proprietários quando **Show all workflows** está marcado. Desmarque para ver apenas seus próprios workflows. Os demais usuários mantêm a opção **Show shared with me**. Para desativar a automação de um colaborador, use os [controles de administração da instância](./workflows-tab.md#instance-administration) na pré-visualização de Workflows para pausar ou retomar triggers.

- Use as setas **anterior / próximo** para navegar entre dias, semanas ou meses
- O botão **Today** retorna à data atual instantaneamente

## Relacionados

- [Nó Cron](../nodes/cron-node.md) – Configure triggers agendados no canvas
- [Aba Workflows](./workflows-tab.md) – Gerencie e organize todos os workflows
- [Aba Analytics](./analytics-tab.md) – Métricas de execução e tendências
