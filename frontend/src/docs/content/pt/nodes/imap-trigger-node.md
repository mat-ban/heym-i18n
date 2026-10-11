# Trigger IMAP

O nó **Trigger IMAP** consulta periodicamente uma caixa de correio eletrónico num intervalo fixo e inicia um workflow uma vez por cada nova mensagem detetada. Trata-se de um nó de trigger sem entradas, concebido para automação de correio eletrónico de entrada, como triagem de suporte, monitorização de caixas de correio partilhadas e caixas de aprovação.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 |
| Saídas | 1 |
| Saída | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `imap` contendo servidor, login, caixa de correio e definições de SSL |
| `pollIntervalMinutes` | Integer | Frequência com que o Heym verifica a caixa de correio à procura de novo correio eletrónico |

## Guia de Configuração

### 1. Criar uma Credencial `imap`

1. Aceda a **Settings → Credentials → New Credential**
2. Selecione o tipo **IMAP Email Inbox**
3. Introduza:
   - **IMAP Host** (por exemplo `imap.gmail.com`)
   - **IMAP Port** (`993` para SSL/TLS na maioria dos fornecedores)
   - **Username / Email**
   - **Password / App Password**
   - **Mailbox** opcional (predefinição: `INBOX`)
4. Mantenha **Use SSL / TLS** ativado, a menos que o seu servidor de correio exija explicitamente IMAP sem SSL
5. Guarde a credencial

### 2. Adicionar o Nó ao Seu Workflow

1. Arraste **IMAP Trigger** para o canvas
2. Selecione o nó para abrir o painel de Propriedades
3. Escolha a sua credencial `imap`
4. Defina **Poll Interval (Minutes)** com um valor inteiro, como `1`, `5` ou `15`

## Semântica do Trigger

- A primeira consulta estabelece uma linha de base do conteúdo atual da caixa de correio e **não** reproduz correio eletrónico anterior.
- As consultas subsequentes disparam uma vez por cada mensagem cujo UID IMAP seja mais recente do que o cursor guardado.
- Se o `UIDVALIDITY` da caixa de correio for alterado, o Heym repõe o cursor e estabelece novamente a linha de base para evitar processamento duplicado.
- Cada novo correio eletrónico inicia uma execução de workflow separada com `trigger_source = "imap"`.

## Campos de Saída

Após o disparo do nó, os nós a jusante podem aceder a:

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.email` | Payload completo do correio eletrónico analisado |
| `$nodeLabel.email.subject` | Assunto descodificado |
| `$nodeLabel.email.from` | Cabeçalho `From` em bruto |
| `$nodeLabel.email.fromAddresses` | Lista de remetentes analisada |
| `$nodeLabel.email.toAddresses` | Lista de destinatários analisada |
| `$nodeLabel.email.ccAddresses` | Lista de CC analisada |
| `$nodeLabel.email.replyToAddresses` | Lista de reply-to analisada |
| `$nodeLabel.email.text` | Corpo em texto simples |
| `$nodeLabel.email.html` | Corpo em HTML |
| `$nodeLabel.email.attachments` | Matriz de metadados de anexos (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Objeto de cabeçalhos descodificado |
| `$nodeLabel.email.uid` | UID IMAP para deduplicação ou registo |
| `$nodeLabel.triggered_by` | Etiqueta da origem do trigger (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID do nó no canvas que detetou o correio eletrónico |
| `$nodeLabel.triggered_at` | Timestamp ISO para a execução do workflow |

## Workflow de Exemplo

**Correio eletrónico de suporte de entrada → resumir → encaminhar**

```
imapTrigger → llm → condition → slack / sendEmail
```

- Etiqueta do **IMAP Trigger**: `supportInbox`
- Mensagem do utilizador do **LLM**: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Notas

- Muitos fornecedores exigem uma **app password** para acesso IMAP, em vez da palavra-passe principal da sua conta.
- O conteúdo dos anexos não é injetado na entrada do workflow; apenas os metadados dos anexos são incluídos.
- Utilize [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) ou [DataTable](./datatable-node.md) a jusante para encaminhar ou registar novo correio eletrónico.

## Relacionado

- [Triggers](../reference/triggers.md) – Visão geral de todos os pontos de entrada do workflow
- [Third-Party Integrations](../reference/integrations.md) – Configuração da credencial IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Adicionar e gerir credenciais `imap`
- [Send Email](./send-email-node.md) – Responder ou reencaminhar mensagens de entrada