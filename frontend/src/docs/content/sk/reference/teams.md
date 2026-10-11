# Tímy

Tímy vám umožňujú zdieľať workflowy, prihlasovacie údaje, globálne premenné, vektorové úložiská a súbory v Drive s celou skupinou používateľov naraz.

## Prehľad

- **Tím** – Pomenovaná skupina s tvorcom a členmi
- **Tvorca** – Vždy je členom; môže upravovať tím, odstrániť tím a pridávať členov
- **Člen** – Môže pridávať a odstraňovať ostatných členov (okrem tvorcu); má prístup k prostriedkom zdieľaným s tímom

## Vytváranie a správa tímov

Tímy vytvárate na karte [Tímy](../tabs/teams-tab.md). Členov pridávate e-mailom; musia mať vytvorený účet. Tvorcu nie je možné odstrániť. Odstránením tímu sa odstránia všetky zdieľania tímu.

## Model zdieľania

Prostriedky je možné zdieľať s:

1. **Jednotlivými používateľmi** – E-mailom (zdieľanie medzi používateľmi)
2. **Tímami** – Výberom tímu (zdieľanie s tímom)

Oba modely sa sčítavajú. Používateľ získa prístup, ak je buď:

- priamo zdieľaný (zdieľanie s používateľom), alebo
- členom tímu, ktorý má zdieľanie s tímom

## Čo je možné zdieľať s tímami

| Prostriedok | Miesto zdieľania |
|----------|----------------|
| Workflowy | Dialóg zdieľania v editore workflowu |
| Šablóny workflowov | Dialóg zdieľania pri vytváraní/úprave šablóny workflowu |
| Šablóny uzlov | Dialóg zdieľania pri vytváraní/úprave šablóny uzla |
| Prihlasovacie údaje | Dialóg zdieľania na karte Prihlasovacie údaje |
| Globálne premenné | Dialóg zdieľania na karte Premenné |
| Vektorové úložiská | Dialóg zdieľania na karte Vektory |
| Súbory v Drive | Dialóg zdieľania na karte Drive alebo operácie uzla Drive `shareWithMyTeams` / `unshareWithMyTeams` |

Pri šablónach, keď je viditeľnosť nastavená na **Konkrétni používatelia**, môžete vybrať aj tímy. Všetci členovia vybraných tímov získajú prístup k šablóne.
Zdieľanie súborov v Drive s tímom je pre členov tímu iba na čítanie; vlastník súboru si zachováva oprávnenia na správu.

## API Endpointy

- `GET /api/teams` – Zobrazí zoznam tímov, do ktorých používateľ patrí
- `GET /api/teams/{id}` – Získa podrobnosti o tíme vrátane členov
- `GET /api/teams/{id}/shared-entities` – Vráti entity zdieľané s tímom (workflowy, prihlasovacie údaje, globálne premenné, vektorové úložiská, súbory, šablóny workflowov, šablóny uzlov)
- `POST /api/teams` – Vytvorí tím
- `PATCH /api/teams/{id}` – Aktualizuje tím
- `DELETE /api/teams/{id}` – Odstráni tím (iba tvorca)
- `POST /api/teams/{id}/members` – Pridá člena (telo: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Odstráni člena

Zdieľanie s tímom pre jednotlivé prostriedky:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – telo požiadavky POST akceptuje `permission` (`read` alebo `write`, predvolene `write`); opätovné odoslanie existujúceho tímu aktualizuje jeho oprávnenie
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Súvisiace

- [Karta Tímy](../tabs/teams-tab.md) – Vytváranie a správa tímov
- [Karta Šablóny](../tabs/templates-tab.md) – Zdieľanie šablón workflowov a uzlov s tímami
- [Zdieľanie prihlasovacích údajov](./credentials-sharing.md) – Zdieľanie prihlasovacích údajov s používateľmi a tímami
- [Organizácia workflowov](./workflow-organization.md) – Priečinky a zdieľanie workflowov
