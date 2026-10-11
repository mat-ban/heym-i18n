# Drive

O nó **Drive** gerencia arquivos gerados por skills diretamente dentro de um workflow. Utilize-o para recuperar arquivos, baixar arquivos de URLs externas, excluí-los, compartilhá-los ou descompartilhá-los com suas equipes, ou atualizar suas restrições de acesso (senha, expiração, limite de downloads) de forma programática.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (varia conforme a operação) |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `driveOperation` | string | Operação: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID do arquivo do Drive a ser gerenciado (todas as operações, exceto `getAll`, `downloadUrl` e `save`) |
| `driveLimit` | number | Número máximo de arquivos a retornar (somente `getAll`; vazio significa sem limite) |
| `driveSourceUrl` | expression | URL a ser buscada e armazenada no Drive (somente `downloadUrl`) |
| `driveFilename` | expression | Nome completo do arquivo, incluindo a extensão (somente `save`, ex.: `1.mp3`) |
| `driveBase64Content` | expression | String base64 bruta ou data URL a ser decodificada e armazenada (somente `save`) |
| `driveIncludeBinary` | boolean | Incluir o conteúdo do arquivo como base64 na saída (somente `get`) |
| `drivePassword` | expression | Senha a ser definida no token de acesso (somente `setPassword`) |
| `driveTtlHours` | number | Horas até o link de download expirar (somente `setTtl`) |
| `driveMaxDownloads` | number | Número máximo de downloads permitidos (somente `setMaxDownloads`) |

## Obtendo o File ID

Quando uma skill gera arquivos, a saída inclui um array `_generated_files`. Cada entrada inclui um campo `id`:

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 45231,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

Referencie o file ID com: `$agentLabel._generated_files[0].id`

## Operações

| Operação | Campos Obrigatórios | Descrição |
|-----------|----------------|-------------|
| `get` | driveFileId | Recupera os metadados do arquivo (e, opcionalmente, o conteúdo binário) do Drive |
| `getAll` | nenhum | Lista os arquivos do Drive próprios e compartilhados com equipes que sejam legíveis, com metadados como nome do arquivo, tipo MIME, tamanho, origem e URL de download |
| `downloadUrl` | driveSourceUrl | Busca um arquivo de uma URL externa e o armazena no Drive |
| `save` | driveFilename, driveBase64Content | Decodifica o conteúdo base64 e o armazena como um arquivo do Drive |
| `delete` | driveFileId | Exclui o arquivo e todos os seus tokens de acesso do disco e do banco de dados |
| `setPassword` | driveFileId, drivePassword | Substitui o token público padrão por um protegido por senha |
| `setTtl` | driveFileId, driveTtlHours | Substitui o token público padrão por um que expira após N horas |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Substitui o token público padrão por um limitado a N downloads |
| `shareWithMyTeams` | driveFileId | Compartilha o arquivo em modo somente leitura com todas as equipes às quais o proprietário do workflow pertence atualmente |
| `unshareWithMyTeams` | driveFileId | Remove todos os compartilhamentos de equipe do arquivo |

> **Observação:** As operações `set*` excluem o token público padrão (sem restrições) e criam um novo com a restrição especificada. O `download_url` atualizado é incluído na saída.
> **Compartilhamento com equipes:** `shareWithMyTeams` cria compartilhamentos explícitos para as equipes atuais do proprietário. Equipes futuras não são adicionadas automaticamente, a menos que a operação seja executada novamente. `unshareWithMyTeams` remove todos os compartilhamentos de equipe do arquivo.

## Exemplo — Baixar Arquivo de uma URL

```json
{
  "type": "drive",
  "data": {
    "label": "fetchReport",
    "driveOperation": "downloadUrl",
    "driveSourceUrl": "https://example.com/reports/q1.pdf"
  }
}
```

Referencie o arquivo armazenado em etapas posteriores: `$fetchReport.id`, `$fetchReport.download_url`

O nome do arquivo é obtido do cabeçalho de resposta `Content-Disposition`; caso esteja ausente, é derivado do caminho da URL.

## Exemplo — Salvar Entrada Base64 no Drive

Use isto quando um nó de entrada de texto (ou qualquer nó anterior) fornecer conteúdo de arquivo em base64:

```json
{
  "type": "drive",
  "data": {
    "label": "saveAudio",
    "driveOperation": "save",
    "driveFilename": "$userInput.body.filename",
    "driveBase64Content": "$userInput.body.base64"
  }
}
```

Referencie o arquivo armazenado em etapas posteriores: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` aceita uma string base64 bruta ou uma data URL `data:...;base64,...`. O tipo MIME é inferido a partir da extensão do nome do arquivo.

## Exemplo — Obter Arquivo e Usar Binário em Vision LLM

```json
{
  "type": "drive",
  "data": {
    "label": "fetchImage",
    "driveOperation": "get",
    "driveFileId": "550e8400-e29b-41d4-a716-446655440000",
    "driveIncludeBinary": true
  }
}
```

Referencie o conteúdo base64 em etapas posteriores: `$fetchImage.file_base64`

Imagens retornadas via `file_base64` são exibidas inline no painel de depuração quando você executa o workflow.

## Exemplo — Listar Arquivos do Drive

```json
{
  "type": "drive",
  "data": {
    "label": "listFiles",
    "driveOperation": "getAll",
    "driveLimit": 50
  }
}
```

Referencie o primeiro arquivo retornado em etapas posteriores: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Exemplo — Excluir Arquivo Após o Processamento

```json
{
  "type": "drive",
  "data": {
    "label": "cleanup",
    "driveOperation": "delete",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Exemplo — Definir Senha no Arquivo Gerado

```json
{
  "type": "drive",
  "data": {
    "label": "protectFile",
    "driveOperation": "setPassword",
    "driveFileId": "$generateReport._generated_files[0].id",
    "drivePassword": "$input.password"
  }
}
```

## Exemplo — Definir Expiração (TTL)

```json
{
  "type": "drive",
  "data": {
    "label": "expireFile",
    "driveOperation": "setTtl",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveTtlHours": 24
  }
}
```

## Exemplo — Limitar Downloads

```json
{
  "type": "drive",
  "data": {
    "label": "limitDownloads",
    "driveOperation": "setMaxDownloads",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveMaxDownloads": 3
  }
}
```

## Exemplo — Compartilhar Com Minhas Equipes

```json
{
  "type": "drive",
  "data": {
    "label": "shareReport",
    "driveOperation": "shareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

Os membros da equipe podem visualizar e baixar o arquivo pelo Drive e utilizar operações de leitura em workflows. Eles não podem excluir, recompartilhar ou alterar as restrições do link público.

## Exemplo — Cancelar Compartilhamento Com Minhas Equipes

```json
{
  "type": "drive",
  "data": {
    "label": "unshareReport",
    "driveOperation": "unshareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Convertendo um arquivo

A conversão de formato foi movida para o nó [Converter](./converter-node.md). Armazene ou obtenha o arquivo com o Drive e, em seguida, passe seu id para um nó converter:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

O arquivo original é preservado e o arquivo convertido é armazenado como um novo arquivo no Drive.

## Acesso à Saída

**get:**
- `$nodeLabel.id` — UUID do arquivo
- `$nodeLabel.filename` — nome do arquivo
- `$nodeLabel.mime_type` — tipo MIME (ex.: `image/png`)
- `$nodeLabel.size_bytes` — tamanho do arquivo em bytes
- `$nodeLabel.download_url` — URL pública de download
- `$nodeLabel.file_base64` — conteúdo do arquivo codificado em base64 (somente quando **Include binary content** está habilitado)

**getAll:**
- `$nodeLabel.files` — Array de objetos de metadados de arquivos
- `$nodeLabel.count` — Número de arquivos retornados
- `$nodeLabel.files[0].id` — UUID do arquivo
- `$nodeLabel.files[0].filename` — Nome do arquivo
- `$nodeLabel.files[0].mime_type` — Tipo MIME
- `$nodeLabel.files[0].size_bytes` — Tamanho do arquivo em bytes
- `$nodeLabel.files[0].download_url` — URL pública de download quando existe um token público
- `$nodeLabel.files[0].metadata` — Objeto de metadados armazenado
- `$nodeLabel.files[0].created_at` — Timestamp de criação do arquivo

**downloadUrl:**
- `$nodeLabel.id` — UUID do arquivo recém-armazenado
- `$nodeLabel.filename` — nome do arquivo (a partir de `Content-Disposition` ou do caminho da URL)
- `$nodeLabel.mime_type` — tipo MIME detectado a partir da resposta ou da extensão do arquivo
- `$nodeLabel.size_bytes` — tamanho do arquivo em bytes
- `$nodeLabel.download_url` — URL de download do Drive para o arquivo armazenado

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID do arquivo excluído

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID do arquivo
- `$nodeLabel.download_url` — Nova URL de token de acesso com a restrição aplicada

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID do arquivo
- `$nodeLabel.shared_team_count` — Número de compartilhamentos com equipes após a operação

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID do arquivo
- `$nodeLabel.shared_team_count` — `0` após a operação

## Propriedade

As operações exclusivas do proprietário exigem que o arquivo pertença ao proprietário do workflow. As operações de leitura (`get`, `getAll`) também podem acessar arquivos compartilhados com o proprietário do workflow por meio de uma equipe.

## Relacionados

- [File Generation](../reference/file-generation.md) - Como as skills geram arquivos e a saída `_generated_files`
- [Drive Tab](../reference/drive.md) - Gerenciamento visual de arquivos no dashboard
- [Agent Node](./agent-node.md) - Executa skills que geram arquivos
- [Converter Node](./converter-node.md) - Converte um arquivo armazenado para outro formato, ou aplica OCR para texto
- [Expression DSL](../reference/expression-dsl.md) - Sintaxe de expressão para valores dinâmicos
