# Kintamųjų skirtukas

**Kintamųjų** skirtukas valdo **Global Variable Store** – nuolatinę raktų-vertės duomenų saugyklą, bendrinamą visiems Jūsų workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Žiūrėti kintamųjų demonstraciją</a></p>

## Apžvalga

- Kurkite, redaguokite ir šalinkite globalius kintamuosius
- Kintamieji yra vartotojo apimties ir išlieka per workflow vykdymus
- Nuoroda išraiškose per `$global.variableName`

## Kintamojo kūrimas

1. Paspauskite **Naujas kintamasis**
2. Įveskite **pavadinimą** (naudojamą išraiškose)
3. Nustatykite **vertę** (string, number, boolean, array, arba object)
4. Pasirinkite **vertės tipą** (Auto, String, Number, Boolean, Array, Object)

## Redagavimas ir šalinimas

- **Redaguoti** – Paspauskite redagavimo ikoną kintamojo eilutėje
- **Šalinti** – Paspauskite šiukšlių ikoną; workflows, naudojantys jį, reikės pakeitimo
- **Masinis šalinimas** – Pasirinkite kelis kintamuosius ir naudokite **Ištrinti pasirinktus**

## Naudojimas workflows

Nuoroda į kintamuosius bet kurioje išraiškoje:

```
$global.environment
$global.settings.baseUrl
```

Taip pat galite nustatyti globalius kintamuosius iš [Variable node](../nodes/variable-node.md), įgalindami **Store in Global Variable Store**.

## Susiję

- [Global Variables](../reference/global-variables.md) – Nuorodų vadovas
- [Variable Node](../nodes/variable-node.md) – Nustatykite kintamuosius su `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – `$global` sintaksė
- [Chat Tab](./chat-tab.md) – Chat gali pasiekti globalius kintamuosius
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktiškas puslapio vadovas valdymo skydeliui
