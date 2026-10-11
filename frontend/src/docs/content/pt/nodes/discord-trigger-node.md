# Discord Trigger

O nó **Discord Trigger** é um ponto de entrada sem entradas que recebe webhooks da Discord Interactions API e inicia um workflow automaticamente. Utilize-o para slash commands, botões, modais e outras interações de aplicações Discord que devam fluir para nós de IA ou de integração a jusante.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 |
| Saídas | 1 |
| Saída | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `discord_trigger` contendo a chave pública da aplicação Discord |

## Guia de Configuração

### 1. Criar uma Credencial `discord_trigger`

1. Acesse **Settings → Credentials → New Credential**
2. Selecione o tipo **Discord Trigger (Public Key)**
3. Cole a **Application Public Key** do Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Salve a credencial

### 2. Adicionar o Nó ao Seu Workflow

1. Arraste **Discord Trigger** para o canvas
2. Selecione o nó para abrir o painel de Propriedades
3. Escolha a sua credencial `discord_trigger`
4. Copie a **Interactions URL** exibida no painel do nó

### 3. Registrar o Endpoint de Interactions no Discord

1. Abra o [Discord Developer Portal](https://discord.com/developers/applications)
2. Selecione a sua aplicação
3. Acesse **General Information** ou **Interactions**
4. Cole a **Interactions Endpoint URL** do nó no campo de endpoint
5. O Discord envia uma requisição `PING` para validar o endpoint e o Heym responde automaticamente após verificar a assinatura
6. Salve as suas alterações

## Campos de Saída

Após o nó ser acionado, os nós a jusante podem acessar:

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.interaction` | Payload completo da interação Discord |
| `$nodeLabel.type` | Tipo de interação |
| `$nodeLabel.data` | Payload de comando, botão ou modal |
| `$nodeLabel.data.name` | Nome do slash command, quando aplicável |
| `$nodeLabel.data.options` | Array de opções do slash command |
| `$nodeLabel.headers` | Headers do webhook sanitizados |
| `$nodeLabel.triggered_by` | Rótulo da origem do Trigger (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID do nó no canvas que recebeu a interação Discord |
| `$nodeLabel.triggered_at` | Timestamp ISO para esta execução do workflow |

## Exemplo de Workflow

**Discord slash command → LLM → Output**

```
discordTrigger → llm → output
```

- Rótulo do **Discord Trigger**: `discordEvent`
- Mensagem do usuário no **LLM**: `"Reply to this Discord command: $discordEvent.data.name"`
- Mensagem do **Output**: `$llm.text`

## Segurança

- As requisições são verificadas usando **Ed25519** com a chave pública da sua aplicação
- Timestamps com mais de **5 minutos** são rejeitados para reduzir ataques de replay
- Headers sensíveis (`x-signature-ed25519`, `authorization`, etc.) são removidos antes que os dados cheguem aos nós a jusante
- O Trigger exige uma credencial `discord_trigger` válida; as requisições são rejeitadas se a credencial estiver ausente ou for inválida

## Observações

- O Heym retorna uma resposta Discord diferida imediatamente, executa o workflow em segundo plano e publica a saída final do workflow como um follow-up no Discord quando um nó `Output` produz conteúdo
- A URL de interactions é derivada do ID do nó e permanece estável mesmo que o workflow seja renomeado
- Utilize um [Discord Node](./discord-node.md) comum apenas quando você também desejar um post de webhook separado, além do follow-up da interação
- Um nó `discordTrigger` geralmente é suficiente; utilize **Switch** ou **Condition** a jusante para rotear diferentes tipos de interação

## Relacionados

- [Discord Node](./discord-node.md) – Enviar mensagens de saída no Discord
- [Triggers](../reference/triggers.md) – Visão geral de todos os pontos de entrada de workflow
- [Third-Party Integrations](../reference/integrations.md) – Configuração da credencial Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Adicionar e gerenciar credenciais `discord_trigger`