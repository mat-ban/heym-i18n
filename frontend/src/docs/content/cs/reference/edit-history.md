# Historie úprav

Historie úprav sleduje uložené verze workflow. Slouží k zobrazení změn v čase, porovnání verzí nebo obnovení předchozího stavu.

**Poznámka:** Historie úprav se liší od [Historie spuštění](./execution-history.md). Historie úprav sleduje **uložení** (změny struktury workflow); Historie spuštění sleduje **spuštění** (proběhlá spuštění).

## Kde ji najdete

**Panel nástrojů editoru** → **Historie úprav** (ikona GitBranch)

## Verze

Nová verze se vytvoří při každém **uložení** workflow. Seznam zobrazuje:

- **Aktuální** – Nejnovější uložený stav (to, co vidíte na canvasu)
- **Verze N** – Předchozí uložení s časovými razítky

Verze bez změn oproti předchozí verzi jsou skryté.

## Zobrazení rozdílů

Vyberte verzi a zobrazte, co se změnilo oproti aktuálnímu workflow:

| Typ změny | Popis |
|-------------|--------------|
| **Uzly** | Přidané, odebrané nebo upravené uzly |
| **Hrany** | Přidaná, odebraná nebo upravená propojení |
| **Konfigurace** | Nastavení na úrovni workflow (autentizace, limity požadavků atd.) |

Rozbalte jednotlivé změny a zobrazte rozdíly na úrovni polí (např. které vlastnosti uzlu se změnily).

## Náhled

Chcete-li zobrazit, jak workflow vypadalo v předchozí verzi, klikněte na **Náhled** vedle tlačítka Obnovit.

Otevře se canvas pouze pro čtení zobrazující uzly a hrany dané verze. Můžete posouvat a přibližovat pro prozkoumání rozvržení; z tohoto zobrazení nelze provádět žádné změny.

## Obnovení

Obnovení předchozí verze:

1. Vyberte požadovanou verzi
2. Klikněte na **Obnovit**
3. Potvrďte akci
4. Aktuální workflow se nahradí vybranou verzí; stránka se znovu načte

Obnovením se vytvoří nový „aktuální" stav – v případě potřeby můžete obnovit znovu.

## Vymazání historie

Kliknutím na ikonu koše v záhlaví dialogu odstraníte celou historii verzí. Tuto akci nelze vrátit zpět. Aktuální workflow zůstane zachováno; smažou se pouze předchozí verze.

## Kdy se verze vytvářejí

Verze se vytvářejí pouze při **uložení** (Ctrl/Cmd+S nebo tlačítko Uložit). Neuložené změny se v Historii úprav neukládají, dokud je neuložíte.

Úpravy dovedností agenta jsou součástí těchto snímků. Chcete-li procházet nebo obnovit jednotlivou dovednost bez obnovení celého workflow, použijte tlačítko **Historie** na kartě dané dovednosti v panelu vlastností uzlu Agent. Viz [Uzel Agent](../nodes/agent-node.md#skill-history).

## Související

- [Historie spuštění](./execution-history.md) – Proběhlá spuštění a Bring to Canvas
- [Struktura workflow](./workflow-structure.md) – Formát uzlů a hran
- [Karta Workflows](../tabs/workflows-tab.md) – Vytváření a správa workflow
