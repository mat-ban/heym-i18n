# Nœud Amazon S3

Le nœud Amazon S3 lit et écrit des objets dans [Amazon S3](https://aws.amazon.com/s3/).

## Opérations prises en charge

- `Create Bucket` : Crée un bucket dans la région de l'identifiant.
- `Delete Bucket` : Supprime un bucket vide.
- `List Buckets` : Liste les buckets visibles par l'identifiant.
- `Create Folder` : Crée un marqueur de dossier vide (clé de zéro octet se terminant par `/`).
- `Delete Folder` : Supprime tous les objets sous un préfixe de dossier (y compris les clés imbriquées).
- `Get All in Folder` : Liste toutes les métadonnées d'objets sous un préfixe de dossier (pagination côté serveur).
- `Upload Object` : Écrit un payload texte dans un bucket/une clé.
- `Get Object` : Télécharge un objet et renvoie soit le texte décodé, soit le contenu en base64.
- `Copy Object` : Copie un objet vers une autre clé ou un autre bucket.
- `List Objects` : Liste les métadonnées d'objets sous un préfixe (page unique, jusqu'à 1000 clés ; prend en charge les tokens de continuation).
- `Delete Object` : Supprime un objet unique par sa clé.

## Configuration de l'identifiant

Créez un identifiant `Amazon S3` dans l'onglet Identifiants avec :

- Access Key ID
- Secret Access Key
- Region
- Session Token facultatif (pour les identifiants AWS STS temporaires)

## Champs courants

- `Bucket` : Nom du bucket cible (bucket de destination pour les opérations de copie).
- `Object Key` : Clé d'objet de type chemin telle que `reports/daily.json`.
- `Folder Path` : Préfixe pour les opérations sur les dossiers (par exemple `docs/archive`).
- `Source Bucket` : Bucket source facultatif pour la copie ; par défaut, le bucket de destination.
- `Source Object Key` : Clé source pour les opérations de copie.
- `Prefix` : Utilisé par les opérations de listage pour délimiter les résultats.
- `Continuation Token` : Token facultatif issu d'une réponse de listage précédente pour récupérer la page suivante.
- `Max Keys` : Taille de page pour List Objects (1–1000).
- `Include Binary` : Lorsque cette option est activée sur Get Object, renvoie `body_base64` au lieu de `body_text`.
- `Body` : Contenu texte à téléverser.
- `Content Type` : Type MIME facultatif pour les objets téléversés.

## Exemples de sortie

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## Remarques

- `Upload Object` téléverse actuellement du contenu texte UTF-8.
- `Get Object` peut renvoyer du base64 pour les fichiers binaires en activant l'option binaire.
- `Create Bucket` utilise la région de l'identifiant et nécessite `s3:CreateBucket`.
- `Delete Bucket` exige que le bucket soit vide et nécessite `s3:DeleteBucket`.
- `List Buckets` nécessite `s3:ListAllMyBuckets`.
- `Create Folder` téléverse un objet marqueur de zéro octet ; S3 ne dispose pas de type de répertoire natif.
- `Delete Folder` supprime tous les objets dont la clé commence par le préfixe du dossier ; à utiliser avec précaution.
- `Get All in Folder` pagine automatiquement à travers le préfixe jusqu'à ce que tous les objets soient renvoyés.
- `List Objects` renvoie une page (jusqu'à 1000 clés). Lorsque `truncated` est vrai, transmettez `next_continuation_token` dans le champ Continuation Token de l'appel suivant.
- `Copy Object` nécessite `s3:GetObject` sur la source et `s3:PutObject` sur la destination.

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [Identifiants](../reference/credentials.md) – Types d'identifiants et utilisation
- [Intégrations tierces](../reference/integrations.md) – Configuration de l'identifiant Amazon S3
