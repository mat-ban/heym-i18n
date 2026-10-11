# Skupine

Skupine vam omogočajo, da delite workflows, poverilnice, globalne spremenljivke, vektorske shrambe in datoteke iz Drive-a z več uporabniki hkrati.

## Pregled

- **Skupina** – Poimenovana skupina s ustvarjalcem in člani
- **Ustvarjalec** – Vedno član; lahko ureja skupino, izbriše skupino, doda člane
- **Član** – Lahko doda in odstrani druge člane (razen ustvarjalca); ima dostop do virov, ki so deljeni s skupino

## Ustvarjanje in upravljanje skupin

Skupine lahko ustvarite na [zavihek Skupine](../tabs/teams-tab.md). Člane dodajte po elektronski pošti; imeti morajo račun. Ustvarjalca ni mogoče odstraniti. Izbris skupine odstrani vse delitve skupine.

## Model deljenja

Viri se lahko delijo z:

1. **Posameznimi uporabniki** – Po elektronski pošti (delitev uporabnik-do-uporabnika)
2. **Skupinami** – Z izbiro skupine (delitev skupine)

Oba modela sta aditivna. Uporabnik pridobi dostop, če je:

- Deljen neposredno (delitev uporabnika), ali
- Član skupine, ki ima delitev skupine

## Kaj se lahko deli s skupinami

| Vir | Lokacija deljenja |
|-----|-------------------|
| Workflows | Pogovor o delitvi v urejevalniku workflow-ov |
| Predloge workflow-ov | Pogovor o delitvi pri ustvarjanju/urejanju predloge workflow-a |
| Predloge vozlišč | Pogovor o delitvi pri ustvarjanju/urejanju predloge vozlišča |
| Poverilnice | Pogovor o delitvi na zavihku Poverilnice |
| Globalne spremenljivke | Pogovor o delitvi na zavihku Spremenljivke |
| Vektorske shrambe | Pogovor o delitvi na zavihku Vektorske shrambe |
| Datoteke iz Drive-a | Pogovor o delitvi na zavihku Drive ali operacije `shareWithMyTeams` / `unshareWithMyTeams` v vozlišču Drive |

Za predloge, ko je vidnost **Specifični uporabniki**, lahko izberete tudi skupine. Vsi člani izbranih skupin pridobijo dostop do predloge. Delitve datotek iz Drive-a so samo za branje za člane skupine; lastnik datoteke ohrani pravice za upravljanje.

## API Endpointi

- `GET /api/teams` – Prikaže skupine, katerih član je uporabnik
- `GET /api/teams/{id}` – Pridobi podrobnosti o skupini s člani
- `GET /api/teams/{id}/shared-entities` – Vrne entitete, deljene s skupino (workflows, poverilnice, globalne spremenljivke, vektorske shrambe, datoteke, predloge workflow-ov, predloge vozlišč)
- `POST /api/teams` – Ustvari skupino
- `PATCH /api/teams/{id}` – Posodobi skupino
- `DELETE /api/teams/{id}` – Izbriši skupino (samo ustvarjalec)
- `POST /api/teams/{id}/members` – Dodaj člana (telo: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Odstrani člana

Delitve skupin po viru:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – telo POST sprejema `permission` (`read` ali `write`, privzeto `write`); ponovna objava obstoječe skupine posodobi njene pravice
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Sorodno

- [Zavihek Skupine](../tabs/teams-tab.md) – Ustvarjanje in upravljanje skupin
- [Zavihek Predloge](../tabs/templates-tab.md) – Deljenje predlog workflow-ov in vozlišč s skupinami
- [Deljenje poverilnic](./credentials-sharing.md) – Deljenje poverilnic z uporabniki in skupinami
- [Organizacija workflow-ov](./workflow-organization.md) – Mape in deljenje workflow-ov
