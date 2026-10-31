# Audit Logging

Heym kirjaa audit-rivin jokaisesta tietoturvallisesti merkittävästä toiminnasta: kuka sen teki, mihin se kohdistui ja onnistuiko se. Rivit kirjautuvat backendin standarditulostukseen `winston.audit` -lokin kautta, rinnakkain pyyntölokin kanssa, ja niitä voidaan lukea **Lokit**-välilehdeltä tai komennolla `docker logs`.

Audit-loki on **aina käytössä**. Ei ole mitään erillistä aktivointia eikä ympäristömuuttujaa, joka pitäisi asettaa.

## Rivin Muoto

Yksi toiminto tuottaa täsmälleen yhden itsenäisen rivin:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Jokainen rivi sisältää seuraavat kentät:

| Kenttä | Kuvaus |
|-------|-------------|
| `action` | Tapahtuma muodossa `resurssi.verbi` — katso alla oleva taulukko. |
| `outcome` | `success`, `failure` tai `denied`. |
| `actor_id` | Toiminnon suorittaneen käyttäjän UUID. Puuttuu vain, kun kukaan ei ole todentautunut. |
| `actor_email` | Kyseisen käyttäjän sähköpostiosoite. Epäonnistuneessa kirjautumisessa tämä on yrityksenä käytetty osoite, ei vahvistettu tili. |
| `target` | Kohteena ollut objekti muodossa `tyyppi:uuid`. |
| `target_name` | Kohteen ihmisen luettava nimi, lainausmerkeissä, jos se sisältää välilyöntejä. |

Toimintokohtaiset kentät seuraavat — esimerkiksi `credential_type`, `imported`, `grantee_email`, `team_name`. Arvot, jotka sisältävät välilyönnin, lainausmerkin tai `=`, lainataan; arvot, jotka ovat yli 256 merkkiä pitkiä, katkaistaan `...(truncated)` -merkinnällä.

## Lokin Lukeminen

Audit-loki on pyyntölokin aliloki, joten molemmat päätyvät samaan virtaan pysyen eroteltavissa:

```bash
# Vain audit-rivit, ilman pyyntölokin kohinaa
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Kaikki, mitä yksi käyttäjä teki
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Epäonnistuneet kirjautumiset ja evätyt pyynnöt
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Kaikki, mikä koski yhtä tunnistetietoa
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

Sovelluksen **Lokit**-välilehti lukee saman kontainerin tulostuksen. Se on suojattu `DOCKER_LOGS_ENABLED` - ja `DOCKER_LOGS_ALLOWED_EMAILS` -sallintalistalla.

## Mitä Kirjataan

Jokainen tilan muutos kirjataan. Lukutoiminnot kirjataan vain, jos lukeminen itsessään on arkaluonteinen toiminto — esimerkiksi workflown suoritushistorian tarkastelu, tunnistetiedon avaaminen tai tiedoston lataaminen. Tavalliset listaus- ja tietojenlukuoperaatiot eivät ole auditointikohteita; pyyntöloki kirjaa jo, että pyyntö tapahtui, ja jokaisen `GET`-pyynnön kirjaaminen hautaisi merkitykselliset rivit. Ainoa poikkeus ovat [sivukatselut](#page-views), jotka tallentavat, missä kirjautunut käyttäjä liikkui sovelluksessa.

### Todennus

| Toiminto | Huomiot |
|--------|-------|
| `auth.register` | `outcome=denied`, kun rekisteröinti on estetty tai salasanakirjautuminen pois käytöstä (`reason=password_login_disabled`), `failure`, kun sähköpostiosoite on jo käytössä. |
| `auth.login` | `outcome=failure` kirjaa yrityksenä käytetyn osoitteen ja oliko sähköpostiosoite tuntematon vai salasana väärin. |
| `auth.logout` | Toimija päätellään virkistyskeksistä, joten kirjautuminen ilman sellaista kirjataan ilman identiteettiä. |
| `auth.token_refresh` | `outcome=denied` syyllä `reason=refresh_token_replayed_or_revoked` — merkki tokenin varastamisesta, joka kannattaa hälyttää. |
| `auth.password_change` | `outcome=failure`, kun nykyinen salasana oli väärin. |
| `auth.sso_login` | Yksittäinen kirjautuminen (SSO). `outcome=failure` sisältää syyn, miksi palveluntarjoajan vastaus hylättiin; `denied` sisältää `email_not_verified`, `domain_not_allowed` tai `provisioning_disabled`. |
| `sso_settings.update` | Ylläpitäjä muutti [SSO](./sso.md) -asetuksia. Kirjaa `enabled` ja `password_login_disabled`, ei koskaan asiakassalaisuutta. |
| `sso_settings.test` | Ylläpitäjä suoritti SSO-yhteyden testin. |

### Sivukatselut

`page.view` kirjataan aina, kun kirjautunut käyttäjä avaa sivun verkkosovelluksessa, ja URL-polku tallennetaan `path`-kenttään:

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

Polku on sovelluksen sisäinen reitti. Koontinäytön välilehdet kuuluvat siihen (`/?tab=traces`), kuten myös avattua kohdetta nimeävät tunnisteet, kuten `/workflows/<id>`. Vain lyhyt luettelo sivun yksilöivistä kyselyparametreista säilytetään (`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`); kaikki muu kyselymerkkijonossa ja koko fragmentti hylätään. Sivut, joiden linkki sisältää salaisuuden, kuten `/review/<token>`, kirjataan paikkamerkillä `:token` salaisuuden sijasta.

Selain ilmoittaa polun, joten `page.view`-rivi näyttää, mihin käyttäjä ilmoitti siirtyneensä. Se ei todista, että palvelin palautti kyseisen sivun. Kirjautumissivulla käyntejä ja uloskirjautuneena avattuja linkkejä ei tallenneta, koska niihin ei liity käyttäjää.

### Workflowt

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.run` kirjataan, kun suoritus käynnistetään API:n kautta: editorin Suorita-painike, execute-päätepiste istunnon, API-avaimen tai webhookin avulla, chat-portaali ja MCP-työkalut. Se tallentaa kuka sen käynnisti, miten ja miten se päättyi:

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

`execution_id` yhdistää rivin suoritukseen Suoritushistoriassa. `outcome` on `failure`, kun suoritus päättyi tilaan `error`, `cancelled` tai `timeout`. Suoritus, joka on pysäytetty ihmisen tarkistusta varten tai jota pidetään samanaikaisuusjonossa, on `success`-rivi tilalla `status=pending` tai `status=queued`. Kutsulla, jossa ei ole kirjautunutta käyttäjää, kuten anonyymillä webhookilla tai portaalivierailijalla, ei ole `actor_id`- tai `actor_email`-tietoja. Syötteitä ja tulosteita ei koskaan kirjata.

Aikataulun, trigger-solmun, jonon tai tapahtuman käynnistämät suoritukset eivät muodosta auditrivejä. Ne suoritetaan instanssissa, joka otti ne vastaan, ja ne tallennetaan Suoritushistoriaan trigger-lähteensä ja suorittaneen instanssin kera.

`workflow.history_view` kirjataan, kun joku avaa työnkulun suoritushistorian. Pieni kysely, joka näyttää työnkulun viimeisimmän suorituksen kankaalla tai luettelossa, ei muodosta tarkastuslokia.


`workflow.history_view` kirjaa `owned=false`, kun yhteistyökumppani lukee jonkun muun suoritushistorian. `workflow.delete` kirjaa `outcome=denied` syyllä `reason=not_owner`, kun yhteistyökumppani yrittää poistaa.

### Tunnistetiedot

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` kirjataan, koska tunnistetiedon avaaminen purkaa sen salauksen. Epäonnistunut yritys kirjataan `outcome=denied`, mikä näyttää tunnistetiedon ID:n luettelointiyritykseltä.
### Muut resurssit

| Resurssi | Toiminnot |
|----------|---------|
| Muuttujat | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektorivarastot | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Hälytykset | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Datataulukot | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboardit | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Taulut | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Tiimit | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Kansiot | `folder.create` · `update` · `delete` · `workflow_move` |

Massatoiminnot kirjataan kerran pyyntöä kohden määrätietoina, ei rivi kerrallaan. CSV-tuonti, joka sisältää 5 000 riviä, tuottaa yhden `data_table.import_csv` -rivin, jossa on tiedot `imported`, `rejected` ja `total`.

## Salaisuuksia ei koskaan kirjata

Tarkistusrivi tallentaa tunnisteet, nimet ja määrät. Se ei koskaan tallenna tunnistetietojen sisältöä, muuttujan arvoa, salasanaa tai tokenia.

Tämän varmistavat kaksi asiaa. Kutsukohdat on kirjoitettu välittämään vain turvallisia kenttiä, ja tarkistusapuohjelma suodattaa tiedot viimeisenä varmistuksena: mikä tahansa kenttä, jonka nimi sisältää `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` tai vastaavan, korvataan merkkijonolla `***` ennen rivin muodostamista. Liiallinen suodatus on tarkoituksellista - hyödytön rivi on parempi kuin vuotanut tunnistetieto.

Jos salaisuus on aidosti merkityksellinen tietueelle, kirjataan vain sen muoto. Tiedostonjako tallentaa `password_protected=true`, ei koskaan salasanaa.

## Heym Work

Kun suoritat Heym Workia Heymin rinnalla, Work lähettää auditrivit oman konttinsa stdout-virtaan samassa Winston-muodossa:

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Work kirjaa käyttäjien toimet sivuilla, tauluilla ja tietueissa:

| Toiminto | Merkitys |
|---|---|
| `page.create`, `page.update`, `page.delete` | Muutokset koontinäytön sivuihin ja asetteluihin |
| `board.column_create`, `board.column_move`, `board.column_delete` | Kanban-sarakkeiden asettelumuutokset |
| `card.create`, `card.move`, `card.archive`, `card.delete` | Korttien elinkaaritapahtumat |
| `record.create`, `record.update`, `record.delete` | Datataulukkotietueiden muutokset Workin kautta |
| `chat.message` | Käyttäjän kehote lähetetty Work-avustajalle |
| `export.csv`, `export.json` | Dataviennit |

Jokaisella rivillä on samat kentät `actor_id`, `actor_email`, `timestamp` ja `outcome` kuin Heymin auditriveillä, joten lokien kerääjät voivat jäsentää molemmat yhdellä liukuhihnalla.

## Säilytys

**Tarkistusrivit säilyvät vain niin kauan kuin säiliön lokituloste.** Niitä ei kirjata tietokantaan. Säiliön uudelleenluominen hylkää sen lokit.

Jos tarvitset tarkistushistorian, joka säilyy uudelleenkäynnistyksissä, ohjaa säiliön stdout kestävään sijaintiin - lokiohjaimelle, sivuttaiskerääjälle tai alustan lokien kerääntymisjärjestelmälle - samalla tavalla kuin minkä tahansa muun säiliölokin kohdalla.

## Avustajille

Tarkistusrivin luominen vaatii yhden kutsun:

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

Apufunktio on synkroninen, ei käytä tietokantaa ja nielee omat virheensä, joten tarkistuskutsu ei voi epäonnistua tai hidastaa pyyntöä.

Kolme sääntöä lisättäessä:

1. **Nimeä toiminto muodossa `resource.verb` snake_case-muodossa.** `backend/tests/test_audit_log.py` käy läpi jokaisen `audit()`-kutsun hakemistossa `app/api/` ja keskeyttää käännöksen, jos nimi ei vastaa odotettua tai jos kattavuus on kadonnut.

2. **Lue vain varmasti olemassa olevia attribuutteja.** Apufunktion `try/except` suojaa vain sen omaa runkoa, ei sille välitettyjä lausekkeita - `AttributeError` kohdassa `target_name=workflow.name` nostetaan kutsukohdassa ennen `audit()`:n suoritusta ja keskeyttää pyynnön. Lue ORM-sarakkeita ja paikallisia muuttujia, ei valinnaisia tai laisesti ladattavia attribuutteja.

3. **Kirjaa poisto ennen poistoa.** Kun `db.delete(row)` on suoritettu, nimi ja tunniste, jotka halusit tallentaa, saattavat olla poissa. Sijoita kutsu sen yläpuolelle.
