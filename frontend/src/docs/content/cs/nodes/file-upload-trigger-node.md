# Trigger nahrání souboru

Uzel **Trigger nahrání souboru** je vstupní bod s nulovým počtem vstupů pro workflow, které potřebují **velký soubor** (audio, video, archivy), jenž nelze vložit jako base64 do JSON požadavku. Vyvolání workflow vrátí předvyplněný jednorázový `curl` odkaz pro nahrání; nahráním souboru na tento odkaz se spustí běh s připojeným souborem.

Použijte jej v případě, kdy volající — včetně AI agenta, jako je Claude nebo ChatGPT běžící v sandboxu — musí předat 20MB hlasovou nahrávku nebo 75MB video workflow v Heymu.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Jak to funguje

Uzel pracuje ve dvou fázích:

1. **Vytvoření odkazu.** Když je workflow vyvoláno přes HTTP (`POST /api/workflows/{id}/execute`), jako MCP nástroj nebo prostřednictvím tlačítka **Spustit workflow** na canvasu, běh **nevykoná** tělo. Místo toho vytvoří jednorázový slot pro nahrání a vrátí:

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

2. **Nahrání + běh.** Volající spustí `curl` se svým souborem. Endpoint pro nahrání ověří slot, uloží soubor, spustí workflow **synchronně** a vrátí výstup workflow v odpovědi na nahrání. Odkaz je **jednorázový** — druhé nahrání vrátí `409`.

Na canvasu tlačítko **Spustit workflow** zobrazí vytvořený `curl` v panelu ladění s tlačítkem pro kopírování.

## Parametry

| Parametr | Typ | Výchozí | Popis |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Jak dlouho zůstane odkaz pro nahrání platný (1–10080 minut / až 7 dní). |
| `maxSizeMb` | number | `100` | Maximální přijímaná velikost souboru. Tvrdý strop je **100 MB**. |
| `allowedTypes` | string | (prázdné) | Volitelný seznam povolených MIME typů/přípon oddělených čárkou, např. `audio/*, .wav`. Prázdná hodnota povoluje jakýkoli typ. |

## Výstupní pole

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.file.id` | UUID uloženého souboru (soubor v Drive). |
| `$nodeLabel.file.name` | Původní název souboru. |
| `$nodeLabel.file.mime` | Zjištěný typ obsahu. |
| `$nodeLabel.file.size` | Velikost v bajtech. |
| `$nodeLabel.file.download_url` | Autentizovaná URL pro stažení pro navazující uzly. |
| `$nodeLabel.uploaded_at` | ISO časové razítko nahrání. |

## Příklad

Workflow pro přepis:

```
Trigger nahrání souboru ("audio")  →  Přepis ($audio.file)  →  Shrnutí LLM  →  Výstup
```

1. Agent zavolá MCP nástroj workflow a obdrží `curl`.
2. Agent spustí `curl` s nahrávkou ze svého sandboxu.
3. Nahrání spustí workflow a odpověď na `curl` obsahuje shrnutí přepisu.

## Zabezpečení

- URL pro nahrání obsahuje token s vysokou entropií — token **je** oprávněním, takže sandboxovaný agent nepotřebuje přihlašovací údaje k Heymu pro nahrání. Na serveru je uložen pouze hash tokenu.
- Vytvoření odkazu vyžaduje běžnou autentizaci workflow, takže odkazy pro nahrání mohou vytvářet pouze oprávnění volající.
- Každé vytvoření odkazu a každý pokus o nahrání (přijatý nebo odmítnutý — vypršelý, opakovaně použitý, příliš velký, nepovolený typ, neznámý token) je zapsán do auditní stopy pouze pro přidávání.
- Nahrání jsou vynucena jako jednorázová, omezená TTL a omezená velikostí; příliš velká nahrání jsou odmítnuta.

## Poznámky

- Obecné kanály pro vyvolání přes HTTP, MCP a canvas zůstávají pouze JSON; tento uzel je podporovaným způsobem, jak přijímat multipart nahrání souborů.
- Nahraný soubor je uložen jako běžný soubor v Drive, takže jakýkoli navazující uzel, který přijímá referenci na soubor (přepis, odeslání přílohy e-mailem atd.), může využít `$nodeLabel.file`.
