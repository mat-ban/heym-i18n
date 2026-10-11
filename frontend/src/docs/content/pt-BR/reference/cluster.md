# Distribuição de Carga

Aponte uma segunda instância do Heym para o mesmo banco de dados PostgreSQL e ela se junta como worker. As execuções de workflow em segundo plano passam então a ser compartilhadas entre as instâncias conforme uma porcentagem que você define, de modo que a máquina que serve a UI e a API não seja também a única máquina executando todos os workflows.

As instâncias nunca conversam entre si. O Postgres carrega o trabalho, portanto um worker não precisa de porta aberta, certificado nem rota de volta para a instância principal — apenas acesso ao banco de dados.

## Papéis

Uma instância é **main**, fixada por uma variável de ambiente. Ela serve a UI, a API, o MCP e o portal de chat, além de ser responsável pelo armazenamento de arquivos e pelos plugins instalados. Todas as outras instâncias são **workers**: elas acessam apenas o banco de dados e executam execuções em segundo plano.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

O papel main é separado da eleição de líder. O Heym já elege um líder em todo o cluster para ser responsável pelo cron, pela avaliação de alertas e pela recuperação de falhas; se o main cair, a liderança passa para um worker em poucos segundos e as execuções agendadas continuam disparando. O papel main não se move, porque o armazenamento de arquivos não pode se mover com ele.

## O que pode sair da instância main

A alocação é decidida a partir dos nós do workflow antes do início da execução. Uma execução permanece no main quando qualquer nó nela — incluindo nós dentro de sub-workflows que ela chama — toca em algo que existe em apenas uma máquina:

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

## Escolhendo porcentagens

Os pesos são inteiros definidos em **Settings → Instances**. Eles são **frações de quaisquer instâncias que atualmente podem assumir trabalho**, não porcentagens de 100: o agendador divide pelo total do próprio pool.

Essa distinção aparece assim que uma instância sai. Com `Main 41, Worker A 26, Worker B 33`, desligar o Worker B deixa um pool de 67, então o Main realmente recebe 41/67 = **61%** e o Worker A 26/67 = **39%**. O painel exibe a divisão efetiva abaixo da tabela exatamente por esse motivo, e salvar nunca é bloqueado porque os números não somam 100 — apenas uma divisão em que nenhuma instância habilitada tenha um peso é recusada.

Mais duas coisas são fáceis de errar.

**Uma porcentagem não é uma fração do poder da máquina.** Ela cobre apenas execuções que passam pela fila. Servir a UI e a API, transmitir execuções do editor e do portal e lidar com uploads de arquivos são todo trabalho do main e nada disso é contabilizado. O main está fazendo mais do que seu número indica.

**A porcentagem do main é um teto, não um piso.** Execuções que só podem ser executadas no main são debitadas de sua cota, portanto, uma vez esgotada essa cota, as execuções distribuíveis restantes recaem sobre os workers. Definir o número do main baixo é seguro — o trabalho que precisa ser executado lá ainda será. Defini-lo alto deixa os workers famintos.

Assim, com um main forte e um worker menor, comece mais próximo de 60/40 do que da proporção bruta das máquinas, depois compare as durações reais das execuções na aba Traces e ajuste.

Os pesos são renormalizados entre as instâncias que estão atualmente ativas e habilitadas. Com `main=70, A=15, B=15`, se A ficar offline a divisão passa a ser 70/85 e 15/85 entre main e B, e retorna a 70/15/15 quando A voltar.

**Uma instância que retorna não tem direito às execuções que perdeu.** O tempo gasto Offline, Disabled ou em uma versão incompatível não é contabilizado contra ela, portanto um worker que passa uma noite indisponível reingressa na posição atual do pool e a divisão volta a indicar 70/30 a partir de sua primeira execução — ele não absorve todas as execuções até ter se recuperado. Um worker que esteve disponível o tempo todo ainda se recupera, e é isso que faz da porcentagem do main um teto.

### Uma nova instância entra com zero

Uma instância que nunca recebeu um peso começa em 0, o que a deixaria Live, Enabled e não recebendo nada. **Give new instances a share automatically** — ativado por padrão, abaixo da tabela de instâncias — corrige isso: na próxima passagem do líder, a recém-chegada recebe uma fração igual do pool, e os pesos existentes são reduzidos proporcionalmente, mantendo suas proporções entre si, de modo que um 70/30 deliberado ainda apareça como aproximadamente 70/30 depois. O total permanece exatamente 100.

Isso é executado **uma vez por instância**. Tanto a passagem automática quanto sua própria edição marcam a instância como configurada, portanto uma instância que você mesmo definiu nunca é alterada pelas suas costas — incluindo uma que você deliberadamente definiu como 0. Desative a configuração se preferir que toda nova máquina aguarde por você.

Apenas instâncias habilitadas, ativas e compatíveis participam. Conceder uma fração a uma máquina que não pode executar nada deixaria essa fração ociosa.
### Quando as porcentagens não ajudam

O painel de configurações informa quantas das execuções das últimas 24 horas só puderam ser executadas na main. Se esse número for alto — uma carga de trabalho pesada em Codex ou Drive — os workers ficarão ociosos independentemente do que os pesos digam, e a solução é uma instância main maior, e não mais instâncias.

## Dimensionando o PostgreSQL para um cluster

As conexões escalam com as instâncias, não apenas com os usuários. Cada instância executa vários processos uvicorn, e cada processo mantém um pool de conexões mais quatro conexões `LISTEN` (cancelamento, despertar da fila, resultados de execução, streams de chat). Streams de chat abertos compartilham a única conexão de chat, portanto não adicionam conexões ao banco de dados. Um cluster de três instâncias com o padrão `max_connections = 100` esgota o limite, e o Heym passa a não conseguir alcançar seu próprio banco de dados.

Dimensione aproximadamente `instances x processes x (async pool + sync pool + 4)` e defina `max_connections` acima desse valor.

Reduza os pools em vez de apenas elevar o teto. Uma implantação única usa por padrão 10+20 conexões async e 5+10 sync por processo, o que é generoso para uma única máquina e excessivo para um cluster:

| Variável | Instância única | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

O arquivo compose de exemplo define esses valores e `max_connections = 300`. Isso reduz o teto de um cluster de duas instâncias de 768 conexões para 192, com três instâncias ainda abaixo de 300.

## Requisitos que o cluster não pode impor por você

**Toda instância deve usar o mesmo `SECRET_KEY` e `ENCRYPTION_KEY`.** Um worker com um `ENCRYPTION_KEY` diferente não consegue descriptografar credenciais, e toda execução que use credenciais falharia com um erro que não nomeia nada útil. O Heym compara um digest de ambas as chaves a cada heartbeat, juntamente com a versão do app e a revisão do banco de dados, e marca uma instância incompatível como **Mismatch** para que ela não receba trabalho algum. A carga retorna para a main até que você corrija isso.

Isso também define a ordem de atualização. Atualizar a main primeiro marca todos os workers como incompatíveis; o trabalho retorna para a main, e cada worker se reintegra à medida que é atualizado. Mais lento, visível e reversível.

**Direcione o ingress apenas para a instância main.** Distribuir o tráfego do usuário em round-robin entre as instâncias enviaria um upload de arquivo para uma máquina e seu download para outra. Nada no código impede isso, porque um worker executa a mesma imagem e responderá a qualquer requisição que receber.

**Toda instância precisa de `FRONTEND_URL`, definido com o mesmo endereço público.** Uma execução que pausa para revisão humana gera seu link de revisão na instância que a executou, não na main, e o mesmo vale para links de acompanhamento do Codex e para as URLs de download de arquivos gerados. Um worker sem essa variável constrói esses links apontando para seu próprio endereço local, e quem receber um deles não conseguirá abri-lo.

**Instâncias worker têm um IP de saída diferente.** Qualquer API que permita endereços de origem por allowlist verá o novo IP. O Send Email é executado na main exatamente por esse motivo; para o nó HTTP, ou forneça ao cluster um único endereço de saída NAT, ou inclua todas as instâncias na allowlist.

## Adicionando um worker em outra máquina

O `docker-compose.worker.yml` na raiz do repositório executa um worker em seu próprio host. Ele não tem banco de dados nem UI: ele alcança o PostgreSQL da instância main e assume sua parcela das execuções em segundo plano.

Preencha um `.env` ao lado dele — tag da imagem, host e credenciais do banco de dados, ambas as chaves e um id de instância — e inicie-o. O Compose se recusa a iniciar até que todos os valores obrigatórios estejam definidos, em vez de subir com um placeholder que falha depois de uma forma difícil de interpretar.

A tag da imagem deve ser a versão que a main executa, e ambas as chaves devem ser copiadas exatamente. Uma diferença em qualquer uma delas faz o worker aparecer como Mismatch e ele não recebe trabalho algum.

## Lendo a tabela de Instances

| Coluna | Significado |
|---|---|
| Name | Rótulo editável; ele é gravado em toda execução que esta instância executa |
| Role | `main` ou `worker`, conforme o ambiente |
| Status | **Live** com um heartbeat recente, **Offline** após 30 segundos de silêncio, **Mismatch** quando a versão, a revisão do banco de dados ou as chaves diferem das da main |
| ms | Ida e volta dessa instância até o banco de dados, medida pela própria instância |
| On | Retira um worker da rotação sem pará-lo — execuções em andamento terminam, nenhuma nova é atribuída. Bloqueado como ativado para a instância main: trabalho de arquivo, plugin e agente de codificação é executado nela independentemente do que o toggle diga |
| Weight | Sua parcela das execuções distribuíveis |

## Histórico de execuções

Toda execução no histórico de execuções nomeia a instância que a executou, e ambos os diálogos de histórico podem filtrar por uma única instância. O filtro corresponde ao id da instância enquanto exibe seu nome, portanto renomear uma instância não reescreve o que execuções antigas exibem.

Nada disso aparece em uma instalação de instância única: os campos ficam vazios, nenhum rótulo é exibido e nenhum filtro é oferecido.
## Comportamento em caso de falha

**Se um worker morrer durante a execução**, seu heartbeat fica desatualizado e a varredura de recuperação existente do leader reexecuta a execução em uma instância ativa. A linha da fila que ele havia reivindicado é encerrada separadamente: assim que não existir mais nenhuma execução ativa para ela e tiver transcorrido um período de carência de dois minutos, o leader marca a linha como falha e desperta quem estiver aguardando o resultado. A idade por si só nunca é o gatilho, portanto uma execução legitimamente longa é deixada em paz; e a linha é marcada como falha em vez de recolocada na fila, porque a recuperação já é responsável pela reexecução e recolocá-la na fila executaria o mesmo workflow duas vezes.

**Se o main ficar indisponível**, o cron continua disparando a partir de um worker e as execuções distribuíveis continuam sendo executadas. As execuções que precisam do main entram na fila e aguardam, sendo drenadas quando ele retornar — mas apenas dentro da janela de carência de misfire (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, 600 segundos por padrão). Qualquer coisa mais antiga é encerrada como ignorada, com o motivo registrado, em vez de reproduzir horas de backlog de uma só vez.

A UI, a API, o MCP e o editor ficam indisponíveis enquanto o main estiver fora do ar, porque o ingress aponta para lá.

## Relacionados

- [Execução e Implantação](../getting-started/running-and-deployment.md) – Implante uma única instância primeiro; as variáveis de ambiente e a configuração de chaves estão lá
- [Configurações](./user-settings.md) – A aba Instances e quem pode visualizá-la
- [Traces](../tabs/traces-tab.md) – Compare durações reais de execução entre instâncias antes de alterar a divisão
- [Segurança](./security.md) – Por que toda instância deve compartilhar `SECRET_KEY` e `ENCRYPTION_KEY`
