# HTTP

O nó **HTTP** realiza requisições HTTP utilizando a sintaxe cURL. Ele pode ser um ponto de partida do workflow (sem aresta de entrada) ou receber entrada de nós anteriores.

## Visão geral

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

## Formato da resposta

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Acessando a resposta

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

Utilize a sintaxe cURL com `-H` para cabeçalhos, `-d` para o corpo de uma requisição POST, etc. Expressões podem ser utilizadas em qualquer parte da string curl, incluindo a URL, um cabeçalho ou uma linha de cabeçalho inteira. Uma [credencial](../reference/credentials.md) do tipo Header é resolvida para `key: value`, portanto `-H "$credentials.MyApiKey"` envia o cabeçalho completo:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Aspas e espaços dentro de uma expressão pertencem à expressão, não ao comando cURL, portanto métodos que recebem argumentos de string funcionam inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autenticando com credenciais

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

Uma credencial do tipo Bearer já carrega o prefixo `Bearer `, portanto adicionar outro envia `Bearer Bearer …`. Credenciais do Google Sheets e do Google Drive permitem chamar APIs do Google que o nó correspondente não cobre, como adicionar uma aba a uma planilha, dentro dos escopos concedidos à credencial. Quando um nome não é um identificador simples (contém `-`, começa com um dígito ou é uma palavra reservada), utilize a forma com colchetes: `-H "Authorization: $credentials["my-api-key"]"`.

Quando o [AI Assistant](../reference/ai-assistant.md) ou o [Chat](../tabs/chat-tab.md) constrói uma requisição HTTP que necessita de autenticação e nenhum nó dedicado cobre o serviço, ele pergunta qual credencial utilizar. Selecione uma, altere o nome do cabeçalho pré-preenchido caso a API espere um diferente, e ele escreve a linha de cabeçalho para você. O assistente vê os nomes e tipos das credenciais, nunca os seus valores. Caso você não tenha uma credencial adequada, a pergunta oferece a opção de criar uma. Segredos que chegam à saída do nó, como os `request.headers` enviados, são mascarados nos resultados da execução.
## Segurança de Egress

- Por padrão, a URL deve usar `http://` ou `https://` e resolver apenas para endereços públicos. Destinos de loopback, privados, link-local, multicast e de metadados de nuvem são bloqueados.
- O Heym valida os endereços resolvidos e fixa o destino da conexão para evitar DNS rebinding. Os proxies de ambiente são desativados enquanto o guard estiver ativo. Redirecionamentos não são seguidos por padrão; adicione a opção `-L` do cURL para segui-los. Quando habilitados, cada salto de redirecionamento é verificado segundo a mesma política de endereços públicos e fixado antes da conexão.
- Implantações auto-hospedadas confiáveis que se conectam intencionalmente a serviços internos podem definir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenha o padrão em implantações hospedadas ou multi-tenant.

**Nota de atualização para a v0.0.105:** esta política de âmbito da instância agora também protege destinos derivados de credenciais usados pelo Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, execução de LLM personalizado e descoberta de modelos, o assistente de IA, guardrails e embeddings de RAG. Credenciais existentes que apontam para endereços de loopback, privados ou link-local são recusadas, a menos que `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` esteja habilitado em uma instância auto-hospedada confiável. Enquanto o guard estiver ativo, os clientes HTTP protegidos ignoram `HTTP_PROXY` e `HTTPS_PROXY`; habilitar a opção de exclusão os restaura. Os pacotes de CA do operador configurados por meio de `SSL_CERT_FILE` ou `SSL_CERT_DIR` permanecem suportados. O ClickHouse é verificado antes da abertura da conexão, mas não é fixado no momento da discagem, pois o clickhouse-connect traz seu próprio transporte urllib3.

## Relacionados

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Triggers](../reference/triggers.md) – HTTP como ponto de entrada do workflow
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicione chaves de API para requisições autenticadas
