# Google Meet

Etsi vapaita aikoja Google Calendarista ja luo, päivitä tai poista kokouskutsuja Google Meet -linkeillä, osallistujien sähköposteilla ja valituilla ajoilla. Yhdistetty Google-tili omistaa tapahtuman; osallistujat saavat kutsut sähköpostitse.

## Yhdistä tili

1. Ota **Google Calendar API** käyttöön [Google Cloud Consolessa](https://console.cloud.google.com).
2. Määritä OAuth-suostumusnäyttö ja luo OAuth-asiakas **Web-sovellukselle**. Lisää Google-tilisi testikäyttäjäksi, jos sovellus on testaustilassa.
3. Rekisteröi `https://your-heym-domain/api/credentials/google-meet/oauth/callback` valtuutetuksi uudelleenohjaus-URI:ksi. Käytä paikallisessa kehityksessä selaimesi Heym-alkuperää samalla polulla.
4. Avaa **Dashboard → Tunnistetiedot → Uusi → Google Meet (OAuth2)**, anna nimi, Client ID ja Client Secret, napsauta **Yhdistä** ja kirjaudu sisään Googlella.
5. Myönnä molemmat käyttöoikeudet: Kalenteritapahtumat (`calendar.events`) ja kalenterin saatavuus (`calendar.events.freebusy`). Valitse tämä credential solmussa.

Tokenit salataan tallennustilassa ja päivitetään automaattisesti. Tämä on erillinen credential Google AI-, Sheets- tai Drive-tunnisteista. Kalenterin on tuettava Google Meet -konferensseja, jotta luominen onnistuu.

## Toiminnot

| Toiminto | Toiminta | Pakolliset kentät |
| --- | --- | --- |
| `read` | Palauttaa kalenterin vapaat ja varatut aikavälit | Credential |
| `create` | Luo ajoitetun tapahtuman uudella Meet-konferenssilla ja sähköpostikutsuilla | Otsikko, alkamisaika, päättymisaika |
| `update` | Päivittää määritetyt tapahtumakentät ja ilmoittaa vieraille | Tapahtuma-ID ja vähintään yksi muutettu kenttä |
| `delete` | Poistaa tapahtuman ja ilmoittaa vieraille peruutuksesta | Tapahtuma-ID |

## Konfiguraatio

Alla olevat tekstikentät hyväksyvät lausekkeita. Kaikki kentät, mukaan lukien looginen lisätietoasetus, voidaan välittää Agentin kautta, kun tämä solmu on liitetty työkaluksi.

| Kenttä | Oletus | Tarkoitus |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Yhdistetyn tilin ensisijainen kalenteri, tai kalenterin ID/sähköposti |
| `gmTimeZone` | `UTC` | IANA-aikavyöhyke, kuten `Europe/Helsinki`, käytetään paikallisiin päivämääriin ja vasteaikoihin |
| `gmStartDate` | Nykyinen aika | Lukuvälin alku ISO-päivämääränä tai datetime-muodossa |
| `gmEndDate` | Seuraavan kuukauden ensimmäinen päivä keskiyöllä | Lukuvälin loppu; enimmäisväli on 60 kalenteripäivää |
| `gmIncludeBusyDetails` | `false` | Vain luku: sisällytä tapahtumien otsikot ja osallistujat kenttään `busy_slots`; boolean |
| `gmEventId` | Tyhjä | Kalenteritapahtuman ID toiminnoille update/delete; käytä palautettua `event_id`-arvoa, ei Meet-URLia |
| `gmTitle` | Tyhjä | Kutsun otsikko; pakollinen toiminnossa `create` |
| `gmDescription` | Tyhjä | Kutsun kuvaus |
| `gmStartTime` | Tyhjä | Kokouksen alkuaika, esim. `2026-11-10T14:00:00+02:00` |
| `gmEndTime` | Tyhjä | Kokouksen päättymisaika; oltava alkamisajan jälkeen |
| `gmAttendees` | Tyhjä | Pilkulla/puolipisteellä/rivinvaihdolla erotetut sähköpostit tai JSON-merkkijonotaulukko |
| `gmLocation` | Tyhjä | Valinnainen kokouspaikka Meet-konferenssin ohella |

### Vapaat aikavälit

Oletusluku kattaa ajan nykyhetkestä **seuraavan kuukauden 1. päivään klo 00:00** valitulla aikavyöhykkeellä. Anna `gmEndDate` määrittääksesi toisenlaisen aikavälin. Yli 60 päivän väli tai virheellinen päivämäärä hylätään ennen Google-kutsua.

Tulos perustuu Googlen **free/busy**-APIin. Varatut aikavälit yhdistetään ja vähennetään pyydetystä ajanjaksosta. `available_slots` sisältää yhtenäiset aikavälit aikaleimoilla `start` ja `end`.

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

### Sisällytä varattujen tapahtumien tiedot

Valitse kohdassa **Lue vapaat aikavälit** asetus **Sisällytä varattujen tapahtumien tiedot** (`gmIncludeBusyDetails: true`) lisätäksesi tapahtuman otsikon ja osallistujat jokaiseen varattuun aikaväliin. Tämä asetus on oletuksena pois käytöstä.

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

### Varaa kokous

1. Suorita `read`-solmu workflow'n omistajan credentialeilla.
2. Näytä `available_slots` varausliittymässäsi.
3. Välitä `email`, `startTime` ja `endTime` workflow'n syötteinä.
4. Suorita `create` samoilla credentialeilla. Vierailija ei tarvitse Google-tiliä; hänen sähköpostinsa lisätään osallistujaksi.

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

## Tuloste

| Toiminto | Tulostekentät |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Käytä muuttujia `$Availability.available_slots` tai `$Booking.meet_url` jatkosolmuissa. Jokainen toiminto palauttaa lisäksi tiedon `status: "success"` ja suoritetun arvon `operation`.

## Aiheeseen Liittyvät

- [Tunnistetiedot](../reference/credentials.md)
- [Kolmannen osapuolen integraatiot](../reference/integrations.md)
- [Tunnistetietojen jakaminen](../reference/credentials-sharing.md)
- [Syötesolmu](input-node.md)
- [Tulostus](output-node.md)
