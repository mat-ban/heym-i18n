# Teams

Teams võimaldavad jagada workflow'sid, mandaate, globaalseid muutujaid, vektorhoidlaid ja Drive-faile korraga kasutajate grupile.

## Ülevaade

- **Team** – Nimega grupp, millel on looja ja liikmed
- **Looja** – Alati liige; saab team'i muuta, team'i kustutada, liikmeid lisada
- **Liige** – Saab lisada ja eemaldada teisi liikmeid (välja arvatud looja); omab juurdepääsu team'iga jagatud ressurssidele

## Team'ide loomine ja haldamine

Looge team'e vahekaardilt [Teams](../tabs/teams-tab.md). Lisage liikmeid e-posti teel; neil peab olema konto. Loojat ei saa eemaldada. Team'i kustutamine eemaldab kõik team'i jagamised.

## Jagamise mudel

Ressursse saab jagada:

1. **Üksikutele kasutajatele** – E-posti teel (kasutajatevaheline jagamine)
2. **Team'idele** – Valides team'i (team'i jagamine)

Mõlemad mudelid on kumulatiivsed. Kasutaja saab juurdepääsu, kui ta on kas:

- Otseselt jagatud (kasutaja jagamine), või
- Team'i liige, kellel on team'i jagamine

## Mida saab team'idega jagada

| Ressurss | Jagamise asukoht |
|----------|----------------|
| Workflow'd | Jagamise dialoog workflow redaktoris |
| Workflow mallid | Jagamise dialoog workflow malli loomisel/muutmisel |
| Node mallid | Jagamise dialoog node malli loomisel/muutmisel |
| Mandaadid | Jagamise dialoog vahekaardil Mandaadid |
| Globaalsed muutujad | Jagamise dialoog vahekaardil Muutujad |
| Vektorhoidlad | Jagamise dialoog vahekaardil Vektorid |
| Drive-failid | Jagamise dialoog vahekaardil Drive või Drive node'i `shareWithMyTeams` / `unshareWithMyTeams` operatsioonid |

Mallide puhul, kui nähtavus on **Konkreetsed kasutajad**, saate samuti valida team'e. Kõik valitud team'ide liikmed saavad mallile juurdepääsu.
Drive-faili team'i jagamised on team'i liikmetele kirjutuskaitstud; faili omanik säilitab haldusõigused.

## API endpoint'id

- `GET /api/teams` – Loetle team'id, kuhu kasutaja kuulub
- `GET /api/teams/{id}` – Hangi team'i üksikasjad koos liikmetega
- `GET /api/teams/{id}/shared-entities` – Tagastab team'iga jagatud olemid (workflow'd, mandaadid, globaalsed muutujad, vektorhoidlad, failid, workflow mallid, node mallid)
- `POST /api/teams` – Loo team
- `PATCH /api/teams/{id}` – Uuenda team'i
- `DELETE /api/teams/{id}` – Kustuta team (ainult looja)
- `POST /api/teams/{id}/members` – Lisa liige (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Eemalda liige

Team'i jagamised ressursi kohta:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST body aktsepteerib `permission` (`read` või `write`, vaikimisi `write`); olemasoleva team'i uuesti postitamine uuendab selle õigusi
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Seotud

- [Teams vahekaart](../tabs/teams-tab.md) – Team'ide loomine ja haldamine
- [Mallide vahekaart](../tabs/templates-tab.md) – Workflow ja node mallide jagamine team'idega
- [Mandaatide jagamine](./credentials-sharing.md) – Mandaatide jagamine kasutajate ja team'idega
- [Workflow korraldus](./workflow-organization.md) – Kaustad ja workflow jagamine
