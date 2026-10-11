# Grist

O nó **Grist** lê, grava e gerencia dados em planilhas do Grist. Utilize-o para operações CRUD, atualizações em lote e automação de planilhas.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `credentialId` | UUID | Credencial do Grist em [Credentials](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operação: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID do documento (a partir da URL do Grist) |
| `gristTableId` | expression | ID da tabela |
| `gristRecordId` | expression | ID do registro (operações de registro único) |
| `gristRecordData` | JSON string | Valores dos campos para criação/atualização. Utilize **IDs de coluna** (ex.: `User_Name`), não rótulos. |
| `gristRecordsData` | JSON string | Array de registros para operações em lote |
| `gristFilter` | JSON string | Filtro: `{"Column_ID": [values]}` |
| `gristSort` | string | Ordenação: `Column_ID` ou `-Column_ID` (decrescente) |
| `gristLimit` | number | Máximo de registros (padrão: 100) |

## IDs de Coluna vs Rótulos

Utilize **IDs de coluna** (com underscores, ex.: `User_Name`) em `gristRecordData` e nos filtros, não os rótulos de exibição. Use `listColumns` para descobrir os IDs das colunas.

## Exemplo – Obter Registros

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## Exemplo – Criar Registro

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## Relacionados

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Credentials Tab](../tabs/credentials-tab.md) – Adicionar chave de API do Grist
- [Third-Party Integrations](../reference/integrations.md#grist) – Configuração da credencial do Grist
