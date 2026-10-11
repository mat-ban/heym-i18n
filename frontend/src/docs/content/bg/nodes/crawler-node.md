# Crawler

**Crawler** node извлича съдържание от уеб страници чрез FlareSolverr с опционално извличане на HTML посредством CSS селектори. Използвайте го за уеб scraping и извличане на съдържание.

## Общ преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.body` (HTML или извлечено съдържание) |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | FlareSolverr удостоверение от [Удостоверения](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL за scraping (поддържа изрази) |
| `crawlerWaitSeconds` | number | Секунди за изчакване преди scraping (по подразбиране: 0) |
| `crawlerMaxTimeout` | number | Максимален timeout в ms (по подразбиране: 60000) |
| `crawlerMode` | string | `"basic"` или други режими |
| `crawlerSelectors` | array | CSS селектори за извличане. Всеки: `{ selector, attribute? }` |

## Пример

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## Egress Safety

- URL адресът на FlareSolverr, съхранен в удостоверението, трябва да използва `http://` или `https://` и не може да се разрешава до link-local или cloud-metadata адрес. Отхвърляното множество е `169.254.0.0/16`, `fe80::/10`, Alibaba Cloud и AWS IPv6 metadata адресите, както и IPv6 transition формите, които могат да пренесат един от тях. Това е списък с известни endpoint-и, а не гаранция за всеки доставчик.
- Loopback и частните адреси са разрешени умишлено, така че документираната настройка `http://localhost:8191` и compose имената на услуги като `http://flaresolverr:8191` продължават да работят. Следствието е, че това поле може да бъде насочено и към всяка друга услуга, до която backend-ът може да достигне на тези адреси, а отговорът се връща в изхода на node-а. Споделянето на удостоверения не ограничава това: всеки вписан потребител може да създаде свое собствено FlareSolverr удостоверение, така че задържането на съществуващо не променя нищо. Приложимите контроли са доверието към хората, които могат да създават workflows, и мрежовите правила, които ограничават до какво може да достигне backend-ът.
- Heym фиксира разрешения адрес преди свързване, така че DNS отговор не може да премести заявката към metadata адрес след проверката. Environment proxy-тата са деактивирани, докато защитата е активна, и redirect-и не се следват.
- Страницата, която FlareSolverr след това извлича вместо Вас, е отделен hop, който FlareSolverr разрешава сам. Heym не го инспектира, така че ограничаването на това къде може да се свързва FlareSolverr контейнерът принадлежи към Вашата мрежова политика.
- Доверените self-hosted deployment-и могат да премахнат metadata правилото с `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Запазете стойността по подразбиране при hosted или multi-tenant deployment-и.

## Свързани

- [Типове node-ове](../reference/node-types.md) – Общ преглед на всички типове node-ове
- [Playwright Node](./playwright-node.md) – Алтернатива за browser automation
- [Раздел Удостоверения](../tabs/credentials-tab.md) – Добавяне на FlareSolverr удостоверение
