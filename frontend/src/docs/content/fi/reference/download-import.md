# Lataus & Tuonti

Vie workflowt tai kokonaiset kansiot tiedostoina tai tuo ne raahaa ja pudota -toiminnolla. Käytä tätä varmuuskopiointiin, jakamiseen tai workflowjen siirtämiseen eri instanssien välillä.

## Workflown lataus (JSON)

**Sijainti:** Editorin työkalupalkki → **Lataa** -painike (näkyy suuremmilla näytöillä)

**Viedään:**
- `nodes` – Kaikki canvasin solmut
- `edges` – Kaikki solmujen väliset yhteydet

**Tiedostonimi:** `{workflow-nimi}.json` (johdettu workflown nimestä)

**Muoto:** Katso [Workflown rakenne](./workflow-structure.md) JSON-skeemasta.

## Kansion lataus (ZIP)

**Sijainti:** Dashboard → Workflows-välilehti → kansion kolmen pisteen valikko → **Lataa ZIP-tiedostona**

**Viedään:**
- Kaikki workflowt kansiossa ja alikansioissa rekursiivisesti
- Kansiorakenne säilyy ZIP-tiedoston sisällä olevina hakemistoina

**ZIP-rakenne:**
```
KansionNimi/
  workflow1.json
  workflow2.json
  Alikansio/
    workflow3.json
    SyvempiAlikansio/
      workflow4.json
```

Jokainen `.json`-tiedosto sisältää `{ name, nodes, edges }`.

## Tuonti

### Dashboardista (Workflows-välilehti)

1. Siirry [Workflows](../tabs/workflows-tab.md) -välilehdelle
2. Raahaa **JSON**- tai **ZIP**-tiedosto workflow-alueelle

**JSON-tiedosto:** Uusi workflow luodaan. Workflown nimi tulee JSON-tiedoston `name`-kentästä tai tiedostonimestä, jos `name` puuttuu.

**ZIP-tiedosto:** Koko kansiorakenne luodaan uudelleen juuritasolla. Jokainen ZIP-tiedoston sisällä oleva `.json`-tiedosto muuttuu workflowksi vastaavassa kansiossa. Tunnistetiedot ja workflowjen väliset viitteet, joita ei ole nykyisessä instanssissa, tyhjennetään automaattisesti. Jos joidenkin workflowjen tuonti epäonnistuu, yhteenveto näyttää onnistuneiden määrän.

### Canvasista (Editori)

1. Avaa workflow editorissa
2. Raahaa JSON-tiedosto canvasille
3. Jos canvassilla on jo solmuja tai yhteyksiä, vahvistusdialogi kysyy, korvataanko nykyinen workflow
4. Tuodut solmut ja yhteydet korvaavat tai yhdistyvät nykyiseen workflowhun

## Tiedostomuodot

### JSON (yksittäinen workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Valinnainen workflown nimi"
}
```

- `nodes` – Pakollinen; solmuolioiden taulukko
- `edges` – Valinnainen; yhteyksien taulukko (oletusarvo `[]`)
- `name` – Valinnainen; käytetään uuden workflown luomiseen Dashboardin tuonnissa

### ZIP (kansio)

ZIP-arkisto, jossa hakemistorakenne heijastaa kansiorakennetta. Jokainen tiedosto on workflown JSON (katso yllä). Kansion ja workflown nimet johdetaan hakemiston ja tiedoston nimistä.

Katso [Workflown rakenne](./workflow-structure.md) solmujen ja yhteyksien muodoista.

## Käyttötapaukset

- **Varmuuskopiointi** – Lataa workflowt tai kokonaiset kansiot ennen suuria muutoksia
- **Jakaminen** – Vie ja jaa JSON-tiedostoja tiimikavereiden kanssa
- **Siirto** – Siirrä workflowt tai kansiorakenteet eri Heym-instanssien välillä
- **Versionhallinta** – Tallenna workflown JSON Gitissä koodin rinnalle

## Liittyvät

- [Workflown rakenne](./workflow-structure.md) – Solmujen ja yhteyksien JSON-muoto
- [Workflows-välilehti](../tabs/workflows-tab.md) – Workflowjen luominen ja tuonti raahaa ja pudota -toiminnolla
- [Workflowjen organisointi](./workflow-organization.md) – Kansiot ja alikansiot
- [Canvasin ominaisuudet](./canvas-features.md) – Editorin ominaisuudet, mukaan lukien canvas-tuonti
