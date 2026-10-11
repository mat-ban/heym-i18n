# Karta Premenné

Karta **Premenné** spravuje **Global Variable Store** – perzistentné úložisko kľúč-hodnota zdieľané naprieč všetkými Vašimi workflowmi.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Pozrieť demo Premenné</a></p>

## Prehľad

- Vytvárajte, upravujte a odstraňujte globálne premenné
- Premenné sú viazané na používateľa a pretrvávajú naprieč spusteniami workflowov
- Odkazujte na ne vo výrazoch prostredníctvom `$global.variableName`

## Vytvorenie premennej

1. Kliknite na **Nová premenná**
2. Zadajte **názov** (používa sa vo výrazoch)
3. Nastavte **hodnotu** (string, number, boolean, array alebo object)
4. Zvoľte **typ hodnoty** (Auto, String, Number, Boolean, Array, Object)

## Úprava a odstránenie

- **Úprava** – Kliknite na ikonu úpravy v riadku premennej
- **Odstránenie** – Kliknite na ikonu koša; workflowy, ktoré ju používajú, budú vyžadovať náhradu
- **Hromadné odstránenie** – Vyberte viacero premenných a použite **Odstrániť vybrané**

## Použitie vo workflowoch

Odkazujte na premenné v ľubovoľnom výraze:

```
$global.environment
$global.settings.baseUrl
```

Globálne premenné môžete nastaviť aj z [uzla Variable](../nodes/variable-node.md) povolením možnosti **Store in Global Variable Store**.

## Súvisiace

- [Globálne premenné](../reference/global-variables.md) – Referenčná príručka
- [Uzol Variable](../nodes/variable-node.md) – Nastavenie premenných pomocou `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Syntax `$global`
- [Karta Chat](./chat-tab.md) – Chat má prístup ku globálnym premenným
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktný sprievodca stránkou pre povrchy dashboardu
