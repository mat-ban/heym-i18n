# Teams

Met Teams kunt u workflows, referenties, globale variabelen, vectorstores en Drive-bestanden in één keer delen met een groep gebruikers.

## Overzicht

- **Team** – Een benoemde groep met een maker en leden
- **Maker** – Altijd lid; kan team bewerken, team verwijderen, leden toevoegen
- **Lid** – Kan andere leden toevoegen en verwijderen (behalve de maker); heeft toegang tot resources die met het team zijn gedeeld

## Teams aanmaken en beheren

Maak teams aan via het tabblad [Teams](../tabs/teams-tab.md). Voeg leden toe via e-mail; zij moeten een account hebben. De maker kan niet worden verwijderd. Bij het verwijderen van een team worden alle teamshares verwijderd.

## Deelmodel

Resources kunnen worden gedeeld met:

1. **Individuele gebruikers** – Via e-mail (gebruiker-tot-gebruiker-share)
2. **Teams** – Door een team te selecteren (teamshare)

Beide modellen zijn additief. Een gebruiker krijgt toegang als deze:

- Direct is gedeeld (gebruikersshare), of
- Lid is van een team met een teamshare

## Wat kan met Teams worden gedeeld

| Resource | Deellocatie |
|----------|----------------|
| Workflows | Deelvenster in workflow-editor |
| Workflow-sjablonen | Deelvenster bij het aanmaken/bewerken van een workflow-sjabloon |
| Node-sjablonen | Deelvenster bij het aanmaken/bewerken van een node-sjabloon |
| Referenties | Deelvenster in het tabblad Referenties |
| Globale variabelen | Deelvenster in het tabblad Variabelen |
| Vectorstores | Deelvenster in het tabblad Vectors |
| Drive-bestanden | Deelvenster in het tabblad Drive of Drive-node `shareWithMyTeams` / `unshareWithMyTeams`-bewerkingen |

Voor sjablonen geldt: wanneer de zichtbaarheid **Specifieke gebruikers** is, kunt u ook teams selecteren. Alle leden van geselecteerde teams krijgen toegang tot het sjabloon.
Teamshares van Drive-bestanden zijn alleen-lezen voor teamleden; de bestandseigenaar behoudt beheerrechten.

## API-endpoints

- `GET /api/teams` – Teams weergeven waar de gebruiker lid van is
- `GET /api/teams/{id}` – Teamdetails met leden ophalen
- `GET /api/teams/{id}/shared-entities` – Geeft entiteiten terug die met het team zijn gedeeld (workflows, referenties, globale variabelen, vectorstores, bestanden, workflow-sjablonen, node-sjablonen)
- `POST /api/teams` – Team aanmaken
- `PATCH /api/teams/{id}` – Team bijwerken
- `DELETE /api/teams/{id}` – Team verwijderen (alleen maker)
- `POST /api/teams/{id}/members` – Lid toevoegen (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Lid verwijderen

Teamshares per resource:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – de POST-body accepteert `permission` (`read` of `write`, standaard `write`); het opnieuw posten van een bestaand team werkt de permissie bij
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Gerelateerd

- [Tabblad Teams](../tabs/teams-tab.md) – Teams aanmaken en beheren
- [Tabblad Sjablonen](../tabs/templates-tab.md) – Workflow- en node-sjablonen met teams delen
- [Referenties delen](./credentials-sharing.md) – Referenties delen met gebruikers en teams
- [Workflow-organisatie](./workflow-organization.md) – Mappen en workflow-deling
