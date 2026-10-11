# Prenos in Uvoz

Izvozite workflows ali celotne mape kot datoteke ali jih uvozite s preprostim povleci in spusti. To uporabite za varnostno kopiranje, deljenje ali migracijo workflows med instancami.

## Prenos Workflow (JSON)

**Lokacija:** Orodna vrstica urejevalnika → **Prenesi** gumb (viden na velikih zaslonih)

**Kaj se izvozi:**
- `nodes` – Vsi vozli na platnu
- `edges` – Vse povezave med vozli

**Ime datoteke:** `{workflow-name}.json` (izpeljano iz imena workflow)

**Format:** Oglejte si [Strukturo Workflow](./workflow-structure.md) za JSON shemo.

## Prenos Mape (ZIP)

**Lokacija:** Nadzorna plošča → Zavihek Workflows → meni s tremi pikami mape → **Prenesi kot ZIP**

**Kaj se izvozi:**
- Vsi workflows v mapi in vse podmape, rekurzivno
- Hierarhija map ohranjena kot imeniki znotraj ZIP

**Struktura ZIP:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Vsaka datoteka `.json` vsebuje `{ name, nodes, edges }`.

## Uvoz

### Iz Nadzorne Plošče (Zavihek Workflows)

1. Pojdite na [Workflows](../tabs/workflows-tab.md) zavihek
2. Povlecite **JSON** ali **ZIP** datoteko na območje workflow

**JSON datoteka:** Ustvari se nov workflow. Ime workflow izhaja iz polja `name` v JSON, ali iz imena datoteke, če je `name` manjkajoče.

**ZIP datoteka:** Celotna struktura map se ponovno ustvari na ravni korena. Vsaka datoteka `.json` znotraj ZIP postane workflow, ki je postavljen v ustrezno mapo. Poverilnice in čez-workflow reference, ki ne obstajajo v trenutni instanci, se samodejno izbrišejo. Če nekateri workflows ne uspejo uvoziti, se prikaže povzetek, ki prikazuje, koliko jih je uspelo.

### Iz Platna (Urejevalnik)

1. Odprite workflow v urejevalniku
2. Povlecite JSON datoteko na platno
3. Če platno že vsebuje vozli ali povezave, potrditveno okno vpraša, ali želite zamenjati trenutni workflow
4. Uvoženi vozli in povezave zamenjajo ali se združijo s trenutnim workflow

## Formati Datotek

### JSON (en workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Neobvezno ime workflow"
}
```

- `nodes` – Obvezno; tabela objektov vozli
- `edges` – Neobvezno; tabela objektov povezav (privzeto `[]`)
- `name` – Neobvezno; uporabljeno pri ustvarjanju novega workflow iz uvoza na nadzorni plošči

### ZIP (mapa)

ZIP arhiv, kjer struktura imenikov odraža hierarhijo map. Vsaka datoteka je workflow JSON (glejte zgoraj). Imena map in workflow so izpeljana iz imen imenikov in datotek.

Oglejte si [Strukturo Workflow](./workflow-structure.md) za formate vozlov in povezav.

## Uporabniški Primeri

- **Varnostno kopiranje** – Prenesite workflows ali celotne mape pred večjimi spremembami
- **Deljenje** – Izvozite in delite JSON datoteke s sodelavci
- **Migracija** – Premikajte workflows ali strukture map med instancami Heym
- **Nadzor različic** – Shranite workflow JSON v Git skupaj s kodo

## Sorodno

- [Struktura Workflow](./workflow-structure.md) – JSON format za vozle in povezave
- [Zavihek Workflows](../tabs/workflows-tab.md) – Ustvarite workflows in uvozite preko povleci in spusti
- [Organizacija Workflow](./workflow-organization.md) – Mape in podmape
- [Značilnosti Platna](./canvas-features.md) – Značilnosti urejevalnika, vključno z uvozom platna
