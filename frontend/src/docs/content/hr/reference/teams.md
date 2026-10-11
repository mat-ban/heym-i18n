# Timovi

Timovi omogućuju dijeljenje workflows-a, vjerodajnica, globalnih varijabli, vektorskih spremišta i datoteka s Drive-a s grupom korisnika odjednom.

## Pregled

- **Tim** – Imenovana grupa s kreatorom i članovima
- **Kreator** – Uvijek član; može uređivati tim, brisati tim, dodavati članove
- **Član** – Može dodavati i uklanjati druge članove (osim kreatora); ima pristup resursima dijeljenim s timom

## Kreiranje i upravljanje timovima

Timove možete kreirati iz [Teams tab](../tabs/teams-tab.md). Dodajte članove putem e-pošte; moraju imati račun. Kreator se ne može ukloniti. Brisanje tima uklanja sve dijeljene resurse tima.

## Model dijeljenja

Resursi se mogu dijeliti s:

1. **Individualnim korisnicima** – Putem e-pošte (dijeljenje korisnik-korisniku)
2. **Timovima** – Odabirom tima (dijeljenje timom)

Oba modela su aditivna. Korisnik dobiva pristup ako je ili:

- Dijeljen izravno (dijeljenje korisnika), ili
- Član tima koji ima dijeljenje timom

## Što se može dijeliti s timovima

| Resurs | Lokacija dijeljenja |
|--------|---------------------|
| Workflows | Dijaloški okvir za dijeljenje u uređivaču workflows-a |
| Predlošci workflows-a | Dijaloški okvir za dijeljenje prilikom kreiranja/uređivanja predloška workflows-a |
| Predlošci čvorova | Dijaloški okvir za dijeljenje prilikom kreiranja/uređivanja predloška čvora |
| Vjerodajnice | Dijaloški okvir za dijeljenje u kartici Vjerodajnice |
| Globalne varijable | Dijaloški okvir za dijeljenje u kartici Varijable |
| Vektorska spremišta | Dijaloški okvir za dijeljenje u kartici Vektori |
| Datoteke s Drive-a | Dijaloški okvir za dijeljenje u kartici Drive ili operacije čvora Drive `shareWithMyTeams` / `unshareWithMyTeams` |

Za predloške, kada je vidljivost **Specifični korisnici**, također možete odabrati timove. Svi članovi odabranih timova dobivaju pristup predlošku. Dijeljenja datoteka s Drive-a su samo za čitanje za članove tima; vlasnik datoteke zadržava prava upravljanja.

## API Endpointi

- `GET /api/teams` – Popis timova kojima korisnik pripada
- `GET /api/teams/{id}` – Dobivanje detalja o timu s članovima
- `GET /api/teams/{id}/shared-entities` – Vraća entitete dijeljene s timom (workflows, vjerodajnice, globalne varijable, vektorska spremišta, datoteke, predlošci workflows-a, predlošci čvorova)
- `POST /api/teams` – Kreiranje tima
- `PATCH /api/teams/{id}` – Ažuriranje tima
- `DELETE /api/teams/{id}` – Brisanje tima (samo kreator)
- `POST /api/teams/{id}/members` – Dodavanje člana (tijelo: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Uklanjanje člana

Dijeljenja tima po resursu:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST tijelo prihvaća `permission` (`read` ili `write`, zadano `write`); ponovnim slanjem postojećeg tima ažurira se njegova dozvola
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Povezano

- [Teams Tab](../tabs/teams-tab.md) – Kreiranje i upravljanje timovima
- [Templates Tab](../tabs/templates-tab.md) – Dijeljenje predložaka workflows-a i čvorova s timovima
- [Dijeljenje vjerodajnica](./credentials-sharing.md) – Dijeljenje vjerodajnica s korisnicima i timovima
- [Organizacija workflows-a](./workflow-organization.md) – Mape i dijeljenje workflows-a
