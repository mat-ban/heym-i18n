# Mallit-välilehti

Mallit-välilehti mahdollistaa kokonaisten workflowjen ja yksittäisten solmujen tallentamisen, selaamisen ja uudelleenkäytön. Jaa kerran rakentamasi ratkaisu ja käytä sitä uusissa projekteissa yhdellä napsautuksella.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Katso Mallit-esittely</a></p>

## Yleiskatsaus

Malleja on kahta tyyppiä:

- **Workflow-mallit** — tallenna koko workflow (kaikki solmut ja yhteydet) uudelleenkäytettäväksi lähtökohdaksi.
- **Solmumallit** — tallenna yksittäinen konfiguroitu solmu (esim. viritetty LLM-solmu tai mukautettu HTTP-solmu) käytettäväksi eri workflowissa.

Vaihda näiden välillä käyttämällä **Workflows / Nodes** -vaihtopainiketta välilehden yläosassa.

Käytä hakupalkkia suodattamaan näkyvissä olevia malleja nimen, kuvauksen, tägien tai solmutyypin perusteella.

---

## Mallin luominen

### Workflow-malli

1. Avaa workflow, jonka haluat jakaa, editorissa.
2. Napsauta **Share as Template** -painiketta ylätyökalurivillä.
3. Täytä nimi, kuvaus ja valinnaiset tägit.
4. Valitse näkyvyys: **Everyone** (kaikki käyttäjät) tai **Specific users** (anna käyttäjätunnukset ja/tai valitse tiimit).
5. Napsauta **Share**. Vihreä ilmoitus vahvistaa onnistumisen.

### Solmumalli

1. Napsauta hiiren kakkospainikella mitä tahansa solmua canvas-alueella.
2. Valitse **Share as Template** -valikosta.
3. Täytä lomake ja napsauta **Share**.

---

## Mallin käyttäminen

### Workflow-malli

1. Avaa **Mallit**-välilehti ja varmista, että **Workflows** on valittuna.
2. Napsauta korttia esikatsellaksesi sitä tai napsauta suoraan **Use** -painiketta.
3. Workflow kloonataan uudeksi workflowksi, joka avautuu editoriin.

### Solmumalli

1. Avaa **Mallit**-välilehti ja valitse **Nodes**.
2. Napsauta **Use** -painiketta solmumallikortilla.
3. Ilmaantuu valintaikkuna — valitse, mihin solmu lisätään:
   - **New workflow** — luo uuden workflown, joka sisältää vain tämän solmun.
   - **Existing workflow** — valitse workflowlistastasi; solmu lisätään automaattisesti editorin avautuessa.

---

## Esikatselu

Napsauta mitä tahansa mallikorttia avataksesi täyden esikatselun:

- **Korttien esikatselukuvat** — mallikortit näyttävät skaalatun vain luku -tilan canvas-näytteen sekä workflow- että yksittäissolmumalleille.
- **Workflow-mallit** — vain luku -tilan canvas, joka vastaa edit-history -esikatselutyyliä, mukaan lukien pan- ja zoom-toiminnot.
- **Solmumallit** — tallennettu solmu avautuu samalle vain luku -tilan canvas-alueelle yksittäisen solmun esikatseluna.
- **Solmun tiedot** — napsauta mitä tahansa solmua esikatselussa tarkastellaksesi sen tallennettuja asetuksia sivupaneelissa.
- Tägit, käyttökertoja ja **omistaja** näytetään kaikille malleille.

Paina **ESC** tai napsauta esikatselun ulkopuolelle sulkeaksesi sen.

---

## Mallien hallinta

- **Muokkaa** – Jos olet mallin omistaja, vie hiiri kortin päälle ja napsauta kynäkuvaketta päivittääksesi sen nimeä, kuvausta, tägejä tai näkyvyyttä.
- **Poista** – Jos olet mallin omistaja, vie hiiri kortin päälle ja poista malli vahvistuskyselyn jälkeen.
- **Vain omistajille** – Muokkaa- ja poista-painikkeet näytetään vain omistamillesi malleille.

---

## Komentovalikko (CTRL+K)

Mallit (sekä workflow- että solmumallit) ovat haettavissa **CTRL+K** -komentovalikosta. Valitse malli käyttääksesi sitä välittömästi — workflow-mallit avautuvat editoriin, solmumallit kysyvät kohdetta.

---

## Mallit Chatissa

Voit kysyä tekoälyltä kysymyksiä malleistasi — se tuntee kaikki työtilasi mallit.

---

## Näkyvyys

| Asetus | Kenen saatavilla |
|---|---|
| Everyone | Kaikki alustan käyttäjät |
| Specific users | Nimeämäsi käyttäjät ja/tai valitsemasi tiimit — kaikki tiimin jäsenet saavat käyttöoikeuden |

Kun jaat **Specific users** -asetuksella, voit lisätä sekä yksittäisiä käyttäjiä (nimellä) että tiimejä. Tiimin jäsenet näkevät mallin Mallit-välilehdellä ja voivat käyttää sitä.

---

## Aiheeseen liittyvät

- [Tiimit](../reference/teams.md) – Jaa malleja tiimien kanssa
- [Canvas-ominaisuudet](../reference/canvas-features.md)
- [Workflown rakenne](../reference/workflow-structure.md)
- [Solmutyypit](../reference/node-types.md)
- [Chat-välilehti](./chat-tab.md)
- [Kontekstuaalinen esittely](../reference/contextual-showcase.md) – Lyhyt opas hallintanäkymän välilehdille
