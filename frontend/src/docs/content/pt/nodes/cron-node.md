# Cron

O nó **Cron** aciona um workflow de acordo com um agendamento, utilizando uma expressão cron. Nenhuma entrada do usuário é necessária — o workflow é executado automaticamente nos horários especificados.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 |
| Saídas | 1 |
| Saída | Evento de trigger (sem payload) |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `cronExpression` | string | Expressão cron (ex.: `0 * * * *` para execução a cada hora) |

## Formato da expressão cron

Cron padrão de 5 campos: `minute hour day-of-month month day-of-week`

| Campo | Valores | Exemplo |
|-------|--------|---------|
| Minuto | 0–59 | `0` = no minuto 0 |
| Hora | 0–23 | `*` = a cada hora |
| Dia do mês | 1–31 | `*` = todos os dias |
| Mês | 1–12 | `*` = todos os meses |
| Dia da semana | 0–7 (0 e 7 = domingo) | `*` = todos os dias |

**Exemplos comuns:**

- `0 * * * *` – a cada hora
- `0 0 * * *` – diariamente à meia-noite
- `*/15 * * * *` – a cada 15 minutos
- `0 9 * * 1-5` – dias úteis às 9:00

## Exemplo

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Relacionados

- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Desabilitar nó](./disable-node.md) – Interromper um trigger cron após uma condição
- [Habilitar nó](./enable-node.md) – Iniciar novamente um trigger cron desabilitado