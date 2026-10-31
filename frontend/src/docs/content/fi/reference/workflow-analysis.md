# Workflow-analyysi

**Workflow-analyysi** on vasemmalla puolella sijaitseva paneeli, joka sisältää yhden jaetun, muokattavan Markdown-dokumentin per workflow. Käytä sitä workflown toiminnan selittämiseen ja parannusideoihin tallentamiseen – voit myös antaa tekoälyn luoda ensimmäisen luonnoksen puolestasi.

Dokumentti on jaettu: kaikki, joilla on pääsy workflowhun, voivat lukea ja muokata sitä. Se tallennetaan workflown yhteyteen ja poistetaan automaattisesti, kun workflow poistetaan.

## Paneelin avaaminen

1. Avaa workflow editorissa.
2. Klikkaa **Analyze** (kimallekuvake) editorin työkalurivillä.
3. Paneeli avautuu vasemmalle. Solmupaletti (vasen paneeli) sulkeutuu analyysipaneelin ollessa auki; solmupaletin uudelleenavaaminen sulkee analyysipaneelin.

Paneeli on saatavilla vain tallennetuille workflowille. Uuden, tallentamattoman workflown kohdalla tallenna se ensin.

## Dokumentti

Paneeli näyttää yhden Markdown-dokumentin, jossa on kaksi näkymää. Näkymien välillä vaihdetaan **Edit** (kynä) ja **Preview** (silmä) -painikkeilla:

| Näkymä | Tarkoitus |
|--------|-----------|
| **Edit** | Pelkkä Markdown-editori (tekstialue). |
| **Preview** | Renderöity Markdown. |

Otsikkorivillä näkyy, **kuka viimeksi muokkasi** dokumenttia ja milloin.

### Tallennus

Klikkaa **Save** tallentaaksesi muutokset. Tallennuspainike on aktiivinen vain, kun on tallentamattomia muutoksia.

Koska dokumentti on jaettu, tallennuksessa käytetään optimistista samanaikaistamista:

- Jos joku muu on tallentanut uudemman version sen jälkeen, kun avasit paneelin, tallennuksesi hylätään ja varoitus ilmoittaa, kuka toinen muokkaaja oli.
- Voit tällöin valita **Reload (discard mine)** ottaaaksesi palvelimen version, tai **Overwrite** pakottaaksesi tallennuksen omalla versiollasi.

## Tekoälyanalyysi

Valitse LLM-**Credential** ja **Model** paneelin yläosassa (malliluettelo latautuu valitun tunnistetiedon perusteella – katso [Credentials](../tabs/credentials-tab.md)). Suorita sitten analyysi:

- **Analyze my workflow** – näkyy, kun dokumentti on tyhjä. Se lähettää tekoälyn luoman Markdown-raportin suoraan editoriin tallentamattomana luonnoksena. Tarkista ja muokkaa sitä, ja klikkaa sitten **Save**.
- **Reanalyze** – näkyy, kun dokumentissa on jo sisältöä. Se lähettää uuden raportin erilliseen **preview**-näkymään jättäen nykyisen dokumentin koskemattomaksi. Valitse **Accept** korvataksesi editorin sisältö uudella analyysillä, tai **Discard** säilyttääksesi nykyisen sisällön.

Molemmat toiminnot **suorittavat workflown ensin** (kun se on kelvollinen ja suoritettavissa) ja sisällyttävät suoritustulokset analyysipyyntöön, joten raportti heijastaa workflown todellista käyttäytymistä. Jos workflowa ei voi suorittaa, analyysi etenee sen staattisen rakenteen perusteella.

Luotu raportti kattaa kolme osaa järjestyksessä: **Improvement areas** (konkreettiset parannusehdotukset, mukaan lukien **security**-näkökulma aina, kun workflow käsittelee tunnistetietoja, käyttäjän syötettä, ulkoisia pyyntöjä tai tietojen paljastumista), workflown **Purpose**, ja **What it does** (askel-askeleelta kävely workflown solmujen läpi).

**Improvement areas** -osio suorittaa aina neljä erillistä tarkistusta:

1. **Error coverage** – jos canvaksella ei ole [Error Handler](../nodes/error-handler-node.md) -solmua eikä virheworkflowa ole määritetty, raportti huomauttaa tästä ja suosittelee virheenkäsittelyn lisäämistä.
2. **Time saved** – jos suorituskohtaista arvioitua säästettyä aikaa ei ole asetettu, raportti suosittelee sen määrittämistä, jotta [Analytics](../tabs/analytics-tab.md) -välilehden **Time Saved** -mittari voidaan täyttää.
3. **Network nodes** – solmille, jotka tekevät verkkopyyntöjä (kuten [HTTP](../nodes/http-node.md) ja integraatiosolmut), raportti suosittelee solmukohtaista virheenkäsittelyä (yritä uudelleen ja/tai jatka virheestä) näille solmuille.
4. **Alerts** – kun workflowlle ei ole määritetty [hälytyksiä](../tabs/alerts-tab.md), raportti suosittelee hälytysten määrittämistä ennen tuotantoon vientiä.

5. **Evals**: kun workflowssa on [Agent](../nodes/agent-node.md)-solmu ilman agenttisarjaa, raportti suosittelee **Agent Suite** (tai **Prompt Suite**) -sarjaa kohdassa [Evals](../tabs/evals-tab.md#agent-suites); kun siinä on [LLM](../nodes/llm-node.md)-solmu, se suosittelee **Prompt Suite** -sarjaa promptin testaamiseksi eri mallien välillä.

### Analyysin suorittaminen ominaisuuksista

Kun workflowssa on solmuja canvaksella mutta analyysidokumenttia ei vielä ole, **Run Analyzer** -painike näkyy workflow-tason [Properties](./canvas-features.md) -paneelissa (näkyy, kun mitään solmua ei ole valittuna). Se avaa tämän Workflow Analysis -paneelin, jossa voit valita tunnistetiedon ja mallin ja luoda raportin.

Jokainen analyysisuoritus tallennetaan [Traces](../tabs/traces-tab.md) -välilehteen **Workflow Analysis** -lähteen alle.

Jos LLM-tunnistetietoa ei ole määritetty, Analyze-painike on pois käytöstä – lisää sellainen [Credentials Tab](../tabs/credentials-tab.md) -välilehdessä.

## Liittyvät ominaisuudet

- [AI Assistant](./ai-assistant.md) – luo tai muokkaa workflown solmuja luonnollisella kielellä.
- [Sticky Note](../nodes/sticky-note-node.md) – lyhyitä muistiinpanoja, jotka kiinnitetään suoraan canvakselle.
