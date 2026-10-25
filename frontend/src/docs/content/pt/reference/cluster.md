# Distribuição de Carga

Aponte uma segunda instância do Heym para o mesmo banco de dados PostgreSQL e ela se junta como worker. As execuções de workflow em segundo plano passam então a ser compartilhadas entre as instâncias por uma porcentagem que você define, de modo que a máquina que serve a UI e a API não seja também a única máquina a executar todos os workflows.

As instâncias nunca se comunicam entre si. O Postgres transporta o trabalho, portanto um worker não precisa de porta aberta, certificado nem rota de retorno à instância principal — apenas de acesso ao banco de dados.

## Papéis

Uma instância é **main**, fixada por uma variável de ambiente. Ela serve a UI, a API, o MCP e o portal de chat, além de ser responsável pelo armazenamento de arquivos e pelos plugins instalados. Todas as demais instâncias são **workers**: alcançam apenas o banco de dados e executam execuções em segundo plano.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

O papel main é separado da eleição de líder. O Heym já elege um líder em todo o cluster para ser responsável pelo cron, pela avaliação de alertas e pela recuperação de falhas; se o main cair, a liderança passa para um worker em poucos segundos e as execuções agendadas continuam disparando. O papel main não se move, porque o armazenamento de arquivos não pode se mover com ele.

## O que pode sair da instância main

A alocação é decidida a partir dos nós do workflow antes do início da execução. Uma execução permanece no main quando qualquer nó nela — incluindo nós dentro de sub-workflows que ela chama — toca algo que existe em apenas uma máquina:

| Nó | Por que permanece no main |
|---|---|
| Codex, OpenCode Go | O workspace do agente de codificação permanece no disco local para que um follow-up possa retomá-lo |
| Agent com uma skill anexada | O código da skill lê e grava no Heym Drive |
| Drive, Converter, Google Drive | Eles leem e gravam arquivos gerados |
| Trigger File Upload | O upload chega ao disco do main |
| Send Email | Relays SMTP corporativos comumente permitem apenas um endereço de origem |
| Nós de plugin | Um plugin é instalado no disco de uma instância |

**Todo o restante é distribuído** — incluindo o nó Code, o Playwright e as ferramentas Python do Agent. Todas as instâncias executam a mesma imagem com seu próprio socket Docker, portanto um sandbox não é motivo para manter uma execução no main, e esses são os nós que mais consomem CPU no produto.

Um workflow cujo sub-workflow é escolhido por uma expressão não pode ser inspecionado antecipadamente, então ele permanece no main.

## Escolha das porcentagens

Os pesos são números inteiros definidos em **Settings → Instances**. Eles são **frações das instâncias que podem atualmente assumir trabalho**, não porcentagens de 100: o agendador divide pelo total do próprio pool.

Essa distinção fica evidente assim que uma instância sai. Com `Main 41, Worker A 26, Worker B 33`, desligar o Worker B deixa um pool de 67, então o Main recebe na prática 41/67 = **61%** e o Worker A 26/67 = **39%**. O painel exibe a divisão efetiva abaixo da tabela exatamente por esse motivo, e salvar nunca é bloqueado porque os números não somam 100 — apenas uma divisão em que nenhuma instância habilitada tenha peso é recusada.

Mais dois pontos são fáceis de errar.

**Uma porcentagem não é uma fração do poder da máquina.** Ela cobre apenas as execuções que passam pela fila. Servir a UI e a API, transmitir execuções do editor e do portal e lidar com uploads de arquivos são todo trabalho do main e nada disso é contabilizado. O main está fazendo mais do que o seu número indica.

**A porcentagem do main é um teto, não um piso.** As execuções que só podem ser executadas no main são debitadas da sua cota, portanto, uma vez esgotada essa cota, as execuções distribuíveis restantes recaem sobre os workers. Definir um número baixo para o main é seguro — o trabalho que precisa ser executado lá continua sendo. Defini-lo alto deixa os workers famintos.

Assim, com um main forte e um worker menor, comece mais próximo de 60/40 do que da proporção bruta das máquinas, depois compare as durações reais das execuções na aba Traces e ajuste.

Os pesos são renormalizados entre as instâncias que estão atualmente ativas e habilitadas. Com `main=70, A=15, B=15`, se A ficar offline a divisão passa a ser 70/85 e 15/85 entre main e B, e retorna a 70/15/15 quando A voltar.

**Uma instância que retorna não tem direito às execuções que perdeu.** O tempo gasto Offline, Disabled ou em uma versão incompatível não é contabilizado contra ela, portanto um worker que passa uma noite indisponível reingressa na posição atual do pool e a divisão volta a ser 70/30 desde a sua primeira execução — ele não absorve todas as execuções até ter se recuperado. Um worker que esteve disponível o tempo todo ainda se recupera, e é isso que faz da porcentagem do main um teto.
### Uma nova instância entra com zero

Uma instância que nunca recebeu um peso começa em 0, o que a deixaria Live, Enabled e sem receber nada. **Atribuir uma quota automaticamente às novas instâncias** — ativado por predefinição, sob a tabela de instâncias — resolve isso: na passagem seguinte do líder, a recém-chegada recebe uma quota igual do conjunto, e os pesos existentes são reduzidos proporcionalmente, mantendo as proporções entre si, de modo que um 70/30 deliberado continua a ler-se como aproximadamente 70/30 depois. O total mantém-se exatamente em 100.

Isto é executado **uma vez por instância**. Tanto a passagem automática como a sua própria edição marcam a instância como configurada, pelo que uma instância que você definiu manualmente nunca é alterada sem o seu conhecimento — incluindo uma que você tenha definido deliberadamente como 0. Desative a definição se preferir que cada nova máquina aguarde por você.

Apenas participam instâncias ativadas, live e compatíveis. Atribuir uma quota a uma máquina que não consegue executar nada deixaria essa quota retida.

### Quando as percentagens não ajudam

O painel de definições indica quantas das execuções das últimas 24 horas só conseguiram ser executadas em main. Se esse número for elevado — uma carga de trabalho intensiva em Codex ou Drive — os workers ficarão inativos independentemente do que os pesos indicarem, e a resposta é uma instância main maior em vez de mais instâncias.

## Dimensionar o PostgreSQL para um cluster

As ligações escalam com as instâncias, não apenas com os utilizadores. Cada instância executa vários processos uvicorn, e cada processo mantém um pool de ligações mais quatro ligações `LISTEN` (cancelamento, despertar de filas, resultados de execuções, streams de chat). Os streams de chat abertos partilham a única ligação de chat, pelo que não acrescentam ligações à base de dados. Um cluster de três instâncias com o `max_connections = 100` predefinido esgota-se, e o Heym deixa então de conseguir alcançar a sua própria base de dados.

Dimensione aproximadamente `instâncias x processos x (pool assíncrono + pool síncrono + 4)` e defina `max_connections` acima desse valor.

Reduza os pools em vez de apenas aumentar o limite. Uma única implementação usa por predefinição 10+20 ligações assíncronas e 5+10 síncronas por processo, o que é generoso para uma máquina e demasiado para um cluster:

| Variável | Instância única | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

O ficheiro compose de exemplo define esses valores e `max_connections = 300`. Isso reduz um cluster de duas instâncias de um limite de 768 ligações para 192, com três instâncias ainda abaixo de 300.

## Requisitos que o cluster não consegue impor por você

**Todas as instâncias devem usar a mesma `SECRET_KEY` e `ENCRYPTION_KEY`.** Um worker com uma `ENCRYPTION_KEY` diferente não consegue desencriptar credenciais, e todas as execuções que usem credenciais falhariam com um erro que não nomeia nada de útil. O Heym compara um digest de ambas as chaves em cada heartbeat, juntamente com a versão da aplicação e a revisão da base de dados, e marca uma instância em desacordo como **Mismatch**, para que não receba trabalho algum. A carga recai sobre main até que você corrija a situação.

Isso também define a ordem de atualização. Atualizar main primeiro marca todos os workers como incompatíveis; o trabalho regressa a main, e cada worker volta a associar-se à medida que é atualizado. Mais lento, visível e reversível.

**Direcione o ingress apenas para a instância main.** Fazer round-robin do tráfego dos utilizadores entre instâncias enviaria um upload de ficheiro para uma máquina e o respetivo download para outra. Nada no código impede isto, porque um worker executa a mesma imagem e responderá a qualquer pedido que receba.

**Todas as instâncias precisam de `FRONTEND_URL`, definido para o mesmo endereço público.** Uma execução que pausa para revisão humana gera o seu link de revisão na instância que a executou, não em main, e o mesmo se aplica aos links de seguimento do Codex e aos URLs de download dos ficheiros gerados. Um worker sem esta variável constrói esses links com base no seu próprio endereço local, e quem receber um não o conseguirá abrir.

**As instâncias worker têm um IP de saída diferente.** Qualquer API que faça allowlist de endereços de origem vê o novo. O Send Email é executado em main precisamente por este motivo; para o nó HTTP, ou atribua ao cluster um único endereço NAT de saída, ou faça allowlist de todas as instâncias.

## Adicionar um worker noutra máquina

O `docker-compose.worker.yml` na raiz do repositório executa um worker no seu próprio host. Não tem base de dados nem UI: alcança o PostgreSQL da instância main e assume a sua quota das execuções em segundo plano.

Preencha um `.env` ao lado dele — tag da imagem, host e credenciais da base de dados, ambas as chaves e um id de instância — e inicie-o. O Compose recusa iniciar até que todos os valores obrigatórios estejam definidos, em vez de arrancar com um placeholder que falha mais tarde de uma forma difícil de interpretar.

A tag da imagem deve ser a versão que main executa, e ambas as chaves devem ser copiadas exatamente. Uma diferença em qualquer delas mostra o worker como Mismatch e este não recebe trabalho.
## Leitura da tabela de Instâncias

| Coluna | Significado |
|---|---|
| Name | Rótulo editável; é registado em cada execução que esta instância realiza |
| Role | `main` ou `worker`, proveniente do ambiente |
| Status | **Live** com um heartbeat recente, **Offline** após 30 segundos de silêncio, **Mismatch** quando a versão, a revisão da base de dados ou as chaves diferem das da main |
| ms | Round trip dessa instância até à base de dados, medido pela própria instância |
| On | Retira um worker de rotação sem o parar — as execuções em curso terminam, não são atribuídas novas. Bloqueado em on para a instância main: o trabalho de ficheiros, plugins e coding-agent é executado aí independentemente do estado do toggle |
| Weight | A sua quota de execuções distribuíveis |

## Limites de simultaneidade num cluster

O [limite de simultaneidade](./webhooks.md#concurrency-limit-and-queued-runs) de um workflow é contabilizado no PostgreSQL, pelo que se aplica em todas as instâncias e em todos os processos: duas instâncias nunca executam mais execuções de um mesmo workflow do que o limite permite. Uma execução que aguardou por um slot é distribuída de acordo com as mesmas regras de qualquer outra execução ao iniciar, de forma que uma execução que precise de permanecer em main continua a fazê-lo. O worker de fila que executa essas tarefas inicia agora em todas as instalações, incluindo numa instância única, onde apenas reivindica as execuções enfileiradas pela sua própria instância. Isto significa que uma instância única também mantém a ligação `LISTEN` de despertar da fila em cada processo; planeie as suas ligações da mesma forma que para uma instância de cluster.

## Histórico de execuções

Cada execução no histórico de execuções indica a instância que a executou, e ambos os diálogos de histórico podem ser filtrados para uma única instância. O filtro corresponde ao id da instância enquanto apresenta o seu nome, pelo que renomear uma instância não reescreve o que as execuções antigas indicam.

Nada disto aparece numa instalação de instância única: os campos estão vazios, não é apresentado qualquer rótulo e não é oferecido qualquer filtro.

## Comportamento em caso de falha

**Se um worker morrer a meio de uma execução**, o seu heartbeat fica desatualizado e a varredura de recuperação existente do leader volta a executar a execução numa instância ativa. A linha da fila que tinha reclamado é retirada separadamente: assim que não exista nenhuma execução ativa para ela e tenha passado um período de tolerância de dois minutos, o leader marca a linha como falhada e desperta quem estava à espera do resultado. A idade por si só nunca é o trigger, pelo que uma execução legitimamente longa é deixada em paz; e a linha é marcada como falhada em vez de recolocada na fila, porque a recuperação já é responsável pela reexecução e a recolocação executaria o mesmo workflow duas vezes.

**Se a main ficar indisponível**, o cron continua a disparar a partir de um worker e as execuções distribuíveis continuam a ser executadas. As execuções que necessitam da main ficam em fila e aguardam, e são escoadas quando esta regressar — mas apenas dentro da janela de tolerância de misfire (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, 600 segundos por predefinição). Qualquer coisa mais antiga é encerrada como ignorada, com o motivo registado, em vez de reproduzir horas de backlog de uma só vez.

A UI, a API, o MCP e o editor ficam indisponíveis enquanto a main estiver em baixo, porque o ingress aponta para aí.

## Relacionado

- [Execução e Implementação](../getting-started/running-and-deployment.md) – Implemente primeiro uma instância única; as variáveis de ambiente e a configuração de chaves encontram-se aí
- [Configurações](./user-settings.md) – O separador Instâncias, e quem o pode ver
- [Execuções](../tabs/traces-tab.md) – Compare durações reais de execução entre instâncias antes de alterar a divisão
- [Segurança](./security.md) – Por que motivo cada instância deve partilhar `SECRET_KEY` e `ENCRYPTION_KEY`
