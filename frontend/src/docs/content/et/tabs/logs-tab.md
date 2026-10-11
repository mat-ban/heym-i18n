# Logide vahekaart

**Logide** vahekaart kuvab Heymi stack'i Dockeri konteinerite logisid. Kasutage seda silumiseks, monitooringuks ja tõrkeotsinguks. Workflow'de käivitamise logide (sõlmede tulemused, väljundid) jaoks kasutage workflow redaktoris Debug-paneeli — vt [Lõuendi funktsioonid](../reference/canvas-features.md#execution-logs).

Dockeril põhinevad logid on isemajutatud juurutustes vaikimisi keelatud. Nende lubamiseks määrake `DOCKER_LOGS_ENABLED=true`, seadke `DOCKER_LOGS_ALLOWED_EMAILS` komadega eraldatud usaldusväärsete kasutajate e-posti aadresside loendiks, kellel on lubatud Dockeri logidele juurde pääseda, ja veenduge, et `/var/run/docker.sock` on backend-konteinerisse mountitud. Vaikimisi Docker Compose'i teenus ja otsene `docker run` näide sisaldavad seda mount'i Dockeril põhinevate MCP stdio tööriistade jaoks; hoidke seda ainult siis, kui aktsepteerite Dockeri socket'i usalduspiiri.

Kui registreerimine on avatud, looge usaldusväärne admin-konto enne Dockeri logide lubamist või hoidke `ALLOW_REGISTER=false`; vastasel juhul võib kinnitamata iseregistreerimine hõivata lubatud nimekirjas oleva e-posti aadressi.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Vaadake logide demo</a></p>

## Konteineri valik

- **Kõik konteinerid** – backend'i, frontend'i ja PostgreSQL-i kombineeritud logid
- **Backend** – `heym-backend` konteiner
- **Frontend** – `heym-frontend` konteiner
- **PostgreSQL** – `heym-postgres` konteiner

## Logitaseme filter

- **Kõik** – Kuva kõik logitasemed
- **INFO** – INFO ja kõrgemad
- **WARNING** – Hoiatused ja vead
- **ERROR** – Ainult vead
- **DEBUG** – Debug ja kõrgemad

## Otsing

- Filtreerige logisid tekstipõhise otsinguga
- Vasted on logi väljundis esile tõstetud

## Funktsioonid

- **Automaatne kerimine** – Keri alla, kui uued logid saabuvad
- **Voogedastus** – Voogedasta logisid reaalajas (kui toetatud)
- **Kopeeri** – Kopeeri logid lõikelauale
- **Laadi alla** – Laadi logid failina alla

## Kasutusjuhud

- Workflow'de käivitamise tõrgete silumine
- API päringu/vastuse logide uurimine
- Andmebaasi päringute monitoorimine
- Käivitumise ja terviseteavituste kontrollimine

## Seotud

- [Lõuendi funktsioonid](../reference/canvas-features.md) – Käivitamise logid workflow Debug-paneelis
- [Käivituste vahekaart](./traces-tab.md) – LLM käivituste uurimine
- [Analüütika vahekaart](./analytics-tab.md) – Käivitamise mõõdikud
- [Workflow'de vahekaart](./workflows-tab.md) – Workflow'de haldamine
- [Kontekstipõhine showcase](../reference/contextual-showcase.md) – Kompaktne lehejuhend armatuurlaua vaadetele
