# Google Drive

Le nœud **Google Drive** permet de lister, télécharger, mettre à jour et supprimer des fichiers et dossiers dans Google Drive via OAuth2. Il peut également copier un fichier Drive directement dans [Heym Drive](./drive-node.md) en une seule opération.

> **Ceci n'est pas le nœud [Drive](./drive-node.md).** Ce nœud correspond à *Heym Drive* — le stockage de fichiers interne propre à Heym. Le présent nœud communique avec Google Drive. L'opération `syncToHeymDrive` constitue le pont entre les deux.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Identifiant | Google Drive (OAuth2) |
| Sortie | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant Google Drive issu de l'onglet [Identifiants](../tabs/credentials-tab.md) |
| `gdOperation` | string | Opération : `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID du dossier ou URL complète du dossier Drive. Utilisé par `listFolderFiles` et `removeFolder`. Une valeur vide désigne la racine de Drive. |
| `gdFileId` | expression | ID du fichier ou URL complète Drive/Docs. Utilisé par `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Pour `listFolderFiles` : nombre maximal de fichiers à retourner (100 par défaut). Une valeur vide ou `0` charge l'intégralité du dossier via pagination. Chaque fichier listé inclut `size_bytes` lorsque Drive fournit une taille. |
| `gdQuery` | expression | Pour `listFolderFiles` : requête Drive supplémentaire combinée par AND avec le filtre de dossier, par ex. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Pour `listFolderFiles` : inclure les fichiers placés dans la corbeille. Valeur par défaut : false. |
| `gdExportFormat` | string | Pour `downloadFile` / `syncToHeymDrive` : `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Une valeur vide active le mode automatique. Ignoré pour les fichiers standards. |
| `gdFilename` | expression | Pour `syncToHeymDrive` : remplacer le nom de fichier stocké dans Heym Drive. |
| `gdBase64Content` | expression | Pour `updateFile` : chaîne base64 ou URL `data:` qui remplace le contenu du fichier. |
| `gdNewName` | expression | Pour `updateFile` : nouveau nom de fichier (renommage). |
| `gdNewParentId` | expression | Pour `updateFile` : ID ou URL du dossier de destination (déplacement). |
| `gdPermanentDelete` | boolean | Pour `removeFile` / `removeFolder` : lorsque la valeur est false (par défaut), l'élément est placé dans la corbeille et reste récupérable ; lorsque la valeur est true, il est définitivement détruit. |

## ID de fichiers et de dossiers

`gdFileId`, `gdFolderId` et `gdNewParentId` acceptent soit l'**ID brut**, soit une **URL complète** — Heym extrait automatiquement l'ID. Tous les formats suivants fonctionnent :

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets et Slides

Les documents natifs Google ne disposent d'**aucun octet téléchargeable**. Ce sont des enregistrements sur les serveurs de Google, et non des fichiers — l'API Drive renvoie `403 Only files with binary content can be downloaded` si vous demandez leur contenu brut.

`downloadFile` et `syncToHeymDrive` détectent automatiquement ces cas et procèdent à une **exportation** à la place, de sorte qu'aucune opération n'échoue simplement parce que la cible est un Google Doc :

| Source | Exportation par défaut |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Tout autre type natif Google | PDF |

Définissez le **Format d'exportation** pour remplacer la cible. Ce paramètre est ignoré pour les fichiers standards téléversés, qui sont toujours téléchargés tels quels.

## Opérations

| Opération | Requis | Description |
|-----------|----------|-------------|
| `listFolderFiles` | — (dossier vide = racine) | Lister les fichiers d'un dossier, avec un filtre de requête optionnel |
| `downloadFile` | `gdFileId` | Télécharger les octets du fichier en base64, en exportant automatiquement les documents natifs |
| `syncToHeymDrive` | `gdFileId` | Télécharger depuis Google Drive et stocker le résultat dans Heym Drive |
| `updateFile` | `gdFileId` + au moins l'un des paramètres contenu / nom / parent | Remplacer le contenu, renommer et/ou déplacer |
| `removeFile` | `gdFileId` | Placer dans la corbeille (par défaut) ou supprimer définitivement un fichier |
| `removeFolder` | `gdFolderId` | Placer dans la corbeille (par défaut) ou supprimer définitivement un dossier et son contenu |

### La suppression est récupérable par défaut

`removeFile` et `removeFolder` déplacent l'élément vers la **corbeille Google Drive**, où il peut être restauré. Il s'agit du comportement sûr par défaut pour une opération susceptible de s'exécuter selon une planification ou au sein d'une [Boucle](./loop-node.md).

L'activation de **Supprimer définitivement** détruit l'élément sans possibilité de récupération. Pour `removeFolder`, cela détruit également tout le contenu du dossier.

Le nœud vérifie également le type de la cible : `removeFile` refuse un dossier et `removeFolder` refuse un fichier, de sorte qu'un ID saisi par erreur ne puisse pas supprimer silencieusement le mauvais élément.

### updateFile laisse les champs vides intacts

`updateFile` est une mise à jour, et non un remplacement. Renseignez n'importe quelle combinaison de contenu, de nouveau nom et de nouveau dossier — tout champ laissé vide n'est pas modifié. Au moins l'un des trois est requis.
## Configuration des identifiants

Google Drive utilise un modèle **OAuth2 « Bring Your Own App »**. Vous fournissez vos propres identifiants OAuth2 Google Cloud.

> **Cet identifiant accorde un accès complet à Drive.** Heym demande le scope `https://www.googleapis.com/auth/drive` car le nœud opère sur des fichiers que vous possédez déjà. Le scope plus restreint `drive.file` ne voit que les fichiers créés par l'application elle-même, ce qui rendrait impossible le listage, la mise à jour et la suppression de vos fichiers existants. Consultez [Partage d'identifiants](../reference/credentials-sharing.md) avant de partager cet identifiant avec une équipe.

**Configuration du backend :** Définissez **`FRONTEND_URL`** sur le backend Heym avec l'URL publique de l'application. L'URI de redirection OAuth est toujours `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — elle est dérivée uniquement de ce paramètre, et non des en-têtes de la requête.

1. Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → activez **Google Drive API**.
2. Allez dans **Credentials** → **Create Credentials** → **OAuth client ID** → sélectionnez **Web application**.
3. Sous **Authorized redirect URIs**, ajoutez exactement `{votre FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Copiez le **Client ID** et le **Client Secret**.
5. Dans Heym : **Dashboard → Credentials → New → Google Drive (OAuth2)**, collez les deux valeurs, puis cliquez sur **Connect** et approuvez l'accès dans la fenêtre contextuelle.

## Sortie

### listFolderFiles

```json
{
  "status": "success",
  "operation": "listFolderFiles",
  "folder_id": "1FolderXyz",
  "count": 2,
  "files": [
    {
      "id": "1AbC",
      "name": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 20481,
      "modified_time": "2026-07-01T10:00:00.000Z",
      "web_view_link": "https://drive.google.com/file/d/1AbC/view",
      "is_folder": false
    }
  ]
}
```

`size_bytes` vaut `null` pour les dossiers et les fichiers natifs Google, qui ne rapportent pas de taille.

### downloadFile

```json
{
  "status": "success",
  "operation": "downloadFile",
  "id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "export_format": "pdf",
  "content_base64": "JVBERi0xLjQ..."
}
```

Pour un fichier classique, `exported` vaut `false` et `export_format` vaut `null`.

### syncToHeymDrive

```json
{
  "status": "success",
  "operation": "syncToHeymDrive",
  "id": "9f1c2b3d-0000-4000-8000-000000000001",
  "google_file_id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "download_url": "https://your-heym-domain/api/files/dl/TOKEN"
}
```

`id` est le nouvel ID de fichier **Heym Drive**, distinct de `google_file_id`.

### updateFile

```json
{
  "status": "success",
  "operation": "updateFile",
  "id": "1AbC",
  "name": "renamed.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "modified_time": "2026-07-27T10:00:00.000Z",
  "updated": ["content", "name"]
}
```

### removeFile / removeFolder

```json
{
  "status": "success",
  "operation": "removeFile",
  "id": "1AbC",
  "name": "report.pdf",
  "deleted": "trashed"
}
```

`deleted` vaut `"trashed"` ou `"permanent"`.

## Exemple : sauvegarder un dossier Drive dans Heym Drive

1. **[Cron](./cron-node.md)** — exécution quotidienne.
2. **Google Drive** — `listFolderFiles` sur le dossier source, avec `gdQuery` défini sur `mimeType='application/pdf'` si vous ne souhaitez que les PDF.
3. **[Loop](./loop-node.md)** — itérer sur `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` avec `gdFileId` défini sur `$BackupLoop.item.id` et `gdFilename` défini sur `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — publier un récapitulatif de ce qui a été sauvegardé.

## Remarques

- Chaque champ texte accepte les expressions `$`, de sorte que les IDs et les noms de fichiers peuvent provenir de nœuds précédents.
- Les drives partagés sont pris en charge — le nœud définit `supportsAllDrives` sur chaque requête.
- Les téléchargements sont vérifiés en taille par rapport au paramètre `FILE_MAX_SIZE_MB` du backend.
- Attachez ce nœud à l'entrée d'outil d'un nœud [Agent](./agent-node.md) et utilisez l'icône de bot sur n'importe quel champ pour permettre à l'agent de le remplir à l'exécution.

## Voir aussi

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Identifiants](../reference/credentials.md)
- [Partage d'identifiants](../reference/credentials-sharing.md)
