# Slack

O nó **Slack** envia uma mensagem para um canal do Slack por meio de um Incoming Webhook. Utilize-o para notificações, alertas e relatórios de erros.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | Repassa a entrada |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial do Slack (URL do webhook) em [Credenciais](../tabs/credentials-tab.md) |
| `message` | expression | Texto da mensagem. Suporta [expressões](../reference/expression-dsl.md). |

## Configuração

1. Crie um Incoming Webhook no seu workspace do Slack
2. Adicione uma credencial do Slack na aba Credenciais com a URL do webhook
3. Referencie a credencial no nó

## Exemplo

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Utilize com o [Error Handler](./error-handler-node.md) para notificações de falha:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Segurança de egress

- A URL do webhook armazenada na credencial deve usar `http://` ou `https://` e resolver apenas para endereços públicos. Destinos de loopback, privados, link-local, multicast e de metadados de nuvem são bloqueados.
- O Heym valida os endereços resolvidos e fixa o destino da conexão antes do envio, de modo que uma resposta DNS não possa redirecionar a requisição para um endereço interno após a verificação. Os proxies de ambiente são desativados enquanto a proteção está ativa, e os redirecionamentos não são seguidos.
- Implantações que publicam em um receptor de webhook interno podem definir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` em uma instância auto-hospedada confiável. Mantenha o padrão em implantações hospedadas ou multi-inquilino.

**Nota de atualização para a v0.0.109:** esta verificação é nova para o Slack. Uma credencial cuja URL de webhook aponta para loopback ou um endereço privado é recusada, a menos que a configuração acima esteja habilitada.

## Relacionados

- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Error Handler](./error-handler-node.md) – Enviar Slack em caso de falha do workflow
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicionar webhook do Slack