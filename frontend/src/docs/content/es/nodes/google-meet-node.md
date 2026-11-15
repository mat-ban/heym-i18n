# Google Meet

Encuentre intervalos disponibles en Google Calendar y cree, actualice o elimine invitaciones a reuniones con enlaces de Google Meet, correos de asistentes y horas seleccionadas. La cuenta de Google conectada es la propietaria del evento; los asistentes reciben invitaciones por correo electrónico.

## Conectar su cuenta

1. En [Google Cloud Console](https://console.cloud.google.com), habilite la **Google Calendar API**.
2. Configure la pantalla de consentimiento de OAuth y cree un cliente OAuth de tipo **Aplicación web**. Añada su cuenta de Google como usuario de prueba si la aplicación está en modo de prueba.
3. Registre `https://your-heym-domain/api/credentials/google-meet/oauth/callback` como URI de redirección autorizada. Para desarrollo local, use el origen de Heym de su navegador con la misma ruta.
4. Abra **Dashboard → Credenciales → Nuevo → Google Meet (OAuth2)**, introduzca un nombre, Client ID y Client Secret, haga clic en **Conectar** e inicie sesión con Google.
5. Otorgue ambos permisos: Eventos de calendario (`calendar.events`) y disponibilidad de calendario (`calendar.events.freebusy`). Seleccione esta credencial en el nodo.

Los tokens se cifran en el almacenamiento y se renuevan automáticamente. Es una credencial independiente de Google AI, Sheets o Drive. Un calendario debe admitir videoconferencias de Google Meet para que la creación se realice correctamente.

## Operaciones

| Operación | Comportamiento | Campos requeridos |
| --- | --- | --- |
| `read` | Devolver intervalos libres y ocupados para un calendario | Credencial |
| `create` | Crear un evento programado con una nueva conferencia Meet e invitaciones por correo | Título, hora de inicio, hora de fin |
| `update` | Actualizar los campos proporcionados del evento y notificar a los invitados | ID del evento y al menos un campo modificado |
| `delete` | Eliminar el evento y notificar a los invitados sobre la cancelación | ID del evento |

## Configuración

Los campos de texto a continuación admiten expresiones. Todos los campos, incluida la opción booleana de detalles, pueden ser suministrados por un Agent cuando este nodo se adjunta como herramienta.

| Campo | Por defecto | Propósito |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Calendario principal de la cuenta conectada, o ID/correo de calendario accesible |
| `gmTimeZone` | `UTC` | Zona IANA, como `Europe/Madrid`, utilizada para fechas locales y tiempos de respuesta |
| `gmStartDate` | Hora actual | Inicio del rango de lectura, como fecha ISO o datetime |
| `gmEndDate` | Primer día del mes siguiente a medianoche | Fin exclusivo del rango de lectura; el rango máximo es de 60 días naturales |
| `gmIncludeBusyDetails` | `false` | Solo lectura: incluir títulos de eventos y asistentes en `busy_slots`; booleano, no un campo de expresión |
| `gmEventId` | Vacío | ID del evento de calendario para update/delete; use el `event_id` devuelto, no una URL de Meet |
| `gmTitle` | Vacío | Título de la invitación; obligatorio en `create` |
| `gmDescription` | Vacío | Descripción de la invitación |
| `gmStartTime` | Vacío | Inicio de la reunión, por ejemplo `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Vacío | Fin de la reunión; debe ser posterior al inicio |
| `gmAttendees` | Vacío | Correos separados por comas/puntos y coma/saltos de línea o array JSON de cadenas de correo |
| `gmLocation` | Vacío | Ubicación opcional de la reunión junto a la conferencia Meet |

### Intervalos de tiempo disponibles

La lectura predeterminada abarca desde la hora actual hasta el **día 1 del mes siguiente a las 00:00**, en la zona horaria seleccionada. Pase `gmEndDate` para definir una ventana diferente. Un rango superior a 60 días o una fecha no válida se rechaza antes de llamar a Google.

El resultado se basa en la API **free/busy** de Google. Los intervalos ocupados se combinan y se restan de la ventana solicitada. `available_slots` contiene huecos continuos con marcas de tiempo `start` y `end`.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Availability",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "read",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmStartDate": "2026-11-06",
    "gmEndDate": "2026-11-13"
  }
}
```

### Incluir detalles de eventos ocupados

En **Leer intervalos de tiempo disponibles**, habilite **Incluir detalles de eventos ocupados** (`gmIncludeBusyDetails: true`) para añadir el título y los asistentes a cada slot ocupado. Esta opción está deshabilitada por defecto.

```json
{
  "start": "2026-11-06T21:15:00+01:00",
  "end": "2026-11-06T21:30:00+01:00",
  "title": "Daily check-in",
  "attendees": [
    "colleague@example.com"
  ]
}
```

### Reservar una cita

1. Ejecute un nodo `read` con la credencial del propietario del workflow.
2. Muestre `available_slots` en su interfaz de reservas.
3. Pase `email`, `startTime` y `endTime` como entradas del workflow.
4. Ejecute `create` con la misma credencial. El visitante no necesita una cuenta de Google; su correo se registra como asistente.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Booking",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "create",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmTitle": "Meet with me",
    "gmDescription": "A meeting booked through Heym",
    "gmAttendees": "$input.email",
    "gmStartTime": "$input.startTime",
    "gmEndTime": "$input.endTime"
  }
}
```

## Salida

| Operación | Campos de salida |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Utilice `$Availability.available_slots` o `$Booking.meet_url` en nodos descendentes. Cada operación también devuelve `status: "success"` y su `operation`.

## Relacionado

- [Credenciales](../reference/credentials.md)
- [Integraciones](../reference/integrations.md)
- [Uso compartido de Credenciales](../reference/credentials-sharing.md)
- [Input](input-node.md)
- [Output](output-node.md)
