# Heym

El node **Heym** llegeix les dades del propi Heym: els workflows als quals podeu accedir, l'estructura d'un workflow concret i el seu historial d'execucions. És la manera de construir meta-workflows: inventaris d'instàncies, resums d'execucions i informes de salut sobre el mateix Heym.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Operacions | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Credencial | Cap de necessària |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `heymOperation` | Select | Quina lectura cal dur a terme |
| `heymWorkflowId` | UUID | Workflow objectiu. Obligatori per a `getWorkflow` i `getExecutionHistory`. Admet expressions. |
| `heymLimit` | String | Nombre màxim de files a retornar. **Deixeu-lo buit o introduïu `0` per retornar-ho tot** — aquest és el valor per defecte. Admet expressions. |
| `heymStatus` | String | Filtre d'estat opcional per a `getExecutionHistory`. Admet expressions. |
| `heymSinceDays` | String | Retrospectiva opcional en dies per a `getExecutionHistory`. Admet expressions. |

El selector de workflows és un desplegable cercable que llista tots els workflows als quals podeu accedir.

## Abast d'accés

Els resultats estan limitats al **propietari del workflow on resideix el node**, no a qui ha iniciat l'execució. El conjunt visible és:

- els workflows que el propietari posseeix,
- els workflows compartits directament amb el propietari,
- els workflows compartits amb un equip al qual pertany el propietari.

L'abast per propietari és el que fa que el node es comporti de manera idèntica tant si una execució s'ha iniciat manualment, per cron, des d'un portal o per un esdeveniment de la plataforma. Un abast per actor no retornaria res en cap execució desatesa. És la mateixa regla que Heym ja aplica a les credencials i a les variables globals.

Un workflow al qual no podeu accedir i un workflow que no existeix produeixen el mateix missatge d'error, de manera que el node no es pot utilitzar per sondejar ids de workflows.

## Operacions

### List Workflows

Retorna tots els workflows als quals el propietari pot accedir, ordenats pel més recentment actualitzat.

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.workflows` | Array de resums de workflows |
| `$nodeLabel.workflows[0].id` | UUID del workflow |
| `$nodeLabel.workflows[0].name` | Nom del workflow |
| `$nodeLabel.workflows[0].description` | Descripció, o `null` |
| `$nodeLabel.workflows[0].active` | Si el workflow està actiu |
| `$nodeLabel.workflows[0].folder_id` | UUID de la carpeta, o `null` |
| `$nodeLabel.workflows[0].updated_at` | Marca de temps ISO del darrer desament |
| `$nodeLabel.workflows[0].node_count` | Quants nodes conté el workflow |
| `$nodeLabel.total` | Recompte complet accessible **abans** d'aplicar el límit |

`total` és deliberadament el recompte sense límit, de manera que `$inventory.total` continua reportant la mida real quan limiteu les files retornades. Buidar el camp **Limit**, o establir-lo a `0`, retorna tots els workflows — que és el valor per defecte.

### Get Workflow

Retorna la identitat i la forma d'un workflow.

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Identitat del workflow |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metadades del workflow |
| `$nodeLabel.node_count` | Nombre de nodes |
| `$nodeLabel.nodes` | Array de `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Array de `{ id, source, target, sourceHandle, targetHandle }` |

`data` és la **configuració completa del node** — tots els camps tal com es van desar. Això és el que fa possible l'auditoria: no podeu escanejar un workflow a la recerca d'una clau d'API que algú hi ha enganxat en un camp si el node es nega a mostrar el camp.

Això no atorga cap abast que l'executant no tingués ja. El node està limitat als workflows que el propietari pot obrir igualment a l'editor, i els secrets de les credencials emmagatzemades tampoc no hi són: les dades del node només contenen **ids** de credencials, mentre que els secrets mateixos resideixen xifrats a la taula de credencials.

### Escanejar secrets codificats en dur

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Proporcioneu a l'agent `$detail.nodes` i demaneu-li que assenyali qualsevol valor de `data` que sembli una clau o un token en actiu. Els camps que cal vigilar són els de text lliure — `curl` als nodes HTTP, `userMessage` i `systemInstruction` als nodes LLM i Agent, i els cossos d'eines Python — perquè un id de credencial és un UUID inofensiu, però un `sk-…` enganxat no ho és.
### Obtenir l'historial d'execucions

Retorna les entrades de l'historial d'execucions d'un workflow, de la més recent a la més antiga.

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.executions` | Array d'entrades de l'historial |
| `$nodeLabel.executions[0].id` | UUID de l'execució |
| `$nodeLabel.executions[0].status` | `success`, `error`, etc. |
| `$nodeLabel.executions[0].started_at` | Marca de temps ISO |
| `$nodeLabel.executions[0].execution_time_ms` | Durada en temps real |
| `$nodeLabel.executions[0].trigger_source` | Què va iniciar l'execució, per exemple `cron` o `heym_event` |
| `$nodeLabel.executions[0].recovered` | Si l'execució es va recuperar després d'una caiguda |
| `$nodeLabel.executions[0].inputs` | Què va rebre l'execució: el payload del trigger o l'entrada del cridador |
| `$nodeLabel.executions[0].outputs` | La sortida del workflow per a aquella execució |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | El workflow al qual pertany l'historial |
| `$nodeLabel.total` | Total d'execucions coincidents **abans** del límit |
| `$nodeLabel.by_status` | Recomptes indexats per estat, per exemple `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Inici de la finestra, o `null` per a l'historial complet |

Les entrades inclouen tant `inputs` com `outputs` —què va rebre l'execució i què va respondre—, però mai `node_results`: la traça per node és la columna més gran de la taula i faria ombra a tota la resta. Obteniu una única execució mitjançant l'API quan necessiteu la traça completa.

`total` i `by_status` sempre descriuen **tot** l'historial coincident, fins i tot quan **Limit** limita les entrades retornades, de manera que podeu obtenir les cinc execucions més recents i seguir informant d'un recompte de fallades exacte.

Deixeu **Since (days)** buit per cobrir-ho tot, **Status filter** buit per incloure tots els estats, i **Limit** buit o `0` per retornar totes les entrades.

## Workflow d'exemple

**Resum diari d'instàncies**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` etiquetat com a `inventory`
- **Loop** sobre `$inventory.workflows`
- **Heym** `getExecutionHistory` amb `heymWorkflowId` establert a l'`id` de l'element del bucle, `heymSinceDays` a `1` i `heymLimit` a `5`
- **LLM** converteix les execucions recollides i els recomptes d'estats en un resum llegible

## Notes

- No cal cap credencial; el node llegeix la mateixa base de dades on s'executa Heym.
- **Limit** és el mateix camp per a ambdues operacions de llista, i significa el mateix en totes dues: buit o `0` retorna tot.
- El node accepta una entrada normal i es pot adjuntar a un node Agent com a eina, de manera que un agent pot respondre preguntes sobre la vostra instància de Heym —o auditar-la.
- Els payloads de `getWorkflow` creixen amb el workflow: els prompts llargs i els cossos de les eines Python viatgen dins de `data`.
- Combineu-lo amb [Heym Trigger](./heym-trigger-node.md) per reaccionar als canvis del workflow a mesura que es produeixen, en lloc de fer sondejos segons una programació.

## Relacionat

- [Heym Trigger](./heym-trigger-node.md) – Inicia un workflow a partir d'esdeveniments de la plataforma
- [Execute](./execute-node.md) – Executa un altre workflow en lloc de descriure'l
- [Loop](./loop-node.md) – Itera sobre la llista de workflows retornada
