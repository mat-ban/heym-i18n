# Registro de auditoría

Heym escribe una línea de auditoría por cada acción relevante para la seguridad: quién la realizó, sobre qué la realizó y si tuvo éxito. Las líneas se envían a la salida estándar del backend a través del logger `winston.audit`, junto con el registro de acceso de solicitudes, y pueden leerse desde la pestaña **Logs** o con `docker logs`.

El registro de auditoría está **siempre activado**. No hay nada que habilitar ni ninguna variable de entorno que configurar.

## Formato de línea

Una acción produce exactamente una línea autocontenida:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Cada línea incluye estos campos:

| Campo | Descripción |
|-------|-------------|
| `action` | Qué ocurrió, con el formato `resource.verb` — consulte la tabla a continuación. |
| `outcome` | `success`, `failure` o `denied`. |
| `actor_id` | UUID del usuario que realizó la acción. Ausente solo cuando nadie estaba autenticado. |
| `actor_email` | Correo electrónico de ese usuario. En un inicio de sesión fallido, esta es la dirección que se intentó, no una cuenta confirmada. |
| `target` | El objeto sobre el que se actuó, con el formato `type:uuid`. |
| `target_name` | Nombre legible de ese objeto, entre comillas cuando contiene espacios. |

A continuación figuran los campos específicos de cada acción — por ejemplo `credential_type`, `imported`, `grantee_email`, `team_name`. Los valores que contienen un espacio, una comilla o un `=` se entrecomillan; los valores de más de 256 caracteres se recortan con un marcador `...(truncated)`.

## Lectura del registro

El logger de auditoría es un hijo del logger de solicitudes, por lo que ambos llegan al mismo stream sin dejar de ser separables:

```bash
# Only audit lines, no access-log noise
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Everything one user did
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Failed logins and refused access
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Everything that touched one credential
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

En la aplicación, la pestaña **Logs** lee la misma salida del contenedor. Está controlada por `DOCKER_LOGS_ENABLED` y la lista de permitidos `DOCKER_LOGS_ALLOWED_EMAILS`.

## Qué se registra

Se registra cada cambio de estado. Las lecturas se registran solo cuando la lectura es en sí misma el acto sensible — consultar el historial de ejecuciones de un workflow, abrir una credencial, descargar un archivo. Las lecturas ordinarias de listas y detalles no se auditan; el registro de acceso ya registra que se produjo una solicitud, y auditar cada `GET` enterraría las líneas que importan.

### Autenticación

| Acción | Notas |
|--------|-------|
| `auth.register` | `outcome=denied` cuando el registro está deshabilitado o cuando el inicio de sesión con contraseña está desactivado (`reason=password_login_disabled`), `failure` cuando el correo electrónico ya está en uso. |
| `auth.login` | `outcome=failure` registra la dirección intentada y si el correo electrónico era desconocido o la contraseña era incorrecta. |
| `auth.logout` | El actor se resuelve a partir de la cookie de refresh, por lo que un cierre de sesión sin ella se registra sin identidad. |
| `auth.token_refresh` | `outcome=denied` con `reason=refresh_token_replayed_or_revoked` — una señal de robo de token sobre la que vale la pena alertar. |
| `auth.password_change` | `outcome=failure` cuando la contraseña actual era incorrecta. |
| `auth.sso_login` | Inicio de sesión único. `outcome=failure` incluye el motivo por el que se rechazó la respuesta del proveedor; `denied` incluye `email_not_verified`, `domain_not_allowed` o `provisioning_disabled`. |
| `sso_settings.update` | Un administrador cambió la configuración de [SSO](./sso.md). Registra `enabled` y `password_login_disabled`, nunca el client secret. |
| `sso_settings.test` | Un administrador ejecutó la prueba de conexión de SSO. |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` registra `owned=false` cuando un colaborador consulta el historial de ejecuciones de otra persona. `workflow.delete` registra `outcome=denied` con `reason=not_owner` cuando un colaborador intenta eliminar.

### Credenciales

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` se audita porque abrir una credencial la descifra. Un fallo registra `outcome=denied`, que es el aspecto que tiene un intento de enumeración de identificadores de credenciales.
### Otros recursos

| Recurso | Acciones |
|----------|---------|
| Variables | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Almacenes vectoriales | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alertas | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Tablas de datos | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Equipos | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Carpetas | `folder.create` · `update` · `delete` · `workflow_move` |

Las operaciones masivas se registran una vez por solicitud con un recuento, no una vez por fila. Una importación CSV de 5.000 filas produce una sola línea `data_table.import_csv` que incluye `imported`, `rejected` y `total`.

## Los secretos nunca se registran

Una línea de auditoría registra identificadores, nombres y recuentos. Nunca registra el contenido de una credencial, el valor de una variable, una contraseña ni un token.

Dos mecanismos lo garantizan. Los puntos de llamada están escritos para pasar únicamente campos seguros, y el asistente de auditoría aplica un redactado como respaldo: cualquier campo cuyo nombre contenga `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` o similares se sustituye por `***` antes de construir la línea. El redactado excesivo es deliberado: una línea poco útil es mejor que una credencial filtrada.

Cuando un secreto es genuinamente relevante para el registro, solo se registra su forma. Un recurso compartido de archivos registra `password_protected=true`, nunca la contraseña.

## Retención

**Las líneas de auditoría existen únicamente mientras exista la salida de log del contenedor.** No se escriben en la base de datos. Recrear el contenedor del backend descarta sus logs.

Si necesita un historial de auditoría que sobreviva a un redespliegue, envíe el stdout del contenedor a algún destino duradero — un log driver, un recolector sidecar o la agregación de logs de su plataforma — del mismo modo que lo haría para cualquier otro log de contenedor.

## Para colaboradores

Emitir una línea de auditoría requiere una sola llamada:

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

El asistente es síncrono, no accede a ninguna base de datos y absorbe sus propios errores, por lo que una llamada de auditoría no puede fallar ni ralentizar una solicitud.

Tres reglas al añadir una:

1. **Nombre la acción como `resource.verb` en snake_case.** `backend/tests/test_audit_log.py` recorre cada llamada a `audit()` bajo `app/api/` y hace fallar la compilación ante un nombre que no coincida, y ante un recurso cubierto que haya perdido todos sus puntos de llamada.

2. **Lea únicamente atributos que estén con certeza presentes.** El `try/except` del asistente protege su propio cuerpo, no las expresiones que usted le pasa: un `AttributeError` en `target_name=workflow.name` se lanza en el punto de llamada, antes de que se ejecute `audit()`, y romperá la solicitud. Lea columnas ORM y variables locales, no atributos opcionales o de carga diferida.

3. **Registre la eliminación antes de eliminar.** Después de `db.delete(row)`, el nombre y el id que desea registrar pueden haber desaparecido. Coloque la llamada por encima de esa línea.
