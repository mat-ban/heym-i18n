# Supabase

O nó **Supabase** lê e modifica tabelas expostas pela API PostgREST de um projeto Supabase. Utilize-o quando precisar de acesso ao estado da aplicação armazenado em SQL a partir de um workflow, sem escrever requisições HTTP manualmente.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | Supabase |
| Saída | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial Supabase em [Credenciais](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operação: `select`, `insert`, `update`, `upsert` ou `delete` |
| `supabaseSchema` | expression | Nome do schema. Se estiver em branco, o nó utiliza o schema padrão da credencial e, em seguida, `public`. |
| `supabaseTable` | expression | Nome simples da tabela a consultar ou modificar. Insira o schema em `supabaseSchema`, não aqui. |
| `supabaseSelectColumns` | expression | Lista de seleção PostgREST separada por vírgulas para `select` (padrão `*`) |
| `supabaseFilter` | expression | Objeto JSON de filtro. Suporta correspondências exatas, além de objetos de operadores e grupos lógicos, por exemplo `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` ou `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Número máximo de linhas a retornar para `select` (`0` = buscar todas as linhas correspondentes com paginação no servidor; valores negativos recorrem a `100`) |
| `supabaseOrderBy` | expression | Coluna opcional para ordenação em `select` |
| `supabaseAscending` | boolean | Ordena de forma ascendente quando `true`, descendente quando `false` |
| `supabaseRowsInputMode` | string | Para `insert`/`upsert`: modo `raw` de array JSON ou `auto` para mapear automaticamente a única entrada a montante |
| `supabaseDataInputMode` | string | Para `update`: modo `raw` de objeto JSON ou `auto` para mapear automaticamente a única entrada a montante |
| `supabaseIgnoredInputFields` | string | Nomes de campos opcionais separados por vírgulas a omitir durante o mapeamento automático dos dados de entrada |
| `supabaseRows` | expression | Array JSON de objetos de linha para `insert` e `upsert` |
| `supabaseOnConflict` | expression | Colunas de destino de conflito opcionais separadas por vírgulas para `upsert`, por exemplo `id` ou `tenant_id,email` |
| `supabaseData` | expression | Objeto JSON com os valores de coluna atualizados para `update` |

## Configuração da credencial

Crie uma credencial **Supabase** na [aba Credenciais](../tabs/credentials-tab.md) com:

1. A sua **URL do projeto**, por exemplo `https://your-project.supabase.co`
2. Uma **chave de API** com acesso às tabelas que este workflow deve utilizar
3. Um **schema padrão** opcional (o padrão é `public`)

O nó comunica com o endpoint PostgREST do Supabase em `/rest/v1/<table>`.
Utilize `supabaseTable` apenas para a tabela, como `users` ou `profiles`. Não insira `schema.table`, `rpc/...` ou outros caminhos de API nesse campo.

Quando uma credencial Supabase válida está selecionada, o editor consegue descobrir tabelas expostas e colunas
de tabela diretamente a partir dos metadados OpenAPI do PostgREST. Utilize o menu suspenso de **tabelas descobertas** para
escolher uma tabela e os **chips de colunas** em **Selecionar colunas** para construir rapidamente uma lista de seleção.

## Operações

| Operação | Campos obrigatórios | Descrição |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Lê linhas com filtros de correspondência exata, limite e ordenação opcionais |
| `insert` | `supabaseTable`, `supabaseRows` ou mapeamento automático da entrada | Insere uma ou mais linhas |
| `update` | `supabaseTable`, `supabaseData` ou mapeamento automático da entrada, `supabaseFilter` | Atualiza linhas correspondentes ao filtro |
| `upsert` | `supabaseTable`, `supabaseRows` ou mapeamento automático da entrada | Insere ou mescla linhas utilizando a semântica de upsert do Supabase. Utilize `supabaseOnConflict` quando precisar de um destino de conflito explícito. |
| `delete` | `supabaseTable`, `supabaseFilter` | Exclui linhas correspondentes ao filtro |

## Sintaxe de filtro

`supabaseFilter` compila JSON estruturado em parâmetros de consulta PostgREST.

- Correspondência exata: `{"status":"active"}`
- Comparação: `{"created_at":{"gte":"2026-01-01"}}`
- Pertencimento: `{"status":{"in":["active","paused"]}}`
- Correspondência de padrão: `{"email":{"ilike":"*@example.com"}}`
- OR lógico: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- AND lógico: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Para múltiplos operadores no mesmo campo, prefira um grupo lógico:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginação

`select` agora realiza paginação verdadeira no servidor contra o PostgREST.

- `supabaseLimit: "0"` busca todas as linhas correspondentes página a página
- Valores de `supabaseLimit` acima de 1000 se distribuem automaticamente em múltiplas requisições
- Os resultados são mesclados de volta em um único array `.rows` e `.count` permanece como o número total de linhas correspondentes

Ao ler tabelas grandes, defina um `supabaseOrderBy` estável para manter os limites das páginas previsíveis.
## Mapeamento automático de entrada

Para `insert`, `upsert` e `update`, alterne o nó para **Mapeamento automático de entrada** quando o único nó upstream já produz a estrutura que você deseja gravar.

- Um único objeto torna-se uma linha ou um payload de atualização
- Um array de objetos torna-se várias linhas para `insert` / `upsert`
- Um objeto upstream com um array `rows` reutiliza esse array diretamente
- `supabaseIgnoredInputFields` permite descartar campos como `id`, `created_at` ou `success`

## Referência de saída

| Campo de saída | Tipo | Descrição |
|-------------|------|-------------|
| `.rows` | array | Objetos de linha retornados |
| `.count` | number | Número de linhas retornadas ou afetadas |
| `.success` | boolean | Indica se a operação foi bem-sucedida |

## Exemplo – Selecionar usuários ativos

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Acesse a saída: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Exemplo – Fazer upsert de uma linha de perfil

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Relacionados

- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicionar credenciais do Supabase
- [Integrações de terceiros](../reference/integrations.md) – Configuração de credenciais de integração
