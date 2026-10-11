# Notă lipicioasă

Nodul **Notă lipicioasă** adaugă note markdown bogate pe canvas. Acesta nu este executat—utilizați-l pentru documentație, instrucțiuni, imagini de referință sau note pentru workflow.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 |
| Ieșiri | 0 |
| Ieșire | N/A (nu se execută) |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `stickyTitle` | string | Titlul afișat în partea de sus a notei lipicioase. |
| `stickyColor` | string | Culoarea de fundal: `yellow`, `sky`, `emerald`, `rose`, `violet` sau `zinc`. |
| `note` | string | Conținut Markdown. Faceți dublu clic pentru a edita pe canvas. Acceptă linkuri și markdown pentru imagini precum `![Alt](https://example.com/image.png)`. |

## Exemplu

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Organizarea workflow-urilor](../reference/workflow-organization.md) – Organizați workflow-urile
