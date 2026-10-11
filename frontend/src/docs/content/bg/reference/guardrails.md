# Guardrails

Guardrails Ви позволяват да блокирате небезопасни или нежелани потребителски съобщения, преди те да достигнат до node [LLM](../nodes/llm-node.md) или [Agent](../nodes/agent-node.md). Когато дадено съобщение съвпадне с блокирана категория, node-ът хвърля грешка вместо да се изпълни, която можете да прихванете с node [Error Handler](../nodes/error-handler-node.md).

## Активиране на Guardrails

Отворете панела Properties за node **LLM** или **AI Agent** и превъртете до превключвателя **Enable Guardrails** (икона с щит). Отмятането на полето разкрива секцията за конфигурация.

## Guardrail Credential и Model

Когато guardrails са активирани, **трябва** да изберете **credential и model** за безопасност на съдържанието. Проверката на guardrails използва избраните credential и model от node-а — без fallback, без променливи на средата. Използвайте OpenAI или Google credential за надеждно филтриране на съдържание, особено когато основният Ви model използва доставчик по избор (напр. Zhipu, GLM), който може да не поддържа guardrails или да връща API грешки (напр. 404).

Workflow-ът не може да се изпълни, докато не бъдат избрани едновременно Guardrail Credential и Guardrail Model.

## Блокирани категории

Изберете една или повече категории за блокиране. Съобщение, което съвпадне с която и да е отметната категория, се отхвърля.

| Категория | Какво блокира |
|---|---|
| **Violence** | Насилствено, заплашително или физически вредно съдържание |
| **Hate Speech** | Дискриминация, расизъм или фанатизъм |
| **Sexual Content** | Явно сексуално съдържание или сценарии |
| **NSFW / Profanity** | Вулгарен език, псувни, явни обиди и жаргон за възрастни на всеки език |
| **Self-Harm** | Самоубийство, самонараняване или свързано съдържание |
| **Harassment** | Лични нападки, обиди, тормоз или сплашване |
| **Illegal Activity** | Инструкции за извършване на незаконни действия |
| **Political Extremism** | Екстремистко политическо съдържание или насилствена пропаганда |
| **Spam / Phishing** | Spam, phishing или социално инженерство |
| **Personal Data Request** | Изнудване на лична или лично идентифицираща информация |
| **Prompt Injection** | Опити за отменяне на системни инструкции, инжектиране на злонамерени prompt-ове или манипулиране на поведението на model-а |

## Sensitivity

Настройката **Sensitivity** контролира колко строго се откриват нарушенията:

| Ниво | Поведение |
|---|---|
| **Low** | Отбелязва дори гранични или двусмислени случаи |
| **Medium** *(по подразбиране)* | Отбелязва ясни нарушения; игнорира гранични случаи |
| **High** | Отбелязва само крайни, недвусмислени нарушения |

## Как работи откриването

Откриването използва **избраните guardrail credential и model**:

- **OpenAI credentials** — използва [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (безплатно, бързо, без изразходване на token-и) за петте категории, които покрива нативно (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Останалите категории се проверяват с LLM класификационно извикване, използвайки избрания guardrail model.
- **Google / custom credentials** — всички категории се проверяват с LLM класификационно извикване, използвайки избраните guardrail credential и model.

Когато основният Ви model използва доставчик по избор (напр. Zhipu, Cerebras), който може да върне 404 или други API грешки, изберете **OpenAI или Google credential** за guardrails.

## Формат на грешката

Когато се задейства guardrail, node-ът предизвиква грешка със съобщение:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Полето `output` на резултата от node-а също включва `guardrail_violated_categories` (масив от етикети на нарушените категории), така че Debug Panel и Execution History да могат ясно да покажат „Blocked by: X, Y“.

Използвайте опцията **Continue on error** на node-а (или [Error Handler](../nodes/error-handler-node.md)), за да насочите workflow-а към резервен клон, когато guardrails се задействат.

## Примерен workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Бележки

- **Без повторни опити**: Нарушенията на guardrails са умишлени блокирания и никога не се повтарят, дори ако node-ът има активирана опция „Retry on failure“.
- Не се изисква миграция на база данни — настройките на guardrails се съхраняват в JSON-а на node-а в workflow-а заедно с останалите данни на node-а.
- Guardrails проверяват разрешеното **потребителско съобщение** (след като шаблонните изрази бъдат изчислени), а не суровия шаблон.
- Задаването на **никакви категории** при активирани guardrails е еквивалентно на деактивирането им — не се извършва проверка.
- При **Low** severity LLM класификацията винаги се изпълнява (най-добро многоезично покритие). OpenAI credentials допълнително изпълняват Moderation API.
- При **Medium/High** severity OpenAI credentials използват Moderation API за нативно поддържаните категории и LLM класификация за останалите. Google/custom credentials винаги използват LLM класификация.
- LLM класификацията е **езиково независима** — открива нарушения на турски, арабски, руски, испански и други езици.
