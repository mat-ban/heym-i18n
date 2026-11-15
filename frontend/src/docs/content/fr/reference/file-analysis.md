# Analyse de fichiers

L'analyse de fichiers permet à Chat, au [nœud Agent](../nodes/agent-node.md) et au [nœud Code](../nodes/code-node.md) d'ouvrir et d'analyser des fichiers volumineux issus de [Drive](./drive.md) dans un bac à sable (sandbox) Python isolé. Les fichiers PDF, feuilles de calcul, CSV, DOCX et JSON sont d'abord inspectés puis lus sélectivement, de sorte qu'un contrat de 200 pages ou un classeur d'un million de lignes n'a jamais besoin de tenir dans le contexte d'un modèle.

## Fonctionnement

Chaque appel s'exécute dans un conteneur neuf sans accès réseau. Les fichiers requis sont copiés en lecture seule, le code s'exécute et le conteneur est supprimé. Un petit dossier de travail persiste entre les appels d'une même session, permettant à une étape ultérieure de s'appuyer sur les résultats sauvegardés par une étape antérieure.

| Chemin | Contenu |
|------|--------|
| `/input` | Les fichiers Drive de cette session, en lecture seule |
| `/work` | Espace de travail qui persiste pendant la session, par exemple `/work/sales.pkl` |
| `/work/out` | Les fichiers écrits ici sont enregistrés dans Drive après l'appel et retournés sous forme de liens |

Le sandbox dispose de pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx et langdetect préinstallés, en plus de l'OCR Tesseract utilisé par le [nœud Convertisseur](../nodes/converter-node.md).

## Outils

Le modèle interagit avec trois outils, ainsi qu'un quatrième dans Chat :

| Outil | Fonction |
|------|----------|
| `list_files` | Liste les fichiers Drive que vous pouvez ouvrir : nom, type, taille, date |
| `inspect_file` | Renvoie le type, les métadonnées et la structure d'un fichier avec un court échantillon |
| `run_python` | Exécute du code Python sur les fichiers spécifiés et renvoie la sortie console |
| `clear_workspace` | Chat uniquement : supprime le dossier de travail de la conversation |

`inspect_file` lit uniquement ce qui est nécessaire à un résumé :

| Type | Résumé |
|-----|-----------------|
| PDF | Nombre de pages, titre et auteur, possibilité d'extraire le texte, langue, dimensions des pages, texte et tableaux de la première page. Les PDF numérisés sont lus via OCR (jusqu'à 5 pages) |
| XLSX / XLS | Feuilles avec nombre de lignes et de colonnes, lignes d'en-tête, types, `read_hint` pandas, plages nommées, premières lignes |
| CSV / TSV | Encodage, délimiteur, nombre de lignes, colonnes avec types, premières lignes |
| DOCX | Plan des titres, tableaux, nombre de mots et de caractères, auteur et date |
| JSON | Type racine, clés, longueur du tableau, profondeur d'imbrication, enregistrements d'échantillon |

Dans `run_python`, ouvrez un fichier à l'aide du module `heym_files` :

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## Dans Chat

Joignez un fichier PDF, tableur, DOCX, CSV ou JSON, une image (PNG, JPG, GIF, WebP) ou un fichier texte brut dans l'[onglet Chat](../tabs/chat-tab.md), dans le Chat de Heym Work ou via l'outil MCP `heym_chat`. Un message peut contenir jusqu'à 10 fichiers. Chaque fichier est stocké dans votre Drive ; seuls son nom et son ID sont inclus dans le message. Chat inspecte le fichier, lit la partie nécessaire à votre question et répond avec des tableaux ou des extraits.

## Dans les workflows

Une exécution n'ouvre que ses propres fichiers : ceux téléversés via le [nœud Trigger File Upload](../nodes/file-upload-trigger-node.md), ceux que ses nœuds ont écrits dans Drive, et ceux qu'un [nœud Drive](../nodes/drive-node.md) avec l'étape **Get** a récupérés au cours de la même exécution.

- **Nœud Agent** : si l'entrée ou le message de l'agent contient un fichier, il reçoit automatiquement les outils ci-dessus pour ces fichiers.
- **Nœud Code** : définissez **Files** sur une expression telle que `$Upload.file.id`. Les fichiers sont montés et listés dans `params.files`.

## Limites

| Limite | Valeur |
|-----------|------|
| Mémoire par appel | 2 Go |
| Temps par appel | 120 secondes |
| Dossier de travail par session | 2 Go |
| Fichiers de sortie par appel | 20, jusqu'à 100 Mo chacun |
| Sortie imprimée retournée au modèle | 20 000 caractères |
| Fichiers par appel | 20 |

## Sécurité

- Le sandbox n'a aucun accès réseau, aucun accès aux paramètres ou secrets de Heym, et s'exécute en tant qu'utilisateur non privilégié.
- Les fichiers sont analysés exclusivement à l'intérieur du sandbox.
- Dans Chat, l'accès suit Drive : vous ouvrez vos propres fichiers et ceux partagés avec vos équipes.
- L'ouverture d'un fichier dans Chat est consignée dans le journal d'audit.
- Le contenu des fichiers est traité comme de simples données ; les instructions contenues dans un fichier ne sont pas exécutées.

## Prérequis

L'analyse de fichiers nécessite un backend de sandbox sur l'instance Heym (Docker ou [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Voir aussi

- [Drive](./drive.md)
- [Nœud Code](../nodes/code-node.md)
- [Nœud Agent](../nodes/agent-node.md)
- [Onglet Chat](../tabs/chat-tab.md)
