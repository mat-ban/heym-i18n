# Google Meet

Keressen szabad időpontokat a Google Calendarban, és hozzon létre, frissítsen vagy töröljön értekezlet-meghívókat Google Meet hivatkozásokkal, a résztvevők e-mail címeivel és a kiválasztott időpontokkal. A kapcsolódó Google-fiók az esemény tulajdonosa; a résztvevők e-mailben kapják meg a meghívókat.

## Fiók csatlakoztatása

1. A [Google Cloud Console](https://console.cloud.google.com) felületén engedélyezze a **Google Calendar API** szolgáltatást.
2. Állítsa be az OAuth-hozzájárulási képernyőt, és hozzon létre egy **Webalkalmazás** típusú OAuth-klienst. Adja hozzá Google-fiókját tesztfelhasználóként, ha az alkalmazás tesztelési módban van.
3. Regisztrálja a `https://your-heym-domain/api/credentials/google-meet/oauth/callback` címet engedélyezett átirányítási URI-ként. Helyi fejlesztéshez használja a böngésző Heym-eredetét ugyanezzel az útvonallal.
4. Nyissa meg a **Dashboard → Hitelesítési adatok → Új → Google Meet (OAuth2)** menüt, adjon meg egy nevet, a Client ID-t és a Client Secret-et, kattintson a **Csatlakozás** gombra, és jelentkezzen be a Google segítségével.
5. Adja meg mindkét engedélyt: Naptári események (`calendar.events`) és naptári elérhetőség (`calendar.events.freebusy`). Válassza ki ezt a hitelesítési adatot a csomóponton.

A tokenek titkosítva tárolódnak és automatikusan frissülnek. Ez egy különálló hitelesítési adat a Google AI, Sheets vagy Drive szolgáltatásoktól. A naptárnak támogatnia kell a Google Meet konferenciákat a sikeres létrehozáshoz.

## Műveletek

| Művelet | Viselkedés | Kötelező mezők |
| --- | --- | --- |
| `read` | Szabad és foglalt intervallumok lekérdezése egy naptárhoz | Hitelesítési adat |
| `create` | Ütemezett esemény létrehozása új Meet konferenciával és e-mail meghívókkal | Cím, kezdési időpont, befejezési időpont |
| `update` | A megadott eseménymezők módosítása és a vendégek értesítése | Eseményazonosító és legalább egy módosított mező |
| `delete` | Esemény törlése és a vendégek értesítése a lemondásról | Eseményazonosító |

## Konfiguráció

Az alábbi szöveges mezők kifejezéseket is elfogadnak. Minden mezőt, beleértve a logikai részletopciót is, biztosíthat egy Agent, amikor ez a csomópont eszközként van csatolva.

| Mező | Alapértelmezett | Cél |
| --- | --- | --- |
| `gmCalendarId` | `primary` | A csatlakoztatott fiók elsődleges naptára, vagy elérhető naptár-azonosító/e-mail |
| `gmTimeZone` | `UTC` | IANA zóna, mint például az `Europe/Budapest`, a helyi dátumokhoz és válaszidőkhöz |
| `gmStartDate` | Jelenlegi idő | Olvasási tartomány kezdete ISO dátumként vagy datetime-ként |
| `gmEndDate` | A következő hónap első napja éjfélkor | Olvasási tartomány vége; a maximális tartomány 60 naptári nap |
| `gmIncludeBusyDetails` | `false` | Csak olvasható: eseménycímek és résztvevők szerepeltetése a `busy_slots` mezőben; boolean |
| `gmEventId` | Üres | Naptári eseményazonosító update/delete művelethez; a kapott `event_id`-t használja, ne Meet URL-t |
| `gmTitle` | Üres | Meghívó címe; kötelező a `create` során |
| `gmDescription` | Üres | Meghívó leírása |
| `gmStartTime` | Üres | Értekezlet kezdete, pl. `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Üres | Értekezlet vége; a kezdet után kell lennie |
| `gmAttendees` | Üres | Vesszővel/pontosvesszővel/újsorral elválasztott e-mailek vagy e-mail karakterláncok JSON tömbje |
| `gmLocation` | Üres | Opcionális értekezlethelyszín a Meet konferencia mellett |

### Szabad időpontok

Az alapértelmezett olvasás a jelenlegi időponttól a **következő hónap 1. napjának 00:00 órájáig** terjedő időszakot fedi le a kiválasztott időzónában. Adja meg a `gmEndDate` paramétert más időkeret meghatározásához. A 60 napnál hosszabb tartományt vagy érvénytelen dátumot a rendszer elutasítja a Google hívása előtt.

Az eredmény a Google **free/busy** API-ján alapul. A foglalt intervallumok összevonásra és levonásra kerülnek a kért időkeretből. Az `available_slots` folyamatos szabad sávokat tartalmaz `start` és `end` időbélyegekkel.

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

### Foglalt eseményrészletek bevonása

A **Szabad időpontok olvasása** alatt engedélyezze a **Foglalt eseményrészletek bevonása** (`gmIncludeBusyDetails: true`) opciót a cím és a résztvevők hozzáadásához minden foglalt slothoz. Ez a beállítás alapértelmezés szerint ki van kapcsolva.

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

### Időpont foglalása

1. Futtasson egy `read` csomópontot a workflow tulajdonosának hitelesítési adataival.
2. Jelenítse meg az `available_slots` elemet a foglalási felületén.
3. Adja át az `email`, `startTime` és `endTime` értékeket a workflow bemeneteként.
4. Futtassa a `create` műveletet ugyanazokkal a hitelesítési adatokkal. A látogatónak nincs szüksége Google-fiókra; az e-mail címe résztvevőként kerül rögzítésre.

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

## Kimenet

| Művelet | Kimeneti mezők |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Használja az `$Availability.available_slots` vagy a `$Booking.meet_url` kifejezést a következő csomópontokban. Minden művelet visszaadja a `status: "success"` értéket és a megfelelő `operation`-t is.

## Kapcsolódó

- [Hitelesítési adatok](../reference/credentials.md)
- [Harmadik féltől származó integrációk](../reference/integrations.md)
- [Hitelesítési adatok megosztása](../reference/credentials-sharing.md)
- [**Input**](input-node.md)
- [Output](output-node.md)
