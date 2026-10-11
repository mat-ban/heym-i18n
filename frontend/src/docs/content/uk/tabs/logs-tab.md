# Вкладка Logs

Вкладка **Logs** показує логи Docker-контейнерів для стеку Heym. Використовуйте її для налагодження, моніторингу та усунення неполадок. Для логів виконання Workflow (результати вузлів, виводи) використовуйте панель Debug у редакторі Workflow — див. [Canvas Features](../reference/canvas-features.md#execution-logs).

Логи на основі Docker вимкнено за замовчуванням у self-hosted розгортаннях. Щоб увімкнути їх, встановіть `DOCKER_LOGS_ENABLED=true`, встановіть `DOCKER_LOGS_ALLOWED_EMAILS` як список електронних адрес довірених користувачів, розділених комами, яким дозволено доступ до Docker-логів, і переконайтеся, що `/var/run/docker.sock` змонтовано в контейнер backend. Сервіс Docker Compose за замовчуванням і приклад прямого `docker run` включають це монтування для Docker-based MCP stdio інструментів; залишайте його лише тоді, коли Ви приймаєте межу довіри Docker socket.

Якщо реєстрація відкрита, створіть довірений адміністративний акаунт перед увімкненням Docker-логів або залиште `ALLOW_REGISTER=false`; інакше непідтверджена самореєстрація може заявити електронну адресу зі списку дозволених.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Переглянути демо Logs</a></p>

## Вибір контейнера

- **All Containers** – Об'єднані логи з backend, frontend і PostgreSQL
- **Backend** – контейнер `heym-backend`
- **Frontend** – контейнер `heym-frontend`
- **PostgreSQL** – контейнер `heym-postgres`

## Фільтр рівня логів

- **All** – Показати всі рівні логів
- **INFO** – INFO і вище
- **WARNING** – Попередження та помилки
- **ERROR** – Лише помилки
- **DEBUG** – Debug і вище

## Пошук

- Фільтруйте логи за текстовим пошуком
- Збіги виділяються у виводі логів

## Функції

- **Auto scroll** – Прокрутка вниз у міру надходження нових логів
- **Stream** – Потокове передавання логів у реальному часі (коли підтримується)
- **Copy** – Копіювати логи до буфера обміну
- **Download** – Завантажити логи як файл

## Сценарії використання

- Налагодження збоїв виконання Workflow
- Перевірка логів запитів/відповідей API
- Моніторинг запитів до бази даних
- Перевірка повідомлень запуску та стану

## Пов'язане

- [Canvas Features](../reference/canvas-features.md) – Логи виконання в панелі Debug Workflow
- [Traces Tab](./traces-tab.md) – Перевірка LLM-трейсів
- [Analytics Tab](./analytics-tab.md) – Метрики виконання
- [Workflows Tab](./workflows-tab.md) – Керування Workflow
- [Contextual Showcase](../reference/contextual-showcase.md) – Компактний посібник зі сторінок для поверхонь dashboard
