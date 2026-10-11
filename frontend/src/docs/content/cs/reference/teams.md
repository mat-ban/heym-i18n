# Týmy

Týmy Vám umožňují sdílet workflow, přihlašovací údaje, globální proměnné, vektorová úložiště a soubory v Drive s celou skupinou uživatelů najednou.

## Přehled

- **Tým** – Pojmenovaná skupina s tvůrcem a členy
- **Tvůrce** – Vždy členem; může upravovat tým, mazat tým a přidávat členy
- **Člen** – Může přidávat a odebírat další členy (kromě tvůrce); má přístup ke zdrojům sdíleným s týmem

## Vytváření a správa týmů

Týmy vytvářejte na kartě [Týmy](../tabs/teams-tab.md). Členy přidávejte pomocí e-mailu; musí mít vytvořený účet. Tvůrce nelze odebrat. Smazáním týmu se odstraní všechna sdílení týmu.

## Model sdílení

Zdroje lze sdílet s:

1. **Jednotlivými uživateli** – Pomocí e-mailu (sdílení mezi uživateli)
2. **Týmy** – Výběrem týmu (sdílení s týmem)

Oba modely se sčítají. Uživatel získá přístup, pokud je buď:

- Sdílen přímo (sdílení s uživatelem), nebo
- Členem týmu, který má sdílení s týmem

## Co lze sdílet s týmy

| Zdroj | Umístění sdílení |
|----------|----------------|
| Workflow | Dialog sdílení v editoru workflow |
| Šablony workflow | Dialog sdílení při vytváření/úpravě šablony workflow |
| Šablony uzlů | Dialog sdílení při vytváření/úpravě šablony uzlu |
| Přihlašovací údaje | Dialog sdílení na kartě Přihlašovací údaje |
| Globální proměnné | Dialog sdílení na kartě Proměnné |
| Vektorová úložiště | Dialog sdílení na kartě Vektory |
| Soubory v Drive | Dialog sdílení na kartě Drive nebo operace uzlu Drive `shareWithMyTeams` / `unshareWithMyTeams` |

U šablon, když je viditelnost nastavena na **Konkrétní uživatelé**, můžete také vybrat týmy. Všichni členové vybraných týmů získají přístup k šabloně.
Sdílení souborů v Drive s týmem je pro členy týmu pouze pro čtení; vlastník souboru si zachovává oprávnění ke správě.

## API Endpointy

- `GET /api/teams` – Vypíše týmy, do kterých uživatel patří
- `GET /api/teams/{id}` – Získá podrobnosti o týmu včetně členů
- `GET /api/teams/{id}/shared-entities` – Vrátí entity sdílené s týmem (workflow, přihlašovací údaje, globální proměnné, vektorová úložiště, soubory, šablony workflow, šablony uzlů)
- `POST /api/teams` – Vytvoří tým
- `PATCH /api/teams/{id}` – Aktualizuje tým
- `DELETE /api/teams/{id}` – Smaže tým (pouze tvůrce)
- `POST /api/teams/{id}/members` – Přidá člena (tělo: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Odebere člena

Sdílení s týmem pro jednotlivé zdroje:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – tělo požadavku POST přijímá `permission` (`read` nebo `write`, výchozí `write`); opětovné odeslání existujícího týmu aktualizuje jeho oprávnění
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Související

- [Karta Týmy](../tabs/teams-tab.md) – Vytváření a správa týmů
- [Karta Šablony](../tabs/templates-tab.md) – Sdílení šablon workflow a uzlů s týmy
- [Sdílení přihlašovacích údajů](./credentials-sharing.md) – Sdílení přihlašovacích údajů s uživateli a týmy
- [Organizace workflow](./workflow-organization.md) – Složky a sdílení workflow
