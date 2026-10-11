# Aikataulut-välilehti

**Aikataulut**-välilehdellä näkyvät kaikki aktiiviset cron-workflowt visuaalisessa kalenterissa. Voit vaihtaa päivä-, viikko- ja kuukausinäkymien välillä nähdäksesi, milloin automaatiosi on ajastettu suoritettavaksi.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Katso Aikataulut-esittely</a></p>

## Näkymät

- **Päivä** – Tuntikohtainen aikajana valitulle päivälle; jokainen suoritus näkyy lohkona sen ajastetulla ajankohdalla
- **Viikko** – Seitsemän sarakkeen ruudukko kattaa nykyisen viikon; lohkot pinoutuvat, kun useat workflowt laukeavat samaan aikaan
- **Kuukausi** – Koko kuukauden ruudukko; jokainen solu listaa kyseiselle päivälle ajastetut workflowt

## Workflow-lohkot

Jokainen lohko näyttää:

- **Workflown nimi** – Klikkaa avataksesi workflow-canvasin suoraan
- **Cron-lauseke** – Näkyy hiiren ollessa päällä, esittää raaka-ajanmukaisen aikataulun (esim. `0 9 * * 1-5`)

## Navigointi

`HEYM_ADMIN_EMAILS`-listassa luetellut instanssin ylläpitäjät näkevät kaikkien omistajien aikataulut, kun **Näytä kaikki workflowt** on valittuna. Poista valinta nähdäksesi vain omat workflowt. Muilla käyttäjillä on edelleen käytössä **Näytä kanssani jaetut** -vaihtoehto. Työntekijän automaation poistamiseksi käytöstä voit käyttää [instanssin hallintakontrollia](./workflows-tab.md#instance-administration) Workflows-esikatselussa triggerien pysäyttämiseen tai jatkamiseen.

- Käytä **edellinen / seuraava** -nuolia siirtyäksesi päivien, viikkojen tai kuukausien välillä
- **Tänään**-painikkeella palaat heti nykyiseen päivämäärään

## Liittyvät

- [Cron-solmu](../nodes/cron-node.md) – Määritä ajastetut triggerit canvassilla
- [Workflowt-välilehti](./workflows-tab.md) – Hallitse ja järjestä kaikki workflowt
- [Analytiikka-välilehti](./analytics-tab.md) – Suoritusmittarit ja trendit
