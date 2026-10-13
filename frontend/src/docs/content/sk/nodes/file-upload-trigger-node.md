# Trigger pre nahrávanie súborov

Uzol **Trigger pre nahrávanie súborov** je vstupný bod s nulovým vstupom pre workflowy, ktoré potrebujú **veľký súbor** (audio, video, archívy), ktorý nie je možné vložiť ako base64 do JSON požiadavky. Vyvolanie workflowu vráti predvyplnený, jednorazový `curl` odkaz na nahrávanie; nahranie súboru na tento odkaz spustí beh s priloženým súborom.

Použite ho, keď volajúci — vrátane AI agenta, ako je Claude alebo ChatGPT bežiaci v sandboxe — musí odovzdať 20 MB hlasovú nahrávku alebo 75 MB video do workflowu Heym.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Ako to funguje

Uzol pracuje v dvoch fázach:

1. **Vytvorenie (Mint).** Keď je workflow vyvolaný cez HTTP (`POST /api/workflows/{id}/execute`), ako MCP nástroj alebo cez tlačidlo **Run Workflow** na plátne, beh **nevykoná** telo. Namiesto toho vytvorí jednorazový slot na nahrávanie a vráti:

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

2. **Nahrávanie + beh.** Volajúci spustí `curl` so svojím súborom. Endpoint na nahrávanie overí slot, uloží súbor, spustí workflow **synchronne** a vráti výstup workflowu v odpovedi na nahrávanie. Odkaz je **jednorazový** — druhé nahranie vráti `409`.

Na plátne tlačidlo **Run Workflow** zobrazí vytvorený `curl` v debug paneli s tlačidlom na kopírovanie.

## Spúšťanie z Heym

Dve miesta umožňujú spustiť takýto Workflow priamo nad súborom cez rovnaké vygenerovanie odkazu a nahranie:

- [Quick Drawer](../reference/quick-drawer.md) zobrazuje zónu na presunutie súboru. Tieto spustenia sú v histórii označené značkou `Quick Drawer`.
- [Spúšťací widget](../tabs/dashboard-tab.md#run-widgets) na dashboarde spustí Workflow pre každý presunutý súbor. Tieto spustenia sú označené značkou `dashboard`.

## Parametre

| Parameter | Typ | Predvolená hodnota | Popis |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Ako dlho zostane odkaz na nahrávanie platný (1–10080 minút / až 7 dní). |
| `maxSizeMb` | number | `100` | Maximálna akceptovaná veľkosť súboru. Pevný strop je **100 MB**. |
| `allowedTypes` | string | (prázdne) | Voliteľný zoznam povolených MIME/koncoviek oddelený čiarkami, napr. `audio/*, .wav`. Prázdne povolí akýkoľvek typ. |

## Výstupné polia

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.file.id` | UUID uloženého súboru (súbor v Drive). |
| `$nodeLabel.file.name` | Pôvodný názov súboru. |
| `$nodeLabel.file.mime` | Zistený typ obsahu. |
| `$nodeLabel.file.size` | Veľkosť v bajtoch. |
| `$nodeLabel.file.download_url` | Autentifikovaný odkaz na stiahnutie pre nadväzujúce uzly. |
| `$nodeLabel.uploaded_at` | ISO časová značka nahrania. |

## Príklad

Workflow na prepis:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Agent zavolá MCP nástroj workflowu a dostane `curl`.
2. Agent spustí `curl` s nahrávkou zo svojho sandboxu.
3. Nahrávanie spustí workflow a odpoveď na `curl` obsahuje súhrn prepisu.

## Zabezpečenie

- URL na nahrávanie obsahuje token s vysokou entropiou — token **je** oprávnenie, takže sandboxovaný agent nepotrebuje žiadne prihlasovacie údaje Heym na nahranie. Na strane servera sa ukladá iba hash tokenu.
- Vytvorenie vyžaduje bežnú autentifikáciu workflowu, takže iba autorizovaní volajúci môžu vytvárať odkazy na nahrávanie.
- Každé vytvorenie a každý pokus o nahranie (prijatý alebo zamietnutý — expirovaný, opätovne prehraný, príliš veľký, nepovolený typ, neznámy token) sa zapíše do auditnej stopy určenej iba na pridávanie.
- Nahrávania sú vynútené ako jednorazové, ohraničené TTL a obmedzené veľkosťou; príliš veľké nahrávania sú zamietnuté.

## Poznámky

- Všeobecné kanály vyvolania HTTP, MCP a plátna zostávajú iba JSON; tento uzol je podporovaný spôsob, ako prijímať multipart nahrávania súborov.
- Nahraný súbor sa ukladá ako bežný súbor v Drive, takže akýkoľvek nadväzujúci uzol, ktorý akceptuje referenciu na súbor (prepis, odoslanie prílohy e-mailu atď.), môže použiť `$nodeLabel.file`.
