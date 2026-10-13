# Enviar E-mail

O nó **Enviar E-mail** envia e-mails via SMTP. Utilize-o para notificações, alertas e e-mails transacionais.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial SMTP em [Credenciais](../tabs/credentials-tab.md) |
| `to` | expression | Destinatário(s). Separados por vírgula para múltiplos. |
| `cc` | expression | Destinatário(s) em cópia. Separados por vírgula para múltiplos. |
| `bcc` | expression | Destinatário(s) em cópia oculta. Separados por vírgula para múltiplos. Ocultos dos demais destinatários. |
| `subject` | expression | Assunto do e-mail |
| `emailBody` | expression | Conteúdo do corpo do e-mail |
| `attachments` | expression | IDs de arquivos do [Drive](./drive-node.md) separados por vírgula a serem anexados. Apenas arquivos de propriedade do proprietário do workflow ou compartilhados com uma de suas equipes podem ser anexados. |

## Anexos

Anexe arquivos do seu [Drive](./drive-node.md) passando um ou mais IDs de arquivos do Drive para o campo `attachments`. Utilize uma expressão `$` para referenciar a saída `id` de um nó Drive upstream (por exemplo, `$drive.id`), ou liste IDs estáticos separados por vírgulas. Cada ID é resolvido no escopo do proprietário do workflow; um ID inválido ou inacessível faz o nó falhar em vez de enviar um e-mail parcial.

## Configuração

Adicione uma credencial SMTP com servidor, porta, e-mail e senha. O remetente visível é o campo opcional **From** da credencial; se From estiver em branco, o envio é feito com o nome de utilizador. Servidores SMTP comuns:

- Gmail: `smtp.gmail.com`, porta 587 (Senha de App necessária)
- Outlook: `smtp.office365.com`, porta 587

## Exemplo

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

O valor de `attachments` acima referencia um nó [Drive](./drive-node.md) upstream rotulado como `drive`, anexando o arquivo que ele produziu.

## Relacionados

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Error Handler](./error-handler-node.md) – Enviar e-mail em caso de falha
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicionar credenciais SMTP
- [Integrações de Terceiros](../reference/integrations.md#smtp-email) – Configuração de provedores SMTP (Gmail, Outlook, Mailgun, SendGrid)
