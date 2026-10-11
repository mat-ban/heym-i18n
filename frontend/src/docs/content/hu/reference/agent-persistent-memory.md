# Ügynökök tartós memóriája

Az ügynök csomópontok **csomópontonkénti tudásgráfot** tarthatnak fenn az adatbázisban: entitásokat (típusokkal és tulajdonságokkal) és a köztük lévő kapcsolatokat. Ha engedélyezve van, a Heym **a gráf összefoglalóját a system promptba injektálja** minden futtatás során (ha a gráf nem üres). Sikeres futtatás után egy **LLM-kinyerési feladat** a háttérben beolvasztja a beszélgetésből származó új tényeket a gráfba.

Az al-ügynökök és orchestratorok alapértelmezés szerint mindig a **saját vászon-csomópontjukhoz** tartozó gráfot használják. Emellett **más ügynököknek is adhat olvasási vagy olvasási/írási hozzáférést** ehhez a csomóponthoz tartozó gráfhoz (beleértve az **Ön tulajdonában lévő más workflow-kban** lévő ügynököket is)—lásd: [Megosztás más ügynökökkel](#sharing-with-other-agents).

## Engedélyezés

| Paraméter | Típus | Leírás |
|-----------|------|--------|
| `persistentMemoryEnabled` | boolean | Ha `true`, betölti ennek a csomópontnak a gráfját a system promptba, és ütemezi a futtatás utáni kinyerést erre a csomópontra vonatkozóan |
| `memoryShares` | array (opcionális) | Hozzáférést ad más ügynök csomópontoknak **ehhez** a csomóponthoz tartozó memóriagráfhoz; lásd: [Megosztás](#sharing-with-other-agents) |

Kapcsolja be az ügynök csomópont tulajdonságai között (**Persistent memory (graph)**). A csomóponton megjelenő rózsaszín **agy** ikon megnyitja a gráfszerkesztőt, ha a memória engedélyezve van (vagy ha egy modell megjelenik).

## Gráfszerkesztő

A párbeszédpanel az entitásokat animált, erővezérelt gráfként jeleníti meg — a kapcsolatok száma szerint méretezett, entitástípus szerint klaszterezett színes körökként —, valamint szerkesztési és navigációs lehetőségekkel (nézet igazítása, elrendezés rendezése, billentyűparancsok). A csomópontokat és éleket **manuálisan hozzáadhatja, szerkesztheti vagy törölheti**; a Source/Target kapcsolatválasztók sok entitást tartalmazó gráfok esetén kereshetők. Egy csomópont kiválasztásakor megjelennek annak kimenő és bejövő kapcsolatai, amelyek mindegyike kattintható az adott csomópontra való ugráshoz. A módosítások **kizárólag erre** az ügynökre vonatkozó gráfra érvényesek (arra a gráfra, amely ahhoz a vászon-csomóponthoz tartozik, amelynek az agy ikonját megnyitotta).

## Megosztás más ügynökökkel

A memóriagráf párbeszédpaneljén a **Share memory with other agents** lehetőséggel **társakat** csatolhat, amelyek futásidőben fogyaszthatják ezt a gráfot:

1. Válasszon egy **workflow-t** (bármely workflow-t, amelyet meg tud nyitni a szerkesztőben).
2. Válasszon egy **ügynök** csomópontot abban a workflow-ban.
3. Állítsa be a **Read only** vagy **Read & write** értéket.

| Jogosultság | Hatás |
|-------------|-------|
| Read only | Amikor a **társ** ügynök fut, ez a gráf beolvad a társ system promptjába (ha vannak entitásai). A társ futtatásából nem történik kinyerés ebbe a gráfba. |
| Read & write | Ugyanaz a prompt-viselkedés, mint az olvasásnál, és egy **sikeres** társ-befejezést követően a szokásos memóriakinyerés **beolvadhat ebbe (a tulajdonos) gráfjába** a társ futtatásához tartozó hitelesítési adatok használatával. |

A társak tulajdonos csomópontonként `memoryShares` bejegyzésként tárolódnak `peerWorkflowId` és `peerCanvasNodeId` (valamint `permission`) mezőkkel. A régebbi workflow-k elhagyhatják a `peerWorkflowId` mezőt az **ugyanabban** a workflow-ban lévő társak esetében; a szerkesztő ezt az aktuális workflow-ként kezeli.

A **workflow-k közötti megosztás** futásidőben az **Ön tulajdonában lévő** workflow-k átvizsgálásával oldódik fel. A hitelesített felhasználói kontextus nélküli futtatások csak az **aktuális** workflow JSON-jában (ugyanazon a vásznon) meghatározott megosztásokat oldják fel.

## Futásidejű viselkedés

### Saját gráf (`persistentMemoryEnabled`)

1. **Az LLM-hívás előtt** — Ha a gráf tartalmaz entitásokat, egy blokk kerül a system utasításba, amely elmagyarázza, hogy ezek korábbi futtatásokból származó tények (hiányosak lehetnek; ütközés esetén az aktuális felhasználói üzenet az irányadó).
2. **Sikeres befejezés után** — Egy háttérfeladat strukturált JSON-t (entitások + kapcsolatok) kér a modelltől (ugyanazzal a hitelesítési adattal, mint az ügynök futtatása). Ez a payload beolvad az adatbázisba (a deduplikáció és a kapcsolattisztítás bizonyos típusokra érvényes, például a munkaviszonyt jelző élekre).

### Megosztott gráfokat fogadó társ

Amikor egy ügynök fut, a rendszer megkeresi azokat a **tulajdonos** csomópontokat (lehetőség szerint az Ön bármely workflow-jában), amelyeknek a `memoryShares` bejegyzése erre a futtatásra vonatkozó workflow-ra és vászon-csomópontra mutat. Minden egyezésnél a tulajdonos gráfja **megosztott memória** szakaszként kerül a system promptba. A **Read & write** társak emellett kinyerési célokat ütemeznek a **tulajdonos** workflow/gráf számára, amikor a futtatás sikeres.

A kinyerés **nem** fut le, ha a futtatás hibával zárul, vagy HITL függő állapotban fejeződik be.

## Workflow JSON (`data` mező)

Az ügynök csomóponton tárolódik, mint a többi beállítás:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

A `permission` értéke `"read"` vagy `"write"`. Hagyja el a `memoryShares` mezőt, vagy használjon `[]` értéket, ha nincs megosztás.

A teljes csomópont-objektum szerkezetéről lásd: [Workflow Structure](./workflow-structure.md).

## Kapcsolódó

- [Agent Node](../nodes/agent-node.md) — Teljes ügynök-konfiguráció
- [Agent Architecture](./agent-architecture.md) — Orchestrator, al-ügynökök, eszközök
- [Workflow Structure](./workflow-structure.md) — JSON workflow formátum
- [Canvas Features](./canvas-features.md) — Agy vezérlőelem és gráf párbeszédpanel
- [Traces tab](../tabs/traces-tab.md) — LLM kérés/válasz megfigyelhetőség
