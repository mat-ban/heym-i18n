# Nodo Amazon S3

El Nodo Amazon S3 lee y escribe objetos en [Amazon S3](https://aws.amazon.com/s3/).

## Operaciones compatibles

- `Create Bucket`: Crea un bucket en la región de la credencial.
- `Delete Bucket`: Elimina un bucket vacío.
- `List Buckets`: Lista los buckets visibles para la credencial.
- `Create Folder`: Crea un marcador de carpeta vacío (clave de cero bytes que termina en `/`).
- `Delete Folder`: Elimina todos los objetos bajo un prefijo de carpeta (incluidas las claves anidadas).
- `Get All in Folder`: Lista todos los metadatos de objetos bajo un prefijo de carpeta (paginación del lado del servidor).
- `Upload Object`: Escribe un payload de texto en un bucket/clave.
- `Get Object`: Descarga un objeto y devuelve texto decodificado o contenido en base64.
- `Copy Object`: Copia un objeto a otra clave o bucket.
- `List Objects`: Lista los metadatos de objetos bajo un prefijo (una sola página, hasta 1000 claves; admite tokens de continuación).
- `Delete Object`: Elimina un único objeto por su clave.

## Configuración de credenciales

Cree una credencial `Amazon S3` en la pestaña Credenciales con:

- Access Key ID
- Secret Access Key
- Region
- Session Token opcional (para credenciales temporales de AWS STS)

## Campos comunes

- `Bucket`: Nombre del bucket de destino (bucket de destino para las operaciones de copia).
- `Object Key`: Clave de objeto con formato de ruta, como `reports/daily.json`.
- `Folder Path`: Prefijo para las operaciones de carpeta (por ejemplo, `docs/archive`).
- `Source Bucket`: Bucket de origen opcional para la copia; por defecto, el bucket de destino.
- `Source Object Key`: Clave de origen para las operaciones de copia.
- `Prefix`: Se utiliza en las operaciones de listado para acotar los resultados.
- `Continuation Token`: Token opcional de una respuesta de listado anterior para obtener la página siguiente.
- `Max Keys`: Tamaño de página para List Objects (1–1000).
- `Include Binary`: Cuando se habilita en Get Object, devuelve `body_base64` en lugar de `body_text`.
- `Body`: Contenido de texto que se va a subir.
- `Content Type`: Tipo MIME opcional para los objetos subidos.

## Ejemplos de salida

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

## Notas

- `Upload Object` actualmente sube contenido de texto en UTF-8.
- `Get Object` puede devolver base64 para archivos binarios habilitando la opción binaria.
- `Create Bucket` utiliza la región de la credencial y requiere `s3:CreateBucket`.
- `Delete Bucket` requiere que el bucket esté vacío y necesita `s3:DeleteBucket`.
- `List Buckets` requiere `s3:ListAllMyBuckets`.
- `Create Folder` sube un objeto marcador de cero bytes; S3 no tiene un tipo de directorio nativo.
- `Delete Folder` elimina todos los objetos cuya clave comienza con el prefijo de carpeta; utilícelo con precaución.
- `Get All in Folder` pagina automáticamente a través del prefijo hasta que se devuelven todos los objetos.
- `List Objects` devuelve una página (hasta 1000 claves). Cuando `truncated` es true, pase `next_continuation_token` al campo Continuation Token de la siguiente llamada.
- `Copy Object` requiere `s3:GetObject` en el origen y `s3:PutObject` en el destino.

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Credenciales](../reference/credentials.md) – Tipos de credenciales y su uso
- [Integraciones de terceros](../reference/integrations.md) – Configuración de la credencial de Amazon S3