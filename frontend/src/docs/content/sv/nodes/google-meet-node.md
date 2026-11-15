# Google Meet

Hitta tillgängliga tidsluckor i Google Calendar och skapa, uppdatera eller ta bort mötesinbjudningar med Google Meet-länkar, deltagares e-postadresser och valda tider. Det anslutna Google-kontot äger händelsen; deltagare får inbjudningar via e-post.

## Anslut konto

1. Aktivera **Google Calendar API** i [Google Cloud Console](https://console.cloud.google.com).
2. Konfigurera OAuth-samtyckesskärmen och skapa en OAuth-klient för **Webbapplikation**. Lägg till ditt Google-konto som testanvändare om appen är i testläge.
3. Registrera `https://your-heym-domain/api/credentials/google-meet/oauth/callback` som auktoriserad omdirigerings-URI. För lokal utveckling används webbläsarens Heym-ursprung med samma sökväg.
4. Öppna **Dashboard → Credentials → Ny → Google Meet (OAuth2)**, ange namn, Client ID och Client Secret, klicka på **Anslut** och logga in med Google.
5. Bevilja båda behörigheterna: Kalenderhändelser (`calendar.events`) och kalendertillgänglighet (`calendar.events.freebusy`). Välj denna credential på noden.

Tokens krypteras i lagringen och förnyas automatiskt. Detta är en separat credential från Google AI, Sheets eller Drive. En kalender måste stödja Google Meet-konferenser för att skapandet ska lyckas.

## Åtgärder

| Åtgärd | Beteende | Obligatoriska fält |
| --- | --- | --- |
| `read` | Returnera tillgängliga och upptagna intervall för en kalender | Credential |
| `create` | Skapa en tidsbestämd händelse med en ny Meet-konferens och e-postinbjudningar | Titel, starttid, sluttid |
| `update` | Uppdatera angivna händelsefält och meddela gästerna | Händelse-ID och minst ett ändrat fält |
| `delete` | Ta bort händelsen och meddela gästerna om avbokningen | Händelse-ID |

## Konfiguration

Textfälten nedan accepterar uttryck. Samtliga fält, inklusive det booleska alternativet för detaljer, kan tillhandahållas av en Agent när denna nod är kopplad som ett verktyg.

| Fält | Standard | Syfte |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Anslutet kontos primära kalender, eller tillgängligt kalender-ID/e-post |
| `gmTimeZone` | `UTC` | IANA-tidszon, till exempel `Europe/Stockholm`, som används för lokala datum och svarstider |
| `gmStartDate` | Aktuell tid | Start för läsintervallet, som ett ISO-datum eller datetime |
| `gmEndDate` | Första dagen i följande månad vid midnatt | Exklusivt slut för läsintervallet; maximalt intervall är 60 kalenderdagar |
| `gmIncludeBusyDetails` | `false` | Endast läsning: inkludera händelsetitlar och deltagare i `busy_slots`; boolesk, inte ett uttrycksfält |
| `gmEventId` | Tomt | Kalenderhändelse-ID för update/delete; använd returnerat `event_id`, inte en Meet-URL |
| `gmTitle` | Tomt | Inbjudningstitel; obligatorisk vid `create` |
| `gmDescription` | Tomt | Inbjudningsbeskrivning |
| `gmStartTime` | Tomt | Mötesstart, till exempel `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Tomt | Mötesslut; måste vara efter start |
| `gmAttendees` | Tomt | Komma-/semikolon-/radbrytningsseparerade e-postadresser eller JSON-array med e-poststrängar |
| `gmLocation` | Tomt | Valfri mötesplats vid sidan av Meet-konferensen |

### Tillgängliga tidsluckor

Standardläsningen omfattar perioden från aktuell tid fram till **den 1:a i nästa månad kl. 00:00** i vald tidszon. Ange `gmEndDate` för att definiera ett annat tidsfönster. Ett intervall på över 60 dagar eller ett ogiltigt datum avvisas innan Google anropas.

Resultatet baseras på Googles **free/busy**-API. Upptagna intervall slås samman och dras ifrån det begärda fönstret. `available_slots` innehåller sammanhängande tidsluckor med tidsstämplar för `start` och `end`.

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

### Inkludera detaljer om upptagna händelser

Under **Läs tillgängliga tidsluckor**, aktivera **Inkludera detaljer om upptagna händelser** (`gmIncludeBusyDetails: true`) för att lägga till titel och deltagare till varje upptagen lucka. Detta alternativ är inaktiverat som standard.

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

### Boka ett möte

1. Kör en `read`-nod med workflow-ägarens credentials.
2. Visa `available_slots` i ditt bokningsgränssnitt.
3. Skicka `email`, `startTime` och `endTime` som workflow-indata.
4. Kör `create` med samma credentials. Besökaren behöver inget Google-konto; dennes e-post registreras som deltagare.

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

## Utdata

| Åtgärd | Utdatafält |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Använd `$Availability.available_slots` eller `$Booking.meet_url` i efterföljande noder. Varje åtgärd returnerar även `status: "success"` samt tillhörande `operation`.

## Relaterat

- [Credentials](../reference/credentials.md)
- [Tredjepartsintegrationer](../reference/integrations.md)
- [Delning av autentiseringsuppgifter](../reference/credentials-sharing.md)
- [Input](input-node.md)
- [Output](output-node.md)
