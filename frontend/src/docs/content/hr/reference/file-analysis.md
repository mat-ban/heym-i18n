# Analiza datoteka

Analiza datoteka omogućuje Chatu, [čvoru Agent](../nodes/agent-node.md) i [čvoru Code](../nodes/code-node.md) otvaranje i analizu velikih datoteka iz [Drivea](./drive.md) u izoliranom Python sandboxu. PDF, proračunske tablice, CSV, DOCX i JSON datoteke prvo se pregledavaju, a zatim selektivno čitaju, tako da se ugovor od 200 stranica ili tablica s milijun redaka nikada ne mora u potpunosti smjestiti u kontekst modela.

## Kako to radi

Svaki se poziv izvodi u novom spremniku bez pristupa mreži. Potrebne se datoteke kopiraju samo za čitanje, kod se izvršava i spremnik se uklanja. Mala radna mapa opstaje između poziva iste sesije, omogućujući kasnijem koraku nastavak rada s rezultatima koje je spremio raniji korak.

| Putanja | Sadržaj |
|------|--------|
| `/input` | Drive datoteke ove sesije, samo za čitanje |
| `/work` | Radni prostor koji traje tijekom sesije, npr. `/work/sales.pkl` |
| `/work/out` | Ovdje zapisane datoteke spremaju se na Drive nakon poziva i vraćaju kao poveznice |

U sandboxu su unaprijed instalirani pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx i langdetect, uz Tesseract OCR koji koristi i [čvor Konverter](../nodes/converter-node.md).

## Alati

Model radi s tri alata, uz četvrti u Chatu:

| Alat | Funkcija |
|------|----------|
| `list_files` | Prikazuje Drive datoteke koje možete otvoriti: naziv, vrsta, veličina, datum |
| `inspect_file` | Vraća vrstu, metapodatke i strukturu datoteke s kratkim uzorkom |
| `run_python` | Pokreće Python na navedenim datotekama i vraća ispis na konzoli |
| `clear_workspace` | Samo Chat: briše radnu mapu razgovora |

`inspect_file` čita samo ono što je potrebno za sažetak:

| Vrsta | Sažetak |
|-----|-----------------|
| PDF | Broj stranica, naslov i autor, mogućnost izdvajanja teksta, jezik, veličine stranica, tekst i tablice prve stranice. Skenirani PDF-ovi čitaju se putem OCR-a (do 5 stranica) |
| XLSX / XLS | Listovi s brojem redaka i stupaca, redovi zaglavlja, vrste, pandas `read_hint`, imenovani rasponi, prvi redovi |
| CSV / TSV | Kodiranje, graničnik, broj redaka, stupci s vrstama, prvi redovi |
| DOCX | Struktura naslova, tablice, broj riječi i znakova, autor i datum |
| JSON | Korijenska vrsta, ključevi, duljina niza, dubina ugniježđenosti, ogledni zapisi |

Unutar `run_python`, otvorite datoteku pomoću modula `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## U Chatu

Priložite PDF, proračunske tablice, DOCX, CSV ili JSON datoteke, slike (PNG, JPG, GIF, WebP) ili obične tekstualne datoteke u [kartici Chat](../tabs/chat-tab.md), u Heym Work Chatu ili putem MCP alata `heym_chat`. Jedna poruka može sadržavati do 10 datoteka. Svaka se datoteka pohranjuje na vaš Drive; samo njezin naziv i ID ulaze u poruku. Chat je pregledava, čita dio potreban za vaše pitanje i odgovara tablicama ili izvacima.

## U workflowima

Izvođenje otvara samo vlastite datoteke: one prenesene putem [Triggera za Učitavanje Datoteka](../nodes/file-upload-trigger-node.md), one koje su njegovi čvorovi zapisali na Drive i one koje je [čvor Drive](../nodes/drive-node.md) dohvatio korakom **Get** u istom izvođenju.

- **Čvor Agent**: kada ulaz ili poruka agenta sadrži datoteku, on automatski dobiva gore navedene alate za te datoteke.
- **Čvor Code**: postavite **Files** na izraz kao što je `$Upload.file.id`. Datoteke se montiraju i navode u `params.files`.

## Ograničenja

| Ograničenje | Vrijednost |
|-----------|------|
| Memorija po pozivu | 2 GB |
| Vrijeme po pozivu | 120 sekundi |
| Radna mapa po sesiji | 2 GB |
| Izlazne datoteke po pozivu | 20, do 100 MB svaka |
| Ispisani tekst vraćen modelu | 20.000 znakova |
| Datoteke po pozivu | 20 |

## Sigurnost

- Sandbox nema pristup mreži, nema pristup postavkama ili tajnama Heyma i radi kao neprivilegirani korisnik.
- Datoteke se obrađuju isključivo unutar sandboxa.
- U Chatu pristup prati Drive: otvarate vlastite datoteke i datoteke podijeljene s vašim timovima.
- Otvaranje datoteke u Chatu bilježi se u revizijskom dnevniku.
- Sadržaj datoteka tretira se strogo kao podaci; upute unutar njih se ne izvršavaju.

## Zahtjevi

Analiza datoteka zahtijeva sandbox pozadinu na instanci Heyma (Docker ili [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Povezano

- [Drive](./drive.md)
- [Čvor Code](../nodes/code-node.md)
- [Čvor Agent](../nodes/agent-node.md)
- [Kartica Chat](../tabs/chat-tab.md)
