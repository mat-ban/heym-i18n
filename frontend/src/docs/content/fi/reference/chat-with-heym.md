# Keskustelu Heymin kanssa

Chat with Heym on sivustotietoinen avustaja, joka on saatavilla dokumentaatio-otsikosta. Se avautuu keskelle ruutua, antaa valita LLM-tunnistetiedot ja mallin, ja vastaa kysymyksiin käyttäen nykyistä dokumenttisivua ensisijaisena kontekstina.

## Dialogin avaaminen

1. Avaa mikä tahansa sivu polussa `/docs`
2. Klikkaa **Keskustele Heymin kanssa** otsikossa
3. Valitse [tunnistetiedot](../tabs/credentials-tab.md) ja malli
4. Esitä kysymys sivusta tai alustasta

Pienemmillä näytöillä käynnistin on vain kuvakkeena; suuremmilla näytöillä näkyy koko teksti.

## Käytetty konteksti

- Nykyisen dokumenttisivun polku lisätään pyyntöön kontekstiohjeistuksena
- Taustajärjestelmä käyttää edelleen olemassa olevaa kojelaudan chätin päätepistettä ja dokumenttihakutyökaluja
- Tilisi tasolla määritetyt [Käyttäjän säännöt](./user-settings.md) pysyvät voimassa, koska sama chätin taustajärjestelmä uudelleenkäytetään
- Valmisteluvaiheet virtaavat avustajankuplaansa reaaliajassa ennen lopullista vastausta, kuten kojelaudan chätissä
- Selvennyskysymykset näkyvät kortteina samoin kuin [Chat-välilehdessä](../tabs/chat-tab.md). Kun workflow-pyyntö vaatii tunnistetietoja, voit valita ne tai luoda ne kortista. Kun tarvitaan datataulukko, voit valita yhden omista taulukoistasi tai luoda uuden samalla tavalla.

Kun avaat dialogin tietyllä artikkelilla, pieni merkki näyttää aktiivisen dokumenttisivun polun, jotta voit varmistaa, mikä sivu on priorisoitu.

## Istunnon toiminta

- Tunnistetietojen ja mallin valinta pysyvät voimassa niin kauan kuin dialogi on auki
- Viestihistoria on vain istunnon aikainen ja tyhjennetään dialogin sulkeutuessa
- Taustan klikkaus, `Escape` ja sulje-painike nollaa istunnon
- **Lopeta** keskeyttää nykyisen virtaavan vastauksen
- Dialogi on tarkoituksella leveä ja kiinteän kokoinen; siinä ei ole kokonäytön vaihtoa

## Käyttökohteet

- Kysy jatkokysymyksiä lukiessasi solmua tai viitesivua
- Selvitä ominaisuuksien eroja poistumatta dokumenteista
- Etsi oikea artikkeli ennen editorin avaamista

Jos haluat rakentaa tai muokata workflowja suoraan, käytä editorin puolella olevaa [AI-avustajaa](./ai-assistant.md) sen sijaan.

## Liittyvät

- [AI-avustaja](./ai-assistant.md) – Editorin chätti workflowjen rakentamiseen
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää dialogissa käytettäviä LLM-tunnistetietoja
- [Asetukset](./user-settings.md) – Käyttäjän globaalit säännöt, joita sovelletaan AI-pinnoissa
- [Pika-aloitus](../getting-started/quick-start.md) – Ensimmäisen workflown läpikäynti
