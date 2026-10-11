# Aba Alerts

A aba **Alerts** permite definir condições de limite em uma janela de tempo e ser notificado quando elas forem ultrapassadas. O Heym já registra os resultados de execução, a duração das execuções e os gastos com LLM, mas nunca oferece essas informações por conta própria. Um alerta é como você solicita isso.

Cada alerta é avaliado em uma **janela de tempo** que você escolhe, nunca em um único evento. Uma execução com falha é ruído. Doze execuções com falha em dez minutos é um incidente.

## Tipos de Alerta

| Tipo | A pergunta que responde | De onde vem o número |
|---|---|---|
| **Error threshold** | Isso falhou mais de N vezes na janela? | Linhas do [Execution history](../reference/execution-history.md) com status de erro |
| **Workflow duration** | As execuções ficaram mais lentas do que o esperado na janela? | Tempo de execução, agregado como máximo, média ou percentil 95 |
| **Token / USD cost** | O gasto ultrapassou um orçamento na janela? | [LLM traces](./traces-tab.md) mais a tabela de custos de LLM |
| **Execution count** | Isso foi executado muito mais vezes do que deveria? | Contagem de linhas do histórico de execução |

### Error threshold

Conta execuções com falha ao longo da janela e dispara quando a contagem atinge seu limite. Como conta em uma janela em vez de interceptar cada falha, um único erro transitório não vai acionar você.

### Workflow duration

Mede a duração das execuções dentro da janela. Escolha **max** (a execução mais lenta), **average** ou **p95**. O valor de p95 usa o mesmo cálculo de percentil da [Analytics tab](./analytics-tab.md), então o alerta e o gráfico de latência nunca discordam sobre a mesma janela.

**Minimum runs in the window** mantém isso honesto. A execução mais lenta em uma janela quase vazia é apenas aquela única execução, então definir um mínimo de, digamos, 3 impede que o alerta dispare por ruído.

### Token / USD cost

Soma o gasto com LLM ao longo da janela, seja como total de tokens ou em dólares. Os valores em dólares são resolvidos pela mesma tabela de preços que a [Traces tab](./traces-tab.md) e a [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table) usam, então um alerta de custo e a página de custos sempre concordam.

Quando o escopo é todos os seus workflows, isso inclui chamadas de LLM feitas fora de um workflow, como a [Chat tab](./chat-tab.md) e o [AI Assistant](../reference/ai-assistant.md). O uso de agentes de codificação (Codex, OpenCode) não está incluído.

Modelos sem linha de preço são reportados no contexto do alerta como sem preço, em vez de serem silenciosamente contados como zero.

### Execution count

Conta execuções de qualquer status na janela. Este é o que captura um trigger que deu errado: um workflow que normalmente é executado 20 vezes por hora de repente sendo executado 2.000 vezes. O registro de disparo inclui uma discriminação por origem de trigger, porque geralmente é essa a resposta para "por que isso aconteceu".

## Escopo

Um alerta monitora **um workflow** ou **todos os seus workflows**.

"Todos os seus workflows" significa todos os workflows que o proprietário do alerta pode acessar. Deliberadamente não significa todos os workflows na instância do Heym: alertas podem ser compartilhados, e compartilhar um alerta não deve entregar a alguém números agregados de workflows que essa pessoa não pode abrir.

## O Assistente

Criar um alerta percorre cinco etapas.

1. **Type** — escolha um dos quatro acima.
2. **Scope** — um workflow, ou todos eles.
3. **Condition** — a janela de tempo, mais os campos de limite para aquele tipo.
4. **Response** — o que é executado quando ele dispara, e com que frequência continuar avisando você.
5. **Review** — dê um nome, e veja o backtest.

### O backtest

A etapa Review responde à pergunta que realmente importa antes de você salvar: *nas últimas 24 horas, quantas vezes isso teria disparado?*

Ela informa a contagem de disparos e o maior valor observado em relação ao seu limite. Se ela disser que a condição teria disparado 400 vezes, você corrige o limite antes de salvar, em vez de depois de ser acionado. Você pode ampliar o período de análise para 3 ou 7 dias.

## Rascunho com IA

No topo da primeira etapa há uma caixa onde você descreve o que deseja em linguagem simples:

> Warn me if the invoice sync fails more than 5 times in 10 minutes

O Heym transforma isso em uma definição de alerta, preenche cada etapa que consegue e avança com os campos preenchidos pela IA marcados, para que você confirme em vez de redigitar. Uma solicitação completa leva você até Review.

**Uma solicitação parcial ainda faz você avançar.** Diga apenas "warn me if it fails 5 times" e você recebe um alerta de error threshold com a contagem preenchida, padrões para o restante, e o assistente abre na primeira etapa que ainda precisa de você: nesse caso, Scope, porque nenhum workflow foi nomeado. Uma observação no topo diz o que falta decidir. Ela nunca bloqueia Next ou Create.

O mesmo se aplica quando o modelo nomeia um workflow que você não pode acessar, ou retorna uma condição com campos faltando. As partes que fazem sentido são mantidas, o restante recorre aos padrões daquele tipo de alerta, e você ajusta a partir daí. Nada aqui contorna a validação: as próprias regras do assistente e a API verificam novamente o alerta quando você salva.
## Comportamento de Repetição

Assim que um alerta é disparado, ele entra em estado de acionamento. O que acontece em seguida é sua escolha na etapa 4.

- **Notificar uma vez, até que se recupere** (o padrão) — dispara uma vez e depois permanece silencioso enquanto a condição se mantiver. Quando a métrica cai novamente abaixo do limite, o alerta retorna para OK e torna-se elegível para disparar novamente. A recuperação é uma mudança de estado, não um evento: ela não cria um registro de disparo e não executa o Workflow de notificação.
- **Continuar notificando em um intervalo** — dispara novamente a cada N minutos enquanto a condição se mantiver.

O padrão existe porque um Workflow quebrado verificado a cada 60 segundos produziria, de outra forma, 60 disparos por hora, e é assim que os alertas acabam sendo silenciados.

## Executando um Workflow ao Disparar

A etapa 4 oferece três respostas para "o que deve acontecer quando isto disparar":

- **Criar e atribuir um novo Workflow** (o padrão) — salvar o alerta também cria um Workflow chamado *"&lt;nome do alerta&gt; notification"* e o vincula. Ele chega com um Nó de entrada cujos campos são exatamente o payload abaixo, então `$alert.body.observed_value` e o restante são resolvidos imediatamente, e você só precisa anexar o Nó que entrega a mensagem. **Go to workflow** no cartão do alerta o abre. Este é o padrão porque um alerta que dispara para o vazio é fácil de passar despercebido.
- **Escolher um Workflow existente** — executar algo que você já construiu.
- **Não fazer nada** — o disparo ainda é registrado na aba, apenas não executa nada.

O payload do alerta chega como o corpo de entrada desse Workflow:

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

### Qual Workflow produziu o número

`workflows` é o único lugar onde um Workflow aparece. Ele lista todos os Workflows que contribuíram para a leitura, cada um com seu próprio `value` — a contagem de erros, a contagem de execuções, a execução mais lenta em milissegundos ou o gasto daquele Workflow, dependendo do tipo de alerta. A lista é ordenada por `value`, do maior para o menor, então `workflows[0]` é o maior ofensor.

É **sempre um array**: com um único elemento sob escopo de um Workflow, com muitos sob "todos os meus Workflows", e vazio em vez de null quando nada é atribuível. Um Workflow de notificação pode iterá-lo sem verificação de formato.

Deliberadamente não existe um `workflow_id` no singular. Ele descrevia o escopo do alerta em vez da métrica, então era `null` sob escopo de sistema, que é exatamente o caso em que "qual Workflow?" mais importa. `observed_value` permanece o agregado com o qual o limite foi comparado; os campos `value` por Workflow explicam de onde ele veio.

É assim que os alertas chegam ao Slack, e-mail, Telegram ou qualquer outro lugar: com os [Nós](../reference/node-types.md) que você já tem, em vez de um sistema de notificação separado.

Um alerta não pode notificar o Workflow que ele está monitorando. Isso seria um loop, mais obviamente para um alerta de contagem de execuções, em que cada notificação aumenta a contagem que ele mede.

Execuções de notificação são execuções comuns, então aparecem no [histórico de execuções](../reference/execution-history.md) como qualquer outra execução. Um Workflow de notificação que falha é registrado no disparo, mas nunca impede que o próprio disparo seja registrado.

Um Workflow de notificação é executado como o proprietário do alerta, com suas credenciais e variáveis globais, exatamente como se ele o tivesse executado. Escolher um Workflow que alguém compartilhou com você não empresta as credenciais dessa pessoa. Se o proprietário perder o acesso ao Workflow de notificação, o disparo ainda é registrado, mas a execução de notificação é ignorada.

## Histórico de Disparos

Abaixo da lista de alertas está o histórico de disparos: o que disparou, quando, o valor observado em relação ao limite, a janela exata que foi avaliada e o resultado da notificação.

Reconhecer um disparo marca a linha e muda o badge do alerta de **Firing** para **Acknowledged**. Isso é uma declaração sobre você, não sobre o alerta: a condição ainda se mantém, e o alerta retorna para **OK** por conta própria quando a métrica cai novamente abaixo do limite.

Cada registro armazena o detalhe contribuinte no momento em que disparou: ids de execuções com falha e mensagens de erro, gasto por modelo ou a discriminação por origem de Trigger. Isso é intencional. A janela já passou, e recalculá-la depois pode dar uma resposta diferente.

Os registros de disparo são mantidos por 90 dias.

## Perguntando ao Chat Sobre Alertas

A [aba Chat](./chat-tab.md) pode responder perguntas sobre seus alertas:

- "Quais alertas eu tenho?"
- "Existe um alerta no Workflow de invoice?"
- "Por que o alerta de custo disparou?"
- "Quando isto disparou pela última vez?"

Para uma pergunta do tipo "por que disparou", o Chat cita o valor observado real, o limite e a janela de tempo do registro de disparo, junto com o detalhe contribuinte.

## Compartilhamento

Alertas podem ser compartilhados com usuários individuais ou com [equipes](./teams-tab.md). As pessoas com quem você compartilha podem ver o alerta e seu histórico de disparos. Apenas o proprietário pode editar, pausar, excluir ou recompartilhá-lo.
### Quando o acesso ao Workflow é removido

Um alerta em um único Workflow continua lendo as métricas de execução desse Workflow, portanto, remover o acesso de alguém ao Workflow também determina o que acontece com os alertas dessa pessoa sobre ele:

- **Remover o compartilhamento de um usuário ou equipe** pergunta ao proprietário do Workflow se ele também deve interromper os alertas desse usuário ou equipe no Workflow. A interrupção é o padrão. Alertas interrompidos são pausados, não excluídos, e cada um é registrado como `alert.disable_on_access_revoke` no [log de auditoria](../reference/audit.md).
- **Remover um membro da equipe ou excluir uma equipe** sempre interrompe os alertas afetados, porque a pessoa que faz essa alteração não é necessariamente o proprietário do Workflow.
- Um alerta só é interrompido quando seu proprietário não tem nenhum outro caminho para o Workflow, como um compartilhamento direto ou outra equipe.
- Retomar ou testar um alerta pausado verifica novamente o acesso do proprietário, portanto, um alerta interrompido não pode ser reativado nem usado para ler as métricas do Workflow sem acesso. Pressionar **Resume** sem acesso exibe uma notificação explicando que o proprietário do Workflow precisa compartilhá-lo novamente primeiro.

## Gerenciando Alertas

- **Pause / Resume** — um alerta pausado nunca é avaliado. Retomar o verifica imediatamente em vez de esperar pelo próximo intervalo.
- **Edit** — as alterações são validadas como um todo, portanto, uma edição parcial não pode deixar o alerta em um estado inválido.
- **Delete** — remove o alerta e seu histórico de disparos.

## Veja Também

- [Aba Analytics](./analytics-tab.md) — os gráficos dos quais esses limites são extraídos
- [Aba Traces](./traces-tab.md) — de onde vêm os valores de custo de LLM
- [Histórico de Execução](../reference/execution-history.md) — as execuções que os alertas de erro, duração e contagem medem
- [Aba Chat](./chat-tab.md) — consultando alertas em linguagem natural
- [Equipes](./teams-tab.md) — compartilhando alertas com uma equipe
