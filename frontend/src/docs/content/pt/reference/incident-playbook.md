# Heym Incident Playbook (L0)

Utilize este playbook para confirmar um incidente no Heym, avaliar o impacto nos utilizadores, determinar a gravidade e aceder ao procedimento de recuperação e ao responsável adequados.

Procedimentos detalhados: [Heym Runbook (L1)](./operations-runbook.md)

Última revisão: 2026-11-10. Âmbito: Heym autoalojado, instância única ou cluster, em Docker Compose ou Kubernetes.

## Transmissão do deployment (Handover)

Preencha esta tabela para cada ambiente antes de utilizar estes documentos durante o piquete (on-call). Nomes, URLs, metas de capacidade e objetivos de recuperação são específicos do deployment. Os exemplos do repositório não constituem um inventário de produção.

| Item | Valor do deployment |
| --- | --- |
| Ambiente e URL público do Heym | `<environment>`, `<public-url>` |
| Piquete de plataforma e substituto | `<rotation-or-contact>`, `<backup-contact>` |
| Canal de incidentes e rastreador de incidentes | `<channel>`, `<tracker-url>` |
| Piquete de base de dados e identificador da base de dados | `<contact>`, `<database-id>` |
| Responsáveis por infraestrutura, rede e armazenamento | `<contacts>` |
| Responsável de release e sistema de deployment | `<contact>`, `<deployment-url>` |
| Painel de erros da aplicação, latência e disponibilidade | `<dashboard-url>` |
| Painel de CPU, memória, disco e reinicializações de anfitrião ou pod | `<dashboard-url>` |
| Painel de ligações, bloqueios, disco e replicação do PostgreSQL | `<dashboard-url>` |
| Registos e backend opcional de rastreios OTel | `<logs-url>`, `<trace-url-or-disabled>` |
| Projeto/ficheiros Compose ou contexto/namespace Kubernetes | `<exact-target>` |
| Localizações de main, workers, base de dados e armazenamento | `<services-or-deployments>`, `<storage-ids>` |
| Workflow de teste (smoke) aprovado e resultado esperado | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Procedimento de cópia de segurança de base de dados e ficheiros, último teste de restauro | `<procedure-url>`, `<test-date>` |
| Objetivos de tempo de recuperação (RTO) e ponto de recuperação (RPO) | `<RTO>`, `<RPO>` |

Mantenha contactos e ligações para painéis na cópia operacional restrita do deployment. Os elementos de prova devem conter identificadores, carimbos de data/hora, contagens e erros tratados em vez de credentials ou payloads de workflow.

## Inventário da plataforma

| Componente | Responsabilidade | Implicação em caso de incidente |
| --- | --- | --- |
| Frontend e backend principal (main) | UI, API, MCP, Portal, execução interativa | Verifique a rota pública e o processo principal separadamente |
| PostgreSQL | Estado da aplicação, registo de execuções, fila de execuções, slots de simultaneidade, coordenação e notificações | Uma falha na base de dados pode interromper tanto o processamento de pedidos como a execução em segundo plano |
| Instâncias de worker, quando o modo cluster está ativo | Execuções elegíveis em segundo plano em fila | Workers em bom estado não substituem os endpoints públicos da main |
| Processo líder eleito | Cron, avaliação de alertas, coordenação em segundo plano | Um worker compatível pode tornar-se líder; isto não altera a sua função para main |
| Armazenamento persistente de main | Ficheiros do Drive, plugins instalados e espaços de trabalho de agentes de código | Restaure o armazenamento juntamente com main; encaminhar o ingress para um worker não o restaura |
| Backend de sandbox em cada instância executora | Contentores Docker ou pods Kubernetes para execução isolada | Uma falha no backend de sandbox pode afetar nós selecionados enquanto a UI funciona |
| Dependências de workflow | Fornecedores de modelos, servidores MCP, APIs externas, armazenamentos de dados e serviços de mensagens | Determine se está a falhar uma dependência isolada ou toda a plataforma |
| Coletor OTel opcional | Spans exportados de workflow, nós e ferramentas de Agent | A ausência de rastreios exportados por si só não prova a falha de uma execução |

A fila de execução integrada do Heym utiliza o PostgreSQL. O Redis, o RabbitMQ e os armazenamentos vetoriais podem ser dependências de workflow; não são serviços obrigatórios para a fila interna.

`GET /api/health` reporta unicamente a integridade e versão do processo. Não testa o PostgreSQL, a fila, a eleição de líder, a capacidade das sandboxes ou a sincronização de credentials. Uma resposta positiva é uma verificação pontual, não uma garantia de disponibilidade de ponta a ponta.

## Primeiros cinco minutos

| Passo | Ação | Decisão ou elemento de prova |
| --- | --- | --- |
| 1 | Reconhecer o alerta e verificar o ambiente, serviço e hora de início | Registar carimbos de data/hora UTC e a alteração de release/configuração mais recente |
| 2 | Verificar a UI pública e `/api/health`, em seguida o backend principal direto | Falha pública com backend direto em bom estado sugere problemas de encaminhamento ou frontend |
| 3 | Verificar a conectividade e pressão de ligações no PostgreSQL | Encaminhar falhas de base de dados para o L1 antes de reiniciar os serviços da aplicação |
| 4 | Verificar o estado dos contentores/pods, CPU, memória, armazenamento e erros recentes | Distinguir falhas de infraestrutura, sobrecarga e falhas específicas de workflows |
| 5 | Em modo cluster, verificar **Definições > Instâncias**, estados das filas e provas do líder | Identificar perda de main, workers offline/incompatíveis ou trabalho exclusivo de main |
| 6 | Atribuir gravidade e iniciar uma mitigação a partir da tabela de encaminhamento | Para incidentes P1/P2, abrir imediatamente um incidente e envolver o responsável relevante |
| 7 | Verificar a execução segura de um workflow em modo de produção e acompanhar a recuperação | Confirmar a melhoria da antiguidade da fila, erros e recursos; definir a hora da próxima atualização |

Se uma release coincidir com a falha, inspecione [Deployment incorreto ou regressão de configuração](./operations-runbook.md#bad-deployment-or-configuration-regression). Verifique a compatibilidade do esquema antes de reverter.

## Gravidade e resposta

Estas são metas iniciais de resposta. Aplique a política de incidentes e o impacto comercial do deployment caso sejam mais rigorosos.

| Gravidade | Exemplos | Resposta |
| --- | --- | --- |
| P1 | Instância main indisponível para todos os utilizadores; base de dados indisponível ou falhas de escrita; falha generalizada de execuções; entradas críticas indisponíveis em múltiplos workflows | Mitigação imediata, registo de incidente, piquete de plataforma e dependências |
| P2 | Fila de espera crescente; perda de capacidade de workers; esgotamento iminente de ligações; um único workflow a degradar a capacidade partilhada; reinicializações repetidas por OOM | Iniciar mitigação imediatamente, meta de contenção em 15 minutos, registo de incidente |
| P3 | Falha isolada de workflow ou fornecedor; impacto limitado com capacidade global de plataforma em bom estado | Responsável pelo workflow ou componente, acompanhamento registado e nota de piquete |
| P4 | Sinal informativo, tendência esperada de capacidade, falso positivo confirmado | Reconhecer, documentar e ajustar a monitorização se necessário |

## Encaminhamento de sinais para L1

Utilize estas âncoras relativas ao configurar as ligações dos alertas. Caso um serviço de monitorização necessite de um URL absoluto, prefixe a localização da sua cópia operacional alojada.

| Sinal | Começar aqui |
| --- | --- |
| UI/API indisponível, erros 5xx públicos, falha de verificação do processo | [UI ou API inoperacional](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL inacessível, ligação recusada, falha de escrita | [Base de dados inoperacional](./operations-runbook.md#postgresql-down-or-not-writable) |
| Demasiados clientes, esgotamento do pool, espera por bloqueios, pico de ligações ativas | [Ligações e bloqueios de base de dados](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Reinicialização controlada de backend/workers necessária | [Reinicialização de serviço](./operations-runbook.md#controlled-service-restart) |
| Pico na contagem de execuções, duração total, tokens, CPU ou memória | [Workflows com maior consumo de recursos](./operations-runbook.md#most-resource-consuming-workflows) |
| Fila crescente, execuções em espera ou aparentemente bloqueadas | [Fila de espera acumulada (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instância offline ou incompatível, worker inativo, problema de agendamento ou distribuição | [Verificações do modo cluster](./operations-runbook.md#cluster-mode-checks) |
| Perda de main enquanto os workers permanecem em bom estado | [Instância principal indisponível](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Erros de Webhook, falhas em MCP/Portal, quebras de ligação SSE | [Endpoints de ingress e execução](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, disco cheio, falha de volumes persistentes | [Problema de contentor, pod ou armazenamento](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Erros de fornecedor de Agent/LLM/MCP, 429, falha de credential | [Falha de modelo ou integração](./operations-runbook.md#model-credential-or-integration-failure) |
| Falhas em sandboxes de Code/Playwright/skill/agente de código | [Falha de sandbox](./operations-runbook.md#sandbox-failure) |
| A recuperação não cumpre os objetivos; base de dados ou ficheiros perdidos | [Recuperação e resposta a desastres](./operations-runbook.md#recovery-and-disaster-response) |

## Escalamento

| Constatação | Mobilizar | Fornecer |
| --- | --- | --- |
| Múltiplas interfaces ou workflows afetados | Piquete de plataforma e líder do incidente | Ambiente, âmbito, hora de início, medidas de mitigação, próxima atualização |
| Base de dados indisponível, saturada, bloqueada ou sem espaço em disco | Piquete de base de dados | ID da BD, contagem de ligações, PIDs bloqueadores, erros tratados, estado do armazenamento |
| Falha de pod/nó, anexação de armazenamento, capacidade de sandbox | Responsável de infraestrutura/armazenamento | Contexto, namespace, carga de trabalho, eventos de pod, saturação de recursos |
| Rota pública falha enquanto o backend direto funciona | Responsável de rede/ingress | Rotas afetadas, códigos de estado, latência, comparação com backend |
| Um único workflow monopoliza a carga ou falha isoladamente | Proprietário do workflow | IDs de workflow/execução, origem do trigger, taxa, janela temporal, limites provisórios |
| Alteração de deployment ou configuração correlacionada | Responsável de release | Digest da imagem em execução, hora de lançamento, revisão de esquema, última versão estável |
| Quota, autenticação ou disponibilidade do fornecedor | Responsável de credential ou integração | Fornecedor, modelo/serviço, código de estado, ID do pedido se seguro; sem valores secretos |

Caso o impacto de nível P1/P2 persista após a primeira mitigação, proceda imediatamente ao escalamento com os elementos de prova já recolhidos. Não aguarde pela conclusão de toda a análise de causa raiz.

## Comportamento esperado em caso de falha

| Falha | O que pode continuar | Primeira ação |
| --- | --- | --- |
| PostgreSQL indisponível | O frontend estático pode ainda carregar | Restaurar o caminho da base de dados; não reiniciar todas as instâncias da aplicação |
| Main indisponível, workers em bom estado | Tarefas elegíveis em segundo plano e agendamentos podem continuar se um worker compatível liderar | Restaurar main com o seu armazenamento persistente; UI/API/MCP/Portal públicos permanecem indisponíveis |
| Worker indisponível | Outras instâncias elegíveis assumem as tarefas em fila assim que forem reatribuídas | Verificar posicionamento, capacidade de reserva e recuperação antes de readmitir tráfego |
| Execução interrompida | Execuções recuperáveis elegíveis podem reiniciar a partir do início, uma única vez | Verificar a recuperação automática e efeitos secundários externos antes de repetir manualmente |
| Sobrecarga de tarefas exclusivas de main | Os workers podem permanecer inativos | Reduzir a entrada causadora ou aumentar a capacidade de main; alterações de peso não movem tarefas vinculadas |
| Alertas internos indisponíveis | A monitorização externa de uptime/BD/infraestrutura pode continuar a funcionar | Utilizar monitorização externa ao Heym; os alertas do Heym dependem da mesma BD e do mesmo agendador |
| Sandbox ou fornecedor indisponível | Os workflows sem essa dependência podem funcionar | Isolar os workflows afetados e reparar a dependência |

## Recuperação e encerramento do incidente

1. Verifique o acesso público, o acesso à base de dados, a elegibilidade pretendida das instâncias e um workflow de teste (smoke) seguro em modo de produção. Um teste no editor não comprova a distribuição para workers.
2. Acompanhe pelo menos 10 minutos de estabilidade nos erros, latência, utilização de recursos e uma diminuição da antiguidade da fila. Observe também o próximo agendamento crítico previsto ou uma verificação equivalente acordada.
3. Reconcilie as execuções falhadas, recuperadas, ignoradas, expiradas e pendentes com os proprietários dos workflows. Verifique os efeitos secundários externos antes de repetir qualquer operação.
4. Restaure gradualmente as pausas temporárias de triggers, limites e ponderações de workers. Atribua um responsável e uma data de validade a cada restrição remanescente.
5. Atualize o incidente com o impacto, a cronologia UTC, as ações, os elementos de prova e os riscos em aberto. Atribua uma revisão de causa raiz para P1/P2 e atualize ambos os documentos caso algum procedimento estivesse em falta.

## Referências operacionais associadas

- [Configuração de comandos e verificações L1](./operations-runbook.md#command-setup)
- [Execução e deployment](../getting-started/running-and-deployment.md)
- [Distribuição de carga](./cluster.md)
- [Deployment em Kubernetes](../getting-started/kubernetes.md)
- [Segurança e rotação de chaves](./security.md)
