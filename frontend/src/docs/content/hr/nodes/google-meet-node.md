# Google Meet

Pronađite dostupne vremenske termine u Google Calendaru i stvarajte, ažurirajte ili brišite pozivnice za sastanke s poveznicama na Google Meet, adresama e-pošte sudionika i odabranim vremenima. Povezani Google račun vlasnik je događaja; sudionici primaju pozivnice putem e-pošte.

## Povežite svoj račun

1. U [Google Cloud Console](https://console.cloud.google.com) omogućite **Google Calendar API**.
2. Konfigurirajte zaslon za pristanak na OAuth i stvorite OAuth klijent za **Web aplikaciju**. Dodajte svoj Google račun kao testnog korisnika ako je aplikacija u testnom načinu rada.
3. Registrirajte `https://your-heym-domain/api/credentials/google-meet/oauth/callback` kao autorizirani URI za preusmjeravanje. Za lokalni razvoj koristite Heym podrijetlo vašeg preglednika s istom putanjom.
4. Otvorite **Dashboard → Vjerodajnice → Novo → Google Meet (OAuth2)**, unesite naziv, Client ID i Client Secret, kliknite **Poveži** i prijavite se putem Googlea.
5. Dodijelite oba dopuštenja: Događaji u kalendaru (`calendar.events`) i dostupnost kalendara (`calendar.events.freebusy`). Odaberite ove vjerodajnice na čvoru.

Tokeni su šifrirani u pohrani i automatski se obnavljaju. Ovo su zasebne vjerodajnice od Google AI, Sheets ili Drive. Kalendar mora podržavati konferencije Google Meet kako bi stvaranje uspjelo.

## Operacije

| Operacija | Ponašanje | Obavezna polja |
| --- | --- | --- |
| `read` | Vraća slobodne i zauzete intervale za kalendar | Vjerodajnice |
| `create` | Stvara zakazani događaj s novom Meet konferencijom i pozivnicama e-poštom | Naslov, vrijeme početka, vrijeme završetka |
| `update` | Ažurira navedena polja događaja i obavještava goste | ID događaja i barem jedno promijenjeno polje |
| `delete` | Briše događaj i obavještava goste o otkazivanju | ID događaja |

## Konfiguracija

Tekstualna polja u nastavku prihvaćaju izraze. Sva polja, uključujući logičku opciju pojedinosti, može osigurati Agent kada je ovaj čvor priložen kao alat.

| Polje | Zadano | Svrha |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Primarni kalendar povezanog računa ili dostupan ID/e-pošta kalendara |
| `gmTimeZone` | `UTC` | IANA zona, kao što je `Europe/Zagreb`, koja se koristi za lokalne datume i vremena odgovora |
| `gmStartDate` | Trenutno vrijeme | Početak raspona čitanja kao ISO datum ili datetime |
| `gmEndDate` | Prvi dan sljedećeg mjeseca u ponoć | Isključivi kraj raspona čitanja; maksimalni raspon je 60 kalendarskih dana |
| `gmIncludeBusyDetails` | `false` | Samo za čitanje: uključi naslove događaja i sudionike u `busy_slots`; boolean |
| `gmEventId` | Prazno | ID kalendarskog događaja za update/delete; koristite vraćeni `event_id`, a ne Meet URL |
| `gmTitle` | Prazno | Naslov pozivnice; obavezno pri `create` |
| `gmDescription` | Prazno | Opis pozivnice |
| `gmStartTime` | Prazno | Početak sastanka, npr. `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Prazno | Kraj sastanka; mora uslijediti nakon početka |
| `gmAttendees` | Prazno | E-poruke odvojene zarezima/točka-zarezima/prijelomima redaka ili JSON niz e-mail nizova |
| `gmLocation` | Prazno | Neobavezna lokacija sastanka uz Meet konferenciju |

### Dostupni vremenski termini

Zadano čitanje pokriva razdoblje od trenutnog vremena do **1. dana sljedećeg mjeseca, 00:00** u odabranoj vremenskoj zoni. Proslijedite `gmEndDate` kako biste definirali drugi prozor. Raspon veći od 60 dana ili nevažeći datum odbija se prije pozivanja Googlea.

Rezultat se temelji na Googleovom API-ju **free/busy**. Zauzeti intervali se spajaju i oduzimaju od traženog prozora. `available_slots` sadrži kontinuirane raspone s vremenskim oznakama `start` i `end`.

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

### Uključivanje pojedinosti o zauzetim događajima

Pod **Čitaj dostupne vremenske termine**, omogućite **Uključi pojedinosti o zauzetim događajima** (`gmIncludeBusyDetails: true`) kako biste dodali naslov i sudionike u svaki zauzeti slot. Ova je opcija prema zadanim postavkama isključena.

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

### Rezervacija sastanka

1. Pokrenite čvor `read` s vjerodajnicama vlasnika workflowa.
2. Prikažite `available_slots` u svom sučelju za rezervacije.
3. Proslijedite `email`, `startTime` i `endTime` kao ulaze workflowa.
4. Pokrenite `create` s istim vjerodajnicama. Posjetitelju nije potreban Google račun; njegova e-pošta se bilježi kao sudionik.

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

## Izlaz

| Operacija | Izlazna polja |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Upotrijebite `$Availability.available_slots` ili `$Booking.meet_url` u nizvodnim čvorovima. Svaka operacija također vraća `status: "success"` i odgovarajuću `operation`.

## Povezano

- [Vjerodajnice](../reference/credentials.md)
- [Integracije s Trećim Stranama](../reference/integrations.md)
- [Dijeljenje Vjerodajnica](../reference/credentials-sharing.md)
- [Ulaz](input-node.md)
- [Output](output-node.md)
