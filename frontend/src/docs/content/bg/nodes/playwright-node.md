# Playwright

**Playwright** node автоматизира взаимодействията с браузъра чрез конфигурируеми стъпки. Използвайте го за уеб scraping, попълване на формуляри и browser-based workflows.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.results`, `$nodeLabel.screenshot` и опционални network/browser данни |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (по подразбиране) или `"code"` (Run Code). Изберете от падащото меню Mode в Properties Panel |
| `playwrightSteps` | array | Стъпки: navigate, click, type, aiStep и др. Всяка стъпка има action и selector/params. `disabled: true` запазва стъпката в списъка, но я пропуска при изпълнение |
| `playwrightCode` | string | Персонализиран Playwright Python, използван когато Mode е Run Code. Изпълнява се в защитената sandbox среда и е **деактивиран по подразбиране** — вижте бележката за сигурност по-долу |
| `playwrightHeadless` | boolean | Изпълнение в headless режим (по подразбиране: true) |
| `playwrightStealth` | boolean | Opt-in настройка за Steps режим, която намалява често срещаните сигнали за автоматизация на Playwright (по подразбиране: false). Етикет в Properties Panel: Reduce automation flags |
| `playwrightTimeout` | number | Timeout в ms (по подразбиране: 30000) |
| `playwrightCaptureNetwork` | boolean | Заснемане на JSON отговори, headers, cookies и browser storage |
| `playwrightAuthEnabled` | boolean | Възстановяване на browser auth от cookies/storageState преди изпълнение на стъпките |
| `playwrightAuthStateExpression` | string | Израз или JSON, който се разрешава до Playwright `storageState` или сурови `cookies[]` |
| `playwrightAuthCheckSelector` | string | Selector, който трябва да бъде видим след auth bootstrap |
| `playwrightAuthCheckTimeout` | number | Timeout в ms за проверката на автентикирания selector (по подразбиране: 5000) |
| `playwrightAuthFallbackSteps` | array | Стъпки за fallback само за вход, които се изпълняват, когато възстановяването на cookies не автентикира страницата |

## Типове стъпки

- **navigate** – Навигиране до URL
- **refresh** – Презареждане на текущата страница (опционален `timeout` на стъпката в ms за навигацията при презареждане)
- **click** – Кликване върху елемент по selector
- **type** – Въвеждане на текст в поле (символ по символ)
- **fill** – Попълване на стойност в поле
- **wait** – Изчакване на timeout (ms)
- **screenshot** – Заснемане на screenshot (`outputKey` запазва base64 в results)
- **getText** – Текстово съдържание на елемент (`selector`, опционален `outputKey`)
- **getAttribute** – Стойност на атрибут (`selector`, `attribute`, опционален `outputKey`)
- **getHTML** – Outer HTML на елемент (`selector`, опционален `outputKey`)
- **getVisibleTextOnPage** – Пълен видим текст на страницата като `document.body.innerText` (без selector; използвайте `outputKey`; опционален `timeout` на стъпката в ms за изчакване преди заснемане)
- **hover** – Задържане на курсора върху елемент
- **selectOption** – Избор на опция в `<select>`
- **scrollDown** / **scrollUp** – Скролиране с колелото на мишката (опционален `amount` в пиксели)
- **aiStep** – LLM връща същите видове действия като ръчните стъпки (вижте по-долу); вложен `aiStep` не се поддържа

## Изключване на стъпка

Всяка стъпка има превключвател за захранване в заглавната си част. Изключената стъпка се показва със зачертано и затъмнено заглавие, остава в списъка с всичките си полета и се пропуска при изпълнение на node — полезно за изолиране на проблемен selector без изтриване на работа. Запазената стъпка носи `disabled: true`; стъпките без този флаг се изпълняват нормално.

Изключените стъпки са невидими за останалата част от node: те не удовлетворяват правилото "първата стъпка трябва да бъде `navigate`" при auth bootstrap, изключен `aiStep` не прави LLM заявка, а изключените записи в `playwrightAuthFallbackSteps` също се пропускат. Изключването на всички стъпки води до неуспешно изпълнение със съобщение, което Ви моли да активирате поне една.

## AI Step

Действието **aiStep** използва LLM за анализ на HTML на страницата (и опционално screenshot) и генерира Playwright действия от инструкции на естествен език. API приема същите имена на действия като ръчните стъпки (включително `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, скролиране и др.). **Auto heal** заменя само неуспешни стъпки, базирани на selector, с алтернативи за click, type, fill, hover и selectOption.

| Опция | Описание |
|--------|-------------|
| `instructions` | Какво трябва да направи AI (напр. "Click the Login button") |
| `credentialId` | LLM удостоверение (OpenAI, Google или Custom) |
| `model` | Търсим списък с модели от избраното LLM удостоверение |
| `saveStepsForFuture` | Кешира генерираните стъпки за следващи изпълнения (избягва LLM заявка) |
| `sendScreenshot` | Изпраща screenshot към LLM за визуални елементи |
| `aiStepTimeout` | Timeout за LLM заявка в ms (по подразбиране 30000) |

### AI Auto Heal

**AI Auto Heal** прави workflows устойчиви на промени в DOM. Когато даден selector се провали два пъти (напр. след редизайн на сайт), Heym извиква LLM, за да намери алтернативен локатор — обикновено `role=button[name='Submit']` или `text=Exact text` вместо CSS selectors.

Активирайте **Auto heal mode** в свойствата на AI стъпката. Ако запазената стъпка се провали:

1. Heym заснема текущия HTML и screenshot
2. Изпраща неуспешната стъпка + контекст на страницата към LLM
3. LLM връща надеждна алтернатива (role-based локатор, text локатор или fallback CSS)
4. Повтаря опита с новия selector

Това намалява нестабилността, когато сайтовете обновяват своя markup или имена на класове.
## Намаляване на автоматизационните флагове

Активирайте **Reduce automation flags** (`playwrightStealth: true`), когато даден сайт третира вградения Chromium на Playwright като бот поради стандартни автоматизационни сигнали (`HeadlessChrome` в user agent, `navigator.webdriver`, липсващ `window.chrome`).

Тази опция се прилага само в режим **Steps**. Тя:

- Премахва флага `--enable-automation` на Chromium и задава `--disable-blink-features=AutomationControlled`
- Изпраща стандартен Chrome user agent (без `HeadlessChrome`)
- Възстановява често срещани повърхности на браузъра, които Playwright оставя празни (`window.chrome`, plugins)
- Оставя GPU renderer-а на хоста непроменен, когато има наличен GPU (локално macOS/Windows). Linux/Docker няма GPU; софтуерният renderer низ на Chromium се докладва като типичен Mali (ARM) или Mesa (x86) GPU вместо SwiftShader.

Тя не скрива факта, че сесията се управлява чрез Chrome DevTools Protocol и не е начин за заобикаляне на сигурността на сайта, CAPTCHA или контроли за достъп. Използвайте я за workflows, за които сте упълномощени — вътрешни инструменти, собствени сайтове и разрешена браузърна автоматизация.

Режимът Run Code остава непроменен — персонализираните скриптове стартират Chromium сами.

## Прихващане на мрежови данни

Активирайте `playwrightCaptureNetwork`, за да събирате допълнителни данни за отстраняване на проблеми по време на изпълнението:

- `networkRequests` – Прихванати JSON/API отговори
- `cookies` – Бисквитки на браузъра в края на изпълнението
- `localStorage` – Двойки ключ-стойност в `localStorage` на браузъра
- `sessionStorage` – Двойки ключ-стойност в `sessionStorage` на браузъра

Това е полезно, когато трябва да инспектирате скрити API извиквания, състояние на удостоверяване или данни от страна на браузъра след автоматизиран поток.

## Bootstrap на бисквитки и резервен вариант за вход

Активирайте `playwrightAuthEnabled`, когато искате Playwright да отвори страница, в която вече сте влезли.

### Източник на състояние на удостоверяване

Задайте `playwrightAuthStateExpression` на израз като `$global.authState`. Стойността може да бъде:

- Обект `storageState` на Playwright: `{"cookies": [...], "origins": [...]}`
- Суров масив `cookies[]`
- JSON низ, съдържащ една от двете форми

Препоръчителен модел:

1. Стартирайте Playwright node с активирано прихващане на мрежови данни или bootstrap на удостоверяване
2. Съхранете `$playwrightNode.cookies` или пълен обект за състояние на удостоверяване в [Global Variable](../reference/global-variables.md)
3. Използвайте повторно тази променлива в следващи Playwright nodes чрез `$global.authState`

### Проверка на удостоверяването

Първата основна стъпка на Playwright трябва да бъде `navigate`. След като тази стъпка се зареди, Heym проверява `playwrightAuthCheckSelector`.

- Ако селекторът е видим, останалите основни стъпки продължават нормално
- Ако селекторът липсва, Heym изпълнява `playwrightAuthFallbackSteps`
- След завършване на резервните стъпки Heym проверява същия селектор отново
- Ако селекторът все още липсва, node-ът се проваля с грешка при bootstrap на удостоверяване

Резервните стъпки поемат навигацията след неуспешно удостоверяване. Те трябва да оставят браузъра на удостоверената страница, очаквана от останалата част от основния поток.

## Изходни полета

- `$playwrightNode.status` – `"ok"` при успех
- `$playwrightNode.results` – Изходи от стъпките (getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot ключове и др.)
- `$playwrightNode.screenshot` – Base64 screenshot, когато дадена стъпка запази такъв
- `$playwrightNode.cookies` – Крайни бисквитки на браузъра, когато е активиран bootstrap на удостоверяване или прихващане на мрежови данни
- `$playwrightNode.networkRequests` – Прихванати мрежови отговори (когато е активирано)
- `$playwrightNode.localStorage` – Локално хранилище на браузъра (когато е активирано)
- `$playwrightNode.sessionStorage` – Сесийно хранилище на браузъра (когато е активирано)

## Пример

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

В Properties Panel задайте **Mode** на **Run Code**, за да редактирате `playwrightCode` вместо визуални стъпки. Bootstrap-ът на удостоверяване се прилага само в режим Steps.

Пример (sandbox / Docker — Chromium се нуждае от `--no-sandbox`):

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

Wrapper-ът предоставя `inputs`, `headless`, `timeout_ms` и `capture_network`. Може да вградите изрази `$nodeLabel.field` в кода; отпечатайте JSON с `status` и `results`.
## Сигурност на персонализиран код

Полето `playwrightCode` изпълнява произволен Python код. Тъй като това е еквивалентно на изпълнение на код, то е **деактивирано по подразбиране** и, когато бъде активирано, работи в sandbox:

- **Деактивирано по подразбиране.** Изпълнението на node с настроено `playwrightCode` завършва с ясна грешка, освен ако оператор не зададе `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Проверката се извършва по време на изпълнение, така че обхваща и предварително запазени workflows, както и изпълнения по график / под-workflow.
- **Изолирано, когато е активирано.** Персонализираният код не се изпълнява в процеса на backend-а. Той се изпълнява в закален, временен sibling контейнер без Docker socket, без backend bind mounts, без backend тайни в средата му, с отнети capabilities, `no-new-privileges` и ограничения за CPU / памет / PID. Ако Docker не е наличен, изпълнението се проваля затворено. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` връща обратно към пътя в рамките на процеса само за доверена употреба или локална разработка (не е граница за сигурност). Нативният `./run.sh` използва `subprocess` по подразбиране, когато не е зададен `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) и единичният образ от GHCR намират sibling runner-а чрез `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (с fallback към `HEYM_CODEX_DOCKER_IMAGE`) и използват съответстващия venv път (`/app/.venv` срещу `/app/backend/.venv`).
- **Бележка за Chromium.** Sandbox контейнерът се изпълнява като root по подразбиране, а Chromium отказва да работи като root без `--no-sandbox`. Персонализиран код, който стартира Chromium, трябва да го подаде, например `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Стартиранията на базата на стъпки (и stealth) също подават `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, за да не могат fingerprint скриптовете да отварят STUN UDP към `stun.l.google.com:19302`. Персонализираните извиквания на `chromium.launch` също трябва да включват този флаг.

Playwright nodes на базата на стъпки (`playwrightSteps`) са напълно генерирани от Heym (без произволен код), не се влияят от всичко изброено по-горе и винаги са налични — предпочитайте тях.

## Свързани

- [Node Types](../reference/node-types.md) – Преглед на всички типове nodes
- [Crawler Node](./crawler-node.md) – По-опростено уеб scraping с FlareSolverr
- [Credentials Sharing](../reference/credentials-sharing.md) – LLM удостоверения за AI стъпки
