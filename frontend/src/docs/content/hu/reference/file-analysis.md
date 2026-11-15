# Fájlelemzés

A fájlelemzés lehetővé teszi, hogy a Chat, az [Agent csomópont](../nodes/agent-node.md) és a [Code csomópont](../nodes/code-node.md) nagy méretű fájlokat nyisson meg és elemezzen a [Drive](./drive.md) felületről egy elkülönített Python homokozóban (sandbox). A PDF, táblázatkezelő, CSV, DOCX és JSON fájlok először ellenőrzésre kerülnek, majd szelektíven olvashatók, így egy 200 oldalas szerződésnek vagy egy egymillió soros munkafüzetnek soha nem kell teljesen elférnie a modell kontextusában.

## Működés

Minden hívás egy új, hálózati hozzáférés nélküli tárolóban fut. A szükséges fájlok csak olvasható módban másolódnak be, a kód lefut, és a tároló törlődik. Egy kis munkamappa megmarad ugyanazon munkamenet hívásai között, lehetővé téve, hogy egy későbbi lépés egy korábbi lépés által elmentett eredményekre építsen.

| Útvonal | Tartalom |
|------|--------|
| `/input` | A jelenlegi munkamenet Drive fájljai, csak olvasható |
| `/work` | A munkamenet során megmaradó munkaterület, pl. `/work/sales.pkl` |
| `/work/out` | Az ide írt fájlok a hívás után mentésre kerülnek a Drive-ra, és linkként kerülnek visszaadásra |

A homokozóban előre telepítve megtalálható a pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx és langdetect, valamint a Tesseract OCR, amelyet a [Konvertáló csomópont](../nodes/converter-node.md) is használ.

## Eszközök

A modell három eszközzel dolgozik, plusz egy negyedikkel a Chatben:

| Eszköz | Funkció |
|------|----------|
| `list_files` | Kilistázza a megnyitható Drive fájlokat: név, típus, méret, dátum |
| `inspect_file` | Visszaadja a fájl típusát, metaadatait és szerkezetét egy rövid mintával |
| `run_python` | Futtatja a Python kódot a megadott fájlokon, és visszaadja a konzolkimenetet |
| `clear_workspace` | Csak Chat: törli a beszélgetés munkamappáját |

Az `inspect_file` csak azt olvassa el, ami az összefoglaláshoz szükséges:

| Típus | Összefoglalás |
|-----|-----------------|
| PDF | Oldalszám, cím és szerző, szöveg kinyerhetősége, nyelv, oldalméretek, első oldal szövege és táblázatai. A beszkennelt PDF-eket OCR olvassa (legfeljebb 5 oldal) |
| XLSX / XLS | Munkalapok sor- és oszlopszámmal, fejlécsorok, típusok, pandas `read_hint`, elnevezett tartományok, első sorok |
| CSV / TSV | Kódolás, elválasztójel, sorszám, oszlopok típusokkal, első sorok |
| DOCX | Címsorstruktúra, táblázatok, szó- és karakterszám, szerző és dátum |
| JSON | Gyökértípus, kulcsok, tömbhossz, beágyazási mélység, mintarekordok |

A `run_python` eszközön belül nyisson meg egy fájlt a `heym_files` modul segítségével:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## A Chatben

Csatoljon PDF, táblázat, DOCX, CSV vagy JSON fájlokat, képeket (PNG, JPG, GIF, WebP) vagy egyszerű szöveges fájlokat a [Chat fülön](../tabs/chat-tab.md), a Heym Work Chat felületén vagy az MCP `heym_chat` eszközén keresztül. Egy üzenet legfeljebb 10 fájlt tartalmazhat. Minden fájl a Drive-on tárolódik; az üzenetbe csak a neve és az azonosítója kerül be. A Chat megvizsgálja a fájlt, elolvassa a kérdés szempontjából releváns részt, és táblázatokkal vagy kivonatokkal válaszol.

## Workflows környezetben

Egy futtatás csak a saját fájljait nyitja meg: azokat, amelyeket a [Fájlfeltöltés Trigger csomóponton](../nodes/file-upload-trigger-node.md) keresztül töltöttek fel, amelyeket a csomópontjai a Drive-ra írtak, és amelyeket egy [Drive csomópont](../nodes/drive-node.md) a **Get** lépéssel lekért ugyanazon futtatás során.

- **Agent csomópont**: ha az ügynök bemenete vagy üzenete tartalmaz egy fájlt, automatikusan megkapja a fenti eszközöket ezen fájlok kezelésére.
- **Code csomópont**: állítsa a **Files** beállítást egy kifejezésre, például: `$Upload.file.id`. A fájlok csatolásra kerülnek, és megjelennek a `params.files` listában.

## Korlátok

| Korlát | Érték |
|-----------|------|
| Memória hívásonként | 2 GB |
| Idő hívásonként | 120 másodperc |
| Munkamappa munkamenetenként | 2 GB |
| Kimeneti fájlok hívásonként | 20, legfeljebb 100 MB darabonként |
| Modellnek visszaadott szöveg | 20 000 karakter |
| Fájlok hívásonként | 20 |

## Biztonság

- A homokozónak nincs hálózata, nem fér hozzá a Heym beállításaihoz vagy titkaihoz, és nem privilegizált felhasználóként fut.
- A fájlok feldolgozása kizárólag a homokozón belül történik.
- A Chatben a hozzáférés követi a Drive-ot: megnyithatja saját fájljait és a csapataival megosztott fájlokat.
- Egy fájl megnyitása a Chatben rögzítésre kerül az auditnaplóban.
- A fájlok tartalmát szigorúan adatként kezeli a rendszer; a fájlokban található utasítások nem hajtódnak végre.

## Követelmények

A fájlelemzéshez homokozó háttérrendszer szükséges a Heym-példányon (Docker vagy [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Kapcsolódó

- [Drive](./drive.md)
- [Code csomópont](../nodes/code-node.md)
- [Agent csomópont](../nodes/agent-node.md)
- [Chat fülön](../tabs/chat-tab.md)
