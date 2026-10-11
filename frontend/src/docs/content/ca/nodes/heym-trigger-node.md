# Trigger de Heym

El node **Heym Trigger** inicia un workflow quan el mateix Heym publica un esdeveniment de plataforma. És un node trigger sense entrades per automatitzar Heym amb Heym: registres d'auditoria de canvis, anuncis de desplegament i resums de salut de la instància.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 |
| Sortides | 1 |
| Sortida | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Credencial | Cap de necessària |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `eventNames` | Matriu de cadenes | A quins esdeveniments subscriure's. Deixeu-ho buit per rebre tots els esdeveniments. |

## Esdeveniments

| Esdeveniment | Es publica quan | Abast |
|-------|----------------|-------|
| `heym.started` | La plataforma Heym s'inicia | A tota la instància: tots els subscriptors el reben |
| `workflow.created` | Es crea un workflow | Només els subscriptors del propietari del workflow |
| `workflow.updated` | Es desa un workflow | Només els subscriptors del propietari del workflow |
| `workflow.deleted` | S'elimina un workflow | Només els subscriptors del propietari del workflow |

Els widgets del tauler s'emmagatzemen internament com a workflows, però mai no produeixen esdeveniments `workflow.*`.

## El lliurament és per lots

Heym envia els esdeveniments cada cinc segons. **Cada esdeveniment reclamat en una passada d'enviament arriba en una única execució del workflow**, com una matriu.

- Creeu dos workflows amb menys de cinc segons de diferència → **una** execució amb dos esdeveniments.
- Creeu un workflow → **una** execució amb una matriu d'un element.

La forma mai no canvia, de manera que les expressions posteriors no han de ramificar-se segons si ha arribat un esdeveniment o molts. Quan necessiteu actuar una vegada per esdeveniment, col·loqueu un node [Loop](./loop-node.md) sobre `$nodeLabel.events`.

## Lliurament exactly-once

Cada esdeveniment es reclama per node subscriptor mitjançant una restricció única de base de dades abans de ser lliurat. Això es manté en tots els workers d'uvicorn, tots els contenidors i totes les màquines: executar Heym en dos servidors no lliura un esdeveniment dues vegades. Si no es pot registrar una reclamació, l'esdeveniment no es lliura en absolut — el disseny falla de manera tancada en lloc de disparar-se dues vegades.

Dos nodes `heymTrigger` diferents subscrits al mateix esdeveniment el reben cadascun una vegada; no competeixen per ell.

## La finestra d'enviament

El despatxador només considera els esdeveniments publicats en els **últims cinc minuts**. Els esdeveniments més antics romanen al registre per a inspecció, però mai no es lliuren. Això limita què passa després d'una interrupció: tornar a engegar Heym després d'una hora fora de línia no reprodueix res, en lloc de disparar una hora d'endarreriments de cop.

Els esdeveniments es conserven durant **7 dies** i després s'eliminen.

## Camps de sortida

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.events` | Matriu d'objectes d'esdeveniment, del més antic al més recent. Sempre una matriu. |
| `$nodeLabel.events[0].id` | UUID de l'esdeveniment |
| `$nodeLabel.events[0].name` | Nom de l'esdeveniment, per exemple `workflow.created` |
| `$nodeLabel.events[0].payload` | Cos de l'esdeveniment |
| `$nodeLabel.events[0].workflow_id` | Id del workflow subjecte, o `null` per a `heym.started` |
| `$nodeLabel.events[0].created_at` | Marca de temps ISO de quan es va publicar l'esdeveniment |
| `$nodeLabel.count` | Nombre d'esdeveniments en aquest lot |
| `$nodeLabel.triggered_at` | Marca de temps ISO de l'execució del workflow |

### Formes del payload

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` porta el nom capturat just abans de l'eliminació, ja que la fila del workflow ja no existeix quan llegiu l'esdeveniment.

## Workflow d'exemple

**Registre d'auditoria de canvis de workflow**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** amb etiqueta `platformEvents`, subscrit a `workflow.created`, `workflow.updated`, `workflow.deleted`
- Node **Heym** amb `getWorkflow` i `heymWorkflowId` establert a `$platformEvents.events[0].workflow_id`
- Missatge de **Slack**: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Notes

- `heym.started` es dispara **una vegada per inici de plataforma**, no una vegada per worker, tot i que Heym executa vuit workers per contenidor. Els contenidors que s'inicien amb més de cinc minuts de diferència publiquen cadascun un esdeveniment.
- Les execucions disparades d'aquesta manera apareixen a l'historial amb `trigger_source = "heym_event"`.
- Establiu **Events** a cap en lloc de llistar-los tots quatre si voleu recollir automàticament els tipus d'esdeveniment afegits en versions futures.

## Relacionat

- [Heym](./heym-node.md) – Llegiu workflows i historial d'execucions
- [Triggers](../reference/triggers.md) – Visió general de tots els punts d'entrada del workflow
- [Loop](./loop-node.md) – Actueu una vegada per esdeveniment en un lot