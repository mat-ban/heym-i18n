# Trigger File Upload

Le nœud **Trigger File Upload** est un point d'entrée sans entrée pour les workflows qui nécessitent un **fichier volumineux** (audio, vidéo, archives) ne pouvant pas être intégré en base64 dans une requête JSON. L'invocation du workflow renvoie un lien d'upload `curl` prérempli et à usage unique ; l'upload d'un fichier vers ce lien démarre l'exécution avec le fichier joint.

Utilisez-le lorsqu'un appelant — y compris un agent IA comme Claude ou ChatGPT s'exécutant dans un sandbox — doit transmettre un enregistrement vocal de 20 Mo ou une vidéo de 75 Mo à un workflow Heym.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 |
| Sorties | 1 |
| Sortie | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Fonctionnement

Le nœud fonctionne en deux phases :

1. **Émission.** Lorsque le workflow est invoqué via HTTP (`POST /api/workflows/{id}/execute`), en tant qu'outil MCP, ou via le bouton **Run Workflow** du canvas, l'exécution n'exécute **pas** le corps. À la place, elle émet un emplacement d'upload à usage unique et renvoie :

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **Upload + exécution.** L'appelant exécute le `curl` avec son fichier. L'endpoint d'upload valide l'emplacement, stocke le fichier, exécute le workflow **de manière synchrone** et renvoie la sortie du workflow dans la réponse d'upload. Le lien est **à usage unique** — un second upload renvoie `409`.

Sur le canvas, **Run Workflow** affiche le `curl` émis dans le panneau de débogage avec un bouton de copie.

## Exécution depuis Heym

Deux emplacements permettent d'exécuter directement un tel Workflow sur un fichier, via le même mécanisme de génération et de téléversement :

- Le [Quick Drawer](../reference/quick-drawer.md) affiche une zone de dépôt pour le fichier. Ces exécutions sont étiquetées `Quick Drawer` dans l'historique.
- Un [widget d'exécution](../tabs/dashboard-tab.md#run-widgets) sur un tableau de bord exécute le Workflow sur chaque fichier déposé. Ces exécutions sont étiquetées `dashboard`.

## Paramètres

| Paramètre | Type | Valeur par défaut | Description |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Durée de validité du lien d'upload (1–10080 minutes / jusqu'à 7 jours). |
| `maxSizeMb` | number | `100` | Taille maximale acceptée du fichier. Le plafond absolu est de **100 Mo**. |
| `allowedTypes` | string | (vide) | Liste d'autorisation MIME/extension facultative, séparée par des virgules, par ex. `audio/*, .wav`. Vide autorise tout type. |

## Champs de sortie

| Expression | Description |
|------------|-------------|
| `$nodeLabel.file.id` | UUID du fichier stocké (un fichier Drive). |
| `$nodeLabel.file.name` | Nom de fichier d'origine. |
| `$nodeLabel.file.mime` | Type de contenu détecté. |
| `$nodeLabel.file.size` | Taille en octets. |
| `$nodeLabel.file.download_url` | URL de téléchargement authentifiée pour les nœuds en aval. |
| `$nodeLabel.uploaded_at` | Horodatage ISO de l'upload. |

## Exemple

Un workflow de transcription :

```
Trigger File Upload ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Un agent appelle l'outil MCP du workflow et reçoit le `curl`.
2. L'agent exécute le `curl` avec l'enregistrement depuis son sandbox.
3. L'upload exécute le workflow et la réponse du `curl` contient le résumé de la transcription.

## Sécurité

- L'URL d'upload intègre un token à haute entropie — le token **est** la capacité, donc un agent en sandbox n'a besoin d'aucun identifiant Heym pour uploader. Seul le hash du token est stocké côté serveur.
- L'émission nécessite l'authentification normale du workflow, donc seuls les appelants autorisés peuvent créer des liens d'upload.
- Chaque émission et chaque tentative d'upload (acceptée ou rejetée — expirée, rejouée, surdimensionnée, type non autorisé, token inconnu) est consignée dans une piste d'audit en ajout seul.
- Les uploads sont à usage unique, limités par TTL et plafonnés en taille ; les uploads surdimensionnés sont rejetés.

## Remarques

- Les canaux d'invocation génériques HTTP, MCP et canvas restent limités au JSON ; ce nœud est la manière prise en charge d'accepter des uploads de fichiers multipart.
- Le fichier uploadé est stocké comme un fichier Drive normal, donc tout nœud en aval acceptant une référence de fichier (transcription, pièce jointe d'e-mail, etc.) peut consommer `$nodeLabel.file`.
