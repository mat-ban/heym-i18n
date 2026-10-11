# Drive

Karta Drive poskytuje centrální místo pro zobrazení, správu a sdílení všech souborů generovaných skilly.

## Přístup k Drive

Přejděte na kartu **Drive** v dashboardu. Všechny soubory generované Vašimi workflow skilly se zobrazí zde, seřazené podle data vytvoření.

## Seznam souborů

Seznam souborů zobrazuje:

- **Name** – Původní název souboru s ikonou specifickou pro daný typ
- **Type** – MIME typ souboru (např. pdf, csv, docx)
- **Size** – Velikost souboru v čitelné podobě
- **Source** – Popisek uzlu, který soubor vygeneroval
- **Date** – Kdy byl soubor vytvořen
- **Actions** – Tlačítka pro stažení, sdílení a smazání

## Hromadné akce

Každý soubor, který vlastníte, má na začátku svého řádku zaškrtávací políčko. Soubory sdílené s Vámi prostřednictvím týmu jsou pouze pro čtení a nelze je vybrat. Vyberte více souborů (Shift-click vybere souvislý rozsah; zaškrtávací políčko v záhlaví vybere celou stránku) pro zobrazení lišty hromadných akcí nad seznamem, poté klikněte na **Bulk actions** pro otevření dialogu, který aplikuje stejné nastavení na každý vybraný soubor:

- **Share all with my teams** / **Remove team sharing** – přepíná sdílení s týmy pro všechny vybrané soubory najednou
- **Create share link for each file** – vytvoří share link pro každý vybraný soubor se stejnými hodnotami expirace, hesla a maximálního počtu stažení

Dialog hlásí, na kolik souborů bylo nastavení aplikováno; soubory, které nevlastníte, jsou přeskočeny. Selektor počtu řádků na stránku (25 / 50 / 100 / **All**) ve spodní části seznamu Vám umožní načíst více souborů na jedné stránce, abyste mohli vybírat napříč celým Drive.

## Sdílení souborů

Klikněte na ikonu **Share** pro otevření dialogu sdílení. Můžete vytvořit více share linků pro jeden soubor s různými konfiguracemi a volitelně soubor sdílet s Vašimi aktuálními týmy.

### Veřejný odkaz (na bázi tokenu)

Vytvořte share link bez hesla. Kdokoli s odkazem může soubor stáhnout.

### Odkaz chráněný heslem (Basic Auth)

Při vytváření share linku nastavte heslo. URL pro stažení používá HTTP Basic Authentication – prohlížeče při otevření odkazu vyzvou k zadání uživatelského jména (`file`) a hesla.

### Možnosti odkazu

- **Expires (hours)** – Volitelně nastavte dobu expirace
- **Max downloads** – Volitelně omezte počet stažení
- Obě možnosti lze kombinovat pro maximální kontrolu

### Sdílet s mými týmy

Zapněte **Share with my teams** pro udělení přístupu pouze pro čtení všem týmům, jejichž jste aktuálně členem. Členové týmu mohou soubor vidět a stáhnout z Drive a používat operace uzlu Drive orientované na čtení, ale pouze vlastník souboru může soubor smazat, vytvořit nebo odvolat veřejné odkazy či změnit heslo/TTL/limity stažení.

Nastavení je specifické pro daný soubor. Pokud se později připojíte k dalšímu týmu nebo jej vytvoříte, přepněte sdílení znovu nebo spusťte operaci `shareWithMyTeams` uzlu Drive pro přidání tohoto týmu. Použijte `unshareWithMyTeams` pro odebrání týmových sdílení ze souboru ve workflow.

### Správa sdílení

Dialog sdílení zobrazuje všechny existující share linky s:
- Aktuálním počtem stažení
- Stavem expirace
- Informací, zda je zapnuta Basic Auth
- Tlačítky pro kopírování a odvolání

## Odkazy na soubory v Chat & Portal

Když skill vygeneruje soubory během spuštění workflow prostřednictvím Portal chat nebo Quick Drawer, odkazy ke stažení se automaticky zobrazí v odpovědi. Uživatelé mohou kliknout a stáhnout přímo.

## Úložiště

Vygenerované soubory jsou uloženy v souborovém systému serveru pod `data/files/`. V Docker nasazeních je toto připojeno jako volume pro trvalé uchování.

## Správa souborů z workflow

[Uzel Drive](../nodes/drive-node.md) Vám umožňuje spravovat soubory Drive programově zevnitř workflow. Použijte jej k:

- **List** – výpis Vašich souborů a vrácení metadat, jako je název souboru, MIME typ, velikost, zdroj a URL pro stažení
- **Delete** – smazání souboru poté, co byl doručen uživateli
- **Share or unshare with your teams** – sdílení nebo zrušení sdílení s Vašimi týmy, aby členové týmu mohli soubor číst a stahovat pouze po dobu existence týmového sdílení
- **Set a password** – nastavení hesla na odkazu pro stažení
- **Set a TTL** – nastavení expirace odkazu po N hodinách
- **Set a max downloads** – nastavení limitu maximálního počtu stažení

Konverze souboru do jiného formátu je úkolem [uzlu Converter](../nodes/converter-node.md) s `conversion: "fileConvert"`. Načte soubor z Drive a uloží převedený výsledek jako nový soubor.

Na soubor odkazujte pomocí jeho ID z výstupu skillu: `$agentLabel._generated_files[0].id`

Podrobnosti konfigurace naleznete v [dokumentaci uzlu Drive](../nodes/drive-node.md).

## Čtení souborů Drive ze skillů

Agent skilly se mohou přihlásit ke čtení z Drive pomocí nastavení **Enable Drive files** na kartě skillu. Pokud je zapnuto, runtime skillu zahrnuje vygenerovaného pomocníka `heym_drive.py`. Kód skillu může importovat pomocníky jako `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` a `list_drive_files`.

Čtení z Drive je omezeno na soubory přístupné aktérovi workflow: vlastněné soubory a soubory sdílené s aktérem prostřednictvím týmů. Pro přesné vyhledání použijte ID souboru, nebo přesný název souboru, když uživatel odkazuje na soubor podle názvu. Vyhledávání podle názvu vrací nejnovější přístupný soubor s tímto názvem; `list_drive_files(filename="...")` vrací všechny shody.

## Související

- [Uzel Drive](../nodes/drive-node.md) – Operace workflow (list, get, delete, password, TTL, max downloads, team sharing)
- [Karta Drive](../tabs/drive-tab.md) – Procházení souborů v dashboardu
- [Generování souborů](./file-generation.md) – Jak vznikají `_generated_files` a URL pro stažení

## Úklid
Expirované share tokeny jsou automaticky uklizeny denně. Soubory samotné přetrvávají, dokud nejsou ručně smazány prostřednictvím karty Drive. Použijte **Clear All** pro smazání všech souborů a jejich share linků jednou akcí.
