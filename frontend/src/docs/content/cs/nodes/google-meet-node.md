# Google Meet

Vyhledávejte dostupné časové sloty v Google Calendar a vytvářejte, aktualizujte nebo mažte pozvánky na schůzky s odkazy na Google Meet, e-maily účastníků a vybranými časy. Připojený účet Google je vlastníkem události; účastníci obdrží pozvánky e-mailem.

## Připojení účtu

1. V [Google Cloud Console](https://console.cloud.google.com) povolte **Google Calendar API**.
2. Nakonfigurujte obrazovku souhlasu OAuth a vytvořte klienta OAuth pro **Webovou aplikaci**. Pokud je aplikace v testovacím režimu, přidejte svůj účet Google jako testovacího uživatele.
3. Zaregistrujte `https://your-heym-domain/api/credentials/google-meet/oauth/callback` jako autorizovaný identifikátor URI pro přesměrování. Pro místní vývoj použijte původ Heym ve vašem prohlížeči se stejnou cestou.
4. Otevřete **Dashboard → Přihlašovací údaje → Nový → Google Meet (OAuth2)**, zadejte název, Client ID a Client Secret, klikněte na **Připojit** a přihlaste se pomocí Google.
5. Udělte obě oprávnění: Události kalendáře (`calendar.events`) a dostupnost kalendáře (`calendar.events.freebusy`). Vyberte tyto přihlašovací údaje v uzlu.

Tokeny jsou v úložišti šifrovány a automaticky obnovovány. Jedná se o samostatné přihlašovací údaje oddělené od Google AI, Sheets nebo Drive. Kalendář musí podporovat konference Google Meet, aby bylo vytvoření úspěšné.

## Operace

| Operace | Chování | Požadovaná pole |
| --- | --- | --- |
| `read` | Vrátí volné a obsazené intervaly pro kalendář | Přihlašovací údaje |
| `create` | Vytvoří naplánovanou událost s novou konferencí Meet a e-mailovými pozvánkami | Název, čas zahájení, čas ukončení |
| `update` | Upraví zadaná pole události a upozorní hosty | ID události a alespoň jedno změněné pole |
| `delete` | Odstraní událost a upozorní hosty na zrušení | ID události |

## Konfigurace

Níže uvedená textová pole přijímají výrazy. Všechna pole, včetně logické volby podrobností, může poskytnout Agent, pokud je tento uzel připojen jako nástroj.

| Pole | Výchozí | Účel |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Primární kalendář připojeného účtu nebo dostupný ID/e-mail kalendáře |
| `gmTimeZone` | `UTC` | Pásmo IANA, například `Europe/Prague`, používané pro místní data a časy odezvy |
| `gmStartDate` | Aktuální čas | Začátek rozsahu čtení jako datum ISO nebo datetime |
| `gmEndDate` | První den následujícího měsíce o půlnoci | Exkluzivní konec rozsahu čtení; maximální rozsah je 60 kalendářních dnů |
| `gmIncludeBusyDetails` | `false` | Pouze pro čtení: zahrnout názvy událostí a účastníky do `busy_slots`; boolean |
| `gmEventId` | Prázdné | ID události kalendáře pro update/delete; použijte vrácené `event_id`, nikoli URL Meet |
| `gmTitle` | Prázdné | Název pozvánky; vyžadováno při `create` |
| `gmDescription` | Prázdné | Popis pozvánky |
| `gmStartTime` | Prázdné | Začátek schůzky, např. `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Prázdné | Konec schůzky; musí následovat po začátku |
| `gmAttendees` | Prázdné | E-maily oddělené čárkami/středníky/novými řádky nebo pole JSON řetězců e-mailů |
| `gmLocation` | Prázdné | Volitelné místo schůzky vedle konference Meet |

### Dostupné časové sloty

Výchozí čtení pokrývá období od aktuálního času do **1. dne následujícího měsíce, 00:00** ve vybraném časovém pásmu. Předejte `gmEndDate` pro určení jiného časového okna. Rozsah delší než 60 dní nebo neplatné datum je před voláním Google odmítnuto.

Výsledek je založen na rozhraní API **free/busy** společnosti Google. Obsazené intervaly jsou sloučeny a odečteny od požadovaného okna. `available_slots` obsahuje souvislé volné bloky s časovými razítky `start` a `end`.

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

### Zahrnout podrobnosti o obsazených událostech

V části **Číst dostupné časové sloty** povolte možnost **Zahrnout podrobnosti o obsazených událostech** (`gmIncludeBusyDetails: true`), čímž přidáte název a účastníky ke každému obsazenému slotu. Tato možnost je ve výchozím nastavení vypnuta.

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

### Rezervace schůzky

1. Spusťte uzel `read` s přihlašovacími údaji vlastníka workflow.
2. Zobrazte `available_slots` ve svém rezervačním rozhraní.
3. Předejte `email`, `startTime` a `endTime` jako vstupy workflow.
4. Spusťte `create` se stejnými údaji. Návštěvník nepotřebuje účet Google; jeho e-mail je zapsán jako účastník.

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

| Operace | Výstupní pole |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Použijte proměnné `$Availability.available_slots` nebo `$Booking.meet_url` v navazujících uzlech. Každá operace vrací také `status: "success"` a odpovídající `operation`.

## Související

- [Přihlašovací údaje](../reference/credentials.md)
- [Integrace třetích stran](../reference/integrations.md)
- [Sdílení přihlašovacích údajů](../reference/credentials-sharing.md)
- [Vstupní uzel](input-node.md)
- [Output](output-node.md)
