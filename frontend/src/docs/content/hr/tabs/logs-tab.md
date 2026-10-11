# Kartica Zapisa

Kartica **Zapisi** prikazuje logove Docker kontejnera za Heym stog. Koristite je za otklanjanje pogrešaka, praćenje i rješavanje problema. Za logove izvršavanja workflow-a (rezultati čvorova, izlazi) koristite Debug panel u uređivaču workflow-a—vidite [Značajke Platna](../reference/canvas-features.md#execution-logs).

Logovi podržani Docker-om su prema zadanim postavkama onemogućeni u samostalnim implementacijama. Da biste ih omogućili, postavite `DOCKER_LOGS_ENABLED=true`, postavite `DOCKER_LOGS_ALLOWED_EMAILS` na popis povjerenih korisničkih e-mailova odvojenih zarezima koji imaju pravo pristupa Docker logovima, i osigurajte da je `/var/run/docker.sock` montiran u backend kontejner. Zadana Docker Compose usluga i izravni primjer `docker run` uključuju to montiranje za Docker-bazirane MCP stdio alate; zadržite ga samo kada prihvaćate granicu povjerenja Docker socket-a.

Ako je registracija otvorena, kreirajte povjereni administratorski račun prije nego što omogućite Docker logove ili zadržite `ALLOW_REGISTER=false`; inače bi neprovjerena samostalna registracija mogla zatražiti e-mail s dopuštenim popisom.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Pogledajte demo Zapisa</a></p>

## Odabir Kontejnera

- **Svi Kontejneri** – Kombinirani logovi iz backend-a, frontend-a i PostgreSQL-a
- **Backend** – `heym-backend` kontejner
- **Frontend** – `heym-frontend` kontejner
- **PostgreSQL** – `heym-postgres` kontejner

## Filtriranje Razine Logova

- **Sve** – Prikaži sve razine logova
- **INFO** – INFO i više
- **WARNING** – Upozorenja i pogreške
- **ERROR** – Samo pogreške
- **DEBUG** – Debug i više

## Pretraživanje

- Filtrirajte logove prema tekstualnom pretraživanju
- Podudaranja su istaknuta u izlazu logova

## Značajke

- **Automatsko pomicanje** – Pomaknite se na dno dok novi logovi dolaze
- **Stream** – Streamajte logove u stvarnom vremenu (kada je podržano)
- **Kopiraj** – Kopirajte logove u međuspremnik
- **Preuzmi** – Preuzmite logove kao datoteku

## Primjeri Korištenja

- Otklanjanje pogrešaka u neuspjesima izvršavanja workflow-a
- Istraživanje logova API zahtjeva/odgovora
- Praćenje upita prema bazi podataka
- Provjera poruka o pokretanju i zdravlju

## Povezano

- [Značajke Platna](../reference/canvas-features.md) – Logovi izvršavanja u Debug panelu workflow-a
- [Kartica Tragova](./traces-tab.md) – Istraživanje LLM tragova
- [Kartica Analitika](./analytics-tab.md) – Metrički podaci o izvršavanju
- [Kartica Workflows](./workflows-tab.md) – Upravljanje workflow-ima
- [Kontekstualna Izložba](../reference/contextual-showcase.md) – Kompaktni vodič za površine nadzorne ploče
