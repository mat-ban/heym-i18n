# Aba Logs

A aba **Logs** exibe os logs dos contêineres Docker da stack do Heym. Use-a para depuração, monitoramento e solução de problemas. Para logs de execução de Workflow (resultados de Nós, saídas), use o painel Debug no editor de Workflow — consulte [Recursos do Canvas](../reference/canvas-features.md#execution-logs).

Os logs com suporte do Docker estão desabilitados por padrão em implantações auto-hospedadas. Para habilitá-los, defina `DOCKER_LOGS_ENABLED=true`, configure `DOCKER_LOGS_ALLOWED_EMAILS` com uma lista separada por vírgulas de e-mails de usuários confiáveis autorizados a acessar os logs do Docker e certifique-se de que `/var/run/docker.sock` esteja montado no contêiner do backend. O serviço padrão do Docker Compose e o exemplo direto de `docker run` incluem essa montagem para ferramentas MCP stdio baseadas em Docker; mantenha-a apenas quando você aceitar a fronteira de confiança do socket do Docker.

Se o registro estiver aberto, crie a conta de administrador confiável antes de habilitar os logs do Docker ou mantenha `ALLOW_REGISTER=false`; caso contrário, um auto-registro não verificado poderia reivindicar um e-mail presente na lista de permissões.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Assista à demonstração de Logs</a></p>

## Seleção de Contêiner

- **All Containers** – Logs combinados do backend, frontend e PostgreSQL
- **Backend** – Contêiner `heym-backend`
- **Frontend** – Contêiner `heym-frontend`
- **PostgreSQL** – Contêiner `heym-postgres`

## Filtro de Nível de Log

- **All** – Exibir todos os níveis de log
- **INFO** – INFO e acima
- **WARNING** – Avisos e erros
- **ERROR** – Apenas erros
- **DEBUG** – Debug e acima

## Busca

- Filtre logs por busca textual
- As correspondências são destacadas na saída do log

## Recursos

- **Auto scroll** – Rola até o final conforme novos logs chegam
- **Stream** – Transmite logs em tempo real (quando suportado)
- **Copy** – Copia os logs para a área de transferência
- **Download** – Baixa os logs como um arquivo

## Casos de Uso

- Depurar falhas na execução de Workflow
- Inspecionar logs de requisição/resposta da API
- Monitorar consultas ao banco de dados
- Verificar mensagens de inicialização e de integridade

## Relacionados

- [Recursos do Canvas](../reference/canvas-features.md) – Logs de execução no painel Debug do Workflow
- [Aba Traces](./traces-tab.md) – Inspeção de traces de LLM
- [Aba Analytics](./analytics-tab.md) – Métricas de execução
- [Aba Workflows](./workflows-tab.md) – Gerenciamento de Workflow
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para superfícies do dashboard
