# Amazon S3-Knoten

Der Amazon S3-Knoten liest und schreibt Objekte in [Amazon S3](https://aws.amazon.com/s3/).

## Unterstützte Operationen

- `Create Bucket`: Erstellt einen Bucket in der Region der Anmeldedaten.
- `Delete Bucket`: Löscht einen leeren Bucket.
- `List Buckets`: Listet die für die Anmeldedaten sichtbaren Buckets auf.
- `Create Folder`: Erstellt einen leeren Ordner-Marker (Zero-Byte-Key, der mit `/` endet).
- `Delete Folder`: Löscht alle Objekte unter einem Ordner-Präfix (einschließlich verschachtelter Keys).
- `Get All in Folder`: Listet alle Objekt-Metadaten unter einem Ordner-Präfix auf (serverseitige Paginierung).
- `Upload Object`: Schreibt eine Text-Payload in einen Bucket/Key.
- `Get Object`: Lädt ein Objekt herunter und gibt entweder dekodierten Text oder base64-Inhalt zurück.
- `Copy Object`: Kopiert ein Objekt in einen anderen Key oder Bucket.
- `List Objects`: Listet Objekt-Metadaten unter einem Präfix auf (einzelne Seite, bis zu 1000 Keys; unterstützt Continuation-Tokens).
- `Delete Object`: Löscht ein einzelnes Objekt anhand des Keys.

## Einrichtung der Anmeldedaten

Erstelle eine `Amazon S3`-Anmeldedaten im Reiter Anmeldedaten mit:

- Access Key ID
- Secret Access Key
- Region
- Optionales Session Token (für temporäre AWS STS-Anmeldedaten)

## Allgemeine Felder

- `Bucket`: Name des Ziel-Buckets (Ziel-Bucket für Kopieroperationen).
- `Object Key`: Pfadähnlicher Objekt-Key wie `reports/daily.json`.
- `Folder Path`: Präfix für Ordneroperationen (zum Beispiel `docs/archive`).
- `Source Bucket`: Optionaler Quell-Bucket für das Kopieren; standardmäßig der Ziel-Bucket.
- `Source Object Key`: Quell-Key für Kopieroperationen.
- `Prefix`: Wird von Listenoperationen verwendet, um die Ergebnisse einzugrenzen.
- `Continuation Token`: Optionales Token aus einer vorherigen Listen-Antwort, um die nächste Seite abzurufen.
- `Max Keys`: Seitengröße für List Objects (1–1000).
- `Include Binary`: Wenn bei Get Object aktiviert, wird `body_base64` statt `body_text` zurückgegeben.
- `Body`: Textinhalt zum Hochladen.
- `Content Type`: Optionaler MIME-Typ für hochgeladene Objekte.

## Ausgabebeispiele

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

## Hinweise

- `Upload Object` lädt derzeit UTF-8-Textinhalt hoch.
- `Get Object` kann base64 für Binärdateien zurückgeben, indem die Binär-Option aktiviert wird.
- `Create Bucket` verwendet die Region der Anmeldedaten und erfordert `s3:CreateBucket`.
- `Delete Bucket` erfordert, dass der Bucket leer ist, und benötigt `s3:DeleteBucket`.
- `List Buckets` erfordert `s3:ListAllMyBuckets`.
- `Create Folder` lädt ein Zero-Byte-Marker-Objekt hoch; S3 hat keinen nativen Verzeichnistyp.
- `Delete Folder` entfernt jedes Objekt, dessen Key mit dem Ordner-Präfix beginnt; mit Vorsicht verwenden.
- `Get All in Folder` paginiert automatisch durch das Präfix, bis alle Objekte zurückgegeben wurden.
- `List Objects` gibt eine Seite zurück (bis zu 1000 Keys). Wenn `truncated` true ist, übergib `next_continuation_token` in das Continuation Token-Feld des nächsten Aufrufs.
- `Copy Object` erfordert `s3:GetObject` für die Quelle und `s3:PutObject` für das Ziel.

## Verwandtes

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Anmeldedaten](../reference/credentials.md) – Anmeldedaten-Typen und deren Verwendung
- [Drittanbieter-Integrationen](../reference/integrations.md) – Einrichtung der Amazon S3-Anmeldedaten
