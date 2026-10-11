# Naplók lap

A **Naplók** lap a Heym stack Docker konténer naplóit jeleníti meg. Használja hibakereséshez, monitorozáshoz és hibaelhárításhoz. A workflow-végrehajtási naplókhoz (csomópont-eredmények, kimenetek) használja a workflow-szerkesztő Debug paneljét – lásd [Vászon funkciók](../reference/canvas-features.md#execution-logs).

A Docker-alapú naplók alapértelmezés szerint le vannak tiltva az önállóan üzemeltetett telepítéseknél. Az engedélyezésükhöz állítsa be a `DOCKER_LOGS_ENABLED=true` értéket, állítsa a `DOCKER_LOGS_ALLOWED_EMAILS` változót a megbízható felhasználói e-mail címek vesszővel elválasztott listájára, amelyek jogosultak a Docker naplók elérésére, és győződjön meg arról, hogy a `/var/run/docker.sock` be van csatolva a backend konténerbe. Az alapértelmezett Docker Compose szolgáltatás és a közvetlen `docker run` példa tartalmazza ezt a csatolást a Docker-alapú MCP stdio eszközökhöz; csak akkor tartsa meg, ha elfogadja a Docker socket bizalmi határát.

Ha a regisztráció nyitott, hozza létre a megbízható adminisztrátori fiókot a Docker naplók engedélyezése előtt, vagy tartsa a `ALLOW_REGISTER=false` értéket; ellenkező esetben egy nem ellenőrzött önregisztráció igénybe vehet egy engedélyezett listán szereplő e-mail címet.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Naplók demó megtekintése</a></p>

## Konténer kiválasztása

- **Minden konténer** – A backend, frontend és PostgreSQL összevont naplói
- **Backend** – `heym-backend` konténer
- **Frontend** – `heym-frontend` konténer
- **PostgreSQL** – `heym-postgres` konténer

## Naplószint szűrő

- **Minden** – Az összes naplószint megjelenítése
- **INFO** – INFO és magasabb
- **WARNING** – Figyelmeztetések és hibák
- **ERROR** – Csak hibák
- **DEBUG** – Debug és magasabb

## Keresés

- Naplók szűrése szöveges kereséssel
- A találatok kiemelve jelennek meg a naplókimenetben

## Funkciók

- **Automatikus görgetés** – Görgetés az aljára, ahogy új naplók érkeznek
- **Stream** – Naplók valós idejű streamelése (amikor támogatott)
- **Másolás** – Naplók másolása a vágólapra
- **Letöltés** – Naplók letöltése fájlként

## Használati esetek

- Workflow-végrehajtási hibák hibakeresése
- API kérés/válasz naplók vizsgálata
- Adatbázis-lekérdezések monitorozása
- Indítási és állapotüzenetek ellenőrzése

## Kapcsolódó

- [Vászon funkciók](../reference/canvas-features.md) – Végrehajtási naplók a workflow Debug paneljében
- [Nyomkövetések lap](./traces-tab.md) – LLM nyomkövetés vizsgálata
- [Analitika lap](./analytics-tab.md) – Végrehajtási metrikák
- [Workflow-k lap](./workflows-tab.md) – Workflow-kezelés
- [Kontextuális bemutató](../reference/contextual-showcase.md) – Kompakt oldalútmutató az irányítópult felületeihez
