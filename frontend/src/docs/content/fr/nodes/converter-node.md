# Converter

Le nœud **Converter** convertit des données et des fichiers entre différents formats sans écrire de code. Il est neutre sur le plan technologique, ce qui permet d'ajouter de nouveaux formats au fil du temps. Il convertit les données CSV, JSON et XML dans les deux sens, exécute l'OCR Tesseract pour extraire le texte des images et des PDF, et réécrit un fichier stocké dans un autre format.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.result` (données analysées pour `csvToJson` / `xmlToJson`, texte pour `jsonToCsv` / `jsonToXml`, texte extrait pour `imageToText` / `pdfToText`, métadonnées du nouveau fichier pour `fileConvert`) |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `conversion` | string | `csvToJson` (texte CSV → tableau d'objets de ligne), `jsonToCsv` (tableau d'objets/lignes → texte CSV), `xmlToJson` (texte XML → objet), `jsonToXml` (objet → texte XML), `imageToText` (OCR d'une image), `pdfToText` (OCR de chaque page PDF sélectionnée), ou `fileConvert` (réécriture d'un fichier stocké dans un autre format) |
| `source` | expression | Les données à convertir. Laisser vide pour utiliser la première entrée du nœud |
| `delimiter` | string | Séparateur de champs à un seul caractère (par défaut `,`) |
| `hasHeader` | boolean | `csvToJson` uniquement — traiter la première ligne comme en-tête (par défaut `true`) |
| `trimValues` | boolean | `csvToJson` uniquement — supprimer les espaces autour des noms d'en-tête et des valeurs de cellule (par défaut `true`) |
| `includeHeader` | boolean | `jsonToCsv` uniquement — écrire une ligne d'en-tête (par défaut `true`) |
| `converterColumns` | string | `jsonToCsv` uniquement — ordre des colonnes facultatif, séparé par des virgules |
| `converterFileId` | expression | Conversions de fichiers — le fichier Heym Drive à lire, par ex. `$Upload.file.id` |
| `converterTargetFormat` | string | `fileConvert` uniquement — format de sortie (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | OCR uniquement — `auto` (par défaut), un code Tesseract tel que `tur`, ou `custom` |
| `ocrLanguageCustom` | string | OCR uniquement — codes de langue utilisés lorsque `ocrLanguage` vaut `custom`, par ex. `eng+tur` |
| `ocrEncoding` | string | OCR uniquement — jeu de caractères vers lequel le texte est normalisé (par défaut `utf-8`) |
| `ocrNormalizeUnicode` | boolean | OCR uniquement — appliquer la normalisation NFC (par défaut `true`) |
| `ocrPsm` | string | OCR uniquement — mode de segmentation de page Tesseract (par défaut `3`) |
| `ocrDpi` | number | `pdfToText` uniquement — DPI de rastérisation des pages (par défaut `300`) |
| `ocrPageRange` | expression | `pdfToText` uniquement — `3` ou `2-5`. Vide signifie toutes les pages |

## Comportement

- **`csvToJson`** analyse le texte CSV source. Avec `hasHeader: true`, chaque ligne devient un objet indexé par les valeurs d'en-tête ; avec `hasHeader: false`, chaque ligne devient un tableau de valeurs de cellule. Les champs entre guillemets, les délimiteurs intégrés et les retours à la ligne intégrés sont gérés conformément à la RFC 4180. Un BOM UTF-8 en début de fichier (courant dans les exports Excel) est supprimé, et les noms d'en-tête en doublon sont rendus uniques sans écraser une colonne réelle (`a, a, a_2` → `a`, `a_3`, `a_2`). Définissez `delimiter` sur `\t` pour analyser des valeurs séparées par des tabulations.
- **`trimValues`** (par défaut `true`) supprime les espaces environnants des noms d'en-tête et des valeurs de cellule, **y compris à l'intérieur des champs entre guillemets** (`" padded "` → `padded`). La RFC 4180 traite les espaces entre guillemets comme des données ; définissez donc `trimValues: false` pour les préserver exactement.
- **`jsonToCsv`** construit un texte CSV à partir d'un tableau d'objets (ou de tableaux). L'ordre des colonnes est déterminé par `converterColumns` lorsqu'il est fourni, sinon déduit des clés du premier objet. Les valeurs contenant le délimiteur, des guillemets ou des retours à la ligne sont automatiquement mises entre guillemets.
- **`xmlToJson`** analyse le XML en un objet. Les attributs utilisent le préfixe `@` et le texte mêlé aux attributs utilise `#text` ; les éléments frères répétés deviennent des tableaux. L'expansion des entités XML est désactivée.
- **`jsonToXml`** sérialise un objet en document XML. L'objet doit avoir exactement une clé de premier niveau, qui devient l'élément racine XML. Utilisez la même convention `@attribut` et `#text` que `xmlToJson` pour produire des attributs et du texte aux côtés des éléments enfants.
- **`imageToText`** exécute Tesseract sur une seule image (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rastérise chaque page sélectionnée à `ocrDpi` et la reconnaît. Chaque page passe par l'OCR, de sorte qu'un PDF numérique doté d'une couche de texte parfaitement exploitable est tout de même relu à partir des pixels. Cela garantit un comportement identique pour les documents numérisés et numériques, au prix de la vitesse ; il convient donc de restreindre `ocrPageRange` sur les fichiers longs.
- **`fileConvert`** réécrit le fichier source dans un autre format et stocke le résultat sous forme de **nouveau** fichier Drive. L'original n'est jamais modifié. Les documents passent par pandoc, les images par Pillow, et le JSON vers CSV par l'écrivain csv de Python. Une image ne peut pas devenir un document et un document ne peut pas devenir une image ; pour extraire du texte d'une image, utilisez `imageToText`.
## Récupération du fichier en entrée

Les conversions de fichiers lisent depuis Heym Drive, et non depuis un chemin ou une URL ; le fichier doit donc d'abord y être stocké. Trois chaînes courantes :

- **[Trigger d'upload de fichier](./file-upload-trigger-node.md) → Converter** — pointez `converterFileId` vers `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — récupérez un fichier distant dans Drive, puis passez `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — une skill qui écrit un fichier l'expose sous la forme `$reportAgent._generated_files[0].id`.

`converterFileId` accepte également un objet fichier complet (`$Upload.file`) ou une URL de téléchargement Heym ; l'id du fichier est extrait de l'un ou de l'autre. Le fichier doit vous appartenir ou avoir été partagé avec vous par un collègue.

## Langues

`auto` (valeur par défaut) exécute d'abord la détection d'orientation et de script de Tesseract, puis sélectionne le meilleur modèle installé pour le script détecté. Les modèles de script tels que `Latin` ou `Cyrillic` lisent toutes les langues écrites dans ce script, ce qui explique pourquoi le mode auto traite aussi bien une facture turque qu'une facture anglaise sans qu'on lui indique laquelle est laquelle.

Nommer la langue reste toutefois plus précis lorsque vous la connaissez. Utilisez un code unique (`tur`), ou joignez-en plusieurs avec `+` (`eng+tur`) pour les documents mixtes — plus de langues signifie une reconnaissance plus lente et légèrement plus bruitée, donc gardez la liste courte. Les codes ne fonctionnent que si les données de langue correspondantes sont installées sur le backend ; le nœud liste celles qui sont disponibles lorsque vous en sélectionnez une manquante.

Chaque image Heym embarque `osd`, l'anglais, le turc, l'allemand, le français, l'espagnol, l'italien, le portugais, le néerlandais, le russe, l'arabe, le chinois simplifié, le japonais, le coréen, ainsi que les modèles de script Latin, Cyrillic, Arabic, HanS, Japanese et Hangul.

## Encodage

Le texte reconnu est en UTF-8 et conserve chaque caractère produit par Tesseract. `ocrNormalizeUnicode` (activé par défaut) applique la normalisation NFC, de sorte qu'une lettre écrite comme `s` suivi d'une cédille combinante devient un seul `ş` — il vaut mieux le laisser activé, car les deux formes ne sont pas égales dans les comparaisons ou les recherches en base de données.

`ocrEncoding` n'a d'importance que lorsqu'un élément en aval ne peut pas stocker toute la plage Unicode. Choisir `cp1254` ou `iso-8859-9` préserve le texte turc tout en garantissant que le résultat tient dans ce jeu de caractères ; `latin-1` et `ascii` sont plus restrictifs et remplacent ce qu'ils ne peuvent pas représenter par `?`. Laissez `utf-8` sauf si un système cible vous y contraint.

## Sortie

`csvToJson`, `jsonToCsv`, `xmlToJson` et `jsonToXml` renvoient `$label.result` et `$label.conversion`. Les conversions OCR ajoutent :

| Champ | Description |
|-------|-------------|
| `$label.result` | Le texte extrait complet, les pages étant jointes par une ligne vide |
| `$label.language` | Le modèle qui a réellement été exécuté (utile pour voir ce que `auto` a choisi) |
| `$label.encoding` | Le jeu de caractères vers lequel le texte a été normalisé |
| `$label.page_count` | Nombre de pages reconnues |
| `$label.pages` | Tableau de `{ page, text }` pour un traitement page par page |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` du fichier source |

`fileConvert` renvoie quant à lui le nouveau fichier :

| Champ | Description |
|-------|-------------|
| `$label.id` | UUID du fichier nouvellement stocké |
| `$label.filename` | Nom de fichier converti, le nom de base étant conservé et l'extension remplacée |
| `$label.mime_type` | Type MIME du nouveau fichier |
| `$label.size_bytes` | Taille du nouveau fichier |
| `$label.download_url` | URL de téléchargement Drive pour le nouveau fichier |
| `$label.source_file` | Métadonnées du fichier qui a été converti |

## Exemple

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

Pour l'entrée `name,age\nAda,36`, les nœuds en aval accèdent aux lignes analysées via `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Conversion de XML en JSON :

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

Pour `<person id="1"><name>Ada</name></person>`, `$xmlToObject.result` vaut `{ "person": { "@id": "1", "name": "Ada" } }`. Pour créer du XML, passez cet objet à un second nœud Converter avec `conversion: "jsonToXml"`.

Lecture d'une facture scannée téléversée via un trigger d'upload de fichier :

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

Un nœud [Agent](./agent-node.md) ou [LLM](./llm-node.md) en aval peut ensuite extraire des champs structurés de `$readInvoice.result`.

Conversion du rapport markdown d'un agent en PDF :

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

Les nœuds en aval lisent `$convertDoc.download_url` pour partager le PDF, ou `$convertDoc.id` pour continuer à travailler avec lui dans [Drive](./drive-node.md).
## Exigences

L'OCR fait appel à `tesseract` et à `pdftoppm` de poppler, et la conversion de documents utilise pandoc. Ces trois outils sont fournis avec chaque mode d'exécution de Heym, y compris `run.sh`, docker-compose et l'image de release unique ; il n'y a donc rien à configurer. Les limites de pages, les timeouts et le DPI maximal sont des valeurs de plateforme fixes et non des paramètres.

## Voir aussi

- [Set](./set-node.md) – Transformer et mapper des champs individuels
- [JSON output mapper](./json-output-mapper-node.md) – Construire un objet de réponse JSON
- [File upload trigger](./file-upload-trigger-node.md) – Accepter un fichier dans Heym Drive
- [Drive](./drive-node.md) – Stocker, récupérer et partager des fichiers
- [Node Types](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [Expression DSL](../reference/expression-dsl.md) – Fonctions et syntaxe
