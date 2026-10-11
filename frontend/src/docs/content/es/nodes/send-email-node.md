# Enviar correo electrónico

El nodo **Enviar correo electrónico** envía correos electrónicos mediante SMTP. Úselo para notificaciones, alertas y correos electrónicos transaccionales.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial SMTP de [Credenciales](../tabs/credentials-tab.md) |
| `to` | expression | Destinatario(s). Separados por comas para varios. |
| `cc` | expression | Destinatario(s) en copia de carbón. Separados por comas para varios. |
| `bcc` | expression | Destinatario(s) en copia de carbón oculta. Separados por comas para varios. Ocultos para los demás destinatarios. |
| `subject` | expression | Asunto del correo electrónico |
| `emailBody` | expression | Contenido del cuerpo del correo electrónico |
| `attachments` | expression | IDs de archivos de [Drive](./drive-node.md) separados por comas que se van a adjuntar. Solo se pueden adjuntar archivos propiedad del propietario del workflow o compartidos con uno de sus equipos. |

## Adjuntos

Adjunte archivos desde su [Drive](./drive-node.md) pasando uno o varios IDs de archivos de Drive al campo `attachments`. Utilice una expresión `$` para hacer referencia a la salida `id` de un nodo Drive anterior (por ejemplo, `$drive.id`), o enumere IDs estáticos separados por comas. Cada ID se resuelve en el ámbito del propietario del workflow; un ID no válido o inaccesible hace fallar el nodo en lugar de enviar un correo electrónico parcial.

## Configuración

Añada una credencial SMTP con servidor, puerto, correo electrónico y contraseña. Servidores SMTP comunes:

- Gmail: `smtp.gmail.com`, puerto 587 (se requiere contraseña de aplicación)
- Outlook: `smtp.office365.com`, puerto 587

## Ejemplo

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

El valor de `attachments` anterior hace referencia a un nodo [Drive](./drive-node.md) anterior etiquetado como `drive`, adjuntando el archivo que produjo.

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Gestor de errores](./error-handler-node.md) – Enviar correo electrónico en caso de fallo
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añadir credenciales SMTP
- [Integraciones de terceros](../reference/integrations.md#smtp-email) – Configuración de proveedores SMTP (Gmail, Outlook, Mailgun, SendGrid)