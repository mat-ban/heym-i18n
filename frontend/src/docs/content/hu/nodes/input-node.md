# **Input**

Az **Input** csomópont azon workflow-k belépési pontja, amelyek adatokat fogadnak a felhasználótól vagy az API hívótól. Támogat egy vagy több bemeneti mezőt, és elérhetővé teszi a kérés metaadatait (headers, query paraméterek).

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `value` | string | Alapértelmezett érték egyetlen szöveges bemenethez (opcionális) |
| `inputFields` | array | Bemeneti mező definíciók. Mindegyik: `{ key, defaultValue? }` |

### Bemeneti mezők

| Mező | Típus | Leírás |
|-------|------|-------------|
| `key` | string | Mező kulcsa (pl. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Alapértelmezett érték, ha nincs megadva (opcionális) |

## Bemeneti adatok elérése

**Body mezők** (mindig használja a `$nodeLabel.body.fieldKey` formát):

- `$userInput.body.text` – szöveges mező
- `$userInput.body.imageUrl` – kép URL
- `$userInput.body.userId` – alapértelmezett értékkel, ha be van állítva
- `$userInput.body.event.user.id` – beágyazott JSON Generic webhook módból

**Kérés metaadatok** (API-n keresztüli futtatás esetén):

- `$userInput.headers` – összes header (a kulcsok kisbetűsek)
- `$userInput.headers.authorization` – adott header
- `$userInput.query` – query paraméterek
- `$userInput.query.param1` – adott query param

## Fájlbemenet a Run panelen

A szerkesztő **Run** fülén (Defined webhook mód) minden bemeneti mező támogatja a drag-and-drop műveletet és egy beágyazott csatolmány-vezérlőt (a mező jobb alsó sarkában):

- A **szöveges fájlokat** (`.txt`, `.md`, `.json`, `.csv` és hasonlók) egyszerű szövegként olvassa be.
- A **képeket** (JPEG, PNG, GIF, WebP) `data:` URL-ként (base64) tárolja a mező értékében — használjon olyan mezőkulcsokat, mint az `imageUrl` vagy a `base64`, amikor a downstream csomópontok képadatokat várnak.
- A **PDF** fájlokat kinyert szöveggé alakítja (max. 5 MB fájlméret, 100k karakter tartalom).

Mezőnként egy fájl. A szövegmező a fájl betöltése után is szerkeszthető. A Generic webhook mód (nyers JSON body) nem jelenít meg mezőnkénti fájlvezérlőket.

## Bemeneti mezők vs Generic webhookok

Az `inputFields` továbbra is leírja a várt bemeneteket a defined módú szerkesztő űrlapokhoz, a sub-workflow leképezéshez és más metaadat-vezérelt felületekhez.

Amikor egy workflow **Generic** webhook body módot használ, a beérkező HTTP body nem kerül átalakításra az `inputFields` alapján. Ehelyett a nyers JSON payload kerül átadásra a `$nodeLabel.body` számára, és az Input csomópont mező hozzáadása/eltávolítása vezérlők elrejtésre kerülnek a csomópont panelen.

## Példák

**Egyetlen bemenet (alapértelmezett):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Több bemenet:**

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

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Triggerek](../reference/triggers.md) – Belépési pontok (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Hivatkozás a `$nodeLabel.body`, `$nodeLabel.query` elemekre
- [Portal](../reference/portal.md) – Workflow-k közzététele Chat felületekként
- [Webhookok](../reference/webhooks.md) – HTTP trigger workflow-khoz
