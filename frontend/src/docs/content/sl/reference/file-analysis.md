# Analiza datotek

Analiza datotek omogoča Chatu, [vozlišču Agent](../nodes/agent-node.md) in [vozlišču Code](../nodes/code-node.md) odpiranje in analizo velikih datotek iz [Drive](./drive.md) v izoliranem peskovniku (sandbox) Python. Datoteke PDF, preglednice, CSV, DOCX in JSON se najprej pregledajo in nato selektivno preberejo, tako da se 200-stranska pogodba ali delovni zvezek z milijonom vrstic nikoli ne rabi v celoti prilegati v kontekst modela.

## Kako deluje

Vsak klic se izvede v novem vsebniku brez dostopa do omrežja. Potrebne datoteke se kopirajo v načinu samo za branje, koda se izvede in vsebnik se odstrani. Majhna delovna mapa se ohrani med klici iste seje, kar omogoča, da kasnejši korak nadaljuje z rezultati, ki jih je shranil prejšnji korak.

| Pot | Vsebina |
|------|--------|
| `/input` | Datoteke Drive te seje, samo za branje |
| `/work` | Delovni prostor, ki se ohrani med sejo, npr. `/work/sales.pkl` |
| `/work/out` | Datoteke, zapisane tukaj, se po klicu shranijo v Drive in vrnejo kot povezave |

V peskovniku so vnaprej nameščeni paketi pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx in langdetect ter OCR Tesseract, ki ga uporablja tudi [vozlišče Pretvornik](../nodes/converter-node.md).

## Orodja

Model deluje s tremi orodji ter četrtim v Chatu:

| Orodje | Funkcija |
|------|----------|
| `list_files` | Prikaže datoteke Drive, ki jih lahko odprete: ime, vrsta, velikost, datum |
| `inspect_file` | Vrne vrsto, metapodatke in strukturo datoteke s kratkim vzorcem |
| `run_python` | Izvede Python na navedenih datotekah in vrne izpis na konzoli |
| `clear_workspace` | Samo Chat: izbriše delovno mapo pogovora |

`inspect_file` prebere samo tisto, kar je nujno za povzetek:

| Vrsta | Povzetek |
|-----|-----------------|
| PDF | Število strani, naslov in avtor, ali je mogoče ekstrahirati besedilo, jezik, velikosti strani, besedilo in tabele prve strani. Optično prebrane PDF-je bere OCR (do 5 strani) |
| XLSX / XLS | Listi s številom vrstic in stolpcev, vrstice z glavo, tipi, pandas `read_hint`, poimenovani obsegi, prve vrstice |
| CSV / TSV | Kodiranje, ločilo, število vrstic, stolpci s tipi, prve vrstice |
| DOCX | Struktura naslovov, tabele, število besed in znakov, avtor in datum |
| JSON | Korenski tip, ključi, dolžina polja, globina gnezdenja, vzorčni zapisi |

V `run_python` odprite datoteko z modulom `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## V Chatu

Priložite datoteke PDF, preglednice, DOCX, CSV ali JSON, slike (PNG, JPG, GIF, WebP) ali datoteke z navadnim besedilom v [zavihku Chat](../tabs/chat-tab.md), v Heym Work Chatu ali prek orodja MCP `heym_chat`. Eno sporočilo lahko vsebuje do 10 datotek. Vsaka datoteka je shranjena v vašem Drive; v sporočilo se vključita samo njeno ime in ID. Chat pregleda datoteko, prebere del, potreben za vaše vprašanje, in odgovori s tabelami ali kratkimi izseki.

## V workflowih

Izvajanje odpre le lastne datoteke: tiste, prenesene prek [Triggerja za nalaganje datotek](../nodes/file-upload-trigger-node.md), tiste, ki so jih njegova vozlišča zapisala v Drive, in tiste, ki jih je [vozlišče Drive](../nodes/drive-node.md) pridobilo s korakom **Get** v istem izvajanju.

- **Vozlišče Agent**: ko vhod ali sporočilo agenta vsebuje datoteko, samodejno prejme zgoraj navedena orodja za te datoteke.
- **Vozlišče Code**: nastavite **Files** na izraz, kot je `$Upload.file.id`. Datoteke se namestijo in navedejo v `params.files`.

## Omejitve

| Omejitev | Vrednost |
|-----------|------|
| Pomnilnik na klic | 2 GB |
| Čas na klic | 120 sekund |
| Delovna mapa na sejo | 2 GB |
| Izhodne datoteke na klic | 20, do 100 MB vsaka |
| Natisnjeno besedilo, vrnjeno modelu | 20.000 znakov |
| Datoteke na klic | 20 |

## Varnost

- Peskovnik nima dostopa do omrežja, nima dostopa do nastavitev ali skrivnosti Heym in se izvaja kot neprivilegiran uporabnik.
- Datoteke se obdelujejo izključno v peskovniku.
- V Chatu dostop sledi Drive: odprete lastne datoteke in datoteke, deljene z vašimi ekipami.
- Odpiranje datoteke v Chatu se zabeleži v revizijski dnevnik.
- Vsebina datotek se obravnava strogo kot podatki; navodila v njih se ne izvajajo.

## Zahteve

Analiza datotek zahteva zaledje peskovnika v primerku Heym (Docker ali [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Sorodno

- [Drive](./drive.md)
- [Vozlišče Code](../nodes/code-node.md)
- [Vozlišče Agent](../nodes/agent-node.md)
- [Zavihek Chat](../tabs/chat-tab.md)
