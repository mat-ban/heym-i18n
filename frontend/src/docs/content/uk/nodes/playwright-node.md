# Playwright

**Вузол Playwright** автоматизує взаємодію з браузером за допомогою налаштовуваних кроків. Використовуйте його для вебскрейпінгу, заповнення форм і браузерних Workflow.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вихід | `$nodeLabel.results`, `$nodeLabel.screenshot` та опціональні дані мережі/браузера |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (за замовчуванням) або `"code"` (Run Code). Вибір у випадаючому списку Mode на панелі властивостей |
| `playwrightSteps` | array | Кроки: navigate, click, type, aiStep тощо. Кожен крок має action та selector/params. `disabled: true` залишає крок у списку, але пропускає його під час виконання |
| `playwrightCode` | string | Власний код Playwright Python, що використовується, коли Mode встановлено на Run Code. Виконується в захищеному sandbox і **вимкнений за замовчуванням** — див. примітку про безпеку нижче |
| `playwrightHeadless` | boolean | Запуск у headless-режимі (за замовчуванням: true) |
| `playwrightStealth` | boolean | Опціональне налаштування режиму Steps, що зменшує типові сигнали автоматизації Playwright (за замовчуванням: false). Позначка на панелі властивостей: Reduce automation flags |
| `playwrightTimeout` | number | Час очікування в мс (за замовчуванням: 30000) |
| `playwrightCaptureNetwork` | boolean | Захоплення відповідей JSON, заголовків, cookies та сховища браузера |
| `playwrightAuthEnabled` | boolean | Відновлення автентифікації браузера з cookies/storageState перед виконанням кроків |
| `playwrightAuthStateExpression` | string | Вираз або JSON, що розв'язується у Playwright `storageState` або необроблений `cookies[]` |
| `playwrightAuthCheckSelector` | string | Селектор, який має бути видимим після ініціалізації автентифікації |
| `playwrightAuthCheckTimeout` | number | Час очікування в мс для перевірки селектора автентифікації (за замовчуванням: 5000) |
| `playwrightAuthFallbackSteps` | array | Кроки резервного входу, які виконуються, коли відновлення cookies не автентифікує сторінку |

## Типи кроків

- **navigate** – Перехід за URL-адресою
- **refresh** – Перезавантаження поточної сторінки (опціональний `timeout` кроку в мс для навігації перезавантаження)
- **click** – Клік по елементу за селектором
- **type** – Введення тексту в поле (посимвольно)
- **fill** – Заповнення значення поля
- **wait** – Очікування протягом тайм-ауту (мс)
- **screenshot** – Захоплення скриншота (`outputKey` зберігає base64 у results)
- **getText** – Текстовий вміст елемента (`selector`, опціональний `outputKey`)
- **getAttribute** – Значення атрибута (`selector`, `attribute`, опціональний `outputKey`)
- **getHTML** – Зовнішній HTML елемента (`selector`, опціональний `outputKey`)
- **getVisibleTextOnPage** – Повний видимий текст сторінки як `document.body.innerText` (без селектора; використовуйте `outputKey`; опціональний `timeout` кроку в мс очікує перед захопленням)
- **hover** – Наведення курсора на елемент
- **selectOption** – Вибір опції в `<select>`
- **scrollDown** / **scrollUp** – Прокрутка коліщатком миші (опціональний `amount` у пікселях)
- **aiStep** – LLM повертає ті самі типи дій, що й ручні кроки (див. нижче); вкладений `aiStep` не підтримується

## Вимкнення кроку

Кожен крок має перемикач живлення у своєму заголовку. Вимкнений крок відображається із закресленим і приглушеним заголовком, залишається у списку з усіма своїми полями та пропускається під час виконання вузла — це корисно для ізоляції селектора, що не працює, без видалення роботи. Збережений крок містить `disabled: true`; кроки без цього прапорця виконуються звичайно.

Вимкнені кроки невидимі для решти вузла: вони не задовольняють правило "перший крок має бути `navigate`" для ініціалізації автентифікації, вимкнений `aiStep` не викликає LLM, а вимкнені записи в `playwrightAuthFallbackSteps` також пропускаються. Вимкнення всіх кроків призводить до помилки виконання з повідомленням із проханням увімкнути хоча б один.

## AI Step

Дія **aiStep** використовує LLM для аналізу HTML сторінки (та, за бажанням, скриншота) і генерації дій Playwright із інструкцій природною мовою. API приймає ті самі назви дій, що й ручні кроки (включно з `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, прокрутками тощо). **Auto heal** замінює лише невдалі кроки на основі селекторів альтернативами для click, type, fill, hover та selectOption.

| Опція | Опис |
|--------|-------------|
| `instructions` | Що має зробити AI (наприклад, "Click the Login button") |
| `credentialId` | Облікові дані LLM (OpenAI, Google або Custom) |
| `model` | Список моделей із пошуком із вибраних облікових даних LLM |
| `saveStepsForFuture` | Кешування згенерованих кроків для наступних запусків (уникає виклику LLM) |
| `sendScreenshot` | Надсилання скриншота до LLM для візуальних елементів |
| `aiStepTimeout` | Час очікування виклику LLM у мс (за замовчуванням 30000) |

### AI Auto Heal

**AI Auto Heal** робить Workflow стійкими до змін DOM. Коли селектор не спрацьовує двічі (наприклад, після редизайну сайту), Heym викликає LLM, щоб знайти альтернативний локатор — зазвичай `role=button[name='Submit']` або `text=Exact text` замість CSS-селекторів.

Увімкніть **Auto heal mode** у властивостях кроку AI. Якщо збережений крок не спрацьовує:

1. Heym захоплює поточний HTML і скриншот
2. Надсилає невдалий крок + контекст сторінки до LLM
3. LLM повертає надійну альтернативу (локатор на основі ролі, текстовий локатор або резервний CSS)
4. Повторює спробу з новим селектором

Це зменшує нестабільність, коли сайти оновлюють свою розмітку або назви класів.
## Зменшення ознак автоматизації

Увімкніть **Reduce automation flags** (`playwrightStealth: true`), якщо сайт сприймає вбудований Chromium від Playwright як бота через стандартні ознаки автоматизації (`HeadlessChrome` у user agent, `navigator.webdriver`, відсутність `window.chrome`).

Ця опція застосовується лише в режимі **Steps**. Вона:

- Прибирає прапорець Chromium `--enable-automation` та встановлює `--disable-blink-features=AutomationControlled`
- Надсилає стандартний user agent Chrome (без `HeadlessChrome`)
- Відновлює типові поверхні браузера, які Playwright залишає порожніми (`window.chrome`, плагіни)
- Залишає незмінним рендерер GPU хоста, коли GPU доступний (локальні macOS/Windows). У Linux/Docker GPU відсутній; рядок програмного рендерера Chromium повідомляється як типовий GPU Mali (ARM) або Mesa (x86) замість SwiftShader.

Ця опція не приховує, що сеанс керується через Chrome DevTools Protocol, і не є способом обійти захист сайту, CAPTCHA чи механізми контролю доступу. Використовуйте її для workflow, на запуск яких Ви маєте дозвіл — внутрішні інструменти, власні сайти та дозволену автоматизацію браузера.

Режим Run Code залишається без змін — користувацькі скрипти запускають Chromium самостійно.

## Захоплення мережевих даних

Увімкніть `playwrightCaptureNetwork`, щоб збирати додаткові дані для налагодження під час виконання:

- `networkRequests` – Захоплені відповіді JSON/API
- `cookies` – Файли cookie браузера наприкінці виконання
- `localStorage` – Пари ключ-значення `localStorage` браузера
- `sessionStorage` – Пари ключ-значення `sessionStorage` браузера

Це корисно, коли потрібно дослідити приховані виклики API, стан автентифікації або дані на боці браузера після завершення автоматизованого потоку.

## Початкове налаштування cookie та резервний вхід

Увімкніть `playwrightAuthEnabled`, якщо потрібно, щоб Playwright відкривав сторінку вже автентифікованим.

### Джерело стану автентифікації

Встановіть `playwrightAuthStateExpression` у вираз, наприклад `$global.authState`. Значенням може бути:

- Об'єкт `storageState` Playwright: `{"cookies": [...], "origins": [...]}`
- Необроблений масив `cookies[]`
- Рядок JSON, що містить будь-яку з цих форм

Рекомендований підхід:

1. Запустіть вузол Playwright із увімкненим захопленням мережевих даних або початковим налаштуванням автентифікації
2. Збережіть `$playwrightNode.cookies` або повний об'єкт стану автентифікації у [Global Variable](../reference/global-variables.md)
3. Повторно використайте цю змінну в наступних вузлах Playwright через `$global.authState`

### Перевірка автентифікації

Першим основним кроком Playwright має бути `navigate`. Після завантаження цього кроку Heym перевіряє `playwrightAuthCheckSelector`.

- Якщо селектор видимий, решта основних кроків продовжується звичайним чином
- Якщо селектор відсутній, Heym виконує `playwrightAuthFallbackSteps`
- Після завершення резервних кроків Heym знову перевіряє той самий селектор
- Якщо селектор усе ще відсутній, вузол завершується помилкою початкового налаштування автентифікації

Резервні кроки керують навігацією після невдалої автентифікації. Вони мають залишити браузер на автентифікованій сторінці, якої очікує решта основного потоку.

## Вихідні поля

- `$playwrightNode.status` – `"ok"` у разі успіху
- `$playwrightNode.results` – Виводи кроків (getText, getHTML, getVisibleTextOnPage, getAttribute, ключі screenshot тощо)
- `$playwrightNode.screenshot` – Знімок екрана у Base64, коли крок його зберігає
- `$playwrightNode.cookies` – Фінальні файли cookie браузера, коли увімкнено початкове налаштування автентифікації або захоплення мережевих даних
- `$playwrightNode.networkRequests` – Захоплені мережеві відповіді (коли увімкнено)
- `$playwrightNode.localStorage` – Локальне сховище браузера (коли увімкнено)
- `$playwrightNode.sessionStorage` – Сеансове сховище браузера (коли увімкнено)

## Приклад

```json
{
  "type": "playwright",
  "data": {
    "label": "browserAutomation",
    "playwrightSteps": [
      { "action": "navigate", "url": "$userInput.body.url" },
      { "action": "type", "selector": "#search", "text": "query" },
      { "action": "click", "selector": "button[type=submit]" }
    ],
    "playwrightHeadless": true
  }
}
```

## Режим Run Code

На панелі властивостей встановіть **Mode** у значення **Run Code**, щоб редагувати `playwrightCode` замість візуальних кроків. Початкове налаштування автентифікації застосовується лише до режиму Steps.

Приклад (sandbox / Docker — Chromium потребує `--no-sandbox`):

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=headless,
        args=["--no-sandbox", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    )
    page = browser.new_page()
    page.set_default_timeout(timeout_ms)
    page.goto("https://example.com")
    title = page.title()
    browser.close()
    print(json.dumps({"status": "ok", "results": {"title": title}}))
```

Обгортка надає `inputs`, `headless`, `timeout_ms` та `capture_network`. Ви можете вбудовувати вирази `$nodeLabel.field` у код; виводьте JSON зі `status` та `results`.
## Безпека користувацького коду

Поле `playwrightCode` виконує довільний код Python. Оскільки це рівнозначно виконанню коду, його **вимкнено за замовчуванням**, а в разі увімкнення він ізольовано в пісочниці:

- **Вимкнено за замовчуванням.** Виконання вузла, для якого задано `playwrightCode`, завершується зрозумілою помилкою, якщо оператор не встановить `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Перевірка виконується під час запуску, тому вона також охоплює раніше збережені workflow та запуски за розкладом / запуски під-workflow.
- **Ізольовано в разі увімкнення.** Користувацький код не виконується в процесі бекенду. Він виконується в посиленому, тимчасовому сусідньому контейнері без Docker-сокета, без bind-mount бекенду, без секретів бекенду в його середовищі, зі скинутими можливостями, `no-new-privileges` та обмеженнями CPU / пам'яті / PID. Якщо Docker недоступний, запуск завершується відмовою (fail closed). `HEYM_PLAYWRIGHT_SANDBOX=subprocess` повертає виконання до внутрішньопроцесного шляху лише для довіреного використання або локальної розробки (це не межа безпеки). Нативний `./run.sh` за замовчуванням використовує `subprocess`, якщо не задано `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) та єдиний образ GHCR визначають сусідній runner через `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (з відкатом до `HEYM_CODEX_DOCKER_IMAGE`) і використовують відповідний шлях venv (`/app/.venv` проти `/app/backend/.venv`).
- **Примітка щодо Chromium.** Контейнер пісочниці за замовчуванням працює від імені root, а Chromium відмовляється працювати від імені root без `--no-sandbox`. Користувацький код, який запускає Chromium, має передавати цей прапорець, наприклад `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Запуски на основі кроків (а також stealth-запуски) також передають `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, щоб скрипти фінгепринтингу не могли відкрити STUN UDP до `stun.l.google.com:19302`. Користувацькі виклики `chromium.launch` також мають містити цей прапорець.

Вузли Playwright на основі кроків (`playwrightSteps`) повністю генеруються Heym (без довільного коду), не зазнають впливу всього зазначеного вище та завжди доступні — надавайте їм перевагу.

## Пов'язане

- [Node Types](../reference/node-types.md) – Огляд усіх типів вузлів
- [Crawler Node](./crawler-node.md) – Простіше веб-скрейпінг із FlareSolverr
- [Credentials Sharing](../reference/credentials-sharing.md) – Облікові дані LLM для кроків AI
