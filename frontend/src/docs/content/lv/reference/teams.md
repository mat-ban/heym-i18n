# Teams

Teams ļauj vienlaikus koplietot workflows, akreditācijas datus, globālos mainīgos, vektoru krātuves un Drive failus ar lietotāju grupu.

## Pārskats

- **Team** – Nosaukta grupa ar veidotāju un dalībniekiem
- **Veidotājs** – Vienmēr ir dalībnieks; var rediģēt team, dzēst team, pievienot dalībniekus
- **Dalībnieks** – Var pievienot un noņemt citus dalībniekus (izņemot veidotāju); ir piekļuve resursiem, kas koplietoti ar team

## Team izveide un pārvaldība

Izveidojiet team cilnē [Teams tab](../tabs/teams-tab.md). Pievienojiet dalībniekus pēc e-pasta adreses; viņiem ir jābūt kontam. Veidotāju nevar noņemt. Dzēšot team, tiek noņemti visi team koplietojumi.

## Koplietošanas modelis

Resursus var koplietot ar:

1. **Atsevišķiem lietotājiem** – Pēc e-pasta adreses (lietotāja-līdz-lietotājam koplietojums)
2. **Teams** – Atlasot team (team koplietojums)

Abi modeļi ir papildinoši. Lietotājs iegūst piekļuvi, ja viņš ir:

- Koplietots tieši (lietotāja koplietojums), vai
- Team dalībnieks, ar kuru ir team koplietojums

## Ko var koplietot ar Teams

| Resurss | Koplietošanas vieta |
|----------|----------------|
| Workflows | Koplietošanas dialogs workflow redaktorā |
| Workflow veidnes | Koplietošanas dialogs, veidojot/rediģējot workflow veidni |
| Node veidnes | Koplietošanas dialogs, veidojot/rediģējot node veidni |
| Akreditācijas dati | Koplietošanas dialogs cilnē Akreditācijas dati |
| Globālie mainīgie | Koplietošanas dialogs cilnē Mainīgie |
| Vektoru krātuves | Koplietošanas dialogs cilnē Vektori |
| Drive faili | Koplietošanas dialogs cilnē Drive vai Drive node `shareWithMyTeams` / `unshareWithMyTeams` operācijas |

Veidnēm, ja redzamība ir **Konkrēti lietotāji**, varat arī atlasīt teams. Visi atlasīto team dalībnieki iegūst piekļuvi veidnei.
Drive failu team koplietojumi team dalībniekiem ir tikai lasāmi; faila īpašniekam saglabājas pārvaldības atļaujas.

## API Endpoints

- `GET /api/teams` – Uzskaitīt teams, kuriem lietotājs pieder
- `GET /api/teams/{id}` – Iegūt team informāciju ar dalībniekiem
- `GET /api/teams/{id}/shared-entities` – Atgriež ar team koplietotos objektus (workflows, akreditācijas datus, globālos mainīgos, vektoru krātuves, failus, workflow veidnes, node veidnes)
- `POST /api/teams` – Izveidot team
- `PATCH /api/teams/{id}` – Atjaunināt team
- `DELETE /api/teams/{id}` – Dzēst team (tikai veidotājam)
- `POST /api/teams/{id}/members` – Pievienot dalībnieku (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Noņemt dalībnieku

Team koplietojumi katram resursam:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST body pieņem `permission` (`read` vai `write`, pēc noklusējuma `write`); atkārtoti nosūtot esošu team, tiek atjaunināta tā atļauja
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Saistītais

- [Teams cilne](../tabs/teams-tab.md) – Izveidojiet un pārvaldiet teams
- [Veidņu cilne](../tabs/templates-tab.md) – Koplietojiet workflow un node veidnes ar teams
- [Akreditācijas datu koplietošana](./credentials-sharing.md) – Koplietojiet akreditācijas datus ar lietotājiem un teams
- [Workflow organizēšana](./workflow-organization.md) – Mapes un workflow koplietošana
