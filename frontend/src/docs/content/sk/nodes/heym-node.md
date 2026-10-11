# Heym

Uzol **Heym** číta vlastné dáta Heymu: workflowy, ku ktorým máte prístup, štruktúru jedného workflowu a jeho históriu spustení. Je to spôsob, akým vytvárate meta-workflowy — inventáre inštancií, prehľady spustení a reporty o stave samotného Heymu.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Operácie | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Prihlasovacie údaje | Žiadne sa nevyžadujú |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `heymOperation` | Select | Ktoré čítanie sa má vykonať |
| `heymWorkflowId` | UUID | Cieľový workflow. Vyžaduje sa pre `getWorkflow` a `getExecutionHistory`. Podporuje výrazy. |
| `heymLimit` | String | Maximálny počet riadkov, ktoré sa majú vrátiť. **Nechajte prázdne alebo zadajte `0` pre vrátenie všetkého** — to je predvolená hodnota. Podporuje výrazy. |
| `heymStatus` | String | Voliteľný filter stavu pre `getExecutionHistory`. Podporuje výrazy. |
| `heymSinceDays` | String | Voliteľné obdobie spätného pohľadu v dňoch pre `getExecutionHistory`. Podporuje výrazy. |

Výber workflowu je prehľadávateľný rozbaľovací zoznam obsahujúci všetky workflowy, ku ktorým máte prístup.

## Rozsah prístupu

Výsledky sú obmedzené na **vlastníka workflowu, v ktorom sa uzol nachádza** — nie na toho, kto spustil beh. Viditeľná množina pozostáva z:

- workflowov, ktoré vlastní vlastník,
- workflowov zdieľaných priamo s vlastníkom,
- workflowov zdieľaných s tímom, do ktorého vlastník patrí.

Obmedzenie na vlastníka je to, čo zabezpečuje, že sa uzol správa identicky bez ohľadu na to, či bol beh spustený manuálne, cez cron, z portálu alebo platformovou udalosťou. Obmedzenie na aktéra by pri každom bezobslužnom behu vrátilo nič. Je to rovnaké pravidlo, aké už Heym používa pre prihlasovacie údaje a globálne premenné.

Workflow, ku ktorému nemáte prístup, a workflow, ktorý neexistuje, produkujú rovnakú chybovú správu, takže uzol nemožno použiť na zisťovanie ID workflowov.

## Operácie

### List Workflows

Vráti všetky workflowy, ku ktorým má vlastník prístup, najskôr naposledy aktualizované.

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.workflows` | Pole súhrnov workflowov |
| `$nodeLabel.workflows[0].id` | UUID workflowu |
| `$nodeLabel.workflows[0].name` | Názov workflowu |
| `$nodeLabel.workflows[0].description` | Popis alebo `null` |
| `$nodeLabel.workflows[0].active` | Či je workflow aktívny |
| `$nodeLabel.workflows[0].folder_id` | UUID priečinka alebo `null` |
| `$nodeLabel.workflows[0].updated_at` | ISO časová značka posledného uloženia |
| `$nodeLabel.workflows[0].node_count` | Koľko uzlov workflow obsahuje |
| `$nodeLabel.total` | Úplný dostupný počet **pred** uplatnením limitu |

`total` je zámerne neobmedzený počet, takže `$inventory.total` stále hlási skutočnú veľkosť, aj keď obmedzíte vrátené riadky. Vymazanie poľa **Limit** alebo jeho nastavenie na `0` vráti všetky workflowy — čo je predvolená hodnota.

### Get Workflow

Vráti identitu a štruktúru jedného workflowu.

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Identita workflowu |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metadáta workflowu |
| `$nodeLabel.node_count` | Počet uzlov |
| `$nodeLabel.nodes` | Pole `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Pole `{ id, source, target, sourceHandle, targetHandle }` |

`data` je **úplná konfigurácia uzla** — každé pole tak, ako bolo uložené. To je to, čo umožňuje auditovanie: nemôžete skenovať workflow na API kľúč, ktorý niekto vložil do poľa, ak uzol odmietne pole zobraziť.

Toto neposkytuje žiadny prístup, ktorý volajúci už nemal. Uzol je obmedzený na workflowy, ktoré vlastník aj tak môže otvoriť v editore, a uložené tajné hodnoty prihlasovacích údajov tu stále nie sú: dátové polia uzla obsahujú iba **ID** prihlasovacích údajov, zatiaľ čo samotné tajné hodnoty žijú zašifrované v tabuľke prihlasovacích údajov.

### Skenovanie na pevne zakódované tajné hodnoty

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Poskytnite agentovi `$detail.nodes` a požiadajte ho, aby označil akúkoľvek hodnotu v `data`, ktorá vyzerá ako živý kľúč alebo token. Polia, ktoré stoja za pozornosť, sú tie s voľným textom — `curl` na HTTP uzloch, `userMessage` a `systemInstruction` na uzloch LLM a Agent a telá Python nástrojov — pretože ID prihlasovacích údajov je neškodný UUID, ale vložený `sk-…` nie je.
### Získať históriu spustení

Vráti záznamy histórie spustení pre jeden workflow, od najnovšieho po najstarší.

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.executions` | Pole záznamov histórie |
| `$nodeLabel.executions[0].id` | UUID spustenia |
| `$nodeLabel.executions[0].status` | `success`, `error` a podobne |
| `$nodeLabel.executions[0].started_at` | ISO časová značka |
| `$nodeLabel.executions[0].execution_time_ms` | Trvanie v reálnom čase |
| `$nodeLabel.executions[0].trigger_source` | Čo spustilo beh, napríklad `cron` alebo `heym_event` |
| `$nodeLabel.executions[0].recovered` | Či bol beh obnovený po páde |
| `$nodeLabel.executions[0].inputs` | Čo beh prijal – payload triggera alebo vstup volajúceho |
| `$nodeLabel.executions[0].outputs` | Výstup workflow pre daný beh |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow, ktorému história patrí |
| `$nodeLabel.total` | Celkový počet zodpovedajúcich spustení **pred** limitom |
| `$nodeLabel.by_status` | Počty podľa statusu, napríklad `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Začiatok okna alebo `null` pre celú históriu |

Záznamy obsahujú `inputs` aj `outputs` – čo beh prijal a čo vrátil – ale nikdy `node_results`: sledovanie po jednotlivých uzloch je najväčší stĺpec v tabuľke a zatienilo by všetko nasledujúce. Ak potrebujete úplné sledovanie, získajte jedno spustenie prostredníctvom API.

`total` a `by_status` vždy opisujú **celú** zodpovedajúcu históriu, aj keď **Limit** obmedzuje vrátené záznamy — takže môžete získať päť najnovších behov a stále nahlásiť presný počet zlyhaní.

Nechajte **Since (days)** prázdne, aby zahŕňalo všetko, **Status filter** prázdny, aby zahŕňal všetky statusy, a **Limit** prázdny alebo `0`, aby vrátil každý záznam.

## Príklad workflow

**Denný prehľad inštancií**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` s označením `inventory`
- **Loop** cez `$inventory.workflows`
- **Heym** `getExecutionHistory` s `heymWorkflowId` nastaveným na `id` položky cyklu, `heymSinceDays` na `1` a `heymLimit` na `5`
- **LLM** premení zozbierané behy a počty statusov na čitateľné zhrnutie

## Poznámky

- Nevyžaduje sa žiadny prihlasovací údaj; uzol číta tú istú databázu, na ktorej beží Heym.
- **Limit** je rovnaké pole pre obe operácie zoznamu a v oboch znamená to isté: prázdne alebo `0` vráti všetko.
- Uzol prijíma bežný vstup a možno ho pripojiť k uzlu Agent ako nástroj, takže agent môže odpovedať na otázky o vašej inštancii Heym — alebo ju auditovať.
- Payloady `getWorkflow` rastú s workflow: dlhé prompty a telá Python nástrojov cestujú vnútri `data`.
- Spárujte ho s [Heym Trigger](./heym-trigger-node.md), aby ste reagovali na zmeny workflow tak, ako sa dejú, namiesto pravidelného dopytovania podľa plánu.

## Súvisiace

- [Heym Trigger](./heym-trigger-node.md) – Spustite workflow z udalostí platformy
- [Execute](./execute-node.md) – Spustite iný workflow namiesto jeho opisu
- [Loop](./loop-node.md) – Iterujte cez vrátený zoznam workflow
