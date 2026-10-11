# Globaalit muuttujat

**Globaali muuttujavarasto** sisältää pysyviä, käyttäjäkohtaisia avain-arvo -pareja, jotka säilyvät workflow-suoritusten yli. Käytä sitä määrityksiin, ominaisuuslippuihin, laskureihin tai jaetun tilan hallintaan, jota useat workflowt tarvitsevat.

> **Älä tallenna salaisuuksia tänne.** Globaalit muuttujat eivät ole salaisuuksien säilytyspaikka: arvot tallennetaan salaamattomina, ne palautetaan kokonaisuudessaan kaikille, joiden kanssa ne jaetaan, ja yhteistyökumppanit voivat muokata niitä. API-avaimet, salasanat ja tunnukset kuuluvat [Tunnistetietoihin](./credentials.md), joka salaa ne levylle eikä koskaan palauta salaisuutta asiakkaalle.

## Paikalliset vs. globaalit

| Varasto | Syntaksi | Näkyvyys | Pysyvyys |
|---------|----------|----------|----------|
| **Workflow-lokaalit** | `$vars.muuttujanNimi` | Vain nykyiselle suoritukselle | Muistissa, häviää suorituksen päätyttyä |
| **Globaalit** | `$global.muuttujanNimi` | Kaikille käyttäjän workflowille | Pysyvä tietokannassa |

## Globaalien muuttujien luominen

1. **Muuttujat-välilehdeltä** – [Muuttujat-välilehti](../tabs/global-variables-tab.md): Luo, muokkaa ja poista muuttujia suoraan.
2. **Muuttujasolmusta** – Ota käyttöön **Tallenna globaaliin muuttujavarastoon** (`isGlobal: true`) solmun ominaisuuksissa. Muuttuja kirjoitetaan varastoon workflown suorituksen yhteydessä.

## Käyttö lausekkeissa

Käytä globaaleja muuttujia syntaksilla `$global.muuttujanNimi`:

```
$global.ympäristö
$global.asetukset.baseUrl
$global.käyttäjäId
```

Käytä samoja metodeja kuin workflow-lokaaleissa muuttujissa (esim. `.upper()`, `.length`, `.add()` taulukoille).

## Arvotyypit

Tuetut tyypit: `string`, `number`, `boolean`, `array`, `object`. Valitse tyyppi muuttujan luonnissa tai muokkauksessa.

## Globaalien muuttujien jakaminen

Globaaleja muuttujia voidaan jakaa muiden käyttäjien tai [Tiimien](./teams.md) kanssa, jotta he voivat käyttää niitä omissa workflowissaan.

- **Jaa käyttäjän kanssa** – Klikkaa jaettavan muuttujan vieressä olevaa jakamiskuvaketta, syötä vastaanottajan sähköposti ja klikkaa **Jaa**. Vastaanottaja näkee muuttujan globaalien muuttujiensa listassa **Jaettu** -merkillä ja "Jaettu käyttäjältä &lt;sähköpostisi&gt;" -tekstillä.
- **Jaa tiimin kanssa** – Jakodialogissa valitse tiimi ja klikkaa **Lisää**. Kaikki tiimin jäsenet saavat käyttöoikeuden.
- **Muokattava käyttöoikeus** – Vastaanottajat voivat tarkastella, muokata ja viitata jaettuun muuttujaan `$global.muuttujanNimi` -syntaksilla workflowissaan. Vain omistaja voi jakaa, poistaa jakamisen tai poistaa muuttujan.
- **Nimikonfliktit** – Jos vastaanottajalla on jo samanniminen muuttuja, hänen oma muuttujansa saa etusijan jaetun muuttujan edelle.
- **Jakamisen poistaminen** – Avaa muuttujan jakodialogi ja klikkaa **×** -painiketta käyttäjän kohdalta, jonka käyttöoikeus haluat poistaa.

## Chat-integraatio

Globaalit muuttujat ovat saatavilla [Keskustelu](../tabs/chat-tab.md) -avustajalle. LLM voi viitata niihin vastatessaan kysymyksiin tai luodessaan sisältöä.

## Liittyvät aiheet

- [Muuttujat-välilehti](../tabs/global-variables-tab.md) – Globaalien muuttujien hallinta käyttöliittymässä
- [Muuttujasolmu](../nodes/variable-node.md) – Aseta muuttujia `isGlobal` -asetuksella
- [Lauseke-DSL](./expression-dsl.md) – `$global` -syntaksi
