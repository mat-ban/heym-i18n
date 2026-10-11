# ClickHouse

O nó **ClickHouse** executa operações CRUD, de contagem e de SQL bruto contra um banco de dados [ClickHouse](https://clickhouse.com/) externo por meio da sua interface HTTP. Utilize-o para gravar eventos em uma tabela ClickHouse a partir de um workflow, ler ou agregar dados analíticos, ou executar SQL arbitrário — sem escrever requisições HTTP manualmente.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | ClickHouse |
| Saída | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial ClickHouse em [Credenciais](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operação: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` ou `upsert` |
| `clickhouseTable` | expression | Nome simples da tabela. Obrigatório para todas as operações, exceto `query`. |
| `clickhouseQuery` | expression | SQL bruto para `query`. `SELECT`/`SHOW`/`DESCRIBE` retornam linhas; outras instruções são executadas como comandos. |
| `clickhouseFilter` | expression | Objeto JSON de filtros de igualdade, por exemplo `{"status":"active"}`. Utilizado por `find`, `count`, `update` e `remove`. Os valores são parametrizados. |
| `clickhouseLimit` | string | Número máximo de linhas para `find` / `getAll` (`0` = ilimitado, sem cláusula LIMIT). Padrão `100`. |
| `clickhouseSort` | expression | `column` opcional ou `column ASC\|DESC` para `find` |
| `clickhouseRowId` | expression | Valor comparado com a coluna `id` da tabela para `getById` |
| `clickhouseInputMode` | string | Para `insert`/`upsert`: modo `raw` de array JSON ou modo `selective` de campos chave/valor |
| `clickhouseData` | expression | Array JSON de objetos de linha para `insert`/`upsert`, ou objeto JSON de valores de coluna para `update` |
| `clickhouseMappings` | array | Pares `{key, value}` utilizados quando `clickhouseInputMode` é `selective` |

## Configuração da credencial

Crie uma credencial **ClickHouse** na [aba Credenciais](../tabs/credentials-tab.md) com:

1. **Host** — o host HTTP sem esquema, por exemplo `your-instance.clickhouse.cloud`
2. **Port** — a porta da interface HTTP (`8443` para HTTPS, `8123` para HTTP)
3. **Username** / **Password** — o padrão é `default` com senha vazia
4. **Database** — o padrão é `default`
5. **Secure** — habilite para HTTPS (ClickHouse Cloud)

O nó se conecta por meio do cliente HTTP oficial `clickhouse-connect`. Utilize **Test connection** no diálogo da credencial para verificar a acessibilidade antes de salvar.

## Operações

| Operação | Campos obrigatórios | Descrição |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Executa SQL bruto. `SELECT` retorna `{rows, count}`; outras instruções retornam `{result}`. |
| `find` | `clickhouseTable` | Lê linhas com filtros de igualdade, ordenação e limite opcionais |
| `getAll` | `clickhouseTable` | Lê linhas até o limite, sem filtro |
| `count` | `clickhouseTable` | Conta linhas, opcionalmente filtradas |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Lê uma única linha pela sua coluna `id` |
| `insert` | `clickhouseTable`, `clickhouseData` ou mapeamentos | Insere uma ou mais linhas |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Atualiza linhas correspondentes via `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Exclui linhas correspondentes via `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` ou mapeamentos | Insere linhas (pressupõe uma tabela `ReplacingMergeTree`) |

## Sintaxe de filtro

`clickhouseFilter` é um objeto JSON plano de verificações de igualdade de colunas. Os valores são enviados como parâmetros de consulta vinculados, portanto são seguros contra injeção.

```json
{ "status": "active", "tenant_id": 42 }
```

Isso é compilado para `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Apenas a igualdade é suportada no construtor de filtros — para intervalos, junções ou agregações, utilize a operação `query` com SQL bruto.

## Modos de entrada (insert / upsert)

- **Array JSON** (`raw`): forneça um array JSON de objetos de linha em `clickhouseData`. As chaves ausentes em uma determinada linha são inseridas como `NULL`. O conjunto de colunas é a união das chaves de todas as linhas.
- **Chave-valor** (`selective`): após selecionar uma credencial e uma tabela, o editor descobre as colunas da tabela e cria um campo de valor por coluna. Uma linha é inserida por execução; cada valor suporta expressões.
## Mutações e Semântica do ClickHouse

O ClickHouse é um banco de dados OLAP, portanto as gravações em nível de linha se comportam de forma diferente de um armazenamento OLTP:

- **`update`** emite `ALTER TABLE … UPDATE` e **`remove`** emite `DELETE FROM`. Ambos são **mutações assíncronas** — são aplicadas eventualmente e são comparativamente custosas. Prefira gravações em lote a mutações frequentes de linha única.
- **`upsert`** executa um `INSERT`. Para obter o comportamento de merge-on-key, utilize uma tabela com o motor `ReplacingMergeTree`.
- **`getById`** pressupõe que a tabela possua uma coluna `id`.
- `update` e `remove` exigem um `clickhouseFilter` não vazio para evitar mutações em toda a tabela.

## Referência de Saída

| Campo de saída | Tipo | Descrição |
|-------------|------|-------------|
| `.rows` | array | Objetos de linha retornados (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Contagem de linhas (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Linha única ou `null` (`getById`) |
| `.result` | string | Resumo do comando para `query` que não seja SELECT |
| `.success` | boolean | Indica se a operação foi bem-sucedida |

## Exemplo – Inserir um Evento

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## Exemplo – Contar Usuários Ativos

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Acessar a saída: `$activeCount.count`.

## Exemplo – Consulta de Relatório Diário

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Acessar a saída: `$dailyReport.rows`, `$dailyReport.count`.

## Relacionados

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicionar credenciais do ClickHouse
- [Integrações de Terceiros](../reference/integrations.md) – Configuração de credenciais de integração
