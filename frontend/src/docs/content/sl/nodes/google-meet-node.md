# Google Meet

Poiščite razpoložljive časovne termine v Google Calendar ter ustvarite, posodobite ali izbrišite vabila na sestanke s povezavami Google Meet, e-poštnimi naslovi udeležencev in izbranimi časi. Povezani Google račun je lastnik dogodka; udeleženci prejmejo vabila po e-pošti.

## Povežite svoj račun

1. V [Google Cloud Console](https://console.cloud.google.com) omogočite **Google Calendar API**.
2. Konfigurirajte zaslon za privolitev OAuth in ustvarite OAuth odjemalca za **Spletno aplikacijo**. Dodajte svoj Google račun kot preizkusnega uporabnika, če je aplikacija v načinu testiranja.
3. Registrirajte `https://your-heym-domain/api/credentials/google-meet/oauth/callback` kot pooblaščeni URI za preusmeritev. Za lokalni razvoj uporabite izvor Heym v brskalniku z isto potjo.
4. Odprite **Dashboard → Poverilnice → Novo → Google Meet (OAuth2)**, vnesite ime, Client ID in Client Secret, kliknite **Poveži** in se prijavite z Googlom.
5. Dodelite obe dovoljenji: Koledarski dogodki (`calendar.events`) in razpoložljivost koledarja (`calendar.events.freebusy`). Izberite to poverilnico na vozlišču.

Žetoni so šifrirani v shrambi in se samodejno osvežujejo. To je ločena poverilnica od Google AI, Sheets ali Drive. Koledar mora podpirati konference Google Meet, da je ustvarjanje uspešno.

## Operacije

| Operacija | Vedenje | Zahtevana polja |
| --- | --- | --- |
| `read` | Vrne proste in zasedene intervale za koledar | Poverilnica |
| `create` | Ustvari načrtovani dogodek z novo Meet konferenco in vabili po e-pošti | Naslov, začetni čas, končni čas |
| `update` | Posodobi navedena polja dogodka in obvesti goste | ID dogodka in vsaj eno spremenjeno polje |
| `delete` | Izbriše dogodek in obvesti goste o preklicu | ID dogodka |

## Konfiguracija

Spodnja besedilna polja sprejemajo izraze. Vsa polja, vključno z logično možnostjo podrobnosti, lahko zagotovi Agent, ko je to vozlišče priloženo kot orodje.

| Polje | Privzeto | Namen |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Primarni koledar povezanega računa ali dostopen ID/e-pošta koledarja |
| `gmTimeZone` | `UTC` | Območje IANA, kot je `Europe/Ljubljana`, uporabljeno za lokalne datume in odzivne čase |
| `gmStartDate` | Trenutni čas | Začetek obsega branja kot ISO datum ali datetime |
| `gmEndDate` | Prvi dan naslednjega meseca ob polnoči | Izključni konec obsega branja; največji obseg je 60 koledarskih dni |
| `gmIncludeBusyDetails` | `false` | Samo za branje: vključi naslove dogodkov in udeležence v `busy_slots`; boolean |
| `gmEventId` | Prazno | ID koledarskega dogodka za update/delete; uporabite vrnjeni `event_id`, ne URL-ja Meet |
| `gmTitle` | Prazno | Naslov vabila; obvezno pri `create` |
| `gmDescription` | Prazno | Opis vabila |
| `gmStartTime` | Prazno | Začetek sestanka, npr. `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Prazno | Konec sestanka; mora slediti začetku |
| `gmAttendees` | Prazno | E-poštna sporočila, ločena z vejico/podpičjem/prelomom vrstice, ali JSON polje nizov |
| `gmLocation` | Prazno | Neobvezna lokacija sestanka ob konferenci Meet |

### Razpoložljivi časovni termini

Privzeto branje zajema obdobje od trenutnega časa do **1. dne naslednjega meseca ob 00:00** v izbranem časovnem pasu. Posredujte `gmEndDate`, da določite drugo časovno okno. Obseg, daljši od 60 dni, ali neveljaven datum se zavrne pred klicem Googla.

Rezultat temelji na Googlovem API-ju **free/busy**. Zasedeni intervali se združijo in odštejejo od zahtevanega okna. `available_slots` vsebuje neprekinjene vrzeli s časovnimi žigi `start` in `end`.

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

### Vključitev podrobnosti o zasedenih dogodkih

V razdelku **Preberi razpoložljive časovne termine** omogočite **Vključi podrobnosti o zasedenih dogodkih** (`gmIncludeBusyDetails: true`), da vsaki zasedeni reži dodate naslov in udeležence. Ta možnost je privzeto onemogočena.

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

### Rezervacija sestanka

1. Zaženite vozlišče `read` s poverilnicami lastnika workflowa.
2. Prikažite `available_slots` v svojem vmesniku za rezervacije.
3. Posredujte `email`, `startTime` in `endTime` kot vhode workflowa.
4. Zaženite `create` z istimi poverilnicami. Obiskovalec ne potrebuje Google računa; njegov e-poštni naslov je zabeležen kot udeleženec.

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

## Izhod

| Operacija | Izhodna polja |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Uporabite `$Availability.available_slots` ali `$Booking.meet_url` v nadaljnjih vozliščih. Vsaka operacija vrne tudi `status: "success"` in ustrezno `operation`.

## Sorodno

- [Poverilnice](../reference/credentials.md)
- [Integracije Tretjih Oseb](../reference/integrations.md)
- [Deljenje Poverilnic](../reference/credentials-sharing.md)
- [Vhodno vozlišče](input-node.md)
- [Izhod](output-node.md)
