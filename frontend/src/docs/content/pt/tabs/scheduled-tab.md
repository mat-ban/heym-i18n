# Separador Agendamentos

O separador **Agendamentos** mostra todos os workflows cron ativos num calendário visual. Alterne entre as vistas de dia, semana e mês para ver quando as suas automatizações estão agendadas para serem executadas.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Ver demonstração de Agendamentos</a></p>

## Vistas

- **Dia** – Cronologia hora a hora para o dia selecionado; cada ocorrência aparece como um bloco à hora agendada
- **Semana** – Grelha de sete colunas que abrange a semana atual; os blocos empilham-se quando vários workflows são acionados à mesma hora
- **Mês** – Grelha do mês completo; cada célula lista os workflows agendados para serem executados nesse dia

## Blocos de Workflow

Cada bloco apresenta:

- **Nome do workflow** – Clique para abrir diretamente o canvas do workflow
- **Expressão cron** – Visível ao passar o cursor, mostrando o agendamento em bruto (ex. `0 9 * * 1-5`)

## Navegação

Os administradores de instância listados em `HEYM_ADMIN_EMAILS` veem os agendamentos de todos os proprietários quando a opção **Mostrar todos os workflows** está selecionada. Desmarque-a para ver apenas os seus próprios workflows. Os restantes utilizadores mantêm a opção **Mostrar partilhados comigo**. Para desativar a automatização de um colaborador, utilize os [controlos de administração de instância](./workflows-tab.md#instance-administration) na pré-visualização de Workflows para pausar ou retomar os triggers.

- Utilize as setas **anterior / seguinte** para navegar entre dias, semanas ou meses
- O botão **Hoje** regressa instantaneamente à data atual

## Relacionado

- [Nó Cron](../nodes/cron-node.md) – Configure triggers agendados no canvas
- [Separador Workflows](./workflows-tab.md) – Faça a gestão e organize todos os workflows
- [Separador Analytics](./analytics-tab.md) – Métricas de execução e tendências
