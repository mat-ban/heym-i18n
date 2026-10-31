# Evidencija Revizije

Heym zapisuje revizijsku liniju za svaku sigurnosno relevantnu radnju: tko ju je izvršio, što je učinjeno i je li uspjelo. Linije se šalju na standardni izlaz backend-a putem `winston.audit` logger-a, zajedno s logom pristupa zahtjevima, a mogu se čitati s **Logs** kartice ili pomoću `docker logs`.

Evidencija revizije je **uvijek uključena**. Nema potrebe za aktivacijom niti postavljanjem varijable okruženja.

## Format Linije

Jedna radnja proizvodi točno jednu samostalnu liniju:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Svaka linija nosi sljedeća polja:

| Polje | Opis |
|-------|-------------|
| `action` | Što se dogodilo, kao `resource.verb` — pogledajte tablicu u nastavku. |
| `outcome` | `success`, `failure` ili `denied`. |
| `actor_id` | UUID korisnika koji je izvršio radnju. Odsutan je samo kada nitko nije bio autentificiran. |
| `actor_email` | Email tog korisnika. U slučaju neuspjele prijave, to je adresa koja je pokušana, a ne potvrđeni račun. |
| `target` | Objekt na kojem je izvršena radnja, kao `type:uuid`. |
| `target_name` | Ime tog objekta koje je lako čitljivo, citirano kada sadrži razmake. |

Polja specifična za radnju slijede — na primjer `credential_type`, `imported`, `grantee_email`, `team_name`. Vrijednosti koje sadrže razmak, navodnik ili `=` su citirane; vrijednosti duže od 256 znakova su skraćene s oznakom `...(truncated)`.

## Čitanje Loga

Revizijski logger je dijete logger-a zahtjeva, tako da oba dosežu isti tok dok ostaju odvojena:

```bash
# Samo revizijske linije, bez buke loga pristupa
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Sve što je jedan korisnik učinio
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Neuspjele prijave i odbijeni pristupi
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Sve što je dodirnulo jednu vjerodajnicu
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

U aplikaciji, **Logs** kartica čita isti izlaz iz kontejnera. Pristup je ograničen s `DOCKER_LOGS_ENABLED` i `DOCKER_LOGS_ALLOWED_EMAILS` dopuštenom listom.

## Što Se Evidentira

Svaka promjena stanja se evidentira. Čitanja se evidentiraju samo kada je čitanje samo po sebi osjetljiva radnja — pregled povijesti izvršavanja workflow-a, otvaranje vjerodajnice, preuzimanje datoteke. Obična čitanja popisa i detalja nisu evidentirana; log pristupa već bilježi da se zahtjev dogodio, a evidentiranje svakog `GET`-a bi zakopalo linije koje su važne. Jedina iznimka su [pregledi stranica](#page-views), koji bilježe kamo je prijavljeni korisnik navigirao u aplikaciji.

### Autentifikacija

| Radnja | Napomene |
|--------|-------|
| `auth.register` | `outcome=denied` kada je registracija onemogućena ili kada je prijava putem lozinke isključena (`reason=password_login_disabled`), `failure` kada je email već zauzet. |
| `auth.login` | `outcome=failure` bilježi pokušanu adresu i je li email bio nepoznat ili je lozinka bila pogrešna. |
| `auth.logout` | Akter se određuje iz osvježavajuće kolačića, tako da se odjava bez njega evidentira bez identiteta. |
| `auth.token_refresh` | `outcome=denied` s `reason=refresh_token_replayed_or_revoked` — signal krađe tokena koji vrijedi za upozorenje. |
| `auth.password_change` | `outcome=failure` kada je trenutna lozinka bila pogrešna. |
| `auth.sso_login` | Jedinstvena prijava. `outcome=failure` nosi razlog zbog kojeg je odgovor davatelja odbijen; `denied` nosi `email_not_verified`, `domain_not_allowed` ili `provisioning_disabled`. |
| `sso_settings.update` | Administrator je promijenio [SSO](./sso.md) konfiguraciju. Bilježi `enabled` i `password_login_disabled`, nikada klijentsku tajnu. |
| `sso_settings.test` | Administrator je izvršio test veze SSO-a. |

### Pregledi stranica

Zapis `page.view` se zapisuje svaki put kada prijavljeni korisnik otvori stranicu u web aplikaciji, s URL putanjom u polju `path`:

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

Putanja je interna ruta aplikacije. Kartice nadzorne ploče dio su nje (`/?tab=traces`), kao i identifikatori koji imenuju ono što je otvoreno, poput `/workflows/<id>`. Zadržava se samo kratki popis parametara upita koji identificiraju stranicu (`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`); sve ostalo u nizu upita i cijeli fragment se odbacuju. Stranice čija poveznica nosi tajnu, poput `/review/<token>`, bilježe se s rezerviranim mjestom `:token` umjesto tajne.

Preglednik javlja putanju, tako da redak `page.view` prikazuje kamo je korisnik izjavio da je otišao. To ne dokazuje da je poslužitelj vratio tu stranicu. Posjeti stranici za prijavu i poveznicama otvorenim u odjavljenom stanju se ne bilježe jer uz njih nije vezan niti jedan korisnik.

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.run` se zapisuje kada se pokrene izvođenje putem API-ja: gumb Pokreni u uređivaču, krajnja točka execute sa sesijom, API ključem ili webhookom, portal za razgovor i MCP alati. Bilježi tko ga je pokrenuo, kako i s kojim ishodom je završilo:

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

`execution_id` povezuje redak s izvođenjem u Povijesti izvođenja. `outcome` je `failure` kada je izvođenje završilo s `error`, `cancelled` ili `timeout`. Izvođenje zaustavljeno radi ljudskog pregleda ili zadržano u redu čekanja za konkurentnost je redak `success` sa statusom `status=pending` ili `status=queued`. Poziv bez prijavljenog korisnika, poput anonimnog webhooka ili posjetitelja portala, nema `actor_id` niti `actor_email`. Ulazi i izlazi se nikada ne zapisuju.

Izvođenja pokrenuta rasporedom, čvorom triggera, redom čekanja ili događajem nisu revizijski redci. Ona se izvršavaju na instanci koja ih je preuzela i bilježe se u Povijesti izvođenja sa svojim izvorom triggera i instancom koja ih je pokrenula.

`workflow.history_view` se zapisuje kada netko otvori povijest izvođenja workflowa. Kratki pregled koji prikazuje najnovije izvođenje workflowa na platnu ili na popisu ne podliježe reviziji.


`workflow.history_view` bilježi `owned=false` kada suradnik pregleda povijest izvršavanja nekoga drugoga. `workflow.delete` bilježi `outcome=denied` s `reason=not_owner` kada suradnik pokuša obrisati.

### Vjerodajnice

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` se evidentira jer otvaranje vjerodajnice dekriptira. Propušteni pokušaj bilježi `outcome=denied`, što izgleda kao pokušaj enumeracije ID-a vjerodajnice.
### Ostali resursi

| Resurs | Akcije |
|--------|--------|
| Varijable | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektorska spremišta | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Upozorenja | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Tablica podataka | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Nadzorne ploče | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Odbori | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Pogon | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Timovi | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Mape | `folder.create` · `update` · `delete` · `workflow_move` |

Operacije u velikim količinama bilježe se jednom po zahtjevu s brojem, a ne jednom po redu. Uvoz CSV-a od 5,000 redaka proizvodi jedan `data_table.import_csv` redak koji nosi `imported`, `rejected` i `total`.

## Tajne Nikada Nisu Bilježene

Linija revizije bilježi identifikatore, imena i brojeve. Nikada ne bilježi sadržaj vjerodajnica, vrijednost varijable, lozinku ili token.

Dva su faktora koja to osiguravaju. Mjesta poziva su napisana da proslijede samo sigurna polja, a pomoćnik za reviziju redigira kao zaštitu: bilo koje polje čije ime sadrži `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` ili slično zamjenjuje se s `***` prije nego što se linija izgradi. Prekomjerna redakcija je namjerna — neodgovarajuća linija je bolja od propuštene vjerodajnice.

Gdje je tajna zaista relevantna za zapis, bilježi se samo njezin oblik. Dijeljenje datoteka bilježi `password_protected=true`, nikada lozinku.

## Heym Work

Kada pokrećete Heym Work zajedno s Heymom, Work emitira revizijske retke na stdout vlastitog kontejnera u istom Winston formatu:

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Work bilježi radnje korisnika na stranicama, pločama i zapisima:

| Radnja | Značenje |
|---|---|
| `page.create`, `page.update`, `page.delete` | Promjene na stranicama i izgledima nadzorne ploče |
| `board.column_create`, `board.column_move`, `board.column_delete` | Promjene izgleda Kanban stupaca |
| `card.create`, `card.move`, `card.archive`, `card.delete` | Događaji životnog ciklusa kartica |
| `record.create`, `record.update`, `record.delete` | Mutacije zapisa tablice podataka putem Worka |
| `chat.message` | Korisnički prompt poslan Work asistentu |
| `export.csv`, `export.json` | Izvozi podataka |

Svaki redak nosi ista polja `actor_id`, `actor_email`, `timestamp` i `outcome` kao i revizijski redci Heyma, tako da sakupljači zapisa mogu analizirati oboje putem jednog cjevovoda.

## Zadržavanje

**Linije revizije žive samo onoliko dugo koliko i izlaz loga kontejnera.** Ne pišu se u bazu podataka. Ponovno stvaranje pozadinskog kontejnera odbacuje njegove logove.

Ako trebate povijest revizije koja preživljava ponovno implementiranje, pošaljite stdout kontejnera negdje trajno — vozaču logova, kolektoru u bočnoj kutiji ili agregaciji logova Vaše platforme — na isti način kao što biste to učinili za bilo koji drugi log kontejnera.

## Za Suradnike

Emitiranje linije revizije zahtijeva jedan poziv:

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

Pomoćnik je sinkroniziran, ne dodiruje bazu podataka i apsorbira vlastite pogreške, tako da poziv revizije ne može propasti ili usporiti zahtjev.

Tri pravila prilikom dodavanja jednog:

1. **Nazovite akciju `resource.verb` u snake_case.** `backend/tests/test_audit_log.py` prolazi kroz svaki `audit()` poziv pod `app/api/` i ne uspijeva izgradnju na ime koje se ne podudara, i na pokriveni resurs koji je izgubio sve svoje pozive.

2. **Čitajte samo atribute koji su sigurno prisutni.** Pomoćnikov `try/except` štiti vlastito tijelo, a ne izraze koje mu proslijedite — `AttributeError` u `target_name=workflow.name` javlja se na mjestu poziva, prije nego što `audit()` izvrši, i prekinut će zahtjev. Čitajte ORM stupce i lokalne varijable, a ne opcionalne ili kasno učitane atribute.

3. **Bilježite brisanje prije brisanja.** Nakon `db.delete(row)` ime i id koje želite zabilježiti mogu nestati. Stavite poziv iznad toga.
