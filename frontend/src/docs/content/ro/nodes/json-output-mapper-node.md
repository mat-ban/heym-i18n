# Mapare ieșire JSON

Nodul **Mapare ieșire JSON** construiește un obiect JSON din [mapări](./set-node.md) cheie/valoare (același model ca [Set](./set-node.md)). Utilizați-l atunci când apelanții trebuie să primească un **corp JSON simplu** la rădăcina răspunsului.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 0 (sink) |
| Ieșire la runtime | Obiect construit din `mappings` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `mappings` | array | Intrări `{ "key": "fieldName", "value": "expression" }` (la fel ca la Set) |

## Utilizarea ca instrument pentru agent

Nu este acceptată. Acest nod este un sink terminal, prin urmare nu poate fi atașat la un handle de instrumente al unui [Nod Agent](./agent-node.md). Utilizați un nod [Set](./set-node.md) atunci când un agent trebuie să modeleze valori în timpul conversației.

## Comportamentul Webhook și la execuție

Atunci când acest nod este **singura** ieșire terminală a workflow-ului, **ieșirile** execuției sunt obiectul mapat în sine: cheile din `mappings` apar la **nivelul superior** al JSON-ului. **Nu** există un wrapper exterior indexat după eticheta nodului și **nu** există un obiect `{ "result": ... }` (spre deosebire de nodul [Output](./output-node.md)).

Dacă mai multe noduri terminale produc ieșiri (de exemplu [Output](./output-node.md) plus Mapare ieșire JSON, sau mai multe ramuri), Heym utilizează forma normală: fiecare terminal este indexat după `label`-ul său.

## Restricție pentru bucle

Aceeași regulă ca la [Output](./output-node.md): nu plasați acest nod în interiorul unei ramuri de iterație a buclei—doar după ramura `done` a buclei. Consultați [Loop](./loop-node.md).

## Exemplu

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Resurse conexe

- [Set](./set-node.md) – Aceeași mecanică de mapare pentru transformări intermediare
- [Output](./output-node.md) – Răspuns bazat pe mesaj sau pe schemă cu împachetare `result`
- [Tipuri de noduri](../reference/node-types.md) – Toate tipurile de noduri
- [Structura workflow-ului](../reference/workflow-structure.md) – Formatul JSON al workflow-ului
- [Webhooks](../reference/webhooks.md) – Endpoint-ul de execuție și răspunsurile
