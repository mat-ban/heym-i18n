# Pestanya Scheduled

La pestanya **Scheduled** mostra tots els Workflows de cron actius en un calendari visual. Canvieu entre les vistes de dia, setmana i mes per veure quan estan programades les vostres automatitzacions.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>

## Vistes

- **Day** – Línia temporal hora a hora per al dia seleccionat; cada ocurrència apareix com un bloc a la seva hora programada
- **Week** – Graella de set columnes que abasta la setmana actual; els blocs s'apilen quan diversos Workflows s'executen a la mateixa hora
- **Month** – Graella del mes complet; cada cel·la llista els Workflows programats per executar-se aquell dia

## Blocs de Workflow

Cada bloc mostra:

- **Nom del Workflow** – Feu clic per obrir directament el canvas del Workflow
- **Expressió Cron** – Visible en passar-hi el cursor per sobre, mostrant la programació en cru (p. ex. `0 9 * * 1-5`)

## Navegació

Els administradors d'instància llistats a `HEYM_ADMIN_EMAILS` veuen les programacions de tots els propietaris quan **Show all workflows** està marcat. Desmarqueu-ho per veure només els seus propis Workflows. La resta d'usuaris mantenen l'opció **Show shared with me**. Per retirar l'automatització d'un empleat, utilitzeu els [controls d'administració d'instància](./workflows-tab.md#instance-administration) a la previsualització de Workflows per pausar o reprendre Triggers.

- Utilitzeu les fletxes **previous / next** per moure-us entre dies, setmanes o mesos
- El botó **Today** torna a la data actual a l'instant

## Relacionat

- [Node Cron](../nodes/cron-node.md) – Configureu Triggers programats al canvas
- [Pestanya Workflows](./workflows-tab.md) – Gestioneu i organitzeu tots els Workflows
- [Pestanya Analytics](./analytics-tab.md) – Mètriques d'execució i tendències
