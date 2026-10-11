# Nó de Chamada MCP

O nó **MCP Call** chama diretamente uma ferramenta específica do [Model Context Protocol (MCP)](https://modelcontextprotocol.io), sem que um LLM decida qual ferramenta invocar. Utilize-o quando você souber exatamente qual ferramenta chamar e desejar uma execução determinística de etapa única.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.result` |

## Quando Usar

Utilize o nó MCP Call quando:
- Você souber exatamente qual ferramenta MCP chamar em tempo de design
- Você não precisar de um LLM para escolher entre ferramentas
- Você desejar uma alternativa leve e determinística a um nó de agente para uma única invocação de ferramenta

Utilize o [nó Agent](./agent-node.md) quando um LLM deve decidir quais ferramentas chamar ou quando você precisar de raciocínio em múltiplas etapas.

> O nó MCP Call **não pode** ser conectado a um nó de agente como ferramenta.

## Configuração de Conexão

O nó se conecta a um único servidor MCP. Escolha um transporte e preencha os campos correspondentes.

### SSE / Streamable HTTP

| Campo | Descrição |
|-------|-------------|
| `transport` | `sse` ou `streamable_http` |
| `url` | URL completa do servidor MCP (ex.: `https://mcp.example.com/sse`). Suporta expressões DSL. |
| `headers` | Objeto JSON de cabeçalhos HTTP (ex.: `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Tempo limite por conexão em segundos (padrão: 30) |

### stdio

| Campo | Descrição |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Executável a ser executado (ex.: `npx`) |
| `args` | Array JSON de argumentos (ex.: `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Objeto JSON de variáveis de ambiente (ex.: `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Tempo limite por conexão em segundos (padrão: 30) |

## Seleção de Ferramenta

1. Preencha os campos de conexão.
2. Clique em **Fetch Tools** — o nó se conecta ao servidor MCP e lista as ferramentas disponíveis.
3. Selecione uma ferramenta no menu suspenso.

**A seleção de ferramenta é obrigatória.** O nó não será executado sem uma ferramenta selecionada.

## Argumentos

Após selecionar uma ferramenta, o nó renderiza um campo de entrada para cada argumento definido no schema de entrada da ferramenta. Cada campo aceita:
- Um valor estático: `10`
- Uma expressão DSL: `$userInput.body.text`

Argumentos obrigatórios são marcados com `*`.

## Saída

| Campo | Descrição |
|-------|-------------|
| `$nodeLabel.result` | Resultado da ferramenta. Se a resposta for um JSON válido, este será um objeto analisado. Caso contrário, será uma string. |

## Exemplo

Chame uma ferramenta `search` em um servidor MCP SSE, passando a consulta do usuário:

```json
{
  "type": "mcpCall",
  "data": {
    "label": "searchCall",
    "connection": {
      "transport": "sse",
      "url": "https://mcp.example.com/sse",
      "timeoutSeconds": 30
    },
    "selectedTool": "search",
    "toolArguments": {
      "query": "$userInput.body.text",
      "limit": "10"
    },
    "timeoutSeconds": 30
  }
}
```

Acesse o resultado a jusante:

```
$searchCall.result.items   ← se o resultado for um objeto JSON
$searchCall.result         ← se o resultado for uma string simples
```

## Observações

- O nó resolve expressões DSL em `url`, `headers`, `env` e em todos os valores de `toolArguments` antes de chamar a ferramenta.
- O `timeoutSeconds` no nível do nó se aplica à execução geral; o `connection.timeoutSeconds` se aplica à própria sessão MCP.
- Se o servidor MCP estiver indisponível ou retornar um erro, o nó falhará e a mensagem de erro estará disponível no trace do workflow.
