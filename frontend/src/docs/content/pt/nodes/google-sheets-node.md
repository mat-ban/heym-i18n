# Google Sheets

O nó **Google Sheets** lê, grava e gerencia dados em planilhas do Google Sheets via OAuth2. Utilize-o para automatizar workflows de planilhas — leitura de relatórios, registro de resultados, atualização de rastreadores e muito mais.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | Google Sheets (OAuth2) |
| Saída | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial do Google Sheets em [Credenciais](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operação: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID da planilha ou URL completa do Google Sheets |
| `gsSheetName` | expression | Nome da aba da planilha (ex.: `Sheet1`). Não obrigatório para `getSheetInfo`. |
| `gsStartRow` | expression | Para `readRange`: primeira linha de dados com base em 1 (com `gsHasHeader`, a linha 1 é o cabeçalho). |
| `gsMaxRows` | expression | Para `readRange`: número máximo de linhas de dados (0 = todas). |
| `gsHasHeader` | boolean | Para `readRange`: tratar a linha 1 como nomes de colunas quando verdadeiro. |
| `gsUpdateRow` | expression | Apenas para `updateRange`: número da linha da planilha com base em 1 a ser atualizada (colunas A–Z); se não definido, utiliza-se `gsStartRow`. Não é batchUpdate — é um único PUT da API values. |
| `gsRange` | expression | Intervalo em notação A1 (ex.: `A1:D100`). Exemplos legados; o editor utiliza campos de linha para leitura/atualização. |
| `gsKeepHeader` | boolean | Apenas para `clearRange`: quando verdadeiro, a linha 1 é mantida e as linhas de dados abaixo são limpas (colunas A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Apenas para `appendRows`: **Bottom** adiciona após a última linha com dados; **Top** insere novas linhas diretamente sob a linha 1 (desloca os dados para baixo). |
| `gsValuesInputMode` | `raw` \| `selective` | Para `appendRows` / `updateRange`: **Raw** = array JSON completo; **Selective** = uma linha da planilha, apenas campos de coluna (sem rótulos A1). |
| `gsValuesSelectiveCols` | string | Modo Selective: número de colunas (A–Z). |
| `gsValues` | expression | Array JSON 2D de valores (ex.: `[["Name","Age"],["Alice",30]]`). Obrigatório para `appendRows`, `updateRange`. |

## ID da planilha

O campo `gsSpreadsheetId` aceita tanto o **ID puro** (a longa sequência alfanumérica entre `/d/` e `/edit` em uma URL do Google Sheets) quanto a **URL completa** — o Heym extrai o ID automaticamente.

## Configuração da credencial

O Google Sheets utiliza um modelo **OAuth2 "Bring Your Own App"**. Você fornece suas próprias credenciais OAuth2 do Google Cloud.

**Configuração do backend:** Defina **`FRONTEND_URL`** no backend do Heym com a URL pública do aplicativo (o endereço que os usuários digitam no navegador), por exemplo `https://your-heym-domain`. O URI de redirecionamento OAuth é sempre `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — ele é derivado apenas dessa configuração, não dos cabeçalhos da requisição.

1. Acesse o [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → habilite a **Google Sheets API**.
2. Acesse **Credentials** → **Create Credentials** → **OAuth client ID** → selecione **Web application**.
3. Em **Authorized redirect URIs**, adicione exatamente: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (por exemplo `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Copie o **Client ID** e o **Client Secret**.
5. No Heym Dashboard → **Credentials** → **New** → selecione **Google Sheets (OAuth2)**.
6. Insira o Client ID, o Client Secret e um nome, depois clique em **Connect** para concluir o consentimento OAuth2 em um popup do navegador.

Os tokens são renovados automaticamente em segundo plano — nenhum gerenciamento manual de token é necessário.

## Operações

| Operação | Campos obrigatórios | Descrição |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Lê valores de células (A–Z); `gsRange` opcional em fluxos legados |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Adiciona linhas na parte inferior (`gsAppendPlacement` append) ou sob a linha 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Sobrescreve linha(s) a partir de `gsUpdateRow` (A–Z); JSON com múltiplas linhas grava linhas consecutivas |
| `clearRange` | gsSpreadsheetId, gsSheetName | Limpa todos os valores nas colunas A–Z da aba; o `gsKeepHeader` opcional mantém a primeira linha |
| `getSheetInfo` | gsSpreadsheetId | Obtém o título da planilha e a lista de abas |
## Referência de Saída

| Operação | Campo de saída | Tipo | Descrição |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Objetos de linha: chaves de coluna (nomes de cabeçalho ou A, B, …) mais **`rowIndex`** (linha da planilha, baseada em 1) |
| `readRange` | `.total` | number | Número de linhas de dados retornadas |
| `appendRows` | `.updatedRange` | string | Intervalo gravado |
| `appendRows` | `.updates` | number | Número de linhas anexadas |
| `updateRange` | `.updatedRange` | string | Intervalo gravado |
| `updateRange` | `.updatedCells` | number | Número de células atualizadas |
| `clearRange` | `.clearedRange` | string | Intervalo que foi limpo |
| `getSheetInfo` | `.title` | string | Título da planilha |
| `getSheetInfo` | `.sheets` | array | Lista de objetos `{sheetId, title}` |

Todas as operações incluem `success: true` e `operation: "<name>"` na saída.

## Exemplo – Ler um Intervalo

```json
{
  "type": "googleSheets",
  "data": {
    "label": "readReport",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "readRange",
    "gsSpreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "gsSheetName": "Sheet1",
    "gsRange": "A1:D100"
  }
}
```

Acessar a saída: `$readReport.rows[0]` (primeiro objeto de linha de dados), `$readReport.rows[0].Name` (coluna por cabeçalho), `$readReport.rows[0].rowIndex` (linha da planilha, baseada em 1).

## Exemplo – Anexar uma Linha a partir da Entrada

```json
{
  "type": "googleSheets",
  "data": {
    "label": "logEntry",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "appendRows",
    "gsSpreadsheetId": "$input.spreadsheetUrl",
    "gsSheetName": "Log",
    "gsValues": "[[\"$input.name\", \"$input.email\", \"$input.timestamp\"]]"
  }
}
```

## Relacionados

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicionar credencial OAuth2 do Google Sheets
- [Integrações de Terceiros](../reference/integrations.md#google-sheets-oauth2) – Configuração da credencial do Google Sheets
