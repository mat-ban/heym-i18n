# Notion

**Notion**-solmu hallinnoi tietokantoja, tietolähteitä, sivuja ja lohkoja Notion API:n kautta.

## Yleiskatsaus

| Ominaisuus | Arvo |
|-----------|------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tunnistetiedot | Sisäinen integraatiotoken tai Notion OAuth |
| API-versio | `2026-03-11` |

Notionin tietokantatyyliset kokoelmat käyttävät nykyisissä API-versioissa **tietolähdetunnisteita**. Jaa jokainen sivu tai tietolähde, jota workflow tarvitsee, integraation kanssa ennen solmun suorittamista. Resurssikentät hyväksyvät joko raakan Notion-tunnisteen tai täyden Notion-URL-osoitteen. URL-osoitteet normalisoidaan niihin upotettuun resurssitunnisteeseen ennen API-pyyntöä.

## Toiminnot

| Toiminto | Pakolliset kentät | Päätulos |
|---------|------------------|----------|
| Haku | Valinnainen haku/suodatus/lajittelu | `.results`, `.count`, `.next_cursor` |
| Hae sivu | Sivun tunniste | `.page` |
| Luo sivu | Tietolähteen tunniste tai vanhemman sivun tunniste, ominaisuudet | `.page`, `.id`, `.url` |
| Päivitä sivu | Sivun tunniste, yksi ominaisuuksista/kuvake/taustakuva | `.page` |
| Siirrä sivu roskakoriin | Sivun tunniste | `.page` |
| Palauta sivu | Sivun tunniste | `.page` |
| Luo tietokanta | Tietokantapyyntö, jossa `parent` | `.database`, `.id`, `.url` |
| Hae tietokanta | Tietokannan tunniste | `.database` |
| Päivitä tietokanta | Tietokannan tunniste, ei-tyhjä tietokantapyyntö | `.database`, `.id`, `.url` |
| Luo tietolähde | Tietolähdepyyntö, jossa `parent` ja ei-tyhjä `properties` | `.data_source`, `.id`, `.url` |
| Hae tietolähde | Tietolähde | `.data_source` |
| Päivitä tietolähde | Tietolähteen tunniste, ei-tyhjä tietolähdepyyntö | `.data_source`, `.id`, `.url` |
| Kysely tietolähteeseen | Tietolähteen tunniste | `.results`, `.count`, `.next_cursor` |
| Hae lohkon alisolmut | Lohkon tai sivun tunniste | `.results`, `.count`, `.next_cursor` |
| Päivitä lohko | Lohkon tunniste, lohkon päivitysobjekti | `.block` |
| Poista lohko | Lohkon tunniste | `.block` |
| Lisää lohkoja | Lohkon tai sivun tunniste, alisolmut | `.results`, `.count` |

Kaikki toiminnot palauttavat myös `.success` ja `.operation`.

## JSON-kentät

Tietokantapyyntö, Tietolähdepyyntö, Ominaisuudet, Alisolmut, Suodatin, Lajittelu, Lajittelut, Kuvake ja Taustakuva hyväksyvät Notion API:n JSON-muotoisen datan. JSON-merkkijonojen sisällä olevat lausekkeet ratkaistaan ennen pyyntöä. Kenttä voi olla myös itsenäinen lauseke, joka ratkaistaan suoraan vaadittuun objektiin tai taulukkoon, kuten `$input.database`, `$input.properties` tai `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Sivun tai lohkon sisällön osalta Alisolmut on taulukko Notionin lohko-objekteja:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## Tietokannat ja tietolähteet

Nykyisessä Notion API:ssa **tietokanta** on säiliö ja **tietolähde** sisältää ominaisuusskeeman ja kyseltävät rivit. Hae tietokanta -toiminto palauttaa tietokannan `data_sources` -listan; käytä jotakin näistä tunnisteista Hae tietolähde tai Kysely tietolähteeseen -toimintojen kanssa.

Luo tietokanta -toiminto hyväksyy täyden pyyntöobjektin Notionin Create a database -päätepisteestä. Sen on sisällettävä `parent` ja voi sisältää `title`, `description`, `is_inline`, `initial_data_source`, `icon` ja `cover`. Esimerkki:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Päivitä tietokanta -toiminto hyväksyy päivityspäätepisteen pyyntöobjektin, mukaan lukien `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` ja `is_locked`. Tietokannan tunnistekentät hyväksyvät raakan tunnisteen, täyden Notion-URL-osoitteen tai lausekkeen.

Käytä **Hae tietolähde** -toimintoa noutaaksesi tietolähteen `properties` -skeeman ennen sivun luontia ominaisuusobjektia. **Luo tietolähde** -toiminto edellyttää vanhemman tietokantaobjektin ja ei-tyhjän `properties` -skeeman. **Päivitä tietolähde** -toiminto hyväksyy ei-tyhjän pyyntöobjektin, jota vastaava Notion-päätepiste tukee.

Esimerkki tietolähteen luomisesta olemassa olevaan tietokantaan:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Tietolähde ja Vanhempi sivu -valitsimet tukevat palvelinpuolen hakua lyhyellä viiveellä ja kursoriin perustuvaa **Lataa lisää** -sivutusta. Käytä **Päivitä** -toimintoa, kun olet jakanut uuden resurssin Notionissa. Vaihda **Käytä lauseketta** -tilaan syöttääksesi lausekkeen, raakan tunnisteen tai URL-osoitteen.

Vanhemmissa opetusohjelmissa käytetyt hakusuodattimet, kuten
`{"property":"object","value":"database"}`, käännetään nykyiseen `data_source` -arvoon. Uusien workflowien tulisi käyttää suoraan `data_source` tai `page` -arvoja.

Lisää lohkoja -toiminto tukee **Alkuun**, **Loppuun** ja **Lohkon jälkeen** -sijoitteluja. Luo sivu ja Lisää lohkoja -toiminnot jakavat automaattisesti yli 100 ylimmän tason alisolmua järjestettyihin pyyntöihin Notionin pyyntökohtaista rajausta varten.

Nopeusrajoitetut pyynnöt (`429` tai `529`) yritetään enintään kolme kertaa. Heym noudattaa Notionin `Retry-After` -otsaketta, rajoittaa kunkin odotuksen 10 sekuntiin ja lisää satunnaista vaihtelua. Notion-pyynnöt jakavat prosessin laajuisen HTTP-yhteyden poolin sivujen ja workflow-solmujen välillä.
## Notion API -rajoitukset

- Yksittäinen rich-text `text.content` -arvo voi sisältää enintään 2 000 merkkiä. Jaa pidempi teksti useisiin rich-text -objekteihin.
- Notion rajoittaa ylätason lohkojen lasten määrän 100:aan per pyyntö. Heym käsittelee suurempia Children-taulukoita erissä, mutta jokaisen yksittäisen lohkon on täytettävä Notionin hyväksymä maksimikoko.
- API hyväksyy enintään kaksi sisäkkäistä lohkotasoa yhdessä pyynnössä. Luo syvemmät rakenteet seuraavilla Append Blocks -operaatioilla.
- Pyyntöjen kokonaiskoko on rajoitettu 1 000 lohkoelementtiin ja 500 KB:hen.

## Sivutus

Search-, Query Data Source- ja Get Block Children -operaatiot hyväksyvät sivukoon väliltä 1–100 sekä valinnaisen aloituskohdan (cursor). Aseta sivukooksi `0` seuraamaan kursoreita automaattisesti ja yhdistämään kaikki tulokset, enintään solmun 10 000 tuloksen turvarajaan.

## Tunnistetietojen määrittäminen

Valitse tunnistetietojen valintaikkunassa joko **Internal token** tai **OAuth**:

- **Internal token:** Luo sisäinen integraatio, kopioi sen token Heymiin ja jaa sitten jokainen tarvittava sivu tai tietolähde integraation kanssa. Käytä **Test Connection** -toimintoa käyttöoikeuksien vahvistamiseen.
- **OAuth:** Luo julkinen Notion-integraatio ja rekisteröi `{FRONTEND_URL}/api/credentials/notion/oauth/callback` Notioniin. Heymin tunnistetietojen valintaikkunassa valitse **OAuth**, syötä integraation Client ID ja Client Secret, ja napsauta **Connect** työtilan valtuuttamiseksi. Salaisuus tallennetaan salattuna tunnistetietoihin, eikä sitä siirretä OAuth-tilaan tai ympäristökonfiguraatioon. Valtuutuksen jälkeen tunnistetiedoissa näkyy yhdistetyn työtilan nimi (`connected (Workspace Name)`). Kesken olevat OAuth-tunnistetiedot näyttävät `Not connected`.

Jos jätät internal token -kentän tyhjäksi muokatessasi, tallennettu token säilyy ennallaan.

Mukautettuja [HTTP](../nodes/http-node.md) -pyyntöjä varten `$credentials.YourNotionCredential` ratkaisee samaan bearer-tokeniin, jota Notion-solmu käyttää (internal token tai OAuth access token).

## API-version huomioita

Heym lukitsee Notion-pyynnöt API-versioon `2026-03-11`. Tämä versio käyttää:

- `data_source_id` -vanhempia ja `/data_sources` -endpointteja vanhentuneiden tietokantakyselypolkujen sijaan
- `in_trash` -merkintää `archived` -sijaan sivujen roskakoriin siirtämisessä ja palauttamisessa
- `position` -objekteja (`start`, `end`, `after_block`) Append Block Children -operaatioissa

Vanhempien Notion-automaatioesimerkkien muuntamisessa:

- Korvaa tietokantaan viittaavat vanhemmat/kyselyt data source -ID:illä, jotka saat **Retrieve Database** -operaatiolla tai editorin tietolähdevalitsimesta
- Korvaa `archived: true` lauseke `in_trash: true` -lausekkeella
- Korvaa append `after` -parametrit solmun **Append Position** -kentällä

Hakutiedoissa käytettävät `database` -objektiarvot normalisoidaan automaattisesti muotoon `data_source`.

## Aiheeseen liittyvät

- [Tunnistetiedot](../reference/credentials.md)
- [Kolmannen osapuolen integraatiot](../reference/integrations.md)
- [Solmutyypit](../reference/node-types.md)
