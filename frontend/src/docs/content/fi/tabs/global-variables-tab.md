# Muuttujat-välilehti

**Muuttujat**-välilehdellä hallitaan **Globaalia muuttujavarastoa** – pysyviä avain-arvo -pareja, joita jaetaan kaikkien workflowien kesken.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Katso Muuttujat-esittely</a></p>

## Yleiskatsaus

- Luo, muokkaa ja poista globaaleja muuttujia
- Muuttujat ovat käyttäjäkohtaisia ja säilyvät workflow-suoritusten yli
- Viittaa muuttujiin lausekkeissa muodossa `$global.muuttujanNimi`

## Muuttujan luominen

1. Valitse **Uusi muuttuja**
2. Anna **nimi** (käytetään lausekkeissa)
3. Aseta **arvo** (merkkijono, numero, totuusarvo, taulukko tai objekti)
4. Valitse **arvotyyppi** (Automaattinen, Merkkijono, Numero, Totuusarvo, Taulukko, Objekti)

## Muokkaaminen ja poistaminen

- **Muokkaa** – Klikkaa muuttujarivin muokkauskuvaketta
- **Poista** – Klikkaa roskakuvaketta; käytössä olevat muuttujat vaativat korvaavan arvon
- **Massapoisto** – Valitse useita muuttujia ja käytä **Poista valitut**

## Käyttö workfloweissa

Viittaa muuttujiin missä tahansa lausekkeessa:

```
$global.ymparisto
$global.asetukset.perusUrl
```

Globaaleja muuttujia voi asettaa myös [Muuttujasolmusta](../nodes/variable-node.md) ottamalla käyttöön **Tallenna globaaliin muuttujavarastoon**.

## Aiheeseen liittyvää

- [Globaalit muuttujat](../reference/global-variables.md) – Viiteopas
- [Muuttujasolmu](../nodes/variable-node.md) – Aseta muuttujia `isGlobal`-asetuksella
- [Expression DSL](../reference/expression-dsl.md) – `$global`-syntaksi
- [Keskustelu-välilehti](./chat-tab.md) – Keskustelussa pääsee käsiksi globaaleihin muuttujiin
- [Kontekstuaalinen esittely](../reference/contextual-showcase.md) – Tiivis sivuopas kojetaulupinnoille
