# Heym Trigger

O nó **Heym Trigger** inicia um workflow quando o próprio Heym publica um evento de plataforma. Trata-se de um nó de trigger sem entradas para automatizar o Heym com o Heym: trilhas de auditoria de alterações, anúncios de implantação e resumos de integridade da instância.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 |
| Saídas | 1 |
| Saída | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Credencial | Nenhuma necessária |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `eventNames` | String array | Quais eventos assinar. Deixe vazio para receber todos os eventos. |

## Eventos

| Evento | Publicado quando | Escopo |
|-------|----------------|-------|
| `heym.started` | A plataforma Heym é iniciada | Em toda a instância: todos os assinantes o recebem |
| `workflow.created` | Um workflow é criado | Apenas os assinantes do proprietário do workflow |
| `workflow.updated` | Um workflow é salvo | Apenas os assinantes do proprietário do workflow |
| `workflow.deleted` | Um workflow é excluído | Apenas os assinantes do proprietário do workflow |

Widgets de dashboard são armazenados internamente como workflows, mas nunca produzem eventos `workflow.*`.

## A entrega é em lote

O Heym despacha eventos a cada cinco segundos. **Todo evento reivindicado em uma única passagem de despacho chega em uma única execução de workflow**, como um array.

- Crie dois workflows com cinco segundos de diferença entre si → **uma** execução com dois eventos.
- Crie um workflow → **uma** execução com um array de um elemento.

O formato nunca muda, portanto as expressões a jusante nunca precisam ramificar com base na chegada de um ou de muitos eventos. Quando você precisar agir uma vez por evento, insira um nó [Loop](./loop-node.md) sobre `$nodeLabel.events`.

## Entrega exatamente uma vez

Cada evento é reivindicado por nó assinante por meio de uma restrição única de banco de dados antes de ser entregue. Isso se mantém em todos os workers uvicorn, todos os containers e todas as máquinas: executar o Heym em dois servidores não entrega um evento duas vezes. Se uma reivindicação não puder ser registrada, o evento não será entregue de forma alguma — o design falha de forma segura em vez de disparar duas vezes.

Dois nós `heymTrigger` diferentes assinando o mesmo evento recebem cada um o evento uma vez; eles não competem por ele.

## A janela de despacho

O dispatcher considera apenas eventos publicados nos **últimos cinco minutos**. Eventos mais antigos permanecem no log para inspeção, mas nunca são entregues. Isso limita o que acontece após uma indisponibilidade: reiniciar o Heym após uma hora offline não reproduz nada, em vez de disparar uma hora de eventos acumulados de uma só vez.

Os eventos são mantidos por **7 dias** e depois excluídos.

## Campos de saída

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.events` | Array de objetos de evento, do mais antigo para o mais recente. Sempre um array. |
| `$nodeLabel.events[0].id` | UUID do evento |
| `$nodeLabel.events[0].name` | Nome do evento, por exemplo `workflow.created` |
| `$nodeLabel.events[0].payload` | Corpo do evento |
| `$nodeLabel.events[0].workflow_id` | Id do workflow em questão, ou `null` para `heym.started` |
| `$nodeLabel.events[0].created_at` | Timestamp ISO de quando o evento foi publicado |
| `$nodeLabel.count` | Número de eventos neste lote |
| `$nodeLabel.triggered_at` | Timestamp ISO da execução do workflow |

### Formatos de payload

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` carrega o nome capturado imediatamente antes da exclusão, já que a linha do workflow não existe mais no momento em que você lê o evento.

## Workflow de exemplo

**Trilha de auditoria de alterações de workflow**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** com label `platformEvents`, assinando `workflow.created`, `workflow.updated`, `workflow.deleted`
- Nó **Heym** com `getWorkflow` e `heymWorkflowId` definido como `$platformEvents.events[0].workflow_id`
- Mensagem do **Slack**: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Observações

- `heym.started` dispara **uma vez por inicialização da plataforma**, não uma vez por worker, mesmo que o Heym execute oito workers por container. Containers que iniciam com mais de cinco minutos de diferença publicam um evento cada.
- Execuções disparadas dessa forma aparecem no histórico com `trigger_source = "heym_event"`.
- Defina **Events** como nenhum em vez de listar todos os quatro se você quiser capturar automaticamente tipos de eventos adicionados em versões futuras.

## Relacionados

- [Heym](./heym-node.md) – Ler workflows e histórico de execuções
- [Triggers](../reference/triggers.md) – Visão geral de todos os pontos de entrada de workflow
- [Loop](./loop-node.md) – Agir uma vez por evento em um lote
