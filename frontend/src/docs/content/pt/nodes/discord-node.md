# Discord

O nó **Discord** envia uma mensagem para um canal do Discord por meio de um Incoming Webhook. Utilize-o para alertas, notificações de Workflow, respostas do tipo bot e relatórios de erros.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `discord` contendo a URL do incoming webhook |
| `message` | expression | Texto da mensagem de saída. Suporta [expressões](../reference/expression-dsl.md). |
| `username` | expression | Nome de exibição opcional para substituir nesta mensagem |
| `avatarUrl` | expression | URL de avatar opcional para substituir nesta mensagem |

## Configuração

1. Crie uma [credencial de Webhook do Discord](../reference/integrations.md#discord)
2. Adicione o nó **Discord** ao seu Workflow
3. Selecione a credencial
4. Defina `message` como o texto de saída ou um modelo construído a partir de dados anteriores
5. Opcionalmente, substitua o `username` de exibição e o `avatarUrl`

## Exemplo

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Campos de saída

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.status` | Código de status HTTP retornado pelo Discord, geralmente `204` em caso de sucesso |
| `$nodeLabel.response` | Corpo bruto da resposta retornado pelo webhook do Discord |
| `$nodeLabel.message` | Texto da mensagem que o Heym enviou |
| `$nodeLabel.username` | Nome de usuário enviado com o webhook, se fornecido |
| `$nodeLabel.avatar_url` | URL do avatar enviada com o webhook, se fornecida |

## Padrões comuns

- Utilize-o em conjunto com o [Discord Trigger](./discord-trigger-node.md) quando desejar uma publicação adicional em um canal além da resposta de interação
- Envie avisos de falha a partir do [Error Handler](./error-handler-node.md)
- Publique resumos gerados pelo [LLM](./llm-node.md) ou pelo [Agent](./agent-node.md)

## Segurança de saída

- A URL do webhook armazenada na credencial deve usar `http://` ou `https://` e resolver apenas para endereços públicos. Destinos de loopback, privados, link-local, multicast e de metadados de nuvem são bloqueados.
- O Heym valida os endereços resolvidos e fixa o destino da conexão antes do envio, de modo que uma resposta DNS não possa redirecionar a requisição para um endereço interno após a verificação. Os proxies de ambiente são desativados enquanto a proteção está ativa, e os redirecionamentos não são seguidos.
- Implantações que publicam em um receptor de webhook interno podem definir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` em uma instância auto-hospedada confiável. Mantenha o padrão em implantações hospedadas ou multi-inquilino.

**Nota de atualização para a v0.0.109:** esta verificação é nova para o Discord. Uma credencial cuja URL de webhook aponta para loopback ou um endereço privado é recusada, a menos que a configuração acima esteja habilitada.

## Relacionados

- [Discord Trigger](./discord-trigger-node.md) – Inicie um Workflow a partir de interações recebidas do Discord
- [Integrações de terceiros](../reference/integrations.md) – Configuração da credencial do Discord
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicione e gerencie credenciais `discord`
- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó