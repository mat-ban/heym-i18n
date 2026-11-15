# Google Meet

Atrodiet pieejamos laika posmus Google Calendar un izveidojiet, atjauniniet vai dzēsiet sapulču ielūgumus ar Google Meet saitēm, dalībnieku e-pastiem un izvēlētajiem laikiem. Pievienotais Google konts ir notikuma īpašnieks; dalībnieki saņem ielūgumus pa e-pastu.

## Konta pievienošana

1. [Google Cloud Console](https://console.cloud.google.com) iespējojiet **Google Calendar API**.
2. Konfigurējiet OAuth piekrišanas ekrānu un izveidojiet **Tīmekļa lietojumprogrammas** OAuth klientu. Pievienojiet savu Google kontu kā testa lietotāju, ja lietotne ir testa režīmā.
3. Reģistrējiet `https://your-heym-domain/api/credentials/google-meet/oauth/callback` kā autorizētu novirzīšanas URI. Vietējai izstrādei izmantojiet pārlūkprogrammas Heym izcelsmi ar to pašu ceļu.
4. Atveriet **Dashboard → Akreditācijas dati → Jauns → Google Meet (OAuth2)**, ievadiet nosaukumu, Client ID un Client Secret, noklikšķiniet uz **Savienot** un piesakieties ar Google.
5. Piešķiriet abas atļaujas: Kalendāra notikumi (`calendar.events`) un kalendāra pieejamība (`calendar.events.freebusy`). Izvēlieties šos akreditācijas datus mezglā.

Pilnvaras tiek šifrētas krātuvē un automātiski atjauninātas. Šie ir atsevišķi akreditācijas dati no Google AI, Sheets vai Drive. Kalendāram ir jāatbalsta Google Meet konferences, lai izveide izdotos.

## Darbības

| Darbība | Rīcība | Nepieciešamie lauki |
| --- | --- | --- |
| `read` | Atgriezt pieejamos un aizņemtos intervālus kalendāram | Akreditācijas dati |
| `create` | Izveidot plānotu notikumu ar jaunu Meet konferenci un e-pasta ielūgumiem | Nosaukums, sākuma laiks, beigu laiks |
| `update` | Atjaunināt norādītos notikuma laukus un informēt viesus | Notikuma ID un vismaz viens mainīts lauks |
| `delete` | Dzēst notikumu un informēt viesus par atcelšanu | Notikuma ID |

## Konfigurācija

Tālāk norādītie teksta lauki pieņem izteiksmes. Visus laukus, tostarp Būla detaļu opciju, var nodrošināt Agent, kad šis mezgls ir pievienots kā rīks.

| Lauks | Noklusējums | Mērķis |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Pievienotā konta primārais kalendārs vai pieejams kalendāra ID/e-pasts |
| `gmTimeZone` | `UTC` | IANA laika josla, piemēram, `Europe/Riga`, ko izmanto vietējiem datumiem un atbildes laikiem |
| `gmStartDate` | Pašreizējais laiks | Lasīšanas diapazona sākums kā ISO datums vai datetime |
| `gmEndDate` | Nākamā mēneša pirmā diena pusnaktī | Lasīšanas diapazona beigas; maksimālais diapazons ir 60 kalendārās dienas |
| `gmIncludeBusyDetails` | `false` | Tikai lasīšanai: iekļaut notikumu nosaukumus un dalībniekus `busy_slots`; Būla vērtība |
| `gmEventId` | Tukšs | Kalendāra notikuma ID darbībām update/delete; izmantojiet atgriezto `event_id`, nevis Meet URL |
| `gmTitle` | Tukšs | Ielūguma nosaukums; nepieciešams izveidē (`create`) |
| `gmDescription` | Tukšs | Ielūguma apraksts |
| `gmStartTime` | Tukšs | Sapulces sākums, piemēram, `2026-11-10T14:00:00+02:00` |
| `gmEndTime` | Tukšs | Sapulces beigas; jābūt pēc sākuma |
| `gmAttendees` | Tukšs | Ar komatu/semikolu/rindiņas pārtraukumu atdalīti e-pasti vai JSON virkņu masīvs |
| `gmLocation` | Tukšs | Papildu sapulces atrašanās vieta līdzās Meet konferencei |

### Pieejamie laika posmi

Noklusējuma lasīšana aptver laiku no pašreizējā brīža līdz **nākamā mēneša 1. datumam plkst. 00:00** izvēlētajā laika joslā. Ievadiet `gmEndDate`, lai norādītu citu laika logu. Diapazons, kas pārsniedz 60 dienas, vai nederīgs datums tiek noraidīts pirms Google izsaukšanas.

Rezultāts ir balstīts uz Google **free/busy** API. Aizņemtie intervāli tiek apvienoti un atskaitīti no pieprasītā loga. `available_slots` satur nepārtrauktus laika posmus ar laika zīmogiem `start` un `end`.

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

### Aizņemto notikumu detaļu iekļaušana

Sadaļā **Lasīt pieejamos laika posmus** iespējojiet opciju **Iekļaut aizņemto notikumu detaļas** (`gmIncludeBusyDetails: true`), lai katram aizņemtajam posmam pievienotu nosaukumu un dalībniekus. Šī opcija pēc noklusējuma ir atspējota.

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

### Sapulces rezervēšana

1. Izpildiet `read` mezglu ar workflow īpašnieka akreditācijas datiem.
2. Parādiet `available_slots` savā rezervācijas saskarnē.
3. Nododiet `email`, `startTime` un `endTime` kā workflow ievades datus.
4. Izpildiet `create` ar tiem pašiem akreditācijas datiem. Apmeklētājam nav nepieciešams Google konts; viņa e-pasts tiek reģistrēts kā dalībnieks.

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

## Izvade

| Darbība | Izvades lauki |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Izmantojiet `$Availability.available_slots` vai `$Booking.meet_url` nākamajos mezglos. Katra darbība atgriež arī `status: "success"` un savu `operation`.

## Saistītie

- [Akreditācijas dati](../reference/credentials.md)
- [Trešo Pušu Integrācijas](../reference/integrations.md)
- [Akreditācijas datu koplietošana](../reference/credentials-sharing.md)
- [Ievades mezgls](input-node.md)
- [Izvade](output-node.md)
