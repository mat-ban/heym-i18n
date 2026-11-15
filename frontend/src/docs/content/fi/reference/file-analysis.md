# Tiedostoanalyysi

Tiedostoanalyysin avulla Chat, [Agent-solmu](../nodes/agent-node.md) ja [Code-solmu](../nodes/code-node.md) voivat avata ja analysoida suuria tiedostoja [Drive](./drive.md) -tallennustilasta eristetyssä Python-hiekkalaatikossa. PDF-, taulukkolaskenta-, CSV-, DOCX- ja JSON-tiedostot tarkistetaan ensin ja luetaan valikoidusti, joten 200-sivuisen sopimuksen tai miljoonan rivin työkirjan ei koskaan tarvitse mahtua mallin kontekstiin.

## Kuinka se toimii

Jokainen kutsu suoritetaan uudessa säilössä ilman verkkoyhteyttä. Tarvittavat tiedostot kopioidaan vain luku -tilassa, koodi suoritetaan ja säiliö poistetaan. Pieni työkansio säilyy saman istunnon kutsujen välillä, jolloin myöhempi vaihe voi jatkaa aiemman vaiheen tallentamista tuloksista.

| Polku | Sisältö |
|------|--------|
| `/input` | Tämän istunnon Drive-tiedostot, vain luku |
| `/work` | Istunnon aikana säilyvä työtila, esim. `/work/sales.pkl` |
| `/work/out` | Tänne kirjoitetut tiedostot tallennetaan Driveen kutsun jälkeen ja palautetaan linkkeinä |

Hiekkalaatikkoon on esiasennettu pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx ja langdetect sekä Tesseract OCR, jota myös [Converter-solmu](../nodes/converter-node.md) käyttää.

## Työkalut

Malli käyttää kolmea työkalua sekä neljättä Chatissa:

| Työkalu | Toiminto |
|------|----------|
| `list_files` | Listaa Drive-tiedostot, jotka voit avata: nimi, tyyppi, koko, päivämäärä |
| `inspect_file` | Palauttaa tiedoston tyypin, metatiedot ja rakenteen lyhyen näytteen kera |
| `run_python` | Suorittaa Python-koodia määritetyille tiedostoille ja palauttaa konsolitulosteen |
| `clear_workspace` | Vain Chat: poistaa keskustelun työkansion |

`inspect_file` lukee vain yhteenvedon vaatimat tiedot:

| Tyyppi | Yhteenveto |
|-----|-----------------|
| PDF | Sivumäärä, otsikko ja tekijä, tekstin erotettavuus, kieli, sivukoot, ensimmäisen sivun teksti ja taulukot. Skannatut PDF-tiedostot luetaan OCR:llä (enintään 5 sivua) |
| XLSX / XLS | Taulukot rivi- ja sarakemäärillä, otsikkorivit, tyypit, pandas `read_hint`, nimetyt alueet, ensimmäiset rivit |
| CSV / TSV | Merkistökoodaus, erotin, rivimäärä, sarakkeet tyyppeineen, ensimmäiset rivit |
| DOCX | Otsikkorakenne, taulukot, sana- ja merkkimäärät, tekijä ja päivämäärä |
| JSON | Juurityyppi, avaimet, taulukon pituus, sisäkkäisyyssyvyys, esimerkkikirjaukset |

Avaa tiedosto `run_python`-työkalussa `heym_files`-moduulin avulla:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## Chatissa

Liitä PDF-, taulukkolaskenta-, DOCX-, CSV- tai JSON-tiedostoja, kuvia (PNG, JPG, GIF, WebP) tai pelkkiä tekstitiedostoja [Chat-välilehdellä](../tabs/chat-tab.md), Heym Workin Chatissa tai MCP:n `heym_chat`-työkalun kautta. Yksi viesti voi sisältää enintään 10 tiedostoa. Jokainen tiedosto tallennetaan Driveesi; vain sen nimi ja ID siirtyvät viestiin. Chat tutkii tiedoston, lukee kysymyksen kannalta oleellisen osan ja vastaa taulukoin tai ottein.

## Workfloweissa

Suoritus avaa vain omat tiedostonsa: ne, jotka on ladattu [File Upload Trigger -solmun](../nodes/file-upload-trigger-node.md) kautta, ne, jotka solmut ovat kirjoittaneet Driveen, ja ne, jotka [Drive-solmu](../nodes/drive-node.md) haki vaiheessa **Get** saman suorituksen aikana.

- **Agent-solmu**: jos agentin syöte tai viesti sisältää suorituksen tiedoston, se saa automaattisesti yllä olevat työkalut kyseisille tiedostoille.
- **Code-solmu**: aseta kenttään **Files** lauseke, kuten `$Upload.file.id`. Tiedostot liitetään ja luetellaan parametrissa `params.files`.

## Rajoitukset

| Rajoitus | Arvo |
|-----------|------|
| Muisti per kutsu | 2 GB |
| Aika per kutsu | 120 sekuntia |
| Työkansio per istunto | 2 GB |
| Tulostetiedostot per kutsu | 20, enintään 100 MB kukin |
| Mallille palautettava tekstituloste | 20 000 merkkiä |
| Tiedostot per kutsu | 20 |

## Tietoturva

- Hiekkalaatikolla ei ole verkkoyhteyttä, ei pääsyä Heymin asetuksiin tai salaisuuksiin, ja se toimii ilman etuoikeuksia olevana käyttäjänä.
- Tiedostot käsitellään vain hiekkalaatikon sisällä.
- Chatissa käyttöoikeus noudattaa Drivea: avaat omia tiedostojasi ja tiimiesi kanssa jaettuja tiedostoja.
- Tiedoston avaaminen Chatissa kirjataan valvontalokiin.
- Tiedostojen sisältö käsitellään puhtaasti datana; tiedostojen sisällä olevia ohjeita ei suoriteta.

## Vaatimukset

Tiedostoanalyysi vaatii hiekkalaatikkotaustajärjestelmän Heym-instanssissa (Docker tai [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Aiheeseen Liittyvät

- [Drive](./drive.md)
- [Code-solmu](../nodes/code-node.md)
- [Agent-solmu](../nodes/agent-node.md)
- [Chat-välilehdellä](../tabs/chat-tab.md)
