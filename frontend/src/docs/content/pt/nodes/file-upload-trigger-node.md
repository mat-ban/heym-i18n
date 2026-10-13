# Trigger de Upload de Arquivo

O nó **File Upload Trigger** é um ponto de entrada sem entradas para workflows que necessitam de um **arquivo grande** (áudio, vídeo, arquivos compactados) que não pode ser incorporado como base64 dentro de uma requisição JSON. A invocação do workflow retorna um link de upload `curl` pré-preenchido e de uso único; o upload de um arquivo para esse link inicia a execução com o arquivo anexado.

Utilize-o quando um chamador — incluindo um agente de IA como Claude ou ChatGPT em execução em um sandbox — precisar entregar uma gravação de voz de 20 MB ou um vídeo de 75 MB a um workflow do Heym.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 |
| Saídas | 1 |
| Saída | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Como funciona

O nó opera em duas fases:

1. **Emissão.** Quando o workflow é invocado via HTTP (`POST /api/workflows/{id}/execute`), como ferramenta MCP, ou pelo botão **Run Workflow** do canvas, a execução **não** executa o corpo. Em vez disso, emite um slot de upload de uso único e retorna:

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **Upload + execução.** O chamador executa o `curl` com o seu arquivo. O endpoint de upload valida o slot, armazena o arquivo, executa o workflow **de forma síncrona** e retorna a saída do workflow na resposta do upload. O link é de **uso único** — um segundo upload retorna `409`.

No canvas, **Run Workflow** exibe o `curl` emitido no painel de depuração com um botão de cópia.

## Executar a partir do Heym

Dois locais executam diretamente um Workflow deste tipo num ficheiro, através do mesmo processo de geração e carregamento:

- O [Quick Drawer](../reference/quick-drawer.md) apresenta uma zona de largada para o ficheiro. Essas execuções são identificadas como `Quick Drawer` no histórico.
- Um [widget de execução](../tabs/dashboard-tab.md#run-widgets) num painel executa o Workflow em cada ficheiro largado. Essas execuções são identificadas como `dashboard`.

## Parâmetros

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Por quanto tempo o link de upload permanece válido (1–10080 minutos / até 7 dias). |
| `maxSizeMb` | number | `100` | Tamanho máximo de arquivo aceito. O limite absoluto é **100 MB**. |
| `allowedTypes` | string | (vazio) | Lista de permissões opcional de MIME/extensão separada por vírgulas, por exemplo `audio/*, .wav`. Vazio permite qualquer tipo. |

## Campos de saída

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.file.id` | UUID do arquivo armazenado (um arquivo do Drive). |
| `$nodeLabel.file.name` | Nome original do arquivo. |
| `$nodeLabel.file.mime` | Tipo de conteúdo detectado. |
| `$nodeLabel.file.size` | Tamanho em bytes. |
| `$nodeLabel.file.download_url` | URL de download autenticada para nós subsequentes. |
| `$nodeLabel.uploaded_at` | Timestamp ISO do upload. |

## Exemplo

Um workflow de transcrição:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Um agente chama a ferramenta MCP do workflow e recebe o `curl`.
2. O agente executa o `curl` com a gravação do seu sandbox.
3. O upload executa o workflow e a resposta do `curl` contém o resumo da transcrição.

## Segurança

- A URL de upload incorpora um token de alta entropia — o token **é** a capacidade, portanto um agente em sandbox não precisa de credenciais do Heym para fazer o upload. Apenas o hash do token é armazenado no servidor.
- A emissão requer autenticação normal do workflow, portanto apenas chamadores autorizados podem criar links de upload.
- Cada emissão e cada tentativa de upload (aceita ou rejeitada — expirada, reproduzida, tamanho excessivo, tipo não permitido, token desconhecido) é registrada em uma trilha de auditoria somente de acréscimo.
- Os uploads são aplicados como de uso único, limitados por TTL e com limite de tamanho; uploads com tamanho excessivo são rejeitados.

## Observações

- Os canais genéricos de invocação HTTP, MCP e canvas permanecem somente JSON; este nó é a forma suportada de aceitar uploads de arquivos multipart.
- O arquivo enviado é armazenado como um arquivo normal do Drive, portanto qualquer nó subsequente que aceite uma referência de arquivo (transcrição, envio de anexo de e-mail, etc.) pode consumir `$nodeLabel.file`.
