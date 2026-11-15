# Google Meet

Find ledige tidsrum i Google Calendar og opret, opdater eller slet mødeindbydelser med Google Meet-links, deltager-e-mails og udvalgte tidspunkter. Den tilknyttede Google-konto ejer begivenheden; deltagere modtager invitationer via e-mail.

## Forbind konto

1. Aktivér **Google Calendar API** i [Google Cloud Console](https://console.cloud.google.com).
2. Konfigurér OAuth-samtykkeskærmen og opret en OAuth-klient til **Webapplikation**. Tilføj din Google-konto som testbruger, hvis appen er i testtilstand.
3. Registrér `https://your-heym-domain/api/credentials/google-meet/oauth/callback` som autoriseret omdirigerings-URI. Til lokal udvikling anvendes browserens Heym-oprindelse med samme sti.
4. Åbn **Dashboard → Legitimationsoplysninger → Ny → Google Meet (OAuth2)**, indtast navn, Client ID og Client Secret, klik på **Forbind** og log ind med Google.
5. Tildel begge tilladelser: Kalenderbegivenheder (`calendar.events`) og kalendertilgængelighed (`calendar.events.freebusy`). Vælg denne credential på noden.

Tokens krypteres under lagring og fornys automatisk. Dette er en separat credential fra Google AI, Sheets eller Drive. En kalender skal understøtte Google Meet-konferencer for at oprettelsen lykkes.

## Handlinger

| Handling | Adfærd | Påkrævede felter |
| --- | --- | --- |
| `read` | Returnér ledige og optagede intervaller for en kalender | Credential |
| `create` | Opret en tidsbestemt begivenhed med en ny Meet-konference og e-mailinvitationer | Titel, starttidspunkt, sluttidspunkt |
| `update` | Opdatér angivne begivenhedsfelter og underret gæsterne | Begivenheds-ID og mindst ét ændret felt |
| `delete` | Slet begivenheden og underret gæsterne om aflysningen | Begivenheds-ID |

## Konfiguration

Tekstfelterne nedenfor accepterer udtryk. Alle felter, inklusive den booleske detaljeindstilling, kan leveres af en Agent, når denne node er tilknyttet som et værktøj.

| Felt | Standard | Formål |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Tilknyttet kontos primære kalender, eller tilgængeligt kalender-ID/e-mail |
| `gmTimeZone` | `UTC` | IANA-tidszone, f.eks. `Europe/Copenhagen`, brugt til lokale datoer og svartider |
| `gmStartDate` | Aktuel tid | Start på læseintervallet, som en ISO-dato eller datetime |
| `gmEndDate` | Første dag i den følgende måned ved midnat | Eksklusiv slutning på læseintervallet; maksimalt interval er 60 kalenderdage |
| `gmIncludeBusyDetails` | `false` | Skrivebeskyttet: inkluder begivenhedstitler og deltagere i `busy_slots`; boolesk, ikke et udtryksfelt |
| `gmEventId` | Tom | Kalenderbegivenheds-ID til update/delete; brug det returnerede `event_id`, ikke en Meet-URL |
| `gmTitle` | Tom | Invitationstitel; påkrævet ved `create` |
| `gmDescription` | Tom | Invitationsbeskrivelse |
| `gmStartTime` | Tom | Mødestart, f.eks. `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Tom | Mødeslut; skal ligge efter start |
| `gmAttendees` | Tom | Komma-/semikolon-/linjeskift-adskilte e-mails eller JSON-array af e-mailstrenge |
| `gmLocation` | Tom | Valgfri mødeplacering ved siden af Meet-konferencen |

### Ledige tidsrum

Standardlæsningen dækker perioden fra aktuel tid frem til **den 1. i den følgende måned kl. 00:00** i den valgte tidszone. Angiv `gmEndDate` for at definere et andet tidsvindue. Et interval på over 60 dage eller en ugyldig dato afvises, før Google kaldes.

Resultatet er baseret på Googles **free/busy**-API. Optagede intervaller flettes og fratrækkes det anmodede vindue. `available_slots` indeholder kontinuerlige tidsrum med tidsstempler for `start` og `end`.

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

### Medtag detaljer for optagede begivenheder

Under **Læs ledige tidsrum**, aktivér **Medtag detaljer for optagede begivenheder** (`gmIncludeBusyDetails: true`) for at tilføje titel og deltagere til hvert optaget tidsrum. Denne indstilling er deaktiveret som standard.

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

### Book et møde

1. Kør en `read`-node med workflow-ejerens credentials.
2. Vis `available_slots` i din bookinggrænseflade.
3. Videregiv `email`, `startTime` og `endTime` som workflow-input.
4. Kør `create` med de samme credentials. Den besøgende behøver ingen Google-konto; dennes e-mail registreres som deltager.

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

## Output

| Handling | Outputfelter |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Brug `$Availability.available_slots` eller `$Booking.meet_url` i efterfølgende noder. Hver handling returnerer også `status: "success"` samt den tilhørende `operation`.

## Related

- [Legitimationsoplysninger](../reference/credentials.md)
- [Third-Party Integrations](../reference/integrations.md)
- [Deling af legitimationsoplysninger](../reference/credentials-sharing.md)
- [Input](input-node.md)
- [Output](output-node.md)
