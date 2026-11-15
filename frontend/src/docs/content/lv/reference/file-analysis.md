# Failu analīze

Failu analīze ļauj Chat, [Agent mezglam](../nodes/agent-node.md) un [Code mezglam](../nodes/code-node.md) atvērt un analizēt lielus failus no [Drive](./drive.md) izolētā Python smilškastē. PDF, izklājlapas, CSV, DOCX un JSON vispirms tiek pārbaudīti un pēc tam lasīti selektīvi, tādējādi 200 lappušu līgumam vai darbgrāmatai ar miljonu rindu nekad nav pilnībā jāiekļaujas modeļa kontekstā.

## Kā tas darbojas

Katrs izsaukums darbojas jaunā konteinerā bez piekļuves tīklam. Nepieciešamie faili tiek iekopēti tikai lasīšanas režīmā, kods tiek izpildīts un konteiners tiek noņemts. Starp tās pašas sesijas izsaukumiem tiek saglabāta neliela darba mape, ļaujot vēlākā solī turpināt darbu no iepriekšējā soļa saglabātajiem rezultātiem.

| Ceļš | Saturs |
|------|--------|
| `/input` | Šīs sesijas Drive faili, tikai lasāmi |
| `/work` | Darba vieta, kas saglabājas sesijas laikā, piem., `/work/sales.pkl` |
| `/work/out` | Šeit ierakstītie faili pēc izsaukuma tiek saglabāti Drive un atgriezti kā saites |

Smilškastē ir iepriekš instalēti pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx un langdetect, kā arī Tesseract OCR, ko izmanto [Converter mezgls](../nodes/converter-node.md).

## Rīki

Modelis strādā ar trim rīkiem, kā arī ceturto Chat vidē:

| Rīks | Funkcija |
|------|----------|
| `list_files` | Uzskaita Drive failus, kurus varat atvērt: nosaukums, veids, lielums, datums |
| `inspect_file` | Atgriež faila tipu, metadatus un struktūru ar nelielu paraugu |
| `run_python` | Izpilda Python uz norādītajiem failiem un atgriež konsoles izvadi |
| `clear_workspace` | Tikai Chat: izdzēš sarunas darba mapi |

`inspect_file` nolasa tikai to, kas nepieciešams kopsavilkumam:

| Tips | Kopsavilkums |
|-----|-----------------|
| PDF | Lapu skaits, nosaukums un autors, teksta iegūstamība, valoda, lapu izmēri, pirmās lapas teksts un tabulas. Skenētie PDF tiek lasīti ar OCR (līdz 5 lapām) |
| XLSX / XLS | Lapas ar rindu un kolonnu skaitu, galvenes rindas, tipi, pandas `read_hint`, nosauktie diapazoni, pirmās rindas |
| CSV / TSV | Kodējums, atdalītājs, rindu skaits, kolonnas ar tipiem, pirmās rindas |
| DOCX | Virsrakstu struktūra, tabulas, vārdu un rakstzīmju skaits, autors un datums |
| JSON | Saknes tips, atslēgas, masīva garums, ligzdošanas dziļums, parauga ieraksti |

Atveriet failu `run_python` iekšienē ar moduli `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## Chat vidē

Pievienojiet PDF, izklājlapu, DOCX, CSV vai JSON failus, attēlus (PNG, JPG, GIF, WebP) vai vienkārša teksta failus [Chat cilnē](../tabs/chat-tab.md), Heym Work Chat vai ar MCP rīku `heym_chat`. Viena ziņa var saturēt līdz 10 failiem. Katrs fails tiek saglabāts jūsu Drive; ziņā tiek iekļauts tikai tā nosaukums un ID. Chat pārbauda failu, nolasa jautājumam nepieciešamo daļu un atbild ar tabulām vai fragmentiem.

## Workflow procesos

Izpilde atver tikai savus failus: tos, kas augšupielādēti, izmantojot [Faila augšupielādes Trigger mezglu](../nodes/file-upload-trigger-node.md), tos, ko mezgli ierakstījuši Drive, un tos, ko [Drive mezgls](../nodes/drive-node.md) ieguvis ar soli **Get** tajā pašā izpildē.

- **Agent mezgls**: ja aģenta ievadē vai ziņā ir iekļauts fails, tas automātiski saņem iepriekš minētos rīkus šiem failiem.
- **Code mezgls**: iestatiet **Files** uz izteiksmi, piemēram, `$Upload.file.id`. Faili tiek pievienoti un uzskaitīti `params.files`.

## Ierobežojumi

| Ierobežojums | Vērtība |
|-----------|------|
| Atmiņa vienam izsaukumam | 2 GB |
| Laiks vienam izsaukumam | 120 sekundes |
| Darba mape vienai sesijai | 2 GB |
| Izvades faili vienam izsaukumam | 20, līdz 100 MB katrs |
| Modelim atgrieztā teksta izvade | 20 000 rakstzīmju |
| Faili vienam izsaukumam | 20 |

## Drošība

- Smilškastei nav tīkla piekļuves, nav piekļuves Heym iestatījumiem vai noslēpumiem, un tā darbojas kā nepriviliģēts lietotājs.
- Faili tiek apstrādāti tikai smilškastes iekšienē.
- Chat vidē piekļuve atbilst Drive: jūs atverat savus failus un failus, kas kopīgoti ar jūsu komandām.
- Faila atvēršana Chat tiek reģistrēta audita žurnālā.
- Faila saturs tiek uzskatīts tikai par datiem; tajā esošās instrukcijas netiek izpildītas.

## Prasības

Failu analīzei Heym instancē ir nepieciešama smilškastes aizmugursistēma (Docker vai [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Saistītie

- [Drive](./drive.md)
- [Code mezgls](../nodes/code-node.md)
- [Agent mezgls](../nodes/agent-node.md)
- [Chat cilnē](../tabs/chat-tab.md)
