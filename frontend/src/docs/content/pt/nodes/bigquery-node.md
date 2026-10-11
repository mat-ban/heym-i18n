# BigQuery

O nó **BigQuery** executa consultas SQL e insere linhas em conjuntos de dados do Google BigQuery por meio da BigQuery REST API v2. Utilize-o para consultar grandes conjuntos de dados analíticos ou transmitir linhas para tabelas a partir dos dados do Workflow.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | BigQuery (OAuth2) |
| Saída | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial do BigQuery em [Credenciais](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operação: `query` ou `insertRows` |
| `bqProjectId` | expression | ID do projeto do Google Cloud (ex.: `my-gcp-project`) |
| `bqQuery` | expression | String de consulta SQL. Obrigatório para `query`. |
| `bqMaxResults` | string | Número máximo de linhas retornadas por `query` (padrão `1000`). |
| `bqDatasetId` | expression | ID do conjunto de dados (ex.: `my_dataset`). Obrigatório para `insertRows`. |
| `bqTableId` | expression | ID da tabela (ex.: `my_table`). Obrigatório para `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Para `insertRows`: **Raw** = array JSON completo; **Selective** = linha única como pares de campo chave-valor. |
| `bqRows` | expression | Array JSON de objetos de linha para o modo raw (ex.: `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Pares chave-valor para o modo selective. Cada chave é um nome de coluna; cada valor é uma expressão. |

## Configuração da Credencial

O BigQuery utiliza um modelo **OAuth2 "Bring Your Own App"**. Você fornece as suas próprias credenciais OAuth2 do Google Cloud.

**Configuração do backend:** Defina **`FRONTEND_URL`** no backend do Heym com a URL pública da aplicação (o endereço que os usuários digitam no navegador), por exemplo `https://your-heym-domain`. O URI de redirecionamento OAuth é sempre `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Acesse o [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → habilite a **BigQuery API**.
2. Acesse **Credentials** → **Create Credentials** → **OAuth client ID** → selecione **Web application**.
3. Em **Authorized redirect URIs**, adicione exatamente: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Copie o **Client ID** e o **Client Secret**.
5. No Heym Dashboard → **Credenciais** → **Nova** → selecione **BigQuery (OAuth2)**.
6. Insira o Client ID, o Client Secret e um nome, e clique em **Connect** para concluir o consentimento OAuth2 em um popup do navegador.

Os Tokens são renovados automaticamente em segundo plano — não é necessário gerenciamento manual de Tokens.

## Operações

| Operação | Campos Obrigatórios | Descrição |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Executa uma consulta SQL e retorna linhas |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows ou bqMappings | Insere uma ou mais linhas por meio da API streaming insertAll |

## Referência de Saída

| Operação | Campo de saída | Tipo | Descrição |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Array de objetos de linha (nome da coluna → valor) |
| `query` | `.total` | number | Número de linhas retornadas |
| `query` | `.schema` | array | Campos do esquema da tabela |
| `insertRows` | `.insertedCount` | number | Número de linhas inseridas com sucesso |
| `insertRows` | `.errors` | array | Erros de inserção por linha (vazio em caso de sucesso total) |

## Exemplo – Executar uma Consulta

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Acesse a saída: `$getUsers.rows` (array de objetos de linha), `$getUsers.rows[0].email`, `$getUsers.total`.

## Exemplo – Inserir uma Linha

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## Relacionados

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicionar credencial OAuth2 do BigQuery
- [Google Sheets](./google-sheets-node.md) – Padrão OAuth2 semelhante para dados de planilhas
- [Integrações de Terceiros](../reference/integrations.md) – Configuração de credenciais de integração