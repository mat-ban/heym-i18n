# Kifejezésértékelő párbeszédpanel

A Kifejezésértékelő párbeszédpanel a kifejezésképes mezők kibővített szerkesztője. A kifejezésbeviteli mező melletti kibontás gombbal nyitható meg, és egy helyen kínál nagyobb munkaterületet, automatikus kiegészítést, élő backend előnézetet és kimenetböngészést.

## A párbeszédpanel megnyitása

- Kattintson a kibontás gombra a Tulajdonságok panel valamelyik kifejezésmezője mellett.
- A többsoros mezők a gombot a beviteli mezőn belül jelenítik meg.
- Az egysoros mezők a gombot a beviteli mezőtől jobbra jelenítik meg.

## A párbeszédpanel elrendezése

- A párbeszédpanel középre igazított modálisként nyílik meg, körülbelül **80vw × 80vh** méretben.
- A fejléc **Evaluate — {field name}** feliratot mutat, ha a mező címkéje ismert.
- A szerkesztő megőrzi az automatikus kiegészítést, a mezők közötti navigációt és a szokásos **Apply** / **Cancel** műveleteket.
- Az előnézet körülbelül **300 ms**-mal azután frissül automatikusan, hogy Ön abbahagyja a gépelést.
- Nyomja meg a `Ctrl` / `Cmd` + `Enter` billentyűkombinációt, hogy az aktuális szöveget visszaalkalmazza a mezőre és bezárja a párbeszédpanelt (ugyanaz, mint az **Apply**).

## Kimeneti szakasz

A Kimenet terület automatikusan frissül, miután Ön szünetet tart a szerkesztőben való gépelésben.

### Értékelés

| Kifejezéstípus | Eredmény |
|---|---|
| Egyetlen `$expr` (a teljes mező) | A natív érték megőrződik |
| Egyetlen csupasz pontútvonal (a teljes mező, `$` nélkül, beágyazott sortörés nélkül) | Ugyanaz, mint a `$` + az az útvonal (a backend az értékeléshez normalizálja) |
| Beágyazott `$refs`-eket tartalmazó szöveg | A végeredmény mindig szöveg |
| Literál szöveg (nincs `$`, nem egyetlen pontútvonal) | Változatlanul visszaadva |

**Példák**

| Bemenet | Eredmény |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (ugyanaz, mint a `$input.items`, ha a teljes érték ez az útvonal) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Az értékelési kontextus a következő sorrendben épül fel:

- **Rögzített adatok** a felsőbb csomópontokon
- **Legutóbbi futtatás kimenetei** a vászonról
- `null`, ha nem érhető el felsőbb adat

Ha az aktuális csomópontnak vannak felsőbb függőségei, de egyiknek sincs rögzített adata vagy legutóbbi futtatási eredménye, a párbeszédpanel először egy tesztfuttatást hajt végre a kontextus felépítéséhez, majd kiértékeli az aktuális szöveget.

### Kimeneti útvonalválasztó

Amikor a backend eredménye objektum vagy tömb, a Kimenet terület interaktív útvonalválasztót jeleníthet meg a nyers JSON helyett.

- Kattintson duplán egy sorra, hogy hozzáfűzze az adott útvonalat az aktuális `$node.path` hivatkozáshoz.
- Kattintson egyszer a kibontható sorokra az ágak megnyitásához vagy bezárásához.
- Használja a beépített keresőmezőt kulcsok, értékek és útvonalszövegek kereséséhez.

## Automatikus kiegészítés

- Gépeljen `$` karaktert a felsőbb csomópontokra, beépített elemekre és metódusokra vonatkozó javaslatok megnyitásához.
- Nyomja meg a `Tab` vagy `Enter` billentyűt a kiválasztott javaslat beszúrásához.
- Használja a `↑` / `↓` billentyűket a javaslatlistában való mozgáshoz.

### Példaválaszok

Amikor egy `$…` hivatkozást ponttal folytat, minden javaslati sor megmutatja azt a választ, amelyet az adott javaslat előállítana, félkövéren a sor jobb oldalán.

- A `$set.listItems.first().toString().u` beírása felsorolja az `upper`, `urlEncode`, `urlDecode` és `unescape` elemeket, mindegyik mellett a kiértékelt eredményével — így az eredmény alapján választhat a név helyett.
- A `$node.text.toJson()` beírása egy JSON szöveget objektummá vagy tömbbé alakít. A `.toJson()` után az automatikus kiegészítés felkínálhatja a feldolgozott kulcsokat (például `repoUrl`), ha elérhető a legutóbbi futtatás vagy a rögzített kimenet.
- Az eredmények a backenden értékelődnek ki ugyanazon rögzített adatok és legutóbbi futtatási kimenetek alapján, amelyeket a párbeszédpanel előnézete használ, így megegyeznek azzal, amit a mező előállít.
- Csak az önmagukban megálló javaslatok értékelődnek ki: nulla argumentumú metódusok (`upper()`, `first()`, `keys()`, `toJson()`) és egyszerű tulajdonságok (`length`, `year`). Azok a javaslatok, amelyek először argumentumokat igényelnek — `map`, `filter`, `sort`, `replace` — üresen maradnak.
- Egy sor üresen marad, ha a jelölt nem állít elő választ: hiba, `null`, vagy olyan metódus, amely nem alkalmazható arra az értékre.
- A válaszok egy sorra rövidülnek. Vigye az egérmutatót egy rövidített válasz fölé, hogy többet lásson belőle.

## Építés AI-jal

Az **Build with AI** gomb az értékelő párbeszédpanel jobb felső sarkában jelenik meg, amikor egy workflow betöltődött. Egy beágyazott modálist nyit meg, ahol egyszerű szövegben leírhatja a kívánt kifejezést, és egy LLM előállítja azt Önnek.

### Hogyan működik

1. Kattintson a **Build with AI** gombra az értékelő párbeszédpanel eszköztárán.
2. Válasszon LLM hitelesítési adatot és modellt a legördülő menükből.
3. Írja be a kívánt dolog egyszerű szöveges leírását — például *"Get the customer name from the API response"*.
4. Kattintson a **Generate** gombra. A modális meghívja a backendet, amely az [Expression DSL](./expression-dsl.md) rendszer-promptot, valamint az Ön legutóbbi workflow-futtatásának kimeneteit használja kontextusként, és egyetlen kifejezésszöveget ad vissza.
5. Az előállított kifejezés azonnal kiértékelődik ugyanazon vászonadatok alapján, így az alkalmazás előtt láthatja az eredményt.
6. Kattintson az **Apply** gombra, hogy a szerkesztő tartalmát az előállított kifejezésre cserélje, vagy a **Regenerate** gombra az újrapróbálkozáshoz.

### Felhasznált kontextus

A generátor megkapja a vászon legutóbbi tesztfuttatásából származó csomópontkimeneteket. Ha a workflow-t még nem futtatták, az LLM a csomópontcímkék és a DSL konvenciók alapján a lehető legjobb kifejezést állítja elő.

### Követelmények

- Egy LLM hitelesítési adatot (OpenAI, Google vagy Custom) kell konfigurálni a [Credentials](./credentials.md) lapon.
- A workflow-nak nyitva kell lennie a szerkesztőben.

## Billentyűparancsok

| Parancs | Művelet |
|---|---|
| Gépelési szünet (~300 ms) | A backend előnézet frissítése |
| `Ctrl` / `Cmd` + `Enter` | Alkalmazás és a párbeszédpanel bezárása |
| `Escape` | Először az automatikus kiegészítés bezárása, egyébként a párbeszédpanel bezárása |
## Beágyazott `$` a metódusargumentumokban

Párbeszédpanel / backend értékelés esetén átadhat egy másik hivatkozást beágyazott `$` jellel olyan hívásokban, mint a `.get($other.field)`, amikor dinamikus kulcsra van szüksége. A `.get(...)` belsejében egy csupasz útvonalat is használhat (például `other.field`); a backend ugyanúgy oldja fel. A mentett workflow-mezőknek továbbra is az [Expression DSL](./expression-dsl.md) szabályait kell követniük; az evaluate API a kényelem érdekében egy teljes soros csupasz pontútvonalat is elfogad (lásd a fenti táblázatot).

## Navigáció

A Set és Execute mapping szerkesztők **Prev** / **Next** gombokat jeleníthetnek meg, így a párbeszédpanel bezárása nélkül válthat a mezők között.

## Kapcsolódó

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — a Build with AI funkcióhoz szükséges
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
