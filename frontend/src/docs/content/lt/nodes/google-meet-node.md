# Google Meet

Raskite laisvus laiko intervalus Google Calendar ir kurkite, atnaujinkite arba trinkite susitikimų kvietimus su Google Meet nuorodomis, dalyvių el. pašto adresais ir pasirinktu laiku. Prijungta Google paskyra yra įvykio savininkė; dalyviai gauna kvietimus el. paštu.

## Paskyros prijungimas

1. [Google Cloud Console](https://console.cloud.google.com) įgalinkite **Google Calendar API**.
2. Sukonfigūruokite OAuth sutikimo ekraną ir sukurkite **Žiniatinklio programos** OAuth klientą. Pridėkite savo Google paskyrą kaip bandomąjį naudotoją, jei programa veikia testavimo režimu.
3. Užregistruokite `https://your-heym-domain/api/credentials/google-meet/oauth/callback` kaip įgaliotą peradresavimo URI. Vietiniam kūrimui naudokite savo naršyklės Heym kilmę su tuo pačiu keliu.
4. Atidarykite **Dashboard → Kredencialai → Naujas → Google Meet (OAuth2)**, įveskite pavadinimą, Client ID ir Client Secret, spustelėkite **Prisijungti** ir prisijunkite su Google.
5. Suteikite abu leidimus: Kalendoriaus įvykiai (`calendar.events`) ir kalendoriaus užimtumas (`calendar.events.freebusy`). Pasirinkite šį kredencialą mazge.

Prieigos raktai yra šifruojami saugykloje ir automatiškai atnaujinami. Tai atskiras kredencialas nuo Google AI, Sheets ar Drive. Kalendorius turi palaikyti Google Meet konferencijas, kad kūrimas pavyktų.

## Operacijos

| Operacija | Elgsena | Privalomi laukai |
| --- | --- | --- |
| `read` | Grąžina laisvus ir užimtus kalendoriaus intervalus | Kredencialas |
| `create` | Sukuria suplanuotą įvykį su nauja Meet konferencija ir el. pašto kvietimais | Pavadinimas, pradžios laikas, pabaigos laikas |
| `update` | Atnaujina nurodytus įvykio laukus ir informuoja svečius | Įvykio ID ir bent vienas pakeistas laukas |
| `delete` | Ištrina įvykį ir praneša svečiams apie atšaukimą | Įvykio ID |

## Konfigūracija

Žemiau esantys teksto laukai priima išraiškas. Visus laukus, įskaitant loginę detalių parinktį, gali pateikti Agent, kai šis mazgas pridedamas kaip įrankis.

| Laukas | Numatytasis | Paskirtis |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Prijungtos paskyros pagrindinis kalendorius arba pasiekiamas kalendoriaus ID/el. paštas |
| `gmTimeZone` | `UTC` | IANA zona, pvz., `Europe/Vilnius`, naudojama vietinėms datoms ir atsakymo laikui |
| `gmStartDate` | Dabartinis laikas | Skaitymo diapazono pradžia kaip ISO data arba datetime |
| `gmEndDate` | Kito mėnesio pirmoji diena vidurnaktį | Išskirtinė skaitymo diapazono pabaiga; didžiausias diapazonas – 60 kalendorinių dienų |
| `gmIncludeBusyDetails` | `false` | Tik skaitymas: įtraukti įvykių pavadinimus ir dalyvius į `busy_slots`; boolean |
| `gmEventId` | Tuščias | Kalendoriaus įvykio ID veiksmams update/delete; naudokite grąžintą `event_id`, o ne Meet URL |
| `gmTitle` | Tuščias | Kvietimo pavadinimas; privalomas kuriant (`create`) |
| `gmDescription` | Tuščias | Kvietimo aprašymas |
| `gmStartTime` | Tuščias | Susitikimo pradžia, pvz., `2026-11-10T14:00:00+02:00` |
| `gmEndTime` | Tuščias | Susitikimo pabaiga; turi būti vėliau nei pradžia |
| `gmAttendees` | Tuščias | Kableliais/kabliataškiais/eilutės lūžiais atskirti el. laiškai arba JSON eilučių masyvas |
| `gmLocation` | Tuščias | Neprivaloma susitikimo vieta šalia Meet konferencijos |

### Laisvi laiko intervalai

Numatytasis skaitymas apima laikotarpį nuo dabartinio laiko iki **kito mėnesio 1 d. 00:00** pasirinktoje laiko juostoje. Perduokite `gmEndDate`, kad nurodytumėte kitą laiko langą. Didesnis nei 60 dienų intervalas arba netinkama data atmetami prieš kreipiantis į Google.

Rezultatas pagrįstas Google **free/busy** API. Užimti intervalai sujungiami ir atimami iš prašomo lango. `available_slots` pateikia nepertraukiamus laiko tarpus su laiko žymomis `start` ir `end`.

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

### Užimtų įvykių informacijos įtraukimas

Skiltyje **Skaityti laisvus laiko intervalus** įjunkite **Įtraukti užimtų įvykių informaciją** (`gmIncludeBusyDetails: true`), kad prie kiekvieno užimto intervalo būtų pridėtas pavadinimas ir dalyviai. Ši parinktis pagal numatytuosius nustatymus yra išjungta.

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

### Susitikimo rezervavimas

1. Vykdykite `read` mazgą naudodami workflow savininko kredencialus.
2. Parodykite `available_slots` savo rezervavimo sąsajoje.
3. Perduokite `email`, `startTime` ir `endTime` kaip workflow įvestis.
4. Vykdykite `create` su tais pačiais kredencialais. Lankytojui nereikia Google paskyros; jo el. paštas užregistruojamas kaip dalyvis.

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

## Išvestis

| Operacija | Išvesties laukai |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Naudokite `$Availability.available_slots` arba `$Booking.meet_url` tolesniuose mazguose. Kiekviena operacija taip pat grąžina `status: "success"` ir savo `operation`.

## Susiję

- [Kredencialai](../reference/credentials.md)
- [Trečiųjų Šalių Integracijos](../reference/integrations.md)
- [Kredencialų Dalijimasis](../reference/credentials-sharing.md)
- [Įvestis](input-node.md)
- [Išvestis](output-node.md)
