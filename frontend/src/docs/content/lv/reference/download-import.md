# Lejupielāde un imports

Eksportējiet workflow vai veselas mapes kā failus vai importējiet tās, izmantojot drag & drop. Izmantojiet to dublēšanai, koplietošanai vai workflow migrācijai starp instancēm.

## Workflow lejupielāde (JSON)

**Atrašanās vieta:** Redaktora rīkjosla → poga **Download** (redzama lielos ekrānos)

**Kas tiek eksportēts:**
- `nodes` – Visi mezgli uz kanvas
- `edges` – Visi savienojumi starp mezgliem

**Faila nosaukums:** `{workflow-name}.json` (atvasināts no workflow nosaukuma)

**Formāts:** Skatiet [Workflow Structure](./workflow-structure.md) attiecībā uz JSON shēmu.

## Mapes lejupielāde (ZIP)

**Atrašanās vieta:** Dashboard → Workflows cilne → mapes 3 punktu izvēlne → **Download as ZIP**

**Kas tiek eksportēts:**
- Visi workflow mapē un visās apakšmapēs, rekursīvi
- Mapju hierarhija tiek saglabāta kā direktorijas ZIP arhīvā

**ZIP struktūra:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Katrs `.json` fails satur `{ name, nodes, edges }`.

## Imports

### No Dashboard (Workflows cilne)

1. Dodieties uz cilni [Workflows](../tabs/workflows-tab.md)
2. Velciet **JSON** vai **ZIP** failu uz workflow apgabalu

**JSON fails:** Tiek izveidots jauns workflow. Workflow nosaukums tiek ņemts no `name` lauka JSON failā vai no faila nosaukuma, ja `name` nav norādīts.

**ZIP fails:** Visa mapju struktūra tiek atjaunota saknes līmenī. Katrs `.json` fails ZIP arhīvā kļūst par workflow, kas tiek ievietots atbilstošajā mapē. Akreditācijas dati un starp-workflow atsauces, kas neeksistē pašreizējā instancē, tiek automātiski notīrītas. Ja dažu workflow importēšana neizdodas, tiek parādīts kopsavilkums par to, cik daudz tika veiksmīgi importēti.

### No kanvas (redaktors)

1. Atveriet workflow redaktorā
2. Velciet JSON failu uz kanvas
3. Ja kanvā jau ir mezgli vai savienojumi, apstiprinājuma dialogs jautā, vai aizstāt pašreizējo workflow
4. Importētie mezgli un savienojumi aizstāj vai apvienojas ar pašreizējo workflow

## Failu formāti

### JSON (viens workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Obligāts; mezglu objektu masīvs
- `edges` – Nav obligāts; savienojumu objektu masīvs (pēc noklusējuma `[]`)
- `name` – Nav obligāts; tiek izmantots, veidojot jaunu workflow no Dashboard importa

### ZIP (mape)

ZIP arhīvs, kurā direktoriju struktūra atspoguļo mapju hierarhiju. Katrs fails ir workflow JSON (skatiet iepriekš). Mapju un workflow nosaukumi tiek atvasināti attiecīgi no direktoriju un failu nosaukumiem.

Skatiet [Workflow Structure](./workflow-structure.md) attiecībā uz mezglu un savienojumu formātiem.

## Lietošanas gadījumi

- **Dublēšana** – Lejupielādējiet workflow vai veselas mapes pirms būtiskām izmaiņām
- **Koplietošana** – Eksportējiet un koplietojiet JSON failus ar komandas biedriem
- **Migrācija** – Pārvietojiet workflow vai mapju struktūras starp Heym instancēm
- **Versiju kontrole** – Glabājiet workflow JSON Git kopā ar kodu

## Saistītie resursi

- [Workflow Structure](./workflow-structure.md) – JSON formāts mezgliem un savienojumiem
- [Workflows Tab](../tabs/workflows-tab.md) – Veidojiet workflow un importējiet, izmantojot drag & drop
- [Workflow Organization](./workflow-organization.md) – Mapes un apakšmapes
- [Canvas Features](./canvas-features.md) – Redaktora funkcijas, tostarp kanvas imports
