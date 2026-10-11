# Separador Alertas

O separador **Alertas** permite definir condições de limiar ao longo de uma janela temporal e ser notificado quando estas são ultrapassadas. O Heym já registra os resultados de execução, a duração das execuções e os gastos com LLM, mas nunca os comunica por iniciativa própria. Um alerta é a forma de o solicitar.

Cada alerta é avaliado ao longo de uma **janela temporal** que escolher, nunca com base num único evento. Uma execução falhada é ruído. Doze execuções falhadas em dez minutos é um incidente.

## Tipos de Alerta

| Tipo | A pergunta a que responde | De onde vem o número |
|---|---|---|
| **Limiar de erros** | Falhou mais de N vezes na janela? | Linhas do [Histórico de execuções](../reference/execution-history.md) com estado de erro |
| **Duração do Workflow** | As execuções tornaram-se mais lentas do que o esperado na janela? | Tempo de execução, agregado como máximo, média ou percentil 95 |
| **Custo em Tokens / USD** | Os gastos ultrapassaram um orçamento na janela? | [Rastreios de LLM](./traces-tab.md) mais a tabela de custos de LLM |
| **Contagem de execuções** | Isto foi executado com muito mais frequência do que devia? | Contagem de linhas do histórico de execuções |

### Limiar de erros

Conta as execuções falhadas ao longo da janela e dispara quando a contagem atinge o limiar definido. Como conta ao longo de uma janela em vez de reagir a cada falha, um erro transitório isolado não o irá notificar.

### Duração do Workflow

Mede a duração das execuções dentro da janela. Escolha **máx** (a execução mais lenta), **média** ou **p95**. O valor p95 utiliza o mesmo cálculo de percentil que o [separador Análises](./analytics-tab.md), pelo que o alerta e o gráfico de latência nunca divergem relativamente à mesma janela.

A opção **Execuções mínimas na janela** mantém isto rigoroso. A execução mais lenta numa janela quase vazia é apenas essa execução, pelo que definir um mínimo de, por exemplo, 3 impede que o alerta dispare com ruído.

### Custo em Tokens / USD

Soma os gastos com LLM ao longo da janela, quer como total de tokens, quer em dólares americanos. Os valores em dólares são resolvidos através da mesma tabela de preços utilizada pelo [separador Rastreios](./traces-tab.md) e pela [Tabela de Custos de LLM](./datatable-tab.md#llm-cost-table-system-table), pelo que um alerta de custo e a página de custos concordam sempre.

Quando o âmbito abrange todos os seus workflows, isto inclui chamadas a LLM efetuadas fora de um workflow, como as do [separador Chat](./chat-tab.md) e do [Assistente de IA](../reference/ai-assistant.md). A utilização de agentes de programação (Codex, OpenCode) não está incluída.

Os modelos sem linha de preços são reportados no contexto do alerta como sem preço definido, em vez de serem silenciosamente contabilizados como zero.

### Contagem de execuções

Conta as execuções de qualquer estado na janela. É este o tipo que deteta um trigger que se descontrolou: um workflow que normalmente é executado 20 vezes por hora a ser executado subitamente 2.000 vezes. O registo de disparo inclui uma discriminação por origem de trigger, porque é habitualmente essa a resposta à pergunta "porque é que isto aconteceu".

## Âmbito

Um alerta monitoriza **um workflow** ou **todos os seus workflows**.

"Todos os seus workflows" significa todos os workflows a que o proprietário do alerta tem acesso. Deliberadamente, não significa todos os workflows da instância Heym: os alertas podem ser partilhados, e partilhar um alerta não deve conceder a alguém números agregados de workflows que não pode abrir.

## O Assistente

A criação de um alerta percorre cinco passos.

1. **Tipo** — escolha um dos quatro acima.
2. **Âmbito** — um workflow, ou todos.
3. **Condição** — a janela temporal, mais os campos de limiar para esse tipo.
4. **Resposta** — o que é executado quando dispara, e com que frequência continuar a notificá-lo.
5. **Revisão** — atribua um nome e consulte o backtest.

### O backtest

O passo de Revisão responde à pergunta que realmente importa antes de guardar: *nas últimas 24 horas, quantas vezes teria isto disparado?*

Reporta a contagem de disparos e o valor mais elevado observado face ao seu limiar. Se indicar que a condição teria disparado 400 vezes, corrija o limiar antes de guardar, em vez de depois de ser notificado. Pode ampliar o período de retrospetiva para 3 ou 7 dias.

## Redação com IA

No topo do primeiro passo existe uma caixa onde descreve o que pretende em linguagem natural:

> Avise-me se a sincronização de faturas falhar mais de 5 vezes em 10 minutos

O Heym transforma isso numa definição de alerta, preenche todos os passos que consegue e avança com os campos preenchidos pela IA assinalados, para que confirme em vez de reescrever. Um pedido completo leva-o diretamente à Revisão.

**Um pedido parcial continua a fazer avançar.** Indique apenas "avise-me se falhar 5 vezes" e obtém um alerta de limiar de erros com a contagem preenchida, predefinições para o resto, e o assistente abre no primeiro passo que ainda necessita da sua intervenção: nesse caso, o Âmbito, porque não foi indicado nenhum workflow. Uma nota no topo indica o que falta decidir. Nunca bloqueia Seguinte nem Criar.

O mesmo se aplica quando o modelo indica um workflow a que não tem acesso, ou devolve uma condição com campos em falta. As partes que fazem sentido são mantidas, o resto recorre às predefinições para esse tipo de alerta, e ajusta a partir daí. Nada aqui contorna a validação: as próprias regras do assistente e a API voltam a verificar o alerta quando guarda.

## Comportamento de Repetição

Assim que um alerta é acionado, entra num estado de disparo. O que acontece a seguir é a sua escolha no passo 4.

- **Notificar uma vez, até recuperar** (predefinição) — dispara uma vez e depois mantém-se silencioso enquanto a condição se mantiver. Quando a métrica volta a descer abaixo do limiar, o alerta regressa a OK e torna-se elegível para disparar novamente. A recuperação é uma mudança de estado, não um evento: não cria um registo de disparo nem executa o workflow de notificação.
- **Continuar a notificar num intervalo** — dispara novamente a cada N minutos enquanto a condição se mantiver.

A predefinição existe porque um workflow avariado verificado a cada 60 segundos produziria, de outra forma, 60 disparos por hora, que é como os alertas acabam silenciados.

## Executar um Workflow ao Disparar

O passo 4 oferece três respostas à pergunta "o que deve acontecer quando isto disparar":

- **Criar e atribuir um novo workflow** (predefinição) — guardar o alerta também cria um workflow chamado *"&lt;nome do alerta&gt; notification"* e liga-o. Chega com um nó de entrada cujos campos são exatamente o payload abaixo, pelo que `$alert.body.observed_value` e o resto resolvem-se imediatamente e só tem de anexar o nó que entrega a mensagem. **Go to workflow** no cartão do alerta abre-o. Esta é a predefinição porque um alerta que dispara para o vazio é fácil de ignorar.
- **Escolher um workflow existente** — executar algo que já construiu.
- **Não fazer nada** — o disparo continua a ser registado no separador, apenas não executa nada.

O payload do alerta chega como o corpo de entrada desse workflow:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Que workflow produziu o número

`workflows` é o único local onde um workflow aparece. Lista todos os workflows que contribuíram para a leitura, cada um com o seu próprio `value` — a contagem de erros, a contagem de execuções, a execução mais lenta em milissegundos ou o gasto desse workflow, dependendo do tipo de alerta. A lista está ordenada por `value`, do mais alto para o mais baixo, pelo que `workflows[0]` é o pior infrator.

É **sempre um array**: com um único elemento no âmbito de um workflow, com muitos em "todos os meus workflows", e vazio em vez de null quando nada é atribuível. Um workflow de notificação pode iterá-lo sem verificar a forma.

Deliberadamente, não existe um `workflow_id` no singular. Descrevia o âmbito do alerta em vez da métrica, pelo que era `null` no âmbito do sistema, que é exatamente o caso em que "que workflow?" mais importa. `observed_value` continua a ser o agregado com o qual o limiar foi comparado; os campos `value` por workflow explicam de onde veio.

É assim que os alertas chegam ao Slack, email, Telegram ou a qualquer outro lugar: com os [nós](../reference/node-types.md) que já tem, em vez de um sistema de notificação separado.

Um alerta não pode notificar o workflow que está a vigiar. Isso seria um ciclo, mais obviamente para um alerta de contagem de execuções em que cada notificação acrescenta à contagem que mede.

As execuções de notificação são execuções normais, pelo que aparecem no [histórico de execuções](../reference/execution-history.md) como qualquer outra execução. Um workflow de notificação que falha é registado no disparo, mas nunca impede que o próprio disparo seja registado.

Um workflow de notificação é executado como o proprietário do alerta, com as suas credenciais e variáveis globais, exatamente como se este o tivesse executado. Escolher um workflow que alguém partilhou consigo não empresta as credenciais dessa pessoa. Se o proprietário perder o acesso ao workflow de notificação, o disparo continua a ser registado, mas a execução de notificação é ignorada.

## Histórico de Disparos

Abaixo da lista de alertas está o histórico de disparos: o que disparou, quando, o valor observado em relação ao limiar, a janela exata que foi avaliada e o resultado da notificação.

Reconhecer um disparo marca a linha e altera o distintivo do alerta de **Firing** para **Acknowledged**. Isso é uma afirmação sobre si, não sobre o alerta: a condição mantém-se e o alerta regressa a **OK** por si só quando a métrica volta a descer abaixo do limiar.

Cada registo armazena o detalhe contribuinte no momento em que disparou: ids de execuções com falha e mensagens de erro, gasto por modelo ou a repartição por origem de trigger. Isto é deliberado. A janela já passou e recalculá-la mais tarde pode dar uma resposta diferente.

Os registos de disparo são mantidos durante 90 dias.

## Perguntar ao Chat sobre Alertas

O [separador Chat](./chat-tab.md) pode responder a perguntas sobre os seus alertas:

- "Que alertas tenho?"
- "Existe um alerta no workflow de faturas?"
- "Porque disparou o alerta de custos?"
- "Quando foi a última vez que isto foi acionado?"

Para uma pergunta do tipo "porque disparou", o Chat cita o valor observado real, o limiar e a janela temporal do registo de disparo, juntamente com o detalhe contribuinte.

## Partilha

Os alertas podem ser partilhados com utilizadores individuais ou com [equipas](./teams-tab.md). As pessoas com quem partilha podem ver o alerta e o seu histórico de disparos. Apenas o proprietário pode editar, pausar, eliminar ou voltar a partilhá-lo.

### Quando o acesso ao workflow é removido

Um alerta num único workflow continua a ler as métricas de execução desse workflow, pelo que remover o acesso de alguém ao workflow também determina o que acontece aos seus alertas sobre o mesmo:

- **Remover uma partilha de utilizador ou de equipa** pergunta ao proprietário do workflow se deve também parar os alertas desse utilizador ou dessa equipa no workflow. Parar é a predefinição. Os alertas parados são colocados em pausa, não eliminados, e cada um é registado como `alert.disable_on_access_revoke` no [registo de auditoria](../reference/audit.md).
- **Remover um membro de uma equipa ou eliminar uma equipa** para sempre os alertas afetados, porque a pessoa que faz essa alteração não é necessariamente o proprietário do workflow.
- Um alerta só é parado quando o seu proprietário não tem qualquer outro caminho para o workflow, como uma partilha direta ou outra equipa.
- Retomar ou testar um alerta em pausa verifica novamente o acesso do proprietário, pelo que um alerta parado não pode ser reativado nem utilizado para ler as métricas do workflow sem acesso. Premir **Retomar** sem acesso mostra uma notificação a explicar que o proprietário do workflow tem de o partilhar novamente primeiro.

## Gerir Alertas

- **Pausar / Retomar** — um alerta em pausa nunca é avaliado. Retomar verifica-o imediatamente em vez de aguardar pelo intervalo seguinte.
- **Editar** — as alterações são validadas como um todo, pelo que uma edição parcial não pode deixar o alerta num estado inválido.
- **Eliminar** — remove o alerta e o seu histórico de disparos.

## Ver também

- [Separador Analytics](./analytics-tab.md) — os gráficos a partir dos quais estes limiares são definidos
- [Separador Rastreios](./traces-tab.md) — de onde vêm os valores de custo do LLM
- [Histórico de Execuções](../reference/execution-history.md) — as execuções que os alertas de erro, duração e contagem medem
- [Separador Chat](./chat-tab.md) — consultar alertas em linguagem natural
- [Equipas](./teams-tab.md) — partilhar alertas com uma equipa
