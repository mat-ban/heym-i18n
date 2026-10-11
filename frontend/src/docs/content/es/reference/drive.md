# Drive

La pestaña Drive proporciona un lugar central para ver, gestionar y compartir todos los archivos generados por las skills.

## Acceso a Drive

Navegue a la pestaña **Drive** en el panel de control. Todos los archivos generados por las skills de su workflow aparecen aquí, ordenados por fecha de creación.

## Lista de archivos

La lista de archivos muestra:

- **Name** - Nombre de archivo original con un icono específico según el tipo
- **Type** - Tipo MIME del archivo (por ejemplo, pdf, csv, docx)
- **Size** - Tamaño del archivo en formato legible
- **Source** - La etiqueta del nodo que generó el archivo
- **Date** - Cuándo se creó el archivo
- **Actions** - Botones de descarga, compartir y eliminar

## Acciones masivas

Cada archivo del que sea propietario tiene una casilla de verificación al inicio de su fila. Los archivos compartidos con usted a través de un equipo son de solo lectura y no se pueden seleccionar. Seleccione varios archivos (Mayús+clic selecciona un rango contiguo; la casilla de verificación del encabezado selecciona toda la página) para mostrar la barra de acciones masivas encima de la lista; a continuación, haga clic en **Bulk actions** para abrir un único diálogo que aplica la misma configuración a cada archivo seleccionado:

- **Share all with my teams** / **Remove team sharing** — activa o desactiva el uso compartido con equipos para todos los archivos seleccionados a la vez
- **Create share link for each file** — crea un enlace para compartir en cada archivo seleccionado utilizando los mismos valores de caducidad, contraseña y descargas máximas

El diálogo informa a cuántos archivos se aplicó; los archivos de los que no es propietario se omiten. El selector de filas por página (25 / 50 / 100 / **All**) en la parte inferior de la lista le permite cargar más archivos en una página para poder seleccionar en todo su Drive.

## Compartir archivos

Haga clic en el icono **Share** para abrir el diálogo de uso compartido. Puede crear varios enlaces para compartir por archivo con configuraciones diferentes y, opcionalmente, compartir el archivo con sus equipos actuales.

### Enlace público (basado en Token)

Cree un enlace para compartir sin contraseña. Cualquier persona con el enlace puede descargar el archivo.

### Enlace protegido con contraseña (Basic Auth)

Establezca una contraseña al crear el uso compartido. La URL de descarga utiliza HTTP Basic Authentication: los navegadores solicitarán el nombre de usuario (`file`) y la contraseña cuando se abra el enlace.

### Opciones de enlace

- **Expires (hours)** - Opcionalmente, establezca un tiempo de caducidad
- **Max downloads** - Opcionalmente, limite el número de descargas
- Ambas opciones se pueden combinar para un control máximo

### Compartir con mis equipos

Active **Share with my teams** para conceder acceso de solo lectura a todos los equipos a los que pertenece actualmente. Los miembros del equipo pueden ver y descargar el archivo desde Drive y utilizar operaciones de lectura del nodo Drive, pero solo el propietario del archivo puede eliminarlo, crear o revocar enlaces públicos, o cambiar la contraseña, el TTL o los límites de descarga.

La configuración es específica de cada archivo. Si se une o crea otro equipo más adelante, vuelva a activar el uso compartido o ejecute la operación `shareWithMyTeams` del nodo Drive para añadir ese equipo. Utilice `unshareWithMyTeams` para eliminar los usos compartidos con equipos del archivo en un workflow.

### Gestionar usos compartidos

El diálogo de uso compartido muestra todos los enlaces existentes con:
- Recuento actual de descargas
- Estado de caducidad
- Si Basic Auth está habilitado
- Botones de copiar y revocar

## Enlaces a archivos en Chat y Portal

Cuando una skill genera archivos durante una ejecución de workflow a través del Chat del Portal o del Quick Drawer, los enlaces de descarga aparecen automáticamente en la respuesta. Los usuarios pueden hacer clic para descargar directamente.

## Almacenamiento

Los archivos generados se almacenan en el sistema de archivos del servidor bajo `data/files/`. En despliegues con Docker, esto se monta como un volumen para su persistencia.

## Gestionar archivos desde Workflows

El [nodo Drive](../nodes/drive-node.md) le permite gestionar archivos de Drive mediante programación desde dentro de un workflow. Úselo para:

- **Listar** sus archivos y devolver metadatos como el nombre de archivo, el tipo MIME, el tamaño, el origen y la URL de descarga
- **Eliminar** un archivo después de haberlo entregado al usuario
- **Compartir o dejar de compartir con sus equipos** para que los miembros del equipo puedan leerlo y descargarlo solo mientras exista el uso compartido con el equipo
- **Establecer una contraseña** en el enlace de descarga
- **Establecer un TTL** para que el enlace caduque después de N horas
- **Establecer un límite de descargas máximas**

Convertir un archivo a otro formato es tarea del [nodo Converter](../nodes/converter-node.md), con `conversion: "fileConvert"`. Lee un archivo de Drive y almacena el resultado convertido como uno nuevo.

Haga referencia al archivo por su ID desde la salida de la skill: `$agentLabel._generated_files[0].id`

Consulte la [documentación del nodo Drive](../nodes/drive-node.md) para obtener detalles sobre la configuración.

## Leer archivos de Drive desde Skills

Las skills de Agent pueden habilitar las lecturas de Drive con la configuración **Enable Drive files** de la tarjeta de la skill. Cuando está habilitada, el entorno de ejecución de la skill incluye un helper generado `heym_drive.py`. El código de la skill puede importar helpers como `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` y `list_drive_files`.

Las lecturas de Drive están limitadas a los archivos accesibles para el actor del workflow: archivos propios y archivos compartidos con el actor a través de equipos. Utilice un id de archivo para una búsqueda exacta, o un nombre de archivo exacto cuando el usuario se refiera a un archivo por su nombre. La búsqueda por nombre de archivo devuelve el archivo accesible más reciente con ese nombre; `list_drive_files(filename="...")` devuelve todas las coincidencias.
## Relacionado

- [Nodo Drive](../nodes/drive-node.md) - Operaciones de Workflow (list, get, delete, password, TTL, max downloads, team sharing)
- [Pestaña Drive](../tabs/drive-tab.md) - Explore archivos en el panel de control
- [Generación de archivos](./file-generation.md) - Cómo se producen `_generated_files` y las URL de descarga

## Limpieza
Los tokens de uso compartido caducados se limpian automáticamente cada día. Los archivos en sí persisten hasta que se eliminan manualmente a través de la pestaña Drive. Utilice **Clear All** para eliminar todos los archivos y sus enlaces de uso compartido en una sola acción.
