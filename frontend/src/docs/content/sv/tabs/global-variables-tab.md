# Fliken Variabler

Fliken **Variabler** hanterar det **Globala Variabellagret** – beständig nyckel-värde-data som delas mellan alla arbetsflöden.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Se demo av Variabler</a></p>

## Översikt

- Skapa, redigera och ta bort globala variabler
- Variabler är användarscopade och består mellan arbetsflödeskörningar
- Referera i uttryck via `$global.variableName`

## Skapa en Variabel

1. Klicka på **Ny Variabel**
2. Ange ett **namn** (används i uttryck)
3. Ange **värdet** (sträng, nummer, boolean, array eller objekt)
4. Välj **värdetyp** (Auto, String, Number, Boolean, Array, Object)

## Redigera och Ta bort

- **Redigera** – Klicka på redigeringsikonen på en variabelrad
- **Ta bort** – Klicka på papperskorgsikonen; arbetsflöden som använder den behöver en ersättning
- **Massborttagning** – Markera flera variabler och använd **Ta bort markerade**

## Använda i Arbetsflöden

Referera variabler i valfritt uttryck:

```
$global.environment
$global.settings.baseUrl
```

Det går även att ange globala variabler från en [Variabel-nod](../nodes/variable-node.md) genom att aktivera **Lagra i Globalt Variabellager**.

## Relaterat

- [Globala Variabler](../reference/global-variables.md) – Referensguide
- [Variabel-nod](../nodes/variable-node.md) – Ange variabler med `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – `$global`-syntax
- [Chat-fliken](./chat-tab.md) – Chatten kan komma åt globala variabler
- [Kontextuell Showcase](../reference/contextual-showcase.md) – Kompakt sidguide för dashboard-ytor
