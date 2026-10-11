# Variabelen-tab

De **Variabelen**-tab beheert de **Global Variable Store** – persistente key-value-gegevens die worden gedeeld across alle workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Bekijk de Variabelen-demo</a></p>

## Overzicht

- Globale variabelen aanmaken, bewerken en verwijderen
- Variabelen zijn user-scoped en blijven behouden across workflow-uitvoeringen
- Refereren in expressies via `$global.variableName`

## Een variabele aanmaken

1. Klik op **Nieuwe variabele**
2. Voer een **naam** in (gebruikt in expressies)
3. Stel de **waarde** in (string, number, boolean, array of object)
4. Kies het **waardetype** (Auto, String, Number, Boolean, Array, Object)

## Bewerken en verwijderen

- **Bewerken** – Klik op het bewerkingspictogram in de rij van een variabele
- **Verwijderen** – Klik op het prullenbakpictogram; workflows die deze variabele gebruiken, hebben een vervanging nodig
- **Bulkverwijdering** – Selecteer meerdere variabelen en gebruik **Geselecteerde verwijderen**

## Gebruik in workflows

Refereer aan variabelen in elke expressie:

```
$global.environment
$global.settings.baseUrl
```

U kunt ook globale variabelen instellen vanuit een [Variabele-knooppunt](../nodes/variable-node.md) door **Store in Global Variable Store** in te schakelen.

## Gerelateerd

- [Globale variabelen](../reference/global-variables.md) – Referentiegids
- [Variabele-knooppunt](../nodes/variable-node.md) – Variabelen instellen met `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – `$global`-syntaxis
- [Chat-tab](./chat-tab.md) – Chat heeft toegang tot globale variabelen
- [Contextual Showcase](../reference/contextual-showcase.md) – Compacte paginagids voor dashboard-oppervlakken
