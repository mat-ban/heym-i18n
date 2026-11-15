# Failianalüüs

Failianalüüs võimaldab Chatil, [Agent nodel](../nodes/agent-node.md) ja [Code nodel](../nodes/code-node.md) avada ja analüüsida suuri faile [Drive'ist](./drive.md) isoleeritud Pythoni liivakastis. PDF-id, arvutustabelid, CSV, DOCX ja JSON vaadatakse esmalt läbi ning loetakse selektiivselt, nii et 200-leheküljeline leping või miljoni reaga töövihik ei pea kunagi mahtuma mudeli konteksti.

## Kuidas see toimib

Iga väljakutse käivitatakse uues konteineris ilma võrgujuurdepääsuta. Vajalikud failid kopeeritakse kirjutuskaitstult, kood käivitatakse ja konteiner eemaldatakse. Väike töökaust säilib sama seansi väljakutsete vahel, võimaldades hilisemal sammul jätkata varasema sammu salvestatud tulemustest.

| Tee | Sisu |
|------|--------|
| `/input` | Selle seansi Drive'i failid, kirjutuskaitstud |
| `/work` | Seansi vältel säiliv tööruum, nt `/work/sales.pkl` |
| `/work/out` | Siia kirjutatud failid salvestatakse pärast väljakutset Drive'i ja tagastatakse linkidena |

Liivakastis on eelinstallitud pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx ja langdetect ning Tesseract OCR, mida kasutab ka [Converter node](../nodes/converter-node.md).

## Tööriistad

Mudel töötab kolme tööriistaga, millele lisandub neljas Chatis:

| Tööriist | Funktsioon |
|------|----------|
| `list_files` | Loetleb Drive'i failid, mida saate avada: nimi, tüüp, suurus, kuupäev |
| `inspect_file` | Tagastab faili tüübi, metaandmed ja struktuuri koos lühikese näidisega |
| `run_python` | Käivitab Pythoni määratud failidel ja tagastab konsooliväljundi |
| `clear_workspace` | Ainult Chat: kustutab vestluse töökausta |

`inspect_file` loeb ainult seda, mis on kokkuvõtte jaoks vajalik:

| Tüüp | Kokkuvõte |
|-----|-----------------|
| PDF | Lehekülgede arv, pealkiri ja autor, teksti eraldatavus, keel, lehe suurused, esimese lehe tekst ja tabelid. Skannitud PDF-e loetakse OCR-iga (kuni 5 lehekülge) |
| XLSX / XLS | Lehed ridade ja veergude arvuga, päiserida, tüübid, pandase `read_hint`, nimega vahemikud, esimesed read |
| CSV / TSV | Kodeering, eraldaja, ridade arv, veerud koos tüüpidega, esimesed read |
| DOCX | Pealkirjade struktuur, tabelid, sõnade ja märkide arv, autor ja kuupäev |
| JSON | Juurtüüp, võtmed, massiivi pikkus, pesastumissügavus, näidiskirjed |

Avage fail `run_python` sees mooduliga `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## Chatis

Manustage PDF-, arvutustabeli-, DOCX-, CSV- või JSON-failid, pildid (PNG, JPG, GIF, WebP) või lihttekstifailid [Chati vahekaardil](../tabs/chat-tab.md), Heym Worki Chatis või MCP tööriista `heym_chat` kaudu. Üks sõnum võib sisaldada kuni 10 faili. Iga fail salvestatakse teie Drive'i; sõnumisse lisatakse ainult selle nimi ja ID. Chat kontrollib faili, loeb küsimuse jaoks vajaliku osa ja vastab tabelite või väljavõtetega.

## Workflow'des

Käitus avab ainult oma faile: need, mis on üles laaditud [Faili üleslaadimise triggeri](../nodes/file-upload-trigger-node.md) kaudu, need, mida sõlmed Drive'i kirjutasid, ja need, mille [Drive node](../nodes/drive-node.md) hankis samal käitusel sammuga **Get**.

- **Agent node**: kui agendi sisend või sõnum sisaldab faili, saab ta automaatselt ülaltoodud tööriistad nende failide jaoks.
- **Code node**: määrake **Files** väärtuseks avaldis, näiteks `$Upload.file.id`. Failid monteeritakse ja loetletakse väljal `params.files`.

## Piirangud

| Piirang | Väärtus |
|-----------|------|
| Mälu väljakutse kohta | 2 GB |
| Aeg väljakutse kohta | 120 sekundit |
| Töökaust seansi kohta | 2 GB |
| Väljundfailid väljakutse kohta | 20, kuni 100 MB igaüks |
| Mudelile tagastatav prinditud tekst | 20 000 märki |
| Failid väljakutse kohta | 20 |

## Turvalisus

- Liivakastil puudub võrk, puudub juurdepääs Heymi seadetele või saladustele ning see töötab tavakasutajana.
- Faile töödeldakse eranditult liivakastis.
- Chatis järgib juurdepääs Drive'i: avate enda faile ja meeskondadega jagatud faile.
- Faili avamine Chatis salvestatakse auditi logisse.
- Faili sisu käsitletakse rangelt andmetena; faili sees olevaid juhiseid ei täideta.

## Nõuded

Failianalüüs nõuab Heymi eksemplaris liivakasti taustsüsteemi (Docker või [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Seotud

- [Drive](./drive.md)
- [Code node](../nodes/code-node.md)
- [Agent node](../nodes/agent-node.md)
- [Chati vahekaardil](../tabs/chat-tab.md)
