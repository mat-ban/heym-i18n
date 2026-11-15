# Bestandsanalyse

Met bestandsanalyse kunnen Chat, de [Agent-node](../nodes/agent-node.md) en de [Code-node](../nodes/code-node.md) grote bestanden uit [Drive](./drive.md) openen en analyseren in een geïsoleerde Python-sandbox. PDF's, spreadsheets, CSV-, DOCX- en JSON-bestanden worden eerst geïnspecteerd en vervolgens selectief gelezen, zodat een contract van 200 pagina's of een werkmap met een miljoen rijen nooit volledig in de context van een model hoeft te passen.

## Hoe het werkt

Elke aanroep wordt uitgevoerd in een nieuwe container zonder netwerktoegang. De benodigde bestanden worden alleen-lezen gekopieerd, de code wordt uitgevoerd en de container wordt verwijderd. Een kleine werkmap blijft behouden tussen aanroepen van dezelfde sessie, zodat een latere stap kan voortbouwen op de resultaten die een eerdere stap heeft opgeslagen.

| Pad | Inhoud |
|------|--------|
| `/input` | De Drive-bestanden van deze sessie, alleen-lezen |
| `/work` | Werkruimte die behouden blijft tijdens de sessie, bijv. `/work/sales.pkl` |
| `/work/out` | Bestanden die hier worden weggeschreven, worden na de aanroep opgeslagen in Drive en geretourneerd als links |

In de sandbox zijn pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx en langdetect vooraf geïnstalleerd, plus de Tesseract OCR die ook door de [Converter-node](../nodes/converter-node.md) wordt gebruikt.

## Tools

Het model werkt met drie tools, plus een vierde in Chat:

| Tool | Functie |
|------|----------|
| `list_files` | Geeft een overzicht van de Drive-bestanden die u kunt openen: naam, type, grootte, datum |
| `inspect_file` | Retourneert het type, de metadata en de structuur van een bestand met een kort fragment |
| `run_python` | Voert Python uit voor de opgegeven bestanden en retourneert de console-uitvoer |
| `clear_workspace` | Alleen Chat: verwijdert de werkmap van het gesprek |

`inspect_file` leest alleen wat nodig is voor een samenvatting:

| Type | Samenvatting |
|-----|-----------------|
| PDF | Aantal pagina's, titel en auteur, of tekst kan worden geëxtraheerd, taal, pagina-afmetingen, tekst en tabellen van de eerste pagina. Gescande PDF's worden gelezen via OCR (tot 5 pagina's) |
| XLSX / XLS | Bladen met aantal rijen en kolommen, veldkoppen, typen, `read_hint` voor pandas, benoemde bereiken, eerste rijen |
| CSV / TSV | Tekencodering, scheidingsteken, aantal rijen, kolommen met typen, eerste rijen |
| DOCX | Overzicht van tussenkoppen, tabellen, woord- en tekenaantallen, auteur en datum |
| JSON | Hoofdttype, sleutels, array-lengte, nestdiepte, voorbeeldrecords |

Open binnen `run_python` een bestand met behulp van de module `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## In Chat

Voeg PDF-, spreadsheet-, DOCX-, CSV- of JSON-bestanden, afbeeldingen (PNG, JPG, GIF, WebP) of platte tekstbestanden toe in het [Chat-tabblad](../tabs/chat-tab.md), in de Chat van Heym Work of via de MCP-tool `heym_chat`. Eén bericht kan maximaal 10 bestanden bevatten. Elk bestand wordt opgeslagen in uw Drive; alleen de naam en ID worden in het bericht opgenomen. Chat inspecteert het bestand, leest het relevante deel voor uw vraag en antwoordt met tabellen of fragmenten.

## In workflows

Een uitvoering opent uitsluitend haar eigen bestanden: bestanden die zijn geüpload via de [File Upload Trigger-node](../nodes/file-upload-trigger-node.md), bestanden die nodes naar Drive hebben geschreven en bestanden die een [Drive-node](../nodes/drive-node.md) met de stap **Get** in dezelfde uitvoering heeft opgehaald.

- **Agent-node**: als de invoer of het bericht van de agent een bestand bevat, ontvangt deze automatisch de bovenstaande tools voor die bestanden.
- **Code-node**: stel **Files** in op een expressie zoals `$Upload.file.id`. De bestanden worden gekoppeld en weergegeven in `params.files`.

## Limieten

| Limiet | Waarde |
|-----------|------|
| Geheugen per aanroep | 2 GB |
| Tijd per aanroep | 120 seconden |
| Werkmap per sessie | 2 GB |
| Uitvoerbestanden per aanroep | 20, tot 100 MB per bestand |
| Afgedrukte tekstuitvoer naar model | 20.000 tekens |
| Bestanden per aanroep | 20 |

## Beveiliging

- De sandbox heeft geen netwerktoegang, geen toegang tot instellingen of secrets van Heym en draait als niet-bevoorrechte gebruiker.
- Bestanden worden uitsluitend binnen de sandbox verwerkt.
- In Chat volgt de toegang Drive: u opent uw eigen bestanden en bestanden die met uw teams zijn gedeeld.
- Het openen van een bestand in Chat wordt vastgelegd in het auditlogboek.
- Bestandsinhoud wordt strikt als data behandeld; eventuele opdrachten in een bestand worden niet uitgevoerd.

## Vereisten

Bestandsanalyse vereist een sandbox-backend op de Heym-instantie (Docker of [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Gerelateerd

- [Drive](./drive.md)
- [Code-node](../nodes/code-node.md)
- [Agent-node](../nodes/agent-node.md)
- [Chat-tabblad](../tabs/chat-tab.md)
