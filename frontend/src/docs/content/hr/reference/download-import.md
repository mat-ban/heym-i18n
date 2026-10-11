# Preuzimanje i Uvoz

Izvezite workflows ili cijele mape kao datoteke, ili ih uvezite putem povlačenja i ispuštanja. Koristite ovo za izradu sigurnosnih kopija, dijeljenje ili migraciju workflows između instanci.

## Preuzimanje Workflowa (JSON)

**Lokacija:** Alatna traka uređivača → **Preuzmi** gumb (vidljiv na velikim ekranima)

**Što se izvozi:**
- `nodes` – Svi čvorovi na platnu
- `edges` – Sve veze između čvorova

**Naziv datoteke:** `{workflow-name}.json` (proizašao iz naziva workflowa)

**Format:** Pogledajte [Struktura Workflowa](./workflow-structure.md) za JSON shemu.

## Preuzimanje Mape (ZIP)

**Lokacija:** Nadzorna ploča → Kartica Workflows → izbornik s tri točke mape → **Preuzmi kao ZIP**

**Što se izvozi:**
- Svi workflows u mapi i sve podmape, rekurzivno
- Hijerarhija mapa očuvana kao direktoriji unutar ZIP-a

**ZIP struktura:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Svaka `.json` datoteka sadrži `{ name, nodes, edges }`.

## Uvoz

### Iz Nadzorne Ploče (Kartica Workflows)

1. Idite na [Workflows](../tabs/workflows-tab.md) karticu
2. Povucite **JSON** ili **ZIP** datoteku na područje workflowa

**JSON datoteka:** Novi workflow se stvara. Naziv workflowa dolazi iz `name` polja u JSON-u, ili iz naziva datoteke ako je `name` nedostaje.

**ZIP datoteka:** Cijela struktura mapa se ponovno stvara na razini korijena. Svaka `.json` datoteka unutar ZIP-a postaje workflow smješten u odgovarajuću mapu. Vjerodajnice i međuworkflow reference koje ne postoje u trenutnoj instanci automatski se brišu. Ako neki workflows ne uspiju uvesti, prikazuje se sažetak koliko ih je uspjelo.

### Iz Platna (Uređivač)

1. Otvorite workflow u uređivaču
2. Povucite JSON datoteku na platno
3. Ako platno već ima čvorove ili veze, dijalog za potvrdu pita želite li zamijeniti trenutni workflow
4. Uvezeni čvorovi i veze zamjenjuju ili se spajaju s trenutnim workflowom

## Formati Datoteka

### JSON (jedan workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Opcionalni naziv workflowa"
}
```

- `nodes` – Obavezno; niz objekata čvorova
- `edges` – Opcionalno; niz objekata veza (zadano na `[]`)
- `name` – Opcionalno; koristi se prilikom stvaranja novog workflowa iz uvoza s nadzorne ploče

### ZIP (mapa)

ZIP arhiva gdje struktura direktorija odražava hijerarhiju mapa. Svaka datoteka je workflow JSON (vidi gore). Nazivi mapa i workflowa proizašli su iz naziva direktorija i datoteka.

Pogledajte [Struktura Workflowa](./workflow-structure.md) za formate čvorova i veza.

## Primjene

- **Sigurnosna kopija** – Preuzmite workflows ili cijele mape prije većih promjena
- **Dijeljenje** – Izvezite i dijelite JSON datoteke s članovima tima
- **Migracija** – Premjestite workflows ili strukture mapa između Heym instanci
- **Kontrola verzija** – Pohranite workflow JSON u Git uz kod

## Povezano

- [Struktura Workflowa](./workflow-structure.md) – JSON format za čvorove i veze
- [Kartica Workflows](../tabs/workflows-tab.md) – Stvaranje workflows i uvoz putem povlačenja i ispuštanja
- [Organizacija Workflowa](./workflow-organization.md) – Mape i podmape
- [Značajke Platna](./canvas-features.md) – Značajke uređivača uključujući uvoz platna
