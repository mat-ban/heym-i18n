# Analýza workflow

**Analýza workflow** je panel na ľavej strane, ktorý obsahuje jeden zdieľaný, upraviteľný Markdown dokument pre každý workflow. Použite ho na vysvetlenie toho, čo workflow robí, a na zachytenie nápadov na vylepšenie — a nechajte AI vygenerovať prvý návrh za Vás.

Dokument je zdieľaný: každý, kto má prístup k workflow, ho môže čítať a upravovať. Je uložený spolu s workflow a automaticky sa vymaže pri vymazaní workflow.

## Otvorenie panela

1. Otvorte workflow v editore.
2. Kliknite na **Analyze** (ikona Sparkles) na paneli nástrojov editora.
3. Panel sa otvorí na ľavej strane. Paleta uzlov (ľavý panel) sa počas jeho otvorenia zbalí; opätovné otvorenie palety uzlov zatvorí panel analýzy.

Panel je dostupný len pre uložené workflow. Pri úplne novom neuloženom workflow ho najprv uložte.

## Dokument

Panel zobrazuje jeden Markdown dokument s dvoma zobrazeniami, medzi ktorými prepínate pomocou tlačidiel **Edit** (ceruzka) a **Preview** (oko):

| Zobrazenie | Účel |
|------|---------|
| **Edit** | Jednoduchý Markdown editor (textarea). |
| **Preview** | Vykreslený Markdown. |

Hlavička zobrazuje, **kto naposledy upravil** dokument a kedy.

### Ukladanie

Kliknutím na **Save** uložíte svoje zmeny. Save je povolené len vtedy, keď existujú neuložené úpravy.

Keďže dokument je zdieľaný, ukladanie používa optimistickú konkurenciu:

- Ak niekto iný od uloženia novšej verzie od Vášho otvorenia panela uložil novšiu verziu, Vaše uloženie bude zamietnuté a zobrazí sa upozornenie s menom druhého editora.
- Následne môžete zvoliť **Reload (discard mine)** na prevzatie verzie zo servera, alebo **Overwrite** na vynútené uloženie Vašej verzie namiesto jeho.

## AI analýza

V hornej časti panela vyberte **Prihlasovacie údaje** LLM a **Model** (zoznam modelov sa načíta z vybraných prihlasovacích údajov — pozri [Prihlasovacie údaje](../tabs/credentials-tab.md)). Potom spustite analýzu:

- **Analyze my workflow** — zobrazí sa, keď je dokument prázdny. Streamuje AI-generovanú Markdown správu priamo do editora ako neuložený návrh. Skontrolujte ju a upravte, potom kliknite na **Save**.
- **Reanalyze** — zobrazí sa, keď dokument už obsahuje obsah. Streamuje novú správu do samostatného **preview**, pričom Váš aktuálny dokument zostane nedotknutý. Zvoľte **Accept** na nahradenie obsahu editora novou analýzou, alebo **Discard** na zachovanie pôvodného obsahu.

Obe akcie najprv **spustia workflow** (ak je platné a spustiteľné) a zahrnú výsledky spustenia do promptu analýzy, takže správa odráža skutočné správanie workflow. Ak workflow nemožno spustiť, analýza pokračuje z jeho statickej štruktúry.

Vygenerovaná správa pokrýva tri sekcie v tomto poradí: **Oblasti na zlepšenie** (konkrétne návrhy vrátane uhla **bezpečnosti** vždy, keď workflow pracuje s prihlasovacími údajmi, vstupom používateľa, externými požiadavkami alebo vystavením údajov), **Účel** workflow a **Čo robí** (krok za krokom cez uzly).

Sekcia **Oblasti na zlepšenie** vždy vykonáva štyri explicitné kontroly:

1. **Pokrytie chýb** — ak plátno neobsahuje uzol [Error Handler](../nodes/error-handler-node.md) a nie je nakonfigurovaný žiadny error workflow, správa na to upozorní a odporučí pridať ošetrenie chýb.
2. **Ušetrený čas** — ak nie je nastavený odhadovaný ušetrený čas na jedno spustenie, správa odporučí nakonfigurovať ho, aby sa metrika **Time Saved** v [Analytike](../tabs/analytics-tab.md) mohla naplniť.
3. **Sieťové uzly** — pre uzly, ktoré vykonávajú sieťové volania (ako [HTTP](../nodes/http-node.md) a integračné uzly), správa odporučí špecifické ošetrenie chýb pre dané uzly (retry a/alebo continue-on-error).
4. **Upozornenia** — ak pre workflow nie sú nakonfigurované žiadne [upozornenia](../tabs/alerts-tab.md), správa odporučí nastaviť upozornenia pred nasadením do produkcie.

### Spustenie analyzátora z Vlastností

Keď workflow obsahuje uzly na plátne, ale zatiaľ nemá dokument analýzy, v paneli [Vlastnosti](./canvas-features.md) na úrovni workflow (zobrazí sa, keď nie je vybraný žiadny uzol) sa zobrazí tlačidlo **Run Analyzer**. Otvorí tento panel Analýzy workflow, aby ste mohli vybrať prihlasovacie údaje a model a vygenerovať správu.

Každé spustenie analýzy sa zaznamená v [Spusteniach](../tabs/traces-tab.md) pod zdrojom **Workflow Analysis**.

Ak nie sú nakonfigurované žiadne prihlasovacie údaje LLM, tlačidlo Analyze je zakázané — pridajte ich v [Karte prihlasovacích údajov](../tabs/credentials-tab.md).

## Súvisiace

- [AI asistent](./ai-assistant.md) — generujte alebo upravujte uzly workflow z prirodzeného jazyka.
- [Sticky Note](../nodes/sticky-note-node.md) — pre krátke poznámky pripnuté priamo na plátne.
