# Notion

El nodo **Notion** gestiona bases de datos, orígenes de datos, páginas y bloques a través de la API de Notion.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Credencial | Token de integración interna o Notion OAuth |
| Versión de la API | `2026-03-11` |

Las colecciones de estilo base de datos de Notion utilizan **ID de origen de datos** en las versiones actuales de la API. Comparta cada página u origen de datos que el workflow necesite con la integración antes de ejecutar el nodo.
Los campos de recurso aceptan tanto un ID de Notion sin procesar como una URL completa de Notion. Las URL se normalizan a su ID de recurso incrustado antes de la solicitud a la API.

## Operaciones

| Operación | Campos obligatorios | Salida principal |
|-----------|-----------------|-------------|
| Search | Consulta/filtro/orden opcionales | `.results`, `.count`, `.next_cursor` |
| Get Page | ID de página | `.page` |
| Create Page | ID de origen de datos o ID de página principal, Propiedades | `.page`, `.id`, `.url` |
| Update Page | ID de página, uno de Propiedades/Icono/Portada | `.page` |
| Move Page to Trash | ID de página | `.page` |
| Restore Page | ID de página | `.page` |
| Create Database | Solicitud de base de datos con `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | ID de base de datos | `.database` |
| Update Database | ID de base de datos, solicitud de base de datos no vacía | `.database`, `.id`, `.url` |
| Create Data Source | Solicitud de origen de datos con `parent` y `properties` no vacío | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Origen de datos | `.data_source` |
| Update Data Source | ID de origen de datos, solicitud de origen de datos no vacía | `.data_source`, `.id`, `.url` |
| Query Data Source | ID de origen de datos | `.results`, `.count`, `.next_cursor` |
| Get Block Children | ID de bloque o página | `.results`, `.count`, `.next_cursor` |
| Update Block | ID de bloque, objeto de actualización de bloque | `.block` |
| Delete Block | ID de bloque | `.block` |
| Append Blocks | ID de bloque o página, Children | `.results`, `.count` |

Todas las operaciones también devuelven `.success` y `.operation`.

## Campos JSON

Los campos Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon y Cover aceptan
JSON de la API de Notion. Las expresiones dentro de cadenas JSON se resuelven antes de la solicitud. Un campo también puede
ser una expresión independiente que se resuelva directamente al objeto o array requerido, como
`$input.database`, `$input.properties` o `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Para el contenido de una página o bloque, Children es un array de objetos de bloque de Notion:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```
## Bases de datos y fuentes de datos

En la API actual de Notion, una **base de datos** es un contenedor y una **fuente de datos** contiene el esquema de propiedades y las filas consultables. Retrieve Database devuelve la lista `data_sources` de la base de datos; utilice uno de esos IDs con Retrieve Data Source o Query Data Source.

Create Database acepta el objeto de solicitud completo del endpoint Create a database de Notion. Debe contener `parent` y puede contener `title`, `description`, `is_inline`, `initial_data_source`, `icon` y `cover`. Por ejemplo:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Update Database acepta el objeto de solicitud del endpoint de actualización, incluidos `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` e `is_locked`. Los campos de ID de base de datos aceptan un ID sin formato, una URL completa de Notion o una expresión.

Utilice **Retrieve Data Source** para obtener el esquema `properties` de la fuente de datos antes de construir un objeto de propiedades de Create Page. **Create Data Source** requiere un objeto de base de datos padre y un esquema `properties` no vacío. **Update Data Source** acepta un objeto de solicitud no vacío compatible con el endpoint correspondiente de Notion.

Por ejemplo, cree una fuente de datos dentro de una base de datos existente:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Los selectores Data Source y Parent Page admiten búsqueda del lado del servidor con un breve debounce y paginación basada en cursor mediante **Load more**. Utilice **Refresh** después de compartir un nuevo recurso en Notion. Cambie a **Use expression** para introducir una expresión, un ID sin formato o una URL.

Los filtros de búsqueda de tutoriales anteriores que utilizan
`{"property":"object","value":"database"}` se traducen al valor actual `data_source`.
Los nuevos workflows deben utilizar `data_source` o `page` directamente.

Append Blocks admite las posiciones **Start**, **End** y **After Block**. Create Page y Append Blocks dividen automáticamente más de 100 hijos de nivel superior en solicitudes ordenadas para cumplir con el límite por solicitud de Notion.

Las solicitudes limitadas por rate limit (`429` o `529`) se reintentan hasta tres veces. Heym respeta el encabezado `Retry-After` de Notion, limita cada espera a 10 segundos y añade jitter aleatorio. Las solicitudes a Notion comparten un pool de conexiones HTTP a nivel de proceso entre páginas y nodos de workflow.

## Límites de la API de Notion

- Un único valor `text.content` de rich text puede contener como máximo 2.000 caracteres. Divida el texto más largo en varios objetos de rich text.
- Notion limita los hijos de bloque de nivel superior a 100 por solicitud. Heym agrupa los arrays Children más grandes, pero cada bloque individual debe seguir cumpliendo los límites de payload de Notion.
- La API acepta como máximo dos niveles anidados de hijos de bloque en una solicitud. Cree estructuras más profundas con operaciones Append Blocks posteriores.
- Los payloads de solicitud están limitados a 1.000 elementos de bloque y 500 KB en total.

## Paginación

Search, Query Data Source y Get Block Children aceptan un tamaño de página de 1 a 100 y un cursor de inicio opcional. Establezca el tamaño de página en `0` para seguir los cursores automáticamente y combinar todos los resultados, hasta el límite de seguridad de 10.000 resultados del nodo.

## Configuración de credenciales

Elija cualquiera de las dos configuraciones en el diálogo de credenciales (**Internal token** u **OAuth**):

- **Internal token:** Cree una integración interna, copie su token en Heym y, a continuación, comparta cada página o fuente de datos requerida con la integración. Utilice **Test Connection** para verificar el acceso.
- **OAuth:** Cree una integración pública de Notion y registre
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` en Notion. En el diálogo de credenciales de Heym, elija **OAuth**, introduzca el Client ID y el Client Secret de la integración y, a continuación, haga clic en **Connect** para autorizar un workspace. El secreto se almacena cifrado con la credencial y no se coloca en el estado de OAuth ni en la configuración del entorno. Tras la autorización, la credencial muestra el nombre del workspace conectado (`connected (Workspace Name)`). Las credenciales OAuth pendientes muestran `Not connected`.

Si deja el campo del token interno en blanco mientras edita, se conserva el token almacenado.

Para solicitudes [HTTP](../nodes/http-node.md) personalizadas, `$credentials.YourNotionCredential` se resuelve al mismo bearer token que utiliza el nodo de Notion (token interno o token de acceso OAuth).
## Notas sobre la versión de la API

Heym fija las solicitudes de Notion a la versión de API `2026-03-11`. Esta versión utiliza:

- Padres `data_source_id` y endpoints `/data_sources` en lugar de las rutas heredadas de consulta de bases de datos
- `in_trash` en lugar de `archived` para las operaciones de papelera y restauración de páginas
- Objetos `position` (`start`, `end`, `after_block`) para Append Block Children

Al migrar ejemplos de automatización de Notion más antiguos:

- Reemplace las referencias de padre/consulta de base de datos por los IDs de origen de datos obtenidos mediante **Retrieve Database** o el selector de origen de datos del editor
- Reemplace `archived: true` por `in_trash: true`
- Reemplace los parámetros `after` de append por el campo **Append Position** del nodo

Los filtros de búsqueda que aún utilizan el valor de objeto `database` se normalizan automáticamente a `data_source`.

## Relacionado

- [Credenciales](../reference/credentials.md)
- [Integraciones de terceros](../reference/integrations.md)
- [Tipos de nodos](../reference/node-types.md)
