# Google Drive

O nó **Google Drive** lista, baixa, atualiza e exclui arquivos e pastas no Google Drive via OAuth2. Ele também pode copiar um arquivo do Drive diretamente para o [Heym Drive](./drive-node.md) com uma única operação.

> **Este não é o nó [Drive](./drive-node.md).** Aquele nó é o *Heym Drive* — o armazenamento de arquivos interno do próprio Heym. Este nó se comunica com o Google Drive. A operação `syncToHeymDrive` é a ponte entre os dois.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | Google Drive (OAuth2) |
| Saída | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial do Google Drive em [Credentials](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operação: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID da pasta ou URL completa da pasta do Drive. Usado por `listFolderFiles` e `removeFolder`. Vazio significa a raiz do Drive. |
| `gdFileId` | expression | ID do arquivo ou URL completa do Drive/Docs. Usado por `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Para `listFolderFiles`: número máximo de arquivos a retornar (padrão 100). Vazio ou `0` carrega a pasta inteira via paginação. Cada arquivo listado inclui `size_bytes` quando o Drive informa um tamanho. |
| `gdQuery` | expression | Para `listFolderFiles`: consulta adicional do Drive combinada com o filtro de pasta via AND, por exemplo `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Para `listFolderFiles`: incluir arquivos na lixeira. Padrão false. |
| `gdExportFormat` | string | Para `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Vazio significa automático. Ignorado para arquivos comuns. |
| `gdFilename` | expression | Para `syncToHeymDrive`: substitui o nome do arquivo armazenado no Heym Drive. |
| `gdBase64Content` | expression | Para `updateFile`: string base64 ou URL `data:` que substitui o conteúdo do arquivo. |
| `gdNewName` | expression | Para `updateFile`: novo nome do arquivo (renomear). |
| `gdNewParentId` | expression | Para `updateFile`: ID ou URL da pasta de destino (mover). |
| `gdPermanentDelete` | boolean | Para `removeFile` / `removeFolder`: quando false (padrão), o item vai para a lixeira e pode ser recuperado; quando true, é destruído. |

## IDs de arquivos e pastas

`gdFileId`, `gdFolderId` e `gdNewParentId` aceitam tanto o **ID puro** quanto uma **URL completa** — o Heym extrai o ID automaticamente. Todos os formatos a seguir funcionam:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets e Slides

Documentos nativos do Google **não possuem bytes para download**. Eles são registros nos servidores do Google, não arquivos — a API do Drive retorna `403 Only files with binary content can be downloaded` se você solicitar o conteúdo bruto deles.

`downloadFile` e `syncToHeymDrive` detectam esses casos automaticamente e **exportam** em vez de baixar, de modo que nenhuma operação falha apenas porque o destino é um Google Doc:

| Origem | Exportação padrão |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Qualquer outro tipo nativo do Google | PDF |

Defina **Export Format** para substituir o destino. A configuração é ignorada para arquivos comuns enviados, que sempre são baixados como estão.

## Operações

| Operação | Obrigatório | Descrição |
|-----------|----------|-------------|
| `listFolderFiles` | — (pasta vazia = raiz) | Lista arquivos em uma pasta, com filtro de consulta opcional |
| `downloadFile` | `gdFileId` | Baixa os bytes do arquivo como base64, exportando documentos nativos automaticamente |
| `syncToHeymDrive` | `gdFileId` | Baixa do Google Drive e armazena o resultado no Heym Drive |
| `updateFile` | `gdFileId` + ao menos um entre conteúdo / nome / pasta | Substitui o conteúdo, renomeia e/ou move |
| `removeFile` | `gdFileId` | Envia para a lixeira (padrão) ou exclui permanentemente um arquivo |
| `removeFolder` | `gdFolderId` | Envia para a lixeira (padrão) ou exclui permanentemente uma pasta e seu conteúdo |

### A exclusão é recuperável por padrão

`removeFile` e `removeFolder` movem o item para a **lixeira do Google Drive**, onde ele pode ser restaurado. Esse é o padrão seguro para algo que pode ser executado em uma agenda ou dentro de um [Loop](./loop-node.md).

Habilitar **Delete permanently** destrói o item sem possibilidade de recuperação. Para `removeFolder`, isso também destrói tudo dentro da pasta.

O nó também verifica o tipo do destino: `removeFile` recusa uma pasta e `removeFolder` recusa um arquivo, de modo que um ID digitado incorretamente não pode excluir silenciosamente o item errado.

### updateFile deixa campos em branco intactos

`updateFile` é uma atualização, não uma substituição. Preencha qualquer combinação de conteúdo, novo nome e nova pasta — o que você deixar vazio não é alterado. Ao menos um dos três é obrigatório.
## Configuração de Credenciais

O Google Drive utiliza um modelo **OAuth2 "Bring Your Own App"**. Você fornece suas próprias credenciais OAuth2 do Google Cloud.

> **Esta credencial concede acesso total ao Drive.** O Heym solicita o escopo `https://www.googleapis.com/auth/drive` porque o nó opera sobre arquivos que você já possui. O escopo mais restrito `drive.file` enxerga apenas os arquivos criados pelo próprio aplicativo, o que tornaria impossível listar, atualizar e excluir seus arquivos existentes. Consulte [Compartilhamento de Credenciais](../reference/credentials-sharing.md) antes de compartilhar esta credencial com uma equipe.

**Configuração do backend:** Defina **`FRONTEND_URL`** no backend do Heym com a URL pública do aplicativo. A URI de redirecionamento do OAuth é sempre `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — ela é derivada apenas dessa configuração, e não dos cabeçalhos da requisição.

1. Acesse o [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → habilite a **Google Drive API**.
2. Acesse **Credentials** → **Create Credentials** → **OAuth client ID** → selecione **Web application**.
3. Em **Authorized redirect URIs**, adicione exatamente `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Copie o **Client ID** e o **Client Secret**.
5. No Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, cole ambos os valores e, em seguida, clique em **Connect** e aprove o acesso na janela popup.

## Saída

### listFolderFiles

```json
{
  "status": "success",
  "operation": "listFolderFiles",
  "folder_id": "1FolderXyz",
  "count": 2,
  "files": [
    {
      "id": "1AbC",
      "name": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 20481,
      "modified_time": "2026-07-01T10:00:00.000Z",
      "web_view_link": "https://drive.google.com/file/d/1AbC/view",
      "is_folder": false
    }
  ]
}
```

`size_bytes` é `null` para pastas e arquivos nativos do Google, que não informam um tamanho.

### downloadFile

```json
{
  "status": "success",
  "operation": "downloadFile",
  "id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "export_format": "pdf",
  "content_base64": "JVBERi0xLjQ..."
}
```

Para um arquivo comum, `exported` é `false` e `export_format` é `null`.

### syncToHeymDrive

```json
{
  "status": "success",
  "operation": "syncToHeymDrive",
  "id": "9f1c2b3d-0000-4000-8000-000000000001",
  "google_file_id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "download_url": "https://your-heym-domain/api/files/dl/TOKEN"
}
```

`id` é o novo ID de arquivo do **Heym Drive**, distinto de `google_file_id`.

### updateFile

```json
{
  "status": "success",
  "operation": "updateFile",
  "id": "1AbC",
  "name": "renamed.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "modified_time": "2026-07-27T10:00:00.000Z",
  "updated": ["content", "name"]
}
```

### removeFile / removeFolder

```json
{
  "status": "success",
  "operation": "removeFile",
  "id": "1AbC",
  "name": "report.pdf",
  "deleted": "trashed"
}
```

`deleted` é `"trashed"` ou `"permanent"`.

## Exemplo: fazer backup de uma pasta do Drive no Heym Drive

1. **[Cron](./cron-node.md)** — executar diariamente.
2. **Google Drive** — `listFolderFiles` na pasta de origem, com `gdQuery` definido como `mimeType='application/pdf'` caso você queira apenas PDFs.
3. **[Loop](./loop-node.md)** — iterar sobre `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` com `gdFileId` definido como `$BackupLoop.item.id` e `gdFilename` definido como `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — publicar um resumo do que foi copiado.

## Observações

- Todos os campos de texto aceitam expressões `$`, portanto IDs e nomes de arquivos podem vir de nós anteriores.
- Drives compartilhados são suportados — o nó define `supportsAllDrives` em todas as requisições.
- Os downloads têm o tamanho verificado em relação à configuração `FILE_MAX_SIZE_MB` do backend.
- Anexe este nó à entrada de ferramentas de um nó [Agent](./agent-node.md) e use o ícone de bot em qualquer campo para permitir que o agente o preencha em tempo de execução.

## Veja Também

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Compartilhamento de Credenciais](../reference/credentials-sharing.md)
