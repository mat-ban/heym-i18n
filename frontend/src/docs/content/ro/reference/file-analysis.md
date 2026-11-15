# Analiza fișierelor

Analiza fișierelor permite ca Chat, [nodul Agent](../nodes/agent-node.md) și [nodul Code](../nodes/code-node.md) să deschidă și să analizeze fișiere mari din [Drive](./drive.md) într-un sandbox Python izolat. Fișierele PDF, tabelele de calcul, CSV, DOCX și JSON sunt mai întâi inspectate și apoi citite selectiv, astfel încât un contract de 200 de pagini sau un registru cu un milion de rânduri nu trebuie să încapă niciodată complet în contextul unui model.

## Cum funcționează

Fiecare apel se execută într-un container nou, fără acces la rețea. Fișierele necesare sunt copiate în mod doar-citire, codul rulează și containerul este eliminat. Un mic folder de lucru persistă între apelurile aceleiași sesiuni, permițând ca un pas ulterior să pornească de la rezultatele salvate de un pas anterior.

| Cale | Conținut |
|------|--------|
| `/input` | Fișierele Drive ale acestei sesiuni, doar-citire |
| `/work` | Spațiu de lucru temporar care persistă pe durata sesiunii, de exemplu `/work/sales.pkl` |
| `/work/out` | Fișierele scrise aici sunt salvate în Drive după apel și returnate ca linkuri |

Sandbox-ul are preinstalate pachetele pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx și langdetect, plus motorul OCR Tesseract utilizat de [nodul Convertor](../nodes/converter-node.md).

## Instrumente

Modelul lucrează cu trei instrumente, plus un al patrulea în Chat:

| Instrument | Funcție |
|------|----------|
| `list_files` | Listează fișierele Drive pe care le puteți deschide: nume, tip, dimensiune, dată |
| `inspect_file` | Returnează tipul, metadatele și structura unui fișier cu un scurt eșantion |
| `run_python` | Rulează Python pe fișierele specificate și returnează datele imprimate de cod |
| `clear_workspace` | Doar Chat: șterge folderul de lucru al conversației |

`inspect_file` citește doar ceea ce este necesar pentru un rezumat:

| Tip | Rezumat |
|-----|-----------------|
| PDF | Număr de pagini, titlu și autor, dacă textul poate fi extras, limbă, dimensiuni pagini, textul și tabelele primei pagini. PDF-urile scanate sunt citite cu OCR (până la 5 pagini) |
| XLSX / XLS | Foi de calcul cu număr de rânduri și coloane, rânduri de antet, tipuri, `read_hint` pandas, intervale denumite, primele rânduri |
| CSV / TSV | Codificare, delimitator, număr de rânduri, coloane cu tipuri, primele rânduri |
| DOCX | Structura titlurilor, tabele, număr de cuvinte și caractere, autor și dată |
| JSON | Tip rădăcină, chei, lungime tablou, adâncime de imbricare, înregistrări eșantion |

În interiorul `run_python`, deschideți un fișier folosind modulul `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## În Chat

Atașați fișiere PDF, tabele de calcul, DOCX, CSV sau JSON, imagini (PNG, JPG, GIF, WebP) sau fișiere text simplu în [fila Chat](../tabs/chat-tab.md), în Chat-ul Heym Work sau prin instrumentul MCP `heym_chat`. Un mesaj poate transporta până la 10 fișiere. Fiecare fișier este stocat în Drive-ul dumneavoastră; doar numele și ID-ul ajung în mesaj. Chat îl inspectează, citește porțiunea necesară pentru întrebare și răspunde cu tabele sau fragmente scurte.

## În Workflow-uri

O execuție deschide doar propriile fișiere: cele încărcate prin [nodul Trigger de Încărcare Fișier](../nodes/file-upload-trigger-node.md), cele pe care nodurile le-au scris în Drive și cele pe care un [nod Drive](../nodes/drive-node.md) le-a obținut prin pasul **Get** în aceeași execuție.

- **Nodul Agent**: când intrarea sau mesajul agentului include un fișier, acesta primește automat instrumentele de mai sus pentru acele fișiere.
- **Nodul Code**: setați **Files** la o expresie precum `$Upload.file.id`. Fișierele sunt montate și listate în `params.files`.

## Limite

| Limită | Valoare |
|-----------|------|
| Memorie per apel | 2 GB |
| Timp per apel | 120 secunde |
| Folder de lucru per sesiune | 2 GB |
| Fișiere de ieșire per apel | 20, până la 100 MB fiecare |
| Ieșire imprimată returnată modelului | 20.000 caractere |
| Fișiere per apel | 20 |

## Securitate

- Sandbox-ul nu are acces la rețea, nu are acces la setările sau secretele Heym și rulează ca utilizator neprivilegiat.
- Fișierele sunt analizate exclusiv în interiorul sandbox-ului.
- În Chat, accesul respectă Drive: deschideți propriile fișiere și pe cele partajate cu echipele dumneavoastră.
- Deschiderea unui fișier în Chat este înregistrată în jurnalul de audit.
- Conținutul fișierelor este tratat strict ca date; instrucțiunile scrise în interior nu sunt executate.

## Cerințe

Analiza fișierelor necesită un backend de sandbox pe instanța Heym (Docker sau [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Related

- [Drive](./drive.md)
- [Nodul Code](../nodes/code-node.md)
- [Nodul Agent](../nodes/agent-node.md)
- [Fila Chat](../tabs/chat-tab.md)
