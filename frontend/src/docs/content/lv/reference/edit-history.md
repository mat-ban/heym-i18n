# Rediģēšanas vēsture

Rediģēšanas vēsture seko līdzi saglabātajām workflow versijām. Izmantojiet to, lai skatītu izmaiņas laika gaitā, salīdzinātu versijas vai atgrieztos iepriekšējā stāvoklī.

**Piezīme:** Rediģēšanas vēsture atšķiras no [Izpildes vēstures](./execution-history.md). Rediģēšanas vēsture seko līdzi **saglabāšanām** (workflow struktūras izmaiņām); Izpildes vēsture seko līdzi **palaišanām** (iepriekšējām izpildēm).

## Kur to atrast

**Redaktora rīkjosla** → **Rediģēšanas vēsture** (GitBranch ikona)

## Versijas

Jauna versija tiek izveidota katru reizi, kad **saglabājat** workflow. Sarakstā tiek parādīts:

- **Current** – Jaunākais saglabātais stāvoklis (tas, ko redzat uz kanvas)
- **Version N** – Iepriekšējās saglabāšanas ar laika zīmogiem

Versijas, kurās nav izmaiņu salīdzinājumā ar iepriekšējo, tiek paslēptas.

## Atšķirību skats

Izvēlieties versiju, lai redzētu, kas mainījies salīdzinājumā ar pašreizējo workflow:

| Izmaiņu veids | Apraksts |
|-------------|--------------|
| **Nodes** | Pievienoti, noņemti vai modificēti mezgli |
| **Edges** | Pievienoti, noņemti vai modificēti savienojumi |
| **Config** | Workflow līmeņa iestatījumi (autentifikācija, pieprasījumu ierobežojumi utt.) |

Izvērsiet katras izmaiņas, lai redzētu lauku līmeņa atšķirības (piem., kuras mezgla īpašības mainījās).

## Priekšskatījums

Lai redzētu, kā workflow izskatījās iepriekšējā versijā, noklikšķiniet uz **Preview** blakus Revert.

Atveras tikai lasāms kanvas, kurā redzami šīs versijas mezgli un savienojumi. Varat pārvietot un tuvināt, lai izpētītu izkārtojumu; no šī skata izmaiņas nav iespējams veikt.

## Atgriešana

Lai atjaunotu iepriekšēju versiju:

1. Izvēlieties versiju, kuru vēlaties atjaunot
2. Noklikšķiniet uz **Revert**
3. Apstipriniet darbību
4. Pašreizējais workflow tiek aizstāts ar izvēlēto versiju; lapa tiek pārlādēta

Atgriešana izveido jaunu "current" stāvokli—ja nepieciešams, varat atgriezties vēlreiz.

## Vēstures notīrīšana

Noklikšķiniet uz atkritnes ikonas dialoga galvenē, lai noņemtu visu versiju vēsturi. Šo darbību nevar atsaukt. Pašreizējais workflow paliek; tiek dzēstas tikai iepriekšējās versijas.

## Kad versijas tiek izveidotas

Versijas tiek izveidotas tikai tad, kad **saglabājat** (Ctrl/Cmd+S vai pogas Save). Nesaglabātas izmaiņas netiek saglabātas Rediģēšanas vēsturē, līdz tās saglabājat.

Agent skill rediģējumi tiek iekļauti šajos momentuzņēmumos. Lai pārlūkotu vai atjaunotu atsevišķu skill, neatgriežot visu workflow, izmantojiet pogu **History** attiecīgā skill kartītē Agent mezgla īpašību panelī. Skatiet [Agent Node](../nodes/agent-node.md#skill-history).

## Saistītie

- [Izpildes vēsture](./execution-history.md) – Iepriekšējās palaišanas un Bring to Canvas
- [Workflow struktūra](./workflow-structure.md) – Mezglu un savienojumu formāts
- [Workflows cilne](../tabs/workflows-tab.md) – Workflow izveide un pārvaldība
