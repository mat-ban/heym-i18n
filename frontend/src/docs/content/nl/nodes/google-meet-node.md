# Google Meet

Vind beschikbare Google Calendar-tijdvakken en maak, werk bij of verwijder vergaderuitnodigingen met Google Meet-links, e-mailadressen van genodigden en geselecteerde tijden. Het gekoppelde Google-account is eigenaar van de afspraak; deelnemers ontvangen uitnodigingen per e-mail.

## Uw account koppelen

1. Schakel in de [Google Cloud Console](https://console.cloud.google.com) de **Google Calendar API** in.
2. Configureer het OAuth-toestemmingsscherm en maak een OAuth-client van het type **Webapplicatie** aan. Voeg uw Google-account toe als testgebruiker als de app zich in de testmodus bevindt.
3. Registreer `https://your-heym-domain/api/credentials/google-meet/oauth/callback` als geautoriseerde omleidings-URI. Gebruik voor lokale ontwikkeling de Heym-origin van uw browser met hetzelfde pad.
4. Open **Dashboard → Referenties → Nieuw → Google Meet (OAuth2)**, voer een naam, Client ID en Client Secret in, klik op **Verbinden** en meld u aan met Google.
5. Verleen beide machtigingen: Agenda-afspraken (`calendar.events`) en agendabeschikbaarheid (`calendar.events.freebusy`). Selecteer deze referentie op de node.

Tokens worden versleuteld opgeslagen en automatisch vernieuwd. Dit is een afzonderlijke referentie naast Google AI, Sheets of Drive. Een agenda moet Google Meet-vergaderingen ondersteunen om de aanmaak te laten slagen.

## Bewerkingen

| Bewerking | Gedrag | Vereiste velden |
| --- | --- | --- |
| `read` | Beschikbare en bezette intervallen voor een agenda retourneren | Referentie |
| `create` | Geplande afspraak maken met een nieuwe Meet-conferentie en e-mailuitnodigingen | Titel, starttijd, eindtijd |
| `update` | Opgegeven afspraakvelden bijwerken en gasten op de hoogte stellen | Afspraak-ID en ten minste één gewijzigd veld |
| `delete` | Afspraak verwijderen en gasten informeren over de annulering | Afspraak-ID |

## Configuratie

De onderstaande tekstvelden accepteren expressies. Alle velden, inclusief de booleaanse detailoptie, kunnen worden geleverd door een Agent wanneer deze node als tool is gekoppeld.

| Veld | Standaard | Doel |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Primaire agenda van het gekoppelde account, of toegankelijke agenda-ID/e-mail |
| `gmTimeZone` | `UTC` | IANA-zone, zoals `Europe/Amsterdam`, gebruikt voor lokale datums en reactietijden |
| `gmStartDate` | Huidige tijd | Start van het leesbereik, als ISO-datum of datetime |
| `gmEndDate` | Eerste dag van de volgende maand om middernacht | Exclusief einde van het leesbereik; maximaal bereik is 60 kalenderdagen |
| `gmIncludeBusyDetails` | `false` | Alleen-lezen: afspraaktitels en deelnemers opnemen in `busy_slots`; boolean, geen expressieveld |
| `gmEventId` | Leeg | Agenda-afspraak-ID voor update/delete; gebruik de geretourneerde `event_id`, geen Meet-URL |
| `gmTitle` | Leeg | Uitnodigingstitel; vereist bij `create` |
| `gmDescription` | Leeg | Beschrijving van de uitnodiging |
| `gmStartTime` | Leeg | Start van de vergadering, bijv. `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Leeg | Einde van de vergadering; moet na de starttijd liggen |
| `gmAttendees` | Leeg | Door komma's/puntkomma's/regeleinden gescheiden e-mails of JSON-array van e-mailstrings |
| `gmLocation` | Leeg | Optionele vergaderlocatie naast de Meet-conferentie |

### Beschikbare tijdvakken

De standaard leesbewerking beslaat de periode van de huidige tijd tot **de 1e van de volgende maand, 00:00 uur** in de geselecteerde tijdzone. Geef `gmEndDate` op om een ander tijdvenster in te stellen. Een bereik van meer dan 60 dagen of een ongeldige datum wordt geweigerd voordat Google wordt aangeroepen.

Het resultaat is gebaseerd op Google's **free/busy**-API. Bezette intervallen worden samengevoegd en afgetrokken van het aangevraagde venster. `available_slots` bevat aaneengesloten tijdvakken met tijdstempels voor `start` en `end`.

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

### Details van bezette afspraken toevoegen

Schakel onder **Beschikbare tijdvakken lezen** de optie **Details van bezette afspraken toevoegen** (`gmIncludeBusyDetails: true`) in om de titel en deelnemers aan elk bezet slot toe te voegen. Deze optie is standaard uitgeschakeld.

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

### Een afspraak boeken

1. Voer een `read`-node uit met de inloggegevens van de workflow-eigenaar.
2. Toon `available_slots` in uw boekingsinterface.
3. Geef `email`, `startTime` en `endTime` door als workflow-invoer.
4. Voer `create` uit met dezelfde inloggegevens. De bezoeker heeft geen Google-account nodig; zijn e-mailadres wordt als deelnemer geregistreerd.

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

## Uitvoer

| Bewerking | Uitvoervelden |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Gebruik `$Availability.available_slots` of `$Booking.meet_url` in downstream nodes. Elke bewerking retourneert tevens `status: "success"` en de bijbehorende `operation`.

## Gerelateerd

- [Referenties](../reference/credentials.md)
- [Integraties van Derden](../reference/integrations.md)
- [Referenties delen](../reference/credentials-sharing.md)
- [Input](input-node.md)
- [Output](output-node.md)
