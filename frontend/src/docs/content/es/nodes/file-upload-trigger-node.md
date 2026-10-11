# Trigger de Carga de Archivos

El nodo **Trigger de Carga de Archivos** es un punto de entrada sin entradas para workflows que necesitan un **archivo grande** (audio, video, archivos comprimidos) que no puede incrustarse como base64 dentro de una solicitud JSON. Al invocar el workflow, se devuelve un enlace de carga `curl` preconfigurado y de un solo uso; al cargar un archivo en ese enlace, se inicia la ejecución con el archivo adjunto.

Utilícelo cuando un invocador —incluido un agente de IA como Claude o ChatGPT ejecutándose en un sandbox— deba entregar una grabación de voz de 20 MB o un video de 75 MB a un workflow de Heym.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 |
| Salidas | 1 |
| Salida | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Cómo funciona

El nodo se ejecuta en dos fases:

1. **Emisión.** Cuando el workflow se invoca a través de HTTP (`POST /api/workflows/{id}/execute`), como herramienta MCP, o mediante el botón **Run Workflow** del canvas, la ejecución **no** ejecuta el cuerpo. En su lugar, emite una ranura de carga de un solo uso y devuelve:

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

2. **Carga + ejecución.** El invocador ejecuta el `curl` con su archivo. El endpoint de carga valida la ranura, almacena el archivo, ejecuta el workflow **de forma sincrónica** y devuelve la salida del workflow en la respuesta de carga. El enlace es de **un solo uso** — una segunda carga devuelve `409`.

En el canvas, **Run Workflow** muestra el `curl` emitido en el panel de depuración con un botón de copia.

## Parámetros

| Parámetro | Tipo | Predeterminado | Descripción |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Cuánto tiempo permanece válido el enlace de carga (1–10080 minutos / hasta 7 días). |
| `maxSizeMb` | number | `100` | Tamaño máximo de archivo aceptado. El límite máximo absoluto es **100 MB**. |
| `allowedTypes` | string | (vacío) | Lista opcional de tipos MIME/extensiones permitidas separadas por comas, por ejemplo `audio/*, .wav`. Vacío permite cualquier tipo. |

## Campos de salida

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.file.id` | UUID del archivo almacenado (un archivo de Drive). |
| `$nodeLabel.file.name` | Nombre de archivo original. |
| `$nodeLabel.file.mime` | Tipo de contenido detectado. |
| `$nodeLabel.file.size` | Tamaño en bytes. |
| `$nodeLabel.file.download_url` | URL de descarga autenticada para nodos posteriores. |
| `$nodeLabel.uploaded_at` | Marca de tiempo ISO de la carga. |

## Ejemplo

Un workflow de transcripción:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Un agente llama a la herramienta MCP del workflow y recibe el `curl`.
2. El agente ejecuta el `curl` con la grabación desde su sandbox.
3. La carga ejecuta el workflow y la respuesta del `curl` contiene el resumen de la transcripción.

## Seguridad

- La URL de carga incorpora un token de alta entropía — el token **es** la capacidad, por lo que un agente en sandbox no necesita credenciales de Heym para cargar. Solo se almacena en el servidor el hash del token.
- La emisión requiere la autenticación normal del workflow, por lo que solo los invocadores autorizados pueden crear enlaces de carga.
- Cada emisión y cada intento de carga (aceptado o rechazado — expirado, reproducido, sobredimensionado, tipo no permitido, token desconocido) se registra en una traza de auditoría de solo adición.
- Las cargas se aplican como de un solo uso, limitadas por TTL y con límite de tamaño; las cargas sobredimensionadas se rechazan.

## Notas

- Los canales de invocación genéricos HTTP, MCP y canvas siguen siendo solo JSON; este nodo es la forma admitida de aceptar cargas de archivos multipart.
- El archivo cargado se almacena como un archivo de Drive normal, por lo que cualquier nodo posterior que acepte una referencia de archivo (transcribir, enviar archivo adjunto por correo electrónico, etc.) puede consumir `$nodeLabel.file`.