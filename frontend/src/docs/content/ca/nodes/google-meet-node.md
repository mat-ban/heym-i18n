# Google Meet

Trobeu intervals de temps disponibles a Google Calendar i creeu, actualitzeu o elimineu invitacions a reunions amb enllaços de Google Meet, correus electrònics d'assistents i hores seleccionades. El compte de Google connectat és el propietari de l'esdeveniment; els assistents reben les invitacions per correu electrònic.

## Connectar el vostre compte

1. A la [Google Cloud Console](https://console.cloud.google.com), activeu la **Google Calendar API**.
2. Configureu la pantalla de consentiment OAuth i creeu un client OAuth d'**Aplicació web**. Afegiu el vostre compte de Google com a usuari de prova si l'aplicació està en mode de prova.
3. Registreu `https://your-heym-domain/api/credentials/google-meet/oauth/callback` com a URI de redirecció autoritzada. Per al desenvolupament local, feu servir l'origen de Heym del vostre navegador amb el mateix camí.
4. Obriu **Dashboard → Credencials → Nou → Google Meet (OAuth2)**, introduïu un nom, Client ID i Client Secret, feu clic a **Connectar** i inicieu sessió amb Google.
5. Concediu tots dos permisos: Esdeveniments de calendari (`calendar.events`) i disponibilitat de calendari (`calendar.events.freebusy`). Seleccioneu aquesta credencial al node.

Els tokens es xifren a l'emmagatzematge i s'actualitzen automàticament. És una credencial independent de Google AI, Sheets o Drive. Un calendari ha de ser compatible amb conferències de Google Meet perquè la creació tingui èxit.

## Operacions

| Operació | Comportament | Camps obligatoris |
| --- | --- | --- |
| `read` | Retornar intervals disponibles i ocupats per a un calendari | Credencial |
| `create` | Crear un esdeveniment programat amb una nova conferència Meet i invitacions per correu | Títol, hora d'inici, hora de finalització |
| `update` | Actualitzar els camps d'esdeveniment indicats i notificar els convidats | ID de l'esdeveniment i almenys un camp modificat |
| `delete` | Eliminar l'esdeveniment i notificar els convidats de la cancel·lació | ID de l'esdeveniment |

## Configuració

Els camps de text següents accepten expressions. Tots els camps, inclosa l'opció booleana de detalls, poden ser proporcionats per un Agent quan aquest node s'adjunta com a eina.

| Camp | Per defecte | Propòsit |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Calendari principal del compte connectat, o ID/correu de calendari accessible |
| `gmTimeZone` | `UTC` | Zona IANA, com ara `Europe/Madrid`, utilitzada per a dates locals i temps de resposta |
| `gmStartDate` | Hora actual | Inici de l'interval de lectura, com a data o datetime ISO |
| `gmEndDate` | Primer dia del mes següent a mitjanit | Final exclusiu de l'interval de lectura; l'interval màxim és de 60 dies naturals |
| `gmIncludeBusyDetails` | `false` | Només lectura: incloure títols d'esdeveniments i assistents a `busy_slots`; booleà, no un camp d'expressió |
| `gmEventId` | Buit | ID d'esdeveniment de calendari per a update/delete; feu servir l'`event_id` retornat, no un URL de Meet |
| `gmTitle` | Buit | Títol de la invitació; obligatori a `create` |
| `gmDescription` | Buit | Descripció de la invitació |
| `gmStartTime` | Buit | Inici de la reunió, per exemple `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Buit | Final de la reunió; ha de ser posterior a l'inici |
| `gmAttendees` | Buit | Correus separats per comes/punts i coma/salts de línia o matriu JSON de cadenes de correu |
| `gmLocation` | Buit | Ubicació opcional de la reunió juntament amb la conferència Meet |

### Intervals de temps disponibles

La lectura per defecte abasta des de l'hora actual fins al **dia 1 del mes següent a les 00:00**, a la zona horària seleccionada. Passeu `gmEndDate` per establir una finestra diferent. Un interval de més de 60 dies o una data no vàlida es rebutja abans de trucar a Google.

El resultat es basa en l'API **free/busy** de Google. Els intervals ocupats es combinen i es resten de la finestra sol·licitada. `available_slots` conté buits continus amb marques de temps `start` i `end`.

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

### Incloure detalls d'esdeveniments ocupats

A **Llegir intervals de temps disponibles**, activeu **Incloure detalls d'esdeveniments ocupats** (`gmIncludeBusyDetails: true`) per afegir el títol i els assistents a cada ranura ocupada. Aquesta opció està desactivada per defecte.

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

### Reservar una reunió

1. Executeu un node `read` amb la credencial del propietari del workflow.
2. Mostreu `available_slots` a la vostra interfície de reserves.
3. Passeu `email`, `startTime` i `endTime` com a entrades del workflow.
4. Executeu `create` amb la mateixa credencial. El visitant no necessita compte de Google; el seu correu es registra com a assistent.

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

## Sortida

| Operació | Camps de sortida |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Utilitzeu `$Availability.available_slots` o `$Booking.meet_url` en nodes posteriors. Cada operació també retorna `status: "success"` i la seva `operation`.

## Related

- [Credencials](../reference/credentials.md)
- [Integracions](../reference/integrations.md)
- [Compartició de credencials](../reference/credentials-sharing.md)
- [Input](input-node.md)
- [Sortida](output-node.md)
