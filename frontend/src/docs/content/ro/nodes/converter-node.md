# Converter

Nodul **Converter** transformă date și fișiere între formate fără a scrie cod. Este neutru din punct de vedere tehnologic, astfel încât pot fi adăugate mai multe formate în timp. Acesta convertește date CSV, JSON și XML în ambele direcții, rulează Tesseract OCR pentru a extrage text din imagini și PDF-uri și rescrie un fișier stocat într-un alt format.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.result` (date analizate pentru `csvToJson` / `xmlToJson`, text pentru `jsonToCsv` / `jsonToXml`, text extras pentru `imageToText` / `pdfToText`, metadate ale noului fișier pentru `fileConvert`) |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `conversion` | string | `csvToJson` (text CSV → matrice de obiecte rând), `jsonToCsv` (matrice de obiecte/rânduri → text CSV), `xmlToJson` (text XML → obiect), `jsonToXml` (obiect → text XML), `imageToText` (OCR pe o imagine), `pdfToText` (OCR pe fiecare pagină PDF selectată) sau `fileConvert` (rescrie un fișier stocat într-un alt format) |
| `source` | expression | Datele de convertit. Lăsați gol pentru a utiliza prima intrare a nodului |
| `delimiter` | string | Separator de câmp cu un singur caracter (implicit `,`) |
| `hasHeader` | boolean | Doar `csvToJson` — tratează primul rând ca antet (implicit `true`) |
| `trimValues` | boolean | Doar `csvToJson` — elimină spațiile albe din jurul numelor de antet și al valorilor celulelor (implicit `true`) |
| `includeHeader` | boolean | Doar `jsonToCsv` — scrie un rând de antet (implicit `true`) |
| `converterColumns` | string | Doar `jsonToCsv` — ordine opțională a coloanelor, separată prin virgule |
| `converterFileId` | expression | Conversii de fișiere — fișierul Heym Drive de citit, de ex. `$Upload.file.id` |
| `converterTargetFormat` | string | Doar `fileConvert` — formatul de ieșire (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Doar OCR — `auto` (implicit), un cod Tesseract precum `tur` sau `custom` |
| `ocrLanguageCustom` | string | Doar OCR — codurile de limbă utilizate când `ocrLanguage` este `custom`, de ex. `eng+tur` |
| `ocrEncoding` | string | Doar OCR — setul de caractere la care este normalizat textul (implicit `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Doar OCR — aplică normalizarea NFC (implicit `true`) |
| `ocrPsm` | string | Doar OCR — modul de segmentare a paginii Tesseract (implicit `3`) |
| `ocrDpi` | number | Doar `pdfToText` — DPI pentru rasterizarea paginii (implicit `300`) |
| `ocrPageRange` | expression | Doar `pdfToText` — `3` sau `2-5`. Gol înseamnă fiecare pagină |

## Comportament

- **`csvToJson`** analizează textul CSV sursă. Cu `hasHeader: true`, fiecare rând devine un obiect cu cheile date de valorile antetului; cu `hasHeader: false`, fiecare rând devine o matrice de valori ale celulelor. Câmpurile între ghilimele, separatorii încorporați și liniile noi încorporate sunt gestionate conform RFC 4180. Un BOM UTF-8 la început (frecvent în exporturile Excel) este eliminat, iar numele de antet duplicate sunt făcute unice fără a suprascrie o coloană reală (`a, a, a_2` → `a`, `a_3`, `a_2`). Setați `delimiter` la `\t` pentru a analiza valori separate prin tabulatoare.
- **`trimValues`** (implicit `true`) elimină spațiile albe din jurul numelor de antet și al valorilor celulelor, **inclusiv în interiorul câmpurilor între ghilimele** (`" padded "` → `padded`). RFC 4180 tratează spațiile albe dintre ghilimele ca date, așa că setați `trimValues: false` pentru a le păstra exact.
- **`jsonToCsv`** construiește text CSV dintr-o matrice de obiecte (sau matrice). Ordinea coloanelor este preluată din `converterColumns` când este furnizată, altfel este dedusă din cheile primului obiect. Valorile care conțin separatorul, ghilimele sau linii noi sunt puse automat între ghilimele.
- **`xmlToJson`** analizează XML într-un obiect. Atributele folosesc prefixul `@`, iar textul amestecat cu atribute folosește `#text`; elementele surori repetate devin matrice. Expandarea entităților XML este dezactivată.
- **`jsonToXml`** serializează un obiect într-un document XML. Obiectul trebuie să aibă exact o cheie de nivel superior, care devine elementul rădăcină XML. Utilizați aceeași convenție `@attribute` și `#text` ca la `xmlToJson` pentru a produce atribute și text alături de elementele copil.
- **`imageToText`** rulează Tesseract pe o singură imagine (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasterizează fiecare pagină selectată la `ocrDpi` și o recunoaște. Fiecare pagină trece prin OCR, astfel încât un PDF digital cu un strat de text perfect funcțional este totuși recitit din pixeli. Aceasta menține comportamentul identic pentru documentele scanate și cele digitale, cu prețul vitezei, așa că restrângeți `ocrPageRange` pentru fișierele lungi.
- **`fileConvert`** rescrie fișierul sursă într-un alt format și stochează rezultatul ca un fișier Drive **nou**. Originalul nu este niciodată modificat. Documentele trec prin pandoc, imaginile prin Pillow, iar JSON către CSV prin writer-ul csv din Python. O imagine nu poate deveni un document și un document nu poate deveni o imagine; pentru a extrage text dintr-o imagine utilizați `imageToText`.

## Aducerea fișierului în nod

Conversiile de fișiere citesc din Heym Drive, nu dintr-o cale sau un URL, așa că fișierul trebuie stocat mai întâi. Trei lanțuri comune:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — indicați `converterFileId` către `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — aduceți un fișier remote în Drive, apoi transmiteți `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — o abilitate care scrie un fișier îl expune ca `$reportAgent._generated_files[0].id`.

`converterFileId` acceptă de asemenea un obiect fișier întreg (`$Upload.file`) sau un URL de descărcare Heym; id-ul fișierului este extras din oricare dintre ele. Fișierul trebuie să fie unul pe care îl dețineți sau pe care un coleg l-a partajat cu dumneavoastră.
## Limbi

`auto` (implicit) rulează mai întâi detectarea orientării și a scriptului Tesseract, apoi alege cel mai bun model instalat pentru scriptul detectat. Modelele de script precum `Latin` sau `Cyrillic` citesc orice limbă scrisă în acel script, motiv pentru care auto gestionează o factură în turcă și una în engleză fără a i se specifica care este care.

Specificarea limbii este totuși mai precisă atunci când o cunoașteți. Utilizați un singur cod (`tur`) sau uniți mai multe cu `+` (`eng+tur`) pentru documente mixte — mai multe limbi înseamnă recunoaștere mai lentă și ușor mai zgomotoasă, așa că păstrați lista scurtă. Codurile funcționează doar când datele lingvistice corespunzătoare sunt instalate pe backend; nodul listează ce este disponibil atunci când selectați unul lipsă.

Fiecare imagine Heym include `osd`, engleză, turcă, germană, franceză, spaniolă, italiană, portugheză, olandeză, rusă, arabă, chineză simplificată, japoneză, coreeană și modelele de script Latin, Cyrillic, Arabic, HanS, Japanese și Hangul.

## Codificare

Textul recunoscut este UTF-8 și păstrează fiecare caracter produs de Tesseract. `ocrNormalizeUnicode` (activat implicit) aplică normalizarea NFC, astfel încât o literă scrisă ca `s` plus o sedilă combinată devine un singur `ş` — merită lăsat activat, deoarece cele două forme nu sunt egale în comparații sau interogări de baze de date.

`ocrEncoding` contează doar atunci când ceva din aval nu poate stoca întreaga gamă Unicode. Selectarea `cp1254` sau `iso-8859-9` păstrează textul turcesc intact garantând în același timp că rezultatul se încadrează în acel set de caractere; `latin-1` și `ascii` sunt mai restrânse și înlocuiesc ce nu pot reprezenta cu `?`. Lăsați `utf-8` dacă un sistem țintă nu vă obligă altfel.

## Ieșire

`csvToJson`, `jsonToCsv`, `xmlToJson` și `jsonToXml` returnează `$label.result` și `$label.conversion`. Conversiile OCR adaugă:

| Câmp | Descriere |
|-------|-------------|
| `$label.result` | Textul complet extras, paginile unite printr-o linie goală |
| `$label.language` | Modelul care a rulat efectiv (util pentru a vedea ce a ales `auto`) |
| `$label.encoding` | Setul de caractere la care a fost normalizat textul |
| `$label.page_count` | Numărul de pagini recunoscute |
| `$label.pages` | Array de `{ page, text }` pentru gestionare pe pagină |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` al fișierului sursă |

`fileConvert` returnează noul fișier în schimb:

| Câmp | Descriere |
|-------|-------------|
| `$label.id` | UUID-ul fișierului nou stocat |
| `$label.filename` | Numele de fișier convertit, numele de bază păstrat și extensia schimbată |
| `$label.mime_type` | Tipul MIME al noului fișier |
| `$label.size_bytes` | Dimensiunea noului fișier |
| `$label.download_url` | URL-ul de descărcare Drive pentru noul fișier |
| `$label.source_file` | Metadatele fișierului care a fost convertit |

## Exemplu

```json
{
  "type": "converter",
  "data": {
    "label": "toRows",
    "conversion": "csvToJson",
    "source": "$userInput.body.text",
    "delimiter": ",",
    "hasHeader": true
  }
}
```

Pentru intrarea `name,age\nAda,36`, nodurile din aval accesează rândurile analizate prin `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Conversia XML în JSON:

```json
{
  "type": "converter",
  "data": {
    "label": "xmlToObject",
    "conversion": "xmlToJson",
    "source": "$webhook.body"
  }
}
```

Pentru `<person id="1"><name>Ada</name></person>`, `$xmlToObject.result` este `{ "person": { "@id": "1", "name": "Ada" } }`. Pentru a crea XML, transmiteți acel obiect unui al doilea nod Converter cu `conversion: "jsonToXml"`.

Citirea unei facturi scanate încărcate printr-un trigger de încărcare fișier:

```json
{
  "type": "converter",
  "data": {
    "label": "readInvoice",
    "conversion": "pdfToText",
    "converterFileId": "$Upload.file.id",
    "ocrLanguage": "tur",
    "ocrEncoding": "utf-8",
    "ocrDpi": 300,
    "ocrPageRange": "1-3"
  }
}
```

Un nod [Agent](./agent-node.md) sau [LLM](./llm-node.md) din aval poate apoi extrage câmpuri structurate din `$readInvoice.result`.

Transformarea unui raport markdown al unui agent într-un PDF:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

Nodurile din aval citesc `$convertDoc.download_url` pentru a partaja PDF-ul sau `$convertDoc.id` pentru a continua lucrul cu acesta în [Drive](./drive-node.md).

## Cerințe

OCR apelează `tesseract` și `pdftoppm` din poppler, iar conversia documentelor folosește pandoc. Toate trei sunt incluse în fiecare modalitate de rulare a Heym, inclusiv `run.sh`, docker-compose și imaginea de release unică, deci nu este nimic de configurat. Limitele de pagini, timeout-urile și DPI-ul maxim sunt valori fixe ale platformei, nu setări.

## Asociate

- [Set](./set-node.md) – Transformați și mapați câmpuri individuale
- [JSON output mapper](./json-output-mapper-node.md) – Construiți un obiect de răspuns JSON
- [File upload trigger](./file-upload-trigger-node.md) – Acceptați un fișier în Heym Drive
- [Drive](./drive-node.md) – Stocați, preluați și partajați fișiere
- [Node Types](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Expression DSL](../reference/expression-dsl.md) – Funcții și sintaxă
