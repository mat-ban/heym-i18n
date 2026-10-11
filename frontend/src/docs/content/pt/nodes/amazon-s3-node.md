# Nó Amazon S3

O nó Amazon S3 lê e grava objetos no [Amazon S3](https://aws.amazon.com/s3/).

## Operações suportadas

- `Create Bucket`: Cria um bucket na região da credencial.
- `Delete Bucket`: Exclui um bucket vazio.
- `List Buckets`: Lista os buckets visíveis para a credencial.
- `Create Folder`: Cria um marcador de pasta vazio (chave de zero bytes terminada em `/`).
- `Delete Folder`: Exclui todos os objetos sob um prefixo de pasta (incluindo chaves aninhadas).
- `Get All in Folder`: Lista todos os metadados de objetos sob um prefixo de pasta (paginação do lado do servidor).
- `Upload Object`: Grava um payload de texto em um bucket/chave.
- `Get Object`: Baixa um objeto e retorna texto decodificado ou conteúdo em base64.
- `Copy Object`: Copia um objeto para outra chave ou bucket.
- `List Objects`: Lista metadados de objetos sob um prefixo (página única, até 1000 chaves; suporta tokens de continuação).
- `Delete Object`: Exclui um único objeto por chave.

## Configuração de credenciais

Crie uma credencial `Amazon S3` na aba Credenciais com:

- Access Key ID
- Secret Access Key
- Region
- Session Token opcional (para credenciais temporárias do AWS STS)

## Campos comuns

- `Bucket`: Nome do bucket de destino (bucket de destino para operações de cópia).
- `Object Key`: Chave de objeto no formato de caminho, como `reports/daily.json`.
- `Folder Path`: Prefixo para operações de pasta (por exemplo, `docs/archive`).
- `Source Bucket`: Bucket de origem opcional para cópia; o padrão é o bucket de destino.
- `Source Object Key`: Chave de origem para operações de cópia.
- `Prefix`: Utilizado por operações de listagem para delimitar os resultados.
- `Continuation Token`: Token opcional proveniente de uma resposta de listagem anterior para buscar a próxima página.
- `Max Keys`: Tamanho da página para List Objects (1–1000).
- `Include Binary`: Quando habilitado em Get Object, retorna `body_base64` em vez de `body_text`.
- `Body`: Conteúdo de texto a ser enviado.
- `Content Type`: Tipo MIME opcional para objetos enviados.

## Exemplos de saída

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## Observações

- `Upload Object` atualmente envia conteúdo de texto em UTF-8.
- `Get Object` pode retornar base64 para arquivos binários ao habilitar a opção binária.
- `Create Bucket` utiliza a região da credencial e requer `s3:CreateBucket`.
- `Delete Bucket` requer que o bucket esteja vazio e necessita de `s3:DeleteBucket`.
- `List Buckets` requer `s3:ListAllMyBuckets`.
- `Create Folder` envia um objeto marcador de zero bytes; o S3 não possui um tipo nativo de diretório.
- `Delete Folder` remove todos os objetos cuja chave começa com o prefixo da pasta; utilize com cautela.
- `Get All in Folder` pagina automaticamente pelo prefixo até que todos os objetos sejam retornados.
- `List Objects` retorna uma página (até 1000 chaves). Quando `truncated` for verdadeiro, passe `next_continuation_token` no campo Continuation Token da próxima chamada.
- `Copy Object` requer `s3:GetObject` na origem e `s3:PutObject` no destino.

## Relacionados

- [Tipos de nós](../reference/node-types.md) – Visão geral de todos os tipos de nós
- [Credenciais](../reference/credentials.md) – Tipos de credenciais e uso
- [Integrações de terceiros](../reference/integrations.md) – Configuração da credencial Amazon S3