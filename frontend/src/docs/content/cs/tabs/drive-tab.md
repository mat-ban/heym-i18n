# Karta Drive

Karta Drive zobrazuje všechny soubory vygenerované skilly napříč vašimi workflows.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Přehrát ukázku Drive</a></p>

## Přehled

Soubory generované skilly (PDF, DOCX, CSV, obrázky atd.) jsou automaticky ukládány a zobrazeny na kartě Drive. U každého souboru se zobrazuje jeho název, typ, velikost, zdrojový uzel, datum vytvoření a stav sdílení s týmem.

## Funkce

- **Vyhledávání** – Filtrování souborů podle názvu, typu nebo zdrojového uzlu
- **Kopírovat ID souboru** – Zkopíruje UUID souboru do schránky, připravené ke vložení do uzlu [Drive](../nodes/drive-node.md) nebo [Converter](../nodes/converter-node.md)
- **Stáhnout** – Autentizované stažení vašich souborů a souborů sdílených s vámi prostřednictvím týmů
- **Sdílet** – Vytváření odkazů pro sdílené stahování s volitelnou ochranou heslem a expirací, nebo sdílení souboru v režimu pouze pro čtení s vašimi aktuálními týmy
- **Smazat** – Odstranění souborů a jejich odkazů pro sdílení
- **Vymazat vše** – Smazání všech souborů a jejich odkazů pro sdílení po potvrzení
- **Hromadné akce** – Výběr více souborů pomocí zaškrtávacích políček (Shift+kliknutí pro výběr rozsahu) a použití stejné akce na všechny najednou
- **Stránkování** – Procházení rozsáhlých kolekcí souborů s voličem počtu řádků na stránku (25 / 50 / 100 / Vše)

## Hromadné akce

U souborů, které vlastníte, se na začátku řádku zobrazuje zaškrtávací políčko (soubory sdílené s vámi prostřednictvím týmu jsou pouze pro čtení a nelze je vybrat). Vyberte několik řádků – nebo použijte zaškrtávací políčko v záhlaví pro výběr celé stránky a **Shift+kliknutím** vyberte rozsah – a poté použijte panel hromadných akcí, který se zobrazí nad seznamem:

- **Stáhnout ZIP** zabalí všechny vybrané soubory do jednoho archivu ZIP a stáhne je
- **Hromadné akce** otevře jedno dialogové okno pro použití jednoho nastavení na všechny vybrané soubory:
  - **Sdílet vše s mými týmy** / **Odebrat sdílení s týmy** jedním kliknutím
  - **Vytvořit odkaz pro sdílení pro každý soubor** se stejnými nastaveními hesla, expirace a maximálního počtu stažení
- **Smazat** odstraní všechny vybrané soubory a jejich odkazy pro sdílení po potvrzení
- **Zrušit výběr** zruší výběr všeho

Dialogové okno hlásí, na kolik souborů bylo nastavení aplikováno (soubory, které nevlastníte, jsou přeskočeny). Pomocí volby **Vše** v voliči počtu řádků na stránku načtete všechny soubory na jednu stránku a vyberete napříč celým vaším Drive. Zadáním do vyhledávacího pole se volič počtu řádků na stránku automaticky přepne na **Vše**, aby vyhledávání zahrnovalo všechny soubory, nejen aktuální stránku; vymazáním vyhledávání se obnoví vaše předchozí nastavení.

## Sdílení

Vytvářejte odkazy pro sdílení s:
- **Bez autentizace** – Veřejná URL pro stažení založená na tokenu
- **Basic Auth** – Odkaz chráněný heslem (uživatelské jméno: `file`)
- **Expirace** – Volitelná časová expirace
- **Limity stažení** – Volitelný maximální počet stažení

Zapněte **Sdílet s mými týmy** u souboru, aby byl viditelný pro všechny týmy, jejichž jste aktuálně členem. Sdílení členové týmu získají přístup pouze pro čtení; akce správy zůstávají pouze pro vlastníka.

## Přístup ke skillům agenta

Skilly na uzlu Agent se mohou přihlásit k odběru čtení souborů Drive. Když je u skillu zapnuto **Povolit soubory Drive**, jeho Python kód může číst přístupné soubory Drive podle ID souboru nebo přesného názvu souboru prostřednictvím vygenerovaného pomocníka `heym_drive.py`. Toto nastavení je ve výchozím stavu vypnuto.

Úplné podrobnosti naleznete v [referenci Drive](../reference/drive.md).

## Související

- [Uzel Drive](../nodes/drive-node.md) – Výpis souborů, získání metadat, sdílení s týmy nebo změna omezení sdílení z workflow
- [Generování souborů](../reference/file-generation.md) – Jak skilly generují soubory
- [Reference Drive](../reference/drive.md) – Odkazy pro sdílení, tokeny a čištění
- [Portál](../reference/portal.md) – Odkazy na soubory v odpovědích chatu portálu
