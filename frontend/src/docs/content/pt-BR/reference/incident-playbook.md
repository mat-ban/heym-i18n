# Heym Incident Playbook (L0)

Use este playbook para confirmar um incidente no Heym, avaliar o impacto nos usuários, determinar a severidade e acessar o procedimento de recuperação e o responsável adequados.

Procedimentos detalhados: [Heym Runbook (L1)](./operations-runbook.md)

Última revisão: 2026-11-10. Escopo: Heym auto-hospedado, instância única ou cluster, no Docker Compose ou Kubernetes.

## Transmissão do deploy (Handover)

Preencha esta tabela para cada ambiente antes de usar estes documentos durante o plantão (on-call). Nomes, URLs, metas de capacidade e objetivos de recuperação são específicos do deploy. Os exemplos do repositório não constituem um inventário de produção.

| Item | Valor do deploy |
| --- | --- |
| Ambiente e URL pública do Heym | `<environment>`, `<public-url>` |
| Plantonista de plataforma e substituto | `<rotation-or-contact>`, `<backup-contact>` |
| Canal de incidentes e rastreador de incidentes | `<channel>`, `<tracker-url>` |
| Plantonista de banco de dados e identificador do banco | `<contact>`, `<database-id>` |
| Responsáveis por infraestrutura, rede e armazenamento | `<contacts>` |
| Responsável de release e sistema de deploy | `<contact>`, `<deployment-url>` |
| Painel de erros da aplicação, latência e disponibilidade | `<dashboard-url>` |
| Painel de CPU, memória, disco e reinicializações de host ou pod | `<dashboard-url>` |
| Painel de conexões, bloqueios, disco e replicação do PostgreSQL | `<dashboard-url>` |
| Logs e backend opcional de rastreamento OTel | `<logs-url>`, `<trace-url-or-disabled>` |
| Projeto/arquivos Compose ou contexto/namespace Kubernetes | `<exact-target>` |
| Locais de main, workers, banco de dados e armazenamento | `<services-or-deployments>`, `<storage-ids>` |
| Workflow de fumaça (smoke) aprovado e resultado esperado | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Procedimento de backup de banco de dados e arquivos, último teste de restauração | `<procedure-url>`, `<test-date>` |
| Objetivos de tempo de recuperação (RTO) e ponto de recuperação (RPO) | `<RTO>`, `<RPO>` |

Mantenha contatos e links para painéis na cópia operacional restrita do deploy. As evidências devem conter identificadores, carimbos de data/hora, contagens e erros tratados em vez de credentials ou payloads de workflow.

## Inventário da plataforma

| Componente | Responsabilidade | Implicação em incidentes |
| --- | --- | --- |
| Frontend e backend principal (main) | UI, API, MCP, Portal, execução interativa | Verifique a rota pública e o processo main separadamente |
| PostgreSQL | Estado da aplicação, registro de execuções, fila de execuções, slots de concorrência, coordenação e notificações | Uma falha no banco de dados pode parar tanto o atendimento a requisições quanto a execução em segundo plano |
| Instâncias de worker, quando o modo cluster está ativado | Execuções elegíveis em segundo plano na fila | Workers saudáveis não substituem os endpoints públicos da main |
| Processo líder eleito | Cron, avaliação de alertas, coordenação em segundo plano | Um worker compatível pode se tornar líder; isso não muda seu papel para main |
| Armazenamento persistente de main | Arquivos do Drive, plugins instalados e workspaces de agentes de código | Restaure o armazenamento junto com main; rotear o ingress para um worker não o restaura |
| Backend de sandbox em cada instância executora | Contêineres Docker ou pods Kubernetes para execução isolada | Uma falha no backend de sandbox pode afetar nós específicos enquanto a UI funciona |
| Dependências de workflow | Provedores de modelos, servidores MCP, APIs externas, bancos de dados e serviços de mensagens | Determine se uma dependência isolada ou toda a plataforma está falhando |
| Coletor OTel opcional | Spans exportados de workflow, nós e ferramentas de Agent | A ausência de rastreamentos exportados por si só não comprova a falha de uma execução |

A fila de execução integrada do Heym usa o PostgreSQL. Redis, RabbitMQ e bancos vetoriais podem ser dependências de workflow; não são serviços obrigatórios para a fila interna.

`GET /api/health` relata exclusivamente a integridade e versão do processo. Não testa o PostgreSQL, a fila, a eleição de líder, a capacidade das sandboxes ou a sincronização de credentials. Uma resposta positiva é uma verificação pontual, não uma garantia de prontidão de ponta a ponta.

## Primeiros cinco minutos

| Passo | Ação | Decisão ou evidência |
| --- | --- | --- |
| 1 | Reconhecer o alerta e verificar o ambiente, serviço e horário de início | Registrar carimbos de data/hora UTC e a alteração de release/configuração mais recente |
| 2 | Verificar a UI pública e `/api/health`, depois o backend principal direto | Falha pública com backend direto saudável indica problemas de roteamento ou frontend |
| 3 | Verificar a conectividade e pressão de conexões no PostgreSQL | Encaminhar falhas de banco de dados para o L1 antes de reiniciar os serviços da aplicação |
| 4 | Verificar o estado dos contêineres/pods, CPU, memória, armazenamento e erros recentes | Separar falhas de infraestrutura, sobrecarga e falhas específicas de workflows |
| 5 | Em modo cluster, verificar **Configurações > Instâncias**, estados das filas e evidências de líder | Identificar perda de main, workers offline/incompatíveis ou trabalho exclusivo de main |
| 6 | Atribuir severidade e iniciar uma mitigação a partir da tabela de roteamento | Para incidentes P1/P2, abrir imediatamente um incidente e envolver o responsável relevante |
| 7 | Verificar a execução segura de um workflow em modo de produção e acompanhar a recuperação | Confirmar a melhora da idade da fila, erros e recursos; definir o horário da próxima atualização |

Se uma release coincidir com a falha, inspecione [Deploy incorreto ou regressão de configuração](./operations-runbook.md#bad-deployment-or-configuration-regression). Verifique a compatibilidade do schema antes de reverter.

## Severidade e resposta

Estas são metas iniciais de resposta. Aplique a política de incidentes e o impacto comercial do deploy caso sejam mais rigorosos.

| Severidade | Exemplos | Resposta |
| --- | --- | --- |
| P1 | Instância main indisponível para todos os usuários; banco de dados indisponível ou falhas de escrita; falha generalizada de execuções; entradas críticas indisponíveis em múltiplos workflows | Mitigação imediata, registro de incidente, plantão de plataforma e dependências |
| P2 | Fila de espera crescente; perda de capacidade de workers; esgotamento iminente de conexões; um único workflow degradando a capacidade compartilhada; reinicializações repetidas por OOM | Iniciar mitigação imediatamente, meta de contenção em 15 minutos, registro de incidente |
| P3 | Falha isolada de workflow ou provedor; impacto limitado com capacidade global de plataforma saudável | Responsável pelo workflow ou componente, acompanhamento registrado e nota de plantão |
| P4 | Sinal informativo, tendência esperada de capacidade, falso positivo confirmado | Reconhecer, documentar e ajustar o monitoramento se necessário |

## Roteamento de sinais para L1

Use estas âncoras relativas ao configurar os links de alerta. Quando um serviço de monitoramento exigir uma URL absoluta, adicione o prefixo do local da sua cópia operacional hospedada.

| Sinal | Comece aqui |
| --- | --- |
| UI/API indisponível, erros 5xx públicos, falha de integridade do processo | [UI ou API inoperante](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL inacessível, conexão recusada, falha de escrita | [Banco de dados inoperante](./operations-runbook.md#postgresql-down-or-not-writable) |
| Clientes em excesso, estouro do pool, espera por bloqueios, pico de conexões ativas | [Conexões e bloqueios de banco de dados](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Reinicialização controlada de backend/workers necessária | [Reinicialização de serviço](./operations-runbook.md#controlled-service-restart) |
| Pico na contagem de execuções, duração total, tokens, CPU ou memória | [Workflows com maior consumo de recursos](./operations-runbook.md#most-resource-consuming-workflows) |
| Fila crescente, execuções aguardando ou aparentemente travadas | [Fila acumulada (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instância offline ou incompatível, worker ocioso, problema de agendamento ou distribuição | [Verificações do modo cluster](./operations-runbook.md#cluster-mode-checks) |
| Perda de main enquanto os workers continuam saudáveis | [Instância principal indisponível](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Erros de Webhook, falhas em MCP/Portal, quedas de conexão SSE | [Endpoints de ingress e execução](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, disco cheio, falha de volumes persistentes | [Problema de contêiner, pod ou armazenamento](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Erros de provedor de Agent/LLM/MCP, 429, falha de credential | [Falha de modelo ou integração](./operations-runbook.md#model-credential-or-integration-failure) |
| Falhas em sandboxes de Code/Playwright/skill/agente de código | [Falha de sandbox](./operations-runbook.md#sandbox-failure) |
| A recuperação não cumpre os objetivos; banco de dados ou arquivos perdidos | [Recuperação e resposta a desastres](./operations-runbook.md#recovery-and-disaster-response) |

## Escalonamento

| Constatação | Mobilizar | Fornecer |
| --- | --- | --- |
| Múltiplas interfaces ou workflows afetados | Plantão de plataforma e líder do incidente | Ambiente, escopo, horário de início, medidas de mitigação, próxima atualização |
| Banco de dados indisponível, saturado, bloqueado ou sem espaço em disco | Plantão de banco de dados | ID do banco, contagem de conexões, PIDs bloqueadores, erros tratados, estado do armazenamento |
| Falha de pod/nó, conexão de armazenamento, capacidade de sandbox | Responsável de infraestrutura/armazenamento | Contexto, namespace, carga de trabalho, eventos de pod, pressão de recursos |
| Rota pública falha enquanto o backend direto funciona | Responsável de rede/ingress | Rotas afetadas, códigos de status, latência, comparação com backend |
| Um único workflow domina a carga ou falha isoladamente | Proprietário do workflow | IDs de workflow/execução, origem do trigger, taxa, janela de tempo, limites provisórios |
| Alteração de deploy ou configuração correlacionada | Responsável de release | Digest da imagem em execução, horário de implantação, revisão de schema, última versão funcional |
| Cota, autenticação ou disponibilidade do provedor | Responsável de credential ou integração | Provedor, modelo/serviço, código de status, ID da requisição se seguro; sem valores secretos |

Se o impacto de nível P1/P2 persistir após a primeira mitigação, faça o escalonamento imediatamente com as evidências já coletadas. Não espere pela análise de causa raiz completa.

## Comportamento esperado em falhas

| Falha | O que pode continuar | Primeira ação |
| --- | --- | --- |
| PostgreSQL indisponível | O frontend estático pode ainda carregar | Restaurar o caminho do banco de dados; não reiniciar todas as instâncias da aplicação |
| Main indisponível, workers saudáveis | Tarefas elegíveis em segundo plano e agendamentos podem continuar se um worker compatível liderar | Restaurar main com seu armazenamento persistente; UI/API/MCP/Portal públicos continuam indisponíveis |
| Worker indisponível | Outras instâncias elegíveis assumem as tarefas na fila assim que forem reatribuídas | Verificar alocação, capacidade de reserva e recuperação antes de adicionar tráfego |
| Execução interrompida | Execuções recuperáveis elegíveis podem reiniciar a partir do início, uma única vez | Verificar a recuperação automática e efeitos colaterais externos antes de repetir manualmente |
| Sobrecarga de tarefas exclusivas de main | Os workers podem ficar ociosos | Reduzir a entrada causadora ou aumentar a capacidade de main; alterações de peso não movem tarefas fixadas |
| Alertas internos indisponíveis | O monitoramento externo de uptime/banco/infraestrutura pode continuar funcionando | Usar monitoramento externo ao Heym; os alertas do Heym dependem do mesmo banco e agendador |
| Sandbox ou provedor indisponível | Os workflows sem essa dependência podem funcionar | Isolar os workflows afetados e reparar a dependência |

## Recuperação e encerramento do incidente

1. Verifique o acesso público, o acesso ao banco de dados, a elegibilidade prevista das instâncias e um workflow de fumaça (smoke) seguro em modo de produção. Um teste no editor não comprova a distribuição para workers.
2. Acompanhe pelo menos 10 minutos de estabilidade nos erros, latência, uso de recursos e uma diminuição da idade da fila. Observe também o próximo agendamento crítico esperado ou uma verificação equivalente combinada.
3. Reconcilie as execuções com falha, recuperadas, ignoradas, expiradas e pendentes com os proprietários dos workflows. Verifique os efeitos colaterais externos antes de repetir qualquer operação.
4. Restaure gradualmente as pausas temporárias de triggers, limites e pesos de workers. Atribua um responsável e uma data de expiração para cada restrição remanescente.
5. Atualize o incidente com o impacto, a linha do tempo UTC, as ações, as evidências e os riscos em aberto. Atribua uma análise de causa raiz para P1/P2 e atualize ambos os documentos caso algum procedimento estivesse ausente.

## Referências operacionais associadas

- [Configuração de comandos e verificações L1](./operations-runbook.md#command-setup)
- [Operação e deploy](../getting-started/running-and-deployment.md)
- [Distribuição de carga](./cluster.md)
- [Deploy no Kubernetes](../getting-started/kubernetes.md)
- [Segurança e rotação de chaves](./security.md)
