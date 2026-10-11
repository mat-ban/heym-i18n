# Descărcare și import

Exportați workflow-uri sau foldere întregi ca fișiere sau importați-le prin drag & drop. Utilizați această funcție pentru backup, partajare sau migrarea workflow-urilor între instanțe.

## Descărcare workflow (JSON)

**Locație:** Bara de instrumente a editorului → butonul **Download** (vizibil pe ecrane mari)

**Ce se exportă:**
- `nodes` – Toate nodurile de pe canvas
- `edges` – Toate conexiunile dintre noduri

**Nume fișier:** `{workflow-name}.json` (derivat din numele workflow-ului)

**Format:** Consultați [Workflow Structure](./workflow-structure.md) pentru schema JSON.

## Descărcare folder (ZIP)

**Locație:** Dashboard → fila Workflows → meniul cu 3 puncte al folderului → **Download as ZIP**

**Ce se exportă:**
- Toate workflow-urile din folder și din toate sub-folderele, recursiv
- Ierarhia folderelor păstrată ca directoare în interiorul arhivei ZIP

**Structura ZIP:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Fiecare fișier `.json` conține `{ name, nodes, edges }`.

## Import

### Din Dashboard (fila Workflows)

1. Accesați fila [Workflows](../tabs/workflows-tab.md)
2. Trageți un fișier **JSON** sau **ZIP** în zona de workflow-uri

**Fișier JSON:** Se creează un workflow nou. Numele workflow-ului provine din câmpul `name` din JSON sau din numele fișierului dacă `name` lipsește.

**Fișier ZIP:** Întreaga structură de foldere este recreată la nivelul rădăcină. Fiecare fișier `.json` din interiorul arhivei ZIP devine un workflow plasat în folderul corespunzător. Acreditările și referințele între workflow-uri care nu există în instanța curentă sunt eliminate automat. Dacă unele workflow-uri nu pot fi importate, se afișează un rezumat cu numărul celor importate cu succes.

### Din Canvas (editor)

1. Deschideți un workflow în editor
2. Trageți un fișier JSON pe canvas
3. Dacă canvas-ul conține deja noduri sau muchii, un dialog de confirmare întreabă dacă doriți să înlocuiți workflow-ul curent
4. Nodurile și muchiile importate înlocuiesc sau se îmbină cu workflow-ul curent

## Formate de fișiere

### JSON (un singur workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Obligatoriu; array de obiecte nod
- `edges` – Opțional; array de obiecte muchie (valoare implicită `[]`)
- `name` – Opțional; utilizat la crearea unui workflow nou din importul prin Dashboard

### ZIP (folder)

Arhivă ZIP în care structura de directoare oglindește ierarhia folderelor. Fiecare fișier este un workflow JSON (vezi mai sus). Numele folderelor și ale workflow-urilor sunt derivate din numele directoarelor, respectiv al fișierelor.

Consultați [Workflow Structure](./workflow-structure.md) pentru formatele nodurilor și muchiilor.

## Cazuri de utilizare

- **Backup** – Descărcați workflow-uri sau foldere întregi înainte de modificări majore
- **Partajare** – Exportați și partajați fișiere JSON cu colegii
- **Migrare** – Mutați workflow-uri sau structuri de foldere între instanțe Heym
- **Control de versiuni** – Stocați JSON-ul workflow-urilor în Git alături de cod

## Resurse conexe

- [Workflow Structure](./workflow-structure.md) – Formatul JSON pentru noduri și muchii
- [Workflows Tab](../tabs/workflows-tab.md) – Creați workflow-uri și importați prin drag & drop
- [Workflow Organization](./workflow-organization.md) – Foldere și sub-foldere
- [Canvas Features](./canvas-features.md) – Funcții ale editorului, inclusiv importul pe canvas
