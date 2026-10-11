# Slack Trigger

O nó **Slack Trigger** é um ponto de entrada sem entradas que recebe webhooks da Slack Events API e inicia um workflow automaticamente. Ele lida com o desafio de verificação de URL do Slack e verifica as assinaturas das requisições com um signing secret.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 |
| Saídas | 1 |
| Saída | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `slack_trigger` contendo o signing secret |

## Guia de Configuração

### 1. Criar uma Credencial `slack_trigger`

1. Acesse **Settings → Credentials → New Credential**
2. Selecione o tipo **Slack Trigger (Signing Secret)**
3. Cole o **Signing Secret** do seu Slack App:
   - No Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Salve a credencial

### 2. Adicionar o Nó ao Seu Workflow

1. Abra o canvas do workflow
2. Arraste o **Slack Trigger** do painel de nós para o canvas
3. Clique no nó para abrir o painel de Propriedades
4. Selecione sua credencial `slack_trigger`
5. Copie a **Webhook URL** exibida no painel

### 3. Configurar Seu Slack App

1. Nas configurações do seu Slack App, acesse **Event Subscriptions**
2. Ative a opção **Enable Events**
3. Cole a Webhook URL no campo **Request URL**
4. O Slack envia um desafio de verificação de URL — o Heym responde automaticamente em milissegundos
5. O campo fica verde: ✓ Verified
6. Inscreva-se nos **Bot Events** de que você precisa (por exemplo, `message.channels`, `reaction_added`)
7. Salve suas alterações e reinstale o app no seu workspace, se solicitado

## Campos de Saída

Após o nó ser acionado, os nós subsequentes podem acessar:

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.event` | Objeto completo do evento do Slack |
| `$nodeLabel.event.type` | Tipo do evento (por exemplo, `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Texto da mensagem (quando aplicável) |
| `$nodeLabel.event.user` | ID do usuário do Slack que acionou o evento |
| `$nodeLabel.event.channel` | ID do canal |
| `$nodeLabel.event.ts` | Timestamp do evento |
| `$nodeLabel.headers` | Cabeçalhos HTTP sanitizados do Slack |
| `$nodeLabel.triggered_by` | Rótulo da origem do Trigger (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID do nó no canvas que recebeu o evento do Slack |

## Exemplo de Workflow

**Mensagem do Slack → resposta do LLM → envio pelo Slack:**

```
slackTrigger → llm → slack
```

- Rótulo do **slackTrigger**: `slackEvent`
- Mensagem do usuário no **LLM**: `"Reply to this Slack message: $slackEvent.event.text"`
- Mensagem do **Slack**: `$llm.text`

## Segurança

- As requisições são verificadas usando **HMAC-SHA256** com seu signing secret
- Timestamps com mais de **5 minutos** são rejeitados (prevenção contra ataques de replay)
- Cabeçalhos sensíveis (`x-slack-signature`, `authorization`, etc.) são removidos antes de chegarem aos nós subsequentes
- Se nenhuma credencial estiver definida, o nó é executado sem verificação — recomendado apenas para testes locais

## Observações

- O Heym responde com `200 OK` imediatamente e executa o workflow em segundo plano — isso atende ao requisito de resposta em 3 segundos do Slack
- A webhook URL é derivada do ID do nó e nunca muda, mesmo após renomear o workflow
- Apenas um nó `slackTrigger` por workflow é necessário; use nós **Switch** ou **Condition** subsequentes para rotear diferentes tipos de eventos
