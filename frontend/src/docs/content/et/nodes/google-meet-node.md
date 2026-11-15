# Google Meet

Leidke vabad ajad Google Calendaris ja looge, uuendage või kustutage koosolekukutseid koos Google Meet linkide, osalejate e-posti aadresside ja valitud aegadega. Ühendatud Google'i konto on sündmuse omanik; osalejad saavad kutsed e-postiga.

## Konto ühendamine

1. Lubage [Google Cloud Console'is](https://console.cloud.google.com) **Google Calendar API**.
2. Seadistage OAuth-nõusoleku ekraan ja looge **Veebirakenduse** OAuth-klient. Lisage oma Google'i konto testkasutajaks, kui rakendus on testimisrežiimis.
3. Registreerige `https://your-heym-domain/api/credentials/google-meet/oauth/callback` volitatud ümbersuunamise URI-na. Kohaliku arenduse jaoks kasutage oma brauseri Heymi päritolu sama teega.
4. Avage **Dashboard → Mandaadid → Uus → Google Meet (OAuth2)**, sisestage nimi, Client ID ja Client Secret, klõpsake nuppu **Ühenda** ning logige sisse Google'iga.
5. Andke mõlemad load: Kalendrisündmused (`calendar.events`) ja kalendri saadavus (`calendar.events.freebusy`). Valige see mandaat sõlmel.

Tokenid krüpteeritakse salvestusruumis ja neid värskendatakse automaatselt. See on Google AI-st, Sheetsist või Drive'ist eraldiseisev mandaat. Kalender peab toetama Google Meet konverentse, et loomine õnnestuks.

## Toimingud

| Toiming | Käitumine | Nõutavad väljad |
| --- | --- | --- |
| `read` | Tagastab kalendri vabad ja hõivatud ajavahemikud | Mandaat |
| `create` | Loob ajastatud sündmuse uue Meet-konverentsi ja e-posti kutsetega | Pealkiri, algusaeg, lõpuaeg |
| `update` | Uuendab määratud sündmuse välju ja teavitab külalisi | Sündmuse ID ja vähemalt üks muudetud väli |
| `delete` | Kustutab sündmuse ja teavitab külalisi tühistamisest | Sündmuse ID |

## Seadistamine

Allpool olevad tekstiväljad aktsepteerivad avaldisi. Kõik väljad, sealhulgas loogiline üksikasjade valik, saab esitada Agent, kui see node on lisatud tööriistana.

| Väli | Vaikimisi | Eesmärk |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Ühendatud konto peamine kalender või ligipääsetava kalendri ID/e-post |
| `gmTimeZone` | `UTC` | IANA tsoon, näiteks `Europe/Tallinn`, mida kasutatakse kohalike kuupäevade ja vastuseaegade jaoks |
| `gmStartDate` | Praegune aeg | Lugemisvahemiku algus ISO kuupäevana või datetime-na |
| `gmEndDate` | Järgmise kuu esimene päev südaööl | Lugemisvahemiku eksklusiivne lõpp; maksimaalne vahemik on 60 kalendripäeva |
| `gmIncludeBusyDetails` | `false` | Ainult lugemine: sündmuste pealkirjade ja osalejate kaasamine `busy_slots` väljale; boolean |
| `gmEventId` | Tühi | Kalendrisündmuse ID update/delete jaoks; kasutage tagastatud `event_id`, mitte Meeti URL-i |
| `gmTitle` | Tühi | Kutse pealkiri; nõutav toimingus `create` |
| `gmDescription` | Tühi | Kutse kirjeldus |
| `gmStartTime` | Tühi | Koosoleku algus, nt `2026-11-10T14:00:00+02:00` |
| `gmEndTime` | Tühi | Koosoleku lõpp; peab olema pärast algust |
| `gmAttendees` | Tühi | Komaga/semikooloniga/reavahetusega eraldatud e-posti aadressid või JSON-sõnemassiiv |
| `gmLocation` | Tühi | Valikuline koosoleku asukoht Meet-konverentsi kõrval |

### Vabad ajavahemikud

Vaikelugemine hõlmab perioodi praegusest ajast kuni **järgmise kuu 1. kuupäevani kell 00:00** valitud ajavööndis. Edastage `gmEndDate`, et määrata teistsugune aken. Üle 60 päeva pikkune vahemik või vigane kuupäev lükatakse enne Google'i poole pöördumist tagasi.

Tulemus põhineb Google'i **free/busy** API-l. Hõivatud intervallid liidetakse ja lahutatakse taotletud aknast. `available_slots` sisaldab pidevaid ajavahemikke ajatemplitega `start` ja `end`.

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

### Hõivatud sündmuste üksikasjade kaasamine

Valige jaotises **Loe vabu ajavahemikke** valik **Kaasa hõivatud sündmuste üksikasjad** (`gmIncludeBusyDetails: true`), et lisada pealkiri ja osalejad igale hõivatud ajavahemikule. See valik on vaikimisi välja lülitatud.

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

### Koosoleku broneerimine

1. Käivitage `read`-sõlm workflow omaniku mandaatidega.
2. Kuvage `available_slots` oma broneerimisliideses.
3. Edastage `email`, `startTime` ja `endTime` workflow sisenditena.
4. Käivitage `create` samade mandaatidega. Külastaja ei vaja Google'i kontot; tema e-post registreeritakse osalejana.

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

## Väljund

| Toiming | Väljundväljad |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Kasutage allavoolu sõlmedes muutujaid `$Availability.available_slots` või `$Booking.meet_url`. Iga toiming tagastab ka väärtuse `status: "success"` ja vastava `operation`.

## Seotud

- [Mandaadid](../reference/credentials.md)
- [Kolmandate osapoolte integratsioonid](../reference/integrations.md)
- [Mandaatide jagamine](../reference/credentials-sharing.md)
- [**Input**](input-node.md)
- [Väljund](output-node.md)
