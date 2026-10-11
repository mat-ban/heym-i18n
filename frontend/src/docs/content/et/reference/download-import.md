# Allalaadimine ja importimine

Eksportige workflow'd või terved kaustad failidena või importige neid lohistades. Kasutage seda varundamiseks, jagamiseks või workflow'de migreerimiseks instantside vahel.

## Workflow allalaadimine (JSON)

**Asukoht:** Redaktori tööriistariba → **Download** nupp (nähtav suurtel ekraanidel)

**Mida eksporditakse:**
- `nodes` – Kõik sõlmed lõuendil
- `edges` – Kõik ühendused sõlmede vahel

**Failinimi:** `{workflow-name}.json` (tuletatud workflow nimetusest)

**Formaat:** JSON-skeemi kohta vt [Workflow Structure](./workflow-structure.md).

## Kausta allalaadimine (ZIP)

**Asukoht:** Töölaud → Workflows vahekaart → kausta 3-punkti menüü → **Download as ZIP**

**Mida eksporditakse:**
- Kõik workflow'd kaustas ja kõigis alamkaustades, rekursiivselt
- Kaustade hierarhia säilitatakse kataloogidena ZIP-faili sees

**ZIP-i struktuur:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Iga `.json` fail sisaldab `{ name, nodes, edges }`.

## Importimine

### Töölaualt (Workflows vahekaart)

1. Minge vahekaardile [Workflows](../tabs/workflows-tab.md)
2. Lohistage **JSON** või **ZIP** fail workflow alale

**JSON-fail:** Luuakse uus workflow. Workflow nimetus pärineb JSON-i `name` väljalt või failinimest, kui `name` puudub.

**ZIP-fail:** Kogu kaustastruktuur luuakse uuesti juurtasemel. Iga `.json` fail ZIP-i sees muutub workflow'ks, mis paigutatakse vastavasse kausta. Mandaadid ja workflow'devahelised viited, mida praeguses instantsis ei eksisteeri, tühjendatakse automaatselt. Kui mõne workflow importimine ebaõnnestub, kuvatakse kokkuvõte, mis näitab, kui palju õnnestus.

### Lõuendilt (redaktor)

1. Avage workflow redaktoris
2. Lohistage JSON-fail lõuendile
3. Kui lõuendil on juba sõlmi või ühendusi, küsib kinnitusdialoog, kas asendada praegune workflow
4. Imporditud sõlmed ja ühendused asendavad praeguse workflow või liidetakse sellega

## Failivormingud

### JSON (üksik workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Kohustuslik; sõlmeobjektide massiiv
- `edges` – Valikuline; ühendusobjektide massiiv (vaikimisi `[]`)
- `name` – Valikuline; kasutatakse uue workflow loomisel töölaualt importimisel

### ZIP (kaust)

ZIP-arhiiv, mille kataloogistruktuur peegeldab kaustade hierarhiat. Iga fail on workflow JSON (vt ülal). Kausta- ja workflow nimetused tuletatakse vastavalt kataloogi- ja failinimedest.

Sõlmede ja ühenduste formaatide kohta vt [Workflow Structure](./workflow-structure.md).

## Kasutusjuhud

- **Varundamine** – Laadige alla workflow'd või terved kaustad enne suuremaid muudatusi
- **Jagamine** – Eksportige ja jagage JSON-faile meeskonnakaaslastega
- **Migreerimine** – Liigutage workflow'sid või kaustastruktuure Heym instantside vahel
- **Versioonihaldus** – Hoidke workflow JSON-i Git-is koos koodiga

## Seotud

- [Workflow Structure](./workflow-structure.md) – Sõlmede ja ühenduste JSON-formaat
- [Workflows Tab](../tabs/workflows-tab.md) – Looge workflow'sid ja importige lohistades
- [Workflow Organization](./workflow-organization.md) – Kaustad ja alamkaustad
- [Canvas Features](./canvas-features.md) – Redaktori funktsioonid, sealhulgas lõuendi import
