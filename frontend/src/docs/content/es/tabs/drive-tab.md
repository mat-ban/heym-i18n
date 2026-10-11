# Pestaña Drive

La pestaña Drive muestra todos los archivos generados por las skills en sus workflows.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Ver demostración de Drive</a></p>

## Descripción general

Los archivos generados por las skills (PDF, DOCX, CSV, imágenes, etc.) se almacenan y listan automáticamente en la pestaña Drive. Cada archivo muestra su nombre, tipo, tamaño, nodo de origen, fecha de creación y estado de uso compartido con equipos.

## Funcionalidades

- **Búsqueda** - Filtre archivos por nombre, tipo o nodo de origen
- **Copiar ID de archivo** - Copie el UUID del archivo al portapapeles, listo para pegar en un nodo [Drive](../nodes/drive-node.md) o [Converter](../nodes/converter-node.md)
- **Descarga** - Descarga autenticada para sus archivos y los archivos compartidos con usted a través de equipos
- **Compartir** - Cree enlaces de descarga compartibles con protección por contraseña y caducidad opcionales, o comparta un archivo en modo solo lectura con sus equipos actuales
- **Eliminar** - Elimine archivos y sus enlaces para compartir
- **Borrar todo** - Elimine todos los archivos y sus enlaces para compartir tras la confirmación
- **Acciones masivas** - Seleccione varios archivos con casillas de verificación (Shift-clic para seleccionar un rango) y aplique la misma acción a todos ellos a la vez
- **Paginación** - Navegue por colecciones grandes de archivos, con un selector de filas por página (25 / 50 / 100 / Todas)

## Acciones masivas

Los archivos de su propiedad muestran una casilla de verificación al inicio de su fila (los archivos compartidos con usted a través de un equipo son de solo lectura y no se pueden seleccionar). Seleccione varias filas — o use la casilla del encabezado para seleccionar toda la página, y **Shift-clic** para seleccionar un rango — y luego use la barra de acciones masivas que aparece sobre la lista:

- **Descargar ZIP** empaqueta todos los archivos seleccionados en un único archivo ZIP y lo descarga
- **Acciones masivas** abre un único diálogo para aplicar una configuración a todos los archivos seleccionados:
  - **Compartir todo con mis equipos** / **Quitar uso compartido con equipos** con un solo clic
  - **Crear enlace para compartir para cada archivo** usando la misma contraseña, caducidad y configuración de descargas máximas
- **Eliminar** elimina todos los archivos seleccionados y sus enlaces para compartir tras una confirmación
- **Borrar selección** deselecciona todo

El diálogo informa a cuántos archivos se aplicó (los archivos que no son de su propiedad se omiten). Use la opción **Todas** del selector de filas por página para cargar todos los archivos en una sola página y seleccionar en todo su Drive. Al escribir en el cuadro de búsqueda, el selector de filas por página cambia automáticamente a **Todas** para que la búsqueda abarque todos los archivos, no solo la página actual; al borrar la búsqueda se restaura la selección anterior.

## Uso compartido

Cree enlaces para compartir con:
- **Sin autenticación** - URL de descarga pública basada en token
- **Basic Auth** - Enlace protegido por contraseña (usuario: `file`)
- **Caducidad** - Caducidad opcional basada en tiempo
- **Límites de descarga** - Número máximo de descargas opcional

Active **Compartir con mis equipos** en un archivo para hacerlo visible a todos los equipos a los que pertenece actualmente. Los miembros de los equipos con los que se comparte obtienen acceso de solo lectura; las acciones de gestión siguen siendo exclusivas del propietario.

## Acceso de las Agent Skill

Las skills del nodo Agent pueden habilitar la lectura de archivos de Drive. Cuando **Habilitar archivos de Drive** está activado para una skill, su código Python puede leer los archivos de Drive accesibles por id de archivo o nombre de archivo exacto a través del helper generado `heym_drive.py`. La configuración está desactivada de forma predeterminada.

Consulte la [referencia de Drive](../reference/drive.md) para obtener todos los detalles.

## Relacionado

- [Nodo Drive](../nodes/drive-node.md) - Liste archivos, recupere metadatos, comparta con equipos o cambie las restricciones de uso compartido desde un workflow
- [Generación de archivos](../reference/file-generation.md) - Cómo generan archivos las skills
- [Referencia de Drive](../reference/drive.md) - Enlaces para compartir, tokens y limpieza
- [Portal](../reference/portal.md) - Enlaces de archivos en las respuestas del chat del portal
