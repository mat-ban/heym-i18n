# Filanalys

Filanalys gör det möjligt för Chat, [Agent-noden](../nodes/agent-node.md) och [Code-noden](../nodes/code-node.md) att öppna och analysera stora filer från [Drive](./drive.md) i en isolerad Python-sandbox. PDF-filer, kalkylblad, CSV, DOCX och JSON inspekteras först och läses sedan selektivt, så att ett 200-sidigt kontrakt eller en arbetsbok med en miljon rader aldrig behöver rymmas helt i en modells kontext.

## Hur det fungerar

Varje anrop körs i en ny container utan nätverksåtkomst. De nödvändiga filerna kopieras in skrivskyddade, koden körs och containern tas bort. En liten arbetsmapp sparas mellan anrop under samma session, vilket gör att ett senare steg kan bygga vidare på resultat från ett tidigare steg.

| Sökväg | Innehåll |
|------|--------|
| `/input` | Denna sessions Drive-filer, skrivskyddade |
| `/work` | Arbetsyta som sparas under sessionen, t.ex. `/work/sales.pkl` |
| `/work/out` | Filer som skrivs här sparas i Drive efter anropet och returneras som länkar |

I sandboxen finns pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx och langdetect förinstallerade, plus den Tesseract OCR som även används av [Converter-noden](../nodes/converter-node.md).

## Verktyg

Modellen arbetar med tre verktyg, plus ett fjärde i Chat:

| Verktyg | Funktion |
|------|----------|
| `list_files` | Listar de Drive-filer som kan öppnas: namn, typ, storlek, datum |
| `inspect_file` | Returnerar en fils typ, metadata och struktur med ett kort utdrag |
| `run_python` | Kör Python på angivna filer och returnerar konsolutskriften |
| `clear_workspace` | Endast Chat: raderar konversationens arbetsmapp |

`inspect_file` läser endast vad som krävs för en sammanfattning:

| Typ | Sammanfattning |
|-----|-----------------|
| PDF | Sidantal, titel och författare, om text kan extraheras, språk, sidstorlekar, text och tabeller från första sidan. Skannade PDF-filer läses med OCR (upp till 5 sidor) |
| XLSX / XLS | Flikar med rad- och kolumnantal, rubrikrader, datatyper, `read_hint` för pandas, namngivna intervall, första rader |
| CSV / TSV | Teckenkodning, avgränsare, radantal, kolumner med datatyper, första rader |
| DOCX | Rubrikstruktur, tabeller, ord- och teckenantal, författare och datum |
| JSON | Rottyp, nycklar, arraylängd, kapslingsdjup, exempelposter |

Öppna en fil inuti `run_python` med modulen `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## I Chat

Bifoga PDF-, kalkylblads-, DOCX-, CSV- eller JSON-filer, bilder (PNG, JPG, GIF, WebP) eller rena textfiler i [Chat-fliken](../tabs/chat-tab.md), i Chat i Heym Work eller via MCP-verktyget `heym_chat`. Ett meddelande kan innehålla upp till 10 filer. Varje fil lagras i Drive; endast namn och ID inkluderas i meddelandet. Chat inspekterar filen, läser den relevanta delen för frågan och svarar med tabeller eller utdrag.

## I workflows

En körning öppnar endast sina egna filer: de som laddats upp via [Filuppladdnings-Triggern](../nodes/file-upload-trigger-node.md), de som noder skrivit till Drive och de som en [Drive-nod](../nodes/drive-node.md) hämtat med steget **Get** i samma körning.

- **Agent-nod**: om agentens indata eller meddelande innehåller en fil får den automatiskt verktygen ovan för dessa filer.
- **Code-nod**: ställ in **Files** på ett uttryck som `$Upload.file.id`. Filerna monteras och listas i `params.files`.

## Gränser

| Gräns | Värde |
|-----------|------|
| Minne per anrop | 2 GB |
| Tid per anrop | 120 sekunder |
| Arbetsmapp per session | 2 GB |
| Utdatafiler per anrop | 20, upp till 100 MB per fil |
| Textutskrift som returneras till modellen | 20 000 tecken |
| Filer per anrop | 20 |

## Säkerhet

- Sandboxen har ingen nätverksåtkomst, ingen åtkomst till Heyms inställningar eller secrets och körs som en opriviligierad användare.
- Filer bearbetas uteslutande inuti sandboxen.
- I Chat följer åtkomsten Drive: du öppnar dina egna filer och filer som delas med dina team.
- Öppnandet av en fil i Chat loggas i granskningsloggen.
- Filinnehåll behandlas strikt som data; instruktioner inuti filer körs inte.

## Krav

Filanalys kräver en sandbox-backend på Heym-instansen (Docker eller [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Relaterat

- [Drive](./drive.md)
- [Code-nod](../nodes/code-node.md)
- [Agent-nod](../nodes/agent-node.md)
- [Chat-fliken](../tabs/chat-tab.md)
