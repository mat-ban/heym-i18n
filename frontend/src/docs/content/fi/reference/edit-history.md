# Muokkaushistoria

Muokkaushistoria seuraa tallennettuja workflow-versioita. Sen avulla voit tarkastella muutoksia ajan kuluessa, vertailla versioita tai palauttaa aiemman tilan.

**Huomio:** Muokkaushistoria eroaa [Suoritushistoriasta](./execution-history.md). Muokkaushistoria seuraa **tallennuksia** (workflow-rakenteen muutoksia); suoritushistoria seuraa **ajoja** (aiempia suorituksia).

## Löydä se

**Editorin työkalurivi** → **Muokkaushistoria** (GitBranch-kuvake)

## Versiot

Uusi versio luodaan joka kerta, kun **Tallennat** workflown. Luettelossa näkyy:

- **Nykyinen** – Viimeisin tallennettu tila (mitä näet canvaksella)
- **Versio N** – Aiemmat tallennukset aikaleimoineen

Versiot, joissa ei ole muutoksia edelliseen verrattuna, piilotetaan.

## Vertailunäkymä

Valitse versio nähdäksesi, mitä on muuttunut nykyiseen workflowhun verrattuna:

| Muutostyyppi | Kuvaus |
|-------------|--------------|
| **Solmut** | Lisätyt, poistetut tai muokatut solmut |
| **Yhteydet** | Lisätyt, poistetut tai muokatut yhteydet |
| **Asetukset** | Workflow-tason määritykset (todennus, rajoitukset jne.) |

Laajenna kukin muutos nähdäksesi kenttätason erot (esim. mitkä solmun ominaisuudet muuttuivat).

## Esikatselu

Nähdäksesi, miltä workflow näytti tietyllä aiemmalla versiolla, klikkaa **Esikatsele** Palauta-painikkeen vieressä.

Avautuu vain luku -tilassa oleva canvas, joka näyttää kyseisen version solmut ja yhteydet. Voit siirtyä ja zoomata tutkiaksesi asettelua; tästä näkymästä ei voi tehdä muutoksia.

## Palautus

Palauttaaksesi aiemman version:

1. Valitse haluamasi versio
2. Klikkaa **Palauta**
3. Vahvista toiminto
4. Nykyinen workflow korvataan valitulla versiolla; sivu päivittyy

Palautus luo uuden "nykyisen" tilan – voit palauttaa uudelleen tarvittaessa.

## Historia tyhjennetään

Klikkaa roskakorin kuvaa valintaikkunan otsikossa poistaaksesi kaikki versiohistorian. Tätä toimintoa ei voi peruuttaa. Nykyinen workflow säilyy; vain aiemmat versiot poistetaan.

## Milloin versiot luodaan

Versiot luodaan vain, kun **Tallennat** (Ctrl/Cmd+S tai Tallenna-painike). Tallentamattomat muutokset eivät tallennu muokkaushistoriaan ennen tallennusta.

Agenttien taitojen muokkaukset sisältyvät näihin tilannekuviin. Selataksesi tai palauttaaksesi yksittäisen taidon palauttamatta koko workflowta, käytä **Historia**-painiketta kyseisen taidon kortissa Agentti-solmun ominaisuuspanelissa. Katso [Agentti-solmu](../nodes/agent-node.md#skill-history).

## Liittyvät aiheet

- [Suoritushistoria](./execution-history.md) – Aiemmat ajot ja Bring to Canvas
- [Workflow-rakenne](./workflow-structure.md) – Solmujen ja yhteyksien muoto
- [Workflowt-välilehti](../tabs/workflows-tab.md) – Workflowjen luominen ja hallinta
