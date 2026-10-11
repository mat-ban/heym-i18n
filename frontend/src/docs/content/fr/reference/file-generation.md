# Génération de fichiers

Les Skills peuvent générer des fichiers (PDF, DOCX, CSV, images, etc.) lors de leur exécution. Les fichiers générés sont automatiquement stockés et rendus disponibles au téléchargement.

## Fonctionnement

Lorsqu'un skill s'exécute, Heym crée un répertoire `_output_files/` dans l'environnement d'exécution du skill. Le chemin est disponible via la variable d'environnement `_OUTPUT_DIR`.

Tout fichier écrit dans ce répertoire (à l'exception des fichiers commençant par `_`) est capturé une fois le skill terminé, stocké dans le système de fichiers, et un lien de téléchargement est généré automatiquement.

## Écriture de fichiers dans un skill

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generate a CSV
csv_path = os.path.join(output_dir, "report.csv")
with open(csv_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Value"])
    writer.writerow(["Revenue", args.get("revenue", 0)])
    writer.writerow(["Users", args.get("users", 0)])

print(json.dumps({"status": "Report generated"}))
```

## Génération de PDF

La bibliothèque `reportlab` est disponible pour la génération de PDF :

```python
import os
import json
import sys
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

pdf_path = os.path.join(output_dir, "invoice.pdf")
c = canvas.Canvas(pdf_path, pagesize=A4)
c.drawString(100, 750, f"Invoice for {args.get('customer', 'Unknown')}")
c.drawString(100, 730, f"Amount: ${args.get('amount', 0)}")
c.save()

print(json.dumps({"status": "Invoice generated"}))
```

## Génération de DOCX

La bibliothèque `python-docx` est disponible :

```python
import os
import json
import sys
from docx import Document

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

doc = Document()
doc.add_heading(args.get("title", "Report"), level=1)
doc.add_paragraph(args.get("content", ""))
doc.save(os.path.join(output_dir, "report.docx"))

print(json.dumps({"status": "Document generated"}))
```

## Fichiers multiples

Les skills peuvent générer plusieurs fichiers en une seule exécution :

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generate CSV
with open(os.path.join(output_dir, "data.csv"), "w") as f:
    writer = csv.writer(f)
    writer.writerow(["col1", "col2"])
    writer.writerow(["val1", "val2"])

# Generate text summary
with open(os.path.join(output_dir, "summary.txt"), "w") as f:
    f.write("Summary of the data processing...")

print(json.dumps({"status": "done", "files_generated": 2}))
```

## Limites de taille des fichiers

Les fichiers générés sont soumis à la configuration `FILE_MAX_SIZE_MB` (valeur par défaut : 99 Mo). Les fichiers dépassant cette limite sont ignorés silencieusement.

## Liens de téléchargement

Après l'exécution, chaque fichier généré obtient une URL de téléchargement unique. Ces URL sont incluses dans la sortie du skill sous la clé `_generated_files` :

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.csv",
      "mime_type": "text/csv",
      "size_bytes": 1234,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

Le champ `id` correspond à l'UUID du fichier. Utilisez-le avec le [Nœud Drive](../nodes/drive-node.md) pour gérer le fichier depuis le workflow — le supprimer, ajouter un mot de passe, définir une expiration ou limiter les téléchargements :

```
$agentLabel._generated_files[0].id
```

Ces liens peuvent également être partagés directement ou gérés via l'onglet [Drive](../reference/drive.md).

Selon la configuration de déploiement, `download_url` peut être :
- Une URL absolue (lorsque `FRONTEND_URL` est configurée pour le conteneur backend).
- Un chemin relatif (par exemple `/api/files/dl/abc123...`), qui fonctionne toujours dans l'interface navigateur.

## Types MIME pris en charge

Les types de fichiers sont détectés automatiquement à partir de l'extension du fichier. Types courants :

| Extension | Type MIME |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Voir aussi

- [Nœud Drive](../nodes/drive-node.md) - Suppression programmatique, mot de passe, TTL, limites de téléchargement et partage/retrait de partage d'équipe sur les fichiers générés
- [Drive](../reference/drive.md) - Onglet Drive du tableau de bord et comportement des liens de partage
- [Onglet Drive](../tabs/drive-tab.md) - Parcourir et gérer les fichiers dans l'interface
