# Analýza souborů

Analýza souborů umožňuje Chat, [uzlu Agent](../nodes/agent-node.md) a [uzlu Code](../nodes/code-node.md) otevírat a analyzovat velké soubory z [Drive](./drive.md) v izolovaném sandboxu Pythonu. Soubory PDF, tabulky, CSV, DOCX a JSON jsou nejprve zkontrolovány a poté čteny selektivně, takže 200stránková smlouva nebo sešit s milionem řádků se nikdy nemusí vejít do kontextu modelu.

## Jak to funguje

Každé volání běží v novém kontejneru bez přístupu k síti. Potřebné soubory jsou zkopírovány pouze pro čtení, kód se provede a kontejner je odstraněn. Mezi voláními stejné relace přetrvává malá pracovní složka, což umožňuje pozdějšímu kroku navázat na výsledky uložené dřívějším krokem.

| Cesta | Obsah |
|------|--------|
| `/input` | Soubory Drive této relace, pouze pro čtení |
| `/work` | Pracovní prostor, který přetrvává během relace, např. `/work/sales.pkl` |
| `/work/out` | Zde zapsané soubory jsou po volání uloženy do Drive a vráceny jako odkazy |

V sandboxu jsou předinstalovány balíčky pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx a langdetect, a také OCR Tesseract, které používá [uzel Převodník](../nodes/converter-node.md).

## Nástroje

Model pracuje se třemi nástroji a čtvrtým v prostředí Chat:

| Nástroj | Funkce |
|------|----------|
| `list_files` | Zobrazí soubory Drive, které můžete otevřít: název, typ, velikost, datum |
| `inspect_file` | Vrátí typ, metadata a strukturu souboru s krátkou ukázkou |
| `run_python` | Spustí Python na zadaných souborech a vrátí výstup z konzole |
| `clear_workspace` | Pouze Chat: smaže pracovní složku konverzace |

`inspect_file` čte pouze to, co je nezbytné pro souhrn:

| Typ | Souhrn |
|-----|-----------------|
| PDF | Počet stran, název a autor, možnost extrakce textu, jazyk, velikosti stránek, text a tabulky první strany. Naskenované PDF soubory jsou čteny pomocí OCR (až 5 stran) |
| XLSX / XLS | Listy s počtem řádků a sloupců, řádky záhlaví, datové typy, pandas `read_hint`, pojmenované rozsahy, první řádky |
| CSV / TSV | Kódování, oddělovač, počet řádků, sloupce s typy, první řádky |
| DOCX | Struktura nadpisů, tabulky, počty slov a znaků, autor a datum |
| JSON | Kořenový typ, klíče, délka pole, hloubka zanoření, ukázkové záznamy |

Uvnitř `run_python` otevřete soubor pomocí modulu `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## V prostředí Chat

Připojte soubory PDF, tabulky, DOCX, CSV nebo JSON, obrázky (PNG, JPG, GIF, WebP) nebo prosté textové soubory v [záložce Chat](../tabs/chat-tab.md), v Chatu v Heym Work nebo prostřednictvím nástroje MCP `heym_chat`. Jedna zpráva může obsahovat až 10 souborů. Každý soubor je uložen na vašem Drive; do zprávy vstupuje pouze jeho název a ID. Chat soubor prozkoumá, přečte část potřebnou pro vaši otázku a odpoví tabulkami nebo výňatky.

## Ve workflow

Běh otevírá pouze své vlastní soubory: soubory nahrané přes [uzel Trigger nahrání souboru](../nodes/file-upload-trigger-node.md), soubory zapsané uzly do Drive a soubory získané [uzlem Drive](../nodes/drive-node.md) krokem **Get** ve stejném běhu.

- **Uzel Agent**: pokud vstup nebo zpráva agenta obsahuje soubor z běhu, automaticky získá výše uvedené nástroje pro tyto soubory.
- **Uzel Code**: nastavte **Files** na výraz jako `$Upload.file.id`. Soubory jsou připojeny a uvedeny v `params.files`.

## Limity

| Limit | Hodnota |
|-----------|------|
| Paměť na volání | 2 GB |
| Čas na volání | 120 sekund |
| Pracovní složka na relaci | 2 GB |
| Výstupní soubory na volání | 20, až 100 MB každý |
| Textový výstup vrácený modelu | 20 000 znaků |
| Soubory na volání | 20 |

## Zabezpečení

- Sandbox nemá přístup k síti, nemá přístup k nastavení ani tajemstvím Heym a běží jako neprivilegovaný uživatel.
- Soubory jsou zpracovávány výhradně uvnitř sandboxu.
- V prostředí Chat přístup odpovídá Drive: otevíráte vlastní soubory a soubory sdílené s vašimi týmy.
- Otevření souboru v Chat se zaznamenává do protokolu auditu.
- Obsah souborů je považován čistě za data; instrukce uvnitř souborů se neprovádějí.

## Požadavky

Analýza souborů vyžaduje backend sandboxu na instanci Heym (Docker nebo [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Související

- [Drive](./drive.md)
- [Uzel Code](../nodes/code-node.md)
- [Uzel Agent](../nodes/agent-node.md)
- [Záložka Chat](../tabs/chat-tab.md)
