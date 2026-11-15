# Filanalyse

Filanalyse giver Chat, [Agent-noden](../nodes/agent-node.md) og [Code-noden](../nodes/code-node.md) mulighed for at åbne og analysere store filer fra [Drive](./drive.md) i en isoleret Python-sandbox. PDF-filer, regneark, CSV, DOCX og JSON inspiceres først og læses derefter selektivt, så en 200-siders kontrakt eller en arbejdsbog med en million rækker aldrig behøver at passe ind i en models kontekst.

## Hvordan det virker

Hvert kald afvikles i en ny container uden netværksadgang. De nødvendige filer kopieres skrivebeskyttet, koden køres, og containeren fjernes. En lille arbejdsmappe bevares mellem kald i samme session, hvilket gør det muligt for et senere trin at bygge videre på resultater gemt af et tidligere trin.

| Sti | Indhold |
|------|--------|
| `/input` | Denne sessions Drive-filer, skrivebeskyttede |
| `/work` | Arbejdsområde, der bevares under sessionen, f.eks. `/work/sales.pkl` |
| `/work/out` | Filer, der skrives her, gemmes i Drive efter kaldet og returneres som links |

Sandboxen har forudinstalleret pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx og langdetect samt den Tesseract OCR, som [Converter-noden](../nodes/converter-node.md) anvender.

## Værktøjer

Modellen arbejder med tre værktøjer, plus et fjerde i Chat:

| Værktøj | Funktion |
|------|----------|
| `list_files` | Lister de Drive-filer, der kan åbnes: navn, type, størrelse, dato |
| `inspect_file` | Returnerer en fils type, metadata og struktur med et kort uddrag |
| `run_python` | Kører Python på de angivne filer og returnerer konsoloutput |
| `clear_workspace` | Kun Chat: sletter samtalens arbejdsmappe |

`inspect_file` læser kun, hvad der kræves til et resumé:

| Type | Resumé |
|-----|-----------------|
| PDF | Sideantal, titel og forfatter, tekstekstraherbarhed, sprog, sidestørrelser, tekst og tabeller på første side. Scannede PDF-filer læses med OCR (op til 5 sider) |
| XLSX / XLS | Ark med række- og kolonneantal, overskrifter, typer, `read_hint` til pandas, navngivne områder, første rækker |
| CSV / TSV | Tegnkodning, skilletegn, rækkeantal, kolonner med typer, første rækker |
| DOCX | Overskriftsstruktur, tabeller, ord- og tegnantal, forfatter og dato |
| JSON | Rodtype, nøgler, arraylængde, indlejringsdybde, eksempelposter |

Åbn en fil i `run_python` ved hjælp af modulet `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## I Chat

Vedhæft PDF-, regnearks-, DOCX-, CSV- eller JSON-filer, billeder (PNG, JPG, GIF, WebP) eller rene tekstfiler under [Chat-fanen](../tabs/chat-tab.md), i Chat i Heym Work eller via MCP-værktøjet `heym_chat`. En besked kan indeholde op til 10 filer. Hver fil gemmes i dit Drive; kun navn og ID inkluderes i beskeden. Chat inspicerer filen, læser den nødvendige del til dit spørgsmål og svarer med tabeller eller uddrag.

## I workflows

En kørsel åbner kun sine egne filer: filer uploadet via [File Upload Trigger-noden](../nodes/file-upload-trigger-node.md), filer skrevet til Drive af dens noder, og filer som en [Drive-node](../nodes/drive-node.md) har hentet med trinnet **Get** i samme kørsel.

- **Agent-node**: hvis agentens input eller besked indeholder en fil, modtager den automatisk ovenstående værktøjer til disse filer.
- **Code-node**: sæt **Files** til et udtryk såsom `$Upload.file.id`. Filerne monteres og angives i `params.files`.

## Grænser

| Grænse | Værdi |
|-----------|------|
| Hukommelse pr. kald | 2 GB |
| Tid pr. kald | 120 sekunder |
| Arbejdsmappe pr. session | 2 GB |
| Outputfiler pr. kald | 20, op til 100 MB pr. fil |
| Udskrevet tekst returneret til modellen | 20.000 tegn |
| Filer pr. kald | 20 |

## Sikkerhed

- Sandboxen har ingen netværksadgang, ingen adgang til Heym-indstillinger eller hemmeligheder og afvikles som en uprivilegeret bruger.
- Filer behandles udelukkende inde i sandboxen.
- I Chat følger adgangen Drive: du åbner dine egne filer og filer delt med dine teams.
- Åbning af en fil i Chat registreres i revisionsloggen.
- Filindhold behandles udelukkende som data; instruktioner inde i en fil udføres ikke.

## Krav

Filanalyse kræver en sandbox-backend på Heym-instansen (Docker eller [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Related

- [Drev](./drive.md)
- [Code-node](../nodes/code-node.md)
- [Agent-node](../nodes/agent-node.md)
- [Chat-fanen](../tabs/chat-tab.md)
