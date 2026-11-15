# Google Meet

Găsiți intervale de timp disponibile în Google Calendar și creați, actualizați sau ștergeți invitații la întâlniri cu linkuri Google Meet, adrese de e-mail ale participanților și ore selectate. Contul Google conectat este proprietarul evenimentului; participanții primesc invitațiile prin e-mail.

## Conectați contul dumneavoastră

1. În [Google Cloud Console](https://console.cloud.google.com), activați **Google Calendar API**.
2. Configurați ecranul de consimțământ OAuth și creați un client OAuth de tip **Aplicație web**. Adăugați contul dumneavoastră Google ca utilizator de test dacă aplicația se află în modul de testare.
3. Înregistrați `https://your-heym-domain/api/credentials/google-meet/oauth/callback` ca URI de redirecționare autorizat. Pentru dezvoltare locală, utilizați originea Heym din browserul dumneavoastră cu aceeași cale.
4. Deschideți **Dashboard → Credentials → Nou → Google Meet (OAuth2)**, introduceți un nume, Client ID și Client Secret, apoi faceți clic pe **Conectare** și autentificați-vă cu Google.
5. Acordați ambele permisiuni: Evenimente de calendar (`calendar.events`) și disponibilitate de calendar (`calendar.events.freebusy`). Selectați această acreditare pe nod.

Tokenurile sunt criptate în spațiul de stocare și reîmprospătate automat. Aceasta este o acreditare separată de Google AI, Sheets sau Drive. Un calendar trebuie să accepte conferințele Google Meet pentru ca evenimentul să poată fi creat cu succes.

## Operațiuni

| Operațiune | Comportament | Câmpuri obligatorii |
| --- | --- | --- |
| `read` | Returnează intervalele disponibile și ocupate pentru un calendar | Acreditare |
| `create` | Creează un eveniment programat cu o nouă conferință Meet și invitații prin e-mail | Titlu, oră de început, oră de sfârșit |
| `update` | Actualizează câmpurile furnizate ale evenimentului și notifică oaspeții | ID eveniment și cel puțin un câmp modificat |
| `delete` | Șterge evenimentul și notifică oaspeții cu privire la anulare | ID eveniment |

## Configurare

Câmpurile de text de mai jos acceptă expresii. Toate câmpurile, inclusiv opțiunea booleană pentru detalii, pot fi furnizate de un Agent atunci când acest nod este atașat ca instrument.

| Câmp | Implicit | Scop |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Calendarul principal al contului conectat, sau ID/e-mail al unui calendar accesibil |
| `gmTimeZone` | `UTC` | Zonă IANA, cum ar fi `Europe/Bucharest`, utilizată pentru date locale și timpi de răspuns |
| `gmStartDate` | Ora curentă | Începutul intervalului de citire, ca dată ISO sau datetime |
| `gmEndDate` | Prima zi a lunii următoare la miezul nopții | Sfârșitul exclusiv al intervalului de citire; intervalul maxim este de 60 de zile calendaristice |
| `gmIncludeBusyDetails` | `false` | Doar citire: includeți titlurile evenimentelor și participanții în `busy_slots`; boolean, nu un câmp de expresie |
| `gmEventId` | Gol | ID-ul evenimentului din calendar pentru update/delete; utilizați `event_id` returnat, nu un URL Meet |
| `gmTitle` | Gol | Titlul invitației; obligatoriu la `create` |
| `gmDescription` | Gol | Descrierea invitației |
| `gmStartTime` | Gol | Începutul întâlnirii, de exemplu `2026-11-10T14:00:00+02:00` |
| `gmEndTime` | Gol | Sfârșitul întâlnirii; trebuie să fie după început |
| `gmAttendees` | Gol | E-mailuri separate prin virgulă/punct și virgulă/linie nouă sau matrice JSON de șiruri e-mail |
| `gmLocation` | Gol | Locație opțională a întâlnirii alături de conferința Meet |

### Intervale de timp disponibile

Citirea implicită acoperă perioada de la ora curentă până la **1 a lunii următoare, ora 00:00**, în fusul orar selectat. Trimiteți `gmEndDate` pentru a stabili o fereastră diferită. Un interval de peste 60 de zile sau o dată nevalidă este respins înainte de a apela Google.

Rezultatul se bazează pe API-ul **free/busy** al Google. Intervalele ocupate sunt îmbinate și scăzute din fereastra solicitată. `available_slots` conține intervale continue cu marcaje temporale `start` și `end`.

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

### Includerea detaliilor evenimentelor ocupate

La **Citire intervale de timp disponibile**, activați **Includeți detaliile evenimentelor ocupate** (`gmIncludeBusyDetails: true`) pentru a adăuga titlul și participanții la fiecare interval ocupat. Această opțiune este dezactivată în mod implicit.

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

### Rezervarea unei întâlniri

1. Rulați un nod `read` folosind acreditările proprietarului de workflow.
2. Afișați `available_slots` în interfața dumneavoastră de rezervare.
3. Transmiteți `email`, `startTime` și `endTime` ca intrări de workflow.
4. Rulați `create` cu aceleași acreditări. Vizitatorul nu are nevoie de cont Google; adresa sa de e-mail este înregistrată ca participant.

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

## Ieșire

| Operațiune | Câmpuri de ieșire |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Utilizați `$Availability.available_slots` sau `$Booking.meet_url` în nodurile din aval. Fiecare operațiune returnează de asemenea `status: "success"` și `operation` aferentă.

## Related

- [Credentials](../reference/credentials.md)
- [Integrări terțe](../reference/integrations.md)
- [Partajarea Acreditărilor](../reference/credentials-sharing.md)
- [Nodul **Input**](input-node.md)
- [Output](output-node.md)
