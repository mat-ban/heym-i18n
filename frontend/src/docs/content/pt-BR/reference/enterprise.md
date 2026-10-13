# Enterprise

Licenciamento comercial, suporte profissional e serviços de implantação para a plataforma Heym.

## Visão Geral

O Heym é gratuito para uso e auto-hospedagem sob sua licença de código disponível. Para organizações que precisam de licenciamento comercial, assistência de implantação em nível de produção ou suporte dedicado, o plano Enterprise oferece serviços práticos da equipe Heym.

| Serviço | Descrição |
|---------|-------------|
| **Suporte a Agentes em Produção** | Revisões de arquitetura, orientação de design de agentes e workflows, e ajuda prática para levar agentes à produção |
| **Treinamento de Ferramentas** | Sessões de integração e treinamento para sua equipe cobrindo o editor de workflows, nós de IA, agentes e integrações |
| **Heym Q&A** | Acesso direto à equipe de engenharia do Heym para dúvidas sobre a plataforma, melhores práticas e solução de problemas |
| **Implantação em Kubernetes** | Assistência com configurações de múltiplos worker nodes, sidecar containers, estratégias de escalonamento e configuração de cluster |
| **Consultoria de Soluções** | Design de soluções personalizadas para seu caso de uso específico, incluindo planejamento de integração e recomendações de arquitetura |
| **Suporte Prioritário e SLA** | Tempos de resposta garantidos e resolução prioritária de problemas |
| **Desenvolvimento Personalizado** | Desenvolvimento de funcionalidades e modificações adaptadas aos requisitos da sua organização |

## Heym Work

O [Heym Work](./heym-work.md) é a interface para equipes de negócios que roda sobre o Heym. As pessoas descrevem uma tarefa, respondem a algumas perguntas e obtêm um workflow testado, trabalham a partir de páginas criadas para elas e respondem a revisões, com login único (SSO), papéis de Owner, Editor e Viewer e um nome em cada execução. Ele roda ao lado do seu Heym com sua própria licença; conecte-o em **Settings → Heym Work**. Saiba mais e solicite uma avaliação em [heym.run/enterprise](https://heym.run/enterprise).

## Suporte a Agentes em Produção

A equipe Heym ajuda você a projetar, construir e fortalecer agentes e workflows para seus processos de negócios. Isso inclui revisar seus requisitos, recomendar configurações de nós e garantir que seus workflows sigam as melhores práticas de confiabilidade, observabilidade e governança.

O suporte abrange todos os tipos de nós, incluindo [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) e triggers [Cron](../nodes/cron-node.md) — bem como padrões avançados como [orquestração multi-agente](./agent-architecture.md), checkpoints de [Human-in-the-Loop](./human-in-the-loop.md) e [execução paralela](./parallel-execution.md) entre ramificações.

## Treinamento de Ferramentas

Sessões de treinamento prático adaptadas ao nível de habilidade e casos de uso da sua equipe:

- Editor de workflows e [recursos do canvas](./canvas-features.md)
- Nós com IA: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Arquitetura de agentes](./agent-architecture.md) e orquestração multi-agente
- Gerenciamento de [Credentials](./credentials.md) e [integrações de terceiros](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md) e agendamento com [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) e [variáveis globais](./global-variables.md)
- Colaboração em [Teams](./teams.md) e [compartilhamento de credentials](./credentials-sharing.md)
- Implantação do [Portal](./portal.md) para interfaces de chat voltadas ao cliente
- [Traces](../tabs/traces-tab.md) e [Evals](../tabs/evals-tab.md) para observabilidade de workflows de IA

## Implantação em Kubernetes

O guia padrão de [Execução e Implantação](../getting-started/running-and-deployment.md) cobre o Docker Compose para configurações de produção em servidor único. Clientes Enterprise recebem assistência com implantações Kubernetes em produção para alta disponibilidade e escalonamento horizontal:

- **Múltiplos worker nodes** — Distribuição dos workers de backend do Heym em vários nós Kubernetes para redundância e balanceamento de carga
- **Sidecar containers** — Configuração de padrões sidecar para coleta de logs, agentes de monitoramento, service meshes (Istio, Linkerd) e injeção de secrets (Vault)
- **Planejamento de recursos** — Requisições/limites de CPU e memória, pod disruption budgets e políticas de horizontal pod autoscaling
- **Rede** — Configuração de Ingress controller, terminação TLS e comunicação interna entre pods de backend, frontend e banco de dados
- **Armazenamento persistente** — Provisionamento de volumes para banco de dados e vector store com StorageClass e estratégias de backup apropriadas
- **Monitoramento** — Integração com Prometheus, Grafana ou sua stack de observabilidade existente para métricas de containers, logs e alertas

## Consultoria de Soluções

Cada organização executa agentes contra sistemas e restrições diferentes. A equipe Heym oferece consultoria para ajudá-lo a:

- Avaliar se o Heym se adequa ao seu caso de uso específico
- Projetar arquiteturas de agentes e workflows de ponta a ponta
- Planejar integrações com sua infraestrutura existente e serviços de terceiros
- Depurar workflows complexos e resolver problemas em produção
- Migrar workflows existentes de ferramentas como n8n, Zapier ou Make.com

## Contato

Entre em contato com a equipe enterprise em **enterprise@heym.run** para consultas sobre licenciamento, preços ou para agendar uma chamada introdutória.

## Relacionados

- [Execução e Implantação](../getting-started/running-and-deployment.md) — Implantação em produção com Docker Compose
- [Segurança](./security.md) — Práticas e configuração de segurança da plataforma
- [Execução Paralela](./parallel-execution.md) — Modelo de execução multi-worker
- [Teams](./teams.md) — Colaboração em equipe e compartilhamento de recursos
- [Conjunto Completo de Recursos](./features.md) — Visão geral completa das capacidades do Heym
- [Heym Work](./heym-work.md): a interface para equipes de negócios e como conectá-la
