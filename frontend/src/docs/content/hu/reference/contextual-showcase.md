# Kontextuális bemutató

A **Kontextuális bemutató** egy könnyűsúlyú, alkalmazáson belüli útmutató sáv, amely elmagyarázza az Ön által éppen megtekintett oldalt anélkül, hogy azonnal egy teljes dokumentációs folyamatba terelné.

## Mit tesz

- Rövid összefoglalót mutat az aktuális oldalról
- Az első réteget tömören tartja, hogy Önt ne terhelje túl
- Lehetővé teszi egy kis extra részlet kibontását, de csak akkor, ha szükséges
- Linket biztosít a teljes dokumentációs oldalra a mélyebb olvasáshoz

## Hol jelenik meg

Az v1 verzióban a bemutató a Heym hitelesített fő felületein érhető el:

- Dashboard fülek
- [Értékelések](../tabs/evals-tab.md)
- [Dokumentáció](../getting-started/introduction.md)
- A workflow-szerkesztő vászna

A nyilvános oldalak, például a bejelentkezés, regisztráció, chat portál és HITL review nem jelenítik meg a bemutatót.

## Hozzáférés

### Asztali

- Egy rögzített **Oldalútmutató** trigger jelenik meg a képernyő jobb szélén
- A bemutató jobb oldali fiókként nyílik meg
- Alapértelmezés szerint zárva marad
- Egy egyszeri teaser segít felfedni, hogy létezik az útmutató, anélkül hogy erőltetve megnyitná

### Mobil

- Ugyanaz a tartalom érhető el egy lebegő **Oldalútmutató** gombbal
- Alsó lapon nyílik meg a jobb oldali sáv helyett

## Tartalmi modell

Minden bemutató bejegyzés strukturált definíciót használ egy teljesen egyedi komponens helyett.

- **Cím** – Mi ez az oldal
- **Összefoglaló** – Egy rövid magyarázat
- **Felsorolások** – Néhány áttekinthető támpont
- **Kiemelések** – Kis kártyák a kulcsfontosságú értékekhez vagy használati mintákhoz
- **További részletek** – Összecsukott szakaszok extra kontextushoz
- **Műveletek** – Általában egy vagy két link, leggyakrabban a teljes dokumentációra

Ez rugalmasan tartja a rendszert, miközben elkerüli a hosszú, zajos súgó paneleket.

## Kontextusfelismerés

A bemutató az aktuális felülettel együtt változik.

- A Dashboard fülek mindegyike saját összefoglalóval rendelkezik
- A szerkesztő a [Vászon funkciók](./canvas-features.md) oldalra mutat
- A dokumentációs oldal egy általános dokumentációs áttekintést használ, és amikor lehetséges, arra a cikkre mutat, amelyet Ön éppen megnyitott

## Perzisztencia

A bemutató kis mennyiségű személyes UI-állapotot tárol a böngésző tárolójában:

- Hogy a panel vagy lap utoljára nyitva volt-e
- Mely oldalkontextusok mutatták már a teasert
- Az utoljára kibontott részletszakasz kontextusonként

## Miért létezik

A cél az, hogy a Heym könnyebben megtanulható legyen anélkül, hogy több nehéz UI-elemet adnánk hozzá.

- Rövid, mindig közeli útmutatás a tájékozódáshoz
- Világos útvonal a mélyebb dokumentációhoz
- Alacsony zavarás a tapasztalt felhasználók számára

## Kapcsolódó

- [Workflow-k fül](../tabs/workflows-tab.md) – Fő Dashboard felület
- [Értékelések fül](../tabs/evals-tab.md) – Értékelési workflow-k
- [Vászon funkciók](./canvas-features.md) – Szerkesztő viselkedése és hibakeresés
- [Gyors fiók](./quick-drawer.md) – A másik rögzített jobb oldali segédfelület
