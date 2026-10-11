# Team

Team gör det möjligt att dela workflows, autentiseringsuppgifter, globala variabler, vektorlager och Drive-filer med en grupp användare samtidigt.

## Översikt

- **Team** – En namngiven grupp med en skapare och medlemmar
- **Skapare** – Alltid medlem; kan redigera team, ta bort team och lägga till medlemmar
- **Medlem** – Kan lägga till och ta bort andra medlemmar (utom skaparen); har åtkomst till resurser som delas med teamet

## Skapa och hantera team

Team skapas från fliken [Team](../tabs/teams-tab.md). Medlemmar läggs till via e-post; de måste ha ett konto. Skaparen kan inte tas bort. När ett team tas bort upphör alla teamdelningar.

## Delningsmodell

Resurser kan delas med:

1. **Enskilda användare** – Via e-post (användare-till-användare-delning)
2. **Team** – Genom att välja ett team (teamdelning)

Båda modellerna är additiva. En användare får åtkomst om denne antingen:

- Har delats direkt (användardelning), eller
- Är medlem i ett team som har en teamdelning

## Vad som kan delas med team

| Resurs | Plats för delning |
|----------|----------------|
| Workflows | Delningsdialog i workflow-editorn |
| Workflow-mallar | Delningsdialog vid skapande/redigering av en workflow-mall |
| Nodmallar | Delningsdialog vid skapande/redigering av en nodmall |
| Autentiseringsuppgifter | Delningsdialog på fliken Autentiseringsuppgifter |
| Globala variabler | Delningsdialog på fliken Variabler |
| Vektorlager | Delningsdialog på fliken Vektorer |
| Drive-filer | Delningsdialog på fliken Drive eller Drive-nodens `shareWithMyTeams` / `unshareWithMyTeams`-operationer |

För mallar går det även att välja team när synligheten är **Specifika användare**. Alla medlemmar i valda team får åtkomst till mallen.
Teamdelningar av Drive-filer är skrivskyddade för teammedlemmar; filägaren behåller hanteringsbehörigheter.

## API-endpoints

- `GET /api/teams` – Lista team som användaren tillhör
- `GET /api/teams/{id}` – Hämta teaminformation med medlemmar
- `GET /api/teams/{id}/shared-entities` – Returnerar entiteter som delats med teamet (workflows, autentiseringsuppgifter, globala variabler, vektorlager, filer, workflow-mallar, nodmallar)
- `POST /api/teams` – Skapa team
- `PATCH /api/teams/{id}` – Uppdatera team
- `DELETE /api/teams/{id}` – Ta bort team (endast skapare)
- `POST /api/teams/{id}/members` – Lägg till medlem (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Ta bort medlem

Teamdelningar per resurs:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST-body accepterar `permission` (`read` eller `write`, standard `write`); om ett befintligt team skickas igen uppdateras dess behörighet
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Relaterat

- [Fliken Team](../tabs/teams-tab.md) – Skapa och hantera team
- [Fliken Mallar](../tabs/templates-tab.md) – Dela workflow- och nodmallar med team
- [Delning av autentiseringsuppgifter](./credentials-sharing.md) – Dela autentiseringsuppgifter med användare och team
- [Workflow-organisering](./workflow-organization.md) – Mappar och workflow-delning
