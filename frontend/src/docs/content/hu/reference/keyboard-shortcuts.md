# Billentyűparancsok

A Heym billentyűparancsokat biztosít a workflow-szerkesztőben és a vásznon a gyakori műveletek felgyorsításához.

## Globális szerkesztői billentyűparancsok

Ezek a billentyűparancsok a workflow-szerkesztő bármely területén aktívak.

| Billentyűparancs | Művelet |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | A Parancspaletta megnyitása |
| `Ctrl + I` / `Cmd + I` | Az [AI Assistant](./ai-assistant.md) panel be- és kikapcsolása (gépelés közben is működik) |
| `Ctrl + Enter` / `Cmd + Enter` | Az aktuális workflow futtatása |
| `Ctrl + S` / `Cmd + S` | A workflow mentése |
| `Ctrl + Z` / `Cmd + Z` | Visszavonás |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Újra |
| `Ctrl + Y` / `Cmd + Y` | Újra (alternatív) |
| `Escape` | A nyitott átfedések, párbeszédablakok és panelek bezárása |

## Vászon billentyűparancsok

Ezek a billentyűparancsok akkor érvényesek, amikor a vászon fókuszban van (nincs aktív szövegbeviteli mező).

### Kijelölés és navigáció

| Billentyűparancs | Művelet |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Az összes csomópont kijelölése |
| `Shift` (nyomva tartva) | Több csomópont kijelölése húzással |
| `Ctrl` / `Cmd` (nyomva tartva) | Egyes csomópontok hozzáadása a kijelöléshez kattintással |
| `Escape` | Az összes csomópont kijelölésének megszüntetése; a beágyazott csomópontkeresés bezárása |

### Csomópontok szerkesztése

| Billentyűparancs | Művelet |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | A kijelölt csomópont(ok) másolása |
| `Ctrl + X` / `Cmd + X` | A kijelölt csomópont(ok) kivágása |
| `Ctrl + V` / `Cmd + V` | Csomópont(ok) beillesztése |
| `Delete` vagy `Backspace` | A kijelölt csomópont(ok) és/vagy él(ek) törlése |
| `D` | A kijelölt csomópont(ok) engedélyezése / letiltása |
| `P` | A rögzített adatok be- és kikapcsolása a kijelölt csomóponton |

### Beágyazott csomópontkeresés

Ha a vásznon bármilyen nyomtatható karaktert beír (amikor nincs szövegbeviteli mező fókuszban), megnyílik a beágyazott csomópontkereső felugró ablak. A beírt karakter lesz a keresési kifejezés első karaktere.

| Billentyűparancs | Művelet |
|----------|--------|
| Bármely nyomtatható karakter | A beágyazott csomópontkeresés megnyitása és a gépelés megkezdése |
| `Backspace` | Az utolsó karakter eltávolítása a keresési kifejezésből |
| `Escape` | A beágyazott csomópontkeresés bezárása |

## Parancspaletta (`Ctrl + K`)

A Parancspaletta a szerkesztőből, az irányítópultról, a dokumentációból és az értékelések nézetből érhető el. Lehetővé teszi, hogy gyorsan navigáljon a workflow-k, lapok és dokumentációs oldalak között anélkül, hogy elhagyná a billentyűzetet.

| Billentyűparancs | Művelet |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | A Parancspaletta megnyitása |
| `↑` / `↓` | Navigálás az eredménylistában |
| `Tab` / `Shift + Tab` | Navigálás az eredménylistában |
| `Enter` | A kijelölt elem megnyitása |
| `Escape` | A paletta bezárása |

## Irányítópult billentyűparancsok

Ezek a billentyűparancsok a Workflow-k lapon aktívak, amikor nincs más szövegbeviteli mező aktív.

| Billentyűparancs | Művelet |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | A workflow-keresés fókuszálása |
| `Escape` | A workflow-keresés törlése, ha szöveget tartalmaz |

## Tulajdonságok panel billentyűparancsok

Ezek a billentyűparancsok akkor aktívak, amikor egy csomópont ki van jelölve, és a tulajdonságok panel nyitva van.

| Billentyűparancs | Művelet |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | A kapcsolt al-workflow megnyitása új lapon (csak Execute csomópont esetén) |

## Értékelés párbeszédablak billentyűparancsok

Ezek a billentyűparancsok akkor aktívak, amikor az Értékelés párbeszédablak nyitva van.

| Billentyűparancs | Művelet |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | A kifejezés alkalmazása és a párbeszédablak bezárása |
| `Ctrl + Z` / `Cmd + Z` | A módosítások visszavonása a kifejezésszerkesztőben |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | A módosítások újbóli alkalmazása a kifejezésszerkesztőben |
| `Ctrl + Y` / `Cmd + Y` | A módosítások újbóli alkalmazása a kifejezésszerkesztőben (alternatív) |

## Előzmények és Futtatások billentyűparancsok

Ezek a billentyűparancsok a Futtatási előzmények párbeszédablakban és a Futtatások panelben érhetők el.

| Billentyűparancs | Művelet |
|----------|--------|
| `S` | A keresőmező be- és kikapcsolása a bejegyzések szűréséhez |

## Kapcsolódó

- [Vászon funkciók](./canvas-features.md) – Adatrögzítés, engedélyezés/letiltás, kiemelés al-workflow-ba
- [Workflow struktúra](./workflow-structure.md) – Csomópont- és élformátum
- [Execute csomópont](../nodes/execute-node.md) – Al-workflow-k hívása (`Ctrl + Shift + O`)
- [Gyors kezdés](../getting-started/quick-start.md) – Az első workflow felépítése

- **Esc**: Stop following another collaborator in [Canvas Collaboration](./canvas-collaboration.md).
