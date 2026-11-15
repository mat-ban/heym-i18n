# Google Meet

Trovate gli intervalli disponibili in Google Calendar e create, aggiornate o eliminate gli inviti alle riunioni con link Google Meet, indirizzi email dei partecipanti e orari selezionati. L'account Google connesso è il proprietario dell'evento; i partecipanti ricevono gli inviti via email.

## Connettere il vostro account

1. Nella [Google Cloud Console](https://console.cloud.google.com), abilitate la **Google Calendar API**.
2. Configurate la schermata di consenso OAuth e create un client OAuth per **Applicazione web**. Aggiungete il vostro account Google come utente di test se l'app è in modalità di test.
3. Registrate `https://your-heym-domain/api/credentials/google-meet/oauth/callback` come URI di reindirizzamento autorizzato. Per lo sviluppo locale, utilizzate l'origine Heym del vostro browser con lo stesso percorso.
4. Aprite **Dashboard → Credenziali → Nuovo → Google Meet (OAuth2)**, inserite un nome, Client ID e Client Secret, quindi fate clic su **Connetti** ed eseguite l'accesso con Google.
5. Concedete entrambe le autorizzazioni: Eventi di calendario (`calendar.events`) e Disponibilità di calendario (`calendar.events.freebusy`). Selezionate questa credenziale nel nodo.

I token vengono crittografati nell'archiviazione e aggiornati automaticamente. Si tratta di una credenziale separata rispetto a Google AI, Sheets o Drive. Un calendario deve supportare le conferenze Google Meet affinché la creazione vada a buon fine.

## Operazioni

| Operazione | Comportamento | Campi obbligatori |
| --- | --- | --- |
| `read` | Restituisce gli intervalli liberi e occupati per un calendario | Credenziale |
| `create` | Crea un evento pianificato con una nuova conferenza Meet e inviti email | Titolo, ora di inizio, ora di fine |
| `update` | Aggiorna i campi forniti dell'evento e notifica gli ospiti | ID evento e almeno un campo modificato |
| `delete` | Elimina l'evento e notifica gli ospiti della cancellazione | ID evento |

## Configurazione

I campi di testo sottostanti accettano espressioni. Tutti i campi, inclusa l'opzione booleana dei dettagli, possono essere forniti da un Agent quando questo nodo è collegato come strumento.

| Campo | Predefinito | Scopo |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Calendario principale dell'account connesso, o ID/email di un calendario accessibile |
| `gmTimeZone` | `UTC` | Fuso IANA, come `Europe/Rome`, utilizzato per date locali e orari di risposta |
| `gmStartDate` | Ora corrente | Inizio dell'intervallo di lettura, come data ISO o datetime |
| `gmEndDate` | Primo giorno del mese successivo a mezzanotte | Fine esclusiva dell'intervallo di lettura; l'intervallo massimo è di 60 giorni di calendario |
| `gmIncludeBusyDetails` | `false` | Sola lettura: include titoli degli eventi e partecipanti in `busy_slots`; booleano, non un campo espressione |
| `gmEventId` | Vuoto | ID evento del calendario per update/delete; utilizzare l'`event_id` restituito, non un URL Meet |
| `gmTitle` | Vuoto | Titolo dell'invito; obbligatorio in `create` |
| `gmDescription` | Vuoto | Descrizione dell'invito |
| `gmStartTime` | Vuoto | Inizio della riunione, ad esempio `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Vuoto | Fine della riunione; deve seguire l'inizio |
| `gmAttendees` | Vuoto | Email separate da virgola/punto e virgola/a capo o array JSON di stringhe email |
| `gmLocation` | Vuoto | Luogo della riunione opzionale accanto alla conferenza Meet |

### Fasce orarie disponibili

La lettura predefinita copre il periodo dall'ora corrente fino al **1° giorno del mese successivo, ore 00:00**, nel fuso orario selezionato. Passate `gmEndDate` per definire un intervallo diverso. Un intervallo superiore a 60 giorni o una data non valida viene rifiutato prima di effettuare chiamate a Google.

Il risultato si basa sull'API **free/busy** di Google. Gli intervalli occupati vengono uniti e sottratti dalla finestra richiesta. `available_slots` contiene intervalli continui con timestamp `start` ed `end`.

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

### Includere i dettagli degli eventi occupati

In **Leggi fasce orarie disponibili**, abilitate **Includi dettagli eventi occupati** (`gmIncludeBusyDetails: true`) per aggiungere titolo e partecipanti a ciascuno slot occupato. Questa opzione è disabilitata per impostazione predefinita.

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

### Prenotare un appuntamento

1. Eseguite un nodo `read` con la credenziale del proprietario del workflow.
2. Mostrate `available_slots` nella vostra interfaccia di prenotazione.
3. Passate `email`, `startTime` ed `endTime` come input del workflow.
4. Eseguite `create` con la stessa credenziale. Il visitatore non necessita di un account Google; la sua email viene registrata come partecipante.

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

## Output

| Operazione | Campi di output |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Utilizzate `$Availability.available_slots` o `$Booking.meet_url` nei nodi a valle. Ogni operazione restituisce anche `status: "success"` e la relativa `operation`.

## Correlati

- [Credenziali](../reference/credentials.md)
- [Integrazioni](../reference/integrations.md)
- [Condivisione delle Credenziali](../reference/credentials-sharing.md)
- [Input](input-node.md)
- [Output](output-node.md)
