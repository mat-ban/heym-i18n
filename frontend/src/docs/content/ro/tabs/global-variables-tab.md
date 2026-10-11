# Filă Variables

Fila **Variables** gestionează **Global Variable Store** – date persistente de tip cheie-valoare partajate între toate workflow-urile dumneavoastră.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Urmăriți demonstrația Variables</a></p>

## Prezentare generală

- Creați, editați și ștergeți variabile globale
- Variabilele sunt la nivel de utilizator și persistă între execuțiile workflow-urilor
- Referiți-le în expresii prin `$global.variableName`

## Crearea unei variabile

1. Faceți clic pe **New Variable**
2. Introduceți un **nume** (utilizat în expresii)
3. Setați **valoarea** (string, number, boolean, array sau object)
4. Alegeți **tipul valorii** (Auto, String, Number, Boolean, Array, Object)

## Editare și ștergere

- **Editare** – Faceți clic pe pictograma de editare de pe rândul unei variabile
- **Ștergere** – Faceți clic pe pictograma coșului de gunoi; workflow-urile care o utilizează vor necesita o înlocuire
- **Ștergere în bloc** – Selectați mai multe variabile și utilizați **Delete selected**

## Utilizarea în workflow-uri

Referiți variabilele în orice expresie:

```
$global.environment
$global.settings.baseUrl
```

De asemenea, puteți seta variabile globale dintr-un [Variable node](../nodes/variable-node.md) activând **Store in Global Variable Store**.

## Resurse conexe

- [Global Variables](../reference/global-variables.md) – Ghid de referință
- [Variable Node](../nodes/variable-node.md) – Setați variabile cu `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Sintaxa `$global`
- [Chat Tab](./chat-tab.md) – Chat-ul poate accesa variabilele globale
- [Contextual Showcase](../reference/contextual-showcase.md) – Ghid compact de pagină pentru suprafețele dashboard-ului
