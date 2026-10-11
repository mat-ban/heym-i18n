# Tokens de ejecución

Los tokens de ejecución son JWT con alcance limitado que otorgan acceso a los endpoints de ejecución y streaming de un único workflow. Permiten invocar un workflow desde sistemas externos sin exponer su token de sesión de usuario de larga duración.

## Por qué utilizar tokens de ejecución

Cuando la autenticación de un workflow está configurada como **JWT**, el endpoint normalmente requiere una sesión de usuario válida. Los tokens de ejecución permiten:

- Compartir un token invocable con scripts externos, pipelines de CI o integraciones sin compartir las credenciales de su cuenta.
- Limitar la exposición: un token es válido únicamente para un workflow específico.
- Revocar el acceso de forma instantánea sin cambiar su contraseña ni rotar los tokens de sesión.
- Elegir entre tokens de corta duración (minutos u horas) y tokens de larga duración (hasta 10 años).

## Crear un token

Abra el diálogo **Run with cURL** en el editor (barra de herramientas superior derecha). Cuando la autenticación del workflow está configurada como **JWT Token**, el diálogo muestra un gestor de tokens:

1. Elija **Short-lived** o **Long-lived (10yr)**.
2. Para tokens de corta duración, introduzca la duración en segundos (mínimo 60).
3. Haga clic en **+ New Token**.

El token se crea de inmediato, se añade a la lista y se selecciona automáticamente, de modo que el comando cURL se actualiza para incluirlo.

## Lista de tokens

Cada fila de token muestra:

| Columna | Descripción |
|--------|-------------|
| Created | Marca de tiempo de creación |
| Status | **Expires:** fecha, **Expired** o **Revoked** |
| Eye icon | Alterna la visibilidad del valor del token |
| Revoke button | Marca el token como revocado (irreversible) |

Haga clic en cualquier fila activa (no expirada ni revocada) para seleccionarla. El token seleccionado se inserta en la vista previa del comando cURL.

Los tokens expirados y revocados permanecen visibles en la lista, pero no se pueden seleccionar.

## Utilizar un token

Copie el valor del token desde la lista (haga clic en el icono del ojo para revelarlo) e inclúyalo como token `Bearer`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Cuando utilice **Copy cURL** en el diálogo con un token seleccionado, el token ya estará insertado en el comando; no es necesario sustituirlo manualmente.

## Alcance del token

Cada token incluye estas claims JWT:

| Claim | Valor |
|-------|-------|
| `sub` | ID de usuario del creador del token |
| `wid` | UUID del workflow: el token se rechaza para cualquier otro workflow |
| `scope` | `workflow:execute`: lo distingue de un token de sesión de usuario |
| `jti` | ID único del token utilizado para las consultas de revocación |
| `exp` | Marca de tiempo de expiración |

El backend verifica todos estos elementos en cada solicitud: la validez de la firma, la expiración, la coincidencia del `wid` y que el `jti` no haya sido revocado.

## Revocación

Haga clic en el botón de revocación (círculo con barra) junto a un token para revocarlo. La revocación surte efecto de inmediato: las solicitudes posteriores que utilicen ese token devuelven `401`. La fila del token permanece visible en la lista con la etiqueta **Revoked**.

No existe la acción de deshacer la revocación. Cree un nuevo token si necesita restaurar el acceso.

## API

Los endpoints de gestión de tokens se autentican con su sesión habitual.

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Crear un token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Listar sus tokens para este workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Revocar un token |

**Cuerpo de la solicitud de creación:**

```json
{ "ttl_seconds": 900 }
```

**Respuesta de creación:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

El campo `token` solo se devuelve una vez, en el momento de la creación. Almacénelo de inmediato; las solicitudes `GET` posteriores devuelven la misma fila, pero también puede revelarlo en el diálogo cURL en cualquier momento.

## Alcance de visibilidad

Cada usuario solo ve los tokens que ha creado. Los miembros del equipo con acceso a un workflow compartido no pueden ver los tokens de los demás.

## Relacionado

- [Webhooks](./webhooks.md): endpoints de Trigger HTTP y el diálogo cURL
- [Security](./security.md): gestión de sesiones y descripción general de la autenticación
- [SSE Streaming](./sse-streaming.md): utilice tokens de ejecución con el endpoint de streaming