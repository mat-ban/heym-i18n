# Analýza súborov

Analýza súborov umožňuje Chatu, [uzlu Agent](../nodes/agent-node.md) a [uzlu Code](../nodes/code-node.md) otvárať a analyzovať veľké súbory z [Drive](./drive.md) v izolovanom sandboxe Pythonu. Súbory PDF, tabuľky, CSV, DOCX a JSON sa najskôr skontrolujú a potom selektívne čítajú, takže 200-stranová zmluva alebo zošit s miliónom riadkov sa nikdy nemusí vojsť do kontextu modelu.

## Ako to funguje

Každé volanie beží v novom kontajneri bez prístupu k sieti. Potrebné súbory sa skopírujú iba na čítanie, kód sa vykoná a kontajner sa odstráni. Malý pracovný priečinok pretrváva medzi volaniami rovnakej relácie, čo umožňuje neskoršiemu kroku nadviazať na výsledky uložené skorším krokom.

| Cesta | Obsah |
|------|--------|
| `/input` | Súbory Drive tejto relácie, iba na čítanie |
| `/work` | Pracovný priestor, ktorý pretrváva počas relácie, napr. `/work/sales.pkl` |
| `/work/out` | Tu zapísané súbory sa po volaní uložia do Drive a vrátia ako odkazy |

V sandboxe sú predinštalované balíčky pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx a langdetect, a tiež OCR Tesseract, ktoré používa [uzol Prevodník](../nodes/converter-node.md).

## Nástroje

Model pracuje s tromi nástrojmi a štvrtým v prostredí Chat:

| Nástroj | Funkcia |
|------|----------|
| `list_files` | Zobrazí zoznam súborov Drive, ktoré môžete otvoriť: názov, typ, veľkosť, dátum |
| `inspect_file` | Vráti typ, metadáta a štruktúru súboru s krátkou ukážkou |
| `run_python` | Spustí Python na zadaných súboroch a vráti výstup z konzoly |
| `clear_workspace` | Iba Chat: vymaže pracovný priečinok konverzácie |

`inspect_file` číta iba to, čo je nevyhnutné pre súhrn:

| Typ | Súhrn |
|-----|-----------------|
| PDF | Počet strán, názov a autor, možnosť extrakcie textu, jazyk, veľkosti stránok, text a tabuľky prvej strany. Naskenované PDF súbory sa čítajú cez OCR (až 5 strán) |
| XLSX / XLS | Hárky s počtom riadkov a stĺpcov, riadky záhlavia, typy, pandas `read_hint`, pomenované rozsahy, prvé riadky |
| CSV / TSV | Kódovanie, oddeľovač, počet riadkov, stĺpce s typmi, prvé riadky |
| DOCX | Štruktúra nadpisov, tabuľky, počty slov a znakov, autor a dátum |
| JSON | Koreňový typ, kľúče, dĺžka poľa, hĺbka vnorenia, ukážkové záznamy |

Vo vnútri `run_python` otvorte súbor pomocou modulu `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## V prostredí Chat

Pripojte súbory PDF, tabuľky, DOCX, CSV alebo JSON, obrázky (PNG, JPG, GIF, WebP) alebo obyčajné textové súbory na [karte Chat](../tabs/chat-tab.md), v Chate v Heym Work alebo cez MCP nástroj `heym_chat`. Jedna správa môže obsahovať až 10 súborov. Každý súbor je uložený vo vašom Drive; do správy vstupuje iba jeho názov a ID. Chat preskúma súbor, prečíta časť potrebnú pre vašu otázku a odpovie tabuľkami alebo výňatkami.

## Vo workflowoch

Beh otvára iba svoje vlastné súbory: súbory nahrané cez [uzol Trigger pre nahrávanie súborov](../nodes/file-upload-trigger-node.md), súbory zapísané uzlami do Drive a súbory získané [uzlom Drive](../nodes/drive-node.md) krokom **Get** v tom istom behu.

- **Uzol Agent**: ak vstup alebo správa agenta obsahuje súbor z behu, automaticky získa vyššie uvedené nástroje pre tieto súbory.
- **Uzol Code**: nastavte **Files** na výraz ako `$Upload.file.id`. Súbory sa pripoja a uvedú v `params.files`.

## Limity

| Limit | Hodnota |
|-----------|------|
| Pamäť na volanie | 2 GB |
| Čas na volanie | 120 sekúnd |
| Pracovný priečinok na reláciu | 2 GB |
| Výstupné súbory na volanie | 20, až 100 MB každý |
| Textový výstup vrátený modelu | 20 000 znakov |
| Súbory na volanie | 20 |

## Bezpečnosť

- Sandbox nemá prístup k sieti, nemá prístup k nastaveniam ani tajomstvám Heym a beží ako neprivilegovaný používateľ.
- Súbory sa spracovávajú výhradne vo vnútri sandboxu.
- V Chate prístup zodpovedá Drive: otvárate vlastné súbory a súbory zdieľané s vašimi tímami.
- Otvorenie súboru v Chate sa zaznamenáva do audítorského denníka.
- Obsah súborov sa považuje striktne za dáta; inštrukcie vo vnútri súborov sa nevykonávajú.

## Požiadavky

Analýza súborov vyžaduje backend sandboxu na inštancii Heym (Docker alebo [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Súvisiace

- [Drive](./drive.md)
- [Uzol Code](../nodes/code-node.md)
- [Uzol Agent](../nodes/agent-node.md)
- [Karta Chat](../tabs/chat-tab.md)
