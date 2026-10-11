# Pluginien kehittäminen

Heym-pluginit ovat luotettuja zip-paketteja, jotka järjestelmän ylläpitäjä asentaa. Paketti voi lisätä yhden tai useamman mukautetun toiminnon tai trigger-solmun ilman, että sovelluksen ydintoimintoja muutetaan.

## Paketin rakenne

Plugin-zip-tiedoston tulee sisältää `plugin.json` juurihakemistossa sekä Python-toteutustiedosto, jonka nimi määritellään `entry`-kentässä (oletuksena `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` on valinnainen ja toimii pluginin dokumentaatiosivuna. Oletussolmun kuvakkeena käytetään juurihakemistossa olevaa `icon.svg`-tiedostoa, tai solmukohtaista kuvaketta, joka määritellään `plugin.json`:ssa `icon`-polulla.

## Manifesti

Käytä monisolmuista `plugin.json`-tiedostoa, kun yksi paketti tarjoaa useita solmuja:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

Perinteiset yhden solmun manifestit ovat myös hyväksyttäviä: jätä `nodes`-kenttä pois ja määritä `kind`, `fields`, `dslHint` ja `docSlug` ylätasolla.

## Manifestin kentät

| Kenttä | Huomiot |
|-------|-------|
| `id` | Paketin tunniste pienillä kirjaimilla, numeroilla ja väliviivoilla. |
| `name` | Ihmisluettava paketin nimi. |
| `version` | Paketin versio, jota käytetään näyttöön ja handlerien välimuistitukseen. |
| `description` | Lyhyt kuvaus, joka näkyy käyttöliittymässä ja avustajan kontekstissa. |
| `entry` | Python-handlerin tiedostopolku zip-paketin sisällä; oletusarvo `handler.py`. |
| `dependencies` | Valinnaiset pip-riippuvuudet, jotka asennetaan `uv pip install` -komennolla. |
| `nodes` | Tämän paketin tarjoamat mukautetut solmut. |

Jokaisella solmulla tulee olla yksilöllinen `key`, `name` ja `kind`, joka on joko `action` tai `trigger`. Jos `function` jätetään pois, toiminnot kutsuvat `run`-funktiota ja triggerit `trigger`-funktiota.

Tuetut kenttätyypit ovat `string`, `number`, `boolean` ja `select`. Valintakentät käyttävät `options`-taulukkoa, joka sisältää `{ "label": "...", "value": "..." }` -objekteja. Määritä `required` pakollisille kentille ja `secret` salattaville syötteille. Manifesti hyväksyy myös `default`, `dynamic` ja `expression` -metatiedot kentille; nämä tallennetaan manifestiin, mutta plugin-solmut lukevat tällä hetkellä tallennetun solmun asetuksen suoritusaikana eivätkä täytä puuttuvia asetuksia oletusarvoista automaattisesti.

Ei-salattujen merkkijonokenttien syöttö käyttää lausekesyöttöliittymää. Suoritusaikana kaikki tallennetut merkkijonoarvot, jotka alkavat `$`-merkillä, selvitetään ennen handlerin kutsua.

## Handler-funktiot

Toimintohandlerit vastaanottavat workflow-syötteet, selvitetyn asetuksen ja pienen kontekstin:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Trigger-handlerit vastaanottavat selvitetyn asetuksen ja kontekstin:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Palauta sanakirja nimetyt tulokentät näkyville. Jos handler palauttaa toisen tyyppisen arvon, Heym käärii sen muotoon `{ "value": result }`.

## Asennus ja suoritus

Pluginit ovat oletusarvoisesti pois käytöstä. Ylläpitäjät ottavat ne käyttöön asettamalla `HEYM_PLUGINS_ENABLED=true` ja rajoittavat hallinnan `HEYM_PLUGIN_ADMIN_EMAILS` -osoitteisiin. Asennettujen pluginien tiedostot sijaitsevat `HEYM_PLUGINS_DIR` -hakemistossa, joka tulee liittää pysyvästi konttitehtäviin.

Plugin-koodi on luotettua, ylläpitäjän asentamaa Pythonia, joka suoritetaan samassa prosessissa taustajärjestelmän kanssa. Sillä on pääsy verkkoon ja asennettuihin kirjastoihin, joten asenna vain niitä paketteja, joiden suorittamiseen olet valmis samalla luottamuksella kuin Heym-järjestelmään itsessään.
