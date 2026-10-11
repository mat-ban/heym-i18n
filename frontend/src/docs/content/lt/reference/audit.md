# Audito Žurnalas

Heym rašo audito eilutę kiekvienam saugumo aspektui svarbiam veiksmui: kas tai padarė, ką jie padarė ir ar tai pavyko. Eilutės siunčiamos į backend'o standartinį išvestį per `winston.audit` logger'į, kartu su užklausų prieigos žurnalu, ir gali būti skaitomos iš **Logs** skilties arba naudojant `docker logs`.

Audito žurnalas yra **visada įjungtas**. Nereikia nieko įjungti ir jokios aplinkos kintamosios nustatyti.

## Eilutės Formatavimas

Vienas veiksmas sukuria tik vieną savarankišką eilutę:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Kiekviena eilutė turi šiuos laukus:

| Laukas | Aprašymas |
|--------|-----------|
| `action` | Kas įvyko, kaip `resource.verb` — žr. žemiau esančią lentelę. |
| `outcome` | `success`, `failure` arba `denied`. |
| `actor_id` | Veiksmą atlikusio vartotojo UUID. Nebus, jei niekas nebuvo autentifikuotas. |
| `actor_email` | To vartotojo el. paštas. Nepavykus prisijungti, tai yra adresas, kuris buvo bandomas, o ne patvirtinta paskyra. |
| `target` | Objektas, kuriuo buvo veikiama, kaip `type:uuid`. |
| `target_name` | Žmogui skaitomas to objekto pavadinimas, cituojamas, kai jame yra tarpų. |

Veiksmams specifiniai laukai seka — pavyzdžiui, `credential_type`, `imported`, `grantee_email`, `team_name`. Vertės, turinčios tarpą, kabutę arba `=`, yra cituojamos; vertės, ilgesnės nei 256 simboliai, yra sutrumpinamos su `...(truncated)` žymekliu.

## Žurnalo Skaitymas

Audito logger'is yra užklausų logger'io vaikas, todėl abu pasiekia tą pačią srautą, tačiau išlieka atskiri:

```bash
# Tik audito eilutės, be prieigos žurnalo triukšmo
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Viskas, ką padarė vienas vartotojas
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Nepavykę prisijungimai ir atmetimai
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Viskas, kas liečia vieną kredencialą
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

Programoje **Logs** skiltis skaito tą pačią konteinerio išvestį. Ji yra ribojama pagal `DOCKER_LOGS_ENABLED` ir `DOCKER_LOGS_ALLOWED_EMAILS` leidimų sąrašą.

## Kas Yra Užfiksuota

Kiekvienas būsenos pokytis yra užfiksuotas. Skaitymai yra fiksuojami tik ten, kur skaitymas pats yra jautrus veiksmas — peržiūrint darbo eigos vykdymo istoriją, atidarant kredencialą, atsisiunčiant failą. Įprasti sąrašo ir detalių skaitymai nėra audituojami; prieigos žurnalas jau fiksuoja, kad užklausa įvyko, o audituoti kiekvieną `GET` užklausą užgožtų svarbias eilutes.

### Autentifikacija

| Veiksmas | Pastabos |
|----------|----------|
| `auth.register` | `outcome=denied`, kai registracija yra išjungta arba kai slaptažodžio prisijungimas yra išjungtas (`reason=password_login_disabled`), `failure`, kai el. paštas jau užimtas. |
| `auth.login` | `outcome=failure` fiksuoja bandytą adresą ir ar el. paštas buvo nežinomas, ar slaptažodis neteisingas. |
| `auth.logout` | Veikėjas nustatomas iš atnaujinimo slapuko, todėl atsijungimas be jo fiksuojamas be tapatybės. |
| `auth.token_refresh` | `outcome=denied` su `reason=refresh_token_replayed_or_revoked` — signalas apie slaptažodžio vagystę, dėl kurio verta įspėti. |
| `auth.password_change` | `outcome=failure`, kai dabartinis slaptažodis buvo neteisingas. |
| `auth.sso_login` | Vieno prisijungimo sistema. `outcome=failure` nurodo priežastį, kodėl tiekėjo atsakymas buvo atmestas; `denied` nurodo `email_not_verified`, `domain_not_allowed` arba `provisioning_disabled`. |
| `sso_settings.update` | Administratorius pakeitė [SSO](./sso.md) konfigūraciją. Fiksuojama `enabled` ir `password_login_disabled`, niekada neatskleidžiant kliento slaptažodžio. |
| `sso_settings.test` | Administratorius atliko SSO ryšio testą. |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` fiksuoja `owned=false`, kai bendradarbis skaito kito asmens vykdymo istoriją. `workflow.delete` fiksuoja `outcome=denied` su `reason=not_owner`, kai bendradarbis bando ištrinti.

### Kredencialai

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` yra audituojamas, nes kredencialo atidarymas jį dešifruoja. Nepavykimas fiksuoja `outcome=denied`, kas atrodo kaip kredencialo ID numeravimo bandymas.
### Kiti ištekliai

| Išteklius | Veiksmai |
|-----------|----------|
| Kintamieji | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektorių saugyklos | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Įspėjimai | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Duomenų lentelės | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Valdymo skydeliai | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Lentelės | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Diskas | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Komandos | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Katalogai | `folder.create` · `update` · `delete` · `workflow_move` |

Masiniai veiksmai registruojami vieną kartą per užklausą su skaičiumi, o ne kiekvienam eilutei. CSV importas su 5,000 eilučių sukuria vieną `data_table.import_csv` eilutę, kurioje yra `imported`, `rejected` ir `total`.

## Paslaptys Niekada Nereglamentuojamos

Audito eilutėse registruojami identifikatoriai, pavadinimai ir skaičiai. Niekada neregistruojama kredencialo turinio, kintamojo vertės, slaptažodžio ar ženklo.

Dvi dalys tai užtikrina. Kviečiamieji taškai rašomi taip, kad perduotų tik saugius laukus, o audito pagalbininkas redaguoja kaip atsarginę priemonę: bet kuris laukas, kurio pavadinime yra `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` ar panašiai, yra pakeičiamas į `***` prieš eilutės sudarymą. Perteklinis redagavimas yra sąmoningas — neinformatyvi eilutė yra geriau nei nutekinta kredencialas.

Kur paslaptis iš tiesų yra svarbi įrašui, registruojama tik jos forma. Failo bendrinimas registruoja `password_protected=true`, niekada slaptažodžio.

## Išlaikymas

**Audito eilutės gyvena tik tiek, kiek konteinerio žurnalo išvestis.** Jos nėra rašomos į duomenų bazę. Atkuriant backend konteinerį, jo žurnalai yra išmetami.

Jei reikia audito istorijos, kuri išliktų po perkrovimo, siųskite konteinerio stdout į kažkur patvarų — žurnalo tvarkyklę, šoninio rinkėjo kolektorių ar jūsų platformos žurnalo agregavimą — taip pat kaip ir bet kurį kitą konteinerio žurnalą.

## Prisidėjusiems

Audito eilutės išmetimas reikalauja vieno kvietimo:

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

Pagalbinis įrankis yra sinchroninis, nesusijęs su duomenų baze ir ignoruoja savo klaidas, todėl audito kvietimas negali nepavykti ar sulėtinti užklausos.

Trys taisyklės pridedant vieną:

1. **Pavadinkite veiksmą `resource.verb` mažosiomis raidėmis.** `backend/tests/test_audit_log.py` peržiūri kiekvieną `audit()` kvietimą po `app/api/` ir nesėkmingai užbaigia statybą, jei pavadinimas nesutampa, ir jei padengtas išteklius, kuris prarado visus savo kvietimo taškus.

2. **Skaitykite tik tuos atributus, kurie tikrai yra.** Pagalbinio įrankio `try/except` saugo savo kūną, o ne išraiškas, kurias perduodate — `AttributeError` `target_name=workflow.name` bus iškeltas kvietimo taške, prieš `audit()` vykdymą, ir sulaužys užklausą. Skaitykite ORM stulpelius ir vietinius kintamuosius, o ne pasirinktinius ar tingiai įkeltus atributus.

3. **Užregistruokite ištrynimą prieš ištrynimą.** Po `db.delete(row)` pavadinimas ir ID, kuriuos norite užregistruoti, gali būti prarasti. Įdėkite kvietimą virš jo.
