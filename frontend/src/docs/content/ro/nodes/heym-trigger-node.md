# Heym Trigger

Nodul **Heym Trigger** pornește un workflow atunci când Heym însuși publică un eveniment de platformă. Este un nod de intrare fără intrări, destinat automatizării Heym cu Heym: urmărirea modificărilor pentru audit, anunțuri de implementare și rapoarte privind starea instanței.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Acreditări | Nu sunt necesare |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `eventNames` | Matrice de șiruri | Ce evenimente să fie abonate. Lăsați gol pentru a primi toate evenimentele. |

## Evenimente

| Eveniment | Publicat când | Domeniu |
|-------|----------------|-------|
| `heym.started` | Platforma Heym pornește | La nivel de instanță: fiecare abonat îl primește |
| `workflow.created` | Un workflow este creat | Doar abonații proprietarului workflow-ului |
| `workflow.updated` | Un workflow este salvat | Doar abonații proprietarului workflow-ului |
| `workflow.deleted` | Un workflow este șters | Doar abonații proprietarului workflow-ului |

Widgeturile din panoul de control sunt stocate intern ca workflow-uri, dar nu produc niciodată evenimente `workflow.*`.

## Livrarea este grupată

Heym trimite evenimente la fiecare cinci secunde. **Fiecare eveniment revendicat într-o singură trecere de trimitere ajunge într-o singură execuție de workflow**, sub formă de matrice.

- Creați două workflow-uri la interval de cinci secunde unul de celălalt → **o singură** execuție cu două evenimente.
- Creați un workflow → **o singură** execuție cu o matrice cu un singur element.

Structura nu se schimbă niciodată, astfel încât expresiile din aval nu trebuie să ramifice niciodată în funcție de faptul că a sosit un eveniment sau mai multe. Când aveți nevoie să acționați o dată pentru fiecare eveniment, plasați un nod [Loop](./loop-node.md) peste `$nodeLabel.events`.

## Livrare exact-o-dată

Fiecare eveniment este revendicat per nod abonat printr-o constrângere unică de bază de date înainte de a fi livrat. Acest lucru se menține pentru fiecare worker uvicorn, fiecare container și fiecare mașină: rularea Heym pe două servere nu livrează un eveniment de două ori. Dacă o revendicare nu poate fi înregistrată, evenimentul nu este livrat deloc — designul eșuează în siguranță în loc să se declanșeze de două ori.

Două noduri `heymTrigger` diferite abonate la același eveniment îl primesc fiecare o dată; ele nu concurează pentru el.

## Fereastra de trimitere

Dispecerul ia în considerare doar evenimentele publicate în **ultimele cinci minute**. Evenimentele mai vechi rămân în jurnal pentru inspecție, dar nu sunt niciodată livrate. Acest lucru limitează ceea ce se întâmplă după o perioadă de nefuncționare: repornirea Heym după o oră offline nu redă nimic, în loc să declanșeze o oră de acumulări dintr-o dată.

Evenimentele sunt păstrate timp de **7 zile**, apoi sunt șterse.

## Câmpuri de ieșire

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.events` | Matrice de obiecte de eveniment, cel mai vechi primul. Întotdeauna o matrice. |
| `$nodeLabel.events[0].id` | UUID-ul evenimentului |
| `$nodeLabel.events[0].name` | Numele evenimentului, de exemplu `workflow.created` |
| `$nodeLabel.events[0].payload` | Corpul evenimentului |
| `$nodeLabel.events[0].workflow_id` | Id-ul workflow-ului subiect sau `null` pentru `heym.started` |
| `$nodeLabel.events[0].created_at` | Marcaj temporal ISO pentru momentul publicării evenimentului |
| `$nodeLabel.count` | Numărul de evenimente din acest lot |
| `$nodeLabel.triggered_at` | Marcaj temporal ISO pentru execuția workflow-ului |

### Structuri de payload

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

`workflow.deleted` conține numele capturat chiar înainte de ștergere, deoarece rândul workflow-ului nu mai există în momentul în care citiți evenimentul.

## Exemplu de workflow

**Urmărirea modificărilor pentru audit**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** cu eticheta `platformEvents`, abonat la `workflow.created`, `workflow.updated`, `workflow.deleted`
- Nod **Heym** cu `getWorkflow` și `heymWorkflowId` setat la `$platformEvents.events[0].workflow_id`
- Mesaj **Slack**: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Note

- `heym.started` se declanșează **o dată per pornire a platformei**, nu o dată per worker, chiar dacă Heym rulează opt workeri per container. Containerele care pornesc la mai mult de cinci minute distanță publică fiecare câte un eveniment.
- Execuțiile declanșate astfel apar în istoric cu `trigger_source = "heym_event"`.
- Setați **Events** la niciunul, în loc să listați toate cele patru, dacă doriți să preluați automat tipurile de evenimente adăugate în versiunile viitoare.

## Resurse conexe

- [Heym](./heym-node.md) – Citirea workflow-urilor și a istoricului execuțiilor
- [Triggers](../reference/triggers.md) – Prezentare generală a tuturor punctelor de intrare în workflow
- [Loop](./loop-node.md) – Acționați o dată pentru fiecare eveniment dintr-un lot
