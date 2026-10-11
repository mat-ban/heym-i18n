# Nœud Drive

Le nœud **Drive** gère les fichiers générés par les skills directement depuis un workflow. Utilisez-le pour récupérer des fichiers, télécharger des fichiers depuis des URL externes, les supprimer, les partager ou les retirer du partage avec vos équipes, ou mettre à jour leurs contraintes d'accès (mot de passe, expiration, limite de téléchargement) par programmation.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (varie selon l'opération) |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `driveOperation` | string | Opération : `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID du fichier Drive à gérer (toutes les opérations sauf `getAll`, `downloadUrl` et `save`) |
| `driveLimit` | number | Nombre maximum de fichiers à retourner (`getAll` uniquement ; vide signifie aucune limite) |
| `driveSourceUrl` | expression | URL à récupérer et à stocker dans Drive (`downloadUrl` uniquement) |
| `driveFilename` | expression | Nom de fichier complet incluant l'extension (`save` uniquement, ex. `1.mp3`) |
| `driveBase64Content` | expression | Chaîne base64 brute ou data URL à décoder et à stocker (`save` uniquement) |
| `driveIncludeBinary` | boolean | Inclure le contenu du fichier en base64 dans la sortie (`get` uniquement) |
| `drivePassword` | expression | Mot de passe à définir sur le token d'accès (`setPassword` uniquement) |
| `driveTtlHours` | number | Nombre d'heures avant l'expiration du lien de téléchargement (`setTtl` uniquement) |
| `driveMaxDownloads` | number | Nombre maximum de téléchargements autorisés (`setMaxDownloads` uniquement) |

## Obtenir l'ID du fichier

Lorsqu'un skill génère des fichiers, la sortie inclut un tableau `_generated_files`. Chaque entrée contient un champ `id` :

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 45231,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

Référencez l'ID du fichier avec : `$agentLabel._generated_files[0].id`

## Opérations

| Opération | Champs requis | Description |
|-----------|----------------|-------------|
| `get` | driveFileId | Récupérer les métadonnées du fichier (et éventuellement le contenu binaire) depuis Drive |
| `getAll` | aucun | Lister les fichiers Drive lisibles possédés et partagés avec l'équipe, avec leurs métadonnées telles que le nom de fichier, le type MIME, la taille, la source et l'URL de téléchargement |
| `downloadUrl` | driveSourceUrl | Récupérer un fichier depuis une URL externe et le stocker dans Drive |
| `save` | driveFilename, driveBase64Content | Décoder le contenu base64 et le stocker en tant que fichier Drive |
| `delete` | driveFileId | Supprimer le fichier et tous ses tokens d'accès du disque et de la base de données |
| `setPassword` | driveFileId, drivePassword | Remplacer le token public par défaut par un token protégé par mot de passe |
| `setTtl` | driveFileId, driveTtlHours | Remplacer le token public par défaut par un token qui expire après N heures |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Remplacer le token public par défaut par un token limité à N téléchargements |
| `shareWithMyTeams` | driveFileId | Partager le fichier en lecture seule avec toutes les équipes auxquelles le propriétaire du workflow appartient actuellement |
| `unshareWithMyTeams` | driveFileId | Retirer tous les partages d'équipe du fichier |

> **Remarque :** Les opérations `set*` suppriment le token public par défaut (sans contrainte) et en créent un nouveau avec la contrainte spécifiée. Le `download_url` mis à jour est inclus dans la sortie.
> **Partage d'équipe :** `shareWithMyTeams` crée des partages explicites pour les équipes actuelles du propriétaire. Les futures équipes ne sont pas ajoutées automatiquement, sauf si l'opération est exécutée à nouveau. `unshareWithMyTeams` retire tous les partages d'équipe du fichier.

## Exemple — Télécharger un fichier depuis une URL

```json
{
  "type": "drive",
  "data": {
    "label": "fetchReport",
    "driveOperation": "downloadUrl",
    "driveSourceUrl": "https://example.com/reports/q1.pdf"
  }
}
```

Référencez le fichier stocké en aval : `$fetchReport.id`, `$fetchReport.download_url`

Le nom de fichier est extrait de l'en-tête de réponse `Content-Disposition` ; s'il est absent, il est dérivé du chemin de l'URL.

## Exemple — Enregistrer une entrée base64 dans Drive

Utilisez ceci lorsqu'un nœud d'entrée texte (ou tout nœud en amont) fournit un contenu de fichier en base64 :

```json
{
  "type": "drive",
  "data": {
    "label": "saveAudio",
    "driveOperation": "save",
    "driveFilename": "$userInput.body.filename",
    "driveBase64Content": "$userInput.body.base64"
  }
}
```

Référencez le fichier stocké en aval : `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` accepte une chaîne base64 brute ou une data URL `data:...;base64,...`. Le type MIME est déduit de l'extension du nom de fichier.
## Exemple — Récupérer un fichier et utiliser le binaire dans un Vision LLM

```json
{
  "type": "drive",
  "data": {
    "label": "fetchImage",
    "driveOperation": "get",
    "driveFileId": "550e8400-e29b-41d4-a716-446655440000",
    "driveIncludeBinary": true
  }
}
```

Référencez le contenu base64 en aval : `$fetchImage.file_base64`

Les images renvoyées via `file_base64` sont affichées directement dans le panneau de débogage lors de l'exécution du workflow.

## Exemple — Lister les fichiers Drive

```json
{
  "type": "drive",
  "data": {
    "label": "listFiles",
    "driveOperation": "getAll",
    "driveLimit": 50
  }
}
```

Référencez le premier fichier renvoyé en aval : `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`

## Exemple — Supprimer un fichier après traitement

```json
{
  "type": "drive",
  "data": {
    "label": "cleanup",
    "driveOperation": "delete",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Exemple — Définir un mot de passe sur un fichier généré

```json
{
  "type": "drive",
  "data": {
    "label": "protectFile",
    "driveOperation": "setPassword",
    "driveFileId": "$generateReport._generated_files[0].id",
    "drivePassword": "$input.password"
  }
}
```

## Exemple — Définir une expiration (TTL)

```json
{
  "type": "drive",
  "data": {
    "label": "expireFile",
    "driveOperation": "setTtl",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveTtlHours": 24
  }
}
```

## Exemple — Limiter les téléchargements

```json
{
  "type": "drive",
  "data": {
    "label": "limitDownloads",
    "driveOperation": "setMaxDownloads",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveMaxDownloads": 3
  }
}
```

## Exemple — Partager avec mes équipes

```json
{
  "type": "drive",
  "data": {
    "label": "shareReport",
    "driveOperation": "shareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

Les membres de l'équipe peuvent consulter et télécharger le fichier depuis Drive et utiliser les opérations de lecture dans les workflows. Ils ne peuvent ni le supprimer, ni le repartager, ni modifier les contraintes du lien public.

## Exemple — Annuler le partage avec mes équipes

```json
{
  "type": "drive",
  "data": {
    "label": "unshareReport",
    "driveOperation": "unshareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Conversion d'un fichier

La conversion de format a été déplacée vers le nœud [Converter](./converter-node.md). Stockez ou récupérez le fichier avec Drive, puis transmettez son id à un nœud converter :

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

Le fichier d'origine est conservé et le fichier converti est stocké en tant que nouveau fichier Drive.

## Accès aux sorties

**get :**
- `$nodeLabel.id` — UUID du fichier
- `$nodeLabel.filename` — nom du fichier
- `$nodeLabel.mime_type` — type MIME (ex. `image/png`)
- `$nodeLabel.size_bytes` — taille du fichier en octets
- `$nodeLabel.download_url` — URL de téléchargement public
- `$nodeLabel.file_base64` — contenu du fichier encodé en base64 (uniquement lorsque **Include binary content** est activé)

**getAll :**
- `$nodeLabel.files` — Tableau d'objets de métadonnées de fichiers
- `$nodeLabel.count` — Nombre de fichiers renvoyés
- `$nodeLabel.files[0].id` — UUID du fichier
- `$nodeLabel.files[0].filename` — Nom du fichier
- `$nodeLabel.files[0].mime_type` — Type MIME
- `$nodeLabel.files[0].size_bytes` — Taille du fichier en octets
- `$nodeLabel.files[0].download_url` — URL de téléchargement public lorsqu'un token public existe
- `$nodeLabel.files[0].metadata` — Objet de métadonnées stocké
- `$nodeLabel.files[0].created_at` — Horodatage de création du fichier

**downloadUrl :**
- `$nodeLabel.id` — UUID du fichier nouvellement stocké
- `$nodeLabel.filename` — nom du fichier (issu de `Content-Disposition` ou du chemin de l'URL)
- `$nodeLabel.mime_type` — type MIME détecté à partir de la réponse ou de l'extension du fichier
- `$nodeLabel.size_bytes` — taille du fichier en octets
- `$nodeLabel.download_url` — URL de téléchargement Drive pour le fichier stocké

**delete :**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID du fichier supprimé

**setPassword / setTtl / setMaxDownloads :**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID du fichier
- `$nodeLabel.download_url` — Nouvelle URL de token d'accès avec la contrainte appliquée

**shareWithMyTeams :**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID du fichier
- `$nodeLabel.shared_team_count` — Nombre de partages d'équipe après l'opération

**unshareWithMyTeams :**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID du fichier
- `$nodeLabel.shared_team_count` — `0` après l'opération

## Propriété

Les opérations réservées au propriétaire nécessitent que le fichier appartienne au propriétaire du workflow. Les opérations de lecture (`get`, `getAll`) peuvent également accéder aux fichiers partagés avec le propriétaire du workflow via une équipe.
## Related

- [Génération de fichiers](../reference/file-generation.md) - Comment les skills génèrent des fichiers et la sortie `_generated_files`
- [Onglet Drive](../reference/drive.md) - Gestion visuelle des fichiers dans le tableau de bord
- [Nœud Agent](./agent-node.md) - Exécute des skills qui génèrent des fichiers
- [Nœud Converter](./converter-node.md) - Convertit un fichier stocké vers un autre format, ou applique un OCR pour le convertir en texte
- [Expression DSL](../reference/expression-dsl.md) - Syntaxe des expressions pour les valeurs dynamiques
