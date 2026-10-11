# Echipe

Echipele vă permit să partajați workflow-uri, acreditări, variabile globale, depozite vectoriale și fișiere Drive cu un grup de utilizatori simultan.

## Prezentare generală

- **Echipă** – Un grup denumit cu un creator și membri
- **Creator** – Întotdeauna membru; poate edita echipa, șterge echipa, adăuga membri
- **Membru** – Poate adăuga și elimina alți membri (cu excepția creatorului); are acces la resursele partajate cu echipa

## Crearea și gestionarea echipelor

Creați echipe din [fila Echipe](../tabs/teams-tab.md). Adăugați membri prin email; aceștia trebuie să aibă un cont. Creatorul nu poate fi eliminat. Ștergerea unei echipe elimină toate partajările echipei.

## Modelul de partajare

Resursele pot fi partajate cu:

1. **Utilizatori individuali** – Prin email (partajare utilizator-la-utilizator)
2. **Echipe** – Prin selectarea unei echipe (partajare de echipă)

Ambele modele sunt cumulative. Un utilizator obține acces dacă este fie:

- Partajat direct (partajare de utilizator), fie
- Membru al unei echipe care are o partajare de echipă

## Ce poate fi partajat cu echipele

| Resursă | Locația partajării |
|----------|----------------|
| Workflow-uri | Dialogul de partajare din editorul de workflow |
| Șabloane de workflow | Dialogul de partajare la crearea/editarea unui șablon de workflow |
| Șabloane de noduri | Dialogul de partajare la crearea/editarea unui șablon de nod |
| Acreditări | Dialogul de partajare din fila Acreditări |
| Variabile globale | Dialogul de partajare din fila Variabile |
| Depozite vectoriale | Dialogul de partajare din fila Vectori |
| Fișiere Drive | Dialogul de partajare din fila Drive sau operațiunile `shareWithMyTeams` / `unshareWithMyTeams` ale nodului Drive |

Pentru șabloane, când vizibilitatea este **Utilizatori specifici**, puteți selecta și echipe. Toți membrii echipelor selectate obțin acces la șablon.
Partajările de fișiere Drive cu echipele sunt doar pentru citire pentru membrii echipei; proprietarul fișierului păstrează permisiunile de gestionare.

## Endpoint-uri API

- `GET /api/teams` – Listează echipele din care face parte utilizatorul
- `GET /api/teams/{id}` – Obține detaliile echipei cu membri
- `GET /api/teams/{id}/shared-entities` – Returnează entitățile partajate cu echipa (workflow-uri, acreditări, variabile globale, depozite vectoriale, fișiere, șabloane de workflow, șabloane de noduri)
- `POST /api/teams` – Creează echipă
- `PATCH /api/teams/{id}` – Actualizează echipa
- `DELETE /api/teams/{id}` – Șterge echipa (doar creatorul)
- `POST /api/teams/{id}/members` – Adaugă membru (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Elimină membru

Partajări de echipă per resursă:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – body-ul POST acceptă `permission` (`read` sau `write`, implicit `write`); postarea din nou a unei echipe existente îi actualizează permisiunea
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Resurse conexe

- [Fila Echipe](../tabs/teams-tab.md) – Creați și gestionați echipe
- [Fila Șabloane](../tabs/templates-tab.md) – Partajați șabloane de workflow și de noduri cu echipele
- [Partajarea acreditărilor](./credentials-sharing.md) – Partajați acreditări cu utilizatori și echipe
- [Organizarea workflow-urilor](./workflow-organization.md) – Dosare și partajarea workflow-urilor
