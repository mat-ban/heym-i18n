# Anàlisi de fitxers

L'anàlisi de fitxers permet que Chat, el [node Agent](../nodes/agent-node.md) i el [node Code](../nodes/code-node.md) obrin i analitzin fitxers grans de [Drive](./drive.md) en un sandbox Python aïllat. PDFs, fulls de càlcul, CSV, DOCX i JSON s'inspeccionen primer i després es llegeixen selectivament, de manera que un contracte de 200 pàgines o un llibre de treball d'un milió de files no calgui que càpiga mai en el context d'un model.

## Com funciona

Cada crida s'executa en un contenidor nou sense accés a la xarxa. Els fitxers necessaris es copien en mode de només lectura, s'executa el codi i s'elimina el contenidor. Una petita carpeta de treball persisteix entre les crides de la mateixa sessió, permetent que un pas posterior continuï a partir dels resultats desats per un anterior.

| Camí | Contingut |
|------|--------|
| `/input` | Els fitxers de Drive d'aquesta sessió, només lectura |
| `/work` | Espai de treball que persisteix durant la sessió, per exemple `/work/sales.pkl` |
| `/work/out` | Els fitxers escrits aquí es desen a Drive després de la crida i es retornen com a enllaços |

El sandbox té instal·lats pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx i langdetect, a més de l'OCR Tesseract que utilitza el [node Convertidor](../nodes/converter-node.md).

## Eines

El model treballa amb tres eines, més una quarta a Chat:

| Eina | Funció |
|------|----------|
| `list_files` | Llista els fitxers de Drive que podeu obrir: nom, tipus, mida, data |
| `inspect_file` | Retorna el tipus, les metadades i l'estructura d'un fitxers amb una mostra breu |
| `run_python` | Executa Python sobre els fitxers indicats i retorna el que imprimeix el codi |
| `clear_workspace` | Només Chat: elimina la carpeta de treball de la conversa |

`inspect_file` llegeix només el que cal per a un resum:

| Tipus | Resum |
|-----|-----------------|
| PDF | Recompte de pàgines, títol i autor, si es pot extreure el text, idioma, mides de pàgina, text i taules de la primera pàgina. Els PDF escanejats es llegeixen amb OCR (fins a 5 pàgines) |
| XLSX / XLS | Fulls amb recompte de files i columnes, files de capçalera, tipus, `read_hint` de pandas, intervals amb nom, primeres files |
| CSV / TSV | Codificació, delimitador, recompte de files, columnes amb tipus, primeres files |
| DOCX | Esquema de capçaleres, taules, recompte de paraules i caràcters, autor i data |
| JSON | Tipus d'arrel, claus, longitud de matriu, profunditat d'imbricació, registres de mostra |

Dins de `run_python`, obriu un fitxer mitjançant el mòdul `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## A Chat

Adjunteu fitxers PDF, fulls de càlcul, DOCX, CSV o JSON, imatges (PNG, JPG, GIF, WebP) o fitxers de text pla a la [pestanya Chat](../tabs/chat-tab.md), al Chat de Heym Work o mitjançant l'eina MCP `heym_chat`. Un missatge pot portar fins a 10 fitxers. Cada fitxer s'emmagatzema al vostre Drive; només el seu nom i ID van al missatge. Chat l'inspecciona, llegeix la part que necessita la vostra pregunta i respon amb taules o extractes curts.

## En Workflows

Una execució obre només els seus propis fitxers: els carregats mitjançant el [node File Upload Trigger](../nodes/file-upload-trigger-node.md), els que els seus nodes han escrit a Drive i els que un [node Drive](../nodes/drive-node.md) ha obtingut amb el pas **Get** en la mateixa execució.

- **Node Agent**: quan l'entrada o missatge de l'agent inclou un fitxer, rep automàticament les eines anteriors per a aquests fitxers.
- **Node Code**: establiu **Files** amb una expressió com `$Upload.file.id`. Els fitxers es munten i es llisten a `params.files`.

## Límits

| Límit | Valor |
|-----------|------|
| Memòria per crida | 2 GB |
| Temps per crida | 120 segons |
| Carpeta de treball per sessió | 2 GB |
| Fitxers de sortida per crida | 20, fins a 100 MB cadascun |
| Sortida impresa retornada al model | 20.000 caràcters |
| Fitxers per crida | 20 |

## Seguretat

- El sandbox no té xarxa, no té accés a la configuració ni als secrets de Heym i s'executa com a usuari sense privilegis.
- Els fitxers s'analitzen exclusivament dins del sandbox.
- A Chat, l'accés segueix Drive: obriu fitxers propis i compartits amb els vostres equips.
- L'obertura d'un fitxer a Chat es registra al registre d'auditoria.
- El contingut dels fitxers es tracta com a dades; les instruccions que hi hagi escrites a l'interior no s'executen.

## Requisits

L'anàlisi de fitxers necessita un backend de sandbox a la instància de Heym (Docker o [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Related

- [Drive](./drive.md)
- [Node Code](../nodes/code-node.md)
- [Node Agent](../nodes/agent-node.md)
- [Pestanya Chat](../tabs/chat-tab.md)
