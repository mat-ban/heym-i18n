# Teams

Teams gør det muligt at dele workflows, legitimationsoplysninger, globale variabler, vektorlagre og Drive-filer med en gruppe brugere på én gang.

## Oversigt

- **Team** – En navngivet gruppe med en opretter og medlemmer
- **Opretter** – Altid medlem; kan redigere team, slette team, tilføje medlemmer
- **Medlem** – Kan tilføje og fjerne andre medlemmer (undtagen opretter); har adgang til ressourcer delt med teamet

## Oprettelse og administration af teams

Teams oprettes fra [Teams-fanen](../tabs/teams-tab.md). Medlemmer tilføjes via email; de skal have en konto. Opretteren kan ikke fjernes. Ved sletning af et team fjernes alle teamdelinge.

## Delingsmodel

Ressourcer kan deles med:

1. **Enkelte brugere** – Via email (bruger-til-bruger-deling)
2. **Teams** – Ved at vælge et team (teamdeling)

Begge modeller er additive. En bruger får adgang, hvis de enten:

- Er delt med direkte (brugerdeling), eller
- Er medlem af et team, der har en teamdeling

## Hvad kan deles med teams

| Ressource | Delingssted |
|----------|----------------|
| Workflows | Delingsdialog i workflow-editoren |
| Workflow-skabeloner | Delingsdialog ved oprettelse/redigering af workflow-skabelon |
| Node-skabeloner | Delingsdialog ved oprettelse/redigering af node-skabelon |
| Legitimationsoplysninger | Delingsdialog i Legitimationsoplysninger-fanen |
| Globale variabler | Delingsdialog i Variabler-fanen |
| Vektorlagre | Delingsdialog i Vektorer-fanen |
| Drive-filer | Delingsdialog i Drive-fanen eller Drive-node `shareWithMyTeams` / `unshareWithMyTeams` operationer |

For skabeloner, når synligheden er **Specifikke brugere**, kan der også vælges teams. Alle medlemmer af valgte teams får adgang til skabelonen.
Teamdelinger af Drive-filer er skrivebeskyttede for teammedlemmer; filens ejer beholder administrationsrettigheder.

## API-endepunkter

- `GET /api/teams` – Lister teams, som brugeren tilhører
- `GET /api/teams/{id}` – Henter teamdetaljer med medlemmer
- `GET /api/teams/{id}/shared-entities` – Returnerer enheder delt med teamet (workflows, legitimationsoplysninger, globale variabler, vektorlagre, filer, workflow-skabeloner, node-skabeloner)
- `POST /api/teams` – Opretter team
- `PATCH /api/teams/{id}` – Opdaterer team
- `DELETE /api/teams/{id}` – Sletter team (kun opretter)
- `POST /api/teams/{id}/members` – Tilføjer medlem (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Fjerner medlem

Teamdelinger pr. ressource:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST-body accepterer `permission` (`read` eller `write`, standard `write`); ved at poste til et eksisterende team opdateres dets tilladelse
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Relateret

- [Teams-fanen](../tabs/teams-tab.md) – Opret og administrer teams
- [Skabelonfanen](../tabs/templates-tab.md) – Del workflow- og node-skabeloner med teams
- [Deling af legitimationsoplysninger](./credentials-sharing.md) – Del legitimationsoplysninger med brugere og teams
- [Workflow-organisation](./workflow-organization.md) – Mapper og workflow-deling
