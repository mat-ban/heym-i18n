# HTTP

O nó **HTTP** realiza requisições HTTP usando a sintaxe cURL. Ele pode ser um ponto de partida do workflow (sem aresta de entrada) ou receber entrada de nós anteriores.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 ou 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `curl` | string | Comando cURL (ex.: `curl -X GET https://api.example.com`) |

## Formato da Resposta

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Acessando a Resposta

- `$httpNode.status` – Código de status HTTP
- `$httpNode.body` – Corpo da resposta (string ou JSON analisado)
- `$httpNode.body.fieldName` – Acessa campos JSON
- `$httpNode.headers` – Cabeçalhos da resposta

## Exemplo

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Use a sintaxe cURL com `-H` para cabeçalhos, `-d` para o corpo de uma requisição POST, etc. Expressões podem ser usadas em qualquer lugar na string curl, incluindo a URL, um cabeçalho ou uma linha de cabeçalho inteira. Uma [credencial do tipo Header](../reference/credentials.md) é resolvida para `key: value`, portanto `-H "$credentials.MyApiKey"` envia o cabeçalho completo:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Aspas e espaços dentro de uma expressão pertencem à expressão, não ao comando cURL, portanto métodos que recebem argumentos de string funcionam inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autenticando com Credenciais

`$credentials.Name` é resolvido para um valor diferente para cada tipo de [credencial](../reference/credentials.md), portanto a linha de cabeçalho depende do tipo:

| Tipo de credencial | `$credentials.Name` é resolvido para | Cabeçalho |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | A chave de API bruta | `-H "Authorization: Bearer $credentials.Name"` |
| Google | A chave de API bruta | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | A chave de API bruta | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Um token de acesso OAuth novo, renovado quando expira | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | O token | `-H "Authorization: Bearer $credentials.Name"` |

Uma credencial do tipo Bearer já carrega o prefixo `Bearer `, portanto adicionar outro envia `Bearer Bearer …`. Credenciais do Google Sheets e Google Drive permitem que você chame APIs do Google que o nó delas não cobre, como adicionar uma aba a uma planilha, dentro dos escopos concedidos à credencial. Quando um nome não é um identificador simples (contém `-`, começa com um dígito ou é uma palavra reservada), use a forma com colchetes: `-H "Authorization: $credentials["my-api-key"]"`.

Quando o [AI Assistant](../reference/ai-assistant.md) ou o [Chat](../tabs/chat-tab.md) constrói uma requisição HTTP que precisa de autenticação e nenhum nó dedicado cobre o serviço, ele pergunta qual credencial usar. Escolha uma, altere o nome do cabeçalho pré-preenchido se a API esperar um diferente, e ele escreve a linha de cabeçalho para você. O assistente vê nomes e tipos de credenciais, nunca seus valores. Se você não tiver uma credencial adequada, a pergunta oferece criar uma. Segredos que chegam à saída do nó, como os `request.headers` enviados, são mascarados nos resultados de execução.

## Segurança de Saída

- Por padrão, a URL deve usar `http://` ou `https://` e resolver apenas para endereços públicos. Destinos de loopback, privados, link-local, multicast e de metadados de nuvem são bloqueados.
- O Heym valida os endereços resolvidos e fixa o alvo da conexão para evitar DNS rebinding. Proxies de ambiente são desabilitados enquanto a proteção está ativa. Redirecionamentos não são seguidos por padrão; adicione a opção `-L` do cURL para segui-los. Quando habilitado, cada salto de redirecionamento é verificado contra a mesma política de endereços públicos e fixado antes de conectar.
- Implantações auto-hospedadas confiáveis que intencionalmente se conectam a serviços internos podem definir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenha o padrão em implantações hospedadas ou multi-inquilino.

**Nota de atualização para v0.0.105:** esta política de toda a instância agora também protege destinos derivados de credenciais usados por Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, execução de LLM personalizado e descoberta de modelos, o assistente de IA, guardrails e embeddings de RAG. Credenciais existentes que apontam para endereços de loopback, privados ou link-local são recusadas, a menos que `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` esteja habilitado em uma instância auto-hospedada confiável. Enquanto a proteção está ativa, clientes HTTP protegidos ignoram `HTTP_PROXY` e `HTTPS_PROXY`; habilitar a opção de exclusão os restaura. Pacotes de CA do operador configurados por meio de `SSL_CERT_FILE` ou `SSL_CERT_DIR` continuam suportados. O ClickHouse é verificado antes que a conexão seja aberta, mas não é fixado no momento da discagem, porque o clickhouse-connect traz seu próprio transporte urllib3.

## Relacionados

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Triggers](../reference/triggers.md) – HTTP como ponto de entrada do workflow
- [Aba Credentials](../tabs/credentials-tab.md) – Adicione chaves de API para requisições autenticadas
