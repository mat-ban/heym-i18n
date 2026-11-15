# Google Meet

Vyhľadávajte dostupné časové sloty v Google Calendar a vytvárajte, aktualizujte alebo mažte pozvánky na stretnutia s odkazmi Google Meet, e-mailami účastníkov a vybranými časmi. Pripojený účet Google je vlastníkom udalosti; účastníci dostanú pozvánky e-mailom.

## Pripojenie účtu

1. V [Google Cloud Console](https://console.cloud.google.com) povoľte **Google Calendar API**.
2. Nakonfigurujte obrazovku súhlasu OAuth a vytvorte OAuth klienta pre **Webovú aplikáciu**. Pridajte svoj účet Google ako testovacieho používateľa, ak je aplikácia v testovacom režime.
3. Zaregistrujte `https://your-heym-domain/api/credentials/google-meet/oauth/callback` ako autorizovaný identifikátor URI presmerovania. Pre lokálny vývoj použite pôvod Heym vo vašom prehliadači s rovnakou cestou.
4. Otvorte **Dashboard → Prihlasovacie údaje → Nový → Google Meet (OAuth2)**, zadajte názov, Client ID a Client Secret, kliknite na **Pripojiť** a prihláste sa cez Google.
5. Udeľte obe povolenia: Udalosti v kalendári (`calendar.events`) a dostupnosť v kalendári (`calendar.events.freebusy`). Vyberte tieto prihlasovacie údaje v uzle.

Tokeny sú v úložisku šifrované a automaticky obnovované. Ide o samostatné prihlasovacie údaje oddelené od Google AI, Sheets alebo Drive. Kalendár musí podporovať konferencie Google Meet, aby bolo vytvorenie úspešné.

## Operácie

| Operácia | Správanie | Požadované polia |
| --- | --- | --- |
| `read` | Vráti voľné a obsadené intervaly pre kalendár | Prihlasovacie údaje |
| `create` | Vytvorí naplánovanú udalosť s novou konferenciou Meet a e-mailovými pozvánkami | Názov, čas začiatku, čas ukončenia |
| `update` | Upraví zadané polia udalosti a upozorní hostí | ID udalosti a aspoň jedno zmenené pole |
| `delete` | Vymaže udalosť a upozorní hostí na zrušenie | ID udalosti |

## Konfigurácia

Textové polia nižšie prijímajú výrazy. Všetky polia vrátane booleovskej možnosti podrobností môže poskytnúť Agent, keď je tento uzol pripojený ako nástroj.

| Pole | Predvolené | Účel |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Primárny kalendár pripojeného účtu alebo dostupný ID/e-mail kalendára |
| `gmTimeZone` | `UTC` | Pásmo IANA, napríklad `Europe/Bratislava`, používané pre lokálne dátumy a časy odpovede |
| `gmStartDate` | Aktuálny čas | Začiatok rozsahu čítania ako ISO dátum alebo datetime |
| `gmEndDate` | Prvý deň nasledujúceho mesiaca o polnoci | Exkluzívny koniec rozsahu čítania; maximálny rozsah je 60 kalendárnych dní |
| `gmIncludeBusyDetails` | `false` | Iba na čítanie: zahrnúť názvy udalostí a účastníkov do `busy_slots`; boolean |
| `gmEventId` | Prázdne | ID udalosti kalendára pre update/delete; použite vrátené `event_id`, nie URL Meet |
| `gmTitle` | Prázdne | Názov pozvánky; vyžadované pri `create` |
| `gmDescription` | Prázdne | Popis pozvánky |
| `gmStartTime` | Prázdne | Začiatok stretnutia, napr. `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Prázdne | Koniec stretnutia; musí nasledovať po začiatku |
| `gmAttendees` | Prázdne | E-maily oddelené čiarkami/bodkočiarkami/novými riadkami alebo pole JSON reťazcov e-mailov |
| `gmLocation` | Prázdne | Voliteľné miesto stretnutia vedľa konferencie Meet |

### Dostupné časové sloty

Predvolené čítanie pokrýva obdobie od aktuálneho času do **1. dňa nasledujúceho mesiaca, 00:00** vo vybranom časovom pásme. Zadajte `gmEndDate` na určenie iného časového okna. Rozsah dlhší ako 60 dní alebo neplatný dátum je pred volaním Google zamietnutý.

Výsledok je založený na rozhraní API **free/busy** spoločnosti Google. Obsadené intervaly sa zlúčia a odpočítajú od požadovaného okna. `available_slots` obsahuje súvislé voľné intervaly s časovými značkami `start` a `end`.

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

### Zahrnúť podrobnosti o obsadených udalostiach

V časti **Čítať dostupné časové sloty** povoľte možnosť **Zahrnúť podrobnosti o obsadených udalostiach** (`gmIncludeBusyDetails: true`), čím pridáte názov a účastníkov ku každému obsadenému slotu. Táto možnosť je predvolene vypnutá.

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

### Rezervácia stretnutia

1. Spustite uzol `read` s prihlasovacími údajmi vlastníka workflowu.
2. Zobrazte `available_slots` vo svojom rezervačnom rozhraní.
3. Odovzdajte `email`, `startTime` a `endTime` ako vstupy workflowu.
4. Spustite `create` s rovnakými prihlasovacími údajmi. Návštevník nepotrebuje účet Google; jeho e-mail je zapísaný ako účastník.

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

## Výstup

| Operácia | Výstupné polia |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Použite premenné `$Availability.available_slots` alebo `$Booking.meet_url` v nadväzujúcich uzloch. Každá operácia vracia tiež `status: "success"` a zodpovedajúcu `operation`.

## Súvisiace

- [Prihlasovacie údaje](../reference/credentials.md)
- [Integrácie tretích strán](../reference/integrations.md)
- [Zdieľanie prihlasovacích údajov](../reference/credentials-sharing.md)
- [Vstup](input-node.md)
- [Výstup](output-node.md)
