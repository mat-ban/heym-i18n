# Zavihek Dnevniki

Zavihek **Dnevniki** prikazuje dnevnike Docker kontejnerjev za Heym sklad. Uporabite ga za odpravljanje napak, spremljanje in reševanje težav. Za dnevnike izvajanja workflow (rezultati vozlišč, izhodi) uporabite panel za odpravljanje napak v urejevalniku workflow—glejte [Funkcije Platna](../reference/canvas-features.md#execution-logs).

Dnevniki, podprti z Dockerjem, so privzeto onemogočeni v samo-gostovanih namestitvah. Da jih omogočite, nastavite `DOCKER_LOGS_ENABLED=true`, nastavite `DOCKER_LOGS_ALLOWED_EMAILS` na seznam zaupanja vrednih uporabniških e-poštnih naslovov, ločenih s vejicami, ki jim je dovoljeno dostopati do Docker dnevnikov, in poskrbite, da je `/var/run/docker.sock` montiran v zadnji kontejner. Privzeta storitev Docker Compose in neposreden primer `docker run` vključujeta to montažo za orodja MCP stdio, ki temeljijo na Dockerju; obdržite jo le, če sprejmete zaupnost Docker socket.

Če je registracija odprta, ustvarite zaupanja vredni administratorski račun pred omogočanjem Docker dnevnikov ali obdržite `ALLOW_REGISTER=false`; sicer bi lahko nepreverjena samoregistracija prevzela e-poštni naslov, ki je na seznamu dovoljenih.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Oglejte si predstavitev Dnevnikov</a></p>

## Izbira Kontejnerja

- **Vsi Kontejnerji** – Združeni dnevniki iz zadnjega dela, sprednjega dela in PostgreSQL
- **Zadnji Del** – Kontejner `heym-backend`
- **Sprednji Del** – Kontejner `heym-frontend`
- **PostgreSQL** – Kontejner `heym-postgres`

## Filter Nivoja Dnevnikov

- **Vsi** – Prikaži vse nivoje dnevnikov
- **INFO** – INFO in višje
- **WARNING** – Opozorila in napake
- **ERROR** – Le napake
- **DEBUG** – Debug in višje

## Iskanje

- Filtrirajte dnevnike po iskanju besedila
- Ujemanja so označena v izhodu dnevnikov

## Funkcije

- **Samodejno pomikanje** – Pomik na dno, ko novi dnevniki prispejo
- **Pretakanje** – Pretakajte dnevnike v realnem času (ko je podprto)
- **Kopiraj** – Kopirajte dnevnike v odložišče
- **Prenesi** – Prenesite dnevnike kot datoteko

## Uporabniški Primeri

- Odpravljanje napak pri neuspehih izvajanja workflow
- Pregled dnevnikov zahtevkov/odgovorov API
- Spremljanje poizvedb v bazi podatkov
- Preverjanje sporočil ob zagonu in zdravju

## Sorodno

- [Funkcije Platna](../reference/canvas-features.md) – Dnevniki izvajanja v panelu za odpravljanje napak workflow
- [Zavihek Sledi](./traces-tab.md) – Pregled sledi LLM
- [Zavihek Analitika](./analytics-tab.md) – Metrični podatki izvajanja
- [Zavihek Workflows](./workflows-tab.md) – Upravljanje workflow
- [Kontekstna Predstavitev](../reference/contextual-showcase.md) – Kompaktni vodnik po straneh nadzorne plošče
