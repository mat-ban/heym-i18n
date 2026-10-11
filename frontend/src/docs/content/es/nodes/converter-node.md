# Converter

El nodo **Converter** convierte datos y archivos entre formatos sin escribir código. Es neutral respecto a la tecnología, por lo que se pueden añadir más formatos con el tiempo. Convierte datos CSV, JSON y XML en ambas direcciones, ejecuta Tesseract OCR para extraer texto de imágenes y PDF, y reescribe un archivo almacenado en otro formato.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.result` (datos analizados para `csvToJson` / `xmlToJson`, texto para `jsonToCsv` / `jsonToXml`, texto extraído para `imageToText` / `pdfToText`, metadatos del nuevo archivo para `fileConvert`) |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `conversion` | string | `csvToJson` (texto CSV → array de objetos de fila), `jsonToCsv` (array de objetos/filas → texto CSV), `xmlToJson` (texto XML → objeto), `jsonToXml` (objeto → texto XML), `imageToText` (OCR de una imagen), `pdfToText` (OCR de cada página seleccionada del PDF) o `fileConvert` (reescribir un archivo almacenado en otro formato) |
| `source` | expression | Los datos que se van a convertir. Déjelo vacío para usar la primera entrada del nodo |
| `delimiter` | string | Separador de campos de un solo carácter (predeterminado `,`) |
| `hasHeader` | boolean | Solo `csvToJson` — tratar la primera fila como encabezado (predeterminado `true`) |
| `trimValues` | boolean | Solo `csvToJson` — eliminar los espacios en blanco alrededor de los nombres de encabezado y los valores de celda (predeterminado `true`) |
| `includeHeader` | boolean | Solo `jsonToCsv` — escribir una fila de encabezado (predeterminado `true`) |
| `converterColumns` | string | Solo `jsonToCsv` — orden de columnas opcional separado por comas |
| `converterFileId` | expression | Conversiones de archivos — el archivo de Heym Drive que se va a leer, por ejemplo `$Upload.file.id` |
| `converterTargetFormat` | string | Solo `fileConvert` — formato de salida (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Solo OCR — `auto` (predeterminado), un código de Tesseract como `tur`, o `custom` |
| `ocrLanguageCustom` | string | Solo OCR — códigos de idioma utilizados cuando `ocrLanguage` es `custom`, por ejemplo `eng+tur` |
| `ocrEncoding` | string | Solo OCR — conjunto de caracteres al que se normaliza el texto (predeterminado `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Solo OCR — aplicar normalización NFC (predeterminado `true`) |
| `ocrPsm` | string | Solo OCR — modo de segmentación de página de Tesseract (predeterminado `3`) |
| `ocrDpi` | number | Solo `pdfToText` — DPI de rasterización de página (predeterminado `300`) |
| `ocrPageRange` | expression | Solo `pdfToText` — `3` o `2-5`. Vacío significa todas las páginas |

## Comportamiento

- **`csvToJson`** analiza el texto CSV de origen. Con `hasHeader: true`, cada fila se convierte en un objeto cuyas claves son los valores del encabezado; con `hasHeader: false`, cada fila se convierte en un array de valores de celda. Los campos entrecomillados, los delimitadores incrustados y los saltos de línea incrustados se gestionan según RFC 4180. Se elimina un BOM UTF-8 inicial (habitual en las exportaciones de Excel) y los nombres de encabezado duplicados se hacen únicos sin sobrescribir una columna real (`a, a, a_2` → `a`, `a_3`, `a_2`). Establezca `delimiter` en `\t` para analizar valores separados por tabulaciones.
- **`trimValues`** (predeterminado `true`) elimina los espacios en blanco circundantes de los nombres de encabezado y los valores de celda, **incluso dentro de campos entrecomillados** (`" padded "` → `padded`). RFC 4180 trata los espacios en blanco entrecomillados como datos, por lo que debe establecer `trimValues: false` para conservarlos exactamente.
- **`jsonToCsv`** genera texto CSV a partir de un array de objetos (o arrays). El orden de las columnas se toma de `converterColumns` cuando se proporciona; de lo contrario, se infiere de las claves del primer objeto. Los valores que contienen el delimitador, comillas o saltos de línea se entrecomillan automáticamente.
- **`xmlToJson`** analiza XML en un objeto. Los atributos usan el prefijo `@` y el texto mezclado con atributos usa `#text`; los elementos hermanos repetidos se convierten en arrays. La expansión de entidades XML está deshabilitada.
- **`jsonToXml`** serializa un objeto a un documento XML. El objeto debe tener exactamente una clave de nivel superior, que se convierte en el elemento raíz de XML. Utilice la misma convención `@attribute` y `#text` que en `xmlToJson` para producir atributos y texto junto con los elementos secundarios.
- **`imageToText`** ejecuta Tesseract sobre una única imagen (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasteriza cada página seleccionada a `ocrDpi` y la reconoce. Todas las páginas pasan por OCR, por lo que un PDF digital con una capa de texto perfectamente válida se vuelve a leer a partir de los píxeles. Esto hace que los documentos escaneados y los digitales se comporten de forma idéntica, a costa de la velocidad, por lo que conviene acotar `ocrPageRange` en archivos largos.
- **`fileConvert`** reescribe el archivo de origen en otro formato y almacena el resultado como un archivo de Drive **nuevo**. El original nunca se modifica. Los documentos pasan por pandoc, las imágenes por Pillow y la conversión de JSON a CSV por el escritor csv de Python. Una imagen no puede convertirse en un documento ni un documento en una imagen; para extraer texto de una imagen, utilice `imageToText`.
## Obtención del archivo

Las conversiones de archivos leen desde Heym Drive, no desde una ruta o una URL, por lo que el archivo debe almacenarse primero. Tres cadenas comunes:

- **[Trigger de carga de archivos](./file-upload-trigger-node.md) → Converter** — apunte `converterFileId` a `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — obtenga un archivo remoto en Drive y luego pase `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — una skill que escribe un archivo lo expone como `$reportAgent._generated_files[0].id`.

`converterFileId` también acepta un objeto de archivo completo (`$Upload.file`) o una URL de descarga de Heym; el id del archivo se extrae de cualquiera de los dos. El archivo debe ser uno de su propiedad o uno que un compañero de equipo haya compartido con usted.

## Idiomas

`auto` (el valor predeterminado) ejecuta primero la detección de orientación y escritura de Tesseract, y luego selecciona el mejor modelo instalado para la escritura detectada. Los modelos de escritura como `Latin` o `Cyrillic` leen todos los idiomas escritos en esa escritura, por lo que auto gestiona una factura en turco y una en inglés sin que se le indique cuál es cuál.

Nombrar el idioma sigue siendo más preciso cuando usted lo conoce. Utilice un único código (`tur`), o una varios con `+` (`eng+tur`) para documentos mixtos — más idiomas implica un reconocimiento más lento y ligeramente más ruidoso, así que mantenga la lista corta. Los códigos solo funcionan cuando los datos del idioma correspondiente están instalados en el backend; el nodo lista lo que está disponible cuando selecciona uno que falta.

Cada imagen de Heym incluye `osd`, inglés, turco, alemán, francés, español, italiano, portugués, neerlandés, ruso, árabe, chino simplificado, japonés, coreano, y los modelos de escritura Latin, Cyrillic, Arabic, HanS, Japanese y Hangul.

## Codificación

El texto reconocido es UTF-8 y conserva cada carácter que Tesseract produjo. `ocrNormalizeUnicode` (activado por defecto) aplica normalización NFC, por lo que una letra escrita como `s` más una cedilla combinante se convierte en una única `ş` — conviene dejarlo activado, porque las dos formas no son iguales en comparaciones ni en búsquedas de base de datos.

`ocrEncoding` solo importa cuando algo en sentido descendente no puede almacenar el rango Unicode completo. Seleccionar `cp1254` o `iso-8859-9` mantiene el texto turco intacto y garantiza que el resultado quepa en ese conjunto de caracteres; `latin-1` y `ascii` son más limitados y reemplazan lo que no pueden representar con `?`. Deje `utf-8` a menos que un sistema de destino le obligue a cambiarlo.

## Salida

`csvToJson`, `jsonToCsv`, `xmlToJson` y `jsonToXml` devuelven `$label.result` y `$label.conversion`. Las conversiones OCR añaden:

| Campo | Descripción |
|-------|-------------|
| `$label.result` | El texto extraído completo, con las páginas unidas por una línea en blanco |
| `$label.language` | El modelo que realmente se ejecutó (útil para ver qué eligió `auto`) |
| `$label.encoding` | El conjunto de caracteres al que se normalizó el texto |
| `$label.page_count` | Número de páginas reconocidas |
| `$label.pages` | Array de `{ page, text }` para el manejo por página |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` del archivo de origen |

`fileConvert` devuelve el nuevo archivo en su lugar:

| Campo | Descripción |
|-------|-------------|
| `$label.id` | UUID del archivo recién almacenado |
| `$label.filename` | Nombre de archivo convertido, con el nombre base conservado y la extensión intercambiada |
| `$label.mime_type` | Tipo MIME del nuevo archivo |
| `$label.size_bytes` | Tamaño del nuevo archivo |
| `$label.download_url` | URL de descarga de Drive para el nuevo archivo |
| `$label.source_file` | Metadatos del archivo que se convirtió |

## Ejemplo

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

Para la entrada `name,age\nAda,36`, los nodos en sentido descendente acceden a las filas analizadas mediante `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Conversión de XML a JSON:

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

Para `<person id="1"><name>Ada</name></person>`, `$xmlToObject.result` es `{ "person": { "@id": "1", "name": "Ada" } }`. Para crear XML, pase ese objeto a un segundo nodo Converter con `conversion: "jsonToXml"`.

Lectura de una factura escaneada cargada mediante un trigger de carga de archivos:

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

Un nodo [Agent](./agent-node.md) o [LLM](./llm-node.md) en sentido descendente puede entonces extraer campos estructurados de `$readInvoice.result`.

Conversión del informe en markdown de un agente a PDF:

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

Los nodos en sentido descendente leen `$convertDoc.download_url` para compartir el PDF, o `$convertDoc.id` para seguir trabajando con él en [Drive](./drive-node.md).
## Requisitos

El OCR invoca a `tesseract` y a `pdftoppm` de poppler, y la conversión de documentos utiliza pandoc. Los tres se incluyen con todas las formas de ejecutar Heym, incluidos `run.sh`, docker-compose y la imagen de versión única, por lo que no hay nada que configurar. Los límites de páginas, los tiempos de espera y el DPI máximo son valores fijos de la plataforma en lugar de ajustes.

## Relacionado

- [Set](./set-node.md) – Transformar y asignar campos individuales
- [Asignador de salida JSON](./json-output-mapper-node.md) – Crear un objeto de respuesta JSON
- [Trigger de carga de archivos](./file-upload-trigger-node.md) – Aceptar un archivo en Heym Drive
- [Drive](./drive-node.md) – Almacenar, obtener y compartir archivos
- [Tipos de nodo](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [DSL de expresiones](../reference/expression-dsl.md) – Funciones y sintaxis
