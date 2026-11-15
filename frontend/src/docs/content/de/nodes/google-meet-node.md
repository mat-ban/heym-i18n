# Google Meet

Finden Sie verfügbare Google Calendar-Zeitfenster und erstellen, aktualisieren oder löschen Sie Meeting-Einladungen mit Google Meet-Links, Teilnehmer-E-Mails und ausgewählten Zeiten. Das verbundene Google-Konto ist Eigentümer des Termins; Teilnehmer erhalten Einladungen per E-Mail.

## Konto verbinden

1. Aktivieren Sie in der [Google Cloud Console](https://console.cloud.google.com) die **Google Calendar API**.
2. Konfigurieren Sie den OAuth-Zustimmungsbildschirm und erstellen Sie einen OAuth-Client für **Webanwendungen**. Fügen Sie Ihr Google-Konto als Testbenutzer hinzu, wenn sich die App im Testmodus befindet.
3. Registrieren Sie `https://your-heym-domain/api/credentials/google-meet/oauth/callback` als autorisierte Weiterleitungs-URI. Verwenden Sie für die lokale Entwicklung die Heym-Origin Ihres Browsers mit demselben Pfad.
4. Öffnen Sie **Dashboard → Anmeldedaten → Neu → Google Meet (OAuth2)**, geben Sie einen Namen, eine Client-ID und ein Client-Secret ein, klicken Sie auf **Verbinden** und melden Sie sich mit Google an.
5. Gewähren Sie beide Berechtigungen: Kalendertermine (`calendar.events`) und Kalenderverfügbarkeit (`calendar.events.freebusy`). Wählen Sie diese Anmeldedaten im Knoten aus.

Token werden im Speicher verschlüsselt und automatisch aktualisiert. Dies ist ein separates Credential von Google AI, Sheets oder Drive. Ein Kalender muss Google Meet-Konferenzen unterstützen, damit die Erstellung erfolgreich ist.

## Operationen

| Operation | Verhalten | Erforderliche Felder |
| --- | --- | --- |
| `read` | Verfügbare und belegte Intervalle für einen Kalender zurückgeben | Anmeldedaten |
| `create` | Zeitgesteuerten Termin mit neuer Meet-Konferenz und E-Mail-Einladungen erstellen | Titel, Startzeit, Endzeit |
| `update` | Übergebene Terminfelder anpassen und Gäste benachrichtigen | Termin-ID und mindestens ein geändertes Feld |
| `delete` | Termin löschen und Gäste über Absage benachrichtigen | Termin-ID |

## Konfiguration

Die folgenden Textfelder akzeptieren Ausdrücke. Alle Felder, einschließlich der booleschen Detailoption, können von einem Agent bereitgestellt werden, wenn dieser Knoten als Tool angehängt ist.

| Feld | Standard | Zweck |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Primärer Kalender des verbundenen Kontos oder zugängliche Kalender-ID/E-Mail |
| `gmTimeZone` | `UTC` | IANA-Zeitzone, wie z. B. `Europe/Berlin`, für lokale Datums- und Antwortzeiten |
| `gmStartDate` | Aktuelle Zeit | Start des Lesezeitraums als ISO-Datum oder Datetime |
| `gmEndDate` | Erster Tag des Folgemonats um Mitternacht | Exklusives Ende des Lesezeitraums; maximaler Bereich beträgt 60 Kalendertage |
| `gmIncludeBusyDetails` | `false` | Nur Lesen: Termintitel und Teilnehmer in `busy_slots` einbeziehen; Boolesch, kein Ausdrucksfeld |
| `gmEventId` | Leer | Kalendertermin-ID für Update/Delete; verwenden Sie die zurückgegebene `event_id`, keine Meet-URL |
| `gmTitle` | Leer | Einladungstitel; erforderlich bei `create` |
| `gmDescription` | Leer | Einladungsbeschreibung |
| `gmStartTime` | Leer | Meeting-Start, z. B. `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Leer | Meeting-Ende; muss nach dem Start liegen |
| `gmAttendees` | Leer | Komma-/Semikolon-/Zeilenumbruch-getrennte E-Mails oder JSON-Array von E-Mail-Strings |
| `gmLocation` | Leer | Optionaler Meeting-Ort neben der Meet-Konferenz |

### Verfügbare Zeitfenster

Der Standard-Lesevorgang deckt den Zeitraum von der aktuellen Zeit bis zum **1. des Folgemonats, 00:00 Uhr** in der gewählten Zeitzone ab. Übergeben Sie `gmEndDate`, um ein anderes Zeitfenster festzulegen. Ein Bereich über 60 Tage oder ein ungültiges Datum wird vor dem Aufruf von Google abgewiesen.

Das Ergebnis basiert auf Googles **free/busy**-API. Belegte Intervalle werden zusammengeführt und vom angeforderten Zeitfenster abgezogen. `available_slots` enthält kontinuierliche Lücken mit Zeitstempeln für `start` und `end`.

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

### Belegte Termindetails einbeziehen

Aktivieren Sie unter **Verfügbare Zeitfenster lesen** die Option **Belegte Termindetails einbeziehen** (`gmIncludeBusyDetails: true`), um Titel und Teilnehmer zu jedem belegten Slot hinzuzufügen. Diese Option ist standardmäßig deaktiviert.

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

### Termin buchen

1. Führen Sie einen `read`-Knoten mit den Anmeldedaten des Workflow-Eigentümers aus.
2. Zeigen Sie `available_slots` in Ihrer Buchungsoberfläche an.
3. Übergeben Sie `email`, `startTime` und `endTime` als Workflow-Eingaben.
4. Führen Sie `create` mit denselben Anmeldedaten aus. Der Besucher benötigt kein Google-Konto; seine E-Mail wird als Teilnehmer eingetragen.

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

## Ausgabe

| Operation | Ausgabefelder |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Verwenden Sie `$Availability.available_slots` oder `$Booking.meet_url` in nachgelagerten Knoten. Jeder Vorgang gibt außerdem `status: "success"` und seine `operation` zurück.

## Verwandte Themen

- [Anmeldedaten](../reference/credentials.md)
- [Integrationen](../reference/integrations.md)
- [Freigabe von Anmeldedaten](../reference/credentials-sharing.md)
- [Eingabe](input-node.md)
- [Ausgabe](output-node.md)
