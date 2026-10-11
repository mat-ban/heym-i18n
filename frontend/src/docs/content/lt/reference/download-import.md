# Atsisiųsti ir Importuoti

Eksportuokite workflows arba visus aplankus kaip failus, arba importuokite juos vilkdami ir mesti. Naudokite tai atsarginių kopijų kūrimui, dalijimuisi arba workflows migravimui tarp instancijų.

## Atsisiųsti Workflow (JSON)

**Vieta:** Redaktoriaus įrankių juosta → **Atsisiųsti** mygtukas (matomas dideliuose ekranuose)

**Ką eksportuoja:**
- `nodes` – Visi mazgai drobėje
- `edges` – Visi ryšiai tarp mazgų

**Failo pavadinimas:** `{workflow-name}.json` (gautas iš workflow pavadinimo)

**Formatas:** Žr. [Workflow struktūra](./workflow-structure.md) JSON schemai.

## Atsisiųsti Aplanką (ZIP)

**Vieta:** Valdymo skydelis → Workflows skirtukas → aplanko 3 taškų meniu → **Atsisiųsti kaip ZIP**

**Ką eksportuoja:**
- Visi workflows aplanke ir visuose sub-aplankuose, rekursyviai
- Aplankų hierarchija išsaugoma kaip katalogai ZIP faile

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

Kiekvienas `.json` failas turi `{ name, nodes, edges }`.

## Importuoti

### Iš Valdymo Skydelio (Workflows Skirtukas)

1. Eikite į [Workflows](../tabs/workflows-tab.md) skirtuką
2. Vilkite **JSON** arba **ZIP** failą į workflow sritį

**JSON failas:** Sukuriamas naujas workflow. Workflow pavadinimas gaunamas iš `name` lauko JSON faile, arba iš failo pavadinimo, jei `name` trūksta.

**ZIP failas:** Visa aplankų struktūra atkuriama šakniniame lygyje. Kiekvienas `.json` failas ZIP faile tampa workflow, kuris yra dedamas į atitinkamą aplanką. Kredencialai ir kryžminiai workflow nuorodos, kurių nėra dabartinėje instancijoje, automatiškai išvalomos. Jei kai kurie workflows nepavyksta importuoti, pateikiama santrauka, kiek jų pavyko.

### Iš Drobės (Redaktorius)

1. Atidarykite workflow redaktoriuje
2. Vilkite JSON failą į drobę
3. Jei drobėje jau yra mazgų arba ryšių, patvirtinimo dialogas klausia, ar norite pakeisti esamą workflow
4. Importuoti mazgai ir ryšiai pakeičia arba sujungiami su esamu workflow

## Failų Formatai

### JSON (vienas workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Pasirinkinis workflow pavadinimas"
}
```

- `nodes` – Privaloma; mazgų objektų masyvas
- `edges` – Pasirinktinai; ryšių objektų masyvas (numatytasis yra `[]`)
- `name` – Pasirinktinai; naudojamas kuriant naują workflow iš Valdymo skydelio importo

### ZIP (aplankas)

ZIP archyvas, kurio katalogų struktūra atitinka aplankų hierarchiją. Kiekvienas failas yra workflow JSON (žr. aukščiau). Aplankų ir workflow pavadinimai gaunami iš katalogų ir failų pavadinimų atitinkamai.

Žr. [Workflow struktūra](./workflow-structure.md) mazgų ir ryšių formatams.

## Naudojimo Atvejai

- **Atsarginė kopija** – Atsisiųskite workflows arba visus aplankus prieš didelius pakeitimus
- **Dalinimasis** – Eksportuokite ir dalinkitės JSON failais su komandos nariais
- **Migracija** – Perkelkite workflows arba aplankų struktūras tarp Heym instancijų
- **Versijų valdymas** – Saugojimas workflow JSON Git kartu su kodu

## Susiję

- [Workflow struktūra](./workflow-structure.md) – JSON formatas mazgams ir ryšiams
- [Workflows skirtukas](../tabs/workflows-tab.md) – Kurkite workflows ir importuokite vilkdami ir mesti
- [Workflow organizacija](./workflow-organization.md) – Aplankai ir sub-aplankai
- [Drobės funkcijos](./canvas-features.md) – Redaktoriaus funkcijos, įskaitant drobės importą
