# Nodul **Input**

Nodul **Input** reprezintă punctul de intrare pentru workflow-urile care primesc date de la utilizator sau de la apelantul API. Acesta acceptă unul sau mai multe câmpuri de intrare și expune metadatele cererii (headers, query params).

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `value` | string | Valoarea implicită pentru o singură intrare text (opțional) |
| `inputFields` | array | Definițiile câmpurilor de intrare. Fiecare: `{ key, defaultValue? }` |

### Câmpuri de intrare

| Câmp | Tip | Descriere |
|-------|------|-------------|
| `key` | string | Cheia câmpului (de ex. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Valoarea implicită dacă nu este furnizată (opțional) |

## Accesarea datelor de intrare

**Câmpuri din body** (utilizați întotdeauna `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – câmp text
- `$userInput.body.imageUrl` – URL-ul imaginii
- `$userInput.body.userId` – cu valoare implicită dacă este configurată
- `$userInput.body.event.user.id` – JSON imbricat din modul Generic webhook

**Metadatele cererii** (când se execută prin API):

- `$userInput.headers` – toate headers-urile (cheile cu litere mici)
- `$userInput.headers.authorization` – un header specific
- `$userInput.query` – parametrii de query
- `$userInput.query.param1` – un parametru de query specific

## Introducerea fișierelor în panoul Run

În fila **Run** a editorului (modul Defined webhook), fiecare câmp de intrare acceptă drag-and-drop și un control de atașare inline (în colțul din dreapta jos al câmpului):

- **Fișierele text** (`.txt`, `.md`, `.json`, `.csv` și similare) sunt citite ca text simplu.
- **Imaginile** (JPEG, PNG, GIF, WebP) sunt stocate ca URL `data:` (base64) în valoarea câmpului — utilizați chei de câmp precum `imageUrl` sau `base64` atunci când nodurile din aval așteaptă date de imagine.
- **Fișierele PDF** sunt convertite în text extras (fișier de maximum 5 MB, 100k caractere de conținut).

Un fișier per câmp. Puteți edita în continuare zona de text după încărcarea unui fișier. Modul Generic webhook (body JSON brut) nu afișează controale de fișier per câmp.

## Câmpuri de intrare vs Generic Webhooks

`inputFields` descriu în continuare intrările așteptate pentru formularele editorului în modul defined, maparea sub-workflow-urilor și alte suprafețe bazate pe metadate.

Când un workflow utilizează modul **Generic** pentru body-ul webhook, body-ul HTTP primit nu este remodelat pe baza `inputFields`. În schimb, payload-ul JSON brut este transmis către `$nodeLabel.body`, iar controalele de adăugare/eliminare a câmpurilor nodului Input sunt ascunse în panoul nodului.

## Exemple

**Intrare unică (implicit):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Intrări multiple:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## Resurse conexe

- [Node Types](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Triggers](../reference/triggers.md) – Puncte de intrare (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Referirea la `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Expunerea workflow-urilor ca interfețe de chat
- [Webhooks](../reference/webhooks.md) – Trigger HTTP pentru workflow-uri
