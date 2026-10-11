# Teams

A Teams segítségével egyszerre oszthat meg workflow-kat, hitelesítési adatokat, globális változókat, vektortárolókat és Drive-fájlokat egy felhasználói csoporttal.

## Áttekintés

- **Team** – Elnevezett csoport egy létrehozóval és tagokkal
- **Létrehozó** – Mindig tag; szerkesztheti a teamet, törölheti a teamet, tagokat adhat hozzá
- **Tag** – Hozzáadhat és eltávolíthat más tagokat (a létrehozó kivételével); hozzáfér a teammel megosztott erőforrásokhoz

## Teamek létrehozása és kezelése

A teameket a [Teams fülön](../tabs/teams-tab.md) hozhatja létre. A tagokat e-mail-cím alapján adhatja hozzá; rendelkezniük kell fiókkal. A létrehozó nem távolítható el. A team törlésével az összes team-megosztás is törlődik.

## Megosztási modell

Az erőforrások az alábbiakkal oszthatók meg:

1. **Egyéni felhasználók** – E-mail-cím alapján (felhasználók közötti megosztás)
2. **Teamek** – Team kiválasztásával (team-megosztás)

Mindkét modell additív. A felhasználó hozzáférést kap, ha:

- közvetlenül megosztották vele (felhasználói megosztás), vagy
- olyan team tagja, amellyel team-megosztás történt

## Mi osztható meg teamekkel

| Erőforrás | Megosztás helye |
|----------|----------------|
| Workflow-k | Megosztási párbeszédpanel a workflow-szerkesztőben |
| Workflow-sablonok | Megosztási párbeszédpanel workflow-sablon létrehozásakor/szerkesztésekor |
| Csomópont-sablonok | Megosztási párbeszédpanel csomópont-sablon létrehozásakor/szerkesztésekor |
| Hitelesítési adatok | Megosztási párbeszédpanel a Hitelesítési adatok fülön |
| Globális változók | Megosztási párbeszédpanel a Változók fülön |
| Vektortárolók | Megosztási párbeszédpanel a Vectors fülön |
| Drive-fájlok | Megosztási párbeszédpanel a Drive fülön vagy a Drive csomópont `shareWithMyTeams` / `unshareWithMyTeams` műveletei |

Sablonok esetében, ha a láthatóság **Specific users**, teameket is kiválaszthat. A kiválasztott teamek összes tagja hozzáférést kap a sablonhoz.
A Drive-fájlok team-megosztása a teamtagok számára csak olvasható; a fájl tulajdonosa megtartja a kezelési jogosultságokat.

## API Endpointok

- `GET /api/teams` – A felhasználóhoz tartozó teamek listázása
- `GET /api/teams/{id}` – Team részleteinek lekérése a tagokkal
- `GET /api/teams/{id}/shared-entities` – A teammel megosztott entitások visszaadása (workflow-k, hitelesítési adatok, globális változók, vektortárolók, fájlok, workflow-sablonok, csomópont-sablonok)
- `POST /api/teams` – Team létrehozása
- `PATCH /api/teams/{id}` – Team frissítése
- `DELETE /api/teams/{id}` – Team törlése (csak a létrehozó)
- `POST /api/teams/{id}/members` – Tag hozzáadása (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Tag eltávolítása

Team-megosztások erőforrásonként:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – a POST body elfogadja a `permission` értéket (`read` vagy `write`, alapértelmezés: `write`); egy meglévő team újbóli beküldése frissíti annak jogosultságát
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Kapcsolódó témák

- [Teams fül](../tabs/teams-tab.md) – Teamek létrehozása és kezelése
- [Sablonok fül](../tabs/templates-tab.md) – Workflow- és csomópont-sablonok megosztása teamekkel
- [Hitelesítési adatok megosztása](./credentials-sharing.md) – Hitelesítési adatok megosztása felhasználókkal és teamekkel
- [Workflow-szervezés](./workflow-organization.md) – Mappák és workflow-megosztás
