# Google Meet

Trouvez les créneaux horaires disponibles dans Google Calendar et créez, mettez à jour ou supprimez des invitations à des réunions avec des liens Google Meet, les adresses e-mail des participants et les heures sélectionnées. Le compte Google connecté est propriétaire de l'événement ; les participants reçoivent des invitations par e-mail.

## Associer votre compte

1. Dans la [Google Cloud Console](https://console.cloud.google.com), activez l'**API Google Calendar**.
2. Configurez l'écran de consentement OAuth et créez un client OAuth pour **Application Web**. Ajoutez votre compte Google en tant qu'utilisateur de test si l'application est en mode test.
3. Enregistrez `https://your-heym-domain/api/credentials/google-meet/oauth/callback` en tant qu'URI de redirection autorisée. Pour le développement local, utilisez l'origine Heym de votre navigateur avec le même chemin.
4. Ouvrez **Dashboard → Identifiants → Nouveau → Google Meet (OAuth2)**, saisissez un nom, un Client ID et un Client Secret, puis cliquez sur **Connecter** et connectez-vous avec Google.
5. Accordez les deux autorisations : Événements de calendrier (`calendar.events`) et Disponibilité du calendrier (`calendar.events.freebusy`). Sélectionnez cet identifiant sur le nœud.

Les tokens sont chiffrés dans le stockage et actualisés automatiquement. Il s'agit d'un identifiant distinct de Google AI, Sheets ou Drive. Un calendrier doit prendre en charge les visioconférences Google Meet pour que la création réussisse.

## Opérations

| Opération | Comportement | Champs requis |
| --- | --- | --- |
| `read` | Retourner les intervalles disponibles et occupés pour un calendrier | Identifiant |
| `create` | Créer un événement planifié avec une nouvelle visioconférence Meet et des invitations par e-mail | Titre, heure de début, heure de fin |
| `update` | Corriger les champs d'événement fournis et notifier les invités | ID de l'événement et au moins un champ modifié |
| `delete` | Supprimer l'événement et notifier les invités de l'annulation | ID de l'événement |

## Configuration

Les champs de texte ci-dessous acceptent des expressions. Tous les champs, y compris l'option booléenne des détails, peuvent être fournis par un Agent lorsque ce nœud est rattaché en tant qu'outil.

| Champ | Valeur par défaut | Objectif |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Calendrier principal du compte connecté, ou ID/e-mail de calendrier accessible |
| `gmTimeZone` | `UTC` | Fuseau IANA, tel que `Europe/Paris`, utilisé pour les dates locales et les heures de réponse |
| `gmStartDate` | Heure actuelle | Début de la plage de lecture, sous forme de date ou datetime ISO |
| `gmEndDate` | Premier jour du mois suivant à minuit | Fin exclusive de la plage de lecture ; la plage maximale est de 60 jours civils |
| `gmIncludeBusyDetails` | `false` | Lecture seule : inclure les titres d'événements et les participants dans `busy_slots` ; booléen, pas un champ d'expression |
| `gmEventId` | Vide | ID de l'événement du calendrier pour update/delete ; utilisez l'`event_id` retourné, pas une URL Meet |
| `gmTitle` | Vide | Titre de l'invitation ; requis lors de `create` |
| `gmDescription` | Vide | Description de l'invitation |
| `gmStartTime` | Vide | Début de la réunion, par exemple `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Vide | Fin de la réunion ; doit suivre le début |
| `gmAttendees` | Vide | E-mails séparés par des virgules/points-virgules/sauts de ligne ou tableau JSON de chaînes d'e-mails |
| `gmLocation` | Vide | Lieu de réunion facultatif aux côtés de la conférence Meet |

### Créneaux horaires disponibles

La lecture par défaut couvre la période allant de l'heure actuelle jusqu'au **1er jour du mois suivant, 00h00**, dans le fuseau horaire sélectionné. Transmettez `gmEndDate` pour définir une fenêtre différente. Une plage supérieure à 60 jours ou une date non valide est rejetée avant d'appeler Google.

Le résultat est basé sur l'API **free/busy** de Google. Les intervalles occupés sont fusionnés et soustraits de la fenêtre demandée. `available_slots` contient des créneaux continus avec les horodatages `start` et `end`.

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

### Inclure les détails des événements occupés

Activez sous **Lire les créneaux horaires disponibles** l'option **Inclure les détails des événements occupés** (`gmIncludeBusyDetails: true`) pour ajouter le titre et les participants à chaque créneau occupé. Cette option est désactivée par défaut.

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

### Réserver une réunion

1. Exécutez un nœud `read` avec les identifiants du propriétaire du workflow.
2. Affichez `available_slots` dans votre interface de réservation.
3. Transmettez `email`, `startTime` et `endTime` comme entrées du workflow.
4. Exécutez `create` avec les mêmes identifiants. Le visiteur n'a pas besoin de compte Google ; son e-mail est enregistré en tant que participant.

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

## Sortie

| Opération | Champs de sortie |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Utilisez `$Availability.available_slots` ou `$Booking.meet_url` dans les nœuds en aval. Chaque opération renvoie également `status: "success"` et son `operation`.

## Voir aussi

- [Identifiants](../reference/credentials.md)
- [Intégrations](../reference/integrations.md)
- [Partage des identifiants](../reference/credentials-sharing.md)
- [Input](input-node.md)
- [Output](output-node.md)
