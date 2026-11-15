# Análisis de archivos

El análisis de archivos permite que Chat, el [nodo Agent](../nodes/agent-node.md) y el [nodo Code](../nodes/code-node.md) abran y analicen archivos grandes desde [Drive](./drive.md) en un entorno aislado (sandbox) de Python. Los archivos PDF, hojas de cálculo, CSV, DOCX y JSON se inspeccionan primero y se leen selectivamente, por lo que un contrato de 200 páginas o una tabla con un millón de filas nunca tiene que caber por completo en el contexto de un modelo.

## Cómo funciona

Cada llamada se ejecuta en un nuevo contenedor sin acceso a la red. Los archivos necesarios se copian en modo de solo lectura, se ejecuta el código y se elimina el contenedor. Una pequeña carpeta de trabajo persiste entre llamadas de la misma sesión, permitiendo que un paso posterior aproveche los resultados guardados por un paso anterior.

| Ruta | Contenido |
|------|--------|
| `/input` | Los archivos de Drive de esta sesión, de solo lectura |
| `/work` | Espacio de trabajo que persiste durante la sesión, por ejemplo `/work/sales.pkl` |
| `/work/out` | Los archivos escritos aquí se guardan en Drive tras la llamada y se devuelven como enlaces |

El sandbox cuenta con pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx y langdetect preinstalados, además del OCR Tesseract que utiliza el [nodo Conversor](../nodes/converter-node.md).

## Herramientas

El modelo trabaja con tres herramientas, más una cuarta en Chat:

| Herramienta | Función |
|------|----------|
| `list_files` | Lista los archivos de Drive que puede abrir: nombre, tipo, tamaño, fecha |
| `inspect_file` | Devuelve el tipo, metadatos y estructura de un archivo con un breve extracto |
| `run_python` | Ejecuta Python para los archivos indicados y devuelve la salida por consola |
| `clear_workspace` | Solo Chat: elimina la carpeta de trabajo de la conversación |

`inspect_file` lee solo lo necesario para un resumen:

| Tipo | Resumen |
|-----|-----------------|
| PDF | Número de páginas, título y autor, posibilidad de extraer texto, idioma, tamaños de página, texto y tablas de la primera página. Los PDF escaneados se leen con OCR (hasta 5 páginas) |
| XLSX / XLS | Hojas con recuentos de filas y columnas, filas de encabezado, tipos, `read_hint` de pandas, rangos con nombre, primeras filas |
| CSV / TSV | Codificación, delimitador, recuento de filas, columnas con tipos, primeras filas |
| DOCX | Esquema de encabezados, tablas, recuento de palabras y caracteres, autor y fecha |
| JSON | Tipo raíz, claves, longitud del array, profundidad de anidamiento, registros de muestra |

Abra un archivo dentro de `run_python` mediante el módulo `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## En Chat

Adjunte archivos PDF, hojas de cálculo, DOCX, CSV o JSON, imágenes (PNG, JPG, GIF, WebP) o archivos de texto sin formato en la [pestaña Chat](../tabs/chat-tab.md), en el Chat de Heym Work o a través de la herramienta MCP `heym_chat`. Un mensaje puede contener hasta 10 archivos. Cada archivo se almacena en su Drive; solo su nombre y su ID se incluyen en el mensaje. Chat inspecciona el archivo, lee la parte relevante para su pregunta y responde con tablas o extractos.

## En Workflows

Una ejecución solo abre sus propios archivos: los cargados mediante el [nodo Trigger de Carga de Archivos](../nodes/file-upload-trigger-node.md), los que los nodos escribieron en Drive y los que un [nodo Drive](../nodes/drive-node.md) obtuvo con el paso **Get** en la misma ejecución.

- **Nodo Agent**: si la entrada o mensaje del agente incluye un archivo, recibe automáticamente las herramientas anteriores para dichos archivos.
- **Nodo Code**: configure **Archivos** con una expresión como `$Upload.file.id`. Los archivos se montan y se listan en `params.files`.

## Límites

| Límite | Valor |
|-----------|------|
| Memoria por llamada | 2 GB |
| Tiempo por llamada | 120 segundos |
| Carpeta de trabajo por sesión | 2 GB |
| Archivos de salida por llamada | 20, hasta 100 MB cada uno |
| Salida impresa devuelta al modelo | 20.000 caracteres |
| Archivos por llamada | 20 |

## Seguridad

- El sandbox no tiene acceso a red ni a la configuración o secretos de Heym, y se ejecuta como un usuario sin privilegios.
- Los archivos se procesan exclusivamente dentro del sandbox.
- En Chat, el acceso sigue a Drive: abre sus propios archivos y los compartidos con sus equipos.
- La apertura de un archivo en Chat queda registrada en el registro de auditoría.
- El contenido de los archivos se trata como datos puros; las instrucciones contenidas en ellos no se ejecutan.

## Requisitos

El análisis de archivos requiere un backend de sandbox en la instancia de Heym (Docker o [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Relacionado

- [Drive](./drive.md)
- [Nodo Code](../nodes/code-node.md)
- [Nodo Agent](../nodes/agent-node.md)
- [Pestaña Chat](../tabs/chat-tab.md)
