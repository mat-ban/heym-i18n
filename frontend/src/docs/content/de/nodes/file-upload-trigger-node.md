# Datei-Upload-Trigger

Der **Datei-Upload-Trigger**-Knoten ist ein Eingangspunkt ohne Eingabe für Workflows, die eine **große Datei** (Audio, Video, Archive) benötigen, die nicht als base64 in eine JSON-Anfrage eingebettet werden kann. Beim Aufruf des Workflows wird ein vorbefüllter, einmalig verwendbarer `curl`-Upload-Link zurückgegeben; das Hochladen einer Datei auf diesen Link startet die Ausführung mit der angehängten Datei.

Verwende ihn, wenn ein Aufrufer — einschließlich eines AI-Agenten wie Claude oder ChatGPT, der in einer Sandbox läuft — eine 20 MB große Sprachaufnahme oder ein 75 MB großes Video an einen Heym-Workflow übergeben muss.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Funktionsweise

Der Knoten läuft in zwei Phasen:

1. **Erzeugen.** Wenn der Workflow über HTTP (`POST /api/workflows/{id}/execute`), als MCP-Tool oder über die Canvas-Schaltfläche **Run Workflow** aufgerufen wird, führt die Ausführung **nicht** den Body aus. Stattdessen wird ein einmalig verwendbarer Upload-Slot erzeugt und Folgendes zurückgegeben:

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

2. **Hochladen + Ausführen.** Der Aufrufer führt den `curl` mit seiner Datei aus. Der Upload-Endpoint validiert den Slot, speichert die Datei, führt den Workflow **synchron** aus und gibt die Workflow-Ausgabe in der Upload-Antwort zurück. Der Link ist **einmalig verwendbar** — ein zweiter Upload gibt `409` zurück.

Auf dem Canvas zeigt **Run Workflow** den erzeugten `curl` im Debug-Panel mit einer Kopierschaltfläche an.

## Parameter

| Parameter | Typ | Standard | Beschreibung |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Wie lange der Upload-Link gültig bleibt (1–10080 Minuten / bis zu 7 Tage). |
| `maxSizeMb` | number | `100` | Maximal akzeptierte Dateigröße. Harte Obergrenze ist **100 MB**. |
| `allowedTypes` | string | (leer) | Optionale kommagetrennte MIME-/Erweiterungs-Allowlist, z. B. `audio/*, .wav`. Leer erlaubt jeden Typ. |

## Ausgabefelder

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.file.id` | Gespeicherte Datei-UUID (eine Drive-Datei). |
| `$nodeLabel.file.name` | Ursprünglicher Dateiname. |
| `$nodeLabel.file.mime` | Erkannter Inhaltstyp. |
| `$nodeLabel.file.size` | Größe in Bytes. |
| `$nodeLabel.file.download_url` | Authentifizierte Download-URL für nachgelagerte Knoten. |
| `$nodeLabel.uploaded_at` | ISO-Zeitstempel des Uploads. |

## Beispiel

Ein Transkriptions-Workflow:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Ein Agent ruft das MCP-Tool des Workflows auf und erhält den `curl`.
2. Der Agent führt den `curl` mit der Aufnahme aus seiner Sandbox aus.
3. Der Upload führt den Workflow aus und die `curl`-Antwort enthält die Transkript-Zusammenfassung.

## Sicherheit

- Die Upload-URL enthält einen Token mit hoher Entropie — der Token **ist** die Berechtigung, sodass ein in einer Sandbox laufender Agent keine Heym-Anmeldedaten zum Hochladen benötigt. Serverseitig wird nur der Hash des Tokens gespeichert.
- Das Erzeugen erfordert die normale Workflow-Authentifizierung, sodass nur autorisierte Aufrufer Upload-Links erstellen können.
- Jedes Erzeugen und jeder Upload-Versuch (akzeptiert oder abgelehnt — abgelaufen, wiederverwendet, übergroß, nicht erlaubter Typ, unbekannter Token) wird in einem append-only Audit-Trail festgehalten.
- Uploads werden einmalig verwendet, TTL-begrenzt und größenbegrenzt durchgesetzt; übergroße Uploads werden abgelehnt.

## Hinweise

- Die generischen HTTP-, MCP- und Canvas-Aufrufkanäle bleiben JSON-only; dieser Knoten ist der unterstützte Weg, um Multipart-Datei-Uploads zu akzeptieren.
- Die hochgeladene Datei wird als normale Drive-Datei gespeichert, sodass jeder nachgelagerte Knoten, der eine Dateireferenz akzeptiert (Transkription, E-Mail-Anhang senden usw.), `$nodeLabel.file` konsumieren kann.
