# IMAP Trigger

O nó **IMAP Trigger** consulta periodicamente uma caixa de entrada de e-mail em um intervalo fixo e inicia um workflow uma vez para cada nova mensagem detectada. Trata-se de um nó de trigger sem entradas, projetado para automação de e-mails recebidos, como triagem de suporte, monitoramento de caixas de correio compartilhadas e caixas de aprovação.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 |
| Saídas | 1 |
| Saída | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `imap` contendo servidor, login, caixa de correio e configurações de SSL |
| `pollIntervalMinutes` | Integer | Com que frequência o Heym verifica a caixa de correio em busca de novos e-mails |

## Guia de Configuração

### 1. Criar uma Credencial `imap`

1. Acesse **Settings → Credentials → New Credential**
2. Selecione o tipo **IMAP Email Inbox**
3. Informe:
   - **IMAP Host** (por exemplo, `imap.gmail.com`)
   - **IMAP Port** (`993` para SSL/TLS na maioria dos provedores)
   - **Username / Email**
   - **Password / App Password**
   - **Mailbox** opcional (padrão: `INBOX`)
4. Mantenha **Use SSL / TLS** habilitado, a menos que seu servidor de e-mail exija explicitamente IMAP sem SSL
5. Salve a credencial

### 2. Adicionar o Nó ao Seu Workflow

1. Arraste **IMAP Trigger** para o canvas
2. Selecione o nó para abrir o painel de Propriedades
3. Escolha sua credencial `imap`
4. Defina o **Poll Interval (Minutes)** com um valor inteiro, como `1`, `5` ou `15`

## Semântica do Trigger

- A primeira consulta estabelece uma linha de base do conteúdo atual da caixa de correio e **não** reproduz e-mails mais antigos.
- As consultas subsequentes disparam uma vez por mensagem cujo IMAP UID seja mais recente que o cursor salvo.
- Se o `UIDVALIDITY` da caixa de correio mudar, o Heym redefine o cursor e estabelece uma nova linha de base para evitar processamento duplicado.
- Cada novo e-mail inicia uma execução de workflow separada com `trigger_source = "imap"`.

## Campos de Saída

Após o nó disparar, os nós subsequentes podem acessar:

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.email` | Payload completo do e-mail analisado |
| `$nodeLabel.email.subject` | Assunto decodificado |
| `$nodeLabel.email.from` | Cabeçalho `From` bruto |
| `$nodeLabel.email.fromAddresses` | Lista de remetentes analisada |
| `$nodeLabel.email.toAddresses` | Lista de destinatários analisada |
| `$nodeLabel.email.ccAddresses` | Lista de CC analisada |
| `$nodeLabel.email.replyToAddresses` | Lista de reply-to analisada |
| `$nodeLabel.email.text` | Corpo em texto simples |
| `$nodeLabel.email.html` | Corpo em HTML |
| `$nodeLabel.email.attachments` | Array de metadados de anexos (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Objeto de cabeçalhos decodificado |
| `$nodeLabel.email.uid` | IMAP UID para deduplicação ou registro em log |
| `$nodeLabel.triggered_by` | Rótulo da origem do trigger (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID do nó no canvas que detectou o e-mail |
| `$nodeLabel.triggered_at` | Timestamp ISO da execução do workflow |

## Exemplo de Workflow

**E-mail de suporte recebido → resumir → encaminhar**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** label: `supportInbox`
- **LLM** user message: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Observações

- Muitos provedores exigem uma **app password** para acesso IMAP em vez da senha da sua conta principal.
- O conteúdo dos anexos não é injetado na entrada do workflow; apenas os metadados dos anexos são incluídos.
- Utilize [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) ou [DataTable](./datatable-node.md) a jusante para encaminhar ou registrar novos e-mails.

## Relacionados

- [Triggers](../reference/triggers.md) – Visão geral de todos os pontos de entrada de workflow
- [Third-Party Integrations](../reference/integrations.md) – Configuração da credencial IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Adicionar e gerenciar credenciais `imap`
- [Send Email](./send-email-node.md) – Responder ou encaminhar mensagens recebidas
