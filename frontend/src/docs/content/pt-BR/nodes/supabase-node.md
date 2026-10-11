# Supabase

O nó **Supabase** lê e modifica tabelas expostas pela API PostgREST de um projeto Supabase. Utilize-o quando desejar que o workflow acesse o estado da aplicação respaldado por SQL sem precisar escrever requisições HTTP manualmente.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | Supabase |
| Saída | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial Supabase em [Credentials](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operação: `select`, `insert`, `update`, `upsert` ou `delete` |
| `supabaseSchema` | expression | Nome do schema. Se estiver em branco, o nó utiliza o schema padrão da credencial e, em seguida, `public`. |
| `supabaseTable` | expression | Nome simples da tabela a consultar ou modificar. Coloque o schema em `supabaseSchema`, não aqui. |
| `supabaseSelectColumns` | expression | Lista de seleção PostgREST separada por vírgulas para `select` (padrão `*`) |
| `supabaseFilter` | expression | Objeto JSON de filtro. Suporta correspondências exatas, além de objetos de operadores e grupos lógicos, por exemplo `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` ou `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Número máximo de linhas a retornar em `select` (`0` = buscar todas as linhas correspondentes com paginação no lado do servidor; valores negativos recorrem a `100`) |
| `supabaseOrderBy` | expression | Coluna opcional para ordenação em `select` |
| `supabaseAscending` | boolean | Ordena de forma ascendente quando `true`, descendente quando `false` |
| `supabaseRowsInputMode` | string | Para `insert`/`upsert`: modo `raw` de array JSON ou `auto` para mapear automaticamente a única entrada upstream |
| `supabaseDataInputMode` | string | Para `update`: modo `raw` de objeto JSON ou `auto` para mapear automaticamente a única entrada upstream |
| `supabaseIgnoredInputFields` | string | Nomes de campos opcionais separados por vírgulas a omitir durante o mapeamento automático dos dados de entrada |
| `supabaseRows` | expression | Array JSON de objetos de linha para `insert` e `upsert` |
| `supabaseOnConflict` | expression | Colunas de destino de conflito opcionais separadas por vírgulas para `upsert`, por exemplo `id` ou `tenant_id,email` |
| `supabaseData` | expression | Objeto JSON com os valores de coluna atualizados para `update` |

## Configuração da Credencial

Crie uma credencial **Supabase** na [aba Credentials](../tabs/credentials-tab.md) com:

1. Sua **Project URL**, por exemplo `https://your-project.supabase.co`
2. Uma **API key** com acesso às tabelas que este workflow deve utilizar
3. Um **schema padrão** opcional (o padrão é `public`)

O nó se comunica com o endpoint PostgREST do Supabase em `/rest/v1/<table>`.
Utilize `supabaseTable` apenas para a tabela, como `users` ou `profiles`. Não informe `schema.table`, `rpc/...` ou outros caminhos de API nesse campo.

Quando uma credencial Supabase válida é selecionada, o editor pode descobrir tabelas expostas e colunas
de tabela diretamente a partir dos metadados OpenAPI do PostgREST. Utilize o dropdown **discovered tables** para
escolher uma tabela e os **column chips** em **Select Columns** para montar rapidamente uma lista de seleção.

## Operações

| Operação | Campos Obrigatórios | Descrição |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Lê linhas com filtros opcionais de correspondência exata, limite e ordenação |
| `insert` | `supabaseTable`, `supabaseRows` ou mapeamento automático da entrada | Insere uma ou mais linhas |
| `update` | `supabaseTable`, `supabaseData` ou mapeamento automático da entrada, `supabaseFilter` | Atualiza linhas correspondentes ao filtro |
| `upsert` | `supabaseTable`, `supabaseRows` ou mapeamento automático da entrada | Insere ou mescla linhas usando a semântica de upsert do Supabase. Utilize `supabaseOnConflict` quando precisar de um destino de conflito explícito. |
| `delete` | `supabaseTable`, `supabaseFilter` | Exclui linhas correspondentes ao filtro |

## Sintaxe de Filtro

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

O `select` agora realiza paginação verdadeira no lado do servidor contra o PostgREST.

- `supabaseLimit: "0"` busca todas as linhas correspondentes página por página
- Valores de `supabaseLimit` acima de 1000 se distribuem automaticamente em múltiplas requisições
- Os resultados são mesclados de volta em um único array `.rows` e `.count` permanece como o total de linhas correspondentes

Ao ler tabelas grandes, defina um `supabaseOrderBy` estável para manter os limites de página previsíveis.

## Mapeamento Automático da Entrada

Para `insert`, `upsert` e `update`, alterne o nó para **Auto-map input** quando o único
nó upstream já produzir o formato que você deseja gravar.

- Um único objeto se torna uma linha ou um payload de atualização
- Um array de objetos se torna várias linhas para `insert` / `upsert`
- Um objeto upstream com um array `rows` reutiliza esse array diretamente
- `supabaseIgnoredInputFields` permite descartar campos como `id`, `created_at` ou `success`
## Referência de Saída

| Campo de saída | Tipo | Descrição |
|-------------|------|-------------|
| `.rows` | array | Objetos de linha retornados |
| `.count` | number | Número de linhas retornadas ou afetadas |
| `.success` | boolean | Indica se a operação foi bem-sucedida |

## Exemplo – Selecionar Usuários Ativos

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

Acessar a saída: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Exemplo – Upsert de uma Linha de Perfil

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

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Aba de Credenciais](../tabs/credentials-tab.md) – Adicionar credenciais do Supabase
- [Integrações de Terceiros](../reference/integrations.md) – Configuração de credenciais de integração
