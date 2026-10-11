# IMAP Trigger

El nodo **IMAP Trigger** consulta periódicamente un buzón de correo electrónico a un intervalo fijo e inicia un workflow una vez por cada mensaje nuevo detectado. Es un nodo trigger de entrada cero diseñado para la automatización de correo electrónico entrante, como la clasificación de soporte, la supervisión de buzones compartidos y los buzones de aprobación.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 |
| Salidas | 1 |
| Salida | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `imap` que contiene el servidor, el inicio de sesión, el buzón y la configuración de SSL |
| `pollIntervalMinutes` | Integer | Frecuencia con la que Heym comprueba el buzón en busca de correo nuevo |

## Guía de configuración

### 1. Cree una credencial `imap`

1. Vaya a **Settings → Credentials → New Credential**
2. Seleccione el tipo **IMAP Email Inbox**
3. Introduzca:
   - **IMAP Host** (por ejemplo, `imap.gmail.com`)
   - **IMAP Port** (`993` para SSL/TLS en la mayoría de los proveedores)
   - **Username / Email**
   - **Password / App Password**
   - **Mailbox** opcional (predeterminado: `INBOX`)
4. Deje **Use SSL / TLS** habilitado a menos que su servidor de correo requiera explícitamente IMAP sin SSL
5. Guarde la credencial

### 2. Añada el nodo a su workflow

1. Arrastre **IMAP Trigger** al canvas
2. Seleccione el nodo para abrir el panel de Propiedades
3. Elija su credencial `imap`
4. Establezca **Poll Interval (Minutes)** con un valor entero como `1`, `5` o `15`

## Semántica del trigger

- La primera consulta establece una línea base del contenido actual del buzón y **no** reproduce correo anterior.
- Las consultas posteriores se activan una vez por cada mensaje cuyo UID de IMAP sea más reciente que el cursor guardado.
- Si el `UIDVALIDITY` del buzón cambia, Heym restablece el cursor y vuelve a establecer la línea base para evitar el procesamiento duplicado.
- Cada correo nuevo inicia una ejecución de workflow independiente con `trigger_source = "imap"`.

## Campos de salida

Una vez que el nodo se activa, los nodos posteriores pueden acceder a:

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.email` | Payload completo del correo electrónico analizado |
| `$nodeLabel.email.subject` | Asunto decodificado |
| `$nodeLabel.email.from` | Encabezado `From` sin procesar |
| `$nodeLabel.email.fromAddresses` | Lista de remitentes analizada |
| `$nodeLabel.email.toAddresses` | Lista de destinatarios analizada |
| `$nodeLabel.email.ccAddresses` | Lista de CC analizada |
| `$nodeLabel.email.replyToAddresses` | Lista de reply-to analizada |
| `$nodeLabel.email.text` | Cuerpo en texto plano |
| `$nodeLabel.email.html` | Cuerpo en HTML |
| `$nodeLabel.email.attachments` | Array de metadatos de archivos adjuntos (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Objeto de encabezados decodificado |
| `$nodeLabel.email.uid` | UID de IMAP para deduplicación o registro |
| `$nodeLabel.triggered_by` | Etiqueta de origen del trigger (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID del nodo del canvas que detectó el correo electrónico |
| `$nodeLabel.triggered_at` | Marca de tiempo ISO de la ejecución del workflow |

## Workflow de ejemplo

**Correo de soporte entrante → resumir → enrutar**

```
imapTrigger → llm → condition → slack / sendEmail
```

- Etiqueta de **IMAP Trigger**: `supportInbox`
- Mensaje de usuario de **LLM**: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Notas

- Muchos proveedores requieren una **app password** para el acceso a IMAP en lugar de la contraseña de su cuenta principal.
- El contenido de los archivos adjuntos no se inyecta en la entrada del workflow; solo se incluyen los metadatos de los archivos adjuntos.
- Utilice [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) o [DataTable](./datatable-node.md) de forma posterior para enrutar o registrar el correo nuevo.

## Relacionado

- [Triggers](../reference/triggers.md) – Descripción general de todos los puntos de entrada del workflow
- [Third-Party Integrations](../reference/integrations.md) – Configuración de la credencial IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Añadir y gestionar credenciales `imap`
- [Send Email](./send-email-node.md) – Responder o reenviar mensajes entrantes