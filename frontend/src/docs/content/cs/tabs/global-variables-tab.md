# Karta Proměnné

Karta **Proměnné** spravuje **Global Variable Store** – trvalé úložiště dat ve formátu klíč-hodnota sdílené napříč všemi vašimi workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Zhlédnout demo Proměnných</a></p>

## Přehled

- Vytvářejte, upravujte a odstraňujte globální proměnné
- Proměnné jsou vázané na uživatele a přetrvávají napříč spuštěními workflow
- Odkazujte na ně v výrazech pomocí `$global.variableName`

## Vytvoření proměnné

1. Klikněte na **New Variable**
2. Zadejte **název** (používá se ve výrazech)
3. Nastavte **hodnotu** (string, number, boolean, array nebo object)
4. Zvolte **typ hodnoty** (Auto, String, Number, Boolean, Array, Object)

## Úpravy a mazání

- **Úprava** – Klikněte na ikonu úprav u řádku proměnné
- **Smazání** – Klikněte na ikonu koše; workflows, které ji používají, budou vyžadovat náhradu
- **Hromadné smazání** – Vyberte více proměnných a použijte **Delete selected**

## Použití ve workflows

Odkazujte na proměnné v libovolném výrazu:

```
$global.environment
$global.settings.baseUrl
```

Globální proměnné můžete také nastavit z [uzlu Variable](../nodes/variable-node.md) povolením možnosti **Store in Global Variable Store**.

## Související

- [Global Variables](../reference/global-variables.md) – Referenční příručka
- [Variable Node](../nodes/variable-node.md) – Nastavení proměnných pomocí `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Syntaxe `$global`
- [Chat Tab](./chat-tab.md) – Chat má přístup ke globálním proměnným
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktní průvodce stránkou pro dashboard surfaces
