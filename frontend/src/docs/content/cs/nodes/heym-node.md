# Heym

Uzel **Heym** čte data samotného HeyMu: workflows, ke kterým máte přístup, strukturu jednoho workflow a jeho historii spuštění. Je to způsob, jakým vytváříte meta-workflows — inventáře instancí, přehledy spuštění a reporty o stavu samotného HeyMu.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Operace | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Přihlašovací údaje | Nejsou vyžadovány |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `heymOperation` | Select | Které čtení se má provést |
| `heymWorkflowId` | UUID | U `getExecutionHistory` jej nastavte na `all`, chcete-li načíst každý dostupný Workflow. |
| `heymLimit` | String | Maximální počet vrácených řádků. **Ponechte prázdné nebo zadejte `0` pro vrácení všeho** — to je výchozí hodnota. Podporuje výrazy. |
| `heymStatus` | String | Volitelný filtr stavu pro `getExecutionHistory`. Podporuje výrazy. |
| `heymSinceDays` | String | Volitelné zpětné období ve dnech pro `getExecutionHistory`. Podporuje výrazy. |

Výběr workflow je prohledávatelný rozbalovací seznam obsahující všechny workflows, ke kterým máte přístup.

## Rozsah přístupu

Výsledky jsou omezeny na **vlastníka workflow, ve kterém se uzel nachází** — nikoli na toho, kdo spustil běh. Viditelná množina zahrnuje:

- workflows, které vlastník vlastní,
- workflows sdílené přímo s vlastníkem,
- workflows sdílené s týmem, do kterého vlastník patří.

Omezení na vlastníka zajišťuje, že se uzel chová identicky bez ohledu na to, zda byl běh spuštěn ručně, pomocí cron, z portálu nebo platformovou událostí. Omezení na aktéra by při každém neobsluhovaném běhu vrátilo prázdný výsledek. Je to stejné pravidlo, které Heym již používá pro přihlašovací údaje a globální proměnné.

Workflow, ke kterému nemáte přístup, a workflow, které neexistuje, produkují stejnou chybovou zprávu, takže uzel nelze použít ke zjišťování ID workflow.

## Operace

### List Workflows

Vrací každý workflow, ke kterému má vlastník přístup, seřazený od naposledy upraveného.

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.workflows` | Pole souhrnů workflow |
| `$nodeLabel.workflows[0].id` | UUID workflow |
| `$nodeLabel.workflows[0].name` | Název workflow |
| `$nodeLabel.workflows[0].description` | Popis, nebo `null` |
| `$nodeLabel.workflows[0].active` | Zda je workflow aktivní |
| `$nodeLabel.workflows[0].folder_id` | UUID složky, nebo `null` |
| `$nodeLabel.workflows[0].updated_at` | ISO časové razítko posledního uložení |
| `$nodeLabel.workflows[0].node_count` | Kolik uzlů workflow obsahuje |
| `$nodeLabel.total` | Úplný počet dostupných položek **před** aplikováním limitu |

`total` je záměrně neomezený počet, takže `$inventory.total` stále hlásí skutečnou velikost, i když omezíte vrácené řádky. Vymazání pole **Limit** nebo jeho nastavení na `0` vrátí všechny workflows — což je výchozí hodnota.

### Get Workflow

Vrací identitu a strukturu jednoho workflow.

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Identita workflow |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metadata workflow |
| `$nodeLabel.node_count` | Počet uzlů |
| `$nodeLabel.nodes` | Pole `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Pole `{ id, source, target, sourceHandle, targetHandle }` |

`data` je **úplná konfigurace uzlu** — každé pole tak, jak bylo uloženo. To umožňuje auditování: nemůžete prohledávat workflow kvůli API klíči, který někdo vložil do pole, pokud uzel odmítne pole zobrazit.

To neposkytuje žádný přístup, který volající již neměl. Uzel je omezen na workflows, které vlastník může stejně otevřít v editoru, a uložená tajemství přihlašovacích údajů zde stále nejsou: data uzlu obsahují pouze **ID** přihlašovacích údajů, zatímco samotná tajemství jsou uložena šifrovaně v tabulce přihlašovacích údajů.

### Vyhledávání pevně zapsaných tajemství

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Předejte agentovi `$detail.nodes` a požádejte ho, aby označil jakoukoli hodnotu v `data`, která vypadá jako živý klíč nebo token. Pole, která stojí za pozornost, jsou ta s volným textem — `curl` na uzlech HTTP, `userMessage` a `systemInstruction` na uzlech LLM a Agent a těla Python nástrojů — protože ID přihlašovacích údajů je neškodné UUID, ale vložený `sk-…` nikoli.
### Získání historie spuštění

Vrací záznamy historie spuštění pro jeden workflow, od nejnovějšího.

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.executions` | Pole záznamů historie |
| `$nodeLabel.executions[0].id` | UUID spuštění |
| `$nodeLabel.executions[0].status` | `success`, `error` a podobně |
| `$nodeLabel.executions[0].started_at` | ISO časové razítko |
| `$nodeLabel.executions[0].execution_time_ms` | Doba běhu v reálném čase |
| `$nodeLabel.executions[0].trigger_source` | Co spuštění zahájilo, například `cron` nebo `heym_event` |
| `$nodeLabel.executions[0].recovered` | Zda bylo spuštění obnoveno po pádu |
| `$nodeLabel.executions[0].inputs` | Co spuštění přijalo – trigger payload nebo vstup volajícího |
| `$nodeLabel.executions[0].outputs` | Výstup workflow pro dané spuštění |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow, ke kterému historie patří, nebo `null` u **{AW}** |
ebo `null` u **{AW}** |
| `$nodeLabel.total` | Celkový počet odpovídajících spuštění **před** aplikací limitu |
| `$| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | U **{AW}** Workflow, ke kterému každé spuštění patří |
nodeLabel.by_status` | Počty podle statusu, například `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Začátek okna, nebo `null` pro celou historii |

Záznamy obsahují jak `inputs`, tak `outputs` – co spuštění přijalo a co odpovědělo – ale nikdy `node_results`: trace po jednotlivých uzlech je největší sloupec v tabulce a zastínil by vše navazující. Potřebujete-li úplný trace, načtěte jedno spuštění přes API.

`total` a `by_status` vždy popisují **celou** odpovídající historii, i když **Limit** omezuje vrácené záznamy – můžete tedy načíst pět nejnovějších spuštění a přesto hlásit přesný počet selhání.

Ponechte **Since (days)** prázdné pro pokrytí všeho, **Status filter** prázdný pro zahrnutí všech statusů a **Limit** prázdný nebo `0` pro vrácení všech záznamů.

## Příklad workflow

**Denní přehled instancí**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` s označením `inventory`
- **Loop** přes `$inventory.workflows`
- **Heym** `getExecutionHistory` s `heymWorkflowId` nastaveným na `id` položky cyklu, `heymSinceDays` na `1` a `heymLimit` na `5`
- **LLM** převede shromážděná spuštění a počty statusů na čitelný souhrn

## Poznámky

- Není potřeba žádné přihlašovací údaje; uzel čte stejnou databázi, na které běží Heym.
- **Limit** je stejné pole pro obě operace výpisu a v obou znamená totéž: prázdné nebo `0` vrací vše.
- Uzel přijímá běžný vstup a lze jej připojit k uzlu Agent jako nástroj, takže agent může odpovídat na otázky o vaší instanci Heym – nebo ji auditovat.
- Payloady `getWorkflow` rostou s workflow: dlouhé prompty i těla Python nástrojů cestují uvnitř `data`.
- Zkombinujte jej s [Heym Trigger](./heym-trigger-node.md) pro reakci na změny workflow v okamžiku, kdy nastanou, místo dotazování podle plánu.

## Související

- [Heym Trigger](./heym-trigger-node.md) – Spuštění workflow z událostí platformy
- [Execute](./execute-node.md) – Spuštění jiného workflow namísto jeho popisu
- [Loop](./loop-node.md) – Iterace přes vrácený seznam workflow
