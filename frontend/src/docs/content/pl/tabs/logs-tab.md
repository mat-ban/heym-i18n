# Karta Logs

Karta **Logs** wyświetla logi kontenerów Docker dla stosu Heym. Służy do debugowania, monitorowania i rozwiązywania problemów. W przypadku logów wykonania workflow (wyniki węzłów, dane wyjściowe) należy korzystać z panelu Debug w edytorze workflow — zobacz [Canvas Features](../reference/canvas-features.md#execution-logs).

Logi oparte na Dockerze są domyślnie wyłączone we wdrożeniach self-hosted. Aby je włączyć, należy ustawić `DOCKER_LOGS_ENABLED=true`, ustawić `DOCKER_LOGS_ALLOWED_EMAILS` na listę zaufanych adresów e-mail użytkowników rozdzielonych przecinkami, którym wolno uzyskiwać dostęp do logów Docker, oraz upewnić się, że `/var/run/docker.sock` jest zamontowany w kontenerze backendu. Domyślna usługa Docker Compose oraz bezpośredni przykład `docker run` zawierają ten montaż dla narzędzi Docker-based MCP stdio; należy go zachować wyłącznie wtedy, gdy akceptowana jest granica zaufania gniazda Docker.

Jeśli rejestracja jest otwarta, należy utworzyć zaufane konto administratora przed włączeniem logów Docker lub pozostawić `ALLOW_REGISTER=false`; w przeciwnym razie niezweryfikowana samodzielna rejestracja mogłaby przejąć adres e-mail znajdujący się na liście dozwolonych.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

## Wybór kontenera

- **All Containers** – Połączone logi z backendu, frontendu i PostgreSQL
- **Backend** – kontener `heym-backend`
- **Frontend** – kontener `heym-frontend`
- **PostgreSQL** – kontener `heym-postgres`

## Filtr poziomu logów

- **All** – Wyświetl wszystkie poziomy logów
- **INFO** – INFO i wyższe
- **WARNING** – Ostrzeżenia i błędy
- **ERROR** – Tylko błędy
- **DEBUG** – Debug i wyższe

## Wyszukiwanie

- Filtrowanie logów za pomocą wyszukiwania tekstowego
- Dopasowania są wyróżniane w danych wyjściowych logów

## Funkcje

- **Auto scroll** – Automatyczne przewijanie do dołu w miarę napływania nowych logów
- **Stream** – Strumieniowanie logów w czasie rzeczywistym (gdy obsługiwane)
- **Copy** – Kopiowanie logów do schowka
- **Download** – Pobieranie logów jako pliku

## Zastosowania

- Debugowanie niepowodzeń wykonania workflow
- Inspekcja logów żądań/odpowiedzi API
- Monitorowanie zapytań do bazy danych
- Sprawdzanie komunikatów startowych i dotyczących kondycji

## Powiązane

- [Canvas Features](../reference/canvas-features.md) – Logi wykonania w panelu Debug workflow
- [Traces Tab](./traces-tab.md) – Inspekcja śladów LLM
- [Analytics Tab](./analytics-tab.md) – Metryki wykonania
- [Workflows Tab](./workflows-tab.md) – Zarządzanie workflow
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktowy przewodnik po powierzchniach dashboardu
