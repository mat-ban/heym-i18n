# Heym Runbook (L1)

Siga estes procedimentos para diagnosticar e recuperar os serviços Heym, as conexões PostgreSQL, as filas de workflows, a capacidade do cluster e a execução em sandbox.

Comece com [Heym Incident Playbook (L0)](./incident-playbook.md) para gravidade, contatos e inventário de implementação.

Última revisão: 2026-11-10. Os comandos correspondem ao repositório no momento da revisão. Confirme a versão e a topologia implementadas antes da utilização. Todos os comandos de alteração de serviço abaixo são instruções para um operador, não uma remediação automática.

## Índice de procedimentos

| Incidente |
| --- |
| [UI ou API indisponível](#ui-ou-api-indisponível) |
| [PostgreSQL indisponível ou não gravável](#postgresql-indisponível-ou-não-gravável) |
| [Conexões de BD ativas, saturação do pool e bloqueios](#conexões-de-bd-ativas-saturação-do-pool-e-bloqueios) |
| [Reinício controlado do serviço](#reinício-controlado-do-serviço) |
| [Workflows que mais consomem recursos](#workflows-que-mais-consomem-recursos) |
| [Acumulação na fila ou execuções aparentemente bloqueadas](#acumulação-na-fila-ou-execuções-aparentemente-bloqueadas) |
| [Verificações do modo cluster](#verificações-do-modo-cluster) |
| [Instância main indisponível enquanto os workers estão ativos](#instância-main-indisponível-enquanto-os-workers-estão-ativos) |
| [Falhas de webhook, MCP, Portal ou streaming](#falhas-de-webhook-mcp-portal-ou-streaming) |
| [Problemas de contêiner, pod, OOM ou armazenamento](#problemas-de-contêiner-pod-oom-ou-armazenamento) |
| [Implementação incorreta ou regressão de configuração](#implementação-incorreta-ou-regressão-de-configuração) |
| [Falha de modelo, credencial ou integração](#falha-de-modelo-credencial-ou-integração) |
| [Falha de sandbox](#falha-de-sandbox) |
| [Recuperação de desastres e resposta a emergências](#recuperação-de-desastres-e-resposta-a-emergências) |

## Configuração de comandos

Trabalhe a partir do checkout implementado ou das ferramentas de implementação. Selecione apenas a topologia em execução real no ambiente afetado. Não utilize um projeto de exemplo para responder a um incidente de produção.

### Docker Compose

Defina este utilitário shell para a instalação padrão do Compose:
```bash
heym_compose() { docker compose -f docker-compose.yml "$@"; }
HEYM_MAIN_SERVICE=backend
HEYM_FRONTEND_SERVICE=frontend
```

Para o exemplo de cluster do repositório, utilize esta definição em alternativa:
```bash
heym_compose() { docker compose -f docker-compose.cluster.yml "$@"; }
HEYM_MAIN_SERVICE=main
HEYM_WORKER_SERVICE=worker-a
```

Para um worker autônomo no seu próprio host, utilize `docker compose -f docker-compose.worker.yml` e o serviço `worker`. Não possui serviço local de PostgreSQL nem de frontend. Inclua o nome real do projeto de implementação, arquivos de substituição e arquivo de ambiente no utilitário, caso sejam utilizados.
```bash
heym_compose ps
heym_compose images
heym_compose logs --since 15m --tail 200 "$HEYM_MAIN_SERVICE"
docker stats --no-stream
```

A stack padrão do Compose publica por predefinição o frontend na porta host `4017` e o PostgreSQL na `6543`. A sua porta backend `10105` é interna. O exemplo de cluster publica a API da main em `10105`, a API do worker-a em `10111` e o PostgreSQL em `6544`. Uma imagem de release combina o frontend e o backend num único contêiner. Verifique os mapeamentos de portas com `ps`.

Para uma verificação direta do processo backend dentro de um contêiner main do Compose:
```bash
heym_compose exec -T "$HEYM_MAIN_SERVICE" uv run python -c \
  'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:10105/api/health", timeout=5).read().decode())'
```

### Kubernetes

Defina o contexto, namespace e nomes de cargas de trabalho reais. Estes nomes de implementação correspondem exclusivamente aos exemplos do repositório.
```bash
HEYM_KUBE_CONTEXT='<actual-context>'
HEYM_NAMESPACE=heym
HEYM_MAIN_DEPLOYMENT=heym
HEYM_WORKER_DEPLOYMENT=heym-worker
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get deployments,pods,svc,pvc
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get events --sort-by=.lastTimestamp
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --all-containers=true --since=15m --tail=200
```

A implementação base é composta por uma única réplica da main com estratégia `Recreate`, armazenamento persistente e uma sonda de prontidão em `/api/health`. A sua porta pública de contêiner é `4017`; um worker exclusivo de backend utiliza `10105`. Não presuma que um reinício ou rollout ocorra sem tempo de inatividade. Consulte [Comportamento de Deployment do Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#recreate-deployment).

### Estado e acesso à API
```bash
HEYM_PUBLIC_URL='https://your-heym-host.example'
curl --fail --silent --show-error --connect-timeout 3 --max-time 10 \
  "$HEYM_PUBLIC_URL/api/health"
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/"
```

`/api/health` devolve `status`, `service` e `version`; não realiza verificações de dependências. Confirme a base de dados e um workflow ponta a ponta aprovado separadamente.

Os exemplos autenticados abaixo utilizam um arquivo de configuração curl provisionado fora deste repositório em `$HEYM_CURL_CONFIG`, contendo o cabeçalho `Authorization` do operador. Restrinja as permissões ao operador, mantenha-o fora do controlo de versões e remova cópias temporárias após a utilização. Não cole tokens em comandos, URLs, registros ou notas de incidentes. Utilize uma sessão de interface autenticada existente sempre que disponível. Inspecione códigos de estado e o esquema OpenAPI implementado no backend em `/docs` antes de tentar novamente uma mutação que falhou.

### Acesso SQL e limites de consultas

Para a base de dados integrada do Compose, abra uma sessão com a identidade configurada do contêiner de base de dados:
```bash
heym_compose exec postgres sh -c \
  'exec psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Para uma base de dados externa, utilize uma definição de serviço `psql` e um arquivo de palavras-passe aprovados ou a consola do fornecedor de base de dados. Uma conexão libpq utiliza `postgresql://`, e não `postgresql+asyncpg://` do SQLAlchemy. Teste tanto a partir do caminho de rede da aplicação afetada como do caminho do DBA.

Execute SQL de diagnóstico com uma função de apenas leitura sempre que possível. No início de cada sessão de diagnóstico:
```sql
SET default_transaction_read_only = on;
SET statement_timeout = '5s';
SET lock_timeout = '1s';
SELECT now() AS observed_at, current_database(), pg_is_in_recovery();
```

Utilize o nó primário gravável previsto para verificações de aplicações. Uma réplica pode responder a `SELECT 1` enquanto o caminho de escrita está indisponível. Detalhes de `pg_stat_activity` podem exigir privilégios de monitorização de base de dados; linhas ocultas ou campos NULL não são prova de inatividade. As consultas de diagnóstico abaixo omitem payloads, segredos e texto SQL. Não atualizam tabelas Heym. Consulte [Atividade e visibilidade do PostgreSQL](https://www.postgresql.org/docs/16/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW).

## Verificação partilhada

Após cada mitigação, verifique o acesso público, a capacidade de resposta da base de dados, um workflow smoke aprovado e as métricas relevantes de capacidade/backlog. Utilize um trigger seguro em modo de produção ao verificar o envio do cluster: as execuções de teste do editor permanecem na instância recetora. Monitorize durante pelo menos 10 minutos, além da próxima calendarização crítica esperada ou verificação equivalente acordada. Registe alterações e defina um responsável/horário para reverter restrições temporárias.

## UI ou API indisponível

**Gravidade:** P1 para indisponibilidade generalizada de produção; P2 para degradação parcial.

**Diagnóstico**

1. Compare a interface pública, o `/api/health` público e a verificação direta do backend da main em [Configuração de comandos](#configuração-de-comandos).
2. Inspecione o estado do contêiner ou pod main/frontend, erros recentes e CPU/memória/disco. O carregamento de uma UI estática não prova que a API funcione.
3. Execute a [verificação de base de dados](#postgresql-indisponível-ou-não-gravável). Inspecione a última release e alterações de ingress/proxy.
4. Se apenas falharem pedidos autenticados, distinga sessões/SSO expirados de uma falha geral da API. Não reponha chaves partilhadas para testar o login.

**Mitigação**

1. Repare primeiro as dependências de base de dados ou armazenamento quando explicarem a falha.
2. Se o backend direto funcionar, restaure a rota frontend/proxy/ingress. O ingress deve apontar para a main em modo cluster.
3. Se a main estiver bloqueada e as dependências estiverem saudáveis, siga [Reinício controlado do serviço](#reinício-controlado-do-serviço). Restaure apenas o serviço de frontend afetado quando este for o componente com falha.
4. Para uma regressão de versão, siga [Implementação incorreta](#implementação-incorreta-ou-regressão-de-configuração).

**Verificação:** A UI pública carrega, o acesso à API autenticada tem êxito e um workflow smoke é concluído. Um endpoint de processo a verde por si só é insuficiente.

**Escalação:** Plantão da plataforma para falhas de backend; responsável de rede/ingress quando falha apenas a rota pública; responsável de base de dados ou armazenamento quando falham as verificações de dependências.

## PostgreSQL indisponível ou não gravável

**Gravidade:** P1 quando falham as conexões ou escritas de produção; P2 para degradação intermitente.

**Diagnóstico**

Para o PostgreSQL integrado:
```bash
heym_compose ps postgres
heym_compose logs --since 15m --tail 150 postgres
heym_compose exec -T postgres sh -c \
  'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

1. `pg_isready` verifica se o servidor aceita conexões. Confirme o acesso SQL autenticado e o estado primário utilizando o [acesso SQL](#configuração-de-comandos).
2. A partir da instância afetada, verifique DNS, encaminhamento, endpoint/porta da base de dados, TLS e políticas de rede. Uma conexão DBA local não garante a acessibilidade da aplicação.
3. Leia o erro saneado: conexão recusada/tempo limite excedido, falha de autenticação, esgotamento de conexões, transação de apenas leitura, armazenamento esgotado ou falha de migração.
4. Verifique disco/inodos do host de base de dados, registros da base de dados, estado de failover/replicação e eventos de manutenção. Utilize [Conexões e bloqueios](#conexões-de-bd-ativas-saturação-do-pool-e-bloqueios) em caso de saturação.

**Mitigação**

1. Reduza a receção de produtores e tempestades de novas tentativas. Pause triggers automáticos infratores através do Heym se a sua API estiver funcional; caso contrário, coordene a redução de tráfego a montante. Evite repetições em massa.
2. Para uma base de dados integrada parada com armazenamento intacto verificado e sem operação ativa de failover/recuperação, inicie apenas o serviço existente:
```bash
   heym_compose start postgres
   ```

3. Para PostgreSQL gerido, falhas de rede, disco cheio, corrupção ou failover, utilize o procedimento de recuperação do responsável da base de dados. Conserve o volume da base de dados e o material de chaves existente.
4. Assim que o nó primário gravável estiver acessível, permita que os pools/listeners se reconectem. Reinicie uma instância de aplicação apenas se esta continuar a falhar após o restabelecimento do caminho da base de dados.
5. Nunca inicialize uma base de dados vazia de substituição durante um incidente, não elimine arquivos WAL e não execute `docker compose down -v`. A restauração segue [Recuperação de desastres](#recuperação-de-desastres-e-resposta-a-emergências).

**Verificação:** O SQL do caminho aplicacional funciona contra o primário pretendido, as escritas normais da aplicação têm êxito através do workflow smoke, os erros de conexão cessam, os heartbeats são retomados e a idade da fila diminui.

**Escalação:** Plantão de base de dados imediatamente para P1, problemas de primário/failover, corrupção de dados ou armazenamento esgotado. Envie a identidade do endpoint, carimbos de data/hora, classe de estado/erro e provas de armazenamento/conexão sem credenciais.

## Conexões de BD ativas, saturação do pool e bloqueios

**Gravidade:** P1 se nenhum trabalho útil conseguir conectar-se; P2 se a pressão ou bloqueios estiverem a degradar a execução.

**Diagnóstico**

Execute isto no servidor PostgreSQL afetado. O total abrange todo o servidor porque outras bases de dados consomem o mesmo limite de conexões. `active` está a executar uma consulta; `idle` está conectado sem consulta atual. Ambos consomem um slot. O PostgreSQL reserva alguns slots, pelo que os clientes comuns podem ser recusados antes que o total atinja `max_connections`.
```sql
SELECT current_setting('max_connections')::int AS max_connections,
       current_setting('superuser_reserved_connections')::int AS superuser_reserved,
       current_setting('reserved_connections', true) AS reserved_connections,
       count(*) FILTER (WHERE backend_type = 'client backend') AS client_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state = 'active') AS active_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state LIKE 'idle in transaction%') AS idle_in_transaction
FROM pg_stat_activity;

SELECT datname, application_name, usename, client_addr, state,
       wait_event_type, wait_event, count(*) AS connections
FROM pg_stat_activity
WHERE backend_type = 'client backend'
GROUP BY datname, application_name, usename, client_addr, state,
         wait_event_type, wait_event
ORDER BY connections DESC
LIMIT 50;
```

O Heym etiqueta as conexões de pool e listener como `heym-<instance-id>`. Compare o grupo de conexões com os heartbeats das instâncias e a contagem de processos. Um pool inativo é esperado. Uma população crescente de `idle in transaction` requer investigação.
```sql
SELECT pid, application_name, state,
       now() - xact_start AS transaction_age,
       CASE WHEN state = 'active' THEN now() - query_start END AS active_query_age,
       wait_event_type, wait_event, pg_blocking_pids(pid) AS blocking_pids
FROM pg_stat_activity
WHERE datname = current_database()
  AND backend_type = 'client backend'
  AND pid <> pg_backend_pid()
  AND (state = 'active' OR state LIKE 'idle in transaction%')
ORDER BY xact_start ASC NULLS LAST
LIMIT 30;
```

Distinga o esgotamento do servidor (`too many clients`) de um tempo limite excedido no pool local do SQLAlchemy. Um pool local pode saturar porque os pedidos retêm conexões ou aguardam bloqueios, mesmo quando o servidor dispõe de slots livres.

Orçamente o pico configurado, incluindo o overflow e todos os processos uvicorn:
```text
sum over instances:
  process_count * (async_pool_size + async_max_overflow
                   + sync_pool_size + sync_max_overflow + 4 listeners)
then add other clients, monitoring, and operational headroom
```

Os valores padrão por processo são `HEYM_DB_POOL_SIZE=10`, `HEYM_DB_MAX_OVERFLOW=20`, `HEYM_DB_SYNC_POOL_SIZE=5` e `HEYM_DB_SYNC_MAX_OVERFLOW=10`. O ponto de entrada padrão do backend inicia 8 processos: o seu pico teórico é `8 * (10 + 20 + 5 + 10 + 4) = 392`, antes de outros clientes. Os pools crescem a pedido; este é um teto máximo, não o número aberto esperado. A sessão dedicada do líder é retida a partir do pool assíncrono. Existem quatro conexões de listener por processo, mesmo numa instalação com uma única instância; os fluxos de chat partilham um listener.

Leia as configurações reais a partir do manifesto implementado. Os arquivos de exemplo substituem alguns valores padrão e contagens de processos. A adição de workers adiciona também pools e listeners; isto pode agravar a pressão sobre a base de dados.

**Mitigação**

1. Regule as cargas de trabalho/produtores identificados. Conserve um caminho de acesso DBA e margem operacional.
2. Peça ao proprietário da base de dados para inspecionar bloqueadores/transações longas individuais. Não encerre sessões Heym em massa: os listeners e a sessão de bloqueio consultivo do líder são caminhos essenciais de coordenação. O cancelamento de consultas e a conclusão de sessões têm efeitos diferentes; o DBA deve focar-se num culpado confirmado. Consulte [Sinais do servidor PostgreSQL](https://www.postgresql.org/docs/16/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL).
3. Se a capacidade o exigir, reduza os tamanhos de pool/overflow ou a contagem de processos através da configuração de implementação e drene/recrie instâncias uma de cada vez. Verifique a carga da API e a capacidade do executor após a redução. Uma alteração de pool requer substituição de processo; `restart` não aplica valores de ambiente Compose alterados.
4. `docker-compose.yml` não encaminha explicitamente as quatro variáveis de pool. Adicione substituições de ambiente aprovadas na configuração real de implementação em vez de presumir que uma entrada `.env` do host atinge o contêiner. Os exemplos de cluster e worker têm os seus próprios mapeamentos.
5. Coordene qualquer aumento de `max_connections` com o proprietário da base de dados e o orçamento de memória. Evite reconexões simultâneas em toda a frota.

**Verificação:** As conexões totais de clientes estabilizam com margem, os erros de pool cessam, os bloqueios desaparecem, os erros de listener/heartbeat param e o workflow smoke é bem-sucedido.

**Escalação:** Proprietário da base de dados para intervenção em bloqueios ou alterações ao teto de conexões; proprietário da plataforma para fugas de conexões, privação de pool ou tempestades repetidas de reconexão.

## Reinício controlado do serviço

**Gravidade:** Herda a gravidade do incidente. Reiniciar a main interrompe o serviço público na topologia documentada.

**Antes de reiniciar**

1. Confirme a instância/serviço de destino e capture registros, digest da imagem, motivo do reinício e IDs de execuções ativas/em fila. Confirme que o PostgreSQL e o armazenamento estão saudáveis.
2. Reduza novas entradas. Para um worker, desative **On** em **Configurações > Instâncias** na interface ou defina o seu peso para 0. Drene o trabalho em curso antes de reiniciar.
3. Reveja [Recuperação e cancelamento de execuções](#implementação-incorreta-ou-regressão-de-configuração). O Heym retoma execuções incompletas reexecutando workflows elegíveis desde o início.
4. Não elimine volumes, não omita arquivos de ambiente e não execute `docker compose down` simples.

**Reiniciar um serviço com configuração inalterada**
```bash
# Compose main. Use the existing topology helper.
heym_compose restart -t 60 "$HEYM_MAIN_SERVICE"
heym_compose ps "$HEYM_MAIN_SERVICE"
heym_compose logs --since 5m --tail 150 "$HEYM_MAIN_SERVICE"
```

Para um worker drenado do exemplo de cluster, substitua `$HEYM_WORKER_SERVICE`. O tempo limite de paragem de 60 segundos permite que as execuções em curso terminem ou atinjam um estado de pausa limpo antes de SIGKILL.

**Reinício completo da stack Compose**

Prefira reinícios de serviço único. Um reinício de stack para toda a stack Compose, incluindo o PostgreSQL.
```bash
# Kubernetes main. Recreate strategy can cause downtime.
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout restart \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
```

Substitua `$HEYM_WORKER_DEPLOYMENT` para um worker drenado. Um Deployment com múltiplas réplicas pode realizar um reinício progressivo. A estratégia `Recreate` na main encerra o pod antigo antes de agendar o novo: aguarde um tempo de inatividade equivalente ao encerramento, agendamento, remontagem de volume e arranque.

**Verificação:** Os endpoints de estado dos processos respondem, as conexões ao PostgreSQL restabelecem-se, os heartbeats dos workers são retomados em **Configurações > Instâncias** e o workflow smoke é concluído.

**Escalação:** Plantão da plataforma se o arranque bloquear ou se as sondas falharem; plantão de base de dados se o arranque entrar em ciclo nas migrações.

## Workflows que mais consomem recursos

**Gravidade:** P2 quando a carga de workflows degrada os tempos de resposta; P1 se ameaçar a disponibilidade da base de dados, workers ou serviço público.

**Diagnóstico**

Workflows recentes ordenados pela duração total decorrida registada:
```sql
SELECT h.workflow_id, w.name, w.owner_id,
       count(*) AS recorded_runs,
       count(*) FILTER (WHERE h.status IN ('error', 'failed', 'timeout')) AS failed_runs,
       round((sum(h.execution_time_ms) / 1000.0)::numeric, 1) AS total_elapsed_seconds,
       round((max(h.execution_time_ms) / 1000.0)::numeric, 1) AS max_elapsed_seconds
FROM execution_history h
JOIN workflows w ON w.id = h.workflow_id
WHERE h.started_at >= now() - interval '1 hour'
GROUP BY h.workflow_id, w.name, w.owner_id
ORDER BY total_elapsed_seconds DESC
LIMIT 20;
```

Para identificar workflows de elevado volume, execute novamente a mesma consulta com `ORDER BY recorded_runs DESC`.

Workflows recentes ordenados pela duração média com pelo menos 5 execuções:
```sql
SELECT a.execution_id, a.workflow_id, w.name,
       a.executed_by_instance_id, a.trigger_source,
       now() - a.started_at AS run_age,
       now() - a.heartbeat_at AS heartbeat_age,
       a.running_node_ids, a.attempt, a.recoverable, a.cancel_requested_at
FROM active_workflow_executions a
JOIN workflows w ON w.id = a.workflow_id
ORDER BY a.started_at
LIMIT 50;

SELECT t.workflow_id, w.name, count(*) AS trace_records,
       sum(coalesce(t.total_tokens, 0)) AS tokens
FROM llm_traces t
LEFT JOIN workflows w ON w.id = t.workflow_id
WHERE t.created_at >= now() - interval '1 hour'
GROUP BY t.workflow_id, w.name
ORDER BY tokens DESC
LIMIT 20;
```

IDs de workflow NULL podem representar atividade de chat ou assistente. Os registros de trace não são gerados para execuções de teste não guardadas no editor de canvas.

Correlacione o tempo de base de dados com a execução ao nível dos nós. Visualize estrangulamentos de nós no [aba Traces](../tabs/traces-tab.md). Correlacione a execução de workflows com picos de CPU, memória e conexões de base de dados do host/pod.

**Mitigação**

1. Para uma tempestade de produtores externos, regule o consumidor webhook ou API no ingress ou gateway de API antes de alterar configurações de workflows.
2. Um administrador de instância com acesso ao workflow pode pausar os seus triggers automáticos através do endpoint suportado:
```bash
   HEYM_WORKFLOW_ID='<workflow-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --output /dev/null --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/pause-triggers"
   ```

   Pausar triggers automáticos não para trabalhos já em execução ou em fila. Impede futuras invocações por agendamento, webhook e polling.

3. Para uma instalação em cluster, configure a capacidade de workers em **Configurações > Instâncias** ou desvie tráfego ajustando os pesos dos workers.
4. Se uma execução ativa identificada tiver de parar, solicite o cancelamento através do seu ID de execução exato:
```bash
   HEYM_EXECUTION_ID='<execution-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/executions/$HEYM_EXECUTION_ID/cancel"
   ```

   Confirme o estado final no histórico e a remoção do registro. `cancel_requested` é assíncrono: nós cooperativos param em limites de passos, enquanto chamadas HTTP ou LLM prolongadas terminam o seu pedido atual antes de terminar.

**Verificação:** A frequência de execução desce, a CPU e a memória dos workers regressam à linha de base, a contagem de conexões à base de dados estabiliza e os workflows de prioridade normal são retomados conforme agendado.

**Escalação:** Proprietário do workflow para inspecionar a lógica ou reduzir a frequência de agendamento; plantão da plataforma se o cancelamento não conseguir terminar a execução.

## Acumulação na fila ou execuções aparentemente bloqueadas

**Gravidade:** P2 quando a latência da fila excede limites operacionais; P1 quando o crescimento da fila ameaça limites de armazenamento ou de conexões à base de dados.

**Diagnóstico**

Execute um snapshot das linhas inacabadas da fila. O filtro de estado inclui trabalho inacabado mais antigo, não apenas novas chegadas.
```sql
SELECT status, placement, target_instance_id, count(*) AS runs,
       min(enqueued_at) AS oldest_enqueued_at,
       max(now() - enqueued_at) AS oldest_age
FROM workflow_run_queue
WHERE status IN ('held', 'queued', 'waiting_for_main', 'claimed')
GROUP BY status, placement, target_instance_id
ORDER BY oldest_enqueued_at;

SELECT q.execution_id, q.workflow_id, w.name, q.status, q.placement,
       q.target_instance_id, q.enqueued_at, q.not_after, q.expires_at,
       q.claimed_at, a.heartbeat_at, a.cancel_requested_at
FROM workflow_run_queue q
JOIN workflows w ON w.id = q.workflow_id
LEFT JOIN active_workflow_executions a ON a.execution_id = q.execution_id
WHERE q.status IN ('held', 'queued', 'waiting_for_main', 'claimed')
ORDER BY q.enqueued_at
LIMIT 50;
```

| Estado | Interpretação | Ação |
| --- | --- | --- |
| `held` | A aguardar o slot de simultaneidade de produção do workflow | Inspecione o limite de simultaneidade desse workflow nas suas configurações |
| `pending` | A aguardar atribuição a um worker | Verifique a elegibilidade e contagem de instâncias ativas abaixo |
| `running` | Atribuído a um worker, execução ativa | Verifique o heartbeat do worker e a integridade das threads |
| `waiting_hitl` | Pausado para aprovação humana | Estado esperado; confirme com o proprietário do workflow |
| `cancel_requested` | Cancelamento confirmado, a aguardar limite de passo | Monitorize a conclusão; escale se bloquear |

Verifique a existência de execuções obsoletas ou órfãs cujo worker atribuído tenha deixado de emitir heartbeats:

1. Em instalações com uma única instância, confirme se o serviço main dispõe de capacidade restante de simultaneidade.
2. Abra **Configurações > Instâncias** como administrador de instância, ou execute o pedido:
```bash
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/api/admin/cluster"
   ```

3. Verifique `cluster_enabled`, `live`, `compatible`, `enabled`, `weight`, `credentials_synced`, idade do heartbeat, latência de BD e disponibilidade de sandbox (`docker_ok`). Uma instância necessita tanto de elegibilidade como de liveness para receber tarefas distribuídas. O nome histórico `docker_ok` também cobre a acessibilidade da sandbox no Kubernetes.
```sql
SELECT id, name, role, enabled, weight, weight_configured,
       version, schema_revision, docker_ok, db_latency_ms,
       now() - heartbeat_at AS heartbeat_age,
       now() - credentials_synced_at AS credential_sync_age
FROM cluster_instances
ORDER BY role, id;

SELECT executed_by_instance_id, status, count(*) AS recorded_runs
FROM execution_history
WHERE started_at >= now() - interval '1 hour'
GROUP BY executed_by_instance_id, status
ORDER BY executed_by_instance_id, status;
```

A vista SQL de heartbeats é uma prova, não um cálculo completo de compatibilidade. Utilize a API administrativa para a lógica de compatibilidade e rotação de chaves. Os heartbeats são executados a cada 10 segundos; uma idade de heartbeat superior a 30 segundos indica partição de rede ou processos worker bloqueados.

**Mitigação**

1. Se os workers estiverem saudáveis mas saturados, dimensione as réplicas de workers ou adicione instâncias seguindo [Dimensionamento de cluster](#verificações-do-modo-cluster).
2. Para uma execução órfã num worker inativo, acione a recuperação ou cancele a execução utilizando [Recuperação de execução](#reinício-controlado-do-serviço).
3. Se existirem execuções pendentes a aguardar num worker desativado ou incompatível, reative o worker ou atualize as suas credenciais em **Configurações > Instâncias**.
4. Se a fila for inundada com pedidos duplicados de uma tempestade externa de repetições, pause o trigger no ingress ou utilize [Pausar workflow](#workflows-que-mais-consomem-recursos).

**Verificação:** O comprimento da fila apresenta tendência de descida, as execuções pendentes passam para running dentro da latência esperada e os heartbeats mostram capacidade ativa de workers.

**Escalação:** Plantão da plataforma para bloqueios de despacho do agendador; plantão de base de dados se as consultas de polling da fila apresentarem contenção de bloqueios.

## Verificações do modo cluster

**Gravidade:** P2 para worker offline ou capacidade degradada; P1 se a coordenação do cluster falhar totalmente.

**Diagnóstico**

A vista SQL de heartbeats fornece uma visão geral de todas as instâncias.

Campos-chave:

- `compatible`: Deve ser `true`. Um worker incompatível é excluído da atribuição.
- `heartbeat_age_seconds`: Valores superiores a 30 segundos indicam possíveis partições de rede ou processos worker bloqueados.
- `weight`: Capacidade relativa do worker. Um peso de 0 desativa a atribuição a essa instância.
- `credentials_complete`: Deve ser `true` para workflows que exijam credenciais partilhadas.

**Mitigação**

1. Para um worker offline, verifique o estado do pod/contêiner e os registros no host worker. Siga [Reinício do serviço](#reinício-controlado-do-serviço).
2. Para um worker incompatível, verifique versões de imagens em todas as instâncias do cluster. Todas as instâncias devem executar a mesma versão. Siga [Implementação incorreta](#implementação-incorreta-ou-regressão-de-configuração).
3. Em caso de credenciais em falta, atualize as credenciais partilhadas a partir da instância main em **Configurações > Credenciais**.
4. Para drenar um worker de forma limpa para manutenção, defina o seu peso para 0 ou desative **On** em **Configurações > Instâncias**. Permita que o trabalho em curso termine antes de parar.

**Verificação:** O heartbeat do worker é retomado em menos de 30 segundos, `compatible` é `true` e o workflow de teste é enviado para o worker recuperado.

**Escalação:** Plantão da plataforma para partições de rede entre instâncias ou contenção de bloqueios na base de dados partilhada.

## Instância main indisponível enquanto os workers estão ativos

**Gravidade:** P1. A main coordena o agendamento, disponibiliza a UI/API e gere o estado do cluster.

**Diagnóstico**

1. Confirme o estado do processo main e a utilização de recursos através de [Configuração de comandos](#configuração-de-comandos).
2. Verifique a conectividade à base de dados a partir do host da main. Os workers podem continuar a processar execuções em cache localmente enquanto a main estiver inacessível.
3. Verifique o encaminhamento do reverse proxy / ingress para a instância main.

**Mitigação**

1. Se a main falhou devido a OOM ou exceção não tratada, reinicie a main seguindo [Reinício controlado do serviço](#reinício-controlado-do-serviço).
2. Se a main estiver a aguardar um bloqueio de base de dados detido por um worker inativo, siga [Conexões e bloqueios](#conexões-de-bd-ativas-saturação-do-pool-e-bloqueios).
3. No Kubernetes, verifique se a estratégia `Recreate` concluiu a terminação do pod antes de agendar o substituto.

**Verificação:** A UI pública carrega, o endpoint de integridade da API responde com HTTP 200, os heartbeats dos workers do cluster voltam a reportar à main e o canvas do editor funciona corretamente.

**Escalação:** Incident Commander imediatamente; plantão da plataforma para falhas de armazenamento ou de nós.

## Falhas de webhook, MCP, Portal ou streaming

**Gravidade:** P2 para degradação específica de endpoint; P1 se os webhooks públicos falharem silenciosamente em todos os workflows.

**Diagnóstico**

1. Para falhas de webhook, verifique o encaminhamento de ingress, terminação SSL e configuração do prefixo de caminho. Confirme que o endpoint de webhook existe e está ativo.
2. Para falhas de streaming SSE, verifique as configurações de buffer do proxy. Os proxies de ingress (nginx, traefik, envoy) devem desativar o buffer de resposta (`X-Accel-Buffering: no` ou equivalente) para `/api/chat/stream` e streaming de execução de workflows.
3. Para falhas MCP, verifique a validade da chave de API MCP, configuração de transporte (SSE vs stdio) e registro de ferramentas em **Configurações > MCP**.
4. Inspecione os registros de erros na main quanto a falhas de autorização, payloads JSON inválidos ou recusas de validação de esquema.

**Mitigação**

1. Desative o buffer do proxy em caminhos de streaming ao nível de ingress ou reverse proxy.
2. Em caso de recusa de payload de webhook, verifique a estrutura JSON em relação à especificação do trigger do workflow. Atualize o emissor externo se os payloads estiverem malformados.
3. Em caso de quebras de conexão MCP, reinicie a sessão do cliente MCP afetado ou autentique-se novamente com um novo token.

**Verificação:** O webhook de teste responde com HTTP 200/202, o stream SSE entrega blocos incrementais sem bloqueios e o cliente MCP lista ferramentas com êxito.

**Escalação:** Plantão de rede para problemas de ingress/buffer; autor do workflow para discrepâncias no esquema de payloads.

## Problemas de contêiner, pod, OOM ou armazenamento

**Gravidade:** P1 se a main ou a base de dados forem afetadas; P2 para reinícios isolados de workers.

**Diagnóstico**
```bash
# Compose container state and host filesystem pressure.
heym_compose ps
docker stats --no-stream
df -h
df -i
```

Verifique o sistema de arquivos real do volume de dados e o host da base de dados, além do host shell. Estado do contêiner de apenas leitura sem valores de ambiente:
```bash
HEYM_CONTAINER_ID='<affected-container-id>'
docker inspect --format \
  '{{.Name}} status={{.State.Status}} oom={{.State.OOMKilled}} exit={{.State.ExitCode}} restarts={{.RestartCount}}' \
  "$HEYM_CONTAINER_ID"
```

```bash
HEYM_POD='<affected-pod>'
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" describe pod "$HEYM_POD"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs "$HEYM_POD" \
  --all-containers=true --previous --tail=150
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" top pods --containers
```

Inspecione OOMKilled em relação a sondas falhadas, obtenção de imagem, agendamento Pending, pressão no nó e erros de montagem/anexação de volume. Registos anteriores existem apenas quando o pod reiniciou sem ser reagendado.

## Implementação incorreta ou regressão de configuração

**Gravidade:** P1 se as conexões de produção, processamento de tarefas ou migrações falharem; P2 para regressões de funcionalidades isoladas.

**Diagnóstico:** Compare o início do erro com o rollout, os digests reais da imagem, a revisão de configuração/segredos, o estado das migrações e a última alteração confirmada. Inspecione o histórico de implementação e diffs saneados. Nunca cole variáveis de ambiente completas, segredos renderizados do Compose ou dados Secret do Kubernetes num relatório de incidentes.
```sql
SELECT version_num FROM alembic_version;
```

```bash
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout history \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
```

**Mitigação**

1. Interrompa o rollout e isole o tráfego externo se os erros ameaçarem a integridade dos dados ou se propagarem para dependências.
2. Verifique o último digest de imagem, commit de Git e revisão de Helm/manifesto reconhecidos como funcionais. Inspecione diffs recentes de ConfigMap, Secret e ambiente.
3. Se o esquema for compatível, restaure a imagem/configuração aprovada através das ferramentas de implementação. Reverta para uma revisão específica testada, não para uma presumida anterior:
```bash
   HEYM_ROLLBACK_REVISION='<approved-revision-number>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout undo \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --to-revision="$HEYM_ROLLBACK_REVISION"
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
   ```

4. A reversão de um Deployment restaura o modelo do pod; não restaura valores externos de Secret ou ConfigMap caso tenham sido sobrescritos. Reverta alterações de configuração em paralelo.
5. Nunca desclassifique uma imagem de release através de uma migração de esquema de base de dados incompatível. Se uma migração efetuou alterações irreversíveis a tabelas ou colunas, corrija para a frente com um patch testado ou restaure a base de dados através de [Recuperação de desastres](#recuperação-de-desastres-e-resposta-a-emergências).
6. Após a reversão, reinicie os workers dependentes para assegurar que toda a frota executa a mesma versão de release.

**Verificação:** As verificações de integridade respondem com 200, os workers reportam a mesma versão de release em **Configurações > Instâncias**, a versão de migração do esquema corresponde à release pretendida e o workflow smoke tem êxito.

**Escalação:** Incident Lead e engenheiro de release imediatamente para P1. Envolva o administrador da base de dados se for necessária limpeza de migrações ou restauração de esquema.

## Falha de modelo, credencial ou integração

**Gravidade:** P2 em caso de falha de fornecedor específico ou limites de taxa; P1 se nenhum modelo configurado responder para os workflows.

**Diagnóstico**

1. Distinga entre falha do lado do fornecedor, expiração/revogação de credenciais, limite de taxa (HTTP 429) e tempos limites de rede.
2. Verifique as páginas de estado dos fornecedores (OpenAI, Anthropic, Google AI, etc.).
3. Teste a validade das credenciais em **Configurações > Credenciais** utilizando o botão de teste integrado.
4. Consulte os registros da aplicação para classificar o erro: `RateLimitError`, `AuthenticationError`, `InvalidRequestError` ou `APIConnectionError`.

**Mitigação**

1. Para limites de taxa (429), alterne os nós de workflow para uma credencial de reserva ou modelo de fornecedor com quota disponível.
2. Para credenciais expiradas, rode a chave em **Configurações > Credenciais**. O Heym atualiza credenciais partilhadas em todos os workers do cluster.
3. Para falhas em fornecedores a montante, pause temporariamente workflows afetados ou configure encaminhamento alternativo de modelos.

**Verificação:** O teste de credenciais é bem-sucedido na UI, a execução do agente termina sem erros HTTP 4xx/5xx e os atrasos de repetição por limite de taxa dissipam-se.

**Escalação:** Proprietário das credenciais / líder de equipe para faturação ou regeneração de chaves; suporte do fornecedor externo para falhas generalizadas.

## Falha de sandbox

**Gravidade:** P2 para falhas isoladas de nós de código; P1 se a execução em sandbox for necessária para workflows críticos.

**Diagnóstico**

1. Identifique o modo de execução da sandbox: processo local, contêiner Docker ou pod sandbox de Kubernetes.
2. Verifique a capacidade de resposta do daemon do Docker no host de sandbox ou o agendamento de pods sandbox de Kubernetes.
3. Kubernetes: inspecione pods de sandbox no namespace de sandbox configurado, os seus eventos e NetworkPolicies. As sandboxes podem utilizar um namespace separado:
```bash
   HEYM_SANDBOX_NAMESPACE='<actual-sandbox-namespace>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_SANDBOX_NAMESPACE" get pods \
     -l app.kubernetes.io/managed-by=heym -L heym.run/sandbox,heym.run/instance
   ```

4. Verifique o `HEYM_SANDBOX_BACKEND` configurado e as configurações específicas do tipo de sandbox nas variáveis de ambiente.
5. Se os contêineres Docker falharem, assegure-se de que o socket do Docker está montado e que o utilizador do Heym possui permissões para interagir com o daemon.
6. Em sandboxes Kubernetes, certifique-se de que a ServiceAccount possui permissões para criar e gerir pods no namespace da sandbox.

**Verificação:** O nó de código é executado com êxito na sandbox isolada, devolve as saídas esperadas e os recursos da sandbox são limpos após a execução.

**Escalação:** Plantão da plataforma para problemas do daemon Docker ao nível do host ou falhas na infraestrutura de sandbox do Kubernetes.

## Recuperação de desastres e resposta a emergências

**Gravidade:** P1 para perda catastrófica de dados, falha do host ou destruição total do ambiente.

**Procedimento**

1. Declare o incidente de emergência e designe um Incident Commander. Notifique as partes interessadas através dos canais de emergência estabelecidos.
2. Aísle o ambiente danificado para prevenir perdas adicionais de dados ou escritas contraditórias. Evite que instalações antigas e novas processem em simultâneo a mesma carga de trabalho.
3. Restaure o PostgreSQL através do procedimento testado de cópia de segurança/PITR no ambiente de recuperação pretendido. Restaure os dados correspondentes de arquivos/plugins/espaço de trabalho de código da instância main, juntamente com o porta-chaves de encriptação e segredo de assinatura a partir de cópia de segurança segura. Uma cópia apenas de base de dados não contém os bytes de arquivos.
4. Inicie uma única instância main pretendida utilizando uma release compatível com o esquema restaurado. Inspecione migrações antes do arranque, uma vez que o ponto de entrada da main as executa. Os workers não devem entrar em conflito com as migrações.
5. Mantenha o ingress de produção e os produtores isolados durante as verificações. Uma instância main iniciada pode eleger um líder e executar agendamentos/recuperações restaurados; utilize as restrições de rede documentadas e controlos de trigger/recuperação de workflows antes do arranque. Restaurar dados não é uma pré-visualização passiva.
6. Reconcilie registros ativos/em fila/pendentes e qualquer repetição automática com os proprietários. A recuperação reinicia execuções elegíveis desde o início e não pode anular efeitos a jusante. Não reproduza todas as linhas que falharam ou foram ignoradas.
7. Valide leituras/escritas de BD, início de sessão, desencriptação de credenciais, arquivos do Drive, plugins, acesso ao espaço de trabalho de agentes de código e workflows smoke aprovados (apenas main e distribuíveis). Adicione gradualmente workers compatíveis e, em seguida, reabra a admissão e o ingress.
8. Registe o intervalo real de perda de dados, a duração da recuperação, o trabalho ignorado e a reconciliação pendente. Agende outro teste de recuperação se este procedimento tiver revelado alguma falha.

**Verificação:** A barreira de verificação partilhada é aprovada, as calendarizações críticas são retomadas, os proprietários aceitam a reconciliação e a monitorização de cópias de segurança/restauração é restabelecida. Uma instalação vazia e saudável não é uma recuperação.

**Escalação:** Incident Lead em conjunto com responsáveis de base de dados, armazenamento e plataforma permanentemente. Não improvise reparações destrutivas de diretórios de dados nem ativações em duplo local.

## Modelo de provas e transmissão
```text
Incident / severity / environment:
Impact and first observed time (UTC):
Main / worker / database / deployment identifiers:
Last release or configuration change:
Affected workflow IDs and execution IDs:
Public health / direct health / DB check:
Connection totals, blocker PIDs, queue depth and oldest age:
Instance eligibility, leader evidence, CPU / memory / disk:
Action taken, timestamp, operator, expected effect:
Verification result and observation window:
Temporary restrictions, reversal owner, expiry:
Skipped / failed / recovered work requiring reconciliation:
Next action, owner, next update time:
```

Capture registros e IDs delimitados; remova valores de credenciais, cabeçalhos de autenticação, hiperligações de capacidade, payloads de utilizador e dados de parâmetros SQL antes de anexar provas. Os eventos de auditoria do router encontram-se em stdout da main. O histórico de execuções regista a instância executora; as falhas de execução podem, por isso, exigir registros tanto dos workers como da main.

## Referências de implementação

Estes caminhos identificam a implementação verificada durante a redação deste runbook. Revalide-os sempre que o comportamento de execução, implementação ou esquema mudar.

| Assunto | Origem |
| --- | --- |
| Serviços de integridade e arranque | [main.py](https://github.com/heymrun/heym/blob/main/backend/app/main.py) |
| Configurações de pool e etiquetas de conexão | [config.py](https://github.com/heymrun/heym/blob/main/backend/app/config.py), [session.py](https://github.com/heymrun/heym/blob/main/backend/app/db/session.py) |
| Contagem de processos e migrações | [Ponto de entrada do backend](https://github.com/heymrun/heym/blob/main/backend/entrypoint.sh), [Ponto de entrada de release](https://github.com/heymrun/heym/blob/main/docker/release-entrypoint.sh) |
| Topologia de implementação e mapeamentos reais do ambiente | [Compose](https://github.com/heymrun/heym/blob/main/docker-compose.yml), [Exemplo de cluster](https://github.com/heymrun/heym/blob/main/docker-compose.cluster.yml), [Exemplo de worker](https://github.com/heymrun/heym/blob/main/docker-compose.worker.yml), [Kubernetes](../getting-started/kubernetes.md) |
| Elegibilidade e liveness do registro | [registry.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/registry.py), [API de cluster](https://github.com/heymrun/heym/blob/main/backend/app/api/admin_cluster.py) |
| Posicionamento, estados da fila e despacho | [node_placement.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/node_placement.py), [run_queue.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/run_queue.py), [dispatch.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/dispatch.py) |
| Liderança e manutenção | [distributed_lock.py](https://github.com/heymrun/heym/blob/main/backend/app/services/distributed_lock.py), [cron_scheduler.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cron_scheduler.py) |
| Recuperação e cancelamento | [execution_recovery.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_recovery.py), [execution_cancellation.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_cancellation.py) |
| Endpoints de pausa/retoma/cancelamento de workflows | [workflows.py](https://github.com/heymrun/heym/blob/main/backend/app/api/workflows.py), [workflow_lifecycle.py](https://github.com/heymrun/heym/blob/main/backend/app/services/workflow_lifecycle.py) |
| Configurações de tabelas e colunas de diagnóstico | [models.py](https://github.com/heymrun/heym/blob/main/backend/app/db/models.py) |
| Interpretação de capacidade e custos | [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md), [Alerts](../tabs/alerts-tab.md) |
