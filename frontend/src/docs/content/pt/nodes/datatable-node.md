# DataTable

O nó **DataTable** lê, grava e gerencia dados em DataTables do Heym. Utilize-o para operações CRUD em armazenamento estruturado próprio, sem necessidade de credenciais externas.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable da [aba DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operação: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID da linha (para getById, update, remove) |
| `dataTableData` | JSON string | Valores das colunas: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filtro (find/upsert/count). `find` e `count` suportam operadores `{"age": {"$gt": 18}}`; `upsert` utiliza correspondência exata `{"column_name": "value"}` |
| `dataTableSort` | string | Coluna de ordenação, prefixo `-` para ordem decrescente |
| `dataTableLimit` | number | Número máximo de linhas retornadas (padrão: 100) |

## Operações

| Operação | Campos obrigatórios | Descrição |
|-----------|----------------|-------------|
| `find` | dataTableId | Localiza linhas correspondentes a um filtro de operadores opcional, com ordenação/limite opcionais |
| `getAll` | dataTableId | Obtém todas as linhas com ordenação/limite opcionais |
| `count` | dataTableId | Conta linhas correspondentes a um filtro de operadores opcional (contabilizadas no banco de dados; retorna apenas um número) |
| `getById` | dataTableId, dataTableRowId | Obtém uma única linha por UUID |
| `insert` | dataTableId, dataTableData | Insere uma nova linha |
| `update` | dataTableId, dataTableRowId, dataTableData | Atualiza a linha (mescla os dados) |
| `remove` | dataTableId, dataTableRowId | Exclui uma linha |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Atualiza se houver correspondência; caso contrário, insere |

## Exemplo - Localizar linhas

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## Exemplo - Inserir linha

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## Exemplo - Contar linhas

Conte linhas correspondentes a uma condição em um único nó, em vez de `getAll` → If/Else → Map.

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

O resultado fica disponível como `$activeAdults.count`. Um filtro vazio ou omitido conta todas as linhas.

### Operadores de filtro para find e count

Em um filtro `find` ou `count`, um valor simples significa igualdade; um valor de objeto aplica um operador:

| Operador | Significado |
|----------|---------|
| `$eq` (ou um valor simples) | Igual a |
| `$ne` | Diferente de |
| `$gt`, `$gte`, `$lt`, `$lte` | Comparações de maior/menor (numéricas para colunas tipadas como `number`, caso contrário, texto) |
| `$contains` | Correspondência de substring sem diferenciar maiúsculas de minúsculas |
| `$in` | O valor está no array fornecido |

Exemplo combinando vários: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Operadores desconhecidos são ignorados. Os filtros de `upsert` ainda utilizam valores de correspondência exata para localizar a linha a ser atualizada.

Também é possível filtrar pelos metadados da linha — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — que são armazenados como colunas reais, e não dentro dos seus dados. Para datas, informe um valor completo para comparações de intervalo (ex.: `{"created_at": {"$gt": "2026-06-04"}}`) ou utilize `$contains` para correspondência parcial de texto (ex.: `{"created_at": {"$contains": "2026-06-04"}}`). Se uma das suas próprias colunas tiver o mesmo nome de um campo de metadados, a coluna de dados terá precedência.

## Acesso à saída

- `$nodeLabel.success` - Status de sucesso booleano
- `$nodeLabel.rows` - Array de linhas (find, getAll)
- `$nodeLabel.row` - Objeto de linha única (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Acessa o valor de uma coluna específica
- `$nodeLabel.count` - Número de linhas (linhas retornadas para find/getAll; total de linhas correspondentes para count)
- `$nodeLabel.id` - UUID da linha (insert, update, remove)
- `$nodeLabel.found` - Booleano (getById)
- `$nodeLabel.operation` - Nome da operação (ex.: `count`; `insert`/`update` para upsert)

## Nenhuma credencial necessária

Diferentemente das integrações externas, o DataTable opera no banco de dados interno do Heym. As permissões de acesso do proprietário do workflow são verificadas automaticamente.
## Criado pelo Assistente de IA

Quando o [Assistente de IA](../reference/ai-assistant.md#data-tables) ou o [Chat](../tabs/chat-tab.md) cria este nó, ele seleciona ou cria a tabela junto com você e grava os nomes exatos das colunas da tabela em `dataTableData` e `dataTableFilter`.

## Relacionado

- [Aba DataTable](../tabs/datatable-tab.md) - Crie e gerencie tabelas
- [Nó Grist](./grist-node.md) - Integração com planilhas externas
- [Expression DSL](../reference/expression-dsl.md) - Sintaxe de expressões para valores dinâmicos
