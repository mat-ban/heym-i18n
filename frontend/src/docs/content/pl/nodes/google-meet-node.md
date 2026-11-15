# Google Meet

Wyszukuj dostępne przedziały czasowe w Google Calendar oraz twórz, aktualizuj lub usuwaj zaproszenia na spotkania z linkami Google Meet, adresami e-mail uczestników i wybranymi godzinami. Połączone konto Google jest właścicielem wydarzenia; uczestnicy otrzymują zaproszenia pocztą e-mail.

## Połącz swoje konto

1. W [Google Cloud Console](https://console.cloud.google.com) włącz **Google Calendar API**.
2. Skonfiguruj ekran zgody OAuth i utwórz klienta OAuth typu **Aplikacja internetowa**. Dodaj swoje konto Google jako użytkownika testowego, jeśli aplikacja działa w trybie testowym.
3. Zarejestruj `https://your-heym-domain/api/credentials/google-meet/oauth/callback` jako autoryzowany URI przekierowania. W przypadku środowiska lokalnego użyj adresu Heym w przeglądarce z tą samą ścieżką.
4. Otwórz **Dashboard → Dane logowania → Nowy → Google Meet (OAuth2)**, wprowadź nazwę, Client ID i Client Secret, kliknij **Połącz** i zaloguj się przez Google.
5. Przyznaj oba uprawnienia: Wydarzenia w kalendarzu (`calendar.events`) oraz dostępność w kalendarzu (`calendar.events.freebusy`). Wybierz te dane logowania w węźle.

Tokeny są szyfrowane w magazynie i odnawiane automatycznie. Jest to osobne credential od Google AI, Sheets czy Drive. Kalendarz musi obsługiwać wideokonferencje Google Meet, aby tworzenie spotkań zakończyło się powodzeniem.

## Operacje

| Operacja | Zachowanie | Wymagane pola |
| --- | --- | --- |
| `read` | Zwraca wolne i zajęte przedziały czasowe dla kalendarza | Dane logowania |
| `create` | Tworzy zaplanowane wydarzenie z nową konferencją Meet i zaproszeniami e-mail | Tytuł, czas rozpoczęcia, czas zakończenia |
| `update` | Aktualizuje podane pola wydarzenia i powiadamia gości | ID wydarzenia i co najmniej jedno zmienione pole |
| `delete` | Usuwa wydarzenie i powiadamia gości o odwołaniu | ID wydarzenia |

## Konfiguracja

Poniższe pola tekstowe akceptują wyrażenia. Wszystkie pola, w tym logiczna opcja szczegółów, mogą być dostarczone przez Agenta, gdy ten węzeł jest dołączony jako narzędzie.

| Pole | Domyślnie | Przeznaczenie |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Główny kalendarz połączonego konta lub dostępny ID/e-mail kalendarza |
| `gmTimeZone` | `UTC` | Strefa IANA, np. `Europe/Warsaw`, używana do lokalnych dat i czasów odpowiedzi |
| `gmStartDate` | Aktualny czas | Początek zakresu odczytu jako data ISO lub datetime |
| `gmEndDate` | Pierwszy dzień następnego miesiąca o północy | Wyłączny koniec zakresu odczytu; maksymalny zakres wynosi 60 dni kalendarzowych |
| `gmIncludeBusyDetails` | `false` | Tylko do odczytu: uwzględnij tytuły wydarzeń i uczestników w `busy_slots`; boolean |
| `gmEventId` | Puste | ID wydarzenia w kalendarzu dla update/delete; użyj zwróconego `event_id`, nie URL Meet |
| `gmTitle` | Puste | Tytuł zaproszenia; wymagany przy `create` |
| `gmDescription` | Puste | Opis zaproszenia |
| `gmStartTime` | Puste | Początek spotkania, np. `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Puste | Koniec spotkania; musi następować po początku |
| `gmAttendees` | Puste | Adresy e-mail oddzielone przecinkami/średnikami/znakiem nowej linii lub tablica JSON ciągów e-mail |
| `gmLocation` | Puste | Opcjonalna lokalizacja spotkania obok konferencji Meet |

### Dostępne przedziały czasowe

Domyślny odczyt obejmuje okres od bieżącej chwili do **1. dnia następnego miesiąca o godz. 00:00** w wybranej strefie czasowej. Przekaż `gmEndDate`, aby zdefiniować inne okno czasowe. Zakres przekraczający 60 dni lub nieprawidłowa data są odrzucane przed wywołaniem Google.

Wynik bazuje na API Google **free/busy**. Zajęte przedziały są scalane i odejmowane od żądanego okna. `available_slots` zawiera ciągłe luki ze znacznikami czasu `start` i `end`.

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

### Uwzględnianie szczegółów zajętych wydarzeń

W sekcji **Odczytaj dostępne przedziały czasowe** włącz opcję **Uwzględnij szczegóły zajętych wydarzeń** (`gmIncludeBusyDetails: true`), aby dodać tytuł i uczestników do każdego zajętego slotu. Ta opcja jest domyślnie wyłączona.

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

### Rezerwacja spotkania

1. Uruchom węzeł `read` z danymi logowania właściciela workflow.
2. Wyświetl `available_slots` w swoim interfejsie rezerwacji.
3. Przekaż `email`, `startTime` i `endTime` jako dane wejściowe workflow.
4. Uruchom `create` z tymi samymi danymi logowania. Gość nie potrzebuje konta Google; jego e-mail jest rejestrowany jako uczestnik.

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

## Wyjście

| Operacja | Pola wyjściowe |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Użyj `$Availability.available_slots` lub `$Booking.meet_url` w kolejnych węzłach. Każda operacja zwraca również `status: "success"` oraz właściwą wartość `operation`.

## Powiązane

- [Dane logowania](../reference/credentials.md)
- [Integracje zewnętrzne](../reference/integrations.md)
- [Udostępnianie danych logowania](../reference/credentials-sharing.md)
- [Węzeł wejściowy](input-node.md)
- [Wyjście](output-node.md)
