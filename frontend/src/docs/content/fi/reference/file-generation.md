# Tiedostojen luominen

Skills-ominaisuudet voivat luoda tiedostoja (PDF, DOCX, CSV, kuvat jne.) suorituksen aikana. Luodut tiedostot tallennetaan automaattisesti ja ne ovat ladattavissa.

## Toimintaperiaate

Kun skill suoritetaan, Heym luo `_output_files/`-hakemiston skillin suoritusympäristöön. Polku on saatavilla `_OUTPUT_DIR`-ympäristömuuttujana.

Kaikki tähän hakemistoon kirjoitetut tiedostot (paitsi tiedostot, joiden nimi alkaa `_`-merkillä) tallennetaan suorituksen jälkeen tiedostojärjestelmään, ja niille luodaan automaattisesti latauslinkki.

## Tiedostojen kirjoittaminen skillissä

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Luo CSV-tiedosto
csv_path = os.path.join(output_dir, "report.csv")
with open(csv_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Value"])
    writer.writerow(["Revenue", args.get("revenue", 0)])
    writer.writerow(["Users", args.get("users", 0)])

print(json.dumps({"status": "Report generated"}))
```

## PDF-tiedostojen luominen

`reportlab`-kirjasto on saatavilla PDF-tiedostojen luomiseen:

```python
import os
import json
import sys
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

pdf_path = os.path.join(output_dir, "invoice.pdf")
c = canvas.Canvas(pdf_path, pagesize=A4)
c.drawString(100, 750, f"Invoice for {args.get('customer', 'Unknown')}")
c.drawString(100, 730, f"Amount: ${args.get('amount', 0)}")
c.save()

print(json.dumps({"status": "Invoice generated"}))
```

## DOCX-tiedostojen luominen

`python-docx`-kirjasto on saatavilla:

```python
import os
import json
import sys
from docx import Document

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

doc = Document()
doc.add_heading(args.get("title", "Report"), level=1)
doc.add_paragraph(args.get("content", ""))
doc.save(os.path.join(output_dir, "report.docx"))

print(json.dumps({"status": "Document generated"}))
```

## Useita tiedostoja

Skills-ominaisuudet voivat luoda useita tiedostoja yhdessä suorituksessa:

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Luo CSV-tiedosto
with open(os.path.join(output_dir, "data.csv"), "w") as f:
    writer = csv.writer(f)
    writer.writerow(["col1", "col2"])
    writer.writerow(["val1", "val2"])

# Luo tekstimuotoinen yhteenveto
with open(os.path.join(output_dir, "summary.txt"), "w") as f:
    f.write("Summary of the data processing...")

print(json.dumps({"status": "done", "files_generated": 2}))
```

## Tiedostojen kooksi rajoitukset

Luotujen tiedostojen koko on rajoitettu `FILE_MAX_SIZE_MB`-asetuksella (oletus: 99 Mt). Tätä rajaa suuremmat tiedostot ohitetaan hiljaisesti.

## Latauslinkit

Suorituksen jälkeen jokaiselle luodulle tiedostolle luodaan yksilöllinen lataus-URL. Nämä URL-osoitteet sisältyvät skillin tulokseen `_generated_files`-avaimen alle:

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.csv",
      "mime_type": "text/csv",
      "size_bytes": 1234,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

`id`-kenttä on tiedoston UUID. Käytä sitä [Drive-solmun](../nodes/drive-node.md) kanssa tiedoston hallintaan workflown sisällä — poista se, lisää salasana, aseta vanhentumisaika tai rajoita latauksia:

```
$agentLabel._generated_files[0].id
```

Näitä linkkejä voidaan myös jakaa suoraan tai hallita [Drive](../reference/drive.md)-välilehden kautta.

Käyttöönoton asetuksista riippuen `download_url` voi olla joko:
- Absoluuttinen URL-osoite (kun `FRONTEND_URL` on määritetty backend-kontille).
- Suhteellinen polku (esimerkiksi `/api/files/dl/abc123...`), joka toimii edelleen selainkäyttöliittymässä.

## Tuetut MIME-tyypit

Tiedostotyypit tunnistetaan automaattisesti tiedostopäätteestä. Yleisimmät tyypit:

| Pääte | MIME-tyyppi |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Liittyvät ominaisuudet

- [Drive-solmu](../nodes/drive-node.md) - Ohjelmallinen poisto, salasanasuojaus, vanhentumisaika, latausrajoitukset ja tiimijako luoduille tiedostoille
- [Drive](../reference/drive.md) - Dashboardin Drive-välilehti ja jakolinkkien toiminta
- [Drive-välilehti](../tabs/drive-tab.md) - Tiedostojen selaaminen ja hallinta käyttöliittymässä
