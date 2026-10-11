# Zavihek Spremenljivke

Zavihek **Spremenljivke** upravlja **Globalno shrambo spremenljivk** – trajne podatke v obliki ključ-vrednost, ki so deljeni med vsemi vašimi workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Oglejte si predstavitev spremenljivk</a></p>

## Pregled

- Ustvarjanje, urejanje in brisanje globalnih spremenljivk
- Spremenljivke so uporabniško obsežne in trajajo skozi izvajanja workflow
- Sklicevanje v izrazih preko `$global.variableName`

## Ustvarjanje spremenljivke

1. Kliknite **Nova spremenljivka**
2. Vnesite **ime** (uporablja se v izrazih)
3. Nastavite **vrednost** (niz, število, logična vrednost, tabela ali objekt)
4. Izberite **tip vrednosti** (Samodejno, Niz, Število, Logična vrednost, Tabela, Objekt)

## Urejanje in brisanje

- **Uredi** – Kliknite ikono za urejanje na vrstici spremenljivke
- **Izbriši** – Kliknite ikono za koš za smeti; workflows, ki jo uporabljajo, bodo potrebovale zamenjavo
- **Masovno brisanje** – Izberite več spremenljivk in uporabite **Izbriši izbrane**

## Uporaba v Workflows

Sklicujte se na spremenljivke v katerem koli izrazu:

```
$global.environment
$global.settings.baseUrl
```

Globalne spremenljivke lahko nastavite tudi iz [Vozlišča spremenljivka](../nodes/variable-node.md) z omogočanjem **Shrani v Globalno shrambo spremenljivk**.

## Sorodno

- [Globalne spremenljivke](../reference/global-variables.md) – Referenčni vodnik
- [Vozlišče spremenljivka](../nodes/variable-node.md) – Nastavite spremenljivke z `isGlobal`
- [Izrazni DSL](../reference/expression-dsl.md) – Sintaksa `$global`
- [Zavihek Chat](./chat-tab.md) – Chat lahko dostopa do globalnih spremenljivk
- [Kontekstna predstavitev](../reference/contextual-showcase.md) – Kompaktni vodnik po površinah nadzorne plošče
