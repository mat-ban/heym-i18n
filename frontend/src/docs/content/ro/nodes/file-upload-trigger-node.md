# Trigger de Încărcare Fișier

Nodul **Trigger de Încărcare Fișier** este un punct de intrare fără intrări pentru workflow-uri care necesită un **fișier de mari dimensiuni** (audio, video, arhive) ce nu poate fi încorporat ca base64 într-o cerere JSON. Invocarea workflow-ului returnează un link `curl` de încărcare precompletat, cu utilizare unică; încărcarea unui fișier la acel link pornește execuția cu fișierul atașat.

Utilizați acest nod atunci când un apelant — inclusiv un agent AI precum Claude sau ChatGPT care rulează într-un sandbox — trebuie să transmită o înregistrare vocală de 20 MB sau un video de 75 MB către un workflow Heym.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Cum funcționează

Nodul rulează în două faze:

1. **Generare.** Când workflow-ul este invocat prin HTTP (`POST /api/workflows/{id}/execute`), ca instrument MCP sau prin butonul **Run Workflow** din canvas, execuția **nu** execută corpul. În schimb, generează un slot de încărcare cu utilizare unică și returnează:

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

2. **Încărcare + execuție.** Apelantul rulează `curl` cu fișierul său. Endpoint-ul de încărcare validează slotul, stochează fișierul, rulează workflow-ul **sincron** și returnează ieșirea workflow-ului în răspunsul de încărcare. Linkul este **cu utilizare unică** — o a doua încărcare returnează `409`.

Pe canvas, **Run Workflow** afișează `curl`-ul generat în panoul de depanare, cu un buton de copiere.

## Parametri

| Parametru | Tip | Implicit | Descriere |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Cât timp rămâne valid linkul de încărcare (1–10080 minute / până la 7 zile). |
| `maxSizeMb` | number | `100` | Dimensiunea maximă acceptată a fișierului. Plafonul maxim este de **100 MB**. |
| `allowedTypes` | string | (gol) | Listă opțională de tipuri MIME/extensii permise, separate prin virgulă, de ex. `audio/*, .wav`. Gol permite orice tip. |

## Câmpuri de ieșire

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.file.id` | UUID-ul fișierului stocat (un fișier Drive). |
| `$nodeLabel.file.name` | Numele original al fișierului. |
| `$nodeLabel.file.mime` | Tipul de conținut detectat. |
| `$nodeLabel.file.size` | Dimensiunea în bytes. |
| `$nodeLabel.file.download_url` | URL de descărcare autentificat pentru nodurile din aval. |
| `$nodeLabel.uploaded_at` | Marcaj temporal ISO al încărcării. |

## Exemplu

Un workflow de transcriere:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Un agent apelează instrumentul MCP al workflow-ului și primește `curl`-ul.
2. Agentul rulează `curl`-ul cu înregistrarea din sandbox-ul său.
3. Încărcarea rulează workflow-ul, iar răspunsul `curl` conține rezumatul transcrierii.

## Securitate

- URL-ul de încărcare încorporează un token cu entropie ridicată — token-ul **este** capabilitatea, astfel încât un agent în sandbox nu are nevoie de acreditări Heym pentru a încărca. Doar hash-ul token-ului este stocat pe server.
- Generarea necesită autentificarea normală a workflow-ului, astfel încât doar apelanții autorizați pot crea linkuri de încărcare.
- Fiecare generare și fiecare tentativă de încărcare (acceptată sau respinsă — expirată, reluată, supradimensionată, tip nepermis, token necunoscut) este înregistrată într-un istoric de audit cu adăugare exclusivă.
- Încărcările sunt impuse cu utilizare unică, limitate de TTL și plafonate ca dimensiune; încărcările supradimensionate sunt respinse.

## Note

- Canalele generice de invocare HTTP, MCP și canvas rămân exclusiv JSON; acest nod este modalitatea acceptată de a primi încărcări de fișiere multipart.
- Fișierul încărcat este stocat ca un fișier Drive normal, astfel încât orice nod din aval care acceptă o referință de fișier (transcriere, trimitere atașament e-mail etc.) poate consuma `$nodeLabel.file`.
