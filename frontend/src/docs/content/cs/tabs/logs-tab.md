# Karta Logs

Karta **Logs** zobrazuje logy Docker kontejnerů pro stack Heym. Použijte ji pro ladění, monitorování a řešení problémů. Pro logy spouštění workflow (výsledky uzlů, výstupy) použijte panel Debug v editoru workflow – viz [Canvas Features](../reference/canvas-features.md#execution-logs).

Logy založené na Dockeru jsou ve self-hosted nasazeních ve výchozím stavu zakázané. Chcete-li je povolit, nastavte `DOCKER_LOGS_ENABLED=true`, nastavte `DOCKER_LOGS_ALLOWED_EMAILS` na čárkou oddělený seznam e-mailů důvěryhodných uživatelů, kteří mají přístup k Docker logům, a ujistěte se, že `/var/run/docker.sock` je připojen do backend kontejneru. Výchozí služba Docker Compose a příklad přímého spuštění `docker run` toto připojení obsahují pro nástroje Docker-based MCP stdio; ponechte jej pouze tehdy, pokud akceptujete hranici důvěry Docker socketu.

Pokud je registrace otevřená, vytvořte důvěryhodný admin účet před povolením Docker logů, nebo ponechte `ALLOW_REGISTER=false`; jinak by neověřená self-registrace mohla získat e-mail uvedený v allow-listu.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

## Výběr kontejneru

- **All Containers** – Kombinované logy z backendu, frontendu a PostgreSQL
- **Backend** – kontejner `heym-backend`
- **Frontend** – kontejner `heym-frontend`
- **PostgreSQL** – kontejner `heym-postgres`

## Filtr úrovně logů

- **All** – Zobrazit všechny úrovně logů
- **INFO** – INFO a vyšší
- **WARNING** – Varování a chyby
- **ERROR** – Pouze chyby
- **DEBUG** – Debug a vyšší

## Vyhledávání

- Filtrování logů pomocí textového vyhledávání
- Shody jsou zvýrazněny ve výstupu logů

## Funkce

- **Auto scroll** – Automatické posouvání na konec při příchodu nových logů
- **Stream** – Streamování logů v reálném čase (pokud je podporováno)
- **Copy** – Kopírování logů do schránky
- **Download** – Stažení logů jako souboru

## Případy použití

- Ladění selhání spouštění workflow
- Kontrola logů API požadavků/odpovědí
- Monitorování databázových dotazů
- Kontrola zpráv při startu a zdraví systému

## Související

- [Canvas Features](../reference/canvas-features.md) – Logy spouštění v panelu Debug workflow
- [Traces Tab](./traces-tab.md) – Kontrola LLM trace
- [Analytics Tab](./analytics-tab.md) – Metriky spouštění
- [Workflows Tab](./workflows-tab.md) – Správa workflow
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktní průvodce stránkou pro dashboard plochy
