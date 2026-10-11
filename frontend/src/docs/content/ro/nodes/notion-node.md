# Notion

Nodul **Notion** gestionează baze de date, surse de date, pagini și blocuri prin intermediul API-ului Notion.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Acreditări | Token de integrare intern sau Notion OAuth |
| Versiune API | `2026-03-11` |

Colecțiile de tip bază de date Notion utilizează **ID-uri de sursă de date** în versiunile actuale ale API-ului. Partajați fiecare pagină
sau sursă de date de care are nevoie workflow-ul cu integrarea înainte de a rula nodul.
Câmpurile de resursă acceptă fie un ID Notion brut, fie un URL Notion complet. URL-urile sunt normalizate la ID-ul
de resursă încorporat înainte de cererea API.

## Operațiuni

| Operațiune | Câmpuri obligatorii | Ieșire principală |
|-----------|-----------------|-------------|
| Search | Query/filtru/sortare opționale | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID sau Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, unul dintre Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Cerere de bază de date cu `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, cerere de bază de date nevidă | `.database`, `.id`, `.url` |
| Create Data Source | Cerere de sursă de date cu `parent` și `properties` nevid | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, cerere de sursă de date nevidă | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block sau Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, obiect de actualizare bloc | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block sau Page ID, Children | `.results`, `.count` |

Toate operațiunile returnează, de asemenea, `.success` și `.operation`.

## Câmpuri JSON

Câmpurile Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon și Cover acceptă
JSON conform API-ului Notion. Expresiile din interiorul șirurilor JSON sunt rezolvate înainte de cerere. Un câmp poate fi, de asemenea,
o singură expresie independentă care se rezolvă direct la obiectul sau tabloul necesar, precum
`$input.database`, `$input.properties` sau `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Pentru conținutul unei pagini sau al unui bloc, Children este un tablou de obiecte bloc Notion:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## Baze de date și surse de date

În API-ul Notion actual, o **bază de date** este un container, iar o **sursă de date** deține schema
proprietăților și rândurile interogabile. Retrieve Database returnează lista `data_sources` a bazei de date; utilizați unul dintre
acele ID-uri cu Retrieve Data Source sau Query Data Source.

Create Database acceptă obiectul de cerere complet de la endpoint-ul Create a database al Notion. Acesta
trebuie să conțină `parent` și poate conține `title`, `description`, `is_inline`,
`initial_data_source`, `icon` și `cover`. De exemplu:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Update Database acceptă obiectul de cerere al endpoint-ului de actualizare, inclusiv `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` și `is_locked`. Câmpurile Database ID acceptă
un ID brut, un URL Notion complet sau o expresie.

Utilizați **Retrieve Data Source** pentru a prelua schema `properties` a sursei de date înainte de a construi un
obiect Properties pentru Create Page. **Create Data Source** necesită un obiect de bază de date părinte și o
schemă `properties` nevidă. **Update Data Source** acceptă un obiect de cerere nevid acceptat
de endpoint-ul Notion corespunzător.

De exemplu, creați o sursă de date în interiorul unei baze de date existente:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Selectorii Data Source și Parent Page acceptă căutarea pe server cu o scurtă întârziere (debounce) și
paginare bazată pe cursor prin **Load more**. Utilizați **Refresh** după partajarea unei resurse noi în Notion.
Comutați la **Use expression** pentru a introduce o expresie, un ID brut sau un URL.

Filtrele de căutare din tutoriale mai vechi care utilizează
`{"property":"object","value":"database"}` sunt traduse în valoarea actuală `data_source`.
Workflow-urile noi ar trebui să utilizeze direct `data_source` sau `page`.

Append Blocks acceptă pozițiile **Start**, **End** și **After Block**. Create Page și Append
Blocks împart automat mai mult de 100 de copii de nivel superior în cereri ordonate pentru a respecta
limita per cerere a Notion.

Cererile limitate ca rată (`429` sau `529`) se reîncearcă de până la trei ori. Heym respectă
header-ul `Retry-After` al Notion, limitează fiecare așteptare la 10 secunde și adaugă jitter aleatoriu. Cererile Notion
partajează un pool de conexiuni HTTP la nivel de proces între pagini și nodurile de workflow.
## Limitările API-ului Notion

- O singură valoare rich-text `text.content` poate conține cel mult 2.000 de caractere. Împărțiți
  textele mai lungi în mai multe obiecte rich-text.
- Notion limitează blocurile copil de nivel superior la 100 per cerere. Heym grupează tablourile
  Children mai mari, dar fiecare bloc individual trebuie să respecte în continuare limitele de
  payload ale Notion.
- API-ul acceptă cel mult două niveluri imbricate de blocuri copil într-o singură cerere. Creați
  structuri mai adânci prin operațiuni ulterioare Append Blocks.
- Payload-urile cererilor sunt limitate la 1.000 de elemente bloc și 500 KB în total.

## Paginare

Search, Query Data Source și Get Block Children acceptă o dimensiune a paginii de la 1 la 100 și un
cursor de început opțional. Setați dimensiunea paginii la `0` pentru a urmări automat cursoarele și
a îmbina toate rezultatele, până la limita de siguranță de 10.000 de rezultate a nodului.

## Configurarea acreditărilor

Alegeți oricare dintre configurările din dialogul de acreditări (**Internal token** sau **OAuth**):

- **Internal token:** Creați o integrare internă, copiați token-ul acesteia în Heym, apoi partajați
  fiecare pagină sau sursă de date necesară cu integrarea. Folosiți **Test Connection** pentru a
  verifica accesul.
- **OAuth:** Creați o integrare publică Notion și înregistrați
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` în Notion. În dialogul de acreditări Heym,
  alegeți **OAuth**, introduceți Client ID și Client Secret ale integrării, apoi faceți clic pe
  **Connect** pentru a autoriza un workspace. Secretul este stocat criptat împreună cu acreditarea
  și nu este plasat în starea OAuth sau în configurația de mediu. După autorizare, acreditarea
  afișează numele workspace-ului conectat (`connected (Workspace Name)`). Acreditările OAuth în
  așteptare afișează `Not connected`.

Lăsarea câmpului internal token necompletat în timpul editării păstrează token-ul stocat.

Pentru cereri personalizate [HTTP](../nodes/http-node.md), `$credentials.YourNotionCredential` se
rezolvă la același bearer token pe care îl folosește nodul Notion (internal token sau OAuth access
token).

## Note privind versiunea API

Heym fixează cererile Notion la versiunea API `2026-03-11`. Această versiune folosește:

- părinți `data_source_id` și endpoint-uri `/data_sources` în locul căilor legacy de interogare a
  bazei de date
- `in_trash` în locul lui `archived` pentru operațiunile de mutare în coș/restaurare a paginilor
- obiecte `position` (`start`, `end`, `after_block`) pentru Append Block Children

La migrarea exemplelor mai vechi de automatizare Notion:

- Înlocuiți referințele la părintele/interogarea bazei de date cu ID-uri de sursă de date din
  **Retrieve Database** sau din selectorul de surse de date al editorului
- Înlocuiți `archived: true` cu `in_trash: true`
- Înlocuiți parametrii `after` de adăugare cu câmpul **Append Position** al nodului

Filtrele de căutare care încă folosesc valoarea de obiect `database` sunt normalizate automat la
`data_source`.

## Resurse conexe

- [Acreditări](../reference/credentials.md)
- [Integrări terțe](../reference/integrations.md)
- [Tipuri de noduri](../reference/node-types.md)
