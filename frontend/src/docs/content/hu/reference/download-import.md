# Letöltés és importálás

A workflow-kat vagy teljes mappákat exportálhat fájlként, illetve importálhatja azokat drag & drop segítségével. Használja ezt biztonsági mentéshez, megosztáshoz vagy a workflow-k példányok közötti migrálásához.

## Workflow letöltése (JSON)

**Hely:** Szerkesztő eszköztár → **Letöltés** gomb (nagy képernyőkön látható)

**Mit exportál:**
- `nodes` – A vásznon található összes csomópont
- `edges` – A csomópontok közötti összes kapcsolat

**Fájlnév:** `{workflow-name}.json` (a workflow nevéből származik)

**Formátum:** A JSON-sémát lásd a [Workflow struktúra](./workflow-structure.md) oldalon.

## Mappa letöltése (ZIP)

**Hely:** Irányítópult → Workflows fül → mappa 3 pontos menü → **Letöltés ZIP-ként**

**Mit exportál:**
- A mappában és annak összes almappájában található összes workflow-t, rekurzívan
- A mappahierarchia a ZIP-en belüli könyvtárakként megőrződik

**ZIP struktúra:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Minden `.json` fájl `{ name, nodes, edges }` tartalmat hordoz.

## Importálás

### Irányítópultról (Workflows fül)

1. Nyissa meg a [Workflows](../tabs/workflows-tab.md) fület
2. Húzzon egy **JSON** vagy **ZIP** fájlt a workflow területre

**JSON fájl:** Létrejön egy új workflow. A workflow neve a JSON `name` mezőjéből származik, vagy a fájlnévből, ha a `name` hiányzik.

**ZIP fájl:** A teljes mappastruktúra újra létrejön a gyökérszinten. A ZIP-en belüli minden `.json` fájlból egy workflow lesz, amely a megfelelő mappába kerül. A hitelesítési adatok és a több workflow-ra kiterjedő hivatkozások, amelyek nem léteznek az aktuális példányban, automatikusan törlődnek. Ha néhány workflow importálása sikertelen, egy összegzés mutatja, hogy hány sikeres.

### Vászonról (Szerkesztő)

1. Nyisson meg egy workflow-t a szerkesztőben
2. Húzzon egy JSON fájlt a vászonra
3. Ha a vásznon már vannak csomópontok vagy élek, egy megerősítő párbeszédablak kérdezi meg, hogy lecseréli-e az aktuális workflow-t
4. Az importált csomópontok és élek lecserélik vagy beolvadnak az aktuális workflow-ba

## Fájlformátumok

### JSON (egyetlen workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Kötelező; csomópont objektumok tömbje
- `edges` – Opcionális; él objektumok tömbje (alapértelmezés: `[]`)
- `name` – Opcionális; az Irányítópultról történő importáláskor új workflow létrehozásához használatos

### ZIP (mappa)

ZIP archívum, amelyben a könyvtárstruktúra tükrözi a mappahierarchiát. Minden fájl egy workflow JSON (lásd fent). A mappa- és workflow nevek a könyvtár-, illetve fájlnevekből származnak.

A csomópont- és élformátumokat lásd a [Workflow struktúra](./workflow-structure.md) oldalon.

## Használati esetek

- **Biztonsági mentés** – Töltsön le workflow-kat vagy teljes mappákat jelentős változtatások előtt
- **Megosztás** – Exportáljon és osszon meg JSON fájlokat a csapattársaival
- **Migráció** – Helyezzen át workflow-kat vagy mappastruktúrákat Heym példányok között
- **Verziókezelés** – Tárolja a workflow JSON-t Git-ben a kóddal együtt

## Kapcsolódó

- [Workflow struktúra](./workflow-structure.md) – JSON formátum a csomópontokhoz és élekhez
- [Workflows fül](../tabs/workflows-tab.md) – Workflow-k létrehozása és importálása drag & drop segítségével
- [Workflow szervezése](./workflow-organization.md) – Mappák és almappák
- [Vászon funkciók](./canvas-features.md) – Szerkesztő funkciók, beleértve a vászon importálást
