# Discord

**Discord**-solmu lähettää viestin Discord-kanavalle saapuvan Webhookin kautta. Sitä voidaan käyttää hälytyksiin, workflow-ilmoituksiin, bottimaisiin vastauksiin ja virheraportointiin.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | `discord`-tunnistetiedot, jotka sisältävät saapuvan webhookin URL-osoitteen |
| `message` | lauseke | Lähtevä viestiteksti. Tukee [lausekkeita](../reference/expression-dsl.md). |
| `username` | lauseke | Valinnainen näyttönimen korvaus tälle viestille |
| `avatarUrl` | lauseke | Valinnainen avatar-URL:n korvaus tälle viestille |

## Asennus

1. Luo [Discord Webhook -tunnistetiedot](../reference/integrations.md#discord)
2. Lisää **Discord**-solmu workflowiisi
3. Valitse tunnistetiedot
4. Aseta `message` lähteväksi tekstiksi tai ylävirran datasta rakennetuksi malliksi
5. Voit halutessasi korvata näyttönimen (`username`) ja avatar-URL:n (`avatarUrl`)

## Esimerkki

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow suoritettu: $input.text",
    "username": "Heym Botti",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Tulostekentät

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.status` | Discordin palauttama HTTP-tilakoodi, yleensä `204` onnistuessa |
| `$nodeLabel.response` | Discord-webhookin palauttama raaka vastausrunko |
| `$nodeLabel.message` | Heymin lähettämä viestiteksti |
| `$nodeLabel.username` | Webhookin mukana lähetetty käyttäjänimi, jos annettu |
| `$nodeLabel.avatar_url` | Webhookin mukana lähetetty avatar-URL, jos annettu |

## Yleiset käyttötavat

- Käytä sitä yhdessä [Discord Trigger](./discord-trigger-node.md) -solmun kanssa, kun haluat lisäkanavapostauksen vuorovaikutteisen vastauksen lisäksi
- Lähetä virheilmoituksia [Error Handler](./error-handler-node.md) -solmusta
- Lähetä [LLM](./llm-node.md) - tai [Agent](./agent-node.md) -solmujen generoimia yhteenvetoja

## Egress-turvallisuus

- Tunnistetiedoissa tallennettu webhook-URL-osoite on käytettävä muodossa `http://` tai `https://` ja sen on osoitettava vain julkisiin osoitteisiin. Silmukka-, yksityis-, linkkilokaali-, monilähetys- ja pilvimetatietokohteet estetään.
- Heym vahvistaa ratkaistut osoitteet ja kiinnittää yhteyden kohteen ennen lähetystä, joten DNS-vastaus ei voi siirtää pyyntöä sisäiseen osoitteeseen tarkistuksen jälkeen. Ympäristön välityspalvelimet poistetaan käytöstä, kun suojaus on aktiivinen, eikä uudelleenohjauksia seurata.
- Sisäisiin webhook-vastaanottajiin lähettävät käyttöönotot voivat asettaa `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` luotetussa itse isännöidyssä instanssissa. Säilytä oletusarvo isännöidyissä tai monivuokraajajärjestelmissä.

**Päivityshuomautus versiolle v0.0.109:** tämä tarkistus on uusi Discordille. Tunnistetiedot, joiden webhook-URL osoittaa silmukkaan tai yksityiseen osoitteeseen, hylätään, ellei yllä olevaa asetusta ole otettu käyttöön.

## Liittyvät

- [Discord Trigger](./discord-trigger-node.md) – Käynnistä workflow saapuvista Discord-vuorovaikutuksista
- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – Discord-tunnistetietojen asennus
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää ja hallinnoi `discord`-tunnistetietoja
- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
