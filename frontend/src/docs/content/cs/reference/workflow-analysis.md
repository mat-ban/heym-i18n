# Analýza workflow

**Analýza workflow** je panel na levé straně, který obsahuje jeden sdílený, upravitelný Markdown dokument pro každý workflow. Použijte jej k vysvětlení toho, co workflow dělá, a k zachycení nápadů na vylepšení — a nechte AI vygenerovat první návrh za Vás.

Dokument je sdílený: každý, kdo má přístup k workflow, jej může číst a upravovat. Je uložen společně s workflow a automaticky smazán při smazání workflow.

## Otevření panelu

1. Otevřete workflow v editoru.
2. Klikněte na **Analyze** (ikona Sparkles) na panelu nástrojů editoru.
3. Panel se otevře na levé straně. Paleta uzlů (levý panel) se při jeho otevření sbalí; opětovné otevření palety uzlů zavře panel analýzy.

Panel je dostupný pouze pro uložená workflow. U zcela nového neuloženého workflow jej nejprve uložte.

## Dokument

Panel zobrazuje jediný Markdown dokument se dvěma zobrazeními, mezi nimiž přepínáte pomocí tlačítek **Edit** (tužka) a **Preview** (oko):

| Zobrazení | Účel |
|------|---------|
| **Edit** | Prostý Markdown editor (textarea). |
| **Preview** | Vykreslený Markdown. |

Záhlaví zobrazuje, **kdo naposledy upravil** dokument a kdy.

### Ukládání

Kliknutím na **Save** uložíte své změny. Save je aktivní pouze tehdy, existují-li neuložené úpravy.

Protože je dokument sdílený, ukládání využívá optimistickou konkurenci:

- Pokud někdo jiný od otevření panelu uložil novější verzi, Vaše uložení je odmítnuto a zobrazí se upozornění se jménem druhého editora.
- Poté můžete zvolit **Reload (discard mine)** pro převzetí verze ze serveru, nebo **Overwrite** pro vynucené uložení Vaší verze přes jejich.

## AI analýza

V horní části panelu vyberte **Credential** a **Model** LLM (seznam modelů se načítá z vybraného credentialu — viz [Credentials](../tabs/credentials-tab.md)). Poté spusťte analýzu:

- **Analyze my workflow** — zobrazí se, když je dokument prázdný. Streamuje AI-generovaný Markdown report přímo do editoru jako neuložený koncept. Zkontrolujte jej a upravte, poté klikněte na **Save**.
- **Reanalyze** — zobrazí se, když dokument již obsahuje obsah. Streamuje nový report do samostatného **preview**, přičemž Váš aktuální dokument zůstane nedotčen. Zvolte **Accept** pro nahrazení obsahu editoru novou analýzou, nebo **Discard** pro zachování stávajícího obsahu.

Obě akce nejprve **spustí workflow** (pokud je platné a spustitelné) a zahrnou výsledky spuštění do promptu analýzy, takže report odráží skutečné chování workflow. Pokud workflow nelze spustit, analýza pokračuje z jeho statické struktury.

Vygenerovaný report pokrývá tři sekce v tomto pořadí: **Improvement areas** (konkrétní návrhy včetně hlediska **security**, kdykoli workflow pracuje s přihlašovacími údaji, vstupem od uživatele, externími požadavky nebo vystavením dat), **Purpose** workflow a **What it does** (krok za krokem průchod uzly).

Sekce **Improvement areas** vždy provádí čtyři explicitní kontroly:

1. **Error coverage** — pokud canvas neobsahuje uzel [Error Handler](../nodes/error-handler-node.md) a není nakonfigurováno žádné error workflow, report na to upozorní a doporučí přidat ošetření chyb.
2. **Time saved** — pokud není nastaven odhad ušetřeného času na jedno spuštění, report doporučí jeho konfiguraci, aby se mohla naplnit metrika **Time Saved** v [Analytics](../tabs/analytics-tab.md).
3. **Network nodes** — u uzlů, které provádějí síťová volání (například [HTTP](../nodes/http-node.md) a integrační uzly), report doporučí specifické ošetření chyb (retry a/nebo continue-on-error) na těchto uzlech.
4. **Alerts** — pokud pro workflow nejsou nakonfigurovány žádné [alerts](../tabs/alerts-tab.md), report doporučí nastavit výstrahy před nasazením do produkce.

### Spuštění analyzátoru z Properties

Pokud workflow obsahuje uzly na canvasu, ale dosud nemá dokument analýzy, zobrazí se ve workflow-level panelu [Properties](./canvas-features.md) tlačítko **Run Analyzer** (zobrazí se, když není vybrán žádný uzel). Otevře tento panel Analýzy workflow, abyste mohli vybrat credential a model a vygenerovat report.

Každé spuštění analýzy je zaznamenáno v [Traces](../tabs/traces-tab.md) pod zdrojem **Workflow Analysis**.

Pokud není nakonfigurován žádný LLM credential, je tlačítko Analyze zakázáno — přidejte jej v [Credentials Tab](../tabs/credentials-tab.md).

## Související

- [AI Assistant](./ai-assistant.md) — generování nebo úprava uzlů workflow z přirozeného jazyka.
- [Sticky Note](../nodes/sticky-note-node.md) — pro krátké poznámky připnuté přímo na canvasu.
