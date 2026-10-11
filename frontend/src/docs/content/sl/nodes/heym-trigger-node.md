# Heym Trigger

**Heym Trigger** vozlišče zažene workflow, ko Heym sam objavi dogodek platforme. Gre za vozlišče brez vhodov, ki omogoča avtomatizacijo Heym z uporabo Heym: spremembe revizijskih sledi, objave napovedi in povzetke zdravja instance.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 0 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Poverilnice | Ni potrebno |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `eventNames` | Nizovna tabela | Kateri dogodki naj se naročijo. Pustite prazno, da prejmete vsak dogodek. |

## Dogodki

| Dogodek | Objavljeno, ko | Obseg |
|---------|----------------|-------|
| `heym.started` | Platforma Heym se zažene | Na ravni instance: vsak naročnik ga prejme |
| `workflow.created` | Workflow je ustvarjen | Le naročniki lastnika workflowa |
| `workflow.updated` | Workflow je shranjen | Le naročniki lastnika workflowa |
| `workflow.deleted` | Workflow je izbrisan | Le naročniki lastnika workflowa |

Orodja nadzorne plošče so shranjena kot workflows interno, vendar nikoli ne proizvedejo `workflow.*` dogodkov.

## Dostava je serijska

Heym pošilja dogodke vsakih pet sekund. **Vsak dogodek, ki je prevzet v enem prenosu, prispe v en sam zagon workflowa**, kot tabela.

- Ustvarite dva workflows v petih sekundah drug od drugega → **en** zagon z dvema dogodkoma.
- Ustvarite en workflow → **en** zagon z enoelementno tabelo.

Oblika se nikoli ne spremeni, zato spodnje izraze nikoli ni treba razvejati glede na to, ali je prišel en dogodek ali več. Ko morate ukrepati enkrat na dogodek, postavite [Loop](./loop-node.md) vozlišče nad `$nodeLabel.events`.

## Dostava natančno enkrat

Vsak dogodek je prevzet za naročeno vozlišče prek edinstvene omejitve v bazi podatkov, preden je dostavljen. To velja za vsak uvicorn delavec, vsak kontejner in vsak stroj: zagon Heym na dveh strežnikih ne dostavi dogodka dvakrat. Če prevzema ni mogoče zabeležiti, dogodek sploh ni dostavljen — zasnova se zapre, namesto da bi se sprožila dvakrat.

Dve različni `heymTrigger` vozlišči, ki se naročata na isti dogodek, ga prejmeta enkrat; ne tekmujeta za njega.

## Okno za prenos

Dispečer upošteva le dogodke, objavljene v **zadnjih petih minutah**. Starejši dogodki ostanejo v dnevniku za pregled, vendar nikoli niso dostavljeni. To omejuje, kaj se zgodi po izpadu: ponovni zagon Heym po eni uri izpada ne ponovi ničesar, namesto da bi enkrat sprožil eno uro zamude.

Dogodki se hranijo **7 dni** in nato izbrišejo.

## Izhodne polja

| Izraz | Opis |
|-------|------|
| `$nodeLabel.events` | Tabela objektov dogodkov, najstarejši prvi. Vedno tabela. |
| `$nodeLabel.events[0].id` | UUID dogodka |
| `$nodeLabel.events[0].name` | Ime dogodka, na primer `workflow.created` |
| `$nodeLabel.events[0].payload` | Telo dogodka |
| `$nodeLabel.events[0].workflow_id` | ID predmeta workflowa ali `null` za `heym.started` |
| `$nodeLabel.events[0].created_at` | ISO časovni žig, ko je bil dogodek objavljen |
| `$nodeLabel.count` | Število dogodkov v tej seriji |
| `$nodeLabel.triggered_at` | ISO časovni žig za izvajanje workflowa |

### Oblike Payloada

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nočni poročilo",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` nosi ime, zajeto tik pred izbrisom, saj je vrstica workflowa izbrisana, preden preberete dogodek.

## Primer Workflowa

**Revizijska sled sprememb workflowa**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** oznaka `platformEvents`, naročena na `workflow.created`, `workflow.updated`, `workflow.deleted`
- **Heym** vozlišče z `getWorkflow` in `heymWorkflowId` nastavljeno na `$platformEvents.events[0].workflow_id`
- **Slack** sporočilo: `"$platformEvents.count sprememb workflowa, najnovejši: $platformEvents.events[0].name"`

## Opombe

- `heym.started` se sproži **enkrat ob zagonu platforme**, ne enkrat na delavca, čeprav Heym deluje z osmimi delavci na kontejner. Kontejnerji, ki se zaženejo več kot pet minut narazen, vsak objavijo en dogodek.
- Izvršitve, sprožene na ta način, se pojavijo v zgodovini z `trigger_source = "heym_event"`.
- Nastavite **Dogodke** na noben, namesto da bi naštevali vseh štiri, če želite samodejno prevzeti vrste dogodkov, dodane v prihodnjih različicah.

## Sorodno

- [Heym](./heym-node.md) – Preberite workflows in zgodovino izvrševanja
- [Triggers](../reference/triggers.md) – Pregled vseh vstopnih točk workflowa
- [Loop](./loop-node.md) – Ukrepajte enkrat na dogodek v seriji
