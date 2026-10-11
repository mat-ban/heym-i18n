# Variabler-fanen

**Variabler**-fanen administrerer det **globale variabellager** – vedvarende nøgle-værdi-data, der deles på tværs af alle workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Se demo af Variabler</a></p>

## Oversigt

- Opret, rediger og slet globale variabler
- Variabler er brugerdefinerede og bevares på tværs af workflow-kørsler
- Referer til dem i udtryk via `$global.variableName`

## Oprettelse af en variabel

1. Klik på **Ny variabel**
2. Indtast et **navn** (bruges i udtryk)
3. Angiv **værdi** (streng, tal, boolean, array eller objekt)
4. Vælg **værditype** (Auto, String, Number, Boolean, Array, Object)

## Redigering og sletning

- **Rediger** – Klik på redigeringsikonet på en variabelrække
- **Slet** – Klik på skraldespandsikonet; workflows, der bruger variablen, skal have en erstatning
- **Masseslet** – Vælg flere variabler og brug **Slet valgte**

## Brug i workflows

Referer til variabler i ethvert udtryk:

```
$global.environment
$global.settings.baseUrl
```

Det er også muligt at angive globale variabler fra en [Variable-node](../nodes/variable-node.md) ved at aktivere **Gem i globalt variabellager**.

## Relateret

- [Globale variabler](../reference/global-variables.md) – Referencevejledning
- [Variable-node](../nodes/variable-node.md) – Angiv variabler med `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – `$global`-syntaks
- [Chat-fanen](./chat-tab.md) – Chat har adgang til globale variabler
- [Kontekstvisning](../reference/contextual-showcase.md) – Kompakt sidevejledning til dashboard-overflader
