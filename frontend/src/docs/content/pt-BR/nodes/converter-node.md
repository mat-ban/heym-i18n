# Conversor

O nó **Converter** converte dados e arquivos entre formatos sem escrever código. Ele é neutro em relação à tecnologia, de modo que mais formatos podem ser adicionados ao longo do tempo. Ele converte dados CSV, JSON e XML em ambas as direções, executa o Tesseract OCR para extrair texto de imagens e PDFs, e reescreve um arquivo armazenado em outro formato.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.result` (dados analisados para `csvToJson` / `xmlToJson`, texto para `jsonToCsv` / `jsonToXml`, texto extraído para `imageToText` / `pdfToText`, novos metadados de arquivo para `fileConvert`) |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `conversion` | string | `csvToJson` (texto CSV → array de objetos de linha), `jsonToCsv` (array de objetos/linhas → texto CSV), `xmlToJson` (texto XML → objeto), `jsonToXml` (objeto → texto XML), `imageToText` (OCR em uma imagem), `pdfToText` (OCR em cada página selecionada do PDF), ou `fileConvert` (reescreve um arquivo armazenado em outro formato) |
| `source` | expression | Os dados a serem convertidos. Deixe vazio para usar a primeira entrada do nó |
| `delimiter` | string | Separador de campo de caractere único (padrão `,`) |
| `hasHeader` | boolean | Apenas `csvToJson` — trata a primeira linha como cabeçalho (padrão `true`) |
| `trimValues` | boolean | Apenas `csvToJson` — remove espaços em branco ao redor dos nomes de cabeçalho e valores das células (padrão `true`) |
| `includeHeader` | boolean | Apenas `jsonToCsv` — escreve uma linha de cabeçalho (padrão `true`) |
| `converterColumns` | string | Apenas `jsonToCsv` — ordem de colunas opcional separada por vírgulas |
| `converterFileId` | expression | Conversões de arquivo — o arquivo do Heym Drive a ser lido, por exemplo `$Upload.file.id` |
| `converterTargetFormat` | string | Apenas `fileConvert` — formato de saída (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Apenas OCR — `auto` (padrão), um código Tesseract como `tur`, ou `custom` |
| `ocrLanguageCustom` | string | Apenas OCR — códigos de idioma usados quando `ocrLanguage` é `custom`, por exemplo `eng+tur` |
| `ocrEncoding` | string | Apenas OCR — conjunto de caracteres para o qual o texto é normalizado (padrão `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Apenas OCR — aplica normalização NFC (padrão `true`) |
| `ocrPsm` | string | Apenas OCR — modo de segmentação de página do Tesseract (padrão `3`) |
| `ocrDpi` | number | Apenas `pdfToText` — DPI de rasterização da página (padrão `300`) |
| `ocrPageRange` | expression | Apenas `pdfToText` — `3` ou `2-5`. Vazio significa todas as páginas |

## Comportamento

- **`csvToJson`** analisa o texto CSV de origem. Com `hasHeader: true`, cada linha se torna um objeto com chaves baseadas nos valores do cabeçalho; com `hasHeader: false`, cada linha se torna um array de valores de células. Campos entre aspas, delimitadores incorporados e quebras de linha incorporadas são tratados conforme a RFC 4180. Um BOM UTF-8 inicial (comum em exportações do Excel) é removido, e nomes de cabeçalho duplicados são tornados únicos sem sobrescrever uma coluna real (`a, a, a_2` → `a`, `a_3`, `a_2`). Defina `delimiter` como `\t` para analisar valores separados por tabulação.
- **`trimValues`** (padrão `true`) remove espaços em branco ao redor dos nomes de cabeçalho e valores das células, **inclusive dentro de campos entre aspas** (`" padded "` → `padded`). A RFC 4180 trata espaços em branco entre aspas como dados, portanto defina `trimValues: false` para preservá-los exatamente.
- **`jsonToCsv`** constrói texto CSV a partir de um array de objetos (ou arrays). A ordem das colunas é obtida de `converterColumns` quando fornecido, caso contrário é inferida a partir das chaves do primeiro objeto. Valores que contenham o delimitador, aspas ou quebras de linha são colocados entre aspas automaticamente.
- **`xmlToJson`** analisa XML em um objeto. Atributos usam prefixos `@` e texto misturado com atributos usa `#text`; elementos irmãos repetidos se tornam arrays. A expansão de entidades XML está desabilitada.
- **`jsonToXml`** serializa um objeto em um documento XML. O objeto deve ter exatamente uma chave de nível superior, que se torna o elemento raiz do XML. Use a mesma convenção `@attribute` e `#text` do `xmlToJson` para produzir atributos e texto junto com elementos filhos.
- **`imageToText`** executa o Tesseract sobre uma única imagem (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasteriza cada página selecionada em `ocrDpi` e a reconhece. Todas as páginas passam por OCR, portanto um PDF digital com uma camada de texto perfeitamente boa ainda é relido a partir dos pixels. Isso mantém documentos digitalizados e digitais se comportando de forma idêntica, ao custo de velocidade, então restrinja `ocrPageRange` em arquivos longos.
- **`fileConvert`** reescreve o arquivo de origem em outro formato e armazena o resultado como um **novo** arquivo no Drive. O original nunca é modificado. Documentos passam pelo pandoc, imagens pelo Pillow, e JSON para CSV pelo escritor csv do Python. Uma imagem não pode se tornar um documento e um documento não pode se tornar uma imagem; para extrair texto de uma imagem, use `imageToText`.

## Obtendo o arquivo de entrada

As conversões de arquivo leem do Heym Drive, não de um caminho ou de uma URL, portanto o arquivo precisa ser armazenado primeiro. Três cadeias comuns:

- **[Trigger de upload de arquivo](./file-upload-trigger-node.md) → Converter** — aponte `converterFileId` para `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — busque um arquivo remoto para o Drive, depois passe `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — uma skill que escreve um arquivo o expõe como `$reportAgent._generated_files[0].id`.

`converterFileId` também aceita um objeto de arquivo completo (`$Upload.file`) ou uma URL de download do Heym; o id do arquivo é extraído de qualquer um dos dois. O arquivo deve ser de sua propriedade ou ter sido compartilhado com você por um colega de equipe.
## Idiomas

`auto` (o padrão) executa primeiro a detecção de orientação e script do Tesseract e, em seguida, escolhe o melhor modelo instalado para o script detectado. Modelos de script como `Latin` ou `Cyrillic` leem todos os idiomas escritos nesse script, e é por isso que o modo auto lida com uma fatura em turco e uma em inglês sem que seja necessário informar qual é qual.

Nomear o idioma ainda é mais preciso quando você o conhece. Use um único código (`tur`) ou combine vários com `+` (`eng+tur`) para documentos mistos — mais idiomas significa reconhecimento mais lento e ligeiramente mais ruidoso, portanto mantenha a lista curta. Os códigos só funcionam quando os dados do idioma correspondente estão instalados no backend; o nó lista o que está disponível quando você seleciona um código ausente.

Toda imagem do Heym inclui `osd`, inglês, turco, alemão, francês, espanhol, italiano, português, holandês, russo, árabe, chinês simplificado, japonês, coreano e os modelos de script Latin, Cyrillic, Arabic, HanS, Japanese e Hangul.

## Codificação

O texto reconhecido é UTF-8 e preserva todos os caracteres produzidos pelo Tesseract. `ocrNormalizeUnicode` (ativado por padrão) aplica a normalização NFC, de modo que uma letra escrita como `s` mais uma cedilha combinante se torna um único `ş` — vale a pena mantê-lo ativado, pois as duas formas não são iguais em comparações ou consultas a banco de dados.

`ocrEncoding` importa apenas quando algo a jusante não consegue armazenar toda a faixa Unicode. Selecionar `cp1254` ou `iso-8859-9` mantém o texto em turco intacto e garante que o resultado caiba nesse charset; `latin-1` e `ascii` são mais restritos e substituem o que não conseguem representar por `?`. Mantenha `utf-8` a menos que um sistema de destino o obrigue a mudar.

## Saída

`csvToJson`, `jsonToCsv`, `xmlToJson` e `jsonToXml` retornam `$label.result` e `$label.conversion`. As conversões de OCR adicionam:

| Campo | Descrição |
|-------|-------------|
| `$label.result` | O texto completo extraído, com as páginas unidas por uma linha em branco |
| `$label.language` | O modelo que de fato foi executado (útil para ver o que o `auto` escolheu) |
| `$label.encoding` | O charset para o qual o texto foi normalizado |
| `$label.page_count` | Número de páginas reconhecidas |
| `$label.pages` | Array de `{ page, text }` para tratamento por página |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` do arquivo de origem |

`fileConvert` retorna o novo arquivo:

| Campo | Descrição |
|-------|-------------|
| `$label.id` | UUID do arquivo recém-armazenado |
| `$label.filename` | Nome do arquivo convertido, com o nome base mantido e a extensão trocada |
| `$label.mime_type` | Tipo MIME do novo arquivo |
| `$label.size_bytes` | Tamanho do novo arquivo |
| `$label.download_url` | URL de download do Drive para o novo arquivo |
| `$label.source_file` | Metadados do arquivo que foi convertido |

## Exemplo

```json
{
  "type": "converter",
  "data": {
    "label": "toRows",
    "conversion": "csvToJson",
    "source": "$userInput.body.text",
    "delimiter": ",",
    "hasHeader": true
  }
}
```

Para a entrada `name,age\nAda,36`, os nós a jusante acessam as linhas analisadas por meio de `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Convertendo XML para JSON:

```json
{
  "type": "converter",
  "data": {
    "label": "xmlToObject",
    "conversion": "xmlToJson",
    "source": "$webhook.body"
  }
}
```

Para `<person id="1"><name>Ada</name></person>`, `$xmlToObject.result` é `{ "person": { "@id": "1", "name": "Ada" } }`. Para criar XML, passe esse objeto para um segundo nó Converter com `conversion: "jsonToXml"`.

Lendo uma fatura digitalizada enviada por meio de um trigger de upload de arquivo:

```json
{
  "type": "converter",
  "data": {
    "label": "readInvoice",
    "conversion": "pdfToText",
    "converterFileId": "$Upload.file.id",
    "ocrLanguage": "tur",
    "ocrEncoding": "utf-8",
    "ocrDpi": 300,
    "ocrPageRange": "1-3"
  }
}
```

Um nó [Agent](./agent-node.md) ou [LLM](./llm-node.md) a jusante pode então extrair campos estruturados de `$readInvoice.result`.

Transformando um relatório em markdown de um agente em PDF:

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

Os nós a jusante leem `$convertDoc.download_url` para compartilhar o PDF, ou `$convertDoc.id` para continuar trabalhando com ele no [Drive](./drive-node.md).

## Requisitos

O OCR invoca `tesseract` e o `pdftoppm` do poppler, e a conversão de documentos usa o pandoc. Todos os três acompanham todas as formas de executar o Heym, incluindo `run.sh`, docker-compose e a imagem de release única, portanto não há nada a configurar. Limites de páginas, timeouts e o DPI máximo são valores fixos da plataforma, e não configurações.

## Relacionados

- [Set](./set-node.md) – Transforma e mapeia campos individuais
- [JSON output mapper](./json-output-mapper-node.md) – Constrói um objeto de resposta JSON
- [File upload trigger](./file-upload-trigger-node.md) – Aceita um arquivo no Heym Drive
- [Drive](./drive-node.md) – Armazena, busca e compartilha arquivos
- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Expression DSL](../reference/expression-dsl.md) – Funções e sintaxe
