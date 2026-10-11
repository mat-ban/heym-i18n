# Decision

A **Decision** csomópont típusos kérdéseket tesz fel egy döntési modellnek a futtatás aktuális állapotáról, és valószínűségeket ad vissza. Nem generál szöveget. Akkor érdemes használni, amikor egy workflow-nak olyan ítéletre van szüksége, amelyre elágazást lehet építeni — útvonalválasztás, triage, rangsorolás, ellenőrzés vagy egy visszafordíthatatlan lépés engedélyezése.

A döntési modellek (más néven *System One* modellek) másfajta modellek, mint az LLM-ek. Nincs bennük prompt, rendszerutasítás, temperature és tool calling. Ön egy **state**-et és egy **questions** térképet küld, és minden válasz egy számként érkezik vissza, amely mögött valószínűségeloszlás áll. Mivel egy válasz csupán néhány token, ezek a modellek gyorsak és olcsók ahhoz képest, mintha egy [LLM](./llm-node.md)-mel JSON-t generáltatnánk és azt elemeznénk.

Szöveggeneráláshoz használja az [LLM](./llm-node.md) csomópontot. Olyan modellhez, amely eszközöket hív, használja az [Agent Node](./agent-node.md) csomópontot.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | A szolgáltató válasza szó szerint — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | Egy *Decision Model* hitelesítési adat. Nem LLM hitelesítési adat. |
| `model` | string | Modellnév, például `jev-latest` |
| `state` | expression | Amit a modellnek el kell olvasnia (alapértelmezés: `$input.text`) |
| `questions` | array | Sorrendbe állított kérdéssorok; legalább egy |
| `customBodyEnabled` | boolean | Kézzel írt kérés törzsének küldése az űrlap helyett |
| `customBody` | expression (JSON) | A küldendő törzs, amikor a kapcsoló be van kapcsolva |
| `requestTimeoutSeconds` | number | Maximális várakozási idő másodpercben (alapértelmezés: 60) |

### State

A **State** az a helyzet, amelyet a modell megítél. Elfogad stringet, objektumot vagy tömböt.

Egy pontosan egy kifejezést tartalmazó mező megőrzi a saját típusát, így a `$input` magát az objektumot küldi el a szövege helyett. Egy kifejezést tartalmazó sablon (`Ticket: $input.text`) stringgé oldódik fel. Minden kérdéshez adjon elegendő információt a válaszadáshoz: forrásszöveget, azonosítókat, kapcsolatokat, szabályzatokat és aktuális tényeket.

## Kérdéstípusok

Minden kérdéshez tartozik egy `id`, egy `type`, `instructions`, valamint a típustól függő kritériumok.

Az `id` az, ahogyan a workflow visszaolvassa a választ. Ez **soha nem kerül elküldésre a modellnek**, így a teljes jelentésnek az `instructions`-ben kell lennie. Ha `id: is_urgent`-et ír `instructions: "Is it?"` utasítással, az semmit nem ad a modellnek, amivel dolgozhatna.

### Noul

Azt vizsgálja, hogy egy feltétel fennáll-e. Visszaadja annak valószínűségét, hogy a válasz igen, 0 és 1 között.

A kritériumok opcionálisak: a **Yes means** és a **No means** leírja, hogy mit fednek le az egyes oldalak. A 0,5 közeli érték azt jelenti, hogy a modell az igent és a nemet megközelítőleg egyformán valószínűnek tartja — nem pedig „közepes intenzitást”.

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Olvassa vissza a `$triage.answers.is_urgent.noul` kifejezéssel.

### Choice

Egy Ön által meghatározott halmazból választ egy opciót. Visszaadja a kiválasztott opciót, a teljes eloszlást és az abból származtatott confidence értéket.

Adjon hozzá egy „none of these” opciót, valahányszor semmi sem illeszkedhet — a modell nem tud olyan opciót választani, amelyet Ön nem kínált fel.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Olvassa vissza a `$triage.answers.department.choice`, a `.probabilities.billing` és a `.confidence` kifejezésekkel.

### Score

Egy rendezett rubrika mentén értékeli az állapotot. Visszaad egy valószínűséggel súlyozott értéket, amely a szintek **közé** is eshet, valamint a legendát és az eloszlást.

A szintek a legalacsonyabbtól kezdődnek, legalább kettő és legfeljebb tíz. Minden szintnek konkrét helyzetet kell leírnia, és önmagában is meg kell állnia.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Olvassa vissza a `$triage.answers.frustration.score`, a `.legend` és a `.confidence` kifejezésekkel.

## Generate with AI

A **Generate with AI** egy egyszerű mondatból javasolt state-sablont és egy sor kérdéssort készít. Írja le, mit szeretne megítéltetni — „triage an incoming support ticket: how urgent it is, which team owns it, and how frustrated the customer sounds” —, és nézze át az eredményt, mielőtt hozzáadná a csomóponthoz.

A piszkozatot egy LLM készíti, ezért a párbeszédablak LLM hitelesítési adatot kér. A döntési modell később, a workflow futtatásakor válaszol a kérdésekre. A generált id-k ütközésmentesítése megtörténik a csomópontban már meglévő sorokkal szemben, így a kétszeri generálás soha nem írja felül a meglévő válaszkulcsot.

Minden generálás rögzítésre kerül a [Traces](../tabs/traces-tab.md) fülön a **Decision Questions** forrás alatt, a csomópont által futtatáskor írt `decision.systemone` trace-ek mellett.
## Egyéni kéréstörzs

Kapcsolja be az **Egyéni kéréstörzs** lehetőséget, hogy a saját maga által írt JSON-t küldje el az űrlap helyett. Akkor használja, ha egy endpoint szerződése eltér attól, amelyet az űrlap felépít.

A szerkesztő az aktuális űrlapból indul ki, és a benne lévő kifejezések a kérés elküldése előtt kiértékelődnek. Amíg a kapcsoló be van kapcsolva, a State mező és a kérdéssorok figyelmen kívül maradnak. A válasz mindkét esetben változatlanul kerül továbbításra, így egy eltérő szerződés egyszerűen más alakot eredményez, amelyet a kifejezések olvashatnak.

## Kimenet

A csomópont pontosan azt adja vissza, amit a szolgáltató visszaadott. Semmi sem kerül átnevezésre vagy lapításra.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Elágazás egy válasz alapján

A [Switch](./switch-node.md) csomópont a kiválasztott opció alapján irányít, a [Condition](./condition-node.md) csomópont pedig az alacsony megbízhatóságú eseteket oda küldheti, ahol egy ember látni fogja őket:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

A típusos válasz az alakot garantálja, nem az igazságot. A küszöbértékeket a saját adatai és következményei alapján válassza meg, ne másoljon számot egy példából.

## Hitelesítési adatok

Hozzon létre egy **Decision Model** hitelesítési adatot a [Hitelesítési adatok](../tabs/credentials-tab.md) lapon a következőkkel:

- **Base URL** — az endpoint, például `https://api.typesafe.ai`. A Heym hozzáfűzi a `/v1/systemone` útvonalat.
- **API Key** — opcionális. Azok az endpointok, amelyek nem igényelnek kulcsot, üresen hagyhatók.

Egy hitelesítési adat szerkesztésekor a tárolt kulcs megmarad, ha a kulcs mező üresen marad; csak akkor írja be újra, ha le szeretné cserélni.

Ugyanez a hitelesítési adat képes megítélni az [Evals](../tabs/evals-tab.md) futtatásokat: az **LLM-as-Judge** kiválasztásával válassza ki bírálóként, és a döntési modell minden választ az elvárt kimenethez viszonyítva pontoz.

A Heym alapértelmezés szerint blokkolja a privát és loopback címekre irányuló kimenő kéréseket, így a `localhost`-on vagy privát tartományban saját maga által futtatott döntési endpointhoz a `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` beállítás szükséges.

A döntési modellek nem jelennek meg a Heym által szinkronizált LLM árazási táblázatokban, így a **Cost** oszlop a [Traces](../tabs/traces-tab.md) nézetben üresen marad ezeknél a hívásoknál. A tokenek száma továbbra is rögzítésre kerül, és saját árat adhat meg egy árazási felülírással.

## Hibák

| Helyzet | Mi történik |
|-----------|--------------|
| Érvénytelen API key | A csomópont meghibásodik egy üzenettel, amely megnevezi a hitelesítési adatot |
| Hibás kérdés | A szolgáltató saját mezőszintű üzenete bekerül a csomópont hibájába |
| Sebességkorlátozás vagy túlterheltség | A csomópont meghibásodik egy üzenettel, amely szerint a feltétel átmeneti — kapcsolja be a [retry](../reference/features.md) lehetőséget ennél a csomópontnál, hogy átvészelje |
| Duplikált vagy üres kérdésazonosító | A csomópont meghibásodik, mielőtt bármilyen kérés elküldésre kerülne |

## Kapcsolódó

- [LLM Node](./llm-node.md) – Szöveg generálása ítélet helyett
- [Agent Node](./agent-node.md) – Bizonyítékok gyűjtése eszközökkel, majd azok megítélése itt
- [Switch Node](./switch-node.md) – Irányítás a kiválasztott opció alapján
- [Condition Node](./condition-node.md) – Kapuzás megbízhatóság alapján
- [Node Types](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Credentials](../reference/credentials.md) – Hitelesítési adatok típusai és mezői
- [Traces Tab](../tabs/traces-tab.md) – Döntési hívások és tokenhasználat vizsgálata
