# Enterprise

Licenciamento comercial, suporte profissional e serviços de implantação para a plataforma Heym.

## Visão geral

O Heym é gratuito para uso e auto-hospedagem sob a sua licença de código disponível. Para organizações que necessitam de licenciamento comercial, assistência de implantação em nível de produção ou suporte dedicado, o plano Enterprise oferece serviços práticos da equipe Heym.

| Serviço | Descrição |
|---------|-------------|
| **Suporte a Agentes em Produção** | Revisões de arquitetura, orientação para design de agentes e workflows, e auxílio prático para levar agentes à produção |
| **Treinamento de Ferramentas** | Sessões de integração e treinamento para a sua equipe, abrangendo o editor de workflows, nós de IA, agentes e integrações |
| **Perguntas e Respostas sobre o Heym** | Acesso direto à equipe de engenharia do Heym para dúvidas sobre a plataforma, melhores práticas e resolução de problemas |
| **Implantação em Kubernetes** | Assistência com configurações de múltiplos nós de trabalho, contêineres sidecar, estratégias de escalonamento e configuração de cluster |
| **Consultoria de Soluções** | Design de soluções personalizadas para o seu caso de uso específico, incluindo planejamento de integração e recomendações de arquitetura |
| **Suporte Prioritário e SLA** | Tempos de resposta garantidos e resolução prioritária de problemas |
| **Desenvolvimento Personalizado** | Desenvolvimento de recursos e modificações adaptadas aos requisitos da sua organização |

## Heym Work

O [Heym Work](./heym-work.md) é a interface para equipas de negócios que funciona sobre o Heym. As pessoas descrevem uma tarefa, respondem a algumas perguntas e obtêm um workflow testado, trabalham a partir de páginas criadas para elas e respondem a revisões, com início de sessão único (SSO), funções Owner, Editor e Viewer e um nome em cada execução. Funciona ao lado do seu Heym com a sua própria licença; ligue-o em **Settings → Heym Work**. Saiba mais e solicite uma avaliação em [heym.run/enterprise](https://heym.run/enterprise).

## Suporte a Agentes em Produção

A equipe Heym ajuda você a projetar, construir e fortalecer agentes e workflows para os seus processos de negócio. Isso inclui revisar os seus requisitos, recomendar configurações de nós e garantir que os seus workflows sigam as melhores práticas de confiabilidade, observabilidade e governança.

O suporte abrange todos os tipos de nós, incluindo [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) e Triggers [Cron](../nodes/cron-node.md) — bem como padrões avançados como [orquestração multiagente](./agent-architecture.md), checkpoints de [Human-in-the-Loop](./human-in-the-loop.md) e [execução paralela](./parallel-execution.md) entre ramificações.

## Treinamento de Ferramentas

Sessões de treinamento prático adaptadas ao nível de habilidade e aos casos de uso da sua equipe:

- Editor de workflows e [recursos do canvas](./canvas-features.md)
- Nós com IA: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Arquitetura de agentes](./agent-architecture.md) e orquestração multiagente
- Gerenciamento de [Credenciais](./credentials.md) e [integrações de terceiros](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md) e agendamento com [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) e [variáveis globais](./global-variables.md)
- Colaboração em [Equipes](./teams.md) e [compartilhamento de credenciais](./credentials-sharing.md)
- Implantação do [Portal](./portal.md) para interfaces de chat voltadas ao cliente
- [Execuções](../tabs/traces-tab.md) e [Avaliações](../tabs/evals-tab.md) para observabilidade de workflows de IA

## Implantação em Kubernetes

O guia padrão de [Execução e Implantação](../getting-started/running-and-deployment.md) aborda o Docker Compose para configurações de produção em servidor único. Os clientes Enterprise recebem assistência com implantações Kubernetes em produção para alta disponibilidade e escalonamento horizontal:

- **Múltiplos nós de trabalho** — Distribuição dos workers de backend do Heym entre múltiplos nós Kubernetes para redundância e balanceamento de carga
- **Contêineres sidecar** — Configuração de padrões sidecar para coleta de logs, agentes de monitoramento, malhas de serviço (Istio, Linkerd) e injeção de segredos (Vault)
- **Planejamento de recursos** — Requisições/limites de CPU e memória, orçamentos de interrupção de pods e políticas de autoscaling horizontal de pods
- **Rede** — Configuração de controlador Ingress, terminação TLS e comunicação interna de serviço entre pods de backend, frontend e banco de dados
- **Armazenamento persistente** — Provisionamento de volumes de banco de dados e armazenamento vetorial com StorageClass e estratégias de backup apropriadas
- **Monitoramento** — Integração com Prometheus, Grafana ou a sua stack de observabilidade existente para métricas de contêineres, logs e alertas

## Consultoria de Soluções

Cada organização executa agentes em sistemas e restrições diferentes. A equipe Heym oferece consultoria para ajudá-lo a:

- Avaliar se o Heym se adequa ao seu caso de uso específico
- Projetar arquiteturas de agentes e workflows de ponta a ponta
- Planejar integrações com a sua infraestrutura existente e serviços de terceiros
- Depurar workflows complexos e resolver problemas em produção
- Migrar workflows existentes de ferramentas como n8n, Zapier ou Make.com

## Contato

Entre em contato com a equipe enterprise pelo e-mail **enterprise@heym.run** para consultas sobre licenciamento, preços ou para agendar uma chamada introdutória.
## Relacionado

- [Execução e Implantação](../getting-started/running-and-deployment.md) — Implantação em produção com Docker Compose
- [Segurança](./security.md) — Práticas e configuração de segurança da plataforma
- [Execução Paralela](./parallel-execution.md) — Modelo de execução com múltiplos workers
- [Equipes](./teams.md) — Colaboração em equipe e compartilhamento de recursos
- [Conjunto Completo de Recursos](./features.md) — Visão geral completa dos recursos do Heym
- [Heym Work](./heym-work.md): a interface para equipas de negócios e como ligá-la
