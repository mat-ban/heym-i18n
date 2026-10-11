# Előzmények

Az Előzmények a workflow mentett verzióit követi nyomon. Használja arra, hogy megtekintse az időbeli változásokat, összehasonlítsa a verziókat, vagy visszaálljon egy korábbi állapotra.

**Megjegyzés:** Az Előzmények különbözik a [Futtatások előzményeitől](./execution-history.md). Az Előzmények a **mentéseket** (a workflow szerkezetének változásait) követi nyomon; a Futtatások előzményei a **futtatásokat** (a korábbi végrehajtásokat).

## Hol található

**Szerkesztő eszköztár** → **Előzmények** (GitBranch ikon)

## Verziók

Minden alkalommal új verzió jön létre, amikor **menti** a workflow-t. A lista a következőket mutatja:

- **Aktuális** – A legutóbb mentett állapot (amit a vásznon lát)
- **N. verzió** – Korábbi mentések időbélyeggel

Azok a verziók, amelyek nem tartalmaznak változást az előzőhöz képest, rejtve maradnak.

## Diff nézet

Válasszon ki egy verziót, hogy lássa, mi változott az aktuális workflow-hoz képest:

| Változás típusa | Leírás |
|-------------|--------------|
| **Csomópontok** | Hozzáadott, eltávolított vagy módosított csomópontok |
| **Élek** | Hozzáadott, eltávolított vagy módosított kapcsolatok |
| **Konfiguráció** | Workflow-szintű beállítások (hitelesítés, sebességkorlátok stb.) |

Bontsa ki az egyes változásokat, hogy mezőszintű diffeket lásson (pl. mely csomóponttulajdonságok változtak).

## Előnézet

Ha szeretné látni, hogyan nézett ki a workflow egy korábbi verzióban, kattintson a **Előnézet** gombra a Visszaállítás mellett.

Megnyílik egy írásvédett vászon, amely az adott verzió csomópontjait és éleit mutatja. Pásztázhat és nagyíthat a elrendezés felfedezéséhez; ebből a nézetből nem lehet változtatásokat végrehajtani.

## Visszaállítás

Egy korábbi verzió visszaállításához:

1. Válassza ki a kívánt verziót
2. Kattintson a **Visszaállítás** gombra
3. Erősítse meg a műveletet
4. Az aktuális workflow helyére a kiválasztott verzió lép; az oldal újratöltődik

A visszaállítás egy új „aktuális” állapotot hoz létre – szükség esetén ismét visszaállíthat.

## Előzmények törlése

Kattintson a kuka ikonra a párbeszédpanel fejlécében, hogy eltávolítsa a teljes verzióelőzményt. Ez a művelet nem vonható vissza. Az aktuális workflow megmarad; csak a korábbi verziók törlődnek.

## Mikor jönnek létre a verziók

A verziók csak akkor jönnek létre, amikor **menti** a workflow-t (Ctrl/Cmd+S vagy a Mentés gomb). A nem mentett változtatások nem kerülnek be az Előzményekbe a mentésig.

Az Agent skill szerkesztései is szerepelnek ezekben a pillanatképekben. Ha egyetlen skillt szeretne böngészni vagy visszaállítani a teljes workflow visszaállítása nélkül, használja a **Előzmények** gombot az adott skill kártyáján az Agent csomópont tulajdonságpaneljén. Lásd: [Agent csomópont](../nodes/agent-node.md#skill-history).

## Kapcsolódó

- [Futtatások előzményei](./execution-history.md) – Korábbi futtatások és Vászonra hozás
- [Workflow szerkezete](./workflow-structure.md) – Csomópont- és élformátum
- [Workflow-k lap](../tabs/workflows-tab.md) – Workflow-k létrehozása és kezelése
