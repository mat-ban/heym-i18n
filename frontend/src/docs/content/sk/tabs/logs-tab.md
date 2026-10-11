# Karta Logs

Karta **Logs** zobrazuje logy Docker kontajnerov pre stack Heym. Použite ju na ladenie, monitorovanie a riešenie problémov. Pre logy spustení workflowov (výsledky uzlov, výstupy) použite panel Debug v editore workflowu – pozrite si [Canvas Features](../reference/canvas-features.md#execution-logs).

Logy založené na Dockeri sú v samostatne hostovaných nasadeniach predvolene vypnuté. Ak ich chcete povoliť, nastavte `DOCKER_LOGS_ENABLED=true`, nastavte `DOCKER_LOGS_ALLOWED_EMAILS` na zoznam e-mailov dôveryhodných používateľov oddelených čiarkami, ktorí majú povolený prístup k Docker logom, a uistite sa, že `/var/run/docker.sock` je pripojený do backendového kontajnera. Predvolená služba Docker Compose a príklad priameho spustenia `docker run` obsahujú toto pripojenie pre nástroje Docker-based MCP stdio; ponechajte ho len vtedy, ak akceptujete hranicu dôvery Docker socketu.

Ak je registrácia otvorená, vytvorte dôveryhodný administrátorský účet pred povolením Docker logov alebo ponechajte `ALLOW_REGISTER=false`; v opačnom prípade by si neoverená samoregistrácia mohla nárokovať e-mail zo zoznamu povolených.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Pozrite si ukážku Logs</a></p>

## Výber kontajnera

- **All Containers** – Kombinované logy z backendu, frontendu a PostgreSQL
- **Backend** – kontajner `heym-backend`
- **Frontend** – kontajner `heym-frontend`
- **PostgreSQL** – kontajner `heym-postgres`

## Filter úrovne logov

- **All** – Zobraziť všetky úrovne logov
- **INFO** – INFO a vyššie
- **WARNING** – Upozornenia a chyby
- **ERROR** – Iba chyby
- **DEBUG** – Debug a vyššie

## Vyhľadávanie

- Filtrovanie logov pomocou textového vyhľadávania
- Zhody sú zvýraznené vo výstupe logov

## Funkcie

- **Auto scroll** – Automatické posúvanie na koniec pri príchode nových logov
- **Stream** – Streamovanie logov v reálnom čase (ak je podporované)
- **Copy** – Kopírovanie logov do schránky
- **Download** – Stiahnutie logov ako súboru

## Prípady použitia

- Ladenie zlyhaní spustení workflowov
- Kontrola logov požiadaviek/odpovedí API
- Monitorovanie databázových dotazov
- Kontrola správ o spustení a stave

## Súvisiace

- [Canvas Features](../reference/canvas-features.md) – Logy spustení v paneli Debug workflowu
- [Traces Tab](./traces-tab.md) – Kontrola LLM trace
- [Analytics Tab](./analytics-tab.md) – Metriky spustení
- [Workflows Tab](./workflows-tab.md) – Správa workflowov
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktný sprievodca stránkou pre povrchy dashboardu
