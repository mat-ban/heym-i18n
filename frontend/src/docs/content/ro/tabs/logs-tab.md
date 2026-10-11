# Filă Logs

Fila **Logs** afișează jurnalele containerelor Docker pentru stiva Heym. Utilizați-o pentru depanare, monitorizare și diagnosticare. Pentru jurnalele de execuție ale workflow-urilor (rezultatele nodurilor, ieșiri), utilizați panoul Debug din editorul de workflow—consultați [Canvas Features](../reference/canvas-features.md#execution-logs).

Jurnalele bazate pe Docker sunt dezactivate implicit în implementările self-hosted. Pentru a le activa, setați `DOCKER_LOGS_ENABLED=true`, setați `DOCKER_LOGS_ALLOWED_EMAILS` la o listă separată prin virgule de adrese de email ale utilizatorilor de încredere cărora li se permite accesul la jurnalele Docker și asigurați-vă că `/var/run/docker.sock` este montat în containerul backend. Serviciul Docker Compose implicit și exemplul direct `docker run` includ acea montare pentru instrumentele MCP stdio bazate pe Docker; păstrați-o doar atunci când acceptați granița de încredere a socket-ului Docker.

Dacă înregistrarea este deschisă, creați contul de administrator de încredere înainte de a activa jurnalele Docker sau păstrați `ALLOW_REGISTER=false`; altfel, o auto-înregistrare neverificată ar putea revendica un email inclus în lista de permisiuni.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

## Selectarea containerului

- **All Containers** – Jurnale combinate de la backend, frontend și PostgreSQL
- **Backend** – containerul `heym-backend`
- **Frontend** – containerul `heym-frontend`
- **PostgreSQL** – containerul `heym-postgres`

## Filtru nivel de jurnal

- **All** – Afișează toate nivelurile de jurnal
- **INFO** – INFO și nivelurile superioare
- **WARNING** – Avertismente și erori
- **ERROR** – Doar erori
- **DEBUG** – Debug și nivelurile superioare

## Căutare

- Filtrați jurnalele după căutare text
- Potrivirile sunt evidențiate în ieșirea jurnalului

## Funcționalități

- **Auto scroll** – Derulați la final pe măsură ce sosesc jurnale noi
- **Stream** – Transmiteți jurnalele în timp real (când este acceptat)
- **Copy** – Copiați jurnalele în clipboard
- **Download** – Descărcați jurnalele ca fișier

## Cazuri de utilizare

- Depanați eșecurile de execuție ale workflow-urilor
- Inspectați jurnalele de cerere/răspuns API
- Monitorizați interogările bazei de date
- Verificați mesajele de pornire și de stare

## Resurse conexe

- [Canvas Features](../reference/canvas-features.md) – Jurnalele de execuție din panoul Debug al workflow-ului
- [Traces Tab](./traces-tab.md) – Inspectarea urmelor LLM
- [Analytics Tab](./analytics-tab.md) – Metrici de execuție
- [Workflows Tab](./workflows-tab.md) – Gestionarea workflow-urilor
- [Contextual Showcase](../reference/contextual-showcase.md) – Ghid compact de pagină pentru suprafețele dashboard-ului
