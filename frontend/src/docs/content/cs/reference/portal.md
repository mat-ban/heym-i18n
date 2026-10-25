# Portál

**Portál** zpřístupňuje workflow Heym jako veřejná chatová rozhraní. Koncoví uživatelé mohou spouštět workflow prostřednictvím URL adresy bez přihlášení do Heym.

## Co portál dělá

- **Veřejná URL adresa**: `/chat/{slug}` (např. `/chat/my-workflow`)
- **Chatové rozhraní**: Uživatelé komunikují prostřednictvím chatového rozhraní (zprávy, vstupy, odpovědi)
- **Volitelné ověření**: Pokud jsou nakonfigurováni uživatelé portálu, je vyžadováno přihlášení; v opačném případě je portál veřejný
- **Streaming**: Průběh uzlu v reálném čase během spuštění (je-li povoleno)
- **Zastavení běžících spuštění**: Uživatelé mohou zastavit probíhající spuštění portálu z chatové zápatí; aktivní spuštění workflow je zrušeno i na straně serveru
- **Nahrávání souborů**: Volitelné nahrávání souborů (text, obrázky atd.) pro každé vstupní pole
- **Předání k lidskému posouzení**: Spuštění portálu mohou zobrazit [odkazy na HITL posouzení](./human-in-the-loop.md), když agent pozastaví činnost za účelem schválení
- **Zobrazení obrázků**: Výstupy workflow obsahující obrázky (např. z generování obrázků LLM nebo snímků Playwright) se zobrazují jako miniatury v chatu. Kliknutím na libovolný obrázek otevřete zobrazení na celou obrazovku; zavřete stisknutím **Esc** nebo tlačítka zpět na zařízení

## Konfigurace workflow

| Nastavení | Popis |
|---------|-------------|
| `portal_enabled` | Povolit portál pro toto workflow |
| `portal_slug` | Slug URL adresy (např. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Použít streamované spuštění |
| `portal_file_upload_enabled` | Povolit nahrávání souborů |
| `portal_file_config` | Konfigurace souborů pro jednotlivá pole (typy, limity) |

Konfiguraci proveďte v editoru: Tlačítko **Portál** v záhlaví workflow otevře dialog nastavení portálu.

## Průběh

1. **Info**: `GET /api/portal/{slug}/info` – Vrací metadata workflow a vstupní pole (bez ověření)
2. **Přihlášení** (je-li vyžadováno): `POST /api/portal/{slug}/login` – Vrací token relace
3. **Spuštění**: `POST /api/portal/{slug}/execute` – Toto volá chatové rozhraní portálu (nebo interně jeho streamovanou variantu, je-li povolena); koncoví uživatelé komunikují prostřednictvím chatového rozhraní, nikoli přímým voláním API.
4. **Zastavení**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Vyžádáno, když uživatel během aktivního spuštění portálu stiskne **Stop**

## Limit souběhu

Když má workflow [limit souběhu](./webhooks.md#concurrency-limit-and-queued-runs) a všechny sloty jsou obsazené, zpráva na portálu čeká, až na ni přijde řada, místo aby se spustila ihned. Chat zobrazuje na řádku průběhu **Waiting in queue (2/5)**, dokud se běh nespustí, a poté odpověď jako obvykle. Běh se provede i tehdy, pokud uživatel stránku zavře. **Stop** odebere čekající běh z fronty. Když je fronta plná, zpráva selže s chybou "Concurrency queue is full". Běh, který čekal ve frontě, nepřenáší svou odpověď token po tokenu; celá odpověď se zobrazí až po jeho dokončení.

## HITL ve spuštěních portálu

Pokud workflow portálu dosáhne [uzlu Agent](../nodes/agent-node.md) s povoleným [Human-in-the-Loop](./human-in-the-loop.md), odpověď portálu zobrazí odkaz na posouzení místo prázdné odpovědi.

- Stav spuštění workflow se změní na `pending`
- Chat portálu zobrazí URL adresu posouzení
- Jakékoli uzly připojené k výstupnímu handleru `review` agenta mohou okamžitě upozornit Slack, e-mailem nebo jinými kanály
- Posuzovatel dokončí rozhodnutí na `/review/{token}` bez přihlášení
- Po posouzení workflow pokračuje z uloženého snapshotu

To umožňuje kombinovat veřejné chatové toky se soukromými kroky lidského schválení.

## Vstupní pole

Vstupní pole pocházejí z uzlů [Input](../nodes/input-node.md). API extrahuje počáteční uzly typu `textInput` a jejich `inputFields`. Spuštění používá stejný engine jako běžná spuštění; vstupy jsou předávány jako `body.inputs` a `conversation_history` pro toky s více tahy.

## Ověření a relace

- **WorkflowPortalUser**: Uživatelské jméno/heslo pro jednotlivá workflow (je-li ověření povoleno)
- **Odebrání posledního uživatele**: Při povoleném portálu způsobuje smazání posledního uživatele portálu, že je portál opět veřejný; dialog nastavení nejprve vyžaduje potvrzení
- **PortalSession**: Tokeny relace s TTL 168 hodin
- **Omezení rychlosti**: 3 neúspěšné pokusy o přihlášení → 24hodinový zákaz pro kombinaci workflow+IP
- Expirované relace jsou čištěny úlohou cron

## Uživatelské rozhraní konfigurace

Karty **WebPortalSettingsDialog**:

1. **Obecné**: Povolit portál, nastavit slug, zkopírovat URL adresu portálu
2. **Uživatelé**: Přidat/odebrat uživatele portálu (uživatelské jméno/heslo)
3. **Možnosti**: Režim streamování, nahrávání souborů, zobrazení vstupních polí

## Související

- [Proč Heym](../getting-started/why-heym.md) – Portál jako chatové rozhraní pro agenty v produkci
- [Karta Workflows](../tabs/workflows-tab.md) – Vytvářejte workflow a povolte portál
- [Human-in-the-Loop](./human-in-the-loop.md) – Veřejné stránky posouzení pro čekající výstupy agenta
- [Triggery](./triggers.md) – Portál jako vstupní bod
- [Typy uzlů](./node-types.md) – [Input](../nodes/input-node.md) pro vstupy portálu
- [Struktura workflow](./workflow-structure.md) – Uzly a hrany
