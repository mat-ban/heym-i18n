# Separador Registos

O separador **Registos** mostra os registos dos contentores Docker da stack Heym. Utilize-o para depuração, monitorização e resolução de problemas. Para registos de execução de workflows (resultados de nós, saídas), utilize o painel de Depuração no editor de workflows — consulte [Funcionalidades do Canvas](../reference/canvas-features.md#execution-logs).

Os registos suportados por Docker estão desativados por predefinição em implementações auto-alojadas. Para os ativar, defina `DOCKER_LOGS_ENABLED=true`, defina `DOCKER_LOGS_ALLOWED_EMAILS` como uma lista separada por vírgulas de e-mails de utilizadores de confiança autorizados a aceder aos registos Docker, e certifique-se de que `/var/run/docker.sock` está montado no contentor de backend. O serviço predefinido do Docker Compose e o exemplo direto de `docker run` incluem essa montagem para ferramentas MCP stdio baseadas em Docker; mantenha-a apenas quando aceitar o limite de confiança do socket Docker.

Se o registo estiver aberto, crie a conta de administrador de confiança antes de ativar os registos Docker ou mantenha `ALLOW_REGISTER=false`; caso contrário, um auto-registo não verificado poderá reclamar um e-mail presente na lista de autorizados.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Ver demonstração dos Registos</a></p>

## Seleção de Contentores

- **Todos os Contentores** – Registos combinados do backend, frontend e PostgreSQL
- **Backend** – Contentor `heym-backend`
- **Frontend** – Contentor `heym-frontend`
- **PostgreSQL** – Contentor `heym-postgres`

## Filtro de Nível de Registo

- **Todos** – Mostrar todos os níveis de registo
- **INFO** – INFO e superiores
- **WARNING** – Avisos e erros
- **ERROR** – Apenas erros
- **DEBUG** – Depuração e superiores

## Pesquisa

- Filtrar registos por pesquisa de texto
- As correspondências são realçadas na saída dos registos

## Funcionalidades

- **Deslocamento automático** – Deslocar para o fundo à medida que chegam novos registos
- **Stream** – Transmitir registos em tempo real (quando suportado)
- **Copiar** – Copiar registos para a área de transferência
- **Transferir** – Transferir registos como ficheiro

## Casos de Utilização

- Depurar falhas na execução de workflows
- Inspecionar registos de pedidos/respostas da API
- Monitorizar consultas à base de dados
- Verificar mensagens de arranque e de estado

## Relacionado

- [Funcionalidades do Canvas](../reference/canvas-features.md) – Registos de execução no painel de Depuração do workflow
- [Separador Rastreios](./traces-tab.md) – Inspeção de rastreios LLM
- [Separador Análises](./analytics-tab.md) – Métricas de execução
- [Separador Workflows](./workflows-tab.md) – Gestão de workflows
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para superfícies do dashboard
